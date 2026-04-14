"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { toast } from "react-toastify";
import { useProducts } from "@/context/ProductsContext";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "price-asc", label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc", label: "Name A→Z" },
];

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
    <div className="group bg-white flex flex-col border border-zinc-100 hover:border-zinc-300 hover:shadow-md transition-all duration-300">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-zinc-50">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="material-symbols-outlined text-zinc-200" style={{ fontSize: "48px" }}>image</span>
          </div>
        )}
        {product.badge && (
          <span className="absolute top-3 left-3 bg-black text-white text-[8px] px-2.5 py-1 font-black tracking-widest uppercase">
            {product.badge}
          </span>
        )}
        {/* Favorite */}
        <button
          onClick={() => toggleFavorite(product.id)}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition-all duration-200 ${
            fav
              ? "bg-black text-white"
              : "bg-white/80 text-zinc-400 hover:text-black opacity-0 group-hover:opacity-100"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={{
              fontSize: "16px",
              fontVariationSettings: fav ? "'FILL' 1" : "'FILL' 0",
            }}
          >
            favorite
          </span>
        </button>
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 bg-white px-3 py-1 border border-zinc-200">
              Out of Stock
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {product.brand && (
              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-400">
                {product.brand}
              </span>
            )}
          </div>
          <Link href={`/products/${product.id}`}>
            <h3 className="text-sm font-bold uppercase tracking-tight hover:opacity-60 transition-opacity">
              {product.title}
            </h3>
          </Link>
          <div className="flex gap-1.5 mt-2 flex-wrap">
            {(product.tags || []).map((tag) => (
              <span
                key={tag}
                className="text-[7px] font-bold tracking-widest uppercase px-2 py-0.5 bg-zinc-100 text-zinc-500"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-zinc-100">
          <span className="text-base font-light">Gs. {Number(product.price).toLocaleString("es-PY")}</span>
          <button
            onClick={handleAdd}
            disabled={product.stock === 0}
            className="flex items-center gap-1.5 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-2 hover:bg-zinc-700 transition-colors active:scale-95 duration-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
              add_shopping_cart
            </span>
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsCatalog() {
  const searchParams = useSearchParams();
  const { products } = useProducts();

  const [searchQ, setSearchQ] = useState(searchParams.get("q") || "");
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

  // Dynamic filter options from products
  const allCategories = useMemo(
    () => [...new Set(visibleProducts.map((p) => p.category))].sort(),
    [visibleProducts]
  );
  const allBrands = useMemo(
    () => [...new Set(visibleProducts.map((p) => p.brand).filter(Boolean))].sort(),
    [visibleProducts]
  );
  const priceRange = useMemo(() => {
    if (!visibleProducts.length) return { min: 0, max: 10000 };
    const prices = visibleProducts.map((p) => p.price);
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [visibleProducts]);

  const toggleCategory = (cat) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
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
          p.category.toLowerCase().includes(q) ||
          (p.description || "").toLowerCase().includes(q)
      );
    }
    if (selectedCategories.length)
      result = result.filter((p) => selectedCategories.includes(p.category));
    if (selectedBrands.length)
      result = result.filter((p) => selectedBrands.includes(p.brand));
    if (priceMin !== "") result = result.filter((p) => p.price >= Number(priceMin));
    if (priceMax !== "") result = result.filter((p) => p.price <= Number(priceMax));

    switch (sort) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name-asc": result.sort((a, b) => a.title.localeCompare(b.title)); break;
    }
    return result;
  }, [visibleProducts, searchQ, selectedCategories, selectedBrands, priceMin, priceMax, sort]);

  const activeFiltersCount =
    (searchQ ? 1 : 0) +
    selectedCategories.length +
    selectedBrands.length +
    (priceMin || priceMax ? 1 : 0);

  return (
    <>
      {/* Page Header */}
      <div className="px-8 py-14 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)]/20">
        <div className="max-w-[1920px] mx-auto">
          <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] font-bold mb-2 block">
            CATALOGUE // 2024
          </span>
          <h1 className="text-5xl font-black tracking-tighter uppercase">All Imports</h1>
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
                Search
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
                  placeholder="Search products..."
                  className="w-full border border-zinc-200 text-xs pl-8 pr-3 py-2.5 outline-none focus:border-black transition-colors"
                />
              </div>
            </div>

            {/* Sort */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">
                Sort By
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

            {/* Category */}
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">
                Category
              </p>
              <div className="space-y-2">
                {allCategories.map((cat) => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => toggleCategory(cat)}
                      className={`w-4 h-4 border-2 flex items-center justify-center transition-all shrink-0 ${
                        selectedCategories.includes(cat)
                          ? "bg-black border-black"
                          : "border-zinc-300 group-hover:border-black"
                      }`}
                    >
                      {selectedCategories.includes(cat) && (
                        <span
                          className="material-symbols-outlined text-white"
                          style={{ fontSize: "11px", fontVariationSettings: "'wght' 700" }}
                        >
                          check
                        </span>
                      )}
                    </div>
                    <span
                      onClick={() => toggleCategory(cat)}
                      className="text-xs font-semibold uppercase tracking-wide text-zinc-600 group-hover:text-black transition-colors"
                    >
                      {cat}
                    </span>
                    <span className="ml-auto text-[9px] text-zinc-400">
                      {visibleProducts.filter((p) => p.category === cat).length}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brand */}
            {allBrands.length > 0 && (
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 mb-3">
                  Brand
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
                Price Range
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
                Clear All Filters ({activeFiltersCount})
              </button>
            )}
          </div>
        </aside>

        {/* ── Product Grid ── */}
        <div className="flex-1 px-8 py-8">
          {/* Toolbar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className="lg:hidden flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-zinc-200 px-3 py-2 hover:bg-zinc-50"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                  tune
                </span>
                Filters
                {activeFiltersCount > 0 && (
                  <span className="bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center font-black rounded-full">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold">
                {filtered.length} products
                {activeFiltersCount > 0 && ` (filtered)`}
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
                No products match your filters
              </p>
              <button
                onClick={clearFilters}
                className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-4 hover:no-underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
