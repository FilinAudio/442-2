/*! filin-demograf-crosslinks v1.0 — Burin (filinlabs.com) → Demograf Audio
 *
 * On the 23 Demograf product cards it adds one block at the end of the card:
 * "Official model page — Demograf Audio →", linking to the same model on
 * demografaudio.com. The Demograf site links back from its own cards
 * (FilinAudio/Demograph.com: src/lib/burin-links.ts) — keep both lists in sync.
 *
 * Install once, in Tilda → Site settings → More → HTML code for the HEAD:
 *   <script defer src="https://cdn.jsdelivr.net/gh/FilinAudio/442-2@main/demograf-crosslinks/filin-demograf-crosslinks-v1.js"></script>
 */
(function () {
  'use strict';
  if (window.__FILIN_DEMOGRAF_XLINK__) return;
  window.__FILIN_DEMOGRAF_XLINK__ = true;

  var SITE = 'https://demografaudio.com';
  // Burin page slug -> [Demograf path, model name]
  var MAP = {
    demograf_orpheus_aer_loudspeakers: ['/loudspeakers/orpheus/', 'Orpheus'],
    demograf_perseus_mkii_supravox_loudspeakers: ['/loudspeakers/perseus/', 'Perseus MkII'],
    demograf_cassandra_mkii_speakers: ['/loudspeakers/cassandra/', 'Cassandra MkII'],
    demograf_zeus_subwoofers: ['/loudspeakers/zeus/', 'Zeus'],
    perun_junior_hybrid_electrostatic_speakers: ['/loudspeakers/perun-junior/', 'Perun Audio Junior'],
    perun_elder_electrostatic_speakers: ['/loudspeakers/perun-elder/', 'Perun Audio Elder'],
    demograf_helios_mkii_g811_tube_integrated_amplifier: ['/amplifiers/helios/', 'Helios MkII'],
    demograf_tantal_senior_amplifier: ['/amplifiers/tantal-senior/', 'Tantal Senior'],
    demograf_atlas_amplifier_300b: ['/amplifiers/atlas/', 'Atlas'],
    demograf_solaria_45_tube_amp: ['/amplifiers/solaria/', 'Solaria'],
    demograf_3c24_tantal_tube_amp_electrostatic: ['/amplifiers/tantal/', 'Tantal'],
    demograf_eurybia_2a3_tube_amp: ['/amplifiers/eurybia/', 'Eurybia'],
    demograf_ether_tube_amp_gm_70: ['/amplifiers/ether/', 'Ether'],
    demograf_endymion_805_845_211_tube_amplifier: ['/amplifiers/endymion/', 'Endymion'],
    demograf_hyperion_dac: ['/digital/hyperion/', 'Hyperion'],
    demograf_tube_dacs_multibit: ['/digital/reference-dac/', 'Reference Tube DAC'],
    demograf_prometheus_fpga_dac: ['/digital/prometheus/', 'Prometheus'],
    demograf_hades_hybrid_class_d_amplifier_dac: ['/digital/hades/', 'Hades'],
    demograf_bellerophon_dac_solid_state_amplifier: ['/digital/bellerophon/', 'Bellerophon'],
    high_end_preamplifiers_demograf: ['/amplifiers/hector/', 'Hector'],
    demograf_ulanor_pc_streamer: ['/digital/ulanor/', 'Ulanor'],
    demograf_charon_tube_solid_state_master_clock: ['/digital/charon/', 'Charon'],
    demograf_odysseus_tube_phonostage: ['/amplifiers/ulixes/', 'Ulixes (Odysseus)'],
  };

  var slug = (location.pathname || '/').replace(/^\/+|\/+$/g, '').toLowerCase();
  var hit = MAP[slug];
  if (!hit) return;

  var CSS =
    '.fdx{margin:48px auto 24px;max-width:1160px;padding:0 20px;box-sizing:border-box}' +
    '.fdx__in{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px 24px;' +
    'border:1px solid rgba(201,145,61,.45);padding:20px 24px;font-family:Inter,Arial,sans-serif}' +
    '.fdx__k{font-size:12px;letter-spacing:.14em;text-transform:uppercase;color:#c9913d}' +
    '.fdx__t{font-size:15px;line-height:1.5;color:inherit;opacity:.85;margin-top:4px}' +
    '.fdx__a{font-size:15px;color:#c9913d;text-decoration:underline;text-underline-offset:4px;white-space:nowrap}' +
    '.fdx__a:hover{opacity:.8}';

  function block() {
    var url = SITE + hit[0];
    var wrap = document.createElement('aside');
    wrap.className = 'fdx';
    wrap.setAttribute('data-filin-demograf-xlink', slug);
    wrap.innerHTML =
      '<div class="fdx__in"><div><div class="fdx__k">Demograf Audio</div>' +
      '<div class="fdx__t">' + hit[1] + ' \u2014 official model page from the maker</div></div>' +
      '<a class="fdx__a" href="' + url + '" target="_blank" rel="noopener">demografaudio.com \u2192</a></div>';
    return wrap;
  }

  function place() {
    if (document.querySelector('[data-filin-demograf-xlink]')) return true;
    var card = document.getElementById('filin-master-product-v3');
    if (!card) return false;
    if (!document.getElementById('fdx-css')) {
      var st = document.createElement('style');
      st.id = 'fdx-css';
      st.textContent = CSS;
      document.head.appendChild(st);
    }
    card.parentNode.insertBefore(block(), card.nextSibling);
    return true;
  }

  function fallback() {
    if (document.querySelector('[data-filin-demograf-xlink]')) return;
    var st = document.createElement('style');
    st.id = 'fdx-css';
    st.textContent = CSS;
    document.head.appendChild(st);
    var footer = document.querySelector('#t-footer, .t-footer');
    var root = document.getElementById('allrecords') || document.body;
    if (footer && footer.parentNode) footer.parentNode.insertBefore(block(), footer);
    else root.appendChild(block());
  }

  function start() {
    if (place()) return;
    var mo = new MutationObserver(function () {
      if (place()) mo.disconnect();
    });
    mo.observe(document.body, { childList: true, subtree: true });
    // The card is normally built within a few seconds; after 15 s (the
    // loader's own fallback) put the link above the footer instead.
    setTimeout(function () {
      mo.disconnect();
      if (!place()) fallback();
    }, 15000);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
