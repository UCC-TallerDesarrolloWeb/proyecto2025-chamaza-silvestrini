const Auth = {
  isAuthed: () => {
    try { return localStorage.getItem('authed') === '1'; } catch { return false; }
  },
  setAuthed: (email, name) => {
    try {
      localStorage.setItem('authed', '1');
      if (email) localStorage.setItem('userEmail', email);
      if (name)  localStorage.setItem('userName',  name);
    } catch {}
  },
  clear: () => {
    try {
      localStorage.removeItem('authed');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
    } catch {}
  }
};
window.cmfLogout = () => { Auth.clear(); alert('Sesión borrada. Probá de nuevo.'); };

/* ============== INTENT (a dónde quería ir) ============== */
const Intent = {
  save: (intent) => { try { sessionStorage.setItem('intent', JSON.stringify(intent)); } catch {} },
  load: () => { try { return JSON.parse(sessionStorage.getItem('intent')||'null'); } catch { return null; } },
  clear: () => { try { sessionStorage.removeItem('intent'); } catch {} }
};

/* ============== NAV básico ============== */
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
  const onScroll = () => {
    if (window.scrollY > 6) header?.classList.add('scrolled');
    else header?.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll);
};

/* ============== MENÚ DESPLEGABLE DE CATEGORÍAS ============== */
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

/* ============== LOGIN POPUP ============== */
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

const openLoginPopup = (reason = 'manual', href = location.pathname) => {
  const loginDialog = document.getElementById('login-modal');
  if (!loginDialog) { Intent.save({ reason, href }); location.href = 'login.html'; return; }
  Intent.save({ reason, href });
  wireLoginPopupOnce(loginDialog);
  try { loginDialog.showModal?.() ?? loginDialog.setAttribute('open',''); }
  catch { location.href = 'login.html'; }
};

/* ============== Reseñas (arreglo total estrellas + estética) ============== */
const wireReviews = () => {
  const form = document.getElementById('review-form');
  const list = document.getElementById('reviews-list');
  const avgSpan = document.getElementById('avg');
  const stars = form?.querySelectorAll('#stars-input button');
  const puntajeInput = form?.querySelector('#puntaje');

  if (!form || !list) return;

  // Mostrar reseñas guardadas
  const renderReviews = () => {
    const data = JSON.parse(localStorage.getItem('reviews') || '[]');
    list.innerHTML = '';
    if (data.length === 0) {
      list.innerHTML = '<li class="muted">Aún no hay reseñas… ¡sé el primero!</li>';
      avgSpan.textContent = '⭐ 0.0';
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
    const avg = (sum / data.length).toFixed(1);
    avgSpan.textContent = `⭐ ${avg}`;
  };
  renderReviews();

  // === Estrellas interactivas correctamente orientadas ===
  if (stars && puntajeInput) {
    stars.forEach(btn => {
      btn.addEventListener('mouseenter', () => {
        const val = parseInt(btn.dataset.v);
        stars.forEach(s => {
          const v = parseInt(s.dataset.v);
          s.classList.toggle('active', v <= val);
        });
      });
      btn.addEventListener('mouseleave', () => {
        const current = parseInt(puntajeInput.value || 0);
        stars.forEach(s => {
          const v = parseInt(s.dataset.v);
          s.classList.toggle('active', v <= current);
        });
      });
      btn.addEventListener('click', () => {
        const val = parseInt(btn.dataset.v);
        puntajeInput.value = val;
        stars.forEach(s => {
          const v = parseInt(s.dataset.v);
          s.classList.toggle('active', v <= val);
        });
      });
    });
  }

  // Enviar reseña
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = form.nombre?.value || form.name?.value || 'Anónimo';
    const text = form.comentario?.value || form.text?.value || '';
    const rating = parseInt(form.puntaje?.value || 0);
    if (!text.trim() || rating === 0) {
      alert('Por favor, completá el comentario y seleccioná un puntaje.');
      return;
    }

    const data = JSON.parse(localStorage.getItem('reviews') || '[]');
    data.unshift({ name, text, rating, date: new Date().toISOString() });
    localStorage.setItem('reviews', JSON.stringify(data));
    form.reset();
    puntajeInput.value = 0;
  stars.forEach(s => { s.classList.remove('active'); });
    renderReviews();
  });
}

/* ============== BOOT ============== */
document.addEventListener('DOMContentLoaded', () => {
  wireNavBasics();
  wireDropdownMenu();
  wireReviews();

  // Navegación entre categorías
  document.addEventListener('click', (e) => {
    const tile = e.target.closest('.cat-card[data-cat]');
    if (!tile) return;
    e.preventDefault();
    location.href = `recetas.html#${tile.getAttribute('data-cat')}`;
  });

  document.getElementById('dd-recetas')?.addEventListener('click', (e)=>{
    const a = e.target.closest('a'); if (!a) return;
    if (a.hasAttribute('data-see-all')) {
      e.preventDefault(); location.href = 'recetas.html#all';
    } else if (a.hasAttribute('data-cat')) {
      e.preventDefault(); location.href = `recetas.html#${a.getAttribute('data-cat')}`;
    }
  });
});