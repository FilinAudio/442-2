
(function(){
  'use strict';
  if((String(location.pathname||'/').replace(/\/+$/,'')||'/')!=='/checkout') return;
  if(window.__FLSHIP_V37__) return; window.__FLSHIP_V37__=true;

  /* ======================= КОНФИГУРАЦИЯ ======================= */
  var CFG={
    CSV_URL:'https://docs.google.com/spreadsheets/d/e/2PACX-1vT3UqLDiem0IUkoge_EbNJFgBt48gZ1Ta2aWpZGNaMzQFdIvpfR8p9OywwDSB-21bK3dDPRK96V5g7q/pub?output=csv',
    // Курсы берутся из этой же таблицы (см. блок FX ниже). Если курсы на отдельном листе — укажите его CSV (…/pub?gid=НОМЕР&output=csv)
    FX_CSV_URL:'',
    FX_TTL_MS:3*3600*1000,
    // Валюты, которые показываются кнопками всегда; остальные добавляются автоматически, если в таблице есть их курс
    CUR_BASE:['USD','EUR','USDT'],
    CUR_HIDE:[],                     // коды, которые не показывать клиенту кнопкой, напр. ['KZT','PLN','CZK']
    CSV_TTL_MS:24*3600*1000,
    EURUSD_FALLBACK:1.15,
    HIDE_EASYPOST_BOX:true,
    INCLUDE_VAT:true,
    SECTION122:0.00,
    KZ_AGENT_PCT:0.03, KZ_AGENT_CAP_USD:200,
    DE_AGENT_EUR:200,
    CONV:{crypto:0.05, paypal:0.035},
    FREIGHT_INS_SDR_KG:{air:22, road:8.33, sea:2}, SDR_USD:1.36,   // ответственность перевозчика: Монреальская конв. 22 SDR/кг, CMR 8,33 SDR/кг
    DIV:{post:6000, courier:5000, freight:6000, sea:6000},
    FREIGHT_KG:70,
    MPF:{pct:0.003464,min:32,max:635},
    KZT_PER_USD:472,                 // курс тенге для тарифа DHL KZ (обновлять)
    FUEL:{dhl:0.25, fedex:0.30, ups:0.25},     // топливные надбавки — % меняется ежемесячно, сверять на сайтах DHL/FedEx
    LOGO_BASE:'',                    // напр. 'https://cdn.jsdelivr.net/gh/FilinAudio/442-2@v1.0.0/logos/' — тогда блоки с логотипами не нужны
    PLN_PER_USD:3.70, CZK_PER_USD:21.3,   // курсы для тарифов Poczta Polska / Česká pošta (обновлять)
    MAIL:'shop@filinlabs.com', TG:'https://t.me/filinlabs',
    AUTO_SCROLL_PX_S:28,             // скорость автопрокрутки карточек служб, px/сек (0 — выкл.)
    CARGO_INS:{pct:0.008, min:40},   // грузовое страхование сверх лимита перевозчика: рынок 0,3–2% для электроники
    GOODS_ORIGIN:'KZ',               // происхождение по умолчанию — для товаров, у которых в таблице не указана страна
    // Происхождение по товару: колонка таблицы «Origin» / «Country of origin» / «Страна происхождения» (KZ …)
    // или вручную здесь: {'demograf_atlas_amplifier_300b':'KZ'}. Ставить KZ только при наличии сертификата происхождения на партию.
    ORIGIN_BY_SLUG:{},               // страна происхождения товара (влияет на пошлину США и уведомление для ЕС)
    US_COL2:0.35,                    // США: товары из РФ — ставки HTSUS Column 2 (NTR приостановлен с 04.2022). Для гл. 8518 — 35%, сверять по HS
    EU_ORIGIN_NOTICE:'Under EU Council Regulation 833/2014 (Art. 3i, Annex XXI), many goods of Russian origin — including loudspeakers, headphones and amplifiers (HS 8518) — cannot be imported into the EU.'
  };

  var SHIP={
    post:{ EU:{econ:[40,6],mid:[60,9],fast:[90,13]}, US:{econ:[50,7],mid:[75,11],fast:[110,16]}, DE:{econ:[40,6],mid:[60,9],fast:[90,13]} },
    courier:{ EU:{econ:[120,14],mid:[160,18],fast:[220,24]}, US:{econ:[150,17],mid:[200,22],fast:[280,30]}, DE:{econ:[120,14],mid:[160,18],fast:[220,24]} }
  };
  var LEG2={ post:{EU:[15,3],US:[45,7]}, courier:{EU:[30,5],US:[120,14]} };
  var ETA={ post:{econ:'4–6 weeks',mid:'2–3 weeks',fast:'7–12 days'}, courier:{econ:'6–8 days',mid:'4–6 days',fast:'3–5 days'},
             freight:{econ:'8–12 days',mid:'5–8 days',fast:'3–5 days'},
             road:{econ:'14–20 days',mid:'10–14 days',fast:'7–10 days'},
             sea:{econ:'45–50 days',mid:'40–45 days',fast:'35–40 days'} };
  var DUTY={
    US:{speaker:.049,headphones:.049,amp:.049,dac:.026,dac_amp:.049,source:.026,cable:.026,accessory:.026,'default':.03},
    EU:{speaker:.040,headphones:.000,amp:.045,dac:.037,dac_amp:.045,source:.037,cable:.033,accessory:.037,'default':.037}
  };
  var VAT_EU=0.20;

  /* Каталог перевозчиков. type: post|courier; regions: US|EU.
     Логотипы — в отдельных блоках с данными (window.__FLSHIP_LOGOS__) либо с GitHub через CFG.LOGO_BASE */
  var CARRIERS=[{"id":"ceska","name":"Česká Pošta","regions":["US","EU"],"type":"post"},{"id":"royalmail","name":"Royal Mail","regions":["US","EU"],"type":"post"},{"id":"laposte","name":"La Poste","regions":["US","EU"],"type":"post"},{"id":"austrian","name":"Austrian Post","regions":["US","EU"],"type":"post"},{"id":"poczta","name":"Poczta Polska","regions":["US","EU"],"type":"post"},{"id":"postnl","name":"PostNL","regions":["US","EU"],"type":"post"},{"id":"usps","name":"USPS","regions":["US","EU"],"type":"post"},{"id":"jppost","name":"JP Post","regions":["US","EU"],"type":"post"},{"id":"parcelforce","name":"Parcelforce","regions":["US","EU"],"type":"courier"},{"id":"dpd","name":"DPD","regions":["US","EU"],"type":"courier"},{"id":"dhl","name":"DHL Express","regions":["US","EU"],"type":"courier"},{"id":"fedex","name":"FedEx","regions":["US","EU"],"type":"courier"},{"id":"ups","name":"UPS","regions":["US","EU"],"type":"courier"},{"id":"turkishcargo","name":"Turkish Cargo","regions":["US","EU"],"type":"freight","mode":"air","hub":"Istanbul (IST)"},{"id":"emirates","name":"Emirates SkyCargo","regions":["US","EU"],"type":"freight","mode":"air","hub":"Dubai (DXB)"},{"id":"qatar","name":"Qatar Airways Cargo","regions":["US","EU"],"type":"freight","mode":"air","hub":"Doha (DOH)"},{"id":"dsv","name":"DSV","regions":["US","EU"],"type":"freight","mode":"air+road","fwd":1},{"id":"kuehne","name":"Kuehne+Nagel","regions":["US","EU"],"type":"freight","mode":"air+road","fwd":1},{"id":"rhenus","name":"Rhenus","regions":["US","EU"],"type":"freight","mode":"air+road","fwd":1},{"id":"cargopoint","name":"CargoPoint","regions":["EU"],"type":"freight","mode":"air+road","fwd":1},{"id":"csmunich","name":"Corporate Service Munich","regions":["EU"],"type":"freight","mode":"air+road","fwd":1},{"id":"lkwwalter","name":"LKW WALTER","regions":["EU"],"type":"freight","mode":"road","fwd":1},{"id":"kuehne_sea","logo":"kuehne","name":"Kuehne+Nagel","regions":["US","EU"],"type":"sea"},{"id":"dsv_sea","logo":"dsv","name":"DSV","regions":["US","EU"],"type":"sea"},{"id":"rhenus_sea","logo":"rhenus","name":"Rhenus","regions":["US","EU"],"type":"sea"}];

  var HIDDEN={carrier:'Shipping Carrier',service:'Shipping Service',rate:'Shipping Rate',currency:'Shipping Currency',
              days:'Shipping Delivery Days',route:'Shipping Route',allin:'Shipping AllIn',origin:'Goods Origin',region:'Shipping Destination Region',dims:'Shipping Parcel',estdate:'Shipping Estimate Date'};
  var SEL_KEY='flship_v35_sel', CSV_KEY='flship_csv_v37';

  var FALLBACK=[["demograf_cassiopeia_amt_ribbon_hf_supertweeters","accessory",1423,1241,50.0,40.0,40.0,5.0],["demograf_tempestus","accessory",949,828,50.0,12.0,60.0,30.0],["gerbera_ac_mains_harmonizer_noise_filter","accessory",1423,1241,40.0,30.0,20.0,5.0],["gerbera_routing_switch","accessory",1186,1035,50.0,30.0,20.0,5.0],["gerbera_solero_network_switch_tube_clock","accessory",949,828,40.0,30.0,20.0,5.0],["sciber_encore_universal_linear_power_supply","accessory",712,621,25.0,20.0,8.0,5.0],["twinmono_tzar_dst_neumann_dst","accessory",2965,2586,5.0,3.0,2.0,0.5],["art_air_acoustic_speaker_cables","cable",2372,2069,40.0,30.0,20.0,2.0],["art_air_digital_cables","cable",712,621,40.0,30.0,20.0,0.5],["art_air_power_cables","cable",1067,931,40.0,30.0,20.0,2.0],["art_air_rca_phono_spdif_cables","cable",1423,1241,40.0,30.0,20.0,1.0],["art_air_xlr_balanced_cables","cable",1423,1241,40.0,30.0,20.0,1.0],["demograf_andromeda_speaker_cable","cable",1305,1138,40.0,30.0,20.0,2.0],["demograf_anthea_rarecorefusion_headphones_cable","cable",890,776,40.0,30.0,20.0,1.0],["demograf_asteria_digital_cable","cable",712,621,40.0,30.0,20.0,0.5],["demograf_icarus_ac_power_cable","cable",1067,931,40.0,30.0,20.0,2.0],["demograf_pollux_interconnect_cable","cable",949,828,40.0,30.0,20.0,1.0],["filin_audio_purity_headphones_cable","cable",1186,1035,40.0,30.0,20.0,1.0],["german_magistro_headphone_cables","cable",712,621,40.0,30.0,20.0,1.0],["konstantin_audio_a_1_synergy_speaker_cables","cable",2965,2586,40.0,30.0,20.0,3.0],["konstantin_audio_ac_power_cables","cable",1779,1552,40.0,30.0,20.0,2.0],["konstantin_audio_ka_1_fatboy_headphones_cable","cable",1423,1241,40.0,30.0,20.0,1.0],["konstantin_audio_rca_xlr_cables","cable",1779,1552,40.0,30.0,20.0,1.0],["demograf_bellerophon_dac_solid_state_amplifier","dac_amp",1779,1552,55.0,50.0,30.0,30.0],["demograf_hades_hybrid_class_d_amplifier_dac","dac_amp",5337,4656,45.0,40.0,30.0,20.0],["gerbera_grigio","dac_amp",593,517,40.0,30.0,20.0,1.0],["gerbera_ha_45_tube_headphone_amplifier_dac","dac_amp",2965,2586,50.0,40.0,40.0,25.0],["gerbera_sound_emotion","dac_amp",1542,1345,40.0,30.0,20.0,1.0],["gerbera_sound_onda_ha","dac_amp",1127,983,40.0,30.0,20.0,2.0],["gerbera_squire","dac_amp",593,517,40.0,30.0,20.0,2.0],["audioinstrument_dac_di_200_accuracy","dac",2965,2586,50.0,40.0,40.0,15.0],["demograf_hyperion_dac","dac",5337,4656,50.0,40.0,40.0,20.0],["demograf_prometheus_fpga_dac","dac",14232,12415,50.0,40.0,40.0,20.0],["demograf_tube_dacs_multibit","dac",5930,5173,50.0,40.0,40.0,20.0],["eridan_antares_r2r_dac","dac",7116,6207,50.0,40.0,40.0,10.0],["gerbera_multibit_dac","dac",1779,1552,50.0,40.0,40.0,5.0],["gerbera_onda","dac",890,776,40.0,30.0,20.0,2.0],["gerbera_pcm1794_dsd1794_dac_otis","dac",2965,2586,50.0,40.0,40.0,7.0],["gerbera_tv_lpf_dac","dac",2372,2069,50.0,40.0,40.0,5.0],["filin_audio_limited","headphones",2965,2586,40.0,40.0,30.0,2.0],["filin_audio_model_1_premium_v2","headphones",2372,2069,40.0,40.0,30.0,1.0],["filin_audio_model_1_standard_v2","headphones",1779,1552,40.0,40.0,30.0,1.0],["filin_audio_quadron","headphones",3558,3104,40.0,40.0,30.0,2.0],["flatvox_gbc","headphones",1542,1345,40.0,40.0,30.0,1.0],["flatvox_gbc_dj_hulk","headphones",1423,1241,40.0,40.0,30.0,1.0],["flatvox_kona","headphones",1779,1552,40.0,40.0,30.0,1.0],["orvellium_nocturne_aura","headphones",1779,1552,40.0,40.0,30.0,1.0],["perun_modern","headphones",1186,1035,40.0,40.0,30.0,1.0],["perun_modern_closed","headphones",1779,1552,40.0,40.0,30.0,1.0],["phenomenon_libratum","headphones",1779,1552,40.0,40.0,30.0,2.0],["phenomenon_spatium","headphones",1660,1448,40.0,40.0,30.0,2.0],["snorry_joule_headphones","headphones",949,828,40.0,40.0,30.0,1.0],["snorry_nm_2_headphones","headphones",2965,2586,40.0,40.0,30.0,2.0],["snorry_si_5_mk_2_headphones","headphones",1127,983,40.0,40.0,30.0,1.0],["snorry_si_6_headphones","headphones",1483,1293,40.0,40.0,30.0,1.0],["snorry_trion_mk_3","headphones",4744,4138,40.0,40.0,30.0,2.0],["volga_tone_priboi_1","headphones",2135,1862,40.0,40.0,30.0,2.0],["audioinstrument_power_speakers","speaker",7709,6725,150.0,110.0,110.0,150.0],["audioinstrument_tower_speakers","speaker",5337,4656,160.0,80.0,90.0,120.0],["demograf_cassandra_mki_speakers","speaker",10674,9311,110.0,110.0,110.0,120.0],["demograf_cassandra_mkii_speakers","speaker",15418,13449,110.0,110.0,110.0,120.0],["demograf_clio_speakers","speaker",5337,4656,120.0,80.0,80.0,100.0],["demograf_orpheus_aer_loudspeakers","speaker",41510,36210,150.0,110.0,110.0,120.0],["demograf_perseus_mkii_supravox_loudspeakers","speaker",35580,31037,150.0,110.0,110.0,150.0],["demograf_perseus_speakers_supravox","speaker",23720,20691,150.0,110.0,110.0,150.0],["demograf_zeus_subwoofers","speaker",8302,7242,140.0,70.0,60.0,100.0],["perun_elder_electrostatic_speakers","speaker",41510,36210,250.0,200.0,150.0,300.0],["perun_junior_hybrid_electrostatic_speakers","speaker",33208,28968,250.0,200.0,150.0,300.0],["audioinstrument_grand_tower","speaker",22534,19657,250.0,160.0,170.0,220.0],["demograf_charon_tube_solid_state_master_clock","source",1779,1552,50.0,40.0,40.0,8.0],["gerbera_tube_master_clock","source",1542,1345,50.0,40.0,40.0,4.0],["brave_beetle_talisman_tube_phonostages","source",1067,931,50.0,40.0,40.0,9.0],["demograf_odysseus_tube_phonostage","source",2965,2586,50.0,40.0,40.0,15.0],["gerbera_bouree_tube_phonostage_mm_mc","source",2372,2069,50.0,40.0,40.0,12.0],["ulixes_solid_state_demograf_phonostage","source",2253,1966,50.0,40.0,40.0,12.0],["gerbera_active_tube_preamplifier","amp",2372,2069,50.0,40.0,40.0,11.0],["high_end_preamplifiers_demograf","amp",4151,3621,50.0,40.0,40.0,9.0],["audioinstrument_vivo_solid_state_amplifier","amp",2609,2276,50.0,40.0,40.0,12.0],["demograf_neptunum_class_d_amplifier","amp",2965,2586,50.0,40.0,40.0,20.0],["eridan_audio_quasar_amplifier","amp",4744,4138,50.0,40.0,40.0,15.0],["eridan_audio_rigel_integrated_amplifier","amp",8302,7242,50.0,40.0,40.0,25.0],["gerbera_dual_mono_mosfet_headphone_amplifier","amp",2135,1862,40.0,30.0,20.0,8.0],["gerbera_equos","amp",1779,1552,40.0,30.0,20.0,5.0],["konstantin_audio_a2_solid_state_amplifier","amp",9488,8277,50.0,40.0,40.0,25.0],["konstantin_audio_un_1_solid_state_headphones_amplifier","amp",2846,2483,40.0,30.0,20.0,10.0],["nemesis_solid_state_amplifier_demograf","amp",5337,4656,50.0,40.0,40.0,35.0],["phenomenon_kgsshv_carbon_electrostatic_headphone_amplifier","amp",3202,2793,50.0,40.0,40.0,20.0],["sciber_enflow","amp",1542,1345,40.0,30.0,20.0,7.0],["audioinstrument_axle_pc_streamer","source",2016,1759,50.0,40.0,40.0,9.0],["demograf_ulanor_pc_streamer","source",10674,9311,50.0,40.0,40.0,30.0],["gerbera_tinker_audiophile_network_player_streamer_server_endpoint","source",1186,1035,40.0,30.0,20.0,5.0],["audioinstrument_sirius_kt150_tube_amplifier","amp",4507,3931,60.0,50.0,40.0,25.0],["audioinstrument_sirius_kt66_push_pull_tube_amplifier","amp",3795,3311,60.0,50.0,40.0,25.0],["demograf_3c24_tantal_tube_amp_electrostatic","amp",17790,15518,60.0,50.0,40.0,100.0],["demograf_ajax_tube_amplifier_el_84","amp",5337,4656,60.0,50.0,40.0,45.0],["demograf_argo_tube_amp_el_34","amp",7709,6725,60.0,50.0,40.0,45.0],["demograf_atlas_amplifier_300b","amp",10674,9311,60.0,50.0,40.0,45.0],["demograf_endymion_805_845_211_tube_amplifier","amp",16604,14484,60.0,50.0,40.0,70.0],["demograf_ether_tube_amp_gm_70","amp",21348,18622,60.0,50.0,40.0,120.0],["demograf_eurybia_2a3_tube_amp","amp",10081,8794,60.0,50.0,40.0,45.0],["demograf_gu_72_aglaya_tube_amp","amp",7116,6207,60.0,50.0,40.0,45.0],["demograf_helios_mki_811_tube_amp","amp",11267,9828,60.0,50.0,40.0,45.0],["demograf_helios_mkii_g811_tube_integrated_amplifier","amp",14232,12415,60.0,50.0,40.0,45.0],["demograf_hestia_807_tube_amp_electrostatic","amp",10081,8794,60.0,50.0,40.0,45.0],["demograf_solaria_45_tube_amp","amp",9488,8277,60.0,50.0,40.0,45.0],["demograf_tantal_senior_amplifier","amp",29650,25864,60.0,50.0,40.0,120.0],["gerbera_2a3_tube_amplifier","amp",3558,3104,60.0,50.0,40.0,35.0],["gerbera_a8045_tube_headphone_amplifier","amp",1660,1448,50.0,40.0,40.0,15.0],["gerbera_attento_otl_tube_electrostatic_headphone_amplifier","amp",3321,2897,50.0,40.0,40.0,15.0],["gerbera_electrostatic_amplifier","amp",1127,983,50.0,40.0,40.0,10.0],["gerbera_ha_15_tube_amp_electrostatic_planar","amp",2965,2586,50.0,40.0,40.0,15.0],["gerbera_lira_compact_tube_amplifier_ultralinear_se","amp",2609,2276,50.0,40.0,40.0,10.0]];
  var CAT_DEF={ cable:[40,30,12,2], headphones:[40,40,30,1.5], dac:[50,40,40,10], dac_amp:[50,40,40,15],
    source:[50,40,40,8], amp:[55,50,40,15], accessory:[45,35,25,5], speaker:[130,90,70,60], 'default':[45,40,25,8] };
  function catFromText(s){ s=(s||'').toLowerCase();
    if(/cable|кабель/.test(s))return'cable'; if(/headphone|наушник/.test(s))return'headphones';
    if(/dac\b/.test(s)&&/amp/.test(s))return'dac_amp'; if(/\bdac\b|цап/.test(s))return'dac';
    if(/clock|phono|stream|player|server|endpoint|клок|фонокор/.test(s))return'source';
    if(/amp|amplifier|preamp|усилител/.test(s))return'amp';
    if(/speaker|loudspeaker|колонк|subwoofer/.test(s))return'speaker';
    if(/accessor|аксессуар|filter|switch|supply/.test(s))return'accessory'; return'default'; }

  /* ======================= УТИЛИТЫ ======================= */
  function FC(){return window.FilinCheckout;}
  function clean(v){return String(v==null?'':v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
  function num(v){var n=Number(String(v==null?0:v).replace(/[^0-9.\-]/g,''));return isFinite(n)?n:0;}
  function slugOf(u){return String(u||'').replace(/[?#].*$/,'').replace(/\/+$/,'').split('/').pop().toLowerCase();}

  // STATE: выбранный конкретный перевозчик хранится в carrierId; svc = post|courier (тип)
  var STATE={cur:'USD',route:'direct',svc:'post',carrierId:null,tier:'mid',insure:false,pay:'crypto'};
  var DB=null, EURUSD=CFG.EURUSD_FALLBACK, selected=null;
  try{selected=JSON.parse(sessionStorage.getItem(SEL_KEY)||'null');}catch(e){}

  /* ---- CSV loader ---- */
  function parseCSV(text){var rows=[],i,f='',row=[],q=false,c;
    for(i=0;i<text.length;i++){c=text[i];
      if(q){if(c==='"'){if(text[i+1]==='"'){f+='"';i++;}else q=false;}else f+=c;}
      else{if(c==='"')q=true;else if(c===','){row.push(f);f='';}else if(c==='\n'){row.push(f);rows.push(row);row=[];f='';}else if(c==='\r'){}else f+=c;}}
    if(f!==''||row.length){row.push(f);rows.push(row);} return rows;}
  /* ======================= КУРСЫ ВАЛЮТ ИЗ ТАБЛИЦЫ =======================
     FX.rates — сколько единиц валюты за 1 USD. Источники (по приоритету):
       1) строки курсов в таблице: «USD/RUB | 81.5», «EUR/USD | 1.15», «USDKZT | 480»
          (пара однозначна; строка может начинаться со слова Rate/Курс),
          либо «Валюта | Курс» / «Currency | Rate» (код + число) — направление определяется по USD/EUR;
       2) соотношение цен в колонках «Price, XXX» (медиана по всем товарам, где заполнены обе цены);
       3) запасные значения ниже.
     Новая валюта появляется кнопкой автоматически, как только у неё есть курс. */
  var ISO=('USD USDT USDC EUR RUB KZT GBP JPY CNY CHF PLN CZK HUF RON BGN SEK NOK DKK TRY AED ILS INR THB SGD HKD KRW CAD AUD NZD UAH BYN KGS UZS GEL AMD AZN TJS MNT BTC ETH').split(' ');
  var CUR_ALIAS={EURO:'EUR',EUROS:'EUR','€':'EUR','$':'USD','₽':'RUB','РУБ':'RUB','RUR':'RUB','₸':'KZT','ТЕНГЕ':'KZT','ТГ':'KZT','ДОЛЛАР':'USD','ЕВРО':'EUR'};
  var FX_FALLBACK={USD:1,USDT:1,EUR:1/CFG.EURUSD_FALLBACK,KZT:CFG.KZT_PER_USD,PLN:CFG.PLN_PER_USD,CZK:CFG.CZK_PER_USD};
  var FX={rates:{},src:{},priceCols:[]};
  var CUR_SYM={USD:'$',EUR:'€',RUB:'₽',KZT:'₸',GBP:'£',JPY:'¥',CNY:'¥',PLN:'zł',TRY:'₺',AED:'AED ',CHF:'CHF '};
  function curCode(v){var c=clean(v).toUpperCase().replace(/\.$/,'');c=CUR_ALIAS[c]||c;return ISO.indexOf(c)>-1?c:'';}
  function fxNum(v){var t=clean(v).replace(/[\s\u00a0$€₸₽£¥]/g,'');if(/^\d+,\d{1,2}$/.test(t)||/^0,\d+$/.test(t))t=t.replace(',','.');else t=t.replace(/,/g,'');var n=parseFloat(t);return isFinite(n)&&n>0?n:0;}
  var ORIGIN_NAME={RU:'Russia',KZ:'Kazakhstan',DE:'Germany',CN:'China',US:'United States'};
  function originCode(v){var t=clean(v).toLowerCase();if(!t)return '';
    if(/^(kz|kaz|kazakhstan|казахстан|рк|республика казахстан)\b/.test(t))return 'KZ';
    if(/^(ru|rus|russia|russian federation|россия|рф)\b/.test(t))return 'RU';
    var c=ccFromCountry(t);return c||'';}
  function originOf(pr){return CFG.ORIGIN_BY_SLUG[pr.slug]||pr.origin||CFG.GOODS_ORIGIN;}
  function median(a){if(!a.length)return 0;a=a.slice().sort(function(x,y){return x-y;});return a[Math.floor(a.length/2)];}
  function fxSet(c,perUsd,src){if(!c||!(perUsd>0))return;FX.rates[c]=perUsd;FX.src[c]=src;}
  /* 1) явные строки курсов */
  function fxFromRows(rows){var pairs={},codes={},r,i;
    for(r=0;r<rows.length;r++){var a=rows[r]||[];if(/^https?:/i.test(clean(a[0])))continue;
      for(i=0;i<a.length;i++){var cell=clean(a[i]).toUpperCase().replace(/^(RATE|КУРС)\s*[:\-]?\s*/,'');
        var m=cell.match(/^([A-Z]{3,5})\s*[\/\-→>]\s*([A-Z]{3,5})$/)||cell.match(/^([A-Z]{3})([A-Z]{3,4})$/),v=0,j;
        for(j=i+1;j<a.length&&j<=i+3;j++){v=fxNum(a[j]);if(v)break;}
        if(!v)continue;
        if(m){var b=curCode(m[1]),q=curCode(m[2]);if(b&&q&&b!==q){pairs[b+'/'+q]=v;break;}}
        var c=curCode(cell);if(c){codes[c]=v;break;}}}
    // пары: BASE/QUOTE = v  →  1 BASE = v QUOTE
    var k,changed=true,guard=0;FX.rates.USD=1;
    while(changed&&guard++<5){changed=false;
      for(k in pairs){var p=k.split('/'),B=p[0],Q=p[1],v2=pairs[k];
        if(FX.rates[B]!=null&&FX.src[Q]!=='pair'&&Q!=='USD'){fxSet(Q,FX.rates[B]*v2,'pair');changed=true;delete pairs[k];}
        else if(FX.rates[Q]!=null&&FX.src[B]!=='pair'&&B!=='USD'){fxSet(B,FX.rates[Q]/v2,'pair');changed=true;delete pairs[k];}}}
    // одиночные коды: направление по паре USD/EUR (евро дороже доллара)
    var cs=Object.keys(codes);if(cs.length){var usd=codes.USD||1,priceOfUnit=codes.EUR?codes.EUR>usd:(codes.USD>1);
      cs.forEach(function(c){if(FX.src[c]==='pair')return;fxSet(c,priceOfUnit?usd/codes[c]:codes[c]/usd,'sheet');});}
  }
  /* 2) соотношение цен в колонках «Price, XXX» */
  function fxFromPrices(rows,cols){var usdCol=cols.USD;if(usdCol==null)return;
    Object.keys(cols).forEach(function(c){if(c==='USD'||FX.rates[c])return;var rs=[];
      rows.forEach(function(a){var u=fxNum(a[usdCol]),x=fxNum(a[cols[c]]);if(u&&x)rs.push(x/u);});
      if(rs.length)fxSet(c,median(rs),'prices');});}
  function fxFinish(){Object.keys(FX_FALLBACK).forEach(function(c){if(!FX.rates[c])fxSet(c,FX_FALLBACK[c],'fallback');});
    FX.rates.USD=1;if(!FX.rates.USDT||FX.src.USDT==='fallback')FX.rates.USDT=1;
    EURUSD=1/FX.rates.EUR; CFG.KZT_PER_USD=FX.rates.KZT; CFG.PLN_PER_USD=FX.rates.PLN; CFG.CZK_PER_USD=FX.rates.CZK;
    window.FILIN_FX={base:'USD',rates:FX.rates,source:FX.src,rate:function(c){return FX.rates[c]||0;},
      convert:function(usd,c){return usd*(FX.rates[c]||1);}};
    try{document.dispatchEvent(new CustomEvent('filin:fx-ready',{detail:window.FILIN_FX}));}catch(e){}}
  function currencies(){var out=CFG.CUR_BASE.slice();
    FX.priceCols.concat(Object.keys(FX.src).filter(function(c){return FX.src[c]==='pair'||FX.src[c]==='sheet';}))
      .forEach(function(c){if(out.indexOf(c)<0&&FX.rates[c])out.push(c);});
    return out.filter(function(c){return CFG.CUR_HIDE.indexOf(c)<0&&FX.rates[c];});}

  /* колонки таблицы товаров ищутся по заголовкам, а не по номерам —
     новые колонки (напр. «Price, RUB») не сдвигают данные */
  function headerMap(rows){var r,i;
    for(r=0;r<Math.min(rows.length,5);r++){var a=rows[r]||[],h={price:{}},hit=0;
      for(i=0;i<a.length;i++){var t=clean(a[i]).toLowerCase();
        var pm=t.match(/^(price|цена)[,\s(]+([^)]+)\)?$/);if(pm){var c=curCode(pm[2]);if(c){h.price[c]=i;hit++;}continue;}
        if(/link|ссылк|name of goods/.test(t)){h.link=i;hit++;}else if(/type|catalog|категор/.test(t))h.type=i;
        else if(/^length|^длин/.test(t))h.l=i;else if(/^width|^шир/.test(t))h.w=i;else if(/^height|^выс/.test(t))h.h=i;
        else if(/^weight|^вес/.test(t))h.kg=i;
        else if(/origin|происхожд/.test(t))h.origin=i;}
      if(hit>=2){h.row=r;h.mm=!/\bcm\b|см/.test(a.join(' ').toLowerCase());return h;}}
    return {row:-1,link:0,type:1,price:{EUR:3,USD:4,USDT:5},l:6,w:7,h:8,kg:9,mm:true};}
  function buildDB(rows){var H=headerMap(rows),map=loadFallback(),found=0,r;
    FX.rates={};FX.src={};fxFromRows(rows);
    var cols=H.price;FX.priceCols=Object.keys(cols);
    var prod=rows.filter(function(a,i){return i>H.row&&a&&/^https?:\/\//i.test(clean(a[H.link]));});
    fxFromPrices(prod,cols);fxFinish();
    var dv=H.mm?10:1;
    prod.forEach(function(a){var slug=slugOf(clean(a[H.link]));if(!slug)return;found++;
      var old=map[slug]||{slug:slug,cat:catFromText((a[H.type]||'')+' '+slug),usd:0,eur:0,usdt:0,l:0,w:0,h:0,kg:0,prices:{}};
      var pr={};Object.keys(cols).forEach(function(c){var v=fxNum(a[cols[c]]);if(v)pr[c]=v;});
      // цена в USD: прямая, иначе пересчёт из любой заполненной валюты по курсу
      var usd=pr.USD||0;if(!usd){for(var c in pr){if(FX.rates[c]){usd=Math.round(pr[c]/FX.rates[c]);break;}}}
      var n=function(k){var v=fxNum(a[H[k]]);return v?v/(k==='kg'?1:dv):0;};
      // пустая ячейка НЕ затирает значение из встроенной копии
      map[slug]={slug:slug,cat:old.cat,usd:usd||old.usd,eur:pr.EUR||old.eur,usdt:pr.USDT||usd||old.usdt,
        l:n('l')||old.l,w:n('w')||old.w,h:n('h')||old.h,kg:n('kg')||old.kg,prices:pr,
        origin:(H.origin!=null?originCode(a[H.origin]):'')||old.origin||''};});
    return found?map:null;}
  function loadFallback(){var map={};
    FALLBACK.forEach(function(a){map[a[0]]={slug:a[0],cat:a[1],usd:a[2],eur:a[3],usdt:a[2],l:a[4],w:a[5],h:a[6],kg:a[7],prices:{}};});
    return map;}
  function loadDB(cb){DB=loadFallback();FX.rates={};FX.src={};fxFinish();
    if(!CFG.CSV_URL){cb();return;}
    function applyRows(rows){var m=buildDB(rows);if(m)DB=m;return !!m;}
    function fxExtra(done){if(!CFG.FX_CSV_URL){done();return;}
      fetch(CFG.FX_CSV_URL+(CFG.FX_CSV_URL.indexOf('?')>-1?'&':'?')+'_ts='+Math.floor(Date.now()/CFG.FX_TTL_MS),{cache:'no-store'})
        .then(function(r){return r.text();}).then(function(t){fxFromRows(parseCSV(t));fxFinish();done();}).catch(function(){done();});}
    try{var c=JSON.parse(sessionStorage.getItem(CSV_KEY)||'null');
      if(c&&c.t&&(Date.now()-c.t)<CFG.FX_TTL_MS&&c.rows&&applyRows(c.rows)){fxExtra(cb);return;}}catch(e){}
    var url=CFG.CSV_URL+(CFG.CSV_URL.indexOf('?')>-1?'&':'?')+'_ts='+Date.now();
    fetch(url,{cache:'no-store'}).then(function(r){if(!r.ok)throw new Error('HTTP '+r.status);return r.text();}).then(function(t){
      var rows=parseCSV(t);
      if(applyRows(rows)){try{sessionStorage.setItem(CSV_KEY,JSON.stringify({t:Date.now(),rows:rows}));}catch(e){}}
      fxExtra(cb);
    }).catch(function(e){console.warn('[Filin Labs] Shipping Estimator: table unavailable, using built-in copy',e&&e.message);fxExtra(cb);});}

  /* ---- профиль товара ---- */
  function profile(p){
    var url=clean(p.__flcartUrl||p.url||p.link||p.product_url||p.href||'');
    var name=clean(p.__flcartCanonicalName||p.name||p.title||p.product||'');
    var slug=slugOf(url)||slugOf(name.replace(/\s+/g,'_')); var hit=DB&&DB[slug]; if(hit)return hit;
    if(DB){var keys=Object.keys(DB),i,hay=(slug+' '+name).toLowerCase();
      for(i=0;i<keys.length;i++){if(hay.indexOf(keys[i])>-1||keys[i].indexOf(slug)>-1)return DB[keys[i]];}}
    var cat=catFromText(name+' '+url),d=CAT_DEF[cat]||CAT_DEF['default'];
    return {slug:slug,cat:cat,usd:num(p.price||p.unitprice||0),eur:0,usdt:0,l:d[0],w:d[1],h:d[2],kg:d[3]};}
  function qtyOf(p){return Math.max(1,Math.round(num(p.quantity||p.qty||1)));}
  function products(){var f=FC();if(f&&typeof f.products==='function'){try{return f.products()||[];}catch(e){}}
    var arr=(window.tcart&&window.tcart.products)||[];
    return arr.filter(function(p){return p&&p.deleted!=='yes'&&num(p.quantity||p.qty||1)>0;});}

  /* ---- метрики корзины: БЕЗ удвоения. Цена/вес/габариты из таблицы КАК ЕСТЬ ----
     goods = цена из корзины (fallback на таблицу). box = наибольшие габариты позиции. */
  function metrics(div){
    var ps=products(),kg=0,goods=0,freight=false,box=[0,0,0],cat='default',pieces=[],items=[];
    ps.forEach(function(p){
      var pr=profile(p), q=qtyOf(p);
      var vol=(pr.l*pr.w*pr.h)/div, one=Math.max(pr.kg,vol);
      kg+=one*q; pieces.push({kg:one,a:pr.kg,q:q,l:pr.l,w:pr.w,h:pr.h});
      var price=num(p.price||p.unitprice||p.baseprice)||pr.usd;  // приоритет — цена из корзины
      goods+=price*q; items.push({value:price*q,cat:pr.cat,origin:originOf(pr)});
      if(one>CFG.FREIGHT_KG)freight=true;
      if(pr.l*pr.w*pr.h>box[0]*box[1]*box[2]) box=[pr.l,pr.w,pr.h];
      cat=pr.cat;
    });
    return {kg:Math.round(kg*10)/10, goods:Math.round(goods), freight:freight, box:box, cat:cat, pieces:pieces, items:items};
  }

  /* ======================= РАСЧЁТ ======================= */
  /* ======================= ТАРИФЫ ПЕРЕВОЗЧИКОВ (из прайсов 2026) =======================
     DHL Express — Service & Rate Guide 2026 Kazakhstan, экспорт из KZ, KZT без НДС/сборов.
     FedEx — Standard List Rates 2026, U.S. import from zone M (Kazakhstan), USD, lbs.
     Austrian Post — Tarifbroschüre 08/2026 + Paket-Tarifblatt 07/2026, EUR (отправка из AT/EU-хаба).
     Остальные службы (в т.ч. DPD, UPS, USPS, JP Post, Royal Mail…) — ориентир SHIP/LEG2 выше. */
  var DHL={ /* зоны 2,3,4: 0.5–10 кг шаг 0.5; 11–30 кг шаг 1; +0.5 кг выше 10/20; за кг 30–70/70–300/300+ */
    z:{2:{t10:[85524,104648,120564,136480,153665,166953,180241,193529,206817,220105,230238,240371,250504,260637,270770,280903,291036,301169,311302,321435],
          t30:[333999,346563,359127,371691,384255,396819,409383,421947,434511,447075,461263,475451,489639,503827,518015,532203,546391,560579,574767,588955],
          h:[6282,7094], k:[14422,15332,17536], r70:1165835},
       3:{t10:[99587,119731,136771,153811,172130,186062,199994,213926,227858,241790,253604,265418,277232,289046,300860,312674,324488,336302,348116,359930],
          t30:[373244,386558,399872,413186,426500,439814,453128,466442,479756,493070,508368,523666,538964,554262,569560,584858,600156,615454,630752,646050],
          h:[6657,7649], k:[15052,16126,18451], r70:1248130},
       4:{t10:[105588,129567,150892,172217,194727,211009,227291,243573,259855,276137,288250,300363,312476,324589,336702,348815,360928,373041,385154,397267],
          t30:[412759,428251,443743,459235,474727,490219,505711,521203,536695,552187,567843,583499,599155,614811,630467,646123,661779,677435,693091,708747],
          h:[7746,7828], k:[15576,16758,18601], r70:1331787}},
    tierAdd:{econ:0, mid:4000, fast:17000},      // Worldwide / 12:00 / 9:00
    tierName:{econ:'Express Worldwide', mid:'Express 12:00', fast:'Express 9:00'},
    overweight:61000, oversize:12200, exportDecl:6100,
    zone:{AT:2,BE:2,CZ:2,EE:2,FR:2,DE:2,HU:2,IT:2,LV:2,LT:2,LU:2,MC:2,NL:2,CH:2,GB:2,LI:2,SM:2,VA:2,
          BG:3,HR:3,CY:3,DK:3,FI:3,GR:3,IE:3,MT:3,PL:3,PT:3,RO:3,SK:3,SI:3,ES:3,SE:3,NO:3,IS:3, US:4}
  };
  function dhlKZT(w,z){var t=DHL.z[z]; if(!t)return null;
    w=w<=30?Math.ceil(w*2)/2:Math.ceil(w); w=Math.max(0.5,w);
    if(w<=10)return t.t10[Math.round(w*2)-1];
    if(w<=30){var n=Math.floor(w),base=n===10?t.t10[19]:t.t30[n-11];return base+(w>n?t.h[n<20?0:1]:0);}
    if(w<=70)return t.t30[19]+(w-30)*t.k[0];
    if(w<=300)return t.r70+(w-70)*t.k[1];
    return t.r70+230*t.k[1]+(w-300)*t.k[2];}

  var FEDEX={ /* FedEx Standard List Rates 2026, U.S. import from zone M (Kazakhstan). [IPE, IP, IE] */
    m53:[[2400.96,2286.63,1859.09],[2415.29,2300.28,1997.75],[2416.74,2301.66,2049.01],[2418.19,2303.04,2070.84],[2419.64,2304.42,2151.54],[2421.09,2305.80,2202.80],[2449.94,2333.28,2265.31],[2553.99,2432.38,2338.79],[2596.40,2472.77,2346.14],[2601.69,2477.80,2395.34],[2604.36,2480.35,2400.26],[2610.50,2486.20,2400.76],[2733.30,2603.18,2401.03],[2745.58,2615.08,2401.30],[2746.81,2616.27,2401.55],[2747.34,2616.52,2404.22],[2747.72,2616.88,2457.26],[2754.84,2623.66,2538.43],[2894.50,2759.05,2560.81],[2908.47,2772.60,2593.51],[2939.64,2799.66,2601.28],[3015.45,2871.86,2603.98],[3023.04,2879.09,2604.25],[3023.96,2879.97,2604.51],[3039.31,2894.59,2606.19],[3143.03,2996.21,2639.61],[3310.62,3155.97,2740.85],[3358.96,3199.31,2750.99],[3363.80,3203.65,2753.78],[3364.29,3204.09,2756.70],[3364.55,3204.34,2775.57],[3365.22,3205.02,2854.51],[3378.53,3217.65,2908.39],[3384.50,3223.34,2913.78],[3385.10,3223.91,2915.27],[3385.49,3224.28,2944.67],[3393.25,3231.67,2947.61],[3548.29,3379.33,2948.04],[3563.80,3394.10,2948.32],[3634.45,3461.41,2948.59],[3641.55,3468.15,2948.84],[3642.26,3468.83,2949.15],[3644.25,3470.72,2949.44],[3683.88,3508.49,2949.69],[3689.58,3513.89,2950.00],[3690.15,3514.43,2951.39],[3696.92,3520.88,2976.95],[3831.00,3649.00,3488.00]],
    m1:[[259.47, 247.12, 233.17], [303.73, 289.27, 275.48], [386.07, 367.69, 320.13], [455.01, 433.35, 416.76], [496.82, 473.17, 455.07], [551.77, 525.5, 496.34], [620.72, 591.17, 569.09], [687.14, 654.42, 618.05], [746.27, 710.74, 671.23], [810.81, 772.2, 715.51], [817.27, 778.37, 735.1], [823.84, 784.61, 755.31], [953.86, 908.44, 874.51], [972.67, 927.23, 886.44], [1018.97, 971.37, 935.1], [1068.16, 1017.3, 987.66], [1109.43, 1056.6, 1024.87], [1135.69, 1081.61, 1041.03], [1169.66, 1113.97, 1045.39], [1198.06, 1142.02, 1078.44], [1288.06, 1226.82, 1166.44], [1297.06, 1235.31, 1175.24], [1297.96, 1236.16, 1176.13], [1298.3, 1236.48, 1176.39], [1304.44, 1242.33, 1180.19], [1426.37, 1358.45, 1232.43], [1455.3, 1386.0, 1340.22], [1461.1, 1391.53, 1351.0], [1546.17, 1473.94, 1392.54], [1554.86, 1482.21, 1397.12], [1555.73, 1483.06, 1435.7], [1563.12, 1488.69, 1439.77], [1681.32, 1601.26, 1445.99], [1715.97, 1634.26, 1523.34], [1722.59, 1640.57, 1560.39], [1727.34, 1646.65, 1564.1], [1730.44, 1648.04, 1564.48], [1759.32, 1675.55, 1564.75], [1783.71, 1698.78, 1565.01], [1851.49, 1763.33, 1568.41], [1858.27, 1769.79, 1605.45], [1892.5, 1804.08, 1642.95], [1957.1, 1864.05, 1648.59], [1963.56, 1870.06, 1761.22], [1967.05, 1873.39, 1772.49], [2030.85, 1934.15, 1788.19], [2037.23, 1942.06, 1789.76], [2068.44, 1971.82, 1796.49], [2076.67, 1979.66, 1797.17], [2240.74, 2134.04, 1805.71], [2371.93, 2261.13, 1815.91], [2387.54, 2273.85, 1850.22]],   // 1–52 lb, zone M import (стр. 92)
    mw:{fast:[38.31,36.78],mid:[36.49,35.03],econ:[34.88,33.49]},   // Multiweight / Intl Freight zone M, $/lb: 100–999 / 1000+ lb
    col:{fast:0, mid:1, econ:2},
    tierName:{econ:'International Economy', mid:'International Priority', fast:'International Priority Express'}
  };
  /* цена FedEx (USD) до топлива: 1–100 lb — по таблице, >100 lb — Multiweight за lb (стр. 100/103) */
  function fedexUSD(kg,tier){var lb=Math.max(1,Math.ceil(kg*2.20462)),c=FEDEX.col[tier];
    if(lb<=52)return {usd:FEDEX.m1[lb-1][c]};
    if(lb<=100)return {usd:FEDEX.m53[lb-53][c]};
    return {usd:lb*FEDEX.mw[tier][lb>=1000?1:0],mw:true};}

  var ATP={ /* Austrian Post, EUR. bands: 1,2,4,10,31.5 кг (Express: 1,2,4,10,20,31.5) */
    plus:{'1a':[18.39,20.90,24.66,29.23,62.67],'1b':[19.01,21.52,25.29,30.38,83.40],'1c':[19.64,22.15,25.93,38.48,108.34],
          '2':[21.01,22.55,30.96,54.00,145.58],'3':[24.21,29.34,42.13,75.88,202.02],'4':[28.10,39.73,53.65,98.57,253.86],'at':[6.61,7.94,9.25,13.21,21.13]},
    exp:{'1a':[50.68,54.82,58.06,73.72,99.75,133.05],'1b':[52.74,58.97,64.84,88.58,128.66,179.70],'1c':[54.14,60.35,67.60,91.34,136.96,207.35],
          '2':[47.41,56.06,65.55,98.38,155.40,227.63],'3':[54.32,69.87,88.59,147.68,251.94,383.26],'4':[59.51,80.24,105.81,184.60,324.23,500.01],'at':[12.60,13.87,15.12,18.89,28.95,28.95]},
    bP:[1,2,4,10,31.5], bE:[1,2,4,10,20,31.5],
    bulky:{small:10, lo:25, hi:30},              // Großes Sperrgut: ≤10 кг / >10 кг (EU), зоны 2–5 — 25
    zone:{DE:'1a',HR:'1a',PL:'1a',SK:'1a',SI:'1a',CZ:'1a',HU:'1a',BE:'1b',BG:'1b',EE:'1b',FI:'1b',FR:'1b',IT:'1b',LT:'1b',LU:'1b',MC:'1b',NL:'1b',RO:'1b',
          DK:'1c',GR:'1c',IE:'1c',LV:'1c',MT:'1c',PT:'1c',SE:'1c',ES:'1c',CY:'1c',GB:'2',CH:'2',NO:'2',IS:'2',LI:'2',SM:'2',VA:'2',US:'4',AT:'at'},
    maxKg:31.5, maxLen:200, maxLenExp:120, maxGirth:360
  };
  function band(bs,w){for(var i=0;i<bs.length;i++)if(w<=bs[i])return i;return -1;}
  /* по местам: каждое место ≤31.5 кг, длина ≤200 (Express ≤120), обхват ≤360; иначе null (не принимается) */
  function atpEUR(pieces,cc,tier){var z=ATP.zone[cc]||'1a',exp=(tier==='fast'),tab=exp?ATP.exp[z]:ATP.plus[z],bs=exp?ATP.bE:ATP.bP,sum=0,bulky=0,i;
    for(i=0;i<pieces.length;i++){var p=pieces[i],d=[p.l,p.w,p.h].sort(function(a,b){return b-a;}),girth=d[0]+2*d[1]+2*d[2];
      if(p.kg>ATP.maxKg||d[0]>(exp?ATP.maxLenExp:ATP.maxLen)||girth>ATP.maxGirth)return null;
      sum+=tab[band(bs,p.kg)];
      if(!exp&&(d[0]>100||d[1]>60||d[2]>60)){var b=(z.length===2&&z[0]==='1'&&p.kg>ATP.bulky.small)?ATP.bulky.hi:ATP.bulky.lo;sum+=b;bulky++;}}
    return {eur:sum,bulky:bulky,name:exp?'Post Express International':'Paket Plus International',zone:z};}

  /* страна → ISO-код (для зон DHL/Austrian Post) */
  var CC=[['AT','austria|österreich|osterreich'],['BE','belgium|belgi'],['BG','bulgaria'],['HR','croatia|hrvatska'],['CY','cyprus'],['CZ','czech|česk|cesk'],
    ['DK','denmark|danmark'],['EE','estonia'],['FI','finland|suomi'],['FR','france'],['DE','germany|deutschland'],['GR','greece|hellas'],['HU','hungary|magyar'],
    ['IE','ireland'],['IT','italy|italia'],['LV','latvia'],['LT','lithuania'],['LU','luxembourg'],['MT','malta'],['MC','monaco'],['NL','netherlands|holland|nederland'],
    ['PL','poland|polska'],['PT','portugal'],['RO','romania'],['SK','slovakia'],['SI','slovenia'],['ES','spain|españa|espana'],['SE','sweden|sverige'],
    ['CH','switzerland|schweiz|suisse'],['NO','norway|norge'],['IS','iceland'],['LI','liechtenstein'],['GB','united kingdom|great britain|england|scotland|wales|^uk$|^gb$'],
    ['US','^us$|^usa$|united states|america|^u\\.s']];
  function ccFromCountry(raw){var c=(raw||'').toLowerCase().trim();if(!c)return null;
    for(var i=0;i<CC.length;i++){if(new RegExp(CC[i][1]).test(c))return CC[i][0];}
    if(/^[a-z]{2}$/.test(c))return c.toUpperCase(); return null;}

  /* стоимость перевозки выбранной службой (USD). src: tariff|generic */

  /* ---------- PostNL (Tarievenboekje 07/2026, online franking, доставка на дом, EUR). Отправка из NL (плечо от EU-хаба) ---------- */
  var PNL={b:[2,5,10,20,23],
    grp:{BE:'be',DE:'eu',FR:'eu',ES:'eu',IT:'eu',GB:'uk',US:'us'},
    std:{be:[12.25,19.25,24.75,34.25,46.00],eu:[12.50,20.00,25.50,35.75,48.00],uk:[20.00,26.75,34.25,44.00,null],us:[32.00,51.00,85.50,160.00,null]},
    insFee:15, insCover:5500};   // Insured parcel: +€15 к стандарту, ответственность до €5 500 за посылку
  function pnlEUR(pcs,cc){var g=PNL.grp[cc]||'eu',t=PNL.std[g],sum=0,i;
    for(i=0;i<pcs.length;i++){var p=pcs[i],d=[p.l,p.w,p.h].sort(function(a,b){return b-a;}),k=band(PNL.b,p.kg);
      if(d[0]>100||d[1]>50||d[2]>50||k<0||t[k]==null)return null; sum+=t[k];}
    return {eur:sum,approx:!PNL.grp[cc]};}

  /* ---------- Poczta Polska (cennik usług powszechnych 02/2025 + EMS 05/2024, PLN). Отправка из PL ---------- */
  var PP={pri:[[68, 76, 79, 38, 66, 92, 89, 116], [81, 92, 93, 42, 78, 115, 116, 164], [90, 105, 111, 44, 94, 142, 147, 212], [104, 115, 115, 46, 98, 165, 177, 261], [115, 129, 129, 51, 110, 194, 208, 307], [119, 132, 132, 54, 113, 208, 238, 353], [124, 140, 140, 58, 120, 229, 265, 400], [132, 148, 148, 60, 127, 251, 295, 450], [141, 157, 157, 63, 135, 271, 325, 496], [150, 164, 164, 67, 145, 292, 350, 544], [157, 171, 179, 70, 152, 312, 380, 592], [164, 181, 189, 72, 164, 336, 410, 640], [175, 188, 199, 76, 172, 359, 440, 687], [183, 194, 209, 79, 180, 383, 475, 735], [193, 202, 219, 81, 190, 407, 500, 782], [202, 211, 240, 85, 200, 441, 535, 817], [211, 221, 250, 88, 205, 464, 560, 853], [221, 231, 260, 92, 215, 489, 580, 872], [228, 238, 270, 94, 225, 513, 630, 912], [238, 250, 281, 97, 235, 537, 660, 949]], eco:[[63, 63, 36, 52, 64, 67, 65], [70, 70, 40, 58, 71, 73, 76], [76, 76, 42, 63, 77, 79, 82], [85, 85, 45, 71, 86, 87, 89], [95, 95, 46, 80, 96, 97, 98], [97, 108, 49, 84, 101, 102, 107], [99, 111, 51, 90, 104, 111, 114], [102, 119, 54, 97, 113, 120, 123], [104, 127, 57, 99, 122, 129, 131], [107, 136, 59, 103, 129, 138, 140], [113, 144, 62, 108, 138, 147, 150], [119, 153, 63, 114, 146, 157, 160], [124, 162, 66, 120, 156, 168, 173], [131, 171, 68, 127, 170, 180, 184], [140, 180, 71, 136, 183, 191, 195], [144, 189, 73, 139, 186, 195, 201], [148, 198, 76, 144, 192, 201, 210], [154, 207, 78, 149, 200, 209, 223], [159, 216, 81, 155, 206, 219, 233], [165, 225, 84, 160, 211, 226, 245]], ems:[[182, 188], [188, 203], [200, 217], [206, 233], [213, 257], [221, 282], [229, 305], [240, 331], [250, 362], [260, 379], [273, 420], [284, 461], [297, 501], [310, 541], [325, 582], [342, 622], [360, 663], [378, 704], [397, 758], [417, 809], [443, 878]],
    emsB:[0.5,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
    zp:{AT:0,BG:0,HR:0,DK:0,EE:0,NL:0,LT:0,LU:0,LV:0,SI:0,CH:0,HU:0,BE:1,CY:1,FI:1,GR:1,IE:1,MT:1,NO:1,RO:1,SE:1,IT:1,FR:1,ES:1,PT:2,GB:2,CZ:3,SK:3,DE:4,US:5},
    ze:{AT:0,BG:0,HR:0,CY:0,DK:0,EE:0,GR:0,NL:0,IE:0,LT:0,LU:0,MT:0,RO:0,SI:0,SE:0,FR:0,ES:0,LV:0,BE:1,FI:1,NO:1,PT:1,CH:1,HU:1,IT:1,GB:1,CZ:2,SK:2,DE:3,US:4},
    maxKg:20, maxLen:150, maxLG:300};   // L + обхват ≤ 300 см (типовой лимит UPU; по стране может отличаться)
  function ppPLN(pcs,cc,tier){var sum=0,i;
    for(i=0;i<pcs.length;i++){var p=pcs[i],d=[p.l,p.w,p.h].sort(function(a,b){return b-a;});
      if(p.kg>PP.maxKg||d[0]>PP.maxLen||d[0]+2*d[1]+2*d[2]>PP.maxLG)return null;
      var n=Math.max(1,Math.ceil(p.kg))-1;
      if(tier==='fast'){var j=band(PP.emsB,p.kg);sum+=PP.ems[j][cc==='US'?1:0];}
      else if(tier==='mid'){sum+=PP.pri[n][PP.zp[cc]!=null?PP.zp[cc]:4];}
      else sum+=PP.eco[n][PP.ze[cc]!=null?PP.ze[cc]:3];}
    return {pln:sum,name:{econ:'Paczka ekonomiczna',mid:'Paczka priorytetowa',fast:'EMS'}[tier]};}

  /* ---------- Страхование ----------
     Перевозчик страхует (объявляет ценность) до своего лимита; превышение — грузовое страхование CFG.CARGO_INS. */
  function insurance(carId,src,goods,pcs){
    var v=goods,fee=0,cover=0,lab='',n=Math.max(1,pcs.length);
    if(src==='tariff'){
      if(carId==='dhl'){fee=Math.max(7100/CFG.KZT_PER_USD,v*0.01);cover=v;lab='DHL Shipment Insurance: 1% of value, min 7,100 KZT';}
      else if(carId==='fedex'){fee=v<=100?0:(v<=300?4.95:4.95+1.65*Math.ceil((v-300)/100));cover=v;lab='FedEx declared value: $4.95 up to $300, then $1.65 per $100 (carrier liability, not insurance)';}
      else if(carId==='austrian'){var ve=v/EURUSD,hv=pcs.some(function(p){return p.kg>10;});
        fee=(ve<=500?(hv?9.29:7.74):(hv?2.75:2.29)+(hv?1.31:1.09)*Math.ceil(ve/100))*EURUSD;cover=v;lab='Austrian Post declared value (Wertangabe); country limits apply';}
      else if(carId==='postnl'){fee=PNL.insFee*n*EURUSD;cover=Math.min(v,PNL.insCover*n*EURUSD);lab='PostNL insured parcel: +€15, liability up to €5,500 per parcel';}
      else if(carId==='kazpost'){fee=(v*0.01*CFG.KZT_PER_USD+910)/CFG.KZT_PER_USD;cover=v;lab='Kazpost declared value: 1% + 910 KZT (not available to some countries)';}
      else if(carId==='ups'){fee=Math.max(3505/CFG.KZT_PER_USD,v*0.01);cover=v;lab='UPS Declared Value for Carriage: 1%, min 3,505 KZT';}
      else if(carId==='poczta'){fee=Math.ceil(v*CFG.PLN_PER_USD/50)/CFG.PLN_PER_USD;cover=Math.min(v,70000/CFG.PLN_PER_USD);lab='Poczta Polska declared value: 1 PLN per 50 PLN; country limits apply';}
    }
    if(src==='freight'||src==='sea'){var md=src==='sea'?'sea':((STATE.svc==='freight'&&freightMode(currentCarrier(),currentRegion(),STATE.tier))||'air'),
        kgs=pcs.reduce(function(t,p){return t+(p.a||p.kg);},0);
      cover=Math.min(v,kgs*CFG.FREIGHT_INS_SDR_KG[md]*CFG.SDR_USD);fee=0;
      lab='Carrier liability '+(md==='sea'?'(Hague-Visby Rules, 2 SDR/kg)':md==='road'?'(CMR, 8.33 SDR/kg)':'(Montreal Convention, 22 SDR/kg)')+' ≈ '+fmt(cover)+'; the rest is covered by cargo insurance';}
    var excess=Math.max(0,v-cover),cargo=excess>0?Math.max(CFG.CARGO_INS.min,excess*CFG.CARGO_INS.pct):0;
    return {fee:fee,cover:cover,cargo:cargo,total:fee+cargo,label:lab,excess:excess};}

  /* ---------- Казпочта (Qazpost), тарифы 2026 для розничного бизнеса, KZT с НДС — ПРЯМОЙ почтовый маршрут из РК ----------
     Посылки: зона 3 — Европа, зона 4 — США; наземн./воздушн. EMS «Планета»: зона 2 — Европа, зона 4 — США.
     Доставку в стране назначения выполняет национальная почта (Royal Mail, La Poste, USPS и т.д.) — отдельно не оплачивается. */
  var KZP={
    par:{surf:{3:[26000,32500,39000,45500,52000,58500,65000,71500,78000],4:[34000,42000,50000,58000,66000,74000,82000,90000,98000]},
         air:{3:[29000,35500,42000,48500,55000,61500,68000,74500,81000],4:[37000,45000,53000,61000,69000,77000,85000,93000,101000]},
         add:{3:6500,4:8000}},            // до 2 кг, 3…10 кг, +1 кг сверх 10
    ems:{b:[0.3,0.5,1,1.5,2,2.5,3,3.5,4,4.5,5],2:[18400,20250,23000,25750,28500,31250,34000,36750,39500,42250,45000],4:[27100,29750,33750,37750,41750,45750,49750,53750,57750,61750,65750],add:{2:5500,4:8000}},
    maxKg:20, oversizeMul:1.5, emsHeavyMul:1.25};  // «Осторожно»/негабарит (>80×80×50 см) +50%; EMS >30 кг или >150 см ×1,25
  function kzpKZT(pcs,region,tier){var z=region==='US'?4:3,ze=region==='US'?4:2,sum=0,flags=[],i;
    for(i=0;i<pcs.length;i++){var p=pcs[i],d=[p.l,p.w,p.h].sort(function(a,b){return b-a;}),w=p.kg,c;
      if(tier==='fast'){var t=KZP.ems;c=w<=5?t[ze][band(t.b,w)]:t[ze][10]+Math.ceil(w-5)*t.add[ze];
        if(w>30||d[0]>150||d[0]+2*d[1]+2*d[2]>300){c*=KZP.emsHeavyMul;flags.push('EMS heavy/oversize coefficient ×1.25');}}
      else{if(w>KZP.maxKg)return null;var tab=tier==='mid'?KZP.par.air:KZP.par.surf,k=Math.max(2,Math.ceil(w));
        c=k<=10?tab[z][k-2]:tab[z][8]+(k-10)*KZP.par.add[z];
        if(d[0]>80||d[1]>80||d[2]>50){c*=KZP.oversizeMul;flags.push('oversize parcel surcharge +50%');}}
      sum+=c;}
    return {kzt:sum,flags:flags,name:tier==='fast'?'EMS «Planeta»':(tier==='mid'?'parcel by air':'parcel by surface')};}

  /* ---------- UPS — Service & Rates Guide 2026 Kazakhstan (с 07.06.2026), экспорт из РК, KZT без НДС ----------
     fast = UPS Express, mid = UPS Express Saver, econ = UPS Expedited. Зоны: 2 — DE/AT/FR/IT/ES/NL/BE/CZ/HU/SE/CH/GB/IE/…, 3 — PL/SK/SI/DK/NO/PT/RO/BG/HR/GR/CY/MT/IS, 4 — США */
  var UPS={"express":{"w":[0.5,1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0,5.5,6.0,6.5,7.0,7.5,8.0,8.5,9.0,9.5,10.0,11.0,12.0,13.0,14.0,15.0,16.0,17.0,18.0,19.0,20.0,21.0,22.0,23.0,24.0,25.0,26.0,27.0,28.0,29.0,30.0,31.0,32.0,33.0,34.0,35.0,40.0,45.0,50.0,55.0,60.0,65.0,70.0],"z":{"2":[68795,79620,90342,101167,112044,120897,129853,138731,147584,156566,163549,170636,177620,184759,191794,198855,205864,212925,219961,227022,237795,248543,259394,270193,280941,291766,302592,313391,324191,335042,345348,355602,365986,376267,386651,397035,407315,417647,427979,438415,448617,458975,469308,479614,489972,544852,599835,654741,709698,764630,819639,874545],"3":[79101,91770,104464,117133,129853,142496,155190,167859,180579,193222,201607,210070,218507,227022,235459,243844,252307,260796,269233,277670,291766,305811,319933,334055,348074,362196,376267,390415,404511,418556,430757,443010,455237,467438,479614,491841,504068,516269,528497,540672,552899,565100,577302,589529,601730,660400,719122,777844,836539,895209,953957,1012679],"4":[74428,87616,99817,112018,124194,136395,148596,160849,173025,185200,195506,205864,216222,226529,236861,247193,257473,267831,278189,288495,300697,312872,325099,337300,349476,361781,373982,386183,398436,410586,422787,435014,447241,459443,471644,483871,496098,508300,520501,532650,544852,557105,569332,581559,593760,651132,708322,765590,822988,880204,937550,994792]},"pk":[12494,14467,14212]},"saver":{"w":[0.5,1.0,1.5,2.0,2.5,3.0,3.5,4.0,4.5,5.0,5.5,6.0,6.5,7.0,7.5,8.0,8.5,9.0,9.5,10.0,11.0,12.0,13.0,14.0,15.0,16.0,17.0,18.0,19.0,20.0,21.0,22.0,23.0,24.0,25.0,26.0,27.0,28.0,29.0,30.0,31.0,32.0,33.0,34.0,35.0,40.0,45.0,50.0,55.0,60.0,65.0,70.0],"z":{"2":[62616,72767,83021,93249,103504,112797,122091,131307,140704,149998,156462,162952,169494,176010,182552,188990,195506,202074,208538,215080,225776,236523,247167,257862,268558,279228,289975,300671,311392,322010,331381,340649,349969,359315,368582,377902,387144,396515,405835,415077,424423,433716,443010,452304,461623,515127,568605,622083,675561,729039,782568,836072],"3":[72299,84397,96442,108592,120741,132864,144962,156955,169053,181202,188990,196934,204826,212692,220662,228553,236523,244337,252281,260277,272270,284368,296387,308537,320660,332757,344829,356926,369050,381121,392362,403447,414636,425772,436961,448150,459287,470450,481613,492801,501083,509546,517879,526212,534649,591398,648147,704922,761645,818367,875142,931917],"4":[68691,80659,92730,104957,117055,129178,141172,153269,165341,177438,186706,195973,205371,214587,223855,233200,242494,251814,261133,270427,281538,292779,303942,315079,326241,337456,348567,359808,370867,382056,392751,403447,414168,424838,435585,446255,456977,467646,478290,489063,499733,510454,521124,531897,542567,594617,646745,698847,750949,803051,855153,907177]},"pk":[11944,13314,12960]},"expedited":{"w":[1.0,2.0,3.0,4.0,5.0,6.0,7.0,8.0,9.0,10.0,11.0,12.0,13.0,14.0,15.0,16.0,17.0,18.0,19.0,20.0,21.0,22.0,23.0,24.0,25.0,26.0,27.0,28.0,29.0,30.0,31.0,32.0,33.0,34.0,35.0,40.0,45.0,50.0,55.0,60.0,65.0,70.0,75.0,80.0,85.0,90.0,95.0,100.0],"z":{"2":[72092,92341,111655,129334,147740,160538,172661,185434,197453,210174,219753,230215,239561,250022,259368,269752,278968,289274,298360,308614,316402,325229,332861,341688,349190,358043,365467,374242,381666,390363,397580,406276,413493,422112,429251,478991,526757,576263,623511,672913,719615,768861,820886,875532,926881,981397,1031630,1085886],"3":[83592,107527,131566,154619,178424,193975,208616,224166,238834,254254,265053,276839,287405,299165,309705,321361,331745,343375,353707,365285,374579,385145,394413,404901,413987,424578,433535,444100,452875,463415,469463,477355,483404,491140,497111,549862,600458,653053,702975,755414,804790,856970,914783,975738,1032980,1093674,1149722,1210261],"4":[79854,103867,127828,150907,174712,193014,210537,228787,246051,264275,274087,284939,294752,305421,315104,325878,335353,346075,355472,366142,374917,385145,393893,404122,412715,422787,431328,441400,449889,459884,468165,478212,486441,496384,504484,552925,599108,647446,693058,741188,786385,834229,890303,949674,1005332,1064443,1119012,1177889]},"pk":[10859,12103,11779]}};
  UPS.zone={AT:2,BE:2,CZ:2,EE:2,FI:2,FR:2,DE:2,HU:2,IE:2,IT:2,LV:2,LT:2,LU:2,NL:2,ES:2,SE:2,CH:2,GB:2,LI:2,MC:2,
            BG:3,HR:3,CY:3,DK:3,GR:3,MT:3,NO:3,PL:3,PT:3,RO:3,SK:3,SI:3,IS:3,US:4};
  UPS.svc={fast:'express',mid:'saver',econ:'expedited'}; UPS.name={fast:'UPS Express',mid:'UPS Express Saver',econ:'UPS Expedited'};
  UPS.largePkg=27414; UPS.addHandling=1818;
  function upsKZT(w,z,tier){var t=UPS[UPS.svc[tier]],zi=String(z),ws=t.w,max=ws[ws.length-1];
    w=w<=10&&t.w[0]===0.5?Math.ceil(w*2)/2:Math.ceil(w); if(w>max)return w*t.pk[['2','3','4'].indexOf(zi)];
    for(var i=0;i<ws.length;i++)if(w<=ws[i])return t.z[zi][i]; return null;}

  /* ---------- Česká pošta — Standardní balík do zahraničí (ceník 1.7.2026), CZK. Отправка из CZ (плечо от EU-хаба) ----------
     mid/fast = prioritní, econ = ekonomický. Цен. skupina: PL 1, DE/AT/SK 2, остальные EU/CH/NO/GB 3, США 7 */
  var CZP={b:[1,2,3,4,5,6,7,8,9,10,15,20,25,30],
    pri:{1:[337,383,428,474,520,566,612,657,703,749,1183,1460,null,null],2:[358,416,474,531,589,647,704,762,820,877,1410,1759,2108,2457],3:[541,645,748,852,956,1060,1163,1267,1371,1475,2412,3039,3667,4295],7:[602,862,1122,1382,1642,1902,2162,2422,2682,2942,4241.90,5542.02,6842.14,8142.26]},
    eco:{1:[311,353,396,438,480,522,564,607,649,691,1092,1347,null,null],2:[331,384,437,490,544,597,650,703,757,810,1302,1624,1946,2268],3:[499,595,691,787,882,978,1074,1170,1265,1361,2226,2806,3385,3964],7:[555,795,1035,1275,1515,1755,1995,2235,2475,2715,3915.60,5115.71,6315.82,7515.94]},
    grp:{PL:1,DE:2,AT:2,SK:2,US:7}, maxLen:150, maxLG:300};
  function czpCZK(pcs,cc,tier){var g=CZP.grp[cc]||3,tab=(tier==='econ'?CZP.eco:CZP.pri)[g],sum=0,i;
    for(i=0;i<pcs.length;i++){var p=pcs[i],d=[p.l,p.w,p.h].sort(function(a,b){return b-a;}),k=band(CZP.b,p.kg);
      if(k<0||tab[k]==null||d[0]>CZP.maxLen||d[0]+2*d[1]+2*d[2]>CZP.maxLG)return null; sum+=tab[k];}
    return {czk:sum,name:tier==='econ'?'Standardní balík – ekonomický':'Standardní balík – prioritní'};}

  /* ---------- La Poste — Colissimo International 2026 (из Франции), EUR. EU/CH, Великобритания, США (зона C) ---------- */
  var COL={b:[0.5,1,2,5,10,15,30],eu:[14.99,19.39,22.19,28.59,46.99,67.99,87.99],uk:[18.99,23.39,26.19,32.59,50.99,71.99,91.99],
    bUS:[0.5,1,2,5,10,15,20],us:[35.19,39.19,53.99,78.69,148.99,210.79,256.89],maxLen:150,maxLG:300};
  function colEUR(pcs,cc){var us=cc==='US',sum=0,i;
    for(i=0;i<pcs.length;i++){var p=pcs[i],d=[p.l,p.w,p.h].sort(function(a,b){return b-a;}),k=band(us?COL.bUS:COL.b,p.kg);
      if(k<0||d[0]>COL.maxLen||d[0]+2*d[1]+2*d[2]>COL.maxLG)return null; sum+=(us?COL.us:(cc==='GB'?COL.uk:COL.eu))[k];}
    return {eur:sum};}


  /* ======================= ГРУЗОВАЯ ДОСТАВКА (авиа / авто) =======================
     Turkish Cargo, Emirates SkyCargo, Qatar Airways Cargo — авиаперевозчики (через свои хабы), бронируются через агента;
     DSV, Kuehne+Nagel, Rhenus, CargoPoint, Corporate Service Munich — экспедиторы (авиа + авто), LKW WALTER — авто по Европе.
     Публичных прайсов у них нет: ставка ОРИЕНТИРОВОЧНАЯ (рынок 2026), точную даёт запрос котировки. Все цифры — в USD, редактируются здесь.
     Авиа: платный вес = max(факт, объём/6000). Авто: 1 м³ = 333 кг.  econ = консолидация, mid = прямой рейс/LTL, fast = приоритет/экспресс. */
  var FRT={
    air:{ perKg:{EU:{econ:3.4,mid:4.3,fast:5.9}, US:{econ:4.6,mid:5.8,fast:7.6}}, min:{EU:260,US:320},
          origin:160,          // экспортное оформление, handling, AWB, досмотр в Алматы
          dest:{EU:280,US:340},// терминал, брокер, доставка из аэропорта до двери
          crate:{kg:70,usd:120} },           // деревянная обрешётка для места > 70 кг (за место)
    road:{ perKg:{EU:{econ:0.85,mid:1.10,fast:1.55}}, min:{EU:300}, origin:120, dest:{EU:90}, cbmKg:333 },
    mul:{turkishcargo:1, emirates:1.04, qatar:1.02, dsv:1.08, kuehne:1.12, rhenus:1.06, cargopoint:1.05, csmunich:1.05, lkwwalter:1},
    deLeg:{air:0.55, road:0.6}      // доля ставки для плеча KZ→DE при маршруте через Германию (остаток — доставка по ЕС/в США от хаба)
  };
  function freightMode(car,region,tier){if(!car)return 'air';
    if(car.mode==='road')return 'road'; if(car.mode==='air')return 'air';
    return (region==='EU'&&tier==='econ')?'road':'air';}   // экспедитор: эконом по ЕС — автогруппаж, иначе авиа
  function freightCost(car,region,tier,m,viaDE){
    var mode=freightMode(car,region,tier), T=FRT[mode], R=(mode==='road'?'EU':region), pcs=[],cw=0,crates=0;
    m.pieces.forEach(function(p){for(var i=0;i<p.q;i++)pcs.push(p);});
    pcs.forEach(function(p){var vol=p.l*p.w*p.h/1e6, a=p.a||p.kg;
      cw+=mode==='road'?Math.max(a,vol*T.cbmKg):Math.max(a,vol*1e6/6000);
      if(mode==='air'&&a>FRT.air.crate.kg)crates++;});
    cw=Math.ceil(cw);
    var line=Math.max(T.min[R],cw*T.perKg[R][tier]), mul=FRT.mul[car?car.id:'']||1.08;
    var ship=(T.origin+line+T.dest[R])*mul+crates*FRT.air.crate.usd;
    if(viaDE){ship=(T.origin+line*FRT.deLeg[mode])*mul+leg2Cost('courier',region,m.kg);}
    var hub=car&&car.hub?' via '+car.hub:'';
    return {ship:ship,mode:mode,cw:cw,crates:crates,
      label:(car?car.name:'Freight')+' — '+(mode==='road'?'road freight (groupage/LTL)':'air cargo'+hub)+', chargeable '+cw+' kg',
      eta:(mode==='road'?ETA.road:ETA.freight)[tier]};}

  /* ======================= МОРСКОЙ СБОРНЫЙ ГРУЗ (LCL) =======================
     Алматы → ж/д или авто до порта (Актау / Поти / порты Китая) → море до Гамбурга, Роттердама (ЕС) или порта США → доставка до двери.
     Оплата за «revenue ton» W/M = max(объём в м³, вес в тоннах), минимум 1 W/M. Ставки ОРИЕНТИРОВОЧНЫЕ (рынок 2026), USD.
     econ = отправка раз в 2 недели, mid = еженедельная консолидация, fast = ближайший рейс. */
  var SEA={ perWM:{EU:{econ:140,mid:170,fast:210}, US:{econ:160,mid:195,fast:240}},
    pre:70,                    // плечо Алматы → порт, за W/M
    origin:170,                // забор груза, экспортное оформление, CFS, документы
    dest:{EU:260,US:320},      // CFS/THC, таможенный брокер, доставка до двери
    pack:{kg:30,usd:60},       // паллета / обрешётка для места > 30 кг (обязательно для LCL)
    mul:{kuehne_sea:1.10, dsv_sea:1.06, rhenus_sea:1.04} };
  function seaCost(car,region,tier,m,viaDE){var pcs=[],vol=0,t=0,packs=0;
    m.pieces.forEach(function(p){for(var i=0;i<p.q;i++)pcs.push(p);});
    pcs.forEach(function(p){vol+=p.l*p.w*p.h/1e6;t+=(p.a||p.kg)/1000;if((p.a||p.kg)>SEA.pack.kg)packs++;});
    var wm=Math.max(1,Math.ceil(Math.max(vol,t)*100)/100), R=viaDE?'EU':region;
    var line=wm*(SEA.perWM[R][tier]+SEA.pre), mul=SEA.mul[car?car.id:'']||1.06;
    var ship=(SEA.origin+line+SEA.dest[R])*mul+packs*SEA.pack.usd;
    if(viaDE)ship+=leg2Cost('courier',region,m.kg);
    return {ship:ship,wm:wm,packs:packs,eta:ETA.sea[tier],
      label:(car?car.name:'Sea freight')+' — sea freight LCL'+(viaDE?' via Germany Hub':'')+', '+wm.toFixed(2)+' W/M'};}

  function carrierShip(carId,region,cc,tier,m,viaDE){
    var kg=m.kg, res={ship:0,src:'generic',label:'',notes:[],pcs:[]};
    if(STATE.svc==='sea'){var cs0=currentCarrier(),sc=seaCost(cs0,region,tier,m,viaDE);
      res.ship=sc.ship;res.src='sea';res.label=sc.label;res.eta=sc.eta;res.mode='sea';res.cw=sc.wm;
      m.pieces.forEach(function(p){for(var i=0;i<p.q;i++)res.pcs.push(p);});
      if(sc.packs)res.notes.push(sc.packs+' piece(s) over '+SEA.pack.kg+' kg — pallet / crate included');
      res.notes.push('Door-to-door: pickup in Kazakhstan, rail/truck to the port, ocean freight, customs brokerage and delivery');
      return res;}
    if(STATE.svc==='freight'){var car0=currentCarrier(),fr=freightCost(car0,region,tier,m,viaDE);
      res.ship=fr.ship;res.src='freight';res.label=fr.label;res.eta=fr.eta;res.mode=fr.mode;res.cw=fr.cw;
      m.pieces.forEach(function(p){for(var i=0;i<p.q;i++)res.pcs.push(p);});
      if(fr.crates)res.notes.push(fr.crates+' piece(s) over '+FRT.air.crate.kg+' kg — wooden crate included');
      if(car0&&car0.mode==='air')res.notes.push('Airline capacity is booked through our forwarding agent; door delivery at destination included');
      if(fr.mode==='road'&&region!=='EU')res.notes.push('Road freight is available within Europe only');
      return res;}
    function generic(){res.ship=viaDE?legCost(STATE.svc,'DE',tier,kg)+leg2Cost(STATE.svc,region,kg):legCost(STATE.svc,region,tier,kg);res.src='generic';}
    if(carId==='dhl'){
      var z=viaDE?2:(DHL.zone[cc]||(region==='US'?4:2)), w=0, heavy=0;
      m.pieces.forEach(function(p){w+=p.kg*p.q;if(p.kg>70)heavy+=p.q;});
      var kzt=dhlKZT(w,z)+DHL.tierAdd[tier]; kzt*=1+CFG.FUEL.dhl; kzt+=heavy*DHL.overweight+DHL.exportDecl;
      res.ship=kzt/CFG.KZT_PER_USD; res.src='tariff'; res.label='DHL '+DHL.tierName[tier]+', zone '+z+(viaDE?' (KZ→DE)':'');
      if(viaDE)res.ship+=leg2Cost('courier',region,kg);
      if(heavy)res.notes.push(heavy+' piece(s) over 70 kg — DHL overweight surcharge included');
      return res;}
    var pcs=[];m.pieces.forEach(function(p){for(var i=0;i<p.q;i++)pcs.push(p);});
    res.pcs=pcs;
    if(carId==='fedex'&&region==='US'&&!viaDE){
      var f=fedexUSD(kg,tier);
      res.ship=f.usd*(1+CFG.FUEL.fedex); res.src='tariff'; res.label='FedEx '+FEDEX.tierName[tier]+', zone M';
      if(f.mw)res.notes.push('over 100 lb — FedEx Multiweight / International Freight per-lb rate');
      return res;}
    if(carId==='ups'){
      var uz=viaDE?2:(UPS.zone[cc]||(region==='US'?4:2)),uw=0,bad=0,large=0;
      pcs.forEach(function(p){var d=[p.l,p.w,p.h].sort(function(a,b){return b-a;}),lg=d[0]+2*d[1]+2*d[2];
        if(p.kg>70||lg>400)bad++; else if(lg>300){large++;uw+=Math.max(40,p.kg);} else uw+=p.kg;});
      if(bad){generic();res.notes.push(bad+' piece(s) over UPS limits (70 kg / 400 cm length+girth) — UPS freight, manager confirms');return res;}
      var ukzt=upsKZT(uw,uz,tier)*(1+CFG.FUEL.ups)+large*UPS.largePkg;
      res.ship=ukzt/CFG.KZT_PER_USD+(viaDE?leg2Cost('courier',region,kg):0); res.src='tariff'; res.label=UPS.name[tier]+', zone '+uz+(viaDE?' (KZ→DE)':'');
      if(large)res.notes.push(large+' large package(s) — UPS Large Package Surcharge, min. 40 kg billable');
      return res;}
    if(STATE.svc==='post'&&!viaDE){
      var kp=kzpKZT(pcs,region,tier),cn=(currentCarrier()||{}).name||'national post';
      if(kp){res.ship=kp.kzt/CFG.KZT_PER_USD;res.src='tariff';res.post='kazpost';
        res.label='Kazpost '+kp.name+' — handed over to the national post of the destination country';kp.flags.forEach(function(x){if(res.notes.indexOf(x)<0)res.notes.push(x);});return res;}
      generic();res.notes.push('over the Kazpost parcel limit (20 kg per parcel) — choose Express (EMS) or freight, manager confirms');return res;}
    if(viaDE&&STATE.svc==='post'&&carId==='postnl'){var pn=pnlEUR(pcs,cc||'DE');
      if(pn){res.ship=legCost('post','DE',tier,kg)+pn.eur*EURUSD;res.src='tariff';res.label='PostNL parcel from NL'+(pn.approx?' (nearest listed destination)':'');return res;}
      generic();res.notes.push('exceeds PostNL limits (23 kg, 100×50×50 cm) — manager arranges freight');return res;}
    if(viaDE&&STATE.svc==='post'&&carId==='poczta'){var pp=ppPLN(pcs,cc||'DE',tier);
      if(pp){res.ship=legCost('post','DE',tier,kg)+pp.pln/CFG.PLN_PER_USD;res.src='tariff';res.label='Poczta Polska '+pp.name+' from PL';return res;}
      generic();res.notes.push('exceeds Poczta Polska limits (20 kg per parcel) — manager arranges freight');return res;}
    if(viaDE&&STATE.svc==='post'&&carId==='ceska'){var cz=czpCZK(pcs,cc||'DE',tier);
      if(cz){res.ship=legCost('post','DE',tier,kg)+cz.czk/CFG.CZK_PER_USD;res.src='tariff';res.label='Česká pošta '+cz.name+' from CZ';return res;}
      generic();res.notes.push('exceeds Česká pošta limits (30 kg, 150 cm) — manager arranges freight');return res;}
    if(viaDE&&STATE.svc==='post'&&carId==='laposte'){var co=colEUR(pcs,cc||'DE');
      if(co){res.ship=legCost('post','DE',tier,kg)+co.eur*EURUSD;res.src='tariff';res.label='La Poste Colissimo International from FR';return res;}
      generic();res.notes.push('exceeds Colissimo limits (30 kg, 150 cm, length+girth 300 cm) — manager arranges freight');return res;}
    if(carId==='austrian'&&viaDE){
      var a=atpEUR(pcs,cc||'DE',tier);
      if(a){res.ship=legCost('post','DE',tier,kg)+a.eur*EURUSD; res.src='tariff'; res.label='Austrian Post '+a.name+', zone '+a.zone;
        if(a.bulky)res.notes.push('bulky-parcel (Sperrgut) surcharge included');return res;}
      generic(); res.notes.push('exceeds Austrian Post limits (31.5 kg / 200 cm / girth 360 cm) — manager arranges freight'); return res;}
    generic(); return res;}

  function legCost(svc,region,tier,kg){var t=SHIP[svc][region][tier];return t[0]+t[1]*kg;}
  function leg2Cost(svc,region,kg){var t=LEG2[svc][region];return t[0]+t[1]*kg;}
  function compute(region){
    var div=CFG.DIV[STATE.svc], m=metrics(div); if(!m.goods)return null;
    var kg=m.kg, goods=m.goods, viaDE=(STATE.route==='de');
    var deAgent=viaDE?CFG.DE_AGENT_EUR*EURUSD:0, car=currentCarrier(), cc=ccFromCountry(countryVal());
    var cs=carrierShip(car?car.id:'',region,cc,STATE.tier,m,viaDE), ship=cs.ship;
    var kzAgent=Math.min(goods*CFG.KZ_AGENT_PCT,CFG.KZ_AGENT_CAP_USD);
    // пошлина по каждой позиции: категория + страна происхождения (RU → США Column 2)
    var tab=(DUTY[region]||DUTY.EU), duty=0, ruVal=0, orig={};
    m.items.forEach(function(it){var r=tab[it.cat]!=null?tab[it.cat]:tab['default'];
      if(it.origin==='RU'){ruVal+=it.value; if(region==='US'&&CFG.US_COL2>0)r=CFG.US_COL2;}
      orig[it.origin]=1; duty+=it.value*r;});
    if(m.items.length&&goods!==m.items.reduce(function(t,i){return t+i.value;},0))duty*=goods/Math.max(1,m.items.reduce(function(t,i){return t+i.value;},0));
    var col2=(region==='US'&&ruVal>0&&CFG.US_COL2>0), origins=Object.keys(orig);
    var extra=0, vat=0;
    if(region==='US'){extra=Math.min(Math.max(goods*CFG.MPF.pct,CFG.MPF.min),CFG.MPF.max)+goods*CFG.SECTION122;}
    else if(CFG.INCLUDE_VAT){vat=(goods+duty+ship)*VAT_EU;}
    var insInfo=insurance(cs.post||(car?car.id:''),cs.src,goods,cs.pcs||[]), ins=STATE.insure?insInfo.total:0;
    var subtotal=ship+kzAgent+deAgent+duty+extra+vat+ins;
    var conv=(goods+subtotal)*(CFG.CONV[STATE.pay]||0);
    var allinUSD=subtotal+conv;
    // "Other expenses" = агент KZ + конвертация
    var other=kzAgent+conv;
    return {region:region,kg:kg,goods:goods,freight:m.freight,viaDE:viaDE,box:m.box,
      parts:{ship:ship,deAgent:deAgent,duty:duty+extra,vat:vat,ins:ins,other:other},
      allinUSD:allinUSD, eta:cs.eta||ETA[STATE.svc][STATE.tier], src:cs.src, cw:cs.cw, mode:cs.mode, tariff:cs.label, notes:cs.notes, cc:cc,
      insInfo:insInfo, col2:col2, origins:origins, euNotice:(region==='EU'&&ruVal>0&&!!CFG.EU_ORIGIN_NOTICE)};
  }
  function toCur(usd){return usd*(FX.rates[STATE.cur]||1);}
  function fmt(usd){var v=toCur(usd),sym=CUR_SYM[STATE.cur];
    var s=new Intl.NumberFormat('en-US',{maximumFractionDigits:0}).format(Math.max(0,Math.round(v)));
    return sym?(sym+s):(s+' '+STATE.cur);}

  /* ======================= ФОРМА / ИТОГ ======================= */
  function fmtUSD(usd){return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(Math.max(0,Math.round(usd)));}
  function host(){var f=FC();return f&&f.root?f.root.querySelector('.flx-step[data-step="shipping"] .flx-step-panel'):null;}
  function countryVal(){var f=FC();if(!f||!f.root)return'';
    var fs=f.root.querySelectorAll('.flx-step[data-step="shipping"] .flx-field'),i;
    for(i=0;i<fs.length;i++){var l=clean(fs[i].querySelector('label')&&fs[i].querySelector('label').textContent);
      if(/^country$/i.test(l)){var c=fs[i].querySelector('input,select,textarea');return clean(c&&c.value);}}return'';}
  var EUW=('austria belgium bulgaria croatia cyprus czech denmark estonia finland france germany greece hungary ireland italy latvia lithuania luxembourg malta netherlands holland poland portugal romania slovakia slovenia spain sweden deutschland espana italia norway switzerland europe eu').split(' ');
  function regionFromCountry(raw){var c=(raw||'').toLowerCase();if(!c)return null;
    var k=ccFromCountry(raw); if(k==='US')return'US'; if(k)return'EU';
    if(/^(us|usa|u\.s|united states|america)/.test(c))return'US';
    for(var i=0;i<EUW.length;i++){if(c.indexOf(EUW[i])>-1)return'EU';}return null;}
  function setHidden(n,v){var f=FC();
    if(f&&typeof f.hiddenNative==='function'){var el=f.hiddenNative(n);if(el)el.value=(v==null?'':String(v));return;}
    var form=f&&f.nativeForm;if(!form)return;
    var inp=Array.prototype.slice.call(form.querySelectorAll('input[type="hidden"]')).filter(function(x){return x.name===n;})[0];
    if(!inp){inp=document.createElement('input');inp.type='hidden';inp.name=n;form.appendChild(inp);} inp.value=(v==null?'':String(v));}
  function goodsBaseUSD(){var f=FC();if(!f||!f.root)return metrics(CFG.DIV.courier).goods;
    var t=f.root.querySelector('.flx-order-totals');if(!t)return metrics(CFG.DIV.courier).goods;
    var s=num(t.querySelector('[data-sum="subtotal"]')&&t.querySelector('[data-sum="subtotal"]').textContent);
    return s>0?s:metrics(CFG.DIV.courier).goods;}
  function writeSummary(q){
    var f=FC();if(!f||!f.root)return;
    var totals=f.root.querySelector('.flx-order-totals');if(!totals)return;
    var totalRow=totals.querySelector('.flx-order-row.is-total');
    var totalEl=totalRow&&totalRow.querySelector('[data-sum="total"]');
    var mob=f.root.querySelector('.flx-order-head-total');
    var row=totals.querySelector('.fs-summary-row');
    if(!q){if(row)row.remove();var b=goodsBaseUSD();if(totalEl)totalEl.textContent=fmtUSD(b);if(mob)mob.textContent=fmtUSD(b);return;}
    if(!row){row=document.createElement('div');row.className='flx-order-row fs-summary-row';
      if(totalRow)totals.insertBefore(row,totalRow);else totals.appendChild(row);}
    var rh='<span>Shipping &amp; fees (all-in, estimate)</span><strong>'+fmtUSD(q.allinUSD)+'</strong>'; if(row.innerHTML!==rh)row.innerHTML=rh;
    var nt=fmtUSD(goodsBaseUSD()+q.allinUSD); TW.busy=true;
    if(totalEl&&totalEl.textContent!==nt)totalEl.textContent=nt; if(mob&&mob.textContent!==nt)mob.textContent=nt; TW.busy=false;
  }
  function commit(q){
    var car=currentCarrier();
    selected={region:q.region,route:STATE.route,svc:STATE.svc,carrierId:STATE.carrierId,tier:STATE.tier,cur:STATE.cur,insure:STATE.insure,pay:STATE.pay,allinUSD:q.allinUSD,eta:q.eta};
    try{sessionStorage.setItem(SEL_KEY,JSON.stringify(selected));}catch(e){}
    setHidden(HIDDEN.carrier, car?car.name:({post:'National post',courier:'Courier',freight:'Air / road cargo',sea:'Sea freight (LCL)'}[STATE.svc]));
    setHidden(HIDDEN.service, ({post:'Post',courier:'Courier',sea:'Sea freight (LCL)',freight:(q.mode==='road'?'Road freight':'Air cargo')}[STATE.svc])+' / '+({econ:'Economy',mid:'Standard',fast:'Express'}[STATE.tier]));
    setHidden(HIDDEN.route, STATE.route==='de'?'via Germany Hub':'Directly from Kazakhstan');
    setHidden(HIDDEN.rate, fmt(q.parts.ship)); setHidden(HIDDEN.allin, fmt(q.allinUSD));
    setHidden(HIDDEN.origin, originText(q.origins)); setHidden(HIDDEN.currency, STATE.cur); setHidden(HIDDEN.days, q.eta); setHidden(HIDDEN.region, q.region);
    setHidden(HIDDEN.estdate, estDate()+' (estimate, final cost confirmed by manager)');
    setHidden(HIDDEN.dims, q.box[0]+'×'+q.box[1]+'×'+q.box[2]+' cm, '+q.kg.toFixed(1)+' kg');
    writeSummary(q);
  }
  function clearSel(){selected=null;try{sessionStorage.removeItem(SEL_KEY);}catch(e){}
    [HIDDEN.carrier,HIDDEN.service,HIDDEN.route,HIDDEN.rate,HIDDEN.allin,HIDDEN.days,HIDDEN.dims,HIDDEN.estdate].forEach(function(n){setHidden(n,'');});
    writeSummary(null);}
  /* Итог: если другой скрипт перезаписал сумму — возвращаем свою, но не чаще 4 раз за 2 с
     (иначе два скрипта перетягивают значение бесконечно и страница зависает). */
  var TW={busy:false,hits:[],pending:false};
  function watchTotal(){var f=FC();if(!f||!f.root)return;var el=f.root.querySelector('[data-sum="total"]');if(!el||el.__flw)return;el.__flw=1;
    new MutationObserver(function(){if(TW.busy||TW.pending||!selected)return;TW.pending=true;
      requestAnimationFrame(function(){TW.pending=false;var now=Date.now();
        TW.hits=TW.hits.filter(function(t){return now-t<2000;});
        if(TW.hits.length>=4)return;
        var exp=goodsBaseUSD()+selected.allinUSD;
        if(Math.abs(num(el.textContent)-exp)>1){TW.hits.push(now);TW.busy=true;
          el.textContent=fmtUSD(exp);var m=f.root.querySelector('.flx-order-head-total');if(m)m.textContent=fmtUSD(exp);TW.busy=false;}
        var t=f.root.querySelector('.flx-order-totals');if(t&&!t.querySelector('.fs-summary-row')){var q=recompute();if(q){TW.busy=true;writeSummary(q);TW.busy=false;}}});
    }).observe(el,{childList:true,characterData:true,subtree:true});}

  /* ======================= UI ======================= */
  function currentRegion(){var a=regionFromCountry(countryVal());var sel=document.getElementById('f4-region');
    if(a){if(sel&&sel.value!==a)sel.value=a;return a;} return (sel&&sel.value)||'EU';}
  function recompute(){return compute(currentRegion());}
  /* ---------- какие службы реально возят в выбранную страну ----------
     Почта напрямую из РК: Казпочта сдаёт посылку национальной почте страны получателя — показывается только она
     (или «национальная почта страны», если её нет среди логотипов). Почта через хаб в Германии: европейские почты,
     у которых есть международный тариф из ЕС (PostNL, Poczta Polska, Česká pošta, La Poste, Austrian Post).
     Курьеры: DHL / UPS / FedEx — везде; DPD — по Европе через хаб; Parcelforce — вручение в Великобритании. */
  var POST_OF={CZ:'ceska',GB:'royalmail',FR:'laposte',AT:'austrian',PL:'poczta',NL:'postnl',US:'usps',JP:'jppost'};
  var HUB_POSTS=['postnl','poczta','ceska','laposte','austrian'];
  var LOCAL_POST={DE:'Deutsche Post',IT:'Poste Italiane',ES:'Correos',BE:'bpost',SE:'PostNord',DK:'PostNord',FI:'Posti',IE:'An Post',PT:'CTT',
    HU:'Magyar Posta',SK:'Slovenská pošta',RO:'Poșta Română',GR:'ELTA',HR:'Hrvatska pošta',SI:'Pošta Slovenije',BG:'Bulgarian Posts',LT:'Lietuvos paštas',
    LV:'Latvijas Pasts',EE:'Omniva',LU:'POST Luxembourg',CH:'Swiss Post',NO:'Posten',MT:'MaltaPost',CY:'Cyprus Post',IS:'Pósturinn',LI:'Liechtensteinische Post'};
  function byId(id){return CARRIERS.filter(function(c){return c.id===id;})[0];}
  function carriersFor(region){var cc=ccFromCountry(countryVal()),viaDE=STATE.route==='de',out=[];
    if(STATE.svc==='post'){
      if(!viaDE){var pid=cc&&POST_OF[cc],pc=pid&&byId(pid);
        if(pc)out.push(pc); else out.push({id:'localpost',name:(cc&&LOCAL_POST[cc])||'National post',regions:['US','EU'],type:'post',virtual:true});}
      else{HUB_POSTS.forEach(function(id){var c=byId(id);if(c)out.push(c);});}
      return out;}
    if(STATE.svc==='courier'){['dhl','ups','fedex'].forEach(function(id){out.push(byId(id));});
      if(viaDE&&region==='EU')out.push(byId('dpd'));
      if(cc==='GB')out.push(byId('parcelforce'));
      return out.filter(Boolean);}
    return CARRIERS.filter(function(c){return c.type===STATE.svc&&c.regions.indexOf(region)>-1;});}
  function currentCarrier(){var list=carriersFor(currentRegion());
    var c=list.filter(function(x){return x.id===STATE.carrierId;})[0]; return c||list[0]||null;}
  function ensureCarrier(){var list=carriersFor(currentRegion());
    if(!list.length){STATE.carrierId=null;return;}
    if(!list.some(function(x){return x.id===STATE.carrierId;}))STATE.carrierId=list[0].id;}

  function seg(id,opts){return '<div class="seg" id="'+id+'">'+opts.map(function(o){
    return '<button type="button" data-v="'+o[0]+'">'+o[1]+'</button>';}).join('')+'</div>';}

  function build(){
    var h=host(); if(!h||document.getElementById('fls4'))return;
    if(CFG.HIDE_EASYPOST_BOX){var ep=h.querySelector('.filin-ep-box');if(ep)ep.style.display='none';}
    var box=document.createElement('div'); box.id='fls4';
    box.innerHTML=
      '<p class="t">Shipping &amp; import — all-in estimate</p>'+
      '<p class="sub">Total cost to deliver from our Kazakhstan hub (directly or via our Germany Hub) to your country, including carrier, customs duty, taxes, insurance and other fees. Recalculates automatically. The amount is an estimate — the exact cost is confirmed by our manager by '+contact()+'.</p>'+
      '<div class="grid">'+
        '<div class="f"><label>Destination</label><select id="f4-region"><option value="EU">Europe (EU)</option><option value="US">United States</option></select></div>'+
        '<div class="f"><label>Currency</label>'+seg('f4-cur',currencies().map(function(c){return [c,c];}))+'</div>'+
        '<div class="f"><label>Route</label>'+seg('f4-route',[['direct','Directly from Kazakhstan'],['de','via Germany Hub']])+'</div>'+
        '<div class="f"><label>Service</label>'+seg('f4-svc',[['post','National post'],['courier','Courier'],['freight','Air / road cargo'],['sea','Sea freight (LCL)']])+'</div>'+
        '<div class="f"><label>Tariff</label>'+seg('f4-tier',[['econ','Economy'],['mid','Standard'],['fast','Express']])+'</div>'+
        '<div class="f"><label>Insurance</label>'+seg('f4-ins',[['no','None'],['yes','Full value']])+'</div>'+
        '<div class="f wide"><label>Delivery service</label><div class="cwrap" id="f4-cwrap"><div class="carriers" id="f4-carriers"></div></div></div>'+
      '</div>'+
      '<div class="out" id="f4-out"></div>'+
      '';
    var actions=h.querySelector('.flx-actions'); if(actions)h.insertBefore(box,actions); else h.appendChild(box);

    if(currencies().indexOf(STATE.cur)<0)STATE.cur='USD';
    setSeg('f4-cur',STATE.cur); setSeg('f4-route',STATE.route); setSeg('f4-svc',STATE.svc);
    setSeg('f4-tier',STATE.tier); setSeg('f4-ins',STATE.insure?'yes':'no');
    var rsel=document.getElementById('f4-region'); var auto=regionFromCountry(countryVal()); rsel.value=auto||'EU';
    ensureCarrier(); renderCarriers(); rebuildCur();

    box.addEventListener('click',function(e){
      var car=e.target.closest('.car'); if(car){STATE.carrierId=car.getAttribute('data-id');carHold(6000);carMark();render(true);return;}
      var b=e.target.closest('.seg button'); if(!b)return;
      var segId=b.parentNode.id, v=b.getAttribute('data-v');
      if(segId==='f4-cur')STATE.cur=v; else if(segId==='f4-route'){STATE.route=v;ensureCarrier();renderCarriers();}
      else if(segId==='f4-svc'){STATE.svc=v;ensureCarrier();renderCarriers();}
      else if(segId==='f4-tier')STATE.tier=v; else if(segId==='f4-ins')STATE.insure=(v==='yes');
      setSeg(segId,v); render(true);});
    box.addEventListener('keydown',function(e){var car=e.target.closest&&e.target.closest('.car');
      if(car&&(e.key==='Enter'||e.key===' ')){e.preventDefault();car.click();}});
    rsel.addEventListener('change',function(){ensureCarrier();renderCarriers();render(true);});
    var itm=null,lastKey='';
    function onField(){itm=null;var reg=currentRegion(),key=reg+'|'+STATE.svc+'|'+ccFromCountry(countryVal());
      if(key===lastKey)return; lastKey=key;
      ensureCarrier();renderCarriers();render(false);}
    // пересчёт только после паузы в наборе и только если страна/регион реально изменились
    h.addEventListener('input',function(e){if(e.target.closest('#fls4'))return;if(itm)clearTimeout(itm);itm=setTimeout(onField,350);});
    h.addEventListener('change',function(e){if(e.target.closest('#fls4'))return;if(itm)clearTimeout(itm);onField();});
    document.addEventListener('filin:fx-ready',function(){rebuildCur();render(false);});

    render(false); watchTotal();
  }
  function rebuildCur(){var el=document.getElementById('f4-cur');if(!el)return;
    var list=currencies();if(list.indexOf(STATE.cur)<0)STATE.cur='USD';
    var html=list.map(function(c){return '<button type="button" data-v="'+c+'">'+c+'</button>';}).join('');
    if(el.innerHTML!==html)el.innerHTML=html; el.classList.toggle('many',list.length>3); setSeg('f4-cur',STATE.cur);}
  function setSeg(id,v){var s=document.getElementById(id);if(!s)return;
    Array.prototype.slice.call(s.querySelectorAll('button')).forEach(function(b){b.classList.toggle('on',b.getAttribute('data-v')===v);});}
  var LOGO_BG={"dhl":"#ffcf02","austrian":"#fefefe","jppost":"#ffffff","laposte":"#ffffff","parcelforce":"#df0413","poczta":"#d42c19","postnl":"#fefefe","royalmail":"#fefefe","dpd":"#ffffff","usps":"#ffffff","ceska":"#08326d","fedex":"#532f9b","ups":"#ffffff","yamato":"#ffffff"};
  function logoOf(c){var L=window.__FLSHIP_LOGOS__||{},x=L[c.logo||c.id];
    if(x&&x.src)return x; if(CFG.LOGO_BASE)return {src:CFG.LOGO_BASE+c.id+'.webp',bg:LOGO_BG[c.id]||'#fff'}; return null;}
  function logoHTML(c){var x=logoOf(c);
    return '<div class="lg" style="background:'+((x&&x.bg)||'#fff')+'">'+(x?'<'+'img src="'+x.src+'" alt="'+c.name+' logo" decoding="async" draggable="false">':'<em class="nm">'+c.name+'</em>')+'</div>';}
  window.__flshipLogos=function(){if(document.getElementById('f4-carriers'))renderCarriers();};
  /* ---------- карусель служб: автопрокрутка по кругу, свайп (touch) и перетаскивание мышью ---------- */
  var CAR={pos:0,loop:false,half:0,hover:false,drag:null,moved:false,until:0,vis:true,last:0,started:false};
  var RM=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  function carHold(ms){CAR.until=Date.now()+ms;}
  function carWrap(host){if(!CAR.loop||!CAR.half)return;
    if(CAR.pos>=CAR.half){CAR.pos-=CAR.half;host.scrollLeft=CAR.pos;}
    else if(CAR.pos<1&&CAR.drag==null&&host.scrollLeft<1){CAR.pos+=CAR.half;host.scrollLeft=CAR.pos;}}
  function carInit(host){if(host.__cx)return;host.__cx=1;
    host.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse'||e.button!==0)return;CAR.drag={x:e.clientX,s:host.scrollLeft};CAR.moved=false;carHold(4000);});
    window.addEventListener('pointermove',function(e){if(!CAR.drag)return;var dx=e.clientX-CAR.drag.x;
      if(!CAR.moved&&Math.abs(dx)>5){CAR.moved=true;host.classList.add('dragging');}
      if(CAR.moved){var s=CAR.drag.s-dx;if(CAR.loop&&CAR.half){if(s<0){s+=CAR.half;CAR.drag.s+=CAR.half;}if(s>=CAR.half){s-=CAR.half;CAR.drag.s-=CAR.half;}}
        host.scrollLeft=s;CAR.pos=s;e.preventDefault();}});
    window.addEventListener('pointerup',function(){if(!CAR.drag)return;CAR.drag=null;host.classList.remove('dragging');carHold(3000);
      setTimeout(function(){CAR.moved=false;},0);});
    host.addEventListener('click',function(e){if(CAR.moved){e.stopPropagation();e.preventDefault();}},true);
    host.addEventListener('mouseenter',function(){CAR.hover=true;});
    host.addEventListener('mouseleave',function(){CAR.hover=false;carHold(1200);});
    host.addEventListener('touchstart',function(){carHold(5000);},{passive:true});
    host.addEventListener('touchmove',function(){carHold(5000);},{passive:true});
    host.addEventListener('wheel',function(){carHold(4000);},{passive:true});
    host.addEventListener('focusin',function(){carHold(8000);});
    host.addEventListener('scroll',function(){if(Math.abs(host.scrollLeft-CAR.pos)>2){CAR.pos=host.scrollLeft;carWrap(host);}},{passive:true});
    if('IntersectionObserver' in window)new IntersectionObserver(function(en){CAR.vis=en[0].isIntersecting;}).observe(host);
    var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(renderCarriers,200);});
    carKick();}
  function carKick(){if(!CAR.started&&CAR.loop&&!RM&&CFG.AUTO_SCROLL_PX_S>0){CAR.started=true;CAR.last=0;requestAnimationFrame(carTick);}}
  function carTick(t){var host=document.getElementById('f4-carriers'),dt=CAR.last?Math.min(64,t-CAR.last):16;CAR.last=t;
    if(host&&CAR.loop&&CAR.half&&CAR.vis&&!RM&&!CAR.hover&&!CAR.drag&&!document.hidden&&Date.now()>CAR.until){
      CAR.pos+=CFG.AUTO_SCROLL_PX_S*dt/1000; if(CAR.pos>=CAR.half)CAR.pos-=CAR.half; host.scrollLeft=CAR.pos;}
    if(!host||!CAR.loop){CAR.started=false;return;}   // нет карусели — цикл останавливается
    requestAnimationFrame(carTick);}
  function carCard(c,clone){return '<div class="car'+(c.id===STATE.carrierId?' on':'')+(clone?' clone':'')+'" data-id="'+c.id+'" role="button" tabindex="'+(clone?'-1':'0')+'"'+
      (clone?' aria-hidden="true"':' aria-pressed="'+(c.id===STATE.carrierId)+'"')+'>'+logoHTML(c)+'<span>'+c.name+'</span></div>';}
  function renderCarriers(){var host=document.getElementById('f4-carriers');if(!host)return;
    var wrap=document.getElementById('f4-cwrap'),list=carriersFor(currentRegion()),keep=host.scrollLeft;
    carInit(host);
    if(!list.length){host.innerHTML='<div style="font-size:12px;color:#5f5650">No services for this destination.</div>';CAR.loop=false;if(wrap)wrap.classList.remove('loop');return;}
    var sig=list.map(function(c){return c.id;}).join(',')+'|'+host.clientWidth;
    if(host.__sig===sig&&host.children.length){carMark();return;} host.__sig=sig;
    host.innerHTML=list.map(function(c){return carCard(c,false);}).join('');
    var over=host.scrollWidth>host.clientWidth+4;
    CAR.loop=over; if(wrap)wrap.classList.toggle('loop',over);
    if(over){host.insertAdjacentHTML('beforeend',list.map(function(c){return carCard(c,true);}).join(''));
      var first=host.querySelector('.car'),fc=host.querySelector('.car.clone');CAR.half=fc.offsetLeft-first.offsetLeft;
      CAR.pos=keep%CAR.half; host.scrollLeft=CAR.pos; carKick();}
    else{CAR.half=0;CAR.pos=0;host.scrollLeft=0;}}
  function carMark(){var host=document.getElementById('f4-carriers');if(!host)return;
    Array.prototype.forEach.call(host.querySelectorAll('.car'),function(el){var on=el.getAttribute('data-id')===STATE.carrierId;el.classList.toggle('on',on);if(!el.classList.contains('clone'))el.setAttribute('aria-pressed',on);});}

  function contact(){return '<a href="mailto:'+CFG.MAIL+'">email</a> or <a href="'+CFG.TG+'" target="_blank" rel="noopener">Telegram</a>';}
  function render(user){
    var box=document.getElementById('fls4');if(!box)return;
    var out=box.querySelector('#f4-out');
    var q=recompute();
    if(!q){out.innerHTML='<div class="card err">Cart is empty — nothing to ship.</div>';clearSel();return;}
    var p=q.parts, car=currentCarrier(), tierN={econ:'Economy',mid:'Standard',fast:'Express'}[STATE.tier];
    var actual=0; products().forEach(function(x){var pr=profile(x);actual+=pr.kg*qtyOf(x);}); actual=Math.round(actual*10)/10;
    var auto=regionFromCountry(countryVal()), regN=(q.region==='US'?'United States':'Europe (EU)');
    function kv(k,v){return '<div class="kv"><span>'+k+'</span><b>'+v+'</b></div>';}
    var details=
      kv('Destination',regN+(auto?'':' — country not recognised, please pick the destination above'))+
      kv('Service',(car?car.name:({post:'National post',courier:'Courier',freight:'Air / road cargo',sea:'Sea freight (LCL)'}[STATE.svc]))+' · '+tierN)+
      kv('Route',q.viaDE?'via Germany Hub':'Directly from Kazakhstan')+
      kv('Country of origin',originText(q.origins))+
      kv('Delivery time',q.eta)+
      kv('Parcel',q.box[0]+'×'+q.box[1]+'×'+q.box[2]+' cm')+
      kv('Actual weight',actual.toFixed(1)+' kg')+
      kv('Volumetric weight',q.kg.toFixed(1)+' kg — charged by the carrier (greater of actual and volumetric)')+
      (q.mode==='sea'?kv('Chargeable volume',q.cw.toFixed(2)+' W/M — greater of volume (m³) and weight (tonnes), min. 1'):'')+(q.cw&&q.mode!=='sea'?kv('Chargeable weight',q.cw+' kg — '+(q.mode==='road'?'road freight rule, 1 m³ = 333 kg':'air cargo rule, volume ÷ 6000')):'')+
      kv('Rate source',q.src==='tariff'?q.tariff+' — published 2026 tariff':((q.src==='freight'||q.src==='sea')?q.tariff+' — indicative market rate, exact quote from the forwarder':'Indicative rate — carrier tariff confirmed by our manager'))+
      (q.freight&&STATE.svc!=='freight'&&STATE.svc!=='sea'?kv('Tip','Heavy or oversize pieces usually ship cheaper as <b>Air / road cargo</b> or <b>Sea freight (LCL)</b>'):'')+
      (q.notes.length?kv('Notes',q.notes.join('<br>')):'')+
      (q.freight?kv('Size','<span class="flag">Oversize / freight — manager confirms by '+contact()+'</span>'):'');
    var insRow='';
    if(p.ins){var I=q.insInfo;
      insRow=row('Insurance (full value)'+(I.label?'<small>'+I.label+'</small>':'')+(I.cargo?'<small>Cargo insurance for value above carrier limit: '+(CFG.CARGO_INS.pct*100).toFixed(1)+'% of '+fmt(I.excess)+'</small>':''),p.ins);}
    out.innerHTML=
      '<div class="allin"><span class="lab">All-in shipping &amp; fees <i>(estimate)</i></span><span class="val">&asymp; '+fmt(q.allinUSD)+'</span></div>'+
      '<div class="card disc"><p><b>This is an estimate, valid as of the date you submit your order request ('+estDate()+').</b></p>'+
        '<p>Our manager will prepare an exact shipping calculation and get back to you by '+contact()+'. '+
        'If the final cost turns out higher than this estimate, the difference is either paid via a separate invoice, as agreed with you, or covered by Filin Labs.</p></div>'+
      (q.euNotice?'<div class="card warn"><p><b>EU import restriction.</b> '+CFG.EU_ORIGIN_NOTICE+' Our manager will confirm by '+contact()+' whether your order can be delivered to the EU before any payment.</p></div>':'')+
      '<details class="acc" open><summary>Shipment details</summary><div class="in">'+details+'</div></details>'+
      '<details class="acc"><summary>Cost breakdown <small>'+fmt(q.allinUSD)+'</small></summary><div class="in">'+
        row('Goods value (declared)',q.goods)+
        row('Carrier delivery'+(q.viaDE?' (KZ → DE Hub → destination)':' (KZ → destination)')+(q.src==='tariff'?'<small>'+(/^(DHL|FedEx|UPS)/.test(q.tariff)?'Carrier tariff incl. fuel surcharge':'Published carrier tariff')+'</small>':((q.src==='freight'||q.src==='sea')?'<small>Export handling, freight, destination handling and door delivery</small>':'')),p.ship)+
        (p.deAgent?row('Germany Hub handling (€200)',p.deAgent):'')+
        row('Import duty'+(q.region==='US'?' + MPF':'')+'<small>By product category and country of origin'+(q.col2?' · HTSUS Column 2 rates for items of Russian origin':'')+'</small>',p.duty)+
        (p.vat?row('EU VAT ('+Math.round(VAT_EU*100)+'%)',p.vat):'')+
        insRow+
        row('Other expenses',p.other)+
        '<div class="brow tot"><span>All-in shipping &amp; fees</span><b>'+fmt(q.allinUSD)+'</b></div>'+
      '</div></details>'+
      '<details class="acc"><summary>What the estimate includes</summary><div class="in">'+
        '<p>Fuel surcharge, Kazakhstan export clearance, destination import duty by product category and country of origin ('+originText(q.origins)+'; commercial import)'+
        (CFG.INCLUDE_VAT?', EU VAT':'')+', US MPF, optional insurance and other fees.</p>'+
        '<p>Chargeable weight is the greater of actual and volumetric weight (carrier rule). Rates are indicative as of the request date; the exact cost is confirmed by our manager by '+contact()+'.</p>'+
      '</div></details>';
    commit(q);
  }
  function originText(list){list=(list||[]).length?list:[CFG.GOODS_ORIGIN];
    return list.map(function(c){return ORIGIN_NAME[c]||c;}).join(', ');}
  function estDate(){try{return new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'long',year:'numeric'}).format(new Date());}catch(e){return new Date().toISOString().slice(0,10);}}
  function row(label,usd){return '<div class="brow"><span>'+label+'</span><b>'+fmt(usd)+'</b></div>';}

  /* ======================= ЗАПУСК ======================= */
  function boot(){loadDB(function(){if(FC()&&FC().ready)build();else document.addEventListener('filinCheckoutReady',build,{once:true});});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
  var ticks=0,timer=setInterval(function(){ticks++;
    if(FC()&&FC().ready){if(!document.getElementById('fls4'))build();else if(ticks%3===0)render(false);}
    if(ticks>=20)clearInterval(timer);},500);
  window.addEventListener('pageshow',function(){setTimeout(function(){if(FC()&&FC().ready){build();render(false);}},300);});
  console.info('[Filin Labs] Checkout Shipping Estimator V3.7 ready');
})();

//# sourceURL=filin-shipping-estimator-v3.7.js
