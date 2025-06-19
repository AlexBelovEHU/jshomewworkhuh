import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  private cartId: number;
  private cart: any = null;

  constructor(app: any, cartId: number) {
    super(app);
    this.cartId = cartId;
  }

  async render(container: HTMLElement): Promise<void> {
    container.innerHTML = `
      ${this.createHeader()}
      <main class="main">
        <div class="container">
          <div class="checkout-page">
            <h1 class="checkout-page__title">Checkout</h1>
            <div class="checkout-content" id="checkout-content">
              <div class="loading">Loading checkout...</div>
            </div>
          </div>
        </div>
      </main>
    `;

    this.setupNavigation();
    await this.loadCart();
  }

  private async loadCart(): Promise<void> {
    try {
      this.cart = await this.app.getCartService().getCart(this.cartId);
      this.renderCheckout();
    } catch (error) {
      console.error('Error loading cart:', error);
      const content = document.getElementById('checkout-content');
      if (content) {
        content.innerHTML = '<div class="error">Failed to load cart</div>';
      }
    }
  }

  private renderCheckout(): void {
    if (!this.cart) return;

    const content = document.getElementById('checkout-content');
    if (!content) return;

    content.innerHTML = `
      <div class="checkout-form-container">
        <form class="checkout-form" id="checkout-form">
          <div class="form-section">
            <h3>Personal Information</h3>
            
            <div class="form-row">
              <div class="form-group">
                <label for="firstName">First Name *</label>
                <input 
                  type="text" 
                  id="firstName" 
                  name="firstName" 
                  required 
                  minlength="3" 
                  maxlength="32"
                  class="form-input"
                >
                <span class="form-error" id="firstName-error"></span>
              </div>
              
              <div class="form-group">
                <label for="lastName">Last Name *</label>
                <input 
                  type="text" 
                  id="lastName" 
                  name="lastName" 
                  required 
                  minlength="3" 
                  maxlength="32"
                  class="form-input"
                >
                <span class="form-error" id="lastName-error"></span>
              </div>
            </div>
            
            <div class="form-group">
              <label for="maidenName">Maiden Name *</label>
              <input 
                type="text" 
                id="maidenName" 
                name="maidenName" 
                required 
                minlength="3" 
                maxlength="32"
                class="form-input"
              >
              <span class="form-error" id="maidenName-error"></span>
            </div>
            
            <div class="form-group">
              <label for="email">Email *</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required
                class="form-input"
              >
              <span class="form-error" id="email-error"></span>
            </div>
            
            <div class="form-group">
              <label for="phone">Phone *</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                required
                placeholder="+63 739 292 7942"
                class="form-input"
              >
              <span class="form-error" id="phone-error"></span>
            </div>
          </div>
          
          <div class="form-section">
            <h3>Shipping Address</h3>
            
            <div class="form-group">
              <label for="address">Address *</label>
              <input 
                type="text" 
                id="address" 
                name="address" 
                required
                placeholder="1745 T Street Southeast"
                class="form-input"
              >
              <span class="form-error" id="address-error"></span>
            </div>
            
            <div class="form-row">
              <div class="form-group">
                <label for="city">City *</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  required
                  placeholder="Washington"
                  class="form-input"
                >
                <span class="form-error" id="city-error"></span>
              </div>
              
              <div class="form-group">
                <label for="postalCode">Postal Code *</label>
                <input 
                  type="text" 
                  id="postalCode" 
                  name="postalCode" 
                  required
                  placeholder="20020"
                  class="form-input"
                >
                <span class="form-error" id="postalCode-error"></span>
              </div>
            </div>
          </div>
          
          <button type="submit" class="btn btn--primary btn--large">
            Go to Payment
          </button>
        </form>
      </div>
      
      <div class="order-summary">
        <h3>Order Summary</h3>
        
        <div class="order-items">
          ${this.cart.products.map((item: any) => `
            <div class="order-item">
              <img src="${item.thumbnail}" alt="${item.title}" class="order-item__image">
              <div class="order-item__details">
                <h4>${item.title}</h4>
                <p>Qty: ${item.quantity}</p>
              </div>
              <div class="order-item__price">
                $${item.total.toFixed(2)}
              </div>
            </div>
          `).join('')}
        </div>
        
        <div class="order-totals">
          <div class="total-line">
            <span>Subtotal:</span>
            <span>$${this.cart.total.toFixed(2)}</span>
          </div>
          
          ${this.cart.discountedTotal < this.cart.total ? `
            <div class="total-line">
              <span>Discount:</span>
              <span>-$${(this.cart.total - this.cart.discountedTotal).toFixed(2)}</span>
            </div>
          ` : ''}
          
          <div class="total-line total-line--final">
            <span>Total:</span>
            <span>$${this.cart.discountedTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    `;

    this.setupFormValidation();
  }

  private setupFormValidation(): void {
    const form = document.getElementById('checkout-form') as HTMLFormElement;
    if (!form) return;

    // Real-time validation
    const inputs = form.querySelectorAll('.form-input');
    inputs.forEach(input => {
      input.addEventListener('blur', () => {
        this.validateField(input as HTMLInputElement);
      });

      input.addEventListener('input', () => {
        this.clearFieldError(input as HTMLInputElement);
      });
    });

    // Form submission
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
  }

  private validateField(input: HTMLInputElement): boolean {
    const value = input.value.trim();
    const name = input.name;
    let isValid = true;
    let errorMessage = '';

    // Clear previous error
    this.clearFieldError(input);

    switch (name) {
      case 'firstName':
      case 'lastName':
      case 'maidenName':
        if (value.length < 3 || value.length > 32) {
          isValid = false;
          errorMessage = 'Must be between 3 and 32 characters';
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          isValid = false;
          errorMessage = 'Please enter a valid email address';
        }
        break;

      case 'phone':
        const phoneRegex = /^\+\d{1,3}(\s\d{3}){2,3}\s\d{4}$/;
        if (!phoneRegex.test(value)) {
          isValid = false;
          errorMessage = 'Format: +63 739 292 7942';
        }
        break;

      case 'address':
        const addressRegex = /^\d{4}\s.+$/;
        if (!addressRegex.test(value)) {
          isValid = false;
          errorMessage = 'Format: 1745 T Street Southeast';
        }
        break;

      case 'city':
        if (value.length < 2) {
          isValid = false;
          errorMessage = 'Please enter a valid city name';
        }
        break;

      case 'postalCode':
        if (value.length < 3) {
          isValid = false;
          errorMessage = 'Please enter a valid postal code';
        }
        break;
    }

    if (!isValid) {
      this.showFieldError(input, errorMessage);
    }

    return isValid;
  }

  private showFieldError(input: HTMLInputElement, message: string): void {
    input.classList.add('form-input--error');
    const errorElement = document.getElementById(`${input.name}-error`);
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  private clearFieldError(input: HTMLInputElement): void {
    input.classList.remove('form-input--error');
    const errorElement = document.getElementById(`${input.name}-error`);
    if (errorElement) {
      errorElement.textContent = '';
    }
  }

  private handleSubmit(): void {
    const form = document.getElementById('checkout-form') as HTMLFormElement;
    if (!form) return;

    const inputs = form.querySelectorAll('.form-input') as NodeListOf<HTMLInputElement>;
    let isFormValid = true;

    // Validate all fields
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isFormValid = false;
      }
    });

    if (isFormValid) {
      // Redirect to confirmation page
      window.history.pushState({}, '', '/order-confirmation');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }
} 