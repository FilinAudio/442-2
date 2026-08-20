/* ============================================================
   FILIN LABS — PHENOMENON PERFECT MATCHES V3
   For /phenomenon_spatium and /phenomenon_libratum.

   V3 fixes:
   - keeps the approved Golden/Trion PM visual structure
   - resolves synergy fallback categories into REAL catalog products
   - every checkbox has a real product URL + real product price
   - selecting addons updates BUY NOW, hidden Tilda price and sticky price
   - applies 5% OFF to EACH selected addon, matching Clean Commerce V2
   - works even if Clean Commerce misses a transient re-render
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V3_PHENOMENON_PM_V3__)return;
window.__FILIN_MASTER_PRODUCT_V3_PHENOMENON_PM_V3__=true;

var VERSION='3.0.0';
var ROOT_ID='filin-master-product-v3';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
if(['phenomenon_spatium','phenomenon_libratum'].indexOf(PATH)<0)return;

var state={version:VERSION,slug:PATH,ready:false,fixes:0,source:'',items:0,selected:0,base:0,total:0,lastError:''};
var timer=null;
function pub(){window.__FILIN_MASTER_PRODUCT_V3_PHENOMENON_PM_V3_STATE__=JSON.parse(JSON.stringify(state));}
function str(v){return String(v==null?'':v).trim();}
function norm(v){return str(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
function esc(v){return str(v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function money(n){return '$'+Math.round(Number(n)||0).toLocaleString('en-US');}
function root(){return document.getElementById(ROOT_ID);}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null;}catch(e){return null;}}
function catalog(){try{return window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products||{};}catch(e){return {};}}
function basePrice(){var p=profile();return Number(p&&p.commerce&&p.commerce.basePrice||0);}
function normPath(v){try{return new URL(v,location.href).pathname.replace(/\/+$/,'')||'/';}catch(e){return str(v).split('?')[0].replace(/\/+$/,'')||'/';}}
function catEntries(){var ps=catalog();return Object.keys(ps).map(function(k){var x=ps[k]||{};return{key:k,p:x,url:x.url||('/'+k)};}).filter(function(x){return normPath(x.url)!==('/'+PATH)&&Number(x.p.price)>0;});}
function textOf(x){var p=x.p||{};var spec='';try{spec=(p.specRows||[]).map(function(r){return (r||[]).join(' ');}).join(' ');}catch(e){}return norm([p.name,(p.categories||[]).join(' '),p.description,spec].join(' ')).toLowerCase();}
function scoreKind(x,kind){var t=textOf(x),s=0;
  if(kind==='amp'){
    if(/electrostatic/.test(t))s+=12;
    if(/headphone amplifier|headphone amp/.test(t))s+=10;
    if(/tube amplifier|tube amp|vacuum tube/.test(t))s+=8;
    if(/amplifier/.test(t))s+=5;
    if(/dac.*amplifier|amplifier.*dac/.test(t))s+=3;
  }else if(kind==='dac'){
    if(/r2r|r-2r|multibit/.test(t))s+=12;
    if(/tube.*dac|dac.*tube/.test(t))s+=9;
    if(/\bdac\b|digital.?to.?analog/.test(t))s+=6;
    if(/headphone amplifier/.test(t))s+=1;
  }else if(kind==='cable'){
    if(/headphone cable|headphones cable/.test(t))s+=12;
    if(/silver cable|copper cable/.test(t))s+=8;
    if(/cable/.test(t))s+=5;
    if(/speaker cable|power cable/.test(t))s-=4;
  }
  return s;
}
function pick(kind,used){var xs=catEntries().map(function(x){return{x:x,s:scoreKind(x,kind)};}).filter(function(q){return q.s>0&&!used[q.x.key];});xs.sort(function(a,b){if(b.s!==a.s)return b.s-a.s;return Number(a.x.p.price)-Number(b.x.p.price);});if(!xs.length)return null;var z=xs[0].x;used[z.key]=1;return{name:norm(z.p.name)||z.key,url:z.p.url||('/'+z.key),price:Number(z.p.price)||0,key:z.key,kind:kind};}
function fallbackItems(){var used=Object.create(null),out=[];['amp','dac','cable'].forEach(function(k){var x=pick(k,used);if(x)out.push(x);});return out.slice(0,3);}

function looksLikePM(t){t=norm(t);return /perfect\s*matches?/i.test(t)||(/5%\s*off/i.test(t)&&/(recommended|synergy|added device|each added)/i.test(t));}
function smallestPM(scope){var xs=[];try{Array.prototype.slice.call(scope.querySelectorAll('.perfect-matches-block,[class*="perfect-match"],[id*="perfect-match"],[class*="perfect_match"],[id*="perfect_match"],[class*="synergy"],[id*="synergy"],section,div')).forEach(function(n){if(n.closest&&n.closest('#'+ROOT_ID))return;var t=norm(n.textContent);if(t.length>=12&&t.length<=3200&&looksLikePM(t))xs.push(n);});}catch(e){}xs.sort(function(a,b){return norm(a.textContent).length-norm(b.textContent).length;});return xs[0]||null;}
function cleanHref(a){var h=str(a&&a.getAttribute('href'));if(!h||h==='#'||/^javascript:/i.test(h))return'';try{return new URL(h,location.origin).href;}catch(e){return h;}}
function productByHref(href){var target=normPath(href),ps=catalog(),keys=Object.keys(ps);for(var i=0;i<keys.length;i++){var x=ps[keys[i]]||{};if(normPath(x.url||('/'+keys[i]))===target)return x;}return null;}
function dataFromLegacy(node){if(!node)return null;var p=profile(),base=norm(p&&p.commerce&&(p.commerce.displayName||p.commerce.cartName))||'Phenomenon';var descNode=node.querySelector('.pm-desc,.perfect-matches-desc,[class*="match"][class*="desc"],p');var desc=norm(descNode&&descNode.textContent);if(/5%\s*off/i.test(desc)&&desc.length<180)desc='';var seen=Object.create(null),items=[];Array.prototype.slice.call(node.querySelectorAll('a[href]')).forEach(function(a){var name=norm(a.textContent),href=cleanHref(a),cp=productByHref(href);if(!name||!href||!cp||Number(cp.price)<=0)return;var k=normPath(href);if(seen[k])return;seen[k]=1;items.push({name:name,url:href,price:Number(cp.price)});});return items.length?{base:base,desc:desc,items:items,source:'legacy-dom'}:null;}
function discover(){var d=dataFromLegacy(smallestPM(document));if(d)return d;var p=profile(),html=p&&p.commerce&&p.commerce.innerHTML;if(html){var box=document.createElement('div');box.innerHTML=html;d=dataFromLegacy(smallestPM(box));if(d){d.source='profile-commerce';return d;}}var items=fallbackItems();return{base:norm(p&&p.commerce&&(p.commerce.displayName||p.commerce.cartName))||'Phenomenon',desc:'Recommended synergy for this product.',items:items,source:'catalog-resolved-fallback'};}

function html(d){var note='Add recommended synergy components to get <b>5% OFF for EACH added device.</b>';var formula='<span class="v3-pm-item v3-pm-base">'+esc(d.base)+'</span>';d.items.forEach(function(x){formula+='<span class="v3-pm-plus">+</span><label class="v3-pm-item"><input class="v3-bundle" type="checkbox" data-fp-addon-price="'+esc(x.price)+'" data-fp-addon-key="'+esc(x.key||'')+'"><a href="'+esc(x.url)+'">'+esc(x.name)+'</a></label>';});formula+='<span class="v3-pm-equals">=</span><span class="v3-pm-result">Ultimate Synergy</span>';return '<section class="v3-pm fp-phenomenon-pm-v3"><button class="v3-pm-toggle" type="button" aria-expanded="false"><span class="v3-pm-copy"><span class="v3-pm-kicker">Perfect Matches</span><span class="v3-pm-note">'+note+'</span></span><span class="v3-pm-icon" aria-hidden="true"><svg viewBox="0 0 20 20" focusable="false"><path d="M5.5 8 L10 12.5 L14.5 8"></path></svg></span></button><div class="v3-pm-body">'+(d.desc?'<p class="v3-pm-desc">'+esc(d.desc)+'</p>':'')+'<div class="v3-pm-formula">'+formula+'</div></div></section>';}
function syncSticky(total){var f=money(total);Array.prototype.forEach.call(document.querySelectorAll('body *'),function(el){if(el.children.length)return;var t=norm(el.textContent);if(!/^\$[\d,]+(?:\.\d+)?$/.test(t))return;var p=el;for(var i=0;i<6&&p;i++,p=p.parentElement){var cs;try{cs=getComputedStyle(p);}catch(e){break;}if(cs.position==='fixed'||cs.position==='sticky'){el.textContent=f;break;}}});}
function updatePrice(){var r=root();if(!r)return;var base=basePrice();var selected=Array.prototype.slice.call(r.querySelectorAll('.fp-phenomenon-pm-v3 .v3-bundle:checked'));var subtotal=selected.reduce(function(sum,cb){return sum+Number(cb.getAttribute('data-fp-addon-price')||0);},0);var total=Math.round(base+subtotal*0.95);var f=money(total);var visible=r.querySelector('.v3-buy-price');if(visible)visible.textContent=f;var native=r.querySelector('#v3-main-price');if(native)native.textContent=String(total);syncSticky(total);state.selected=selected.length;state.base=Math.round(base);state.total=total;pub();try{window.dispatchEvent(new CustomEvent('filin:product:v3:price',{detail:{version:VERSION,slug:PATH,base:base,selected:selected.length,selectedSubtotal:subtotal,selectedAfterDiscount:subtotal*0.95,total:total}}));}catch(e){} }
function wire(pm){var btn=pm.querySelector('.v3-pm-toggle');if(btn&&btn.dataset.fpPmV3!=='1'){btn.dataset.fpPmV3='1';btn.addEventListener('click',function(){pm.classList.toggle('open');btn.setAttribute('aria-expanded',pm.classList.contains('open')?'true':'false');});}Array.prototype.slice.call(pm.querySelectorAll('.v3-bundle')).forEach(function(cb){if(cb.dataset.fpPriceWire==='1')return;cb.dataset.fpPriceWire='1';cb.addEventListener('change',function(){setTimeout(updatePrice,0);setTimeout(updatePrice,80);});});}
function apply(){var r=root();if(!r){state.ready=false;pub();return false;}Array.prototype.slice.call(r.querySelectorAll('.fp-phenomenon-pm-v1,.fp-phenomenon-pm-v2')).forEach(function(x){x.remove();});var existing=r.querySelector('.fp-phenomenon-pm-v3');if(existing){wire(existing);updatePrice();state.ready=true;state.items=existing.querySelectorAll('.v3-bundle').length;pub();return true;}var native=r.querySelector('.v3-pm');if(native&&!native.classList.contains('fp-phenomenon-pm-v1')&&!native.classList.contains('fp-phenomenon-pm-v2')){native.remove();}
var d=discover();if(!d.items||!d.items.length){state.ready=false;state.lastError='No priced catalog addons resolved';pub();return false;}var host=r.querySelector('.v3-js-product')||r.querySelector('.v3-commerce');if(!host){state.ready=false;state.lastError='Golden commerce host not found';pub();return false;}var box=document.createElement('div');box.innerHTML=html(d);var pm=box.firstElementChild;host.appendChild(pm);wire(pm);state.fixes++;state.ready=true;state.source=d.source;state.items=d.items.length;state.lastError='';updatePrice();pub();console.info('[Filin Labs] Phenomenon Perfect Matches V3 applied',{slug:PATH,source:d.source,items:d.items.map(function(x){return{name:x.name,price:x.price};})});return true;}
function schedule(ms){clearTimeout(timer);timer=setTimeout(apply,ms==null?40:ms);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){schedule(0);},{once:true});else schedule(0);
[80,180,400,800,1500,3000,6000].forEach(function(ms){setTimeout(apply,ms);});
if(window.MutationObserver){var mo=new MutationObserver(function(muts){var hit=muts.some(function(m){return Array.prototype.slice.call(m.addedNodes||[]).some(function(n){return n&&n.nodeType===1&&(n.id===ROOT_ID||(n.querySelector&&n.querySelector('#'+ROOT_ID)));});});if(hit)schedule(40);});mo.observe(document.documentElement,{childList:true,subtree:true});}
pub();console.info('[Filin Labs] Phenomenon Perfect Matches V3 loaded',{version:VERSION,slug:PATH});
})();
