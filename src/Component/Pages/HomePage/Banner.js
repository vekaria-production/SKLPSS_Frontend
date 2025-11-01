import React from 'react';
import bannerImage from '../../../assets/banner.jpg';
import './Banner.css';

export default function Banner() {
  return (
    <div className="relative w-full my-4 px-4">
      <div className="relative w-full h-[260px] sm:h-[320px] md:h-[450px] lg:h-[550px] rounded-2xl overflow-hidden shadow-lg">
        <img
          src={bannerImage}
          alt="Community Banner"
          className="w-full h-full object-cover"
        />

        {/* Text Overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center bg-black bg-opacity-25 animate-fade-in px-4">
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl font-bold mb-3 drop-shadow-md">
            Welcome to Shree Kutchi Leva Patel Samaj Seychelles
          </h1>
          <p className="text-white text-base sm:text-lg md:text-xl mb-4 drop-shadow-sm max-w-2xl">
            Connect, collaborate, and grow together. We're building a space where everyone belongs.
          </p>
          {/* <button className="bg-white text-black px-6 py-2 rounded-full text-sm sm:text-base font-semibold shadow hover:bg-gray-200 transition">
            Join Us Now
          </button> */}
        </div>
      </div>
    </div>
  );
}
