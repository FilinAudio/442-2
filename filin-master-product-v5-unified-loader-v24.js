/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V24
   Golden curation fallback for Demograf Nemesis + Neptunum.
   Base: approved V23 pipeline.
   - leaves all other pages unchanged
   - injects missing native Golden .v3-curation-wrap only when absent
   - uses existing Golden classes so desktop/mobile geometry and icons match the production contract
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V24__)return;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V24__=true;

var VERSION='5.24.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';
var V23='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@f2784558f4a1e4cbaa7304f4341e4bad88754074/filin-master-product-v5-unified-loader-v23.js';
var TARGET=['nemesis_solid_state_amplifier_demograf','demograf_neptunum_class_d_amplifier'];
var TARGETED=TARGET.indexOf(PATH)>=0;
var state={version:VERSION,slug:PATH,mode:TARGETED?'demograf-curation-fallback-over-v23':'delegate-v23',ready:false,baseReady:false,curationPresent:false,curationInjected:false,items:0,error:''};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V24_STATE__=JSON.parse(JSON.stringify(state))}
function arr(v){return Array.prototype.slice.call(v||[])}
function str(v){return String(v==null?'':v).trim()}
function esc(v){return str(v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function load(src){return new Promise(function(resolve,reject){var f=src.split('/').pop().split('?')[0],old=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(f)>=0});if(old){resolve(true);return}var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};(document.head||document.documentElement).appendChild(s)})}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test()}catch(e){}if(ok){clearInterval(t);resolve(true)}else if(Date.now()-st>(ms||36000)){clearInterval(t);resolve(false)}},60)})}

var DATA={
  demograf_neptunum_class_d_amplifier:[
    {title:'Category & Budget Tier',html:'Solid-State / Hybrid Amplifier · Reference Power Tier ($3,000)'},
    {title:'Tags & Features',html:'#Demograf Audio #Neptunum #Class D #Hybrid tube-stage option #50–1000W speaker power #5–50W headphone power #RareCoreFusion #RCA #XLR option'},
    {title:'Sonic Signature',html:'HIGH-HEADROOM / STUDIO-ORIENTED — powerful, scalable presentation with broad load flexibility; final voicing depends on the selected build configuration.'},
    {title:'High Technologies',html:'Class D solid-state topology with optional hybrid tube stage, proprietary RareCoreFusion internal wiring, configurable 4/8/16Ω speaker loading, and multi-format headphone outputs.'},
    {title:'Curator’s Choice',html:'Selected for systems that need one bespoke amplifier platform to cover demanding headphones and loudspeakers with unusually wide power scalability.'},
    {title:'Synergy Match',html:'Dynamic & planar headphones · demanding loudspeakers · high-resolution DACs · Demograf interconnect, speaker and power cabling'},
    {title:'Genres Accord',html:'All-Rounder · Large-Scale / Dynamic Music'}
  ],
  nemesis_solid_state_amplifier_demograf:[
    {title:'Category & Budget Tier',html:'Class AB Solid-State Amplifier · Reference Custom Tier ($4,000)'},
    {title:'Tags & Features',html:'#Demograf Audio #Nemesis #Class AB #Toshiba bipolar transistors #25W+ per channel #ALPS #Custom Attenuator option #RareCoreFusion #RCA #XLR option #Headphones & Speakers'},
    {title:'Sonic Signature',html:'CONTROLLED / DYNAMIC — classic Class AB architecture with a premium Toshiba bipolar output stage; final voicing can be tailored through the bespoke build.'},
    {title:'High Technologies',html:'Premium Toshiba bipolar transistors, proprietary RareCoreFusion internal wiring, optional custom stepped attenuator, Ground Lift, configurable speaker impedance and extensive headphone-output options.'},
    {title:'Curator’s Choice',html:'Selected as a flexible bespoke platform for audiophiles who want one amplifier for both loudspeakers and multiple headphone formats.'},
    {title:'Synergy Match',html:'Dynamic & planar headphones · optional electrostatic output configuration · 8Ω loudspeakers · Demograf DACs and reference cabling'},
    {title:'Genres Accord',html:'All-Rounder · Rock / Electronic / Orchestral'}
  ]
};

function icon(i){
  var icons=[
    '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="1.4"/><path d="M9 8.5h6M9 12h6M9 15.5h4" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none"><rect x="5" y="4" width="14" height="16" rx="2" stroke="currentColor" stroke-width="1.4"/><path d="M8 8h8M8 12h5M8 16h7" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none"><path d="M5 15V9M9 18V6M13 14V10M17 20V4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4 20h16" stroke="currentColor" stroke-width="1.3"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M18.4 5.6l-2.1 2.1M7.7 16.3l-2.1 2.1" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M6 20c.8-4 2.8-6 6-6s5.2 2 6 6" stroke="currentColor" stroke-width="1.4"/><path d="M18.5 7.5l1 1 2-2" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none"><path d="M7 17l10-10M6 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM18 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z" stroke="currentColor" stroke-width="1.4"/><path d="M8 6h5M11 18h5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
    '<svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="7" r="3" stroke="currentColor" stroke-width="1.4"/><path d="M5.5 20c.6-4.2 2.8-6.3 6.5-6.3s5.9 2.1 6.5 6.3" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M4 8.5v5M2.5 10h3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>'
  ];
  return icons[i%icons.length];
}
function markup(items){return '<section class="v3-curation-wrap" data-fp-v24-curation="1"><div class="v3-curation">'+items.map(function(x,i){return '<article class="v3-curation-item"><div class="v3-curation-icon" aria-hidden="true">'+icon(i)+'</div><div><h3>'+esc(x.title)+'</h3><p>'+esc(x.html)+'</p></div></article>'}).join('')+'</div></section>'}
function inject(){
  var root=document.getElementById(ROOT);if(!root)return false;
  var existing=root.querySelector('.v3-curation-wrap');
  if(existing){state.curationPresent=true;state.items=existing.querySelectorAll('.v3-curation-item').length;pub();return true}
  var items=DATA[PATH]||[];if(!items.length)return false;
  var box=document.createElement('div');box.innerHTML=markup(items);var section=box.firstElementChild;
  var promo=root.querySelector('.v3-promotions');
  if(promo&&promo.parentNode)promo.parentNode.insertBefore(section,promo);else{
    var shell=root.querySelector('.v3-shell')||root;shell.appendChild(section);
  }
  try{var p=window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH];if(p)p.curation=items.map(function(x){return{title:x.title,html:esc(x.html)}})}catch(e){}
  state.curationPresent=true;state.curationInjected=true;state.items=items.length;pub();return true;
}
async function boot(){
  try{
    await load(V23);
    if(!TARGETED){state.ready=true;pub();return}
    var ok=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V23_STATE__;return s&&s.ready===true&&document.querySelector('#'+ROOT+' .v3-shell')},36000);
    state.baseReady=!!ok;pub();if(!ok)throw new Error('V23 pipeline did not become ready');
    inject();[300,900,1800,3600].forEach(function(ms){setTimeout(inject,ms)});
    state.ready=true;state.error='';pub();console.info('[Filin Labs] Master Product V5.24 Demograf curation fallback ready',state);
  }catch(e){state.error=String(e&&e.message||e);pub();console.warn('[Filin V5.24]',state.error,state)}
}
boot();pub();
})();