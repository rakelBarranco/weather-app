import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Weather } from '../models/weather.model';
import {environment} from '../../../environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  private http = inject(HttpClient);
  private apiKey = environment.openWeather.apiKey;
  private baseUrl = environment.openWeather.baseUrl;

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
}
