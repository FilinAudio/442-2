/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V10
   KT66 GL01 authoritative gallery source.
   Manual workflow: edit the standard Tilda GL01 gallery only.
   V10 reads GL01 (record type 670 / .t670), preserves slide order,
   verifies raster photos, hides the source GL01, applies Golden once,
   and pins the approved KT66 hero independently.
   Other approved pages delegate to stable V6.
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V10__)return;
var VERSION='5.10.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var KT66='audioinstrument_sirius_kt66_push_pull_tube_amplifier';
var V6='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@53d3eee1b46dc58df83be5b808dfb99be8b31f66/filin-master-product-v5-unified-loader-v6.js';
var V1='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@e226cdccb1a5f54732bf8f15633b5ca413271214/filin-master-product-v4-production-amp-batch-v1.js';
var V3='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@fb04f14e7edc4043971f15ac41bb525f2fbfdcdb/filin-master-product-v4-production-amp-batch-v3.js';
var HERO='https://static.tildacdn.com/tild3266-6535-4463-b438-656566623763/imgi_66_hd_6990a98b5.png';
var ROOT='filin-master-product-v3';
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V10__=true;

function load(src,test){return new Promise(function(resolve,reject){if(test&&test())return resolve(true);var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};(document.head||document.documentElement).appendChild(s);});}
if(PATH!==KT66){load(V6,function(){return !!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6__});return;}

window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6__=true;
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V7__=true;
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V6__=true;
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V5__=true;
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V4__=true;
window.__FILIN_AMP_FREEZE_COLLECTOR_V2__=true;

var state={version:VERSION,slug:PATH,group:'tube-amplifiers',ready:false,sourceFound:false,sourceRecord:'',sourceType:'GL01',slides:0,candidates:0,verified:0,galleryBefore:0,galleryAfter:0,heroReady:false,pmReady:false,registryReady:false,commerceReady:false,wishlistReady:false,released:false,timeout:false,error:'',verifiedUrls:[]};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V10_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[])}
function str(v){return String(v==null?'':v).trim()}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test()}catch(e){}if(ok){clearInterval(t);resolve(true)}else if(Date.now()-st>(ms||12000)){clearInterval(t);resolve(false)}},50);});}
function toUrl(v){try{return new URL(str(v),location.origin).href}catch(e){return''}}
function cssUrl(v){var m=str(v).match(/url\(["']?([^"')]+)["']?\)/i);return m?toUrl(m[1]):''}
function valid(u){return !!u&&/^https?:\/\//i.test(u)&&/(?:static|optim)\.tildacdn\.com/i.test(u)&&/\.(?:jpe?g|png|webp)(?:\?|$)/i.test(u)&&!/(?:\/resize\/20x|\/lib\/icons\/|logo|photoroom|favicon|sprite|pixel|icon[-_.]|social|arrow|payment|telegram|whatsapp|youtube)/i.test(u)}
function candidatesOf(el){var out=[];if(!el||!el.getAttribute)return out;['data-img-zoom-url','data-original','data-bg','data-src','data-lazy-src','src'].forEach(function(a){var u=toUrl(el.getAttribute(a));if(valid(u)&&out.indexOf(u)<0)out.push(u)});var u=cssUrl(el.getAttribute('style'));if(valid(u)&&out.indexOf(u)<0)out.push(u);try{u=cssUrl(getComputedStyle(el).backgroundImage);if(valid(u)&&out.indexOf(u)<0)out.push(u)}catch(e){}return out}
function prefer(xs){if(!xs.length)return'';var staticOne=xs.find(function(u){return /static\.tildacdn\.com/i.test(u)&&!/\/resize\//i.test(u)});return staticOne||xs[0]}
function probe(u){return new Promise(function(resolve){var im=new Image(),done=false,tm=setTimeout(function(){finish(null)},5000);function finish(x){if(done)return;done=true;clearTimeout(tm);resolve(x)}im.onload=function(){var w=im.naturalWidth||0,h=im.naturalHeight||0;if(w>=500&&h>=350)finish({url:u,w:w,h:h});else finish(null)};im.onerror=function(){finish(null)};im.src=u})}
function findGl01(){
  var direct=document.querySelector('.t-rec[data-record-type="670"], [data-record-type="670"].t-rec');if(direct)return direct;
  var t670=document.querySelector('.t670');if(t670)return t670.closest('.t-rec,[id^="rec"]')||t670;
  /* Fallback: a Tilda slider/gallery record with at least 3 slide items, excluding Golden/header/footer. */
  var recs=arr(document.querySelectorAll('.t-rec,[id^="rec"]')).filter(function(r){return !r.closest('#'+ROOT)&&!r.querySelector('header,footer')});
  return recs.find(function(r){return r.querySelectorAll('.t-slds__item').length>=3&&r.querySelector('.t-slds__container,.t-slds')})||null;
}
function collectGl01(rec){
  var out=[];if(!rec)return out;
  var slides=arr(rec.querySelectorAll('.t-slds__item'));
  state.slides=slides.length;
  if(slides.length){
    slides.forEach(function(slide){
      var pool=[];
      arr(slide.querySelectorAll('[data-img-zoom-url],[data-original],[data-src],[data-lazy-src],img,[style*="background-image"]')).forEach(function(el){candidatesOf(el).forEach(function(u){if(pool.indexOf(u)<0)pool.push(u)})});
      candidatesOf(slide).forEach(function(u){if(pool.indexOf(u)<0)pool.push(u)});
      var chosen=prefer(pool);if(chosen&&out.indexOf(chosen)<0)out.push(chosen);
    });
  }
  /* If GL01 markup differs, use all raster assets in record as fallback. */
  if(out.length<2){
    arr(rec.querySelectorAll('[data-img-zoom-url],[data-original],[data-src],[data-lazy-src],img,[style*="background-image"]')).forEach(function(el){var u=prefer(candidatesOf(el));if(u&&out.indexOf(u)<0)out.push(u)});
  }
  return out;
}
function currentProfile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null}catch(e){return null}}
function pinHero(){var c=document.querySelector('.t-cover'),cr=c&&c.querySelector('.t-cover__carrier,[id^="coverCarry"],.t-bgimg');if(!c||!cr)return false;cr.setAttribute('data-content-cover-bg',HERO);cr.setAttribute('data-original',HERO);cr.style.setProperty('background-image','url("'+HERO+'")','important');cr.style.setProperty('background-size','cover','important');cr.style.setProperty('background-position','center center','important');cr.style.setProperty('visibility','visible','important');cr.style.setProperty('opacity','1','important');cr.classList.add('loaded');c.style.setProperty('visibility','visible','important');c.style.setProperty('opacity','1','important');state.heroReady=true;pub();return true}

var css=document.createElement('style');css.id='filin-v10-kt66-preboot';css.textContent='html.fp-v10-kt66-boot body{visibility:hidden!important}html.fp-v10-kt66-boot:after{content:"FILIN LABS";position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;background:#f8f5f1;color:#2d241b;font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:.18em;visibility:visible!important}';(document.head||document.documentElement).appendChild(css);document.documentElement.classList.add('fp-v10-kt66-boot');
function release(){if(state.released)return;state.released=true;document.documentElement.classList.remove('fp-v10-kt66-boot');document.documentElement.classList.remove('filin-golden-product-prepaint');var n=document.getElementById('filin-v10-kt66-preboot');if(n)n.remove();pub()}

async function boot(){
 try{
   var rec=findGl01();state.sourceFound=!!rec;state.sourceRecord=rec&&rec.id||'';pub();
   if(!rec)throw new Error('KT66 GL01 source not found');
   var candidates=collectGl01(rec);state.candidates=candidates.length;pub();
   if(candidates.length<1)throw new Error('KT66 GL01 contains no usable raster images');
   var verified=[];for(var i=0;i<candidates.length;i++){var x=await probe(candidates[i]);if(x)verified.push(x.url)}
   verified=verified.filter(function(u,i,a){return a.indexOf(u)===i});
   state.verified=verified.length;state.verifiedUrls=verified.slice();pub();
   if(verified.length<1)throw new Error('KT66 GL01 has no verified product photos');

   /* Hide source GL01 only after successful capture. */
   rec.style.setProperty('display','none','important');

   /* V10 owns media; V3 may snapshot PM but must not launch old V4.2. */
   window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V2__=true;
   window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V2_STATE__={version:'4.2-v10-gl01',slug:PATH,ready:true,heroReady:true,verifiedImages:verified.length,repairs:0,badImages:0,lastError:'',verifiedUrls:verified.slice()};
   var pmLoad=load(V3,function(){return !!window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V3__});
   await load(V1,function(){return !!window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V1__});
   await pmLoad;
   var baseReady=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V1_STATE__;return s&&s.ready===true&&window.FilinMasterProductV3&&document.querySelector('#'+ROOT+' .v3-shell')},12000);
   if(!baseReady)throw new Error('KT66 Golden base did not become ready');
   var api=window.FilinMasterProductV3,p=currentProfile();if(!api||!p||!p.overview||typeof api.apply!=='function')throw new Error('KT66 Golden profile unavailable');
   state.galleryBefore=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.length:0;
   p.overview.galleryImages=verified.slice();
   api.apply();state.galleryAfter=verified.length;pinHero();
   [300,900,1800,3500].forEach(function(ms){setTimeout(pinHero,ms)});
   var galleryReady=await wait(function(){return document.querySelectorAll('#'+ROOT+' .v3-thumb').length===verified.length&&document.querySelector('#'+ROOT+' .v3-main-img')},5000);
   var pmReady=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V3_STATE__;return s&&s.ready===true&&s.pmReady===true&&document.querySelector('#'+ROOT+' .v3-pm')},5000);
   state.pmReady=!!pmReady;state.registryReady=!!window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__;state.commerceReady=!!window.__FILIN_MASTER_PRODUCT_V3_CLEAN_COMMERCE_V2__;state.wishlistReady=!!window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V4__;
   state.ready=!!(galleryReady&&pmReady&&state.registryReady&&state.commerceReady&&state.wishlistReady&&state.heroReady);
   if(!state.ready)throw new Error('KT66 GL01 pipeline incomplete');
 }catch(e){state.error=String(e&&e.message||e);state.timeout=true}
 pub();requestAnimationFrame(function(){requestAnimationFrame(release)});
 if(state.error)console.warn('[Filin V5.10 KT66]',state.error,state);else console.info('[Filin Labs] Master Product V5.10 KT66 GL01 ready',state);
}
setTimeout(function(){if(!state.released){state.error=state.error||'KT66 GL01 failsafe release';state.timeout=true;release()}},18000);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0)},{once:true});else setTimeout(boot,0);pub();
})();