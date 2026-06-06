// ── MAMEMI Madera · Carrito de compra ──
(function() {

  // ── ESTADO ──
  let cart = JSON.parse(localStorage.getItem('mamemi_cart') || '[]');

  // ── GUARDAR ──
  function saveCart() {
    localStorage.setItem('mamemi_cart', JSON.stringify(cart));
    updateCartBadge();
    renderCartPanel();
  }

  // ── AÑADIR AL CARRITO ──
  window.addToCart = function(product) {
    // product: { id, name, price, qty, options }
    const existing = cart.find(i => i.id === product.id && JSON.stringify(i.options) === JSON.stringify(product.options));
    if (existing) {
      existing.qty += (product.qty || 1);
    } else {
      cart.push({ ...product, qty: product.qty || 1 });
    }
    saveCart();
    showCartNotification(product.name);
  };

  // ── ELIMINAR ──
  window.removeFromCart = function(index) {
    cart.splice(index, 1);
    saveCart();
  };

  // ── ACTUALIZAR CANTIDAD ──
  window.updateQty = function(index, qty) {
    if (qty < 1) { removeFromCart(index); return; }
    cart[index].qty = qty;
    saveCart();
  };

  // ── VACIAR ──
  window.clearCart = function() {
    cart = [];
    saveCart();
  };

  // ── TOTAL ──
  function cartTotal() {
    return cart.reduce((sum, i) => sum + i.price * i.qty, 0);
  }

  function cartCount() {
    return cart.reduce((sum, i) => sum + i.qty, 0);
  }

  // ── BADGE ──
  function updateCartBadge() {
    const count = cartCount();
    document.querySelectorAll('.cart-badge').forEach(b => {
      b.textContent = count;
      b.style.display = count > 0 ? 'flex' : 'none';
    });
    document.querySelectorAll('.cart-total-mini').forEach(t => {
      t.textContent = cartTotal().toFixed(2) + ' €';
    });
  }

  // ── NOTIFICACIÓN ──
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

  // ── PANEL DEL CARRITO ──
  function renderCartPanel() {
    const panel = document.getElementById('cart-panel');
    if (!panel) return;

    const total = cartTotal();
    const shipping = total >= 60 ? 0 : 4.99;
    const finalTotal = total + shipping;

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

    panel.querySelector('.cart-subtotal').textContent = total.toFixed(2) + ' €';
    panel.querySelector('.cart-shipping').textContent = shipping === 0 ? '¡Gratis!' : shipping.toFixed(2) + ' €';
    panel.querySelector('.cart-final').textContent = finalTotal.toFixed(2) + ' €';

    if (shipping === 0) {
      panel.querySelector('.cart-shipping-note').textContent = '✦ Envío gratis por compra superior a 60 €';
    } else {
      const remaining = (60 - total).toFixed(2);
      panel.querySelector('.cart-shipping-note').textContent = `Añade ${remaining} € más para envío gratis`;
    }
  }

  // ── TOGGLE PANEL ──
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

  // ── PAGAR ──
  window.checkout = function() {
    if (cart.length === 0) return;
    const total = cartTotal();
    const shipping = total >= 60 ? 0 : 4.99;
    const finalTotal = (total + shipping) * 100; // en céntimos

    const orderNum = Date.now().toString().slice(-10);
    const items = cart.map(i => `${i.qty}x ${i.name}`).join(', ');

    // Enviar al PHP de Redsys
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'pago.php';
    form.style.display = 'none';

    const fields = {
      amount: Math.round(finalTotal),
      order: orderNum,
      description: items.substring(0, 125),
      cart: JSON.stringify(cart)
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

  // ── INYECTAR UI ──
  function injectCartUI() {
    // Estilos
    const style = document.createElement('style');
    style.textContent = `
      .cart-btn {
        position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 900;
        background: #6a9e8a; color: #fff;
        border: none; border-radius: 50px; padding: 0.75rem 1.3rem;
        font-family: 'Nunito', sans-serif; font-size: 0.88rem; font-weight: 700;
        cursor: pointer; box-shadow: 0 4px 20px rgba(106,158,138,0.4);
        display: flex; align-items: center; gap: 0.5rem;
        transition: all 0.25s; letter-spacing: 0.05em;
      }
      .cart-btn:hover { background: #8b5e3c; transform: translateY(-2px); box-shadow: 0 6px 24px rgba(90,58,26,0.35); }
      .cart-badge {
        background: #e74c3c; color: #fff; border-radius: 50%;
        width: 20px; height: 20px; font-size: 0.72rem; font-weight: 700;
        display: none; align-items: center; justify-content: center;
      }
      .cart-overlay {
        display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5);
        z-index: 950; backdrop-filter: blur(3px);
      }
      .cart-overlay.open { display: block; }
      #cart-panel {
        position: fixed; right: -420px; top: 0; bottom: 0; width: min(420px, 100vw);
        background: #fff; z-index: 1000; box-shadow: -4px 0 30px rgba(90,58,26,0.15);
        display: flex; flex-direction: column; transition: right 0.35s ease;
        font-family: 'Nunito', sans-serif;
      }
      #cart-panel.open { right: 0; }
      .cart-header {
        padding: 1.2rem 1.5rem; border-bottom: 1.5px solid #f5e9d6;
        display: flex; align-items: center; justify-content: space-between;
        background: #fdf8f0;
      }
      .cart-header h2 { font-family: 'Playfair Display', serif; font-size: 1.2rem; color: #5a3a1a; }
      .cart-header-sub { font-size: 0.78rem; color: #6b4c2a; font-weight: 300; }
      .cart-close { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b4c2a; padding: 0.2rem 0.5rem; border-radius: 6px; transition: background 0.2s; }
      .cart-close:hover { background: #f5e9d6; }
      .cart-items { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; }
      .cart-empty { text-align: center; padding: 3rem 1rem; color: #6b4c2a; }
      .cart-empty span { font-size: 3rem; display: block; margin-bottom: 0.8rem; }
      .cart-empty p { font-size: 0.95rem; font-weight: 600; margin-bottom: 0.3rem; }
      .cart-empty-sub { font-size: 0.82rem; font-weight: 300 !important; }
      .cart-item {
        display: grid; grid-template-columns: 1fr auto auto;
        gap: 0.5rem; align-items: start; padding: 0.9rem 0;
        border-bottom: 1px dashed #f5e9d6;
      }
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
      .cart-totals { margin-bottom: 1rem; }
      .cart-total-row { display: flex; justify-content: space-between; font-size: 0.84rem; color: #6b4c2a; padding: 0.2rem 0; }
      .cart-total-row.final { font-size: 1rem; font-weight: 700; color: #5a3a1a; border-top: 1px solid #f5e9d6; padding-top: 0.6rem; margin-top: 0.3rem; }
      .cart-shipping-note { font-size: 0.74rem; color: #6a9e8a; font-style: italic; margin-bottom: 0.8rem; text-align: center; }
      .cart-pay-btn {
        display: block; width: 100%; padding: 0.9rem; background: #8b5e3c; color: #fff;
        border: none; border-radius: 30px; font-family: 'Nunito', sans-serif;
        font-size: 0.88rem; font-weight: 700; cursor: pointer; letter-spacing: 0.08em;
        text-transform: uppercase; transition: background 0.25s; margin-bottom: 0.6rem;
      }
      .cart-pay-btn:hover { background: #6a9e8a; }
      .cart-pay-sub { font-size: 0.72rem; color: #6b4c2a; text-align: center; }
      .cart-pay-methods { display: flex; align-items: center; justify-content: center; gap: 0.5rem; margin-top: 0.4rem; }
      .cart-pay-methods span { font-size: 0.7rem; background: #f5e9d6; padding: 0.2rem 0.6rem; border-radius: 10px; color: #5a3a1a; font-weight: 600; }
      #cart-notif {
        position: fixed; bottom: 6rem; right: 1.5rem; z-index: 1100;
        background: #5a3a1a; color: #fff; padding: 0.7rem 1.2rem;
        border-radius: 30px; font-family: 'Nunito', sans-serif; font-size: 0.82rem;
        font-weight: 600; opacity: 0; transform: translateY(10px);
        transition: all 0.3s; pointer-events: none;
      }
      #cart-notif.show { opacity: 1; transform: translateY(0); }
      .btn-add-cart {
        display: block; width: 100%; margin-top: 0.6rem; padding: 0.65rem 1rem;
        background: var(--mint-dark, #6a9e8a); color: #fff; border: none; border-radius: 30px;
        font-family: 'Nunito', sans-serif; font-size: 0.78rem; font-weight: 700;
        cursor: pointer; letter-spacing: 0.08em; text-transform: uppercase;
        transition: background 0.25s;
      }
      .btn-add-cart:hover { background: var(--wood-dark, #8b5e3c); }
    `;
    document.head.appendChild(style);

    // Botón flotante
    const btn = document.createElement('button');
    btn.className = 'cart-btn';
    btn.onclick = toggleCart;
    btn.innerHTML = `🛒 Carrito <span class="cart-badge" id="cartBadge">0</span>`;
    document.body.appendChild(btn);

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'cart-overlay';
    overlay.className = 'cart-overlay';
    overlay.onclick = closeCart;
    document.body.appendChild(overlay);

    // Panel
    const panel = document.createElement('div');
    panel.id = 'cart-panel';
    panel.innerHTML = `
      <div class="cart-header">
        <div>
          <h2>Tu carrito 🛒</h2>
          <p class="cart-header-sub">Envío gratis en pedidos +60 €</p>
        </div>
        <button class="cart-close" onclick="closeCart()">✕</button>
      </div>
      <div class="cart-items"><div class="cart-empty"><span>🛒</span><p>Tu carrito está vacío</p><p class="cart-empty-sub">¡Añade algo bonito!</p></div></div>
      <div class="cart-footer" style="display:none;">
        <div class="cart-totals">
          <div class="cart-total-row"><span>Subtotal</span><span class="cart-subtotal">0,00 €</span></div>
          <div class="cart-total-row"><span>Gastos de envío</span><span class="cart-shipping">4,99 €</span></div>
          <div class="cart-total-row final"><span>Total</span><span class="cart-final">0,00 €</span></div>
        </div>
        <p class="cart-shipping-note"></p>
        <button class="cart-pay-btn" onclick="checkout()">Pagar ahora</button>
        <div class="cart-pay-sub">
          <p>Pago 100% seguro</p>
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

  // Inicializar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectCartUI);
  } else {
    injectCartUI();
  }

})();
