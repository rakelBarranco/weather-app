import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import WeatherViewComponent from './weather-view';
import { Weather } from '../../../core/models/weather.model';

describe('WeatherViewComponent', () => {
  let component: WeatherViewComponent;
  let fixture: ComponentFixture<WeatherViewComponent>;

  const buildWeather = (overrides: Partial<Weather> = {}): Weather => ({
    city: 'Valencia',
    country: 'ES',
    temp: 24,
    feelsLike: 26,
    humidity: 62,
    windSpeed: 13,
    description: 'cielo claro',
    icon: '01d',
    main: 'Clear',
    sunrise: 1700000000,
    sunset: 1700040000,
    timezone: 0,
    pressure: 1015,
    visibility: 10000,
    ...overrides,
  });

  beforeEach(async () => {
    localStorage.clear();

    await TestBed.configureTestingModule({
      imports: [WeatherViewComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherViewComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  describe('weatherType', () => {
    it('debería devolver clear cuando no hay datos', () => {
      expect(component.weatherType()).toBe('clear');
    });

    it('debería detectar lluvia', () => {
      component.weather.set(buildWeather({ main: 'Rain' }));
      expect(component.weatherType()).toBe('rain');
    });

    it('debería detectar llovizna como lluvia', () => {
      component.weather.set(buildWeather({ main: 'Drizzle' }));
      expect(component.weatherType()).toBe('rain');
    });

    it('debería detectar nieve', () => {
      component.weather.set(buildWeather({ main: 'Snow' }));
      expect(component.weatherType()).toBe('snow');
    });

    it('debería detectar nubes', () => {
      component.weather.set(buildWeather({ main: 'Clouds' }));
      expect(component.weatherType()).toBe('clouds');
    });

    it('debería detectar niebla', () => {
      component.weather.set(buildWeather({ main: 'Fog' }));
      expect(component.weatherType()).toBe('mist');
    });
  });

  describe('getDayName', () => {
    it('debería devolver el día de la semana abreviado en español', () => {
      const monday = new Date('2026-01-05T12:00:00Z').getTime() / 1000;
      expect(component.getDayName(monday).toLowerCase()).toContain('lun');
    });
  });

  describe('navegación con teclado', () => {
    beforeEach(() => {
      component.suggestions.set([
        { name: 'Valencia', country: 'ES', lat: 39.47, lon: -0.38 },
        { name: 'Madrid', country: 'ES', lat: 40.42, lon: -3.7 },
      ]);
    });

    it('debería avanzar el índice al pulsar flecha abajo', () => {
      component.onArrowDown();
      expect(component.highlightedIndex()).toBe(0);

      component.onArrowDown();
      expect(component.highlightedIndex()).toBe(1);
    });

    it('debería volver al principio al llegar al final de la lista', () => {
      component.highlightedIndex.set(1);
      component.onArrowDown();
      expect(component.highlightedIndex()).toBe(0);
    });

    it('debería ir al último elemento al pulsar flecha arriba desde el primero', () => {
      component.highlightedIndex.set(0);
      component.onArrowUp();
      expect(component.highlightedIndex()).toBe(1);
    });
  });

  describe('selectCity', () => {
    it('debería guardar el nombre completo de la ciudad seleccionada', () => {
      component.selectCity({ name: 'Tokyo', country: 'JP', lat: 35.68, lon: 139.69 });
      expect(component.selectedCityName()).toBe('Tokyo, JP');
    });

    it('debería limpiar el input y las sugerencias', () => {
      component.city.set('tok');
      component.suggestions.set([{ name: 'Tokyo', country: 'JP', lat: 35.68, lon: 139.69 }]);

      component.selectCity({ name: 'Tokyo', country: 'JP', lat: 35.68, lon: 139.69 });

      expect(component.city()).toBe('');
      expect(component.suggestions()).toEqual([]);
    });
  });
});
