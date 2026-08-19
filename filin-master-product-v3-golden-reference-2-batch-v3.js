/* ============================================================
   FILIN LABS — GOLDEN REFERENCE 2 BATCH V3
   Stable migration layer for the approved 19 product pages.

   V3 fixes:
   - hero + curator source records are protected from quarantine
   - gallery source discovery never quarantines hero/curator records
   - one best URL is taken per source image (high-res attrs first)
   - safe gallery controller keeps current image visible until next image loads
   - bad image URLs are skipped instead of showing a blank frame
   - Golden profile is applied immediately after core load (no timer race)
   - source blocks are quarantined only after the Golden root exists
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_GR2_BATCH_V3__)return;

var VERSION='3.0.0';
var ROOT_ID='filin-master-product-v3';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ALLOWED=[
  'perun_dark_sound','volga_tone_priboi_1','orvellium_nocturne_aura',
  'flatvox_gbc_dj_hulk','snorry_si_5_mk_2_headphones','snorry_joule_headphones',
  'perun_modern','snorry_si_6_headphones','flatvox_gbc','flatvox_kona',
  'phenomenon_spatium','filin_audio_model_1_standard_v2',
  'filin_audio_model_1_premium_v2','perun_modern_closed','phenomenon_libratum',
  'snorry_nm_2_headphones','filin_audio_limited','filin_audio_quadron',
  'snorry_trion_mk_3'
];
if(ALLOWED.indexOf(PATH)<0)return;
window.__FILIN_GR2_BATCH_V3__=true;

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
  commerce:false,wishlist:false,images:0,tabs:0,curation:0,pm:false,price:0,
  title:'',sourceRecords:0,protectedRecords:0,quarantined:0,
  galleryGuard:false,badImages:0,errors:[]
};
var sourceNodes=[],sourceIds=Object.create(null),protectedNodes=[],protectedIds=Object.create(null);
var observer=null,guardObserver=null;

function publish(){window.__FILIN_GR2_BATCH_V3_STATE__=JSON.parse(JSON.stringify(state));}
function str(v){return String(v==null?'':v).trim();}
function arr(v){return Array.prototype.slice.call(v||[]);}
function esc(v){return str(v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function norm(v){return str(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
function num(v){var n=Number(str(v).replace(/[^0-9.,-]/g,'').replace(/,/g,''));return Number.isFinite(n)?n:0;}
function fail(where,e){var m=where+': '+String(e&&e.message||e);state.errors.push(m);console.warn('[GR2 Batch V3]',m);publish();}
function toUrl(v){try{return new URL(str(v),location.origin).href;}catch(e){return'';}}
function recOf(n){return n&&n.closest?n.closest('.t-rec,[id^="rec"]'):null;}

function cleanClone(node){
  if(!node)return null;
  var c=node.cloneNode(true);
  arr(c.querySelectorAll('script,style,noscript,template,svg')).forEach(function(x){x.remove();});
  return c;
}
function cleanText(node){var c=cleanClone(node);return norm(c&&c.textContent);}
function isCodeText(t){return /(?:#rec\d+|t_onReady|t_onFuncLoad|\.t\d+__|font-size\s*:|@media\s|function\s*\(|document\.|querySelector|nth-child|font-family\s*:)/i.test(str(t));}

var CUR_DEFS=[
  {re:/cat(?:h)?egory\s*&?\s*budget\s*tier|budget\s*tier/i,title:'Category & Budget Tier'},
  {re:/tags?\s*&\s*features|tags?\s+features/i,title:'Tags & Features'},
  {re:/sonic\s*signature/i,title:'Sonic Signature'},
  {re:/high\s*technolog/i,title:'High Technologies'},
  {re:/curator.?s\s*choice/i,title:"Curator’s Choice"},
  {re:/synergy\s*match/i,title:'Synergy Match'},
  {re:/genres?\s*accord/i,title:'Genres Accord'}
];
function curationMatches(t){var n=0;CUR_DEFS.forEach(function(d){if(d.re.test(str(t)))n++;});return n;}
function isCurationText(t){return curationMatches(t)>0;}

function isProtected(n){
  if(!n)return false;
  var r=recOf(n)||n;
  if(protectedNodes.indexOf(r)>=0)return true;
  if(r.id&&protectedIds[r.id])return true;
  if(r.querySelector&&r.querySelector('.fp-v3-hero-cover,.fp-v3-curator-record'))return true;
  if(r.classList&&(r.classList.contains('fp-v3-curator-record')||r.classList.contains('fp-gr2-protected')))return true;
  return false;
}
function protect(n,label){
  var r=recOf(n)||n;if(!r||r===document.body||r===document.documentElement)return;
  if(protectedNodes.indexOf(r)<0)protectedNodes.push(r);
  if(r.id)protectedIds[r.id]=1;
  r.classList.add('fp-gr2-protected');
  if(label)r.setAttribute('data-fp-gr2-protected',label);
  r.classList.remove('fp-gr2-source-hidden');
  state.protectedRecords=protectedNodes.length;publish();
}
function remember(n){
  var r=recOf(n)||n;
  if(!r||r===document.body||r===document.documentElement||r.closest('#'+ROOT_ID)||isProtected(r))return;
  if(sourceNodes.indexOf(r)<0)sourceNodes.push(r);
  if(r.id)sourceIds[r.id]=1;
  r.setAttribute('data-fp-gr2-source','1');
  state.sourceRecords=sourceNodes.length;publish();
}

function richProduct(){
  try{return window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products&&window.FilinRichCatalogV2.products[PATH]||null;}
  catch(e){return null;}
}

function validImage(u){
  return !!u&&/^https?:\/\//i.test(u)&&
    !/(?:blank\.gif|empty\.png|pixel|favicon|logo|sprite|cookie|payment|telegram|whatsapp|youtube|icon[-_.]|social|arrow)/i.test(u);
}
function pushImage(out,raw){var u=toUrl(raw);if(validImage(u)&&out.indexOf(u)<0)out.push(u);}
function bestImageOf(el){
  if(!el||!el.getAttribute)return'';
  var attrs=['data-img-zoom-url','data-original','data-src','data-lazy-src','data-content-cover-bg','src'];
  for(var i=0;i<attrs.length;i++){var u=toUrl(el.getAttribute(attrs[i]));if(validImage(u))return u;}
  var st=el.getAttribute('style')||'',m=st.match(/background(?:-image)?\s*:\s*url\(["']?([^"')]+)["']?\)/i);
  if(m){var u2=toUrl(m[1]);if(validImage(u2))return u2;}
  try{var bg=getComputedStyle(el).backgroundImage||'',m2=bg.match(/url\(["']?([^"')]+)["']?\)/i);if(m2){var u3=toUrl(m2[1]);if(validImage(u3))return u3;}}catch(e){}
  return'';
}
function imagesIn(scope){
  var out=[];if(!scope)return out;
  var sel='img,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[data-content-cover-bg],.t-bgimg,.t-cover__carrier,[style*="background-image"]';
  arr(scope.querySelectorAll(sel)).forEach(function(el){
    if(el.closest('.t-store__card,.t-card,.t1002,.t706,.fp-curation,.t491__col'))return;
    var u=bestImageOf(el);if(u&&out.indexOf(u)<0)out.push(u);
  });
  return out;
}

function findLegacyProduct(){
  var xs=arr(document.querySelectorAll('.js-product')).filter(function(x){return !x.closest('#'+ROOT_ID)&&!x.closest('.t706,.t1002,.t-popup');});
  xs.sort(function(a,b){
    function score(x){return(x.querySelector('.js-product-name')?5:0)+(x.querySelector('.js-product-price')?5:0)+(x.querySelector('.tabs-wrapper')?8:0)+(x.querySelector('.perfect-matches-block')?6:0);}
    return score(b)-score(a);
  });
  return xs[0]||null;
}
function preEnvelope(product){
  var rec=recOf(product);if(!rec||!rec.parentNode)return;
  var p=rec.parentElement;
  if(p&&p.classList&&p.classList.contains('fp-v3-tilda-record-envelope-v4'))return;
  var wrap=document.createElement('div');
  wrap.className='t-rec fp-v3-tilda-record-envelope-v4 fp-gr2-root-envelope';
  wrap.id='rec-fp-gr2-'+PATH.replace(/[^a-z0-9_-]/gi,'-');
  wrap.setAttribute('data-record-type','215');wrap.setAttribute('data-animationappear','off');
  wrap.style.cssText='margin:0!important;padding:0!important;border:0!important;background:transparent!important;';
  rec.parentNode.insertBefore(wrap,rec);wrap.appendChild(rec);
}

function findHero(){
  var cover=document.querySelector('.t-cover');
  if(!cover)return{h1:'',desc:'',bg:'',rec:null};
  var rec=recOf(cover)||recOf(cover.querySelector('h1,.t-title'));
  if(rec)protect(rec,'hero');
  var h=cover.querySelector('h1,.t-title');
  var texts=arr(cover.querySelectorAll('.t-descr,.t-text,p')).map(cleanText).filter(function(t){return t.length>24&&!/back to the/i.test(t)&&!isCodeText(t);});
  var ims=imagesIn(cover);
  return{h1:cleanText(h),desc:texts[0]||'',bg:ims[0]||'',rec:rec};
}
function findCurator(){
  var xs=arr(document.querySelectorAll('p,.t-text,.t-descr,div')).filter(function(x){
    if(x.closest('#'+ROOT_ID)||x.closest('.t706,.t1002'))return false;
    var t=cleanText(x);return t&&t.length<500&&(/personally listened/i.test(t)||(/handcrafted by/i.test(t)&&/filin labs/i.test(t)))&&!isCodeText(t);
  });
  xs.sort(function(a,b){return cleanText(a).length-cleanText(b).length;});
  var n=xs[0]||null;if(n)protect(n,'curator');
  return{node:n,text:n?cleanText(n):'',rec:n?recOf(n):null};
}

function tokenScore(text,name){
  var toks=norm(name).toLowerCase().split(/[^a-z0-9]+/).filter(function(x){return x.length>2;});
  var t=norm(text).toLowerCase(),s=0;toks.forEach(function(k){if(t.indexOf(k)>=0)s++;});return s;
}
function findOverview(name,q){
  var hs=arr(document.querySelectorAll('h2,h3')).filter(function(h){
    var t=cleanText(h);return t&&!h.closest('#'+ROOT_ID)&&!isCurationText(t)&&!/perfect matches|shipping|contact|legal|reviews?/i.test(t);
  });
  hs.sort(function(a,b){return tokenScore(cleanText(b),name)-tokenScore(cleanText(a),name);});
  var h=hs[0]||null,rec=recOf(h),paras=[];
  if(rec){
    var firstCur=arr(rec.querySelectorAll('h2,h3,h4')).find(function(x){return isCurationText(cleanText(x));});
    arr(rec.querySelectorAll('p,.t-text,.t-descr')).forEach(function(p){
      if(firstCur&&(firstCur.compareDocumentPosition(p)&Node.DOCUMENT_POSITION_FOLLOWING))return;
      var t=cleanText(p);if(t.length<25||isCodeText(t)||isCurationText(t)||/personally listened|perfect matches|total\s*\*/i.test(t))return;
      if(paras.indexOf(t)<0)paras.push(t);
    });
    remember(rec);
  }
  var title=h?cleanText(h):((q&&q.name)||name);
  var html=paras.slice(0,8).map(function(t){return'<p>'+esc(t)+'</p>';}).join('');
  if(!html&&q&&q.description)html='<p>'+esc(q.description)+'</p>';
  return{title:title,html:html,rec:rec,heading:h};
}

function smallestCurationCard(h){
  var n=h,best=null,steps=0;
  while(n&&n!==document.body&&steps++<9){
    var t=cleanText(n),count=curationMatches(t);
    if(count===1&&t.length<=1600&&!isCodeText(t))best=n;
    if(n.matches&&n.matches('.t491__col,.t-col,[class*="__col"]')&&best)break;
    if(n.matches&&n.matches('.t-rec,[id^="rec"]'))break;
    n=n.parentElement;
  }
  return best||h.parentElement;
}
function curationBody(card,h){
  if(!card)return'';
  var parts=[];
  arr(card.querySelectorAll('p,.t-text,.t-descr,.t-name')).forEach(function(x){
    if(x===h||x.contains(h))return;
    var t=cleanText(x);if(!t||t.length<2||isCodeText(t)||curationMatches(t)>0)return;
    if(parts.indexOf(t)<0)parts.push(t);
  });
  if(!parts.length){
    var all=cleanText(card),head=cleanText(h);if(head&&all.toLowerCase().indexOf(head.toLowerCase())===0)all=norm(all.slice(head.length));
    if(all&&!isCodeText(all)&&curationMatches(all)===0)parts=[all];
  }
  return parts.join('\n').slice(0,900);
}
function extractCuration(){
  var hs=arr(document.querySelectorAll('h2,h3,h4')).filter(function(h){return !h.closest('#'+ROOT_ID);});
  var out=[];
  CUR_DEFS.forEach(function(def){
    var h=hs.find(function(x){return def.re.test(cleanText(x));});if(!h)return;
    var card=smallestCurationCard(h),body=curationBody(card,h);
    if(!body)return;
    out.push({title:def.title,html:'<p>'+esc(body).replace(/\n+/g,'<br>')+'</p>'});
    remember(card);
  });
  return out;
}

function badGalleryRecord(rec){
  if(!rec||isProtected(rec))return true;
  var t=cleanText(rec);
  return rec.closest('header,footer,.t706,.t1002')||curationMatches(t)>0||
    /hi-fi\s*&\s*high-end\s*equipment|browse catalogue|you may also like|the review #|shipping\s*&\s*payment|contact\s*&\s*support|legal information|perfect matches|total\s*\*/i.test(t)||
    rec.querySelectorAll('.t-store__card,.js-product').length>1;
}
function collectGallery(q,overview){
  var out=[];
  if(q&&Array.isArray(q.images))q.images.forEach(function(x){pushImage(out,x);});
  var recs=arr(document.querySelectorAll('.t-rec,[id^="rec"]'));
  var idx=overview.rec?recs.indexOf(overview.rec):-1,candidates=[];
  if(idx>=0){
    for(var i=Math.max(0,idx-4);i<=Math.min(recs.length-1,idx+1);i++){
      var r=recs[i];if(!badGalleryRecord(r))candidates.push(r);
    }
  }
  if(!candidates.length){
    candidates=recs.map(function(r){var im=imagesIn(r);return{r:r,im:im,score:(Math.min(im.length,8)*2)+tokenScore(cleanText(r),overview.title)};})
      .filter(function(x){return x.im.length&&!badGalleryRecord(x.r);}).sort(function(a,b){return b.score-a.score;}).slice(0,3).map(function(x){return x.r;});
  }
  candidates.forEach(function(r){
    var im=imagesIn(r);if(!im.length)return;
    im.forEach(function(x){if(out.length<12)pushImage(out,x);});
    if(cleanText(r).length<80&&im.length>0&&!isProtected(r))remember(r);
  });
  return out.slice(0,12);
}

function sourceCommerce(product){
  var tabs=product&&product.querySelector('.tabs-wrapper');
  var pm=product&&product.querySelector('.perfect-matches-block');
  if(!tabs)tabs=arr(document.querySelectorAll('.tabs-wrapper')).find(function(x){return !x.closest('#'+ROOT_ID)&&!x.closest('.t706,.t1002');})||null;
  if(!pm)pm=arr(document.querySelectorAll('.perfect-matches-block')).find(function(x){return !x.closest('#'+ROOT_ID)&&!x.closest('.t706,.t1002');})||null;
  if(tabs)remember(tabs);if(pm)remember(pm);if(product)remember(product);
  return{tabs:tabs,pm:pm,inner:(pm?pm.outerHTML:'')+(tabs?tabs.outerHTML:'')};
}

function capture(){
  var q=richProduct(),product=findLegacyProduct(),hero=findHero(),cur=findCurator();
  if(product)preEnvelope(product);
  var cartName=cleanText(product&&product.querySelector('.js-product-name'));
  var baseName=cartName||(q&&q.name)||hero.h1||document.title;
  var overview=findOverview(baseName,q);
  var curation=extractCuration();
  var gallery=collectGallery(q,overview);
  var commerce=sourceCommerce(product);
  var price=0;
  if(product){var pe=product.querySelector('.js-product-price,[data-product-price-def]');price=num(pe&&pe.getAttribute('data-product-price-def'))||num(pe&&pe.textContent);}
  if(!price)price=Math.round(Number(q&&q.price)||0);
  var bg=hero.bg||(gallery[0]||''),desc=hero.desc||(q&&q.description)||'';
  state.images=gallery.length;state.tabs=commerce.tabs?commerce.tabs.querySelectorAll('.tabs-header .tab-btn').length:0;
  state.curation=curation.length;state.pm=!!commerce.pm;state.price=price;state.title=overview.title;publish();
  return{
    rich:q,hero:hero.h1||(q&&q.name)||overview.title,desc:desc,bg:bg,
    curator:cur.text,title:overview.title,html:overview.html,images:gallery,curation:curation,
    price:price,cart:cartName||overview.title,inner:commerce.inner,
    category:q&&q.categories&&q.categories[0]||'Products',brand:q&&q.brand||''
  };
}

function writeProductData(x){
  var el=document.getElementById('product-data'),d={};if(el)try{d=JSON.parse(el.textContent||'{}')||{};}catch(e){}
  d.slug=PATH;d.id=d.id||PATH.replace(/_/g,'-');d.brand=x.brand||d.brand||'';d.name=x.title;d.model=x.title;d.category=x.category;
  d.commerce=d.commerce||{};d.commerce.currency='USD';d.commerce.regularPrice=x.price;
  d.page=d.page||{};d.page.productPath='/'+PATH;
  if(!el){el=document.createElement('script');el.id='product-data';el.type='application/json';(document.body||document.documentElement).appendChild(el);}
  el.textContent=JSON.stringify(d);
}
function makeProfile(x){
  return{
    schemaVersion:2,slug:PATH,id:PATH.replace(/_/g,'-'),category:str(x.category).toLowerCase().replace(/\s+/g,'-'),currency:'USD',
    hero:{staticH1:x.hero,description:x.desc,background:x.bg},curator:x.curator,
    overview:{title:x.title,html:x.html||('<p>'+esc(x.desc)+'</p>'),galleryImages:x.images},curation:x.curation,
    commerce:{basePrice:x.price,displayName:x.title,cartName:x.cart,stickyTitle:x.title,innerHTML:x.inner},
    reviewsCTA:'View The Reviews of '+x.title,reviewsQuery:x.title,reviewsIntro:'Share your listening experience with '+x.title+'.',
    reviewsKey:PATH.replace(/_/g,'-'),golden:{backLabel:"Back to the Filin's nest",backHref:'/',mobileHeroHeight:860,resultLabel:'Ultimate Synergy'}
  };
}
function fillExisting(p,x){
  p=JSON.parse(JSON.stringify(p));p.slug=PATH;p.hero=p.hero||{};p.overview=p.overview||{};p.commerce=p.commerce||{};
  if(!p.hero.staticH1)p.hero.staticH1=x.hero;if(!p.hero.description)p.hero.description=x.desc;if(!p.hero.background)p.hero.background=x.bg;
  if(!p.overview.galleryImages||!p.overview.galleryImages.length)p.overview.galleryImages=x.images;
  if(!p.overview.title)p.overview.title=x.title;if(!p.overview.html)p.overview.html=x.html;
  if(!p.curator)p.curator=x.curator;if(!Array.isArray(p.curation)||!p.curation.length)p.curation=x.curation;
  if(!p.commerce.basePrice)p.commerce.basePrice=x.price;if(!p.commerce.displayName)p.commerce.displayName=x.title;
  if(!p.commerce.cartName)p.commerce.cartName=x.cart;if(!p.commerce.stickyTitle)p.commerce.stickyTitle=x.title;if(!p.commerce.innerHTML)p.commerce.innerHTML=x.inner;
  return p;
}

function installStyle(){
  if(document.getElementById('fp-gr2-v3-style'))return;
  var s=document.createElement('style');s.id='fp-gr2-v3-style';
  s.textContent='.fp-gr2-source-hidden{display:none!important}#'+ROOT_ID+' .v3-stage.fp-gr2-img-loading:after{content:"";position:absolute;left:50%;top:50%;width:20px;height:20px;margin:-10px;border:2px solid rgba(120,120,120,.3);border-top-color:#777;border-radius:50%;animation:fpgr2spin .7s linear infinite}@keyframes fpgr2spin{to{transform:rotate(360deg)}}';
  (document.head||document.documentElement).appendChild(s);
}
function quarantinePass(){
  if(!document.getElementById(ROOT_ID))return;
  var n=0;
  protectedNodes.forEach(function(r){if(r&&r.isConnected)r.classList.remove('fp-gr2-source-hidden');});
  sourceNodes.forEach(function(r){if(r&&r.isConnected&&!r.closest('#'+ROOT_ID)&&!isProtected(r)){r.classList.add('fp-gr2-source-hidden');n++;}});
  Object.keys(sourceIds).forEach(function(id){var r=document.getElementById(id);if(r&&!r.closest('#'+ROOT_ID)&&!isProtected(r)){r.classList.add('fp-gr2-source-hidden');n++;}});
  arr(document.querySelectorAll('.t-rec,[id^="rec"]')).forEach(function(r){
    if(r.closest('#'+ROOT_ID)||r.classList.contains('fp-gr2-root-envelope')||isProtected(r))return;
    var t=cleanText(r),hide=false;
    if(r.querySelector('.js-product')&&!r.closest('.t706,.t1002'))hide=true;
    if(curationMatches(t)>=3)hide=true;
    if((r.querySelector('.tabs-wrapper')||r.querySelector('.perfect-matches-block'))&&tokenScore(t,state.title)>=1)hide=true;
    if(hide){r.classList.add('fp-gr2-source-hidden');n++;}
  });
  state.quarantined=n;publish();
}
function watchLegacy(){
  if(observer)observer.disconnect();if(!window.MutationObserver)return;
  var timer=null;observer=new MutationObserver(function(){clearTimeout(timer);timer=setTimeout(quarantinePass,80);});
  observer.observe(document.body||document.documentElement,{childList:true,subtree:true});
}

function installGalleryGuard(){
  var root=document.getElementById(ROOT_ID);if(!root)return false;
  if(root.dataset.fpGr2GalleryGuard==='3')return true;
  root.dataset.fpGr2GalleryGuard='3';
  var main=root.querySelector('.v3-main-img'),stage=root.querySelector('.v3-stage');
  if(!main)return false;
  var bad=Object.create(null),loading=false,seq=0;
  function thumbs(){return arr(root.querySelectorAll('.v3-thumb'));}
  function activeIndex(){var ts=thumbs(),a=root.querySelector('.v3-thumb.active'),i=ts.indexOf(a);return i>=0?i:0;}
  function thumbUrl(t){var im=t&&t.querySelector('img');return im&&(im.currentSrc||im.getAttribute('src')||im.src)||'';}
  function setActive(t){thumbs().forEach(function(x){x.classList.toggle('active',x===t);});}
  function safeShow(index,dir){
    var ts=thumbs();if(!ts.length||loading)return;
    var tries=0,i=((index%ts.length)+ts.length)%ts.length;
    function attempt(){
      if(tries++>=ts.length){loading=false;if(stage)stage.classList.remove('fp-gr2-img-loading');return;}
      var t=ts[i],u=thumbUrl(t);
      if(!u||bad[u]){i=(i+(dir||1)+ts.length)%ts.length;attempt();return;}
      if(main.src===u||main.currentSrc===u){setActive(t);return;}
      var token=++seq,probe=new Image();loading=true;if(stage)stage.classList.add('fp-gr2-img-loading');
      var done=false,tm=setTimeout(function(){finish(false);},4500);
      function finish(ok){
        if(done||token!==seq)return;done=true;clearTimeout(tm);loading=false;if(stage)stage.classList.remove('fp-gr2-img-loading');
        if(ok){main.src=u;setActive(t);}
        else{bad[u]=1;state.badImages=Object.keys(bad).length;publish();i=(i+(dir||1)+ts.length)%ts.length;attempt();}
      }
      probe.onload=function(){finish(probe.naturalWidth>80&&probe.naturalHeight>80);};
      probe.onerror=function(){finish(false);};probe.src=u;
    }
    attempt();
  }
  root.addEventListener('click',function(ev){
    var t=ev.target&&ev.target.closest&&ev.target.closest('.v3-thumb,.v3-prev,.v3-next');
    if(!t||!root.contains(t))return;
    ev.preventDefault();ev.stopPropagation();if(ev.stopImmediatePropagation)ev.stopImmediatePropagation();
    var ts=thumbs(),i=activeIndex();
    if(t.classList.contains('v3-thumb'))safeShow(ts.indexOf(t),1);
    else if(t.classList.contains('v3-prev'))safeShow(i-1,-1);
    else safeShow(i+1,1);
  },true);
  main.addEventListener('error',function(){safeShow(activeIndex()+1,1);});
  if(main.complete&&main.naturalWidth===0)setTimeout(function(){safeShow(activeIndex()+1,1);},0);
  setTimeout(function(){
    var ts=thumbs(),i=activeIndex(),t=ts[(i+1)%ts.length],u=thumbUrl(t);
    if(u&&u!==main.src){var im=new Image();im.src=u;}
  },300);
  state.galleryGuard=true;publish();return true;
}
function watchRootForGuard(){
  if(guardObserver)guardObserver.disconnect();if(!window.MutationObserver)return;
  guardObserver=new MutationObserver(function(){installGalleryGuard();});
  guardObserver.observe(document.documentElement,{childList:true,subtree:true});
}

function loaded(src){var f=src.split('/').pop();return arr(document.scripts).some(function(x){return str(x.src).indexOf(f)>=0;});}
function load(src,test){
  return new Promise(function(resolve,reject){
    if(test&&test())return resolve(true);
    if(loaded(src)){var k=0,t=setInterval(function(){if(!test||test()){clearInterval(t);resolve(true);}else if(++k>100){clearInterval(t);resolve(false);}},60);return;}
    var s=document.createElement('script');s.src=src;s.async=true;s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('load '+src));};(document.head||document.documentElement).appendChild(s);
  });
}

async function boot(){
  installStyle();
  try{await load(DEP.rich,function(){return!!window.FilinRichCatalogV2;});state.rich=!!window.FilinRichCatalogV2;}catch(e){fail('rich',e);}
  var captured=capture();writeProductData(captured);
  try{await load(DEP.core,function(){return!!(window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles);});state.core=!!window.FilinMasterProductV3;}catch(e){fail('core',e);}
  try{
    var api=window.FilinMasterProductV3;if(!api||!api.profiles||typeof api.apply!=='function')throw new Error('core API unavailable');
    api.profiles[PATH]=api.profiles[PATH]?fillExisting(api.profiles[PATH],captured):makeProfile(captured);
    api.apply();
  }catch(e){fail('profile',e);}
  installGalleryGuard();watchRootForGuard();
  quarantinePass();watchLegacy();
  try{
    if(!window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__)await load(DEP.registry,function(){return!!window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__;});
    state.registry=!!window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__;
  }catch(e){fail('registry',e);}
  installGalleryGuard();
  try{await load(DEP.commerce,function(){return!!window.__FILIN_MASTER_PRODUCT_V3_CLEAN_COMMERCE_V2__;});state.commerce=!!window.__FILIN_MASTER_PRODUCT_V3_CLEAN_COMMERCE_V2__;}catch(e){fail('commerce',e);}
  try{await load(DEP.wishlist,function(){return!!window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V4__;});state.wishlist=!!window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V4__;}catch(e){fail('wishlist',e);}
  [40,120,300,700,1500,3000,6000].forEach(function(ms){setTimeout(function(){quarantinePass();installGalleryGuard();},ms);});
  setTimeout(function(){
    state.ready=!!document.getElementById(ROOT_ID);publish();
    console.info('[GR2 Batch V3] READY',window.__FILIN_GR2_BATCH_V3_STATE__);
  },260);
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,10);},{once:true});else setTimeout(boot,0);
publish();
})();
