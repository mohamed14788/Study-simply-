// ==========================================
// ذاكر ببساطة - script-improved.js v2
// متوافق مع index-improved.html + style-improved.css
// ==========================================

(() => {
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  // 1. القائمة الجانبية - Accessible + Performance
  const menuBtn = $('#menuBtn');
  const closeBtn = $('#closeBtn');
  const sidebar = $('#sidebar');
  const overlay = $('#overlay');
  let lastFocus = null;

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function openMenu() {
    lastFocus = document.activeElement;
    sidebar.removeAttribute('inert');
    overlay.hidden = false;
    // force reflow for transition
    void sidebar.offsetWidth;
    sidebar.classList.add('active');
    overlay.classList.add('active');
    menuBtn?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
    // focus first link
    setTimeout(() => $('.sidebar a')?.focus(), 50);
  }

  function closeMenu() {
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
    menuBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    overlay.addEventListener('transitionend', () => {
      if (!sidebar.classList.contains('active')) {
        overlay.hidden = true;
        sidebar.setAttribute('inert', '');
      }
    }, { once: true });
    // fallback if no transition
    setTimeout(() => {
      if (!sidebar.classList.contains('active')) {
        overlay.hidden = true;
        sidebar.setAttribute('inert', '');
      }
    }, 350);
    if (lastFocus) lastFocus.focus();
  }

  function toggleMenu() {
    if (sidebar.classList.contains('active')) closeMenu();
    else openMenu();
  }

  menuBtn?.addEventListener('click', toggleMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  // إغلاق بالـ ESC وبالروابط
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) closeMenu();
  });

  $$('.sidebar a').forEach(a => a.addEventListener('click', closeMenu));

  // 2. FAQ - يدعم النظامين: details و .active القديم
  // لو details موجود، المتصفح بيhandle لوحده، احنا بس هنخلي واحد مفتوح
  const detailsFaqs = $$('.faq-container details');
  if (detailsFaqs.length) {
    detailsFaqs.forEach(d => {
      d.addEventListener('toggle', () => {
        if (d.open) {
          detailsFaqs.forEach(other => {
            if (other !== d) other.open = false;
          });
        }
      });
    });
  } else {
    // fallback للنسخة القديمة
    const faqItems = $$('.faq-item');
    faqItems.forEach(item => {
      const q = $('.faq-question', item);
      q?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        faqItems.forEach(i => i.classList.remove('active'));
        if (!isActive) item.classList.add('active');
      });
    });
  }

  // 3. ظهور الأقسام - IntersectionObserver بدل scroll event
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const revealEls = $$('main section');
    revealEls.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      el.style.willChange = 'opacity, transform';
    });

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -10% 0px' });

    revealEls.forEach(el => io.observe(el));
  }

  // 4. Parallax للكارت الرئيسي - خفيف + RAF + تعطيل على الموبايل
  const showcaseCard = $('.material-preview-card');
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  
  if (showcaseCard && !isTouch && !prefersReduced) {
    let rafId = null;
    let mouseX = 0, mouseY = 0;

    function applyParallax() {
      rafId = null;
      const rotY = mouseX * 0.015;
      const rotX = -mouseY * 0.015;
      showcaseCard.style.transform = `perspective(900px) rotateY(${rotY}deg) rotateX(${rotX}deg) translateY(-3px)`;
    }

    showcaseCard.addEventListener('mousemove', (e) => {
      const rect = showcaseCard.getBoundingClientRect();
      mouseX = e.clientX - rect.left - rect.width / 2;
      mouseY = e.clientY - rect.top - rect.height / 2;
      if (!rafId) rafId = requestAnimationFrame(applyParallax);
    });

    showcaseCard.addEventListener('mouseleave', () => {
      if (rafId) cancelAnimationFrame(rafId);
      showcaseCard.style.transition = 'transform 0.5s cubic-bezier(0.2,0.8,0.2,1)';
      showcaseCard.style.transform = 'perspective(900px) rotateY(0) rotateX(0) translateY(0)';
    });

    showcaseCard.addEventListener('mouseenter', () => {
      showcaseCard.style.transition = 'none';
    });
  }

  // 5. زر العودة للأعلى - يظهر بعد 400px
  const scrollBtn = $('#scrollTopBtn');
  if (scrollBtn) {
    const toggleScrollBtn = () => {
      if (window.scrollY > 400) scrollBtn.hidden = false;
      else scrollBtn.hidden = true;
    };
    toggleScrollBtn();
    window.addEventListener('scroll', toggleScrollBtn, { passive: true });
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' });
    });
  }

  // 6. تحسين بسيط: Lazy loading fallback لو متصفح قديم
  // و prefetch للمواد عند hover على الديسكتوب
  if (!isTouch) {
    $$('.material-card').forEach(card => {
      card.addEventListener('mouseenter', () => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = card.getAttribute('href');
        document.head.appendChild(link);
      }, { once: true });
    });
  }

})();
