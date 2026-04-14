"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);
  const prevItemCount = useRef(itemCount);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Cart bounce animation
  useEffect(() => {
    if (itemCount > prevItemCount.current) {
      setCartBounce(true);
      const t = setTimeout(() => setCartBounce(false), 500);
      return () => clearTimeout(t);
    }
    prevItemCount.current = itemCount;
  }, [itemCount]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/products?q=${encodeURIComponent(search.trim())}`);
      setSearch("");
      setMenuOpen(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-xl border-b border-black/8 shadow-sm">
        <div className="flex justify-between items-center px-4 sm:px-8 py-4 w-full max-w-[1920px] mx-auto">

          {/* Logo */}
          <Link
            href="/"
            className="text-base sm:text-xl font-black tracking-tighter text-black uppercase hover:opacity-70 transition-opacity shrink-0"
          >
            PIXELL IMPORT
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8">
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
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

          {/* Right actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Search — desktop only */}
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
              className="relative w-10 h-10 flex items-center justify-center text-zinc-800 hover:text-black hover:bg-zinc-100 rounded-full transition-all duration-200 active:scale-95"
              aria-label="Favoritos"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontSize: "22px", fontVariationSettings: "'FILL' 0, 'wght' 400" }}
              >
                favorite
              </span>
              {favCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-black text-white text-[8px] min-w-[16px] h-4 px-0.5 flex items-center justify-center font-black rounded-full">
                  {favCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <button
              onClick={openCart}
              className="relative w-10 h-10 flex items-center justify-center text-zinc-800 hover:text-black hover:bg-zinc-100 rounded-full transition-all duration-200 active:scale-95"
              aria-label="Carrito"
            >
              <span
                className={`material-symbols-outlined transition-transform ${cartBounce ? "animate-[cartBounce_0.5s_ease]" : ""}`}
                style={{ fontSize: "22px", fontVariationSettings: "'FILL' 0, 'wght' 400" }}
              >
                shopping_cart
              </span>
              {itemCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-black text-white text-[8px] min-w-[16px] h-4 px-0.5 flex items-center justify-center font-black rounded-full">
                  {itemCount}
                </span>
              )}
            </button>

            {/* Hamburger — mobile only */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden w-10 h-10 flex items-center justify-center text-zinc-800 hover:bg-zinc-100 rounded-full transition-all duration-200"
              aria-label="Menu"
            >
              <span className="material-symbols-outlined" style={{ fontSize: "24px" }}>
                {menuOpen ? "close" : "menu"}
              </span>
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-zinc-100 px-4 py-4 flex flex-col gap-1">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="relative mb-3">
              <span
                className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                style={{ fontSize: "16px" }}
              >
                search
              </span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="SEARCH CATALOGUE"
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-black text-[10px] tracking-widest uppercase pl-9 pr-4 py-2.5 outline-none transition-all rounded"
              />
            </form>
            {navLinks.map(({ href, label }) => {
              const isActive = pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`py-3 px-2 text-sm font-bold uppercase tracking-widest border-b border-zinc-50 transition-colors ${
                    isActive ? "text-black" : "text-zinc-500"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        )}
      </nav>
    </>
  );
}
