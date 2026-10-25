// ── MAMEMI Madera · Consentimiento de cookies (todo el sitio, incluida la sección Esencia) ──
// Un único banner para todas las páginas. La elección se guarda en el navegador con la clave
// 'mamemi_consent_v1' y se comparte entre todas las páginas. Google Analytics solo se carga si
// el visitante lo acepta.
(function () {
  'use strict';

  var CONSENT_KEY = 'mamemi_consent_v1';
  var LEGACY_KEY = 'mamemi_cookies_v2';        // banner antiguo: 'accepted' / 'rejected'
  var GA_ID = 'G-9MM0BBNL5N';
  var MAX_AGE_DAYS = 730;                      // 24 meses

  // ---------- almacenamiento ----------
  function getConsent() {
    try {
      var c = JSON.parse(localStorage.getItem(CONSENT_KEY) || 'null');
      if (c) return c;
      // Migra la elección hecha con el banner antiguo, para no volver a preguntar
      var old = localStorage.getItem(LEGACY_KEY);
      if (old === 'accepted' || old === 'rejected') {
        return saveConsent({ essential: true, analytics: old === 'accepted' });
      }
    } catch (e) {}
    return null;
  }
  function saveConsent(prefs) {
    var data = { timestamp: Date.now(), essential: true, analytics: !!prefs.analytics };
    try { localStorage.setItem(CONSENT_KEY, JSON.stringify(data)); } catch (e) {}
    return data;
  }
  function expired(c) {
    return !c || !c.timestamp || (Date.now() - c.timestamp) / 86400000 > MAX_AGE_DAYS;
  }

  // ---------- Google Analytics ----------
  function loadAnalytics() {
    if (window._mamemiGaLoaded) return;
    window._mamemiGaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
  }
  function unloadAnalytics() {
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (name.indexOf('_ga') === 0 || name.indexOf('_gid') === 0 || name.indexOf('_gat') === 0) {
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;';
        document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=' + location.hostname + ';';
      }
    });
  }
  function apply(c) { if (c && c.analytics) loadAnalytics(); else unloadAnalytics(); }

  // ---------- banner ----------
  var CSS = [
    '#cookie-banner{position:fixed;bottom:0;left:0;right:0;z-index:9999;background:#fff;border-top:3px solid #6a9e8a;box-shadow:0 -8px 40px rgba(0,0,0,.18);padding:1.5rem 2rem;display:none;font-family:"Nunito",sans-serif;text-align:left}',
    '#cookie-banner.visible{display:block}',
    '#cookie-banner .cookie-inner{max-width:1100px;margin:0 auto;display:flex;flex-wrap:wrap;gap:1.2rem;align-items:center;justify-content:space-between}',
    '#cookie-banner .cookie-text{flex:1 1 420px;font-size:.85rem;line-height:1.6;color:#6b4c2a}',
    '#cookie-banner .cookie-text strong{color:#5a3a1a;font-size:.95rem;display:block;margin-bottom:.3rem}',
    '#cookie-banner .cookie-text a{color:#6a9e8a;font-weight:700;text-decoration:underline}',
    '#cookie-banner .cookie-actions{display:flex;gap:.7rem;flex-wrap:wrap}',
    '#cookie-banner .cookie-btn{padding:.7rem 1.5rem;border-radius:30px;font-family:"Nunito",sans-serif;font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;border:2px solid transparent;transition:all .25s;white-space:nowrap}',
    '#cookie-banner .cookie-btn.accept{background:#8b5e3c;color:#fff;border-color:#8b5e3c}',
    '#cookie-banner .cookie-btn.accept:hover{background:#6a9e8a;border-color:#6a9e8a}',
    '#cookie-banner .cookie-btn.reject{background:#fff;color:#8b5e3c;border-color:#8b5e3c}',
    '#cookie-banner .cookie-btn.reject:hover{background:#f5e9d6}',
    '#cookie-banner .cookie-btn.config{background:transparent;color:#6b4c2a;text-decoration:underline;border:none;padding:.7rem .5rem}',
    '#cookie-banner .cookie-btn.config:hover{color:#6a9e8a}',
    '#cookie-config{display:none;max-width:1100px;margin:1.2rem auto 0;padding-top:1.2rem;border-top:1px solid #f5e9d6;font-size:.85rem}',
    '#cookie-config.visible{display:block}',
    '#cookie-config .cookie-cat{display:flex;align-items:flex-start;gap:.8rem;padding:.7rem 0;border-bottom:1px solid #f5e9d6}',
    '#cookie-config .cookie-cat:last-of-type{border-bottom:none}',
    '#cookie-config .cookie-cat input[type=checkbox]{margin-top:.25rem;accent-color:#6a9e8a;width:18px;height:18px;cursor:pointer}',
    '#cookie-config .cookie-cat input[type=checkbox]:disabled{cursor:not-allowed;opacity:.6}',
    '#cookie-config .cookie-cat label{cursor:pointer}',
    '#cookie-config .cookie-cat label strong{color:#5a3a1a;display:block;margin-bottom:.15rem}',
    '#cookie-config .cookie-cat label span{color:#6b4c2a;font-weight:300}',
    '#cookie-save{margin-top:1rem;padding:.7rem 1.5rem;background:#6a9e8a;color:#fff;border:none;border-radius:30px;font-family:inherit;font-size:.8rem;font-weight:700;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;transition:background .25s}',
    '#cookie-save:hover{background:#8b5e3c}',
    '@media (max-width:640px){#cookie-banner{padding:1.2rem 1rem;max-height:90vh;overflow-y:auto}#cookie-banner .cookie-actions{width:100%}#cookie-banner .cookie-btn{flex:1}}'
  ].join('\n');

  var HTML = '' +
    '<div class="cookie-inner">' +
      '<div class="cookie-text">' +
        '<strong>🍪 Usamos cookies</strong>' +
        'Utilizamos cookies técnicas necesarias para el funcionamiento del carrito y cookies analíticas (Google Analytics) para entender cómo se usa la web. Puedes aceptar, rechazar o configurar tus preferencias. Más información en nuestra <a href="politica-cookies.html">política de cookies</a>.' +
      '</div>' +
      '<div class="cookie-actions">' +
        '<button type="button" class="cookie-btn accept" id="cookie-accept">Aceptar</button>' +
        '<button type="button" class="cookie-btn reject" id="cookie-reject">Rechazar</button>' +
        '<button type="button" class="cookie-btn config" id="cookie-config-toggle">Configurar</button>' +
      '</div>' +
    '</div>' +
    '<div id="cookie-config">' +
      '<div class="cookie-cat">' +
        '<input type="checkbox" id="cat-essential" checked disabled>' +
        '<label for="cat-essential"><strong>Cookies técnicas (necesarias)</strong><span>Imprescindibles para el funcionamiento de la web: carrito de compra, sesión y preferencias básicas. No se pueden desactivar.</span></label>' +
      '</div>' +
      '<div class="cookie-cat">' +
        '<input type="checkbox" id="cat-analytics">' +
        '<label for="cat-analytics"><strong>Cookies analíticas</strong><span>Nos permiten medir visitas y comportamiento en la web (Google Analytics) para mejorar nuestros contenidos. Se cargan solo si las aceptas.</span></label>' +
      '</div>' +
      '<button type="button" id="cookie-save">Guardar preferencias</button>' +
    '</div>';

  function $(id) { return document.getElementById(id); }
  function show(withConfig) {
    $('cookie-banner').classList.add('visible');
    if (withConfig) $('cookie-config').classList.add('visible');
  }
  function hide() {
    $('cookie-banner').classList.remove('visible');
    $('cookie-config').classList.remove('visible');
  }
  function openPanel() {
    var cur = getConsent();
    $('cat-analytics').checked = !!(cur && cur.analytics);
    show(true);
  }

  function init() {
    // Si la página aún lleva un banner propio (versión antigua), no se duplica
    if ($('cookie-banner')) return;

    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Aviso de cookies');
    banner.innerHTML = HTML;
    document.body.appendChild(banner);

    var consent = getConsent();
    if (consent && !expired(consent)) apply(consent); else show(false);

    $('cookie-accept').addEventListener('click', function () { apply(saveConsent({ analytics: true })); hide(); });
    $('cookie-reject').addEventListener('click', function () { apply(saveConsent({ analytics: false })); hide(); });
    $('cookie-config-toggle').addEventListener('click', function () { $('cookie-config').classList.toggle('visible'); });
    $('cookie-save').addEventListener('click', function () { apply(saveConsent({ analytics: $('cat-analytics').checked })); hide(); });

    // Enlace/botón "Configurar cookies" del pie de página
    var opener = $('open-cookie-config');
    if (opener) opener.addEventListener('click', function (e) { e.preventDefault(); openPanel(); });
    Array.prototype.forEach.call(document.querySelectorAll('.footer-cookie-config'), function (el) {
      if (el.tagName === 'A' && /#configurar-cookies/.test(el.getAttribute('href') || '') && !el.hasAttribute('data-bound')) {
        // en la misma página: se abre el panel sin recargar
        el.setAttribute('data-bound', '1');
        el.addEventListener('click', function (e) { e.preventDefault(); openPanel(); });
      }
    });

    // Llegada desde politica-cookies.html con #configurar-cookies
    if (location.hash === '#configurar-cookies') {
      openPanel();
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) {}
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
