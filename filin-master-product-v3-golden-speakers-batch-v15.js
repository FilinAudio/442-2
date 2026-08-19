/* ============================================================
   FILIN LABS — GOLDEN SPEAKERS BATCH V15
   GRAND TOWER CARDINALITY DEDUPE over V14.

   Why V15 exists:
   V14 proved that the visible lower blocks are not necessarily children
   of #filin-grand-tower-card. Some are rendered/re-rendered later by
   Golden V3/Tilda/Swiper. Therefore V15 no longer depends on one legacy
   parent id.

   Contract for Grand Tower:
   - exactly ONE visible curation set (7 curator cards)
   - exactly ONE visible recommendations/promotions scroller
   - prefer the Golden V3 versions when both Golden and legacy copies exist
   - never remove the only remaining valid block
   - keep watching late Tilda/Swiper DOM injections
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V15__) return;

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
  window.__FILIN_GOLDEN_SPEAKERS_BATCH_V15__=true;

  var V14='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@7d8a2c179bdea2a913a29e7c6c353029a4deb8b6/filin-master-product-v3-golden-speakers-batch-v14.js';
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
    s.onerror=function(){console.error('[Golden Speakers V15] failed',u);};
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
    )).map(function(el){
      return el.closest('.v3-curation-wrap,.fgt-curation,.fp-curation')||el;
    }));
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

  function curationSets(){
    var ex=explicitCuration();
    return uniq(ex.concat(contentCuration(ex)));
  }

  function explicitPromos(){
    return uniq(Array.prototype.slice.call(document.querySelectorAll(
      '#filin-master-product-v3 .v3-promotions,.flp-slider'
    )));
  }

  function promoSignal(el){
    var t=norm(el.textContent||'');
    var title=/HI-?FI\s*&\s*HIGH-?END\s*EQUIPMENT/i.test(t)||/\bPROMOTIONS\b/i.test(t);
    if(!title)return false;
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

  function promoSets(){
    var ex=explicitPromos();
    return uniq(ex.concat(contentPromos(ex)));
  }

  function hide(el,reason){
    if(!el||!el.isConnected)return false;
    var g=goldenRoot();
    if(g&&el.contains(g))return false;
    if(el.dataset.fpV15Hidden==='1')return false;
    el.dataset.fpV15Hidden='1';
    el.dataset.fpV15Reason=reason;
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
    var golden=v.find(isGolden);
    if(golden)return golden;
    if(type==='curation'){
      var exact=v.find(function(x){return x.matches&&x.matches('.fgt-curation,.fp-curation');});
      if(exact)return exact;
    }
    if(type==='promo'){
      var exactP=v.find(function(x){return x.matches&&x.matches('.flp-slider');});
      if(exactP)return exactP;
    }
    return v[0];
  }

  var totalHidden=0;
  var passes=0;
  function enforce(){
    if(!IS_GT){publish();return;}
    passes++;

    var cs=curationSets();
    var ps=promoSets();
    var cBefore=cs.filter(visible).length;
    var pBefore=ps.filter(visible).length;
    var keepC=chooseKeep(cs,'curation');
    var keepP=chooseKeep(ps,'promo');
    var hiddenC=0,hiddenP=0;

    if(cBefore>1&&keepC){
      cs.filter(visible).forEach(function(el){
        if(el===keepC||overlap(el,keepC))return;
        if(hide(el,'duplicate-curation-set')){hiddenC++;totalHidden++;}
      });
    }
    if(pBefore>1&&keepP){
      ps.filter(visible).forEach(function(el){
        if(el===keepP||overlap(el,keepP))return;
        if(hide(el,'duplicate-recommendations-scroller')){hiddenP++;totalHidden++;}
      });
    }

    publish({
      curationBefore:cBefore,
      promoBefore:pBefore,
      hiddenCurationThisPass:hiddenC,
      hiddenPromoThisPass:hiddenP,
      keepCurationGolden:!!(keepC&&isGolden(keepC)),
      keepPromoGolden:!!(keepP&&isGolden(keepP))
    });
  }

  function publish(extra){
    var cs=IS_GT?curationSets():[];
    var ps=IS_GT?promoSets():[];
    var st={
      version:'15.0.0',
      slug:slug,
      goldenRoots:document.querySelectorAll('#filin-master-product-v3').length,
      goldenCurationCards:document.querySelectorAll('#filin-master-product-v3 .v3-curation-item').length,
      goldenPromotionBlocks:document.querySelectorAll('#filin-master-product-v3 .v3-promotions').length,
      visibleCurationSets:cs.filter(visible).length,
      visiblePromotionSets:ps.filter(visible).length,
      hiddenByV15:document.querySelectorAll('[data-fp-v15-hidden="1"]').length,
      passes:passes
    };
    if(extra)Object.keys(extra).forEach(function(k){st[k]=extra[k];});
    window.__FILIN_GOLDEN_SPEAKERS_BATCH_V15_STATE__=st;
    if(IS_GT)console.info('[Golden Speakers Batch V15] GRAND TOWER CARDINALITY',st);
    else console.info('[Golden Speakers Batch V15] PASS THROUGH',{version:'15.0.0',slug:slug});
  }

  function start(){
    if(!IS_GT){publish();return;}
    var queued=false;
    function schedule(){
      if(queued)return;queued=true;
      setTimeout(function(){queued=false;enforce();},90);
    }
    enforce();
    var host=document.getElementById('allrecords')||document.body;
    var mo=new MutationObserver(schedule);
    mo.observe(host,{childList:true,subtree:true,attributes:true,attributeFilter:['class','style']});

    // Tilda/Swiper can finish after the initial product runtime. Keep an
    // inexpensive watchdog during the first minute as well.
    var n=0;
    var timer=setInterval(function(){
      n++;enforce();
      if(n>=120)clearInterval(timer);
    },500);
  }

  load(V14,'filin-golden-speakers-v14-from-v15',function(){
    start();
    console.info('[Golden Speakers Batch V15] READY',{version:'15.0.0',slug:slug,targeted:IS_GT});
  });
})();