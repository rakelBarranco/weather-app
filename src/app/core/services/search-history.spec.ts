import { TestBed } from '@angular/core/testing';
import { SearchHistoryService } from './search-history';
import { CitySuggestion } from '../models/weather.model';

describe('SearchHistoryService', () => {
  let service: SearchHistoryService;

  const valencia: CitySuggestion = { name: 'Valencia', country: 'ES', lat: 39.47, lon: -0.38 };
  const madrid: CitySuggestion = { name: 'Madrid', country: 'ES', lat: 40.42, lon: -3.7 };
  const tokyo: CitySuggestion = { name: 'Tokyo', country: 'JP', lat: 35.68, lon: 139.69 };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({ providers: [SearchHistoryService] });
    service = TestBed.inject(SearchHistoryService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('debería empezar con el historial vacío', () => {
    expect(service.recentCities()).toEqual([]);
  });

  it('debería añadir una ciudad al historial', () => {
    service.add(valencia);
    expect(service.recentCities().length).toBe(1);
    expect(service.recentCities()[0].name).toBe('Valencia');
  });

  it('debería colocar la última ciudad añadida en primera posición', () => {
    service.add(valencia);
    service.add(madrid);

    expect(service.recentCities()[0].name).toBe('Madrid');
    expect(service.recentCities()[1].name).toBe('Valencia');
  });

  it('no debería duplicar una ciudad ya existente', () => {
    service.add(valencia);
    service.add(madrid);
    service.add(valencia);

    expect(service.recentCities().length).toBe(2);
    expect(service.recentCities()[0].name).toBe('Valencia');
  });

  it('debería mantener como máximo 5 ciudades', () => {
    const cities: CitySuggestion[] = Array.from({ length: 7 }, (_, i) => ({
      name: `Ciudad${i}`,
      country: 'ES',
      lat: i,
      lon: i,
    }));

    cities.forEach(c => service.add(c));

    expect(service.recentCities().length).toBe(5);
    expect(service.recentCities()[0].name).toBe('Ciudad6');
  });

  it('debería persistir el historial en localStorage', () => {
    service.add(tokyo);

    const stored = localStorage.getItem('weather-search-history');
    expect(stored).toBeTruthy();
    expect(JSON.parse(stored!)[0].name).toBe('Tokyo');
  });

  it('debería vaciar el historial al llamar a clear', () => {
    service.add(valencia);
    service.add(madrid);
    service.clear();

    expect(service.recentCities()).toEqual([]);
  });
});
