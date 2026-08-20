/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 GALLERY INTEGRITY V2
   Global gallery sanitizer for Golden Standard GS2.

   Fixes, as one contract:
   - valid but non-product assets accidentally captured from Tilda / Zero Blocks
     (currency/$ graphics, owl/brand placeholders, logos/icons/service artwork)
   - duplicated gallery images after reload / async pipeline passes
   - divergence between profile galleryImages, thumbnails, arrows and main image

   Strategy:
   1) hide the Golden gallery while the first integrity pass is pending
   2) wait for Golden profile + root
   3) prefer V16 verified GL01 URLs when available
   4) otherwise sanitize the active profile gallery
   5) normalize Tilda CDN URLs, reject service assets, verify real raster dimensions
   6) dedupe by canonical Tilda asset key
   7) write ONE clean array back to the profile and rebuild Golden once
   8) re-check after legacy async media appenders (2.4s / 5.6s / 8.5s)
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V3_GALLERY_INTEGRITY_V2__)return;
window.__FILIN_MASTER_PRODUCT_V3_GALLERY_INTEGRITY_V2__=true;

var VERSION='2.0.0';
var ROOT_ID='filin-master-product-v3';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var EXCLUDE=['demograf_solid_copper_banana_plugs'];
if(EXCLUDE.indexOf(PATH)>=0)return;

var BAD_RE=/(?:^|[\/_\-.])(blank|empty|pixel|favicon|logo|sprite|cookie|payment|telegram|whatsapp|youtube|social|arrow|spinner|preload|loader|captcha|recaptcha|icon|icons|dollar|currency|money|owl|placeholder|watermark)(?:[\/_\-.]|$)|gemini[_-]?generated|filin[_-]?owl|dollar[_-]?currency|currency[_-]?icon/i;
var state={
  version:VERSION,slug:PATH,ready:false,sourceMode:'',profileBefore:0,profileAfter:0,
  removedBad:0,removedDead:0,removedDuplicates:0,rebuilds:0,passes:0,
  mainReady:false,lastBad:'',lastError:''
};
var running=false;
var released=false;
var lastCleanSignature='';
var maxRebuilds=4;

function pub(){window.__FILIN_MASTER_PRODUCT_V3_GALLERY_INTEGRITY_V2_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[]);}
function str(v){return String(v==null?'':v).trim();}
function root(){return document.getElementById(ROOT_ID);}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null;}catch(e){return null;}}
function toUrl(v){try{return new URL(str(v),location.origin).href;}catch(e){return '';}}
function badUrl(u){
  if(!u||!/^https?:\/\//i.test(u))return true;
  var s='';try{var x=new URL(u);s=decodeURIComponent(x.pathname+' '+x.search);}catch(e){s=u;}
  return BAD_RE.test(s);
}
function canonical(u){
  try{
    var x=new URL(u,location.origin),p=decodeURIComponent(x.pathname).replace(/\/+$/,'');
    p=p.replace(/\/-\/(?:resize|cover|format|quality)\/[^/]+/ig,'');
    var m=p.match(/\/(tild[a-z0-9-]+)\/(?:-\/[^/]+\/)*([^/]+)$/i);
    if(m)return (m[1]+'/'+m[2]).toLowerCase();
    return (x.hostname.toLowerCase()+p.toLowerCase());
  }catch(e){return str(u).replace(/[?#].*$/,'').toLowerCase();}
}
function sourceUrls(){
  var s16=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V16_STATE__;
  if(s16&&s16.slug===PATH&&Array.isArray(s16.urls)&&s16.urls.length){state.sourceMode='v16-verified-gl01';return s16.urls.slice();}
  var p=profile(),xs=p&&p.overview&&p.overview.galleryImages;
  if(Array.isArray(xs)&&xs.length){state.sourceMode='golden-profile';return xs.slice();}
  var r=root();if(r){state.sourceMode='golden-dom';return arr(r.querySelectorAll('.v3-thumb img')).map(function(im){return im.currentSrc||im.getAttribute('src')||im.src||'';}).filter(Boolean);}
  state.sourceMode='none';return [];
}
function probe(u){return new Promise(function(resolve){
  if(badUrl(u)){resolve({ok:false,reason:'bad-url'});return;}
  var im=new Image(),done=false,tm=setTimeout(function(){finish(false,'timeout');},6500);
  function finish(ok,reason){if(done)return;done=true;clearTimeout(tm);resolve({ok:!!ok,reason:reason||'',w:im.naturalWidth||0,h:im.naturalHeight||0,url:u});}
  im.onload=function(){
    var w=im.naturalWidth||0,h=im.naturalHeight||0,ratio=h?w/h:0;
    finish(w>=320&&h>=220&&Math.max(w,h)>=560&&ratio>=0.32&&ratio<=3.8,'dimensions');
  };
  im.onerror=function(){finish(false,'load-error');};
  im.src=u;
});}
function sameList(a,b){if(a.length!==b.length)return false;for(var i=0;i<a.length;i++)if(canonical(a[i])!==canonical(b[i]))return false;return true;}
function domMatches(clean){
  var r=root();if(!r)return false;
  var xs=arr(r.querySelectorAll('.v3-thumb img')).map(function(im){return im.currentSrc||im.getAttribute('src')||im.src||'';}).filter(Boolean);
  return sameList(xs,clean);
}
function release(){
  if(released)return;released=true;
  document.documentElement.classList.remove('fp-gallery-integrity-boot');
  var s=document.getElementById('filin-gallery-integrity-v2-preboot');if(s)s.remove();
}
function installPreboot(){
  if(document.getElementById('filin-gallery-integrity-v2-preboot'))return;
  var s=document.createElement('style');s.id='filin-gallery-integrity-v2-preboot';
  s.textContent='html.fp-gallery-integrity-boot #'+ROOT_ID+' .v3-gallery{visibility:hidden!important}';
  (document.head||document.documentElement).appendChild(s);
  document.documentElement.classList.add('fp-gallery-integrity-boot');
}
function rebindInteractions(){
  setTimeout(function(){
    try{
      var x=window.FilinMasterProductV3RegistryInteractions;
      if(x&&typeof x.apply==='function')x.apply();
    }catch(e){}
  },100);
}
async function sanitize(reason){
  if(running)return false;running=true;state.passes++;pub();
  try{
    var p=profile(),r=root();
    if(!p||!r){running=false;return false;}
    p.overview=p.overview||{};
    var original=sourceUrls().map(toUrl).filter(Boolean);
    state.profileBefore=original.length;
    var seen=Object.create(null),pre=[],bad=0,dup=0;
    original.forEach(function(u){
      if(badUrl(u)){bad++;state.lastBad=u;return;}
      var k=canonical(u);if(seen[k]){dup++;return;}seen[k]=1;pre.push(u);
    });
    var results=await Promise.all(pre.map(probe));
    var clean=[];results.forEach(function(x){if(x.ok)clean.push(x.url);else{state.removedDead++;state.lastBad=x.url||state.lastBad;}});
    state.removedBad+=bad;state.removedDuplicates+=dup;state.profileAfter=clean.length;
    if(!clean.length)throw new Error('gallery integrity produced an empty gallery');

    var current=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.map(toUrl).filter(Boolean):[];
    var sig=clean.map(canonical).join('|');
    var needProfile=!sameList(current,clean);
    var needDom=!domMatches(clean);

    if(needProfile)p.overview.galleryImages=clean.slice();
    if((needProfile||needDom||lastCleanSignature!==sig)&&state.rebuilds<maxRebuilds){
      var api=window.FilinMasterProductV3;
      if(api&&typeof api.apply==='function'){
        state.rebuilds++;lastCleanSignature=sig;api.apply();rebindInteractions();
      }
    }

    var rr=root(),main=rr&&rr.querySelector('.v3-main-img');
    if(main&&clean[0]){
      var mk=canonical(main.currentSrc||main.getAttribute('src')||main.src||'');
      var cleanKeys=Object.create(null);clean.forEach(function(u){cleanKeys[canonical(u)]=1;});
      if(!cleanKeys[mk]||badUrl(main.currentSrc||main.src||''))main.src=clean[0];
      state.mainReady=true;
    }
    state.ready=true;state.lastError='';pub();release();
    return true;
  }catch(e){state.lastError=String(e&&e.message||e);pub();release();return false;}
  finally{running=false;}
}
function waitAndStart(){
  var started=Date.now(),t=setInterval(function(){
    if(profile()&&root()){
      clearInterval(t);sanitize('initial');
      [800,2400,5600,8500].forEach(function(ms){setTimeout(function(){sanitize('stabilize-'+ms);},ms);});
    }else if(Date.now()-started>30000){clearInterval(t);state.lastError='profile/root timeout';pub();release();}
  },70);
}

installPreboot();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',waitAndStart,{once:true});else waitAndStart();
setTimeout(function(){if(!released){state.lastError=state.lastError||'failsafe release';pub();release();}},32000);
pub();
})();