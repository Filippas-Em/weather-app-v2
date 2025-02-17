import Layout from './skeletons/Layout';
import { LocationProvider } from './components/LocationContext';

export default function Home() {
  return (
    <LocationProvider>
      <div className='mainContent'>
        <Layout />
      </div>
    </LocationProvider>
  );
}
