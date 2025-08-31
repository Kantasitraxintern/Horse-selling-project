import { Character, ApiResponse } from '../types';

const API_BASE_URL = 'http://localhost:3001';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return { data };
    } catch (error) {
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async getCharacters(): Promise<ApiResponse<Character[]>> {
    return this.request<Character[]>('/characters');
  }

  async createCharacter(character: Omit<Character, 'id'>): Promise<ApiResponse<Character>> {
    return this.request<Character>('/characters', {
      method: 'POST',
      body: JSON.stringify(character),
    });
  }

  async updateCharacter(id: number, character: Partial<Character>): Promise<ApiResponse<Character>> {
    return this.request<Character>(`/characters/${id}`, {
      method: 'PUT',
      body: JSON.stringify(character),
    });
  }

  async deleteCharacter(id: number): Promise<ApiResponse<{ deleted: number }>> {
    return this.request<{ deleted: number }>(`/characters/${id}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
