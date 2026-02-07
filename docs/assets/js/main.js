// ScrollSoul Showcase Website - JavaScript

// ROI Calculator
function calculateROI() {
    const employees = parseInt(document.getElementById('employees').value) || 0;
    const budget = parseInt(document.getElementById('budget').value) || 0;
    
    // Calculate savings with ScrollSoul
    const traditionalCost = budget;
    const scrollSoulCost = employees <= 5 ? 0 : employees <= 100 ? 499 : 999;
    const savings = traditionalCost - scrollSoulCost;
    const savingsPercent = Math.round((savings / traditionalCost) * 100);
    
    // Calculate crypto value
    const cryptoValue = scrollSoulCost >= 499 ? 5000 : 0;
    
    const resultDiv = document.getElementById('roi-result');
    if (savings > 0) {
        resultDiv.innerHTML = `
            <h3 style="color: var(--primary-color); margin-bottom: 1rem;">💰 Your Potential Savings</h3>
            <p style="font-size: 2rem; font-weight: 900; margin-bottom: 1rem;">$${savings.toLocaleString()}/month</p>
            <p style="margin-bottom: 0.5rem;">That's ${savingsPercent}% cost reduction!</p>
            ${cryptoValue > 0 ? `<p style="color: var(--accent-color); font-weight: 600;">+ $${cryptoValue.toLocaleString()}/mo in crypto rewards for employees!</p>` : ''}
            <p style="margin-top: 1rem; font-size: 0.9rem; color: var(--text-light);">Annual savings: $${(savings * 12).toLocaleString()}</p>
        `;
    } else {
        resultDiv.innerHTML = `
            <p style="color: var(--accent-color);">Enter your details to see potential savings!</p>
        `;
    }
}

// Demo Form Submission
document.getElementById('demoForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Show success message
    const formElement = e.target;
    const successMessage = document.createElement('div');
    successMessage.style.cssText = `
        background: linear-gradient(135deg, #10b981 0%, #059669 100%);
        color: white;
        padding: 2rem;
        border-radius: 0.5rem;
        text-align: center;
        margin-top: 2rem;
    `;
    successMessage.innerHTML = `
        <h3 style="margin-bottom: 1rem;">✅ Request Submitted Successfully!</h3>
        <p>Our team will contact you within 24 hours to schedule your personalized demo.</p>
    `;
    
    formElement.parentNode.insertBefore(successMessage, formElement.nextSibling);
    formElement.style.display = 'none';
    
    // Track conversion (placeholder)
    console.log('Demo request submitted');
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// Animate on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe feature cards
document.querySelectorAll('.feature-card, .pricing-card, .testimonial-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    observer.observe(card);
});

// Code block syntax highlighting (simple)
document.querySelectorAll('code').forEach(block => {
    let html = block.innerHTML;
    
    // Highlight keywords
    html = html.replace(/\b(import|from|const|await|new)\b/g, '<span style="color: #c792ea">$1</span>');
    
    // Highlight strings
    html = html.replace(/(['"])(.*?)\1/g, '<span style="color: #c3e88d">$1$2$1</span>');
    
    // Highlight comments
    html = html.replace(/(\/\/.*$)/gm, '<span style="color: #546e7a">$1</span>');
    
    // Highlight properties
    html = html.replace(/\.(\w+)/g, '.<span style="color: #82aaff">$1</span>');
    
    block.innerHTML = html;
});

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
    console.log('Analytics:', { category, action, label });
    // Integrate with Google Analytics, Mixpanel, etc.
    // gtag('event', action, { 'event_category': category, 'event_label': label });
}

// Track button clicks
document.querySelectorAll('.btn-primary, .btn-secondary').forEach(button => {
    button.addEventListener('click', function() {
        trackEvent('Button', 'Click', this.textContent);
    });
});

// Newsletter signup (if added)
function subscribeNewsletter(email) {
    // Implement newsletter subscription
    trackEvent('Newsletter', 'Subscribe', email);
}

// Chat widget placeholder
function initializeChatWidget() {
    // Integrate with Intercom, Drift, or custom chat
    console.log('Chat widget initialized');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    console.log('ScrollSoul Showcase loaded');
    // initializeChatWidget();
});
