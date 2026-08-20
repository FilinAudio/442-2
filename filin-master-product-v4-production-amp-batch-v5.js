/* ============================================================
   FILIN LABS — MASTER PRODUCT V4 PRODUCTION AMP BATCH V5
   Version 4.5.0

   Unified entrypoint for the approved 10 tube-amplifier pages.
   Loads V4.4 for the standard AMP production pipeline.

   KT66 targeted media completion:
   - snapshots ALL large Tilda product media before V4.4 quarantine
   - scans normal records + Zero Blocks + lazy attributes + CSS backgrounds
   - also inspects already requested image resources from Performance API
   - verifies candidates by real load and dimensions
   - excludes hero/header/footer/store/recommendation noise
   - merges only missing healthy images into the active Golden gallery/profile
   - keeps the existing delegated V4 gallery interactions intact
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V5__)return;

var VERSION='4.5.0';
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
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V5__=true;

var V4='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@489bc8c15408dd48cd7b21ab70b257fe2df267e7/filin-master-product-v4-production-amp-batch-v4.js';
var TARGET='audioinstrument_sirius_kt66_push_pull_tube_amplifier';
var candidates=[],verified=[],bad={},added=0,heroUrls=[];
var state={version:VERSION,slug:PATH,ready:false,targeted:PATH===TARGET,candidates:0,verified:0,addedToGolden:0,finalGalleryImages:0,badImages:0,lastError:''};

function pub(){state.candidates=candidates.length;state.verified=verified.length;state.addedToGolden=added;state.badImages=Object.keys(bad).length;window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V5_STATE__=JSON.parse(JSON.stringify(state));}
function str(v){return String(v==null?'':v).trim();}
function arr(v){return Array.prototype.slice.call(v||[]);}
function toUrl(v){try{return new URL(str(v),location.href).href;}catch(e){return'';}}
function cssUrls(v){var out=[],m,re=/url\(["']?([^"')]+)["']?\)/ig;v=str(v);while((m=re.exec(v)))out.push(toUrl(m[1]));return out;}
function valid(u){return !!u&&/^https?:\/\//i.test(u)&&!/(blank\.gif|empty\.png|pixel|favicon|logo|sprite|cookie|payment|telegram|whatsapp|youtube|icon[-_.]|social|arrow|spinner|preload|loader|captcha|recaptcha)/i.test(u);}
function add(out,v){var u=toUrl(v);if(valid(u)&&out.indexOf(u)<0)out.push(u);}
function addEl(out,el){
  if(!el||!el.getAttribute)return;
  ['data-content-cover-bg','data-original','data-img-zoom-url','data-bg','data-src','data-lazy-src','data-zoom-target','data-original-src','src'].forEach(function(a){add(out,el.getAttribute(a));});
  var ss=el.getAttribute('srcset');if(ss)ss.split(',').forEach(function(x){add(out,x.trim().split(/\s+/)[0]);});
  cssUrls(el.getAttribute('style')).forEach(function(u){add(out,u);});
  try{cssUrls(getComputedStyle(el).backgroundImage).forEach(function(u){add(out,u);});}catch(e){}
}
function noise(el){return !!(el&&el.closest&&el.closest('header,footer,.t706,.t1002,.t-store__card,.t-card,.t-popup,[class*="social"],[class*="menu"],[class*="footer"],[class*="header"],[class*="review"]'));
}
function recordNoise(el){
  var r=el&&el.closest&&el.closest('.t-rec,[id^="rec"]');if(!r)return false;
  var t=str(r.innerText).toLowerCase();
  return /perfect matches|shipping|payment|contact|legal|hi-fi\s*&\s*high-end|refer a friend|loyalty|the review|recommended products|you may also like/.test(t);
}
function snapshotHero(){
  var cover=document.querySelector('.t-cover');if(!cover)return;
  addEl(heroUrls,cover);arr(cover.querySelectorAll('img,.t-bgimg,[data-original],[data-src],[data-content-cover-bg],[style*="background-image"]')).forEach(function(el){addEl(heroUrls,el);});
}
function snapshotAllLargeMedia(){
  snapshotHero();
  var selector='img,.t-bgimg,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[data-content-cover-bg],[data-bg],[style*="background-image"],[data-elem-type="image"],.tn-atom__img,.tn-atom';
  arr(document.querySelectorAll(selector)).forEach(function(el){
    if(noise(el)||recordNoise(el)||el.closest('.t-cover'))return;
    var tmp=[];addEl(tmp,el);tmp.forEach(function(u){if(heroUrls.indexOf(u)<0)add(candidates,u);});
  });
  /* Capture image resources Tilda has already requested even if their DOM node is later rewritten. */
  try{
    performance.getEntriesByType('resource').forEach(function(e){
      var u=toUrl(e&&e.name);if(!valid(u)||heroUrls.indexOf(u)>=0)return;
      if(/static\.tildacdn\.(com|net)|static\.tildacdn\.info|tildacdn/i.test(u))add(candidates,u);
    });
  }catch(e){}
  pub();
}
function probe(u,timeout){return new Promise(function(resolve){
  if(!valid(u)){resolve({ok:false,w:0,h:0});return;}
  var im=new Image(),done=false,tm=setTimeout(function(){finish(false);},timeout||5000);
  function finish(ok){if(done)return;done=true;clearTimeout(tm);resolve({ok:!!ok,w:im.naturalWidth||0,h:im.naturalHeight||0});}
  im.onload=function(){var w=im.naturalWidth||0,h=im.naturalHeight||0,ratio=h?w/h:0;
    /* Product photography only: large enough and not extreme banner/icon geometry. */
    finish(w>=700&&h>=420&&Math.max(w,h)>=900&&ratio>=0.55&&ratio<=2.4);
  };
  im.onerror=function(){finish(false);};im.src=u;
});}
async function verifyAll(){
  for(var i=0;i<candidates.length;i++){
    var u=candidates[i],r=await probe(u,4200);if(r.ok)verified.push(u);else bad[u]=1;
  }
  pub();
}
function loadV4(){return new Promise(function(resolve,reject){
  if(window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V4__){resolve(true);return;}
  var s=document.createElement('script');s.src=V4;s.async=true;s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('V4.4 load failed'));};(document.head||document.documentElement).appendChild(s);
});}
function waitRoot(ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var r=document.getElementById(ROOT_ID);if(r){clearInterval(t);resolve(r);}else if(Date.now()-st>(ms||10000)){clearInterval(t);resolve(null);}},60);});}
function thumbUrl(t){var im=t&&t.querySelector('img');return toUrl(im&&(im.currentSrc||im.getAttribute('src')||im.src));}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null;}catch(e){return null;}}
function mergeProfile(urls){var p=profile();if(!p)return;p.overview=p.overview||{};var xs=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.slice():[],seen={};xs.forEach(function(u){seen[toUrl(u)]=1;});urls.forEach(function(u){if(!seen[u]){xs.push(u);seen[u]=1;}});p.overview.galleryImages=xs;}
function appendMissing(root){
  if(!root)return;var bar=root.querySelector('.v3-thumbs');if(!bar)return;
  var seen={};arr(root.querySelectorAll('.v3-thumb')).forEach(function(t){var u=thumbUrl(t);if(u)seen[u]=1;});
  var toAdd=verified.filter(function(u){return !seen[u]&&heroUrls.indexOf(u)<0;});
  toAdd.forEach(function(u){
    var b=document.createElement('button');b.className='v3-thumb';b.type='button';b.setAttribute('data-i',String(bar.querySelectorAll('.v3-thumb').length));
    var im=document.createElement('img');im.src=u;im.alt='';im.decoding='async';im.loading='eager';b.appendChild(im);bar.appendChild(b);seen[u]=1;added++;
  });
  mergeProfile(toAdd);state.finalGalleryImages=root.querySelectorAll('.v3-thumb').length;pub();
}
async function auditAndRepair(root){
  if(!root)return;var ts=arr(root.querySelectorAll('.v3-thumb')),pool=verified.slice();
  var used={};ts.forEach(function(t){var u=thumbUrl(t);if(u)used[u]=1;});pool=pool.filter(function(u){return !used[u]&&heroUrls.indexOf(u)<0;});
  for(var i=0;i<ts.length;i++){
    var t=ts[i],u=thumbUrl(t),r=await probe(u,3200);if(r.ok)continue;
    if(u)bad[u]=1;var rep='';
    while(pool.length&&!rep){var c=pool.shift(),pr=await probe(c,2600);if(pr.ok)rep=c;}
    var im=t.querySelector('img');if(rep&&im){im.src=rep;im.setAttribute('src',rep);im.removeAttribute('srcset');t.style.display='';used[rep]=1;added++;}else{t.style.display='none';}
  }
  state.finalGalleryImages=ts.length;pub();
}
async function boot(){
  try{
    /* For KT66 we must snapshot BEFORE V4.4 can quarantine/rewrite legacy Zero Blocks. */
    if(PATH===TARGET){snapshotAllLargeMedia();await verifyAll();}
    await loadV4();
    var root=await waitRoot(10000);if(!root)throw new Error('Golden root timeout');
    if(PATH===TARGET){
      appendMissing(root);await auditAndRepair(root);
      setTimeout(function(){var r=document.getElementById(ROOT_ID);appendMissing(r);auditAndRepair(r);},1600);
      setTimeout(function(){var r=document.getElementById(ROOT_ID);appendMissing(r);auditAndRepair(r);},4600);
    }
    state.ready=true;state.finalGalleryImages=root.querySelectorAll('.v3-thumb').length;pub();
    console.info('[Filin Labs] Master Product V4 AMP Batch V5 ready',{version:VERSION,slug:PATH,ready:true,targeted:PATH===TARGET,candidates:candidates.length,verified:verified.length,addedToGolden:added,finalGalleryImages:state.finalGalleryImages,badImages:Object.keys(bad).length});
  }catch(e){state.lastError=String(e&&e.message||e);pub();console.warn('[Filin V4.5]',state.lastError);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);},{once:true});else setTimeout(boot,0);
pub();
})();
