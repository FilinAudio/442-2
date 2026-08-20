/* ============================================================
   FILIN LABS — MASTER PRODUCT V4 PRODUCTION AMP BATCH V6
   Version 4.6.0

   Production wrapper for the approved 10 tube-amplifier pages.
   Loads the stable V4.4 pipeline and fixes two confirmed media cases:

   1) HERO RESTORE — all 10 AMP pages
      - snapshot real Tilda hero URL BEFORE Golden migration
      - verify it by real image load
      - re-apply to t-cover carrier after Golden/Tilda lazy passes

   2) KT66 COMPLETE GALLERY — targeted only
      - scan ALL Zero Blocks across product content
      - accept only real image-looking URLs (never numeric t396 values)
      - verify dimensions before merging
      - update profile and rebuild Golden once so thumbs/arrows/autoplay bind

   No global MutationObserver and no repeated console spam.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V6__)return;

var VERSION='4.6.0';
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
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V6__=true;

var TARGET='audioinstrument_sirius_kt66_push_pull_tube_amplifier';
var V4='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@489bc8c15408dd48cd7b21ab70b257fe2df267e7/filin-master-product-v4-production-amp-batch-v4.js';
var heroCandidates=[],heroUrl='',zeroCandidates=[],verifiedZero=[],added=0,bad={},rebuilt=false;
var state={version:VERSION,slug:PATH,ready:false,targeted:PATH===TARGET,heroCandidates:0,heroReady:false,zeroCandidates:0,verifiedZero:0,addedToProfile:0,rebuilt:false,finalGalleryImages:0,badImages:0,lastError:''};

function str(v){return String(v==null?'':v).trim();}
function arr(v){return Array.prototype.slice.call(v||[]);}
function pub(){
  state.heroCandidates=heroCandidates.length;
  state.heroReady=!!heroUrl;
  state.zeroCandidates=zeroCandidates.length;
  state.verifiedZero=verifiedZero.length;
  state.addedToProfile=added;
  state.rebuilt=rebuilt;
  state.badImages=Object.keys(bad).length;
  window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V6_STATE__=JSON.parse(JSON.stringify(state));
}
function rawImageLike(v){
  v=str(v);if(!v)return false;
  if(/^\d+(?:\.\d+)?(?:px|%)?$/i.test(v))return false;
  if(/^(?:#|javascript:|about:|blob:)/i.test(v))return false;
  if(/^data:image\//i.test(v))return false;
  if(/^https?:\/\//i.test(v)||/^\/\//.test(v)){
    try{
      var u=new URL(v.indexOf('//')===0?location.protocol+v:v,location.href);
      if(/(?:^|\.)tildacdn\.(?:com|net|info)$/i.test(u.hostname))return true;
      return /\.(?:jpe?g|png|webp|avif|gif)(?:$|[?#])/i.test(u.pathname+u.search);
    }catch(e){return false;}
  }
  return /(?:^|\/)\S+\.(?:jpe?g|png|webp|avif|gif)(?:$|[?#])/i.test(v);
}
function toUrl(v){
  v=str(v);if(!rawImageLike(v))return'';
  try{if(v.indexOf('//')===0)v=location.protocol+v;return new URL(v,location.href).href;}catch(e){return'';}
}
function validUrl(u){
  return !!u&&/^https?:\/\//i.test(u)&&!/(blank\.gif|empty\.png|pixel|favicon|logo|sprite|cookie|payment|telegram|whatsapp|youtube|icon[-_.]|social|arrow|spinner|preload|loader|captcha|recaptcha)/i.test(u);
}
function add(out,v){var u=toUrl(v);if(validUrl(u)&&out.indexOf(u)<0)out.push(u);}
function cssUrls(v){var out=[],m,re=/url\(["']?([^"')]+)["']?\)/ig;v=str(v);while((m=re.exec(v)))add(out,m[1]);return out;}
function addEl(out,el){
  if(!el||!el.getAttribute)return;
  ['data-content-cover-bg','data-original','data-img-zoom-url','data-src','data-lazy-src','data-original-src','src'].forEach(function(a){add(out,el.getAttribute(a));});
  var ss=el.getAttribute('srcset');if(ss)ss.split(',').forEach(function(x){add(out,x.trim().split(/\s+/)[0]);});
  cssUrls(el.getAttribute('style')).forEach(function(u){add(out,u);});
  try{cssUrls(getComputedStyle(el).backgroundImage).forEach(function(u){add(out,u);});}catch(e){}
}
function probe(u,timeout,minW,minH){return new Promise(function(resolve){
  if(!validUrl(u)){resolve({ok:false,w:0,h:0});return;}
  var im=new Image(),done=false,tm=setTimeout(function(){finish(false);},timeout||4200);
  function finish(ok){if(done)return;done=true;clearTimeout(tm);resolve({ok:!!ok,w:im.naturalWidth||0,h:im.naturalHeight||0});}
  im.onload=function(){var w=im.naturalWidth||0,h=im.naturalHeight||0;finish(w>=(minW||500)&&h>=(minH||300));};
  im.onerror=function(){finish(false);};im.src=u;
});}

function snapshotHero(){
  var cover=document.querySelector('.t-cover');if(!cover)return;
  var carrier=cover.querySelector('.t-cover__carrier,[id^="coverCarry"]');
  if(carrier)addEl(heroCandidates,carrier);
  addEl(heroCandidates,cover);
  arr(cover.querySelectorAll('img,.t-bgimg,[data-original],[data-src],[data-content-cover-bg],[style*="background-image"]')).forEach(function(el){addEl(heroCandidates,el);});
  pub();
}
async function chooseHero(){
  for(var i=0;i<heroCandidates.length;i++){
    var u=heroCandidates[i],r=await probe(u,4300,700,400);
    if(r.ok){heroUrl=u;break;}
  }
  pub();
}
function restoreHero(){
  if(!heroUrl)return false;
  var cover=document.querySelector('.t-cover');if(!cover)return false;
  var carrier=cover.querySelector('.t-cover__carrier,[id^="coverCarry"]');
  if(!carrier)return false;
  carrier.setAttribute('data-content-cover-bg',heroUrl);
  carrier.style.setProperty('background-image','url("'+heroUrl.replace(/"/g,'\\"')+'")','important');
  carrier.style.setProperty('background-size','cover','important');
  carrier.style.setProperty('background-position','center center','important');
  carrier.style.setProperty('background-repeat','no-repeat','important');
  carrier.style.setProperty('opacity','1','important');
  carrier.style.setProperty('visibility','visible','important');
  carrier.classList.add('loaded');
  cover.style.setProperty('visibility','visible','important');
  cover.style.setProperty('opacity','1','important');
  return true;
}

function recordNoise(r){
  if(!r)return true;
  if(r.closest('header,footer,.t706,.t1002,.t-popup'))return true;
  var t=str(r.innerText).toLowerCase();
  if(/perfect matches|shipping|payment|contact|legal|hi-fi\s*&\s*high-end|refer a friend|loyalty|reviews?|recommended products|you may also like/.test(t))return true;
  var viewLinks=arr(r.querySelectorAll('a,button')).filter(function(x){return /^view$/i.test(str(x.textContent));});
  if(viewLinks.length>=2)return true;
  return false;
}
function snapshotKT66ZeroBlocks(){
  if(PATH!==TARGET)return;
  var cover=document.querySelector('.t-cover');
  arr(document.querySelectorAll('.t-rec,[id^="rec"]')).forEach(function(r){
    if(recordNoise(r))return;
    if(!r.querySelector('.t396,.tn-elem,[data-elem-type="image"]'))return;
    arr(r.querySelectorAll('img,.t-bgimg,.tn-atom__img,.tn-atom,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[style*="background-image"],[data-elem-type="image"]')).forEach(function(el){
      if(cover&&cover.contains(el))return;
      addEl(zeroCandidates,el);
    });
  });
  zeroCandidates=zeroCandidates.filter(function(u){return heroCandidates.indexOf(u)<0;});
  pub();
}
async function verifyKT66(){
  if(PATH!==TARGET)return;
  for(var i=0;i<zeroCandidates.length;i++){
    var u=zeroCandidates[i],r=await probe(u,4200,700,420),ratio=r.h?r.w/r.h:0;
    if(r.ok&&Math.max(r.w,r.h)>=900&&ratio>=0.45&&ratio<=2.7)verifiedZero.push(u);else bad[u]=1;
  }
  pub();
}

function loadV4(){return new Promise(function(resolve,reject){
  if(window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V4__){resolve(true);return;}
  var s=document.createElement('script');s.src=V4;s.async=true;s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('V4.4 load failed'));};(document.head||document.documentElement).appendChild(s);
});}
function waitRoot(ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var r=document.getElementById(ROOT_ID);if(r){clearInterval(t);resolve(r);}else if(Date.now()-st>(ms||10000)){clearInterval(t);resolve(null);}},70);});}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null;}catch(e){return null;}}
function currentUrls(root){var out=[];arr(root&&root.querySelectorAll('.v3-thumb img')).forEach(function(im){add(out,im.currentSrc||im.getAttribute('src')||im.src);});return out;}
function mergeKT66(root){
  if(PATH!==TARGET||!root)return 0;
  var p=profile();if(!p)return 0;p.overview=p.overview||{};
  var xs=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.slice():[],seen={};
  xs.forEach(function(u){var x=toUrl(u);if(x)seen[x]=1;});currentUrls(root).forEach(function(u){seen[u]=1;});
  var n=0;verifiedZero.forEach(function(u){if(!seen[u]){xs.push(u);seen[u]=1;n++;}});
  if(n){p.overview.galleryImages=xs;added+=n;}
  pub();return n;
}
function rebuildOnce(){
  if(rebuilt)return;
  var api=window.FilinMasterProductV3;if(!api||typeof api.apply!=='function')return;
  rebuilt=true;api.apply();
  setTimeout(function(){try{window.FilinMasterProductV3RegistryInteractions&&window.FilinMasterProductV3RegistryInteractions.apply&&window.FilinMasterProductV3RegistryInteractions.apply();}catch(e){}},80);
  pub();
}

async function boot(){
  try{
    /* Capture native sources before V4.4 can rewrite/quarantine legacy records. */
    snapshotHero();
    snapshotKT66ZeroBlocks();
    await Promise.all([chooseHero(),verifyKT66()]);
    await loadV4();
    var root=await waitRoot(11000);if(!root)throw new Error('Golden root timeout');

    restoreHero();
    [350,900,1800,3600,6200].forEach(function(ms){setTimeout(restoreHero,ms);});

    if(PATH===TARGET&&mergeKT66(root)>0){
      rebuildOnce();
      root=await waitRoot(5000)||document.getElementById(ROOT_ID);
    }
    state.finalGalleryImages=root?root.querySelectorAll('.v3-thumb').length:0;
    state.ready=true;pub();
    console.info('[Filin Labs] Master Product V4 AMP Batch V6 ready',{version:VERSION,slug:PATH,ready:true,heroReady:!!heroUrl,targeted:PATH===TARGET,zeroCandidates:zeroCandidates.length,verifiedZero:verifiedZero.length,addedToProfile:added,rebuilt:rebuilt,finalGalleryImages:state.finalGalleryImages,badImages:Object.keys(bad).length});
  }catch(e){state.lastError=String(e&&e.message||e);pub();console.warn('[Filin V4.6]',state.lastError);}
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);},{once:true});else setTimeout(boot,0);
pub();
})();
