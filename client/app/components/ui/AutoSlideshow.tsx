"use client";
import React, { useState, useEffect } from "react";

interface AutoSlideshowProps {
  interval?: number; // milliseconds between transitions
  className?: string;
}

const images = [
  "/assets/slideshow/slide1.jpg",
  "/assets/slideshow/slide2.jpg",
  "/assets/slideshow/slide3.jpg",
  "/assets/slideshow/slide4.jpg",
  "/assets/slideshow/slide5.jpg",
  "/assets/slideshow/slide6.jpg",
];
const AutoSlideshow: React.FC<AutoSlideshowProps> = ({
  interval = 3000,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, interval);

    return () => clearInterval(timer);
  }, [images.length, interval]);

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      {images.map((image, index) => (
        <div
          key={index}
          className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out"
          style={{
            opacity: index === currentIndex ? 1 : 0,
            zIndex: index === currentIndex ? 1 : 0,
          }}
        >
          <div className="bg-black/50 absolute h-full w-full" />
          <img
            src={image}
            alt={`Slide ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default AutoSlideshow;
