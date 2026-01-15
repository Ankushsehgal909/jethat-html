// Testimonial Section Carousel Controller
function initializeTestimonialCarousel() {
    const testimonialSection = document.getElementById('testimonials');
    
    // ================= CAROUSEL FUNCTIONALITY ================= 
    const carouselTrack = document.getElementById('testimonials-carousel-track');
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    const indicators = document.querySelectorAll('.testimonial-indicator');
    const slides = document.querySelectorAll('.testimonial-slide');
    
    // Check if elements exist
    if (!carouselTrack || !prevBtn || !nextBtn || slides.length === 0) {
        console.log('Testimonial carousel elements not found, retrying...');
        setTimeout(initializeTestimonialCarousel, 100);
        return;
    }
    
    let currentSlide = 0;
    let slidesPerView = getSlidesPerView();
    let maxSlide = Math.max(0, slides.length - slidesPerView);
    let isAnimating = false;
    let autoPlayInterval;
    
    function getSlidesPerView() {
        // Always show 1 slide at a time in the new layout
        return 1;
    }
    
    function updateCarousel() {
        if (isAnimating) return;
        isAnimating = true;
        
        const slideWidth = slides[0].offsetWidth;
        const translateX = -currentSlide * slideWidth;
        
        carouselTrack.style.transform = `translateX(${translateX}px)`;
        
        // Update indicators
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === Math.floor(currentSlide / slidesPerView));
        });
        
        // Update button states
        prevBtn.style.opacity = currentSlide === 0 ? '0.5' : '1';
        nextBtn.style.opacity = currentSlide >= maxSlide ? '0.5' : '1';
        
        // Add loading state to visible cards
        slides.forEach((slide, index) => {
            const card = slide.querySelector('.testimonial-card');
            if (index >= currentSlide && index < currentSlide + slidesPerView) {
                card.classList.remove('loading');
            } else {
                card.classList.add('loading');
            }
        });
        
        setTimeout(() => {
            isAnimating = false;
        }, 600);
    }
    
    function nextSlide() {
        if (currentSlide < maxSlide) {
            currentSlide++;
            updateCarousel();
        } else {
            // Loop back to start
            currentSlide = 0;
            updateCarousel();
        }
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateCarousel();
        } else {
            // Loop to end
            currentSlide = maxSlide;
            updateCarousel();
        }
    }
    
    function goToSlide(slideIndex) {
        const targetSlide = slideIndex * slidesPerView;
        if (targetSlide <= maxSlide) {
            currentSlide = targetSlide;
            updateCarousel();
        }
    }
    
    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToSlide(index));
    });
    
    // Auto-play carousel
    function startAutoPlay() {
        autoPlayInterval = setInterval(() => {
            nextSlide();
        }, 5000); // 5 seconds for testimonials
    }
    
    function stopAutoPlay() {
        if (autoPlayInterval) {
            clearInterval(autoPlayInterval);
        }
    }
    
    // Pause auto-play on hover
    const carouselContainer = document.querySelector('.testimonial-carousel-container');
    if (carouselContainer) {
        carouselContainer.addEventListener('mouseenter', stopAutoPlay);
        carouselContainer.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Handle window resize
    function handleResize() {
        slidesPerView = getSlidesPerView();
        maxSlide = Math.max(0, slides.length - slidesPerView);
        currentSlide = Math.min(currentSlide, maxSlide);
        updateCarousel();
    }
    
    window.addEventListener('resize', handleResize);
    
    // Touch/swipe support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    carouselTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoPlay();
    });
    
    carouselTrack.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        e.preventDefault(); // Prevent scrolling
    });
    
    carouselTrack.addEventListener('touchend', () => {
        if (!isDragging) return;
        isDragging = false;
        
        const diffX = startX - currentX;
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoPlay();
    });
    
    // Mouse drag support
    carouselTrack.addEventListener('mousedown', (e) => {
        startX = e.clientX;
        isDragging = true;
        carouselTrack.style.cursor = 'grabbing';
        stopAutoPlay();
        e.preventDefault();
    });
    
    carouselTrack.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        currentX = e.clientX;
    });
    
    carouselTrack.addEventListener('mouseup', () => {
        if (!isDragging) return;
        isDragging = false;
        carouselTrack.style.cursor = 'grab';
        
        const diffX = startX - currentX;
        if (Math.abs(diffX) > 50) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
        startAutoPlay();
    });
    
    carouselTrack.addEventListener('mouseleave', () => {
        isDragging = false;
        carouselTrack.style.cursor = 'grab';
        if (!carouselContainer.matches(':hover')) {
            startAutoPlay();
        }
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (testimonialSection.getBoundingClientRect().top < window.innerHeight && 
            testimonialSection.getBoundingClientRect().bottom > 0) {
            if (e.key === 'ArrowLeft') {
                prevSlide();
            } else if (e.key === 'ArrowRight') {
                nextSlide();
            }
        }
    });
    
    // Initialize carousel
    updateCarousel();
    startAutoPlay();
    
    console.log('Testimonial carousel initialized successfully');
}

// ================= SCROLL ANIMATIONS ================= 
function initializeTestimonialAnimations() {
    const testimonialSection = document.getElementById('testimonials');
    
    if (!testimonialSection) {
        setTimeout(initializeTestimonialAnimations, 100);
        return;
    }
    
    // Intersection Observer for scroll-triggered animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    observer.observe(testimonialSection);
    
    // Enhanced card hover effects with stagger
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        card.addEventListener('mouseenter', function() {
            // Add stagger effect to other cards
            testimonialCards.forEach((otherCard, otherIndex) => {
                if (otherIndex !== index) {
                    otherCard.style.transform = 'scale(0.98)';
                    otherCard.style.opacity = '0.8';
                }
            });
        });
        
        card.addEventListener('mouseleave', function() {
            // Reset all cards
            testimonialCards.forEach(otherCard => {
                otherCard.style.transform = '';
                otherCard.style.opacity = '';
            });
        });
    });
    
    // Animate trust badges on scroll
    const trustBadges = document.querySelectorAll('.trust-badge');
    const badgeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.5 });
    
    trustBadges.forEach(badge => {
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(20px)';
        badge.style.transition = 'all 0.5s ease';
        badgeObserver.observe(badge);
    });
    
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('#testimonial-prev, #testimonial-next');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                left: ${x}px;
                top: ${y}px;
                background: rgba(255,140,0,0.3);
                border-radius: 50%;
                transform: scale(0);
                animation: testimonialRipple 0.6s linear;
                pointer-events: none;
            `;
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add CSS for ripple animation
    if (!document.getElementById('testimonial-ripple-styles')) {
        const style = document.createElement('style');
        style.id = 'testimonial-ripple-styles';
        style.textContent = `
            @keyframes testimonialRipple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Counter animation
    const counters = document.querySelectorAll('.counter');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                const increment = target / (duration / 16); // 60fps
                let current = 0;
                
                const updateCounter = () => {
                    if (current < target) {
                        current += increment;
                        counter.textContent = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    console.log('Testimonial animations initialized successfully');
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
            initializeTestimonialCarousel();
            initializeTestimonialAnimations();
        }, 600);
    });
} else {
    setTimeout(() => {
        initializeTestimonialCarousel();
        initializeTestimonialAnimations();
    }, 600);
}

// Export functions for manual initialization
window.initializeTestimonialCarousel = initializeTestimonialCarousel;
window.initializeTestimonialAnimations = initializeTestimonialAnimations;