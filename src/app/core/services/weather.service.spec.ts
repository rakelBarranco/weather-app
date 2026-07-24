import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;
  let httpMock: HttpTestingController;

  const mockWeatherResponse = {
    name: 'Valencia',
    sys: { country: 'ES', sunrise: 1700000000, sunset: 1700040000 },
    main: { temp: 24.4, feels_like: 25.7, humidity: 62, pressure: 1015 },
    wind: { speed: 3.5 },
    weather: [{ description: 'cielo claro', icon: '01d', main: 'Clear' }],
    timezone: 7200,
    visibility: 10000,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeatherService, provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(WeatherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('debería crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  describe('getWeatherByCoords', () => {
    it('debería mapear la respuesta de la API al modelo Weather', () => {
      service.getWeatherByCoords(39.47, -0.38).subscribe(weather => {
        expect(weather.city).toBe('Valencia');
        expect(weather.country).toBe('ES');
        expect(weather.temp).toBe(24);
        expect(weather.feelsLike).toBe(26);
        expect(weather.humidity).toBe(62);
        expect(weather.pressure).toBe(1015);
        expect(weather.icon).toBe('01d');
      });

      const req = httpMock.expectOne(r => r.url.includes('/weather'));
      expect(req.request.method).toBe('GET');
      req.flush(mockWeatherResponse);
    });

    it('debería convertir la velocidad del viento de m/s a km/h', () => {
      service.getWeatherByCoords(39.47, -0.38).subscribe(weather => {
        expect(weather.windSpeed).toBe(13);
      });

      httpMock.expectOne(r => r.url.includes('/weather')).flush(mockWeatherResponse);
    });

    it('debería incluir los parámetros de unidades métricas e idioma', () => {
      service.getWeatherByCoords(39.47, -0.38).subscribe();

      const req = httpMock.expectOne(r => r.url.includes('/weather'));
      expect(req.request.urlWithParams).toContain('units=metric');
      expect(req.request.urlWithParams).toContain('lang=es');
      req.flush(mockWeatherResponse);
    });
  });

  describe('searchCities', () => {
    it('debería mapear las sugerencias de ciudades', () => {
      const mockGeoResponse = [
        { name: 'Valencia', country: 'ES', state: 'Valencia', lat: 39.47, lon: -0.38 },
        { name: 'Valencia', country: 'VE', lat: 10.16, lon: -68.0 },
      ];

      service.searchCities('valencia').subscribe(cities => {
        expect(cities.length).toBe(2);
        expect(cities[0].name).toBe('Valencia');
        expect(cities[0].country).toBe('ES');
        expect(cities[1].country).toBe('VE');
      });

      const req = httpMock.expectOne(r => r.url.includes('/direct'));
      req.flush(mockGeoResponse);
    });

    it('debería devolver un array vacío si no hay coincidencias', () => {
      service.searchCities('xyzabc').subscribe(cities => {
        expect(cities).toEqual([]);
      });

      httpMock.expectOne(r => r.url.includes('/direct')).flush([]);
    });
  });

  describe('getErrorMessage', () => {
    it('debería devolver un mensaje de red cuando el estado es 0', () => {
      const error = new HttpErrorResponse({ status: 0 });
      expect(service.getErrorMessage(error)).toContain('Sin conexión');
    });

    it('debería devolver un mensaje de ciudad no encontrada para el 404', () => {
      const error = new HttpErrorResponse({ status: 404 });
      expect(service.getErrorMessage(error)).toContain('No se encontró');
    });

    it('debería devolver un mensaje de límite de peticiones para el 429', () => {
      const error = new HttpErrorResponse({ status: 429 });
      expect(service.getErrorMessage(error)).toContain('Demasiadas peticiones');
    });

    it('debería devolver un mensaje genérico para errores no contemplados', () => {
      const error = new HttpErrorResponse({ status: 500 });
      expect(service.getErrorMessage(error)).toContain('Algo salió mal');
    });
  });
});
