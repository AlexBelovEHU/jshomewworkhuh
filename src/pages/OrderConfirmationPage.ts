import { BasePage } from './BasePage';

export class OrderConfirmationPage extends BasePage {
  constructor(app: any) {
    super(app);
  }

  async render(container: HTMLElement): Promise<void> {
    container.innerHTML = `
      ${this.createHeader()}
      <main class="main">
        <div class="container">
          <div class="confirmation-page">
            <div class="confirmation-content">
              <div class="confirmation-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              
              <h1 class="confirmation-title">Order Confirmed!</h1>
              <p class="confirmation-message">
                Thank you for your purchase. Your order has been successfully placed and you will receive a confirmation email shortly.
              </p>
              
              <div class="confirmation-details">
                <p>Order Number: <strong>#${this.generateOrderNumber()}</strong></p>
                <p>Estimated Delivery: <strong>${this.getEstimatedDelivery()}</strong></p>
              </div>
              
              <div class="redirect-info">
                <p>You will be redirected to the homepage in <span id="countdown">5</span> seconds...</p>
                <a href="/" class="btn btn--primary" data-navigo>Continue Shopping</a>
              </div>
            </div>
          </div>
        </div>
      </main>
    `;

    this.setupNavigation();
    this.redirectAfterDelay(5);
  }

  private generateOrderNumber(): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `EC${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
  }

  private getEstimatedDelivery(): string {
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 5);
    return deliveryDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Uses only a single timeout, no event loop
  private redirectAfterDelay(seconds: number): void {
    const countdownElement = document.getElementById('countdown');
    if (!countdownElement) return;

    countdownElement.textContent = seconds.toString();

    // Animate countdown without setInterval
    let start = Date.now();
    const updateCountdown = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const remaining = Math.max(seconds - elapsed, 0);
      countdownElement.textContent = remaining.toString();
      if (remaining > 0) {
        requestAnimationFrame(updateCountdown);
      }
    };
    requestAnimationFrame(updateCountdown);

    setTimeout(() => {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }, seconds * 1000);
  }
} 