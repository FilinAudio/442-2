/* ============================================================
 FILIN LABS — GS2 DEMOGRAF EXPANSION BATCH V2
 2026-08-20
 24 newly migrated routes from the Demograf expansion set.

 Reuses Universal Remaining Batch V1 extraction/media logic,
 but swaps in Required Contract V3 for major components.
 ============================================================ */
(function(){
'use strict';
if(window.__FILIN_GS2_DEMOGRAF_EXPANSION_BATCH_V2__)return;
var VERSION='2.0.0',PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var TARGET=["demograf_orpheus_aer_loudspeakers","demograf_perseus_mkii_supravox_loudspeakers","demograf_perseus_speakers_supravox","demograf_cassandra_mkii_speakers","demograf_cassandra_mki_speakers","demograf_zeus_subwoofers","demograf_helios_mki_811_tube_amp","demograf_helios_mkii_g811_tube_integrated_amplifier","demograf_tantal_senior_amplifier","demograf_argo_tube_amp_el_34","demograf_gu_72_aglaya_tube_amp","demograf_atlas_amplifier_300b","demograf_solaria_45_tube_amp","demograf_3c24_tantal_tube_amp_electrostatic","demograf_eurybia_2a3_tube_amp","demograf_ether_tube_amp_gm_70","demograf_hestia_807_tube_amp_electrostatic","demograf_endymion_805_845_211_tube_amplifier","demograf_hyperion_dac","demograf_prometheus_fpga_dac","high_end_preamplifiers_demograf","demograf_ulanor_pc_streamer","demograf_charon_tube_solid_state_master_clock","demograf_odysseus_tube_phonostage"];
if(TARGET.indexOf(PATH)<0)return;
window.__FILIN_GS2_DEMOGRAF_EXPANSION_BATCH_V2__=true;
var SRC='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@f1f4f401ff2f0efa8184eb3435b60ae29cbfa754/filin-master-product-gs2-universal-remaining-batch-v1.js';
var CONTRACT_V3='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@78294953f48e7f323c19245547da1d7da0650fe0/filin-master-product-v3-required-contract-v3.js';
var state={version:VERSION,slug:PATH,mode:'gs2-demograf-expansion-24',sourceLoaded:false,innerReady:false,curationReady:false,pmReady:false,curatorReady:false,integrityReady:false,contractV3Ready:false,ready:false,error:''};
function pub(){window.__FILIN_GS2_DEMOGRAF_EXPANSION_BATCH_V2_STATE__=JSON.parse(JSON.stringify(state));}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test();}catch(e){}if(ok){clearInterval(t);resolve(true);}else if(Date.now()-st>(ms||95000)){clearInterval(t);resolve(false);}},60);});}
function patch(code){
 var list='var TARGET='+JSON.stringify(TARGET)+';\nif(TARGET.indexOf(PATH)<0)return;';
 code=code.replace(/var TARGET=\[[\s\S]*?\];\nif\(TARGET\.indexOf\(PATH\)<0\)return;/,list);
 code=code.replace(/__FILIN_GS2_UNIVERSAL_REMAINING_BATCH_V1_STATE__/g,'__FILIN_GS2_DEMOGRAF_EXPANSION_INNER_V2_STATE__').replace(/__FILIN_GS2_UNIVERSAL_REMAINING_BATCH_V1__/g,'__FILIN_GS2_DEMOGRAF_EXPANSION_INNER_V2__').replace(/__FILIN_MASTER_PRODUCT_V3_REQUIRED_CONTRACT_V2_STATE__/g,'__FILIN_MASTER_PRODUCT_V3_REQUIRED_CONTRACT_V3_STATE__').replace(/__FILIN_MASTER_PRODUCT_V3_REQUIRED_CONTRACT_V2__/g,'__FILIN_MASTER_PRODUCT_V3_REQUIRED_CONTRACT_V3__');
 code=code.replace(/var CONTRACT='[^']*filin-master-product-v3-required-contract-v2\.js';/,"var CONTRACT='"+CONTRACT_V3+"';");
 code=code.replace(/Required Contract V2/g,'Required Contract V3');
 code=code.replace(/gs2-universal-remaining-batch1/g,'gs2-demograf-expansion-batch2');
 code=code.replace(/Universal Remaining Batch V1/g,'Demograf Expansion Batch V2');
 return code;
}
async function boot(){try{var r=await fetch(SRC,{cache:'force-cache'});if(!r.ok)throw new Error('universal source fetch '+r.status);var s=document.createElement('script');s.setAttribute('data-filin-demograf-expansion-v2','1');s.textContent=patch(await r.text());(document.head||document.documentElement).appendChild(s);state.sourceLoaded=true;pub();state.innerReady=await wait(function(){var x=window.__FILIN_GS2_DEMOGRAF_EXPANSION_INNER_V2_STATE__;return x&&x.slug===PATH&&(x.ready===true||!!x.error);},100000);var x=window.__FILIN_GS2_DEMOGRAF_EXPANSION_INNER_V2_STATE__;if(!x||x.ready!==true)throw new Error('inner batch not ready: '+(x&&x.error||'timeout'));state.curationReady=!!x.curationReady;state.pmReady=!!x.pmReady;state.curatorReady=!!x.curatorReady;state.integrityReady=!!x.integrityReady;var c=window.__FILIN_MASTER_PRODUCT_V3_REQUIRED_CONTRACT_V3_STATE__;state.contractV3Ready=!!(c&&c.slug===PATH&&c.ready===true&&!c.error);state.ready=state.innerReady&&state.curationReady&&state.pmReady&&state.curatorReady&&state.integrityReady&&state.contractV3Ready;if(!state.ready)throw new Error('Demograf expansion strict contract failed');state.error='';}catch(e){state.error=String(e&&e.message||e);state.ready=false;}pub();if(state.error)console.warn('[Filin Labs GS2 Demograf Expansion Batch V2]',state.error,state);else console.info('[Filin Labs GS2 Demograf Expansion Batch V2] ready',state);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();pub();
})();