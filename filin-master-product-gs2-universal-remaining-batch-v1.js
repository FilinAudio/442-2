/* ============================================================
   FILIN LABS — GS2 UNIVERSAL REMAINING BATCH V1
   2026-08-20
   35 remaining product/service routes.

   Reuses the proven DAC Batch V1 extractor/media pipeline, but:
   - patches canonical #product-data.slug before Golden loads
   - expands target routing to this batch
   - removes DAC-only fallback labels
   - applies overview sanity inline
   - applies category-aware Required Contract V2
   - applies Gallery Integrity V3 last
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_GS2_UNIVERSAL_REMAINING_BATCH_V1__)return;
var VERSION='1.0.0',PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,''),ROOT='filin-master-product-v3';
var TARGET=[
'demograf_custom_loudspeakers_grilles','demograf_custom_speaker_enclosures_horns_cabinet','demograf_audio_custom_transformers_chokes','sciber_encore_universal_linear_power_supply','gerbera_solero_network_switch_tube_clock','gerbera_routing_switch','gerbera_ac_mains_harmonizer_noise_filter','demograf_cassiopeia_amt_ribbon_hf_supertweeters','demograf_tempestus','twinmono_tzar_dst_neumann_dst','demograf_solid_copper_banana_plugs','art_air_acoustic_speaker_cables','konstantin_audio_a_1_synergy_speaker_cables','demograf_andromeda_speaker_cable','art_air_xlr_balanced_cables','art_air_rca_phono_spdif_cables','konstantin_audio_rca_xlr_cables','demograf_pollux_interconnect_cable','konstantin_audio_ka_1_fatboy_headphones_cable','filin_audio_purity_headphones_cable','german_magistro_headphone_cables','demograf_anthea_rarecorefusion_headphones_cable','art_air_power_cables','konstantin_audio_ac_power_cables','demograf_icarus_ac_power_cable','art_air_digital_cables','demograf_asteria_digital_cable','demograf_binding_posts','gerbera_bouree_tube_phonostage_mm_mc','brave_beetle_talisman_tube_phonostages','ulixes_solid_state_demograf_phonostage','gerbera_tube_master_clock','gerbera_tinker_audiophile_network_player_streamer_server_endpoint','audioinstrument_axle_pc_streamer','remote_acoustic_room_treatment_measurements_diffart'
];
if(TARGET.indexOf(PATH)<0)return;
window.__FILIN_GS2_UNIVERSAL_REMAINING_BATCH_V1__=true;
window.__FILIN_MASTER_PRODUCT_V3_GALLERY_THUMB_HEALTH_V1__=true;
var SRC='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@f0975d1ea2b5f5bf42c93443b2ca15dab6ac68a6/filin-master-product-gs2-dac-batch-v1.js';
var CONTRACT='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@002558b783fb6b13d5a0c797eee274a7f64fbbfb/filin-master-product-v3-required-contract-v2.js';
var INTEGRITY='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@b93b229ee35e8345e9cfc8e86b0ed01900d474a5/filin-master-product-v3-gallery-integrity-v3.js';
var state={version:VERSION,slug:PATH,mode:'gs2-universal-remaining-batch1',productDataReady:false,sourceLoaded:false,batchReady:false,sanityReady:false,contractLoaded:false,contractReady:false,curationReady:false,pmReady:false,curatorReady:false,integrityLoaded:false,integrityReady:false,ready:false,error:''};
function pub(){window.__FILIN_GS2_UNIVERSAL_REMAINING_BATCH_V1_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[]);}
function norm(v){return String(v==null?'':v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
function key(v){return norm(v).toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test();}catch(e){}if(ok){clearInterval(t);resolve(true);}else if(Date.now()-st>(ms||60000)){clearInterval(t);resolve(false);}},60);});}
function load(src,test){return new Promise(function(resolve,reject){if(test&&test())return resolve(true);var f=src.split('/').pop().split('?')[0],old=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(f)>=0;});if(old){wait(function(){return !test||test();},30000).then(resolve);return;}var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('load failed: '+src));};(document.head||document.documentElement).appendChild(s);});}
function ensureSeed(){var n=document.getElementById('product-data'),o={};if(n){try{o=JSON.parse(n.textContent||'{}')||{};}catch(e){} }else{n=document.createElement('script');n.type='application/json';n.id='product-data';(document.head||document.documentElement).appendChild(n);}o.slug=PATH;n.textContent=JSON.stringify(o);state.productDataReady=true;pub();}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null;}catch(e){return null;}}
function rootReady(){return!!document.querySelector('#'+ROOT+' .v3-shell');}
function patchSource(code){
 var list='var TARGET='+JSON.stringify(TARGET)+';\nif(TARGET.indexOf(PATH)<0)return;';
 code=code.replace(/var TARGET=\[[\s\S]*?\];\nif\(TARGET\.indexOf\(PATH\)<0\)return;/,list);
 code=code.replace(/__FILIN_GS2_DAC_BATCH1_STATE__/g,'__FILIN_GS2_UNIVERSAL_BATCH1_INNER_STATE__').replace(/__FILIN_GS2_DAC_BATCH1__/g,'__FILIN_GS2_UNIVERSAL_BATCH1_INNER__');
 code=code.replace(/gs2-dac-dacamp-batch1/g,'gs2-universal-remaining-batch1');
 code=code.replace(/GS2 DAC Batch 1/g,'GS2 Universal Remaining Batch 1').replace(/GS2\] DAC Batch 1/g,'GS2] Universal Remaining Batch 1');
 code=code.replace(/function fallbackCuration\(rich\)\{[\s\S]*?\n\}\nasync function buildGallery/,"function fallbackCuration(rich){if(!rich)return[];var cat=(rich.categories&&rich.categories[0])||'High-End Audio',specs=Array.isArray(rich.specRows)?rich.specRows:[],base=String(cat).replace(/[^a-z0-9]+/ig,''),tags=['#'+String(rich.brand||'FilinLabs').replace(/\\s+/g,''),'#'+base];specs.slice(1,7).forEach(function(r){tags.push('#'+String(r[0]||'').replace(/[^a-z0-9]+/ig,''));});return[{title:'Category & Budget Tier',html:esc(cat+(rich.price?(' · $'+rich.price):''))},{title:'Tags & Features',html:esc(tags.join(' '))}];}\nasync function buildGallery");
 code=code.replace("category:(rich&&rich.categories&&rich.categories[0])||'dacs'","category:(rich&&rich.categories&&rich.categories[0])||'high-end-audio'");
 code=code.replace(/version:'gs2-dac-batch1'/g,"version:'gs2-universal-remaining-batch1'");
 return code;
}
async function runSource(){var r=await fetch(SRC,{cache:'force-cache'});if(!r.ok)throw new Error('source batch fetch '+r.status);var code=patchSource(await r.text()),s=document.createElement('script');s.setAttribute('data-filin-universal-source','1');s.textContent=code;(document.head||document.documentElement).appendChild(s);state.sourceLoaded=true;pub();var ok=await wait(function(){var x=window.__FILIN_GS2_UNIVERSAL_BATCH1_INNER_STATE__;return x&&x.slug===PATH&&(x.ready===true||!!x.error);},60000),x=window.__FILIN_GS2_UNIVERSAL_BATCH1_INNER_STATE__;state.batchReady=!!(ok&&x&&x.ready===true);if(!state.batchReady)throw new Error('universal source batch did not become ready: '+(x&&x.error||'timeout'));}
function sameTitle(a,b){var A=key(a),B=key(b);if(!A||!B)return false;if(A===B)return true;if(A.length>16&&B.length>16&&(A.indexOf(B)>=0||B.indexOf(A)>=0))return true;var aa=A.split(' ').filter(function(x){return x.length>2;}),bb=B.split(' ').filter(function(x){return x.length>2;}),sm=aa.length<=bb.length?aa:bb,bg=aa.length<=bb.length?bb:aa,hit=0;sm.forEach(function(t){if(bg.indexOf(t)>=0)hit++;});return sm.length>=3&&hit/sm.length>=.86;}
function sanity(){var p=profile();if(!p||!p.overview)return false;var b=document.createElement('div');b.innerHTML=String(p.overview.html||'');var title=norm(p.overview.title||(p.commerce&&p.commerce.displayName)||''),changed=false,prev='';arr(b.children).forEach(function(n){if(/^(H1|H2|H3|H4)$/i.test(n.tagName||'')&&sameTitle(n.textContent,title)){n.remove();changed=true;}});arr(b.children).forEach(function(n){var k=key(n.textContent||'');if(k&&k===prev){n.remove();changed=true;return;}if(k)prev=k;});if(changed){p.overview.html=b.innerHTML;window.FilinMasterProductV3.apply();}state.sanityReady=true;pub();return changed;}
function contractChecks(){var p=profile(),cur=p&&Array.isArray(p.curation)?p.curation.length:0;state.curationReady=cur===7;state.pmReady=!!document.querySelector('#'+ROOT+' .v3-pm');state.curatorReady=!!arr(document.querySelectorAll('.fp-v3-curator-record')).find(function(x){var cs=getComputedStyle(x),r=x.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&r.height>20;});}
async function boot(){try{ensureSeed();await runSource();if(!profile()||!rootReady())throw new Error('Golden profile/root missing after universal batch');sanity();await load(CONTRACT,function(){return!!window.__FILIN_MASTER_PRODUCT_V3_REQUIRED_CONTRACT_V2__;});state.contractLoaded=true;pub();state.contractReady=await wait(function(){var x=window.__FILIN_MASTER_PRODUCT_V3_REQUIRED_CONTRACT_V2_STATE__;return x&&x.slug===PATH&&(x.ready===true||!!x.error);},30000);var c=window.__FILIN_MASTER_PRODUCT_V3_REQUIRED_CONTRACT_V2_STATE__;if(!c||c.ready!==true)throw new Error('Required Contract V2 not ready: '+(c&&c.error||'timeout'));contractChecks();if(!state.curationReady||!state.pmReady||!state.curatorReady)throw new Error('required visual contract incomplete');await load(INTEGRITY,function(){return!!window.__FILIN_MASTER_PRODUCT_V3_GALLERY_INTEGRITY_V3__;});state.integrityLoaded=true;pub();state.integrityReady=await wait(function(){var x=window.__FILIN_MASTER_PRODUCT_V3_GALLERY_INTEGRITY_V3_STATE__;return x&&x.slug===PATH&&x.ready===true&&!x.lastError;},50000);if(!state.integrityReady)throw new Error('Gallery Integrity V3 not ready');contractChecks();state.ready=state.curationReady&&state.pmReady&&state.curatorReady&&state.integrityReady;state.error=state.ready?'':'final contract check failed';}catch(e){state.error=String(e&&e.message||e);state.ready=false;}pub();if(state.error)console.warn('[Filin Labs GS2 Universal Remaining Batch V1]',state.error,state);else console.info('[Filin Labs GS2 Universal Remaining Batch V1] ready',state);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();pub();
})();