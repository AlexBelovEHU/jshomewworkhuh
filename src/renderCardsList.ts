import { getProducts } from "./productsApi";
import { productCard } from "./productCard";
import type { IProduct } from "./types";
import {  addEventListenersToProducts } from './productPageRender.ts'

export const cardsListRender = async (options?: { category?: string; ids?: number[] }) => {

  const app = document.getElementById("app");
  if (!app) return;

  const existingList = document.getElementById('product_list');
  if (existingList) existingList.remove();

  const productList = document.createElement("div");
  productList.className = "grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 p-6";
  productList.id = 'product_list';
  app.appendChild(productList);

  let stored = sessionStorage.getItem('products');
  let products: IProduct[] = stored ? JSON.parse(stored) : await getProducts();
  if (!stored) sessionStorage.setItem('products', JSON.stringify(products));

  if (options?.category) {
    products = products.filter(p =>
      p.category?.toLowerCase() === options.category!.toLowerCase()
    );
  }

  if (options?.ids) {
    products = products.filter(p => options.ids!.includes(p.id));
  }

  if (products.length === 0) {
    const msg = document.createElement("p");
    msg.textContent = "No products found.";
    productList.appendChild(msg);
    return;
  }

  products.forEach(product => {
    productList.appendChild(productCard(product));
  });
  addEventListenersToProducts()

};
