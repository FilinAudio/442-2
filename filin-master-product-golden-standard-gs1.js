/* ============================================================
   FILIN LABS — MASTER PRODUCT GOLDEN STANDARD
   Freeze: 2026-08-20 / GS-1
   Scope: all product cards migrated and approved in the current cycle.

   Visual / interaction contract:
   - Golden V3 shell geometry remains authoritative
   - Montserrat typography
   - no duplicate legacy cards / tabs / galleries / Perfect Matches
   - native Golden desktop + mobile tabs
   - native Golden curation block with icons
   - authoritative product galleries; Tilda UI/placeholder art excluded
   - Perfect Matches preserved/restored where applicable
   - immutable commit-pinned dependencies only

   Frozen routing:
   - 19 Golden Reference 2 headphone pages
   - 6 speaker pages
   - 10 tube-amplifier pages
   - 12 amplifier / preamplifier pages
   - 1 Demograf solid-copper connector page
   Total: 48 approved routes

   IMPORTANT:
   This file is an entrypoint/router only. Product-specific data remains
   in the already approved frozen pipelines. Unknown routes are untouched.
   ============================================================ */
(function(){
'use strict';

if(window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_20260820__) return;
window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_20260820__=true;

var VERSION='GS-2026.08.20.1';
var ROOT='filin-master-product-v3';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');

var CDN='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@';
var DEP={
  unified:CDN+'268a16bb8edba20a4fcae2fb0cdf384020071d2d/filin-master-product-v5-unified-loader-v24.js',
  connectors:CDN+'0e7956bb5ff673551dc6271dfdfff9edc1c156fe/filin-master-product-v3-universal-golden-bridge-v7.js'
};

var GROUPS={
  'golden-reference-2':[
    'perun_dark_sound','volga_tone_priboi_1','orvellium_nocturne_aura','flatvox_gbc_dj_hulk',
    'snorry_si_5_mk_2_headphones','snorry_joule_headphones','perun_modern','snorry_si_6_headphones',
    'flatvox_gbc','flatvox_kona','phenomenon_spatium','filin_audio_model_1_standard_v2',
    'filin_audio_model_1_premium_v2','perun_modern_closed','phenomenon_libratum','snorry_nm_2_headphones',
    'filin_audio_limited','filin_audio_quadron','snorry_trion_mk_3'
  ],
  'speakers':[
    'demograf_clio_speakers','perun_junior_hybrid_electrostatic_speakers',
    'perun_elder_electrostatic_speakers','audioinstrument_tower_speakers',
    'audioinstrument_power_speakers','audioinstrument_grand_tower_speakers'
  ],
  'tube-amplifiers':[
    'gerbera_lira_compact_tube_amplifier_ultralinear_se','gerbera_2a3_tube_amplifier',
    'audioinstrument_sirius_kt150_tube_amplifier','audioinstrument_sirius_kt66_push_pull_tube_amplifier',
    'demograf_ajax_tube_amplifier_el_84','gerbera_ha_45_tube_headphone_amplifier_dac',
    'gerbera_ha_15_tube_amp_electrostatic_planar','gerbera_a8045_tube_headphone_amplifier',
    'gerbera_electrostatic_amplifier','gerbera_attento_otl_tube_electrostatic_headphone_amplifier'
  ],
  'amplifiers-preamplifiers':[
    'gerbera_dual_mono_mosfet_headphone_amplifier','konstantin_audio_un_1_solid_state_headphones_amplifier',
    'phenomenon_kgsshv_carbon_electrostatic_headphone_amplifier','sciber_enflow','gerbera_equos',
    'audioinstrument_vivo_solid_state_amplifier','eridan_audio_rigel_integrated_amplifier',
    'eridan_audio_quasar_amplifier','konstantin_audio_a2_solid_state_amplifier',
    'demograf_neptunum_class_d_amplifier','nemesis_solid_state_amplifier_demograf',
    'gerbera_active_tube_preamplifier'
  ],
  'connectors':['demograf_solid_copper_banana_plugs']
};

function groupFor(slug){
  var names=Object.keys(GROUPS);
  for(var i=0;i<names.length;i++) if(GROUPS[names[i]].indexOf(slug)>=0) return names[i];
  return '';
}

var GROUP=groupFor(PATH);
if(!GROUP) return;

var state={
  version:VERSION,
  slug:PATH,
  group:GROUP,
  expectedRoutes:48,
  dependency:'',
  dependencyReady:false,
  rootReady:false,
  ready:false,
  curationItems:0,
  error:''
};

function pub(){
  window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_STATE__=JSON.parse(JSON.stringify(state));
}
function arr(v){return Array.prototype.slice.call(v||[]);}
function load(src){
  return new Promise(function(resolve,reject){
    var file=src.split('/').pop().split('?')[0];
    var old=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(file)>=0;});
    if(old){resolve(true);return;}
    var s=document.createElement('script');
    s.src=src;s.async=false;
    s.onload=function(){resolve(true);};
    s.onerror=function(){reject(new Error('load failed: '+src));};
    (document.head||document.documentElement).appendChild(s);
  });
}
function wait(test,ms){
  return new Promise(function(resolve){
    var st=Date.now(),t=setInterval(function(){
      var ok=false;
      try{ok=!!test();}catch(e){}
      if(ok){clearInterval(t);resolve(true);}
      else if(Date.now()-st>(ms||45000)){clearInterval(t);resolve(false);}
    },60);
  });
}
function rootOK(){
  return !!document.querySelector('#'+ROOT+' .v3-shell');
}
function countCuration(){
  var root=document.getElementById(ROOT);
  return root?root.querySelectorAll('.v3-curation-item').length:0;
}
function installConnectorPreboot(){
  if(document.getElementById('filin-gs-connector-preboot')) return;
  var s=document.createElement('style');
  s.id='filin-gs-connector-preboot';
  s.textContent='html:not(.fp-v7-ready) .t-cover{visibility:hidden!important}';
  (document.head||document.documentElement).appendChild(s);
  document.documentElement.classList.add('fp-v7-boot');
}
function releaseConnector(){
  document.documentElement.classList.add('fp-v7-ready');
}

async function boot(){
  try{
    var ok=false;

    if(GROUP==='connectors'){
      state.dependency='bridge-v7@0e7956b';
      installConnectorPreboot();
      setTimeout(releaseConnector,6500);
      await load(DEP.connectors);
      ok=await wait(function(){return rootOK();},16000);
      if(ok) releaseConnector();
    }else{
      state.dependency='unified-v24@268a16b';
      await load(DEP.unified);
      ok=await wait(function(){return rootOK();},45000);
    }

    state.dependencyReady=!!ok;
    state.rootReady=rootOK();
    state.curationItems=countCuration();
    state.ready=state.dependencyReady&&state.rootReady;

    if(!state.ready) state.error='Golden pipeline did not become ready';
  }catch(e){
    state.error=String(e&&e.message||e);
  }

  pub();

  if(state.error) console.warn('[Filin Labs Golden Standard]',state.error,state);
  else console.info('[Filin Labs Golden Standard] ready',state);
}

if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();

pub();
})();