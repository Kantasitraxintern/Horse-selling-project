import './style.css';
import { Character, SortOption } from './types';
import { CsvService } from './services/csvService';
import { cartService } from './services/cartService';
import { CharacterCard } from './components/CharacterCard';
import { CartModal } from './components/CartModal';
import { CharacterDetail } from './components/CharacterDetail';
import { filterAndSortCharacters } from './utils/helpers';

class UmamusumeApp {
  private characters: Character[] = [];
  private grid: HTMLDivElement;
  private searchInput: HTMLInputElement;
  private searchBtn: HTMLButtonElement;
  private sortSelect: HTMLSelectElement;

  constructor() {
    this.grid = document.querySelector<HTMLDivElement>('#grid')!;
    this.searchInput = document.querySelector<HTMLInputElement>('#searchInput')!;
    this.searchBtn = document.querySelector<HTMLButtonElement>('#searchBtn')!;
    this.sortSelect = document.querySelector<HTMLSelectElement>('#sortSelect')!;
    
    this.initializeApp();
  }

  private async initializeApp(): Promise<void> {
    await this.loadCharacters();
    this.setupEventListeners();
    this.setupCartService();
    this.render();
    this.addGlobalFunctions();
    this.addStyles();
  }

  private async loadCharacters(): Promise<void> {
    this.characters = await CsvService.loadCharactersFromCSV();
  }

  private setupEventListeners(): void {
    this.searchInput.addEventListener('input', () => this.render());
    this.searchBtn.addEventListener('click', () => this.render());
    this.sortSelect.addEventListener('change', () => this.render());
    window.addEventListener('hashchange', () => this.handleHashChange());
    
    // Cart button
    document.getElementById('cartBtn')?.addEventListener('click', () => this.showCartModal());
  }

  private setupCartService(): void {
    cartService.addListener(() => this.updateCartCount());
  }

  private showCartModal(): void {
    const cartItems = cartService.getCartItems();
    const modal = document.createElement('div');
    modal.innerHTML = CartModal.render(cartItems);
    document.body.appendChild(modal);

    const closeModal = () => modal.remove();
    
    modal.querySelector('#closeCartModal')?.addEventListener('click', closeModal);
    modal.querySelector('#closeCartModal2')?.addEventListener('click', closeModal);
    
    modal.querySelector('#checkoutBtn')?.addEventListener('click', () => {
      if (cartService.getTotalItems() === 0) return;
      alert('ขอบคุณที่ซื้อสินค้า!');
      cartService.clearCart();
      closeModal();
    });
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
    // Global function for add to cart button
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
    `;
    document.head.appendChild(style);
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new UmamusumeApp();
});