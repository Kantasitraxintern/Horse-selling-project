# 🐎 Umamusume Character Shop

โปรเจคร้านค้าตัวละคร Umamusume ที่สร้างด้วย TypeScript, Vite, และ Express.js

## ✨ Features

- 🎭 แสดงรายการตัวละคร Umamusume พร้อมรูปภาพ
- 🔍 ค้นหาและเรียงลำดับตัวละคร
- 🛒 ระบบตะกร้าสินค้า
- 📱 Responsive Design
- 🚀 Fast Development with Vite
- 🗄️ SQLite Database
- 🔌 RESTful API

## 🏗️ Project Structure

```
src/
├── components/          # UI Components
│   ├── CharacterCard.ts
│   ├── CartModal.ts
│   └── CharacterDetail.ts
├── services/           # Business Logic & API
│   ├── api.ts
│   ├── csvService.ts
│   └── cartService.ts
├── types/              # TypeScript Types
│   └── index.ts
├── utils/              # Utility Functions
│   ├── constants.ts
│   └── helpers.ts
├── main.ts             # Main Application
└── backend.js          # Backend Server
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm หรือ yarn

### Installation

1. Clone โปรเจค
```bash
git clone <repository-url>
cd horse-selling-project
```

2. ติดตั้ง dependencies
```bash
npm install
```

3. เริ่มต้นฐานข้อมูล
```bash
npm run init-db
```

4. รันโปรเจค
```bash
npm run dev
```

โปรเจคจะเปิดที่:
- Frontend: http://localhost:5173
- Backend: http://localhost:3001

## 📚 API Documentation

### Characters

- `GET /api/characters` - ดึงรายการตัวละครทั้งหมด
- `GET /api/characters/:id` - ดึงข้อมูลตัวละครตาม ID
- `POST /api/characters` - เพิ่มตัวละครใหม่
- `PUT /api/characters/:id` - แก้ไขข้อมูลตัวละคร
- `DELETE /api/characters/:id` - ลบตัวละคร

### Health Check

- `GET /api/health` - ตรวจสอบสถานะเซิร์ฟเวอร์

## 🛠️ Development

### Scripts

- `npm run dev` - รันโปรเจคในโหมด development
- `npm run build` - build โปรเจคสำหรับ production
- `npm run preview` - preview build ที่สร้างแล้ว
- `npm run lint` - ตรวจสอบ code quality

### Code Style

- ใช้ TypeScript สำหรับ type safety
- แยกส่วนการทำงานเป็น modules
- ใช้ ES6+ features
- ใช้ async/await สำหรับ asynchronous operations

## 🎨 UI Components

### CharacterCard
แสดงข้อมูลตัวละครในรูปแบบการ์ด พร้อมปุ่มเพิ่มลงตะกร้า

### CartModal
Modal สำหรับแสดงตะกร้าสินค้า พร้อมการคำนวณราคา

### CharacterDetail
แสดงรายละเอียดตัวละครแบบเต็มรูปแบบ

## 🔧 Configuration

### Environment Variables

- `PORT` - Port สำหรับ backend server (default: 3001)

### Database

ใช้ SQLite เป็นฐานข้อมูล ไฟล์จะถูกสร้างที่ `./characters.db`

## 📱 Responsive Design

- Mobile-first approach
- Grid layout ที่ปรับตัวตามขนาดหน้าจอ
- Touch-friendly interactions

## 🚀 Performance

- Lazy loading สำหรับรูปภาพ
- Database indexing
- Efficient DOM manipulation
- Optimized bundle size

## 🤝 Contributing

1. Fork โปรเจค
2. สร้าง feature branch
3. Commit การเปลี่ยนแปลง
4. Push ไปยัง branch
5. สร้าง Pull Request

## 📄 License

โปรเจคนี้สร้างขึ้นเพื่อการศึกษาและ demo เท่านั้น

## 🙏 Acknowledgments

- UI Design inspired by [umamusume.com](https://umamusume.com/characters/)
- Icons จาก Heroicons
- Fonts จาก system fonts
