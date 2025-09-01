// src/cart.ts — ลอจิกจัดการตะกร้าสินค้า (ข้อมูลเท่านั้น ไม่ยุ่งกับ DOM)
export interface CartItem { // โครงสร้างข้อมูลสินค้าหนึ่งรายการในตะกร้า
  name: string; // ชื่อสินค้า
  va: string; // นักพากย์ (ประกอบการแสดงผล)
  price: number; // ราคาต่อหน่วย
  image: string; // พาธ/URL รูปภาพ
  qty: number; // จำนวนที่เลือก
}

export class Cart { // คลาสสำหรับเพิ่ม/ลด/ลบ และคำนวณยอดรวม
  private items: CartItem[] = []; // เก็บรายการทั้งหมดในตะกร้า

  add(item: Omit<CartItem, "qty">) { // เพิ่มสินค้า (ถ้ามีอยู่แล้วจะเพิ่มจำนวน)
    const existing = this.items.find(i => i.name === item.name); // หาสินค้าชื่อซ้ำ
    if (existing) {
      existing.qty++; // เจอแล้วเพิ่มจำนวน
    } else {
      this.items.push({ ...item, qty: 1 }); // ไม่เจอให้เพิ่มใหม่โดยตั้ง qty=1
    }
  }

  remove(name: string) { // ลบสินค้าทั้งรายการตามชื่อ
    this.items = this.items.filter(i => i.name !== name);
  }

  increase(name: string) { // เพิ่มจำนวนตามชื่อ
    const item = this.items.find(i => i.name === name);
    if (item) item.qty++;
  }

  decrease(name: string) { // ลดจำนวนตามชื่อ (ถ้าเหลือ 0 จะลบทิ้ง)
    const item = this.items.find(i => i.name === name);
    if (item) {
      item.qty--; // ลดจำนวนลง 1
      if (item.qty <= 0) this.remove(name); // ถ้าน้อยกว่าหรือเท่ากับ 0 ให้ลบรายการออก
    }
  }

  clear() { // ล้างตะกร้าทั้งหมด
    this.items = [];
  }

  getItems() { // คืนรายการทั้งหมดในตะกร้า
    return this.items;
  }

  getTotalPrice() { // รวมยอดราคา (ราคา x จำนวน) ของทุกรายการ
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }
}
