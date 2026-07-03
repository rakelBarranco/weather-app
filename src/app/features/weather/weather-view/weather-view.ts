import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {CloudSun, LucideAngularModule} from 'lucide-angular';
import { WeatherService } from '../../../core/services/weather.service';
import {ForecastDay, Weather} from '../../../core/models/weather.model';
import { SKY_GRADIENTS, WEATHER_ICONS, TimeOfDay } from '../weather.constants';

@Component({
  selector: 'app-weather-view',
  imports: [FormsModule, LucideAngularModule],
  templateUrl: './weather-view.html',
  styleUrl: './weather-view.scss',
})
export default class WeatherViewComponent {
  private weatherService = inject(WeatherService);

  readonly CloudSun = CloudSun;
  city = signal('');
  weather = signal<Weather | null>(null);
  loading = signal(false);
  error = signal(false);
  forecast = signal<ForecastDay[]>([]);

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

  searchWeather() {
    const cityName = this.city().trim();
    if (!cityName) return;

    this.loading.set(true);
    this.error.set(false);

    this.weatherService.getWeatherByCity(cityName).subscribe({
      next: (data) => {
        this.weather.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set(true);
        this.weather.set(null);
        this.forecast.set([]);
        this.loading.set(false);
      }
    });

    this.weatherService.getForecastByCity(cityName).subscribe({
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

}
