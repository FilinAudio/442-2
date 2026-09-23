/* FILIN LABS — Checkout Core V28.2 */

(function(){

'use strict';

if(window.__FILIN_CHECKOUT_CORE_V28_2__) return;
window.__FILIN_CHECKOUT_CORE_V28_2__=true;

const PATH='/checkout';
const ROOT_ID='filin-checkout-root';
const SNAPSHOT_KEY='filin_checkout_snapshot_v21';

function path(v){
  return String(v||'/').replace(/\/+$/,'')||'/';
}

if(path(location.pathname)!==PATH) return;

const FC=window.FilinCheckout=window.FilinCheckout||{};

let nativeForm=null;
let mirrors=[];

function clean(v){
  return String(v??'')
    .replace(/\u00a0/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}

function norm(v){
  return clean(v).toLowerCase();
}

function num(v){
  const n=Number(
    String(v??0).replace(/[^0-9.-]/g,'')
  );
  return Number.isFinite(n)?n:0;
}

function money(v){
  return new Intl.NumberFormat(
    'en-US',
    {
      style:'currency',
      currency:'USD',
      minimumFractionDigits:0,
      maximumFractionDigits:0
    }
  ).format(Math.max(0,num(v)));
}

function esc(v){
  return String(v??'').replace(
    /[&<>'"]/g,
    c=>({
      '&':'&amp;',
      '<':'&lt;',
      '>':'&gt;',
      "'":'&#39;',
      '"':'&quot;'
    }[c])
  );
}

function readJson(key,fallback={}){
  try{
    return JSON.parse(
      localStorage.getItem(key)||''
    )||fallback;
  }catch(e){
    return fallback;
  }
}

function snapshot(){
  try{
    return JSON.parse(
      sessionStorage.getItem(SNAPSHOT_KEY)||''
    )||{};
  }catch(e){
    return {};
  }
}

/* CART */

function products(){

  if(!Array.isArray(window.tcart?.products)){
    return [];
  }

  return window.tcart.products.filter(
    p=>
      p &&
      p.deleted!=='yes' &&
      num(p.quantity||p.qty||1)>0
  );
}

function qty(p){
  return Math.max(
    1,
    Math.round(
      num(p?.quantity||p?.qty||1)
    )
  );
}

function price(p){
  return num(
    p?.price||
    p?.unitprice||
    p?.baseprice||
    0
  );
}

function productName(p){
  return clean(
    p?.__flcartCanonicalName||
    p?.name||
    p?.title||
    p?.product||
    'Product'
  );
}

function productUrl(p){
  return String(
    p?.__flcartUrl||
    p?.url||
    p?.link||
    p?.product_url||
    p?.href||
    ''
  );
}

function productImage(p){

  let img=
    p?.__flcartImage||
    p?.img||
    p?.image||
    p?.picture||
    p?.photo||
    p?.thumbnail||
    p?.preview||
    '';

  if(img && typeof img==='object'){
    img=
      img.url||
      img.src||
      img.image||
      '';
  }

  img=String(img||'').trim();

  /* защита от битых ${escapeHtml(...)} URL */
  if(
    /\$\{|escapehtml|%24%7b|\+%20%20|%2b%20%20/i
    .test(img)
  ){
    return '';
  }

  try{
    return img
      ? new URL(img,location.origin).href
      : '';
  }catch(e){
    return '';
  }
}

function normalizeKey(v){
  return String(v||'')
    .toLowerCase()
    .replace(/[“”"']/g,'')
    .replace(/[^a-z0-9а-яё%+.-]+/gi,' ')
    .trim();
}

function productKey(p){

  const direct=
    p?.uid||
    p?.sku||
    p?.externalid||
    p?.external_id||
    p?.lid||
    p?.id;

  if(direct){
    return 'id:'+direct;
  }

  const url=productUrl(p);

  if(url){
    try{
      return 'url:'+
        path(
          new URL(
            url,
            location.origin
          ).pathname
        );
    }catch(e){}
  }

  return (
    'name:'+
    normalizeKey(productName(p))+
    '|'+
    price(p)
  );
}

function warrantyYears(p){

  const direct=Math.round(
    num(p?.__flcartWarrantyYears)
  );

  if([1,2,3,4].includes(direct)){
    return direct;
  }

  const store=readJson(
    'flcart_warranty_v1',
    {}
  );

  const prefix=
    productKey(p)+'|';

  const key=
    Object.keys(store)
      .find(
        k=>k.indexOf(prefix)===0
      );

  const saved=Math.round(
    num(
      key
        ? store[key]
        : 1
    )
  );

  return [1,2,3,4].includes(saved)
    ? saved
    : 1;
}

function warrantyPercent(years){
  return ({
    1:0,
    2:25,
    3:40,
    4:60
  })[years]||0;
}

function warrantyAmount(p){

  return (
    price(p)*
    qty(p)*
    warrantyPercent(
      warrantyYears(p)
    )/100
  );
}

/* NATIVE TILDA FORM */

function findNativeForm(){

  const selectors=[
    '.t706 form',
    '.t706__cartwin form',
    '.t706__cartpage form',
    '[data-record-type="706"] form',
    'form[data-formactiontype]'
  ];

  for(const selector of selectors){

    for(
      const form
      of document.querySelectorAll(selector)
    ){

      const text=norm(
        form.className+
        ' '+
        form.id+
        ' '+
        form.textContent
      );

      if(
        selector.includes('706') ||
        /email|phone|delivery|shipping|payment|order/.test(text)
      ){
        return form;
      }
    }
  }

  return null;
}

async function ensureNativeForm(){

  let form=findNativeForm();

  if(form) return form;

  const open=
    window.tcart__openCart?.__flcartOriginal||
    window.tcart__openCart;

  if(typeof open==='function'){
    try{
      open.call(window);
    }catch(e){}
  }

  for(let i=0;i<70;i++){

    await new Promise(
      resolve=>setTimeout(resolve,60)
    );

    form=findNativeForm();

    if(form) break;
  }

  document.body?.classList.remove(
    't706__body_cartwinshowed',
    't706__body_cartpageshowed'
  );

  document.documentElement.style
    .removeProperty('overflow');

  document.body?.style
    .removeProperty('overflow');

  return form;
}

function restoreSnapshotHidden(){

  if(!nativeForm) return;

  const data=snapshot();

  const fields=
    Array.isArray(data.hidden)
      ? data.hidden
      : [];

  fields.forEach(item=>{

    if(!item?.name) return;

    let input=
      nativeForm.querySelector(
        'input[data-filin-restored="'+
        CSS.escape(item.name)+
        '"]'
      );

    if(!input){

      input=document.createElement('input');

      input.type='hidden';
      input.name=item.name;
      input.dataset.filinRestored=
        item.name;

      nativeForm.appendChild(input);
    }

    input.value=item.value||'';
  });
}

function descriptor(control){

  const wrap=
    control.closest(
      '.t-input-group,'+
      '.t706__cartwin-input-wrapper,'+
      '.t706__cartwin-field,'+
      '.t-form__inputsbox>div'
    ) ||
    control.parentElement;

  return norm(
    [
      control.name,
      control.id,
      control.type,
      control.placeholder,
      control.autocomplete,
      control.getAttribute('aria-label'),
      wrap?.textContent
    ]
    .filter(Boolean)
    .join(' ')
  );
}

function rawLabel(control){

  const wrap=
    control.closest(
      '.t-input-group,'+
      '.t706__cartwin-input-wrapper,'+
      '.t706__cartwin-field,'+
      '.t-form__inputsbox>div'
    ) ||
    control.parentElement;

  return clean(
    wrap?.querySelector?.(
      '.t-input-title,label'
    )?.textContent ||
    control.getAttribute('aria-label')||
    control.placeholder||
    control.name||
    ''
  ).replace(/\s*\*\s*$/,'');
}

function nativeControls(){

  if(!nativeForm) return [];

  return Array.from(
    nativeForm.querySelectorAll(
      'input,select,textarea'
    )
  ).filter(
    control=>
      control.type!=='hidden' &&
      control.type!=='submit' &&
      !control.disabled
  );
}

function relax(control){

  control.required=false;
  control.removeAttribute('required');
  control.removeAttribute('data-tilda-req');

  try{
    control.setAttribute(
      'data-tilda-rule',
      ''
    );
  }catch(e){}
}

/*
Important:
email / phone stay in native form,
but are not shown in Customer.
*/

function fieldKind(control){

  const desc=descriptor(control);
  const label=rawLabel(control);
  const value=norm(desc+' '+label);

  if(
    /privacy policy|personal data|processing of my personal|legal information|terms and conditions|consent|agreement/.test(value)
  ){
    return 'consent';
  }

  if(
    /last name|family-name/.test(value) ||
    /\bits good\b/.test(value) ||
    /form-spec-comments/.test(value) ||
    /promo|coupon|discount/.test(value)
  ){
    relax(control);
    return 'ignore';
  }

  if(
    /email|e-mail|phone|telephone|mobile/.test(value)
  ){
    return 'customer-hidden';
  }

  if(
    /payment|pay method|paypal|stripe|card|credit|debit|klarna|affirm|afterpay|bank transfer|crypto|bitcoin/.test(value)
  ){
    return 'payment';
  }

  return 'shipping';
}

function displayLabel(control){

  const desc=descriptor(control);
  const raw=rawLabel(control);

  if(
    /first name|given-name/.test(desc) ||
    /^name$/i.test(raw)
  ){
    return 'Your name';
  }

  if(/comment|instruction/.test(desc)){
    return 'Comment';
  }

  if(raw) return raw;

  return 'Field';
}

function mirrorControl(original,kind){

  const desc=descriptor(original);

  const wrap=document.createElement('div');
  wrap.className='flx-field';

  if(
    /address|street/.test(desc)
  ){
    wrap.classList.add('is-wide');
  }

  const visibleLabel=
    displayLabel(original);

  if(
    /^(Your name|Comment|Country)$/i
    .test(visibleLabel)
  ){
    wrap.classList.add(
      'filin-normal-width'
    );
  }

  const label=document.createElement('label');

  const id=
    'flx-'+
    Math.random()
      .toString(36)
      .slice(2,9);

  label.htmlFor=id;
  label.textContent=visibleLabel;

  const clone=
    original.cloneNode(true);

  clone.id=id;
  clone.removeAttribute('form');

  if(
    original.type==='radio' ||
    original.type==='checkbox'
  ){

    clone.name=
      'flx_'+
      String(
        original.name||
        'choice'
      )
      .replace(
        /[^a-z0-9_-]/gi,
        '_'
      );

    clone.checked=
      original.checked;

  }else{

    clone.name='flx_'+id;
    clone.value=original.value||'';
  }

  if(original.required){
    clone.required=true;
  }

  function sync(){

    if(
      original.type==='radio' ||
      original.type==='checkbox'
    ){
      original.checked=
        clone.checked;
    }else{
      original.value=
        clone.value;
    }

    original.dispatchEvent(
      new Event(
        'input',
        {bubbles:true}
      )
    );

    original.dispatchEvent(
      new Event(
        'change',
        {bubbles:true}
      )
    );
  }

  clone.addEventListener(
    'input',
    sync
  );

  clone.addEventListener(
    'change',
    sync
  );

  if(
    original.type==='radio' ||
    original.type==='checkbox'
  ){
    wrap.append(
      clone,
      label
    );
  }else{
    wrap.append(
      label,
      clone
    );
  }

  mirrors.push({
    original,
    clone,
    kind,
    desc,
    label:visibleLabel
  });

  return wrap;
}

function hiddenNative(name){

  if(!nativeForm) return null;

  let input=
    Array.from(
      nativeForm.querySelectorAll(
        'input'
      )
    )
    .find(
      item=>item.name===name
    );

  if(!input){

    input=document.createElement(
      'input'
    );

    input.type='hidden';
    input.name=name;

    nativeForm.appendChild(input);
  }

  return input;
}

function fallbackField(
  nativeName,
  label,
  autocomplete,
  required,
  wide,
  kind,
  tag
){

  const original=
    hiddenNative(nativeName);

  const wrap=
    document.createElement('div');

  wrap.className='flx-field';

  if(wide){
    wrap.classList.add('is-wide');
  }

  if(
    /^(Your name|Comment|Country)$/i
    .test(label)
  ){
    wrap.classList.add(
      'filin-normal-width'
    );
  }

  const id=
    'flx-fallback-'+
    Math.random()
      .toString(36)
      .slice(2,8);

  const lab=
    document.createElement('label');

  lab.htmlFor=id;
  lab.textContent=label;

  const input=
    document.createElement(
      tag==='textarea'
        ? 'textarea'
        : 'input'
    );

  input.id=id;

  if(input.tagName==='INPUT'){
    input.type='text';
  }

  input.autocomplete=
    autocomplete||'';

  if(required){
    input.required=true;
  }

  input.value=
    original?.value||'';

  function sync(){

    if(original){
      original.value=input.value;
    }
  }

  input.addEventListener(
    'input',
    sync
  );

  input.addEventListener(
    'change',
    sync
  );

  wrap.append(
    lab,
    input
  );

  mirrors.push({
    original,
    clone:input,
    kind,
    desc:norm(
      nativeName+
      ' '+
      label+
      ' '+
      autocomplete
    ),
    label
  });

  return wrap;
}

/* STEPS */

function makeStep(
  key,
  number,
  title
){

  const step=
    document.createElement('section');

  step.className='flx-step';
  step.dataset.step=key;

  step.innerHTML=
    '<button class="flx-step-head" type="button" aria-expanded="false">'+
      '<span class="flx-step-number">'+
        number+
      '</span>'+
      '<span>'+
        '<span class="flx-step-title">'+
          title+
        '</span>'+
        '<span class="flx-step-summary"></span>'+
      '</span>'+
      '<span class="flx-chevron">⌄</span>'+
    '</button>'+
    '<div class="flx-step-panel"></div>';

  return step;
}

function openStep(key,scroll){

  const root=
    document.getElementById(
      ROOT_ID
    );

  if(!root) return;

  root
    .querySelectorAll(
      '.flx-step'
    )
    .forEach(step=>{

      const active=
        step.dataset.step===key;

      step.classList.toggle(
        'is-open',
        active
      );

      step
        .querySelector(
          '.flx-step-head'
        )
        ?.setAttribute(
          'aria-expanded',
          active
            ? 'true'
            : 'false'
        );
    });

  if(scroll){

    const target=
      root.querySelector(
        '.flx-step[data-step="'+
        key+
        '"]'
      );

    setTimeout(
      ()=>target?.scrollIntoView({
        behavior:'smooth',
        block:'start'
      }),
      30
    );
  }
}

function complete(key){

  const step=
    document.querySelector(
      '#'+ROOT_ID+
      ' .flx-step[data-step="'+
      key+
      '"]'
    );

  if(!step) return;

  step.classList.add(
    'is-complete'
  );

  const number=
    step.querySelector(
      '.flx-step-number'
    );

  if(number){
    number.textContent='✓';
  }
}

/* SHIPPING */

function ensureBasicShipping(host){

  const descs=
    mirrors
      .filter(
        m=>m.kind==='shipping'
      )
      .map(m=>m.desc)
      .join(' | ');

  if(
    !/first name|given-name|\bname\b/.test(descs)
  ){
    host.appendChild(
      fallbackField(
        'First Name',
        'Your name',
        'given-name',
        true,
        false,
        'shipping'
      )
    );
  }

  if(
    !/comment|instruction/.test(descs)
  ){
    host.appendChild(
      fallbackField(
        'Comment',
        'Comment',
        '',
        false,
        false,
        'shipping',
        'textarea'
      )
    );
  }

  if(!/country/.test(descs)){
    host.appendChild(
      fallbackField(
        'Country',
        'Country',
        'country-name',
        true,
        false,
        'shipping'
      )
    );
  }

  if(
    !/postal|postcode|zip/.test(descs)
  ){
    host.appendChild(
      fallbackField(
        'Postal Code',
        'Postal Code',
        'postal-code',
        true,
        false,
        'shipping'
      )
    );
  }

  if(
    !/city|address-level2/.test(descs)
  ){
    host.appendChild(
      fallbackField(
        'City',
        'City',
        'address-level2',
        true,
        false,
        'shipping'
      )
    );
  }

  if(
    !/address|street/.test(descs)
  ){
    host.appendChild(
      fallbackField(
        'Address',
        'Address',
        'street-address',
        true,
        true,
        'shipping'
      )
    );
  }
}

/* BILLING */

function renderBilling(panel){

  const row=
    document.createElement('label');

  row.className='flx-check';

  row.innerHTML=
    '<input id="flx-billing-same" type="checkbox" checked>'+
    '<span>Billing address is the same as the shipping address</span>';

  const fields=
    document.createElement('div');

  fields.className=
    'flx-billing-fields';

  [
    [
      'Billing First Name',
      'Your name',
      'given-name',
      false
    ],
    [
      'Billing Company',
      'Company',
      'organization',
      false
    ],
    [
      'Billing Country',
      'Country',
      'country-name',
      false
    ],
    [
      'Billing Postal Code',
      'Postal Code',
      'postal-code',
      false
    ],
    [
      'Billing City',
      'City',
      'address-level2',
      false
    ],
    [
      'Billing State',
      'State / Province',
      'address-level1',
      false
    ],
    [
      'Billing Address',
      'Address',
      'street-address',
      true
    ]
  ].forEach(item=>{

    fields.appendChild(
      fallbackField(
        item[0],
        item[1],
        item[2],
        false,
        item[3],
        'billing'
      )
    );
  });

  row
    .querySelector('input')
    .addEventListener(
      'change',
      event=>{

        fields.classList.toggle(
          'is-visible',
          !event.target.checked
        );

        fields
          .querySelectorAll(
            'input,textarea,select'
          )
          .forEach(input=>{

            input.required=
              !event.target.checked;
          });
      }
    );

  panel.append(
    row,
    fields
  );
}

/* PAYMENT INFO */

function renderPaymentInfo(panel){

  const txt=norm(
    nativeForm?.textContent||''
  );

  const cards=[
    [
      '▣',
      'Credit / Debit Card',
      'Visa, Mastercard and other supported cards',
      /stripe|card|credit|debit|verifone|2checkout/
    ],
    [
      'P',
      'PayPal',
      'Pay securely using PayPal',
      /paypal/
    ],
    [
      '4×',
      'Pay Over Time',
      'Affirm, Klarna, Afterpay or another supported BNPL service',
      /affirm|klarna|afterpay|installment/
    ],
    [
      '₿',
      'Alternative Payments',
      'Bank transfer or crypto when enabled',
      /bank transfer|crypto|bitcoin/
    ]
  ];

  const grid=
    document.createElement('div');

  grid.className=
    'flx-payment-info';

  grid.innerHTML=
    cards.map(card=>
      '<div class="flx-pay-badge '+
        (
          card[3].test(txt)
            ? 'is-connected'
            : ''
        )+
      '">'+
        '<span class="flx-pay-icon">'+
          card[0]+
        '</span>'+
        '<div>'+
          '<strong>'+
            card[1]+
          '</strong>'+
          '<small>'+
            card[2]+
          '</small>'+
        '</div>'+
      '</div>'
    ).join('');

  panel.appendChild(grid);
}

/* VALIDATION */

function validStep(key){

  const panel=
    document.querySelector(
      '#'+ROOT_ID+
      ' .flx-step[data-step="'+
      key+
      '"] .flx-step-panel'
    );

  if(!panel) return true;

  const controls=
    Array.from(
      panel.querySelectorAll(
        'input,select,textarea'
      )
    )
    .filter(
      c=>
        !c.disabled &&
        c.type!=='hidden'
    );

  for(const control of controls){

    if(
      control.required &&
      !clean(control.value) &&
      control.type!=='checkbox' &&
      control.type!=='radio'
    ){

      control.reportValidity?.();
      control.focus();

      return false;
    }

    if(
      typeof control.checkValidity==='function' &&
      !control.checkValidity()
    ){

      control.reportValidity?.();
      control.focus();

      return false;
    }
  }

  return true;
}

function shippingComplete(){

  const required=
    mirrors.filter(
      m=>
        m.kind==='shipping' &&
        m.clone.required
    );

  return required.every(
    m=>clean(m.clone.value)
  );
}

function syncAll(){

  mirrors.forEach(m=>{

    if(!m.original) return;

    if(
      m.original.type==='radio' ||
      m.original.type==='checkbox'
    ){
      m.original.checked=
        m.clone.checked;
    }else{
      m.original.value=
        m.clone.value;
    }

    m.original.dispatchEvent(
      new Event(
        'input',
        {bubbles:true}
      )
    );

    m.original.dispatchEvent(
      new Event(
        'change',
        {bubbles:true}
      )
    );
  });
}

function nativeSubmit(){

  syncAll();
  restoreSnapshotHidden();

  const button=
    nativeForm?.querySelector(
      'button[type="submit"],'+
      'input[type="submit"],'+
      '.t-submit'
    );

  try{

    if(
      typeof nativeForm?.requestSubmit==='function'
    ){

      if(
        button &&
        /^(BUTTON|INPUT)$/
          .test(button.tagName)
      ){
        nativeForm.requestSubmit(
          button
        );
      }else{
        nativeForm.requestSubmit();
      }

    }else if(button){

      button.click();

    }else{

      nativeForm?.submit();
    }

  }catch(error){

    alert(
      'The secure checkout could not be started. Please return to your cart and try again.'
    );
  }
}

/* SUMMARY */

function renderSummary(root){

  const data=snapshot();
  const ps=products();

  const items=
    root.querySelector(
      '.flx-order-items'
    );

  if(!items) return;

  items.innerHTML=
    ps.map(p=>{

      const q=qty(p);
      const years=warrantyYears(p);

      const line=
        price(p)*q+
        warrantyAmount(p);

      const image=
        productImage(p);

      return (
        '<div class="flx-order-item">'+

          '<div class="flx-order-img">'+
            (
              image
                ? '<img src="'+
                  esc(image)+
                  '" alt="">'
                : ''
            )+
          '</div>'+

          '<div>'+
            '<div class="flx-order-name">'+
              q+
              ' × '+
              esc(
                productName(p)
              )+
            '</div>'+
            (
              years>1
                ? '<div class="flx-order-meta">'+
                    'Warranty: '+
                    years+
                    ' years'+
                  '</div>'
                : ''
            )+
          '</div>'+

          '<div class="flx-order-price">'+
            money(line)+
          '</div>'+

        '</div>'
      );
    }).join('');

  const itemCount=
    ps.reduce(
      (sum,p)=>sum+qty(p),
      0
    );

  root
    .querySelector(
      '.flx-order-count'
    )
    .textContent=
      itemCount+
      ' '+
      (
        itemCount===1
          ? 'item'
          : 'items'
      );

  const calculatedSubtotal=
    ps.reduce(
      (sum,p)=>
        sum+
        price(p)*qty(p),
      0
    );

  const warrantyTotal=
    ps.reduce(
      (sum,p)=>
        sum+
        warrantyAmount(p),
      0
    );

  const subtotal=
    data.subtotal||
    money(
      num(
        window.tcart?.prodamount
      ) ||
      calculatedSubtotal
    );

  const discount=
    data.discount||
    'None';

  const nativeTotal=
    num(
      window.tcart?.amount||
      window.tcart?.total
    );

  const total=
    data.total||
    money(
      nativeTotal>0
        ? nativeTotal
        : calculatedSubtotal+
          warrantyTotal
    );

  root
    .querySelector(
      '[data-sum="subtotal"]'
    )
    .textContent=subtotal;

  root
    .querySelector(
      '[data-sum="discount"]'
    )
    .textContent=discount;

  root
    .querySelector(
      '[data-sum="total"]'
    )
    .textContent=total;

  root
    .querySelector(
      '.flx-order-head-total'
    )
    .textContent=total;
}

/* BUILD */

async function build(){

  const root=
    document.getElementById(
      ROOT_ID
    );

  root.innerHTML=
    '<main class="flx-page">'+

      '<div class="flx-title-row">'+
        '<h1 class="flx-title">Checkout</h1>'+
        '<a class="flx-mobile-edit" href="/cart">Edit Cart</a>'+
      '</div>'+

      '<div class="flx-grid">'+

        '<div class="flx-left">'+
          '<div class="flx-loading">Preparing secure checkout…</div>'+
          '<div class="flx-accordion" hidden></div>'+
        '</div>'+

        '<div class="flx-right">'+

          '<aside class="flx-order">'+

            '<div class="flx-order-head">'+

              '<button class="flx-order-toggle" type="button" aria-expanded="false">'+
                '<span class="flx-order-icon">Σ</span>'+
                '<span class="flx-order-title">Order Summary</span>'+
                '<strong class="flx-order-head-total">$0</strong>'+
                '<span class="flx-order-chevron">⌄</span>'+
              '</button>'+

              '<a class="flx-order-edit" href="/cart">Edit Cart</a>'+

            '</div>'+

            '<div class="flx-order-body">'+

              '<div class="flx-order-count"></div>'+
              '<div class="flx-order-items"></div>'+

              '<div class="flx-order-totals">'+

                '<div class="flx-order-row">'+
                  '<span>Subtotal</span>'+
                  '<strong data-sum="subtotal">$0</strong>'+
                '</div>'+

                '<div class="flx-order-row">'+
                  '<span>Discount</span>'+
                  '<strong data-sum="discount">None</strong>'+
                '</div>'+

                '<div class="flx-order-row is-total">'+
                  '<span>Total</span>'+
                  '<strong data-sum="total">$0</strong>'+
                '</div>'+

              '</div>'+

            '</div>'+

          '</aside>'+

        '</div>'+

      '</div>'+

    '</main>';

  renderSummary(root);

  const order=
    root.querySelector(
      '.flx-order'
    );

  const orderToggle=
    root.querySelector(
      '.flx-order-toggle'
    );

  orderToggle.addEventListener(
    'click',
    ()=>{

      if(innerWidth>980) return;

      order.classList.toggle(
        'is-open'
      );

      orderToggle.setAttribute(
        'aria-expanded',
        order.classList.contains(
          'is-open'
        )
          ? 'true'
          : 'false'
      );
    }
  );

  nativeForm=
    await ensureNativeForm();

  FC.nativeForm=nativeForm;

  if(!nativeForm){

    root
      .querySelector(
        '.flx-loading'
      )
      .innerHTML=
        'Secure Tilda order form was not found.<br><br>'+
        'Keep the native Tilda Shopping Cart / ST100 block on this page.';

    return;
  }

  restoreSnapshotHidden();

  const accordion=
    root.querySelector(
      '.flx-accordion'
    );

  accordion.hidden=false;

  root
    .querySelector(
      '.flx-loading'
    )
    .remove();

  const customer=
    makeStep(
      'customer',
      1,
      'Customer'
    );

  const shipping=
    makeStep(
      'shipping',
      2,
      'Shipping'
    );

  const billing=
    makeStep(
      'billing',
      3,
      'Billing'
    );

  const payment=
    makeStep(
      'payment',
      4,
      'Payment'
    );

  accordion.append(
    customer,
    shipping,
    billing,
    payment
  );

  const cp=
    customer.querySelector(
      '.flx-step-panel'
    );

  const sp=
    shipping.querySelector(
      '.flx-step-panel'
    );

  const bp=
    billing.querySelector(
      '.flx-step-panel'
    );

  const pp=
    payment.querySelector(
      '.flx-step-panel'
    );

  const auth=
    document.createElement('div');

  auth.className='flx-auth';
  auth.innerHTML=
    '<div class="flx-auth-row">'+
      '<span class="flx-auth-icon">1</span>'+
      '<div>'+
        '<p class="flx-auth-title">Checking account…</p>'+
      '</div>'+
    '</div>';

  cp.appendChild(auth);

  const shippingFields=
    document.createElement('div');

  shippingFields.className=
    'flx-fields';

  sp.appendChild(
    shippingFields
  );

  const paymentFields=
    document.createElement('div');

  paymentFields.className=
    'flx-payment-native';

  pp.appendChild(
    paymentFields
  );

  nativeControls()
    .forEach(control=>{

      const kind=
        fieldKind(control);

      if(
        kind==='ignore' ||
        kind==='consent' ||
        kind==='customer-hidden'
      ){
        return;
      }

      const mirror=
        mirrorControl(
          control,
          kind
        );

      if(kind==='shipping'){
        shippingFields.appendChild(
          mirror
        );
      }

      if(kind==='payment'){
        paymentFields.appendChild(
          mirror
        );
      }
    });

  ensureBasicShipping(
    shippingFields
  );

  renderBilling(bp);
  renderPaymentInfo(pp);

  /* SHIPPING BUTTONS */

  const shippingActions=
    document.createElement('div');

  shippingActions.className=
    'flx-actions';

  const shipBack=
    document.createElement('button');

  shipBack.type='button';
  shipBack.className='flx-back';
  shipBack.textContent='BACK';

  shipBack.addEventListener(
    'click',
    ()=>openStep(
      'customer',
      true
    )
  );

  const shipNext=
    document.createElement('button');

  shipNext.type='button';
  shipNext.className='flx-next';
  shipNext.textContent='CONTINUE';

  shipNext.addEventListener(
    'click',
    async ()=>{

      if(!validStep('shipping')){
        return;
      }

      if(!shippingComplete()){
        return;
      }

      if(
        typeof FC.canContinueShipping===
        'function'
      ){

        const yes=
          await FC.canContinueShipping();

        if(!yes) return;
      }

      complete('shipping');

      openStep(
        'billing',
        true
      );
    }
  );

  shippingActions.append(
    shipBack,
    shipNext
  );

  sp.appendChild(
    shippingActions
  );

  /* BILLING BUTTONS */

  const billingActions=
    document.createElement('div');

  billingActions.className=
    'flx-actions';

  const billBack=
    document.createElement('button');

  billBack.type='button';
  billBack.className='flx-back';
  billBack.textContent='BACK';

  billBack.addEventListener(
    'click',
    ()=>openStep(
      'shipping',
      true
    )
  );

  const billNext=
    document.createElement('button');

  billNext.type='button';
  billNext.className='flx-next';
  billNext.textContent='CONTINUE';

  billNext.addEventListener(
    'click',
    ()=>{

      if(!validStep('billing')){
        return;
      }

      complete('billing');

      openStep(
        'payment',
        true
      );
    }
  );

  billingActions.append(
    billBack,
    billNext
  );

  bp.appendChild(
    billingActions
  );

  /* PAYMENT */

  const paymentBack=
    document.createElement('div');

  paymentBack.className=
    'flx-actions';

  const backButton=
    document.createElement('button');

  backButton.type='button';
  backButton.className='flx-back';
  backButton.textContent='BACK';

  backButton.addEventListener(
    'click',
    ()=>openStep(
      'billing',
      true
    )
  );

  paymentBack.appendChild(
    backButton
  );

  pp.appendChild(
    paymentBack
  );

  const submit=
    document.createElement('button');

  submit.type='button';
  submit.className='flx-pay';

  submit.textContent=
    'CONTINUE TO SECURE PAYMENT';

  submit.addEventListener(
    'click',
    async ()=>{

      if(
        typeof FC.canSubmit===
        'function'
      ){

        const allowed=
          await FC.canSubmit();

        if(!allowed) return;
      }

      for(
        const key
        of [
          'shipping',
          'billing'
        ]
      ){

        if(!validStep(key)){

          openStep(
            key,
            true
          );

          return;
        }
      }

      if(!shippingComplete()){

        openStep(
          'shipping',
          true
        );

        return;
      }

      nativeSubmit();
    }
  );

  pp.appendChild(submit);

  root
    .querySelectorAll(
      '.flx-step-head'
    )
    .forEach(head=>{

      head.addEventListener(
        'click',
        ()=>{

          const step=
            head.closest(
              '.flx-step'
            );

          if(
            step.classList.contains(
              'is-open'
            )
          ){

            step.classList.remove(
              'is-open'
            );

            head.setAttribute(
              'aria-expanded',
              'false'
            );

          }else{

            openStep(
              step.dataset.step,
              false
            );
          }
        }
      );
    });

  renderSummary(root);

  openStep('customer');

  FC.ready=true;
  FC.root=root;
  FC.mirrors=mirrors;
  FC.products=products;
  FC.clean=clean;
  FC.norm=norm;
  FC.num=num;
  FC.money=money;
  FC.esc=esc;
  FC.descriptor=descriptor;
  FC.rawLabel=rawLabel;
  FC.nativeControls=nativeControls;
  FC.hiddenNative=hiddenNative;
  FC.openStep=openStep;
  FC.complete=complete;
  FC.validStep=validStep;
  FC.shippingComplete=shippingComplete;
  FC.syncAll=syncAll;
  FC.nativeSubmit=nativeSubmit;
  FC.renderSummary=renderSummary;

  document.dispatchEvent(
    new CustomEvent(
      'filinCheckoutReady'
    )
  );

  try{

    if(
      typeof window.gtag===
      'function'
    ){

      window.gtag(
        'event',
        'begin_checkout',
        {
          currency:'USD',
          value:
            num(
              snapshot().total||
              window.tcart?.amount
            )
        }
      );
    }

  }catch(e){}
}

function showEmpty(){

  const root=
    document.getElementById(
      ROOT_ID
    );

  root.innerHTML=
    '<main class="flx-page">'+
      '<div class="flx-title-row">'+
        '<h1 class="flx-title">Checkout</h1>'+
        '<a class="flx-mobile-edit" href="/cart">Edit Cart</a>'+
      '</div>'+
      '<div class="flx-empty">'+
        '<strong>Your cart is empty.</strong>'+
        '<br><br>'+
        '<a href="/cart">Return to Cart</a>'+
      '</div>'+
    '</main>';
}

function init(){

  let tries=0;

  const timer=
    setInterval(
      ()=>{

        tries++;

        if(products().length){

          clearInterval(timer);

          build();

          return;
        }

        if(tries>=140){

          clearInterval(timer);

          showEmpty();
        }

      },
      50
    );
}

if(
  document.readyState===
  'loading'
){

  document.addEventListener(
    'DOMContentLoaded',
    init,
    {once:true}
  );

}else{

  init();
}

console.info(
  '[Filin Labs] Checkout Core V28.2 ready'
);

})();


/* FILIN LABS — Checkout Integrations V31 */

(function(){

'use strict';

if(window.__FILIN_CHECKOUT_INTEGRATIONS_V31__) return;
window.__FILIN_CHECKOUT_INTEGRATIONS_V31__=true;


/* ============================================================
   SETTINGS
   ============================================================ */

const AUTH_RETURN =
  'filin_auth_return';

const AUTH_STATE_KEY =
  'filin_checkout_authorized_v31';

const AUTH_EMAIL_KEY =
  'filin_checkout_email_v31';

const SHIPPING_KEY =
  'filin_checkout_easypost_rate_v31';


/*
============================================================
EASYPOST

ВСТАВЬТЕ СЮДА URL FIREBASE CLOUD FUNCTION.

EasyPost API Key сюда НЕ вставлять.
Он должен храниться только на Firebase.
============================================================
*/

const EASYPOST_ENDPOINT =
  'PASTE_FIREBASE_FUNCTION_URL_HERE';


function clean(v){
  return String(v || '')
    .replace(/\u00a0/g,' ')
    .replace(/\s+/g,' ')
    .trim();
}


function norm(v){
  return clean(v).toLowerCase();
}


function FC(){
  return window.FilinCheckout;
}


/* ============================================================
   EMAIL HELPERS
   ============================================================ */

function validEmail(value){

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(
      clean(value)
    );
}


function saveEmail(value){

  const email =
    clean(value);

  if(
    !email ||
    !validEmail(email)
  ){
    return '';
  }

  /*
  Не сохраняем служебную почту сайта
  как email покупателя.
  */

  if(
    norm(email) ===
    'shop@filinlabs.com'
  ){
    return '';
  }

  try{
    sessionStorage.setItem(
      AUTH_EMAIL_KEY,
      email
    );
  }catch(e){}

  authCache.email=email;

  return email;
}


function storedEmail(){

  try{

    const value =
      clean(
        sessionStorage.getItem(
          AUTH_EMAIL_KEY
        ) || ''
      );

    return validEmail(value)
      ? value
      : '';

  }catch(e){

    return '';
  }
}


function extractEmail(value){

  const text =
    String(value || '');

  const emails =
    text.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/ig
    ) || [];

  for(const email of emails){

    if(
      validEmail(email) &&
      norm(email)!==
      'shop@filinlabs.com'
    ){
      return clean(email);
    }
  }

  return '';
}


/* ============================================================
   AUTH CACHE
   ============================================================ */

let authCache={
  value:null,
  email:'',
  time:0
};


function markAuthorized(email=''){

  try{

    sessionStorage.setItem(
      AUTH_STATE_KEY,
      String(Date.now())
    );

  }catch(e){}

  if(email){
    saveEmail(email);
  }

  authCache.value=true;
  authCache.time=Date.now();
}


function clearAuthorized(){

  const keys=[
    AUTH_STATE_KEY,
    AUTH_EMAIL_KEY,

    /*
    Старые версии.
    Удаляем их специально,
    чтобы после Logout они не оживляли Signed in.
    */

    'filin_checkout_authorized_v23',
    'filin_checkout_authorized_v24',
    'filin_checkout_authorized_v25',
    'filin_checkout_authorized_v26',
    'filin_checkout_authorized_v27',
    'filin_checkout_authorized_v28',
    'filin_checkout_authorized_v29',
    'filin_checkout_authorized_v30',

    'filin_checkout_email_v28',
    'filin_checkout_email_v29',
    'filin_checkout_email_v30'
  ];

  try{

    keys.forEach(
      key=>
        sessionStorage.removeItem(key)
    );

  }catch(e){}

  authCache={
    value:false,
    email:'',
    time:Date.now()
  };
}


function hasAuthorizedFlag(){

  try{
    return !!sessionStorage.getItem(
      AUTH_STATE_KEY
    );
  }catch(e){
    return false;
  }
}


/* ============================================================
   FIND ACCOUNT EMAIL IN PAGE
   ============================================================ */

function accountEmailFromDom(){

  const values=[];

  const nativeForm =
    FC()?.nativeForm;


  /*
  1. Native ST100 fields.
  */

  if(nativeForm){

    nativeForm
      .querySelectorAll('input')
      .forEach(input=>{

        const descriptor =
          norm(
            [
              input.name,
              input.id,
              input.type,
              input.placeholder,
              input.autocomplete,
              input.dataset?.email
            ]
            .filter(Boolean)
            .join(' ')
          );

        if(
          /email|e-mail|login/
            .test(descriptor)
        ){
          values.push(
            input.value || ''
          );
        }

      });
  }


  /*
  2. Tilda Members userbar.
  */

  document
    .querySelectorAll(
      '.tilda-members-userbar,'+
      '.tilda-members-userbar__popup,'+
      '.t-members-userbar,'+
      '[class*="members-userbar"]'
    )
    .forEach(node=>{

      values.push(
        node.textContent || ''
      );

      [
        'data-email',
        'data-user-email',
        'data-login'
      ].forEach(attribute=>{

        const value =
          node.getAttribute?.(
            attribute
          );

        if(value){
          values.push(value);
        }

      });

    });


  /*
  3. DOM elements with account data.
  */

  document
    .querySelectorAll(
      '[data-email],'+
      '[data-user-email],'+
      '[data-login]'
    )
    .forEach(node=>{

      values.push(
        node.getAttribute(
          'data-email'
        ) || ''
      );

      values.push(
        node.getAttribute(
          'data-user-email'
        ) || ''
      );

      values.push(
        node.getAttribute(
          'data-login'
        ) || ''
      );

    });


  /*
  4. Несколько возможных Tilda globals.
  */

  const candidates=[
    window.tildaMembersUser,
    window.tildaMembers,
    window.tildaMembersProfile,
    window.tildaUser
  ];


  candidates.forEach(candidate=>{

    if(!candidate) return;

    try{

      if(typeof candidate==='string'){
        values.push(candidate);
      }else{

        [
          'email',
          'login',
          'user_email',
          'ma_email'
        ].forEach(key=>{

          if(candidate[key]){
            values.push(
              candidate[key]
            );
          }

        });

      }

    }catch(e){}

  });


  for(const value of values){

    const email =
      extractEmail(value);

    if(email){
      return saveEmail(email);
    }
  }


  return '';
}


function accountEmail(){

  return (
    accountEmailFromDom() ||
    storedEmail()
  );
}


/* ============================================================
   AUTH DETECTION FROM CURRENT DOM
   ============================================================ */

function accountDomAuthorized(){

  const accountLinks =
    Array.from(
      document.querySelectorAll(
        'a[href]'
      )
    )
    .some(link=>{

      const href =
        String(
          link.getAttribute('href') ||
          link.href ||
          ''
        );

      return (
        /\/members\/(profile|orders|purchased)/i
          .test(href)
      );
    });


  if(accountLinks){
    return true;
  }


  const membersText =
    norm(
      Array.from(
        document.querySelectorAll(
          '.tilda-members-userbar,'+
          '.tilda-members-userbar__popup,'+
          '.t-members-userbar,'+
          '[class*="members-userbar"]'
        )
      )
      .map(
        node=>
          node.textContent || ''
      )
      .join(' ')
    );


  return (
    /my orders|purchased products|edit profile|sign out|log out/
      .test(membersText)
  );
}


/* ============================================================
   REAL TILDA MEMBERS SESSION CHECK
   ============================================================ */

async function checkMembersServer(){

  try{

    const response =
      await fetch(
        '/members/?filin_auth_check='+
        Date.now(),
        {
          credentials:'include',
          cache:'no-store',
          redirect:'follow'
        }
      );


    const finalURL =
      new URL(
        response.url,
        location.origin
      );


    const finalPath =
      String(
        finalURL.pathname || '/'
      );


    const source =
      await response.text();


    const html =
      norm(source);


    /*
    Tilda отправила к Login / Signup.
    Значит пользователь НЕ авторизован.
    */

    if(
      /\/members\/(login|signup|recover|password)/i
        .test(finalPath) ||

      (
        /log in to your account|forgot password/
          .test(html) &&

        /type=["']password["']/
          .test(source)
      )
    ){

      /*
      Не сбрасываем локальный auth-флаг прямо внутри server probe.
      После успешного Login Tilda может на долю секунды вернуть
      промежуточную Members-страницу. Решение о Logout принимает
      isAuthorized(), с небольшим grace-периодом.
      */

      return {
        authorized:false,
        email:''
      };
    }


    /*
    Пытаемся достать email из страницы Members.
    */

    const serverEmail =
      extractEmail(source);


    const email =
      serverEmail ||
      accountEmailFromDom() ||
      storedEmail();


    /*
    Признаки реального вошедшего пользователя.
    */

    const authorized =
      (
        /my orders|purchased products|edit profile|sign out|log out|personal account/
          .test(html) ||

        accountDomAuthorized()
      );


    if(authorized){

      markAuthorized(email);

      return {
        authorized:true,
        email
      };
    }


    /*
    Если /members/ остался страницей входа,
    но URL Tilda не поменяла.
    */

    if(
      /email|password/
        .test(html) &&
      /log in|login|sign in/
        .test(html)
    ){

      /*
      Не сбрасываем локальный auth-флаг прямо внутри server probe.
      После успешного Login Tilda может на долю секунды вернуть
      промежуточную Members-страницу. Решение о Logout принимает
      isAuthorized(), с небольшим grace-периодом.
      */

      return {
        authorized:false,
        email:''
      };
    }


    return {
      authorized:null,
      email
    };


  }catch(e){

    return {
      authorized:null,
      email:
        accountEmailFromDom() ||
        storedEmail()
    };
  }
}


/* ============================================================
   AUTH STATUS
   ============================================================ */

function authorizedFlagAge(){

  try{

    const value =
      Number(
        sessionStorage.getItem(
          AUTH_STATE_KEY
        ) || 0
      );

    return value
      ? Math.max(
          0,
          Date.now()-value
        )
      : Infinity;

  }catch(e){

    return Infinity;
  }
}


function hasFreshAuthorizedFlag(
  maxAge=15000
){

  return (
    hasAuthorizedFlag() &&
    authorizedFlagAge()<=maxAge
  );
}


async function isAuthorized(force=false){

  /*
  1. DOM Tilda Members — самый быстрый и надёжный
  признак уже загруженного аккаунта.
  Проверяем его ВСЕГДА, в том числе при force=true.
  */

  if(accountDomAuthorized()){

    const email =
      accountEmailFromDom() ||
      storedEmail();

    markAuthorized(email);

    return true;
  }


  /*
  2. После успешного Login мы ставим auth-флаг ДО reload.
  В течение 15 секунд не показываем пользователю
  ложное состояние SIGN IN / NEW ACCOUNT, пока Tilda
  догружает userbar и Members session на новой странице.
  */

  if(
    hasFreshAuthorizedFlag(
      15000
    )
  ){
    return true;
  }


  /*
  3. Проверяем реальную Members session.
  */

  const serverState =
    await checkMembersServer();


  if(
    serverState.authorized===
    true
  ){
    markAuthorized(
      serverState.email ||
      accountEmailFromDom() ||
      storedEmail()
    );

    return true;
  }


  if(
    serverState.authorized===
    false
  ){

    /*
    Сервер подтвердил Logout, а свежего post-login
    grace-флага уже нет — теперь можно сбросить состояние.
    */

    clearAuthorized();

    return false;
  }


  /*
  4. При временной сетевой ошибке не дёргаем UI.
  Если старый флаг существует, оставляем текущий Signed in.
  */

  if(hasAuthorizedFlag()){
    return true;
  }


  return false;
}


/* ============================================================
   POPUP RETURN PAGE
   ============================================================ */

const returnParams =
  new URLSearchParams(
    location.search
  );


if(
  returnParams.get(
    AUTH_RETURN
  )==='1' &&

  window.opener &&
  !window.opener.closed
){

  try{

    window.opener.postMessage(
      {
        type:
          'FILIN_AUTH_FINISHED_V31'
      },
      location.origin
    );

  }catch(e){}


  setTimeout(
    ()=>{
      try{
        window.close();
      }catch(e){}
    },
    120
  );


  return;
}


/* ============================================================
   AUTH POPUP
   ============================================================ */

let authPopup=null;
let authTimer=null;
let authFinishing=false;
let authProbeTick=0;
let authProbeBusy=false;
let authSubmitSeen=false;


function authUrl(type){

  /*
  FIX 2:
  redirecturl ПОЛНОСТЬЮ УБРАН.

  Tilda Members сама формирует переход после Login.
  На разных проектах она может дополнительно приписывать "/"
  к redirecturl. Из-за этого:
    /checkout -> //checkout
    https://filinlabs.com/checkout ->
    /https://filinlabs.com/checkout

  Нам redirecturl вообще не нужен:
  родительский Checkout сам проверяет Members cookie/session,
  закрывает popup и обновляет Customer.
  */

  const route =
    type==='signup'
      ? '/members/signup'
      : '/members/login';


  return (
    route+
    '?filin_checkout_popup=1&ts='+
    Date.now()
  );
}


/* ============================================================
   CAPTURE EMAIL FROM POPUP
   ============================================================ */

function capturePopupEmail(){

  if(
    !authPopup ||
    authPopup.closed
  ){
    return '';
  }


  try{

    const doc =
      authPopup.document;


    const inputs =
      Array.from(
        doc.querySelectorAll(
          'input'
        )
      );


    let input =
      inputs.find(item=>{

        const descriptor =
          norm(
            [
              item.type,
              item.name,
              item.id,
              item.placeholder,
              item.autocomplete
            ]
            .filter(Boolean)
            .join(' ')
          );

        return (
          /email|e-mail|login/
            .test(descriptor) &&
          item.type!=='password'
        );
      });


    if(!input){

      input =
        doc.querySelector(
          'input[type="email"]'
        );
    }


    const email =
      clean(
        input?.value || ''
      );


    if(validEmail(email)){
      return saveEmail(email);
    }


  }catch(e){}


  return '';
}


/* ============================================================
   DO NOT INTERFERE WITH TILDA LOGIN FORM

   Только слушаем submit и сохраняем email.
   preventDefault здесь НЕТ.
   ============================================================ */

function bindPopupFormCapture(){

  if(
    !authPopup ||
    authPopup.closed
  ){
    return;
  }


  try{

    const doc =
      authPopup.document;


    doc
      .querySelectorAll('form')
      .forEach(form=>{

        if(
          form.dataset
            .filinEmailCapture==='1'
        ){
          return;
        }


        form.dataset
          .filinEmailCapture='1';


        form.addEventListener(
          'submit',
          ()=>{
            capturePopupEmail();
            authSubmitSeen=true;
          },
          false
        );

      });

  }catch(e){}
}


/* ============================================================
   CHECK SUCCESSFUL POPUP AUTH
   ============================================================ */

function popupLeftAuthPage(){

  if(
    !authSubmitSeen ||
    !authPopup ||
    authPopup.closed
  ){
    return false;
  }


  try{

    const popupPath =
      String(
        authPopup.location.pathname ||
        '/'
      );


    const popupSearch =
      String(
        authPopup.location.search ||
        ''
      );


    const text =
      norm(
        authPopup.document
          ?.body
          ?.textContent || ''
      );


    /*
    Если пароль неверный, Tilda остаётся на Login page.
    Поэтому после submit переход с /members/login|signup
    означает, что авторизация уже завершилась и popup
    больше не нужен.

    Отдельно ловим текущий дефект Tilda:
    /https://filinlabs.com/checkout...
    */

    const stillAuthPage =
      /\/members\/(login|signup|recover|password)(?:\/|$)/i
        .test(popupPath);


    const brokenRedirect =
      /^\/https?:\/\//i.test(popupPath) ||
      /404 page not found/i.test(text);


    if(brokenRedirect){
      return true;
    }


    if(
      !stillAuthPage &&
      popupPath!=='/' &&
      popupPath!==''
    ){
      return true;
    }


    return false;

  }catch(e){

    /*
    Во время настоящего cross-navigation доступ к popup
    на мгновение может быть недоступен. Само по себе это
    не считаем успехом — server probe подтвердит cookie.
    */

    return false;
  }
}


function popupLooksAuthorized(){

  if(
    !authPopup ||
    authPopup.closed
  ){
    return false;
  }


  capturePopupEmail();
  bindPopupFormCapture();


  try{

    const popupPath =
      String(
        authPopup.location.pathname ||
        '/'
      )
      .replace(/\/+$/,'');


    if(
      popupPath==='/members' ||

      /\/members\/(profile|orders|purchased)/i
        .test(popupPath)
    ){
      return true;
    }


    if(
      popupPath==='/checkout' &&
      new URLSearchParams(
        authPopup.location.search
      ).get(AUTH_RETURN)==='1'
    ){
      return true;
    }


    const text =
      norm(
        authPopup.document
          ?.body
          ?.textContent || ''
      );


    if(
      /my orders|purchased products|edit profile|personal account|sign out|log out/
        .test(text)
    ){
      return true;
    }


  }catch(e){}


  return false;
}


/* ============================================================
   SUCCESSFUL AUTH
   ============================================================ */

async function popupFinished(){

  if(authFinishing){
    return;
  }

  authFinishing=true;


  const email =
    capturePopupEmail() ||
    storedEmail();


  markAuthorized(email);


  clearInterval(
    authTimer
  );


  try{

    if(
      authPopup &&
      !authPopup.closed
    ){
      authPopup.close();
    }

  }catch(e){}


  /*
  Сразу показываем Signed in в текущем Checkout,
  чтобы интерфейс не прыгал обратно к двум кнопкам.
  */

  try{
    await renderCustomer(false);
  }catch(e){}


  /*
  Один мягкий reload всё ещё нужен, чтобы Tilda сама
  подставила сохранённые Customer / Shipping данные ST100.

  markAuthorized() уже выполнен выше, поэтому после reload
  15-секундный grace-период не даст показать ложный Logged out.
  */

  setTimeout(
    ()=>{
      location.replace(
        '/checkout?account_refresh='+
        Date.now()
      );
    },
    220
  );
}


/* ============================================================
   OPEN AUTH POPUP
   ============================================================ */

function openAuth(type){

  const width=520;
  const height=760;


  const left =
    Math.max(
      0,
      Math.round(
        screen.width/2-
        width/2
      )
    );


  const top =
    Math.max(
      0,
      Math.round(
        screen.height/2-
        height/2
      )
    );


  authFinishing=false;
  authProbeTick=0;
  authProbeBusy=false;
  authSubmitSeen=false;


  authPopup =
    window.open(
      authUrl(type),
      'FilinAccountAuth',
      [
        'popup=yes',
        'width='+width,
        'height='+height,
        'left='+left,
        'top='+top,
        'resizable=yes',
        'scrollbars=yes'
      ].join(',')
    );


  if(!authPopup){

    location.href=
      authUrl(type);

    return;
  }


  try{
    authPopup.focus();
  }catch(e){}


  clearInterval(
    authTimer
  );


  authTimer =
    setInterval(
      async ()=>{

        /*
        Постоянно читаем email и подключаем submit-listener.
        Нативный Tilda submit НЕ блокируем.
        */

        capturePopupEmail();
        bindPopupFormCapture();


        /*
        Пользователь сам закрыл popup.
        Если Login уже успел установить Members cookie,
        закрытие popup сразу завершит авторизацию Checkout.
        */

        if(
          !authPopup ||
          authPopup.closed
        ){

          clearInterval(
            authTimer
          );


          if(
            await isAuthorized(true)
          ){

            popupFinished();

          }else{

            authFinishing=false;
            renderCustomer(true);
          }


          return;
        }


        /*
        FIX 3.

        После успешного Login Tilda на этом проекте иногда
        пытается открыть ошибочный URL вида:

        /https://filinlabs.com/checkout...

        Раньше пользователь успевал увидеть 404 и должен был
        закрывать окно вручную.

        Теперь сразу после submit следим за уходом popup
        со страницы /members/login|signup. Как только такой
        переход произошёл — cookie уже создана либо создаётся
        в рамках завершившегося Login, поэтому закрываем popup
        немедленно и завершаем Checkout.
        */

        if(
          popupLeftAuthPage()
        ){

          popupFinished();
          return;
        }


        /*
        Нормальный Tilda Members/Profile переход.
        */

        if(
          popupLooksAuthorized()
        ){

          popupFinished();
          return;
        }


        /*
        Дополнительная серверная проверка Members session.

        Интервал таймера = 80 мс.
        Проверяем сервер раз в 4 тика (~320 мс), не создавая
        параллельных запросов.
        */

        authProbeTick++;


        if(
          authProbeTick%4===0 &&
          !authProbeBusy
        ){

          authProbeBusy=true;

          try{

            const serverState =
              await checkMembersServer();


            if(
              serverState.authorized===
              true
            ){

              markAuthorized(
                serverState.email ||
                capturePopupEmail() ||
                storedEmail()
              );

              popupFinished();
              return;
            }

          }catch(e){

          }finally{

            authProbeBusy=false;
          }
        }

      },
      80
    );
}


/* ============================================================
   POSTMESSAGE FROM AUTH RETURN PAGE
   ============================================================ */

window.addEventListener(
  'message',
  event=>{

    if(
      event.origin!==
      location.origin
    ){
      return;
    }


    if(
      event.data?.type!==
      'FILIN_AUTH_FINISHED_V31'
    ){
      return;
    }


    popupFinished();
  }
);


/* ============================================================
   CUSTOMER
   ============================================================ */

async function renderCustomer(
  force=false
){

  const core=FC();


  if(
    !core?.ready ||
    !core.root
  ){
    return;
  }


  const step =
    core.root.querySelector(
      '.flx-step[data-step="customer"]'
    );


  const panel =
    step?.querySelector(
      '.flx-step-panel'
    );


  const auth =
    panel?.querySelector(
      '.flx-auth'
    );


  if(
    !step ||
    !auth
  ){
    return;
  }


  const signed =
    await isAuthorized(
      force
    );


  if(signed){

    const email =
      accountEmail();


    auth.className =
      'flx-auth is-authorized';


    auth.innerHTML =
      '<div class="flx-auth-row">'+

        '<span class="flx-auth-icon">'+
          '✓'+
        '</span>'+

        '<div>'+

          '<p class="flx-auth-title">'+
            'Signed in'+
          '</p>'+

          (
            email
              ? (
                  '<span class="flx-auth-email">'+
                    core.esc(email)+
                  '</span>'
                )
              : ''
          )+

        '</div>'+

      '</div>';


    core.complete?.(
      'customer'
    );


    /*
    Переносим сохраненные Tilda данные
    в визуальный Shipping.
    */

    copyNativeShippingValues();


    return;
  }


  /*
  LOGGED OUT
  */

  step.classList.remove(
    'is-complete'
  );


  const number =
    step.querySelector(
      '.flx-step-number'
    );


  if(number){
    number.textContent='1';
  }


  auth.className='flx-auth';


  auth.innerHTML =
    '<div class="flx-auth-row">'+

      '<span class="flx-auth-icon">'+
        '1'+
      '</span>'+

      '<div>'+
        '<p class="flx-auth-title">'+
          'Customer account'+
        '</p>'+
      '</div>'+

    '</div>'+

    '<div class="flx-auth-actions">'+

      '<button '+
        'type="button" '+
        'class="flx-auth-btn is-primary" '+
        'data-filinauth="signin">'+

        'SIGN IN'+

      '</button>'+

      '<button '+
        'type="button" '+
        'class="flx-auth-btn" '+
        'data-filinauth="signup">'+

        'NEW ACCOUNT'+

      '</button>'+

    '</div>';
}


/* ============================================================
   CUSTOMER BUTTONS
   ============================================================ */

document.addEventListener(
  'click',
  event=>{

    const button =
      event.target.closest?.(
        '[data-filinauth]'
      );


    if(!button){
      return;
    }


    event.preventDefault();
    event.stopPropagation();


    openAuth(
      button.dataset.filinauth
    );

  },
  true
);


/* ============================================================
   LOGOUT DETECTION
   ============================================================ */

document.addEventListener(
  'click',
  event=>{

    const element =
      event.target.closest?.(
        'a,button,[role="button"]'
      );


    if(!element){
      return;
    }


    const href =
      String(
        element.getAttribute?.(
          'href'
        ) || ''
      );


    const text =
      norm(
        [
          element.textContent,
          element.getAttribute?.(
            'aria-label'
          ),
          element.getAttribute?.(
            'title'
          )
        ]
        .filter(Boolean)
        .join(' ')
      );


    if(
      /\/members\/logout/i
        .test(href) ||

      /\blog out\b|\bsign out\b|\bвыйти\b/
        .test(text)
    ){

      /*
      Немедленно удаляем локальный auth state.
      */

      clearAuthorized();


      setTimeout(
        ()=>{
          renderCustomer(true);
        },
        700
      );


      setTimeout(
        ()=>{
          renderCustomer(true);
        },
        1800
      );
    }

  },
  true
);


/* ============================================================
   COPY SAVED TILDA SHIPPING DATA
   ============================================================ */

function visibleShipping(){

  const core=FC();

  if(!core?.root){
    return [];
  }


  return Array.from(
    core.root.querySelectorAll(
      '.flx-step[data-step="shipping"] .flx-field'
    )
  )
  .map(field=>({

    field,

    label:
      norm(
        field.querySelector(
          'label'
        )?.textContent || ''
      ),

    control:
      field.querySelector(
        'input,select,textarea'
      )

  }))
  .filter(
    item=>item.control
  );
}


function nativeDescriptor(control){

  const core=FC();


  if(
    core &&
    typeof core.descriptor===
    'function'
  ){

    return core.descriptor(
      control
    );
  }


  return norm(
    [
      control.name,
      control.id,
      control.type,
      control.placeholder,
      control.autocomplete
    ]
    .filter(Boolean)
    .join(' ')
  );
}


function labelMatcher(label){

  if(label==='your name'){
    return /first name|given-name|\bname\b/;
  }

  if(label==='country'){
    return /country/;
  }

  if(
    label==='postal code' ||
    label==='zip'
  ){
    return /postal|postcode|zip/;
  }

  if(label==='city'){
    return /city|address-level2/;
  }

  if(label==='address'){
    return /street|address/;
  }

  if(label==='comment'){
    return /comment|instruction/;
  }

  return null;
}


function copyNativeShippingValues(){

  const core=FC();

  const form=
    core?.nativeForm;


  if(!form){
    return;
  }


  const native =
    Array.from(
      form.querySelectorAll(
        'input:not([type="hidden"]):not([type="submit"]),select,textarea'
      )
    );


  visibleShipping()
    .forEach(item=>{

      const rx=
        labelMatcher(
          item.label
        );


      if(!rx){
        return;
      }


      const source =
        native.find(
          control=>
            rx.test(
              nativeDescriptor(
                control
              )
            ) &&
            clean(
              control.value
            )
        );


      if(
        source &&
        !clean(
          item.control.value
        )
      ){

        item.control.value=
          source.value;


        item.control.dispatchEvent(
          new Event(
            'input',
            {bubbles:true}
          )
        );


        item.control.dispatchEvent(
          new Event(
            'change',
            {bubbles:true}
          )
        );
      }

    });
}


/* ============================================================
   CONSENT
   ============================================================ */

let consent=null;
let consentInput=null;


function nativeConsentInputs(){

  const form=
    FC()?.nativeForm;


  if(!form){
    return [];
  }


  return Array.from(
    form.querySelectorAll(
      'input[type="checkbox"]'
    )
  )
  .filter(input=>{

    const value =
      nativeDescriptor(
        input
      );


    return /privacy|personal data|processing|legal|terms|consent|agreement/
      .test(value);
  });
}


function syncConsent(){

  if(!consentInput){
    return;
  }


  nativeConsentInputs()
    .forEach(input=>{

      input.checked=
        consentInput.checked;


      input.dispatchEvent(
        new Event(
          'input',
          {bubbles:true}
        )
      );


      input.dispatchEvent(
        new Event(
          'change',
          {bubbles:true}
        )
      );

    });


  updatePayButton();
}


function createConsent(){

  if(consent){
    return consent;
  }


  consent=
    document.createElement(
      'label'
    );


  consent.className=
    'filin-consent';


  consent.innerHTML =
    '<input type="checkbox" checked>'+

    '<span>'+

      'I agree to the processing of my personal data and accept the '+

      '<a href="https://filinlabs.com/privacy">'+
        'Privacy Policy terms and conditions'+
      '</a>'+

      ' and other documents outlined in the '+

      '<a href="https://filinlabs.com/legal">'+
        'Legal Information section'+
      '</a>.'+

    '</span>';


  consentInput =
    consent.querySelector(
      'input'
    );


  consentInput.addEventListener(
    'change',
    syncConsent
  );


  syncConsent();


  return consent;
}


function placeConsent(){

  const core=FC();


  if(!core?.root){
    return;
  }


  const block=
    createConsent();


  /*
  MOBILE:
  после Payment.
  */

  if(innerWidth<=980){

    const payment =
      core.root.querySelector(
        '.flx-step[data-step="payment"]'
      );


    if(
      payment &&
      block.previousElementSibling!==
      payment
    ){
      payment.after(
        block
      );
    }

  }


  /*
  DESKTOP:
  под Order Summary.
  */

  else{

    const right =
      core.root.querySelector(
        '.flx-right'
      );


    if(
      right &&
      block.parentElement!==
      right
    ){

      right.appendChild(
        block
      );
    }
  }
}


/* ============================================================
   EASYPOST
   ============================================================ */

let selectedRate=null;


/*
Восстанавливаем выбранный rate,
если Checkout обновился.
*/

try{

  const storedRate =
    sessionStorage.getItem(
      SHIPPING_KEY
    );


  if(storedRate){

    selectedRate=
      JSON.parse(
        storedRate
      );
  }

}catch(e){}


function endpointReady(){

  return (
    EASYPOST_ENDPOINT &&
    !EASYPOST_ENDPOINT.includes(
      'PASTE_'
    )
  );
}


function shippingField(regex){

  const core=FC();


  const step =
    core?.root?.querySelector(
      '.flx-step[data-step="shipping"]'
    );


  if(!step){
    return null;
  }


  const fields =
    Array.from(
      step.querySelectorAll(
        '.flx-field'
      )
    );


  for(const field of fields){

    const label =
      clean(
        field.querySelector(
          'label'
        )?.textContent
      );


    if(regex.test(label)){

      return field.querySelector(
        'input,select,textarea'
      );
    }
  }


  return null;
}


function fieldValue(regex){

  return clean(
    shippingField(regex)
      ?.value
  );
}


function countryISO(value){

  const raw=
    clean(value);


  if(
    /^[A-Za-z]{2}$/
      .test(raw)
  ){
    return raw.toUpperCase();
  }


  const wanted=
    raw.toLowerCase();


  try{

    const names =
      new Intl.DisplayNames(
        ['en'],
        {type:'region'}
      );


    for(let a=65;a<=90;a++){

      for(let b=65;b<=90;b++){

        const code =
          String.fromCharCode(
            a,
            b
          );


        const name =
          names.of(code);


        if(
          name &&
          name!==code &&
          name.toLowerCase()===
          wanted
        ){
          return code;
        }
      }
    }

  }catch(e){}


  return raw.toUpperCase();
}


/*
В браузер dimensions / weight НЕ передаются.

В Firebase отправляются только
идентификаторы товара.

Shipping profiles остаются скрытыми
на серверной стороне.
*/

function cartItems(){

  const products =
    Array.isArray(
      window.tcart?.products
    )
      ? window.tcart.products
      : [];


  return products
    .filter(
      p=>
        p &&
        p.deleted!=='yes' &&
        Number(
          p.quantity ||
          p.qty ||
          1
        )>0
    )
    .map(
      p=>({

        id:
          clean(
            p.uid ||
            p.id ||
            p.lid ||
            p.externalid ||
            p.external_id
          ),

        sku:
          clean(
            p.sku ||
            p.article ||
            p.code
          ),

        name:
          clean(
            p.__flcartCanonicalName ||
            p.name ||
            p.title ||
            p.product ||
            'Product'
          ),

        url:
          clean(
            p.__flcartUrl ||
            p.url ||
            p.link ||
            p.product_url ||
            p.href
          ),

        quantity:
          Math.max(
            1,
            Math.round(
              Number(
                p.quantity ||
                p.qty ||
                1
              )
            )
          ),

        unit_price:
          Number(
            p.price ||
            p.unitprice ||
            p.baseprice ||
            0
          )

      })
    );
}


function hiddenField(
  name,
  value
){

  const form =
    FC()?.nativeForm;


  if(!form){
    return;
  }


  let input =
    Array.from(
      form.querySelectorAll(
        'input'
      )
    )
    .find(
      item=>
        item.name===name
    );


  if(!input){

    input =
      document.createElement(
        'input'
      );


    input.type='hidden';
    input.name=name;

    form.appendChild(
      input
    );
  }


  input.value =
    value==null
      ? ''
      : String(value);
}


function clearShippingSelection(){

  selectedRate=null;


  try{
    sessionStorage.removeItem(
      SHIPPING_KEY
    );
  }catch(e){}


  hiddenField(
    'Shipping Carrier',
    ''
  );

  hiddenField(
    'Shipping Service',
    ''
  );

  hiddenField(
    'Shipping Rate',
    ''
  );

  hiddenField(
    'Shipping Currency',
    ''
  );


  const box =
    FC()?.root?.querySelector(
      '.filin-ep-box'
    );


  box
    ?.querySelectorAll(
      '.filin-ep-rate'
    )
    .forEach(
      node=>
        node.classList.remove(
          'selected'
        )
    );
}


function formatRate(
  value,
  currency='USD'
){

  const number =
    Number(
      value || 0
    );


  try{

    return new Intl.NumberFormat(
      'en-US',
      {
        style:'currency',
        currency:
          clean(currency) ||
          'USD',
        maximumFractionDigits:2
      }
    ).format(number);

  }catch(e){

    return '$'+
      number.toFixed(2);
  }
}


async function calculateShipping(box){

  const status =
    box.querySelector(
      '.filin-ep-status'
    );


  const button =
    box.querySelector(
      '.filin-ep-btn'
    );


  const ratesHost =
    box.querySelector(
      '.filin-ep-rates'
    );


  const address={

    name:
      fieldValue(
        /your name|^name$/i
      ),

    street1:
      fieldValue(
        /^address$|street/i
      ),

    city:
      fieldValue(
        /^city$/i
      ),

    state:
      fieldValue(
        /state|province|region/i
      ),

    zip:
      fieldValue(
        /postal|postcode|zip/i
      ),

    country:
      countryISO(
        fieldValue(
          /^country$/i
        )
      )
  };


  if(
    !address.name ||
    !address.street1 ||
    !address.city ||
    !address.zip ||
    !address.country
  ){

    status.className=
      'filin-ep-status error';


    status.textContent=
      'Complete Your name, Country, Postal Code, City and Address first.';


    return;
  }


  if(!endpointReady()){

    status.className=
      'filin-ep-status error';


    status.textContent=
      'EasyPost Firebase Function URL has not been configured yet.';


    return;
  }


  clearShippingSelection();


  button.disabled=true;
  ratesHost.innerHTML='';


  status.className=
    'filin-ep-status';


  status.textContent=
    'Calculating carrier rates…';


  try{

    const response =
      await fetch(
        EASYPOST_ENDPOINT,
        {
          method:'POST',

          headers:{
            'Content-Type':
              'application/json'
          },

          body:
            JSON.stringify({
              address,
              items:
                cartItems()
            })
        }
      );


    let data={};


    try{
      data=
        await response.json();
    }catch(e){}


    if(!response.ok){

      throw new Error(
        data.message ||

        (
          data.missing_profiles
            ?.length

            ? (
                'Shipping data is missing for: '+
                data.missing_profiles.join(', ')
              )

            : 'Unable to calculate shipping.'
        )
      );
    }


    const rates =
      Array.isArray(
        data.rates
      )
        ? data.rates
        : [];


    if(!rates.length){

      throw new Error(
        'No delivery services are available for this address.'
      );
    }


    ratesHost.innerHTML =
      rates
        .map(
          (rate,index)=>

            '<label class="filin-ep-rate" data-index="'+
              index+
            '">'+

              '<input type="radio" name="filinEasyPostRate">'+

              '<span>'+

                '<span class="filin-ep-carrier">'+
                  FC().esc(
                    clean(
                      rate.carrier
                    )
                  )+
                '</span>'+

                '<span class="filin-ep-service">'+

                  FC().esc(
                    clean(
                      rate.service
                    )
                  )+

                  (
                    rate.delivery_days

                      ? (
                          ' · about '+
                          Number(
                            rate.delivery_days
                          )+
                          ' business days'
                        )

                      : ''
                  )+

                '</span>'+

              '</span>'+

              '<span class="filin-ep-price">'+
                formatRate(
                  rate.rate,
                  rate.currency
                )+
              '</span>'+

            '</label>'

        )
        .join('');


    ratesHost
      .querySelectorAll(
        '.filin-ep-rate'
      )
      .forEach(
        (element,index)=>{

          element.addEventListener(
            'click',
            ()=>{

              ratesHost
                .querySelectorAll(
                  '.filin-ep-rate'
                )
                .forEach(
                  node=>
                    node.classList.remove(
                      'selected'
                    )
                );


              element.classList.add(
                'selected'
              );


              element
                .querySelector(
                  'input'
                )
                .checked=true;


              const rate=
                rates[index];


              selectedRate=rate;


              try{

                sessionStorage.setItem(
                  SHIPPING_KEY,
                  JSON.stringify(
                    rate
                  )
                );

              }catch(e){}


              hiddenField(
                'Shipping Carrier',
                rate.carrier
              );


              hiddenField(
                'Shipping Service',
                rate.service
              );


              hiddenField(
                'Shipping Rate',
                rate.rate
              );


              hiddenField(
                'Shipping Currency',
                rate.currency
              );


              hiddenField(
                'Shipping Delivery Days',
                rate.delivery_days || ''
              );


              status.className=
                'filin-ep-status';


              status.textContent =
                'Selected: '+
                clean(rate.carrier)+
                ' '+
                clean(rate.service)+
                ' — '+
                formatRate(
                  rate.rate,
                  rate.currency
                );
            }
          );

        }
      );


    status.textContent=
      'Choose a delivery service.';


  }catch(error){

    status.className=
      'filin-ep-status error';


    status.textContent=
      error.message ||
      'Unable to calculate shipping.';

  }finally{

    button.disabled=false;
  }
}


function addEasyPost(){

  const core=FC();


  const panel =
    core?.root?.querySelector(
      '.flx-step[data-step="shipping"] .flx-step-panel'
    );


  if(
    !panel ||
    panel.querySelector(
      '.filin-ep-box'
    )
  ){
    return;
  }


  const box =
    document.createElement(
      'div'
    );


  box.className=
    'filin-ep-box';


  box.innerHTML =
    '<p class="filin-ep-title">'+
      'Shipping quote'+
    '</p>'+

    '<p class="filin-ep-copy">'+
      'Enter your delivery address and calculate available shipping services.'+
    '</p>'+

    '<button type="button" class="filin-ep-btn">'+
      'CALCULATE SHIPPING'+
    '</button>'+

    '<div class="filin-ep-status"></div>'+

    '<div class="filin-ep-rates"></div>';


  const actions =
    panel.querySelector(
      '.flx-actions'
    );


  if(actions){

    panel.insertBefore(
      box,
      actions
    );

  }else{

    panel.appendChild(
      box
    );
  }


  box
    .querySelector(
      '.filin-ep-btn'
    )
    .addEventListener(
      'click',
      ()=>{
        calculateShipping(
          box
        );
      }
    );


  /*
  Адрес изменился:
  старый shipping quote сбрасываем.
  */

  panel.addEventListener(
    'input',
    event=>{

      if(
        event.target.closest(
          '.filin-ep-box'
        )
      ){
        return;
      }


      clearShippingSelection();
    }
  );
}


/* ============================================================
   PAYMENT / SUBMIT GUARDS
   ============================================================ */

function updatePayButton(){

  const button =
    FC()?.root?.querySelector(
      '.flx-pay'
    );


  if(!button){
    return;
  }


  button.disabled =
    !!(
      consentInput &&
      !consentInput.checked
    );
}


async function showCustomerRequired(){

  FC()?.openStep(
    'customer',
    true
  );


  const auth =
    FC()?.root?.querySelector(
      '.flx-auth'
    );


  auth?.scrollIntoView({
    behavior:'smooth',
    block:'center'
  });
}


async function canContinueShipping(){

  if(
    endpointReady() &&
    !selectedRate
  ){

    const box =
      FC()?.root?.querySelector(
        '.filin-ep-box'
      );


    const status =
      box?.querySelector(
        '.filin-ep-status'
      );


    if(status){

      status.className=
        'filin-ep-status error';


      status.textContent=
        'Calculate shipping and select a delivery service before continuing.';
    }


    box?.scrollIntoView({
      behavior:'smooth',
      block:'center'
    });


    return false;
  }


  return true;
}


async function canSubmit(){

  /*
  Проверяем реальную Members session
  непосредственно перед оплатой.
  */

  if(
    !(await isAuthorized(true))
  ){

    await renderCustomer(true);
    await showCustomerRequired();

    return false;
  }


  /*
  Consent обязателен.
  */

  if(
    !consentInput ||
    !consentInput.checked
  ){

    consent?.scrollIntoView({
      behavior:'smooth',
      block:'center'
    });

    return false;
  }


  /*
  EasyPost обязателен,
  если endpoint уже настроен.
  */

  if(
    endpointReady() &&
    !selectedRate
  ){

    FC()?.openStep(
      'shipping',
      true
    );


    const box =
      FC()?.root?.querySelector(
        '.filin-ep-box'
      );


    const status =
      box?.querySelector(
        '.filin-ep-status'
      );


    if(status){

      status.className=
        'filin-ep-status error';


      status.textContent=
        'Calculate shipping and select a delivery service before payment.';
    }


    return false;
  }


  syncConsent();

  return true;
}


/* ============================================================
   NATIVE ST100 SUBMIT GUARD
   ============================================================ */

document.addEventListener(
  'submit',
  event=>{

    const form=
      event.target;


    if(
      !form.closest(
        '.t706,'+
        '[data-record-type="706"]'
      )
    ){
      return;
    }


    if(
      consentInput &&
      !consentInput.checked
    ){

      event.preventDefault();
      event.stopPropagation();

      return false;
    }


    syncConsent();

  },
  true
);


/* ============================================================
   INIT
   ============================================================ */

async function apply(){

  const core=FC();


  if(!core?.ready){
    return;
  }


  placeConsent();

  addEasyPost();

  copyNativeShippingValues();


  core.canContinueShipping=
    canContinueShipping;


  core.canSubmit=
    canSubmit;


  /*
  На загрузке проверяем не старый флаг,
  а реальную Tilda Members session.
  */

  await renderCustomer(true);


  updatePayButton();
}


function schedule(){

  const core=FC();


  if(core?.ready){

    apply();
    return;
  }


  document.addEventListener(
    'filinCheckoutReady',
    apply,
    {once:true}
  );
}


if(
  document.readyState===
  'loading'
){

  document.addEventListener(
    'DOMContentLoaded',
    schedule,
    {once:true}
  );

}else{

  schedule();
}


/* ============================================================
   INITIAL TILDA DATA SYNC
   ============================================================ */

let timerCount=0;


const timer =
  setInterval(
    async ()=>{

      timerCount++;


      if(FC()?.ready){

        placeConsent();

        addEasyPost();

        copyNativeShippingValues();


        /*
        Первые секунды Tilda может догружать
        userbar и данные ST100.
        */

        if(
          timerCount===3 ||
          timerCount===8 ||
          timerCount===15
        ){

          await renderCustomer(
            timerCount===15
          );
        }


        updatePayButton();
      }


      if(timerCount>=25){

        clearInterval(
          timer
        );
      }

    },
    400
  );


/* ============================================================
   LIVE AUTH SYNCHRONIZATION

   Исправляет:
   1. Signed in после Logout.
   2. Авторизацию через человечка Header.
   ============================================================ */

let authWatchBusy=false;


const authWatch =
  setInterval(
    async ()=>{

      if(
        document.visibilityState!==
        'visible' ||
        authWatchBusy ||
        !FC()?.ready
      ){
        return;
      }


      authWatchBusy=true;


      try{

        await renderCustomer(
          true
        );

      }catch(e){}


      authWatchBusy=false;

    },
    4000
  );


/* ============================================================
   TAB / WINDOW FOCUS

   Если пользователь входил через popup
   или через Header, сразу обновляем Customer.
   ============================================================ */

window.addEventListener(
  'focus',
  ()=>{

    setTimeout(
      ()=>{

        if(FC()?.ready){

          renderCustomer(true);
          copyNativeShippingValues();
        }

      },
      350
    );

  }
);


document.addEventListener(
  'visibilitychange',
  ()=>{

    if(
      document.visibilityState===
      'visible' &&
      FC()?.ready
    ){

      setTimeout(
        ()=>{

          renderCustomer(true);
          copyNativeShippingValues();

        },
        300
      );
    }

  }
);


/* ============================================================
   PAGE SHOW / BACK-FORWARD CACHE
   ============================================================ */

window.addEventListener(
  'pageshow',
  ()=>{

    if(!FC()?.ready){
      return;
    }


    setTimeout(
      ()=>{

        renderCustomer(true);
        copyNativeShippingValues();
        placeConsent();

      },
      400
    );

  }
);


/* ============================================================
   RESIZE
   ============================================================ */

let resizeTimer=null;


window.addEventListener(
  'resize',
  ()=>{

    clearTimeout(
      resizeTimer
    );


    resizeTimer =
      setTimeout(
        placeConsent,
        120
      );
  }
);


console.info(
  '[Filin Labs] Checkout Integrations V31 AUTH FIX 3 ready'
);

})();


/* FILIN LABS — Checkout Resonance Secure Bridge V34.1 */

(function(){
  'use strict';

  if(window.__FILIN_CHECKOUT_RESONANCE_V34_1__) return;
  window.__FILIN_CHECKOUT_RESONANCE_V34_1__ = true;

  const KEY='filin_loyalty_reservation_v1';

  const RESERVATION_HIDDEN_NAMES=[
    'LoyaltyRewardReservationId',
    'LoyaltyRewardReservationSignature',
    'LoyaltyRewardIds',
    'LoyaltyRewardReservedValue'
  ];

  function reservation(){
    try{
      const r=JSON.parse(sessionStorage.getItem(KEY)||'null');

      if(
        !r ||
        !r.reservationId ||
        !r.signature
      ){
        return null;
      }

      return r;
    }catch(e){
      return null;
    }
  }

  function adapterReady(){
    return window.FILIN_LOYALTY_PAYMENT_ADAPTER_READY===true;
  }

  function money(cents){
    return new Intl.NumberFormat(
      'en-US',
      {
        style:'currency',
        currency:'USD'
      }
    ).format((Number(cents)||0)/100);
  }

  function checkoutForms(){
    const set=new Set();

    document.querySelectorAll(
      '.t706 form,'+
      '.t706__cartwin form,'+
      '.t706__cartpage form,'+
      '[data-record-type="706"] form'
    ).forEach(form=>set.add(form));

    if(window.FilinCheckout?.nativeForm){
      set.add(window.FilinCheckout.nativeForm);
    }

    return Array.from(set);
  }

  function hidden(form,name,value){
    if(!form) return;

    let input=Array.from(
      form.querySelectorAll('input[type="hidden"]')
    ).find(el=>String(el.name||'')===name);

    if(!input){
      input=document.createElement('input');
      input.type='hidden';
      input.name=name;
      input.dataset.filinSecureLoyalty='1';
      form.appendChild(input);
    }

    input.value=String(value||'');
  }

  function clearFields(){
    checkoutForms().forEach(form=>{
      RESERVATION_HIDDEN_NAMES.forEach(name=>{
        Array.from(
          form.querySelectorAll('input[type="hidden"]')
        )
        .filter(el=>String(el.name||'')===name)
        .forEach(el=>el.remove());
      });
    });
  }

  function installReferralField(){
    const code=String(
      window.FilinReferral?.get?.() || ''
    ).trim();

    if(!code) return;

    checkoutForms().forEach(form=>{
      hidden(
        form,
        'LoyaltyReferralCode',
        code
      );
    });
  }

  function installFields(){
    const r=reservation();

    /*
      Referral is independent from Reward Credit.
      It must survive checkout even when there is NO reward reservation.
    */
    installReferralField();

    if(!r){
      clearFields();
      return;
    }

    checkoutForms().forEach(form=>{
      hidden(
        form,
        'LoyaltyRewardReservationId',
        r.reservationId
      );

      hidden(
        form,
        'LoyaltyRewardReservationSignature',
        r.signature
      );

      hidden(
        form,
        'LoyaltyRewardIds',
        (r.rewards||[]).map(x=>x.id).join(',')
      );

      hidden(
        form,
        'LoyaltyRewardReservedValue',
        money(r.totalRewardCents||0)
      );
    });
  }

  function show(){
    const root=document.getElementById('filin-checkout-root');
    if(!root) return;

    const summary=root.querySelector('.flx-order-totals');
    if(!summary) return;

    const r=reservation();

    let row=summary.querySelector('.flx-loyalty-secure-row');
    let note=summary.querySelector('.flx-loyalty-secure-note');

    if(!r){
      row?.remove();
      note?.remove();
      return;
    }

    const totalRow=summary.querySelector('.flx-order-row.is-total');

    if(!row){
      row=document.createElement('div');
      row.className='flx-loyalty-secure-row';

      if(totalRow){
        summary.insertBefore(row,totalRow);
      }else{
        summary.appendChild(row);
      }
    }

    row.innerHTML=
      '<span>Reward Credit reserved</span>'+
      '<strong>Up to '+money(r.totalRewardCents||0)+'</strong>';

    if(adapterReady()){
      note?.remove();
      return;
    }

    if(!note){
      note=document.createElement('div');
      note.className='flx-loyalty-secure-note';

      if(totalRow){
        summary.insertBefore(note,totalRow);
      }else{
        summary.appendChild(note);
      }
    }

    note.textContent=
      'Secure payment adapter is not connected. '+
      'Checkout is intentionally blocked only at the final payment step '+
      'while Reward Credit is reserved, preventing an incorrect charge.';
  }

  function isNativeCheckoutForm(form){
    if(!form) return false;

    if(form===window.FilinCheckout?.nativeForm){
      return true;
    }

    return Boolean(
      form.closest(
        '.t706,'+
        '.t706__cartwin,'+
        '.t706__cartpage,'+
        '[data-record-type="706"]'
      )
    );
  }

  function isPaymentClick(target){
    if(!target || !target.closest) return false;

    const button=target.closest(
      '.flx-pay,'+
      '.t-submit,'+
      'button[type="submit"],'+
      'input[type="submit"]'
    );

    if(!button) return false;

    if(
      button.classList.contains('flx-pay') &&
      button.closest('#filin-checkout-root')
    ){
      return true;
    }

    return isNativeCheckoutForm(
      button.closest('form')
    );
  }

  function block(event){
    if(
      !reservation() ||
      adapterReady()
    ){
      return;
    }

    if(event.type==='click'){
      if(!isPaymentClick(event.target)){
        return;
      }
    }

    if(event.type==='submit'){
      if(!isNativeCheckoutForm(event.target)){
        return;
      }
    }

    event.preventDefault();
    event.stopPropagation();
    event.stopImmediatePropagation();

    alert(
      'Reward Credit is reserved, but the secure payment adapter is not connected. '+
      'Remove the reservation or contact Filin Labs before payment.'
    );

    return false;
  }

  let scheduled=false;

  function refresh(){
    if(scheduled) return;

    scheduled=true;

    requestAnimationFrame(()=>{
      scheduled=false;
      installFields();
      show();
    });
  }

  document.addEventListener('click',block,true);
  document.addEventListener('submit',block,true);

  const observer=new MutationObserver(refresh);

  observer.observe(
    document.documentElement,
    {
      childList:true,
      subtree:true
    }
  );

  document.addEventListener(
    'filinCheckoutReady',
    refresh
  );

  window.addEventListener(
    'pageshow',
    refresh
  );

  if(document.readyState==='loading'){
    document.addEventListener(
      'DOMContentLoaded',
      refresh,
      {once:true}
    );
  }else{
    refresh();
  }

  console.info(
    '[Filin Labs] Checkout Resonance Secure Bridge V34.1 ready'
  );
})();


/* FILIN LABS — Profile → Checkout Address Bridge V2 */

(function(){
'use strict';
if(window.__FILIN_PROFILE_CHECKOUT_BRIDGE_V2__)return;window.__FILIN_PROFILE_CHECKOUT_BRIDGE_V2__=true;
if((String(location.pathname||'/').replace(/\/+$/,'')||'/')!='/checkout')return;
const clean=v=>String(v||'').replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();const norm=v=>clean(v).toLowerCase();const safeEmail=t=>{const m=String(t||'').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);return m?m[0]:''};
const addressKey=e=>'filin_account_shipping_v1::'+encodeURIComponent(norm(e)||'anonymous');
function emailSync(){const values=[];try{['filin_checkout_email_v31','filin_checkout_email_v30','filin_checkout_email_v29','filin_checkout_email_v28'].forEach(k=>values.push(sessionStorage.getItem(k)||''))}catch(e){}const f=window.FilinCheckout?.nativeForm;f?.querySelectorAll('input').forEach(i=>{const d=norm([i.name,i.id,i.type,i.placeholder,i.autocomplete].filter(Boolean).join(' '));if(/email|e-mail|login/.test(d))values.push(i.value||'')});document.querySelectorAll('.tilda-members-userbar,.tilda-members-userbar__popup,.t-members-userbar,[class*="members-userbar"]').forEach(x=>values.push(x.textContent||'',x.getAttribute?.('data-email')||''));for(const v of values){const e=safeEmail(v);if(e&&norm(e)!=='shop@filinlabs.com')return e}try{const p=JSON.parse(localStorage.getItem('filin_member_profile_last_v2')||'');if(p?.email)return p.email}catch(e){}return''}
function readAddress(email){try{return JSON.parse(localStorage.getItem(addressKey(email))||'')||null}catch(e){return null}}
function desc(m){return norm([m?.desc,m?.label,m?.clone?.name,m?.clone?.id,m?.clone?.placeholder,m?.clone?.autocomplete,m?.original?.name,m?.original?.id,m?.original?.placeholder,m?.original?.autocomplete].filter(Boolean).join(' '))}
function valueFor(m,a){const d=desc(m);if(/last name|family-name|surname/.test(d))return a.lastName||'';if(/first name|given-name|your name/.test(d))return a.firstName||'';if(/\bname\b/.test(d)&&!/last name|family-name|country name|cardholder|company/.test(d))return clean([a.firstName,a.lastName].filter(Boolean).join(' '));if(/phone|telephone|mobile|\btel\b/.test(d))return a.phone||'';if(/country|country-name/.test(d))return a.country||'';if(/postal|postcode|zip/.test(d))return a.postalCode||'';if(/\bcity\b|address-level2|town/.test(d))return a.city||'';if(/apartment|suite|unit|address-line2/.test(d))return a.apartment||'';if(/comment|instruction|delivery note/.test(d))return a.comment||'';if(/address|street|address-line1/.test(d))return a.address||'';return''}
function setMirror(m,v,overwrite=false){v=clean(v);if(!v||!m?.clone)return false;if(!overwrite&&clean(m.clone.value))return false;m.clone.value=v;m.clone.dispatchEvent(new Event('input',{bubbles:true}));m.clone.dispatchEvent(new Event('change',{bubbles:true}));if(m.original){if(overwrite||!clean(m.original.value))m.original.value=v;m.original.dispatchEvent(new Event('input',{bubbles:true}));m.original.dispatchEvent(new Event('change',{bubbles:true}))}return true}
function applyAddress(a,overwrite=false){const FC=window.FilinCheckout;if(!FC?.ready||!Array.isArray(FC.mirrors)||!a)return 0;let n=0;FC.mirrors.filter(m=>m.kind==='shipping').forEach(m=>{const v=valueFor(m,a);if(v&&setMirror(m,v,overwrite))n++});try{FC.syncAll?.()}catch(e){}return n}
function text(a){return[clean([a.firstName,a.lastName].filter(Boolean).join(' ')),clean(a.phone),clean([a.address,a.apartment].filter(Boolean).join(', ')),clean([a.postalCode,a.city].filter(Boolean).join(' ')),clean(a.country)].filter(Boolean).join('<br>')}
function panel(){return window.FilinCheckout?.root?.querySelector('.flx-step[data-step="customer"] .flx-step-panel')}
function render(email,a){const p=panel();if(!p)return;document.getElementById('filin-checkout-profile-address')?.remove();const box=document.createElement('div');box.id='filin-checkout-profile-address';if(a){box.innerHTML='<div class="flcpa-label">SAVED SHIPPING INFORMATION</div><strong>Address from My Information</strong><div class="flcpa-address">'+text(a)+'</div><div class="flcpa-actions"><button class="flcpa-btn" type="button" data-use>USE THIS ADDRESS</button><a class="flcpa-btn secondary" href="/members/profile/#filin-profile-shipping">EDIT SHIPPING INFORMATION</a></div>';box.querySelector('[data-use]')?.addEventListener('click',()=>{applyAddress(a,true);window.FilinCheckout?.openStep?.('shipping',true)})}else{box.innerHTML='<div class="flcpa-label">SHIPPING INFORMATION</div><strong>No saved address yet</strong><div class="flcpa-address">You can enter an address now or save one in My Information for future checkouts.</div><div class="flcpa-actions"><a class="flcpa-btn secondary" href="/members/profile/#filin-profile-shipping">OPEN MY INFORMATION</a></div>'}const auth=p.querySelector('.flx-auth');if(auth)auth.insertAdjacentElement('afterend',box);else p.prepend(box)}
function bridge(){const FC=window.FilinCheckout;if(!FC?.ready)return false;const email=emailSync();if(!email)return false;const a=readAddress(email);if(a)applyAddress(a,false);render(email,a);return true}
function schedule(){if(bridge())return;let n=0;const t=setInterval(()=>{n++;if(bridge()||n>=40)clearInterval(t)},400)}
document.addEventListener('filinCheckoutReady',()=>setTimeout(schedule,80),{once:true});if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',schedule,{once:true});else schedule();window.addEventListener('pageshow',()=>setTimeout(schedule,300));
console.info('[Filin Labs] Profile → Checkout Address Bridge V2 ready');
})();


/* FILIN LABS — Checkout Hidden Deduper V1 */

(function(){

  'use strict';

  if(
    (String(location.pathname || '/').replace(/\/+$/,'') || '/')
    !== '/checkout'
  ){
    return;
  }

  if(window.__FILIN_CHECKOUT_HIDDEN_DEDUPE_V1__){
    return;
  }

  window.__FILIN_CHECKOUT_HIDDEN_DEDUPE_V1__ = true;


  function getForm(){

    return (
      window.FilinCheckout?.nativeForm ||

      document.querySelector(
        '.t706 form,' +
        '.t706__cartwin form,' +
        '.t706__cartpage form,' +
        '[data-record-type="706"] form'
      )
    );

  }


  function hiddenByName(form, name){

    return Array.from(
      form.querySelectorAll('input[type="hidden"]')
    ).filter(function(input){

      return String(input.name || '') === name;

    });

  }


  function removeExactDuplicates(form){

    let removed = 0;


    /* ==========================================================
       1. TILDA FORM SERVICES

       Несколько РАЗНЫХ formservices[] нужны.
       Удаляем только одинаковый service ID.
       ========================================================== */

    const servicesSeen = new Set();

    hiddenByName(
      form,
      'formservices[]'
    ).forEach(function(input){

      const value =
        String(input.value || '').trim();

      if(!value){
        return;
      }

      if(servicesSeen.has(value)){

        input.remove();

        removed++;

        return;

      }

      servicesSeen.add(value);

    });


    /* ==========================================================
       2. FORM NAME

       Должен остаться один:
       tildaspec-formname = Cart
       ========================================================== */

    const formNames =
      hiddenByName(
        form,
        'tildaspec-formname'
      );

    if(formNames.length > 1){

      const preferredValue =
        formNames
          .map(function(input){
            return String(input.value || '').trim();
          })
          .find(Boolean) || 'Cart';

      formNames[0].value =
        preferredValue;

      formNames
        .slice(1)
        .forEach(function(input){

          input.remove();

          removed++;

        });

    }


    /* ==========================================================
       3. LOYALTY REFERRAL CODE

       Оставляем только один экземпляр.
       ========================================================== */

    const referrals =
      hiddenByName(
        form,
        'LoyaltyReferralCode'
      );

    if(referrals.length > 1){

      const referralValue =
        referrals
          .map(function(input){
            return String(input.value || '').trim();
          })
          .find(Boolean) || '';

      referrals[0].value =
        referralValue;

      referrals
        .slice(1)
        .forEach(function(input){

          input.remove();

          removed++;

        });

    }


    if(removed){

      console.info(
        '[Filin Labs] Checkout hidden duplicates removed:',
        removed
      );

    }


    return true;

  }


  function normalize(){

    const form =
      getForm();

    if(!form){
      return false;
    }

    return removeExactDuplicates(
      form
    );

  }


  function start(){

    /*
      Checkout формируется динамически.
      Поэтому несколько секунд ждём все существующие bridges.
    */

    let tries = 0;

    const timer =
      setInterval(function(){

        tries++;

        normalize();

        if(tries >= 80){

          clearInterval(
            timer
          );

        }

      },250);


    /*
      Если другой checkout bridge позднее снова добавит поля,
      дубль будет сразу удалён.
    */

    const observer =
      new MutationObserver(function(){

        normalize();

      });

    observer.observe(
      document.documentElement,
      {
        childList:true,
        subtree:true
      }
    );


    /*
      Последняя проверка непосредственно перед submit.
    */

    document.addEventListener(
      'submit',
      function(event){

        const form =
          getForm();

        if(
          form &&
          (
            event.target === form ||
            form.contains(event.target)
          )
        ){

          normalize();

        }

      },
      true
    );


    document.addEventListener(
      'click',
      function(event){

        const button =
          event.target?.closest?.(
            'button,' +
            'input[type="submit"],' +
            '.t-submit'
          );

        if(button){

          normalize();

        }

      },
      true
    );


    normalize();


    console.info(
      '[Filin Labs] Checkout Hidden Deduper V1 ready'
    );

  }


  if(
    document.readyState === 'loading'
  ){

    document.addEventListener(
      'DOMContentLoaded',
      start,
      {once:true}
    );

  }else{

    start();

  }

})();


/* FILIN LABS — Checkout Referral Estimate V1.2 */

(function(){
  'use strict';

  if((String(location.pathname||'/').replace(/\/+$/,'')||'/')!=='/checkout') return;
  if(window.__FILIN_CHECKOUT_REFERRAL_ESTIMATE_V1_2__) return;
  window.__FILIN_CHECKOUT_REFERRAL_ESTIMATE_V1_2__=true;

  const REF_KEY='filin_resonance_referral_v1';
  const MIN_ORDER_USD=350;
  const FRIEND_DISCOUNT_USD=35;

  const OWN_FIELDS=[
    'Referral Checkout Estimate Status',
    'Referral Checkout Estimated Discount',
    'Referral Checkout Estimated Final Amount',
    'Referral Checkout Original Amount',
    'Referral Benefit Requested'
  ];

  function clean(v){
    return String(v==null?'':v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();
  }

  function num(v){
    const n=Number(String(v==null?0:v).replace(/[^0-9.-]/g,''));
    return Number.isFinite(n)?n:0;
  }

  function money(v){
    return new Intl.NumberFormat(
      'en-US',
      {
        style:'currency',
        currency:'USD',
        minimumFractionDigits:0,
        maximumFractionDigits:0
      }
    ).format(Math.max(0,Number(v)||0));
  }

  function referralCode(){
    try{
      const fromApi=clean(window.FilinReferral?.get?.());
      if(fromApi) return fromApi.toUpperCase();
    }catch(e){}

    try{
      const saved=JSON.parse(localStorage.getItem(REF_KEY)||'null');
      const code=clean(saved&&saved.code);
      if(code) return code.toUpperCase();
    }catch(e){}

    return '';
  }

  function products(){
    return Array.isArray(window.tcart?.products)
      ? window.tcart.products.filter(p=>p && p.deleted!=='yes')
      : [];
  }

  function merchandiseSubtotal(){
    return products().reduce((sum,p)=>{
      const q=Math.max(1,Math.round(num(p.quantity||p.qty||1)));
      const price=num(p.price||p.unitprice||p.baseprice||0);
      return sum+(price*q);
    },0);
  }

  function forms(){
    const set=new Set();

    document.querySelectorAll(
      '.t706 form,'+
      '.t706__cartwin form,'+
      '.t706__cartpage form,'+
      '[data-record-type="706"] form,'+
      '#flcart-native-host form'
    ).forEach(f=>set.add(f));

    if(window.FilinCheckout?.nativeForm){
      set.add(window.FilinCheckout.nativeForm);
    }

    return Array.from(set);
  }

  function hidden(form,name,value){
    if(!form) return;

    let input=Array.from(
      form.querySelectorAll('input[type="hidden"]')
    ).find(el=>String(el.name||'')===name);

    if(!input){
      input=document.createElement('input');
      input.type='hidden';
      input.name=name;
      input.dataset.filinReferralEstimate='1';
      form.appendChild(input);
    }

    input.value=String(value==null?'':value);
  }

  function clearOwnFields(){
    forms().forEach(form=>{
      OWN_FIELDS.forEach(name=>{
        Array.from(form.querySelectorAll('input[type="hidden"]'))
          .filter(el=>String(el.name||'')===name)
          .forEach(el=>el.remove());
      });
    });
  }

  function syncFields(state){
    forms().forEach(form=>{
      hidden(form,'Referral Benefit Requested',state.code ? 'Yes' : 'No');
      hidden(form,'Referral Checkout Estimate Status',state.status);
      hidden(form,'Referral Checkout Original Amount',money(state.baseTotal));

      if(state.discount>0){
        hidden(form,'Referral Checkout Estimated Discount',money(state.discount));
        hidden(form,'Referral Checkout Estimated Final Amount',money(state.estimatedTotal));
      }else{
        hidden(form,'Referral Checkout Estimated Discount','$0');
        hidden(form,'Referral Checkout Estimated Final Amount',money(state.baseTotal));
      }
    });
  }

  function restoreTotal(totalRow,totalEl){
    if(!totalEl) return;

    const previousEstimate=num(totalEl.dataset.filinReferralEstimated||0);
    const base=num(totalEl.dataset.filinReferralBase||0);

    if(previousEstimate>0 && base>0){
      const current=num(totalEl.textContent);
      if(Math.abs(current-previousEstimate)<0.01){
        totalEl.textContent=money(base);
      }
    }

    if(totalRow){
      const label=totalRow.querySelector('span');
      if(label && label.dataset.filinReferralBaseLabel){
        label.textContent=label.dataset.filinReferralBaseLabel;
      }
    }

    delete totalEl.dataset.filinReferralEstimated;
  }

  function render(){
    const root=document.getElementById('filin-checkout-root');
    if(!root) return false;

    const totals=root.querySelector('.flx-order-totals');
    const totalRow=totals?.querySelector('.flx-order-row.is-total');
    const totalEl=totalRow?.querySelector('[data-sum="total"]');
    const subtotalEl=totals?.querySelector('[data-sum="subtotal"]');
    const shippingEl=totals?.querySelector('[data-sum="shipping"]');
    const discountEl=totals?.querySelector('[data-sum="discount"]');

    if(!totals || !totalRow || !totalEl) return false;

    const oldRow=totals.querySelector('.flx-referral-estimate-row');
    const oldNote=totals.querySelector('.flx-referral-estimate-note');

    const code=referralCode();
    const merchandise=merchandiseSubtotal();

    if(!code){
      oldRow?.remove();
      oldNote?.remove();
      restoreTotal(totalRow,totalEl);
      clearOwnFields();
      return true;
    }

    const discountText=clean(discountEl?.textContent||'None');
    const anotherDiscount=
      discountText &&
      !/^none$/i.test(discountText) &&
      !/^0(?:\.00)?$/.test(discountText);

    const candidate=merchandise>=MIN_ORDER_USD;
    const canEstimate=candidate && !anotherDiscount;

    /*
      V1.1:
      Never use the visible Total as the referral base because that Total may
      already contain our previous referral estimate (or a stale checkout
      snapshot). Using it again would subtract the $35 benefit twice.

      The authoritative client-side estimate base is the currently rendered
      checkout subtotal, plus a numeric shipping amount when one is present.
      If Checkout Core has not rendered subtotal yet, fall back to the live
      merchandise subtotal from window.tcart.products.
    */
    const renderedSubtotal=num(subtotalEl?.textContent||0);
    const renderedShipping=num(shippingEl?.textContent||0);

    let baseTotal=
      (renderedSubtotal>0 ? renderedSubtotal : merchandise) +
      Math.max(0,renderedShipping);

    baseTotal=Math.round(baseTotal*100)/100;
    totalEl.dataset.filinReferralBase=String(baseTotal);

    const estimatedTotal=Math.max(
      0,
      Math.round(
        (
          baseTotal-
          (canEstimate?FRIEND_DISCOUNT_USD:0)
        )*100
      )/100
    );

    let row=oldRow;
    if(!row){
      row=document.createElement('div');
      row.className='flx-order-row flx-referral-estimate-row';
      totals.insertBefore(row,totalRow);
    }

    let note=oldNote;
    if(!note){
      note=document.createElement('div');
      note.className='flx-referral-estimate-note';
      totals.insertBefore(note,totalRow);
    }

    if(!candidate){
      row.innerHTML=
        '<span>Referral friend benefit</span>'+
        '<strong>Order minimum '+money(MIN_ORDER_USD)+'</strong>';

      note.innerHTML=
        '<strong>Referral code '+code+' detected.</strong> '+
        'The $35 friend benefit requires at least $350 of eligible merchandise.';

      restoreTotal(totalRow,totalEl);

      syncFields({
        code,
        status:'Below $350 minimum — server verification still authoritative',
        discount:0,
        baseTotal,
        estimatedTotal:baseTotal
      });

      return true;
    }

    if(anotherDiscount){
      row.innerHTML=
        '<span>Referral friend benefit</span>'+
        '<strong>Pending confirmation</strong>';

      note.innerHTML=
        '<strong>Referral code '+code+' detected.</strong> '+
        'Another discount is already present. Final stacking eligibility is verified server-side after order submission.';

      restoreTotal(totalRow,totalEl);

      syncFields({
        code,
        status:'Pending server verification — another discount detected',
        discount:0,
        baseTotal,
        estimatedTotal:baseTotal
      });

      return true;
    }

    row.innerHTML=
      '<span>Referral friend benefit</span>'+
      '<strong>−'+money(FRIEND_DISCOUNT_USD)+'</strong>';

    note.innerHTML=
      '<strong>Referral code '+code+' detected.</strong> '+
      'Estimated $35 friend benefit for a first eligible order of $350+. '+
      'Final eligibility and the amount to be charged are verified server-side after order submission.';

    const label=totalRow.querySelector('span');
    if(label){
      if(!label.dataset.filinReferralBaseLabel){
        label.dataset.filinReferralBaseLabel=clean(label.textContent)||'Total';
      }
      label.textContent='Amount to be confirmed';
    }

    if(Math.abs(num(totalEl.textContent)-estimatedTotal)>0.01){
      totalEl.textContent=money(estimatedTotal);
    }
    totalEl.dataset.filinReferralEstimated=String(estimatedTotal);

    syncFields({
      code,
      status:'Estimated — pending server verification',
      discount:FRIEND_DISCOUNT_USD,
      baseTotal,
      estimatedTotal
    });

    return true;
  }

  let scheduled=false;

  function schedule(){
    if(scheduled) return;
    scheduled=true;

    requestAnimationFrame(()=>{
      scheduled=false;
      render();
    });
  }

  document.addEventListener('filinCheckoutReady',()=>setTimeout(schedule,80));
  document.addEventListener('input',schedule,true);
  document.addEventListener('change',schedule,true);
  window.addEventListener('pageshow',()=>setTimeout(schedule,250));

  const observer=new MutationObserver(schedule);
  observer.observe(
    document.documentElement,
    {childList:true,subtree:true}
  );

  if(document.readyState==='loading'){
    document.addEventListener('DOMContentLoaded',schedule,{once:true});
  }else{
    schedule();
  }

  /*
    Last safety sync immediately before PLACE ORDER.
    We do NOT alter Tilda product/price fields.
  */
  document.addEventListener(
    'click',
    function(event){
      if(event.target.closest?.('.flx-pay,.t-submit,button[type="submit"],input[type="submit"]')){
        render();
      }
    },
    true
  );

  console.info('[Filin Labs] Checkout Referral Estimate V1.2 ready');
})();
