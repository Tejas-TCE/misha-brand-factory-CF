"use client";
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { volkhov } from "../lib/fonts";
const FashionCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const slides = [
    {
      id: 1,
      image: "review/image (3).png",
      review: "“You won't regret it. I would like to personally thank you for your outstanding product. Absolutely wonderful!”",
      name: "James K.",
      status: "Traveler",
    },
    {
      id: 2,
      image: "review/image (4).png",
      review: "“Items That I ordered were the best investment I ever made. I can't say enough about your quality service.”",
      name: "Suzan B.",
      status: "UI Designer",
    },
    {
      id: 3,
      image: "/review/image (5).png",
      review: "“Just what I was looking for. Thank you for making it painless, pleasant and most of all hassle free! All products are great.”",
      name: "Megen W.",
      status: "UI Designer",
    },
  ];

  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }
  };

  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    }
  };

  const goToSlide = (index) => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide(index);
    }
  };

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsTransitioning(false), 500);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const getCardPosition = (index) => {
    const diff = index - currentSlide;
    const total = slides.length;

    if (diff === 0) return 'active';
    if (diff === 1 || diff === -(total - 1)) return 'next';
    if (diff === -1 || diff === total - 1) return 'prev';
    return 'hidden';
  };

  if (!slides.length) {
    return <div className="text-center text-gray-600">No reviews available.</div>;
  }

  return (
    <div className="min-h-[420px] bg-gradient-to-br from-gray-50 to-gray-200 py-6 px-2 sm:px-4">
      <div className="max-w-6xl mx-auto rounded-2xl p-3 sm:p-4 lg:p-8">
        <h2 className={`${volkhov.className} text-xl sm:text-2xl lg:text-4xl font-bold text-center text-gray-800 mb-3 sm:mb-4`}>
          This Is What Our Customers Say
        </h2>
        <p className="text-center text-gray-500 max-w-md sm:max-w-xl lg:max-w-5xl mx-auto mb-4 sm:mb-6 text-xs sm:text-sm lg:text-base">
          We love hearing from you! Our customers are at the heart of everything we do, and your feedback inspires us to keep getting better. Read real reviews from happy shoppers whove loved our products and service, Have something to share? Drop your review and join our growing community of satisfied customers!
        </p>
        <button className="block mx-auto mb-4 cursor-pointer sm:mb-6 px-3 py-1 sm:px-4 sm:py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-xs sm:text-sm lg:text-base">
          Submit Google Review
        </button>

        {/* Carousel Section - Responsive height */}
        <div className="relative h-[200px] sm:h-[350px] md:h-[400px] lg:h-[380px] flex items-center justify-center overflow-hidden">
          {/* Slides */}
          {slides.map((slide, index) => {
            const position = getCardPosition(index);

            return (
              <div
                key={slide.id}
                className={`absolute top-1/2 -translate-y-1/2 transition-all duration-500 ease-in-out
                  ${position === 'active' ? 'opacity-100 z-10 scale-100 translate-x-0 shadow-xl w-[280px] sm:w-[min(864px,90vw)]' : ''}
                  ${position === 'next' ? 'max-[425px]:hidden opacity-60 z-0 scale-95 translate-x-[60%] sm:translate-x-[45%] lg:translate-x-[35%] shadow-md w-0 sm:w-[min(648px,75vw)]' : ''}
                  ${position === 'prev' ? 'max-[425px]:hidden opacity-60 z-0 scale-95 -translate-x-[60%] sm:-translate-x-[45%] lg:-translate-x-[35%] shadow-md w-0 sm:w-[min(648px,75vw)]' : ''}
                  ${position === 'hidden' ? 'opacity-0 scale-75 pointer-events-none w-0' : ''}`}
                onClick={() => position !== 'active' && goToSlide(index)}
              >
                {/* Card with specific heights based on position */}
                <div 
                   className="bg-white p-4 sm:p-5 lg:p-6 rounded-lg flex flex-row gap-4 md:gap-6 items-center border border-gray-200 h-auto min-h-[156px] sm:min-h-[202px] lg:min-h-[220px]"
                >
                  {/* Image container - fixed positioning */}
                  <div
                    className="reviews_img_shadow bg-red-200 overflow-hidden flex-shrink-0 shadow-lg w-[70.38px] h-[70.38px] sm:w-[202px] sm:h-[202px]"
                  >
                    <img
                      src={slide.image}
                      alt={slide.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  
                  {/* Content container - only shown for active card on screens >425px */}
                  {position === 'active' && (
                    <div className="flex-1 text-left flex flex-col justify-center">
                      <p className="text-gray-600 italic text-[12px] text-sm md:text-base lg:text-lg line-clamp-3 leading-relaxed">
                        {slide.review}
                      </p>
                      <div className="flex justify-start text-yellow-500 md:mb-2 text-10 sm-my-2">
                        {"★★★★★".split("").map((s, i) => (
                          <span key={i}>{s}</span>
                        ))}
                      </div>
                      <hr className="w-40  bg-black  sm-my-3"></hr>
                      <h4 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 mb-1">
                        {slide.name}
                      </h4>
                      <p className="text-sm md:text-sm lg:text-base text-gray-500">
                        {slide.status}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Left and Right Arrow Buttons Below Dots */}
        <div className="flex justify-center gap-4 mt-4 sm:mt-6">
          <button
            onClick={prevSlide}
            disabled={isTransitioning}
            className="bg-white hover:bg-gray-100 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full shadow-md flex items-center justify-center transition-all duration-300 disabled:opacity-50 cursor-pointer"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
          </button>
          <button
            onClick={nextSlide}
            disabled={isTransitioning}
            className="bg-white hover:bg-gray-100 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full shadow-md flex items-center justify-center transition-all duration-300 disabled:opacity-50 cursor-pointer"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default FashionCarousel;
