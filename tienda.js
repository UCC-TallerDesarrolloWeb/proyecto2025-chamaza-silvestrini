// tienda.js — versión encapsulada (no choca con otros $ ni variables globales)
(() => {
  // ======== DATOS ========
  const PRODUCTS = [
    {id:'knife-chef', name:'Cuchillo Chef 20cm', price:38999, img:'imagenes/cuchillo.jpg', tags:['Acero alemán','Balanceado'], pop:95},
    {id:'pan-26', name:'Sartén de hierro 26cm', price:58999, img:'imagenes/sarten26.webp', tags:['Apta horno','Curado'], pop:98},
    {id:'spice-med', name:'Blend Especias Mediterráneas', price:8999, img:'imagenes/especias.jpg', tags:['Romero','Limón'], pop:80},
    {id:'spatula', name:'Espátula silicona pro', price:7499, img:'imagenes/espatula.webp', tags:['Alta temperatura'], pop:70},
    {id:'mold-24', name:'Molde redondo 24cm', price:21999, img:'imagenes/molde.jpg', tags:['Antiadherente'], pop:74},
    {id:'rolling', name:'Palo de amasar madera', price:12999, img:'imagenes/palote.jpg', tags:['Ergonómico'], pop:60},
    {id:'gf-mix', name:'Mix pan SIN TACC 1kg', price:15999, img:'imagenes/pansin.jpg', tags:['Premezcla'], pop:77},
    {id:'board-wood', name:'Tabla para picar madera', price:18999, img:'imagenes/tabla-madera.jpg', tags:['Antibacterial','Con canal'], pop:82},
    {id:'whisk-steel', name:'Batidor de acero inoxidable', price:5999, img:'imagenes/batidor.jpeg', tags:['12 hilos','Lavavajillas'], pop:73},
    {id:'pot-20', name:'Olla 20cm con tapa', price:47999, img:'imagenes/olla20.jpg', tags:['Base triple','Vidrio templado'], pop:88},
    {id:'ladle-sil', name:'Cucharón de silicona', price:6499, img:'imagenes/cucharon-silicona.webp', tags:['Alta temperatura','No raya'], pop:69},
    {id:'thermo-probe', name:'Termómetro de cocina digital', price:16999, img:'imagenes/termometro.png', tags:['Sonda inox','Rápido'], pop:86},
    {id:'measuring-jug', name:'Jarra medidora 1L', price:8999, img:'imagenes/jarra-medidora.webp', tags:['ml/oz','Libre BPA'], pop:67},
    {id:'cookie-cutter-set', name:'Set cortantes para galletas (6u)', price:10999, img:'imagenes/cortantes-galleta.jpg', tags:['Acero','Varios tamaños'], pop:71},
    {id:'brush-sil', name:'Pincel de silicona', price:4999, img:'imagenes/pincel-silicona.webp', tags:['Resistente','Antiadherente'], pop:65},
    ];

  // ======== HELPERS (scoped) ========
  const $  = (s, ctx=document) => ctx.querySelector(s);
  const money = x => new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(x);

  // ======== CARRITO ========
  const CART_KEY = 'tl_cart';
  const loadCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  const saveCart = c => localStorage.setItem(CART_KEY, JSON.stringify(c));
  const cartCount = () => Object.values(loadCart()).reduce((a,b)=>a+b,0);
  const notifyCartChanged = () => {
    const n = cartCount();
    document.dispatchEvent(new CustomEvent('tl:cart-changed',{detail:{count:n}}));
  };
  const updateCartCount = () => {
    const n = cartCount();
    const badge = $('#cart-count');
    if (badge) badge.textContent = n;
  };

  function addToCart(id){
    const c = loadCart();
    c[id] = (c[id] || 0) + 1;
    saveCart(c);
    updateCartCount();
    notifyCartChanged();
  }
  function removeFromCart(id){
    const c = loadCart();
    if(c[id]) {
      c[id]--;
      if(c[id]<=0) delete c[id];
      saveCart(c);
      updateCartCount();
      notifyCartChanged();
    }
  }
  function emptyCart(){
    saveCart({});
    renderCart();
    updateCartCount();
    notifyCartChanged();
  }

  function renderCart(){
    const c = loadCart();
    const list = $('#cartList');
    if(!list) return;

    if(!Object.keys(c).length){
      list.innerHTML = '<li class="empty">Tu carrito está vacío.</li>';
      const total = $('#cartTotal');
      if (total) total.textContent = '$0';
      return;
    }

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
  }

  // ======== PRODUCTOS ========
  function renderProducts(list){
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
  }

  // ======== FILTROS ========
  function currentFilters(){
    const term  = ($('#q')?.value || '').trim().toLowerCase();
    const min   = +($('#minPrice')?.value || 0) || 0;
    const max   = +($('#maxPrice')?.value || Infinity) || Infinity;
    const sort  = $('#sort')?.value || 'pop';
    const alpha = $('#alpha')?.value || 'none';
    return {term,min,max,sort,alpha};
  }

  function applyFilters(){
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
  }

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
      btn.textContent='Agregado ✓';
      setTimeout(()=>btn.textContent='Agregar',900);
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
    function enhanceOrderButton(){
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
      const updateState = (n = cartCount()) => {
        btn.classList.toggle('is-empty', n===0);
        btn.toggleAttribute('disabled', n===0);
        btn.title = n===0 ? 'Agregá productos al carrito' : '';
      };
      updateState();
      document.addEventListener('tl:cart-changed', (e)=> updateState(e.detail?.count ?? cartCount()));

      // Click → solo animar si hay items
      btn.addEventListener('click', () => {
        if (btn.classList.contains('ordering')) return;

        if (cartCount() === 0) {
          btn.classList.add('nope');                // shake sutil
          setTimeout(()=>btn.classList.remove('nope'), 450);
          return;
        }

        // 🔒 Fijamos el ancho la primera vez para que no se haga "circulito"
        if (!btn.style.getPropertyValue('--w-fixed')) {
          const w = btn.offsetWidth;               // ancho actual con el texto
          btn.style.width = w + 'px';              // lo fijamos
          btn.style.setProperty('--w-fixed', '1');
        }

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
    }

    enhanceOrderButton();
  });
})();
