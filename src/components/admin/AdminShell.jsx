"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminShell({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Page title from pathname
  const titles = {
    "/admin": "Panel",
    "/admin/products": "Productos",
    "/admin/categories": "Categorías",
    "/admin/storefront": "Tienda",
    "/admin/settings": "Ajustes",
    "/admin/media": "Multimedia",
    "/admin/orders": "Pedidos",
  };
  const pageTitle = titles[pathname] ?? "Admin";

  return (
    <div className="min-h-screen bg-zinc-900 flex">
      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-60 min-h-screen flex flex-col min-w-0">
        {/* Mobile top bar */}
        <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-zinc-950 border-b border-zinc-800 sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-9 h-9 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 rounded transition-all"
            aria-label="Open menu"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>menu</span>
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 bg-white flex items-center justify-center shrink-0">
              <span className="text-black font-black text-[9px]">PX</span>
            </div>
            <span className="text-white font-black text-sm tracking-tight uppercase">
              {pageTitle}
            </span>
          </div>
        </div>

        {children}
      </div>
    </div>
  );
}
