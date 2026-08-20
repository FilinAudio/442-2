/* ============================================================
   FILIN LABS — MASTER PRODUCT GOLDEN STANDARD GS2
   Freeze: 2026-08-20 / GS-2

   Purpose:
   - keep GS1 routing / approved product pipelines intact
   - add one global Gallery Integrity V3 layer
   - prevent old "loadable = valid" thumbnail health logic
   - make future profiles compatible with mixed media sources:
     code/profile + GL01 + explicit Zero Block record IDs

   Future-card media contract:
   profile.registryMeta.mediaSources = {
     recordIds: [],
     gl01RecordIds: [],
     zeroBlockRecordIds: []
   }

   The HEAD does not need another gallery hotfix for future cards.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS2__)return;
window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS2__=true;

/* Old thumbnail-health V1 is superseded by Integrity V3. */
window.__FILIN_MASTER_PRODUCT_V3_GALLERY_THUMB_HEALTH_V1__=true;

var VERSION='GS-2026.08.20.2';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';

var GS1='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@189a38547971f554f5901ef7933673946f184ff3/filin-master-product-golden-standard-gs1.js';
var INTEGRITY='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@b93b229ee35e8345e9cfc8e86b0ed01900d474a5/filin-master-product-v3-gallery-integrity-v3.js';

var state={
  version:VERSION,slug:PATH,baseLoaded:false,baseReady:false,
  integrityLoaded:false,integrityReady:false,ready:false,error:''
};

function pub(){window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS2_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[]);}
function loaded(src){var f=src.split('/').pop().split('?')[0];return arr(document.scripts||[]).some(function(s){return String(s.src||'').indexOf(f)>=0;});}
function load(src,test){
  return new Promise(function(resolve,reject){
    if(test&&test()){resolve(true);return;}
    if(loaded(src)){
      var n=0,t=setInterval(function(){
        if(!test||test()){clearInterval(t);resolve(true);}
        else if(++n>600){clearInterval(t);resolve(false);}
      },50);
      return;
    }
    var s=document.createElement('script');s.src=src;s.async=false;
    s.onload=function(){resolve(true);};
    s.onerror=function(){reject(new Error('load failed: '+src));};
    (document.head||document.documentElement).appendChild(s);
  });
}
function wait(test,ms){
  return new Promise(function(resolve){
    var st=Date.now(),t=setInterval(function(){
      var ok=false;try{ok=!!test();}catch(e){}
      if(ok){clearInterval(t);resolve(true);}
      else if(Date.now()-st>(ms||50000)){clearInterval(t);resolve(false);}
    },60);
  });
}
function profileReady(){
  try{
    return !!(
      window.FilinMasterProductV3 &&
      window.FilinMasterProductV3.profiles &&
      window.FilinMasterProductV3.profiles[PATH]
    );
  }catch(e){return false;}
}
function rootReady(){return !!document.querySelector('#'+ROOT+' .v3-shell');}

async function boot(){
  try{
    await load(GS1,function(){return !!window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_20260820__;});
    state.baseLoaded=true;pub();

    /*
     * Known GS1 routes build here.
     * Future approved routes may also build Golden from their page/profile
     * pipeline; GS2 waits for the same universal root/profile contract.
     */
    state.baseReady=await wait(function(){return rootReady()&&profileReady();},50000);
    pub();

    if(!state.baseReady){
      /*
       * Non-product / unknown routes are fail-open and untouched.
       * This is not a site error.
       */
      state.error='';state.ready=false;pub();
      return;
    }

    await load(INTEGRITY,function(){return !!window.__FILIN_MASTER_PRODUCT_V3_GALLERY_INTEGRITY_V3__;});
    state.integrityLoaded=true;pub();

    state.integrityReady=await wait(function(){
      var s=window.__FILIN_MASTER_PRODUCT_V3_GALLERY_INTEGRITY_V3_STATE__;
      return s&&s.slug===PATH&&s.ready===true&&!s.lastError;
    },45000);

    state.ready=state.baseReady&&state.integrityReady;
    if(!state.ready)state.error='Gallery Integrity V3 did not become ready';
  }catch(e){
    state.error=String(e&&e.message||e);
  }

  pub();
  if(state.error)console.warn('[Filin Labs Golden Standard GS2]',state.error,state);
  else if(state.ready)console.info('[Filin Labs Golden Standard GS2] ready',state);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
pub();
})();