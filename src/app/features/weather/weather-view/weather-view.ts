import {Component, computed, inject, signal} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeatherService } from '../../../core/services/weather.service';
import { Weather } from '../../../core/models/weather.model';

const SKY_GRADIENTS: Record<'dawn' | 'day' | 'dusk' | 'night', string> = {
  dawn: 'linear-gradient(160deg, #614385 0%, #cf8b7f 60%, #f3b7a4 100%)',
  day: 'radial-gradient(circle at 20% 20%, #2980b9 0%, #2c3e50 100%)',
  dusk: 'linear-gradient(160deg, #355c7d 0%, #6c5b7b 50%, #c06c84 100%)',
  night: 'radial-gradient(circle at 30% 20%, #1e3a5f 0%, #0f1729 55%, #0a0e1a 100%)'
};

@Component({
  selector: 'app-weather-view',
  imports: [FormsModule],
  templateUrl: './weather-view.html',
  styleUrl: './weather-view.scss',
})

export default class WeatherViewComponent {
  private weatherService = inject(WeatherService);


  city = signal('');
  weather = signal<Weather | null>(null);
  loading = signal(false);
  error = signal(false);

  background = computed(() => SKY_GRADIENTS[this.timeOfDay()]);

  timeOfDay = computed<'dawn' | 'day' | 'dusk' | 'night'>(() => {
    const w = this.weather();
    if (!w) return 'day';

    const localTime = (Date.now() / 1000) + w.timezone;
    const hour = Math.floor((localTime % 86400) / 3600);

    if (hour >= 6 && hour < 9) return 'dawn';
    if (hour >= 9 && hour < 19) return 'day';
    if (hour >= 19 && hour < 21) return 'dusk';
    return 'night';
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
        this.loading.set(false);
      }
    });
  }
}
