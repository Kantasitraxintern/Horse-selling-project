//---------- Load ----------// ส่วนโหลดและเรนเดอร์รายการตัวละคร
import { CharacterCard } from "./components/Character"; // ฟังก์ชันสร้าง DOM การ์ดตัวละคร
import type { Character } from "./components/CharacterLogic"; // นำเข้าเฉพาะชนิดข้อมูลเพื่อช่วยตรวจสอบ Type
import { loadCharacters } from "./components/CharacterLogic"; // ฟังก์ชันโหลดข้อมูลจากไฟล์ CSV

const grid = document.getElementById("grid")!; // อ้างอิงคอนเทนเนอร์กริดที่จะแสดงการ์ด (ยืนยันไม่เป็น null ด้วย !)
let characters: Character[] = []; // เก็บข้อมูลตัวละครทั้งหมดที่โหลดมา
let filtered: Character[] = []; // เก็บชุดข้อมูลที่ผ่านการค้นหา/เรียงแล้วเพื่อแสดงผล

async function init() {
  characters = await loadCharacters(); // โหลดข้อมูลตัวละครจาก CSV (async)
  filtered = [...characters]; // เริ่มต้นให้ผลลัพธ์แสดงทั้งหมดก่อน
  renderGrid(); // วาดการ์ดลงหน้าเว็บครั้งแรก
}

function renderGrid() {
  grid.innerHTML = ""; // เคลียร์กริดก่อนเรนเดอร์ใหม่
  filtered.forEach(c => {
    grid.appendChild(CharacterCard(c)); // สร้างการ์ดสำหรับแต่ละตัวละครแล้วเพิ่มเข้า DOM
  });
  setupAddToCartListeners(); // หลังเรนเดอร์เสร็จ ผูกอีเวนต์ให้ปุ่ม Add to Cart ที่เพิ่งถูกเพิ่มเข้ามา
}

function setupAddToCartListeners() {
  document.querySelectorAll(".addToCartBtn").forEach(btn => {
    btn.addEventListener("click", () => {
      const element = btn as HTMLElement; // แคสต์เป็น HTMLElement เพื่อเข้าถึง dataset
      const name = element.dataset.name!; // อ่านชื่อสินค้าจาก data-name
      const va = element.dataset.va!; // อ่านนักพากย์จาก data-va
      const price = Number(element.dataset.price!); // แปลงราคาจากสตริงเป็นตัวเลข
      const image = element.dataset.image!; // อ่านพาธรูปจาก data-image
      cart.add({ name, va, price, image }); // เพิ่มสินค้าเข้าตะกร้า
      updateCartCount(); // อัปเดต badge จำนวนสินค้า
      // console.log(name, va, price, image); // ดีบัก (ปิดไว้)
    });
  });
}

init(); // เริ่มทำงานเมื่อโหลดสคริปต์

//---------- Sort ----------// ส่วนเรียงลำดับรายการ
const sortSelect = document.getElementById("sortSelect") as HTMLSelectElement; // select สำหรับเลือกวิธีการเรียง

function applySort() {
  const sortValue = sortSelect.value; // ค่าที่ผู้ใช้เลือก ("az" หรือ "za")
  if (sortValue === "az") {
    filtered.sort((a, b) => a.name.localeCompare(b.name)); // เรียง A→Z ตามชื่อ
  } else if (sortValue === "za") {
    filtered.sort((a, b) => b.name.localeCompare(a.name)); // เรียง Z→A ตามชื่อ
  }
  renderGrid(); // วาดกริดใหม่หลังเรียงเสร็จ
}

sortSelect.addEventListener("change", applySort); // เมื่อเปลี่ยนตัวเลือก ให้ทำการเรียงทันที

//---------- Search ----------// ส่วนค้นหา
const searchInput = document.getElementById("searchInput") as HTMLInputElement; // ช่องค้นหาข้อความ

function applySearch() {
  const q = searchInput.value.toLowerCase(); // แปลงข้อความค้นหาเป็นตัวพิมพ์เล็ก
  filtered = characters.filter(c => c.name.toLowerCase().includes(q)); // กรองรายชื่อตามคำค้น
  applySort(); // เรียกใช้การเรียงต่อเพื่อให้ลิสต์อัปเดตสอดคล้อง
}

searchInput.addEventListener("input", applySearch); // ค้นหาแบบเรียลไทม์เมื่อพิมพ์

//---------- Cart Popup ----------// ส่วนโมดัลตะกร้าสินค้า
import { Cart } from "./components/CartLogic"; // คลาสลอจิกตะกร้า (เพิ่ม/ลด/ลบ/รวมราคา)
import { renderCartModal } from "./components/Cart"; // ฟังก์ชันคืนค่า HTML ของโมดัล

const cart = new Cart(); // สร้างตะกร้าใช้งานในหน้า

function openCartModal() {
  const modal = document.createElement("div"); // สร้าง wrapper สำหรับโมดัล
  modal.innerHTML = renderCartModal(cart.getItems(), cart.getTotalPrice()); // ใส่ HTML โมดัลโดยอิงรายการ+ราคารวมปัจจุบัน
  document.body.appendChild(modal); // แสดงโมดัลบนหน้า
  updateCartCount(); // อัปเดต badge เผื่อจำนวนเปลี่ยน

  // increase qty: ปุ่มเพิ่มจำนวนสินค้าในแต่ละรายการ
  modal.querySelectorAll(".increaseQty").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = (btn as HTMLElement).dataset.name!; // อ่านชื่อรายการจากปุ่ม
      cart.increase(name); // เพิ่มจำนวน
      modal.remove(); // ลบโมดัลเก่าเพื่อรีเรนเดอร์ใหม่
      openCartModal(); // เปิดใหม่ (อัปเดตจำนวน/ราคา)
    });
  });

  // decrease qty: ปุ่มลดจำนวนสินค้าในแต่ละรายการ
  modal.querySelectorAll(".decreaseQty").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = (btn as HTMLElement).dataset.name!; // อ่านชื่อรายการจากปุ่ม
      cart.decrease(name); // ลดจำนวน
      modal.remove(); // ลบแล้วเปิดใหม่เพื่อสะท้อนสถานะล่าสุด
      openCartModal();
    });
  });

  // remove item: ปุ่มลบรายการออกจากตะกร้า
  modal.querySelectorAll(".removeItem").forEach(btn => {
    btn.addEventListener("click", () => {
      const name = (btn as HTMLElement).dataset.name!; // อ่านชื่อรายการจากปุ่ม
      cart.remove(name); // ลบรายการออกจากตะกร้า
      modal.remove(); // รีเฟรชโมดัล
      openCartModal();
    });
  });

  // ปุ่มปิด (✕)
  modal.querySelector("#closeCartModal")?.addEventListener("click", () => {
    modal.remove(); // ปิดโมดัลทันที
  });

  // ปุ่มลบทั้งหมด
  modal.querySelector("#closeCartModal2")?.addEventListener("click", () => {
    if (confirm("คุณต้องการลบสินค้าทั้งหมดออกจากตะกร้าหรือไม่?")) {
      cart.clear(); // ล้างตะกร้าทั้งหมด
      modal.remove(); // ปิดโมดัลก่อน
      openCartModal(); // เปิดใหม่ (ตอนนี้ตะกร้าว่าง)
    }
  });

  // ปุ่ม checkout
  modal.querySelector("#checkoutBtn")?.addEventListener("click", () => {
    alert("ขอบคุณสำหรับที่ซื้อสินค้า"); // แจ้งผู้ใช้ว่าซื้อสำเร็จ (เดโม)
    cart.clear(); // เคลียร์ตะกร้าหลังสั่งซื้อ
    modal.remove(); // ปิดโมดัล
  });
}

document.getElementById("cartBtn")?.addEventListener("click", () => {
    openCartModal(); // เปิดตะกร้าเมื่อกดปุ่มไอคอนตะกร้า
});

function updateCartCount() {
  const cartCountElement = document.getElementById("cartCount"); // badge ที่แสดงจำนวนสินค้าทั้งหมด
  if (cartCountElement) {
    const totalItems = cart.getItems().reduce((sum, item) => sum + item.qty, 0); // รวมจำนวนทั้งหมด
    cartCountElement.textContent = totalItems.toString(); // แสดงตัวเลขใน badge
    
    // ซ่อน badge ถ้าไม่มีสินค้า
    if (totalItems === 0) {
      cartCountElement.style.display = "none"; // ไม่ต้องแสดงเมื่อ 0 ชิ้น
    } else {
      cartCountElement.style.display = "inline-block"; // แสดงเมื่อมีสินค้า
    }
  }
}
