/* ============================================
   ANGIE PORTFOLIO - Interactive JavaScript
   Premium Animations & Smooth Interactions
   ============================================ */

// ============================================
// DOM Content Loaded
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    initializeScrollReveal();
    initializeNavbar();
    initializeMobileMenu();
    initializeSmoothScroll();
    initializeParallax();
    initializeCountUp();
    initializeImageLazyLoad();
});

// ============================================
// Scroll Reveal Animations
// ============================================
function initializeScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale, .stagger-children');

    const revealOnScroll = () => {
        const windowHeight = window.innerHeight;
        const triggerPoint = windowHeight * 0.85;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < triggerPoint) {
                element.classList.add('active');
            }
        });
    };

    // Initial check
    revealOnScroll();

    // Throttled scroll listener for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                revealOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================
// Navbar Scroll Effect
// ============================================
function initializeNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScrollY = window.scrollY;

    const updateNavbar = () => {
        const currentScrollY = window.scrollY;

        // Add/remove scrolled class for styling changes
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Optional: Hide/show navbar on scroll direction
        // Uncomment if you want this behavior
        /*
        if (currentScrollY > lastScrollY && currentScrollY > 200) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        */

        lastScrollY = currentScrollY;
    };

    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateNavbar();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================
// Mobile Menu Toggle
// ============================================
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = navMenu.querySelectorAll('a');
    const body = document.body;

    // Toggle menu
    const toggleMenu = () => {
        menuToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
        body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Keyboard accessibility
    menuToggle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleMenu();
        }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // Close menu on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navMenu.classList.contains('open')) {
            toggleMenu();
        }
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('open') &&
            !navMenu.contains(e.target) &&
            !menuToggle.contains(e.target)) {
            toggleMenu();
        }
    });
}

// ============================================
// Smooth Scroll for Anchor Links
// ============================================
function initializeSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Update URL without jumping
                history.pushState(null, null, targetId);
            }
        });
    });
}

// ============================================
// Parallax Effects (Subtle)
// ============================================
function initializeParallax() {
    const hero = document.querySelector('.hero');

    if (!hero) return;

    // Disable parallax on mobile for performance
    if (window.innerWidth < 768) return;

    let ticking = false;

    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                const heroHeight = hero.offsetHeight;

                if (scrollY < heroHeight) {
                    const opacity = 1 - (scrollY / heroHeight) * 0.5;
                    const translateY = scrollY * 0.3;

                    const heroContent = hero.querySelector('.hero-content');
                    if (heroContent) {
                        heroContent.style.opacity = Math.max(0, opacity);
                        heroContent.style.transform = `translateY(${translateY}px)`;
                    }
                }

                ticking = false;
            });
            ticking = true;
        }
    });
}

// ============================================
// Count Up Animation for Stats
// ============================================
function initializeCountUp() {
    const statNumbers = document.querySelectorAll('.impact-number');
    let hasAnimated = false;

    const animateValue = (element, start, end, duration, suffix = '') => {
        const startTime = performance.now();

        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out)
            const easeOut = 1 - Math.pow(1 - progress, 3);

            const current = Math.floor(start + (end - start) * easeOut);
            element.textContent = current + suffix;

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = end + suffix;
            }
        };

        requestAnimationFrame(updateNumber);
    };

    const checkAndAnimate = () => {
        if (hasAnimated) return;

        const impactSection = document.getElementById('impact');
        if (!impactSection) return;

        const rect = impactSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        if (rect.top < windowHeight * 0.8) {
            hasAnimated = true;

            statNumbers.forEach(stat => {
                const text = stat.textContent;

                // Parse numbers with K+ suffix
                if (text.includes('K+')) {
                    const num = parseInt(text.replace('K+', ''));
                    stat.textContent = '0K+';
                    animateValue(stat, 0, num, 2000, 'K+');
                }
                // Parse percentages
                else if (text.includes('%')) {
                    const num = parseInt(text.replace('%', ''));
                    stat.textContent = '0%';
                    animateValue(stat, 0, num, 2000, '%');
                }
                // Text values (like "Global") - just fade in
                else if (isNaN(parseInt(text))) {
                    stat.style.opacity = '0';
                    stat.style.transition = 'opacity 1s ease';
                    setTimeout(() => {
                        stat.style.opacity = '1';
                    }, 500);
                }
            });
        }
    };

    window.addEventListener('scroll', checkAndAnimate);
    checkAndAnimate(); // Initial check
}

// ============================================
// Lazy Load Images
// ============================================
function initializeImageLazyLoad() {
    // Modern browsers support native lazy loading
    // This adds a fallback for older browsers

    if ('loading' in HTMLImageElement.prototype) {
        // Native lazy loading supported
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.src; // Force load
        });
    } else {
        // Fallback for older browsers
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        const lazyLoad = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        };

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(lazyLoad, {
                rootMargin: '50px 0px',
                threshold: 0.01
            });

            lazyImages.forEach(img => observer.observe(img));
        } else {
            // Fallback: load all images immediately
            lazyImages.forEach(img => {
                img.src = img.dataset.src || img.src;
            });
        }
    }
}

// ============================================
// Cursor Effect (Optional - Desktop Only)
// ============================================
function initializeCursorEffect() {
    if (window.innerWidth < 1024) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div><div class="cursor-ring"></div>';
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const updateCursor = () => {
        const dx = mouseX - cursorX;
        const dy = mouseY - cursorY;

        cursorX += dx * 0.15;
        cursorY += dy * 0.15;

        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;

        requestAnimationFrame(updateCursor);
    };

    updateCursor();

    // Hover effects on interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .card, .gallery-item');

    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor-hover');
        });

        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor-hover');
        });
    });
}

// ============================================
// Image Placeholder Handler
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.gallery-grid img, .gallery-item img');

    images.forEach(img => {
        // Add loading class
        img.classList.add('loading');

        // Handle successful load
        img.addEventListener('load', () => {
            img.classList.remove('loading');
            img.classList.add('loaded');
        });

        // Handle error - show placeholder
        img.addEventListener('error', () => {
            img.classList.remove('loading');
            img.classList.add('error');

            // Create gradient placeholder
            img.style.background = 'linear-gradient(135deg, #F8F5F0 0%, #EDE8E0 50%, #D4AF37 100%)';
            img.alt = 'Image coming soon';
        });
    });
});

// ============================================
// Button Ripple Effect
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.primary-btn, .secondary-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            const ripple = document.createElement('span');

            ripple.className = 'ripple';
            ripple.style.left = `${e.clientX - rect.left}px`;
            ripple.style.top = `${e.clientY - rect.top}px`;

            this.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);
        });
    });
});

// ============================================
// Performance: Debounce Helper
// ============================================
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            timeout = null;
            if (!immediate) func.apply(this, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(this, args);
    };
}

// ============================================
// Performance: Throttle Helper
// ============================================
function throttle(func, limit = 16) {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ============================================
// Active Nav Link Highlighting
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    const highlightNavLink = () => {
        const scrollY = window.scrollY;
        const navbar = document.getElementById('navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 0;

        sections.forEach(section => {
            const sectionTop = section.offsetTop - navbarHeight - 100;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', throttle(highlightNavLink, 100));
    highlightNavLink(); // Initial check
});

// ============================================
// Typing Effect for Hero (Optional)
// ============================================
function initializeTypingEffect() {
    const tagline = document.querySelector('.tagline');
    if (!tagline) return;

    const text = tagline.textContent;
    tagline.textContent = '';
    tagline.style.visibility = 'visible';

    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 80);
        }
    };

    // Start typing after hero animation completes
    setTimeout(typeWriter, 1000);
}

// Uncomment to enable typing effect:
// document.addEventListener('DOMContentLoaded', initializeTypingEffect);

console.log('✨ Angie Portfolio - Global Media Babe ✨');
console.log('Design & Development: Premium Experience Loaded');
