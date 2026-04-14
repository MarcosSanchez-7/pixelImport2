"use client";

import { useState, useRef } from "react";
import { useProducts } from "@/context/ProductsContext";

const CATEGORIES = ["Displays", "Audio", "Peripherals", "Cameras", "Computing", "Other"];

const EMPTY_FORM = {
  title: "",
  brand: "",
  sku: "",
  category: "Displays",
  price: "",
  stock: "",
  badge: "",
  description: "",
  image: "",
  visible: true,
  isBestSeller: false,
};

export default function ProductsManager() {
  const { products, initialized, addProduct, updateProduct, deleteProduct, toggleVisibility } =
    useProducts();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
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
        p.category.toLowerCase().includes(q)
      );
    })
    .filter((p) => categoryFilter === "All" || p.category === categoryFilter);

  const openAdd = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setIsModalOpen(true);
  };

  const openEdit = (product) => {
    setForm({
      ...EMPTY_FORM,
      ...product,
      price: String(product.price),
      stock: String(product.stock),
      tags: Array.isArray(product.tags)
        ? product.tags.filter(t => t !== "BEST SELLER").join(", ")
        : (product.tags || "").replace(/BEST SELLER/g, "").replace(/,\s*,/g, ","),
      isBestSeller: Array.isArray(product.tags) 
        ? product.tags.includes("BEST SELLER")
        : (product.tags || "").includes("BEST SELLER"),
    });
    setEditingId(product.id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
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
            CATALOGUE
          </p>
          <h1 className="text-white text-xl sm:text-2xl font-black tracking-tight">Products</h1>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 bg-white text-black px-3 sm:px-5 py-2.5 text-xs font-black uppercase tracking-widest hover:bg-zinc-100 transition-colors active:scale-95 duration-150"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>add</span>
          <span className="hidden sm:inline">Add Product</span>
          <span className="sm:hidden">Add</span>
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
            placeholder="Search products..."
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

        {/* Category filter pills */}
        <div className="flex items-center gap-2 flex-wrap">
          {["All", ...CATEGORIES].map((cat) => (
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
            <p className="text-zinc-600 text-sm">No products found</p>
            <button
              onClick={openAdd}
              className="text-white text-xs font-bold uppercase tracking-widest underline underline-offset-4 hover:no-underline"
            >
              Add your first product
            </button>
          </div>
        ) : (
          <>
            {/* ── Desktop table ── */}
            <table className="w-full hidden sm:table">
              <thead className="sticky top-0 bg-zinc-900 z-10 border-b border-zinc-800">
                <tr>
                  {["Product", "Category", "Price", "Stock", "Visibility", "Actions"].map((h) => (
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
                {filtered.map((product) => (
                  <tr
                    key={product.id}
                    className={`border-b border-zinc-800/40 hover:bg-zinc-800/30 transition-colors ${!product.visible ? "opacity-40" : ""}`}
                  >
                    {/* Product */}
                    <td className="px-4 py-3 pl-8">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded bg-zinc-800 shrink-0 overflow-hidden flex items-center justify-center border border-zinc-700/50">
                          {product.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={product.image} alt={product.title} className="w-full h-full object-contain p-1.5" />
                          ) : (
                            <span className="material-symbols-outlined text-zinc-600" style={{ fontSize: "20px" }}>image</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-white text-sm font-semibold truncate">{product.title}</p>
                            {product.badge && (
                              <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-zinc-700 text-zinc-300 rounded shrink-0">
                                {product.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-zinc-600 text-[10px] font-mono tracking-widest">{product.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-zinc-400 text-xs font-semibold uppercase tracking-wide">{product.category}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-white text-sm font-light">Gs. {Number(product.price).toLocaleString("es-PY")}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded ${product.stock === 0 ? "text-red-400 bg-red-950" : product.stock < 5 ? "text-amber-400 bg-amber-950" : "text-emerald-400 bg-emerald-950"}`}>
                        {product.stock === 0 ? "Out of Stock" : `${product.stock} units`}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleVisibility(product.id)}
                        className={`flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest px-3 py-1.5 rounded transition-all cursor-pointer ${product.visible ? "text-emerald-400 bg-emerald-950 hover:bg-emerald-900" : "text-zinc-600 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-400"}`}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
                          {product.visible ? "visibility" : "visibility_off"}
                        </span>
                        {product.visible ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-3 pr-8">
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => openEdit(product)} className="p-2 rounded text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all" title="Edit">
                          <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>edit</span>
                        </button>
                        {deleteConfirmId === product.id ? (
                          <div className="flex items-center gap-1 bg-red-950 border border-red-800 rounded px-2 py-1">
                            <span className="text-red-400 text-[9px] font-bold uppercase tracking-wide mr-1">Confirm?</span>
                            <button onClick={() => { deleteProduct(product.id); setDeleteConfirmId(null); }} className="text-red-400 hover:text-red-200 transition-colors">
                              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>check</span>
                            </button>
                            <button onClick={() => setDeleteConfirmId(null)} className="text-zinc-500 hover:text-white transition-colors">
                              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>close</span>
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setDeleteConfirmId(product.id)} className="p-2 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950 transition-all" title="Delete">
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* ── Mobile cards ── */}
            <div className="sm:hidden divide-y divide-zinc-800/60">
              {filtered.map((product) => (
                <div
                  key={product.id}
                  className={`px-4 py-4 flex items-center gap-3 ${!product.visible ? "opacity-40" : ""}`}
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded bg-zinc-800 shrink-0 overflow-hidden flex items-center justify-center border border-zinc-700/50">
                    {product.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.image} alt={product.title} className="w-full h-full object-contain p-1" />
                    ) : (
                      <span className="material-symbols-outlined text-zinc-600" style={{ fontSize: "22px" }}>image</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-semibold truncate">{product.title}</p>
                    <p className="text-zinc-500 text-[10px] font-mono">{product.sku}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <span className="text-zinc-300 text-xs font-light">
                        Gs. {Number(product.price).toLocaleString("es-PY")}
                      </span>
                      <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${product.stock === 0 ? "text-red-400 bg-red-950" : product.stock < 5 ? "text-amber-400 bg-amber-950" : "text-emerald-400 bg-emerald-950"}`}>
                        {product.stock === 0 ? "No stock" : `${product.stock}u`}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => toggleVisibility(product.id)}
                      className={`p-2 rounded transition-all ${product.visible ? "text-emerald-400 hover:bg-emerald-950" : "text-zinc-600 hover:bg-zinc-800"}`}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                        {product.visible ? "visibility" : "visibility_off"}
                      </span>
                    </button>
                    <button onClick={() => openEdit(product)} className="p-2 rounded text-zinc-500 hover:text-white hover:bg-zinc-700 transition-all">
                      <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>edit</span>
                    </button>
                    {deleteConfirmId === product.id ? (
                      <div className="flex items-center gap-1">
                        <button onClick={() => { deleteProduct(product.id); setDeleteConfirmId(null); }} className="p-2 text-red-400">
                          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>check</span>
                        </button>
                        <button onClick={() => setDeleteConfirmId(null)} className="p-2 text-zinc-500">
                          <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>close</span>
                        </button>
                      </div>
                    ) : (
                      <button onClick={() => setDeleteConfirmId(product.id)} className="p-2 rounded text-zinc-500 hover:text-red-400 hover:bg-red-950 transition-all">
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>delete</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
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
                  {editingId ? "EDITING PRODUCT" : "NEW PRODUCT"}
                </p>
                <h2 className="text-white text-lg font-black tracking-tight">
                  {editingId ? "Edit Product" : "Add Product"}
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
                  Product Image
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
                        Uploading to Cloud...
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
                        {isDragging ? "Drop image here" : "Drag & drop or click to upload"}
                      </p>
                      <p className="text-[10px] text-zinc-700">PNG, JPG, WEBP — or paste URL below</p>
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
                  placeholder="Or paste image URL..."
                  value={form.image.startsWith("data:") ? "" : form.image}
                  onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                  className="mt-2 w-full bg-zinc-800 border border-zinc-700 text-zinc-300 text-xs px-4 py-2.5 rounded outline-none focus:border-zinc-500 transition-colors placeholder-zinc-700"
                />
              </div>

              {/* Product Name */}
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Product Name <span className="text-red-500">*</span>
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
                  Brand / Manufacturer
                </label>
                <input
                  type="text"
                  placeholder="e.g. MONOLITH, SONY, APPLE"
                  value={form.brand}
                  onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value.toUpperCase() }))}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded outline-none focus:border-zinc-400 transition-colors placeholder-zinc-700 uppercase tracking-widest"
                />
              </div>

              {/* SKU + Category */}
              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                    Category
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded outline-none focus:border-zinc-400 transition-colors"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                    Price (PYG) <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                      Gs.
                    </span>
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
                    Stock Units
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

              {/* Badge + Tags */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                    Badge Label
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
                    Tags (comma-separated)
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
                      Feature globally as "Best Seller" on Homepage
                    </label>
                  </div>
                </div>

              </div>

              {/* Description */}
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Description
                </label>
                <textarea
                  rows={4}
                  placeholder="Product description..."
                  value={form.description}
                  onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-4 py-3 rounded outline-none focus:border-zinc-400 transition-colors placeholder-zinc-700 resize-none"
                />
              </div>

              {/* Visibility toggle */}
              <div className="flex items-center justify-between py-4 px-5 bg-zinc-800 rounded border border-zinc-700">
                <div>
                  <p className="text-white text-xs font-bold uppercase tracking-widest">
                    Visibility
                  </p>
                  <p className="text-zinc-500 text-[10px] mt-0.5">
                    {form.visible ? "Visible to customers" : "Hidden from store"}
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
                Cancel
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
                {isSaving ? "Saving..." : editingId ? "Save Changes" : "Add Product"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
