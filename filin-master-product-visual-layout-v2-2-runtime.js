/* FILIN LABS — MASTER PRODUCT VISUAL / LAYOUT V2.2
   Safe presentation layer for MASTER PRODUCT V2.
   Requires FULL PRODUCT PROFILE V2.1 to run first.
   Purpose:
   - keep Quadron data/profile untouched
   - remove residual Grand Tower text/empty layout artifacts
   - reproduce the approved Grand Tower desktop/mobile UX
   - desktop tabs + horizontal Perfect Matches
   - mobile accordions + compact typography + clean spacing
*/
(function () {
  'use strict';

  if (window.__FILIN_MASTER_VISUAL_LAYOUT_V22__) return;
  window.__FILIN_MASTER_VISUAL_LAYOUT_V22__ = true;

  const STYLE_ID = 'filin-master-visual-layout-v22';

  function readSeed() {
    try {
      const el = document.getElementById('product-data');
      return el ? JSON.parse(el.textContent || '{}') : {};
    } catch (_) {
      return {};
    }
  }

  function isTargetPage() {
    return String(readSeed().slug || '') === 'filin_audio_quadron';
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      :root{
        --fp-v22-bg:#fffbf7;
        --fp-v22-ink:#1e1b18;
        --fp-v22-muted:#6e6862;
        --fp-v22-line:#ead7c0;
        --fp-v22-gold:#bc8c5e;
        --fp-v22-gold-dark:#8c6239;
        --fp-v22-brown:#2c1f0c;
      }

      html[data-filin-full-profile="filin_audio_quadron"] body,
      html[data-filin-full-profile="filin_audio_quadron"] .js-product,
      html[data-filin-full-profile="filin_audio_quadron"] .js-product *{
        font-family:'Montserrat',Arial,sans-serif !important;
        box-sizing:border-box;
      }

      /* Kill visual residue without touching valid Quadron blocks */
      [data-fp-v22-legacy-hidden="1"]{
        display:none !important;
        visibility:hidden !important;
        height:0 !important;
        min-height:0 !important;
        max-height:0 !important;
        margin:0 !important;
        padding:0 !important;
        border:0 !important;
        overflow:hidden !important;
      }

      .js-product{
        width:100% !important;
        max-width:none !important;
        margin:0 !important;
        padding:0 !important;
        background:var(--fp-v22-bg) !important;
        color:var(--fp-v22-ink) !important;
      }

      .purchase-container{
        width:100% !important;
        max-width:none !important;
        margin:0 !important;
        padding:28px 0 0 !important;
        border-radius:0 !important;
        background:var(--fp-v22-bg) !important;
        text-align:center !important;
      }

      .purchase-container .price-title{
        margin:0 !important;
        padding:24px 20px 20px !important;
        font-size:23px !important;
        line-height:1.25 !important;
        font-weight:800 !important;
        color:#26211d !important;
      }

      .buy-btn{
        position:relative !important;
        width:100vw !important;
        min-height:136px !important;
        margin:0 0 32px calc(50% - 50vw) !important;
        padding:28px 48px !important;
        display:flex !important;
        align-items:center !important;
        justify-content:center !important;
        gap:26px !important;
        text-decoration:none !important;
        text-transform:uppercase !important;
        font-size:31px !important;
        line-height:1 !important;
        letter-spacing:.035em !important;
        font-weight:800 !important;
        color:#fff !important;
        border-radius:0 !important;
        border:2px solid #7b522c !important;
        background:
          linear-gradient(115deg,#81572f 0%,#a97543 14%,#c59661 31%,#e3c28f 45%,#f1d6a7 50%,#d4a66d 58%,#a97543 78%,#81572f 100%) !important;
        background-size:240% 100% !important;
        box-shadow:
          inset 0 0 0 1px rgba(255,255,255,.70),
          inset 0 0 0 5px rgba(115,72,34,.30),
          inset 0 0 0 7px rgba(255,231,193,.34),
          0 7px 22px rgba(67,42,21,.16) !important;
        overflow:hidden !important;
      }

      .buy-btn::before{
        content:"";
        position:absolute;
        inset:9px 12px;
        border:1px solid rgba(255,247,229,.76);
        box-shadow:0 0 0 2px rgba(111,68,31,.30);
        pointer-events:none;
      }

      .fp-v22-mobile-buy-price{
        display:none;
      }

      /* Perfect Matches — desktop approved composition */
      .perfect-matches-block{
        width:calc(100% - 40px) !important;
        max-width:1500px !important;
        margin:0 auto 28px !important;
        padding:26px 34px 22px !important;
        background:#fff !important;
        border:1px solid var(--fp-v22-line) !important;
        border-radius:8px !important;
        box-shadow:0 4px 18px rgba(72,49,27,.035) !important;
      }

      .pm-title{
        margin:0 0 12px !important;
        color:var(--fp-v22-gold) !important;
        text-align:center !important;
        text-transform:uppercase !important;
        font-size:20px !important;
        line-height:1.2 !important;
        font-weight:800 !important;
      }

      .pm-desc{
        max-width:760px !important;
        margin:0 auto 22px !important;
        color:#69635d !important;
        font-size:14px !important;
        line-height:1.5 !important;
        text-align:center !important;
      }

      .pm-formula{
        display:flex !important;
        flex-wrap:wrap !important;
        align-items:center !important;
        justify-content:center !important;
        gap:10px !important;
        margin:0 auto !important;
      }

      .pm-item{
        min-height:42px !important;
        padding:10px 14px !important;
        display:inline-flex !important;
        align-items:center !important;
        justify-content:center !important;
        gap:8px !important;
        border:1px solid #dfc6a9 !important;
        border-radius:5px !important;
        background:#fffdfb !important;
        color:#514a44 !important;
        font-size:15px !important;
        line-height:1.25 !important;
      }

      .pm-item a{
        color:#ff6c55 !important;
        text-decoration:none !important;
      }

      .pm-base{
        background:#f1f1f1 !important;
        border-color:#d7d7d7 !important;
        font-weight:600 !important;
      }

      .pm-result{
        min-height:42px !important;
        padding:10px 18px !important;
        display:inline-flex !important;
        align-items:center !important;
        justify-content:center !important;
        border-radius:5px !important;
        background:var(--fp-v22-gold) !important;
        color:#fff !important;
        font-size:15px !important;
        font-weight:800 !important;
      }

      .pm-plus,.pm-equals{
        color:#938c84 !important;
        font-weight:800 !important;
      }

      .pm-discount{
        display:table !important;
        margin:16px auto 0 !important;
        padding:8px 12px !important;
        border-left:2px solid var(--fp-v22-gold) !important;
        background:#fbf5ee !important;
        color:#57514b !important;
        font-size:12px !important;
        line-height:1.35 !important;
      }

      .fp-v22-pm-toggle{
        display:none;
      }

      /* Desktop tabs */
      .tabs-wrapper{
        width:100% !important;
        max-width:none !important;
        margin:0 !important;
        padding:0 !important;
        background:var(--fp-v22-bg) !important;
      }

      .tabs-header{
        width:100% !important;
        display:grid !important;
        grid-template-columns:repeat(6,minmax(0,1fr)) !important;
        border-bottom:1px solid #e5ddd4 !important;
        background:var(--fp-v22-bg) !important;
      }

      .tab-btn{
        min-height:76px !important;
        padding:16px 10px !important;
        border:0 !important;
        border-bottom:2px solid transparent !important;
        background:transparent !important;
        color:#727171 !important;
        font-size:12px !important;
        line-height:1.25 !important;
        font-weight:700 !important;
        text-transform:uppercase !important;
        cursor:pointer !important;
      }

      .tab-btn.active{
        color:var(--fp-v22-gold) !important;
        border-bottom-color:var(--fp-v22-gold) !important;
      }

      .tab-content > .content-container{
        width:calc(100% - 80px) !important;
        max-width:1180px !important;
        margin:0 auto !important;
        padding:34px 0 54px !important;
        color:var(--fp-v22-ink) !important;
        text-align:left !important;
      }

      .description-content{
        font-size:16px !important;
        line-height:1.65 !important;
      }

      .description-content h3{
        margin:0 0 12px !important;
        padding-left:10px !important;
        border-left:2px solid var(--fp-v22-gold) !important;
        font-size:20px !important;
        line-height:1.3 !important;
        font-weight:700 !important;
      }

      .description-content p{
        margin:0 0 18px !important;
      }

      .specs-table{
        width:100% !important;
        border-collapse:collapse !important;
        font-size:14px !important;
        line-height:1.45 !important;
      }

      .specs-table td{
        padding:14px 12px !important;
        vertical-align:top !important;
        border-bottom:1px solid #e5ddd4 !important;
      }

      .specs-table td:first-child{
        width:28% !important;
        font-weight:700 !important;
      }

      .options-list{
        max-width:760px !important;
        margin:0 auto !important;
      }

      .options-list label{
        display:flex !important;
        align-items:flex-start !important;
        gap:10px !important;
        margin:0 !important;
        padding:13px 4px !important;
        border-bottom:1px solid #e5ddd4 !important;
        font-size:15px !important;
        line-height:1.4 !important;
      }

      .fp-v22-mobile-tab-toggle{
        display:none;
      }

      /* Curation */
      .fp-curation{
        width:calc(100% - 80px) !important;
        max-width:1180px !important;
        margin:18px auto 44px !important;
        padding:0 !important;
        display:grid !important;
        grid-template-columns:repeat(4,minmax(0,1fr)) !important;
        gap:28px 34px !important;
      }

      .fp-curation-item{
        min-width:0 !important;
        margin:0 !important;
        padding:0 !important;
      }

      .fp-curation-copy h3{
        margin:0 0 10px !important;
        font-size:13px !important;
        line-height:1.25 !important;
        font-weight:800 !important;
        text-transform:uppercase !important;
      }

      .fp-curation-copy p{
        margin:0 !important;
        font-size:13px !important;
        line-height:1.45 !important;
      }

      /* Reduce accidental Tilda gaps around known Master sections */
      .js-product,
      .js-product .purchase-container,
      .js-product .tabs-wrapper{
        min-height:0 !important;
      }

      @media (max-width:820px){
        .purchase-container{
          padding-top:0 !important;
        }

        .purchase-container .price-title{
          display:none !important;
        }

        .buy-btn{
          width:calc(100% - 20px) !important;
          min-height:68px !important;
          margin:12px auto 12px !important;
          padding:15px 20px !important;
          border-radius:7px !important;
          font-size:16px !important;
          justify-content:space-between !important;
          letter-spacing:.02em !important;
        }

        .buy-btn::before{
          inset:5px 7px !important;
          border-radius:4px !important;
        }

        .fp-v22-mobile-buy-price{
          display:inline-flex !important;
          align-items:center !important;
          font-size:12px !important;
          letter-spacing:0 !important;
          white-space:nowrap !important;
          opacity:.95 !important;
        }

        .perfect-matches-block{
          width:calc(100% - 20px) !important;
          margin:0 auto 12px !important;
          padding:0 !important;
          border-radius:7px !important;
          overflow:hidden !important;
        }

        .pm-title{
          display:none !important;
        }

        .fp-v22-pm-toggle{
          width:100% !important;
          min-height:58px !important;
          padding:13px 16px !important;
          display:flex !important;
          align-items:center !important;
          justify-content:space-between !important;
          gap:12px !important;
          border:0 !important;
          background:#fff !important;
          color:#3b322a !important;
          text-align:left !important;
          cursor:pointer !important;
          font-size:12px !important;
          line-height:1.3 !important;
          font-weight:800 !important;
          text-transform:uppercase !important;
        }

        .fp-v22-pm-toggle::after{
          content:"+";
          width:24px;
          height:24px;
          display:flex;
          align-items:center;
          justify-content:center;
          flex:0 0 24px;
          border:1px solid #dfc6a9;
          border-radius:50%;
          color:var(--fp-v22-gold-dark);
          font-size:16px;
          font-weight:500;
        }

        .perfect-matches-block.fp-v22-open .fp-v22-pm-toggle::after{
          content:"−";
        }

        .perfect-matches-block:not(.fp-v22-open) .pm-desc,
        .perfect-matches-block:not(.fp-v22-open) .pm-formula,
        .perfect-matches-block:not(.fp-v22-open) .pm-discount{
          display:none !important;
        }

        .perfect-matches-block.fp-v22-open .pm-desc{
          display:block !important;
          padding:12px 16px 0 !important;
          margin:0 auto 14px !important;
          font-size:12px !important;
        }

        .perfect-matches-block.fp-v22-open .pm-formula{
          display:flex !important;
          padding:0 12px !important;
          flex-direction:column !important;
          align-items:stretch !important;
          gap:7px !important;
        }

        .perfect-matches-block.fp-v22-open .pm-item,
        .perfect-matches-block.fp-v22-open .pm-result{
          width:100% !important;
          min-height:42px !important;
          justify-content:flex-start !important;
          font-size:12px !important;
        }

        .perfect-matches-block.fp-v22-open .pm-result{
          justify-content:center !important;
        }

        .perfect-matches-block.fp-v22-open .pm-plus,
        .perfect-matches-block.fp-v22-open .pm-equals{
          display:none !important;
        }

        .perfect-matches-block.fp-v22-open .pm-discount{
          display:block !important;
          margin:12px !important;
          font-size:11px !important;
        }

        /* Mobile: product tabs become independent accordion rows */
        .tabs-header{
          display:none !important;
        }

        .fp-v22-mobile-tab-toggle{
          width:calc(100% - 20px) !important;
          min-height:56px !important;
          margin:0 auto !important;
          padding:13px 16px !important;
          display:flex !important;
          align-items:center !important;
          justify-content:space-between !important;
          gap:12px !important;
          border:0 !important;
          border-bottom:1px solid #e5ddd4 !important;
          background:#fff !important;
          color:#3b322a !important;
          text-align:left !important;
          font-size:12px !important;
          line-height:1.3 !important;
          font-weight:800 !important;
          text-transform:uppercase !important;
          cursor:pointer !important;
        }

        .fp-v22-mobile-tab-toggle::after{
          content:"+";
          width:24px;
          height:24px;
          display:flex;
          align-items:center;
          justify-content:center;
          flex:0 0 24px;
          border:1px solid #dfc6a9;
          border-radius:50%;
          color:var(--fp-v22-gold-dark);
          font-size:16px;
          font-weight:500;
        }

        .fp-v22-mobile-tab-toggle.fp-v22-open::after{
          content:"−";
        }

        .tabs-wrapper .tab-content{
          display:none !important;
        }

        .tabs-wrapper .tab-content.fp-v22-mobile-open{
          display:block !important;
        }

        .tab-content > .content-container{
          width:calc(100% - 20px) !important;
          margin:0 auto !important;
          padding:18px 12px 24px !important;
          background:#fff !important;
        }

        .description-content{
          font-size:13px !important;
          line-height:1.55 !important;
        }

        .description-content h3{
          font-size:15px !important;
          margin-bottom:10px !important;
        }

        .description-content p{
          margin-bottom:13px !important;
        }

        .specs-table{
          font-size:12px !important;
          line-height:1.4 !important;
        }

        .specs-table,
        .specs-table tbody,
        .specs-table tr,
        .specs-table td{
          display:block !important;
          width:100% !important;
        }

        .specs-table tr{
          padding:10px 0 !important;
          border-bottom:1px solid #e5ddd4 !important;
        }

        .specs-table td{
          padding:3px 0 !important;
          border:0 !important;
        }

        .specs-table td:first-child{
          width:100% !important;
          margin-bottom:4px !important;
          font-weight:800 !important;
        }

        .options-list label{
          padding:11px 0 !important;
          font-size:12px !important;
        }

        .fp-curation{
          width:calc(100% - 20px) !important;
          margin:8px auto 22px !important;
          display:block !important;
        }

        .fp-curation-item{
          display:grid !important;
          grid-template-columns:26px minmax(0,1fr) !important;
          gap:10px !important;
          padding:14px 2px !important;
          border-bottom:1px solid #e5ddd4 !important;
        }

        .fp-curation-icon{
          width:22px !important;
          min-width:22px !important;
          margin-top:1px !important;
        }

        .fp-curation-copy h3{
          font-size:11px !important;
          margin-bottom:7px !important;
        }

        .fp-curation-copy p{
          font-size:11px !important;
          line-height:1.45 !important;
          overflow-wrap:anywhere !important;
        }

        /* Prevent off-screen horizontal overflow */
        .js-product,
        .tabs-wrapper,
        .perfect-matches-block,
        .fp-curation{
          overflow-x:hidden !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function normalizedText(el) {
    return String(el && el.innerText || '').replace(/\s+/g, ' ').trim();
  }

  function hideLegacyGrandTowerResidue() {
    const safeRoots = [
      '.js-product',
      '.fp-curation',
      '.fp-product-overview',
      '#t-header',
      '#t-footer'
    ];

    const markers = [
      /Advanced Crossover Engineering/i,
      /massive 100 kg system/i,
      /P\.Audio titanium/i,
      /Sonido 15/i,
      /Audioinstrument Grand Tower/i,
      /three-way floorstanding loudspeaker/i
    ];

    let hidden = 0;

    const candidates = Array.from(
      document.querySelectorAll('h1,h2,h3,h4,p,li,.t-text,.t-descr,.tn-atom')
    );

    candidates.forEach(el => {
      const text = normalizedText(el);
      if (!text || !markers.some(re => re.test(text))) return;

      if (safeRoots.some(sel => el.closest(sel))) {
        // A known-good Master section may legitimately contain generic words,
        // so do not remove the whole root. Hide only the exact stale text node.
        if (el.closest('.js-product,.fp-curation,.fp-product-overview')) {
          el.setAttribute('data-fp-v22-legacy-hidden', '1');
          hidden++;
        }
        return;
      }

      const rec = el.closest('.t-rec,[id^="rec"]');
      if (rec) {
        const recText = normalizedText(rec);
        // Avoid killing large structural records unless the record is clearly old product copy.
        if (recText.length < 5000 && markers.some(re => re.test(recText))) {
          rec.setAttribute('data-fp-v22-legacy-hidden', '1');
          hidden++;
          return;
        }
      }

      el.setAttribute('data-fp-v22-legacy-hidden', '1');
      hidden++;
    });

    return hidden;
  }

  function collapseEmptyRecords() {
    let collapsed = 0;
    Array.from(document.querySelectorAll('.t-rec')).forEach(rec => {
      if (rec.querySelector('.js-product,.fp-curation,.fp-product-overview')) return;
      if (rec.querySelector('img,video,iframe,canvas,.t-bgimg,[style*="background-image"]')) return;

      const visibleText = normalizedText(rec);
      if (visibleText.length > 8) return;

      const r = rec.getBoundingClientRect();
      if (r.height < 70) return;

      rec.setAttribute('data-fp-v22-legacy-hidden', '1');
      collapsed++;
    });
    return collapsed;
  }

  function setupMobileBuyPrice() {
    const root = document.querySelector('.js-product');
    if (!root) return false;

    const btn = root.querySelector('.buy-btn');
    const price = root.querySelector('#main-price');
    if (!btn || !price) return false;

    let span = btn.querySelector('.fp-v22-mobile-buy-price');
    if (!span) {
      span = document.createElement('span');
      span.className = 'fp-v22-mobile-buy-price';
      btn.appendChild(span);
    }

    const sync = () => {
      const value = String(price.textContent || '').trim();
      span.textContent = value ? '$' + value : '';
    };

    sync();

    if (!price.dataset.fpV22Observed) {
      price.dataset.fpV22Observed = '1';
      new MutationObserver(sync).observe(price, {
        childList:true,
        characterData:true,
        subtree:true
      });
    }

    return true;
  }

  function setupPerfectMatchesAccordion() {
    const block = document.querySelector('.perfect-matches-block');
    if (!block) return false;

    let toggle = block.querySelector('.fp-v22-pm-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.type = 'button';
      toggle.className = 'fp-v22-pm-toggle';
      toggle.innerHTML =
        '<span><strong>Perfect Matches</strong><br><small>Recommended system synergy</small></span>';
      block.insertBefore(toggle, block.firstChild);
    }

    if (!toggle.dataset.fpV22Bound) {
      toggle.dataset.fpV22Bound = '1';
      toggle.addEventListener('click', () => {
        block.classList.toggle('fp-v22-open');
      });
    }

    return true;
  }

  function setupMobileTabAccordions() {
    const root = document.querySelector('.tabs-wrapper');
    if (!root) return 0;

    const headerButtons = Array.from(root.querySelectorAll('.tabs-header .tab-btn'));
    const contents = Array.from(root.querySelectorAll(':scope > .tab-content'));

    if (!headerButtons.length || !contents.length) return 0;

    let created = 0;

    headerButtons.forEach((btn, index) => {
      const content = contents[index];
      if (!content) return;

      let mobile = content.previousElementSibling;
      if (!mobile || !mobile.classList.contains('fp-v22-mobile-tab-toggle')) {
        mobile = document.createElement('button');
        mobile.type = 'button';
        mobile.className = 'fp-v22-mobile-tab-toggle';
        mobile.textContent = normalizedText(btn);
        root.insertBefore(mobile, content);
        created++;
      }

      if (!mobile.dataset.fpV22Bound) {
        mobile.dataset.fpV22Bound = '1';
        mobile.addEventListener('click', () => {
          const opening = !content.classList.contains('fp-v22-mobile-open');

          // Approved mobile behaviour: one section open at a time.
          root.querySelectorAll('.fp-v22-mobile-tab-toggle.fp-v22-open')
            .forEach(x => x.classList.remove('fp-v22-open'));
          root.querySelectorAll('.tab-content.fp-v22-mobile-open')
            .forEach(x => x.classList.remove('fp-v22-mobile-open'));

          if (opening) {
            mobile.classList.add('fp-v22-open');
            content.classList.add('fp-v22-mobile-open');
          }
        });
      }
    });

    // Mobile starts collapsed, as in the approved reference.
    if (window.matchMedia('(max-width:820px)').matches) {
      contents.forEach(x => x.classList.remove('fp-v22-mobile-open'));
      root.querySelectorAll('.fp-v22-mobile-tab-toggle')
        .forEach(x => x.classList.remove('fp-v22-open'));
    }

    return created;
  }

  function removeAccidentalSpacerNearCommerce() {
    const product = document.querySelector('.js-product');
    if (!product) return 0;

    let changed = 0;
    let p = product.parentElement;

    for (let depth = 0; depth < 4 && p; depth++, p = p.parentElement) {
      if (p.classList && p.classList.contains('t-rec')) {
        const style = getComputedStyle(p);
        const pt = parseFloat(style.paddingTop) || 0;
        const pb = parseFloat(style.paddingBottom) || 0;
        if (pt > 120 || pb > 120) {
          p.style.paddingTop = '0px';
          p.style.paddingBottom = '0px';
          changed++;
        }
      }
    }

    return changed;
  }

  function apply() {
    if (!isTargetPage()) return;

    injectStyles();

    const result = {
      staleHidden: hideLegacyGrandTowerResidue(),
      emptyRecordsCollapsed: collapseEmptyRecords(),
      commerceSpacerFixed: removeAccidentalSpacerNearCommerce(),
      mobileBuyPrice: setupMobileBuyPrice(),
      perfectMatchesAccordion: setupPerfectMatchesAccordion(),
      mobileTabToggles: setupMobileTabAccordions()
    };

    document.documentElement.setAttribute('data-fp-visual-layout', 'v2.2');
    console.info('[Master Product V2] VISUAL / LAYOUT V2.2 APPLIED', result);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', apply, {once:true});
  } else {
    apply();
  }

  setTimeout(apply, 600);
  setTimeout(apply, 1600);
  setTimeout(apply, 3200);
})();
