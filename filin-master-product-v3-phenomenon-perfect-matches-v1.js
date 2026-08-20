/* ============================================================
   FILIN LABS — PHENOMENON PERFECT MATCHES BRIDGE V1
   Restores Golden Perfect Matches on:
   - /phenomenon_spatium
   - /phenomenon_libratum

   Why this exists:
   These legacy Phenomenon pages use a PM/synergy markup variant that the
   Batch V3 parser can miss. The original legacy DOM is still present but
   quarantined, so this bridge discovers the smallest legacy PM block,
   extracts its description/items, and renders the standard Golden .v3-pm.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V3_PHENOMENON_PM_V1__)return;
window.__FILIN_MASTER_PRODUCT_V3_PHENOMENON_PM_V1__=true;

var VERSION='1.0.0';
var ROOT_ID='filin-master-product-v3';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
if(['phenomenon_spatium','phenomenon_libratum'].indexOf(PATH)<0)return;

var state={version:VERSION,slug:PATH,ready:false,fixes:0,source:'',items:0,lastError:''};
var timer=null;
function pub(){window.__FILIN_MASTER_PRODUCT_V3_PHENOMENON_PM_V1_STATE__=JSON.parse(JSON.stringify(state));}
function str(v){return String(v==null?'':v).trim();}
function norm(v){return str(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
function esc(v){return str(v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function root(){return document.getElementById(ROOT_ID);}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null;}catch(e){return null;}}

function looksLikePM(t){
  t=norm(t);
  return /perfect\s*matches?/i.test(t)||(/5%\s*off/i.test(t)&&/(recommended|synergy|added device|each added)/i.test(t));
}
function badContainer(n){
  return !n||n.closest('#'+ROOT_ID)||n.closest('.t706,.t1002,.t-popup')||/^(HTML|BODY)$/i.test(n.tagName||'');
}
function smallestPM(scope){
  var xs=[];
  try{
    var all=Array.prototype.slice.call(scope.querySelectorAll('.perfect-matches-block,[class*="perfect-match"],[id*="perfect-match"],[class*="perfect_match"],[id*="perfect_match"],[class*="synergy"],[id*="synergy"],section,div'));
    all.forEach(function(n){
      if(scope===document&&badContainer(n))return;
      var t=norm(n.textContent);
      if(t.length>=12&&t.length<=3200&&looksLikePM(t))xs.push(n);
    });
  }catch(e){}
  xs.sort(function(a,b){return norm(a.textContent).length-norm(b.textContent).length;});
  return xs[0]||null;
}
function profileCandidate(){
  var p=profile(),html=p&&p.commerce&&p.commerce.innerHTML;
  if(!html)return null;
  var box=document.createElement('div');box.innerHTML=html;
  return smallestPM(box);
}
function liveCandidate(){return smallestPM(document);}

function cleanHref(a){
  var h=str(a&&a.getAttribute('href'));
  if(!h||h==='#'||/^javascript:/i.test(h)||/^mailto:/i.test(h)||/^tel:/i.test(h))return'';
  try{return new URL(h,location.origin).href;}catch(e){return h;}
}
function dataFrom(node){
  if(!node)return null;
  var p=profile();
  var display=norm(p&&p.commerce&&(p.commerce.displayName||p.commerce.cartName))||'Phenomenon';
  var descNode=node.querySelector('.pm-desc,.perfect-matches-desc,[class*="match"][class*="desc"],p');
  var desc=norm(descNode&&descNode.textContent);
  if(/5%\s*off/i.test(desc)&&desc.length<180)desc='';

  var baseNode=node.querySelector('.pm-base,[class*="match"][class*="base"]');
  var base=norm(baseNode&&baseNode.textContent)||display;
  var seen=Object.create(null),items=[];

  Array.prototype.slice.call(node.querySelectorAll('a')).forEach(function(a){
    var text=norm(a.textContent),href=cleanHref(a);
    if(!text||text.length>180||!href)return;
    if(/privacy|shipping|warranty|telegram|contact|special offer/i.test(text+' '+href))return;
    var k=text.toLowerCase()+'|'+href;if(seen[k])return;seen[k]=1;
    items.push({text:text,href:href});
  });

  // Some legacy PM blocks are labels/checkboxes without links.
  if(!items.length){
    Array.prototype.slice.call(node.querySelectorAll('label,.pm-item,[class*="match-item"]')).forEach(function(n){
      if(n===baseNode||n.classList&&n.classList.contains('pm-base'))return;
      var text=norm(n.textContent).replace(/^\+\s*/, '');
      if(!text||text.length>180||/perfect\s*matches?|5%\s*off/i.test(text))return;
      var k=text.toLowerCase();if(seen[k])return;seen[k]=1;items.push({text:text,href:''});
    });
  }
  return{base:base,desc:desc,items:items};
}

function synergyFallback(){
  var r=root();if(!r)return null;
  var cards=Array.prototype.slice.call(r.querySelectorAll('.v3-curation-item'));
  var card=cards.find(function(n){var h=n.querySelector('h3');return /synergy\s*match/i.test(norm(h&&h.textContent));});
  if(!card)return null;
  var h=card.querySelector('h3'),copy='';
  var clone=card.cloneNode(true);var hh=clone.querySelector('h3');if(hh)hh.remove();
  copy=norm(clone.textContent);
  if(!copy)return null;
  return{base:norm(profile()&&profile().commerce&&profile().commerce.displayName)||'Phenomenon',desc:'Recommended synergy for this product.',items:[{text:copy,href:''}]};
}

function sectionHTML(d){
  var note='Add recommended synergy components to get <b>5% OFF for EACH added device.</b>';
  var items=d.items||[];
  var formula='<span class="v3-pm-item v3-pm-base">'+esc(d.base)+'</span>';
  items.forEach(function(x){
    formula+='<span class="v3-pm-plus">+</span><span class="v3-pm-item">'+(x.href?'<a href="'+esc(x.href)+'">'+esc(x.text)+'</a>':esc(x.text))+'</span>';
  });
  formula+='<span class="v3-pm-equals">=</span><span class="v3-pm-result">Ultimate Synergy</span>';
  return '<section class="v3-pm fp-phenomenon-pm-v1"><button class="v3-pm-toggle" type="button" aria-expanded="false"><span class="v3-pm-copy"><span class="v3-pm-kicker">Perfect Matches</span><span class="v3-pm-note">'+note+'</span></span><span class="v3-pm-icon" aria-hidden="true"><svg viewBox="0 0 20 20" focusable="false"><path d="M5.5 8 L10 12.5 L14.5 8"></path></svg></span></button><div class="v3-pm-body">'+(d.desc?'<p class="v3-pm-desc">'+esc(d.desc)+'</p>':'')+'<div class="v3-pm-formula">'+formula+'</div></div></section>';
}
function wire(pm){
  var btn=pm&&pm.querySelector('.v3-pm-toggle');if(!btn||btn.dataset.fpPmWire==='1')return;
  btn.dataset.fpPmWire='1';
  btn.addEventListener('click',function(){pm.classList.toggle('open');btn.setAttribute('aria-expanded',pm.classList.contains('open')?'true':'false');});
}
function apply(){
  var r=root();if(!r){state.ready=false;pub();return false;}
  var existing=r.querySelector('.v3-pm');
  if(existing){wire(existing);state.ready=true;state.source=existing.classList.contains('fp-phenomenon-pm-v1')?state.source||'bridge':'native';state.items=existing.querySelectorAll('.v3-pm-item:not(.v3-pm-base)').length;pub();return true;}

  var candidate=liveCandidate(),source='legacy-dom';
  if(!candidate){candidate=profileCandidate();source='profile-commerce';}
  var d=dataFrom(candidate);
  if(!d||!d.items.length){d=synergyFallback();source='synergy-fallback';}
  if(!d){state.ready=false;state.lastError='Perfect Matches source not found';pub();return false;}

  var commerce=r.querySelector('.v3-js-product')||r.querySelector('.v3-commerce');
  if(!commerce){state.ready=false;state.lastError='Golden commerce host not found';pub();return false;}
  var wrap=document.createElement('div');wrap.innerHTML=sectionHTML(d);
  var pm=wrap.firstElementChild;
  commerce.appendChild(pm);wire(pm);
  state.fixes++;state.ready=true;state.source=source;state.items=d.items.length;state.lastError='';pub();
  console.info('[Filin Labs] Phenomenon Perfect Matches V1 restored',{slug:PATH,source:source,items:d.items.length});
  return true;
}
function schedule(ms){clearTimeout(timer);timer=setTimeout(apply,ms==null?40:ms);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){schedule(0);},{once:true});else schedule(0);
[80,180,400,800,1500,3000,6000].forEach(function(ms){setTimeout(apply,ms);});
if(window.MutationObserver){
  var mo=new MutationObserver(function(muts){var hit=muts.some(function(m){return Array.prototype.slice.call(m.addedNodes||[]).some(function(n){return n&&n.nodeType===1&&(n.id===ROOT_ID||(n.querySelector&&n.querySelector('#'+ROOT_ID)));});});if(hit)schedule(40);});
  mo.observe(document.documentElement,{childList:true,subtree:true});
}
pub();console.info('[Filin Labs] Phenomenon Perfect Matches Bridge V1 loaded',{version:VERSION,slug:PATH});
})();
