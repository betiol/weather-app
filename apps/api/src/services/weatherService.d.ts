export interface LocationData {
    latitude: number;
    longitude: number;
    timezone: string;
}
export declare class WeatherService {
    static getLocationFromZipCode(zipCode: string): Promise<LocationData>;
}
//# sourceMappingURL=weatherService.d.ts.map