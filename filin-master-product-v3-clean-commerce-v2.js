/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 CLEAN COMMERCE V2
   Clean V3 commerce bridge with whole-dollar pricing.

   - no legacy page scanning
   - no batch/fixer chain
   - Perfect Matches: adds selected catalog products at 5% off each
   - final displayed/cart price is rounded to the nearest whole USD
   - synchronizes V3 BUY NOW price + hidden Tilda price + sticky price
   - document-level change listener survives V3 root replacement
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_MASTER_PRODUCT_V3_CLEAN_COMMERCE_V2__) return;
  window.__FILIN_MASTER_PRODUCT_V3_CLEAN_COMMERCE_V2__=true;

  function normPath(v){
    try{return new URL(v,location.href).pathname.replace(/\/+$/,'')||'/';}
    catch(e){return String(v||'').split('?')[0].replace(/\/+$/,'')||'/';}
  }
  function wholeUsd(n){return Math.round(Number(n)||0);}
  function money(n){return '$'+wholeUsd(n).toLocaleString('en-US');}
  function root(){return document.getElementById('filin-master-product-v3');}
  function productData(){
    try{return JSON.parse((document.getElementById('product-data')||{}).textContent||'{}');}
    catch(e){return {};}
  }
  function profile(){
    var d=productData();
    return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[d.slug]||null;
  }
  function basePrice(){
    var p=profile(),d=productData();
    return Number(p&&p.commerce&&p.commerce.basePrice||d.price||d.commerce&&d.commerce.regularPrice||0);
  }
  function catalogProducts(){return window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products||{};}
  function productByHref(href){
    var target=normPath(href),ps=catalogProducts(),keys=Object.keys(ps);
    for(var i=0;i<keys.length;i++){
      var x=ps[keys[i]]||{};
      if(normPath(x.url||('/'+keys[i]))===target) return x;
    }
    return null;
  }
  function selected(){
    var r=root(); if(!r)return [];
    return Array.prototype.slice.call(r.querySelectorAll('.v3-pm .v3-bundle:checked')).map(function(cb){
      var row=cb.closest('.v3-pm-item')||cb.parentElement;
      var a=row&&row.querySelector('a[href]');
      var p=a&&productByHref(a.href);
      return {name:a&&a.textContent.trim()||'',href:a&&a.href||'',price:Number(p&&p.price||0)};
    });
  }
  function syncSticky(total){
    var formatted=money(total);
    Array.prototype.forEach.call(document.querySelectorAll('body *'),function(el){
      if(el.children.length)return;
      var t=(el.textContent||'').trim();
      if(!/^\$[\d,]+(?:\.\d+)?$/.test(t))return;
      var p=el;
      for(var i=0;i<6&&p;i++,p=p.parentElement){
        var cs;try{cs=getComputedStyle(p);}catch(e){break;}
        if(cs.position==='fixed'||cs.position==='sticky'){
          if(el.textContent!==formatted)el.textContent=formatted;
          break;
        }
      }
    });
  }
  function update(){
    var r=root();if(!r)return false;
    var items=selected();
    var base=basePrice();
    var selectedSubtotal=items.reduce(function(sum,x){return sum+x.price;},0);
    var discountedAddExact=selectedSubtotal*0.95;
    var total=wholeUsd(base+discountedAddExact);
    var formatted=money(total);

    var visible=r.querySelector('.v3-buy-price');
    if(visible)visible.textContent=formatted;

    var nativePrice=r.querySelector('#v3-main-price');
    if(nativePrice)nativePrice.textContent=String(total);

    var nativeName=r.querySelector('#v3-tilda-product-name');
    var p=profile();
    if(nativeName&&p&&p.commerce&&p.commerce.cartName)nativeName.textContent=p.commerce.cartName;

    syncSticky(total);

    var state={
      version:'2.0.0',
      slug:productData().slug||'',
      base:wholeUsd(base),
      selected:items.length,
      selectedSubtotal:wholeUsd(selectedSubtotal),
      selectedAfterDiscount:wholeUsd(discountedAddExact),
      total:total,
      items:items
    };
    window.__FILIN_MASTER_PRODUCT_V3_CLEAN_COMMERCE_V2_STATE__=state;
    window.__FILIN_MASTER_PRODUCT_V3_CLEAN_COMMERCE_V1_STATE__=state;
    window.__FILIN_GOLDEN_SPEAKERS_BATCH_V7_STATE__=state;
    try{window.dispatchEvent(new CustomEvent('filin:product:v3:price',{detail:state}));}catch(e){}
    return true;
  }

  document.addEventListener('change',function(e){
    if(e.target&&e.target.matches('#filin-master-product-v3 .v3-pm .v3-bundle')){
      setTimeout(update,0);
    }
  },true);

  function init(){
    update();
    setTimeout(update,500);
    setTimeout(update,1400);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});
  else init();

  console.info('[Master Product V3 Clean Commerce V2] READY');
})();
