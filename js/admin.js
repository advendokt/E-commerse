function checkAdminAuth() {
    if (!localStorage.getItem('adminLoggedIn') && !window.location.href.includes('login.html')) {
        window.location.href = '../login.html';
    }
}

// Admin login functionality
function setupAdminLogin() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('login-error');
            
            // Get admin credentials from localStorage or use default
            let adminCredentials = JSON.parse(localStorage.getItem('adminCredentials')) || {
                username: "admin",
                password: "admin123"
            };
            
            if (username === adminCredentials.username && password === adminCredentials.password) {
                localStorage.setItem('adminLoggedIn', 'true');
                window.location.href = 'admin/dashboard.html';
            } else {
                errorMessage.textContent = 'Invalid username or password';
            }
        });
    }
}

// Admin logout functionality
function setupAdminLogout() {
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            localStorage.removeItem('adminLoggedIn');
            window.location.href = '../login.html';
        });
    }
}

// Load and display orders
function loadOrders() {
    const ordersTable = document.getElementById('orders-list');
    if (!ordersTable) return;
    
    // Get orders from localStorage or use default
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Get filter value
    const statusFilter = document.getElementById('status-filter').value;
    const searchInput = document.getElementById('search-order').value.toLowerCase();
    
    // Filter orders
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        const matchesSearch = order.id.toLowerCase().includes(searchInput) || 
                              order.customer.name.toLowerCase().includes(searchInput);
        return matchesStatus && matchesSearch;
    });
    
    // Clear table
    ordersTable.innerHTML = '';
    
    // Add orders to table
    if (filteredOrders.length === 0) {
        ordersTable.innerHTML = '<tr><td colspan="6" class="text-center">No orders found</td></tr>';
    } else {
        filteredOrders.forEach(order => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${order.id}</td>
                <td>${order.date}</td>
                <td>${order.customer.name}</td>
                <td>$${order.total.toFixed(2)}</td>
                <td><span class="status-badge status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                <td>
                    <button class="action-btn view-btn" data-id="${order.id}">View</button>
                    <button class="action-btn delete-btn" data-id="${order.id}">Delete</button>
                </td>
            `;
            ordersTable.appendChild(row);
        });
        
        // Add event listeners for view buttons
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                openOrderDetails(orderId);
            });
        });
        
        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const orderId = this.getAttribute('data-id');
                if (confirm('Are you sure you want to delete this order?')) {
                    deleteOrder(orderId);
                }
            });
        });
    }
}

// Open order details modal
function openOrderDetails(orderId) {
    const modal = document.getElementById('order-details-modal');
    const modalContent = document.getElementById('order-details-content');
    
    // Get orders from localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Find the order
    const order = orders.find(order => order.id === orderId);
    
    if (order) {
        // Get products to display product names
        let products = JSON.parse(localStorage.getItem('products')) || [];
        
        // Create order items HTML
        let itemsHtml = '';
        order.items.forEach(item => {
            const product = products.find(p => p.id === item.productId);
            const productName = product ? product.name : 'Unknown Product';
            itemsHtml += `
                <div class="order-item">
                    <img src="${product ? product.image : ''}" alt="${productName}" class="order-item-image">
                    <div>
                        <p>${productName}</p>
                        <p>Quantity: ${item.quantity} x $${item.price.toFixed(2)}</p>
                    </div>
                </div>
            `;
        });
        
        // Set modal content
        modalContent.innerHTML = `
            <div class="order-details-header">
                <div>
                    <h4>Order ID: ${order.id}</h4>
                    <p>Date: ${order.date}</p>
                </div>
                <div>
                    <p>Status: <span class="status-badge status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></p>
                </div>
            </div>
            
            <div class="customer-info">
                <h4>Customer Information</h4>
                <p>Name: ${order.customer.name}</p>
                <p>Email: ${order.customer.email}</p>
                <p>Address: ${order.customer.address}</p>
                <p>Payment Method: ${order.payment}</p>
            </div>
            
            <div class="order-items">
                <h4>Order Items</h4>
                ${itemsHtml}
            </div>
            
            <div class="order-total">
                <h4>Total: $${order.total.toFixed(2)}</h4>
            </div>
        `;
        
        // Set current status in select
        const statusSelect = document.getElementById('update-status');
        statusSelect.value = order.status;
        
        // Show modal
        modal.style.display = 'block';
        
        // Update status button event
        const updateStatusBtn = document.getElementById('update-status-btn');
        updateStatusBtn.onclick = function() {
            updateOrderStatus(orderId, statusSelect.value);
        };
    }
}

// Update order status
function updateOrderStatus(orderId, newStatus) {
    // Get orders from localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Find and update the order
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = newStatus;
        
        // Save updated orders to localStorage
        localStorage.setItem('orders', JSON.stringify(orders));
        
        // Reload orders table
        loadOrders();
        
        // Close modal
        document.getElementById('order-details-modal').style.display = 'none';
        
        // Show success message
        alert('Order status updated successfully');
    }
}

// Delete order
function deleteOrder(orderId) {
    // Get orders from localStorage
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    
    // Filter out the order to delete
    orders = orders.filter(order => order.id !== orderId);
    
    // Save updated orders to localStorage
    localStorage.setItem('orders', JSON.stringify(orders));
    
    // Reload orders table
    loadOrders();
    
    // Show success message
    alert('Order deleted successfully');
}

// Setup filters
function setupFilters() {
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-order');
    
    if (statusFilter) {
        statusFilter.addEventListener('change', loadOrders);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', loadOrders);
    }
}

// Setup modal close button
function setupModal() {
    const modal = document.getElementById('order-details-modal');
    const closeBtn = document.querySelector('.close-modal');
    
    if (closeBtn && modal) {
        closeBtn.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// Initialize admin dashboard
function initializeAdminDashboard() {
    if (document.getElementById('dashboard-stats')) {
        // Get data from localStorage
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        let products = JSON.parse(localStorage.getItem('products')) || [];
        
        // Calculate stats
        const totalOrders = orders.length;
        const pendingOrders = orders.filter(order => order.status === 'pending').length;
        const totalRevenue = orders.reduce((total, order) => total + order.total, 0);
        const totalProducts = products.length;
        
        // Update dashboard stats
        document.getElementById('total-orders').textContent = totalOrders;
        document.getElementById('pending-orders').textContent = pendingOrders;
        document.getElementById('total-revenue').textContent = `$${totalRevenue.toFixed(2)}`;
        document.getElementById('total-products').textContent = totalProducts;
        
        // Load recent orders
        const recentOrdersList = document.getElementById('recent-orders');
        if (recentOrdersList) {
            // Get recent orders (last 5)
            const recentOrders = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
            
            recentOrdersList.innerHTML = '';
            
            if (recentOrders.length === 0) {
                recentOrdersList.innerHTML = '<tr><td colspan="5" class="text-center">No recent orders</td></tr>';
            } else {
                recentOrders.forEach(order => {
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${order.id}</td>
                        <td>${order.date}</td>
                        <td>${order.customer.name}</td>
                        <td>$${order.total.toFixed(2)}</td>
                        <td><span class="status-badge status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                    `;
                    recentOrdersList.appendChild(row);
                });
            }
        }
    }
}

// Initialize admin products page
function initializeProductsPage() {
    if (document.getElementById('products-list')) {
        loadProducts();
        setupProductModal();
    }
}

// Load products
function loadProducts() {
    const productsTable = document.getElementById('products-list');
    if (!productsTable) return;
    
    // Get products from localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    
    // Clear table
    productsTable.innerHTML = '';
    
    // Add products to table
    if (products.length === 0) {
        productsTable.innerHTML = '<tr><td colspan="6" class="text-center">No products found</td></tr>';
    } else {
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>
                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;">
                    ${product.name}
                </td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.category}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="action-btn edit-btn" data-id="${product.id}">Edit</button>
                    <button class="action-btn delete-btn" data-id="${product.id}">Delete</button>
                </td>
            `;
            productsTable.appendChild(row);
        });
        
        // Add event listeners for edit buttons
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                openProductModal(productId);
            });
        });
        
        // Add event listeners for delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                if (confirm('Are you sure you want to delete this product?')) {
                    deleteProduct(productId);
                }
            });
        });
    }
}

// Add event listener for the document
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in on admin pages
    checkAdminAuth();
    
    // Setup admin login
    setupAdminLogin();
    
    // Setup admin logout
    setupAdminLogout();
    
    // Initialize admin dashboard
    initializeAdminDashboard();
    
    // Initialize products page
    initializeProductsPage();
    
    // Load orders if on orders page
    if (document.getElementById('orders-list')) {
        loadOrders();
        setupFilters();
        setupModal();
    }
    
    // Initialize localStorage if empty
    if (!localStorage.getItem('products')) {
        // Use data from data.js if available, otherwise use empty array
        let initialProducts = typeof DATABASE !== 'undefined' ? DATABASE.products : [];
        localStorage.setItem('products', JSON.stringify(initialProducts));
    }
    
    if (!localStorage.getItem('orders')) {
        // Use data from data.js if available, otherwise use empty array
        let initialOrders = typeof DATABASE !== 'undefined' ? DATABASE.orders : [];
        localStorage.setItem('orders', JSON.stringify(initialOrders));
    }
    
    if (!localStorage.getItem('adminCredentials')) {
        // Use data from data.js if available, otherwise use default
        let adminCredentials = typeof DATABASE !== 'undefined' ? DATABASE.admin : {
            username: "admin",
            password: "admin123"
        };
        localStorage.setItem('adminCredentials', JSON.stringify(adminCredentials));
    }
});

function initializeProductsPage() {
    if (document.getElementById('products-list')) {
        loadProducts();
        setupProductModal();
    }
}

// Open Product Modal for Editing
function openProductModal(productId) {
    const modal = document.getElementById('product-modal');
    const modalTitle = document.getElementById('modal-title');
    const saveButton = document.getElementById('save-product-btn');

    // Get the product from localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const product = products.find(p => p.id === productId);

    if (product) {
        // Populate modal fields
        document.getElementById('product-id').value = product.id;
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-image').value = product.image;

        // Update modal title
        modalTitle.textContent = "Edit Product";

        // Show modal
        modal.style.display = "block";

        // Set save button event listener
        saveButton.onclick = function() {
            saveProductChanges(productId);
        };
    }
}

// Save edited product details
function saveProductChanges(productId) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    const productIndex = products.findIndex(p => p.id === productId);

    if (productIndex !== -1) {
        // Update product details
        products[productIndex].name = document.getElementById('product-name').value;
        products[productIndex].price = parseFloat(document.getElementById('product-price').value);
        products[productIndex].category = document.getElementById('product-category').value;
        products[productIndex].stock = parseInt(document.getElementById('product-stock').value);
        products[productIndex].image = document.getElementById('product-image').value;

        // Save back to localStorage
        localStorage.setItem('products', JSON.stringify(products));

        // Close modal
        document.getElementById('product-modal').style.display = "none";

        // Reload products
        loadProducts();

        // Show success message
        alert('Product updated successfully!');
    }
}
