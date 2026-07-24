import React, { useState } from "react";
import { Calendar } from "lucide-react";

export default function LazyImage({ src, alt = "", className = "" }) {
  const [loaded, setLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If no source is provided or if the image failed to load, render a premium fallback calendar card
  if (!src || hasError) {
    return (
      <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#F48F0F]/10 to-orange-50 text-gray-400 select-none border border-orange-100/40 rounded-xl min-h-[160px] ${className}`}>
        <Calendar size={40} className="text-[#F48F0F]/40 mb-2" />
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">SKLPSS Event</span>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {!loaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        className={`transition-opacity duration-500 w-full h-full object-cover rounded ${
          loaded ? "opacity-100" : "opacity-0"
        } ${className}`}
        onLoad={() => setLoaded(true)}
        onError={() => {
          setLoaded(true);
          setHasError(true);
        }}
      />
    </div>
  );
}
