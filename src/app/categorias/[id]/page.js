"use client";

import { use, useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useProducts } from "@/context/ProductsContext";
import { useCategories } from "@/context/CategoriesContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { toast } from "react-toastify";

const SORT_OPTIONS = [
  { value: "default", label: "Por defecto" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre A→Z" },
];

/** BFS — returns a Set of all IDs in the subtree rooted at rootId */
function getDescendantIds(flatList, rootId) {
  const result = new Set([rootId]);
  const queue = [rootId];
  while (queue.length) {
    const current = queue.shift();
    for (const cat of flatList) {
      if (cat.parent_id === current && !result.has(cat.id)) {
        result.add(cat.id);
        queue.push(cat.id);
      }
    }
  }
  return result;
}

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(product.id);

  const handleAdd = () => {
    addToCart(product);
    toast.success(`${product.title} añadido al carrito`, {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: true,
      icon: "🛒",
    });
  };

  return (
    <div className="group bg-white flex flex-col border border-zinc-100 hover:border-zinc-300 hover:shadow-sm transition-all duration-200">
      {(() => {
        const secondImage = Array.isArray(product.images) && product.images[0];
        return (
          <div className="relative aspect-square overflow-hidden bg-zinc-50">
            <Link href={`/products/${product.id}`} className="block w-full h-full">
              {product.image ? (
                <>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={product.image}
                    alt={product.title}
                    className={`absolute inset-0 w-full h-full object-contain p-3 transition-opacity duration-500 cursor-pointer ${secondImage ? "group-hover:opacity-0" : "group-hover:scale-105 transition-transform"}`}
                  />
                  {secondImage && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={secondImage}
                      alt={product.title}
                      className="absolute inset-0 w-full h-full object-contain p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 cursor-pointer"
                    />
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="material-symbols-outlined text-zinc-200" style={{ fontSize: "32px" }}>image</span>
                </div>
              )}
            </Link>
            {product.badge && (
              <span className="absolute top-2 left-2 bg-black text-white text-[7px] px-2 py-0.5 font-black tracking-widest uppercase">
                {product.badge}
              </span>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400 bg-white px-2 py-0.5 border border-zinc-200">
                  Sin Stock
                </span>
              </div>
            )}
          </div>
        );
      })()}
      <div className="px-3 pt-2.5 pb-3 flex flex-col gap-1 flex-1">
        {product.brand && (
          <span className="text-[7px] font-black uppercase tracking-widest text-zinc-400 leading-none">
            {product.brand}
          </span>
        )}
        <Link href={`/products/${product.id}`}>
          <h3 className="text-[11px] font-bold uppercase tracking-tight line-clamp-2 hover:opacity-60 transition-opacity leading-snug">
            {product.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-100">
          <div className="flex flex-col leading-tight">
            {product.sale_price ? (
              <>
                <span className="text-xs font-semibold tabular-nums text-red-600">
                  Gs. {Number(product.sale_price).toLocaleString("es-PY")}
                </span>
                <span className="text-[10px] text-zinc-400 line-through tabular-nums">
                  Gs. {Number(product.price).toLocaleString("es-PY")}
                </span>
              </>
            ) : (
              <span className="text-xs font-light tabular-nums">
                Gs. {Number(product.price).toLocaleString("es-PY")}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleFavorite(product.id)}
              className={`p-1.5 transition-colors active:scale-95 duration-100 ${
                fav
                  ? "bg-black text-white"
                  : "bg-zinc-100 text-zinc-400 hover:bg-zinc-200 hover:text-black"
              }`}
              title={fav ? "Quitar de favoritos" : "Agregar a favoritos"}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "13px", fontVariationSettings: fav ? "'FILL' 1" : "'FILL' 0" }}
              >
                favorite
              </span>
            </button>
            <button
              onClick={handleAdd}
              disabled={product.stock === 0}
              className="p-1.5 bg-black text-white hover:bg-zinc-700 transition-colors active:scale-95 duration-100 disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Añadir al carrito"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
                add_shopping_cart
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CategoryPage({ params }) {
  const { id } = use(params);
  const { products, initialized: prodInit } = useProducts();
  const { flatList, initialized: catInit } = useCategories();
  const [sort, setSort] = useState("default");
  const [searchQ, setSearchQ] = useState("");

  const category = useMemo(
    () => flatList.find((c) => c.id === id),
    [flatList, id]
  );

  const descendantIds = useMemo(
    () => (catInit && id ? getDescendantIds(flatList, id) : new Set()),
    [flatList, id, catInit]
  );

  const categoryProducts = useMemo(() => {
    if (!prodInit) return [];
    return products.filter(
      (p) => p.visible && p.category_id && descendantIds.has(p.category_id)
    );
  }, [products, descendantIds, prodInit, category]);

  const filtered = useMemo(() => {
    let result = [...categoryProducts];
    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }
    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name-asc": result.sort((a, b) => a.title.localeCompare(b.title)); break;
    }
    return result;
  }, [categoryProducts, searchQ, sort]);

  const isLoading = !prodInit || !catInit;

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Page header */}
        <div className="mt-16 px-4 sm:px-8 py-8 sm:py-12 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)]/20">
          <div className="max-w-[1920px] mx-auto">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[var(--color-outline)] hover:text-black transition-colors mb-4"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>arrow_back</span>
              Inicio
            </Link>
            {isLoading ? (
              <div className="h-10 w-48 bg-zinc-200 animate-pulse rounded" />
            ) : (
              <>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] font-bold mb-2 block">
                  COLECCIÓN
                </span>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase">
                  {category?.name ?? "Categoría"}
                </h1>
                <p className="text-[11px] text-[var(--color-outline)] mt-1 uppercase tracking-widest font-medium">
                  {categoryProducts.length} producto{categoryProducts.length !== 1 ? "s" : ""}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Toolbar */}
        <div className="px-4 sm:px-8 py-4 border-b border-zinc-100 bg-white sticky top-16 z-30">
          <div className="max-w-[1920px] mx-auto flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 min-w-[180px] max-w-xs">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" style={{ fontSize: "15px" }}>
                search
              </span>
              <input
                type="text"
                value={searchQ}
                onChange={(e) => setSearchQ(e.target.value)}
                placeholder="Buscar en esta categoría..."
                className="w-full border border-zinc-200 text-xs pl-8 pr-3 py-2.5 outline-none focus:border-black transition-colors"
              />
            </div>
            {/* Sort */}
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-zinc-200 text-xs px-3 py-2.5 outline-none focus:border-black appearance-none bg-white"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold ml-auto">
              {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Product grid */}
        <div className="px-4 sm:px-8 py-8 max-w-[1920px] mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-square bg-zinc-100 animate-pulse" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <span className="material-symbols-outlined text-zinc-200" style={{ fontSize: "56px" }}>
                search_off
              </span>
              <p className="text-zinc-400 font-semibold uppercase tracking-widest text-sm">
                {categoryProducts.length === 0
                  ? "No hay productos en esta categoría"
                  : "Ningún producto coincide con la búsqueda"}
              </p>
              {searchQ && (
                <button
                  onClick={() => setSearchQ("")}
                  className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-4 hover:no-underline"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
