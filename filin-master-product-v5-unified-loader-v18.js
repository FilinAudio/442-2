/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V18
   Final AMP presentation parity for the next 12 amplifier / preamplifier cards.
   Base: approved V17 -> V16 GL01 Golden migration.
   Purpose:
   - preserve verified GL01 / Golden / commerce pipeline unchanged
   - restore the approved tube-amplifier Golden typography contract
   - restore native-style stacked mobile tabs (no generated + circles)
   - restore clean desktop tab row
   - hard-quarantine leftover legacy T123 tabs/product markup after Golden is ready
   - remove legacy block CSS after migration so it cannot restyle Golden content
   - de-duplicate curator copy
   - sanitize default "Amplifier Only" from cart/sticky identity
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V18__)return;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V18__=true;

var VERSION='5.18.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';
var V17='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@e5fe1fbb8037e6322df7ae29d48626a0bf8d5032/filin-master-product-v5-unified-loader-v17.js';
var TARGET=[
'gerbera_dual_mono_mosfet_headphone_amplifier','konstantin_audio_un_1_solid_state_headphones_amplifier',
'phenomenon_kgsshv_carbon_electrostatic_headphone_amplifier','sciber_enflow','gerbera_equos',
'audioinstrument_vivo_solid_state_amplifier','eridan_audio_rigel_integrated_amplifier','eridan_audio_quasar_amplifier',
'konstantin_audio_a2_solid_state_amplifier','demograf_neptunum_class_d_amplifier',
'nemesis_solid_state_amplifier_demograf','gerbera_active_tube_preamplifier'];
var TARGETED=TARGET.indexOf(PATH)>=0;
var state={version:VERSION,slug:PATH,mode:TARGETED?'tube-amp-final-presentation-over-v17':'delegate-v17',ready:false,baseReady:false,fontReady:false,tabsReady:false,curatorFixed:false,legacyHidden:0,legacyStylesRemoved:0,stickyFixed:0,error:''};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V18_STATE__=JSON.parse(JSON.stringify(state))}
function arr(v){return Array.prototype.slice.call(v||[])}
function str(v){return String(v==null?'':v).trim()}
function norm(v){return str(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim()}
function load(src,test){return new Promise(function(resolve,reject){if(test&&test())return resolve(true);var f=src.split('/').pop().split('?')[0],old=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(f)>=0});if(old){var n=0,t=setInterval(function(){if(!test||test()){clearInterval(t);resolve(true)}else if(++n>320){clearInterval(t);resolve(false)}},50);return}var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};(document.head||document.documentElement).appendChild(s)})}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test()}catch(e){}if(ok){clearInterval(t);resolve(true)}else if(Date.now()-st>(ms||26000)){clearInterval(t);resolve(false)}},50)})}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null}catch(e){return null}}

if(!TARGETED){load(V17,function(){return!!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V17__});state.ready=true;pub();return;}

function installStyle(){
  if(document.getElementById('filin-v18-amp-final-style'))return;
  var s=document.createElement('style');s.id='filin-v18-amp-final-style';s.textContent=''+
  '#'+ROOT+',#'+ROOT+' *{font-family:\'Montserrat\',Arial,sans-serif!important;box-sizing:border-box!important}'+
  '.fp-v18-legacy-hidden{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important}'+
  '.fp-v3-curator-text,.fp-v3-curator-text *{font-family:\'Montserrat\',Arial,sans-serif!important}'+
  '@media(min-width:821px){'+
    '#'+ROOT+' .v3-tabs{width:min(1320px,calc(100% - 220px))!important;margin:0 auto 34px!important;background:#fffbf7!important}'+
    '#'+ROOT+' .v3-tabbar{display:flex!important;flex-wrap:nowrap!important;width:100%!important;border:0!important;border-bottom:2px solid #eee!important;border-radius:0!important;background:#fffbf7!important;overflow-x:auto!important;white-space:nowrap!important}'+
    '#'+ROOT+' .v3-tabcollapse{display:none!important}'+
    '#'+ROOT+' .v3-tabbtn{flex:1 1 0!important;min-width:135px!important;min-height:0!important;padding:20px 12px!important;border:0!important;border-bottom:2px solid transparent!important;border-radius:0!important;background:transparent!important;color:#888!important;font-size:15px!important;line-height:1.2!important;font-weight:700!important;text-transform:uppercase!important;text-align:center!important;box-shadow:none!important}'+
    '#'+ROOT+' .v3-tabbtn.active{color:#b38b59!important;background:transparent!important;border-bottom-color:#b38b59!important;box-shadow:none!important}'+
    '#'+ROOT+' .v3-panel p,#'+ROOT+' .v3-panel li,#'+ROOT+' .v3-panel td,#'+ROOT+' .v3-panel label{font-family:\'Montserrat\',Arial,sans-serif!important;font-size:16px!important;line-height:1.58!important;font-weight:400!important}'+
  '}'+
  '@media(max-width:820px){'+
    '#'+ROOT+' .v3-overview h2{font-family:\'Montserrat\',Arial,sans-serif!important;font-size:20px!important;line-height:1.25!important;font-weight:750!important}'+
    '#'+ROOT+' .v3-overview p,#'+ROOT+' .v3-overview li{font-family:\'Montserrat\',Arial,sans-serif!important;font-size:13px!important;line-height:1.55!important;font-weight:400!important;letter-spacing:0!important}'+
    '#'+ROOT+' .v3-tabs{width:100%!important;margin:0!important;padding:0 16px 24px!important;background:#fffbf7!important}'+
    '#'+ROOT+' .v3-panels{padding:0!important}'+
    '#'+ROOT+' .v3-mobile-tabbtn{display:block!important;width:100%!important;min-width:0!important;min-height:52px!important;margin:0 0 6px!important;padding:14px 12px!important;border:1px solid #eee!important;border-radius:8px!important;background:#f4eee8!important;color:#888!important;font-family:\'Montserrat\',Arial,sans-serif!important;font-size:16px!important;line-height:1.2!important;font-weight:700!important;text-align:left!important;text-transform:uppercase!important;box-shadow:none!important}'+
    '#'+ROOT+' .v3-mobile-tabbtn:after{display:none!important;content:none!important}'+
    '#'+ROOT+' .v3-mobile-tabbtn.active{border-color:#b38b59!important;background:#fffbf7!important;color:#b38b59!important}'+
    '#'+ROOT+' .v3-panel{padding:0!important}'+
    '#'+ROOT+' .v3-panel .content-container{padding:18px 12px!important}'+
    '#'+ROOT+' .v3-panel p,#'+ROOT+' .v3-panel li,#'+ROOT+' .v3-panel td,#'+ROOT+' .v3-panel label{font-family:\'Montserrat\',Arial,sans-serif!important;font-size:13px!important;line-height:1.55!important;font-weight:400!important;letter-spacing:0!important}'+
    '#'+ROOT+' .v3-curation-wrap{width:100%!important;margin:28px 0 0!important;padding:0 14px 24px!important;border:0!important;border-radius:0!important;background:#fffbf7!important;overflow:visible!important}'+
    '#'+ROOT+' .v3-curation{display:block!important;width:100%!important}'+
    '#'+ROOT+' .v3-curation-item{width:100%!important;min-height:0!important;margin:0!important;padding:18px 0!important;display:grid!important;grid-template-columns:26px minmax(0,1fr)!important;gap:12px!important;border:0!important;border-bottom:1px solid #e7ddd3!important;background:transparent!important;box-shadow:none!important}'+
    '#'+ROOT+' .v3-curation-item:last-child{border-bottom:0!important}'+
    '#'+ROOT+' .v3-curation-item h3{margin:0 0 7px!important;color:#171512!important;font-family:\'Montserrat\',Arial,sans-serif!important;font-size:12px!important;line-height:1.25!important;font-weight:800!important;text-transform:uppercase!important}'+
    '#'+ROOT+' .v3-curation-item p{margin:0!important;color:#4f4a46!important;font-family:\'Montserrat\',Arial,sans-serif!important;font-size:12px!important;line-height:1.5!important;font-weight:400!important}'+
    '.fp-v3-curator-text{font-family:\'Montserrat\',Arial,sans-serif!important;font-size:16px!important;line-height:1.45!important;font-weight:600!important;font-style:italic!important;text-align:center!important}'+
  '}';
  (document.head||document.documentElement).appendChild(s);
  state.fontReady=true;state.tabsReady=true;pub();
}

function dedupeCurator(v){
  var text=norm(v);if(!text)return text;
  var parts=text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text],seen={},out=[];
  parts.forEach(function(x){x=norm(x);if(!x)return;var k=x.toLowerCase().replace(/^handcrafted\s+by\s+/,'').replace(/[^a-z0-9]+/g,' ').trim();if(!k||seen[k])return;seen[k]=1;out.push(x)});
  return norm(out.join(' '));
}
function cleanIdentity(){
  var p=profile();if(!p)return false;
  if(p.curator)p.curator=dedupeCurator(p.curator);
  if(p.commerce){
    function cleanName(v){return norm(v).replace(/\s*\[\s*Amplifier Only[^\]]*\]\s*/ig,' ').replace(/\s*\(\s*Amplifier Only[^\)]*\)\s*/ig,' ').replace(/\s+/g,' ').trim()}
    p.commerce.cartName=cleanName(p.commerce.cartName||p.commerce.displayName||'');
    p.commerce.stickyTitle=cleanName(p.commerce.stickyTitle||p.commerce.displayName||p.commerce.cartName||'');
    p.commerce.displayName=cleanName(p.commerce.displayName||p.commerce.stickyTitle||p.commerce.cartName||'');
  }
  var curator=dedupeCurator(p.curator||'');
  arr(document.querySelectorAll('.fp-v3-curator-text')).forEach(function(n){if(curator)n.textContent=curator});
  var hidden=document.querySelector('#'+ROOT+' #v3-tilda-product-name');if(hidden&&p.commerce&&p.commerce.cartName)hidden.textContent=p.commerce.cartName;
  state.curatorFixed=!!curator;pub();return true;
}
function hardQuarantine(){
  var root=document.getElementById(ROOT),hidden=0,removed=0;if(!root)return;
  arr(document.querySelectorAll('.tabs-wrapper,.js-product,.product-wrapper')).forEach(function(n){
    if(root.contains(n)||n.closest('.t706,.t1002,.t-popup'))return;
    var rec=n.closest('.t-rec,[id^="rec"]')||n;
    if(rec.classList.contains('fp-v3-curator-record')||rec.querySelector&&rec.querySelector('.fp-v3-curator-text'))return;
    if(!rec.classList.contains('fp-v18-legacy-hidden')){rec.classList.add('fp-v18-legacy-hidden');hidden++}
  });
  arr(document.querySelectorAll('.fp-v16-source-hidden style,.fp-v18-legacy-hidden style')).forEach(function(s){s.remove();removed++});
  state.legacyHidden=hidden;state.legacyStylesRemoved=removed;pub();
}
function fixSticky(){
  var p=profile();if(!p||!p.commerce)return 0;var title=p.commerce.stickyTitle||p.commerce.displayName||'',changed=0;if(!title)return 0;
  arr(document.querySelectorAll('body *')).forEach(function(el){
    if(el.children.length)return;var t=norm(el.textContent);if(!t||t.length>180)return;
    var q=el,sticky=false;for(var i=0;i<6&&q;i++,q=q.parentElement){var pos='';try{pos=getComputedStyle(q).position}catch(e){}if(pos==='fixed'||pos==='sticky'){sticky=true;break}}
    if(!sticky)return;
    if(/Amplifier Only/i.test(t)||(/\[[^\]]+\]/.test(t)&&t.toLowerCase().indexOf(PATH.split('_')[0])>=0)){el.textContent=title;changed++}
  });
  state.stickyFixed=changed;pub();return changed;
}
function finalize(){installStyle();cleanIdentity();hardQuarantine();fixSticky();}

async function boot(){
  try{
    await load(V17,function(){return!!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V17__});
    var ok=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V17_STATE__;return s&&s.ready===true&&document.querySelector('#'+ROOT+' .v3-shell')&&profile()},26000);
    state.baseReady=!!ok;pub();if(!ok)throw new Error('V17 Golden base did not become ready');
    finalize();[250,800,1800,3600,6500].forEach(function(ms){setTimeout(finalize,ms)});
    state.ready=true;state.error='';pub();console.info('[Filin Labs] Master Product V5.18 final AMP presentation ready',state);
  }catch(e){state.error=String(e&&e.message||e);pub();console.warn('[Filin V5.18]',state.error,state)}
}
boot();pub();
})();
