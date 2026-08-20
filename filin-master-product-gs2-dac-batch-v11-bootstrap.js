/* ============================================================
   FILIN LABS — GS2 DAC / DAC+AMP BATCH 1.1 BOOTSTRAP
   Fixes legacy DAC pages that have missing / empty #product-data.slug.

   Golden V3.3.2 resolves its active profile ONLY through #product-data.slug.
   Batch V1 could build/register the correct profile, while core still looked
   up the empty slug and therefore never mounted the Golden root.

   Contract:
   - preserve any existing #product-data JSON fields
   - force slug to the canonical pathname for these 13 approved DAC routes
   - create #product-data when absent
   - install BEFORE DAC Batch V1 / Golden core
   - delegate the actual migration to frozen Batch V1 unchanged
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_GS2_DAC_BATCH11_BOOTSTRAP__)return;

var VERSION='1.1.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var TARGET=[
'demograf_tube_dacs_multibit',
'gerbera_multibit_dac',
'gerbera_onda',
'audioinstrument_dac_di_200_accuracy',
'gerbera_pcm1794_dsd1794_dac_otis',
'eridan_antares_r2r_dac',
'gerbera_tv_lpf_dac',
'demograf_bellerophon_dac_solid_state_amplifier',
'gerbera_grigio',
'gerbera_sound_emotion',
'gerbera_squire',
'gerbera_sound_onda_ha',
'demograf_hades_hybrid_class_d_amplifier_dac'
];
if(TARGET.indexOf(PATH)<0)return;
window.__FILIN_GS2_DAC_BATCH11_BOOTSTRAP__=true;

var BATCH='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@f0975d1ea2b5f5bf42c93443b2ca15dab6ac68a6/filin-master-product-gs2-dac-batch-v1.js';
var state={version:VERSION,slug:PATH,productDataReady:false,productDataCreated:false,productDataPatched:false,batchLoaded:false,batchReady:false,ready:false,error:''};
function pub(){window.__FILIN_GS2_DAC_BATCH11_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[]);}

function ensureProductData(){
  var el=document.getElementById('product-data'),data={};
  if(el){
    try{data=JSON.parse(el.textContent||'{}')||{};}catch(e){data={};}
  }else{
    el=document.createElement('script');
    el.id='product-data';
    el.type='application/json';
    (document.head||document.documentElement).appendChild(el);
    state.productDataCreated=true;
  }
  if(String(data.slug||'')!==PATH){data.slug=PATH;state.productDataPatched=true;}
  el.textContent=JSON.stringify(data);
  state.productDataReady=true;
  pub();
  return true;
}
function load(src,test){return new Promise(function(resolve,reject){
  if(test&&test())return resolve(true);
  var f=src.split('/').pop().split('?')[0],old=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(f)>=0;});
  if(old){var n=0,t=setInterval(function(){if(!test||test()){clearInterval(t);resolve(true);}else if(++n>1000){clearInterval(t);resolve(false);}},50);return;}
  var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('load failed: '+src));};(document.head||document.documentElement).appendChild(s);
});}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test();}catch(e){}if(ok){clearInterval(t);resolve(true);}else if(Date.now()-st>(ms||55000)){clearInterval(t);resolve(false);}},60);});}

async function boot(){
  try{
    ensureProductData();
    await load(BATCH,function(){return !!window.__FILIN_GS2_DAC_BATCH1__;});
    state.batchLoaded=true;pub();
    state.batchReady=await wait(function(){var s=window.__FILIN_GS2_DAC_BATCH1_STATE__;return s&&s.slug===PATH&&(s.ready===true||!!s.error);},52000);
    var bs=window.__FILIN_GS2_DAC_BATCH1_STATE__;
    if(!bs||bs.ready!==true)throw new Error('DAC Batch V1 did not become ready: '+(bs&&bs.error||'timeout'));
    state.ready=true;state.error='';
  }catch(e){state.error=String(e&&e.message||e);state.ready=false;}
  pub();
  if(state.error)console.warn('[Filin Labs GS2 DAC Batch 1.1]',state.error,state);
  else console.info('[Filin Labs GS2 DAC Batch 1.1] ready',state);
}

/* Must run as early as possible so Golden core never sees an empty slug. */
ensureProductData();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
pub();
})();