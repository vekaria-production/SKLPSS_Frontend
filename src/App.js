// import logo from './logo.svg';
// import './App.css';
import RouteMmgmt from './Context/Route/Route'
import { OptionsProvider } from './Context/Options/OptionsContext'; // ✅ fixed import

function App() {
  return (
    <>
      <OptionsProvider>
        <RouteMmgmt/>
      </OptionsProvider>
    </>
    
  );
}

export default App;
