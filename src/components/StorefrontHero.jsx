"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useStorefront } from "@/context/StorefrontContext";

const FALLBACK_SLIDES = [
  {
    id: "fallback-1",
    image: "https://images.unsplash.com/photo-1593640408182-31c228b37b29?q=80&w=2940&auto=format&fit=crop",
    badge: "CURATED SELECTION",
    title: "PREMIUM\nGAMING GEAR",
    subtitle: "High-performance peripherals imported directly, no middleman.",
  },
];

export default function StorefrontHero() {
  const { settings, initialized } = useStorefront();
  const [current, setCurrent] = useState(0);

  const slides =
    initialized && settings.heroSlides?.length > 0
      ? settings.heroSlides
      : FALLBACK_SLIDES;

  const total = slides.length;

  const go = (dir) => setCurrent((c) => (c + dir + total) % total);

  // Auto-advance every 5 s
  useEffect(() => {
    const t = setInterval(() => setCurrent((c) => (c + 1) % total), 5000);
    return () => clearInterval(t);
  }, [total]);

  if (!initialized) {
    return (
      <div className="mt-16 h-[calc(100svh-4rem)] bg-zinc-200 animate-pulse" />
    );
  }

  return (
    <>
      {/* ── Full-screen carousel ── */}
      <div className="mt-16 relative overflow-hidden h-[calc(100svh-4rem)] bg-black select-none">

        {/* Slides track */}
        <div
          className="flex h-full"
          style={{
            width: `${total * 100}%`,
            transform: `translateX(-${current * (100 / total)}%)`,
            transition: "transform 700ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="relative h-full shrink-0"
              style={{ width: `${100 / total}%` }}
            >
              {/* Background image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.image}
                alt={slide.title || "Slide"}
                className="w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

              {/* Text */}
              <div className="absolute inset-0 flex items-center px-8 sm:px-16 lg:px-28">
                <div className="max-w-2xl">
                  {slide.badge && (
                    <span className="text-[10px] uppercase tracking-[0.35em] text-white/60 font-bold mb-5 block">
                      {slide.badge}
                    </span>
                  )}
                  <h1 className="text-[3rem] sm:text-[5rem] lg:text-[6.5rem] font-black tracking-tighter uppercase leading-[0.85] text-white mb-6 whitespace-pre-line">
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="text-white/60 text-sm sm:text-base leading-relaxed mb-10 max-w-sm">
                      {slide.subtitle}
                    </p>
                  )}
                  <Link
                    href="/products"
                    className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-zinc-100 transition-colors active:scale-95 duration-150"
                  >
                    Explore Imports
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                      arrow_forward
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── Left arrow ── */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous slide"
          className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white/25 hover:border-white/50 transition-all flex items-center justify-center"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
            chevron_left
          </span>
        </button>

        {/* ── Right arrow ── */}
        <button
          onClick={() => go(1)}
          aria-label="Next slide"
          className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/10 backdrop-blur-sm border border-white/25 text-white hover:bg-white/25 hover:border-white/50 transition-all flex items-center justify-center"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
            chevron_right
          </span>
        </button>

        {/* ── Dot indicators ── */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              className={`transition-all duration-300 ${
                i === current
                  ? "w-7 h-1.5 bg-white"
                  : "w-1.5 h-1.5 rounded-full bg-white/40 hover:bg-white/70"
              }`}
            />
          ))}
        </div>

        {/* ── Slide counter ── */}
        <div className="absolute bottom-[30px] right-8 sm:right-16 lg:right-28 z-20 text-white/35 text-[9px] font-mono tracking-[0.25em]">
          {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </div>
      </div>

      {/* ── Marquee (below carousel) ── */}
      {settings.marqueeText && (
        <div className="bg-black text-white py-2 overflow-hidden flex">
          <div className="flex w-max animate-[marquee_180s_linear_infinite]">
            <div className="flex shrink-0">
              {[...Array(15)].map((_, i) => (
                <span
                  key={`mq1-${i}`}
                  className="flex-none whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] pr-24"
                >
                  {settings.marqueeText}
                </span>
              ))}
            </div>
            <div className="flex shrink-0" aria-hidden="true">
              {[...Array(15)].map((_, i) => (
                <span
                  key={`mq2-${i}`}
                  className="flex-none whitespace-nowrap font-mono text-[9px] uppercase tracking-[0.2em] pr-24"
                >
                  {settings.marqueeText}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
