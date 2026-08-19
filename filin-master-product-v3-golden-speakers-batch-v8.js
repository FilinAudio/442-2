/* ============================================================
   FILIN LABS — GOLDEN SPEAKERS BATCH V8
   V7 + targeted cleanup for Clio and Grand Tower only.

   Fixes:
   - Demograf Clio: synthesize missing black curator strip
   - Demograf Clio: hide legacy duplicate overview/curation/promo records
   - Grand Tower: hide legacy duplicate curation/promo scrollers
   - leaves TOWER / POWER / Perun Junior / Perun Elder untouched
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V8__) return;

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

  window.__FILIN_GOLDEN_SPEAKERS_BATCH_V8__=true;

  var V7='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@abad23131efdf32330426ac3e4d4a6b231a63402/filin-master-product-v3-golden-speakers-batch-v7.js';
  var TARGETED=(slug==='demograf_clio_speakers'||slug==='audioinstrument_grand_tower_speakers');
  var LABELS=[
    /(?:CATHEGORY|CATEGORY)\s*&\s*BUDGET\s*TIER/i,
    /TAGS?\s*&\s*FEATURES/i,
    /SONIC\s*SIGNATURE/i,
    /CURATOR[’']?S\s*CHOICE/i,
    /HIGH\s*TECHNOLOGIES/i,
    /SYNERGY\s*MATCH/i,
    /GENRES?\s*ACCORD/i
  ];

  function same(a,b){return String(a||'').split('?')[0]===String(b||'').split('?')[0];}
  function has(u){return Array.prototype.some.call(document.scripts||[],function(s){return same(s.src,u);});}
  function load(u,id,done){
    if(has(u)){done&&done();return;}
    var old=document.getElementById(id);
    if(old){if(done)old.addEventListener('load',done,{once:true});return;}
    var s=document.createElement('script');s.id=id;s.src=u;s.async=false;
    s.onload=function(){done&&done();};
    s.onerror=function(){console.error('[Golden Speakers V8] failed',u);};
    (document.head||document.documentElement).appendChild(s);
  }
  function norm(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}
  function countLabels(t){var n=0;LABELS.forEach(function(re){if(re.test(t))n++;});return n;}
  function root(){return document.getElementById('filin-master-product-v3');}
  function protectedRec(rec){
    if(!rec) return true;
    if(rec.querySelector&&rec.querySelector('#filin-master-product-v3')) return true;
    if(rec.classList&&rec.classList.contains('fp-v3-curator-record')) return true;
    if(rec.querySelector&&rec.querySelector('.fp-v3-hero-cover')) return true;
    if(rec.closest&&rec.closest('header,footer')) return true;
    if(rec.querySelector&&rec.querySelector('.t-menuwidgeticons,.t228,.t450,.t706')) return true;
    return false;
  }
  function promoLike(rec,t){
    if(/\bPROMOTIONS\b|YOU MAY ALSO LIKE|RELATED PRODUCTS|SPECIAL OFFERS/i.test(t)) return true;
    var cards=0;
    try{cards=rec.querySelectorAll('.t-store__card,.js-store-prod-name,.t-card__title').length;}catch(e){}
    if(cards>=2 && /(BUY NOW|VIEW)/i.test(t)) return true;
    return false;
  }
  function clioLegacyOverview(t){
    return /Demograf\s+["“]?Clio["”]?\s+Floorstanding\s+Loudspeakers/i.test(t) && t.length>220;
  }
  function hideRec(rec,reason){
    if(!rec||rec.dataset.fpV8Hidden==='1') return false;
    rec.dataset.fpV8Hidden='1';
    rec.dataset.fpV8Reason=reason;
    rec.style.setProperty('display','none','important');
    rec.style.setProperty('visibility','hidden','important');
    rec.style.setProperty('height','0','important');
    rec.style.setProperty('min-height','0','important');
    rec.style.setProperty('margin','0','important');
    rec.style.setProperty('padding','0','important');
    rec.style.setProperty('overflow','hidden','important');
    return true;
  }
  function synthClioCurator(){
    if(slug!=='demograf_clio_speakers') return false;
    if(document.querySelector('.fp-v3-curator-record')) return false;
    var r=root(); if(!r||!r.parentNode) return false;
    var sec=document.createElement('section');
    sec.className='fp-v3-curator-record fp-v3-curator-synthetic';
    sec.setAttribute('data-fp-v8-curator','1');
    var div=document.createElement('div');
    div.className='fp-v3-curator-text';
    div.textContent='Handcrafted by Demograf Audio. Personally selected & curated by Filin Labs Kazakhstan.';
    sec.appendChild(div);
    r.parentNode.insertBefore(sec,r);
    return true;
  }
  function cleanup(){
    if(!TARGETED) return {hidden:0,curatorCreated:false};
    var r=root(); if(!r) return null;
    var hidden=0;
    Array.prototype.forEach.call(document.querySelectorAll('#allrecords .t-rec'),function(rec){
      if(protectedRec(rec)) return;
      var t=norm(rec.textContent||'');
      var labels=countLabels(t);
      var reason='';
      if(labels>=3) reason='legacy-curation';
      else if(promoLike(rec,t)) reason='legacy-promo';
      else if(slug==='demograf_clio_speakers'&&clioLegacyOverview(t)) reason='legacy-clio-overview';
      if(reason && hideRec(rec,reason)) hidden++;
    });
    var curatorCreated=synthClioCurator();
    var state={
      version:'8.0.0',slug:slug,hidden:document.querySelectorAll('[data-fp-v8-hidden="1"]').length,
      curatorCreated:!!document.querySelector('[data-fp-v8-curator="1"]'),
      curatorCount:document.querySelectorAll('.fp-v3-curator-record').length,
      goldenRoots:document.querySelectorAll('#filin-master-product-v3').length,
      curationCards:document.querySelectorAll('#filin-master-product-v3 .v3-curation-item').length,
      galleryImages:document.querySelectorAll('#filin-master-product-v3 .v3-gallery .v3-thumb').length
    };
    window.__FILIN_GOLDEN_SPEAKERS_BATCH_V8_STATE__=state;
    return state;
  }
  function startCleanup(){
    if(!TARGETED){
      window.__FILIN_GOLDEN_SPEAKERS_BATCH_V8_STATE__={version:'8.0.0',slug:slug,passThrough:true};
      return;
    }
    var tries=0;
    var timer=setInterval(function(){
      tries++;
      var live=window.__FILIN_GOLDEN_SPEAKERS_LIVE_FIXER_V4_STATE__;
      if(root()&&live&&live.slug===slug&&Number(live.curation||0)===7){
        var st=cleanup();
        if(st){
          clearInterval(timer);
          console.info('[Golden Speakers Batch V8] CLEANUP APPLIED',st);
          var mo=new MutationObserver(function(){cleanup();});
          mo.observe(document.getElementById('allrecords')||document.body,{childList:true,subtree:true});
          setTimeout(function(){try{mo.disconnect();}catch(e){} cleanup();},5000);
        }
      }else if(tries>=240){
        clearInterval(timer);
        console.warn('[Golden Speakers Batch V8] cleanup timeout',{slug:slug});
      }
    },50);
  }

  load(V7,'filin-golden-speakers-v7-from-v8',function(){
    startCleanup();
    console.info('[Golden Speakers Batch V8] READY',{version:'8.0.0',slug:slug,targetedCleanup:TARGETED});
  });
})();
