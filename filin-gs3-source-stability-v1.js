/* ============================================================
 FILIN LABS — GS3 SOURCE STABILITY V1
 2026-08-20
 Normalizes legacy Tilda source blocks before GS3 reads them and
 cleans residual legacy artifacts after Golden is ready.

 Goals:
 - tolerate malformed T123 nesting (tabs/PM outside .js-product)
 - never let <style>/<script> text leak into curator copy
 - keep legacy T123/Zero blocks as DATA SOURCES only
 - hide standalone overview source after Golden succeeds
 - never move Golden .js-product nodes for wishlist safety
 ============================================================ */
(function(){
'use strict';
if(window.__FILIN_GS3_SOURCE_STABILITY_V1__)return;
window.__FILIN_GS3_SOURCE_STABILITY_V1__=true;
var VERSION='1.0.0',ROOT='filin-master-product-v3',PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var state={version:VERSION,slug:PATH,normalizedProducts:0,movedTabs:0,movedPM:0,curatorRecordsCleaned:0,curatorTextCleaned:0,overviewSourcesHidden:0,ready:false,lastError:''};
function pub(){window.__FILIN_GS3_SOURCE_STABILITY_V1_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[]);}function norm(v){return String(v==null?'':v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
function recOf(n){return n&&n.closest?n.closest('.t-rec,[id^="rec"]'):null;}
function isProtected(n){return !n||!!n.closest('#'+ROOT+',header,footer,#t-header,#t-footer,.t706,.t1002,.t-popup');}
function normalizeCommerce(){
  arr(document.querySelectorAll('.js-product')).forEach(function(p){
    if(isProtected(p))return;
    var r=recOf(p);if(!r)return;
    var changed=false;
    var tabs=arr(r.querySelectorAll('.tabs-wrapper')).find(function(x){return !x.closest('.js-product')&&!x.closest('#'+ROOT);});
    if(tabs){p.appendChild(tabs);state.movedTabs++;changed=true;}
    var pm=arr(r.querySelectorAll('.perfect-matches-block')).find(function(x){return !x.closest('.js-product')&&!x.closest('#'+ROOT);});
    if(pm){var pc=p.querySelector('.purchase-container')||p;pc.appendChild(pm);state.movedPM++;changed=true;}
    if(changed){p.setAttribute('data-filin-gs3-source-normalized','1');state.normalizedProducts++;}
  });
}
function cleanCuratorSource(){
  arr(document.querySelectorAll('.t-rec,[id^="rec"]')).forEach(function(r){
    if(isProtected(r))return;
    var t=norm(r.innerText||r.textContent||'');
    if(!(/handcrafted by/i.test(t)||/personally\s+(?:selected|listened|approved|curated)/i.test(t)))return;
    if(r.querySelector('.js-product,.tabs-wrapper,.perfect-matches-block'))return;
    arr(r.querySelectorAll('style,script,noscript,template')).forEach(function(x){x.remove();});
    r.setAttribute('data-filin-gs3-curator-source-clean','1');state.curatorRecordsCleaned++;
  });
}
function cleanCuratorOutput(){
  arr(document.querySelectorAll('.fp-v3-curator-text')).forEach(function(n){
    var t=norm(n.textContent||'');if(!t)return;
    var cut=t.search(/(?:\s#rec\d+|\s\.t\d+|\s@media\b|\s#[a-z0-9_-]+\s*\{|\s\.[a-z0-9_-]+\s*\{|\{\s*(?:font|color|background|display|margin|padding)\s*:)/i);
    if(cut>20){n.textContent=t.slice(0,cut).trim();state.curatorTextCleaned++;}
  });
}
function hideOverviewSources(){
  var root=document.getElementById(ROOT);if(!root||!root.querySelector('.v3-shell'))return;
  arr(document.querySelectorAll('.product-wrapper')).forEach(function(x){
    if(x.closest('#'+ROOT+',header,footer,#t-header,#t-footer'))return;
    if(!x.querySelector('.label-name,.label-def'))return;
    var r=recOf(x)||x;if(r.classList&&r.classList.contains('fp-v3-curator-record'))return;
    if(r.getAttribute&&r.getAttribute('data-filin-gs3-overview-source-hidden')==='1')return;
    if(r.setAttribute)r.setAttribute('data-filin-gs3-overview-source-hidden','1');
    if(r.style){r.style.setProperty('display','none','important');r.style.setProperty('height','0','important');r.style.setProperty('min-height','0','important');r.style.setProperty('max-height','0','important');r.style.setProperty('margin','0','important');r.style.setProperty('padding','0','important');r.style.setProperty('overflow','hidden','important');}
    state.overviewSourcesHidden++;
  });
}
function finalize(){try{cleanCuratorOutput();hideOverviewSources();state.ready=!!document.querySelector('#'+ROOT+' .v3-shell');state.lastError='';}catch(e){state.lastError=String(e&&e.message||e);}pub();}
function pre(){try{normalizeCommerce();cleanCuratorSource();state.lastError='';}catch(e){state.lastError=String(e&&e.message||e);}pub();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){pre();setTimeout(finalize,1200);setTimeout(finalize,3500);setTimeout(finalize,7000);},{once:true});else{pre();setTimeout(finalize,300);setTimeout(finalize,1800);}
if(window.MutationObserver)new MutationObserver(function(ms){var hit=ms.some(function(m){return arr(m.addedNodes).some(function(n){return n&&n.nodeType===1&&(n.id===ROOT||(n.querySelector&&n.querySelector('#'+ROOT+',.fp-v3-curator-text')));});});if(hit)setTimeout(finalize,60);}).observe(document.documentElement,{childList:true,subtree:true});
pub();
})();