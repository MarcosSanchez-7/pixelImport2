"use client";

import { ProductsProvider } from "@/context/ProductsContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { StorefrontProvider } from "@/context/StorefrontContext";
import CartDrawer from "@/components/CartDrawer";

export function Providers({ children }) {
  return (
    <StorefrontProvider>
      <ProductsProvider>
        <CartProvider>
          <FavoritesProvider>
            {children}
            <CartDrawer />
          </FavoritesProvider>
        </CartProvider>
      </ProductsProvider>
    </StorefrontProvider>
  );
}
