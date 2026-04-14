"use client";

import Link from "next/link";
import { useStorefront } from "@/context/StorefrontContext";

const footerNav = [
  { href: "/products", label: "Imports" },
  { href: "/specials", label: "Specials" },
  { href: "/inventory", label: "Inventory" },
];

const legalLinks = [
  { href: "/terms", label: "Terms of Service" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/specs", label: "Technical Specs" },
  { href: "/support", label: "Support" },
];

// SVG icons for pure vanilla CSS usage (no external libs)
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const TiktokIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path>
  </svg>
);

const WhatsappIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

export default function Footer() {
  const { settings, initialized } = useStorefront();

  if (!initialized) return null;

  return (
    <footer className="bg-zinc-100 border-t-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-12 py-24 w-full max-w-[1920px] mx-auto">
        {/* Brand */}
        <div className="space-y-8">
          <Link
            href="/"
            className="text-lg font-black text-black uppercase tracking-tighter block hover:opacity-70 transition-opacity"
          >
            PIXELL IMPORT
          </Link>
          <p className="font-inter text-[10px] uppercase tracking-widest font-medium text-zinc-500 max-w-sm leading-loose">
            {settings.footerText}
          </p>
          <div className="flex gap-6">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-black transition-colors"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-black transition-colors"
              aria-label="TikTok"
            >
              <TiktokIcon />
            </a>
            <a
              href={settings.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-black transition-colors"
              aria-label="WhatsApp"
            >
              <WhatsappIcon />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-black mb-2">
              Navigate
            </p>
            {footerNav.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="font-inter text-[10px] uppercase tracking-widest font-medium text-zinc-500 hover:text-black underline-offset-4 hover:underline"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-black mb-2">
              Legal & Support
            </p>
            {legalLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="font-inter text-[10px] uppercase tracking-widest font-medium text-zinc-500 hover:text-black underline-offset-4 hover:underline"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-12 pb-12 w-full max-w-[1920px] mx-auto flex justify-between items-center border-t border-[var(--color-outline-variant)]/10 pt-8">
        <p className="font-inter text-[10px] uppercase tracking-widest font-medium text-zinc-400">
          © {new Date().getFullYear()} PIXELL IMPORT. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-4 text-zinc-400">
          <span className="material-symbols-outlined text-sm">globe</span>
          <p className="text-[10px] font-bold uppercase tracking-widest">
            Global / EN
          </p>
        </div>
      </div>
    </footer>
  );
}
