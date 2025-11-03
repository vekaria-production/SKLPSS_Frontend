import React from 'react';
import bannerImage from '../../../assets/banner.jpg';
import hero from '../../../assets/hero.png';
import './Banner.css';

export default function Banner() {
  return (
    <div className="relative w-full my-4 px-4">
      <div className="relative w-full rounded-2xl overflow-hidden shadow-lg">
        <img
          src={hero}
          alt="Shree Kutch Leva Patel Samaj Seychelles community banner"
          className="w-full h-full object-cover object-center"
        />

        {/* Overlay for readability and optional text */}
        <div className="absolute inset-0 bg-black/00 flex flex-col items-center justify-center text-center text-white px-6">
          {/* <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold drop-shadow-lg">
            Shree Kutch Leva Patel Samaj Seychelles
          </h1> */}
          {/* <p className="mt-3 text-sm sm:text-lg max-w-2xl">
            Keeping our Indian heritage alive while building unity and service in Seychelles
          </p> */}
        </div>
      </div>
    </div>
  );
}
