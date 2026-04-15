"use client";

import { useProducts } from "@/context/ProductsContext";
import Link from "next/link";

function StatCard({ label, value, sub, icon, accent }) {
  return (
    <div className="bg-zinc-800 rounded p-6 flex items-start gap-4 border border-zinc-700/50">
      <div
        className={`w-10 h-10 rounded flex items-center justify-center shrink-0 ${
          accent === "white"
            ? "bg-white"
            : accent === "amber"
            ? "bg-amber-400"
            : accent === "emerald"
            ? "bg-emerald-500"
            : "bg-zinc-700"
        }`}
      >
        <span
          className={`material-symbols-outlined text-[20px] ${
            accent === "white" ? "text-black" :
            accent === "amber" || accent === "emerald" ? "text-black" : "text-zinc-300"
          }`}
          style={{ fontSize: "20px" }}
        >
          {icon}
        </span>
      </div>
      <div>
        <p className="text-zinc-400 text-[10px] uppercase tracking-widest font-bold mb-1">
          {label}
        </p>
        <p className="text-white text-2xl font-black tracking-tight">{value}</p>
        {sub && <p className="text-zinc-500 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function RecentRow({ product }) {
  return (
    <div className="flex items-center gap-4 py-3 border-b border-zinc-800/60 last:border-0">
      <div className="w-10 h-10 rounded bg-zinc-800 overflow-hidden shrink-0 flex items-center justify-center">
        {product.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-contain p-1"
          />
        ) : (
          <span className="material-symbols-outlined text-zinc-600 text-[18px]">image</span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-semibold truncate">{product.title}</p>
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest">{product.sku}</p>
      </div>
      <div className="text-right shrink-0">
        <p className="text-white text-sm font-light">Gs. {product.price.toLocaleString("es-PY")}</p>
        <span
          className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
            !product.visible
              ? "text-zinc-500 bg-zinc-800"
              : product.stock === 0
              ? "text-red-400 bg-red-950"
              : product.stock < 5
              ? "text-amber-400 bg-amber-950"
              : "text-emerald-400 bg-emerald-950"
          }`}
        >
          {!product.visible ? "Oculto" : product.stock === 0 ? "Sin Stock" : product.stock < 5 ? "Poco Stock" : "En Stock"}
        </span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { products, initialized } = useProducts();

  if (!initialized) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const visibleCount = products.filter((p) => p.visible).length;
  const hiddenCount = products.filter((p) => !p.visible).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const totalValue = products.reduce((acc, p) => acc + p.price * p.stock, 0);
  const recentProducts = [...products].slice(0, 5);
  const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-900">
      {/* Header */}
      <div className="px-4 sm:px-8 py-5 sm:py-7 border-b border-zinc-800">
        <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">
          RESUMEN
        </p>
        <h1 className="text-white text-xl sm:text-2xl font-black tracking-tight">Panel</h1>
      </div>

      <div className="p-4 sm:p-8 space-y-6 sm:space-y-8">
        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            label="Total Productos"
            value={products.length}
            sub={`${categories.length} categorías`}
            icon="inventory_2"
            accent="white"
          />
          <StatCard
            label="Visibles"
            value={visibleCount}
            sub={`${hiddenCount} ocultos`}
            icon="visibility"
            accent="emerald"
          />
          <StatCard
            label="Sin / Poco Stock"
            value={outOfStock}
            sub={`${products.filter(p => p.stock > 0 && p.stock < 5).length} con poco stock`}
            icon="warning"
            accent="amber"
          />
          <StatCard
            label="Valor Inventario"
            value={`Gs. ${totalValue.toLocaleString("es-PY")}`}
            sub="a precio de lista"
            icon="payments"
            accent="default"
          />
        </div>

        {/* Two column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent products */}
          <div className="lg:col-span-2 bg-zinc-800 rounded border border-zinc-700/50 p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-white text-xs font-black uppercase tracking-widest">
                Inventario
              </p>
              <Link
                href="/admin/products"
                className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
              >
                Ver todos
                <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>arrow_forward</span>
              </Link>
            </div>
            <div>
              {recentProducts.length === 0 ? (
                <p className="text-zinc-600 text-sm py-6 text-center">Sin productos aún</p>
              ) : (
                recentProducts.map((p) => <RecentRow key={p.id} product={p} />)
              )}
            </div>
          </div>

          {/* Category breakdown */}
          <div className="bg-zinc-800 rounded border border-zinc-700/50 p-6">
            <p className="text-white text-xs font-black uppercase tracking-widest mb-5">
              Por Categoría
            </p>
            <div className="space-y-4">
              {categories.length === 0 ? (
                <p className="text-zinc-600 text-xs">Sin categorías asignadas</p>
              ) : (
                categories.map((cat) => {
                  const catProducts = products.filter((p) => p.category === cat);
                  const pct = Math.round((catProducts.length / products.length) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-zinc-300 text-xs font-semibold uppercase tracking-wide truncate mr-2">
                          {cat}
                        </span>
                        <span className="text-zinc-500 text-[10px] shrink-0">
                          {catProducts.length} art.
                        </span>
                      </div>
                      <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Quick actions */}
            <div className="mt-8 pt-6 border-t border-zinc-700 space-y-2">
              <p className="text-white text-xs font-black uppercase tracking-widest mb-3">
                Acciones Rápidas
              </p>
              <Link
                href="/admin/products"
                className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors py-2 text-xs font-semibold uppercase tracking-wide"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add_circle</span>
                Agregar Producto
              </Link>
              <Link
                href="/admin/categories"
                className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors py-2 text-xs font-semibold uppercase tracking-wide"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>account_tree</span>
                Gestionar Categorías
              </Link>
              <Link
                href="/"
                target="_blank"
                className="flex items-center gap-3 text-zinc-400 hover:text-white transition-colors py-2 text-xs font-semibold uppercase tracking-wide"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>open_in_new</span>
                Ver Tienda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
