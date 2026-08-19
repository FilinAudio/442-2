/* ============================================================
   FILIN LABS — GOLDEN REFERENCE 1 / SPEAKERS BATCH V3
   Stable wrapper: V2 migration + Fixer V1.

   V3 adds:
   - filters Tilda /lib/icons/*.svg out of hero/gallery
   - restores the complete legacy curation rows with icons
   - keeps real raster product images only
   - copies legacy data-* product attributes to Golden cart node
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V3__) return;

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
  window.__FILIN_GOLDEN_SPEAKERS_BATCH_V3__=true;

  var V2='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@bc5ba7fc49a2adff7fe810e6778147d89ffb269f/filin-master-product-v3-golden-speakers-batch-v2.js';
  var FIX='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@fb4d9ff3bd8f1d8b30191432b81b0b18d1c5189e/filin-master-product-v3-golden-speakers-fixer-v1.js';

  function same(a,b){return String(a||'').split('?')[0]===String(b||'').split('?')[0];}
  function has(url){return Array.prototype.some.call(document.scripts||[],function(s){return same(s.src,url);});}
  function load(url,id,done){
    if(has(url)){done&&done();return;}
    var old=document.getElementById(id);
    if(old){if(done)old.addEventListener('load',done,{once:true});return;}
    var s=document.createElement('script');s.id=id;s.src=url;s.async=false;
    if(done)s.onload=done;
    s.onerror=function(){console.error('[Golden Speakers Batch V3] failed',url);};
    (document.head||document.documentElement).appendChild(s);
  }

  load(V2,'filin-golden-speakers-v2-from-v3',function(){
    load(FIX,'filin-golden-speakers-fixer-v1-from-v3',function(){
      console.info('[Golden Speakers Batch V3] FIXER LOADED',{version:'3.0.0',slug:slug});
    });
  });
})();
