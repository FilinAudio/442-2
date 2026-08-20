/* ============================================================
   FILIN LABS — MASTER PRODUCT V4 PRODUCTION AMP BATCH V6
   Version 4.6.1

   Production entrypoint for the approved 10 tube-amplifier pages.

   KT66 special handling:
   - DOES NOT load V4.5
   - rejects relative / numeric t396 values BEFORE URL parsing
   - scans normal Tilda media + Zero Blocks + lazy attrs + CSS backgrounds
   - verifies candidates by real image load and product-photo dimensions
   - uses stable AMP V4.3 as the base pipeline for KT66
   - merges only verified missing images into Golden gallery/profile
   - repairs/hides dead Golden thumbnails

   Other 9 AMP pages delegate unchanged to approved V4.4.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V6__)return;

var VERSION='4.6.1';
var ROOT_ID='filin-master-product-v3';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var TARGET='audioinstrument_sirius_kt66_push_pull_tube_amplifier';
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
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V6__=true;

var V43='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@fb04f14e7edc4043971f15ac41bb525f2fbfdcdb/filin-master-product-v4-production-amp-batch-v3.js';
var V44='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@489bc8c15408dd48cd7b21ab70b257fe2df267e7/filin-master-product-v4-production-amp-batch-v4.js';

var candidates=[],verified=[],heroUrls=[],bad={},added=0,repaired=0,removed=0;
var state={version:VERSION,slug:PATH,ready:false,targeted:PATH===TARGET,candidates:0,verified:0,addedToGolden:0,repaired:0,removedBroken:0,finalGalleryImages:0,badImages:0,rejectedRelative:0,lastError:''};
function pub(){state.candidates=candidates.length;state.verified=verified.length;state.addedToGolden=added;state.repaired=repaired;state.removedBroken=removed;state.badImages=Object.keys(bad).length;window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V6_STATE__=JSON.parse(JSON.stringify(state));}
function s(v){return String(v==null?'':v).trim();}
function arr(v){return Array.prototype.slice.call(v||[]);}

/* Never coerce t396 values such as 1, 5, 10 into /1, /5, /10. */
function strictUrl(raw){
  raw=s(raw).replace(/^['"]|['"]$/g,'');
  if(!raw)return'';
  if(/^\d+(?:\.\d+)?(?:px|%|deg|s|ms)?$/i.test(raw)){state.rejectedRelative++;return'';}
  if(/^(none|auto|inherit|initial|unset|cover|contain|center|left|right|top|bottom)$/i.test(raw)){state.rejectedRelative++;return'';}
  if(/^\/\//.test(raw))raw=location.protocol+raw;
  if(!/^https?:\/\//i.test(raw)){state.rejectedRelative++;return'';}
  try{return new URL(raw).href;}catch(e){return'';}
}
function imageLike(u){
  if(!u)return false;
  if(/(?:static\.)?tildacdn\.(?:com|net|info)/i.test(u))return true;
  return /\.(?:jpe?g|png|webp|avif|gif)(?:[?#]|$)/i.test(u);
}
function valid(u){return imageLike(u)&&!/(blank\.gif|empty\.png|pixel|favicon|logo|sprite|cookie|payment|telegram|whatsapp|youtube|icon[-_.]|social|arrow|spinner|preload|loader|captcha|recaptcha)/i.test(u);}
function add(out,raw){var u=strictUrl(raw);if(valid(u)&&out.indexOf(u)<0)out.push(u);}
function cssUrls(v){var out=[],m,re=/url\(["']?([^"')]+)["']?\)/ig;v=s(v);while((m=re.exec(v)))add(out,m[1]);return out;}
function addEl(out,el){
  if(!el||!el.getAttribute)return;
  ['data-content-cover-bg','data-original','data-img-zoom-url','data-bg','data-src','data-lazy-src','data-original-src','src'].forEach(function(a){add(out,el.getAttribute(a));});
  var ss=el.getAttribute('srcset');if(ss)ss.split(',').forEach(function(x){add(out,x.trim().split(/\s+/)[0]);});
  cssUrls(el.getAttribute('style')).forEach(function(u){if(out.indexOf(u)<0)out.push(u);});
  try{cssUrls(getComputedStyle(el).backgroundImage).forEach(function(u){if(out.indexOf(u)<0)out.push(u);});}catch(e){}
}
function noise(el){return !!(el&&el.closest&&el.closest('header,footer,.t706,.t1002,.t-store__card,.t-popup,[class*="social"],[class*="menu"],[class*="footer"],[class*="header"],[class*="review"]'));}
function recordNoise(el){var r=el&&el.closest&&el.closest('.t-rec,[id^="rec"]');if(!r)return false;var t=s(r.innerText).toLowerCase();return /perfect matches|shipping|payment|contact|legal|hi-fi\s*&\s*high-end|refer a friend|loyalty|the review|recommended products|you may also like/.test(t);}
function snapshotHero(){var cover=document.querySelector('.t-cover');if(!cover)return;addEl(heroUrls,cover);arr(cover.querySelectorAll('img,.t-bgimg,[data-original],[data-src],[data-content-cover-bg],[style*="background-image"]')).forEach(function(el){addEl(heroUrls,el);});}
function snapshotKT66(){
  snapshotHero();
  var selector='img,.t-bgimg,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[data-content-cover-bg],[data-bg],[style*="background-image"],[data-elem-type="image"],.tn-atom__img,.tn-atom';
  arr(document.querySelectorAll(selector)).forEach(function(el){
    if(noise(el)||recordNoise(el)||el.closest('.t-cover'))return;
    var tmp=[];addEl(tmp,el);tmp.forEach(function(u){if(heroUrls.indexOf(u)<0&&candidates.indexOf(u)<0)candidates.push(u);});
  });
  try{performance.getEntriesByType('resource').forEach(function(e){var u=strictUrl(e&&e.name);if(valid(u)&&/tildacdn/i.test(u)&&heroUrls.indexOf(u)<0&&candidates.indexOf(u)<0)candidates.push(u);});}catch(e){}
  pub();
}
function probe(u,timeout){return new Promise(function(resolve){
  if(!valid(u)){resolve({ok:false,w:0,h:0});return;}
  var im=new Image(),done=false,tm=setTimeout(function(){finish(false);},timeout||3600);
  function finish(ok){if(done)return;done=true;clearTimeout(tm);resolve({ok:!!ok,w:im.naturalWidth||0,h:im.naturalHeight||0});}
  im.onload=function(){var w=im.naturalWidth||0,h=im.naturalHeight||0,ratio=h?w/h:0;finish(w>=560&&h>=320&&Math.max(w,h)>=700&&ratio>=0.45&&ratio<=2.8);};
  im.onerror=function(){finish(false);};im.src=u;
});}
async function verifyAll(){for(var i=0;i<candidates.length;i++){var u=candidates[i],r=await probe(u,3200);if(r.ok)verified.push(u);else bad[u]=1;}pub();}
function load(src,flag){return new Promise(function(resolve,reject){if(window[flag]){resolve(true);return;}var x=document.createElement('script');x.src=src;x.async=true;x.onload=function(){resolve(true);};x.onerror=function(){reject(new Error('AMP base load failed'));};(document.head||document.documentElement).appendChild(x);});}
function waitRoot(ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var r=document.getElementById(ROOT_ID);if(r){clearInterval(t);resolve(r);}else if(Date.now()-st>(ms||10000)){clearInterval(t);resolve(null);}},60);});}
function absoluteThumb(t){var im=t&&t.querySelector('img');return strictUrl(im&&(im.currentSrc||im.getAttribute('src')||im.src));}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null;}catch(e){return null;}}
function profileImages(){var p=profile();return p&&p.overview&&Array.isArray(p.overview.galleryImages)?p.overview.galleryImages:[];}
function mergeProfile(urls){var p=profile();if(!p)return;p.overview=p.overview||{};var xs=profileImages().slice(),seen={};xs.forEach(function(u){var a=strictUrl(u);if(a)seen[a]=1;});urls.forEach(function(u){if(!seen[u]){xs.push(u);seen[u]=1;}});p.overview.galleryImages=xs;}
function wireNewThumb(root,b,u){b.addEventListener('click',function(){var main=root.querySelector('.v3-main-img');if(!main)return;var pre=new Image();pre.onload=function(){main.src=u;arr(root.querySelectorAll('.v3-thumb')).forEach(function(x){x.classList.toggle('active',x===b);});};pre.src=u;});}
function appendMissing(root){
  if(!root)return;var bar=root.querySelector('.v3-thumbs');if(!bar)return;
  var seen={};arr(root.querySelectorAll('.v3-thumb')).forEach(function(t){var u=absoluteThumb(t);if(u)seen[u]=1;});
  var toAdd=verified.filter(function(u){return !seen[u]&&heroUrls.indexOf(u)<0;});
  toAdd.forEach(function(u){var b=document.createElement('button');b.className='v3-thumb';b.type='button';b.dataset.i=String(bar.querySelectorAll('.v3-thumb').length);var im=document.createElement('img');im.src=u;im.alt='';im.decoding='async';im.loading='eager';b.appendChild(im);wireNewThumb(root,b,u);bar.appendChild(b);seen[u]=1;added++;});
  mergeProfile(toAdd);state.finalGalleryImages=root.querySelectorAll('.v3-thumb').length;pub();
}
async function audit(root){
  if(!root)return;var ts=arr(root.querySelectorAll('.v3-thumb')),used={},pool=verified.slice();
  ts.forEach(function(t){var u=absoluteThumb(t);if(u)used[u]=1;});pool=pool.filter(function(u){return !used[u]&&heroUrls.indexOf(u)<0;});
  for(var i=0;i<ts.length;i++){
    var t=ts[i],u=absoluteThumb(t);if(!u){t.style.display='none';removed++;continue;}
    var r=await probe(u,2400);if(r.ok)continue;bad[u]=1;
    var rep='';while(pool.length&&!rep){var c=pool.shift(),pr=await probe(c,2000);if(pr.ok)rep=c;}
    var im=t.querySelector('img');if(rep&&im){im.src=rep;im.setAttribute('src',rep);im.removeAttribute('srcset');t.style.display='';wireNewThumb(root,t,rep);repaired++;}else{t.style.display='none';removed++;}
  }
  state.finalGalleryImages=arr(root.querySelectorAll('.v3-thumb')).filter(function(t){return getComputedStyle(t).display!=='none';}).length;pub();
}
async function boot(){
  try{
    if(PATH!==TARGET){await load(V44,'__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V4__');state.ready=true;pub();return;}
    snapshotKT66();await verifyAll();
    /* KT66 deliberately uses V4.3 base so V4.4 cannot coerce t396 numeric values into URLs. */
    await load(V43,'__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V3__');
    var root=await waitRoot(10000);if(!root)throw new Error('Golden root timeout');
    appendMissing(root);await audit(root);
    setTimeout(function(){var r=document.getElementById(ROOT_ID);appendMissing(r);audit(r);},1600);
    state.ready=true;pub();
    console.info('[Filin Labs] Master Product V4 AMP Batch V6 ready',{version:VERSION,slug:PATH,ready:true,candidates:candidates.length,verified:verified.length,addedToGolden:added,repaired:repaired,removedBroken:removed,rejectedRelative:state.rejectedRelative,finalGalleryImages:state.finalGalleryImages});
  }catch(e){state.lastError=String(e&&e.message||e);pub();console.warn('[Filin V4.6]',state.lastError);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);},{once:true});else setTimeout(boot,0);
pub();
})();
