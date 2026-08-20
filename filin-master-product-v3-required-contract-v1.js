/* ============================================================
   FILIN LABS — MASTER PRODUCT V3 REQUIRED CONTRACT V1
   2026-08-20

   Post-build contract for newly migrated Golden product cards.

   Guarantees AFTER a dynamic profile has been built:
   - exactly 7 curation cards in canonical order
   - Perfect Matches exists even when legacy Tilda had no PM block
   - one black Handcrafted / curated strip exists between hero and Golden root
   - existing source content wins; missing fields are derived conservatively
     from Rich Catalog, product specs, overview and category
   - idempotent and safe to reuse for future migrated batches
   ============================================================ */
(function(){
'use strict';
if(window.__FILIN_MASTER_PRODUCT_V3_REQUIRED_CONTRACT_V1__)return;
window.__FILIN_MASTER_PRODUCT_V3_REQUIRED_CONTRACT_V1__=true;

var VERSION='1.0.0';
var PATH=(location.pathname||'/').replace(/^\/+|\/+$/g,'');
var ROOT='filin-master-product-v3';
var state={
 version:VERSION,slug:PATH,profileFound:false,richFound:false,
 curationBefore:0,curationAfter:0,curationAdded:0,
 pmBefore:false,pmAdded:false,pmItems:0,
 curatorBefore:false,curatorAdded:false,curatorText:'',
 reapplied:false,rootReady:false,ready:false,error:''
};
function pub(){window.__FILIN_MASTER_PRODUCT_V3_REQUIRED_CONTRACT_V1_STATE__=JSON.parse(JSON.stringify(state));}
function arr(v){return Array.prototype.slice.call(v||[]);}
function str(v){return String(v==null?'':v);}
function norm(v){return str(v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
function esc(v){return str(v).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function strip(html){var b=document.createElement('div');b.innerHTML=str(html);return norm(b.textContent||'');}
function wait(test,ms){return new Promise(function(resolve){var st=Date.now(),t=setInterval(function(){var ok=false;try{ok=!!test();}catch(e){}if(ok){clearInterval(t);resolve(true);}else if(Date.now()-st>(ms||20000)){clearInterval(t);resolve(false);}},60);});}
function profile(){try{return window.FilinMasterProductV3&&window.FilinMasterProductV3.profiles&&window.FilinMasterProductV3.profiles[PATH]||null;}catch(e){return null;}}
function rich(){try{return window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products&&window.FilinRichCatalogV2.products[PATH]||null;}catch(e){return null;}}
function key(v){return norm(v).toLowerCase().replace(/[’']/g,'').replace(/&/g,' and ').replace(/[^a-z0-9]+/g,' ').replace(/\s+/g,' ').trim();}

var ORDER=[
 'Category & Budget Tier','Tags & Features','Sonic Signature','High Technologies',
 'Curator’s Choice','Synergy Match','Genres Accord'
];
function canonicalTitle(t){
 var k=key(t);
 if(/category.*budget|budget.*tier/.test(k))return ORDER[0];
 if(/tags?.*features?/.test(k))return ORDER[1];
 if(/sonic.*signature/.test(k))return ORDER[2];
 if(/high.*technolog/.test(k))return ORDER[3];
 if(/curator.*choice/.test(k))return ORDER[4];
 if(/synergy.*match/.test(k))return ORDER[5];
 if(/genres?.*accord/.test(k))return ORDER[6];
 return '';
}
function priceTier(price){
 price=Number(price||0);
 if(price>=6000)return 'Flagship / Reference Tier';
 if(price>=3000)return 'Statement Class';
 if(price>=1500)return 'Boutique Reference';
 if(price>=800)return 'High-End Core';
 return 'Accessible High-End';
}
function specs(r){return r&&Array.isArray(r.specRows)?r.specRows.filter(function(x){return Array.isArray(x)&&x.length>=2;}):[];}
function specPairs(rows,re,max){var out=[];for(var i=0;i<rows.length&&out.length<(max||5);i++){var k=norm(rows[i][0]),v=norm(rows[i][1]);if(k&&v&&re.test(k)&&!/total price|warranty|lead times?/i.test(k))out.push({k:k,v:v});}return out;}
function sentences(v){return norm(v).split(/(?<=[.!?])\s+/).map(norm).filter(function(x){return x.length>24;});}
function sourceText(p,r){return norm([
 p&&p.hero&&p.hero.description,
 p&&p.overview&&strip(p.overview.html),
 r&&r.description,
 specs(r).map(function(x){return x[0]+': '+x[1];}).join('. ')
 ].filter(Boolean).join(' '));}
function bestSoundSentence(p,r){
 var ss=sentences(sourceText(p,r));
 var re=/sound|sonic|musical|timbre|timing|decay|warm|neutral|transparent|detail|dynamic|analog|organic|smooth|natural|stage|imaging|bass|treble|midrange|resolution/i;
 for(var i=0;i<ss.length;i++)if(re.test(ss[i])&&ss[i].length<330)return ss[i];
 var n=norm(r&&r.description);if(n)return n;
 return 'High-resolution digital conversion focused on tonal accuracy, timing and low-noise reproduction.';
}
function technologyText(r){
 var rows=specs(r);
 var ps=specPairs(rows,/technology|architecture|dac|chip|converter|sampling|sample|pcm|dsd|r2r|multibit|filter|clock|usb|spdif|i2s|output stage|tube output|power supply/i,5);
 if(!ps.length)ps=rows.filter(function(x){return !/total price|warranty|lead times?/i.test(x[0]);}).slice(0,5).map(function(x){return{k:norm(x[0]),v:norm(x[1])};});
 if(!ps.length)return 'See Key Features and Specification for the product’s conversion architecture and implementation details.';
 return ps.map(function(x){return '<strong>'+esc(x.k)+':</strong> '+esc(x.v);}).join('<br>');
}
function tagsText(p,r){
 var tags=[],seen={};
 function add(v){v=norm(v).replace(/[^A-Za-z0-9]+/g,'');if(!v)return;var k=v.toLowerCase();if(seen[k])return;seen[k]=1;tags.push('#'+v);}
 add(r&&r.brand||'FilinLabs');
 (r&&r.categories||[]).slice(0,2).forEach(add);
 add('DAC');
 specs(r).slice(1,7).forEach(function(x){add(x[0]);});
 return esc(tags.slice(0,9).join(' '));
}
function categoryText(p,r){
 var cat=norm(r&&r.categories&&r.categories[0])||norm(p&&p.category)||'Digital Audio';
 var price=Number(p&&p.commerce&&p.commerce.basePrice||r&&r.price||0);
 return '<strong>'+esc(cat)+'</strong><br>'+esc(priceTier(price))+(price?' · $'+Number(price).toLocaleString('en-US'):'');
}
function curatorChoiceText(){return 'Selected by Filin Labs for its distinctive implementation, build philosophy and system-level relevance within its category.';}
function synergyText(p,r){
 var n=key((p&&p.commerce&&p.commerce.displayName)||r&&r.name||PATH);
 if(/amplifier|headphone amp|dac amp|onda ha|hades|bellerophon/.test(n))return 'Digital transport / streamer · High-quality digital interconnects · Reference headphones or loudspeakers matched to the amplifier output.';
 return 'Network streamer / digital transport · High-quality digital interconnects · Preamplifier or integrated amplifier · Reference headphones or loudspeakers.';
}
function genresText(){return 'All-Rounder · Acoustic · Jazz · Classical · Vocal · Electronic and other recordings where timing, timbre and spatial resolution matter.';}
function fallbackFor(title,p,r){
 if(title===ORDER[0])return categoryText(p,r);
 if(title===ORDER[1])return tagsText(p,r);
 if(title===ORDER[2])return esc(bestSoundSentence(p,r));
 if(title===ORDER[3])return technologyText(r);
 if(title===ORDER[4])return esc(curatorChoiceText());
 if(title===ORDER[5])return esc(synergyText(p,r));
 if(title===ORDER[6])return esc(genresText());
 return '';
}
function completeCuration(p,r){
 var old=Array.isArray(p.curation)?p.curation:[],map={};
 state.curationBefore=old.length;
 old.forEach(function(x){var t=canonicalTitle(x&&x.title);if(t&&!map[t]&&norm(strip(x.html||'')))map[t]={title:t,html:str(x.html||'')};});
 var out=ORDER.map(function(t){return map[t]||{title:t,html:fallbackFor(t,p,r)};});
 state.curationAfter=out.length;state.curationAdded=ORDER.filter(function(t){return !map[t];}).length;
 var changed=old.length!==7||out.some(function(x,i){return !old[i]||canonicalTitle(old[i].title)!==x.title||str(old[i].html)!==str(x.html);});
 p.curation=out;return changed;
}

function catalog(){try{return window.FilinRichCatalogV2&&window.FilinRichCatalogV2.products||{};}catch(e){return{};}}
function productText(x){return key([(x.categories||[]).join(' '),x.name,x.description].filter(Boolean).join(' '));}
function chooseOne(products,re,used,current,brand){
 var best=null,score=-1;
 Object.keys(products||{}).forEach(function(slug){var x=products[slug];if(!x||slug===current||used[slug]||!x.url||!x.name)return;var t=productText(x);if(!re.test(t))return;var s=100;if(brand&&key(x.brand)===key(brand))s+=5;if(Number(x.price)>0)s+=1;if(s>score){score=s;best={slug:slug,x:x};}});
 if(best){used[best.slug]=1;return best.x;}return null;
}
function recommendations(p,r){
 var all=catalog(),used={},brand=r&&r.brand||'',name=key((p.commerce&&p.commerce.displayName)||r&&r.name||PATH),isCombo=/amplifier|preamp|headphone amp|dac amp|onda ha|hades|bellerophon/.test(name);
 var groups=isCombo?[
   /stream|network player|digital source|transport/,
   /cable|interconnect|xlr|rca|usb|spdif|aes ebu|i2s/,
   /headphone/,
   /speaker/
 ]:[
   /stream|network player|digital source|transport/,
   /amplifier|preamplifier|preamp|integrated amp/,
   /cable|interconnect|xlr|rca|usb|spdif|aes ebu|i2s/,
   /speaker|headphone/
 ];
 var out=[];groups.forEach(function(re){var x=chooseOne(all,re,used,PATH,brand);if(x)out.push(x);});
 var fallback=['audioinstrument_axle_pc_streamer','gerbera_active_tube_preamplifier','art_air_digital_cables','audioinstrument_sirius_kt150_tube_amplifier'];
 fallback.forEach(function(slug){if(out.length>=4)return;var x=all[slug];if(x&&slug!==PATH&&!used[slug]&&x.url&&x.name){used[slug]=1;out.push(x);}});
 return out.slice(0,4);
}
function hasLegacyPM(html){var b=document.createElement('div');b.innerHTML=str(html);return !!b.querySelector('.perfect-matches-block');}
function pmMarkup(p,recs){
 var base=norm(p.commerce&&p.commerce.displayName)||norm(p.overview&&p.overview.title)||PATH.replace(/_/g,' ');
 return '<div class="perfect-matches-block" data-filin-required-contract="1">'+
 '<h4 class="pm-title">Perfect Matches</h4>'+
 '<p class="pm-desc">Recommended complementary components selected for a coherent Filin Labs system.</p>'+
 '<div class="pm-formula"><div class="pm-item pm-base"><span>'+esc(base)+'</span></div>'+
 recs.map(function(x,i){return '<span class="pm-plus">+</span><label class="pm-item"><input class="price-item bundle-item" data-price="0" name="match_'+i+'" type="checkbox"><span><a href="'+esc(x.url)+'">'+esc(x.name)+'</a></span></label>';}).join('')+
 '<span class="pm-equals">=</span><div class="pm-result">Ultimate Synergy</div></div>'+
 '<div class="pm-discount">Add recommended synergy components to get <b>5% OFF for EACH added device.</b></div></div>';
}
function ensurePM(p,r){
 var html=str(p.commerce&&p.commerce.innerHTML);state.pmBefore=hasLegacyPM(html);
 if(state.pmBefore){state.pmItems=(function(){var b=document.createElement('div');b.innerHTML=html;return b.querySelectorAll('.perfect-matches-block .pm-item:not(.pm-base)').length;})();return false;}
 var recs=recommendations(p,r);state.pmItems=recs.length;if(!recs.length)return false;
 p.commerce.innerHTML=html+pmMarkup(p,recs);state.pmAdded=true;return true;
}

function visible(el){if(!el||!el.getBoundingClientRect)return false;var cs=getComputedStyle(el),r=el.getBoundingClientRect();return cs.display!=='none'&&cs.visibility!=='hidden'&&r.width>10&&r.height>10;}
function brandName(p,r){var b=norm(r&&r.brand);if(b)return b;var n=norm(p&&p.commerce&&p.commerce.displayName);var m=n.match(/^([A-Za-z&]+(?:\s+[A-Za-z&]+)?)/);return m?norm(m[1]):'the manufacturer';}
function sourceHandcrafted(){
 var nodes=arr(document.querySelectorAll('.t-rec,[id^="rec"],.fp-v3-curator-record')).filter(function(n){return !n.closest('#'+ROOT)&&!/shipping|contact|legal/i.test(norm(n.textContent));});
 var best='';nodes.forEach(function(n){var t=norm(n.textContent);var m=t.match(/Handcrafted by[^.\n]*(?:\.[^\n]*)?/i);if(m&&m[0].length>best.length&&m[0].length<420)best=norm(m[0]);});return best;
}
function curatorText(p,r){
 var s=sourceHandcrafted();if(/^Handcrafted by/i.test(s))return s;
 var existing=norm(p&&p.curator);if(/^Handcrafted by/i.test(existing))return existing;
 var b=brandName(p,r);
 var tail=existing||'Personally listened, approved & curated by Filin Labs Kazakhstan.';
 if(!/personally|curated/i.test(tail))tail+=' Personally listened, approved & curated by Filin Labs Kazakhstan.';
 return 'Handcrafted by '+b+' artisans. '+tail;
}
function ensureCuratorStrip(p,r){
 var text=curatorText(p,r);p.curator=text;state.curatorText=text;
 var existing=arr(document.querySelectorAll('.fp-v3-curator-record')).filter(function(x){return !x.closest('#'+ROOT)&&visible(x)&&!x.hasAttribute('data-filin-gs2-dac-source');})[0]||null;
 state.curatorBefore=!!existing;
 var synthetic=document.getElementById('filin-required-contract-curator');
 if(synthetic&&existing&&synthetic!==existing)synthetic.remove();
 if(existing){var leaf=existing.querySelector('.fp-v3-curator-text,.t051__text,.t-text,p,div');if(leaf){leaf.textContent=text;leaf.classList.add('fp-v3-curator-text');}return false;}
 if(!synthetic){synthetic=document.createElement('section');synthetic.id='filin-required-contract-curator';synthetic.className='fp-v3-curator-record';synthetic.setAttribute('data-filin-required-contract','1');synthetic.innerHTML='<div class="fp-v3-curator-text"></div>';var root=document.getElementById(ROOT);if(root&&root.parentNode)root.parentNode.insertBefore(synthetic,root);else(document.querySelector('#allrecords')||document.body).appendChild(synthetic);state.curatorAdded=true;}
 synthetic.querySelector('.fp-v3-curator-text').textContent=text;
 synthetic.style.setProperty('display','block','important');synthetic.style.setProperty('background','#000','important');return true;
}

async function boot(){
 try{
   var ok=await wait(function(){return !!profile();},22000);if(!ok)throw new Error('Golden profile not found for required-contract pass');
   var p=profile(),r=rich();state.profileFound=true;state.richFound=!!r;
   var changed=false;if(completeCuration(p,r))changed=true;if(ensurePM(p,r))changed=true;pub();
   if(changed&&window.FilinMasterProductV3&&typeof window.FilinMasterProductV3.apply==='function'){window.FilinMasterProductV3.apply();state.reapplied=true;}
   state.rootReady=await wait(function(){return !!document.querySelector('#'+ROOT+' .v3-shell');},16000);if(!state.rootReady)throw new Error('Golden root missing after required-contract pass');
   ensureCuratorStrip(p,r);
   state.ready=true;state.error='';
 }catch(e){state.error=String(e&&e.message||e);state.ready=false;}
 pub();
 if(state.error)console.warn('[Filin Labs Required Contract V1]',state.error,state);else console.info('[Filin Labs Required Contract V1] ready',state);
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot,{once:true});else boot();
pub();
})();