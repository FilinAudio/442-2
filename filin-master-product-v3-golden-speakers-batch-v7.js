/* FILIN LABS — GOLDEN SPEAKERS BATCH V7 */
(function(){
'use strict';
if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V7__)return;
var slug=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var allowed={demograf_clio_speakers:1,perun_junior_hybrid_electrostatic_speakers:1,perun_elder_electrostatic_speakers:1,audioinstrument_tower_speakers:1,audioinstrument_power_speakers:1,audioinstrument_grand_tower_speakers:1};
if(!allowed[slug])return;
window.__FILIN_GOLDEN_SPEAKERS_BATCH_V7__=true;
var V6='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@56c425266fd10542d80ba328a0a32152e75fd0ea/filin-master-product-v3-golden-speakers-batch-v6.js';
function same(a,b){return String(a||'').split('?')[0]===String(b||'').split('?')[0]}
function has(u){return Array.prototype.some.call(document.scripts||[],function(s){return same(s.src,u)})}
function load(u,id,done){if(has(u)){done&&done();return}var old=document.getElementById(id);if(old){done&&old.addEventListener('load',done,{once:true});return}var s=document.createElement('script');s.id=id;s.src=u;s.async=false;s.onload=function(){done&&done()};s.onerror=function(){console.error('[Golden Speakers V7] failed',u)};(document.head||document.documentElement).appendChild(s)}
function money(n){n=Math.round(Number(n||0)*100)/100;return '$'+n.toLocaleString('en-US',{maximumFractionDigits:2})}
function root(){return document.getElementById('filin-master-product-v3')}
function basePrice(){try{var d=JSON.parse((document.getElementById('product-data')||{}).textContent||'{}');return Number(d&&d.commerce&&d.commerce.regularPrice||0)}catch(e){return 0}}
function products(){return window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products||{}}
function pathOf(u){try{return new URL(u,location.href).pathname.replace(/\/+$/,'')}catch(e){return ''}}
function productByHref(href){var p=products(),target=pathOf(href),best=null;Object.keys(p).some(function(k){var x=p[k]||{};if(pathOf(x.url)===target){best=x;return true}return false});return best}
function selected(){var r=root();if(!r)return[];return Array.prototype.slice.call(r.querySelectorAll('.v3-pm .v3-bundle:checked')).map(function(cb){var row=cb.closest('.v3-pm-item')||cb.parentElement;var a=row&&row.querySelector('a[href]');var p=a&&productByHref(a.href);return {name:a?a.textContent.trim():'',href:a&&a.href||'',price:Number(p&&p.price||0)}})}
function setSticky(total){var m=money(total);Array.prototype.slice.call(document.querySelectorAll('body *')).forEach(function(el){if(el.children.length)return;var t=(el.textContent||'').trim();if(!/^\$[\d,]+(?:\.\d+)?$/.test(t))return;var p=el;for(var i=0;i<6&&p;i++,p=p.parentElement){var pos=getComputedStyle(p).position;if(pos==='fixed'||pos==='sticky'){if(t!==m)el.textContent=m;break}}})}
function update(){var r=root();if(!r)return false;var items=selected();var add=items.reduce(function(s,x){return s+x.price*.95},0);var total=basePrice()+add;var mt=money(total);var nt=String(Math.round(total*100)/100);var bp=r.querySelector('.v3-buy-price');if(bp&&bp.textContent!==mt)bp.textContent=mt;var np=r.querySelector('#v3-main-price');if(np&&np.textContent!==nt)np.textContent=nt;setSticky(total);window.__FILIN_GOLDEN_SPEAKERS_BATCH_V7_STATE__={slug:slug,selected:items.length,total:total,items:items};return true}
function css(){if(document.getElementById('filin-golden-speakers-v7-style'))return;var s=document.createElement('style');s.id='filin-golden-speakers-v7-style';s.textContent='@media(max-width:820px){#filin-master-product-v3 .v3-fav{right:14px!important;left:auto!important}}';(document.head||document.documentElement).appendChild(s)}
function bind(){css();document.addEventListener('change',function(e){if(e.target&&e.target.matches('#filin-master-product-v3 .v3-pm .v3-bundle'))setTimeout(update,0)},true);var n=0,t=setInterval(function(){n++;css();update();if(n>=30)clearInterval(t)},250)}
load(V6,'filin-golden-speakers-v6-from-v7',function(){bind();console.info('[Golden Speakers Batch V7] READY',{version:'7.0.0',slug:slug})});
})();
