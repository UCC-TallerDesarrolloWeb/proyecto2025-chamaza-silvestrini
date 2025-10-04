document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true' || false;
      btn.setAttribute('aria-expanded', String(!expanded));
      nav.classList.toggle('open');
      document.body.classList.toggle('nav-open');
    });
  }
});

// ===== Modal de Recetas =====
(function () {
  const dialog = document.getElementById('recipe-modal');
  if (!dialog) return;

  const imgEl   = document.getElementById('recipe-modal-img');
  const titleEl = document.getElementById('recipe-modal-title');
  const metaEl  = document.getElementById('recipe-modal-meta');
  const btnX    = dialog.querySelector('.recipe-modal-close');
  const btnBack = document.getElementById('recipe-modal-back');

  function openFromCard(card) {
    const img   = card.querySelector('img');
    const title = card.querySelector('.title');
    const meta  = card.querySelector('.meta');

    if (img)   { imgEl.src = img.getAttribute('src'); imgEl.alt = img.getAttribute('alt') || ''; }
    if (title) { titleEl.textContent = title.textContent.trim(); }
    if (meta)  { metaEl.textContent  = meta.textContent.trim();  }
    dialog.showModal();
  }

  const close = () => dialog.close();

  btnX.addEventListener('click', close);
  btnBack.addEventListener('click', close);

  dialog.addEventListener('click', (e) => {
    const rect = dialog.getBoundingClientRect();
    const clickedOutside = e.clientX < rect.left || e.clientX > rect.right ||
                           e.clientY < rect.top  || e.clientY > rect.bottom;
    if (clickedOutside) close();
  });

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('.recipe-card');
    if (!anchor) return;
    e.preventDefault();
    openFromCard(anchor);
  });
})();

// ===== Menú mobile + sombra al scrollear + scrollspy =====
(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.nav-toggle');
  const links  = document.querySelector('.links');

  // toggle
  if (toggle && links){
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  // sombra on scroll
  const onScroll = () => {
    if (window.scrollY > 6) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
  };
  onScroll(); window.addEventListener('scroll', onScroll);

  // scrollspy simple
  const sections = [...document.querySelectorAll('main section[id]')];
  const navAs = [...document.querySelectorAll('.links a[href^="#"]')];
  const spy = () => {
    const y = window.scrollY + 120;
    let current = null;
    for (const s of sections){
      const r = s.getBoundingClientRect();
      const top = window.scrollY + r.top;
      if (y >= top) current = s.id;
    }
    navAs.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === `#${current}`));
  };
  spy(); window.addEventListener('scroll', spy);
})();

// ===== Filtros de recetas por chips (nivel o método) =====
(() => {
  const cards = [...document.querySelectorAll('.recipe-card')];
  const chips = [...document.querySelectorAll('.recipe-toolbar .chip')];

  const setPressed = (tgt) => {
    chips.forEach(c => c.setAttribute('aria-pressed','false'));
    tgt.setAttribute('aria-pressed','true');
  };

  const apply = (value) => {
    if (!value || value === 'Todas'){
      cards.forEach(c => c.style.display = '');
      return;
    }
    const match = value.toLowerCase();
    cards.forEach(c => {
      const lvl = (c.dataset.level || '').toLowerCase();
      const met = (c.dataset.method || '').toLowerCase();
      c.style.display = (lvl === match || met === match) ? '' : 'none';
    });
  };

  chips.forEach(chip => chip.addEventListener('click', () => {
    setPressed(chip);
    apply(chip.dataset.filter || chip.textContent.trim());
  }));
})();
// ========= AUTH GATE (login requerido para ciertas acciones) =========
(() => {
  const LOGIN_PAGE = 'login.html'; // cambiá si tu archivo de login tiene otro nombre

  const isLoggedIn = () => {
    try {
      const raw = localStorage.getItem('cmf_auth');
      if (!raw) return false;
      const obj = JSON.parse(raw);
      return !!obj?.email; // condición mínima de "sesión"
    } catch { return false; }
  };

  const goToLogin = (targetHref) => {
    const redirect = encodeURIComponent(targetHref || location.href);
    window.location.href = `${LOGIN_PAGE}?redirect=${redirect}`;
  };

  // 1) Marcar automáticamente qué enlaces requieren login
  document.addEventListener('DOMContentLoaded', () => {
    // tarjetas de recetas (destacadas o listados)
    document.querySelectorAll('a.recipe-card').forEach(a =>
      a.setAttribute('data-auth-required', 'true')
    );

    // botón/enlace "Ver todas" (o cualquier enlace que vaya a recetas.html)
    document.querySelectorAll('a[href$="recetas.html"]').forEach(a =>
      a.setAttribute('data-auth-required', 'true')
    );
  });

  // 2) Interceptar clics en elementos protegidos
  document.addEventListener('click', (e) => {
    const a = e.target.closest('[data-auth-required="true"]');
    if (!a) return;
    if (isLoggedIn()) return;     // dejar pasar si está logueado

    e.preventDefault();           // bloquear navegación original
    const target = a.getAttribute('href') || location.href;
    goToLogin(target);            // mandar al login con redirect
  });

  // 3) Helpers globales (opcional)
  window.cmfLogout = () => { localStorage.removeItem('cmf_auth'); location.reload(); };
  window.cmfAuth   = { isLoggedIn };
})();
