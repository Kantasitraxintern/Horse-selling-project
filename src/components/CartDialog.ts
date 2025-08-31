import { CartItem } from '../types';
import { PRICE_PER_CHARACTER } from '../utils/constants';

// CartDialog: คลาสสำหรับแสดง dialog ตะกร้าสินค้า (modal)
export class CartDialog {
  private modal: HTMLDivElement | null = null; // ตัวแปรเก็บ modal element
  private onClose: (() => void) | null = null; // callback เมื่อปิด dialog

  constructor() {
    this.createModal(); // สร้าง modal element ตอนสร้างคลาส
  }

  // สร้าง modal element และเพิ่มเข้า body
  private createModal(): void {
    this.modal = document.createElement('div');
    this.modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] animate-fadein';
    this.modal.style.display = 'none';
    document.body.appendChild(this.modal);
  }

  // แสดง dialog พร้อมข้อมูลตะกร้า
  show(cartItems: CartItem[], onClose: () => void): void {
    if (!this.modal) return;
    this.onClose = onClose;
    this.modal.style.display = 'flex';
    this.render(cartItems); // render HTML
    this.setupEventListeners(); // set event ปุ่มต่างๆ
  }

  // ซ่อน dialog
  hide(): void {
    if (!this.modal) return;
    this.modal.style.display = 'none';
    if (this.onClose) {
      this.onClose();
    }
  }

  // render HTML ของ dialog ตะกร้า
  private render(cartItems: CartItem[]): void {
    if (!this.modal) return;
    const total = cartItems.reduce((sum, item) => sum + item.qty, 0); // จำนวนรวม
    const totalPrice = total * PRICE_PER_CHARACTER; // ราคารวม
    this.modal.innerHTML = `
      <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-hidden">
        <div class="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6">
          <div class="flex items-center justify-between">
            <h2 class="text-2xl font-bold flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437m0 0A2.25 2.25 0 0 0 7.25 7.5h9.086a2.25 2.25 0 0 0 2.144-1.727l1.357-5.429A1.125 1.125 0 0 0 18.75 0H5.25a1.125 1.125 0 0 0-1.07.836l-.383 1.437z" />
                <circle cx="9" cy="21" r="1.5" />
                <circle cx="17" cy="21" r="1.5" />
              </svg>
              ตะกร้าสินค้า
            </h2>
            <button id="closeCartDialog" class="text-white/80 hover:text-white text-2xl font-bold transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-8 h-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="mt-2 text-orange-100">
            สินค้า ${total} ชิ้น • รวม ฿${totalPrice}
          </div>
        </div>
        <div class="p-6 max-h-96 overflow-y-auto">
          ${cartItems.length === 0 
            ? `<div class="text-center py-12 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-16 h-16 mx-auto mb-4 text-gray-300">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437m0 0A2.25 2.25 0 0 0 7.25 7.5h9.086a2.25 2.25 0 0 0 2.144-1.727l1.357-5.429A1.125 1.125 0 0 0 18.75 0H5.25a1.125 1.125 0 0 0-1.07.836l-.383 1.437z" />
                  <circle cx="9" cy="21" r="1.5" />
                  <circle cx="17" cy="21" r="1.5" />
                </svg>
                <p class="text-lg font-medium">ไม่มีสินค้าในตะกร้า</p>
                <p class="text-sm">ลองเพิ่มสินค้าดูสิ!</p>
              </div>`
            : cartItems.map(item => `
                <div class="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
                  <img src="./src/image/${item.image}" class="w-16 h-16 rounded-lg object-cover border shadow-sm flex-shrink-0" />
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-900 truncate">${item.name}</h3>
                    <div class="flex items-center gap-3 mt-2">
                      <button class="quantity-btn bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors" 
                              data-action="decrease" data-name="${item.name}" title="ลดจำนวน">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                        </svg>
                      </button>
                      <span class="text-lg font-bold text-gray-900 min-w-[2rem] text-center">${item.qty}</span>
                      <button class="quantity-btn bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors" 
                              data-action="increase" data-name="${item.name}" title="เพิ่มจำนวน">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <div class="font-bold text-orange-600 text-lg">฿${item.qty * PRICE_PER_CHARACTER}</div>
                    <button class="remove-item-btn text-red-500 hover:text-red-700 transition-colors p-1 mt-1" 
                            data-action="remove" data-name="${item.name}" title="ลบสินค้า">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              `).join('')
          }
        </div>
        <div class="bg-gray-50 p-6 border-t border-gray-200">
          <div class="flex items-center justify-between mb-4">
            <span class="text-lg font-bold text-gray-900">รวมทั้งหมด:</span>
            <span class="text-2xl font-bold text-orange-600">฿${totalPrice}</span>
          </div>
          <div class="flex gap-3">
            <button id="clearCartBtn" class="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2" 
                    ${cartItems.length === 0 ? 'disabled' : ''}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              ลบทั้งหมด
            </button>
            <button id="checkoutBtn" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2" 
                    ${cartItems.length === 0 ? 'disabled' : ''}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a5 5 0 0 0-10 0v2M5 9h14l1 12H4L5 9z" />
              </svg>
              ซื้อสินค้า
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // set event ปุ่มต่างๆ ใน dialog (ปิด, ลบ, เพิ่ม, ลด, ลบทั้งหมด, ซื้อ)
  private setupEventListeners(): void {
    if (!this.modal) return;
    // ปุ่มปิด dialog
    this.modal.querySelector('#closeCartDialog')?.addEventListener('click', () => this.hide());
    // ปุ่มลบทั้งหมด
    this.modal.querySelector('#clearCartBtn')?.addEventListener('click', () => {
      if (confirm('คุณต้องการลบสินค้าทั้งหมดในตะกร้าหรือไม่?')) {
        this.dispatchEvent('clearCart');
      }
    });
    // ปุ่มซื้อสินค้า
    this.modal.querySelector('#checkoutBtn')?.addEventListener('click', () => {
      this.dispatchEvent('checkout');
    });
    // ปุ่มลบ/เพิ่ม/ลด จำนวนสินค้าแต่ละชิ้น
    this.modal.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement;
        const action = target.dataset.action;
        const name = target.dataset.name;
        if (action && name) {
          this.dispatchEvent(action, { name });
        }
      });
    });
    // ปิด dialog เมื่อคลิกพื้นหลัง
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.hide();
      }
    });
  }

  // ยิง event ออกไปให้ main.ts จัดการ (action: remove, increase, decrease, clearCart, checkout)
  private dispatchEvent(action: string, data?: any): void {
    const event = new CustomEvent('cartAction', { 
      detail: { action, data } 
    });
    window.dispatchEvent(event);
  }

  // ลบ modal ออกจาก DOM (ถ้าไม่ใช้แล้ว)
  destroy(): void {
    if (this.modal) {
      this.modal.remove();
      this.modal = null;
    }
  }
}
