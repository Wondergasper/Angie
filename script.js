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
    initializeMediaGallery();
    initializeLightbox();
    initializeMobileCarousel();
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

// ============================================
// Media Gallery - Filters & Video Hover
// ============================================
function initializeMediaGallery() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const mediaItems = document.querySelectorAll('.media-item');
    const videos = document.querySelectorAll('.media-item[data-type="video"] video');

    // Filter functionality
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;

            // Animate and filter items
            mediaItems.forEach((item, index) => {
                const type = item.dataset.type;
                const shouldShow = filter === 'all' || type === filter;

                if (shouldShow) {
                    item.classList.remove('hidden', 'filtering-out');
                    item.style.transitionDelay = `${index * 50}ms`;
                } else {
                    item.classList.add('filtering-out');
                    setTimeout(() => {
                        item.classList.add('hidden');
                        item.classList.remove('filtering-out');
                    }, 300);
                }
            });
        });
    });

    // Video hover preview effect
    videos.forEach(video => {
        const mediaItem = video.closest('.media-item');

        mediaItem.addEventListener('mouseenter', () => {
            video.play().catch(() => {
                // Autoplay might be blocked, that's okay
            });
        });

        mediaItem.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });

    // Touch support for mobile video preview
    videos.forEach(video => {
        const mediaItem = video.closest('.media-item');
        let touchTimeout;

        mediaItem.addEventListener('touchstart', () => {
            touchTimeout = setTimeout(() => {
                video.play().catch(() => { });
            }, 200);
        }, { passive: true });

        mediaItem.addEventListener('touchend', () => {
            clearTimeout(touchTimeout);
            video.pause();
            video.currentTime = 0;
        }, { passive: true });
    });
}

// ============================================
// Lightbox Modal
// ============================================
function initializeLightbox() {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox) return;

    const backdrop = lightbox.querySelector('.lightbox-backdrop');
    const closeBtn = lightbox.querySelector('.lightbox-close');
    const prevBtn = lightbox.querySelector('.lightbox-prev');
    const nextBtn = lightbox.querySelector('.lightbox-next');
    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxVideo = lightbox.querySelector('.lightbox-video');
    const lightboxTitle = lightbox.querySelector('.lightbox-title');
    const lightboxCounter = lightbox.querySelector('.lightbox-counter');

    const mediaItems = document.querySelectorAll('.media-item');
    let currentIndex = 0;
    let mediaList = [];

    // Build media list
    const buildMediaList = () => {
        mediaList = [];
        document.querySelectorAll('.media-item:not(.hidden)').forEach((item, index) => {
            mediaList.push({
                type: item.dataset.type,
                src: item.dataset.src,
                caption: item.dataset.caption,
                element: item
            });
        });
    };

    // Open lightbox
    const openLightbox = (index) => {
        buildMediaList();
        currentIndex = index;
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    // Close lightbox
    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';

        // Pause video if playing
        lightboxVideo.pause();
        lightboxVideo.src = '';
    };

    // Update lightbox content
    const updateLightboxContent = () => {
        const media = mediaList[currentIndex];
        if (!media) return;

        // Reset visibility
        lightboxImage.classList.remove('active');
        lightboxVideo.classList.remove('active');

        if (media.type === 'video') {
            lightboxVideo.src = media.src;
            lightboxVideo.classList.add('active');
            lightboxImage.classList.remove('active');
        } else {
            lightboxImage.src = media.src;
            lightboxImage.alt = media.caption || '';
            lightboxImage.classList.add('active');
            lightboxVideo.classList.remove('active');
            lightboxVideo.pause();
        }

        lightboxTitle.textContent = media.caption || '';
        lightboxCounter.textContent = `${currentIndex + 1} / ${mediaList.length}`;
    };

    // Navigate
    const goToPrev = () => {
        lightboxVideo.pause();
        currentIndex = currentIndex > 0 ? currentIndex - 1 : mediaList.length - 1;
        updateLightboxContent();
    };

    const goToNext = () => {
        lightboxVideo.pause();
        currentIndex = currentIndex < mediaList.length - 1 ? currentIndex + 1 : 0;
        updateLightboxContent();
    };

    // Event listeners for opening lightbox
    mediaItems.forEach((item, index) => {
        // Click on expand button
        const expandBtn = item.querySelector('.media-expand');
        if (expandBtn) {
            expandBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(index);
            });
        }

        // Click on play button for videos
        const playButton = item.querySelector('.play-button');
        if (playButton) {
            playButton.addEventListener('click', (e) => {
                e.stopPropagation();
                openLightbox(index);
            });
        }

        // Double-click on item
        item.addEventListener('dblclick', () => {
            openLightbox(index);
        });
    });

    // Close events
    closeBtn.addEventListener('click', closeLightbox);
    backdrop.addEventListener('click', closeLightbox);

    // Navigation events
    prevBtn.addEventListener('click', goToPrev);
    nextBtn.addEventListener('click', goToNext);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;

        switch (e.key) {
            case 'Escape':
                closeLightbox();
                break;
            case 'ArrowLeft':
                goToPrev();
                break;
            case 'ArrowRight':
                goToNext();
                break;
        }
    });

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });

    const handleSwipe = () => {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                goToNext();
            } else {
                goToPrev();
            }
        }
    };
}

// ============================================
// Mobile Carousel for Gallery
// ============================================
function initializeMobileCarousel() {
    const gallery = document.querySelector('.media-gallery');
    const dotsContainer = document.getElementById('carousel-dots');
    const counterElement = document.getElementById('carousel-counter');

    if (!gallery || !dotsContainer || !counterElement) return;

    let mediaItems = [];
    let currentIndex = 0;
    let isMobile = window.innerWidth <= 768;

    // Build dots and setup
    const setupCarousel = () => {
        mediaItems = Array.from(gallery.querySelectorAll('.media-item:not(.hidden)'));
        const totalItems = mediaItems.length;

        // Clear existing dots
        dotsContainer.innerHTML = '';

        if (!isMobile || totalItems === 0) return;

        // Create dots (max 10 dots for usability, show subset)
        const maxDots = Math.min(totalItems, 10);
        for (let i = 0; i < maxDots; i++) {
            const dot = document.createElement('button');
            dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
            dot.addEventListener('click', () => scrollToItem(i));
            dotsContainer.appendChild(dot);
        }

        // Update counter
        updateCounter(0);
    };

    // Scroll to specific item
    const scrollToItem = (index) => {
        if (index < 0 || index >= mediaItems.length) return;

        const item = mediaItems[index];
        if (!item) return;

        const galleryRect = gallery.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        const scrollLeft = gallery.scrollLeft + (itemRect.left - galleryRect.left) - (galleryRect.width - itemRect.width) / 2;

        gallery.scrollTo({
            left: scrollLeft,
            behavior: 'smooth'
        });
    };

    // Update active dot and counter
    const updateIndicators = () => {
        if (!isMobile) return;

        const galleryRect = gallery.getBoundingClientRect();
        const galleryCenter = galleryRect.left + galleryRect.width / 2;

        let closestIndex = 0;
        let closestDistance = Infinity;

        mediaItems.forEach((item, index) => {
            const rect = item.getBoundingClientRect();
            const itemCenter = rect.left + rect.width / 2;
            const distance = Math.abs(galleryCenter - itemCenter);

            if (distance < closestDistance) {
                closestDistance = distance;
                closestIndex = index;
            }
        });

        if (closestIndex !== currentIndex) {
            currentIndex = closestIndex;
            updateDots(currentIndex);
            updateCounter(currentIndex);
        }
    };

    // Update dots
    const updateDots = (activeIndex) => {
        const dots = dotsContainer.querySelectorAll('.carousel-dot');
        const maxDots = dots.length;

        if (maxDots === 0) return;

        // Map activeIndex to dot index if we have less dots than items
        const dotIndex = Math.min(activeIndex, maxDots - 1);

        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === dotIndex);
        });
    };

    // Update counter
    const updateCounter = (index) => {
        counterElement.textContent = `${index + 1} / ${mediaItems.length}`;
    };

    // Handle scroll
    let scrollTimeout;
    gallery.addEventListener('scroll', () => {
        if (!isMobile) return;

        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateIndicators, 50);
    }, { passive: true });

    // Handle resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const wasMobile = isMobile;
            isMobile = window.innerWidth <= 768;

            if (isMobile !== wasMobile) {
                setupCarousel();
            }
        }, 150);
    });

    // Handle filter changes - rebuild carousel
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Wait for filter animation
            setTimeout(() => {
                setupCarousel();
                // Scroll to first item
                if (isMobile && mediaItems.length > 0) {
                    gallery.scrollTo({ left: 0, behavior: 'smooth' });
                    currentIndex = 0;
                    updateDots(0);
                    updateCounter(0);
                }
            }, 350);
        });
    });

    // Initial setup
    setupCarousel();

    // Tap to open lightbox on mobile
    if (isMobile) {
        mediaItems.forEach((item, index) => {
            item.addEventListener('click', (e) => {
                // Prevent if scrolling
                if (Math.abs(gallery.scrollLeft - item.offsetLeft + gallery.offsetWidth / 2 - item.offsetWidth / 2) > 50) {
                    return;
                }

                // Open lightbox
                const lightbox = document.getElementById('lightbox');
                if (lightbox && lightbox.classList) {
                    // Trigger lightbox
                    const expandBtn = item.querySelector('.media-expand');
                    if (expandBtn) {
                        expandBtn.click();
                    }
                }
            });
        });
    }
}

console.log('✨ Angie Portfolio - Global Media Babe ✨');
console.log('Design & Development: Premium Experience Loaded');

