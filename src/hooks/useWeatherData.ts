import { useState, useEffect } from 'react';

export interface WeatherHourly {
    time: string[];
    temperature_2m: (number | null)[];
    visibility: (number | null)[];
    surface_pressure: (number | null)[];
    wind_speed_10m: (number | null)[];
    wind_direction_10m: (number | null)[];
    wind_gusts_10m: (number | null)[];
    uv_index: (number | null)[];
}

export interface WeatherDaily {
    time: string[];
    sunrise: string[];
    sunset: string[];
}

export interface WeatherData {
    latitude: number;
    longitude: number;
    timezone: string;
    hourly: WeatherHourly;
    daily: WeatherDaily;
    generationtime_ms: number;
}

export interface CurrentWeather {
    temperature: number | null;
    windSpeed: number | null;
    windDirection: number | null;
    windGusts: number | null;
    pressure: number | null;
    visibility: number | null;
    sunrise: string | null;
    sunset: string | null;
}

const API_URL = 'https://api.open-meteo.com/v1/forecast?latitude=44.680076&longitude=-1.196468&daily=sunrise,sunset&hourly=temperature_2m,visibility,surface_pressure,wind_speed_10m,wind_direction_10m,wind_gusts_10m,uv_index&models=meteofrance_arome_france&timezone=auto&wind_speed_unit=kn';

let weatherCache: WeatherData | null = null;

export const useWeatherData = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<WeatherData | null>(weatherCache);
    const [current, setCurrent] = useState<CurrentWeather>({
        temperature: null,
        windSpeed: null,
        windDirection: null,
        windGusts: null,
        pressure: null,
        visibility: null,
        sunrise: null,
        sunset: null,
    });

    useEffect(() => {
        if (weatherCache) {
            setData(weatherCache);
            updateCurrentWeather(weatherCache);
            return;
        }

        const fetchWeatherData = async () => {
            setLoading(true);
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error(`API Error: ${response.statusText}`);
                }
                const json = (await response.json()) as WeatherData;
                weatherCache = json;
                setData(json);
                updateCurrentWeather(json);
                setError(null);
            } catch (err) {
                const errorMsg = err instanceof Error ? err.message : 'Failed to fetch weather data';
                setError(errorMsg);
                console.error('Weather API Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, []);

    const updateCurrentWeather = (weatherData: WeatherData) => {
        if (!weatherData.hourly.time || weatherData.hourly.time.length === 0) {
            return;
        }

        // Get current hour index (closest past hour)
        const now = new Date();
        const currentHourIndex = weatherData.hourly.time.findIndex((time) => {
            const hourDate = new Date(time);
            return hourDate <= now;
        });

        const index = currentHourIndex >= 0 ? currentHourIndex : 0;

        // Get today's sunrise and sunset
        const todayIndex = weatherData.daily.time.findIndex((date) => {
            const dateObj = new Date(date);
            return (
                dateObj.toDateString() === now.toDateString()
            );
        });

        setCurrent({
            temperature: weatherData.hourly.temperature_2m[index] ?? null,
            windSpeed: weatherData.hourly.wind_speed_10m[index] ?? null,
            windDirection: weatherData.hourly.wind_direction_10m[index] ?? null,
            windGusts: weatherData.hourly.wind_gusts_10m[index] ?? null,
            pressure: weatherData.hourly.surface_pressure[index] ?? null,
            visibility: weatherData.hourly.visibility[index] ?? null,
            sunrise: todayIndex >= 0 ? weatherData.daily.sunrise[todayIndex] : null,
            sunset: todayIndex >= 0 ? weatherData.daily.sunset[todayIndex] : null,
        });
    };

    return { data, current, loading, error };
};

export const getWindDirection = (degrees: number): string => {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 22.5) % 16;
    return directions[index];
};

export const getWindDirectionFull = (degrees: number): string => {
    const directions = [
        'Nord',
        'Nord-Nord-Est',
        'Nord-Est',
        'Est-Nord-Est',
        'Est',
        'Est-Sud-Est',
        'Sud-Est',
        'Sud-Sud-Est',
        'Sud',
        'Sud-Sud-Ouest',
        'Sud-Ouest',
        'Ouest-Sud-Ouest',
        'Ouest',
        'Ouest-Nord-Ouest',
        'Nord-Ouest',
        'Nord-Nord-Ouest',
    ];
    const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 22.5) % 16;
    return directions[index];
};
