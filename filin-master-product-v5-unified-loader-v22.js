/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V22
   KT66 visual-contract parity for the 12 amplifier / preamplifier cards.
   Base: approved V21 -> V20 -> V19 -> V18 -> V17 -> V16 pipeline.
   - neutralizes only V18 custom presentation CSS (the source of flat gray tabs / flat curation)
   - restores native Golden V3.3.2 mobile geometry used by Sirius KT66
   - keeps V18 JS cleanup/quarantine behavior
   - adds KT66-style Perfect Matches if missing, preferring real legacy Bundle/PM links
   - falls back to Rich Catalog only when the page has no usable legacy PM links
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V22__)return;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V22__=true;

var VERSION='5.22.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';
var V21='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@48ab29febd56f7b835714255b32f32c47e1640a8/filin-master-product-v5-unified-loader-v21.js';
var TARGET=[
'gerbera_dual_mono_mosfet_headphone_amplifier','konstantin_audio_un_1_solid_state_headphones_amplifier',
'phenomenon_kgsshv_carbon_electrostatic_headphone_amplifier','sciber_enflow','gerbera_equos',
'audioinstrument_vivo_solid_state_amplifier','eridan_audio_rigel_integrated_amplifier','eridan_audio_quasar_amplifier',
'konstantin_audio_a2_solid_state_amplifier','demograf_neptunum_class_d_amplifier',
'nemesis_solid_state_amplifier_demograf','gerbera_active_tube_preamplifier'
];
var TARGETED=TARGET.indexOf(PATH)>=0;
var state={version:VERSION,slug:PATH,mode:TARGETED?'kt66-native-golden-parity-over-v21':'delegate-v21',ready:false,baseReady:false,v18StyleNeutralized:false,nativeTabs:false,nativeCuration:false,pmReady:false,pmItems:0,pmSource:'',error:''};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V22_STATE__=JSON.parse(JSON.stringify(state))}
function arr(v){return Array.prototype.slice.call(v||[])}
function str(v){return String(v==null?'':v).trim()}
function norm(v){return str(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim()}
function esc(v){return str(v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function load(src){return new Promise(function(resolve,reject){var file=src.split('/').pop().split('?')[0],old=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(file)>=0});if(old){resolve(true);return}var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};(document.head||document.documentElement).appendChild(s)})}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test()}catch(e){}if(ok){clearInterval(t);resolve(true)}else if(Date.now()-st>(ms||34000)){clearInterval(t);resolve(false)}},60)})}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null}catch(e){return null}}
function samePage(h){try{return new URL(h,location.href).pathname.replace(/\/+$/,'')===location.pathname.replace(/\/+$/,'')}catch(e){return true}}
function validProductHref(h){if(!h||h==='#'||/^javascript:/i.test(h)||samePage(h))return false;try{var u=new URL(h,location.href);return /(^|\.)filinlabs\.com$/i.test(u.hostname)}catch(e){return false}}
function uniqueLinks(xs){var seen={},out=[];xs.forEach(function(x){var h=str(x.href),t=norm(x.text);if(!validProductHref(h)||!t)return;try{h=new URL(h,location.href).href}catch(e){return}var k=new URL(h).pathname.replace(/\/+$/,'');if(seen[k])return;seen[k]=1;out.push({href:h,text:t})});return out}

function neutralizeV18Style(){
  var old=document.getElementById('filin-v18-amp-final-style');
  if(old&&!old.getAttribute('data-fp-v22-neutralized'))old.remove();
  var guard=document.getElementById('filin-v18-amp-final-style');
  if(!guard){guard=document.createElement('style');guard.id='filin-v18-amp-final-style';guard.setAttribute('data-fp-v22-neutralized','1');guard.textContent='/* neutralized by V22: native Golden V3.3.2 presentation restored */';(document.head||document.documentElement).appendChild(guard)}
  state.v18StyleNeutralized=true;pub();
}

function pageBaseName(){var p=profile();return norm(p&&p.commerce&&(p.commerce.stickyTitle||p.commerce.displayName||p.commerce.cartName)||p&&p.overview&&p.overview.title||document.title)}
function legacyPMData(){
  var nodes=[];
  arr(document.querySelectorAll('.perfect-matches-block')).forEach(function(n){if(!n.closest('#'+ROOT)&&!n.closest('.t706,.t1002,.t-popup'))nodes.push(n)});
  var node=nodes[0]||null;
  if(node){
    var desc=node.querySelector('.pm-desc'),result=node.querySelector('.pm-result'),base=node.querySelector('.pm-base'),links=[];
    arr(node.querySelectorAll('a[href]')).forEach(function(a){links.push({text:norm(a.textContent),href:a.getAttribute('href')||a.href})});
    links=uniqueLinks(links);
    if(links.length)return{desc:norm(desc&&desc.textContent)||'Recommended synergy components selected for this amplifier.',base:norm(base&&base.textContent)||pageBaseName(),result:norm(result&&result.textContent)||'Ultimate Synergy',links:links,source:'legacy-perfect-matches'};
  }
  var bundles=arr(document.querySelectorAll('.tabs-wrapper .tab-content,[id*="bundle" i],.tab-content')).filter(function(n){return !n.closest('#'+ROOT)&&/bundle\s*offer|perfect\s*match|recommended\s*synergy/i.test(norm(n.innerText||n.textContent))});
  for(var i=0;i<bundles.length;i++){
    var links2=[];arr(bundles[i].querySelectorAll('a[href]')).forEach(function(a){links2.push({text:norm(a.textContent),href:a.getAttribute('href')||a.href})});links2=uniqueLinks(links2);
    if(links2.length)return{desc:'Recommended synergy components selected for this amplifier.',base:pageBaseName(),result:'Ultimate Synergy',links:links2.slice(0,4),source:'legacy-bundle-offer'};
  }
  return null;
}
function richFallback(){
  var ps=window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products||{},rows=[];
  function score(k,x){var t=(k+' '+str(x&&x.name)+' '+str(x&&x.brand)+' '+str(x&&x.categories)).toLowerCase(),s=0;if(/dac|digital.*analog|r2r|multibit/.test(t))s+=10;if(/cable|interconnect/.test(t))s+=7;if(/headphone/.test(t))s+=6;if(/speaker/.test(t))s+=4;if(/preamp|preamplifier/.test(t))s+=3;if(/amplifier|\bamp\b/.test(t))s+=1;return s}
  Object.keys(ps).forEach(function(k){var x=ps[k];if(!x||k===PATH||!x.name||!Number(x.price)>0)return;var s=score(k,x);if(s>0)rows.push({k:k,x:x,s:s})});
  rows.sort(function(a,b){return b.s-a.s});
  var links=uniqueLinks(rows.map(function(o){return{text:o.x.name,href:o.x.url||('/'+o.k)}})).slice(0,3);
  if(!links.length)return null;
  return{desc:'Recommended synergy components selected for this amplifier.',base:pageBaseName(),result:'Ultimate Synergy',links:links,source:'rich-catalog-fallback'};
}
function pmHTML(d){
  var note='Add recommended synergy components to get <b>5% OFF for EACH added device.</b>';
  return '<section class="v3-pm" data-fp-v22-pm="kt66-contract">'+
    '<button class="v3-pm-toggle" type="button" aria-expanded="false"><span class="v3-pm-copy"><span class="v3-pm-kicker">Perfect Matches</span><span class="v3-pm-note">'+note+'</span></span><span class="v3-pm-icon" aria-hidden="true"><svg viewBox="0 0 20 20" focusable="false"><path d="M5.5 8 L10 12.5 L14.5 8"></path></svg></span></button>'+
    '<div class="v3-pm-body"><p class="v3-pm-desc">'+esc(d.desc)+'</p><div class="v3-pm-formula"><span class="v3-pm-item v3-pm-base">'+esc(d.base)+'</span>'+
    d.links.map(function(x){return '<span class="v3-pm-plus">+</span><label class="v3-pm-item"><input class="v3-bundle" type="checkbox"><a href="'+esc(x.href)+'">'+esc(x.text)+'</a></label>'}).join('')+
    '<span class="v3-pm-equals">=</span><span class="v3-pm-result">'+esc(d.result)+'</span></div></div></section>';
}
function ensurePM(){
  var root=document.getElementById(ROOT);if(!root)return false;
  var existing=root.querySelector('.v3-pm');
  if(existing){state.pmReady=true;state.pmItems=existing.querySelectorAll('.v3-bundle').length;state.pmSource=existing.getAttribute('data-fp-v22-pm')?'v22-existing':'golden-existing';pub();return true}
  var d=legacyPMData()||richFallback();if(!d||!d.links.length)return false;
  var host=root.querySelector('.v3-js-product')||root.querySelector('.v3-commerce .js-product');if(!host)return false;
  var box=document.createElement('div');box.innerHTML=pmHTML(d);var fresh=box.firstElementChild;
  var buy=host.querySelector('.v3-buy');if(buy&&buy.parentNode)buy.parentNode.insertBefore(fresh,buy.nextSibling);else host.appendChild(fresh);
  var toggle=fresh.querySelector('.v3-pm-toggle');if(toggle)toggle.addEventListener('click',function(){fresh.classList.toggle('open');toggle.setAttribute('aria-expanded',fresh.classList.contains('open')?'true':'false')});
  state.pmReady=true;state.pmItems=d.links.length;state.pmSource=d.source;pub();return true;
}
function verifyNative(){
  var root=document.getElementById(ROOT),btn=root&&root.querySelector('.v3-mobile-tabbtn'),cur=root&&root.querySelector('.v3-curation-wrap');
  if(btn){try{var cs=getComputedStyle(btn);state.nativeTabs=parseFloat(cs.borderTopWidth||'0')>=1}catch(e){state.nativeTabs=true}}
  if(cur){try{var cc=getComputedStyle(cur);state.nativeCuration=parseFloat(cc.borderTopWidth||'0')>=1||parseFloat(cc.borderLeftWidth||'0')>=1}catch(e){state.nativeCuration=true}}
  pub();
}
function finalize(){neutralizeV18Style();ensurePM();verifyNative()}

async function boot(){
  try{
    await load(V21);
    if(!TARGETED){state.ready=true;pub();return}
    var ok=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V21_STATE__;return s&&s.ready===true&&document.querySelector('#'+ROOT+' .v3-shell')&&profile()},34000);
    state.baseReady=!!ok;pub();if(!ok)throw new Error('V21 pipeline did not become ready');
    finalize();
    [200,700,1600,3200,6500,9000].forEach(function(ms){setTimeout(finalize,ms)});
    state.ready=true;state.error='';pub();console.info('[Filin Labs] Master Product V5.22 KT66 native parity ready',state);
  }catch(e){state.error=String(e&&e.message||e);pub();console.warn('[Filin V5.22]',state.error,state)}
}
boot();pub();
})();
