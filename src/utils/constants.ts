export const CHARACTER_IMAGES: Record<string, string> = {
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

export const API_ENDPOINTS = {
  CHARACTERS: '/characters',
  CHARACTER_BY_ID: (id: number) => `/characters/${id}`,
};

export const SORT_OPTIONS = {
  DEFAULT: 'default',
  A_TO_Z: 'az',
  Z_TO_A: 'za',
} as const;

export const PRICE_PER_CHARACTER = 1;
