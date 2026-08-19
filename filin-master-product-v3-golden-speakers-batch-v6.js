/* ============================================================
   FILIN LABS — GOLDEN REFERENCE 1 / SPEAKERS BATCH V6
   Stable wrapper: V2 migration + Source Fixer V2 + Live Fixer V4.

   V6 fixes the V5 gallery regression by taking product images from
   the real live Tilda DOM after migration (hidden legacy records are
   still present), while Source Fixer V2 remains responsible for the
   already-successful 7/7 curation reconstruction.
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V6__) return;

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
  window.__FILIN_GOLDEN_SPEAKERS_BATCH_V6__=true;

  var V2='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@bc5ba7fc49a2adff7fe810e6778147d89ffb269f/filin-master-product-v3-golden-speakers-batch-v2.js';
  var CUR='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@5efaee1e23975adb06575af562543e8120d212a7/filin-master-product-v3-golden-speakers-source-fixer-v2.js';
  var LIVE='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@d349a5c32f7edaaaba74b2a9b04e19b8e9f4e00d/filin-master-product-v3-golden-speakers-live-fixer-v4.js';

  function same(a,b){return String(a||'').split('?')[0]===String(b||'').split('?')[0];}
  function has(url){return Array.prototype.some.call(document.scripts||[],function(s){return same(s.src,url);});}
  function load(url,id,done){
    if(has(url)){done&&done();return;}
    var old=document.getElementById(id);
    if(old){
      if(old.dataset.fpLoaded==='1'){done&&done();return;}
      if(done)old.addEventListener('load',done,{once:true});
      return;
    }
    var s=document.createElement('script');
    s.id=id;s.src=url;s.async=false;
    s.onload=function(){s.dataset.fpLoaded='1';done&&done();};
    s.onerror=function(){console.error('[Golden Speakers Batch V6] failed',url);};
    (document.head||document.documentElement).appendChild(s);
  }

  load(V2,'filin-golden-speakers-v2-from-v6',function(){
    load(CUR,'filin-golden-speakers-curation-v2-from-v6',function(){
      load(LIVE,'filin-golden-speakers-live-v4-from-v6',function(){
        console.info('[Golden Speakers Batch V6] LIVE FIXER LOADED',{version:'6.0.0',slug:slug});
      });
    });
  });
})();
