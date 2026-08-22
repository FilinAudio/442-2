#!/usr/bin/env node
import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ORIGIN      = 'https://filinlabs.com';
const OUT         = 'generated';
const OVERRIDES   = 'overrides';
const CONCURRENCY = 4;

const argv = process.argv.slice(2);
const DRY  = argv.includes('--dry');
const ONLY = (() => { const i = argv.indexOf('--only'); return i >= 0 ? argv[i + 1] : null; })();

const norm = v => String(v ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
const num  = v => { const n = Number(String(v ?? '').replace(/[^\d.]/g, '')); return Number.isFinite(n) ? n : 0; };

function slugOf(url) {
  return new URL(url, ORIGIN).pathname.replace(/^\/+|\/+$/g, '').toLowerCase();
}

async function get(url) {
  const r = await fetch(url, { headers: { 'user-agent': 'FilinProfileExtractor/1.0' } });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
  return r.text();
}

async function pool(items, worker) {
  const out = [];
  let i = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (i < items.length) {
      const idx = i++;
      try { out[idx] = await worker(items[idx], idx); }
      catch (e) { out[idx] = { error: String(e.message || e), url: items[idx] }; }
    }
  }));
  return out;
}

async function urlList() {
  try {
    const manual = await fs.readFile('tools/product-urls.txt', 'utf8');
    const urls = manual.split('\n').map(s => s.trim()).filter(s => s && !s.startsWith('#'));
    if (urls.length) { console.log(`Список из tools/product-urls.txt: ${urls.length}`); return urls; }
  } catch {}

  console.log('Читаю sitemap.xml…');
  const seen = new Set();
  const queue = [`${ORIGIN}/sitemap.xml`];

  while (queue.length) {
    const xml = await get(queue.shift());
    const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map(m => m[1]);
    for (const loc of locs) {
      if (/\.xml($|\?)/i.test(loc)) queue.push(loc);
      else if (loc.startsWith(ORIGIN)) seen.add(loc.split('#')[0]);
    }
  }
  console.log(`В sitemap: ${seen.size} URL`);
  return [...seen];
}

const BAD_URL = [
  /\/-\/(resize|empty|format|preview)\//i,
  /^https?:\/\/thb\.tildacdn\.com\//i,
  /\.svg(\?|$)/i,
  /(favicon|tildacopy|logo|icon[-_]|spacer|blank\.gif|pixel)/i
];

function usableImage(u) {
  if (!u) return false;
  if (!/^https:\/\/static\.tildacdn\.com\//i.test(u)) return false;
  if (!/\.(jpe?g|png|webp|avif)(\?|$)/i.test(u)) return false;
  return !BAD_URL.some(re => re.test(u));
}

function absolute(raw) {
  const s = String(raw || '').trim().split(/\s+/)[0];
  if (!s) return '';
  try { return new URL(s, ORIGIN).href; } catch { return ''; }
}

function collectImages($, nodes) {
  const seen = new Set(), out = [];
  const add = raw => {
    const u = absolute(raw);
    if (!usableImage(u)) return;
    const key = u.split('?')[0];
    if (seen.has(key)) return;
    seen.add(key);
    out.push(u);
  };
  for (const node of nodes) {
    if (!node) continue;
    $(node).find('img,[data-original],[data-content-cover-bg],[style*="background"]').each((_, el) => {
      const $el = $(el);
      add($el.attr('data-original'));
      add($el.attr('data-content-cover-bg'));
      const style = $el.attr('style') || '';
      const m = /url\((['"]?)([^'")]+)\1\)/i.exec(style);
      if (m) add(m[2]);
      if (el.tagName === 'img') add($el.attr('src'));
    });
  }
  return out;
}

const LABELS = [
  ['Category & Budget Tier', /(?:CATHEGORY|CATEGORY)\s*&\s*BUDGET\s*TIER/i],
  ['Tags & Features',        /TAGS?\s*&\s*FEATURES/i],
  ['Sonic Signature',        /SONIC\s*SIGNATURE/i],
  ["Curator's Choice",       /CURATOR[\u2019']?S\s*CHOICE/i],
  ['High Technologies',      /HIGH\s*TECHNOLOGIES/i],
  ['Synergy Match',          /SYNERGY\s*MATCH/i],
  ['Genres Accord',          /GENRES?\s*ACCORD/i]
];

function parseCuration(text) {
  text = norm(text);
  const hits = [];
  for (const [title, re] of LABELS) {
    const m = re.exec(text);
    if (m) hits.push({ title, index: m.index, len: m[0].length });
  }
  if (hits.length < 3) return null;
  hits.sort((a, b) => a.index - b.index);

  const out = [];
  for (let i = 0; i < hits.length; i++) {
    const start = hits[i].index + hits[i].len;
    const end = i + 1 < hits.length ? hits[i + 1].index : text.length;
    const body = text.slice(start, end).trim().replace(/^[^\w(#]+/, '');
    if (body) out.push({ title: hits[i].title, html: `<p>${body}</p>` });
  }
  return out.length >= 3 ? out : null;
}

function extract(html, url) {
  const $ = cheerio.load(html);
  const slug = slugOf(url);

  const records = $('#allrecords').children('[id^="rec"]').toArray();
  if (!records.length) return null;

  const isProductRoot = el =>
    $(el).find('.js-product-btn').length &&
    ($(el).find('.js-product-price').length || $(el).find('.js-product-name').length);

  const productIndex = records.findIndex(r => $(r).find('.js-product').filter((_, p) => isProductRoot(p)).length);
  if (productIndex < 0) return null;

  const productRec   = records[productIndex];
  const productRoot = $(productRec).find('.js-product').filter((_, p) => isProductRoot(p)).first();

  const heroIndex = records.findIndex(r => $(r).find('.t-cover').length);
  const heroRec   = heroIndex >= 0 ? records[heroIndex] : null;
  const zoneStart = heroIndex >= 0 ? heroIndex + 1 : 0;
  const zone      = zoneStart < productIndex ? records.slice(zoneStart, productIndex) : [];

  const rawName = norm($(productRoot).find('.js-product-name').first().text())
    .replace(/\s*\(Standard Edition\)\s*$/i, '')
    .replace(/\s*\[[^\]]*\]\s*$/, '');

  const price = num($(productRoot).find('.js-product-price').first().text());

  const heroH1    = heroRec ? norm($(heroRec).find('.t184__title, h1').first().text()) : '';
  const heroDescr = heroRec ? norm($(heroRec).find('.t184__descr').first().text())     : '';
  const heroBg    = heroRec
    ? absolute($(heroRec).find('.t-cover__carrier').first().attr('data-content-cover-bg'))
    : '';

  let curation = null, curatorText = '', curatorId = '', overviewHtml = '', overviewTitle = '';

  for (const rec of zone) {
    const text = norm($(rec).text());

    if (!curation) {
      const parsed = parseCuration(text);
      if (parsed) { curation = parsed; continue; }
    }

    if (!curatorText && /^Handcrafted by/i.test(text) && text.length < 300) {
      curatorText = text;
      curatorId = $(rec).attr('id') || '';
      continue;
    }

    if (!overviewTitle) {
      const t = norm($(rec).find('.label-name, h2').first().text());
      if (t && t.length < 180) overviewTitle = t;
    }

    $(rec).find('p').each((_, p) => {
      const inner = norm($(p).html() || '');
      if (inner) overviewHtml += `<p>${inner}</p>`;
    });
  }

  const images = collectImages($, [heroRec, ...zone, productRec]);
  const hideIds = [...zone, productRec]
    .map(r => $(r).attr('id'))
    .filter(id => id && id !== curatorId);

  const name = rawName || heroH1 || slug;

  return {
    slug,
    url,
    hideIds,
    warnings: [
      heroIndex < 0            ? 'нет обложки (.t-cover)' : null,
      !images.length           ? 'не найдено картинок' : null,
      !heroBg                  ? 'нет фона обложки' : null,
      !curation                ? 'нет 7 карточек курации' : null,
      !curatorText             ? 'нет строки куратора' : null,
      !price                   ? 'цена не определена' : null,
    ].filter(Boolean),

    profile: {
      schemaVersion: 2,
      slug,
      id: slug.replace(/_/g, '-'),
      currency: 'USD',

      hero: {
        staticH1: heroH1 || name,
        description: heroDescr,
        background: heroBg || images[0] || ''
      },

      curator: curatorText,

      overview: {
        title: overviewTitle || name,
        html: overviewHtml,
        galleryImages: images
      },

      curation: curation || [],

      commerce: {
        basePrice: price,
        displayName: name,
        cartName: `${name} (Standard Edition)`,
        stickyTitle: name,
      },

      golden: {
        backLabel: "Back to the Filin's nest",
        backHref: '/',
        mobileHeroHeight: 860,
        resultLabel: 'Ultimate Synergy'
      },

      reviewsKey: slug
    }
  };
}

function deepMerge(base, patch) {
  if (Array.isArray(patch) || patch === null || typeof patch !== 'object') return patch;
  const out = { ...base };
  for (const k of Object.keys(patch)) {
    out[k] = k in base && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])
      ? deepMerge(base[k], patch[k])
      : patch[k];
  }
  return out;
}

async function applyOverride(result) {
  try {
    const raw = await fs.readFile(path.join(OVERRIDES, `${result.slug}.json`), 'utf8');
    result.profile = deepMerge(result.profile, JSON.parse(raw));
    result.overridden = true;
  } catch {}
  return result;
}

async function write(results) {
  await fs.mkdir(path.join(OUT, 'profiles'), { recursive: true });

  for (const r of results) {
    const body =
      `/* СГЕНЕРИРОВАНО tools/extract-profiles.mjs */\n` +
      `(window.FilinProfiles=window.FilinProfiles||{})` +
      `[${JSON.stringify(r.slug)}]=${JSON.stringify(r.profile)};\n`;
    await fs.writeFile(path.join(OUT, 'profiles', `${r.slug}.js`), body);
  }

  const ids = [...new Set(results.flatMap(r => r.hideIds))].sort();
  const css =
    `/* СГЕНЕРИРОВАНО */\n` +
    `html:not(.filin-legacy-restore) :is(\n  ${ids.map(i => '#' + i).join(',\n  ')}\n){\n` +
    `  display:none!important;\n}\n`;
  await fs.writeFile(path.join(OUT, 'legacy-hide.css'), css);

  const routes =
    `/* СГЕНЕРИРОВАНО */\n` +
    `(window.FilinProductLoader&&window.FilinProductLoader.boot||function(x){window.__FILIN_ROUTES__=x})(\n` +
    JSON.stringify({ slugs: results.map(r => r.slug).sort() }, null, 1) + `);\n`;
  await fs.writeFile(path.join(OUT, 'filin-routes.js'), routes);

  await fs.writeFile(path.join(OUT, 'report.json'), JSON.stringify(
    results.map(({ slug, url, warnings, overridden, profile }) => ({
      slug, url, overridden: !!overridden, warnings,
      price: profile.commerce.basePrice,
      images: profile.overview.galleryImages.length,
      curation: profile.curation.length
    })), null, 2));

  console.log(`\nЗаписано: ${results.length} профилей, ${ids.length} id в legacy-hide.css`);
}

const urls = (await urlList()).filter(u => !ONLY || slugOf(u) === ONLY);
console.log(`Проверяю ${urls.length} страниц…\n`);

const raw = await pool(urls, async url => {
  const html = await get(url);
  const r = extract(html, url);
  return r ? await applyOverride(r) : null;
});

const results = raw.filter(r => r && !r.error);
const failed  = raw.filter(r => r && r.error);

for (const r of results) {
  const flag = r.warnings.length ? '!' : ' ';
  console.log(`${flag} ${r.slug.padEnd(50)} $${String(r.profile.commerce.basePrice).padEnd(6)} img:${String(r.profile.overview.galleryImages.length).padEnd(2)} cur:${String(r.profile.curation.length)}`);
  for (const w of r.warnings) console.log(`      └ ${w}`);
}

for (const f of failed) console.log(`✗ ${f.url.split('/').pop() || '/'} — ${f.error}`);

console.log(`\nКарточек товара: ${results.length}. Ошибок загрузки: ${failed.length}.`);

if (DRY) console.log('\n--dry: ничего не записано.');
else if (results.length) await write(results);
