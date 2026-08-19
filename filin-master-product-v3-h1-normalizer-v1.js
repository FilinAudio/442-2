/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 H1 NORMALIZER V1
   Restores spaces/line boundaries lost when legacy Tilda H1 markup
   is captured with textContent during Golden migration.
   Applies only to the approved 19 migrated product pages.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V3_H1_NORMALIZER_V1__)return;
window.__FILIN_MASTER_PRODUCT_V3_H1_NORMALIZER_V1__=true;

var VERSION='1.0.0';
var ROOT_ID='filin-master-product-v3';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ALLOWED=[
'perun_dark_sound','volga_tone_priboi_1','orvellium_nocturne_aura','flatvox_gbc_dj_hulk','snorry_si_5_mk_2_headphones','snorry_joule_headphones','perun_modern','snorry_si_6_headphones','flatvox_gbc','flatvox_kona','phenomenon_spatium','filin_audio_model_1_standard_v2','filin_audio_model_1_premium_v2','perun_modern_closed','phenomenon_libratum','snorry_nm_2_headphones','filin_audio_limited','filin_audio_quadron','snorry_trion_mk_3'
];
if(ALLOWED.indexOf(PATH)<0)return;

var state={version:VERSION,slug:PATH,ready:false,fixes:0,source:'',before:'',after:'',lastError:''};
function pub(){window.__FILIN_MASTER_PRODUCT_V3_H1_NORMALIZER_V1_STATE__=JSON.parse(JSON.stringify(state));}
function norm(v){return String(v==null?'':v).replace(/\u00a0/g,' ').replace(/[\t\r\n]+/g,' ').replace(/\s+/g,' ').trim();}

function sourceH1(){
  var xs=Array.prototype.slice.call(document.querySelectorAll('.t-cover h1,.t-cover .t-title,h1.t-title'))
    .filter(function(n){return !n.closest('#'+ROOT_ID);});
  for(var i=0;i<xs.length;i++){
    var n=xs[i],t='';
    try{t=norm(n.innerText);}catch(e){}
    if(!t)t=norm(n.textContent);
    if(t&&t.length>4&&t.length<260)return t;
  }
  return'';
}

function conservativeRepair(t){
  t=norm(t);
  if(!t)return t;
  // Fix clear block-boundary joins such as HeadphonesPRE-ORDERS!,
  // while leaving model tokens (R2R, MK-II, SI-6, NM-2) untouched.
  t=t.replace(/([a-z][a-z0-9)\]])([A-Z]{2,}(?:[-–—][A-Z0-9]+)?[!?:;,.]?)/g,'$1 $2');
  t=t.replace(/([.!?])([A-Z][a-z])/g,'$1 $2');
  return norm(t);
}

function target(){
  var root=document.getElementById(ROOT_ID);if(!root)return null;
  var hs=Array.prototype.slice.call(root.querySelectorAll('h1'));
  if(hs.length)return hs[0];
  return root.querySelector('.v3-hero-title,.fp-v3-hero-title,.t-title');
}

function patchProfile(text){
  try{
    var api=window.FilinMasterProductV3,p=api&&api.profiles&&api.profiles[PATH];
    if(p&&p.hero&&text&&p.hero.staticH1!==text)p.hero.staticH1=text;
  }catch(e){state.lastError=String(e&&e.message||e);}
}

function apply(){
  var n=target();
  if(!n){state.ready=false;pub();return false;}
  var before=norm(n.textContent);
  var src=sourceH1();
  var desired=src||conservativeRepair(before);
  if(src){
    // If the source itself was already concatenated, apply only the conservative repair.
    desired=conservativeRepair(src);
  }
  if(!desired){state.ready=false;pub();return false;}
  patchProfile(desired);
  if(before!==desired){n.textContent=desired;state.fixes++;}
  state.source=src?'legacy-innerText':'golden-fallback';
  state.before=before;state.after=desired;state.ready=true;pub();return true;
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
[40,100,220,500,1000,2000,4000,8000].forEach(function(ms){setTimeout(apply,ms);});
if(window.MutationObserver){
  var timer=null,mo=new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(apply,20);});
  mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
}
pub();
console.info('[Filin Labs] H1 Normalizer V1 loaded',{version:VERSION,slug:PATH});
})();
