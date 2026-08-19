/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 HERO BACKGROUND LOCK V1

   Purpose:
   - keep the native Tilda hero/H1 background independent from V3 gallery
   - V7 may use source-only Zero Block photos for product gallery
   - first gallery image must NEVER replace the CR11/T184 hero background
   - text/H1/description may still be updated by Golden Standard
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_MASTER_PRODUCT_V3_HERO_BACKGROUND_LOCK_V1__) return;
  window.__FILIN_MASTER_PRODUCT_V3_HERO_BACKGROUND_LOCK_V1__=true;

  var VERSION='1.0.0';
  var state={carrier:null,rec:null,bg:'',attr:'',locked:false,observer:null,timer:null,tries:0};

  function norm(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}

  function locate(){
    var titles=Array.prototype.slice.call(document.querySelectorAll('.t184__title,h1'));
    var h=titles.find(function(el){
      var t=norm(el.textContent);
      return /Quadron|Grand Tower|Solid Copper Speaker Connectors|Binding Posts|Demograf/i.test(t);
    }) || titles[0];
    if(!h) return null;
    var rec=h.closest('.t-rec,[id^="rec"]')||h.parentElement;
    if(!rec) return null;
    var carrier=rec.querySelector('.t-cover__carrier,[id^="coverCarry"]');
    if(!carrier) return null;
    return {rec:rec,carrier:carrier};
  }

  function capture(){
    if(state.locked) return true;
    var x=locate();
    if(!x) return false;

    state.rec=x.rec;
    state.carrier=x.carrier;

    var inline=x.carrier.style.getPropertyValue('background-image')||'';
    var attr=x.carrier.getAttribute('data-content-cover-bg')||'';
    var computed='';
    try{computed=getComputedStyle(x.carrier).backgroundImage||'';}catch(e){}

    state.bg=inline || computed || '';
    state.attr=attr;
    state.locked=true;

    console.info('[Master Product V3 Hero Lock] NATIVE HERO CAPTURED',{
      version:VERSION,
      background:state.bg,
      dataContentCoverBg:state.attr
    });
    return true;
  }

  function restore(){
    if(!state.locked||!state.carrier||!document.documentElement.contains(state.carrier)) return false;

    if(state.bg && state.bg!=='none'){
      state.carrier.style.setProperty('background-image',state.bg,'important');
    }else{
      state.carrier.style.removeProperty('background-image');
    }

    if(state.attr){
      state.carrier.setAttribute('data-content-cover-bg',state.attr);
    }else{
      state.carrier.removeAttribute('data-content-cover-bg');
    }
    return true;
  }

  function bind(){
    if(!capture()) return false;
    restore();

    if(window.MutationObserver && !state.observer){
      state.observer=new MutationObserver(function(){restore();});
      state.observer.observe(state.carrier,{attributes:true,attributeFilter:['style','data-content-cover-bg']});
    }

    [0,50,120,250,500,900,1500,2500,4000,6500,9000].forEach(function(ms){
      setTimeout(restore,ms);
    });

    console.info('[Master Product V3 Hero Lock] ACTIVE',{version:VERSION});
    return true;
  }

  if(!bind()){
    state.timer=setInterval(function(){
      state.tries++;
      if(bind()||state.tries>=120){
        clearInterval(state.timer);
        state.timer=null;
      }
    },25);
  }
})();
