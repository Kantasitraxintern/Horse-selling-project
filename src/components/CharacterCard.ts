import { Character } from '../types';
import { getCharacterImage } from '../utils/helpers';
import { PRICE_PER_CHARACTER } from '../utils/constants';

export class CharacterCard {
  static render(character: Character): string {
    const img = getCharacterImage(character.name, character.image);
    
    return `
      <article class="card shop-card group bg-white rounded-xl shadow hover:shadow-lg border border-gray-200 overflow-hidden flex flex-col transition-transform duration-150" 
               tabindex="0" 
               aria-label="${character.name} card">
        <div class="card-thumb aspect-[4/5] bg-gray-50 flex items-center justify-center overflow-hidden">
          <img alt="${character.name}" 
               src="${img}" 
               class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200" />
        </div>
        <div class="card-meta flex-1 flex flex-col p-4 border-t border-gray-100">
          <h3 class="card-title text-lg font-bold text-blue-900 mb-1">${character.name}</h3>
          <p class="card-sub text-xs text-gray-400 mb-2">VA: ${character.va}</p>
          <div class="shop-meta flex items-center justify-between mt-auto">
            <span class="price text-orange-500 text-lg font-bold">฿${PRICE_PER_CHARACTER}</span>
            <button class="buy-btn bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white font-bold rounded-lg px-4 py-1.5 text-sm shadow transition" 
                    onclick="event.stopPropagation();window.__addToCart('${character.name}')">
              หยิบใส่ตะกร้า
            </button>
          </div>
        </div>
      </article>
    `;
  }
}
