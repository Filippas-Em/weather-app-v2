"use client"; 
import React, { useEffect, useState } from 'react';
import PrimaryCardInfo from "./PrimaryCardInfo";
import SecondaryCardInfo from "./SecondaryCardInfo";
import dataset from "../datasets/city.list.json";
import { useLocation } from './LocationContext';
import PrimaryWeekCardInfo from './PrimaryWeekCardInfo';
import SecondaryWeekCardInfo from './secondaryWeekCardInfo';

function windSpeedToBeaufort(windSpeed) {
    if (windSpeed < 1) return 0;       // Calm (less than 1 B)
    if (windSpeed < 12) return 1;      // Light air (1 - 12 B)
    if (windSpeed < 20) return 2;      // Light breeze (12 - 20 B)
    if (windSpeed < 29) return 3;      // Gentle breeze (20 - 29 B)
    if (windSpeed < 39) return 4;      // Moderate breeze (29 - 39 B)
    if (windSpeed < 50) return 5;      // Fresh breeze (39 - 50 B)
    if (windSpeed < 61) return 6;      // Strong breeze (50 - 61 B)
    if (windSpeed < 74) return 7;      // Near gale (61 - 74 B)
    if (windSpeed < 88) return 8;      // Gale (74 - 88 B)
    if (windSpeed < 102) return 9;     // Strong gale (88 - 102 B)
    if (windSpeed < 117) return 10;    // Storm (102 - 117 B)
    if (windSpeed < 133) return 11;    // Violent storm (117 - 133 B)
    return 12;                         // Hurricane (133+ B)
}

export default function Content() {
    const [todayWeather, setTodayWeather] = useState([]);
    const [tomorrowWeather, setTomorrowWeather] = useState([]);
    const [weekWeather, setWeekWeather] = useState([]);

    const [params, setParams] = useState({});
    const [apiData, setApiData] = useState(null);
    const { coordinates } = useLocation();

    const updateParams = () => {
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search);
            setParams({
                location: searchParams.get('location'),
                selected: searchParams.get('selected'),
                units: searchParams.get('units'),
                country: searchParams.get('country'),
            });
        }
    };

    useEffect(() => {
        if (typeof window !== 'undefined') {
            updateParams();
            window.addEventListener('popstate', updateParams);
            const handleCustomEvent = () => updateParams();
            window.addEventListener('customPushState', handleCustomEvent);

            const originalPushState = window.history.pushState;
            window.history.pushState = function (...args) {
                originalPushState.apply(this, args);
                const event = new Event('customPushState');
                window.dispatchEvent(event);
            };

            return () => {
                window.removeEventListener('popstate', updateParams);
                window.removeEventListener('customPushState', handleCustomEvent);
            };
        }
    }, []);

    useEffect(() => {
        let apiUrl;

        if (params.units !== "fahrenheit") {
            apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,wind_speed_10m,apparent_temperature,precipitation_probability,weather_code&daily=temperature_2m_max,weather_code,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
        } else {
            apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,wind_speed_10m,apparent_temperature,precipitation_probability,weather_code&daily=temperature_2m_max,weather_code,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=fahrenheit&timezone=auto`;
        }

        apiCall(apiUrl);

    }, [params.location, params.units, params.country]);

    async function apiCall(call) {
        try {
            const apiResponse = await fetch(call);
            const data = await apiResponse.json();
            setApiData(data);

            const currentDate = new Date();
            const nextDay = new Date(currentDate);
            const today = currentDate.toISOString().split('T')[0];
            nextDay.setDate(nextDay.getDate() + 1);
            const tomorrow = nextDay.toISOString().split('T')[0];

            const formattedDate = `Today, ${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
            const formattedDateTomorrow = `Tomorrow, ${nextDay.getDate().toString().padStart(2, '0')}/${(nextDay.getMonth() + 1).toString().padStart(2, '0')}/${nextDay.getFullYear()}`;

            const secondaryInfoToday = data.hourly?.time ? data.hourly.time.slice(0, 24).map((time, index) => ({
                time: data.hourly.time[index].substring(11, 16),
                weatherCode: data.hourly.weather_code?.[index],
                precipitation: data.hourly.precipitation_probability?.[index],
                wind: windSpeedToBeaufort(data.hourly.wind_speed_10m?.[index]), // Convert wind speed to Beaufort scale
                temperature: Math.floor(data.hourly.temperature_2m?.[index]),  // Floored value
            })) : [];

            const secondaryInfoTomorrow = data.hourly?.time ? data.hourly.time.slice(24, 48).map((time, index) => ({
                time: data.hourly.time[index + 24].substring(11, 16),
                weatherCode: data.hourly.weather_code?.[index + 24],
                precipitation: data.hourly.precipitation_probability?.[index + 24],
                wind: windSpeedToBeaufort(data.hourly.wind_speed_10m?.[index + 24]), // Convert wind speed to Beaufort scale
                temperature: Math.floor(data.hourly.temperature_2m?.[index + 24]),  // Floored value
            })) : [];

            const primaryInfoTomorrow = data.daily?.time ? {
                location: params.location,
                country: params.country,
                date: formattedDateTomorrow,
                temperature: Math.floor(
                    (data.daily.temperature_2m_max?.[1] + data.daily.temperature_2m_min?.[1]) / 2
                ),  // Floored value
                feelTemperature: Math.floor(
                    (data.daily.apparent_temperature_max?.[1] + data.daily.apparent_temperature_min?.[1]) / 2
                ),  // Floored value
                precipitation: data.daily.precipitation_probability_max?.[1],
                weatherCode: data.daily.weather_code?.[1],
                pressure: data.current.surface_pressure,
                wind: windSpeedToBeaufort(data.daily.wind_speed_10m_max?.[1]), // Convert wind speed to Beaufort scale
            } : null;

            const primaryInfoWeek = data.daily?.time
                ? data.daily.time.slice(0, 7).map((time, index) => {
                    const date = new Date(time);
                    const dayName = date.toLocaleString("en-US", { weekday: "long" });

                    return {
                        location: params.location,
                        country: params.country,
                        day: dayName,
                        temperature: Math.floor((data.daily.temperature_2m_max?.[index] + data.daily.temperature_2m_min?.[index]) / 2),  // Floored value
                        feelTemperature: Math.floor((data.daily.apparent_temperature_max?.[index] + data.daily.apparent_temperature_min?.[index]) / 2),  // Floored value
                        precipitation: data.daily.precipitation_probability_max?.[index],
                        weatherCode: data.daily.weather_code?.[index],
                        wind: windSpeedToBeaufort(data.daily.wind_speed_10m_max?.[index]), // Convert wind speed to Beaufort scale
                    };
                })
                : [];

            const secondaryInfoWeek = data.daily?.time
                ? Array.from({ length: 7 }, (_, dayIndex) => {
                    return data.hourly.time.slice(dayIndex * 24, (dayIndex + 1) * 24).map((time, hourIndex) => ({
                        time: time.substring(11, 16),
                        weatherCode: data.hourly.weather_code?.[dayIndex * 24 + hourIndex],
                        precipitation: data.hourly.precipitation_probability?.[dayIndex * 24 + hourIndex],
                        wind: windSpeedToBeaufort(data.hourly.wind_speed_10m?.[dayIndex * 24 + hourIndex]), // Convert wind speed to Beaufort scale
                        temperature: Math.floor(data.hourly.temperature_2m?.[dayIndex * 24 + hourIndex]),  // Floored value
                    }));
                })
                : [];

            const todayArray = {
                primaryInfo: {
                    location: params.location,
                    country: params.country,
                    date: formattedDate,
                    temperature: Math.floor(data.current.temperature_2m),  // Floored value
                    feelTemperature: Math.floor(data.current.apparent_temperature),  // Floored value
                    precipitation: data.current.precipitation,
                    weatherCode: data.current.weather_code,
                    pressure: data.current.surface_pressure,
                    wind: windSpeedToBeaufort(data.current.wind_speed_10m), // Convert wind speed to Beaufort scale
                },
                secondaryInfo: secondaryInfoToday,
            };

            const tomorrowArray = {
                primaryInfo: primaryInfoTomorrow,
                secondaryInfo: secondaryInfoTomorrow,
            };

            const weekArray = {
                primaryInfo: primaryInfoWeek,
                secondaryInfo: secondaryInfoWeek,
            };

            setTodayWeather(todayArray);
            setTomorrowWeather(tomorrowArray);
            setWeekWeather(weekArray);
            console.log(tomorrowWeather);

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {params.selected === "today" ? (
                <>
                    <PrimaryCardInfo data={todayWeather} />
                    <SecondaryCardInfo data={todayWeather} />
                </>
            ) : params.selected === "tomorrow" ? (
                <>
                    <PrimaryCardInfo data={tomorrowWeather} />
                    <SecondaryCardInfo data={tomorrowWeather} />
                </>
            ) : (
                <>
                    <PrimaryWeekCardInfo data={weekWeather} />
                    <SecondaryWeekCardInfo data={weekWeather} />
                </>
            )}
        </>
    );
}
