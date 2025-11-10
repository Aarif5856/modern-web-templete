// Modern Web Template JavaScript
// Author: AI Assistant
// Description: Interactive functionality for the modern web template

document.addEventListener('DOMContentLoaded', function() {
    // ===========================
    // THEME PERSISTENCE (dark class on <html>)
    // ===========================
    try {
        const THEME_KEY = 'mw:theme';
        const storedTheme = localStorage.getItem(THEME_KEY);
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
        document.documentElement.classList.toggle('dark', initialTheme === 'dark');
        localStorage.setItem(THEME_KEY, initialTheme);
        ['#theme-toggle', '#theme-toggle-mobile'].forEach(sel => {
            const btn = document.querySelector(sel);
            if (!btn) return;
            btn.addEventListener('click', () => {
                const isDark = document.documentElement.classList.toggle('dark');
                localStorage.setItem(THEME_KEY, isDark ? 'dark' : 'light');
            });
        });
    } catch (e) {
        console.warn('Theme persistence unavailable:', e);
    }
    
    // ===========================
    // MOBILE MENU FUNCTIONALITY
    // ===========================
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuIcon = mobileMenuBtn.querySelector('i');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('active');
            
            // Toggle icon
            if (mobileMenuIcon.classList.contains('fa-bars')) {
                mobileMenuIcon.classList.remove('fa-bars');
                mobileMenuIcon.classList.add('fa-times');
            } else {
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
            }
        });
        
        // Close mobile menu when clicking on links
        const mobileMenuLinks = mobileMenu.querySelectorAll('a');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
                mobileMenu.classList.remove('active');
                mobileMenuIcon.classList.remove('fa-times');
                mobileMenuIcon.classList.add('fa-bars');
            });
        });
    }
    
    // ===========================
    // NAVBAR SCROLL EFFECT
    // ===========================
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // ===========================
    // SMOOTH SCROLLING FOR ANCHOR LINKS
    // ===========================
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // ===========================
    // INTERSECTION OBSERVER FOR ANIMATIONS
    // ===========================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements for animations
    const animatedElements = document.querySelectorAll('.feature-card, .testimonial-card, .pricing-card');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
    // Section-level reveals
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    
    // ===========================
    // FEATURE CARDS HOVER EFFECTS
    // ===========================
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // ===========================
    // PRICING CARD INTERACTIONS
    // ===========================
    const pricingCards = document.querySelectorAll('.pricing-card');
    
    pricingCards.forEach(card => {
        const button = card.querySelector('button');
        if (button) {
            button.addEventListener('click', function() {
                // Simulate action (replace with actual functionality)
                const planTitle = card.querySelector('h3') ? card.querySelector('h3').textContent : 'Plan';
                console.log('Pricing plan selected:', planTitle);
                showNotification('Plan selected! Redirecting to checkout...', 'success');
            });
        }
    });

    // ===========================
    // UNIVERSAL RIPPLE FOR CTA + PRICING BUTTONS
    // ===========================
    document.addEventListener('click', function(e) {
        const target = e.target.closest('.btn-primary, .btn-secondary, .pricing-card button');
        if (!target) return;
        const existing = target.querySelector('.ripple');
        if (existing) existing.remove();
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        const rect = target.getBoundingClientRect();
        ripple.style.left = `${e.clientX - rect.left}px`;
        ripple.style.top = `${e.clientY - rect.top}px`;
        target.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }, { passive: true });
    
    // ===========================
    // CTA BUTTON INTERACTIONS
    // ===========================
    const ctaButtons = document.querySelectorAll('.btn-primary, .btn-secondary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't prevent default for anchor links
            if (!this.getAttribute('href')) {
                e.preventDefault();
            }
            
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
            
            // Simulate action based on button text
            const buttonText = this.textContent.toLowerCase();
            
            if (buttonText.includes('get started')) {
                showNotification('Welcome! Let\'s get you started.', 'info');
            } else if (buttonText.includes('demo')) {
                showNotification('Demo video coming soon!', 'info');
            }
        });
    });
    
    // ===========================
    // TESTIMONIAL CARDS ROTATION
    // ===========================
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    let currentTestimonial = 0;
    
    function rotateTestimonials() {
        testimonialCards.forEach((card, index) => {
            card.style.opacity = index === currentTestimonial ? '1' : '0.7';
            card.style.transform = index === currentTestimonial ? 'scale(1.05)' : 'scale(1)';
        });
        
        currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    }
    
    // Start testimonial rotation
    if (testimonialCards.length > 0) {
        setInterval(rotateTestimonials, 5000); // Rotate every 5 seconds
    }
    
    // ===========================
    // FORM VALIDATION (if forms are added)
    // ===========================
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // ===========================
    // NOTIFICATION SYSTEM
    // ===========================
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
        `;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            removeNotification(notification);
        });
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            removeNotification(notification);
        }, 5000);
    }

    // Helper to dismiss notifications with transition
    function removeNotification(notification) {
        try {
            notification.style.transform = 'translateX(120%)';
            notification.addEventListener('transitionend', () => notification.remove(), { once: true });
        } catch (_) {
            if (notification && notification.remove) notification.remove();
        }
    }
    
    function removeNotification(notification) {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }
    
    // ===========================
    // SCROLL TO TOP FUNCTIONALITY
    // ===========================
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #3B82F6, #8B5CF6);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.style.opacity = '1';
            scrollToTopBtn.style.visibility = 'visible';
        } else {
            scrollToTopBtn.style.opacity = '0';
            scrollToTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // ===========================
    // PERFORMANCE MONITORING
    // ===========================
    window.addEventListener('load', () => {
        console.log('🚀 Modern Web Template loaded successfully!');
        console.log('⚡ Page load time:', performance.now().toFixed(2), 'ms');
        
        // Add loaded class to body for any CSS animations
        document.body.classList.add('loaded');
    });
    
    // ===========================
    // ACCESSIBILITY ENHANCEMENTS
    // ===========================
    
    // Keyboard navigation for custom elements
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Close mobile menu on escape
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenuBtn.click();
            }
        }
    });
    
    // Focus management for better accessibility
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    
    // ===========================
    // BROWSER COMPATIBILITY CHECKS
    // ===========================
    function checkBrowserSupport() {
        const isModernBrowser = 'IntersectionObserver' in window && 'fetch' in window;
        
        if (!isModernBrowser) {
            console.warn('Some features may not work in older browsers');
            // Fallback for older browsers
            document.querySelectorAll('.fade-in').forEach(el => {
                el.classList.add('visible');
            });
        }
    }
    
    checkBrowserSupport();
    
    // ===========================
    // UTILITY FUNCTIONS
    // ===========================
    
    // Debounce function for performance
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
    
    // Throttle function for scroll events
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // ===========================
    // ANALYTICS TRACKING (placeholder)
    // ===========================
    function trackEvent(eventName, properties = {}) {
        // Replace with your analytics service
        console.log('📊 Event tracked:', eventName, properties);
        
        // Example: Google Analytics 4
        // gtag('event', eventName, properties);
        
        // Example: Custom analytics
        // analytics.track(eventName, properties);
    }
    
    // Track button clicks
    document.addEventListener('click', (e) => {
        if (e.target.matches('.btn-primary, .btn-secondary')) {
            trackEvent('button_click', {
                button_text: e.target.textContent.trim(),
                section: e.target.closest('section')?.id || 'unknown'
            });
        }
    });
    
    console.log('✅ Modern Web Template JavaScript initialized');
});
