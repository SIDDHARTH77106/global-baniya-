'use client';

/* eslint-disable @next/next/no-img-element */

import { useState } from 'react';

type ProductGalleryProps = {
  productName: string;
  images: string[];
};

function imageSrc(image?: string | null) {
  if (!image) return null;
  if (image.startsWith('http') || image.startsWith('/')) return image;
  return `/${image}`;
}

export default function ProductGallery({ productName, images }: ProductGalleryProps) {
  const normalizedImages = images.length > 0 ? images : [];
  const [selectedImage, setSelectedImage] = useState(normalizedImages[0] ?? null);
  const activeSrc = imageSrc(selectedImage);

  return (
    <div className="grid gap-4 lg:grid-cols-[88px_1fr]">
      <div className="order-2 flex gap-3 overflow-x-auto lg:order-1 lg:flex-col">
        {normalizedImages.length > 0 ? (
          normalizedImages.map((image) => {
            const src = imageSrc(image);
            return (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(image)}
                className={`flex h-20 w-20 shrink-0 items-center justify-center rounded-lg border bg-white p-2 transition ${
                  selectedImage === image ? 'border-emerald-600 ring-2 ring-emerald-100' : 'border-gray-200 hover:border-emerald-300'
                }`}
              >
                {src ? <img src={src} alt={productName} className="h-full w-full object-contain" /> : 'GB'}
              </button>
            );
          })
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-lg border border-gray-200 bg-white text-sm font-black text-emerald-700">
            GB
          </div>
        )}
      </div>

      <div className="order-1 flex aspect-square items-center justify-center rounded-lg border border-gray-200 bg-white p-8 shadow-sm lg:order-2">
        {activeSrc ? (
          <img src={activeSrc} alt={productName} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-full bg-emerald-100 text-4xl font-black text-emerald-700">
            GB
          </div>
        )}
      </div>
    </div>
  );
}
