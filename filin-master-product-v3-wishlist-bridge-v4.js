/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 WISHLIST BRIDGE V4
   Direct ST110 adapter + Tilda record compatibility envelope.

   V4 vs V3:
   - keeps direct window.twishlist add/remove
   - wraps Golden root in a synthetic .t-rec so Tilda Wishlist never
     resolves closest('.t-rec') to null
   - completes data-product-* attributes before interaction
   - removes synthetic #addtofavorites button entirely
   - persists with twishlist__saveLocalObj only
   - does NOT call Tilda redraw helpers that rescan custom product DOM
   - updates native wishlist counter directly
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V4__)return;
window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V4__=true;

var VERSION='4.0.0';
var ROOT_ID='filin-master-product-v3';
var WRAP_CLASS='fp-v3-tilda-record-envelope-v4';
var state={version:VERSION,mode:'direct-twishlist-record-envelope',ready:false,repairs:0,title:'',price:0,image:'',url:'',uid:'',active:false,total:null,envelopeReady:false,productReady:false,twishlistReady:false,lastAction:'init',lastError:''};

function arr(v){return Array.prototype.slice.call(v||[]);}
function str(v){return String(v==null?'':v).trim();}
function norm(v){return str(v).replace(/\s+/g,' ').trim();}
function root(){return document.getElementById(ROOT_ID);}
function safeClosest(el,sel){try{return el&&el.closest?el.closest(sel):null;}catch(e){return null;}}
function readSeed(){try{var el=document.getElementById('product-data');return el?JSON.parse(el.textContent||'{}'):{};}catch(e){return {};}}
function title(r){var el=r&&(r.querySelector('#v3-tilda-product-name')||r.querySelector('.v3-overview h2'));var t=norm(el&&el.textContent);if(t)return t;var d=readSeed();return norm((d.commerce&&d.commerce.cartName)||d.name||d.model||document.title||'Filin Labs Product');}
function price(r){var el=r&&(r.querySelector('#v3-main-price')||r.querySelector('.v3-buy-price')||r.querySelector('.js-product-price'));var raw=str(el&&el.textContent).replace(/[^0-9.,-]/g,'').replace(/,/g,'');var n=Number(raw);if(Number.isFinite(n)&&n>=0)return Math.round(n);var d=readSeed();n=Number(d.commerce&&(d.commerce.regularPrice||d.commerce.basePrice)||d.price||0);return Number.isFinite(n)?Math.round(n):0;}
function image(r){var img=r&&(r.querySelector('.v3-main-img')||r.querySelector('.v3-gallery img')||r.querySelector('.v3-js-product .js-product-img'));var u=str(img&&(img.getAttribute('data-original')||img.getAttribute('data-src')||img.getAttribute('src')));if(u)return u;var d=readSeed(),xs=d.overview&&d.overview.galleryImages;return str((xs&&xs[0])||(d.hero&&d.hero.background)||'');}
function productUrl(){var d=readSeed();var p=str(d.page&&d.page.productPath);if(p){try{return new URL(p,location.origin).href;}catch(e){}}return location.origin+location.pathname;}
function hash32(s){var h=2166136261>>>0;s=String(s||'');for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619)>>>0;}return h>>>0;}
function stableUid(){var d=readSeed();var key=str(d.slug||d.id||productUrl()||title(root()));return String(800000000000+(hash32(key)%199999999999));}
function refresh(){var r=root();state.title=title(r);state.price=price(r);state.image=image(r);state.url=productUrl();state.uid=stableUid();}
function wish(){var w=window.twishlist;return w&&Array.isArray(w.products)?w:null;}
function same(p){if(!p)return false;var u=str(p.uid||p.id||p.productuid);if(u&&state.uid&&u===state.uid)return true;var pn=norm(p.name||p.title).toLowerCase(),tn=norm(state.title).toLowerCase();if(pn&&tn&&pn===tn)return true;var pu=str(p.url).replace(/[?#].*$/,'').replace(/\/+$/,''),tu=str(state.url).replace(/[?#].*$/,'').replace(/\/+$/,'');return !!(pu&&tu&&pu===tu);}
function findIndex(){var w=wish();if(!w)return-1;for(var i=0;i<w.products.length;i++)if(same(w.products[i]))return i;return-1;}
function makeProduct(){return{name:state.title,title:state.title,price:state.price,amount:state.price,quantity:1,uid:state.uid,sku:'',img:state.image,image:state.image,url:state.url,inv:1,unit:'',portion:0,options:[]};}
function recalc(w){if(!w)return;w.total=w.products.length;var sum=w.products.reduce(function(s,p){var n=Number(p&&((p.amount!=null)?p.amount:p.price));return s+(Number.isFinite(n)?n:0);},0);if(Object.prototype.hasOwnProperty.call(w,'amount'))w.amount=sum;if(Object.prototype.hasOwnProperty.call(w,'prodamount'))w.prodamount=sum;}

function ensureEnvelope(){var r=root();if(!r)return false;refresh();var parent=r.parentElement;if(parent&&parent.classList.contains(WRAP_CLASS)){state.envelopeReady=true;return true;}var wrap=document.createElement('div');wrap.className='t-rec '+WRAP_CLASS;wrap.id='rec'+state.uid;wrap.setAttribute('data-record-type','215');wrap.setAttribute('data-animationappear','off');wrap.style.cssText='margin:0!important;padding:0!important;border:0!important;background:transparent!important;';if(parent){parent.insertBefore(wrap,r);wrap.appendChild(r);}state.envelopeReady=!!safeClosest(r,'.t-rec');return state.envelopeReady;}

function completeProduct(){var r=root();if(!r)return false;refresh();var gp=r.querySelector('.v3-js-product');if(!gp)return false;gp.classList.add('js-product');gp.setAttribute('data-product-inv','1');gp.setAttribute('data-product-lid',state.uid);gp.setAttribute('data-product-uid',state.uid);gp.setAttribute('data-product-gen-uid',state.uid);gp.setAttribute('data-product-part-uid','0');gp.setAttribute('data-product-url',state.url);gp.setAttribute('data-product-pack-label','lwh');gp.setAttribute('data-product-pack-m','0');gp.setAttribute('data-product-pack-x','0');gp.setAttribute('data-product-pack-y','0');gp.setAttribute('data-product-pack-z','0');
var p=gp.querySelector('#v3-main-price,.js-product-price');if(p){p.classList.add('js-product-price','js-store-prod-price-val');p.setAttribute('data-product-price-def',String(state.price));p.setAttribute('data-product-price-def-str',String(state.price));p.setAttribute('data-product-price-range-val',String(state.price));}
var n=gp.querySelector('#v3-tilda-product-name,.js-product-name');if(n)n.classList.add('js-product-name','js-store-prod-name');
var im=gp.querySelector('.js-product-img');if(im){im.classList.add('t-store__card__img');if(state.image){im.setAttribute('data-original',state.image);if(!im.getAttribute('src'))im.setAttribute('src',state.image);}}
arr(gp.querySelectorAll('.fp-v3-wishlist-native-shell-v3,.fp-v3-wishlist-native-btn-v3')).forEach(function(x){x.remove();});
state.productReady=true;return true;}

function save(){try{if(typeof window.twishlist__saveLocalObj==='function')window.twishlist__saveLocalObj();}catch(e){state.lastError='twishlist__saveLocalObj: '+String(e&&e.message||e);}}
function counter(){var w=wish(),t=w?Number(w.total||0):0;arr(document.querySelectorAll('.t1002__wishlisticon-counter')).forEach(function(n){n.textContent=String(t);});}
function setHeart(active){var r=root();state.active=!!active;if(!r)return;arr(r.querySelectorAll('.v3-fav')).forEach(function(f){f.textContent=active?'♥':'♡';f.classList.toggle('v3-fav-active',!!active);f.setAttribute('aria-pressed',active?'true':'false');f.setAttribute('aria-label',active?'Remove from wishlist':'Add to wishlist');});}
function publish(){var w=wish();state.twishlistReady=!!w;state.total=w?Number(w.total||0):null;state.ready=!!(root()&&state.envelopeReady&&state.productReady&&state.twishlistReady);window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V4_STATE__={version:VERSION,mode:state.mode,ready:state.ready,repairs:state.repairs,title:state.title,price:state.price,image:state.image,url:state.url,uid:state.uid,active:state.active,total:state.total,envelopeReady:state.envelopeReady,productReady:state.productReady,twishlistReady:state.twishlistReady,lastAction:state.lastAction,lastError:state.lastError};}
function sync(){ensureEnvelope();completeProduct();var w=wish();state.twishlistReady=!!w;if(w){recalc(w);setHeart(findIndex()>=0);counter();}else setHeart(false);publish();}
function repair(){state.repairs++;sync();return state.ready;}
function toggle(){ensureEnvelope();completeProduct();var w=wish();if(!w){state.lastAction='blocked:not-ready';state.lastError='ST110/twishlist is not ready';publish();return false;}var i=findIndex();if(i>=0){w.products.splice(i,1);state.lastAction='remove';}else{w.products.push(makeProduct());state.lastAction='add';}recalc(w);save();counter();setHeart(findIndex()>=0);publish();[60,180,450].forEach(function(ms){setTimeout(sync,ms);});console.info('[V3 Wishlist Bridge V4] TOGGLE',{action:state.lastAction,uid:state.uid,total:w.total,active:state.active});return true;}

document.addEventListener('click',function(ev){var fav=safeClosest(ev.target,'#'+ROOT_ID+' .v3-fav');if(!fav)return;ev.preventDefault();ev.stopPropagation();if(typeof ev.stopImmediatePropagation==='function')ev.stopImmediatePropagation();toggle();},true);
document.addEventListener('click',function(ev){if(safeClosest(ev.target,'.t1002__product-del,[href="#showfavorites"],.t1002__wishlisticon'))[100,260,600].forEach(function(ms){setTimeout(sync,ms);});},false);
window.addEventListener('storage',function(){setTimeout(sync,0);});window.addEventListener('pageshow',function(){setTimeout(repair,0);});window.addEventListener('filin:product:v3:price',function(){setTimeout(sync,0);});
var timer=null;function schedule(){clearTimeout(timer);timer=setTimeout(sync,30);}if(window.MutationObserver){new MutationObserver(function(muts){var hit=muts.some(function(m){return arr(m.addedNodes).some(function(n){return n&&n.nodeType===1&&(n.id===ROOT_ID||(n.querySelector&&n.querySelector('#'+ROOT_ID)));});});if(hit)schedule();}).observe(document.documentElement,{childList:true,subtree:true});}
repair();[0,40,100,250,600,1200,2500,5000].forEach(function(ms){setTimeout(repair,ms);});
console.info('[V3 Wishlist Bridge V4] LOADED',{version:VERSION,mode:state.mode});
})();
