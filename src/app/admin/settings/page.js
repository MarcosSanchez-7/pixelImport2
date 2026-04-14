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
      setSuccessMsg("Settings updated successfully.");
      setTimeout(() => setSuccessMsg(""), 3000);
    }, 500);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-zinc-900">
      <div className="px-8 py-7 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50 sticky top-0 z-10 backdrop-blur-md">
        <div>
          <p className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold mb-1">
            Configuration
          </p>
          <h1 className="text-white text-2xl font-black tracking-tight">
            Settings
          </h1>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-white text-black px-6 py-2.5 text-xs font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="p-8 max-w-4xl space-y-8">
        {successMsg && (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-3 text-sm font-semibold flex items-center gap-2 rounded">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-8">
          {/* General Copy */}
          <div className="bg-zinc-800 p-8 rounded border border-zinc-700/50">
            <h2 className="text-white text-sm font-black uppercase tracking-widest border-b border-zinc-700 pb-4 mb-6 relative">
              General / Texts
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2">
                  Footer Description
                </label>
                <textarea
                  name="footerText"
                  value={formData.footerText}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors resize-none"
                  placeholder="Company description shown in footer"
                />
                <p className="text-zinc-500 text-[10px] mt-2 leading-relaxed">
                  This text appears at the bottom-left of every page below the logo.
                </p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-zinc-800 p-8 rounded border border-zinc-700/50">
            <h2 className="text-white text-sm font-black uppercase tracking-widest border-b border-zinc-700 pb-4 mb-6">
              Social Links
            </h2>
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2 flex items-center gap-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  name="instagramUrl"
                  value={formData.instagramUrl}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors"
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2 flex items-center gap-2">
                  TikTok URL
                </label>
                <input
                  type="url"
                  name="tiktokUrl"
                  value={formData.tiktokUrl}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors"
                  placeholder="https://tiktok.com/@yourprofile"
                />
              </div>

              <div>
                <label className="text-zinc-400 text-[10px] font-black uppercase tracking-widest block mb-2 flex items-center gap-2">
                  WhatsApp URL
                </label>
                <input
                  type="url"
                  name="whatsappUrl"
                  value={formData.whatsappUrl}
                  onChange={handleChange}
                  className="w-full bg-zinc-900 border border-zinc-700 rounded px-4 py-3 text-white text-sm outline-none focus:border-white transition-colors"
                  placeholder="https://wa.me/..."
                />
                <p className="text-zinc-500 text-[10px] mt-2">
                  Format typically: https://wa.me/CountryCodePhoneNumber (e.g. https://wa.me/595981000000)
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
