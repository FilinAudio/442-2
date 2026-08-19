/* ============================================================
   FILIN LABS — GOLDEN SPEAKERS SOURCE FIXER V3
   Product-only gallery reconstruction + 7 curation rows.

   V3 changes:
   - picks the real T396 product-image cluster instead of stopping before curation
   - excludes menu/header/footer/cart/recommendation records
   - removes Tilda low-res /-/resize/... variants
   - keeps original raster URLs only
   - preserves all 7 curation rows from source HTML
   - keeps backward-compatible V2 state alias for existing pre-paint release code
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_SOURCE_FIXER_V3__) return;
  window.__FILIN_GOLDEN_SPEAKERS_SOURCE_FIXER_V3__=true;

  var tries=0, MAX=200;
  var LABELS=[
    {title:'CATHEGORY & BUDGET TIER',re:/(?:CATHEGORY|CATEGORY)\s*&\s*BUDGET\s*TIER/i},
    {title:'TAGS & FEATURES',re:/TAGS?\s*&\s*FEATURES/i},
    {title:'SONIC SIGNATURE',re:/SONIC\s*SIGNATURE/i},
    {title:"CURATOR’S CHOICE",re:/CURATOR[’']?S\s*CHOICE/i},
    {title:'HIGH TECHNOLOGIES',re:/HIGH\s*TECHNOLOGIES/i},
    {title:'SYNERGY MATCH',re:/SYNERGY\s*MATCH/i},
    {title:'GENRES ACCORD',re:/GENRES?\s*ACCORD/i}
  ];

  function str(v){return String(v==null?'':v).trim();}
  function norm(v){return str(v).replace(/[\u2018\u2019]/g,"'").replace(/\s+/g,' ').trim();}
  function esc(v){return str(v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
  function isBadImage(u){
    u=str(u);
    return !u || /\/lib\/icons\//i.test(u) || /\.svg(?:[?#]|$)/i.test(u) || /(?:favicon|logo|sprite|blank|pixel|tildacopy|icon[-_])/i.test(u) || /\/-\/resize\//i.test(u);
  }
  function normalizeImage(u){
    u=str(u);
    if(!u) return '';
    try{u=decodeURI(u);}catch(e){}
    // Tilda low-res preview URLs must never enter the Golden gallery.
    if(/\/-\/resize\//i.test(u)) return '';
    return u;
  }
  function imageUrl(el){
    if(!el) return '';
    var attrs=['data-original','data-img-zoom-url','src','data-src','data-lazy-src','data-content-cover-bg'];
    for(var i=0;i<attrs.length;i++){
      var u=normalizeImage(el.getAttribute&&el.getAttribute(attrs[i]));
      if(/^https?:\/\/(?:static|thb)\.tildacdn\.com\//i.test(u) && !isBadImage(u)) return u;
    }
    var st=str(el.getAttribute&&el.getAttribute('style'));
    var m=st.match(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/i);
    var bg=normalizeImage(m&&m[1]);
    return /^https?:\/\/(?:static|thb)\.tildacdn\.com\//i.test(bg) && !isBadImage(bg) ? bg : '';
  }
  function add(out,seen,u){
    u=normalizeImage(u); if(isBadImage(u)) return;
    var k=u.replace(/[?#].*$/,''); if(seen[k]) return;
    seen[k]=1; out.push(u);
  }
  function richFor(slug){
    var cat=window.FilinRichCatalogV2, ps=cat&&cat.products;
    return ps&&ps[slug] ? ps[slug] : null;
  }

  function findHeading(doc,re){
    var nodes=Array.prototype.slice.call(doc.querySelectorAll('h1,h2,h3,h4,h5,h6,.t-title,.t-heading'));
    for(var i=0;i<nodes.length;i++){
      var t=norm(nodes[i].textContent);
      if(t.length<=100 && re.test(t)) return nodes[i];
    }
    nodes=Array.prototype.slice.call(doc.querySelectorAll('div,span,p'));
    for(var j=0;j<nodes.length;j++){
      var n=nodes[j]; if(n.children&&n.children.length>2) continue;
      var s=norm(n.textContent);
      if(s.length<=100 && re.test(s)) return n;
    }
    return null;
  }
  function countLabels(text){var n=0;LABELS.forEach(function(x){if(x.re.test(text))n++;});return n;}
  function smallestCard(h){
    if(!h) return null;
    var best=h.parentElement||h,cur=best;
    for(var i=0;i<7&&cur&&cur.tagName!=='BODY';i++,cur=cur.parentElement){
      var txt=norm(cur.textContent),labels=countLabels(txt);
      if(labels===1&&txt.length<=1800)best=cur;
      if(labels>1||txt.length>3500)break;
    }
    return best;
  }
  function cardValue(card,h,labelRe){
    if(!card)return '';
    var pieces=[];
    Array.prototype.slice.call(card.querySelectorAll('p,li')).forEach(function(n){
      var t=norm(n.textContent);if(!t||labelRe.test(t))return;
      if(pieces.indexOf(t)<0)pieces.push(t);
    });
    if(!pieces.length){var txt=norm(card.textContent).replace(labelRe,'').trim();if(txt)pieces=[txt];}
    return pieces.map(esc).join('<br>');
  }
  function curationFromSource(doc){
    var out=[];
    LABELS.forEach(function(def){
      var h=findHeading(doc,def.re),card=smallestCard(h),html=cardValue(card,h,def.re);
      if(h&&html)out.push({title:def.title,html:html});
    });
    return out;
  }

  function recordImages(rec){
    var out=[],seen=Object.create(null);
    if(!rec)return out;
    var nodes=[rec].concat(Array.prototype.slice.call(rec.querySelectorAll('img,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[data-content-cover-bg],[style]')));
    nodes.forEach(function(el){add(out,seen,imageUrl(el));});
    return out;
  }
  function productClusterFromSource(doc){
    var best=null;
    Array.prototype.slice.call(doc.querySelectorAll('#allrecords .t-rec')).forEach(function(rec,index){
      if(rec.closest&&rec.closest('header,footer'))return;
      if(rec.querySelector&&rec.querySelector('.t-menuwidgeticons,.t228,.t450,.t706,.t1002'))return;
      var text=norm(rec.textContent||'');
      if(/YOU MAY ALSO LIKE|RECOMMEND|RELATED PRODUCTS|PROMOTIONS|SPECIAL OFFERS/i.test(text))return;
      var imgs=recordImages(rec);
      if(imgs.length<2)return;
      var links=Array.prototype.slice.call(rec.querySelectorAll('a[href]')).filter(function(a){
        var h=str(a.getAttribute('href'));return /^\//.test(h)||/^https?:\/\/filinlabs\.com\//i.test(h);
      }).length;
      var isT396=!!rec.querySelector('.t396__artboard');
      var score=imgs.length*100+(isT396?80:0)-links*15;
      var item={rec:rec,index:index,images:imgs,score:score,links:links,isT396:isT396};
      if(!best||item.score>best.score)best=item;
    });
    return best;
  }
  function galleryFromSource(doc,slug){
    var out=[],seen=Object.create(null),rich=richFor(slug);
    var hero=doc.querySelector('.t-cover__carrier,[data-content-cover-bg]');
    var heroUrl=imageUrl(hero);add(out,seen,heroUrl);

    var cluster=productClusterFromSource(doc);
    if(cluster)cluster.images.forEach(function(u){add(out,seen,u);});

    // Safe fallback only if source gallery was too small.
    if(out.length<2&&rich){
      (rich.images||[]).forEach(function(u){add(out,seen,u);});
      add(out,seen,rich.image);add(out,seen,rich.cover);
    }
    return {images:out.slice(0,16),hero:heroUrl,cluster:cluster};
  }

  function installCSS(){
    if(document.getElementById('filin-golden-source-fixer-v3-style'))return;
    var s=document.createElement('style');s.id='filin-golden-source-fixer-v3-style';
    s.textContent='#filin-master-product-v3 .v3-curation{grid-template-columns:repeat(4,minmax(0,1fr))!important}'+
      '@media(max-width:820px){#filin-master-product-v3 .v3-curation{display:block!important}#filin-master-product-v3 .v3-curation-item{border-right:0!important;border-bottom:1px solid #e2d8cd!important}}';
    (document.head||document.documentElement).appendChild(s);
  }

  function applySource(doc){
    var dataEl=document.getElementById('product-data'),api=window.FilinMasterProductV3;
    if(!dataEl||!api||!api.profiles||typeof api.apply!=='function')return false;
    var d={};try{d=JSON.parse(dataEl.textContent||'{}');}catch(e){return false;}
    var slug=str(d.slug),p=api.profiles[slug];if(!slug||!p)return false;

    var g=galleryFromSource(doc,slug);
    if(g.images.length){
      p.overview=p.overview||{};p.overview.galleryImages=g.images;
      p.hero=p.hero||{};p.hero.background=g.hero||g.images[0];
    }
    var cur=curationFromSource(doc);
    if(cur.length===7)p.curation=cur;else console.warn('[Golden Source Fixer V3] expected 7 curation rows, got',cur.length,cur);

    installCSS();api.apply();

    var state={
      slug:slug,
      images:g.images.length,
      clusterRecord:g.cluster&&g.cluster.rec&&g.cluster.rec.id||'',
      clusterImages:g.cluster&&g.cluster.images.length||0,
      curation:cur.length,
      curationCards:document.querySelectorAll('#filin-master-product-v3 .v3-curation-item').length,
      badGalleryIcons:Array.prototype.filter.call(document.querySelectorAll('#filin-master-product-v3 .v3-gallery img'),function(img){return isBadImage(img.src);}).length,
      goldenRoots:document.querySelectorAll('#filin-master-product-v3').length
    };
    window.__FILIN_GOLDEN_SPEAKERS_SOURCE_FIXER_V3_STATE__=state;
    // Backward-compatible alias so the already-installed pre-paint release guard keeps working.
    window.__FILIN_GOLDEN_SPEAKERS_SOURCE_FIXER_V2_STATE__=state;
    console.info('[Golden Source Fixer V3] APPLIED',state);
    return true;
  }

  function run(){
    tries++;
    var dataEl=document.getElementById('product-data'),api=window.FilinMasterProductV3;
    if(!dataEl||!api||!api.profiles)return false;
    var d={};try{d=JSON.parse(dataEl.textContent||'{}');}catch(e){return false;}
    if(!d.slug||!api.profiles[d.slug])return false;

    fetch(location.pathname+'?filin_golden_source_v3=1&ts='+Date.now(),{credentials:'same-origin',cache:'no-store'})
      .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();})
      .then(function(html){applySource(new DOMParser().parseFromString(html,'text/html'));})
      .catch(function(e){console.error('[Golden Source Fixer V3] SOURCE FETCH FAILED',e);});
    return true;
  }

  if(!run()){
    var t=setInterval(function(){if(run()||tries>=MAX)clearInterval(t);},50);
  }
})();
