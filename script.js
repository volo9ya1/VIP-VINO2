/* --- Цветовая палитра и переменные --- */
:root {
    --wine-color: #5c1d24;
    --wine-dark: #3a1015;
    --gold-color: #d4af37;
    --gold-light: #f3e5ab;
    --bg-color: #faf6f0;
    --text-color: #2c2c2c;
}

* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

body {
    font-family: 'Roboto', sans-serif;
    background-color: var(--bg-color);
    color: var(--text-color);
    line-height: 1.6;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

header {
    background: var(--wine-dark);
    color: var(--gold-color);
    padding: 15px 20px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.2);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.logo {
    font-family: 'Playfair Display', serif;
    font-size: 1.5rem;
    color: var(--gold-color);
    text-decoration: none;
    letter-spacing: 1px;
}

nav a {
    color: #fff;
    text-decoration: none;
    margin-left: 20px;
    font-size: 0.95rem;
    transition: color 0.3s ease;
}

nav a:hover, nav a.active {
    color: var(--gold-color);
}

main {
    flex: 1;
    max-width: 1200px;
    margin: 0 auto;
    padding: 30px 20px;
    width: 100%;
}

.btn-primary {
    background: linear-gradient(135deg, var(--gold-color), #b8860b);
    color: var(--wine-dark);
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    cursor: pointer;
    font-weight: bold;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
}

/* --- Сетка каталога --- */
.catalog-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 25px;
    margin-top: 20px;
}

/* --- Надежные и аккуратные карточки товаров (без багов верстки) --- */
.product-card {
    background: rgba(255, 253, 228, 0.95);
    border: 1px solid var(--gold-color);
    border-radius: 12px;
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(92, 29, 36, 0.15);
}

.card-image-container {
    width: 100%;
    height: 160px;
    background: rgba(255,255,255,0.5);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 12px;
    border: 1px solid rgba(212, 175, 55, 0.3);
    overflow: hidden;
}

.card-image-container img {
    max-height: 100%;
    max-width: 100%;
    object-fit: contain;
}

.product-title {
    font-family: 'Playfair Display', serif;
    color: var(--wine-color);
    font-size: 1.15rem;
    margin-bottom: 5px;
}

.product-desc {
    font-size: 0.85rem;
    color: #555;
    margin-bottom: 10px;
    flex-grow: 1;
}

.product-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(212, 175, 55, 0.2);
}

.product-price {
    font-weight: bold;
    color: var(--wine-color);
    font-size: 1.05rem;
}

/* --- Модальное окно корзины --- */
.modal {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6);
    justify-content: center;
    align-items: center;
    z-index: 2000;
    backdrop-filter: blur(3px);
}

.modal-content {
    background: var(--bg-color);
    padding: 30px;
    border-radius: 12px;
    width: 100%;
    max-width: 500px;
    border: 2px solid var(--gold-color);
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    max-height: 90vh;
    overflow-y: auto;
}

/* --- Плавающая кнопка корзины --- */
.cart-floating-btn {
    position: fixed;
    bottom: 25px;
    right: 25px;
    background: var(--wine-color);
    color: var(--gold-color);
    border: 2px solid var(--gold-color);
    padding: 12px 20px;
    border-radius: 50px;
    cursor: pointer;
    font-weight: bold;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    z-index: 1500;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.3s;
}

.cart-floating-btn:hover {
    background: var(--wine-dark);
}

footer {
    background: var(--wine-dark);
    color: var(--gold-light);
    text-align: center;
    padding: 20px;
    font-size: 0.9rem;
    margin-top: auto;
}

@media (max-width: 768px) {
    .header-container {
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }
    nav {
        display: flex;
        gap: 15px;
    }
    nav a {
        margin-left: 0;
    }
    .catalog-grid {
        grid-template-columns: 1fr;
    }
}
