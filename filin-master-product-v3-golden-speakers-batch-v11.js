/* ============================================================
   FILIN LABS — GOLDEN SPEAKERS BATCH V11
   Grand Tower exact legacy duplicate quarantine over V10.

   Why V10 missed it:
   the original Grand Tower unified T123 keeps .fgt-curation and
   .flp-slider inside the same legacy product container/record.
   Generic record-level protection therefore preserved them.

   V11 hides ONLY those legacy Grand Tower duplicates outside the
   Golden root. Product copy, gallery, Perfect Matches, tabs,
   specification, reviews and Golden curation remain untouched.
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V11__) return;

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
  window.__FILIN_GOLDEN_SPEAKERS_BATCH_V11__=true;

  var V10='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@102cc2b6e1e080c6749f1c617cf7a7540a9fe7f7/filin-master-product-v3-golden-speakers-batch-v10.js';
  var IS_GT=slug==='audioinstrument_grand_tower_speakers';

  function same(a,b){return String(a||'').split('?')[0]===String(b||'').split('?')[0];}
  function has(u){return Array.prototype.some.call(document.scripts||[],function(s){return same(s.src,u);});}
  function load(u,id,done){
    if(has(u)){done&&done();return;}
    var old=document.getElementById(id);
    if(old){done&&old.addEventListener('load',done,{once:true});return;}
    var s=document.createElement('script');
    s.id=id;s.src=u;s.async=false;
    s.onload=function(){done&&done();};
    s.onerror=function(){console.error('[Golden Speakers V11] failed',u);};
    (document.head||document.documentElement).appendChild(s);
  }

  if(IS_GT){
    document.documentElement.classList.add('fp-grand-tower-v11');
    var st=document.createElement('style');
    st.id='filin-grand-tower-v11-style';
    st.textContent='\
html.fp-grand-tower-v11 #filin-grand-tower-card .fgt-curation,\
html.fp-grand-tower-v11 #filin-grand-tower-card .flp-slider{\
 display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;max-height:0!important;\
 margin:0!important;padding:0!important;overflow:hidden!important;pointer-events:none!important\
}';
    (document.head||document.documentElement).appendChild(st);
  }

  function root(){return document.getElementById('filin-master-product-v3');}
  function norm(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}
  function outsideGolden(el){var r=root();return !!el && (!r || (el!==r && !r.contains(el)));}
  function visible(el){if(!el)return false;var s=getComputedStyle(el);return s.display!=='none'&&s.visibility!=='hidden'&&el.getBoundingClientRect().height>1;}
  function hide(el,reason){
    if(!el||!outsideGolden(el)) return false;
    el.dataset.fpV11Hidden='1';
    el.dataset.fpV11Reason=reason;
    el.style.setProperty('display','none','important');
    el.style.setProperty('visibility','hidden','important');
    el.style.setProperty('height','0','important');
    el.style.setProperty('min-height','0','important');
    el.style.setProperty('max-height','0','important');
    el.style.setProperty('margin','0','important');
    el.style.setProperty('padding','0','important');
    el.style.setProperty('overflow','hidden','important');
    el.style.setProperty('pointer-events','none','important');
    return true;
  }

  var LABELS=[
    /(?:CATHEGORY|CATEGORY)\s*&\s*BUDGET\s*TIER/i,
    /TAGS?\s*&\s*FEATURES/i,
    /SONIC\s*SIGNATURE/i,
    /CURATOR[’']?S\s*CHOICE/i,
    /HIGH\s*TECHNOLOGIES/i,
    /SYNERGY\s*MATCH/i,
    /GENRES?\s*ACCORD/i
  ];
  function labelCount(t){var n=0;LABELS.forEach(function(re){if(re.test(t))n++;});return n;}

  function cleanupGT(){
    if(!IS_GT) return 0;
    var hidden=0;

    /* Exact legacy sections from FILIN_GRAND_TOWER_UNIFIED_T123_V1. */
    document.querySelectorAll('#filin-grand-tower-card .fgt-curation').forEach(function(el){if(hide(el,'legacy-fgt-curation'))hidden++;});
    document.querySelectorAll('#filin-grand-tower-card .flp-slider').forEach(function(el){if(hide(el,'legacy-flp-promotions'))hidden++;});

    /* Older Tilda curation fragments that may live in the same protected record. */
    document.querySelectorAll('#allrecords .t491,#allrecords .t396').forEach(function(el){
      if(!outsideGolden(el)) return;
      var t=norm(el.textContent||'');
      if(labelCount(t)>=2){if(hide(el,'legacy-tilda-curation'))hidden++;}
    });

    /* Promotions fragment fallback: only outside Golden root and only when clearly marked. */
    document.querySelectorAll('#allrecords section,#allrecords div').forEach(function(el){
      if(!outsideGolden(el)) return;
      if(el.id==='filin-grand-tower-card') return;
      var title=el.querySelector&&el.querySelector(':scope > .flp-shell .flp-title, :scope > .flp-panel .flp-title');
      if(title && /PROMOTIONS/i.test(norm(title.textContent||''))){if(hide(el,'legacy-promotions-fragment'))hidden++;}
    });

    return hidden;
  }

  function publishState(){
    if(!IS_GT){
      window.__FILIN_GOLDEN_SPEAKERS_BATCH_V11_STATE__={version:'11.0.0',slug:slug,passThrough:true};
      return;
    }
    var legacyCur=Array.prototype.filter.call(document.querySelectorAll('#filin-grand-tower-card .fgt-curation'),visible).length;
    var legacyPromo=Array.prototype.filter.call(document.querySelectorAll('#filin-grand-tower-card .flp-slider'),visible).length;
    var state={
      version:'11.0.0',
      slug:slug,
      goldenRoots:document.querySelectorAll('#filin-master-product-v3').length,
      goldenCurationCards:document.querySelectorAll('#filin-master-product-v3 .v3-curation-item').length,
      hiddenByV11:document.querySelectorAll('[data-fp-v11-hidden="1"]').length,
      visibleLegacyCuration:legacyCur,
      visibleLegacyPromotions:legacyPromo
    };
    window.__FILIN_GOLDEN_SPEAKERS_BATCH_V11_STATE__=state;
    console.info('[Golden Speakers Batch V11] GRAND TOWER EXACT CLEANUP',state);
  }

  function start(){
    if(!IS_GT){publishState();return;}
    cleanupGT();
    var mo=new MutationObserver(function(){cleanupGT();});
    mo.observe(document.getElementById('allrecords')||document.body,{childList:true,subtree:true});
    var n=0,t=setInterval(function(){
      n++;cleanupGT();
      if(n===20||n===60||n===120) publishState();
      if(n>=160){clearInterval(t);publishState();}
    },50);
  }

  load(V10,'filin-golden-speakers-v10-from-v11',function(){
    start();
    console.info('[Golden Speakers Batch V11] READY',{version:'11.0.0',slug:slug,targeted:IS_GT});
  });
})();
