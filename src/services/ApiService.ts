import type { Cart } from './CartService';

export interface Product {
  id: number;
  title: string;
  desc: string; // was description
  category: string;
  price: number;
  discount: number; // was discountPercentage
  rating: number;
  stock: number;
  tags: string[];
  brand: string;
  sku: string;
  weight: number;
  size: { // was dimensions
    w: number;
    h: number;
    d: number;
  };
  warranty: string; // was warrantyInformation
  shipping: string; // was shippingInformation
  status: string; // was availabilityStatus
  reviews: Array<{
    rating: number;
    text: string; // was comment
    date: string;
    name: string; // was reviewerName
    email: string; // was reviewerEmail
  }>;
  returnPolicy: string;
  minQty: number; // was minimumOrderQuantity
  meta: {
    created: string; // was createdAt
    updated: string; // was updatedAt
    barcode: string;
    qr: string; // was qrCode
  };
  images: string[];
  thumbnail: string; // was thumbnail
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export class ApiService {
  private baseUrl = 'https://dummyjson.com';

  private async request<T>(url: string, opts?: RequestInit): Promise<T> {
    try {
      console.log(`Making API request to: ${this.baseUrl}${url}`);
      
      const response = await fetch(`${this.baseUrl}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...opts?.headers,
        },
        ...opts,
      });

      console.log(`API response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(`API response data:`, data);
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      console.error('Endpoint:', url);
      console.error('Full URL:', `${this.baseUrl}${url}`);
      throw error;
    }
  }

  async getProducts(limit: number = 30, skip: number = 0): Promise<ProductsResponse> {
    return this.request<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
  }

  async getProduct(id: number): Promise<Product> {
    return this.request<Product>(`/products/${id}`);
  }

  async getCategories(): Promise<any[]> {
    try {
      const response = await this.request<any>('/products/categories');
      console.log('Raw categories response:', response);
      
      if (Array.isArray(response)) {
        return response;
      } else if (response && typeof response === 'object') {
        return (response as any).categories || (response as any).data || [];
      } else {
        console.warn('Unexpected categories response format:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }

  async getProductsByCategory(category: string): Promise<ProductsResponse> {
    return this.request<ProductsResponse>(`/products/category/${category}`);
  }

  async searchProducts(q: string): Promise<ProductsResponse> { // was query
    return this.request<ProductsResponse>(`/products/search?q=${encodeURIComponent(q)}`);
  }

  async createCart(data: { userId: number; products: { id: number; qty: number }[] }): Promise<any> {
    // qty instead of quantity
    const products = data.products.map(p => ({ id: p.id, qty: p.qty }));
    return this.request('/carts/add', {
      method: 'POST',
      body: JSON.stringify({ userId: data.userId, products }),
    });
  }

  async getCart(id: number): Promise<Cart> {
    return this.request<Cart>(`/carts/${id}`);
  }

  async updateCart(id: number, cart: Cart): Promise<Cart> {
    const products = cart.products.map(p => ({
      id: p.id,
      qty: p.quantity // keep as qty for API, but CartItem still uses quantity
    }));
    return this.request<Cart>(`/carts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ products }),
    });
  }

  async deleteCart(id: number): Promise<any> {
    return this.request(`/carts/${id}`, {
      method: 'DELETE',
    });
  }
}