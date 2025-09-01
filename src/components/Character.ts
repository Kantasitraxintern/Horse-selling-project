import { Character } from "./CharacterLogic";

export function CharacterCard(character: Character): HTMLElement {
  const card = document.createElement("div");
  card.className = "rounded-2xl shadow bg-white overflow-hidden hover:scale-105 transition";

  card.innerHTML = `
    <div class="flex items-center justify-center overflow-hidden " 
      style="background:${character.color}">
      <img src="${character.imageUrl}" alt="${character.name}" 
        class="aspect-[4/5] w-full h-full" />
    </div>
    <div class="p-4 ">
      <h2 class="font-bold text-lg text-blue-900 whitespace-nowrap">${character.name}</h2>
      <p class="text-sm text-gray-500">VA: ${character.va}</p>
      <p class="mt-2 font-bold text-orange-700">฿${character.price.toFixed(2)}</p>
      <button 
        class="addToCartBtn mt-3 w-full bg-orange-500 text-white rounded-xl px-3 py-2 font-bold hover:bg-orange-600"
        data-name="${character.name}"
        data-va="${character.va}"
        data-price="${character.price.toFixed(2)}"
        data-image="${character.imageUrl}"
        >
        Add to Cart
      </button>
    </div>
  `;

  return card;
}