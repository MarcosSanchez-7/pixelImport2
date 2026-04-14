"use client";

import Image from "next/image";
import Link from "next/link";
import { useStorefront } from "@/context/StorefrontContext";

export default function StorefrontHero() {
  const { settings, initialized } = useStorefront();

  if (!initialized) return null; // Quick hydration fix

  return (
    <>
      {settings.marqueeText && (
        <div className="bg-black text-white py-2 overflow-hidden whitespace-nowrap mt-24">
          <div className="animate-[marquee_20s_linear_infinite] inline-block font-mono text-[9px] uppercase tracking-[0.2em]">
            {settings.marqueeText} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {settings.marqueeText}
          </div>
        </div>
      )}
      <section className="pt-20 pb-24 px-8 min-h-[calc(100vh-6rem)] flex flex-col justify-center relative bg-[var(--color-surface)] overflow-hidden">
        <div className="max-w-[1920px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Copy */}
          <div className="lg:col-span-5 z-10">
            {settings.promoBadge && (
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] font-bold mb-4 block">
                {settings.promoBadge}
              </span>
            )}
            <h1 className="text-[5rem] leading-[0.9] font-black tracking-tighter uppercase mb-8">
              {settings.heroTitle}
            </h1>
            <p className="text-[var(--color-on-surface-variant)] max-w-md mb-12 text-lg leading-relaxed">
              {settings.heroSubtitle}
            </p>
            <div className="flex items-center gap-8">
              <Link
                href="/products"
                className="bg-[var(--color-primary)] text-[var(--color-on-primary)] px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-primary-container)] transition-colors active:scale-95 duration-200 inline-block"
              >
                Shop Now
              </Link>
              <Link
                href="/specs"
                className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest"
              >
                Technical Specs
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                  arrow_forward
                </span>
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-7 relative h-[600px] flex items-center justify-center">
            <div className="absolute inset-0 bg-[var(--color-surface-container-low)] rounded-full scale-75 blur-3xl opacity-50" />
            <div className="relative z-10 w-full h-full">
              <Image
                src={settings.heroImage}
                alt="Storefront Hero Image"
                fill
                className="object-contain mix-blend-multiply"
                priority
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
