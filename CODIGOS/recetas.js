/* =========================================================
   Tenedor Libre — JS principal (RECETAS)
   ========================================================= */

/**
 * Objeto que maneja la autenticación del usuario en el almacenamiento local
 * @namespace
 */
const Auth = {
  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} true si el usuario está autenticado, false en caso contrario
   */
  isAuthed: () => { 
    try { 
      return localStorage.getItem('authed') === '1'; 
    } catch { 
      return false; 
    } 
  },

  /**
   * Establece el estado de autenticación del usuario
   * @param {string} email - El email del usuario
   * @param {string} name - El nombre del usuario
   */
  setAuthed: (email, name) => {
    try {
      localStorage.setItem('authed', '1');
      if (email) localStorage.setItem('userEmail', email);
      if (name)  localStorage.setItem('userName',  name);
    } catch {}
  },

  /**
   * Limpia los datos de autenticación del usuario
   */
  clear: () => {
    try {
      localStorage.removeItem('authed');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
    } catch {}
  }
};

/**
 * Objeto que maneja el almacenamiento de intenciones del usuario
 * @namespace
 */
const Intent = {
  /**
   * Guarda una intención en el almacenamiento de sesión
   * @param {Object} i - La intención a guardar
   */
  save: (i) => { 
    try { 
      sessionStorage.setItem('intent', JSON.stringify(i)); 
    } catch {} 
  },

  /**
   * Carga la intención guardada del almacenamiento de sesión
   * @returns {Object|null} La intención guardada o null si no hay ninguna
   */
  load: () => { 
    try { 
      return JSON.parse(sessionStorage.getItem('intent')||'null'); 
    } catch { 
      return null 
    } 
  },

  /**
   * Limpia la intención guardada
   */
  clear: () => { 
    try { 
      sessionStorage.removeItem('intent'); 
    } catch {} 
  }
};

/**
 * Inicializa la funcionalidad básica de navegación
 * @function
 * @description Configura el comportamiento del menú móvil y los efectos de scroll
 */
const wireNavBasics = () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.getElementById('site-nav') || document.querySelector('.links');

  if (toggle && links){
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  /**
   * Maneja el evento de scroll para aplicar efectos visuales al header
   * @private
   */
  const onScroll = () => {
    if (window.scrollY > 6) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
  };

  onScroll(); 
  window.addEventListener('scroll', onScroll);
};

/**
 * Abre el modal de una receta a partir de una tarjeta
 * @function
 * @param {HTMLElement} card - El elemento DOM de la tarjeta de receta
 * @param {HTMLDialogElement} dialog - El elemento dialog que sirve como modal
 * @description Extrae la información de la tarjeta y la muestra en el modal
 */
const openRecipeFromCard = (card, dialog) => {
  // Elementos del modal
  const imgEl   = dialog.querySelector('#recipe-modal-img');
  const titleEl = dialog.querySelector('#recipe-modal-title');
  const metaEl  = dialog.querySelector('#recipe-modal-meta');
  const bodyEl  = dialog.querySelector('.recipe-modal-body');
  const btnX    = dialog.querySelector('.recipe-modal-close');

  // Elementos de la tarjeta
  const img   = card.querySelector('img');
  const title = card.querySelector('.title');
  const meta  = card.querySelector('.meta');

  // Extracción de metadatos
  const time = card.dataset.time || meta?.textContent.match(/(\d+)\s*min/)?.[1] || '';
  const servings = card.dataset.servings || meta?.textContent.match(/(\d+)\s*porciones?/)?.[1] || '';
  const method = card.dataset.method || '';

  // Actualización del contenido del modal
  const t = (title?.textContent || '').trim();
  titleEl.textContent = t || 'Receta';
  if (img) { 
    imgEl.src = img.currentSrc || img.src; 
    imgEl.alt = `Imagen de la receta: ${t}`; 
  }

  metaEl.innerHTML = `
    ${time ? `<span>⏱️ ${time} min</span>` : ''}
    ${servings ? `<span>👥 ${servings} porciones</span>` : ''}
    ${method ? `<span>🍳 ${method}</span>` : ''}
  `;

  // Contenido principal
  const html = (typeof RECIPE_HTML !== 'undefined' && RECIPE_HTML[t])
    ? RECIPE_HTML[t]
    : `<p class="muted">Próximamente: ingredientes y paso a paso.</p>`;

  bodyEl.innerHTML = `${html}
    <div class="modal-actions">
      <button class="btn secondary" id="recipe-modal-back">Cerrar</button>
    </div>`;

  /**
   * Cierra el modal de manera segura
   * @private
   */
  const close = () => { 
    try { 
      dialog.close(); 
    } catch { 
      dialog.removeAttribute('open'); 
    } 
  };

  // Event listeners para cerrar
  dialog.querySelector('#recipe-modal-back')?.addEventListener('click', close, { once: true });
  btnX?.addEventListener('click', close, { once: true });

  // Mostrar el modal
  try { 
    dialog.showModal?.() ?? dialog.setAttribute('open',''); 
  } catch { 
    dialog.setAttribute('open',''); 
  }
};

/**
 * Configura el modal de inicio de sesión una sola vez
 * @function
 * @param {HTMLDialogElement} dialog - El elemento dialog que sirve como modal de login
 * @description Inicializa los eventos del formulario de login y maneja el cierre del modal
 */
const wireLoginPopupOnce = (dialog) => {
  // Evita configurar múltiples veces el mismo modal
  if (!dialog || dialog.dataset.wired === '1') return;
  dialog.dataset.wired = '1';

  // Configuración del botón de cierre
  const closeBtn = dialog.querySelector('.login-modal-close');
  closeBtn?.addEventListener('click', () => { 
    try { 
      dialog.close(); 
    } catch { 
      dialog.removeAttribute('open'); 
    } 
  });

  // Configuración del formulario
  const form = dialog.querySelector('#auth-form');
  const emailInput = form?.querySelector('input[type="email"]');
  const nameInput  = form?.querySelector('input[name="name"]');
  
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    Auth.setAuthed(emailInput?.value || '', nameInput?.value || '');
    const intent = Intent.load(); 
    Intent.clear();
    
    // Redirección basada en la intención guardada
    if (intent?.href) { 
      location.href = intent.href.includes('recetas.html') ? 'recetas.html' : 'index.html'; 
    } else { 
      location.reload(); 
    }
  });
};

/**
 * Abre el modal de inicio de sesión o redirige a la página de login
 * @function
 * @param {string} [reason='manual'] - Razón por la que se solicita el login
 * @param {string} [href=location.pathname] - URL a la que redirigir después del login
 * @description Si existe el modal lo muestra, si no redirige a login.html
 */
const openLoginPopup = (reason='manual', href=location.pathname) => {
  const loginDialog = document.getElementById('login-modal');
  
  // Si no existe el modal, guarda la intención y redirige
  if (!loginDialog) { 
    Intent.save({ reason, href }); 
    location.href = 'login.html'; 
    return; 
  }

  // Si existe el modal, lo configura y muestra
  Intent.save({ reason, href }); 
  wireLoginPopupOnce(loginDialog);
  
  try { 
    loginDialog.showModal?.() ?? loginDialog.setAttribute('open',''); 
  } catch { 
    location.href = 'login.html'; 
  }
};

/* ---- Eventos globales ---- */
document.addEventListener('DOMContentLoaded', () => {
  wireNavBasics();
  document.addEventListener('click', (e) => {
    const card = e.target.closest?.('.recipe-card'); if (!card) return;
    if (card.classList.contains('cat-card-tile')) return;
    if (!Auth.isAuthed()) { e.preventDefault(); openLoginPopup('card', 'recetas.html'); return; }
    const recipeDialog = document.getElementById('recipe-modal');
    if (recipeDialog) { e.preventDefault(); openRecipeFromCard(card, recipeDialog); }
  });
});

/* =====================================================================
   ===============  Recetas.html — lógica de categorías  ================
   ===================================================================== */
(function () {
  const catGrid = document.getElementById('cat-grid');
  const catView = document.getElementById('category-view');
  if (!catGrid || !catView) return;

  const TITLE   = document.getElementById('category-title');
  const GALLERY = document.getElementById('category-gallery');
  const SEE_ALL = document.getElementById('btn-see-all');

  const RECIPES = [
    { id:'ensalada-quinoa', title:'Ensalada de quinoa y palta', img:'../imagenes/quinoa.jpg', time:18, servings:2, method:'crudo', cats:['saludable'], ingredients:['Quinoa','Palta','Tomate','Pepino','Limón','Aceite de oliva','Sal'] },
    { id:'pollo-grill', title:'Pollo grillado con verduras', img:'../imagenes/pollo.jpg', time:25, servings:2, method:'plancha', cats:['saludable'], ingredients:['Pechuga de pollo','Zucchini','Morrón','Aceite de oliva','Sal','Pimienta'] },
    { id:'sopa-calabaza', title:'Sopa cremosa de calabaza', img:'../imagenes/sopacalabaza.jpg', time:30, servings:4, method:'olla', cats:['saludable'], ingredients:['Calabaza','Cebolla','Caldo de verduras','Crema','Sal'] },
    { id:'bowl-med', title:'Bowl mediterráneo', img:'../imagenes/ensalada-mediterranea.jpg', time:15, servings:2, method:'crudo', cats:['saludable'], ingredients:['Garbanzos','Tomate','Pepino','Aceitunas','Queso feta','Limón'] },
    { id:'pesto', title:'Pesto clásico', img:'../imagenes/pesto.jpg', time:10, servings:4, method:'crudo', cats:['vegetariano','pastas'], ingredients:['Albahaca','Queso parmesano','Nueces','Aceite de oliva'] },
    { id:'risotto-hongos', title:'Risotto de hongos', img:'../imagenes/risotto.jpg', time:35, servings:3, method:'olla', cats:['vegetariano','pastas'], ingredients:['Arroz arborio','Hongos','Caldo de verduras','Queso parmesano'] },
    { id:'caprese', title:'Sándwich caprese', img:'../imagenes/sandwich.jpg', time:8, servings:2, method:'frío', cats:['vegetariano'], ingredients:['Pan ciabatta','Mozzarella','Tomate','Albahaca'] },
    { id:'curry-garb', title:'Curry de garbanzos', img:'../imagenes/curry.jpg', time:25, servings:3, method:'olla', cats:['vegetariano'], ingredients:['Garbanzos','Leche de coco','Curry','Cebolla'] },
    { id:'brownies', title:'Brownies', img:'../imagenes/brownie.jpg', time:35, servings:12, method:'horno', cats:['dulce'], ingredients:['Chocolate','Manteca','Huevos','Azúcar','Harina'] },
    { id:'alfajores', title:'Alfajores de maicena', img:'../imagenes/alfajores-de-maicena.jpg', time:50, servings:18, method:'horno', cats:['dulce'], ingredients:['Maicena','Harina','Manteca','Dulce de leche','Coco rallado'] },
    { id:'pancakes', title:'Pancakes', img:'../imagenes/pancakes.jpg', time:20, servings:10, method:'sartén', cats:['dulce'], ingredients:['Harina','Huevos','Leche','Azúcar','Polvo de hornear'] },
    { id:'flan', title:'Flan casero', img:'../imagenes/flan.jpg', time:70, servings:8, method:'horno', cats:['dulce'], ingredients:['Huevos','Leche','Azúcar','Vainilla'] },
    { id:'risotto-azaf', title:'Risotto al azafrán', img:'../imagenes/azafran.jpg', time:30, servings:2, method:'olla', cats:['romantica'], ingredients:['Arroz arborio','Caldo','Azafrán','Queso parmesano'] },
    { id:'salmon-hierbas', title:'Salmón con manteca de hierbas', img:'../imagenes/salmon.jpg', time:22, servings:2, method:'plancha', cats:['romantica'], ingredients:['Salmón','Manteca','Hierbas frescas','Limón'] },
    { id:'lomo-malbec', title:'Lomo al malbec', img:'../imagenes/lomo.jpg', time:35, servings:2, method:'sartén', cats:['romantica'], ingredients:['Lomo','Vino malbec','Manteca','Sal','Pimienta'] },
    { id:'brulee', title:'Crème brûlée', img:'../imagenes/creme-brule.jpg', time:50, servings:2, method:'horno', cats:['romantica'], ingredients:['Crema','Yemas','Azúcar','Vainilla'] },
    { id:'tacos', title:'Tacos de carne', img:'../imagenes/tacos.jpg', time:20, servings:4, method:'sartén', cats:['paises'], ingredients:['Tortillas','Carne vacuna','Cebolla','Cilantro','Limón'] },
    { id:'paella', title:'Paella mixta', img:'../imagenes/paella.jpg', time:45, servings:4, method:'paellera', cats:['paises'], ingredients:['Arroz','Mariscos','Pollo','Morrón','Azafrán'] },
    { id:'sushi', title:'Sushi básico', img:'../imagenes/sushi.jpg', time:50, servings:3, method:'crudo', cats:['paises'], ingredients:['Arroz','Alga nori','Salmón','Pepino','Vinagre de arroz'] },
    { id:'tikka', title:'Pollo tikka masala', img:'../imagenes/pollo-tikka.jpg', time:40, servings:3, method:'olla', cats:['paises'], ingredients:['Pollo','Yogur','Garam masala','Tomate','Crema'] },
    { id:'omelette-caprese', title:'Omelette caprese', img:'../imagenes/omelet.jpg', time:6, servings:1, method:'sartén', cats:['minutos'], ingredients:['Huevos','Tomate','Albahaca','Mozzarella','Sal'] },
    { id:'pasta-ajoaceite', title:'Pasta ajo y aceite', img:'../imagenes/pasta-ajo.jpg', time:8, servings:2, method:'olla', cats:['minutos'], ingredients:['Pasta','Ajo','Aceite de oliva','Ají molido','Perejil'] },
    { id:'tostadas-fr', title:'Tostadas francesas', img:'../imagenes/tostada-francesa.jpg', time:8, servings:2, method:'sartén', cats:['minutos'], ingredients:['Pan','Huevo','Leche','Azúcar','Canela'] },
    { id:'ensalada-atun', title:'Ensalada rápida de atún', img:'../imagenes/ensalada-atun.jpg', time:8, servings:2, method:'crudo', cats:['minutos'], ingredients:['Atún','Lechuga','Tomate','Aceite de oliva','Limón','Sal'] },
    { id:'pan-sg', title:'Pan sin gluten', img:'../imagenes/pan-sin.jpg', time:25, servings:12, method:'horno', cats:['sintacc'], ingredients:['Mezcla sin gluten','Levadura','Agua','Aceite','Sal'] },
    { id:'pizza-sg', title:'Pizza sin gluten', img:'../imagenes/pizza-sin.jpg', time:30, servings:8, method:'horno', cats:['sintacc'], ingredients:['Mezcla sin gluten','Salsa de tomate','Queso','Orégano'] },
    { id:'arroz-pollo', title:'Arroz con pollo', img:'../imagenes/arroz-pollo.jpg', time:35, servings:3, method:'olla', cats:['sintacc'], ingredients:['Arroz','Pollo','Morrón','Caldo'] },
    { id:'budin-naranja', title:'Budín de naranja', img:'../imagenes/budin-naranja.jpg', time:50, servings:10, method:'horno', cats:['sintacc'], ingredients:['Harina sin gluten','Huevos','Azúcar','Naranja'] },
    { id:'fileto', title:'Salsa fileto', img:'../imagenes/salsa-fileto.jpg', time:25, servings:4, method:'olla', cats:['pastas'], ingredients:['Tomate triturado','Cebolla','Aceite de oliva','Albahaca'] },
    { id:'bolognesa', title:'Salsa bolognesa', img:'../imagenes/bolognesa.jpg', time:45, servings:6, method:'olla', cats:['pastas'], ingredients:['Carne picada','Zanahoria','Cebolla','Tomate'] },
    { id:'pesto-pasta', title:'Fetuccini al pesto', img:'../imagenes/fetuccini.jpg', time:12, servings:2, method:'olla', cats:['pastas'], ingredients:['Fetuccini','Pesto','Queso parmesano','Sal'] },
    { id:'puttanesca', title:'Salsa puttanesca', img:'../imagenes/salsa-putanesca.jpg', time:20, servings:4, method:'olla', cats:['pastas'], ingredients:['Tomate','Aceitunas','Alcaparras','Ajo'] }
  ];

  const NAME = {
    saludable:'Saludable', vegetariano:'Vegetariano', dulce:'Dulce', romantica:'Cena romántica',
    paises:'Países', minutos:'10 minutos', sintacc:'SIN TACC', pastas:'Pastas y Salsas'
  };

  /**
 * @typedef {Object} RecipeQuantities
 * @property {Object.<string, string>} ingredients - Mapa de ingredientes a cantidades
 */

/**
 * Renderiza las tarjetas de recetas en la galería
 * @function
 * @param {Recipe[]} list - Lista de recetas a mostrar
 * @description Genera el HTML para cada receta y lo inserta en la galería
 */
const renderCards = (list) => {
    /** @type {Object.<string, RecipeQuantities>} */
    const QTY = {
      "Ensalada de quinoa y palta": {
        "Quinoa": "100 g",
        "Palta": "1 unidad",
        "Tomate": "1 mediano",
        "Pepino": "1/2 unidad",
        "Limón": "1/2 unidad (jugo)",
        "Aceite de oliva": "2 cdas",
        "Sal": "1 pizca"
      },
      "Pollo grillado con verduras": {
        "Pechuga de pollo": "2 unidades (200 g c/u)",
        "Zucchini": "1 unidad",
        "Morrón": "1 unidad",
        "Aceite de oliva": "1 cda",
        "Sal": "1/2 cdta",
        "Pimienta": "1/4 cdta"
      },
      "Sopa cremosa de calabaza": {
        "Calabaza": "500 g",
        "Cebolla": "1 unidad",
        "Caldo de verduras": "600 ml",
        "Crema": "100 ml",
        "Sal": "1/2 cdta"
      },
      "Bowl mediterráneo": {
        "Garbanzos": "150 g cocidos",
        "Tomate": "1 unidad",
        "Pepino": "1/2 unidad",
        "Aceitunas": "6 unidades",
        "Queso feta": "50 g",
        "Limón": "1/2 unidad (jugo)"
      },
      "Pesto clásico": {
        "Albahaca": "40 g",
        "Queso parmesano": "40 g",
        "Nueces": "30 g",
        "Aceite de oliva": "100 ml"
      },
      "Risotto de hongos": {
        "Arroz arborio": "200 g",
        "Hongos": "150 g",
        "Caldo de verduras": "600 ml",
        "Queso parmesano": "50 g"
      },
      "Sándwich caprese": {
        "Pan ciabatta": "2 unidades",
        "Mozzarella": "100 g",
        "Tomate": "1 unidad",
        "Albahaca": "4 hojas"
      },
      "Curry de garbanzos": {
        "Garbanzos": "200 g cocidos",
        "Leche de coco": "200 ml",
        "Curry": "1 cda",
        "Cebolla": "1 unidad"
      },
      "Brownies": {
        "Chocolate": "200 g",
        "Manteca": "120 g",
        "Huevos": "3 unidades",
        "Azúcar": "150 g",
        "Harina": "100 g"
      },
      "Alfajores de maicena": {
        "Maicena": "200 g",
        "Harina": "100 g",
        "Manteca": "150 g",
        "Dulce de leche": "200 g",
        "Coco rallado": "50 g"
      },
      "Pancakes": {
        "Harina": "150 g",
        "Huevos": "2 unidades",
        "Leche": "250 ml",
        "Azúcar": "2 cdas",
        "Polvo de hornear": "1 cdta"
      },
      "Flan casero": {
        "Huevos": "4 unidades",
        "Leche": "500 ml",
        "Azúcar": "120 g",
        "Vainilla": "1 cdta"
      },
      "Risotto al azafrán": {
        "Arroz arborio": "200 g",
        "Caldo": "600 ml",
        "Azafrán": "1 pizca",
        "Queso parmesano": "40 g"
      },
      "Salmón con manteca de hierbas": {
        "Salmón": "2 filetes (150 g c/u)",
        "Manteca": "40 g",
        "Hierbas frescas": "1 cda picadas",
        "Limón": "1/2 unidad"
      },
      "Lomo al malbec": {
        "Lomo": "2 medallones (150 g c/u)",
        "Vino malbec": "150 ml",
        "Manteca": "30 g",
        "Sal": "1/2 cdta",
        "Pimienta": "1/4 cdta"
      },
      "Crème brûlée": {
        "Crema": "250 ml",
        "Yemas": "3 unidades",
        "Azúcar": "60 g",
        "Vainilla": "1 cdta"
      },
      "Tacos de carne": {
        "Tortillas": "4 unidades",
        "Carne vacuna": "200 g",
        "Cebolla": "1 unidad",
        "Cilantro": "1 cda picado",
        "Limón": "1/2 unidad"
      },
      "Paella mixta": {
        "Arroz": "300 g",
        "Mariscos": "200 g",
        "Pollo": "150 g",
        "Morrón": "1 unidad",
        "Azafrán": "1 pizca"
      },
      "Sushi básico": {
        "Arroz": "200 g",
        "Alga nori": "3 láminas",
        "Salmón": "100 g",
        "Pepino": "1/2 unidad",
        "Vinagre de arroz": "2 cdas"
      },
      "Pollo tikka masala": {
        "Pollo": "300 g",
        "Yogur": "100 ml",
        "Garam masala": "1 cda",
        "Tomate": "1 unidad",
        "Crema": "50 ml"
      },
      "Omelette caprese": {
        "Huevos": "2 unidades",
        "Tomate": "1 unidad",
        "Albahaca": "4 hojas",
        "Mozzarella": "50 g",
        "Sal": "1 pizca"
      },
      "Pasta ajo y aceite": {
        "Pasta": "200 g",
        "Ajo": "2 dientes",
        "Aceite de oliva": "3 cdas",
        "Ají molido": "1/2 cdta",
        "Perejil": "1 cda picado"
      },
      "Tostadas francesas": {
        "Pan": "4 rebanadas",
        "Huevo": "2 unidades",
        "Leche": "100 ml",
        "Azúcar": "1 cda",
        "Canela": "1/2 cdta"
      },
      "Ensalada rápida de atún": {
        "Atún": "1 lata (120 g)",
        "Lechuga": "1 taza",
        "Tomate": "1 unidad",
        "Aceite de oliva": "1 cda",
        "Limón": "1/2 unidad (jugo)",
        "Sal": "1 pizca"
      },
      "Pan sin gluten": {
        "Mezcla sin gluten": "400 g",
        "Levadura": "10 g",
        "Agua": "300 ml",
        "Aceite": "2 cdas",
        "Sal": "1 cdta"
      },
      "Pizza sin gluten": {
        "Mezcla sin gluten": "300 g",
        "Salsa de tomate": "100 ml",
        "Queso": "150 g",
        "Orégano": "1 cdta"
      },
      "Arroz con pollo": {
        "Arroz": "200 g",
        "Pollo": "200 g",
        "Morrón": "1 unidad",
        "Caldo": "400 ml"
      },
      "Budín de naranja": {
        "Harina sin gluten": "250 g",
        "Huevos": "2 unidades",
        "Azúcar": "150 g",
        "Naranja": "1 unidad (ralladura y jugo)"
      },
      "Salsa fileto": {
        "Tomate triturado": "400 g",
        "Cebolla": "1 unidad",
        "Aceite de oliva": "2 cdas",
        "Albahaca": "4 hojas"
      },
      "Salsa bolognesa": {
        "Carne picada": "300 g",
        "Zanahoria": "1 unidad",
        "Cebolla": "1 unidad",
        "Tomate": "400 g"
      },
      "Fetuccini al pesto": {
        "Fetuccini": "200 g",
        "Pesto": "80 g",
        "Queso parmesano": "30 g",
        "Sal": "1 pizca"
      },
      "Salsa puttanesca": {
        "Tomate": "400 g",
        "Aceitunas": "8 unidades",
        "Alcaparras": "1 cda",
        "Ajo": "2 dientes"
      }
    };

    window.RECIPE_HTML = window.RECIPE_HTML || {};
    const tpl = list.map(r => {
      const qtyMap = QTY[r.title] || {};
      const li = r.ingredients.map(x => {
        const name = String(x).trim();
        const q = qtyMap[name] || '—';
        return `<li><strong>${name}</strong>: ${q}</li>`;
      }).join('');
      window.RECIPE_HTML[r.title] = `
        <article>
          <h4>Ingredientes</h4>
          <ul>${li}</ul>
        </article>`;
      return `
        <a class="recipe-card" href="#!"
           data-time="${r.time}" data-servings="${r.servings}" data-method="${r.method}"
           aria-label="Ver receta: ${r.title}">
          <figure>
            <img src="${r.img}" alt="${r.title}" loading="lazy">
            <figcaption class="overlay">
              <h3 class="title">${r.title}</h3>
              <p class="meta">⏱️ ${r.time} min • 👥 ${r.servings}</p>
            </figcaption>
          </figure>
        </a>`;
    }).join('');
    GALLERY.innerHTML = tpl;
  };

  /**
 * Muestra las recetas de una categoría específica
 * @function
 * @param {string} catKey - Clave de la categoría a mostrar
 * @description Filtra las recetas por categoría, actualiza la URL y muestra la vista
 */
const showCategory = (catKey) => {
    TITLE.textContent = `Categoría: ${NAME[catKey] || catKey}`;
    renderCards(RECIPES.filter(r => r.cats.includes(catKey)));
    catGrid.hidden = true;
    catView.hidden = false;
    try { history.replaceState(null, '', `#${catKey}`); } catch {}
    GALLERY.scrollIntoView({ behavior:'smooth', block:'start' });
};

/**
 * Muestra todas las recetas disponibles
 * @function
 * @description Muestra la lista completa de recetas y actualiza la URL
 */
const showAll = () => {
    TITLE.textContent = 'Todas las recetas';
    renderCards(RECIPES);
    catGrid.hidden = true;
    catView.hidden = false;
    try { history.replaceState(null, '', '#all'); } catch {}
    GALLERY.scrollIntoView({ behavior:'smooth', block:'start' });
};

  catGrid.addEventListener('click', e=>{
    const tile = e.target.closest('.cat-card-tile,[data-cat]'); if (!tile) return;
    e.preventDefault();
    const key = tile.getAttribute('data-cat');
    showCategory(key);
  });

  SEE_ALL?.addEventListener('click', e=>{ e.preventDefault(); showAll(); });

  document.getElementById('back-to-cats')?.addEventListener('click', e=>{
    e.preventDefault();
    catGrid.hidden = false;
    catView.hidden = true;
    try { history.replaceState(null, '', '#'); } catch {}
    catGrid.scrollIntoView({ behavior:'smooth', block:'start' });
  });

  const initFromHash = () => {
    const h = (location.hash||'').slice(1);
    if (h === 'all') showAll();
    else if (NAME[h]) showCategory(h);
  };
  initFromHash();

  window.addEventListener('hashchange', ()=>{
    const h = (location.hash||'').slice(1);
    if (h === 'all') showAll();
    else if (NAME[h]) showCategory(h);
  });
})();
