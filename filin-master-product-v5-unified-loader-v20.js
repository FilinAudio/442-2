/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V20
   Final cleanup over approved V19 pipeline for the 12 amplifier / preamplifier cards.
   - keeps V19 -> V18 -> V17 -> V16 behavior unchanged
   - canonicalizes curator copy to one line block
   - hides duplicate curator siblings / duplicate curator records
   - suppresses only the harmless early Golden "profile not found" warnings during dynamic-profile bootstrap
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V20__)return;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V20__=true;

var VERSION='5.20.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';
var V19='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@f934cd7f859703e7a98714d4c315151a09bfe857/filin-master-product-v5-unified-loader-v19.js';
var TARGET=[
'gerbera_dual_mono_mosfet_headphone_amplifier','konstantin_audio_un_1_solid_state_headphones_amplifier',
'phenomenon_kgsshv_carbon_electrostatic_headphone_amplifier','sciber_enflow','gerbera_equos',
'audioinstrument_vivo_solid_state_amplifier','eridan_audio_rigel_integrated_amplifier','eridan_audio_quasar_amplifier',
'konstantin_audio_a2_solid_state_amplifier','demograf_neptunum_class_d_amplifier',
'nemesis_solid_state_amplifier_demograf','gerbera_active_tube_preamplifier'
];
var TARGETED=TARGET.indexOf(PATH)>=0;
var state={version:VERSION,slug:PATH,mode:TARGETED?'final-curator-cleanup-over-v19':'delegate-v19',ready:false,baseReady:false,curatorCanonical:false,curatorNodesHidden:0,curatorRecordsHidden:0,suppressedProfileWarnings:0,error:''};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V20_STATE__=JSON.parse(JSON.stringify(state))}
function arr(v){return Array.prototype.slice.call(v||[])}
function str(v){return String(v==null?'':v).trim()}
function norm(v){return str(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim()}
function load(src){return new Promise(function(resolve,reject){var file=src.split('/').pop().split('?')[0],old=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(file)>=0});if(old){resolve(true);return}var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};(document.head||document.documentElement).appendChild(s)})}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test()}catch(e){}if(ok){clearInterval(t);resolve(true)}else if(Date.now()-st>(ms||30000)){clearInterval(t);resolve(false)}},50)})}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null}catch(e){return null}}

var originalWarn=console.warn,warningFilterInstalled=false;
function installWarningFilter(){
  if(!TARGETED||warningFilterInstalled)return;
  warningFilterInstalled=true;
  console.warn=function(){
    var args=arr(arguments),joined=args.map(function(x){try{return typeof x==='string'?x:JSON.stringify(x)}catch(e){return String(x)}}).join(' ');
    if(joined.indexOf('[Master Product V3] profile not found for slug')>=0&&joined.indexOf(PATH)>=0){state.suppressedProfileWarnings++;pub();return}
    return originalWarn.apply(console,args);
  };
}
function restoreWarningFilter(){if(warningFilterInstalled&&console.warn!==originalWarn){console.warn=originalWarn}warningFilterInstalled=false}

function sentenceDedupe(v){
  var text=norm(v);if(!text)return'';
  var parts=text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[text],seen={},out=[];
  parts.forEach(function(x){x=norm(x);if(!x)return;var k=x.toLowerCase().replace(/^handcrafted\s+by\s+/,'').replace(/[^a-z0-9]+/g,' ').trim();if(!k||seen[k])return;seen[k]=1;out.push(x)});
  return norm(out.join(' '));
}
function canonicalCurator(){
  var p=profile(),raw=norm(p&&p.curator||'');if(!raw)return'';
  var hand=raw.match(/Handcrafted\s+by\s+([^.!?]+)[.!?]/i);
  var listened=raw.match(/Personally\s+listened\s*,?\s*approved\s*&\s*curated\s+by\s+([^.!?]+)[.!?]/i);
  var loc=/Filin\s+Labs\s+Kazakhstan/i.test(raw);
  if(hand&&listened){return 'Handcrafted by '+norm(hand[1])+'. Personally listened, approved & curated by '+norm(listened[1])+'.'+(loc?' Filin Labs Kazakhstan.':'')}
  return sentenceDedupe(raw);
}
function isCuratorLike(t,artisan){
  t=norm(t);if(!t)return false;
  if(/Handcrafted\s+by|Personally\s+listened|Filin\s+Labs\s+Kazakhstan/i.test(t))return true;
  return !!(artisan&&t.toLowerCase().indexOf(artisan.toLowerCase())===0&&t.length<500);
}
function fixCurator(){
  var p=profile(),canonical=canonicalCurator();if(!p||!canonical)return false;
  p.curator=canonical;
  var hm=canonical.match(/Handcrafted\s+by\s+([^.!?]+)[.!?]/i),artisan=hm?norm(hm[1]):'';
  var records=arr(document.querySelectorAll('.fp-v3-curator-record'));
  arr(document.querySelectorAll('.fp-v3-curator-text')).forEach(function(n){var r=n.closest('.t-rec,[id^="rec"]');if(r&&records.indexOf(r)<0)records.push(r)});
  if(!records.length){
    arr(document.querySelectorAll('.t-rec,[id^="rec"]')).forEach(function(r){if(isCuratorLike(r.textContent,artisan)&&records.indexOf(r)<0)records.push(r)})
  }
  var kept=null,hiddenNodes=0,hiddenRecords=0;
  records.forEach(function(rec){
    var primary=rec.querySelector('.fp-v3-curator-text')||arr(rec.querySelectorAll('.t051__text,.t-text,.t-descr,p,em,div,span')).filter(function(n){return isCuratorLike(n.textContent,artisan)}).sort(function(a,b){return norm(a.textContent).length-norm(b.textContent).length})[0]||null;
    if(!kept&&primary){kept=rec;primary.textContent=canonical;primary.classList.add('fp-v3-curator-text');primary.style.setProperty('display','block','important');primary.style.setProperty('visibility','visible','important');primary.style.setProperty('opacity','1','important');
      arr(rec.querySelectorAll('.t051__text,.t-text,.t-descr,p,em,div,span')).forEach(function(n){if(n===primary||n.contains(primary)||primary.contains(n))return;var t=norm(n.textContent);if(!isCuratorLike(t,artisan))return;n.style.setProperty('display','none','important');hiddenNodes++});
    }else if(rec!==kept&&isCuratorLike(rec.textContent,artisan)){
      rec.style.setProperty('display','none','important');hiddenRecords++;
    }
  });
  state.curatorCanonical=!!kept;state.curatorNodesHidden=hiddenNodes;state.curatorRecordsHidden=hiddenRecords;pub();return !!kept;
}

async function boot(){
  installWarningFilter();
  try{
    await load(V19);
    if(!TARGETED){state.ready=true;pub();restoreWarningFilter();return}
    var ok=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V19_STATE__;return s&&s.ready===true&&document.querySelector('#'+ROOT+' .v3-shell')&&profile()},30000);
    state.baseReady=!!ok;pub();if(!ok)throw new Error('V19 pipeline did not become ready');
    fixCurator();[250,800,1800,3600].forEach(function(ms){setTimeout(fixCurator,ms)});
    state.ready=true;state.error='';pub();
    restoreWarningFilter();
    console.info('[Filin Labs] Master Product V5.20 final cleanup ready',state);
  }catch(e){state.error=String(e&&e.message||e);pub();restoreWarningFilter();console.warn('[Filin V5.20]',state.error,state)}
}
setTimeout(restoreWarningFilter,32000);
boot();pub();
})();
