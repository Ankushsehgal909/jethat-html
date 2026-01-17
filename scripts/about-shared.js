/**
 * About Pages - Shared Animations & Interactions
 * Used by: culture.html, team.html, projects-showcase.html, success-stories.html
 * 
 * This file contains all common JavaScript functions for about section pages
 * to avoid code duplication and improve maintainability.
 */

(function() {
    'use strict';

    // ========================================
    // GSAP SCROLL ANIMATIONS
    // ========================================

    function initGSAPAnimations() {
        if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
            return;
        }

        // Register ScrollTrigger plugin
        gsap.registerPlugin(ScrollTrigger);

        // Reveal Up animations
        gsap.utils.toArray('.reveal-up').forEach(element => {
            gsap.fromTo(element, 
                { opacity: 0, y: 50 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.8, 
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Reveal Left animations
        gsap.utils.toArray('.reveal-left').forEach(element => {
            gsap.fromTo(element, 
                { opacity: 0, x: -50 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.8, 
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Reveal Right animations
        gsap.utils.toArray('.reveal-right').forEach(element => {
            gsap.fromTo(element, 
                { opacity: 0, x: 50 },
                { 
                    opacity: 1, 
                    x: 0, 
                    duration: 0.8, 
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 80%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });

        // Stagger animations
        gsap.utils.toArray('.stagger-1, .stagger-2, .stagger-3, .stagger-4, .stagger-5, .stagger-6').forEach((element, index) => {
            gsap.fromTo(element, 
                { opacity: 0, y: 30 },
                { 
                    opacity: 1, 
                    y: 0, 
                    duration: 0.6, 
                    delay: index * 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: element,
                        start: "top 85%",
                        toggleActions: "play none none reverse"
                    }
                }
            );
        });
    }

    // ========================================
    // INTERSECTION OBSERVER ANIMATIONS
    // ========================================

    function initRevealAnimations() {
        const animationElements = document.querySelectorAll([
            '.slide-in-left', '.slide-in-right', '.slide-in-up', '.slide-in-down',
            '.zoom-in', '.zoom-out', '.rotate-in', '.fade-in', '.bounce-in',
            '.reveal-up', '.reveal-left', '.reveal-right', '.reveal-zoom'
        ].join(', '));
        
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        animationElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ========================================
    // COUNTER ANIMATIONS
    // ========================================

    function animateCounter(element, target) {
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            const suffix = element.textContent.includes('%') ? '%' : 
                          element.textContent.includes('+') ? '+' : 
                          element.textContent.includes('/7') ? '/7' : 
                          element.textContent.includes('.9%') ? '.9%' : '';
            element.textContent = Math.floor(current) + suffix;
        }, 16);
    }

    function initCounterAnimations() {
        const counters = document.querySelectorAll('[data-count]');
        
        if (typeof ScrollTrigger !== 'undefined') {
            // Use GSAP ScrollTrigger if available
            counters.forEach(counter => {
                ScrollTrigger.create({
                    trigger: counter,
                    start: "top 80%",
                    onEnter: () => {
                        const target = parseInt(counter.getAttribute('data-count'));
                        animateCounter(counter, target);
                    }
                });
            });
        } else {
            // Fallback to Intersection Observer
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                        entry.target.classList.add('counted');
                        const target = parseInt(entry.target.getAttribute('data-count'));
                        animateCounter(entry.target, target);
                    }
                });
            }, { threshold: 0.5 });

            counters.forEach(counter => observer.observe(counter));
        }
    }

    // ========================================
    // 3D TILT EFFECT
    // ========================================

    function initTiltEffects() {
        const tiltCards = document.querySelectorAll('.tilt-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            });
        });
    }

    // ========================================
    // PARALLAX EFFECTS
    // ========================================

    function initParallaxEffects() {
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            
            // Parallax for slow elements
            document.querySelectorAll('.parallax-slow').forEach(element => {
                const speed = 0.5;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });

            // Parallax for fast elements
            document.querySelectorAll('.parallax-fast').forEach(element => {
                const speed = 0.8;
                element.style.transform = `translateY(${scrolled * speed}px)`;
            });

            // Parallax for security icons
            document.querySelectorAll('.security-icon').forEach((icon, index) => {
                const speed = 0.3 + (index * 0.1);
                icon.style.transform = `translateY(${-scrolled * speed}px)`;
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // ========================================
    // BUTTON EFFECTS
    // ========================================

    function initButtonEffects() {
        document.querySelectorAll('.btn-gradient').forEach(button => {
            const handleMove = (e) => {
                const rect = button.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px) scale(1.05)`;
            };

            const handleLeave = () => {
                button.style.transform = 'translate(0px, 0px) scale(1)';
            };

            button.addEventListener('mousemove', handleMove);
            button.addEventListener('mouseleave', handleLeave);
        });
    }

    // ========================================
    // SCANNING LINE EFFECTS
    // ========================================

    function initScanningLines() {
        const scanningLines = document.querySelectorAll('.scanning-line');
        
        scanningLines.forEach(line => {
            line.style.animationPlayState = 'paused';
            
            const container = line.closest('.contact-image-container, .cyber-info-card, .contact-card');
            if (container) {
                container.addEventListener('mouseenter', () => {
                    line.style.animationPlayState = 'running';
                });
                
                container.addEventListener('mouseleave', () => {
                    line.style.animationPlayState = 'paused';
                    line.style.top = '0';
                });
            }
        });
    }

    // ========================================
    // SMOOTH SCROLL
    // ========================================

    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ========================================
    // MAIN INITIALIZATION
    // ========================================

    function init() {
        // Initialize all animation functions
        initGSAPAnimations();
        initRevealAnimations();
        initCounterAnimations();
        initTiltEffects();
        initParallaxEffects();
        initButtonEffects();
        initScanningLines();
        initSmoothScroll();
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose init function globally for manual triggering if needed
    window.initAboutAnimations = init;

})();
