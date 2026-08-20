/* ============================================================
   FILIN LABS — GS2 DAC PROFILE SANITY V1
   2026-08-20

   Runs only after DAC Batch 1.1 is ready.
   Purpose:
   - remove duplicate overview title/headings extracted from legacy Tilda
   - remove adjacent exact duplicate overview nodes
   - keep the canonical overview.title as the single visible H2
   - re-apply Golden once only when profile content was changed
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_GS2_DAC_PROFILE_SANITY_V1__)return;

var VERSION='1.0.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';
var TARGET=[
'demograf_tube_dacs_multibit','gerbera_multibit_dac','gerbera_onda',
'audioinstrument_dac_di_200_accuracy','gerbera_pcm1794_dsd1794_dac_otis',
'eridan_antares_r2r_dac','gerbera_tv_lpf_dac',
'demograf_bellerophon_dac_solid_state_amplifier','gerbera_grigio',
'gerbera_sound_emotion','gerbera_squire','gerbera_sound_onda_ha',
'demograf_hades_hybrid_class_d_amplifier_dac'
];
if(TARGET.indexOf(PATH)<0)return;
window.__FILIN_GS2_DAC_PROFILE_SANITY_V1__=true;

var state={version:VERSION,slug:PATH,profileFound:false,overviewPatched:false,removedTitleNodes:0,removedDuplicateNodes:0,reapplied:false,rootReady:false,ready:false,error:''};
function pub(){window.__FILIN_GS2_DAC_PROFILE_SANITY_V1_STATE__=JSON.parse(JSON.stringify(state));}
function norm(v){return String(v==null?'':v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
function key(v){return norm(v).toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();}
function tokens(v){return key(v).split(' ').filter(function(x){return x.length>2;});}
function sameTitle(a,b){
 var A=key(a),B=key(b);if(!A||!B)return false;if(A===B)return true;
 if(A.length>16&&B.length>16&&(A.indexOf(B)>=0||B.indexOf(A)>=0))return true;
 var ta=tokens(A),tb=tokens(B);if(!ta.length||!tb.length)return false;
 var small=ta.length<=tb.length?ta:tb,big=ta.length<=tb.length?tb:ta,hit=0;
 small.forEach(function(t){if(big.indexOf(t)>=0)hit++;});
 return small.length>=3&&hit/small.length>=0.86;
}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test();}catch(e){}if(ok){clearInterval(t);resolve(true);}else if(Date.now()-st>(ms||20000)){clearInterval(t);resolve(false);}},60);});}
function getProfile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null;}catch(e){return null;}}
function sanitize(profile){
 if(!profile||!profile.overview)return false;
 var html=String(profile.overview.html||''),box=document.createElement('div');box.innerHTML=html;
 var title=norm(profile.overview.title||(profile.commerce&&profile.commerce.displayName)||'');
 var removedTitle=0,removedDup=0;
 var kids=Array.prototype.slice.call(box.children||[]);
 kids.forEach(function(n){
   if(!n||!/^(H1|H2|H3|H4)$/i.test(n.tagName||''))return;
   if(sameTitle(n.textContent,title)){n.remove();removedTitle++;}
 });
 var prev='';
 Array.prototype.slice.call(box.children||[]).forEach(function(n){
   var k=key(n.textContent||'');
   if(k&&k===prev){n.remove();removedDup++;return;}
   if(k)prev=k;
 });
 var next=box.innerHTML;
 state.removedTitleNodes=removedTitle;
 state.removedDuplicateNodes=removedDup;
 if(next!==html){profile.overview.html=next;state.overviewPatched=true;return true;}
 return false;
}
async function boot(){
 try{
   var got=await wait(function(){return !!getProfile();},18000);if(!got)throw new Error('DAC Golden profile not found');
   var p=getProfile();state.profileFound=true;
   var changed=sanitize(p);pub();
   if(changed&&window.FilinMasterProductV3&&typeof window.FilinMasterProductV3.apply==='function'){
     window.FilinMasterProductV3.apply();state.reapplied=true;
   }
   state.rootReady=await wait(function(){return !!document.querySelector('#'+ROOT+' .v3-shell');},15000);
   if(!state.rootReady)throw new Error('Golden root missing after profile sanity pass');
   state.ready=true;state.error='';
 }catch(e){state.error=String(e&&e.message||e);state.ready=false;}
 pub();
 if(state.error)console.warn('[Filin Labs GS2 DAC Profile Sanity V1]',state.error,state);
 else console.info('[Filin Labs GS2 DAC Profile Sanity V1] ready',state);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
pub();
})();