import TempIcon from '../../../public/temp1.png'
import RainPerc from '../../../public/rainPerc.png'
import WindIcon from '../../../public/wind1.png'
import Image from 'next/image';


export default function HourlySlot({time, icon,temp,precipitation,wind}) {
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
    console.log("hourly component",time)

    return (
        <div className="hourly-slot">
            <div className="slot-first-half">
                <p>{time}</p>
                <i className={`wi ${weatherIcons[icon]}`}></i>
            </div>
            <div className="slot-second-half">
                <div className="info-set">
                    <p>{precipitation}%</p>
                    <Image
                        src={RainPerc}
                        alt="Search Icon"
                        width={16}
                        height={23}
                    /> 
                </div>
                <div className="info-set">
                    <p>{wind}km/h</p>
                    <Image
                        src={WindIcon}
                        alt="Search Icon"
                        width={23}
                        height={23}
                    />
                </div>
                <div className="info-set">
                    <p>{temp}°</p>
                    <Image
                        src={TempIcon}
                        alt="Search Icon"
                        width={23}
                        height={23}
                    />
                </div>
            </div>
        </div>
    )
}