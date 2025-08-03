// DOM Elements
const emailInput = document.getElementById('email-input');
const joinBtn = document.getElementById('join-btn');
const successModal = document.getElementById('success-modal');
const modalClose = document.getElementById('modal-close');
const dataCounter = document.getElementById('data-counter');
const numberDisplay = document.querySelector('.number-display');

// Initialize the page
document.addEventListener('DOMContentLoaded', function() {
    initializeAnimations();
    initializeCounter();
    initializeFormHandlers();
    initializeModalHandlers();
    initializeScrollEffects();
});

// Initialize animations
function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .data-content, .features-header');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Initialize counter with real-time updates
function initializeCounter() {
    let currentNumber = 29171793;
    const baseIncrement = 1; // Increment per second
    
    function updateCounter() {
        // Add random increment to make it more realistic
        const randomIncrement = Math.floor(Math.random() * 3) + baseIncrement;
        currentNumber += randomIncrement;
        
        // Format number with commas
        const formattedNumber = currentNumber.toLocaleString();
        numberDisplay.textContent = formattedNumber;
        
        // Add subtle animation
        numberDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => {
            numberDisplay.style.transform = 'scale(1)';
        }, 200);
    }
    
    // Update counter every second
    setInterval(updateCounter, 1000);
    
    // Initial update
    updateCounter();
}

// Initialize form handlers
function initializeFormHandlers() {
    // Email validation function
    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show error message
    function showError(input, message) {
        input.classList.add('error');
        
        // Remove existing error message
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
        
        // Create and show new error message
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message show';
        errorDiv.textContent = message;
        input.parentNode.appendChild(errorDiv);
    }
    
    // Clear error
    function clearError(input) {
        input.classList.remove('error');
        const errorMessage = input.parentNode.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
    }
    
    // Handle email input validation
    emailInput.addEventListener('input', function() {
        if (this.value.trim() === '') {
            clearError(this);
        } else if (!validateEmail(this.value)) {
            showError(this, 'Please enter a valid email address');
        } else {
            clearError(this);
            this.classList.add('success');
        }
    });
    
    // Handle form submission
    joinBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        if (!email) {
            showError(emailInput, 'Please enter your email address');
            return;
        }
        
        if (!validateEmail(email)) {
            showError(emailInput, 'Please enter a valid email address');
            return;
        }
        
        // Show loading state
        this.classList.add('loading');
        this.disabled = true;
        
        // Simulate API call
        setTimeout(() => {
            // Remove loading state
            this.classList.remove('loading');
            this.disabled = false;
            
            // Show success modal
            showSuccessModal();
            
            // Clear form
            emailInput.value = '';
            emailInput.classList.remove('success');
            
            // Track conversion (you can replace this with your analytics)
            console.log('Email submitted:', email);
            
        }, 2000);
    });
    
    // Handle waitlist form submissions
    const waitlistBtns = document.querySelectorAll('.waitlist-btn, .secondary-btn');
    waitlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Show loading state
            this.textContent = 'Processing...';
            this.disabled = true;
            
            // Simulate API call
            setTimeout(() => {
                this.textContent = this.classList.contains('secondary-btn') ? 'See How It Works' : 'Join the Waiting List';
                this.disabled = false;
                showSuccessModal();
            }, 1500);
        });
    });
}

// Initialize modal handlers
function initializeModalHandlers() {
    // Close modal when clicking close button
    modalClose.addEventListener('click', hideSuccessModal);
    
    // Close modal when clicking outside
    successModal.addEventListener('click', function(e) {
        if (e.target === this) {
            hideSuccessModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && successModal.classList.contains('show')) {
            hideSuccessModal();
        }
    });
}

// Show success modal
function showSuccessModal() {
    successModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

// Hide success modal
function hideSuccessModal() {
    successModal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

// Initialize scroll effects
function initializeScrollEffects() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Header scroll effect
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove scrolled class for header styling
        if (scrollTop > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Hide/show header on scroll (optional)
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Add CSS for header scroll effect
const style = document.createElement('style');
style.textContent = `
    .header {
        transition: transform 0.3s ease, background-color 0.3s ease;
    }
    
    .header.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
    }
    
    .number-display {
        transition: transform 0.2s ease;
    }
    
    .error-message {
        position: absolute;
        top: 100%;
        left: 0;
        margin-top: 5px;
        font-size: 0.8rem;
        color: #E60023;
    }
    
    .email-form {
        position: relative;
    }
    
    .cta-button {
        position: relative;
    }
    
    .cta-button::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        border: 2px solid transparent;
        border-top: 2px solid white;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        opacity: 0;
    }
    
    .cta-button.loading::after {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Performance optimization: Debounce scroll events
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

// Apply debouncing to scroll events
window.addEventListener('scroll', debounce(function() {
    // Any additional scroll-based functionality can go here
}, 10));

// Add some interactive hover effects
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Add click effect to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
});

// Analytics tracking (replace with your actual analytics)
function trackEvent(eventName, properties = {}) {
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Example: Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', eventName, properties);
    }
    
    // Console log for development
    console.log('Event tracked:', eventName, properties);
}

// Track page views and interactions
document.addEventListener('DOMContentLoaded', function() {
    trackEvent('page_view', {
        page_title: 'SocialQ Landing Page',
        page_location: window.location.href
    });
    
    // Track form interactions
    emailInput.addEventListener('focus', () => {
        trackEvent('form_focus', { form_name: 'email_signup' });
    });
    
    joinBtn.addEventListener('click', () => {
        trackEvent('form_submit', { form_name: 'email_signup' });
    });
});

// Export functions for potential external use
window.SocialQ = {
    trackEvent,
    showSuccessModal,
    hideSuccessModal
};