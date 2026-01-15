/**
 * Contact Page Advanced Cyber Animations
 * This script handles all advanced animations for the contact page
 * including scroll effects, hover animations, and terminal-style typing effects
 */

(function() {
    'use strict';

    // ========================================
    // Utility Functions
    // ========================================
    
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // ========================================
    // Reveal Animations (Scroll-triggered)
    // ========================================

    function initRevealAnimations() {
        const revealElements = document.querySelectorAll([
            '.reveal-up',
            '.reveal-left',
            '.reveal-right',
            '.reveal-zoom'
        ].join(', '));

        if (revealElements.length === 0) return;

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optional: Stop observing once revealed
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        revealElements.forEach(element => {
            observer.observe(element);
        });
    }

    // ========================================
    // Counter Animation
    // ========================================

    function initCounterAnimation() {
        const counters = document.querySelectorAll('.counter-value[data-count], .stats-counter[data-count]');
        
        if (counters.length === 0) return;

        const observerOptions = {
            threshold: 0.5,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                    entry.target.classList.add('counted');
                    const target = parseInt(entry.target.getAttribute('data-count'));
                    const textContent = entry.target.textContent;
                    const suffix = textContent.includes('+') ? '+' : '';
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            current = target;
                            clearInterval(timer);
                        }
                        entry.target.textContent = Math.floor(current) + suffix;
                    }, 16);
                }
            });
        }, observerOptions);

        counters.forEach(counter => {
            observer.observe(counter);
        });
    }

    // ========================================
    // 3D Tilt Effect
    // ========================================

    function initTiltEffects() {
        const tiltCards = document.querySelectorAll('.tilt-card');
        
        if (tiltCards.length === 0) return;

        tiltCards.forEach(card => {
            const handleMove = (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            };

            const handleLeave = () => {
                card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
            };

            card.addEventListener('mousemove', handleMove);
            card.addEventListener('mouseleave', handleLeave);
        });
    }

    // ========================================
    // Typing Animation (Terminal Effect)
    // ========================================

    function initTypingAnimation() {
        const typedTextElement = document.getElementById('typed-text');
        if (!typedTextElement) return;

        const text = [
            '> Initiating secure connection...',
            '> Encryption keys exchanged',
            '> Ready for secure communication'
        ];

        let lineIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 30;

        function typeWriter() {
            const currentLine = text[lineIndex];

            if (isDeleting) {
                typedTextElement.innerHTML = currentLine.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 15;
            } else {
                // Add cursor and text
                const cursor = '<span class="typing-cursor"></span>';
                if (charIndex === 0) {
                    typedTextElement.innerHTML = '<span class="text-success">➜</span> <span class="text-info">~</span> ' + currentLine.substring(0, charIndex + 1) + cursor;
                } else {
                    typedTextElement.innerHTML = '<span class="text-success">➜</span> <span class="text-info">~</span> ' + currentLine.substring(0, charIndex + 1) + cursor;
                }
                charIndex++;
                typeSpeed = 30;
            }

            if (!isDeleting && charIndex === currentLine.length) {
                // Line complete, pause before deleting
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                // Line deleted, move to next line
                isDeleting = false;
                lineIndex = (lineIndex + 1) % text.length;
                typeSpeed = 500;
            }

            setTimeout(typeWriter, typeSpeed);
        }

        // Start typing when element is visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                typeWriter();
                observer.disconnect();
            }
        }, { threshold: 0.5 });

        const terminalContainer = document.querySelector('.terminal-container');
        if (terminalContainer) {
            observer.observe(terminalContainer);
        }
    }

    // ========================================
    // Parallax Effects
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

        window.addEventListener('scroll', throttle(handleScroll, 10));
    }

    // ========================================
    // Form Animations
    // ========================================

    function initFormAnimations() {
        const formInputs = document.querySelectorAll('.form-control, .form-select');
        
        formInputs.forEach(input => {
            input.addEventListener('focus', () => {
                input.parentElement.style.transform = 'scale(1.02)';
                input.style.boxShadow = '0 0 20px rgba(220, 20, 60, 0.3)';
                input.style.borderColor = '#dc143c';
            });

            input.addEventListener('blur', () => {
                input.parentElement.style.transform = 'scale(1)';
                input.style.boxShadow = '';
                input.style.borderColor = '';
            });
        });
    }

    // ========================================
    // Scanning Line Animation
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
    // Button Magnetic Effect
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
    // Staggered Animations
    // ========================================

    function initStaggeredAnimations() {
        const staggerElements = document.querySelectorAll('[class*="stagger-"]');
        
        staggerElements.forEach(element => {
            const staggerClass = Array.from(element.classList).find(cls => cls.startsWith('stagger-'));
            if (staggerClass) {
                const delay = parseInt(staggerClass.split('-')[1]) * 100;
                element.style.transitionDelay = `${delay}ms`;
            }
        });
    }

    // ========================================
    // Glow Border Animation
    // ========================================

    function initGlowBorders() {
        const glowBorders = document.querySelectorAll('.glow-border');
        
        glowBorders.forEach(border => {
            border.style.position = 'relative';
        });
    }

    // ========================================
    // Floating Shapes Animation
    // ========================================

    function initFloatingShapes() {
        const shapes = document.querySelectorAll('.shape');
        
        shapes.forEach((shape, index) => {
            setInterval(() => {
                const randomX = Math.random() * 20 - 10;
                const randomY = Math.random() * 20 - 10;
                const randomRotate = Math.random() * 360;
                const randomScale = 0.8 + Math.random() * 0.4;
                
                shape.style.transform = `translate(${randomX}px, ${randomY}px) rotate(${randomRotate}deg) scale(${randomScale})`;
            }, 3000 + index * 500);
        });
    }

    // ========================================
    // Page Load Animations
    // ========================================

    function initPageLoadAnimations() {
        const staggerElements = document.querySelectorAll('[class*="stagger-"]');
        
        staggerElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 100);
        });
    }

    // ========================================
    // Form Submission Handler
    // ========================================

    function initFormSubmission() {
        const form = document.getElementById('contactForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Animate form submission
            this.style.transform = 'scale(0.95)';
            this.style.opacity = '0.7';
            
            setTimeout(() => {
                // Show success message with animation
                const successMsg = document.createElement('div');
                successMsg.className = 'alert alert-success text-center mt-3 zoom-in visible';
                successMsg.innerHTML = '<i class="bi bi-check-circle-fill me-2"></i>Thank you! Your secure message has been sent successfully.';
                
                this.appendChild(successMsg);
                
                // Reset form after 3 seconds
                setTimeout(() => {
                    this.reset();
                    this.style.transform = 'scale(1)';
                    this.style.opacity = '1';
                    successMsg.remove();
                }, 3000);
            }, 500);
        });
    }

    // ========================================
    // Smooth Scroll for Anchor Links
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
    // Initialize All Animations
    // ========================================

    function init() {
        // Initialize all animation functions
        initRevealAnimations();
        initCounterAnimation();
        initTiltEffects();
        initTypingAnimation();
        initParallaxEffects();
        initFormAnimations();
        initScanningLines();
        initButtonEffects();
        initStaggeredAnimations();
        initGlowBorders();
        initFloatingShapes();
        initPageLoadAnimations();
        initFormSubmission();
        initSmoothScroll();

        console.log('✅ Contact animations initialized successfully');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

