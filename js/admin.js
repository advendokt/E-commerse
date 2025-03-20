// Admin panel functionality for the Mini E-commerce shop

// Import data functions from data.js
const products = loadProducts();
const orders = loadOrders();

// Check if on login page and handle login logic
const adminCredentials = {
    username: "admin",
    password: "admin123"
};

if (document.getElementById('login-form')) {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('login-error');
        
        if (username === adminCredentials.username && password === adminCredentials.password) {
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'admin/dashboard.html';
        } else {
            errorMessage.textContent = 'Invalid username or password';
        }
        console.log("Login form submitted!");
    });
}

// Logout functionality
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('adminLoggedIn');
        window.location.href = '../login.html';
    });
}

// Load products in admin panel
if (window.location.href.includes('products.html')) {
    loadProductsData();
    setupProductActions();
}

function loadProductsData() {
    const productsTable = document.getElementById('products-list');
    if (!productsTable) return;
    
    productsTable.innerHTML = '';
    loadProducts().forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.stock}</td>
            <td>${product.status}</td>
            <td>
                <button class="btn btn-small btn-edit" data-id="${product.id}">Edit</button>
                <button class="btn btn-small btn-danger btn-delete" data-id="${product.id}">Delete</button>
            </td>
        `;
        productsTable.appendChild(row);
    });
}

function setupProductActions() {
    document.getElementById('add-product-btn').addEventListener('click', function() {
        resetProductForm();
        document.getElementById('product-modal').style.display = 'block';
    });
    
    document.getElementById('product-form').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            deleteProduct(id);
            loadProductsData();
        });
    });
    
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.getAttribute('data-id'));
            editProductModal(id);
        });
    });
}

function saveProduct() {
    document.getElementById('cancel-product').addEventListener('click', function() {
        document.getElementById('product-modal').style.display = 'none';
    });
    
    document.querySelector('.close-modal').addEventListener('click', function() {
        document.getElementById('product-modal').style.display = 'none';
    });
    
    const id = document.getElementById('product-id').value;
    const product = {
        name: document.getElementById('product-name').value,
        category: document.getElementById('product-category').value,
        price: parseFloat(document.getElementById('product-price').value),
        stock: parseInt(document.getElementById('product-stock').value),
        description: document.getElementById('product-description').value,
        image: document.getElementById('product-image').value,
        status: document.getElementById('product-status').value
    };
    
    if (id) {
        editProduct(parseInt(id), product);
    } else {
        addProduct(product);
    }
    loadProductsData();
    document.getElementById('product-modal').style.display = 'none';
}

function editProductModal(productId) {
    const product = loadProducts().find(p => p.id === productId);
    if (!product) return;

    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-status').value = product.status;

    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'block';
    } else {
        console.error("Модальное окно не найдено!");
    }
}
