// Mock data storage for our mini e-commerce app
// In a real application, this would be stored on a server

// Sample products data
let products = [
    {
        id: 1,
        name: "Smartphone X",
        category: "electronics",
        price: 499.99,
        stock: 50,
        description: "Latest smartphone with high-resolution camera and fast processor.",
        image: "https://placehold.co/300x300?text=Smartphone",
        status: "active",
        salePrice: null
    },
    {
        id: 2,
        name: "Laptop Pro",
        category: "electronics",
        price: 1299.99,
        stock: 20,
        description: "Powerful laptop for professional use with high performance.",
        image: "https://placehold.co/300x300?text=Laptop",
        status: "active",
        salePrice: null
    },
    {
        id: 3,
        name: "Casual T-Shirt",
        category: "clothing",
        price: 24.99,
        stock: 100,
        description: "Comfortable cotton t-shirt for everyday wear.",
        image: "https://placehold.co/300x300?text=T-Shirt",
        status: "active",
        salePrice: null
    },
    {
        id: 4,
        name: "Coffee Maker",
        category: "home",
        price: 89.99,
        stock: 30,
        description: "Automatic coffee maker for brewing delicious coffee at home.",
        image: "https://placehold.co/300x300?text=Coffee+Maker",
        status: "sale",
        salePrice: 69.99
    },
    {
        id: 5,
        name: "Face Moisturizer",
        category: "beauty",
        price: 19.99,
        stock: 45,
        description: "Hydrating face moisturizer for all skin types.",
        image: "https://placehold.co/300x300?text=Moisturizer",
        status: "active",
        salePrice: null
    }
];

// Sample orders data
let orders = [
    {
        id: "ORD-001",
        date: "2025-03-10",
        customer: {
            name: "John Doe",
            email: "john@example.com",
            address: "123 Main St, Anytown, USA"
        },
        items: [
            {
                productId: 1,
                name: "Smartphone X",
                price: 499.99,
                quantity: 1
            },
            {
                productId: 5,
                name: "Face Moisturizer",
                price: 19.99,
                quantity: 2
            }
        ],
        total: 539.97,
        status: "delivered",
        payment: "card"
    },
    {
        id: "ORD-002",
        date: "2025-03-15",
        customer: {
            name: "Jane Smith",
            email: "jane@example.com",
            address: "456 Oak Ave, Sometown, USA"
        },
        items: [
            {
                productId: 3,
                name: "Casual T-Shirt",
                price: 24.99,
                quantity: 3
            }
        ],
        total: 74.97,
        status: "processing",
        payment: "paypal"
    },
    {
        id: "ORD-003",
        date: "2025-03-18",
        customer: {
            name: "Mike Johnson",
            email: "mike@example.com",
            address: "789 Pine St, Othertown, USA"
        },
        items: [
            {
                productId: 2,
                name: "Laptop Pro",
                price: 1299.99,
                quantity: 1
            }
        ],
        total: 1299.99,
        status: "pending",
        payment: "cod"
    }
];

// Admin login credentials (in a real app, this would be stored securely on the server)

// Helper functions for local storage
function saveProducts() {
    localStorage.setItem('products', JSON.stringify(products));
}

function loadProducts() {
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    }
}

function saveOrders() {
    localStorage.setItem('orders', JSON.stringify(orders));
}

function loadOrders() {
    const storedOrders = localStorage.getItem('orders');
    if (storedOrders) {
        orders = JSON.parse(storedOrders);
    }
}

// Load data from localStorage when the script initializes
(function() {
    loadProducts();
    loadOrders();
})();