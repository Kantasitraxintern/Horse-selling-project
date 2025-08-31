export interface Character {
  id?: number;
  name: string;
  va: string;
  color: string;
  image: string;
}

export interface CartItem {
  name: string;
  qty: number;
  image: string;
}

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
}

export type SortOption = 'default' | 'az' | 'za';

export interface SearchFilters {
  query: string;
  sortBy: SortOption;
}
