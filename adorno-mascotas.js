// Adornos navideños para peludos: uno para perros, otro para gatos y otro "para otro peludo" (por encargo).
// Se definen una sola vez aquí y se pintan en Huellitas Mamemi y en Cositas de Temporada:
//   <div data-adorno-mascotas="perro"></div>   <div data-adorno-mascotas="gato"></div>   <div data-adorno-mascotas="otro"></div>
// Para cambiar precios, fotos o textos, solo hay que tocar este archivo.
(function () {
  var V = '?v=20261102';
  var PRECIOS = [ { desde: 1, precio: 15 }, { desde: 3, precio: 13 }, { desde: 10, precio: 10 } ];
  var MAX = 50, PESO = 20;
  var WA = function (t) { return 'https://wa.me/34622562499?text=' + encodeURIComponent(t); };
  var FOTO_PERRO = { src: 'images/adorno-mascota-perro.jpg' + V, alt: 'Adorno navideño de madera con un perro y el nombre Nala grabados, con lazo de arpillera' };
  var FOTO_GATO = { src: 'images/adorno-mascota-gato.jpg' + V, alt: 'Adorno navideño de madera con un gato y el nombre Mochi grabados, con cordón de yute' };
  var TIPOS = {
    perro: {
      id: 'adorno-perro', nombre: 'Adorno navideño · Mi perro', fotos: [FOTO_PERRO],
      descripcion: 'Adorno de madera redondo grabado al láser con una corona navideña de acebo, bayas y ramitas, el dibujo de tu perro, sus huellitas y su nombre. Con cordón de yute para colgarlo en el árbol. Un recuerdo para guardar año tras año.',
      campoNombre: 'Nombre de tu perro', ejNombre: 'Ej.: Nala',
      campoRaza: 'Raza o cómo es (opcional)', ejRaza: 'Ej.: Cocker de pelo marrón',
      claveRaza: 'Raza o cómo es', dudas: 'Hola! Me interesa el adorno navideño para mi perro'
    },
    gato: {
      id: 'adorno-gato', nombre: 'Adorno navideño · Mi gato', fotos: [FOTO_GATO],
      descripcion: 'Adorno de madera redondo grabado al láser con una corona navideña de acebo, bayas y ramitas, el dibujo de tu gato, sus detallitos y su nombre. Con cordón de yute para colgarlo en el árbol. Un recuerdo para guardar año tras año.',
      campoNombre: 'Nombre de tu gato', ejNombre: 'Ej.: Mochi',
      campoRaza: 'Cómo es tu gato (opcional)', ejRaza: 'Ej.: Atigrado, o blanco con manchas negras',
      claveRaza: 'Cómo es', dudas: 'Hola! Me interesa el adorno navideño para mi gato'
    },
    otro: {
      id: 'adorno-otro-peludo', nombre: 'Adorno navideño · Para otro peludo', fotos: [FOTO_PERRO, FOTO_GATO], contacto: true,
      descripcion: '¿Tu compañero no es un perro ni un gato? También puedo hacerle su adorno navideño: conejo, caballo, pájaro, hurón, tortuga… Cuéntame cómo es y te preparo una propuesta con su dibujo y su nombre.',
      wa: 'Hola! Me gustaría encargar un adorno navideño para otro tipo de mascota'
    }
  };
  function precioPor(n) { var p = PRECIOS[0].precio; PRECIOS.forEach(function (t) { if (n >= t.desde) p = t.precio; }); return p; }
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]; }); }

  function css() {
    if (document.getElementById('am-css')) return;
    var s = document.createElement('style'); s.id = 'am-css';
    s.textContent =
      '.am-car{position:relative;overflow:hidden;aspect-ratio:1/1;background:#fdf8f0;cursor:zoom-in}' +
      '.hu-wrap .product-img.am-car{aspect-ratio:1/1}' +
      '.am-track{display:flex;height:100%;transition:transform .4s ease}' +
      '.am-track img{width:100%;height:100%;object-fit:cover;flex:0 0 100%;display:block}' +
      '.am-btn{position:absolute;top:50%;transform:translateY(-50%);background:rgba(253,248,240,.9);border:none;border-radius:50%;width:34px;height:34px;font-size:1.1rem;cursor:pointer;z-index:3;box-shadow:0 2px 8px rgba(90,58,26,.13)}' +
      '.am-prev{left:.5rem}.am-next{right:.5rem}' +
      '.am-dots{position:absolute;bottom:.6rem;left:50%;transform:translateX(-50%);display:flex;gap:.35rem;z-index:3}' +
      '.am-dot{width:8px;height:8px;border-radius:50%;background:rgba(255,255,255,.65);border:none;padding:0;cursor:pointer}' +
      '.am-dot.on{background:#fff;box-shadow:0 0 0 1px rgba(90,58,26,.35)}' +
      '.am-peludo{border-top:1px dashed #f5e9d6;padding-top:.6rem;margin-top:.6rem}' +
      '.am-peludo:first-child{border-top:none;padding-top:0;margin-top:0}' +
      '.am-peludo-t{font-size:.75rem;font-weight:700;color:#6a9e8a;letter-spacing:.08em;text-transform:uppercase;margin-bottom:.3rem}' +
      '.am-msg{color:#b3261e;font-size:.85rem;min-height:1.2rem;margin-top:.3rem}' +
      '.am-nota{font-size:.72rem;color:#6b4c2a;margin-top:.3rem}' +
      '.am-wa{color:#6a9e8a;font-weight:700}' +
      '.am-sec{display:block;text-align:center;border:2px solid #8b5e3c;color:#8b5e3c;background:#fff;border-radius:30px;padding:.6rem 1rem;text-decoration:none;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-top:.4rem}' +
      '.am-sec:hover{background:#f5e9d6}' +
      '.field-required{border-color:#8b5e3c!important}';
    document.head.appendChild(s);
  }

  function pintar(cont) {
    var T = TIPOS[cont.getAttribute('data-adorno-mascotas')] || TIPOS.perro;
    css();
    var P = T.id + '-';   // prefijo de ids (no se repiten entre tarjetas)
    var tramos = PRECIOS.map(function (t, i) {
      var sig = PRECIOS[i + 1];
      var rango = sig ? (t.desde === sig.desde - 1 ? t.desde : t.desde + '–' + (sig.desde - 1)) + ' unidad' + ((sig.desde - 1) > 1 ? 'es' : '') : t.desde + ' unidades o más';
      return '<div class="price-row"><span>' + rango + '</span><span class="amount">' + t.precio + ' € / u</span></div>';
    }).join('');
    var imgs =
      '<div class="product-img am-car" id="' + P + 'car">' +
        '<div class="am-track" id="' + P + 'track">' + T.fotos.map(function (f) { return '<img src="' + esc(f.src) + '" alt="' + esc(f.alt) + '">'; }).join('') + '</div>' +
        '<button type="button" class="am-btn am-prev" aria-label="Foto anterior">‹</button>' +
        '<button type="button" class="am-btn am-next" aria-label="Foto siguiente">›</button>' +
        '<div class="am-dots" id="' + P + 'dots"></div>' +
        '<span class="personalizable-badge">🎄 Edición Navidad</span>' +
      '</div>';
    var cuerpo;
    if (T.contacto) {
      cuerpo =
        '<div class="product-body">' +
          '<p class="product-cat">Huellitas Mamemi · 🎄 Navidad</p>' +
          '<h3>' + esc(T.nombre) + '</h3>' +
          '<p class="product-desc hu-desc">' + esc(T.descripcion) + '</p>' +
          '<div class="price-block">' + tramos + '<p class="price-note">✦ IVA incluido · Mismos precios que los adornos de perro y de gato</p></div>' +
          '<div class="price-alert">✦ Antes de grabarlo, te envío una propuesta digital del diseño para que me confirmes que es tal y como lo quieres.</div>' +
          '<a href="' + WA(T.wa) + '" class="btn-contact" target="_blank" rel="noopener">Escríbeme por WhatsApp</a>' +
          '<a href="mailto:hola@mamemimadera.es?subject=' + encodeURIComponent('Adorno navideño para otro peludo') + '" class="am-sec">Por email</a>' +
        '</div>';
    } else {
      cuerpo =
        '<div class="product-body">' +
          '<p class="product-cat">Huellitas Mamemi · 🎄 Navidad</p>' +
          '<h3>' + esc(T.nombre) + '</h3>' +
          '<p class="product-desc hu-desc">' + esc(T.descripcion) + '</p>' +
          '<div class="price-block">' + tramos + '<p class="price-note">✦ IVA incluido · El nombre no lleva suplemento</p></div>' +
          '<div class="price-alert">✦ Antes de grabarlo, te envío una propuesta digital del diseño para que me confirmes que es tal y como lo quieres.</div>' +
          '<div class="product-options">' +
            '<div class="opt-row"><label class="opt-label" for="' + P + 'qty">Cantidad:</label>' +
              '<input type="number" class="opt-input" id="' + P + 'qty" min="1" max="' + MAX + '" value="1">' +
              '<p class="price-note" id="' + P + 'tramo" style="margin-top:.3rem;"></p></div>' +
            '<div id="' + P + 'peludos"></div>' +
            '<p class="am-nota">¿Quieres que se parezca todavía más? <a class="am-wa" href="' + WA(T.dudas) + '" target="_blank" rel="noopener">Envíame una foto por WhatsApp</a>.</p>' +
            '<div class="opt-price-row"><span>Total:</span><strong id="' + P + 'total">15 €</strong></div>' +
          '</div>' +
          '<p class="am-msg" id="' + P + 'msg" role="alert"></p>' +
          '<button type="button" class="btn-add-cart" id="' + P + 'add" style="margin-top:0;">Añadir al carrito</button>' +
          '<a href="' + WA(T.dudas) + '" class="btn-contact" target="_blank" rel="noopener" style="margin-top:.4rem;">¿Dudas? Escríbeme</a>' +
        '</div>';
    }
    var card = document.createElement('div');
    card.className = 'product-card t-ficha expanded fade-in visible';
    card.id = T.id;
    card.innerHTML = imgs + cuerpo;
    cont.parentNode.replaceChild(card, cont);
    var $ = function (id) { return card.querySelector('#' + P + id); };

    // carrusel de fotos
    var pos = 0, n = T.fotos.length, track = $('track'), dots = $('dots');
    T.fotos.forEach(function (f, i) { var d = document.createElement('button'); d.type = 'button'; d.className = 'am-dot' + (i === 0 ? ' on' : ''); d.setAttribute('aria-label', 'Foto ' + (i + 1)); d.addEventListener('click', function (e) { e.stopPropagation(); ir(i); }); dots.appendChild(d); });
    function ir(i) { pos = (i + n) % n; track.style.transform = 'translateX(-' + (pos * 100) + '%)'; Array.prototype.forEach.call(dots.children, function (d, k) { d.classList.toggle('on', k === pos); }); }
    card.querySelector('.am-prev').addEventListener('click', function (e) { e.stopPropagation(); ir(pos - 1); });
    card.querySelector('.am-next').addEventListener('click', function (e) { e.stopPropagation(); ir(pos + 1); });
    if (n < 2) { card.querySelector('.am-prev').style.display = card.querySelector('.am-next').style.display = dots.style.display = 'none'; }
    $('car').addEventListener('click', function () { if (typeof window.openLightbox === 'function') window.openLightbox(T.fotos[pos].src); });
    if (T.contacto) return;

    // un bloque de datos por adorno
    var datos = [];   // datos[i] = { nombre, raza }
    function cantidad() { var q = parseInt($('qty').value, 10) || 1; return Math.max(1, Math.min(MAX, q)); }
    function pintarCampos() {
      var q = cantidad(), cont2 = $('peludos'); cont2.innerHTML = '';
      for (var i = 0; i < q; i++) {
        var d = datos[i] || (datos[i] = { nombre: '', raza: '' });
        var g = document.createElement('div'); g.className = 'am-peludo';
        g.innerHTML =
          (q > 1 ? '<p class="am-peludo-t">Adorno ' + (i + 1) + '</p>' : '') +
          '<div class="opt-row"><label class="opt-label">' + esc(T.campoNombre) + '</label><input type="text" class="opt-input" data-k="nombre" data-i="' + i + '" maxlength="20" placeholder="' + esc(T.ejNombre) + '" autocomplete="off"></div>' +
          '<div class="opt-row"><label class="opt-label">' + esc(T.campoRaza) + '</label><input type="text" class="opt-input" data-k="raza" data-i="' + i + '" maxlength="60" placeholder="' + esc(T.ejRaza) + '" autocomplete="off"></div>';
        cont2.appendChild(g);
        g.querySelector('[data-k=nombre]').value = d.nombre;
        g.querySelector('[data-k=raza]').value = d.raza;
      }
    }
    function precios() {
      var q = cantidad(), u = precioPor(q);
      $('tramo').textContent = q + (q === 1 ? ' unidad' : ' unidades') + ': ' + u + ' €/u' + (q >= 3 ? ' (descuento aplicado)' : '');
      $('total').textContent = (u * q) + ' €';
    }
    $('qty').addEventListener('input', function () { var q = parseInt(this.value, 10); if (q > MAX) this.value = MAX; pintarCampos(); precios(); });
    $('peludos').addEventListener('input', function (e) {
      var t = e.target, i = t.getAttribute('data-i'), k = t.getAttribute('data-k'); if (i == null) return;
      datos[i][k] = t.value; t.classList.remove('field-required'); $('msg').textContent = '';
    });
    $('add').addEventListener('click', function () {
      var q = cantidad(), falta = null;
      Array.prototype.forEach.call(card.querySelectorAll('[data-k=nombre]'), function (inp) {
        if (!inp.value.trim()) { inp.classList.add('field-required'); if (!falta) falta = inp; }
      });
      if (falta) { falta.focus(); $('msg').textContent = q > 1 ? 'Por favor escribe el nombre de cada peludo (faltan algunos).' : 'Por favor escribe el nombre de tu peludo.'; return; }
      if (typeof window.addToCart !== 'function') { $('msg').textContent = 'No se ha podido añadir al carrito. Recarga la página e inténtalo de nuevo.'; return; }
      var unit = precioPor(q), grupos = {}, orden = [];
      for (var i = 0; i < q; i++) {
        var d = datos[i], nom = d.nombre.trim().replace(/\s+/g, ' '), raza = (d.raza || '').trim().replace(/\s+/g, ' '), k = nom + '|' + raza;
        if (!grupos[k]) { grupos[k] = { nom: nom, raza: raza, qty: 0 }; orden.push(k); }
        grupos[k].qty++;
      }
      orden.forEach(function (k, idx) {
        var g = grupos[k], opts = { 'Nombre': g.nom };
        if (g.raza) opts[T.claveRaza] = g.raza;
        window.addToCart({ id: T.id + '-' + Date.now() + '-' + idx, name: T.nombre, price: unit, qty: g.qty, peso: PESO, options: opts });
      });
      $('msg').textContent = '';
    });
    pintarCampos(); precios();
  }

  function init() { Array.prototype.forEach.call(document.querySelectorAll('[data-adorno-mascotas]'), pintar); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
