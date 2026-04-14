"use client";

import { createContext, useContext, useState, useEffect } from "react";

const StorefrontContext = createContext(null);

const DEFAULT_SETTINGS = {
  heroTitle: "TECHNOLOGY REDEFINED.",
  heroSubtitle: "Discover the next generation of premium tech gear.",
  heroImage: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=2976",
  marqueeText: "FREE SHIPPING ON ALL ORDERS OVER Gs. 500.000 • NEW ARRIVALS EVERY WEEK • PREMIUM IMPORTED GEAR",
  promoBadge: "2024 COLLECTION",
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
