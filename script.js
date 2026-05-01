/**
 * Cars4Rent – Main JavaScript
 * Handles: Nav toggle, fleet filtering, scroll reveal, sticky header
 */

/* ========================================
   DOM READY
======================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---- Sticky Header Class ---- */
  const header = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  /* ---- Mobile Menu Toggle ---- */
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('active');
    });

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        hamburger.classList.remove('active');
      });
    });
  }

  /* ---- Hamburger Animation ---- */
  const style = document.createElement('style');
  style.textContent = `
    .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
    .hamburger.active span:nth-child(2) { opacity: 0; }
    .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
    .site-header.scrolled .navbar { background: rgba(26,26,26,0.97); backdrop-filter: blur(6px); }
  `;
  document.head.appendChild(style);

  /* ---- Fleet Filter Tabs ---- */
  const tabs     = document.querySelectorAll('.tab');
  const carCards = document.querySelectorAll('.car-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.dataset.filter;

      carCards.forEach(card => {
        if (filter === 'all' || card.dataset.cat === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Add fadeIn keyframe dynamically
  const fadeStyle = document.createElement('style');
  fadeStyle.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(fadeStyle);

  /* ---- Scroll Reveal ---- */
  // Add reveal class to sections
  const revealTargets = document.querySelectorAll(
    '.service-card, .car-card, .step, .blog-item, .plan-card, .why-us-text, .coupon-testimonial, .coupon-deals'
  );

  revealTargets.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger sibling reveals
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => observer.observe(el));

  /* ---- Smooth Active Nav Highlight on Scroll ---- */
  const sections  = document.querySelectorAll('section[id]');
  const navItems  = document.querySelectorAll('.nav-links li a');

  function onScroll() {
    let scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      if (
        scrollPos >= section.offsetTop &&
        scrollPos < section.offsetTop + section.offsetHeight
      ) {
        const id = section.getAttribute('id');
        navItems.forEach(a => {
          a.style.color = '';
          a.style.borderBottomColor = '';
          if (a.getAttribute('href') === `#${id}`) {
            a.style.color = 'var(--orange)';
            a.style.borderBottomColor = 'var(--orange)';
          }
        });
      }
    });
  }

  window.addEventListener('scroll', onScroll);

  /* ---- Stats Counter Animation ---- */
  const statEl = document.querySelector('.cars-stat h2');
  if (statEl) {
    const target = 12640;
    let started  = false;

    const counterObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !started) {
        started = true;
        animateCount(0, target, 1800, statEl);
        counterObserver.disconnect();
      }
    }, { threshold: 0.5 });

    counterObserver.observe(statEl);
  }

  function animateCount(from, to, duration, el) {
    const startTime = performance.now();
    const range     = to - from;

    function step(now) {
      const elapsed  = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased    = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      const current  = Math.round(from + range * eased);
      el.textContent = current.toLocaleString();
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ---- Contact Form Basic Validation ---- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const inputs = contactForm.querySelectorAll('input, textarea');
      let valid = true;

      inputs.forEach(input => {
        input.style.borderColor = '';
        if (!input.value.trim()) {
          input.style.borderColor = '#e74c3c';
          valid = false;
        }
      });

      if (valid) {
        const btn = contactForm.querySelector('button[type="submit"]');
        const original = btn.textContent;
        btn.textContent = 'SENT ✓';
        btn.style.background = '#27ae60';
        setTimeout(() => {
          btn.textContent = original;
          btn.style.background = '';
          contactForm.reset();
        }, 3000);
      }
    });
  }

  /* ---- Date Input Minimum Date (today) ---- */
  const dateInputs = document.querySelectorAll('input[type="date"]');
  const today = new Date().toISOString().split('T')[0];
  dateInputs.forEach(d => d.setAttribute('min', today));

});
