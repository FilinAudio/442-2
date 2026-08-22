#!/bin/bash
#
# FILIN LABS — ПОЛНАЯ МИГРАЦИЯ НА BUILD-TIME PROFILES
# Один скрипт, всё под ключ.
#
# Использование:
#    bash deploy-full.sh                # обычный запуск
#    bash deploy-full.sh --dry          # только отчёт, без push
#    bash deploy-full.sh --only slug    # один товар
#

set -e

GITHUB_TOKEN="${GITHUB_TOKEN:-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}"
REPO_URL="https://github.com/FilinAudio/442-2.git"
WORK_DIR="/tmp/filin-deploy-$$"
DRY="${DRY:-}"

if [[ "$1" == "--dry" ]]; then DRY=1; fi
if [[ "$1" == "--only" ]]; then ONLY_SLUG="$2"; fi

cleanup() { rm -rf "$WORK_DIR"; }
trap cleanup EXIT

echo "════════════════════════════════════════════════════════════════"
echo "  FILIN LABS — FULL BUILD-TIME PROFILE MIGRATION"
echo "════════════════════════════════════════════════════════════════"
echo ""

# ===== 1. CLONE =====
echo "[1/7] Клонирую репо..."
mkdir -p "$WORK_DIR"
cd "$WORK_DIR"
git clone --depth 1 --filter=blob:none "https://${GITHUB_TOKEN}@github.com/FilinAudio/442-2.git" repo
cd repo

# ===== 2. GIT CONFIG =====
echo "[2/7] Настраиваю git..."
git config user.email "claude@anthropic.com"
git config user.name "Claude Build Agent"

# ===== 3. FILE PREPARATION =====
echo "[3/7] Добавляю файлы..."
mkdir -p tools
mkdir -p generated/profiles

# tools/extract-profiles.mjs — полный файл
cat > tools/extract-profiles.mjs << 'EXTRACTEOF'
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
EXTRACTEOF

chmod +x tools/extract-profiles.mjs

# filin-product-loader-v1.js
cat > filin-product-loader-v1.js << 'LOADEREOF'
(function(){if(window.FilinProductLoader)return;var curScript=document.currentScript||(function(){var s=document.getElementsByTagName('script');for(var i=0;i<s.length;i++){if(s[i].src&&/filin-product-loader-v1\.js/.test(s[i].src))return s[i]}})();var TAG=(curScript&&(curScript.src.match(/@([^/]+)/)||[])[1])||'v1.0.3';var CDN='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@'+TAG+'/',STACK=['filin-rich-product-catalog-v2-runtime.js','filin-master-product-v3-3-2-golden-standard-runtime.js'],COMMERCE='filin-master-product-v3-clean-commerce-v2.js',WISHLIST='filin-master-product-v3-wishlist-bridge-v4.js',FALLBACK_MS=5000,DEBUG=/[?&]filin_debug=1/.test(location.search);function log(){if(!DEBUG)return;console.log.apply(console,['[Filin Loader]'].concat([].slice.call(arguments)))}function slug(){return(location.pathname||'/').replace(/^\/+|\/+$/g,'').toLowerCase()}function loaded(src){for(var i=0;i<document.scripts.length;i++){if(document.scripts[i].src&&document.scripts[i].src.split('?')[0]===src.split('?')[0])return true}return false}function load(name){var src=/^https?:/.test(name)?name:CDN+name;return new Promise(function(resolve,reject){if(loaded(src))return resolve();var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){log('loaded',name);resolve()};s.onerror=function(){reject(new Error('failed: '+name))};document.head.appendChild(s)})}function chain(list){return list.reduce(function(p,n){return p.then(function(){return load(n)})},Promise.resolve())}function onLoad(fn){if(document.readyState==='complete')fn();else window.addEventListener('load',fn,{once:true})}function restoreLegacy(why){if(document.getElementById('filin-master-product-v3'))return;document.documentElement.classList.add('filin-legacy-restore');console.warn('[Filin Loader] карточка не собрана ('+why+') — легаси-блоки возвращены')}function boot(routes){var s=slug(),slugs=(routes&&routes.slugs)||[];if(slugs.indexOf(s)<0){log('не карточка товара:',s||'/');return}if(!document.getElementById('product-data')){var seed=document.createElement('script');seed.type='application/json';seed.id='product-data';seed.textContent=JSON.stringify({schemaVersion:2,slug:s});document.head.appendChild(seed)}document.documentElement.setAttribute('data-filin-product',s);var profileReady=load('generated/profiles/'+s+'.js');Promise.all([profileReady,chain(STACK)]).then(function(){var api=window.FilinMasterProductV3,profile=(window.FilinProfiles||{})[s];if(!api||!api.profiles)throw new Error('ядро не инициализировалось');if(!profile)throw new Error('профиль пуст');var node=document.getElementById('product-data');if(node){node.textContent=JSON.stringify({schemaVersion:2,slug:s,id:profile.id,name:profile.commerce.displayName,price:profile.commerce.basePrice,currency:'USD',commerce:{regularPrice:profile.commerce.basePrice,cartName:profile.commerce.cartName,stickyTitle:profile.commerce.stickyTitle}})}api.profiles[s]=profile;api.apply();document.documentElement.setAttribute('data-filin-ready','1');try{document.dispatchEvent(new CustomEvent('filin:product:v2:ready',{detail:{slug:s}}))}catch(e){}load(COMMERCE);onLoad(function(){setTimeout(function(){load(WISHLIST)},300)});log('готово:',s,profile.overview.galleryImages.length+' изображений')}).catch(function(err){document.documentElement.setAttribute('data-filin-ready','error');restoreLegacy(err.message)});setTimeout(function(){restoreLegacy('таймаут '+FALLBACK_MS+' мс')},FALLBACK_MS)}window.FilinProductLoader={version:TAG.replace(/^v/,''),boot:boot};if(window.__FILIN_ROUTES__)boot(window.__FILIN_ROUTES__)})();
LOADEREOF

# HEAD-snippet.html
cat > HEAD-snippet.html << 'HEADEOF'
<!-- Filin Labs Product Cards Bootstrap -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/FilinAudio/442-2@v1.0.3/generated/legacy-hide.css">
<script defer src="https://cdn.jsdelivr.net/gh/FilinAudio/442-2@v1.0.3/filin-product-loader-v1.js"></script>
<script defer src="https://cdn.jsdelivr.net/gh/FilinAudio/442-2@v1.0.3/generated/filin-routes.js"></script>
HEADEOF

# ===== 4. NPM INSTALL =====
echo "[4/7] Установляю зависимости..."
npm init -y >/dev/null 2>&1
npm install cheerio >/dev/null 2>&1

# ===== 5. EXTRACT DRY =====
echo "[5/7] Запускаю экстрактор (--dry)..."
node tools/extract-profiles.mjs --dry 2>&1 | tail -20

# ===== 6. EXTRACT REAL =====
echo ""
echo "[6/7] Запускаю экстрактор (реальная генерация)..."
node tools/extract-profiles.mjs 2>&1 | tail -20

# ===== 7. COMMIT & PUSH =====
if [[ -z "$DRY" ]]; then
  echo ""
  echo "[7/7] Коммитю, тагирую и пушу..."
  git add tools/ generated/ filin-product-loader-v1.js HEAD-snippet.html
  git commit -m "Build: Extract product profiles - Golden Standard migration" --quiet
  git tag -f v1.0.3
  git push origin main --force --quiet 2>&1 | grep -v "^To https"
  git push origin v1.0.3 --force --quiet 2>&1 | grep -v "^To https"
  echo "✓ Push завершён"
else
  echo ""
  echo "[7/7] --dry: ничего не пушу"
fi

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "✓ ГОТОВО"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "Следующий шаг: подключить HEAD-snippet.html в Tilda"
echo ""
echo "  1. Настройки сайта → Ещё → HTML-код внутрь HEAD"
echo "  2. Удалить: universal-auto-bridge-v1.js и GOLDEN PREBOOT блок"
echo "  3. Добавить:"
echo ""
cat HEAD-snippet.html | sed 's/^/     /'
echo ""
echo "Затем удалить со ВСЕХ страниц товаров:"
echo "  - T123-блоки с <script src=...filin-master-product-v3...>"
echo "  - Таймер 6500 мс (fp-v7-ready)"
echo "  - Всё, что связано с golden-speakers-batch"
echo ""
