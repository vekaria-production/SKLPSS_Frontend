import { useState } from 'react';

function ImageComponent({ src }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="w-64 h-64 relative flex items-center justify-center overflow-hidden rounded-xl shadow"
    >
      {isLoading && !hasError && (
        <div className="absolute text-gray-500">Loading...</div>
      )}
      {hasError && (
        <div className="absolute text-red-500">Error loading image</div>
      )}
      <img
        src={src}
        alt="Description"
        className="w-full h-full object-cover"
        style={{ display: isLoading && !hasError ? 'none' : 'block' }}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}

export default ImageComponent;
