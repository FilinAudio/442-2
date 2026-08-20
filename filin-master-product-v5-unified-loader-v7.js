/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V7
   KT66 authoritative native-gallery route.
   - Other approved pages delegate to stable V6.
   - KT66 snapshots native Tilda product media BEFORE V4.1 quarantine.
   - Uses the same source-window logic as AMP V4.2.
   - Explicitly removes the known false Photoroom/S-symbol asset.
   - Builds Golden gallery from verified native URLs once, while hidden.
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V7__)return;
var VERSION='5.7.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var KT66='audioinstrument_sirius_kt66_push_pull_tube_amplifier';
var V6='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@53d3eee1b46dc58df83be5b808dfb99be8b31f66/filin-master-product-v5-unified-loader-v6.js';
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V7__=true;

function load(src,test){return new Promise(function(resolve,reject){if(test&&test())return resolve(true);var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};(document.head||document.documentElement).appendChild(s);});}

/* Non-KT66 pages keep the already approved V6 pipeline. */
if(PATH!==KT66){
  load(V6,function(){return !!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6__;});
  return;
}

var ROOT='filin-master-product-v3';
var V1='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@e226cdccb1a5f54732bf8f15633b5ca413271214/filin-master-product-v4-production-amp-batch-v1.js';
var V3='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@fb04f14e7edc4043971f15ac41bb525f2fbfdcdb/filin-master-product-v4-production-amp-batch-v3.js';
var BAD_EXACT={
  'https://static.tildacdn.com/tild3537-3633-4834-b839-343838383963/______100-Photoroom.png':1
};

/* Prevent legacy wrappers / old V6 from starting on this page. */
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6__=true;
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V7__=true;
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V6__=true;
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V5__=true;
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V4__=true;
window.__FILIN_AMP_FREEZE_COLLECTOR_V2__=true;

var state={version:VERSION,slug:PATH,group:'tube-amplifiers',ready:false,root:false,pipelineReady:false,nativeCandidates:0,verifiedNative:0,galleryBefore:0,galleryAfter:0,badRemoved:0,pmReady:false,registryReady:false,commerceReady:false,wishlistReady:false,released:false,timeout:false,error:'',verifiedUrls:[]};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V7_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[])}
function str(v){return String(v==null?'':v).trim()}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test()}catch(e){}if(ok){clearInterval(t);resolve(true)}else if(Date.now()-st>(ms||12000)){clearInterval(t);resolve(false)}},50);});}
function toUrl(v){try{return new URL(str(v),location.origin).href}catch(e){return''}}
function cssUrl(v){var m=str(v).match(/url\(["']?([^"')]+)["']?\)/i);return m?toUrl(m[1]):''}
function valid(u){return !!u&&/^https?:\/\//i.test(u)&&/(?:static|optim)\.tildacdn\.com/i.test(u)&&!/(?:\/resize\/20x|blank\.gif|empty\.png|pixel|favicon|logo|sprite|cookie|payment|telegram|whatsapp|youtube|icon[-_.]|social|arrow)/i.test(u)&&!BAD_EXACT[u]}
function add(out,v){var u=toUrl(v);if(BAD_EXACT[u]){state.badRemoved++;return}if(valid(u)&&out.indexOf(u)<0)out.push(u)}
function addEl(out,el){if(!el||!el.getAttribute)return;['data-content-cover-bg','data-original','data-img-zoom-url','data-bg','data-src','data-lazy-src','src'].forEach(function(a){add(out,el.getAttribute(a))});add(out,cssUrl(el.getAttribute('style')));try{add(out,cssUrl(getComputedStyle(el).backgroundImage))}catch(e){}}
function isNoise(el){return !!(el&&el.closest&&el.closest('.t706,.t1002,.t-store__card,.t-card,[class*="social"],[class*="footer"],[class*="header"]'))}
function scoreRec(r){var t=str(r&&r.innerText).toLowerCase(),s=0;if(r&&r.querySelector('.js-product'))s+=20;if(r&&r.querySelector('h2,h3'))s+=4;if(/perfect matches|shipping|contact|legal|reviews?|hi-fi\s*&\s*high-end/.test(t))s-=20;if(/category\s*&\s*budget|tags\s*&\s*features|sonic\s*signature|curator.?s\s*choice|synergy\s*match|genres?\s*accord/.test(t))s-=15;return s}

var nativeImages=[];
function snapshotNative(){
  var recs=arr(document.querySelectorAll('.t-rec,[id^="rec"]'));
  var product=arr(document.querySelectorAll('.js-product')).find(function(x){return !x.closest('.t706,.t1002,#'+ROOT)});
  var pr=product&&product.closest('.t-rec,[id^="rec"]'),idx=pr?recs.indexOf(pr):-1,scopes=[];
  if(idx>=0){for(var i=Math.max(0,idx-6);i<=Math.min(recs.length-1,idx+1);i++)scopes.push(recs[i])}
  if(!scopes.length)scopes=recs.slice().sort(function(a,b){return scoreRec(b)-scoreRec(a)}).slice(0,7);
  scopes.forEach(function(r){if(scoreRec(r)<-5)return;arr(r.querySelectorAll('img,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[style*="background-image"]')).forEach(function(el){if(isNoise(el))return;addEl(nativeImages,el)})});
  state.nativeCandidates=nativeImages.length;pub();
}
function probe(u){return new Promise(function(resolve){var im=new Image(),done=false,tm=setTimeout(function(){finish(null)},4500);function finish(x){if(done)return;done=true;clearTimeout(tm);resolve(x)}im.onload=function(){var w=im.naturalWidth||0,h=im.naturalHeight||0;if(w>100&&h>100)finish({url:u,w:w,h:h});else finish(null)};im.onerror=function(){finish(null)};im.src=u})}
async function verify(){var out=[];for(var i=0;i<nativeImages.length;i++){var x=await probe(nativeImages[i]);if(x&&out.indexOf(x.url)<0)out.push(x.url)}state.verifiedNative=out.length;state.verifiedUrls=out.slice();pub();return out}
function currentProfile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null}catch(e){return null}}

var css=document.createElement('style');css.id='filin-v7-kt66-preboot';css.textContent='html.fp-v7-kt66-boot body{visibility:hidden!important}html.fp-v7-kt66-boot:after{content:"FILIN LABS";position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;background:#f8f5f1;color:#2d241b;font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:.18em;visibility:visible!important}';(document.head||document.documentElement).appendChild(css);document.documentElement.classList.add('fp-v7-kt66-boot');
function release(){if(state.released)return;state.released=true;document.documentElement.classList.remove('fp-v7-kt66-boot');document.documentElement.classList.remove('filin-golden-product-prepaint');var n=document.getElementById('filin-v7-kt66-preboot');if(n)n.remove();pub()}

async function boot(){
  try{
    snapshotNative();
    var verifiedPromise=verify();

    /* Trick V4.3 into skipping its old private V4.2; V7 owns media preflight. */
    window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V2__=true;
    window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V2_STATE__={version:'4.2-v7-owned',slug:PATH,ready:false,heroReady:false,verifiedImages:0,repairs:0,badImages:0,lastError:''};

    /* Start PM snapshot before V1 quarantines legacy records, then start V1. */
    var pmLoad=load(V3,function(){return !!window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V3__});
    await load(V1,function(){return !!window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V1__});
    await pmLoad;

    var verified=await verifiedPromise;
    var baseReady=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V1_STATE__;return s&&s.ready===true&&document.querySelector('#'+ROOT+' .v3-shell')&&window.FilinMasterProductV3},12000);
    if(!baseReady)throw new Error('KT66 V4.1 base did not become ready');
    if(verified.length<2)throw new Error('KT66 native gallery has fewer than 2 verified product images');

    var api=window.FilinMasterProductV3,p=currentProfile();
    if(!api||!p||!p.overview||typeof api.apply!=='function')throw new Error('KT66 Golden profile unavailable');
    state.galleryBefore=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.length:0;
    p.overview.galleryImages=verified.slice();
    api.apply();
    state.galleryAfter=verified.length;

    window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V2_STATE__={version:'4.2-v7-owned',slug:PATH,ready:true,heroReady:true,verifiedImages:verified.length,repairs:0,badImages:state.badRemoved,lastError:'',verifiedUrls:verified.slice()};

    var galleryReady=await wait(function(){return document.querySelectorAll('#'+ROOT+' .v3-thumb').length===verified.length&&document.querySelector('#'+ROOT+' .v3-main-img')},5000);
    if(!galleryReady)throw new Error('KT66 Golden gallery render count mismatch');

    var pmReady=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V3_STATE__;return s&&s.ready===true&&s.pmReady===true&&document.querySelector('#'+ROOT+' .v3-pm')},5000);
    state.pmReady=!!pmReady;
    state.registryReady=!!window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__;
    state.commerceReady=!!window.__FILIN_MASTER_PRODUCT_V3_CLEAN_COMMERCE_V2__;
    state.wishlistReady=!!window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V4__;
    state.root=!!document.getElementById(ROOT);
    state.pipelineReady=galleryReady&&pmReady&&state.registryReady&&state.commerceReady&&state.wishlistReady;
    state.ready=state.root&&state.pipelineReady;
    if(!state.ready)throw new Error('KT66 final pipeline incomplete');
  }catch(e){state.error=String(e&&e.message||e);state.timeout=true}
  pub();requestAnimationFrame(function(){requestAnimationFrame(release)});
  if(state.error)console.warn('[Filin V5.7 KT66]',state.error,state);else console.info('[Filin Labs] Master Product V5.7 KT66 ready',state);
}
setTimeout(function(){if(!state.released){state.error=state.error||'KT66 failsafe release';state.timeout=true;release()}},18000);
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0)},{once:true});else setTimeout(boot,0);
pub();
})();