"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { heroSlides } from "@/data/hero-slides";

export function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartXRef = useRef<number | null>(null);
  const touchEndXRef = useRef<number | null>(null);

  const totalSlides = heroSlides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Autoplay functionality with pause on hover
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      nextSlide();
    }, 5500);

    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartXRef.current || !touchEndXRef.current) return;
    const diffX = touchStartXRef.current - touchEndXRef.current;
    if (diffX > 50) {
      nextSlide();
    } else if (diffX < -50) {
      prevSlide();
    }
    touchStartXRef.current = null;
    touchEndXRef.current = null;
  };

  return (
    <section className="w-full bg-white py-2 sm:py-3.5">
      <div className="mx-auto max-w-[1360px] px-3 sm:px-6">
        {/* Main Slider Frame */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-neutral-200/80 bg-[#F5EFE6] shadow-xs"
        >
          {/* Slides Track */}
          <div
            className="flex transition-transform duration-600 ease-out will-change-transform"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {heroSlides.map((slide) => (
              <div
                key={slide.id}
                className="w-full shrink-0 grid grid-cols-1 md:grid-cols-12 items-center min-h-[220px] sm:min-h-[270px] lg:min-h-[300px]"
              >
                {/* Left Content Column */}
                <div className="z-10 flex flex-col justify-center px-5 py-6 sm:px-10 lg:px-14 md:col-span-7 lg:col-span-7">
                  {/* Eyebrow badge */}
                  <div className="inline-flex items-center gap-2 self-start rounded-full border border-neutral-300/80 bg-white/80 px-3 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-neutral-800 shadow-2xs backdrop-blur-xs">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#FF5B37]" />
                    <span>{slide.tag}</span>
                  </div>

                  {/* Headline */}
                  <h2 className="mt-3 font-sans text-2xl sm:text-3xl lg:text-[36px] font-extrabold tracking-tight text-neutral-900 leading-[1.15]">
                    {slide.title}
                  </h2>

                  {/* Subtitle */}
                  <p className="mt-2 max-w-lg text-xs sm:text-sm text-neutral-600 font-normal leading-relaxed">
                    {slide.subtitle}
                  </p>

                  {/* CTA Button */}
                  <div className="mt-4 sm:mt-6">
                    <Link
                      href={slide.buttonHref}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#FF5B37] px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-sm transition-all hover:bg-[#e64d2b] hover:shadow-md hover:-translate-y-0.5"
                    >
                      <span>{slide.buttonText}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>

                {/* Right Visual Column (High-Res Photography) */}
                <div className="relative h-[180px] sm:h-[270px] lg:h-[300px] w-full md:col-span-5 lg:col-span-5 overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.imageAlt}
                    fill
                    priority={slide.id === "slide-1"}
                    sizes="(max-width: 768px) 100vw, 45vw"
                    className="object-cover object-center transition-transform duration-700 hover:scale-105"
                  />
                  {/* Subtle gradient vignette blending with card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent md:hidden" />
                </div>
              </div>
            ))}
          </div>

          {/* Cute, Minimal Circular Navigation Arrows */}
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md border border-neutral-200/80 backdrop-blur-xs transition-all hover:bg-white hover:scale-108 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
          >
            <ChevronLeft className="h-4 w-4 stroke-[2.2]" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-white/90 text-neutral-800 shadow-md border border-neutral-200/80 backdrop-blur-xs transition-all hover:bg-white hover:scale-108 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-[#FF5B37]"
          >
            <ChevronRight className="h-4 w-4 stroke-[2.2]" />
          </button>

          {/* Pagination Indicators / Dots */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-20">
            {heroSlides.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => goToSlide(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx
                    ? "w-6 bg-[#FF5B37]"
                    : "w-2 bg-neutral-400/60 hover:bg-neutral-600"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

