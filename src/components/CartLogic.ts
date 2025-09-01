// src/cart.ts
export interface CartItem {
  name: string;
  va: string;
  price: number;
  image: string;
  qty: number;
}

export class Cart {
  private items: CartItem[] = [];

  add(item: Omit<CartItem, "qty">) {
    const existing = this.items.find(i => i.name === item.name);
    if (existing) {
      existing.qty++;
    } else {
      this.items.push({ ...item, qty: 1 });
    }
  }

  remove(name: string) {
    this.items = this.items.filter(i => i.name !== name);
  }

  increase(name: string) {
    const item = this.items.find(i => i.name === name);
    if (item) item.qty++;
  }

  decrease(name: string) {
    const item = this.items.find(i => i.name === name);
    if (item) {
      item.qty--;
      if (item.qty <= 0) this.remove(name);
    }
  }

  clear() {
    this.items = [];
  }

  getItems() {
    return this.items;
  }

  getTotalPrice() {
    return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  }
}
