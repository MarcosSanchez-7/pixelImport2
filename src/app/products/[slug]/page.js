"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

export default function ProductDetailPage({ params }) {
  const { slug } = use(params);
  const { products, initialized } = useProducts();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!initialized) {
    return (
      <>
        <Navbar />
        <main className="pt-32 min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
              Loading
            </p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const product = products.find((p) => p.id === slug);
  if (!product) notFound();

  const fav = isFavorite(product.id);

  const handleAddToCart = () => {
    if (product.stock === 0) return;
    addToCart(product);
    toast.success(`${product.title} añadido al carrito`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      icon: "🛒",
    });
  };

  const handleToggleFavorite = () => {
    toggleFavorite(product.id);
    if (!fav) {
      toast.success(`Añadido a favoritos`, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        icon: "♥",
      });
    }
  };

  const specs = Array.isArray(product.specs) ? product.specs : [];

  return (
    <>
      <Navbar />
      <main className="pt-24">
        {/* Breadcrumb */}
        <div className="px-4 sm:px-8 py-4 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)]/20">
          <div className="max-w-[1920px] mx-auto flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[var(--color-outline)]">
            <Link href="/" className="hover:text-[var(--color-on-surface)] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[var(--color-on-surface)] transition-colors">Imports</Link>
            <span>/</span>
            <span className="text-[var(--color-on-surface)]">{product.title}</span>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-8 bg-[var(--color-surface)]">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Image */}
            <div className="relative aspect-square bg-[var(--color-surface-container-lowest)] overflow-hidden">
              {product.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain p-10"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-zinc-200" style={{ fontSize: "64px" }}>image</span>
                </div>
              )}
              {product.badge && (
                <span className="absolute top-5 left-5 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[9px] px-3 py-1 font-bold tracking-widest uppercase">
                  {product.badge}
                </span>
              )}
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-white px-4 py-2 border border-zinc-200">
                    Out of Stock
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="lg:pt-4">
              <div className="flex items-center gap-3 mb-3">
                {product.brand && (
                  <span className="text-[9px] font-black uppercase tracking-[0.3em] text-[var(--color-outline)]">
                    {product.brand}
                  </span>
                )}
                {product.category && (
                  <>
                    <span className="text-[var(--color-outline-variant)]">·</span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--color-outline)]">
                      {product.category}
                    </span>
                  </>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter uppercase mb-4 sm:mb-5 leading-tight">
                {product.title}
              </h1>

              <p className="text-2xl sm:text-3xl font-light mb-3">
                Gs. {Number(product.price).toLocaleString("es-PY")}
              </p>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex gap-2 flex-wrap mb-6">
                  {product.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[7px] font-bold tracking-widest uppercase px-2 py-1 bg-zinc-100 text-zinc-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {product.description && (
                <p className="text-[var(--color-on-surface-variant)] leading-relaxed mb-10 text-base max-w-lg">
                  {product.description}
                </p>
              )}

              {/* Specs */}
              {specs.length > 0 && (
                <div className="border-t border-[var(--color-outline-variant)]/30 pt-7 mb-10">
                  <p className="text-[10px] font-black uppercase tracking-widest mb-5 text-[var(--color-on-surface)]">
                    Technical Specifications
                  </p>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-0">
                    {specs.map(({ label, value }) => (
                      <div key={label} className="py-3 border-b border-[var(--color-outline-variant)]/20">
                        <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-outline)] mb-1">
                          {label}
                        </p>
                        <p className="text-sm font-medium uppercase">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SKU */}
              {product.sku && (
                <p className="text-[9px] font-mono text-zinc-400 tracking-widest mb-6">
                  SKU: {product.sku}
                </p>
              )}

              {/* Stock indicator */}
              {product.stock > 0 && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    In Stock
                    {product.stock <= 5 && (
                      <span className="text-orange-500 ml-1">— Only {product.stock} left</span>
                    )}
                  </span>
                </div>
              )}

              {/* CTA */}
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-5 text-xs font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-colors active:scale-[0.98] duration-150 flex items-center justify-center gap-3 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`w-full border py-5 text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-3 ${
                    fav
                      ? "bg-black text-white border-black"
                      : "border-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)]"
                  }`}
                >
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: fav ? "'FILL' 1" : "'FILL' 0" }}
                  >
                    favorite
                  </span>
                  {fav ? "Saved to Wishlist" : "Add to Wishlist"}
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
