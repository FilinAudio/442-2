/* ============================================================
   FILIN LABS — GOLDEN SPEAKERS BATCH V9
   V8 + targeted Clio/Grand Tower hardening + text preservation audit.

   Fixes:
   - Clio: perceptual de-duplication of Golden gallery images
   - Clio: adds a Golden Perfect Matches block (original legacy page had none)
   - Clio/Grand Tower: stronger persistent quarantine of legacy duplicate blocks
   - Clio/Grand Tower: source-text preservation audit state
   - TOWER / POWER / Perun Junior / Perun Elder remain pass-through
   ============================================================ */
(function(){
  'use strict';
  if(window.__FILIN_GOLDEN_SPEAKERS_BATCH_V9__) return;

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
  window.__FILIN_GOLDEN_SPEAKERS_BATCH_V9__=true;

  var V8='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@14a4acd68e9129f3cb38623aab8867394268cae2/filin-master-product-v3-golden-speakers-batch-v8.js';
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
    s.onerror=function(){console.error('[Golden Speakers V9] failed',u);};
    (document.head||document.documentElement).appendChild(s);
  }
  function norm(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}
  function root(){return document.getElementById('filin-master-product-v3');}
  function countLabels(t){var n=0;LABELS.forEach(function(re){if(re.test(t))n++;});return n;}
  function isProtected(rec){
    if(!rec) return true;
    if(rec.querySelector&&rec.querySelector('#filin-master-product-v3')) return true;
    if(rec.classList&&rec.classList.contains('fp-v3-curator-record')) return true;
    if(rec.querySelector&&rec.querySelector('.fp-v3-hero-cover')) return true;
    if(rec.closest&&rec.closest('header,footer')) return true;
    if(rec.querySelector&&rec.querySelector('.t-menuwidgeticons,.t228,.t450,.t706')) return true;
    return false;
  }
  function promoLike(rec,t){
    if(/\bPROMOTIONS\b|YOU MAY ALSO LIKE|RELATED PRODUCTS|SPECIAL OFFERS/i.test(t)) return true;
    var cards=0;
    try{cards=rec.querySelectorAll('.t-store__card,.js-store-prod-name,.t-card__title').length;}catch(e){}
    return cards>=2 && /(BUY NOW|VIEW)/i.test(t);
  }
  function legacyProductLike(t){
    if(slug==='demograf_clio_speakers'){
      return /Demograf\s+Clio\s+Floorstanding\s+Speakers/i.test(t) &&
             /Live,\s*Natural\s*Sound/i.test(t) &&
             /(Component\s+Upgrades|Aesthetics)/i.test(t);
    }
    if(slug==='audioinstrument_grand_tower_speakers'){
      return /Grand\s+Tower/i.test(t) && /Perfect\s+Matches/i.test(t) &&
             /(Advanced\s+Crossover\s+Engineering|Sound\s+Signature)/i.test(t);
    }
    return false;
  }
  function hideRec(rec,reason){
    if(!rec||rec.dataset.fpV9Hidden==='1') return false;
    rec.dataset.fpV9Hidden='1';
    rec.dataset.fpV9Reason=reason;
    ['display','visibility','height','min-height','max-height','margin','padding','overflow'].forEach(function(k){
      var v=(k==='display')?'none':(k==='visibility'?'hidden':(k==='overflow'?'hidden':'0'));
      rec.style.setProperty(k,v,'important');
    });
    return true;
  }
  function strongCleanup(){
    if(!TARGETED) return 0;
    var hidden=0;
    Array.prototype.forEach.call(document.querySelectorAll('#allrecords .t-rec'),function(rec){
      if(isProtected(rec)) return;
      var t=norm(rec.textContent||'');
      var reason='';
      if(countLabels(t)>=2) reason='legacy-curation';
      else if(promoLike(rec,t)) reason='legacy-promo';
      else if(legacyProductLike(t)) reason='legacy-product';
      if(reason&&hideRec(rec,reason)) hidden++;
    });
    return hidden;
  }

  /* ---------- Clio Perfect Matches ---------- */
  function installPmCss(){
    if(document.getElementById('filin-v9-clio-pm-style')) return;
    var s=document.createElement('style');
    s.id='filin-v9-clio-pm-style';
    s.textContent='\
#filin-master-product-v3 .fp-v9-clio-pm{max-width:760px;margin:22px auto;border:1px solid #d7cec4;border-radius:14px;background:#fbf8f4;overflow:hidden;color:#181410}\
#filin-master-product-v3 .fp-v9-clio-pm summary{list-style:none;cursor:pointer;padding:16px 18px;display:flex;align-items:center;justify-content:space-between;gap:15px;font-weight:700}\
#filin-master-product-v3 .fp-v9-clio-pm summary::-webkit-details-marker{display:none}\
#filin-master-product-v3 .fp-v9-clio-pm .fp-v9-pm-sub{display:block;font-size:13px;font-weight:400;margin-top:4px;color:#665d54}\
#filin-master-product-v3 .fp-v9-clio-pm .fp-v9-pm-body{padding:0 18px 18px;border-top:1px solid #e3dbd2}\
#filin-master-product-v3 .fp-v9-clio-pm .fp-v9-pm-desc{font-size:14px;line-height:1.55;color:#5d554d}\
#filin-master-product-v3 .fp-v9-clio-pm .v3-pm-item{display:flex;align-items:center;gap:9px;padding:10px 11px;margin:8px 0;border:1px solid #ddd4ca;border-radius:9px;background:#fff}\
#filin-master-product-v3 .fp-v9-clio-pm .v3-pm-item a{color:inherit;text-decoration:none}\
#filin-master-product-v3 .fp-v9-clio-pm .v3-bundle{width:18px;height:18px;flex:0 0 auto}\
#filin-master-product-v3 .fp-v9-clio-pm .fp-v9-pm-result{margin-top:10px;padding:11px;text-align:center;border-radius:8px;background:#c79a62;color:white;font-weight:700}\
@media(max-width:820px){#filin-master-product-v3 .fp-v9-clio-pm{margin:16px 10px}}';
    (document.head||document.documentElement).appendChild(s);
  }
  function ensureClioPm(){
    if(slug!=='demograf_clio_speakers') return false;
    var r=root(); if(!r) return false;
    if(r.querySelector('.v3-pm')) return false;
    installPmCss();
    var d=document.createElement('details');
    d.className='v3-pm fp-v9-clio-pm';
    d.innerHTML='\
<summary><span>PERFECT MATCHES<span class="fp-v9-pm-sub">Add recommended synergy components to get <b>5% OFF for EACH added device.</b></span></span><span>＋</span></summary>\
<div class="fp-v9-pm-body">\
<p class="fp-v9-pm-desc">The Clio’s 98 dB sensitivity and vintage Lomo/Kinap wideband drivers pair naturally with low-power tube amplification, organic DACs and high-quality speaker cabling. We recommend this synergy:</p>\
<div class="v3-pm-item"><input class="v3-bundle" type="checkbox"><a href="/gerbera_2a3_tube_amplifier">Gerbera Sound 2A3 Single-Ended Tube Amplifier</a></div>\
<div class="v3-pm-item"><input class="v3-bundle" type="checkbox"><a href="/audioinstrument_dac_di_200_accuracy">Audioinstrument DAC DI-200 Accuracy</a></div>\
<div class="v3-pm-item"><input class="v3-bundle" type="checkbox"><a href="/konstantin_audio_a_1_synergy_speaker_cables">Konstantin Audio A-1 Speaker Cables</a></div>\
<div class="fp-v9-pm-result">Ultimate Purity</div>\
</div>';
    var anchor=r.querySelector('.v3-tabs,.v3-curation');
    if(anchor&&anchor.parentNode) anchor.parentNode.insertBefore(d,anchor);
    else r.appendChild(d);
    return true;
  }

  /* ---------- Clio perceptual gallery de-duplication ---------- */
  function imageHash(url){
    return new Promise(function(resolve){
      var img=new Image(); img.crossOrigin='anonymous';
      var done=false;
      function finish(v){if(done)return;done=true;resolve(v);}
      img.onload=function(){
        try{
          var c=document.createElement('canvas'),n=12;c.width=n;c.height=n;
          var x=c.getContext('2d',{willReadFrequently:true});
          x.drawImage(img,0,0,n,n);
          var data=x.getImageData(0,0,n,n).data,g=[],sum=0;
          for(var i=0;i<data.length;i+=4){var v=Math.round(data[i]*.299+data[i+1]*.587+data[i+2]*.114);g.push(v);sum+=v;}
          var avg=sum/g.length,bits='';
          g.forEach(function(v){bits+=v>=avg?'1':'0';});
          finish(bits);
        }catch(e){finish('');}
      };
      img.onerror=function(){finish('');};
      setTimeout(function(){finish('');},5000);
      img.src=url;
    });
  }
  function hamming(a,b){if(!a||!b||a.length!==b.length)return 999;var n=0;for(var i=0;i<a.length;i++)if(a[i]!==b[i])n++;return n;}
  function restoreClioSourceText(){
    if(slug!=='demograf_clio_speakers') return false;
    var api=window.FilinMasterProductV3; if(!api||!api.profiles) return false;
    var p=api.profiles[slug]; if(!p) return false;
    p.hero=p.hero||{};
    p.hero.staticH1='Demograf "Clio" Reference: Full-Range Loudspeakers';
    p.hero.description='Discover accessible high-fidelity audio with the Demograf "Clio". Built around legendary soviet vintage Lomo/Kinap 4a32 full-range drivers, these floorstanding speakers deliver a vivid, exceptionally natural acoustic presentation.';
    p.overview=p.overview||{};
    p.overview.title='Demograf "Clio" Floorstanding Loudspeakers';
    p.overview.html='<p>The Demograf "Clio" is a highly versatile, floorstanding acoustic system designed to deliver live, exceptionally natural sound. It offers an accessible yet highly refined entry into the world of true audiophile fidelity, serving as a perfect solution for passionate music lovers.</p><p>At the heart of the system are the legendary soviet Lomo / Kinap 4a32 full-range drivers (produced by the Leningrad Optical-Mechanical Enterprise). Renowned for their highly sensitive paper cones (98 dB), these vintage drivers provide a breathtakingly authentic midrange and an organic presentation covering 45 Hz to 15 kHz.</p>';
    return true;
  }
  async function dedupeClioGallery(){
    if(slug!=='demograf_clio_speakers') return {before:0,after:0,removed:0};
    var api=window.FilinMasterProductV3,r=root();
    if(!api||!api.profiles||!r) return null;
    var p=api.profiles[slug]; if(!p||!p.overview) return null;
    var urls=(p.overview.galleryImages||[]).slice();
    if(urls.length<2) return {before:urls.length,after:urls.length,removed:0};
    var kept=[],hashes=[];
    for(var i=0;i<urls.length;i++){
      var u=urls[i],h=await imageHash(u),dup=false;
      if(h){for(var j=0;j<hashes.length;j++){if(hamming(h,hashes[j])<=2){dup=true;break;}}}
      if(!dup){kept.push(u);hashes.push(h);}
    }
    if(kept.length>=2&&kept.length<urls.length){
      p.overview.galleryImages=kept;
      if(p.hero) p.hero.background=kept[0];
      api.apply();
    }
    return {before:urls.length,after:kept.length||urls.length,removed:urls.length-(kept.length||urls.length)};
  }

  /* ---------- Text preservation audit ---------- */
  var EXPECTED={
    demograf_clio_speakers:[
      'Discover accessible high-fidelity audio with the Demograf',
      'Demograf "Clio" Floorstanding Loudspeakers',
      'The Demograf "Clio" is a highly versatile',
      'At the heart of the system are the legendary soviet Lomo / Kinap 4a32',
      'Live, Natural Sound','Maximum Versatility','Flexible Configurations','Acoustic enclosure',
      'Primary Driver','45 Hz – 15,000 Hz','98 dB','Aperiodic Enclosure',
      'CATHEGORY & BUDGET TIER','Tags & FEATURES','Sonic Signature','Curator’s Choice','High Technologies','SYNERGY MATCH','GENRES ACCORD'
    ],
    audioinstrument_grand_tower_speakers:[
      'An uncompromising three-way floorstanding loudspeaker system from Audioinstrument',
      'Handcrafted by Sergey Glazunov',
      'Experience ultimate sonic perfection',
      'The Grand Tower model is a reference-grade three-way floorstanding loudspeaker system',
      'The Synergy of Sonido & P.Audio Drivers','Perfect Matches','Sound Signature','Advanced Crossover Engineering',
      'Crossover Frequencies','200 Hz','6,000 Hz','95 dB','25 Hz – 35,000 Hz',
      'CATHEGORY & BUDGET TIER','Tags & FEATURES','Sonic Signature','Curator’s Choice','High Technologies','SYNERGY MATCH','GENRES ACCORD'
    ]
  };
  function textAudit(){
    var list=EXPECTED[slug]||[],all=norm((document.getElementById('allrecords')||document.body).textContent||'');
    var present=[],missing=[];
    list.forEach(function(s){(all.indexOf(s)>=0?present:missing).push(s);});
    return {expected:list.length,present:present.length,missing:missing};
  }

  async function targetedFix(){
    if(!TARGETED){
      window.__FILIN_GOLDEN_SPEAKERS_BATCH_V9_STATE__={version:'9.0.0',slug:slug,passThrough:true};
      return;
    }
    strongCleanup();
    var gallery={before:0,after:0,removed:0};
    if(slug==='demograf_clio_speakers'){
      restoreClioSourceText();
      gallery=await dedupeClioGallery()||gallery;
    }
    strongCleanup();
    ensureClioPm();
    var audit=textAudit();
    var state={
      version:'9.0.0',slug:slug,
      goldenRoots:document.querySelectorAll('#filin-master-product-v3').length,
      hiddenLegacy:document.querySelectorAll('[data-fp-v9-hidden="1"]').length,
      curationCards:document.querySelectorAll('#filin-master-product-v3 .v3-curation-item').length,
      perfectMatches:!!document.querySelector('#filin-master-product-v3 .v3-pm'),
      galleryBefore:gallery.before,galleryAfter:gallery.after,galleryDuplicatesRemoved:gallery.removed,
      textExpected:audit.expected,textPresent:audit.present,textMissing:audit.missing
    };
    window.__FILIN_GOLDEN_SPEAKERS_BATCH_V9_STATE__=state;
    console.info('[Golden Speakers Batch V9] TARGETED FIX APPLIED',state);

    var mo=new MutationObserver(function(){strongCleanup();ensureClioPm();});
    mo.observe(document.getElementById('allrecords')||document.body,{childList:true,subtree:true});
  }

  function wait(){
    var n=0,t=setInterval(function(){
      n++;
      var live=window.__FILIN_GOLDEN_SPEAKERS_LIVE_FIXER_V4_STATE__;
      if(root()&&live&&live.slug===slug&&Number(live.curation||0)===7){
        clearInterval(t);targetedFix();
      }else if(n>=240){
        clearInterval(t);console.warn('[Golden Speakers Batch V9] wait timeout',{slug:slug});
      }
    },50);
  }

  load(V8,'filin-golden-speakers-v8-from-v9',function(){
    wait();
    console.info('[Golden Speakers Batch V9] READY',{version:'9.0.0',slug:slug,targeted:TARGETED});
  });
})();
