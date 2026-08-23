
/*! FILIN LABS — GS 3.4 Universal Card Patch
 *  Ставится ПОСЛЕДНИМ в цепочке после master-product runtime.
 *  Чинит: утечку JS/CSS в текстовые поля, отсутствие Perfect Matches,
 *  чёрной полосы, табов и блока с иконками-характеристиками.
 *  Все вставки идемпотентны: повторный запуск ничего не дублирует.
 */
(function () {
  "use strict";
  if (window.__FL34__) return;
  window.__FL34__ = true;
 
  /* =========================== CONFIG =========================== */
  var CFG = {
    discount: 0.05,                 // скидка на добавленный компонент
    matchesCount: 3,                // сколько компонентов показывать
    syncBuyNowPrice: true,          // переписывать цену в BUY NOW
    stripText: "Handcrafted in small batches · Bench-tested before shipping · Lifetime service support",
 
    // Резервный список, если Rich Product Catalog недоступен.
    fallbackMatches: [
      { title: "Art&Air Reference AC Power Cable", price: 690,  url: "/art_air_reference_ac_power_cable" },
      { title: "Art&Air Classic RCA / Phono S-PDIF Cables", price: 450, url: "/art_air_classic_rca_phono" },
      { title: "Art&Air Balanced XLR & AES/EBU Cables", price: 520, url: "/art_air_balanced_xlr" },
      { title: "Demograf Audio Asteria Digital Cable", price: 750, url: "/demograf_asteria_digital_cable" },
      { title: "Demograf Solid Copper Banana Plugs (Set of 4)", price: 150, url: "/demograf_solid_copper_banana_plugs" },
      { title: "Demograf Reference Binding Posts", price: 150, url: "/demograf_binding_posts" },
      { title: "Cassiopeia AMT Ribbon Supertweeters (Pair)", price: 990, url: "/demograf_cassiopeia_amt_ribbon_hf_supertweeters" },
      { title: "Demograf \u00abTempestus\u00bb Power Regenerator", price: 4500, url: "/demograf_tempestus" }
    ],
 
    // Точечные переопределения: window.FL34_OVERRIDE = { "slug": { sonic:"...", synergy:"..." } }
    palette: {
      gold1: "#E3C08A", gold2: "#B98D54", dark: "#2C2620",
      cream: "#FBF8F4", line: "#E5DED3", ink: "#33302B", muted: "#7A736A"
    }
  };
  /* ============================================================== */
 
  var SLUG = location.pathname.replace(/^\/+|\/+$/g, "").split("/").pop();
  var OVR = (window.FL34_OVERRIDE || {})[SLUG] || {};
 
  /* ---------------------------- utils --------------------------- */
  function $(s, r) { return (r || document).querySelector(s); }
  function $$(s, r) { return [].slice.call((r || document).querySelectorAll(s)); }
  function el(tag, cls, html) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (html != null) n.innerHTML = html;
    return n;
  }
  function money(n) { return "$" + Math.round(n).toLocaleString("en-US"); }
  function parseMoney(s) {
    var m = String(s || "").replace(/\u00a0/g, " ").match(/\$\s?([\d][\d\s,]*)/);
    return m ? parseFloat(m[1].replace(/[\s,]/g, "")) : 0;
  }
  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = (h * 16777619) >>> 0; }
    return h;
  }
  // Детерминированный "рандом": одинаковый набор при каждой загрузке слага
  function pickStable(list, n, seed) {
    var arr = list.slice(), out = [], h = hash(seed);
    while (arr.length && out.length < n) {
      h = (h * 1103515245 + 12345) >>> 0;
      out.push(arr.splice(h % arr.length, 1)[0]);
    }
    return out;
  }
  function isProductPage() {
    var t = document.body ? document.body.innerText || "" : "";
    return /\$\s?[\d,]{2,}/.test(t) && /BUY\s*NOW|Buy Now|Купить/i.test(t);
  }
 
  /* --------------------------- styles --------------------------- */
  function injectCSS() {
    if ($("#fl34-css")) return;
    var p = CFG.palette;
    var css = [
      ".fl34{box-sizing:border-box;font-family:var(--t-text-font,'Inter',Arial,sans-serif);color:" + p.ink + "}",
      ".fl34 *,.fl34 *:before,.fl34 *:after{box-sizing:border-box}",
      ".fl34-wrap{max-width:1200px;margin:0 auto;padding:0 20px}",
 
      /* чёрная полоса */
      ".fl34-strip{background:" + p.dark + ";color:#fff;text-align:center;padding:18px 20px;" +
        "font-size:14px;letter-spacing:.06em;text-transform:uppercase;line-height:1.5}",
 
      /* табы */
      ".fl34-tabs{margin:40px 0}",
      ".fl34-tabbar{display:flex;flex-wrap:wrap;gap:2px;border-bottom:1px solid " + p.line + "}",
      ".fl34-tab{appearance:none;border:0;background:none;cursor:pointer;padding:14px 22px;" +
        "font:600 13px/1.2 inherit;letter-spacing:.09em;text-transform:uppercase;color:" + p.muted + ";" +
        "border-bottom:2px solid transparent;transition:color .2s,border-color .2s}",
      ".fl34-tab:hover{color:" + p.ink + "}",
      ".fl34-tab[aria-selected='true']{color:" + p.gold2 + ";border-bottom-color:" + p.gold2 + "}",
      ".fl34-tab:focus-visible{outline:2px solid " + p.gold2 + ";outline-offset:2px}",
      ".fl34-panel[hidden]{display:none}",
      ".fl34-panel{padding:26px 0;font-size:16px;line-height:1.7}",
      ".fl34-speclist{margin:0;display:grid;grid-template-columns:minmax(140px,32%) 1fr;gap:0}",
      ".fl34-speclist dt{padding:10px 0;border-bottom:1px solid " + p.line + ";font-weight:600}",
      ".fl34-speclist dd{padding:10px 0;margin:0;border-bottom:1px solid " + p.line + ";color:" + p.muted + "}",
 
      /* блок иконок */
      ".fl34-facts{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:1px;" +
        "background:" + p.line + ";border:1px solid " + p.line + ";margin:34px 0}",
      ".fl34-fact{background:" + p.cream + ";padding:22px}",
      ".fl34-fact h4{margin:0 0 8px;font:700 13px/1.3 inherit;letter-spacing:.08em;text-transform:uppercase}",
      ".fl34-fact p{margin:0;font-size:15px;line-height:1.6;color:" + p.muted + "}",
      ".fl34-ico{display:inline-block;width:18px;height:18px;margin-right:8px;vertical-align:-3px;" +
        "color:" + p.gold2 + "}",
 
      /* perfect matches */
      ".fl34-pm{margin:44px 0;border:1px solid " + p.line + ";background:" + p.cream + "}",
      ".fl34-pm__head{padding:20px 24px;border-bottom:1px solid " + p.line + "}",
      ".fl34-pm__head h3{margin:0;font:700 15px/1.3 inherit;letter-spacing:.09em;text-transform:uppercase}",
      ".fl34-pm__head span{display:block;margin-top:6px;font-size:14px;color:" + p.muted + "}",
      ".fl34-pm__list{margin:0;padding:0;list-style:none}",
      ".fl34-pm__row{display:flex;align-items:center;gap:14px;padding:16px 24px;border-bottom:1px solid " + p.line + "}",
      ".fl34-pm__row label{display:flex;align-items:center;gap:14px;flex:1;cursor:pointer;min-width:0}",
      ".fl34-pm__row input{width:20px;height:20px;flex:0 0 auto;accent-color:" + p.gold2 + ";cursor:pointer}",
      ".fl34-pm__t{flex:1;min-width:0;font-size:15px;line-height:1.4}",
      ".fl34-pm__t a{color:inherit;text-decoration:none;border-bottom:1px solid " + p.line + "}",
      ".fl34-pm__t a:hover{border-bottom-color:" + p.gold2 + "}",
      ".fl34-pm__p{flex:0 0 auto;text-align:right;font-size:15px;white-space:nowrap}",
      ".fl34-pm__p s{color:" + p.muted + ";margin-right:8px}",
      ".fl34-pm__p b{color:" + p.gold2 + "}",
      ".fl34-pm__foot{display:flex;align-items:center;justify-content:space-between;gap:16px;" +
        "flex-wrap:wrap;padding:20px 24px}",
      ".fl34-pm__sum{font:700 20px/1.2 inherit}",
      ".fl34-pm__save{font-size:14px;color:" + p.gold2 + "}",
      ".fl34-pm__cta{appearance:none;border:0;cursor:pointer;padding:14px 34px;border-radius:2px;" +
        "font:700 14px/1 inherit;letter-spacing:.08em;text-transform:uppercase;color:#fff;" +
        "background:linear-gradient(180deg," + p.gold1 + " 0%," + p.gold2 + " 100%)}",
      ".fl34-pm__cta:focus-visible{outline:2px solid " + p.dark + ";outline-offset:2px}",
 
      "@media (max-width:640px){.fl34-pm__row{flex-wrap:wrap}.fl34-speclist{grid-template-columns:1fr}" +
        ".fl34-speclist dt{border-bottom:0;padding-bottom:0}.fl34-strip{font-size:12px}}",
      "@media (prefers-reduced-motion:reduce){.fl34 *{transition:none!important}}"
    ].join("");
    var st = el("style"); st.id = "fl34-css"; st.textContent = css;
    document.head.appendChild(st);
  }
 
  /* ============ 1. Утечка Tilda-скриптов и CSS в текст ============ */
  var LEAK = /(t_onReady\s*\(|t_onFuncLoad\s*\(|#rec\d{5,}|@media\s+screen\s+and\s*\(|font-family\s*:var\(|\.t-card__)/;
 
  function killScriptLeak() {
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false), n, hits = [];
    while ((n = w.nextNode())) {
      var tag = n.parentNode && n.parentNode.nodeName;
      if (tag === "SCRIPT" || tag === "STYLE" || tag === "NOSCRIPT") continue;
      if (n.nodeValue && LEAK.test(n.nodeValue)) hits.push(n);
    }
    hits.forEach(function (node) {
      var i = node.nodeValue.search(LEAK);
      var clean = node.nodeValue.slice(0, i).replace(/[\s;{(,-]+$/, "").trim();
      node.nodeValue = clean;
      if (clean.length < 2) {
        var host = node.parentNode;
        // прячем пустой контейнер, но не весь блок карточки
        while (host && host !== document.body && !host.textContent.trim() &&
               host.children.length < 3) {
          host.style.display = "none";
          host = host.parentNode;
        }
      }
    });
    return hits.length;
  }
 
  /* ==================== 2. Чёрная полоса ========================= */
  function firstContentBlock() {
    var recs = $$("#allrecords .t-rec, #allrecords > .r");
    for (var i = 0; i < recs.length; i++) {
      var r = recs[i];
      if (r.closest(".fl34")) continue;
      if (r.offsetHeight > 220 && r.getBoundingClientRect().top + window.scrollY < 2200) return r;
    }
    return recs[0] || null;
  }
 
  function ensureStrip() {
    if ($(".fl34-strip")) return;
    var txt = (document.body.innerText || "");
    if (/handcrafted/i.test(txt) && !/fl34/.test(txt)) { /* уже есть своя полоса */ }
    var anchor = firstContentBlock();
    if (!anchor || !anchor.parentNode) return;
    var strip = el("div", "fl34 fl34-strip");
    strip.textContent = OVR.strip || CFG.stripText;
    anchor.parentNode.insertBefore(strip, anchor.nextSibling);
  }
 
  /* ======================== 3. Табы ============================== */
  var TAB_WORDS = ["DESCRIPTION", "SPECIFICATION", "SPECIFICATIONS", "ОПИСАНИЕ",
                   "ХАРАКТЕРИСТИКИ", "DELIVERY", "WARRANTY", "SHIPPING", "REVIEWS"];
 
  function hasNativeTabs() {
    var seen = {}, count = 0;
    $$("div,span,a,li,button,h2,h3,h4").some(function (n) {
      if (n.children.length) return false;
      var t = (n.textContent || "").trim().toUpperCase();
      if (!t || t.length > 26) return false;
      if (TAB_WORDS.indexOf(t) > -1 && !seen[t]) { seen[t] = 1; count++; }
      return count >= 2;
    });
    return count >= 2;
  }
 
  function biggestTextRecord() {
    var best = null, len = 0;
    $$("#allrecords .t-rec").forEach(function (r) {
      if (r.closest(".fl34")) return;
      if (/BUY\s*NOW/i.test(r.innerText || "")) return;
      var l = (r.innerText || "").trim().length;
      if (l > len && l > 400) { len = l; best = r; }
    });
    return best;
  }
 
  function specPairsFrom(text) {
    var out = [];
    (text || "").split("\n").forEach(function (line) {
      var m = line.match(/^\s*([^:]{3,42}):\s*(.{2,120})\s*$/);
      if (m && out.length < 14) out.push([m[1].trim(), m[2].trim()]);
    });
    return out;
  }
 
  function ensureTabs() {
    if ($(".fl34-tabs") || hasNativeTabs()) return;
    var host = biggestTextRecord();
    if (!host || !host.parentNode) return;
 
    var wrap = el("div", "fl34 fl34-tabs");
    var bar = el("div", "fl34-tabbar");
    bar.setAttribute("role", "tablist");
    wrap.appendChild(bar);
 
    var tabs = [
      { id: "desc", label: "Description" },
      { id: "spec", label: "Specification" },
      { id: "ship", label: "Delivery & warranty" }
    ];
    var panels = {};
    tabs.forEach(function (t, i) {
      var b = el("button", "fl34-tab", t.label);
      b.type = "button";
      b.id = "fl34-tab-" + t.id;
      b.setAttribute("role", "tab");
      b.setAttribute("aria-controls", "fl34-panel-" + t.id);
      b.setAttribute("aria-selected", i === 0 ? "true" : "false");
      bar.appendChild(b);
 
      var p = el("div", "fl34-panel fl34-wrap");
      p.id = "fl34-panel-" + t.id;
      p.setAttribute("role", "tabpanel");
      p.setAttribute("aria-labelledby", b.id);
      if (i !== 0) p.hidden = true;
      wrap.appendChild(p);
      panels[t.id] = p;
 
      b.addEventListener("click", function () {
        $$(".fl34-tab", wrap).forEach(function (x) { x.setAttribute("aria-selected", "false"); });
        $$(".fl34-panel", wrap).forEach(function (x) { x.hidden = true; });
        b.setAttribute("aria-selected", "true");
        p.hidden = false;
      });
    });
 
    host.parentNode.insertBefore(wrap, host);
    panels.desc.appendChild(host);                    // переносим, не копируем
 
    // Specification: реальная таблица, если есть; иначе пары "Ключ: значение"
    var table = $$("#allrecords .t-rec table").filter(function (t) { return !t.closest(".fl34"); })[0];
    if (table) {
      panels.spec.appendChild(table.closest(".t-rec") || table);
    } else {
      var pairs = specPairsFrom(host.innerText);
      if (pairs.length) {
        var dl = el("dl", "fl34-speclist");
        pairs.forEach(function (pr) {
          dl.appendChild(el("dt", "", pr[0]));
          dl.appendChild(el("dd", "", pr[1]));
        });
        panels.spec.appendChild(dl);
      } else {
        panels.spec.innerHTML = "<p>Full measured specification ships with the unit and is available on request.</p>";
      }
    }
    panels.ship.innerHTML =
      "<p>Built to order in small batches. Production and bench testing take 3–6 weeks, " +
      "after which the unit ships worldwide with insured tracked delivery.</p>" +
      "<p>Every Filin Labs component carries a 3-year warranty and lifetime service support " +
      "at our workshop.</p>";
  }
 
  /* ============ 4. Блок с иконками и характеристиками ============ */
  var ICONS = {
    tier: '<svg class="fl34-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7v10M9.5 9.5h5M9.5 14.5h5"/></svg>',
    tags: '<svg class="fl34-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 5h11l5 7-5 7H4z"/><circle cx="8" cy="12" r="1.4"/></svg>',
    sonic: '<svg class="fl34-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12h2l2-6 3 14 3-11 2 5h4"/></svg>',
    synergy: '<svg class="fl34-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 15l6-6M8 8H6a4 4 0 100 8h2M16 8h2a4 4 0 110 8h-2"/></svg>'
  };
 
  var CATS = [
    [/cable|interconnect|cord|wire/i, "Cables & interconnects",
      "Neutral, low-noise transfer with an open top end",
      "Reference DAC, phono stage, power amplifier"],
    [/amplifier|amp\b|integrated|monoblock/i, "Amplification",
      "Warm, organic, timbrally rich with deep harmonic texture",
      "High-sensitivity horns, planar magnetic headphones"],
    [/speaker|loudspeaker|floorstand|enclosure|horn|grille/i, "Loudspeakers & enclosures",
      "Fast transient attack with a large, stable stage",
      "Tube amplification, valve preamplifier"],
    [/tweeter|supertweeter|driver|ribbon|amt/i, "Drivers & HF extension",
      "Airy, extended treble free of breakup distortion",
      "Wide-band mid drivers, open-baffle designs"],
    [/transformer|choke|power|regenerator|supply/i, "Power & magnetics",
      "Blacker background, firmer low-frequency grip",
      "Tube amplifiers, high-current DACs"],
    [/plug|post|connector|banana|terminal/i, "Connectors",
      "Distortion-free contact with minimal signal loss",
      "Any high-end speaker cable or amplifier terminal"],
    [/cartridge|turntable|phono|vinyl/i, "Analogue front end",
      "Dense midrange with natural decay",
      "High-end phono stage, retro vinyl turntable"],
    [/room|treatment|acoustic|measurement/i, "Room & acoustics",
      "Controlled decay and even in-room response",
      "Any full-range system in a residential room"]
  ];
 
  function pageBasePrice() {
    var bar = $$("[class*='t-store'],[class*='fl-mp'],div,span").filter(function (n) {
      return !n.children.length && /^\$\s?[\d,]{2,}$/.test((n.textContent || "").trim());
    })[0];
    var p = bar ? parseMoney(bar.textContent) : 0;
    if (!p) p = parseMoney((document.body.innerText || "").match(/BUY\s*NOW[^$]{0,40}(\$[\d,]+)/i) || "");
    if (!p) {
      var all = (document.body.innerText || "").match(/\$\s?[\d,]{3,}/g) || [];
      p = all.map(parseMoney).sort(function (a, b) { return b - a; })[0] || 0;
    }
    return p;
  }
 
  function classify() {
    var title = (document.title || "") + " " + SLUG.replace(/_/g, " ");
    for (var i = 0; i < CATS.length; i++) if (CATS[i][0].test(title)) return CATS[i];
    return [null, "High-end audio", "Balanced, uncoloured presentation", "Reference-grade source and amplification"];
  }
 
  function ensureFacts() {
    if ($(".fl34-facts")) return;
    var txt = (document.body.innerText || "").toUpperCase();
    var native = ["SYNERGY MATCH", "SONIC SIGNATURE", "GENRES ACCORD", "HIGH TECHNOLOGIES", "TAGS & FEATURES"]
      .filter(function (w) { return txt.indexOf(w) > -1; }).length;
    if (native >= 2) return;
 
    var c = classify(), price = pageBasePrice();
    var tier = price >= 5000 ? "Statement" : price >= 2000 ? "Reference"
             : price >= 500 ? "Advanced" : "Entry";
    var words = SLUG.split(/[_-]+/).filter(function (w) { return w.length > 2; }).slice(0, 6);
 
    var box = el("div", "fl34 fl34-facts");
    [
      ["Category & budget tier", ICONS.tier, c[1] + " · " + tier + (price ? " (" + money(price) + ")" : "")],
      ["Tags & features", ICONS.tags, words.map(function (w) { return "#" + w; }).join(" ")],
      ["Sonic signature", ICONS.sonic, OVR.sonic || c[2]],
      ["Synergy match", ICONS.synergy, OVR.synergy || c[3]]
    ].forEach(function (f) {
      var card = el("div", "fl34-fact");
      card.appendChild(el("h4", "", f[1] + f[0]));
      card.appendChild(el("p", "", f[2]));
      box.appendChild(card);
    });
 
    var wrap = el("div", "fl34 fl34-wrap");
    wrap.appendChild(box);
    var tabs = $(".fl34-tabs");
    var anchor = tabs || firstContentBlock();
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(wrap, anchor);
  }
 
  /* ================== 5. Perfect matches ========================= */
  function catalogItems() {
    var globals = ["FILIN_CATALOG", "__FILIN_CATALOG__", "RICH_PRODUCT_CATALOG",
                   "FilinCatalog", "FILIN_PRODUCTS", "__FILIN_PRODUCTS__"];
    for (var i = 0; i < globals.length; i++) {
      var g = window[globals[i]];
      var list = Array.isArray(g) ? g : (g && (g.products || g.items || g.list));
      if (Array.isArray(list) && list.length > 4) {
        var mapped = list.map(function (p) {
          return {
            title: p.title || p.name || p.productTitle || "",
            price: parseFloat(p.price || p.cost || 0) || 0,
            url: p.url || p.link || (p.slug ? "/" + p.slug : "#")
          };
        }).filter(function (p) {
          return p.title && p.price > 0 && p.url.indexOf(SLUG) === -1;
        });
        if (mapped.length > 4) return mapped;
      }
    }
    return CFG.fallbackMatches.filter(function (p) { return p.url.indexOf(SLUG) === -1; });
  }
 
  function ensurePerfectMatches() {
    if ($(".fl34-pm")) return;
    if (/PERFECT\s*MATCH/i.test(document.body.innerText || "")) return;
 
    var base = pageBasePrice();
    var items = pickStable(catalogItems(), CFG.matchesCount, SLUG);
    if (!items.length) return;
 
    var box = el("section", "fl34 fl34-pm");
    var head = el("div", "fl34-pm__head");
    head.appendChild(el("h3", "", "Perfect matches"));
    head.appendChild(el("span", "", "Add a matched component to this order and it comes with " +
      Math.round(CFG.discount * 100) + "% off its retail price."));
    box.appendChild(head);
 
    var ul = el("ul", "fl34-pm__list");
    items.forEach(function (it, i) {
      var disc = it.price * (1 - CFG.discount);
      var li = el("li", "fl34-pm__row");
      var lab = el("label");
      var cb = el("input");
      cb.type = "checkbox";
      cb.value = String(disc);
      cb.setAttribute("data-title", it.title);
      cb.id = "fl34-pm-" + i;
      lab.appendChild(cb);
      lab.appendChild(el("span", "fl34-pm__t",
        '<a href="' + it.url + '">' + it.title + "</a>"));
      lab.appendChild(el("span", "fl34-pm__p",
        "<s>" + money(it.price) + "</s><b>" + money(disc) + "</b>"));
      li.appendChild(lab);
      ul.appendChild(li);
    });
    box.appendChild(ul);
 
    var foot = el("div", "fl34-pm__foot");
    var left = el("div");
    var sum = el("div", "fl34-pm__sum", "Total: " + money(base));
    var save = el("div", "fl34-pm__save", "");
    left.appendChild(sum); left.appendChild(save);
    var cta = el("button", "fl34-pm__cta", "Buy now");
    cta.type = "button";
    foot.appendChild(left); foot.appendChild(cta);
    box.appendChild(foot);
 
    function recalc() {
      var extra = 0, retail = 0, chosen = [];
      $$("input[type=checkbox]", ul).forEach(function (cb) {
        if (!cb.checked) return;
        extra += parseFloat(cb.value);
        retail += parseFloat(cb.value) / (1 - CFG.discount);
        chosen.push({ title: cb.getAttribute("data-title"), price: parseFloat(cb.value) });
      });
      var total = base + extra;
      sum.textContent = "Total: " + money(total);
      save.textContent = chosen.length ? "You save " + money(retail - extra) + " on matched components" : "";
      document.body.setAttribute("data-fl34-total", String(Math.round(total)));
      // отдаём наружу — Cart Bridge может подписаться
      document.dispatchEvent(new CustomEvent("fl34:matches-change", {
        detail: { base: base, items: chosen, total: total }
      }));
      if (CFG.syncBuyNowPrice) syncPrice(total);
    }
    ul.addEventListener("change", recalc);
    cta.addEventListener("click", function () {
      var b = $$("a,button,div").filter(function (n) {
        return /^BUY\s*NOW/i.test((n.textContent || "").trim()) && !n.closest(".fl34");
      })[0];
      if (b) b.click(); else location.hash = "#buy";
    });
 
    var anchor = $(".fl34-tabs") || firstContentBlock();
    var wrap = el("div", "fl34 fl34-wrap");
    wrap.appendChild(box);
    if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(wrap, anchor.nextSibling);
    recalc();
  }
 
  function syncPrice(total) {
    $$("a,button,div,span").forEach(function (n) {
      if (n.closest(".fl34") || n.children.length) return;
      var t = (n.textContent || "").trim();
      if (!/^\$\s?[\d,]{2,}$/.test(t)) return;
      if (!n.hasAttribute("data-fl34-base")) n.setAttribute("data-fl34-base", t);
      n.textContent = money(total);
    });
  }
 
  /* ========================== runner ============================= */
  function apply() {
    if (!document.body) return;
    killScriptLeak();
    if (!isProductPage()) return;
    injectCSS();
    ensureStrip();
    ensureTabs();
    ensureFacts();
    ensurePerfectMatches();
    document.documentElement.classList.add("fl34-ready");
  }
 
  function start() {
    apply();
    var t = null;
    var mo = new MutationObserver(function () {
      clearTimeout(t);
      t = setTimeout(apply, 300);
    });
    mo.observe(document.body, { childList: true, subtree: true });
    // рантайм дорисовывает карточку асинхронно — наблюдаем 10 секунд
    setTimeout(function () { mo.disconnect(); apply(); }, 10000);
  }
 
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();
