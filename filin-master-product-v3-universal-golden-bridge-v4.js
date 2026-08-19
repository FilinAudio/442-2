/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 UNIVERSAL GOLDEN BRIDGE V4
   GOLDEN-CANDIDATE migration layer

   Purpose:
   - build unknown products from #product-data + Rich Catalog + same-page legacy source
   - preserve real product tabs/options instead of inventing a minimal shell
   - keep frozen Golden V3.3.2 and Registry V1 untouched during validation
   - render Description / Specification / Options / Reviews
   - inject actual option controls above BUY NOW
   - keep cart identity and displayed totals synchronized
   - prevent copied Quadron/Grand Tower hero flash without blanking the full page
   ============================================================ */
(function(){
  'use strict';

  if(window.__FILIN_MASTER_PRODUCT_V3_UNIVERSAL_GOLDEN_BRIDGE_V4__) return;
  window.__FILIN_MASTER_PRODUCT_V3_UNIVERSAL_GOLDEN_BRIDGE_V4__=true;

  var VERSION='4.0.0';
  var ROOT_ID='filin-master-product-v3';
  var STYLE_ID='filin-master-product-v3-universal-v4-style';
  var WAIT_CLASS='fp-v4-wait';
  var READY_CLASS='fp-v4-ready';
  var SEED_KEY='__FILIN_MASTER_PRODUCT_V3_UNIVERSAL_V4_SEED__';
  var state={tries:0,sourceLoaded:false,legacy:null,profile:null,observer:null};

  function str(v){return String(v==null?'':v).trim();}
  function num(v){var n=Number(v);return Number.isFinite(n)?n:0;}
  function esc(v){return str(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
  function firstText(){for(var i=0;i<arguments.length;i++){var s=str(arguments[i]);if(s)return s;}return '';}
  function money(v,c){var n=num(v),code=firstText(c,'USD');try{return new Intl.NumberFormat('en-US',{style:'currency',currency:code,maximumFractionDigits:0}).format(n);}catch(e){return '$'+n.toLocaleString('en-US');}}

  function installStyle(){
    if(document.getElementById(STYLE_ID))return;
    var s=document.createElement('style');s.id=STYLE_ID;
    s.textContent='html.'+WAIT_CLASS+' .t-cover{visibility:hidden!important}'+
      'html.'+READY_CLASS+' .t-cover{visibility:visible!important}'+
      '#'+ROOT_ID+' .fpv4-options{margin:0 0 18px;padding:18px 20px;border:1px solid rgba(31,27,23,.16);border-radius:8px;background:#fffdfa;font-family:Montserrat,Arial,sans-serif}'+
      '#'+ROOT_ID+' .fpv4-option-row{display:grid;gap:8px;margin:0 0 14px}'+
      '#'+ROOT_ID+' .fpv4-option-label{font-weight:750;font-size:15px}'+
      '#'+ROOT_ID+' .fpv4-select{width:100%;min-height:48px;padding:0 12px;border:1px solid #999;background:#fff;font:500 16px/1.2 Montserrat,Arial,sans-serif}'+
      '#'+ROOT_ID+' .fpv4-check{display:flex;align-items:flex-start;gap:10px;font-size:15px;line-height:1.4;cursor:pointer}'+
      '#'+ROOT_ID+' .fpv4-check input{width:20px;height:20px;margin:1px 0 0;flex:0 0 auto}'+
      '#'+ROOT_ID+' .fpv4-total{margin-top:10px;font-weight:800;font-size:20px}'+
      '#'+ROOT_ID+' .fpv4-specs{width:100%;border-collapse:collapse}'+
      '#'+ROOT_ID+' .fpv4-specs td{padding:12px 10px;border-bottom:1px solid rgba(0,0,0,.09);vertical-align:top}'+
      '#'+ROOT_ID+' .fpv4-specs td:first-child{width:31%;font-weight:750}'+
      '#'+ROOT_ID+' .fpv4-desc h2,#'+ROOT_ID+' .fpv4-desc h3,#'+ROOT_ID+' .fpv4-desc h4{margin-top:1.25em}'+
      '#'+ROOT_ID+' .v3-panel-inner .fpv4-options-tab{display:grid;gap:12px}'+
      '#'+ROOT_ID+' .v3-panel-inner .fpv4-options-tab .fpv4-opt-note{padding:14px 16px;border:1px solid rgba(0,0,0,.1);border-radius:6px;background:#fffdfa}'+
      '@media(max-width:820px){#'+ROOT_ID+' .fpv4-options{padding:14px;margin-bottom:14px}#'+ROOT_ID+' .fpv4-specs td{display:block;width:100%!important;padding:8px 4px}#'+ROOT_ID+' .fpv4-specs td:first-child{padding-top:15px;border-bottom:0}}';
    (document.head||document.documentElement).appendChild(s);
  }
  installStyle();
  document.documentElement.classList.add(WAIT_CLASS);

  function captureSeed(){
    if(window[SEED_KEY])return window[SEED_KEY];
    var el=document.getElementById('product-data');if(!el)return null;
    try{
      var d=JSON.parse(el.textContent||'{}');
      if(!d||!d.slug)return null;
      window[SEED_KEY]=JSON.parse(JSON.stringify(d));
      console.info('[Master Product V3 Universal V4] SEED CAPTURED',{version:VERSION,slug:d.slug});
      return window[SEED_KEY];
    }catch(e){console.warn('[Master Product V3 Universal V4] seed parse failed',e);return null;}
  }

  function normalizePath(v){var s=str(v);if(!s)return '';try{return new URL(s,location.origin).pathname.replace(/^\/+|\/+$/g,'');}catch(e){return s.replace(/^https?:\/\/[^/]+/i,'').replace(/^\/+|\/+$/g,'');}}
  function findRich(seed){
    var data=window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products;if(!data)return null;
    var slug=str(seed.slug),id=str(seed.id),path=normalizePath(seed.page&&seed.page.productPath);
    if(slug&&data[slug])return data[slug];
    var ks=Object.keys(data);for(var i=0;i<ks.length;i++){var p=data[ks[i]];if(!p)continue;if(id&&str(p.id)===id)return p;if(slug&&str(p.slug)===slug)return p;if(path&&normalizePath(p.url||p.path||p.productPath)===path)return p;}
    return null;
  }

  function sourceUrl(seed,rich){return firstText(seed&&seed.page&&seed.page.legacySourcePath,seed&&seed.page&&seed.page.productPath,rich&&rich.url);}
  function normalizeImage(v){var u=str(v).replace(/&amp;/g,'&');if(!u||/^data:/i.test(u))return '';try{u=new URL(u,location.origin).href;}catch(e){}return u;}
  function collectLegacyImages(doc){
    var out=[],seen=Object.create(null),attrs=['src','srcset','data-original','data-src','data-lazy-src','data-img-zoom-url','data-bg','data-bg-img','data-original-src','data-content-cover-bg'];
    doc.querySelectorAll('*').forEach(function(el){
      attrs.forEach(function(a){
        if(!el.hasAttribute||!el.hasAttribute(a))return;
        var raw=el.getAttribute(a)||'';
        raw.split(',').forEach(function(part){var cand=part.trim().split(/\s+/)[0];var u=normalizeImage(cand);if(!u||seen[u])return;if(!/tildacdn\.com/i.test(u))return;if(/(?:blank\.gif|empty\.png|favicon|icon-|tildacopy)/i.test(u))return;seen[u]=1;out.push(u);});
      });
      var style=el.getAttribute&&el.getAttribute('style');if(style){var m=style.match(/https?:\/\/[^)"'\s]+/g)||[];m.forEach(function(x){var u=normalizeImage(x);if(u&&!seen[u]&&/tildacdn\.com/i.test(u)){seen[u]=1;out.push(u);}});}
    });
    return out;
  }

  function sanitizeNode(node){
    if(!node)return '';
    var clone=node.cloneNode(true);
    clone.querySelectorAll('script,style,iframe,form,button,input,select,textarea').forEach(function(n){n.remove();});
    clone.querySelectorAll('*').forEach(function(el){Array.prototype.slice.call(el.attributes||[]).forEach(function(a){if(/^on/i.test(a.name))el.removeAttribute(a.name);});});
    return clone.innerHTML;
  }
  function findLegacyPanel(doc,kind){
    if(!doc)return null;
    var selectors=kind==='spec'?['#spec.tab-content','.tab-content#spec','[data-tab-content="spec"]','.specification','.specs-table']:['#desc.tab-content','.tab-content#desc','[data-tab-content="desc"]','.description-content','.product-description'];
    for(var i=0;i<selectors.length;i++){var n=doc.querySelector(selectors[i]);if(n)return n.closest('.tab-content')||n;}
    return null;
  }
  function extractLegacyOptions(doc){
    var result={select:null,fastTrack:null};if(!doc)return result;
    var selects=Array.prototype.slice.call(doc.querySelectorAll('select'));
    for(var i=0;i<selects.length;i++){
      var sel=selects[i],labels=Array.prototype.slice.call(sel.options||[]).map(function(o){return str(o.textContent);});
      if(labels.some(function(x){return /plating/i.test(x);})){result.select={label:'Select Model (Set of 4)',choices:labels.filter(Boolean).map(function(label,idx){var o=sel.options[idx];return {label:label,delta:num(o&&o.getAttribute&&o.getAttribute('data-price'))};})};break;}
    }
    var inputs=Array.prototype.slice.call(doc.querySelectorAll('input[type="checkbox"]'));
    inputs.some(function(inp){var lab=inp.closest('label'),text=str(lab?lab.textContent:(inp.parentElement&&inp.parentElement.textContent));if(/fast[-\s]?track|priority assembly/i.test(text)){var pct=0,m=text.match(/\+?\s*(\d+(?:\.\d+)?)\s*%/);if(m)pct=num(m[1]);result.fastTrack={label:text||'Fast-track production',percent:pct||50};return true;}return false;});
    return result;
  }

  function fetchLegacy(seed,rich,done){
    if(state.sourceLoaded){done(state.legacy);return;}
    state.sourceLoaded=true;
    var url=sourceUrl(seed,rich);if(!url){state.legacy={};done(state.legacy);return;}
    fetch(url,{credentials:'same-origin',cache:'no-store'})
      .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();})
      .then(function(html){
        var doc=new DOMParser().parseFromString(html,'text/html'),desc=findLegacyPanel(doc,'desc'),spec=findLegacyPanel(doc,'spec');
        state.legacy={url:url,images:collectLegacyImages(doc),descHTML:sanitizeNode(desc),specHTML:sanitizeNode(spec),options:extractLegacyOptions(doc)};
        console.info('[Master Product V3 Universal V4] LEGACY SOURCE PARSED',{url:url,images:state.legacy.images.length,description:!!state.legacy.descHTML,specification:!!state.legacy.specHTML,options:!!(state.legacy.options&&(state.legacy.options.select||state.legacy.options.fastTrack))});
        done(state.legacy);
      })
      .catch(function(err){console.warn('[Master Product V3 Universal V4] LEGACY SOURCE FAILED',url,err);state.legacy={url:url,images:[],descHTML:'',specHTML:'',options:{}};done(state.legacy);});
  }

  function mergeImages(seed,rich,legacy){
    var raw=[];function add(v){if(!v)return;if(Array.isArray(v)){v.forEach(add);return;}if(typeof v==='object')add(v.url||v.src||v.image);else raw.push(v);}
    add(rich&&rich.images);add(seed&&seed.images);add(seed&&seed.galleryImages);add(legacy&&legacy.images);
    var out=[],seen=Object.create(null);raw.forEach(function(x){var u=normalizeImage(x);if(!u||seen[u])return;seen[u]=1;out.push(u);});return out;
  }
  function conciseName(seed,rich){var brand=firstText(seed&&seed.brand,rich&&rich.brand),model=firstText(seed&&seed.model,rich&&rich.model),display=firstText([brand,model].filter(Boolean).join(' '),seed&&seed.name,rich&&rich.name,str(seed&&seed.slug).replace(/_/g,' '));return {brand:brand,model:model,display:display,sticky:firstText(model,display)};}
  function specTable(rich){var rows=(rich&&rich.specRows)||[];if(!rows.length)return '<p>Specifications are being prepared.</p>';return '<table class="fpv4-specs"><tbody>'+rows.map(function(r){return '<tr><td>'+esc(r&&r[0])+'</td><td>'+String(r&&r[1]||'')+'</td></tr>';}).join('')+'</tbody></table>';}
  function defaultDescription(rich,name){return '<div class="fpv4-desc"><p>'+esc(firstText(rich&&rich.description,name))+'</p></div>';}
  function normalizeLegacyDesc(html){return html?'<div class="fpv4-desc">'+html+'</div>':'';}

  function deriveOptions(seed,rich,legacy){
    var o=(legacy&&legacy.options)||{},result={select:o.select||null,fastTrack:o.fastTrack||null};
    if(!result.select){
      var rows=(rich&&rich.specRows)||[];
      rows.some(function(r){
        if(!r||!/Available Plating Options/i.test(str(r[0])))return false;
        var values=str(r[1]).split('/').map(function(x){return x.trim();}).filter(Boolean);
        if(values.length){result.select={label:'Select Model (Set of 4)',choices:values.map(function(v){return {label:(/^None\b/i.test(v)?'No plating':v.replace(/-Plated/ig,' plating').replace(/\(Raw Copper\)/i,'').trim()),delta:0};})};return true;}
        return false;
      });
    }
    if(!result.fastTrack)result.fastTrack={label:'Fast-track production (+50% of retail price)',percent:50};
    return result;
  }
  function optionsTabHTML(options){
    var bits=[];
    if(options.select)bits.push('<div class="fpv4-opt-note"><strong>'+esc(options.select.label)+'</strong><br>'+options.select.choices.map(function(x){return esc(x.label);}).join(' · ')+'</div>');
    if(options.fastTrack)bits.push('<div class="fpv4-opt-note"><strong>Priority production</strong><br>'+esc(options.fastTrack.label)+'</div>');
    return '<div class="fpv4-options-tab">'+bits.join('')+'</div>';
  }
  function tabsHTML(descHTML,specHTML,options){
    var tabs=[{id:'desc',label:'Description',html:descHTML},{id:'spec',label:'Specification',html:specHTML},{id:'options',label:'Options',html:optionsTabHTML(options)}];
    return '<div class="tabs-wrapper"><div class="tabs-header">'+tabs.map(function(t,i){return '<button class="tab-btn'+(i===0?' active':'')+'" type="button" onclick="showTab(event, \''+t.id+'\')">'+esc(t.label)+'</button>';}).join('')+'</div>'+tabs.map(function(t,i){return '<div class="tab-content" id="'+t.id+'"'+(i?' style="display:none;"':'')+'><div class="content-container">'+t.html+'</div></div>';}).join('')+'</div>';
  }
  function curation(seed,rich,name,price,currency){var cat=((rich&&rich.categories&&rich.categories[0])||seed.category||'Product');return [{title:'Category & Price',html:'<strong>'+esc(cat)+'</strong><br>'+esc(money(price,currency))},{title:'Brand & Model',html:'<strong>'+esc(name.brand||'Demograf Audio')+'</strong><br>'+esc(name.model||name.display)},{title:'Product Focus',html:esc(firstText(rich&&rich.description,name.display))},{title:'Curator’s Choice',html:'Personally selected & curated by Filin Labs Kazakhstan.'}];}

  function buildProfile(seed,rich,legacy){
    var name=conciseName(seed,rich),currency=firstText(seed.commerce&&seed.commerce.currency,rich&&rich.currency,'USD'),price=num(seed.commerce&&seed.commerce.regularPrice)||num(rich&&rich.price),imgs=mergeImages(seed,rich,legacy),options=deriveOptions(seed,rich,legacy);
    var desc=legacy&&legacy.descHTML?normalizeLegacyDesc(legacy.descHTML):defaultDescription(rich,name.display),spec=legacy&&legacy.specHTML?legacy.specHTML:specTable(rich);
    var p={
      schemaVersion:3,slug:str(seed.slug),id:firstText(seed.id,rich&&rich.id,str(seed.slug).replace(/_/g,'-')),category:firstText(seed.category,(rich&&rich.categories&&rich.categories[0]),'other'),currency:currency,
      hero:{staticH1:name.display,description:firstText(rich&&rich.description,name.display),background:imgs[0]||''},
      curator:'Personally selected & curated by Filin Labs Kazakhstan.',
      overview:{title:name.display,html:'<p>'+esc(firstText(rich&&rich.description,name.display))+'</p>',galleryImages:imgs},
      curation:curation(seed,rich,name,price,currency),
      commerce:{basePrice:price,displayName:name.display,cartName:name.display,stickyTitle:name.sticky,innerHTML:'<div class="purchase-container"><span class="js-product-name" id="tilda-product-name" style="display:none;">'+esc(name.display)+'</span><div class="price-title">Total*: $<span class="js-product-price" id="main-price">'+price+'</span></div><a class="buy-btn js-product-btn" href="#order">Buy Now</a></div>'+tabsHTML(desc,spec,options)},
      reviewsCTA:'View The Reviews of '+name.display,reviewsQuery:name.display,reviewsIntro:'Share your listening experience with '+name.display+'.',
      golden:{backLabel:"Back to the Filin's nest",backHref:'/',mobileHeroHeight:860,resultLabel:'Ultimate Synergy'},
      reviewsKey:firstText(seed.reviews&&seed.reviews.key,str(seed.slug).replace(/_/g,'-')),
      universalV4:{options:options,rich:rich||null,legacyUrl:legacy&&legacy.url||''}
    };
    return p;
  }

  function isStickyLeaf(el){if(!el||el.children.length)return false;var p=el;for(var i=0;i<7&&p;i++,p=p.parentElement){try{var pos=getComputedStyle(p).position;if(pos==='fixed'||pos==='sticky')return true;}catch(e){}}return false;}
  function syncSticky(p,total){
    var title=str(p.commerce.stickyTitle||p.commerce.displayName);
    Array.prototype.slice.call(document.querySelectorAll('body *')).forEach(function(el){
      if(!isStickyLeaf(el))return;var t=str(el.textContent);if(!t||t.length>240)return;
      if((/Quadron|Grand Tower|Solid Copper Speaker Connectors|Binding Posts/i.test(t))&&!/BUY NOW/i.test(t)&&!/^\$/.test(t))el.textContent=title;
      else if(/^\$?[\d,]+$/.test(t)&&num(t.replace(/[$,]/g,''))>0)el.textContent=money(total,p.currency);
    });
  }
  function selectedSuffix(root){var s=root.querySelector('.fpv4-select');return s&&s.value?' — '+s.value:'';}
  function currentTotal(p,root){var total=num(p.commerce.basePrice),s=root.querySelector('.fpv4-select');if(s&&s.selectedOptions&&s.selectedOptions[0])total+=num(s.selectedOptions[0].getAttribute('data-delta'));var f=root.querySelector('.fpv4-fast');if(f&&f.checked)total+=Math.round(num(p.commerce.basePrice)*(num(f.getAttribute('data-percent'))||50)/100);return total;}

  function injectOptions(p){
    var root=document.getElementById(ROOT_ID);if(!root)return false;var holder=root.querySelector('.v3-js-product');if(!holder)return false;
    var old=holder.querySelector('.fpv4-options');if(old)old.remove();var options=p.universalV4&&p.universalV4.options;if(!options)return false;
    var box=document.createElement('div');box.className='fpv4-options';var html='';
    if(options.select&&options.select.choices&&options.select.choices.length)html+='<div class="fpv4-option-row"><label class="fpv4-option-label">'+esc(options.select.label)+'</label><select class="fpv4-select">'+options.select.choices.map(function(c){return '<option value="'+esc(c.label)+'" data-delta="'+num(c.delta)+'">'+esc(c.label)+'</option>';}).join('')+'</select></div>';
    if(options.fastTrack)html+='<div class="fpv4-option-row"><label class="fpv4-check"><input class="fpv4-fast" type="checkbox" data-percent="'+num(options.fastTrack.percent||50)+'"><span>'+esc(options.fastTrack.label)+'</span></label></div>';
    html+='<div class="fpv4-total">Total: <span class="fpv4-total-value">'+money(p.commerce.basePrice,p.currency)+'</span></div>';box.innerHTML=html;
    var buy=holder.querySelector('.v3-buy');holder.insertBefore(box,buy||holder.firstChild);
    function recalc(){
      var total=currentTotal(p,root),suffix=selectedSuffix(root),nativePrice=root.querySelector('#v3-main-price'),buyPrice=root.querySelector('.v3-buy-price'),hiddenName=root.querySelector('#v3-tilda-product-name'),totalNode=root.querySelector('.fpv4-total-value');
      if(nativePrice)nativePrice.textContent=String(total);if(buyPrice)buyPrice.textContent=money(total,p.currency);if(hiddenName)hiddenName.textContent=p.commerce.cartName+suffix;if(totalNode)totalNode.textContent=money(total,p.currency);syncSticky(p,total);
      console.info('[Master Product V3 Universal V4] OPTIONS SYNC',{total:total,selection:suffix});
    }
    box.addEventListener('change',recalc);recalc();return true;
  }

  function reveal(){document.documentElement.classList.remove(WAIT_CLASS);document.documentElement.classList.add(READY_CLASS);setTimeout(function(){document.documentElement.classList.remove(READY_CLASS);},250);}
  function mount(seed,rich,legacy){
    var api=window.FilinMasterProductV3;if(!api||!api.profiles||typeof api.apply!=='function')return false;
    var p=buildProfile(seed,rich,legacy);state.profile=p;api.profiles[p.slug]=p;
    console.info('[Master Product V3 Universal V4] UNIVERSAL PROFILE CREATED',{version:VERSION,slug:p.slug,name:p.commerce.displayName,price:p.commerce.basePrice,images:p.overview.galleryImages.length,tabs:['Description','Specification','Options','Reviews']});
    try{api.apply();}catch(e){console.error('[Master Product V3 Universal V4] APPLY FAILED',e);reveal();return true;}
    [0,120,450,1000,2200,4200].forEach(function(ms){setTimeout(function(){injectOptions(p);syncSticky(p,currentTotal(p,document.getElementById(ROOT_ID)||document));},ms);});
    if(window.MutationObserver){state.observer=new MutationObserver(function(){var root=document.getElementById(ROOT_ID);if(root&&!root.querySelector('.fpv4-options'))injectOptions(p);});state.observer.observe(document.documentElement,{childList:true,subtree:true});setTimeout(function(){if(state.observer){state.observer.disconnect();state.observer=null;}},10000);}
    reveal();return true;
  }
  function boot(){
    state.tries++;var seed=captureSeed();if(!seed)return false;var api=window.FilinMasterProductV3,rich=findRich(seed);if(!api||!api.profiles||typeof api.apply!=='function'||!window.FilinRichCatalogV2)return false;
    fetchLegacy(seed,rich,function(legacy){mount(seed,rich,legacy||{});});return true;
  }
  if(!boot()){var timer=setInterval(function(){if(boot()||state.tries>=160)clearInterval(timer);},50);}
  setTimeout(function(){if(document.documentElement.classList.contains(WAIT_CLASS)){console.warn('[Master Product V3 Universal V4] FAIL-OPEN REVEAL',{version:VERSION,tries:state.tries});reveal();}},4500);
})();
