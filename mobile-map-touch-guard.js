(() => {
  const ACTIVATED_KEY = 'taiwan-construction-map-touch-enabled-session';
  const TEXT = {
    zh: {
      title: '先順滑瀏覽，需要時再移動地圖',
      body: '手機版預設保留頁面滑動；點一下後就能拖曳、縮放地圖。工程清單與搜尋仍可直接使用。',
      action: '啟用地圖移動'
    },
    en: {
      title: 'Scroll first, move the map when you need it',
      body: 'On mobile, page scrolling stays smooth by default. Tap once to pan and zoom the map. Search and project cards still work right away.',
      action: 'Enable map move'
    }
  };

  const isMobile = () => window.matchMedia('(max-width: 900px), (pointer: coarse)').matches;
  const lang = () => document.documentElement.lang === 'en' ? 'en' : 'zh';
  const t = key => (TEXT[lang()] || TEXT.zh)[key];

  const ensureStyle = () => {
    if (document.getElementById('tcm-mobile-touch-guard-style')) return;
    const style = document.createElement('style');
    style.id = 'tcm-mobile-touch-guard-style';
    style.textContent = `
      .tcm-touch-guard{position:absolute;inset:0;z-index:850;display:none;align-items:flex-end;justify-content:center;padding:18px;pointer-events:auto;background:linear-gradient(180deg,rgba(8,20,34,0.02),rgba(8,20,34,0.28));}
      .tcm-touch-guard-card{width:min(100%,420px);padding:14px 14px 12px;border-radius:22px;background:rgba(255,255,255,.96);box-shadow:0 18px 42px rgba(0,0,0,.24);border:1px solid rgba(15,42,68,.12);color:#102131;}
      .tcm-touch-guard-card strong{display:block;font-size:15px;line-height:1.35;margin-bottom:5px;}
      .tcm-touch-guard-card p{margin:0 0 10px;font-size:13px;line-height:1.55;color:#526579;}
      .tcm-touch-guard-card button{width:100%;min-height:42px;border:0;border-radius:999px;background:#102131;color:#fff;font-weight:900;letter-spacing:.02em;}
      .tcm-touch-enabled .tcm-touch-guard{display:none!important;}
      @media(max-width:900px),(pointer:coarse){.map-frame.mvp-leaflet-ready:not(.tcm-touch-enabled) .tcm-touch-guard{display:flex;}}
    `;
    document.head.append(style);
  };

  const setCopy = guard => {
    const title = guard.querySelector('[data-touch-title]');
    const body = guard.querySelector('[data-touch-body]');
    const action = guard.querySelector('[data-touch-action]');
    if (title) title.textContent = t('title');
    if (body) body.textContent = t('body');
    if (action) action.textContent = t('action');
  };

  const enableMapTouch = frame => {
    frame.classList.add('tcm-touch-enabled');
    try { sessionStorage.setItem(ACTIVATED_KEY, 'yes'); } catch {}
  };

  const apply = () => {
    ensureStyle();
    const frame = document.querySelector('.map-frame');
    const map = document.querySelector('#map');
    if (!frame || !map || !isMobile()) return false;
    if (frame.querySelector('.tcm-touch-guard')) {
      setCopy(frame.querySelector('.tcm-touch-guard'));
      return true;
    }
    if (sessionStorage.getItem(ACTIVATED_KEY) === 'yes') {
      frame.classList.add('tcm-touch-enabled');
      return true;
    }
    const guard = document.createElement('div');
    guard.className = 'tcm-touch-guard';
    guard.setAttribute('role', 'button');
    guard.setAttribute('tabindex', '0');
    guard.innerHTML = `<div class="tcm-touch-guard-card"><strong data-touch-title></strong><p data-touch-body></p><button type="button" data-touch-action></button></div>`;
    setCopy(guard);
    const activate = event => {
      event.preventDefault();
      enableMapTouch(frame);
    };
    guard.addEventListener('click', activate);
    guard.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') activate(event);
    });
    map.append(guard);
    return true;
  };

  const boot = () => {
    apply();
    new MutationObserver(apply).observe(document.documentElement, { attributes: true, attributeFilter: ['lang', 'class'] });
    new MutationObserver(apply).observe(document.body, { childList: true, subtree: true });
    window.addEventListener('resize', apply, { passive: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot, { once: true });
  else boot();
})();
