import { Character } from "./CharacterLogic"; // นำเข้า type และเมธอดช่วยของตัวละคร

// สร้าง DOM การ์ดตัวละครจากข้อมูลที่รับเข้ามา และคืนค่าเป็น HTMLElement
export function CharacterCard(character: Character): HTMLElement {
  const card = document.createElement("div"); // กล่องการ์ดหลัก
  card.className = "rounded-2xl shadow bg-white overflow-hidden hover:scale-105 transition"; // สไตล์การ์ด (โค้ง/เงา/แอนิเมชัน)

  // ฝังโครงสร้าง HTML ของการ์ด (ส่วนรูป + ส่วนรายละเอียด + ปุ่มเพิ่มลงตะกร้า)
  // หมายเหตุ: ไม่ใส่คอมเมนต์ภายในแบ็กทิกเพื่อไม่ให้รบกวน HTML ที่เรนเดอร์
  card.innerHTML = `
    <div class="flex items-center justify-center overflow-hidden " 
      style="background:${character.color}">
      <img src="${character.imageUrl}" alt="${character.name}" 
        class="aspect-[4/5] w-full h-full" />
    </div>
    <div class="p-4 ">
      <h2 class="font-bold text-lg text-blue-900 whitespace-nowrap">${character.name}</h2>
      <p class="text-sm text-gray-500">VA: ${character.va}</p>
      <p class="mt-2 font-bold text-orange-700">฿${character.price.toFixed(2)}</p>
      <button 
        class="addToCartBtn mt-3 w-full bg-orange-500 text-white rounded-xl px-3 py-2 font-bold hover:bg-orange-600"
        data-name="${character.name}"
        data-va="${character.va}"
        data-price="${character.price.toFixed(2)}"
        data-image="${character.imageUrl}"
        >
        Add to Cart
      </button>
    </div>
  `;

  return card; // คืนค่าองค์ประกอบ DOM ที่พร้อมใช้งาน
}
