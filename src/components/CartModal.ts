import { CartItem } from '../types';
import { PRICE_PER_CHARACTER } from '../utils/constants';

export class CartModal {
  static render(cartItems: CartItem[]): string {
    const total = cartItems.reduce((sum, item) => sum + item.qty, 0);
    const totalPrice = total * PRICE_PER_CHARACTER;

    return `
      <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] animate-fadein">
        <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative border border-orange-100 ring-2 ring-orange-100 transition-all scale-100">
          <button class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors" 
                  id="closeCartModal" title="ปิด">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <h2 class="text-2xl font-extrabold mb-4 text-orange-500 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-orange-400">
              <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437m0 0A2.25 2.25 0 0 0 7.25 7.5h9.086a2.25 2.25 0 0 0 2.144-1.727l1.357-5.429A1.125 1.125 0 0 0 18.75 0H5.25a1.125 1.125 0 0 0-1.07.836l-.383 1.437z" />
              <circle cx="9" cy="21" r="1.5" />
              <circle cx="17" cy="21" r="1.5" />
            </svg>
            ตะกร้าสินค้า
          </h2>
          
          <div class="divide-y max-h-72 overflow-y-auto pr-1">
            ${cartItems.length === 0 
              ? '<div class="py-8 text-center text-gray-400">ไม่มีสินค้าในตะกร้า</div>'
              : cartItems.map(item => `
                  <div class="flex items-center gap-4 py-3">
                    <img src="./src/image/${item.image}" class="w-14 h-14 rounded-lg object-cover border shadow" />
                    <div class="flex-1">
                      <div class="font-bold text-blue-900">${item.name}</div>
                      <div class="text-sm text-gray-500">฿${PRICE_PER_CHARACTER} × ${item.qty}</div>
                    </div>
                    <div class="font-bold text-orange-500">฿${item.qty * PRICE_PER_CHARACTER}</div>
                  </div>
                `).join('')
            }
          </div>
          
          <div class="mt-6 flex flex-col gap-2 sm:flex-row justify-between items-center border-t pt-4">
            <div class="text-lg font-bold text-blue-900 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-orange-400">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" />
              </svg>
              รวม: <span class="text-orange-500">฿${totalPrice}</span>
            </div>
            <div class="flex gap-2 mt-2 sm:mt-0">
              <button class="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 shadow order-2 sm:order-1 transition" 
                      id="closeCartModal2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
                ปิด
              </button>
              <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 shadow order-1 sm:order-2 disabled:opacity-50 transition" 
                      id="checkoutBtn" 
                      ${cartItems.length === 0 ? 'disabled' : ''}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a5 5 0 0 0-10 0v2M5 9h14l1 12H4L5 9z" />
                </svg>
                ซื้อสินค้า
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}
