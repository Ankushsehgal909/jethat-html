// About Page Animation Controller
class AboutPageAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.initializeScrollAnimations();
        this.initializeTerminalTyping();
        this.initializeScanAnimation();
        this.initializeRevealAnimations();
    }

    // Initialize scroll-triggered animations
    initializeScrollAnimations() {
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

        // Observe all animation elements
        const animatedElements = document.querySelectorAll(
            '.slide-in-left, .slide-in-right, .slide-in-up, .slide-in-down, ' +
            '.zoom-in, .zoom-out, .rotate-in, .fade-in, .bounce-in, ' +
            '.reveal-up, .reveal-left, .reveal-right, .reveal-zoom'
        );

        animatedElements.forEach(el => observer.observe(el));
    }

    // Terminal typing effect
    initializeTerminalTyping() {
        const terminalContent = document.getElementById('typed-text');
        if (!terminalContent) return;

        const commands = [
            '$ initializing security protocols...',
            '$ loading cyber defense systems...',
            '$ establishing secure connections...',
            '$ jethat@security:~$ ready for innovation'
        ];

        let commandIndex = 0;
        let charIndex = 0;

        const typeCommand = () => {
            if (commandIndex < commands.length) {
                const currentCommand = commands[commandIndex];
                
                if (charIndex < currentCommand.length) {
                    terminalContent.innerHTML += currentCommand.charAt(charIndex);
                    charIndex++;
                    setTimeout(typeCommand, 50);
                } else {
                    terminalContent.innerHTML += '<br>';
                    commandIndex++;
                    charIndex = 0;
                    setTimeout(typeCommand, 1000);
                }
            } else {
                // Add blinking cursor
                terminalContent.innerHTML += '<span class="typing-cursor"></span>';
            }
        };

        // Start typing after a delay
        setTimeout(typeCommand, 1000);
    }

    // Scanning line animation
    initializeScanAnimation() {
        const scanningLine = document.querySelector('.scanning-line');
        if (scanningLine) {
            // Add CSS animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes scan {
                    0% { top: 0; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    // Initialize reveal animations with stagger
    initializeRevealAnimations() {
        // Add stagger delays to elements
        const staggerElements = document.querySelectorAll('[class*="stagger-"]');
        staggerElements.forEach(el => {
            const staggerClass = Array.from(el.classList).find(cls => cls.startsWith('stagger-'));
            if (staggerClass) {
                const delay = parseInt(staggerClass.split('-')[1]) * 100;
                el.style.transitionDelay = `${delay}ms`;
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new AboutPageAnimations();
});

// Export for external use
window.AboutPageAnimations = AboutPageAnimations;