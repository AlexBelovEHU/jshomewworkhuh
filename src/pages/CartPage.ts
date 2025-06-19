import { BasePage } from './BasePage';
import { type Cart } from '../services/CartService';

export class CartPage extends BasePage {
  private cartId: number | null;
  private cart: Cart | null = null;

  constructor(app: any, cartId?: number) {
    super(app);
    this.cartId = cartId || null;
  }

  async render(container: HTMLElement): Promise<void> {
    container.innerHTML = `
      ${this.createHeader()}
      <main class="main">
        <div class="container">
          <div class="cart-page">
            <h1 class="cart-page__title">Shopping Cart</h1>
            <div class="cart-content" id="cart-content">
              <div class="loading">Loading cart...</div>
            </div>
          </div>
        </div>
      </main>
      ${this.createSubscribeBanner()}
    `;

    this.setupSubscribeBanner();
    this.setupNavigation();
    await this.loadCart();
  }

  private async loadCart(): Promise<void> {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    try {
      // Get cart ID from service if not provided
      if (!this.cartId) {
        this.cartId = this.app.getCartService().getCurrentCartId();
      }

      if (!this.cartId) {
        this.renderEmptyCart();
        return;
      }

      this.cart = await this.app.getCartService().getCart(this.cartId);
      this.renderCart();
    } catch (error) {
      console.error('Error loading cart:', error);
      this.renderEmptyCart();
    }
  }

  private renderEmptyCart(): void {
    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    cartContent.innerHTML = `
      <div class="empty-cart">
        <div class="empty-cart__content">
          <h2>Cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <a href="/" class="btn btn--primary" data-navigo>Continue Shopping</a>
        </div>
      </div>
    `;

    this.setupNavigation();
  }

  private renderCart(): void {
    if (!this.cart) return;

    const cartContent = document.getElementById('cart-content');
    if (!cartContent) return;

    cartContent.innerHTML = `
      <div class="cart-items">
        <div class="cart-items__header">
          <span>Product</span>
          <span>Price</span>
          <span>Quantity</span>
          <span>Total</span>
          <span></span>
        </div>
        
        <div class="cart-items__list">
          ${this.cart.products.map(item => `
            <div class="cart-item" data-product-id="${item.id}">
              <div class="cart-item__product">
                <img src="${item.thumbnail}" alt="${item.title}" class="cart-item__image">
                <div class="cart-item__details">
                  <h3 class="cart-item__title">${item.title}</h3>
                  <p class="cart-item__price">$${item.price.toFixed(2)}</p>
                </div>
              </div>
              
              <div class="cart-item__price-col">
                $${item.price.toFixed(2)}
              </div>
              
              <div class="cart-item__quantity">
                <div class="quantity-controls">
                  <button class="quantity-btn" data-action="decrease" data-product-id="${item.id}">-</button>
                  <span class="quantity-value">${item.quantity}</span>
                  <button class="quantity-btn" data-action="increase" data-product-id="${item.id}">+</button>
                </div>
              </div>
              
              <div class="cart-item__total">
                $${item.total.toFixed(2)}
              </div>
              
              <div class="cart-item__actions">
                <button class="cart-item__remove" data-product-id="${item.id}">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 6H5H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="cart-summary">
        <div class="cart-summary__content">
          <h3>Order Summary</h3>
          
          <div class="summary-line">
            <span>Subtotal:</span>
            <span>$${this.cart.total.toFixed(2)}</span>
          </div>
          
          ${this.cart.discountedTotal < this.cart.total ? `
            <div class="summary-line summary-line--discount">
              <span>Discount:</span>
              <span>-$${(this.cart.total - this.cart.discountedTotal).toFixed(2)}</span>
            </div>
          ` : ''}
          
          <div class="summary-line summary-line--total">
            <span>Total:</span>
            <span>$${this.cart.discountedTotal.toFixed(2)}</span>
          </div>
          
          <button class="btn btn--primary btn--large" id="checkout-btn">
            Go to Checkout
          </button>
        </div>
      </div>
    `;

    this.setupCartEventListeners();
  }

  private setupCartEventListeners(): void {
    // Quantity controls
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    quantityBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const button = e.currentTarget as HTMLButtonElement;
        const action = button.dataset.action;
        const productId = parseInt(button.dataset.productId || '0');
        
        if (action && productId) {
          await this.updateQuantity(productId, action);
        }
      });
    });

    // Remove item buttons
    const removeBtns = document.querySelectorAll('.cart-item__remove');
    removeBtns.forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const button = e.currentTarget as HTMLButtonElement;
        const productId = parseInt(button.dataset.productId || '0');
        
        if (productId) {
          await this.removeItem(productId);
        }
      });
    });

    // Checkout button
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn && this.cartId) {
      checkoutBtn.addEventListener('click', () => {
        window.history.pushState({}, '', `/checkout/${this.cartId}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      });
    }
  }

  private async updateQuantity(productId: number, action: string): Promise<void> {
    if (!this.cart || !this.cartId) return;

    try {
      const currentProduct = this.cart.products.find(p => p.id === productId);
      if (!currentProduct) return;

      let newQuantity = currentProduct.quantity;
      if (action === 'increase') {
        newQuantity += 1;
      } else if (action === 'decrease' && newQuantity > 1) {
        newQuantity -= 1;
      } else if (action === 'decrease' && newQuantity === 1) {
        // Remove item if quantity becomes 0
        await this.removeItem(productId);
        return;
      }

      // Update cart with new quantities
      const products = this.cart.products.map(p => ({
        id: p.id,
        quantity: p.id === productId ? newQuantity : p.quantity
      }));

      this.cart = await this.app.getCartService().updateCart(this.cartId, products);
      this.renderCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  }

  private async removeItem(productId: number): Promise<void> {
    if (!this.cart || !this.cartId) return;

    try {
      const remainingProducts = this.cart.products.filter(p => p.id !== productId);
      
      if (remainingProducts.length === 0) {
        // Delete cart if no items left
        await this.app.getCartService().deleteCart(this.cartId);
        // Redirect to homepage
        window.history.pushState({}, '', '/');
        window.dispatchEvent(new PopStateEvent('popstate'));
        return;
      }

      // Update cart with remaining products
      const products = remainingProducts.map(p => ({
        id: p.id,
        quantity: p.quantity
      }));

      this.cart = await this.app.getCartService().updateCart(this.cartId, products);
      this.renderCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  }
} 