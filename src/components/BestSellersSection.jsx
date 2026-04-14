"use client";

import Image from "next/image";
import Link from "next/link";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";

export default function BestSellersSection() {
  const { products, initialized } = useProducts();
  const { toggleCart } = useCart();

  if (!initialized) return null; // Don't render until loaded

  // Get best sellers, or fallback to the first 4 if none are tagged
  const bestSellers = products.filter(
    (p) => p.visible && Array.isArray(p.tags) && p.tags.includes("BEST SELLER")
  );
  
  const displayProducts = bestSellers.length >= 4 
    ? bestSellers.slice(0, 4) 
    : products.filter(p => p.visible).slice(0, 4);

  // If we don't have enough products in the DB, pad with empty elements
  if (displayProducts.length === 0) return null;

  return (
    <section className="py-32 px-8 bg-[var(--color-surface-container-low)] min-h-[800px]">
      <div className="max-w-[1920px] mx-auto">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] font-bold mb-2 block">
              CURATED SELECTION
            </span>
            <h2 className="text-4xl font-black tracking-tighter uppercase">
              Best Sellers
            </h2>
          </div>
          <Link
            href="/products"
            className="text-[10px] font-bold uppercase tracking-widest border-b border-[var(--color-primary)] pb-1 hover:opacity-60 transition-opacity"
          >
            View All Imports
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-4 h-auto md:h-auto min-h-[800px]">
          {/* Large card */}
          {displayProducts[0] && (
            <div className="md:col-span-2 md:row-span-2 bg-[var(--color-surface-container-lowest)] p-12 flex flex-col justify-between group relative overflow-hidden h-[800px]">
              <div className="z-10">
                <div className="flex justify-between items-start">
                  {displayProducts[0].badge && (
                    <span className="bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[10px] px-3 py-1 font-bold tracking-widest uppercase">
                      {displayProducts[0].badge}
                    </span>
                  )}
                  <span className="text-2xl font-light">
                    Gs. {Number(displayProducts[0].price).toLocaleString("es-PY")}
                  </span>
                </div>
                <h3 className="text-4xl font-black uppercase mt-4 tracking-tighter hover:text-zinc-600 transition-colors">
                  <Link href={`/products/${displayProducts[0].id}`}>{displayProducts[0].title}</Link>
                </h3>
              </div>
              <div className="relative w-full h-[500px] my-4 group-hover:scale-105 transition-transform duration-700">
                <Image
                  src={displayProducts[0].image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"}
                  alt={displayProducts[0].title}
                  fill
                  className="object-cover md:object-contain drop-shadow-2xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              <div className="flex justify-between items-center z-10">
                <div className="flex gap-2">
                  {(displayProducts[0].tags || []).filter(t => t !== "BEST SELLER").slice(0,2).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-[var(--color-surface-container-highest)] text-[8px] font-bold tracking-widest uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => toggleCart()}
                  className="bg-[var(--color-primary)] text-[var(--color-on-primary)] p-4 hover:scale-110 active:scale-95 transition-all outline-none"
                >
                  <span className="material-symbols-outlined pointer-events-none">shopping_cart</span>
                </button>
              </div>
            </div>
          )}

          {/* Medium card */}
          {displayProducts[1] && (
            <div className="md:col-span-2 md:row-span-1 bg-[var(--color-surface-container-lowest)] p-8 flex items-center gap-8 group h-[392px]">
              <div className="w-1/2 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-2xl font-bold uppercase tracking-tight hover:text-zinc-600 transition-colors">
                    <Link href={`/products/${displayProducts[1].id}`}>{displayProducts[1].title}</Link>
                  </h3>
                  <p className="text-[var(--color-on-surface-variant)] text-xs mt-3 line-clamp-2 leading-relaxed">
                    {displayProducts[1].description || ""}
                  </p>
                </div>
                <div className="mt-4">
                  <p className="text-xl font-light mb-4">
                    Gs. {Number(displayProducts[1].price).toLocaleString("es-PY")}
                  </p>
                  <button
                    onClick={() => toggleCart()}
                    className="text-[10px] font-bold uppercase tracking-widest border-b-2 border-black/10 hover:border-black transition-all pb-1 outline-none"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
              <div className="w-1/2 relative h-full">
                <Image
                  src={displayProducts[1].image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"}
                  alt={displayProducts[1].title}
                  fill
                  className="object-cover md:object-contain group-hover:scale-105 transition-transform duration-500 origin-right drop-shadow-xl"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </div>
          )}

          {/* Small cards */}
          {displayProducts.slice(2, 4).map((item) => (
            <div
              key={item.id}
              className="bg-[var(--color-surface-container-lowest)] p-8 flex flex-col justify-between group h-[392px]"
            >
              <div className="relative w-full h-[60%] mb-4 group-hover:-translate-y-2 transition-transform duration-500">
                <Image
                  src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"}
                  alt={item.title}
                  fill
                  className="object-cover md:object-contain drop-shadow-lg"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div>
                <h3 className="text-base font-bold uppercase tracking-tight hover:text-zinc-600 transition-colors">
                   <Link href={`/products/${item.id}`}>{item.title}</Link>
                </h3>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-sm font-light">Gs. {Number(item.price).toLocaleString("es-PY")}</p>
                  <button onClick={() => toggleCart()} className="opacity-0 group-hover:opacity-100 transition-opacity">
                     <span className="material-symbols-outlined text-[16px]">shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
