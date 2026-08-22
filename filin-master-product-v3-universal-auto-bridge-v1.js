/* ============================================================
   FILIN LABS — UNIVERSAL LEGACY → GOLDEN AUTO-BRIDGE V2
   Один файл, ставится в Site HEAD ОДИН РАЗ. Правки страниц не нужны.

   V2 добавляет к V1:
   - позиционное скрытие ВСЕХ legacy-записей между hero-обложкой
     и .js-product (а не только "непосредственно предыдущей")
   - автопарсинг блока из 7 категорий (Category & Budget Tier,
     Tags & Features, Sonic Signature, Curator's Choice,
     High Technologies, Synergy Match, Genres Accord) в золотые
     карточки курации, если такой блок найден в legacy-зоне
   - сбор описания (overview) из ВСЕХ параграфов legacy-зоны,
     а не только одного соседнего блока
   - куратора ("Handcrafted by...") не трогает: если ядро само
     нашло и оформило такую строку внутри legacy-зоны — эта
     конкретная запись НЕ прячется
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_UNIVERSAL_AUTO_BRIDGE_V2__) return;
  window.__FILIN_UNIVERSAL_AUTO_BRIDGE_V2__ = true;

  var STACK = [
    'https://cdn.jsdelivr.net/gh/FilinAudio/442-2@f78a192778064f62e6c6bf45d5c338d9826d185d/filin-rich-product-catalog-v2-runtime.js',
    'https://cdn.jsdelivr.net/gh/FilinAudio/442-2@e4de1ae708daa2966411d764f3d803af5b59ec17/filin-master-product-v3-3-2-golden-standard-runtime.js'
  ];
  var CLEAN_COMMERCE = 'https://cdn.jsdelivr.net/gh/FilinAudio/442-2@44c895edcbef44d44014e494781c0046bd969b67/filin-master-product-v3-clean-commerce-v2.js';
  var WISHLIST_BRIDGE = 'https://cdn.jsdelivr.net/gh/FilinAudio/442-2@3d06611f1c1daff094db45a7659a13a6f3d31d88/filin-master-product-v3-wishlist-bridge-v4.js';

  /* Точечные ручные доработки для конкретных товаров (опционально).
     Ключ — slug. Перекрывают автоматически найденное. */
  var OVERRIDES = {
    // 'demograf_clio_speakers': {
    //   curator: 'Handcrafted by Demograf Audio Equipment...',
    //   curation: [ {title:'...', html:'...'}, ... ]
    // }
  };

  function norm(v){ return String(v==null?'':v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim(); }
  function num(v){ var n = Number(String(v||'').replace(/[^\d.]/g,'')); return Number.isFinite(n) ? n : 0; }
  function slug(){ return norm(location.pathname).replace(/^\/+|\/+$/g,''); }

  /* ------------------------------------------------------------
     ДЕТЕКТОР: это товарная (legacy) страница?
     ------------------------------------------------------------ */
  function legacyProductRoot(){
    var candidates = document.querySelectorAll('.js-product');
    for(var i=0;i<candidates.length;i++){
      var el = candidates[i];
      if(
        el.querySelector('.js-product-btn') &&
        (el.querySelector('.js-product-price') || el.querySelector('.js-product-name'))
      ){
        return el;
      }
    }
    return null;
  }

  function alreadyMigrated(){
    return !!document.getElementById('product-data');
  }

  /* ------------------------------------------------------------
     ПОЗИЦИОННАЯ LEGACY-ЗОНА: всё между hero и .js-product
     ------------------------------------------------------------ */
  function allRecordsInOrder(){
    return Array.prototype.slice.call(document.querySelectorAll('#allrecords .t-rec'));
  }

  function findHeroIndex(records){
    for(var i=0;i<records.length;i++){
      if(records[i].querySelector('.t-cover')) return i;
    }
    return -1;
  }

  function legacyZone(productRoot){
    var records = allRecordsInOrder();
    var productRec = productRoot.closest('.t-rec') || productRoot;
    var productIndex = records.indexOf(productRec);
    if(productIndex < 0) return { records: [], productRec: productRec };

    var heroIndex = findHeroIndex(records);
    var startIndex = heroIndex >= 0 ? heroIndex + 1 : 0;

    if(startIndex >= productIndex) return { records: [], productRec: productRec };

    return {
      records: records.slice(startIndex, productIndex),
      productRec: productRec
    };
  }

  /* ------------------------------------------------------------
     ПАРСИНГ БЛОКА 7 КАТЕГОРИЙ ИЗ ТЕКСТА (если он есть)
     ------------------------------------------------------------ */
  var CURATION_LABELS = [
    { title:'Category & Budget Tier', re:/(?:CATHEGORY|CATEGORY)\s*&\s*BUDGET\s*TIER/i },
    { title:'Tags & Features',        re:/TAGS?\s*&\s*FEATURES/i },
    { title:'Sonic Signature',        re:/SONIC\s*SIGNATURE/i },
    { title:"Curator's Choice",       re:/CURATOR[’']?S\s*CHOICE/i },
    { title:'High Technologies',      re:/HIGH\s*TECHNOLOGIES/i },
    { title:'Synergy Match',          re:/SYNERGY\s*MATCH/i },
    { title:'Genres Accord',          re:/GENRES?\s*ACCORD/i }
  ];

  function parseCurationFromText(text){
    text = norm(text);
    var hits = [];

    CURATION_LABELS.forEach(function(l){
      var m = l.re.exec(text);
      if(m) hits.push({ title:l.title, index:m.index, len:m[0].length });
    });

    if(hits.length < 3) return null;

    hits.sort(function(a,b){ return a.index - b.index; });

    var results = [];
    for(var i=0;i<hits.length;i++){
      var start = hits[i].index + hits[i].len;
      var end = (i+1 < hits.length) ? hits[i+1].index : text.length;
      var body = text.slice(start, end).trim().replace(/^[^\w(]+/, '');
      if(body) results.push({ title: hits[i].title, html: '<p>'+body+'</p>' });
    }

    return results.length >= 3 ? results : null;
  }

  /* ------------------------------------------------------------
     ИЗВЛЕЧЕНИЕ ОСНОВНЫХ ДАННЫХ (имя/цена/картинки)
     ------------------------------------------------------------ */
  function legacyTitle(root){
    var nameEl = root.querySelector('.js-product-name');
    var raw = nameEl ? nameEl.textContent : '';
    raw = norm(raw).replace(/\s*\(Standard Edition\)\s*$/i,'').replace(/\s*\[[^\]]*\]\s*$/,'');
    if(raw) return raw;

    var h1 = Array.prototype.slice.call(document.querySelectorAll('h1'))
      .find(function(h){ return !h.closest('#t-header,.t-header,#t-footer') && norm(h.textContent); });
    if(h1) return norm(h1.textContent);

    return norm(document.title).replace(/\s*[|–—]\s*Filin Labs.*$/i,'') || 'Filin Labs Product';
  }

  function legacyPrice(root){
    var priceEl = root.querySelector('.js-product-price');
    return priceEl ? num(priceEl.textContent) : 0;
  }

  function legacyGalleryImages(){
    var seen = {}; var out = [];
    document.querySelectorAll('img').forEach(function(img){
      if(img.closest('#t-header,.t-header,#t-footer,.t-footer')) return;

      var src = img.currentSrc || img.getAttribute('data-original') ||
                img.getAttribute('data-src') || img.src || '';
      if(!src) return;

      var abs = '';
      try{ abs = new URL(src, location.origin).href; }catch(e){ return; }

      if(!/tildacdn\.com\//i.test(abs)) return;
      if(/(favicon|logo|icon-|placeholder|blank\.gif)/i.test(abs)) return;

      var rect = img.getBoundingClientRect ? img.getBoundingClientRect() : {width:999};
      if(rect.width && rect.width < 60) return;

      var key = abs.split('?')[0];
      if(seen[key]) return;
      seen[key] = 1;
      out.push(abs);
    });
    return out.slice(0, 14);
  }

  /* ------------------------------------------------------------
     СБОРКА ПРОФИЛЯ + ИЗВЛЕЧЕНИЕ ДАННЫХ ИЗ LEGACY-ЗОНЫ
     ------------------------------------------------------------ */
  function extractFromZone(zoneRecords){
    var curation = null;
    var overviewHtml = '';

    zoneRecords.forEach(function(rec){
      var text = norm(rec.textContent);

      if(!curation){
        var parsed = parseCurationFromText(text);
        if(parsed){ curation = parsed; return; }
      }

      if(!rec.querySelector('.tabs-wrapper,.js-product-btn,.js-product,.t-cover')){
        var paras = Array.prototype.slice.call(rec.querySelectorAll('p'));
        if(paras.length){
          overviewHtml += paras.map(function(p){ return '<p>'+p.innerHTML+'</p>'; }).join('');
        }
      }
    });

    return { curation: curation, overviewHtml: overviewHtml };
  }

  function buildSyntheticProfile(root, zoneData){
    var s = slug();
    var override = OVERRIDES[s] || {};

    var name = legacyTitle(root);
    var price = legacyPrice(root);
    var images = legacyGalleryImages();

    return {
      schemaVersion: 2,
      slug: s,
      id: s.replace(/_/g,'-'),
      category: '',
      currency: 'USD',

      hero: {
        staticH1: name,
        description: norm((zoneData.overviewHtml||'').replace(/<[^>]+>/g,' ')).slice(0, 220),
        background: images[0] || ''
      },

      curator: override.curator || '',

      overview: {
        title: name,
        html: zoneData.overviewHtml || '',
        galleryImages: images
      },

      curation: override.curation || zoneData.curation || [],

      commerce: {
        basePrice: price,
        displayName: name,
        cartName: name,
        stickyTitle: name,
        innerHTML: root.innerHTML
      },

      golden: {
        backLabel: "Back to the Filin's nest",
        backHref: '/',
        mobileHeroHeight: 860,
        resultLabel: 'Ultimate Synergy'
      },

      reviewsKey: s
    };
  }

  /* ------------------------------------------------------------
     СКРЫТИЕ LEGACY-ЗОНЫ (после apply(), чтобы не задеть
     запись, которую ядро само нашло и оформило как куратора)
     ------------------------------------------------------------ */
  function hideZone(zoneRecords){
    var hidden = 0;
    zoneRecords.forEach(function(rec){
      if(rec.classList.contains('fp-v3-curator-record')) return; // ядро уже оформило это как куратор-плашку
      rec.style.setProperty('display','none','important');
      rec.style.setProperty('visibility','hidden','important');
      rec.dataset.filinAutoBridgeHidden = '1';
      hidden++;
    });
    return hidden;
  }

  /* ------------------------------------------------------------
     ЗАГРУЗКА СКРИПТОВ
     ------------------------------------------------------------ */
  function already(src){
    return Array.prototype.some.call(document.scripts, function(sc){
      return sc.src && sc.src.split('?')[0] === src.split('?')[0];
    });
  }

  function loadOne(src){
    return new Promise(function(resolve){
      if(already(src)){ resolve(); return; }
      var el = document.createElement('script');
      el.src = src;
      el.onload = function(){ resolve(); };
      el.onerror = function(){
        console.error('[Filin Auto-Bridge] failed to load', src);
        resolve();
      };
      document.head.appendChild(el);
    });
  }

  function loadSequential(list){
    return list.reduce(function(chain, src){
      return chain.then(function(){ return loadOne(src); });
    }, Promise.resolve());
  }

  /* ------------------------------------------------------------
     ГЛАВНЫЙ ЗАПУСК
     ------------------------------------------------------------ */
  function run(){
    if(alreadyMigrated()) return; // страница уже мигрирована вручную — не трогаем

    var root = legacyProductRoot();
    if(!root) return; // не товарная страница

    var zone = legacyZone(root);
    var zoneData = extractFromZone(zone.records);
    var profile = buildSyntheticProfile(root, zoneData);

    if(!document.getElementById('product-data')){
      var seed = document.createElement('script');
      seed.type = 'application/json';
      seed.id = 'product-data';
      seed.textContent = JSON.stringify({
        schemaVersion: 2,
        slug: profile.slug,
        id: profile.id,
        name: profile.commerce.displayName,
        price: profile.commerce.basePrice,
        currency: 'USD',
        commerce: { regularPrice: profile.commerce.basePrice }
      });
      root.insertAdjacentElement('beforebegin', seed);
    }

    loadSequential(STACK).then(function(){
      var api = window.FilinMasterProductV3;
      if(!api || !api.profiles){
        console.error('[Filin Auto-Bridge] golden core did not initialize');
        return;
      }

      api.profiles[profile.slug] = profile;
      api.apply();

      var hidden = hideZone(zone.records);

      loadOne(CLEAN_COMMERCE);

      console.info('[Filin Auto-Bridge V2] APPLIED', {
        slug: profile.slug,
        price: profile.commerce.basePrice,
        images: profile.overview.galleryImages.length,
        zoneRecordsHidden: hidden,
        curationAutoParsed: !!(zoneData.curation && zoneData.curation.length)
      });
    });

    function loadWishlist(){ loadOne(WISHLIST_BRIDGE); }
    if(document.readyState === 'complete'){ setTimeout(loadWishlist, 300); }
    else{ window.addEventListener('load', function(){ setTimeout(loadWishlist, 300); }, {once:true}); }
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', run, {once:true});
  } else {
    run();
  }
})();
