// Standalone Typing Animation Script
// This script can be called after the hero section is loaded

(function() {
    'use strict';
    
    function initializeTypingAnimation() {
        const typingText = document.getElementById('typing-text');
        if (!typingText) {
            // Retry after a short delay if element not found yet
            setTimeout(initializeTypingAnimation, 100);
            return;
        }
        
        const texts = [
            'We Protect Every Moment',
            'अनुक्षणं रक्षामहे',
            'Securing Digital Future',
            'Innovation Meets Security'
        ];
        let currentIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        const typeText = () => {
            const currentText = texts[currentIndex];
            
            if (isDeleting) {
                typingText.textContent = currentText.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50;
            } else {
                typingText.textContent = currentText.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100;
            }

            if (!isDeleting && charIndex === currentText.length) {
                // Text complete, pause before deleting
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                // Deletion complete, move to next text
                isDeleting = false;
                currentIndex = (currentIndex + 1) % texts.length;
                typeSpeed = 500;
            }

            setTimeout(typeText, typeSpeed);
        };

        // Start the typing animation
        typeText();
    }
    
    // Make function globally available
    window.initializeTypingAnimation = initializeTypingAnimation;
    
    // Auto-initialize after DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            // Wait a bit for components to load
            setTimeout(initializeTypingAnimation, 500);
        });
    } else {
        // DOM already loaded, wait for components
        setTimeout(initializeTypingAnimation, 500);
    }
})();

