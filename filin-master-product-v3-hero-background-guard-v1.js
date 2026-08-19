/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 HERO BACKGROUND GUARD V1
   For Golden Reference 2 migrated product pages.

   Purpose:
   - snapshot native Tilda cover background before migration rewrites it
   - preload the hero image
   - pin it to .t-cover__carrier after Tilda lazy-loader passes
   - never replace a visible image with an unloaded/broken one
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V3_HERO_BG_GUARD_V1__)return;

var VERSION='1.0.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ALLOWED=[
  'perun_dark_sound','volga_tone_priboi_1','orvellium_nocturne_aura',
  'flatvox_gbc_dj_hulk','snorry_si_5_mk_2_headphones','snorry_joule_headphones',
  'perun_modern','snorry_si_6_headphones','flatvox_gbc','flatvox_kona',
  'phenomenon_spatium','filin_audio_model_1_standard_v2',
  'filin_audio_model_1_premium_v2','perun_modern_closed','phenomenon_libratum',
  'snorry_nm_2_headphones','filin_audio_limited','filin_audio_quadron',
  'snorry_trion_mk_3'
];
if(ALLOWED.indexOf(PATH)<0)return;
window.__FILIN_MASTER_PRODUCT_V3_HERO_BG_GUARD_V1__=true;

var original='',chosen='',ready=false,applied=0,attempts=0,lastError='',observer=null,pinning=false;
function str(v){return String(v==null?'':v).trim();}
function toUrl(v){try{return new URL(str(v),location.origin).href;}catch(e){return'';}}
function valid(u){return !!u&&/^https?:\/\//i.test(u)&&!/(blank\.gif|empty\.png|pixel|favicon|logo|sprite|icon[-_.]|social|arrow)/i.test(u);}
function cssUrl(v){var m=str(v).match(/url\(["']?([^"')]+)["']?\)/i);return m?toUrl(m[1]):'';}
function push(out,v){var u=toUrl(v);if(valid(u)&&out.indexOf(u)<0)out.push(u);}
function cover(){return document.querySelector('.t-cover');}
function carrier(){var c=cover();return c&&(c.querySelector('.t-cover__carrier,[id^="coverCarry"],.t-bgimg')||null);}

function elementCandidates(el,out){
  if(!el||!el.getAttribute)return;
  ['data-content-cover-bg','data-original','data-bg','data-src','data-lazy-src','data-img-zoom-url','src'].forEach(function(a){push(out,el.getAttribute(a));});
  var u=cssUrl(el.getAttribute('style'));if(valid(u)&&out.indexOf(u)<0)out.push(u);
  try{u=cssUrl(getComputedStyle(el).backgroundImage);if(valid(u)&&out.indexOf(u)<0)out.push(u);}catch(e){}
}

function nativeCandidates(){
  var out=[],c=cover(),cr=carrier();
  elementCandidates(cr,out);
  if(c){
    elementCandidates(c,out);
    Array.prototype.slice.call(c.querySelectorAll('[data-content-cover-bg],[data-original],[data-src],[data-bg],[style*="background-image"],img')).forEach(function(el){elementCandidates(el,out);});
  }
  return out;
}
function profileCandidates(){
  var out=[];
  try{var api=window.FilinMasterProductV3,p=api&&api.get&&api.get(PATH);push(out,p&&p.hero&&p.hero.background);}catch(e){}
  var r=document.querySelector('#filin-master-product-v3 .v3-main-img');push(out,r&&(r.currentSrc||r.getAttribute('src')||r.src));
  var t=document.querySelector('#filin-master-product-v3 .v3-thumb img');push(out,t&&(t.currentSrc||t.getAttribute('src')||t.src));
  var m=document.querySelector('meta[property="og:image"],meta[name="twitter:image"]');push(out,m&&m.getAttribute('content'));
  return out;
}
function publish(){
  window.__FILIN_MASTER_PRODUCT_V3_HERO_BG_GUARD_V1_STATE__={version:VERSION,slug:PATH,ready:ready,original:original,chosen:chosen,applied:applied,attempts:attempts,lastError:lastError};
}

function snapshot(){
  var xs=nativeCandidates();
  if(!original&&xs.length)original=xs[0];
  publish();
  return original;
}

function applyUrl(u){
  var c=cover(),cr=carrier();if(!c||!cr||!u)return false;
  pinning=true;
  try{
    cr.setAttribute('data-content-cover-bg',u);
    cr.setAttribute('data-original',u);
    cr.style.setProperty('background-image','url("'+u.replace(/"/g,'\\"')+'")','important');
    cr.style.setProperty('background-size','cover','important');
    cr.style.setProperty('background-position','center center','important');
    cr.style.setProperty('visibility','visible','important');
    cr.style.setProperty('opacity','1','important');
    cr.classList.add('loaded');
    c.style.setProperty('visibility','visible','important');
    c.style.setProperty('opacity','1','important');
    c.setAttribute('data-fp-hero-bg-guard','1');
    applied++;
  }finally{pinning=false;}
  return true;
}

function preloadOne(list,i){
  if(i>=list.length){lastError='no loadable hero image';ready=false;publish();return;}
  var u=list[i];if(!valid(u)){preloadOne(list,i+1);return;}
  var im=new Image(),done=false,tm=setTimeout(function(){finish(false);},6500);
  function finish(ok){if(done)return;done=true;clearTimeout(tm);if(ok){chosen=u;ready=true;applyUrl(u);publish();installObserver();pinSchedule();}else preloadOne(list,i+1);}
  im.onload=function(){finish(im.naturalWidth>120&&im.naturalHeight>120);};
  im.onerror=function(){finish(false);};
  im.src=u;
}
function start(){
  attempts++;
  snapshot();
  var list=[];if(original)list.push(original);
  nativeCandidates().concat(profileCandidates()).forEach(function(u){if(valid(u)&&list.indexOf(u)<0)list.push(u);});
  if(chosen){applyUrl(chosen);publish();return;}
  preloadOne(list,0);
}
function pinSchedule(){[80,220,500,1000,1800,3000,5000,8000,12000].forEach(function(ms){setTimeout(function(){if(chosen)applyUrl(chosen);else start();publish();},ms);});}
function installObserver(){
  var cr=carrier();if(!cr||!window.MutationObserver)return;
  if(observer)observer.disconnect();
  var timer=null;observer=new MutationObserver(function(){if(pinning||!chosen)return;clearTimeout(timer);timer=setTimeout(function(){applyUrl(chosen);publish();},25);});
  observer.observe(cr,{attributes:true,attributeFilter:['class','style','data-content-cover-bg','data-original']});
}

/* Capture native Tilda URL synchronously at DOMContentLoaded; Batch V3 starts ~10 ms later. */
if(document.readyState==='loading'){
  document.addEventListener('DOMContentLoaded',function(){snapshot();setTimeout(start,0);},{once:true});
}else{snapshot();setTimeout(start,0);}
window.addEventListener('pageshow',function(){setTimeout(start,0);});
setTimeout(start,300);setTimeout(start,1200);setTimeout(start,3500);
publish();
console.info('[Filin Labs] Hero Background Guard V1 loaded',{version:VERSION,slug:PATH});
})();
