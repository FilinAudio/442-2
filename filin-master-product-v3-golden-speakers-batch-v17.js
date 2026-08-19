/* ============================================================
   FILIN LABS — GOLDEN SPEAKERS BATCH V17
   CLEAN CHAIN CUT + STABLE GRAND TOWER CARDINALITY.

   Key change vs V16:
   - DOES NOT load V14/V13/V12/V11/V16/V15.
   - loads the last useful foundation V10 directly.
   - carries only the proven 1-curation / 1-promotions dedupe.
   - no polling watchdog; debounced childList observer + 2 safety passes.
   - no repeated console spam; logs only READY / real cardinality changes.

   Purpose: remove failed experimental patch chain while preserving the
   current visual result for the six approved speaker pages.
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V17__) return;

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
  window.__FILIN_GOLDEN_SPEAKERS_BATCH_V17__=true;

  var V10='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@102cc2b6e1e080c6749f1c617cf7a7540a9fe7f7/filin-master-product-v3-golden-speakers-batch-v10.js';
  var IS_GT=slug==='audioinstrument_grand_tower_speakers';

  function same(a,b){return String(a||'').split('?')[0]===String(b||'').split('?')[0];}
  function has(u){return Array.prototype.some.call(document.scripts||[],function(s){return same(s.src,u);});}
  function load(u,id,done){
    if(has(u)){done&&done();return;}
    var old=document.getElementById(id);
    if(old){
      if(old.dataset.fpLoaded==='1'){done&&done();return;}
      done&&old.addEventListener('load',done,{once:true});
      return;
    }
    var s=document.createElement('script');
    s.id=id;s.src=u;s.async=false;
    s.onload=function(){s.dataset.fpLoaded='1';done&&done();};
    s.onerror=function(){console.error('[Golden Speakers V17] failed',u);};
    (document.head||document.documentElement).appendChild(s);
  }

  function norm(v){return String(v==null?'':v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
  function visible(el){
    if(!el||!el.isConnected)return false;
    var s=getComputedStyle(el),r=el.getBoundingClientRect();
    return s.display!=='none'&&s.visibility!=='hidden'&&Number(s.opacity||1)!==0&&r.width>2&&r.height>2;
  }
  function uniq(arr){return arr.filter(function(x,i){return x&&arr.indexOf(x)===i;});}
  function goldenRoot(){return document.getElementById('filin-master-product-v3');}
  function isGolden(el){var g=goldenRoot();return !!(g&&el&&(el===g||g.contains(el)));}
  function overlap(a,b){return !!(a&&b&&(a===b||a.contains(b)||b.contains(a)));}

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

  function explicitCuration(){
    return uniq(Array.prototype.slice.call(document.querySelectorAll(
      '#filin-master-product-v3 .v3-curation-wrap,'+
      '#filin-master-product-v3 .v3-curation,'+
      '.fgt-curation,.fp-curation'
    )).map(function(el){return el.closest('.v3-curation-wrap,.fgt-curation,.fp-curation')||el;}));
  }
  function contentCuration(explicit){
    var nodes=Array.prototype.slice.call(document.querySelectorAll('#allrecords section,#allrecords article,#allrecords div'));
    var found=[];
    nodes.forEach(function(el){
      if(!visible(el))return;
      if(explicit.some(function(x){return overlap(x,el);}))return;
      var t=norm(el.textContent||'');
      if(labelCount(t)<6)return;
      var childHas=Array.prototype.some.call(el.children||[],function(ch){
        return /^(SECTION|ARTICLE|DIV)$/i.test(ch.tagName||'')&&labelCount(norm(ch.textContent||''))>=6;
      });
      if(!childHas)found.push(el);
    });
    return uniq(found);
  }
  function curationSets(){var ex=explicitCuration();return uniq(ex.concat(contentCuration(ex)));}

  function explicitPromos(){
    return uniq(Array.prototype.slice.call(document.querySelectorAll(
      '#filin-master-product-v3 .v3-promotions,.flp-slider'
    )));
  }
  function promoSignal(el){
    var t=norm(el.textContent||'');
    if(!/HI-?FI\s*&\s*HIGH-?END\s*EQUIPMENT/i.test(t)&&!/\bPROMOTIONS\b/i.test(t))return false;
    var imgs=el.querySelectorAll?el.querySelectorAll('img').length:0;
    var actions=el.querySelectorAll?el.querySelectorAll('a,button').length:0;
    return imgs>=2&&actions>=2;
  }
  function contentPromos(explicit){
    var hits=[];
    Array.prototype.forEach.call(document.querySelectorAll('#allrecords h1,#allrecords h2,#allrecords h3,#allrecords h4,#allrecords div,#allrecords section'),function(seed){
      if(!visible(seed))return;
      var own=norm(seed.textContent||'');
      if(!/HI-?FI\s*&\s*HIGH-?END\s*EQUIPMENT/i.test(own)&&!/\bPROMOTIONS\b/i.test(own))return;
      var cur=seed,best=null,steps=0;
      while(cur&&steps<10){
        if(explicit.some(function(x){return overlap(x,cur);})) {best=null;break;}
        if(promoSignal(cur)){best=cur;break;}
        cur=cur.parentElement;steps++;
      }
      if(best&&!hits.some(function(x){return overlap(x,best);}))hits.push(best);
    });
    return uniq(hits);
  }
  function promoSets(){var ex=explicitPromos();return uniq(ex.concat(contentPromos(ex)));}

  function hide(el,reason){
    if(!el||!el.isConnected)return false;
    var g=goldenRoot();
    if(g&&el.contains(g))return false;
    if(el.dataset.fpV17Hidden==='1')return false;
    el.dataset.fpV17Hidden='1';
    el.dataset.fpV17Reason=reason;
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
  function chooseKeep(list,type){
    var v=list.filter(visible);
    if(!v.length)return null;
    var golden=v.find(isGolden);if(golden)return golden;
    if(type==='curation'){
      var c=v.find(function(x){return x.matches&&x.matches('.fgt-curation,.fp-curation');});if(c)return c;
    }
    if(type==='promo'){
      var p=v.find(function(x){return x.matches&&x.matches('.flp-slider');});if(p)return p;
    }
    return v[0];
  }

  var passes=0,lastSignature='';
  function publish(extra,forceLog){
    var cs=IS_GT?curationSets():[],ps=IS_GT?promoSets():[];
    var st={
      version:'17.0.0',slug:slug,
      goldenRoots:document.querySelectorAll('#filin-master-product-v3').length,
      goldenCurationCards:document.querySelectorAll('#filin-master-product-v3 .v3-curation-item').length,
      goldenPromotionBlocks:document.querySelectorAll('#filin-master-product-v3 .v3-promotions').length,
      visibleCurationSets:cs.filter(visible).length,
      visiblePromotionSets:ps.filter(visible).length,
      hiddenByV17:document.querySelectorAll('[data-fp-v17-hidden="1"]').length,
      passes:passes,
      oldPatchScripts:Array.prototype.filter.call(document.scripts,function(s){return /golden-speakers-batch-v1[1-6]\.js/i.test(s.src||'');}).length
    };
    if(extra)Object.keys(extra).forEach(function(k){st[k]=extra[k];});
    window.__FILIN_GOLDEN_SPEAKERS_BATCH_V17_STATE__=st;
    var sig=[st.goldenRoots,st.goldenCurationCards,st.goldenPromotionBlocks,st.visibleCurationSets,st.visiblePromotionSets,st.hiddenByV17,st.oldPatchScripts].join('|');
    if(forceLog||sig!==lastSignature){
      lastSignature=sig;
      console.info('[Golden Speakers Batch V17] STABLE',st);
    }
    return st;
  }

  function enforce(forceLog){
    if(!IS_GT){publish(null,forceLog);return;}
    passes++;
    var cs=curationSets(),ps=promoSets();
    var cBefore=cs.filter(visible).length,pBefore=ps.filter(visible).length;
    var keepC=chooseKeep(cs,'curation'),keepP=chooseKeep(ps,'promo');
    var hiddenC=0,hiddenP=0;
    if(cBefore>1&&keepC){
      cs.filter(visible).forEach(function(el){
        if(el===keepC||overlap(el,keepC))return;
        if(hide(el,'duplicate-curation-set'))hiddenC++;
      });
    }
    if(pBefore>1&&keepP){
      ps.filter(visible).forEach(function(el){
        if(el===keepP||overlap(el,keepP))return;
        if(hide(el,'duplicate-recommendations-scroller'))hiddenP++;
      });
    }
    publish({
      curationBefore:cBefore,promoBefore:pBefore,
      hiddenCurationThisPass:hiddenC,hiddenPromoThisPass:hiddenP,
      keepCurationGolden:!!(keepC&&isGolden(keepC)),
      keepPromoGolden:!!(keepP&&isGolden(keepP))
    },forceLog||hiddenC>0||hiddenP>0);
  }

  function start(){
    if(!IS_GT){publish(null,true);return;}
    enforce(true);
    var queued=false;
    function schedule(){
      if(queued)return;queued=true;
      setTimeout(function(){queued=false;enforce(false);},220);
    }
    var host=document.getElementById('allrecords')||document.body;
    var mo=new MutationObserver(function(mutations){
      var relevant=mutations.some(function(m){return m.type==='childList'&&(m.addedNodes.length||m.removedNodes.length);});
      if(relevant)schedule();
    });
    mo.observe(host,{childList:true,subtree:true});
    setTimeout(function(){enforce(false);},1200);
    setTimeout(function(){enforce(false);},3200);
  }

  load(V10,'filin-golden-speakers-v10-from-v17',function(){
    start();
    console.info('[Golden Speakers Batch V17] READY',{version:'17.0.0',slug:slug,targeted:IS_GT});
  });
})();
