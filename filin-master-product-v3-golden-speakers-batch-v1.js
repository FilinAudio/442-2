/* ============================================================
   FILIN LABS — GOLDEN REFERENCE 1 / SPEAKERS BATCH V1
   Activates ONLY on the six approved speaker product paths.

   One-shot migration bootstrap:
   - derives product from pathname
   - normalizes/injects #product-data
   - loads pinned Rich Catalog
   - waits for the legacy page DOM so product-specific content can be captured
   - loads frozen Golden V3.3.2 core
   - loads Generic Profile Bridge V4
   - leaves every other site page untouched
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V1__) return;

  var path=(location.pathname||'/').replace(/\/+$/,'')||'/';
  var slug=path.replace(/^\//,'');

  var PRODUCTS={
    'demograf_clio_speakers':{
      id:'demograf-clio-speakers',brand:'Demograf Audio Equipment',model:'Clio',name:'Demograf Clio Lomo Floorstanding Speakers | Kinap 4a32 Drivers',price:5000
    },
    'perun_junior_hybrid_electrostatic_speakers':{
      id:'perun-junior-hybrid-electrostatic-speakers',brand:'Perun Audio',model:'Junior',name:'Perun Junior Speakers | Active Hybrid Electrostatic',price:20000
    },
    'perun_elder_electrostatic_speakers':{
      id:'perun-elder-electrostatic-speakers',brand:'Perun Audio',model:'Elder',name:'Perun Elder Bespoke Electrostatic Speakers | Active Full-Range',price:25000
    },
    'audioinstrument_tower_speakers':{
      id:'audioinstrument-tower-speakers',brand:'Audioinstrument',model:'TOWER',name:'Audioinstrument TOWER Speakers | 1+1 Voigt Pipe Floorstanding with Hungarian Sonido drivers',price:4500
    },
    'audioinstrument_power_speakers':{
      id:'audioinstrument-power-speakers',brand:'Audioinstrument',model:'POWER',name:'Audioinstrument POWER Speakers | 3-Way High-Sensitivity Towers with Hungarian Sonido drivers',price:6500
    },
    'audioinstrument_grand_tower_speakers':{
      id:'audioinstrument-grand-tower-speakers',brand:'Audioinstrument',model:'Grand Tower',name:'Audioinstrument Grand Tower Sonido | Bespoke 3-Way Floorstanding Speakers',price:15000
    }
  };

  var meta=PRODUCTS[slug];
  if(!meta) return;
  window.__FILIN_GOLDEN_SPEAKERS_BATCH_V1__=true;

  var VERSION='1.0.1';
  var RICH='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@ad33e4a4c7a11c65a7969cdf5e3b3655bfaa7327/filin-rich-product-catalog-v2-runtime.js';
  var CORE='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@e4de1ae708daa2966411d764f3d803af5b59ec17/filin-master-product-v3-3-2-golden-standard-runtime.js';
  var BRIDGE='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@6eb7d874ef424192f14f8643251a5aaecf5bd785/filin-master-product-v3-generic-profile-bridge-v4.js';

  document.documentElement.classList.add('fp-v7-boot');
  var style=document.createElement('style');
  style.id='filin-golden-speakers-batch-v1-style';
  style.textContent='html:not(.fp-v7-ready) .t-cover{visibility:hidden!important;}';
  (document.head||document.documentElement).appendChild(style);

  // Prevent an old standalone Registry V1 from re-owning these pages.
  window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__=true;

  function seed(){
    var node=document.getElementById('product-data');
    if(!node){
      node=document.createElement('script');
      node.type='application/json';
      node.id='product-data';
      (document.head||document.documentElement).appendChild(node);
    }
    var old={};
    try{old=JSON.parse(node.textContent||'{}')||{};}catch(e){}
    old.schemaVersion=1;
    old.id=meta.id;
    old.slug=slug;
    old.brand=meta.brand;
    old.model=meta.model;
    old.name=meta.name;
    old.category='speakers';
    old.commerce=old.commerce||{};
    old.commerce.currency='USD';
    old.commerce.regularPrice=meta.price;
    if(old.commerce.memberPrice===undefined)old.commerce.memberPrice=null;
    old.reviews=old.reviews||{};
    old.reviews.key=slug.replace(/_/g,'-');
    old.page=old.page||{};
    old.page.productPath='/'+slug;
    node.textContent=JSON.stringify(old,null,2);
  }

  function same(a,b){return String(a||'').split('?')[0]===String(b||'').split('?')[0];}
  function loaded(url){return Array.prototype.some.call(document.scripts||[],function(s){return same(s.src,url);});}
  function load(url,id,done){
    if(loaded(url)){done();return;}
    var old=document.getElementById(id);
    if(old){old.addEventListener('load',done,{once:true});return;}
    var s=document.createElement('script');
    s.id=id;s.src=url;s.async=false;
    s.onload=done;
    s.onerror=function(){console.error('[Golden Speakers Batch] failed to load',url);ready('load-failed');};
    (document.head||document.documentElement).appendChild(s);
  }
  function ready(reason){
    document.documentElement.classList.add('fp-v7-ready');
    document.documentElement.classList.remove('fp-v7-boot');
    console.info('[Golden Speakers Batch] READY',{version:VERSION,slug:slug,reason:reason});
  }

  function startGolden(){
    seed();
    console.info('[Golden Speakers Batch] START',{version:VERSION,slug:slug,path:path,readyState:document.readyState});
    load(RICH,'filin-golden-speakers-rich',function(){
      load(CORE,'filin-golden-speakers-core',function(){
        load(BRIDGE,'filin-golden-speakers-generic-v4',function(){
          var n=0;
          var timer=setInterval(function(){
            n++;
            var api=window.FilinMasterProductV3;
            var root=document.getElementById('filin-master-product-v3');
            if(api&&api.profiles&&api.profiles[slug]&&root){
              clearInterval(timer);ready('golden-applied');
            }else if(n>=140){
              clearInterval(timer);ready('apply-timeout');
            }
          },50);
        });
      });
    });
  }

  // Seed early so any compatibility code sees the correct identity.
  seed();

  // But wait for the page body before Golden V4 captures legacy
  // purchase / Perfect Matches / tabs / current product images.
  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',startGolden,{once:true});
  }else{
    setTimeout(startGolden,0);
  }

  setTimeout(function(){
    if(!document.documentElement.classList.contains('fp-v7-ready'))ready('global-fail-open');
  },8000);
})();
