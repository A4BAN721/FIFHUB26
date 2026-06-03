"use client";

import React, { useEffect, useState } from "react";

interface RandomImage {
  id: number;
  left: number;
  top: number;
  type: "star" | "eagle" | "maple";
  size: number;
  opacity: number;
  rotation: number;
  duration: number;
}

export function TriondaBackground() {
  const [images, setImages] = useState<RandomImage[]>([]);

  useEffect(() => {
    // Generate scattered random images across entire viewport
    const types: ("star" | "eagle" | "maple")[] = ["star", "eagle", "maple"];
    const randomImages: RandomImage[] = [];

    // Create a much denser pattern (200-300 images total)
    for (let i = 0; i < 280; i++) {
      randomImages.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 100,
        type: types[Math.floor(Math.random() * types.length)],
        size: 16 + Math.random() * 32, // 16px to 48px
        opacity: 0.04 + Math.random() * 0.08, // 4-12% opacity
        rotation: Math.random() * 360,
        duration: 20 + Math.random() * 40, // 20-60s animations
      });
    }

    setImages(randomImages);
  }, []);

  const getImageUrl = (type: string) => {
    switch (type) {
      case "star":
        return "/hosts/star.jpg";
      case "eagle":
        return "/hosts/eagle.jpg";
      case "maple":
        return "/hosts/maple.webp";
      default:
        return "/hosts/star.jpg";
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Background base */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-background opacity-95" />

      {/* Scattered image layer */}
      <div className="absolute inset-0">
        {images.map((img) => (
          <div
            key={img.id}
            className="absolute animate-diagonal-float"
            style={{
              left: `${img.left}%`,
              top: `${img.top}%`,
              width: `${img.size}px`,
              height: `${img.size}px`,
              opacity: img.opacity,
              transform: `rotate(${img.rotation}deg)`,
              animationDuration: `${img.duration}s`,
              animationDelay: `${Math.random() * 8}s`,
              filter: "saturate(0.6) brightness(1.1) contrast(0.9)",
              mixBlendMode: "overlay",
            }}
          >
            <img
              src={getImageUrl(img.type)}
              alt="host"
              className="w-full h-full object-cover"
              style={{ pointerEvents: "none" }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
