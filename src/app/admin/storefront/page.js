"use client";

import { useState } from "react";
import { useStorefront } from "@/context/StorefrontContext";

export default function StorefrontConfigPage() {
  const { settings, updateSettings, initialized } = useStorefront();
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Initialize form once context provides settings
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
      setSuccessMsg("Settings applied successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-900">
      <div className="px-4 sm:px-8 py-5 sm:py-7 border-b border-zinc-800 flex justify-between items-center gap-4 bg-zinc-950/50 sticky top-0 z-10 backdrop-blur-md">
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">
            Visual Config
          </p>
          <h1 className="text-white text-xl sm:text-2xl font-black tracking-tight">
            Storefront
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-white text-black px-4 sm:px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50 shrink-0"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="p-4 sm:p-8 max-w-4xl">
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 text-sm font-semibold mb-6 flex items-center gap-2 rounded">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          <div className="bg-zinc-800 p-5 sm:p-8 rounded border border-zinc-700/50">
            <h2 className="text-white text-sm font-black uppercase tracking-widest border-b border-zinc-700 pb-4 mb-6">
              Hero Section
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Promo Badge
                </label>
                <input
                  type="text"
                  name="promoBadge"
                  value={formData.promoBadge}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors"
                  placeholder="e.g. NEW ARRIVAL"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Hero Title
                </label>
                <input
                  type="text"
                  name="heroTitle"
                  value={formData.heroTitle}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors font-bold"
                  placeholder="Hero main headline"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Hero Subtitle
                </label>
                <textarea
                  name="heroSubtitle"
                  value={formData.heroSubtitle}
                  onChange={handleChange}
                  rows={3}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors resize-none"
                  placeholder="Hero description"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Hero Image URL
                </label>
                <input
                  type="url"
                  name="heroImage"
                  value={formData.heroImage}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors"
                  placeholder="https://..."
                />
                {formData.heroImage && (
                  <div className="mt-4 w-full h-48 bg-zinc-900 border border-zinc-700 rounded overflow-hidden flex items-center justify-center p-2 relative">
                     {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={formData.heroImage}
                      alt="Hero Preview"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-zinc-800 p-5 sm:p-8 rounded border border-zinc-700/50">
            <h2 className="text-white text-sm font-black uppercase tracking-widest border-b border-zinc-700 pb-4 mb-6">
              Global Marquee
            </h2>
            <div>
              <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                Marquee Text
              </label>
              <textarea
                name="marqueeText"
                value={formData.marqueeText}
                onChange={handleChange}
                rows={2}
                className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors uppercase"
                placeholder="FREE SHIPPING ON ALL ORDERS..."
              />
              <p className="text-zinc-500 text-[10px] mt-2">
                Leave blank to hide the scrolling marquee.
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
