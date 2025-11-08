/**
 * @fileoverview Gestión del formulario de inicio de sesión y registro
 * @module login
 */

(() => {
  /**
   * Selector simplificado de elementos DOM
   * @param {string} s - Selector CSS
   * @returns {Element|null} Elemento encontrado o null
   */
  const $ = (s) => document.querySelector(s);

  /**
   * Selector múltiple simplificado de elementos DOM
   * @param {string} s - Selector CSS
   * @returns {Element[]} Array de elementos encontrados
   */
  const $$ = (s) => Array.from(document.querySelectorAll(s));

  const form = $("#auth-form");
  const err = $(".form-error");

  // ===== Tabs: cambiar modo y requireds =====
  const setMode = (mode) => {
    form.setAttribute("data-mode", mode);

    const up = mode === "signup";
    // Sign in requireds
    $("#su-username").required = !up;
    $("#su-password").required = !up;
    // Sign up requireds
    [
      "#sg-first",
      "#sg-last",
      "#sg-phone",
      "#sg-email",
      "#sg-username",
      "#sg-password",
    ].forEach((sel) => {
      const el = $(sel);
      if (el) el.required = up;
    });

    err.textContent = "";
  };
  $$("#tab-signin, #tab-signup").forEach((r) => {
    r.addEventListener("change", () => setMode(r.value));
  });
  // Detectar parámetro ?mode=signup o hash que indique registro
  let initialMode = "signin";
  try {
    const p = new URLSearchParams(location.search);
    if (p.get("mode") === "signup") initialMode = "signup";
    else if (location.hash === "#signup" || location.hash === "#registrarse") initialMode = "signup";
  } catch {}
  // Marcar el radio correspondiente y aplicar el modo
  const radio = document.getElementById(initialMode === "signup" ? "tab-signup" : "tab-signin");
  if (radio) radio.checked = true;
  setMode(initialMode);

  /**
   * @typedef {Object} User
   * @property {string} first - Nombre
   * @property {string} last - Apellido
   * @property {string} phone - Teléfono
   * @property {string} email - Email
   * @property {string} username - Nombre de usuario
   * @property {string} password - Contraseña
   * @property {number} ts - Timestamp de registro
   */

  /** @constant {string} Clave para almacenar usuarios */
  const USERS_KEY = "cmf_users";
  /** @constant {string} Clave para almacenar usuario actual */
  const CURR_KEY = "cmf_current_user";

  /**
   * Carga la lista de usuarios registrados
   * @returns {Object.<string, User>} Mapa de usuarios por nombre de usuario
   */
  const loadUsers = () => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
    } catch {
      return {};
    }
  };

  /**
   * Guarda la lista de usuarios
   * @param {Object.<string, User>} obj - Mapa de usuarios
   */
  const saveUsers = (obj) => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify(obj));
    } catch {}
  };

  /**
   * Establece el usuario actualmente logueado
   * @param {string} username - Nombre de usuario
   */
  const setCurrent = (username) => {
    try {
      localStorage.setItem(CURR_KEY, username);
    } catch {}
  };

  /**
   * Determina la URL de redirección después del login
   * @returns {string} URL destino
   * @description Busca primero en Intent, luego en query params, o usa default
   */
  const getRedirectTarget = () => {
    try {
      if (window.Intent && typeof Intent.load === "function") {
        const it = Intent.load();
        if (it && it.href) {
          Intent.clear?.();
          return it.href;
        }
        Intent.clear?.();
      }
    } catch {}
    const p = new URLSearchParams(location.search);
    return p.get("redirect") || "recetas.html";
  };

  /**
   * Valida formato de email
   * @param {string} s - String a validar
   * @returns {boolean} true si es un email válido
   */
  const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s || "");

  /**
   * Valida longitud mínima de un string
   * @param {string} s - String a validar
   * @param {number} n - Longitud mínima requerida
   * @returns {boolean} true si cumple la longitud mínima
   */
  const minLen = (s, n) => (s || "").length >= n;

  // ===== Submit =====
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    err.textContent = "";
    const mode = form.getAttribute("data-mode");

    if (mode === "signin") {
      const user = $("#su-username").value.trim();
      const pass = $("#su-password").value;
      const users = loadUsers();
      const u = users[user];
      if (!u) {
        err.textContent = "Usuario no encontrado.";
        return;
      }
      if (u.password !== pass) {
        err.textContent = "Contraseña incorrecta.";
        return;
      }

      // Sesión
      try {
        Auth?.setAuthed?.(u.email, u.first + " " + u.last);
      } catch {}
      try {
        localStorage.setItem(
          "cmf_auth",
          JSON.stringify({
            email: u.email,
            name: u.first + " " + u.last,
            username: u.username,
            ts: Date.now(),
          })
        );
      } catch {}
      setCurrent(user);
      location.href = getRedirectTarget();
      return;
    }

    // signup
    const first = $("#sg-first").value.trim();
    const last = $("#sg-last").value.trim();
    const phone = $("#sg-phone").value.trim();
    const email = $("#sg-email").value.trim();
    const user = $("#sg-username").value.trim();
    const pass = $("#sg-password").value;

    if (!first || !last || !phone || !email || !user || !pass) {
      err.textContent = "Completá todos los campos.";
      return;
    }
    if (!isEmail(email)) {
      err.textContent = "Email inválido.";
      return;
    }
    if (!minLen(pass, 6)) {
      err.textContent = "La contraseña debe tener al menos 6 caracteres.";
      return;
    }

    const users = loadUsers();
    if (users[user]) {
      err.textContent = "Ese nombre de usuario ya existe.";
      return;
    }
    if (Object.values(users).some((u) => u.email === email)) {
      err.textContent = "Ese email ya está registrado.";
      return;
    }

    users[user] = {
      first,
      last,
      phone,
      email,
      username: user,
      password: pass,
      ts: Date.now(),
    };
    saveUsers(users);

    try {
      Auth?.setAuthed?.(email, first + " " + last);
    } catch {}
    try {
      localStorage.setItem(
        "cmf_auth",
        JSON.stringify({
          email,
          name: first + " " + last,
          username: user,
          ts: Date.now(),
        })
      );
    } catch {}
    setCurrent(user);
    location.href = getRedirectTarget();
  });
})();