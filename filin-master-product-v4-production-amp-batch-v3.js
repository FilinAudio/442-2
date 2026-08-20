/* ============================================================
   FILIN LABS — MASTER PRODUCT V4 PRODUCTION AMP BATCH V3
   Version 4.3.0

   Single entrypoint for the approved 10 tube-amplifier pages.
   Loads V4.2 media-safe migration and normalizes Perfect Matches to
   the same Golden contract used by Audioinstrument Sirius KT150:
   - same .v3-pm markup / geometry / toggle
   - same 5% OFF note
   - base + selectable real catalog products = result
   - keeps each page's own legacy PM description, products and links
   - Clean Commerce V2 remains the sole price calculator
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V3__)return;

var VERSION='4.3.0';
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
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V3__=true;

var V2='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@2ec5dc560508df0892f696736e5a1bdd39b3bc0f/filin-master-product-v4-production-amp-batch-v2.js';
var legacyPM=null;
var applied=0;
var source='';
var lastError='';
var state={version:VERSION,slug:PATH,ready:false,pmReady:false,items:0,source:'',applied:0,lastError:''};

function pub(){state.source=source;state.applied=applied;state.lastError=lastError;window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V3_STATE__=JSON.parse(JSON.stringify(state));}
function str(v){return String(v==null?'':v).trim();}
function norm(v){return str(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
function arr(v){return Array.prototype.slice.call(v||[]);}
function esc(v){return str(v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function normHref(v){try{var u=new URL(v,location.href);if(!/^https?:$/i.test(u.protocol))return'';return u.href;}catch(e){return'';}}
function samePage(h){try{return new URL(h,location.href).pathname.replace(/\/+$/,'')===location.pathname.replace(/\/+$/,'');}catch(e){return true;}}
function validAddonHref(h){if(!h||h==='#'||/^javascript:/i.test(h)||samePage(h))return false;try{var u=new URL(h,location.href);return /(^|\.)filinlabs\.com$/i.test(u.hostname);}catch(e){return false;}}
function uniqueAddons(xs){var seen={},out=[];xs.forEach(function(x){var href=normHref(x.href),text=norm(x.text);if(!validAddonHref(href)||!text)return;var k=new URL(href).pathname.replace(/\/+$/,'');if(seen[k])return;seen[k]=1;out.push({text:text,href:href});});return out;}

function findLegacyPerfectMatches(){
  var direct=arr(document.querySelectorAll('.perfect-matches-block')).find(function(n){return !n.closest('#'+ROOT_ID)&&!n.closest('.t706,.t1002,.t-popup');});
  if(direct)return direct;
  var heads=arr(document.querySelectorAll('h2,h3,h4,.pm-title')).filter(function(h){return /perfect\s*matches/i.test(norm(h.textContent))&&!h.closest('#'+ROOT_ID);});
  if(!heads.length)return null;
  var h=heads[0],n=h,best=null;
  for(var i=0;n&&n!==document.body&&i<8;i++,n=n.parentElement){var t=norm(n.innerText||n.textContent);if(t.length>30&&t.length<2500&&n.querySelector('a[href]'))best=n;if(n.matches&&n.matches('.t-rec,[id^="rec"]'))break;}
  return best||h.parentElement;
}
function pageBaseName(){
  var p=document.querySelector('.js-product-name');var t=norm(p&&p.textContent);if(t)return t;
  var h=document.querySelector('.t-cover h1,.t-cover .t-title,h1');return norm(h&&h.innerText)||norm(document.title).replace(/\s*[|—-]\s*Filin.*$/i,'');
}
function extractLegacyPM(node){
  if(!node)return null;
  var desc=node.querySelector('.pm-desc');
  if(!desc){desc=arr(node.querySelectorAll('p,.t-text,.t-descr')).find(function(x){var t=norm(x.textContent);return t.length>25&&!/5%\s*off|add recommended synergy/i.test(t);})||null;}
  var base=node.querySelector('.pm-base');
  var result=node.querySelector('.pm-result');
  var addons=[];
  arr(node.querySelectorAll('.pm-item:not(.pm-base) a[href],label a[href],a[href]')).forEach(function(a){addons.push({text:norm(a.textContent),href:a.getAttribute('href')||a.href});});
  addons=uniqueAddons(addons);
  return {
    desc:norm(desc&&desc.textContent),
    base:norm(base&&base.textContent)||pageBaseName(),
    addons:addons,
    result:norm(result&&result.textContent)||'Ultimate Synergy'
  };
}
function snapshot(){legacyPM=extractLegacyPM(findLegacyPerfectMatches());if(legacyPM&&legacyPM.addons.length)source='legacy-perfect-matches';pub();}

function extractGoldenPM(root){
  var pm=root&&root.querySelector('.v3-pm');if(!pm)return null;
  var addons=[];arr(pm.querySelectorAll('.v3-pm-item:not(.v3-pm-base) a[href]')).forEach(function(a){addons.push({text:norm(a.textContent),href:a.getAttribute('href')||a.href});});
  addons=uniqueAddons(addons);
  return {desc:norm((pm.querySelector('.v3-pm-desc')||{}).textContent),base:norm((pm.querySelector('.v3-pm-base')||{}).textContent)||pageBaseName(),addons:addons,result:norm((pm.querySelector('.v3-pm-result')||{}).textContent)||'Ultimate Synergy'};
}
function fallbackFromRecommendationCards(){
  var out=[];
  arr(document.querySelectorAll('a[href]')).forEach(function(a){
    if(out.length>=4||a.closest('header,footer,.t-menu,.t706,.t1002,#'+ROOT_ID+' .v3-pm'))return;
    var href=a.getAttribute('href')||a.href,text=norm(a.textContent);
    if(!validAddonHref(href)||!text||/^(view|buy now|catalog|catalogue|read more)$/i.test(text))return;
    var card=a.closest('article,.t-card,[class*="card"],[class*="item"]');
    if(!card||!card.querySelector('img'))return;
    var title=card.querySelector('h2,h3,h4,.t-name,[class*="title"]');
    text=norm(title&&title.textContent)||text;
    if(text.length<4||text.length>180)return;
    out.push({text:text,href:href});
  });
  return uniqueAddons(out).slice(0,3);
}
function fallbackFromCatalog(){
  var ps=window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products||{},keys=Object.keys(ps),out=[];
  function score(k,x){var t=(k+' '+str(x&&x.name)+' '+str(x&&x.brand)+' '+str(x&&x.categories)).toLowerCase(),s=0;if(/dac|digital.*analog|r2r/.test(t))s+=8;if(/cable|interconnect/.test(t))s+=6;if(/preamp|preamplifier/.test(t))s+=5;if(/speaker|headphone/.test(t))s+=3;return s;}
  keys.map(function(k){return{k:k,x:ps[k],s:score(k,ps[k])};}).filter(function(o){return o.k!==PATH&&o.x&&o.x.name&&Number(o.x.price)>0&&o.s>0;}).sort(function(a,b){return b.s-a.s;}).forEach(function(o){if(out.length>=3)return;out.push({text:o.x.name,href:o.x.url||('/'+o.k)});});
  return uniqueAddons(out);
}
function bestData(root){
  var g=extractGoldenPM(root);
  if(g&&g.addons.length){source='golden-existing';return g;}
  if(legacyPM&&legacyPM.addons.length){source='legacy-perfect-matches';return legacyPM;}
  var cards=fallbackFromRecommendationCards();
  if(cards.length){source='recommendation-cards';return{desc:'Recommended synergy components selected for this amplifier.',base:pageBaseName(),addons:cards,result:'Ultimate Synergy'};}
  var cat=fallbackFromCatalog();
  if(cat.length){source='rich-catalog-fallback';return{desc:'Recommended synergy components selected for this amplifier.',base:pageBaseName(),addons:cat,result:'Ultimate Synergy'};}
  return null;
}
function buildPM(d){
  var note='Add recommended synergy components to get <b>5% OFF for EACH added device.</b>';
  return '<section class="v3-pm" data-fp-amp-pm="kt150-contract">'+
    '<button class="v3-pm-toggle" type="button" aria-expanded="false">'+
      '<span class="v3-pm-copy"><span class="v3-pm-kicker">Perfect Matches</span><span class="v3-pm-note">'+note+'</span></span>'+
      '<span class="v3-pm-icon" aria-hidden="true"><svg viewBox="0 0 20 20" focusable="false"><path d="M5.5 8 L10 12.5 L14.5 8"></path></svg></span>'+
    '</button>'+
    '<div class="v3-pm-body"><p class="v3-pm-desc">'+esc(d.desc||'Recommended synergy components for this amplifier.')+'</p>'+
      '<div class="v3-pm-formula"><span class="v3-pm-item v3-pm-base">'+esc(d.base||pageBaseName())+'</span>'+
      d.addons.map(function(x){return '<span class="v3-pm-plus">+</span><label class="v3-pm-item"><input class="v3-bundle" type="checkbox"><a href="'+esc(x.href)+'">'+esc(x.text)+'</a></label>';}).join('')+
      '<span class="v3-pm-equals">=</span><span class="v3-pm-result">'+esc(d.result||'Ultimate Synergy')+'</span></div></div></section>';
}
function signature(d){return [norm(d.base),d.addons.map(function(x){try{return new URL(x.href,location.href).pathname;}catch(e){return x.href;}}).join('|'),norm(d.result)].join('::');}
function normalizePM(){
  var root=document.getElementById(ROOT_ID);if(!root)return false;
  var data=bestData(root);if(!data||!data.addons.length){lastError='no usable Perfect Matches products found';pub();return false;}
  var host=root.querySelector('.v3-js-product')||root.querySelector('.v3-commerce .js-product');if(!host){lastError='Golden commerce host not found';pub();return false;}
  var current=host.querySelector('.v3-pm');
  if(current&&current.dataset.fpAmpPm==='kt150-contract'&&current.dataset.fpPmSignature===signature(data)){state.ready=true;state.pmReady=true;state.items=data.addons.length;pub();return true;}
  var box=document.createElement('div');box.innerHTML=buildPM(data);var fresh=box.firstElementChild;fresh.dataset.fpPmSignature=signature(data);
  if(current)current.replaceWith(fresh);else{var buy=host.querySelector('.v3-buy');if(buy&&buy.parentNode)buy.parentNode.insertBefore(fresh,buy.nextSibling);else host.appendChild(fresh);}
  var toggle=fresh.querySelector('.v3-pm-toggle');if(toggle)toggle.addEventListener('click',function(){fresh.classList.toggle('open');toggle.setAttribute('aria-expanded',fresh.classList.contains('open')?'true':'false');});
  applied++;state.ready=true;state.pmReady=true;state.items=data.addons.length;lastError='';pub();
  return true;
}
function loadV2(){return new Promise(function(resolve,reject){if(window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V2__){resolve(true);return;}var s=document.createElement('script');s.src=V2;s.async=true;s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('V4.2 load failed'));};(document.head||document.documentElement).appendChild(s);});}
function waitRoot(ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var r=document.getElementById(ROOT_ID);if(r){clearInterval(t);resolve(r);}else if(Date.now()-st>(ms||10000)){clearInterval(t);resolve(null);}},60);});}
async function boot(){
  try{
    snapshot();
    await loadV2();
    var root=await waitRoot(10000);if(!root)throw new Error('Golden root timeout');
    normalizePM();
    [350,1000,2400,5000].forEach(function(ms){setTimeout(normalizePM,ms);});
    setTimeout(function(){state.ready=!!document.getElementById(ROOT_ID);state.pmReady=!!document.querySelector('#'+ROOT_ID+' .v3-pm[data-fp-amp-pm="kt150-contract"]');pub();console.info('[Filin Labs] Master Product V4 AMP Batch V3 ready',{version:VERSION,slug:PATH,ready:state.ready,pmReady:state.pmReady,items:state.items,source:source});},650);
  }catch(e){lastError=String(e&&e.message||e);pub();console.warn('[Filin V4.3]',lastError);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);},{once:true});else setTimeout(boot,0);
pub();
})();
