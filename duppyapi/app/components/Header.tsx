"use client";
import React, { useEffect, useState } from "react";

const Header = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    { src: "daraz1.avif", link: "https://www.daraz.pk/" },
    { src: "draz2.avif", link: "https://www.daraz.pk/" },
    { src: "draz3.avif", link: "https://www.daraz.pk/" },
    { src: "draz4.avif", link: "https://www.daraz.pk/" },
    { src: "draz5.avif", link: "https://www.daraz.pk/" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="relative w-full overflow-hidden mt-6 mb-10">
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
              className="w-full h-[450px] object-cover rounded-xl shadow-md"
            />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <a
                href={slide.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-orange-500 text-white px-6 py-3 rounded-full text-lg font-semibold hover:bg-orange-600 transition"
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
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full px-3 py-2"
      >
        ❮
      </button>

      <button
        onClick={() => setCurrentSlide((currentSlide + 1) % slides.length)}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-black rounded-full px-3 py-2"
      >
        ❯
      </button>
    </div>
  );
};

export default Header;
