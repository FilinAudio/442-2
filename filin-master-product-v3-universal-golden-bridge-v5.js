/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 UNIVERSAL GOLDEN BRIDGE V5
   Golden-candidate validation layer based on the supplied Tilda sources.

   V5 fixes the concrete defects found in the archive:
   - source-of-truth price/options for Demograf Binding Posts
   - no invented "Options" tab; options live above BUY NOW
   - Description + Specification come from the supplied original block
   - Reviews stays the live legacy Reviews tab and is appended by Golden V3
   - sticky title/price are synchronized through #product-data
   - only copied hero text is hidden during startup (no white-page blanking)
   - no Grand Tower / Quadron curation leakage
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_MASTER_PRODUCT_V3_UNIVERSAL_GOLDEN_BRIDGE_V5__) return;
  window.__FILIN_MASTER_PRODUCT_V3_UNIVERSAL_GOLDEN_BRIDGE_V5__ = true;

  var VERSION='5.0.0';
  var ROOT_ID='filin-master-product-v3';
  var STYLE_ID='filin-master-product-v3-v5-style';
  var state={seed:null,profile:null,observer:null,tries:0,writing:false};

  function str(v){return String(v==null?'':v).trim();}
  function num(v){var n=Number(v);return Number.isFinite(n)?n:0;}
  function esc(v){return str(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
  function money(v){var n=num(v);try{return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);}catch(e){return '$'+n;}}

  function installPreflightStyle(){
    if(document.getElementById(STYLE_ID)) return;
    var s=document.createElement('style');
    s.id=STYLE_ID;
    s.textContent=
      'html.fp-v5-wait .t-cover .t-title,'+
      'html.fp-v5-wait .t-cover .t-descr,'+
      'html.fp-v5-wait .t-cover .t-btn,'+
      'html.fp-v5-wait .t-cover a{visibility:hidden!important}'+
      '#'+ROOT_ID+' .fp-v5-options{margin:18px 0 16px;padding:18px 20px;border:1px solid rgba(31,27,23,.14);border-radius:8px;background:#fffdfa;font-family:Montserrat,Arial,sans-serif}'+
      '#'+ROOT_ID+' .fp-v5-row{display:grid;gap:8px;margin:0 0 14px}'+
      '#'+ROOT_ID+' .fp-v5-label{font-size:15px;font-weight:750}'+
      '#'+ROOT_ID+' .fp-v5-select{width:100%;min-height:50px;padding:0 13px;border:1px solid #888;background:#fff;font:500 16px/1.2 Montserrat,Arial,sans-serif}'+
      '#'+ROOT_ID+' .fp-v5-check{display:flex;align-items:flex-start;gap:10px;font-size:15px;line-height:1.45;cursor:pointer}'+
      '#'+ROOT_ID+' .fp-v5-check input{width:20px;height:20px;margin-top:1px;flex:0 0 auto}'+
      '#'+ROOT_ID+' .fp-v5-total{margin-top:10px;font-size:20px;font-weight:800}'+
      '#'+ROOT_ID+' .fp-v5-specs{width:100%;border-collapse:collapse}'+
      '#'+ROOT_ID+' .fp-v5-specs td{padding:14px 12px;border-bottom:1px solid rgba(0,0,0,.09);vertical-align:top;font-size:17px;line-height:1.45}'+
      '#'+ROOT_ID+' .fp-v5-specs td:first-child{width:31%;font-weight:700}'+
      '#'+ROOT_ID+' .fp-v5-desc h3{margin:28px 0 12px;font-size:21px}'+
      '#'+ROOT_ID+' .fp-v5-desc p,#'+ROOT_ID+' .fp-v5-desc li{font-size:17px;line-height:1.6}'+
      '#'+ROOT_ID+' .fp-v5-desc ul{padding-left:22px}'+
      '@media(max-width:820px){#'+ROOT_ID+' .fp-v5-options{padding:14px}#'+ROOT_ID+' .fp-v5-specs td{display:block;width:100%!important;padding:8px 4px}#'+ROOT_ID+' .fp-v5-specs td:first-child{padding-top:15px;border-bottom:0}}';
    (document.head||document.documentElement).appendChild(s);
    document.documentElement.classList.add('fp-v5-wait');
  }
  installPreflightStyle();

  function readProductData(){
    var el=document.getElementById('product-data');
    if(!el) return null;
    try{return JSON.parse(el.textContent||'{}');}catch(e){return null;}
  }

  function captureSeed(){
    if(state.seed) return state.seed;
    var d=readProductData();
    if(!d||!d.slug) return null;
    state.seed=JSON.parse(JSON.stringify(d));
    console.info('[Master Product V3 V5] SEED CAPTURED',{version:VERSION,slug:d.slug});
    return state.seed;
  }

  var BINDING_DESC = ''+
    '<div class="fp-v5-desc">'+
      '<h3>Unmatched Performance of Solid Copper</h3>'+
      '<p>Demograf Audio connectors are precision-machined from solid copper billets. This artisanal approach guarantees minimal signal loss and exceptional conductivity. Featuring a robust, high-durability housing, these connectors ensure a secure, airtight connection to your cables, enabling the purest transmission of your audio signal.</p>'+
      '<h3>The Ultimate Choice for Audiophiles</h3>'+
      '<p>Demograf Audio connectors are designed for those who refuse to compromise. If you are an audiophile dedicated to extracting every ounce of performance from your high-fidelity sound system, our connectors provide the high-end link your setup deserves.</p>'+
      '<h3>Superior Material and Engineering</h3>'+
      '<p>Our commitment to high-quality materials and mechanical integrity allows us to minimize electromagnetic interference and distortion. Experience maximum sonic clarity, pristine transparency, and pinpoint accuracy in your music reproduction.</p>'+
      '<h3>Convenience and Reliability</h3>'+
      '<ul><li>Ergonomic design for effortless handling.</li><li>Superior mechanical strength for a reliable long-term cable-to-connector bond.</li><li>Seamless integration with your speaker system.</li><li>Zero-compromise connection: Eliminates signal dropouts and loose contacts.</li></ul>'+
      '<p>These connectors are built to deliver both uncompromising sound quality and long-lasting durability.</p>'+
      '<h3>Why Quality Connectors Matter?</h3>'+
      '<p>The signal path is only as strong as its weakest link. Inferior connectors are common points of failure that degrade your audio experience through:</p>'+
      '<ul><li>Unstable, loose connections.</li><li>Rapid contact oxidation.</li><li>Significant signal attenuation.</li><li>Audible signal distortion.</li></ul>'+
      '<p>Investing in premium connectors from Demograf Audio is a critical upgrade to ensure the longevity, style, and sonic integrity of your high-end sound system.</p>'+
      '<h3>Customization Options</h3>'+
      '<p>To prevent natural copper oxidation over time and to further enhance detail in the high and upper-mid frequency ranges, we offer optional plating:</p>'+
      '<ul><li><strong>Silver Plating:</strong> For increased brilliance and transient speed.</li><li><strong>Gold Plating:</strong> For a warm, rich tone and long-term surface protection.</li></ul>'+
      '<h3>Pricing</h3><p>The price listed is for a set of 4 connectors.</p>'+
    '</div>';

  var BINDING_SPEC_ROWS = [
    ['Total Price*','The price is for the base product only and does not include shipping or selected optional upgrades. To get a complete final quote, please submit your request to our consultant via email at <a href="mailto:shop@filinlabs.com">shop@filinlabs.com</a> or via Telegram at <a href="https://t.me/RA_Fayzullin" target="_blank" rel="noopener">@RA_Fayzullin</a>. We will send you an invoice &amp; full costs calculation in the reply message.'],
    ['Lead Times','You can check the lead times for each item in the <a href="https://filinlabs.com/shipping">Lead Times &amp; Handcrafted Quality</a> section. If the standard waiting time does not suit you, you can request our expedited assembly service (see the <a href="https://filinlabs.com/shipping">Priority Assembly Option</a> section). Installment payment options are also available.'],
    ['Basic Configuration','The standard configuration (base product) includes the stock 4pcs set of solid-copper connectors with no additional options.'],
    ['Manufacturer','Demograf Audio'],
    ['Base Material','Pure Solid Copper (Non-Alloy)'],
    ['Available Plating Options','None (Raw Copper) / Silver-Plated / Gold-Plated'],
    ['Acoustic Profile','Maximum transparency, enhanced HF/Upper-mids (with plating)'],
    ['Diameter','8 mm'],
    ['Thread Length','30 mm'],
    ['Compatibility','Crimping, spade, or banana plug'],
    ['Quantity','4 pieces per set'],
    ['Limited Warranty','You can find information about Warranty by visiting the <a href="https://filinlabs.com/warranty">Warranty &amp; Returns Policy</a> page.']
  ];

  function specHTML(rows){
    return '<table class="fp-v5-specs"><tbody>'+rows.map(function(r){return '<tr><td>'+String(r[0])+'</td><td>'+String(r[1])+'</td></tr>';}).join('')+'</tbody></table>';
  }

  function tabsHTML(desc,spec){
    return ''+
      '<div class="tabs-wrapper">'+
        '<div class="tabs-header">'+
          '<button class="tab-btn active" type="button" onclick="showTab(event, \'desc\')">Description</button>'+
          '<button class="tab-btn" type="button" onclick="showTab(event, \'spec\')">Specification</button>'+
        '</div>'+
        '<div class="tab-content" id="desc"><div class="content-container">'+desc+'</div></div>'+
        '<div class="tab-content" id="spec" style="display:none"><div class="content-container">'+spec+'</div></div>'+
      '</div>';
  }

  function findRich(slug){
    return window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products&&window.FilinRichCatalogV2.products[slug]||null;
  }

  function bindingConfig(seed,rich){
    return {
      displayName:'Demograf Audio Reference Solid Copper Binding Posts',
      cartBaseName:'Demograf Audio Reference Solid Copper Binding Posts — Set of 4',
      stickyTitle:'Demograf Audio Binding Posts',
      model:'Reference Solid Copper Binding Posts',
      basePrice:100,
      variants:[
        {label:'No plating',price:100},
        {label:'Silver plating',price:150},
        {label:'Gold plating',price:250}
      ],
      fastTrackPercent:50,
      description:BINDING_DESC,
      specs:BINDING_SPEC_ROWS,
      images:(rich&&Array.isArray(rich.images)?rich.images.slice():[]),
      heroDescription:(rich&&rich.description)||'Premium solid copper binding posts precision-machined for secure, low-loss loudspeaker and amplifier connections.'
    };
  }

  function configFor(seed,rich){
    if(str(seed.slug)==='demograf_binding_posts') return bindingConfig(seed,rich);
    return null;
  }

  function profileFor(seed,rich,cfg){
    var images=cfg.images||[];
    var curation=[
      {title:'Category & Price',html:'<strong>Speaker / Amplifier Connectors</strong><br>From '+esc(money(cfg.basePrice))+' per set of 4'},
      {title:'Material & Finish',html:'Pure solid copper<br>No plating / Silver plating / Gold plating'},
      {title:'Compatibility',html:'Crimping, spade, or banana plug<br>8 mm diameter · 30 mm thread length'},
      {title:'Curator’s Choice',html:'Precision-machined solid-copper signal connection with configurable surface plating.'}
    ];
    return {
      schemaVersion:5,
      slug:str(seed.slug),
      id:str(seed.id||'demograf-binding-posts'),
      category:'accessories',
      currency:'USD',
      hero:{staticH1:cfg.displayName,description:cfg.heroDescription,background:images[0]||''},
      curator:'Personally selected & curated by Filin Labs Kazakhstan.',
      overview:{title:cfg.displayName,html:'<p>'+esc(cfg.heroDescription)+'</p>',galleryImages:images},
      curation:curation,
      commerce:{
        basePrice:cfg.basePrice,
        displayName:cfg.displayName,
        cartName:cfg.cartBaseName,
        stickyTitle:cfg.stickyTitle,
        innerHTML:tabsHTML(cfg.description,specHTML(cfg.specs))
      },
      reviewsCTA:'View The Reviews of '+cfg.displayName,
      reviewsQuery:cfg.displayName,
      reviewsIntro:'Share your listening experience with '+cfg.displayName+'.',
      reviewsKey:str(seed.reviews&&seed.reviews.key||'demograf-binding-posts'),
      golden:{backLabel:"Back to the Filin's nest",backHref:'/',mobileHeroHeight:860,resultLabel:'Ultimate Synergy'},
      v5:{config:cfg}
    };
  }

  function currentSelection(root,p){
    var cfg=p.v5.config;
    var sel=root&&root.querySelector('.fp-v5-select');
    var variant=cfg.variants[0];
    if(sel){
      var i=Math.max(0,Math.min(cfg.variants.length-1,Number(sel.value)||0));
      variant=cfg.variants[i];
    }
    var price=num(variant.price);
    var fast=root&&root.querySelector('.fp-v5-fast');
    if(fast&&fast.checked) price=Math.round(price*(1+cfg.fastTrackPercent/100));
    return {variant:variant,price:price,fast:!!(fast&&fast.checked)};
  }

  function desiredData(p,selection){
    var d=readProductData()||{};
    d.schemaVersion=1;
    d.id=p.id;
    d.slug=p.slug;
    d.brand='Demograf Audio';
    d.model=p.v5.config.model;
    d.name=p.commerce.displayName;
    d.category='accessories';
    d.commerce=d.commerce||{};
    d.commerce.currency='USD';
    d.commerce.regularPrice=selection.price;
    d.commerce.basePrice=p.v5.config.basePrice;
    d.commerce.stickyTitle=p.commerce.stickyTitle;
    d.commerce.selection=selection.variant.label;
    d.commerce.fastTrack=selection.fast;
    d.reviews=d.reviews||{};
    d.reviews.key=p.reviewsKey;
    d.page=d.page||{};
    d.page.productPath='/demograf_binding_posts';
    return d;
  }

  function syncProductData(p,selection){
    var el=document.getElementById('product-data');
    if(!el||state.writing) return;
    var next=desiredData(p,selection);
    var text=JSON.stringify(next,null,2);
    if(str(el.textContent)===str(text)) return;
    state.writing=true;
    el.textContent=text;
    state.writing=false;
  }

  function patchLiveReviews(root,p){
    if(!root) return;
    var live=root.querySelector('.v3-live-reviews');
    if(!live) return;
    Array.prototype.slice.call(live.querySelectorAll('*')).forEach(function(el){
      if(el.children.length) return;
      var t=str(el.textContent);
      if(!t) return;
      if(/Audioinstrument Grand Tower/i.test(t)) el.textContent=t.replace(/Audioinstrument Grand Tower/gi,p.commerce.displayName);
    });
    var btn=live.querySelector('.other-reviews-btn');
    if(btn) btn.setAttribute('aria-label','Open other reviews for '+p.commerce.displayName);
  }

  function injectOptions(p){
    var root=document.getElementById(ROOT_ID);
    if(!root) return false;
    var holder=root.querySelector('.v3-js-product');
    var buy=root.querySelector('.v3-buy');
    if(!holder||!buy) return false;

    var old=holder.querySelector('.fp-v5-options');
    if(old) old.remove();

    var cfg=p.v5.config;
    var box=document.createElement('div');
    box.className='fp-v5-options';
    box.innerHTML=''+
      '<div class="fp-v5-row"><label class="fp-v5-label">Select Model (Set of 4):</label><select class="fp-v5-select">'+
        cfg.variants.map(function(v,i){return '<option value="'+i+'">'+esc(v.label)+' — '+esc(money(v.price))+'</option>';}).join('')+
      '</select></div>'+
      '<div class="fp-v5-row"><label class="fp-v5-check"><input class="fp-v5-fast" type="checkbox"><span>Fast-track production (+'+cfg.fastTrackPercent+'% of selected retail price)</span></label></div>'+
      '<div class="fp-v5-total">Total: <span class="fp-v5-total-value"></span></div>';

    holder.insertBefore(box,buy);

    function recalc(){
      var s=currentSelection(root,p);
      var price=root.querySelector('#v3-main-price');
      var buyPrice=root.querySelector('.v3-buy-price');
      var name=root.querySelector('#v3-tilda-product-name');
      var total=root.querySelector('.fp-v5-total-value');
      if(price) price.textContent=String(s.price);
      if(buyPrice) buyPrice.textContent=money(s.price);
      if(name) name.textContent=p.v5.config.cartBaseName+' — '+s.variant.label+(s.fast?' — Fast-track':'');
      if(total) total.textContent=money(s.price);
      syncProductData(p,s);
      console.info('[Master Product V3 V5] PRODUCT STATE SYNC',{variant:s.variant.label,price:s.price,fastTrack:s.fast});
    }

    box.addEventListener('change',recalc);
    recalc();
    patchLiveReviews(root,p);
    return true;
  }

  function revealHero(){document.documentElement.classList.remove('fp-v5-wait');}

  function installProductDataObserver(p){
    var el=document.getElementById('product-data');
    if(!el||!window.MutationObserver||state.observer) return;
    state.observer=new MutationObserver(function(){
      if(state.writing) return;
      var root=document.getElementById(ROOT_ID);
      var s=currentSelection(root,p);
      setTimeout(function(){syncProductData(p,s);},0);
    });
    state.observer.observe(el,{childList:true,subtree:true,characterData:true});
  }

  function mount(){
    state.tries++;
    var seed=captureSeed();
    if(!seed) return false;
    var api=window.FilinMasterProductV3;
    var rich=findRich(seed.slug);
    if(!api||!api.profiles||typeof api.apply!=='function'||!window.FilinRichCatalogV2) return false;

    var cfg=configFor(seed,rich);
    if(!cfg){
      console.warn('[Master Product V3 V5] no exact source profile for slug',seed.slug);
      revealHero();
      return true;
    }

    var p=profileFor(seed,rich,cfg);
    state.profile=p;
    api.profiles[p.slug]=p;
    console.info('[Master Product V3 V5] EXACT PROFILE CREATED',{version:VERSION,slug:p.slug,price:p.commerce.basePrice,tabs:['Description','Specification','Reviews'],variants:cfg.variants.length});

    try{api.apply();}catch(e){console.error('[Master Product V3 V5] APPLY FAILED',e);revealHero();return true;}

    [0,80,220,600,1400,3000].forEach(function(ms){setTimeout(function(){injectOptions(p);patchLiveReviews(document.getElementById(ROOT_ID),p);},ms);});
    installProductDataObserver(p);
    revealHero();
    return true;
  }

  if(!mount()){
    var timer=setInterval(function(){if(mount()||state.tries>=200)clearInterval(timer);},40);
  }

  setTimeout(function(){
    if(document.documentElement.classList.contains('fp-v5-wait')){
      console.warn('[Master Product V3 V5] FAIL-OPEN',{tries:state.tries});
      revealHero();
    }
  },5000);
})();
