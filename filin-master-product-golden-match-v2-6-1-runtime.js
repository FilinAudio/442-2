/* FILIN LABS — MASTER PRODUCT GOLDEN MATCH V2.6
   Successor to Exact Layout V2.3.
   Requires Full Product Profile V2.1.
   V2.2 and V2.3 should be disabled.

   Fixes the remaining Golden Backup differences:
   - mobile hero height/title
   - exact black Handcrafted strip
   - Golden BUY NOW dimensions
   - Golden Perfect Matches width + divider + spacing
   - removes duplicate Grand Tower legacy commerce
   - uses native stacked product tabs (no fake "+" accordion rows)
   - migrates Reviews into the active Quadron tab set
   - short mobile sticky title
   - keeps Montserrat typography
   - Native Promotions / bottom horizontal scroller
*/
(function () {
  'use strict';

  if (window.__FILIN_MASTER_GOLDEN_MATCH_V26__) return;
  window.__FILIN_MASTER_GOLDEN_MATCH_V26__ = true;
  window.__FILIN_MASTER_GOLDEN_MATCH_V24__ = true; // compatibility guard

  var STYLE_ID = 'filin-master-golden-match-v26';

  function readSeed() {
    try {
      var el = document.getElementById('product-data');
      return el ? JSON.parse(el.textContent || '{}') : {};
    } catch (e) {
      return {};
    }
  }

  function isTarget() {
    return String(readSeed().slug || '') === 'filin_audio_quadron';
  }

  if (!isTarget()) return;

  function norm(value) {
    return String(value || '').replace(/\s+/g, ' ').trim();
  }

  function injectStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      html[data-filin-full-profile="filin_audio_quadron"] body,
      html[data-filin-full-profile="filin_audio_quadron"] .js-product,
      html[data-filin-full-profile="filin_audio_quadron"] .js-product *,
      html[data-filin-full-profile="filin_audio_quadron"] .fp-product-overview,
      html[data-filin-full-profile="filin_audio_quadron"] .fp-product-overview *,
      html[data-filin-full-profile="filin_audio_quadron"] .fp-curation,
      html[data-filin-full-profile="filin_audio_quadron"] .fp-curation * {
        font-family:'Montserrat',Arial,sans-serif !important;
        box-sizing:border-box !important;
      }

      [data-fp-v24-legacy-hidden="1"] {
        display:none !important;
        visibility:hidden !important;
        height:0 !important;
        min-height:0 !important;
        max-height:0 !important;
        margin:0 !important;
        padding:0 !important;
        overflow:hidden !important;
      }

      /* Remove every generated V2.2/V2.3 mobile helper. */
      .fp-v22-pm-toggle,
      .fp-v22-mobile-tab-toggle,
      .fp-v22-mobile-buy-price,
      .fl-v23-tab-toggle,
      .fp-v22-mobile-open {
        display:none !important;
      }

      /* =========================================================
         CURATOR — production T051 geometry, Golden Backup colors.
         ========================================================= */
      .fp-v24-curator-record,
      .fp-v24-curator-record .t051,
      .fp-v24-curator-record .t-container,
      .fp-v24-curator-record .t-col {
        background:#000 !important;
      }

      .fp-v24-curator-record {
        padding-top:45px !important;
        padding-bottom:45px !important;
        margin:0 !important;
      }

      .fp-v24-curator-record .t051__text,
      .fp-v24-curator-record .t051__text *,
      .fp-v24-curator-text,
      .fp-v24-curator-text * {
        color:#fff !important;
        font-family:'Montserrat',Arial,sans-serif !important;
        font-size:20px !important;
        line-height:1.45 !important;
        font-weight:600 !important;
        font-style:italic !important;
        text-align:center !important;
        opacity:1 !important;
        visibility:visible !important;
      }

      /* =========================================================
         DESKTOP TABS — same language as original Product Engine.
         Keep all Quadron-specific tabs in a single row where space allows.
         ========================================================= */
      .js-product .tabs-header {
        display:flex !important;
        flex-wrap:nowrap !important;
        width:100% !important;
        border-bottom:2px solid #eee !important;
        overflow-x:auto !important;
        white-space:nowrap !important;
        -webkit-overflow-scrolling:touch !important;
        scrollbar-width:thin !important;
      }

      .js-product .tabs-header .tab-btn {
        flex:1 1 0 !important;
        min-width:135px !important;
        padding:20px 12px !important;
        border:0 !important;
        border-radius:0 !important;
        background:transparent !important;
        color:#888 !important;
        font-size:15px !important;
        line-height:1.2 !important;
        font-weight:700 !important;
        text-transform:uppercase !important;
        text-align:center !important;
      }

      .js-product .tabs-header .tab-btn.active {
        color:#b38b59 !important;
        border-bottom:2px solid #b38b59 !important;
      }

      .fl-v24-pm-rule {
        display:none;
      }

      @media (max-width:820px) {
        /* =====================================================
           HERO — Golden mobile: short image, no H1/back-link,
           description centered over the image.
           ===================================================== */
        .fp-v24-hero-cover,
        .fp-v24-hero-cover .t-cover__carrier,
        .fp-v24-hero-cover .t-cover__filter,
        .fp-v24-hero-cover .t-cover__wrapper {
          height:166px !important;
          min-height:166px !important;
          max-height:166px !important;
        }

        .fp-v24-hero-record {
          margin-bottom:12px !important;
          min-height:0 !important;
        }

        .fp-v24-hero-cover .t184__title,
        .fp-v24-hero-cover .t184__uptitle {
          display:none !important;
        }

        .fp-v24-hero-cover .t184,
        .fp-v24-hero-cover .t-container,
        .fp-v24-hero-cover .t-col,
        .fp-v24-hero-cover [data-hook-content="covercontent"] {
          height:100% !important;
          min-height:0 !important;
        }

        .fp-v24-hero-cover .t-cover__carrier {
          background-position:center center !important;
          background-attachment:scroll !important;
        }

        .fp-v24-hero-cover .t184__descr {
          width:100% !important;
          max-width:356px !important;
          margin:0 auto !important;
          padding:0 18px !important;
          color:#fff !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          font-size:13px !important;
          line-height:1.42 !important;
          font-weight:500 !important;
          text-align:center !important;
        }

        /* =====================================================
           CURATOR — exact black strip, visible white italic copy.
           ===================================================== */
        .fp-v24-curator-record {
          padding-top:30px !important;
          padding-bottom:30px !important;
          margin:0 !important;
          background:#000 !important;
        }

        .fp-v24-curator-record .t051__text,
        .fp-v24-curator-record .t051__text *,
        .fp-v24-curator-text,
        .fp-v24-curator-text * {
          color:#fff !important;
          font-size:16px !important;
          line-height:1.45 !important;
          font-weight:600 !important;
          font-style:italic !important;
          text-align:center !important;
        }

        /* =====================================================
           TYPOGRAPHY — Golden mobile baseline.
           ===================================================== */
        .fp-product-overview,
        .fp-product-overview p,
        .fp-product-overview li,
        .fp-curation p,
        .js-product .description-content p,
        .js-product .description-content li,
        .js-product .specs-table td,
        .js-product .options-list label {
          font-size:13px !important;
          line-height:1.55 !important;
          font-weight:400 !important;
          letter-spacing:0 !important;
        }

        /* =====================================================
           PURCHASE / BUY NOW — original Product Engine geometry.
           Side gutters also make Perfect Matches match the backup.
           ===================================================== */
        .js-product .purchase-container {
          margin:0 !important;
          padding:0 16px !important;
          border-radius:0 !important;
          background:#fffbf7 !important;
        }

        .js-product .purchase-container .price-title {
          display:none !important;
        }

        .fl-v24-divider-before-buy {
          display:block !important;
          width:100% !important;
          height:2px !important;
          margin:24px 0 !important;
          padding:0 !important;
          border:0 !important;
          border-radius:0 !important;
          background:
            linear-gradient(
              90deg,
              transparent 0%,
              #111 7%,
              #111 42%,
              #bc8c5e 42%,
              #bc8c5e 58%,
              #111 58%,
              #111 93%,
              transparent 100%
            ) !important;
          opacity:.95 !important;
        }

        .js-product .buy-btn.fl-v24-main-buy {
          position:relative !important;
          display:flex !important;
          align-items:center !important;
          justify-content:center !important;
          width:100% !important;
          min-height:92px !important;
          margin:0 !important;
          padding:20px 96px 20px 24px !important;
          overflow:hidden !important;
          text-decoration:none !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          font-size:29.25px !important;
          line-height:1.08 !important;
          letter-spacing:.025em !important;
          background:
            linear-gradient(115deg,
              #81572f 0%,
              #a97543 14%,
              #c59661 31%,
              #e3c28f 45%,
              #f1d6a7 50%,
              #d4a66d 58%,
              #a97543 78%,
              #81572f 100%) !important;
          background-size:240% 100% !important;
          background-position:0% 50% !important;
          color:#fff !important;
          border:2px solid #76502d !important;
          border-radius:12px !important;
          cursor:pointer !important;
          text-transform:uppercase !important;
          font-weight:800 !important;
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,.72),
            inset 0 0 0 4px rgba(115,72,34,.28),
            inset 0 0 0 6px rgba(255,231,193,.32),
            0 9px 24px rgba(67,42,21,.20),
            0 0 24px rgba(196,143,82,.12) !important;
          isolation:isolate !important;
        }

        .js-product .buy-btn.fl-v24-main-buy::before {
          content:"" !important;
          position:absolute !important;
          inset:7px !important;
          z-index:1 !important;
          border:1px solid rgba(255,247,229,.72) !important;
          border-radius:7px !important;
          box-shadow:
            0 0 0 2px rgba(111,68,31,.34),
            inset 0 0 0 1px rgba(255,225,179,.34),
            inset 0 0 18px rgba(255,255,255,.08) !important;
          pointer-events:none !important;
        }

        .js-product .buy-btn.fl-v24-main-buy .buy-btn-label {
          position:relative !important;
          z-index:3 !important;
          display:inline-block !important;
          color:#fff !important;
          font-size:29.25px !important;
          line-height:1.08 !important;
          font-weight:800 !important;
          text-align:center !important;
          white-space:nowrap !important;
        }

        .fl-v24-price-in-buy {
          position:absolute !important;
          z-index:4 !important;
          top:50% !important;
          right:22px !important;
          display:inline-flex !important;
          align-items:center !important;
          height:32px !important;
          padding-left:16px !important;
          border-left:1px solid rgba(255,255,255,.55) !important;
          color:#fff !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          font-size:12px !important;
          line-height:1 !important;
          font-weight:700 !important;
          text-transform:none !important;
          transform:translateY(-50%) !important;
          white-space:nowrap !important;
        }

        /* =====================================================
           PERFECT MATCHES — exact Golden gutters and spacing.
           Proven V6.6 engine below provides all functionality.
           ===================================================== */
        .js-product .perfect-matches-block.fp-pm-v5 {
          width:100% !important;
          margin:14px 0 42px !important;
        }

        .fl-v24-pm-rule {
          display:none !important;
        }

        .perfect-matches-block.fp-pm-v5 > .pm-formula {
          padding-top:14px !important;
        }

        /* =====================================================
           REAL PRODUCT TABS — stacked native buttons.
           No generated + circles. Full Profile keeps the click logic.
           ===================================================== */
.js-product .tabs-wrapper {
  width:100% !important;
  max-width:100% !important;
  margin-left:0 !important;
  margin-right:0 !important;
  padding:0 !important;
  box-sizing:border-box !important;
  overflow:hidden !important;
  background:#fffbf7 !important;
}
        .js-product .tabs-header {
          display:grid !important;
          grid-template-columns:1fr !important;
          gap:6px !important;
          width:100% !important;
          margin:0 !important;
          padding:0 !important;
          border-bottom:0 !important;
          overflow:visible !important;
          white-space:normal !important;
        }

        .js-product .tabs-header .tab-btn {
          width:100% !important;
          min-width:0 !important;
          min-height:52px !important;
          margin:0 !important;
          padding:14px 12px !important;
          border:1px solid #eee !important;
          border-radius:8px !important;
          background:#f4eee8 !important;
          color:#888 !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          font-size:16px !important;
          line-height:1.2 !important;
          font-weight:700 !important;
          text-align:left !important;
          text-transform:uppercase !important;
          box-shadow:none !important;
        }

        .js-product .tabs-header .tab-btn.active {
          border:1px solid #b38b59 !important;
          background:#fffbf7 !important;
          color:#b38b59 !important;
        }

        .js-product .tabs-header .reviews-tab-count {
          min-width:24px !important;
          height:24px !important;
          margin-left:7px !important;
          padding:0 7px !important;
          display:inline-flex !important;
          align-items:center !important;
          justify-content:center !important;
          border-radius:999px !important;
          background:#f3e5d5 !important;
          color:#8d673d !important;
          font-size:12px !important;
          line-height:1 !important;
          vertical-align:middle !important;
        }

        .js-product .tabs-header .tab-btn.active .reviews-tab-count {
          background:#b38b59 !important;
          color:#fff !important;
        }

        .js-product .tab-content {
          width:100% !important;
          background:#fffbf7 !important;
        }

        .js-product .tab-content > .content-container {
          width:100% !important;
          max-width:100% !important;
          margin:0 !important;
          padding:18px 12px !important;
          text-align:left !important;
        }

        .js-product .description-content h3 {
          margin:24px 0 10px !important;
          padding-left:10px !important;
          border-left:3px solid #b38b59 !important;
          color:#333 !important;
          font-size:18px !important;
          line-height:1.25 !important;
          font-weight:700 !important;
        }

        .js-product .description-content h3:first-child {
          margin-top:20px !important;
        }

        .js-product .specs-table {
          width:100% !important;
          max-width:100% !important;
          margin:10px auto !important;
        }

        .js-product .specs-table td {
          padding:12px 8px !important;
          font-size:13px !important;
          line-height:1.5 !important;
        }

        .js-product .options-list {
          width:100% !important;
          max-width:100% !important;
          margin:0 !important;
        }

        .js-product .options-list label {
          margin:0 0 8px !important;
          padding:11px 12px !important;
          border:1px solid #f0e6d9 !important;
          border-radius:6px !important;
          background:#fffbf7 !important;
        }

        /* Golden mobile curation: clean vertical rows. */
        .fp-curation {
          width:100% !important;
          margin:28px 0 0 !important;
          padding:0 14px 24px !important;
          display:block !important;
          background:#fffbf7 !important;
        }

        .fp-curation-item {
          width:100% !important;
          margin:0 !important;
          padding:18px 0 !important;
          display:grid !important;
          grid-template-columns:26px minmax(0,1fr) !important;
          gap:12px !important;
          align-items:start !important;
          border:0 !important;
          border-bottom:1px solid #e7ddd3 !important;
          background:transparent !important;
          box-shadow:none !important;
        }

        .fp-curation-item:last-child {
          border-bottom:0 !important;
        }

        .fp-curation-copy h3 {
          margin:0 0 7px !important;
          color:#171512 !important;
          font-size:12px !important;
          line-height:1.25 !important;
          font-weight:800 !important;
          text-transform:uppercase !important;
        }

        .fp-curation-copy p {
          margin:0 !important;
          color:#4f4a46 !important;
          font-size:12px !important;
          line-height:1.5 !important;
          font-weight:400 !important;
        }

        .fp-v24-sticky-title {
          max-width:155px !important;
          overflow:hidden !important;
          color:#181512 !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          font-size:10px !important;
          line-height:1.1 !important;
          font-weight:700 !important;
          white-space:nowrap !important;
          text-overflow:clip !important;
        }
      }

      @media (max-width:440px) {
        .js-product .buy-btn.fl-v24-main-buy {
          min-height:88px !important;
          padding-left:20px !important;
          padding-right:90px !important;
        }

        .js-product .buy-btn.fl-v24-main-buy .buy-btn-label {
          font-size:27px !important;
        }

        .fl-v24-price-in-buy {
          right:18px !important;
          font-size:11px !important;
          padding-left:13px !important;
        }

        .fp-v24-hero-cover .t184__descr {
          font-size:12.5px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function removeOldPatchArtifacts() {
    var oldStyle = document.getElementById('filin-master-exact-layout-v23');
    if (oldStyle) oldStyle.remove();

    document.querySelectorAll(
      '.fp-v22-pm-toggle,.fp-v22-mobile-tab-toggle,.fp-v22-mobile-buy-price,.fl-v23-tab-toggle'
    ).forEach(function (node) {
      node.remove();
    });

    document.querySelectorAll('.fp-v22-mobile-open,.fl-v23-open').forEach(function (node) {
      node.classList.remove('fp-v22-mobile-open','fl-v23-open');
    });
  }

  function activeRoot() {
    var exact = document.querySelector('.js-product[data-fp-full-profile="filin_audio_quadron"]');
    if (exact) return exact;

    var roots = Array.prototype.slice.call(document.querySelectorAll('.js-product'));
    return roots.find(function (root) {
      var name = root.querySelector('#tilda-product-name,.js-product-name');
      return /Quadron/i.test(norm(name && name.textContent));
    }) || roots[0] || null;
  }

  function markHero() {
    var title = Array.prototype.slice.call(document.querySelectorAll('.t184__title,h1'))
      .find(function (el) {
        return /Quadron/i.test(norm(el.textContent));
      });

    if (!title) return false;

    var cover = title.closest('.t-cover');
    var rec = title.closest('.t-rec,[id^="rec"]') || cover;

    if (cover) cover.classList.add('fp-v24-hero-cover');
    if (rec) rec.classList.add('fp-v24-hero-record');

    return !!cover;
  }

  function markCurator() {
    var leaf = Array.prototype.slice.call(document.querySelectorAll('.t051__text,.t-text,em,p,div'))
      .filter(function (el) {
        if (el.children.length > 3) return false;
        var t = norm(el.textContent);
        return /^Handcrafted by Evgeny Melentiev\./i.test(t);
      })
      .sort(function (a,b) {
        return norm(a.textContent).length - norm(b.textContent).length;
      })[0];

    if (!leaf) return false;

    leaf.classList.add('fp-v24-curator-text');

    var rec = leaf.closest('.t-rec,[id^="rec"]');
    if (rec) {
      rec.classList.add('fp-v24-curator-record');
      rec.style.setProperty('background-color','#000000','important');
      rec.style.setProperty('padding-top','30px','important');
      rec.style.setProperty('padding-bottom','30px','important');
    }

    return true;
  }

  function shortenStickyTitle() {
    var changed = 0;

    Array.prototype.slice.call(document.querySelectorAll('body *')).forEach(function (el) {
      if (el.children.length) return;

      var t = norm(el.textContent);
      if (!/Filin Audio.*Quadron.*Planar Magnetic Headphones/i.test(t)) return;

      var p = el;
      var sticky = false;

      for (var i=0; i<6 && p; i++, p=p.parentElement) {
        var cs = getComputedStyle(p);
        if (cs.position === 'fixed' || cs.position === 'sticky') {
          sticky = true;
          break;
        }
      }

      if (!sticky) return;

      el.textContent = 'Filin Audio "Quadron"';
      el.classList.add('fp-v24-sticky-title');
      changed++;
    });

    return changed;
  }

  function ensureBuyNow() {
    var root = activeRoot();
    if (!root) return false;

    var purchase = root.querySelector('.purchase-container');
    var buy = root.querySelector('.buy-btn');
    var price = root.querySelector('#main-price');

    if (!purchase || !buy || !price) return false;

    buy.classList.add('fl-v24-main-buy');

    var label = buy.querySelector('.buy-btn-label');
    if (!label) {
      label = document.createElement('span');
      label.className = 'buy-btn-label';
      label.textContent = 'Buy Now';
      buy.textContent = '';
      buy.appendChild(label);
    }

    var divider = purchase.querySelector('.fl-v24-divider-before-buy');
    if (!divider) {
      divider = document.createElement('div');
      divider.className = 'fl-v24-divider-before-buy';
      purchase.insertBefore(divider, buy);
    }

    var inBuy = buy.querySelector('.fl-v24-price-in-buy');
    if (!inBuy) {
      inBuy = document.createElement('span');
      inBuy.className = 'fl-v24-price-in-buy';
      buy.appendChild(inBuy);
    }

    function sync() {
      var value = norm(price.textContent).replace(/^\$/,'');
      inBuy.textContent = value ? '$' + value : '';
    }

    sync();

    if (!price.dataset.fpV24Observed) {
      price.dataset.fpV24Observed = '1';
      new MutationObserver(sync).observe(price, {
        childList:true,
        subtree:true,
        characterData:true
      });
    }

    return true;
  }

  function ensurePmRule() {
    var root = activeRoot();
    if (!root) return false;

    var block = root.querySelector('.perfect-matches-block');
    if (!block) return false;

    var toggle = block.querySelector('.fp-pm-v5-toggle');
    if (!toggle) return false;

    var rule = block.querySelector('.fl-v24-pm-rule');
    if (!rule) {
      rule = document.createElement('div');
      rule.className = 'fl-v24-pm-rule';
      toggle.insertAdjacentElement('afterend', rule);
    }

    return true;
  }

  function migrateReviews() {
    var root = activeRoot();
    if (!root) return {moved:false, button:false};

    var targetTabs = root.querySelector('.tabs-wrapper');
    var targetHeader = targetTabs && targetTabs.querySelector('.tabs-header');

    if (!targetTabs || !targetHeader) return {moved:false, button:false};

    var existing = targetTabs.querySelector('#reviews');
    var reviewContent = existing;

    if (!reviewContent) {
      reviewContent = Array.prototype.slice.call(document.querySelectorAll('.tab-content#reviews'))
        .find(function (node) {
          return !root.contains(node);
        });
    }

    if (!reviewContent) return {moved:false, button:false};

    var legacyTabs = reviewContent.closest('.tabs-wrapper');
    var legacyRoot = legacyTabs && legacyTabs.closest('.js-product');
    var oldButton = legacyTabs && Array.prototype.slice.call(legacyTabs.querySelectorAll('.tab-btn'))
      .find(function (btn) {
        return /^Reviews\b/i.test(norm(btn.textContent));
      });

    var oldCount = oldButton && oldButton.querySelector('#reviews-tab-count,.reviews-tab-count');

    if (!root.contains(reviewContent)) {
      targetTabs.appendChild(reviewContent);
    }

    var button = Array.prototype.slice.call(targetHeader.querySelectorAll('.tab-btn'))
      .find(function (btn) {
        return /^Reviews\b/i.test(norm(btn.textContent));
      });

    if (!button) {
      button = document.createElement('button');
      button.className = 'tab-btn';
      button.type = 'button';
      button.dataset.fpTarget = 'reviews';
      button.appendChild(document.createTextNode('Reviews '));

      var count = oldCount || document.createElement('span');
      count.className = 'reviews-tab-count';
      count.id = 'reviews-tab-count';
      if (!norm(count.textContent)) count.textContent = '0';

      button.appendChild(count);
      targetHeader.appendChild(button);
    }

    if (!button.dataset.fpV24ReviewBound) {
      button.dataset.fpV24ReviewBound = '1';

      button.addEventListener('click', function (evt) {
        evt.preventDefault();

        Array.prototype.slice.call(targetTabs.querySelectorAll('.tab-content'))
          .forEach(function (node) {
            node.style.display = 'none';
          });

        Array.prototype.slice.call(targetHeader.querySelectorAll('.tab-btn'))
          .forEach(function (node) {
            node.classList.remove('active');
          });

        reviewContent.style.display = 'block';
        button.classList.add('active');
      });
    }

    reviewContent.querySelectorAll('.other-reviews-btn').forEach(function (a) {
      a.setAttribute('href','/insights?product=' + encodeURIComponent('Filin Audio Quadron'));
      a.setAttribute('aria-label','Open other reviews for Filin Audio Quadron');
    });

    var modal = legacyRoot && legacyRoot.querySelector('#product-review-modal');
    if (modal && !root.contains(modal)) {
      document.body.appendChild(modal);
    }

    var intro = document.querySelector('#product-review-modal .product-review-modal-intro');
    if (intro) {
      intro.textContent = 'Share your listening experience with Filin Audio "Quadron".';
    }

    if (legacyRoot && legacyRoot !== root) {
      legacyRoot.setAttribute('data-fp-v24-legacy-hidden','1');
    }

    return {
      moved: true,
      button: true
    };
  }

  function prepareNativeTabs() {
    var root = activeRoot();
    if (!root) return 0;

    root.querySelectorAll('.fl-v23-tab-toggle,.fp-v22-mobile-tab-toggle')
      .forEach(function (node) {
        node.remove();
      });

    var wrapper = root.querySelector('.tabs-wrapper');
    var header = wrapper && wrapper.querySelector('.tabs-header');

    if (!wrapper || !header) return 0;

    var buttons = Array.prototype.slice.call(header.querySelectorAll('.tab-btn'));
    var contents = Array.prototype.slice.call(wrapper.querySelectorAll(':scope > .tab-content'));

    if (!contents.some(function (node) {
      return getComputedStyle(node).display !== 'none';
    })) {
      var active = buttons.find(function (btn) {
        return btn.classList.contains('active');
      }) || buttons[0];

      var id = active && (active.dataset.fpTarget || '');
      var target = id
        ? Array.prototype.slice.call(contents).find(function (node) {
            return node.id === id;
          })
        : contents[0];

      if (target) target.style.display = 'block';
    }

    return buttons.length;
  }

function hideLegacyGrandTower() {
  var root = activeRoot();
  var hidden = 0;

  var markers = [
    /Audioinstrument Grand Tower/i,
    /Advanced Crossover Engineering/i,
    /P\.Audio titanium/i,
    /15["”]\s*Sonido/i,
    /8["”]\s*Sonido/i,
    /Sonido 15/i,
    /Sonido 8/i,
    /massive 100 kg/i,
    /three-way floorstanding/i
  ];

  /*
   * Find the REAL Quadron tab set.
   * The Quadron profile has product-specific configuration tabs
   * which the old Grand Tower template does not have.
   */
  var wrappers = Array.prototype.slice.call(
    document.querySelectorAll('.tabs-wrapper')
  );

  var canonical = wrappers.find(function (wrapper) {
    if (!root || !root.contains(wrapper)) return false;

    var text = norm(
      Array.prototype.slice.call(
        wrapper.querySelectorAll('.tab-btn')
      ).map(function (button) {
        return button.textContent || '';
      }).join(' ')
    );

    return (
      /TUNING\s*&\s*CUSTOMIZATION/i.test(text) &&
      /COMPONENT UPGRADES/i.test(text) &&
      /CABLE OUTPUT PLUG/i.test(text) &&
      /CABLE LENGTH/i.test(text)
    );
  }) || null;

  if (canonical) {
    canonical.setAttribute(
      'data-fp-v24-canonical',
      '1'
    );
  }

  /*
   * IMPORTANT:
   * Legacy commerce can live inside the SAME .js-product /
   * Tilda record as the real Quadron profile.
   *
   * Therefore inspect every tabs-wrapper directly instead of
   * skipping the whole record containing the active root.
   */
  wrappers.forEach(function (wrapper) {
    if (wrapper === canonical) return;

    var t = norm(wrapper.textContent);

    if (
      !markers.some(function (rx) {
        return rx.test(t);
      })
    ) {
      return;
    }

    if (
      wrapper.getAttribute(
        'data-fp-v24-legacy-hidden'
      ) !== '1'
    ) {
      wrapper.setAttribute(
        'data-fp-v24-legacy-hidden',
        '1'
      );

      hidden++;
    }
  });

  /*
   * Also remove separate old Tilda records,
   * but never remove the record containing the real Quadron root.
   */
  Array.prototype.slice.call(
    document.querySelectorAll('.t-rec,.t123')
  ).forEach(function (record) {

    if (
      record.id === 'product-promotions' ||
      record.querySelector('#product-promotions')
    ) {
      return;
    }

    if (root && record.contains(root)) {
      return;
    }

    var t = norm(record.textContent);

    if (!t || t.length > 25000) return;

    if (
      !markers.some(function (rx) {
        return rx.test(t);
      })
    ) {
      return;
    }

    if (
      record.getAttribute(
        'data-fp-v24-legacy-hidden'
      ) !== '1'
    ) {
      record.setAttribute(
        'data-fp-v24-legacy-hidden',
        '1'
      );

      hidden++;
    }
  });

  /*
   * Catch a completely separate legacy .js-product too.
   */
  Array.prototype.slice.call(
    document.querySelectorAll('.js-product')
  ).forEach(function (candidate) {

    if (candidate === root) return;

    var t = norm(candidate.textContent);

    if (
      !markers.some(function (rx) {
        return rx.test(t);
      })
    ) {
      return;
    }

    if (
      candidate.getAttribute(
        'data-fp-v24-legacy-hidden'
      ) !== '1'
    ) {
      candidate.setAttribute(
        'data-fp-v24-legacy-hidden',
        '1'
      );

      hidden++;
    }
  });

  return hidden;
}

  function apply() {
    if (!isTarget()) return;

    injectStyles();
    removeOldPatchArtifacts();

    var result = {
      hero: markHero(),
      curator: markCurator(),
      stickyShortened: shortenStickyTitle(),
      mobileBuy: ensureBuyNow(),
      reviews: migrateReviews(),
      nativeTabs: prepareNativeTabs(),
      legacyHidden: hideLegacyGrandTower(),
      pmRule: ensurePmRule()
    };

    document.documentElement.setAttribute('data-fp-golden-match','v2.6');

    console.info(
      '[Master Product V2] GOLDEN MATCH V2.6 APPLIED',
      result
    );
  }

  window.FilinMasterGoldenMatchV26 = Object.freeze({
    version:'2.6',
    apply:apply
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(apply, 30);
    }, {once:true});
  } else {
    setTimeout(apply, 30);
  }

  setTimeout(apply, 650);
  setTimeout(apply, 1450);
  setTimeout(apply, 2850);
  setTimeout(apply, 3400);
})();


/* ===== PROVEN PERFECT MATCHES V6.6 — EMBEDDED V2.6 ===== */
(function(){
  if(!document.getElementById('filin-master-pm-v66-v24-style')){
    var s=document.createElement('style');
    s.id='filin-master-pm-v66-v24-style';
    s.textContent=`/* =========================================================
   PERFECT MATCHES V6.6 — MOBILE/TABLET / ProductCatalog + 5% + clean separate cart items
   - no logos
   - no in-card prices
   - no Curated Signal Path heading
   - no "System Result" label
   - base product aligned left
   - five different gray levels for add-on products
   - sticky product-header price follows #main-price
   ========================================================= */

.fp-pm-v5-toggle,
.fp-pm-v5-role,
.fp-pm-v5-step,
.fp-pm-v5-result-note {
  display: none;
}

@media (max-width: 820px) {

  .perfect-matches-block.fp-pm-v5 {
    margin: 14px 0 16px !important;
    padding: 0 !important;
    border: 1px solid #e3d5c5 !important;
    border-radius: 14px !important;
    background: #fffbf7 !important;
    overflow: hidden !important;
    box-shadow: 0 10px 28px rgba(75, 50, 25, .055) !important;
    font-family: 'Montserrat', Arial, sans-serif !important;
    text-align: left !important;
  }

  .perfect-matches-block.fp-pm-v5 > .pm-title,
  .perfect-matches-block.fp-pm-v5 > .pm-desc {
    display: none !important;
  }

  /* =========================
     ACCORDION HEADER
     ========================= */
  .fp-pm-v5-toggle {
    width: 100% !important;
    min-width: 0 !important;
    min-height: 80px !important;
    margin: 0 !important;
    padding: 15px 14px 15px 15px !important;
    border: 0 !important;
    border-radius: 0 !important;
    background: linear-gradient(135deg, #fffbf7 0%, #f8f2ec 100%) !important;

    display: grid !important;
    grid-template-columns: minmax(0, 1fr) 38px !important;
    gap: 12px !important;
    align-items: center !important;

    box-sizing: border-box !important;
    color: #302923 !important;
    font-family: 'Montserrat', Arial, sans-serif !important;
    text-align: left !important;
    cursor: pointer !important;
  }

  .fp-pm-v5-toggle-copy {
    min-width: 0 !important;
    display: block !important;
  }

  .fp-pm-v5-toggle-eyebrow {
    display: block !important;
    margin: 0 0 6px !important;
    color: #a97a45 !important;
    font-size: 12.5px !important;
    line-height: 1.15 !important;
    font-weight: 800 !important;
    letter-spacing: .075em !important;
    text-transform: uppercase !important;
  }

  .fp-pm-v5-toggle-note {
    display: block !important;
    max-width: 285px !important;
    color: #5f5851 !important;
    font-size: 11.5px !important;
    line-height: 1.42 !important;
    font-weight: 500 !important;
  }

  .fp-pm-v5-toggle-note strong {
    color: #28231f !important;
    font-weight: 800 !important;
  }

  .fp-pm-v5-toggle-control {
    position: static !important;
    inset: auto !important;

    width: 36px !important;
    height: 36px !important;
    min-width: 36px !important;
    min-height: 36px !important;
    margin: 0 !important;
    padding: 0 !important;

    border: 1px solid rgba(170, 124, 72, .42) !important;
    border-radius: 50% !important;
    background: #fff !important;

    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    justify-self: end !important;

    color: #9f7445 !important;
    box-sizing: border-box !important;
    overflow: visible !important;
    opacity: 1 !important;
    visibility: visible !important;

    box-shadow: 0 3px 10px rgba(100, 68, 35, .08) !important;
  }

  .fp-pm-v5-toggle-control svg {
    width: 17px !important;
    height: 17px !important;
    display: block !important;
    transition: transform .22s ease !important;
  }

  .perfect-matches-block.fp-pm-v5.fp-pm-open .fp-pm-v5-toggle-control {
    background: #b98b55 !important;
    border-color: #b98b55 !important;
    color: #fff !important;
  }

  .perfect-matches-block.fp-pm-v5.fp-pm-open .fp-pm-v5-toggle-control svg {
    transform: rotate(180deg) !important;
  }

  .perfect-matches-block.fp-pm-v5:not(.fp-pm-open) > .pm-formula,
  .perfect-matches-block.fp-pm-v5:not(.fp-pm-open) > .pm-discount {
    display: none !important;
  }

  /* duplicated lower promo note stays removed */
  .perfect-matches-block.fp-pm-v5 > .pm-discount {
    display: none !important;
  }

  /* =========================
     SIGNAL PATH
     ========================= */
  .perfect-matches-block.fp-pm-v5.fp-pm-open {
    padding-bottom: 14px !important;
  }

  .perfect-matches-block.fp-pm-v5 > .pm-formula {
    position: relative !important;
    display: flex !important;
    flex-direction: column !important;
    gap: 10px !important;
    align-items: stretch !important;

    margin: 0 !important;
    padding: 16px 15px 2px 58px !important;
    box-sizing: border-box !important;
  }

  .perfect-matches-block.fp-pm-v5 > .pm-formula::before {
    content: "" !important;
    position: absolute !important;
    left: 30px !important;
    top: 31px !important;
    bottom: 70px !important;
    width: 1px !important;

    background: linear-gradient(
      to bottom,
      rgba(116, 116, 116, .12),
      rgba(116, 116, 116, .48),
      rgba(116, 116, 116, .12)
    ) !important;
  }

  .perfect-matches-block.fp-pm-v5 .pm-plus,
  .perfect-matches-block.fp-pm-v5 .pm-equals {
    display: none !important;
  }

  /* =========================
     PRODUCT ROWS
     ========================= */
  .perfect-matches-block.fp-pm-v5 .pm-item {
    position: relative !important;
    width: 100% !important;
    min-height: 61px !important;
    margin: 0 !important;
    padding: 10px 13px !important;

    border: 1px solid #dcdad6 !important;
    border-radius: 10px !important;
    box-sizing: border-box !important;

    display: grid !important;
    grid-template-columns: 22px minmax(0, 1fr) !important;
    grid-template-rows: auto auto !important;
    column-gap: 10px !important;
    row-gap: 3px !important;
    align-items: center !important;

    color: #3a3632 !important;
    text-align: left !important;
    font-family: 'Montserrat', Arial, sans-serif !important;

    transition:
      border-color .18s ease,
      box-shadow .18s ease,
      transform .18s ease,
      background-color .18s ease !important;
  }

  .perfect-matches-block.fp-pm-v5 label.pm-item {
    cursor: pointer !important;
  }

  .perfect-matches-block.fp-pm-v5 label.pm-item:active {
    transform: scale(.993) !important;
  }

  /* Five deliberately different gray gradations */
  .perfect-matches-block.fp-pm-v5 .fp-pm-tone-1 {
    background: #fbfbfa !important;
  }

  .perfect-matches-block.fp-pm-v5 .fp-pm-tone-2 {
    background: #f6f6f4 !important;
  }

  .perfect-matches-block.fp-pm-v5 .fp-pm-tone-3 {
    background: #f0f0ed !important;
  }

  .perfect-matches-block.fp-pm-v5 .fp-pm-tone-4 {
    background: #e9e9e5 !important;
  }

  .perfect-matches-block.fp-pm-v5 .fp-pm-tone-5 {
    background: #e2e2dd !important;
  }

  .perfect-matches-block.fp-pm-v5 label.pm-item.fp-pm-selected {
    border-color: #b98b55 !important;
    box-shadow: 0 6px 17px rgba(92, 70, 45, .10) !important;
  }

  .fp-pm-v5-step {
    position: absolute !important;
    left: -40px !important;
    top: 50% !important;
    transform: translateY(-50%) !important;
    z-index: 2 !important;

    width: 24px !important;
    height: 24px !important;
    border: 1px solid #cfc8c0 !important;
    border-radius: 50% !important;
    background: #fffbf7 !important;

    display: flex !important;
    align-items: center !important;
    justify-content: center !important;

    color: #77706a !important;
    font-size: 10.3px !important;
    line-height: 1 !important;
    font-weight: 800 !important;
  }

  .pm-base .fp-pm-v5-step {
    background: #3d3329 !important;
    border-color: #3d3329 !important;
    color: #fff !important;
  }

  .fp-pm-selected .fp-pm-v5-step {
    background: #b98b55 !important;
    border-color: #b98b55 !important;
    color: #fff !important;
  }

  .perfect-matches-block.fp-pm-v5 .pm-item input[type="checkbox"] {
    grid-column: 1 !important;
    grid-row: 1 / span 2 !important;
    align-self: center !important;

    width: 18px !important;
    height: 18px !important;
    margin: 0 !important;
    accent-color: #b98b55 !important;
  }

  /* Base product: same left alignment logic as rows below */
  .perfect-matches-block.fp-pm-v5 .pm-base {
    grid-template-columns: minmax(0, 1fr) !important;
    grid-template-rows: auto auto !important;
    min-height: 58px !important;
    padding: 10px 13px !important;
    background: #f1efec !important;
    border-color: #d8d4cf !important;
    text-align: left !important;
    justify-items: start !important;
  }

  .perfect-matches-block.fp-pm-v5 .pm-item > span:not(.fp-pm-v5-step):not(.fp-pm-v5-role),
  .perfect-matches-block.fp-pm-v5 .pm-item > span > a {
    grid-column: 2 !important;
    grid-row: 1 !important;
    min-width: 0 !important;
    width: 100% !important;
    margin: 0 !important;

    color: #45403b !important;
    font-size: 11.5px !important;
    line-height: 1.28 !important;
    font-weight: 700 !important;
    text-decoration: none !important;
    text-align: left !important;
    justify-self: start !important;
    overflow-wrap: anywhere !important;
  }

  .perfect-matches-block.fp-pm-v5 .pm-base > span:not(.fp-pm-v5-step):not(.fp-pm-v5-role) {
    grid-column: 1 !important;
    grid-row: 1 !important;
    width: 100% !important;
    color: #403831 !important;
    font-size: 11.5px !important;
    line-height: 1.28 !important;
    font-weight: 750 !important;
    text-align: left !important;
    justify-self: start !important;
  }

  .fp-pm-v5-role {
    grid-column: 2 !important;
    grid-row: 2 !important;
    display: block !important;

    color: #85807b !important;
    font-size: 9.8px !important;
    line-height: 1.25 !important;
    font-weight: 600 !important;
    letter-spacing: .012em !important;
    text-align: left !important;
    justify-self: start !important;
  }

  .pm-base .fp-pm-v5-role {
    grid-column: 1 !important;
    width: 100% !important;
    text-align: left !important;
  }

  /* =========================
     RESULT
     ========================= */
  .perfect-matches-block.fp-pm-v5 .pm-result {
    position: relative !important;
    width: 100% !important;
    min-height: 66px !important;
    margin: 4px 0 0 !important;
    padding: 13px 14px !important;

    border: 1px solid rgba(147,100,51,.55) !important;
    border-radius: 11px !important;

    background:
      linear-gradient(135deg, #a97843 0%, #c99a62 52%, #e2bd83 100%) !important;
    color: #fff !important;

    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: flex-start !important;
    gap: 3px !important;

    box-sizing: border-box !important;
    text-align: left !important;

    font-family: 'Montserrat', Arial, sans-serif !important;
    font-size: 16px !important;
    line-height: 1.15 !important;
    font-weight: 800 !important;
    letter-spacing: .01em !important;

    box-shadow: 0 9px 22px rgba(110,72,34,.14) !important;
  }

  /* Explicitly remove SYSTEM RESULT */
  .perfect-matches-block.fp-pm-v5 .pm-result::before {
    content: none !important;
    display: none !important;
  }

  .fp-pm-v5-result-note {
    display: block !important;
    color: rgba(255,255,255,.86) !important;
    font-size: 9.8px !important;
    line-height: 1.3 !important;
    font-weight: 500 !important;
  }
}

@media (min-width: 601px) and (max-width: 820px) {
  .fp-pm-v5-toggle {
    padding-left: 20px !important;
    padding-right: 20px !important;
  }

  .perfect-matches-block.fp-pm-v5 > .pm-formula {
    padding-left: 54px !important;
    padding-right: 20px !important;
  }

  .perfect-matches-block.fp-pm-v5 > .pm-formula::before {
    left: 34px !important;
  }

  .fp-pm-v5-step {
    left: -33px !important;
  }

  .perfect-matches-block.fp-pm-v5 .pm-item > span:not(.fp-pm-v5-step):not(.fp-pm-v5-role),
  .perfect-matches-block.fp-pm-v5 .pm-item > span > a,
  .perfect-matches-block.fp-pm-v5 .pm-base > span:not(.fp-pm-v5-step):not(.fp-pm-v5-role) {
    font-size: 12.5px !important;
  }
}`;
    document.head.appendChild(s);
  }
})();

(function () {
  'use strict';

  if (window.__MASTER_PRODUCT_PM_V24__) return;
  window.__MASTER_PRODUCT_PM_V24__ = true;

  var ROLE_RULES = [
    { test: /quadron/i, role: 'Core planar headphones' },
    { test: /otis|dsd1794|pcm1794/i, role: 'Digital-to-analog conversion' },
    { test: /active tube preamplifier|tube preamplifier/i, role: 'Tube preamplification' },
    { test: /un-1|un_1|headphone amplifier/i, role: 'Headphone amplification' },
    { test: /purity|headphone cables/i, role: 'Headphone cable' }
  ];


  function productInfo(text) {
    text = String(text || '').trim();

    for (var i = 0; i < ROLE_RULES.length; i++) {
      if (ROLE_RULES[i].test.test(text)) {
        return ROLE_RULES[i];
      }
    }

    return {
      role: 'Recommended component'
    };
  }

  function addRole(item, info) {
    var role =
      item.querySelector(
        '.fp-pm-v5-role'
      );

    if (!role) {
      role =
        document.createElement(
          'span'
        );

      role.className =
        'fp-pm-v5-role';

      item.appendChild(role);
    }

    role.textContent =
      info && info.role
        ? info.role
        : 'Recommended component';
  }

  function addStep(item, label) {
    if (
      item.querySelector(
        '.fp-pm-v5-step'
      )
    ) {
      return;
    }

    var step =
      document.createElement(
        'span'
      );

    step.className =
      'fp-pm-v5-step';

    step.setAttribute(
      'aria-hidden',
      'true'
    );

    step.textContent =
      String(label || '');

    item.appendChild(step);
  }

  function syncSelected(item) {
    var checkbox =
      item.querySelector(
        'input[type="checkbox"]'
      );

    if (!checkbox) return;

    item.classList.toggle(
      'fp-pm-selected',
      !!checkbox.checked
    );
  }

  var mainPriceObserver = null;
  var stickyPriceObserver = null;

  var exactBasePrice = null;

  function parseExactMoney(value) {
    if (value == null) return 0;

    if (typeof value === 'number') {
      return Number.isFinite(value)
        ? value
        : 0;
    }

    var clean = String(value)
      .replace(/\u00a0/g, ' ')
      .replace(/[^\d.,-]/g, '')
      .replace(/,/g, '');

    var n = parseFloat(clean);

    return Number.isFinite(n)
      ? n
      : 0;
  }

  function exactSelectedExtrasTotal() {
    var total = 0;

    document
      .querySelectorAll(
        '.perfect-matches-block input.price-item:checked'
      )
      .forEach(
        function (checkbox) {
          total += parseExactMoney(
            checkbox.getAttribute(
              'data-price'
            )
          );
        }
      );

    return Math.round(total * 100) / 100;
  }

  function captureExactBasePrice() {
    if (
      Number.isFinite(exactBasePrice) &&
      exactBasePrice > 0
    ) {
      return exactBasePrice;
    }

    var main =
      document.getElementById(
        'main-price'
      );

    if (!main) return 0;

    var visible =
      parseExactMoney(
        main.textContent
      );

    if (!(visible > 0)) return 0;

    /*
     * Capture the base before extras are selected.
     * If something is already checked, subtract it.
     */
    exactBasePrice =
      Math.round(
        (
          visible -
          exactSelectedExtrasTotal()
        ) * 100
      ) / 100;

    return exactBasePrice;
  }

  function formatMainExact(value) {
    var cents =
      Math.round(value * 100);

    if (cents % 100 === 0) {
      return String(cents / 100);
    }

    return (cents / 100).toFixed(2);
  }

  function formatStickyExact(value) {
    var cents =
      Math.round(value * 100);

    var hasCents =
      cents % 100 !== 0;

    return '$' +
      (cents / 100).toLocaleString(
        'en-US',
        {
          minimumFractionDigits:
            hasCents ? 2 : 0,
          maximumFractionDigits: 2
        }
      );
  }

  function applyExactTotal() {
    var base =
      captureExactBasePrice();

    if (!(base > 0)) return;

    var total =
      Math.round(
        (
          base +
          exactSelectedExtrasTotal()
        ) * 100
      ) / 100;

    var main =
      document.getElementById(
        'main-price'
      );

    if (main) {
      var desiredMain =
        formatMainExact(total);

      if (
        main.textContent.trim() !==
        desiredMain
      ) {
        main.textContent =
          desiredMain;
      }
    }

    var sticky =
      document.querySelector(
        '#fl-product-sticky-header .flph-price, .flph-price'
      );

    if (sticky) {
      var desiredSticky =
        formatStickyExact(total);

      if (
        sticky.textContent.trim() !==
        desiredSticky
      ) {
        sticky.textContent =
          desiredSticky;
      }
    }
  }

  function scheduleExactTotalSync() {
    /*
     * Original Product Engine also reacts to checkbox changes.
     * Correct the display immediately after its own update.
     */
    [0, 40, 120].forEach(
      function (delay) {
        setTimeout(
          applyExactTotal,
          delay
        );
      }
    );
  }

  /* =========================================================
     PRODUCT CATALOG PRICE SOURCE — NO FETCH / NO DOMParser

     ProductCatalog is the single client-side source for the
     five Perfect Matches prices. Prices remain hidden inside
     the cards; only data-price is populated for Product Engine.
     ========================================================= */

  function normalizeNumber(value) {
    if (value == null) return 0;

    if (typeof value === 'number') {
      return Number.isFinite(value) && value > 0
        ? Math.round(value)
        : 0;
    }

    var clean = String(value)
      .replace(/\u00a0/g, ' ')
      .replace(/[^\d.,-]/g, '')
      .replace(/,/g, '');

    var n = parseFloat(clean);

    return Number.isFinite(n) && n > 0
      ? Math.round(n)
      : 0;
  }

  function money(value) {
    return '$' +
      Math.round(Number(value) || 0)
        .toLocaleString('en-US');
  }

  function normalizePath(value) {
    try {
      var u = new URL(
        String(value || ''),
        location.origin
      );

      var p =
        String(u.pathname || '/')
          .replace(/\/+$/g, '');

      return p || '/';
    } catch (e) {
      var p2 =
        String(value || '')
          .split('?')[0]
          .split('#')[0]
          .trim();

      if (!p2) return '';

      if (p2.charAt(0) !== '/') {
        p2 = '/' + p2;
      }

      return p2.replace(/\/+$/g, '') || '/';
    }
  }

  function catalogRoot() {
    var root =
      window.ProductCatalog || {};

    return (
      root &&
      root.products &&
      typeof root.products === 'object'
    )
      ? root.products
      : {};
  }

  function catalogHasProducts() {
    var products =
      catalogRoot();

    if (Array.isArray(products)) {
      return products.length > 0;
    }

    return Object.keys(products).length > 0;
  }

  function waitForCatalog(timeoutMs) {
    timeoutMs =
      Number(timeoutMs) || 5000;

    return new Promise(function (resolve) {
      var started = Date.now();

      function check() {
        if (catalogHasProducts()) {
          resolve(true);
          return;
        }

        if (
          Date.now() - started >=
          timeoutMs
        ) {
          resolve(false);
          return;
        }

        setTimeout(check, 80);
      }

      check();
    });
  }

  function priceFromProduct(product) {
    if (product == null) return 0;

    if (
      typeof product === 'number' ||
      typeof product === 'string'
    ) {
      return normalizeNumber(product);
    }

    var candidates = [
      product.price,
      product.regularPrice,
      product.cartPrice,
      product.amount,
      product.value,

      product.commerce &&
        product.commerce.regularPrice,

      product.commerce &&
        product.commerce.price,

      product.pricing &&
        product.pricing.regularPrice,

      product.pricing &&
        product.pricing.price
    ];

    for (
      var i = 0;
      i < candidates.length;
      i++
    ) {
      var n =
        normalizeNumber(
          candidates[i]
        );

      if (n > 0) return n;
    }

    return 0;
  }

  function productPathCandidates(product) {
    if (
      !product ||
      typeof product !== 'object'
    ) {
      return [];
    }

    return [
      product.path,
      product.url,
      product.href,
      product.slug,
      product.productPath,
      product.page &&
        product.page.productPath
    ]
      .filter(Boolean)
      .map(normalizePath);
  }

  function findCatalogProduct(pathOrUrl) {
    var wanted =
      normalizePath(pathOrUrl);

    if (!wanted) return null;

    var products =
      catalogRoot();

    if (Array.isArray(products)) {
      for (
        var ai = 0;
        ai < products.length;
        ai++
      ) {
        var arrayProduct =
          products[ai];

        if (
          productPathCandidates(
            arrayProduct
          ).indexOf(wanted) !== -1
        ) {
          return arrayProduct;
        }
      }

      return null;
    }

    var keyVariants = [
      wanted,
      wanted.replace(/^\/+/, ''),
      location.origin + wanted
    ];

    for (
      var k = 0;
      k < keyVariants.length;
      k++
    ) {
      if (
        Object.prototype
          .hasOwnProperty.call(
            products,
            keyVariants[k]
          )
      ) {
        return products[
          keyVariants[k]
        ];
      }
    }

    var entries =
      Object.entries(products);

    for (
      var i = 0;
      i < entries.length;
      i++
    ) {
      var key =
        entries[i][0];

      var product =
        entries[i][1];

      if (
        normalizePath(key) === wanted
      ) {
        return product;
      }

      if (
        productPathCandidates(
          product
        ).indexOf(wanted) !== -1
      ) {
        return product;
      }
    }

    return null;
  }

  async function resolveItemPrice(item) {
    var checkbox =
      item.querySelector(
        'input.price-item'
      );

    var anchor =
      item.querySelector(
        'a[href]'
      );

    if (!checkbox) return 0;

    var existing =
      normalizeNumber(
        checkbox.getAttribute(
          'data-price'
        )
      );

    if (existing > 0) {
      checkbox.dataset
        .fpPriceReady = '1';

      return existing;
    }

    if (!anchor) return 0;

    var catalogReady =
      await waitForCatalog(5000);

    if (!catalogReady) {
      console.warn(
        '[Product Engine] ProductCatalog was not ready for Perfect Matches.',
        {
          product:
            (item.textContent || '')
              .trim()
        }
      );

      return 0;
    }

    var href =
      anchor.getAttribute(
        'href'
      ) ||
      anchor.href ||
      '';

    var product =
      findCatalogProduct(href);

    var price =
      priceFromProduct(product);

    if (!(price > 0)) {
      console.warn(
        '[Product Engine] Perfect Matches catalog price not found.',
        {
          product:
            (item.textContent || '')
              .trim(),
          path:
            normalizePath(href)
        }
      );

      return 0;
    }

    var regularPrice =
      Math.round(price * 100) / 100;

    var discountedPrice =
      Math.round(
        regularPrice * 0.95 * 100
      ) / 100;

    checkbox.setAttribute(
      'data-regular-price',
      String(regularPrice)
    );

    checkbox.setAttribute(
      'data-perfect-match-discount',
      '5'
    );

    /*
     * Product Engine sums data-price for checked Perfect Matches.
     * Store the actual payable component price here:
     * current catalog price less 5%.
     * The base product price is NOT discounted.
     */
    checkbox.setAttribute(
      'data-price',
      String(discountedPrice)
    );

    checkbox.dataset
      .fpPriceReady = '1';

    /*
     * If a user selected the component before ProductCatalog
     * finished initializing, recalculate Product Engine now.
     */
    if (checkbox.checked) {
      checkbox.dispatchEvent(
        new Event(
          'change',
          { bubbles: true }
        )
      );
    }

    return price;
  }

  async function hydratePrices(block) {
    if (
      block.dataset
        .fpPmV6PricesHydrated === '1'
    ) {
      return;
    }

    var items =
      Array.prototype.slice.call(
        block.querySelectorAll(
          '.pm-formula label.pm-item'
        )
      );

    if (!items.length) return;

    var catalogReady =
      await waitForCatalog(5000);

    if (!catalogReady) {
      console.warn(
        '[Product Engine] Perfect Matches could not hydrate: ProductCatalog unavailable.'
      );
      return;
    }

    var prices =
      await Promise.all(
        items.map(
          resolveItemPrice
        )
      );

    var allReady =
      prices.length === items.length &&
      prices.every(
        function (price) {
          return price > 0;
        }
      );

    if (allReady) {
      block.dataset
        .fpPmV6PricesHydrated = '1';
    }

    scheduleStickyPriceSync();
    scheduleExactTotalSync();
  }

  /* =========================================================
     STICKY PRODUCT HEADER PRICE SYNC
     Existing sticky header uses:
       #fl-product-sticky-header
       .flph-price
     Main Product Engine uses:
       #main-price
     ========================================================= */
  function currentMainPrice() {
    var main =
      document.getElementById(
        'main-price'
      );

    if (!main) return 0;

    return parseExactMoney(
      main.textContent
    );
  }

  function syncStickyPrice() {
    var value =
      currentMainPrice();

    if (!(value > 0)) return;

    var sticky =
      document.querySelector(
        '#fl-product-sticky-header .flph-price, .flph-price'
      );

    if (!sticky) return;

    var desired =
      formatStickyExact(value);

    if (
      sticky.textContent
        .trim() !== desired
    ) {
      sticky.textContent =
        desired;
    }
  }

  function scheduleStickyPriceSync() {
    setTimeout(
      syncStickyPrice,
      0
    );

    requestAnimationFrame(
      syncStickyPrice
    );

    setTimeout(
      syncStickyPrice,
      80
    );
  }

  function attachPriceObservers() {
    var main =
      document.getElementById(
        'main-price'
      );

    if (
      main &&
      !mainPriceObserver
    ) {
      mainPriceObserver =
        new MutationObserver(
          scheduleStickyPriceSync
        );

      mainPriceObserver.observe(
        main,
        {
          childList: true,
          characterData: true,
          subtree: true
        }
      );
    }

    var sticky =
      document.querySelector(
        '#fl-product-sticky-header .flph-price, .flph-price'
      );

    if (
      sticky &&
      !stickyPriceObserver
    ) {
      stickyPriceObserver =
        new MutationObserver(
          function () {
            var value =
              currentMainPrice();

            if (!(value > 0)) return;

            var desired =
              formatStickyExact(value);

            if (
              sticky.textContent
                .trim() !== desired
            ) {
              sticky.textContent =
                desired;
            }
          }
        );

      stickyPriceObserver.observe(
        sticky,
        {
          childList: true,
          characterData: true,
          subtree: true
        }
      );
    }

    syncStickyPrice();
  }

  /* =========================================================
     UI BUILD
     ========================================================= */
  function buildToggle(block) {
    /*
     * Clean previous V3/V4 injected UI if code is
     * swapped during editing without a full browser restart.
     */
    block
      .querySelectorAll(
        '.fp-pm-toggle,' +
        '.fp-pm-v3-toggle,' +
        '.fp-pm-v3-path-head,' +
        '.fp-pm-v4-toggle,' +
        '.fp-pm-v4-path-head,' +
        '.fp-pm-v5-toggle'
      )
      .forEach(
        function (node) {
          node.remove();
        }
      );

    var toggle =
      document.createElement(
        'button'
      );

    toggle.type =
      'button';

    toggle.className =
      'fp-pm-v5-toggle';

    toggle.setAttribute(
      'aria-expanded',
      'false'
    );

    toggle.innerHTML =
      '<span class="fp-pm-v5-toggle-copy">' +
        '<span class="fp-pm-v5-toggle-eyebrow">' +
          'Perfect Matches' +
        '</span>' +
        '<span class="fp-pm-v5-toggle-note">' +
          'Add recommended synergy components to get ' +
          '<strong>5% OFF for EACH added device.</strong>' +
        '</span>' +
      '</span>' +

      '<span class="fp-pm-v5-toggle-control" aria-hidden="true">' +
        '<svg viewBox="0 0 20 20" fill="none">' +
          '<path ' +
            'd="M4 7.5L10 13L16 7.5" ' +
            'stroke="currentColor" ' +
            'stroke-width="1.9" ' +
            'stroke-linecap="round" ' +
            'stroke-linejoin="round"' +
          '/>' +
        '</svg>' +
      '</span>';

    block.insertBefore(
      toggle,
      block.firstChild
    );

    toggle.addEventListener(
      'click',
      function () {
        var open =
          block.classList.toggle(
            'fp-pm-open'
          );

        toggle.setAttribute(
          'aria-expanded',
          open
            ? 'true'
            : 'false'
        );

        if (open) {
          hydratePrices(block);
        }
      }
    );
  }

  function enhanceFormula(block) {
    var formula =
      block.querySelector(
        '.pm-formula'
      );

    if (!formula) return;

    /*
     * Remove all visual artefacts from V3/V4:
     * prices, logos, path heading, old helper labels.
     */
    block
      .querySelectorAll(
        '.fp-pm-v3-path-head,' +
        '.fp-pm-v4-path-head,' +
        '.fp-pm-v3-step,' +
        '.fp-pm-v3-role,' +
        '.fp-pm-v3-result-note,' +
        '.fp-pm-v3-brand,' +
        '.fp-pm-v3-price,' +
        '.fp-pm-v4-step,' +
        '.fp-pm-v4-role,' +
        '.fp-pm-v4-result-note,' +
        '.fp-pm-v4-brand,' +
        '.fp-pm-v4-price,' +
        '.fp-pm-v5-step,' +
        '.fp-pm-v5-role,' +
        '.fp-pm-v5-result-note'
      )
      .forEach(
        function (node) {
          node.remove();
        }
      );

    var base =
      formula.querySelector(
        '.pm-item.pm-base'
      );

    if (base) {
      var baseText =
        (base.textContent || '')
          .trim();

      addStep(
        base,
        'C'
      );

      addRole(
        base,
        productInfo(baseText)
      );
    }

    var selectable =
      Array.prototype.slice.call(
        formula.querySelectorAll(
          'label.pm-item'
        )
      );

    selectable.forEach(
      function (item, index) {

        /*
         * Make every add-on visibly a different
         * neutral-gray level.
         */
        for (
          var tone = 1;
          tone <= 5;
          tone++
        ) {
          item.classList.remove(
            'fp-pm-tone-' + tone
          );
        }

        item.classList.add(
          'fp-pm-tone-' +
          Math.min(
            index + 1,
            5
          )
        );

        var text =
          (item.textContent || '')
            .trim();

        addStep(
          item,
          String(index + 1)
        );

        addRole(
          item,
          productInfo(text)
        );

        syncSelected(item);

        var checkbox =
          item.querySelector(
            'input[type="checkbox"]'
          );

        if (
          checkbox &&
          !checkbox.dataset
            .fpPmV5Bound
        ) {
          checkbox.addEventListener(
            'change',
            function () {
              syncSelected(item);

              /*
               * Original Product Engine will update
               * #main-price from data-price.
               * Then update sticky header too.
               */
              scheduleStickyPriceSync();
              scheduleExactTotalSync();

              if (
                checkbox.checked &&
                normalizeNumber(
                  checkbox.getAttribute(
                    'data-price'
                  )
                ) <= 0 &&
                checkbox.dataset
                  .fpPriceLookup !== '1'
              ) {
                checkbox.dataset
                  .fpPriceLookup = '1';

                resolveItemPrice(item)
                  .finally(
                    function () {
                      checkbox.dataset
                        .fpPriceLookup = '';
                    }
                  );
              }
            }
          );

          checkbox.dataset
            .fpPmV5Bound = '1';
        }
      }
    );

    var result =
      formula.querySelector(
        '.pm-result'
      );

    if (result) {
      if (
        !result.querySelector(
          '.fp-pm-v5-result-note'
        )
      ) {
        var note =
          document.createElement(
            'span'
          );

        note.className =
          'fp-pm-v5-result-note';

        note.textContent =
          'Complete curated synergy configuration';

        result.appendChild(
          note
        );
      }
    }
  }

  function initBlock(block) {
    if (!block) return;

    block.classList.remove(
      'fp-pm-v3',
      'fp-pm-v4'
    );

    block.classList.add(
      'fp-pm-v5'
    );

    block.classList.remove(
      'fp-pm-open'
    );

    buildToggle(block);
    enhanceFormula(block);

    block.dataset
      .fpPmPremiumV5 = '1';
  }


  /* =========================================================
     PERFECT MATCHES -> SEPARATE TILDA CART ITEMS — V6.5

     When at least one Perfect Match is selected:
     - intercept BUY NOW before Tilda serializes checkboxes as options;
     - add the base product as its own Tilda cart item;
     - add every selected Perfect Match as its own cart item;
     - each Perfect Match uses the already calculated 5%-off data-price;
     - then open the dedicated /cart page.

     With no Perfect Matches selected, native Tilda BUY NOW remains unchanged.
     ========================================================= */

  function readProductData() {
    var el =
      document.getElementById(
        'product-data'
      );

    if (!el) return {};

    try {
      return JSON.parse(
        el.textContent || '{}'
      );
    } catch (error) {
      console.error(
        '[Product Engine] Invalid #product-data JSON.',
        error
      );

      return {};
    }
  }

  function absoluteUrl(pathOrUrl) {
    try {
      return new URL(
        String(pathOrUrl || ''),
        location.origin
      ).href;
    } catch (e) {
      return String(pathOrUrl || '');
    }
  }

  function productCatalogRecord(pathOrUrl) {
    var record =
      findCatalogProduct(
        pathOrUrl
      );

    return (
      record &&
      typeof record === 'object'
    )
      ? record
      : {};
  }

  function firstUsefulImage(candidates) {
    for (
      var i = 0;
      i < candidates.length;
      i++
    ) {
      var value =
        String(
          candidates[i] || ''
        ).trim();

      if (!value) continue;

      if (
        /\/resize\/20x\//i
          .test(value)
      ) {
        continue;
      }

      return value;
    }

    return '';
  }

  function currentProductImage() {
    var og =
      document.querySelector(
        'meta[property="og:image"]'
      );

    var selectors = [
      '.t-slds__item_active img[src]',
      '.t-slds__item img[src]',
      '.js-product img[src]',
      '.product-gallery img[src]',
      '.t-store__card__imgwrapper img[src]'
    ];

    var candidates = [];

    if (og) {
      candidates.push(
        og.getAttribute('content')
      );
    }

    selectors.forEach(
      function (selector) {
        var img =
          document.querySelector(
            selector
          );

        if (!img) return;

        candidates.push(
          img.currentSrc,
          img.getAttribute('src'),
          img.getAttribute('data-original'),
          img.getAttribute('data-src')
        );
      }
    );

    return firstUsefulImage(
      candidates
    );
  }

  function catalogImage(product) {
    product =
      product || {};

    return firstUsefulImage([
      product.img,
      product.image,
      product.imageUrl,
      product.thumbnail,
      product.photo,
      product.assets &&
        product.assets.mainImage,
      product.assets &&
        product.assets.image,
      product.media &&
        product.media.image
    ]);
  }

  function safeId(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, '')
      .replace(/[^a-z0-9_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function makeTildaCartItem(data) {
    var id =
      safeId(
        data.id ||
        data.sku ||
        data.name
      ) ||
      (
        'perfect-match-' +
        Date.now()
      );

    var price =
      Math.round(
        parseExactMoney(
          data.price
        ) * 100
      ) / 100;

    var url =
      absoluteUrl(
        data.url ||
        data.path ||
        location.pathname
      );

    var img =
      String(
        data.img || ''
      ).trim();

    return {
      name:
        String(
          data.name || id
        ).trim(),

      price: price,
      amount: price,
      quantity: 1,

      img: img,

      url: url,

      uid: id,
      sku: id,
      inv: 999999,

      recid:
        String(
          data.recid || ''
        ),

      lid: '',
      portion: 0,
      unit: '',
      single: '',
      options: null,

      pack_label: '',
      pack_m: '',
      pack_x: '',
      pack_y: '',
      pack_z: '',
      part_uids: [],
      gen_uid: id,

      __flcartCanonicalName:
        String(
          data.name || id
        ).trim(),

      __flcartBasePrice:
        price,

      __flcartUrl:
        url,

      __flcartImage:
        img,

      __fpPerfectMatch:
        data.perfectMatch === true,

      __fpRegularPrice:
        data.regularPrice != null
          ? Math.round(
              parseExactMoney(
                data.regularPrice
              ) * 100
            ) / 100
          : price,

      __fpDiscountPercent:
        data.perfectMatch === true
          ? 5
          : 0
    };
  }

  function selectedPerfectMatchRows() {
    return Array.prototype.slice.call(
      document.querySelectorAll(
        '.perfect-matches-block label.pm-item'
      )
    ).filter(
      function (item) {
        var checkbox =
          item.querySelector(
            'input.price-item'
          );

        return !!(
          checkbox &&
          checkbox.checked
        );
      }
    );
  }

  async function ensureSelectedPrices(rows) {
    await Promise.all(
      rows.map(
        resolveItemPrice
      )
    );

    return rows.every(
      function (item) {
        var checkbox =
          item.querySelector(
            'input.price-item'
          );

        return (
          checkbox &&
          parseExactMoney(
            checkbox.getAttribute(
              'data-price'
            )
          ) > 0
        );
      }
    );
  }

  function baseCartItem() {
    var data =
      readProductData();

    var commerce =
      data.commerce || {};

    var page =
      data.page || {};

    var id =
      data.id ||
      data.slug ||
      safeId(
        data.name ||
        [
          data.brand,
          data.model
        ].filter(Boolean).join(' ')
      );

    var name =
      String(
        data.name ||
        [
          data.brand,
          data.model
        ].filter(Boolean).join(' ') ||
        document.title ||
        'Product'
      ).trim();

    var price =
      parseExactMoney(
        commerce.regularPrice
      ) ||
      captureExactBasePrice();

    var path =
      page.productPath ||
      (
        data.slug
          ? '/' + data.slug
          : location.pathname
      );

    var catalogProduct =
      productCatalogRecord(
        path
      );

    return makeTildaCartItem({
      id:
        catalogProduct.id ||
        id,

      sku:
        catalogProduct.sku ||
        id,

      name:
        (
          window.FilinFullProductProfilesV2 &&
          window.FilinFullProductProfilesV2.get &&
          window.FilinFullProductProfilesV2.get(data.slug) &&
          window.FilinFullProductProfilesV2.get(data.slug).commerce &&
          window.FilinFullProductProfilesV2.get(data.slug).commerce.cartName
        ) ||
        catalogProduct.name ||
        name,

      price: price,

      regularPrice: price,

      path:
        catalogProduct.path ||
        path,

      img:
        catalogImage(
          catalogProduct
        ) ||
        currentProductImage(),

      recid:
        (
          document
            .querySelector(
              '.perfect-matches-block'
            )
            ?.closest(
              '[id^="rec"]'
            )
            ?.id ||
          ''
        ).replace(
          /^rec/,
          ''
        ),

      perfectMatch: false
    });
  }

  function perfectMatchCartItem(item) {
    var checkbox =
      item.querySelector(
        'input.price-item'
      );

    var anchor =
      item.querySelector(
        'a[href]'
      );

    if (
      !checkbox ||
      !anchor
    ) {
      return null;
    }

    var href =
      anchor.getAttribute(
        'href'
      ) ||
      anchor.href ||
      '';

    var catalogProduct =
      productCatalogRecord(
        href
      );

    var visibleName =
      String(
        anchor.textContent || ''
      )
        .replace(
          /\s+/g,
          ' '
        )
        .trim();

    var path =
      (
        catalogProduct.path ||
        href
      );

    var id =
      catalogProduct.id ||
      safeId(
        normalizePath(path) ||
        visibleName
      );

    var discountedPrice =
      parseExactMoney(
        checkbox.getAttribute(
          'data-price'
        )
      );

    var regularPrice =
      parseExactMoney(
        checkbox.getAttribute(
          'data-regular-price'
        )
      ) ||
      priceFromProduct(
        catalogProduct
      );

    return makeTildaCartItem({
      id: id,

      sku:
        catalogProduct.sku ||
        id,

      name:
        catalogProduct.name ||
        visibleName,

      price:
        discountedPrice,

      regularPrice:
        regularPrice,

      path:
        path,

      img:
        catalogImage(
          catalogProduct
        ),

      recid:
        catalogProduct.recid ||
        '',

      perfectMatch: true
    });
  }

  function isProductBuyButton(target) {
    if (!target) return null;

    var button =
      target.closest(
        'a.js-product-btn,' +
        '.buy-btn.js-product-btn,' +
        '#fl-product-sticky-header a,' +
        '#fl-product-sticky-header button'
      );

    if (!button) return null;

    if (
      button.closest(
        '#fl-product-sticky-header'
      )
    ) {
      return button;
    }

    if (
      button.matches(
        'a.js-product-btn,' +
        '.buy-btn.js-product-btn'
      )
    ) {
      return button;
    }

    return null;
  }

  var bundleAddInProgress =
    false;

  async function addSelectedBundleToCart(event) {
    var button =
      isProductBuyButton(
        event.target
      );

    if (!button) return;

    var rows =
      selectedPerfectMatchRows();

    /*
     * No Perfect Matches selected:
     * preserve the site's existing native Tilda behavior.
     */
    if (!rows.length) return;

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    if (bundleAddInProgress) {
      return;
    }

    bundleAddInProgress =
      true;

    try {
      if (
        typeof window
          .tcart__addProduct !==
        'function'
      ) {
        throw new Error(
          'tcart__addProduct is unavailable'
        );
      }

      var pricesReady =
        await ensureSelectedPrices(
          rows
        );

      if (!pricesReady) {
        throw new Error(
          'Perfect Matches prices are not ready'
        );
      }

      var base =
        baseCartItem();

      if (
        !base ||
        !(base.price > 0)
      ) {
        throw new Error(
          'Base product could not be prepared'
        );
      }

      var extras =
        rows
          .map(
            perfectMatchCartItem
          )
          .filter(Boolean);

      if (
        extras.length !==
        rows.length
      ) {
        throw new Error(
          'One or more Perfect Matches could not be prepared'
        );
      }

      cleanPerfectMatchOptionSnapshots(
        extras
      );

      /*
       * Native Tilda method:
       * each object becomes its own tcart.products entry.
       */
      window.tcart__addProduct(
        base
      );

      extras.forEach(
        function (product) {
          window.tcart__addProduct(
            product
          );
        }
      );

      sanitizePerfectMatchCartObjects(
        extras
      );

      cleanPerfectMatchOptionSnapshots(
        extras
      );

      console.info(
        '[Product Engine] Perfect Matches added as separate cart items.',
        {
          base:
            base.name,
          extras:
            extras.map(
              function (item) {
                return {
                  name:
                    item.name,
                  price:
                    item.price,
                  regularPrice:
                    item.__fpRegularPrice,
                  discountPercent:
                    item.__fpDiscountPercent
                };
              }
            )
        }
      );

      /*
       * tcart__addProduct saves the native cart after every call.
       * Give the last write a moment to complete, then go to
       * the site's dedicated cart page.
       */
      setTimeout(
        function () {
          location.href =
            '/cart';
        },
        120
      );

    } catch (error) {
      bundleAddInProgress =
        false;

      console.error(
        '[Product Engine] Could not add Perfect Matches as separate cart items.',
        error
      );

      alert(
        'The selected Perfect Matches could not be added to the cart. Please try again.'
      );
    }
  }

  function cleanPerfectMatchOptionSnapshots(extras) {
    /*
     * The global cart enhancer captures every checked checkbox
     * as a possible product option before our bundle handler runs.
     * Perfect Matches are separate products, NOT options.
     *
     * Remove that pending snapshot and remove only the saved-option
     * entries belonging to Perfect Match products.
     */
    try {
      localStorage.removeItem(
        'flcart_pending_options_v4'
      );
    } catch (e) {}

    try {
      var raw =
        localStorage.getItem(
          'flcart_saved_options_v4'
        );

      if (!raw) return;

      var store =
        JSON.parse(raw) || {};

      (extras || []).forEach(
        function (product) {
          var direct =
            product &&
            (
              product.uid ||
              product.sku ||
              product.lid ||
              product.id
            );

          if (!direct) return;

          delete store[
            'id:' + direct
          ];
        }
      );

      localStorage.setItem(
        'flcart_saved_options_v4',
        JSON.stringify(store)
      );
    } catch (e) {}
  }

  function sanitizePerfectMatchCartObjects(extras) {
    if (
      !window.tcart ||
      !Array.isArray(
        window.tcart.products
      )
    ) {
      return;
    }

    var ids =
      new Set(
        (extras || [])
          .map(
            function (product) {
              return (
                product.uid ||
                product.sku ||
                ''
              );
            }
          )
          .filter(Boolean)
      );

    window.tcart.products
      .forEach(
        function (product) {
          var id =
            product &&
            (
              product.uid ||
              product.sku ||
              ''
            );

          if (!ids.has(id)) {
            return;
          }

          product.options = null;
          delete product.__flcartOptions;
        }
      );

    try {
      if (
        typeof window
          .tcart__saveLocalObj ===
        'function'
      ) {
        window
          .tcart__saveLocalObj();
      }
    } catch (e) {}
  }

  function bindSeparateCartItems() {
    document.addEventListener(
      'click',
      addSelectedBundleToCart,
      true
    );
  }

  function init() {
    document
      .querySelectorAll(
        '.perfect-matches-block'
      )
      .forEach(
        initBlock
      );

    captureExactBasePrice();
    attachPriceObservers();
    scheduleExactTotalSync();
    bindSeparateCartItems();

    /*
     * Sticky header is built by a separate global
     * script and may appear slightly later.
     * Limited retries; no permanent polling.
     */
    setTimeout(
      attachPriceObservers,
      300
    );

    setTimeout(
      attachPriceObservers,
      900
    );

    setTimeout(
      attachPriceObservers,
      1800
    );

    console.info(
      '[Master Product V2] PERFECT MATCHES V6.6 / V2.4 READY.'
    );
  }

  if (
    document.readyState ===
    'loading'
  ) {
    document.addEventListener(
      'DOMContentLoaded',
      init,
      { once: true }
    );
  } else {
    init();
  }
})();


/* ===== GOLDEN BACKUP NATIVE PROMOTIONS V1 — V2.6 ===== */
(function(){
  'use strict';

  function mountPromoSection(){
    if (document.getElementById('product-promotions')) return true;

    var footer =
      document.getElementById('t-footer') ||
      document.querySelector('footer') ||
      document.querySelector('[data-footer]');

    if (!footer || !footer.parentNode) return false;

    var host = document.createElement('div');
    host.id = 'fp-v24-promotions-host';
    host.innerHTML = '<section class="fpp" id="product-promotions" aria-labelledby="fpp-title">\n  <div class="fpp-shell">\n    <header class="fpp-head">\n      <h2 class="fpp-title" id="fpp-title">\n        <span class="fpp-title-desktop">PROMOTIONS</span>\n        <span class="fpp-title-mobile">HI-FI &amp; HIGH-END EQUIPMENT</span>\n      </h2>\n\n      <div class="fpp-nav" aria-label="Promotion navigation">\n        <button class="fpp-arrow fpp-prev" type="button" aria-label="Previous products">\n          <svg viewBox="0 0 24 24" aria-hidden="true">\n            <path d="M15 5l-7 7 7 7"></path>\n          </svg>\n        </button>\n        <button class="fpp-arrow fpp-next" type="button" aria-label="Next products">\n          <svg viewBox="0 0 24 24" aria-hidden="true">\n            <path d="M9 5l7 7-7 7"></path>\n          </svg>\n        </button>\n      </div>\n    </header>\n\n    <div class="fpp-track" role="list" tabindex="0" aria-label="Promotional products"></div>\n  </div>\n</section>';

    footer.parentNode.insertBefore(host, footer);
    return true;
  }

  function mountPromoStyle(){
    if (document.getElementById('fp-v24-promotions-style')) return;
    var s = document.createElement('style');
    s.id = 'fp-v24-promotions-style';
    s.textContent = '/* =========================================================\n   GLOBAL PRODUCT PROMOTIONS ENGINE V1\n   Performance-first:\n   - no Swiper\n   - no external CSS/JS\n   - native touch scrolling\n   - scroll-snap\n   - lazy images\n   - relative product URLs\n   ========================================================= */\n\n.fpp,\n.fpp * {\n  box-sizing: border-box;\n  font-family: \'Montserrat\', Arial, sans-serif !important;\n}\n\n.fpp {\n  --fpp-accent: #bc8c5e;\n  --fpp-accent-dark: #916438;\n  --fpp-sale: #ed1c24;\n  --fpp-star: #f7b500;\n  --fpp-ink: #252525;\n  --fpp-muted: #858585;\n  --fpp-line: #e8e3de;\n  --fpp-bg: #ffffff;\n  --fpp-gap: 12px;\n\n  width: 100%;\n  padding: 34px 52px 38px;\n  background: transparent;\n  color: var(--fpp-ink);\n}\n\n.fpp-shell {\n  position: relative;\n  width: min(100%, 1280px);\n  margin: 0 auto;\n  overflow: hidden;\n  border: 1px solid #ddd8d3;\n  background: var(--fpp-bg);\n  box-shadow: 0 16px 34px rgba(0,0,0,.10);\n}\n\n.fpp-shell::before {\n  content: "";\n  position: absolute;\n  z-index: 3;\n  inset: 0 0 auto;\n  height: 3px;\n  background: var(--fpp-accent);\n}\n\n.fpp-head {\n  min-height: 68px;\n  padding: 3px 18px 0;\n  border-bottom: 1px solid var(--fpp-line);\n  display: grid;\n  grid-template-columns: 1fr auto 1fr;\n  align-items: center;\n}\n\n.fpp-title {\n  grid-column: 2;\n  margin: 0;\n  color: var(--fpp-ink);\n  font-size: 26px;\n  line-height: 1.1;\n  font-weight: 500;\n  letter-spacing: .04em;\n  text-align: center;\n}\n\n.fpp-title-mobile {\n  display: none;\n}\n\n.fpp-nav {\n  grid-column: 3;\n  justify-self: end;\n  display: flex;\n  gap: 8px;\n}\n\n.fpp-arrow {\n  width: 38px;\n  height: 38px;\n  padding: 0;\n  border: 1px solid #d8d2cc;\n  border-radius: 50%;\n  background: #fff;\n  color: #282828;\n  display: grid;\n  place-items: center;\n  cursor: pointer;\n  transition: background .18s ease, color .18s ease, border-color .18s ease;\n}\n\n.fpp-arrow:hover,\n.fpp-arrow:focus-visible {\n  border-color: var(--fpp-accent);\n  background: var(--fpp-accent);\n  color: #fff;\n}\n\n.fpp-arrow:disabled {\n  opacity: .32;\n  cursor: default;\n  background: #fff;\n  color: #777;\n  border-color: #ddd;\n}\n\n.fpp-arrow svg {\n  width: 17px;\n  height: 17px;\n  fill: none;\n  stroke: currentColor;\n  stroke-width: 2.2;\n  stroke-linecap: round;\n  stroke-linejoin: round;\n}\n\n.fpp-track {\n  width: 100%;\n  padding: 18px;\n  display: grid;\n  grid-auto-flow: column;\n  grid-auto-columns: calc((100% - (var(--fpp-gap) * 4)) / 5);\n  gap: var(--fpp-gap);\n\n  overflow-x: auto;\n  overflow-y: hidden;\n  overscroll-behavior-inline: contain;\n  scroll-snap-type: x mandatory;\n  scroll-behavior: smooth;\n  -webkit-overflow-scrolling: touch;\n\n  scrollbar-width: none;\n}\n\n.fpp-track::-webkit-scrollbar {\n  display: none;\n}\n\n.fpp-card {\n  position: relative;\n  min-width: 0;\n  min-height: 388px;\n  padding: 12px 12px 14px;\n  overflow: hidden;\n  border: 1px solid #ece8e4;\n  border-radius: 8px;\n  background: #fff;\n  display: flex;\n  flex-direction: column;\n  text-align: center;\n  scroll-snap-align: start;\n  contain: layout paint;\n}\n\n.fpp-media {\n  position: relative;\n  display: block;\n  width: 100%;\n  aspect-ratio: 1.24 / 1;\n  margin: 0 0 10px;\n  overflow: hidden;\n  border-radius: 5px;\n  background: #f6f5f3;\n  text-decoration: none;\n}\n\n.fpp-img {\n  display: block;\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform .22s ease;\n}\n\n@media (hover:hover) {\n  .fpp-card:hover .fpp-img {\n    transform: scale(1.025);\n  }\n}\n\n.fpp-badge {\n  position: absolute;\n  z-index: 2;\n  top: 9px;\n  right: -35px;\n  width: 116px;\n  min-height: 28px;\n  padding: 6px 5px;\n  background: var(--fpp-sale);\n  color: #fff;\n  font-size: 11px;\n  line-height: 1;\n  font-weight: 800;\n  transform: rotate(45deg);\n}\n\n.fpp-name {\n  min-height: 52px;\n  margin: 0;\n  color: #4a4744;\n  font-size: 14px;\n  line-height: 1.3;\n  font-weight: 500;\n  text-decoration: none;\n\n  display: -webkit-box;\n  overflow: hidden;\n  -webkit-box-orient: vertical;\n  -webkit-line-clamp: 3;\n}\n\n.fpp-name:hover {\n  color: var(--fpp-accent-dark);\n}\n\n.fpp-rating {\n  min-height: 25px;\n  margin: 7px 0 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 1px;\n  color: var(--fpp-star);\n  font-size: 18px;\n  line-height: 1;\n  letter-spacing: 1px;\n}\n\n.fpp-rating-muted {\n  color: #d5d5d5;\n}\n\n.fpp-foot {\n  margin-top: auto;\n  padding-top: 10px;\n}\n\n.fpp-old {\n  min-height: 16px;\n  margin-bottom: 2px;\n  color: #999;\n  font-size: 10px;\n  line-height: 1.2;\n  text-decoration: line-through;\n}\n\n.fpp-price {\n  color: var(--fpp-sale);\n  font-size: 17px;\n  line-height: 1.15;\n  font-weight: 800;\n}\n\n.fpp-buy {\n  min-width: 112px;\n  min-height: 37px;\n  margin-top: 10px;\n  padding: 9px 16px;\n  border: 1px solid var(--fpp-accent);\n  border-radius: 999px;\n  background: var(--fpp-accent);\n  color: #fff;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 5px 13px rgba(188,140,94,.20);\n  font-size: 10px;\n  line-height: 1;\n  font-weight: 800;\n  letter-spacing: .035em;\n  text-decoration: none;\n  text-transform: uppercase;\n}\n\n.fpp-buy:hover,\n.fpp-buy:focus-visible {\n  border-color: var(--fpp-accent-dark);\n  background: var(--fpp-accent-dark);\n}\n\n/* Tablet */\n@media (min-width: 701px) and (max-width: 1100px) {\n  .fpp {\n    padding: 28px 28px 32px;\n  }\n\n  .fpp-track {\n    grid-auto-columns: calc((100% - (var(--fpp-gap) * 2)) / 3);\n  }\n\n  .fpp-card {\n    min-height: 355px;\n  }\n\n  .fpp-name {\n    font-size: 13px;\n  }\n}\n\n/* Phones */\n@media (max-width: 700px) {\n  .fpp {\n    --fpp-gap: 8px;\n    padding: 20px 8px 28px;\n  }\n\n  .fpp-shell {\n    border-color: #e8e3df;\n    box-shadow: none;\n  }\n\n  .fpp-shell::before {\n    display: none;\n  }\n\n  .fpp-head {\n    min-height: 74px;\n    padding: 10px 14px 8px;\n    grid-template-columns: 1fr;\n  }\n\n  .fpp-title {\n    grid-column: 1;\n    font-size: 22px;\n    line-height: 1.08;\n    letter-spacing: .06em;\n  }\n\n  .fpp-title-desktop {\n    display: none;\n  }\n\n  .fpp-title-mobile {\n    display: inline;\n  }\n\n  .fpp-nav {\n    display: none;\n  }\n\n  .fpp-track {\n    padding: 8px 8px 16px;\n    grid-auto-columns: calc((100% - var(--fpp-gap)) / 2);\n    scroll-padding-inline: 8px;\n  }\n\n  .fpp-card {\n    min-height: 278px;\n    padding: 7px 7px 10px;\n    border-radius: 6px;\n  }\n\n  .fpp-media {\n    aspect-ratio: 1.16 / 1;\n    margin-bottom: 7px;\n  }\n\n  .fpp-badge {\n    top: 8px;\n    right: -37px;\n    width: 110px;\n    min-height: 24px;\n    padding: 5px 4px;\n    font-size: 9px;\n  }\n\n  .fpp-name {\n    min-height: 38px;\n    font-size: 11px;\n    line-height: 1.25;\n    -webkit-line-clamp: 2;\n  }\n\n  .fpp-rating {\n    min-height: 18px;\n    margin-top: 4px;\n    font-size: 14px;\n    letter-spacing: 0;\n  }\n\n  .fpp-foot {\n    padding-top: 5px;\n  }\n\n  .fpp-old {\n    min-height: 12px;\n    font-size: 8.5px;\n  }\n\n  .fpp-price {\n    font-size: 13px;\n  }\n\n  .fpp-buy {\n    min-width: 0;\n    min-height: 31px;\n    margin-top: 7px;\n    padding: 7px 12px;\n    font-size: 8.5px;\n  }\n}\n\n@media (prefers-reduced-motion: reduce) {\n  .fpp-track {\n    scroll-behavior: auto;\n  }\n\n  .fpp-img,\n  .fpp-arrow {\n    transition: none;\n  }\n}';
    document.head.appendChild(s);
  }

  function start(){
    mountPromoStyle();
    if (!mountPromoSection()) return false;
    return true;
  }

  window.__FP_V24_PROMO_MOUNT__ = start;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, {once:true});
  } else {
    start();
  }
})();

(function () {
  'use strict';

  if (window.__FP_V24_PROMO_MOUNT__) {
    window.__FP_V24_PROMO_MOUNT__();
  }

  if (window.__MASTER_PRODUCT_PROMOTIONS_V24__) return;
  if (
    window.__GLOBAL_PRODUCT_PROMOTIONS_V1__ &&
    document.querySelector('#product-promotions .fpp-card')
  ) {
    console.info('[Master Product V2] Existing Native Promotions V1 reused.');
    return;
  }
  window.__MASTER_PRODUCT_PROMOTIONS_V24__ = true;

  var PRODUCTS = [
    {
      id: 'standard',
      name: 'Filin Audio Model 1 Standard V2',
      price: '$799.00',
      oldPrice: '$999.00',
      discount: '-20%',
      rating: 5,
      cartPrice: '799',
      img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=700&q=78',
      url: '/filin_audio_model_1_standard_v2'
    },
    {
      id: 'premium',
      name: 'Filin Audio Model 1 Premium',
      price: '$999.00',
      oldPrice: '$1,199.00',
      discount: '-17%',
      rating: 4,
      cartPrice: '999',
      img: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=700&q=78',
      url: '/filin_audio_model_1_premium'
    },
    {
      id: 'limited',
      name: 'Filin Audio Limited',
      price: '$1,290.00',
      oldPrice: '$1,490.00',
      discount: '-13%',
      rating: 5,
      cartPrice: '1290',
      img: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=700&q=78',
      url: '/filin_audio_limited'
    },
    {
      id: 'quadron',
      name: 'Filin Quadron',
      price: '$1,799.00',
      oldPrice: '$1,999.00',
      discount: '-10%',
      rating: 5,
      cartPrice: '1799',
      img: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=700&q=78',
      url: '/filin_audio_quadron'
    },
    {
      id: 'perun',
      name: 'Perun Electrostatic Headphones',
      price: '$1,490.00',
      oldPrice: '$1,690.00',
      discount: '-12%',
      rating: 4,
      cartPrice: '1490',
      img: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=700&q=78',
      url: '/about_perun_audio_electroacoustic'
    },
    {
      id: 'demograf',
      name: 'Demograf Audio DAC & Headphone Amplifier',
      price: '$1,150.00',
      oldPrice: '$1,290.00',
      discount: '-11%',
      rating: 5,
      cartPrice: '1150',
      img: 'https://images.unsplash.com/photo-1599669454699-248893623440?auto=format&fit=crop&w=700&q=78',
      url: '/about_demograf_audio_equipment'
    },
    {
      id: 'snorry',
      name: 'Snorry Isodynamic Headphones',
      price: '$1,090.00',
      oldPrice: '$1,250.00',
      discount: '-13%',
      rating: 4,
      cartPrice: '1090',
      img: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=700&q=78',
      url: '/about_snorry_isodynamic'
    },
    {
      id: 'phenomenon',
      name: 'Phenomenon Electrostatic Headphones',
      price: '$1,390.00',
      oldPrice: '$1,590.00',
      discount: '-13%',
      rating: 5,
      cartPrice: '1390',
      img: 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?auto=format&fit=crop&w=700&q=78',
      url: '/about_phenomenon_audio_electroacoustic'
    },
    {
      id: 'gerbera',
      name: 'Gerbera Sound Headphone Amplifier',
      price: '$890.00',
      oldPrice: '$990.00',
      discount: '-10%',
      rating: 4,
      cartPrice: '890',
      img: 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?auto=format&fit=crop&w=700&q=78',
      url: '/about_gerbera_sound'
    },
    {
      id: 'flatvox',
      name: 'Flatvox Planar Headphones',
      price: '$990.00',
      oldPrice: '$1,090.00',
      discount: '-9%',
      rating: 4,
      cartPrice: '990',
      img: 'https://images.unsplash.com/photo-1545127398-14699f92334b?auto=format&fit=crop&w=700&q=78',
      url: '/about_flatvox_headphones'
    },
    {
      id: 'kittek',
      name: 'Kittek Boutique Audio',
      price: '$790.00',
      oldPrice: '$890.00',
      discount: '-11%',
      rating: 5,
      cartPrice: '790',
      img: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=700&q=78',
      url: '/about_kittek_audio'
    },
    {
      id: 'audioinstrument',
      name: 'Audioinstrument High-End Audio Component',
      price: '$1,250.00',
      oldPrice: '$1,450.00',
      discount: '-14%',
      rating: 5,
      cartPrice: '1250',
      img: 'https://images.unsplash.com/photo-1558584673-c834fb7cc3ca?auto=format&fit=crop&w=700&q=78',
      url: '/about_audioinstrument'
    }
  ];

  var root = document.getElementById('product-promotions');
  if (!root) return;

  var track = root.querySelector('.fpp-track');
  var prev = root.querySelector('.fpp-prev');
  var next = root.querySelector('.fpp-next');

  function esc(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function ratingMarkup(value) {
    var n = Math.max(0, Math.min(5, Number(value) || 0));
    var html = '';
    for (var i = 1; i <= 5; i++) {
      html += '<span class="' + (i <= n ? '' : 'fpp-rating-muted') + '">★</span>';
    }
    return html;
  }

  function orderHref(product) {
    return '#order:' +
      encodeURIComponent(product.name) +
      '=' +
      encodeURIComponent(product.cartPrice || '0') +
      ':::image=' +
      encodeURIComponent(product.img || '');
  }

  function card(product) {
    return (
      '<article class="fpp-card" role="listitem" data-product="' + esc(product.id) + '">' +
        '<a class="fpp-media" href="' + esc(product.url) + '" data-fpp-select="1">' +
          '<img class="fpp-img" src="' + esc(product.img) + '"' +
          ' alt="' + esc(product.name) + '"' +
          ' loading="lazy" decoding="async" fetchpriority="low">' +
          (product.discount ? '<span class="fpp-badge">' + esc(product.discount) + '</span>' : '') +
        '</a>' +
        '<a class="fpp-name" href="' + esc(product.url) + '" data-fpp-select="1">' +
          esc(product.name) +
        '</a>' +
        '<div class="fpp-rating" aria-label="' + esc(product.rating) + ' out of 5 stars">' +
          ratingMarkup(product.rating) +
        '</div>' +
        '<div class="fpp-foot">' +
          '<div class="fpp-old">' + esc(product.oldPrice || '') + '</div>' +
          '<div class="fpp-price">' + esc(product.price || '') + '</div>' +
          '<a class="fpp-buy js-click-addtocart"' +
          ' href="' + orderHref(product) + '"' +
          ' data-fpp-buy="1"' +
          ' data-id="' + esc(product.id) + '"' +
          ' data-name="' + esc(product.name) + '"' +
          ' data-price="' + esc(product.cartPrice || '0') + '">' +
            'BUY NOW' +
          '</a>' +
        '</div>' +
      '</article>'
    );
  }

  track.innerHTML = PRODUCTS.map(card).join('');

  function scrollStep() {
    var first = track.querySelector('.fpp-card');
    if (!first) return Math.max(240, track.clientWidth * .5);

    var style = getComputedStyle(track);
    var gap = parseFloat(style.columnGap || style.gap || '0') || 0;
    return first.getBoundingClientRect().width + gap;
  }

  function updateArrows() {
    var max = track.scrollWidth - track.clientWidth - 2;
    prev.disabled = track.scrollLeft <= 2;
    next.disabled = track.scrollLeft >= max;
  }

  prev.addEventListener('click', function () {
    track.scrollBy({
      left: -scrollStep(),
      behavior: 'smooth'
    });
  });

  next.addEventListener('click', function () {
    track.scrollBy({
      left: scrollStep(),
      behavior: 'smooth'
    });
  });

  track.addEventListener('scroll', function () {
    window.requestAnimationFrame(updateArrows);
  }, { passive: true });

  root.addEventListener('click', function (event) {
    var buy = event.target.closest('[data-fpp-buy="1"]');
    if (buy) {
      var value = parseFloat(buy.dataset.price || '0') || 0;

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'add_to_cart', {
          currency: 'USD',
          value: value,
          items: [{
            item_id: buy.dataset.id || '',
            item_name: buy.dataset.name || '',
            price: value,
            quantity: 1
          }]
        });
      }
      return;
    }

    var select = event.target.closest('[data-fpp-select="1"]');
    if (select) {
      var cardNode = select.closest('.fpp-card');
      if (!cardNode) return;

      var product = PRODUCTS.find(function (item) {
        return item.id === cardNode.dataset.product;
      });

      if (product && typeof window.gtag === 'function') {
        window.gtag('event', 'select_item', {
          item_list_name: 'Product Promotions',
          items: [{
            item_id: product.id,
            item_name: product.name,
            price: parseFloat(product.cartPrice || '0') || 0
          }]
        });
      }
    }
  });

  /* View event only when the block actually approaches the viewport */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      if (!entries.some(function (entry) { return entry.isIntersecting; })) return;

      io.disconnect();

      if (typeof window.gtag === 'function') {
        window.gtag('event', 'view_item_list', {
          item_list_name: 'Product Promotions',
          items: PRODUCTS.map(function (product, index) {
            return {
              item_id: product.id,
              item_name: product.name,
              price: parseFloat(product.cartPrice || '0') || 0,
              index: index
            };
          })
        });
      }
    }, { rootMargin: '300px 0px' });

    io.observe(root);
  }

  updateArrows();

  console.info('[Master Product V2] NATIVE PROMOTIONS V1 / V2.6 READY.');
})();


setTimeout(function(){
  if (window.FilinMasterGoldenMatchV26) {
    window.FilinMasterGoldenMatchV26.apply();
  }
}, 3700);


/* ========================================================================
   FILIN LABS — GOLDEN MATCH V2.6 FINALIZER
   Permanent production layer consolidated from the approved mobile tests.
   - complete mobile hero + Back to the Filin's lair (top 70px)
   - one symmetric golden divider before BUY NOW
   - divider after Perfect Matches and after all tabs
   - true mobile accordion: panel immediately under its own tab
   - bordered curation / characteristics block
   - ProductCatalog-powered lower scroller, no inner black frame
   - symmetric golden dividers around scroller
   - autoplay every 3.4s, pauses after manual interaction
   - Perfect Matches numbered signal path stays fully visible
   ======================================================================== */
(function () {
  'use strict';

  if (window.__FILIN_MASTER_GOLDEN_MATCH_V26_FINALIZER__) return;
  window.__FILIN_MASTER_GOLDEN_MATCH_V26_FINALIZER__ = true;

  var MAX = 820;
  var STYLE_ID = 'filin-master-golden-match-v26-final';

  function norm(v) {
    return String(v == null ? '' : v).replace(/\s+/g, ' ').trim();
  }

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g,'&amp;')
      .replace(/</g,'&lt;')
      .replace(/>/g,'&gt;')
      .replace(/"/g,'&quot;')
      .replace(/'/g,'&#039;');
  }

  function mobile() {
    return window.innerWidth <= MAX;
  }

  function root() {
    return document.querySelector('.js-product[data-fp-full-profile="filin_audio_quadron"]') ||
      Array.prototype.slice.call(document.querySelectorAll('.js-product')).find(function (el) {
        return /Quadron/i.test(norm(el.textContent));
      }) || null;
  }

  function profile() {
    try {
      return window.FilinFullProductProfilesV2 &&
        typeof window.FilinFullProductProfilesV2.get === 'function'
        ? window.FilinFullProductProfilesV2.get('filin_audio_quadron')
        : null;
    } catch (e) {
      return null;
    }
  }

  function installFinalStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      .fp-v26-golden-divider {
        display:block !important;
        width:100% !important;
        height:2px !important;
        padding:0 !important;
        border:0 !important;
        border-radius:0 !important;
        box-sizing:border-box !important;
        background:
          linear-gradient(
            90deg,
            transparent 0%,
            #111 7%,
            #111 42%,
            #bc8c5e 42%,
            #bc8c5e 58%,
            #111 58%,
            #111 93%,
            transparent 100%
          ) !important;
        opacity:.95 !important;
      }

      @media (max-width:${MAX}px) {
        /* HERO */
        .fp-v24-hero-cover {
          position:relative !important;
          height:480px !important;
          min-height:480px !important;
          max-height:480px !important;
          overflow:hidden !important;
        }

        .fp-v24-hero-record {
          min-height:480px !important;
          margin-bottom:12px !important;
        }

        .fp-v24-hero-cover .t-cover__carrier,
        .fp-v24-hero-cover .t-cover__filter,
        .fp-v24-hero-cover .t-cover__wrapper {
          height:480px !important;
          min-height:480px !important;
          max-height:480px !important;
        }

        .fp-v24-hero-cover .t-cover__carrier {
          background-position:center center !important;
          background-size:cover !important;
          background-attachment:scroll !important;
        }

        .fp-v24-hero-cover .t184__uptitle,
        .fp-v24-hero-cover .t184__title,
        .fp-v24-hero-cover .t184__descr {
          display:none !important;
        }

        #fp-v26-hero-overlay {
          position:absolute !important;
          inset:0 !important;
          z-index:9999 !important;
          width:100% !important;
          height:480px !important;
          padding:24px 18px 26px !important;
          box-sizing:border-box !important;
          display:flex !important;
          flex-direction:column !important;
          align-items:center !important;
          color:#fff !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          text-align:center !important;
          pointer-events:none !important;
        }

        #fp-v26-hero-back {
          display:block !important;
          position:absolute !important;
          top:70px !important;
          left:0 !important;
          right:0 !important;
          z-index:10001 !important;
          width:100% !important;
          max-width:none !important;
          margin:0 !important;
          padding:0 16px !important;
          box-sizing:border-box !important;
          color:#fff !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          font-size:14px !important;
          line-height:1.35 !important;
          font-weight:500 !important;
          text-align:center !important;
          text-decoration:underline !important;
          text-underline-offset:3px !important;
          white-space:nowrap !important;
          visibility:visible !important;
          opacity:1 !important;
          pointer-events:auto !important;
          text-shadow:0 2px 7px rgba(0,0,0,1),0 0 10px rgba(0,0,0,.85) !important;
        }

        #fp-v26-hero-h1 {
          width:100% !important;
          max-width:390px !important;
          margin:86px auto 0 !important;
          padding:0 !important;
          color:#fff !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          font-size:22px !important;
          line-height:1.27 !important;
          font-weight:750 !important;
          letter-spacing:.01em !important;
          text-align:center !important;
          text-shadow:0 2px 9px rgba(0,0,0,.95) !important;
        }

        #fp-v26-hero-subtitle {
          width:100% !important;
          max-width:365px !important;
          margin:auto auto 0 !important;
          padding:0 !important;
          color:#fff !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          font-size:12.5px !important;
          line-height:1.43 !important;
          font-weight:550 !important;
          text-align:center !important;
          text-shadow:0 2px 8px rgba(0,0,0,.98) !important;
        }

        /* BUY NOW divider: reuse the existing V2.x node; never stack a second line. */
        .js-product .fl-v24-divider-before-buy {
          display:block !important;
          width:100% !important;
          height:2px !important;
          margin:24px 0 !important;
          padding:0 !important;
          border:0 !important;
          border-radius:0 !important;
          background:
            linear-gradient(
              90deg,
              transparent 0%,
              #111 7%,
              #111 42%,
              #bc8c5e 42%,
              #bc8c5e 58%,
              #111 58%,
              #111 93%,
              transparent 100%
            ) !important;
          opacity:.95 !important;
        }

        .fp-v25-divider-before-buy,
        .fp-v25-golden-divider.fp-v25-divider-before-buy {
          display:none !important;
        }

        /* PERFECT MATCHES */
        .js-product .perfect-matches-block.fp-pm-v5 {
          width:100% !important;
          margin:14px 0 0 !important;
          border:2px solid #111 !important;
          border-radius:13px !important;
          background:#fffaf5 !important;
          overflow:hidden !important;
          box-shadow:none !important;
        }

        .js-product .perfect-matches-block .fl-v24-pm-rule {
          display:none !important;
        }

        .js-product .perfect-matches-block.fp-pm-v5.fp-pm-open > .pm-formula {
          padding-left:58px !important;
          padding-right:14px !important;
          overflow:visible !important;
        }

        .js-product .perfect-matches-block.fp-pm-v5 > .pm-formula::before {
          left:30px !important;
        }

        .js-product .perfect-matches-block.fp-pm-v5 .pm-item {
          overflow:visible !important;
        }

        .js-product .perfect-matches-block.fp-pm-v5 .fp-pm-v5-step {
          left:-40px !important;
          display:flex !important;
          opacity:1 !important;
          visibility:visible !important;
          z-index:10 !important;
        }

        .fp-v26-divider-after-perfect {
          width:100% !important;
          margin:28px 0 !important;
        }

        /* TRUE MOBILE ACCORDION */
        .js-product .tabs-wrapper {
          width:100% !important;
          max-width:100% !important;
          margin:0 !important;
          padding:0 !important;
          box-sizing:border-box !important;
          overflow:visible !important;
          background:#fffbf7 !important;
        }

        .js-product .tabs-wrapper > .tabs-header {
          display:none !important;
        }

        .js-product .fp-v26-real-accordion {
          display:block !important;
          width:100% !important;
          margin:0 !important;
          padding:0 !important;
          overflow:visible !important;
        }

        .js-product .fp-v26-real-acc-btn {
          position:relative !important;
          display:flex !important;
          align-items:center !important;
          width:calc(100% - 24px) !important;
          min-width:0 !important;
          min-height:58px !important;
          margin:0 12px 4px !important;
          padding:0 52px 0 14px !important;
          box-sizing:border-box !important;
          border:2px solid #111 !important;
          border-radius:12px !important;
          background:#eee7df !important;
          color:#737373 !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          font-size:14px !important;
          line-height:1.25 !important;
          font-weight:650 !important;
          text-align:left !important;
          text-transform:uppercase !important;
          cursor:pointer !important;
          box-shadow:none !important;
        }

        .js-product .fp-v26-real-acc-btn:nth-of-type(3n+1) {
          background:#f0e9e2 !important;
        }
        .js-product .fp-v26-real-acc-btn:nth-of-type(3n+2) {
          background:#ede5dd !important;
        }
        .js-product .fp-v26-real-acc-btn:nth-of-type(3n) {
          background:#e9e0d7 !important;
        }

        .js-product .fp-v26-real-acc-btn.fl-acc-open {
          margin-bottom:0 !important;
          border-radius:12px 12px 0 0 !important;
          background:#e4d9ce !important;
          color:#b38b59 !important;
        }

        .js-product .fp-v26-real-arrow {
          position:absolute !important;
          right:12px !important;
          top:50% !important;
          width:30px !important;
          height:30px !important;
          transform:translateY(-50%) !important;
          display:flex !important;
          align-items:center !important;
          justify-content:center !important;
          border:1px solid #111 !important;
          border-radius:50% !important;
          background:#fffaf5 !important;
          color:#111 !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          font-size:19px !important;
          line-height:1 !important;
          font-weight:400 !important;
          pointer-events:none !important;
        }

        .js-product .fp-v26-real-acc-btn.fl-acc-open .fp-v26-real-arrow {
          background:#111 !important;
          color:#fff !important;
        }

        .js-product .fp-v26-real-panel {
          width:calc(100% - 24px) !important;
          max-width:calc(100% - 24px) !important;
          margin:0 12px 4px !important;
          padding:0 !important;
          box-sizing:border-box !important;
          border-left:2px solid #111 !important;
          border-right:2px solid #111 !important;
          border-bottom:2px solid #111 !important;
          border-radius:0 0 12px 12px !important;
          background:#fffbf7 !important;
          overflow:hidden !important;
        }

        .js-product .fp-v26-real-panel > .content-container {
          width:100% !important;
          max-width:100% !important;
          margin:0 !important;
          padding:18px 12px !important;
          box-sizing:border-box !important;
        }

        .fp-v26-divider-after-tabs {
          width:calc(100% - 24px) !important;
          margin:28px 12px 0 !important;
        }

        /* CURATION / CHARACTERISTICS */
        .fp-curation.fp-v26-characteristics-box {
          width:calc(100% - 24px) !important;
          max-width:calc(100% - 24px) !important;
          margin:28px 12px 0 !important;
          padding:10px 12px 8px !important;
          box-sizing:border-box !important;
          border:2px solid #111 !important;
          border-radius:14px !important;
          background:#fffaf5 !important;
          box-shadow:none !important;
          overflow:hidden !important;
        }

        .fp-curation.fp-v26-characteristics-box .fp-curation-item {
          padding:18px 0 !important;
        }

        /* PROMOTIONS: no old inner black/gray frame. */
        #product-promotions,
        #product-promotions.fp-v25-bottom-products-frame {
          border:0 !important;
          border-radius:0 !important;
          box-shadow:none !important;
          margin:0 !important;
          padding:0 8px !important;
          background:#fffaf5 !important;
        }

        #product-promotions .fpp-shell {
          width:100% !important;
          margin:0 !important;
          border:0 !important;
          border-radius:0 !important;
          box-shadow:none !important;
          background:#fffaf5 !important;
          overflow:hidden !important;
        }

        #product-promotions .fpp-shell::before {
          display:none !important;
          content:none !important;
        }

        #product-promotions .fpp-head {
          border:0 !important;
          border-top:0 !important;
          border-bottom:0 !important;
        }

        #product-promotions .fpp-track {
          scroll-behavior:smooth !important;
          -webkit-overflow-scrolling:touch !important;
        }

        .fp-v26-promo-divider {
          width:calc(100% - 24px) !important;
          margin-left:12px !important;
          margin-right:12px !important;
        }

        .fp-v26-divider-before-promotions {
          margin-top:28px !important;
          margin-bottom:28px !important;
        }

        .fp-v26-divider-after-promotions {
          margin-top:28px !important;
          margin-bottom:28px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureHero() {
    var p = profile();
    var title = Array.prototype.slice.call(document.querySelectorAll('.t184__title,h1'))
      .find(function (el) { return /Quadron/i.test(norm(el.textContent)); });

    var hero = document.querySelector('.fp-v24-hero-cover') ||
      (title && title.closest('.t-cover'));

    if (!hero) return false;
    hero.classList.add('fp-v24-hero-cover');

    var rec = hero.closest('.t-rec,[id^="rec"]');
    if (rec) rec.classList.add('fp-v24-hero-record');

    var originalLink = hero.querySelector('.t184__uptitle a');
    var href = originalLink ? (originalLink.getAttribute('href') || '/') : '/';

    var h1Text = p && p.hero && p.hero.staticH1
      ? p.hero.staticH1
      : 'Filin Audio "Quadron": Flagship Closed-Back Planar Headphones';

    var descText = p && p.hero && p.hero.description
      ? p.hero.description
      : 'The Filin Audio "Quadron" represents an uncompromising leap in planar magnetic performance, utilizing advanced SAW Technology® and custom-tuned drivers by Snorry.';

    var overlay = hero.querySelector('#fp-v26-hero-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'fp-v26-hero-overlay';
      hero.appendChild(overlay);
    }

    overlay.innerHTML =
      '<div id="fp-v26-hero-h1" role="heading" aria-level="1">' + esc(h1Text) + '</div>' +
      '<div id="fp-v26-hero-subtitle">' + esc(descText) + '</div>';

    var back = hero.querySelector('#fp-v26-hero-back');
    if (!back) {
      back = document.createElement('a');
      back.id = 'fp-v26-hero-back';
      hero.appendChild(back);
    }

    back.setAttribute('href', href);
    back.textContent = "Back to the Filin's lair";
    return true;
  }

  function ensureGoldenDivider(parent, beforeNode, className) {
    if (!parent || !beforeNode) return null;
    var selector = '.' + className;
    var old = parent.querySelector(selector);
    if (old) old.remove();

    var d = document.createElement('div');
    d.className = 'fp-v26-golden-divider ' + className;
    parent.insertBefore(d, beforeNode);
    return d;
  }

  function ensureStructureDividers() {
    var r = root();
    if (!r) return {beforeBuy:false, afterPerfect:false, afterTabs:false};

    r.querySelectorAll(
      '.fp-v25-divider-before-buy,.fp-v25-golden-divider.fp-v25-divider-before-buy,' +
      '.fp-v25-divider-after-perfect,.fp-v26-divider-after-perfect,.fp-v26-divider-after-tabs'
    ).forEach(function (el) {
      if (!el.classList.contains('fl-v24-divider-before-buy')) el.remove();
    });

    var purchase = r.querySelector('.purchase-container');
    var buy = r.querySelector('.buy-btn.fl-v24-main-buy,.buy-btn.js-product-btn,.buy-btn');
    var beforeBuy = r.querySelector('.fl-v24-divider-before-buy');

    if (!beforeBuy && purchase && buy) {
      beforeBuy = document.createElement('div');
      beforeBuy.className = 'fl-v24-divider-before-buy';
      purchase.insertBefore(beforeBuy, buy);
    }
    if (beforeBuy) beforeBuy.classList.add('fp-v26-golden-divider');

    var pm = r.querySelector('.perfect-matches-block');
    if (pm) {
      pm.querySelectorAll('.fl-v24-pm-rule').forEach(function (el) {
        el.style.setProperty('display','none','important');
      });

      var afterPerfect = document.createElement('div');
      afterPerfect.className = 'fp-v26-golden-divider fp-v26-divider-after-perfect';
      pm.insertAdjacentElement('afterend', afterPerfect);
    }

    var tabs = r.querySelector('.tabs-wrapper');
    if (tabs) {
      var afterTabs = document.createElement('div');
      afterTabs.className = 'fp-v26-golden-divider fp-v26-divider-after-tabs';
      tabs.insertAdjacentElement('afterend', afterTabs);
    }

    return {
      beforeBuy:!!beforeBuy,
      afterPerfect:!!r.querySelector('.fp-v26-divider-after-perfect'),
      afterTabs:!!r.querySelector('.fp-v26-divider-after-tabs')
    };
  }

  function closeAccordionButton(btn) {
    if (!btn) return;
    btn.classList.remove('active','fl-acc-open');
    btn.setAttribute('aria-expanded','false');
    var arrow = btn.querySelector('.fp-v26-real-arrow');
    if (arrow) arrow.textContent = '+';
    var panel = btn.nextElementSibling;
    if (panel && panel.classList.contains('fp-v26-real-panel')) {
      panel.style.setProperty('display','none','important');
    }
  }

  function openAccordionButton(btn) {
    if (!btn) return;
    btn.classList.add('active','fl-acc-open');
    btn.setAttribute('aria-expanded','true');
    var arrow = btn.querySelector('.fp-v26-real-arrow');
    if (arrow) arrow.textContent = '−';
    var panel = btn.nextElementSibling;
    if (panel && panel.classList.contains('fp-v26-real-panel')) {
      panel.style.setProperty('display','block','important');
    }
  }

  function restoreDesktopTabs(r, wrapper, header) {
    var acc = wrapper && wrapper.querySelector(':scope > .fp-v26-real-accordion');
    if (!acc) return;

    var buttons = Array.prototype.slice.call(acc.querySelectorAll(':scope > .fp-v26-real-acc-btn'));
    var panels = Array.prototype.slice.call(acc.querySelectorAll(':scope > .fp-v26-real-panel'));

    buttons.forEach(function (btn) {
      btn.classList.remove('fp-v26-real-acc-btn','fl-acc-open');
      btn.removeAttribute('aria-expanded');
      var arrow = btn.querySelector('.fp-v26-real-arrow');
      if (arrow) arrow.remove();
      header.appendChild(btn);
    });

    panels.forEach(function (panel) {
      panel.classList.remove('fp-v26-real-panel');
      panel.style.removeProperty('display');
      wrapper.appendChild(panel);
    });

    acc.remove();

    var allButtons = Array.prototype.slice.call(header.querySelectorAll('.tab-btn'));
    var allPanels = Array.prototype.slice.call(wrapper.querySelectorAll(':scope > .tab-content'));
    allPanels.forEach(function (p) { p.style.display = 'none'; });
    allButtons.forEach(function (b) { b.classList.remove('active'); });

    var first = allButtons[0];
    if (first) {
      first.classList.add('active');
      var id = first.dataset.fpTarget || '';
      var panel = allPanels.find(function (p) { return p.id === id; }) || allPanels[0];
      if (panel) panel.style.display = 'block';
    }
  }

  function ensureAccordion() {
    var r = root();
    if (!r) return 0;

    var wrapper = r.querySelector('.tabs-wrapper[data-fp-v24-canonical="1"]') ||
      r.querySelector('.tabs-wrapper');
    var header = wrapper && wrapper.querySelector(':scope > .tabs-header,.tabs-header');
    if (!wrapper || !header) return 0;

    if (!mobile()) {
      restoreDesktopTabs(r, wrapper, header);
      return header.querySelectorAll('.tab-btn').length;
    }

    var existing = wrapper.querySelector(':scope > .fp-v26-real-accordion');
    var strayButtons = header.querySelectorAll(':scope > .tab-btn');

    if (existing && strayButtons.length === 0) {
      return existing.querySelectorAll(':scope > .fp-v26-real-acc-btn').length;
    }

    if (existing) {
      Array.prototype.slice.call(existing.children).forEach(function (node) {
        if (node.classList.contains('fp-v26-real-acc-btn')) {
          node.classList.remove('fp-v26-real-acc-btn','fl-acc-open');
          var arrow = node.querySelector('.fp-v26-real-arrow');
          if (arrow) arrow.remove();
          header.appendChild(node);
        } else if (node.classList.contains('fp-v26-real-panel')) {
          node.classList.remove('fp-v26-real-panel');
          wrapper.appendChild(node);
        }
      });
      existing.remove();
    }

    var buttons = Array.prototype.slice.call(header.querySelectorAll(':scope > .tab-btn'));
    var panels = Array.prototype.slice.call(wrapper.querySelectorAll(':scope > .tab-content'));
    if (!buttons.length) return 0;

    var acc = document.createElement('div');
    acc.className = 'fp-v26-real-accordion';
    header.insertAdjacentElement('afterend',acc);

    buttons.forEach(function (btn, index) {
      var id = btn.dataset.fpTarget || '';
      if (!id) {
        var inline = btn.getAttribute('onclick') || '';
        var m = inline.match(/showTab\s*\(\s*event\s*,\s*(['"])(.*?)\1\s*\)/i);
        if (m) {
          id = m[2];
          btn.dataset.fpTarget = id;
        }
      }
      if (!id && /^Reviews\b/i.test(norm(btn.textContent))) id = 'reviews';

      var panel = panels.find(function (p) { return p.id === id; }) || panels[index] || null;

      btn.removeAttribute('onclick');
      btn.classList.remove('active','fl-acc-open');
      btn.classList.add('fp-v26-real-acc-btn');
      btn.setAttribute('aria-expanded','false');

      var arrow = btn.querySelector('.fp-v26-real-arrow');
      if (!arrow) {
        arrow = document.createElement('span');
        arrow.className = 'fp-v26-real-arrow';
        arrow.setAttribute('aria-hidden','true');
        btn.appendChild(arrow);
      }
      arrow.textContent = '+';

      acc.appendChild(btn);

      if (panel) {
        panel.classList.add('fp-v26-real-panel');
        panel.style.setProperty('display','none','important');
        acc.appendChild(panel);
      }

      if (btn.dataset.fpV26Bound !== '1') {
        btn.dataset.fpV26Bound = '1';
        btn.addEventListener('click',function (event) {
          if (!mobile()) return;

          event.preventDefault();
          event.stopImmediatePropagation();

          var wasOpen = btn.classList.contains('fl-acc-open');
          Array.prototype.slice.call(acc.querySelectorAll(':scope > .fp-v26-real-acc-btn'))
            .forEach(closeAccordionButton);

          if (!wasOpen) openAccordionButton(btn);
        },true);
      }
    });

    return buttons.length;
  }

  function ensureCurationFrame() {
    var c = document.querySelector('.fp-curation');
    if (!c) return false;
    c.classList.add('fp-v26-characteristics-box');
    return true;
  }

  function ensurePromotionsRoot() {
    var rootNode = document.getElementById('product-promotions');
    if (rootNode) return rootNode;

    var footer = document.getElementById('t-footer') ||
      document.querySelector('footer') ||
      document.querySelector('[data-footer]');
    if (!footer || !footer.parentNode) return null;

    var host = document.createElement('div');
    host.id = 'fp-v26-promotions-host';
    host.innerHTML =
      '<section class="fpp" id="product-promotions" aria-labelledby="fpp-title">' +
        '<div class="fpp-shell">' +
          '<header class="fpp-head">' +
            '<h2 class="fpp-title" id="fpp-title">' +
              '<span class="fpp-title-desktop">PROMOTIONS</span>' +
              '<span class="fpp-title-mobile">HI-FI &amp; HIGH-END EQUIPMENT</span>' +
            '</h2>' +
            '<div class="fpp-nav"></div>' +
          '</header>' +
          '<div class="fpp-track" role="list" tabindex="0" aria-label="Promotional products"></div>' +
        '</div>' +
      '</section>';

    footer.parentNode.insertBefore(host,footer);
    return host.querySelector('#product-promotions');
  }

  function productImage(product) {
    if (!product) return '';
    if (product.image) return product.image;
    var first = Array.isArray(product.images) ? product.images[0] : '';
    if (typeof first === 'string') return first;
    if (first && typeof first === 'object') {
      return first.url || first.src || first.image || '';
    }
    return '';
  }

  function money(value) {
    var n = Number(value);
    if (!Number.isFinite(n)) return '';
    return '$' + n.toLocaleString('en-US');
  }

  function ratingMarkup(value) {
    var n = Number(value);
    if (!Number.isFinite(n) || n <= 0) n = 5;
    n = Math.max(0,Math.min(5,Math.round(n)));
    var html = '';
    for (var i=1;i<=5;i++) {
      html += '<span class="' + (i <= n ? '' : 'fpp-rating-muted') + '">★</span>';
    }
    return html;
  }

  function orderHref(product, image) {
    var price = Number(product.price) || 0;
    return '#order:' +
      encodeURIComponent(product.name || '') +
      '=' +
      encodeURIComponent(String(price)) +
      ':::image=' +
      encodeURIComponent(image || '');
  }

  function hydratePromotionsFromCatalog(promotions) {
    if (!promotions) return {catalog:0,rendered:0};

    var shell = promotions.querySelector('.fpp-shell') || promotions;
    var track = promotions.querySelector('.fpp-track');
    if (!track) {
      track = document.createElement('div');
      track.className = 'fpp-track';
      track.setAttribute('role','list');
      track.setAttribute('tabindex','0');
      shell.appendChild(track);
    }

    var catalog = window.ProductCatalog && window.ProductCatalog.products
      ? Object.values(window.ProductCatalog.products)
      : [];

    if (!catalog.length) {
      return {catalog:0,rendered:track.querySelectorAll('.fpp-card').length};
    }

    var usable = catalog.filter(function (product) {
      if (!product) return false;
      if (String(product.slug || '') === 'filin_audio_quadron') return false;
      if (!(Number(product.price) > 0)) return false;
      if (!productImage(product)) return false;
      return true;
    });

    usable.sort(function (a,b) {
      function headphoneScore(p) {
        var text = [
          p.category || '',
          Array.isArray(p.categories) ? p.categories.join(' ') : ''
        ].join(' ');
        return /headphone/i.test(text) ? 0 : 1;
      }
      return headphoneScore(a) - headphoneScore(b);
    });

    var products = usable.slice(0,14);

    track.innerHTML = products.map(function (product,index) {
      var image = productImage(product);
      var href = product.path || product.url || (product.slug ? '/' + product.slug : '#');
      var oldPrice = Number(product.oldPrice) > Number(product.price)
        ? money(product.oldPrice)
        : '';
      var discount = Number(product.salePercent) > 0
        ? '-' + Math.round(Number(product.salePercent)) + '%'
        : '';

      return (
        '<article class="fpp-card" role="listitem" data-product="' +
          esc(product.id || product.slug || index) + '">' +
          '<a class="fpp-media" href="' + esc(href) + '" data-fpp-select="1">' +
            '<img class="fpp-img" src="' + esc(image) + '"' +
              ' alt="' + esc(product.name || '') + '"' +
              ' loading="lazy" decoding="async" fetchpriority="low">' +
            (discount ? '<span class="fpp-badge">' + esc(discount) + '</span>' : '') +
          '</a>' +
          '<a class="fpp-name" href="' + esc(href) + '" data-fpp-select="1">' +
            esc(product.name || '') +
          '</a>' +
          '<div class="fpp-rating" aria-label="' + esc(product.rating || 5) + ' out of 5 stars">' +
            ratingMarkup(product.rating) +
          '</div>' +
          '<div class="fpp-foot">' +
            '<div class="fpp-old">' + esc(oldPrice) + '</div>' +
            '<div class="fpp-price">' + esc(money(product.price)) + '</div>' +
            '<a class="fpp-buy js-click-addtocart"' +
              ' href="' + esc(orderHref(product,image)) + '"' +
              ' data-fpp-buy="1"' +
              ' data-id="' + esc(product.id || product.slug || index) + '"' +
              ' data-name="' + esc(product.name || '') + '"' +
              ' data-price="' + esc(product.price || 0) + '">' +
              'BUY NOW' +
            '</a>' +
          '</div>' +
        '</article>'
      );
    }).join('');

    track.dataset.fpV26Catalog = '1';
    return {catalog:catalog.length,rendered:products.length};
  }

  function bindAutoplay(promotions) {
    var track = promotions && promotions.querySelector('.fpp-track');
    if (!track) return false;

    if (window.__FILIN_V26_PROMO_AUTOPLAY__ &&
        window.__FILIN_V26_PROMO_AUTOPLAY__.timer) {
      clearInterval(window.__FILIN_V26_PROMO_AUTOPLAY__.timer);
    }
    if (window.__FILIN_V26_PROMO_AUTOPLAY__ &&
        window.__FILIN_V26_PROMO_AUTOPLAY__.resumeTimer) {
      clearTimeout(window.__FILIN_V26_PROMO_AUTOPLAY__.resumeTimer);
    }

    var timer = null;
    var resumeTimer = null;

    function step() {
      var first = track.querySelector('.fpp-card');
      if (!first) return 0;
      var cs = getComputedStyle(track);
      var gap = parseFloat(cs.columnGap || cs.gap || '0') || 0;
      return first.getBoundingClientRect().width + gap;
    }

    function advance() {
      if (document.hidden) return;
      var max = Math.max(0,track.scrollWidth - track.clientWidth);
      var delta = step();
      if (max < 10 || !delta) return;

      var next = track.scrollLeft + delta;
      track.scrollTo({
        left: next >= max - 5 ? 0 : next,
        behavior:'smooth'
      });
    }

    function start() {
      clearInterval(timer);
      timer = setInterval(advance,3400);
      if (window.__FILIN_V26_PROMO_AUTOPLAY__) {
        window.__FILIN_V26_PROMO_AUTOPLAY__.timer = timer;
      }
    }

    function pause(ms) {
      clearInterval(timer);
      clearTimeout(resumeTimer);
      if (ms > 0) {
        resumeTimer = setTimeout(start,ms);
        if (window.__FILIN_V26_PROMO_AUTOPLAY__) {
          window.__FILIN_V26_PROMO_AUTOPLAY__.resumeTimer = resumeTimer;
        }
      }
    }

    if (track.dataset.fpV26AutoplayBound !== '1') {
      track.dataset.fpV26AutoplayBound = '1';
      track.addEventListener('pointerdown',function () { pause(6500); },{passive:true});
      track.addEventListener('touchstart',function () { pause(6500); },{passive:true});
      track.addEventListener('wheel',function () { pause(6500); },{passive:true});
      track.addEventListener('mouseenter',function () { pause(0); },{passive:true});
      track.addEventListener('mouseleave',start,{passive:true});
    }

    window.__FILIN_V26_PROMO_AUTOPLAY__ = {
      timer:null,
      resumeTimer:null,
      advance:advance,
      start:start,
      pause:pause
    };
    start();
    return true;
  }

  function ensurePromotionDividers(promotions) {
    document.querySelectorAll(
      '.fp-v26-divider-before-promotions,.fp-v26-divider-after-promotions'
    ).forEach(function (el) { el.remove(); });

    if (!promotions || !promotions.parentNode) return {top:false,bottom:false};

    promotions.classList.remove('fp-v25-bottom-products-frame');

    var top = document.createElement('div');
    top.className =
      'fp-v26-golden-divider fp-v26-promo-divider fp-v26-divider-before-promotions';

    var bottom = document.createElement('div');
    bottom.className =
      'fp-v26-golden-divider fp-v26-promo-divider fp-v26-divider-after-promotions';

    promotions.insertAdjacentElement('beforebegin',top);
    promotions.insertAdjacentElement('afterend',bottom);

    return {top:true,bottom:true};
  }

  function finalize() {
    installFinalStyles();

    var result = {
      hero:ensureHero(),
      accordion:ensureAccordion(),
      curation:ensureCurationFrame()
    };

    result.dividers = ensureStructureDividers();

    var promotions = ensurePromotionsRoot();
    result.promotions = hydratePromotionsFromCatalog(promotions);
    result.promoDividers = ensurePromotionDividers(promotions);
    result.autoplay = bindAutoplay(promotions);

    document.documentElement.setAttribute('data-fp-golden-final','v2.6');

    console.info('[Master Product V2] GOLDEN MATCH V2.6 FINALIZED',result);
    return result;
  }

  window.FilinMasterGoldenMatchV26Final = Object.freeze({
    version:'2.6',
    apply:finalize
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded',function () {
      setTimeout(finalize,80);
    },{once:true});
  } else {
    setTimeout(finalize,80);
  }

  [800,1800,3200,4300].forEach(function (delay) {
    setTimeout(finalize,delay);
  });

  var resizeTimer = null;
  window.addEventListener('resize',function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(ensureAccordion,160);
  },{passive:true});

  window.addEventListener('orientationchange',function () {
    setTimeout(ensureAccordion,220);
  },{passive:true});
})();

/* ========================================================================
   FILIN LABS — GOLDEN MATCH V2.6.1 DESKTOP FINISHER
   Desktop-only correction layer approved after mobile Golden Match closeout.
   - hides desktop Total line above BUY NOW
   - keeps Perfect Matches explanatory copy on one line on desktop
   - gives desktop tabs / curation / promotions a black Golden-style frame
   - forces Promotions cards to hydrate when ProductCatalog becomes available
   - does not change the approved mobile geometry
   ======================================================================== */
(function () {
  'use strict';

  if (window.__FILIN_MASTER_GOLDEN_MATCH_V261_DESKTOP__) return;
  window.__FILIN_MASTER_GOLDEN_MATCH_V261_DESKTOP__ = true;

  var STYLE_ID = 'filin-master-golden-match-v261-desktop';

  function installStyles() {
    var old = document.getElementById(STYLE_ID);
    if (old) old.remove();

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* Total must not appear above the main BUY NOW on any viewport. */
      .js-product .purchase-container > .price-title,
      .js-product .purchase-container .price-title {
        display:none !important;
        visibility:hidden !important;
        height:0 !important;
        min-height:0 !important;
        max-height:0 !important;
        margin:0 !important;
        padding:0 !important;
        overflow:hidden !important;
      }

      @media (min-width:821px) {
        /* =====================================================
           PERFECT MATCHES — explanatory sentence in one line.
           ===================================================== */
        .js-product .perfect-matches-block.fp-pm-v5 > .pm-desc,
        .js-product .perfect-matches-block > .pm-desc {
          display:block !important;
          width:100% !important;
          max-width:none !important;
          margin:8px auto 18px !important;
          padding:0 18px !important;
          box-sizing:border-box !important;
          color:#666 !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          font-size:clamp(11px,.78vw,13px) !important;
          line-height:1.35 !important;
          font-weight:400 !important;
          text-align:center !important;
          white-space:nowrap !important;
          overflow:visible !important;
          text-overflow:clip !important;
        }

        /* =====================================================
           DESKTOP TABS — black outlined segmented bar.
           Keep the open content below it unchanged.
           ===================================================== */
        .js-product .tabs-wrapper {
          width:calc(100% - 64px) !important;
          max-width:1540px !important;
          margin:34px auto 0 !important;
          padding:0 !important;
          background:#fffbf7 !important;
          overflow:visible !important;
        }

        .js-product .tabs-wrapper > .tabs-header,
        .js-product .tabs-header {
          display:flex !important;
          flex-wrap:nowrap !important;
          width:100% !important;
          margin:0 !important;
          padding:0 !important;
          box-sizing:border-box !important;
          border:2px solid #111 !important;
          border-radius:14px !important;
          background:#f2ebe4 !important;
          overflow-x:auto !important;
          overflow-y:hidden !important;
          white-space:nowrap !important;
          box-shadow:none !important;
        }

        .js-product .tabs-header .tab-btn {
          flex:1 1 0 !important;
          min-width:135px !important;
          min-height:64px !important;
          margin:0 !important;
          padding:18px 12px !important;
          border:0 !important;
          border-right:1px solid #111 !important;
          border-radius:0 !important;
          background:transparent !important;
          color:#777 !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          font-size:14px !important;
          line-height:1.2 !important;
          font-weight:700 !important;
          text-align:center !important;
          text-transform:uppercase !important;
          box-shadow:none !important;
        }

        .js-product .tabs-header .tab-btn:last-child {
          border-right:0 !important;
        }

        .js-product .tabs-header .tab-btn.active {
          color:#9b6c3c !important;
          background:#fffaf5 !important;
          box-shadow:inset 0 -3px 0 #bc8c5e !important;
        }

        .js-product .tabs-wrapper > .tab-content {
          width:100% !important;
          max-width:100% !important;
        }

        /* =====================================================
           CURATION / SHORT CHARACTERISTICS — desktop frame.
           ===================================================== */
        .fp-curation,
        .fp-curation.fp-v26-characteristics-box {
          width:calc(100% - 64px) !important;
          max-width:1280px !important;
          margin:54px auto 0 !important;
          padding:28px 30px !important;
          box-sizing:border-box !important;
          border:2px solid #111 !important;
          border-radius:14px !important;
          background:#fffaf5 !important;
          box-shadow:none !important;
          overflow:hidden !important;
        }

        /* Keep the existing desktop grid, only frame the block. */
        .fp-curation .fp-curation-item {
          background:transparent !important;
          box-shadow:none !important;
        }

        /* =====================================================
           PROMOTIONS — visible framed desktop scroller.
           ===================================================== */
        #product-promotions,
        #product-promotions.fp-v25-bottom-products-frame {
          display:block !important;
          width:100% !important;
          max-width:none !important;
          margin:54px auto 54px !important;
          padding:0 32px !important;
          border:0 !important;
          background:#fffbf7 !important;
          visibility:visible !important;
          opacity:1 !important;
          overflow:visible !important;
        }

        #product-promotions .fpp-shell {
          display:block !important;
          width:100% !important;
          max-width:1280px !important;
          margin:0 auto !important;
          padding:0 !important;
          box-sizing:border-box !important;
          border:2px solid #111 !important;
          border-radius:14px !important;
          background:#fffaf5 !important;
          box-shadow:none !important;
          overflow:hidden !important;
          visibility:visible !important;
          opacity:1 !important;
        }

        #product-promotions .fpp-shell::before {
          display:none !important;
          content:none !important;
        }

        #product-promotions .fpp-head {
          display:grid !important;
          min-height:72px !important;
          padding:0 18px !important;
          border:0 !important;
          border-bottom:1px solid #d9d0c6 !important;
          background:#fffaf5 !important;
        }

        #product-promotions .fpp-track {
          display:grid !important;
          grid-auto-flow:column !important;
          grid-auto-columns:calc((100% - 48px) / 5) !important;
          gap:12px !important;
          width:100% !important;
          min-height:330px !important;
          padding:18px !important;
          box-sizing:border-box !important;
          overflow-x:auto !important;
          overflow-y:hidden !important;
          scroll-snap-type:x mandatory !important;
          scroll-behavior:smooth !important;
          visibility:visible !important;
          opacity:1 !important;
        }

        #product-promotions .fpp-card {
          display:flex !important;
          min-width:0 !important;
          min-height:330px !important;
          visibility:visible !important;
          opacity:1 !important;
        }

        /* Desktop uses the framed scroller itself, not mobile separators. */
        .fp-v26-divider-before-promotions,
        .fp-v26-divider-after-promotions {
          display:none !important;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function forceCurationClass() {
    var c = document.querySelector('.fp-curation');
    if (c) c.classList.add('fp-v26-characteristics-box');
  }

  function refreshPromotions() {
    try {
      if (window.FilinMasterGoldenMatchV26Final &&
          typeof window.FilinMasterGoldenMatchV26Final.apply === 'function') {
        window.FilinMasterGoldenMatchV26Final.apply();
      }
    } catch (e) {
      console.warn('[Master Product V2] V2.6.1 promotions refresh failed', e);
    }

    var promo = document.getElementById('product-promotions');
    var cards = promo ? promo.querySelectorAll('.fpp-card').length : 0;
    if (promo) {
      promo.style.setProperty('display','block','important');
      promo.style.setProperty('visibility','visible','important');
      promo.style.setProperty('opacity','1','important');
    }

    return cards;
  }

  function apply() {
    installStyles();
    forceCurationClass();
    var cards = refreshPromotions();

    document.documentElement.setAttribute('data-fp-golden-desktop','v2.6.1');

    console.info('[Master Product V2] GOLDEN MATCH V2.6.1 DESKTOP APPLIED', {
      totalHidden: !!document.querySelector('.js-product .purchase-container .price-title'),
      tabs: document.querySelectorAll('.js-product .tabs-header .tab-btn').length,
      curation: !!document.querySelector('.fp-curation'),
      promotions: !!document.getElementById('product-promotions'),
      promoCards: cards
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(apply,100);
    }, {once:true});
  } else {
    setTimeout(apply,100);
  }

  /* ProductCatalog can mount later than the product profile. Re-run hydration
     for a bounded period so desktop Promotions never stays as an empty shell. */
  [900,1800,3200,5000,7500,10000].forEach(function (delay) {
    setTimeout(function () {
      var cards = refreshPromotions();
      if (cards > 0) installStyles();
    }, delay);
  });

  window.FilinMasterGoldenMatchV261Desktop = Object.freeze({
    version:'2.6.1',
    apply:apply
  });
})();
