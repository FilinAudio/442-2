/* ============================================================
   FILIN LABS — GOLDEN SPEAKERS SOURCE FIXER V2
   Reconstructs product-only gallery + all 7 curation rows
   from the server-rendered source page (same URL), not from
   already-transformed Golden DOM.
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_SOURCE_FIXER_V2__) return;
  window.__FILIN_GOLDEN_SPEAKERS_SOURCE_FIXER_V2__=true;

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
  function badImage(u){
    u=str(u);
    return !u || /\/lib\/icons\//i.test(u) || /\.svg(?:[?#]|$)/i.test(u) || /(?:favicon|logo|sprite|blank|pixel|tildacopy|icon[-_])/i.test(u);
  }
  function imageUrl(el){
    if(!el) return '';
    var attrs=['src','data-original','data-src','data-lazy-src','data-img-zoom-url','data-content-cover-bg'];
    for(var i=0;i<attrs.length;i++){
      var u=str(el.getAttribute&&el.getAttribute(attrs[i]));
      if(/^https?:\/\/(?:static|thb)\.tildacdn\.com\//i.test(u)) return u;
    }
    var st=str(el.getAttribute&&el.getAttribute('style'));
    var m=st.match(/background-image\s*:\s*url\(["']?([^"')]+)["']?\)/i);
    return m?m[1]:'';
  }
  function add(out,seen,u){
    u=str(u); if(badImage(u)) return;
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
    // fallback: leaf text nodes used by some Tilda blocks
    nodes=Array.prototype.slice.call(doc.querySelectorAll('div,span,p'));
    for(var j=0;j<nodes.length;j++){
      var n=nodes[j]; if(n.children&&n.children.length>2) continue;
      var s=norm(n.textContent);
      if(s.length<=100 && re.test(s)) return n;
    }
    return null;
  }
  function countLabels(text){
    var n=0; LABELS.forEach(function(x){if(x.re.test(text)) n++;}); return n;
  }
  function smallestCard(h){
    if(!h) return null;
    var best=h.parentElement||h, cur=best;
    for(var i=0;i<7 && cur && cur.tagName!=='BODY';i++,cur=cur.parentElement){
      var txt=norm(cur.textContent);
      var labels=countLabels(txt);
      if(labels===1 && txt.length<=1800) best=cur;
      if(labels>1 || txt.length>3500) break;
    }
    return best;
  }
  function cardValue(card,h,labelRe){
    if(!card) return '';
    var pieces=[];
    var blocks=Array.prototype.slice.call(card.querySelectorAll('p,li'));
    blocks.forEach(function(n){
      var t=norm(n.textContent); if(!t || labelRe.test(t)) return;
      if(!pieces.some(function(x){return x===t;})) pieces.push(t);
    });
    if(!pieces.length){
      var txt=norm(card.textContent);
      txt=txt.replace(labelRe,'').trim();
      if(txt) pieces=[txt];
    }
    return pieces.map(esc).join('<br>');
  }
  function curationFromSource(doc){
    var out=[];
    LABELS.forEach(function(def){
      var h=findHeading(doc,def.re);
      var card=smallestCard(h);
      var html=cardValue(card,h,def.re);
      if(h && html) out.push({title:def.title,html:html});
    });
    return out;
  }
  function isBefore(a,b){
    if(!a||!b) return true;
    return !!(a.compareDocumentPosition(b)&Node.DOCUMENT_POSITION_FOLLOWING);
  }
  function isAfter(a,b){
    if(!a||!b) return true;
    return !!(b.compareDocumentPosition(a)&Node.DOCUMENT_POSITION_FOLLOWING);
  }
  function galleryFromSource(doc,slug){
    var out=[],seen=Object.create(null);
    var rich=richFor(slug);

    // Original hero background first.
    var hero=doc.querySelector('.t-cover__carrier,[data-content-cover-bg]');
    var heroUrl=imageUrl(hero); add(out,seen,heroUrl);

    // Only raster product imagery from the content region BEFORE curation.
    // This excludes the lower recommendations/promotions scroller entirely.
    var firstH=doc.querySelector('#allrecords h1,h1');
    var firstCur=findHeading(doc,LABELS[0].re);
    var nodes=Array.prototype.slice.call(doc.querySelectorAll('#allrecords img,#allrecords [data-original],#allrecords [data-src],#allrecords [data-img-zoom-url]'));
    nodes.forEach(function(el){
      if(firstH && !isAfter(el,firstH)) return;
      if(firstCur && !isBefore(el,firstCur)) return;
      if(el.closest && el.closest('header,footer,.t-menuwidgeticons,.t228,.t450,.t706,.t1002')) return;
      add(out,seen,imageUrl(el));
    });

    // Catalog image is a safe fallback only; never scan the rendered page.
    if(rich){
      (rich.images||[]).forEach(function(u){add(out,seen,u);});
      add(out,seen,rich.image); add(out,seen,rich.cover);
    }
    return {images:out.slice(0,12),hero:heroUrl};
  }

  function installIconCSS(){
    if(document.getElementById('filin-golden-source-fixer-v2-style')) return;
    var s=document.createElement('style');s.id='filin-golden-source-fixer-v2-style';
    s.textContent='#filin-master-product-v3 .v3-curation{grid-template-columns:repeat(4,minmax(0,1fr))!important}'+
      '@media(max-width:820px){#filin-master-product-v3 .v3-curation{display:block!important}#filin-master-product-v3 .v3-curation-item{border-right:0!important;border-bottom:1px solid #e2d8cd!important}}';
    (document.head||document.documentElement).appendChild(s);
  }

  function applySource(doc){
    var dataEl=document.getElementById('product-data'), api=window.FilinMasterProductV3;
    if(!dataEl||!api||!api.profiles||typeof api.apply!=='function') return false;
    var d={}; try{d=JSON.parse(dataEl.textContent||'{}');}catch(e){return false;}
    var slug=str(d.slug),p=api.profiles[slug]; if(!slug||!p) return false;

    var g=galleryFromSource(doc,slug);
    if(g.images.length){
      p.overview=p.overview||{};
      p.overview.galleryImages=g.images;
      p.hero=p.hero||{};
      p.hero.background=g.hero||g.images[0];
    }

    var cur=curationFromSource(doc);
    if(cur.length===7) p.curation=cur;
    else console.warn('[Golden Source Fixer V2] expected 7 curation rows, got',cur.length,cur);

    installIconCSS();
    api.apply();

    window.__FILIN_GOLDEN_SPEAKERS_SOURCE_FIXER_V2_STATE__={
      slug:slug,
      images:g.images.length,
      curation:cur.length,
      curationCards:document.querySelectorAll('#filin-master-product-v3 .v3-curation-item').length,
      badGalleryIcons:Array.prototype.filter.call(document.querySelectorAll('#filin-master-product-v3 .v3-gallery img'),function(img){return badImage(img.src);}).length,
      goldenRoots:document.querySelectorAll('#filin-master-product-v3').length
    };
    console.info('[Golden Source Fixer V2] APPLIED',window.__FILIN_GOLDEN_SPEAKERS_SOURCE_FIXER_V2_STATE__);
    return true;
  }

  function run(){
    tries++;
    var dataEl=document.getElementById('product-data'),api=window.FilinMasterProductV3;
    if(!dataEl||!api||!api.profiles) return false;
    var d={};try{d=JSON.parse(dataEl.textContent||'{}');}catch(e){return false;}
    if(!d.slug||!api.profiles[d.slug]) return false;

    fetch(location.pathname+'?filin_golden_source=1&ts='+Date.now(),{credentials:'same-origin',cache:'no-store'})
      .then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();})
      .then(function(html){
        var doc=new DOMParser().parseFromString(html,'text/html');
        applySource(doc);
      })
      .catch(function(e){console.error('[Golden Source Fixer V2] SOURCE FETCH FAILED',e);});
    return true;
  }

  if(!run()){
    var t=setInterval(function(){if(run()||tries>=MAX)clearInterval(t);},50);
  }
})();
