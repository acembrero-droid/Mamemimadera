// ── MAMEMI Madera · Carrito de compra ──
(function() {

  const SHIPPING_COST = 6.00;
  const FREE_SHIPPING_THRESHOLD = 60;
  const PICKUP_DISCOUNT = 2.00; // descuento por recogida en tienda

  let cart = JSON.parse(localStorage.getItem('mamemi_cart') || '[]');
  let deliveryMode = localStorage.getItem('mamemi_delivery') || 'envio';
  let orderRef = localStorage.getItem('mamemi_orderref') || generateRef();
  let currentStep = 1; // 1: carrito, 2: dirección, 3: resumen

  function generateRef() {
    const ref = 'MM' + Date.now().toString().slice(-8);
    localStorage.setItem('mamemi_orderref', ref);
    return ref;
  }

  function saveCart() {
    localStorage.setItem('mamemi_cart', JSON.stringify(cart));
    localStorage.setItem('mamemi_delivery', deliveryMode);
    updateCartBadge();
    renderStep();
  }

  window.addToCart = function(product) {
    const existing = cart.find(i => i.id === product.id && JSON.stringify(i.options) === JSON.stringify(product.options));
    if (existing) {
      existing.qty += (product.qty || 1);
    } else {
      cart.push({ ...product, qty: product.qty || 1 });
    }
    orderRef = generateRef();
    localStorage.removeItem('mamemi_datasent');
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
    localStorage.removeItem('mamemi_datasent');
    saveCart();
  };

  window.setDeliveryMode = function(mode) {
    deliveryMode = mode;
    saveCart();
  };

  function cartSubtotal() {
    return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function getBaseImponible(amount) {
    return amount / 1.21;
  }

  function getIVA(amount) {
    return amount - getBaseImponible(amount);
  }

  function getTotalSinDescuento(subtotal, shipping) {
    return subtotal + shipping;
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
    const shipping = getShipping(subtotal);
    if (deliveryMode === 'tienda') {
      return subtotal - getPickupDiscount();
    }
    return subtotal + shipping;
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

  function getAddrVal(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : '';
  }

  function getShippingAddress() {
    return {
      nombre:    getAddrVal('addr-nombre'),
      calle:     getAddrVal('addr-calle'),
      numero:    getAddrVal('addr-numero'),
      bloque:    getAddrVal('addr-bloque'),
      puerta:    getAddrVal('addr-puerta'),
      cp:        getAddrVal('addr-cp'),
      poblacion: getAddrVal('addr-poblacion'),
      ciudad:    getAddrVal('addr-ciudad'),
      telefono:  getAddrVal('addr-telefono'),
      email:     getAddrVal('addr-email'),
      otros:     getAddrVal('addr-otros'),
    };
  }

  function validateShippingAddress() {
    const required = {
      'addr-nombre':    'Nombre y apellidos',
      'addr-calle':     'Calle / Avenida',
      'addr-numero':    'Número',
      'addr-cp':        'Código postal',
      'addr-poblacion': 'Población',
      'addr-ciudad':    'Ciudad',
      'addr-telefono':  'Teléfono',
      'addr-email':     'Email de contacto',
    };
    const missing = [];
    Object.entries(required).forEach(([id, label]) => {
      const el = document.getElementById(id);
      if (!el || !el.value.trim()) {
        missing.push(label);
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
    const total = cartTotal();

    let text = `🛍️ NUEVO PEDIDO MAMEMI MADERA\n`;
    text += `Referencia: ${orderRef}\n`;
    text += `────────────────────────\n`;
    text += `PRODUCTOS:\n`;
    cart.forEach(item => {
      text += `• ${item.qty}x ${item.name} — ${(item.price * item.qty).toFixed(2)} €\n`;
      if (item.options) {
        Object.entries(item.options).forEach(([k, v]) => { text += `   · ${k}: ${v}\n`; });
      }
    });
    text += `────────────────────────\n`;
    if (deliveryMode === 'tienda') {
      text += `Producto (IVA incluido): ${subtotal.toFixed(2)} €\n`;
      text += `Precio especial recogida en tienda: −${discount.toFixed(2)} €\n`;
      text += `(Sin gastos añadidos del embalaje y la gestión de la contratación del envío)\n`;
      text += `Entrega: Estudi | Caldes d'Estrac\n`;
    } else {
      text += `Producto (IVA incluido): ${subtotal.toFixed(2)} €\n`;
      text += `Envío: ${shipping === 0 ? 'GRATIS' : shipping.toFixed(2) + ' €'}\n`;
      text += `────────────────────────\n`;
      text += `DIRECCIÓN DE ENVÍO:\n`;
      text += `${addr.nombre}\n`;
      text += `${addr.calle}, ${addr.numero}`;
      if (addr.bloque) text += ` · Bloque: ${addr.bloque}`;
      if (addr.puerta) text += ` · Puerta: ${addr.puerta}`;
      text += `\n${addr.cp} ${addr.poblacion}, ${addr.ciudad}\n`;
      text += `Tel: ${addr.telefono}\n`;
      if (addr.email) text += `Email: ${addr.email}\n`;
      if (addr.otros) text += `Indicaciones: ${addr.otros}\n`;
    }
    text += `────────────────────────\n`;
    text += `TOTAL: ${total.toFixed(2)} €\n`;
    return text;
  }

  window.goToStep = function(step) {
    if (step === 2 && deliveryMode === 'tienda') {
      // Saltamos dirección si es recogida en tienda
      currentStep = 3;
    } else {
      currentStep = step;
    }
    renderStep();
  };

  window.sendOrderData = function() {
    const addr = deliveryMode === 'envio' ? getShippingAddress() : {};
    const summary = buildOrderSummary(addr);

    // WhatsApp
    window.open('https://wa.me/34622562499?text=' + encodeURIComponent(summary), '_blank');

    // Email con delay
    setTimeout(() => {
      const mailSubject = encodeURIComponent('Pedido MAMEMI Madera · Ref: ' + orderRef);
      const mailBody = encodeURIComponent(summary);
      window.open('mailto:hola@mamemimadera.es?subject=' + mailSubject + '&body=' + mailBody, '_blank');
    }, 1000);

    localStorage.setItem('mamemi_datasent', orderRef);
    renderStep();
  };

  // ═══════════════════════════════════════════════════════
  // LÓGICA DE PAGO ACTUALIZADA (CONECTADA A CLOUDFLARE)
  // ═══════════════════════════════════════════════════════
  window.checkout = async function() {
    if (cart.length === 0) return;

    const dataSent = localStorage.getItem('mamemi_datasent');
    if (dataSent !== orderRef) {
      alert('Por favor envía primero los datos del pedido a Leticia.');
      return;
    }

    const subtotal = cartSubtotal();
    const shipping = getShipping(subtotal);
    const discount = getPickupDiscount();
    // Redsys exige el importe en céntimos
    const finalTotalCentimos = Math.round((subtotal + shipping - discount) * 100); 

    // OBTENER EL BOTÓN Y CAMBIAR SU ESTADO
    const payBtn = document.querySelector('.cart-pay-btn');
    const textoOriginalBoton = payBtn ? payBtn.innerHTML : '';
    if (payBtn) {
        payBtn.innerText = "⏳ Conectando con el banco...";
        payBtn.style.opacity = '0.7';
        payBtn.style.cursor = 'wait';
        payBtn.disabled = true;
    }

    // REDSYS: El número de pedido debe empezar por al menos 4 dígitos numéricos.
    // Como tu orderRef es "MM12345678", extraemos solo los números para evitar bloqueos del banco.
    const redsysOrder = orderRef.replace(/\D/g, ''); 

    try {
        // 1. LLAMADA A TU WORKER DE CLOUDFLARE
        const respuesta = await fetch('https://api-pagos.a-cembrero.workers.dev/api/generar-firma', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                importe: finalTotalCentimos,
                pedido: redsysOrder 
            }) 
        });

        if (!respuesta.ok) throw new Error("Error en la conexión con el servidor seguro");
        const datosFirma = await respuesta.json();
        
      // 2. CREACIÓN DEL FORMULARIO INVISIBLE
        const form = document.createElement('form');
        form.method = 'POST';
        // URL de pruebas de Redsys
        form.action = 'https://sis-t.redsys.es:25443/sis/realizarPago'; 

        const addInput = (name, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        };

        addInput('Ds_MerchantParameters', datosFirma.Ds_MerchantParameters);
        addInput('Ds_SignatureVersion', 'HMAC_SHA256_V1');
        addInput('Ds_Signature', datosFirma.Ds_Signature);

        // 3. ENVÍO AL BANCO
        document.body.appendChild(form);
        form.submit();

    } catch (error) {
        console.error("Error al procesar el pago:", error);
        alert("Hubo un problema de conexión con la pasarela segura. Por favor, inténtelo de nuevo.");
        
        // Si hay error, restauramos el botón
        if (payBtn) {
            payBtn.innerHTML = textoOriginalBoton;
            payBtn.style.opacity = '1';
            payBtn.style.cursor = 'pointer';
            payBtn.disabled = false;
        }
    }
  };
  // ═══════════════════════════════════════════════════════


  // ── RENDER STEPS ──
  function renderStep() {
    const panel = document.getElementById('cart-panel');
    if (!panel) return;

    const body = panel.querySelector('.cart-body');
    if (!body) return;

    if (cart.length === 0) {
      currentStep = 1;
    }

    // Update step indicators
    panel.querySelectorAll('.step-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i + 1 === currentStep);
      dot.classList.toggle('done', i + 1 < currentStep);
    });

    switch(currentStep) {
      case 1: renderStep1(body); break;
      case 2: renderStep2(body); break;
      case 3: renderStep3(body); break;
    }
  }

  function renderStep1(body) {
    const subtotal = cartSubtotal();
    const shipping = getShipping(subtotal);
    const discount = getPickupDiscount();
    const total = cartTotal();

    if (cart.length === 0) {
      body.innerHTML = `
        <div class="cart-empty">
          <span>🛒</span>
          <p>Tu carrito está vacío</p>
          <p class="cart-empty-sub">¡Añade algo bonito!</p>
        </div>`;
      return;
    }

    let itemsHtml = '';
    cart.forEach((item, i) => {
      const optStr = item.options ? Object.entries(item.options).map(([k,v]) => `<span>${k}: ${v}</span>`).join('') : '';
      itemsHtml += `
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

    const shippingLine = deliveryMode === 'tienda'
      ? `<div class="cart-total-row discount"><span>Entrega en persona</span><span>− ${discount.toFixed(2)} €</span></div>`
      : `<div class="cart-total-row"><span>Envío</span><span>${shipping === 0 ? '¡Gratis! 🎉' : shipping.toFixed(2) + ' €'}</span></div>`;

    let noteHtml = '';
    if (deliveryMode === 'tienda') {
      noteHtml = `🎀 Envoltorio mimado · Recogida en <a href="https://maps.app.goo.gl/W1SzAuzFyPJjTitc8" target="_blank" style="color:#6a9e8a;font-weight:700;">Estudi | Caldes d'Estrac</a><br><span style="font-size:0.68rem;opacity:0.75;">✦ Al recoger en persona te ahorras los gastos añadidos del embalaje y la gestión de la contratación del envío, por eso el precio es más bajo</span>`;
    } else if (shipping === 0) {
      noteHtml = `🎀 Envoltorio mimado para entregar como regalo · ¡Envío gratis!`;
    } else {
      const remaining = (FREE_SHIPPING_THRESHOLD - subtotal).toFixed(2);
      noteHtml = `🎀 Envoltorio mimado para entregar como regalo<br><span style="color:#d4a96a;">✦ Añade ${remaining} € más para envío gratis</span>`;
    }

    body.innerHTML = `
      <div class="delivery-selector">
        <button class="delivery-btn ${deliveryMode === 'envio' ? 'active' : ''}" onclick="setDeliveryMode('envio')">
          <span class="delivery-icon">🚚</span>
          Envío a domicilio
        </button>
        <button class="delivery-btn ${deliveryMode === 'tienda' ? 'active' : ''}" onclick="setDeliveryMode('tienda')">
          <span class="delivery-icon">🤝</span>
          Entrega en persona
        </button>
      </div>
      <div class="cart-items-list">${itemsHtml}</div>
      <div class="cart-step-footer">
        <div class="cart-totals">
          ${deliveryMode === 'tienda'
            ? `<div class="cart-total-row"><span>Producto (IVA incluido)</span><span>${subtotal.toFixed(2)} €</span></div>
               <div class="cart-total-row discount"><span>Precio especial recogida en tienda</span><span>− ${discount.toFixed(2)} €</span></div>
               <div class="cart-total-row" style="font-size:0.7rem;opacity:0.75;font-style:italic;"><span>· Sin gastos añadidos del embalaje y la gestión de la contratación del envío</span><span></span></div>`
            : `<div class="cart-total-row"><span>Producto (IVA incluido)</span><span>${subtotal.toFixed(2)} €</span></div>
               <div class="cart-total-row"><span>Envío</span><span>${shipping === 0 ? '¡Gratis! 🎉' : shipping.toFixed(2) + ' €'}</span></div>`
          }
          <div class="cart-total-row final"><span>Total</span><span>${total.toFixed(2)} €</span></div>
        </div>
        <p class="cart-note">${noteHtml}</p>
        <button class="cart-next-btn" onclick="goToStep(${deliveryMode === 'tienda' ? 3 : 2})">
          ${deliveryMode === 'tienda' ? 'Revisar pedido →' : 'Dirección de envío →'}
        </button>
      </div>`;
  }

  function renderStep2(body) {
    // Recover saved values if any
    const saved = JSON.parse(localStorage.getItem('mamemi_address') || '{}');
    const v = (key, placeholder) => `value="${saved[key] || ''}" placeholder="${placeholder}"`;

    body.innerHTML = `
      <div class="cart-step-header">
        <button class="cart-back-step" onclick="goToStep(1)">← Volver al carrito</button>
        <p class="cart-step-title">📦 Dirección de envío</p>
        <p class="cart-step-sub">* Campos obligatorios</p>
      </div>
      <div class="cart-addr-form">
        <input id="addr-nombre" class="addr-input" type="text" ${v('nombre','* Nombre y apellidos')}>
        <div class="addr-row-3">
          <input id="addr-calle" class="addr-input" type="text" ${v('calle','* Calle / Avda. / Pasaje')} style="margin:0;">
          <input id="addr-numero" class="addr-input" type="text" ${v('numero','* Nº')} style="margin:0;">
          <input id="addr-bloque" class="addr-input" type="text" ${v('bloque','Bloque')} style="margin:0;">
        </div>
        <div class="addr-row" style="margin-top:0.4rem;">
          <input id="addr-puerta" class="addr-input" type="text" ${v('puerta','Puerta')} style="margin:0;">
          <input id="addr-cp" class="addr-input" type="text" ${v('cp','* C.P.')} style="margin:0;">
        </div>
        <div class="addr-row" style="margin-top:0.4rem;">
          <input id="addr-poblacion" class="addr-input" type="text" ${v('poblacion','* Población')} style="margin:0;">
          <input id="addr-ciudad" class="addr-input" type="text" ${v('ciudad','* Ciudad')} style="margin:0;">
        </div>
        <input id="addr-telefono" class="addr-input" type="tel" ${v('telefono','* Teléfono de contacto')} style="margin-top:0.4rem;">
        <input id="addr-email" class="addr-input" type="email" ${v('email','* Email de contacto')} style="margin-top:0.4rem;">
        <input id="addr-otros" class="addr-input" type="text" ${v('otros','Otras indicaciones (timbre, piso, horario...)')} style="margin-top:0.4rem;">
      </div>
      <div class="cart-step-footer">
        <button class="cart-next-btn" onclick="saveAddressAndContinue()">Revisar pedido →</button>
      </div>`;
  }

  window.saveAddressAndContinue = function() {
    const missing = validateShippingAddress();
    if (missing.length > 0) {
      alert('Por favor rellena los siguientes campos:\n\n• ' + missing.join('\n• '));
      return;
    }
    // Save address to localStorage so it persists
    const addr = getShippingAddress();
    localStorage.setItem('mamemi_address', JSON.stringify(addr));
    currentStep = 3;
    renderStep();
  };

  function renderStep3(body) {
    const subtotal = cartSubtotal();
    const shipping = getShipping(subtotal);
    const discount = getPickupDiscount();
    const total = cartTotal();
    const dataSent = localStorage.getItem('mamemi_datasent') === orderRef;
    const addr = deliveryMode === 'envio'
      ? JSON.parse(localStorage.getItem('mamemi_address') || '{}')
      : {};

    let itemsSummary = cart.map(item => {
      const opts = item.options ? Object.entries(item.options).map(([k,v]) => `${k}: ${v}`).join(' · ') : '';
      return `<div class="summary-item"><span>${item.qty}x ${item.name}${opts ? '<br><small style="color:#8b5e3c;">' + opts + '</small>' : ''}</span><span>${(item.price * item.qty).toFixed(2)} €</span></div>`;
    }).join('');

    let addrSummary = '';
    if (deliveryMode === 'envio' && addr.nombre) {
      addrSummary = `
        <div class="summary-block">
          <p class="summary-label">📦 Dirección de envío <button class="edit-link" onclick="goToStep(2)">Editar</button></p>
          <p>${addr.nombre}<br>${addr.calle} ${addr.numero}${addr.bloque ? ', Bl. ' + addr.bloque : ''}${addr.puerta ? ', Pta. ' + addr.puerta : ''}<br>${addr.cp} ${addr.poblacion}, ${addr.ciudad}<br>Tel: ${addr.telefono}${addr.email ? '<br>' + addr.email : ''}${addr.otros ? '<br><em>' + addr.otros + '</em>' : ''}</p>
        </div>`;
    } else if (deliveryMode === 'tienda') {
      addrSummary = `
        <div class="summary-block">
          <p class="summary-label">🏪 Entrega en persona</p>
          <p><a href="https://maps.app.goo.gl/W1SzAuzFyPJjTitc8" target="_blank" style="color:#6a9e8a;font-weight:700;">Estudi | Caldes d'Estrac</a></p>
        </div>`;
    }

    const shippingLine = deliveryMode === 'tienda'
      ? `<div class="cart-total-row discount"><span>Entrega en persona</span><span>− ${discount.toFixed(2)} €</span></div>`
      : `<div class="cart-total-row"><span>Envío</span><span>${shipping === 0 ? '¡Gratis! 🎉' : shipping.toFixed(2) + ' €'}</span></div>`;

    body.innerHTML = `
      <div class="cart-step-header">
        <button class="cart-back-step" onclick="goToStep(${deliveryMode === 'tienda' ? 1 : 2})">← Volver</button>
        <p class="cart-step-title">✦ Resumen del pedido</p>
        <p class="cart-ref-line">Ref. ${orderRef}</p>
      </div>
      <div class="summary-items">${itemsSummary}</div>
      ${addrSummary}
      <div class="cart-totals" style="padding:0.8rem 1.5rem;border-top:1px dashed #f5e9d6;">
        ${deliveryMode === 'tienda'
          ? `<div class="cart-total-row"><span>Producto (IVA incluido)</span><span>${subtotal.toFixed(2)} €</span></div>
             <div class="cart-total-row discount"><span>Precio especial recogida en tienda</span><span>− ${discount.toFixed(2)} €</span></div>
             <div class="cart-total-row" style="font-size:0.7rem;opacity:0.75;font-style:italic;"><span>· Sin gastos añadidos del embalaje y la gestión de la contratación del envío</span><span></span></div>`
          : `<div class="cart-total-row"><span>Producto (IVA incluido)</span><span>${subtotal.toFixed(2)} €</span></div>
             <div class="cart-total-row"><span>Envío</span><span>${shipping === 0 ? '¡Gratis! 🎉' : shipping.toFixed(2) + ' €'}</span></div>`
        }
        <div class="cart-total-row final"><span>Total</span><span>${total.toFixed(2)} €</span></div>
      </div>
      <div class="cart-step-footer">
        <p style="font-size:0.72rem;color:#6b4c2a;text-align:center;margin-bottom:0.6rem;">Primero envía los datos a Leticia, luego procede al pago</p>
        <button class="cart-send-btn ${dataSent ? 'sent' : ''}" onclick="sendOrderData()">
          ${dataSent ? '✅ Datos enviados · Volver a enviar' : '📩 Enviar datos del pedido a Leticia'}
        </button>
        <button class="cart-pay-btn" onclick="checkout()" ${!dataSent ? 'disabled' : ''} style="opacity:${dataSent ? 1 : 0.4};cursor:${dataSent ? 'pointer' : 'not-allowed'};">
          🔒 Pagar ahora — ${total.toFixed(2)} €
        </button>
        <div class="cart-pay-sub">
          <p>Pago 100% seguro · Tus datos bancarios solo los gestiona Redsys</p>
          <div class="cart-pay-methods">
            <span>💳 Tarjeta</span><span>Bizum</span><span>🔒 Redsys</span>
          </div>
        </div>
      </div>`;
  }

  window.toggleCart = function() {
    const panel = document.getElementById('cart-panel');
    const overlay = document.getElementById('cart-overlay');
    if (!panel) return;
    const open = panel.classList.toggle('open');
    overlay.classList.toggle('open', open);
    if (open) renderStep();
  };

  window.closeCart = function() {
    document.getElementById('cart-panel')?.classList.remove('open');
    document.getElementById('cart-overlay')?.classList.remove('open');
  };

  function injectCartUI() {
    const style = document.createElement('style');
    style.textContent = `
      .cart-btn { background:#6a9e8a;color:#fff;border:none;outline:none;border-radius:30px;padding:0.5rem 1.2rem;font-family:'Nunito',sans-serif;font-size:0.78rem;font-weight:700;cursor:pointer;display:flex;align-items:center;gap:0.4rem;transition:background 0.25s;letter-spacing:0.08em;text-transform:uppercase;position:relative;box-shadow:none; }
      .cart-btn:hover { background:#4d8a72; }
      .cart-btn:focus { outline:none;box-shadow:none; }
      .cart-badge { background:#e74c3c;color:#fff;border-radius:50%;width:20px;height:20px;font-size:0.72rem;font-weight:700;display:none;align-items:center;justify-content:center; }
      .cart-overlay { display:none;position:fixed;inset:0;background:rgba(0,0,0,0.5);z-index:950;backdrop-filter:blur(3px); }
      .cart-overlay.open { display:block; }

      #cart-panel { position:fixed;right:-420px;top:0;bottom:0;width:min(420px,100vw);background:#fff;z-index:1000;box-shadow:-4px 0 30px rgba(90,58,26,0.15);display:flex;flex-direction:column;transition:right 0.35s ease;font-family:'Nunito',sans-serif; }
      #cart-panel.open { right:0; }

      .cart-header { padding:1rem 1.5rem;border-bottom:1.5px solid #f5e9d6;display:flex;align-items:center;justify-content:space-between;background:#fdf8f0;flex-shrink:0; }
      .cart-header h2 { font-family:'Playfair Display',serif;font-size:1.1rem;color:#5a3a1a; }
      .cart-close { background:none;border:none;font-size:1.5rem;cursor:pointer;color:#6b4c2a;padding:0.2rem 0.5rem;border-radius:6px; }
      .cart-close:hover { background:#f5e9d6; }

      /* Steps indicator */
      .cart-steps { display:flex;align-items:center;justify-content:center;gap:0.4rem;padding:0.6rem 1.5rem;background:#f9f2e4;border-bottom:1.5px solid #f5e9d6;flex-shrink:0; }
      .step-dot { width:28px;height:28px;border-radius:50%;border:2px solid #d4a96a;display:flex;align-items:center;justify-content:center;font-size:0.72rem;font-weight:700;color:#d4a96a;transition:all 0.2s; }
      .step-dot.active { background:#8b5e3c;border-color:#8b5e3c;color:#fff; }
      .step-dot.done { background:#6a9e8a;border-color:#6a9e8a;color:#fff; }
      .step-line { width:24px;height:2px;background:#f5e9d6; }
      .step-label { font-size:0.62rem;color:#6b4c2a;text-align:center;margin-top:0.2rem; }

      /* Body scrollable */
      .cart-body { flex:1;overflow-y:auto;display:flex;flex-direction:column; }

      /* Delivery selector */
      .delivery-selector { display:flex;gap:0.5rem;padding:0.8rem 1.5rem;background:#f9f2e4;flex-shrink:0; }
      .delivery-btn { flex:1;padding:0.5rem 0.5rem;border:1.5px solid #f5e9d6;border-radius:10px;background:#fff;font-family:'Nunito',sans-serif;font-size:0.7rem;font-weight:700;cursor:pointer;text-align:center;color:#6b4c2a;transition:all 0.2s;line-height:1.4; }
      .delivery-btn:hover { border-color:#d4a96a; }
      .delivery-btn.active { background:#8b5e3c;color:#fff;border-color:#8b5e3c; }
      .delivery-icon { font-size:1rem;display:block;margin-bottom:0.2rem; }
      .delivery-price { font-size:0.65rem;font-weight:400;opacity:0.85; }

      /* Items list */
      .cart-items-list { padding:0.8rem 1.5rem;flex:1; }
      .cart-item { display:grid;grid-template-columns:1fr auto auto;gap:0.5rem;align-items:start;padding:0.8rem 0;border-bottom:1px dashed #f5e9d6; }
      .cart-item:last-child { border-bottom:none; }
      .cart-item-name { font-size:0.85rem;font-weight:700;color:#3a2510;margin-bottom:0.2rem; }
      .cart-item-opts { display:flex;flex-wrap:wrap;gap:0.3rem;margin-bottom:0.2rem; }
      .cart-item-opts span { font-size:0.7rem;background:#e0ede8;color:#2d6a4f;padding:0.15rem 0.5rem;border-radius:10px; }
      .cart-item-price { font-size:0.75rem;color:#6b4c2a;font-weight:300; }
      .cart-item-controls { display:flex;align-items:center;gap:0.3rem; }
      .cart-item-controls button { background:#f5e9d6;border:none;border-radius:6px;width:26px;height:26px;font-size:0.9rem;cursor:pointer;font-weight:700;color:#5a3a1a; }
      .cart-item-controls button:hover { background:#d4a96a;color:#fff; }
      .cart-item-controls span { font-size:0.85rem;font-weight:700;min-width:20px;text-align:center; }
      .cart-remove { color:#e74c3c !important; }
      .cart-item-subtotal { font-size:0.88rem;font-weight:700;color:#8b5e3c;text-align:right;white-space:nowrap; }

      /* Footer sticky en cada paso */
      .cart-step-footer { padding:1rem 1.5rem;border-top:1.5px solid #f5e9d6;background:#fdf8f0;flex-shrink:0; }
      .cart-totals { margin-bottom:0.6rem; }
      .cart-total-row { display:flex;justify-content:space-between;font-size:0.82rem;color:#6b4c2a;padding:0.18rem 0; }
      .cart-total-row.discount { color:#6a9e8a;font-weight:600; }
      .cart-total-row.final { font-size:1rem;font-weight:700;color:#5a3a1a;border-top:1px solid #f5e9d6;padding-top:0.5rem;margin-top:0.2rem; }
      .cart-note { font-size:0.72rem;font-style:italic;margin-bottom:0.7rem;text-align:center;color:#6b4c2a; }
      .cart-next-btn { display:block;width:100%;padding:0.85rem;background:#8b5e3c;color:#fff;border:none;border-radius:30px;font-family:'Nunito',sans-serif;font-size:0.85rem;font-weight:700;cursor:pointer;letter-spacing:0.06em;text-transform:uppercase;transition:background 0.25s;margin-bottom:0.4rem; }
      .cart-next-btn:hover { background:#6a9e8a; }

      /* Step 2 - address */
      .cart-step-header { padding:0.8rem 1.5rem;border-bottom:1px solid #f5e9d6;background:#fdf8f0;flex-shrink:0; }
      .cart-back-step { background:none;border:none;color:#6a9e8a;font-family:'Nunito',sans-serif;font-size:0.78rem;font-weight:700;cursor:pointer;padding:0;margin-bottom:0.3rem; }
      .cart-step-title { font-family:'Playfair Display',serif;font-size:1rem;color:#5a3a1a;font-weight:600; }
      .cart-step-sub { font-size:0.7rem;color:#6b4c2a;margin-top:0.2rem; }
      .cart-addr-form { padding:0.8rem 1.5rem;flex:1; }
      .addr-input { width:100%;padding:0.45rem 0.6rem;border-radius:7px;border:1.5px solid #d4a96a;font-family:'Nunito',sans-serif;font-size:0.8rem;color:#3a2510;margin-bottom:0.4rem;box-sizing:border-box;background:#fff;outline:none; }
      .addr-input:focus { border-color:#6a9e8a; }
      .addr-row { display:grid;grid-template-columns:1fr 1fr;gap:0.4rem; }
      .addr-row-3 { display:grid;grid-template-columns:2fr 1fr 1fr;gap:0.4rem; }

      /* Step 3 - summary */
      .cart-ref-line { font-size:0.7rem;color:#8b5e3c;font-style:italic;margin-top:0.1rem; }
      .summary-items { padding:0.8rem 1.5rem;flex:1; }
      .summary-item { display:flex;justify-content:space-between;align-items:start;padding:0.5rem 0;border-bottom:1px dashed #f5e9d6;font-size:0.82rem;color:#3a2510;gap:0.5rem; }
      .summary-item:last-child { border-bottom:none; }
      .summary-block { margin:0.6rem 1.5rem;background:#f0f7f4;border-radius:10px;padding:0.7rem 0.9rem; }
      .summary-label { font-size:0.7rem;font-weight:700;color:#5a3a1a;text-transform:uppercase;letter-spacing:0.08em;margin-bottom:0.4rem;display:flex;align-items:center;gap:0.5rem; }
      .edit-link { background:none;border:none;color:#6a9e8a;font-size:0.7rem;font-weight:700;cursor:pointer;font-family:'Nunito',sans-serif;text-decoration:underline; }
      .summary-block p { font-size:0.8rem;color:#6b4c2a;line-height:1.6; }
      .cart-send-btn { display:block;width:100%;padding:0.85rem;background:#6a9e8a;color:#fff;border:none;border-radius:30px;font-family:'Nunito',sans-serif;font-size:0.82rem;font-weight:700;cursor:pointer;letter-spacing:0.06em;text-transform:uppercase;transition:background 0.25s;margin-bottom:0.5rem; }
      .cart-send-btn:hover { background:#4d8a72; }
      .cart-send-btn.sent { background:#4d8a72; }
      .cart-pay-btn { display:block;width:100%;padding:0.85rem;background:#8b5e3c;color:#fff;border:none;border-radius:30px;font-family:'Nunito',sans-serif;font-size:0.85rem;font-weight:700;cursor:pointer;letter-spacing:0.06em;text-transform:uppercase;transition:background 0.25s;margin-bottom:0.5rem; }
      .cart-pay-btn:hover:not([disabled]) { background:#6a9e8a; }
      .cart-pay-sub { font-size:0.7rem;color:#6b4c2a;text-align:center; }
      .cart-pay-methods { display:flex;align-items:center;justify-content:center;gap:0.5rem;margin-top:0.3rem; }
      .cart-pay-methods span { font-size:0.68rem;background:#f5e9d6;padding:0.2rem 0.6rem;border-radius:10px;color:#5a3a1a;font-weight:600; }

      .cart-empty { text-align:center;padding:3rem 1rem;color:#6b4c2a;flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center; }
      .cart-empty span { font-size:3rem;display:block;margin-bottom:0.8rem; }
      .cart-empty p { font-size:0.95rem;font-weight:600;margin-bottom:0.3rem; }
      .cart-empty-sub { font-size:0.82rem;font-weight:300 !important; }

      #cart-notif { position:fixed;bottom:6rem;right:1.5rem;z-index:1100;background:#5a3a1a;color:#fff;padding:0.7rem 1.2rem;border-radius:30px;font-family:'Nunito',sans-serif;font-size:0.82rem;font-weight:600;opacity:0;transform:translateY(10px);transition:all 0.3s;pointer-events:none; }
      #cart-notif.show { opacity:1;transform:translateY(0); }
      .btn-add-cart { display:block;width:100%;margin-top:0.6rem;padding:0.65rem 1rem;background:var(--mint-dark,#6a9e8a);color:#fff;border:none;border-radius:30px;font-family:'Nunito',sans-serif;font-size:0.78rem;font-weight:700;cursor:pointer;letter-spacing:0.08em;text-transform:uppercase;transition:background 0.25s; }
      .btn-add-cart:hover { background:var(--wood-dark,#8b5e3c); }
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
        <h2>Tu carrito 🛒</h2>
        <button class="cart-close" onclick="closeCart()">✕</button>
      </div>
      <div class="cart-steps">
        <div style="text-align:center;">
          <div class="step-dot active" id="step-dot-1">1</div>
          <div class="step-label">Carrito</div>
        </div>
        <div class="step-line"></div>
        <div style="text-align:center;">
          <div class="step-dot" id="step-dot-2">2</div>
          <div class="step-label">Dirección</div>
        </div>
        <div class="step-line"></div>
        <div style="text-align:center;">
          <div class="step-dot" id="step-dot-3">3</div>
          <div class="step-label">Pago</div>
        </div>
      </div>
      <div class="cart-body"></div>`;
    document.body.appendChild(panel);

    updateCartBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCartUI);
  } else {
    injectCartUI();
  }

})();
