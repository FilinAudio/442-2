/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V19
   GL01 readiness gate for the 12 amplifier / preamplifier migration pages.
   Fixes the intermittent Tilda race where DOMContentLoaded fires before GL01 slider DOM exists.
   V19 waits for a stable GL01 source, then launches approved V18 -> V17 -> V16 chain.
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V19__)return;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V19__=true;

var VERSION='5.19.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var V18='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@ee4110de3e4d8ad05772f16a13ffe9249ee52c8a/filin-master-product-v5-unified-loader-v18.js';
var TARGET=[
'gerbera_dual_mono_mosfet_headphone_amplifier','konstantin_audio_un_1_solid_state_headphones_amplifier',
'phenomenon_kgsshv_carbon_electrostatic_headphone_amplifier','sciber_enflow','gerbera_equos',
'audioinstrument_vivo_solid_state_amplifier','eridan_audio_rigel_integrated_amplifier','eridan_audio_quasar_amplifier',
'konstantin_audio_a2_solid_state_amplifier','demograf_neptunum_class_d_amplifier',
'nemesis_solid_state_amplifier_demograf','gerbera_active_tube_preamplifier'
];
var TARGETED=TARGET.indexOf(PATH)>=0;
var state={
  version:VERSION,slug:PATH,
  mode:TARGETED?'gl01-stable-readiness-gate':'delegate-v18',
  ready:false,sourceReady:false,sourceRecord:'',slides:0,stablePasses:0,
  downstreamLoaded:false,downstreamReady:false,released:false,timeout:false,error:''
};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V19_STATE__=JSON.parse(JSON.stringify(state))}
function arr(v){return Array.prototype.slice.call(v||[])}
function load(src){return new Promise(function(resolve,reject){
  var file=src.split('/').pop().split('?')[0];
  var old=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(file)>=0});
  if(old){resolve(true);return}
  var s=document.createElement('script');s.src=src;s.async=false;
  s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};
  (document.head||document.documentElement).appendChild(s);
})}
function wait(test,ms){return new Promise(function(resolve){
  var st=Date.now(),t=setInterval(function(){
    var ok=false;try{ok=!!test()}catch(e){}
    if(ok){clearInterval(t);resolve(true)}
    else if(Date.now()-st>(ms||30000)){clearInterval(t);resolve(false)}
  },60);
})}
function sourceProbe(){
  var recs=arr(document.querySelectorAll('.t-rec[data-record-type="670"],[data-record-type="670"].t-rec'));
  arr(document.querySelectorAll('.t670')).forEach(function(x){
    var r=x.closest('.t-rec,[id^="rec"]')||x;
    if(recs.indexOf(r)<0)recs.push(r);
  });
  recs=recs.filter(function(r){return r&&!r.closest('#filin-master-product-v3')&&!r.closest('header,footer,#t-header,#t-footer')});
  if(!recs.length){
    recs=arr(document.querySelectorAll('.t-rec,[id^="rec"]')).filter(function(r){
      return !r.closest('#filin-master-product-v3')&&!r.closest('header,footer,#t-header,#t-footer')&&
        r.querySelector('.t-slds__container,.t-slds')&&r.querySelectorAll('.t-slds__item').length>=2;
    });
  }
  var best=null,bestSlides=0;
  recs.forEach(function(r){
    var n=r.querySelectorAll('.t-slds__item').length;
    var hasMedia=!!r.querySelector('[data-img-zoom-url],[data-original],[data-src],[data-lazy-src],img,[style*="background-image"]');
    if(hasMedia&&n>bestSlides){best=r;bestSlides=n}
  });
  return best?{rec:best,slides:bestSlides}:null;
}
function installBoot(){
  if(!TARGETED||document.getElementById('filin-v19-preboot'))return;
  var s=document.createElement('style');s.id='filin-v19-preboot';
  s.textContent='html.fp-v19-boot body{visibility:hidden!important}html.fp-v19-boot:after{content:"FILIN LABS";position:fixed;inset:0;z-index:2147483647;display:flex;align-items:center;justify-content:center;background:#f8f5f1;color:#2d241b;font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:.18em;visibility:visible!important}';
  (document.head||document.documentElement).appendChild(s);
  document.documentElement.classList.add('fp-v19-boot');
}
function release(){
  if(state.released)return;
  state.released=true;
  document.documentElement.classList.remove('fp-v19-boot');
  var n=document.getElementById('filin-v19-preboot');if(n)n.remove();
  pub();
}
async function waitStableSource(){
  var lastId='',passes=0,start=Date.now();
  while(Date.now()-start<24000){
    var x=sourceProbe();
    if(x){
      var id=(x.rec&&x.rec.id)||'anonymous';
      if(id===lastId)passes++;else{lastId=id;passes=1}
      state.sourceRecord=id;state.slides=x.slides;state.stablePasses=passes;pub();
      if(passes>=3){state.sourceReady=true;pub();return true}
    }else{
      lastId='';passes=0;state.stablePasses=0;pub();
    }
    await new Promise(function(r){setTimeout(r,120)});
  }
  return false;
}
async function boot(){
  try{
    if(!TARGETED){
      await load(V18);state.downstreamLoaded=true;state.ready=true;pub();return;
    }
    installBoot();
    var ok=await waitStableSource();
    if(!ok)throw new Error(PATH+' GL01 did not become stable within 24s');
    await new Promise(function(r){requestAnimationFrame(function(){requestAnimationFrame(r)})});
    await load(V18);state.downstreamLoaded=true;pub();
    var downstream=await wait(function(){
      var s=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V18_STATE__;
      return s&&(s.ready===true||!!s.error);
    },30000);
    if(!downstream)throw new Error(PATH+' V18 downstream timeout');
    var ds=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V18_STATE__||{};
    if(ds.error)throw new Error('V18: '+ds.error);
    state.downstreamReady=ds.ready===true;
    state.ready=state.sourceReady&&state.downstreamReady;
    if(!state.ready)throw new Error(PATH+' V19 pipeline incomplete');
    state.error='';pub();
  }catch(e){
    state.error=String(e&&e.message||e);state.timeout=true;pub();
  }
  requestAnimationFrame(function(){requestAnimationFrame(release)});
  if(state.error)console.warn('[Filin V5.19]',state.error,state);
  else console.info('[Filin Labs] Master Product V5.19 GL01 gate ready',state);
}
setTimeout(function(){
  if(!state.released){state.error=state.error||PATH+' V19 failsafe release';state.timeout=true;release()}
},58000);
boot();pub();
})();