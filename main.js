/* ─────────────────────────────────────────────────
   main.js — Nicoly Siqueira Portfolio
   ───────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', () => {

  const HEADER_HEIGHT = 72; // px — deve bater com --header-height no CSS

  /* ─── 1. HEADER: sombra ao rolar ─────────────── */
  const header = document.getElementById('header');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 20);
    highlightActiveSection();
  }, { passive: true });

  /* ─── 2. MENU MOBILE: abrir / fechar ─────────── */
  const menuToggle = document.getElementById('menuToggle');
  const nav        = document.getElementById('nav');

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
  });

  /* ─── 3. SMOOTH SCROLL com offset do header ──── */
  // Captura TODOS os links âncora da página (nav, botões, cards, etc.)
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const targetId = link.getAttribute('href'); // ex.: "#servicos"
      if (targetId === '#') return;               // ignora href="#" vazio

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Fecha o menu mobile se estiver aberto
      nav.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', false);

      // Calcula posição descontando o header fixo
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_HEIGHT;

      window.scrollTo({ top, behavior: 'smooth' });

      // Atualiza URL sem recarregar a página
      history.pushState(null, '', targetId);
    });
  });

  /* ─── 4. DESTAQUE DO ITEM ATIVO NO MENU ──────── */
  const navLinks  = nav.querySelectorAll('a[href^="#"]');
  const sections  = [];

  navLinks.forEach(link => {
    const id  = link.getAttribute('href').replace('#', '');
    const sec = document.getElementById(id);
    if (sec) sections.push({ link, sec });
  });

  function highlightActiveSection() {
    const scrollY = window.scrollY + HEADER_HEIGHT + 32; // 32px de margem

    // Percorre de baixo para cima para pegar a seção mais visível
    let active = null;
    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i].sec.offsetTop <= scrollY) {
        active = sections[i].link;
        break;
      }
    }

    navLinks.forEach(l => l.classList.remove('active'));
    if (active) active.classList.add('active');
  }

  // Roda ao carregar para já destacar a seção correta
  highlightActiveSection();

  /* ─── 5. ANIMAÇÃO DOS CARDS AO ENTRAR NA TELA ── */
  const cards = document.querySelectorAll('.card');

  if ('IntersectionObserver' in window) {
    const cardObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, idx) => {
        if (entry.isIntersecting) {
          // Delay escalonado por posição no grid
          const delay = idx * 0.1;
          entry.target.style.animation = `fadeUp 0.5s ${delay}s ease both`;
          cardObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    cards.forEach(card => {
      card.style.opacity = '0'; // esconde antes de animar
      cardObserver.observe(card);
    });
  } else {
    // Fallback: mostra sem animação em browsers antigos
    cards.forEach(card => { card.style.opacity = '1'; });
  }

  /* ─── 6. FILTRO DO PORTFÓLIO ─────────────────── */
  const filterBtns    = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      // Atualiza estado dos botões
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      // Filtra com animação
      portfolioItems.forEach(item => {
        const match = filter === 'todos' || item.dataset.category === filter;

        if (match) {
          item.classList.remove('hidden');
          requestAnimationFrame(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(12px)';
            requestAnimationFrame(() => {
              item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
              item.style.opacity = '1';
              item.style.transform = 'translateY(0)';
            });
          });
        } else {
          item.style.transition = 'opacity 0.2s ease';
          item.style.opacity = '0';
          setTimeout(() => item.classList.add('hidden'), 200);
        }
      });
    });
  });

});
