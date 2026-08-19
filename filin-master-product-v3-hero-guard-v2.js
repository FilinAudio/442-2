/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 HERO GUARD V2

   Safe pre-Golden guard.
   - prevents old Quadron/Grand Tower hero text flash
   - preserves the native Tilda hero background
   - DOES NOT hide the whole cover/page
   - DOES NOT use MutationObserver
   - wraps FilinMasterProductV3.apply() and temporarily clears only
     profile.hero.background while Golden binds the hero
   - gallery remains untouched (overview.galleryImages)
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_MASTER_PRODUCT_V3_HERO_GUARD_V2__) return;
  window.__FILIN_MASTER_PRODUCT_V3_HERO_GUARD_V2__=true;

  var VERSION='2.0.0';
  var STYLE_ID='filin-master-product-v3-hero-guard-v2-style';
  var wrapped=false;
  var tries=0;
  var timer=null;

  function addStyle(){
    if(document.getElementById(STYLE_ID)) return;
    var s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent='html.fp-v3-hero-guard-pending .t-cover .t184__title,html.fp-v3-hero-guard-pending .t-cover .t184__descr{visibility:hidden!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  function readSlug(){
    try{
      var el=document.getElementById('product-data');
      if(!el) return '';
      return String((JSON.parse(el.textContent||'{}')||{}).slug||'').trim();
    }catch(e){return '';}
  }

  function release(){
    document.documentElement.classList.remove('fp-v3-hero-guard-pending');
  }

  addStyle();
  document.documentElement.classList.add('fp-v3-hero-guard-pending');

  function install(){
    tries++;
    var api=window.FilinMasterProductV3;
    if(!api || !api.profiles || typeof api.apply!=='function') return false;
    if(api.apply.__fpHeroGuardV2){wrapped=true;return true;}

    var original=api.apply;

    function guardedApply(){
      var slug=readSlug();
      var p=slug && api.profiles ? api.profiles[slug] : null;
      var hadHero=!!(p&&p.hero);
      var originalBg=hadHero?p.hero.background:undefined;
      var shouldNeutralize=hadHero && !!originalBg;

      if(shouldNeutralize){
        p.hero.background='';
      }

      try{
        return original.apply(api,arguments);
      }finally{
        if(shouldNeutralize){
          p.hero.background=originalBg;
        }
        // Release only when the current product actually has a profile.
        // Early registry apply() calls for an unknown slug must not reveal
        // old Quadron/Grand Tower text.
        if(p){
          release();
          console.info('[Master Product V3 Hero Guard] HERO PRESERVED',{
            version:VERSION,
            slug:slug,
            galleryBackgroundWasBlocked:shouldNeutralize
          });
        }
      }
    }

    guardedApply.__fpHeroGuardV2=true;
    guardedApply.__fpHeroGuardOriginal=original;
    api.apply=guardedApply;
    wrapped=true;

    console.info('[Master Product V3 Hero Guard] INSTALLED',{version:VERSION});
    return true;
  }

  if(!install()){
    timer=setInterval(function(){
      if(install() || tries>=600){
        clearInterval(timer);
        timer=null;
      }
    },10);
  }

  // Fail open: never leave title text hidden forever if another script fails.
  setTimeout(function(){
    if(document.documentElement.classList.contains('fp-v3-hero-guard-pending')){
      release();
      console.warn('[Master Product V3 Hero Guard] FAIL-OPEN',{version:VERSION,wrapped:wrapped,tries:tries});
    }
  },6000);
})();
