import HourlySlot from "./HourlySlot"

export default function SecondaryCardInfo({data}){
    if(!data.secondaryInfo) return null;
    console.log("secondary component:",data.secondaryInfo);


    return (
        <div className="secondary-card-info">
            {data.secondaryInfo.map((info, index) => (
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