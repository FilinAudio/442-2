/* FILIN LABS — MASTER PRODUCT V3 PROFILES REGISTRY V1
   Purpose: one registry for product-specific data/enhancers while frozen
   Golden Standard V3.3.2 remains unchanged.

   V1 contains:
   - current core seed profiles: Quadron + Grand Tower (read from frozen core)
   - Sirius KT150 profile V1.3 data
   - generic legacy Tilda gallery hydration by profile metadata
   - generic V3 interactions: fullscreen gallery, autoplay, BUY NOW pulse,
     mobile 50/50 BUY NOW split
*/
(function(){
  'use strict';
  if(window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__) return;
  window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__=true;

  var VERSION='1.0.0';
  var SIRIUS_SLUG='audioinstrument_sirius_kt150_tube_amplifier';
  var EXTERNAL_PROFILES={
    [SIRIUS_SLUG]:{"schemaVersion":2,"slug":"audioinstrument_sirius_kt150_tube_amplifier","id":"audioinstrument-sirius-kt150","category":"tube-amplifiers","currency":"USD","hero":{"staticH1":"Audioinstrument \"Sirius KT150\": Triode Class A Amplifier","description":"The Audioinstrument Sirius KT150 is a reference vacuum tube amplifier operating in pure Class A triode mode, built around KT150 power tetrodes and a proprietary ultra-low-distortion circuit.","background":"https://static.tildacdn.com/tild6666-6636-4934-b863-326237636139/imgi_66_hd_699097862.png"},"curator":"Handcrafted by Sergey Glazunov. Personally listened, approved & curated by R. Fayzullin. Filin Labs Kazakhstan.","overview":{"title":"Audioinstrument Sirius KT150 Triode Class A Amplifier","html":"<p>The Sirius KT150 by Audioinstrument is a high-performance vacuum tube amplifier engineered for purist music reproduction. Operating in a pure Class A triode configuration, it combines modern dynamic authority with classic valve refinement.</p><p>Its KT150 power tetrodes work with a proprietary circuit designed for very low non-linear distortion across the frequency band.</p><h3>Pure Class A Triode Architecture</h3><p>The amplifier delivers up to 20 W per channel, uses a 6SL7 pre-amplifier stage and 6V6 / 6P6S driver tubes, and maintains a low 1.2 Ohm output impedance for tight loudspeaker control.</p>","galleryImages":["https://static.tildacdn.com/tild6666-6636-4934-b863-326237636139/imgi_66_hd_699097862.png","https://static.tildacdn.com/tild3537-3633-4834-b839-343838383963/______100-Photoroom.png"]},"curation":[{"title":"Category & Budget Tier","html":"<strong>Tube Amplifier</strong><br/>Masterpiece Edition (&lt;$4500)"},{"title":"Tags & Features","html":"#Audioinstrument Sirius KT150 #KT150 tube amplifier #Class A tube amplifier #Triode mode #High-end valve integrated amplifier"},{"title":"Sonic Signature","html":"<strong>AURA</strong> — warm, organic and timbrally rich, with deep harmonic textures and liquid analog musicality."},{"title":"Curator’s Choice","html":"Warm and magical presentation suited to full-range paper-cone loudspeakers and broad musical tastes."},{"title":"High Technologies","html":"Pure Class A Triode · 6V6 / 6P6S driver stage · 6SL7 pre-amplifier stage · 1.2 Ohm output impedance · Shallow 3 dB global negative feedback · ALPS volume control · Relay-switched inputs."},{"title":"Synergy Match","html":"Delta-Sigma DAC · Solid-state DAC · Silver cables · Full-range speakers."},{"title":"Genres Accord","html":"All-Rounder."}],"commerce":{"basePrice":4500,"displayName":"Audioinstrument Sirius KT150 Class A Tube Amplifier","cartName":"Audioinstrument Sirius KT150 Tube Amplifier (Standard Edition)","stickyTitle":"Audioinstrument \"Sirius KT150\"","innerHTML":"<div class=\"purchase-container\">\n  <span class=\"js-product-name\" id=\"tilda-product-name\" style=\"display:none;\">Audioinstrument Sirius KT150 Tube Amplifier (Standard Edition)</span>\n  <div class=\"price-title\">Total*: $<span class=\"js-product-price\" id=\"main-price\">4500</span></div>\n  <a class=\"buy-btn js-product-btn\" href=\"#order\">Buy Now</a>\n  <div class=\"perfect-matches-block\">\n    <h4 class=\"pm-title\">Perfect Matches</h4>\n    <p class=\"pm-desc\">The Sirius KT150 is designed to partner with high-resolution digital sources, silver cabling and revealing loudspeakers. To build a coherent reference system, we recommend this synergy:</p>\n    <div class=\"pm-formula\">\n      <div class=\"pm-item pm-base\"><span>Audioinstrument Sirius KT150</span></div>\n      <span class=\"pm-plus\">+</span>\n      <label class=\"pm-item\"><input class=\"price-item bundle-item\" data-price=\"0\" name=\"match_dac\" type=\"checkbox\"><span><a href=\"https://filinlabs.com/gerbera_pcm1794_dsd1794_dac_otis\">Gerbera Otis DSD1794 DAC</a></span></label>\n      <span class=\"pm-plus\">+</span>\n      <label class=\"pm-item\"><input class=\"price-item bundle-item\" data-price=\"0\" name=\"match_speakers\" type=\"checkbox\"><span><a href=\"https://filinlabs.com/audioinstrument_grand_tower_speakers\">Audioinstrument Grand Tower Speakers</a></span></label>\n      <span class=\"pm-plus\">+</span>\n      <label class=\"pm-item\"><input class=\"price-item bundle-item\" data-price=\"0\" name=\"match_cable\" type=\"checkbox\"><span><a href=\"https://filinlabs.com/konstantin_audio_a_1_synergy_speaker_cables\">Konstantin Audio A-1 Speaker Cables</a></span></label>\n      <span class=\"pm-equals\">=</span>\n      <div class=\"pm-result\">Ultimate Synergy</div>\n    </div>\n    <div class=\"pm-discount\" id=\"bundle-discount-msg\">Add recommended synergy components to get <b>5% OFF for EACH added device.</b></div>\n  </div>\n</div>\n<div class=\"tabs-wrapper\">\n  <div class=\"tabs-header\">\n    <button class=\"tab-btn active\" type=\"button\" onclick=\"showTab(event, 'desc')\">Key Features</button>\n    <button class=\"tab-btn\" type=\"button\" onclick=\"showTab(event, 'spec')\">Specification</button>\n    <button class=\"tab-btn\" type=\"button\" onclick=\"showTab(event, 'aesthetics')\">Aesthetics</button>\n    <button class=\"tab-btn\" type=\"button\" onclick=\"showTab(event, 'upgrades')\">Component Upgrades</button>\n  </div>\n  <div class=\"tab-content\" id=\"desc\"><div class=\"content-container\"><div class=\"description-content\">\n<h3>Pure Class A Triode Performance</h3>\n<p>The Sirius KT150 bypasses the common limitations of conventional push-pull designs by running its output stage in pure Class A triode mode. Backed by a shallow, non-invasive 3 dB global negative feedback loop, it offers a clean, fluid and transparent acoustic window while preserving micro-dynamics.</p>\n<p>A standout characteristic is its exceptionally low output impedance of approximately 1.2 Ohms.</p>\n<h3>Absolute Genre Universality</h3>\n<p>The circuit architecture combines punchy, authoritative control with the delicacy expected from elite Class A tube amplification. It is designed to handle large-scale orchestral music, rock and electronic transients while retaining intimacy with jazz, vocals and acoustic recordings.</p>\n<h3>Elite Driver and Preamp Stage</h3>\n<p>The preamp and driver stages use 6SL7 tubes for voltage amplification together with 6V6 / 6P6S tubes in the driver stage. Four source inputs are switched by precision low-noise relays, while volume attenuation is handled by a Japanese ALPS potentiometer.</p>\n</div></div></div>\n  <div class=\"tab-content\" id=\"spec\" style=\"display:none;\"><div class=\"content-container\"><table class=\"specs-table\"><tbody><tr><td><strong>Total Price*</strong></td><td>The price is for the base product only and does not include shipping or selected optional upgrades. To get a complete final quote, please submit your request to our consultant via email at shop@filinlabs.com or via Telegram at @RA_Fayzullin. We will send you an invoice & full costs calculation in the reply message.</td></tr><tr><td><strong>Lead Times</strong></td><td>You can check the lead times for each item in the \"Lead Times & Handcrafted Quality\" section. If the standard waiting time does not suit you, you can request our expedited assembly service. Installment payment options are also available.</td></tr><tr><td><strong>Basic Configuration</strong></td><td>The standard configuration includes the Audioinstrument Sirius KT150 Tube Amplifier with no additional options.</td></tr><tr><td><strong>Operating Mode</strong></td><td>Pure Class A Triode</td></tr><tr><td><strong>Output Tubes</strong></td><td>KT150 (Power Tetrodes)</td></tr><tr><td><strong>Driver Stage Tubes</strong></td><td>6V6 / 6P6S</td></tr><tr><td><strong>Pre-Amplifier Tubes</strong></td><td>6SL7</td></tr><tr><td><strong>Maximum Output Power</strong></td><td>20 W per channel</td></tr><tr><td><strong>Nominal Output Power</strong></td><td>15 W per channel</td></tr><tr><td><strong>Frequency Response</strong></td><td>20 Hz – 25 kHz (-1.0 dB)</td></tr><tr><td><strong>Output Impedance</strong></td><td>1.2 Ohms</td></tr><tr><td><strong>Recommended Load</strong></td><td>4 - 8 Ohms (6 Ohms optimal)</td></tr><tr><td><strong>Input Sensitivity</strong></td><td>0.775 V</td></tr><tr><td><strong>Global Negative Feedback</strong></td><td>Shallow (3 dB)</td></tr><tr><td><strong>THD (at Nominal Power)</strong></td><td>0.1%</td></tr><tr><td><strong>THD (at Maximum Power)</strong></td><td>≤ 3.0%</td></tr><tr><td><strong>Inputs</strong></td><td>4 switchable inputs (Relay controlled)</td></tr><tr><td><strong>Dimensions (W x H x D)</strong></td><td>430 x 350 x 200 mm</td></tr><tr><td><strong>Weight</strong></td><td>20 kg</td></tr><tr><td><strong>Limited Warranty</strong></td><td>You can find information about Warranty by visiting <a href=\"https://filinlabs.com/warranty\">Warranty &amp; Returns Policy</a> page.</td></tr></tbody></table></div></div>\n  <div class=\"tab-content\" id=\"aesthetics\" style=\"display:none;\"><div class=\"content-container\">\n<h3>Aesthetics</h3>\n<div class=\"options-list\">\n<label><input type=\"radio\" name=\"sirius-aesthetic\" checked> Classic Black Gloss Lacquer</label>\n<label><input type=\"radio\" name=\"sirius-aesthetic\"> Cherry-Silver Gloss Lacquer</label>\n</div>\n</div></div>\n  <div class=\"tab-content\" id=\"upgrades\" style=\"display:none;\"><div class=\"content-container\">\n<h3>Component Upgrades</h3>\n<div class=\"options-list\">\n<label><input type=\"radio\" name=\"sirius-upgrade\" checked> Stock High-Quality Tube Configuration</label>\n<label><input type=\"radio\" name=\"sirius-upgrade\"> Premium NOS Matched KT150 Tube Quartet</label>\n<label><input type=\"radio\" name=\"sirius-upgrade\"> Vintage NOS 6V6 &amp; 6SL7 Signal Tubes Upgrade</label>\n<label><input type=\"checkbox\" name=\"sirius-alps\"> ALPS Blue Velvet Premium Volume Potentiometer</label>\n</div>\n</div></div>\n</div>"},"reviewsCTA":"View The Reviews of Audioinstrument Sirius KT150","reviewsQuery":"Audioinstrument Sirius KT150","reviewsIntro":"Share your listening experience with Audioinstrument \"Sirius KT150\".","golden":{"backLabel":"Back to the Filin's nest","backHref":"/","mobileHeroHeight":860,"resultLabel":"Ultimate Synergy"},"reviewsKey":"audioinstrument-sirius-kt150","registryMeta":{"version":"1.0.0","legacyGallery":{"url":"/audioinstrument_sirius_kt150_tube_amplifier","recordId":"rec2355175041","excludePatterns":["______100-Photoroom.png"]}}}
  };

  var ALIASES={
    'filin-audio-quadron':'filin_audio_quadron',
    'audioinstrument-grand-tower':'audioinstrument_grand_tower_speakers',
    'audioinstrument-grand-tower-speakers':'audioinstrument_grand_tower_speakers',
    'audioinstrument-sirius-kt150':'audioinstrument_sirius_kt150_tube_amplifier',
    'audioinstrument-sirius-kt150-tube-amplifier':'audioinstrument_sirius_kt150_tube_amplifier'
  };

  var state={installed:false,hydrated:Object.create(null)};

  function seedAndInstall(){
    var api=window.FilinMasterProductV3;
    if(!api || !api.profiles || typeof api.apply!=='function') return false;

    Object.keys(EXTERNAL_PROFILES).forEach(function(slug){
      api.profiles[slug]=EXTERNAL_PROFILES[slug];
    });

    Object.keys(ALIASES).forEach(function(alias){
      var canonical=ALIASES[alias];
      if(api.profiles[canonical]) api.profiles[alias]=api.profiles[canonical];
    });

    state.installed=true;
    api.apply();

    console.info('[Master Product V3 Registry] V1 INSTALLED',{
      version:VERSION,
      profiles:Object.keys(api.profiles),
      external:Object.keys(EXTERNAL_PROFILES)
    });

    scheduleLegacyGallery();
    return true;
  }

  var installTries=0;

  if(!seedAndInstall()){
    var installTimer=setInterval(function(){
      installTries++;

      if(seedAndInstall() || installTries>=80){
        clearInterval(installTimer);
      }
    },100);
  }

  function currentSlug(){
    try{
      var el=document.getElementById('product-data');
      if(!el) return '';

      var d=JSON.parse(el.textContent||'{}');
      return String(d.slug||'');
    }catch(e){
      return '';
    }
  }

  function decodeEntities(value){
    var s=String(value==null?'':value);

    if(!s) return '';

    var ta=document.createElement('textarea');
    ta.innerHTML=s;

    return ta.value;
  }

  function normalizeCandidate(raw){
    if(!raw) return '';

    var s=decodeEntities(raw).trim();

    s=s.replace(/\\\//g,'/').replace(/\\u002f/gi,'/');
    s=s.replace(/^url\((['"]?)/i,'').replace(/(['"]?)\)$/,'');

    var absolute=s.indexOf('https://');

    if(absolute<0) absolute=s.indexOf('http://');

    if(absolute>0) s=s.slice(absolute);

    if(s.indexOf('//')===0) s='https:'+s;

    if(!/^https?:\/\//i.test(s)) return '';

    s=s.split(/["'<>\s\\,}\]]/)[0];
    s=s.replace(/[);]+$/,'');

    return s;
  }

  function validImage(u,meta){
    if(!u) return false;

    if(
      !/^https?:\/\/(?:static|thb)\.tildacdn\.com\//i.test(u) &&
      !/\.(?:jpe?g|png|webp|gif|avif)(?:[?#]|$)/i.test(u)
    ){
      return false;
    }

    var excludes=(meta&&meta.excludePatterns)||[];

    for(var i=0;i<excludes.length;i++){
      try{
        if(new RegExp(excludes[i],'i').test(u)) return false;
      }catch(e){
        if(u.indexOf(excludes[i])>=0) return false;
      }
    }

    if(/(?:blank\.gif|empty\.png|pixel|favicon|icon-)/i.test(u)) return false;

    return true;
  }

  function addRaw(list,seen,raw,meta){
    if(!raw) return;

    var decoded=decodeEntities(raw)
      .replace(/\\\//g,'/')
      .replace(/\\u002f/gi,'/');

    var rx=/https?:\/\/(?:static|thb)\.tildacdn\.com\/[^"'<>\s\\,}\]]+/gi;

    var m,found=false;

    while((m=rx.exec(decoded))){
      found=true;
      push(m[0]);
    }

    if(!found){
      decoded.split(',').forEach(function(part){
        push(part.trim().split(/\s+/)[0]);
      });
    }

    function push(rawUrl){
      var u=normalizeCandidate(rawUrl);

      if(!validImage(u,meta)) return;

      var key=u.replace(/[?#].*$/,'');

      if(seen[key]) return;

      seen[key]=1;
      list.push(u);
    }
  }

  function extractLegacyImages(doc,meta){
    var list=[],seen=Object.create(null);

    var scope=(meta.recordId&&doc.getElementById(meta.recordId))||doc;

    var attrs=[
      'data-original',
      'data-src',
      'data-lazy-src',
      'data-img-zoom-url',
      'data-bg',
      'data-bg-img',
      'data-original-src',
      'src',
      'srcset',
      'data-gallery-img',
      'data-zoom-target',
      'data-content-cover-bg'
    ];

    scope.querySelectorAll('*').forEach(function(el){
      attrs.forEach(function(a){
        if(el.hasAttribute&&el.hasAttribute(a)){
          addRaw(list,seen,el.getAttribute(a),meta);
        }
      });

      if(el.attributes){
        Array.prototype.forEach.call(el.attributes,function(attr){
          if(
            attr &&
            attr.value &&
            /tildacdn\.com|li_img|imgurl|image/i.test(attr.value)
          ){
            addRaw(list,seen,attr.value,meta);
          }
        });
      }

      var style=el.getAttribute&&el.getAttribute('style');

      if(style){
        addRaw(list,seen,style,meta);
      }
    });

    addRaw(list,seen,scope.outerHTML||'',meta);

    return list;
  }

  function mergeGallery(slug,imgs){
    var api=window.FilinMasterProductV3;
    var p=api&&api.profiles&&api.profiles[slug];

    if(!p||!imgs||!imgs.length) return false;

    p.overview=p.overview||{};

    var merged=[],seen=Object.create(null);

    (p.overview.galleryImages||[]).concat(imgs).forEach(function(u){
      u=normalizeCandidate(u);

      var meta=p.registryMeta&&p.registryMeta.legacyGallery;

      if(!validImage(u,meta)) return;

      var key=u.replace(/[?#].*$/,'');

      if(seen[key]) return;

      seen[key]=1;
      merged.push(u);
    });

    if(!merged.length) return false;

    p.overview.galleryImages=merged;

    api.apply();

    state.hydrated[slug]=true;

    console.info(
      '[Master Product V3 Registry] LEGACY GALLERY HYDRATED',
      {
        slug:slug,
        images:merged.length,
        galleryImages:merged.slice()
      }
    );

    return true;
  }

  function hydrateCurrentLegacyGallery(){
    var slug=currentSlug();

    var api=window.FilinMasterProductV3;
    var p=api&&api.profiles&&api.profiles[slug];

    var meta=p&&p.registryMeta&&p.registryMeta.legacyGallery;

    if(!slug||!meta||!meta.url||state.hydrated[slug]) return;

    state.hydrated[slug]='loading';

    fetch(meta.url,{
      credentials:'same-origin',
      cache:'no-store'
    })
      .then(function(r){
        if(!r.ok) throw new Error('HTTP '+r.status);
        return r.text();
      })
      .then(function(html){
        var doc=new DOMParser().parseFromString(html,'text/html');

        var imgs=extractLegacyImages(doc,meta);

        console.info(
          '[Master Product V3 Registry] LEGACY GALLERY FOUND',
          {
            slug:slug,
            images:imgs.length
          }
        );

        if(!mergeGallery(slug,imgs)){
          state.hydrated[slug]=false;
        }
      })
      .catch(function(err){
        state.hydrated[slug]=false;

        console.warn(
          '[Master Product V3 Registry] LEGACY GALLERY FAILED',
          slug,
          err
        );
      });
  }

  function scheduleLegacyGallery(){
    [80,350,900,1800,3200].forEach(function(ms){
      setTimeout(hydrateCurrentLegacyGallery,ms);
    });
  }

  window.FilinMasterProductV3Registry=Object.freeze({
    version:VERSION,
    externalProfiles:EXTERNAL_PROFILES,
    aliases:ALIASES,

    apply:function(){
      seedAndInstall();
      scheduleLegacyGallery();
    },

    get:function(slug){
      var api=window.FilinMasterProductV3;

      var key=ALIASES[String(slug||'')]||String(slug||'');

      return api&&api.profiles
        ? api.profiles[key]||null
        : null;
    }
  });
})();


/* FILIN LABS — MASTER PRODUCT V3 REGISTRY INTERACTIONS V1
   Generic interaction layer for frozen Golden Standard V3.3.2.
   Adds:
   - full-size gallery lightbox
   - automatic gallery rotation
   - subtle BUY NOW pulse
   - 50/50 mobile BUY NOW split
*/
(function(){
  'use strict';

  if(window.__FILIN_MASTER_PRODUCT_V3_REGISTRY_INTERACTIONS_V1__) return;

  window.__FILIN_MASTER_PRODUCT_V3_REGISTRY_INTERACTIONS_V1__=true;

  var ROOT_ID='filin-master-product-v3';
  var STYLE_ID='filin-master-product-v3-registry-interactions-v1-style';
  var LIGHTBOX_ID='filin-master-product-v3-lightbox';

  var AUTOPLAY_MS=4200;
  var USER_PAUSE_MS=7000;
  var MAX_MOBILE=820;

  var IX={root:null,token:null,autoplay:null};

  function installStyle(){
    if(document.getElementById(STYLE_ID)) return;

    var s=document.createElement('style');

    s.id=STYLE_ID;

    s.textContent=`
      #${ROOT_ID} .v3-main-img{cursor:zoom-in!important}

      @keyframes filinV3BuyPulse{
        0%,100%{
          transform:scale(1);
          filter:brightness(1);
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,.72),
            inset 0 0 0 5px rgba(115,72,34,.28),
            0 0 0 0 rgba(188,140,94,0)
        }
        50%{
          transform:scale(1.012);
          filter:brightness(1.055);
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,.8),
            inset 0 0 0 5px rgba(115,72,34,.24),
            0 0 0 10px rgba(188,140,94,.10)
        }
      }

      #${ROOT_ID} .v3-buy{
        animation:filinV3BuyPulse 2.6s ease-in-out infinite!important;
        transform-origin:center center!important;
        will-change:transform,filter,box-shadow
      }

      #${ROOT_ID} .v3-buy:hover,
      #${ROOT_ID} .v3-buy:focus-visible{
        animation-play-state:paused!important
      }

      #${LIGHTBOX_ID}{
        position:fixed;
        inset:0;
        z-index:2147483000;
        display:none;
        align-items:center;
        justify-content:center;
        background:rgba(0,0,0,.92);
        padding:24px
      }

      #${LIGHTBOX_ID}.open{
        display:flex
      }

      #${LIGHTBOX_ID} .fpv3-lb-frame{
        position:relative;
        width:min(96vw,1800px);
        height:min(92vh,1100px);
        display:flex;
        align-items:center;
        justify-content:center
      }

      #${LIGHTBOX_ID} .fpv3-lb-img{
        display:block;
        max-width:100%;
        max-height:100%;
        width:auto;
        height:auto;
        object-fit:contain;
        cursor:zoom-out;
        user-select:none;
        -webkit-user-drag:none
      }

      #${LIGHTBOX_ID} .fpv3-lb-close,
      #${LIGHTBOX_ID} .fpv3-lb-prev,
      #${LIGHTBOX_ID} .fpv3-lb-next{
        position:absolute;
        z-index:3;
        width:46px;
        height:46px;
        display:grid;
        place-items:center;
        border:1px solid rgba(255,255,255,.48);
        border-radius:50%;
        background:rgba(20,20,20,.62);
        color:#fff;
        font-family:Montserrat,Arial,sans-serif;
        font-size:28px;
        line-height:1;
        cursor:pointer;
        backdrop-filter:blur(5px)
      }

      #${LIGHTBOX_ID} .fpv3-lb-close{
        top:4px;
        right:4px;
        font-size:24px
      }

      #${LIGHTBOX_ID} .fpv3-lb-prev{
        left:4px;
        top:50%;
        transform:translateY(-50%)
      }

      #${LIGHTBOX_ID} .fpv3-lb-next{
        right:4px;
        top:50%;
        transform:translateY(-50%)
      }

      #${LIGHTBOX_ID} .fpv3-lb-count{
        position:absolute;
        left:50%;
        bottom:4px;
        transform:translateX(-50%);
        padding:6px 11px;
        border-radius:999px;
        background:rgba(20,20,20,.62);
        color:#fff;
        font:600 12px/1 Montserrat,Arial,sans-serif;
        letter-spacing:.03em
      }

      @media(max-width:${MAX_MOBILE}px){
        #${ROOT_ID} .v3-buy{
          display:grid!important;
          grid-template-columns:1fr 1fr!important;
          align-items:stretch!important;
          justify-content:stretch!important;
          gap:0!important;
          padding:0!important;
          overflow:hidden!important
        }

        #${ROOT_ID} .v3-buy-label,
        #${ROOT_ID} .v3-buy-price{
          position:static!important;
          inset:auto!important;
          transform:none!important;
          display:flex!important;
          align-items:center!important;
          justify-content:center!important;
          width:100%!important;
          height:100%!important;
          min-height:88px!important;
          margin:0!important;
          padding:0 10px!important;
          white-space:nowrap!important
        }

        #${ROOT_ID} .v3-buy-label{
          font-size:22px!important;
          line-height:1!important
        }

        #${ROOT_ID} .v3-buy-price{
          border-left:1px solid rgba(255,255,255,.65)!important;
          font-size:21px!important;
          line-height:1!important;
          font-weight:850!important
        }

        #${LIGHTBOX_ID}{
          padding:10px
        }

        #${LIGHTBOX_ID} .fpv3-lb-frame{
          width:100%;
          height:94vh
        }

        #${LIGHTBOX_ID} .fpv3-lb-close,
        #${LIGHTBOX_ID} .fpv3-lb-prev,
        #${LIGHTBOX_ID} .fpv3-lb-next{
          width:40px;
          height:40px;
          font-size:24px
        }
      }

      @media(prefers-reduced-motion:reduce){
        #${ROOT_ID} .v3-buy{
          animation:none!important
        }
      }
    `;

    document.head.appendChild(s);
  }

  function getImages(root){
    return Array.prototype.slice
      .call(root.querySelectorAll('.v3-thumb img'))
      .map(function(img){
        return img.currentSrc ||
          img.src ||
          img.getAttribute('src') ||
          '';
      })
      .filter(Boolean);
  }

  function getCurrentIndex(root,images){
    var active=root.querySelector('.v3-thumb.active');

    if(active && active.dataset.i!=null){
      return Number(active.dataset.i)||0;
    }

    var main=root.querySelector('.v3-main-img');

    var src=main && (
      main.currentSrc ||
      main.src ||
      main.getAttribute('src')
    );

    var found=images.indexOf(src);

    return found>=0 ? found : 0;
  }

  function clickIndex(root,index){
    var thumbs=root.querySelectorAll('.v3-thumb');
    var n=thumbs.length;

    if(!n) return;

    index=(index+n)%n;

    var target=thumbs[index];

    if(target) target.click();
  }

  function ensureLightbox(){
    var lb=document.getElementById(LIGHTBOX_ID);

    if(lb) return lb;

    lb=document.createElement('div');

    lb.id=LIGHTBOX_ID;
    lb.setAttribute('aria-hidden','true');

    lb.innerHTML=
      '<div class="fpv3-lb-frame">' +
        '<img class="fpv3-lb-img" alt="">' +
        '<button type="button" class="fpv3-lb-close" aria-label="Close">×</button>' +
        '<button type="button" class="fpv3-lb-prev" aria-label="Previous image">‹</button>' +
        '<button type="button" class="fpv3-lb-next" aria-label="Next image">›</button>' +
        '<div class="fpv3-lb-count"></div>' +
      '</div>';

    document.body.appendChild(lb);

    return lb;
  }

  function bindLightbox(root){
    var main=root.querySelector('.v3-main-img');

    if(!main || main.dataset.fpv3LightboxBound==='1') return;

    main.dataset.fpv3LightboxBound='1';

    var lb=ensureLightbox();

    var lbImg=lb.querySelector('.fpv3-lb-img');
    var count=lb.querySelector('.fpv3-lb-count');

    var current=0;
    var images=[];

    function render(i){
      images=getImages(root);

      if(!images.length){
        var src=
          main.currentSrc ||
          main.src ||
          main.getAttribute('src');

        if(src) images=[src];
      }

      if(!images.length) return;

      current=(i+images.length)%images.length;

      lbImg.src=images[current];

      count.textContent=
        (current+1)+' / '+images.length;

      lb.querySelector('.fpv3-lb-prev').style.display=
        images.length>1 ? '' : 'none';

      lb.querySelector('.fpv3-lb-next').style.display=
        images.length>1 ? '' : 'none';
    }

    function open(){
      images=getImages(root);

      current=getCurrentIndex(root,images);

      render(current);

      lb.classList.add('open');
      lb.setAttribute('aria-hidden','false');

      document.documentElement.style.overflow='hidden';

      pauseAutoplay(root,USER_PAUSE_MS);
    }

    function close(){
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden','true');

      document.documentElement.style.overflow='';

      resumeAutoplay(root,700);
    }

    main.addEventListener('click',function(e){
      e.preventDefault();
      e.stopPropagation();
      open();
    });

    lb.querySelector('.fpv3-lb-close')
      .addEventListener('click',function(e){
        e.stopPropagation();
        close();
      });

    lb.querySelector('.fpv3-lb-prev')
      .addEventListener('click',function(e){
        e.stopPropagation();
        render(current-1);
      });

    lb.querySelector('.fpv3-lb-next')
      .addEventListener('click',function(e){
        e.stopPropagation();
        render(current+1);
      });

    lbImg.addEventListener('click',function(e){
      e.stopPropagation();
      close();
    });

    lb.addEventListener('click',function(e){
      if(e.target===lb) close();
    });

    if(!window.__FILIN_V3_LB_KEY_BOUND__){
      window.__FILIN_V3_LB_KEY_BOUND__=true;

      document.addEventListener('keydown',function(e){
        var activeLb=document.getElementById(LIGHTBOX_ID);

        if(!activeLb || !activeLb.classList.contains('open')) return;

        if(e.key==='Escape'){
          activeLb.querySelector('.fpv3-lb-close').click();
        }

        if(e.key==='ArrowLeft'){
          activeLb.querySelector('.fpv3-lb-prev').click();
        }

        if(e.key==='ArrowRight'){
          activeLb.querySelector('.fpv3-lb-next').click();
        }
      });
    }
  }

  function stopAutoplay(root){
    if(root.__fpv3GalleryTimer){
      clearInterval(root.__fpv3GalleryTimer);
      root.__fpv3GalleryTimer=null;
    }

    if(root.__fpv3ResumeTimer){
      clearTimeout(root.__fpv3ResumeTimer);
      root.__fpv3ResumeTimer=null;
    }
  }

  function startAutoplay(root){
    stopAutoplay(root);

    var thumbs=root.querySelectorAll('.v3-thumb');

    if(thumbs.length<2) return;

    if(
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ){
      return;
    }

    root.__fpv3GalleryTimer=setInterval(function(){
      if(!document.documentElement.contains(root)){
        stopAutoplay(root);
        return;
      }

      var lb=document.getElementById(LIGHTBOX_ID);

      if(lb && lb.classList.contains('open')) return;

      var images=getImages(root);
      var idx=getCurrentIndex(root,images);

      clickIndex(root,idx+1);
    },AUTOPLAY_MS);
  }

  function pauseAutoplay(root,ms){
    if(root.__fpv3GalleryTimer){
      clearInterval(root.__fpv3GalleryTimer);
      root.__fpv3GalleryTimer=null;
    }

    if(root.__fpv3ResumeTimer){
      clearTimeout(root.__fpv3ResumeTimer);
    }

    root.__fpv3ResumeTimer=setTimeout(function(){
      startAutoplay(root);
    },ms||USER_PAUSE_MS);
  }

  function resumeAutoplay(root,delay){
    if(root.__fpv3ResumeTimer){
      clearTimeout(root.__fpv3ResumeTimer);
    }

    root.__fpv3ResumeTimer=setTimeout(function(){
      startAutoplay(root);
    },delay||0);
  }

  function bindAutoplay(root){
    if(root.dataset.fpv3AutoplayBound==='1'){
      return;
    }

    var gallery=root.querySelector('.v3-gallery');

    if(!gallery){
      return;
    }

    root.dataset.fpv3AutoplayBound='1';

    ['pointerdown','touchstart','wheel'].forEach(function(type){
      gallery.addEventListener(
        type,
        function(){
          pauseAutoplay(root,USER_PAUSE_MS);
        },
        {passive:true}
      );
    });

    gallery.addEventListener('mouseenter',function(){
      if(root.__fpv3GalleryTimer){
        clearInterval(root.__fpv3GalleryTimer);
        root.__fpv3GalleryTimer=null;
      }
    });

    gallery.addEventListener('mouseleave',function(){
      resumeAutoplay(root,500);
    });

    /* single delegated handler instead of one listener per thumb/arrow */
    root.addEventListener('click',function(e){
      if(e.target.closest('.v3-gallery-arrow,.v3-thumb')){
        pauseAutoplay(root,USER_PAUSE_MS);
      }
    });

    startAutoplay(root);
  }

function computeToken(root){
  var imgs=root.querySelectorAll('.v3-thumb img');
  var srcs=Array.prototype.map.call(imgs,function(img){
    return img.currentSrc||img.src||img.getAttribute('src')||'';
  });
  return imgs.length+'|'+srcs.join(',');
}

function applyInteractions(root){
  if(!root) return;

  var token=computeToken(root);

  /* same root + same gallery content already wired: skip re-init */
  if(IX.root===root && IX.token===token) return;

  if(IX.autoplay){
    clearInterval(IX.autoplay);
    IX.autoplay=null;
  }

  installStyle();
  bindLightbox(root);
  bindAutoplay(root);

  IX.root=root;
  IX.token=token;
  IX.autoplay=root.__fpv3GalleryTimer||null;

  console.info(
    '[Master Product V3] INTERACTIONS V1 APPLIED',
    {
      galleryImages:getImages(root).length,
      autoplayMs:AUTOPLAY_MS
    }
  );
}

  /*
    Public apply() must ALWAYS go through safeApply().

    This prevents external code from bypassing the
    IX root+token idempotency guard.
  */
  function apply(){
    safeApply();
  }

  function safeApply(){
    var root=document.getElementById(ROOT_ID);
    applyInteractions(root);
  }

  if(document.readyState==='loading'){
    document.addEventListener(
      'DOMContentLoaded',
      safeApply,
      {once:true}
    );
  }else{
    safeApply();
  }

  var mo=new MutationObserver(function(){
    safeApply();
  });

  mo.observe(document.documentElement,{
    childList:true,
    subtree:true
  });

  function disconnectRegistryObserver(){
    if(!mo) return;
    try{ mo.disconnect(); }catch(e){}
    mo=null;
  }

  /* product build is done and stable: stop watching the whole page */
  document.addEventListener('filin:product:ready',function(){
    safeApply();
    disconnectRegistryObserver();
  },{once:true});

  setTimeout(disconnectRegistryObserver,20000);

  window.FilinMasterProductV3RegistryInteractions=
    Object.freeze({
      version:'1.0.0',
      apply:apply
    });

})();
