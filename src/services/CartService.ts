import { ApiService } from './ApiService';
import { StorageService } from './StorageService';

export interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
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
  private apiService: ApiService;
  private storageService: StorageService;
  private currentCartId: number | null = null;

  constructor() {
    this.apiService = new ApiService();
    this.storageService = new StorageService();
    this.loadCartFromStorage();
  }

  private loadCartFromStorage(): void {
    const cartId = this.storageService.getItem<number>('currentCartId');
    if (cartId) {
      this.currentCartId = cartId;
    }
  }

  private saveCartToStorage(): void {
    if (this.currentCartId) {
      this.storageService.setItem('currentCartId', this.currentCartId);
    }
  }

  async createCart(products: { id: number; quantity: number }[]): Promise<Cart> {
    try {
      const cart = await this.apiService.createCart({
        userId: 1,
        products
      });
      this.currentCartId = cart.id;
      this.saveCartToStorage();
      return cart;
    } catch (error) {
      console.error('Error creating cart:', error);
      throw error;
    }
  }

  async updateCart(cartId: number, products: { id: number; quantity: number }[]): Promise<Cart> {
    try {
      const cart = await this.apiService.updateCart(cartId, { products });
      return cart;
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }

  async getCart(cartId: number): Promise<Cart> {
    try {
      return await this.apiService.getCart(cartId);
    } catch (error) {
      console.error('Error fetching cart:', error);
      throw error;
    }
  }

  async deleteCart(cartId: number): Promise<void> {
    try {
      await this.apiService.deleteCart(cartId);
      if (this.currentCartId === cartId) {
        this.currentCartId = null;
        this.storageService.removeItem('currentCartId');
      }
    } catch (error) {
      console.error('Error deleting cart:', error);
      throw error;
    }
  }

  getCurrentCartId(): number | null {
    return this.currentCartId;
  }

  async addToCart(productId: number, quantity: number = 1): Promise<Cart> {
    if (this.currentCartId) {
      // Update existing cart
      const currentCart = await this.getCart(this.currentCartId);
      const existingProduct = currentCart.products.find(p => p.id === productId);
      
      let products;
      if (existingProduct) {
        // Update quantity of existing product
        products = currentCart.products.map(p => 
          p.id === productId 
            ? { id: p.id, quantity: p.quantity + quantity }
            : { id: p.id, quantity: p.quantity }
        );
      } else {
        // Add new product
        products = [
          ...currentCart.products.map(p => ({ id: p.id, quantity: p.quantity })),
          { id: productId, quantity }
        ];
      }
      
      return await this.updateCart(this.currentCartId, products);
    } else {
      // Create new cart
      return await this.createCart([{ id: productId, quantity }]);
    }
  }
} 