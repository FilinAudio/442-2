/* ============================================================
   FILIN LABS — MASTER PRODUCT V4 PRODUCTION AMP BATCH V2
   Media-preflight wrapper for the approved 10 amplifier pages.

   Fixes V4.1 media race:
   - snapshots native Tilda hero BEFORE migration
   - snapshots native product/gallery images BEFORE quarantine
   - loads V4.1 core batch only after snapshot
   - pins a verified native hero after Tilda/V4 lazy passes
   - repairs broken Golden thumbnails with verified native images
   - never replaces a visible image with an unverified URL
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V2__)return;

var VERSION='4.2.0';
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
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V2__=true;

var V1='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@e226cdccb1a5f54732bf8f15633b5ca413271214/filin-master-product-v4-production-amp-batch-v1.js';
var heroCandidates=[],nativeImages=[],verified=[],bad={},heroChosen='',repairs=0;
var state={version:VERSION,slug:PATH,ready:false,heroReady:false,heroCandidates:0,nativeImages:0,verifiedImages:0,repairs:0,badImages:0,lastError:''};

function pub(){state.heroCandidates=heroCandidates.length;state.nativeImages=nativeImages.length;state.verifiedImages=verified.length;state.repairs=repairs;state.badImages=Object.keys(bad).length;window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V2_STATE__=JSON.parse(JSON.stringify(state));}
function str(v){return String(v==null?'':v).trim();}
function arr(v){return Array.prototype.slice.call(v||[]);}
function toUrl(v){try{return new URL(str(v),location.origin).href;}catch(e){return'';}}
function valid(u){return !!u&&/^https?:\/\//i.test(u)&&!/(blank\.gif|empty\.png|pixel|favicon|logo|sprite|cookie|payment|telegram|whatsapp|youtube|icon[-_.]|social|arrow)/i.test(u);}
function cssUrl(v){var m=str(v).match(/url\(["']?([^"')]+)["']?\)/i);return m?toUrl(m[1]):'';}
function add(out,v){var u=toUrl(v);if(valid(u)&&out.indexOf(u)<0)out.push(u);}
function addEl(out,el){if(!el||!el.getAttribute)return;['data-content-cover-bg','data-original','data-img-zoom-url','data-bg','data-src','data-lazy-src','src'].forEach(function(a){add(out,el.getAttribute(a));});add(out,cssUrl(el.getAttribute('style')));try{add(out,cssUrl(getComputedStyle(el).backgroundImage));}catch(e){}}
function isNoise(el){return !!(el&&el.closest&&el.closest('.t706,.t1002,.t-store__card,.t-card,[class*="social"],[class*="footer"],[class*="header"]'));}

function snapshotHero(){
  var c=document.querySelector('.t-cover');
  if(c){
    var cr=c.querySelector('.t-cover__carrier,[id^="coverCarry"],.t-bgimg');addEl(heroCandidates,cr);addEl(heroCandidates,c);
    arr(c.querySelectorAll('[data-content-cover-bg],[data-original],[data-src],[data-bg],[style*="background-image"],img')).forEach(function(el){addEl(heroCandidates,el);});
  }
  var meta=document.querySelector('meta[property="og:image"],meta[name="twitter:image"]');if(meta)add(heroCandidates,meta.getAttribute('content'));
}
function scoreRec(r){
  var t=str(r&&r.innerText).toLowerCase(),s=0;
  if(r&&r.querySelector('.js-product'))s+=20;
  if(r&&r.querySelector('h2,h3'))s+=4;
  if(/perfect matches|shipping|contact|legal|reviews?|hi-fi\s*&\s*high-end/.test(t))s-=20;
  if(/category\s*&\s*budget|tags\s*&\s*features|sonic\s*signature|curator.?s\s*choice|synergy\s*match|genres?\s*accord/.test(t))s-=15;
  return s;
}
function snapshotNativeImages(){
  var recs=arr(document.querySelectorAll('.t-rec,[id^="rec"]'));
  var product=arr(document.querySelectorAll('.js-product')).find(function(x){return !x.closest('.t706,.t1002,#filin-master-product-v3');});
  var pr=product&&product.closest('.t-rec,[id^="rec"]'),idx=pr?recs.indexOf(pr):-1,scopes=[];
  if(idx>=0){for(var i=Math.max(0,idx-6);i<=Math.min(recs.length-1,idx+1);i++)scopes.push(recs[i]);}
  if(!scopes.length)scopes=recs.slice().sort(function(a,b){return scoreRec(b)-scoreRec(a);}).slice(0,7);
  scopes.forEach(function(r){
    if(scoreRec(r)<-5)return;
    arr(r.querySelectorAll('img,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[style*="background-image"]')).forEach(function(el){if(isNoise(el))return;addEl(nativeImages,el);});
  });
  /* Hero image is not a gallery image unless it also exists in the live product scopes. */
}
function probe(u,timeout){return new Promise(function(resolve){if(!valid(u)){resolve(false);return;}var im=new Image(),done=false,tm=setTimeout(function(){finish(false);},timeout||5000);function finish(ok){if(done)return;done=true;clearTimeout(tm);resolve(!!ok);}im.onload=function(){finish(im.naturalWidth>100&&im.naturalHeight>100);};im.onerror=function(){finish(false);};im.src=u;});}
async function verifyList(xs,max){
  var out=[];
  for(var i=0;i<xs.length&&out.length<(max||16);i++){
    var u=xs[i];if(await probe(u,4200))out.push(u);else bad[u]=1;
  }
  return out;
}
function carrier(){var c=document.querySelector('.t-cover');return c&&c.querySelector('.t-cover__carrier,[id^="coverCarry"],.t-bgimg');}
function pinHero(u){
  var c=document.querySelector('.t-cover'),cr=carrier();if(!c||!cr||!u)return false;
  cr.setAttribute('data-content-cover-bg',u);cr.setAttribute('data-original',u);
  cr.style.setProperty('background-image','url("'+u.replace(/"/g,'\\"')+'")','important');
  cr.style.setProperty('background-size','cover','important');cr.style.setProperty('background-position','center center','important');
  cr.style.setProperty('visibility','visible','important');cr.style.setProperty('opacity','1','important');cr.classList.add('loaded');
  c.style.setProperty('visibility','visible','important');c.style.setProperty('opacity','1','important');
  state.heroReady=true;pub();return true;
}
function loadV1(){return new Promise(function(resolve,reject){if(window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V1__){resolve(true);return;}var s=document.createElement('script');s.src=V1;s.async=true;s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('V4.1 load failed'));};(document.head||document.documentElement).appendChild(s);});}
function waitRoot(ms){return new Promise(function(resolve){var start=Date.now(),t=setInterval(function(){var r=document.getElementById('filin-master-product-v3');if(r){clearInterval(t);resolve(r);}else if(Date.now()-start>(ms||8000)){clearInterval(t);resolve(null);}},60);});}
function thumbUrl(t){var im=t&&t.querySelector('img');return im&&(im.currentSrc||im.getAttribute('src')||im.src)||'';}
async function repairGallery(root){
  if(!root)return;
  var thumbs=arr(root.querySelectorAll('.v3-thumb')),used={};
  thumbs.forEach(function(t){var u=thumbUrl(t);if(u)used[u]=1;});
  var pool=verified.filter(function(u){return !used[u]&&u!==heroChosen;});
  for(var i=0;i<thumbs.length;i++){
    var t=thumbs[i],im=t.querySelector('img'),u=thumbUrl(t),ok=await probe(u,3200);
    if(ok){if(im){im.style.visibility='visible';im.style.opacity='1';}continue;}
    bad[u||('thumb-'+i)]=1;
    var replacement='';
    while(pool.length&&!replacement){var c=pool.shift();if(await probe(c,2600))replacement=c;}
    if(replacement&&im){
      im.src=replacement;im.setAttribute('src',replacement);im.removeAttribute('srcset');im.style.visibility='visible';im.style.opacity='1';t.style.display='';repairs++;used[replacement]=1;
      if(i===0){var main=root.querySelector('.v3-main-img');if(main)main.src=replacement;}
    }else t.style.display='none';
  }
  /* Repair main image independently if the current URL is dead. */
  var main=root.querySelector('.v3-main-img');if(main){var mu=main.currentSrc||main.src;if(!(await probe(mu,3200))){var first=arr(root.querySelectorAll('.v3-thumb')).find(function(t){return t.style.display!=='none'&&thumbUrl(t);});if(first){main.src=thumbUrl(first);repairs++;}}}
  pub();
}
async function boot(){
  try{
    snapshotHero();snapshotNativeImages();pub();
    /* Verify native media BEFORE the old records are quarantined. */
    var hs=await verifyList(heroCandidates,5);heroChosen=hs[0]||'';
    verified=await verifyList(nativeImages,20);pub();
    if(heroChosen)pinHero(heroChosen);
    await loadV1();
    var root=await waitRoot(9000);
    [120,450,1100,2400,5200,7800].forEach(function(ms){setTimeout(function(){if(heroChosen)pinHero(heroChosen);},ms);});
    await repairGallery(root);
    setTimeout(function(){repairGallery(document.getElementById('filin-master-product-v3'));},1400);
    setTimeout(function(){repairGallery(document.getElementById('filin-master-product-v3'));},4200);
    state.ready=!!root;pub();
    console.info('[Filin Labs] Master Product V4 AMP Batch V2 ready',{version:VERSION,slug:PATH,ready:state.ready,heroReady:state.heroReady,verifiedImages:verified.length,repairs:repairs,badImages:Object.keys(bad).length});
  }catch(e){state.lastError=String(e&&e.message||e);pub();console.warn('[Filin V4.2]',state.lastError);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);},{once:true});else setTimeout(boot,0);
pub();
})();
