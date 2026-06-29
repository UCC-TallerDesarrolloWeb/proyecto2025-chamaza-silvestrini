/**
 * @fileoverview Utilidades mínimas compartidas para el sitio Tenedor Libre
 * @description Provee helpers mínimos: Auth, Intent y comportamiento del header/nav
 * @module tenedorlibre
 */
(() => {
  /**
   * @namespace
   * @global
   * @description Maneja la autenticación del usuario a nivel global
   */
  if (!window.Auth) {
    window.Auth = {
      /**
       * Verifica si el usuario está autenticado
       * @method isAuthed
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
       * @method setAuthed
       * @param {string} email - Email del usuario
       * @param {string} name - Nombre del usuario
       */
      setAuthed: (email, name) => { 
        try { 
          localStorage.setItem('authed','1'); 
          if(email) localStorage.setItem('userEmail', email); 
          if(name) localStorage.setItem('userName', name); 
        } catch {} 
      },

      /**
       * Limpia los datos de autenticación
       * @method clear
       */
      clear: () => { 
        try { 
          localStorage.removeItem('authed'); 
          localStorage.removeItem('userEmail'); 
          localStorage.removeItem('userName'); 
        } catch {} 
      }
    };
  }

  /**
   * @namespace
   * @global
   * @description Maneja las intenciones de navegación del usuario
   */
  if (!window.Intent) {
    window.Intent = {
      /**
       * Guarda una intención de navegación
       * @method save
       * @param {Object} i - Objeto con la información de la intención
       * @param {string} i.reason - Razón de la intención
       * @param {string} i.href - URL destino
       */
      save: (i) => { 
        try { 
          sessionStorage.setItem('intent', JSON.stringify(i)); 
        } catch {} 
      },

      /**
       * Carga la intención guardada
       * @method load
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
       * @method clear
       */
      clear: () => {
        try { 
          sessionStorage.removeItem('intent'); 
        } catch {} 
      }
    };
  }

  /**
   * Inicializa el comportamiento básico de la barra de navegación
   * @method wireNavBasics
   * @description Configura el menú hamburguesa y el efecto de scroll del header
   */
  const wireNavBasics = () => {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.getElementById('site-nav') || document.querySelector('.links');
    if (toggle && links && !toggle.dataset.navWired){
      toggle.dataset.navWired = '1';
      toggle.addEventListener('click', ()=>{
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
    const onScroll = ()=>{
      if (window.scrollY > 6) header?.classList.add('scrolled');
      else header?.classList.remove('scrolled');
    };
    onScroll(); window.addEventListener('scroll', onScroll);

    const navReg = document.getElementById('nav-register');
    const navEl  = document.getElementById('site-nav') || document.querySelector('.links');
    if (navReg && navEl) {
      try {
        const auth = JSON.parse(localStorage.getItem('cmf_auth') || 'null');
        if (auth) {
          const first = (auth.name || auth.username || 'Usuario').split(' ')[0];
          const greetingEl = document.createElement('span');
          greetingEl.className = 'nav-greeting';
          greetingEl.textContent = `Hola, ${first}`;
          navEl.insertBefore(greetingEl, navEl.firstChild);
          navReg.textContent = 'Cerrar sesión';
          navReg.removeAttribute('href');
          navReg.classList.add('nav-logout');
          navReg.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('cmf_auth');
            window.showToast?.('Sesión cerrada. ¡Hasta pronto!', 'info');
            setTimeout(() => location.reload(), 1400);
          });
        }
      } catch {}
    }
  };

  /**
   * Muestra un toast de notificación personalizado
   * @method showToast
   * @param {string} msg - Mensaje a mostrar
   * @param {'success'|'error'|'info'} [type='success'] - Tipo de notificación
   * @param {number} [duration=3200] - Duración en milisegundos
   */
  window.showToast = (msg, type = 'success', duration = 3200) => {
    let toast = document.getElementById('app-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'app-toast';
      toast.setAttribute('role', 'status');
      toast.setAttribute('aria-live', 'polite');
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.className = `app-toast toast-${type} toast-show`;
    clearTimeout(toast._hideTimer);
    toast._hideTimer = setTimeout(() => toast.classList.remove('toast-show'), duration);
  };

  document.addEventListener('DOMContentLoaded', ()=>{
    try{ wireNavBasics(); }catch(e){}
  });
})();
