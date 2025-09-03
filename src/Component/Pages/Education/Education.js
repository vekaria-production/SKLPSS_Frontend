import React from "react";
import { GraduationCap, BookText, FileText } from "lucide-react";
import Navbar from "../../UI/Navbar/Navbar";
import Footer from "../../UI/Footer/Footer";
import img from "../../../assets/Edu_Hero.png";

const Education = () => {
  return (
    <>
      <Navbar />
      <div className="bg-[#FDF8F3] text-[#292929] min-h-screen mt-2">
        {/* Hero Section */}
        <div className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto px-6 py-16 gap-10">
          {/* Text Content */}
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
              Empowering Education for our <br className="hidden md:inline" />{" "}
              community!
            </h1>
            <p className="text-base md:text-lg mb-6">
              A digital learning platform for students and teachers of the
              Indian community in Seychelles.
            </p>
            <button
              className="bg-[#F48F0F] hover:bg-[#e1810c] text-[#292929] font-semibold px-6 py-2 rounded-lg transition"
              onClick={() => alert("🚧 This feature is under development!")}
            >
              Login as Student/Teacher
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 flex justify-center">
            <img
              src={img}
              alt="Education Illustration"
              className="rounded-xl w-full max-w-md shadow-md"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-white py-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Features
          </h2>
          <div className="max-w-6xl mx-auto px-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={<GraduationCap size={45} className="text-[#F48F0F] " />}
              title="Student friendly LMS"
              desc="Intuitive tools tailored for effective student learning"
            />
            <FeatureCard
              icon={<BookText size={45} className="text-[#F48F0F]" />}
              title="Teacher Dashboards"
              desc="Simplified management for educators"
            />
            <FeatureCard
              icon={<FileText size={45} className="text-[#F48F0F]" />}
              title="Assignment & Submission"
              desc="Easy assignment distribution and collection"
            />
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="bg-[#FDF8F3] border border-[#292929] rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-[0_0_10px_rgba(244,143,15,0.4)]">
    <div className="mb-6 w-20 h-20 rounded-full border-2 border-[#292929/75] flex items-center justify-center ">
      <div className="text-[#F48F0F]">{icon}</div>
    </div>
    <h3 className="font-semibold text-lg mb-2">{title}</h3>
    <p className="text-sm text-[#4B4B4B]">{desc}</p>
  </div>
);

export default Education;
