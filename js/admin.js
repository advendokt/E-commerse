// Admin panel functionality for the Mini E-commerce shop

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
        
        // Simple authentication (not secure - just for demo)
        if (username === adminCredentials.username && password === adminCredentials.password) {
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'admin/dashboard.html';
        } else {
            errorMessage.textContent = 'Invalid username or password';
        }
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

// Dashboard functionality
if (window.location.href.includes('dashboard.html')) {
    loadDashboardData();
}

function loadDashboardData() {
    // Calculate dashboard stats
    const totalOrders = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const totalProducts = products.length;
    
    // Update dashboard elements
    document.getElementById('total-orders').textContent = totalOrders;
    document.getElementById('pending-orders').textContent = pendingOrders;
    document.getElementById('total-revenue').textContent = '$' + totalRevenue.toFixed(2);
    document.getElementById('total-products').textContent = totalProducts;
    
    // Display recent orders (latest 5)
    const recentOrdersTable = document.getElementById('recent-orders');
    if (recentOrdersTable) {
        const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        
        recentOrdersTable.innerHTML = '';
        
        recentOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${formatDate(order.date)}</td>
                <td>${order.customer.name}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td><span class="status-badge ${order.status}">${capitalizeFirstLetter(order.status)}</span></td>
            `;
            recentOrdersTable.appendChild(row);
        });
    }
}

// Orders functionality
if (window.location.href.includes('orders.html')) {
    loadOrdersData();
    setupOrderFilters();
    setupOrderDetailModal();
}

function loadOrdersData(filter = 'all', searchTerm = '') {
    const ordersTable = document.getElementById('orders-list');
    if (!ordersTable) return;
    
    // Filter and sort orders (newest first)
    let filteredOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Apply status filter
    if (filter !== 'all') {
        filteredOrders = filteredOrders.filter(order => order.status === filter);
    }
    
    // Apply search filter
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredOrders = filteredOrders.filter(order => 
            order.id.toLowerCase().includes(term) || 
            order.customer.name.toLowerCase().includes(term) ||
            order.customer.email.toLowerCase().includes(term)
        );
    }
    
    // Render orders
    ordersTable.innerHTML = '';
    
    if (filteredOrders.length === 0) {
        ordersTable.innerHTML = `<tr><td colspan="6" class="empty-table">No orders found</td></tr>`;
        return;
    }
    
    filteredOrders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${formatDate(order.date)}</td>
            <td>${order.customer.name}</td>
            <td>$${order.total.toFixed(2)}</td>
            <td><span class="status-badge ${order.status}">${capitalizeFirstLetter(order.status)}</span></td>
            <td>
                <button class="btn btn-small btn-view" data-order-id="${order.id}">View</button>
            </td>
        `;
        ordersTable.appendChild(row);
    });
    
    // Add event listeners to view buttons
    document.querySelectorAll('.btn-view').forEach(btn => {
        btn.addEventListener('click', function() {
            const orderId = this.getAttribute('data-order-id');
            showOrderDetails(orderId);
        });
    });
}

function setupOrderFilters() {
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-order');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', function() {
            loadOrdersData(this.value, searchInput.value);
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            loadOrdersData(statusFilter.value, this.value);
        });
    }
}

function setupOrderDetailModal() {
    const modal = document.getElementById('order-details-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const updateBtn = document.getElementById('update-status-btn');
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    updateBtn.addEventListener('click', function() {
        const orderId = this.getAttribute('data-order-id');
        const newStatus = document.getElementById('update-status').value;
        updateOrderStatus(orderId, newStatus);
    });
}

function showOrderDetails(orderId) {
    const order = orders.find(o => o.id === orderId);
    const modal = document.getElementById('order-details-modal');
    const content = document.getElementById('order-details-content');
    const updateBtn = document.getElementById('update-status-btn');
    const statusSelect = document.getElementById('update-status');
    
    if (!order) return;
    
    let itemsList = '';
    order.items.forEach(item => {
        itemsList += `
            <div class="order-item">
                <span>${item.name} × ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `;
    });
    
    content.innerHTML = `
        <div class="order-details-header">
            <div class="order-id">
                <p><strong>Order ID:</strong> ${order.id}</p>
                <p><strong>Date:</strong> ${formatDate(order.date)}</p>
            </div>
            <div class="order-status">
                <span class="status-badge ${order.status}">${capitalizeFirstLetter(order.status)}</span>
            </div>
        </div>
        
        <div class="order-customer">
            <h4>Customer Information</h4>
            <p><strong>Name:</strong> ${order.customer.name}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Address:</strong> ${order.customer.address}</p>
            <p><strong>Payment Method:</strong> ${getPaymentMethod(order.payment)}</p>
        </div>
        
        <div class="order-items">
            <h4>Order Items</h4>
            ${itemsList}
            <div class="order-total">
                <strong>Total:</strong>
                <strong>$${order.total.toFixed(2)}</strong>
            </div>
        </div>
    `;
    
    // Set current status in the dropdown
    statusSelect.value = order.status;
    
    // Store order ID for update function
    updateBtn.setAttribute('data-order-id', order.id);
    
    // Show modal
    modal.style.display = 'block';
}

function updateOrderStatus(orderId, newStatus) {
    const orderIndex = orders.findIndex(o => o.id === orderId);
    
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        saveOrders();
        
        // Update UI
        const modal = document.getElementById('order-details-modal');
        modal.style.display = 'none';
        loadOrdersData(document.getElementById('status-filter').value, document.getElementById('search-order').value);
        
        // If on dashboard, refresh dashboard data
        if (document.getElementById('dashboard-stats')) {
            loadDashboardData();
        }
    }
}

// Product management functionality
if (window.location.href.includes('products.html')) {
    loadProductsData();
    setupProductFilters();
    setupProductModal();
    setupDeleteModal();
}

function loadProductsData(category = 'all', searchTerm = '') {
    const productsTable = document.getElementById('products-list');
    if (!productsTable) return;
    
    // Filter products
    let filteredProducts = [...products];
    
    // Apply category filter
    if (category !== 'all') {
        filteredProducts = filteredProducts.filter(product => product.category === category);
    }
    
    // Apply search filter
    if (searchTerm) {
        const term = searchTerm.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(term) || 
            product.description.toLowerCase().includes(term)
        );
    }
    
    // Render products
    productsTable.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsTable.innerHTML = `<tr><td colspan="8" class="empty-table">No products found</td></tr>`;
        return;
    }
    
    filteredProducts.forEach(product => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${product.id}</td>
            <td><img src="${product.image}" alt="${product.name}" class="product-thumbnail"></td>
            <td>${product.name}</td>
            <td>${getCategoryName(product.category)}</td>
            <td>$${product.price.toFixed(2)}${product.salePrice ? `<br><span class="sale-price">$${product.salePrice.toFixed(2)}</span>` : ''}</td>
            <td>${product.stock}</td>
            <td><span class="status-badge ${product.status}">${capitalizeFirstLetter(product.status)}</span></td>
            <td>
                <button class="btn btn-small btn-edit" data-product-id="${product.id}">Edit</button>
                <button class="btn btn-small btn-danger btn-delete" data-product-id="${product.id}">Delete</button>
            </td>
        `;
        productsTable.appendChild(row);
    });
    
    // Add event listeners to action buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            editProduct(productId);
        });
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            showDeleteConfirmation(productId);
        });
    });
}

function setupProductFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const searchInput = document.getElementById('search-product');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function() {
            loadProductsData(this.value, searchInput.value);
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            loadProductsData(categoryFilter.value, this.value);
        });
    }
}

function setupProductModal() {
    const addProductBtn = document.getElementById('add-product-btn');
    const modal = document.getElementById('product-modal');
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = document.getElementById('cancel-product');
    const productForm = document.getElementById('product-form');
    
    // Show modal when Add New Product button is clicked
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            resetProductForm();
            document.getElementById('modal-title').textContent = 'Add New Product';
            modal.style.display = 'block';
        });
    }
    
    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Handle form submission
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            saveProduct();
        });
    }
}

function resetProductForm() {
    const form = document.getElementById('product-form');
    form.reset();
    document.getElementById('product-id').value = '';
    document.getElementById('image-preview').style.display = 'none';
    document.querySelector('.sale-options').style.display = 'none';
}

function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Fill form with product data
    document.getElementById('modal-title').textContent = 'Edit Product';
    document.getElementById('product-id').value = product.id;
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-image').value = product.image;
    document.getElementById('product-status').value = product.status;
    
    // Handle sale price
    if (product.status === 'sale' && product.salePrice) {
        document.querySelector('.sale-options').style.display = 'block';
        document.getElementById('sale-price').value = product.salePrice;
    } else {
        document.querySelector('.sale-options').style.display = 'none';
    }
    
    // Display image preview
    const preview = document.getElementById('image-preview');
    preview.src = product.image;
    preview.style.display = 'block';
    
    // Show modal
    document.getElementById('product-modal').style.display = 'block';
}

function saveProduct() {
    const productId = document.getElementById('product-id').value;
    const name = document.getElementById('product-name').value;
    const category = document.getElementById('product-category').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    const description = document.getElementById('product-description').value;
    const image = document.getElementById('product-image').value;
    const status = document.getElementById('product-status').value;
    
    // Get sale price if applicable
    let salePrice = null;
    if (status === 'sale') {
        salePrice = parseFloat(document.getElementById('sale-price').value);
    }
    
    // Update existing product or create new one
    if (productId) {
        // Update existing product
        const index = products.findIndex(p => p.id === parseInt(productId));
        if (index !== -1) {
            products[index] = {
                ...products[index],
                name,
                category,
                price,
                stock,
                description,
                image,
                status,
                salePrice
            };
        }
    } else {
        // Create new product
        const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
        products.push({
            id: newId,
            name,
            category,
            price,
            stock,
            description,
            image,
            status,
            salePrice
        });
    }
    
    // Save data and update UI
    saveProducts();
    loadProductsData();
    
    // Close modal
    document.getElementById('product-modal').style.display = 'none';
}

function setupDeleteModal() {
    const modal = document.getElementById('delete-modal');
    const cancelBtn = document.getElementById('cancel-delete');
    const confirmBtn = document.getElementById('confirm-delete');
    
    if (cancelBtn) {
        cancelBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }
    
    if (confirmBtn) {
        confirmBtn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-product-id'));
            deleteProduct(productId);
            modal.style.display = 'none';
        });
    }
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function showDeleteConfirmation(productId) {
    const modal = document.getElementById('delete-modal');
    const confirmBtn = document.getElementById('confirm-delete');
    
    confirmBtn.setAttribute('data-product-id', productId);
    modal.style.display = 'block';
}

function deleteProduct(productId) {
    const index = products.findIndex(p => p.id === productId);
    
    if (index !== -1) {
        products.splice(index, 1);
        saveProducts();
        loadProductsData();
    }
}

// Helper functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function getCategoryName(categorySlug) {
    const categories = {
        'electronics': 'Electronics',
        'clothing': 'Clothing',
        'home': 'Home & Kitchen',
        'beauty': 'Beauty & Personal Care'
    };
    
    return categories[categorySlug] || categorySlug;
}

function getPaymentMethod(paymentCode) {
    const methods = {
        'card': 'Credit Card',
        'paypal': 'PayPal',
        'cod': 'Cash on Delivery'
    };
    
    return methods[paymentCode] || paymentCode;
}