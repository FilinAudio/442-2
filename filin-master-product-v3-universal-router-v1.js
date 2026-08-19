/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 UNIVERSAL ROUTER V1
   Safe routing layer for the frozen Golden Standard V3 core.

   Purpose:
   - keep one product engine include in the upper T123 block
   - route product-specific adapters by #product-data.slug
   - preserve Binding Posts V7 exactly as the current golden reference
   - use Profiles Registry V1 for Quadron / Grand Tower / Sirius / aliases
   - fail open instead of leaving the Tilda cover hidden

   IMPORTANT:
   This router does NOT replace the frozen FilinMasterProductV3 core.
   It expects window.FilinMasterProductV3 to be provided by the existing
   Golden Standard setup already used by the product template.
   ============================================================ */
(function(){
  'use strict';

  if (window.__FILIN_MASTER_PRODUCT_V3_UNIVERSAL_ROUTER_V1__) return;
  window.__FILIN_MASTER_PRODUCT_V3_UNIVERSAL_ROUTER_V1__ = true;

  var VERSION = '1.0.0';
  var PIN = '0e7956bb5ff673551dc6271dfdfff9edc1c156fe';
  var CDN = 'https://cdn.jsdelivr.net/gh/FilinAudio/442-2@' + PIN + '/';
  var REGISTRY = CDN + 'filin-master-product-v3-profiles-registry-v1.js';
  var BINDING_POSTS_V7 = CDN + 'filin-master-product-v3-universal-golden-bridge-v7.js';

  var ROUTES = {
    'demograf_binding_posts': BINDING_POSTS_V7,
    'demograf-binding-posts': BINDING_POSTS_V7,
    'audioinstrument_sirius_kt150_tube_amplifier': REGISTRY,
    'audioinstrument-sirius-kt150': REGISTRY,
    'audioinstrument-sirius-kt150-tube-amplifier': REGISTRY,
    'audioinstrument_grand_tower_speakers': REGISTRY,
    'audioinstrument-grand-tower': REGISTRY,
    'audioinstrument-grand-tower-speakers': REGISTRY,
    'filin_audio_quadron': REGISTRY,
    'filin-audio-quadron': REGISTRY
  };

  var tries = 0;
  var routed = false;
  var failOpenTimer = null;

  function str(v){ return String(v == null ? '' : v).trim(); }

  function ready(reason){
    document.documentElement.classList.add('fp-v7-ready');
    document.documentElement.classList.remove('fp-v7-boot');
    if (reason) console.info('[Master Product V3 Router] READY', {version: VERSION, reason: reason});
  }

  function readProductData(){
    var el = document.getElementById('product-data');
    if (!el) return null;
    try { return JSON.parse(el.textContent || '{}'); }
    catch(e){
      console.warn('[Master Product V3 Router] invalid #product-data JSON', e);
      return null;
    }
  }

  function scriptAlreadyLoaded(url){
    return Array.prototype.some.call(document.scripts || [], function(s){
      return str(s.src).split('?')[0] === str(url).split('?')[0];
    });
  }

  function loadScript(url, id, done){
    if (scriptAlreadyLoaded(url)) {
      done(null, 'already-loaded');
      return;
    }

    var existing = document.getElementById(id);
    if (existing) {
      if (existing.dataset && existing.dataset.loaded === '1') done(null, 'already-loaded');
      else existing.addEventListener('load', function(){ done(null, 'loaded'); }, {once:true});
      return;
    }

    var s = document.createElement('script');
    s.id = id;
    s.src = url;
    s.async = false;
    s.dataset.filinRouter = VERSION;
    s.onload = function(){
      s.dataset.loaded = '1';
      done(null, 'loaded');
    };
    s.onerror = function(){ done(new Error('Failed to load ' + url)); };
    (document.head || document.documentElement).appendChild(s);
  }

  function waitForGoldenApply(slug){
    var n = 0;
    var timer = setInterval(function(){
      n++;
      var api = window.FilinMasterProductV3;
      if (api && api.profiles && typeof api.apply === 'function') {
        clearInterval(timer);
        try { api.apply(); }
        catch(e){ console.error('[Master Product V3 Router] apply failed', e); }
        setTimeout(function(){ ready('registry-applied:' + slug); }, 120);
      } else if (n >= 100) {
        clearInterval(timer);
        console.warn('[Master Product V3 Router] Golden core not found after registry load', {slug: slug});
        ready('core-timeout');
      }
    }, 50);
  }

  function route(){
    if (routed) return true;
    tries++;

    var data = readProductData();
    if (!data || !str(data.slug)) return false;

    var slug = str(data.slug);
    var target = ROUTES[slug] || REGISTRY;
    var isBindingPosts = target === BINDING_POSTS_V7;
    routed = true;

    console.info('[Master Product V3 Router] ROUTE', {
      version: VERSION,
      slug: slug,
      target: isBindingPosts ? 'binding-posts-v7' : 'profiles-registry-v1',
      pin: PIN
    });

    loadScript(
      target,
      isBindingPosts ? 'filin-master-product-v3-binding-posts-v7' : 'filin-master-product-v3-profiles-registry-v1',
      function(err){
        if (err) {
          console.error('[Master Product V3 Router] route load failed', err);
          ready('route-load-failed');
          return;
        }

        // Binding Posts V7 owns its own apply/sync/ready lifecycle.
        if (isBindingPosts) {
          setTimeout(function(){
            if (!document.documentElement.classList.contains('fp-v7-ready')) ready('binding-posts-fallback');
          }, 5200);
          return;
        }

        waitForGoldenApply(slug);
      }
    );

    return true;
  }

  if (!route()) {
    var boot = setInterval(function(){
      if (route() || tries >= 240) {
        clearInterval(boot);
        if (!routed) {
          console.warn('[Master Product V3 Router] product-data/slug not found', {tries: tries});
          ready('product-data-timeout');
        }
      }
    }, 35);
  }

  failOpenTimer = setTimeout(function(){
    if (!document.documentElement.classList.contains('fp-v7-ready')) {
      console.warn('[Master Product V3 Router] FAIL-OPEN', {version: VERSION, routed: routed, tries: tries});
      ready('global-fail-open');
    }
  }, 6200);
})();
