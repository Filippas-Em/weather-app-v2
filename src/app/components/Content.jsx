"use client";
import React, { useEffect, useState } from 'react';
import PrimaryCardInfo from "./PrimaryCardInfo"
import SecondaryCardInfo from "./SecondaryCardInfo"
import dataset from "../datasets/city.list.json";
import { useLocation } from './LocationContext';


export default function Content() {
    const [todayWeather, setTodayWeather] = useState([]);
    const [tomorrowWeather, setTomorrowWeather] = useState([]);
    const [params, setParams] = useState({});
    const [apiData, setApiData] = useState(null);
    const {coordinates} = useLocation();
    const apiURL = `latitude=35.139599&longitude=26.12603&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code&daily=weather_code&timezone=auto`;
    const updateParams = () => {
        const searchParams = new URLSearchParams(window.location.search);
        setParams({
            location: searchParams.get('location'),
            selected: searchParams.get('selected'),
            units: searchParams.get('units'),
            country: searchParams.get('country'),
        });


    };

    useEffect(() => {
            // Initialize params on component mount
            updateParams();
    
            // Listen for browser navigation
            window.addEventListener('popstate', updateParams);
    
            // Listen for custom events when pushState is used
            const handleCustomEvent = () => updateParams();
            window.addEventListener('customPushState', handleCustomEvent);
    
            return () => {
                window.removeEventListener('popstate', updateParams);
                window.removeEventListener('customPushState', handleCustomEvent);
            };
    }, []);

    useEffect(() => {
        console.log("Updated params:", params);
        let apiUrl;

        if (params.units != "fahrenheit"){
            console.log("Celsius");
            apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,wind_speed_10m,apparent_temperature,precipitation_probability,weather_code&daily=temperature_2m_max,weather_code,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
        } else {
            console.log("Fahrenheit");
            apiUrl =`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,wind_speed_10m,apparent_temperature,precipitation_probability,weather_code&daily=temperature_2m_max,weather_code,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=fahrenheit&timezone=auto`;
        }
        


        apiCall(apiUrl);

    }, [params]);


    async function apiCall(call){
        try {
            const apiResponse = await fetch(call);  
            const data = await apiResponse.json();
            console.log(data);
            setApiData(data);

            const currentDate = new Date();
            const today = currentDate.toISOString().split('T')[0]; // Today's date in YYYY-MM-DD format
            const tomorrow = new Date(currentDate.setDate(currentDate.getDate() + 1)).toISOString().split('T')[0]; // Tomorrow's date

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

            const primaryInfoTomorrow = data.daily?.time ? data.daily.time.slice(0, 1).map((time, index) => ({
                location: params.location,
                date: tomorrow,
                temperature: (data.daily.temperature_2m_max?.[1]+data.daily.temperature_2m_min?.[1])/2,
                feelTemperature: (data.daily.apparent_temperature_max?.[1]+data.daily.apparent_temperature_min?.[1])/2,
                precipitation: data.daily.precipitation_probability_max?.[1],
                weatherCode: data.daily.weather_code?.[1],
                pressure: data.current.surface_pressure,
                wind: data.daily.wind_speed_10m_max?.[1]

                
            })) : [];

            const todayArray = {
                primaryInfo: {
                    location: params.location,
                    date: today,
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

            console.log("today array", todayArray);
            console.log("tomorrow array", tomorrowArray);



        } catch (error) {
            console.error(error);
        }
    }

        

    return (
        <>  
            <PrimaryCardInfo data={apiData}/>
            <SecondaryCardInfo data={apiData} />
        </>
    )
}

(() => {
    const originalPushState = window.history.pushState;
    window.history.pushState = function (...args) {
        // Call the original pushState
        originalPushState.apply(this, args);
        
        // Dispatch a custom event to notify about the URL change
        const event = new Event('customPushState');
        window.dispatchEvent(event);
    };
})();