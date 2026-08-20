/* ============================================================
   FILIN LABS — MASTER PRODUCT V4 PRODUCTION AMP BATCH V7
   Version 4.7.0

   Final KT66 media routing fix.

   IMPORTANT:
   - KT66 DOES NOT load V4.4 (the old broad Zero Block scanner).
   - KT66 uses stable V4.3 + one safe targeted Zero Block capture.
   - other approved AMP pages continue to use V4.4 unchanged.

   KT66 safe capture rules:
   - only actual image elements / image-type Zero Block elements
   - only real image-looking URLs (never numeric t396 values)
   - only product-content records between hero and product block
   - excludes curation / PM / recommendations / footer / header
   - verifies every image by real load + dimensions
   - merges missing healthy photos into active profile, then rebuilds once
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V7__)return;

var VERSION='4.7.0';
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
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V7__=true;

var V3='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@fb04f14e7edc4043971f15ac41bb525f2fbfdcdb/filin-master-product-v4-production-amp-batch-v3.js';
var V4='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@489bc8c15408dd48cd7b21ab70b257fe2df267e7/filin-master-product-v4-production-amp-batch-v4.js';

var heroUrls=[],candidates=[],verified=[],bad={},added=0,rebuilt=false;
var state={version:VERSION,slug:PATH,ready:false,targeted:PATH===TARGET,basePipeline:'',candidateRecords:0,candidates:0,verified:0,addedToProfile:0,rebuilt:false,finalGalleryImages:0,badImages:0,lastError:''};

function str(v){return String(v==null?'':v).trim();}
function arr(v){return Array.prototype.slice.call(v||[]);}
function pub(){
  state.candidates=candidates.length;state.verified=verified.length;state.addedToProfile=added;state.rebuilt=rebuilt;state.badImages=Object.keys(bad).length;
  window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V7_STATE__=JSON.parse(JSON.stringify(state));
}
function isRawImage(v){
  v=str(v);if(!v)return false;
  if(/^\d+(?:\.\d+)?(?:px|%)?$/i.test(v))return false;
  if(/^(?:#|javascript:|about:|blob:|data:)/i.test(v))return false;
  if(/^\/\//.test(v))v=location.protocol+v;
  try{
    var u=new URL(v,location.href);
    if(!/^https?:$/i.test(u.protocol))return false;
    if(/(?:^|\.)tildacdn\.(?:com|net|info)$/i.test(u.hostname)){
      return u.pathname.length>12&&!/^\/\d+\/?$/.test(u.pathname);
    }
    return /\.(?:jpe?g|png|webp|avif|gif)(?:$|[?#])/i.test(u.pathname+u.search);
  }catch(e){return false;}
}
function toUrl(v){if(!isRawImage(v))return'';try{if(/^\/\//.test(v))v=location.protocol+v;return new URL(v,location.href).href;}catch(e){return'';}}
function valid(u){return !!u&&/^https?:\/\//i.test(u)&&!/(blank\.gif|empty\.png|pixel|favicon|logo(?:[-_.]|\.|$)|sprite|cookie|payment|telegram|whatsapp|youtube|icon[-_.]|social|arrow|spinner|preload|loader|captcha|recaptcha)/i.test(u);}
function add(out,v){var u=toUrl(v);if(valid(u)&&out.indexOf(u)<0)out.push(u);}
function cssUrls(v){var out=[],m,re=/url\(["']?([^"')]+)["']?\)/ig;v=str(v);while((m=re.exec(v)))add(out,m[1]);return out;}
function addImageEl(out,el){
  if(!el||!el.getAttribute)return;
  ['data-original','data-img-zoom-url','data-src','data-lazy-src','data-original-src','src'].forEach(function(a){add(out,el.getAttribute(a));});
  var ss=el.getAttribute('srcset');if(ss)ss.split(',').forEach(function(x){add(out,x.trim().split(/\s+/)[0]);});
  cssUrls(el.getAttribute('style')).forEach(function(u){add(out,u);});
  try{cssUrls(getComputedStyle(el).backgroundImage).forEach(function(u){add(out,u);});}catch(e){}
}
function probe(u,timeout){return new Promise(function(resolve){
  if(!valid(u)){resolve({ok:false,w:0,h:0});return;}
  var im=new Image(),done=false,tm=setTimeout(function(){finish(false);},timeout||4200);
  function finish(ok){if(done)return;done=true;clearTimeout(tm);resolve({ok:!!ok,w:im.naturalWidth||0,h:im.naturalHeight||0});}
  im.onload=function(){var w=im.naturalWidth||0,h=im.naturalHeight||0,ratio=h?w/h:0;finish(w>=700&&h>=420&&Math.max(w,h)>=900&&ratio>=0.45&&ratio<=2.7);};
  im.onerror=function(){finish(false);};im.src=u;
});}
function recs(){return arr(document.querySelectorAll('.t-rec,[id^="rec"]'));}
function recOf(n){return n&&n.closest&&n.closest('.t-rec,[id^="rec"]');}
function text(r){return str(r&&r.innerText).replace(/\s+/g,' ').toLowerCase();}
function excludedRecord(r){
  if(!r||r.closest('header,footer,.t706,.t1002,.t-popup'))return true;
  var t=text(r);
  if(/perfect matches|shipping|payment|contact|legal|reviews?|recommended products|you may also like|refer a friend|loyalty/.test(t))return true;
  if(/cat(?:h)?egory\s*&?\s*budget|tags?\s*&\s*features|high\s*technolog|genres?\s*accord|sonic\s*signature|curator.?s\s*choice|synergy\s*match/.test(t))return true;
  var views=arr(r.querySelectorAll('a,button')).filter(function(x){return /^view$/i.test(str(x.textContent));});
  if(views.length>=2)return true;
  return false;
}
function snapshotHero(){
  var cover=document.querySelector('.t-cover');if(!cover)return;
  arr(cover.querySelectorAll('img,.t-bgimg,[data-original],[data-src],[style*="background-image"]')).forEach(function(el){addImageEl(heroUrls,el);});
  var carrier=cover.querySelector('.t-cover__carrier,[id^="coverCarry"]');if(carrier){
    add(heroUrls,carrier.getAttribute('data-content-cover-bg'));cssUrls(carrier.getAttribute('style')).forEach(function(u){add(heroUrls,u);});
  }
}
function snapshotKT66(){
  if(PATH!==TARGET)return;
  snapshotHero();
  var rs=recs(),coverRec=recOf(document.querySelector('.t-cover'));
  var product=arr(document.querySelectorAll('.js-product')).find(function(x){return !x.closest('.t706,.t1002,#'+ROOT_ID);});
  var productRec=recOf(product),ci=coverRec?rs.indexOf(coverRec):-1,pi=productRec?rs.indexOf(productRec):-1;
  var selected=[];
  rs.forEach(function(r,i){
    if(excludedRecord(r))return;
    if(ci>=0&&i<=ci)return;
    if(pi>=0&&i>pi)return;
    if(!r.querySelector('.t396,.tn-elem,[data-elem-type="image"],img'))return;
    var els=arr(r.querySelectorAll('img,.t-bgimg,.tn-atom__img,[data-elem-type="image"] .tn-atom,[data-elem-type="image"][data-original],[data-elem-type="image"][data-img-zoom-url]'));
    var before=candidates.length;
    els.forEach(function(el){addImageEl(candidates,el);});
    if(candidates.length>before)selected.push(r);
  });
  candidates=candidates.filter(function(u){return heroUrls.indexOf(u)<0;});
  state.candidateRecords=selected.length;pub();
}
async function verifyKT66(){
  if(PATH!==TARGET)return;
  for(var i=0;i<candidates.length;i++){
    var u=candidates[i],r=await probe(u,4300);if(r.ok)verified.push(u);else bad[u]=1;
  }
  pub();
}
function loadScript(src,test){return new Promise(function(resolve,reject){if(test&&test()){resolve(true);return;}var s=document.createElement('script');s.src=src;s.async=true;s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('load failed: '+src));};(document.head||document.documentElement).appendChild(s);});}
function waitRoot(ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var r=document.getElementById(ROOT_ID);if(r){clearInterval(t);resolve(r);}else if(Date.now()-st>(ms||10000)){clearInterval(t);resolve(null);}},70);});}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null;}catch(e){return null;}}
function currentGallery(root){var out=[];arr(root&&root.querySelectorAll('.v3-thumb img')).forEach(function(im){add(out,im.currentSrc||im.getAttribute('src')||im.src);});return out;}
function mergeKT66(root){
  var p=profile();if(!p||PATH!==TARGET)return 0;p.overview=p.overview||{};
  var xs=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.slice():[],seen={};
  xs.forEach(function(u){var x=toUrl(u);if(x)seen[x]=1;});currentGallery(root).forEach(function(u){seen[u]=1;});
  var n=0;verified.forEach(function(u){if(!seen[u]){xs.push(u);seen[u]=1;n++;}});
  if(n){p.overview.galleryImages=xs;added+=n;}pub();return n;
}
function rebuild(){
  if(rebuilt)return false;var api=window.FilinMasterProductV3;if(!api||typeof api.apply!=='function')return false;
  rebuilt=true;api.apply();pub();return true;
}
async function audit(root){
  if(!root)return;
  var thumbs=arr(root.querySelectorAll('.v3-thumb')),healthy=0;
  for(var i=0;i<thumbs.length;i++){
    var im=thumbs[i].querySelector('img'),u=toUrl(im&&(im.currentSrc||im.getAttribute('src')||im.src));
    var r=await probe(u,3000);if(r.ok){healthy++;thumbs[i].style.display='';if(im){im.style.visibility='visible';im.style.opacity='1';}}else{if(u)bad[u]=1;thumbs[i].style.display='none';}
  }
  state.finalGalleryImages=healthy;pub();
}
async function boot(){
  try{
    if(PATH===TARGET){
      snapshotKT66();
      await verifyKT66();
      state.basePipeline='V4.3';
      await loadScript(V3,function(){return!!window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V3__;});
    }else{
      state.basePipeline='V4.4';
      await loadScript(V4,function(){return!!window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V4__;});
    }
    var root=await waitRoot(11000);if(!root)throw new Error('Golden root timeout');
    if(PATH===TARGET){
      if(mergeKT66(root)>0){rebuild();root=await waitRoot(4000)||document.getElementById(ROOT_ID);}
      await audit(root);
      setTimeout(function(){var r=document.getElementById(ROOT_ID);audit(r);},1800);
    }else state.finalGalleryImages=root.querySelectorAll('.v3-thumb').length;
    state.ready=true;pub();
    console.info('[Filin Labs] Master Product V4 AMP Batch V7 ready',{version:VERSION,slug:PATH,ready:true,targeted:PATH===TARGET,basePipeline:state.basePipeline,candidateRecords:state.candidateRecords,candidates:candidates.length,verified:verified.length,addedToProfile:added,rebuilt:rebuilt,finalGalleryImages:state.finalGalleryImages,badImages:Object.keys(bad).length});
  }catch(e){state.lastError=String(e&&e.message||e);pub();console.warn('[Filin V4.7]',state.lastError);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);},{once:true});else setTimeout(boot,0);
pub();
})();
