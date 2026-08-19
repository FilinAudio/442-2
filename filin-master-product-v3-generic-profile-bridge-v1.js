/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 GENERIC PROFILE BRIDGE V1
   TEST-ONLY migration bridge.

   Purpose:
   - keep frozen Golden Standard V3.3.2 unchanged
   - keep frozen Profiles Registry V1 unchanged
   - create a safe minimal V3 profile for a product whose slug is not
     yet present in the shared profile registry
   - source identity/price from #product-data and enrich from
     window.FilinRichCatalogV2 when available

   This file is universal. It is NOT a per-product profile.
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_MASTER_PRODUCT_V3_GENERIC_PROFILE_BRIDGE_V1__) return;
  window.__FILIN_MASTER_PRODUCT_V3_GENERIC_PROFILE_BRIDGE_V1__=true;

  var VERSION='1.0.0';
  var MAX_TRIES=80;
  var tries=0;

  function str(v){return String(v==null?'':v).trim();}
  function num(v){var n=Number(v);return Number.isFinite(n)?n:0;}
  function esc(v){return str(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}

  function readSeed(){
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
    try{
      var u=new URL(s,location.origin);
      return u.pathname.replace(/^\/+|\/+$/g,'');
    }catch(e){
      return s.replace(/^https?:\/\/[^/]+/i,'').replace(/^\/+|\/+$/g,'');
    }
  }

  function findRich(seed){
    var rich=window.FilinRichCatalogV2;
    var products=rich&&rich.products;
    if(!products) return null;

    var slug=str(seed.slug);
    var id=str(seed.id);
    var targetPath=normalizePath(seed.page&&seed.page.productPath);

    if(slug && products[slug]) return products[slug];

    var keys=Object.keys(products);
    for(var i=0;i<keys.length;i++){
      var k=keys[i], p=products[k];
      if(!p) continue;
      if(id && str(p.id)===id) return p;
      if(slug && str(p.slug)===slug) return p;
      if(targetPath){
        var pp=normalizePath(p.url||p.path||p.productPath||'');
        if(pp && pp===targetPath) return p;
      }
    }
    return null;
  }

  function imageUrl(v){
    if(!v) return '';
    if(typeof v==='string') return str(v);
    if(typeof v==='object') return str(v.url||v.src||v.original||v.large||v.image||'');
    return '';
  }

  function collectImages(seed,rich){
    var raw=[];
    function add(v){
      if(Array.isArray(v)){v.forEach(add);return;}
      var u=imageUrl(v);
      if(u) raw.push(u);
    }

    if(rich){
      add(rich.images);
      add(rich.galleryImages);
      add(rich.gallery);
      add(rich.image);
      add(rich.cover);
      add(rich.photo);
    }
    if(seed){
      add(seed.images);
      add(seed.galleryImages);
      add(seed.image);
      add(seed.cover);
    }

    var seen=Object.create(null), out=[];
    raw.forEach(function(u){
      u=str(u);
      if(!u || /^data:/i.test(u) || seen[u]) return;
      seen[u]=1; out.push(u);
    });
    return out;
  }

  function firstText(){
    for(var i=0;i<arguments.length;i++){
      var s=str(arguments[i]);
      if(s) return s;
    }
    return '';
  }

  function buildMinimalCommerceHTML(displayName,price){
    return ''+
      '<div class="purchase-container">'+
        '<span class="js-product-name" id="tilda-product-name" style="display:none;">'+esc(displayName)+'</span>'+
        '<div class="price-title">Total*: $<span class="js-product-price" id="main-price">'+String(price)+'</span></div>'+
        '<a class="buy-btn js-product-btn" href="#order">Buy Now</a>'+
      '</div>';
  }

  function buildProfile(seed,rich){
    var slug=str(seed.slug);
    var seedCommerce=seed.commerce||{};

    var displayName=firstText(
      seed.name,
      rich&&rich.name,
      [seed.brand,seed.model].filter(Boolean).join(' '),
      slug.replace(/_/g,' ')
    );

    var price=num(seedCommerce.regularPrice || seedCommerce.basePrice || (rich&&rich.price));
    var currency=firstText(seedCommerce.currency,rich&&rich.currency,'USD');
    var images=collectImages(seed,rich);

    var brand=firstText(seed.brand,rich&&rich.brand);
    var model=firstText(seed.model,rich&&rich.model);
    var description=firstText(
      rich&&rich.shortDescription,
      rich&&rich.description,
      rich&&rich.excerpt,
      displayName
    );

    var overviewHtml='';
    if(rich){
      overviewHtml=firstText(rich.overviewHtml,rich.html,rich.descriptionHtml);
    }
    if(!overviewHtml){
      overviewHtml='<p>'+esc(description)+'</p>';
    }

    return {
      schemaVersion:2,
      slug:slug,
      id:firstText(seed.id,rich&&rich.id,slug.replace(/_/g,'-')),
      category:firstText(seed.category,rich&&rich.category,'other'),
      currency:currency,
      hero:{
        staticH1:displayName,
        description:description,
        background:images[0]||''
      },
      curator:brand ? ('Handcrafted by '+brand+'. Personally selected & curated by Filin Labs Kazakhstan.') : 'Personally selected & curated by Filin Labs Kazakhstan.',
      overview:{
        title:displayName,
        html:overviewHtml,
        galleryImages:images
      },
      curation:[],
      commerce:{
        basePrice:price,
        displayName:displayName,
        cartName:displayName,
        stickyTitle:firstText(model,displayName),
        innerHTML:buildMinimalCommerceHTML(displayName,price)
      },
      reviewsCTA:'View The Reviews of '+displayName,
      reviewsQuery:displayName,
      reviewsIntro:'Share your listening experience with '+displayName+'.',
      golden:{
        backLabel:"Back to the Filin's nest",
        backHref:'/',
        mobileHeroHeight:860,
        resultLabel:'Ultimate Synergy'
      },
      reviewsKey:firstText(seed.reviews&&seed.reviews.key,slug.replace(/_/g,'-')),
      registryMeta:{
        version:'generic-bridge-v1',
        generic:true,
        sourcePath:firstText(seed.page&&seed.page.productPath,rich&&rich.url,rich&&rich.path)
      }
    };
  }

  function install(){
    tries++;
    var api=window.FilinMasterProductV3;
    var seed=readSeed();
    var slug=str(seed.slug);

    if(!api || !api.profiles || typeof api.apply!=='function' || !slug){
      return false;
    }

    if(api.profiles[slug]){
      console.info('[Master Product V3 Generic Bridge] PROFILE ALREADY EXISTS',{version:VERSION,slug:slug});
      return true;
    }

    var rich=findRich(seed);
    var p=buildProfile(seed,rich);
    api.profiles[slug]=p;

    console.info('[Master Product V3 Generic Bridge] GENERIC PROFILE CREATED',{
      version:VERSION,
      slug:slug,
      id:p.id,
      name:p.commerce.displayName,
      price:p.commerce.basePrice,
      images:p.overview.galleryImages.length,
      richCatalog:!!rich
    });

    try{
      api.apply();
      console.info('[Master Product V3 Generic Bridge] APPLY REQUESTED',{slug:slug});
    }catch(e){
      console.error('[Master Product V3 Generic Bridge] APPLY FAILED',e);
    }
    return true;
  }

  if(install()) return;

  var timer=setInterval(function(){
    if(install() || tries>=MAX_TRIES) clearInterval(timer);
  },100);
})();
