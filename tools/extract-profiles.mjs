#!/usr/bin/env node
/* FILIN LABS — BUILD-TIME PROFILE EXTRACTOR v1.4
   Zero-блок держит кадры в style="background-image:url(...)" на tn-atom,
   а не в data-original. Поэтому кроме атрибутов прочёсываем весь HTML
   записи регуляркой — так ловятся и слайдеры, и Zero-блоки, и srcset. */

import fs from 'node:fs/promises';
import path from 'node:path';
import * as cheerio from 'cheerio';

const ORIGIN = 'https://filinlabs.com';
const OUT = 'generated';
const OVERRIDES = 'overrides';
const CONCURRENCY = 4;

const argv = process.argv.slice(2);
const DRY = argv.includes('--dry');
const ONLY = (() => { const i = argv.indexOf('--only'); return i >= 0 ? argv[i + 1] : null; })();

const norm = v => String(v ?? '').replace(/\u00a0/g, ' ').replace(/\s+/g, ' ').trim();
const num = v => { const n = Number(String(v ?? '').replace(/[^\d.]/g, '')); return Number.isFinite(n) ? n : 0; };
const slugOf = url => new URL(url, ORIGIN).pathname.replace(/^\/+|\/+$/g, '').toLowerCase();

async function get(url) {
  const r = await fetch(url, { headers: { 'user-agent': 'FilinProfileExtractor/1.3' } });
  if (!r.ok) throw new Error(`HTTP ${r.status} ${url}`);
  return r.text();
}

async function pool(items, worker) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: CONCURRENCY }, async () => {
    while (i < items.length) {
      const idx = i++;
      try { out[idx] = await worker(items[idx]); }
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
  const seen = new Set(); const queue = [`${ORIGIN}/sitemap.xml`];
  while (queue.length) {
    const xml = await get(queue.shift());
    for (const m of xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)) {
      const loc = m[1];
      if (/\.xml($|\?)/i.test(loc)) queue.push(loc);
      else if (loc.startsWith(ORIGIN)) seen.add(loc.split('#')[0]);
    }
  }
  console.log(`В sitemap: ${seen.size} URL`);
  return [...seen];
}

/* ---------- текст ------------------------------------------- */

/* textContent склеивает соседние блоки: "LoudspeakersUnlimited Edition".
   Границы блочных тегов заменяем пробелом до извлечения текста. */
function blockText($, el) {
  if (!el || !el.length) return '';
  const spaced = (el.html() || '')
    .replace(/<\/?(?:br|p|div|h[1-6]|li|tr|td|section|article)[^>]*>/gi, ' ');
  return norm(cheerio.load(`<div>${spaced}</div>`)('div').text());
}

/* ---------- картинки ---------------------------------------- */

const BAD = [
  /\/-\/(resize|empty|format|preview|paint)\//i,
  /^https?:\/\/thb\.tildacdn\.com\//i,
  /\.svg(\?|$)/i,
  /\/lib\/icons\//i,
  /(favicon|tildacopy|logo|icon[-_]|spacer|blank\.gif|pixel)/i
];

const usable = u =>
  !!u &&
  /^https:\/\/static\.tildacdn\.com\//i.test(u) &&
  /\.(jpe?g|png|webp|avif)(\?|$)/i.test(u) &&
  !BAD.some(re => re.test(u));

function absolute(raw) {
  const s = String(raw || '').replace(/\\\//g, '/').trim().split(/\s+/)[0];
  if (!s) return '';
  try { return new URL(s, ORIGIN).href; } catch { return ''; }
}

const IMG_RE = /https:\/\/static\.tildacdn\.com\/[^"'\\\s)>]+?\.(?:jpe?g|png|webp|avif)/gi;

function scan(text, into, seen) {
  const clean = String(text || '').replace(/\\\//g, '/').replace(/\\u002f/gi, '/');
  let m; IMG_RE.lastIndex = 0;
  while ((m = IMG_RE.exec(clean))) {
    const u = absolute(m[0]);
    if (!usable(u)) continue;
    const key = u.split('?')[0];
    if (seen.has(key)) continue;
    seen.add(key); into.push(u);
  }
}

/* ---------- курация ----------------------------------------- */

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
    const body = norm(text.slice(start, end)).replace(/^[^\w(#]+/, '');
    if (body) out.push({ title: hits[i].title, html: `<p>${body}</p>` });
  }
  return out.length >= 3 ? out : null;
}

/* ---------- разбор страницы --------------------------------- */

function extract(html, url, $) {
  const slug = slugOf(url);
  const records = $('#allrecords').children('[id^="rec"]').toArray();
  if (!records.length) return null;

  const isRoot = el =>
    $(el).find('.js-product-btn').length &&
    ($(el).find('.js-product-price').length || $(el).find('.js-product-name').length);

  const productIndex = records.findIndex(r => $(r).find('.js-product').filter((_, p) => isRoot(p)).length);
  if (productIndex < 0) return null;

  const productRec = records[productIndex];
  const productRoot = $(productRec).find('.js-product').filter((_, p) => isRoot(p)).first();

  const heroIndex = records.findIndex(r => $(r).find('.t-cover').length);
  const heroRec = heroIndex >= 0 ? records[heroIndex] : null;
  const zoneStart = heroIndex >= 0 ? heroIndex + 1 : 0;
  const zone = zoneStart < productIndex ? records.slice(zoneStart, productIndex) : [];

  const rawName = norm($(productRoot).find('.js-product-name').first().text())
    .replace(/\s*\(Standard Edition\)\s*$/i, '')
    .replace(/\s*\[[^\]]*\]\s*$/, '');
  const price = num($(productRoot).find('.js-product-price').first().text());

  const heroH1 = heroRec ? blockText($, $(heroRec).find('.t184__title, h1').first()) : '';
  const heroDescr = heroRec ? blockText($, $(heroRec).find('.t184__descr').first()) : '';
  const heroBg = heroRec
    ? absolute($(heroRec).find('.t-cover__carrier').first().attr('data-content-cover-bg'))
    : '';

  let curation = null, curatorText = '', curatorId = '', overviewHtml = '', overviewTitle = '';

  for (const rec of zone) {
    const text = blockText($, $(rec));
    if (!curation) {
      const parsed = parseCuration(text);
      if (parsed) { curation = parsed; continue; }
    }
    if (!curatorText && /^Handcrafted by/i.test(text) && text.length < 300) {
      curatorText = text; curatorId = $(rec).attr('id') || ''; continue;
    }
    if (!overviewTitle) {
      const t = blockText($, $(rec).find('.label-name, h2').first());
      if (t && t.length < 180) overviewTitle = t;
    }
    $(rec).find('p').each((_, p) => {
      const inner = norm($(p).html() || '');
      if (inner) overviewHtml += `<p>${inner}</p>`;
    });
  }

  const seen = new Set(), images = [];
  for (const node of [heroRec, ...zone, productRec]) {
    if (!node) continue;

    /* Сначала data-original: там полноразмерный файл, тогда как в src
       на этот момент лежит плейсхолдер шириной 20 пикселей. */
    $(node).find('[data-original],[data-content-cover-bg]').each((_, el) => {
      for (const a of ['data-original', 'data-content-cover-bg']) {
        const u = absolute($(el).attr(a));
        if (!usable(u)) continue;
        const key = u.split('?')[0];
        if (seen.has(key)) continue;
        seen.add(key); images.push(u);
      }
    });

    /* Затем весь HTML записи: Zero-блок держит кадры в inline-стилях,
       слайдеры — в атрибутах. Регулярка забирает и то, и другое. */
    scan($.html(node), images, seen);
  }
  const heroKey = heroBg.split('?')[0];
  const gallery = images.filter(u => u.split('?')[0] !== heroKey).slice(0, 14);

  const name = rawName || heroH1 || slug;

  return {
    slug, url,
    hideIds: [...zone, productRec].map(r => $(r).attr('id')).filter(id => id && id !== curatorId),
    warnings: [
      heroIndex < 0 ? 'нет обложки (.t-cover)' : null,
      !gallery.length ? 'не найдено картинок' : null,
      !heroBg ? 'нет фона обложки' : null,
      !curation ? 'нет 7 карточек курации' : null,
      !curatorText ? 'нет строки куратора' : null,
      !price ? 'цена не определена' : null
    ].filter(Boolean),
    profile: {
      schemaVersion: 2, slug, id: slug.replace(/_/g, '-'), currency: 'USD',
      hero: { staticH1: heroH1 || name, description: heroDescr, background: heroBg || gallery[0] || '' },
      curator: curatorText,
      overview: { title: overviewTitle || name, html: overviewHtml, galleryImages: gallery },
      curation: curation || [],
      commerce: {
        basePrice: price, displayName: name,
        cartName: `${name} (Standard Edition)`, stickyTitle: name
      },
      golden: {
        backLabel: "Back to the Filin's nest", backHref: '/',
        mobileHeroHeight: 860, resultLabel: 'Ultimate Synergy'
      },
      reviewsKey: slug
    }
  };
}

/* ---------- ручные правки ----------------------------------- */

function deepMerge(base, patch) {
  if (Array.isArray(patch) || patch === null || typeof patch !== 'object') return patch;
  const out = { ...base };
  for (const k of Object.keys(patch)) {
    out[k] = k in base && base[k] && typeof base[k] === 'object' && !Array.isArray(base[k])
      ? deepMerge(base[k], patch[k]) : patch[k];
  }
  return out;
}

async function applyOverride(r) {
  try {
    const raw = await fs.readFile(path.join(OVERRIDES, `${r.slug}.json`), 'utf8');
    r.profile = deepMerge(r.profile, JSON.parse(raw));
    r.overridden = true;
  } catch {}
  return r;
}

/* ---------- запись ------------------------------------------ */

async function write(results) {
  await fs.rm(path.join(OUT, 'profiles'), { recursive: true, force: true });
  await fs.mkdir(path.join(OUT, 'profiles'), { recursive: true });

  for (const r of results) {
    await fs.writeFile(path.join(OUT, 'profiles', `${r.slug}.js`),
      `/* СГЕНЕРИРОВАНО tools/extract-profiles.mjs */\n` +
      `(window.FilinProfiles=window.FilinProfiles||{})` +
      `[${JSON.stringify(r.slug)}]=${JSON.stringify(r.profile)};\n`);
  }

  const ids = [...new Set(results.flatMap(r => r.hideIds))].sort();
  await fs.writeFile(path.join(OUT, 'legacy-hide.css'),
    `/* СГЕНЕРИРОВАНО. ${results.length} карточек. */\n` +
    `html:not(.filin-legacy-restore) :is(\n  ${ids.map(i => '#' + i).join(',\n  ')}\n){\n  display:none!important;\n}\n`);

  await fs.writeFile(path.join(OUT, 'filin-routes.js'),
    `/* СГЕНЕРИРОВАНО. */\n` +
    `(window.FilinProductLoader&&window.FilinProductLoader.boot||function(x){window.__FILIN_ROUTES__=x})(\n` +
    JSON.stringify({ slugs: results.map(r => r.slug).sort() }, null, 1) + `);\n`);

  await fs.writeFile(path.join(OUT, 'report.json'), JSON.stringify(
    results.map(({ slug, url, warnings, overridden, profile }) => ({
      slug, url, overridden: !!overridden, warnings,
      price: profile.commerce.basePrice,
      images: profile.overview.galleryImages.length,
      curation: profile.curation.length
    })), null, 2));

  console.log(`\nЗаписано: ${results.length} профилей, ${ids.length} id в legacy-hide.css`);
}

/* ---------- main -------------------------------------------- */

const urls = (await urlList()).filter(u => !ONLY || slugOf(u) === ONLY);
console.log(`Проверяю ${urls.length} страниц…\n`);

const raw = await pool(urls, async url => {
  const html = await get(url);
  if (!/js-product-btn/.test(html)) return null;
  const $ = cheerio.load(html);
  const r = extract(html, url, $);
  return r ? await applyOverride(r) : null;
});

const results = raw.filter(r => r && !r.error);
const failed = raw.filter(r => r && r.error);

let noImg = 0;
for (const r of results) {
  if (!r.profile.overview.galleryImages.length) noImg++;
  console.log(`${r.warnings.length ? '!' : ' '} ${r.slug.padEnd(50)} ` +
    `$${String(r.profile.commerce.basePrice).padEnd(6)} ` +
    `img:${String(r.profile.overview.galleryImages.length).padEnd(3)} ` +
    `cur:${r.profile.curation.length}`);
  for (const w of r.warnings) console.log(`      └ ${w}`);
}
for (const f of failed) console.log(`x ${f.url} — ${f.error}`);

console.log(`\nКарточек: ${results.length}. Без картинок: ${noImg}. Ошибок: ${failed.length}.`);
if (DRY) console.log('\n--dry: ничего не записано.');
else if (results.length) await write(results);
