import { CartItem, Character } from '../types';
import { PRICE_PER_CHARACTER } from '../utils/constants';

export class CartService {
  private cart: Record<string, CartItem> = {};
  private listeners: Array<() => void> = [];

  addToCart(character: Character): void {
    if (!this.cart[character.name]) {
      this.cart[character.name] = { 
        name: character.name, 
        qty: 1, 
        image: character.image 
      };
    } else {
      this.cart[character.name].qty += 1;
    }
    this.notifyListeners();
  }

  removeFromCart(characterName: string): void {
    if (this.cart[characterName]) {
      delete this.cart[characterName];
      this.notifyListeners();
    }
  }

  updateQuantity(characterName: string, quantity: number): void {
    if (this.cart[characterName]) {
      if (quantity <= 0) {
        this.removeFromCart(characterName);
      } else {
        this.cart[characterName].qty = quantity;
        this.notifyListeners();
      }
    }
  }

  getCart(): Record<string, CartItem> {
    return { ...this.cart };
  }

  getCartItems(): CartItem[] {
    return Object.values(this.cart);
  }

  getTotalItems(): number {
    return Object.values(this.cart).reduce((sum, item) => sum + item.qty, 0);
  }

  getTotalPrice(): number {
    return this.getTotalItems() * PRICE_PER_CHARACTER;
  }

  clearCart(): void {
    this.cart = {};
    this.notifyListeners();
  }

  addListener(callback: () => void): void {
    this.listeners.push(callback);
  }

  removeListener(callback: () => void): void {
    const index = this.listeners.indexOf(callback);
    if (index > -1) {
      this.listeners.splice(index, 1);
    }
  }

  private notifyListeners(): void {
    this.listeners.forEach(callback => callback());
  }
}

export const cartService = new CartService();
