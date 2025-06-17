'use client';
import React, { useState } from 'react';

export default function ProductImageCarousel({ imageUrls, alt = 'Product image' }: { imageUrls: string[]; alt?: string }) {
  const [idx, setIdx] = useState(0);
  if (!imageUrls || imageUrls.length === 0) {
    return <div className="bg-gray-200 flex items-center justify-center rounded w-full h-40 text-gray-400">No Image</div>;
  }
  const prev = () => setIdx(i => (i === 0 ? imageUrls.length - 1 : i - 1));
  const next = () => setIdx(i => (i === imageUrls.length - 1 ? 0 : i + 1));
  return (
    <div className="relative w-full h-40 flex items-center justify-center">
      <img src={imageUrls[idx]} alt={alt} className="object-contain rounded h-full max-w-full mx-auto" />
      {imageUrls.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full px-2 py-1 text-lg font-bold shadow hover:bg-opacity-90"
            aria-label="Previous image"
          >
            &#8592;
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white bg-opacity-70 rounded-full px-2 py-1 text-lg font-bold shadow hover:bg-opacity-90"
            aria-label="Next image"
          >
            &#8594;
          </button>
        </>
      )}
      {imageUrls.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {imageUrls.map((_, i) => (
            <span key={i} className={`inline-block w-2 h-2 rounded-full ${i === idx ? 'bg-[#990000]' : 'bg-gray-300'}`}></span>
          ))}
        </div>
      )}
    </div>
  );
} 