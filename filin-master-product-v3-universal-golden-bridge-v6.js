/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 UNIVERSAL GOLDEN BRIDGE V6
   Binding Posts golden-candidate validation layer.

   V6 fixes:
   - exact original advertising copy for hero + overview
   - Plating is a real Golden tab with 3 price variants
   - Fast-Track is a real Golden tab
   - no separate Total line; BUY NOW + sticky header are the price UI
   - current selected price is synchronized to #product-data and legacy Tilda product nodes
   - Zero Block / legacy Tilda gallery hydration using the same technique as Registry V1
   - preserves live Reviews tab appended by frozen Golden V3.3.2
   - no Grand Tower / Quadron product data leakage
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_MASTER_PRODUCT_V3_UNIVERSAL_GOLDEN_BRIDGE_V6__) return;
  window.__FILIN_MASTER_PRODUCT_V3_UNIVERSAL_GOLDEN_BRIDGE_V6__=true;

  var VERSION='6.0.0';
  var ROOT_ID='filin-master-product-v3';
  var STYLE_ID='filin-master-product-v3-v6-style';
  var state={seed:null,profile:null,tries:0,writing:false,variantIndex:0,fastTrack:false,hydrated:false,hydrating:false,observer:null};

  var HERO_IMAGE='https://static.tildacdn.com/tild3534-6334-4937-b934-666331653065/Gemini_Generated_Ima.png';
  var PRODUCT_IMAGE='https://static.tildacdn.com/tild3537-3633-4834-b839-343838383963/______100-Photoroom.png';
  var SOURCE_URLS=['/demograf_binding_posts','/demograf_solid_copper_banana_plugs'];

  function str(v){return String(v==null?'':v).trim();}
  function num(v){var n=Number(v);return Number.isFinite(n)?n:0;}
  function esc(v){return str(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
  function money(v){var n=num(v);try{return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);}catch(e){return '$'+n;}}

  function installStyle(){
    if(document.getElementById(STYLE_ID)) return;
    var s=document.createElement('style');s.id=STYLE_ID;
    s.textContent=''+
      '#'+ROOT_ID+' .fp-v6-choice-list{display:grid;gap:10px;max-width:760px}'+
      '#'+ROOT_ID+' .fp-v6-choice{display:flex;align-items:center;gap:12px;padding:14px 16px;border:1px solid rgba(31,27,23,.16);border-radius:8px;background:#fffdfa;cursor:pointer;font:600 16px/1.35 Montserrat,Arial,sans-serif}'+
      '#'+ROOT_ID+' .fp-v6-choice input{width:20px;height:20px;margin:0;flex:0 0 auto;accent-color:#BC8C5E}'+
      '#'+ROOT_ID+' .fp-v6-choice strong{font-weight:800}'+
      '#'+ROOT_ID+' .fp-v6-fast-copy{max-width:840px;font:500 16px/1.6 Montserrat,Arial,sans-serif}'+
      '#'+ROOT_ID+' .fp-v6-specs{width:100%;border-collapse:collapse}'+
      '#'+ROOT_ID+' .fp-v6-specs td{padding:14px 12px;border-bottom:1px solid rgba(0,0,0,.09);vertical-align:top;font-size:17px;line-height:1.45}'+
      '#'+ROOT_ID+' .fp-v6-specs td:first-child{width:31%;font-weight:700}'+
      '#'+ROOT_ID+' .fp-v6-desc h3{margin:28px 0 12px;font-size:21px}'+
      '#'+ROOT_ID+' .fp-v6-desc p,#'+ROOT_ID+' .fp-v6-desc li{font-size:17px;line-height:1.6}'+
      '#'+ROOT_ID+' .fp-v6-desc ul{padding-left:22px}'+
      '@media(max-width:820px){#'+ROOT_ID+' .fp-v6-choice{padding:13px 12px;font-size:15px}#'+ROOT_ID+' .fp-v6-specs td{display:block;width:100%!important;padding:8px 4px}#'+ROOT_ID+' .fp-v6-specs td:first-child{padding-top:15px;border-bottom:0}}';
    (document.head||document.documentElement).appendChild(s);
  }
  installStyle();

  function readData(){var el=document.getElementById('product-data');if(!el)return null;try{return JSON.parse(el.textContent||'{}');}catch(e){return null;}}
  function captureSeed(){if(state.seed)return state.seed;var d=readData();if(!d||!d.slug)return null;state.seed=JSON.parse(JSON.stringify(d));console.info('[Master Product V3 V6] SEED CAPTURED',{version:VERSION,slug:d.slug});return state.seed;}
  function findRich(slug){return window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products&&window.FilinRichCatalogV2.products[slug]||null;}

  var HERO_TITLE='Solid Copper Speaker Connectors by Demograf Audio';
  var HERO_DESC='Designed to accommodate heavy gauge acoustic cables, banana plugs, and spade terminals, our bespoke solid copper binding posts offer an exceptionally secure, vibration-resistant contact. This robust mechanical coupling prevents signal degradation over time, ensuring your high-fidelity components performance';
  var OVERVIEW_TITLE='Unique Solid Copper Binding Posts / Speakers & AMP Connectors by Demograf Audio';
  var OVERVIEW_DESC='Demograf Audio solid copper speaker connectors are engineered for high-end audio systems, providing superior signal purity and minimal loss. These precision-machined audiophile-grade connectors offer a durable, secure, and distortion-free connection, ensuring your sound system performs at its peak.';

  var DESC_HTML=''+
    '<div class="fp-v6-desc">'+
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

  var SPEC_ROWS=[
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

  var VARIANTS=[
    {label:'No plating',price:100},
    {label:'Silver plating',price:150},
    {label:'Gold plating',price:250}
  ];

  function specHTML(){return '<table class="fp-v6-specs"><tbody>'+SPEC_ROWS.map(function(r){return '<tr><td>'+String(r[0])+'</td><td>'+String(r[1])+'</td></tr>';}).join('')+'</tbody></table>';}
  function platingHTML(){return '<div class="fp-v6-choice-list fp-v6-plating">'+VARIANTS.map(function(v,i){return '<label class="fp-v6-choice"><input type="radio" name="fp-v6-plating" value="'+i+'"'+(i===state.variantIndex?' checked':'')+'><span><strong>'+esc(v.label)+'</strong> — '+esc(money(v.price))+'</span></label>';}).join('')+'</div>';}
  function fastHTML(){return '<div class="fp-v6-fast-copy"><label class="fp-v6-choice"><input class="fp-v6-fast" type="checkbox"'+(state.fastTrack?' checked':'')+'><span><strong>Fast-track production</strong> (+50% of selected retail price)</span></label><p>Priority production is calculated from the currently selected plating version.</p></div>';}
  function tabsHTML(){return ''+
    '<div class="tabs-wrapper"><div class="tabs-header">'+
      '<button class="tab-btn active" type="button" onclick="showTab(event, \'desc\')">Description</button>'+
      '<button class="tab-btn" type="button" onclick="showTab(event, \'spec\')">Specification</button>'+
      '<button class="tab-btn" type="button" onclick="showTab(event, \'plating\')">Plating</button>'+
      '<button class="tab-btn" type="button" onclick="showTab(event, \'fast-track\')">Fast-Track</button>'+
    '</div>'+
    '<div class="tab-content" id="desc"><div class="content-container">'+DESC_HTML+'</div></div>'+
    '<div class="tab-content" id="spec" style="display:none"><div class="content-container">'+specHTML()+'</div></div>'+
    '<div class="tab-content" id="plating" style="display:none"><div class="content-container">'+platingHTML()+'</div></div>'+
    '<div class="tab-content" id="fast-track" style="display:none"><div class="content-container">'+fastHTML()+'</div></div>'+
    '</div>';
  }

  function initialImages(rich){
    var out=[],seen={};
    [PRODUCT_IMAGE].concat(rich&&Array.isArray(rich.images)?rich.images:[]).concat([HERO_IMAGE]).forEach(function(u){u=str(u);if(!u||seen[u])return;seen[u]=1;out.push(u);});
    return out;
  }

  function makeProfile(seed,rich){
    var imgs=initialImages(rich);
    return {
      schemaVersion:6,slug:str(seed.slug),id:str(seed.id||'demograf-binding-posts'),category:'accessories',currency:'USD',
      hero:{staticH1:HERO_TITLE,description:HERO_DESC,background:HERO_IMAGE},
      curator:'Personally selected & curated by Filin Labs Kazakhstan.',
      overview:{title:OVERVIEW_TITLE,html:'<p>'+esc(OVERVIEW_DESC)+'</p>',galleryImages:imgs},
      curation:[
        {title:'Category & Price',html:'<strong>Speaker / Amplifier Connectors</strong><br>From $100 per set of 4'},
        {title:'Material & Finish',html:'Pure solid copper<br>No plating / Silver plating / Gold plating'},
        {title:'Compatibility',html:'Crimping, spade, or banana plug<br>8 mm diameter · 30 mm thread length'},
        {title:'Curator’s Choice',html:'Precision-machined solid-copper signal connection with configurable surface plating.'}
      ],
      commerce:{basePrice:100,displayName:OVERVIEW_TITLE,cartName:'Demograf Audio Solid Copper Binding Posts — Set of 4',stickyTitle:'Demograf Audio Binding Posts',innerHTML:tabsHTML()},
      reviewsCTA:'View The Reviews of Demograf Audio Binding Posts',reviewsQuery:'Demograf Audio Binding Posts',reviewsIntro:'Share your listening experience with Demograf Audio Binding Posts.',reviewsKey:'demograf-binding-posts',
      golden:{backLabel:"Back to the Filin's nest",backHref:'/',mobileHeroHeight:860,resultLabel:'Ultimate Synergy'}
    };
  }

  function selection(){var v=VARIANTS[state.variantIndex]||VARIANTS[0];var price=v.price;if(state.fastTrack)price=Math.round(price*1.5);return {variant:v,price:price,fastTrack:state.fastTrack};}

  function writeProductData(p,s){
    var el=document.getElementById('product-data');if(!el||state.writing)return;
    var d=readData()||{};
    d.schemaVersion=1;d.id=p.id;d.slug=p.slug;d.brand='Demograf Audio';d.model='Reference Solid Copper Binding Posts';d.name=OVERVIEW_TITLE;d.category='accessories';
    d.commerce=d.commerce||{};d.commerce.currency='USD';d.commerce.regularPrice=s.price;d.commerce.basePrice=100;d.commerce.stickyTitle=p.commerce.stickyTitle;d.commerce.selection=s.variant.label;d.commerce.fastTrack=s.fastTrack;
    d.reviews=d.reviews||{};d.reviews.key='demograf-binding-posts';d.page=d.page||{};d.page.productPath='/demograf_binding_posts';
    var text=JSON.stringify(d,null,2);if(str(el.textContent)===str(text))return;state.writing=true;el.textContent=text;state.writing=false;
  }

  function isStickyLeaf(el){if(!el||el.children.length)return false;var p=el;for(var i=0;i<8&&p;i++,p=p.parentElement){try{var pos=getComputedStyle(p).position;if(pos==='fixed'||pos==='sticky')return true;}catch(e){}}return false;}
  function syncSticky(p,s){
    Array.prototype.slice.call(document.querySelectorAll('body *')).forEach(function(el){
      if(!isStickyLeaf(el))return;var t=str(el.textContent);if(!t||t.length>220)return;
      if(/Quadron|Grand Tower|Solid Copper Speaker Connectors\s*-\s*Binding Posts|Demograf Audio Reference Solid Copper Binding Posts|Solid Copper Speaker Connectorsby Demograf/i.test(t)&&!/BUY NOW/i.test(t)&&!/^\$/.test(t)){el.textContent=p.commerce.stickyTitle;return;}
      if(/^\$\s?[\d,]+$/.test(t)){el.textContent=money(s.price);}
    });
  }

  function syncLegacyProduct(p,s){
    Array.prototype.slice.call(document.querySelectorAll('.js-product')).forEach(function(box){
      if(box.closest('#'+ROOT_ID))return;
      var name=box.querySelector('.js-product-name');var nameText=str(name&&name.textContent);
      if(!/binding posts|solid copper speaker connectors/i.test(nameText))return;
      var price=box.querySelector('.js-product-price');if(price)price.textContent=String(s.price);
      if(name)name.textContent=p.commerce.cartName+' — '+s.variant.label+(s.fastTrack?' — Fast-track':'');
    });
  }

  function syncState(){
    var root=document.getElementById(ROOT_ID),p=state.profile;if(!root||!p)return;
    var s=selection();
    var price=root.querySelector('#v3-main-price');if(price)price.textContent=String(s.price);
    var buyPrice=root.querySelector('.v3-buy-price');if(buyPrice)buyPrice.textContent=money(s.price);
    var name=root.querySelector('#v3-tilda-product-name');if(name)name.textContent=p.commerce.cartName+' — '+s.variant.label+(s.fastTrack?' — Fast-track':'');
    writeProductData(p,s);syncSticky(p,s);syncLegacyProduct(p,s);
    console.info('[Master Product V3 V6] PRODUCT STATE SYNC',{variant:s.variant.label,price:s.price,fastTrack:s.fastTrack});
  }

  function wireControls(){
    var root=document.getElementById(ROOT_ID);if(!root)return false;
    root.querySelectorAll('input[name="fp-v6-plating"]').forEach(function(inp){
      inp.checked=Number(inp.value)===state.variantIndex;
      if(inp.dataset.fpv6Bound==='1')return;inp.dataset.fpv6Bound='1';
      inp.addEventListener('change',function(){if(!inp.checked)return;state.variantIndex=Math.max(0,Math.min(VARIANTS.length-1,Number(inp.value)||0));syncState();});
    });
    var fast=root.querySelector('.fp-v6-fast');if(fast){fast.checked=state.fastTrack;if(fast.dataset.fpv6Bound!=='1'){fast.dataset.fpv6Bound='1';fast.addEventListener('change',function(){state.fastTrack=!!fast.checked;syncState();});}}
    syncState();return true;
  }

  function decodeEntities(v){var ta=document.createElement('textarea');ta.innerHTML=String(v==null?'':v);return ta.value;}
  function normalizeCandidate(raw){var s=decodeEntities(raw).trim().replace(/\\\//g,'/').replace(/\\u002f/gi,'/');s=s.replace(/^url\((['"]?)/i,'').replace(/(['"]?)\)$/,'').replace(/["'\s]+$/,'');if(/^\/\//.test(s))s='https:'+s;if(/^\//.test(s))s=location.origin+s;return s;}
  function validImage(u){if(!u||!/^https?:\/\//i.test(u)||!/(?:static|thb)\.tildacdn\.com/i.test(u))return false;if(/(?:blank\.gif|empty\.png|pixel|favicon|icon-|tildacopy|logo|sprite)/i.test(u))return false;return true;}
  function addRaw(list,seen,raw){
    if(!raw)return;var decoded=decodeEntities(raw).replace(/\\\//g,'/').replace(/\\u002f/gi,'/');var rx=/https?:\/\/(?:static|thb)\.tildacdn\.com\/[^"'<>\s\\,}\]]+/gi,m,found=false;
    function push(x){var u=normalizeCandidate(x);if(!validImage(u))return;var key=u.replace(/[?#].*$/,'');if(seen[key])return;seen[key]=1;list.push(u);}
    while((m=rx.exec(decoded))){found=true;push(m[0]);}if(!found)decoded.split(',').forEach(function(part){push(part.trim().split(/\s+/)[0]);});
  }
  function extractFromScope(scope,list,seen){
    var attrs=['data-original','data-src','data-lazy-src','data-img-zoom-url','data-bg','data-bg-img','data-original-src','src','srcset','data-gallery-img','data-zoom-target','data-content-cover-bg'];
    scope.querySelectorAll('*').forEach(function(el){attrs.forEach(function(a){if(el.hasAttribute&&el.hasAttribute(a))addRaw(list,seen,el.getAttribute(a));});if(el.attributes)Array.prototype.forEach.call(el.attributes,function(a){if(a&&a.value&&/tildacdn\.com|li_img|imgurl|image/i.test(a.value))addRaw(list,seen,a.value);});var st=el.getAttribute&&el.getAttribute('style');if(st)addRaw(list,seen,st);});
    addRaw(list,seen,scope.outerHTML||'');
  }
  function extractProductImages(doc){
    var list=[],seen={};var recs=Array.prototype.slice.call(doc.querySelectorAll('.t-rec,[id^="rec"]'));var picks=[];
    recs.forEach(function(rec,i){var t=str(rec.textContent).toLowerCase();var score=0;if(t.indexOf('binding posts')>=0)score+=4;if(t.indexOf('solid copper')>=0)score+=2;if(t.indexOf('speaker connectors')>=0)score+=2;if(t.indexOf('demograf audio')>=0)score+=1;if(score>=3){for(var j=Math.max(0,i-1);j<=Math.min(recs.length-1,i+2);j++)picks.push(recs[j]);}});
    if(!picks.length)picks=[doc];
    var used=[];picks.forEach(function(x){if(used.indexOf(x)>=0)return;used.push(x);extractFromScope(x,list,seen);});
    return list;
  }

  function hydrateGallery(){
    if(state.hydrated||state.hydrating||!state.profile)return;state.hydrating=true;
    Promise.all(SOURCE_URLS.map(function(url){return fetch(url,{credentials:'same-origin',cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();}).then(function(html){return extractProductImages(new DOMParser().parseFromString(html,'text/html'));}).catch(function(e){console.warn('[Master Product V3 V6] GALLERY SOURCE FAILED',url,e);return [];});})).then(function(groups){
      var merged=[],seen={};
      (state.profile.overview.galleryImages||[]).concat.apply(state.profile.overview.galleryImages||[],groups).forEach(function(u){u=normalizeCandidate(u);if(!validImage(u))return;var k=u.replace(/[?#].*$/,'');if(seen[k])return;seen[k]=1;merged.push(u);});
      if(merged.length>state.profile.overview.galleryImages.length){
        state.profile.overview.galleryImages=merged;state.hydrated=true;
        console.info('[Master Product V3 V6] LEGACY/ZERO GALLERY HYDRATED',{images:merged.length,galleryImages:merged.slice()});
        var api=window.FilinMasterProductV3;try{api&&api.apply&&api.apply();}catch(e){console.warn('[Master Product V3 V6] gallery reapply failed',e);}
        [0,120,450,1200].forEach(function(ms){setTimeout(function(){wireControls();},ms);});
      }else{state.hydrated=true;console.info('[Master Product V3 V6] LEGACY/ZERO GALLERY NO CHANGE',{images:merged.length});}
      state.hydrating=false;
    });
  }

  function patchReviews(){var root=document.getElementById(ROOT_ID);if(!root)return;var live=root.querySelector('.v3-live-reviews');if(!live)return;Array.prototype.slice.call(live.querySelectorAll('*')).forEach(function(el){if(el.children.length)return;var t=str(el.textContent);if(/Audioinstrument Grand Tower/i.test(t))el.textContent=t.replace(/Audioinstrument Grand Tower/gi,'Demograf Audio Binding Posts');});}

  function installDataObserver(){var el=document.getElementById('product-data');if(!el||!window.MutationObserver||state.observer)return;state.observer=new MutationObserver(function(){if(state.writing)return;setTimeout(syncState,0);});state.observer.observe(el,{childList:true,subtree:true,characterData:true});}
  function ready(){document.documentElement.classList.add('fp-v6-ready');document.documentElement.classList.remove('fp-v6-boot');}

  function mount(){
    state.tries++;var seed=captureSeed();if(!seed)return false;var api=window.FilinMasterProductV3,rich=findRich(seed.slug);if(!api||!api.profiles||typeof api.apply!=='function'||!window.FilinRichCatalogV2)return false;
    if(str(seed.slug)!=='demograf_binding_posts'){console.warn('[Master Product V3 V6] unsupported slug',seed.slug);ready();return true;}
    var p=makeProfile(seed,rich);state.profile=p;api.profiles[p.slug]=p;
    console.info('[Master Product V3 V6] EXACT PROFILE CREATED',{version:VERSION,slug:p.slug,basePrice:100,tabs:['Description','Specification','Plating','Fast-Track','Reviews'],variants:VARIANTS.length,initialImages:p.overview.galleryImages.length});
    try{api.apply();}catch(e){console.error('[Master Product V3 V6] APPLY FAILED',e);ready();return true;}
    [0,60,180,500,1200,2600,5000].forEach(function(ms){setTimeout(function(){wireControls();patchReviews();},ms);});
    installDataObserver();setTimeout(hydrateGallery,120);setTimeout(hydrateGallery,1300);ready();return true;
  }

  if(!mount()){var timer=setInterval(function(){if(mount()||state.tries>=240)clearInterval(timer);},35);}
  setTimeout(function(){if(!document.documentElement.classList.contains('fp-v6-ready')){console.warn('[Master Product V3 V6] FAIL-OPEN',{tries:state.tries});ready();}},5000);
})();