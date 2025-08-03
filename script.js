// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize counter
    initializeCounter();
    
    // Initialize form handling
    initializeForm();
    
    // Initialize smooth scrolling
    initializeSmoothScroll();
    
    // Initialize intersection observer for animations
    initializeAnimations();
    
    // Initialize mobile menu
    initializeMobileMenu();
    
    // Initialize cinematic background effects
    initializeCinematicEffects();
});

// Counter Animation
function initializeCounter() {
    const counterElement = document.querySelector('.counter-number');
    if (!counterElement) return;
    
    // Starting number
    let currentNumber = 29171793;
    
    // Function to format number with commas
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
    
    // Update counter
    function updateCounter() {
        // Increase by random amount (100-500) every hour
        const increment = Math.floor(Math.random() * 400) + 100;
        currentNumber += increment;
        
        // Animate the number change
        animateValue(counterElement, currentNumber - increment, currentNumber, 2000);
    }
    
    // Animate value change
    function animateValue(element, start, end, duration) {
        const startTime = performance.now();
        
        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            
            const current = Math.floor(start + (end - start) * easeOutQuart);
            element.textContent = formatNumber(current);
            
            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }
        
        requestAnimationFrame(update);
    }
    
    // Initial animation
    animateValue(counterElement, 0, currentNumber, 3000);
    
    // Update every hour
    setInterval(updateCounter, 3600000); // 1 hour in milliseconds
    
    // Also update every 30 seconds for demo purposes (remove in production)
    setInterval(updateCounter, 30000);
}

// Form Handling
function initializeForm() {
    const form = document.getElementById('waitlistForm');
    const emailInput = document.querySelector('.email-input');
    const submitButton = document.querySelector('.cta-button');
    const buttonText = document.querySelector('.button-text');
    const buttonLoader = document.querySelector('.button-loader');
    const formMessage = document.querySelector('.form-message');
    
    if (!form) return;
    
    // Email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Reset states
        emailInput.classList.remove('error', 'success');
        formMessage.classList.remove('error', 'success');
        formMessage.style.display = 'none';
        
        // Validate email
        if (!emailRegex.test(email)) {
            showError('Please enter a valid email address');
            return;
        }
        
        // Show loading state
        submitButton.disabled = true;
        buttonText.style.display = 'none';
        buttonLoader.style.display = 'flex';
        
        try {
            // Simulate API call (replace with actual API endpoint)
            await simulateAPICall(email);
            
            // Success state
            emailInput.classList.add('success');
            showSuccess('🎉 You\'re on the list! We\'ll be in touch soon.');
            
            // Reset form after delay
            setTimeout(() => {
                form.reset();
                emailInput.classList.remove('success');
                formMessage.style.display = 'none';
            }, 5000);
            
        } catch (error) {
            showError('Something went wrong. Please try again.');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            buttonText.style.display = 'inline';
            buttonLoader.style.display = 'none';
        }
    });
    
    // Real-time email validation
    emailInput.addEventListener('input', function() {
        if (this.value && !emailRegex.test(this.value)) {
            this.classList.add('error');
        } else {
            this.classList.remove('error');
        }
    });
    
    // Helper functions
    function showError(message) {
        emailInput.classList.add('error');
        formMessage.textContent = message;
        formMessage.classList.add('error');
        formMessage.style.display = 'block';
    }
    
    function showSuccess(message) {
        formMessage.textContent = message;
        formMessage.classList.add('success');
        formMessage.style.display = 'block';
    }
    
    // Simulate API call (replace with actual implementation)
    function simulateAPICall(email) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success
                console.log('Email submitted:', email);
                resolve();
            }, 2000);
        });
    }
}

// Smooth Scrolling
function initializeSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Intersection Observer for Animations
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Observe stats section
    const statsSection = document.querySelector('.stats-content');
    if (statsSection) {
        statsSection.style.opacity = '0';
        statsSection.style.transform = 'translateY(30px)';
        statsSection.style.transition = 'all 0.8s ease';
        observer.observe(statsSection);
    }
}

// Add animation class styles
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// Mobile Menu
function initializeMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navDesktop = document.querySelector('.nav-desktop');
    
    if (!menuToggle || !navDesktop) return;
    
    let isMenuOpen = false;
    
    menuToggle.addEventListener('click', function() {
        isMenuOpen = !isMenuOpen;
        
        if (isMenuOpen) {
            // Create mobile menu
            const mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu';
            mobileMenu.innerHTML = navDesktop.innerHTML;
            document.body.appendChild(mobileMenu);
            
            // Animate in
            setTimeout(() => {
                mobileMenu.classList.add('active');
            }, 10);
            
            // Close on link click
            mobileMenu.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', closeMobileMenu);
            });
        } else {
            closeMobileMenu();
        }
    });
    
    function closeMobileMenu() {
        const mobileMenu = document.querySelector('.mobile-menu');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            setTimeout(() => {
                mobileMenu.remove();
            }, 300);
        }
        isMenuOpen = false;
    }
}

// Add mobile menu styles
const mobileMenuStyle = document.createElement('style');
mobileMenuStyle.textContent = `
    .mobile-menu {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.95);
        backdrop-filter: blur(10px);
        padding: 2rem;
        transform: translateY(-100%);
        transition: transform 0.3s ease;
        z-index: 999;
    }
    
    .mobile-menu.active {
        transform: translateY(0);
    }
    
    .mobile-menu a {
        display: block;
        padding: 1rem 0;
        color: white;
        text-decoration: none;
        font-weight: 500;
        text-align: center;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .mobile-menu a:last-child {
        border-bottom: none;
    }
`;
document.head.appendChild(mobileMenuStyle);

// Cinematic Background Effects
function initializeCinematicEffects() {
    const particles = document.querySelector('.particles');
    if (!particles) return;
    
    // Create dynamic particles
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'dynamic-particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 20 + 10) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particles.appendChild(particle);
        
        // Remove particle after animation
        setTimeout(() => {
            particle.remove();
        }, 30000);
    }
    
    // Create particles periodically
    setInterval(createParticle, 3000);
    
    // Initial particles
    for (let i = 0; i < 5; i++) {
        setTimeout(createParticle, i * 1000);
    }
}

// Add dynamic particle styles
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    .dynamic-particle {
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(255, 255, 255, 0.8);
        border-radius: 50%;
        top: 100%;
        animation: particleFloat linear infinite;
        pointer-events: none;
    }
    
    @keyframes particleFloat {
        to {
            top: -10%;
            transform: translateX(100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyle);

// Header scroll effect
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > lastScroll && currentScroll > 100) {
        header.style.transform = 'translateY(-100%)';
    } else {
        header.style.transform = 'translateY(0)';
    }
    
    // Add background on scroll
    if (currentScroll > 50) {
        header.style.background = 'rgba(0, 0, 0, 0.95)';
    } else {
        header.style.background = 'rgba(0, 0, 0, 0.8)';
    }
    
    lastScroll = currentScroll;
});