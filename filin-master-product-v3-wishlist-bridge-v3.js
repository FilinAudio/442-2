/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 WISHLIST BRIDGE V3
   Direct ST110 / twishlist adapter for Golden Standard V3.

   V3 changes vs V2:
   - no #addtofavorites hash navigation / synthetic-link click
   - toggles the already initialized window.twishlist store directly
   - persists through Tilda's own twishlist__saveLocalObj when available
   - redraws the native ST110 widget/counter through Tilda functions
   - installs a hidden native-compatible product shell inside Golden
     .v3-js-product so Tilda wishlist scans do not hit incomplete markup
   - keeps Golden heart synchronized after reload and native ST110 delete
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V3__) return;
  window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V3__=true;

  var VERSION='3.0.0';
  var ROOT_ID='filin-master-product-v3';
  var SHELL_CLASS='fp-v3-wishlist-native-shell-v3';
  var state={
    version:VERSION,
    mode:'direct-twishlist',
    ready:false,
    repairs:0,
    title:'',
    price:0,
    image:'',
    url:'',
    uid:'',
    active:false,
    total:null,
    shellReady:false,
    twishlistReady:false,
    lastAction:'init',
    lastError:''
  };

  function arr(v){return Array.prototype.slice.call(v||[]);}
  function str(v){return String(v==null?'':v).trim();}
  function norm(v){return str(v).replace(/\s+/g,' ').trim();}
  function safeClosest(el,sel){try{return el&&el.closest?el.closest(sel):null;}catch(e){return null;}}
  function root(){return document.getElementById(ROOT_ID);}
  function goldenProduct(r){return r&&(r.querySelector('.v3-js-product.js-product')||r.querySelector('.v3-js-product'));}

  function readSeed(){
    try{
      var el=document.getElementById('product-data');
      return el?JSON.parse(el.textContent||'{}'):{};
    }catch(e){return {};}
  }

  function productTitle(r){
    var el=r&&(r.querySelector('#v3-tilda-product-name')||r.querySelector('.v3-overview h2'));
    var t=norm(el&&el.textContent);
    if(t)return t;
    var d=readSeed();
    return norm((d.commerce&&d.commerce.cartName)||d.name||d.model||document.title||'Filin Labs Product');
  }

  function productPrice(r){
    var el=r&&(r.querySelector('#v3-main-price')||r.querySelector('.v3-buy-price')||r.querySelector('.js-product-price'));
    var raw=str(el&&el.textContent).replace(/[^0-9.,-]/g,'').replace(/,/g,'');
    var n=Number(raw);
    if(Number.isFinite(n)&&n>=0)return Math.round(n);
    var d=readSeed();
    n=Number(d.commerce&&(d.commerce.regularPrice||d.commerce.basePrice)||d.price||0);
    return Number.isFinite(n)?Math.round(n):0;
  }

  function productImage(r){
    var img=r&&(r.querySelector('.v3-main-img')||r.querySelector('.v3-gallery img')||r.querySelector('.v3-js-product .js-product-img'));
    var u=str(img&&(img.getAttribute('data-original')||img.getAttribute('data-src')||img.getAttribute('src')));
    if(u)return u;
    var d=readSeed(),xs=d.overview&&d.overview.galleryImages;
    return str((xs&&xs[0])||(d.hero&&d.hero.background)||'');
  }

  function productUrl(){
    var d=readSeed();
    var p=str(d.page&&d.page.productPath);
    if(p){try{return new URL(p,location.origin).href;}catch(e){}}
    return location.origin+location.pathname;
  }

  function hash32(s){
    var h=2166136261>>>0;
    s=String(s||'');
    for(var i=0;i<s.length;i++){
      h^=s.charCodeAt(i);
      h=Math.imul(h,16777619)>>>0;
    }
    return h>>>0;
  }

  function stableUid(){
    var d=readSeed();
    var key=str(d.slug||d.id||productUrl()||productTitle(root()));
    return String(800000000000+(hash32(key)%199999999999));
  }

  function refreshIdentity(){
    var r=root();
    state.title=productTitle(r);
    state.price=productPrice(r);
    state.image=productImage(r);
    state.url=productUrl();
    state.uid=stableUid();
  }

  function wish(){
    var w=window.twishlist;
    return w&&Array.isArray(w.products)?w:null;
  }

  function sameProduct(p){
    if(!p)return false;
    var uid=str(p.uid||p.id||p.productuid);
    if(uid&&state.uid&&uid===state.uid)return true;
    var pn=norm(p.name||p.title).toLowerCase();
    var tn=norm(state.title).toLowerCase();
    if(pn&&tn&&pn===tn)return true;
    var pu=str(p.url).replace(/[?#].*$/,'').replace(/\/+$/,'');
    var tu=str(state.url).replace(/[?#].*$/,'').replace(/\/+$/,'');
    return !!(pu&&tu&&pu===tu);
  }

  function findIndex(){
    var w=wish();
    if(!w)return -1;
    for(var i=0;i<w.products.length;i++)if(sameProduct(w.products[i]))return i;
    return -1;
  }

  function makeProduct(){
    return {
      name:state.title,
      title:state.title,
      price:state.price,
      amount:state.price,
      quantity:1,
      uid:state.uid,
      sku:'',
      img:state.image,
      image:state.image,
      url:state.url,
      inv:1,
      unit:'',
      portion:0,
      options:[]
    };
  }

  function recalc(w){
    if(!w)return;
    w.total=w.products.length;
    var sum=w.products.reduce(function(s,p){
      var n=Number(p&&((p.amount!=null)?p.amount:p.price));
      return s+(Number.isFinite(n)?n:0);
    },0);
    if(Object.prototype.hasOwnProperty.call(w,'amount'))w.amount=sum;
    if(Object.prototype.hasOwnProperty.call(w,'prodamount'))w.prodamount=sum;
  }

  function safeCall(name){
    try{
      var fn=window[name];
      if(typeof fn==='function'){fn();return true;}
    }catch(e){
      state.lastError=name+': '+String(e&&e.message||e);
      console.warn('[V3 Wishlist Bridge V3] '+name+' failed',e);
    }
    return false;
  }

  function redrawNative(){
    safeCall('twishlist__saveLocalObj');
    safeCall('twishlist__reDrawProducts');
    safeCall('twishlist__reDrawTotal');
    safeCall('twishlist__reDrawWishlistIcon');
    safeCall('twishlist__reDrawIcon');

    var w=wish();
    var total=w?Number(w.total||0):0;
    arr(document.querySelectorAll('.t1002__wishlisticon-counter')).forEach(function(n){
      n.textContent=String(total);
    });
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

  function installNativeShell(){
    var r=root(),gp=goldenProduct(r);
    if(!r||!gp)return false;
    refreshIdentity();

    gp.classList.add('js-product');
    gp.setAttribute('data-product-inv','1');
    gp.setAttribute('data-product-lid',state.uid);
    gp.setAttribute('data-product-uid',state.uid);
    gp.setAttribute('data-product-gen-uid',state.uid);
    gp.setAttribute('data-product-part-uid','0');
    gp.setAttribute('data-product-url',state.url);
    gp.setAttribute('data-product-pack-label','lwh');
    gp.setAttribute('data-product-pack-m','0');
    gp.setAttribute('data-product-pack-x','0');
    gp.setAttribute('data-product-pack-y','0');
    gp.setAttribute('data-product-pack-z','0');

    var price=gp.querySelector('#v3-main-price,.js-product-price');
    if(price){
      price.classList.add('js-product-price');
      price.setAttribute('data-product-price-def',String(state.price));
      price.setAttribute('data-product-price-def-str',String(state.price));
    }
    var name=gp.querySelector('#v3-tilda-product-name,.js-product-name');
    if(name)name.classList.add('js-product-name','js-store-prod-name');

    var shell=gp.querySelector('.'+SHELL_CLASS);
    if(!shell){
      shell=document.createElement('div');
      shell.className='t-store__card__imgwrapper t1002__picture-wrapper '+SHELL_CLASS;
      shell.style.cssText='position:absolute!important;left:-10000px!important;top:0!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:.001!important;pointer-events:none!important;';

      var link=document.createElement('a');
      link.href=state.url;
      link.setAttribute('tabindex','-1');

      var img=document.createElement('img');
      img.className='js-product-img t-store__card__img';
      img.alt='';
      if(state.image){img.src=state.image;img.setAttribute('data-original',state.image);}
      link.appendChild(img);
      shell.appendChild(link);

      var fav=document.createElement('a');
      fav.href='#addtofavorites';
      fav.className='t1002__addBtn fp-v3-wishlist-native-btn-v3';
      fav.setAttribute('tabindex','-1');
      fav.setAttribute('aria-label','Add to favorites');
      fav.innerHTML='<svg width="21" height="18" viewBox="0 0 21 18" fill="none" aria-hidden="true"><path d="M20 6.32647C20 11.4974 10.5 17 10.5 17C10.5 17 1 11.4974 1 6.32647C1 -0.694364 10.5 -0.599555 10.5 5.57947C10.5 -0.599555 20 -0.507124 20 6.32647Z" stroke="black" stroke-linejoin="round"></path></svg>';
      shell.appendChild(fav);
      gp.insertBefore(shell,gp.firstChild||null);
    }else{
      var shImg=shell.querySelector('.js-product-img');
      if(shImg&&state.image){shImg.src=state.image;shImg.setAttribute('data-original',state.image);}
      var shLink=shell.querySelector('a:not([href="#addtofavorites"])');
      if(shLink)shLink.href=state.url;
    }

    state.shellReady=true;
    return true;
  }

  function publish(){
    var w=wish();
    state.twishlistReady=!!w;
    state.total=w?Number(w.total||0):null;
    state.ready=!!(root()&&state.shellReady&&state.twishlistReady);
    window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V3_STATE__={
      version:VERSION,
      mode:state.mode,
      ready:state.ready,
      repairs:state.repairs,
      title:state.title,
      price:state.price,
      image:state.image,
      url:state.url,
      uid:state.uid,
      active:state.active,
      total:state.total,
      shellReady:state.shellReady,
      twishlistReady:state.twishlistReady,
      lastAction:state.lastAction,
      lastError:state.lastError
    };
  }

  function sync(){
    installNativeShell();
    var w=wish();
    state.twishlistReady=!!w;
    if(w){
      recalc(w);
      setHeart(findIndex()>=0);
    }else setHeart(false);
    publish();
  }

  function repair(){
    state.repairs++;
    sync();
    return state.ready;
  }

  function toggle(){
    installNativeShell();
    var w=wish();
    if(!w){
      state.lastAction='blocked:not-ready';
      state.lastError='ST110/twishlist is not ready';
      publish();
      console.warn('[V3 Wishlist Bridge V3] ST110/twishlist not ready');
      return false;
    }

    var i=findIndex();
    if(i>=0){
      w.products.splice(i,1);
      state.lastAction='remove';
    }else{
      w.products.push(makeProduct());
      state.lastAction='add';
    }
    recalc(w);
    redrawNative();
    setHeart(findIndex()>=0);
    publish();

    [40,120,300,700].forEach(function(ms){setTimeout(sync,ms);});
    console.info('[V3 Wishlist Bridge V3] TOGGLE',{
      action:state.lastAction,
      uid:state.uid,
      title:state.title,
      total:w.total,
      active:state.active
    });
    return true;
  }

  document.addEventListener('click',function(ev){
    var fav=safeClosest(ev.target,'#'+ROOT_ID+' .v3-fav');
    if(!fav)return;
    ev.preventDefault();
    ev.stopPropagation();
    if(typeof ev.stopImmediatePropagation==='function')ev.stopImmediatePropagation();
    toggle();
  },true);

  document.addEventListener('click',function(ev){
    if(safeClosest(ev.target,'.t1002__product-del,[href="#showfavorites"],.t1002__wishlisticon')){
      [80,220,500,900].forEach(function(ms){setTimeout(sync,ms);});
    }
  },false);

  window.addEventListener('storage',function(){setTimeout(sync,0);});
  window.addEventListener('pageshow',function(){setTimeout(repair,0);});
  window.addEventListener('filin:product:v3:price',function(){setTimeout(sync,0);});

  var obs=null,obsTimer=null;
  function schedule(){
    if(obsTimer)return;
    obsTimer=setTimeout(function(){obsTimer=null;sync();},60);
  }
  if(window.MutationObserver){
    obs=new MutationObserver(function(muts){
      var relevant=muts.some(function(m){
        if(m.type==='characterData'){
          return !!safeClosest(m.target&&m.target.parentElement,'#'+ROOT_ID+',.t1002');
        }
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

  repair();
  [0,60,160,400,900,1800,3500].forEach(function(ms){setTimeout(repair,ms);});
  var waits=0,timer=setInterval(function(){
    waits++;
    if(repair()||waits>=50)clearInterval(timer);
  },200);

  console.info('[V3 Wishlist Bridge V3] LOADED',{version:VERSION,mode:state.mode});
})();