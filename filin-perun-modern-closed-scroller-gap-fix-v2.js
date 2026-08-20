/* ============================================================
   FILIN LABS — PERUN MODERN CLOSED SCROLLER GAP FIX V2
   Fixes the large empty white field between the final recommendation
   scroller and footer on /perun_modern_closed.

   V2 fixes V1's finder bug: recommendation VIEW buttons can live inside
   #filin-master-product-v3 after Golden migration, so they must not be
   excluded. We collapse only ancestors whose rendered box extends far
   below their actual visible content.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_PMC_SCROLLER_GAP_FIX_V2__)return;
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
if(PATH!=='perun_modern_closed')return;
window.__FILIN_PMC_SCROLLER_GAP_FIX_V2__=true;

var VERSION='2.0.0';
var state={version:VERSION,slug:PATH,ready:false,fixes:0,lastViewBottom:0,footerTop:0,gapBefore:0,gapAfter:0,collapsed:[],lastError:''};
var timer=null;
function pub(){window.__FILIN_PMC_SCROLLER_GAP_FIX_V2_STATE__=JSON.parse(JSON.stringify(state));}
function txt(n){return String(n&&n.textContent||'').replace(/\s+/g,' ').trim();}
function rect(n){try{return n.getBoundingClientRect();}catch(e){return{top:0,bottom:0,height:0,width:0};}}
function visible(n){
  if(!n||!n.isConnected)return false;
  var cs;try{cs=getComputedStyle(n);}catch(e){return false;}
  if(cs.display==='none'||cs.visibility==='hidden'||Number(cs.opacity)===0)return false;
  var r=rect(n);return r.width>0&&r.height>0;
}
function footer(){
  return document.querySelector('footer,.t-footer')||Array.prototype.slice.call(document.querySelectorAll('.t-rec,[id^="rec"]')).find(function(n){
    var t=txt(n);return /Shipping\s*&\s*Payment/i.test(t)&&/Legal Information/i.test(t);
  })||null;
}
function viewButtons(){
  var f=footer(),ft=f?rect(f).top:Infinity;
  return Array.prototype.slice.call(document.querySelectorAll('a,button')).filter(function(n){
    if(!visible(n)||!/^VIEW$/i.test(txt(n)))return false;
    if(n.closest('header,footer,.t-footer,.t706,.t1002,.t-popup'))return false;
    return rect(n).top<ft;
  });
}
function lastView(){
  var xs=viewButtons();
  xs.sort(function(a,b){return rect(a).bottom-rect(b).bottom;});
  return xs[xs.length-1]||null;
}
function contentBottom(box){
  var br=rect(box),max=br.top;
  var sel='a,button,img,p,h1,h2,h3,h4,h5,h6,input,label,.swiper,.swiper-slide,[class*="card"],[class*="slider"],[class*="scroller"],[class*="recommend"]';
  Array.prototype.slice.call(box.querySelectorAll(sel)).forEach(function(n){
    if(!visible(n))return;
    var cs;try{cs=getComputedStyle(n);}catch(e){return;}
    if(cs.position==='fixed'||cs.position==='sticky')return;
    var r=rect(n);
    if(r.bottom>max&&r.bottom<=br.bottom+10)max=r.bottom;
  });
  return max;
}
function trailingGap(box){
  var r=rect(box),cb=contentBottom(box);
  return Math.max(0,r.bottom-cb);
}
function describe(n){
  if(!n)return'';
  var s=n.tagName||'';
  if(n.id)s+='#'+n.id;
  if(n.classList&&n.classList.length)s+='.'+Array.prototype.slice.call(n.classList).slice(0,3).join('.');
  return s;
}
function collapse(n){
  if(!n||!n.isConnected||n===document.body||n===document.documentElement)return false;
  if(n.matches&&n.matches('header,footer,.t-footer,.t706,.t1002,.t-popup'))return false;
  var r=rect(n),gap=trailingGap(n);
  if(r.height<180||gap<100)return false;
  n.style.setProperty('height','auto','important');
  n.style.setProperty('min-height','0','important');
  n.style.setProperty('max-height','none','important');
  n.style.setProperty('padding-bottom','0','important');
  n.style.setProperty('margin-bottom','0','important');
  n.classList.add('fp-pmc-gap-collapsed-v2');
  state.fixes++;
  var d=describe(n);if(state.collapsed.indexOf(d)<0)state.collapsed.push(d);
  return true;
}
function directEmptyBetween(lastBottom,footerTop){
  Array.prototype.slice.call(document.querySelectorAll('.t-rec,[id^="rec"]')).forEach(function(n){
    if(!visible(n)||n.closest('footer,.t-footer'))return;
    var r=rect(n);
    if(r.top<lastBottom-20||r.bottom>footerTop+20)return;
    var meaningful=Array.prototype.slice.call(n.querySelectorAll('img,a,button,input,h1,h2,h3,h4,p,.t-text')).some(function(x){return visible(x)&&(x.tagName==='IMG'||txt(x).length>3);});
    if(!meaningful&&r.height>80){
      n.style.setProperty('display','none','important');
      state.fixes++;
      var d=describe(n);if(state.collapsed.indexOf(d)<0)state.collapsed.push(d+'[empty]');
    }
  });
}
function apply(){
  try{
    var f=footer(),v=lastView();
    if(!f||!v){state.ready=false;state.lastError=!f?'Footer not found':'Last VIEW button not found';pub();return false;}
    var fr=rect(f),vr=rect(v);
    state.lastViewBottom=Math.round(vr.bottom);
    state.footerTop=Math.round(fr.top);
    state.gapBefore=Math.max(0,Math.round(fr.top-vr.bottom));

    // Walk from the last recommendation card upward. Any ancestor whose
    // bottom stretches well past its actual content is the stale-height box.
    var n=v.parentElement,steps=0;
    while(n&&n!==document.body&&steps++<18){
      collapse(n);
      if(n.id==='filin-master-product-v3'){
        // Root itself can carry stale min-height; normalize but do not hide it.
        n.style.setProperty('min-height','0','important');
        n.style.setProperty('height','auto','important');
      }
      n=n.parentElement;
    }

    // Known custom/Tilda wrappers can preserve an old artboard height.
    var root=document.getElementById('filin-master-product-v3');
    if(root){
      Array.prototype.slice.call(root.querySelectorAll('.t-container,.t396__artboard,.t396__carrier,.t396__filter,.swiper,.swiper-wrapper,[class*="slider"],[class*="scroller"],[class*="recommend"]')).forEach(collapse);
    }

    directEmptyBetween(vr.bottom,fr.top);
    f.style.setProperty('margin-top','0','important');
    f.style.setProperty('padding-top','0','important');

    // Re-measure after style changes.
    var fr2=rect(f),vr2=rect(v);
    state.gapAfter=Math.max(0,Math.round(fr2.top-vr2.bottom));
    state.ready=true;state.lastError='';pub();
    console.info('[Filin Labs] PMC Scroller Gap Fix V2 applied',state);
    return true;
  }catch(e){state.ready=false;state.lastError=String(e&&e.message||e);pub();return false;}
}
function schedule(ms){clearTimeout(timer);timer=setTimeout(apply,ms==null?40:ms);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){schedule(0);},{once:true});else schedule(0);
[100,300,700,1400,2600,5000,8000].forEach(function(ms){setTimeout(apply,ms);});
window.addEventListener('resize',function(){schedule(120);});
window.addEventListener('pageshow',function(){schedule(0);});
if(window.MutationObserver){
  var mo=new MutationObserver(function(){schedule(100);});
  mo.observe(document.documentElement,{childList:true,subtree:true});
}
pub();console.info('[Filin Labs] Perun Modern Closed Scroller Gap Fix V2 loaded',{version:VERSION});
})();
