import './styles/main.scss';
import Navigo from 'navigo';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderConfirmationPage } from './pages/OrderConfirmationPage';

class App {
  private router: Navigo;
  private container: HTMLElement;

  constructor() {
    this.container = document.getElementById('app') as HTMLElement;
    this.router = new Navigo('/', { hash: false });
    this.setupRoutes();
    this.setupGlobalStyles();
  }

  private setupGlobalStyles(): void {
    // Add Google Fonts
    const fontLink = document.createElement('link');
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Rubik:wght@400;500;600;700&display=swap';
    fontLink.rel = 'stylesheet';
    document.head.appendChild(fontLink);

    // Add Font Awesome for icons
    const iconLink = document.createElement('link');
    iconLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
    iconLink.rel = 'stylesheet';
    document.head.appendChild(iconLink);
  }

  private setupRoutes(): void {
    this.router
      .on('/', () => {
        this.renderPage(new HomePage(this));
      })
      .on('/category/:categoryName', (match) => {
        const categoryName = match?.data?.categoryName;
        if (categoryName) {
          this.renderPage(new CategoryPage(this, categoryName));
        }
      })
      .on('/product/:productId', (match) => {
        const productId = match?.data?.productId;
        if (productId) {
          this.renderPage(new ProductDetailPage(this, parseInt(productId)));
        }
      })
      .on('/cart', () => {
        this.renderPage(new CartPage(this, 1)); // Using cart ID 1 for demo
      })
      .on('/checkout', () => {
        this.renderPage(new CheckoutPage(this, 1)); // Using cart ID 1 for demo
      })
      .on('/order-confirmation', () => {
        this.renderPage(new OrderConfirmationPage(this));
      })
      .notFound(() => {
        this.container.innerHTML = `
          <div class="container">
            <div class="error">
              <h2>Page Not Found</h2>
              <p>The page you're looking for doesn't exist.</p>
              <a href="/" class="btn btn--primary">Go Home</a>
            </div>
          </div>
        `;
      });
  }

  private async renderPage(page: any): Promise<void> {
    try {
      // Clear container
      this.container.innerHTML = '';
      
      // Render the page
      await page.render(this.container);
      
      // Scroll to top
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error rendering page:', error);
      this.container.innerHTML = `
        <div class="container">
          <div class="error">
            <h2>Something went wrong</h2>
            <p>We're sorry, but something went wrong while loading the page.</p>
            <a href="/" class="btn btn--primary">Go Home</a>
          </div>
        </div>
      `;
    }
  }

  public start(): void {
    this.router.resolve();
  }

  public navigate(path: string): void {
    this.router.navigate(path);
  }

  public getRouter(): Navigo {
    return this.router;
  }
}

// Initialize the app
const app = new App();
app.start();

// Make app globally available for navigation
(window as any).app = app;

// Export for use in other modules
export default app; 