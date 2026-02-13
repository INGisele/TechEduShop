// ============================================================
// TECHEDUSHOP CONTACT FORM - BACKEND INTEGRATION
// ============================================================
// Add this script to your existing index.html file
// Replace the existing form submission handler
// ============================================================

(function() {
    'use strict';

    // ⚙️ CONFIGURATION
    const API_URL = 'http://localhost:5000/api/v1/contacts';
    
    // Get form element
    const contactForm = document.querySelector('#contact form');
    
    if (!contactForm) {
        console.error('Contact form not found');
        return;
    }

    // Create notification element
    const createNotification = () => {
        const notification = document.createElement('div');
        notification.id = 'formNotification';
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            padding: 20px 30px;
            border-radius: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.2);
            z-index: 10000;
            font-family: 'Quicksand', sans-serif;
            font-weight: 600;
            font-size: 15px;
            max-width: 400px;
            transform: translateX(500px);
            transition: transform 0.4s ease;
        `;
        document.body.appendChild(notification);
        return notification;
    };

    const notification = createNotification();

    // Show notification
    const showNotification = (message, type) => {
        notification.textContent = message;
        notification.style.background = type === 'success' 
            ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' 
            : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
        notification.style.color = 'white';
        notification.style.transform = 'translateX(0)';

        setTimeout(() => {
            notification.style.transform = 'translateX(500px)';
        }, 5000);
    };

    // Show inline error
    const showFieldError = (fieldId, message) => {
        const field = document.getElementById(fieldId);
        if (!field) return;

        // Remove existing error
        const existingError = field.parentElement.querySelector('.field-error');
        if (existingError) existingError.remove();

        // Add new error
        const errorDiv = document.createElement('div');
        errorDiv.className = 'field-error';
        errorDiv.textContent = message;
        errorDiv.style.cssText = `
            color: #ef4444;
            font-size: 13px;
            margin-top: 6px;
            font-weight: 600;
        `;
        field.style.borderColor = '#ef4444';
        field.parentElement.appendChild(errorDiv);

        // Remove error on input
        field.addEventListener('input', function handler() {
            if (errorDiv.parentElement) errorDiv.remove();
            field.style.borderColor = '';
            field.removeEventListener('input', handler);
        }, { once: true });
    };

    // Clear all errors
    const clearErrors = () => {
        document.querySelectorAll('.field-error').forEach(el => el.remove());
        contactForm.querySelectorAll('input, textarea').forEach(el => {
            el.style.borderColor = '';
        });
    };

    // Form submission handler
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        clearErrors();

        // Get form data
        const formData = {
            name: document.getElementById('name').value.trim(),
            school: document.getElementById('school').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            message: document.getElementById('message').value.trim()
        };

        // Get submit button
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalBtnContent = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span style="display: inline-flex; align-items: center; gap: 10px;">
                Sending...
                <span style="
                    border: 3px solid rgba(255,255,255,0.3);
                    border-top: 3px solid white;
                    border-radius: 50%;
                    width: 16px;
                    height: 16px;
                    animation: spin 1s linear infinite;
                "></span>
            </span>
        `;

        // Add spin animation
        if (!document.getElementById('spinKeyframes')) {
            const style = document.createElement('style');
            style.id = 'spinKeyframes';
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (response.ok) {
                // Success
                showNotification('✅ ' + data.message, 'success');
                contactForm.reset();
                
                // Smooth scroll to top
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                // Handle validation errors
                if (data.errors && Array.isArray(data.errors)) {
                    data.errors.forEach(error => {
                        showFieldError(error.field, error.message);
                    });
                    showNotification('❌ Please fix the errors in the form', 'error');
                } else {
                    showNotification('❌ ' + (data.message || 'Something went wrong'), 'error');
                }
            }
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification(
                '❌ Unable to send message. Please check your connection or contact us at +250 788 829 942', 
                'error'
            );
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnContent;
        }
    });

    // Client-side validation
    const validateEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const emailField = document.getElementById('email');
    if (emailField) {
        emailField.addEventListener('blur', () => {
            const email = emailField.value.trim();
            if (email && !validateEmail(email)) {
                showFieldError('email', 'Please enter a valid email address');
            }
        });
    }

    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('blur', () => {
            const phone = phoneField.value.trim();
            if (phone && !/^[\d\s+()-]+$/.test(phone)) {
                showFieldError('phone', 'Please enter a valid phone number');
            }
        });
    }

    console.log('🚀 TechEduShop Contact Form initialized');
    console.log('📡 API Endpoint:', API_URL);
    console.log('💡 Backend server should be running on http://localhost:5000');
})();
