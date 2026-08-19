/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 HERO GUARD V3

   Safe hero guard for frozen Golden Standard.
   - DOES NOT assign/wrap FilinMasterProductV3.apply (read-only)
   - DOES NOT use MutationObserver
   - DOES NOT hide the whole cover/page
   - intercepts only api.profiles.demograf_binding_posts assignment
   - clears profile.hero.background BEFORE Golden apply()
   - keeps overview.galleryImages untouched
   - temporarily hides legacy Quadron/Grand Tower hero title/descr only
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_MASTER_PRODUCT_V3_HERO_GUARD_V3__) return;
  window.__FILIN_MASTER_PRODUCT_V3_HERO_GUARD_V3__=true;

  var VERSION='3.0.0';
  var SLUG='demograf_binding_posts';
  var STYLE_ID='filin-master-product-v3-hero-guard-v3-style';
  var tries=0;
  var timer=null;
  var installed=false;

  function addStyle(){
    if(document.getElementById(STYLE_ID)) return;
    var s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent='html.fp-v3-hero-guard-pending .t-cover .t184__title,html.fp-v3-hero-guard-pending .t-cover .t184__descr{visibility:hidden!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  function release(){
    document.documentElement.classList.remove('fp-v3-hero-guard-pending');
  }

  function sanitizeProfile(p){
    if(p && p.hero){
      p.hero.background='';
    }
    return p;
  }

  function install(){
    tries++;
    var api=window.FilinMasterProductV3;
    if(!api || !api.profiles) return false;

    var profiles=api.profiles;
    var existing;
    try{ existing=profiles[SLUG]; }catch(e){ existing=null; }

    if(existing){
      sanitizeProfile(existing);
      release();
      installed=true;
      console.info('[Master Product V3 Hero Guard V3] EXISTING PROFILE SANITIZED',{version:VERSION,slug:SLUG});
      return true;
    }

    var desc;
    try{ desc=Object.getOwnPropertyDescriptor(profiles,SLUG); }catch(e){ desc=null; }
    if(desc && desc.configurable===false){
      console.warn('[Master Product V3 Hero Guard V3] PROFILE SLOT NOT CONFIGURABLE',{version:VERSION,slug:SLUG});
      release();
      return true;
    }

    try{
      Object.defineProperty(profiles,SLUG,{
        configurable:true,
        enumerable:true,
        get:function(){ return undefined; },
        set:function(value){
          var p=sanitizeProfile(value);
          Object.defineProperty(profiles,SLUG,{
            configurable:true,
            enumerable:true,
            writable:true,
            value:p
          });
          installed=true;
          release();
          console.info('[Master Product V3 Hero Guard V3] HERO BACKGROUND BLOCKED',{version:VERSION,slug:SLUG,galleryImages:p&&p.overview&&Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.length:0});
        }
      });
    }catch(e){
      console.error('[Master Product V3 Hero Guard V3] INSTALL FAILED',e);
      release();
      return true;
    }

    installed=true;
    console.info('[Master Product V3 Hero Guard V3] INSTALLED',{version:VERSION,slug:SLUG});
    return true;
  }

  addStyle();
  document.documentElement.classList.add('fp-v3-hero-guard-pending');

  if(!install()){
    timer=setInterval(function(){
      if(install() || tries>=240){
        clearInterval(timer);
        timer=null;
      }
    },25);
  }

  setTimeout(function(){
    if(document.documentElement.classList.contains('fp-v3-hero-guard-pending')){
      release();
      console.warn('[Master Product V3 Hero Guard V3] FAIL-OPEN',{version:VERSION,installed:installed,tries:tries});
    }
  },6000);
})();
