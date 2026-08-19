/* ============================================================
   FILIN LABS — GOLDEN REFERENCE 1 / SPEAKERS BATCH V5
   Stable wrapper: V2 migration + Source Fixer V3.

   V5 fixes:
   - keeps all real product gallery images from the dominant T396 image cluster
   - rejects Tilda /-/resize/... low-res preview duplicates
   - excludes menu/recommendation/promo records
   - restores all 7 curation rows
   - keeps backward-compatible pre-paint release state
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V5__) return;

  var slug=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
  var allowed={
    demograf_clio_speakers:1,
    perun_junior_hybrid_electrostatic_speakers:1,
    perun_elder_electrostatic_speakers:1,
    audioinstrument_tower_speakers:1,
    audioinstrument_power_speakers:1,
    audioinstrument_grand_tower_speakers:1
  };
  if(!allowed[slug]) return;
  window.__FILIN_GOLDEN_SPEAKERS_BATCH_V5__=true;

  var V2='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@bc5ba7fc49a2adff7fe810e6778147d89ffb269f/filin-master-product-v3-golden-speakers-batch-v2.js';
  var FIX='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@3cb029613e953abdf012ec377dd2b005811bfc51/filin-master-product-v3-golden-speakers-source-fixer-v3.js';

  function same(a,b){return String(a||'').split('?')[0]===String(b||'').split('?')[0];}
  function has(url){return Array.prototype.some.call(document.scripts||[],function(s){return same(s.src,url);});}
  function load(url,id,done){
    if(has(url)){done&&done();return;}
    var old=document.getElementById(id);
    if(old){if(done)old.addEventListener('load',done,{once:true});return;}
    var s=document.createElement('script');s.id=id;s.src=url;s.async=false;
    if(done)s.onload=done;
    s.onerror=function(){console.error('[Golden Speakers Batch V5] failed',url);};
    (document.head||document.documentElement).appendChild(s);
  }

  load(V2,'filin-golden-speakers-v2-from-v5',function(){
    load(FIX,'filin-golden-speakers-source-fixer-v3-from-v5',function(){
      console.info('[Golden Speakers Batch V5] SOURCE FIXER V3 LOADED',{version:'5.0.0',slug:slug});
    });
  });
})();
