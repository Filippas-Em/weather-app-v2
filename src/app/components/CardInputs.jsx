import Select from './Select'
import MetricUnits from "../components/MetricUnits"



export default function CardInputs() {
  return (
    <div className="menu-container">
        <Select />
        <div className='controls'>
          <MetricUnits />
        </div>
    </div>
  );
}
