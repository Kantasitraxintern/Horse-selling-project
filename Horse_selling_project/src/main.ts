import './style.css'
import Papa from 'papaparse';

type Character = {
  name: string;
  va: string;
  color: string;    // background color for the avatar block
  image: string; // New field for image filename
};

// ลบ CHARACTERS เดิมและโหลดจาก CSV
let CHARACTERS: Character[] = [];

function loadCharactersFromCSV() {
  fetch('./src/characters.csv')
    .then(res => res.text())
    .then(csvText => {
      const result = Papa.parse(csvText, { header: true });
      CHARACTERS = (result.data as Character[]).filter(c => c.name && c.image);
      render(CHARACTERS);
    });
}

// mapping ชื่อ character -> ไฟล์รูป (เหมือนเดิม)
const CHARACTER_IMAGES: Record<string, string> = {
  'Agnestachyon': 'agnestachyon_list.png',
  'Air Groove': 'airgroove_list.png',
  'Daiwa Scarlet': 'daiwascarlet_list.png',
  'Fine Motion': 'finemotion_list.png',
  'Fuji Kiseki': 'fujikiseki_list.png',
  'Gold Ship': 'goldship_list.png',
  'Grass Wonder': 'grasswonder_list.png',
  'Haru Urara': 'haruurara_list.png',
  'King Halo': 'kinghalo_list.png',
  'Maruzensky': 'maruzensky_list.png',
  'Mayano Top Gun': 'mayanotopgun_list.png',
  'Mejiro McQueen': 'mejiromcqueen_list.png',
  'Mejiro Ryan': 'mejiroryan_list.png',
  'Mihono Bourbon': 'mihonobourbon_list.png',
  'Nice Nature': 'nicenature_list.png',
  'Oguri Cap': 'oguricap_list.png',
  'Rice Shower': 'riceshower_01_list.png',
  'Sakura Bakushin O': 'sakurabakushino_list.png',
  'Silence Suzuka': 'silencesuzuka_list.png',
  'Special Week': 'specialweek_list.png',
  'Super Creek': 'supercreek_list.png',
  'Symboli Rudolf': 'symbolirudolf_list.png',
  'Taiki Shuttle': 'taikishuttle_list.png',
  'TM Opera O': 'tmoperao_list.png',
  'Tokai Teio': 'tokaiteio_list.png',
  'Vodka': 'vodka_list.png',
};

const grid = document.querySelector<HTMLDivElement>('#grid')!;
const searchInput = document.querySelector<HTMLInputElement>('#searchInput')!;
const searchBtn = document.querySelector<HTMLButtonElement>('#searchBtn')!;
const sortSelect = document.querySelector<HTMLSelectElement>('#sortSelect')!;

function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return (first + last).toUpperCase();
}

function avatarDataURL(name: string, color: string): string {
  const txt = initials(name);
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='750'>
    <defs>
      <linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop offset='0%' stop-color='${color}' stop-opacity='1'/>
        <stop offset='100%' stop-color='#ffffff' stop-opacity='0.2'/>
      </linearGradient>
    </defs>
    <rect width='100%' height='100%' fill='url(#g)' />
    <text x='50%' y='55%' dominant-baseline='middle' text-anchor='middle'
      font-family='system-ui,Segoe UI,Roboto,Helvetica,Arial' font-size='160' font-weight='900'
      fill='white' opacity='0.9'>${txt}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function showCharacterDetail(name: string) {
  const c = CHARACTERS.find(x => x.name === name);
  if (!c) return;
  grid.innerHTML = `
    <div class="detail-card">
      <button class="back-btn" onclick="window.location.hash=''">← Back</button>
      <div class="detail-thumb"><img src='./src/image/${c.image}' alt="${c.name}" /></div>
      <h2>${c.name}</h2>
      <p><b>VA:</b> ${c.va}</p>
      <p><b>Color:</b> <span style='background:${c.color};padding:0 1em;border-radius:4px;'>${c.color}</span></p>
    </div>
  `;
}

// --- Cart System ---
type CartItem = { name: string; qty: number; image: string };
let CART: Record<string, CartItem> = {};

function addToCart(c: Character) {
  if (!CART[c.name]) {
    CART[c.name] = { name: c.name, qty: 1, image: c.image };
  } else {
    CART[c.name].qty += 1;
  }
  updateCartCount();
}

function updateCartCount() {
  const count = Object.values(CART).reduce((sum, item) => sum + item.qty, 0);
  const badge = document.getElementById('cartCount');
  if (badge) badge.textContent = count.toString();
}

function showCartModal() {
  const total = Object.values(CART).reduce((sum, item) => sum + item.qty, 0);
  const totalPrice = total; // ทุกตัวราคา 1
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black/40 flex items-center justify-center z-[9999] animate-fadein';
  modal.innerHTML = `
    <div class="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative border border-orange-100 ring-2 ring-orange-100 transition-all scale-100">
      <button class="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold transition-colors" id="closeCartModal" title="ปิด">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
      </button>
      <h2 class="text-2xl font-extrabold mb-4 text-orange-500 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7 text-orange-400"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437m0 0A2.25 2.25 0 0 0 7.25 7.5h9.086a2.25 2.25 0 0 0 2.144-1.727l1.357-5.429A1.125 1.125 0 0 0 18.75 0H5.25a1.125 1.125 0 0 0-1.07.836l-.383 1.437z" /><circle cx="9" cy="21" r="1.5" /><circle cx="17" cy="21" r="1.5" /></svg>
        ตะกร้าสินค้า
      </h2>
      <div class="divide-y max-h-72 overflow-y-auto pr-1">
        ${Object.values(CART).length === 0 ? '<div class="py-8 text-center text-gray-400">ไม่มีสินค้าในตะกร้า</div>' :
          Object.values(CART).map(item => `
            <div class="flex items-center gap-4 py-3">
              <img src="./src/image/${item.image}" class="w-14 h-14 rounded-lg object-cover border shadow" />
              <div class="flex-1">
                <div class="font-bold text-blue-900">${item.name}</div>
                <div class="text-sm text-gray-500">฿1 × ${item.qty}</div>
              </div>
              <div class="font-bold text-orange-500">฿${item.qty}</div>
            </div>
          `).join('')
        }
      </div>
      <div class="mt-6 flex flex-col gap-2 sm:flex-row justify-between items-center border-t pt-4">
        <div class="text-lg font-bold text-blue-900 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6 text-orange-400"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3z" /><path stroke-linecap="round" stroke-linejoin="round" d="M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z" /></svg>
          รวม: <span class="text-orange-500">฿${totalPrice}</span>
        </div>
        <div class="flex gap-2 mt-2 sm:mt-0">
          <button class="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 shadow order-2 sm:order-1 transition" id="closeCartModal2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            ปิด
          </button>
          <button class="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2 rounded-lg flex items-center gap-2 shadow order-1 sm:order-2 disabled:opacity-50 transition" id="checkoutBtn" ${Object.values(CART).length === 0 ? 'disabled' : ''}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-5 h-5"><path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a5 5 0 0 0-10 0v2M5 9h14l1 12H4L5 9z" /></svg>
            ซื้อสินค้า
          </button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  function close() { modal.remove(); }
  modal.querySelector('#closeCartModal')?.addEventListener('click', close);
  modal.querySelector('#closeCartModal2')?.addEventListener('click', close);
  modal.querySelector('#checkoutBtn')?.addEventListener('click', () => {
    if (Object.values(CART).length === 0) return;
    alert('ขอบคุณที่ซื้อสินค้า!');
    CART = {};
    updateCartCount();
    close();
  });
}

document.getElementById('cartBtn')?.addEventListener('click', showCartModal);
// --- End Cart System ---

function cardTemplate(c: Character): string {
  let img: string;
  const imgFile = CHARACTER_IMAGES[c.name];
  if (imgFile) {
    img = `./src/image/${imgFile}`;
  } else {
    img = avatarDataURL(c.name, c.color);
  }
  return `<article class="card shop-card group bg-white rounded-xl shadow hover:shadow-lg border border-gray-200 overflow-hidden flex flex-col transition-transform duration-150" tabindex="0" aria-label="${c.name} card">
    <div class="card-thumb aspect-[4/5] bg-gray-50 flex items-center justify-center overflow-hidden">
      <img alt="${c.name}" src="${img}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
    </div>
    <div class="card-meta flex-1 flex flex-col p-4 border-t border-gray-100">
      <h3 class="card-title text-lg font-bold text-blue-900 mb-1">${c.name}</h3>
      <p class="card-sub text-xs text-gray-400 mb-2">VA: ${c.va}</p>
      <div class="shop-meta flex items-center justify-between mt-auto">
        <span class="price text-orange-500 text-lg font-bold">฿1</span>
        <button class="buy-btn bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold rounded-lg px-4 py-1.5 text-sm shadow transition" onclick="event.stopPropagation();window.__addToCart('${c.name}')">หยิบใส่ตะกร้า</button>
      </div>
    </div>
  </article>`;
}

function render(list: Character[]) {
  grid.innerHTML = list.map(cardTemplate).join('');
}

function getFilteredSorted(): Character[] {
  const q = searchInput.value.trim().toLowerCase();
  let list = CHARACTERS.filter(c =>
    c.name.toLowerCase().includes(q) || c.va.toLowerCase().includes(q)
  );
  const s = sortSelect.value;
  if (s === 'az') list = [...list].sort((a,b)=>a.name.localeCompare(b.name));
  if (s === 'za') list = [...list].sort((a,b)=>b.name.localeCompare(a.name));
  return list;
}

function handleHashChange() {
  const hash = window.location.hash;
  if (hash.startsWith('#/character/')) {
    const name = decodeURIComponent(hash.replace('#/character/', ''));
    showCharacterDetail(name);
  } else {
    render(getFilteredSorted());
  }
}

// events
searchInput.addEventListener('input', () => render(getFilteredSorted()));
searchBtn.addEventListener('click', () => render(getFilteredSorted()));
sortSelect.addEventListener('change', () => render(getFilteredSorted()));

window.addEventListener('hashchange', handleHashChange);
// first paint
loadCharactersFromCSV();

// เพิ่ม global function สำหรับปุ่มหยิบใส่ตะกร้า
(window as any).__addToCart = (name: string) => {
  const c = CHARACTERS.find(x => x.name === name);
  if (c) addToCart(c);
};

// เพิ่ม animation fadein ให้ modal
const style = document.createElement('style');
style.innerHTML = `@keyframes fadein { from { opacity: 0; transform: scale(0.96);} to { opacity: 1; transform: scale(1);} } .animate-fadein { animation: fadein 0.18s cubic-bezier(.4,2,.6,1) both; }`;
document.head.appendChild(style);