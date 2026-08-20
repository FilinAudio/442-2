/* ============================================================
 FILIN LABS — MASTER PRODUCT GOLDEN STANDARD GS2.7
 2026-08-20 / Demograf expansion stability fix

 - Existing approved routes delegate to frozen GS2.5 unchanged.
 - 24 Demograf expansion routes use Batch V2.1.
 - V2.1 fixes the invalid runtime source token seen on Orpheus.
 - Final visual checks require Golden root + loaded main image + BUY NOW/header.
 ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS27__)return;
window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS27__=true;
var VERSION='GS-2026.08.20.2.7',PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var TARGET=["demograf_orpheus_aer_loudspeakers","demograf_perseus_mkii_supravox_loudspeakers","demograf_perseus_speakers_supravox","demograf_cassandra_mkii_speakers","demograf_cassandra_mki_speakers","demograf_zeus_subwoofers","demograf_helios_mki_811_tube_amp","demograf_helios_mkii_g811_tube_integrated_amplifier","demograf_tantal_senior_amplifier","demograf_argo_tube_amp_el_34","demograf_gu_72_aglaya_tube_amp","demograf_atlas_amplifier_300b","demograf_solaria_45_tube_amp","demograf_3c24_tantal_tube_amp_electrostatic","demograf_eurybia_2a3_tube_amp","demograf_ether_tube_amp_gm_70","demograf_hestia_807_tube_amp_electrostatic","demograf_endymion_805_845_211_tube_amplifier","demograf_hyperion_dac","demograf_prometheus_fpga_dac","high_end_preamplifiers_demograf","demograf_ulanor_pc_streamer","demograf_charon_tube_solid_state_master_clock","demograf_odysseus_tube_phonostage"];
var LEGACY='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@3208958a6d9bcf0d0a337a52dfcacbea5ab5678a/filin-master-product-golden-standard-gs25.js';
var BATCH='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@94b70cf6178d17313d7a4a62d335d93a6149f961/filin-master-product-gs2-demograf-expansion-batch-v21.js';
var isNew=TARGET.indexOf(PATH)>=0;
var state={version:VERSION,slug:PATH,group:isNew?'demograf-expansion-new-24':'gs25-existing',batchLoaded:false,batchReady:false,contractV3Ready:false,curationReady:false,pmReady:false,curatorReady:false,integrityReady:false,rootReady:false,mainImageReady:false,headerReady:false,ready:false,error:''};
function pub(){window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS27_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[]);}
function load(src,test){return new Promise(function(resolve,reject){if(test&&test())return resolve(true);var f=src.split('/').pop().split('?')[0],old=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(f)>=0;});if(old){var n=0,t=setInterval(function(){if(!test||test()){clearInterval(t);resolve(true);}else if(++n>1800){clearInterval(t);resolve(false);}},50);return;}var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('load failed: '+src));};(document.head||document.documentElement).appendChild(s);});}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test();}catch(e){}if(ok){clearInterval(t);resolve(true);}else if(Date.now()-st>(ms||110000)){clearInterval(t);resolve(false);}},60);});}
function finalVisualChecks(){
 var root=document.querySelector('#filin-master-product-v3 .v3-shell');state.rootReady=!!root;
 var im=document.querySelector('#filin-master-product-v3 .v3-main-img');state.mainImageReady=!!(im&&im.complete&&im.naturalWidth>1);
 var buy=arr(document.querySelectorAll('a,button')).some(function(x){var t=String(x.textContent||'').replace(/\s+/g,' ').trim();if(!/BUY NOW/i.test(t))return false;var p=x;for(var i=0;i<6&&p;i++,p=p.parentElement){try{var pos=getComputedStyle(p).position;if(pos==='fixed'||pos==='sticky')return true;}catch(e){}}return false;});
 state.headerReady=buy||!!document.querySelector('#filin-master-product-v3 .v3-buy');
}
async function boot(){
 try{
   if(!isNew){
     await load(LEGACY,function(){return!!window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS25__;});
     await wait(function(){var x=window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS25_STATE__;return x&&x.slug===PATH&&(x.ready===true||!!x.error);},110000);
     var o=window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS25_STATE__;
     if(o&&o.slug===PATH){state.ready=!!o.ready;state.error=o.error||'';finalVisualChecks();}
     pub();return;
   }
   await load(BATCH,function(){return!!window.__FILIN_GS2_DEMOGRAF_EXPANSION_BATCH_V21__;});
   state.batchLoaded=true;pub();
   state.batchReady=await wait(function(){var x=window.__FILIN_GS2_DEMOGRAF_EXPANSION_BATCH_V21_STATE__;return x&&x.slug===PATH&&(x.ready===true||!!x.error);},120000);
   var b=window.__FILIN_GS2_DEMOGRAF_EXPANSION_BATCH_V21_STATE__;
   if(!b||b.ready!==true)throw new Error('Demograf Expansion Batch V2.1 not ready: '+(b&&b.error||'timeout'));
   state.contractV3Ready=!!b.contractV3Ready;state.curationReady=!!b.curationReady;state.pmReady=!!b.pmReady;state.curatorReady=!!b.curatorReady;state.integrityReady=!!b.integrityReady;
   finalVisualChecks();
   state.ready=state.batchReady&&state.contractV3Ready&&state.curationReady&&state.pmReady&&state.curatorReady&&state.integrityReady&&state.rootReady&&state.mainImageReady&&state.headerReady;
   if(!state.ready)throw new Error('GS2.7 strict visual contract failed');
   state.error='';
 }catch(e){state.error=String(e&&e.message||e);state.ready=false;}
 pub();if(state.error)console.warn('[Filin Labs Golden Standard GS2.7]',state.error,state);else if(state.ready)console.info('[Filin Labs Golden Standard GS2.7] ready',state);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();pub();
})();