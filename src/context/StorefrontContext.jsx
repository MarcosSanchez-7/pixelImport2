"use client";

import { createContext, useContext, useState, useEffect } from "react";

const StorefrontContext = createContext(null);

const DEFAULT_SETTINGS = {
  heroSlides: [
    {
      id: "slide-1",
      image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=2976",
      title: "TECHNOLOGY\nREDEFINED.",
      subtitle: "Discover the next generation of premium tech gear.",
      badge: "2024 COLLECTION",
    },
    {
      id: "slide-2",
      image: "https://images.unsplash.com/photo-1593640408182-31c228b37b29?q=80&w=2940&auto=format&fit=crop",
      title: "PREMIUM\nGAMING GEAR",
      subtitle: "High-performance peripherals imported directly, no middleman.",
      badge: "CURATED SELECTION",
    },
    {
      id: "slide-3",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2940&auto=format&fit=crop",
      title: "NEXT LEVEL\nTECHNOLOGY",
      subtitle: "Direct imports. No noise. Just the pure essence of silicon and glass.",
      badge: "NEW ARRIVALS",
    },
  ],
  marqueeText: "FREE SHIPPING ON ALL ORDERS OVER Gs. 500.000 • NEW ARRIVALS EVERY WEEK • PREMIUM IMPORTED GEAR",
  instagramUrl: "https://instagram.com",
  tiktokUrl: "https://tiktok.com",
  whatsappUrl: "https://wa.me/595000000000",
  footerText: "Direct imports of hyper-refined technology. No middleman. No noise. Just the pure essence of silicon and glass.",
};

export function StorefrontProvider({ children }) {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pixelimport_storefront");
      if (stored) {
        setSettings({ ...DEFAULT_SETTINGS, ...JSON.parse(stored) });
      }
    } catch {
      // Ignore
    }
    setInitialized(true);
  }, []);

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("pixelimport_storefront", JSON.stringify(updated));
  };

  return (
    <StorefrontContext.Provider value={{ settings, updateSettings, initialized }}>
      {children}
    </StorefrontContext.Provider>
  );
}

export function useStorefront() {
  const ctx = useContext(StorefrontContext);
  if (!ctx) throw new Error("useStorefront must be used within <StorefrontProvider>");
  return ctx;
}
