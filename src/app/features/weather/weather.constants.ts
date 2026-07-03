import {
  Sun, Moon, Cloud, CloudSun, CloudMoon, CloudRain,
  CloudLightning, CloudSnow, CloudFog, LucideIconData
} from 'lucide-angular';

export type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

export const SKY_GRADIENTS: Record<TimeOfDay, string> = {
  dawn: 'linear-gradient(160deg, #614385 0%, #cf8b7f 60%, #f3b7a4 100%)',
  day: 'radial-gradient(circle at 20% 20%, #2980b9 0%, #2c3e50 100%)',
  dusk: 'linear-gradient(160deg, #355c7d 0%, #6c5b7b 50%, #c06c84 100%)',
  night: 'radial-gradient(circle at 30% 20%, #1e3a5f 0%, #0f1729 55%, #0a0e1a 100%)'
};

export const WEATHER_ICONS: Record<string, LucideIconData> = {
  '01d': Sun,
  '01n': Moon,
  '02d': CloudSun,
  '02n': CloudMoon,
  '03d': Cloud,
  '03n': Cloud,
  '04d': Cloud,
  '04n': Cloud,
  '09d': CloudRain,
  '09n': CloudRain,
  '10d': CloudRain,
  '10n': CloudRain,
  '11d': CloudLightning,
  '11n': CloudLightning,
  '13d': CloudSnow,
  '13n': CloudSnow,
  '50d': CloudFog,
  '50n': CloudFog
};
