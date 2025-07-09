import type { IProduct } from './types';
import { cardsListRender } from './renderCardsList';

export const addEventListenersToProducts = () => {
    const productList = document.getElementById('product_list');
    if (!productList) return;

    productList.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const button = target.closest('.product') as HTMLElement | null;
        if (!button) return;

        const idStr = button.getAttribute('data-product-id');
        if (!idStr) return;

        const id = parseInt(idStr, 10);
        if (isNaN(id)) return;

        productPageRender(id);
    });
};

const productPageRender = (id: number) => {
    const stored: IProduct[] = JSON.parse(sessionStorage.getItem('products') || '[]');
    const product = stored.find(p => p.id === id);

    if (!product) {
        console.warn('Product not found with id:', id);
        return;
    }

    document.getElementById('product_list')?.remove();
    document.getElementById('product_detail')?.remove();

    const detailContainer = document.createElement('div');
    detailContainer.id = 'product_detail';
    detailContainer.className = 'p-8';
    document.body.appendChild(detailContainer);

    const card = productPage(product);
    detailContainer.appendChild(card);
};


const productPage = (product: IProduct) => {
    const card = document.createElement('div');
    card.className = 'group relative bg-transparent border-3 border-solid border-gray-300 dark:border-gray-700';

    const wrapper = document.createElement('div');
    wrapper.className = 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8';

    const flexWrapper = document.createElement('div');
    flexWrapper.className = 'flex flex-col md:flex-row -mx-4';

    // Back button
    const backButtonWrapper = document.createElement('div');
    backButtonWrapper.className = 'absolute top-4 left-4';
    const backButton = document.createElement('button');
    backButton.className = 'flex items-center px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-full hover:bg-gray-800 transition';
    backButton.id = 'back-button';
    backButton.textContent = 'Back';
    backButton.addEventListener('click', () => {
        document.getElementById('product_detail')?.remove();
        cardsListRender();
        addEventListenersToProducts();
    });
    backButtonWrapper.appendChild(backButton);

    // Left section
    const leftSection = document.createElement('div');
    leftSection.className = 'md:flex-1 px-4';

    const imageWrapper = document.createElement('div');
    imageWrapper.className = 'max-h-[460px] overflow-hidden flex items-center justify-center bg-transparent mb-4 rounded-lg';

    const image = document.createElement('img');
    image.className = 'max-h-[460px] w-auto object-contain';
    image.src = product.image;
    image.alt = product.title;

    imageWrapper.appendChild(image);

    const buttonWrapper = document.createElement('div');
    buttonWrapper.className = 'flex -mx-2 mb-4';

    const createButton = (text: string, classes: string) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'w-1/2 px-2';
        const btn = document.createElement('button');
        btn.className = `w-full ${classes}`;
        btn.textContent = text;
        wrapper.appendChild(btn);
        return wrapper;
    };

    buttonWrapper.appendChild(createButton(
        'Add to Cart',
        'bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700'
    ));
    buttonWrapper.appendChild(createButton(
        'Add to Wishlist',
        'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-2 px-4 rounded-full font-bold hover:bg-gray-300 dark:hover:bg-gray-600'
    ));

    leftSection.appendChild(imageWrapper);
    leftSection.appendChild(buttonWrapper);

    // Right section
    const rightSection = document.createElement('div');
    rightSection.className = 'md:flex-1 px-4';

    const title = document.createElement('h2');
    title.className = 'text-2xl font-bold text-gray-800 dark:text-white mb-2';
    title.textContent = product.title;

    const description = document.createElement('p');
    description.className = 'text-gray-600 dark:text-gray-300 text-sm mb-4';
    description.textContent = product.description;

    const priceWrapper = document.createElement('div');
    priceWrapper.className = 'flex mb-4';

    const price = document.createElement('div');
    price.className = 'mr-4';
    price.innerHTML = `<span class="font-bold text-gray-700 dark:text-gray-300 mr-1">Price:</span><span class="text-gray-600 dark:text-gray-300">$${product.price.toFixed(2)}</span>`;

    const availability = document.createElement('div');
    availability.innerHTML = `<span class="font-bold text-gray-700 dark:text-gray-300 mr-1">Availability:</span><span class="text-gray-600 dark:text-gray-300">In Stock</span>`;

    priceWrapper.appendChild(price);
    priceWrapper.appendChild(availability);

    const colorWrapper = document.createElement('div');
    colorWrapper.className = 'mb-4';
    colorWrapper.innerHTML = `<span class="font-bold text-gray-700 dark:text-gray-300">Select Color:</span>`;

    const colorButtonsWrapper = document.createElement('div');
    colorButtonsWrapper.className = 'flex items-center mt-2';
    ['gray', 'red', 'blue', 'yellow'].forEach(color => {
        const btn = document.createElement('button');
        btn.className = 'w-6 h-6 rounded-full mr-2';
        btn.style.backgroundColor = color;
        colorButtonsWrapper.appendChild(btn);
    });
    colorWrapper.appendChild(colorButtonsWrapper);

    const sizeWrapper = document.createElement('div');
    sizeWrapper.className = 'mb-4';
    if (product.size) {
        sizeWrapper.innerHTML = `<span class="font-bold text-gray-700 dark:text-gray-300">Select Size:</span>`;
        const sizeButtonsWrapper = document.createElement('div');
        sizeButtonsWrapper.className = 'flex items-center mt-2';
        ['S', 'M', 'L', 'XL', 'XXL'].forEach(size => {
            const btn = document.createElement('button');
            btn.className = 'bg-gray-300 dark:bg-gray-700 text-gray-700 dark:text-white py-2 px-4 font-bold mr-2 hover:bg-gray-400 dark:hover:bg-gray-600';
            btn.textContent = size;
            sizeButtonsWrapper.appendChild(btn);
        });
        sizeWrapper.appendChild(sizeButtonsWrapper);
    }

    rightSection.appendChild(title);
    rightSection.appendChild(description);
    rightSection.appendChild(priceWrapper);
    rightSection.appendChild(colorWrapper);
    rightSection.appendChild(sizeWrapper);

    flexWrapper.appendChild(backButtonWrapper);
    flexWrapper.appendChild(leftSection);
    flexWrapper.appendChild(rightSection);
    wrapper.appendChild(flexWrapper);
    card.appendChild(wrapper);

    return card;
};
