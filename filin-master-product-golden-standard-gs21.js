/* ============================================================
   FILIN LABS — MASTER PRODUCT GOLDEN STANDARD GS2.1
   Freeze: 2026-08-20 / DAC Batch 1

   Extends frozen GS2 without changing its approved 48 routes.
   Adds 13 DAC / DAC+AMP routes through one new GS2-native batch.

   Final media contract remains Gallery Integrity V3:
   profile/code + GL01 + explicit/bounded product Zero Block.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS21__)return;
window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS21__=true;
window.__FILIN_MASTER_PRODUCT_V3_GALLERY_THUMB_HEALTH_V1__=true;

var VERSION='GS-2026.08.20.2.1';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';
var DAC=[
'demograf_tube_dacs_multibit','gerbera_multibit_dac','gerbera_onda',
'audioinstrument_dac_di_200_accuracy','gerbera_pcm1794_dsd1794_dac_otis',
'eridan_antares_r2r_dac','gerbera_tv_lpf_dac',
'demograf_bellerophon_dac_solid_state_amplifier','gerbera_grigio',
'gerbera_sound_emotion','gerbera_squire','gerbera_sound_onda_ha',
'demograf_hades_hybrid_class_d_amplifier_dac'
];

var GS2='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@e3d1c532dac953073ff5eda03fa6f6e14abb7e46/filin-master-product-golden-standard-gs2.js';
var BATCH='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@f0975d1ea2b5f5bf42c93443b2ca15dab6ac68a6/filin-master-product-gs2-dac-batch-v1.js';
var INTEGRITY='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@b93b229ee35e8345e9cfc8e86b0ed01900d474a5/filin-master-product-v3-gallery-integrity-v3.js';

var isDac=DAC.indexOf(PATH)>=0;
var state={version:VERSION,slug:PATH,group:isDac?'dacs-dac-amps':'gs2-existing',batchLoaded:false,batchReady:false,baseReady:false,integrityLoaded:false,integrityReady:false,ready:false,error:''};
function pub(){window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS21_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[]);}
function load(src,test){return new Promise(function(resolve,reject){
 if(test&&test())return resolve(true);
 var f=src.split('/').pop().split('?')[0],old=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(f)>=0;});
 if(old){var n=0,t=setInterval(function(){if(!test||test()){clearInterval(t);resolve(true);}else if(++n>900){clearInterval(t);resolve(false);}},50);return;}
 var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('load failed: '+src));};(document.head||document.documentElement).appendChild(s);
});}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test();}catch(e){}if(ok){clearInterval(t);resolve(true);}else if(Date.now()-st>(ms||55000)){clearInterval(t);resolve(false);}},60);});}
function profileReady(){try{return !!(window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]);}catch(e){return false;}}
function rootReady(){return !!document.querySelector('#'+ROOT+' .v3-shell');}

async function boot(){
 try{
   if(!isDac){
     await load(GS2,function(){return !!window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS2__;});
     await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS2_STATE__;return s&&s.slug===PATH&&(s.ready===true||(!s.error&&s.baseReady===false));},56000);
     var old=window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS2_STATE__;
     if(old&&old.slug===PATH){state.baseReady=!!old.baseReady;state.integrityLoaded=!!old.integrityLoaded;state.integrityReady=!!old.integrityReady;state.ready=!!old.ready;state.error=old.error||'';}
     pub();return;
   }

   await load(BATCH,function(){return !!window.__FILIN_GS2_DAC_BATCH1__;});
   state.batchLoaded=true;pub();

   state.batchReady=await wait(function(){var s=window.__FILIN_GS2_DAC_BATCH1_STATE__;return s&&s.slug===PATH&&(s.ready===true||!!s.error);},50000);
   var bs=window.__FILIN_GS2_DAC_BATCH1_STATE__;
   if(!bs||bs.ready!==true)throw new Error('DAC Batch 1 did not become ready: '+(bs&&bs.error||'timeout'));

   state.baseReady=rootReady()&&profileReady();
   if(!state.baseReady)throw new Error('Golden root/profile missing after DAC batch');

   await load(INTEGRITY,function(){return !!window.__FILIN_MASTER_PRODUCT_V3_GALLERY_INTEGRITY_V3__;});
   state.integrityLoaded=true;pub();

   state.integrityReady=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V3_GALLERY_INTEGRITY_V3_STATE__;return s&&s.slug===PATH&&s.ready===true&&!s.lastError;},45000);
   if(!state.integrityReady)throw new Error('Gallery Integrity V3 did not become ready');

   state.ready=true;state.error='';
 }catch(e){state.error=String(e&&e.message||e);state.ready=false;}
 pub();
 if(state.error)console.warn('[Filin Labs Golden Standard GS2.1]',state.error,state);
 else if(state.ready)console.info('[Filin Labs Golden Standard GS2.1] ready',state);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
pub();
})();