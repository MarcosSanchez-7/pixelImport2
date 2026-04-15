"use client";

import { useState } from "react";
import { useStorefront } from "@/context/StorefrontContext";

export default function GeneralSettingsPage() {
  const { settings, updateSettings, initialized } = useStorefront();
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  if (initialized && formData === null) {
    setFormData(settings);
  }

  if (!initialized || !formData) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    updateSettings(formData);
    setTimeout(() => {
      setIsSaving(false);
      setSuccessMsg("Ajustes guardados correctamente.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-900">
      <div className="px-4 sm:px-8 py-5 sm:py-7 border-b border-zinc-800 flex justify-between items-center gap-4 bg-zinc-950/50 sticky top-0 z-10 backdrop-blur-md">
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">
            Configuración
          </p>
          <h1 className="text-white text-xl sm:text-2xl font-black tracking-tight">
            Ajustes
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-white text-black px-4 sm:px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 shrink-0"
        >
          {isSaving ? "Guardando..." : "Guardar Ajustes"}
        </button>
      </div>

      <div className="p-4 sm:p-8 max-w-4xl space-y-6 sm:space-y-8">
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 text-sm font-semibold flex items-center gap-2 rounded">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* General Texts */}
          <div className="bg-zinc-800 p-5 sm:p-8 rounded border border-zinc-700/50">
            <h2 className="text-white text-sm font-black uppercase tracking-widest border-b border-zinc-700 pb-4 mb-6">
              General / Textos
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Descripción del Footer
                </label>
                <textarea
                  name="footerText"
                  value={formData.footerText}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors resize-none"
                  placeholder="Descripción de la empresa en el footer"
                />
                <p className="text-zinc-500 text-[10px] mt-2 leading-relaxed">
                  Aparece en la parte inferior izquierda de cada página, debajo del logo.
                </p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-zinc-800 p-5 sm:p-8 rounded border border-zinc-700/50">
            <h2 className="text-white text-sm font-black uppercase tracking-widest border-b border-zinc-700 pb-4 mb-6">
              Redes Sociales
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  URL de Instagram
                </label>
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors"
                  placeholder="https://instagram.com/tuperfil"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  URL de TikTok
                </label>
                <input
                  type="url"
                  name="tiktokUrl"
                  value={formData.tiktokUrl}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors"
                  placeholder="https://tiktok.com/@tuperfil"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  URL de WhatsApp
                </label>
                <input
                  type="url"
                  name="whatsappUrl"
                  value={formData.whatsappUrl}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors"
                  placeholder="https://wa.me/595981000000"
                />
                <p className="text-zinc-500 text-[10px] mt-2">
                  Formato: https://wa.me/CódigoPaísTeléfono — Ej: https://wa.me/595981000000
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
