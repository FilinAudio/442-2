/*! filin-product-loader v1.1.2 — параллельный стек, мягкий откат */
(function () {
  'use strict';
  if (window.FilinProductLoader) return;

  var CDN      = 'https://cdn.jsdelivr.net/gh/FilinAudio/442-2@v1.1.3/';
  var CATALOG  = 'filin-rich-product-catalog-v2-runtime.js';
  var CORE     = 'filin-master-product-v3-3-2-golden-standard-runtime.js';
  var COMMERCE = 'filin-master-product-v3-clean-commerce-v2.js';
  var WISHLIST = 'filin-master-product-v3-wishlist-bridge-v4.js';
  var FALLBACK_MS = 15000;
  var DEBUG = /[?&]filin_debug=1/.test(location.search);

  function log() {
    if (!DEBUG) return;
    console.log.apply(console, ['[Filin Loader]'].concat([].slice.call(arguments)));
  }
  function slug() { return (location.pathname || '/').replace(/^\/+|\/+$/g, '').toLowerCase(); }
  function has(src) {
    for (var i = 0; i < document.scripts.length; i++)
      if (document.scripts[i].src && document.scripts[i].src.split('?')[0] === src.split('?')[0]) return true;
    return false;
  }
  function load(name) {
    var src = /^https?:/.test(name) ? name : CDN + name;
    return new Promise(function (res, rej) {
      if (has(src)) return res();
      var s = document.createElement('script');
      s.src = src; s.async = true;
      s.onload = function () { log('loaded', name); res(); };
      s.onerror = function () { rej(new Error('failed: ' + name)); };
      document.head.appendChild(s);
    });
  }
  function onLoad(fn) {
    if (document.readyState === 'complete') fn();
    else window.addEventListener('load', fn, { once: true });
  }
  function built() { return !!document.getElementById('filin-master-product-v3'); }
  function restore(why) {
    if (built()) return;
    document.documentElement.classList.add('filin-legacy-restore');
    console.warn('[Filin Loader] карточка не собрана (' + why + ') — легаси-блоки возвращены');
  }

  function boot(routes) {
    var s = slug();
    if (((routes && routes.slugs) || []).indexOf(s) < 0) { log('не карточка товара:', s || '/'); return; }

    if (!document.getElementById('product-data')) {
      var seed = document.createElement('script');
      seed.type = 'application/json'; seed.id = 'product-data';
      seed.textContent = JSON.stringify({ schemaVersion: 2, slug: s });
      document.head.appendChild(seed);
    }
    document.documentElement.setAttribute('data-filin-product', s);

    Promise.all([
      load('generated/profiles/' + s + '.js'),
      load(CATALOG),
      load(CORE)
    ]).then(function () {
      var api = window.FilinMasterProductV3;
      var p = (window.FilinProfiles || {})[s];
      if (!api || !api.profiles) throw new Error('ядро не инициализировалось');
      if (!p) throw new Error('профиль пуст');

      var node = document.getElementById('product-data');
      if (node) node.textContent = JSON.stringify({
        schemaVersion: 2, slug: s, id: p.id,
        name: p.commerce.displayName, price: p.commerce.basePrice, currency: 'USD',
        commerce: {
          regularPrice: p.commerce.basePrice,
          cartName: p.commerce.cartName,
          stickyTitle: p.commerce.stickyTitle
        }
      });

      api.profiles[s] = p;
      api.apply();
      document.documentElement.classList.remove('filin-legacy-restore');
      document.documentElement.setAttribute('data-filin-ready', '1');

      try { document.dispatchEvent(new CustomEvent('filin:product:v2:ready', { detail: { slug: s } })); } catch (e) {}

      load(COMMERCE);
      onLoad(function () { setTimeout(function () { load(WISHLIST); }, 300); });
      log('готово:', s, p.overview.galleryImages.length + ' изображений');
    }).catch(function (err) {
      document.documentElement.setAttribute('data-filin-ready', 'error');
      restore(err.message);
    });

    setTimeout(function () { restore('таймаут ' + FALLBACK_MS + ' мс'); }, FALLBACK_MS);
  }

window.FilinProductLoader = { version: '1.1.3', boot: boot };
  if (window.__FILIN_ROUTES__) boot(window.__FILIN_ROUTES__);
})();
