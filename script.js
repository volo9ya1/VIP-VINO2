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
        // Основная картинка (Гранат и Персик)
        image: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/2.png",
        // Вторая картинка для остальных вкусов (замените ссылку на вашу вторую картинку в GitHub, если имя отличается, например images/3.png или images/1.png)
        secondaryImage: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/1.png",
        description: "Фруктовая линейка Nabucco. Креп. 11%, сах. 50г",
        options: [
            "Красное полусладкое ГРАНАТ", 
            "Белое полусладкое ПЕРСИК", 
            "Красное полусладкое ВИШНЯ", 
            "Белое полусладкое МУСКАТ",
            "Розовое полусладкое КЛУБНИКА"
        ]
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
        description: "Газированное розовое сухое вино. 11% 0.75 л.",
        options: null
    }
];

let cart = JSON.parse(localStorage.getItem('vip_vino_cart')) || [];
let orderHistory = JSON.parse(localStorage.getItem('vip_vino_history')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initCatalog();
    updateCartUI();
    setupCartModal();
});

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
                    <label style="font-size: 0.85rem; color: var(--wine-color); display: block; margin-bottom: 3px;">Выберите вариант:</label>
                    <select id="option-${product.id}" onchange="changeProductImage(${product.id})" style="width: 100%; padding: 6px; border-radius: 6px; border: 1px solid var(--gold-color); background: rgba(255,253,228,0.8); font-family: 'Roboto', sans-serif;">
                        ${product.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        card.innerHTML = `
            <img id="img-${product.id}" src="${product.image}" alt="${product.name}" class="product-img" style="width: 100%; height: 220px; object-fit: contain; background: rgba(255,255,255,0.3); border-radius: 8px; margin-bottom: 10px; border: 1px solid var(--gold-color);">
            <h3 style="font-family: 'Playfair Display', serif; color: var(--wine-color); font-size: 1.2rem; margin-bottom: 5px;">${product.name}</h3>
            <p style="font-size: 0.85rem; color: #555; margin-bottom: 10px; min-height: 35px;">${product.description}</p>
            ${optionsHTML}
            <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px;">
                <span style="font-weight: bold; color: var(--wine-color); font-size: 1.1rem;">${product.price.toLocaleString()} сум</span>
                <button onclick="addToCart(${product.id})" class="btn-primary" style="padding: 6px 12px; font-size: 0.9rem;">В корзину</button>
            </div>
        `;

        catalogContainer.appendChild(card);
    });
}

// Функция автоматической смены картинки при выборе вкуса
function changeProductImage(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product || !product.secondaryImage) return;

    const selectElement = document.getElementById(`option-${productId}`);
    const imgElement = document.getElementById(`img-${productId}`);
    if (!selectElement || !imgElement) return;

    const selectedValue = selectElement.value;

    // Если выбраны первые два вкуса (Гранат или Персик) — показываем первую картинку, иначе вторую
    if (selectedValue.includes("ГРАНАТ") || selectedValue.includes("ПЕРСИК")) {
        imgElement.src = product.image;
    } else {
        imgElement.src = product.secondaryImage;
    }
}

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
    showNotification(`Товар "${product.name}"${selectedOption ? ' (' + selectedOption + ')' : ''} добавлен в корзину!`);
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
            cartItemsList.innerHTML = '<p style="text-align: center; color: #666;">Корзина пуста</p>';
        } else {
            cartItemsList.innerHTML = cart.map((item, index) => `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid rgba(114,47,55,0.1); padding-bottom: 8px;">
                    <div>
                        <strong>${item.name}</strong> ${item.selectedOption ? '<br><small style="color: #666;">Вариант: ' + item.selectedOption + '</small>' : ''}
                        <div style="font-size: 0.85rem; color: #555;">${item.price.toLocaleString()} сум x ${item.quantity}</div>
                    </div>
                    <div>
                        <button onclick="changeQuantity(${index}, 1)" style="padding: 2px 8px; background: var(--gold-color); border: none; border-radius: 4px; cursor: pointer;">+</button>
                        <span style="margin: 0 5px;">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, -1)" style="padding: 2px 8px; background: var(--gold-color); border: none; border-radius: 4px; cursor: pointer;">-</button>
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

function setupCartModal() {
    const modal = document.getElementById('cartModal');
    const trigger = document.getElementById('cartTrigger');
    const closeBtn = document.getElementById('closeCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (trigger && modal) {
        trigger.addEventListener('click', () => {
            modal.classList.remove('hidden-content');
            renderOrderHistory();
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.classList.add('hidden-content');
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                alert('Ваша корзина пуста!');
                return;
            }

            const storeNameInput = document.getElementById('storeNameInput');
            const storeName = storeNameInput ? storeNameInput.value.trim() : '';

            if (!storeName) {
                alert('Пожалуйста, введите название магазина или торговой точки!');
                if (storeNameInput) storeNameInput.focus();
                return;
            }

            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const orderRecord = {
                date: new Date().toLocaleString(),
                store: storeName,
                items: [...cart],
                total: totalPrice
            };

            orderHistory.unshift(orderRecord);
            localStorage.setItem('vip_vino_history', JSON.stringify(orderHistory));

            cart = [];
            saveCart();
            updateCartUI();
            if (storeNameInput) storeNameInput.value = '';

            alert('Заказ успешно оформлен! Спасибо.');
            modal.classList.add('hidden-content');
        });
    }
}

function renderOrderHistory() {
    const historyList = document.getElementById('orderHistoryList');
    if (!historyList) return;

    if (orderHistory.length === 0) {
        historyList.innerHTML = '<p style="color: #666;">История заказов пуста</p>';
        return;
    }

    historyList.innerHTML = orderHistory.map(order => `
        <div style="background: rgba(255,253,228,0.5); padding: 8px; border-radius: 6px; margin-bottom: 8px; border: 1px solid rgba(212,175,55,0.4);">
            <div style="font-weight: bold; color: var(--wine-color);">Магазин: ${order.store} (${order.date})</div>
            <div style="font-size: 0.8rem; color: #555;">Итого: ${order.total.toLocaleString()} сум</div>
        </div>
    `).join('');
}

function showNotification(text) {
    const notif = document.createElement('div');
    notif.textContent = text;
    notif.style.position = 'fixed';
    notif.style.bottom = '20px';
    notif.style.right = '20px';
    notif.style.background = 'var(--wine-color)';
    notif.style.color = 'var(--gold-color)';
    notif.style.padding = '10px 20px';
    notif.style.borderRadius = '8px';
    notif.style.border = '1px solid var(--gold-color)';
    notif.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    notif.style.zIndex = '1000';
    notif.style.fontFamily = 'Roboto, sans-serif';
    notif.style.fontSize = '0.9rem';

    document.body.appendChild(notif);
    setTimeout(() => {
        notif.remove();
    }, 2500);
}
