/* ============================================================
   FILIN LABS — GOLDEN STANDARD GS2 — DAC / DAC+AMP BATCH 1
   Version 1.0.0 / 2026-08-20

   13 unique migrated routes.

   Source contract:
   - existing Golden profile / explicit profile data if already registered
   - GL01 gallery records
   - explicitly declared media records via registryMeta.mediaSources
   - product-local image-heavy Zero Blocks (bounded discovery only)
   - product-local inline code containing Tilda CDN product images
   - Rich Product Catalog images
   - hero image as final fallback

   Content contract:
   - preserve source Tilda hero / curator / overview / curation
   - preserve native commerce / tabs / options / Perfect Matches
   - build one Golden V3 profile and apply once
   - Gallery Integrity V3 (owned by GS2 router) sanitizes final media
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_GS2_DAC_BATCH1__)return;

var VERSION='1.0.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';
var TARGET=[
'demograf_tube_dacs_multibit',
'gerbera_multibit_dac',
'gerbera_onda',
'audioinstrument_dac_di_200_accuracy',
'gerbera_pcm1794_dsd1794_dac_otis',
'eridan_antares_r2r_dac',
'gerbera_tv_lpf_dac',
'demograf_bellerophon_dac_solid_state_amplifier',
'gerbera_grigio',
'gerbera_sound_emotion',
'gerbera_squire',
'gerbera_sound_onda_ha',
'demograf_hades_hybrid_class_d_amplifier_dac'
];
if(TARGET.indexOf(PATH)<0)return;
window.__FILIN_GS2_DAC_BATCH1__=true;

var CDN='https://cdn.jsdelivr.net/gh/FilinAudio/442-2@';
var DEP={
 rich:CDN+'f78a192778064f62e6c6bf45d5c338d9826d185d/filin-rich-product-catalog-v2-runtime.js',
 core:CDN+'e4de1ae708daa2966411d764f3d803af5b59ec17/filin-master-product-v3-3-2-golden-standard-runtime.js',
 registry:CDN+'20681020ae3ddbacd0a467f84e0b5ea831135706/filin-master-product-v3-profiles-registry-v1.js',
 commerce:CDN+'44c895edcbef44d44014e494781c0046bd969b67/filin-master-product-v3-clean-commerce-v2.js',
 wishlist:CDN+'3d06611f1c1daff094db45a7659a13a6f3d31d88/filin-master-product-v3-wishlist-bridge-v4.js'
};

var state={
 version:VERSION,slug:PATH,mode:'gs2-dac-dacamp-batch1',
 ready:false,profileBuilt:false,baseReady:false,mainReady:false,
 gallerySourceModes:[],galleryCandidates:0,galleryVerified:0,
 gl01Records:[],zeroBlockRecords:[],codeImages:0,richImages:0,
 price:0,tabs:0,curation:0,pm:false,quarantined:0,error:''
};
function pub(){window.__FILIN_GS2_DAC_BATCH1_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[]);}
function str(v){return String(v==null?'':v).trim();}
function norm(v){return str(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
function esc(v){return str(v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function num(v){var n=Number(str(v).replace(/[^0-9.,-]/g,'').replace(/,/g,''));return Number.isFinite(n)?n:0;}
function load(src,test){return new Promise(function(resolve,reject){
 if(test&&test())return resolve(true);
 var file=src.split('/').pop().split('?')[0];
 var existing=arr(document.scripts||[]).find(function(s){return String(s.src||'').indexOf(file)>=0;});
 if(existing){
   var n=0,t=setInterval(function(){
     if(!test||test()){clearInterval(t);resolve(true);}
     else if(++n>300){clearInterval(t);resolve(false);}
   },50);return;
 }
 var s=document.createElement('script');s.src=src;s.async=false;
 s.onload=function(){resolve(true);};s.onerror=function(){reject(new Error('load failed: '+src));};
 (document.head||document.documentElement).appendChild(s);
});}
function wait(test,ms){return new Promise(function(resolve){
 var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test();}catch(e){}
 if(ok){clearInterval(t);resolve(true);}else if(Date.now()-st>(ms||18000)){clearInterval(t);resolve(false);}},60);
});}
function recOf(n){return n&&n.closest?n.closest('.t-rec,[id^="rec"]'):null;}
function recId(r){return r&&r.id&&/^rec\d+$/i.test(r.id)?r.id:'';}
function textOf(n){return norm(n&&(n.innerText||n.textContent));}
function isNoiseText(t){
 t=norm(t).toLowerCase();
 return /shipping\s*&?\s*payment|contact\s*&?\s*support|legal information|privacy|cookies|proceed to payment|refer a friend|loyalty|made on tilda/.test(t);
}

function toUrl(v){try{return new URL(str(v),location.origin).href;}catch(e){return'';}}
function cssUrls(v){var out=[],m,re=/url\(["']?([^"')]+)["']?\)/ig;v=str(v);while((m=re.exec(v)))out.push(toUrl(m[1]));return out;}
function validUrl(u){
 if(!u||!/^https?:\/\//i.test(u))return false;
 if(!/(?:static|optim|thb)\.tildacdn\.(?:com|net|info)/i.test(u)&&!/\.(?:jpe?g|png|webp|avif)(?:$|[?#])/i.test(u))return false;
 if(/blank\.gif|empty\.png|pixel|favicon|logo|sprite|cookie|payment|telegram|whatsapp|youtube|social|arrow|spinner|preload|loader|captcha|recaptcha|icon[-_.]|dollar|currency|money|owl|placeholder|gemini_generated/i.test(u))return false;
 return true;
}
function canon(u){try{var x=new URL(u),p=decodeURIComponent(x.pathname).replace(/\/+$/,'');return (x.hostname+p).toLowerCase().replace(/\/-\/(?:resize|cover|format|quality)\/[^/]+/ig,'');}catch(e){return str(u).replace(/[?#].*$/,'').toLowerCase();}}
function push(out,seen,v){var u=toUrl(v);if(!validUrl(u))return;var k=canon(u);if(seen[k])return;seen[k]=1;out.push(u);}
function imageUrlsFromEl(el,out,seen){
 if(!el||!el.getAttribute)return;
 ['data-img-zoom-url','data-original','data-src','data-lazy-src','data-bg','data-original-src','data-content-cover-bg','src'].forEach(function(a){push(out,seen,el.getAttribute(a));});
 var ss=el.getAttribute('srcset');if(ss)ss.split(',').forEach(function(x){push(out,seen,x.trim().split(/\s+/)[0]);});
 cssUrls(el.getAttribute('style')).forEach(function(u){push(out,seen,u);});
 try{cssUrls(getComputedStyle(el).backgroundImage).forEach(function(u){push(out,seen,u);});}catch(e){}
}
function recordImages(r){
 var out=[],seen={};if(!r)return out;
 imageUrlsFromEl(r,out,seen);
 arr(r.querySelectorAll('img,.t-bgimg,.tn-atom,.tn-atom__img,[data-original],[data-src],[data-lazy-src],[data-img-zoom-url],[data-content-cover-bg],[style*="background-image"]')).forEach(function(el){imageUrlsFromEl(el,out,seen);});
 return out;
}
function probe(u){return new Promise(function(resolve){
 var im=new Image(),done=false,tm=setTimeout(function(){finish(null);},5200);
 function finish(x){if(done)return;done=true;clearTimeout(tm);resolve(x);}
 im.onload=function(){var w=im.naturalWidth||0,h=im.naturalHeight||0,ratio=h?w/h:0;
   if(w>=420&&h>=280&&Math.max(w,h)>=600&&ratio>=0.32&&ratio<=3.8)finish({url:u,w:w,h:h});else finish(null);};
 im.onerror=function(){finish(null);};im.src=u;
});}
function findGl01Records(){
 var rs=arr(document.querySelectorAll('.t-rec[data-record-type="670"],.t670')).map(function(x){return recOf(x)||x;});
 var uniq=[];rs.forEach(function(r){if(r&&!r.closest('#'+ROOT)&&!r.closest('header,footer,#t-header,#t-footer')&&uniq.indexOf(r)<0)uniq.push(r);});
 return uniq.filter(function(r){return recordImages(r).length>0;});
}
function explicitRecordIds(){
 var ids=[];
 try{
   var p=window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH];
   var m=p&&p.registryMeta&&p.registryMeta.mediaSources;
   ['recordIds','gl01RecordIds','zeroBlockRecordIds'].forEach(function(k){if(m&&Array.isArray(m[k]))m[k].forEach(function(x){if(ids.indexOf(x)<0)ids.push(x);});});
 }catch(e){}
 try{
   var g=window.FilinGoldenMediaRegistry&&window.FilinGoldenMediaRegistry[PATH];
   ['recordIds','gl01RecordIds','zeroBlockRecordIds'].forEach(function(k){if(g&&Array.isArray(g[k]))g[k].forEach(function(x){if(ids.indexOf(x)<0)ids.push(x);});});
 }catch(e){}
 return ids;
}
function findLegacyProduct(){
 var xs=arr(document.querySelectorAll('.js-product')).filter(function(x){return !x.closest('#'+ROOT)&&!x.closest('.t706,.t1002,.t-popup');});
 xs.sort(function(a,b){function score(x){return(x.querySelector('.js-product-name')?5:0)+(x.querySelector('.js-product-price')?5:0)+(x.querySelector('.tabs-wrapper')?8:0)+(x.querySelector('.perfect-matches-block')?6:0);}return score(b)-score(a);});
 return xs[0]||null;
}
function findBoundedZeroBlocks(){
 var out=[],cover=document.querySelector('.t-cover'),commerce=findLegacyProduct();
 arr(document.querySelectorAll('.t-rec,[id^="rec"]')).forEach(function(r){
   if(!r||r.closest('#'+ROOT)||r.closest('header,footer,#t-header,#t-footer')||(cover&&cover.contains(r)))return;
   if(!r.querySelector('.t396,.tn-elem,[data-artboard-recid]'))return;
   if(r.querySelector('form,.t706,.t1002,.js-product'))return;
   var t=textOf(r);
   if(isNoiseText(t)||/perfect matches|reviews?|category\s*&?\s*budget|sonic signature|high technologies|curator.?s choice|synergy match|genres? accord/i.test(t))return;
   var imgs=recordImages(r);if(!imgs.length)return;
   if(t.length>420&&imgs.length<2)return;
   if(commerce){var cr=recOf(commerce),all=arr(document.querySelectorAll('.t-rec,[id^="rec"]')),i=all.indexOf(r),ci=all.indexOf(cr);if(ci>=0&&i>ci+2)return;}
   out.push(r);
 });
 return out;
}
function codeImages(){
 var out=[],seen={};
 arr(document.scripts||[]).forEach(function(s){
   var t=str(s.textContent);if(!t||t.length>900000||t.indexOf('tildacdn')<0)return;
   if(t.indexOf(PATH)<0&&!/galleryImages|productImages|images\s*[:=]/i.test(t))return;
   var m,re=/https?:\/\/(?:static|optim|thb)\.tildacdn\.(?:com|net|info)\/[^"'<>\\\s,}\]]+/ig;
   while((m=re.exec(t)))push(out,seen,m[0]);
 });
 return out;
}

var CUR=[
 {re:/cat(?:h)?egory\s*&?\s*budget\s*tier|budget\s*tier/i,title:'Category & Budget Tier'},
 {re:/tags?\s*&\s*features|tags?\s+features/i,title:'Tags & Features'},
 {re:/sonic\s*signature/i,title:'Sonic Signature'},
 {re:/high\s*technolog/i,title:'High Technologies'},
 {re:/curator.?s\s*choice/i,title:'Curator’s Choice'},
 {re:/synergy\s*match/i,title:'Synergy Match'},
 {re:/genres?\s*accord/i,title:'Genres Accord'}
];
function curDef(t){for(var i=0;i<CUR.length;i++)if(CUR[i].re.test(norm(t)))return CUR[i];return null;}
function findHero(){
 var cover=document.querySelector('.t-cover');if(!cover)return{h1:'',desc:'',bg:'',record:null};
 var h=cover.querySelector('h1,.t-title');
 var texts=arr(cover.querySelectorAll('.t-descr,.t-text,p,.tn-atom')).map(textOf).filter(function(t){return t.length>28&&!/back to the/i.test(t)&&!isNoiseText(t);});
 var imgs=recordImages(cover);
 return{h1:textOf(h),desc:texts[0]||'',bg:imgs[0]||'',record:recOf(cover)};
}
function findCurator(){
 var candidates=arr(document.querySelectorAll('.t-rec,[id^="rec"]')).filter(function(r){if(r.closest('#'+ROOT)||r.closest('header,footer'))return false;var t=textOf(r);return t.length<900&&(/personally listened/i.test(t)||(/handcrafted by/i.test(t)&&/filin labs/i.test(t)));});
 candidates.sort(function(a,b){return textOf(a).length-textOf(b).length;});
 var r=candidates[0]||null,t=r?textOf(r):'';
 var ss=t.match(/[^.!?]+[.!?]+|[^.!?]+$/g)||[],seen={},o=[];
 ss.forEach(function(s){s=norm(s);var k=s.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();if(s&&!seen[k]){seen[k]=1;o.push(s);}});
 return{text:norm(o.join(' ')),record:r};
}
function richProduct(){try{return window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products&&window.FilinRichCatalogV2.products[PATH]||null;}catch(e){return null;}}
function findOverview(name){
 var hs=arr(document.querySelectorAll('h2,h3')).filter(function(h){var t=textOf(h);return t&&!h.closest('#'+ROOT)&&!curDef(t)&&!/perfect matches|shipping|contact|legal|reviews?/i.test(t);});
 var toks=norm(name).toLowerCase().split(/[^a-z0-9]+/).filter(function(x){return x.length>2;});
 function score(h){var t=textOf(h).toLowerCase(),s=0;toks.forEach(function(k){if(t.indexOf(k)>=0)s++;});return s;}
 hs.sort(function(a,b){return score(b)-score(a);});
 var h=hs[0]||null,r=recOf(h);if(!r)return{title:'',html:'',record:null};
 var nodes=arr(r.querySelectorAll('h2,h3,h4,p,li')).filter(function(n){var t=textOf(n);return t&&!curDef(t)&&!isNoiseText(t);});
 var html=nodes.slice(0,22).map(function(n){var tag=(n.tagName||'P').toLowerCase();if(['h2','h3','h4','p','li'].indexOf(tag)<0)tag='p';return '<'+tag+'>'+esc(textOf(n))+'</'+tag+'>';}).join('');
 return{title:textOf(h),html:html,record:r};
}
function extractCuration(){
 var result=[],records=[];
 CUR.forEach(function(def){
   var heads=arr(document.querySelectorAll('h2,h3,h4,.t-title,.t-descr,.t-text,.tn-atom')).filter(function(n){if(n.closest('#'+ROOT)||n.closest('header,footer,.t706,.t1002'))return false;var t=textOf(n);return t&&t.length<120&&def.re.test(t);});
   var h=heads[0];if(!h)return;var r=recOf(h);if(r&&records.indexOf(r)<0)records.push(r);var body=[];
   if(r){var all=arr(r.querySelectorAll('h2,h3,h4,p,.t-title,.t-descr,.t-text,.tn-atom,li')).filter(function(n){return textOf(n);});var idx=all.indexOf(h);for(var i=idx+1;i<all.length;i++){var t=textOf(all[i]);if(curDef(t))break;if(t.length>2&&!isNoiseText(t)&&t.toLowerCase()!==textOf(h).toLowerCase())body.push(t);if(body.join(' ').length>1800)break;}}
   var txt=norm(body.join(' '));if(!txt){var parent=h.parentElement;txt=parent?norm(textOf(parent).replace(textOf(h),'')):'';}if(txt)result.push({title:def.title,html:esc(txt)});
 });
 return{items:result,records:records};
}
function makeSpecTable(rows){if(!Array.isArray(rows)||!rows.length)return'';return '<table class="specs-table"><tbody>'+rows.map(function(r){return '<tr><td><strong>'+esc(r[0])+'</strong></td><td>'+esc(r[1])+'</td></tr>';}).join('')+'</tbody></table>';}
function commerceData(){
 var lp=findLegacyProduct(),rich=richProduct(),name='',price=0,inner='',pm=false,tabs=0;
 if(lp){var nn=lp.querySelector('.js-product-name'),pp=lp.querySelector('.js-product-price');name=textOf(nn)||textOf(lp.querySelector('.t-name,h2,h3'))||'';price=num(pp&&textOf(pp));var clone=lp.cloneNode(true);arr(clone.querySelectorAll('script,style,noscript,template')).forEach(function(x){x.remove();});inner=clone.innerHTML||'';pm=!!clone.querySelector('.perfect-matches-block');tabs=clone.querySelectorAll('.tab-btn,.tabs-header button').length;}
 if(!name&&rich)name=rich.name||'';if(!price&&rich)price=num(rich.price);
 if(!inner&&rich){inner='<div class="purchase-container"><span class="js-product-name" style="display:none">'+esc(name)+'</span><div class="price-title">Total*: $<span class="js-product-price">'+esc(price)+'</span></div><a class="buy-btn js-product-btn" href="#order">Buy Now</a></div><div class="tabs-wrapper"><div class="tabs-header"><button class="tab-btn active" type="button" onclick="showTab(event, \'spec\')">Specification</button></div><div class="tab-content" id="spec"><div class="content-container">'+makeSpecTable(rich.specRows||[])+'</div></div></div>';tabs=1;}
 return{legacy:lp,name:name,price:price,innerHTML:inner,pm:pm,tabs:tabs};
}
function reviewInfo(name){var a=arr(document.querySelectorAll('a')).find(function(x){return /reviews?/i.test(textOf(x))&&!x.closest('header,footer');});return{cta:a?textOf(a):('The Reviews of '+name),query:name,intro:'Share your listening experience with '+name+'.'};}
function fallbackCuration(rich){
 if(!rich)return[];var cat=(rich.categories&&rich.categories[0])||'DAC',specs=Array.isArray(rich.specRows)?rich.specRows:[],tags=['#'+String(rich.brand||'').replace(/\s+/g,''),'#DAC'];specs.slice(1,7).forEach(function(r){tags.push('#'+String(r[0]||'').replace(/[^a-z0-9]+/ig,''));});
 return[{title:'Category & Budget Tier',html:esc(cat+(rich.price?(' · $'+rich.price):''))},{title:'Tags & Features',html:esc(tags.join(' '))}];
}
async function buildGallery(hero,overview){
 var raw=[],seen={},modes=[];function addMode(m){if(modes.indexOf(m)<0)modes.push(m);}function addUrls(xs,mode){var before=raw.length;(xs||[]).forEach(function(u){push(raw,seen,u);});if(raw.length>before)addMode(mode);}
 explicitRecordIds().forEach(function(id){var r=document.getElementById(id);if(r)addUrls(recordImages(r),'explicit-record');});
 findGl01Records().forEach(function(r){var id=recId(r);if(id&&state.gl01Records.indexOf(id)<0)state.gl01Records.push(id);addUrls(recordImages(r),'gl01');});
 findBoundedZeroBlocks().forEach(function(r){var id=recId(r);if(id&&state.zeroBlockRecords.indexOf(id)<0)state.zeroBlockRecords.push(id);addUrls(recordImages(r),'bounded-zero-block');});
 var code=codeImages();state.codeImages=code.length;addUrls(code,'inline-code');
 var rich=richProduct(),ri=rich&&Array.isArray(rich.images)?rich.images:[];state.richImages=ri.length;addUrls(ri,'rich-catalog');
 if(overview&&overview.record)addUrls(recordImages(overview.record),'overview-record');if(hero&&hero.bg)addUrls([hero.bg],'hero-fallback');
 state.galleryCandidates=raw.length;state.gallerySourceModes=modes;var checks=await Promise.all(raw.map(probe)),good=[];checks.forEach(function(x){if(x)good.push(x.url);});state.galleryVerified=good.length;pub();return good;
}
function insertProfile(p){var api=window.FilinMasterProductV3;if(!api||!api.profiles)return false;api.profiles[PATH]=p;return true;}
function waitMain(ms){return wait(function(){var im=document.querySelector('#'+ROOT+' .v3-main-img');return im&&im.complete&&im.naturalWidth>1;},ms||12000);}
function hideRecord(r){if(!r||r.closest('#'+ROOT)||r===document.body||r===document.documentElement)return 0;r.setAttribute('data-filin-gs2-dac-source','1');r.style.setProperty('display','none','important');return 1;}
function quarantine(records){var n=0,seen=[];(records||[]).forEach(function(r){r=recOf(r)||r;if(r&&seen.indexOf(r)<0){seen.push(r);n+=hideRecord(r);}});state.quarantined=n;}

async function boot(){
 try{
   await load(DEP.rich,function(){return !!window.FilinRichCatalogV2;});
   var rich=richProduct(),q=commerceData(),hero=findHero(),curator=findCurator(),overview=findOverview(q.name||(rich&&rich.name)||PATH),cur=extractCuration();
   var gallery=await buildGallery(hero,overview);if(!gallery.length)throw new Error('no verified product gallery images');
   await load(DEP.core,function(){return !!(window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles);});
   var existing=window.FilinMasterProductV3.profiles[PATH]||null,reviews=reviewInfo(q.name||(rich&&rich.name)||PATH),curation=cur.items.length?cur.items:fallbackCuration(rich);
   var profile={schemaVersion:2,slug:PATH,id:PATH.replace(/_/g,'-'),category:(rich&&rich.categories&&rich.categories[0])||'dacs',currency:'USD',hero:{staticH1:hero.h1||(rich&&rich.name)||q.name||PATH.replace(/_/g,' '),description:hero.desc||(rich&&rich.description)||'',background:hero.bg||gallery[0]},curator:curator.text||'Personally selected, listened, approved & curated by Filin Labs Kazakhstan.',overview:{title:overview.title||(rich&&rich.name)||q.name||'',html:overview.html||('<p>'+esc((rich&&rich.description)||'')+'</p>'),galleryImages:gallery.slice()},curation:curation,commerce:{basePrice:q.price||(rich&&num(rich.price))||0,displayName:q.name||(rich&&rich.name)||PATH.replace(/_/g,' '),cartName:q.name||(rich&&rich.name)||PATH.replace(/_/g,' '),stickyTitle:q.name||(rich&&rich.name)||PATH.replace(/_/g,' '),innerHTML:q.innerHTML},reviewsCTA:reviews.cta,reviewsQuery:reviews.query,reviewsIntro:reviews.intro,golden:{backLabel:"Back to the Filin's nest",backHref:'/',mobileHeroHeight:860,resultLabel:'Ultimate Synergy'},reviewsKey:PATH.replace(/_/g,'-'),registryMeta:{version:'gs2-dac-batch1',mediaSources:{gl01RecordIds:state.gl01Records.slice(),zeroBlockRecordIds:state.zeroBlockRecords.slice(),recordIds:explicitRecordIds()},sourceModes:state.gallerySourceModes.slice()}};
   if(existing&&existing.registryMeta&&existing.registryMeta.mediaSources)profile.registryMeta.mediaSources=existing.registryMeta.mediaSources;
   if(!insertProfile(profile))throw new Error('could not register Golden profile');
   state.profileBuilt=true;state.price=profile.commerce.basePrice;state.tabs=q.tabs;state.pm=q.pm;state.curation=profile.curation.length;pub();
   window.FilinMasterProductV3.apply();state.baseReady=await wait(function(){return !!document.querySelector('#'+ROOT+' .v3-shell');},12000);if(!state.baseReady)throw new Error('Golden root did not become ready');
   await load(DEP.registry,function(){return !!window.__FILIN_MASTER_PRODUCT_V3_PROFILES_REGISTRY_V1__;});await load(DEP.commerce,function(){return !!window.__FILIN_MASTER_PRODUCT_V3_CLEAN_COMMERCE_V2__;});await load(DEP.wishlist,function(){return !!window.__FILIN_MASTER_PRODUCT_V3_WISHLIST_BRIDGE_V4__;});
   try{window.FilinMasterProductV3RegistryInteractions&&window.FilinMasterProductV3RegistryInteractions.apply&&window.FilinMasterProductV3RegistryInteractions.apply();}catch(e){}
   state.mainReady=await waitMain(12000);if(!state.mainReady)throw new Error('Golden main image did not load');
   var legacyRecords=[q.legacy,overview.record,curator.record].concat(cur.records||[]);state.gl01Records.forEach(function(id){legacyRecords.push(document.getElementById(id));});state.zeroBlockRecords.forEach(function(id){legacyRecords.push(document.getElementById(id));});quarantine(legacyRecords);
   state.ready=true;state.error='';pub();console.info('[Filin Labs GS2] DAC Batch 1 ready',state);
 }catch(e){state.error=String(e&&e.message||e);state.ready=false;pub();console.warn('[Filin Labs GS2 DAC Batch 1]',state.error,state);}
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(boot,0);},{once:true});else setTimeout(boot,0);
pub();
})();