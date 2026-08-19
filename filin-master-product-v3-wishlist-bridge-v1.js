/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 WISHLIST BRIDGE V1
   Native Tilda ST110 / Favorites adapter for Golden Standard V3.

   Purpose:
   - keep Tilda ST110 as the single wishlist source of truth
   - map Golden .v3-fav to a native Tilda #addtofavorites control
   - reuse the real legacy Tilda product identity (data-product-*)
   - mirror native active state back to the Golden heart
   - survive Golden root rebuilds without modifying the frozen runtime
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V1__) return;
  window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V1__=true;

  var VERSION='1.0.0';
  var ROOT_ID='filin-master-product-v3';
  var PROXY_WRAP_CLASS='fp-v3-wishlist-proxy-wrap';
  var PROXY_BTN_CLASS='fp-v3-wishlist-native';
  var REPAIR_DELAYS=[0,80,220,600,1400,3000];
  var state={
    version:VERSION,
    ready:false,
    root:null,
    goldenProduct:null,
    sourceProduct:null,
    sourceButton:null,
    proxyButton:null,
    sourceUid:'',
    sourceUrl:'',
    lastActive:null,
    repairs:0,
    observer:null,
    syncObserver:null,
    syncObserved:[]
  };

  function arr(v){return Array.prototype.slice.call(v||[]);}
  function str(v){return String(v==null?'':v).trim();}
  function norm(v){
    return str(v).toLowerCase()
      .replace(/^https?:\/\/[^/]+/,'')
      .replace(/[?#].*$/,'')
      .replace(/[^a-z0-9]+/g,' ')
      .replace(/\s+/g,' ')
      .trim();
  }
  function readSeed(){
    try{
      var el=document.getElementById('product-data');
      return el?JSON.parse(el.textContent||'{}'):{};
    }catch(e){return {};}
  }
  function safeClosest(el,sel){
    try{return el&&el.closest?el.closest(sel):null;}catch(e){return null;}
  }
  function getRoot(){return document.getElementById(ROOT_ID);}
  function getGoldenProduct(root){
    return root&&(root.querySelector('.v3-js-product.js-product')||root.querySelector('.v3-js-product'));
  }
  function getName(box){
    var el=box&&box.querySelector('.js-product-name,.js-store-prod-name,.t-store__card__title');
    return norm(el&&el.textContent);
  }
  function getProductUrl(box){
    if(!box)return '';
    var u=box.getAttribute('data-product-url')||'';
    if(!u){
      var a=box.querySelector('a[href*="/tproduct/"],a[href^="/"]');
      u=a&&a.getAttribute('href')||'';
    }
    return str(u);
  }
  function getUid(box){
    if(!box)return '';
    return str(
      box.getAttribute('data-product-uid')||
      box.getAttribute('data-product-gen-uid')||
      box.getAttribute('data-product-lid')||
      box.getAttribute('data-product-part-uid')||''
    );
  }
  function tokenScore(a,b){
    a=norm(a);b=norm(b);if(!a||!b)return 0;
    var aa=a.split(' ').filter(function(x){return x.length>2;});
    var bb=b.split(' ').filter(function(x){return x.length>2;});
    if(!aa.length||!bb.length)return 0;
    var hits=aa.filter(function(x){return bb.indexOf(x)>=0;}).length;
    return hits/Math.max(aa.length,bb.length);
  }

  function scoreSource(box,root,seed,goldenName){
    if(!box||box===getGoldenProduct(root)||root.contains(box))return -9999;
    var score=0;
    var uid=getUid(box),url=getProductUrl(box),name=getName(box);
    var slug=norm(seed.slug||'');
    var path=norm(seed.page&&seed.page.productPath||'');
    var id=norm(seed.id||'');
    if(uid)score+=40;
    if(box.hasAttribute('data-product-url'))score+=8;
    if(url){
      var nu=norm(url);
      if(slug&&nu.indexOf(slug)>=0)score+=110;
      if(path&&nu.indexOf(path)>=0)score+=110;
      if(id&&nu.indexOf(id)>=0)score+=70;
    }
    var similarity=tokenScore(name,goldenName);
    score+=Math.round(similarity*90);
    if(safeClosest(box,'.fp-v3-legacy-record'))score+=12;
    if(box.querySelector('a.t1002__addBtn[href="#addtofavorites"],a[href="#addtofavorites"]'))score+=18;
    return score;
  }

  function findSourceProduct(root,goldenProduct){
    var seed=readSeed();
    var goldenName=getName(goldenProduct)||norm(
      (root.querySelector('.v3-overview h2')||{}).textContent||
      (root.querySelector('#v3-tilda-product-name')||{}).textContent||''
    );
    var boxes=arr(document.querySelectorAll('.js-product')).filter(function(box){return !root.contains(box);});
    if(!boxes.length)return null;
    boxes.sort(function(a,b){return scoreSource(b,root,seed,goldenName)-scoreSource(a,root,seed,goldenName);});
    var best=boxes[0];
    if(scoreSource(best,root,seed,goldenName)<20)return null;
    return best;
  }

  function copyProductIdentity(source,target){
    if(!source||!target)return;
    arr(source.attributes).forEach(function(a){
      if(/^data-product-/i.test(a.name) && str(a.value)) target.setAttribute(a.name,a.value);
    });
    var seed=readSeed();
    if(!target.getAttribute('data-product-url')){
      var fallback=(seed.page&&seed.page.productPath)||getProductUrl(source)||'';
      if(fallback)target.setAttribute('data-product-url',fallback);
    }
  }

  function photoUrl(root,goldenProduct,source){
    var img=(root&&root.querySelector('.v3-main-img'))||
      (source&&source.querySelector('.js-product-img'))||
      (goldenProduct&&goldenProduct.querySelector('.js-product-img'));
    if(!img)return '';
    return str(img.getAttribute('data-original')||img.getAttribute('data-src')||img.getAttribute('src')||'');
  }

  function ensureExpectedProductBits(root,goldenProduct,source){
    if(!goldenProduct)return null;
    copyProductIdentity(source,goldenProduct);

    var directImg=arr(goldenProduct.children).filter(function(n){return n.matches&&n.matches('.js-product-img');})[0]||null;
    if(directImg && !directImg.getAttribute('data-original')){
      var u=photoUrl(root,goldenProduct,source);
      if(u)directImg.setAttribute('data-original',u);
    }

    var wrap=goldenProduct.querySelector('.'+PROXY_WRAP_CLASS);
    if(!wrap){
      wrap=document.createElement('div');
      wrap.className='t1002__picture-wrapper '+PROXY_WRAP_CLASS;
      wrap.style.cssText='position:absolute!important;left:-10000px!important;top:0!important;width:1px!important;height:1px!important;overflow:hidden!important;opacity:0!important;pointer-events:none!important;';

      var img=document.createElement('img');
      img.className='js-product-img t-store__card__img fp-v3-wishlist-proxy-img';
      var u=photoUrl(root,goldenProduct,source);
      if(u){img.src=u;img.setAttribute('data-original',u);}
      img.alt='';
      wrap.appendChild(img);

      var a=document.createElement('a');
      a.href='#addtofavorites';
      a.className='t1002__addBtn '+PROXY_BTN_CLASS;
      a.setAttribute('aria-label','Add to favorites');
      a.setAttribute('tabindex','-1');
      var sourceBtn=source&&source.querySelector('a.t1002__addBtn[href="#addtofavorites"],a[href="#addtofavorites"]');
      if(sourceBtn && sourceBtn.innerHTML) a.innerHTML=sourceBtn.innerHTML;
      else a.innerHTML='<span aria-hidden="true">♡</span>';
      wrap.appendChild(a);
      goldenProduct.appendChild(wrap);
    }
    return wrap.querySelector('.'+PROXY_BTN_CLASS);
  }

  function nativeButtonFor(source){
    return source&&source.querySelector('a.t1002__addBtn[href="#addtofavorites"],a[href="#addtofavorites"]');
  }

  function triggerTildaBind(){
    try{
      if(window.jQuery && window.jQuery.fn){
        window.jQuery('body').trigger('twishlist_addbtn');
      }
    }catch(e){
      console.warn('[V3 Wishlist Bridge] Tilda bind trigger failed',e);
    }
  }

  function isActive(btn){return !!(btn&&btn.classList&&btn.classList.contains('t1002__addBtn_active'));}
  function setHeart(active){
    var root=getRoot();
    if(!root)return;
    arr(root.querySelectorAll('.v3-fav')).forEach(function(fav){
      fav.textContent=active?'♥':'♡';
      fav.classList.toggle('v3-fav-active',!!active);
      fav.setAttribute('aria-pressed',active?'true':'false');
      fav.setAttribute('aria-label',active?'Remove from wishlist':'Add to wishlist');
      fav.dataset.fpWishlistReady=state.ready?'1':'0';
    });
    state.lastActive=!!active;
  }

  function sameIdentity(a,b){
    if(!a||!b)return false;
    var au=getUid(a),bu=getUid(b);
    if(au&&bu)return au===bu;
    var aa=norm(getProductUrl(a)),bb=norm(getProductUrl(b));
    return !!(aa&&bb&&aa===bb);
  }

  function findAllNativeButtons(root,source,goldenProduct,proxy){
    var out=[];
    function push(x){if(x&&out.indexOf(x)<0)out.push(x);}
    push(proxy);
    push(nativeButtonFor(source));
    arr(document.querySelectorAll('a.t1002__addBtn[href="#addtofavorites"],a[href="#addtofavorites"]')).forEach(function(btn){
      var box=safeClosest(btn,'.js-product');
      if(box && (box===goldenProduct || box===source || sameIdentity(box,source))) push(btn);
    });
    return out;
  }

  function syncState(){
    var root=getRoot();if(!root)return;
    var goldenProduct=getGoldenProduct(root);
    var source=state.sourceProduct&&document.documentElement.contains(state.sourceProduct)?state.sourceProduct:findSourceProduct(root,goldenProduct);
    var proxy=goldenProduct&&goldenProduct.querySelector('.'+PROXY_BTN_CLASS);
    var buttons=findAllNativeButtons(root,source,goldenProduct,proxy);
    var active=buttons.some(isActive);
    setHeart(active);
  }

  function observeNativeButtons(buttons){
    if(!window.MutationObserver)return;
    if(state.syncObserver){state.syncObserver.disconnect();state.syncObserver=null;}
    state.syncObserved=buttons.slice();
    state.syncObserver=new MutationObserver(function(){setTimeout(syncState,0);});
    buttons.forEach(function(btn){
      try{state.syncObserver.observe(btn,{attributes:true,attributeFilter:['class']});}catch(e){}
    });
  }

  function publishState(){
    window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V1_STATE__={
      version:VERSION,
      ready:state.ready,
      repairs:state.repairs,
      sourceUid:state.sourceUid,
      sourceUrl:state.sourceUrl,
      active:state.lastActive,
      hasRoot:!!state.root,
      hasGoldenProduct:!!state.goldenProduct,
      hasSourceProduct:!!state.sourceProduct,
      hasProxyButton:!!state.proxyButton,
      hasSourceButton:!!state.sourceButton
    };
  }

  function repair(){
    state.repairs++;
    var root=getRoot();
    if(!root){state.ready=false;publishState();return false;}
    var goldenProduct=getGoldenProduct(root);
    if(!goldenProduct){state.ready=false;publishState();return false;}

    var source=findSourceProduct(root,goldenProduct);
    if(!source){
      state.root=root;state.goldenProduct=goldenProduct;state.sourceProduct=null;state.sourceButton=null;state.proxyButton=null;state.sourceUid='';state.sourceUrl='';state.ready=false;
      setHeart(false);publishState();return false;
    }

    var proxy=ensureExpectedProductBits(root,goldenProduct,source);
    var sourceBtn=nativeButtonFor(source);

    state.root=root;
    state.goldenProduct=goldenProduct;
    state.sourceProduct=source;
    state.sourceButton=sourceBtn;
    state.proxyButton=proxy;
    state.sourceUid=getUid(source);
    state.sourceUrl=getProductUrl(source);
    state.ready=!!(proxy||sourceBtn);

    triggerTildaBind();
    setTimeout(triggerTildaBind,80);
    setTimeout(triggerTildaBind,280);

    var buttons=findAllNativeButtons(root,source,goldenProduct,proxy);
    observeNativeButtons(buttons);
    setTimeout(syncState,0);
    setTimeout(syncState,120);
    setTimeout(syncState,500);
    publishState();

    if(state.ready && !root.dataset.fpWishlistBridgeReady){
      root.dataset.fpWishlistBridgeReady='1';
      console.info('[V3 Wishlist Bridge] READY',{
        version:VERSION,
        uid:state.sourceUid||'(no uid)',
        url:state.sourceUrl||'(no url)',
        sourceButton:!!sourceBtn,
        proxyButton:!!proxy
      });
    }
    return state.ready;
  }

  function proxyClick(){
    repair();
    var target=state.proxyButton||state.sourceButton;
    if(!target){
      console.warn('[V3 Wishlist Bridge] native Tilda favorite control not found');
      return false;
    }
    try{
      target.click();
      [0,60,180,500].forEach(function(ms){setTimeout(syncState,ms);});
      return true;
    }catch(e){
      console.error('[V3 Wishlist Bridge] native favorite click failed',e);
      return false;
    }
  }

  // Capture phase is intentional: the frozen Golden runtime currently has a
  // local-only ♡/♥ click handler. Stop it before it reaches the target and
  // route the action into Tilda ST110 instead.
  document.addEventListener('click',function(ev){
    var fav=safeClosest(ev.target,'#'+ROOT_ID+' .v3-fav');
    if(!fav)return;
    ev.preventDefault();
    ev.stopPropagation();
    if(typeof ev.stopImmediatePropagation==='function')ev.stopImmediatePropagation();
    proxyClick();
  },true);

  // Any native favorite action (including removal from the ST110 widget)
  // can change the shared state. Re-read native button classes afterwards.
  document.addEventListener('click',function(ev){
    var t=safeClosest(ev.target,'.t1002__addBtn,[href="#addtofavorites"],[href="#showfavorites"],.t1002');
    if(t)setTimeout(syncState,100);
  },false);

  window.addEventListener('storage',function(){setTimeout(syncState,0);});
  window.addEventListener('pageshow',function(){setTimeout(repair,0);});

  var repairTimer=null;
  function scheduleRepair(){
    if(repairTimer)return;
    repairTimer=setTimeout(function(){repairTimer=null;repair();},40);
  }
  if(window.MutationObserver){
    state.observer=new MutationObserver(function(muts){
      var relevant=muts.some(function(m){
        if(m.type!=='childList')return false;
        return arr(m.addedNodes).concat(arr(m.removedNodes)).some(function(n){
          if(!n||n.nodeType!==1)return false;
          return n.id===ROOT_ID ||
            (n.matches&&n.matches('.js-product,.t1002__addBtn')) ||
            (n.querySelector&&n.querySelector('#'+ROOT_ID+',.js-product,.t1002__addBtn'));
        });
      });
      if(relevant)scheduleRepair();
    });
    try{state.observer.observe(document.documentElement,{childList:true,subtree:true});}catch(e){}
  }

  REPAIR_DELAYS.forEach(function(ms){setTimeout(repair,ms);});
})();
