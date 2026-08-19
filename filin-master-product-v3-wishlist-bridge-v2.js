/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 WISHLIST BRIDGE V2
   ST110 native custom-link adapter for Golden Standard V3.

   V2 changes vs V1:
   - DOES NOT require a legacy/native .js-product source card
   - DOES NOT create plain #addtofavorites controls
   - uses Tilda's custom favorites link format:
       #addtofavorites:NAME=PRICE:::image=IMAGE_URL
   - mirrors state from window.twishlist
   - patches the stored wishlist URL back to the current product page
   - survives Golden root rebuilds
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V2__) return;
  window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V2__=true;

  var VERSION='2.0.0';
  var ROOT_ID='filin-master-product-v3';
  var LINK_ID='fp-v3-wishlist-custom-link-v2';
  var state={
    version:VERSION,
    ready:false,
    repairs:0,
    title:'',
    price:0,
    image:'',
    url:'',
    active:false,
    twishlistReady:false,
    linkReady:false
  };

  function arr(v){return Array.prototype.slice.call(v||[]);}
  function str(v){return String(v==null?'':v).trim();}
  function norm(v){return str(v).replace(/\s+/g,' ').trim();}
  function root(){return document.getElementById(ROOT_ID);}
  function safeClosest(el,sel){try{return el&&el.closest?el.closest(sel):null;}catch(e){return null;}}

  function readSeed(){
    try{
      var el=document.getElementById('product-data');
      return el?JSON.parse(el.textContent||'{}'):{};
    }catch(e){return {};}
  }

  function getTitle(r){
    var el=r&&(
      r.querySelector('#v3-tilda-product-name')||
      r.querySelector('.v3-overview h2')||
      r.querySelector('.v3-buy-label')
    );
    var t=norm(el&&el.textContent);
    if(t)return t;
    var seed=readSeed();
    return norm(
      (seed.commerce&&seed.commerce.cartName)||
      seed.name||seed.model||document.title||'Filin Labs Product'
    );
  }

  function getPrice(r){
    var el=r&&(
      r.querySelector('#v3-main-price')||
      r.querySelector('.v3-buy-price')||
      r.querySelector('.js-product-price')
    );
    var raw=str(el&&el.textContent).replace(/[^0-9.,-]/g,'').replace(/,/g,'');
    var n=Number(raw);
    if(Number.isFinite(n)&&n>=0)return Math.round(n);
    var seed=readSeed();
    n=Number(seed.commerce&&(seed.commerce.regularPrice||seed.commerce.basePrice)||0);
    return Number.isFinite(n)?Math.round(n):0;
  }

  function getImage(r){
    var img=r&&(
      r.querySelector('.v3-main-img')||
      r.querySelector('.v3-gallery img')||
      r.querySelector('.v3-js-product .js-product-img')
    );
    var u=str(img&&(img.getAttribute('data-original')||img.getAttribute('data-src')||img.getAttribute('src')));
    if(u)return u;
    var seed=readSeed();
    var xs=seed.overview&&seed.overview.galleryImages;
    return str((xs&&xs[0])||(seed.hero&&seed.hero.background)||'');
  }

  function getUrl(){
    var seed=readSeed();
    var p=str(seed.page&&seed.page.productPath);
    if(p){
      try{return new URL(p,location.origin).href;}catch(e){}
    }
    return location.origin+location.pathname;
  }

  function cleanToken(v){
    return norm(v).replace(/:::/g,' ').replace(/=/g,'-');
  }

  function customHref(title,price,image){
    var h='#addtofavorites:'+cleanToken(title)+'='+String(Math.max(0,Math.round(Number(price)||0)));
    if(image)h+=':::image='+image;
    return h;
  }

  function ensureLink(){
    var r=root();
    if(!r)return null;
    var a=document.getElementById(LINK_ID);
    if(!a){
      a=document.createElement('a');
      a.id=LINK_ID;
      a.setAttribute('aria-label','Wishlist bridge');
      a.setAttribute('tabindex','-1');
      a.style.cssText='position:fixed!important;left:-10000px!important;top:0!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:.001!important;pointer-events:none!important;';
      a.textContent='wishlist';
      document.body.appendChild(a);
    }
    state.title=getTitle(r);
    state.price=getPrice(r);
    state.image=getImage(r);
    state.url=getUrl();
    a.setAttribute('href',customHref(state.title,state.price,state.image));
    a.setAttribute('data-prod-title',state.title);
    state.linkReady=true;
    return a;
  }

  function wish(){
    var w=window.twishlist;
    return w&&Array.isArray(w.products)?w:null;
  }

  function sameProduct(p){
    if(!p)return false;
    var pn=norm(p.name).toLowerCase();
    var tn=norm(state.title).toLowerCase();
    if(pn&&tn&&pn===tn)return true;
    var pu=str(p.url).replace(/[?#].*$/,'');
    var tu=str(state.url).replace(/[?#].*$/,'');
    return !!(pu&&tu&&pu===tu);
  }

  function findProduct(){
    var w=wish();
    if(!w)return null;
    for(var i=0;i<w.products.length;i++)if(sameProduct(w.products[i]))return w.products[i];
    return null;
  }

  function setHeart(active){
    var r=root();
    state.active=!!active;
    if(!r)return;
    arr(r.querySelectorAll('.v3-fav')).forEach(function(f){
      f.textContent=active?'♥':'♡';
      f.classList.toggle('v3-fav-active',!!active);
      f.setAttribute('aria-pressed',active?'true':'false');
      f.setAttribute('aria-label',active?'Remove from wishlist':'Add to wishlist');
      f.dataset.fpWishlistReady=state.ready?'1':'0';
    });
  }

  function saveWishlist(){
    try{if(typeof window.twishlist__saveLocalObj==='function')window.twishlist__saveLocalObj();}catch(e){}
    try{if(typeof window.twishlist__reDrawProducts==='function')window.twishlist__reDrawProducts();}catch(e){}
  }

  function patchStoredProduct(){
    var p=findProduct();
    if(!p)return false;
    var changed=false;
    if(state.url&&p.url!==state.url){p.url=state.url;changed=true;}
    if(state.image&&!p.img){p.img=state.image;changed=true;}
    if(changed)saveWishlist();
    return true;
  }

  function publish(){
    state.twishlistReady=!!wish();
    state.ready=!!(root()&&state.linkReady&&state.twishlistReady);
    window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V2_STATE__={
      version:VERSION,
      ready:state.ready,
      repairs:state.repairs,
      title:state.title,
      price:state.price,
      image:state.image,
      url:state.url,
      active:state.active,
      twishlistReady:state.twishlistReady,
      linkReady:state.linkReady,
      total:state.twishlistReady?Number(window.twishlist.total||0):null
    };
  }

  function sync(){
    ensureLink();
    state.twishlistReady=!!wish();
    if(state.twishlistReady)patchStoredProduct();
    state.ready=!!(root()&&state.linkReady&&state.twishlistReady);
    setHeart(!!findProduct());
    publish();
  }

  function repair(){
    state.repairs++;
    ensureLink();
    sync();
    return state.ready;
  }

  function cleanHash(){
    try{
      if(String(location.hash||'').indexOf('#addtofavorites:')===0){
        history.replaceState(null,document.title,location.pathname+location.search);
      }
    }catch(e){}
  }

  function clickCustomLink(){
    var a=ensureLink();
    if(!a){console.warn('[V3 Wishlist Bridge V2] Golden root not found');return false;}
    if(!wish()){
      console.warn('[V3 Wishlist Bridge V2] ST110/twishlist not ready yet');
      setTimeout(repair,150);
      return false;
    }
    try{
      a.click();
      [80,180,400,800].forEach(function(ms){setTimeout(function(){sync();cleanHash();},ms);});
      return true;
    }catch(e){
      console.error('[V3 Wishlist Bridge V2] custom favorites click failed',e);
      return false;
    }
  }

  document.addEventListener('click',function(ev){
    var fav=safeClosest(ev.target,'#'+ROOT_ID+' .v3-fav');
    if(!fav)return;
    ev.preventDefault();
    ev.stopPropagation();
    if(typeof ev.stopImmediatePropagation==='function')ev.stopImmediatePropagation();
    clickCustomLink();
  },true);

  document.addEventListener('click',function(ev){
    if(safeClosest(ev.target,'.t1002__product-del,.t1002__addBtn,[href="#showfavorites"]')){
      [80,220,500].forEach(function(ms){setTimeout(sync,ms);});
    }
  },false);

  window.addEventListener('storage',function(){setTimeout(sync,0);});
  window.addEventListener('pageshow',function(){setTimeout(repair,0);});

  var obs=null,obsTimer=null;
  function schedule(){
    if(obsTimer)return;
    obsTimer=setTimeout(function(){obsTimer=null;sync();},60);
  }
  if(window.MutationObserver){
    obs=new MutationObserver(function(muts){
      var relevant=muts.some(function(m){
        if(m.type==='characterData')return true;
        if(m.type!=='childList')return false;
        return arr(m.addedNodes).concat(arr(m.removedNodes)).some(function(n){
          if(!n||n.nodeType!==1)return false;
          return n.id===ROOT_ID ||
            (n.matches&&n.matches('.t1002,.t1002__product,.t1002__wishlisticon-counter')) ||
            (n.querySelector&&n.querySelector('#'+ROOT_ID+',.t1002,.t1002__wishlisticon-counter'));
        });
      });
      if(relevant)schedule();
    });
    obs.observe(document.documentElement,{childList:true,subtree:true,characterData:true});
  }

  [0,100,300,700,1400,2600,5000].forEach(function(ms){setTimeout(repair,ms);});
  var wait=0;
  var timer=setInterval(function(){
    wait++;
    if(repair()||wait>=40)clearInterval(timer);
  },250);

  console.info('[V3 Wishlist Bridge V2] LOADED',{version:VERSION,mode:'custom-link'});
})();