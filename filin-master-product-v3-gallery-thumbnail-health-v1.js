/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 GALLERY THUMBNAIL HEALTH V1
   Fixes transient/broken thumbnail rendering on the approved 19
   Golden-migrated product pages without changing main gallery logic.

   Behavior:
   - verifies each thumbnail URL with a detached Image probe
   - if URL loads: forces the visible thumbnail img to repaint
   - if URL is truly dead: removes that thumbnail from the strip
   - patches profile.galleryImages to exclude confirmed dead URLs
   - re-checks after Golden/Registry async re-renders
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V3_GALLERY_THUMB_HEALTH_V1__)return;
window.__FILIN_MASTER_PRODUCT_V3_GALLERY_THUMB_HEALTH_V1__=true;

var VERSION='1.0.0';
var ROOT_ID='filin-master-product-v3';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ALLOWED=[
'perun_dark_sound','volga_tone_priboi_1','orvellium_nocturne_aura','flatvox_gbc_dj_hulk','snorry_si_5_mk_2_headphones','snorry_joule_headphones','perun_modern','snorry_si_6_headphones','flatvox_gbc','flatvox_kona','phenomenon_spatium','filin_audio_model_1_standard_v2','filin_audio_model_1_premium_v2','perun_modern_closed','phenomenon_libratum','snorry_nm_2_headphones','filin_audio_limited','filin_audio_quadron','snorry_trion_mk_3'
];
if(ALLOWED.indexOf(PATH)<0)return;

var state={version:VERSION,slug:PATH,ready:false,checked:0,repaired:0,removed:0,healthy:0,lastBad:'',lastError:''};
var verdict=Object.create(null);
var running=Object.create(null);
var timer=null;

function pub(){window.__FILIN_MASTER_PRODUCT_V3_GALLERY_THUMB_HEALTH_V1_STATE__=JSON.parse(JSON.stringify(state));}
function str(v){return String(v==null?'':v).trim();}
function root(){return document.getElementById(ROOT_ID);}
function urlOf(img){return str(img&&(img.currentSrc||img.getAttribute('src')||img.src));}
function normalize(u){try{return new URL(u,location.origin).href;}catch(e){return str(u);}}

function patchProfileBad(badUrl){
  try{
    var api=window.FilinMasterProductV3;
    var p=api&&api.profiles&&api.profiles[PATH];
    var xs=p&&p.overview&&p.overview.galleryImages;
    if(Array.isArray(xs)){
      p.overview.galleryImages=xs.filter(function(x){return normalize(x)!==normalize(badUrl);});
    }
  }catch(e){state.lastError=String(e&&e.message||e);}
}

function removeThumb(btn,u){
  if(!btn||!btn.isConnected)return;
  var wasActive=btn.classList.contains('active');
  btn.remove();
  patchProfileBad(u);
  state.removed++;
  state.lastBad=u;
  var r=root();
  if(wasActive&&r){
    var next=r.querySelector('.v3-thumb');
    if(next){
      next.classList.add('active');
      try{next.click();}catch(e){}
    }
  }
  pub();
}

function forceRepaint(img,u){
  if(!img||!img.isConnected)return;
  var beforeOk=img.complete&&img.naturalWidth>1;
  // Re-assigning a verified URL clears the browser's stale broken-image state.
  img.removeAttribute('srcset');
  img.removeAttribute('loading');
  img.setAttribute('decoding','async');
  img.src='';
  // Force attribute mutation into a new microtask/frame.
  setTimeout(function(){
    if(!img.isConnected)return;
    img.src=u;
    if(!beforeOk)state.repaired++;
    pub();
  },0);
}

function verify(btn,img,u){
  u=normalize(u);
  if(!u||!/^https?:\/\//i.test(u)){removeThumb(btn,u);return;}
  if(verdict[u]==='good'){
    if(!(img.complete&&img.naturalWidth>1))forceRepaint(img,u);
    return;
  }
  if(verdict[u]==='bad'){removeThumb(btn,u);return;}
  if(running[u])return;
  running[u]=1;
  var probe=new Image();
  var done=false;
  var timeout=setTimeout(function(){finish(false);},7000);
  function finish(ok){
    if(done)return;done=true;clearTimeout(timeout);delete running[u];state.checked++;
    if(ok){
      verdict[u]='good';state.healthy++;
      if(!(img.complete&&img.naturalWidth>1))forceRepaint(img,u);
    }else{
      verdict[u]='bad';removeThumb(btn,u);
    }
    pub();
  }
  probe.onload=function(){finish(probe.naturalWidth>1&&probe.naturalHeight>1);};
  probe.onerror=function(){finish(false);};
  probe.src=u;
}

function scan(){
  var r=root();
  if(!r){state.ready=false;pub();return false;}
  var thumbs=Array.prototype.slice.call(r.querySelectorAll('.v3-thumb'));
  thumbs.forEach(function(btn){
    var img=btn.querySelector('img');
    if(!img)return;
    var u=urlOf(img);
    // If browser already rendered it, just record health and do not touch it.
    if(img.complete&&img.naturalWidth>1){
      u=normalize(u);
      if(u&&!verdict[u]){verdict[u]='good';state.checked++;state.healthy++;}
      return;
    }
    verify(btn,img,u);
  });
  state.ready=true;pub();return true;
}

function schedule(ms){clearTimeout(timer);timer=setTimeout(scan,ms==null?30:ms);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){schedule(0);},{once:true});else schedule(0);
[80,180,350,700,1200,2200,4000,7000].forEach(function(ms){setTimeout(scan,ms);});
if(window.MutationObserver){
  var mo=new MutationObserver(function(muts){
    var hit=muts.some(function(m){
      return Array.prototype.slice.call(m.addedNodes||[]).some(function(n){return n&&n.nodeType===1&&(n.matches&&n.matches('.v3-thumb,img')||n.querySelector&&n.querySelector('.v3-thumb'));});
    });
    if(hit)schedule(40);
  });
  mo.observe(document.documentElement,{childList:true,subtree:true});
}
window.addEventListener('pageshow',function(){schedule(0);});
pub();
console.info('[Filin Labs] Gallery Thumbnail Health V1 loaded',{version:VERSION,slug:PATH});
})();
