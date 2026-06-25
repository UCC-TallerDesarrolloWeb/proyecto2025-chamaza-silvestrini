/**
 * @fileoverview Gestión de la tienda online de Tenedor Libre
 * @description Maneja productos, carrito de compras y filtros
 * @module tienda
 */
(() => {
  /**
   * @typedef {Object} Product
   * @property {string} id - Identificador único del producto
   * @property {string} name - Nombre del producto
   * @property {number} price - Precio en pesos argentinos
   * @property {string} img - URL de la imagen
   * @property {string[]} tags - Etiquetas descriptivas
   * @property {number} pop - Puntuación de popularidad (0-100)
   */

  /**
   * Lista de productos disponibles
   * @type {Product[]}
   */
  const PRODUCTS = [
    {id:'knife-chef', name:'Cuchillo Chef 20cm', price:38999, img:'../imagenes/cuchillo.jpg', tags:['Acero alemán','Balanceado'], pop:95},
    {id:'pan-26', name:'Sartén de hierro 26cm', price:58999, img:'../imagenes/sarten26.webp', tags:['Apta horno','Curado'], pop:98},
    {id:'spice-med', name:'Blend Especias Mediterráneas', price:8999, img:'../imagenes/especias.jpg', tags:['Romero','Limón'], pop:80},
    {id:'spatula', name:'Espátula silicona pro', price:7499, img:'../imagenes/espatula.webp', tags:['Alta temperatura'], pop:70},
    {id:'mold-24', name:'Molde redondo 24cm', price:21999, img:'../imagenes/molde.jpg', tags:['Antiadherente'], pop:74},
    {id:'rolling', name:'Palo de amasar madera', price:12999, img:'../imagenes/palote.jpg', tags:['Ergonómico'], pop:60},
    {id:'gf-mix', name:'Mix pan SIN TACC 1kg', price:15999, img:'../imagenes/pansin.jpg', tags:['Premezcla'], pop:77},
    {id:'board-wood', name:'Tabla para picar madera', price:18999, img:'../imagenes/tabla-madera.jpg', tags:['Antibacterial','Con canal'], pop:82},
    {id:'whisk-steel', name:'Batidor de acero inoxidable', price:5999, img:'../imagenes/batidor.jpeg', tags:['12 hilos','Lavavajillas'], pop:73},
    {id:'pot-20', name:'Olla 20cm con tapa', price:47999, img:'../imagenes/olla20.jpg', tags:['Base triple','Vidrio templado'], pop:88},
    {id:'ladle-sil', name:'Cucharón de silicona', price:6499, img:'../imagenes/cucharon-silicona.webp', tags:['Alta temperatura','No raya'], pop:69},
    {id:'thermo-probe', name:'Termómetro de cocina digital', price:16999, img:'../imagenes/termometro.png', tags:['Sonda inox','Rápido'], pop:86},
    {id:'measuring-jug', name:'Jarra medidora 1L', price:8999, img:'../imagenes/jarra-medidora.webp', tags:['ml/oz','Libre BPA'], pop:67},
    {id:'cookie-cutter-set', name:'Set cortantes para galletas (6u)', price:10999, img:'../imagenes/cortantes-galleta.jpg', tags:['Acero','Varios tamaños'], pop:71},
    {id:'brush-sil', name:'Pincel de silicona', price:4999, img:'../imagenes/pincel-silicona.webp', tags:['Resistente','Antiadherente'], pop:65},
    ];

  // ======== HELPERS (scoped) ========
  /**
   * Selector de elemento DOM simplificado
   * @param {string} s - Selector CSS
   * @param {Document|Element} [ctx=document] - Contexto de búsqueda
   * @returns {Element|null} Primer elemento que coincide o null
   */
  const $  = (s, ctx=document) => ctx.querySelector(s);

  /**
   * Formatea un número como moneda argentina (ARS)
   * @param {number} x - Valor numérico a formatear
   * @returns {string} Precio formateado (ej: "$38.999")
   */
  const money = x => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(x);

  /**
   * @constant {string}
   * @default 'tl_cart'
   * @description Clave para almacenar el carrito en localStorage
   */
  const CART_KEY = 'tl_cart';

  /**
   * Carga el carrito desde localStorage
   * @returns {Object.<string, number>} Mapa de ID de producto a cantidad
   */
  const loadCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '{}');

  /**
   * Guarda el carrito en localStorage
   * @param {Object.<string, number>} c - Mapa de ID de producto a cantidad
   */
  const saveCart = c => localStorage.setItem(CART_KEY, JSON.stringify(c));

  /**
   * Calcula el número total de items en el carrito
   * @returns {number} Total de items
   */
  const cartCount = () => Object.values(loadCart()).reduce((a,b)=>a+b,0);

  /**
   * Dispara un evento personalizado cuando el carrito cambia
   * @fires CustomEvent#tl:cart-changed
   */
  const notifyCartChanged = () => {
    const n = cartCount();
    document.dispatchEvent(new CustomEvent('tl:cart-changed',{detail:{count:n}}));
  };

  /**
   * Actualiza el contador visual del carrito
   */
  /**
   * Actualiza el contador visual del carrito en el botón del header
   */
  const updateCartCount = () => {
    const n = cartCount();
    const badge = $('#cart-count');
    if (badge) badge.textContent = n;
  };

  /**
   * Muestra u oculta los botones de acción del pie del carrito
   * @param {boolean} hasItems - true si el carrito tiene al menos un producto
   */
  const setCartControlsVisibility = (hasItems) => {
    const emptyBtn = document.getElementById('emptyCart');
    const finishBtn = document.getElementById('finishOrder');
    if (emptyBtn) {
      emptyBtn.hidden = !hasItems;
      emptyBtn.style.display = hasItems ? '' : 'none';
      emptyBtn.disabled = !hasItems;
      emptyBtn.setAttribute('aria-hidden', String(!hasItems));
    }
    if (finishBtn) {
      finishBtn.hidden = !hasItems;
      finishBtn.style.display = hasItems ? '' : 'none';
      finishBtn.disabled = !hasItems;
      finishBtn.setAttribute('aria-hidden', String(!hasItems));
    }
  };

  /**
   * Agrega una unidad de un producto al carrito y notifica el cambio
   * @param {string} id - ID del producto a agregar
   */
  const addToCart = (id) => {
    const c = loadCart();
    c[id] = (c[id] || 0) + 1;
    saveCart(c);
    updateCartCount();
    notifyCartChanged();
  };
  /**
   * Quita una unidad de un producto del carrito; si llega a 0 lo elimina
   * @param {string} id - ID del producto a decrementar
   */
  const removeFromCart = (id) => {
    const c = loadCart();
    if(c[id]) {
      c[id]--;
      if(c[id]<=0) delete c[id];
      saveCart(c);
      updateCartCount();
      notifyCartChanged();
    }
  };
  /**
   * Vacía el carrito completamente y actualiza la interfaz
   */
  const emptyCart = () => {
    saveCart({});
    renderCart();
    updateCartCount();
    notifyCartChanged();
  };

  /**
   * Renderiza el contenido del modal del carrito con los productos actuales y el total
   */
  const renderCart = () => {
    const c = loadCart();
    const list = $('#cartList');
    if(!list) return;

    if(!Object.keys(c).length){
      // carrito vacío: mostrar mensaje y ocultar botones
      list.innerHTML = '<li class="empty">Tu carrito está vacío.</li>';
      const total = $('#cartTotal');
      if (total) total.textContent = '$0';
      setCartControlsVisibility(false);
      return;
    }
    // hay items: mostrar los botones
    setCartControlsVisibility(true);

    let total = 0;
    list.innerHTML = Object.entries(c).map(([id,qty])=>{
      const p = PRODUCTS.find(x=>x.id===id);
      const subtotal = p.price * qty;
      total += subtotal;
      return `
        <li class="cart-item">
          <div>${p.name}</div>
          <div>x ${qty}</div>
          <div>${money(subtotal)}</div>
          <button data-less="${id}" class="btn small secondary">−</button>
        </li>`;
    }).join('');
    const totalNode = $('#cartTotal');
    if (totalNode) totalNode.textContent = money(total);
  };

  /**
   * Renderiza la lista de productos en la grilla
   * @function
   * @param {Product[]} list - Lista de productos a mostrar
   * @description Genera el HTML para cada producto y lo inserta en la grilla
   */
  const renderProducts = (list) => {
    const grid = $('#shop-grid');
    if(!grid) return;
    if(!list.length){
      grid.innerHTML = '<p class="empty">No encontramos productos con esos filtros.</p>';
      return;
    }
    grid.innerHTML = list.map(p => `
      <article class="card">
        <img src="${p.img}" alt="${p.name}" loading="lazy" />
        <h3>${p.name}</h3>
        <div class="meta-row">
          <span class="price">${money(p.price)}</span>
          <div class="tags">${(p.tags||[]).map(t=>`<span class="tag">${t}</span>`).join('')}</div>
        </div>
        <button class="btn small" data-add="${p.id}">Agregar</button>
      </article>
    `).join('');
  };

  /**
   * @typedef {Object} Filters
   * @property {string} term - Término de búsqueda
   * @property {number} min - Precio mínimo
   * @property {number} max - Precio máximo
   * @property {string} sort - Criterio de ordenamiento ('pop'|'price-asc'|'price-desc')
   * @property {string} alpha - Orden alfabético ('none'|'az'|'za')
   */

  /**
   * Obtiene los filtros actuales del formulario
   * @function
   * @returns {Filters} Estado actual de los filtros
   */
  const currentFilters = () => {
    const term  = ($('#q')?.value || '').trim().toLowerCase();
    const min   = +($('#minPrice')?.value || 0) || 0;
    const max   = +($('#maxPrice')?.value || Infinity) || Infinity;
    const sort  = $('#sort')?.value || 'pop';
    const alpha = $('#alpha')?.value || 'none';
    return {term,min,max,sort,alpha};
  };

  /**
   * Filtra y ordena los productos según los criterios activos y actualiza la grilla
   */
  const applyFilters = () => {
    const {term,min,max,sort,alpha} = currentFilters();

    let list = PRODUCTS.filter(p=>{
      const name = p.name.toLowerCase();
      const matchesTerm  = !term || name.includes(term) || (p.tags||[]).some(t=>t.toLowerCase().includes(term));
      const matchesPrice = p.price >= min && p.price <= max;
      return matchesTerm && matchesPrice;
    });

    // Orden principal por precio o popularidad
    switch(sort){
      case 'price-asc':  list.sort((a,b)=>a.price-b.price); break;
      case 'price-desc': list.sort((a,b)=>b.price-a.price); break;
      default:           list.sort((a,b)=>b.pop-a.pop);
    }

    // Orden secundario: alfabético (opcional)
    if(alpha === 'az')  list.sort((a,b)=>a.name.localeCompare(b.name,'es',{sensitivity:'base'}));
    if(alpha === 'za')  list.sort((a,b)=>b.name.localeCompare(a.name,'es',{sensitivity:'base'}));

    renderProducts(list);
  };

  // ======== EVENTOS ========
  document.addEventListener('DOMContentLoaded', ()=>{
    renderProducts(PRODUCTS);
    updateCartCount();

    // Cambios instantáneos en filtros
    ['#q','#sort','#alpha'].forEach(sel=>{
      const node = $(sel);
      if(node){
        node.addEventListener('input', applyFilters);
        node.addEventListener('change', applyFilters);
      }
    });

    // Botones aplicar / limpiar
    $('#applyAll')?.addEventListener('click', applyFilters);
    $('#clearAll')?.addEventListener('click', ()=>{
      if($('#q'))        $('#q').value = '';
      if($('#minPrice')) $('#minPrice').value = '';
      if($('#maxPrice')) $('#maxPrice').value = '';
      if($('#sort'))     $('#sort').value = 'pop';
      if($('#alpha'))    $('#alpha').value = 'none';
      applyFilters();
    });

    // Rango de precios
    ['#minPrice','#maxPrice'].forEach(sel=>{
      const node = $(sel);
      if(!node) return;
      node.addEventListener('change', applyFilters);
      node.addEventListener('keydown', e=>{ if(e.key==='Enter'){ e.preventDefault(); applyFilters(); }});
    });

    // Agregar al carrito desde la grilla
    $('#shop-grid')?.addEventListener('click', e=>{
      const btn = e.target.closest('[data-add]');
      if(!btn) return;
      addToCart(btn.dataset.add);
      btn.textContent = 'Agregado ✓';
      btn.classList.add('added');
      setTimeout(() => {
        btn.textContent = 'Agregar';
        btn.classList.remove('added');
      }, 1400);
    });

    // Carrito
    $('#btn-cart')?.addEventListener('click', ()=>{
      renderCart();
      $('#cart')?.showModal();
    });
    $('#closeCart')?.addEventListener('click', ()=> $('#cart')?.close());
    $('#emptyCart')?.addEventListener('click', emptyCart);
    $('#cartList')?.addEventListener('click', e=>{
      const less = e.target.closest('[data-less]');
      if(!less) return;
      removeFromCart(less.dataset.less);
      renderCart();
    });

    /* ========= Botón "Finalizar compra" con camión (mejorado) ========= */
    /**
     * Transforma el botón "Finalizar compra" con animación de camión de entrega
     * @description Se ejecuta una sola vez; anima el envío y vacía el carrito al completar
     */
    const enhanceOrderButton = () => {
      const btn = document.querySelector('.cart-foot .btn.primary');
      if(!btn || btn.dataset.enhanced) return;
      btn.dataset.enhanced = '1';

      // Estructura interna (la caja está oculta por CSS y aparece solo al click)
      btn.classList.add('order-btn');
      btn.innerHTML = `
        <span class="label">Finalizar compra</span>
        <span class="road" aria-hidden="true"></span>
        <span class="box" aria-hidden="true"></span>
        <span class="truck" aria-hidden="true">
          <span class="forks"></span>
          <span class="body"></span>
          <span class="cab"></span>
          <span class="light"></span>
          <span class="wheel left"></span>
          <span class="wheel right"></span>
        </span>
      `;

      // Habilitado / tooltip según cantidad
      /**
       * Habilita o deshabilita el botón según la cantidad de items en el carrito
       * @param {number} [n=cartCount()] - Cantidad total de items
       */
      const updateState = (n = cartCount()) => {
        btn.classList.toggle('is-empty', n===0);
        btn.toggleAttribute('disabled', n===0);
        // además de disabled/aria, ocultamos el botón si no hay items (evita overrides CSS)
        btn.style.display = n===0 ? 'none' : '';
        btn.setAttribute('aria-hidden', String(n===0));
        btn.title = n===0 ? 'Agregá productos al carrito' : '';
      };
      updateState();
      document.addEventListener('tl:cart-changed', (e)=> updateState(e.detail?.count ?? cartCount()));

      // Click → solo animar si hay items
      btn.addEventListener('click', () => {
        if (btn.classList.contains('ordering')) return;

        if (cartCount() === 0) {
          btn.classList.add('nope');
          setTimeout(()=>btn.classList.remove('nope'), 450);
          return;
        }

        /**
         * Verifica si el usuario tiene una sesión activa
         * @returns {boolean} true si hay sesión iniciada
         */
        const isLoggedIn = () => {
          try { return !!JSON.parse(localStorage.getItem('cmf_auth')); }
          catch { return false; }
        };

        if (!isLoggedIn()) {
          showToast('Debés registrarte para finalizar la compra.', 'info');
          setTimeout(() => {
            Intent.save({ reason: 'checkout', href: 'tienda.html' });
            location.href = 'login.html?redirect=tienda.html';
          }, 1800);
          return;
        }

        // 🔒 Fijamos el ancho la primera vez para que no se haga "circulito"
        // marcar como deshabilitado y abrir animación (sin manipular inline styles)
        btn.disabled = true;
        btn.classList.add('ordering');
        // No vaciamos el texto; CSS lo oculta con opacity

        // Duraciones coordinadas con el CSS “lento”
        const ANIM_TOTAL = 2600;  // viaje del camión + caja
        const READ_MSG   = 1000;  // mostrar “¡Pedido enviado!” 1s

        setTimeout(()=>{
          btn.classList.remove('ordering');
          btn.classList.add('done');
          btn.querySelector('.label').textContent = '¡Pedido enviado!';

          emptyCart();
          renderCart();

          setTimeout(()=>{
            document.getElementById('cart')?.close();
            btn.classList.remove('done');
            btn.disabled = false;
            btn.querySelector('.label').textContent = 'Finalizar compra';
            updateState(); // carrito vacío luego de enviar
          }, READ_MSG);
        }, ANIM_TOTAL);
      });
    };

    enhanceOrderButton();

    // Mantener sincronizado el pie del carrito cuando cambie el contenido del carrito
    document.addEventListener('tl:cart-changed', () => {
      const c = loadCart();
      setCartControlsVisibility(Object.keys(c).length > 0);
      // si el diálogo está abierto, re-renderizamos la lista
      const dlg = document.getElementById('cart');
      if (dlg && dlg.open) renderCart();
    });

      // sincronizar visibilidad inicial del pie según el carrito al cargar la página
      (() => {
        const c = loadCart();
        setCartControlsVisibility(Object.keys(c).length > 0);
      })();
  });
})();