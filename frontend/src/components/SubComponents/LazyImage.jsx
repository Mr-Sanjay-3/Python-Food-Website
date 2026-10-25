import React, { useState } from 'react';

const LazyImage = ({
  src,
  alt = 'Food Item',
  className = '',
  containerClassName = '',
  fallback = '🍔',
  eager = false,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // If no source is provided or source errored, render fallback icon
  if (!src || hasError) {
    return (
      <div className={`flex items-center justify-center text-2xl ${containerClassName}`}>
        <span className="opacity-80 select-none">{fallback}</span>
      </div>
    );
  }

  return (
    <div className={`relative flex items-center justify-center overflow-hidden ${containerClassName}`}>
      {/* Subtle pulse placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-white/5 animate-pulse rounded-xl flex items-center justify-center">
          <span className="text-xl opacity-20">🥘</span>
        </div>
      )}

      <img
        src={src}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`transition-all duration-300 ease-out ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        } ${className}`}
      />
    </div>
  );
};

export default LazyImage;
