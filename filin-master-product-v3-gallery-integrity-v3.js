/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 GALLERY INTEGRITY V3
   Golden Standard GS2 media unifier.

   Supported authoritative sources:
   1) profile.overview.galleryImages                  (code/profile images)
   2) V16 verified GL01 state URLs                   (existing GL01 migration)
   3) current Golden thumbnails                      (runtime continuity)
   4) explicit profile media records:
      registryMeta.legacyGallery.recordId
      registryMeta.mediaSources.recordIds
      registryMeta.mediaSources.gl01RecordIds
      registryMeta.mediaSources.zeroBlockRecordIds

   IMPORTANT:
   - V3 NEVER scans every Zero Block on the page by itself.
   - New cards can mix code + GL01 + Zero Block safely by listing the
     relevant record IDs in registryMeta.mediaSources.
   - All collected assets are normalized, verified, service-art filtered,
     flat-artwork checked when CORS permits, and de-duplicated.
   - The cleaned array is written back to the profile and Golden is rebuilt
     so main image, arrows, autoplay and thumbnails use ONE source of truth.
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V3_GALLERY_INTEGRITY_V3__)return;
window.__FILIN_MASTER_PRODUCT_V3_GALLERY_INTEGRITY_V3__=true;

/* Supersede the old "loads = healthy" thumbnail helper. */
window.__FILIN_MASTER_PRODUCT_V3_GALLERY_THUMB_HEALTH_V1__=true;

var VERSION='3.0.0';
var ROOT_ID='filin-master-product-v3';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var EXCLUDE=['demograf_solid_copper_banana_plugs'];
if(EXCLUDE.indexOf(PATH)>=0)return;

var BAD_RE=/(?:^|[\/_\-.])(blank|empty|pixel|favicon|logo|sprite|cookie|payment|telegram|whatsapp|youtube|social|arrow|spinner|preload|loader|captcha|recaptcha|icon|icons|dollar|currency|money|owl|placeholder|watermark|badge|symbol)(?:[\/_\-.]|$)|gemini[_-]?generated|filin[_-]?owl|dollar[_-]?currency|currency[_-]?icon/i;

var state={
  version:VERSION,slug:PATH,ready:false,sourceMode:'mixed-authoritative',
  profileBefore:0,profileAfter:0,sourceProfile:0,sourceV16:0,sourceDom:0,
  sourceConfiguredRecords:0,configuredRecords:0,
  removedBad:0,removedDead:0,removedFlatArtwork:0,removedDuplicates:0,
  rebuilds:0,passes:0,mainReady:false,lastBad:'',lastError:''
};

var running=false,released=false,lastCleanSignature='',maxRebuilds=8;
var timer=null,observer=null;

function pub(){window.__FILIN_MASTER_PRODUCT_V3_GALLERY_INTEGRITY_V3_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[]);}
function str(v){return String(v==null?'':v).trim();}
function root(){return document.getElementById(ROOT_ID);}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null;}catch(e){return null;}}
function toUrl(v){try{return new URL(str(v),location.origin).href;}catch(e){return '';}}
function badUrl(u){
  if(!u||!/^https?:\/\//i.test(u))return true;
  var s='';
  try{var x=new URL(u);s=decodeURIComponent(x.pathname+' '+x.search);}catch(e){s=u;}
  return BAD_RE.test(s);
}
function canonical(u){
  try{
    var x=new URL(u,location.origin),p=decodeURIComponent(x.pathname).replace(/\/+$/,'');
    p=p.replace(/\/-\/(?:resize|cover|format|quality)\/[^/]+/ig,'');
    var m=p.match(/\/(tild[a-z0-9-]+)\/(?:-\/[^/]+\/)*([^/]+)$/i);
    if(m)return (m[1]+'/'+m[2]).toLowerCase();
    return (x.hostname.toLowerCase()+p.toLowerCase());
  }catch(e){return str(u).replace(/[?#].*$/,'').toLowerCase();}
}
function add(pool,v,kind){
  var u=toUrl(v);if(!u)return;
  var k=canonical(u);
  if(!pool[k])pool[k]={url:u,kinds:Object.create(null)};
  pool[k].kinds[kind||'unknown']=1;
}
function imageUrlsFromElement(el,out){
  if(!el||!el.getAttribute)return;
  ['data-img-zoom-url','data-original','data-bg','data-src','data-lazy-src','data-original-src','data-content-cover-bg','src'].forEach(function(a){
    var v=el.getAttribute(a);if(v)out.push(v);
  });
  var ss=el.getAttribute('srcset');
  if(ss)ss.split(',').forEach(function(x){var v=x.trim().split(/\s+/)[0];if(v)out.push(v);});
  var st=el.getAttribute('style')||'',m,re=/url\(["']?([^"')]+)["']?\)/ig;
  while((m=re.exec(st)))out.push(m[1]);
}
function configuredRecordIds(p){
  var out=[],meta=p&&p.registryMeta||{},ms=meta.mediaSources||{};
  function push(v){
    if(Array.isArray(v))v.forEach(push);
    else if(v!=null&&str(v)&&out.indexOf(str(v).replace(/^#/,''))<0)out.push(str(v).replace(/^#/,''));
  }
  if(meta.legacyGallery)push(meta.legacyGallery.recordId);
  push(ms.recordIds);push(ms.gl01RecordIds);push(ms.zeroBlockRecordIds);
  return out;
}
function recordUrls(id){
  var r=document.getElementById(id)||document.querySelector('#'+CSS.escape(id));
  if(!r)return[];
  var out=[];
  arr(r.querySelectorAll(
    '.t-slds__item img,.t-slds__item [data-img-zoom-url],.t-slds__item [data-original],'+
    '.t-slds__item [data-src],.t-slds__item [style*="background-image"],'+
    'img,[data-img-zoom-url],[data-original],[data-bg],[data-src],[data-lazy-src],'+
    '[data-original-src],[style*="background-image"],[data-elem-type="image"]'
  )).forEach(function(el){imageUrlsFromElement(el,out);});
  imageUrlsFromElement(r,out);
  return out;
}
function sourcePool(){
  var pool=Object.create(null),p=profile(),xs=p&&p.overview&&p.overview.galleryImages;
  if(Array.isArray(xs)){
    state.sourceProfile=xs.length;
    xs.forEach(function(u){add(pool,u,'profile');});
  }else state.sourceProfile=0;

  var s16=window.__FILIN_MASTER_PRODUCT_V5_UNIFIED_LOADER_V16_STATE__;
  if(s16&&s16.slug===PATH&&Array.isArray(s16.urls)){
    state.sourceV16=s16.urls.length;
    s16.urls.forEach(function(u){add(pool,u,'v16-gl01');});
  }else state.sourceV16=0;

  var r=root(),dom=[];
  if(r)dom=arr(r.querySelectorAll('.v3-thumb img')).map(function(im){
    return im.currentSrc||im.getAttribute('src')||im.src||'';
  }).filter(Boolean);
  state.sourceDom=dom.length;
  dom.forEach(function(u){add(pool,u,'golden-dom');});

  var ids=configuredRecordIds(p),recordCount=0;
  state.configuredRecords=ids.length;
  ids.forEach(function(id){
    var urls=recordUrls(id);recordCount+=urls.length;
    urls.forEach(function(u){add(pool,u,'configured-record');});
  });
  state.sourceConfiguredRecords=recordCount;
  return Object.keys(pool).map(function(k){return pool[k];});
}
function flatArtworkScore(im){
  try{
    var c=document.createElement('canvas'),w=28,h=28;
    c.width=w;c.height=h;
    var ctx=c.getContext('2d',{willReadFrequently:true});
    ctx.drawImage(im,0,0,w,h);
    var d=ctx.getImageData(0,0,w,h).data;
    var colors=Object.create(null),unique=0,sum=0,sum2=0,n=0,edge=0,prev=-1;
    for(var i=0;i<d.length;i+=4){
      if(d[i+3]<24)continue;
      var r=d[i],g=d[i+1],b=d[i+2],y=(r*299+g*587+b*114)/1000;
      var key=(r>>5)+'-'+(g>>5)+'-'+(b>>5);
      if(!colors[key]){colors[key]=1;unique++;}
      sum+=y;sum2+=y*y;n++;
      if(prev>=0)edge+=Math.abs(y-prev);
      prev=y;
    }
    if(n<50)return null;
    var mean=sum/n,variance=Math.max(0,sum2/n-mean*mean),edgeAvg=edge/Math.max(1,n-1);
    return {unique:unique,variance:variance,edge:edgeAvg,flat:(unique<=7)||(unique<=11&&variance<900&&edgeAvg<17)};
  }catch(e){return null;}
}
function probe(item){
  return new Promise(function(resolve){
    var u=item.url;
    if(badUrl(u)){resolve({ok:false,reason:'bad-url',url:u,item:item});return;}
    var im=new Image(),done=false,tm=setTimeout(function(){finish(false,'timeout');},7000);
    try{im.crossOrigin='anonymous';}catch(e){}
    function finish(ok,reason,flat){
      if(done)return;done=true;clearTimeout(tm);
      resolve({ok:!!ok,reason:reason||'',url:u,w:im.naturalWidth||0,h:im.naturalHeight||0,item:item,flat:flat||null});
    }
    im.onload=function(){
      var w=im.naturalWidth||0,h=im.naturalHeight||0,ratio=h?w/h:0;
      if(!(w>=320&&h>=220&&Math.max(w,h)>=560&&ratio>=0.32&&ratio<=3.8)){finish(false,'dimensions');return;}
      var flat=flatArtworkScore(im);
      if(flat&&flat.flat){finish(false,'flat-artwork',flat);return;}
      finish(true,'ok',flat);
    };
    im.onerror=function(){finish(false,'load-error');};
    im.src=u;
  });
}
function sameList(a,b){
  if(a.length!==b.length)return false;
  for(var i=0;i<a.length;i++)if(canonical(a[i])!==canonical(b[i]))return false;
  return true;
}
function domList(){
  var r=root();if(!r)return[];
  return arr(r.querySelectorAll('.v3-thumb img')).map(function(im){
    return im.currentSrc||im.getAttribute('src')||im.src||'';
  }).filter(Boolean);
}
function domMatches(clean){return sameList(domList(),clean);}
function release(){
  if(released)return;released=true;
  document.documentElement.classList.remove('fp-gallery-integrity-boot');
  var s=document.getElementById('filin-gallery-integrity-v3-preboot');if(s)s.remove();
}
function installPreboot(){
  if(document.getElementById('filin-gallery-integrity-v3-preboot'))return;
  var s=document.createElement('style');s.id='filin-gallery-integrity-v3-preboot';
  s.textContent='html.fp-gallery-integrity-boot #'+ROOT_ID+' .v3-gallery{visibility:hidden!important}';
  (document.head||document.documentElement).appendChild(s);
  document.documentElement.classList.add('fp-gallery-integrity-boot');
}
function rebindInteractions(){
  setTimeout(function(){
    try{
      var x=window.FilinMasterProductV3RegistryInteractions;
      if(x&&typeof x.apply==='function')x.apply();
    }catch(e){}
  },120);
}
async function sanitize(reason){
  if(running)return false;
  var p=profile(),r=root();
  if(!p||!r)return false;
  running=true;state.passes++;pub();
  try{
    p.overview=p.overview||{};
    var pool=sourcePool();
    state.profileBefore=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.length:0;

    var seen=Object.create(null),deduped=[],dup=0,bad=0;
    pool.forEach(function(item){
      var u=item.url,k=canonical(u);
      if(badUrl(u)){bad++;state.lastBad=u;return;}
      if(seen[k]){dup++;return;}
      seen[k]=1;deduped.push(item);
    });

    var results=await Promise.all(deduped.map(probe)),clean=[];
    results.forEach(function(x){
      if(x.ok){clean.push(x.url);return;}
      state.lastBad=x.url||state.lastBad;
      if(x.reason==='bad-url')state.removedBad++;
      else if(x.reason==='flat-artwork')state.removedFlatArtwork++;
      else state.removedDead++;
    });
    state.removedBad+=bad;
    state.removedDuplicates+=dup;
    state.profileAfter=clean.length;
    if(!clean.length)throw new Error('gallery integrity produced an empty gallery');

    var current=Array.isArray(p.overview.galleryImages)?p.overview.galleryImages.map(toUrl).filter(Boolean):[];
    var sig=clean.map(canonical).join('|');
    var needProfile=!sameList(current,clean);
    var needDom=!domMatches(clean);

    if(needProfile)p.overview.galleryImages=clean.slice();
    if((needProfile||needDom||lastCleanSignature!==sig)&&state.rebuilds<maxRebuilds){
      var api=window.FilinMasterProductV3;
      if(api&&typeof api.apply==='function'){
        state.rebuilds++;lastCleanSignature=sig;
        api.apply();
        rebindInteractions();
      }
    }

    var rr=root(),main=rr&&rr.querySelector('.v3-main-img');
    if(main&&clean.length){
      var keys=Object.create(null);clean.forEach(function(u){keys[canonical(u)]=1;});
      var mu=main.currentSrc||main.getAttribute('src')||main.src||'';
      if(!keys[canonical(mu)]||badUrl(mu))main.src=clean[0];
      state.mainReady=true;
    }
    state.ready=true;state.lastError='';pub();release();
    return true;
  }catch(e){
    state.lastError=String(e&&e.message||e);pub();release();return false;
  }finally{running=false;}
}
function schedule(ms){
  clearTimeout(timer);
  timer=setTimeout(function(){sanitize('mutation');},ms==null?80:ms);
}
function observeGallery(){
  if(observer||!window.MutationObserver)return;
  observer=new MutationObserver(function(muts){
    var hit=muts.some(function(m){
      if(m.type==='attributes')return m.target&&m.target.closest&&m.target.closest('#'+ROOT_ID+' .v3-gallery');
      return arr(m.addedNodes||[]).some(function(n){
        return n&&n.nodeType===1&&(
          (n.matches&&n.matches('.v3-thumb,.v3-thumb img,.v3-main-img'))||
          (n.querySelector&&n.querySelector('.v3-thumb,.v3-thumb img,.v3-main-img'))
        );
      });
    });
    if(hit)schedule(90);
  });
  observer.observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['src','srcset']});
}
function waitAndStart(){
  var started=Date.now(),t=setInterval(function(){
    if(profile()&&root()){
      clearInterval(t);
      sanitize('initial');
      [700,1800,3200,5200,8000,12000].forEach(function(ms){setTimeout(function(){sanitize('stabilize-'+ms);},ms);});
      observeGallery();
    }else if(Date.now()-started>35000){
      clearInterval(t);state.lastError='profile/root timeout';pub();release();
    }
  },70);
}

installPreboot();
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',waitAndStart,{once:true});
else waitAndStart();
setTimeout(function(){if(!released){state.lastError=state.lastError||'failsafe release';pub();release();}},37000);
pub();
})();