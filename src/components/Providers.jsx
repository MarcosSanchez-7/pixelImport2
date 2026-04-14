"use client";

import { ProductsProvider } from "@/context/ProductsContext";
import { CartProvider } from "@/context/CartContext";
import { FavoritesProvider } from "@/context/FavoritesContext";
import { StorefrontProvider } from "@/context/StorefrontContext";
import CartDrawer from "@/components/CartDrawer";
import WhatsappFloat from "@/components/WhatsappFloat";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Providers({ children }) {
  return (
    <StorefrontProvider>
      <ProductsProvider>
        <CartProvider>
          <FavoritesProvider>
            {children}
            <CartDrawer />
            <WhatsappFloat />
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar
              newestOnTop
              closeOnClick
              pauseOnHover
              theme="dark"
              toastStyle={{
                fontFamily: "Inter, sans-serif",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                borderRadius: "2px",
                background: "#0a0a0a",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.35)",
              }}
            />
          </FavoritesProvider>
        </CartProvider>
      </ProductsProvider>
    </StorefrontProvider>
  );
}
