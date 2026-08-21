/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 CURATOR CLEANUP V2
   Точная замена filin-master-product-v3-curator-cleanup-v1.js

   Поведение сохранено полностью: тот же список из 19 маршрутов,
   те же правила очистки, то же имя state-объекта, тот же guard-флаг
   (поэтому V1 и V2 никогда не выполнятся одновременно).

   ЧТО ИСПРАВЛЕНО (по логу perun_dark_sound: 20 violations по 50–104 мс,
   суммарно ~1,3–1,4 с заблокированного главного потока):

   1. Был MutationObserver на document.documentElement с characterData:true,
      который на КАЖДУЮ мутацию планировал setTimeout(apply, 20).
      При этом сам apply() писал в n.textContent — то есть порождал
      characterData-мутации и будил сам себя. Самоподдерживающийся цикл.
      → наблюдение сузилось до контейнера карточки, characterData убран,
        собственные записи помечаются флагом и игнорируются.

   2. candidates() вызывался ДВАЖДЫ за каждый проход
      (в начале и в строке state.ready=candidates().length>0).
      → один вызов, результат кэшируется.

   3. Резервная ветка делала document.querySelectorAll('.t051__text,.t-text,p,div,em')
      и читала textContent КАЖДОГО div на странице. На Tilda-карточке это
      тысячи узлов — отсюда forced reflow и 50–104 мс на проход.
      → div-скан вынесен в единственный последний резерв, основной
        резерв ограничен p / em / .t-text / .t051__text.

   4. Была лестница из семи таймеров [80,200,500,1000,2000,4000,8000]
      без условия остановки.
      → четыре прохода, выход после двух подряд стабильных, жёсткий
        предел 12 проходов и 10 секунд.

   5. Записи в DOM идут через FLPipeline.mutate, если он есть,
      чтобы не будить наблюдатели остальных модулей.
   ============================================================ */
(function(){
'use strict';

if(window.__FILIN_MASTER_PRODUCT_V3_CURATOR_CLEANUP_V1__) return;
window.__FILIN_MASTER_PRODUCT_V3_CURATOR_CLEANUP_V1__ = true;

var VERSION = '2.0.0';
var PATH = (location.pathname || '/').replace(/^\/+|\/+$/g,'');

var ALLOWED = [
'perun_dark_sound','volga_tone_priboi_1','orvellium_nocturne_aura','flatvox_gbc_dj_hulk',
'snorry_si_5_mk_2_headphones','snorry_joule_headphones','perun_modern','snorry_si_6_headphones',
'flatvox_gbc','flatvox_kona','phenomenon_spatium','filin_audio_model_1_standard_v2',
'filin_audio_model_1_premium_v2','perun_modern_closed','phenomenon_libratum',
'snorry_nm_2_headphones','filin_audio_limited','filin_audio_quadron','snorry_trion_mk_3'
];

if(ALLOWED.indexOf(PATH) < 0) return;

var state = {
  version:VERSION, slug:PATH, ready:false, fixes:0,
  passes:0, scans:0, stopped:false, lastBefore:'', lastAfter:''
};

function pub(){
  window.__FILIN_MASTER_PRODUCT_V3_CURATOR_CLEANUP_V1_STATE__ = JSON.parse(JSON.stringify(state));
}

function norm(s){
  return String(s == null ? '' : s).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();
}

/* ------------------------------------------------------------
   ПРАВИЛА ОЧИСТКИ — без изменений относительно V1
   ------------------------------------------------------------ */
function clean(s){
  var t = norm(s);
  if(!t) return t;

  t = t.replace(/\bFilin Labs Kazakhstan\.\s*Labs Kazakhstan\.?\s*$/i,'Filin Labs Kazakhstan.');
  t = t.replace(/\bFilin Labs Kazakhstan\.\s*Filin Labs Kazakhstan\.?\s*$/i,'Filin Labs Kazakhstan.');
  t = t.replace(/\bLabs Kazakhstan\.\s*Labs Kazakhstan\.?\s*$/i,'Labs Kazakhstan.');

  var parts = t.split(/(?<=[.!?])\s+/), out = [];

  parts.forEach(function(p){
    var k = norm(p).toLowerCase().replace(/[.!?]+$/,'');
    if(!k) return;
    var prev = out.length ? norm(out[out.length-1]).toLowerCase().replace(/[.!?]+$/,'') : '';
    if(k === prev) return;
    if(k === 'labs kazakhstan' && prev === 'filin labs kazakhstan') return;
    out.push(norm(p));
  });

  return out.join(' ');
}

/* ------------------------------------------------------------
   ПОИСК УЗЛОВ
   ------------------------------------------------------------ */
var PRIMARY =
  '.fp-v3-curator-text,' +
  '.fp-v3-curator-record .t051__text,' +
  '.fp-v3-curator-record .t-text,' +
  '.fp-v3-curator-record p';

var SECONDARY = '.t051__text,.t-text,em,p';

function scopeRoot(){
  return document.querySelector('#filin-master-product-v3,#fl-product-root') ||
         document.getElementById('allrecords') ||
         document.documentElement;
}

function looksLikeCurator(node){
  var t = norm(node.textContent);
  return /^Handcrafted by/i.test(t) && t.length < 500;
}

var deepScanUsed = false;

function collect(){
  state.scans++;

  var xs = [], seen = (typeof Set === 'function') ? new Set() : null;

  function push(n){
    if(seen){ if(seen.has(n)) return; seen.add(n); }
    else if(xs.indexOf(n) >= 0) return;
    xs.push(n);
  }

  document.querySelectorAll(PRIMARY).forEach(push);
  if(xs.length) return xs;

  /* Резерв 1 — только текстовые узлы, без div */
  document.querySelectorAll(SECONDARY).forEach(function(n){
    if(looksLikeCurator(n)) push(n);
  });
  if(xs.length) return xs;

  /* Резерв 2 — полный обход, ровно ОДИН раз за жизнь страницы */
  if(!deepScanUsed){
    deepScanUsed = true;
    scopeRoot().querySelectorAll('div').forEach(function(n){
      if(looksLikeCurator(n)) push(n);
    });
  }

  return xs;
}

/* ------------------------------------------------------------
   ПРИМЕНЕНИЕ
   ------------------------------------------------------------ */
var cache = [];
var writing = false;
var scheduled = false;
var stable = 0;
var observer = null;

var MAX_PASSES = 12;
var HARD_STOP_MS = 10000;
var startedAt = Date.now();

function write(fn){
  if(window.FLPipeline && window.FLPipeline.mutate) return window.FLPipeline.mutate(fn);
  return fn();
}

function stop(reason){
  if(state.stopped) return;
  state.stopped = reason || true;
  if(observer){ try{ observer.disconnect(); }catch(e){} observer = null; }
  pub();
}

function apply(){
  if(state.stopped) return 0;

  state.passes++;

  if(state.passes > MAX_PASSES || Date.now() - startedAt > HARD_STOP_MS){
    stop('limit');
    return 0;
  }

  if(!cache.length) cache = collect();

  /* отсеиваем узлы, которые пайплайн уже заменил */
  cache = cache.filter(function(n){ return n && n.isConnected; });
  if(!cache.length) cache = collect();

  var fixed = 0;

  writing = true;

  write(function(){
    cache.forEach(function(n){
      var before = norm(n.textContent);
      var after = clean(before);
      if(after && before !== after){
        n.textContent = after;
        fixed++;
        state.lastBefore = before;
        state.lastAfter = after;
      }
    });
  });

  /* mutation records от наших записей приходят микрозадачей,
     то есть раньше следующего кадра — снимаем флаг в rAF */
  requestAnimationFrame(function(){ writing = false; });

  state.fixes += fixed;
  state.ready = cache.length > 0;

  /* два подряд прохода без правок при найденных узлах = можно выходить */
  if(state.ready && fixed === 0){ stable++; } else { stable = 0; }
  if(stable >= 2) stop('stable');

  pub();
  return fixed;
}

function schedule(){
  if(scheduled || state.stopped) return;
  scheduled = true;
  requestAnimationFrame(function(){
    scheduled = false;
    apply();
  });
}

/* ------------------------------------------------------------
   ЗАПУСК
   ------------------------------------------------------------ */
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', apply, {once:true});
}else{
  apply();
}

/* четыре прохода вместо семи; каждый выйдет сразу, если уже stopped */
[120, 400, 1200, 3000].forEach(function(ms){ setTimeout(apply, ms); });

/* Golden пересобирает карточку — после этого нужен ещё один проход */
['filin:product:ready','filin:product:v3:ready','filin:product:v2:ready'].forEach(function(name){
  document.addEventListener(name, function(){
    cache = [];
    stable = 0;
    setTimeout(apply, 60);
    setTimeout(function(){ stop('after-ready'); }, 2000);
  }, {once:true});
});

if(window.MutationObserver){
  observer = new MutationObserver(function(){
    if(writing || state.stopped) return;   /* собственные записи игнорируем */
    schedule();
  });

  /* узкий корень, без characterData */
  observer.observe(scopeRoot(), {childList:true, subtree:true});
}

setTimeout(function(){ stop('timeout'); }, HARD_STOP_MS);

pub();

console.info('[Filin Labs] Curator Cleanup V2 loaded', {version:VERSION, slug:PATH});

})();
