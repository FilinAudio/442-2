/* ============================================================
   FILIN LABS — GOLDEN SPEAKERS FIXER V1
   Post-migration cleanup for Golden Reference speaker rollout.

   Fixes:
   - removes Tilda icon SVGs from product gallery/hero
   - restores all legacy curation rows (incl. icons/text)
   - keeps only real product imagery
   - reapplies Golden root once after cleanup
   - copies legacy data-* product attributes to Golden cart node
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_FIXER_V1__) return;
  window.__FILIN_GOLDEN_SPEAKERS_FIXER_V1__=true;

  var tries=0, MAX=180;

  function str(v){return String(v==null?'':v).trim();}
  function cleanText(v){return str(v).replace(/\s+/g,' ').trim();}
  function isBadImage(u){
    u=str(u);
    return !u || /\/lib\/icons\//i.test(u) || /\.svg(?:[?#]|$)/i.test(u) || /(?:favicon|logo|sprite|blank|pixel|tildacopy)/i.test(u);
  }
  function addUnique(out,seen,u){
    u=str(u); if(isBadImage(u)) return;
    var k=u.replace(/[?#].*$/,''); if(seen[k]) return;
    seen[k]=1; out.push(u);
  }
  function imageFrom(el){
    if(!el) return '';
    var attrs=['src','data-original','data-src','data-lazy-src','data-img-zoom-url','data-content-cover-bg'];
    for(var i=0;i<attrs.length;i++){
      var u=str(el.getAttribute&&el.getAttribute(attrs[i]));
      if(/^https?:\/\/(?:static|thb)\.tildacdn\.com\//i.test(u)) return u;
    }
    var bg='';
    try{bg=getComputedStyle(el).backgroundImage||'';}catch(e){}
    var m=bg.match(/url\(["']?([^"')]+)["']?\)/i);
    return m?m[1]:'';
  }
  function richFor(slug){
    var cat=window.FilinRichCatalogV2, ps=cat&&cat.products;
    return ps&&ps[slug] ? ps[slug] : null;
  }
  function collectRealImages(slug,p){
    var out=[],seen=Object.create(null),rich=richFor(slug);
    function add(v){
      if(Array.isArray(v)){v.forEach(add);return;}
      if(v&&typeof v==='object') v=v.url||v.src||v.original||v.image||'';
      addUnique(out,seen,v);
    }

    // Prefer catalog/product imagery first.
    if(rich){ add(rich.images); add(rich.galleryImages); add(rich.image); add(rich.cover); }

    // Preserve any already-collected non-icon images.
    if(p&&p.overview){ add(p.overview.galleryImages); }

    // Hero/source cover can be a valid product image.
    var cover=document.querySelector('.t-cover__carrier,[data-content-cover-bg]');
    if(cover) add(imageFrom(cover));

    // Collect large product-content raster images, never Tilda icon library SVGs.
    var nodes=document.querySelectorAll('#allrecords img,#allrecords [data-original],#allrecords [data-img-zoom-url],#allrecords [data-src]');
    Array.prototype.forEach.call(nodes,function(el){
      var u=imageFrom(el); if(isBadImage(u)) return;
      var r={width:0,height:0};
      try{r=el.getBoundingClientRect();}catch(e){}
      var nw=Number(el.naturalWidth||0), nh=Number(el.naturalHeight||0);
      if((r.width>=180&&r.height>=110)||(nw>=500&&nh>=300)) add(u);
    });

    return out.slice(0,18);
  }

  function captureLegacyCuration(){
    var root=document.querySelector('.fp-curation');
    if(!root) return [];
    var items=Array.prototype.slice.call(root.querySelectorAll('.fp-curation-item'));
    return items.map(function(x){
      var h=x.querySelector('h3');
      var copy=x.querySelector('.fp-curation-copy')||x;
      var icon=x.querySelector('.fp-curation-icon');
      var html='';
      Array.prototype.forEach.call(copy.children||[],function(n){
        if(n===h || n===icon || (n.classList&&n.classList.contains('fp-curation-icon'))) return;
        html+=n.outerHTML||'';
      });
      if(!html){
        var txt=cleanText(copy.textContent||'');
        var title=cleanText(h&&h.textContent||'');
        if(title&&txt.indexOf(title)===0) txt=txt.slice(title.length).trim();
        html=txt;
      }
      return {
        title: cleanText(h&&h.textContent||''),
        html: html,
        icon: icon ? icon.innerHTML : ''
      };
    }).filter(function(x){return x.title||cleanText(x.html);});
  }

  function copyProductDataAttrs(){
    var root=document.getElementById('filin-master-product-v3');
    if(!root) return;
    var dst=root.querySelector('.v3-js-product');
    if(!dst) return;
    var legacy=Array.prototype.slice.call(document.querySelectorAll('.js-product')).filter(function(x){return !x.closest('#filin-master-product-v3');})[0];
    if(!legacy) return;
    Array.prototype.forEach.call(legacy.attributes||[],function(a){
      if(/^data-/i.test(a.name) && !dst.hasAttribute(a.name)) dst.setAttribute(a.name,a.value);
    });
  }

  function installIconCSS(){
    if(document.getElementById('filin-golden-speakers-fixer-v1-style')) return;
    var s=document.createElement('style');
    s.id='filin-golden-speakers-fixer-v1-style';
    s.textContent='#filin-master-product-v3 .v3-curation-icon img{width:24px!important;height:24px!important;max-width:24px!important;max-height:24px!important;object-fit:contain!important;display:block!important}';
    (document.head||document.documentElement).appendChild(s);
  }

  function run(){
    tries++;
    var dataEl=document.getElementById('product-data');
    var api=window.FilinMasterProductV3;
    if(!dataEl||!api||!api.profiles||typeof api.apply!=='function') return false;
    var d={}; try{d=JSON.parse(dataEl.textContent||'{}');}catch(e){return false;}
    var slug=str(d.slug),p=api.profiles[slug]; if(!slug||!p) return false;

    var imgs=collectRealImages(slug,p);
    if(imgs.length){
      p.overview=p.overview||{};
      p.overview.galleryImages=imgs;
      p.hero=p.hero||{};
      p.hero.background=imgs[0];
    }

    var cur=captureLegacyCuration();
    if(cur.length) p.curation=cur;

    installIconCSS();
    try{api.apply();}catch(e){console.error('[Golden Speakers Fixer V1] reapply failed',e);return true;}
    copyProductDataAttrs();

    window.__FILIN_GOLDEN_SPEAKERS_FIXER_V1_STATE__={
      slug:slug,
      images:imgs.length,
      curation:cur.length,
      goldenRoots:document.querySelectorAll('#filin-master-product-v3').length
    };
    console.info('[Golden Speakers Fixer V1] APPLIED',window.__FILIN_GOLDEN_SPEAKERS_FIXER_V1_STATE__);
    return true;
  }

  if(!run()){
    var t=setInterval(function(){if(run()||tries>=MAX)clearInterval(t);},50);
  }
})();
