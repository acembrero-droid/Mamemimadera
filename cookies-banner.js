// ── MAMEMI Madera · Banner de Cookies ──
(function() {
  // Solo mostrar si no ha aceptado/rechazado todavía
  if (localStorage.getItem('mamemi_cookies')) return;

  const banner = document.createElement('div');
  banner.id = 'cookies-banner';
  banner.innerHTML = `
    <div class="cookie-inner">
      <div class="cookie-icon">🍪</div>
      <div class="cookie-text">
        <p class="cookie-title">¡Usamos cookies!</p>
        <p class="cookie-desc">Usamos cookies técnicas necesarias para que la web funcione y cookies analíticas opcionales para mejorarla. No compartimos tus datos con nadie. <a href="legal.html" target="_blank">Más información</a></p>
      </div>
      <div class="cookie-btns">
        <button class="cookie-btn accept" onclick="acceptCookies()">Aceptar todas</button>
        <button class="cookie-btn reject" onclick="rejectCookies()">Solo necesarias</button>
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
      width: min(680px, calc(100vw - 2rem));
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
      flex-direction: column;
      gap: 0.5rem;
      flex-shrink: 0;
    }
    .cookie-btn {
      border: none;
      border-radius: 30px;
      padding: 0.55rem 1.2rem;
      font-family: 'Nunito', sans-serif;
      font-size: 0.78rem;
      font-weight: 700;
      cursor: pointer;
      letter-spacing: 0.06em;
      transition: all 0.2s;
      white-space: nowrap;
    }
    .cookie-btn.accept {
      background: #8b5e3c;
      color: #fff;
    }
    .cookie-btn.accept:hover { background: #6a9e8a; }
    .cookie-btn.reject {
      background: transparent;
      color: #8b5e3c;
      border: 1.5px solid #d4a96a;
    }
    .cookie-btn.reject:hover { background: #f5e9d6; }
    @media (max-width: 600px) {
      .cookie-inner { flex-direction: column; text-align: center; }
      .cookie-btns { flex-direction: row; justify-content: center; }
    }
  `;

  document.head.appendChild(style);
  document.body.appendChild(banner);

  window.acceptCookies = function() {
    localStorage.setItem('mamemi_cookies', 'all');
    hideBanner();
  };

  window.rejectCookies = function() {
    localStorage.setItem('mamemi_cookies', 'necessary');
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
