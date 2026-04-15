"use client";

import Link from "next/link";
import { toast } from "react-toastify";
import { useProducts } from "@/context/ProductsContext";
import { useCategories } from "@/context/CategoriesContext";
import { useCart } from "@/context/CartContext";

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
      className="group bg-white flex flex-col border border-zinc-100 hover:border-zinc-300 hover:shadow-sm transition-all duration-200"
    >
      {/* Image */}
      {(() => {
        const secondImage = Array.isArray(product.images) && product.images[0];
        return (
          <div className="relative aspect-square overflow-hidden bg-zinc-50">
            {product.image ? (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={product.image}
                  alt={product.title}
                  className={`absolute inset-0 w-full h-full object-contain p-3 transition-opacity duration-500 ${secondImage ? "group-hover:opacity-0" : "group-hover:scale-105 transition-transform"}`}
                />
                {secondImage && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={secondImage}
                    alt={product.title}
                    className="absolute inset-0 w-full h-full object-contain p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <span className="material-symbols-outlined text-zinc-200" style={{ fontSize: "32px" }}>image</span>
              </div>
            )}
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
        <h3 className="text-[11px] font-bold uppercase tracking-tight line-clamp-2 leading-snug group-hover:opacity-60 transition-opacity">
          {product.title}
        </h3>
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
    </Link>
  );
}

export default function CategorySections() {
  const { products, initialized: prodInit } = useProducts();
  const { flatList, initialized: catInit } = useCategories();

  if (!prodInit || !catInit) return null;

  const topLevelCats = flatList.filter((c) => c.depth === 0);
  if (!topLevelCats.length) return null;

  const visibleProducts = products.filter((p) => p.visible);

  // Build sections — skip categories with no products
  const sections = topLevelCats
    .map((cat) => {
      const descendantIds = getDescendantIds(flatList, cat.id);
      const catProducts = visibleProducts.filter(
        (p) => p.category_id && descendantIds.has(p.category_id)
      );
      return { cat, catProducts };
    })
    .filter(({ catProducts }) => catProducts.length > 0);

  if (!sections.length) return null;

  return (
    <div className="bg-[var(--color-surface)]">
      {sections.map(({ cat, catProducts }, idx) => {
        const preview = catProducts.slice(0, 4);
        const hasMore = catProducts.length > 4;

        return (
          <section
            key={cat.id}
            className={`py-12 sm:py-16 px-4 sm:px-8 ${idx % 2 !== 0 ? "bg-[var(--color-surface-container-low)]" : ""}`}
          >
            <div className="max-w-[1920px] mx-auto">
              {/* Section header */}
              <div className="flex items-end justify-between mb-6 sm:mb-8">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] font-bold mb-2 block">
                    COLECCIÓN
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black tracking-tighter uppercase">
                    {cat.name}
                  </h2>
                  <p className="text-[11px] text-[var(--color-outline)] mt-1 uppercase tracking-widest font-medium">
                    {catProducts.length} producto{catProducts.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <Link
                  href={`/categorias/${cat.id}`}
                  className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-b border-[var(--color-primary)] pb-1 hover:opacity-60 transition-opacity shrink-0"
                >
                  Ver Todo
                  <span className="material-symbols-outlined" style={{ fontSize: "12px" }}>
                    arrow_forward
                  </span>
                </Link>
              </div>

              {/* 4-column product grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {preview.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* "Ver Todo" CTA below grid */}
              {hasMore && (
                <div className="mt-6 sm:mt-8 text-center">
                  <Link
                    href={`/categorias/${cat.id}`}
                    className="inline-flex items-center gap-3 border border-black/20 text-black px-8 py-3.5 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all duration-200 active:scale-95"
                  >
                    Ver todos los {cat.name}
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                      arrow_forward
                    </span>
                  </Link>
                </div>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
