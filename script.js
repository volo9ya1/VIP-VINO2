// --- БАЗА ДАННЫХ ТОВАРОВ ---
const productsData = [
    {
        id: 1,
        name: "Classico",
        category: "wine",
        price: 47040,
        image: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/4.png",
        description: "Итальянское вино. Креп. 12%",
        options: ["Красное сухое", "Белое сухое"]
    },
    {
        id: 2,
        name: "Tradizione",
        category: "wine",
        price: 47040,
        image: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/5.png",
        description: "Традиционное вино. Креп. 11%, сах. 25г",
        options: ["Красное полусухое", "Белое полусухое"]
    },
    {
        id: 3,
        name: "Incontro",
        category: "wine",
        price: 47040,
        image: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/6.png",
        secondaryImage: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/7.png",
        description: "Гармоничное вино. Креп. 10.5%, сах. 50г",
        options: ["Красное полусладкое", "Белое полусладкое", "Розовое полусладкое"]
    },
    {
        id: 4,
        name: "Emozioni",
        category: "wine",
        price: 47040,
        image: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/8.png",
        description: "Яркие эмоции. Креп. 10.5%, сах. 80г",
        options: ["Красное полусладкое", "Белое полусладкое"]
    },
    {
        id: 5,
        name: "Nabucco",
        category: "wine",
        price: 47040,
        image: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/2.png", 
        imageCherry: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/3.png",
        imageMuscat: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/3.png",
        imageStrawberry: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/1.png",
        description: "Фруктовая линейка Nabucco. Креп. 11%",
        options: [
            "Красное полусладкое ГРАНАТ", 
            "Белое полусладкое ПЕРСИК", 
            "Красное полусладкое ВИШНЯ", 
            "Белое сухое МУСКАТ",
            "Розовое сухое КЛУБНИКА"
        ]
    },
    {
        id: 6,
        name: "De Sde Mona",
        category: "wine",
        price: 47040,
        image: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/9.png",
        description: "Итальянское вино De Sde Mona. Креп. 11.5%",
        options: ["Красное сухое", "Белое сухое"]
    },
    {
        id: 7,
        name: "Buonsecco ASTI",
        category: "sparkling",
        price: 54880,
        image: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/10.png",
        description: "Шампанское полусладкое. 11% 0.75 л.",
        options: null
    },
    {
        id: 8,
        name: "Buonsecco Розовое",
        category: "sparkling",
        price: 38080,
        image: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/10.png",
        description: "Розовое сухое вино. 11% 0.75 л.",
        options: null
    }
];

// Состояние корзины и истории
let cart = JSON.parse(localStorage.getItem('vip_vino_cart')) || [];
let orderHistory = JSON.parse(localStorage.getItem('vip_vino_history')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initCatalog();
    updateCartUI();
    setupCartModal();
});

// --- ОТРИСОВКА КАТАЛОГА ---
function initCatalog() {
    const catalogContainer = document.getElementById('catalogContainer');
    if (!catalogContainer) return;

    catalogContainer.innerHTML = '';

    const currentPage = window.location.pathname;
    let filteredProducts = productsData;

    if (currentPage.includes('wine.html')) {
        filteredProducts = productsData.filter(p => p.category === 'wine');
    } else if (currentPage.includes('sparkling.html')) {
        filteredProducts = productsData.filter(p => p.category === 'sparkling');
    }

    filteredProducts.forEach(product => {
        const card = document.createElement('div');
        card.className = 'glass-card product-card';

        let optionsHTML = '';
        if (product.options && product.options.length > 0) {
            optionsHTML = `
                <div style="margin: 10px 0;">
                    <label style="font-size: 0.82rem; color: var(--wine-dark); display: block; margin-bottom: 4px; font-weight: 500;">Выберите вариант:</label>
                    <select id="option-${product.id}" onchange="changeProductImage(${product.id})">
                        ${product.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        card.innerHTML = `
            <img id="img-${product.id}" src="${product.image}" alt="${product.name}" class="product-img">
            <h3>${product.name}</h3>
            <p>${product.description}</p>
            ${optionsHTML}
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                <span style="font-weight: 700; color: var(--wine-dark); font-size: 1.15rem;">${product.price.toLocaleString()} сум</span>
                <button onclick="addToCart(${product.id})" class="btn-primary">В корзину</button>
            </div>
        `;

        catalogContainer.appendChild(card);
    });
}

// --- СМЕНА КАРТИНКИ ---
function changeProductImage(productId) {
    const select = document.getElementById(`option-${productId}`);
    const img = document.getElementById(`img-${productId}`);
    if (!select || !img) return;

    const val = select.value;

    if (productId === 5) {
        if (val === "Красное полусладкое ВИШНЯ" || val === "Белое сухое МУСКАТ") {
            img.src = "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/3.png";
        } else if (val === "Розовое сухое КЛУБНИКА") {
            img.src = "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/1.png";
        } else {
            // ГРАНАТ и ПЕРСИК
            img.src = "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/2.png";
        }
    } else if (productId === 3) {
        if (val === "Розовое полусладкое") {
            img.src = "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/7.png";
        } else {
            img.src = "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/6.png";
        }
    }
}

// --- КОРЗИНА ---
function addToCart(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    let selectedOption = null;
    if (product.options && product.options.length > 0) {
        const selectElement = document.getElementById(`option-${productId}`);
        if (selectElement) {
            selectedOption = selectElement.value;
        }
    }

    const existingIndex = cart.findIndex(item => item.id === productId && item.selectedOption === selectedOption);

    if (existingIndex > -1) {
        cart[existingIndex].quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            selectedOption: selectedOption,
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showNotification(`Добавлено: ${product.name}${selectedOption ? ' (' + selectedOption + ')' : ''}`);
}

function saveCart() {
    localStorage.setItem('vip_vino_cart', JSON.stringify(cart));
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;

    const cartItemsList = document.getElementById('cartItemsList');
    const cartTotalPrice = document.getElementById('cartTotalPrice');

    if (cartItemsList) {
        if (cart.length === 0) {
            cartItemsList.innerHTML = '<p style="text-align: center; color: #777; padding: 10px 0;">Корзина пуста</p>';
        } else {
            cartItemsList.innerHTML = cart.map((item, index) => `
                <div class="cart-item-row">
                    <div>
                        <strong style="color: var(--wine-dark);">${item.name}</strong> 
                        ${item.selectedOption ? `<br><small style="color: #666;">Вариант: ${item.selectedOption}</small>` : ''}
                        <div style="font-size: 0.85rem; color: #555; margin-top: 2px;">${item.price.toLocaleString()} сум × ${item.quantity}</div>
                    </div>
                    <div style="display: flex; align-items: center; gap: 6px;">
                        <button onclick="changeQuantity(${index}, -1)" class="cart-qty-btn">-</button>
                        <span style="font-weight: bold; min-width: 18px; text-align: center;">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)" class="cart-qty-btn">+</button>
                    </div>
                </div>
            `).join('');
        }
    }

    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    if (cartTotalPrice) cartTotalPrice.textContent = totalPrice.toLocaleString();
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveCart();
    updateCartUI();
}

// --- МОДАЛКА И ОФОРМЛЕНИЕ ---
function setupCartModal() {
    const modal = document.getElementById('cartModal');
    const triggers = document.querySelectorAll('#cartTrigger, .floating-cart-btn');
    const closeBtn = document.getElementById('closeCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            if (modal) {
                modal.classList.remove('hidden-content');
                renderOrderHistory();
            }
        });
    });

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden-content');
        });
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.add('hidden-content');
            }
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Ваша корзина пуста!');
                return;
            }

            const storeNameInput = document.getElementById('storeNameInput');
            const userPhoneInput = document.getElementById('userPhone');

            const storeName = storeNameInput ? storeNameInput.value.trim() : '';
            const userPhone = userPhoneInput ? userPhoneInput.value.trim() : '';

            if (!storeName) {
                alert('Пожалуйста, введите название магазина!');
                if (storeNameInput) storeNameInput.focus();
                return;
            }

            if (!userPhone) {
                alert('Пожалуйста, введите ваш номер телефона!');
                if (userPhoneInput) userPhoneInput.focus();
                return;
            }

            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const orderRecord = {
                id: Date.now(),
                date: new Date().toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                store: storeName,
                phone: userPhone,
                items: JSON.parse(JSON.stringify(cart)),
                total: totalPrice
            };

            orderHistory.unshift(orderRecord);
            localStorage.setItem('vip_vino_history', JSON.stringify(orderHistory));

            cart = [];
            saveCart();
            updateCartUI();
            if (storeNameInput) storeNameInput.value = '';

            alert('Заказ успешно оформлен!');
            modal.classList.add('hidden-content');
        });
    }
}

function renderOrderHistory() {
    const historyList = document.getElementById('orderHistoryList');
    if (!historyList) return;

    if (orderHistory.length === 0) {
        historyList.innerHTML = '<p style="color: #777; font-size: 0.85rem; text-align: center;">История заказов пуста</p>';
        return;
    }

    historyList.innerHTML = orderHistory.map(order => {
        const itemsDetail = order.items.map(i => 
            `• <strong>${i.name}</strong>${i.selectedOption ? ' (' + i.selectedOption + ')' : ''} — ${i.quantity} шт.`
        ).join('<br>');

        return `
            <div class="history-card">
                <div class="history-card-header">
                    <span><strong>Магазин:</strong> ${order.store}</span>
                    <small style="color: #666;">${order.date}</small>
                </div>
                <div class="history-card-items">
                    ${itemsDetail}
                </div>
                <div class="history-card-total">
                    Итого: <strong>${order.total.toLocaleString()} сум</strong>
                </div>
            </div>
        `;
    }).join('');
}

function showNotification(text) {
    const notif = document.createElement('div');
    notif.textContent = text;
    notif.className = 'toast-notification';
    document.body.appendChild(notif);
    setTimeout(() => {
        notif.remove();
    }, 2500);
}
