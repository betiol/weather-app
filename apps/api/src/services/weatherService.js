"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherService = void 0;
const shared_types_1 = require("@weather/shared-types");
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
class WeatherService {
    static async getLocationFromZipCode(zipCode) {
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
            const validatedData = shared_types_1.WeatherResponseSchema.parse(data);
            // Convert timezone offset from seconds to timezone string
            const timezoneOffsetHours = validatedData.timezone / 3600;
            const timezone = `UTC${timezoneOffsetHours >= 0 ? '+' : ''}${timezoneOffsetHours}`;
            return {
                latitude: validatedData.coord.lat,
                longitude: validatedData.coord.lon,
                timezone,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Failed to fetch location data');
        }
    }
}
exports.WeatherService = WeatherService;
