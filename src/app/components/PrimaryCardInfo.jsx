'use client';
import React, { useEffect, useState } from 'react';
import Image from 'next/image'
import TempIcon from '../../../public/temp1.png'
import PressureIcon from '../../../public/pressure1.png'
import RainPerc from '../../../public/rainPerc.png'
import WindIcon from '../../../public/wind1.png'
import 'weather-icons/css/weather-icons.min.css';


export default function PrimaryCardInfo({data}) {

    const weatherIcons = {
        // Clear weather
        0: "wi-day-sunny",          // Clear sky
    
        // Cloudy weather
        1: "wi-day-sunny-overcast", // Mainly clear
        2: "wi-day-cloudy",         // Partly cloudy
        3: "wi-cloudy",             // Overcast
    
        // Foggy and hazy weather
        45: "wi-fog",               // Fog
        48: "wi-dust",              // Depositing rime fog
    
        // Drizzle
        51: "wi-sprinkle",          // Light drizzle
        53: "wi-showers",           // Moderate drizzle
        55: "wi-showers",           // Dense drizzle
    
        // Freezing drizzle
        56: "wi-sleet",             // Light freezing drizzle
        57: "wi-sleet",             // Dense freezing drizzle
    
        // Rain
        61: "wi-day-rain",          // Slight rain
        63: "wi-rain",              // Moderate rain
        65: "wi-rain-wind",         // Heavy rain
    
        // Freezing rain
        66: "wi-rain-mix",          // Light freezing rain
        67: "wi-rain-mix",          // Heavy freezing rain
    
        // Snow
        71: "wi-snow",              // Slight snow fall
        73: "wi-snow",              // Moderate snow fall
        75: "wi-snow",              // Heavy snow fall
    
        // Snow grains
        77: "wi-snowflake-cold",    // Snow grains
    
        // Rain showers
        80: "wi-day-showers",       // Slight rain showers
        81: "wi-showers",           // Moderate rain showers
        82: "wi-thunderstorm",      // Violent rain showers
    
        // Snow showers
        85: "wi-day-snow",          // Slight snow showers
        86: "wi-day-snow",          // Heavy snow showers
    
        // Thunderstorms
        95: "wi-thunderstorm",      // Thunderstorm (slight or moderate)
        96: "wi-storm-showers",     // Thunderstorm with slight hail
        99: "wi-hail",              // Thunderstorm with heavy hail
    };
    if(!data.primaryInfo) return null;
    
    console.log("INSIDE JOOOOB the component",data.primaryInfo);
    return (
        <div className="primary-card-info">
            <div className="country-date">
                <h1>{data.primaryInfo.location}, {data.primaryInfo.country}</h1>
                <p>Today, 14/2/2025</p>
            </div>
            <div className='temp-info'>
                <h1>{data.primaryInfo.temperature}°</h1>
                <i className={`wi ${weatherIcons[data.primaryInfo.weatherCode || 0]}`} style={{ fontSize: "52px" }}></i>

                
            </div>
            <div className='weather-info'>

                <div className='weather-info-cell'>
                    <div className='cell-icon'>
                        <Image
                            src={TempIcon}
                            alt="Search Icon"
                            width={32}
                            height={32}
                        /> 
                    </div>
                    <div className='cell-info'>
                        <p>Feel Temperature</p>
                        <p>{data.primaryInfo.feelTemperature}°</p>
                    </div>
                </div>
                <div className='weather-info-cell'>
                    <div className='cell-icon'>
                        <Image
                            src={RainPerc}
                            alt="Search Icon"
                            width={22}
                            height={32}
                        /> 
                    </div>
                    <div className='cell-info'>
                        <p>Rain Percentage</p>
                        <p>{data.primaryInfo.precipitation}%</p>
                    </div>
                </div>
                <div className='weather-info-cell'>
                    <div className='cell-icon'>
                        <Image
                            src={WindIcon}
                            alt="Search Icon"
                            width={32}
                            height={32}
                        /> 
                    </div>
                    <div className='cell-info'>
                        <p>Wind</p>
                        <p>{data.primaryInfo.wind} Km/h</p>
                    </div>
                    
                </div>
                <div className='weather-info-cell'>
                    <div className='cell-icon'>
                        <Image
                            src={PressureIcon}
                            alt="Search Icon"
                            width={32}
                            height={32}
                        /> 
                    </div>
                    <div className='cell-info'>
                        <p>Pressure</p>
                        <p>{data.primaryInfo.pressure} hPa</p>
                    </div>
                </div>
                
            </div>

        </div>
    );
}

