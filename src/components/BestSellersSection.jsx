"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";

export default function BestSellersSection() {
  const { products, initialized } = useProducts();
  const { addToCart } = useCart();

  const handleAdd = (product) => {
    addToCart(product);
    toast.success(`${product.title} añadido al carrito`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      icon: "🛒",
    });
  };

  if (!initialized) return null;

  const bestSellers = products.filter(
    (p) => p.visible && Array.isArray(p.tags) && p.tags.includes("BEST SELLER")
  );
  const displayProducts = bestSellers.length >= 4
    ? bestSellers.slice(0, 4)
    : products.filter((p) => p.visible).slice(0, 4);

  if (displayProducts.length === 0) return null;

  return (
    <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-8 bg-[var(--color-surface-container-low)]">
      <div className="max-w-[1920px] mx-auto">

        {/* Header */}
        <div className="flex justify-between items-end mb-8 sm:mb-12">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] font-bold mb-2 block">
              CURATED SELECTION
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/products"
            className="text-[10px] font-bold uppercase tracking-widest border-b border-[var(--color-primary)] pb-1 hover:opacity-60 transition-opacity hidden sm:block"
          >
            View All Imports
          </Link>
        </div>

        {/* Mobile: stacked list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden">
          {displayProducts.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--color-surface-container-lowest)] p-5 flex flex-col gap-4"
            >
              <div className="relative w-full aspect-square">
                <Image
                  src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"}
                  alt={item.title}
                  fill
                  className="object-contain p-4 drop-shadow-lg"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {item.badge && (
                  <span className="absolute top-3 left-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[9px] px-2 py-0.5 font-bold tracking-widest uppercase">
                    {item.badge}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Link href={`/products/${item.id}`}>
                  <h3 className="text-sm font-bold uppercase tracking-tight hover:opacity-60 transition-opacity">
                    {item.title}
                  </h3>
                </Link>
                <div className="flex justify-between items-center">
                  <p className="text-base font-light">Gs. {Number(item.price).toLocaleString("es-PY")}</p>
                  <button
                    onClick={() => handleAdd(item)}
                    className="bg-black text-white p-2.5 hover:bg-zinc-700 active:scale-95 transition-all rounded-sm"
                  >
                    <span className="material-symbols-outlined pointer-events-none" style={{ fontSize: "18px" }}>add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: bento grid */}
        <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-4">

          {/* Large card — 2 cols × 2 rows */}
          {displayProducts[0] && (
            <div className="md:col-span-2 md:row-span-2 bg-[var(--color-surface-container-lowest)] p-8 lg:p-12 flex flex-col justify-between group relative overflow-hidden min-h-[640px] lg:min-h-[800px]">
              <div className="z-10">
                <div className="flex justify-between items-start">
                  {displayProducts[0].badge && (
                    <span className="bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[10px] px-3 py-1 font-bold tracking-widest uppercase">
                      {displayProducts[0].badge}
                    </span>
                  )}
                  <span className="text-xl lg:text-2xl font-light ml-auto">
                    Gs. {Number(displayProducts[0].price).toLocaleString("es-PY")}
                  </span>
                </div>
                <h3 className="text-2xl lg:text-4xl font-black uppercase mt-4 tracking-tighter hover:text-zinc-600 transition-colors">
                  <Link href={`/products/${displayProducts[0].id}`}>{displayProducts[0].title}</Link>
                </h3>
              </div>
              <div className="relative w-full flex-1 my-4 min-h-[300px] lg:min-h-[460px] group-hover:scale-105 transition-transform duration-700">
                <Image
                  src={displayProducts[0].image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"}
                  alt={displayProducts[0].title}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="50vw"
                />
              </div>
              <div className="flex justify-between items-center z-10">
                <div className="flex gap-2 flex-wrap">
                  {(displayProducts[0].tags || []).filter((t) => t !== "BEST SELLER").slice(0, 2).map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-[var(--color-surface-container-highest)] text-[8px] font-bold tracking-widest uppercase">
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => handleAdd(displayProducts[0])}
                  className="bg-[var(--color-primary)] text-[var(--color-on-primary)] p-3 lg:p-4 hover:scale-110 active:scale-95 transition-all outline-none"
                >
                  <span className="material-symbols-outlined pointer-events-none">add_shopping_cart</span>
                </button>
              </div>
            </div>
          )}

          {/* Medium card — 2 cols × 1 row */}
          {displayProducts[1] && (
            <div className="md:col-span-2 md:row-span-1 bg-[var(--color-surface-container-lowest)] p-6 lg:p-8 flex items-center gap-6 group min-h-[300px] lg:min-h-[392px]">
              <div className="w-1/2 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-lg lg:text-2xl font-bold uppercase tracking-tight hover:text-zinc-600 transition-colors line-clamp-2">
                    <Link href={`/products/${displayProducts[1].id}`}>{displayProducts[1].title}</Link>
                  </h3>
                  <p className="text-[var(--color-on-surface-variant)] text-xs mt-2 line-clamp-2 leading-relaxed">
                    {displayProducts[1].description || ""}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-lg lg:text-xl font-light mb-3">
                    Gs. {Number(displayProducts[1].price).toLocaleString("es-PY")}
                  </p>
                  <button
                    onClick={() => handleAdd(displayProducts[1])}
                    className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-black/10 hover:border-black transition-all pb-1 outline-none"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="w-1/2 relative h-full min-h-[200px]">
                <Image
                  src={displayProducts[1].image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"}
                  alt={displayProducts[1].title}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500 origin-right drop-shadow-xl"
                  sizes="25vw"
                />
              </div>
            </div>
          )}

          {/* Small cards — 1 col × 1 row each */}
          {displayProducts.slice(2, 4).map((item) => (
            <div
              key={item.id}
              className="bg-[var(--color-surface-container-lowest)] p-6 lg:p-8 flex flex-col justify-between group min-h-[300px] lg:min-h-[392px]"
            >
              <div className="relative w-full flex-1 mb-4 min-h-[140px] lg:min-h-[200px] group-hover:-translate-y-2 transition-transform duration-500">
                <Image
                  src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"}
                  alt={item.title}
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="25vw"
                />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-tight hover:text-zinc-600 transition-colors line-clamp-2">
                  <Link href={`/products/${item.id}`}>{item.title}</Link>
                </h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm font-light">Gs. {Number(item.price).toLocaleString("es-PY")}</p>
                  <button
                    onClick={() => handleAdd(item)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-black text-white hover:bg-zinc-700 active:scale-95 transition-all rounded-sm"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: "View All" link */}
        <div className="mt-6 text-center sm:hidden">
          <Link href="/products" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1">
            View All Imports
          </Link>
        </div>
      </div>
    </section>
  );
}
