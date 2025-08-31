import './style.css';
import { Character, SortOption } from './types';
import { CsvService } from './services/csvService';
import { cartService } from './services/cartService';
import { CharacterCard } from './components/CharacterCard';
import { CartDialog } from './components/CartDialog';
import { CharacterDetail } from './components/CharacterDetail';
import { filterAndSortCharacters } from './utils/helpers';

class UmamusumeApp {
  private characters: Character[] = [];
  private grid: HTMLDivElement;
  private searchInput: HTMLInputElement;
  private searchBtn: HTMLButtonElement;
  private sortSelect: HTMLSelectElement;
  private cartDialog: CartDialog;

  constructor() {
    this.grid = document.querySelector<HTMLDivElement>('#grid')!;
    this.searchInput = document.querySelector<HTMLInputElement>('#searchInput')!;
    this.searchBtn = document.querySelector<HTMLButtonElement>('#searchBtn')!;
    this.sortSelect = document.querySelector<HTMLSelectElement>('#sortSelect')!;
    this.cartDialog = new CartDialog();
    this.initializeApp();
  }

  private async initializeApp(): Promise<void> {
    await this.loadCharacters();
    this.setupEventListeners();
    this.setupCartService();
    this.render();
    this.addGlobalFunctions();
    this.addStyles();
    this.setupCartDialogEvents();
  }

  private async loadCharacters(): Promise<void> {
    this.characters = await CsvService.loadCharactersFromCSV();
  }

  private setupEventListeners(): void {
    this.searchInput.addEventListener('input', () => this.render());
    this.searchBtn.addEventListener('click', () => this.render());
    this.sortSelect.addEventListener('change', () => this.render());
    window.addEventListener('hashchange', () => this.handleHashChange());
    document.getElementById('cartBtn')?.addEventListener('click', () => this.showCartModal());
  }

  private setupCartService(): void {
    cartService.addListener(() => this.updateCartCount());
  }

  private showCartModal(): void {
    const cartItems = cartService.getCartItems();
    this.cartDialog.show(cartItems, () => {});
  }

  private setupCartDialogEvents(): void {
    window.addEventListener('cartAction', (e: any) => {
      const { action, data } = e.detail;
      switch (action) {
        case 'remove':
          cartService.removeFromCart(data.name);
          this.refreshCartDialog();
          break;
        case 'increase': {
          const item = cartService.getCart()[data.name];
          if (item) {
            cartService.updateQuantity(data.name, item.qty + 1);
            this.refreshCartDialog();
          }
          break;
        }
        case 'decrease': {
          const item = cartService.getCart()[data.name];
          if (item) {
            if (item.qty > 1) {
              cartService.updateQuantity(data.name, item.qty - 1);
            } else {
              cartService.removeFromCart(data.name);
            }
            this.refreshCartDialog();
          }
          break;
        }
        case 'clearCart':
          cartService.clearCart();
          this.cartDialog.hide();
          break;
        case 'checkout':
          if (cartService.getTotalItems() === 0) return;
          alert('ขอบคุณที่ซื้อสินค้า!');
          cartService.clearCart();
          this.cartDialog.hide();
          break;
      }
    });
  }

  private refreshCartDialog(): void {
    const cartItems = cartService.getCartItems();
    if (cartItems.length === 0) {
      this.cartDialog.hide();
      return;
    }
    this.cartDialog.show(cartItems, () => {});
  }

  private updateCartCount(): void {
    const count = cartService.getTotalItems();
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = count.toString();
  }

  private getFilteredSorted(): Character[] {
    const query = this.searchInput.value.trim();
    const sortBy = this.sortSelect.value as SortOption;
    return filterAndSortCharacters(this.characters, query, sortBy);
  }

  private render(): void {
    const filteredCharacters = this.getFilteredSorted();
    this.grid.innerHTML = filteredCharacters.map(character => 
      CharacterCard.render(character)
    ).join('');
  }

  private handleHashChange(): void {
    const hash = window.location.hash;
    if (hash.startsWith('#/character/')) {
      const name = decodeURIComponent(hash.replace('#/character/', ''));
      this.showCharacterDetail(name);
    } else {
      this.render();
    }
  }

  private showCharacterDetail(name: string): void {
    const character = this.characters.find(c => c.name === name);
    if (!character) return;
    this.grid.innerHTML = CharacterDetail.render(character);
  }

  private addGlobalFunctions(): void {
    (window as any).__addToCart = (name: string) => {
      const character = this.characters.find(c => c.name === name);
      if (character) {
        cartService.addToCart(character);
      }
    };
  }

  private addStyles(): void {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes fadein { 
        from { opacity: 0; transform: scale(0.96); } 
        to { opacity: 1; transform: scale(1); } 
      } 
      .animate-fadein { 
        animation: fadein 0.18s cubic-bezier(.4,2,.6,1) both; 
      }
      .quantity-btn:active {
        transform: scale(0.95);
      }
      .remove-item-btn:active {
        transform: scale(0.95);
      }
    `;
    document.head.appendChild(style);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new UmamusumeApp();
});