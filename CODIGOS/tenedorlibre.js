/**
 * @fileoverview Utilidades mínimas compartidas para el sitio Tenedor Libre
 * @description Provee helpers mínimos: Auth, Intent y comportamiento del header/nav
 * @module tenedorlibre
 */
(() => {
  // No sobrescribir si ya existe
  /**
   * @namespace
   * @global
   * @description Maneja la autenticación del usuario a nivel global
   */
  if (!window.Auth) {
    window.Auth = {
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
  }

  const wireNavBasics = () => {
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.nav-toggle');
    const links  = document.getElementById('site-nav') || document.querySelector('.links');
    if (toggle && links){
      toggle.addEventListener('click', ()=>{
        const open = links.classList.toggle('open');
        document.body.classList.toggle('nav-open', open);
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
    const onScroll = ()=>{
      if (window.scrollY > 6) header?.classList.add('scrolled');
      else header?.classList.remove('scrolled');
    };
    onScroll(); window.addEventListener('scroll', onScroll);
  };

  document.addEventListener('DOMContentLoaded', ()=>{
    try{ wireNavBasics(); }catch(e){}
  });
})();

// Stub mínimo para evitar ERR_FILE_NOT_FOUND
(() => {
  // Código compartido del sitio (helpers, polyfills o init) puede ir aquí.
  document.addEventListener('DOMContentLoaded', () => {
    // placeholder: no hace nada por ahora
  });
})();
