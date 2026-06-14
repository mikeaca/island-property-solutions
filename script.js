/* ============================================
   ISLAND PROPERTY SOLUTIONS - GLOBAL SCRIPT
   Non-Critical JavaScript (loaded async)
   ============================================ */

// ============ CART MANAGEMENT ============

/**
 * Get cart from localStorage
 */
function getCart() {
    try {
        return JSON.parse(localStorage.getItem('cart')) || [];
    } catch (e) {
        console.error('Error reading cart:', e);
        return [];
    }
}

/**
 * Save cart to localStorage
 */
function saveCart(cart) {
    try {
        localStorage.setItem('cart', JSON.stringify(cart));
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

/**
 * Update cart count badge on all pages
 */
function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const badge = document.getElementById('cart-count');
    if (badge) {
        badge.textContent = count;
    }
}

/**
 * Add item to cart
 */
function addToCart(id, name, price) {
    const quantity = parseInt(document.getElementById(`qty-${id}`)?.value || 1);
    let cart = getCart();
    
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id, name, price, quantity });
    }
    
    saveCart(cart);
    updateCartCount();
    updateCartDisplay();
    
    // Visual feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Added!';
    btn.style.background = 'var(--gold)';
    btn.style.color = 'var(--navy)';
    
    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
    }, 1500);
    
    // Reset quantity input
    const input = document.getElementById(`qty-${id}`);
    if (input) input.value = 1;
}

/**
 * Update cart display (on shop page)
 */
function updateCartDisplay() {
    const cart = getCart();
    const preview = document.getElementById('cartPreview');
    const total = document.getElementById('cartTotal');
    
    if (!preview || !total) return;
    
    const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    if (cart.length === 0) {
        preview.innerHTML = '<div style="color: #aaa; text-align: center; padding: 1rem 0;">Empty</div>';
    } else {
        preview.innerHTML = cart.map(item => `
            <div class="cart-item-preview">
                ${item.name} x${item.quantity} = €${(item.price * item.quantity).toFixed(2)}
                <button onclick="removeFromCart(${item.id})" style="float: right; background: none; border: none; color: #c99; cursor: pointer; font-weight: bold;">×</button>
            </div>
        `).join('');
    }
    
    total.textContent = `Total: €${cartTotal.toFixed(2)}`;
}

/**
 * Remove item from cart
 */
function removeFromCart(id) {
    let cart = getCart();
    cart = cart.filter(item => item.id !== id);
    saveCart(cart);
    updateCartCount();
    updateCartDisplay();
}

/**
 * Go to checkout
 */
function goToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    window.location.href = 'checkout.html';
}

/**
 * Clear cart
 */
function clearCart() {
    localStorage.removeItem('cart');
    updateCartCount();
    updateCartDisplay();
}

// ============ FORM HANDLING ============

/**
 * Handle contact form submission
 */
function handleContactSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const responseDiv = document.getElementById('response-message');
    
    if (responseDiv) {
        responseDiv.classList.add('show');
        form.reset();
        
        setTimeout(() => {
            responseDiv.classList.remove('show');
        }, 5000);
    }
    
    // In production, send data to backend
    console.log('Contact form submitted');
}

/**
 * Handle checkout form submission
 */
function placeOrder() {
    const fullName = document.getElementById('fullName')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const address = document.getElementById('address')?.value.trim();
    const city = document.getElementById('city')?.value.trim();
    const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked')?.value;

    // Validation
    if (!fullName || !email || !phone || !address || !city) {
        alert('Please fill in all required delivery fields');
        return false;
    }

    if (paymentMethod === 'card') {
        const cardName = document.getElementById('cardName')?.value.trim();
        const cardNumber = document.getElementById('cardNumber')?.value.trim();
        const cardExpiry = document.getElementById('cardExpiry')?.value.trim();
        const cardCVV = document.getElementById('cardCVV')?.value.trim();

        if (!cardName || !cardNumber || !cardExpiry || !cardCVV) {
            alert('Please fill in all card details');
            return false;
        }

        if (cardNumber.replace(/\s/g, '').length !== 16) {
            alert('Card number must be 16 digits');
            return false;
        }

        if (!cardExpiry.match(/^\d{2}\/\d{2}$/)) {
            alert('Expiry date must be in MM/YY format');
            return false;
        }

        if (cardCVV.length !== 3) {
            alert('CVV must be 3 digits');
            return false;
        }
    }

    // Generate order number
    const orderNumber = 'IPS' + Math.random().toString(9).substr(2, 8).toUpperCase();

    // Hide form, show success
    const checkoutForm = document.getElementById('checkoutForm');
    const successMessage = document.getElementById('successMessage');
    
    if (checkoutForm && successMessage) {
        checkoutForm.style.display = 'none';
        successMessage.style.display = 'block';
        document.getElementById('orderNumber').textContent = `Order #${orderNumber}`;
    }

    // Clear cart
    clearCart();

    // Log order (in production, send to backend)
    console.log('Order placed:', {
        orderNumber,
        name: fullName,
        email,
        phone,
        address,
        city,
        paymentMethod,
        items: getCart()
    });

    // Scroll to top
    window.scrollTo(0, 0);
}

/**
 * Toggle payment method visibility
 */
function togglePaymentMethod(method) {
    const cardFields = document.getElementById('cardFields');
    if (!cardFields) return;
    
    if (method === 'card') {
        cardFields.classList.add('show');
    } else {
        cardFields.classList.remove('show');
    }
    
    // Update visual selection
    const codOption = document.getElementById('codOption');
    const cardOption = document.getElementById('cardOption');
    
    if (codOption && cardOption) {
        codOption.classList.toggle('selected', method === 'cod');
        cardOption.classList.toggle('selected', method === 'card');
    }
}

// ============ CARD INPUT FORMATTING ============

/**
 * Format card number with spaces
 */
function formatCardNumber(input) {
    if (!input) return;
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\s/g, '');
        let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
        e.target.value = formattedValue;
    });
}

/**
 * Format expiry date to MM/YY
 */
function formatExpiryDate(input) {
    if (!input) return;
    input.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length >= 2) {
            value = value.substr(0, 2) + '/' + value.substr(2, 2);
        }
        e.target.value = value;
    });
}

// ============ UTILITY FUNCTIONS ============

/**
 * Debounce function for performance
 */
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

/**
 * Throttle function for performance
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}

/**
 * Lazy load images
 */
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ============ PAGE LOAD INITIALIZATION ============

/**
 * Initialize on DOM ready
 */
function initializePage() {
    // Update cart count
    updateCartCount();
    
    // Format card inputs if on checkout
    formatCardNumber(document.getElementById('cardNumber'));
    formatExpiryDate(document.getElementById('cardExpiry'));
    
    // Lazy load images
    if ('IntersectionObserver' in window) {
        lazyLoadImages();
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}

// ============ ANALYTICS PLACEHOLDER ============

/**
 * Track user interaction (placeholder for GA)
 */
function trackEvent(category, action, label) {
    if (window.gtag) {
        gtag('event', action, {
            'event_category': category,
            'event_label': label
        });
    }
}

// ============ ERROR HANDLING ============

/**
 * Global error handler
 */
window.addEventListener('error', function(event) {
    console.error('Error:', event.error);
    // In production, send to error tracking service
});

/**
 * Unhandled promise rejection handler
 */
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled rejection:', event.reason);
    // In production, send to error tracking service
});
