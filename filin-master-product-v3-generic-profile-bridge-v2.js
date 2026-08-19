/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 GENERIC PROFILE BRIDGE V2
   TEST / GOLDEN-CANDIDATE migration layer.

   V2 fixes:
   - pre-paint quarantine so copied Quadron/Grand Tower content never flashes
   - captures original #product-data before legacy bridges can enrich/overwrite it
   - concise product naming from brand + model
   - generic, product-correct curation (never inherits another product's curation)
   - neutral curator wording (no unsupported artisan claim)
   - sticky header cleanup for long SEO/catalog names
   - fail-open safety if V3 cannot initialize

   This is universal. It is NOT a per-product profile.
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_MASTER_PRODUCT_V3_GENERIC_PROFILE_BRIDGE_V2__) return;
  window.__FILIN_MASTER_PRODUCT_V3_GENERIC_PROFILE_BRIDGE_V2__=true;

  var VERSION='2.0.0';
  var MAX_TRIES=120;
  var tries=0;
  var STYLE_ID='filin-master-product-v3-generic-bridge-v2-style';
  var PENDING_ATTR='data-fpv3-generic-pending';
  var READY_ATTR='data-fpv3-generic-ready';
  var SEED_SNAPSHOT_KEY='__FILIN_MASTER_PRODUCT_V3_GENERIC_SEED_V2__';
  var seedObserver=null;
  var revealed=false;

  function str(v){return String(v==null?'':v).trim();}
  function num(v){var n=Number(v);return Number.isFinite(n)?n:0;}
  function esc(v){return str(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
  function firstText(){for(var i=0;i<arguments.length;i++){var s=str(arguments[i]);if(s)return s;}return '';}
  function money(v,currency){var n=num(v);var code=firstText(currency,'USD');try{return new Intl.NumberFormat('en-US',{style:'currency',currency:code,maximumFractionDigits:0}).format(n);}catch(e){return '$'+n.toLocaleString('en-US');}}

  function installPrepaintStyle(){
    if(document.getElementById(STYLE_ID)) return;
    var s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent='html['+PENDING_ATTR+'="1"] #allrecords{opacity:0!important;pointer-events:none!important}'+
      'html['+READY_ATTR+'="1"] #allrecords{opacity:1!important;transition:opacity .12s ease-out}';
    (document.head||document.documentElement).appendChild(s);
  }

  installPrepaintStyle();
  document.documentElement.setAttribute(PENDING_ATTR,'1');

  function captureSeed(){
    if(window[SEED_SNAPSHOT_KEY]) return true;
    var el=document.getElementById('product-data');
    if(!el) return false;
    try{
      var d=JSON.parse(el.textContent||'{}');
      if(d&&d.slug){
        window[SEED_SNAPSHOT_KEY]=JSON.parse(JSON.stringify(d));
        console.info('[Master Product V3 Generic Bridge] ORIGINAL SEED CAPTURED',{version:VERSION,slug:d.slug});
        return true;
      }
    }catch(e){
      console.warn('[Master Product V3 Generic Bridge] seed capture failed',e);
    }
    return false;
  }

  if(!captureSeed() && window.MutationObserver){
    seedObserver=new MutationObserver(function(){if(captureSeed()&&seedObserver){seedObserver.disconnect();seedObserver=null;}});
    seedObserver.observe(document.documentElement,{childList:true,subtree:true});
  }

  function readSeed(){
    if(window[SEED_SNAPSHOT_KEY]) return window[SEED_SNAPSHOT_KEY];
    captureSeed();
    if(window[SEED_SNAPSHOT_KEY]) return window[SEED_SNAPSHOT_KEY];
    try{
      var el=document.getElementById('product-data');
      return el?JSON.parse(el.textContent||'{}'):{};
    }catch(e){
      console.error('[Master Product V3 Generic Bridge] invalid #product-data',e);
      return {};
    }
  }

  function normalizePath(v){
    var s=str(v);
    if(!s) return '';
    try{return new URL(s,location.origin).pathname.replace(/^\/+|\/+$/g,'');}
    catch(e){return s.replace(/^https?:\/\/[^/]+/i,'').replace(/^\/+|\/+$/g,'');}
  }

  function findRich(seed){
    var rich=window.FilinRichCatalogV2;
    var products=rich&&rich.products;
    if(!products) return null;
    var slug=str(seed.slug), id=str(seed.id), targetPath=normalizePath(seed.page&&seed.page.productPath);
    if(slug&&products[slug]) return products[slug];
    var keys=Object.keys(products);
    for(var i=0;i<keys.length;i++){
      var k=keys[i],p=products[k];if(!p)continue;
      if(id&&str(p.id)===id)return p;
      if(slug&&str(p.slug)===slug)return p;
      if(targetPath){var pp=normalizePath(p.url||p.path||p.productPath||'');if(pp&&pp===targetPath)return p;}
    }
    return null;
  }

  function imageUrl(v){
    if(!v)return '';
    if(typeof v==='string')return str(v);
    if(typeof v==='object')return str(v.url||v.src||v.original||v.large||v.image||'');
    return '';
  }

  function collectImages(seed,rich){
    var raw=[];
    function add(v){if(Array.isArray(v)){v.forEach(add);return;}var u=imageUrl(v);if(u)raw.push(u);}
    if(rich){add(rich.images);add(rich.galleryImages);add(rich.gallery);add(rich.image);add(rich.cover);add(rich.photo);}
    if(seed){add(seed.images);add(seed.galleryImages);add(seed.image);add(seed.cover);}
    var seen=Object.create(null),out=[];
    raw.forEach(function(u){u=str(u);if(!u||/^data:/i.test(u)||seen[u])return;seen[u]=1;out.push(u);});
    return out;
  }

  function titleCaseCategory(v){
    return str(v).replace(/[-_]+/g,' ').replace(/\b\w/g,function(m){return m.toUpperCase();});
  }

  function cleanDescription(v){
    var s=str(v).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
    return s;
  }

  function conciseIdentity(seed,rich){
    var brand=firstText(seed.brand,rich&&rich.brand);
    var model=firstText(seed.model,rich&&rich.model);
    var brandModel=[brand,model].filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
    var displayName=firstText(brandModel,seed.name,rich&&rich.name,str(seed.slug).replace(/_/g,' '));
    var stickyTitle=firstText(model,displayName);
    return {brand:brand,model:model,displayName:displayName,stickyTitle:stickyTitle};
  }

  function buildMinimalCommerceHTML(displayName,price){
    return '<div class="purchase-container">'+
      '<span class="js-product-name" id="tilda-product-name" style="display:none;">'+esc(displayName)+'</span>'+
      '<div class="price-title">Total*: $<span class="js-product-price" id="main-price">'+String(price)+'</span></div>'+
      '<a class="buy-btn js-product-btn" href="#order">Buy Now</a>'+
      '</div>';
  }

  function buildCuration(seed,rich,identity,price,currency,description){
    var category=titleCaseCategory(firstText(seed.category,rich&&rich.category,'Product'));
    var focus=description;
    if(focus.length>210) focus=focus.slice(0,207).replace(/\s+\S*$/,'')+'…';
    return [
      {title:'Category & Price',html:'<strong>'+esc(category)+'</strong><br/>'+esc(money(price,currency))},
      {title:'Brand & Model',html:'<strong>'+esc(identity.brand||'Filin Labs Selection')+'</strong><br/>'+esc(identity.model||identity.displayName)},
      {title:'Product Focus',html:esc(focus||identity.displayName)},
      {title:'Curator’s Choice',html:'Personally selected & curated by Filin Labs Kazakhstan.'}
    ];
  }

  function buildProfile(seed,rich){
    var slug=str(seed.slug);
    var seedCommerce=seed.commerce||{};
    var identity=conciseIdentity(seed,rich);
    var price=num(seedCommerce.regularPrice||seedCommerce.basePrice||(rich&&rich.price));
    var currency=firstText(seedCommerce.currency,rich&&rich.currency,'USD');
    var images=collectImages(seed,rich);
    var description=cleanDescription(firstText(rich&&rich.shortDescription,rich&&rich.description,rich&&rich.excerpt,seed.description,identity.displayName));
    var overviewHtml='';
    if(rich) overviewHtml=firstText(rich.overviewHtml,rich.html,rich.descriptionHtml);
    if(!overviewHtml) overviewHtml='<p>'+esc(description)+'</p>';

    return {
      schemaVersion:2,
      slug:slug,
      id:firstText(seed.id,rich&&rich.id,slug.replace(/_/g,'-')),
      category:firstText(seed.category,rich&&rich.category,'other'),
      currency:currency,
      hero:{staticH1:identity.displayName,description:description,background:images[0]||''},
      curator:'Personally selected & curated by Filin Labs Kazakhstan.',
      overview:{title:identity.displayName,html:overviewHtml,galleryImages:images},
      curation:buildCuration(seed,rich,identity,price,currency,description),
      commerce:{
        basePrice:price,
        displayName:identity.displayName,
        cartName:identity.displayName,
        stickyTitle:identity.stickyTitle,
        innerHTML:buildMinimalCommerceHTML(identity.displayName,price)
      },
      reviewsCTA:'View The Reviews of '+identity.displayName,
      reviewsQuery:identity.displayName,
      reviewsIntro:'Share your listening experience with '+identity.displayName+'.',
      golden:{backLabel:"Back to the Filin's nest",backHref:'/',mobileHeroHeight:860,resultLabel:'Ultimate Synergy'},
      reviewsKey:firstText(seed.reviews&&seed.reviews.key,slug.replace(/_/g,'-')),
      registryMeta:{version:'generic-bridge-v2',generic:true,sourcePath:firstText(seed.page&&seed.page.productPath,rich&&rich.url,rich&&rich.path)}
    };
  }

  function isStickyLeaf(el){
    if(!el||el.children.length)return false;
    var p=el;
    for(var i=0;i<7&&p;i++,p=p.parentElement){
      try{var pos=getComputedStyle(p).position;if(pos==='fixed'||pos==='sticky')return true;}catch(e){}
    }
    return false;
  }

  function syncStickyHeader(seed,rich,p){
    if(!p||!p.commerce)return;
    var wanted=str(p.commerce.stickyTitle||p.commerce.displayName);
    if(!wanted)return;
    var candidates=[str(seed.name),str(rich&&rich.name),str(p.commerce.displayName)].filter(Boolean);
    Array.prototype.slice.call(document.querySelectorAll('body *')).forEach(function(el){
      if(!isStickyLeaf(el))return;
      var t=str(el.textContent);if(!t||t.length>220)return;
      var hit=candidates.some(function(c){return c&&t===c;});
      if(!hit && /\|\s*High-End|Audiophile Grade/i.test(t)) hit=true;
      if(hit && !/BUY NOW|^\$|^\d/.test(t)) el.textContent=wanted;
    });
  }

  function reveal(){
    if(revealed)return;
    revealed=true;
    if(seedObserver){seedObserver.disconnect();seedObserver=null;}
    requestAnimationFrame(function(){requestAnimationFrame(function(){
      document.documentElement.removeAttribute(PENDING_ATTR);
      document.documentElement.setAttribute(READY_ATTR,'1');
      setTimeout(function(){document.documentElement.removeAttribute(READY_ATTR);},250);
    });});
  }

  function install(){
    tries++;
    var api=window.FilinMasterProductV3;
    var seed=readSeed();
    var slug=str(seed.slug);
    if(!api||!api.profiles||typeof api.apply!=='function'||!slug)return false;

    if(api.profiles[slug]){
      console.info('[Master Product V3 Generic Bridge] PROFILE ALREADY EXISTS',{version:VERSION,slug:slug});
      try{api.apply();}catch(e){}
      var richExisting=findRich(seed);
      var pExisting=api.profiles[slug];
      [0,250,800,1800,3600].forEach(function(ms){setTimeout(function(){syncStickyHeader(seed,richExisting,pExisting);},ms);});
      reveal();
      return true;
    }

    var rich=findRich(seed);
    var p=buildProfile(seed,rich);
    api.profiles[slug]=p;

    console.info('[Master Product V3 Generic Bridge] GENERIC PROFILE CREATED',{
      version:VERSION,slug:slug,id:p.id,name:p.commerce.displayName,stickyTitle:p.commerce.stickyTitle,
      price:p.commerce.basePrice,images:p.overview.galleryImages.length,richCatalog:!!rich,curation:p.curation.length
    });

    try{
      api.apply();
      console.info('[Master Product V3 Generic Bridge] APPLY REQUESTED',{slug:slug});
    }catch(e){
      console.error('[Master Product V3 Generic Bridge] APPLY FAILED',e);
    }

    [0,250,800,1800,3600].forEach(function(ms){setTimeout(function(){syncStickyHeader(seed,rich,p);},ms);});
    reveal();
    return true;
  }

  if(!install()){
    var timer=setInterval(function(){if(install()||tries>=MAX_TRIES)clearInterval(timer);},50);
  }

  // Never leave the page invisible if an unrelated script or network failure blocks V3.
  setTimeout(function(){
    if(!revealed){
      console.warn('[Master Product V3 Generic Bridge] FAIL-OPEN REVEAL',{version:VERSION,tries:tries});
      reveal();
    }
  },6000);
})();
