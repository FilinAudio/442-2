/* ============================================================
   FILIN LABS — MASTER PRODUCT V4 PRODUCTION AMP BATCH V1
   Golden Reference 2 migration for the approved next 10 amplifier pages.

   One production entrypoint. Integrates:
   - legacy page capture -> Golden V3.3.2 profile
   - stable hero background capture/preload/pin
   - H1 whitespace normalization via innerText
   - curator text normalization / duplicate cleanup
   - guarded gallery transitions + thumbnail health
   - legacy source quarantine with bounded passes only
   - stable Registry V1 / Clean Commerce V2 / Wishlist Bridge V4

   No global MutationObserver loops. No repeated debug spam.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V1__)return;

var VERSION='4.1.0';
var ROOT_ID='filin-master-product-v3';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ALLOWED=[
  'gerbera_lira_compact_tube_amplifier_ultralinear_se',
  'gerbera_2a3_tube_amplifier',
  'audioinstrument_sirius_kt150_tube_amplifier',
  'audioinstrument_sirius_kt66_push_pull_tube_amplifier',
  'demograf_ajax_tube_amplifier_el_84',
  'gerbera_ha_45_tube_headphone_amplifier_dac',
  'gerbera_ha_15_tube_amp_electrostatic_planar',
  'gerbera_a8045_tube_headphone_amplifier',
  'gerbera_electrostatic_amplifier',
  'gerbera_attento_otl_tube_electrostatic_headphone_amplifier'
];
if(ALLOWED.indexOf(PATH)<0)return;
window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V1__=true;

var CDN='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@';
var DEP={
  rich:CDN+'f78a192778064f62e6c6bf45d5c338d9826d185d/filin-rich-product-catalog-v2-runtime.js',
  core:CDN+'e4de1ae708daa2966411d764f3d803af5b59ec17/filin-master-product-v3-3-2-golden-standard-runtime.js',
  registry:CDN+'20681020ae3ddbacd0a467f84e0b5ea831135706/filin-master-product-v3-profiles-registry-v1.js',
  commerce:CDN+'44c895edcbef44d44014e494781c0046bd969b67/filin-master-product-v3-clean-commerce-v2.js',
  wishlist:CDN+'3d06611f1c1daff094db45a7659a13a6f3d31d88/filin-master-product-v3-wishlist-bridge-v4.js'
};

var state={
  version:VERSION,slug:PATH,ready:false,rich:false,core:false,registry:false,
  commerce:false,wishlist:false,heroReady:false,images:0,tabs:0,curation:0,
  pm:false,price:0,title:'',quarantined:0,badImages:0,errors:[]
};
var sourceNodes=[];
var heroSnapshot='';
var heroChosen='';
var heroPinTimer=null;

function publish(){window.__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V1_STATE__=JSON.parse(JSON.stringify(state));}
function str(v){return String(v==null?'':v).trim();}
function arr(v){return Array.prototype.slice.call(v||[]);}
function norm(v){return str(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
function esc(v){return str(v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function num(v){var n=Number(str(v).replace(/[^0-9.,-]/g,'').replace(/,/g,''));return Number.isFinite(n)?n:0;}
function toUrl(v){try{return new URL(str(v),location.origin).href;}catch(e){return'';}}
function rect(n){try{return n.getBoundingClientRect();}catch(e){return{width:0,height:0};}}
function visible(n){if(!n||!n.isConnected)return false;try{var c=getComputedStyle(n);if(c.display==='none'||c.visibility==='hidden'||Number(c.opacity)===0)return false;}catch(e){}var r=rect(n);return r.width>0&&r.height>0;}
function fail(where,e){var m=where+': '+String(e&&e.message||e);if(state.errors.indexOf(m)<0)state.errors.push(m);publish();console.warn('[Filin V4]',m);}
function cleanClone(node){if(!node)return null;var c=node.cloneNode(true);arr(c.querySelectorAll('script,style,noscript,template,svg')).forEach(function(x){x.remove();});return c;}
function cleanText(node){var c=cleanClone(node);return norm(c&&c.textContent);}
function visualText(node){return norm(node&&(node.innerText||node.textContent));}
function recOf(n){return n&&n.closest?n.closest('.t-rec,[id^="rec"]'):null;}
function remember(n){var r=recOf(n)||n;if(!r||r===document.body||r===document.documentElement||r.closest('#'+ROOT_ID))return;if(sourceNodes.indexOf(r)<0)sourceNodes.push(r);}
function isCodeText(t){return /(?:#rec\d+|t_onReady|t_onFuncLoad|\.t\d+__|font-size\s*:|@media\s|function\s*\(|document\.|querySelector|nth-child|font-family\s*:)/i.test(str(t));}

function validImage(u){return !!u&&/^https?:\/\//i.test(u)&&!/(?:blank\.gif|empty\.png|pixel|favicon|logo|sprite|cookie|payment|telegram|whatsapp|youtube|icon[-_.]|social|arrow)/i.test(u);}
function pushImage(out,v){var u=toUrl(v);if(validImage(u)&&out.indexOf(u)<0)out.push(u);}
function cssUrl(v){var m=str(v).match(/url\(["']?([^"')]+)["']?\)/i);return m?toUrl(m[1]):'';}
function elementImageCandidates(el,out){
  if(!el||!el.getAttribute)return;
  ['data-img-zoom-url','data-content-cover-bg','data-original','data-bg','data-src','data-lazy-src','src'].forEach(function(a){pushImage(out,el.getAttribute(a));});
  var u=cssUrl(el.getAttribute('style'));if(validImage(u)&&out.indexOf(u)<0)out.push(u);
  try{u=cssUrl(getComputedStyle(el).backgroundImage);if(validImage(u)&&out.indexOf(u)<0)out.push(u);}catch(e){}
}
function bestImageOf(el){var out=[];elementImageCandidates(el,out);return out[0]||'';}

function nativeHeroCandidates(){
  var out=[],cover=document.querySelector('.t-cover');if(!cover)return out;
  var carrier=cover.querySelector('.t-cover__carrier,[id^="coverCarry"],.t-bgimg');
  elementImageCandidates(carrier,out);elementImageCandidates(cover,out);
  arr(cover.querySelectorAll('[data-content-cover-bg],[data-original],[data-src],[data-bg],[style*="background-image"],img')).forEach(function(el){elementImageCandidates(el,out);});
  return out;
}
function snapshotHero(){var xs=nativeHeroCandidates();if(!heroSnapshot&&xs.length)heroSnapshot=xs[0];return heroSnapshot;}
function preload(u,cb){
  if(!validImage(u)){cb(false);return;}
  var im=new Image(),done=false,t=setTimeout(function(){finish(false);},5000);
  function finish(ok){if(done)return;done=true;clearTimeout(t);cb(!!ok);}
  im.onload=function(){finish(im.naturalWidth>100&&im.naturalHeight>100);};im.onerror=function(){finish(false);};im.src=u;
}
function pinHero(u){
  if(!u)return false;
  var cover=document.querySelector('.t-cover'),carrier=cover&&cover.querySelector('.t-cover__carrier,[id^="coverCarry"],.t-bgimg');
  if(!cover||!carrier)return false;
  carrier.setAttribute('data-content-cover-bg',u);carrier.setAttribute('data-original',u);
  carrier.style.setProperty('background-image','url("'+u.replace(/"/g,'\\"')+'")','important');
  carrier.style.setProperty('background-size','cover','important');carrier.style.setProperty('background-position','center center','important');
  carrier.style.setProperty('visibility','visible','important');carrier.style.setProperty('opacity','1','important');carrier.classList.add('loaded');
  cover.style.setProperty('visibility','visible','important');cover.style.setProperty('opacity','1','important');
  state.heroReady=true;publish();return true;
}
function stabilizeHero(u){
  if(!u)return;
  preload(u,function(ok){if(!ok)return;heroChosen=u;pinHero(u);[120,400,1000,2200,4500].forEach(function(ms){setTimeout(function(){pinHero(u);},ms);});});
}

var CUR_DEFS=[
  {re:/cat(?:h)?egory\s*&?\s*budget\s*tier|budget\s*tier/i,title:'Category & Budget Tier'},
  {re:/tags?\s*&\s*features|tags?\s+features/i,title:'Tags & Features'},
  {re:/sonic\s*signature/i,title:'Sonic Signature'},
  {re:/high\s*technolog/i,title:'High Technologies'},
  {re:/curator.?s\s*choice/i,title:'Curator’s Choice'},
  {re:/synergy\s*match/i,title:'Synergy Match'},
  {re:/genres?\s*accord/i,title:'Genres Accord'}
];
function curationMatches(t){var n=0;CUR_DEFS.forEach(function(d){if(d.re.test(str(t)))n++;});return n;}
function isCurationText(t){return curationMatches(t)>0;}
function normalizeCurator(t){
  t=norm(t).replace(/(?:Filin\s+Labs\s+Kazakhstan\.\s*){2,}/ig,'Filin Labs Kazakhstan. ')
    .replace(/Filin\s+Labs\s+Kazakhstan\.\s*Labs\s+Kazakhstan\.?/ig,'Filin Labs Kazakhstan.');
  var sentences=t.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[],seen={},out=[];
  sentences.forEach(function(s){
    s=norm(s);if(!s)return;
    var k=s.toLowerCase().replace(/^handcrafted\s+by\s+/,'').replace(/[^a-z0-9]+/g,' ' ).trim();
    if(!seen[k]){seen[k]=1;out.push(s);}
  });
  return norm(out.join(' '));
}

function richProduct(){try{return window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products&&window.FilinRichCatalogV2.products[PATH]||null;}catch(e){return null;}}
function findLegacyProduct(){
  var xs=arr(document.querySelectorAll('.js-product')).filter(function(x){return !x.closest('#'+ROOT_ID)&&!x.closest('.t706,.t1002,.t-popup');});
  xs.sort(function(a,b){function score(x){return(x.querySelector('.js-product-name')?5:0)+(x.querySelector('.js-product-price')?5:0)+(x.querySelector('.tabs-wrapper')?8:0)+(x.querySelector('.perfect-matches-block')?6:0);}return score(b)-score(a);});
  return xs[0]||null;
}
function findHero(){
  var cover=document.querySelector('.t-cover');if(!cover)return{h1:'',desc:'',bg:''};
  var h=cover.querySelector('h1,.t-title');
  var texts=arr(cover.querySelectorAll('.t-descr,.t-text,p')).map(cleanText).filter(function(t){return t.length>24&&!/back to the/i.test(t)&&!isCodeText(t);});
  var xs=nativeHeroCandidates();
  return{h1:visualText(h),desc:texts[0]||'',bg:heroSnapshot||xs[0]||''};
}
function findCurator(){
  var xs=arr(document.querySelectorAll('p,.t-text,.t-descr,div')).filter(function(x){
    if(x.closest('#'+ROOT_ID)||x.closest('.t706,.t1002'))return false;
    var t=cleanText(x);return t&&t.length<600&&(/personally listened/i.test(t)||(/handcrafted by/i.test(t)&&/filin labs/i.test(t)))&&!isCodeText(t);
  });
  xs.sort(function(a,b){return cleanText(a).length-cleanText(b).length;});var n=xs[0]||null;if(n)remember(n);
  return n?normalizeCurator(cleanText(n)):'';
}
function tokenScore(text,name){var toks=norm(name).toLowerCase().split(/[^a-z0-9]+/).filter(function(x){return x.length>2;}),t=norm(text).toLowerCase(),s=0;toks.forEach(function(k){if(t.indexOf(k)>=0)s++;});return s;}
function findOverview(name,q){
  var hs=arr(document.querySelectorAll('h2,h3')).filter(function(h){var t=cleanText(h);return t&&!h.closest('#'+ROOT_ID)&&!isCurationText(t)&&!/perfect matches|shipping|contact|legal|reviews?/i.test(t);});
  hs.sort(function(a,b){return tokenScore(cleanText(b),name)-tokenScore(cleanText(a),name);});var h=hs[0]||null,rec=recOf(h),paras=[];
  if(rec){
    var firstCur=arr(rec.querySelectorAll('h2,h3,h4')).find(function(x){return isCurationText(cleanText(x));});
    arr(rec.querySelectorAll('p,.t-text,.t-descr')).forEach(function(p){
      if(firstCur&&(firstCur.compareDocumentPosition(p)&Node.DOCUMENT_POSITION_FOLLOWING))return;
      var t=cleanText(p);if(t.length<25||isCodeText(t)||isCurationText(t)||/personally listened|perfect matches|total\s*\*/i.test(t))return;if(paras.indexOf(t)<0)paras.push(t);
    });remember(rec);
  }
  var title=h?visualText(h):((q&&q.name)||name);var html=paras.slice(0,8).map(function(t){return'<p>'+esc(t)+'</p>';}).join('');
  if(!html&&q&&q.description)html='<p>'+esc(q.description)+'</p>';return{title:title,html:html,rec:rec};
}
function smallestCurationCard(h){var n=h,best=null,steps=0;while(n&&n!==document.body&&steps++<9){var t=cleanText(n),count=curationMatches(t);if(count===1&&t.length<=1800&&!isCodeText(t))best=n;if(n.matches&&n.matches('.t491__col,.t-col,[class*="__col"]')&&best)break;if(n.matches&&n.matches('.t-rec,[id^="rec"]'))break;n=n.parentElement;}return best||h.parentElement;}
function extractCuration(){
  var hs=arr(document.querySelectorAll('h2,h3,h4')).filter(function(h){return !h.closest('#'+ROOT_ID);}),out=[];
  CUR_DEFS.forEach(function(def){
    var h=hs.find(function(x){return def.re.test(cleanText(x));});if(!h)return;var card=smallestCurationCard(h),parts=[];
    arr(card.querySelectorAll('p,.t-text,.t-descr,.t-name')).forEach(function(x){if(x===h||x.contains(h))return;var t=cleanText(x);if(!t||t.length<2||isCodeText(t)||curationMatches(t)>0)return;if(parts.indexOf(t)<0)parts.push(t);});
    var body=parts.join('\n').slice(0,1000);if(!body)return;out.push({title:def.title,html:'<p>'+esc(body).replace(/\n+/g,'<br>')+'</p>'});remember(card);
  });return out;
}
function imagesIn(scope){
  var out=[];if(!scope)return out;
  arr(scope.querySelectorAll('img,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[data-content-cover-bg],.t-bgimg,[style*="background-image"]')).forEach(function(el){
    if(el.closest('.t-store__card,.t-card,.t1002,.t706,.t491__col'))return;var u=bestImageOf(el);if(u&&out.indexOf(u)<0)out.push(u);
  });return out;
}
function collectGallery(q,overview){
  var out=[];if(q&&Array.isArray(q.images))q.images.forEach(function(x){pushImage(out,x);});
  var recs=arr(document.querySelectorAll('.t-rec,[id^="rec"]')),idx=overview.rec?recs.indexOf(overview.rec):-1,candidates=[];
  if(idx>=0){for(var i=Math.max(0,idx-4);i<=Math.min(recs.length-1,idx+1);i++){var r=recs[i],t=cleanText(r);if(/perfect matches|shipping|contact|legal|reviews?|hi-fi\s*&\s*high-end/i.test(t)||curationMatches(t)>0)continue;candidates.push(r);}}
  if(!candidates.length)candidates=recs.filter(function(r){return imagesIn(r).length>0&&curationMatches(cleanText(r))===0;}).slice(0,4);
  candidates.forEach(function(r){imagesIn(r).forEach(function(u){if(out.length<12)pushImage(out,u);});if(cleanText(r).length<100&&imagesIn(r).length)remember(r);});
  return out.slice(0,12);
}
function sourceCommerce(product){
  var tabs=product&&product.querySelector('.tabs-wrapper'),pm=product&&product.querySelector('.perfect-matches-block');
  if(!tabs)tabs=arr(document.querySelectorAll('.tabs-wrapper')).find(function(x){return !x.closest('#'+ROOT_ID)&&!x.closest('.t706,.t1002');})||null;
  if(!pm)pm=arr(document.querySelectorAll('.perfect-matches-block')).find(function(x){return !x.closest('#'+ROOT_ID)&&!x.closest('.t706,.t1002');})||null;
  if(tabs)remember(tabs);if(pm)remember(pm);if(product)remember(product);return{tabs:tabs,pm:pm,inner:(pm?pm.outerHTML:'')+(tabs?tabs.outerHTML:'')};
}
function capture(){
  var q=richProduct(),product=findLegacyProduct(),hero=findHero(),curator=findCurator();
  var cartName=cleanText(product&&product.querySelector('.js-product-name')),baseName=cartName||(q&&q.name)||hero.h1||document.title;
  var overview=findOverview(baseName,q),curation=extractCuration(),gallery=collectGallery(q,overview),commerce=sourceCommerce(product),price=0;
  if(product){var pe=product.querySelector('.js-product-price,[data-product-price-def]');price=num(pe&&pe.getAttribute('data-product-price-def'))||num(pe&&pe.textContent);}
  if(!price)price=Math.round(Number(q&&q.price)||0);
  var bg=hero.bg||gallery[0]||'';state.images=gallery.length;state.tabs=commerce.tabs?commerce.tabs.querySelectorAll('.tabs-header .tab-btn,.tab-btn').length:0;
  state.curation=curation.length;state.pm=!!commerce.pm;state.price=price;state.title=overview.title;publish();
  return{hero:hero.h1||(q&&q.name)||overview.title,desc:hero.desc||(q&&q.description)||'',bg:bg,curator:curator,title:overview.title,html:overview.html,images:gallery,curation:curation,price:price,cart:cartName||overview.title,inner:commerce.inner,category:q&&q.categories&&q.categories[0]||'Products',brand:q&&q.brand||''};
}
function writeProductData(x){
  var el=document.getElementById('product-data'),d={};if(el)try{d=JSON.parse(el.textContent||'{}')||{};}catch(e){}
  d.slug=PATH;d.id=d.id||PATH.replace(/_/g,'-');d.brand=x.brand||d.brand||'';d.name=x.title;d.model=x.title;d.category=x.category;d.commerce=d.commerce||{};d.commerce.currency='USD';d.commerce.regularPrice=x.price;d.page=d.page||{};d.page.productPath='/'+PATH;
  if(!el){el=document.createElement('script');el.id='product-data';el.type='application/json';(document.body||document.documentElement).appendChild(el);}el.textContent=JSON.stringify(d);
}
function makeProfile(x){return{schemaVersion:2,slug:PATH,id:PATH.replace(/_/g,'-'),category:str(x.category).toLowerCase().replace(/\s+/g,'-'),currency:'USD',hero:{staticH1:x.hero,description:x.desc,background:x.bg},curator:x.curator,overview:{title:x.title,html:x.html||('<p>'+esc(x.desc)+'</p>'),galleryImages:x.images},curation:x.curation,commerce:{basePrice:x.price,displayName:x.title,cartName:x.cart,stickyTitle:x.title,innerHTML:x.inner},reviewsCTA:'View The Reviews of '+x.title,reviewsQuery:x.title,reviewsIntro:'Share your listening experience with '+x.title+'.',reviewsKey:PATH.replace(/_/g,'-'),golden:{backLabel:"Back to the Filin's nest",backHref:'/',mobileHeroHeight:860,resultLabel:'Ultimate Synergy'}};}
function fillExisting(p,x){
  p=JSON.parse(JSON.stringify(p));p.slug=PATH;p.hero=p.hero||{};p.overview=p.overview||{};p.commerce=p.commerce||{};
  if(!p.hero.staticH1)p.hero.staticH1=x.hero;if(!p.hero.description)p.hero.description=x.desc;if(!p.hero.background)p.hero.background=x.bg;if(!p.overview.galleryImages||!p.overview.galleryImages.length)p.overview.galleryImages=x.images;
  if(!p.overview.title)p.overview.title=x.title;if(!p.overview.html)p.overview.html=x.html;if(!p.curator)p.curator=x.curator;if(!Array.isArray(p.curation)||!p.curation.length)p.curation=x.curation;
  if(!p.commerce.basePrice)p.commerce.basePrice=x.price;if(!p.commerce.displayName)p.commerce.displayName=x.title;if(!p.commerce.cartName)p.commerce.cartName=x.cart;if(!p.commerce.stickyTitle)p.commerce.stickyTitle=x.title;if(!p.commerce.innerHTML)p.commerce.innerHTML=x.inner;return p;
}

function installStyle(){if(document.getElementById('fp-v4-amp-style'))return;var s=document.createElement('style');s.id='fp-v4-amp-style';s.textContent='.fp-v4-source-hidden{display:none!important}';(document.head||document.documentElement).appendChild(s);}
function quarantinePass(){
  if(!document.getElementById(ROOT_ID))return;var n=0;
  sourceNodes.forEach(function(r){if(r&&r.isConnected&&!r.closest('#'+ROOT_ID)){r.classList.add('fp-v4-source-hidden');n++;}});
  arr(document.querySelectorAll('.t-rec,[id^="rec"]')).forEach(function(r){if(r.closest('#'+ROOT_ID)||r.classList.contains('fp-v3-tilda-record-envelope-v4'))return;var t=cleanText(r),hide=false;if(r.querySelector('.js-product')&&!r.closest('.t706,.t1002'))hide=true;if(curationMatches(t)>=3)hide=true;if((r.querySelector('.tabs-wrapper')||r.querySelector('.perfect-matches-block'))&&tokenScore(t,state.title)>=1)hide=true;if(hide){r.classList.add('fp-v4-source-hidden');n++;}});
  state.quarantined=n;publish();
}
function installGalleryGuard(){
  var root=document.getElementById(ROOT_ID);if(!root||root.dataset.fpV4GalleryGuard==='1')return false;var main=root.querySelector('.v3-main-img'),stage=root.querySelector('.v3-stage');if(!main)return false;root.dataset.fpV4GalleryGuard='1';
  var bad={},loading=false,seq=0;
  function thumbs(){return arr(root.querySelectorAll('.v3-thumb'));}
  function activeIndex(){var ts=thumbs(),a=root.querySelector('.v3-thumb.active'),i=ts.indexOf(a);return i>=0?i:0;}
  function thumbUrl(t){var im=t&&t.querySelector('img');return im&&(im.currentSrc||im.getAttribute('src')||im.src)||'';}
  function setActive(t){thumbs().forEach(function(x){x.classList.toggle('active',x===t);});}
  function safeShow(index,dir){
    var ts=thumbs();if(!ts.length||loading)return;var tries=0,i=((index%ts.length)+ts.length)%ts.length;
    function attempt(){if(tries++>=ts.length){loading=false;return;}var t=ts[i],u=thumbUrl(t);if(!u||bad[u]){i=(i+(dir||1)+ts.length)%ts.length;attempt();return;}if(main.src===u||main.currentSrc===u){setActive(t);return;}
      var token=++seq,probe=new Image(),done=false,tm=setTimeout(function(){finish(false);},4500);loading=true;
      function finish(ok){if(done||token!==seq)return;done=true;clearTimeout(tm);loading=false;if(ok){main.src=u;setActive(t);}else{bad[u]=1;state.badImages=Object.keys(bad).length;t.style.display='none';publish();i=(i+(dir||1)+ts.length)%ts.length;attempt();}}
      probe.onload=function(){finish(probe.naturalWidth>80&&probe.naturalHeight>80);};probe.onerror=function(){finish(false);};probe.src=u;
    }attempt();
  }
  root.addEventListener('click',function(ev){var t=ev.target&&ev.target.closest&&ev.target.closest('.v3-thumb,.v3-prev,.v3-next');if(!t||!root.contains(t))return;ev.preventDefault();ev.stopPropagation();if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();var ts=thumbs(),i=activeIndex();if(t.classList.contains('v3-thumb'))safeShow(ts.indexOf(t),1);else if(t.classList.contains('v3-prev'))safeShow(i-1,-1);else safeShow(i+1,1);},true);
  thumbs().forEach(function(t){var u=thumbUrl(t);if(!u)return;preload(u,function(ok){if(!ok){bad[u]=1;t.style.display='none';state.badImages=Object.keys(bad).length;publish();}else{var im=t.querySelector('img');if(im&&im.src!==u)im.src=u;}});});
  return true;
}
function loaded(src){var f=src.split('/').pop();return arr(document.scripts).some(function(x){return str(x.src).indexOf(f)>=0;});}
function load(src,test){return new Promise(function(resolve,reject){if(test&&test())return resolve(true);if(loaded(src)){var k=0,t=setInterval(function(){if(!test||test()){clearInterval(t);resolve(true);}else if(++k>100){clearInterval(t);resolve(false);}},60);return;}var s=document.createElement('script');s.src=src;s.async=true;s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('load '+src));};(document.head||document.documentElement).appendChild(s);});}

async function boot(){
  installStyle();snapshotHero();
  try{await load(DEP.rich,function(){return!!window.FilinRichCatalogV2;});state.rich=!!window.FilinRichCatalogV2;}catch(e){fail('rich',e);}
  var captured=capture();writeProductData(captured);if(captured.bg)stabilizeHero(captured.bg);
  try{await load(DEP.core,function(){return!!(window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles);});state.core=!!window.FilinMasterProductV3;}catch(e){fail('core',e);}
  try{var api=window.FilinMasterProductV3;if(!api||!api.profiles||typeof api.apply!=='function')throw new Error('core API unavailable');api.profiles[PATH]=api.profiles[PATH]?fillExisting(api.profiles[PATH],captured):makeProfile(captured);api.apply();}catch(e){fail('profile',e);}
  [40,160,500,1200,2600,5000].forEach(function(ms){setTimeout(function(){quarantinePass();installGalleryGuard();if(heroChosen)pinHero(heroChosen);},ms);});
  try{if(!window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__)await load(DEP.registry,function(){return!!window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__;});state.registry=!!window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__;}catch(e){fail('registry',e);}
  try{await load(DEP.commerce,function(){return!!window.__FILIN_MASTER_PRODUCT_V3_CLEAN_COMMERCE_V2__;});state.commerce=!!window.__FILIN_MASTER_PRODUCT_V3_CLEAN_COMMERCE_V2__;}catch(e){fail('commerce',e);}
  try{await load(DEP.wishlist,function(){return!!window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V4__;});state.wishlist=!!window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V4__;}catch(e){fail('wishlist',e);}
  setTimeout(function(){quarantinePass();installGalleryGuard();state.ready=!!document.getElementById(ROOT_ID);publish();console.info('[Filin Labs] Master Product V4 AMP Batch ready',{version:VERSION,slug:PATH,ready:state.ready,images:state.images,tabs:state.tabs,curation:state.curation,pm:state.pm,errors:state.errors.length});},350);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);},{once:true});else setTimeout(boot,0);
publish();
})();
