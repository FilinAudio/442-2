/* ============================================================
   FILIN LABS — GOLDEN SPEAKERS BATCH V18
   Minimal Grand Tower cleanup.

   User-approved behavior:
   - keep the working Golden page as-is;
   - remove ONLY the old duplicate curation block outside Golden V3;
   - do not touch gallery, hero, BUY NOW, Perfect Matches, tabs,
     specifications, reviews or recommendations.
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V18__) return;

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
  window.__FILIN_GOLDEN_SPEAKERS_BATCH_V18__=true;

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
    s.onerror=function(){console.error('[Golden Speakers V18] failed',u);};
    (document.head||document.documentElement).appendChild(s);
  }

  function norm(v){return String(v==null?'':v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
  function goldenRoot(){return document.getElementById('filin-master-product-v3');}
  function isInsideGolden(el){var g=goldenRoot();return !!(g&&el&&(el===g||g.contains(el)));}
  function visible(el){
    if(!el||!el.isConnected)return false;
    var s=getComputedStyle(el),r=el.getBoundingClientRect();
    return s.display!=='none'&&s.visibility!=='hidden'&&r.width>2&&r.height>2;
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

  function hide(el){
    if(!el||isInsideGolden(el)||el.dataset.fpV18Hidden==='1')return false;
    el.dataset.fpV18Hidden='1';
    el.dataset.fpV18Reason='grand-tower-old-curation';
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

  function findOldCuration(){
    if(!IS_GT)return [];
    var found=[];

    document.querySelectorAll('.fgt-curation,.fp-curation').forEach(function(el){
      if(!isInsideGolden(el)&&visible(el))found.push(el);
    });

    document.querySelectorAll('#allrecords section,#allrecords article,#allrecords div').forEach(function(el){
      if(isInsideGolden(el)||!visible(el))return;
      var t=norm(el.textContent||'');
      if(labelCount(t)<6)return;

      var childHas=Array.prototype.some.call(el.children||[],function(ch){
        return /^(SECTION|ARTICLE|DIV)$/i.test(ch.tagName||'')&&labelCount(norm(ch.textContent||''))>=6;
      });
      if(!childHas)found.push(el);
    });

    return found.filter(function(el,i,a){
      return el&&a.indexOf(el)===i&&!a.some(function(other){return other!==el&&el.contains(other);});
    });
  }

  var passes=0,hiddenTotal=0;
  function cleanup(){
    if(!IS_GT){
      window.__FILIN_GOLDEN_SPEAKERS_BATCH_V18_STATE__={version:'18.0.0',slug:slug,passThrough:true};
      return;
    }
    passes++;
    var old=findOldCuration(),hidden=0;
    old.forEach(function(el){if(hide(el))hidden++;});
    hiddenTotal+=hidden;

    window.__FILIN_GOLDEN_SPEAKERS_BATCH_V18_STATE__={
      version:'18.0.0',
      slug:slug,
      goldenRoots:document.querySelectorAll('#filin-master-product-v3').length,
      goldenCurationCards:document.querySelectorAll('#filin-master-product-v3 .v3-curation-item').length,
      visibleOldCuration:findOldCuration().length,
      hiddenByV18:document.querySelectorAll('[data-fp-v18-hidden="1"]').length,
      passes:passes
    };
  }

  function start(){
    cleanup();
    setTimeout(cleanup,700);
    setTimeout(cleanup,1800);

    if(IS_GT){
      var queued=false;
      var host=document.getElementById('allrecords')||document.body;
      var mo=new MutationObserver(function(mutations){
        var relevant=mutations.some(function(m){return m.type==='childList'&&(m.addedNodes.length||m.removedNodes.length);});
        if(!relevant||queued)return;
        queued=true;
        setTimeout(function(){queued=false;cleanup();},180);
      });
      mo.observe(host,{childList:true,subtree:true});
    }

    console.info('[Golden Speakers Batch V18] READY',{version:'18.0.0',slug:slug,targeted:IS_GT});
  }

  load(V10,'filin-golden-speakers-v10-from-v18',start);
})();
