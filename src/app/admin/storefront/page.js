"use client";

import { useState } from "react";
import { useStorefront } from "@/context/StorefrontContext";

function SlideCard({ slide, index, total, onChange, onDelete, onMove }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-zinc-800 border border-zinc-700/50 rounded overflow-hidden">
      {/* Header row */}
      <div className="flex items-center gap-3 px-4 py-3">
        {/* Thumbnail */}
        <div className="w-16 h-10 bg-zinc-900 rounded overflow-hidden shrink-0 border border-zinc-700">
          {slide.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={slide.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="material-symbols-outlined text-zinc-600" style={{ fontSize: "18px" }}>image</span>
            </div>
          )}
        </div>

        {/* Title + badge */}
        <div className="flex-1 min-w-0">
          <p className="text-white text-xs font-bold truncate leading-tight">
            {slide.title?.replace(/\n/g, " ") || <span className="text-zinc-500 font-normal">Sin título</span>}
          </p>
          {slide.badge && (
            <p className="text-zinc-500 text-[10px] uppercase tracking-widest truncate mt-0.5">{slide.badge}</p>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={() => onMove(index, -1)}
            disabled={index === 0}
            className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            aria-label="Subir"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_upward</span>
          </button>
          <button
            onClick={() => onMove(index, 1)}
            disabled={index === total - 1}
            className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
            aria-label="Bajar"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>arrow_downward</span>
          </button>
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-7 h-7 flex items-center justify-center text-zinc-400 hover:text-white transition-colors"
            aria-label={expanded ? "Colapsar" : "Editar"}
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
              {expanded ? "expand_less" : "edit"}
            </span>
          </button>
          <button
            onClick={() => onDelete(index)}
            className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-red-400 transition-colors"
            aria-label="Eliminar slide"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
          </button>
        </div>
      </div>

      {/* Expanded form */}
      {expanded && (
        <div className="border-t border-zinc-700 px-4 py-5 space-y-4 bg-zinc-900/40">
          {/* Image URL */}
          <div>
            <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
              URL de Imagen
            </label>
            <input
              type="url"
              value={slide.image || ""}
              onChange={(e) => onChange(index, "image", e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2.5 text-white text-sm outline-none focus:border-white transition-colors"
              placeholder="https://..."
            />
            {slide.image && (
              <div className="mt-3 w-full h-40 bg-zinc-900 border border-zinc-700 rounded overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={slide.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>

          {/* Badge */}
          <div>
            <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
              Etiqueta (Badge)
            </label>
            <input
              type="text"
              value={slide.badge || ""}
              onChange={(e) => onChange(index, "badge", e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2.5 text-white text-sm outline-none focus:border-white transition-colors uppercase"
              placeholder="NUEVA COLECCIÓN"
            />
          </div>

          {/* Title */}
          <div>
            <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
              Título
            </label>
            <textarea
              value={slide.title || ""}
              onChange={(e) => onChange(index, "title", e.target.value)}
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2.5 text-white text-sm outline-none focus:border-white transition-colors resize-none font-bold uppercase"
              placeholder={"LÍNEA PRINCIPAL\nSEGUNDA LÍNEA"}
            />
            <p className="text-zinc-500 text-[10px] mt-1">Usá saltos de línea para dividir el título en dos líneas.</p>
          </div>

          {/* Subtitle */}
          <div>
            <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-1.5">
              Subtítulo
            </label>
            <textarea
              value={slide.subtitle || ""}
              onChange={(e) => onChange(index, "subtitle", e.target.value)}
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-3 py-2.5 text-white text-sm outline-none focus:border-white transition-colors resize-none"
              placeholder="Descripción breve del slide..."
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function StorefrontConfigPage() {
  const { settings, updateSettings, initialized } = useStorefront();
  const [slides, setSlides] = useState(null);
  const [marqueeText, setMarqueeText] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (initialized && slides === null) {
    setSlides(settings.heroSlides ? [...settings.heroSlides] : []);
    setMarqueeText(settings.marqueeText ?? "");
  }

  if (!initialized || slides === null) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleSlideChange = (index, field, value) => {
    setSlides((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleDelete = (index) => {
    setSlides((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMove = (index, dir) => {
    setSlides((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleAddSlide = () => {
    setSlides((prev) => [
      ...prev,
      {
        id: `slide-${Date.now()}`,
        image: "",
        badge: "",
        title: "",
        subtitle: "",
      },
    ]);
  };

  const handleSave = () => {
    setIsSaving(true);
    updateSettings({ heroSlides: slides, marqueeText });
    setTimeout(() => {
      setIsSaving(false);
      setSuccessMsg("Cambios guardados correctamente.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-900">
      {/* Sticky header */}
      <div className="px-4 sm:px-8 py-5 sm:py-7 border-b border-zinc-800 flex justify-between items-center gap-4 bg-zinc-950/50 sticky top-0 z-10 backdrop-blur-md">
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">
            Config. Visual
          </p>
          <h1 className="text-white text-xl sm:text-2xl font-black tracking-tight">
            Tienda
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-white text-black px-4 sm:px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 shrink-0"
        >
          {isSaving ? "Guardando..." : "Guardar Cambios"}
        </button>
      </div>

      <div className="p-4 sm:p-8 max-w-4xl space-y-8">
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 text-sm font-semibold flex items-center gap-2 rounded">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {successMsg}
          </div>
        )}

        {/* Hero Slides */}
        <div className="bg-zinc-800/50 p-5 sm:p-8 rounded border border-zinc-700/50">
          <div className="flex items-center justify-between border-b border-zinc-700 pb-4 mb-6">
            <h2 className="text-white text-sm font-black uppercase tracking-widest">
              Slides del Hero
            </h2>
            <button
              onClick={handleAddSlide}
              className="flex items-center gap-1.5 bg-white text-black px-3 py-1.5 text-[10px] font-black uppercase tracking-widest hover:bg-zinc-200 transition-colors"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>add</span>
              Agregar Slide
            </button>
          </div>

          {slides.length === 0 ? (
            <div className="text-center py-10 border border-dashed border-zinc-700 rounded">
              <span className="material-symbols-outlined text-zinc-600 block mb-2" style={{ fontSize: "36px" }}>
                slideshow
              </span>
              <p className="text-zinc-500 text-sm">No hay slides. Agregá uno para empezar.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {slides.map((slide, i) => (
                <SlideCard
                  key={slide.id || i}
                  slide={slide}
                  index={i}
                  total={slides.length}
                  onChange={handleSlideChange}
                  onDelete={handleDelete}
                  onMove={handleMove}
                />
              ))}
            </div>
          )}

          <p className="text-zinc-600 text-[10px] mt-4 leading-relaxed">
            Los slides rotan automáticamente cada 5 segundos. El orden en esta lista es el orden en el que aparecen.
          </p>
        </div>

        {/* Marquee */}
        <div className="bg-zinc-800/50 p-5 sm:p-8 rounded border border-zinc-700/50">
          <h2 className="text-white text-sm font-black uppercase tracking-widest border-b border-zinc-700 pb-4 mb-6">
            Marquee Global
          </h2>
          <div>
            <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
              Texto Marquee
            </label>
            <textarea
              value={marqueeText}
              onChange={(e) => setMarqueeText(e.target.value)}
              rows={2}
              className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors uppercase resize-none"
              placeholder="ENVÍO GRATIS EN PEDIDOS MAYORES A Gs. 500.000..."
            />
            <p className="text-zinc-500 text-[10px] mt-2">
              Dejar vacío para ocultar el marquee.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
