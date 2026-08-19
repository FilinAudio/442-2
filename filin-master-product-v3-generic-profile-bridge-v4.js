/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 GENERIC PROFILE BRIDGE V4
   Golden Reference compatible generic migration layer.

   V4 goals:
   - build a product-correct Golden V3 profile from #product-data + Rich Catalog
   - preserve existing product-specific purchase / Perfect Matches / tabs when present
   - fallback to generated Description + Specification tabs from Rich Catalog
   - capture the current product H1 / curator line when available
   - collect only likely product images already present above the purchase block
   - never render a second Golden root
   - fail open safely
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_MASTER_PRODUCT_V3_GENERIC_PROFILE_BRIDGE_V4__) return;
  window.__FILIN_MASTER_PRODUCT_V3_GENERIC_PROFILE_BRIDGE_V4__=true;

  var VERSION='4.0.0';
  var SEED_KEY='__FILIN_MASTER_PRODUCT_V3_GENERIC_SEED_V4__';
  var tries=0;
  var MAX_TRIES=180;
  var applied=false;

  function str(v){return String(v==null?'':v).trim();}
  function num(v){var n=Number(v);return Number.isFinite(n)?n:0;}
  function esc(v){return str(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
  function first(){for(var i=0;i<arguments.length;i++){var s=str(arguments[i]);if(s)return s;}return '';}
  function money(v,c){try{return new Intl.NumberFormat('en-US',{style:'currency',currency:first(c,'USD'),maximumFractionDigits:0}).format(num(v));}catch(e){return '$'+num(v).toLocaleString('en-US');}}
  function cleanText(v){return str(v).replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();}
  function titleCase(v){return str(v).replace(/[-_]+/g,' ').replace(/\b\w/g,function(m){return m.toUpperCase();});}

  function captureSeed(){
    if(window[SEED_KEY])return true;
    var el=document.getElementById('product-data');
    if(!el)return false;
    try{
      var d=JSON.parse(el.textContent||'{}');
      if(d&&d.slug){window[SEED_KEY]=JSON.parse(JSON.stringify(d));return true;}
    }catch(e){console.warn('[Master Product V3 Generic V4] seed parse failed',e);}
    return false;
  }
  function seed(){captureSeed();return window[SEED_KEY]||{};}

  function normalizePath(v){
    var s=str(v);if(!s)return '';
    try{return new URL(s,location.origin).pathname.replace(/^\/+|\/+$/g,'');}
    catch(e){return s.replace(/^https?:\/\/[^/]+/i,'').replace(/^\/+|\/+$/g,'');}
  }

  function richFor(s){
    var cat=window.FilinRichCatalogV2,ps=cat&&cat.products;if(!ps)return null;
    var slug=str(s.slug),target=normalizePath(s.page&&s.page.productPath);
    if(slug&&ps[slug])return ps[slug];
    var ks=Object.keys(ps);
    for(var i=0;i<ks.length;i++){
      var p=ps[ks[i]];if(!p)continue;
      if(slug&&str(p.slug)===slug)return p;
      if(target&&normalizePath(p.url||p.path||'')===target)return p;
    }
    return null;
  }

  function visible(el){
    if(!el)return false;
    try{var r=el.getBoundingClientRect(),cs=getComputedStyle(el);return r.width>2&&r.height>2&&cs.display!=='none'&&cs.visibility!=='hidden';}
    catch(e){return false;}
  }

  function currentH1(rich,s){
    var hs=Array.prototype.slice.call(document.querySelectorAll('#allrecords h1,h1'));
    for(var i=0;i<hs.length;i++){
      var t=cleanText(hs[i].textContent);if(t&&visible(hs[i])&&!/checkout|cart/i.test(t))return t;
    }
    return first(s.name,rich&&rich.name,str(s.slug).replace(/_/g,' '));
  }

  function curatorLine(){
    var nodes=Array.prototype.slice.call(document.querySelectorAll('#allrecords p,#allrecords div,#allrecords span'));
    for(var i=0;i<nodes.length;i++){
      var el=nodes[i];if(el.children.length||!visible(el))continue;
      var t=cleanText(el.textContent);
      if(t.length<260&&/(personally listened|personally selected|approved\s*&\s*curated|curated by)/i.test(t))return t;
    }
    return 'Personally selected & curated by Filin Labs Kazakhstan.';
  }

  function imageFrom(el){
    var attrs=['src','data-original','data-src','data-lazy-src','data-img-zoom-url','data-bg','data-original-src'];
    for(var i=0;i<attrs.length;i++){
      var u=str(el.getAttribute&&el.getAttribute(attrs[i]));
      if(/^https?:\/\/(?:static|thb)\.tildacdn\.com\//i.test(u))return u;
    }
    return '';
  }

  function goodImage(u){
    return !!u&&!/(?:blank\.gif|empty\.png|pixel|favicon|icon-|tildacopy|logo|sprite|filin|owl|header|footer|Gemini_Generated_Ima)/i.test(u);
  }

  function collectPageImages(){
    var h1=document.querySelector('#allrecords h1,h1');
    var buy=document.querySelector('#allrecords .purchase-container,#allrecords .js-product-btn,.purchase-container,.js-product-btn');
    var top=-Infinity,bottom=Infinity;
    try{if(h1)top=h1.getBoundingClientRect().top+window.scrollY-250;}catch(e){}
    try{if(buy)bottom=buy.getBoundingClientRect().top+window.scrollY+700;}catch(e){}
    var list=[],seen=Object.create(null);
    var nodes=document.querySelectorAll('#allrecords img,#allrecords [data-original],#allrecords [data-img-zoom-url],#allrecords [data-src]');
    Array.prototype.forEach.call(nodes,function(el){
      var y=0;try{y=el.getBoundingClientRect().top+window.scrollY;}catch(e){}
      if(y<top||y>bottom)return;
      var u=imageFrom(el);if(!goodImage(u))return;
      var k=u.replace(/[?#].*$/,'');if(seen[k])return;seen[k]=1;list.push(u);
    });
    return list.slice(0,18);
  }

  function collectImages(s,rich){
    var out=[],seen=Object.create(null);
    function add(v){
      if(Array.isArray(v)){v.forEach(add);return;}
      var u=typeof v==='string'?v:(v&&typeof v==='object'?first(v.url,v.src,v.original,v.image):'');
      u=str(u);if(!goodImage(u)||seen[u])return;seen[u]=1;out.push(u);
    }
    collectPageImages().forEach(add);
    if(rich){add(rich.images);add(rich.galleryImages);add(rich.image);add(rich.cover);}
    if(s){add(s.images);add(s.galleryImages);add(s.image);add(s.cover);}
    return out;
  }

  function captureLegacyCommerce(){
    var purchase=document.querySelector('#allrecords .js-product .purchase-container,#allrecords .purchase-container');
    var tabs=document.querySelector('#allrecords .js-product .tabs-wrapper,#allrecords .tabs-wrapper');
    if(purchase&&purchase.closest('#filin-master-product-v3'))purchase=null;
    if(tabs&&tabs.closest('#filin-master-product-v3'))tabs=null;
    var html='';
    if(purchase)html+=purchase.outerHTML;
    if(tabs)html+=tabs.outerHTML;
    return html;
  }

  function specsHTML(rows){
    if(!Array.isArray(rows)||!rows.length)return '';
    return '<table class="specs-table"><tbody>'+rows.map(function(r){
      if(!Array.isArray(r)||r.length<2)return '';
      return '<tr><td><strong>'+esc(r[0])+'</strong></td><td>'+esc(r[1])+'</td></tr>';
    }).join('')+'</tbody></table>';
  }

  function fallbackCommerce(name,price,rich){
    var desc=cleanText(first(rich&&rich.description,name));
    return '<div class="purchase-container">'+
      '<span class="js-product-name" id="tilda-product-name" style="display:none;">'+esc(name)+'</span>'+
      '<div class="price-title">Total*: $<span class="js-product-price" id="main-price">'+String(price)+'</span></div>'+
      '<a class="buy-btn js-product-btn" href="#order">Buy Now</a>'+
    '</div>'+
    '<div class="tabs-wrapper">'+
      '<div class="tabs-header">'+
        '<button class="tab-btn active" type="button" onclick="showTab(event, \'desc\')">Description</button>'+
        '<button class="tab-btn" type="button" onclick="showTab(event, \'spec\')">Specification</button>'+
      '</div>'+
      '<div class="tab-content" id="desc"><div class="content-container"><div class="description-content"><p>'+esc(desc)+'</p></div></div></div>'+
      '<div class="tab-content" id="spec" style="display:none"><div class="content-container">'+specsHTML(rich&&rich.specRows)+'</div></div>'+
    '</div>';
  }

  function buildProfile(s,rich){
    var sc=s.commerce||{};
    var name=currentH1(rich,s);
    var brand=first(s.brand,rich&&rich.brand);
    var model=first(s.model,name.replace(new RegExp('^'+brand.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'\\s*','i'),''));
    var price=num(sc.regularPrice||sc.basePrice||(rich&&rich.price));
    var currency=first(sc.currency,rich&&rich.currency,'USD');
    var desc=cleanText(first(rich&&rich.description,s.description,name));
    var images=collectImages(s,rich);
    var legacy=captureLegacyCommerce();
    var cat=titleCase(first(s.category,rich&&rich.categories&&rich.categories[0],'Speakers'));
    return {
      schemaVersion:4,
      slug:str(s.slug),
      id:first(s.id,str(s.slug).replace(/_/g,'-')),
      category:first(s.category,rich&&rich.categories&&rich.categories[0],'speakers'),
      currency:currency,
      hero:{staticH1:name,description:desc,background:images[0]||''},
      curator:curatorLine(),
      overview:{title:name,html:'<p>'+esc(desc)+'</p>',galleryImages:images},
      curation:[
        {title:'Category & Price',html:'<strong>'+esc(cat)+'</strong><br>'+esc(money(price,currency))},
        {title:'Brand & Model',html:'<strong>'+esc(brand||'Filin Labs Selection')+'</strong><br>'+esc(model||name)},
        {title:'Product Focus',html:esc(desc.length>220?desc.slice(0,217)+'…':desc)},
        {title:'Curator’s Choice',html:'Personally selected & curated by Filin Labs Kazakhstan.'}
      ],
      commerce:{basePrice:price,displayName:name,cartName:name,stickyTitle:model||name,innerHTML:legacy||fallbackCommerce(name,price,rich)},
      reviewsCTA:'View The Reviews of '+name,
      reviewsQuery:name,
      reviewsIntro:'Share your listening experience with '+name+'.',
      reviewsKey:first(s.reviews&&s.reviews.key,str(s.slug).replace(/_/g,'-')),
      golden:{backLabel:"Back to the Filin's nest",backHref:'/',mobileHeroHeight:860,resultLabel:'Ultimate Synergy'},
      registryMeta:{version:'generic-bridge-v4',generic:true,legacyCommerce:!!legacy}
    };
  }

  function install(){
    tries++;
    var api=window.FilinMasterProductV3,s=seed(),slug=str(s.slug);
    if(!api||!api.profiles||typeof api.apply!=='function'||!slug)return false;
    var rich=richFor(s),p=api.profiles[slug];
    if(!p){
      p=buildProfile(s,rich);api.profiles[slug]=p;
      console.info('[Master Product V3 Generic V4] PROFILE CREATED',{version:VERSION,slug:slug,price:p.commerce.basePrice,images:p.overview.galleryImages.length,legacyCommerce:p.registryMeta.legacyCommerce,richCatalog:!!rich});
    }else{
      console.info('[Master Product V3 Generic V4] EXISTING PROFILE USED',{version:VERSION,slug:slug});
    }
    try{api.apply();applied=true;document.documentElement.classList.add('fp-v7-ready');document.documentElement.classList.remove('fp-v7-boot');}
    catch(e){console.error('[Master Product V3 Generic V4] APPLY FAILED',e);document.documentElement.classList.add('fp-v7-ready');}
    return true;
  }

  if(!install()){
    var timer=setInterval(function(){if(install()||tries>=MAX_TRIES)clearInterval(timer);},40);
  }
  setTimeout(function(){if(!applied){console.warn('[Master Product V3 Generic V4] FAIL-OPEN',{tries:tries});document.documentElement.classList.add('fp-v7-ready');document.documentElement.classList.remove('fp-v7-boot');}},6500);
})();
