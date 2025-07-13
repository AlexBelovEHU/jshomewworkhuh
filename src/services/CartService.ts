import { ApiService } from './ApiService';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discount: number; // was discountPercentage
  discountedTotal: number;
  thumbnail: string; // was thumbnail
}

export interface Cart {
  id: number;
  products: CartItem[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export class CartService {
  private api: ApiService; // was apiService
  private cartId: number = 1;

  constructor() {
    this.api = new ApiService();
  }

  private async fetchCart(): Promise<Cart> { // was fetchCartFromApi
    try {
      return await this.api.getCart(this.cartId);
    } catch (error) {
      return {
        id: this.cartId,
        products: [],
        total: 0,
        discountedTotal: 0,
        userId: 1,
        totalProducts: 0,
        totalQuantity: 0
      };
    }
  }

  private async updateCart(cart: Cart): Promise<Cart> { // was updateCartOnApi
    try {
      return await this.api.updateCart(this.cartId, cart);
    } catch (error) {
      return cart;
    }
  }

  private async getProduct(id: number): Promise<any> { // was getProductDetails
    try {
      return await this.api.getProduct(id);
    } catch (error) {
      console.error('Error fetching product:', error);
      return {
        id,
        title: `Product ${id}`,
        price: 0,
        discount: 0,
        thumbnail: ''
      };
    }
  }

  private calcTotals(items: CartItem[]): { total: number; discountedTotal: number; totalProducts: number; totalQuantity: number } { // was calculateCartTotals
    const total = items.reduce((sum, item) => sum + item.total, 0);
    const discountedTotal = items.reduce((sum, item) => sum + item.discountedTotal, 0);
    const totalProducts = items.length;
    const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
    return { total, discountedTotal, totalProducts, totalQuantity };
  }

  async getCart(): Promise<Cart> {
    return await this.fetchCart();
  }

  async addToCart(id: number, qty: number = 1): Promise<Cart> { // productId -> id, quantity -> qty
    const cart = await this.getCart();
    const idx = cart.products.findIndex(p => p.id === id);

    if (idx >= 0) {
      const prod = cart.products[idx];
      const newQty = prod.quantity + qty;
      const newTotal = prod.price * newQty;
      const newDiscountedTotal = newTotal * (1 - prod.discount / 100);

      cart.products[idx] = {
        ...prod,
        quantity: newQty,
        total: newTotal,
        discountedTotal: newDiscountedTotal
      };
    } else {
      const prod = await this.getProduct(id);
      const total = prod.price * qty;
      const discountedTotal = total * (1 - prod.discount / 100);

      const newItem: CartItem = {
        id,
        title: prod.title,
        price: prod.price,
        quantity: qty,
        total,
        discount: prod.discount,
        discountedTotal,
        thumbnail: prod.thumbnail
      };

      cart.products.push(newItem);
    }

    const totals = this.calcTotals(cart.products);
    cart.total = totals.total;
    cart.discountedTotal = totals.discountedTotal;
    cart.totalProducts = totals.totalProducts;
    cart.totalQuantity = totals.totalQuantity;

    return await this.updateCart(cart);
  }

  async updateCartItemQuantity(id: number, qty: number): Promise<Cart> {
    const cart = await this.getCart();
    const idx = cart.products.findIndex(p => p.id === id);

    if (idx >= 0) {
      if (qty <= 0) {
        cart.products.splice(idx, 1);
      } else {
        const prod = cart.products[idx];
        const newTotal = prod.price * qty;
        const newDiscountedTotal = newTotal * (1 - prod.discount / 100);

        cart.products[idx] = {
          ...prod,
          quantity: qty,
          total: newTotal,
          discountedTotal: newDiscountedTotal
        };
      }

      const totals = this.calcTotals(cart.products);
      cart.total = totals.total;
      cart.discountedTotal = totals.discountedTotal;
      cart.totalProducts = totals.totalProducts;
      cart.totalQuantity = totals.totalQuantity;

      return await this.updateCart(cart);
    }

    return cart;
  }

  async removeFromCart(id: number): Promise<Cart> {
    return this.updateCartItemQuantity(id, 0);
  }

  async clearCart(): Promise<Cart> {
    const empty: Cart = {
      id: this.cartId,
      products: [],
      total: 0,
      discountedTotal: 0,
      userId: 1,
      totalProducts: 0,
      totalQuantity: 0
    };
    return await this.updateCart(empty);
  }

  getCurrentCartId(): number {
    return this.cartId;
  }
}