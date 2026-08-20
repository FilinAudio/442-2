/* ============================================================
   FILIN LABS — MASTER PRODUCT V4 PRODUCTION AMP BATCH V4
   Version 4.4.0

   Unified entrypoint for the approved 10 tube-amplifier pages.
   Loads V4.3 (which includes V4.2 media safety + KT150 PM contract),
   and adds complete Tilda Zero Block media capture/audit.

   Why:
   Some legacy amplifier photos live in Tilda Zero Blocks (t396) and
   are not descendants of the normal product/gallery record. Earlier
   media capture could therefore miss valid product photos.

   V4.4:
   - snapshots Zero Block media BEFORE any Golden quarantine
   - only scans the product-content zone, excluding header/footer/store
   - reads img/src + Tilda lazy/data attributes + CSS backgrounds
   - verifies every candidate by real image load and dimensions
   - merges healthy missing Zero Block photos into Golden thumbnails
   - updates the active V3 profile galleryImages array
   - audits the final Golden gallery and hides truly dead thumbnails
   - one quiet final log; no MutationObserver loop
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V4__)return;

var VERSION='4.4.0';
var ROOT_ID='filin-master-product-v3';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ALLOWED=[
  'gerbera_lira_compact_tube_amplifier_ultralinear_se',
  'gerbera_2a3_tube_amplifier',
  'audioinstrument_sirius_kt150_tube_amplifier',
  'audioinstrument_sirius_kt66_push_pull_tube_amplifier',
  'demograf_ajax_tube_amplifier_el_84',
  'gerbera_ha_45_tube_headphone_amplifier_dac',
  'gerbera_ha_15_tube_amp_electrostatic_planar',
  'gerbera_a8045_tube_headphone_amplifier',
  'gerbera_electrostatic_amplifier',
  'gerbera_attento_otl_tube_electrostatic_headphone_amplifier'
];
if(ALLOWED.indexOf(PATH)<0)return;
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V4__=true;

var V3='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@fb04f14e7edc4043971f15ac41bb525f2fbfdcdb/filin-master-product-v4-production-amp-batch-v3.js';
var zeroCandidates=[],verifiedZero=[],bad={},added=0,removed=0,finalHealthy=0,lastError='';
var state={version:VERSION,slug:PATH,ready:false,zeroBlockRecords:0,zeroBlockCandidates:0,verifiedZeroBlockImages:0,addedToGolden:0,finalGalleryImages:0,finalHealthy:0,removedBroken:0,badImages:0,lastError:''};

function pub(){state.zeroBlockCandidates=zeroCandidates.length;state.verifiedZeroBlockImages=verifiedZero.length;state.addedToGolden=added;state.finalHealthy=finalHealthy;state.removedBroken=removed;state.badImages=Object.keys(bad).length;state.lastError=lastError;window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V4_STATE__=JSON.parse(JSON.stringify(state));}
function str(v){return String(v==null?'':v).trim();}
function arr(v){return Array.prototype.slice.call(v||[]);}
function toUrl(v){try{return new URL(str(v),location.href).href;}catch(e){return'';}}
function cssUrls(v){var out=[],re=/url\(["']?([^"')]+)["']?\)/ig,m;v=str(v);while((m=re.exec(v)))out.push(toUrl(m[1]));return out;}
function valid(u){return !!u&&/^https?:\/\//i.test(u)&&!/(blank\.gif|empty\.png|pixel|favicon|logo|sprite|cookie|payment|telegram|whatsapp|youtube|icon[-_.]|social|arrow|spinner|preload|loader)/i.test(u);}
function add(out,v){var u=toUrl(v);if(valid(u)&&out.indexOf(u)<0)out.push(u);}
function addEl(out,el){
  if(!el||!el.getAttribute)return;
  ['data-content-cover-bg','data-original','data-img-zoom-url','data-bg','data-src','data-lazy-src','data-zoom-target','src'].forEach(function(a){add(out,el.getAttribute(a));});
  var ss=el.getAttribute('srcset');if(ss)ss.split(',').forEach(function(x){add(out,x.trim().split(/\s+/)[0]);});
  cssUrls(el.getAttribute('style')).forEach(function(u){add(out,u);});
  try{cssUrls(getComputedStyle(el).backgroundImage).forEach(function(u){add(out,u);});}catch(e){}
}
function noise(el){return !!(el&&el.closest&&el.closest('header,footer,.t706,.t1002,.t-store__card,.t-card,.t-popup,[class*="social"],[class*="menu"],[class*="footer"],[class*="header"]'));}
function recOf(n){return n&&n.closest&&n.closest('.t-rec,[id^="rec"]');}
function recs(){return arr(document.querySelectorAll('.t-rec,[id^="rec"]'));}
function imageCandidates(scope){var out=[];if(!scope)return out;arr(scope.querySelectorAll('img,.t-bgimg,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[data-content-cover-bg],[data-bg],[style*="background-image"],[data-elem-type="image"]')).forEach(function(el){if(!noise(el))addEl(out,el);});return out;}
function textLen(r){return str(r&&r.innerText).replace(/\s+/g,' ').length;}
function isExcludedRecord(r){var t=str(r&&r.innerText).toLowerCase();return /perfect matches|reviews?|shipping|payment|contact|legal|hi-fi\s*&\s*high-end|refer a friend|loyalty/.test(t)||!!r.querySelector('form,.t706,.t1002');}

function snapshotZeroBlocks(){
  var rs=recs(),cover=document.querySelector('.t-cover'),coverRec=recOf(cover),product=arr(document.querySelectorAll('.js-product')).find(function(x){return !x.closest('.t706,.t1002,#'+ROOT_ID);}),productRec=recOf(product);
  var ci=coverRec?rs.indexOf(coverRec):-1,pi=productRec?rs.indexOf(productRec):-1;
  var selected=[];
  rs.forEach(function(r,i){
    if(!r.querySelector('.t396,[data-artboard-recid],.tn-elem'))return;
    if(isExcludedRecord(r))return;
    if(ci>=0&&i<=ci)return;
    if(pi>=0&&i>pi+2)return;
    /* Product media Zero Blocks are normally image-heavy and text-light. */
    var imgs=imageCandidates(r);if(!imgs.length)return;
    if(textLen(r)>900&&imgs.length<2)return;
    selected.push(r);imgs.forEach(function(u){add(zeroCandidates,u);});
  });
  /* Fallback: if product record could not be located, use image-heavy Zero Blocks before footer. */
  if(!selected.length){
    rs.forEach(function(r){if(!r.querySelector('.t396,[data-artboard-recid],.tn-elem')||isExcludedRecord(r)||textLen(r)>500)return;var xs=imageCandidates(r);if(xs.length>=1){selected.push(r);xs.forEach(function(u){add(zeroCandidates,u);});}});
  }
  /* Never treat hero cover background as a gallery image merely because it is Tilda media. */
  var hero=[];if(cover)imageCandidates(cover).forEach(function(u){add(hero,u);});
  zeroCandidates=zeroCandidates.filter(function(u){return hero.indexOf(u)<0;});
  state.zeroBlockRecords=selected.length;pub();
}
function probe(u,timeout){return new Promise(function(resolve){if(!valid(u)){resolve({ok:false,w:0,h:0});return;}var im=new Image(),done=false,tm=setTimeout(function(){finish(false);},timeout||4500);function finish(ok){if(done)return;done=true;clearTimeout(tm);resolve({ok:!!ok,w:im.naturalWidth||0,h:im.naturalHeight||0});}im.onload=function(){var w=im.naturalWidth||0,h=im.naturalHeight||0;finish(w>=320&&h>=240&&Math.max(w,h)>=600);};im.onerror=function(){finish(false);};im.src=u;});}
async function verifyZero(){for(var i=0;i<zeroCandidates.length;i++){var u=zeroCandidates[i],r=await probe(u,4300);if(r.ok)verifiedZero.push(u);else bad[u]=1;}pub();}
function loadV3(){return new Promise(function(resolve,reject){if(window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V3__){resolve(true);return;}var s=document.createElement('script');s.src=V3;s.async=true;s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('V4.3 load failed'));};(document.head||document.documentElement).appendChild(s);});}
function waitRoot(ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var r=document.getElementById(ROOT_ID);if(r){clearInterval(t);resolve(r);}else if(Date.now()-st>(ms||10000)){clearInterval(t);resolve(null);}},60);});}
function thumbUrl(t){var im=t&&t.querySelector('img');return toUrl(im&&(im.currentSrc||im.getAttribute('src')||im.src));}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null;}catch(e){return null;}}
function mergeIntoProfile(urls){var p=profile();if(!p)return; p.overview=p.overview||{};var xs=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.slice():[],seen={};xs.forEach(function(u){seen[toUrl(u)]=1;});urls.forEach(function(u){if(!seen[u]){xs.push(u);seen[u]=1;}});p.overview.galleryImages=xs;}
function appendMissing(root){
  if(!root)return;
  var bar=root.querySelector('.v3-thumbs');if(!bar)return;
  var seen={};arr(root.querySelectorAll('.v3-thumb')).forEach(function(t){var u=thumbUrl(t);if(u)seen[u]=1;});
  var toAdd=[];verifiedZero.forEach(function(u){if(!seen[u]){toAdd.push(u);seen[u]=1;}});
  toAdd.forEach(function(u){var b=document.createElement('button');b.className='v3-thumb';b.type='button';b.setAttribute('data-i',String(bar.querySelectorAll('.v3-thumb').length));var im=document.createElement('img');im.src=u;im.alt='';im.decoding='async';b.appendChild(im);bar.appendChild(b);added++;});
  mergeIntoProfile(toAdd);state.finalGalleryImages=root.querySelectorAll('.v3-thumb').length;pub();
}
async function auditFinal(root){
  if(!root)return;
  var ts=arr(root.querySelectorAll('.v3-thumb')),healthy=0;
  for(var i=0;i<ts.length;i++){
    var t=ts[i],u=thumbUrl(t),r=await probe(u,3400);
    if(r.ok){healthy++;var im=t.querySelector('img');if(im){im.style.visibility='visible';im.style.opacity='1';}continue;}
    if(u)bad[u]=1;
    t.style.display='none';removed++;
  }
  finalHealthy=healthy;state.finalGalleryImages=ts.length;pub();
}
async function boot(){
  try{
    /* Critical: capture Zero Blocks before V4.3/V4.2 can quarantine legacy records. */
    snapshotZeroBlocks();
    await verifyZero();
    await loadV3();
    var root=await waitRoot(10000);if(!root)throw new Error('Golden root timeout');
    appendMissing(root);
    await auditFinal(root);
    setTimeout(function(){var r=document.getElementById(ROOT_ID);appendMissing(r);auditFinal(r);},1800);
    setTimeout(function(){var r=document.getElementById(ROOT_ID);appendMissing(r);auditFinal(r);},4800);
    state.ready=true;pub();
    console.info('[Filin Labs] Master Product V4 AMP Batch V4 ready',{version:VERSION,slug:PATH,ready:true,zeroBlockRecords:state.zeroBlockRecords,verifiedZeroBlockImages:verifiedZero.length,addedToGolden:added,finalGalleryImages:state.finalGalleryImages,badImages:Object.keys(bad).length});
  }catch(e){lastError=String(e&&e.message||e);pub();console.warn('[Filin V4.4]',lastError);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);},{once:true});else setTimeout(boot,0);
pub();
})();
