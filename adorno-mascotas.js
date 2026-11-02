// Adorno navideño para mascotas ("Mi peludo"). Se define una sola vez y se pinta en
// Huellitas Mamemi y en Cositas de Temporada: <div data-adorno-mascotas></div>
// Para cambiar precios, fotos o textos, solo hay que tocar este archivo.
(function () {
  var CFG = {
    id: 'adorno-mascotas',
    nombre: 'Adorno navideño · Mi peludo',
    precios: [ { desde: 1, precio: 15 }, { desde: 3, precio: 13 }, { desde: 10, precio: 10 } ],
    max: 50,
    peso: 20,
    fotos: [
      { src: 'images/adorno-mascota-perro.jpg?v=20261102', alt: 'Adorno navideño de madera con un perro y el nombre Nala grabados, con lazo de arpillera' },
      { src: 'images/adorno-mascota-gato.jpg?v=20261102', alt: 'Adorno navideño de madera con un gato y el nombre Mochi grabados, con cordón de yute' }
    ],
    descripcion: 'Adorno de madera redondo grabado al láser con una corona navideña de acebo, bayas y ramitas, el dibujo de tu perro o gato, sus huellitas y su nombre. Con cordón de yute para colgarlo en el árbol. Un recuerdo para guardar año tras año.',
    wa: 'https://wa.me/34622562499?text=' + encodeURIComponent('Hola! Me interesa el adorno navideño para mi mascota')
  };
  function precioPor(n) { var p = CFG.precios[0].precio; CFG.precios.forEach(function (t) { if (n >= t.desde) p = t.precio; }); return p; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  function css() {
    if (document.getElementById('am-css')) return;
    var s = document.createElement('style'); s.id = 'am-css';
    s.textContent =
      '.am-car{position:relative;overflow:hidden;aspect-ratio:1/1;background:#fdf8f0;cursor:zoom-in}' +
      '.am-track{display:flex;height:100%;transition:transform .4s ease}' +
      '.am-track img{width:100%;height:100%;object-fit:cover;flex:0 0 100%;display:block}' +
      '.am-btn{position:absolute;top:50%;transform:translateY(-50%);background:rgba(253,248,240,.9);border:none;border-radius:50%;width:34px;height:34px;font-size:1.1rem;cursor:pointer;z-index:3;box-shadow:0 2px 8px rgba(90,58,26,.13)}' +
      '.am-prev{left:.5rem}.am-next{right:.5rem}' +
      '.am-dots{position:absolute;bottom:.6rem;left:50%;transform:translateX(-50%);display:flex;gap:.35rem;z-index:3}' +
      '.am-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.65);border:none;padding:0;cursor:pointer}' +
      '.am-dot.on{background:#fff;box-shadow:0 0 0 1px rgba(90,58,26,.35)}' +
      '.am-peludo{border-top:1px dashed #f5e9d6;padding-top:.6rem;margin-top:.6rem}' +
      '.am-peludo:first-of-type{border-top:none;padding-top:0;margin-top:0}' +
      '.am-peludo-t{font-size:.75rem;font-weight:700;color:#6a9e8a;letter-spacing:.08em;text-transform:uppercase;margin-bottom:.3rem}' +
      '.am-msg{color:#b3261e;font-size:.85rem;min-height:1.2rem;margin-top:.3rem}' +
      '.am-nota{font-size:.72rem;color:#6b4c2a;margin-top:.3rem}' +
      '.am-wa{color:#6a9e8a;font-weight:700}' +
      '.field-required{border-color:#8b5e3c!important}';
    document.head.appendChild(s);
  }

  function pintar(cont) {
    css();
    var tramos = CFG.precios.map(function (t, i) {
      var sig = CFG.precios[i + 1];
      var rango = sig ? (t.desde === sig.desde - 1 ? t.desde : t.desde + '–' + (sig.desde - 1)) + ' unidad' + ((sig.desde - 1) > 1 ? 'es' : '') : t.desde + ' unidades o más';
      return '<div class="price-row"><span>' + rango + '</span><span class="amount">' + t.precio + ' € / u</span></div>';
    }).join('');
    var card = document.createElement('div');
    card.className = 'product-card t-ficha expanded fade-in visible';
    card.id = CFG.id;
    card.innerHTML =
      '<div class="product-img am-car" id="am-car">' +
        '<div class="am-track" id="am-track">' + CFG.fotos.map(function (f) { return '<img src="' + esc(f.src) + '" alt="' + esc(f.alt) + '">'; }).join('') + '</div>' +
        '<button type="button" class="am-btn am-prev" aria-label="Foto anterior">‹</button>' +
        '<button type="button" class="am-btn am-next" aria-label="Foto siguiente">›</button>' +
        '<div class="am-dots" id="am-dots"></div>' +
        '<span class="personalizable-badge">🎄 Edición Navidad</span>' +
      '</div>' +
      '<div class="product-body">' +
        '<p class="product-cat">Huellitas Mamemi · 🎄 Navidad</p>' +
        '<h3>' + esc(CFG.nombre) + '</h3>' +
        '<p class="product-desc hu-desc">' + esc(CFG.descripcion) + '</p>' +
        '<div class="price-block">' + tramos + '<p class="price-note">✦ IVA incluido · El nombre de tu peludo no lleva suplemento</p></div>' +
        '<div class="price-alert">✦ Antes de grabarlo, te envío una propuesta digital del diseño para que me confirmes que es tal y como lo quieres.</div>' +
        '<div class="product-options">' +
          '<div class="opt-row"><label class="opt-label" for="am-qty">Cantidad:</label>' +
            '<input type="number" class="opt-input" id="am-qty" min="1" max="' + CFG.max + '" value="1">' +
            '<p class="price-note" id="am-tramo" style="margin-top:.3rem;"></p></div>' +
          '<div id="am-peludos"></div>' +
          '<p class="am-nota">¿Quieres que se parezca todavía más a tu peludo? <a class="am-wa" href="' + CFG.wa + '" target="_blank" rel="noopener">Envíame una foto por WhatsApp</a>.</p>' +
          '<div class="opt-price-row"><span>Total:</span><strong id="am-total">15 €</strong></div>' +
        '</div>' +
        '<p class="am-msg" id="am-msg" role="alert"></p>' +
        '<button type="button" class="btn-add-cart" id="am-add" style="margin-top:0;">Añadir al carrito</button>' +
        '<a href="' + CFG.wa + '" class="btn-contact" target="_blank" rel="noopener" style="margin-top:.4rem;">¿Dudas? Escríbeme</a>' +
      '</div>';
    cont.parentNode.replaceChild(card, cont);

    var $ = function (id) { return card.querySelector('#' + id); };

    // carrusel de fotos
    var pos = 0, n = CFG.fotos.length, track = $('am-track'), dots = $('am-dots');
    CFG.fotos.forEach(function (f, i) { var d = document.createElement('button'); d.type = 'button'; d.className = 'am-dot' + (i === 0 ? ' on' : ''); d.setAttribute('aria-label', 'Foto ' + (i + 1)); d.addEventListener('click', function (e) { e.stopPropagation(); ir(i); }); dots.appendChild(d); });
    function ir(i) { pos = (i + n) % n; track.style.transform = 'translateX(-' + (pos * 100) + '%)'; Array.prototype.forEach.call(dots.children, function (d, k) { d.classList.toggle('on', k === pos); }); }
    card.querySelector('.am-prev').addEventListener('click', function (e) { e.stopPropagation(); ir(pos - 1); });
    card.querySelector('.am-next').addEventListener('click', function (e) { e.stopPropagation(); ir(pos + 1); });
    if (n < 2) { card.querySelector('.am-prev').style.display = card.querySelector('.am-next').style.display = dots.style.display = 'none'; }
    $('am-car').addEventListener('click', function () { if (typeof window.openLightbox === 'function') window.openLightbox(CFG.fotos[pos].src); });

    // peludos (uno por adorno)
    var datos = [];   // datos[i] = { nombre, tipo, raza }
    function cantidad() { var q = parseInt($('am-qty').value, 10) || 1; return Math.max(1, Math.min(CFG.max, q)); }
    function pintarCampos() {
      var q = cantidad(), cont = $('am-peludos'); cont.innerHTML = '';
      for (var i = 0; i < q; i++) {
        var d = datos[i] || (datos[i] = { nombre: '', tipo: 'Perro', raza: '' });
        var g = document.createElement('div'); g.className = 'am-peludo';
        g.innerHTML =
          (q > 1 ? '<p class="am-peludo-t">Adorno ' + (i + 1) + '</p>' : '') +
          '<div class="opt-row"><label class="opt-label">Nombre de tu peludo</label><input type="text" class="opt-input" data-k="nombre" data-i="' + i + '" maxlength="20" placeholder="Ej.: Nala" autocomplete="off"></div>' +
          '<div class="opt-row"><label class="opt-label">¿Es perro o gato?</label><select class="opt-input" data-k="tipo" data-i="' + i + '"><option>Perro</option><option>Gato</option><option>Otro</option></select></div>' +
          '<div class="opt-row"><label class="opt-label">Raza o cómo es (opcional)</label><input type="text" class="opt-input" data-k="raza" data-i="' + i + '" maxlength="60" placeholder="Ej.: Cocker de pelo marrón, o gato atigrado" autocomplete="off"></div>';
        cont.appendChild(g);
        g.querySelector('[data-k=nombre]').value = d.nombre;
        g.querySelector('[data-k=tipo]').value = d.tipo;
        g.querySelector('[data-k=raza]').value = d.raza;
      }
    }
    function precios() {
      var q = cantidad(), u = precioPor(q);
      var sig = null; CFG.precios.forEach(function (t) { if (t.desde > q && !sig) sig = t; });
      $('am-tramo').textContent = q + (q === 1 ? ' unidad' : ' unidades') + ': ' + u + ' €/u' + (q >= 3 ? ' (descuento aplicado)' : '');
      $('am-total').textContent = (u * q) + ' €';
    }
    $('am-qty').addEventListener('input', function () {
      var q = parseInt(this.value, 10);
      if (q > CFG.max) this.value = CFG.max;
      pintarCampos(); precios();
    });
    $('am-peludos').addEventListener('input', function (e) {
      var t = e.target, i = t.getAttribute('data-i'), k = t.getAttribute('data-k'); if (i == null) return;
      datos[i][k] = t.value; t.classList.remove('field-required'); $('am-msg').textContent = '';
    });
    $('am-peludos').addEventListener('change', function (e) {
      var t = e.target, i = t.getAttribute('data-i'), k = t.getAttribute('data-k'); if (i != null) datos[i][k] = t.value;
    });
    $('am-add').addEventListener('click', function () {
      var q = cantidad(), falta = null;
      Array.prototype.forEach.call(card.querySelectorAll('[data-k=nombre]'), function (inp) {
        if (!inp.value.trim()) { inp.classList.add('field-required'); if (!falta) falta = inp; }
      });
      if (falta) { falta.focus(); $('am-msg').textContent = q > 1 ? 'Por favor escribe el nombre de cada peludo (faltan algunos).' : 'Por favor escribe el nombre de tu peludo.'; return; }
      if (typeof window.addToCart !== 'function') { $('am-msg').textContent = 'No se ha podido añadir al carrito. Recarga la página e inténtalo de nuevo.'; return; }
      var unit = precioPor(q), grupos = {}, orden = [];
      for (var i = 0; i < q; i++) {
        var d = datos[i], nom = d.nombre.trim().replace(/\s+/g, ' '), raza = (d.raza || '').trim().replace(/\s+/g, ' '), k = nom + '|' + d.tipo + '|' + raza;
        if (!grupos[k]) { grupos[k] = { nom: nom, tipo: d.tipo, raza: raza, qty: 0 }; orden.push(k); }
        grupos[k].qty++;
      }
      orden.forEach(function (k, idx) {
        var g = grupos[k], opts = { 'Mascota': g.tipo, 'Nombre': g.nom };
        if (g.raza) opts['Raza o cómo es'] = g.raza;
        window.addToCart({ id: 'adorno-mascotas-' + Date.now() + '-' + idx, name: CFG.nombre, price: unit, qty: g.qty, peso: CFG.peso, options: opts });
      });
      $('am-msg').textContent = '';
    });
    pintarCampos(); precios();
  }

  function init() { Array.prototype.forEach.call(document.querySelectorAll('[data-adorno-mascotas]'), pintar); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
