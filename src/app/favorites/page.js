"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useFavorites } from "@/context/FavoritesContext";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";

function FavoriteCard({ product }) {
  const { toggleFavorite } = useFavorites();
  const { addToCart } = useCart();

  return (
    <div className="group bg-white border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all duration-300 flex flex-col">
      <div className="relative aspect-square bg-zinc-50 overflow-hidden">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-zinc-200" style={{ fontSize: "48px" }}>
              image
            </span>
          </div>
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-black text-white text-[8px] px-2.5 py-1 font-black tracking-widest uppercase">
            {product.badge}
          </span>
        )}
        <button
          onClick={() => toggleFavorite(product.id)}
          className="absolute top-3 right-3 p-1.5 rounded-full bg-black text-white hover:bg-zinc-700 transition-colors"
          title="Remove from favorites"
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: "16px", fontVariationSettings: "'FILL' 1" }}
          >
            favorite
          </span>
        </button>
      </div>

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          {product.brand && (
            <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">
              {product.brand}
            </p>
          )}
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-bold uppercase tracking-tight hover:opacity-60 transition-opacity">
              {product.title}
            </h3>
          </Link>
        </div>
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-zinc-100">
          <span className="text-base font-light">Gs. {Number(product.price).toLocaleString("es-PY")}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => addToCart(product)}
              disabled={product.stock === 0}
              className="flex items-center gap-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-2 hover:bg-zinc-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
                add_shopping_cart
              </span>
              {product.stock === 0 ? "Out" : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const { products } = useProducts();

  const favoriteProducts = products.filter((p) => favorites.includes(p.id) && p.visible);

  return (
    <>
      <Navbar />
      <main className="pt-32 min-h-screen bg-[var(--color-surface)]">
        <div className="max-w-[1920px] mx-auto px-8 pb-24">
          <div className="mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] font-bold mb-2 block">
              SAVED
            </span>
            <h1 className="text-4xl font-black tracking-tighter uppercase">
              Favorites
              {favoriteProducts.length > 0 && (
                <span className="text-zinc-300 ml-4 font-light text-2xl">
                  ({favoriteProducts.length})
                </span>
              )}
            </h1>
          </div>

          {favoriteProducts.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-24">
              <span
                className="material-symbols-outlined text-zinc-200"
                style={{ fontSize: "72px" }}
              >
                favorite
              </span>
              <p className="text-zinc-400 font-semibold uppercase tracking-widest text-sm">
                No favorites saved yet
              </p>
              <p className="text-zinc-400 text-sm text-center max-w-xs">
                Click the heart icon on any product to save it here.
              </p>
              <Link
                href="/products"
                className="bg-black text-white px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
              >
                Browse Imports
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {favoriteProducts.map((p) => (
                <FavoriteCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
