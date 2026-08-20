/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V12
   Regression fix over V11:
   - Attento / Gerbera Electrostatic / Demograf Ajax: scrub bad media WITHOUT losing Perfect Matches.
   - Snorry NM-2: ALWAYS boot stable GR2 Golden first; current Zero Block gallery is optional override.
     If source detection fails, keep the working Golden page instead of falling back to legacy Tilda.
   - KT66 and all other pages delegate to approved V10.
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V12__)return;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V12__=true;

var VERSION='5.12.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';
var V10='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@f2e683f3a916d95e89adcb98236d6dd45695eb36/filin-master-product-v5-unified-loader-v10.js';
var V6='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@53d3eee1b46dc58df83be5b808dfb99be8b31f66/filin-master-product-v5-unified-loader-v6.js';
var SNORRY='snorry_nm_2_headphones';
var AMPS=['gerbera_electrostatic_amplifier','gerbera_attento_otl_tube_electrostatic_headphone_amplifier','demograf_ajax_tube_amplifier_el_84'];
var TARGET=AMPS.concat([SNORRY]);

function load(src,test){return new Promise(function(resolve,reject){
 if(test&&test())return resolve(true);
 var file=src.split('/').pop().split('?')[0];
 var existing=Array.prototype.slice.call(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(file)>=0;});
 if(existing){var n=0,t=setInterval(function(){if(!test||test()){clearInterval(t);resolve(true)}else if(++n>260){clearInterval(t);resolve(false)}},50);return;}
 var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};(document.head||document.documentElement).appendChild(s);
});}
if(TARGET.indexOf(PATH)<0){load(V10,function(){return !!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V10__});return;}
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V10__=true;

var state={version:VERSION,slug:PATH,mode:PATH===SNORRY?'snorry-safe-zero-gallery':'amp-safe-media-scrub',ready:false,baseReady:false,source:'',sourceRecord:'',candidates:0,verified:0,before:0,after:0,removed:0,pmBefore:false,pmRestored:false,error:'',urls:[]};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V12_STATE__=JSON.parse(JSON.stringify(state));}
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
function collectRecord(rec){var out=[];if(!rec)return out;arr(rec.querySelectorAll('img,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[data-bg],[style*="background-image"]')).forEach(function(el){addEl(out,el)});var html=String(rec.outerHTML||'');var re=/https?:[^"'<>\s)]+(?:\.jpe?g|\.png|\.webp)(?:\?[^"'<>\s)]*)?/ig,m;while((m=re.exec(html)))add(out,m[0].replace(/&amp;/g,'&'));return out}

var forbidden={};
function rememberForbidden(){arr(document.querySelectorAll('header img,footer img,#t-header img,#t-footer img,[class*="logo"] img,[class*="logo"] [style*="background-image"]')).forEach(function(el){var xs=[];addEl(xs,el);xs.forEach(function(u){forbidden[u]=1})});}
function forbiddenUrl(u){return obviouslyBad(u)||!!forbidden[u]||/(?:filin[-_ ]?labs|filin[-_ ]?audio|owl[-_ ]?logo|logo)/i.test(u)}
function findGL01(){var x=document.querySelector('.t-rec[data-record-type="670"]');if(x)return x;var t=document.querySelector('.t670');return t&&t.closest('.t-rec,[id^="rec"]')||null}

/* Preserve PM across api.apply(), because Golden apply rebuilds the product root. */
function snapshotPM(){var pm=document.querySelector('#'+ROOT+' .v3-pm');if(!pm)return null;state.pmBefore=true;return {html:pm.outerHTML,open:pm.classList.contains('open')};}
function restorePM(snap){if(!snap)return false;var root=document.getElementById(ROOT);if(!root)return false;var existing=root.querySelector('.v3-pm');if(existing)return true;var host=root.querySelector('.v3-js-product')||root.querySelector('.v3-commerce .js-product');if(!host)return false;var box=document.createElement('div');box.innerHTML=snap.html;var fresh=box.firstElementChild;if(!fresh)return false;var buy=host.querySelector('.v3-buy');if(buy&&buy.parentNode)buy.parentNode.insertBefore(fresh,buy.nextSibling);else host.appendChild(fresh);if(snap.open)fresh.classList.add('open');var toggle=fresh.querySelector('.v3-pm-toggle');if(toggle){toggle.setAttribute('aria-expanded',fresh.classList.contains('open')?'true':'false');toggle.addEventListener('click',function(){fresh.classList.toggle('open');toggle.setAttribute('aria-expanded',fresh.classList.contains('open')?'true':'false')});}state.pmRestored=true;return true;}
async function applyGallery(urls,source,rec){var p=profile(),api=window.FilinMasterProductV3;if(!p||!p.overview||!api||typeof api.apply!=='function')throw new Error('Golden profile unavailable');state.before=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.length:0;var pm=snapshotPM();p.overview.galleryImages=urls.slice();api.apply();state.after=urls.length;state.urls=urls.slice();state.source=source;state.sourceRecord=rec&&rec.id||'';restorePM(pm);pub();var ok=await wait(function(){return document.querySelectorAll('#'+ROOT+' .v3-thumb').length===urls.length&&document.querySelector('#'+ROOT+' .v3-main-img')},4500);if(!ok)throw new Error('Golden gallery render mismatch');if(pm&&!document.querySelector('#'+ROOT+' .v3-pm'))restorePM(pm);}

/* Stronger NM-2 Zero Block detection: inspect innerText + outerHTML + raster count. */
function findNm2Zero(){var recs=arr(document.querySelectorAll('.t-rec,[id^="rec"]')),best=null,bestScore=-1;recs.forEach(function(r){if(!r.querySelector('.t396,.tn-elem'))return;var text=(str(r.innerText||r.textContent)+' '+String(r.outerHTML||'')).toLowerCase(),imgs=collectRecord(r),score=0;if(text.indexOf('snorry nm-2 planar magnetic headphones')>=0)score+=80;if(text.indexOf('the snorry nm-2 is a cutting-edge')>=0)score+=50;if(text.indexOf('ru2783727')>=0)score+=40;if(text.indexOf('nm-2')>=0)score+=15;score+=Math.min(imgs.length,10)*4;if(imgs.length>=2)score+=15;if(score>bestScore){bestScore=score;best=r}});return bestScore>=25?best:null;}

async function ensureV6(){await load(V6,function(){return !!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6__});var ready=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6_STATE__;return s&&s.ready===true&&profile()&&document.querySelector('#'+ROOT+' .v3-shell')},14000);state.baseReady=!!ready;pub();if(!ready)throw new Error('base Golden pipeline did not become ready');}

async function bootSnorry(){
 /* Snapshot candidate source BEFORE GR2 quarantine, but never depend on it. */
 var rec=findNm2Zero(),candidates=collectRecord(rec);state.candidates=candidates.length;state.sourceRecord=rec&&rec.id||'';pub();
 var verifyPromise=candidates.length?verify(candidates):Promise.resolve([]);
 await ensureV6();
 var verified=await verifyPromise;state.verified=verified.length;pub();
 if(!rec||!verified.length){state.source='golden-fallback-no-zero-source';state.ready=true;state.error='';pub();console.info('[Filin V5.12] NM-2 Zero source unavailable; kept stable Golden page');return;}
 await applyGallery(verified,'current-zero-gallery',rec);state.removed=Math.max(0,state.before-state.after);state.ready=true;state.error='';pub();
}

async function bootAmp(){
 rememberForbidden();
 var gl=findGL01(),glCandidates=collectRecord(gl),glVerified=[];
 if(glCandidates.length)glVerified=await verify(glCandidates.filter(function(u){return !forbiddenUrl(u)}));
 await ensureV6();
 var p=profile(),old=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.slice():[];state.before=old.length;
 var chosen,source;
 if(glVerified.length){chosen=glVerified;source='GL01';state.candidates=glCandidates.length;state.verified=glVerified.length;}
 else{var clean=old.filter(function(u){return raster(u)&&!forbiddenUrl(u)});chosen=await verify(clean);source='scrubbed-golden';state.candidates=clean.length;state.verified=chosen.length;}
 if(!chosen.length)throw new Error('AMP gallery cleanup left no verified product photos');
 await applyGallery(chosen,source,gl);state.removed=Math.max(0,old.length-chosen.length);state.ready=true;state.error='';pub();
}

(async function(){try{if(PATH===SNORRY)await bootSnorry();else await bootAmp();}catch(e){state.error=String(e&&e.message||e);pub();console.warn('[Filin V5.12 media fix]',state.error,state);return;}console.info('[Filin Labs] Master Product V5.12 media fix ready',state);})();
pub();
})();