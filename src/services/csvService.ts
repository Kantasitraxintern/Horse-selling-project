import Papa from 'papaparse';
import { Character } from '../types';

export class CsvService {
  static async loadCharactersFromCSV(): Promise<Character[]> {
    try {
      const response = await fetch('./src/characters.csv');
      const csvText = await response.text();
      const result = Papa.parse(csvText, { header: true });
      
      return (result.data as Character[])
        .filter(c => c.name && c.image)
        .map((c, index) => ({
          ...c,
          id: index + 1, // Add temporary ID for frontend use
        }));
    } catch (error) {
      console.error('Error loading CSV:', error);
      return [];
    }
  }
}
