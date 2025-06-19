import Navigo from 'navigo';
import { App } from '../App';
import { HomePage } from '../pages/HomePage';
import { CategoryPage } from '../pages/CategoryPage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { OrderConfirmationPage } from '../pages/OrderConfirmationPage';

export class Router {
  private router: Navigo;
  private app: App;

  constructor(app: App) {
    this.app = app;
    this.router = new Navigo('/');
  }

  init(): void {
    this.router
      .on('/', () => {
        this.renderPage(new HomePage(this.app));
      })
      .on('/category/:categoryName', (match) => {
        const categoryName = match?.data?.categoryName;
        if (categoryName) {
          this.renderPage(new CategoryPage(this.app, categoryName));
        }
      })
      .on('/product/:productId', (match) => {
        const productId = match?.data?.productId;
        if (productId) {
          this.renderPage(new ProductDetailPage(this.app, parseInt(productId)));
        }
      })
      .on('/cart/:cartId', (match) => {
        const cartId = match?.data?.cartId;
        if (cartId) {
          this.renderPage(new CartPage(this.app, parseInt(cartId)));
        }
      })
      .on('/cart', () => {
        // Handle empty cart case
        this.renderPage(new CartPage(this.app));
      })
      .on('/checkout/:cartId', (match) => {
        const cartId = match?.data?.cartId;
        if (cartId) {
          this.renderPage(new CheckoutPage(this.app, parseInt(cartId)));
        }
      })
      .on('/confirmation', () => {
        this.renderPage(new OrderConfirmationPage(this.app));
      })
      .resolve();
  }

  private renderPage(page: any): void {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      page.render(mainContent);
    }
  }

  navigate(path: string): void {
    this.router.navigate(path);
  }

  getRouter(): Navigo {
    return this.router;
  }
} 