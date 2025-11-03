import React from 'react';
import bannerImage from '../../../assets/banner.jpg';
import hero from '../../../assets/hero.png';
import './Banner.css';
import { motion } from "framer-motion";

export default function Banner() {
  return (
  <section className="relative w-full h-[90vh] sm:h-screen overflow-hidden">
  {/* Background Image with upward offset */}
  <img
    src={hero}
    alt="Shree Kutchi Leva Patel Samaj Seychelles community banner"
    className="absolute inset-0 w-full h-full object-cover object-[center_top_-100px] transition-all duration-1000 ease-in-out"
  />

  {/* Overlay */}
  <div className="absolute inset-0 bg-black/40"></div>

  {/* Animated Text Content */}
  <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-6 animate-fadeInUp">
    <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
      Shree Kutchi Leva Patel Samaj Seychelles
    </h1>
    <p className="mt-4 max-w-2xl text-lg sm:text-xl text-gray-200">
      Keeping the spirit of the Indian diaspora alive through unity, culture, and service.
    </p>

    {/* <div className="mt-8 flex flex-wrap justify-center gap-4">
      <button className="bg-[#F48F0F] hover:bg-[#e1810c] text-[#292929] font-semibold px-8 py-3 rounded-xl transition duration-500">
        Join Our Community
      </button>
      <button className="bg-transparent border border-white text-white hover:bg-white hover:text-[#292929] font-semibold px-8 py-3 rounded-xl transition duration-500">
        Learn More
      </button>
    </div> */}
  </div>

  {/* Animation Styles */}
  <style>
    {`
      @keyframes fadeInUp {
        0% {
          opacity: 0;
          transform: translateY(40px);
        }
        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .animate-fadeInUp {
        animation: fadeInUp 1.2s ease-out forwards;
      }
    `}
  </style>
</section>


  );
}
