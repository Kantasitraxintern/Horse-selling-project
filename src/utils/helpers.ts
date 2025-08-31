import { Character, SortOption } from '../types';

export function initials(name: string): string {
  const parts = name.split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return (first + last).toUpperCase();
}

export function avatarDataURL(name: string, color: string): string {
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

export function getCharacterImage(name: string, image: string): string {
  const CHARACTER_IMAGES: Record<string, string> = {
    'Agnes tachyon': 'agnestachyon_list.png',
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

  const imgFile = CHARACTER_IMAGES[name];
  if (imgFile) {
    return `./src/image/${imgFile}`;
  } else {
    return avatarDataURL(name, image);
  }
}

export function filterAndSortCharacters(
  characters: Character[],
  query: string,
  sortBy: SortOption
): Character[] {
  let filtered = characters.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.va.toLowerCase().includes(query.toLowerCase())
  );

  switch (sortBy) {
    case 'az':
      filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'za':
      filtered.sort((a, b) => b.name.localeCompare(a.name));
      break;
    default:
      // Keep original order
      break;
  }

  return filtered;
}
