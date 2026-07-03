import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { toObservable } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, filter, switchMap, catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { CloudSun, MapPin, LucideAngularModule } from 'lucide-angular';
import { WeatherService } from '../../../core/services/weather.service';
import { ForecastDay, Weather, CitySuggestion } from '../../../core/models/weather.model';
import { SKY_GRADIENTS, WEATHER_ICONS, TimeOfDay } from '../weather.constants';
import {NgClass} from '@angular/common';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-weather-view',
  imports: [FormsModule, LucideAngularModule, NgClass],
  templateUrl: './weather-view.html',
  styleUrl: './weather-view.scss',
})
export default class WeatherViewComponent {
  private weatherService = inject(WeatherService);

  readonly CloudSun = CloudSun;
  readonly MapPin = MapPin;

  city = signal('');
  suggestions = signal<CitySuggestion[]>([]);
  weather = signal<Weather | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  forecast = signal<ForecastDay[]>([]);
  highlightedIndex = signal(-1);

  timeOfDay = computed<TimeOfDay>(() => {
    const w = this.weather();
    if (!w) return 'day';

    const localTime = (Date.now() / 1000) + w.timezone;
    const hour = Math.floor((localTime % 86400) / 3600);

    if (hour >= 6 && hour < 9) return 'dawn';
    if (hour >= 9 && hour < 19) return 'day';
    if (hour >= 19 && hour < 21) return 'dusk';
    return 'night';
  });

  background = computed(() => SKY_GRADIENTS[this.timeOfDay()]);

  weatherIcon = computed(() => {
    const w = this.weather();
    return w ? WEATHER_ICONS[w.icon] ?? null : null;
  });

  constructor() {
    toObservable(this.city).pipe(
      debounceTime(400),
      distinctUntilChanged(),
      tap(query => {
        if (query.trim().length < 2) {
          this.suggestions.set([]);
        }
      }),
      filter(query => query.trim().length >= 2),
      switchMap(query =>
        this.weatherService.searchCities(query.trim()).pipe(
          catchError(() => of([]))
        )
      )
    ).subscribe(cities => this.suggestions.set(cities));
  }

  selectCity(suggestion: CitySuggestion) {
    this.highlightedIndex.set(-1);
    this.city.set('');
    this.suggestions.set([]);
    this.loading.set(true);
    this.error.set(null);

    this.weatherService.getWeatherByCoords(suggestion.lat, suggestion.lon).subscribe({
      next: (data) => {
        this.weather.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(this.weatherService.getErrorMessage(err));
        this.weather.set(null);
        this.forecast.set([]);
        this.loading.set(false);
      }
    });

    this.weatherService.getForecastByCoords(suggestion.lat, suggestion.lon).subscribe({
      next: (data) => this.forecast.set(data),
      error: () => this.forecast.set([])
    });
  }

  getDayName(timestamp: number): string {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('es-ES', { weekday: 'short' });
  }

  getIcon(iconCode: string) {
    return WEATHER_ICONS[iconCode] ?? null;
  }

  useMyLocation() {
    if (!navigator.geolocation) {
      this.error.set('Tu navegador no admite geolocalización.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.suggestions.set([]);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        this.weatherService.getWeatherByCoords(latitude, longitude).subscribe({
          next: (data) => {
            this.weather.set(data);
            this.loading.set(false);
          },
          error: (err: HttpErrorResponse) => {
            this.error.set(this.weatherService.getErrorMessage(err));
            this.weather.set(null);
            this.loading.set(false);
          }
        });

        this.weatherService.getForecastByCoords(latitude, longitude).subscribe({
          next: (data) => this.forecast.set(data),
          error: () => this.forecast.set([])
        });
      },
      () => {
        this.error.set('No se pudo obtener tu ubicación. Revisa los permisos.');
        this.loading.set(false);
      }
    );
  }

  onArrowDown() {
    const max = this.suggestions().length - 1;
    this.highlightedIndex.update(i => (i < max ? i + 1 : 0));
  }

  onArrowUp() {
    const max = this.suggestions().length - 1;
    this.highlightedIndex.update(i => (i > 0 ? i - 1 : max));
  }

  onEnter() {
    const cities = this.suggestions();
    if (cities.length === 0) return;

    const index = this.highlightedIndex();
    const selected = index >= 0 ? cities[index] : cities[0];
    this.selectCity(selected);
  }
}
