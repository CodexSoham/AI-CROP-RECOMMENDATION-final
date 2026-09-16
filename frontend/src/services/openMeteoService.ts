/**
 * Open-Meteo Weather API Integration Service
 * Fetches real-time ambient climate telemetry and 16-day rainfall projections.
 */

export interface WeatherData {
  success: boolean;
  source: 'open-meteo' | 'simulated-meteorological';
  temperature: number; // °C
  humidity: number; // %
  rainfallCurrent: number; // mm
  rainfallForecast16d: number; // mm
  annualizedRainfallEst: number; // mm
  windSpeed: number; // km/h
  weatherCode: number;
  daily?: {
    precipitation_sum?: number[];
    temperature_2m_max?: number[];
    temperature_2m_min?: number[];
  };
}

export class OpenMeteoService {
  private baseUrl: string;

  constructor(baseUrl: string = 'https://api.open-meteo.com/v1/forecast') {
    this.baseUrl = baseUrl;
  }

  /**
   * Fetch real-time weather and 16-day rainfall projections for given GPS coordinates.
   */
  async getForecast(lat: number, lon: number): Promise<WeatherData> {
    const url = `${this.baseUrl}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,rain,weather_code,wind_speed_10m&daily=precipitation_sum,temperature_2m_max,temperature_2m_min&forecast_days=16&timezone=auto`;

    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Open-Meteo responded with status ${response.status}`);
      }

      const data = await response.json();
      const current = data.current || {};
      const daily = data.daily || {};
      const totalRainfall16Days = (daily.precipitation_sum || []).reduce(
        (acc: number, val: number) => acc + (val || 0),
        0
      );

      return {
        success: true,
        source: 'open-meteo',
        temperature: current.temperature_2m ?? 28.4,
        humidity: current.relative_humidity_2m ?? 73,
        rainfallCurrent: current.precipitation ?? 0,
        rainfallForecast16d: Math.round(totalRainfall16Days * 10) / 10,
        annualizedRainfallEst: Math.round(totalRainfall16Days * 22 + 400),
        windSpeed: current.wind_speed_10m ?? 12.5,
        weatherCode: current.weather_code ?? 1,
        daily,
      };
    } catch (error) {
      console.warn('OpenMeteoService falling back to regional meteorological model:', error);
      return this.getFallbackWeather(lat);
    }
  }

  /**
   * Regional simulated baseline when offline or rate-limited.
   */
  private getFallbackWeather(lat: number): WeatherData {
    const isTropical = Math.abs(lat) < 23.5;
    return {
      success: true,
      source: 'simulated-meteorological',
      temperature: isTropical ? 28.5 : 22.0,
      humidity: isTropical ? 72 : 58,
      rainfallCurrent: 1.5,
      rainfallForecast16d: 44.0,
      annualizedRainfallEst: 840,
      windSpeed: 11.5,
      weatherCode: 2,
      daily: {
        precipitation_sum: [2, 5, 0, 12, 18, 4, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    };
  }
}

export const openMeteoService = new OpenMeteoService();
