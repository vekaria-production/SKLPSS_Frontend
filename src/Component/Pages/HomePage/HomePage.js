import Navbar from "../../UI/Navbar/Navbar"
import Footer from "../../UI/Footer/Footer";
import Banner from "./Banner";
import Events from "./Events";
import Partners from "./Partners";
import EducationProgramsHighlight from "./EducationProgram";
function HomePage(){

    return(
        <>
            <Navbar/>
            <Banner/>
            <Events/>
            {/* <Partners/> */}
            <EducationProgramsHighlight/>
            <Footer/>
        </>
    );
}

export default HomePage;