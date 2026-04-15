"use client";

import { useState, useRef } from "react";
import { useProducts } from "@/context/ProductsContext";
import { useCategories } from "@/context/CategoriesContext";

/* ── Hierarchical category picker ─────────────────────────── */
function CategoryPicker({ tree, path, onSelect }) {
  if (tree.length === 0) {
    return (
      <p className="text-zinc-600 text-[10px]">
        Sin categorías —{" "}
        <a href="/admin/categories" className="text-zinc-400 underline hover:text-white">
          creá algunas primero
        </a>
      </p>
    );
  }

  // Build rows dynamically: top-level, then children of each selected item
  const rows = [];
  let nodes = tree;
  rows.push({ nodes, selectedId: path[0]?.id ?? null, level: 0 });

  for (let i = 0; i < path.length; i++) {
    const selected = nodes.find((n) => n.id === path[i].id);
    if (!selected?.children?.length) break;
    nodes = selected.children;
    rows.push({ nodes, selectedId: path[i + 1]?.id ?? null, level: i + 1 });
  }

  const handleClick = (levelIndex, node) => {
    const newPath = path.slice(0, levelIndex);
    newPath.push({ id: node.id, name: node.name });
    onSelect(newPath);
  };

  const ROW_LABELS = ["Principal", "Categoría", "Sub-cat.", "Detalle"];

  return (
    <div className="space-y-2">
      {rows.map((row, i) => (
        <div key={i}>
          <p className="text-zinc-600 text-[8px] font-bold uppercase tracking-widest mb-1">
            {ROW_LABELS[Math.min(i, 3)]}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {row.nodes.map((node) => (
              <button
                key={node.id}
                type="button"
                onClick={() => handleClick(i, node)}
                className={`text-[9px] font-bold uppercase tracking-widest px-3 py-2 rounded transition-all ${
                  row.selectedId === node.id
                    ? "bg-white text-black"
                    : "text-zinc-400 hover:text-white bg-zinc-800 hover:bg-zinc-700"
                }`}
              >
                {node.name}
              </button>
            ))}
          </div>
        </div>
      ))}
      {/* Selected breadcrumb */}
      {path.length > 0 && (
        <p className="text-zinc-500 text-[9px] pt-1">
          Seleccionado:{" "}
          <span className="text-white font-semibold">
            {path.map((p) => p.name).join(" › ")}
          </span>
          <button
            type="button"
            onClick={() => onSelect([])}
            className="ml-2 text-zinc-600 hover:text-zinc-400 transition-colors"
          >
            ✕
          </button>
        </p>
      )}
    </div>
  );
}

/* ── Helper: rebuild path from category_id using flat list ── */
function buildPathFromId(flatList, targetId) {

  if (!targetId) return [];
  const path = [];
  let current = flatList.find((c) => c.id === targetId);
  while (current) {
    path.unshift({ id: current.id, name: current.name });
    current = current.parent_id
      ? flatList.find((c) => c.id === current.parent_id)
      : null;
  }
  return path;
}

/* ── Helper: all category names in a subtree (BFS) ── */
function getDescendantNames(catName, flatList) {
  const root = flatList.find((c) => c.name === catName);
  if (!root) return catName ? [catName] : [];
  const names = [catName];
  const queue = [root.id];
  while (queue.length) {
    const parentId = queue.shift();
    for (const child of flatList.filter((c) => c.parent_id === parentId)) {
      names.push(child.name);
      queue.push(child.id);
    }
  }
  return names;
}

const EMPTY_FORM = {
  title: "",
  brand: "",
  sku: "",
  category: "",
  category_id: null,
  price: "",
  sale_price: "",
  stock: "",
  badge: "",
  description: "",
  image: "",
  images: [],
  visible: true,
  isBestSeller: false,
};

export default function ProductsManager() {
  const { products, initialized, addProduct, updateProduct, deleteProduct, toggleVisibility } =
    useProducts();
  const { tree: categoryTree, flatList: flatCategories } = useCategories();
  const [pickerPath, setPickerPath] = useState([]);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todos");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const fileInputRef = useRef(null);

  const filtered = products
    .filter((p) => {
      const q = search.toLowerCase();
      return (
        p.title.toLowerCase().includes(q) ||
        (p.sku || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
      );
    })
    .filter((p) => {
      if (categoryFilter === "Todos") return true;
      const catNode = flatCategories.find((c) => c.name === categoryFilter);
      // Parent category: include all descendants
      if (catNode?.children?.length > 0) {
        return getDescendantNames(categoryFilter, flatCategories).includes(p.category);
      }
      return p.category === categoryFilter;
    });

  // Only top-level categories for filter pills
  const topLevelCats = flatCategories.filter((c) => c.depth === 0);

  // Grouped view when a parent category is selected
  const selectedCatNode = categoryFilter !== "Todos"
    ? flatCategories.find((c) => c.name === categoryFilter)
    : null;
  const isGroupedView = (selectedCatNode?.children?.length ?? 0) > 0;

  // Build display rows: product rows + group header rows
  const displayRows = (() => {
    if (!isGroupedView) return filtered.map((p) => ({ type: "product", data: p }));
    const groups = {};
    for (const p of filtered) {
      const key = p.category || "Sin categoría";
      if (!groups[key]) groups[key] = [];
      groups[key].push(p);
    }
    const rows = [];
    for (const [name, prods] of Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))) {
      rows.push({ type: "group", name, count: prods.length });
      for (const p of prods) rows.push({ type: "product", data: p });
    }
    return rows;
  })();

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setPickerPath([]);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setForm({
      ...EMPTY_FORM,
      ...product,
      price: String(product.price),
      sale_price: product.sale_price != null ? String(product.sale_price) : "",
      stock: String(product.stock),
      category_id: product.category_id ?? null,
      images: Array.isArray(product.images) ? product.images : [],
      tags: Array.isArray(product.tags)
        ? product.tags.filter(t => t !== "BEST SELLER").join(", ")
        : (product.tags || "").replace(/BEST SELLER/g, "").replace(/,\s*,/g, ","),
      isBestSeller: Array.isArray(product.tags)
        ? product.tags.includes("BEST SELLER")
        : (product.tags || "").includes("BEST SELLER"),
    });
    setPickerPath(buildPathFromId(flatCategories, product.category_id ?? null));
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setPickerPath([]);
    setForm(EMPTY_FORM);
  };

  const handlePickerSelect = (newPath) => {
    setPickerPath(newPath);
    const last = newPath[newPath.length - 1] ?? null;
    setForm((f) => ({
      ...f,
      category_id: last?.id ?? null,
      category: last?.name ?? "",
    }));
  };

  const handleImageFile = async (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    
    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setForm((f) => ({ ...f, image: data.url }));
      } else {
        alert("Upload failed: " + (data.error || "Unknown error"));
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading image");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    handleImageFile(file);
  };

  const handleSave = async () => {
    if (!form.title || !form.price) return;
    setIsSaving(true);
    await new Promise((r) => setTimeout(r, 300));

    const productData = {
      ...form,
      price: parseFloat(form.price) || 0,
      sale_price: form.sale_price !== "" ? parseFloat(form.sale_price) || null : null,
      stock: parseInt(form.stock) || 0,
      tags: form.tags
        ? form.tags
            .split(",")
            .map((t) => t.trim().toUpperCase())
            .filter(Boolean)
        : [],
    };
    if (form.isBestSeller && !productData.tags.includes("BEST SELLER")) {
      productData.tags.push("BEST SELLER");
    }

    if (editingId) {
      updateProduct(editingId, productData);
    } else {
      addProduct({ ...productData, id: `product-${Date.now()}` });
    }

    setIsSaving(false);
    closeModal();
  };

  if (!initialized) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-zinc-900">
      {/* ── Header ── */}
      <div className="px-4 sm:px-8 py-5 sm:py-7 border-b border-zinc-800 flex items-center justify-between shrink-0">
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">
            CATÁLOGO
          </p>
          <h1 className="text-white text-xl sm:text-2xl font-black tracking-tight">Productos</h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-white text-black px-3 sm:px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-zinc-100 transition-colors active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
          <span className="hidden sm:inline">Agregar Producto</span>
          <span className="sm:hidden">Agregar</span>
        </button>
      </div>

      {/* ── Filters ── */}
      <div className="px-4 sm:px-8 py-3 sm:py-4 border-b border-zinc-800 flex items-center gap-3 shrink-0 flex-wrap gap-y-3">
        {/* Search */}
        <div className="relative min-w-[220px]">
          <span
            className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
            style={{ fontSize: "16px" }}
          >
            search
          </span>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 text-white text-xs pl-9 pr-4 py-2.5 rounded outline-none focus:border-zinc-500 transition-colors placeholder-zinc-600"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                close
              </span>
            </button>
          )}
        </div>

        {/* Category filter pills — top-level only */}
        <div className="flex items-center gap-2 flex-wrap">
          {["Todos", ...topLevelCats.map((c) => c.name)].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`text-[9px] font-bold uppercase tracking-widest px-3 py-2 rounded transition-all ${
                categoryFilter === cat
                  ? "bg-white text-black"
                  : "text-zinc-500 hover:text-white hover:bg-zinc-800"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="ml-auto text-zinc-600 text-[10px] uppercase tracking-widest font-bold shrink-0">
          {filtered.length} / {products.length}
        </div>
      </div>

      {/* ── Product List ── */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <span className="material-symbols-outlined text-zinc-700" style={{ fontSize: "48px" }}>
              inventory_2
            </span>
            <p className="text-zinc-600 text-sm">No se encontraron productos</p>
            <button
              onClick={openAdd}
              className="text-white text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:no-underline"
            >
              Agregar el primer producto
            </button>
          </div>
        ) : (
          <>
            {/* ── Desktop table ── */}
            <table className="w-full hidden sm:table">
              <thead className="sticky top-0 bg-zinc-900 z-10 border-b border-zinc-800">
                <tr>
                  {["Producto", "Categoría", "Precio", "Stock", "Visibilidad", "Acciones"].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[9px] font-black uppercase tracking-widest text-zinc-600 px-4 py-3 first:pl-8 last:pr-8"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayRows.map((row) =>
                  row.type === "group" ? (
                    <tr key={`g-${row.name}`}>
                      <td colSpan={6} className="pl-8 pr-4 py-2.5 bg-zinc-800/60 border-b border-t border-zinc-700/60">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-zinc-400" style={{ fontSize: "15px" }}>folder</span>
                          <span className="text-zinc-200 text-[10px] font-black uppercase tracking-widest">{row.name}</span>
                          <span className="text-zinc-600 text-[10px]">— {row.count} {row.count === 1 ? "producto" : "productos"}</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    <tr
                      key={row.data.id}
                      className={`border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors ${!row.data.visible ? "opacity-40" : ""}`}
                    >
                      <td className="px-4 py-3 pl-8">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded bg-zinc-800 shrink-0 overflow-hidden flex items-center justify-center border border-zinc-700/50">
                            {row.data.image ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={row.data.image} alt={row.data.title} className="w-full h-full object-contain p-1.5" />
                            ) : (
                              <span className="material-symbols-outlined text-zinc-600" style={{ fontSize: "20px" }}>image</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-white text-sm font-semibold truncate">{row.data.title}</p>
                              {row.data.badge && (
                                <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded shrink-0">
                                  {row.data.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-zinc-600 text-[10px] font-mono tracking-widest">{row.data.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wide">{row.data.category}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-white text-sm font-light">Gs. {Number(row.data.price).toLocaleString("es-PY")}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded ${row.data.stock === 0 ? "text-red-400 bg-red-950" : row.data.stock < 5 ? "text-amber-400 bg-amber-950" : "text-emerald-400 bg-emerald-950"}`}>
                          {row.data.stock === 0 ? "Sin Stock" : `${row.data.stock} uds.`}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleVisibility(row.data.id)}
                          className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-all cursor-pointer ${row.data.visible ? "text-emerald-400 bg-emerald-950 hover:bg-emerald-900" : "text-zinc-600 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-400"}`}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
                            {row.data.visible ? "visibility" : "visibility_off"}
                          </span>
                          {row.data.visible ? "Visible" : "Oculto"}
                        </button>
                      </td>
                      <td className="px-4 py-3 pr-8">
                        <div className="flex items-center gap-1.5">
                          <button onClick={() => openEdit(row.data)} className="p-2 rounded text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all" title="Editar">
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</span>
                          </button>
                          {deleteConfirmId === row.data.id ? (
                            <div className="flex items-center gap-1 bg-red-950 border border-red-800 rounded px-2 py-1">
                              <span className="text-red-400 text-[9px] font-bold uppercase tracking-wide mr-1">¿Confirmar?</span>
                              <button onClick={() => { deleteProduct(row.data.id); setDeleteConfirmId(null); }} className="text-red-400 hover:text-red-200 transition-colors">
                                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>check</span>
                              </button>
                              <button onClick={() => setDeleteConfirmId(null)} className="text-zinc-500 hover:text-white transition-colors">
                                <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>close</span>
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteConfirmId(row.data.id)} className="p-2 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950 transition-all" title="Eliminar">
                              <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>

            {/* ── Mobile cards ── */}
            <div className="sm:hidden divide-y divide-zinc-800/60">
              {displayRows.map((row) =>
                row.type === "group" ? (
                  <div key={`g-${row.name}`} className="px-4 py-2.5 bg-zinc-800/60 flex items-center gap-2">
                    <span className="material-symbols-outlined text-zinc-400" style={{ fontSize: "14px" }}>folder</span>
                    <span className="text-zinc-200 text-[10px] font-black uppercase tracking-widest">{row.name}</span>
                    <span className="text-zinc-600 text-[10px]">— {row.count} {row.count === 1 ? "producto" : "productos"}</span>
                  </div>
                ) : (
                <div
                  key={row.data.id}
                  className={`px-4 py-4 flex items-center gap-3 ${!row.data.visible ? "opacity-40" : ""}`}
                >
                  <div className="w-14 h-14 rounded bg-zinc-800 shrink-0 overflow-hidden flex items-center justify-center border border-zinc-700/50">
                    {row.data.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={row.data.image} alt={row.data.title} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="material-symbols-outlined text-zinc-600" style={{ fontSize: "22px" }}>image</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{row.data.title}</p>
                    <p className="text-zinc-500 text-[10px] font-mono">{row.data.sku}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-zinc-300 text-xs font-light">Gs. {Number(row.data.price).toLocaleString("es-PY")}</span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${row.data.stock === 0 ? "text-red-400 bg-red-950" : row.data.stock < 5 ? "text-amber-400 bg-amber-950" : "text-emerald-400 bg-emerald-950"}`}>
                        {row.data.stock === 0 ? "Sin Stock" : `${row.data.stock}u`}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleVisibility(row.data.id)}
                      className={`p-2 rounded transition-all ${row.data.visible ? "text-emerald-400 hover:bg-emerald-950" : "text-zinc-600 hover:bg-zinc-800"}`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                        {row.data.visible ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                    <button onClick={() => openEdit(row.data)} className="p-2 rounded text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all">
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
                    </button>
                    {deleteConfirmId === row.data.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => { deleteProduct(row.data.id); setDeleteConfirmId(null); }} className="p-2 text-red-400">
                          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>check</span>
                        </button>
                        <button onClick={() => setDeleteConfirmId(null)} className="p-2 text-zinc-500">
                          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirmId(row.data.id)} className="p-2 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950 transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                      </button>
                    )}
                  </div>
                </div>
                )
              )}
            </div>
          </>
        )}
      </div>

      {/* ── MODAL ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="flex-1 bg-black/70 backdrop-blur-sm"
            onClick={closeModal}
          />

          {/* Slide panel */}
          <div className="w-full max-w-full sm:max-w-lg bg-zinc-900 border-l border-zinc-700 h-full overflow-y-auto flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 sm:px-8 py-5 sm:py-6 border-b border-zinc-800 shrink-0">
              <div>
                <p className="text-zinc-500 text-[9px] uppercase tracking-widest font-bold mb-1">
                  {editingId ? "EDITANDO PRODUCTO" : "NUEVO PRODUCTO"}
                </p>
                <h2 className="text-white text-lg font-black tracking-tight">
                  {editingId ? "Editar Producto" : "Agregar Producto"}
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="p-2 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all"
              >
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
                  close
                </span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 px-4 sm:px-8 py-6 space-y-6 overflow-y-auto">
              {/* Image Upload */}
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-3">
                  Imagen del Producto
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded cursor-pointer transition-all duration-200 ${
                    isDragging
                      ? "border-white bg-zinc-800"
                      : "border-zinc-700 hover:border-zinc-500 hover:bg-zinc-800/40"
                  }`}
                >
                  {form.image ? (
                    <div className="relative h-48">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={form.image}
                        alt="Preview"
                        className="w-full h-full object-contain p-4"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setForm((f) => ({ ...f, image: "" }));
                        }}
                        className="absolute top-3 right-3 bg-zinc-900 border border-zinc-700 p-1.5 rounded text-zinc-400 hover:text-white transition-colors"
                      >
                        <span
                          className="material-symbols-outlined"
                          style={{ fontSize: "14px" }}
                        >
                          close
                        </span>
                      </button>
                    </div>
                  ) : isUploadingImage ? (
                    <div className="h-40 flex flex-col items-center justify-center gap-3 text-zinc-600">
                      <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                        Subiendo a la nube...
                      </p>
                    </div>
                  ) : (
                    <div className="h-40 flex flex-col items-center justify-center gap-3 text-zinc-600">
                      <span
                        className="material-symbols-outlined"
                        style={{ fontSize: "36px" }}
                      >
                        {isDragging ? "file_download" : "add_photo_alternate"}
                      </span>
                      <p className="text-xs font-semibold uppercase tracking-widest">
                        {isDragging ? "Soltá la imagen aquí" : "Arrastrá o hacé click para subir"}
                      </p>
                      <p className="text-[10px] text-zinc-700">PNG, JPG, WEBP — o pegá una URL abajo</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageFile(e.target.files[0])}
                />
                <input
                  type="url"
                  placeholder="O pegá la URL de la imagen..."
                  value={form.image.startsWith("data:") ? "" : form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="mt-2 w-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-4 py-2.5 rounded outline-none focus:border-zinc-500 transition-colors placeholder-zinc-700"
                />
              </div>

              {/* Extra Images */}
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Imágenes Adicionales
                  <span className="text-zinc-600 normal-case font-normal ml-2 tracking-normal text-[9px]">
                    — La 1ª se muestra al pasar el mouse
                  </span>
                </label>

                <div className="space-y-2">
                  {(form.images || []).map((url, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <div className="w-10 h-10 bg-zinc-800 border border-zinc-700 rounded overflow-hidden shrink-0 flex items-center justify-center">
                        {url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={url} alt="" className="w-full h-full object-contain p-1" />
                        ) : (
                          <span className="material-symbols-outlined text-zinc-600" style={{ fontSize: "16px" }}>image</span>
                        )}
                      </div>
                      <input
                        type="url"
                        placeholder="https://..."
                        value={url}
                        onChange={(e) => {
                          const next = [...form.images];
                          next[idx] = e.target.value;
                          setForm((f) => ({ ...f, images: next }));
                        }}
                        className="flex-1 bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-3 py-2.5 rounded outline-none focus:border-zinc-500 transition-colors placeholder-zinc-700"
                      />
                      <button
                        type="button"
                        onClick={() => setForm((f) => ({ ...f, images: f.images.filter((_, i) => i !== idx) }))}
                        className="p-2 text-zinc-600 hover:text-red-400 transition-colors shrink-0"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>close</span>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, images: [...(f.images || []), ""] }))}
                    className="w-full flex items-center justify-center gap-2 border border-dashed border-zinc-700 hover:border-zinc-500 text-zinc-600 hover:text-zinc-300 text-[10px] font-bold uppercase tracking-widest py-2.5 rounded transition-all"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>add_photo_alternate</span>
                    Agregar imagen
                  </button>
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Nombre del Producto <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder='e.g. Monolith Display 32"'
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded outline-none focus:border-zinc-400 transition-colors placeholder-zinc-700"
                />
              </div>

              {/* Brand */}
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Marca / Fabricante
                </label>
                <input
                  type="text"
                  placeholder="e.g. MONOLITH, SONY, APPLE"
                  value={form.brand}
                  onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value.toUpperCase() }))}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded outline-none focus:border-zinc-400 transition-colors placeholder-zinc-700 uppercase tracking-widest"
                />
              </div>

              {/* SKU */}
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  SKU
                </label>
                <input
                  type="text"
                  placeholder="PX-XXX-00"
                  value={form.sku}
                  onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded outline-none focus:border-zinc-400 transition-colors placeholder-zinc-700 font-mono"
                />
              </div>

              {/* Category picker */}
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Categoría
                </label>
                <div className="bg-zinc-800/50 border border-zinc-700 rounded p-3">
                  <CategoryPicker
                    tree={categoryTree}
                    path={pickerPath}
                    onSelect={handlePickerSelect}
                  />
                </div>
              </div>

              {/* Price + Sale Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                    Precio Normal (PYG) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">Gs.</span>
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={form.price}
                      onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
                      className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm pl-8 pr-4 py-3 rounded outline-none focus:border-zinc-400 transition-colors placeholder-zinc-700"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                    Unidades en Stock
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={form.stock}
                    onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded outline-none focus:border-zinc-400 transition-colors placeholder-zinc-700"
                  />
                </div>
              </div>

              {/* Sale price */}
              <div className="bg-zinc-800/60 border border-zinc-700 rounded p-4 space-y-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-amber-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5">
                    <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>local_offer</span>
                    Precio Oferta (PYG)
                  </label>
                  {form.sale_price && form.price && parseFloat(form.sale_price) < parseFloat(form.price) && (
                    <span className="text-[9px] font-black text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                      -{Math.round((1 - parseFloat(form.sale_price) / parseFloat(form.price)) * 100)}% OFF
                    </span>
                  )}
                </div>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">Gs.</span>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Dejar vacío si no tiene descuento"
                    value={form.sale_price}
                    onChange={(e) => setForm((f) => ({ ...f, sale_price: e.target.value }))}
                    className="w-full bg-zinc-900 border border-zinc-600 text-amber-300 text-sm pl-8 pr-4 py-3 rounded outline-none focus:border-amber-500 transition-colors placeholder-zinc-700"
                  />
                </div>
                {form.sale_price && form.price && parseFloat(form.sale_price) >= parseFloat(form.price) && (
                  <p className="text-red-400 text-[10px]">
                    El precio oferta debe ser menor al precio normal.
                  </p>
                )}
                <p className="text-zinc-600 text-[10px]">
                  Si se completa, se muestra tachado el precio normal y destacado el precio oferta.
                </p>
              </div>

              {/* Badge + Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                    Etiqueta
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. New, Limited"
                    value={form.badge}
                    onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded outline-none focus:border-zinc-400 transition-colors placeholder-zinc-700"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                    Etiquetas (separadas por coma)
                  </label>
                  <input
                    type="text"
                    placeholder="4K, OLED, 240HZ"
                    value={form.tags}
                    onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded outline-none focus:border-zinc-400 transition-colors placeholder-zinc-700"
                  />
                  <div className="flex items-center gap-2 mt-4">
                    <input
                      type="checkbox"
                      id="isBestSeller"
                      name="isBestSeller"
                      checked={form.isBestSeller}
                      onChange={(e) =>
                        setForm({ ...form, isBestSeller: e.target.checked })
                      }
                      className="w-4 h-4 bg-zinc-900 border-zinc-700 rounded text-emerald-500 focus:ring-emerald-500"
                    />
                    <label htmlFor="isBestSeller" className="text-zinc-300 text-xs font-semibold">
                      Destacar como "Mejor Vendido" en inicio
                    </label>
                  </div>
                </div>

              </div>

              {/* Description */}
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Descripción
                </label>
                <textarea
                  rows={4}
                  placeholder="Descripción del producto..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded outline-none focus:border-zinc-400 transition-colors placeholder-zinc-700 resize-none"
                />
              </div>

              {/* Visibility toggle */}
              <div className="flex items-center justify-between py-4 px-5 bg-zinc-800 rounded border border-zinc-700">
                <div>
                  <p className="text-white text-xs font-bold uppercase tracking-widest">
                    Visibilidad
                  </p>
                  <p className="text-zinc-500 text-[10px] mt-0.5">
                    {form.visible ? "Visible para los clientes" : "Oculto en la tienda"}
                  </p>
                </div>
                <button
                  onClick={() => setForm((f) => ({ ...f, visible: !f.visible }))}
                  className={`w-12 h-6 rounded-full transition-all duration-200 relative shrink-0 ${
                    form.visible ? "bg-emerald-500" : "bg-zinc-700"
                  }`}
                >
                  <div
                    className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-200 ${
                      form.visible ? "left-6" : "left-0.5"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-4 sm:px-8 py-5 sm:py-6 border-t border-zinc-800 flex items-center gap-3 shrink-0">
              <button
                onClick={closeModal}
                className="flex-1 py-3 text-xs font-black uppercase tracking-widest text-zinc-400 border border-zinc-700 rounded hover:bg-zinc-800 hover:text-white transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={!form.title || !form.price || isSaving}
                className="flex-1 py-3 text-xs font-black uppercase tracking-widest bg-white text-black rounded hover:bg-zinc-200 transition-all active:scale-[0.98] duration-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                    {editingId ? "save" : "add_circle"}
                  </span>
                )}
                {isSaving ? "Guardando..." : editingId ? "Guardar Cambios" : "Agregar Producto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
