// ── MAMEMI Madera · Banner de Cookies ──
(function() {
  const GA_ID = 'G-9MM0BBNL5N';
  const CONSENT_KEY = 'mamemi_cookies_v2'; // clave nueva: la v1 solo cubría cookies técnicas

  function loadGoogleAnalytics() {
    if (window._mamemiGaLoaded) return;
    window._mamemiGaLoaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(script);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function() { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID);
  }

  const consent = localStorage.getItem(CONSENT_KEY);

  // Si ya aceptó antes, cargamos Analytics en cada visita y no mostramos el banner
  if (consent === 'accepted') {
    loadGoogleAnalytics();
    return;
  }
  // Si ya rechazó antes, no mostramos el banner ni cargamos Analytics
  if (consent === 'rejected') return;

  const banner = document.createElement('div');
  banner.id = 'cookies-banner';
  banner.innerHTML = `
    <div class="cookie-inner">
      <div class="cookie-icon">🍪</div>
      <div class="cookie-text">
        <p class="cookie-title">¡Usamos cookies!</p>
        <p class="cookie-desc">Uso cookies técnicas necesarias para que el carrito y la navegación funcionen correctamente, y cookies de análisis (Google Analytics) para saber cómo se usa la web — solo si me das tu permiso. <a href="legal.html#cookies" target="_blank">Más información</a></p>
      </div>
      <div class="cookie-btns">
        <button class="cookie-btn reject" onclick="rejectCookies()">Solo necesarias</button>
        <button class="cookie-btn accept" onclick="acceptCookies()">Aceptar</button>
      </div>
    </div>
  `;
  const style = document.createElement('style');
  style.textContent = `
    #cookies-banner {
      position: fixed;
      bottom: 1.5rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      width: min(660px, calc(100vw - 2rem));
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 8px 40px rgba(90,58,26,0.22);
      border: 1.5px solid #f5e9d6;
      animation: slideUp 0.4s ease;
      font-family: 'Nunito', sans-serif;
    }
    @keyframes slideUp {
      from { opacity: 0; transform: translateX(-50%) translateY(20px); }
      to   { opacity: 1; transform: translateX(-50%) translateY(0); }
    }
    .cookie-inner {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.2rem 1.5rem;
    }
    .cookie-icon {
      font-size: 2.4rem;
      flex-shrink: 0;
      animation: wobble 2s ease-in-out infinite;
    }
    @keyframes wobble {
      0%,100% { transform: rotate(0deg); }
      25%      { transform: rotate(-10deg); }
      75%      { transform: rotate(10deg); }
    }
    .cookie-text { flex: 1; }
    .cookie-title {
      font-size: 0.95rem;
      font-weight: 700;
      color: #5a3a1a;
      margin-bottom: 0.25rem;
    }
    .cookie-desc {
      font-size: 0.78rem;
      color: #6b4c2a;
      line-height: 1.6;
      font-weight: 300;
    }
    .cookie-desc a {
      color: #6a9e8a;
      text-decoration: underline;
    }
    .cookie-btns {
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
    }
    .cookie-btn {
      border: none;
      border-radius: 30px;
      padding: 0.55rem 1.2rem;
      font-family: 'Nunito', sans-serif;
      font-size: 0.76rem;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.04em;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .cookie-btn.reject {
      background: transparent;
      color: #8b5e3c;
      border: 1.5px solid #d4a96a;
    }
    .cookie-btn.reject:hover { background: #f5e9d6; }
    .cookie-btn.accept {
      background: #8b5e3c;
      color: #fff;
    }
    .cookie-btn.accept:hover { background: #6a9e8a; }
    @media (max-width: 600px) {
      .cookie-inner { flex-direction: column; text-align: center; }
      .cookie-btns { justify-content: center; }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(banner);

  window.acceptCookies = function() {
    localStorage.setItem(CONSENT_KEY, 'accepted');
    loadGoogleAnalytics();
    hideBanner();
  };
  window.rejectCookies = function() {
    localStorage.setItem(CONSENT_KEY, 'rejected');
    hideBanner();
  };
  function hideBanner() {
    const b = document.getElementById('cookies-banner');
    if (b) {
      b.style.animation = 'none';
      b.style.opacity = '0';
      b.style.transform = 'translateX(-50%) translateY(20px)';
      b.style.transition = 'all 0.3s ease';
      setTimeout(() => b.remove(), 300);
    }
  }
})();
