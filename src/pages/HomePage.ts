import { BasePage } from './BasePage';
import { ApiService } from '../services/ApiService';
import bannerImg from '../assets/banner.png';


export class HomePage extends BasePage {
  private apiService: ApiService;

  constructor(app: any) {
    super(app);
    this.apiService = new ApiService();
  }

  async render(container: HTMLElement): Promise<void> {
    container.innerHTML = `
      ${this.createHeader()}
      <main class="main">
      <section class="hero" style="background: #f9f9fa;">
        <div class="hero__container" style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; padding-top: 48px; padding-bottom: 32px;">
        <div class="hero__text" style="max-width: 520px; position:relative;z-index:1">
          <h1 class="hero__title" style="font-size: 3rem; font-weight: 800; margin-bottom: 16px; line-height: 1.1;">
          <span style="display:block; width:fit-content;">FIND ANYTHING</span>
          <span style="display:block;width:fit-content;">THAT MATCHES</span>
          <span style="display:block;width:fit-content;">YOUR STYLE</span>
          </h1>
          <p class="hero__subtitle" style="text-align:start;font-size: 1.1rem; color: #666; margin-bottom: 32px;">
          Browse through our diverse range of meticulously crafted garments, designed to bring out your individuality and cater to your sense of style.
          </p>
          <button class="hero__cta" id="shop-now-btn" style="padding: 16px 40px; font-size: 1.1rem; border-radius: 32px; background: #000; color: #fff; border: none; font-weight: 600; cursor: pointer;">
          Shop Now
          </button>
          <div class="hero__stats" style="display: flex; gap: 40px; margin-top: 40px;">
          <div>
            <div style="font-size: 2rem; font-weight: 700;">200+</div>
            <div style="color: #888;">International Brands</div>
          </div>
          <div>
            <div style="font-size: 2rem; font-weight: 700;">2,000+</div>
            <div style="color: #888;">High-Quality Products</div>
          </div>
          <div>
            <div style="font-size: 2rem; font-weight: 700;">30,000+</div>
            <div style="color: #888;">Happy Customers</div>
          </div>
          </div>
        </div>
          <img src="${bannerImg}" alt="Fashionable people" style="z-index :0;width: 100%; border-radius: 0; object-fit: contain; background: none; box-shadow: none; position:absolute" />
        </div>
        </div>
        <div class="hero__brands" style="background: #111; color: #fff; padding: 32px 0; margin-top: 32px;">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 32px;">
          <span style="font-family: serif; font-size: 2rem; letter-spacing: 2px;">VERSACE</span>
          <span style="font-family: serif; font-size: 2rem; letter-spacing: 2px;">ZARA</span>
          <span style="font-family: serif; font-size: 2rem; letter-spacing: 2px;">GUCCI</span>
          <span style="font-family: serif; font-size: 2rem; letter-spacing: 2px;">PRADA</span>
          <span style="font-family: serif; font-size: 2rem; letter-spacing: 2px;">Calvin Klein</span>
        </div>
        </div>
      </section>
      <section class="categories" id="categories-section">
        <div class="container">
        <h2 class="categories__title" style="font-size: 2rem; font-weight: 700; margin: 48px 0 24px;">Categories</h2>
        <div class="categories__grid" id="categories-grid">
          <div class="loading">Loading categories...</div>
        </div>
        </div>
      </section>
      </main>
      ${this.createSubscribeBanner()}
      ${this.createFooter()}
    `;
    this.setupSubscribeBanner()
    this.setupNavigation();
    await this.loadCategories();
  }

  private setupEventListeners(): void {
    const shopNowBtn = document.getElementById('shop-now-btn');
    if (shopNowBtn) {
      shopNowBtn.addEventListener('click', () => {
        const categoriesSection = document.getElementById('categories-section');
        if (categoriesSection) {
          categoriesSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    }
  }

  private async loadCategories(): Promise<void> {
    try {
      const categories = await this.apiService.getCategories();
      this.renderCategories(categories);
    } catch (error) {
      console.error('Error loading categories:', error);
      
      // Fallback to static categories if API fails
      const fallbackCategories = [
        'beauty',
        'fragrances',
        'furniture',
        'groceries',
        'home-decoration',
        'kitchen-accessories',
        'laptops',
        'mens-shirts',
        'mens-shoes',
        'mens-watches',
        'mobile-accessories',
        'motorcycle',
        'skin-care',
        'smartphones',
        'sports-accessories',
        'sunglasses',
        'tablets',
        'tops',
        'vehicle',
        'womens-bags',
        'womens-dresses',
        'womens-jewellery',
        'womens-shoes',
        'womens-watches'
      ];
      
      console.log('Using fallback categories');
      this.renderCategories(fallbackCategories);
    }
  }

  private renderCategories(categories: string[]): void {
    const grid = document.getElementById('categories-grid');
    if (!grid) return;

    grid.innerHTML = categories.map(category => `
      <div class="category-card">
        <a href="/category/${encodeURIComponent(category)}" class="category-card__link" data-navigo>
          <div class="category-card__content">
            <h3 class="category-card__title">${this.formatCategoryName(category)}</h3>
          </div>
        </a>
      </div>
    `).join('');

    // Re-setup navigation for new links
    this.setupNavigation();
  }

  private formatCategoryName(category: string): string {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
} 