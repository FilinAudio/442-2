/* FILIN LABS — MASTER PRODUCT V5 UNIFIED LOADER V16
   Batch 1: 12 solid-state / preamplifier pages -> Golden V3.3.2.
   Contract:
   - waits for DOMContentLoaded before source inspection
   - GL01 is the ONLY gallery source for target pages
   - legacy Tilda content is captured into one Golden profile
   - no Zero Block / Rich Catalog gallery hydration
   - Golden profile is applied once
   - source GL01 + migrated legacy records are hidden only after the first Golden image is loaded
   - all non-target pages delegate to approved V15 unchanged
*/
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V16__)return;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V16__=true;

var VERSION='5.16.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';
var V15='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@f9d9bb9572951286826a48704a94a74f239e4f02/filin-master-product-v5-unified-loader-v15.js';
var TARGET=[
  'gerbera_dual_mono_mosfet_headphone_amplifier',
  'konstantin_audio_un_1_solid_state_headphones_amplifier',
  'phenomenon_kgsshv_carbon_electrostatic_headphone_amplifier',
  'sciber_enflow',
  'gerbera_equos',
  'audioinstrument_vivo_solid_state_amplifier',
  'eridan_audio_rigel_integrated_amplifier',
  'eridan_audio_quasar_amplifier',
  'konstantin_audio_a2_solid_state_amplifier',
  'demograf_neptunum_class_d_amplifier',
  'nemesis_solid_state_amplifier_demograf',
  'gerbera_active_tube_preamplifier'
];

var CDN='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@';
var DEP={
  rich:CDN+'f78a192778064f62e6c6bf45d5c338d9826d185d/filin-rich-product-catalog-v2-runtime.js',
  core:CDN+'e4de1ae708daa2966411d764f3d803af5b59ec17/filin-master-product-v3-3-2-golden-standard-runtime.js',
  registry:CDN+'20681020ae3ddbacd0a467f84e0b5ea831135706/filin-master-product-v3-profiles-registry-v1.js',
  commerce:CDN+'44c895edcbef44d44014e494781c0046bd969b67/filin-master-product-v3-clean-commerce-v2.js',
  wishlist:CDN+'3d06611f1c1daff094db45a7659a13a6f3d31d88/filin-master-product-v3-wishlist-bridge-v4.js'
};

function arr(v){return Array.prototype.slice.call(v||[])}
function str(v){return String(v==null?'':v).trim()}
function norm(v){return str(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim()}
function esc(v){return str(v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function num(v){var n=Number(str(v).replace(/[^0-9.,-]/g,'').replace(/,/g,''));return Number.isFinite(n)?n:0}
function load(src,test){return new Promise(function(resolve,reject){
  if(test&&test())return resolve(true);
  var file=src.split('/').pop().split('?')[0];
  var existing=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(file)>=0});
  if(existing){
    var n=0,t=setInterval(function(){
      if(!test||test()){clearInterval(t);resolve(true)}
      else if(++n>260){clearInterval(t);resolve(false)}
    },50);
    return;
  }
  var s=document.createElement('script');
  s.src=src;s.async=false;
  s.onload=function(){resolve(true)};
  s.onerror=function(){reject(new Error('load failed: '+src))};
  (document.head||document.documentElement).appendChild(s);
})}
function wait(test,ms){return new Promise(function(resolve){
  var st=Date.now(),t=setInterval(function(){
    var ok=false;try{ok=!!test()}catch(e){}
    if(ok){clearInterval(t);resolve(true)}
    else if(Date.now()-st>(ms||14000)){clearInterval(t);resolve(false)}
  },50);
})}

if(TARGET.indexOf(PATH)<0){
  load(V15,function(){return !!window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V15__});
  return;
}

/* V16 exclusively owns this batch. */
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V15__=true;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V14__=true;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V13__=true;
window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V12__=true;

var state={
  version:VERSION,slug:PATH,mode:'amp-gl01-golden-batch-1',
  ready:false,sourceFound:false,sourceRecord:'',slides:0,candidates:0,verified:0,
  profileBuilt:false,baseReady:false,mainReady:false,price:0,tabs:0,curation:0,pm:false,
  registryReady:false,commerceReady:false,wishlistReady:false,quarantined:0,
  released:false,timeout:false,error:'',urls:[]
};
function pub(){window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V16_STATE__=JSON.parse(JSON.stringify(state))}

var sourceNodes=[];
function recOf(n){return n&&n.closest?n.closest('.t-rec,[id^="rec"]'):null}
function remember(n){
  var r=recOf(n)||n;
  if(!r||r===document.body||r===document.documentElement||r.closest('#'+ROOT))return;
  if(sourceNodes.indexOf(r)<0)sourceNodes.push(r);
}
function cloneText(n){
  if(!n)return'';
  var c=n.cloneNode(true);
  arr(c.querySelectorAll('script,style,noscript,template,svg')).forEach(function(x){x.remove()});
  return norm(c.textContent);
}
function visualText(n){return norm(n&&(n.innerText||n.textContent))}
function isCodeText(t){return /(?:#rec\d+|t_onReady|t_onFuncLoad|\.t\d+__|font-size\s*:|@media\s|function\s*\(|document\.|querySelector|nth-child|font-family\s*:)/i.test(str(t))}

function toUrl(v){try{return new URL(str(v),location.origin).href}catch(e){return''}}
function cssUrl(v){var m=str(v).match(/url\(["']?([^"')]+)["']?\)/i);return m?toUrl(m[1]):''}
function validImage(u){
  return !!u&&/^https?:\/\//i.test(u)&&/(?:static|optim|thb)\.tildacdn\.com/i.test(u)&&
    /\.(?:jpe?g|png|webp)(?:\?|$)/i.test(u)&&
    !/(?:\/resize\/20x|\/lib\/icons\/|logo|photoroom|favicon|sprite|pixel|icon[-_.]|social|arrow|payment|telegram|whatsapp|youtube|dollar_currency|currency[_-]?icon)/i.test(u)
}
function candidatesOf(el){
  var out=[];if(!el||!el.getAttribute)return out;
  ['data-img-zoom-url','data-original','data-bg','data-src','data-lazy-src','src'].forEach(function(a){
    var u=toUrl(el.getAttribute(a));if(validImage(u)&&out.indexOf(u)<0)out.push(u)
  });
  var u=cssUrl(el.getAttribute('style'));if(validImage(u)&&out.indexOf(u)<0)out.push(u);
  try{u=cssUrl(getComputedStyle(el).backgroundImage);if(validImage(u)&&out.indexOf(u)<0)out.push(u)}catch(e){}
  return out;
}
function prefer(xs){
  if(!xs.length)return'';
  var s=xs.find(function(u){return /static\.tildacdn\.com/i.test(u)&&!/\/resize\//i.test(u)});
  return s||xs[0];
}
function collectGl01(rec,updateState){
  var out=[];if(!rec)return out;
  var slides=arr(rec.querySelectorAll('.t-slds__item'));
  if(updateState)state.slides=slides.length;
  if(slides.length){
    slides.forEach(function(slide){
      var pool=[];
      arr(slide.querySelectorAll('[data-img-zoom-url],[data-original],[data-src],[data-lazy-src],img,[style*="background-image"]')).forEach(function(el){
        candidatesOf(el).forEach(function(u){if(pool.indexOf(u)<0)pool.push(u)})
      });
      candidatesOf(slide).forEach(function(u){if(pool.indexOf(u)<0)pool.push(u)});
      var chosen=prefer(pool);if(chosen&&out.indexOf(chosen)<0)out.push(chosen);
    });
  }
  if(out.length<1){
    arr(rec.querySelectorAll('[data-img-zoom-url],[data-original],[data-src],[data-lazy-src],img,[style*="background-image"]')).forEach(function(el){
      var u=prefer(candidatesOf(el));if(u&&out.indexOf(u)<0)out.push(u)
    });
  }
  return out;
}
function findGl01(){
  var recs=arr(document.querySelectorAll('.t-rec[data-record-type="670"],[data-record-type="670"].t-rec'));
  arr(document.querySelectorAll('.t670')).forEach(function(x){
    var r=x.closest('.t-rec,[id^="rec"]')||x;
    if(recs.indexOf(r)<0)recs.push(r);
  });
  recs=recs.filter(function(r){return r&&!r.closest('#'+ROOT)&&!r.closest('header,footer,#t-header,#t-footer')});
  if(!recs.length){
    recs=arr(document.querySelectorAll('.t-rec,[id^="rec"]')).filter(function(r){
      return !r.closest('#'+ROOT)&&!r.closest('header,footer,#t-header,#t-footer')&&
        r.querySelector('.t-slds__container,.t-slds')&&r.querySelectorAll('.t-slds__item').length>=2;
    });
  }
  var best=null,bestN=0;
  recs.forEach(function(r){var n=collectGl01(r,false).length;if(n>bestN){bestN=n;best=r}});
  return best;
}
function probe(u){return new Promise(function(resolve){
  var im=new Image(),done=false,tm=setTimeout(function(){finish(null)},5000);
  function finish(x){if(done)return;done=true;clearTimeout(tm);resolve(x)}
  im.onload=function(){var w=im.naturalWidth||0,h=im.naturalHeight||0,ratio=h?w/h:0;
    if(w>=500&&h>=350&&ratio>=0.38&&ratio<=3.6)finish({url:u,w:w,h:h});else finish(null)};
  im.onerror=function(){finish(null)};im.src=u;
})}

var CUR_DEFS=[
  {re:/cat(?:h)?egory\s*&?\s*budget\s*tier|budget\s*tier/i,title:'Category & Budget Tier'},
  {re:/tags?\s*&\s*features|tags?\s+features/i,title:'Tags & Features'},
  {re:/sonic\s*signature/i,title:'Sonic Signature'},
  {re:/high\s*technolog/i,title:'High Technologies'},
  {re:/curator.?s\s*choice/i,title:'Curator’s Choice'},
  {re:/synergy\s*match/i,title:'Synergy Match'},
  {re:/genres?\s*accord/i,title:'Genres Accord'}
];
function curationMatches(t){var n=0;CUR_DEFS.forEach(function(d){if(d.re.test(str(t)))n++});return n}
function isCurationText(t){return curationMatches(t)>0}
function normalizeCurator(t){
  t=norm(t).replace(/(?:Filin\s+Labs\s+Kazakhstan\.\s*){2,}/ig,'Filin Labs Kazakhstan. ')
    .replace(/Filin\s+Labs\s+Kazakhstan\.\s*Labs\s+Kazakhstan\.?/ig,'Filin Labs Kazakhstan.');
  var sentences=t.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[],seen={},out=[];
  sentences.forEach(function(s){s=norm(s);if(!s)return;var k=s.toLowerCase().replace(/^handcrafted\s+by\s+/,'').replace(/[^a-z0-9]+/g,' ').trim();if(!seen[k]){seen[k]=1;out.push(s)}});
  return norm(out.join(' '));
}
function richProduct(){try{return window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products&&window.FilinRichCatalogV2.products[PATH]||null}catch(e){return null}}
function findLegacyProduct(){
  var xs=arr(document.querySelectorAll('.js-product')).filter(function(x){return !x.closest('#'+ROOT)&&!x.closest('.t706,.t1002,.t-popup')});
  xs.sort(function(a,b){
    function score(x){return(x.querySelector('.js-product-name')?5:0)+(x.querySelector('.js-product-price')?5:0)+(x.querySelector('.tabs-wrapper')?8:0)+(x.querySelector('.perfect-matches-block')?6:0)}
    return score(b)-score(a);
  });
  return xs[0]||null;
}
function heroCandidates(){
  var out=[],cover=document.querySelector('.t-cover');if(!cover)return out;
  arr(cover.querySelectorAll('[data-content-cover-bg],[data-original],[data-src],[data-bg],[style*="background-image"],img')).forEach(function(el){
    candidatesOf(el).forEach(function(u){if(out.indexOf(u)<0)out.push(u)})
  });
  candidatesOf(cover).forEach(function(u){if(out.indexOf(u)<0)out.push(u)});
  return out;
}
function findHero(){
  var cover=document.querySelector('.t-cover');if(!cover)return{h1:'',desc:'',bg:''};
  var h=cover.querySelector('h1,.t-title');
  var texts=arr(cover.querySelectorAll('.t-descr,.t-text,p')).map(cloneText).filter(function(t){return t.length>24&&!/back to the/i.test(t)&&!isCodeText(t)});
  var xs=heroCandidates();
  return{h1:visualText(h),desc:texts[0]||'',bg:xs[0]||''};
}
function findCurator(){
  var xs=arr(document.querySelectorAll('p,.t-text,.t-descr,div')).filter(function(x){
    if(x.closest('#'+ROOT)||x.closest('.t706,.t1002'))return false;
    var t=cloneText(x);return t&&t.length<600&&(/personally listened/i.test(t)||(/handcrafted by/i.test(t)&&/filin labs/i.test(t)))&&!isCodeText(t);
  });
  xs.sort(function(a,b){return cloneText(a).length-cloneText(b).length});
  var n=xs[0]||null;if(n)remember(n);
  return n?normalizeCurator(cloneText(n)):'';
}
function tokenScore(text,name){
  var toks=norm(name).toLowerCase().split(/[^a-z0-9]+/).filter(function(x){return x.length>2}),t=norm(text).toLowerCase(),s=0;
  toks.forEach(function(k){if(t.indexOf(k)>=0)s++});return s;
}
function findOverview(name,q){
  var hs=arr(document.querySelectorAll('h2,h3')).filter(function(h){
    var t=cloneText(h);return t&&!h.closest('#'+ROOT)&&!isCurationText(t)&&!/perfect matches|shipping|contact|legal|reviews?/i.test(t);
  });
  hs.sort(function(a,b){return tokenScore(cloneText(b),name)-tokenScore(cloneText(a),name)});
  var h=hs[0]||null,rec=recOf(h),paras=[];
  if(rec){
    var firstCur=arr(rec.querySelectorAll('h2,h3,h4')).find(function(x){return isCurationText(cloneText(x))});
    arr(rec.querySelectorAll('p,.t-text,.t-descr')).forEach(function(p){
      if(firstCur&&(firstCur.compareDocumentPosition(p)&Node.DOCUMENT_POSITION_FOLLOWING))return;
      var t=cloneText(p);
      if(t.length<25||isCodeText(t)||isCurationText(t)||/personally listened|perfect matches|total\s*\*/i.test(t))return;
      if(paras.indexOf(t)<0)paras.push(t);
    });
    remember(rec);
  }
  var title=h?visualText(h):((q&&q.name)||name);
  var html=paras.slice(0,8).map(function(t){return'<p>'+esc(t)+'</p>'}).join('');
  if(!html&&q&&q.description)html='<p>'+esc(q.description)+'</p>';
  return{title:title,html:html,rec:rec};
}
function smallestCurationCard(h){
  var n=h,best=null,steps=0;
  while(n&&n!==document.body&&steps++<9){
    var t=cloneText(n),count=curationMatches(t);
    if(count===1&&t.length<=1800&&!isCodeText(t))best=n;
    if(n.matches&&n.matches('.t491__col,.t-col,[class*="__col"]')&&best)break;
    if(n.matches&&n.matches('.t-rec,[id^="rec"]'))break;
    n=n.parentElement;
  }
  return best||h.parentElement;
}
function extractCuration(){
  var hs=arr(document.querySelectorAll('h2,h3,h4')).filter(function(h){return !h.closest('#'+ROOT)}),out=[];
  CUR_DEFS.forEach(function(def){
    var h=hs.find(function(x){return def.re.test(cloneText(x))});if(!h)return;
    var card=smallestCurationCard(h),parts=[];
    arr(card.querySelectorAll('p,.t-text,.t-descr,.t-name')).forEach(function(x){
      if(x===h||x.contains(h))return;
      var t=cloneText(x);if(!t||t.length<2||isCodeText(t)||curationMatches(t)>0)return;
      if(parts.indexOf(t)<0)parts.push(t);
    });
    var body=parts.join('\n').slice(0,1000);if(!body)return;
    out.push({title:def.title,html:'<p>'+esc(body).replace(/\n+/g,'<br>')+'</p>'});
    remember(card);
  });
  return out;
}
function sourceCommerce(product){
  var tabs=product&&product.querySelector('.tabs-wrapper'),pm=product&&product.querySelector('.perfect-matches-block');
  if(!tabs)tabs=arr(document.querySelectorAll('.tabs-wrapper')).find(function(x){return !x.closest('#'+ROOT)&&!x.closest('.t706,.t1002')})||null;
  if(!pm)pm=arr(document.querySelectorAll('.perfect-matches-block')).find(function(x){return !x.closest('#'+ROOT)&&!x.closest('.t706,.t1002')})||null;
  if(tabs)remember(tabs);if(pm)remember(pm);if(product)remember(product);
  return{tabs:tabs,pm:pm,inner:(pm?pm.outerHTML:'')+(tabs?tabs.outerHTML:'')};
}
function capture(verified){
  var q=richProduct(),product=findLegacyProduct(),hero=findHero(),curator=findCurator();
  var cartName=cloneText(product&&product.querySelector('.js-product-name'));
  var baseName=cartName||(q&&q.name)||hero.h1||document.title;
  var overview=findOverview(baseName,q),curation=extractCuration(),commerce=sourceCommerce(product),price=0;
  if(product){
    var pe=product.querySelector('.js-product-price,[data-product-price-def]');
    price=num(pe&&pe.getAttribute('data-product-price-def'))||num(pe&&pe.textContent);
  }
  if(!price)price=Math.round(Number(q&&q.price)||0);
  var bg=hero.bg||verified[0]||'';
  state.price=price;
  state.tabs=commerce.tabs?commerce.tabs.querySelectorAll('.tabs-header .tab-btn,.tab-btn').length:0;
  state.curation=curation.length;
  state.pm=!!commerce.pm;
  pub();
  return{
    hero:hero.h1||(q&&q.name)||overview.title,
    desc:hero.desc||(q&&q.description)||'',
    bg:bg,curator:curator,title:overview.title,html:overview.html,
    images:verified.slice(),curation:curation,price:price,
    cart:cartName||overview.title,inner:commerce.inner,
    category:q&&q.categories&&q.categories[0]||(/preamplifier/.test(PATH)?'Preamplifiers':'Solid-State Amplifiers'),
    brand:q&&q.brand||''
  };
}
function writeProductData(x){
  var el=document.getElementById('product-data'),d={};
  if(el)try{d=JSON.parse(el.textContent||'{}')||{}}catch(e){}
  d.slug=PATH;d.id=d.id||PATH.replace(/_/g,'-');d.brand=x.brand||d.brand||'';
  d.name=x.title;d.model=x.title;d.category=x.category;
  d.commerce=d.commerce||{};d.commerce.currency='USD';d.commerce.regularPrice=x.price;
  d.page=d.page||{};d.page.productPath='/'+PATH;
  if(!el){el=document.createElement('script');el.id='product-data';el.type='application/json';(document.body||document.documentElement).appendChild(el)}
  el.textContent=JSON.stringify(d);
}
function makeProfile(x){
  return{
    schemaVersion:2,slug:PATH,id:PATH.replace(/_/g,'-'),
    category:str(x.category).toLowerCase().replace(/\s+/g,'-'),currency:'USD',
    hero:{staticH1:x.hero,description:x.desc,background:x.bg},
    curator:x.curator,
    overview:{title:x.title,html:x.html||('<p>'+esc(x.desc)+'</p>'),galleryImages:x.images},
    curation:x.curation,
    commerce:{basePrice:x.price,displayName:x.title,cartName:x.cart,stickyTitle:x.title,innerHTML:x.inner},
    reviewsCTA:'View The Reviews of '+x.title,reviewsQuery:x.title,reviewsIntro:'Share your listening experience with '+x.title+'.',
    reviewsKey:PATH.replace(/_/g,'-'),
    golden:{backLabel:"Back to the Filin's nest",backHref:'/',mobileHeroHeight:860,resultLabel:'Ultimate Synergy'}
  };
}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null}catch(e){return null}}

var css=document.createElement('style');
css.id='filin-v16-amp-preboot';
css.textContent=
  'html.fp-v16-amp-boot body{visibility:hidden!important}'+
  'html.fp-v16-amp-boot:after{content:"FILIN LABS";position:fixed;inset:0;z-index:2147483646;display:flex;align-items:center;justify-content:center;background:#f8f5f1;color:#2d241b;font-family:Montserrat,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:.18em;visibility:visible!important}'+
  '.fp-v16-source-hidden{display:none!important}';
(document.head||document.documentElement).appendChild(css);
document.documentElement.classList.add('fp-v16-amp-boot');

function quarantine(gl){
  var n=0;if(!document.getElementById(ROOT))return 0;
  if(gl&&gl.isConnected&&!gl.closest('#'+ROOT)){gl.classList.add('fp-v16-source-hidden');n++}
  sourceNodes.forEach(function(r){if(r&&r.isConnected&&!r.closest('#'+ROOT)){r.classList.add('fp-v16-source-hidden');n++}});
  arr(document.querySelectorAll('.t-rec,[id^="rec"]')).forEach(function(r){
    if(r.closest('#'+ROOT)||r.classList.contains('fp-v16-source-hidden'))return;
    var t=cloneText(r),hide=false;
    if(r.querySelector('.js-product')&&!r.closest('.t706,.t1002'))hide=true;
    if(curationMatches(t)>=3)hide=true;
    if((r.querySelector('.tabs-wrapper')||r.querySelector('.perfect-matches-block'))&&tokenScore(t,(profile()&&profile().overview&&profile().overview.title)||'')>=1)hide=true;
    if(hide){r.classList.add('fp-v16-source-hidden');n++}
  });
  state.quarantined=n;pub();return n;
}
function release(){
  if(state.released)return;
  state.released=true;
  document.documentElement.classList.remove('fp-v16-amp-boot');
  document.documentElement.classList.remove('filin-golden-product-prepaint');
  var n=document.getElementById('filin-v16-amp-preboot');if(n)n.remove();
  pub();
}

async function boot(){
  var gl=null;
  try{
    /* Same timing rule as KT66 / NM-2 PASS: inspect GL01 only after Tilda DOM exists. */
    gl=findGl01();
    state.sourceFound=!!gl;state.sourceRecord=gl&&gl.id||'';pub();
    if(!gl)throw new Error(PATH+' GL01 source not found after DOMContentLoaded');

    var candidates=collectGl01(gl,true);
    state.candidates=candidates.length;pub();
    if(!candidates.length)throw new Error(PATH+' GL01 contains no usable raster images');

    var verified=[];
    for(var i=0;i<candidates.length;i++){
      var x=await probe(candidates[i]);
      if(x&&verified.indexOf(x.url)<0)verified.push(x.url);
    }
    state.verified=verified.length;state.urls=verified.slice();pub();
    if(!verified.length)throw new Error(PATH+' GL01 has no verified product photos');

    await load(DEP.rich,function(){return !!window.FilinRichCatalogV2});
    var captured=capture(verified);
    writeProductData(captured);

    await load(DEP.core,function(){return !!(window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles)});
    await load(DEP.registry,function(){return !!window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__});
    state.registryReady=!!window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__;pub();

    var api=window.FilinMasterProductV3;
    if(!api||!api.profiles||typeof api.apply!=='function')throw new Error(PATH+' Golden core API unavailable');
    api.profiles[PATH]=makeProfile(captured);
    state.profileBuilt=true;pub();

    /* One authoritative Golden build; gallery is already the verified GL01 list. */
    api.apply();

    var base=await wait(function(){
      return profile()&&document.querySelector('#'+ROOT+' .v3-shell')&&
        document.querySelectorAll('#'+ROOT+' .v3-thumb').length===verified.length;
    },10000);
    state.baseReady=!!base;pub();
    if(!base)throw new Error(PATH+' Golden base/gallery did not become ready');

    await load(DEP.commerce,function(){return !!window.__FILIN_MASTER_PRODUCT_V3_CLEAN_COMMERCE_V2__});
    state.commerceReady=!!window.__FILIN_MASTER_PRODUCT_V3_CLEAN_COMMERCE_V2__;pub();
    await load(DEP.wishlist,function(){return !!window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V4__});
    state.wishlistReady=!!window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V4__;pub();

    var main=document.querySelector('#'+ROOT+' .v3-main-img');
    if(main){
      main.src=verified[0];
      if(main.complete&&main.naturalWidth>0)state.mainReady=true;
      else state.mainReady=await wait(function(){return main.complete&&main.naturalWidth>0},5000);
    }
    if(!state.mainReady)throw new Error(PATH+' first Golden image did not become ready');

    /* Only now remove migrated Tilda source blocks. */
    quarantine(gl);
    state.ready=true;state.error='';pub();
  }catch(e){
    state.error=String(e&&e.message||e);state.timeout=true;pub();
  }

  requestAnimationFrame(function(){requestAnimationFrame(release)});
  if(state.error)console.warn('[Filin V5.16 AMP GL01]',state.error,state);
  else console.info('[Filin Labs] Master Product V5.16 AMP GL01 ready',state);
}

setTimeout(function(){
  if(!state.released){state.error=state.error||PATH+' V16 failsafe release';state.timeout=true;release()}
},22000);

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0)},{once:true});
else setTimeout(boot,0);
pub();
})();
