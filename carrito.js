// ── MAMEMI Madera · Carrito de compra ──
(function() {

  const SHIPPING_COST = 6.00;
  const FREE_SHIPPING_THRESHOLD = 60;
  const PICKUP_DISCOUNT = 2;

  let cart = JSON.parse(localStorage.getItem('mamemi_cart') || '[]');
  let deliveryMode = localStorage.getItem('mamemi_delivery') || 'envio';
  let orderRef = localStorage.getItem('mamemi_orderref') || generateRef();

  function generateRef() {
    const ref = 'MM' + Date.now().toString().slice(-8);
    localStorage.setItem('mamemi_orderref', ref);
    return ref;
  }

  function saveCart() {
    localStorage.setItem('mamemi_cart', JSON.stringify(cart));
    localStorage.setItem('mamemi_delivery', deliveryMode);
    updateCartBadge();
    renderCartPanel();
  }

  window.addToCart = function(product) {
    const existing = cart.find(i => i.id === product.id && JSON.stringify(i.options) === JSON.stringify(product.options));
    if (existing) {
      existing.qty += (product.qty || 1);
    } else {
      cart.push({ ...product, qty: product.qty || 1 });
    }
    // Nueva referencia por cada carrito nuevo
    orderRef = generateRef();
    saveCart();
    showCartNotification(product.name);
  };

  window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
  };

  window.updateQty = function(index, qty) {
    if (qty < 1) { removeFromCart(index); return; }
    cart[index].qty = qty;
    saveCart();
  };

  window.clearCart = function() {
    cart = [];
    orderRef = generateRef();
    saveCart();
  };

  window.setDeliveryMode = function(mode) {
    deliveryMode = mode;
    saveCart();
  };

  function cartSubtotal() {
    return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function getShipping(subtotal) {
    if (deliveryMode === 'tienda') return 0;
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  }

  function getPickupDiscount() {
    if (deliveryMode !== 'tienda' || cart.length === 0) return 0;
    return PICKUP_DISCOUNT;
  }

  function cartTotal() {
    const subtotal = cartSubtotal();
    return subtotal + getShipping(subtotal) - getPickupDiscount();
  }

  function cartCount() {
    return cart.reduce((sum, i) => sum + i.qty, 0);
  }

  function updateCartBadge() {
    const count = cartCount();
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  function showCartNotification(name) {
    let notif = document.getElementById('cart-notif');
    if (!notif) {
      notif = document.createElement('div');
      notif.id = 'cart-notif';
      document.body.appendChild(notif);
    }
    notif.textContent = '✓ ' + name + ' añadido al carrito';
    notif.classList.add('show');
    clearTimeout(notif._t);
    notif._t = setTimeout(() => notif.classList.remove('show'), 2500);
  }

  function getShippingAddress() {
    const f = id => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    return {
      nombre:    f('addr-nombre'),
      calle:     f('addr-calle'),
      numero:    f('addr-numero'),
      bloque:    f('addr-bloque'),
      puerta:    f('addr-puerta'),
      cp:        f('addr-cp'),
      poblacion: f('addr-poblacion'),
      ciudad:    f('addr-ciudad'),
      telefono:  f('addr-telefono'),
      otros:     f('addr-otros'),
    };
  }

  function validateShippingAddress() {
    const required = ['addr-nombre','addr-calle','addr-numero','addr-cp','addr-poblacion','addr-ciudad','addr-telefono'];
    const labels = {
      'addr-nombre':    'Nombre y apellidos',
      'addr-calle':     'Calle / Avenida',
      'addr-numero':    'Número',
      'addr-cp':        'Código postal',
      'addr-poblacion': 'Población',
      'addr-ciudad':    'Ciudad',
      'addr-telefono':  'Teléfono',
    };
    const missing = [];
    required.forEach(id => {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) {
        missing.push(labels[id]);
        if (el) el.style.borderColor = '#e74c3c';
      } else {
        if (el) el.style.borderColor = '#d4a96a';
      }
    });
    return missing;
  }

  function buildOrderSummary(addr) {
    const subtotal = cartSubtotal();
    const shipping = getShipping(subtotal);
    const discount = getPickupDiscount();
    const total = subtotal + shipping - discount;

    let text = `🛍️ NUEVO PEDIDO MAMEMI MADERA\n`;
    text += `Referencia: ${orderRef}\n`;
    text += `────────────────────────\n`;
    text += `PRODUCTOS:\n`;
    cart.forEach(item => {
      text += `• ${item.qty}x ${item.name} — ${(item.price * item.qty).toFixed(2)} €\n`;
      if (item.options) {
        Object.entries(item.options).forEach(([k, v]) => {
          text += `   · ${k}: ${v}\n`;
        });
      }
    });
    text += `────────────────────────\n`;
    text += `Subtotal: ${subtotal.toFixed(2)} €\n`;
    if (deliveryMode === 'tienda') {
      text += `Descuento entrega en persona: −${discount.toFixed(2)} €\n`;
      text += `Entrega: l'Estudi | Caldes d'Estrac\n`;
    } else {
      text += `Envío: ${shipping === 0 ? 'GRATIS' : shipping.toFixed(2) + ' €'}\n`;
      text += `────────────────────────\n`;
      text += `DIRECCIÓN DE ENVÍO:\n`;
      text += `${addr.nombre}\n`;
      text += `${addr.calle}, ${addr.numero}`;
      if (addr.bloque) text += ` · Bloque: ${addr.bloque}`;
      if (addr.puerta) text += ` · Puerta: ${addr.puerta}`;
      text += `\n${addr.cp} ${addr.poblacion}, ${addr.ciudad}\n`;
      text += `Tel: ${addr.telefono}\n`;
      if (addr.otros) text += `Indicaciones: ${addr.otros}\n`;
    }
    text += `────────────────────────\n`;
    text += `TOTAL: ${total.toFixed(2)} €\n`;
    return text;
  }

  window.sendOrderData = function() {
    if (cart.length === 0) return;

    let addr = {};
    if (deliveryMode === 'envio') {
      const missing = validateShippingAddress();
      if (missing.length > 0) {
        alert('Por favor rellena los siguientes campos de envío:\n\n• ' + missing.join('\n• '));
        return;
      }
      addr = getShippingAddress();
    }

    const summary = buildOrderSummary(addr);

    // 1. WhatsApp
    const waMsg = encodeURIComponent(summary);
    window.open('https://wa.me/34622562499?text=' + waMsg, '_blank');

    // 2. Email (mailto como fallback)
    const mailSubject = encodeURIComponent('Pedido MAMEMI Madera · Ref: ' + orderRef);
    const mailBody = encodeURIComponent(summary);
    setTimeout(() => {
      window.open('mailto:hola@mamemimadera.es?subject=' + mailSubject + '&body=' + mailBody, '_blank');
    }, 1000);

    // Marcar que ya se enviaron los datos
    localStorage.setItem('mamemi_datasent', orderRef);
    renderCartPanel();
  };

  window.checkout = function() {
    if (cart.length === 0) return;

    // Verificar que se enviaron los datos primero
    const dataSent = localStorage.getItem('mamemi_datasent');
    if (dataSent !== orderRef) {
      alert('Por favor envía primero los datos del pedido a Leticia usando el botón "Enviar datos del pedido" antes de proceder al pago.');
      return;
    }

    // Validar dirección si es envío
    if (deliveryMode === 'envio') {
      const missing = validateShippingAddress();
      if (missing.length > 0) {
        alert('Por favor rellena los campos de envío obligatorios:\n\n• ' + missing.join('\n• '));
        return;
      }
    }

    const subtotal = cartSubtotal();
    const shipping = getShipping(subtotal);
    const discount = getPickupDiscount();
    const finalTotal = (subtotal + shipping - discount) * 100;
    const items = cart.map(i => `${i.qty}x ${i.name}`).join(', ');

    const addr = deliveryMode === 'envio' ? getShippingAddress() : {};

    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'pago.php';
    form.style.display = 'none';

    const fields = {
      amount:      Math.round(finalTotal),
      order:       orderRef,
      description: items.substring(0, 125),
      cart:        JSON.stringify(cart),
      delivery:    deliveryMode,
      address:     JSON.stringify(addr),
    };

    Object.entries(fields).forEach(([k, v]) => {
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = k;
      input.value = v;
      form.appendChild(input);
    });

    document.body.appendChild(form);
    form.submit();
  };

  function renderCartPanel() {
    const panel = document.getElementById('cart-panel');
    if (!panel) return;

    const subtotal = cartSubtotal();
    const shipping = getShipping(subtotal);
    const discount = getPickupDiscount();
    const finalTotal = subtotal + shipping - discount;
    const dataSent = localStorage.getItem('mamemi_datasent') === orderRef;

    const envioBtn = panel.querySelector('.delivery-btn[data-mode="envio"]');
    const tiendaBtn = panel.querySelector('.delivery-btn[data-mode="tienda"]');
    if (envioBtn && tiendaBtn) {
      envioBtn.classList.toggle('active', deliveryMode === 'envio');
      tiendaBtn.classList.toggle('active', deliveryMode === 'tienda');
    }

    // Mostrar/ocultar formulario de dirección
    const addrForm = panel.querySelector('.cart-address-form');
    if (addrForm) addrForm.style.display = deliveryMode === 'envio' ? 'block' : 'none';

    if (cart.length === 0) {
      panel.querySelector('.cart-items').innerHTML = `
        <div class="cart-empty">
          <span>🛒</span>
          <p>Tu carrito está vacío</p>
          <p class="cart-empty-sub">¡Añade algo bonito!</p>
        </div>`;
      panel.querySelector('.cart-footer').style.display = 'none';
      return;
    }

    panel.querySelector('.cart-footer').style.display = 'block';

    let html = '';
    cart.forEach((item, i) => {
      const optStr = item.options ? Object.entries(item.options).map(([k,v]) => `<span>${k}: ${v}</span>`).join('') : '';
      html += `
        <div class="cart-item">
          <div class="cart-item-info">
            <p class="cart-item-name">${item.name}</p>
            ${optStr ? `<div class="cart-item-opts">${optStr}</div>` : ''}
            <p class="cart-item-price">${item.price.toFixed(2)} € / u</p>
          </div>
          <div class="cart-item-controls">
            <button onclick="updateQty(${i}, ${item.qty - 1})">−</button>
            <span>${item.qty}</span>
            <button onclick="updateQty(${i}, ${item.qty + 1})">+</button>
            <button class="cart-remove" onclick="removeFromCart(${i})">✕</button>
          </div>
          <p class="cart-item-subtotal">${(item.price * item.qty).toFixed(2)} €</p>
        </div>`;
    });

    panel.querySelector('.cart-items').innerHTML = html;
    panel.querySelector('.cart-subtotal').textContent = subtotal.toFixed(2) + ' €';

    const shippingRow = panel.querySelector('.cart-shipping-row');
    const discountRow = panel.querySelector('.cart-discount-row');

    if (deliveryMode === 'tienda') {
      shippingRow.style.display = 'none';
      discountRow.style.display = 'flex';
      panel.querySelector('.cart-discount').textContent = '− ' + discount.toFixed(2) + ' €';
    } else {
      shippingRow.style.display = 'flex';
      discountRow.style.display = 'none';
      panel.querySelector('.cart-shipping').textContent = shipping === 0 ? '¡Gratis! 🎉' : shipping.toFixed(2) + ' €';
    }

    panel.querySelector('.cart-final').textContent = finalTotal.toFixed(2) + ' €';

    const note = panel.querySelector('.cart-shipping-note');
    if (deliveryMode === 'tienda') {
      note.innerHTML = `🎀 Envoltorio mimado para entregar como regalo · Recogida en <a href="https://maps.app.goo.gl/W1SzAuzFyPJjTitc8" target="_blank" style="color:#6a9e8a;font-weight:700;">l'Estudi | Caldes d'Estrac</a>`;
      note.style.color = '#6a9e8a';
    } else if (shipping === 0) {
      note.textContent = '🎀 Envoltorio mimado para entregar como regalo · ¡Envío gratis!';
      note.style.color = '#6a9e8a';
    } else {
      const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
      note.innerHTML = `🎀 Envoltorio mimado para entregar como regalo<br><span style="color:#d4a96a;">✦ Añade ${remaining} € más para envío gratis</span>`;
      note.style.color = '#6b4c2a';
    }

    // Referencia del pedido
    const refEl = panel.querySelector('.cart-ref');
    if (refEl) refEl.textContent = 'Ref. ' + orderRef;

    // Botón enviar datos
    const sendBtn = panel.querySelector('.cart-send-btn');
    if (sendBtn) {
      if (dataSent) {
        sendBtn.textContent = '✅ Datos enviados · Ref. ' + orderRef;
        sendBtn.style.background = '#6a9e8a';
        sendBtn.disabled = false;
      } else {
        sendBtn.textContent = '📩 Enviar datos del pedido a Leticia';
        sendBtn.style.background = '#d4a96a';
        sendBtn.disabled = false;
      }
    }

    // Botón pagar
    const payBtn = panel.querySelector('.cart-pay-btn');
    if (payBtn) {
      if (dataSent) {
        payBtn.style.opacity = '1';
        payBtn.style.cursor = 'pointer';
      } else {
        payBtn.style.opacity = '0.5';
        payBtn.style.cursor = 'not-allowed';
      }
    }
  }

  window.toggleCart = function() {
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    if (!panel) return;
    const open = panel.classList.toggle('open');
    overlay.classList.toggle('open', open);
    if (open) renderCartPanel();
  };

  window.closeCart = function() {
    document.getElementById('cart-panel')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('open');
  };

  function injectCartUI() {
    const style = document.createElement('style');
    style.textContent = `
      .cart-btn { background: #6a9e8a; color: #fff; border: none; outline: none; border-radius: 30px; padding: 0.5rem 1.2rem; font-family: 'Nunito', sans-serif; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 0.4rem; transition: background 0.25s; letter-spacing: 0.08em; text-transform: uppercase; position: relative; box-shadow: none; }
      .cart-btn:hover { background: #4d8a72; }
      .cart-btn:focus { outline: none; box-shadow: none; }
      .cart-badge { background: #e74c3c; color: #fff; border-radius: 50%; width: 20px; height: 20px; font-size: 0.72rem; font-weight: 700; display: none; align-items: center; justify-content: center; }
      .cart-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 950; backdrop-filter: blur(3px); }
      .cart-overlay.open { display: block; }
      #cart-panel { position: fixed; right: -420px; top: 0; bottom: 0; width: min(420px, 100vw); background: #fff; z-index: 1000; box-shadow: -4px 0 30px rgba(90,58,26,0.15); display: flex; flex-direction: column; transition: right 0.35s ease; font-family: 'Nunito', sans-serif; }
      #cart-panel.open { right: 0; }
      .cart-header { padding: 1.2rem 1.5rem; border-bottom: 1.5px solid #f5e9d6; display: flex; align-items: center; justify-content: space-between; background: #fdf8f0; }
      .cart-header h2 { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #5a3a1a; }
      .cart-header-sub { font-size: 0.78rem; color: #6b4c2a; font-weight: 300; }
      .cart-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b4c2a; padding: 0.2rem 0.5rem; border-radius: 6px; transition: background 0.2s; }
      .cart-close:hover { background: #f5e9d6; }
      .delivery-selector { display: flex; gap: 0.5rem; padding: 0.8rem 1.5rem; background: #f9f2e4; border-bottom: 1.5px solid #f5e9d6; }
      .delivery-btn { flex: 1; padding: 0.5rem 0.6rem; border: 1.5px solid #f5e9d6; border-radius: 10px; background: #fff; font-family: 'Nunito', sans-serif; font-size: 0.72rem; font-weight: 700; cursor: pointer; text-align: center; color: #6b4c2a; transition: all 0.2s; letter-spacing: 0.04em; line-height: 1.4; }
      .delivery-btn:hover { border-color: #d4a96a; }
      .delivery-btn.active { background: #8b5e3c; color: #fff; border-color: #8b5e3c; }
      .delivery-btn .delivery-icon { font-size: 1rem; display: block; margin-bottom: 0.2rem; }
      .delivery-btn .delivery-price { font-size: 0.68rem; font-weight: 400; opacity: 0.85; }

      /* Formulario dirección */
      .cart-address-form { padding: 0.8rem 1.5rem; background: #f0f7f4; border-bottom: 1.5px solid #f5e9d6; }
      .cart-address-title { font-size: 0.72rem; font-weight: 700; color: #5a3a1a; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.6rem; }
      .addr-input { width: 100%; padding: 0.4rem 0.6rem; border-radius: 7px; border: 1.5px solid #d4a96a; font-family: 'Nunito', sans-serif; font-size: 0.8rem; color: #3a2510; margin-bottom: 0.4rem; box-sizing: border-box; background: #fff; outline: none; }
      .addr-input:focus { border-color: #6a9e8a; }
      .addr-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; }
      .addr-row-3 { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 0.4rem; }

      .cart-items { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; }
      .cart-empty { text-align: center; padding: 3rem 1rem; color: #6b4c2a; }
      .cart-empty span { font-size: 3rem; display: block; margin-bottom: 0.8rem; }
      .cart-empty p { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.3rem; }
      .cart-empty-sub { font-size: 0.82rem; font-weight: 300 !important; }
      .cart-item { display: grid; grid-template-columns: 1fr auto auto; gap: 0.5rem; align-items: start; padding: 0.9rem 0; border-bottom: 1px dashed #f5e9d6; }
      .cart-item:last-child { border-bottom: none; }
      .cart-item-name { font-size: 0.88rem; font-weight: 700; color: #3a2510; margin-bottom: 0.2rem; }
      .cart-item-opts { display: flex; flex-wrap: wrap; gap: 0.3rem; margin-bottom: 0.2rem; }
      .cart-item-opts span { font-size: 0.72rem; background: #e0ede8; color: #2d6a4f; padding: 0.15rem 0.5rem; border-radius: 10px; }
      .cart-item-price { font-size: 0.78rem; color: #6b4c2a; font-weight: 300; }
      .cart-item-controls { display: flex; align-items: center; gap: 0.3rem; }
      .cart-item-controls button { background: #f5e9d6; border: none; border-radius: 6px; width: 26px; height: 26px; font-size: 0.9rem; cursor: pointer; font-weight: 700; color: #5a3a1a; transition: background 0.2s; }
      .cart-item-controls button:hover { background: #d4a96a; color: #fff; }
      .cart-item-controls span { font-size: 0.88rem; font-weight: 700; min-width: 20px; text-align: center; color: #3a2510; }
      .cart-remove { color: #e74c3c !important; }
      .cart-item-subtotal { font-size: 0.9rem; font-weight: 700; color: #8b5e3c; text-align: right; white-space: nowrap; }
      .cart-footer { padding: 1.2rem 1.5rem; border-top: 1.5px solid #f5e9d6; background: #fdf8f0; }
      .cart-totals { margin-bottom: 0.8rem; }
      .cart-total-row { display: flex; justify-content: space-between; font-size: 0.84rem; color: #6b4c2a; padding: 0.2rem 0; }
      .cart-total-row.discount { color: #6a9e8a; font-weight: 600; }
      .cart-total-row.final { font-size: 1rem; font-weight: 700; color: #5a3a1a; border-top: 1px solid #f5e9d6; padding-top: 0.6rem; margin-top: 0.3rem; }
      .cart-ref { font-size: 0.7rem; color: #6b4c2a; text-align: center; margin-bottom: 0.5rem; font-style: italic; }
      .cart-shipping-note { font-size: 0.74rem; font-style: italic; margin-bottom: 0.8rem; text-align: center; }
      .cart-send-btn { display: block; width: 100%; padding: 0.85rem; background: #d4a96a; color: #fff; border: none; border-radius: 30px; font-family: 'Nunito', sans-serif; font-size: 0.82rem; font-weight: 700; cursor: pointer; letter-spacing: 0.06em; text-transform: uppercase; transition: background 0.25s; margin-bottom: 0.5rem; }
      .cart-send-btn:hover { background: #b8903a; }
      .cart-pay-btn { display: block; width: 100%; padding: 0.9rem; background: #8b5e3c; color: #fff; border: none; border-radius: 30px; font-family: 'Nunito', sans-serif; font-size: 0.88rem; font-weight: 700; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: background 0.25s; margin-bottom: 0.6rem; }
      .cart-pay-btn:hover { background: #6a9e8a; }
      .cart-pay-sub { font-size: 0.72rem; color: #6b4c2a; text-align: center; }
      .cart-pay-methods { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.4rem; }
      .cart-pay-methods span { font-size: 0.7rem; background: #f5e9d6; padding: 0.2rem 0.6rem; border-radius: 10px; color: #5a3a1a; font-weight: 600; }
      #cart-notif { position: fixed; bottom: 6rem; right: 1.5rem; z-index: 1100; background: #5a3a1a; color: #fff; padding: 0.7rem 1.2rem; border-radius: 30px; font-family: 'Nunito', sans-serif; font-size: 0.82rem; font-weight: 600; opacity: 0; transform: translateY(10px); transition: all 0.3s; pointer-events: none; }
      #cart-notif.show { opacity: 1; transform: translateY(0); }
      .btn-add-cart { display: block; width: 100%; margin-top: 0.6rem; padding: 0.65rem 1rem; background: var(--mint-dark, #6a9e8a); color: #fff; border: none; border-radius: 30px; font-family: 'Nunito', sans-serif; font-size: 0.78rem; font-weight: 700; cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase; transition: background 0.25s; }
      .btn-add-cart:hover { background: var(--wood-dark, #8b5e3c); }
    `;
    document.head.appendChild(style);

    const overlay = document.createElement('div');
    overlay.id = 'cart-overlay';
    overlay.className = 'cart-overlay';
    overlay.onclick = closeCart;
    document.body.appendChild(overlay);

    const panel = document.createElement('div');
    panel.id = 'cart-panel';
    panel.innerHTML = `
      <div class="cart-header">
        <div>
          <h2>Tu carrito 🛒</h2>
          <p class="cart-header-sub">Hecho con amor, para ti 🌿</p>
        </div>
        <button class="cart-close" onclick="closeCart()">✕</button>
      </div>
      <div class="delivery-selector">
        <button class="delivery-btn active" data-mode="envio" onclick="setDeliveryMode('envio')">
          <span class="delivery-icon">🚚</span>
          Envío a domicilio
          <span class="delivery-price">6 € (gratis +60 €)</span>
        </button>
        <button class="delivery-btn" data-mode="tienda" onclick="setDeliveryMode('tienda')">
          <span class="delivery-icon">🏪</span>
          Entrega en persona
          <span class="delivery-price">− 2 € · El Estudi</span>
        </button>
      </div>
      <div class="cart-address-form" style="display:block;">
        <p class="cart-address-title">📦 Dirección de envío</p>
        <input id="addr-nombre" class="addr-input" type="text" placeholder="* Nombre y apellidos">
        <div class="addr-row-3">
          <input id="addr-calle" class="addr-input" type="text" placeholder="* Calle / Avda. / Pasaje" style="margin:0;">
          <input id="addr-numero" class="addr-input" type="text" placeholder="* Nº" style="margin:0;">
          <input id="addr-bloque" class="addr-input" type="text" placeholder="Bloque" style="margin:0;">
        </div>
        <div class="addr-row" style="margin-top:0.4rem;">
          <input id="addr-puerta" class="addr-input" type="text" placeholder="Puerta" style="margin:0;">
          <input id="addr-cp" class="addr-input" type="text" placeholder="* C.P." style="margin:0;">
        </div>
        <div class="addr-row" style="margin-top:0.4rem;">
          <input id="addr-poblacion" class="addr-input" type="text" placeholder="* Población" style="margin:0;">
          <input id="addr-ciudad" class="addr-input" type="text" placeholder="* Ciudad" style="margin:0;">
        </div>
        <input id="addr-telefono" class="addr-input" type="tel" placeholder="* Teléfono de contacto" style="margin-top:0.4rem;">
        <input id="addr-otros" class="addr-input" type="text" placeholder="Otras indicaciones (timbre, piso, horario...)" style="margin-top:0.4rem;">
      </div>
      <div class="cart-items"><div class="cart-empty"><span>🛒</span><p>Tu carrito está vacío</p><p class="cart-empty-sub">¡Añade algo bonito!</p></div></div>
      <div class="cart-footer" style="display:none;">
        <div class="cart-totals">
          <div class="cart-total-row"><span>Subtotal</span><span class="cart-subtotal">0,00 €</span></div>
          <div class="cart-total-row cart-shipping-row"><span>Envío</span><span class="cart-shipping">6,00 €</span></div>
          <div class="cart-total-row discount cart-discount-row" style="display:none;"><span>Entrega en persona</span><span class="cart-discount">− 2,00 €</span></div>
          <div class="cart-total-row final"><span>Total</span><span class="cart-final">0,00 €</span></div>
        </div>
        <p class="cart-shipping-note"></p>
        <p class="cart-ref"></p>
        <button class="cart-send-btn" onclick="sendOrderData()">📩 Enviar datos del pedido a Leticia</button>
        <button class="cart-pay-btn" onclick="checkout()" style="opacity:0.5;cursor:not-allowed;">Pagar ahora</button>
        <div class="cart-pay-sub">
          <p>Pago 100% seguro · Tus datos bancarios nunca los vemos nosotros</p>
          <div class="cart-pay-methods">
            <span>💳 Tarjeta</span>
            <span>Bizum</span>
            <span>🔒 Redsys</span>
          </div>
        </div>
      </div>`;
    document.body.appendChild(panel);

    updateCartBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCartUI);
  } else {
    injectCartUI();
  }

})();
