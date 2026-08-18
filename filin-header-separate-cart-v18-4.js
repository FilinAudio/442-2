(function(){
  'use strict';
  if(window.__FILIN_SEPARATE_CART_V18__) return;
  window.__FILIN_SEPARATE_CART_V18__=true;
  const CONFIG={
    CART_PATH:'/cart',
    CATALOG_PATH:'/catalog',
    SPECIAL_OFFERS_PATH:'/special',
    SHIPPING_PATH:'/shipping',
    WARRANTY_PATH:'/warranty',
    WARRANTY_STORE_KEY:'flcart_warranty_v1',
    SURVEY_PAGE:'/',
    SURVEY_DISCOUNT_PERCENT:10,
    SURVEY_PROMO_CODE:'YOURSURVEY10',
    SURVEY_REWARD_KEY:'filin_cart_survey_reward_v1',
    SURVEY_IFRAME_TIMEOUT:30000,
    /* Resonance Club / Loyalty */
    LOYALTY_PAGE:'/loyalty-program',
    LOYALTY_WALLET_PREFIX:'filin_resonance_wallet_v1::',
    LOYALTY_POINTS_PER_DOLLAR_CREDIT:50, /* 250 Points = $5 */
    LOYALTY_MIN_REDEEM_POINTS:250,
    LOYALTY_REDEEM_STEP_POINTS:250,
    LOYALTY_MAX_REDEEM_PERCENT:25,
    LOYALTY_TEST_MODE:false,
    CURRENCY:'USD',
    COUNTRY_CODE:'US',
    BNPL_MINIMUM:50,
    OPTION_SNAPSHOT_KEY:'flcart_pending_options_v4',
    OPTION_STORE_KEY:'flcart_saved_options_v4',
    OPTION_IMAGE_MAP:{},
    /* Exact active promotions. Only one can be selected at a time. */
    DEFAULT_SPECIAL_OFFERS:[
      {
        id:'launch-sale',
        title:'Grand Opening Offer — 10% Off Any Filin Labs Assortment',
        promoCode:'GREATOPENING10',
        percent:10,
        discountScope:'all',
        link:'/launch_sale'
      },
      {
        id:'preorder-sale',
        title:'Exclusive Pre-Order — 10% Off Eligible Headphones',
        promoCode:'YOURPREORDER10',
        percent:10,
        discountScope:'eligible-products',
        eligiblePaths:[
          '/filin_audio_limited',
          '/perun_modern_closed',
          '/orvellium_nocturne_aura'
        ],
        link:'/preorder_sale'
      },
      {
        id:'quadron-bundle-sale',
        title:'Filin Quadron Bundle — 50% Off Purity Cable & Speakers-XLR Adapter Filin Eternal',
        promoCode:'QUADRONEXP50',
        percent:50,
        discountScope:'eligible-products',
        requiredPaths:['/filin_audio_quadron'],
        eligiblePaths:[
          '/filin_audio_purity_headphones_cable',
          '/speakers_xlr_adapter_filin_eternal'
        ],
        autoAddPaths:[
          '/filin_audio_purity_headphones_cable',
          '/speakers_xlr_adapter_filin_eternal'
        ],
        link:'/quadron_bundle_sale'
      }
    ],
    /* The adapter page can be published later at this path.
       Until it exists, the cable row still shows the included adapter note.
       If the final page path differs, change only this path in the offer above. */
    QUADRON_CABLE_PATH:'/filin_audio_purity_headphones_cable',
    QUADRON_ADAPTER_PATH:'/speakers_xlr_adapter_filin_eternal',
    QUADRON_ADAPTER_TITLE:'Speakers-XLR Adapter Filin Eternal',
    RELATED_PRODUCTS:[
      {url:'/demograf_icarus_ac_power_cable',tags:['power','amplifier','dac','streamer','speaker','accessory']},
      {url:'/filin_audio_purity_headphones_cable',tags:['headphone','headphones','cable']},
      {url:'/demograf_anthea_rarecorefusion_headphones_cable',tags:['headphone','headphones','cable']},
      {url:'/konstantin_audio_a_1_synergy_speaker_cables',tags:['speaker','speakers','cable']},
      {url:'/demograf_andromeda_speaker_cable',tags:['speaker','speakers','cable']},
      {url:'/gerbera_solero_network_switch_tube_clock',tags:['streamer','digital','dac','network']},
      {url:'/sciber_encore_universal_linear_power_supply',tags:['dac','streamer','power','accessory']}
    ],
    MAX_RECOMMENDATIONS:4
  };
  const state={
    nativeOpen:null,lastBnplAmount:-1,
    lastRecommendationKey:'',recommendationCache:new Map(),productMetaCache:new Map(),
    specialOffers:[],discountChoice:null,discountTab:'promo',offerStatus:'',offerBusy:false,patchTimer:null,updateTimer:null,
    renderLock:false,lastCartSignature:'',lastViewCartSignature:'',optionStore:null,warrantyStore:null,cartReady:false,initialScrollDone:false,
    surveyFrame:null,surveyWatchTimer:null,surveyCompleted:false,surveyPromoApplied:false,
    loyaltyWallet:null,loyaltyStatus:'',loyaltyRequestedPoints:0
  };
  const normPath=value=>(String(value||'/').replace(/\/+$/,'')||'/');
  const onCartPage=()=>normPath(location.pathname)===normPath(CONFIG.CART_PATH);
  const escapeHtml=value=>String(value??'').replace(/[&<>'"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[ch]));
  const normalize=value=>String(value||'').toLowerCase().replace(/[“”"']/g,'').replace(/[^a-z0-9а-яё%+.-]+/gi,' ').trim();
  const number=value=>{const n=Number(String(value??'').replace(/[^0-9.-]/g,''));return Number.isFinite(n)?n:0};
  const money=value=>new Intl.NumberFormat('en-US',{
    style:'currency',
    currency:CONFIG.CURRENCY,
    minimumFractionDigits:0,
    maximumFractionDigits:0
  }).format(Math.max(0,number(value)));
  const absoluteUrl=value=>{try{return value?new URL(value,location.origin).href:''}catch(e){return String(value||'')}};
  const decodeHtml=value=>{const el=document.createElement('textarea');el.innerHTML=String(value||'');return el.value};
  const cleanTitle=value=>decodeHtml(value).replace(/&quot;/gi,'"').replace(/\s*[|–—]\s*Filin Labs.*$/i,'').replace(/\s+/g,' ').trim();
  function track(name,params={}){
    const payload=Object.assign({event_category:'Filin Cart'},params);
    try{
      if(typeof window.gtag==='function')window.gtag('event',name,payload);
      else{window.dataLayer=window.dataLayer||[];window.dataLayer.push(Object.assign({event:name},payload))}
    }catch(e){}
  }
  function gaItem(product,quantity=productQuantity(product)){
    return {item_id:String(product.uid||product.sku||product.externalid||productKey(product)),item_name:productName(product),price:productPrice(product),quantity,item_category:'Audio Equipment'};
  }
  function getProducts(){
    if(!window.tcart||!Array.isArray(window.tcart.products))return [];
    return window.tcart.products.map((product,index)=>({product,index})).filter(({product})=>product&&product.deleted!=='yes'&&number(product.quantity||product.qty||1)>0);
  }
  function rawProducts(){return getProducts().map(entry=>entry.product)}
function productName(product) {
  return cleanTitle(
    product?.name ||
    product?.title ||
    product?.product ||
    product?.__flcartCanonicalName ||
    'Product'
  );
}
function productUrl(product){return String(product?.__flcartUrl||product?.url||product?.link||product?.product_url||product?.href||'').trim()}
  function productPrice(product){return number(product?.price||product?.unitprice||product?.baseprice||0)}
  function productQuantity(product){return Math.max(1,Math.round(number(product?.quantity||product?.qty||1)))}

  /* Mobile price breakdown.
     Tilda's current product.price is treated as the authoritative unit price
     after options. When a clean base price is available, the difference is
     shown as the options amount; otherwise the options amount safely falls
     back to $0 without changing cart totals. */
  function productBaseUnitPrice(product){
    const finalUnit=productPrice(product);
    const candidates=[
      product?.__flcartBasePrice,
      product?.baseprice,product?.basePrice,product?.base_price,
      product?.pricebase,product?.priceBase,product?.price_base,
      product?.initialprice,product?.initialPrice,product?.initial_price,
      product?.originalprice,product?.originalPrice,product?.original_price,
      product?.priceDef,product?.price_def,
      product?.priceWithoutOptions,product?.price_without_options
    ];
    for(const candidate of candidates){
      const n=number(candidate);
      if(n>0&&(!finalUnit||n<=finalUnit))return n;
    }
    return finalUnit;
  }
  function productOptionsUnitAmount(product){
    const finalUnit=productPrice(product);
    const baseUnit=productBaseUnitPrice(product);
    return Math.max(0,finalUnit-baseUnit);
  }
  function productImage(product){
    const candidate=product?.__flcartImage||product?.img||product?.image||product?.picture||product?.photo||product?.thumbnail||product?.preview||product?.imgurl||product?.image_url||'';
    if(typeof candidate==='object'&&candidate)return absoluteUrl(candidate.url||candidate.src||candidate.image||'');
    return absoluteUrl(String(candidate||'').trim());
  }
  function productKey(product){
    const direct=product?.uid||product?.sku||product?.externalid||product?.external_id||product?.lid||product?.id;
    if(direct)return `id:${direct}`;
    const path=productUrl(product);if(path){try{return `url:${normPath(new URL(path,location.origin).pathname)}`}catch(e){}}
    return `name:${normalize(productName(product))}|${productPrice(product)}`;
  }
  function subtotal(){return rawProducts().reduce((sum,p)=>sum+productPrice(p)*productQuantity(p),0)}
  function shippingAmount(){return number(window.tcart?.deliveryprice||window.tcart?.shipping||window.tcart?.shippingamount||window.tcart?.delivery?.price||0)}
  function taxAmount(){return number(window.tcart?.tax||window.tcart?.taxamount||window.tcart?.vat||window.tcart?.vatamount||0)}
  function nativeTotal(){const direct=number(window.tcart?.amount||window.tcart?.prodamount||window.tcart?.total);return direct>0?direct:subtotal()+shippingAmount()+taxAmount()}
  function itemCount(){return rawProducts().reduce((sum,p)=>sum+productQuantity(p),0)}
  function productPath(product){
    const url=productUrl(product);
    if(url){try{return normPath(new URL(url,location.origin).pathname)}catch(e){}}
    return '';
  }
  function targetSlug(path){return normPath(path).split('/').filter(Boolean).pop()||''}
  function productMatchesPath(product,path){
    const target=normPath(path),actual=productPath(product);
    if(actual&&actual===target)return true;
    const slug=targetSlug(target),name=normalize(productName(product));
    if(!slug||!name)return false;
    const words=normalize(slug.replace(/[_-]+/g,' '));
    return !!words&&(name===words||name.includes(words)||words.includes(name));
  }
  function cartHasPath(path){return rawProducts().some(product=>productMatchesPath(product,path))}
  function eligibleProductsForChoice(choice){
    if(!choice)return [];
    if(choice.discountScope==='all'||choice.type==='survey')return rawProducts();
    const paths=Array.isArray(choice.eligiblePaths)?choice.eligiblePaths:[];
    return rawProducts().filter(product=>paths.some(path=>productMatchesPath(product,path)));
  }
  function choiceEligibility(choice){
    if(!choice)return {eligible:false,message:'Select a promotion.'};
    const required=Array.isArray(choice.requiredPaths)?choice.requiredPaths:[];
    const missingRequired=required.filter(path=>!cartHasPath(path));
    if(missingRequired.length){
      return {eligible:false,message:'Add Filin Audio Quadron to the cart to use this bundle offer.'};
    }
    if(choice.discountScope==='eligible-products'&&!eligibleProductsForChoice(choice).length){
      if(choice.id==='preorder-sale')return {eligible:false,message:'Add Filin Audio Limited, Perun Audio Modern Closed, or Orvellium Nocturne “Aura” to use this pre-order offer.'};
      if(choice.id==='quadron-bundle-sale')return {eligible:false,message:'The eligible bundle accessories will be added to the cart.'};
      return {eligible:false,message:'Add an eligible product to use this offer.'};
    }
    return {eligible:true,message:''};
  }
  function readJsonStorage(key,fallback){try{return JSON.parse(localStorage.getItem(key)||'')||fallback}catch(e){return fallback}}
  function writeJsonStorage(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch(e){}}
  function optionStore(){if(!state.optionStore)state.optionStore=readJsonStorage(CONFIG.OPTION_STORE_KEY,{});return state.optionStore}
  function saveOptionStore(){writeJsonStorage(CONFIG.OPTION_STORE_KEY,optionStore())}

  /* Extended warranty: 1 year is included by default.
     Upgrade price is calculated from the unit retail price. */
  function warrantyStore(){
    if(!state.warrantyStore)state.warrantyStore=readJsonStorage(CONFIG.WARRANTY_STORE_KEY,{});
    return state.warrantyStore;
  }
  function saveWarrantyStore(){writeJsonStorage(CONFIG.WARRANTY_STORE_KEY,warrantyStore())}
  function warrantyKey(product){
    const options=optionEntries(product)
      .map(o=>`${normalize(o.label)}=${normalize(o.value)}`)
      .sort()
      .join('|');
    return `${productKey(product)}|${options}`;
  }
  function normalizeWarrantyYears(value){
    const years=Math.round(number(value));
    return [1,2,3,4].includes(years)?years:1;
  }
  function warrantyYears(product){
    const direct=normalizeWarrantyYears(product?.__flcartWarrantyYears);
    if(product?.__flcartWarrantyYears!=null)return direct;
    const saved=normalizeWarrantyYears(warrantyStore()[warrantyKey(product)]);
    return saved||1;
  }
  function warrantyPercent(years){
    return ({1:0,2:25,3:40,4:60})[normalizeWarrantyYears(years)]||0;
  }
  function warrantyUnitAmount(product){
    return productPrice(product)*warrantyPercent(warrantyYears(product))/100;
  }
  function warrantyAmount(product){
    return warrantyUnitAmount(product)*productQuantity(product);
  }
  function warrantyTotal(){
    return rawProducts().reduce((sum,product)=>sum+warrantyAmount(product),0);
  }
  function warrantyLabel(product){
    const years=warrantyYears(product);
    if(years===1)return '1 Year Stock';
    const added=years-1;
    return `+${added} Year${added===1?'':'s'} Extended Warranty`;
  }
  function warrantyOptionsHtml(product){
    const selected=warrantyYears(product);
    const options=[
      {years:1,label:'1 Year Stock'},
      {years:2,label:'+1 Year Extended Warranty'},
      {years:3,label:'+2 Years Extended Warranty'},
      {years:4,label:'+3 Years Extended Warranty'}
    ];
    return options.map(item=>`<option value="${item.years}" ${selected===item.years?'selected':''}>${escapeHtml(item.label)}</option>`).join('');
  }
  function setWarranty(index,years){
    const product=window.tcart?.products?.[index];
    if(!product)return;
    years=normalizeWarrantyYears(years);
    product.__flcartWarrantyYears=years;
    warrantyStore()[warrantyKey(product)]=years;
    saveWarrantyStore();
    recalculateNativeCart();
    state.lastCartSignature='';
    track('select_warranty',{
      item_name:productName(product),
      warranty_years:years,
      warranty_percent:warrantyPercent(years),
      warranty_value:warrantyAmount(product)
    });
    setTimeout(()=>updateCartPage(true),30);
  }
  function addOption(entries,label,value,image=''){
    label=cleanTitle(label||'Option');value=cleanTitle(value??'');
    if(!value||/^(undefined|null|false|no)$/i.test(value))return;
    if(/^(quantity|price|total|product|sku)$/i.test(label))return;
    entries.push({label,value,image:String(image||'').trim()});
  }
  function parseOptionSource(entries,source,label='Option',depth=0){
    if(source==null||depth>3)return;
    if(typeof source==='string'){
      source.split(/[;|\n]+/).forEach(part=>{const bits=part.split(/[:=]/);addOption(entries,bits.length>1?bits.shift():label,bits.length?bits.join(':'):part)});return;
    }
    if(Array.isArray(source)){source.forEach(item=>parseOptionSource(entries,item,label,depth+1));return}
    if(typeof source==='object'){
      const objectLabel=source.option||source.label||source.title||source.name||label;
      const direct=source.variant??source.value??source.val??source.selected??source.text??source.choice;
      if(direct!=null&&typeof direct!=='object')addOption(entries,objectLabel,direct,source.img||source.image||source.photo||source.picture||'');
      else Object.entries(source).forEach(([key,val])=>{if(!/^(__|price|amount|quantity|qty|image|img|photo|picture)$/i.test(key))parseOptionSource(entries,val,key,depth+1)});
    }
  }
  function optionEntries(product){
    const entries=[];
    ['options','option','params','parameters','characteristics','variants','modifications','modification','editions','edition','selectedOptions','selectedoptions','optionsList','optionslist','__flcartOptions'].forEach(key=>parseOptionSource(entries,product?.[key],key));
    const saved=optionStore()[productKey(product)];if(saved?.options)parseOptionSource(entries,saved.options,'Option');

    /* Do not show the synthetic aggregate counter such as "Option: 2".
       Real option values such as "Option: Custom Sound Tuning" remain visible. */
    const visibleEntries=entries.filter(entry=>{
      const label=normalize(entry?.label);
      const value=String(entry?.value??'').trim();
      if(/^(option|options)$/.test(label)&&/^\d+(?:[.,]\d+)?$/.test(value))return false;
      return true;
    });

    return visibleEntries.filter((entry,index,array)=>array.findIndex(x=>normalize(x.label)===normalize(entry.label)&&normalize(x.value)===normalize(entry.value))===index).slice(0,30);
  }
  function mappedOptionImage(option,product){const map=CONFIG.OPTION_IMAGE_MAP||{};return absoluteUrl(option.image||map[`${option.label}:${option.value}`]||map[option.value]||map[normalize(`${option.label}:${option.value}`)]||map[normalize(option.value)]||productImage(product)||'')}
  function encodePayload(value){try{const bytes=new TextEncoder().encode(JSON.stringify(value));let binary='';bytes.forEach(byte=>binary+=String.fromCharCode(byte));return btoa(binary).replace(/\+/g,'-').replace(/\//g,'_').replace(/=+$/,'')}catch(e){return ''}}
  function decodePayload(value){try{const base=value.replace(/-/g,'+').replace(/_/g,'/');const binary=atob(base+'==='.slice((base.length+3)%4));const bytes=Uint8Array.from(binary,ch=>ch.charCodeAt(0));return JSON.parse(new TextDecoder().decode(bytes))}catch(e){return null}}
  function optionEditUrl(product){
    const url=productUrl(product);if(!url)return '';
    try{const target=new URL(url,location.origin),payload=encodePayload({product:productName(product),options:optionEntries(product)});if(payload)target.searchParams.set('flcart_options',payload);return target.href}catch(e){return url}
  }
  function optionControlContext(el){
    const root=el.closest('.t-product__option,.js-product-option,[class*="product-option"],[class*="option"],fieldset,label')||el.parentElement;
    const heading=root?.querySelector?.('h2,h3,h4,h5,legend,[class*="title"],[class*="label"]')?.textContent||'';
    return cleanTitle(heading||root?.getAttribute?.('data-option-title')||el.name||el.getAttribute('aria-label')||'Option');
  }
  function selectedOptionsFromScope(scope){
    const entries=[];scope=scope||document;
    scope.querySelectorAll('select').forEach(el=>{const opt=el.options?.[el.selectedIndex];if(opt)addOption(entries,optionControlContext(el),opt.textContent||opt.value)});
    scope.querySelectorAll('input[type="radio"]:checked,input[type="checkbox"]:checked').forEach(el=>addOption(entries,optionControlContext(el),(el.closest('label')?.textContent||el.value||'Selected').trim()));
    scope.querySelectorAll('input[type="number"],input[type="range"],input[type="text"][data-option],input[class*="option"]').forEach(el=>{if(el.value)addOption(entries,optionControlContext(el),el.value)});
    scope.querySelectorAll('[class*="option"] button.is-active,[class*="option"] button.active,[class*="option"] [aria-pressed="true"],[class*="option"] .selected').forEach(el=>addOption(entries,optionControlContext(el),el.textContent||el.getAttribute('data-value')));
    return entries.filter((entry,index,array)=>array.findIndex(x=>normalize(x.label)===normalize(entry.label)&&normalize(x.value)===normalize(entry.value))===index);
  }
  function buyButton(element){
    const clickable=element?.closest?.('a,button,[role="button"]');if(!clickable)return null;
    const signature=`${clickable.getAttribute('href')||''} ${clickable.className||''} ${clickable.textContent||''}`.toLowerCase();
    return /#order:|buy now|add to cart|add to bag|checkout/.test(signature)?clickable:null;
  }
  function captureProductSelection(event){
    const button=buyButton(event.target);if(!button||onCartPage())return;
    const scope=button.closest('.t-store__prod-popup,.js-product,.t-product,[data-product-lid],.t-rec')||document;
    const href=button.getAttribute('href')||'';
    let name=scope.querySelector('h1,h2,[class*="product-title"],[itemprop="name"]')?.textContent||'';
    const orderMatch=href.match(/#order:([^=]+)/i);if(!name&&orderMatch)name=decodeURIComponent(orderMatch[1].replace(/\+/g,' '));
    const img=scope.querySelector('img')?.currentSrc||scope.querySelector('img')?.src||document.querySelector('meta[property="og:image"]')?.content||'';
    const snapshot={timestamp:Date.now(),name:cleanTitle(name||document.title),url:location.href.split('#')[0],image:absoluteUrl(img),options:selectedOptionsFromScope(scope)};
    writeJsonStorage(CONFIG.OPTION_SNAPSHOT_KEY,snapshot);
  }
  document.addEventListener('click',captureProductSelection,true);
function reconcileOptionSnapshots(){

  const pending =
    readJsonStorage(
      CONFIG.OPTION_SNAPSHOT_KEY,
      null
    );

  const store = optionStore();
  const entries = getProducts();


  /* ======================================================
     Pending snapshot may ONLY be attached to the product
     it actually belongs to.

     Never fall back to "last cart product".
     ====================================================== */

  if(
    pending &&
    Date.now() - number(pending.timestamp) < 6 * 60 * 60 * 1000 &&
    entries.length
  ){

    const pendingName =
      normalize(pending.name || '');

    let pendingPath = '';

    try{
      pendingPath = pending.url
        ? normPath(
            new URL(
              pending.url,
              location.origin
            ).pathname
          )
        : '';
    }catch(e){}


    const match =
      entries.find(({product})=>{

        /*
          IMPORTANT:
          use Tilda native name first,
          not stale __flcartCanonicalName
        */

        const nativeName =
          normalize(
            cleanTitle(
              product?.name ||
              product?.title ||
              product?.product ||
              ''
            )
          );


        let currentPath = '';

        try{
          const rawUrl =
            String(
              product?.url ||
              product?.link ||
              product?.product_url ||
              product?.href ||
              ''
            ).trim();

          if(rawUrl){
            currentPath =
              normPath(
                new URL(
                  rawUrl,
                  location.origin
                ).pathname
              );
          }
        }catch(e){}


        const nameMatch =
          !!(
            pendingName &&
            nativeName &&
            (
              nativeName.includes(pendingName) ||
              pendingName.includes(nativeName)
            )
          );


        const urlMatch =
          !!(
            pendingPath &&
            currentPath &&
            pendingPath === currentPath
          );


        return nameMatch || urlMatch;
      });


    /*
      Only write snapshot metadata when we found
      the correct corresponding cart product.
    */

    if(match){

      const {product} = match;


      product.__flcartOptions =
        product.__flcartOptions ||
        pending.options ||
        [];


      if(
        !product.__flcartUrl &&
        pending.url
      ){
        product.__flcartUrl =
          pending.url;
      }


      if(
        !product.__flcartImage &&
        pending.image
      ){
        product.__flcartImage =
          pending.image;
      }


      /*
        Native Tilda product.name is authoritative.
      */

      if(
        !product.__flcartCanonicalName
      ){

        product.__flcartCanonicalName =
          cleanTitle(
            product?.name ||
            product?.title ||
            product?.product ||
            pending.name ||
            'Product'
          );
      }


      store[productKey(product)] = {
        options:
          product.__flcartOptions || [],

        url:
          product.__flcartUrl ||
          productUrl(product),

        image:
          product.__flcartImage || '',

        name:
          productName(product),

        timestamp:
          Date.now()
      };


      saveOptionStore();
    }


    /*
      Snapshot was one-time.
      If it did not match anything, discard it instead
      of contaminating another product.
    */

    try{
      localStorage.removeItem(
        CONFIG.OPTION_SNAPSHOT_KEY
      );
    }catch(e){}
  }


  /* ======================================================
     Restore saved data only for the SAME product key
     ====================================================== */

  entries.forEach(({product})=>{

    const saved =
      store[productKey(product)];

    if(!saved) return;


    product.__flcartOptions =
      product.__flcartOptions ||
      saved.options ||
      [];


    product.__flcartUrl =
      product.__flcartUrl ||
      saved.url ||
      product?.url ||
      '';


    product.__flcartImage =
      product.__flcartImage ||
      saved.image ||
      '';


    /*
      Again: native Tilda name wins.
    */

    product.__flcartCanonicalName =
      cleanTitle(
        product?.name ||
        product?.title ||
        product?.product ||
        product.__flcartCanonicalName ||
        saved.name ||
        'Product'
      );

  });
}
  function prefillProductOptions(){
    const params=new URLSearchParams(location.search),encoded=params.get('flcart_options');if(!encoded)return;
    const payload=decodePayload(encoded);if(!payload||!Array.isArray(payload.options)||!payload.options.length)return;
    let attempt=0;
    const timer=setInterval(()=>{
      attempt++;let applied=0;
      payload.options.forEach(option=>{
        const wanted=normalize(option.value),labelWanted=normalize(option.label);
        const selects=Array.from(document.querySelectorAll('select'));
        const select=selects.find(el=>{const context=normalize(optionControlContext(el));return context.includes(labelWanted)&&Array.from(el.options).some(opt=>normalize(opt.textContent||opt.value)===wanted)})||selects.find(el=>Array.from(el.options).some(opt=>normalize(opt.textContent||opt.value)===wanted));
        if(select){const match=Array.from(select.options).find(opt=>normalize(opt.textContent||opt.value)===wanted);if(match){select.value=match.value;select.dispatchEvent(new Event('change',{bubbles:true}));select.dispatchEvent(new Event('input',{bubbles:true}));applied++}return}
        const input=Array.from(document.querySelectorAll('input[type="radio"],input[type="checkbox"]')).find(el=>{const context=normalize(`${optionControlContext(el)} ${el.closest('label')?.textContent||''} ${el.value||''}`);return context.includes(wanted)&&(context.includes(labelWanted)||!labelWanted)});
        if(input){if(!input.checked)input.click();applied++;return}
        const button=Array.from(document.querySelectorAll('[class*="option"] button,[data-product-variant]')).find(el=>normalize(el.textContent||el.getAttribute('data-value')||'')===wanted);if(button){button.click();applied++}
      });
      if(applied||attempt>40){clearInterval(timer);if(applied){params.delete('flcart_options');history.replaceState(history.state,'',location.pathname+(params.toString()?`?${params}`:'')+location.hash)}}
    },250);
  }
  function isCartTrigger(element){
    if(!element||!element.closest)return false;
    return !!element.closest([
      'a[href="#opencart"]','a[href$="#opencart"]','a[href="#tcart"]','a[href$="#tcart"]',
      '[data-tooltip-hook="#opencart"]','[data-tooltip-hook="#tcart"]','.t706__carticon','.t706__carticon-wrapper',
      '.t706__carticon-imgwrap','[class*="carticon"]','[class*="cart-icon"]','[data-cart-icon]'
    ].join(','));
  }
  document.addEventListener('click',event=>{
    if(!isCartTrigger(event.target))return;
    event.preventDefault();event.stopPropagation();event.stopImmediatePropagation();
    window.__FILIN_CART_EDIT_MODE__=false;
    if(onCartPage()){
      if(rawProducts().length&&typeof window.__FILIN_OPEN_CHECKOUT_ACCORDION__==='function'){
        window.__FILIN_OPEN_CHECKOUT_ACCORDION__();
      }else{
        window.scrollTo({top:Math.max(0,(document.getElementById('flcart-cart-layout')?.getBoundingClientRect().top||0)+window.scrollY-(parseInt(getComputedStyle(document.documentElement).getPropertyValue('--flcart-header-height'))||64)-16),behavior:'smooth'});
      }
    }else location.assign(CONFIG.CART_PATH);
  },true);
  function patchOpenCart(){
    const current=window.tcart__openCart;
    if(typeof current!=='function'||current.__flcartPatched)return false;
    state.nativeOpen=current;
    function patchedOpenCart(){
      /* Outside /cart we deliberately suppress Tilda's automatic cart popup/redirect.
         BUY NOW / Add to Cart adds the product, updates the cart icon and keeps the
         customer on the product page. The Header cart icon is handled separately
         by isCartTrigger() and is the explicit way to enter /cart. */
      if(!onCartPage())return false;
      document.documentElement.classList.add('flcart-checkout-open');
      return state.nativeOpen.apply(this,arguments);
    }
    patchedOpenCart.__flcartPatched=true;
    patchedOpenCart.__flcartOriginal=current;
    window.tcart__openCart=patchedOpenCart;
    return true;
  }
  function ensurePatch(){
    patchOpenCart();
    if(!state.patchTimer)state.patchTimer=setInterval(()=>{
      if(window.tcart__openCart&&window.tcart__openCart.__flcartPatched)return;
      patchOpenCart();
    },500);
  }
  function syncHeaderOffset(){
    requestAnimationFrame(()=>{
      let height=0;
      const candidates=Array.from(document.querySelectorAll('#t-header,.t-header,body > header,header.t-header,.t396__artboard'));
      candidates.forEach(el=>{
        if(el.closest('#flcart-page'))return;
        const rect=el.getBoundingClientRect(),style=getComputedStyle(el);
        const fixed=style.position==='fixed'||style.position==='sticky'||el.id==='t-header'||el.classList.contains('t-header');
        if(!fixed||style.display==='none'||style.visibility==='hidden'||rect.width<innerWidth*.55||rect.height<35||rect.height>150)return;
        if(rect.top<=6&&rect.bottom>0)height=Math.max(height,Math.ceil(rect.bottom));
      });
      if(!height)height=innerWidth<=760?56:64;
      height=Math.max(innerWidth<=760?52:58,Math.min(height,120));
      document.documentElement.style.setProperty('--flcart-header-height',`${height}px`);
    });
  }
  function ensureShell(){
    const existing=document.getElementById('flcart-page');if(existing)return existing;
    if(!document.body)return null;
    const records=document.querySelector('#allrecords')||document.querySelector('body > .t-records:not(#t-header)')||document.querySelector('main');
    if(!records)return null;
    document.documentElement.classList.add('flcart-page-mode');document.body.classList.add('flcart-page-mode');
    let robots=document.querySelector('meta[name="robots"]');if(!robots){robots=document.createElement('meta');robots.name='robots';document.head?.appendChild(robots)}if(robots)robots.content='noindex,nofollow';
    document.title='Shopping Cart | Filin Labs';
    const page=document.createElement('main');page.id='flcart-page';page.innerHTML=`
      <div class="flcart-shell">
        <div class="flcart-head"><div class="flcart-head-copy"><h1 class="flcart-title">Your Cart <span id="flcart-title-count" class="flcart-title-count">(0 items)</span></h1><div class="flcart-head-actions" style="display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:14px 0 9px"><a class="flcart-continue" style="margin:0" href="${escapeHtml(CONFIG.CATALOG_PATH)}">Catalogue</a><button id="flcart-delete-cart" class="flcart-continue flcart-delete-cart" style="margin:0;cursor:pointer;font-family:inherit" type="button">Delete Cart</button></div><p class="flcart-subtitle">Please, select Your audio equipment, configurations and additional options before checkout.</p></div></div>
        <section id="flcart-loading" class="flcart-loading is-visible" aria-live="polite"><span class="flcart-loading-spinner" aria-hidden="true"></span><span>Loading your cart…</span></section>
        <section id="flcart-empty" class="flcart-empty" aria-live="polite"><h2>Your cart is empty</h2><p>Add audio equipment to your cart and return here to complete the order.</p><a href="${escapeHtml(CONFIG.CATALOG_PATH)}">Explore the Catalogue</a></section>
        <section id="flcart-cart-layout" class="flcart-cart-layout" aria-label="Cart details">
          <div class="flcart-products-panel"><div class="flcart-table-head"><span>Product details</span><span>Price</span><span>Quantity</span><a class="flcart-warranty-head" href="${escapeHtml(CONFIG.WARRANTY_PATH)}" target="_blank" rel="noopener">Warranty</a><span>Total</span></div><div id="flcart-items"></div></div>
          <section id="flcart-recommendations" class="flcart-recommendations" aria-labelledby="flcart-rec-title"><div class="flcart-section-head"><div><h2 id="flcart-rec-title">You May Also Like</h2></div></div><div id="flcart-recommendation-grid" class="flcart-recommendation-grid"></div></section>
          <button id="flcart-summary-toggle" class="flcart-summary-toggle" type="button" aria-haspopup="dialog" aria-controls="flcart-summary-modal" aria-expanded="false"><span>Order Summary</span><strong id="flcart-summary-toggle-total">$0</strong></button>
          <div id="flcart-summary-modal" class="flcart-summary-modal"><div class="flcart-summary-backdrop" data-flcart-summary-close></div><aside class="flcart-summary" aria-label="Order summary"><button class="flcart-summary-close" type="button" data-flcart-summary-close aria-label="Close order summary">×</button><h2>Order Summary</h2>
            <div class="flcart-summary-row"><span>Subtotal</span><strong id="flcart-subtotal">$0</strong></div><div id="flcart-warranty-summary-row" class="flcart-summary-row flcart-warranty-summary"><a class="flcart-shipping-link" href="${escapeHtml(CONFIG.WARRANTY_PATH)}" target="_blank" rel="noopener">Extended warranty</a><strong id="flcart-warranty-total">$0</strong></div>
            <div class="flcart-summary-row"><a class="flcart-shipping-link" href="${escapeHtml(CONFIG.SHIPPING_PATH)}" target="_blank" rel="noopener">Shipping</a><strong id="flcart-shipping">Calculated at checkout</strong></div>
            <div class="flcart-summary-row"><span>Selected discount</span><strong id="flcart-discount">None</strong></div>
            <div class="flcart-discounts"><h3>Discounts & Offers</h3><div class="flcart-discount-tabs"><button class="flcart-discount-tab is-active" data-discount-tab="promo" type="button">Promo Code</button><button class="flcart-discount-tab" data-discount-tab="survey" type="button">Survey</button><button class="flcart-discount-tab" data-discount-tab="offers" type="button">Special Offers</button><button class="flcart-discount-tab flcart-loyalty-tab" data-discount-tab="loyalty" type="button">Loyalty</button></div>
              <div class="flcart-discount-pane is-active" data-discount-pane="promo"><div class="flcart-promo-line"><input id="flcart-promo-input" type="text" autocomplete="off" placeholder="Enter promo code"><button id="flcart-promo-apply" type="button">Apply</button></div><div id="flcart-promo-status" class="flcart-promo-status"></div></div>
              <div class="flcart-discount-pane" data-discount-pane="survey"><div id="flcart-survey-content"></div></div>
              <div class="flcart-discount-pane" data-discount-pane="offers"><div id="flcart-offer-list" class="flcart-offer-list"><div class="flcart-promo-status">Loading current offers…</div></div><div id="flcart-offer-status" class="flcart-offer-status" role="status" aria-live="polite"></div><a id="flcart-offers-link" class="flcart-offers-link" href="${escapeHtml(CONFIG.SPECIAL_OFFERS_PATH)}" target="_blank" rel="noopener">View full promotion terms</a></div>
              <div class="flcart-discount-pane" data-discount-pane="loyalty"><div id="flcart-loyalty-content"></div></div>
            </div>
            <div class="flcart-summary-divider"></div><div class="flcart-summary-total"><span id="flcart-total-label">Total</span><strong id="flcart-total">$0</strong></div><button id="flcart-checkout" class="flcart-checkout-btn" type="button">Proceed to Checkout</button><p class="flcart-summary-note">Shipping, VAT, promotions & payment amount are confirmed during checkout.</p>
            <div id="flcart-bnpl-inline" class="flcart-bnpl-inline" aria-label="Pay over time"><div class="flcart-bnpl-icon" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none"><rect x="5" y="9" width="38" height="30" rx="7" fill="#BC8C5E"/><rect x="9" y="15" width="30" height="5" rx="2.5" fill="#fff"/><circle cx="15" cy="30" r="4" fill="#fff"/><path d="M25 29h11M25 34h8" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg></div><div class="flcart-bnpl-copy"><p class="flcart-bnpl-title">Pay Over Time</p><p class="flcart-bnpl-text">Orders over $50 may qualify for Affirm, Klarna, Afterpay or PayPal Pay Later. Estimated four payments: <strong id="flcart-bnpl-quarter">$0</strong>.</p></div></div>
          </aside></div>
        </section>
        <section id="flcart-native-host" aria-label="Secure checkout form"></section>
      </div>
      <div id="flcart-survey-modal" class="flcart-survey-modal" aria-hidden="true">
        <div class="flcart-survey-backdrop" data-flcart-survey-close></div>
        <div class="flcart-survey-dialog" role="dialog" aria-modal="true" aria-label="Complete the Filin Labs customer survey">
          <button class="flcart-survey-close" type="button" data-flcart-survey-close aria-label="Close survey">×</button>
          <div id="flcart-survey-loading" class="flcart-survey-loading"><span class="flcart-loading-spinner" aria-hidden="true"></span><span>Loading the review form…</span></div>
          <iframe id="flcart-survey-frame" class="flcart-survey-frame" title="Filin Labs review survey" loading="eager"></iframe>
        </div>
      </div>`;
    records.insertBefore(page,records.firstChild||null);
    page.addEventListener('click',handlePageClick);page.addEventListener('change',handlePageChange);
    syncHeaderOffset();return page;
  }
  function unlockBody(){
    document.documentElement.style.removeProperty('overflow');document.documentElement.style.removeProperty('height');
    document.body.style.removeProperty('overflow');document.body.style.removeProperty('height');
    document.documentElement.classList.add('flcart-page-mode');document.body.classList.add('flcart-page-mode');
  }
  function readStructuredPrice(doc){
    const meta=doc.querySelector('meta[property="product:price:amount"],meta[itemprop="price"]');if(meta){const value=number(meta.content);if(value>0)return value}
    for(const script of doc.querySelectorAll('script[type="application/ld+json"]')){try{const data=JSON.parse(script.textContent),items=Array.isArray(data)?data:[data];for(const item of items){const values=item?.['@graph']||[item];for(const value of values){const offer=value?.offers,price=number(Array.isArray(offer)?offer[0]?.price:offer?.price);if(price>0)return price}}}catch(e){}}
    const text=(doc.body?.innerText||doc.body?.textContent||'').replace(/\s+/g,' ');
    const patterns=[/Total(?:\s+Price)?\*?\s*[:|]?\s*\$\s*([\d,]+(?:\.\d+)?)/i,/Price\s*[:|]?\s*\$\s*([\d,]+(?:\.\d+)?)/i,/\$\s*([\d,]+(?:\.\d+)?)\s*(?:Buy Now|$)/i];
    for(const regex of patterns){const match=text.match(regex);if(match){const value=number(match[1]);if(value>0)return value}}return 0;
  }
  async function fetchProductMeta(url){
    url=absoluteUrl(url);if(!url)return {url:'',title:'',description:'',image:'',price:0};
    if(state.productMetaCache.has(url))return state.productMetaCache.get(url);
    const promise=(async()=>{try{
      const response=await fetch(url,{credentials:'same-origin',cache:'force-cache'});if(!response.ok)throw new Error(`HTTP ${response.status}`);
      const doc=new DOMParser().parseFromString(await response.text(),'text/html'),content=selector=>doc.querySelector(selector)?.getAttribute('content')?.trim()||'';
      const title=cleanTitle(content('meta[property="og:title"]')||content('meta[name="twitter:title"]')||doc.querySelector('h1')?.textContent||doc.querySelector('h2')?.textContent||'');
      const description=cleanTitle(content('meta[name="description"]')||content('meta[property="og:description"]')||doc.querySelector('h1')?.nextElementSibling?.textContent||'');
      const image=absoluteUrl(content('meta[property="og:image"]')||content('meta[name="twitter:image"]')||doc.querySelector('[itemprop="image"]')?.getAttribute('content')||doc.querySelector('img')?.getAttribute('src')||'');
      return {url,title,description,image,price:readStructuredPrice(doc)};
    }catch(e){return {url,title:'',description:'',image:'',price:0}}})();state.productMetaCache.set(url,promise);return promise;
  }
  function findNativeRow(index){return document.querySelector(`#flcart-native-host .t706__product[data-cart-product-i="${index}"],.t706__product[data-cart-product-i="${index}"]`)}
  function applyImageToNativeRow(){
    /* Native ST100 already renders its own preview image. Injecting a second image
       breaks the official checkout popup, so v7 intentionally leaves it untouched. */
  }
  function optionListHtml(options,product){
    if(!options.length)return '<ul class="flcart-item-options"><li>No additional options selected</li></ul>';
    return `<ul class="flcart-item-options">${options.map(option=>`<li><strong>${escapeHtml(option.label)}:</strong> ${escapeHtml(option.value)}</li>`).join('')}</ul>`;
  }
  function bundleNoteHtml(product){
    if(state.discountChoice?.id!=='quadron-bundle-sale')return '';
    if(!productMatchesPath(product,CONFIG.QUADRON_CABLE_PATH))return '';
    return `<div class="flcart-bundle-note">+ ${escapeHtml(CONFIG.QUADRON_ADAPTER_TITLE)}</div>`;
  }
  function getNativeCartAddFunction(){
    if(typeof window.tcart__addProduct==='function')return window.tcart__addProduct;
    if(typeof window.tcart__addProductFunction==='function')return window.tcart__addProductFunction;
    return null;
  }
  function refreshNativeCart(){
    ['tcart__updateTotalProductsinCartObj','tcart__reDrawProducts','tcart__reDrawTotal','tcart__reDrawCartIcon','tcart__updateCartIcon','tcart__saveLocalObj','t_cart_saveCartDataToLS'].forEach(name=>{try{if(typeof window[name]==='function')window[name]()}catch(e){}});
  }
  async function addProductPathToCart(path){
    if(cartHasPath(path))return true;
    const meta=await fetchProductMeta(path);
    if(!meta?.price||!meta?.title)return false;
    const addFn=getNativeCartAddFunction();if(!addFn)return false;
    const product={
      name:meta.title,
      price:meta.price,
      quantity:1,
      amount:meta.price,
      sku:targetSlug(path),
      img:meta.image||'',
      url:absoluteUrl(path)
    };
    try{
      addFn.call(window,product);
      refreshNativeCart();
      await new Promise(resolve=>setTimeout(resolve,260));
      refreshNativeCart();
      return cartHasPath(path);
    }catch(error){
      console.warn('Filin cart: bundle product could not be added.',path,error);
      return false;
    }
  }
  async function ensureQuadronBundleItems(offer){
    const paths=Array.isArray(offer?.autoAddPaths)?offer.autoAddPaths:[];
    const added=[],unavailable=[];
    for(const path of paths){
      if(cartHasPath(path))continue;
      const ok=await addProductPathToCart(path);
      (ok?added:unavailable).push(path);
    }
    state.lastCartSignature='';
    updateCartPage(true);
    return {added,unavailable};
  }
  function renderItems(){
    const container=document.getElementById('flcart-items');if(!container)return;reconcileOptionSnapshots();const entries=getProducts();
    const placeholder='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22134%22 height=%22110%22%3E%3Crect width=%22100%25%22 height=%22100%25%22 fill=%22%23f1ebe5%22/%3E%3C/svg%3E';

    container.innerHTML=entries.map(({product,index})=>{
      const name=productName(product),url=absoluteUrl(productUrl(product)),options=optionEntries(product),editUrl=optionEditUrl(product),qty=productQuantity(product),target='target="_blank" rel="noopener"';
      const baseUnit=productBaseUnitPrice(product);
      const optionsUnit=productOptionsUnitAmount(product);
      const warrantyUnit=warrantyUnitAmount(product);
      const itemTotal=productPrice(product)*qty+warrantyAmount(product);

      return `<article class="flcart-item" data-product-index="${index}" data-product-key="${escapeHtml(productKey(product))}"><div class="flcart-item-details"><div class="flcart-item-media-col"><a class="flcart-item-image" ${url?`href="${escapeHtml(url)}" ${target}`:''}><img data-flcart-image="${index}" alt="${escapeHtml(name)}"></a>${editUrl?`<a class="flcart-add-options" href="${escapeHtml(editUrl)}" target="_blank" rel="noopener">Add Options</a>`:''}</div><div class="flcart-item-copy">${url?`<a class="flcart-item-name" href="${escapeHtml(url)}" ${target} data-flcart-title="${index}">${escapeHtml(name)}</a>`:`<div class="flcart-item-name" data-flcart-title="${index}">${escapeHtml(name)}</div>`}${optionListHtml(options,product)}${bundleNoteHtml(product)}</div></div><div class="flcart-item-price">${money(productPrice(product))}</div><div class="flcart-qty" aria-label="Quantity"><button type="button" data-cart-action="minus" data-index="${index}" aria-label="Decrease quantity">−</button><strong>${qty}</strong><button type="button" data-cart-action="plus" data-index="${index}" aria-label="Increase quantity">+</button></div><div class="flcart-warranty-cell"><select class="flcart-warranty-select" data-cart-warranty data-index="${index}" aria-label="Warranty for ${escapeHtml(name)}">${warrantyOptionsHtml(product)}</select></div><div class="flcart-item-total">${money(itemTotal)}</div><div class="flcart-mobile-controls"><div class="flcart-mobile-qty flcart-qty" aria-label="Quantity"><button type="button" data-cart-action="minus" data-index="${index}" aria-label="Decrease quantity">−</button><strong>${qty}</strong><button type="button" data-cart-action="plus" data-index="${index}" aria-label="Increase quantity">+</button></div><div class="flcart-mobile-price" data-flcart-mobile-base="${index}">${money(baseUnit)}</div>${editUrl?`<a class="flcart-mobile-add-options" href="${escapeHtml(editUrl)}" target="_blank" rel="noopener">Add Options</a>`:`<span class="flcart-mobile-add-options-placeholder"></span>`}<div class="flcart-mobile-options-price" data-flcart-mobile-options="${index}">${money(optionsUnit)}</div><div class="flcart-mobile-warranty"><select class="flcart-warranty-select" data-cart-warranty data-index="${index}" aria-label="Warranty for ${escapeHtml(name)}">${warrantyOptionsHtml(product)}</select></div><div class="flcart-mobile-warranty-price">${money(warrantyUnit)}</div><div class="flcart-mobile-total">${money(itemTotal)}</div></div></article>`;
    }).join('');

    /* V18.1: assign image src only after the DOM has been created.
       This prevents Tilda/browser scanners from treating JS template text
       as a literal URL such as /${escapeHtml(...)}. */
    entries.forEach(({product,index})=>{
      const img=container.querySelector(`[data-flcart-image="${index}"]`);
      if(img)img.src=productImage(product)||placeholder;
    });

entries.forEach(async({product,index})=>{

  const meta =
    await fetchProductMeta(
      productUrl(product)
    );

  const nativeName =
    cleanTitle(
      product?.name ||
      product?.title ||
      product?.product ||
      ''
    );

  const titleNode =
    document.querySelector(
      `[data-flcart-title="${index}"]`
    );

  /*
    Native Tilda / Master Product name is authoritative.
    SEO page title is only a fallback.
  */
  if(nativeName){

    product.__flcartCanonicalName =
      nativeName;

    if(titleNode){
      titleNode.textContent =
        nativeName;
    }

  }else if(meta.title){

    product.__flcartCanonicalName =
      meta.title;

    if(titleNode){
      titleNode.textContent =
        meta.title;
    }
  }
  if(meta.price>0&&meta.price<=productPrice(product))product.__flcartBasePrice=meta.price;
      const baseNode=document.querySelector(`[data-flcart-mobile-base="${index}"]`);if(baseNode)baseNode.textContent=money(productBaseUnitPrice(product));
      const optionsNode=document.querySelector(`[data-flcart-mobile-options="${index}"]`);if(optionsNode)optionsNode.textContent=money(productOptionsUnitAmount(product));
      if(meta.image&&!productImage(product)){product.__flcartImage=meta.image;const img=document.querySelector(`[data-flcart-image="${index}"]`);if(img)img.src=meta.image}
      applyImageToNativeRow(index,meta.image||productImage(product));
    });
  }
  function recalculateNativeCart(){
    if(!window.tcart||!Array.isArray(window.tcart.products))return;
    let sum=0;window.tcart.products.forEach(product=>{if(!product||product.deleted==='yes'||number(product.quantity||0)<=0)return;product.quantity=productQuantity(product);const lineAmount=(productPrice(product)+warrantyUnitAmount(product))*product.quantity;product.amount=typeof window.tcart__roundPrice==='function'?window.tcart__roundPrice(lineAmount):Math.round(lineAmount*100)/100;sum+=product.amount});
    window.tcart.prodamount=sum;
    try{if(typeof window.tcart__updateTotalProductsinCartObj==='function')window.tcart__updateTotalProductsinCartObj();else{window.tcart.amount=sum+shippingAmount()+taxAmount();window.tcart.total=window.tcart.amount}}catch(e){window.tcart.amount=sum+shippingAmount()+taxAmount();window.tcart.total=window.tcart.amount}
    ['tcart__reDrawProducts','tcart__reDrawTotal','tcart__reDrawCartIcon','tcart__updateCartIcon','tcart__updateProducts','tcart__saveLocalObj','t_cart_saveCartDataToLS'].forEach(name=>{try{if(typeof window[name]==='function')window[name]()}catch(e){}});
    try{document.dispatchEvent(new CustomEvent('tilda:cart:updated',{detail:{source:'flcart-v7'}}))}catch(e){}
  }
  function changeQuantity(index,delta){
    const product=window.tcart?.products?.[index];
    if(!product)return;

    const before=productQuantity(product);

    /* The cross icon is intentionally removed.
       Minus at quantity 1 now removes the product on desktop and mobile. */
    if(delta<0&&before<=1){
      removeProduct(index);
      return;
    }

    const next=Math.max(1,before+delta);
    if(next===before)return;

    product.quantity=next;
    product.amount=productPrice(product)*next;
    recalculateNativeCart();
    state.lastCartSignature='';
    track(delta>0?'add_to_cart':'remove_from_cart',{
      currency:CONFIG.CURRENCY,
      value:productPrice(product),
      items:[gaItem(product,1)]
    });
    setTimeout(()=>updateCartPage(true),30);
  }
  function removeProduct(index){
    const product=window.tcart?.products?.[index];if(!product)return;track('remove_from_cart',{currency:CONFIG.CURRENCY,value:productPrice(product)*productQuantity(product),items:[gaItem(product)]});window.tcart.products.splice(index,1);recalculateNativeCart();state.lastCartSignature='';setTimeout(()=>updateCartPage(true),30);
  }
  function clearCart(){
    if(!window.tcart||!Array.isArray(window.tcart.products))return;
    const products=rawProducts();
    if(products.length){
      try{track('remove_from_cart',{currency:CONFIG.CURRENCY,value:subtotal(),items:products.map(product=>gaItem(product))})}catch(e){}
    }
    window.tcart.products.splice(0,window.tcart.products.length);
    window.tcart.prodamount=0;window.tcart.amount=0;window.tcart.total=0;
    try{localStorage.removeItem(CONFIG.WARRANTY_STORE_KEY)}catch(e){}
    try{localStorage.removeItem(CONFIG.OPTION_STORE_KEY)}catch(e){}
    try{localStorage.removeItem(CONFIG.OPTION_SNAPSHOT_KEY)}catch(e){}
    try{localStorage.removeItem('flwarranty_pending_purchase_v1')}catch(e){}
    state.warrantyStore={};state.optionStore={};state.lastCartSignature='';state.lastViewCartSignature='';
    window.__FILIN_CART_EDIT_MODE__=false;
    try{recalculateNativeCart()}catch(e){}
    try{refreshNativeCart()}catch(e){}
    try{closeSummaryModal()}catch(e){}
    try{document.dispatchEvent(new CustomEvent('tilda:cart:updated',{detail:{source:'flcart-clear-cart'}}))}catch(e){}
    setTimeout(()=>updateCartPage(true),30);
    setTimeout(()=>updateCartPage(true),180);
  }
  function openSummaryModal(){
    const modal=document.getElementById('flcart-summary-modal');if(!modal)return;
    modal.classList.add('is-open');document.getElementById('flcart-summary-toggle')?.setAttribute('aria-expanded','true');document.documentElement.classList.add('flcart-summary-open');document.body.classList.add('flcart-summary-open');
    const close=modal.querySelector('.flcart-summary-close');setTimeout(()=>close?.focus(),20);
  }
  function closeSummaryModal(){
    const modal=document.getElementById('flcart-summary-modal');if(!modal)return;
    modal.classList.remove('is-open');document.getElementById('flcart-summary-toggle')?.setAttribute('aria-expanded','false');document.documentElement.classList.remove('flcart-summary-open');document.body.classList.remove('flcart-summary-open');
  }
  /* ============================================================
     RESONANCE CLUB / LOYALTY
     UI + cart calculation layer.
     Production wallet data should be supplied by a trusted backend through
     window.__FILIN_LOYALTY_WALLET__ or written to the per-member wallet key.
     The browser does NOT permanently burn points on Apply; the requested
     redemption is carried to checkout as order data and should be finalized
     by the server only after successful payment/order confirmation.
     ============================================================ */
  function cachedMemberProfile(){
    try{return JSON.parse(localStorage.getItem('filin_member_profile_last_v2')||'')||{}}catch(e){return {}}
  }
  function loyaltyMemberEmail(){
    const profile=cachedMemberProfile();
    return String(profile?.email||'').trim().toLowerCase();
  }
  function loyaltyWalletKey(){
    const email=loyaltyMemberEmail();
    return `${CONFIG.LOYALTY_WALLET_PREFIX}${encodeURIComponent(email||'guest')}`;
  }
  function normalizeLoyaltyWallet(value){
    const raw=value&&typeof value==='object'?value:{};
    return {
      points:Math.max(0,Math.floor(number(raw.points||raw.availablePoints||0))),
      tier:String(raw.tier||'MEMBER').toUpperCase(),
      updatedAt:String(raw.updatedAt||''),
      source:String(raw.source||'')
    };
  }
  function readLoyaltyWallet(){
    const injected=window.__FILIN_LOYALTY_WALLET__;
    if(injected&&typeof injected==='object'){
      state.loyaltyWallet=normalizeLoyaltyWallet(injected);
      return state.loyaltyWallet;
    }
    if(CONFIG.LOYALTY_TEST_MODE){
      try{
        const raw=localStorage.getItem(loyaltyWalletKey());
        state.loyaltyWallet=normalizeLoyaltyWallet(raw?JSON.parse(raw):{});
      }catch(e){state.loyaltyWallet=normalizeLoyaltyWallet({})}
      return state.loyaltyWallet;
    }
    state.loyaltyWallet=normalizeLoyaltyWallet({});
    return state.loyaltyWallet;
  }
  function loyaltyAvailablePoints(){return readLoyaltyWallet().points}
  function loyaltyCreditFromPoints(points){return Math.max(0,Math.floor(number(points)))/CONFIG.LOYALTY_POINTS_PER_DOLLAR_CREDIT}
  function loyaltyStepPoints(){return Math.max(1,Math.floor(CONFIG.LOYALTY_REDEEM_STEP_POINTS||250))}
  function loyaltyMaxRedeemPoints(){
    const available=loyaltyAvailablePoints();
    const step=loyaltyStepPoints();
    const orderCreditLimit=Math.max(0,subtotal()*CONFIG.LOYALTY_MAX_REDEEM_PERCENT/100);
    const orderPointLimit=Math.floor((orderCreditLimit*CONFIG.LOYALTY_POINTS_PER_DOLLAR_CREDIT)/step)*step;
    return Math.max(0,Math.min(available,orderPointLimit));
  }
  function normalizeRedeemPoints(value){
    const step=loyaltyStepPoints();
    const max=loyaltyMaxRedeemPoints();
    let points=Math.floor(number(value)/step)*step;
    if(points<CONFIG.LOYALTY_MIN_REDEEM_POINTS)return 0;
    if(points>max)points=max;
    return Math.max(0,points);
  }
  function loyaltyAppliedPoints(){
    return state.discountChoice?.type==='loyalty'?Math.max(0,Math.floor(number(state.discountChoice.points))):0;
  }
  function loyaltyChoice(points){
    points=normalizeRedeemPoints(points);
    return {
      type:'loyalty',
      id:`resonance-${points}`,
      title:`Resonance Club · ${points.toLocaleString('en-US')} Points`,
      points,
      amount:loyaltyCreditFromPoints(points),
      percent:0,
      promoCode:'',
      discountScope:'all'
    };
  }
  function renderLoyalty(){
    const box=document.getElementById('flcart-loyalty-content');if(!box)return;
    const email=loyaltyMemberEmail();
    const wallet=readLoyaltyWallet();
    const available=wallet.points;
    const maxPoints=loyaltyMaxRedeemPoints();
    const applied=loyaltyAppliedPoints();
    const step=loyaltyStepPoints();
    const minimum=CONFIG.LOYALTY_MIN_REDEEM_POINTS;
    if(!email){
      box.innerHTML=`<div class="flcart-loyalty-card"><div class="flcart-loyalty-title">Sign in to use Resonance Points</div><p class="flcart-loyalty-help">Your loyalty balance is linked to your Filin Labs member account.</p><a class="flcart-loyalty-link" href="/account">Open My Account</a></div>`;
      return;
    }
    if(available<minimum){
      box.innerHTML=`<div class="flcart-loyalty-card"><div class="flcart-loyalty-balance"><span>Available</span><strong>${available.toLocaleString('en-US')} Points</strong></div><p class="flcart-loyalty-help">You need at least ${minimum.toLocaleString('en-US')} Points to redeem Reward Credit. 250 Points = $5.</p><a class="flcart-loyalty-link" href="${escapeHtml(CONFIG.LOYALTY_PAGE)}" target="_blank" rel="noopener">Resonance Club Benefits</a></div>`;
      return;
    }
    if(maxPoints<minimum){
      box.innerHTML=`<div class="flcart-loyalty-card"><div class="flcart-loyalty-balance"><span>Available</span><strong>${available.toLocaleString('en-US')} Points</strong></div><p class="flcart-loyalty-help">Reward Credit can cover up to ${CONFIG.LOYALTY_MAX_REDEEM_PERCENT}% of the eligible merchandise subtotal. This cart is currently below the minimum redemption amount.</p></div>`;
      return;
    }
    const defaultPoints=applied||Math.min(maxPoints,Math.max(minimum,step));
    const maxCredit=loyaltyCreditFromPoints(maxPoints);
    const appliedHtml=applied?`<div class="flcart-loyalty-applied"><strong>${applied.toLocaleString('en-US')} Points applied</strong><span>${money(loyaltyCreditFromPoints(applied))} Reward Credit</span><button id="flcart-loyalty-remove" type="button">Remove</button></div>`:'';
    box.innerHTML=`
      <div class="flcart-loyalty-card">
        <div class="flcart-loyalty-top">
          <div class="flcart-loyalty-balance"><span>Available</span><strong>${available.toLocaleString('en-US')} Points</strong></div>
          <div class="flcart-loyalty-tier"><span>Tier</span><strong>${escapeHtml(wallet.tier)}</strong></div>
        </div>
        <div class="flcart-loyalty-value">Reward Credit available: <strong>${money(loyaltyCreditFromPoints(available))}</strong></div>
        <div class="flcart-loyalty-limit">This order can use up to <strong>${maxPoints.toLocaleString('en-US')} Points (${money(maxCredit)})</strong>, limited to ${CONFIG.LOYALTY_MAX_REDEEM_PERCENT}% of the eligible merchandise subtotal.</div>
        <div class="flcart-loyalty-controls">
          <label for="flcart-loyalty-points">Points to redeem</label>
          <div class="flcart-loyalty-input-line">
            <input id="flcart-loyalty-points" type="number" min="${minimum}" max="${maxPoints}" step="${step}" value="${defaultPoints}" inputmode="numeric">
            <button id="flcart-loyalty-max" type="button">Use Max</button>
            <button id="flcart-loyalty-apply" type="button">Apply</button>
          </div>
        </div>
        ${appliedHtml}
        <p id="flcart-loyalty-status" class="flcart-loyalty-status${state.loyaltyStatus?' is-visible':''}">${escapeHtml(state.loyaltyStatus||'Reward Credit cannot be combined with another cart discount. Applying Points replaces the currently selected discount.')}</p>
      </div>`;
  }
  function applyLoyaltyReward(){
    const input=document.getElementById('flcart-loyalty-points');
    const points=normalizeRedeemPoints(input?.value||0);
    if(!loyaltyMemberEmail()){state.loyaltyStatus='Sign in to your Filin Labs account first.';renderLoyalty();return}
    if(points<CONFIG.LOYALTY_MIN_REDEEM_POINTS){state.loyaltyStatus=`Enter at least ${CONFIG.LOYALTY_MIN_REDEEM_POINTS} Points.`;renderLoyalty();return}
    if(points>loyaltyAvailablePoints()){state.loyaltyStatus='Your available Resonance Points are lower than the requested amount.';renderLoyalty();return}
    const choice=loyaltyChoice(points);
    if(!choice.amount){state.loyaltyStatus='No Reward Credit can be applied to this cart.';renderLoyalty();return}
    if(state.discountChoice&&state.discountChoice.type!=='loyalty')clearNativePromoValue();
    state.loyaltyRequestedPoints=points;
    state.discountChoice=choice;
    state.discountTab='loyalty';
    state.loyaltyStatus=`${points.toLocaleString('en-US')} Points reserved for this checkout. Final deduction occurs after order confirmation.`;
    renderDiscountTabs();renderLoyalty();renderSummary();updateOrderFields();state.lastCartSignature='';
    track('loyalty_reward_apply',{points,discount_value:choice.amount,tier:readLoyaltyWallet().tier});
  }
  function removeLoyaltyReward(){
    const points=loyaltyAppliedPoints();
    if(state.discountChoice?.type==='loyalty')state.discountChoice=null;
    state.loyaltyRequestedPoints=0;
    state.loyaltyStatus=points?`${points.toLocaleString('en-US')} Points released from this cart.`:'No Loyalty Reward is currently applied.';
    renderLoyalty();renderSummary();updateOrderFields();state.lastCartSignature='';
    track('loyalty_reward_remove',{points});
  }
  function useMaxLoyaltyReward(){
    const input=document.getElementById('flcart-loyalty-points');if(!input)return;
    input.value=String(loyaltyMaxRedeemPoints());
  }
  if(CONFIG.LOYALTY_TEST_MODE){
    window.__FILIN_LOYALTY_TEST_SET_POINTS__=function(points,tier='MEMBER'){
      const wallet=normalizeLoyaltyWallet({points,tier,updatedAt:new Date().toISOString(),source:'local-test'});
      try{localStorage.setItem(loyaltyWalletKey(),JSON.stringify(wallet))}catch(e){}
      state.loyaltyWallet=wallet;renderLoyalty();renderSummary();return wallet;
    };
  }

  function handlePageClick(event){
    if(event.target.closest('#flcart-delete-cart')){event.preventDefault();event.stopPropagation();clearCart();return}
    if(event.target.closest('#flcart-summary-toggle')){event.preventDefault();openSummaryModal();return}
    if(event.target.closest('[data-flcart-summary-close]')){event.preventDefault();closeSummaryModal();return}
    const addOptions=event.target.closest('.flcart-add-options,.flcart-mobile-add-options');
    if(addOptions){event.preventDefault();event.stopPropagation();const href=addOptions.href;if(href)window.open(href,'_blank','noopener');return}
    const action=event.target.closest('[data-cart-action]');
    if(action){event.preventDefault();event.stopPropagation();const index=Number(action.dataset.index),type=action.dataset.cartAction;if(type==='plus')changeQuantity(index,1);else if(type==='minus')changeQuantity(index,-1);else if(type==='remove')removeProduct(index);return}
    if(event.target.closest('[data-flcart-survey-close]')){event.preventDefault();closeSurveyModal();return}
    if(event.target.closest('#flcart-open-survey')){event.preventDefault();openSurveyModal();return}
    const tab=event.target.closest('[data-discount-tab]');if(tab){event.preventDefault();state.discountTab=tab.dataset.discountTab;renderDiscountTabs();if(state.discountTab==='survey'&&!surveyIsCompleted())openSurveyModal();if(state.discountTab==='loyalty')renderLoyalty();return}
    if(event.target.closest('#flcart-promo-apply')){event.preventDefault();applyPromoCode();return}
    if(event.target.closest('#flcart-loyalty-max')){event.preventDefault();useMaxLoyaltyReward();return}
    if(event.target.closest('#flcart-loyalty-apply')){event.preventDefault();applyLoyaltyReward();return}
    if(event.target.closest('#flcart-loyalty-remove')){event.preventDefault();removeLoyaltyReward();return}
    if(event.target.closest('#flcart-checkout')){event.preventDefault();event.stopPropagation();console.info('[Filin Labs] Main cart checkout click');if(typeof window.__FILIN_OPEN_CHECKOUT_ACCORDION__==='function'){window.__FILIN_OPEN_CHECKOUT_ACCORDION__();return}openCheckoutInline();return}
    const recommendation=event.target.closest('.flcart-rec-card a');if(recommendation)track('select_item',{item_list_name:'You May Also Like',items:[{item_name:recommendation.closest('.flcart-rec-card')?.querySelector('.flcart-rec-title')?.textContent||'Recommendation'}]});
  }
  async function handlePageChange(event){
    const warrantySelect=event.target.closest('[data-cart-warranty]');
    if(warrantySelect){
      event.preventDefault();
      setWarranty(Number(warrantySelect.dataset.index),Number(warrantySelect.value));
      return;
    }
    const radio=event.target.closest('input[name="flcart-discount-choice"]');if(!radio)return;
    const offer=state.specialOffers.find(item=>item.id===radio.value);if(!offer)return;
    if(state.offerBusy){event.preventDefault();return}
    state.offerBusy=true;state.offerStatus='';renderSpecialOffers();
    try{
      if(offer.id==='quadron-bundle-sale'){
        const required=Array.isArray(offer.requiredPaths)?offer.requiredPaths:[];
        if(required.some(path=>!cartHasPath(path))){
          state.offerStatus='Add Filin Audio Quadron to the cart to use this bundle offer.';
          radio.checked=false;return;
        }
        const result=await ensureQuadronBundleItems(offer);
        const cableAdded=result.added.some(path=>normPath(path)===normPath(CONFIG.QUADRON_CABLE_PATH));
        const adapterAdded=result.added.some(path=>normPath(path)===normPath(CONFIG.QUADRON_ADAPTER_PATH));
        if(cableAdded&&adapterAdded)state.offerStatus='Purity cable and Speakers-XLR Adapter Filin Eternal were added to the cart.';
        else if(cableAdded)state.offerStatus='Purity cable was added. The Speakers-XLR Adapter Filin Eternal will be added automatically after its product page is published.';
        else if(cartHasPath(CONFIG.QUADRON_CABLE_PATH))state.offerStatus='Quadron bundle offer is ready.';
      }
      const candidate=Object.assign({type:'special'},offer);
      const eligibility=choiceEligibility(candidate);
      if(!eligibility.eligible){
        state.offerStatus=eligibility.message||'This offer is not eligible for the current cart.';
        radio.checked=false;return;
      }
      state.discountChoice={
        type:'special',id:offer.id,title:offer.title,percent:offer.percent||0,amount:offer.amount||0,
        link:offer.link,promoCode:offer.promoCode||'',discountScope:offer.discountScope||'all',
        eligiblePaths:offer.eligiblePaths||[],requiredPaths:offer.requiredPaths||[]
      };
      if(offer.promoCode)applyNativePromoValue(offer.promoCode);
      state.offerStatus=`Promo code ${offer.promoCode} selected. Discounts are not combined.`;
      track('select_promotion',{promotion_id:offer.id,promotion_name:offer.title,promotion_code:offer.promoCode||''});
      state.lastCartSignature='';updateOrderFields();renderSummary();updateCartPage(true);
    }finally{
      state.offerBusy=false;renderSpecialOffers();
    }
  }
  function renderDiscountTabs(){document.querySelectorAll('[data-discount-tab]').forEach(el=>el.classList.toggle('is-active',el.dataset.discountTab===state.discountTab));document.querySelectorAll('[data-discount-pane]').forEach(el=>el.classList.toggle('is-active',el.dataset.discountPane===state.discountTab))}
  function readSurveyReward(){
    try{
      const raw=localStorage.getItem(CONFIG.SURVEY_REWARD_KEY);
      if(!raw)return null;
      const parsed=JSON.parse(raw);
      return parsed&&parsed.completed===true?parsed:null;
    }catch(e){return null}
  }
  function surveyIsCompleted(){return !!readSurveyReward()}
  function rememberSurveyReward(){
    const record={completed:true,percent:CONFIG.SURVEY_DISCOUNT_PERCENT,completedAt:new Date().toISOString(),rewardId:`survey-${Date.now()}-${Math.random().toString(36).slice(2,9)}`};
    try{localStorage.setItem(CONFIG.SURVEY_REWARD_KEY,JSON.stringify(record));sessionStorage.setItem(CONFIG.SURVEY_REWARD_KEY,JSON.stringify(record))}catch(e){}
    return record;
  }
  function surveyChoice(){return {type:'survey',id:'survey-review',title:`Survey review discount ${CONFIG.SURVEY_DISCOUNT_PERCENT}%`,percent:CONFIG.SURVEY_DISCOUNT_PERCENT,promoCode:CONFIG.SURVEY_PROMO_CODE}}
  function renderSurvey(){
    const box=document.getElementById('flcart-survey-content');if(!box)return;
    state.surveyCompleted=surveyIsCompleted();
    if(state.surveyCompleted){
      if(!state.discountChoice)state.discountChoice=surveyChoice();
      box.innerHTML='<div class="flcart-survey-success">Congratulations! survey completed. you granted 10% discount!</div>';
    }else{
      box.innerHTML='<button id="flcart-open-survey" class="flcart-survey-action" type="button">Complete Survey</button><p class="flcart-survey-help">Submit the Filin Labs product-review form to receive a one-time 10% cart reward in this browser.</p>';
    }
  }
  function surveyFrameDocument(){
    try{return state.surveyFrame?.contentDocument||state.surveyFrame?.contentWindow?.document||null}catch(e){return null}
  }
  function prepareSurveyFrame(){
    const frame=state.surveyFrame||document.getElementById('flcart-survey-frame');if(!frame)return false;state.surveyFrame=frame;
    const doc=surveyFrameDocument();if(!doc||!doc.body)return false;
    if(!doc.getElementById('flcart-survey-frame-style')){
      const style=doc.createElement('style');style.id='flcart-survey-frame-style';style.textContent=`
        html,body{margin:0!important;min-height:100%!important;background:#fff!important;overflow:hidden!important}
        #t-header,#t-footer,.t-tildalаbеl,.t706__carticon,.flrh-shell,.flrh-share-modal{display:none!important}
        #allrecords>.t-rec:not(:has(#fl-review-hub)){display:none!important}
        #fl-review-hub{padding:0!important;margin:0!important;width:100%!important;min-height:100dvh!important}
        #fl-review-hub .flrh-modal{display:flex!important;position:fixed!important;inset:0!important;padding:12px!important;background:#fff!important}
        #fl-review-hub .flrh-backdrop{display:none!important}
        #fl-review-hub .flrh-dialog{width:min(1040px,100%)!important;max-width:1040px!important;max-height:calc(100dvh - 24px)!important;box-shadow:none!important}
      `;doc.head?.appendChild(style);
    }
    const open=doc.getElementById('flrhOpenForm');const modal=doc.getElementById('flrhModal');
    if(open)open.click();else if(modal){modal.classList.add('is-open');modal.setAttribute('aria-hidden','false')}
    document.getElementById('flcart-survey-loading')?.classList.add('is-hidden');
    return !!doc.getElementById('flrhReviewForm');
  }
  function closeSurveyModal(){
    const modal=document.getElementById('flcart-survey-modal');if(!modal)return;modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('flcart-survey-open');
    if(state.surveyWatchTimer){clearInterval(state.surveyWatchTimer);state.surveyWatchTimer=null}
  }
  function applyNativePromoValue(code){
    code=String(code||'').trim();if(!code)return false;
    const native=nativePromoElements();if(!native.input)return false;
    native.input.value=code;native.input.dispatchEvent(new Event('input',{bubbles:true}));native.input.dispatchEvent(new Event('change',{bubbles:true}));
    if(native.button)native.button.click();else native.input.dispatchEvent(new KeyboardEvent('keydown',{key:'Enter',code:'Enter',bubbles:true}));
    return true;
  }
  function clearNativePromoValue(){
    const native=nativePromoElements();if(!native.input)return false;
    native.input.value='';native.input.dispatchEvent(new Event('input',{bubbles:true}));native.input.dispatchEvent(new Event('change',{bubbles:true}));
    if(native.button)native.button.click();
    return true;
  }
  function applySurveyReward(){
    if(!surveyIsCompleted())rememberSurveyReward();
    state.surveyCompleted=true;state.discountChoice=surveyChoice();state.discountTab='survey';
    state.surveyPromoApplied=applyNativePromoValue(CONFIG.SURVEY_PROMO_CODE)||state.surveyPromoApplied;
    renderSurvey();renderDiscountTabs();renderSummary();updateOrderFields();state.lastCartSignature='';
    track('survey_discount_granted',{discount_percent:CONFIG.SURVEY_DISCOUNT_PERCENT,promo_code:CONFIG.SURVEY_PROMO_CODE});
  }
  function watchSurveySuccess(){
    if(state.surveyWatchTimer)clearInterval(state.surveyWatchTimer);
    const started=Date.now();
    state.surveyWatchTimer=setInterval(()=>{
      const doc=surveyFrameDocument();
      if(doc){
        const success=doc.getElementById('flrhSuccess');
        const dialog=doc.querySelector('.flrh-dialog');
        if((success&&!success.hidden)||(dialog&&dialog.classList.contains('is-success'))){
          clearInterval(state.surveyWatchTimer);state.surveyWatchTimer=null;applySurveyReward();setTimeout(closeSurveyModal,900);return;
        }
      }
      if(Date.now()-started>CONFIG.SURVEY_IFRAME_TIMEOUT){clearInterval(state.surveyWatchTimer);state.surveyWatchTimer=null}
    },350);
  }
  function openSurveyModal(){
    if(surveyIsCompleted()){state.discountChoice=surveyChoice();state.discountTab='survey';renderSurvey();renderSummary();state.surveyPromoApplied=applyNativePromoValue(CONFIG.SURVEY_PROMO_CODE)||state.surveyPromoApplied;return}
    const modal=document.getElementById('flcart-survey-modal'),frame=document.getElementById('flcart-survey-frame'),loading=document.getElementById('flcart-survey-loading');if(!modal||!frame)return;
    modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.classList.add('flcart-survey-open');loading?.classList.remove('is-hidden');state.surveyFrame=frame;
    const target=new URL(CONFIG.SURVEY_PAGE,location.origin);target.searchParams.set('flcart_survey','1');
    if(!frame.src||frame.src==='about:blank'){frame.addEventListener('load',()=>{let tries=0;const timer=setInterval(()=>{tries++;if(prepareSurveyFrame()||tries>35)clearInterval(timer)},200)},{once:true});frame.src=target.href}else{let tries=0;const timer=setInterval(()=>{tries++;if(prepareSurveyFrame()||tries>20)clearInterval(timer)},150)}
    watchSurveySuccess();track('survey_form_open',{source:'cart'});
  }
  function nativePromoElements(){
    const input=document.querySelector('#flcart-native-host input[name*="promo" i],#flcart-native-host input[class*="promo" i],.t706 input[name*="promo" i],.t706 input[class*="promo" i]');
    const root=input?.closest('[class*="promo"],form,.t706__cartwin')||document;
    const button=Array.from(root.querySelectorAll('button,a,[role="button"]')).find(el=>/apply|promo|coupon/i.test(`${el.className} ${el.textContent}`));
    return {input,button};
  }
  function applyPromoCode(){
    const visible=document.getElementById('flcart-promo-input');
    const status=document.getElementById('flcart-promo-status');
    const code=String(visible?.value||'').trim();
    if(!code){if(status){status.textContent='Enter a promo code.';status.className='flcart-promo-status is-error'}return}
    const native=nativePromoElements();
    if(!native.input){
      if(status){status.textContent='Enable the Promo Code field in ST100 so Tilda can validate codes.';status.className='flcart-promo-status is-error'}
      return;
    }
    applyNativePromoValue(code);
    state.discountChoice={type:'promo',id:code,title:`Promo code: ${code}`,percent:0,amount:0};
    if(status){status.textContent='The code was sent to Tilda for validation.';status.className='flcart-promo-status is-success'}
    updateOrderFields();setTimeout(updateCartPage,500);
  }
  function extractPercent(text){const source=String(text||'');if(/extended warranty|warranty extension|additional warranty|extra year/i.test(source))return 0;const match=source.match(/(?:save|discount|sale|offer)\s*(?:up to\s*)?(\d{1,2})\s*%|(\d{1,2})\s*%\s*(?:off|discount)/i);return match?Math.min(99,number(match[1]||match[2])):0}
  function promotionLink(node){
    const anchor=Array.from(node.querySelectorAll?.('a[href]')||[]).find(a=>{const href=a.getAttribute('href')||'';return href&&!/^#(?:opencart|popup)/i.test(href)&&!/privacy|legal|contact|telegram|mailto:/i.test(href)});
    if(anchor)return absoluteUrl(anchor.getAttribute('href'));const id=node.id||node.closest?.('[id]')?.id;return absoluteUrl(CONFIG.SPECIAL_OFFERS_PATH+(id?`#${id}`:''));
  }
  function offerCandidatesFromDocument(doc){
    const roots=Array.from(doc.querySelectorAll('.t-rec,article,.t-feed__post,.t-store__card,.t-card')).filter((node,index,array)=>{
      if(node.closest('.t706,#t-header,#t-footer,header,footer,nav'))return false;
      return !array.some(other=>other!==node&&other.contains(node)&&other.matches('.t-rec'));
    });
    const offers=[];
    roots.forEach((node,index)=>{
      const parts=Array.from(node.querySelectorAll('h1,h2,h3,h4,h5,h6,.tn-atom,[class*="title"],[class*="heading"],img[alt]')).map(el=>cleanTitle(el.tagName==='IMG'?el.getAttribute('alt'):el.textContent)).filter(Boolean);
      const full=cleanTitle(`${parts.join(' ')} ${node.textContent||''}`);
      if(!full||full.length<8||!/offer|discount|sale|save|pre-?order|warranty|upgrade|launch|special|%/i.test(full))return;
      if(/exclusive offers on hi-fi|all the exclusive opportunities|does not constitute a public offer|cookie|checkout|shipping & payment|contact & support|legal information/i.test(full))return;
      let heading=parts.find(value=>value.length>=5&&value.length<=170&&!/filin labs community|back to the|exclusive offers on/i.test(value))||full.slice(0,150);
      heading=cleanTitle(heading);if(!heading)return;
      const detailParts=Array.from(node.querySelectorAll('p,.tn-atom,[class*="descr"],[class*="text"]')).map(el=>cleanTitle(el.textContent)).filter(value=>value&&value!==heading&&value.length>20&&value.length<420);
      const details=detailParts.find(value=>!/privacy|cookie|contact|legal/i.test(value))||'';
      const id=node.id||node.closest('[id]')?.id||`offer-${index}`;
      const item={id:`special-${id}`,title:heading,details,percent:extractPercent(`${heading} ${details}`),amount:0,link:promotionLink(node)};
      if(!offers.some(existing=>normalize(existing.title)===normalize(item.title)))offers.push(item);
    });
    return offers;
  }
  function normalizeOffer(item,index,prefix='manual'){
    return {
      id:item.id||`${prefix}-${index}`,
      title:cleanTitle(item.title),
      details:cleanTitle(item.details||item.description||''),
      percent:number(item.percent),
      amount:number(item.amount),
      promoCode:String(item.promoCode||'').trim(),
      discountScope:item.discountScope||'all',
      eligiblePaths:Array.isArray(item.eligiblePaths)?item.eligiblePaths.map(normPath):[],
      requiredPaths:Array.isArray(item.requiredPaths)?item.requiredPaths.map(normPath):[],
      autoAddPaths:Array.isArray(item.autoAddPaths)?item.autoAddPaths.map(normPath):[],
      link:absoluteUrl(item.link||CONFIG.SPECIAL_OFFERS_PATH)
    };
  }
  function mergeOffers(...groups){
    const merged=[];groups.flat().filter(Boolean).forEach(item=>{if(!item.title)return;const key=normalize(item.title);const existing=merged.find(value=>normalize(value.title)===key);if(existing){Object.assign(existing,{...item,id:existing.id,link:item.link||existing.link,details:item.details||existing.details,percent:item.percent||existing.percent});return}merged.push(item)});return merged;
  }
  function loadRenderedSpecialOffers(){
    return new Promise(resolve=>{
      const frame=document.createElement('iframe');frame.tabIndex=-1;frame.setAttribute('aria-hidden','true');frame.style.cssText='position:fixed;width:1px;height:1px;left:-9999px;top:0;opacity:0;pointer-events:none';
      let settled=false;const finish=offers=>{if(settled)return;settled=true;frame.remove();resolve(offers||[])};
      const timer=setTimeout(()=>finish([]),7000);
      frame.addEventListener('load',()=>setTimeout(()=>{clearTimeout(timer);try{finish(offerCandidatesFromDocument(frame.contentDocument))}catch(e){finish([])}},1200),{once:true});
      frame.src=absoluteUrl(CONFIG.SPECIAL_OFFERS_PATH);document.body.appendChild(frame);
    });
  }
  async function loadSpecialOffers(){
    const manual=(Array.isArray(window.FILIN_CART_SPECIAL_OFFERS)?window.FILIN_CART_SPECIAL_OFFERS:[]).map((item,index)=>normalizeOffer(item,index,'manual'));
    const defaults=(CONFIG.DEFAULT_SPECIAL_OFFERS||[]).map((item,index)=>normalizeOffer(item,index,'default'));
    state.specialOffers=manual.length?manual:defaults;
    renderSpecialOffers();
  }
  function renderSpecialOffers(){
    const box=document.getElementById('flcart-offer-list'),terms=document.getElementById('flcart-offers-link'),status=document.getElementById('flcart-offer-status');if(!box)return;
    if(!state.specialOffers.length){
      box.innerHTML='<div class="flcart-promo-status">Current promotion details are available on the Special Offers page.</div>';
      if(status){status.textContent='';status.className='flcart-offer-status'}
      if(terms)terms.href=absoluteUrl(CONFIG.SPECIAL_OFFERS_PATH);
      return;
    }
    box.innerHTML=state.specialOffers.map(offer=>{
      const checked=state.discountChoice?.type==='special'&&state.discountChoice.id===offer.id?'checked':'';
      const disabled=state.offerBusy?'disabled':'';
      return `<label class="flcart-offer"><input type="radio" name="flcart-discount-choice" value="${escapeHtml(offer.id)}" ${checked} ${disabled}><span><span class="flcart-offer-title">${escapeHtml(offer.title)}</span><span class="flcart-offer-code">Promo code: ${escapeHtml(offer.promoCode)}</span></span></label>`;
    }).join('');
    if(status){
      status.textContent=state.offerStatus||'Select one offer. Promo codes and discounts are not combined.';
      status.className=`flcart-offer-status${state.offerStatus?' is-success':''}`;
      if(/add |not eligible|unavailable|could not/i.test(state.offerStatus||''))status.className='flcart-offer-status is-error';
    }
    const selected=state.specialOffers.find(item=>item.id===state.discountChoice?.id)||state.specialOffers[0];
    if(terms&&selected)terms.href=selected.link;
  }
  function selectedDiscountAmount(){
    const choice=state.discountChoice;if(!choice)return 0;
    if(choice.amount>0)return Math.min(subtotal(),choice.amount);
    if(choice.percent>0){
      const base=choice.discountScope==='eligible-products'
        ?eligibleProductsForChoice(choice).reduce((sum,product)=>sum+productPrice(product)*productQuantity(product),0)
        :subtotal();
      return Math.max(0,base*choice.percent/100);
    }
    const native=Math.max(0,subtotal()+shippingAmount()+taxAmount()-nativeTotal());
    return choice.type==='promo'?native:0;
  }
  function renderSummary(){
    const sub=subtotal(),warranty=warrantyTotal(),ship=shippingAmount(),tax=taxAmount(),discount=selectedDiscountAmount(),estimated=Math.max(0,sub+warranty+ship+tax-discount),count=itemCount();
    const finalTotal=estimated;const set=(id,text)=>{const el=document.getElementById(id);if(el)el.textContent=text};set('flcart-title-count',`(${count} ${count===1?'item':'items'})`);set('flcart-subtotal',money(sub));set('flcart-warranty-total',money(warranty));const warrantyRow=document.getElementById('flcart-warranty-summary-row');if(warrantyRow)warrantyRow.classList.toggle('is-visible',warranty>0);set('flcart-shipping',ship>0?money(ship):'Calculated at checkout');set('flcart-discount',state.discountChoice?(discount>0?`−${money(discount)} · ${state.discountChoice.title}`:state.discountChoice.title):'None');set('flcart-total-label',state.discountChoice&&state.discountChoice.type!=='promo'?'Estimated Total':'Total');set('flcart-total',money(finalTotal));set('flcart-summary-toggle-total',money(finalTotal));updateBnpl(finalTotal);
  }
  function ensureHiddenField(form,name,value){if(!form)return;let input=form.querySelector(`input[data-flcart-hidden="${name}"]`);if(!input){input=document.createElement('input');input.type='hidden';input.name=name;input.dataset.flcartHidden=name;form.appendChild(input)}input.value=value||''}
  function updateOrderFields(){document.querySelectorAll('.t706 form,#flcart-native-host form').forEach(form=>{ensureHiddenField(form,'Selected Discount',state.discountChoice?.title||'None');ensureHiddenField(form,'Discount Source',state.discountChoice?.type||'None');ensureHiddenField(form,'Selected Discount Value',selectedDiscountAmount()?money(selectedDiscountAmount()):'Pending confirmation');ensureHiddenField(form,'Selected Promotion Code',state.discountChoice?.promoCode||'');ensureHiddenField(form,'Survey Completed',surveyIsCompleted()?'Yes':'No');ensureHiddenField(form,'Loyalty Member Email',loyaltyMemberEmail()||'');ensureHiddenField(form,'Loyalty Tier',readLoyaltyWallet().tier||'MEMBER');ensureHiddenField(form,'Loyalty Points Available',String(loyaltyAvailablePoints()));ensureHiddenField(form,'Loyalty Points Redeemed',String(loyaltyAppliedPoints()));ensureHiddenField(form,'Loyalty Reward Credit',loyaltyAppliedPoints()?money(loyaltyCreditFromPoints(loyaltyAppliedPoints())):'$0');ensureHiddenField(form,'Loyalty Redemption Status',loyaltyAppliedPoints()?'Reserved in cart — finalize after successful payment':'Not used');ensureHiddenField(form,'Cart Options',rawProducts().map(p=>`${productName(p)}: ${optionEntries(p).map(o=>`${o.label}=${o.value}`).join(', ')||'No additional options'}`).join(' | '));ensureHiddenField(form,'Selected Warranties',rawProducts().map(p=>`${productName(p)}: ${warrantyLabel(p)}${warrantyPercent(warrantyYears(p))?` (+${money(warrantyAmount(p))} line total)`:''}`).join(' | '));ensureHiddenField(form,'Warranty Total',money(warrantyTotal()))})}
  function restoreNativeCartPopup(){
    const host=document.getElementById('flcart-native-host');
    ['.t706__cartwin','.t706__cartpage'].forEach(selector=>{
      const el=document.querySelector(selector);if(el&&host&&host.contains(el))document.body.appendChild(el);
    });
    document.querySelectorAll('.flcart-native-product-img').forEach(img=>img.remove());
    host?.classList.remove('is-visible');
  }
  function mountNativeCart(){restoreNativeCartPopup();updateOrderFields();unlockBody()}
  function openCheckoutInline(){
    if(!rawProducts().length)return;
    ensureShell();closeSummaryModal();restoreNativeCartPopup();
    track('begin_checkout',{currency:CONFIG.CURRENCY,value:Math.max(0,subtotal()+warrantyTotal()+shippingAmount()+taxAmount()-selectedDiscountAmount()),items:rawProducts().map(gaItem)});
    document.documentElement.classList.add('flcart-checkout-open');
    if(surveyIsCompleted()){state.discountChoice=state.discountChoice||surveyChoice();state.surveyPromoApplied=applyNativePromoValue(CONFIG.SURVEY_PROMO_CODE)||state.surveyPromoApplied}
    if(state.discountChoice?.promoCode)applyNativePromoValue(state.discountChoice.promoCode);
    const original=window.tcart__openCart?.__flcartOriginal||state.nativeOpen||window.tcart__openCart;
    if(typeof original==='function'){
      try{original.call(window)}catch(error){console.warn('Filin cart: native ST100 popup could not be opened.',error)}
    }else{
      const trigger=document.querySelector('a[href="#opencart"],a[href="#tcart"],.t706__carticon');trigger?.click();
    }
    [0,80,180,350,700].forEach(delay=>setTimeout(()=>{restoreNativeCartPopup();updateOrderFields();if(surveyIsCompleted()&&!state.surveyPromoApplied)state.surveyPromoApplied=applyNativePromoValue(CONFIG.SURVEY_PROMO_CODE)},delay));
  }
  function updateBnpl(total){
    const block=document.getElementById('flcart-bnpl-inline');if(!block)return;const visible=total>CONFIG.BNPL_MINIMUM;block.classList.toggle('is-visible',visible);const quarter=document.getElementById('flcart-bnpl-quarter');if(quarter)quarter.textContent=money(total/4);state.lastBnplAmount=visible?Math.round(total*100):-1;
  }
  function inferTags(){
    const text=normalize(rawProducts().map(productName).join(' ')),tags=[];
    const rules=[[/headphone|наушник/,['headphone','headphones','cable']],[/speaker|loudspeaker|акустик/,['speaker','speakers','cable']],[/dac|digital to analog|цап/,['dac','digital','power']],[/streamer|network player|digital source/,['streamer','network','digital','power']],[/amplifier|amp|усилител/,['amplifier','power']],[/cable|кабел/,['accessory','power']],[/phonostage|phono/,['power','cable']]];
    rules.forEach(([regex,values])=>{if(regex.test(text))tags.push(...values)});if(!tags.length)tags.push('accessory','power');return [...new Set(tags)];
  }
  function recommendationKey(){return rawProducts().map(p=>normalize(productName(p))).sort().join('|')}
  function scoreRecommendation(item,tags){return item.tags.reduce((score,tag)=>score+(tags.includes(tag)?3:0),0)}
  async function fetchRecommendation(item){
    if(state.recommendationCache.has(item.url))return state.recommendationCache.get(item.url);
    const promise=(async()=>{const meta=await fetchProductMeta(item.url);return {...item,title:meta.title||cleanTitle(item.url.split('/').pop().replace(/[_-]+/g,' ')),description:meta.description,image:meta.image,price:meta.price}})();state.recommendationCache.set(item.url,promise);return promise;
  }
  async function updateRecommendations(){
    const block=document.getElementById('flcart-recommendations'),grid=document.getElementById('flcart-recommendation-grid');if(!block||!grid)return;const products=rawProducts();if(!products.length){block.classList.remove('is-visible');grid.innerHTML='';return}
    const key=recommendationKey();if(key===state.lastRecommendationKey)return;state.lastRecommendationKey=key;const tags=inferTags(),cartNames=products.map(p=>normalize(productName(p))),cartUrls=products.map(p=>{try{return normPath(new URL(productUrl(p)||'/',location.origin).pathname)}catch(e){return '/'}});
    const candidates=CONFIG.RELATED_PRODUCTS.filter(item=>!cartUrls.includes(normPath(item.url))&&!cartNames.some(name=>name&&normalize(item.url).includes(name))).map(item=>({...item,score:scoreRecommendation(item,tags)})).sort((a,b)=>b.score-a.score).slice(0,CONFIG.MAX_RECOMMENDATIONS);const resolved=await Promise.all(candidates.map(fetchRecommendation));

    grid.innerHTML=resolved.map((item,index)=>`<article class="flcart-rec-card"><a class="flcart-rec-media" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${item.image?`<img data-flcart-rec-image="${index}" alt="${escapeHtml(item.title)}" loading="lazy">`:''}</a><div class="flcart-rec-body"><a class="flcart-rec-title" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.title)}</a><p class="flcart-rec-desc">${escapeHtml(item.description||'Explore this complementary component for your Filin Labs system.')}</p><div class="flcart-rec-price">${item.price>0?money(item.price):'Price on request'}</div><a class="flcart-rec-btn" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">View Gear</a></div></article>`).join('');

    /* V18.1: recommendation image URLs are also assigned after insertion. */
    resolved.forEach((item,index)=>{
      if(!item.image)return;
      const img=grid.querySelector(`[data-flcart-rec-image="${index}"]`);
      if(img)img.src=item.image;
    });

    block.classList.toggle('is-visible',resolved.length>0);
  }
  function cartSignature(){return getProducts().map(({product})=>`${productKey(product)}:${productQuantity(product)}:${productPrice(product)}:w${warrantyYears(product)}:${optionEntries(product).map(o=>`${normalize(o.label)}=${normalize(o.value)}`).join(',')}`).join('|')+`|${shippingAmount()}|${taxAmount()}`}
  function headerCartCount(){
    let max=0;
    document.querySelectorAll('.t706__carticon-counter,.t706__carticon-text,[class*="carticon-counter"],[class*="cart-counter"]').forEach(el=>{
      const value=parseInt(String(el.textContent||'').replace(/\D+/g,''),10);if(Number.isFinite(value))max=Math.max(max,value)
    });
    return max;
  }
  function cartObjectReady(){return !!(window.tcart&&Array.isArray(window.tcart.products))}
  function waitForCartReady(callback){
    const started=Date.now();let zeroStableSince=0;
    const tick=()=>{
      const ready=cartObjectReady(),count=itemCount(),badge=headerCartCount(),elapsed=Date.now()-started;
      if(ready&&count>0){state.cartReady=true;callback();return}
      if(ready&&badge===0){if(!zeroStableSince)zeroStableSince=Date.now();if(Date.now()-zeroStableSince>1100){state.cartReady=true;callback();return}}
      else zeroStableSince=0;
      if(elapsed>7000){state.cartReady=true;callback();return}
      setTimeout(tick,100);
    };
    tick();
  }
  function finishInitialPosition(){
    if(state.initialScrollDone)return;
    state.initialScrollDone=true;
    requestAnimationFrame(()=>requestAnimationFrame(()=>window.scrollTo({top:0,left:0,behavior:'auto'})));
  }
  function updateCartPage(force=false){
    if(!onCartPage()||state.renderLock)return;const page=ensureShell();if(!page)return;
    const loading=document.getElementById('flcart-loading');
    if(!state.cartReady){loading?.classList.add('is-visible');document.getElementById('flcart-empty')?.classList.remove('is-visible');document.getElementById('flcart-cart-layout')?.classList.remove('is-visible');return}
    loading?.classList.remove('is-visible');reconcileOptionSnapshots();const signature=cartSignature();
    state.renderLock=true;try{const products=rawProducts();document.getElementById('flcart-empty')?.classList.toggle('is-visible',products.length===0);document.getElementById('flcart-cart-layout')?.classList.toggle('is-visible',products.length>0);if(force||signature!==state.lastCartSignature){state.lastCartSignature=signature;if(products.length)renderItems();renderSummary();renderSurvey();renderSpecialOffers();renderLoyalty();renderDiscountTabs();updateOrderFields();updateRecommendations();if(products.length&&signature!==state.lastViewCartSignature){state.lastViewCartSignature=signature;track('view_cart',{currency:CONFIG.CURRENCY,value:subtotal(),items:products.map(gaItem)})}}else renderSummary();unlockBody()}finally{state.renderLock=false}
  }
  function init(){
    prefillProductOptions();ensurePatch();window.addEventListener('resize',()=>{syncHeaderOffset();if(innerWidth>760)closeSummaryModal()});window.addEventListener('orientationchange',()=>setTimeout(()=>{syncHeaderOffset();if(innerWidth>760)closeSummaryModal()},150));document.addEventListener('keydown',event=>{if(event.key==='Escape'){closeSummaryModal();closeSurveyModal()}});
    document.addEventListener('click',event=>{if(event.target.closest('.t706__cartwin-close,.t706__cartpage-close,.t706__close,[data-cart-close]'))setTimeout(()=>document.documentElement.classList.remove('flcart-checkout-open'),60)},true);
    if(onCartPage()){
      document.documentElement.classList.add('flcart-cart-route');
      document.body?.classList.remove('t706__body_cartwinshowed','t706__body_cartpageshowed');
      const start=()=>{const page=ensureShell();if(!page){setTimeout(start,80);return}readLoyaltyWallet();state.surveyCompleted=surveyIsCompleted();if(state.surveyCompleted&&!state.discountChoice)state.discountChoice=surveyChoice();syncHeaderOffset();finishInitialPosition();[120,500,1200].forEach(delay=>setTimeout(syncHeaderOffset,delay));updateCartPage(true);loadSpecialOffers();waitForCartReady(()=>{reconcileOptionSnapshots();recalculateNativeCart();updateCartPage(true);document.documentElement.classList.remove('flcart-cart-booting')});setInterval(()=>updateCartPage(false),1100);document.addEventListener('tilda:cart:updated',()=>{state.cartReady=true;state.lastCartSignature='';setTimeout(()=>updateCartPage(true),40)})};start();
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();
})();
