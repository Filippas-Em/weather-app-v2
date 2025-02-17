"use client";
import React, { useEffect, useState } from 'react';
import PrimaryCardInfo from "./PrimaryCardInfo"
import SecondaryCardInfo from "./SecondaryCardInfo"
import dataset from "../datasets/city.list.json";
import { useLocation } from './LocationContext';


export default function Content() {
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
            apiUrl = `https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,wind_speed_10m_max&timezone=auto`;
        } else {
            console.log("Fahrenheit");
            apiUrl =`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.lat}&longitude=${coordinates.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,surface_pressure,wind_speed_10m&hourly=temperature_2m,apparent_temperature,precipitation_probability,weather_code&daily=temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_probability_max,wind_speed_10m_max&temperature_unit=fahrenheit&timezone=auto`;
        }
        
        apiCall(apiUrl);

    }, [params]);


    async function apiCall(call){
        try {
            const apiResponse = await fetch(call);  
            const data = await apiResponse.json();
            console.log(data);
            setApiData(data);
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