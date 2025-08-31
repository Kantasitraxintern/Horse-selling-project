import { Character } from '../types';

export class CharacterDetail {
  static render(character: Character): string {
    return `
      <div class="detail-card">
        <button class="back-btn" onclick="window.location.hash=''">← Back</button>
        <div class="detail-thumb">
          <img src='./src/image/${character.image}' alt="${character.name}" />
        </div>
        <h2>${character.name}</h2>
        <p><b>VA:</b> ${character.va}</p>
        <p><b>Color:</b> <span style='background:${character.color};padding:0 1em;border-radius:4px;'>${character.color}</span></p>
      </div>
    `;
  }
}
