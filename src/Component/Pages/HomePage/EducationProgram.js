import React, { useEffect, useRef, useState } from "react";

import gujaratiClassesImg from "./../../../assets/gujarati_classes.png";
import educationMattersImg from "./../../../assets/education_matters.png";

export default function EducationProgramsHighlight() {
  const galleryImages = [
    { src: gujaratiClassesImg, alt: "Gujarati language classes for children" },
  ];

  const sectionRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(false);

  // Parallax effect for non-gallery images
  useEffect(() => {
    const handleParallax = () => {
      if (!sectionRef.current) return;
      const scrollTop = window.pageYOffset;
      const parallaxImages = sectionRef.current.querySelectorAll(".parallax-img");
      parallaxImages.forEach((img, index) => {
        const speed = 0.3 + index * 0.1;
        img.style.transform = `translateY(${scrollTop * speed}px) scale(${
          1 + scrollTop * 0.0005
        })`;
      });
    };

    let ticking = false;
    const rafListener = () => {
      handleParallax();
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(rafListener);
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Map global scroll -> slide navigation
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const isSectionCentered = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight;
      return rect.top < vh * 0.6 && rect.bottom > vh * 0.4;
    };

    const onWheel = (e) => {
      if (!isSectionCentered()) return;
      if (e.deltaY > 0) {
        // scroll down
        if (currentIndex < galleryImages.length - 1) {
          e.preventDefault();
          setCurrentIndex((prev) => prev + 1);
          setIsAtBottom(false);
        } else {
          setIsAtBottom(true);
        }
      } else if (e.deltaY < 0) {
        // scroll up
        if (currentIndex > 0) {
          e.preventDefault();
          setCurrentIndex((prev) => prev - 1);
          setIsAtBottom(false);
        }
      }
    };

    let touchStartY = 0;
    const onTouchStart = (e) => {
      touchStartY = e.touches?.[0]?.clientY ?? 0;
    };
    const onTouchMove = (e) => {
      if (!isSectionCentered()) return;
      const currentY = e.touches?.[0]?.clientY ?? 0;
      const delta = touchStartY - currentY;
      if (Math.abs(delta) < 40) return; // small swipe ignore
      if (delta > 0 && currentIndex < galleryImages.length - 1) {
        e.preventDefault();
        setCurrentIndex((prev) => prev + 1);
        setIsAtBottom(false);
      } else if (delta < 0 && currentIndex > 0) {
        e.preventDefault();
        setCurrentIndex((prev) => prev - 1);
        setIsAtBottom(false);
      } else if (currentIndex === galleryImages.length - 1) {
        setIsAtBottom(true);
      }
      touchStartY = currentY;
    };

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [currentIndex, galleryImages.length]);

  return (
    <section
      ref={sectionRef}
      className="text-center px-[5vw] mb-20 max-w-[90vw] mx-auto relative min-h-screen"
    >
      <h2 className="mb-8 text-[clamp(2rem,5vw,2.75rem)] font-extrabold text-[#292929] tracking-tight sticky top-0 z-10 bg-white py-4">
        Education Programs <span className="text-[#F48F0F]">Highlight</span>
      </h2>

      {/* Gujarati Classes */}
      <div className="flex flex-col lg:flex-row-reverse items-start bg-white rounded-2xl shadow-md border border-[#e4e4e4] hover:shadow-xl overflow-hidden mt-8">
        <div className="text-left w-full lg:w-1/2 p-6 lg:p-8 order-2 lg:order-1">
          <h3 className="font-semibold text-[clamp(1.125rem,2.2vw,1.5rem)] text-[#292929] mb-4">
            Gujarati Classes for the Diaspora
          </h3>
          <p className="text-[clamp(0.95rem,1.7vw,1.05rem)] text-[#444] leading-relaxed mb-4">
            SKLPSS offers engaging Gujarati language classes tailored for children and families in the diaspora. These classes focus on reading, writing, speaking, and grammar, while incorporating cultural elements to preserve our heritage.
          </p>
          <p className="text-[clamp(0.95rem,1.7vw,1.05rem)] text-[#444] leading-relaxed">
            Students participate in interactive activities, such as performances
            during festivals, to make learning fun and relevant. Our programs
            strengthen community bonds and keep the next generation connected to
            their roots.
          </p>

          {isAtBottom ? (
            <p className="mt-4 text-green-600 font-semibold">
              Gallery reached end — global scroll continues
            </p>
          ) : (
            <p className="mt-4 text-blue-600 font-semibold">
              Scroll (anywhere) to navigate the gallery
            </p>
          )}
        </div>

        {/* Vertical Slide Gallery */}
        <div className="w-full lg:w-1/2 h-[60vh] lg:h-[420px] relative overflow-hidden bg-gradient-to-br from-[#F48F0F]/10 to-[#292929]/5 order-1 lg:order-2">
          <div
            className="absolute inset-0 transition-transform duration-700 ease-in-out"
            style={{
              transform: `translateY(-${currentIndex * 100}%)`,
            }}
          >
            {galleryImages.map((img, index) => (
              <div
                key={index}
                className="w-full h-[60vh] lg:h-[420px] flex items-center justify-center"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Education Matters */}
      <div className="flex flex-col lg:flex-row-reverse items-start bg-white rounded-2xl shadow-md border border-[#e4e4e4] hover:shadow-xl overflow-hidden mt-8">
        <div className="text-left w-full lg:w-1/2 p-6 lg:p-8 order-2 lg:order-1">
          <h3 className="font-semibold text-[clamp(1.125rem,2.2vw,1.5rem)] text-[#292929] mb-4">
            Why Our Education Matters
          </h3>
          <p className="text-[clamp(0.95rem,1.7vw,1.05rem)] text-[#444] leading-relaxed">
            In Seychelles, where diverse cultures blend, SKLPSS's education
            programs provide a vital link to Gujarati traditions. By teaching
            language alongside values and customs, we support diaspora families
            in maintaining their identity. Future expansions may include
            advanced levels or online sessions.
          </p>
        </div>
        <div className="w-full  relative h-[300px] lg:h-[400px] order-1  overflow-hidden">
          
          <img
            src={educationMattersImg}
            alt="Gujarati cultural learning values"
            className="absolute  w-full h-full  rounded-r-lg lg:rounded-l-lg shadow-lg object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/30"></div>
        </div>
      </div>

      {/* Placeholder */}
      {/* <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-2xl border-2 border-dashed border-[#F48F0F]/30 text-center hover:border-[#F48F0F] transition-colors mt-8">
        <h3 className="font-semibold text-[clamp(1.125rem,2.2vw,1.5rem)] text-[#292929] mb-4">
          Placeholder for Future Content
        </h3>
        <p className="text-[clamp(0.95rem,1.7vw,1.05rem)] text-[#444] leading-relaxed">
          Add more sections here for other activities, such as cultural
          festivals, health initiatives, or community services. You can insert
          additional components or content blocks similar to the ones above.
        </p>
        <button className="mt-4 bg-[#F48F0F]/80 text-white px-6 py-2 rounded-full font-semibold hover:bg-[#F48F0F] transition-colors">
          Expand Section
        </button>
      </div> */}
    </section>
  );
}
