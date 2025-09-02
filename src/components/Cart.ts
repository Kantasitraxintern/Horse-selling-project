import type { CartItem } from "./CartLogic"; // ใช้เพื่อบอกชนิดข้อมูลของสินค้าในตะกร้า

// ฟังก์ชันคืนค่า HTML สตริงของโมดัลตะกร้าสินค้า
// หมายเหตุ: จงใจไม่ใส่คอมเมนต์ภายในเทมเพลตสตริงมากเกินไปเพื่อหลีกเลี่ยงผลกระทบต่อ HTML จริง
export function renderCartModal(cartItems: CartItem[], totalPrice: number) {
  return `
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fadein">
      <div class="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative border ring-2 ring-orange-100 transition">
        
        <button id="closeCartModal" class="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition">✕</button>
        
        <h2 class="text-xl font-bold mb-4 text-orange-500 flex items-center gap-2">🛒 ตะกร้าสินค้า</h2>
        
        <div class="divide-y max-h-96 overflow-y-auto pr-1">
          ${
            cartItems.length === 0
              ? '<div class="py-8 text-center text-gray-400">ไม่มีสินค้าในตะกร้า</div>'
              : cartItems.map(item => `
                <div class="flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0">
                  <img src="${item.image}" class="w-16 h-16 rounded-lg object-cover border shadow-sm flex-shrink-0" />
                  <div class="flex-1 min-w-0">
                    <h3 class="font-bold text-gray-900 truncate">${item.name}</h3>
                    <div class="flex items-center gap-3 mt-2">
                      <button class="decreaseQty  bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors" 
                        data-name="${item.name}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M20 12H4" />
                        </svg>
                      </button>
                      <span class="text-lg font-bold text-gray-900 min-w-[2rem] text-center">${item.qty}</span>
                      <button class="increaseQty  bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold transition-colors" 
                        data-name="${item.name}">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div class="text-right flex-shrink-0">
                    <div class="font-bold text-orange-600 text-lg">฿${item.qty * item.price}</div>
                    <button class="removeItem  text-red-500 hover:text-red-700 transition-colors p-1 mt-1" 
                      data-name="${item.name}">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              `).join('')
          }
        </div>
        
       <!-- รวมราคา -->
          <div class="mt-6 sm:flex-row items-center border-t pt-4 gap-2">
            <div class="flex justify-between text-lg font-bold text-blue-900 py-2">
              รวม: 
              <span class="text-orange-500">฿${totalPrice}</span>
            </div>
            <div class="flex gap-2 mt-3 text-base text-white">
              <button id="closeCartModal2"
                class=" bg-red-500 hover:bg-red-600 order-2 sm:order-1  w-1/2 py-2 rounded flex gap-3 items-center justify-center"
              >
                ✕
                <span>ลบสินค้าทั้งหมด</span>
              </button>
              <button id="checkoutBtn" 
                class=" bg-blue-600 hover:bg-blue-700 order-1 sm:order-2 w-1/2 py-2 rounded flex gap-2 items-center justify-center"
                ${cartItems.length === 0 ? 'disabled' : ''}
              >
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
