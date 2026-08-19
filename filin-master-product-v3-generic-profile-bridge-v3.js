/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 GENERIC PROFILE BRIDGE V3
   GOLDEN-CANDIDATE TEST LAYER

   Fixes vs V2:
   - never hides the whole page
   - prevents copied legacy hero (Quadron/Grand Tower) from flashing
   - robustly normalizes sticky/header product title
   - universal generic profile from original #product-data + Rich Catalog
   - product-correct generic curation only
   - optional same-origin source-page gallery hydration
   - idempotent and safe with frozen Golden V3.3.2 + Registry V1
   ============================================================ */
(function(){
  'use strict';

  if (window.__FILIN_MASTER_PRODUCT_V3_GENERIC_PROFILE_BRIDGE_V3__) return;
  window.__FILIN_MASTER_PRODUCT_V3_GENERIC_PROFILE_BRIDGE_V3__ = true;

  var VERSION = '3.0.0';
  var STYLE_ID = 'filin-master-product-v3-generic-bridge-v3-style';
  var PENDING = 'data-fpv3-generic-hero-pending';
  var SEED_KEY = '__FILIN_MASTER_PRODUCT_V3_GENERIC_SEED_V3__';
  var tries = 0;
  var MAX_TRIES = 160;
  var revealed = false;
  var sourceHydrated = false;

  function str(v){ return String(v == null ? '' : v).trim(); }
  function num(v){ var n = Number(v); return Number.isFinite(n) ? n : 0; }
  function esc(v){ return str(v).replace(/[&<>"']/g,function(c){ return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]; }); }
  function firstText(){ for(var i=0;i<arguments.length;i++){ var s=str(arguments[i]); if(s) return s; } return ''; }
  function money(v,c){ var n=num(v), code=firstText(c,'USD'); try{return new Intl.NumberFormat('en-US',{style:'currency',currency:code,maximumFractionDigits:0}).format(n);}catch(e){return '$'+n.toLocaleString('en-US');} }

  function installPrepaint(){
    if(document.getElementById(STYLE_ID)) return;
    var s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent =
      'html['+PENDING+'="1"] #allrecords .t-cover{visibility:hidden!important;}'+
      'html:not(['+PENDING+'="1"]) #allrecords .t-cover{visibility:visible;}';
    (document.head || document.documentElement).appendChild(s);
  }

  installPrepaint();
  document.documentElement.setAttribute(PENDING,'1');

  function captureSeed(){
    if(window[SEED_KEY]) return true;
    var el=document.getElementById('product-data');
    if(!el) return false;
    try{
      var d=JSON.parse(el.textContent||'{}');
      if(d && d.slug){
        window[SEED_KEY]=JSON.parse(JSON.stringify(d));
        console.info('[Master Product V3 Generic Bridge] ORIGINAL SEED CAPTURED',{version:VERSION,slug:d.slug});
        return true;
      }
    }catch(e){ console.warn('[Master Product V3 Generic Bridge] seed capture failed',e); }
    return false;
  }

  function readSeed(){
    captureSeed();
    if(window[SEED_KEY]) return window[SEED_KEY];
    return {};
  }

  var seedObserver=null;
  if(!captureSeed() && window.MutationObserver){
    seedObserver=new MutationObserver(function(){
      if(captureSeed()){
        seedObserver.disconnect();
        seedObserver=null;
      }
    });
    seedObserver.observe(document.documentElement,{childList:true,subtree:true});
  }

  function normalizePath(v){
    var s=str(v); if(!s) return '';
    try{return new URL(s,location.origin).pathname.replace(/^\/+|\/+$/g,'');}
    catch(e){return s.replace(/^https?:\/\/[^/]+/i,'').replace(/^\/+|\/+$/g,'');}
  }

  function findRich(seed){
    var rich=window.FilinRichCatalogV2, products=rich&&rich.products;
    if(!products) return null;
    var slug=str(seed.slug), id=str(seed.id), target=normalizePath(seed.page&&seed.page.productPath);
    if(slug && products[slug]) return products[slug];
    var keys=Object.keys(products);
    for(var i=0;i<keys.length;i++){
      var k=keys[i],p=products[k]; if(!p) continue;
      if(id && str(p.id)===id) return p;
      if(slug && str(p.slug)===slug) return p;
      if(target){ var pp=normalizePath(p.url||p.path||p.productPath||''); if(pp && pp===target) return p; }
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
    function add(v){ if(Array.isArray(v)){v.forEach(add);return;} var u=imageUrl(v); if(u)raw.push(u); }
    if(rich){add(rich.images);add(rich.galleryImages);add(rich.gallery);add(rich.image);add(rich.cover);add(rich.photo);}
    if(seed){add(seed.images);add(seed.galleryImages);add(seed.image);add(seed.cover);}
    var seen=Object.create(null),out=[];
    raw.forEach(function(u){u=str(u);if(!u||/^data:/i.test(u)||seen[u])return;seen[u]=1;out.push(u);});
    return out;
  }

  function conciseIdentity(seed,rich){
    var brand=firstText(seed.brand,rich&&rich.brand);
    var model=firstText(seed.model,rich&&rich.model);
    var display=[brand,model].filter(Boolean).join(' ').replace(/\s+/g,' ').trim();
    display=firstText(display,seed.name,rich&&rich.name,str(seed.slug).replace(/_/g,' '));
    return {brand:brand,model:model,displayName:display,stickyTitle:firstText(model,display)};
  }

  function cleanText(v){return str(v).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();}
  function titleCase(v){return str(v).replace(/[-_]+/g,' ').replace(/\b\w/g,function(m){return m.toUpperCase();});}

  function purchaseHTML(name,price){
    return '<div class="purchase-container">'+
      '<span class="js-product-name" id="tilda-product-name" style="display:none;">'+esc(name)+'</span>'+
      '<div class="price-title">Total*: $<span class="js-product-price" id="main-price">'+String(price)+'</span></div>'+
      '<a class="buy-btn js-product-btn" href="#order">Buy Now</a>'+
      '</div>';
  }

  function buildCuration(seed,rich,id,price,currency,desc){
    var category=titleCase(firstText(seed.category,rich&&rich.category,'Product'));
    var focus=desc; if(focus.length>210) focus=focus.slice(0,207).replace(/\s+\S*$/,'')+'…';
    return [
      {title:'Category & Price',html:'<strong>'+esc(category)+'</strong><br/>'+esc(money(price,currency))},
      {title:'Brand & Model',html:'<strong>'+esc(id.brand||'Filin Labs Selection')+'</strong><br/>'+esc(id.model||id.displayName)},
      {title:'Product Focus',html:esc(focus||id.displayName)},
      {title:'Curator’s Choice',html:'Personally selected & curated by Filin Labs Kazakhstan.'}
    ];
  }

  function buildProfile(seed,rich){
    var slug=str(seed.slug), sc=seed.commerce||{}, id=conciseIdentity(seed,rich);
    var price=num(sc.regularPrice||sc.basePrice||(rich&&rich.price));
    var currency=firstText(sc.currency,rich&&rich.currency,'USD');
    var images=collectImages(seed,rich);
    var desc=cleanText(firstText(rich&&rich.shortDescription,rich&&rich.description,rich&&rich.excerpt,seed.description,id.displayName));
    var overviewHtml=firstText(rich&&rich.overviewHtml,rich&&rich.html,rich&&rich.descriptionHtml);
    if(!overviewHtml) overviewHtml='<p>'+esc(desc)+'</p>';
    return {
      schemaVersion:2,
      slug:slug,
      id:firstText(seed.id,rich&&rich.id,slug.replace(/_/g,'-')),
      category:firstText(seed.category,rich&&rich.category,'other'),
      currency:currency,
      hero:{staticH1:id.displayName,description:desc,background:images[0]||''},
      curator:'Personally selected & curated by Filin Labs Kazakhstan.',
      overview:{title:id.displayName,html:overviewHtml,galleryImages:images},
      curation:buildCuration(seed,rich,id,price,currency,desc),
      commerce:{basePrice:price,displayName:id.displayName,cartName:id.displayName,stickyTitle:id.stickyTitle,innerHTML:purchaseHTML(id.displayName,price)},
      reviewsCTA:'View The Reviews of '+id.displayName,
      reviewsQuery:id.displayName,
      reviewsIntro:'Share your listening experience with '+id.displayName+'.',
      golden:{backLabel:"Back to the Filin's nest",backHref:'/',mobileHeroHeight:860,resultLabel:'Ultimate Synergy'},
      reviewsKey:firstText(seed.reviews&&seed.reviews.key,slug.replace(/_/g,'-')),
      registryMeta:{version:'generic-bridge-v3',generic:true,sourcePath:firstText(seed.page&&seed.page.productPath,rich&&rich.url,rich&&rich.path)}
    };
  }

  function replaceWrongTitles(seed,rich,p){
    if(!p||!p.commerce) return;
    var wanted=str(p.commerce.stickyTitle||p.commerce.displayName);
    var display=str(p.commerce.displayName);
    var longNames=[str(rich&&rich.name),str(seed.name)].filter(Boolean);
    Array.prototype.slice.call(document.querySelectorAll('body *')).forEach(function(el){
      if(!el || el.children.length) return;
      if(el.closest && el.closest('script,style,#filin-master-product-v3')) return;
      var t=str(el.textContent); if(!t||t.length>260) return;
      var isLegacy=/Filin Audio\s*["“”']?Quadron|Audioinstrument\s+Grand\s+Tower/i.test(t);
      var isLong=longNames.some(function(n){return n&&t===n;}) || /\|\s*High-End\s+Audiophile\s+Grade/i.test(t);
      if(isLegacy || isLong){
        el.textContent = t.length>90 ? display : wanted;
      }
    });
  }

  function revealHero(){
    if(revealed) return;
    revealed=true;
    requestAnimationFrame(function(){requestAnimationFrame(function(){document.documentElement.removeAttribute(PENDING);});});
  }

  function extractSourceImages(doc){
    var out=[],seen=Object.create(null);
    var attrs=['src','data-original','data-src','data-lazy-src','data-img-zoom-url'];
    doc.querySelectorAll('img').forEach(function(img){
      attrs.forEach(function(a){
        var u=str(img.getAttribute(a));
        if(!u||/^data:/i.test(u))return;
        if(!/^https?:\/\/(?:static|thb)\.tildacdn\.com\//i.test(u))return;
        if(/(?:tildacopy|favicon|logo|icon|blank|pixel)/i.test(u))return;
        var k=u.replace(/[?#].*$/,''); if(seen[k])return; seen[k]=1;out.push(u);
      });
    });
    var og=doc.querySelector('meta[property="og:image"],meta[name="twitter:image"]');
    if(og){var u=str(og.getAttribute('content'));if(u&&!seen[u]&&!/(?:logo|icon|favicon)/i.test(u)){seen[u]=1;out.unshift(u);}}
    return out;
  }

  function hydrateFromSource(seed,p,api){
    if(sourceHydrated) return;
    sourceHydrated=true;
    var path=firstText(seed.page&&seed.page.productPath,p.registryMeta&&p.registryMeta.sourcePath);
    if(!path) return;
    fetch(path,{credentials:'same-origin',cache:'no-store'})
      .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();})
      .then(function(html){
        var doc=new DOMParser().parseFromString(html,'text/html');
        var imgs=extractSourceImages(doc);
        var existing=(p.overview&&p.overview.galleryImages)||[];
        var seen=Object.create(null),merged=[];
        existing.concat(imgs).forEach(function(u){u=str(u);if(!u)return;var k=u.replace(/[?#].*$/,'');if(seen[k])return;seen[k]=1;merged.push(u);});
        if(merged.length>existing.length){
          p.overview.galleryImages=merged;
          if(!p.hero.background) p.hero.background=merged[0];
          api.apply();
          console.info('[Master Product V3 Generic Bridge] SOURCE GALLERY HYDRATED',{slug:p.slug,images:merged.length});
        } else {
          console.info('[Master Product V3 Generic Bridge] SOURCE GALLERY NO CHANGE',{slug:p.slug,images:merged.length});
        }
        replaceWrongTitles(seed,findRich(seed),p);
      })
      .catch(function(e){console.warn('[Master Product V3 Generic Bridge] SOURCE HYDRATION FAILED',e);});
  }

  function install(){
    tries++;
    var api=window.FilinMasterProductV3, seed=readSeed(), slug=str(seed.slug);
    if(!api||!api.profiles||typeof api.apply!=='function'||!slug) return false;
    var rich=findRich(seed), p=api.profiles[slug];

    if(!p){
      p=buildProfile(seed,rich);
      api.profiles[slug]=p;
      console.info('[Master Product V3 Generic Bridge] GENERIC PROFILE CREATED',{version:VERSION,slug:slug,name:p.commerce.displayName,stickyTitle:p.commerce.stickyTitle,price:p.commerce.basePrice,images:p.overview.galleryImages.length,curation:p.curation.length,richCatalog:!!rich});
    } else {
      console.info('[Master Product V3 Generic Bridge] PROFILE ALREADY EXISTS',{version:VERSION,slug:slug});
    }

    try{
      api.apply();
      replaceWrongTitles(seed,rich,p);
      [150,600,1400,3000].forEach(function(ms){setTimeout(function(){replaceWrongTitles(seed,rich,p);},ms);});
      revealHero();
      hydrateFromSource(seed,p,api);
      console.info('[Master Product V3 Generic Bridge] APPLY REQUESTED',{slug:slug});
    }catch(e){
      console.error('[Master Product V3 Generic Bridge] APPLY FAILED',e);
      revealHero();
    }
    return true;
  }

  if(!install()){
    var timer=setInterval(function(){ if(install()||tries>=MAX_TRIES) clearInterval(timer); },50);
  }

  setTimeout(function(){ if(!revealed){console.warn('[Master Product V3 Generic Bridge] HERO FAIL-OPEN',{version:VERSION,tries:tries});revealHero();} },3500);
})();
