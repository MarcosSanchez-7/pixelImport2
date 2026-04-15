"use client";

import Image from "next/image";
import Link from "next/link";
import { toast } from "react-toastify";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useScrollReveal } from "@/hooks/useScrollReveal";

export default function BestSellersSection() {
  const { products, initialized } = useProducts();
  const { addToCart } = useCart();

  const header   = useScrollReveal({ variant: "fadeUp", delay: 0 });
  const card0    = useScrollReveal({ variant: "fadeLeft",  delay: 0 });
  const card1    = useScrollReveal({ variant: "fadeRight", delay: 80 });
  const card2    = useScrollReveal({ variant: "fadeUp",    delay: 0 });
  const card3    = useScrollReveal({ variant: "fadeUp",    delay: 140 });
  const mobileGrid = useScrollReveal({ variant: "fadeUp", delay: 0 });

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
    <section className="py-8 sm:py-12 lg:py-16 px-4 sm:px-8 bg-[var(--color-surface-container-low)]">
      <div className="max-w-[1920px] mx-auto">

        {/* Header */}
        <div ref={header.ref} className={`${header.className} flex justify-between items-end mb-5 sm:mb-7`}>
          <div>
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] font-bold mb-2 block">
              SELECCIÓN DESTACADA
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase">
              Más Vendidos
            </h2>
          </div>
          <Link
            href="/products"
            className="text-[10px] font-bold uppercase tracking-widest border-b border-[var(--color-primary)] pb-1 hover:opacity-60 transition-opacity hidden sm:block"
          >
            Ver Todo
          </Link>
        </div>

        {/* Mobile: stacked list */}
        <div ref={mobileGrid.ref} className={`${mobileGrid.className} grid grid-cols-1 sm:grid-cols-2 gap-4 md:hidden`}>
          {displayProducts.map((item) => (
            <div
              key={item.id}
              className="bg-[var(--color-surface-container-lowest)] p-5 flex flex-col gap-4"
            >
              <Link href={`/products/${item.id}`} className="relative w-full aspect-square block">
                <Image
                  src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=800&auto=format&fit=crop"}
                  alt={item.title}
                  fill
                  className="object-contain p-4 drop-shadow-lg hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 100vw, 50vw"
                />
                {item.badge && (
                  <span className="absolute top-3 left-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[9px] px-2 py-0.5 font-bold tracking-widest uppercase">
                    {item.badge}
                  </span>
                )}
              </Link>
              <div className="flex flex-col gap-2">
                <Link href={`/products/${item.id}`}>
                  <h3 className="text-sm font-bold uppercase tracking-tight hover:opacity-60 transition-opacity">
                    {item.title}
                  </h3>
                </Link>
                <div className="flex justify-between items-center">
                  {item.sale_price ? (
                    <div className="flex flex-col leading-tight">
                      <span className="text-base font-semibold text-red-600">Gs. {Number(item.sale_price).toLocaleString("es-PY")}</span>
                      <span className="text-xs text-zinc-400 line-through">Gs. {Number(item.price).toLocaleString("es-PY")}</span>
                    </div>
                  ) : (
                    <p className="text-base font-light">Gs. {Number(item.price).toLocaleString("es-PY")}</p>
                  )}
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
        <div className="hidden md:grid md:grid-cols-4 md:grid-rows-2 gap-3">

          {/* Large card — 2 cols × 2 rows */}
          {displayProducts[0] && (
            <div ref={card0.ref} className={`${card0.className} md:col-span-2 md:row-span-2 bg-[var(--color-surface-container-lowest)] p-5 lg:p-7 flex flex-col justify-between group relative overflow-hidden min-h-[480px] lg:min-h-[580px]`}>
              <div className="z-10 text-center">
                <div className="flex justify-between items-start mb-1">
                  {displayProducts[0].badge && (
                    <span className="bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[9px] px-2.5 py-0.5 font-bold tracking-widest uppercase">
                      {displayProducts[0].badge}
                    </span>
                  )}
                  {displayProducts[0].sale_price ? (
                    <div className="flex flex-col items-end ml-auto leading-tight">
                      <span className="text-base lg:text-lg font-semibold text-red-500">Gs. {Number(displayProducts[0].sale_price).toLocaleString("es-PY")}</span>
                      <span className="text-xs text-zinc-400 line-through">Gs. {Number(displayProducts[0].price).toLocaleString("es-PY")}</span>
                    </div>
                  ) : (
                    <span className="text-base lg:text-lg font-light ml-auto">
                      Gs. {Number(displayProducts[0].price).toLocaleString("es-PY")}
                    </span>
                  )}
                </div>
                <h3 className="text-xl lg:text-3xl font-black uppercase mt-2 tracking-tighter hover:text-zinc-600 transition-colors text-center">
                  <Link href={`/products/${displayProducts[0].id}`}>{displayProducts[0].title}</Link>
                </h3>
              </div>
              <Link href={`/products/${displayProducts[0].id}`} className="relative w-full flex-1 my-3 min-h-[240px] lg:min-h-[340px] block group-hover:scale-105 transition-transform duration-700">
                <Image
                  src={displayProducts[0].image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"}
                  alt={displayProducts[0].title}
                  fill
                  className="object-contain drop-shadow-2xl"
                  sizes="50vw"
                />
              </Link>
              <div className="flex justify-center z-10">
                <button
                  onClick={() => handleAdd(displayProducts[0])}
                  className="bg-[var(--color-primary)] text-[var(--color-on-primary)] p-2.5 lg:p-3 hover:scale-110 active:scale-95 transition-all outline-none"
                >
                  <span className="material-symbols-outlined pointer-events-none" style={{ fontSize: "20px" }}>add_shopping_cart</span>
                </button>
              </div>
            </div>
          )}

          {/* Medium card — 2 cols × 1 row */}
          {displayProducts[1] && (
            <div ref={card1.ref} className={`${card1.className} md:col-span-2 md:row-span-1 bg-[var(--color-surface-container-lowest)] p-4 lg:p-6 flex items-center gap-4 group min-h-[240px] lg:min-h-[286px]`}>
              <div className="w-1/2 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-base lg:text-xl font-bold uppercase tracking-tight hover:text-zinc-600 transition-colors line-clamp-2 text-center">
                    <Link href={`/products/${displayProducts[1].id}`}>{displayProducts[1].title}</Link>
                  </h3>
                  <p className="text-[var(--color-on-surface-variant)] text-[11px] mt-1.5 line-clamp-2 leading-relaxed text-center">
                    {displayProducts[1].description || ""}
                  </p>
                </div>
                <div className="mt-3 text-center">
                  {displayProducts[1].sale_price ? (
                    <div className="flex flex-col leading-tight mb-2">
                      <span className="text-base lg:text-lg font-semibold text-red-500">Gs. {Number(displayProducts[1].sale_price).toLocaleString("es-PY")}</span>
                      <span className="text-xs text-zinc-400 line-through">Gs. {Number(displayProducts[1].price).toLocaleString("es-PY")}</span>
                    </div>
                  ) : (
                    <p className="text-base lg:text-lg font-light mb-2">
                      Gs. {Number(displayProducts[1].price).toLocaleString("es-PY")}
                    </p>
                  )}
                  <button
                    onClick={() => handleAdd(displayProducts[1])}
                    className="text-[9px] font-bold uppercase tracking-widest border-b-2 border-black/10 hover:border-black transition-all pb-0.5 outline-none"
                  >
                    Añadir al carrito
                  </button>
                </div>
              </div>
              <Link href={`/products/${displayProducts[1].id}`} className="w-1/2 relative h-full min-h-[160px] block">
                <Image
                  src={displayProducts[1].image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"}
                  alt={displayProducts[1].title}
                  fill
                  className="object-contain group-hover:scale-105 transition-transform duration-500 origin-right drop-shadow-xl"
                  sizes="25vw"
                />
              </Link>
            </div>
          )}

          {/* Small cards — 1 col × 1 row each */}
          {displayProducts.slice(2, 4).map((item, i) => {
            const { ref, className: cls } = i === 0 ? card2 : card3;
            return (
            <div
              key={item.id}
              ref={ref}
              className={`${cls} bg-[var(--color-surface-container-lowest)] p-4 lg:p-5 flex flex-col justify-between group min-h-[240px] lg:min-h-[286px]`}
            >
              <Link href={`/products/${item.id}`} className="relative w-full flex-1 mb-3 min-h-[120px] lg:min-h-[160px] block group-hover:-translate-y-1.5 transition-transform duration-500">
                <Image
                  src={item.image || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop"}
                  alt={item.title}
                  fill
                  className="object-contain drop-shadow-lg"
                  sizes="25vw"
                />
              </Link>
              <div className="text-center">
                <h3 className="text-[11px] lg:text-xs font-bold uppercase tracking-tight hover:text-zinc-600 transition-colors line-clamp-2 mb-2">
                  <Link href={`/products/${item.id}`}>{item.title}</Link>
                </h3>
                <div className="flex justify-center items-center gap-3">
                  {item.sale_price ? (
                    <div className="flex flex-col leading-tight">
                      <span className="text-xs font-semibold text-red-500">Gs. {Number(item.sale_price).toLocaleString("es-PY")}</span>
                      <span className="text-[10px] text-zinc-400 line-through">Gs. {Number(item.price).toLocaleString("es-PY")}</span>
                    </div>
                  ) : (
                    <p className="text-xs font-light">Gs. {Number(item.price).toLocaleString("es-PY")}</p>
                  )}
                  <button
                    onClick={() => handleAdd(item)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-black text-white hover:bg-zinc-700 active:scale-95 rounded-sm"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>add_shopping_cart</span>
                  </button>
                </div>
              </div>
            </div>
            );
          })}
        </div>

        {/* Mobile: "View All" link */}
        <div className="mt-6 text-center sm:hidden">
          <Link href="/products" className="text-[10px] font-bold uppercase tracking-widest border-b border-black pb-1">
            Ver Todo
          </Link>
        </div>
      </div>
    </section>
  );
}
