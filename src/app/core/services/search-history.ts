import { Injectable, signal } from '@angular/core';
import { CitySuggestion } from '../models/weather.model';

const STORAGE_KEY = 'weather-search-history';
const MAX_ITEMS = 5;

@Injectable({
  providedIn: 'root'
})
export class SearchHistoryService {
  private history = signal<CitySuggestion[]>(this.loadFromStorage());

  readonly recentCities = this.history.asReadonly();

  private loadFromStorage(): CitySuggestion[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(cities: CitySuggestion[]) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  }

  add(city: CitySuggestion) {
    const current = this.history();

    const filtered = current.filter(
      c => !(c.lat === city.lat && c.lon === city.lon)
    );

    const updated = [city, ...filtered].slice(0, MAX_ITEMS);

    this.history.set(updated);
    this.saveToStorage(updated);
  }

  clear() {
    this.history.set([]);
    this.saveToStorage([]);
  }
}
