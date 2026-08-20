/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V8
   KT66 media hardening.
   Fixes V7 false positives from Tilda UI icons and restores/pins the hero.
   - Other pages delegate to V7.
   - KT66 accepts raster Tilda assets only (jpg/jpeg/png/webp), never SVG/UI libs.
   - Scans product-side records before curation, including Zero Blocks.
   - Rejects logos/icons/Photoroom/UI assets and dedupes static/optim variants.
   - Verifies large raster dimensions before using an image.
   - Hero is restored from the known verified KT66 cover asset and pinned after migration.
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V8__)return;
var VERSION='5.8.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var KT66='audioinstrument_sirius_kt66_push_pull_tube_amplifier';
var V7='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@7a7c044f2d93bd180a7b917121a1f1a8822a6e57/filin-master-product-v5-unified-loader-v7.js';
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V8__=true;
function load(src,test){return new Promise(function(resolve,reject){if(test&&test())return resolve(true);var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};(document.head||document.documentElement).appendChild(s);});}
if(PATH!==KT66){load(V7,function(){return!!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V7__});return;}

var ROOT='filin-master-product-v3';
var HERO='https://static.tildacdn.com/tild3266-6535-4463-b438-656566623763/imgi_66_hd_6990a98b5.png';
var SEED='https://static.tildacdn.com/tild3537-3936-4836-b633-393237656337/imgi_60_hd_6990a9715.png';
var V1='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@e226cdccb1a5f54732bf8f15633b5ca413271214/filin-master-product-v4-production-amp-batch-v1.js';
var V3='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@fb04f14e7edc4043971f15ac41bb525f2fbfdcdb/filin-master-product-v4-production-amp-batch-v3.js';
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V7__=true;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6__=true;
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V7__=true;window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V6__=true;window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V5__=true;window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V4__=true;window.__FILIN_AMP_FREEZE_COLLECTOR_V2__=true;
var state={version:VERSION,slug:PATH,group:'tube-amplifiers',ready:false,root:false,pipelineReady:false,heroReady:false,candidates:0,verified:0,galleryBefore:0,galleryAfter:0,rejectedUi:0,rejectedSmall:0,pmReady:false,registryReady:false,commerceReady:false,wishlistReady:false,released:false,timeout:false,error:'',verifiedUrls:[]};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V8_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[])}function str(v){return String(v==null?'':v).trim()}function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test()}catch(e){}if(ok){clearInterval(t);resolve(true)}else if(Date.now()-st>(ms||12000)){clearInterval(t);resolve(false)}},50);});}
function toUrl(v){try{return new URL(str(v),location.origin).href}catch(e){return''}}function cssUrl(v){var m=str(v).match(/url\(["']?([^"')]+)["']?\)/i);return m?toUrl(m[1]):''}
function isRaster(u){return /(?:\.jpe?g|\.png|\.webp)(?:\?|$)/i.test(u)||/(?:\.jpe?g|\.png)\.webp(?:\?|$)/i.test(u)}
function isUi(u){return /(?:\/lib\/|\/icons?\/|\.svg(?:\?|$)|logo|sprite|favicon|dollar_currency|currency|code(?:_|\.|-)|settings?|gear|music|smile|user|account|person|photoroom|blank\.gif|empty\.png|pixel|cookie|payment|telegram|whatsapp|youtube|social|arrow)/i.test(u)}
function valid(u){return /^https?:\/\//i.test(u)&&/(?:static|optim)\.tildacdn\.com/i.test(u)&&isRaster(u)&&!isUi(u)&&!/(?:\/resize\/20x)/i.test(u)}
function assetKey(u){try{var p=new URL(u).pathname.split('/').filter(Boolean),f=p[p.length-1]||'';return f.replace(/\.webp$/i,'').toLowerCase()}catch(e){return u.toLowerCase()}}
var candidates=[],seen={};
function add(v){var u=toUrl(v);if(!u)return;if(isUi(u)||/\.svg(?:\?|$)/i.test(u)){state.rejectedUi++;return}if(!valid(u))return;var k=assetKey(u);if(seen[k])return;seen[k]=1;candidates.push(u)}
function addEl(el){if(!el||!el.getAttribute)return;['data-img-zoom-url','data-content-cover-bg','data-original','data-bg','data-src','data-lazy-src','src'].forEach(function(a){add(el.getAttribute(a))});add(cssUrl(el.getAttribute('style')));try{add(cssUrl(getComputedStyle(el).backgroundImage))}catch(e){}}
function recText(r){return str(r&&(r.innerText||r.textContent)).replace(/\s+/g,' ').toLowerCase()}
function isCuration(r){var t=recText(r);return /category\s*&\s*budget|tags\s*&\s*features|sonic\s*signature|high\s*technologies|curator.?s\s*choice|synergy\s*match|genres?\s*accord/.test(t)}
function isNoiseRec(r){var t=recText(r);return /perfect matches|shipping|contact us|legal|privacy|reviews?|you may also like|resonance club/.test(t)||!!r.querySelector('footer,#t-footer,.t-footer')}
function snapshot(){
  add(SEED);
  var recs=arr(document.querySelectorAll('.t-rec,[id^="rec"]'));
  var cut=recs.length;
  for(var i=0;i<recs.length;i++){if(isCuration(recs[i])){cut=i;break}}
  for(var j=0;j<cut;j++){
    var r=recs[j];if(!r||r.closest('#t-header,.t-header')||r.querySelector('header,#t-header,.t-header')||r.classList.contains('t-cover')||r.querySelector('.t-cover')||isNoiseRec(r))continue;
    arr(r.querySelectorAll('img,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[data-bg],[style*="background-image"]')).forEach(function(el){if(el.closest('.t706,.t1002,.t-store__card,.t-card,[class*="social"],[class*="footer"],[class*="header"]'))return;addEl(el)});
  }
  state.candidates=candidates.length;pub();
}
function probe(u){return new Promise(function(resolve){var im=new Image(),done=false,tm=setTimeout(function(){finish(null)},5000);function finish(x){if(done)return;done=true;clearTimeout(tm);resolve(x)}im.onload=function(){var w=im.naturalWidth||0,h=im.naturalHeight||0,ratio=h?w/h:0;if(w>=600&&h>=400&&ratio>=0.55&&ratio<=3.2)finish({url:u,w:w,h:h});else{state.rejectedSmall++;finish(null)}};im.onerror=function(){finish(null)};im.src=u})}
async function verify(){var out=[];for(var i=0;i<candidates.length;i++){var x=await probe(candidates[i]);if(x&&out.indexOf(x.url)<0&&x.url!==HERO)out.push(x.url)}state.verified=out.length;state.verifiedUrls=out.slice();pub();return out}
function currentProfile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null}catch(e){return null}}
function pinHero(){var c=document.querySelector('.t-cover'),cr=c&&c.querySelector('.t-cover__carrier,[id^="coverCarry"],.t-bgimg');if(!c||!cr)return false;cr.setAttribute('data-content-cover-bg',HERO);cr.setAttribute('data-original',HERO);cr.style.setProperty('background-image','url("'+HERO+'")','important');cr.style.setProperty('background-size','cover','important');cr.style.setProperty('background-position','center center','important');cr.style.setProperty('visibility','visible','important');cr.style.setProperty('opacity','1','important');cr.classList.add('loaded');c.style.setProperty('visibility','visible','important');c.style.setProperty('opacity','1','important');state.heroReady=true;pub();return true}
var css=document.createElement('style');css.id='filin-v8-kt66-preboot';css.textContent='html.fp-v8-kt66-boot body{visibility:hidden!important}html.fp-v8-kt66-boot:after{content:"FILIN LABS";position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;background:#f8f5f1;color:#2d241b;font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:.18em;visibility:visible!important}';(document.head||document.documentElement).appendChild(css);document.documentElement.classList.add('fp-v8-kt66-boot');
function release(){if(state.released)return;state.released=true;document.documentElement.classList.remove('fp-v8-kt66-boot');document.documentElement.classList.remove('filin-golden-product-prepaint');var n=document.getElementById('filin-v8-kt66-preboot');if(n)n.remove();pub()}
async function boot(){try{
  snapshot();var vp=verify();
  window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V2__=true;window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V2_STATE__={version:'4.2-v8-owned',slug:PATH,ready:false,heroReady:false,verifiedImages:0,repairs:0,badImages:0,lastError:''};
  var pmLoad=load(V3,function(){return!!window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V3__});
  await load(V1,function(){return!!window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V1__});await pmLoad;
  var verified=await vp;
  var base=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V1_STATE__;return s&&s.ready===true&&document.querySelector('#'+ROOT+' .v3-shell')&&window.FilinMasterProductV3},12000);if(!base)throw new Error('KT66 V4.1 base did not become ready');
  pinHero();[250,800,1800,4000].forEach(function(ms){setTimeout(pinHero,ms)});
  if(verified.length<2)throw new Error('KT66 raster gallery has fewer than 2 verified product photos');
  var api=window.FilinMasterProductV3,p=currentProfile();if(!api||!p||!p.overview||typeof api.apply!=='function')throw new Error('KT66 Golden profile unavailable');
  state.galleryBefore=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.length:0;p.overview.galleryImages=verified.slice();api.apply();state.galleryAfter=verified.length;pinHero();
  window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V2_STATE__={version:'4.2-v8-owned',slug:PATH,ready:true,heroReady:true,verifiedImages:verified.length,repairs:0,badImages:state.rejectedUi+state.rejectedSmall,lastError:'',verifiedUrls:verified.slice()};
  var gallery=await wait(function(){return document.querySelectorAll('#'+ROOT+' .v3-thumb').length===verified.length&&document.querySelector('#'+ROOT+' .v3-main-img')},5000);if(!gallery)throw new Error('KT66 Golden gallery render count mismatch');
  var pm=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V3_STATE__;return s&&s.ready===true&&s.pmReady===true&&document.querySelector('#'+ROOT+' .v3-pm')},5000);
  state.pmReady=!!pm;state.registryReady=!!window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__;state.commerceReady=!!window.__FILIN_MASTER_PRODUCT_V3_CLEAN_COMMERCE_V2__;state.wishlistReady=!!window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V4__;state.root=!!document.getElementById(ROOT);state.pipelineReady=gallery&&pm&&state.registryReady&&state.commerceReady&&state.wishlistReady;state.ready=state.root&&state.pipelineReady;if(!state.ready)throw new Error('KT66 final pipeline incomplete');
}catch(e){state.error=String(e&&e.message||e);state.timeout=true}pub();requestAnimationFrame(function(){requestAnimationFrame(release)});if(state.error)console.warn('[Filin V5.8 KT66]',state.error,state);else console.info('[Filin Labs] Master Product V5.8 KT66 ready',state)}
setTimeout(function(){if(!state.released){state.error=state.error||'KT66 failsafe release';state.timeout=true;release()}},19000);if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0)},{once:true});else setTimeout(boot,0);pub();
})();