/* ============================================================
   FILIN LABS — GOLDEN SPEAKERS BATCH V14
   GRAND TOWER EXACT SOURCE-CARD QUARANTINE over V13.

   This version stops guessing by text/classes scattered across Tilda.
   It targets the exact legacy source card from
   FILIN_GRAND_TOWER_UNIFIED_T123_V1:
     #filin-grand-tower-card
       .fgt-hero
       .fgt-perfect-matches
       .tabs-wrapper
       .fgt-curation
       .flp-slider

   Before hiding the legacy tabs, the original Reviews tab content and
   review modal are preserved by moving them into/next to the Golden V3
   root. DOM nodes are MOVED, not cloned, so existing Firebase/review
   event listeners stay attached.
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V14__) return;

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
  window.__FILIN_GOLDEN_SPEAKERS_BATCH_V14__=true;

  var V13='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@2280e22f9bd27ce22aed33e50a36e6b132854e3d/filin-master-product-v3-golden-speakers-batch-v13.js';
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
    s.onerror=function(){console.error('[Golden Speakers V14] failed',u);};
    (document.head||document.documentElement).appendChild(s);
  }

  function golden(){return document.getElementById('filin-master-product-v3');}
  function legacy(){return document.getElementById('filin-grand-tower-card');}
  function visible(el){
    if(!el||!el.isConnected)return false;
    var s=getComputedStyle(el),r=el.getBoundingClientRect();
    return s.display!=='none'&&s.visibility!=='hidden'&&r.width>2&&r.height>2;
  }
  function hide(el,reason){
    if(!el)return false;
    var g=golden();
    if(g && (el===g || el.contains(g))) return false;
    el.dataset.fpV14Hidden='1';
    el.dataset.fpV14Reason=reason;
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

  function installReviewBridgeStyle(){
    if(document.getElementById('filin-v14-review-bridge-style'))return;
    var s=document.createElement('style');
    s.id='filin-v14-review-bridge-style';
    s.textContent='\
#filin-master-product-v3 .fp-v14-reviews{max-width:1180px;margin:18px auto 26px;border:1px solid #d9d0c6;border-radius:12px;background:#fffaf6;overflow:hidden}\
#filin-master-product-v3 .fp-v14-reviews>summary{list-style:none;cursor:pointer;display:flex;align-items:center;justify-content:space-between;gap:16px;padding:15px 18px;font:700 13px/1.2 Montserrat,Arial,sans-serif;text-transform:uppercase}\
#filin-master-product-v3 .fp-v14-reviews>summary::-webkit-details-marker{display:none}\
#filin-master-product-v3 .fp-v14-review-body{padding:0 18px 18px;border-top:1px solid #e5ddd4}\
#filin-master-product-v3 .fp-v14-review-body #reviews{display:block!important}\
@media(max-width:820px){#filin-master-product-v3 .fp-v14-reviews{margin:14px 10px 20px}#filin-master-product-v3 .fp-v14-reviews>summary{padding:14px}}';
    (document.head||document.documentElement).appendChild(s);
  }

  function preserveReviews(){
    var g=golden(),l=legacy();
    if(!g||!l)return {bridge:false,modalMoved:false};

    var existingGoldenReview=g.querySelector('#reviews,.product-reviews-list,.reviews-heading,.v3-reviews');
    var oldReviews=l.querySelector('#reviews');
    var oldModal=l.querySelector('#product-review-modal');
    var bridge=false,modalMoved=false;

    if(!existingGoldenReview && oldReviews){
      installReviewBridgeStyle();
      var details=document.createElement('details');
      details.className='fp-v14-reviews';
      var oldCount=l.querySelector('#reviews-tab-count');
      var count=oldCount?String(oldCount.textContent||'0').trim():'0';
      details.innerHTML='<summary><span>Reviews <span class="fp-v14-review-count">'+count+'</span></span><span>＋</span></summary><div class="fp-v14-review-body"></div>';
      details.querySelector('.fp-v14-review-body').appendChild(oldReviews);
      oldReviews.style.setProperty('display','block','important');
      var anchor=g.querySelector('.v3-curation');
      if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(details,anchor);
      else g.appendChild(details);
      bridge=true;
    }

    if(oldModal && oldModal.parentElement!==document.body){
      document.body.appendChild(oldModal);
      modalMoved=true;
    }

    return {bridge:bridge,modalMoved:modalMoved};
  }

  function exactLegacyCleanup(){
    if(!IS_GT)return {found:false,hidden:0};
    var l=legacy();
    if(!l)return {found:false,hidden:0};
    var n=0;

    /* These are the exact visible sections in the source T123. */
    [
      ['.fgt-hero','legacy-source-hero'],
      ['.fgt-perfect-matches','legacy-source-perfect-matches'],
      ['.tabs-wrapper','legacy-source-tabs'],
      ['.fgt-curation','legacy-source-curation'],
      ['.flp-slider','legacy-source-promotions']
    ].forEach(function(pair){
      Array.prototype.forEach.call(l.querySelectorAll(pair[0]),function(el){
        if(hide(el,pair[1]))n++;
      });
    });

    /* Legacy native lightbox is no longer needed after Golden gallery owns UX. */
    Array.prototype.forEach.call(l.querySelectorAll('.fgt-lightbox'),function(el){
      if(hide(el,'legacy-source-lightbox'))n++;
    });

    return {found:true,hidden:n};
  }

  function state(extra){
    if(!IS_GT){
      window.__FILIN_GOLDEN_SPEAKERS_BATCH_V14_STATE__={version:'14.0.0',slug:slug,passThrough:true};
      return;
    }
    var l=legacy();
    var st={
      version:'14.0.0',
      slug:slug,
      goldenRoots:document.querySelectorAll('#filin-master-product-v3').length,
      goldenCurationCards:document.querySelectorAll('#filin-master-product-v3 .v3-curation-item').length,
      legacyCardFound:!!l,
      visibleLegacyHero:l?Array.prototype.filter.call(l.querySelectorAll('.fgt-hero'),visible).length:0,
      visibleLegacyPerfectMatches:l?Array.prototype.filter.call(l.querySelectorAll('.fgt-perfect-matches'),visible).length:0,
      visibleLegacyTabs:l?Array.prototype.filter.call(l.querySelectorAll('.tabs-wrapper'),visible).length:0,
      visibleLegacyCuration:l?Array.prototype.filter.call(l.querySelectorAll('.fgt-curation'),visible).length:0,
      visibleLegacyPromotions:l?Array.prototype.filter.call(l.querySelectorAll('.flp-slider'),visible).length:0,
      reviewBridge:!!document.querySelector('#filin-master-product-v3 .fp-v14-reviews'),
      reviewModalPreserved:!!document.body.querySelector(':scope > #product-review-modal'),
      hiddenByV14:document.querySelectorAll('[data-fp-v14-hidden="1"]').length
    };
    if(extra){st.hiddenThisPass=extra.hidden;}
    window.__FILIN_GOLDEN_SPEAKERS_BATCH_V14_STATE__=st;
    console.info('[Golden Speakers Batch V14] GRAND TOWER SOURCE CARD QUARANTINED',st);
  }

  function apply(){
    if(!IS_GT){state();return;}
    var g=golden(),l=legacy();
    if(!g||!l)return false;
    preserveReviews();
    var r=exactLegacyCleanup();
    state(r);
    return true;
  }

  function start(){
    if(!IS_GT){state();return;}
    var n=0,t=setInterval(function(){
      n++;
      if(apply() && n>=6){clearInterval(t);}
      if(n>=240){clearInterval(t);state();}
    },50);

    var mo=new MutationObserver(function(){apply();});
    mo.observe(document.getElementById('allrecords')||document.body,{childList:true,subtree:true});
  }

  load(V13,'filin-golden-speakers-v13-from-v14',function(){
    start();
    console.info('[Golden Speakers Batch V14] READY',{version:'14.0.0',slug:slug,targeted:IS_GT});
  });
})();
