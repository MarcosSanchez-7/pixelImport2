"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "dashboard" },
  { href: "/admin/products", label: "Products", icon: "inventory_2" },
  { href: "/admin/storefront", label: "Storefront", icon: "web" },
  { href: "/admin/media", label: "Media", icon: "photo_library" },
  { href: "/admin/orders", label: "Orders", icon: "receipt_long" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-60 bg-zinc-950 border-r border-zinc-800 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-zinc-800">
        <Link href="/" className="flex items-center gap-3 group" target="_blank">
          <div className="w-8 h-8 bg-white flex items-center justify-center">
            <span className="text-black font-black text-xs">PX</span>
          </div>
          <div>
            <p className="text-white font-black text-xs tracking-widest uppercase leading-none">
              PIXELL
            </p>
            <p className="text-zinc-500 text-[9px] tracking-[0.2em] uppercase">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600 px-3 mb-3">
          Management
        </p>
        {navItems.map(({ href, label, icon }) => {
          const isActive =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-all duration-150 group ${
                isActive
                  ? "bg-white text-black"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800"
              }`}
            >
              <span
                className="material-symbols-outlined text-[18px]"
                style={{ fontSize: "18px" }}
              >
                {icon}
              </span>
              <span className="tracking-wide text-xs font-semibold uppercase tracking-widest">
                {label}
              </span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-black rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: View site + User */}
      <div className="px-3 py-4 border-t border-zinc-800 space-y-2">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all duration-150 text-xs font-semibold uppercase tracking-widest"
        >
          <span className="material-symbols-outlined text-[18px]" style={{ fontSize: "18px" }}>
            open_in_new
          </span>
          View Store
        </Link>
        <div className="flex items-center gap-3 px-3 py-3 rounded bg-zinc-900">
          <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
            <span className="text-white text-[10px] font-black">A</span>
          </div>
          <div className="min-w-0">
            <p className="text-white text-[11px] font-semibold truncate">Admin</p>
            <p className="text-zinc-500 text-[9px] truncate">admin@pixell.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
