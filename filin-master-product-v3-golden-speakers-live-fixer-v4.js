/* ============================================================
   FILIN LABS — GOLDEN SPEAKERS LIVE FIXER V4
   Uses the ORIGINAL live Tilda DOM (including quarantined records)
   instead of refetching/parsing the page source.

   Fixes the V5 failure where DOMParser/source fetch returned no
   usable T396 cluster even though the real live page still had it.

   V4:
   - finds the dominant live Tilda image record
   - excludes Golden root, menus, cart, promo/recommendation records
   - removes Tilda /-/resize/... previews and SVG/icon assets
   - prepends the protected live hero image when unique
   - preserves the already-restored 7 curation rows
   - reapplies Golden exactly once
   - publishes V2/V3-compatible state aliases for pre-paint release
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_LIVE_FIXER_V4__) return;
  window.__FILIN_GOLDEN_SPEAKERS_LIVE_FIXER_V4__=true;

  var tries=0, MAX=240;

  function str(v){return String(v==null?'':v).trim();}
  function norm(v){return str(v).replace(/\s+/g,' ').trim();}
  function normalizeImage(u){
    u=str(u);
    if(!u) return '';
    try{u=decodeURI(u);}catch(e){}
    if(/\/-\/resize\//i.test(u)) return '';
    return u;
  }
  function isBadImage(u){
    u=str(u);
    return !u || /\/lib\/icons\//i.test(u) || /\.svg(?:[?#]|$)/i.test(u) ||
      /(?:favicon|logo|sprite|blank|pixel|tildacopy|icon[-_])/i.test(u) ||
      /\/-\/resize\//i.test(u);
  }
  function add(out,seen,u){
    u=normalizeImage(u); if(isBadImage(u)) return;
    if(!/^https?:\/\/(?:static|thb)\.tildacdn\.com\//i.test(u)) return;
    var k=u.replace(/[?#].*$/,'');
    if(seen[k]) return;
    seen[k]=1; out.push(u);
  }
  function scanEl(el,out,seen){
    if(!el) return;
    ['data-original','data-img-zoom-url','src','data-src','data-lazy-src','data-content-cover-bg'].forEach(function(a){
      add(out,seen,el.getAttribute&&el.getAttribute(a));
    });
    var style='';
    try{style=str(el.getAttribute&&el.getAttribute('style'))+' '+str(getComputedStyle(el).backgroundImage);}catch(e){}
    var re=/url\(["']?([^"')]+)["']?\)/gi,m;
    while((m=re.exec(style))) add(out,seen,m[1]);
  }
  function recordImages(rec){
    var out=[],seen=Object.create(null);
    scanEl(rec,out,seen);
    Array.prototype.forEach.call(rec.querySelectorAll(
      'img,[data-original],[data-img-zoom-url],[data-src],[data-lazy-src],[data-content-cover-bg],[style]'
    ),function(el){scanEl(el,out,seen);});
    return out;
  }
  function excludedRecord(rec){
    if(!rec) return true;
    if(rec.querySelector&&rec.querySelector('#filin-master-product-v3')) return true;
    if(rec.closest&&rec.closest('header,footer')) return true;
    if(rec.querySelector&&rec.querySelector('.t-menuwidgeticons,.t228,.t450,.t706,.t1002')) return true;
    var text=norm(rec.textContent||'');
    if(/YOU MAY ALSO LIKE|RECOMMEND|RELATED PRODUCTS|PROMOTIONS|SPECIAL OFFERS/i.test(text)) return true;
    return false;
  }
  function bestCluster(){
    var best=null;
    Array.prototype.forEach.call(document.querySelectorAll('#allrecords .t-rec'),function(rec,index){
      if(excludedRecord(rec)) return;
      var imgs=recordImages(rec);
      if(imgs.length<2) return;
      var links=Array.prototype.filter.call(rec.querySelectorAll('a[href]'),function(a){
        var h=str(a.getAttribute('href'));
        return /^\//.test(h)||/^https?:\/\/filinlabs\.com\//i.test(h);
      }).length;
      var isT396=!!rec.querySelector('.t396__artboard');
      var score=imgs.length*100+(isT396?100:0)-links*20;
      var item={rec:rec,index:index,images:imgs,links:links,isT396:isT396,score:score};
      if(!best||item.score>best.score) best=item;
    });
    return best;
  }
  function heroImage(){
    var el=document.querySelector('.fp-v3-hero-cover,[data-content-cover-bg].fp-v3-hero-cover,.t-cover__carrier,[data-content-cover-bg]');
    if(!el) return '';
    var out=[],seen=Object.create(null);
    scanEl(el,out,seen);
    if(out.length) return out[0];
    var rec=el.closest('.t-rec');
    if(rec){
      out=recordImages(rec);
      if(out.length) return out[0];
    }
    return '';
  }
  function apply(){
    tries++;
    var dataEl=document.getElementById('product-data'),api=window.FilinMasterProductV3;
    if(!dataEl||!api||!api.profiles||typeof api.apply!=='function') return false;
    var d={}; try{d=JSON.parse(dataEl.textContent||'{}');}catch(e){return false;}
    var slug=str(d.slug),p=api.profiles[slug]; if(!slug||!p) return false;

    // Wait until the source fixer has restored all 7 curation rows.
    var curationState=window.__FILIN_GOLDEN_SPEAKERS_SOURCE_FIXER_V2_STATE__;
    if(!curationState || Number(curationState.curation||0)!==7) return false;

    var cluster=bestCluster();
    if(!cluster){
      console.warn('[Golden Live Fixer V4] no live product image cluster found');
      return false;
    }

    var images=[],seen=Object.create(null);
    add(images,seen,heroImage());
    cluster.images.forEach(function(u){add(images,seen,u);});

    if(images.length<2){
      console.warn('[Golden Live Fixer V4] live cluster too small',cluster);
      return false;
    }

    p.overview=p.overview||{};
    p.overview.galleryImages=images.slice(0,16);
    p.hero=p.hero||{};
    p.hero.background=images[0];

    api.apply();

    var state={
      slug:slug,
      images:images.length,
      clusterRecord:cluster.rec.id||'',
      clusterImages:cluster.images.length,
      curation:Number(curationState.curation||0),
      curationCards:document.querySelectorAll('#filin-master-product-v3 .v3-curation-item').length,
      badGalleryIcons:Array.prototype.filter.call(document.querySelectorAll('#filin-master-product-v3 .v3-gallery img'),function(img){return isBadImage(img.src);}).length,
      lowResPreviews:Array.prototype.filter.call(document.querySelectorAll('#filin-master-product-v3 .v3-gallery img'),function(img){return /\/-\/resize\//i.test(img.src);}).length,
      goldenRoots:document.querySelectorAll('#filin-master-product-v3').length
    };

    window.__FILIN_GOLDEN_SPEAKERS_LIVE_FIXER_V4_STATE__=state;
    window.__FILIN_GOLDEN_SPEAKERS_SOURCE_FIXER_V3_STATE__=state;
    window.__FILIN_GOLDEN_SPEAKERS_SOURCE_FIXER_V2_STATE__=state;
    console.info('[Golden Live Fixer V4] APPLIED',state);
    return true;
  }

  if(!apply()){
    var timer=setInterval(function(){
      if(apply()||tries>=MAX) clearInterval(timer);
    },50);
  }
})();
