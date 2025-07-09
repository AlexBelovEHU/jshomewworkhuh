import { IProduct } from "./types"

const truncateDescription = (text: string, maxLength: number = 80): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export const productCard = (product: IProduct) => {
  const card = document.createElement('div');
  card.className = 'group relative bg-white p-8 border-3 border-solid product';
  card.setAttribute('data-product-id', product.id.toString());

  const image = document.createElement('img');
  image.className = 'aspect-square w-full rounded-md bg-white-200 object-contain group-hover:opacity-75 lg:aspect-auto lg:h-80';
  image.src = product.image;
  image.alt = product.title;

  const infoWrapper = document.createElement('div');
  infoWrapper.className = 'mt-4 flex flex-col gap-1';

  const title = document.createElement('h3');
  title.className = 'text-sm font-semibold text-gray-900';
  title.textContent = product.title;

  const category = document.createElement('p');
  category.className = 'text-sm text-gray-500';
  category.textContent = product.category;

  const description = document.createElement('p');
  description.className = 'text-sm text-gray-600';
  description.textContent = truncateDescription(product.description);
  description.setAttribute('title', product.description);

  const price = document.createElement('p');
  price.className = 'text-sm font-medium text-gray-900';
  price.textContent = `$${product.price.toFixed(2)}`;

  infoWrapper.appendChild(title);
  infoWrapper.appendChild(category);
  infoWrapper.appendChild(description);
  infoWrapper.appendChild(price);

  card.appendChild(image);
  card.appendChild(infoWrapper);

  return card;
}
