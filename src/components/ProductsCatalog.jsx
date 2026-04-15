"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";
import { useCategories } from "@/context/CategoriesContext";

const SORT_OPTIONS = [
  { value: "default", label: "Por defecto" },
  { value: "price-asc", label: "Precio: menor a mayor" },
  { value: "price-desc", label: "Precio: mayor a menor" },
  { value: "name-asc", label: "Nombre A→Z" },
];

/** BFS — returns Set of all IDs in the subtree rooted at rootId */
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
      {/* Image */}
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

      {/* Info */}
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
          {/* Action buttons */}
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
              title="Añadir al carrito"
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

export default function ProductsCatalog() {
  const searchParams = useSearchParams();
  const { products } = useProducts();
  const { flatList } = useCategories();

  const [searchQ, setSearchQ] = useState(searchParams.get("q") || "");
  // selectedCategories holds top-level category IDs (UUIDs)
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState("default");
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Sync URL query param with local search
  useEffect(() => {
    const q = searchParams.get("q") || "";
    setSearchQ(q);
  }, [searchParams]);

  // Visible products only
  const visibleProducts = useMemo(
    () => products.filter((p) => p.visible),
    [products]
  );

  // Top-level categories from the categories tree
  const topLevelCategories = useMemo(
    () => flatList.filter((c) => c.depth === 0),
    [flatList]
  );

  // Precompute descendant ID sets for each top-level category
  const descendantMap = useMemo(() => {
    const map = new Map();
    for (const cat of topLevelCategories) {
      map.set(cat.id, getDescendantIds(flatList, cat.id));
    }
    return map;
  }, [topLevelCategories, flatList]);

  // Expanded descendant IDs for currently selected categories
  const selectedDescendantIds = useMemo(() => {
    if (!selectedCategories.length) return null;
    const ids = new Set();
    for (const catId of selectedCategories) {
      const desc = descendantMap.get(catId);
      if (desc) desc.forEach((id) => ids.add(id));
    }
    return ids;
  }, [selectedCategories, descendantMap]);

  const allBrands = useMemo(
    () => [...new Set(visibleProducts.map((p) => p.brand).filter(Boolean))].sort(),
    [visibleProducts]
  );
  const priceRange = useMemo(() => {
    if (!visibleProducts.length) return { min: 0, max: 10000 };
    const prices = visibleProducts.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [visibleProducts]);

  const toggleCategory = (id) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  const toggleBrand = (b) =>
    setSelectedBrands((prev) =>
      prev.includes(b) ? prev.filter((x) => x !== b) : [...prev, b]
    );

  const clearFilters = () => {
    setSearchQ("");
    setSelectedCategories([]);
    setSelectedBrands([]);
    setPriceMin("");
    setPriceMax("");
    setSort("default");
  };

  const filtered = useMemo(() => {
    let result = [...visibleProducts];

    if (searchQ.trim()) {
      const q = searchQ.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          (p.brand || "").toLowerCase().includes(q) ||
          (p.category || "").toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }
    if (selectedDescendantIds) {
      result = result.filter((p) => p.category_id && selectedDescendantIds.has(p.category_id));
    }
    if (selectedBrands.length) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }
    if (priceMin !== "") result = result.filter((p) => p.price >= Number(priceMin));
    if (priceMax !== "") result = result.filter((p) => p.price <= Number(priceMax));

    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name-asc": result.sort((a, b) => a.title.localeCompare(b.title)); break;
    }
    return result;
  }, [visibleProducts, searchQ, selectedDescendantIds, selectedBrands, priceMin, priceMax, sort]);

  const activeFiltersCount =
    (searchQ ? 1 : 0) +
    selectedCategories.length +
    selectedBrands.length +
    (priceMin || priceMax ? 1 : 0);

  return (
    <>
      {/* Page Header */}
      <div className="px-4 sm:px-8 py-8 sm:py-12 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)]/20">
        <div className="max-w-[1920px] mx-auto">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] font-bold mb-2 block">
            CATÁLOGO // 2024
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tighter uppercase">Todos los Productos</h1>
        </div>
      </div>

      <div className="max-w-[1920px] mx-auto flex">
        {/* ── Filter Sidebar ── */}
        <aside
          className={`shrink-0 w-64 border-r border-zinc-100 min-h-[calc(100vh-8rem)] sticky top-20 self-start overflow-y-auto transition-all ${
            filtersOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="p-6 space-y-8">
            {/* Search */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">
                Buscar
              </p>
              <div className="relative">
                <span
                  className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                  style={{ fontSize: "15px" }}
                >
                  search
                </span>
                <input
                  type="text"
                  value={searchQ}
                  onChange={(e) => setSearchQ(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full border border-zinc-200 text-xs pl-8 pr-3 py-2.5 outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">
                Ordenar por
              </p>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="w-full border border-zinc-200 text-xs px-3 py-2.5 outline-none focus:border-black appearance-none bg-white"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Top-level Categories */}
            {topLevelCategories.length > 0 && (
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">
                  Categoría
                </p>
                <div className="space-y-2">
                  {topLevelCategories.map((cat) => {
                    const count = visibleProducts.filter(
                      (p) => p.category_id && descendantMap.get(cat.id)?.has(p.category_id)
                    ).length;
                    return (
                      <label key={cat.id} className="flex items-center gap-3 cursor-pointer group">
                        <div
                          onClick={() => toggleCategory(cat.id)}
                          className={`w-4 h-4 border-2 flex items-center justify-center transition-all shrink-0 ${
                            selectedCategories.includes(cat.id)
                              ? "bg-black border-black"
                              : "border-zinc-300 group-hover:border-black"
                          }`}
                        >
                          {selectedCategories.includes(cat.id) && (
                            <span
                              className="material-symbols-outlined text-white"
                              style={{ fontSize: "11px", fontVariationSettings: "'wght' 700" }}
                            >
                              check
                            </span>
                          )}
                        </div>
                        <span
                          onClick={() => toggleCategory(cat.id)}
                          className="text-xs font-semibold uppercase tracking-wide text-zinc-600 group-hover:text-black transition-colors"
                        >
                          {cat.name}
                        </span>
                        <span className="ml-auto text-[9px] text-zinc-400">{count}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Brand */}
            {allBrands.length > 0 && (
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">
                  Marca
                </p>
                <div className="space-y-2">
                  {allBrands.map((brand) => (
                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                      <div
                        onClick={() => toggleBrand(brand)}
                        className={`w-4 h-4 border-2 flex items-center justify-center transition-all shrink-0 ${
                          selectedBrands.includes(brand)
                            ? "bg-black border-black"
                            : "border-zinc-300 group-hover:border-black"
                        }`}
                      >
                        {selectedBrands.includes(brand) && (
                          <span
                            className="material-symbols-outlined text-white"
                            style={{ fontSize: "11px", fontVariationSettings: "'wght' 700" }}
                          >
                            check
                          </span>
                        )}
                      </div>
                      <span
                        onClick={() => toggleBrand(brand)}
                        className="text-xs font-semibold uppercase tracking-wide text-zinc-600 group-hover:text-black transition-colors"
                      >
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">
                Rango de Precio
              </p>
              <div className="text-[9px] text-zinc-400 mb-2 uppercase tracking-widest">
                Gs. {priceRange.min.toLocaleString("es-PY")} — Gs. {priceRange.max.toLocaleString("es-PY")}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">Gs.</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Min"
                    value={priceMin}
                    onChange={(e) => setPriceMin(e.target.value)}
                    className="w-full border border-zinc-200 text-xs pl-8 pr-2 py-2.5 outline-none focus:border-black transition-colors"
                  />
                </div>
                <div className="relative">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">Gs.</span>
                  <input
                    type="number"
                    min="0"
                    placeholder="Max"
                    value={priceMax}
                    onChange={(e) => setPriceMax(e.target.value)}
                    className="w-full border border-zinc-200 text-xs pl-8 pr-2 py-2.5 outline-none focus:border-black transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* Clear */}
            {activeFiltersCount > 0 && (
              <button
                onClick={clearFilters}
                className="w-full text-[9px] font-black uppercase tracking-widest py-2.5 border border-black text-black hover:bg-black hover:text-white transition-all"
              >
                Limpiar Filtros ({activeFiltersCount})
              </button>
            )}
          </div>
        </aside>

        {/* ── Product Grid ── */}
        <div className="flex-1 px-4 sm:px-6 py-6">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="lg:hidden flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-zinc-200 px-3 py-2 hover:bg-zinc-50"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                  tune
                </span>
                Filtros
                {activeFiltersCount > 0 && (
                  <span className="bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center font-black rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                {filtered.length} producto{filtered.length !== 1 ? "s" : ""}
                {activeFiltersCount > 0 && " (filtrado)"}
              </span>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <span
                className="material-symbols-outlined text-zinc-200"
                style={{ fontSize: "56px" }}
              >
                search_off
              </span>
              <p className="text-zinc-400 font-semibold uppercase tracking-widest text-sm">
                Ningún producto coincide con los filtros
              </p>
              <button
                onClick={clearFilters}
                className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-4 hover:no-underline"
              >
                Limpiar Filtros
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
