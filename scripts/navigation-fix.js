// Navigation Path Fix Script
// This script fixes navigation paths for pages in subdirectories

(function() {
    'use strict';
    
    function fixNavigationPaths() {
        // Determine if we're in a subdirectory
        const currentPath = window.location.pathname;
        const pathSegments = currentPath.split('/').filter(segment => segment !== '');
        
        // Check if we're in a subdirectory (not root)
        let isInSubdirectory = false;
        let basePath = '';
        
        // More robust subdirectory detection
        if (pathSegments.length > 1) {
            // We're definitely in a subdirectory
            isInSubdirectory = true;
            basePath = '../';
        } else if (pathSegments.length === 1) {
            // Check if the current file is in a known subdirectory
            const knownSubdirs = ['services', 'products', 'technologies', 'about', 'legal'];
            const currentFile = pathSegments[0];
            
            // Check if current file indicates we're in a subdirectory
            if (currentFile && currentFile.includes('.html')) {
                // Extract directory from current path
                const currentDir = currentPath.split('/').slice(-2, -1)[0];
                if (knownSubdirs.includes(currentDir)) {
                    isInSubdirectory = true;
                    basePath = '../';
                }
            }
        }
        
        // Alternative check: if the current URL contains known subdirectories
        const subdirPatterns = ['/services/', '/products/', '/technologies/', '/about/', '/legal/'];
        if (subdirPatterns.some(pattern => currentPath.includes(pattern))) {
            isInSubdirectory = true;
            basePath = '../';
        }
        
        // Additional check: if we're in a file within a subdirectory
        if (!isInSubdirectory && currentPath.includes('/') && currentPath.endsWith('.html')) {
            const pathParts = currentPath.split('/');
            if (pathParts.length >= 2) {
                const directory = pathParts[pathParts.length - 2];
                const knownSubdirs = ['services', 'products', 'technologies', 'about', 'legal'];
                if (knownSubdirs.includes(directory)) {
                    isInSubdirectory = true;
                    basePath = '../';
                }
            }
        }
        
        console.log('Navigation Fix - Current path:', currentPath);
        console.log('Navigation Fix - Path segments:', pathSegments);
        console.log('Navigation Fix - Is in subdirectory:', isInSubdirectory);
        console.log('Navigation Fix - Base path:', basePath);
        
        if (!isInSubdirectory) {
            console.log('Navigation Fix - No path fixing needed for root page');
            return;
        }
        
        // Fix all navigation links with more comprehensive selectors
        const linkSelectors = [
            // Main navigation links
            'a[href="index.html"]',
            'a[href="contact.html"]',
            'a[href="careers.html"]',
            // All dropdown items (catch-all approach)
            '.dropdown-item[href^="about/"]',
            '.dropdown-item[href^="products/"]',
            '.dropdown-item[href^="services/"]',
            '.dropdown-item[href^="technologies/"]',
            '.dropdown-item[href="careers.html"]',
            // Specific Company dropdown links
            'a[href="about/index.html"]',
            'a[href="about/team.html"]',
            'a[href="about/success-stories.html"]',
            'a[href="about/culture.html"]',
            // Specific Products dropdown links
            'a[href="products/magai.html"]',
            'a[href="products/virtual-naani.html"]',
            'a[href="products/ai-lms.html"]',
            'a[href="products/e-library.html"]',
            'a[href="products/anukaran-ai.html"]',
            'a[href="products/sambhasini-ai.html"]',
            'a[href="products/multi-dictionary.html"]',
            'a[href="products/jetpay.html"]',
            // Specific Services dropdown links
            'a[href="services/cybersecurity.html"]',
            'a[href="services/ai-ml.html"]',
            'a[href="services/web-development.html"]',
            'a[href="services/mobile-development.html"]',
            'a[href="services/cloud-services.html"]',
            // Specific Technologies dropdown links
            'a[href="technologies/core.html"]',
            'a[href="technologies/case-study.html"]',
            'a[href="technologies/innovation.html"]',
            'a[href="technologies/index.html"]',
            // Footer links
            'a[href="products/index.html"]',
            'a[href="services/index.html"]',
            'a[href="technologies/index.html"]',
            'a[href^="services/"]',
            'a[href^="products/"]',
            'a[href^="technologies/"]',
            'a[href^="about/"]'
        ];
        
        linkSelectors.forEach(selector => {
            const links = document.querySelectorAll(selector);
            links.forEach(link => {
                const originalHref = link.getAttribute('href');
                if (originalHref && 
                    !originalHref.startsWith('http') && 
                    !originalHref.startsWith('#') && 
                    !originalHref.startsWith('../') && 
                    !originalHref.startsWith(basePath)) {
                    
                    const newHref = basePath + originalHref;
                    link.setAttribute('href', newHref);
                    console.log('Navigation Fix - Updated link:', originalHref, '->', newHref);
                }
            });
        });
        
        // Additional comprehensive fix for ALL dropdown items and footer links
        const allNavigationLinks = document.querySelectorAll('.dropdown-item, .professional-dropdown-item, #footer-component a, .dropdown-menu a');
        allNavigationLinks.forEach(link => {
            const originalHref = link.getAttribute('href');
            if (originalHref && 
                !originalHref.startsWith('http') && 
                !originalHref.startsWith('#') && 
                !originalHref.startsWith('../') && 
                !originalHref.startsWith(basePath) &&
                (originalHref.includes('/') || originalHref.endsWith('.html'))) {
                
                const newHref = basePath + originalHref;
                link.setAttribute('href', newHref);
                console.log('Navigation Fix - Updated navigation/footer link:', originalHref, '->', newHref);
            }
        });
        
        // Fix logo image and brand link
        const logoImg = document.querySelector('.logo-img, .navbar-brand img');
        if (logoImg) {
            const originalSrc = logoImg.getAttribute('src');
            if (originalSrc && originalSrc.startsWith('assets/') && !originalSrc.startsWith('../')) {
                const newSrc = basePath + originalSrc;
                logoImg.setAttribute('src', newSrc);
                console.log('Navigation Fix - Updated logo image:', originalSrc, '->', newSrc);
            }
        }
        
        // Fix brand/logo link
        const brandLink = document.querySelector('.navbar-brand');
        if (brandLink) {
            const originalHref = brandLink.getAttribute('href');
            if (originalHref === 'index.html' || (originalHref && !originalHref.startsWith('../'))) {
                const newHref = basePath + (originalHref || 'index.html');
                brandLink.setAttribute('href', newHref);
                console.log('Navigation Fix - Updated brand link:', originalHref, '->', newHref);
            }
        }
        
        // Fix any other asset references in navigation
        const assetImages = document.querySelectorAll('img[src^="assets/"], link[href^="assets/"], script[src^="assets/"]');
        assetImages.forEach(element => {
            const attr = element.hasAttribute('src') ? 'src' : 'href';
            const originalPath = element.getAttribute(attr);
            if (originalPath && !originalPath.startsWith('../')) {
                const newPath = basePath + originalPath;
                element.setAttribute(attr, newPath);
                console.log('Navigation Fix - Updated asset path:', originalPath, '->', newPath);
            }
        });
        
        // Fix CTA button links
        const ctaButtons = document.querySelectorAll('a[href="contact.html"], .cta-button[href="contact.html"], .btn-gradient[href="contact.html"]');
        ctaButtons.forEach(button => {
            const originalHref = button.getAttribute('href');
            if (originalHref && !originalHref.startsWith('../')) {
                const newHref = basePath + originalHref;
                button.setAttribute('href', newHref);
                console.log('Navigation Fix - Updated CTA button:', originalHref, '->', newHref);
            }
        });
        
        console.log('Navigation Fix - Path fixing completed');
        
        // Final comprehensive sweep - fix any remaining navigation links
        const navContainer = document.querySelector('.professional-nav');
        if (navContainer) {
            const allNavLinks = navContainer.querySelectorAll('a[href]');
            allNavLinks.forEach(link => {
                const originalHref = link.getAttribute('href');
                if (originalHref && 
                    !originalHref.startsWith('http') && 
                    !originalHref.startsWith('#') && 
                    !originalHref.startsWith('../') && 
                    !originalHref.startsWith(basePath) &&
                    (originalHref.includes('/') || originalHref.endsWith('.html'))) {
                    
                    const newHref = basePath + originalHref;
                    link.setAttribute('href', newHref);
                    console.log('Navigation Fix - Final sweep updated link:', originalHref, '->', newHref);
                }
            });
        }
    }
    
    // Enhanced initialization with multiple triggers
    function initializeNavigationFix() {
        console.log('Navigation Fix - Initializing...');
        
        // Run immediately if DOM is ready
        if (document.readyState !== 'loading') {
            fixNavigationPaths(); // Run immediately
            setTimeout(fixNavigationPaths, 100);
        }
        
        // Run when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
            console.log('Navigation Fix - DOM loaded, fixing paths...');
            fixNavigationPaths(); // Run immediately
            setTimeout(fixNavigationPaths, 200);
        });
        
        // Run when window is loaded (for additional safety)
        window.addEventListener('load', function() {
            console.log('Navigation Fix - Window loaded, fixing paths...');
            fixNavigationPaths(); // Run immediately
            setTimeout(fixNavigationPaths, 300);
        });
        
        // Run after a short delay to catch any dynamically loaded content
        setTimeout(fixNavigationPaths, 500);
        setTimeout(fixNavigationPaths, 1000);
    }
    
    // Start initialization
    initializeNavigationFix();
    
    // Expose global function for manual triggering
    window.fixNavigationPaths = fixNavigationPaths;
    
    // Add event listener for custom navigation loaded event
    document.addEventListener('navigationLoaded', function() {
        console.log('Navigation Fix - Custom navigationLoaded event detected');
        setTimeout(fixNavigationPaths, 100);
    });
    
    // Enhanced MutationObserver for dynamic content
    const observer = new MutationObserver(function(mutations) {
        let shouldFix = false;
        
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                const addedNodes = Array.from(mutation.addedNodes);
                const hasNavigationOrFooter = addedNodes.some(node => 
                    node.nodeType === 1 && (
                        (node.querySelector && (
                            node.querySelector('.professional-nav') ||
                            node.querySelector('.dropdown-menu') ||
                            node.querySelector('.dropdown-item') ||
                            node.querySelector('#footer-component') ||
                            node.querySelector('footer') ||
                            node.querySelector('nav') ||
                            node.querySelector('.navbar')
                        )) ||
                        (node.classList && (
                            node.classList.contains('professional-nav') ||
                            node.classList.contains('dropdown-menu') ||
                            node.classList.contains('dropdown-item') ||
                            node.classList.contains('navbar')
                        )) ||
                        (node.id && (
                            node.id === 'footer-component' ||
                            node.id === 'navigation-component'
                        )) ||
                        (node.tagName && (
                            node.tagName.toLowerCase() === 'nav' ||
                            node.tagName.toLowerCase() === 'footer'
                        ))
                    )
                );
                
                // Also check if the mutation target is a navigation container
                if (mutation.target && mutation.target.id === 'navigation-component') {
                    shouldFix = true;
                }
                
                if (hasNavigationOrFooter) {
                    shouldFix = true;
                }
            }
        });
        
        if (shouldFix) {
            console.log('Navigation Fix - Navigation or Footer component detected via MutationObserver, fixing paths...');
            setTimeout(fixNavigationPaths, 50); // Reduced delay for faster response
            setTimeout(fixNavigationPaths, 150); // Backup fix
            setTimeout(fixNavigationPaths, 300); // Final backup fix
        }
    });
    
    // Start observing when DOM is ready
    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } else {
        document.addEventListener('DOMContentLoaded', function() {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    
})();