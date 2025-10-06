/* =========================================================
   Tenedor Libre — JS principal
   ========================================================= */

/* ============== AUTH (mock) ============== */
const Auth = {
  isAuthed() {
    try { return localStorage.getItem('authed') === '1'; } catch { return false; }
  },
  setAuthed(email, name) {
    try {
      localStorage.setItem('authed', '1');
      if (email) localStorage.setItem('userEmail', email);
      if (name)  localStorage.setItem('userName',  name);
    } catch {}
  },
  clear() {
    try {
      localStorage.removeItem('authed');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
    } catch {}
  }
};
// Helper dev
window.cmfLogout = () => { Auth.clear(); alert('Sesión borrada. Probá de nuevo.'); };

/* ============== INTENT (a dónde quería ir) ============== */
const Intent = {
  save(intent) { try { sessionStorage.setItem('intent', JSON.stringify(intent)); } catch {} },
  load()       { try { return JSON.parse(sessionStorage.getItem('intent')||'null'); } catch { return null; } },
  clear()      { try { sessionStorage.removeItem('intent'); } catch {} }
};

/* ============== NAV básico ============== */
function wireNavBasics(){
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
  const onScroll = () => {
    if (window.scrollY > 6) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);
}

/* ============== MENÚ DESPLEGABLE DE CATEGORÍAS (reparado) ============== */
function wireDropdownMenu(){
  const ddBtn  = document.getElementById("dd-recetas-btn");
  const ddMenu = document.getElementById("dd-recetas");
  if (!ddBtn || !ddMenu) return;

  // Toggle al hacer click
  ddBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = ddBtn.getAttribute("aria-expanded") === "true";
    ddBtn.setAttribute("aria-expanded", String(!isOpen));
    ddMenu.hidden = isOpen;
  });

  // Cerrar al hacer click fuera
  document.addEventListener("click", (e) => {
    if (!ddMenu.hidden && !ddMenu.contains(e.target) && e.target !== ddBtn) {
      ddMenu.hidden = true;
      ddBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Cerrar al elegir opción
  ddMenu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      ddMenu.hidden = true;
      ddBtn.setAttribute("aria-expanded", "false");
    });
  });
}

/* ============== MODAL DE RECETA (completo) ============== */
function openRecipeFromCard(card, dialog) {
  const imgEl   = dialog.querySelector('#recipe-modal-img');
  const titleEl = dialog.querySelector('#recipe-modal-title');
  const metaEl  = dialog.querySelector('#recipe-modal-meta');
  const bodyEl  = dialog.querySelector('.recipe-modal-body');
  const btnX    = dialog.querySelector('.recipe-modal-close');

  const img   = card.querySelector('img');
  const title = card.querySelector('.title');
  const meta  = card.querySelector('.meta');

  if (img)   { imgEl.src = img.currentSrc || img.src; imgEl.alt = img.alt || ''; }
  const t = (title?.textContent || '').trim();
  titleEl.textContent = t || 'Receta';
  metaEl.textContent  = (meta?.textContent  || '').trim();

  const html = (typeof RECIPE_HTML !== 'undefined' && RECIPE_HTML[t])
    ? RECIPE_HTML[t]
    : `<p class="muted">Próximamente: ingredientes y paso a paso.</p>`;

  bodyEl.innerHTML = `
    ${html}
    <div class="modal-actions"><button class="btn secondary" id="recipe-modal-back">Cerrar</button></div>
  `;

  const close = () => { try { dialog.close(); } catch { dialog.removeAttribute('open'); } };
  dialog.querySelector('#recipe-modal-back')?.addEventListener('click', close, { once: true });
  btnX?.addEventListener('click', close, { once: true });

  try { dialog.showModal?.() ?? dialog.setAttribute('open',''); }
  catch { dialog.setAttribute('open',''); }
}

/* ============== LOGIN POPUP ============== */
function wireLoginPopupOnce(dialog){
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
}

function openLoginPopup(reason = 'manual', href = location.pathname) {
  const loginDialog = document.getElementById('login-modal');
  if (!loginDialog) { Intent.save({ reason, href }); location.href = 'login.html'; return; }
  Intent.save({ reason, href });
  wireLoginPopupOnce(loginDialog);
  try { loginDialog.showModal?.() ?? loginDialog.setAttribute('open',''); }
  catch { location.href = 'login.html'; }
}

/* ============== BOOT genérico (index y/o recetas) ============== */
document.addEventListener('DOMContentLoaded', () => {
  wireNavBasics();
  wireDropdownMenu();

  // Abrir modal de receta solo si hay sesión
  document.addEventListener('click', (e) => {
    const card = e.target.closest?.('.recipe-card');
    if (!card) return;
    if (!Auth.isAuthed()) { e.preventDefault(); openLoginPopup('card', location.pathname); return; }
    const recipeDialog = document.getElementById('recipe-modal');
    if (recipeDialog) { e.preventDefault(); openRecipeFromCard(card, recipeDialog); }
  });

  // Desde index: los tiles de categorías navegan a recetas.html#cat
  document.addEventListener('click', (e) => {
    const tile = e.target.closest('.cat-card[data-cat]');
    if (!tile) return;
    e.preventDefault();
    location.href = `recetas.html#${tile.getAttribute('data-cat')}`;
  });

  // Dropdown del header: siempre lleva a recetas.html#cat
  document.getElementById('dd-recetas')?.addEventListener('click', (e)=>{
    const a = e.target.closest('a'); if (!a) return;
    if (a.hasAttribute('data-see-all')) {
      e.preventDefault(); location.href = 'recetas.html#all';
    } else if (a.hasAttribute('data-cat')) {
      e.preventDefault(); location.href = `recetas.html#${a.getAttribute('data-cat')}`;
    }
  });
});
