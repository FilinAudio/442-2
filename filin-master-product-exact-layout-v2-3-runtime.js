/* FILIN LABS — MASTER PRODUCT EXACT LAYOUT V2.3
   Reuses the proven Grand Tower Product Engine visual language.
   Must run AFTER Full Product Profile V2.1.
   V2.2 must be disabled.
*/
(function () {
  'use strict';

  if (window.__FILIN_MASTER_EXACT_LAYOUT_V23__) return;
  window.__FILIN_MASTER_EXACT_LAYOUT_V23__ = true;

  function seed() {
    try {
      var el = document.getElementById('product-data');
      return el ? JSON.parse(el.textContent || '{}') : {};
    } catch (e) {
      return {};
    }
  }

  function isQuadron() {
    return String(seed().slug || '') === 'filin_audio_quadron';
  }

  if (!isQuadron()) return;

  var STYLE_ID = 'filin-master-exact-layout-v23';

  function injectExactStyles() {
    if (document.getElementById(STYLE_ID)) return;

    var style = document.createElement('style');
    style.id = STYLE_ID;
    style.textContent = `
      /* =========================================================
         V2.3 DOES NOT REDESIGN DESKTOP CORE.
         Product Engine Core V1 remains the source of truth:
         - original luxury BUY NOW
         - original Perfect Matches desktop
         - original desktop tabs
         - original specs/options spacing
         ========================================================= */

      html[data-filin-full-profile="filin_audio_quadron"] .js-product,
      html[data-filin-full-profile="filin_audio_quadron"] .js-product *,
      html[data-filin-full-profile="filin_audio_quadron"] .fp-product-overview,
      html[data-filin-full-profile="filin_audio_quadron"] .fp-product-overview *,
      html[data-filin-full-profile="filin_audio_quadron"] .fp-curation,
      html[data-filin-full-profile="filin_audio_quadron"] .fp-curation * {
        font-family:'Montserrat',Arial,sans-serif !important;
        box-sizing:border-box;
      }

      /* Undo any V2.2 DOM helpers if a cached copy was seen during editing. */
      .fp-v22-pm-toggle,
      .fp-v22-mobile-tab-toggle,
      .fp-v22-mobile-buy-price {
        display:none !important;
      }

      /* CURATOR — exact black strip / white italic treatment from the approved mobile reference. */
      .fp-v23-curator-record {
        width:100% !important;
        margin:0 !important;
        padding:0 !important;
        background:#000 !important;
      }

      .fp-v23-curator-record,
      .fp-v23-curator-record *,
      .fp-v23-curator-text {
        color:#fff !important;
        font-family:'Montserrat',Arial,sans-serif !important;
      }

      .fp-v23-curator-text {
        display:block !important;
        width:min(1180px,calc(100% - 40px)) !important;
        margin:0 auto !important;
        padding:30px 0 !important;
        text-align:center !important;
        font-size:15px !important;
        line-height:1.5 !important;
        font-style:italic !important;
        font-weight:600 !important;
        background:transparent !important;
      }

      /* Mobile-only structural helpers reconstructed from the approved golden backup. */
      .fl-price-in-buy,
      .fl-mobile-divider,
      .fl-v23-tab-toggle {
        display:none;
      }

      @media (max-width:820px) {
        :root {
          --fp-mobile-body-size:13px;
          --fp-mobile-body-line:1.55;
          --fp-mobile-body-color:#4f4a46;
        }

        html[data-filin-full-profile="filin_audio_quadron"] .fp-product-overview,
        html[data-filin-full-profile="filin_audio_quadron"] .fp-product-overview p,
        html[data-filin-full-profile="filin_audio_quadron"] .fp-product-overview li,
        html[data-filin-full-profile="filin_audio_quadron"] .fp-curation p,
        html[data-filin-full-profile="filin_audio_quadron"] .js-product .description-content p,
        html[data-filin-full-profile="filin_audio_quadron"] .js-product .description-content li,
        html[data-filin-full-profile="filin_audio_quadron"] .js-product .specs-table td,
        html[data-filin-full-profile="filin_audio_quadron"] .js-product .options-list label {
          font-size:var(--fp-mobile-body-size) !important;
          line-height:var(--fp-mobile-body-line) !important;
          font-weight:400 !important;
          color:var(--fp-mobile-body-color) !important;
          letter-spacing:0 !important;
        }

        .fp-v23-curator-text {
          width:calc(100% - 36px) !important;
          padding:24px 0 !important;
          font-size:12px !important;
          line-height:1.55 !important;
          font-weight:600 !important;
        }

        /* The golden backup hides the separate Total row on mobile. */
        .js-product .purchase-container {
          margin:0 !important;
          padding:0 10px 0 !important;
          background:#fffbf7 !important;
          border-radius:0 !important;
        }

        .js-product .price-title {
          display:none !important;
        }

        .fl-mobile-divider {
          display:block !important;
          width:100% !important;
          height:1px !important;
          margin:18px 0 18px !important;
          background:#d9d0c6 !important;
        }

        /* Exact mobile BUY NOW language: framed luxury gold + price at right. */
        .js-product .buy-btn.fl-main-buy-now {
          position:relative !important;
          display:flex !important;
          align-items:center !important;
          justify-content:center !important;
          width:100% !important;
          min-height:66px !important;
          margin:0 !important;
          padding:15px 88px 15px 24px !important;
          border:2px solid #76502d !important;
          border-radius:12px !important;
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
          color:#fff !important;
          font-size:25px !important;
          line-height:1 !important;
          font-weight:800 !important;
          letter-spacing:.025em !important;
          text-transform:uppercase !important;
          box-shadow:
            inset 0 0 0 1px rgba(255,255,255,.72),
            inset 0 0 0 4px rgba(115,72,34,.28),
            inset 0 0 0 6px rgba(255,231,193,.32),
            0 9px 24px rgba(67,42,21,.20),
            0 0 24px rgba(196,143,82,.12) !important;
          overflow:hidden !important;
        }

        .js-product .buy-btn.fl-main-buy-now::before {
          inset:7px !important;
          border-radius:7px !important;
        }

        .js-product .buy-btn.fl-main-buy-now .buy-btn-label {
          position:relative !important;
          z-index:3 !important;
          display:inline-block !important;
          color:#fff !important;
          font-size:25px !important;
          line-height:1 !important;
          font-weight:800 !important;
          white-space:nowrap !important;
        }

        .fl-price-in-buy {
          position:absolute !important;
          z-index:4 !important;
          top:50% !important;
          right:22px !important;
          display:inline-flex !important;
          align-items:center !important;
          height:28px !important;
          padding-left:16px !important;
          border-left:1px solid rgba(255,255,255,.55) !important;
          color:#fff !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          font-size:12px !important;
          line-height:1 !important;
          font-weight:700 !important;
          letter-spacing:0 !important;
          text-transform:none !important;
          transform:translateY(-50%) !important;
          white-space:nowrap !important;
        }

        /* Perfect Matches spacing exactly follows the proven V6.6 accordion below. */
        .js-product .perfect-matches-block.fp-pm-v5 {
          margin-top:14px !important;
          margin-bottom:48px !important;
        }

        /* =====================================================
           PRODUCT TABS -> GOLDEN BACKUP MOBILE ACCORDION
           ===================================================== */
        .js-product .tabs-wrapper {
          width:100% !important;
          margin:0 !important;
          padding:0 10px !important;
          background:#fffbf7 !important;
          overflow:visible !important;
        }

        .js-product .tabs-header {
          display:none !important;
        }

        .fl-v23-tab-toggle {
          appearance:none !important;
          width:100% !important;
          min-height:58px !important;
          margin:0 0 8px !important;
          padding:12px 12px !important;
          display:grid !important;
          grid-template-columns:minmax(0,1fr) 34px !important;
          gap:12px !important;
          align-items:center !important;
          border:2px solid #2f2a26 !important;
          border-radius:10px !important;
          background:linear-gradient(135deg,#f8eee3 0%,#f4e9dd 100%) !important;
          color:#8b8885 !important;
          font-family:'Montserrat',Arial,sans-serif !important;
          font-size:12px !important;
          line-height:1.2 !important;
          font-weight:700 !important;
          letter-spacing:.015em !important;
          text-align:left !important;
          text-transform:uppercase !important;
          cursor:pointer !important;
          box-shadow:none !important;
        }

        .fl-v23-tab-toggle.is-primary,
        .fl-v23-tab-toggle.is-open {
          color:#b38b59 !important;
        }

        .fl-v23-tab-toggle-control {
          width:30px !important;
          height:30px !important;
          display:grid !important;
          place-items:center !important;
          border:1.5px solid #38322d !important;
          border-radius:50% !important;
          background:#fffdf9 !important;
          color:#38322d !important;
          font-size:20px !important;
          line-height:1 !important;
          font-weight:400 !important;
        }

        .fl-v23-tab-toggle.is-open .fl-v23-tab-toggle-control::before {
          content:"−";
        }

        .fl-v23-tab-toggle:not(.is-open) .fl-v23-tab-toggle-control::before {
          content:"+";
        }

        .js-product .tab-content {
          display:none !important;
          width:100% !important;
        }

        .js-product .tab-content.fl-v23-open {
          display:block !important;
          margin:-1px 0 8px !important;
          border:1px solid #e3d8cd !important;
          border-top:0 !important;
          border-radius:0 0 10px 10px !important;
          background:#fffdf9 !important;
        }

        .js-product .tab-content > .content-container {
          width:100% !important;
          max-width:100% !important;
          margin:0 !important;
          padding:18px 14px 22px !important;
          text-align:left !important;
        }

        .js-product .description-content h3 {
          margin-top:18px !important;
          margin-bottom:10px !important;
          padding-left:10px !important;
          border-left:3px solid #b38b59 !important;
          color:#333 !important;
          font-size:18px !important;
          line-height:1.25 !important;
          font-weight:700 !important;
          letter-spacing:-.01em !important;
        }

        .js-product .description-content h3:first-child {
          margin-top:0 !important;
        }

        .js-product .specs-table,
        .js-product .specs-table tbody,
        .js-product .specs-table tr,
        .js-product .specs-table td {
          display:block !important;
          width:100% !important;
        }

        .js-product .specs-table {
          margin:0 auto !important;
          border-collapse:collapse !important;
        }

        .js-product .specs-table tr {
          padding:8px 0 !important;
          border-bottom:1px solid #eee !important;
        }

        .js-product .specs-table td {
          padding:3px 0 !important;
          border:0 !important;
        }

        .js-product .specs-table td:first-child {
          padding-bottom:3px !important;
          color:#35312e !important;
          font-weight:700 !important;
        }

        .js-product .options-list {
          width:100% !important;
          max-width:100% !important;
          margin:0 !important;
        }

        .js-product .options-list label {
          width:100% !important;
          margin:0 0 8px !important;
          padding:11px 12px !important;
          border:1px solid #eee2d4 !important;
          border-radius:7px !important;
          background:#fffbf7 !important;
        }

        /* Curation in the golden backup is a clean vertical list. */
        .fp-curation {
          width:100% !important;
          margin:30px 0 0 !important;
          padding:0 14px 24px !important;
          display:block !important;
          background:#fffbf7 !important;
        }

        .fp-curation-item {
          width:100% !important;
          min-height:0 !important;
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

        .fp-curation-icon {
          width:22px !important;
          height:22px !important;
          margin:0 !important;
          color:#2d2925 !important;
        }

        .fp-curation-copy h3 {
          margin:0 0 7px !important;
          color:#171512 !important;
          font-size:12px !important;
          line-height:1.25 !important;
          font-weight:800 !important;
          letter-spacing:0 !important;
          text-transform:uppercase !important;
        }

        .fp-curation-copy p {
          margin:0 !important;
          color:#4f4a46 !important;
          font-size:12px !important;
          line-height:1.5 !important;
          font-weight:400 !important;
        }
      }

      @media (max-width:440px) {
        .js-product .buy-btn.fl-main-buy-now {
          min-height:64px !important;
          padding-left:20px !important;
          padding-right:84px !important;
        }
        .js-product .buy-btn.fl-main-buy-now .buy-btn-label {
          font-size:23px !important;
        }
        .fl-price-in-buy {
          right:18px !important;
          font-size:11px !important;
          padding-left:13px !important;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function text(el) {
    return String(el && el.textContent || '').replace(/\s+/g, ' ').trim();
  }

  function bindCurator() {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('body *'))
      .filter(function (el) {
        var t = text(el);
        return /^Handcrafted by/i.test(t) && t.length < 360;
      })
      .sort(function (a,b) {
        return text(a).length - text(b).length;
      });

    var el = nodes[0];
    if (!el) return false;

    el.classList.add('fp-v23-curator-text');

    var rec = el.closest('.t-rec,[id^="rec"]');
    if (rec) rec.classList.add('fp-v23-curator-record');

    return true;
  }

  function ensureMobileBuy() {
    var root = document.querySelector('.js-product');
    if (!root) return false;

    var purchase = root.querySelector('.purchase-container');
    var buy = root.querySelector('.buy-btn');
    var price = root.querySelector('#main-price');

    if (!purchase || !buy || !price) return false;

    buy.classList.add('fl-main-buy-now');

    var label = buy.querySelector('.buy-btn-label');
    if (!label) {
      label = document.createElement('span');
      label.className = 'buy-btn-label';
      label.textContent = 'Buy Now';
      buy.textContent = '';
      buy.appendChild(label);
    }

    var divider = purchase.querySelector('.fl-divider-before-buy');
    if (!divider) {
      divider = document.createElement('div');
      divider.className = 'fl-mobile-divider fl-divider-before-buy';
      purchase.insertBefore(divider, buy);
    }

    var priceInBuy = buy.querySelector('.fl-price-in-buy');
    if (!priceInBuy) {
      priceInBuy = document.createElement('span');
      priceInBuy.className = 'fl-price-in-buy';
      buy.appendChild(priceInBuy);
    }

    function sync() {
      var value = text(price).replace(/^\$/,'');
      priceInBuy.textContent = value ? '$' + value : '';
    }

    sync();

    if (!price.dataset.fpV23Observed) {
      price.dataset.fpV23Observed = '1';
      new MutationObserver(sync).observe(price, {
        childList:true,
        subtree:true,
        characterData:true
      });
    }

    return true;
  }

  function ensureMobileTabs() {
    var wrapper = document.querySelector('.js-product .tabs-wrapper');
    if (!wrapper) return 0;

    var header = wrapper.querySelector('.tabs-header');
    if (!header) return 0;

    var buttons = Array.prototype.slice.call(header.querySelectorAll('.tab-btn'));
    var contents = Array.prototype.slice.call(wrapper.children)
      .filter(function (node) {
        return node.classList && node.classList.contains('tab-content');
      });

    if (!buttons.length || !contents.length) return 0;

    /* Remove V2.2 mobile toggles if a hot edit left them in the DOM. */
    wrapper.querySelectorAll('.fp-v22-mobile-tab-toggle').forEach(function (n) {
      n.remove();
    });

    var created = 0;

    buttons.forEach(function (desktopBtn, index) {
      var content = contents[index];
      if (!content) return;

      var prev = content.previousElementSibling;
      var toggle =
        prev && prev.classList.contains('fl-v23-tab-toggle')
          ? prev
          : null;

      if (!toggle) {
        toggle = document.createElement('button');
        toggle.type = 'button';
        toggle.className = 'fl-v23-tab-toggle';
        if (index === 0) toggle.classList.add('is-primary');

        var title = document.createElement('span');
        title.className = 'fl-v23-tab-toggle-title';
        title.textContent = text(desktopBtn);

        var control = document.createElement('span');
        control.className = 'fl-v23-tab-toggle-control';
        control.setAttribute('aria-hidden','true');

        toggle.appendChild(title);
        toggle.appendChild(control);

        wrapper.insertBefore(toggle, content);
        created++;
      }

      if (!toggle.dataset.fpV23Bound) {
        toggle.dataset.fpV23Bound = '1';
        toggle.setAttribute('aria-expanded','false');

        toggle.addEventListener('click', function () {
          var willOpen = !content.classList.contains('fl-v23-open');

          wrapper.querySelectorAll('.fl-v23-tab-toggle.is-open')
            .forEach(function (x) {
              x.classList.remove('is-open');
              x.setAttribute('aria-expanded','false');
            });

          wrapper.querySelectorAll('.tab-content.fl-v23-open')
            .forEach(function (x) {
              x.classList.remove('fl-v23-open');
            });

          if (willOpen) {
            toggle.classList.add('is-open');
            toggle.setAttribute('aria-expanded','true');
            content.classList.add('fl-v23-open');
          }
        });
      }
    });

    /* Golden backup starts with all mobile accordion rows closed. */
    if (window.matchMedia('(max-width:820px)').matches) {
      wrapper.querySelectorAll('.fl-v23-tab-toggle').forEach(function (x) {
        x.classList.remove('is-open');
        x.setAttribute('aria-expanded','false');
      });
      wrapper.querySelectorAll('.tab-content').forEach(function (x) {
        x.classList.remove('fl-v23-open');
      });
    }

    return created;
  }

  function cleanV22Artifacts() {
    document.querySelectorAll(
      '.fp-v22-pm-toggle,.fp-v22-mobile-tab-toggle,.fp-v22-mobile-buy-price'
    ).forEach(function (node) {
      node.remove();
    });

    document.querySelectorAll('[data-fp-v22-legacy-hidden="1"]').forEach(function (node) {
      node.removeAttribute('data-fp-v22-legacy-hidden');
      node.style.removeProperty('display');
      node.style.removeProperty('visibility');
      node.style.removeProperty('height');
      node.style.removeProperty('min-height');
      node.style.removeProperty('max-height');
      node.style.removeProperty('margin');
      node.style.removeProperty('padding');
      node.style.removeProperty('border');
      node.style.removeProperty('overflow');
    });
  }

  function applyExactLayout() {
    if (!isQuadron()) return;

    injectExactStyles();
    cleanV22Artifacts();

    var result = {
      curator: bindCurator(),
      mobileBuy: ensureMobileBuy(),
      mobileTabsCreated: ensureMobileTabs(),
      perfectMatches:
        !!document.querySelector('.perfect-matches-block.fp-pm-v5')
    };

    document.documentElement.setAttribute('data-fp-exact-layout','v2.3');
    console.info('[Master Product V2] EXACT LAYOUT V2.3 APPLIED', result);
  }

  window.FilinMasterExactLayoutV23 = Object.freeze({
    version:'2.3',
    apply:applyExactLayout
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(applyExactLayout, 20);
    }, {once:true});
  } else {
    setTimeout(applyExactLayout, 20);
  }

  setTimeout(applyExactLayout, 700);
  setTimeout(applyExactLayout, 1800);
})();


/* ===== PROVEN PERFECT MATCHES V6.6 — EMBEDDED FOR V2.3 ===== */
(function(){
  var s=document.createElement('style');
  s.id='filin-master-pm-v66-v23-style';
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
    padding: 16px 15px 2px 45px !important;
    box-sizing: border-box !important;
  }

  .perfect-matches-block.fp-pm-v5 > .pm-formula::before {
    content: "" !important;
    position: absolute !important;
    left: 29px !important;
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
    left: -31px !important;
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
})();

(function () {
  'use strict';

  if (window.__MASTER_PRODUCT_PM_V23__) return;
  window.__MASTER_PRODUCT_PM_V23__ = true;

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
      '[Master Product V2] PERFECT MATCHES V6.6 / V2.3 READY.'
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

setTimeout(function(){
  if (window.FilinMasterExactLayoutV23) {
    window.FilinMasterExactLayoutV23.apply();
  }
}, 1100);
