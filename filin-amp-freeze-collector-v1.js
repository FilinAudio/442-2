/* ============================================================
   FILIN LABS — AMP FREEZE COLLECTOR V1
   One-time migration helper for the approved 10 tube-amplifier pages.

   Captures the settled Golden profile and healthy gallery media into
   localStorage. It never rebuilds or rewrites the product page.
   Remove after Static AMP Registry is created.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_AMP_FREEZE_COLLECTOR_V1__)return;
window.__FILIN_AMP_FREEZE_COLLECTOR_V1__=true;

var VERSION='1.0.0',KEY='FILIN_AMP_FREEZE_V1',ROOT='filin-master-product-v3';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ALLOWED=[
'gerbera_lira_compact_tube_amplifier_ultralinear_se','gerbera_2a3_tube_amplifier',
'audioinstrument_sirius_kt150_tube_amplifier','audioinstrument_sirius_kt66_push_pull_tube_amplifier',
'demograf_ajax_tube_amplifier_el_84','gerbera_ha_45_tube_headphone_amplifier_dac',
'gerbera_ha_15_tube_amp_electrostatic_planar','gerbera_a8045_tube_headphone_amplifier',
'gerbera_electrostatic_amplifier','gerbera_attento_otl_tube_electrostatic_headphone_amplifier'];
function str(v){return String(v==null?'':v).trim()}
function arr(v){return Array.prototype.slice.call(v||[])}
function norm(v){return str(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim()}
function copy(v){try{return JSON.parse(JSON.stringify(v))}catch(e){return null}}
function rec(n){return n&&n.closest?n.closest('.t-rec,[id^="rec"]'):null}
function url(v){v=str(v);if(!v||/^\d+(?:\.\d+)?(?:px|%)?$/i.test(v)||/^(#|javascript:|about:|blob:|data:)/i.test(v))return'';try{if(/^\/\//.test(v))v=location.protocol+v;var u=new URL(v,location.href);return /^https?:$/i.test(u.protocol)?u.href:''}catch(e){return''}}
function imageLike(u){if(!u)return false;try{var x=new URL(u),q=x.pathname+x.search;if(/(?:^|\.)tildacdn\.(com|net|info)$/i.test(x.hostname))return x.pathname.length>12&&!/^\/\d+\/?$/.test(x.pathname);return /\.(jpe?g|png|webp|avif|gif)(?:$|[?#])/i.test(q)}catch(e){return false}}
function noise(u){return /(blank\.gif|empty\.png|pixel|favicon|logo(?:[-_.]|\.|$)|sprite|cookie|payment|telegram|whatsapp|youtube|icon[-_.]|social|arrow|spinner|loader|captcha|recaptcha)/i.test(u||'')}
function add(out,v){var u=url(v);if(u&&imageLike(u)&&!noise(u)&&out.indexOf(u)<0)out.push(u)}
function css(v){var out=[],m,re=/url\(["']?([^"')]+)["']?\)/ig;while((m=re.exec(str(v))))add(out,m[1]);return out}
function addEl(out,el){if(!el||!el.getAttribute)return;['data-content-cover-bg','data-original','data-img-zoom-url','data-src','data-lazy-src','data-original-src','src'].forEach(function(a){add(out,el.getAttribute(a))});var ss=el.getAttribute('srcset');if(ss)ss.split(',').forEach(function(x){add(out,x.trim().split(/\s+/)[0])});css(el.getAttribute('style')).forEach(function(u){add(out,u)});try{css(getComputedStyle(el).backgroundImage).forEach(function(u){add(out,u)})}catch(e){}}
function excluded(r){if(!r||r.closest('header,footer,.t706,.t1002,.t-popup'))return true;var t=norm(r.innerText).toLowerCase();if(/perfect matches|shipping|payment|contact|legal|reviews?|recommended products|you may also like|refer a friend|loyalty/.test(t))return true;if(/cat(?:h)?egory\s*&?\s*budget|tags?\s*&\s*features|high\s*technolog|genres?\s*accord|sonic\s*signature|curator.?s\s*choice|synergy\s*match/.test(t))return true;return arr(r.querySelectorAll('a,button')).filter(function(x){return /^view$/i.test(norm(x.textContent))}).length>=2}
function sources(){var s={profile:[],golden:[],legacy:[]},api=window.FilinMasterProductV3,p=api&&api.profiles&&api.profiles[PATH],root=document.getElementById(ROOT);if(p&&p.overview&&Array.isArray(p.overview.galleryImages))p.overview.galleryImages.forEach(function(u){add(s.profile,u)});if(root)arr(root.querySelectorAll('.v3-main-img,.v3-thumb img')).forEach(function(x){addEl(s.golden,x)});
var cover=document.querySelector('.t-cover'),cr=rec(cover),hero=[];if(cover){addEl(hero,cover);arr(cover.querySelectorAll('img,.t-bgimg,[data-original],[data-src],[data-content-cover-bg],[style*="background-image"]')).forEach(function(x){addEl(hero,x)})}
var rs=arr(document.querySelectorAll('.t-rec,[id^="rec"]')),prod=arr(document.querySelectorAll('.js-product')).find(function(x){return !x.closest('#'+ROOT+',.t706,.t1002,.t-popup')}),pr=rec(prod),ci=cr?rs.indexOf(cr):-1,pi=pr?rs.indexOf(pr):-1;rs.forEach(function(r,i){if(excluded(r)||r.closest('#'+ROOT))return;if(ci>=0&&i<=ci)return;if(pi>=0&&i>pi+1)return;if(!r.querySelector('img,.t-bgimg,.t396,.tn-elem,[data-elem-type="image"],[data-original],[data-img-zoom-url]'))return;var tmp=[];arr(r.querySelectorAll('img,.t-bgimg,.tn-atom__img,[data-elem-type="image"] .tn-atom,[data-original],[data-img-zoom-url],[style*="background-image"]')).forEach(function(x){addEl(tmp,x)});tmp.forEach(function(u){if(hero.indexOf(u)<0)add(s.legacy,u)})});return s}
function probe(u){return new Promise(function(resolve){var im=new Image(),done=false,t=setTimeout(function(){finish(false)},4200);function finish(ok){if(done)return;done=true;clearTimeout(t);resolve({url:u,ok:!!ok,w:im.naturalWidth||0,h:im.naturalHeight||0})}im.onload=function(){var w=im.naturalWidth||0,h=im.naturalHeight||0,r=h?w/h:0;finish(w>=500&&h>=300&&Math.max(w,h)>=700&&r>=.35&&r<=3.2)};im.onerror=function(){finish(false)};im.src=u})}
async function audit(s){var all=[];['profile','golden','legacy'].forEach(function(k){s[k].forEach(function(u){if(all.indexOf(u)<0)all.push(u)})});var good=[],bad=[];for(var i=0;i<all.length;i++){var r=await probe(all[i]);(r.ok?good:bad).push(r)}return{urls:good.map(function(x){return x.url}),good:good,bad:bad}}
function read(){try{return JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){return{}}}
function write(v){localStorage.setItem(KEY,JSON.stringify(v))}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null}catch(e){return null}}
function pipelineReady(){var names=['__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V8_STATE__','__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V7_STATE__','__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V6_STATE__','__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V5_STATE__','__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V4_STATE__','__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V3_STATE__','__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V2_STATE__','__FILIN_MASTER_PRODUCT_V4_AMP_BATCH_V1_STATE__'];return names.some(function(n){return window[n]&&window[n].ready===true})}
async function capture(force){if(ALLOWED.indexOf(PATH)<0)return{ok:false,reason:'not_amp_page'};var p=profile(),root=document.getElementById(ROOT);if(!p||!root)return{ok:false,reason:'golden_not_ready'};if(!force&&!pipelineReady())return{ok:false,reason:'pipeline_not_ready'};var frozen=copy(p);if(!frozen)return{ok:false,reason:'clone_failed'};var src=sources(),a=await audit(src);frozen.overview=frozen.overview||{};if(a.urls.length)frozen.overview.galleryImages=a.urls.slice();var db=read();db[PATH]={schemaVersion:1,collectorVersion:VERSION,slug:PATH,capturedAt:new Date().toISOString(),profile:frozen,audit:{sourceCounts:{profile:src.profile.length,golden:src.golden.length,legacy:src.legacy.length},healthyCount:a.good.length,rejectedCount:a.bad.length,healthy:a.good,rejected:a.bad}};write(db);return{ok:true,slug:PATH,healthy:a.good.length,rejected:a.bad.length,captured:Object.keys(db).filter(function(k){return ALLOWED.indexOf(k)>=0}).length}}
function status(){var d=read(),yes=ALLOWED.filter(function(k){return!!d[k]}),no=ALLOWED.filter(function(k){return!d[k]});return{version:VERSION,captured:yes.length,total:ALLOWED.length,capturedSlugs:yes,missingSlugs:no,complete:no.length===0}}
function payload(){var d=read(),e={};ALLOWED.forEach(function(k){if(d[k])e[k]=d[k]});return{schemaVersion:1,type:'filin-amp-static-registry-source',collectorVersion:VERSION,exportedAt:new Date().toISOString(),expectedSlugs:ALLOWED.slice(),entries:e,status:status()}}
function downloadAll(){var b=new Blob([JSON.stringify(payload(),null,2)],{type:'application/json'}),u=URL.createObjectURL(b),a=document.createElement('a');a.href=u;a.download='filin-amp-static-registry-source.json';document.body.appendChild(a);a.click();a.remove();setTimeout(function(){URL.revokeObjectURL(u)},1500);return status()}
window.FilinAmpFreezeCollector=Object.freeze({version:VERSION,capture:function(){return capture(true)},status:status,downloadAll:downloadAll,exportAll:payload,clearAll:function(){localStorage.removeItem(KEY);return status()}});
function boot(){if(ALLOWED.indexOf(PATH)<0)return;var n=0,t=setInterval(async function(){n++;if(profile()&&document.getElementById(ROOT)&&(pipelineReady()||n>=20)){clearInterval(t);try{var r=await capture(n>=20);console.info('[Filin Labs] AMP Freeze Collector V1',{slug:PATH,ok:r.ok,healthy:r.healthy||0,captured:status().captured+'/'+ALLOWED.length})}catch(e){console.warn('[Filin AMP Freeze]',String(e&&e.message||e))}}else if(n>=40){clearInterval(t);console.warn('[Filin AMP Freeze] timeout',{slug:PATH})}},500)}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
})();