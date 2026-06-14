/* ============================================
   ISLAND PROPERTY SOLUTIONS - SHOP PAGE SCRIPT
   Product Management & Cart Interaction
   ============================================ */

// Product data
const products = [
    { id: 1, name: 'All-Purpose Cleaner', category: 'General', price: 8.99, emoji: '🧹' },
    { id: 2, name: 'Disinfectant Spray', category: 'Sanitation', price: 4.99, emoji: '🧼' },
    { id: 3, name: 'Glass Cleaner', category: 'Windows', price: 6.50, emoji: '🪟' },
    { id: 4, name: 'Floor Polish & Wax', category: 'Floors', price: 14.99, emoji: '✨' },
    { id: 5, name: 'Bathroom Cleaner', category: 'Bathrooms', price: 9.75, emoji: '🛁' },
    { id: 6, name: 'Toilet Cleaner', category: 'Bathrooms', price: 5.99, emoji: '🚽' },
    { id: 7, name: 'Microfiber Cloth Set', category: 'Tools', price: 7.50, emoji: '🧽' },
    { id: 8, name: 'Laundry Detergent', category: 'Laundry', price: 11.99, emoji: '🧴' },
    { id: 9, name: 'Degreaser', category: 'Kitchen', price: 12.50, emoji: '🧴' },
    { id: 10, name: 'Oven Cleaner', category: 'Kitchen', price: 13.99, emoji: '🔥' },
    { id: 11, name: 'Carpet & Upholstery', category: 'Furniture', price: 10.99, emoji: '🪑' },
    { id: 12, name: 'Hospital Disinfectant', category: 'Sanitation', price: 10.50, emoji: '💨' }
];

/**
 * Render products to the page
 */
function renderProducts() {
    const container = document.getElementById('productsContainer');
    if (!container) return;
    
    container.innerHTML = products.map(product => `
        <div class="product-card">
            <div class="product-image">${product.emoji}</div>
            <div class="product-info">
                <div class="category-label">${product.category}</div>
                <div class="product-name">${product.name}</div>
                <div class="product-price">€${product.price.toFixed(2)}</div>
                <div style="display: flex; align-items: center;">
                    <input type="number" min="1" value="1" class="quantity-input" id="qty-${product.id}" style="flex: 1;">
                    <button class="add-btn" onclick="addToCart(${product.id}, '${product.name}', ${product.price})" style="flex: 1.5; margin-left: 0.5rem;">Add</button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Initialize shop page
 */
function initializeShop() {
    renderProducts();
    updateCartCount();
    updateCartDisplay();
}

// Initialize on page load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeShop);
} else {
    initializeShop();
}
