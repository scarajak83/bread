// Bread N' Brew - Modern Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    try {
        // Initialize EmailJS
        initEmailJS();

        // Initialize Navigation
        initNavigation();

        // Smooth scrolling for anchor links
        initSmoothScrolling();

        // Initialize scroll animations
        initScrollAnimations();

        // Initialize contact form
        initContactForm();

        // Initialize menu dropdown
        initMenuDropdown();

        // Initialize scroll to top
        initJumpToTop();

        // Initialize banner animation
        initBannerAnimation();

        console.log('☕ Bread N\' Brew website initialized successfully!');
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});

// Jump to Top Functionality
function initJumpToTop() {
    const jumpBtn = document.getElementById('jump-to-top');

    if (jumpBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                jumpBtn.classList.add('show');
            } else {
                jumpBtn.classList.remove('show');
            }
        });

        jumpBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Banner Scroll Animation
function initBannerAnimation() {
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scroll = window.pageYOffset;
            // Create a parallax and subtle zoom effect
            const scale = 1 + (scroll * 0.0005);
            const translateY = scroll * 0.3;
            hero.style.backgroundPosition = `center ${translateY}px`;
            // Note: background-size doesn't support easy scaling via JS without changing the string,
            // so we'll stick to background-position for parallax
        });
    }
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
            if (href === '#') return;
            
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(`
        .offering-card,
        .commitment-card,
        .hours-card,
        .menu-item,
        .contact-info-card,
        .about-text,
        .about-image,
        .contact-form-wrapper,
        .contact-info-wrapper
    `);

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        observer.observe(element);
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

// Parallax effect for images on scroll
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroImages = document.querySelectorAll('.hero-image, .about-image');
    
    heroImages.forEach(img => {
        const rate = scrolled * 0.5;
        if (img.querySelector('img')) {
            img.style.transform = `translateY(${-rate * 0.1}px)`;
        }
    });
});

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
