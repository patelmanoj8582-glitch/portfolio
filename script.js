/**
 * Manoj DV - Personal Portfolio JavaScript
 * Zero-dependency, modern ES6+ implementation
 * Features:
 *  - Theme Toggle (Dark/Light Mode with localStorage & OS preference detection)
 *  - Mobile Navigation Hamburger Drawer
 *  - Interactive Constellation / Circuit Background Canvas Animation
 *  - Active Section Highlighting & Smooth Navigation
 *  - Scroll Reveal Animations using IntersectionObserver
 *  - Contact Form Live & Submit Validation
 *  - Dynamic Copyright Year
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Theme Management (Dark / Light Mode)
  // --------------------------------------------------------------------------
  const themeToggleBtn = document.getElementById('theme-toggle');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to dark
  const getPreferredTheme = () => {
    const savedTheme = localStorage.getItem('manoj_portfolio_theme');
    if (savedTheme) {
      return savedTheme;
    }
    // Default to dark theme as per technical aesthetic
    return 'dark';
  };

  const applyTheme = (theme) => {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('manoj_portfolio_theme', theme);
    // Notify canvas renderer of theme update
    if (window.updateCanvasTheme) {
      window.updateCanvasTheme(theme);
    }
  };

  // Initialize theme
  applyTheme(getPreferredTheme());

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'dark';
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
    });
  }

  // --------------------------------------------------------------------------
  // 2. Mobile Navigation Hamburger Menu
  // --------------------------------------------------------------------------
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navbar = document.getElementById('navbar');

  const toggleMenu = (open) => {
    const shouldOpen = open !== undefined ? open : !navMenu.classList.contains('open');
    navMenu.classList.toggle('open', shouldOpen);
    hamburger.classList.toggle('active', shouldOpen);
    hamburger.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
    document.body.style.overflow = shouldOpen ? 'hidden' : '';
  };

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => toggleMenu());

    // Close menu when a navigation item is clicked
    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          toggleMenu(false);
        }
      });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (
        navMenu.classList.contains('open') &&
        !navMenu.contains(e.target) &&
        !hamburger.contains(e.target)
      ) {
        toggleMenu(false);
      }
    });

    // Close menu on screen resize exceeding breakpoint
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        toggleMenu(false);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 3. Navbar Scroll Shadow & Active Link Detection
  // --------------------------------------------------------------------------
  const sections = document.querySelectorAll('section[id]');

  const handleScroll = () => {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;

    // Add shadow when navbar is scrolled
    if (navbar) {
      if (scrollY > 30) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    // Determine current active section
    let currentSectionId = '';
    const offsetThreshold = 140;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop - offsetThreshold;
      const sectionHeight = section.offsetHeight;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check

  // --------------------------------------------------------------------------
  // 4. Scroll Reveal Animations (IntersectionObserver)
  // --------------------------------------------------------------------------
  const revealElements = document.querySelectorAll(
    '.about-card, .skill-category-card, .project-card, .timeline-item, .cert-card, .contact-info-card, .contact-form-card, .section-header'
  );

  revealElements.forEach((el) => {
    el.classList.add('reveal');
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.12,
      }
    );

    revealElements.forEach((el) => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach((el) => el.classList.add('revealed'));
  }

  // --------------------------------------------------------------------------
  // 5. Interactive Circuit / Constellation Canvas Background
  // --------------------------------------------------------------------------
  const initCanvasAnimation = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let isDark = htmlRoot.getAttribute('data-theme') !== 'light';

    // Visual configuration based on theme
    let nodeColor = isDark ? 'rgba(0, 240, 255, 0.7)' : 'rgba(2, 132, 199, 0.6)';
    let lineColor = isDark ? 'rgba(56, 189, 248, ' : 'rgba(37, 99, 235, ';

    window.updateCanvasTheme = (theme) => {
      isDark = theme !== 'light';
      nodeColor = isDark ? 'rgba(0, 240, 255, 0.7)' : 'rgba(2, 132, 199, 0.6)';
      lineColor = isDark ? 'rgba(56, 189, 248, ' : 'rgba(37, 99, 235, ';
    };

    // Responsive particle count
    const getParticleCount = () => {
      const area = window.innerWidth * window.innerHeight;
      return Math.min(Math.floor(area / 18000), 75);
    };

    let particles = [];
    const maxDistance = 140;

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 1.8 + 1.2;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce from boundaries
        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.shadowColor = nodeColor;
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }
    }

    const initParticles = () => {
      particles = [];
      const count = getParticleCount();
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    };

    initParticles();

    // Mouse interactivity
    const mouse = { x: null, y: null, maxDist: 150 };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    // Resize handling with debounce
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        initParticles();
      }, 150);
    });

    // Animation Loop
    let animationFrameId;

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Connect particles
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        // Connect with neighboring particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (isDark ? 0.22 : 0.15);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `${lineColor}${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }

        // Connect with mouse position
        if (mouse.x !== null && mouse.y !== null) {
          const dx = p1.x - mouse.x;
          const dy = p1.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.maxDist) {
            const alpha = (1 - dist / mouse.maxDist) * (isDark ? 0.35 : 0.25);
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = `${lineColor}${alpha})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
  };

  initCanvasAnimation();

  // --------------------------------------------------------------------------
  // 6. Contact Form Validation & Submission
  // --------------------------------------------------------------------------
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('contact-name');
  const emailInput = document.getElementById('contact-email');
  const subjectInput = document.getElementById('contact-subject');
  const messageInput = document.getElementById('contact-message');

  const nameError = document.getElementById('name-error');
  const emailError = document.getElementById('email-error');
  const subjectError = document.getElementById('subject-error');
  const messageError = document.getElementById('message-error');
  const formStatus = document.getElementById('form-status');
  const submitBtn = document.getElementById('submit-btn');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validateField = (input, errorEl, validator, errorMsg) => {
    const val = input.value.trim();
    if (!validator(val)) {
      input.classList.add('input-error');
      errorEl.textContent = errorMsg;
      return false;
    } else {
      input.classList.remove('input-error');
      errorEl.textContent = '';
      return true;
    }
  };

  // Live validation on blur
  if (nameInput) {
    nameInput.addEventListener('blur', () => {
      validateField(nameInput, nameError, (v) => v.length >= 2, 'Please enter your name (at least 2 characters).');
    });
  }

  if (emailInput) {
    emailInput.addEventListener('blur', () => {
      validateField(emailInput, emailError, (v) => emailRegex.test(v), 'Please enter a valid email address.');
    });
  }

  if (subjectInput) {
    subjectInput.addEventListener('blur', () => {
      validateField(subjectInput, subjectError, (v) => v.length >= 3, 'Subject must be at least 3 characters.');
    });
  }

  if (messageInput) {
    messageInput.addEventListener('blur', () => {
      validateField(messageInput, messageError, (v) => v.length >= 10, 'Message must be at least 10 characters.');
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      // Reset prior status
      if (formStatus) {
        formStatus.className = 'form-status';
        formStatus.textContent = '';
      }

      const isNameValid = validateField(
        nameInput,
        nameError,
        (v) => v.length >= 2,
        'Please enter your name (at least 2 characters).'
      );

      const isEmailValid = validateField(
        emailInput,
        emailError,
        (v) => emailRegex.test(v),
        'Please enter a valid email address.'
      );

      const isSubjectValid = validateField(
        subjectInput,
        subjectError,
        (v) => v.length >= 3,
        'Subject must be at least 3 characters.'
      );

      const isMessageValid = validateField(
        messageInput,
        messageError,
        (v) => v.length >= 10,
        'Message must be at least 10 characters.'
      );

      const isValid = isNameValid && isEmailValid && isSubjectValid && isMessageValid;

      if (!isValid) {
        if (formStatus) {
          formStatus.className = 'form-status status-error';
          formStatus.textContent = 'Please fix the highlighted errors before submitting.';
        }
        return;
      }

      // Simulate sending with user feedback
      if (submitBtn) {
        submitBtn.disabled = true;
        const originalText = submitBtn.querySelector('.btn-text').textContent;
        submitBtn.querySelector('.btn-text').textContent = 'Sending Message...';

        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.querySelector('.btn-text').textContent = originalText;

          if (formStatus) {
            formStatus.className = 'form-status status-success';
            formStatus.textContent = 'Thank you, Manoj DV will get back to you shortly!';
          }

          // Reset inputs
          contactForm.reset();
          [nameInput, emailInput, subjectInput, messageInput].forEach((input) => {
            if (input) input.classList.remove('input-error');
          });
        }, 800);
      }
    });
  }

  // --------------------------------------------------------------------------
  // 7. Update Copyright Year Automatically
  // --------------------------------------------------------------------------
  const currentYearSpan = document.getElementById('current-year');
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }
});