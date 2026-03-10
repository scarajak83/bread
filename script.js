// Bread N' Brew - Optimized Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize Core Functionality
        initNavigation();
        initSmoothScrolling();
        initMenuDropdown();
        initContactForm();
        initEmailJS();

        // Performance Optimized Animations
        initScrollEffects();

        console.log('☕ Bread N\' Brew website initialized successfully!');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

/**
 * Combined Scroll Effects for Performance
 * Uses a single scroll listener and requestAnimationFrame
 */
function initScrollEffects() {
    const hero = document.querySelector('.hero');
    const jumpBtn = document.getElementById('jump-to-top');
    const heroImages = document.querySelectorAll('.hero-image, .about-image');

    // Initial State for Intersection Observer
    initIntersectionObserver();

    let ticking = false;
    let lastScrollY = window.pageYOffset;

    function updateScrollElements() {
        const scrollY = window.pageYOffset;

        // 1. Jump to Top Button Visibility
        if (jumpBtn) {
            if (scrollY > 300) {
                if (!jumpBtn.classList.contains('show')) jumpBtn.classList.add('show');
            } else {
                if (jumpBtn.classList.contains('show')) jumpBtn.classList.remove('show');
            }
        }

        // 2. Banner Parallax (Hero Background) - Only on Desktop
        if (hero && window.innerWidth > 768) {
            const translateY = scrollY * 0.3;
            hero.style.backgroundPosition = `center ${translateY}px`;
        } else if (hero) {
            hero.style.backgroundPosition = 'center';
        }

        // 3. Image Parallax (Hero/About Images) - Only on Desktop
        if (window.innerWidth > 768) {
            heroImages.forEach(img => {
                const rate = scrollY * 0.05;
                const innerImg = img.querySelector('img');
                if (innerImg) {
                    innerImg.style.transform = `translate3d(0, ${-rate}px, 0)`;
                }
            });
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', function() {
        if (!ticking) {
            window.requestAnimationFrame(updateScrollElements);
            ticking = true;
        }
    }, { passive: true });

    // Handle Scroll to Top Click
    if (jumpBtn) {
        jumpBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
}

/**
 * Intersection Observer for Entry Animations
 * Optimized to use CSS classes instead of inline styles
 */
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Target elements for reveal animation
    const animatedElements = document.querySelectorAll(`
        .offering-card,
        .commitment-card,
        .hours-card,
        .menu-item-card,
        .contact-info-card,
        .about-text,
        .about-image,
        .contact-form-wrapper,
        .contact-info-wrapper,
        .section-title,
        .category-header
    `);

    animatedElements.forEach(element => {
        element.classList.add('reveal-item');
        observer.observe(element);
    });
}

// Initialize EmailJS
function initEmailJS() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init('21LVan48_eVuxeqqS');
        console.log('EmailJS initialized');
    } else {
        console.warn('EmailJS not loaded');
    }
}

// Navigation functionality
function initNavigation() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a link is clicked
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling for anchor links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href.length <= 1) return;

            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Contact Form Handler
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Collect form data
            const formData = new FormData(this);
            const templateParams = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                phone: formData.get('phone') || 'Not provided',
                subject: formData.get('subject'),
                message: formData.get('message')
            };

            // Send email using EmailJS
            if (typeof emailjs !== 'undefined') {
                emailjs.send('service_aw0glyl', 'template_wvgv8q5', templateParams)
                    .then(function(response) {
                        console.log('Message sent successfully');
                        showNotification('Thank you! We received your message and will get back to you within 24 hours.', 'success');
                        contactForm.reset();
                    })
                    .catch(function(error) {
                        console.error('Failed to send message:', error);
                        showNotification('Sorry, there was an error. Please call us at (908) 933-0123.', 'error');
                    })
                    .finally(function() {
                        submitBtn.textContent = originalText;
                        submitBtn.disabled = false;
                    });
            } else {
                setTimeout(() => {
                    showNotification('Please call us at (908) 933-0123 or email breadnbrew512@gmail.com', 'error');
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1000);
            }
        });
    }
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${type === 'success' ? '#d29f51' : type === 'error' ? '#e91e63' : '#1a1a1a'};
        color: white;
        padding: 1rem 2rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 350px;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        line-height: 1.4;
        animation: slideInRight 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-in forwards';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}

// Add notification animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Parallax effect for images on scroll (Deprecated: Handled in initScrollEffects for performance)
// function deprecatedParallax() { ... }

// Enhance button hover effects
const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-tertiary');
buttons.forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-3px)';
    });
    
    btn.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Handle responsive menu on resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    }, 250);
});

// Menu Dropdown Functionality
function initMenuDropdown() {
    const dropdownBtn = document.querySelector('.menu-dropdown-btn');
    const dropdownContent = document.querySelector('.menu-dropdown-content');
    const dropdownLinks = document.querySelectorAll('.menu-dropdown-link');

    if (dropdownBtn && dropdownContent) {
        // Toggle dropdown on button click
        dropdownBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownContent.classList.toggle('active');
            dropdownBtn.classList.toggle('active');
        });

        // Close dropdown when link is clicked
        dropdownLinks.forEach(link => {
            link.addEventListener('click', function() {
                dropdownContent.classList.remove('active');
                dropdownBtn.classList.remove('active');
            });
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdownBtn.contains(e.target) && !dropdownContent.contains(e.target)) {
                dropdownContent.classList.remove('active');
                dropdownBtn.classList.remove('active');
            }
        });
    }
}

// Details Modal Functions
function openDetailsModal(button) {
    const modal = document.getElementById('detailsModal');
    const title = button.closest('.menu-item-card').querySelector('h3').textContent;
    const description = button.closest('.menu-item-card').querySelector('p').textContent;

    // Set modal content
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDescription').textContent = description;

    // Default allergens/info (can be customized per item)
    const allergenText = 'Ask staff about specific allergies.';
    document.getElementById('allergensList').textContent = allergenText;

    // Show modal
    modal.classList.add('active');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeDetailsModal() {
    const modal = document.getElementById('detailsModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('detailsModal');
    if (e.target === modal) {
        closeDetailsModal();
    }
});

// Close modal with Escape key
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closeDetailsModal();
    }
});

console.log('☕ Bread N\' Brew - Modern website loaded!');
