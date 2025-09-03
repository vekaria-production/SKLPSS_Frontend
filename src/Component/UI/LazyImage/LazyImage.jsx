import React, { useState } from "react";

export default function LazyImage({ src, alt = "", className = "" }) {
  const [loaded, setLoaded] = useState(false);

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
      />
    </div>
  );
}
