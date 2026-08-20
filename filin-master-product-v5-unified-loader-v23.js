/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V23
   Exact source-record quarantine over approved V22 pipeline.
   Fixes remaining duplicate media on migrated AMP pages by hiding the
   precise original GL01/Tilda source record reported by V16 state.
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V23__)return;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V23__=true;

var VERSION='5.23.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';
var V22='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@0b6086001da7fc309b1e5ce90a82fc3017255647/filin-master-product-v5-unified-loader-v22.js';
var TARGET=[
'gerbera_dual_mono_mosfet_headphone_amplifier','konstantin_audio_un_1_solid_state_headphones_amplifier',
'phenomenon_kgsshv_carbon_electrostatic_headphone_amplifier','sciber_enflow','gerbera_equos',
'audioinstrument_vivo_solid_state_amplifier','eridan_audio_rigel_integrated_amplifier','eridan_audio_quasar_amplifier',
'konstantin_audio_a2_solid_state_amplifier','demograf_neptunum_class_d_amplifier',
'nemesis_solid_state_amplifier_demograf','gerbera_active_tube_preamplifier'
];
var TARGETED=TARGET.indexOf(PATH)>=0;
var state={version:VERSION,slug:PATH,mode:TARGETED?'exact-v16-source-record-quarantine-over-v22':'delegate-v22',ready:false,baseReady:false,sourceRecord:'',sourceRecordFound:false,sourceRecordHidden:false,extraLegacyGalleryHidden:0,error:''};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V23_STATE__=JSON.parse(JSON.stringify(state))}
function arr(v){return Array.prototype.slice.call(v||[])}
function norm(v){return String(v==null?'':v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim()}
function load(src){return new Promise(function(resolve,reject){var f=src.split('/').pop().split('?')[0],old=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(f)>=0});if(old){resolve(true);return}var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};(document.head||document.documentElement).appendChild(s)})}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test()}catch(e){}if(ok){clearInterval(t);resolve(true)}else if(Date.now()-st>(ms||36000)){clearInterval(t);resolve(false)}},60)})}
function hardHide(n,tag){if(!n||!n.style)return false;n.setAttribute(tag||'data-fp-v23-hidden','1');['display','visibility','height','min-height','max-height','margin','padding','overflow'].forEach(function(k){var v=(k==='display')?'none':(k==='visibility'?'hidden':(k==='overflow'?'hidden':'0'));n.style.setProperty(k,v,'important')});return true}
function exactSource(){var s=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V16_STATE__||{};var id=String(s.sourceRecord||'').trim();state.sourceRecord=id;if(!id){pub();return false}var rec=document.getElementById(id)||document.querySelector('#'+CSS.escape(id));state.sourceRecordFound=!!rec;if(rec&&!(rec.closest&&rec.closest('#'+ROOT))){hardHide(rec,'data-fp-v23-source-hidden');state.sourceRecordHidden=true}pub();return state.sourceRecordHidden}
function overlapLegacy(){
  var p=null;try{p=window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]}catch(e){}
  var urls=(p&&p.overview&&p.overview.galleryImages||[]).map(function(u){try{return new URL(u,location.href).pathname}catch(e){return String(u)}});if(!urls.length)return 0;
  var root=document.getElementById(ROOT),hidden=0;
  arr(document.querySelectorAll('.t-rec,[id^="rec"]')).forEach(function(rec){
    if(!rec||!rec.isConnected||!root||root.contains(rec)||rec.contains(root))return;
    if(rec.closest('header,footer,#t-header,#t-footer,.t706,.t1002,.t-popup'))return;
    if(rec.getAttribute('data-fp-v23-source-hidden')==='1'||rec.getAttribute('data-fp-v21-legacy-curation-hidden')==='1')return;
    var imgs=arr(rec.querySelectorAll('img,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url]')),matches=0;
    imgs.forEach(function(el){['src','data-original','data-src','data-lazy-src','data-img-zoom-url'].forEach(function(a){var v=el.getAttribute&&el.getAttribute(a);if(!v)return;try{v=new URL(v,location.href).pathname}catch(e){}if(urls.indexOf(v)>=0)matches++})});
    var hasSlider=!!rec.querySelector('.t-slds,.t-slds__container,.t-slds__item,.t670');
    if(hasSlider&&matches>=1){hardHide(rec,'data-fp-v23-overlap-hidden');hidden++}
  });
  state.extraLegacyGalleryHidden=hidden;pub();return hidden
}
function finalize(){exactSource();overlapLegacy()}

async function boot(){
  try{
    await load(V22);
    if(!TARGETED){state.ready=true;pub();return}
    var ok=await wait(function(){var a=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V22_STATE__,b=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V16_STATE__;return a&&a.ready===true&&b&&b.ready===true&&document.querySelector('#'+ROOT+' .v3-shell')},36000);
    state.baseReady=!!ok;pub();if(!ok)throw new Error('V22/V16 pipeline did not become ready');
    finalize();[150,500,1200,2500,5000,8500].forEach(function(ms){setTimeout(finalize,ms)});
    state.ready=true;state.error='';pub();console.info('[Filin Labs] Master Product V5.23 exact source quarantine ready',state);
  }catch(e){state.error=String(e&&e.message||e);pub();console.warn('[Filin V5.23]',state.error,state)}
}
boot();pub();
})();