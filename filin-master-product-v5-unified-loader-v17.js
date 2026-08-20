/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V17
   Production parity layer for the next 12 amplifier / preamplifier cards.
   Base migration: V16 GL01 Golden batch.
   Adds the remaining tube-amp production parity:
   - unified option styling inside Golden tabs
   - option data-price support after Tilda source quarantine
   - combines normal options + Perfect Matches 5% commerce
   - keeps V16/V15 page routing isolated
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V17__)return;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V17__=true;

var VERSION='5.17.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';
var V16='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@334727053f13e84d6bb6a214a5f927d85e8c3214/filin-master-product-v5-unified-loader-v16.js';
var TARGET=[
'gerbera_dual_mono_mosfet_headphone_amplifier','konstantin_audio_un_1_solid_state_headphones_amplifier',
'phenomenon_kgsshv_carbon_electrostatic_headphone_amplifier','sciber_enflow','gerbera_equos',
'audioinstrument_vivo_solid_state_amplifier','eridan_audio_rigel_integrated_amplifier','eridan_audio_quasar_amplifier',
'konstantin_audio_a2_solid_state_amplifier','demograf_neptunum_class_d_amplifier',
'nemesis_solid_state_amplifier_demograf','gerbera_active_tube_preamplifier'];
var TARGETED=TARGET.indexOf(PATH)>=0;
var state={version:VERSION,slug:PATH,mode:TARGETED?'tube-amp-parity-over-v16':'delegate-v16',ready:false,baseReady:false,optionsBridge:false,error:''};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V17_STATE__=JSON.parse(JSON.stringify(state))}
function arr(v){return Array.prototype.slice.call(v||[])}
function str(v){return String(v==null?'':v).trim()}
function num(v){var n=Number(str(v).replace(/[^0-9.,-]/g,'').replace(/,/g,''));return Number.isFinite(n)?n:0}
function load(src,test){return new Promise(function(resolve,reject){if(test&&test())return resolve(true);var f=src.split('/').pop(),old=arr(document.scripts).find(function(s){return String(s.src||'').indexOf(f)>=0});if(old){var n=0,t=setInterval(function(){if(!test||test()){clearInterval(t);resolve(true)}else if(++n>300){clearInterval(t);resolve(false)}},50);return}var s=document.createElement('script');s.src=src;s.async=false;s.onload=function(){resolve(true)};s.onerror=function(){reject(new Error('load failed: '+src))};(document.head||document.documentElement).appendChild(s)})}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test()}catch(e){}if(ok){clearInterval(t);resolve(true)}else if(Date.now()-st>(ms||24000)){clearInterval(t);resolve(false)}},50)})}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null}catch(e){return null}}
function normPath(v){try{return new URL(v,location.href).pathname.replace(/\/+$/,'')||'/'}catch(e){return str(v).split('?')[0].replace(/\/+$/,'')||'/'}}
function productByHref(href){var target=normPath(href),ps=window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products||{},keys=Object.keys(ps);for(var i=0;i<keys.length;i++){var x=ps[keys[i]]||{};if(normPath(x.url||('/'+keys[i]))===target)return x}return null}
function installStyle(){if(document.getElementById('filin-v17-parity-style'))return;var s=document.createElement('style');s.id='filin-v17-parity-style';s.textContent=
'#'+ROOT+' .v3-panel .options-list{display:flex;flex-direction:column;align-items:stretch;gap:10px;width:100%;max-width:900px;margin:14px auto 0}'+
'#'+ROOT+' .v3-panel .options-list label{display:flex;align-items:center;gap:14px;width:100%;margin:0;padding:13px 15px;background:#fffbf7;border:1px solid #f0e6d9;border-radius:7px;box-sizing:border-box;cursor:pointer;font-family:Montserrat,Arial,sans-serif!important}'+
'#'+ROOT+' .v3-panel .options-list label:hover{background:#fdf5eb}'+
'#'+ROOT+' .v3-panel input[type="checkbox"],#'+ROOT+' .v3-panel input[type="radio"]{width:18px;height:18px;min-width:18px;margin:0;accent-color:#b38b59;cursor:pointer}'+
'#'+ROOT+' .v3-panel input[type="range"]{accent-color:#b38b59}'+
'@media(max-width:820px){#'+ROOT+' .v3-panel .options-list{gap:8px;margin-top:10px}#'+ROOT+' .v3-panel .options-list label{padding:12px 11px;gap:11px;font-size:13px!important}}';(document.head||document.documentElement).appendChild(s)}
function optionData(){var r=document.getElementById(ROOT),out={extra:0,names:[]};if(!r)return out;arr(r.querySelectorAll('.v3-panel .price-item:checked')).forEach(function(el){if(el.closest('.v3-pm'))return;out.extra+=num(el.getAttribute('data-price'));var l=el.closest('label'),t=str(l&&l.textContent).replace(/\s+/g,' ');if(t&&!/^stock\s*:|^no options$/i.test(t)&&!/^amplifier only/i.test(t))out.names.push(t.replace(/\(\+\$?[\d,.]+\)/g,'').trim())});return out}
function pmSubtotal(){var r=document.getElementById(ROOT),sum=0;if(!r)return 0;arr(r.querySelectorAll('.v3-pm .v3-bundle:checked')).forEach(function(cb){var row=cb.closest('.v3-pm-item'),a=row&&row.querySelector('a[href]'),p=a&&productByHref(a.href);sum+=Number(p&&p.price||0)});return sum}
function sync(){var r=document.getElementById(ROOT),p=profile();if(!r||!p||!p.commerce)return false;var o=optionData(),pm=pmSubtotal(),total=Math.round(Number(p.commerce.basePrice||0)+o.extra+pm*.95),formatted='$'+total.toLocaleString('en-US');var v=r.querySelector('.v3-buy-price');if(v)v.textContent=formatted;var price=r.querySelector('#v3-main-price');if(price)price.textContent=String(total);var name=r.querySelector('#v3-tilda-product-name');if(name){var base=p.commerce.cartName||p.commerce.displayName||p.overview&&p.overview.title||'';name.textContent=o.names.length?base+' ['+o.names.join(', ')+']':base}window.__FILIN_MASTER_PRODUCT_V17_COMMERCE_STATE__={slug:PATH,base:Math.round(Number(p.commerce.basePrice||0)),options:Math.round(o.extra),perfectMatches:Math.round(pm*.95),total:total,optionNames:o.names};return true}
function installBridge(){if(window.__FILIN_MASTER_PRODUCT_V17_OPTIONS_BRIDGE__)return;window.__FILIN_MASTER_PRODUCT_V17_OPTIONS_BRIDGE__=true;document.addEventListener('change',function(e){var t=e.target;if(t&&t.closest&&t.closest('#'+ROOT)&&t.matches('.price-item,.v3-bundle'))setTimeout(sync,20)},true);[0,250,800,1800,3500].forEach(function(ms){setTimeout(sync,ms)});state.optionsBridge=true;pub()}
async function boot(){try{await load(V16,function(){return!!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V16__});if(!TARGETED){state.ready=true;pub();return}var ok=await wait(function(){var s=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V16_STATE__;return s&&s.ready===true&&document.querySelector('#'+ROOT+' .v3-shell')},24000);state.baseReady=!!ok;if(!ok)throw new Error('V16 Golden batch did not become ready');installStyle();installBridge();sync();state.ready=true;state.error='';pub();console.info('[Filin Labs] Master Product V5.17 parity ready',state)}catch(e){state.error=String(e&&e.message||e);pub();console.warn('[Filin V5.17]',state.error,state)}}
boot();pub();
})();
