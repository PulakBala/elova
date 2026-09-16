import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

export function HeroBanner() {
  return (
    <section className="w-full bg-white py-2 sm:py-3">
      <div className="mx-auto max-w-[1360px] px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#F5EFE6] border border-[#EBE3D7]/60">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center min-h-[190px] sm:min-h-[220px] lg:min-h-[240px]">
            {/* Left Content Column */}
            <div className="z-10 flex flex-col justify-center px-6 py-6 sm:px-10 lg:px-12 md:col-span-6 lg:col-span-7">
              <h1 className="font-sans text-2xl sm:text-3xl lg:text-[32px] font-extrabold tracking-tight text-neutral-900 leading-tight">
                Smart Finds for a Better Everyday
              </h1>

              <p className="mt-2 text-xs sm:text-sm text-neutral-600 font-normal">
                Quality products. Great prices. Only at ELVOA.
              </p>

              <div className="mt-4 sm:mt-5">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF5B37] px-5 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-semibold text-white shadow-sm transition-all hover:bg-[#eb4e2a] hover:shadow"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Right Visual Column (Lifestyle Scene) */}
            <div className="relative h-[160px] sm:h-[220px] lg:h-[240px] w-full md:col-span-6 lg:col-span-5">
              <Image
                src="/images/elvoa/hero-right-photo.png"
                alt="Smart Finds for a Better Everyday - Home lifestyle scene"
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-right"
              />

              {/* Slider / Carousel Navigation Arrows */}
              <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 flex items-center gap-1.5">
                <button
                  type="button"
                  aria-label="Previous Slide"
                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-sm border border-neutral-200 transition-colors hover:bg-white hover:border-neutral-300"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  aria-label="Next Slide"
                  className="flex h-6 w-6 sm:h-7 sm:w-7 items-center justify-center rounded-full bg-white/95 text-neutral-800 shadow-sm border border-neutral-200 transition-colors hover:bg-white hover:border-neutral-300"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

