"use client";
import React, { useEffect, useState } from 'react';
import PrimaryCardInfo from "./PrimaryCardInfo"
import SecondaryCardInfo from "./SecondaryCardInfo"
import dataset from "../datasets/city.list.json";
import { useLocation } from './LocationContext';
import PrimaryWeekCardInfo from './PrimaryWeekCardInfo';
import SecondaryWeekCardInfo from './secondaryWeekCardInfo';

export default function Content() {
    const [todayWeather, setTodayWeather] = useState([]);
    const [tomorrowWeather, setTomorrowWeather] = useState([]);
    const [weekWeather,setWeekWeather] = useState([]);


    const [params, setParams] = useState({});
    const [apiData, setApiData] = useState(null);
    const {coordinates} = useLocation();
    
    const updateParams = () => {
        // Only run in browser environment
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
        // Initialize params on component mount - only in browser
        if (typeof window !== 'undefined') {
            // Initialize params on component mount
            updateParams();
    
            // Listen for browser navigation
            window.addEventListener('popstate', updateParams);
    
            // Listen for custom events when pushState is used
            const handleCustomEvent = () => updateParams();
            window.addEventListener('customPushState', handleCustomEvent);
    
            // IIFE for history API modification - only in browser environment
            const originalPushState = window.history.pushState;
            window.history.pushState = function (...args) {
                // Call the original pushState
                originalPushState.apply(this, args);
                
                // Dispatch a custom event to notify about the URL change
                const event = new Event('customPushState');
                window.dispatchEvent(event);
            };
    
            return () => {
                window.removeEventListener('popstate', updateParams);
                window.removeEventListener('customPushState', handleCustomEvent);
                // Optionally restore the original pushState in cleanup
                // window.history.pushState = originalPushState;
            };
        }
    }, []);

    useEffect(() => {
        let apiUrl;

        if (params.units != "fahrenheit"){
            apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,wind_speed_10m,apparent_temperature,precipitation_probability,weather_code&daily=temperature_2m_max,weather_code,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
        } else {
            apiUrl =`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,wind_speed_10m,apparent_temperature,precipitation_probability,weather_code&daily=temperature_2m_max,weather_code,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=fahrenheit&timezone=auto`;
        }
        
        apiCall(apiUrl);

    }, [params.location, params.units, params.country]);


    async function apiCall(call){
        try {
            const apiResponse = await fetch(call);  
            const data = await apiResponse.json();
            setApiData(data);

            const currentDate = new Date();
            const nextDay = new Date(currentDate); // Clone for tomorrow

            // Get today's date before any modifications
            const today = currentDate.toISOString().split('T')[0];

            // Create tomorrow's date using nextDay (leave currentDate unchanged)
            nextDay.setDate(nextDay.getDate() + 1);
            const tomorrow = nextDay.toISOString().split('T')[0];

            const formattedDate = `Today, ${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;
            const formattedDateTomorrow = `Tomorrow, ${nextDay.getDate().toString().padStart(2, '0')}/${(nextDay.getMonth() + 1).toString().padStart(2, '0')}/${nextDay.getFullYear()}`;
            const secondaryInfoToday = data.hourly?.time ? data.hourly.time.slice(0, 24).map((time, index) => ({
                time: data.hourly.time[index].substring(11, 16),
                weatherCode: data.hourly.weather_code?.[index],
                precipitation: data.hourly.precipitation_probability?.[index],
                wind: data.hourly.wind_speed_10m?.[index],
                temperature: data.hourly.temperature_2m?.[index],
            })) : [];
            
            const secondaryInfoTomorrow = data.hourly?.time ? data.hourly.time.slice(24, 48).map((time, index) => ({
                time: data.hourly.time[index+24].substring(11, 16),
                weatherCode: data.hourly.weather_code?.[index+24],
                precipitation: data.hourly.precipitation_probability?.[index+24],
                wind: data.hourly.wind_speed_10m?.[index+24],
                temperature: data.hourly.temperature_2m?.[index+24],
            })) : [];

            const primaryInfoTomorrow = data.daily?.time ? {
                location: params.location,
                country: params.country,
                date: formattedDateTomorrow,
                temperature: Math.round(
                    (data.daily.temperature_2m_max?.[1] + data.daily.temperature_2m_min?.[1]) / 2
                ),
                feelTemperature: Math.round(
                    (data.daily.apparent_temperature_max?.[1] + data.daily.apparent_temperature_min?.[1]) / 2
                ),
                precipitation: data.daily.precipitation_probability_max?.[1],
                weatherCode: data.daily.weather_code?.[1],
                pressure: data.current.surface_pressure,
                wind: data.daily.wind_speed_10m_max?.[1],
            } : null;


            const primaryInfoWeek = data.daily?.time
            ? data.daily.time.slice(0, 7).map((time, index) => {
                const date = new Date(time); // Create a Date object from the time string
                const dayName = date.toLocaleString("en-US", { weekday: "long" }); // Get the day name (e.g., Friday)

                return {
                    location: params.location,
                    country: params.country,
                    day: dayName, // Store the day name instead of the date
                    temperature: Math.round((data.daily.temperature_2m_max?.[index] + data.daily.temperature_2m_min?.[index]) / 2),
                    feelTemperature: Math.round((data.daily.apparent_temperature_max?.[index] + data.daily.apparent_temperature_min?.[index]) / 2),
                    precipitation: data.daily.precipitation_probability_max?.[index],
                    weatherCode: data.daily.weather_code?.[index],
                    wind: data.daily.wind_speed_10m_max?.[index],
                };
                })
            : [];


            const secondaryInfoWeek = data.daily?.time
                ? Array.from({ length: 7 }, (_, dayIndex) => {
                    // Create a sub-array for each day
                    return data.hourly.time.slice(dayIndex * 24, (dayIndex + 1) * 24).map((time, hourIndex) => ({
                        time: time.substring(11, 16), // Extract only the hour
                        weatherCode: data.hourly.weather_code?.[dayIndex * 24 + hourIndex],
                        precipitation: data.hourly.precipitation_probability?.[dayIndex * 24 + hourIndex],
                        wind: data.hourly.wind_speed_10m?.[dayIndex * 24 + hourIndex],
                        temperature: data.hourly.temperature_2m?.[dayIndex * 24 + hourIndex],
                    }));
                })
            : [];

            
            const todayArray = {
                primaryInfo: {
                    location: params.location,
                    country: params.country,
                    date: formattedDate,
                    temperature: data.current.temperature_2m,
                    feelTemperature: data.current.apparent_temperature,
                    precipitation: data.current.precipitation,
                    weatherCode: data.current.weather_code,
                    pressure: data.current.surface_pressure,
                    wind: data.current.wind_speed_10m
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