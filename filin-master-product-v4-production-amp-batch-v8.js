/* ============================================================
   FILIN LABS — MASTER PRODUCT V4 PRODUCTION AMP BATCH V8
   Version 4.8.0

   KT66 one-pass production route:
   - NO V7/V4.4/V3/V2 wrapper chain for KT66
   - loads the proven V4.1 migration directly (one Golden build)
   - snapshots native hero + Zero Block product photos synchronously
   - does NOT wait for media verification before rendering the page
   - verifies missing media in parallel after Golden root is visible
   - appends healthy missing thumbnails WITHOUT rebuilding Golden root
   - repairs truly dead thumbnails from the verified pool
   - preserves delegated Golden gallery guard / autoplay / lightbox
   - restores KT150-format Perfect Matches without rebuilding root

   Other approved AMP pages keep the V4.4 production route unchanged.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V8__)return;

var VERSION='4.8.0';
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
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V8__=true;

var V1='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@e226cdccb1a5f54732bf8f15633b5ca413271214/filin-master-product-v4-production-amp-batch-v1.js';
var V4='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@489bc8c15408dd48cd7b21ab70b257fe2df267e7/filin-master-product-v4-production-amp-batch-v4.js';

var heroCandidates=[],heroUrl='',candidates=[],verified=[],bad={},added=0,repaired=0,legacyPM=null;
var state={version:VERSION,slug:PATH,ready:false,targeted:PATH===TARGET,basePipeline:'',heroReady:false,candidateRecords:0,candidates:0,verified:0,addedToGolden:0,repaired:0,finalGalleryImages:0,badImages:0,rootBuilds:1,lastError:''};

function str(v){return String(v==null?'':v).trim();}
function norm(v){return str(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
function arr(v){return Array.prototype.slice.call(v||[]);}
function pub(){
  state.heroReady=!!heroUrl;state.candidates=candidates.length;state.verified=verified.length;state.addedToGolden=added;state.repaired=repaired;state.badImages=Object.keys(bad).length;
  window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V8_STATE__=JSON.parse(JSON.stringify(state));
}
function rawImageLike(v){
  v=str(v);if(!v)return false;
  if(/^\d+(?:\.\d+)?(?:px|%)?$/i.test(v))return false;
  if(/^(?:#|javascript:|about:|blob:|data:)/i.test(v))return false;
  if(/^\/\//.test(v))v=location.protocol+v;
  try{
    var u=new URL(v,location.href);
    if(!/^https?:$/i.test(u.protocol))return false;
    if(/(?:^|\.)tildacdn\.(?:com|net|info)$/i.test(u.hostname))return u.pathname.length>12&&!/^\/\d+\/?$/.test(u.pathname);
    return /\.(?:jpe?g|png|webp|avif|gif)(?:$|[?#])/i.test(u.pathname+u.search);
  }catch(e){return false;}
}
function toUrl(v){if(!rawImageLike(v))return'';try{if(/^\/\//.test(v))v=location.protocol+v;return new URL(v,location.href).href;}catch(e){return'';}}
function valid(u){return !!u&&/^https?:\/\//i.test(u)&&!/(blank\.gif|empty\.png|pixel|favicon|logo(?:[-_.]|\.|$)|sprite|cookie|payment|telegram|whatsapp|youtube|icon[-_.]|social|arrow|spinner|preload|loader|captcha|recaptcha)/i.test(u);}
function key(u){try{var x=new URL(u),p=x.pathname.split('/').filter(Boolean);return (p[p.length-1]||x.pathname).toLowerCase();}catch(e){return u;}}
function add(out,v){var u=toUrl(v);if(!valid(u))return;var k=key(u);for(var i=0;i<out.length;i++)if(key(out[i])===k)return;out.push(u);}
function cssUrls(v){var out=[],m,re=/url\(["']?([^"')]+)["']?\)/ig;v=str(v);while((m=re.exec(v)))add(out,m[1]);return out;}
function addEl(out,el){
  if(!el||!el.getAttribute)return;
  ['data-content-cover-bg','data-original','data-img-zoom-url','data-src','data-lazy-src','data-original-src','src'].forEach(function(a){add(out,el.getAttribute(a));});
  var ss=el.getAttribute('srcset');if(ss)ss.split(',').forEach(function(x){add(out,x.trim().split(/\s+/)[0]);});
  cssUrls(el.getAttribute('style')).forEach(function(u){add(out,u);});
  try{cssUrls(getComputedStyle(el).backgroundImage).forEach(function(u){add(out,u);});}catch(e){}
}
function recOf(n){return n&&n.closest&&n.closest('.t-rec,[id^="rec"]');}
function recs(){return arr(document.querySelectorAll('.t-rec,[id^="rec"]'));}
function recText(r){return norm(r&&r.innerText).toLowerCase();}
function excludedRecord(r){
  if(!r||r.closest('header,footer,.t706,.t1002,.t-popup'))return true;
  var t=recText(r);
  if(/perfect matches|shipping|payment|contact|legal|reviews?|recommended products|you may also like|refer a friend|loyalty/.test(t))return true;
  if(/cat(?:h)?egory\s*&?\s*budget|tags?\s*&\s*features|high\s*technolog|genres?\s*accord|sonic\s*signature|curator.?s\s*choice|synergy\s*match/.test(t))return true;
  var views=arr(r.querySelectorAll('a,button')).filter(function(x){return /^view$/i.test(norm(x.textContent));});
  if(views.length>=2)return true;
  return false;
}
function snapshotHero(){
  var cover=document.querySelector('.t-cover');if(!cover)return;
  addEl(heroCandidates,cover);
  var carrier=cover.querySelector('.t-cover__carrier,[id^="coverCarry"],.t-bgimg');if(carrier)addEl(heroCandidates,carrier);
  arr(cover.querySelectorAll('img,.t-bgimg,[data-original],[data-src],[data-content-cover-bg],[style*="background-image"]')).forEach(function(el){addEl(heroCandidates,el);});
}
function snapshotKT66Media(){
  if(PATH!==TARGET)return;
  snapshotHero();
  var rs=recs(),coverRec=recOf(document.querySelector('.t-cover'));
  var product=arr(document.querySelectorAll('.js-product')).find(function(x){return !x.closest('.t706,.t1002,#'+ROOT_ID);});
  var productRec=recOf(product),ci=coverRec?rs.indexOf(coverRec):-1,pi=productRec?rs.indexOf(productRec):-1,selected=[];
  rs.forEach(function(r,i){
    if(excludedRecord(r))return;
    if(ci>=0&&i<=ci)return;
    if(pi>=0&&i>pi)return;
    var els=arr(r.querySelectorAll('img,.t-bgimg,.tn-atom__img,[data-elem-type="image"] .tn-atom,[data-elem-type="image"][data-original],[data-elem-type="image"][data-img-zoom-url],[style*="background-image"]'));
    if(!els.length)return;
    var before=candidates.length;els.forEach(function(el){addEl(candidates,el);});if(candidates.length>before)selected.push(r);
  });
  var hk={};heroCandidates.forEach(function(u){hk[key(u)]=1;});candidates=candidates.filter(function(u){return !hk[key(u)];});
  state.candidateRecords=selected.length;pub();
}
function probe(u,timeout){return new Promise(function(resolve){
  if(!valid(u)){resolve({ok:false,w:0,h:0});return;}
  var im=new Image(),done=false,tm=setTimeout(function(){finish(false);},timeout||4500);
  function finish(ok){if(done)return;done=true;clearTimeout(tm);resolve({ok:!!ok,w:im.naturalWidth||0,h:im.naturalHeight||0});}
  im.onload=function(){finish((im.naturalWidth||0)>80&&(im.naturalHeight||0)>80);};im.onerror=function(){finish(false);};im.src=u;
});}
async function chooseHero(){for(var i=0;i<heroCandidates.length;i++){var r=await probe(heroCandidates[i],3000);if(r.ok){heroUrl=heroCandidates[i];break;}}pub();}
async function verifyCandidatesParallel(){
  var results=await Promise.all(candidates.map(function(u){return probe(u,3600).then(function(r){return{u:u,r:r};});}));
  results.forEach(function(x){var ratio=x.r.h?x.r.w/x.r.h:0;if(x.r.ok&&x.r.w>=300&&x.r.h>=200&&Math.max(x.r.w,x.r.h)>=500&&ratio>=0.35&&ratio<=3.2)verified.push(x.u);else bad[x.u]=1;});
  pub();
}
function restoreHero(){
  if(!heroUrl)return false;var cover=document.querySelector('.t-cover');if(!cover)return false;var carrier=cover.querySelector('.t-cover__carrier,[id^="coverCarry"],.t-bgimg');if(!carrier)return false;
  carrier.setAttribute('data-content-cover-bg',heroUrl);carrier.setAttribute('data-original',heroUrl);
  carrier.style.setProperty('background-image','url("'+heroUrl.replace(/"/g,'\\"')+'")','important');carrier.style.setProperty('background-size','cover','important');carrier.style.setProperty('background-position','center center','important');carrier.style.setProperty('visibility','visible','important');carrier.style.setProperty('opacity','1','important');carrier.classList.add('loaded');
  cover.style.setProperty('visibility','visible','important');cover.style.setProperty('opacity','1','important');return true;
}
function loadScript(src,test){return new Promise(function(resolve,reject){if(test&&test()){resolve(true);return;}var s=document.createElement('script');s.src=src;s.async=true;s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('load failed: '+src));};(document.head||document.documentElement).appendChild(s);});}
function waitRoot(ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var r=document.getElementById(ROOT_ID);if(r){clearInterval(t);resolve(r);}else if(Date.now()-st>(ms||10000)){clearInterval(t);resolve(null);}},60);});}
function thumbUrl(t){var im=t&&t.querySelector('img');return toUrl(im&&(im.currentSrc||im.getAttribute('src')||im.src));}
function currentKeys(root){var s={};arr(root&&root.querySelectorAll('.v3-thumb img')).forEach(function(im){var u=toUrl(im.currentSrc||im.getAttribute('src')||im.src);if(u)s[key(u)]=1;});return s;}
function appendVerified(root){
  if(!root)return;var bar=root.querySelector('.v3-thumbs');if(!bar)return;var seen=currentKeys(root),profile=null;
  try{profile=window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH];}catch(e){}
  var profileImages=profile&&profile.overview&&Array.isArray(profile.overview.galleryImages)?profile.overview.galleryImages:null;
  verified.forEach(function(u){
    var k=key(u);if(seen[k])return;
    var b=document.createElement('button');b.className='v3-thumb';b.type='button';b.setAttribute('data-i',String(bar.querySelectorAll('.v3-thumb').length));var im=document.createElement('img');im.src=u;im.alt='';im.decoding='async';im.loading='eager';b.appendChild(im);bar.appendChild(b);seen[k]=1;added++;if(profileImages)profileImages.push(u);
  });
  state.finalGalleryImages=root.querySelectorAll('.v3-thumb').length;pub();
  try{if(window.FilinMasterProductV3RegistryInteractions&&window.FilinMasterProductV3RegistryInteractions.apply)window.FilinMasterProductV3RegistryInteractions.apply();}catch(e){}
}
async function repairDead(root){
  if(!root)return;var ts=arr(root.querySelectorAll('.v3-thumb')),used=currentKeys(root),pool=verified.filter(function(u){return !used[key(u)];});
  for(var i=0;i<ts.length;i++){
    var t=ts[i],u=thumbUrl(t),r=await probe(u,2600);if(r.ok){t.style.display='';continue;}if(u)bad[u]=1;
    var rep='';while(pool.length&&!rep){var c=pool.shift(),pr=await probe(c,2200);if(pr.ok)rep=c;}
    var im=t.querySelector('img');if(rep&&im){im.src=rep;im.setAttribute('src',rep);im.removeAttribute('srcset');t.style.display='';repaired++;}else t.style.display='none';
  }
  state.finalGalleryImages=arr(root.querySelectorAll('.v3-thumb')).filter(function(t){return t.style.display!=='none';}).length;pub();
}

function snapshotPM(){
  var node=arr(document.querySelectorAll('.perfect-matches-block')).find(function(n){return !n.closest('#'+ROOT_ID)&&!n.closest('.t706,.t1002,.t-popup');});if(!node)return;
  var desc=node.querySelector('.pm-desc'),base=node.querySelector('.pm-base'),result=node.querySelector('.pm-result'),addons=[];
  arr(node.querySelectorAll('.pm-item:not(.pm-base) a[href],label a[href]')).forEach(function(a){var h=a.getAttribute('href')||a.href,t=norm(a.textContent);try{var u=new URL(h,location.href);if((u.hostname===location.hostname)&&u.pathname!==location.pathname&&t)addons.push({text:t,href:u.href});}catch(e){}});
  legacyPM={desc:norm(desc&&desc.textContent),base:norm(base&&base.textContent),result:norm(result&&result.textContent)||'Ultimate Synergy',addons:addons};
}
function fallbackPM(){
  var ps=window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products||{},rows=[];Object.keys(ps).forEach(function(k){if(k===PATH)return;var x=ps[k]||{},t=(k+' '+str(x.name)+' '+str(x.brand)+' '+str(x.categories)).toLowerCase(),s=0;if(/dac|digital.*analog|r2r/.test(t))s+=8;if(/cable|interconnect/.test(t))s+=6;if(/preamp|preamplifier/.test(t))s+=5;if(x.name&&Number(x.price)>0&&s>0)rows.push({k:k,x:x,s:s});});rows.sort(function(a,b){return b.s-a.s;});return rows.slice(0,3).map(function(o){return{text:o.x.name,href:o.x.url||('/'+o.k)};});
}
function ensurePM(root){
  if(!root||root.querySelector('.v3-pm'))return;var host=root.querySelector('.v3-js-product')||root.querySelector('.v3-commerce .js-product');if(!host)return;
  var addons=legacyPM&&legacyPM.addons&&legacyPM.addons.length?legacyPM.addons:fallbackPM();if(!addons.length)return;
  var base=(legacyPM&&legacyPM.base)||norm((root.querySelector('.v3-overview h2')||{}).textContent)||'Audioinstrument Sirius KT66';var desc=(legacyPM&&legacyPM.desc)||'Recommended synergy components selected for this amplifier.';var result=(legacyPM&&legacyPM.result)||'Ultimate Synergy';
  var sec=document.createElement('section');sec.className='v3-pm';sec.innerHTML='<button class="v3-pm-toggle" type="button" aria-expanded="false"><span class="v3-pm-copy"><span class="v3-pm-kicker">Perfect Matches</span><span class="v3-pm-note">Add recommended synergy components to get <b>5% OFF for EACH added device.</b></span></span><span class="v3-pm-icon" aria-hidden="true"><svg viewBox="0 0 20 20"><path d="M5.5 8 L10 12.5 L14.5 8"></path></svg></span></button><div class="v3-pm-body"><p class="v3-pm-desc">'+desc.replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c];})+'</p><div class="v3-pm-formula"><span class="v3-pm-item v3-pm-base">'+base.replace(/[&<>]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;'}[c];})+'</span>'+addons.map(function(x){return'<span class="v3-pm-plus">+</span><label class="v3-pm-item"><input class="v3-bundle" type="checkbox"><a href="'+x.href+'">'+x.text+'</a></label>';}).join('')+'<span class="v3-pm-equals">=</span><span class="v3-pm-result">'+result+'</span></div></div>';
  var buy=host.querySelector('.v3-buy');if(buy&&buy.parentNode)buy.parentNode.insertBefore(sec,buy.nextSibling);else host.appendChild(sec);
  var toggle=sec.querySelector('.v3-pm-toggle');toggle.addEventListener('click',function(){sec.classList.toggle('open');toggle.setAttribute('aria-expanded',sec.classList.contains('open')?'true':'false');});
}

async function bootKT66(){
  try{
    state.basePipeline='V4.1-direct';snapshotKT66Media();snapshotPM();
    var heroPromise=chooseHero(),verifyPromise=verifyCandidatesParallel();
    await loadScript(V1,function(){return!!window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V1__;});
    var root=await waitRoot(9000);if(!root)throw new Error('Golden root timeout');
    ensurePM(root);restoreHero();[300,900,1800].forEach(function(ms){setTimeout(restoreHero,ms);});
    state.ready=true;state.finalGalleryImages=root.querySelectorAll('.v3-thumb').length;pub();
    /* Media completion is intentionally non-blocking: no root rebuild. */
    await Promise.all([heroPromise,verifyPromise]);restoreHero();appendVerified(root);await repairDead(root);pub();
    console.info('[Filin Labs] Master Product V4 AMP Batch V8 ready',{version:VERSION,slug:PATH,ready:true,basePipeline:state.basePipeline,candidates:candidates.length,verified:verified.length,addedToGolden:added,repaired:repaired,finalGalleryImages:state.finalGalleryImages,badImages:Object.keys(bad).length,rootBuilds:1});
  }catch(e){state.lastError=String(e&&e.message||e);pub();console.warn('[Filin V4.8]',state.lastError);}
}
async function bootOther(){
  try{state.basePipeline='V4.4';await loadScript(V4,function(){return!!window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V4__;});var root=await waitRoot(10000);state.ready=!!root;state.finalGalleryImages=root?root.querySelectorAll('.v3-thumb').length:0;pub();}catch(e){state.lastError=String(e&&e.message||e);pub();}
}
function boot(){if(PATH===TARGET)bootKT66();else bootOther();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);},{once:true});else setTimeout(boot,0);
pub();
})();
