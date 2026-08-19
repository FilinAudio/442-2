/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 CURATOR OVERRIDES V1
   Explicit approved curator text overrides for migrated Golden pages.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V3_CURATOR_OVERRIDES_V1__)return;
window.__FILIN_MASTER_PRODUCT_V3_CURATOR_OVERRIDES_V1__=true;

var VERSION='1.0.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var OVERRIDES={
  filin_audio_limited:'Handcrafted by Sergey Glazyrin. Personally listened, approved & curated by M. Piskarev. Filin Labs Kazakhstan.'
};
var TEXT=OVERRIDES[PATH];
if(!TEXT)return;

var state={version:VERSION,slug:PATH,ready:false,fixes:0,text:TEXT,lastError:''};
function pub(){window.__FILIN_MASTER_PRODUCT_V3_CURATOR_OVERRIDES_V1_STATE__=JSON.parse(JSON.stringify(state));}
function norm(s){return String(s==null?'':s).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
function candidate(){
  var n=document.querySelector('.fp-v3-curator-text');
  if(n)return n;
  var rec=document.querySelector('.fp-v3-curator-record');
  if(!rec)return null;
  var xs=Array.prototype.slice.call(rec.querySelectorAll('.t051__text,.t-text,.t-descr,p,em,div')).filter(function(x){
    var t=norm(x.textContent);return t&&t.length<1400&&(/Handcrafted by|Personally listened|Filin Labs Kazakhstan/i.test(t));
  });
  xs.sort(function(a,b){return norm(a.textContent).length-norm(b.textContent).length;});
  return xs[0]||null;
}
function patchProfile(){
  try{
    var api=window.FilinMasterProductV3,p=api&&api.profiles&&api.profiles[PATH];
    if(p&&p.curator!==TEXT)p.curator=TEXT;
  }catch(e){state.lastError=String(e&&e.message||e);}
}
function apply(){
  patchProfile();
  var n=candidate();
  if(!n){state.ready=false;pub();return false;}
  if(norm(n.textContent)!==TEXT){n.textContent=TEXT;state.fixes++;}
  n.classList.add('fp-v3-curator-text');
  n.style.setProperty('color','#ffffff','important');
  n.style.setProperty('visibility','visible','important');
  n.style.setProperty('opacity','1','important');
  var rec=n.closest('.t-rec,[id^="rec"]');
  if(rec){rec.classList.add('fp-v3-curator-record');rec.style.setProperty('background-color','#000000','important');}
  state.ready=true;pub();return true;
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
[60,160,350,700,1300,2500,5000,9000].forEach(function(ms){setTimeout(apply,ms);});
if(window.MutationObserver){
  var timer=null,mo=new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(apply,25);});
  mo.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
}
pub();console.info('[Filin Labs] Curator Overrides V1 loaded',{version:VERSION,slug:PATH});
})();
