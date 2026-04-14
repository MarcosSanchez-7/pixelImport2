"use client";

import { createContext, useContext, useState, useEffect } from "react";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("pixelimport_favorites");
      if (stored) setFavorites(JSON.parse(stored));
    } catch {}
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (initialized)
      localStorage.setItem("pixelimport_favorites", JSON.stringify(favorites));
  }, [favorites, initialized]);

  const toggleFavorite = (productId) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const isFavorite = (productId) => favorites.includes(productId);

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, count: favorites.length }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be inside <FavoritesProvider>");
  return ctx;
}
