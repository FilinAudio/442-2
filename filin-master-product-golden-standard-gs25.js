/* ============================================================
   FILIN LABS — MASTER PRODUCT GOLDEN STANDARD GS2.5
   2026-08-20 / Universal Remaining Batch

   Existing approved routes delegate to frozen GS2.4 unchanged.
   35 remaining routes use Universal Remaining Batch V1:
   source extraction -> profile/root -> sanity -> Required Contract V2
   -> Gallery Integrity V3 -> strict final contract PASS.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS25__)return;
window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS25__=true;
var VERSION='GS-2026.08.20.2.5',PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var TARGET=[
'demograf_custom_loudspeakers_grilles','demograf_custom_speaker_enclosures_horns_cabinet','demograf_audio_custom_transformers_chokes','sciber_encore_universal_linear_power_supply','gerbera_solero_network_switch_tube_clock','gerbera_routing_switch','gerbera_ac_mains_harmonizer_noise_filter','demograf_cassiopeia_amt_ribbon_hf_supertweeters','demograf_tempestus','twinmono_tzar_dst_neumann_dst','demograf_solid_copper_banana_plugs','art_air_acoustic_speaker_cables','konstantin_audio_a_1_synergy_speaker_cables','demograf_andromeda_speaker_cable','art_air_xlr_balanced_cables','art_air_rca_phono_spdif_cables','konstantin_audio_rca_xlr_cables','demograf_pollux_interconnect_cable','konstantin_audio_ka_1_fatboy_headphones_cable','filin_audio_purity_headphones_cable','german_magistro_headphone_cables','demograf_anthea_rarecorefusion_headphones_cable','art_air_power_cables','konstantin_audio_ac_power_cables','demograf_icarus_ac_power_cable','art_air_digital_cables','demograf_asteria_digital_cable','demograf_binding_posts','gerbera_bouree_tube_phonostage_mm_mc','brave_beetle_talisman_tube_phonostages','ulixes_solid_state_demograf_phonostage','gerbera_tube_master_clock','gerbera_tinker_audiophile_network_player_streamer_server_endpoint','audioinstrument_axle_pc_streamer','remote_acoustic_room_treatment_measurements_diffart'
];
var LEGACY='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@3f5a57997b49ae917a4ccaa71f8e01da78ffb3eb/filin-master-product-golden-standard-gs24.js';
var BATCH='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@f1f4f401ff2f0efa8184eb3435b60ae29cbfa754/filin-master-product-gs2-universal-remaining-batch-v1.js';
var isNew=TARGET.indexOf(PATH)>=0;
var state={version:VERSION,slug:PATH,group:isNew?'universal-remaining-35':'gs24-existing',batchLoaded:false,batchReady:false,curationReady:false,pmReady:false,curatorReady:false,integrityReady:false,ready:false,error:''};
function pub(){window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS25_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[]);}
function load(src,test){return new Promise(function(resolve,reject){if(test&&test())return resolve(true);var f=src.split('/').pop().split('?')[0],old=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(f)>=0;});if(old){var n=0,t=setInterval(function(){if(!test||test()){clearInterval(t);resolve(true);}else if(++n>1200){clearInterval(t);resolve(false);}},50);return;}var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('load failed: '+src));};(document.head||document.documentElement).appendChild(s);});}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test();}catch(e){}if(ok){clearInterval(t);resolve(true);}else if(Date.now()-st>(ms||65000)){clearInterval(t);resolve(false);}},60);});}
async function boot(){try{if(!isNew){await load(LEGACY,function(){return!!window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS24__;});await wait(function(){var x=window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS24_STATE__;return x&&x.slug===PATH&&(x.ready===true||!!x.error);},65000);var o=window.__FILIN_MASTER_PRODUCT_GOLDEN_STANDARD_GS24_STATE__;if(o&&o.slug===PATH){state.ready=!!o.ready;state.error=o.error||'';}pub();return;}await load(BATCH,function(){return!!window.__FILIN_GS2_UNIVERSAL_REMAINING_BATCH_V1__;});state.batchLoaded=true;pub();state.batchReady=await wait(function(){var x=window.__FILIN_GS2_UNIVERSAL_REMAINING_BATCH_V1_STATE__;return x&&x.slug===PATH&&(x.ready===true||!!x.error);},90000);var b=window.__FILIN_GS2_UNIVERSAL_REMAINING_BATCH_V1_STATE__;if(!b||b.ready!==true)throw new Error('Universal Remaining Batch not ready: '+(b&&b.error||'timeout'));state.curationReady=!!b.curationReady;state.pmReady=!!b.pmReady;state.curatorReady=!!b.curatorReady;state.integrityReady=!!b.integrityReady;state.ready=state.batchReady&&state.curationReady&&state.pmReady&&state.curatorReady&&state.integrityReady;if(!state.ready)throw new Error('GS2.5 strict contract failed');state.error='';}catch(e){state.error=String(e&&e.message||e);state.ready=false;}pub();if(state.error)console.warn('[Filin Labs Golden Standard GS2.5]',state.error,state);else if(state.ready)console.info('[Filin Labs Golden Standard GS2.5] ready',state);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();pub();
})();