// data.js - локальное хранилище JSON для продуктов и заказов

const STORAGE_KEY_PRODUCTS = 'miniShopProducts';
const STORAGE_KEY_ORDERS = 'miniShopOrders';

// Получение данных из localStorage
function loadProducts() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_PRODUCTS)) || [];
}

function loadOrders() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY_ORDERS)) || [];
}

// Сохранение данных в localStorage
function saveProducts(products) {
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
}

function saveOrders(orders) {
    localStorage.setItem(STORAGE_KEY_ORDERS, JSON.stringify(orders));
}

// Добавление нового продукта
function addProduct(product) {
    const products = loadProducts();
    product.id = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    products.push(product);
    saveProducts(products);
}

// Удаление продукта
function deleteProduct(productId) {
    let products = loadProducts();
    products = products.filter(p => p.id !== productId);
    saveProducts(products);
}

// Добавление заказа
function addOrder(order) {
    const orders = loadOrders();
    order.id = orders.length > 0 ? Math.max(...orders.map(o => o.id)) + 1 : 1;
    order.date = new Date().toISOString();
    orders.push(order);
    saveOrders(orders);
}

// Экспорт данных в JSON-файл
function exportData() {
    const data = {
        products: loadProducts(),
        orders: loadOrders()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'miniShopData.json';
    link.click();
}

// Импорт данных из JSON-файла
function importData(file) {
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const data = JSON.parse(event.target.result);
            if (data.products) saveProducts(data.products);
            if (data.orders) saveOrders(data.orders);
            alert('Данные успешно импортированы!');
            location.reload(); // Перезагрузка страницы для обновления
        } catch (error) {
            alert('Ошибка при импорте данных: неверный формат файла');
        }
    };
    reader.readAsText(file);
}

// Инициализация тестовых данных, если localStorage пуст
if (!localStorage.getItem(STORAGE_KEY_PRODUCTS)) {
    saveProducts([
        { id: 1, name: 'Laptop', category: 'electronics', price: 999.99, stock: 10, image: 'laptop.jpg', status: 'active' },
        { id: 2, name: 'T-Shirt', category: 'clothing', price: 19.99, stock: 50, image: 'tshirt.jpg', status: 'active' }
    ]);
}

if (!localStorage.getItem(STORAGE_KEY_ORDERS)) {
    saveOrders([]);
}