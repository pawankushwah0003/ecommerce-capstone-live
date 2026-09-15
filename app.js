const API_URL = 'https://fakestoreapi.com/products';
let products = [];
let cart = JSON.parse(localStorage.getItem('capstone_cart')) || [];
let isLoggedIn = localStorage.getItem('capstone_user') === 'true';

const container = document.getElementById('product-container');
const searchInput = document.getElementById('search-input');
const categorySelect = document.getElementById('category-select');
const authBtn = document.getElementById('auth-btn');
const userStatus = document.getElementById('user-status');
const cartCount = document.getElementById('cart-count');

async function init() {
    updateAuthUI();
    updateCartUI();
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch products');
        products = await res.json();
        populateCategories();
        renderProducts(products);
    } catch (err) {
        container.innerHTML = `<p class="error">Error loading data: ${err.message}</p>`;
    }
}

function renderProducts(items) {
    if (items.length === 0) {
        container.innerHTML = '<p>No products found.</p>';
        return;
    }
    container.innerHTML = items.map(p => `
        <div class="card">
            <img src="${p.image}" alt="${p.title}">
            <h4>${p.title.substring(0, 25)}...</h4>
            <p><strong>$${p.price}</strong></p>
            <button onclick="addToCart(${p.id})">Add to Cart</button>
        </div>
    `).join('');
}

function populateCategories() {
    const categories = ['all', ...new Set(products.map(p => p.category))];
    categorySelect.innerHTML = categories.map(c => `<option value="${c}">${c.toUpperCase()}</option>`).join('');
}

function filterProducts() {
    const query = searchInput.value.toLowerCase();
    const category = categorySelect.value;
    const filtered = products.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(query);
        const matchesCategory = category === 'all' || p.category === category;
        return matchesSearch && matchesCategory;
    });
    renderProducts(filtered);
}

window.addToCart = function(id) {
    cart.push(id);
    localStorage.setItem('capstone_cart', JSON.stringify(cart));
    updateCartUI();
};

function updateCartUI() {
    cartCount.innerText = cart.length;
}

function updateAuthUI() {
    userStatus.innerText = isLoggedIn ? 'Logged In (Demo User)' : 'Logged out';
    authBtn.innerText = isLoggedIn ? 'Logout' : 'Login';
}

authBtn.addEventListener('click', () => {
    isLoggedIn = !isLoggedIn;
    localStorage.setItem('capstone_user', isLoggedIn);
    updateAuthUI();
});

searchInput.addEventListener('input', filterProducts);
categorySelect.addEventListener('change', filterProducts);

init();