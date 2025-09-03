
import Committee from './Committee';
import Vision from './Vision';
import Mission from './Mission';
import PresidentMessage from './PresidentMessage';
import AboutSection from './AboutSection';
import Navbar from '../../UI/Navbar/Navbar';
import Footer from '../../UI/Footer/Footer';

function AboutAs() {
  return (
    <div>

    
        <Navbar/>
        <Committee />
        <Vision />
        <Mission />
        <PresidentMessage />
        <AboutSection />  
        <Footer/> 
    </div>

  );
}

export default AboutAs;