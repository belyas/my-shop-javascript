(function() {
    const cartBtn = document.querySelector('.cart-btn');
    const cartOverlay = document.querySelector('.cart-overlay');
    const cartDOM = document.querySelector('.cart');
    const closeCartBtn = document.querySelector('.close-cart');
    const cartContent = document.querySelector('.cart-content');
    const avaialableProducts = [];
    const cart = { items: [], totalPrice: 0 };

    const formatPrice = (price, currency = '$') => {
        let formattedPrice = price;

        switch (currency) {
            case '$':
                formattedPrice = `${currency}${price}`;
                break;
        }

        return formattedPrice;
    };

    const showCart = () => {
        cartOverlay.classList.add('transparentBcg');
        cartDOM.classList.add('showCart');
    };

    const hideCart = () => {
        cartOverlay.classList.remove('transparentBcg');
        cartDOM.classList.remove('showCart');
    };

    const createNode = (type, classes, content) => {
        const elem = document.createElement(type);
        elem.classList.add(classes);
        elem.innerHTML = content;

        return elem;
    };
    const createCartItemContent = item => formatter => {
        return `<img src="${item.image_url}" alt="${item.title}" />
            <div>
                <h4>${item.title}</h4>
                <h5>${formatter(item.price)}</h5>
                <span class="remove-item" data-id="${item.id}">remove</span>
            </div>
            <div>
                <i class="fas fa-chevron-up" data-id="${item.id}"></i>
                <p class="item-amount">${item.qty}</p>
                <i class="fas fa-chevron-down" data-id="${item.id}"></i>
            </div>`;
    };

    const addItemTocart = itemId => {
        const product = avaialableProducts.filter(prod => prod.id === itemId);
        const itemContent = createCartItemContent(product[0])(formatPrice);
        const itemNode = createNode('div', 'cart-item', itemContent);

        cartContent.appendChild(itemNode);
    };

    const loadProductsFromJson = async () => {
        const result = await fetch('products.json');
        const products = await result.json();

        return products;
    };

    const productGridLayout = product => formatter => {
        return `<article class="product">
            <div class="img-container">
                <img
                    src="${product.image_url}"
                    alt="${product.title}"
                    class="product-img"
                />
                <button class="bag-btn" data-id="${product.id}">
                    <i
                        class="fa fa-shopping-cart"
                        aria-hidden="true"
                    ></i>
                    add to cart
                </button>
            </div>
            <h3>${product.title}</h3>
            <h4>${formatter(product.price)}</h4>
        </article>`;
    };

    const createProductsGrids = loadProductsfunc => async formatter => {
        const productsContainer = document.getElementById('products-container');
        const products = await loadProductsfunc();
        let _html = '';

        products.items.forEach(product => {
            avaialableProducts.push({ ...product, qty: 1 });
            _html += productGridLayout(product)(formatter);
        });

        productsContainer.innerHTML = _html;

        // attach button to click event
        document.querySelectorAll('.bag-btn').forEach(btn =>
            btn.addEventListener('click', function(event) {
                const ItemId = +btn.dataset.id;
                addItemTocart(ItemId);
            })
        );
    };

    // Display products from json file
    createProductsGrids(loadProductsFromJson)(formatPrice);

    cartBtn.addEventListener('click', showCart);
    closeCartBtn.addEventListener('click', hideCart);
})();
