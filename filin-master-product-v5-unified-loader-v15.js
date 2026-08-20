/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V15
   Snorry NM-2: KT66-style GL01 -> Golden pipeline.
   - waits for DOMContentLoaded before looking for GL01
   - GL01 is the only gallery source
   - boots stable V6/GR2 Golden
   - overrides profile.galleryImages once
   - no Zero Block gallery scan, no legacy fallback
   - other pages delegate to approved V14 unchanged
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V15__)return;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V15__=true;

var VERSION='5.15.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var SNORRY='snorry_nm_2_headphones';
var ROOT='filin-master-product-v3';
var V14='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@51ed4cd45882113f51f1cdd893839217b54d08bf/filin-master-product-v5-unified-loader-v14.js';
var V6='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@53d3eee1b46dc58df83be5b808dfb99be8b31f66/filin-master-product-v5-unified-loader-v6.js';

function load(src,test){return new Promise(function(resolve,reject){
  if(test&&test())return resolve(true);
  var file=src.split('/').pop().split('?')[0];
  var existing=Array.prototype.slice.call(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(file)>=0;});
  if(existing){var n=0,t=setInterval(function(){if(!test||test()){clearInterval(t);resolve(true)}else if(++n>260){clearInterval(t);resolve(false)}},50);return;}
  var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};(document.head||document.documentElement).appendChild(s);
});}

if(PATH!==SNORRY){load(V14,function(){return !!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V14__});return;}

/* This route is owned only by V15. */
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V14__=true;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V13__=true;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V12__=true;

var state={version:VERSION,slug:PATH,mode:'snorry-gl01-kt66-style',ready:false,sourceFound:false,sourceRecord:'',slides:0,candidates:0,verified:0,before:0,after:0,baseReady:false,mainReady:false,released:false,timeout:false,error:'',urls:[]};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V15_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[])}
function str(v){return String(v==null?'':v).trim()}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test()}catch(e){}if(ok){clearInterval(t);resolve(true)}else if(Date.now()-st>(ms||14000)){clearInterval(t);resolve(false)}},50);});}
function toUrl(v){try{return new URL(str(v),location.origin).href}catch(e){return''}}
function cssUrl(v){var m=str(v).match(/url\(["']?([^"')]+)["']?\)/i);return m?toUrl(m[1]):''}
function valid(u){return !!u&&/^https?:\/\//i.test(u)&&/(?:static|optim)\.tildacdn\.com/i.test(u)&&/\.(?:jpe?g|png|webp)(?:\?|$)/i.test(u)&&!/(?:\/resize\/20x|\/lib\/icons\/|logo|photoroom|favicon|sprite|pixel|icon[-_.]|social|arrow|payment|telegram|whatsapp|youtube)/i.test(u)}
function candidatesOf(el){var out=[];if(!el||!el.getAttribute)return out;['data-img-zoom-url','data-original','data-bg','data-src','data-lazy-src','src'].forEach(function(a){var u=toUrl(el.getAttribute(a));if(valid(u)&&out.indexOf(u)<0)out.push(u)});var u=cssUrl(el.getAttribute('style'));if(valid(u)&&out.indexOf(u)<0)out.push(u);try{u=cssUrl(getComputedStyle(el).backgroundImage);if(valid(u)&&out.indexOf(u)<0)out.push(u)}catch(e){}return out}
function prefer(xs){if(!xs.length)return'';var s=xs.find(function(u){return /static\.tildacdn\.com/i.test(u)&&!/\/resize\//i.test(u)});return s||xs[0]}
function probe(u){return new Promise(function(resolve){var im=new Image(),done=false,tm=setTimeout(function(){finish(null)},5000);function finish(x){if(done)return;done=true;clearTimeout(tm);resolve(x)}im.onload=function(){var w=im.naturalWidth||0,h=im.naturalHeight||0;if(w>=500&&h>=350)finish({url:u,w:w,h:h});else finish(null)};im.onerror=function(){finish(null)};im.src=u})}
function findGl01(){
  var fixed=document.getElementById('rec3179623301');if(fixed)return fixed;
  var direct=document.querySelector('.t-rec[data-record-type="670"], [data-record-type="670"].t-rec');if(direct)return direct;
  var t670=document.querySelector('.t670');if(t670)return t670.closest('.t-rec,[id^="rec"]')||t670;
  var recs=arr(document.querySelectorAll('.t-rec,[id^="rec"]')).filter(function(r){return !r.closest('#'+ROOT)});
  return recs.find(function(r){return r.querySelectorAll('.t-slds__item').length>=3&&r.querySelector('.t-slds__container,.t-slds')})||null;
}
function collectGl01(rec){
  var out=[];if(!rec)return out;
  var slides=arr(rec.querySelectorAll('.t-slds__item'));state.slides=slides.length;
  if(slides.length){slides.forEach(function(slide){var pool=[];arr(slide.querySelectorAll('[data-img-zoom-url],[data-original],[data-src],[data-lazy-src],img,[style*="background-image"]')).forEach(function(el){candidatesOf(el).forEach(function(u){if(pool.indexOf(u)<0)pool.push(u)})});candidatesOf(slide).forEach(function(u){if(pool.indexOf(u)<0)pool.push(u)});var chosen=prefer(pool);if(chosen&&out.indexOf(chosen)<0)out.push(chosen);});}
  if(out.length<1){arr(rec.querySelectorAll('[data-img-zoom-url],[data-original],[data-src],[data-lazy-src],img,[style*="background-image"]')).forEach(function(el){var u=prefer(candidatesOf(el));if(u&&out.indexOf(u)<0)out.push(u)});}
  return out;
}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null}catch(e){return null}}

var css=document.createElement('style');css.id='filin-v15-snorry-preboot';css.textContent='html.fp-v15-snorry-boot body{visibility:hidden!important}html.fp-v15-snorry-boot:after{content:"FILIN LABS";position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;background:#f8f5f1;color:#2d241b;font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:.18em;visibility:visible!important}';(document.head||document.documentElement).appendChild(css);document.documentElement.classList.add('fp-v15-snorry-boot');
function release(){if(state.released)return;state.released=true;document.documentElement.classList.remove('fp-v15-snorry-boot');document.documentElement.classList.remove('filin-golden-product-prepaint');var n=document.getElementById('filin-v15-snorry-preboot');if(n)n.remove();pub()}

async function boot(){
 try{
   /* KT66 pattern: GL01 is read only AFTER Tilda DOM exists. */
   var rec=findGl01();state.sourceFound=!!rec;state.sourceRecord=rec&&rec.id||'';pub();
   if(!rec)throw new Error('NM-2 GL01 source not found after DOMContentLoaded');
   var candidates=collectGl01(rec);state.candidates=candidates.length;pub();
   if(!candidates.length)throw new Error('NM-2 GL01 contains no usable raster images');

   var verified=[];for(var i=0;i<candidates.length;i++){var x=await probe(candidates[i]);if(x&&verified.indexOf(x.url)<0)verified.push(x.url)}
   state.verified=verified.length;state.urls=verified.slice();pub();
   if(!verified.length)throw new Error('NM-2 GL01 has no verified product photos');

   await load(V6,function(){return !!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6__});
   var base=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6_STATE__;return s&&s.ready===true&&window.FilinMasterProductV3&&profile()&&document.querySelector('#'+ROOT+' .v3-shell')},15000);
   state.baseReady=!!base;pub();
   if(!base)throw new Error('NM-2 Golden base did not become ready');

   var api=window.FilinMasterProductV3,p=profile();if(!api||!p||!p.overview||typeof api.apply!=='function')throw new Error('NM-2 Golden profile unavailable');
   state.before=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.length:0;
   p.overview.galleryImages=verified.slice();
   api.apply();
   state.after=verified.length;pub();

   var galleryReady=await wait(function(){return document.querySelectorAll('#'+ROOT+' .v3-thumb').length===verified.length&&document.querySelector('#'+ROOT+' .v3-main-img')},5000);
   if(!galleryReady)throw new Error('NM-2 Golden gallery render mismatch');

   var main=document.querySelector('#'+ROOT+' .v3-main-img');
   if(main){main.src=verified[0];if(main.complete&&main.naturalWidth>0)state.mainReady=true;else state.mainReady=await wait(function(){return main.complete&&main.naturalWidth>0},5000)}
   if(!state.mainReady)throw new Error('NM-2 first Golden image did not become ready');

   /* Only now hide legacy GL01. */
   rec.style.setProperty('display','none','important');
   state.ready=true;state.error='';pub();
 }catch(e){state.error=String(e&&e.message||e);state.timeout=true;pub();}
 requestAnimationFrame(function(){requestAnimationFrame(release)});
 if(state.error)console.warn('[Filin V5.15 NM-2]',state.error,state);else console.info('[Filin Labs] Master Product V5.15 NM-2 GL01 ready',state);
}
setTimeout(function(){if(!state.released){state.error=state.error||'NM-2 V15 failsafe release';state.timeout=true;release()}},20000);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0)},{once:true});else setTimeout(boot,0);
pub();
})();