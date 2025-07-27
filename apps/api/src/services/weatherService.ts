import { WeatherResponseSchema } from '@weather/shared-types';

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

export interface LocationData {
  latitude: number;
  longitude: number;
  timezone: string;
}

export class WeatherService {
  static async getLocationFromZipCode(zipCode: string): Promise<LocationData> {
    if (!OPENWEATHER_API_KEY) {
      throw new Error('OpenWeatherMap API key not configured');
    }

    const url = `${OPENWEATHER_BASE_URL}?zip=${zipCode}&appid=${OPENWEATHER_API_KEY}`;

    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Invalid zip code');
        }
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      const validatedData = WeatherResponseSchema.parse(data);
      
      const timezoneOffsetHours = validatedData.timezone / 3600;
      const timezone = `UTC${timezoneOffsetHours >= 0 ? '+' : ''}${timezoneOffsetHours}`;

      return {
        latitude: validatedData.coord.lat,
        longitude: validatedData.coord.lon,
        timezone,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch location data');
    }
  }
} 