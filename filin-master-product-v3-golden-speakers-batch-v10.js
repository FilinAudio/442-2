/* ============================================================
   FILIN LABS — GOLDEN SPEAKERS BATCH V10
   Video-audit hardening over V9.

   Fixes confirmed from ScreenRecorderProject1(8).mp4:
   - shorter pre-paint / no multi-second grey blank after Ctrl+F5
   - Clio: keep original hero title + original overview copy
   - Clio: perceptual gallery de-duplication without replacing hero
   - Clio: keep/add Golden Perfect Matches
   - Clio + Grand Tower: deeper persistent legacy duplicate cleanup
   - preserves TOWER / POWER / Perun Junior / Perun Elder pass-through
   - publishes content-preservation audit state
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V10__) return;

  var slug=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
  var allowed={
    demograf_clio_speakers:1,
    perun_junior_hybrid_electrostatic_speakers:1,
    perun_elder_electrostatic_speakers:1,
    audioinstrument_tower_speakers:1,
    audioinstrument_power_speakers:1,
    audioinstrument_grand_tower_speakers:1
  };
  if(!allowed[slug]) return;
  window.__FILIN_GOLDEN_SPEAKERS_BATCH_V10__=true;

  var V9='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@868b150fa056c3a33a918ee87f7ab750d922cddc/filin-master-product-v3-golden-speakers-batch-v9.js';
  var TARGETED=(slug==='demograf_clio_speakers'||slug==='audioinstrument_grand_tower_speakers');
  var LABELS=[
    /(?:CATHEGORY|CATEGORY)\s*&\s*BUDGET\s*TIER/i,
    /TAGS?\s*&\s*FEATURES/i,
    /SONIC\s*SIGNATURE/i,
    /CURATOR[’']?S\s*CHOICE/i,
    /HIGH\s*TECHNOLOGIES/i,
    /SYNERGY\s*MATCH/i,
    /GENRES?\s*ACCORD/i
  ];

  function same(a,b){return String(a||'').split('?')[0]===String(b||'').split('?')[0];}
  function has(u){return Array.prototype.some.call(document.scripts||[],function(s){return same(s.src,u);});}
  function load(u,id,done){
    if(has(u)){done&&done();return;}
    var old=document.getElementById(id);
    if(old){done&&old.addEventListener('load',done,{once:true});return;}
    var s=document.createElement('script');
    s.id=id;s.src=u;s.async=false;
    s.onload=function(){done&&done();};
    s.onerror=function(){console.error('[Golden Speakers V10] failed',u);};
    (document.head||document.documentElement).appendChild(s);
  }
  function str(v){return String(v==null?'':v).trim();}
  function norm(v){return str(v).replace(/\s+/g,' ').trim();}
  function key(v){return norm(v).toLowerCase().replace(/[“”"'’]/g,'').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();}
  function root(){return document.getElementById('filin-master-product-v3');}
  function countLabels(t){var n=0;LABELS.forEach(function(re){if(re.test(t))n++;});return n;}
  function outsideRoot(el){var r=root();return !!el && (!r || (el!==r && !r.contains(el)));}

  (function earlyReveal(){
    var n=0,t=setInterval(function(){
      n++;
      var r=root();
      if(r && r.querySelector('.v3-gallery') && r.querySelector('.v3-buy')){
        document.documentElement.classList.remove('filin-golden-product-prepaint');
        clearInterval(t);
      } else if(n>=160){
        document.documentElement.classList.remove('filin-golden-product-prepaint');
        clearInterval(t);
      }
    },25);
  })();

  function protectedRec(rec){
    if(!rec) return true;
    if(rec.querySelector&&rec.querySelector('#filin-master-product-v3')) return true;
    if(rec.classList&&rec.classList.contains('fp-v3-curator-record')) return true;
    if(rec.querySelector&&rec.querySelector('.fp-v3-hero-cover')) return true;
    if(rec.closest&&rec.closest('header,footer')) return true;
    if(rec.querySelector&&rec.querySelector('.t-menuwidgeticons,.t228,.t450,.t706')) return true;
    return false;
  }
  function hide(el,reason){
    if(!el||el.dataset.fpV10Hidden==='1') return false;
    el.dataset.fpV10Hidden='1';
    el.dataset.fpV10Reason=reason;
    el.style.setProperty('display','none','important');
    el.style.setProperty('visibility','hidden','important');
    el.style.setProperty('height','0','important');
    el.style.setProperty('min-height','0','important');
    el.style.setProperty('max-height','0','important');
    el.style.setProperty('margin','0','important');
    el.style.setProperty('padding','0','important');
    el.style.setProperty('overflow','hidden','important');
    return true;
  }
  function promoLike(el,t){
    if(/\bPROMOTIONS\b|YOU MAY ALSO LIKE|RELATED PRODUCTS|SPECIAL OFFERS/i.test(t)) return true;
    var imgs=0,links=0;
    try{imgs=el.querySelectorAll('img').length;links=el.querySelectorAll('a[href]').length;}catch(e){}
    return imgs>=4 && links>=4 && /(BUY NOW|VIEW)/i.test(t);
  }
  function legacyProductLike(t){
    if(slug==='demograf_clio_speakers'){
      return /Demograf\s+Clio\s+Floorstanding\s+Speakers/i.test(t) &&
             /(Component\s+Upgrades|Aesthetics|AMP\s*TYPE)/i.test(t);
    }
    if(slug==='audioinstrument_grand_tower_speakers'){
      return /Grand\s+Tower/i.test(t) && /(Perfect\s+Matches|Advanced\s+Crossover\s+Engineering|Sound\s+Signature)/i.test(t);
    }
    return false;
  }
  function deepCleanup(){
    if(!TARGETED) return 0;
    var hidden=0;
    Array.prototype.forEach.call(document.querySelectorAll('#allrecords .t-rec'),function(rec){
      if(protectedRec(rec)) return;
      var t=norm(rec.textContent||'');
      if(countLabels(t)>=2){if(hide(rec,'legacy-curation-rec'))hidden++;return;}
      if(promoLike(rec,t)){if(hide(rec,'legacy-scroller-rec'))hidden++;return;}
      if(legacyProductLike(t)){if(hide(rec,'legacy-product-rec'))hidden++;return;}
    });
    Array.prototype.forEach.call(document.querySelectorAll('#allrecords .t491,#allrecords .t396,#allrecords .t-store,#allrecords [class*="slider"],#allrecords [class*="carousel"]'),function(el){
      if(!outsideRoot(el)) return;
      var rec=el.closest&&el.closest('.t-rec');
      if(rec&&protectedRec(rec)) return;
      var t=norm(el.textContent||'');
      if(countLabels(t)>=2){if(hide(el,'legacy-curation-fragment'))hidden++;return;}
      if(promoLike(el,t)){if(hide(el,'legacy-scroller-fragment'))hidden++;}
    });
    return hidden;
  }

  function scanImage(el){
    if(!el) return '';
    var attrs=['data-content-cover-bg','data-original','data-img-zoom-url','data-src','src'];
    for(var i=0;i<attrs.length;i++){
      var v=str(el.getAttribute&&el.getAttribute(attrs[i]));
      if(/^https?:\/\//i.test(v) && !/\.svg(?:[?#]|$)|\/lib\/icons\//i.test(v)) return v;
    }
    var st='';
    try{st=str(el.getAttribute&&el.getAttribute('style'))+' '+str(getComputedStyle(el).backgroundImage);}catch(e){}
    var m=st.match(/url\(["']?([^"')]+)["']?\)/i);
    return m&&/^https?:\/\//i.test(m[1])?m[1]:'';
  }
  function originalHeroImage(){
    var els=document.querySelectorAll('.fp-v3-hero-cover,[data-content-cover-bg].fp-v3-hero-cover');
    for(var i=0;i<els.length;i++){var u=scanImage(els[i]);if(u)return u;}
    return '';
  }

  function restoreClioCopyAndHero(){
    if(slug!=='demograf_clio_speakers') return false;
    var api=window.FilinMasterProductV3;if(!api||!api.profiles)return false;
    var p=api.profiles[slug];if(!p)return false;
    p.hero=p.hero||{};
    p.hero.staticH1='Demograf Clio Lomo Floorstanding Speakers | Kinap 4a32 Drivers';
    p.hero.description='Experience the live, natural sound of the Demograf Clio Lomo floorstanding speakers. Featuring vintage Lomo/Kinap 4a32 full-range drivers for authentic audio reproduction.';
    var h=originalHeroImage(); if(h) p.hero.background=h;
    p.overview=p.overview||{};
    p.overview.title='Demograf "Clio" Floorstanding Loudspeakers';
    p.overview.html='<p>The Demograf "Clio" is a highly versatile, floorstanding acoustic system designed to deliver live, exceptionally natural sound. It offers an accessible yet highly refined entry into the world of true audiophile fidelity, serving as a perfect solution for passionate music lovers.</p><p>At the heart of the system are the legendary soviet Lomo / Kinap 4a32 full-range drivers (produced by the Leningrad Optical-Mechanical Enterprise). Renowned for their highly sensitive paper cones (98 dB), these vintage drivers provide a breathtakingly authentic midrange and an organic presentation covering 45 Hz to 15 kHz.</p>';
    return true;
  }

  function hashImage(url){
    return new Promise(function(resolve){
      var img=new Image();img.crossOrigin='anonymous';var done=false;
      function finish(v){if(done)return;done=true;resolve(v);}
      img.onload=function(){
        try{
          var n=16,c=document.createElement('canvas');c.width=n;c.height=n;
          var x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,n,n);
          var d=x.getImageData(0,0,n,n).data,g=[],sum=0;
          for(var i=0;i<d.length;i+=4){var v=Math.round(d[i]*.299+d[i+1]*.587+d[i+2]*.114);g.push(v);sum+=v;}
          var avg=sum/g.length,b='';g.forEach(function(v){b+=v>=avg?'1':'0';});
          finish(b);
        }catch(e){finish('');}
      };
      img.onerror=function(){finish('');};
      setTimeout(function(){finish('');},4500);
      img.src=url;
    });
  }
  function hamm(a,b){if(!a||!b||a.length!==b.length)return 999;var n=0;for(var i=0;i<a.length;i++)if(a[i]!==b[i])n++;return n;}
  async function dedupeClio(){
    if(slug!=='demograf_clio_speakers') return {before:0,after:0,removed:0};
    var api=window.FilinMasterProductV3;if(!api||!api.profiles)return null;
    var p=api.profiles[slug];if(!p||!p.overview)return null;
    var urls=(p.overview.galleryImages||[]).slice(),kept=[],hashes=[];
    if(urls.length<2)return {before:urls.length,after:urls.length,removed:0};
    for(var i=0;i<urls.length;i++){
      var u=urls[i],h=await hashImage(u),dup=false;
      if(h){for(var j=0;j<hashes.length;j++){if(hamm(h,hashes[j])<=6){dup=true;break;}}}
      if(!dup){kept.push(u);hashes.push(h);}
    }
    if(kept.length>=2&&kept.length<urls.length)p.overview.galleryImages=kept;
    return {before:urls.length,after:(kept.length||urls.length),removed:urls.length-(kept.length||urls.length)};
  }

  function ensureClioPm(){
    if(slug!=='demograf_clio_speakers') return false;
    var r=root();if(!r)return false;
    if(r.querySelector('.v3-pm')) return true;
    var d=document.createElement('details');
    d.className='v3-pm fp-v10-clio-pm';
    d.style.cssText='max-width:760px;margin:22px auto;border:1px solid #d7cec4;border-radius:14px;background:#fbf8f4;overflow:hidden;color:#181410';
    d.innerHTML='<summary style="list-style:none;cursor:pointer;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:15px;font-weight:700"><span>PERFECT MATCHES<span style="display:block;font-size:13px;font-weight:400;margin-top:4px;color:#665d54">Add recommended synergy components to get <b>5% OFF for EACH added device.</b></span></span><span>＋</span></summary>'+
      '<div style="padding:0 18px 18px;border-top:1px solid #e3dbd2">'+
      '<p style="font-size:14px;line-height:1.55;color:#5d554d">The Clio’s 98 dB sensitivity and vintage Lomo/Kinap wideband drivers pair naturally with low-power tube amplification, organic DACs and high-quality speaker cabling.</p>'+
      '<label class="v3-pm-item" style="display:flex;align-items:center;gap:9px;padding:10px 11px;margin:8px 0;border:1px solid #ddd4ca;border-radius:9px;background:#fff"><input class="v3-bundle" type="checkbox"><a href="/gerbera_2a3_tube_amplifier" style="color:inherit;text-decoration:none">Gerbera Sound 2A3 Single-Ended Tube Amplifier</a></label>'+
      '<label class="v3-pm-item" style="display:flex;align-items:center;gap:9px;padding:10px 11px;margin:8px 0;border:1px solid #ddd4ca;border-radius:9px;background:#fff"><input class="v3-bundle" type="checkbox"><a href="/audioinstrument_dac_di_200_accuracy" style="color:inherit;text-decoration:none">Audioinstrument DAC DI-200 Accuracy</a></label>'+
      '<label class="v3-pm-item" style="display:flex;align-items:center;gap:9px;padding:10px 11px;margin:8px 0;border:1px solid #ddd4ca;border-radius:9px;background:#fff"><input class="v3-bundle" type="checkbox"><a href="/konstantin_audio_a_1_synergy_speaker_cables" style="color:inherit;text-decoration:none">Konstantin Audio A-1 Speaker Cables</a></label>'+
      '<div style="margin-top:10px;padding:11px;text-align:center;border-radius:8px;background:#c79a62;color:white;font-weight:700">Ultimate Purity</div></div>';
    var anchor=r.querySelector('.v3-tabs,.v3-curation');
    if(anchor&&anchor.parentNode)anchor.parentNode.insertBefore(d,anchor);else r.appendChild(d);
    return true;
  }

  var EXPECTED={
    demograf_clio_speakers:[
      'Demograf Clio Lomo Floorstanding Speakers Kinap 4a32 Drivers',
      'Experience the live natural sound of the Demograf Clio Lomo floorstanding speakers',
      'The Demograf Clio is a highly versatile floorstanding acoustic system',
      'At the heart of the system are the legendary soviet Lomo Kinap 4a32 full range drivers',
      '45 Hz 15 kHz','98 dB','Aperiodic Enclosure','Open Baffle','Sealed','Reflex','Labyrinth',
      'CATHEGORY BUDGET TIER','TAGS FEATURES','SONIC SIGNATURE','CURATORS CHOICE','HIGH TECHNOLOGIES','SYNERGY MATCH','GENRES ACCORD'
    ],
    audioinstrument_grand_tower_speakers:[
      'Audioinstrument Grand Tower Flagship Sonido drivers Speakers',
      'Handcrafted by Sergey Glazunov',
      'Experience ultimate sonic perfection',
      'The Grand Tower model is a reference grade three way floorstanding loudspeaker system',
      'The Synergy of Sonido P Audio Drivers','Perfect Matches','Sound Signature','Advanced Crossover Engineering',
      '200 Hz','6000 Hz','95 dB','25 Hz 35000 Hz',
      'CATHEGORY BUDGET TIER','TAGS FEATURES','SONIC SIGNATURE','CURATORS CHOICE','HIGH TECHNOLOGIES','SYNERGY MATCH','GENRES ACCORD'
    ]
  };
  function audit(){
    var text=key((document.getElementById('allrecords')||document.body).textContent||''),list=EXPECTED[slug]||[],missing=[];
    list.forEach(function(s){if(text.indexOf(key(s))<0)missing.push(s);});
    return {expected:list.length,present:list.length-missing.length,missing:missing};
  }

  async function fixTarget(){
    if(!TARGETED){
      window.__FILIN_GOLDEN_SPEAKERS_BATCH_V10_STATE__={version:'10.0.0',slug:slug,passThrough:true};
      return;
    }
    deepCleanup();
    var gallery={before:0,after:0,removed:0};
    if(slug==='demograf_clio_speakers'){
      restoreClioCopyAndHero();
      gallery=await dedupeClio()||gallery;
      var api=window.FilinMasterProductV3;if(api&&typeof api.apply==='function')api.apply();
      ensureClioPm();
    }
    deepCleanup();
    var a=audit();
    var state={
      version:'10.0.0',slug:slug,
      goldenRoots:document.querySelectorAll('#filin-master-product-v3').length,
      hiddenLegacy:document.querySelectorAll('[data-fp-v10-hidden="1"]').length,
      curationCards:document.querySelectorAll('#filin-master-product-v3 .v3-curation-item').length,
      perfectMatches:!!document.querySelector('#filin-master-product-v3 .v3-pm'),
      galleryBefore:gallery.before,galleryAfter:gallery.after,galleryDuplicatesRemoved:gallery.removed,
      textExpected:a.expected,textPresent:a.present,textMissing:a.missing
    };
    window.__FILIN_GOLDEN_SPEAKERS_BATCH_V10_STATE__=state;
    console.info('[Golden Speakers Batch V10] VIDEO AUDIT FIX APPLIED',state);
    var mo=new MutationObserver(function(){deepCleanup();ensureClioPm();});
    mo.observe(document.getElementById('allrecords')||document.body,{childList:true,subtree:true});
  }

  function wait(){
    var n=0,t=setInterval(function(){
      n++;
      var v9=window.__FILIN_GOLDEN_SPEAKERS_BATCH_V9_STATE__;
      var live=window.__FILIN_GOLDEN_SPEAKERS_LIVE_FIXER_V4_STATE__;
      if(root() && live && live.slug===slug && Number(live.curation||0)===7 && (v9||!TARGETED)){
        clearInterval(t);fixTarget();
      }else if(n>=320){
        clearInterval(t);fixTarget();
      }
    },50);
  }

  load(V9,'filin-golden-speakers-v9-from-v10',function(){
    wait();
    console.info('[Golden Speakers Batch V10] READY',{version:'10.0.0',slug:slug,targeted:TARGETED});
  });
})();
