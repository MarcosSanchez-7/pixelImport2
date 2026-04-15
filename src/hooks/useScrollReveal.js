"use client";

import { useCallback, useRef } from "react";

const variantClass = {
  fadeUp: "sr-fade-up",
  fadeIn: "sr-fade-in",
  fadeLeft: "sr-fade-left",
  fadeRight: "sr-fade-right",
  scale: "sr-scale",
};

/**
 * Returns { ref (callback ref), className } to spread on any element.
 * Uses a callback ref so the observer is attached the moment the element
 * mounts — safe even when the component has an early return (e.g. while
 * context initializes).
 */
export function useScrollReveal({ variant = "fadeUp", delay = 0, threshold = 0.1 } = {}) {
  const observerRef = useRef(null);

  const ref = useCallback(
    (el) => {
      if (observerRef.current) {
        observerRef.current.disconnect();
        observerRef.current = null;
      }

      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            if (delay) el.style.transitionDelay = `${delay}ms`;
            el.classList.add("sr-visible");
            observer.unobserve(el);
          }
        },
        { threshold }
      );

      observer.observe(el);
      observerRef.current = observer;
    },
    [delay, threshold]
  );

  return { ref, className: variantClass[variant] ?? "sr-fade-up" };
}
