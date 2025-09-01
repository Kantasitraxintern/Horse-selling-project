export class Character {
  name: string;
  va: string;
  color: string;
  image: string;
  price: number;

  constructor(name: string, va: string, color: string, image: string, price: number) {
    this.name = name;
    this.va = va;
    this.color = color;
    this.image = image;
    this.price = price;
  }

  get imageUrl(): string {
    return `/Image/${this.image}`;
  }
}

export async function loadCharacters(): Promise<Character[]> {
  const res = await fetch("/characters.csv");
  const text = await res.text();

  const lines = text.trim().split("\n");
  const dataLines = lines.slice(1); 

  return dataLines.map(line => {
    const [name, va, color, image, price] = line.split(",").map(s => s.trim());
    return new Character(name, va, color, image, parseFloat(price));
  });
}
