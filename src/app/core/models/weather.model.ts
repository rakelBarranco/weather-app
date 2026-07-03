export interface Weather {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  main: string;
  sunrise: number;
  sunset: number;
  timezone: number;
}

export interface ForecastDay {
  date: number;
  tempMin: number;
  tempMax: number;
  icon: string;
  description: string;
}

export interface CitySuggestion {
  name: string;
  country: string;
  state?: string;
  lat: number;
  lon: number;
}


