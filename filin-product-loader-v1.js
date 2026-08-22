/*!
 * filin-product-loader-v1.js
 * Загрузчик карточек товара Filin Labs. Статический файл, правится руками.
 *
 * Читает список слагов из generated/filin-routes.js, на странице товара
 * подключает стек Master Product V3 и готовый профиль из generated/profiles/.
 * Ничего не парсит в DOM: все данные извлечены на этапе сборки.
 *
 * КУДА: Настройки сайта → Ещё → HTML-код внутрь HEAD (см. HEAD-snippet.html)
 */
(function () {
  'use strict';

  if (window.FilinProductLoader) return;

  /* ==== НАСТРОЙКИ ==================================================== */

  var CDN = 'https://cdn.jsdelivr.net/gh/FilinAudio/442-2@v1.0.0/'; // пиньте ТЕГ, не @main

  /* Порядок обязателен: каталог до ядра — из него берутся цены
     Perfect Matches и нижний recommendation-скроллер. */
  var STACK = [
    'filin-rich-product-catalog-v2-runtime.js',
    'filin-master-product-v3-3-2-golden-standard-runtime.js'
  ];

  var COMMERCE = 'filin-master-product-v3-clean-commerce-v2.js';

  /* После window.load — иначе гонка с tilda-wishlist-1.0.min.js даёт
     "Cannot read properties of null (reading 'getAttribute')". */
  var WISHLIST = 'filin-master-product-v3-wishlist-bridge-v4.js';

  var FALLBACK_MS = 5000;   // не собралось за это время — вернуть легаси
  var DEBUG = /[?&]filin_debug=1/.test(location.search);

  /* ==== служебное ==================================================== */

  function log() {
    if (!DEBUG) return;
    console.log.apply(console, ['[Filin Loader]'].concat([].slice.call(arguments)));
  }

  function slug() {
    return (location.pathname || '/').replace(/^\/+|\/+$/g, '').toLowerCase();
  }

  function loaded(src) {
    for (var i = 0; i < document.scripts.length; i++) {
      if (document.scripts[i].src && document.scripts[i].src.split('?')[0] === src.split('?')[0]) return true;
    }
    return false;
  }

  function load(name) {
    var src = /^https?:/.test(name) ? name : CDN + name;
    return new Promise(function (resolve, reject) {
      if (loaded(src)) return resolve();
      var s = document.createElement('script');
      s.src = src;
      s.async = false;
      s.onload = function () { log('loaded', name); resolve(); };
      s.onerror = function () { reject(new Error('failed: ' + name)); };
      document.head.appendChild(s);
    });
  }

  function chain(list) {
    return list.reduce(function (p, n) { return p.then(function () { return load(n); }); }, Promise.resolve());
  }

  function onLoad(fn) {
    if (document.readyState === 'complete') fn();
    else window.addEventListener('load', fn, { once: true });
  }

  /* Возврат легаси, если карточка не собралась: снимает generated/legacy-hide.css */
  function restoreLegacy(why) {
    if (document.getElementById('filin-master-product-v3')) return;
    document.documentElement.classList.add('filin-legacy-restore');
    console.warn('[Filin Loader] карточка не собрана (' + why + ') — легаси-блоки возвращены');
  }

  /* ==== старт ======================================================== */

  function boot(routes) {
    var s = slug();
    var slugs = (routes && routes.slugs) || [];

    if (slugs.indexOf(s) < 0) { log('не карточка товара:', s || '/'); return; }

    /* Seed нужен ядру (определяет slug), Cart Bridge (цена/имя)
       и Sticky Header. Кладём в head — оба читают по id, не по месту. */
    if (!document.getElementById('product-data')) {
      var seed = document.createElement('script');
      seed.type = 'application/json';
      seed.id = 'product-data';
      seed.textContent = JSON.stringify({ schemaVersion: 2, slug: s });
      document.head.appendChild(seed);
    }

    document.documentElement.setAttribute('data-filin-product', s);

    /* Профиль грузим параллельно со стеком: он только кладёт объект
       в window.FilinProfiles, порядок исполнения не важен. */
    var profileReady = load('generated/profiles/' + s + '.js');

    Promise.all([profileReady, chain(STACK)])
      .then(function () {
        var api = window.FilinMasterProductV3;
        var profile = (window.FilinProfiles || {})[s];

        if (!api || !api.profiles) throw new Error('ядро не инициализировалось');
        if (!profile) throw new Error('профиль пуст');

        /* Цена и имя из профиля — в seed, чтобы Cart Bridge и Sticky Header
           видели те же значения, что и карточка. */
        var node = document.getElementById('product-data');
        if (node) {
          node.textContent = JSON.stringify({
            schemaVersion: 2,
            slug: s,
            id: profile.id,
            name: profile.commerce.displayName,
            price: profile.commerce.basePrice,
            currency: 'USD',
            commerce: {
              regularPrice: profile.commerce.basePrice,
              cartName: profile.commerce.cartName,
              stickyTitle: profile.commerce.stickyTitle
            }
          });
        }

        api.profiles[s] = profile;
        api.apply();

        document.documentElement.setAttribute('data-filin-ready', '1');

        /* Sticky Header V4.1 слушает старое имя события. Без этого он
           держится на таймерах 800/1800 мс и интервале 300 мс, каждый
           тик которого перебирает все ссылки и кнопки документа. */
        try {
          document.dispatchEvent(new CustomEvent('filin:product:v2:ready', { detail: { slug: s } }));
        } catch (e) {}

        load(COMMERCE);
        onLoad(function () { setTimeout(function () { load(WISHLIST); }, 300); });

        log('готово:', s, profile.overview.galleryImages.length + ' изображений');
      })
      .catch(function (err) {
        document.documentElement.setAttribute('data-filin-ready', 'error');
        restoreLegacy(err.message);
      });

    setTimeout(function () { restoreLegacy('таймаут ' + FALLBACK_MS + ' мс'); }, FALLBACK_MS);
  }

  window.FilinProductLoader = { version: '1.0.0', boot: boot };

  /* Если generated/filin-routes.js успел выполниться раньше загрузчика */
  if (window.__FILIN_ROUTES__) boot(window.__FILIN_ROUTES__);
})();
