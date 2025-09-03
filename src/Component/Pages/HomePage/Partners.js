import React from 'react';
import sponsor1 from '../../../assets/sponsor.png';
import sponsor2 from '../../../assets/sponsor2.png';

const sponsors = [sponsor1, sponsor2, sponsor1, sponsor2, sponsor1, sponsor2, sponsor1, sponsor2];

export default function Partners() {
  return (
    <section className="text-center px-[5vw] mb-20 overflow-hidden">
        <h2 className="text-[clamp(1.75rem,6vw,3rem)] font-extrabold text-[#292929] tracking-tight mb-16 relative inline-block">
        Our <span className="text-[#F48F0F]">Partners</span>
        <span className="absolute left-0 bottom-0 w-full h-1 bg-[#F48F0F] rounded-full animate-pulse opacity-60"></span>
        </h2>

      {/* Scrolling row */}
      <div className="relative w-full ">
        <div className="flex gap-6 animate-scroll whitespace-nowrap">
          {sponsors.concat(sponsors).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Sponsor ${i + 1}`}
              className="w-[40vw] max-w-[160px] h-auto object-contain"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
