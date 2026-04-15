"use client";

import { use, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { toast } from "react-toastify";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import RevealOnScroll from "@/components/RevealOnScroll";

/* ── Compact recommended card ── */
function RecommendedCard({ product, addToCart }) {
  const handleAdd = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(`${product.title} añadido al carrito`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      icon: "🛒",
    });
  };

  return (
    <Link
      href={`/products/${product.id}`}
      className="group bg-[var(--color-surface-container-lowest)] flex flex-col border border-[var(--color-outline-variant)]/30 hover:border-[var(--color-outline-variant)] hover:shadow-sm transition-all duration-200"
    >
      <div className="relative aspect-square overflow-hidden bg-[var(--color-surface-container-low)]">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-zinc-300" style={{ fontSize: "28px" }}>image</span>
          </div>
        )}
        {product.badge && (
          <span className="absolute top-2 left-2 bg-black text-white text-[7px] px-2 py-0.5 font-black tracking-widest uppercase">
            {product.badge}
          </span>
        )}
      </div>
      <div className="px-3 pt-2 pb-3 flex flex-col gap-1">
        {product.brand && (
          <span className="text-[7px] font-black uppercase tracking-widest text-[var(--color-outline)]">
            {product.brand}
          </span>
        )}
        <h3 className="text-[11px] font-bold uppercase tracking-tight line-clamp-2 leading-snug">
          {product.title}
        </h3>
        <div className="flex items-center justify-between mt-1 pt-1.5 border-t border-[var(--color-outline-variant)]/30">
          <span className="text-xs font-light tabular-nums">
            Gs. {Number(product.price).toLocaleString("es-PY")}
          </span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="p-1.5 bg-black text-white hover:bg-zinc-700 transition-colors active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
            title="Añadir al carrito"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>add_shopping_cart</span>
          </button>
        </div>
      </div>
    </Link>
  );
}

/* ── Main page ── */
export default function ProductDetailPage({ params }) {
  const { slug } = use(params);
  const { products, initialized } = useProducts();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  // All images: main + extras
  const [activeImg, setActiveImg] = useState(null);

  if (!initialized) {
    return (
      <>
        <Navbar />
        <main className="pt-32 min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  const product = products.find((p) => p.id === slug);
  if (!product) notFound();

  const fav = isFavorite(product.id);

  // Build gallery array: [main image, ...extra images]
  const extraImages = Array.isArray(product.images) ? product.images.filter(Boolean) : [];
  const allImages = [product.image, ...extraImages].filter(Boolean);
  const displayedImage = activeImg ?? allImages[0] ?? null;

  // Recommended: same category, excluding self, max 4
  const recommended = products
    .filter((p) => p.visible && p.id !== product.id && p.category === product.category)
    .slice(0, 4);
  const fallback = products.filter((p) => p.visible && p.id !== product.id);
  const relatedProducts = recommended.length >= 2 ? recommended : fallback.slice(0, 4);

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
      toast.success("Añadido a favoritos", {
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
      <main className="pt-20">

        {/* Breadcrumb */}
        <div className="px-4 sm:px-8 py-3 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)]/20">
          <div className="max-w-6xl mx-auto flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[var(--color-outline)]">
            <Link href="/" className="hover:text-[var(--color-on-surface)] transition-colors">Inicio</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[var(--color-on-surface)] transition-colors">Productos</Link>
            <span>/</span>
            <span className="text-[var(--color-on-surface)] truncate max-w-[200px]">{product.title}</span>
          </div>
        </div>

        {/* ── Product Detail ── */}
        <section className="py-8 sm:py-10 px-4 sm:px-8 bg-[var(--color-surface)]">
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">

            {/* Image gallery */}
            <RevealOnScroll variant="fadeLeft" className="sticky top-24">
              <div className="flex flex-col gap-3">
                {/* Main image */}
                <div className="relative aspect-square bg-[var(--color-surface-container-lowest)] overflow-hidden max-h-[420px] sm:max-h-[500px]">
                  {displayedImage ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={displayedImage}
                      src={displayedImage}
                      alt={product.title}
                      className="w-full h-full object-contain p-8 transition-opacity duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="material-symbols-outlined text-zinc-200" style={{ fontSize: "56px" }}>image</span>
                    </div>
                  )}
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[9px] px-3 py-1 font-bold tracking-widest uppercase">
                      {product.badge}
                    </span>
                  )}
                  {product.stock === 0 && (
                    <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-white px-4 py-2 border border-zinc-200">
                        Sin Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Thumbnails — only show if more than 1 image */}
                {allImages.length > 1 && (
                  <div className="flex gap-2 flex-wrap">
                    {allImages.map((img, i) => (
                      // eslint-disable-next-line @next/next/no-img-element
                      <button
                        key={i}
                        onClick={() => setActiveImg(img)}
                        className={`w-16 h-16 border-2 overflow-hidden bg-[var(--color-surface-container-lowest)] transition-all duration-200 shrink-0 ${
                          displayedImage === img
                            ? "border-black"
                            : "border-transparent hover:border-zinc-300"
                        }`}
                      >
                        <img
                          src={img}
                          alt={`Vista ${i + 1}`}
                          className="w-full h-full object-contain p-1"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </RevealOnScroll>

            {/* Info */}
            <RevealOnScroll variant="fadeRight" className="flex flex-col gap-4">

              {/* Brand + Category */}
              <div className="flex items-center gap-2">
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

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tighter uppercase leading-tight">
                {product.title}
              </h1>

              {/* Price */}
              {product.sale_price ? (
                <div className="flex items-baseline gap-3 flex-wrap">
                  <p className="text-xl sm:text-2xl font-semibold text-red-600">
                    Gs. {Number(product.sale_price).toLocaleString("es-PY")}
                  </p>
                  <p className="text-base font-light text-zinc-400 line-through">
                    Gs. {Number(product.price).toLocaleString("es-PY")}
                  </p>
                  <span className="text-[10px] font-black uppercase tracking-widest text-white bg-red-500 px-2 py-0.5">
                    -{Math.round((1 - product.sale_price / product.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <p className="text-xl sm:text-2xl font-light">
                  Gs. {Number(product.price).toLocaleString("es-PY")}
                </p>
              )}

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex gap-1.5 flex-wrap">
                  {product.tags.map((tag) => (
                    <span key={tag} className="text-[7px] font-bold tracking-widest uppercase px-2 py-0.5 bg-zinc-100 text-zinc-500">
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              {product.description && (
                <p className="text-[var(--color-on-surface-variant)] leading-relaxed text-sm max-w-md">
                  {product.description}
                </p>
              )}

              {/* Specs */}
              {specs.length > 0 && (
                <div className="border-t border-[var(--color-outline-variant)]/30 pt-4">
                  <p className="text-[9px] font-black uppercase tracking-widest mb-3 text-[var(--color-on-surface)]">
                    Especificaciones
                  </p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-0">
                    {specs.map(({ label, value }) => (
                      <div key={label} className="py-2 border-b border-[var(--color-outline-variant)]/20">
                        <p className="text-[8px] font-bold uppercase tracking-widest text-[var(--color-outline)] mb-0.5">{label}</p>
                        <p className="text-xs font-medium uppercase">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SKU + Stock */}
              <div className="flex items-center gap-4">
                {product.sku && (
                  <p className="text-[9px] font-mono text-zinc-400 tracking-widest">SKU: {product.sku}</p>
                )}
                {product.stock > 0 && (
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                      En Stock
                      {product.stock <= 5 && (
                        <span className="text-orange-500 ml-1">— últimas {product.stock} unidades</span>
                      )}
                    </span>
                  </div>
                )}
              </div>

              {/* CTAs */}
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-4 text-xs font-black uppercase tracking-[0.3em] hover:bg-zinc-800 transition-colors active:scale-[0.98] duration-150 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined text-sm">add_shopping_cart</span>
                  {product.stock === 0 ? "Sin Stock" : "Agregar al Carrito"}
                </button>
                <button
                  onClick={handleToggleFavorite}
                  className={`w-full border py-4 text-xs font-black uppercase tracking-[0.3em] transition-all duration-300 flex items-center justify-center gap-2 ${
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
                  {fav ? "Guardado en favoritos" : "Agregar a favoritos"}
                </button>
              </div>

            </RevealOnScroll>
          </div>
        </section>

        {/* ── Productos relacionados ── */}
        {relatedProducts.length > 0 && (
          <section className="py-8 sm:py-12 px-4 sm:px-8 bg-[var(--color-surface-container-low)] border-t border-[var(--color-outline-variant)]/20">
            <div className="max-w-6xl mx-auto">
              <RevealOnScroll className="flex items-end justify-between mb-5">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--color-outline)] mb-1 block">
                    {product.category}
                  </span>
                  <h2 className="text-lg sm:text-xl font-black tracking-tighter uppercase">
                    También te puede interesar
                  </h2>
                </div>
                <Link
                  href="/products"
                  className="text-[9px] font-bold uppercase tracking-widest border-b border-[var(--color-primary)] pb-0.5 hover:opacity-60 transition-opacity hidden sm:block"
                >
                  Ver Todo
                </Link>
              </RevealOnScroll>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {relatedProducts.map((p, i) => (
                  <RevealOnScroll key={p.id} variant="scale" delay={i * 80}>
                    <RecommendedCard product={p} addToCart={addToCart} />
                  </RevealOnScroll>
                ))}
              </div>
            </div>
          </section>
        )}

      </main>
      <Footer />
    </>
  );
}
