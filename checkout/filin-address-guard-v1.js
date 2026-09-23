/* FILIN LABS — Checkout Address Guard V1 */
(function(){
  'use strict';
  if((String(location.pathname||'/').replace(/\/+$/,'')||'/')!=='/checkout')return;
  if(window.__FILIN_ADDR_GUARD_V1__)return; window.__FILIN_ADDR_GUARD_V1__=true;

  function clean(v){return String(v==null?'':v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
  function norm(v){return clean(v).toLowerCase();}
  function root(){var f=window.FilinCheckout;return (f&&f.root)||document;}

  /* адрес из профиля: тот же ключ, что пишет Members V4 Shipping Recovery */
  function stored(){var email='',txt=(root().querySelector('.flx-step')||document.body).textContent||'';
    var m=txt.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i); if(m)email=m[0];
    function rd(k){try{return JSON.parse(localStorage.getItem(k)||'null');}catch(e){return null;}}
    var d=email?rd('filin_account_shipping_v1::'+encodeURIComponent(norm(email))):null;
    if(!d){var l=rd('filin_account_shipping_latest_v1');if(l&&(!email||norm(l.ownerEmail)===norm(email)))d=l;}
    return d&&(d.country||d.city||d.address)?d:null;}

  /* поля чекаута ищем по тексту подписи, а не по порядку */
  var ROLE=[['name',/^(your )?name$|^full name$|^имя/],['country',/^country$|^страна/],['postal',/^postal code$|^zip|^индекс/],
            ['city',/^city$|^город/],['address',/^address$|^street|^адрес/]];
  function fields(){var out={},list=root().querySelectorAll('.flx-step[data-step="shipping"] .flx-field');
    Array.prototype.forEach.call(list,function(f){var l=f.querySelector('label'),i=f.querySelector('input,select,textarea');if(!l||!i)return;
      var t=norm(l.textContent).replace(/[*:]/g,'').trim();
      for(var k=0;k<ROLE.length;k++)if(ROLE[k][1].test(t)&&!out[ROLE[k][0]]){out[ROLE[k][0]]=i;break;}});
    return out;}
  function put(el,v){if(!el||clean(el.value)===clean(v))return false;
    var proto=el.tagName==='SELECT'?HTMLSelectElement.prototype:(el.tagName==='TEXTAREA'?HTMLTextAreaElement.prototype:HTMLInputElement.prototype);
    var d=Object.getOwnPropertyDescriptor(proto,'value'); if(d&&d.set)d.set.call(el,v); else el.value=v;
    el.dispatchEvent(new Event('input',{bubbles:true})); el.dispatchEvent(new Event('change',{bubbles:true})); return true;}
  function values(d){var full=clean([d.firstName,d.lastName].join(' '));
    return {name:full,country:clean(d.country),postal:clean(d.postalCode),city:clean(d.city),
            address:clean(d.address)+(clean(d.apartment)?', '+clean(d.apartment):''),full:full,first:clean(d.firstName)};}

  /* мягкая проверка: исправляем только явную ошибку — в «Country» оказалось имя, или страна пустая */
  function repair(){var d=stored();if(!d)return;var v=values(d),F=fields(),c=F.country;
    if(c){var cur=norm(c.value),looksName=cur&&(cur===norm(v.full)||cur===norm(v.first)||cur===norm(d.lastName));
      if((!cur||looksName)&&v.country)put(c,v.country);}
    if(F.name&&F.country&&norm(F.name.value)===norm(F.country.value)&&v.full)put(F.name,v.full);}
  /* «Use this address» — явное действие покупателя: заполняем все поля по назначению */
  function fillAll(){var d=stored();if(!d)return;var v=values(d),F=fields();
    ['name','country','postal','city','address'].forEach(function(k){if(v[k])put(F[k],v[k]);});}

  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('button,a,[role="button"]');
    if(!b||!/use this address/i.test(clean(b.textContent)))return;
    setTimeout(fillAll,80); setTimeout(repair,600);},true);
  [400,1500,3500].forEach(function(t){setTimeout(repair,t);});   // без MutationObserver — никаких циклов
  console.info('[Filin Labs] Checkout Address Guard V1 ready');
})();

