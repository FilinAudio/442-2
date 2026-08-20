/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V21
   Legacy curation quarantine over approved V20 pipeline.
   - keeps V20 -> V19 -> V18 -> V17 -> V16 unchanged
   - hides only old Tilda curation records outside #filin-master-product-v3
   - never hides Golden curation inside the active v3-shell
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V21__)return;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V21__=true;

var VERSION='5.21.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';
var V20='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@69bd4894cee46d1d924bb22901b98cdc9332b28b/filin-master-product-v5-unified-loader-v20.js';
var TARGET=[
'gerbera_dual_mono_mosfet_headphone_amplifier','konstantin_audio_un_1_solid_state_headphones_amplifier',
'phenomenon_kgsshv_carbon_electrostatic_headphone_amplifier','sciber_enflow','gerbera_equos',
'audioinstrument_vivo_solid_state_amplifier','eridan_audio_rigel_integrated_amplifier','eridan_audio_quasar_amplifier',
'konstantin_audio_a2_solid_state_amplifier','demograf_neptunum_class_d_amplifier',
'nemesis_solid_state_amplifier_demograf','gerbera_active_tube_preamplifier'
];
var TARGETED=TARGET.indexOf(PATH)>=0;
var state={version:VERSION,slug:PATH,mode:TARGETED?'legacy-curation-quarantine-over-v20':'delegate-v20',ready:false,baseReady:false,legacyCurationHidden:0,error:''};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V21_STATE__=JSON.parse(JSON.stringify(state))}
function arr(v){return Array.prototype.slice.call(v||[])}
function norm(v){return String(v==null?'':v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim()}
function load(src){return new Promise(function(resolve,reject){
  var file=src.split('/').pop().split('?')[0],old=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(file)>=0});
  if(old){resolve(true);return}
  var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};
  (document.head||document.documentElement).appendChild(s)
})}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test()}catch(e){}if(ok){clearInterval(t);resolve(true)}else if(Date.now()-st>(ms||32000)){clearInterval(t);resolve(false)}},60)})}

var RX=[
  /cat(?:h)?egory\s*&?\s*budget\s*tier|budget\s*tier/i,
  /tags?\s*&\s*features|tags?\s+features/i,
  /sonic\s*signature/i,
  /high\s*technolog/i,
  /curator.?s\s*choice/i,
  /synergy\s*match/i,
  /genres?\s*accord/i
];
function score(t){var n=0;RX.forEach(function(r){if(r.test(t))n++});return n}
function hideLegacyCuration(){
  var root=document.getElementById(ROOT),hidden=0;
  if(!root)return 0;
  arr(document.querySelectorAll('.t-rec,[id^="rec"]')).forEach(function(rec){
    if(!rec||!rec.isConnected||root.contains(rec)||rec.contains(root))return;
    if(rec.closest('header,footer,#t-header,#t-footer,.t706,.t1002,.t-popup'))return;
    if(rec.classList.contains('fp-v3-curator-record')||rec.querySelector('.fp-v3-curator-text'))return;
    var t=norm(rec.innerText||rec.textContent);
    if(!t||t.length>18000)return;
    if(score(t)<3)return;
    rec.setAttribute('data-fp-v21-legacy-curation-hidden','1');
    rec.style.setProperty('display','none','important');
    rec.style.setProperty('visibility','hidden','important');
    rec.style.setProperty('height','0','important');
    rec.style.setProperty('min-height','0','important');
    rec.style.setProperty('max-height','0','important');
    rec.style.setProperty('margin','0','important');
    rec.style.setProperty('padding','0','important');
    rec.style.setProperty('overflow','hidden','important');
    hidden++;
  });
  state.legacyCurationHidden=hidden;pub();return hidden;
}

async function boot(){
  try{
    await load(V20);
    if(!TARGETED){state.ready=true;pub();return}
    var ok=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V20_STATE__;return s&&s.ready===true&&document.querySelector('#'+ROOT+' .v3-shell')},32000);
    state.baseReady=!!ok;pub();if(!ok)throw new Error('V20 pipeline did not become ready');
    hideLegacyCuration();
    [200,700,1600,3200,6000].forEach(function(ms){setTimeout(hideLegacyCuration,ms)});
    state.ready=true;state.error='';pub();
    console.info('[Filin Labs] Master Product V5.21 legacy curation quarantine ready',state);
  }catch(e){state.error=String(e&&e.message||e);pub();console.warn('[Filin V5.21]',state.error,state)}
}
boot();pub();
})();
