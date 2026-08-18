/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 GOLDEN STANDARD
   Architecture freeze candidate — 2026-08-18

   Goals:
   - one runtime owns product layout and interaction
   - product-specific information lives only in profiles below
   - legacy Product Engine markup may stay on migration pages but is
     visually quarantined and cannot create duplicate tabs/PM blocks
   - Golden Production Baseline geometry is the visual contract
   ============================================================ */
(function(){
  'use strict';

  if (window.__FILIN_MASTER_PRODUCT_V3_GOLDEN__) return;
  window.__FILIN_MASTER_PRODUCT_V3_GOLDEN__ = true;

  var VERSION='3.0.0';
  var MAX_MOBILE=820;
  var STYLE_ID='filin-master-product-v3-golden-style';
  var ROOT_ID='filin-master-product-v3';
  var PROFILES={"filin_audio_quadron":{"schemaVersion":2,"slug":"filin_audio_quadron","id":"filin-audio-quadron","category":"headphones","currency":"USD","hero":{"staticH1":"Filin Audio \"Quadron\": Flagship Closed-Back Planar Headphones","description":"The Filin Audio \"Quadron\" represents an uncompromising leap in planar magnetic performance, utilizing advanced SAW Technology® and custom-tuned drivers by Snorry.","background":"https://static.tildacdn.com/tild6364-6138-4230-b061-373861656163/8dac9d4fe7c93b6a5f2c.jpg"},"curator":"Handcrafted by Evgeny Melentiev. Personally listened, approved & curated by M. Piskarev. Filin Labs Kazakhstan.","overview":{"title":"Filin Audio \"Quadron\"","html":"<p>The \"Quadron\" is the Ultimate Flagship of Filin Audio with SAW Technology®!</p> <p>The \"Quadron\" model differs from the \"Limited\" model with:</p> <p>- More advanced drivers: Extremely Detailed Sound.</p> <p>- Unique Style &amp; Earpads (Quadron Edition).</p> <p>- <a href=\"https://filinlabs.com/special_offers/0kkhpsorr1-special-offer-complete-your-filin-quadro\">Special Offers</a></p> <p>3-year manufacturer's warranty!</p> <p>Fully customizable!</p> <p>Extreme noise isolation!</p> <p>Neutral sound signature.</p>","galleryImages":["https://static.tildacdn.com/tild6164-3039-4662-b966-363861653361/9117c62f7e0a50050d95.webp","https://static.tildacdn.com/tild3165-3264-4937-a335-373362383733/f97e6f454078ef52f7aa.webp","https://static.tildacdn.com/tild3338-3638-4632-b565-393938353062/imgi_66_7.jpg","https://static.tildacdn.com/tild6165-3530-4861-b632-393332353563/4.jpg","https://static.tildacdn.com/tild3230-3233-4738-a430-313233303661/d03449f7e0a09469eb40.webp","https://static.tildacdn.com/tild3236-3864-4532-b137-666662646431/d03156225a632341fbfd.webp","https://static.tildacdn.com/tild6435-3866-4538-a232-666431356463/ff395a9f88092aaf5f9b.webp","https://static.tildacdn.com/tild3364-6336-4539-a132-643163386536/5e2a7a488882eeba0be4.jpg","https://static.tildacdn.com/tild3665-3638-4038-a236-396234383132/7e0c66b9215c087ae7a8.jpg","https://static.tildacdn.com/tild3234-3263-4337-a664-323033326439/7f8c98ddb3d9b7302e5b.webp","https://static.tildacdn.com/tild3062-3264-4364-a130-613761356536/8dac9d4fe7c93b6a5f2c.jpg","https://static.tildacdn.com/tild3835-3737-4632-b462-626561663531/87fd50a31a8ff705d175.jpg"]},"curation":[],"commerce":{"basePrice":3200,"displayName":"Filin Audio \"Quadron\" Planar Magnetic Headphones","cartName":"Filin Audio \"Quadron\" Planar Magnetic Headphones (Standard Edition)","stickyTitle":"Filin Audio \"Quadron\" Planar Magnetic Headphones","innerHTML":"<div class=\"purchase-container\"> <span class=\"js-product-name\" id=\"tilda-product-name\" style=\"display:none;\">Filin Audio \"Quadron\" Planar Magnetic Headphones (Standard Edition)</span> <div class=\"price-title\">Total*: $<span class=\"js-product-price\" id=\"main-price\">3200</span></div> <a class=\"buy-btn js-product-btn\" href=\"#order\">Buy Now</a> <!-- БЛОК PERFECT MATCHES --> <div class=\"perfect-matches-block\"> <h4 class=\"pm-title\">Perfect Matches</h4> <p class=\"pm-desc\">These 88dB sensitive planar magnetic closed headphones reveal their true dynamics and holographic imaging with authoritative amplification and high-resolution conversion. To achieve the ultimate transparent presentation, we recommend this synergy:</p> <div class=\"pm-formula\"> <div class=\"pm-item pm-base\"> <span>Filin Quadron</span> </div> <span class=\"pm-plus\">+</span> <label class=\"pm-item\"> <input class=\"price-item bundle-item\" data-price=\"0\" name=\"match_dac\" type=\"checkbox\"/> <span><a href=\"https://filinlabs.com/gerbera_pcm1794_dsd1794_dac_otis\">Gerbera Otis Flagship DSD1794 DAC</a></span> </label> <span class=\"pm-plus\">+</span> <label class=\"pm-item\"> <input class=\"price-item bundle-item\" data-price=\"0\" name=\"match_amp\" type=\"checkbox\"/> <span><a href=\"https://filinlabs.com/gerbera_active_tube_preamplifier\">Gerbera Active Tube Preamplifier</a></span> </label> <span class=\"pm-plus\">+</span> <label class=\"pm-item\"> <input class=\"price-item bundle-item\" data-price=\"0\" name=\"match_amp\" type=\"checkbox\"/> <span><a href=\"https://filinlabs.com/konstantin_audio_un_1_solid_state_headphones_amplifier\">Konstantin Audio \"UN-1\" Amplifier</a></span> </label> <span class=\"pm-plus\">+</span> <label class=\"pm-item\"> <input class=\"price-item bundle-item\" data-price=\"0\" name=\"match_amp\" type=\"checkbox\"/> <span><a href=\"https://filinlabs.com/filin_audio_purity_headphones_cable\">Filin Audio the \"Purity\" Headphone Cables</a></span> </label> <span class=\"pm-equals\">=</span> <div class=\"pm-result\">Ultimate Synergy</div> </div> <div class=\"pm-discount\" id=\"bundle-discount-msg\">Add recommended synergy components to get <b>5% OFF</b> per each item added.</div> </div> </div> <div class=\"tabs-wrapper\"> <div class=\"tabs-header\"> <button class=\"tab-btn active\" onclick=\"showTab(event, 'desc')\">Key Features</button> <button class=\"tab-btn\" onclick=\"showTab(event, 'spec')\">Specification</button> <button class=\"tab-btn\" onclick=\"showTab(event, 'Tuning &amp; Customization')\">Tuning &amp; Customization</button> <button class=\"tab-btn\" onclick=\"showTab(event, 'upgrades')\">Component Upgrades</button> <button class=\"tab-btn\" onclick=\"showTab(event, 'Cable Output Plug')\">Cable Output Plug</button> <button class=\"tab-btn\" onclick=\"showTab(event, 'cable-length')\">Cable Length</button> </div> <div class=\"tab-content\" id=\"desc\"> <div class=\"content-container\"> <div class=\"Key Features\"> <div class=\"description-content\"> <h3>General Description</h3> <p>The \"Quadron\" bundle includes: heavily-protected carrying case, stock solid-core copper cable (Premium Edition), Set of Supplementary Acoustic Overlay Earpads for enhanced isolation and detail retrieval.</p> <p>The Filin Audio \"Quadron\" headphones utilize planar magnetic drivers consisting of a membrane with thin conductive traces applied to it. The membrane is suspended between two arrays of bar magnets.</p> <p>Because the voice coil is evenly distributed across the entire surface of the membrane, it moves uniformly over its entire area during music playback.</p> <p>In contrast to dynamic drivers, where the coil is attached only to its central part, membrane fluctuations in planar designs are perfectly uniform.</p> <p>Planar magnetic headphones provide a balanced, flat, and extremely precise reproduction of musical material without unwanted sound coloration. Inside these headphones are special membranes crafted by Sergey Glazyrin (snorry), meticulously tuned by master Evgeny Melentiev.</p> <h3>Exceptional Passive Noise Isolation!</h3> <p>Filin Audio \"Quadron\" are monitor, circumaural (over-ear) type headphones.</p> <p>This is the most sophisticated and advanced headphone form factor, featuring a large headband and fully encompassing ear cups.</p> <p>These models integrate a massive membrane, allowing them to evenly reproduce the entire frequency spectrum.</p> <p>The Filin Audio \"Quadron\" headphones are equipped with planar magnetic drivers engineered and manufactured by Sergey Glazyrin (snorry) exactly to Filin Audio's specifications, utilizing tubular waveguide technology (SAW Technology®).</p> <p>The internal wiring of the headphones is executed using custom 2.8mm² solid-core, 4N (.999) jewelry-grade silver, uniquely polished and wound around a dielectric in multiple insulating jackets.</p> <p>The headphones come with a detachable copper cable to enhance treble and midrange detail, as well as to provide a punchier bass line.</p> <p>The ear cups are milled from fully dried, premium-grade, hard, and expensive exotic woods. Wood waste (sawdust) during the manufacturing process accounts for about 70%, which serves as a testament to the uncompromisingly strict selection of suitable raw materials.</p> <p>The headphones feature unique, custom-designed ear pads that are entirely hand-stitched.</p> <h3>The Sound Signature &amp; Vision</h3> <p>We envision the Filin Audio \"Quadron\" headphones as uncompromising, delivering the highest tier of sound for seasoned audiophiles, while remaining highly affordable compared to planar magnetic headphones from mainstream renowned brands.</p> </div> </div> </div> </div> <div class=\"tab-content\" id=\"spec\" style=\"display:none;\"> <div class=\"content-container\"> <table class=\"specs-table\"> <tbody> <tr> <td><strong>Total Price*</strong></td> <td>The price is for the base product only and does not include shipping or selected optional upgrades. To get a complete final quote, please submit your request to our consultant via email at <a href=\"mailto:shop@filinlabs.com\">shop@filinlabs.com</a> or via Telegram at <a href=\"https://t.me/RA_Fayzullin\" rel=\"noopener\" target=\"_blank\">@RA_Fayzullin</a>. We will send you an invoice &amp; full costs calculation in the reply message.</td> </tr> <tr> <td><strong>Lead Times</strong></td> <td>You can check the lead times for each item in the \"<a href=\"https://filinlabs.com/shipping\">Lead Times &amp; Handcrafted Quality</a>\" section. If the standard waiting time does not suit you, you can request our expedited assembly service (for details, see the \"<a href=\"https://filinlabs.com/shipping\">Priority Assembly Option</a>\" section). We also remind you that installment payment options are available for any product (see the \"<a href=\"https://filinlabs.com/shipping\">Installments</a>\" section).</td> </tr> <tr> <td><strong>Basic Configuration</strong></td> <td>The standard configuration (base product) includes the headphones, heavily-protected carrying case, stock solid-core copper cable (Premium Edition) with standard connectors (4-pin XLR output and mini xlr inputs), Set of Supplementary Acoustic Overlay Earpads for enhanced isolation and detail retrieval with no additional options.</td> </tr> <tr><td><strong>Acoustic Principle</strong></td><td>Closed-back Headphones</td></tr> <tr><td><strong>Headphone Type</strong></td><td>Monitor Planar Magnetic (Isodynamic)</td></tr> <tr><td><strong>Driver Type and Quantity</strong></td><td>Planar Magnetic (Isodynamic), 2 pcs. by Snorry Isodynamic with modifications of Evgeny Melentiev</td></tr> <tr><td><strong>Driver Modifications</strong></td><td>Enlarged ear cups and driver flanges; center offset forward and downward for perfect ear canal alignment; special tuning via sophisticated acoustic waveguides</td></tr> <tr><td><strong>High-Tech Technologies</strong></td><td>SAW Technology®</td></tr> <tr><td><strong>Impedance, Ohm</strong></td><td>40</td></tr> <tr><td><strong>Sensitivity, dB</strong></td><td>88</td></tr> <tr><td><strong>Frequency Response, Hz</strong></td><td>20Hz - 20 kHz</td></tr> <tr><td><strong>Amplifier requirements</strong></td><td>At least 3W per 40 Ohm. <b>These headphones are highly current-hungry; raw wattage is secondary.</b> Suitable High-Current Amplifiers are e.g. HeadAmp — GS-X MK2 / CFA3 / NAD M2 / Lyngdorf tdai-3400 etc.</td></tr> <tr><td><strong>Detachable Cable</strong></td><td>Yes</td></tr> <tr><td><strong>Stock Cable Material and Length</strong></td><td>High-purity solid-core copper cable (Premium Edition)</td></tr> <tr><td><strong>Housing and Headband Materials</strong></td><td>Aluminum, precious woods, leather</td></tr> <tr><td><strong>Internal Cup Wiring</strong></td><td>Custom 2.8mm² solid-core 4N (.999) jewelry-grade high-purity silver</td></tr> <tr><td><strong>Ear Pads</strong></td><td>Custom-designed, hand-stitched from genuine leather and fabric (Quadron Edition) + Set of Supplementary Acoustic Overlay Earpads for enhanced isolation and detail retrieval</td></tr> <tr><td><strong>Weight, g</strong></td><td>700</td></tr> <tr><td><strong>Warranty, Months</strong></td><td>36 months manufacturer warranty. Optional extended paid warranty available.</td></tr> </tbody> </table> </div> </div> <div class=\"tab-content\" id=\"Tuning &amp; Customization\" style=\"display:none;\"> <div class=\"content-container\"> <div class=\"options-list\"> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> Stock: No options</label> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> Custom Sound Tuning</label> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> Headband customization</label> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> Ear cup customization</label> </div> </div> </div> <div class=\"tab-content\" id=\"upgrades\" style=\"display:none;\"> <div class=\"content-container\"> <div class=\"options-list\"> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> Stock: No options</label> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> High-purity solid-core copper cable</label> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> Detachable 1.5mm² custom solid-core hybrid cable: copper + 4N (.999) jewelry-grade siver, uniquely polished and wound around a dielectric in multiple insulating jackets</label> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> Detachable 1.5mm² custom solid-core 4N (.999) jewelry-grade silver cable, uniquely polished and wound around a dielectric in multiple insulating jackets</label> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> Extra set of earpads</label> </div> </div> </div> <div class=\"tab-content\" id=\"Cable Output Plug\" style=\"display:none;\"> <div class=\"content-container\"> <div class=\"options-list\"> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> Stock: Mini Jack 3.5mm Plug</label> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> Jack 6.3mm Plug</label> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> 4.4mm balanced Pentaconn Plug</label> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> XLR 4-pin balanced Plug</label> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> Dual XLR 3-pin balanced Plugs</label> <label><input class=\"price-item\" data-price=\"0\" type=\"checkbox\"/> Top High-End Plug e.g. Acoustic Revive / Furutech, etc.</label> </div> </div> </div> <div class=\"tab-content\" id=\"cable-length\" style=\"display:none;\"> <div class=\"content-container\"> <div class=\"options-list\" style=\"max-width: 600px;\"> <label style=\"margin-bottom: 15px;\"> <input name=\"cable-type\" type=\"radio\" value=\"standard\"/> \n            Stock: Standard Cable Length (2.0 m)\n          </label> <label> <input name=\"cable-type\" type=\"radio\" value=\"custom\"/> \n            Custom Cable Length\n          </label> <div id=\"slider-wrapper\" style=\"display:none; margin-top: 15px; padding-left: 35px; width: 100%;\"> <label style=\"display: block; margin-bottom: 10px; cursor: default;\">\n              Select Length: <strong><span id=\"length-display\">2.0</span> m</strong> </label> <input id=\"length-slider\" max=\"5.0\" min=\"2.0\" step=\"0.1\" style=\"width: 100%; max-width: 350px; cursor: pointer;\" type=\"range\" value=\"2.0\"/> <div style=\"font-size: 15px; color: #b38b59; margin-top: 8px; font-weight: bold;\">\n              Extra cost: +$<span id=\"length-price-display\">0</span> </div> </div> </div> </div> </div> </div>"},"reviewsCTA":"View The Reviews of Filin Quadron","golden":{"backLabel":"Back to the Filin's lair","mobileHeroHeight":860,"resultLabel":"Ultimate Synergy"},"reviewsKey":"filin-audio-quadron"},"audioinstrument_grand_tower_speakers":{"schemaVersion":2,"slug":"audioinstrument_grand_tower_speakers","id":"audioinstrument-grand-tower","category":"speakers","currency":"USD","hero":{"staticH1":"Audioinstrument \"Grand Tower\": Flagship Sonido drivers Speakers","description":"An uncompromising three-way floorstanding loudspeaker system from Audioinstrument. Built around high-efficiency Hungarian Sonido midrange and low-frequency drivers paired with a premium P.Audio titanium compression tweeter.","background":""},"curator":"Handcrafted by Sergey Glazunov. Personally listened, approved & curated by R. Fayzullin. Filin Labs Kazakhstan.","overview":{"title":"Audioinstrument \"Grand Tower\" (Sonido & P.Audio Drivers)","html":"<p><strong>Experience ultimate sonic perfection.</strong> This premium loudspeaker system can be custom-built.</p><p>The <strong>Grand Tower</strong> is a reference-grade three-way floorstanding system engineered for massive dynamic scale, natural timbre and uncompromised realism.</p><h3>The Synergy of Sonido &amp; P.Audio Drivers</h3><p>High-efficiency Hungarian Sonido paper-cone midrange and low-frequency drivers are paired with a premium P.Audio titanium compression tweeter for scale, speed, organic harmonic density and extended high-frequency detail.</p>","galleryImages":["https://static.tildacdn.com/tild3864-3265-4531-a139-396261623961/MyCollages_1.jpg","https://static.tildacdn.com/tild3465-3837-4635-a464-313932643164/MyCollages_2.jpg","https://static.tildacdn.com/tild3332-3262-4537-b236-633035333834/149ebf4d-91dc-45e0-8.jpg","https://static.tildacdn.com/tild3537-3736-4533-b664-633131623535/bbf510da-5c27-4ace-b.jpg","https://static.tildacdn.com/tild6336-3263-4537-b638-313663633730/hd_0b379b5d94f71b82a.png","https://static.tildacdn.com/tild6666-3432-4962-b864-643539313165/hd_1b0edcaf9015af202.png","https://static.tildacdn.com/tild3762-3837-4733-b630-336634636163/hd_9af1dd67d043f1798.png","https://static.tildacdn.com/tild3363-3962-4133-b235-336336303335/hd_859404d7efec92315.jpeg","https://static.tildacdn.com/tild3933-6636-4165-a661-376134303664/hd_8693791966074e983.png"]},"curation":[{"title":"Category & Budget Tier","html":"<strong>Loudspeakers</strong><br/>Unlimited Edition (>$5000)"},{"title":"Tags & Features","html":"#Audioinstrument #Sonido drivers #P.Audio tweeter #floorstanding #high-sensitivity speakers"},{"title":"Sonic Signature","html":"<strong>AURA</strong> — warm, organic and timbrally rich, with deep harmonic textures and liquid analog musicality."},{"title":"Curator’s Choice","html":"Selected for its universal, immersive presentation and the unmistakable character of legendary paper-cone drivers."},{"title":"High Technologies","html":"Ultra-high sensitivity · Full-range transducer philosophy · Paper-cone driver purity."},{"title":"Synergy Match","html":"Tube & solid-state amplifiers · Delta-Sigma DACs · Silver cables."},{"title":"Genres Accord","html":"Vocal & Acoustic · Jazz · Blues · Symphonic music and other timbre-rich recordings."}],"commerce":{"basePrice":15000,"displayName":"Audioinstrument Grand Tower Speakers","cartName":"Audioinstrument Grand Tower Speakers (Standard Edition)","stickyTitle":"Audioinstrument \"Grand Tower\"","innerHTML":"\n<div class=\"purchase-container\">\n  <span class=\"js-product-name\" id=\"tilda-product-name\" style=\"display:none;\">Audioinstrument Grand Tower Speakers (Standard Edition)</span>\n  <div class=\"price-title\">Total*: $<span class=\"js-product-price\" id=\"main-price\">15000</span></div>\n  <a class=\"buy-btn js-product-btn\" href=\"#order\">Buy Now</a>\n  <div class=\"perfect-matches-block\">\n    <h4 class=\"pm-title\">Perfect Matches</h4>\n    <p class=\"pm-desc\">These high-sensitivity speakers reveal their true potential with pure Class A single-ended amplification and a solid-state DAC. To achieve the ultimate transparent presentation, we recommend this synergy:</p>\n    <div class=\"pm-formula\">\n<div class=\"pm-item pm-base\"><span>Audioinstrument Grand Tower</span></div>\n<span class=\"pm-plus\">+</span>\n<label class=\"pm-item\"><input class=\"price-item bundle-item\" data-price=\"0\" name=\"match_streamer\" type=\"checkbox\"/><span><a href=\"https://filinlabs.com/gerbera_tinker_audiophile_network_player_streamer_server_endpoint\">Gerbera Tinker Network Player</a></span></label>\n<span class=\"pm-plus\">+</span>\n<label class=\"pm-item\"><input class=\"price-item bundle-item\" data-price=\"0\" name=\"match_switch\" type=\"checkbox\"/><span><a href=\"https://filinlabs.com/gerbera_solero_network_switch_tube_clock\">Gerbera Solero Network Switch</a></span></label>\n<span class=\"pm-plus\">+</span>\n<label class=\"pm-item\"><input class=\"price-item bundle-item\" data-price=\"0\" name=\"match_dac\" type=\"checkbox\"/><span><a href=\"https://filinlabs.com/gerbera_pcm1794_dsd1794_dac_otis\">Gerbera Otis DSD1794 DAC</a></span></label>\n<span class=\"pm-plus\">+</span>\n<label class=\"pm-item\"><input class=\"price-item bundle-item\" data-price=\"0\" name=\"match_amp\" type=\"checkbox\"/><span><a href=\"https://filinlabs.com/audioinstrument_sirius_kt150_tube_amplifier\">Audioinstrument Sirius KT150</a></span></label>\n<span class=\"pm-plus\">+</span>\n<label class=\"pm-item\"><input class=\"price-item bundle-item\" data-price=\"0\" name=\"match_cable\" type=\"checkbox\"/><span><a href=\"https://filinlabs.com/konstantin_audio_a_1_synergy_speaker_cables\">Konstantin Audio A-1 Speaker Cables</a></span></label>\n<span class=\"pm-equals\">=</span>\n<div class=\"pm-result\">Ultimate Purity</div>\n</div>\n    <div class=\"pm-discount\" id=\"bundle-discount-msg\">Add recommended synergy components to get <b>5% OFF for EACH added device.</b></div>\n  </div>\n</div>\n<div class=\"tabs-wrapper\">\n  <div class=\"tabs-header\">\n    <button class=\"tab-btn active\" type=\"button\" onclick=\"showTab(event, 'desc')\">Key Features</button>\n    <button class=\"tab-btn\" type=\"button\" onclick=\"showTab(event, 'spec')\">Specification</button>\n  </div>\n  <div class=\"tab-content\" id=\"desc\"><div class=\"content-container\"><div class=\"description-content\">\n<h3>Sound Signature</h3>\n<ul>\n<li><strong>High Frequencies:</strong> Crystal-clear, extended, and deeply detailed via the P.Audio titanium dome, capturing real recording atmosphere without artificial glare.</li>\n<li><strong>Midrange:</strong> Sweet, rich, dense, and highly articulate thanks to the legendary 8\" Sonido paper membrane.</li>\n<li><strong>Low Frequencies:</strong> A whipping, authoritative, and deep bassline driven by the massive 15\" Sonido woofer. The bass reflex design allows the system to breathe effortlessly down to an authentic 25 Hz.</li>\n<li><strong>Soundstage:</strong> Immense depth, scale, and holographic imaging achieved through precise time-aligned driver geometry.</li>\n</ul>\n<h3>Advanced Crossover Engineering</h3>\n<p>The system utilizes ultra-precise 2nd-order separation filters tuned exactly to 200 Hz and 6 kHz. The heavily internal matrix bracing of the cabinet suppresses structural panel resonance, allowing this massive 100 kg system to completely dissolve into your listening room.</p>\n</div></div></div>\n  <div class=\"tab-content\" id=\"spec\" style=\"display:none;\"><div class=\"content-container\"><table class=\"specs-table\">\n<tbody>\n<tr>\n<td><strong>Total Price*</strong></td>\n<td>The price is for the base product only and does not include shipping or selected optional upgrades. To get a complete final quote, please submit your request to our consultant via email at <a href=\"mailto:shop@filinlabs.com\">shop@filinlabs.com</a> or via <a href=\"https://t.me/filinlabs\" target=\"_blank\">Telegram</a>. We will send you an invoice &amp; full costs calculation in the reply message.</td>\n</tr>\n<tr><td><strong>Lead Times</strong></td><td>You can check the lead times for each item in the \"<a href=\"https://filinlabs.com/shipping\">Lead Times &amp; Handcrafted Quality</a>\" section. If the standard waiting time does not suit you, you can request our expedited assembly service (for details, see the \"<a href=\"https://filinlabs.com/shipping\">Priority Assembly Option</a>\" section). We also remind you that installment payment options are available for any product (see the \"<a href=\"https://filinlabs.com/shipping\">Installments</a>\" section).</td></tr>\n<tr><td><strong>Basic Configuration</strong></td><td>\n  The standard configuration (base product) includes 3-way Audioinstrument Grand Tower Speakers with no additional options.    \n  </td></tr>\n<tr><td>Placement</td><td>Floorstanding</td></tr>\n<tr><td>Number of Bands</td><td>3</td></tr>\n<tr><td>Sensitivity</td><td>95 dB (1 Watt / 1m)</td></tr>\n<tr><td>Frequency Response</td><td>25 Hz – 35,000 Hz (-4 dB)</td></tr>\n<tr><td>Impedance</td><td>8 Ohms</td></tr>\n<tr><td>Crossover Frequencies</td><td>200 Hz / 6,000 Hz</td></tr>\n<tr><td>Filters</td><td>2nd-order network on each driver band</td></tr>\n<tr><td>LF Driver</td><td>Sonido 15\" (Acoustic design: rear bass reflex)</td></tr>\n<tr><td>MF Driver</td><td>Sonido 8\" (Time-aligned directional vertical placement)</td></tr>\n<tr><td>HF Driver</td><td>P.Audio (Titanium compression dome driver)</td></tr>\n<tr><td>Binding Posts</td><td>Pure Copper terminals</td></tr>\n<tr><td>Dimensions (H × W × D)</td><td>2000 × 650 × 650 mm</td></tr>\n<tr><td>Weight</td><td>From 100 kg (per speaker)</td></tr>\n<tr><td><strong>Limited Warranty</strong></td><td>You can find information about Warranty by visiting <a href=\"https://filinlabs.com/warranty\">Warranty &amp; Returns Policy</a> page</td></tr>\n</tbody>\n</table></div></div>\n</div>\n"},"reviewsCTA":"View The Reviews of Audioinstrument Grand Tower","reviewsQuery":"Audioinstrument Grand Tower","reviewsIntro":"Share your listening experience with Audioinstrument \"Grand Tower\".","golden":{"backLabel":"Back to the Filin's nest","mobileHeroHeight":860,"resultLabel":"Ultimate Purity"},"reviewsKey":"audioinstrument-grand-tower"}};

  function norm(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}
  function esc(v){return String(v==null?'':v).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c];});}
  function readSeed(){
    try{var n=document.getElementById('product-data');return n?JSON.parse(n.textContent||'{}'):{};}catch(e){console.error('[Master Product V3] invalid #product-data',e);return {};}
  }
  function slug(){return norm(readSeed().slug);}
  function profile(){return PROFILES[slug()]||null;}
  function money(v){return '$'+Number(v||0).toLocaleString('en-US',{maximumFractionDigits:0});}
  function directChildren(node,sel){return node?Array.prototype.filter.call(node.children,function(x){return x.matches&&x.matches(sel);}):[];}

  function installCSS(){
    var old=document.getElementById(STYLE_ID); if(old) old.remove();
    var s=document.createElement('style'); s.id=STYLE_ID;
    s.textContent=`
      html[data-filin-master-v3="1"] body,
      html[data-filin-master-v3="1"] #${ROOT_ID},
      html[data-filin-master-v3="1"] #${ROOT_ID} *{box-sizing:border-box!important;font-family:'Montserrat',Arial,sans-serif!important}
      .fp-v3-legacy-record{display:none!important;visibility:hidden!important;height:0!important;min-height:0!important;max-height:0!important;margin:0!important;padding:0!important;overflow:hidden!important}
      #${ROOT_ID}{--v3-bg:#fffbf7;--v3-ink:#171512;--v3-muted:#69615a;--v3-gold:#bc8c5e;--v3-line:#151515;display:block;width:100%;margin:0;padding:0;background:var(--v3-bg);color:var(--v3-ink)}
      #${ROOT_ID} a{color:inherit}
      #${ROOT_ID} .v3-shell{width:100%;margin:0 auto;background:var(--v3-bg)}
      #${ROOT_ID} .v3-product-grid{display:grid;grid-template-columns:minmax(0,1.12fr) minmax(380px,.88fr);gap:0;width:100%;border-bottom:0;background:var(--v3-bg)}
      #${ROOT_ID} .v3-gallery{position:relative;min-width:0;padding:26px 18px 26px 42px;background:var(--v3-bg)}
      #${ROOT_ID} .v3-stage{position:relative;width:100%;aspect-ratio:1.42/1;overflow:hidden;background:#f2eee9;border-radius:0}
      #${ROOT_ID} .v3-stage img{display:block;width:100%;height:100%;object-fit:cover;object-position:center}
      #${ROOT_ID} .v3-gallery-arrow{position:absolute;top:50%;z-index:4;width:42px;height:42px;display:grid;place-items:center;border:1px solid #ddd0c0;border-radius:50%;background:rgba(255,255,255,.9);color:#76624c;font-size:27px;line-height:1;cursor:pointer;transform:translateY(-50%)}
      #${ROOT_ID} .v3-prev{left:14px} #${ROOT_ID} .v3-next{right:14px}
      #${ROOT_ID} .v3-fav{position:absolute;right:18px;top:18px;z-index:5;width:38px;height:38px;border:1px solid rgba(255,255,255,.45);border-radius:50%;background:rgba(20,18,15,.72);color:#fff;font-size:19px;cursor:pointer}
      #${ROOT_ID} .v3-thumbs{display:flex;gap:7px;margin-top:8px;overflow-x:auto;padding-bottom:3px;scrollbar-width:thin}
      #${ROOT_ID} .v3-thumb{flex:0 0 70px;width:70px;height:52px;padding:0;border:1px solid #ddd3c8;background:#fff;opacity:.72;cursor:pointer;overflow:hidden}
      #${ROOT_ID} .v3-thumb.active{opacity:1;border-color:var(--v3-gold)} #${ROOT_ID} .v3-thumb img{width:100%;height:100%;object-fit:cover}
      #${ROOT_ID} .v3-overview{padding:32px 46px 30px 26px;min-width:0;background:var(--v3-bg)}
      #${ROOT_ID} .v3-overview h2{margin:0 0 15px;color:#111;font-size:26px;line-height:1.24;font-weight:750;letter-spacing:-.02em}
      #${ROOT_ID} .v3-overview h3{margin:22px 0 8px;padding-left:10px;border-left:3px solid var(--v3-gold);font-size:18px;line-height:1.28;font-weight:750}
      #${ROOT_ID} .v3-overview p,#${ROOT_ID} .v3-overview li{margin:0 0 13px;font-size:14px;line-height:1.62;font-weight:400}
      #${ROOT_ID} .v3-overview ul{margin:0 0 13px;padding-left:19px}
      #${ROOT_ID} .v3-divider{width:100%;height:2px;margin:0;padding:0;border:0;background:linear-gradient(90deg,transparent 0%,#111 7%,#111 42%,#bc8c5e 42%,#bc8c5e 58%,#111 58%,#111 93%,transparent 100%);opacity:.95}
      #${ROOT_ID} .v3-commerce{width:100%;padding:10px 42px 34px;background:var(--v3-bg)}
      #${ROOT_ID} .v3-native-price{display:none!important}
      #${ROOT_ID} .v3-buy{position:relative;width:100%;min-height:118px;display:flex;align-items:center;justify-content:center;gap:20px;margin:0;padding:20px 32px;border:2px solid #76502d;border-radius:0;background:linear-gradient(115deg,#81572f 0%,#a97543 14%,#c59661 31%,#e3c28f 45%,#f1d6a7 50%,#d4a66d 58%,#a97543 78%,#81572f 100%);color:#fff;text-decoration:none;text-transform:uppercase;font-size:31px;line-height:1;font-weight:800;letter-spacing:.02em;box-shadow:inset 0 0 0 1px rgba(255,255,255,.72),inset 0 0 0 5px rgba(115,72,34,.28)}
      #${ROOT_ID} .v3-buy:before{content:"";position:absolute;inset:8px;border:1px solid rgba(255,247,229,.72);pointer-events:none}
      #${ROOT_ID} .v3-buy-label,#${ROOT_ID} .v3-buy-price{position:relative;z-index:2;white-space:nowrap}
      #${ROOT_ID} .v3-buy-price{text-transform:none}
      #${ROOT_ID} .v3-pm{width:100%;margin:28px 0 34px;border:2px solid #151515;border-radius:14px;background:var(--v3-bg);overflow:hidden}
      #${ROOT_ID} .v3-pm-toggle{display:grid;grid-template-columns:minmax(0,1fr) 38px;align-items:center;gap:14px;width:100%;min-height:78px;padding:16px 18px;border:0;background:transparent;text-align:left;cursor:pointer}
      #${ROOT_ID} .v3-pm-copy{display:grid;gap:4px;min-width:0} #${ROOT_ID} .v3-pm-kicker{color:#a97943;font-size:11px;line-height:1;font-weight:800;letter-spacing:.04em;text-transform:uppercase}
      #${ROOT_ID} .v3-pm-note{font-size:12px;line-height:1.35;color:#5f5851} #${ROOT_ID} .v3-pm-note b{color:#111}
      #${ROOT_ID} .v3-pm-icon{width:34px;height:34px;display:grid;place-items:center;border:1px solid #d5b183;border-radius:50%;color:#9c6e39;font-size:21px;line-height:1;transition:transform .18s ease}
      #${ROOT_ID} .v3-pm.open .v3-pm-icon{transform:rotate(180deg)}
      #${ROOT_ID} .v3-pm-body{display:none;padding:0 22px 24px} #${ROOT_ID} .v3-pm.open .v3-pm-body{display:block}
      #${ROOT_ID} .v3-pm-desc{margin:0 0 14px;color:#6a625a;font-size:12px;line-height:1.5;text-align:center}
      #${ROOT_ID} .v3-pm-formula{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px;padding:0 0 4px}
      #${ROOT_ID} .v3-pm-item,#${ROOT_ID} .v3-pm-result{display:inline-flex;align-items:center;gap:8px;min-height:42px;padding:9px 14px;border:1px solid #d9c8b5;border-radius:6px;background:#fff;color:#ff725b;font-size:14px;font-weight:600}
      #${ROOT_ID} .v3-pm-base{background:#efefef;color:#666} #${ROOT_ID} .v3-pm-result{background:#bc8c5e;color:#fff;border-color:#a77b48}
      #${ROOT_ID} .v3-pm-plus,#${ROOT_ID} .v3-pm-equals{color:#999;font-weight:800}
      #${ROOT_ID} .v3-tabs{width:min(1320px,calc(100% - 220px));margin:0 auto 34px;background:var(--v3-bg)}
      #${ROOT_ID} .v3-tabbar{display:flex;width:100%;border:2px solid #151515;border-radius:14px;overflow:hidden}
      #${ROOT_ID} .v3-tabbtn{flex:1 1 0;min-height:62px;padding:13px 10px;border:0;border-right:1px solid #777;background:#f2ece6;color:#777;font-size:12px;line-height:1.2;font-weight:750;text-transform:uppercase;cursor:pointer}
      #${ROOT_ID} .v3-tabbtn:last-child{border-right:0} #${ROOT_ID} .v3-tabbtn.active{color:#a97943;background:#fffbf7;box-shadow:inset 0 -3px 0 #bc8c5e}
      #${ROOT_ID} .v3-count{display:inline-flex;min-width:24px;height:22px;margin-left:6px;align-items:center;justify-content:center;padding:0 6px;border-radius:999px;background:#f1e3d1;color:#8c673f;font-size:11px}
      #${ROOT_ID} .v3-panels{padding-top:26px} #${ROOT_ID} .v3-panel{display:none} #${ROOT_ID} .v3-panel.active{display:block}
      #${ROOT_ID} .v3-panel .content-container{width:100%;padding:0 54px 18px}
      #${ROOT_ID} .v3-panel .description-content h3{margin:20px 0 10px;padding-left:10px;border-left:3px solid var(--v3-gold);font-size:20px;line-height:1.25}
      #${ROOT_ID} .v3-panel p,#${ROOT_ID} .v3-panel li,#${ROOT_ID} .v3-panel td,#${ROOT_ID} .v3-panel label{font-size:14px;line-height:1.55}
      #${ROOT_ID} .v3-panel .specs-table{width:100%;border-collapse:collapse} #${ROOT_ID} .v3-panel .specs-table td{padding:14px 12px;border-bottom:1px solid #e8ded3;vertical-align:top} #${ROOT_ID} .v3-panel .specs-table td:first-child{width:28%;font-weight:700}
      #${ROOT_ID} .v3-mobile-tabbtn{display:none}
      #${ROOT_ID} .v3-curation-wrap{width:calc(100% - 32px);margin:12px 16px 32px;padding:0;border:2px solid #151515;border-radius:14px;background:var(--v3-bg);overflow:hidden}
      #${ROOT_ID} .v3-curation{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));width:100%}
      #${ROOT_ID} .v3-curation-item{display:grid;grid-template-columns:28px minmax(0,1fr);gap:12px;align-items:start;min-height:112px;padding:20px 18px;border-right:1px solid #e2d8cd;border-bottom:1px solid #e2d8cd}
      #${ROOT_ID} .v3-curation-item:nth-child(4n){border-right:0} #${ROOT_ID} .v3-curation-item:nth-last-child(-n+4){border-bottom:0}
      #${ROOT_ID} .v3-curation-icon{width:26px;height:26px;display:grid;place-items:center;border:1px solid #c5a478;border-radius:50%;color:#9b7042;font-size:12px;font-weight:800}
      #${ROOT_ID} .v3-curation-item h3{margin:0 0 7px;font-size:11px;line-height:1.25;font-weight:800;text-transform:uppercase} #${ROOT_ID} .v3-curation-item p{margin:0;color:#504a45;font-size:11px;line-height:1.45}
      #${ROOT_ID} .v3-promotions{width:calc(100% - 140px);margin:0 auto 24px;padding:0 14px 24px;border:2px solid #151515;border-radius:14px;background:var(--v3-bg);overflow:hidden}
      #${ROOT_ID} .v3-promotions h2{margin:0;padding:18px 0 14px;text-align:center;font-size:13px;letter-spacing:.05em;text-transform:uppercase}
      #${ROOT_ID} .v3-promo-track{display:grid;grid-auto-flow:column;grid-auto-columns:calc((100% - 48px)/5);gap:12px;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:8px;scrollbar-width:thin}
      #${ROOT_ID} .v3-promo{scroll-snap-align:start;display:flex;flex-direction:column;min-width:0;padding:0 0 12px;background:#fff;border:1px solid #ded5cb}
      #${ROOT_ID} .v3-promo img{width:100%;aspect-ratio:1/1;object-fit:cover;background:#eee} #${ROOT_ID} .v3-promo-copy{display:grid;gap:6px;padding:9px 9px 0;text-align:center} #${ROOT_ID} .v3-promo-title{min-height:34px;font-size:10px;line-height:1.25;font-weight:650} #${ROOT_ID} .v3-promo-price{font-size:12px;color:#d36b52;font-weight:800} #${ROOT_ID} .v3-promo a{display:inline-flex;align-self:center;justify-content:center;min-width:70px;padding:6px 11px;border-radius:999px;background:#bc8c5e;color:#fff;text-decoration:none;font-size:9px;font-weight:750;text-transform:uppercase}
      @media (max-width:${MAX_MOBILE}px){
        .fp-v3-hero-cover,.fp-v3-hero-cover .t-cover__carrier,.fp-v3-hero-cover .t-cover__filter,.fp-v3-hero-cover .t-cover__wrapper{height:var(--fp-v3-mobile-hero,860px)!important;min-height:var(--fp-v3-mobile-hero,860px)!important;max-height:var(--fp-v3-mobile-hero,860px)!important}
        .fp-v3-hero-cover{position:relative!important;overflow:hidden!important}.fp-v3-hero-cover .t-cover__carrier{background-position:center center!important;background-size:cover!important;background-attachment:scroll!important}
        .fp-v3-hero-cover .t184__uptitle,.fp-v3-hero-cover .t184__title,.fp-v3-hero-cover .t184__descr{display:none!important}
        #fp-v3-hero-overlay{position:absolute!important;inset:0!important;z-index:30!important;display:flex!important;flex-direction:column!important;align-items:center!important;height:100%!important;padding:24px 18px 30px!important;color:#fff!important;text-align:center!important;pointer-events:none!important}
        #fp-v3-hero-back{position:absolute!important;top:62px!important;left:0!important;right:0!important;width:100%!important;padding:0 16px!important;color:#fff!important;font-size:13px!important;line-height:1.3!important;text-decoration:underline!important;text-underline-offset:3px!important;pointer-events:auto!important;text-shadow:0 2px 8px #000!important}
        #fp-v3-hero-h1{width:100%!important;max-width:385px!important;margin:205px auto 0!important;color:#fff!important;font-size:22px!important;line-height:1.28!important;font-weight:780!important;text-shadow:0 2px 9px rgba(0,0,0,.95)!important}
        #fp-v3-hero-desc{width:100%!important;max-width:365px!important;margin:auto auto 8px!important;color:#fff!important;font-size:12.5px!important;line-height:1.43!important;font-weight:550!important;text-shadow:0 2px 8px rgba(0,0,0,.98)!important}
        .fp-v3-curator-record{padding:28px 16px!important;background:#000!important}.fp-v3-curator-record,.fp-v3-curator-record *{color:#fff!important}.fp-v3-curator-text{display:block!important;width:100%!important;max-width:390px!important;margin:0 auto!important;font-size:14px!important;line-height:1.46!important;font-weight:650!important;font-style:italic!important;text-align:center!important}
        #${ROOT_ID} .v3-product-grid{display:block} #${ROOT_ID} .v3-gallery{padding:20px 22px 8px} #${ROOT_ID} .v3-stage{aspect-ratio:1/1} #${ROOT_ID} .v3-thumbs{display:none}
        #${ROOT_ID} .v3-gallery-arrow{width:38px;height:38px;font-size:23px} #${ROOT_ID} .v3-prev{left:10px} #${ROOT_ID} .v3-next{right:10px}
        #${ROOT_ID} .v3-overview{padding:14px 22px 28px} #${ROOT_ID} .v3-overview h2{font-size:20px;line-height:1.25;margin-bottom:11px} #${ROOT_ID} .v3-overview h3{margin:18px 0 7px;font-size:16px} #${ROOT_ID} .v3-overview p,#${ROOT_ID} .v3-overview li{font-size:13px;line-height:1.55}
        #${ROOT_ID} .v3-commerce{padding:0 16px 22px} #${ROOT_ID} .v3-divider{margin:23px 0}
        #${ROOT_ID} .v3-buy{min-height:88px;border-radius:12px;padding:18px 80px 18px 18px;gap:0;font-size:27px} #${ROOT_ID} .v3-buy-label{font-size:27px} #${ROOT_ID} .v3-buy-price{position:absolute;right:18px;top:50%;height:32px;display:inline-flex;align-items:center;padding-left:13px;border-left:1px solid rgba(255,255,255,.55);font-size:11px;transform:translateY(-50%)}
        #${ROOT_ID} .v3-pm{margin:14px 0 38px;border:1px solid #d9c7b3;border-radius:10px} #${ROOT_ID} .v3-pm-toggle{min-height:66px;padding:13px 15px} #${ROOT_ID} .v3-pm-body{padding:0 14px 18px} #${ROOT_ID} .v3-pm-desc{font-size:12px;text-align:left;padding:0 2px}
        #${ROOT_ID} .v3-pm-formula{display:grid;grid-template-columns:1fr;gap:8px} #${ROOT_ID} .v3-pm-plus,#${ROOT_ID} .v3-pm-equals{display:none} #${ROOT_ID} .v3-pm-item,#${ROOT_ID} .v3-pm-result{width:100%;justify-content:flex-start;border-radius:8px;font-size:12px} #${ROOT_ID} .v3-pm-result{justify-content:center}
        #${ROOT_ID} .v3-tabs{width:100%;margin:0 0 26px;padding:0} #${ROOT_ID} .v3-tabbar{display:none} #${ROOT_ID} .v3-panels{padding:0}
        #${ROOT_ID} .v3-mobile-tabbtn{display:grid;grid-template-columns:minmax(0,1fr) 32px;align-items:center;width:100%;min-height:56px;margin:6px 0 0;padding:13px 12px;border:2px solid #151515;border-radius:10px;background:#f1ebe5;color:#6f6d6a;font-size:12px;line-height:1.2;font-weight:750;text-transform:uppercase;text-align:left;cursor:pointer}
        #${ROOT_ID} .v3-mobile-tabbtn:after{content:'+';display:grid;place-items:center;width:28px;height:28px;border:1px solid #555;border-radius:50%;font-size:18px;font-weight:400;justify-self:end} #${ROOT_ID} .v3-mobile-tabbtn.active{color:#a97943;background:#fffbf7} #${ROOT_ID} .v3-mobile-tabbtn.active:after{content:'−'}
        #${ROOT_ID} .v3-panel{display:none;padding:0} #${ROOT_ID} .v3-panel.active{display:block} #${ROOT_ID} .v3-panel .content-container{padding:18px 12px} #${ROOT_ID} .v3-panel p,#${ROOT_ID} .v3-panel li,#${ROOT_ID} .v3-panel td,#${ROOT_ID} .v3-panel label{font-size:13px!important;line-height:1.55!important} #${ROOT_ID} .v3-panel .specs-table,#${ROOT_ID} .v3-panel .specs-table tbody,#${ROOT_ID} .v3-panel .specs-table tr,#${ROOT_ID} .v3-panel .specs-table td{display:block;width:100%} #${ROOT_ID} .v3-panel .specs-table td:first-child{width:100%;padding-bottom:4px;border-bottom:0} #${ROOT_ID} .v3-panel .specs-table td:last-child{padding-top:4px}
        #${ROOT_ID} .v3-curation-wrap{width:calc(100% - 24px);margin:28px 12px 30px} #${ROOT_ID} .v3-curation{display:block} #${ROOT_ID} .v3-curation-item{min-height:0;padding:17px 12px;border-right:0;border-bottom:1px solid #e2d8cd} #${ROOT_ID} .v3-curation-item:last-child{border-bottom:0} #${ROOT_ID} .v3-curation-item h3{font-size:12px} #${ROOT_ID} .v3-curation-item p{font-size:12px;line-height:1.5}
        #${ROOT_ID} .v3-promotions{width:calc(100% - 24px);margin:0 12px 24px;padding:0 10px 18px} #${ROOT_ID} .v3-promo-track{grid-auto-columns:calc((100% - 10px)/2);gap:10px} #${ROOT_ID} .v3-promotions h2{font-size:12px;padding:14px 0 12px}
      }
      @media(min-width:821px){
        #${ROOT_ID} .v3-pm.open .v3-pm-toggle{width:fit-content;max-width:760px;grid-template-columns:auto 38px;margin:0;padding:16px 18px}
        #${ROOT_ID} .v3-pm.open{padding-bottom:10px}
      }
    `;
    document.head.appendChild(s);
  }

  function locateHero(p){
    var titles=Array.prototype.slice.call(document.querySelectorAll('.t184__title,h1'));
    var h=titles.find(function(x){var t=norm(x.textContent); return t && (t.indexOf(norm(p.hero.staticH1))>=0 || /Grand Tower|Quadron/i.test(t));}) || titles[0];
    if(!h) return null;
    var rec=h.closest('.t-rec,[id^="rec"]')||h.parentElement;
    var cover=h.closest('.t-cover')||(rec&&rec.querySelector('.t-cover'));
    return {h:h,rec:rec,cover:cover};
  }
  function bindHero(p){
    var x=locateHero(p); if(!x) return false;
    x.h.textContent=p.hero.staticH1;
    var d=x.rec&&x.rec.querySelector('.t184__descr'); if(d) d.textContent=p.hero.description||'';
    var u=x.rec&&x.rec.querySelector('.t184__uptitle'); if(u && /Back to/i.test(norm(u.textContent))) u.textContent=(p.golden&&p.golden.backLabel)||norm(u.textContent);
    var carrier=x.rec&&x.rec.querySelector('.t-cover__carrier,[id^="coverCarry"]');
    if(carrier && p.hero.background){carrier.style.setProperty('background-image','url("'+String(p.hero.background).replace(/"/g,'\\"')+'")','important');carrier.setAttribute('data-content-cover-bg',p.hero.background);}
    if(x.cover){x.cover.classList.add('fp-v3-hero-cover');x.cover.style.setProperty('--fp-v3-mobile-hero',String((p.golden&&p.golden.mobileHeroHeight)||860)+'px');}
    var old=document.getElementById('fp-v3-hero-overlay'); if(old) old.remove();
    if(x.cover){
      var nativeBack=x.rec&&x.rec.querySelector('.t184__uptitle a,a.t184__uptitle');
      var backHref=nativeBack&&nativeBack.getAttribute('href')?nativeBack.getAttribute('href'):'#';
      var o=document.createElement('div');o.id='fp-v3-hero-overlay';
      o.innerHTML='<a id="fp-v3-hero-back" href="'+esc(backHref)+'">'+esc((p.golden&&p.golden.backLabel)||'Back')+'</a><div id="fp-v3-hero-h1">'+esc(p.hero.staticH1)+'</div><div id="fp-v3-hero-desc">'+esc(p.hero.description||'')+'</div>';
      x.cover.appendChild(o);
    }
    return true;
  }

  function bindCurator(p){
    var nodes=Array.prototype.slice.call(document.querySelectorAll('.t051__text,.t-text,p,div,em'));
    var leaf=nodes.filter(function(n){if(n.children&&n.children.length>3)return false;return /^Handcrafted by/i.test(norm(n.textContent));}).sort(function(a,b){return norm(a.textContent).length-norm(b.textContent).length;})[0];
    if(!leaf) return false;
    leaf.textContent=p.curator||leaf.textContent; leaf.classList.add('fp-v3-curator-text');
    var rec=leaf.closest('.t-rec,[id^="rec"]');if(rec) rec.classList.add('fp-v3-curator-record');
    return true;
  }

  function parseCommerce(p){
    var box=document.createElement('div'); box.innerHTML=p.commerce.innerHTML||'';
    var pm=box.querySelector('.perfect-matches-block'); var tabs=box.querySelector('.tabs-wrapper');
    return {box:box,pm:pm,tabs:tabs};
  }
  function snapshotLegacyReviews(){
    var list=Array.prototype.slice.call(document.querySelectorAll('.tab-content#reviews,#reviews.tab-content'));
    return list[0]||null;
  }
  function snapshotLegacyCuration(){return document.querySelector('.fp-curation');}

  function quarantineLegacy(){
    var roots=Array.prototype.slice.call(document.querySelectorAll('.js-product')).filter(function(n){return !n.closest('#'+ROOT_ID);});
    roots.forEach(function(n){var rec=n.closest('.t-rec,[id^="rec"]');(rec||n).classList.add('fp-v3-legacy-record');});
    Array.prototype.slice.call(document.querySelectorAll('.fp-product-overview,.fp-curation')).forEach(function(n){if(n.closest('#'+ROOT_ID))return;var rec=n.closest('.t-rec,[id^="rec"]');(rec||n).classList.add('fp-v3-legacy-record');});
  }

  function galleryHTML(p){
    var imgs=(p.overview&&p.overview.galleryImages)||[];if(!imgs.length) imgs=[p.hero.background].filter(Boolean);
    if(!imgs.length) return '<div class="v3-gallery"><div class="v3-stage"></div></div>';
    return '<div class="v3-gallery"><div class="v3-stage"><img class="v3-main-img" src="'+esc(imgs[0])+'" alt="'+esc(p.commerce.displayName)+'"><button class="v3-fav" type="button" aria-label="Add to wishlist">♡</button><button class="v3-gallery-arrow v3-prev" type="button" aria-label="Previous image">‹</button><button class="v3-gallery-arrow v3-next" type="button" aria-label="Next image">›</button></div><div class="v3-thumbs">'+imgs.map(function(u,i){return '<button class="v3-thumb '+(i===0?'active':'')+'" type="button" data-i="'+i+'"><img src="'+esc(u)+'" alt=""></button>';}).join('')+'</div></div>';
  }

  function pmData(p){
    var c=parseCommerce(p), b=c.pm; if(!b) return null;
    var items=Array.prototype.slice.call(b.querySelectorAll('.pm-item'));
    var base=items.filter(function(x){return x.classList.contains('pm-base');})[0];
    var addons=items.filter(function(x){return !x.classList.contains('pm-base');}).map(function(x){var a=x.querySelector('a');return {text:norm(a?a.textContent:x.textContent),href:a?a.getAttribute('href'):'#'};});
    var result=b.querySelector('.pm-result'); return {desc:norm((b.querySelector('.pm-desc')||{}).textContent),base:norm(base&&base.textContent),addons:addons,result:norm(result&&result.textContent)||((p.golden&&p.golden.resultLabel)||'Ultimate Synergy')};
  }
  function pmHTML(p){
    var d=pmData(p); if(!d) return '';
    var note='Add recommended synergy components to get <b>5% OFF for EACH added device.</b>';
    return '<section class="v3-pm"><button class="v3-pm-toggle" type="button" aria-expanded="false"><span class="v3-pm-copy"><span class="v3-pm-kicker">Perfect Matches</span><span class="v3-pm-note">'+note+'</span></span><span class="v3-pm-icon">⌄</span></button><div class="v3-pm-body"><p class="v3-pm-desc">'+esc(d.desc)+'</p><div class="v3-pm-formula"><span class="v3-pm-item v3-pm-base">'+esc(d.base)+'</span>'+d.addons.map(function(x){return '<span class="v3-pm-plus">+</span><label class="v3-pm-item"><input class="v3-bundle" type="checkbox"><a href="'+esc(x.href||'#')+'">'+esc(x.text)+'</a></label>';}).join('')+'<span class="v3-pm-equals">=</span><span class="v3-pm-result">'+esc(d.result)+'</span></div></div></section>';
  }

  function extractTabs(p){
    var c=parseCommerce(p), tabs=c.tabs; if(!tabs) return [];
    var btns=Array.prototype.slice.call(tabs.querySelectorAll('.tabs-header .tab-btn'));
    var panels=Array.prototype.slice.call(tabs.querySelectorAll('.tab-content'));
    return btns.map(function(b,i){
      var id=(b.dataset&&b.dataset.fpTarget)||''; var oc=b.getAttribute('onclick')||'';var m=oc.match(/showTab\s*\(\s*event\s*,\s*['"]([^'"]+)['"]/); if(!id&&m)id=m[1];
      var panel=panels.find(function(x){return x.id===id;})||panels[i]||null;
      return panel?{id:id||('tab-'+i),label:norm(b.textContent),html:panel.innerHTML}:null;
    }).filter(Boolean);
  }

  function buildTabs(p,reviewsNode){
    var tabs=extractTabs(p);
    if(reviewsNode){
      if(!tabs.some(function(t){return t.id==='reviews';})) tabs.push({id:'reviews',label:'Reviews',node:reviewsNode});
    }
    var bar='<div class="v3-tabbar">'+tabs.map(function(t,i){return '<button type="button" class="v3-tabbtn '+(i===0?'active':'')+'" data-tab="'+esc(t.id)+'">'+esc(t.label)+(t.id==='reviews'?' <span class="v3-count">0</span>':'')+'</button>';}).join('')+'</div>';
    var panels='<div class="v3-panels">'+tabs.map(function(t,i){return '<button type="button" class="v3-mobile-tabbtn '+(i===0?'active':'')+'" data-tab="'+esc(t.id)+'"><span>'+esc(t.label)+(t.id==='reviews'?' <span class="v3-count">0</span>':'')+'</span></button><section class="v3-panel '+(i===0?'active':'')+'" data-panel="'+esc(t.id)+'">'+(t.node?'':'<div class="v3-panel-inner">'+t.html+'</div>')+'</section>';}).join('')+'</div>';
    return {html:'<section class="v3-tabs">'+bar+panels+'</section>',tabs:tabs};
  }

  function curationHTML(p,legacyCur){
    var arr=(p.curation||[]).slice();
    if(!arr.length && legacyCur){
      arr=Array.prototype.slice.call(legacyCur.querySelectorAll('.fp-curation-item')).map(function(x){var h=x.querySelector('h3');var c=x.querySelector('.fp-curation-copy');return {title:norm(h&&h.textContent),html:c?Array.prototype.filter.call(c.children,function(n){return n.tagName!=='H3';}).map(function(n){return n.outerHTML;}).join(''):''};});
    }
    if(!arr.length) return '';
    return '<section class="v3-curation-wrap"><div class="v3-curation">'+arr.map(function(x,i){return '<article class="v3-curation-item"><div class="v3-curation-icon">'+(i+1)+'</div><div><h3>'+esc(x.title)+'</h3><p>'+String(x.html||'')+'</p></div></article>';}).join('')+'</div></section>';
  }

  function promoProducts(p){
    var seen={}; var out=[]; var cat=window.ProductCatalog&&window.ProductCatalog.products;
    if(cat){Object.keys(cat).forEach(function(k){var x=cat[k];if(!x||!x.name||!Number(x.price)||x.id===p.id)return;var key=norm(x.name).toLowerCase();if(seen[key])return;seen[key]=1;out.push(x);});}
    if(!out.length && window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products){Object.keys(window.FilinRichCatalogV2.products).forEach(function(k){var x=window.FilinRichCatalogV2.products[k];if(!x||!x.name||!Number(x.price)||k===p.slug)return;out.push({name:x.name,price:x.price,url:x.url||('/'+k),images:x.images||[]});});}
    return out.slice(0,12);
  }
  function promotionsHTML(p){
    var xs=promoProducts(p); if(!xs.length)return '';
    return '<section class="v3-promotions"><h2>Promotions</h2><div class="v3-promo-track">'+xs.map(function(x){var img=(x.images&&x.images[0])||x.image||'';return '<article class="v3-promo">'+(img?'<img src="'+esc(img)+'" alt="'+esc(x.name)+'">':'<div style="aspect-ratio:1/1;background:#eee"></div>')+'<div class="v3-promo-copy"><div class="v3-promo-title">'+esc(x.name)+'</div><div class="v3-promo-price">'+money(x.price)+'</div><a href="'+esc(x.url||x.path||'#')+'">View</a></div></article>';}).join('')+'</div></section>';
  }

  function updateSticky(p){
    var changed=0;
    Array.prototype.slice.call(document.querySelectorAll('body *')).forEach(function(el){if(el.children.length)return;var t=norm(el.textContent);if(!t||t.length>160)return;var parent=el;var sticky=false;for(var i=0;i<6&&parent;i++,parent=parent.parentElement){var pos=getComputedStyle(parent).position;if(pos==='fixed'||pos==='sticky'){sticky=true;break;}}if(!sticky)return;
      if(/Grand Tower|Quadron/i.test(t)&&!/BUY NOW/i.test(t)&&!/^\$/.test(t)){el.textContent=p.commerce.stickyTitle||p.commerce.displayName;changed++;}
      else if(/^\$?[\d,]+$/.test(t)&&Number(t.replace(/[$,]/g,''))>100){el.textContent=money(p.commerce.basePrice);changed++;}
    });return changed;
  }

  function build(p){
    var legacyReviews=snapshotLegacyReviews(); var legacyCuration=snapshotLegacyCuration();
    var old=document.getElementById(ROOT_ID); if(old)old.remove();
    var anchor=document.querySelector('.js-product'); var rec=anchor&&(anchor.closest('.t-rec,[id^="rec"]')||anchor);
    var root=document.createElement('section');root.id=ROOT_ID;root.setAttribute('data-filin-master-v3','1');root.setAttribute('data-product',p.slug);
    var tabsObj=buildTabs(p,legacyReviews);
    root.innerHTML='<div class="v3-shell"><div class="v3-product-grid">'+galleryHTML(p)+'<article class="v3-overview"><h2>'+esc(p.overview.title||p.commerce.displayName)+'</h2>'+String(p.overview.html||'')+'</article></div><div class="v3-commerce"><div class="v3-divider"></div><div class="js-product v3-js-product"><span class="js-product-name" id="v3-tilda-product-name" style="display:none">'+esc(p.commerce.cartName)+'</span><span class="js-product-price v3-native-price" id="v3-main-price">'+esc(p.commerce.basePrice)+'</span><a href="#order" class="js-product-btn v3-buy"><span class="v3-buy-label">BUY NOW</span><span class="v3-buy-price">'+money(p.commerce.basePrice)+'</span></a>'+pmHTML(p)+'</div><div class="v3-divider"></div></div>'+tabsObj.html+'<div class="v3-divider"></div>'+curationHTML(p,legacyCuration)+promotionsHTML(p)+'</div>';
    if(rec&&rec.parentNode)rec.parentNode.insertBefore(root,rec);else(document.querySelector('#allrecords')||document.body).appendChild(root);
    // Move live Reviews DOM after root exists; this preserves Firebase/listener state.
    if(legacyReviews){var panel=root.querySelector('.v3-panel[data-panel="reviews"]');if(panel){panel.innerHTML='';legacyReviews.style.removeProperty('display');legacyReviews.classList.add('v3-live-reviews');panel.appendChild(legacyReviews);}}
    quarantineLegacy();
    wire(root,p); return root;
  }

  function wire(root,p){
    var imgs=(p.overview&&p.overview.galleryImages)||[];var idx=0;var main=root.querySelector('.v3-main-img');
    function show(i){if(!imgs.length||!main)return;idx=(i+imgs.length)%imgs.length;main.src=imgs[idx];root.querySelectorAll('.v3-thumb').forEach(function(b){b.classList.toggle('active',Number(b.dataset.i)===idx);});}
    root.querySelector('.v3-prev')&&root.querySelector('.v3-prev').addEventListener('click',function(){show(idx-1)});root.querySelector('.v3-next')&&root.querySelector('.v3-next').addEventListener('click',function(){show(idx+1)});root.querySelectorAll('.v3-thumb').forEach(function(b){b.addEventListener('click',function(){show(Number(b.dataset.i)||0)})});
    var fav=root.querySelector('.v3-fav');if(fav)fav.addEventListener('click',function(){this.textContent=this.textContent==='♥'?'♡':'♥';});
    var pm=root.querySelector('.v3-pm'),pmt=root.querySelector('.v3-pm-toggle');if(pm&&pmt)pmt.addEventListener('click',function(){pm.classList.toggle('open');pmt.setAttribute('aria-expanded',pm.classList.contains('open')?'true':'false');});
    function activate(id,allowClose){
      var mobile=matchMedia('(max-width:'+MAX_MOBILE+'px)').matches;var panel=root.querySelector('.v3-panel[data-panel="'+CSS.escape(id)+'"]');var mbtn=root.querySelector('.v3-mobile-tabbtn[data-tab="'+CSS.escape(id)+'"]');var was=panel&&panel.classList.contains('active');
      root.querySelectorAll('.v3-panel').forEach(function(x){x.classList.remove('active')});root.querySelectorAll('.v3-tabbtn,.v3-mobile-tabbtn').forEach(function(x){x.classList.remove('active')});
      if(mobile&&allowClose&&was)return;
      if(panel)panel.classList.add('active');root.querySelectorAll('[data-tab="'+CSS.escape(id)+'"]').forEach(function(x){x.classList.add('active')});
    }
    root.querySelectorAll('.v3-tabbtn').forEach(function(b){b.addEventListener('click',function(){activate(b.dataset.tab,false)})});root.querySelectorAll('.v3-mobile-tabbtn').forEach(function(b){b.addEventListener('click',function(){activate(b.dataset.tab,true)})});
    // Review count is visual only; use cards currently rendered by the existing review module.
    function syncReviews(){var n=root.querySelectorAll('.v3-live-reviews .product-review-card,.v3-live-reviews [data-review-id]').length;root.querySelectorAll('.v3-count').forEach(function(x){x.textContent=String(n)});}
    syncReviews();setTimeout(syncReviews,1200);setTimeout(syncReviews,3200);
    // Keep cart identity aligned with V3 profile.
    var price=root.querySelector('#v3-main-price'),name=root.querySelector('#v3-tilda-product-name');
    root.querySelectorAll('.v3-bundle').forEach(function(c){c.addEventListener('change',function(){if(name)name.textContent=p.commerce.cartName; if(price)price.textContent=String(p.commerce.basePrice);});});
  }

  function apply(){
    var p=profile(); if(!p){console.warn('[Master Product V3] profile not found for slug',slug());return false;}
    document.documentElement.setAttribute('data-filin-master-v3','1');
    installCSS();bindHero(p);bindCurator(p);build(p);updateSticky(p);
    console.info('[Master Product V3] GOLDEN STANDARD APPLIED',{version:VERSION,slug:p.slug,price:p.commerce.basePrice});return true;
  }

  window.FilinMasterProductV3=Object.freeze({version:VERSION,profiles:PROFILES,get:function(s){return PROFILES[String(s||'')]||null;},apply:apply});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
  setTimeout(function(){if(!document.getElementById(ROOT_ID))apply();else updateSticky(profile()||{});},900);
  setTimeout(function(){if(!document.getElementById(ROOT_ID))apply();else updateSticky(profile()||{});},2400);
})();
