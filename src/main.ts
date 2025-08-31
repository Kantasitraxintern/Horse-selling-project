// นำเข้า style หลักของโปรเจค
import './style.css';
// นำเข้า type ที่ใช้ในโปรเจค
import { Character, SortOption } from './types';
// นำเข้า service สำหรับโหลดข้อมูลตัวละครจาก CSV
import { CsvService } from './services/csvService';
// นำเข้า service สำหรับจัดการตะกร้าสินค้า
import { cartService } from './services/cartService';
// นำเข้า component สำหรับแสดงการ์ดตัวละคร
import { CharacterCard } from './components/CharacterCard';
// นำเข้า dialog ตะกร้าสินค้า
import { CartDialog } from './components/CartDialog';
// นำเข้า component สำหรับแสดงรายละเอียดตัวละคร
import { CharacterDetail } from './components/CharacterDetail';
// นำเข้า helper สำหรับ filter/sort ตัวละคร
import { filterAndSortCharacters } from './utils/helpers';

// คลาสหลักของแอปพลิเคชัน
class UmamusumeApp {
  // เก็บข้อมูลตัวละครทั้งหมด
  private characters: Character[] = [];
  // อ้างอิง DOM หลัก
  private grid: HTMLDivElement;
  private searchInput: HTMLInputElement;
  private searchBtn: HTMLButtonElement;
  private sortSelect: HTMLSelectElement;
  // Dialog ตะกร้าสินค้า
  private cartDialog: CartDialog;

  constructor() {
    // map DOM
    this.grid = document.querySelector<HTMLDivElement>('#grid')!;
    this.searchInput = document.querySelector<HTMLInputElement>('#searchInput')!;
    this.searchBtn = document.querySelector<HTMLButtonElement>('#searchBtn')!;
    this.sortSelect = document.querySelector<HTMLSelectElement>('#sortSelect')!;
    this.cartDialog = new CartDialog();
    // เริ่มต้นแอป
    this.initializeApp();
  }

  // ฟังก์ชันเริ่มต้นแอป (โหลดข้อมูล, set event, render)
  private async initializeApp(): Promise<void> {
    await this.loadCharacters(); // โหลดข้อมูลตัวละครจาก CSV
    this.setupEventListeners(); // set event UI
    this.setupCartService(); // set event ตะกร้า
    this.render(); // render ตัวละคร
    this.addGlobalFunctions(); // เพิ่มฟังก์ชัน global (เช่น __addToCart)
    this.addStyles(); // เพิ่ม style พิเศษ
    this.setupCartDialogEvents(); // set event dialog ตะกร้า
  }

  // โหลดข้อมูลตัวละครจาก CSV
  private async loadCharacters(): Promise<void> {
    this.characters = await CsvService.loadCharactersFromCSV();
  }

  // set event UI หลัก (search, sort, cart)
  private setupEventListeners(): void {
    this.searchInput.addEventListener('input', () => this.render());
    this.searchBtn.addEventListener('click', () => this.render());
    this.sortSelect.addEventListener('change', () => this.render());
    window.addEventListener('hashchange', () => this.handleHashChange());
    document.getElementById('cartBtn')?.addEventListener('click', () => this.showCartModal());
  }

  // set event listener สำหรับตะกร้า (เช่น update badge)
  private setupCartService(): void {
    cartService.addListener(() => this.updateCartCount());
  }

  // แสดง dialog ตะกร้าสินค้า
  private showCartModal(): void {
    const cartItems = cartService.getCartItems();
    this.cartDialog.show(cartItems, () => {});
  }

  // set event สำหรับ dialog ตะกร้า (ลบ, เพิ่ม, ลด, ลบทั้งหมด, ซื้อ)
  private setupCartDialogEvents(): void {
    window.addEventListener('cartAction', (e: any) => {
      const { action, data } = e.detail;
      switch (action) {
        case 'remove': // ลบสินค้า 1 ชิ้น
          cartService.removeFromCart(data.name);
          this.refreshCartDialog();
          break;
        case 'increase': { // เพิ่มจำนวนสินค้า
          const item = cartService.getCart()[data.name];
          if (item) {
            cartService.updateQuantity(data.name, item.qty + 1);
            this.refreshCartDialog();
          }
          break;
        }
        case 'decrease': { // ลดจำนวนสินค้า
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
        case 'clearCart': // ลบสินค้าทั้งหมด
          cartService.clearCart();
          this.cartDialog.hide();
          break;
        case 'checkout': // ซื้อสินค้า
          if (cartService.getTotalItems() === 0) return;
          alert('ขอบคุณที่ซื้อสินค้า!');
          cartService.clearCart();
          this.cartDialog.hide();
          break;
      }
    });
  }

  // อัปเดต dialog ตะกร้า (หลังลบ/เพิ่ม/ลด)
  private refreshCartDialog(): void {
    const cartItems = cartService.getCartItems();
    if (cartItems.length === 0) {
      this.cartDialog.hide();
      return;
    }
    this.cartDialog.show(cartItems, () => {});
  }

  // อัปเดต badge จำนวนสินค้าในตะกร้า
  private updateCartCount(): void {
    const count = cartService.getTotalItems();
    const badge = document.getElementById('cartCount');
    if (badge) badge.textContent = count.toString();
  }

  // filter/sort ตัวละครตาม search/sort
  private getFilteredSorted(): Character[] {
    const query = this.searchInput.value.trim();
    const sortBy = this.sortSelect.value as SortOption;
    return filterAndSortCharacters(this.characters, query, sortBy);
  }

  // render ตัวละครทั้งหมด
  private render(): void {
    const filteredCharacters = this.getFilteredSorted();
    this.grid.innerHTML = filteredCharacters.map(character => 
      CharacterCard.render(character)
    ).join('');
  }

  // handle hashchange (แสดงรายละเอียดตัวละคร)
  private handleHashChange(): void {
    const hash = window.location.hash;
    if (hash.startsWith('#/character/')) {
      const name = decodeURIComponent(hash.replace('#/character/', ''));
      this.showCharacterDetail(name);
    } else {
      this.render();
    }
  }

  // แสดงรายละเอียดตัวละคร
  private showCharacterDetail(name: string): void {
    const character = this.characters.find(c => c.name === name);
    if (!character) return;
    this.grid.innerHTML = CharacterDetail.render(character);
  }

  // เพิ่มฟังก์ชัน global สำหรับปุ่มหยิบใส่ตะกร้า
  private addGlobalFunctions(): void {
    (window as any).__addToCart = (name: string) => {
      const character = this.characters.find(c => c.name === name);
      if (character) {
        cartService.addToCart(character);
      }
    };
  }

  // เพิ่ม style พิเศษ (animation, ปุ่ม)
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

// เริ่มต้นแอปเมื่อ DOM โหลดเสร็จ
// (สร้าง instance ของ UmamusumeApp)
document.addEventListener('DOMContentLoaded', () => {
  new UmamusumeApp();
});