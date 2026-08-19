/* FILIN LABS — ACCOUNT WISHLIST ST110 SOURCE V1 */
(function(){
'use strict';
if(window.__FILIN_ACCOUNT_WISHLIST_ST110_SOURCE_V1__)return;
window.__FILIN_ACCOUNT_WISHLIST_ST110_SOURCE_V1__=true;
var VERSION='1.0.0',HOST_ID='fla-wishlist-host',writing=false,timer=null,observer=null,renders=0;
function s(v){return String(v==null?'':v).trim();}
function c(v){return s(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
function e(v){return s(v).replace(/[&<>"']/g,function(x){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x];});}
function w(){var x=window.twishlist;return x&&Array.isArray(x.products)?x:null;}
function h(){return document.getElementById(HOST_ID);}
function uid(p){return s(p&&(p.uid||p.id||p.productuid||p.productUid||p.lid));}
function name(p){return c(p&&(p.name||p.title||p.product||p.productName))||'Saved product';}
function img(p){var x=p&&(p.img||p.image||p.picture||p.photo||p.thumbnail)||'';if(x&&typeof x==='object')x=x.url||x.src||x.original||'';return s(x);}
function url(p){var x=p&&(p.url||p.href||p.link||p.productUrl)||'https://filinlabs.com/catalog';try{return new URL(x,location.origin).href;}catch(q){return 'https://filinlabs.com/catalog';}}
function same(a,b){var au=uid(a),bu=uid(b);if(au&&bu&&au===bu)return true;var aa=url(a).replace(/[?#].*$/,'').replace(/\/+$/,''),bb=url(b).replace(/[?#].*$/,'').replace(/\/+$/,'');if(aa&&bb&&aa===bb)return true;return name(a).toLowerCase()===name(b).toLowerCase();}
function items(){var x=w(),out=[];if(!x)return out;x.products.forEach(function(p){if(!p||typeof p!=='object')return;if(!out.some(function(q){return same(q,p);})){out.push(p);}});return out.slice(0,50);}
function card(p){var u=url(p),n=name(p),im=img(p);return '<a class="fla-wish-item fp-st110-wish-item" href="'+e(u)+'"><div class="fla-wish-img">'+(im?'<img src="'+e(im)+'" alt="" loading="lazy" decoding="async">':'<div class="fla-wish-fallback" style="display:grid">Product image</div>')+'</div><div class="fla-wish-body"><div class="fla-wish-name">'+e(n)+'</div></div></a>';}
function html(xs){return xs.length?'<div class="fla-wishlist-grid fp-st110-wishlist-grid">'+xs.map(card).join('')+'</div>':'<div class="fla-empty"><strong>Your Wishlist is currently empty.</strong><p>Browse the Filin Labs catalogue and use the heart icon to save products you want to revisit.</p></div>';}
function pub(xs){var x=w();window.__FILIN_ACCOUNT_WISHLIST_ST110_SOURCE_V1_STATE__={version:VERSION,ready:!!(h()&&x),renders:renders,total:x?Number(x.total!=null?x.total:xs.length):null,items:xs.length};}
function render(){var host=h(),x=w();if(!host||!x){pub([]);return false;}var xs=items(),m=html(xs);if(host.innerHTML!==m){writing=true;host.innerHTML=m;host.setAttribute('data-fp-wishlist-source','st110');writing=false;renders++;}pub(xs);return true;}
function schedule(ms){clearTimeout(timer);timer=setTimeout(render,ms==null?30:ms);}
function observe(){var host=h();if(!host||!window.MutationObserver)return;if(observer)observer.disconnect();observer=new MutationObserver(function(){if(!writing)schedule(0);});observer.observe(host,{childList:true,subtree:true,characterData:true});}
function boot(){render();observe();[100,300,700,1400,2600,5000].forEach(function(ms){setTimeout(function(){render();observe();},ms);});}
window.addEventListener('pageshow',function(){schedule(0);});
window.addEventListener('storage',function(){schedule(0);});
document.addEventListener('click',function(ev){if(ev.target&&ev.target.closest&&ev.target.closest('.t1002__product-del,[href="#showfavorites"],.t1002__wishlisticon'))[80,220,500].forEach(function(ms){setTimeout(render,ms);});});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
var tries=0,wait=setInterval(function(){tries++;if(render()){observe();if(tries>8)clearInterval(wait);}if(tries>=60)clearInterval(wait);},250);
console.info('[Filin Labs] Account Wishlist ST110 Source V1 loaded',{version:VERSION});
})();
