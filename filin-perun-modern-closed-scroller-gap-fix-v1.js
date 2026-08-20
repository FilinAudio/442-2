/* ============================================================
   FILIN LABS — PERUN MODERN CLOSED SCROLLER GAP FIX V1
   Page-specific layout repair for /perun_modern_closed.

   Removes the large empty white field below the recommendation scroller
   by collapsing only wrappers whose rendered height greatly exceeds the
   actual visible content height. Does not touch Golden product content.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_PMC_SCROLLER_GAP_FIX_V1__)return;
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
if(PATH!=='perun_modern_closed')return;
window.__FILIN_PMC_SCROLLER_GAP_FIX_V1__=true;

var VERSION='1.0.0';
var state={version:VERSION,slug:PATH,ready:false,fixes:0,recordId:'',gapBefore:0,gapAfter:0,lastError:''};
var timer=null;
function pub(){window.__FILIN_PMC_SCROLLER_GAP_FIX_V1_STATE__=JSON.parse(JSON.stringify(state));}
function txt(n){return String(n&&n.textContent||'').replace(/\s+/g,' ').trim();}
function rect(n){try{return n.getBoundingClientRect();}catch(e){return{top:0,bottom:0,height:0};}}
function visible(n){
  if(!n||!n.isConnected)return false;
  var cs;try{cs=getComputedStyle(n);}catch(e){return false;}
  if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)return false;
  var r=rect(n);return r.width>0&&r.height>0;
}
function footer(){
  return document.querySelector('footer,.t-footer')||Array.prototype.slice.call(document.querySelectorAll('.t-rec,[id^="rec"]')).find(function(n){var t=txt(n);return /Shipping\s*&\s*Payment/i.test(t)&&/Legal Information/i.test(t);})||null;
}
function viewButtons(){
  return Array.prototype.slice.call(document.querySelectorAll('a,button')).filter(function(n){
    return visible(n)&&/^VIEW$/i.test(txt(n))&&!n.closest('#filin-master-product-v3');
  });
}
function candidateRecord(){
  var f=footer(),fr=f?rect(f):null;
  var btns=viewButtons().filter(function(b){return !fr||rect(b).top<fr.top;});
  if(!btns.length)return null;
  btns.sort(function(a,b){return rect(a).top-rect(b).top;});
  var b=btns[btns.length-1];
  return b.closest('.t-rec,[id^="rec"]')||b.parentElement;
}
function contentBottom(box){
  var br=rect(box),max=br.top;
  Array.prototype.slice.call(box.querySelectorAll('a,button,img,p,h1,h2,h3,h4,.swiper,.swiper-wrapper,.swiper-slide,[class*="card"],[class*="slider"]')).forEach(function(n){
    if(!visible(n))return;
    var cs;try{cs=getComputedStyle(n);}catch(e){return;}
    if(cs.position==='fixed')return;
    var r=rect(n);
    if(r.bottom>max&&r.bottom<=br.bottom+8)max=r.bottom;
  });
  return max;
}
function trailingGap(box){
  var r=rect(box),cb=contentBottom(box);
  return Math.max(0,r.bottom-cb);
}
function collapseOne(n){
  if(!n||!n.isConnected)return false;
  var r=rect(n),gap=trailingGap(n);
  if(r.height<260||gap<140)return false;
  // Only collapse wrappers that actually contain the recommendation VIEW controls.
  var hasView=Array.prototype.slice.call(n.querySelectorAll('a,button')).some(function(x){return /^VIEW$/i.test(txt(x));});
  if(!hasView)return false;
  n.style.setProperty('height','auto','important');
  n.style.setProperty('min-height','0','important');
  n.style.setProperty('padding-bottom','0','important');
  n.style.setProperty('margin-bottom','0','important');
  n.classList.add('fp-pmc-gap-collapsed');
  state.fixes++;
  return true;
}
function apply(){
  try{
    var rec=candidateRecord();
    if(!rec){state.ready=false;state.lastError='Recommendation scroller record not found';pub();return false;}
    state.recordId=rec.id||'';
    state.gapBefore=Math.round(trailingGap(rec));

    // Collapse the record itself plus only oversized ancestor wrappers inside it.
    collapseOne(rec);
    var btn=viewButtons().filter(function(b){return rec.contains(b);}).pop();
    if(btn){
      var n=btn.parentElement,steps=0;
      while(n&&n!==rec&&steps++<10){collapseOne(n);n=n.parentElement;}
    }

    // Typical Tilda/custom-slider wrappers that preserve stale desktop heights.
    Array.prototype.slice.call(rec.querySelectorAll('.t-container,.t396__artboard,.t396__carrier,.t396__filter,.swiper,.swiper-wrapper,[class*="slider"],[class*="scroller"],[class*="recommend"]')).forEach(collapseOne);

    var f=footer();
    if(f){f.style.setProperty('margin-top','0','important');}
    state.gapAfter=Math.round(trailingGap(rec));
    state.ready=true;state.lastError='';pub();
    return true;
  }catch(e){state.ready=false;state.lastError=String(e&&e.message||e);pub();return false;}
}
function schedule(ms){clearTimeout(timer);timer=setTimeout(apply,ms==null?40:ms);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){schedule(0);},{once:true});else schedule(0);
[100,300,700,1400,2600,5000].forEach(function(ms){setTimeout(apply,ms);});
window.addEventListener('resize',function(){schedule(120);});
window.addEventListener('pageshow',function(){schedule(0);});
if(window.MutationObserver){
  var mo=new MutationObserver(function(){schedule(80);});
  mo.observe(document.documentElement,{childList:true,subtree:true});
}
pub();console.info('[Filin Labs] Perun Modern Closed Scroller Gap Fix V1 loaded',{version:VERSION});
})();
