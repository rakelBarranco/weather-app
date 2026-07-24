# Weather App

Aplicación web del tiempo desarrollada con **Angular 20** y **Tailwind CSS**, que consume la API de **OpenWeatherMap** para mostrar el clima actual y la previsión de 5 días de cualquier ciudad del mundo.

🔗 **[Ver demo en vivo](URL_PENDIENTE)**

![Captura de la aplicación](./docs/screenshot.png)

---

## Características

- **Búsqueda con autocompletado** — sugerencias de ciudades en tiempo real mediante la Geocoding API, con debounce para optimizar las peticiones
- **Navegación por teclado** — flechas para moverse entre sugerencias y Enter para seleccionar
- **Geolocalización** — consulta el tiempo de tu ubicación actual con un clic
- **Previsión de 5 días** — temperaturas máximas y mínimas agrupadas por día
- **Fondo dinámico** — el gradiente cambia según la hora local de la ciudad consultada (amanecer, día, atardecer, noche)
- **Animaciones de clima** — partículas en Canvas que representan lluvia, nieve, nubes o niebla según las condiciones reales
- **Historial de búsquedas** — las últimas 5 ciudades consultadas se guardan en `localStorage`
- **Manejo de errores** — mensajes específicos según el tipo de fallo (sin conexión, límite de peticiones, ciudad no encontrada)
- **Diseño responsive** — adaptado a móvil, tablet y escritorio

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| Angular 20 | Framework principal, con componentes standalone |
| TypeScript | Tipado estático en todo el proyecto |
| Tailwind CSS | Sistema de estilos y diseño responsive |
| RxJS | Gestión de peticiones asíncronas y debounce en la búsqueda |
| Signals | Gestión de estado reactivo del componente |
| Canvas API | Animaciones de partículas según el clima |
| Lucide Angular | Iconografía |
| Karma + Jasmine | Tests unitarios |
| OpenWeatherMap API | Datos meteorológicos y geocodificación |

---

## Decisiones técnicas

**Signals en lugar de RxJS para el estado del componente.** El estado local (ciudad seleccionada, datos del clima, carga, errores) se gestiona con signals por su sencillez y rendimiento. RxJS se reserva para lo que realmente lo necesita: el flujo de búsqueda con `debounceTime`, `distinctUntilChanged` y `switchMap`, que cancela peticiones obsoletas cuando el usuario sigue escribiendo.

**Búsqueda por coordenadas en lugar de por nombre.** La Geocoding API devuelve las coordenadas exactas de cada ciudad sugerida, lo que evita ambigüedades entre ciudades homónimas (por ejemplo, Valencia en España y Valencia en Venezuela).

**Un único componente de animación.** En lugar de crear un componente por tipo de clima, `weather-animation` recibe el tipo como input y selecciona internamente la función de dibujo correspondiente, evitando duplicar la lógica del canvas y el bucle de animación.

**Lazy loading de rutas.** El componente principal se carga de forma diferida con `loadComponent`, reduciendo el tamaño del bundle inicial.

---

## Instalación

Requisitos previos: Node.js 20 o superior y npm.

```bash
# Clonar el repositorio
git clone https://github.com/rakelBarranco/weather-app.git
cd weather-app

# Instalar dependencias
npm install
```

### Configurar la API key

La aplicación necesita una clave de OpenWeatherMap. Puedes obtener una gratuita en [openweathermap.org](https://openweathermap.org/api).

Crea el archivo `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  openWeather: {
    apiKey: 'TU_API_KEY',
    baseUrl: 'https://api.openweathermap.org/data/2.5',
    geoUrl: 'https://api.openweathermap.org/geo/1.0'
  }
};
```

> La clave puede tardar unos minutos en activarse tras registrarte.

### Arrancar el proyecto

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200`.

---

## Tests

```bash
# Ejecutar los tests
npm test

# Ejecutar una sola vez, sin modo watch
ng test --watch=false

# Generar informe de cobertura
ng test --watch=false --code-coverage
```

Los tests cubren el mapeo de datos de la API, el manejo de errores HTTP, la persistencia del historial de búsquedas y la lógica del componente principal.

---

## Estructura del proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── models/          # Interfaces y tipos compartidos
│   │   └── services/        # WeatherService y SearchHistoryService
│   ├── features/
│   │   └── weather/         # Vista principal y constantes
│   └── shared/
│       └── components/      # Componente de animación reutilizable
└── environments/            # Configuración de la API
```

---

## Autora

**Raquel Barranco** — Desarrolladora Frontend

[Portfolio](https://portfolioraquel-indol.vercel.app) · [LinkedIn](https://www.linkedin.com/in/raquel-barrval-70a9361b5) · [GitHub](https://github.com/rakelBarranco)
