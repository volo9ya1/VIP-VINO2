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
        imageCherry: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/1.png",
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
        name: "De Sole",
        category: "wine",
        price: 47040,
        image: "https://raw.githubusercontent.com/volo9ya1/VIP-VINO2/main/images/9.png",
        description: "Итальянское вино De Sole. Креп. 11.5%",
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

let cart = JSON.parse(localStorage.getItem('vip_vino_cart')) || [];
let orderHistory = JSON.parse(localStorage.getItem('vip_vino_history')) || [];

document.addEventListener('DOMContentLoaded', () => {
    initCatalog();
    updateCartUI();
    setupCartModal();
});

// Инициализация каталога с поддержкой 3D-переворота карточек
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
        card.className = 'product-card';
        card.style.height = '430px'; // Фиксированная высота для корректного 3D-переворота

        let optionsHTML = '';
        if (product.options && product.options.length > 0) {
            optionsHTML = `
                <div style="margin: 5px 0;" onclick="event.stopPropagation()">
                    <label style="font-size: 0.8rem; color: var(--wine-color); display: block; margin-bottom: 2px;">Вариант:</label>
                    <select id="option-${product.id}" onchange="changeProductImage(event, ${product.id})" style="width: 100%; padding: 5px; border-radius: 6px; border: 1px solid var(--gold-color); background: rgba(255,253,228,0.9); font-size: 0.85rem;">
                        ${product.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="card-inner" onclick="flipCard(event, this)">
                <!-- Лицевая сторона карточки -->
                <div class="card-front">
                    <div>
                        <img id="img-${product.id}" src="${product.image}" alt="${product.name}" style="width: 100%; height: 150px; object-fit: contain; background: rgba(255,255,255,0.4); border-radius: 8px; margin-bottom: 8px; border: 1px solid var(--gold-color);">
                        <h3 style="font-family: 'Playfair Display', serif; color: var(--wine-color); font-size: 1.1rem; margin-bottom: 3px;">${product.name}</h3>
                        <p style="font-size: 0.8rem; color: #555; margin-bottom: 5px; min-height: 30px;">${product.description}</p>
                        ${optionsHTML}
                    </div>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 5px;">
                        <span style="font-weight: bold; color: var(--wine-color); font-size: 1rem;">${product.price.toLocaleString()} сум</span>
                        <button onclick="addToCart(event, ${product.id})" class="btn-primary" style="padding: 6px 12px; font-size: 0.85rem;">В корзину</button>
                    </div>
                    <div style="text-align: center; font-size: 0.75rem; color: #888; margin-top: 4px;">Нажмите для подробного описания ℹ️</div>
                </div>

                <!-- Обратная сторона карточки (подробное описание) -->
                <div class="card-back">
                    <button class="close-flip-btn" onclick="unflipCard(event, this)">&times;</button>
                    <div>
                        <h3 style="font-family: 'Playfair Display', serif; color: var(--gold-color); font-size: 1.15rem; margin-bottom: 8px; border-bottom: 1px solid rgba(212,175,55,0.3); padding-bottom: 4px;">${product.name} — Описание</h3>
                        
                        <!-- ================================================= -->
                        <!-- 📝 МЕТКА ДЛЯ ВАШЕГО ПОДРОБНОГО ОПИСАНИЯ ТОВАРА: -->
                        <p style="font-size: 0.85rem; line-height: 1.4; color: #f5f5f5;">
                            Здесь вы можете написать подробное описание для товара ${product.name}. Расскажите про вкусовые ноты, выдержку и рекомендации к подаче...
                        </p>
                        <!-- ================================================= -->

                    </div>
                    <div style="font-size: 0.75rem; color: var(--gold-color); text-align: center; margin-top: 10px;">VIP VINO Collection</div>
                </div>
            </div>
        `;

        catalogContainer.appendChild(card);
    });
}

// Функции переворота карточки
function flipCard(event, element) {
    if (event.target.tagName === 'SELECT' || event.target.tagName === 'OPTION' || event.target.tagName === 'BUTTON') {
        return;
    }
    const productCard = element.closest('.product-card');
    productCard.classList.add('flipped');
}

function unflipCard(event, buttonElement) {
    event.stopPropagation();
    const productCard = buttonElement.closest('.product-card');
    productCard.classList.remove('flipped');
}

// Смена изображения при выборе варианта в выпадающем списке
function changeProductImage(event, productId) {
    event.stopPropagation();
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    const selectElement = document.getElementById(`option-${productId}`);
    const imgElement = document.getElementById(`img-${productId}`);
    if (!selectElement || !imgElement) return;

    const selectedValue = selectElement.value;

    if (productId === 5) {
        if (selectedValue.includes("ГРАНАТ") || selectedValue.includes("ПЕРСИК")) {
            imgElement.src = product.image;
        } else if (selectedValue.includes("ВИШНЯ")) {
            imgElement.src = product.imageCherry || product.image;
        } else if (selectedValue.includes("МУСКАТ")) {
            imgElement.src = product.imageMuscat || product.image;
        } else if (selectedValue.includes("КЛУБНИКА")) {
            imgElement.src = product.imageStrawberry || product.image;
        }
    } 
    else if (productId === 3) {
        if (selectedValue.includes("Розовое")) {
            imgElement.src = product.secondaryImage || product.image;
        } else {
            imgElement.src = product.image;
        }
    }
}

// Добавление в корзину
function addToCart(event, productId) {
    event.stopPropagation();
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
            variant: selectedOption || 'Стандарт',
            quantity: 1
        });
    }

    saveCart();
    updateCartUI();
    showNotification(`Товар "${product.name}" добавлен в корзину!`);
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
                        <strong>${item.name}</strong> ${item.variant !== 'Стандарт' ? '<br><small style="color: #666;">Вариант: ' + item.variant + '</small>' : ''}
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

// Модальное окно корзины и отправка заказа на сервер Render
function setupCartModal() {
    const modal = document.getElementById('cartModal');
    const trigger = document.getElementById('cartTrigger');
    const closeBtn = document.getElementById('closeCartBtn');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (trigger && modal) {
        trigger.addEventListener('click', () => {
            modal.style.display = 'flex';
            modal.classList.remove('hidden-content');
            renderOrderHistory();
        });
    }

    if (closeBtn && modal) {
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            if (cart.length === 0) {
                alert('Ваша корзина пуста!');
                return;
            }

            const phoneInput = document.getElementById('userPhone').value.trim();
            const locationInput = document.getElementById('userLocation').value.trim();

            if (!phoneInput) {
                alert('⚠️ Пожалуйста, введите номер телефона! Без него заказ не может быть принят.');
                document.getElementById('userPhone').focus();
                return;
            }

            const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            const orderData = {
                items: cart,
                totalPrice: totalPrice,
                location: locationInput,
                phone: phoneInput
            };

            try {
                // ⚠️ Вставьте ниже ссылку на ваш развернутый сервер на Render
                const response = await fetch('https://vip-vino-backend.onrender.com/api/order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(orderData)
                });

                const result = await response.json();

                if (result.success) {
                    const orderRecord = {
                        date: new Date().toLocaleString(),
                        phone: phoneInput,
                        items: [...cart],
                        total: totalPrice
                    };

                    orderHistory.unshift(orderRecord);
                    localStorage.setItem('vip_vino_history', JSON.stringify(orderHistory));

                    cart = [];
                    saveCart();
                    updateCartUI();
                    document.getElementById('userPhone').value = '';
                    if (document.getElementById('userLocation')) document.getElementById('userLocation').value = '';

                    alert('🎉 Заказ успешно оформлен! Уведомление отправлено в Telegram.');
                    modal.style.display = 'none';
                } else {
                    alert('Ошибка: ' + (result.error || 'Не удалось отправить заказ'));
                }
            } catch (err) {
                console.error(err);
                alert('❌ Ошибка соединения с сервером. Убедитесь, что сервер запущен.');
            }
        });
    }
}

function renderOrderHistory() {
    const historyList = document.getElementById('orderHistoryList');
    if (!historyList) return;

    if (orderHistory.length === 0) {
        historyList.innerHTML = '<p style="color: #666; font-size: 0.85rem;">История заказов пуста</p>';
        return;
    }

    historyList.innerHTML = orderHistory.map(order => `
        <div style="background: rgba(255,253,228,0.7); padding: 8px; border-radius: 6px; margin-bottom: 8px; border: 1px solid rgba(212,175,55,0.4);">
            <div style="font-weight: bold; color: var(--wine-color); font-size: 0.85rem;">Телефон: ${order.phone} (${order.date})</div>
            <div style="font-size: 0.8rem; color: #555;">Итого: ${order.total.toLocaleString()} сум</div>
        </div>
    `).join('');
}

function showNotification(text) {
    const notif = document.createElement('div');
    notif.textContent = text;
    notif.style.position = 'fixed';
    notif.style.bottom = '90px';
    notif.style.right = '20px';
    notif.style.background = 'var(--wine-color)';
    notif.style.color = 'var(--gold-color)';
    notif.style.padding = '10px 20px';
    notif.style.borderRadius = '8px';
    notif.style.border = '1px solid var(--gold-color)';
    notif.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
    notif.style.zIndex = '10001';
    notif.style.fontFamily = 'Roboto, sans-serif';
    notif.style.fontSize = '0.9rem';

    document.body.appendChild(notif);
    setTimeout(() => {
        notif.remove();
    }, 2500);
}
