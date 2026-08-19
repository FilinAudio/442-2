/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 CURATOR CLEANUP V1
   Removes duplicated trailing "Labs Kazakhstan." fragments from
   Golden curator strips on the approved 19 migrated product pages.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V3_CURATOR_CLEANUP_V1__)return;
window.__FILIN_MASTER_PRODUCT_V3_CURATOR_CLEANUP_V1__=true;

var VERSION='1.0.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ALLOWED=[
'perun_dark_sound','volga_tone_priboi_1','orvellium_nocturne_aura','flatvox_gbc_dj_hulk','snorry_si_5_mk_2_headphones','snorry_joule_headphones','perun_modern','snorry_si_6_headphones','flatvox_gbc','flatvox_kona','phenomenon_spatium','filin_audio_model_1_standard_v2','filin_audio_model_1_premium_v2','perun_modern_closed','phenomenon_libratum','snorry_nm_2_headphones','filin_audio_limited','filin_audio_quadron','snorry_trion_mk_3'
];
if(ALLOWED.indexOf(PATH)<0)return;

var state={version:VERSION,slug:PATH,ready:false,fixes:0,lastBefore:'',lastAfter:''};
function pub(){window.__FILIN_MASTER_PRODUCT_V3_CURATOR_CLEANUP_V1_STATE__=JSON.parse(JSON.stringify(state));}
function norm(s){return String(s==null?'':s).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
function clean(s){
  var t=norm(s);
  if(!t)return t;
  t=t.replace(/\bFilin Labs Kazakhstan\.\s*Labs Kazakhstan\.?\s*$/i,'Filin Labs Kazakhstan.');
  t=t.replace(/\bFilin Labs Kazakhstan\.\s*Filin Labs Kazakhstan\.?\s*$/i,'Filin Labs Kazakhstan.');
  t=t.replace(/\bLabs Kazakhstan\.\s*Labs Kazakhstan\.?\s*$/i,'Labs Kazakhstan.');
  var parts=t.split(/(?<=[.!?])\s+/),out=[];
  parts.forEach(function(p){
    var k=norm(p).toLowerCase().replace(/[.!?]+$/,'');
    if(!k)return;
    var prev=out.length?norm(out[out.length-1]).toLowerCase().replace(/[.!?]+$/,''):'';
    if(k===prev)return;
    if(k==='labs kazakhstan'&&prev==='filin labs kazakhstan')return;
    out.push(norm(p));
  });
  return out.join(' ');
}
function candidates(){
  var xs=[];
  document.querySelectorAll('.fp-v3-curator-text,.fp-v3-curator-record .t051__text,.fp-v3-curator-record .t-text,.fp-v3-curator-record p').forEach(function(n){if(xs.indexOf(n)<0)xs.push(n);});
  if(!xs.length){
    document.querySelectorAll('.t051__text,.t-text,p,div,em').forEach(function(n){var t=norm(n.textContent);if(/^Handcrafted by/i.test(t)&&t.length<500&&xs.indexOf(n)<0)xs.push(n);});
  }
  return xs;
}
function apply(){
  var fixed=0;
  candidates().forEach(function(n){
    var before=norm(n.textContent),after=clean(before);
    if(after&&before!==after){n.textContent=after;fixed++;state.lastBefore=before;state.lastAfter=after;}
  });
  state.fixes+=fixed;state.ready=candidates().length>0;pub();return fixed;
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
[80,200,500,1000,2000,4000,8000].forEach(function(ms){setTimeout(apply,ms);});
if(window.MutationObserver){var mo=new MutationObserver(function(){setTimeout(apply,20);});mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true});}
pub();console.info('[Filin Labs] Curator Cleanup V1 loaded',{version:VERSION,slug:PATH});
})();
