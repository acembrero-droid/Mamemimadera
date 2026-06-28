// ── MAMEMI Madera · Consentimiento de cookies (Google Analytics) ──
// Este script sustituye al <script> de gtag.js pegado directamente en el HTML.
// Google Analytics es una cookie de análisis, NO técnica: solo puede cargarse
// si el visitante da su consentimiento explícito. Este banner se encarga de eso.
(function() {

  const CONSENT_KEY = 'mamemi_cookie_consent';
  const GA_ID = 'G-9MM0BBNL5N';

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

  function injectStyles() {
    const style = document.createElement('style');
    style.textContent = `
      #cookie-consent-banner {
        position: fixed;
        left: 0; right: 0; bottom: 0;
        z-index: 2000;
        background: #fdf8f0;
        border-top: 1.5px solid #f5e9d6;
        box-shadow: 0 -4px 24px rgba(90,58,26,0.15);
        padding: 1rem 1.5rem;
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        font-family: 'Nunito', sans-serif;
      }
      #cookie-consent-banner p {
        margin: 0;
        font-size: 0.82rem;
        color: #6b4c2a;
        line-height: 1.6;
        flex: 1;
        min-width: 220px;
      }
      #cookie-consent-banner a {
        color: #6a9e8a;
        font-weight: 700;
        text-decoration: underline;
      }
      .cookie-consent-buttons {
        display: flex;
        gap: 0.6rem;
        flex-shrink: 0;
      }
      .cookie-consent-buttons button {
        font-family: 'Nunito', sans-serif;
        font-size: 0.78rem;
        font-weight: 700;
        letter-spacing: 0.04em;
        border-radius: 30px;
        padding: 0.55rem 1.2rem;
        cursor: pointer;
        border: 1.5px solid #8b5e3c;
        transition: background 0.2s, color 0.2s;
      }
      #cookie-reject {
        background: transparent;
        color: #8b5e3c;
      }
      #cookie-reject:hover { background: #f5e9d6; }
      #cookie-accept {
        background: #8b5e3c;
        color: #fff;
      }
      #cookie-accept:hover { background: #6a9e8a; border-color: #6a9e8a; }
      @media (max-width: 560px) {
        #cookie-consent-banner { flex-direction: column; align-items: stretch; text-align: center; }
        .cookie-consent-buttons { justify-content: center; }
      }
    `;
    document.head.appendChild(style);
  }

  function showBanner() {
    injectStyles();

    const banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.innerHTML = `
      <p>Usamos cookies técnicas necesarias para que la tienda funcione, y cookies de análisis (Google Analytics) para entender cómo se usa la web. Puedes aceptarlas o rechazarlas libremente. <a href="aviso-legal.html#cookies" target="_blank">Más información</a></p>
      <div class="cookie-consent-buttons">
        <button id="cookie-reject" type="button">Rechazar</button>
        <button id="cookie-accept" type="button">Aceptar</button>
      </div>`;
    document.body.appendChild(banner);

    document.getElementById('cookie-accept').addEventListener('click', function() {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      banner.remove();
      loadGoogleAnalytics();
    });
    document.getElementById('cookie-reject').addEventListener('click', function() {
      localStorage.setItem(CONSENT_KEY, 'rejected');
      banner.remove();
    });
  }

  function init() {
    const consent = localStorage.getItem(CONSENT_KEY);
    if (consent === 'accepted') {
      loadGoogleAnalytics();
    } else if (consent !== 'rejected') {
      showBanner();
    }
    // si es 'rejected', no hacemos nada: no se carga Analytics
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
