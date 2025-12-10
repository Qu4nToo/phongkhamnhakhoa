"use client"
import { useState } from 'react';

interface ServiceImageGalleryProps {
  images: string[];
}

export function ServiceImageGallery({ images }: ServiceImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-3">
      <div className="aspect-[16/9] bg-gradient-to-br from-cyan-100 to-blue-50 rounded overflow-hidden">
        <img
          src={images[selectedImage]}
          alt="Trụ Implant"
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`aspect-video rounded overflow-hidden border-2 transition-all ${
              selectedImage === index
                ? 'border-blue-600'
                : 'border-transparent hover:border-gray-300'
            }`}
          >
            <img
              src={image}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}