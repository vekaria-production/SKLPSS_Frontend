// import logo from './logo.svg';
// import './App.css';
import RouteMmgmt from './Context/Route/Route'
import { OptionsProvider } from './Context/Options/OptionsContext'; // ✅ fixed import
import { AuthProvider } from './Context/Auth/AuthContext';

function App() {
  return (
    <>
      <AuthProvider>
        <OptionsProvider>
          <RouteMmgmt/>
        </OptionsProvider>
      </AuthProvider>
    </>
    
  );
}

export default App;
