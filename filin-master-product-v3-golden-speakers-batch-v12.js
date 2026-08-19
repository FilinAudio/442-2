/* ============================================================
   FILIN LABS — GOLDEN SPEAKERS BATCH V12
   Grand Tower exact legacy-class cleanup over V11.

   Root cause fixed:
   - the duplicated legacy curation on Grand Tower is .fp-curation,
     not only .fgt-curation / T491 / T396;
   - the duplicated PROMOTIONS scroller is .flp-slider and can live
     outside #filin-grand-tower-card;
   - V12 quarantines those exact legacy classes anywhere outside the
     Golden root, without touching the Golden product card.
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V12__) return;

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
  window.__FILIN_GOLDEN_SPEAKERS_BATCH_V12__=true;

  var IS_GT=slug==='audioinstrument_grand_tower_speakers';
  var V11='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@099ee4ab4f4b04560101cea44c4d9334a715db59/filin-master-product-v3-golden-speakers-batch-v11.js';

  function same(a,b){
    return String(a||'').split('?')[0]===String(b||'').split('?')[0];
  }

  function hasScript(url){
    return Array.prototype.some.call(document.scripts||[],function(s){
      return same(s.src,url);
    });
  }

  function load(url,id,done){
    if(hasScript(url)){
      waitForV11(done);
      return;
    }

    var old=document.getElementById(id);
    if(old){
      old.addEventListener('load',function(){waitForV11(done);},{once:true});
      waitForV11(done);
      return;
    }

    var s=document.createElement('script');
    s.id=id;
    s.src=url;
    s.async=false;
    s.onload=function(){waitForV11(done);};
    s.onerror=function(){
      console.error('[Golden Speakers V12] failed to load V11',url);
    };
    (document.head||document.documentElement).appendChild(s);
  }

  function waitForV11(done){
    if(typeof done!=='function') return;
    var n=0;
    var t=setInterval(function(){
      n++;
      if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V11__ || n>=100){
        clearInterval(t);
        done();
      }
    },20);
  }

  function root(){
    return document.getElementById('filin-master-product-v3');
  }

  function outsideGolden(el){
    var r=root();
    return !!el && (!r || (el!==r && !r.contains(el)));
  }

  function visible(el){
    if(!el || !el.isConnected) return false;
    var s=getComputedStyle(el);
    return s.display!=='none' && s.visibility!=='hidden' && el.getBoundingClientRect().height>1;
  }

  function hide(el,reason){
    if(!el || !outsideGolden(el)) return false;

    el.dataset.fpV12Hidden='1';
    el.dataset.fpV12Reason=reason;

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

  function collapseEmptyRecord(el){
    var rec=el && el.closest ? el.closest('.t-rec') : null;
    if(!rec || !outsideGolden(rec)) return;

    requestAnimationFrame(function(){
      var children=Array.prototype.filter.call(rec.children||[],function(ch){
        if(!ch || /^(SCRIPT|STYLE|LINK)$/i.test(ch.tagName||'')) return false;
        return visible(ch);
      });

      if(!children.length){
        hide(rec,'empty-record-after-legacy-cleanup');
      }
    });
  }

  function cleanupGT(){
    if(!IS_GT) return 0;

    var hidden=0;

    /*
      Exact legacy curation classes used by the old Grand Tower page.
      Golden V3 uses .v3-curation / .v3-curation-item, so this does not
      touch the current Golden curation block.
    */
    document.querySelectorAll('#allrecords .fp-curation,#allrecords .fgt-curation').forEach(function(el){
      if(!outsideGolden(el)) return;
      if(hide(el,'legacy-curation-class')){
        hidden++;
        collapseEmptyRecord(el);
      }
    });

    /*
      Exact old PROMOTIONS slider. It may be a separate T123 record and
      therefore is not required to live inside #filin-grand-tower-card.
    */
    document.querySelectorAll('#allrecords .flp-slider').forEach(function(el){
      if(!outsideGolden(el)) return;

      var title='';
      var h=el.querySelector('.flp-title');
      if(h) title=String(h.textContent||'').replace(/\s+/g,' ').trim();

      if(!title || /PROMOTIONS/i.test(title)){
        if(hide(el,'legacy-promotions-slider')){
          hidden++;
          collapseEmptyRecord(el);
        }
      }
    });

    return hidden;
  }

  function publishState(){
    if(!IS_GT){
      window.__FILIN_GOLDEN_SPEAKERS_BATCH_V12_STATE__={
        version:'12.0.0',
        slug:slug,
        passThrough:true
      };
      return;
    }

    var state={
      version:'12.0.0',
      slug:slug,
      goldenRoots:document.querySelectorAll('#filin-master-product-v3').length,
      goldenCurationCards:document.querySelectorAll('#filin-master-product-v3 .v3-curation-item').length,
      visibleLegacyFpCuration:Array.prototype.filter.call(document.querySelectorAll('#allrecords .fp-curation'),function(el){return outsideGolden(el)&&visible(el);}).length,
      visibleLegacyFgtCuration:Array.prototype.filter.call(document.querySelectorAll('#allrecords .fgt-curation'),function(el){return outsideGolden(el)&&visible(el);}).length,
      visibleLegacyPromotions:Array.prototype.filter.call(document.querySelectorAll('#allrecords .flp-slider'),function(el){return outsideGolden(el)&&visible(el);}).length,
      hiddenByV12:document.querySelectorAll('[data-fp-v12-hidden="1"]').length
    };

    window.__FILIN_GOLDEN_SPEAKERS_BATCH_V12_STATE__=state;
    console.info('[Golden Speakers Batch V12] GRAND TOWER CLEAN',state);
  }

  function start(){
    if(!IS_GT){
      publishState();
      return;
    }

    document.documentElement.classList.add('fp-grand-tower-v12');

    cleanupGT();

    var queued=false;
    var host=document.getElementById('allrecords')||document.body;
    var mo=new MutationObserver(function(){
      if(queued) return;
      queued=true;
      requestAnimationFrame(function(){
        queued=false;
        cleanupGT();
      });
    });

    if(host){
      mo.observe(host,{childList:true,subtree:true});
    }

    var n=0;
    var timer=setInterval(function(){
      n++;
      cleanupGT();

      if(n===10 || n===30 || n===80 || n===160){
        publishState();
      }

      if(n>=200){
        clearInterval(timer);
        publishState();
        setTimeout(function(){
          try{mo.disconnect();}catch(e){}
        },1500);
      }
    },50);

    window.addEventListener('load',function(){
      cleanupGT();
      setTimeout(function(){
        cleanupGT();
        publishState();
      },250);
    },{once:true});
  }

  load(V11,'filin-golden-speakers-v11-from-v12',function(){
    start();
    console.info('[Golden Speakers Batch V12] READY',{
      version:'12.0.0',
      slug:slug,
      targeted:IS_GT
    });
  });
})();
