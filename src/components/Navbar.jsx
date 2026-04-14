"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useFavorites } from "@/context/FavoritesContext";

const navLinks = [
  { href: "/products", label: "Imports" },
  { href: "/specials", label: "Specials" },
  { href: "/inventory", label: "Inventory" },
  { href: "/archive", label: "Archive" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openCart } = useCart();
  const { count: favCount } = useFavorites();
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
    }
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-xl border-b border-[var(--color-outline-variant)]/15">
      <div className="flex justify-between items-center px-8 py-5 w-full max-w-[1920px] mx-auto">
        {/* Logo + links */}
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="text-xl font-black tracking-tighter text-black uppercase hover:opacity-70 transition-opacity"
          >
            PIXELL IMPORT
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(({ href, label }) => {
              const isActive =
                pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`tracking-tighter font-bold uppercase text-sm transition-colors ${
                    isActive
                      ? "text-black border-b-2 border-black pb-0.5"
                      : "text-zinc-500 hover:text-black"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Search + actions */}
        <div className="flex items-center gap-5">
          {/* Search form */}
          <form onSubmit={handleSearch} className="relative hidden lg:block">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)]"
              style={{ fontSize: "16px" }}
            >
              search
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH CATALOGUE"
              className="bg-zinc-50 border border-zinc-200 focus:border-black text-[10px] tracking-widest uppercase pl-9 pr-4 py-2 outline-none w-52 transition-all rounded"
            />
          </form>

          {/* Favorites */}
          <Link
            href="/favorites"
            className="relative hover:opacity-80 transition-opacity active:scale-95 duration-200"
            title="Favorites"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
              favorite
            </span>
            {favCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center font-black rounded-full">
                {favCount}
              </span>
            )}
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative hover:opacity-80 transition-opacity active:scale-95 duration-200"
            title="Cart"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "22px" }}>
              shopping_cart
            </span>
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-black text-white text-[8px] w-4 h-4 flex items-center justify-center font-black rounded-full">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
