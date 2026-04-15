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
 * Wrapper component usable from server components (page.js).
 * Uses a callback ref — observer attached exactly when element mounts.
 *
 * <RevealOnScroll variant="scale" delay={150} as="section" className="...">
 *   ...
 * </RevealOnScroll>
 */
export default function RevealOnScroll({
  children,
  variant = "fadeUp",
  delay = 0,
  threshold = 0.1,
  className = "",
  as: Tag = "div",
}) {
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

  return (
    <Tag ref={ref} className={`${variantClass[variant] ?? "sr-fade-up"} ${className}`}>
      {children}
    </Tag>
  );
}
