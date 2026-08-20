/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V13
   NM-2 GL01 authoritative gallery source.
   - snorry_nm_2_headphones: reads only current GL01 (#rec3179623301 preferred),
     then boots stable V6/GR2 Golden and overrides galleryImages once.
   - preserves Perfect Matches across Golden re-apply.
   - hides source GL01 after capture.
   - all other pages delegate to approved V12 unchanged.
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V13__)return;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V13__=true;

var VERSION='5.13.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var SNORRY='snorry_nm_2_headphones';
var ROOT='filin-master-product-v3';
var V12='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@2b26e0cf7fa59c753b7055a9f342942b7e7c2780/filin-master-product-v5-unified-loader-v12.js';
var V6='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@53d3eee1b46dc58df83be5b808dfb99be8b31f66/filin-master-product-v5-unified-loader-v6.js';

function load(src,test){return new Promise(function(resolve,reject){
 if(test&&test())return resolve(true);
 var file=src.split('/').pop().split('?')[0];
 var existing=Array.prototype.slice.call(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(file)>=0;});
 if(existing){var n=0,t=setInterval(function(){if(!test||test()){clearInterval(t);resolve(true)}else if(++n>260){clearInterval(t);resolve(false)}},50);return;}
 var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};(document.head||document.documentElement).appendChild(s);
});}

if(PATH!==SNORRY){load(V12,function(){return !!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V12__});return;}

/* V13 owns NM-2. Prevent V12 from taking this route if another script copy appears. */
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V12__=true;

var state={version:VERSION,slug:PATH,mode:'snorry-gl01-gallery',ready:false,baseReady:false,source:'',sourceRecord:'',slides:0,candidates:0,verified:0,before:0,after:0,pmBefore:false,pmRestored:false,error:'',urls:[]};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V13_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[])}
function str(v){return String(v==null?'':v).trim()}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test()}catch(e){}if(ok){clearInterval(t);resolve(true)}else if(Date.now()-st>(ms||14000)){clearInterval(t);resolve(false)}},60);});}
function toUrl(v){try{return new URL(str(v),location.origin).href}catch(e){return''}}
function cssUrl(v){var m=str(v).match(/url\(["']?([^"')]+)["']?\)/i);return m?toUrl(m[1]):''}
function valid(u){return /^https?:\/\//i.test(u)&&/(?:static|optim)\.tildacdn\.com/i.test(u)&&/\.(?:jpe?g|png|webp)(?:\?|$)/i.test(u)&&!/(?:\.svg|\/lib\/icons\/|dollar_currency|favicon|sprite|social|payment|telegram|whatsapp|youtube|photoroom|icon[-_.]|logo)/i.test(u)}
function add(out,v){var u=toUrl(v);if(valid(u)&&out.indexOf(u)<0)out.push(u)}
function addEl(out,el){if(!el||!el.getAttribute)return;['data-img-zoom-url','data-original','data-bg','data-src','data-lazy-src','src'].forEach(function(a){add(out,el.getAttribute(a))});add(out,cssUrl(el.getAttribute('style')));try{add(out,cssUrl(getComputedStyle(el).backgroundImage))}catch(e){}}
function collectRecord(rec){var out=[];if(!rec)return out;arr(rec.querySelectorAll('img,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[data-bg],[style*="background-image"]')).forEach(function(el){addEl(out,el)});var html=String(rec.outerHTML||'');var re=/https?:[^"'<>\s)]+(?:\.jpe?g|\.png|\.webp)(?:\?[^"'<>\s)]*)?/ig,m;while((m=re.exec(html)))add(out,m[0].replace(/&amp;/g,'&'));return out}
function probe(u){return new Promise(function(resolve){var im=new Image(),done=false,tm=setTimeout(function(){finish(null)},5000);function finish(x){if(done)return;done=true;clearTimeout(tm);resolve(x)}im.onload=function(){var w=im.naturalWidth||0,h=im.naturalHeight||0;if(w>=450&&h>=280)finish({url:u,w:w,h:h});else finish(null)};im.onerror=function(){finish(null)};im.src=u})}
async function verify(xs){var out=[];for(var i=0;i<xs.length;i++){var x=await probe(xs[i]);if(x&&out.indexOf(x.url)<0)out.push(x.url)}return out}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null}catch(e){return null}}

function findGL01(){
 var fixed=document.getElementById('rec3179623301');
 if(fixed)return fixed;
 var rec=document.querySelector('.t-rec[data-record-type="670"]');
 if(rec)return rec;
 var t=document.querySelector('.t670');return t&&t.closest('.t-rec,[id^="rec"]')||null;
}
function snapshotPM(){var pm=document.querySelector('#'+ROOT+' .v3-pm');if(!pm)return null;state.pmBefore=true;return{html:pm.outerHTML,open:pm.classList.contains('open')}}
function restorePM(snap){if(!snap)return false;var root=document.getElementById(ROOT);if(!root)return false;var existing=root.querySelector('.v3-pm');if(existing){state.pmRestored=true;return true;}var host=root.querySelector('.v3-js-product')||root.querySelector('.v3-commerce .js-product');if(!host)return false;var box=document.createElement('div');box.innerHTML=snap.html;var fresh=box.firstElementChild;if(!fresh)return false;var buy=host.querySelector('.v3-buy');if(buy&&buy.parentNode)buy.parentNode.insertBefore(fresh,buy.nextSibling);else host.appendChild(fresh);if(snap.open)fresh.classList.add('open');var toggle=fresh.querySelector('.v3-pm-toggle');if(toggle){toggle.setAttribute('aria-expanded',fresh.classList.contains('open')?'true':'false');toggle.addEventListener('click',function(){fresh.classList.toggle('open');toggle.setAttribute('aria-expanded',fresh.classList.contains('open')?'true':'false')});}state.pmRestored=true;return true;}

(async function(){
 try{
   /* Snapshot GL01 BEFORE GR2 can quarantine legacy Tilda records. */
   var rec=findGL01();
   if(!rec)throw new Error('NM-2 GL01 source not found');
   state.sourceRecord=rec.id||'';
   state.slides=rec.querySelectorAll('.t670__img,.t-slds__bgimg,.t-slds__item,img').length;
   var candidates=collectRecord(rec);state.candidates=candidates.length;pub();
   var verified=await verify(candidates);state.verified=verified.length;state.urls=verified.slice();pub();
   if(!verified.length)throw new Error('NM-2 GL01 has no verified product photos');

   await load(V6,function(){return !!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6__});
   var base=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6_STATE__;return s&&s.ready===true&&profile()&&document.querySelector('#'+ROOT+' .v3-shell')},15000);
   state.baseReady=!!base;pub();
   if(!base)throw new Error('NM-2 base Golden pipeline did not become ready');

   var p=profile(),api=window.FilinMasterProductV3;if(!p||!p.overview||!api||typeof api.apply!=='function')throw new Error('NM-2 Golden profile unavailable');
   state.before=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.length:0;
   var pm=snapshotPM();
   p.overview.galleryImages=verified.slice();
   api.apply();
   state.after=verified.length;state.source='GL01';
   restorePM(pm);
   /* Hide the source GL01 after successful capture so only Golden gallery remains visible. */
   rec.style.setProperty('display','none','important');
   pub();

   var ok=await wait(function(){return document.querySelectorAll('#'+ROOT+' .v3-thumb').length===verified.length&&document.querySelector('#'+ROOT+' .v3-main-img')},5000);
   if(!ok)throw new Error('NM-2 Golden gallery render mismatch');
   if(pm&&!document.querySelector('#'+ROOT+' .v3-pm'))restorePM(pm);
   state.ready=true;state.error='';pub();
   console.info('[Filin Labs] Master Product V5.13 NM-2 GL01 ready',state);
 }catch(e){state.error=String(e&&e.message||e);pub();console.warn('[Filin V5.13 NM-2]',state.error,state);}
})();
pub();
})();