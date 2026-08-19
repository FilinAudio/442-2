/* ============================================================
   FILIN LABS — GOLDEN SPEAKERS BATCH V13
   Grand Tower DOM-structure cleanup over V12.

   Fixes the two duplicates still visible in the real browser DOM:
   1) legacy curation block identified by its 7 labels, even when it
      sits inside a container that V11/V12 treated as protected;
   2) legacy "HI-FI & HIGH-END EQUIPMENT" product grid/slider.

   Keeps:
   - #filin-master-product-v3 Golden root
   - Golden .v3-curation / .v3-curation-item
   - Golden gallery, BUY NOW, Perfect Matches, tabs/spec/reviews
   - the compact Golden recommendation scroller
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V13__) return;

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
  window.__FILIN_GOLDEN_SPEAKERS_BATCH_V13__=true;

  var V12='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@0ff54c381773b36d73dbe51f37078a6659ee97d4/filin-master-product-v3-golden-speakers-batch-v12.js';
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
    s.onerror=function(){console.error('[Golden Speakers V13] failed',u);};
    (document.head||document.documentElement).appendChild(s);
  }

  function root(){return document.getElementById('filin-master-product-v3');}
  function norm(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}
  function visible(el){
    if(!el||!el.isConnected) return false;
    var s=getComputedStyle(el),r=el.getBoundingClientRect();
    return s.display!=='none'&&s.visibility!=='hidden'&&r.width>2&&r.height>2;
  }
  function hide(el,reason){
    if(!el||el.dataset.fpV13Hidden==='1') return false;
    el.dataset.fpV13Hidden='1';
    el.dataset.fpV13Reason=reason;
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
  function isGoldenCuration(el){
    return !!(el && (el.matches&&el.matches('.v3-curation,.v3-curation-item') ||
      el.closest&&el.closest('.v3-curation') ||
      el.querySelector&&el.querySelector('.v3-curation-item')));
  }

  function minimalLegacyCurationCandidates(){
    var all=Array.prototype.slice.call(document.querySelectorAll('#allrecords section,#allrecords article,#allrecords div'));
    return all.filter(function(el){
      if(!visible(el)||isGoldenCuration(el)) return false;
      var t=norm(el.textContent||'');
      if(labelCount(t)<6) return false;
      var children=Array.prototype.slice.call(el.querySelectorAll(':scope > section,:scope > article,:scope > div'));
      var childHasSame=children.some(function(ch){
        return visible(ch)&&!isGoldenCuration(ch)&&labelCount(norm(ch.textContent||''))>=6;
      });
      return !childHasSame;
    });
  }

  function findHiFiEquipmentBlocks(){
    var hits=[];
    Array.prototype.forEach.call(document.querySelectorAll('#allrecords h1,#allrecords h2,#allrecords h3,#allrecords h4,#allrecords div,#allrecords span,#allrecords p'),function(el){
      if(!visible(el)) return;
      var own=norm(el.textContent||'');
      if(!/HI-?FI\s*&\s*HIGH-?END\s*EQUIPMENT/i.test(own)) return;
      var cur=el,best=null,steps=0;
      while(cur&&steps<8){
        if(cur.id==='filin-master-product-v3') break;
        var imgs=cur.querySelectorAll?cur.querySelectorAll('img').length:0;
        var clicks=cur.querySelectorAll?cur.querySelectorAll('a,button').length:0;
        if(imgs>=4&&clicks>=4){best=cur;break;}
        cur=cur.parentElement;steps++;
      }
      if(best&&hits.indexOf(best)<0) hits.push(best);
    });
    return hits;
  }

  function cleanup(){
    if(!IS_GT) return {curation:0,hifi:0};
    var c=0,h=0;
    minimalLegacyCurationCandidates().forEach(function(el){if(hide(el,'legacy-curation-by-content'))c++;});
    findHiFiEquipmentBlocks().forEach(function(el){if(hide(el,'legacy-hifi-highend-grid'))h++;});
    return {curation:c,hifi:h};
  }

  function countVisibleLegacyCuration(){
    return minimalLegacyCurationCandidates().filter(visible).length;
  }
  function countVisibleHiFi(){
    return findHiFiEquipmentBlocks().filter(visible).length;
  }
  function publish(extra){
    if(!IS_GT){
      window.__FILIN_GOLDEN_SPEAKERS_BATCH_V13_STATE__={version:'13.0.0',slug:slug,passThrough:true};
      return;
    }
    var st={
      version:'13.0.0',
      slug:slug,
      goldenRoots:document.querySelectorAll('#filin-master-product-v3').length,
      goldenCurationCards:document.querySelectorAll('#filin-master-product-v3 .v3-curation-item').length,
      hiddenByV13:document.querySelectorAll('[data-fp-v13-hidden="1"]').length,
      visibleLegacyCurationByContent:countVisibleLegacyCuration(),
      visibleHiFiHighEndEquipment:countVisibleHiFi(),
      compactRecommendationBlocks:document.querySelectorAll('#filin-master-product-v3 [class*="recommend"],#filin-master-product-v3 [class*="related"],#filin-master-product-v3 [class*="slider"]').length
    };
    if(extra){st.hiddenCurationThisPass=extra.curation;st.hiddenHiFiThisPass=extra.hifi;}
    window.__FILIN_GOLDEN_SPEAKERS_BATCH_V13_STATE__=st;
    console.info('[Golden Speakers Batch V13] GRAND TOWER CONTENT CLEANUP',st);
  }

  function start(){
    if(!IS_GT){publish();return;}
    var r=cleanup();publish(r);
    var mo=new MutationObserver(function(){var x=cleanup();if(x.curation||x.hifi)publish(x);});
    mo.observe(document.getElementById('allrecords')||document.body,{childList:true,subtree:true});
    var n=0,t=setInterval(function(){
      n++;var x=cleanup();
      if(x.curation||x.hifi||n===20||n===60||n===120)publish(x);
      if(n>=160){clearInterval(t);publish(x);}
    },50);
  }

  load(V12,'filin-golden-speakers-v12-from-v13',function(){
    start();
    console.info('[Golden Speakers Batch V13] READY',{version:'13.0.0',slug:slug,targeted:IS_GT});
  });
})();
