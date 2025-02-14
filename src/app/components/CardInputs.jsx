import Select from './Select'
import MetricUnits from "../components/MetricUnits"
import Search from './Search';


export default function CardInputs() {
  return (
    <div className="menu-container">
        <Select />
        <div className='input-controls'>
          <Search />
          <MetricUnits />
        </div>
    </div>
  );
}
