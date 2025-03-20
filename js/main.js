// main.js - управление магазином на главной странице

document.addEventListener('DOMContentLoaded', function() {
    updateProductList();
    setupCart();
});

function updateProductList() {
    const productList = document.getElementById('product-list');
    if (!productList) return;
    
    productList.innerHTML = '';
    loadProducts().forEach(product => {
        const productCard = document.createElement('div');
        productCard.classList.add('product-card');
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            <span class="price">$${product.price.toFixed(2)}</span>
            <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
        `;
        productList.appendChild(productCard);
    });
    
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

function setupCart() {
    document.getElementById('cart-icon').addEventListener('click', function() {
        document.getElementById('cart-modal').style.display = 'block';
        updateCartDisplay();
    });
    
    document.querySelector('.close-cart').addEventListener('click', function() {
        document.getElementById('cart-modal').style.display = 'none';
    });
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    let product = loadProducts().find(p => p.id === productId);
    if (!product) return;
    
    let cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity++;
    } else {
        cart.push({ id: product.id, name: product.name, price: product.price, quantity: 1 });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartDisplay();
}

function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    cartItemsContainer.innerHTML = '';
    
    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.textContent = `${item.name} × ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`;
        cartItemsContainer.appendChild(itemElement);
    });
    
    document.getElementById('cart-total').textContent = cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2);
}