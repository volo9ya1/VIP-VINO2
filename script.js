// --- Данные товаров ---
const productsData = [
    {
        id: 1,
        category: 'sparkling',
        name: 'Buonsecco ASTI',
        description: 'Шампанское полусладкое. 11% 0.75 л.',
        price: 54880,
        image: 'images/ast.jpg' // замените на ваш путь к картинке
    },
    {
        id: 2,
        category: 'wine',
        name: 'Chianti Classico',
        description: 'Вино красное сухое. 13.5% 0.75 л.',
        price: 125000,
        image: 'images/chianti.jpg'
    },
    {
        id: 3,
        category: 'sparkling',
        name: 'Prosecco Superiore',
        description: 'Иристое сухое вино. 11.5% 0.75 л.',
        price: 89000,
        image: 'images/prosecco.jpg',
        options: ['0.75 л (Бутылка)', '1.5 л (Магнум)'] // Пример товара с вариантами
    }
];

// --- Корзина (хранится в памяти сессии) ---
let cart = [];

// --- Инициализация при загрузке страницы ---
document.addEventListener('DOMContentLoaded', () => {
    initCatalog();
    renderCartBadge();
    
    // Создаем плавающую кнопку корзины, если её еще нет в HTML
    if (!document.querySelector('.cart-floating-btn')) {
        const floatBtn = document.createElement('button');
        floatBtn.className = 'cart-floating-btn';
        floatBtn.innerHTML = '🛒 Корзина <span id="cartCountBadge" style="background:#fff; color:var(--wine-dark); padding:2px 6px; border-radius:50%; font-size:0.75rem;">0</span>';
        floatBtn.onclick = openCartModal;
        document.body.appendChild(floatBtn);
    }
    
    // Создаем модальное окно корзины в DOM, если его нет
    if (!document.getElementById('cartModal')) {
        const modalDiv = document.createElement('div');
        modalDiv.id = 'cartModal';
        modalDiv.className = 'modal';
        modalDiv.innerHTML = `
            <div class="modal-content">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="font-family: 'Playfair Display', serif; color: var(--wine-color);">Ваша корзина</h2>
                    <button onclick="closeCartModal()" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--wine-color);">×</button>
                </div>
                <div id="cartItemsContainer">
                    <!-- Список товаров будет здесь -->
                </div>
                <div style="margin-top: 20px; border-top: 1px solid var(--gold-color); padding-top: 15px; display: flex; justify-content: space-between; align-items: center;">
                    <strong style="font-size: 1.1rem;">Итого:</strong>
                    <span id="cartTotalPrice" style="font-size: 1.2rem; font-weight: bold; color: var(--wine-color);">0 сум</span>
                </div>
                <button onclick="checkout()" class="btn-primary" style="width: 100%; margin-top: 20px; padding: 12px; font-size: 1rem;">Оформить заказ</button>
            </div>
        `;
        document.body.appendChild(modalDiv);
    }
});

// --- Отрисовка каталога товаров ---
function initCatalog() {
    const catalogContainer = document.getElementById('catalogContainer');
    if (!catalogContainer) return;

    catalogContainer.innerHTML = '';

    const currentPage = window.location.pathname;
    let filteredProducts = productsData;

    // Фильтрация в зависимости от страницы
    if (currentPage.includes('wine.html')) {
        filteredProducts = productsData.filter(p => p.category === 'wine');
    } else if (currentPage.includes('sparkling.html')) {
        filteredProducts = productsData.filter(p => p.category === 'sparkling');
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'product-card';

        // Генерация селекта с вариантами (если они есть у товара)
        let optionsHTML = '';
        if (product.options && product.options.length > 0) {
            optionsHTML = `
                <div style="margin: 8px 0;">
                    <label style="font-size: 0.8rem; color: var(--wine-color); display: block; margin-bottom: 2px;">Вариант:</label>
                    <select id="option-${product.id}" style="width: 100%; padding: 6px; border-radius: 6px; border: 1px solid var(--gold-color); background: #fff; font-size: 0.85rem;">
                        ${product.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        card.innerHTML = `
            <div>
                <div class="card-image-container">
                    <img id="img-${product.id}" src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/150?text=VIP+VINO'">
                </div>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-desc">${product.description}</p>
                ${optionsHTML}
            </div>
            <div>
                <div class="product-footer">
                    <span class="product-price">${product.price.toLocaleString()} сум</span>
                    <button onclick="addToCart(event, ${product.id})" class="btn-primary" style="padding: 6px 14px; font-size: 0.85rem;">В корзину</button>
                </div>
            </div>
        `;

        catalogContainer.appendChild(card);
    });
}

// --- Добавление товара в корзину ---
function addToCart(event, productId) {
    event.stopPropagation();
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    // Проверяем выбранный вариант (если есть селект)
    let selectedOption = '';
    const selectElem = document.getElementById(`option-${productId}`);
    if (selectElem) {
        selectedOption = selectElem.value;
    }

    // Ищем, есть ли уже такой товар с таким же вариантом в корзине
    const existingItem = cart.find(item => item.id === productId && item.option === selectedOption);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            option: selectedOption,
            quantity: 1
        });
    }

    renderCartBadge();
    
    // Легкая анимация подтверждения добавления
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = '✓ Добавлено';
    btn.style.background = '#2e7d32';
    btn.style.color = '#fff';
    setTimeout(() => {
        btn.innerText = originalText;
        btn.style.background = '';
        btn.style.color = '';
    }, 1000);
}

// --- Обновление значка количества товаров ---
function renderCartBadge() {
    const badge = document.getElementById('cartCountBadge');
    if (badge) {
        const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.innerText = totalCount;
    }
}

// --- Управление модальным окном корзины ---
function openCartModal() {
    const modal = document.getElementById('cartModal');
    if (!modal) return;

    renderCartItems();
    modal.style.display = 'flex';
}

function closeCartModal() {
    const modal = document.getElementById('cartModal');
    if (modal) modal.style.display = 'none';
}

// Закрытие по клику вне модального окна
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target === modal) {
        closeCartModal();
    }
};

// --- Отрисовка содержимого корзины ---
function renderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    const totalPriceElem = document.getElementById('cartTotalPrice');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #666; padding: 20px 0;">Ваша корзина пуста</p>';
        if (totalPriceElem) totalPriceElem.innerText = '0 сум';
        return;
    }

    let html = '';
    let totalSum = 0;

    cart.forEach((item, index) => {
        const itemSum = item.price * item.quantity;
        totalSum += itemSum;

        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid rgba(0,0,0,0.05); padding-bottom: 8px;">
                <div>
                    <h4 style="font-size: 0.95rem; color: var(--wine-color);">${item.name}</h4>
                    ${item.option ? `<small style="color: #666;">${item.option}</small>` : ''}
                    <div style="font-size: 0.85rem; color: #555; margin-top: 2px;">${item.price.toLocaleString()} сум × ${item.quantity}</div>
                </div>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <button onclick="changeQuantity(${index}, -1)" style="background: #ddd; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-weight: bold;">-</button>
                    <span style="font-size: 0.9rem; font-weight: bold;">${item.quantity}</span>
                    <button onclick="changeQuantity(${index}, 1)" style="background: #ddd; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-weight: bold;">+</button>
                    <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #c62828; cursor: pointer; font-size: 1.1rem; margin-left: 5px;" title="Удалить">🗑</button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
    if (totalPriceElem) totalPriceElem.innerText = totalSum.toLocaleString() + ' сум';
}

// --- Изменение количества / удаление позиций в корзине ---
function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    renderCartItems();
    renderCartBadge();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    renderCartItems();
    renderCartBadge();
}

// --- Оформление заказа ---
function checkout() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    alert('Спасибо за заказ! В ближайшее время с вами свяжется менеджер для подтверждения.');
    cart = [];
    renderCartItems();
    renderCartBadge();
    closeCartModal();
}
