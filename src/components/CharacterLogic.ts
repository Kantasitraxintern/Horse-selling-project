export class Character { // โครงสร้างข้อมูลตัวละครหนึ่งตัว
  name: string; // ชื่อ
  va: string; // นักพากย์ (Voice Actor)
  color: string; // สีพื้นหลังของการ์ด
  image: string; // ชื่อไฟล์รูปภาพ
  price: number; // ราคา

  constructor(name: string, va: string, color: string, image: string, price: number) {
    this.name = name; // กำหนดชื่อ
    this.va = va; // กำหนดนักพากย์
    this.color = color; // กำหนดสีพื้นหลัง
    this.image = image; // กำหนดชื่อไฟล์รูป
    this.price = price; // กำหนดราคา
  }

  get imageUrl(): string { // คืน URL ของรูปภาพที่พร้อมใช้งานบนเว็บ
    return `/Image/${this.image}`; // ประกอบพาธไปยังโฟลเดอร์ Image
  }
}

// โหลดข้อมูลตัวละครจากไฟล์ CSV แล้วแปลงเป็นอาเรย์ของ Character
export async function loadCharacters(): Promise<Character[]> {
  const res = await fetch("/characters.csv"); // ขอข้อมูลไฟล์ CSV จากเซิร์ฟเวอร์
  const text = await res.text(); // อ่านเป็นข้อความดิบ

  const lines = text.trim().split("\n"); // ตัดช่องว่างหัวท้ายและแบ่งตามบรรทัด
  const dataLines = lines.slice(1); // ตัดบรรทัดหัว (header) ออก

  return dataLines.map(line => {
    const [name, va, color, image, price] = line.split(",").map(s => s.trim()); // แยกคอลัมน์ด้วยคอมมา
    return new Character(name, va, color, image, parseFloat(price)); // สร้างออบเจกต์ Character แต่ละตัว
  });
}
