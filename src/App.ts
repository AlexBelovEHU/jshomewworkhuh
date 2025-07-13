import { CartService } from './services/CartService';
import { StorageService } from './services/StorageService';

export class App {
  private cartServiceInstance: CartService;
  private storageServiceInstance: StorageService;
  private rootElement: HTMLElement;

  constructor() {
    this.cartServiceInstance = new CartService();
    this.storageServiceInstance = new StorageService();
    this.rootElement = document.getElementById('app') as HTMLElement;
  }

  init(): void {
    this.render();
  }

  render(): void {
    this.rootElement.innerHTML = `
      <div id="header-container"></div>
      <main id="main-content"></main>
      <div id="subscribe-banner-container"></div>
    `;
  }

  getCartService(): CartService {
    return this.cartServiceInstance;
  }

  getStorageService(): StorageService {
    return this.storageServiceInstance;
  }

  getAppElement(): HTMLElement {
    return this.rootElement;
  }
}