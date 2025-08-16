import './style.css'

type Character = {
  name: string;
  va: string;
  color: string;    // background color for the avatar block
};

// Minimal set from the screenshot
const CHARACTERS: Character[] = [
  { name: 'Special Week', va: 'Azumi Waki', color: '#ff8fb1' },
  { name: 'Silence Suzuka', va: 'Marika Kohno', color: '#2ecc71' },
  { name: 'Tokai Teio', va: 'Machico', color: '#4aa3ff' },
  { name: 'Maruzensky', va: 'Lynn', color: '#ff6b6b' },
  { name: 'Fuji Kiseki', va: 'Eriko Matsui', color: '#333e48' },
  { name: 'Oguri Cap', va: 'Tomoyo Takayanagi', color: '#3da7ff' },
  { name: 'Gold Ship', va: 'Hitomi Ueda', color: '#ff6464' },
  { name: 'Vodka', va: 'Ayaka Ohashi', color: '#f5b700' },
  { name: 'Daiwa Scarlet', va: 'Chisa Kimura', color: '#ff6aa8' },
  { name: 'Taiki Shuttle', va: 'Yuka Otsubo', color: '#7ed957' },
  { name: 'Grass Wonder', va: 'Rena Maeda', color: '#6b78ff' },
  { name: 'Hishi Amazon', va: 'Yuiko Tatsumi', color: '#ff7a59' },
  { name: 'Mejiro McQueen', va: 'Saori Oonishi', color: '#20d3d0' },
  { name: 'El Condor Pasa', va: 'Minami Takahashi', color: '#ff8a00' },
];

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

function cardTemplate(c: Character): string {
  const img = avatarDataURL(c.name, c.color);
  return `<article class="card" tabindex="0" aria-label="${c.name} card">
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

// events
searchInput.addEventListener('input', () => render(getFilteredSorted()));
searchBtn.addEventListener('click', () => render(getFilteredSorted()));
sortSelect.addEventListener('change', () => render(getFilteredSorted()));

// first paint
render(CHARACTERS);