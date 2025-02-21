import HourlySlot from "./HourlySlot"
import { useLocation } from '../components/LocationContext';

export default function SecondaryWeekCardInfo({data}){

    const { selectedDay, setSelectedDay } = useLocation();
    if(!data.secondaryInfo) return null;

    console.log("Secondary Week card",data.secondaryInfo[0][0]);
    return (
        <div className="secondary-card-info">
            {data.secondaryInfo[selectedDay].map((info, index) => (
                <HourlySlot
                    key={index} 
                    time={info.time}
                    icon={info.weatherCode}
                    temp={info.temperature}
                    precipitation={info.precipitation}
                    wind={info.wind}
                />
            ))}
        </div>
    )
}