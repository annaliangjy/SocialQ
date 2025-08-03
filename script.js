// ===== GLOBAL VARIABLES =====
let postsCounter = 29171793;
let isCounterAnimated = false;

// ===== DOM CONTENT LOADED =====
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// ===== INITIALIZE APPLICATION =====
function initializeApp() {
    setupFormValidation();
    setupScrollAnimations();
    setupMobileMenu();
    setupSmoothScroll();
    startCounterAnimation();
    setupIntersectionObserver();
    preloadCriticalResources();
}

// ===== FORM VALIDATION =====
function setupFormValidation() {
    const form = document.getElementById('waitlistForm');
    const emailInput = document.getElementById('email');
    const nameInput = document.getElementById('name');
    const errorMessage = document.getElementById('errorMessage');
    const successMessage = document.getElementById('successMessage');

    if (!form) return;

    // Real-time validation
    emailInput.addEventListener('input', validateEmailField);
    nameInput.addEventListener('input', validateNameField);
    
    // Form submission
    form.addEventListener('submit', handleFormSubmission);

    function validateEmailField() {
        const email = emailInput.value.trim();
        const isValid = isValidEmail(email);
        
        emailInput.classList.toggle('invalid', email && !isValid);
        emailInput.classList.toggle('valid', isValid);
        
        return isValid;
    }

    function validateNameField() {
        const name = nameInput.value.trim();
        const isValid = name.length >= 2;
        
        nameInput.classList.toggle('invalid', name && !isValid);
        nameInput.classList.toggle('valid', isValid);
        
        return isValid;
    }

    function handleFormSubmission(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const name = nameInput.value.trim();
        
        // Hide previous messages
        hideMessages();
        
        // Validate fields
        const isEmailValid = validateEmailField();
        const isNameValid = validateNameField();
        
        if (!isEmailValid || !isNameValid) {
            showError(getValidationErrorMessage(email, name));
            return;
        }

        // Show loading state
        showLoadingState();
        
        // Simulate API call
        setTimeout(() => {
            hideLoadingState();
            showSuccess('🎉 Welcome to the SocialQ family! Check your email for updates.');
            resetForm();
            
            // Track conversion (if analytics are available)
            trackWaitlistSignup(email, name);
        }, 2000);
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function getValidationErrorMessage(email, name) {
        if (!email && !name) return 'Please enter your email and name.';
        if (!email) return 'Please enter a valid email address.';
        if (!name) return 'Please enter your name.';
        if (!isValidEmail(email)) return 'Please enter a valid email address.';
        if (name.length < 2) return 'Name must be at least 2 characters long.';
        return 'Please check your information and try again.';
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
        errorMessage.classList.add('shake');
        
        setTimeout(() => {
            errorMessage.classList.remove('shake');
        }, 500);
    }

    function showSuccess(message) {
        successMessage.textContent = message;
        successMessage.style.display = 'block';
        successMessage.classList.add('bounce');
        
        setTimeout(() => {
            successMessage.classList.remove('bounce');
        }, 500);
    }

    function hideMessages() {
        errorMessage.style.display = 'none';
        successMessage.style.display = 'none';
    }

    function showLoadingState() {
        const submitButton = form.querySelector('.submit-button');
        submitButton.textContent = 'Joining...';
        submitButton.disabled = true;
        submitButton.classList.add('loading');
    }

    function hideLoadingState() {
        const submitButton = form.querySelector('.submit-button');
        submitButton.textContent = 'Join the Waiting List';
        submitButton.disabled = false;
        submitButton.classList.remove('loading');
    }

    function resetForm() {
        setTimeout(() => {
            form.reset();
            emailInput.classList.remove('valid', 'invalid');
            nameInput.classList.remove('valid', 'invalid');
        }, 3000);
    }

    function trackWaitlistSignup(email, name) {
        // Track with analytics if available
        if (typeof gtag !== 'undefined') {
            gtag('event', 'waitlist_signup', {
                'event_category': 'engagement',
                'event_label': 'hero_form'
            });
        }
        
        // Console log for development
        console.log('Waitlist signup tracked:', { email, name });
    }
}

// ===== COUNTER ANIMATION =====
function startCounterAnimation() {
    const counterElement = document.getElementById('postsCounter');
    if (!counterElement) return;

    // Update counter every hour (3600000 ms)
    setInterval(() => {
        postsCounter += Math.floor(Math.random() * 1000) + 500; // Add 500-1500 posts
        animateCounterUpdate(counterElement, postsCounter);
    }, 3600000);

    // Initial animation when element comes into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isCounterAnimated) {
                animateCounterFromZero(counterElement, postsCounter);
                isCounterAnimated = true;
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(counterElement);
}

function animateCounterFromZero(element, targetValue) {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = Math.floor(startValue + (targetValue - startValue) * easeOutQuart);
        element.textContent = formatNumber(currentValue);

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

function animateCounterUpdate(element, newValue) {
    const currentValue = parseInt(element.textContent.replace(/,/g, ''));
    const duration = 1000;
    const startTime = performance.now();

    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const value = Math.floor(currentValue + (newValue - currentValue) * easeOutCubic);
        
        element.textContent = formatNumber(value);

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

function formatNumber(num) {
    return num.toLocaleString();
}

// ===== SCROLL ANIMATIONS =====
function setupScrollAnimations() {
    // Parallax effect for floating elements
    let ticking = false;

    function updateParallax() {
        const scrollY = window.pageYOffset;
        const elements = document.querySelectorAll('.floating-element');
        
        elements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrollY * speed);
            element.style.transform = `translate3d(0, ${yPos}px, 0)`;
        });
        
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }

    window.addEventListener('scroll', requestTick, { passive: true });
}

// ===== INTERSECTION OBSERVER =====
function setupIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .data-content, .features-content');
    animateElements.forEach(el => observer.observe(el));
}

// ===== MOBILE MENU =====
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!mobileToggle || !navLinks) return;

    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    // Close menu when clicking on links
    navLinks.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            closeMobileMenu();
        }
    });

    function toggleMobileMenu() {
        const isOpen = navLinks.classList.contains('mobile-open');
        
        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    function openMobileMenu() {
        navLinks.classList.add('mobile-open');
        mobileToggle.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        navLinks.classList.remove('mobile-open');
        mobileToggle.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ===== SMOOTH SCROLL =====
function setupSmoothScroll() {
    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== SCROLL TO WAITLIST FUNCTION =====
function scrollToWaitlist() {
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = waitlistSection.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// ===== PERFORMANCE OPTIMIZATIONS =====
function preloadCriticalResources() {
    // Preload Google Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap';
    fontLink.as = 'style';
    fontLink.onload = function() {
        this.onload = null;
        this.rel = 'stylesheet';
    };
    document.head.appendChild(fontLink);
}

// ===== UTILITY FUNCTIONS =====
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

// ===== ERROR HANDLING =====
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send to error tracking service
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
    // Could send to error tracking service
});

// ===== ADDITIONAL CSS ANIMATIONS (Added via JavaScript) =====
const additionalStyles = `
    .email-input.valid,
    .name-input.valid {
        border-color: #4CAF50;
        box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
    }

    .email-input.invalid,
    .name-input.invalid {
        border-color: #EE1D52;
        box-shadow: 0 0 0 3px rgba(238, 29, 82, 0.1);
    }

    .submit-button.loading {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .shake {
        animation: shake 0.5s ease-in-out;
    }

    .bounce {
        animation: bounce 0.5s ease-in-out;
    }

    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }

    @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-5px); }
    }

    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }

    .nav-links.mobile-open {
        display: flex;
        position: fixed;
        top: 80px;
        left: 0;
        width: 100%;
        height: calc(100vh - 80px);
        background: rgba(255, 255, 255, 0.98);
        backdrop-filter: blur(20px);
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding-top: 50px;
        gap: 30px;
        z-index: 999;
    }

    .mobile-menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .mobile-menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .mobile-menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(7px, -6px);
    }
`;

// Inject additional styles
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// ===== EXPORT FOR GLOBAL ACCESS =====
window.SocialQ = {
    scrollToWaitlist,
    formatNumber,
    postsCounter
};