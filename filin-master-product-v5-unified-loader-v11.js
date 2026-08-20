/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V11
   Targeted media source cleanup after KT66 GL01 PASS.

   Fixes:
   1) gerbera_electrostatic_amplifier
   2) gerbera_attento_otl_tube_electrostatic_headphone_amplifier
      -> never allow Tilda currency/UI icons into Golden gallery
   3) demograf_ajax_tube_amplifier_el_84
      -> never allow FILIN/header/footer/logo assets into Golden gallery
   4) snorry_nm_2_headphones
      -> current Zero Block Gallery 1 (same record as NM-2 description) is authoritative;
         deleted legacy/Rich Catalog images cannot return.

   KT66 and all other pages delegate to approved V10.
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V11__)return;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V11__=true;

var VERSION='5.11.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';
var V10='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@f2e683f3a916d95e89adcb98236d6dd45695eb36/filin-master-product-v5-unified-loader-v10.js';
var V6='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@53d3eee1b46dc58df83be5b808dfb99be8b31f66/filin-master-product-v5-unified-loader-v6.js';
var SNORRY='snorry_nm_2_headphones';
var AMPS=[
  'gerbera_electrostatic_amplifier',
  'gerbera_attento_otl_tube_electrostatic_headphone_amplifier',
  'demograf_ajax_tube_amplifier_el_84'
];
var TARGET=AMPS.concat([SNORRY]);

function load(src,test){return new Promise(function(resolve,reject){
  if(test&&test())return resolve(true);
  var file=src.split('/').pop().split('?')[0];
  var existing=Array.prototype.slice.call(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(file)>=0;});
  if(existing){var n=0,t=setInterval(function(){if(!test||test()){clearInterval(t);resolve(true)}else if(++n>240){clearInterval(t);resolve(false)}},50);return;}
  var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};(document.head||document.documentElement).appendChild(s);
});}
if(TARGET.indexOf(PATH)<0){load(V10,function(){return !!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V10__});return;}

/* V11 owns these four routes; prevent V10 from being started by another copy. */
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V10__=true;

var state={version:VERSION,slug:PATH,mode:PATH===SNORRY?'snorry-zero-gallery':'amp-gallery-scrub',ready:false,source:'',sourceRecord:'',candidates:0,verified:0,before:0,after:0,removed:0,error:'',urls:[]};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V11_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[])}
function str(v){return String(v==null?'':v).trim()}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test()}catch(e){}if(ok){clearInterval(t);resolve(true)}else if(Date.now()-st>(ms||12000)){clearInterval(t);resolve(false)}},60);});}
function toUrl(v){try{return new URL(str(v),location.origin).href}catch(e){return''}}
function raster(u){return /^https?:\/\//i.test(u)&&/(?:static|optim)\.tildacdn\.com/i.test(u)&&/\.(?:jpe?g|png|webp)(?:\?|$)/i.test(u)}
function obviouslyBad(u){return !u||/\.svg(?:\?|$)/i.test(u)||/(?:\/lib\/icons\/|dollar_currency|currency[_-]?icon|favicon|sprite|social|payment|telegram|whatsapp|youtube|photoroom|icon[-_.])/i.test(u)}
function cssUrl(v){var m=str(v).match(/url\(["']?([^"')]+)["']?\)/i);return m?toUrl(m[1]):''}
function add(out,v){var u=toUrl(v);if(raster(u)&&!obviouslyBad(u)&&out.indexOf(u)<0)out.push(u)}
function addEl(out,el){if(!el||!el.getAttribute)return;['data-img-zoom-url','data-original','data-content-cover-bg','data-bg','data-src','data-lazy-src','src'].forEach(function(a){add(out,el.getAttribute(a))});add(out,cssUrl(el.getAttribute('style')));try{add(out,cssUrl(getComputedStyle(el).backgroundImage))}catch(e){}}
function probe(u){return new Promise(function(resolve){var im=new Image(),done=false,tm=setTimeout(function(){finish(null)},4500);function finish(x){if(done)return;done=true;clearTimeout(tm);resolve(x)}im.onload=function(){var w=im.naturalWidth||0,h=im.naturalHeight||0,ratio=h?w/h:0;if(w>=450&&h>=280&&ratio>=0.38&&ratio<=3.5)finish({url:u,w:w,h:h});else finish(null)};im.onerror=function(){finish(null)};im.src=u})}
async function verify(xs){var out=[];for(var i=0;i<xs.length;i++){var x=await probe(xs[i]);if(x&&out.indexOf(x.url)<0)out.push(x.url)}return out}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null}catch(e){return null}}

/* Anything actually used by header/footer/logo is forbidden in a product gallery. */
var forbidden={};
function rememberForbidden(){
  arr(document.querySelectorAll('header img,footer img,#t-header img,#t-footer img,[class*="logo"] img,[class*="logo"] [style*="background-image"]')).forEach(function(el){var xs=[];addEl(xs,el);xs.forEach(function(u){forbidden[u]=1})});
}
function forbiddenUrl(u){return obviouslyBad(u)||!!forbidden[u]||/(?:filin[-_ ]?labs|filin[-_ ]?audio|owl[-_ ]?logo|logo)/i.test(u)}

/* Standard Tilda GL01, when present, always beats dynamic legacy extraction. */
function findGL01(){return document.querySelector('.t-rec[data-record-type="670"]')||document.querySelector('.t670')&&document.querySelector('.t670').closest('.t-rec,[id^="rec"]')||null}
function collectRecord(rec){var out=[];if(!rec)return out;arr(rec.querySelectorAll('img,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[data-bg],[style*="background-image"]')).forEach(function(el){addEl(out,el)});var html=String(rec.outerHTML||'');var re=/https?:[^"'<>\s)]+(?:\.jpe?g|\.png|\.webp)(?:\?[^"'<>\s)]*)?/ig,m;while((m=re.exec(html)))add(out,m[0].replace(/&amp;/g,'&'));return out}

/* NM-2: find the exact Zero Block record shown by the user: description + Gallery 1. */
function findNm2Zero(){
  var recs=arr(document.querySelectorAll('.t-rec,[id^="rec"]'));
  var phrases=['Snorry NM-2 Planar Magnetic Headphones','The Snorry NM-2 is a cutting-edge','Patent RU2783727'];
  var found=recs.find(function(r){if(!r.querySelector('.t396,.tn-elem'))return false;var t=str(r.innerText||r.textContent);return phrases.some(function(p){return t.indexOf(p)>=0})});
  if(found)return found;
  /* fallback: choose a Zero Block containing a gallery-like element and the largest raster set */
  var best=null,bestN=0;recs.forEach(function(r){if(!r.querySelector('.t396,.tn-elem'))return;var n=collectRecord(r).length;if(n>bestN){bestN=n;best=r}});return best;
}

async function applyGallery(urls,source,rec){
  var p=profile(),api=window.FilinMasterProductV3;if(!p||!p.overview||!api||typeof api.apply!=='function')throw new Error('Golden profile unavailable');
  state.before=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.length:0;
  p.overview.galleryImages=urls.slice();
  api.apply();
  state.after=urls.length;state.urls=urls.slice();state.source=source;state.sourceRecord=rec&&rec.id||'';pub();
  var ok=await wait(function(){return document.querySelectorAll('#'+ROOT+' .v3-thumb').length===urls.length&&document.querySelector('#'+ROOT+' .v3-main-img')},4500);
  if(!ok)throw new Error('Golden gallery render mismatch');
}

async function bootSnorry(){
  /* Snapshot BEFORE GR2 quarantine. */
  var rec=findNm2Zero(),candidates=collectRecord(rec);state.candidates=candidates.length;state.sourceRecord=rec&&rec.id||'';pub();
  if(!rec||!candidates.length)throw new Error('NM-2 current Zero Block gallery source not found');
  var verified=await verify(candidates);state.verified=verified.length;pub();
  if(!verified.length)throw new Error('NM-2 current Zero Block gallery has no verified raster photos');
  await load(V6,function(){return !!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6__});
  var ready=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6_STATE__;return s&&s.ready===true&&profile()&&document.querySelector('#'+ROOT+' .v3-shell')},13000);
  if(!ready)throw new Error('NM-2 base Golden pipeline did not become ready');
  await applyGallery(verified,'current-zero-gallery',rec);
  state.removed=Math.max(0,state.before-state.after);state.ready=true;pub();
}

async function bootAmp(){
  rememberForbidden();
  /* Prefer an explicit GL01 if page already has one. */
  var gl=findGL01(),glCandidates=collectRecord(gl),glVerified=[];
  if(glCandidates.length)glVerified=await verify(glCandidates.filter(function(u){return !forbiddenUrl(u)}));
  await load(V6,function(){return !!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6__});
  var ready=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6_STATE__;return s&&s.ready===true&&profile()&&document.querySelector('#'+ROOT+' .v3-shell')},13000);
  if(!ready)throw new Error('AMP base Golden pipeline did not become ready');
  var p=profile(),old=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.slice():[];
  state.before=old.length;
  var chosen,source;
  if(glVerified.length){chosen=glVerified;source='GL01';state.candidates=glCandidates.length;state.verified=glVerified.length;}
  else{
    var cleanCandidates=old.filter(function(u){return raster(u)&&!forbiddenUrl(u)});
    chosen=await verify(cleanCandidates);source='scrubbed-golden';state.candidates=cleanCandidates.length;state.verified=chosen.length;
  }
  if(!chosen.length)throw new Error('AMP gallery cleanup left no verified product photos');
  await applyGallery(chosen,source,gl);
  state.removed=Math.max(0,old.length-chosen.length);state.ready=true;pub();
}

(async function(){
 try{if(PATH===SNORRY)await bootSnorry();else await bootAmp();}
 catch(e){state.error=String(e&&e.message||e);pub();console.warn('[Filin V5.11 media fix]',state.error,state);return;}
 console.info('[Filin Labs] Master Product V5.11 media fix ready',state);
})();
pub();
})();