// Adornos navideños para peludos: uno para perros, otro para gatos y otro "para otro peludo" (conejo, cobaya, hámster…).
// Se definen una sola vez aquí y se pintan en Huellitas Mamemi y en Cositas de Temporada:
//   <div data-adorno-mascotas="perro"></div>   <div data-adorno-mascotas="gato"></div>   <div data-adorno-mascotas="otro"></div>
// Para cambiar precios, fotos o textos, solo hay que tocar este archivo.
(function () {
  var V = '?v=20261102';
  // Precios por tramos (desde X unidades, precio por unidad). Son los mismos para perro, gato y otro peludo:
  // nombre + dibujo genérico del animal con su raza. El 100% personalizado (desde una foto) se pide por WhatsApp/email, desde 20 €.
  var PRECIOS_PG = [ { desde: 1, precio: 15 }, { desde: 3, precio: 13 }, { desde: 10, precio: 10 } ];
  var PRECIOS_OTRO = PRECIOS_PG;
  var PERSONALIZADO_DESDE = 20;
  var COLOR = 3;   // suplemento por unidad si quieren toque de color pintado a mano
  // Animales que se ofrecen en "otro peludo". Al final siempre se añade "Otro animal", que abre un campo para escribirlo.
  var ANIMALES = ['Conejo', 'Cobaya', 'Hámster', 'Caballo', 'Pájaro', 'Hurón', 'Tortuga'];
  var MAX = 50, PESO = 20;
  var WA = function (t) { return 'https://wa.me/34622562499?text=' + encodeURIComponent(t); };
  var FOTO_PERRO = { src: 'images/adorno-mascota-perro.jpg' + V, alt: 'Adorno navideño de madera con un perro y el nombre Nala grabados, con lazo de arpillera' };
  var FOTO_GATO = { src: 'images/adorno-mascota-gato.jpg' + V, alt: 'Adorno navideño de madera con un gato y el nombre Mochi grabados, con cordón de yute' };
  var FOTO_OTRO = { src: 'images/adorno-mascota-otro.jpg' + V, alt: 'Diseño de adorno navideño con un conejo, estrellas, corona de acebo y el nombre' };
  var TIPOS = {
    perro: {
      id: 'adorno-perro', nombre: 'Adorno navideño · Mi perro', fotos: [FOTO_PERRO], precios: PRECIOS_PG,
      descripcion: 'Adorno de madera redondo grabado al láser con una corona navideña de acebo, bayas y ramitas, el dibujo de la raza de tu perro, sus huellitas y su nombre. Con cordón de yute para colgarlo en el árbol. Un recuerdo para guardar año tras año.',
      campoNombre: 'Nombre de tu perro', ejNombre: 'Ej.: Nala',
      campoRaza: 'Raza o a qué se parece más', ejRaza: 'Ej.: Cocker de pelo marrón',
      claveRaza: 'Raza o cómo es', dudas: 'Hola! Me interesa el adorno navideño para mi perro', suyo: 'tu perro', suyoMsg: 'mi perro'
    },
    gato: {
      id: 'adorno-gato', nombre: 'Adorno navideño · Mi gato', fotos: [FOTO_GATO], precios: PRECIOS_PG,
      descripcion: 'Adorno de madera redondo grabado al láser con una corona navideña de acebo, bayas y ramitas, el dibujo de la raza de tu gato, sus detallitos y su nombre. Con cordón de yute para colgarlo en el árbol. Un recuerdo para guardar año tras año.',
      campoNombre: 'Nombre de tu gato', ejNombre: 'Ej.: Mochi',
      campoRaza: 'Raza o a qué se parece más', ejRaza: 'Ej.: Atigrado, o blanco con manchas negras',
      claveRaza: 'Cómo es', dudas: 'Hola! Me interesa el adorno navideño para mi gato', suyo: 'tu gato', suyoMsg: 'mi gato'
    },
    otro: {
      id: 'adorno-otro-peludo', nombre: 'Adorno navideño · Para otro peludo', fotos: [FOTO_OTRO], precios: PRECIOS_OTRO, animales: true,
      descripcion: 'Adorno de madera redondo grabado al láser con una corona navideña de acebo, bayas y ramitas, estrellitas, el dibujo de su animal y su nombre. Lo adapto al animal que me digas (conejo, cobaya, hámster, caballo, pájaro, hurón…) y, si me cuentas su raza, lo dibujo más parecido. Con cordón de yute para colgarlo en el árbol.',
      campoNombre: 'Nombre de tu peludo', ejNombre: 'Ej.: Copito',
      campoRaza: 'Raza o a qué se parece más', ejRaza: 'Ej.: Belier, de orejas caídas',
      claveRaza: 'Raza o cómo es', dudas: 'Hola! Tengo una duda sobre el adorno navideño para otro tipo de mascota', suyo: 'tu compi', suyoMsg: 'mi mascota'
    }
  };
  function precioPor(T, n) { var p = T.precios[0].precio; T.precios.forEach(function (t) { if (n >= t.desde) p = t.precio; }); return p; }
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
      '.am-pers{margin-top:1rem;padding:1rem;border:1.5px dashed #6a9e8a;border-radius:14px;background:#fdf8f0;text-align:center}' +
      '.am-pers-t{font-family:"Playfair Display",serif;font-size:1rem;color:#5a3a1a;margin-bottom:.3rem}' +
      '.am-pers p{font-size:.82rem;color:#6b4c2a;line-height:1.6;margin-bottom:.6rem}' +
      '.am-sec{display:block;text-align:center;border:2px solid #8b5e3c;color:#8b5e3c;background:#fff;border-radius:30px;padding:.6rem 1rem;text-decoration:none;font-size:.78rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;margin-top:.4rem}' +
      '.am-sec:hover{background:#f5e9d6}' +
      '.field-required{border-color:#8b5e3c!important}';
    document.head.appendChild(s);
  }

  function pintar(cont) {
    var T = TIPOS[cont.getAttribute('data-adorno-mascotas')] || TIPOS.perro;
    css();
    var P = T.id + '-';   // prefijo de ids (no se repiten entre tarjetas)
    var tramos = T.precios.map(function (t, i) {
      var sig = T.precios[i + 1];
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
    var aviso = T.animales
      ? '✦ Antes de grabarlo, te envío una propuesta digital del diseño adaptado a tu animal para que me confirmes que es tal y como lo quieres. Si es un animal poco habitual, te escribo antes para confirmarlo contigo.'
      : '✦ Antes de grabarlo, te envío una propuesta digital del diseño para que me confirmes que es tal y como lo quieres.';
    var cuerpo =
      '<div class="product-body">' +
        '<p class="product-cat">Huellitas Mamemi · 🎄 Navidad</p>' +
        '<h3>' + esc(T.nombre) + '</h3>' +
        '<p class="product-desc hu-desc">' + esc(T.descripcion) + '</p>' +
        '<div class="price-block">' + tramos + '<p class="price-note">✦ IVA incluido · El nombre no lleva suplemento · Toque de color pintado a mano: +' + COLOR + ' € / u</p></div>' +
        '<div class="price-alert">' + aviso + '</div>' +
        '<div class="product-options">' +
          '<div class="opt-row"><label class="opt-label" for="' + P + 'qty">Cantidad:</label>' +
            '<input type="number" class="opt-input" id="' + P + 'qty" min="1" max="' + MAX + '" value="1">' +
            '<p class="price-note" id="' + P + 'tramo" style="margin-top:.3rem;"></p></div>' +
          '<div id="' + P + 'peludos"></div>' +
          '<div class="opt-price-row"><span>Total:</span><strong id="' + P + 'total">' + T.precios[0].precio + ' €</strong></div>' +
        '</div>' +
        '<p class="am-msg" id="' + P + 'msg" role="alert"></p>' +
        '<button type="button" class="btn-add-cart" id="' + P + 'add" style="margin-top:0;">Añadir al carrito</button>' +
        '<a href="' + WA(T.dudas) + '" class="btn-contact" target="_blank" rel="noopener" style="margin-top:.4rem;">¿Dudas? Escríbeme</a>' +
        '<div class="am-pers">' +
          '<p class="am-pers-t">✨ ¿Quieres el de ' + esc(T.suyo) + ' 100% personalizado?</p>' +
          '<p>Con el dibujo sacado de su foto real, tal cual es. Escríbeme y, desde ' + PERSONALIZADO_DESDE + ' €, tienes el suyo.</p>' +
          '<a href="' + WA('Hola! Me gustaría un adorno navideño 100% personalizado de ' + T.suyoMsg + ', con el dibujo sacado de su foto') + '" class="btn-contact" target="_blank" rel="noopener">Escríbeme por WhatsApp</a>' +
          '<a href="mailto:hola@mamemimadera.es?subject=' + encodeURIComponent('Adorno navideño 100% personalizado') + '&body=' + encodeURIComponent('Hola! Me gustaría un adorno navideño 100% personalizado de ' + T.suyoMsg + ', con el dibujo sacado de su foto (te la adjunto).') + '" class="am-sec">Por email</a>' +
        '</div>' +
      '</div>';
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

    // un bloque de datos por adorno: datos[i] = { animal, otroAnimal, nombre, raza }
    var datos = [];
    function cantidad() { var q = parseInt($('qty').value, 10) || 1; return Math.max(1, Math.min(MAX, q)); }
    function opcionesAnimal(sel) {
      var h = '<option value="">Elige el animal…</option>';
      ANIMALES.forEach(function (a) { h += '<option value="' + esc(a) + '"' + (a === sel ? ' selected' : '') + '>' + esc(a) + '</option>'; });
      h += '<option value="__otro"' + (sel === '__otro' ? ' selected' : '') + '>Otro animal…</option>';
      return h;
    }
    function pintarCampos() {
      var q = cantidad(), cont2 = $('peludos'); cont2.innerHTML = '';
      for (var i = 0; i < q; i++) {
        var d = datos[i] || (datos[i] = { animal: '', otroAnimal: '', nombre: '', raza: '', color: 'no' });
        var g = document.createElement('div'); g.className = 'am-peludo';
        var h = (q > 1 ? '<p class="am-peludo-t">Adorno ' + (i + 1) + '</p>' : '');
        if (T.animales) {
          h += '<div class="opt-row"><label class="opt-label">¿Qué animal es?</label><select class="opt-input" data-k="animal" data-i="' + i + '">' + opcionesAnimal(d.animal) + '</select></div>' +
               '<div class="opt-row" data-wrap="otroAnimal" style="display:none;"><label class="opt-label">Escribe qué animal es</label><input type="text" class="opt-input" data-k="otroAnimal" data-i="' + i + '" maxlength="30" placeholder="Ej.: Chinchilla" autocomplete="off"></div>';
        }
        h += '<div class="opt-row"><label class="opt-label">' + esc(T.campoNombre) + '</label><input type="text" class="opt-input" data-k="nombre" data-i="' + i + '" maxlength="20" placeholder="' + esc(T.ejNombre) + '" autocomplete="off"></div>';
        // En "otro peludo" la raza solo aparece cuando ya se ha elegido el animal
        h += '<div class="opt-row" data-wrap="raza"><label class="opt-label" data-lbl="raza">' + esc(T.campoRaza) + '</label><input type="text" class="opt-input" data-k="raza" data-i="' + i + '" maxlength="60" placeholder="' + esc(T.ejRaza) + '" autocomplete="off"></div>';
        h += '<div class="opt-row"><label class="opt-label">¿Con toque de color pintado a mano? (+' + COLOR + ' € / u)</label><select class="opt-input" data-k="color" data-i="' + i + '">' +
             '<option value="no">No, solo grabado</option><option value="si">Sí, con toque de color (+' + COLOR + ' €)</option></select>' +
             '<p class="am-nota" data-wrap="colorNota" style="display:none;">Cuéntame los colores en el campo de la raza (por ejemplo, pelo marrón y blanco, lazo rojo) y te los pinto lo más parecido posible.</p></div>';
        g.innerHTML = h;
        cont2.appendChild(g);
        g.querySelector('[data-k=nombre]').value = d.nombre;
        g.querySelector('[data-k=raza]').value = d.raza;
        g.querySelector('[data-k=color]').value = d.color; g.querySelector('[data-wrap=colorNota]').style.display = d.color === 'si' ? '' : 'none';
        if (T.animales) { g.querySelector('[data-k=otroAnimal]').value = d.otroAnimal; ajustarAnimal(g, d); }
      }
    }
    // muestra/oculta "escribe qué animal" y la raza, y adapta el texto del campo raza al animal elegido
    function ajustarAnimal(g, d) {
      g.querySelector('[data-wrap=otroAnimal]').style.display = d.animal === '__otro' ? '' : 'none';
      var nom = d.animal && d.animal !== '__otro' ? d.animal.toLowerCase() : 'tu animal';
      g.querySelector('[data-lbl=raza]').textContent = 'Raza de ' + (nom === 'tu animal' ? nom : 'tu ' + nom) + ' o a qué se parece más';
    }
    function precios() {
      var q = cantidad(), u = precioPor(T, q), conColor = 0;
      for (var i = 0; i < q; i++) { if (datos[i] && datos[i].color === 'si') conColor++; }
      $('tramo').textContent = q + (q === 1 ? ' unidad' : ' unidades') + ': ' + u + ' €/u' + (q >= 3 ? ' (descuento aplicado)' : '') + (conColor ? ' · ' + conColor + (conColor === 1 ? ' con toque de color' : ' con toque de color') + ': +' + (conColor * COLOR) + ' €' : '');
      $('total').textContent = (u * q + conColor * COLOR) + ' €';
    }
    $('qty').addEventListener('input', function () { var q = parseInt(this.value, 10); if (q > MAX) this.value = MAX; pintarCampos(); precios(); });
    $('peludos').addEventListener('input', function (e) {
      var t = e.target, i = t.getAttribute('data-i'), k = t.getAttribute('data-k'); if (i == null) return;
      datos[i][k] = t.value; t.classList.remove('field-required'); $('msg').textContent = '';
      if (k === 'animal') ajustarAnimal(t.closest('.am-peludo'), datos[i]);
      if (k === 'color') { t.closest('.am-peludo').querySelector('[data-wrap=colorNota]').style.display = t.value === 'si' ? '' : 'none'; precios(); }
    });
    $('add').addEventListener('click', function () {
      var q = cantidad(), falta = null, msg = '';
      function marca(inp, m) { inp.classList.add('field-required'); if (!falta) { falta = inp; msg = m; } }
      if (T.animales) {
        Array.prototype.forEach.call(card.querySelectorAll('[data-k=animal]'), function (sel) {
          if (!sel.value) marca(sel, q > 1 ? 'Por favor elige qué animal es cada adorno.' : 'Por favor elige qué animal es.');
        });
        Array.prototype.forEach.call(card.querySelectorAll('[data-k=otroAnimal]'), function (inp) {
          if (inp.closest('[data-wrap]').style.display !== 'none' && !inp.value.trim()) marca(inp, 'Por favor escribe qué animal es.');
        });
      }
      Array.prototype.forEach.call(card.querySelectorAll('[data-k=nombre]'), function (inp) {
        if (!inp.value.trim()) marca(inp, q > 1 ? 'Por favor escribe el nombre de cada peludo (faltan algunos).' : 'Por favor escribe el nombre de tu peludo.');
      });
      Array.prototype.forEach.call(card.querySelectorAll('[data-k=raza]'), function (inp) {
        if (!inp.value.trim()) marca(inp, q > 1 ? 'Por favor indica la raza (o a qué se parece más) de cada peludo, para que el dibujo sea fiel.' : 'Por favor indica su raza, o a qué se parece más, para que el dibujo sea fiel.');
      });
      if (falta) { falta.focus(); $('msg').textContent = msg; return; }
      if (typeof window.addToCart !== 'function') { $('msg').textContent = 'No se ha podido añadir al carrito. Recarga la página e inténtalo de nuevo.'; return; }
      var unit = precioPor(T, q), grupos = {}, orden = [];
      for (var i = 0; i < q; i++) {
        var d = datos[i], nom = d.nombre.trim().replace(/\s+/g, ' '), raza = (d.raza || '').trim().replace(/\s+/g, ' ');
        var animal = '';
        if (T.animales) animal = (d.animal === '__otro' ? d.otroAnimal : d.animal).trim().replace(/\s+/g, ' ');
        var color = d.color === 'si', k = animal + '|' + nom + '|' + raza + '|' + color;
        if (!grupos[k]) { grupos[k] = { animal: animal, nom: nom, raza: raza, color: color, qty: 0 }; orden.push(k); }
        grupos[k].qty++;
      }
      orden.forEach(function (k, idx) {
        var g = grupos[k], opts = {};
        if (T.animales) opts['Animal'] = g.animal;
        opts['Nombre'] = g.nom;
        if (g.raza) opts[T.claveRaza] = g.raza;
        if (g.color) opts['Toque de color pintado a mano · +' + COLOR + ' €/u'] = 'Sí';
        window.addToCart({ id: T.id + '-' + Date.now() + '-' + idx, name: T.nombre, price: unit + (g.color ? COLOR : 0), qty: g.qty, peso: PESO, options: opts });
      });
      $('msg').textContent = '';
    });
    pintarCampos(); precios();
  }

  function init() { Array.prototype.forEach.call(document.querySelectorAll('[data-adorno-mascotas]'), pintar); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
