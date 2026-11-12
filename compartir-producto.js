/* MAMEMI Madera · botón «Compartir» en cada producto
 * - Añade un botón 🔗 en la foto de cada ficha (.product-card).
 * - Al pulsarlo copia (o comparte, en el móvil) un enlace directo a ESE producto, p. ej.
 *     https://mamemimadera.es/regalos-unicos.html#letra-3d-autoportante
 * - Al abrir un enlace así, la página muestra el producto, se desplaza hasta él y lo resalta.
 * - El enlace sale del título (h3) de la ficha. Si la ficha ya tiene id, se usa ese id.
 * Se carga con:  <script src="compartir-producto.js"></script>  al final de cada página de productos.
 */
(function () {
  'use strict';
  if (window.__mamemiCompartir) return;
  window.__mamemiCompartir = true;

  var BASE = (location.hostname.indexOf('mamemimadera.es') > -1) ? 'https://mamemimadera.es' : location.origin;
  var ICONO = '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.6" y1="13.5" x2="15.4" y2="17.5"/><line x1="15.4" y1="6.5" x2="8.6" y2="10.5"/></svg>';

  // ---------- estilos ----------
  var st = document.createElement('style');
  st.textContent =
    '.mm-share{position:absolute;bottom:.8rem;left:.8rem;z-index:6;width:36px;height:36px;border-radius:50%;border:0;padding:0;display:flex;align-items:center;justify-content:center;background:rgba(253,248,240,.92);color:#5a3a1a;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.18);transition:transform .2s,background .2s}' +
    '.mm-share:hover{transform:scale(1.08);background:#fff}' +
    '.mm-share:focus-visible{outline:2px solid #6a9e8a;outline-offset:2px}' +
    '.mm-toast{position:fixed;left:50%;bottom:1.6rem;transform:translate(-50%,20px);opacity:0;z-index:100000;background:#5a3a1a;color:#fdf8f0;padding:.7rem 1.2rem;border-radius:30px;font:700 .82rem/1.2 "Nunito",sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.25);transition:opacity .25s,transform .25s;pointer-events:none;max-width:90vw;text-align:center}' +
    '.mm-toast.on{opacity:1;transform:translate(-50%,0)}';
  document.head.appendChild(st);

  var toastEl = null, toastT = 0;
  function toast(msg) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'mm-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('on');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2400);
  }

  // ---------- ids ----------
  function slug(t) {
    return String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/&/g, ' y ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
  }
  function reservado(s) {   // ids que la página usa para sus filtros (regalos-unicos)
    try {
      if (typeof RB === 'undefined') return s === 'todo';
      return s === 'todo' || RB.categorias.some(function (c) { return c.id === s; }) || !!RB.tecnicas[s] || !!RB.tipos[s];
    } catch (e) { return false; }
  }
  function tarjetas() { return Array.prototype.slice.call(document.querySelectorAll('.product-card')); }
  function titulo(card) { var h = card.querySelector('h3'); return h ? h.textContent.replace(/\s+/g, ' ').trim() : ''; }
  function asignarId(card) {
    if (card.id) return card.id;
    var t = titulo(card); if (!t) return '';
    var base = slug(t); if (!base) return '';
    if (reservado(base)) base = 'p-' + base;
    var id = base, n = 2;
    while (document.getElementById(id)) { id = base + '-' + n; n++; }
    card.id = id; return id;
  }

  // ---------- compartir ----------
  function enlace(id) { return BASE + location.pathname + '#' + id; }
  function copiar(txt) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(txt);
    return new Promise(function (ok, ko) {
      try {
        var ta = document.createElement('textarea'); ta.value = txt; ta.style.cssText = 'position:fixed;opacity:0;top:0;left:0';
        document.body.appendChild(ta); ta.focus(); ta.select();
        var r = document.execCommand('copy'); document.body.removeChild(ta); r ? ok() : ko();
      } catch (e) { ko(e); }
    });
  }
  function compartir(card) {
    var id = card.id, url = enlace(id), t = titulo(card);
    var movil = /Android|iPhone|iPad|iPod|Mobi/i.test(navigator.userAgent);
    if (movil && navigator.share) {
      navigator.share({ title: t + ' · MAMEMI Madera', text: t, url: url }).catch(function () {});
      return;
    }
    copiar(url).then(function () { toast('🔗 Enlace de «' + t + '» copiado'); },
                     function () { window.prompt('Copia este enlace:', url); });
  }
  function ponerBoton(card) {
    if (card.__mmShare || card.classList.contains('agotado')) return;
    var id = asignarId(card); if (!id) return;
    var cont = card.querySelector('.product-img') || card;
    if (cont === card && getComputedStyle(card).position === 'static') card.style.position = 'relative';
    var b = document.createElement('button');
    b.type = 'button'; b.className = 'mm-share'; b.innerHTML = ICONO;
    b.setAttribute('aria-label', 'Compartir este producto'); b.title = 'Copiar enlace de este producto';
    b.addEventListener('click', function (e) { e.stopPropagation(); e.preventDefault(); compartir(card); });
    cont.appendChild(b);
    card.__mmShare = true;
  }

  // ---------- abrir un enlace directo ----------
  function resaltar(id) {
    var el = document.getElementById(id); if (!el) return;
    el.classList.add('visible');
    el.style.scrollMarginTop = '96px';
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.style.transition = 'box-shadow .4s ease';
    el.style.boxShadow = '0 0 0 3px #6a9e8a';
    setTimeout(function () { el.style.boxShadow = ''; }, 2400);
  }
  function existe(id) { var el = id && document.getElementById(id); return !!(el && el.classList.contains('product-card')); }
  function activarPagina(pg) {
    var id = pg.id.replace(/^page-/, '');
    var fn = (id === 'detalles' && window.showDetalles) ? window.showDetalles
           : (/^(ternura|huella|tesoro)$/.test(id) && window.showPackPage) ? window.showPackPage
           : window.showPage;
    try { if (typeof fn === 'function') fn(id); } catch (e) {}
    if (!pg.classList.contains('active')) {   // por si la página no tiene función propia
      var g = document.getElementById('catGrid'); if (g) g.style.display = 'none';
      document.querySelectorAll('.product-page').forEach(function (p) { p.classList.remove('active'); });
      pg.classList.add('active');
    }
  }
  var hecho = '';
  function abrir(id) {
    if (!existe(id) || hecho === id) return false;
    hecho = id;
    var card = document.getElementById(id), pg = card.closest('.product-page');
    if (pg && !pg.classList.contains('active')) { activarPagina(pg); setTimeout(function () { resaltar(id); }, 420); }
    else setTimeout(function () { resaltar(id); }, 200);
    return true;
  }
  // para páginas con su propio sistema de filtros (regalos-unicos)
  window.mamemiProductoExiste = existe;
  window.mamemiResaltar = resaltar;

  // ---------- arranque ----------
  function hashActual() { return decodeURIComponent((location.hash || '').replace(/^#/, '')); }
  function escanear() {
    tarjetas().forEach(ponerBoton);
    var h = hashActual();
    if (h && !window.__mmTieneRb) abrir(h);
  }
  var pendiente = 0;
  function programar() { if (pendiente) return; pendiente = requestAnimationFrame(function () { pendiente = 0; escanear(); }); }

  // regalos-unicos tiene su propio sistema de filtros: él se encarga de abrir el producto
  window.__mmTieneRb = (typeof rbAplicarHash === 'function') || !!document.getElementById('rb-count');
  escanear();
  window.addEventListener('hashchange', function () { hecho = ''; if (!window.__mmTieneRb) abrir(hashActual()); });
  if (window.MutationObserver) new MutationObserver(programar).observe(document.body, { childList: true, subtree: true });
})();
