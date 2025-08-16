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

function cardTemplate(c: Character): string {
  let img: string;
  const imgFile = CHARACTER_IMAGES[c.name];
  if (imgFile) {
    img = `./src/image/${imgFile}`;
  } else {
    img = avatarDataURL(c.name, c.color);
  }
  return `<article class="card" tabindex="0" aria-label="${c.name} card" onclick="window.location.hash='#/character/${encodeURIComponent(c.name)}'">
    <div class="card-thumb" style="background:${c.color}">
      <img alt="${c.name}" src="${img}" />
      <div class="border"></div>
    </div>
    <div class="card-meta">
      <h3 class="card-title">${c.name}</h3>
      <p class="card-sub">VA: ${c.va}</p>
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