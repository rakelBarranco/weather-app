import { Injectable, inject } from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {CitySuggestion, ForecastDay, Weather} from '../models/weather.model';
import {environment} from '../../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiKey = environment.openWeather.apiKey;
  private baseUrl = environment.openWeather.baseUrl;
  private geoUrl = environment.openWeather.geoUrl;

  getWeatherByCity(city: string): Observable<Weather> {
    const url = `${this.baseUrl}/weather?q=${city}&units=metric&lang=es&appid=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map(response => this.mapToWeather(response))
    );
  }

  private mapToWeather(data: any): Weather {
    return {
      city: data.name,
      country: data.sys.country,
      temp: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      main: data.weather[0].main,
      sunrise: data.sys.sunrise,
      sunset: data.sys.sunset,
      timezone: data.timezone
    };
  }

  getForecastByCity(city: string): Observable<ForecastDay[]> {
    const url = `${this.baseUrl}/forecast?q=${city}&units=metric&lang=es&appid=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map(response => this.mapToForecast(response))
    );
  }

  private mapToForecast(data: any): ForecastDay[] {
    const grouped: { [date: string]: any[] } = {};

    for (const item of data.list) {
      const date = item.dt_txt.split(' ')[0];
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(item);
    }

    const today = new Date().toISOString().split('T')[0];

    return Object.keys(grouped)
      .filter(date => date !== today)
      .slice(0, 5)
      .map(date => {
        const items = grouped[date];
        const temps = items.map(i => i.main.temp);
        const midday = items.find(i => i.dt_txt.includes('12:00:00')) ?? items[0];

        return {
          date: midday.dt,
          tempMin: Math.round(Math.min(...temps)),
          tempMax: Math.round(Math.max(...temps)),
          icon: midday.weather[0].icon,
          description: midday.weather[0].description
        };
      });
  }

  getWeatherByCoords(lat: number, lon: number): Observable<Weather> {
    const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map(response => this.mapToWeather(response))
    );
  }

  getForecastByCoords(lat: number, lon: number): Observable<ForecastDay[]> {
    const url = `${this.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&lang=es&appid=${this.apiKey}`;

    return this.http.get<any>(url).pipe(
      map(response => this.mapToForecast(response))
    );
  }

  searchCities(query: string): Observable<CitySuggestion[]> {
    const url = `${this.geoUrl}/direct?q=${query}&limit=5&appid=${this.apiKey}`;

    return this.http.get<any[]>(url).pipe(
      map(response => response.map(item => ({
        name: item.name,
        country: item.country,
        state: item.state,
        lat: item.lat,
        lon: item.lon
      })))
    );
  }

  getErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
      case 0:
        return 'Sin conexión. Comprueba tu red e inténtalo de nuevo.';
      case 401:
        return 'Error de autenticación con el servicio meteorológico.';
      case 404:
        return 'No se encontró la ciudad. Prueba con otro nombre.';
      case 429:
        return 'Demasiadas peticiones. Espera un momento e inténtalo de nuevo.';
      default:
        return 'Algo salió mal. Inténtalo de nuevo más tarde.';
    }
  }
}
