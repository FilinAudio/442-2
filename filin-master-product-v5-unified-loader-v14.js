/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V14
   NM-2 GL01 polish / no-blank-first-frame.
   - snorry_nm_2_headphones only: GL01 #rec3179623301 is authoritative gallery source.
   - preload + decode verified GL01 raster images BEFORE Golden re-apply.
   - keep source GL01 visible until Golden main image is fully decoded/paintable.
   - preserve Perfect Matches across Golden re-apply.
   - all other pages delegate to approved V13 unchanged.
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V14__)return;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V14__=true;

var VERSION='5.14.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var SNORRY='snorry_nm_2_headphones';
var ROOT='filin-master-product-v3';
var V13='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@ba86bfb0038680ad2102e154d9295d86ed5e1783/filin-master-product-v5-unified-loader-v13.js';
var V6='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@53d3eee1b46dc58df83be5b808dfb99be8b31f66/filin-master-product-v5-unified-loader-v6.js';

function load(src,test){return new Promise(function(resolve,reject){
 if(test&&test())return resolve(true);
 var file=src.split('/').pop().split('?')[0];
 var existing=Array.prototype.slice.call(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(file)>=0;});
 if(existing){var n=0,t=setInterval(function(){if(!test||test()){clearInterval(t);resolve(true)}else if(++n>300){clearInterval(t);resolve(false)}},50);return;}
 var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};(document.head||document.documentElement).appendChild(s);
});}

if(PATH!==SNORRY){load(V13,function(){return !!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V13__});return;}

/* V14 owns NM-2. */
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V13__=true;

var state={version:VERSION,slug:PATH,mode:'snorry-gl01-gallery-polished',ready:false,baseReady:false,source:'',sourceRecord:'',slides:0,candidates:0,verified:0,decoded:0,before:0,after:0,mainReady:false,pmBefore:false,pmRestored:false,error:'',urls:[]};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V14_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[])}
function str(v){return String(v==null?'':v).trim()}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test()}catch(e){}if(ok){clearInterval(t);resolve(true)}else if(Date.now()-st>(ms||15000)){clearInterval(t);resolve(false)}},50);});}
function toUrl(v){try{return new URL(str(v),location.origin).href}catch(e){return''}}
function cssUrl(v){var m=str(v).match(/url\(["']?([^"')]+)["']?\)/i);return m?toUrl(m[1]):''}
function valid(u){return /^https?:\/\//i.test(u)&&/(?:static|optim)\.tildacdn\.com/i.test(u)&&/\.(?:jpe?g|png|webp)(?:\?|$)/i.test(u)&&!/(?:\.svg|\/lib\/icons\/|dollar_currency|favicon|sprite|social|payment|telegram|whatsapp|youtube|photoroom|icon[-_.]|logo)/i.test(u)}
function add(out,v){var u=toUrl(v);if(valid(u)&&out.indexOf(u)<0)out.push(u)}
function addEl(out,el){if(!el||!el.getAttribute)return;['data-img-zoom-url','data-original','data-bg','data-src','data-lazy-src','src'].forEach(function(a){add(out,el.getAttribute(a))});add(out,cssUrl(el.getAttribute('style')));try{add(out,cssUrl(getComputedStyle(el).backgroundImage))}catch(e){}}
function collectRecord(rec){var out=[];if(!rec)return out;arr(rec.querySelectorAll('img,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[data-bg],[style*="background-image"]')).forEach(function(el){addEl(out,el)});var html=String(rec.outerHTML||'');var re=/https?:[^"'<>\s)]+(?:\.jpe?g|\.png|\.webp)(?:\?[^"'<>\s)]*)?/ig,m;while((m=re.exec(html)))add(out,m[0].replace(/&amp;/g,'&'));return out}
function preload(u){return new Promise(function(resolve){var im=new Image(),done=false,tm=setTimeout(function(){finish(null)},6000);function finish(x){if(done)return;done=true;clearTimeout(tm);resolve(x)}im.onload=async function(){var w=im.naturalWidth||0,h=im.naturalHeight||0;if(w<450||h<280){finish(null);return;}try{if(im.decode)await im.decode();}catch(e){}finish({url:u,w:w,h:h});};im.onerror=function(){finish(null)};im.decoding='async';im.src=u;});}
async function verifyAndDecode(xs){var out=[];for(var i=0;i<xs.length;i++){var x=await preload(xs[i]);if(x&&out.indexOf(x.url)<0)out.push(x.url)}state.decoded=out.length;return out}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null}catch(e){return null}}
function findGL01(){var fixed=document.getElementById('rec3179623301');if(fixed)return fixed;var rec=document.querySelector('.t-rec[data-record-type="670"]');if(rec)return rec;var t=document.querySelector('.t670');return t&&t.closest('.t-rec,[id^="rec"]')||null;}
function snapshotPM(){var pm=document.querySelector('#'+ROOT+' .v3-pm');if(!pm)return null;state.pmBefore=true;return{html:pm.outerHTML,open:pm.classList.contains('open')}}
function restorePM(snap){if(!snap)return false;var root=document.getElementById(ROOT);if(!root)return false;var existing=root.querySelector('.v3-pm');if(existing){state.pmRestored=true;return true;}var host=root.querySelector('.v3-js-product')||root.querySelector('.v3-commerce .js-product');if(!host)return false;var box=document.createElement('div');box.innerHTML=snap.html;var fresh=box.firstElementChild;if(!fresh)return false;var buy=host.querySelector('.v3-buy');if(buy&&buy.parentNode)buy.parentNode.insertBefore(fresh,buy.nextSibling);else host.appendChild(fresh);if(snap.open)fresh.classList.add('open');var toggle=fresh.querySelector('.v3-pm-toggle');if(toggle){toggle.setAttribute('aria-expanded',fresh.classList.contains('open')?'true':'false');toggle.addEventListener('click',function(){fresh.classList.toggle('open');toggle.setAttribute('aria-expanded',fresh.classList.contains('open')?'true':'false')});}state.pmRestored=true;return true;}

(async function(){
 try{
   var rec=findGL01();
   if(!rec)throw new Error('NM-2 GL01 source not found');
   state.sourceRecord=rec.id||'';
   state.slides=rec.querySelectorAll('.t670__img,.t-slds__bgimg,.t-slds__item,img').length;
   var candidates=collectRecord(rec);state.candidates=candidates.length;pub();
   var verified=await verifyAndDecode(candidates);state.verified=verified.length;state.urls=verified.slice();pub();
   if(!verified.length)throw new Error('NM-2 GL01 has no verified product photos');

   await load(V6,function(){return !!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6__});
   var base=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V6_STATE__;return s&&s.ready===true&&profile()&&document.querySelector('#'+ROOT+' .v3-shell')},16000);
   state.baseReady=!!base;pub();
   if(!base)throw new Error('NM-2 base Golden pipeline did not become ready');

   var p=profile(),api=window.FilinMasterProductV3;if(!p||!p.overview||!api||typeof api.apply!=='function')throw new Error('NM-2 Golden profile unavailable');
   state.before=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.length:0;
   var pm=snapshotPM();
   p.overview.galleryImages=verified.slice();
   api.apply();
   state.after=verified.length;state.source='GL01';
   restorePM(pm);pub();

   /* Explicitly force first verified image into Golden main stage and wait until it is drawable. */
   var main=document.querySelector('#'+ROOT+' .v3-main-img');
   if(!main)throw new Error('NM-2 Golden main image not found');
   main.decoding='sync';
   if(main.src!==verified[0])main.src=verified[0];
   var mainOk=await wait(function(){var x=document.querySelector('#'+ROOT+' .v3-main-img');return x&&x.complete&&x.naturalWidth>0&&x.naturalHeight>0;},7000);
   state.mainReady=!!mainOk;pub();
   if(!mainOk)throw new Error('NM-2 first Golden image did not become drawable');
   try{if(main.decode)await main.decode();}catch(e){}

   /* Only now hide source GL01. This prevents the blank transition frame. */
   rec.style.setProperty('display','none','important');

   var ok=await wait(function(){return document.querySelectorAll('#'+ROOT+' .v3-thumb').length===verified.length&&document.querySelector('#'+ROOT+' .v3-main-img')&&document.querySelector('#'+ROOT+' .v3-main-img').naturalWidth>0},5000);
   if(!ok)throw new Error('NM-2 Golden gallery render mismatch');
   if(pm&&!document.querySelector('#'+ROOT+' .v3-pm'))restorePM(pm);
   state.ready=true;state.error='';pub();
   console.info('[Filin Labs] Master Product V5.14 NM-2 GL01 polished ready',state);
 }catch(e){state.error=String(e&&e.message||e);pub();console.warn('[Filin V5.14 NM-2]',state.error,state);}
})();
pub();
})();