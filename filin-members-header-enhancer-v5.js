/* FILIN LABS — RESONANCE CLUB DESKTOP POCKET + DRAWER V2 */
function loadDrawerCSS() {
  if (document.getElementById('fl-drawer-css')) return;
  var l = document.createElement('link');
  l.id = 'fl-drawer-css'; l.rel = 'stylesheet';
  l.href = 'https://cdn.jsdelivr.net/gh/FilinAudio/442-2@60447550dc53a4923a2cc3f71223e10651d03244/filin-resonance-drawer.css';
  document.head.appendChild(l);
}

(function(){
  'use strict';

  if(window.__FILIN_RESONANCE_WELCOME_V2__) return;
  window.__FILIN_RESONANCE_WELCOME_V2__ = true;

  const CONFIG = {
    DISMISS_KEY: 'filin_resonance_welcome_dismissed_v2',
    SHOW_DELAY: 500,
    DESKTOP_MIN: 981,
    ACCOUNT_URL: '/members/login?redirecturl=account',
    CLUB_URL: '/loyalty-program',
    EXCLUDED_PATHS: ['/loyalty-program']
  };

  const normPath = value => (String(value || '/').replace(/\/+$/,'') || '/');
  const isDesktop = () => window.innerWidth >= CONFIG.DESKTOP_MIN;

  function storageGet(storage,key){
    try{return storage.getItem(key)}catch(e){return null}
  }

  function storageSet(storage,key,value){
    try{storage.setItem(key,value)}catch(e){}
  }

  function isExcluded(){
    const path = normPath(location.pathname);
    return CONFIG.EXCLUDED_PATHS.some(item => path === normPath(item));
  }

  function track(name,params){
    const payload = Object.assign({event_category:'Resonance Club'},params || {});
    try{
      if(typeof window.gtag === 'function'){
        window.gtag('event',name,payload);
      }else{
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push(Object.assign({event:name},payload));
      }
    }catch(e){}
  }

  function markup(){
    return `
      <div id="flrc-welcome-v2" aria-hidden="false">

        <div class="flrc-pocket-wrap" aria-label="Resonance Club $10 off offer">
          <button class="flrc-pocket" type="button" aria-label="Open Resonance Club $10 off offer">
            <span class="flrc-pocket-text">$10 OFF</span>
          </button>
          <button class="flrc-pocket-close" type="button" aria-label="Dismiss Resonance Club offer">×</button>
        </div>

        <div class="flrc-backdrop" aria-hidden="true"></div>

        <aside class="flrc-drawer" role="dialog" aria-modal="true" aria-labelledby="flrc-welcome-title-v2">
          <div class="flrc-top">
            <button class="flrc-close" type="button" aria-label="Close Resonance Club welcome offer">×</button>

            <div class="flrc-logo" aria-label="Filin Labs Resonance Club">
              <svg class="flrc-diamond" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                <path d="M10 15 17 7h14l7 8-14 25L10 15Z" stroke="currentColor" stroke-width="2"/>
                <path d="M10 15h28M17 7l7 33M31 7 24 40M17 7l7 8 7-8" stroke="currentColor" stroke-width="1.6"/>
              </svg>
              <div class="flrc-brand">
                <div class="flrc-brand-main"><strong>RESONANCE</strong> CLUB</div>
                <div class="flrc-brand-sub">Filin Labs member program</div>
              </div>
            </div>
          </div>

          <div class="flrc-body">
            <p class="flrc-kicker">Welcome to Filin Labs</p>

            <h2 class="flrc-title" id="flrc-welcome-title-v2">
              Join <strong>FREE</strong> today and get
              <strong class="flrc-gold">$10 OFF</strong><br>
              your first order over <strong>$500</strong>
            </h2>

            <div class="flrc-rule" aria-hidden="true"></div>

            <p class="flrc-copy">
              Become a <strong>Filin Labs Resonance Club</strong> member and unlock a more rewarding way to shop high-end audio.
            </p>

            <ul class="flrc-benefits">
              <li><span class="flrc-check">✓</span><span>Get the $10 first-order member benefit on an order over $500.</span></li>
              <li><span class="flrc-check">✓</span><span>Collect Resonance Points and access member rewards.</span></li>
              <li><span class="flrc-check">✓</span><span>Keep your rewards and member benefits connected to your Filin Labs account.</span></li>
            </ul>

            <a class="flrc-cta" href="${CONFIG.ACCOUNT_URL}">
              <span>Join Resonance Club</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6"/>
              </svg>
            </a>

            <p class="flrc-note">
              <a href="${CONFIG.CLUB_URL}">Membership terms and reward conditions apply.</a>
            </p>
          </div>
        </aside>
      </div>`;
  }

  function unlockPage(){
    document.documentElement.classList.remove('flrc-welcome-lock');
    if(document.body) document.body.classList.remove('flrc-welcome-lock');
  }

  function lockPage(){
    document.documentElement.classList.add('flrc-welcome-lock');
    if(document.body) document.body.classList.add('flrc-welcome-lock');
  }

  function removeUiWithoutDismiss(){
    const root = document.getElementById('flrc-welcome-v2');
    if(root) root.remove();
    unlockPage();
  }

  function dismissPermanently(root,source){
    if(!root) return;

    storageSet(localStorage,CONFIG.DISMISS_KEY,String(Date.now()));
    track('resonance_club_offer_dismiss',{
      placement:source || 'header_pocket'
    });

    root.classList.add('is-closing');
    root.classList.remove('is-pocket-visible');
    unlockPage();

    setTimeout(()=>{
      if(root && root.parentNode) root.remove();
    },520);
  }

  function openDrawer(root){
    if(!root || root.classList.contains('is-open')) return;

    root.classList.add('is-open');
    root.classList.remove('is-pocket-visible');
    lockPage();

    track('resonance_club_popup_view',{
      placement:'header_pocket'
    });
  }

  function mount(){
    loadDrawerCSS();
    if(!isDesktop()) return;
    if(isExcluded()) return;
    if(storageGet(localStorage,CONFIG.DISMISS_KEY)) return;
    if(document.getElementById('flrc-welcome-v2')) return;
    if(!document.body) return;

    document.body.insertAdjacentHTML('beforeend',markup());

    const root = document.getElementById('flrc-welcome-v2');
    const pocket = root && root.querySelector('.flrc-pocket');
    const pocketClose = root && root.querySelector('.flrc-pocket-close');
    const drawerClose = root && root.querySelector('.flrc-close');
    const cta = root && root.querySelector('.flrc-cta');
    const terms = root && root.querySelector('.flrc-note a');

    if(!root || !pocket || !pocketClose || !drawerClose) return;

    root.classList.add('is-mounted');

    pocket.addEventListener('click',()=>openDrawer(root));
    pocketClose.addEventListener('click',(event)=>{
      event.preventDefault();
      event.stopPropagation();
      dismissPermanently(root,'header_pocket_close');
    });

    drawerClose.addEventListener('click',()=>{
      dismissPermanently(root,'header_drawer_close');
    });

    if(cta){
      cta.addEventListener('click',()=>{
        track('resonance_club_popup_click',{
          placement:'header_drawer',
          destination:CONFIG.ACCOUNT_URL
        });
      });
    }

    if(terms){
      terms.addEventListener('click',()=>{
        track('resonance_club_terms_click',{
          placement:'header_drawer',
          destination:CONFIG.CLUB_URL
        });
      });
    }

    /* Do NOT auto-open the drawer. Only reveal the right-side pocket. */
    setTimeout(()=>{
      if(!document.body.contains(root)) return;
      if(!isDesktop()){
        removeUiWithoutDismiss();
        return;
      }
      if(storageGet(localStorage,CONFIG.DISMISS_KEY)){
        root.remove();
        return;
      }

      root.classList.add('is-pocket-visible');
      track('resonance_club_pocket_view',{placement:'header_pocket'});
    },CONFIG.SHOW_DELAY);
  }

  let resizeTimer = null;
  window.addEventListener('resize',()=>{
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(()=>{
      if(!isDesktop()){
        removeUiWithoutDismiss();
        return;
      }
      if(!document.getElementById('flrc-welcome-v2')) mount();
    },180);
  },{passive:true});

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded',mount,{once:true});
  }else{
    mount();
  }
})();

/* FILIN LABS — MEMBERS HEADER ENHANCER V5 — ORDERLIST SAFE */
(function(){
  'use strict';

  if(window.__FILIN_MEMBERS_HEADER_V5__) return;
  window.__FILIN_MEMBERS_HEADER_V5__ = true;
  window.dataLayer = window.dataLayer || [];

  const clean = value => String(value || '').replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();
  const norm = value => clean(value).toLowerCase();
  const path = value => String(value || '/').replace(/\/+$/,'') || '/';
  const page = () => path(location.pathname);

  /* ORDERLIST SAFE MODE */
  if(page() === '/members/orderlist'){
    function orderlistSafeApply(){
      document.body?.classList.add('filin-members-v3');
      document.querySelectorAll('a[href]').forEach(link=>{
        let url;
        try{ url = new URL(link.getAttribute('href') || link.href, location.origin); }catch(e){ return; }
        if(path(url.pathname) !== '/members') return;
        const text = String(link.textContent || '').replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim().toLowerCase();
        if(text === 'account' || text === 'my account' || text.includes('personal account')) link.href='/account';
      });
    }
    if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',orderlistSafeApply,{once:true});
    else orderlistSafeApply();
    setTimeout(orderlistSafeApply,600);
    setTimeout(orderlistSafeApply,1600);
    setTimeout(orderlistSafeApply,3200);
    return;
  }

  const safeEmail = text => {
    const match = String(text || '').match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    return match ? match[0] : '';
  };
  const profileKey = email => 'filin_member_profile_v2::' + encodeURIComponent(norm(email) || 'unknown');
  const addressKey = email => 'filin_account_shipping_v1::' + encodeURIComponent(norm(email) || 'anonymous');

  function memberPage(){ return /^\/members(?:\/|$)/i.test(page()); }
  function ensureMemberFont(){ if(memberPage()) document.body?.classList.add('filin-members-v3'); }

  function profileInputs(root=document){
    const inputs = Array.from(root.querySelectorAll('input,select,textarea'));
    function descriptor(input){
      return norm([
        input.name,input.id,input.type,input.placeholder,input.autocomplete,input.getAttribute('aria-label'),
        input.closest('label,.t-input-group,div')?.querySelector?.('label')?.textContent
      ].filter(Boolean).join(' '));
    }
    function find(pattern){ return inputs.find(input => pattern.test(descriptor(input)) && clean(input.value)); }
    const emailInput = inputs.find(input => input.type === 'email' && clean(input.value)) || find(/email|e-mail|login/);
    const phoneInput = inputs.find(input => input.type === 'tel' && clean(input.value)) || find(/phone|telephone|mobile/);
    const nameInput = find(/full name|profile name|^name$|\bname\b/);
    return {name:clean(nameInput?.value),email:safeEmail(emailInput?.value),phone:clean(phoneInput?.value)};
  }

  function popupName(){
    const bad = /^(account|my orders|purchased products|edit profile|profile|logout|log out|sign out)$/i;
    return Array.from(document.querySelectorAll('.tilda-members-userbar strong,.tilda-members-userbar__popup strong,.t-members-userbar strong,[class*="members-userbar"] strong,[class*="members-userbar"] b'))
      .map(element=>clean(element.textContent)).find(text=>text && !bad.test(text) && !/@/.test(text)) || '';
  }

  function cacheProfile(){
    if(page() !== '/members/profile') return;
    const profile = profileInputs();
    if(!profile.email) return;
    if(!profile.name) profile.name = popupName();
    try{
      localStorage.setItem(profileKey(profile.email),JSON.stringify(profile));
      localStorage.setItem('filin_member_profile_last_v2',JSON.stringify(profile));
    }catch(e){}
  }

  function rewriteAccount(){
    document.querySelectorAll('a[href]').forEach(link=>{
      let url;
      try{ url = new URL(link.getAttribute('href') || link.href, location.origin); }catch(e){ return; }
      if(path(url.pathname) !== '/members') return;
      const text = norm(link.textContent);
      if(text === 'account' || text === 'my account' || text.includes('personal account')) link.href='/account';
    });
  }

  function currentProfileEmail(){
    const profile = profileInputs();
    if(profile.email) return profile.email;
    try{
      const last = JSON.parse(localStorage.getItem('filin_member_profile_last_v2') || '');
      if(last?.email) return last.email;
    }catch(e){}
    return '';
  }

  function readAddress(email){
    try{ return JSON.parse(localStorage.getItem(addressKey(email)) || '') || {}; }catch(e){ return {}; }
  }
  function writeAddress(email,data){
    try{ localStorage.setItem(addressKey(email),JSON.stringify(data)); return true; }catch(e){ return false; }
  }

  function profileForm(){
    const email = Array.from(document.querySelectorAll('input[type="email"],input')).find(input=>{
      const descriptor = norm([input.type,input.name,input.id,input.placeholder,input.autocomplete].filter(Boolean).join(' '));
      return /email|e-mail|login/.test(descriptor) && safeEmail(input.value);
    });
    return email?.closest('form') || document.querySelector('form');
  }

  function nativeProfileCard(){
    const form = profileForm();
    if(!form) return null;
    let node = form;
    let best = null;
    for(let depth=0; depth<9 && node; depth++){
      if(node.id === 'allrecords') break;
      const rect = node.getBoundingClientRect();
      const style = getComputedStyle(node);
      const background = style.backgroundColor;
      const looksWhite = background === 'rgb(255, 255, 255)' || background === 'rgba(0, 0, 0, 0)' || background === 'transparent';
      if(rect.width >= 500 && rect.width <= window.innerWidth*.9 && rect.height >= 250 && looksWhite) best=node;
      node=node.parentElement;
    }
    return best || form.parentElement || form;
  }

  function alignShippingToProfile(shipping,profileCard){
    if(!shipping || !profileCard || !shipping.parentElement) return;
    const parent = shipping.parentElement;
    const cardRect = profileCard.getBoundingClientRect();
    const parentRect = parent.getBoundingClientRect();
    const width = Math.max(280,cardRect.width);
    const left = Math.max(0,cardRect.left-parentRect.left);
    shipping.style.width=width+'px';
    shipping.style.maxWidth=width+'px';
    shipping.style.marginLeft=left+'px';
    shipping.style.marginRight='0';
  }

  function injectProfileShipping(){
    if(page() !== '/members/profile' || document.getElementById('filin-profile-shipping')) return;
    const email = currentProfileEmail();
    if(!email) return;
    const profile = profileInputs();
    const parts = (profile.name || '').split(/\s+/).filter(Boolean);
    const base = {firstName:parts[0]||'',lastName:parts.slice(1).join(' '),phone:profile.phone||'',country:'',postalCode:'',city:'',address:'',apartment:'',comment:''};
    const data = Object.assign({},base,readAddress(email));
    const section = document.createElement('section');
    section.id='filin-profile-shipping';
    section.innerHTML = '<h2>Shipping Information</h2><div class="flps-grid"><div class="flps-field"><label>First name</label><input data-flps="firstName" autocomplete="given-name"></div><div class="flps-field"><label>Last name</label><input data-flps="lastName" autocomplete="family-name"></div><div class="flps-field"><label>Phone</label><input data-flps="phone" autocomplete="tel"></div><div class="flps-field"><label>Country</label><input data-flps="country" autocomplete="country-name"></div><div class="flps-field"><label>Postal code</label><input data-flps="postalCode" autocomplete="postal-code"></div><div class="flps-field"><label>City</label><input data-flps="city" autocomplete="address-level2"></div><div class="flps-field flps-wide"><label>Street address</label><input data-flps="address" autocomplete="street-address"></div><div class="flps-field"><label>Apartment / suite</label><input data-flps="apartment" autocomplete="address-line2"></div><div class="flps-field"><label>Delivery comment</label><textarea data-flps="comment"></textarea></div><div class="flps-actions"><button type="button" data-flps-save>Save</button><button class="secondary" type="button" data-flps-clear>Clear</button></div><div class="flps-status"></div></div>';
    Object.entries(data).forEach(([key,value])=>{ const field=section.querySelector('[data-flps="'+key+'"]'); if(field) field.value=value||''; });
    const card=nativeProfileCard();
    if(card?.parentNode){
      card.parentNode.insertBefore(section,card.nextSibling);
      alignShippingToProfile(section,card);
      window.addEventListener('resize',()=>alignShippingToProfile(section,card),{passive:true});
    }else{
      (document.getElementById('allrecords')||document.body).appendChild(section);
    }
    section.querySelector('[data-flps-save]')?.addEventListener('click',function(){
      const next={updatedAt:new Date().toISOString()};
      ['firstName','lastName','phone','country','postalCode','city','address','apartment','comment'].forEach(key=>{ next[key]=clean(section.querySelector('[data-flps="'+key+'"]')?.value); });
      writeAddress(email,next);
      section.querySelector('.flps-status').textContent='Saved.';
    });
    section.querySelector('[data-flps-clear]')?.addEventListener('click',function(){
      try{ localStorage.removeItem(addressKey(email)); }catch(e){}
      section.querySelectorAll('input,textarea').forEach(field=>{field.value='';});
      section.querySelector('.flps-status').textContent='Cleared.';
    });
  }

  function emptyType(){
    if(page() === '/members/orderlist') return 'orders';
    if(page() === '/members/purchased-products') return 'purchased';
    return '';
  }

  function hasEmptyState(type){
    const text=norm(document.body?.innerText);
    if(type === 'orders') return /you don.?t have any orders yet|no orders yet/.test(text);
    return /you don.?t have any purchased products yet|no purchased products/.test(text);
  }

  async function catalogImage(){
    try{
      const response=await fetch('/catalog?filin_members_cta=3',{credentials:'same-origin',cache:'force-cache'});
      if(!response.ok) return '';
      const html=await response.text();
      const doc=new DOMParser().parseFromString(html,'text/html');
      let url=doc.querySelector('meta[property="og:image"],meta[name="twitter:image"]')?.content || '';
      if(!url){
        const image=Array.from(doc.querySelectorAll('img')).find(element=>{
          const src=element.getAttribute('data-original')||element.getAttribute('data-src')||element.getAttribute('src')||'';
          return src && !/logo|icon|svg/i.test(src);
        });
        url=image?.getAttribute('data-original')||image?.getAttribute('data-src')||image?.getAttribute('src')||'';
      }
      return url ? new URL(url,location.origin).href : '';
    }catch(e){ return ''; }
  }

  async function injectCatalog(){
    const type=emptyType();
    if(!type || !hasEmptyState(type) || document.getElementById('filin-members-catalog-v3')) return;
    const section=document.createElement('section');
    section.id='filin-members-catalog-v3';
    const title=type==='orders' ? 'Browse Filin Labs Catalogue' : 'Discover More Boutique Audio';
    const copy=type==='orders' ? 'Your order history is empty for now. Browse the complete catalogue and find your next system upgrade.' : 'No purchased products are linked to this account yet. Browse the Filin Labs catalogue to discover your next component.';
    section.innerHTML='<a class="flmc-card" href="https://filinlabs.com/catalog"><div class="flmc-media"><div class="flmc-fallback">FILIN LABS</div></div><div class="flmc-copy"><small>CATALOGUE</small><h2>'+title+'</h2><p>'+copy+'</p><span class="flmc-btn">BROWSE CATALOGUE →</span></div></a>';
    const allrecords=document.getElementById('allrecords')||document.body;
    const footer=Array.from(allrecords.querySelectorAll('.t-rec')).find(record=>{ const text=norm(record.innerText); return text.includes('shipping & payment') && text.includes('legal information'); });
    if(footer?.parentNode) footer.parentNode.insertBefore(section,footer); else allrecords.appendChild(section);
    const imageURL=await catalogImage();
    if(imageURL){
      const media=section.querySelector('.flmc-media');
      const image=document.createElement('img');
      image.alt='Filin Labs catalogue';
      image.src=imageURL;
      image.onload=()=>media.querySelector('.flmc-fallback')?.remove();
      media.appendChild(image);
    }
  }

  function apply(){
    ensureMemberFont();
    rewriteAccount();
    cacheProfile();
    injectProfileShipping();
    injectCatalog();
  }

  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded',apply,{once:true});
  else apply();

  if(memberPage()){
    let queued=false;
    new MutationObserver(function(){
      if(queued) return;
      queued=true;
      requestAnimationFrame(function(){
        queued=false;
        ensureMemberFont();
        rewriteAccount();
        cacheProfile();
        injectProfileShipping();
        injectCatalog();
      });
    }).observe(document.documentElement,{childList:true,subtree:true});
  }else{
    setTimeout(rewriteAccount,600);
    setTimeout(rewriteAccount,1600);
    setTimeout(rewriteAccount,3200);
  }
})();
