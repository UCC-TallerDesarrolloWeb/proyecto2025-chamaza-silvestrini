/**
 * @fileoverview Lógica principal de la página de inicio de Tenedor Libre
 * @description Maneja autenticación, navegación, reseñas, contacto y menú desplegable
 * @module index
 */

/**
 * Módulo de autenticación de usuario usando localStorage
 * @namespace Auth
 */
const Auth = {
  /**
   * Verifica si el usuario está autenticado
   * @returns {boolean} true si el usuario tiene sesión activa
   */
  isAuthed: () => {
    try { return localStorage.getItem('authed') === '1'; } catch { return false; }
  },

  /**
   * Guarda el estado de autenticación del usuario
   * @param {string} email - Email del usuario
   * @param {string} name - Nombre del usuario
   */
  setAuthed: (email, name) => {
    try {
      localStorage.setItem('authed', '1');
      if (email) localStorage.setItem('userEmail', email);
      if (name)  localStorage.setItem('userName',  name);
    } catch {}
  },

  /**
   * Elimina los datos de sesión del usuario
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
 * Cierra la sesión actual y muestra aviso al usuario
 */
window.cmfLogout = () => { Auth.clear(); showToast('Sesión cerrada. Podés volver a ingresar.', 'info'); };

/**
 * Módulo para guardar y recuperar la intención de navegación del usuario
 * @namespace Intent
 */
const Intent = {
  /**
   * Guarda una intención en sessionStorage
   * @param {Object} intent - Objeto con la intención
   * @param {string} intent.reason - Motivo de la redirección
   * @param {string} intent.href - URL destino
   */
  save: (intent) => { try { sessionStorage.setItem('intent', JSON.stringify(intent)); } catch {} },

  /**
   * Recupera la intención guardada
   * @returns {Object|null} La intención guardada o null si no existe
   */
  load: () => { try { return JSON.parse(sessionStorage.getItem('intent')||'null'); } catch { return null; } },

  /**
   * Elimina la intención guardada
   */
  clear: () => { try { sessionStorage.removeItem('intent'); } catch {} }
};

/**
 * Inicializa el comportamiento básico de la barra de navegación
 * @description Configura el menú hamburguesa para móvil y el efecto de scroll del header
 */
const wireNavBasics = () => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.getElementById('site-nav') || document.querySelector('.links');
  if (toggle && links && !toggle.dataset.navWired){
    toggle.dataset.navWired = '1';
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    links.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('click', () => {
        links.classList.remove('open');
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }
  const onScroll = () => {
    if (window.scrollY > 6) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);
};

/**
 * Inicializa el menú desplegable de categorías de recetas
 * @description Abre y cierra el dropdown al hacer clic y lo cierra al hacer clic fuera
 */
const wireDropdownMenu = () => {
  const ddBtn  = document.getElementById("dd-recetas-btn");
  const ddMenu = document.getElementById("dd-recetas");
  if (!ddBtn || !ddMenu) return;
  ddBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = ddBtn.getAttribute("aria-expanded") === "true";
    ddBtn.setAttribute("aria-expanded", String(!isOpen));
    ddMenu.hidden = isOpen;
  });
  document.addEventListener("click", (e) => {
    if (!ddMenu.hidden && !ddMenu.contains(e.target) && e.target !== ddBtn) {
      ddMenu.hidden = true;
      ddBtn.setAttribute("aria-expanded", "false");
    }
  });
  ddMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      ddMenu.hidden = true;
      ddBtn.setAttribute("aria-expanded", "false");
    });
  });
};

/**
 * Configura el modal de login una única vez para evitar duplicar listeners
 * @param {HTMLDialogElement} dialog - El elemento dialog del modal de login
 */
const wireLoginPopupOnce = (dialog) => {
  if (!dialog || dialog.dataset.wired === '1') return;
  dialog.dataset.wired = '1';
  const closeBtn = dialog.querySelector('.login-modal-close');
  closeBtn?.addEventListener('click', () => {
    try { dialog.close(); } catch { dialog.removeAttribute('open'); }
  });
  const form         = dialog.querySelector('#auth-form');
  const radios       = form?.querySelectorAll('input[name="role"]');
  const emailInput   = form?.querySelector('input[type="email"]');
  const nameInput    = form?.querySelector('input[type="name"]');
  if (radios?.length){
    radios.forEach(r => r.addEventListener('change', () => {
      form?.setAttribute('data-role', r.value);
    }));
  }
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    Auth.setAuthed(emailInput?.value || '', nameInput?.value || '');
    const intent = Intent.load(); Intent.clear();
    if (intent?.href) {
      location.href = intent.href.includes('recetas.html') ? 'recetas.html' : 'index.html';
    } else {
      location.reload();
    }
  });
};

/**
 * Abre el popup de login o redirige a login.html si el popup no está disponible
 * @param {string} [reason='manual'] - Razón por la que se solicita el login
 * @param {string} [href=location.pathname] - URL a la que redirigir tras el login
 */
const openLoginPopup = (reason = 'manual', href = location.pathname) => {
  const loginDialog = document.getElementById('login-modal');
  if (!loginDialog) { Intent.save({ reason, href }); location.href = 'login.html'; return; }
  Intent.save({ reason, href });
  wireLoginPopupOnce(loginDialog);
  try { loginDialog.showModal?.() ?? loginDialog.setAttribute('open',''); }
  catch { location.href = 'login.html'; }
};

/**
 * Inicializa el sistema de reseñas: muestra las guardadas, gestiona estrellas y envío
 * @description Lee y escribe en localStorage con la clave 'reviews'
 */
const wireReviews = () => {
  const form = document.getElementById('review-form');
  const list = document.getElementById('reviews-list');
  const avgSpan = document.getElementById('avg');

  if (!form || !list) return;

  /**
   * Renderiza la lista de reseñas guardadas y actualiza el promedio
   */
  const renderReviews = () => {
    const data = JSON.parse(localStorage.getItem('reviews') || '[]');
    list.innerHTML = '';
    if (data.length === 0) {
      list.innerHTML = '<li class="muted">Aún no hay reseñas… ¡sé el primero!</li>';
      if (avgSpan) avgSpan.textContent = '⭐ 0.0';
      return;
    }
    let sum = 0;
    data.forEach(r => {
      sum += r.rating;
      const fecha = new Date(r.date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
      const li = document.createElement('li');
      li.classList.add('review-item');
      li.innerHTML = `
        <p class="review-text">
          <strong>${r.name || 'Anónimo'}</strong>
          <span class="review-meta"> • ${fecha}</span><br>
          <span class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</span>
        </p>
        <p class="review-comment">${r.text}</p>
      `;
      list.appendChild(li);
    });
    if (list.lastChild) list.lastChild.classList.add('no-border');
    if (avgSpan) avgSpan.textContent = `⭐ ${(sum / data.length).toFixed(1)}`;
  };
  renderReviews();

  // Verificar sesión activa
  const auth = (() => {
    try { return JSON.parse(localStorage.getItem('cmf_auth')); }
    catch { return null; }
  })();

  if (!auth) {
    // Sin sesión: reemplazar el formulario con un prompt de login
    form.innerHTML = `
      <div class="review-login-prompt">
        <p class="muted">Para dejar una reseña necesitás iniciar sesión.</p>
        <a href="login.html?redirect=index.html" class="btn">Iniciar sesión</a>
      </div>
    `;
    return;
  }

  // Con sesión: ocultar el campo nombre y pre-completarlo
  const nombreRow = form.querySelector('.form-row:has(#nombre)') || document.getElementById('nombre')?.closest('.form-row');
  const nombreInput = document.getElementById('nombre');
  if (nombreInput) nombreInput.value = auth.name || auth.username || 'Usuario';
  if (nombreRow) nombreRow.hidden = true;

  // Mostrar badge de quién está reseñando
  const badge = document.createElement('p');
  badge.className = 'review-author-badge';
  badge.innerHTML = `Reseñando como <strong>${auth.name?.split(' ')[0] || auth.username}</strong>`;
  form.prepend(badge);

  const stars = form.querySelectorAll('#stars-input button');
  const puntajeInput = form.querySelector('#puntaje');

  if (stars && puntajeInput) {
    stars.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        const val = parseInt(btn.dataset.v);
        stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.v) <= val));
      });
      btn.addEventListener('mouseleave', () => {
        const current = parseInt(puntajeInput.value || 0);
        stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.v) <= current));
      });
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.v);
        puntajeInput.value = val;
        stars.forEach(s => s.classList.toggle('active', parseInt(s.dataset.v) <= val));
      });
    });
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = auth.name || auth.username || 'Anónimo';
    const text = (form.querySelector('#comentario') || form.querySelector('[name="text"]'))?.value.trim() || '';
    const rating = parseInt(puntajeInput?.value || 0);

    if (!text || rating === 0) {
      showToast('Completá el comentario y elegí un puntaje ⭐', 'error');
      return;
    }

    const data = JSON.parse(localStorage.getItem('reviews') || '[]');
    data.unshift({ name, text, rating, date: new Date().toISOString() });
    localStorage.setItem('reviews', JSON.stringify(data));
    form.reset();
    if (nombreInput) nombreInput.value = auth.name || auth.username || '';
    if (puntajeInput) puntajeInput.value = 0;
    stars.forEach(s => s.classList.remove('active'));
    showToast('¡Reseña publicada! Gracias 🎉', 'success');
    renderReviews();
  });
};

/**
 * Inicializa el formulario de contacto con validación y feedback al usuario
 * @description Valida email y mensaje antes de confirmar el envío
 */
const wireContactForm = () => {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = document.getElementById('contact-email');
    const mensajeInput = document.getElementById('contact-mensaje');
    const email = emailInput?.value.trim() || '';
    const mensaje = mensajeInput?.value.trim() || '';
    if (!email) {
      showToast('Por favor ingresá tu email.', 'error');
      emailInput?.focus();
      return;
    }
    if (!mensaje) {
      showToast('Por favor escribí un mensaje.', 'error');
      mensajeInput?.focus();
      return;
    }
    showToast('¡Mensaje enviado! Nos pondremos en contacto pronto. 🎉', 'success');
    form.reset();
  });
};

/* ============== BOOT ============== */
document.addEventListener('DOMContentLoaded', () => {
  // Limpieza única de reseñas viejas
  if (!localStorage.getItem('tl_reviews_v2')) {
    localStorage.removeItem('reviews');
    localStorage.setItem('tl_reviews_v2', '1');
  }

  wireNavBasics();
  wireReviews();
  wireContactForm();
});
