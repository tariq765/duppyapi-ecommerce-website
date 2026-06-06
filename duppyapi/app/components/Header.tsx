"use client";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { src: "daraz1.avif", link: "/products" },
    { src: "draz2.avif", link: "/products" },
    { src: "draz3.avif", link: "/products" },
    { src: "draz4.avif", link: "/products" },
    { src: "draz5.avif", link: "/products" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 sm:mt-6 mb-6 sm:mb-10">
      <div className="relative w-full overflow-hidden rounded-xl shadow-lg">
        {/* Image slider */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, index) => (
            <div key={index} className="relative w-full flex-shrink-0">
              <img
                src={slide.src}
                alt={`slide-${index + 1}`}
                className="w-full h-[180px] sm:h-[300px] md:h-[400px] lg:h-[450px] object-cover transition-all duration-300"
              />
              <div className="absolute bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2">
                <a
                  href={slide.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-orange-500 text-white px-4 py-1.5 sm:px-6 sm:py-3 rounded-full text-xs sm:text-lg font-semibold hover:bg-orange-600 transition shadow-md whitespace-nowrap"
                >
                  Shop Now
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Left & Right Buttons */}
        <button
          onClick={() =>
            setCurrentSlide((currentSlide - 1 + slides.length) % slides.length)
          }
          className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full p-1 sm:p-2 shadow-md transition-all hover:scale-110 active:scale-95"
          aria-label="Previous Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button
          onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
          className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full p-1 sm:p-2 shadow-md transition-all hover:scale-110 active:scale-95"
          aria-label="Next Slide"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 sm:w-6 sm:h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-2 sm:bottom-4 left-1/2 -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full transition-all ${
                currentSlide === index ? "bg-orange-500 w-3 sm:w-5" : "bg-white/50"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Header;

