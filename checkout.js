/* ============================================
   ISLAND PROPERTY SOLUTIONS - CHECKOUT SCRIPT
   Order Processing & Cart Display
   ============================================ */

const SHIPPING_COST = 2.50;

/**
 * Load cart and display on checkout page
 */
function loadCheckoutCart() {
    const cart = getCart();
    const container = document.getElementById('cartItems');
    
    if (!container) return;
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666;">Your cart is empty</p>';
        const btn = document.querySelector('.btn-primary');
        if (btn) btn.disabled = true;
        return;
    }

    let subtotal = 0;
    container.innerHTML = cart.map(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        return `
            <div class="cart-item">
                <div>
                    <div class="item-name">${item.name}</div>
                    <div class="item-qty">Qty: ${item.quantity}</div>
                </div>
                <div class="item-price">€${itemTotal.toFixed(2)}</div>
            </div>
        `;
    }).join('');

    updateCheckoutTotals(subtotal);
}

/**
 * Update totals on checkout page
 */
function updateCheckoutTotals(subtotal) {
    const total = subtotal + SHIPPING_COST;
    const subtotalEl = document.getElementById('subtotal');
    const totalEl = document.getElementById('total');
    
    if (subtotalEl) subtotalEl.textContent = `€${subtotal.toFixed(2)}`;
    if (totalEl) totalEl.textContent = `€${total.toFixed(2)}`;
}

/**
 * Initialize checkout page
 */
function initializeCheckout() {
    loadCheckoutCart();
    
    // Set up payment method toggle
    const codOption = document.getElementById('codOption');
    const cardOption = document.getElementById('cardOption');
    
    if (codOption) {
        codOption.classList.add('selected');
    }
    
    // Track page view
    trackEvent('checkout', 'view', 'checkout_page');
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeCheckout);
} else {
    initializeCheckout();
}
