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
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
  </svg>
);

export default function Footer() {
  const { settings, initialized } = useStorefront();

  if (!initialized) return null;

  return (
    <footer className="bg-[#0a0a0a] text-white border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 px-5 sm:px-8 md:px-12 py-12 sm:py-16 md:py-20 w-full max-w-[1920px] mx-auto">
        {/* Brand */}
        <div className="space-y-8">
          <Link
            href="/"
            className="text-lg font-black text-white uppercase tracking-tighter block hover:opacity-70 transition-opacity"
          >
            PIXELL IMPORT
          </Link>
          <p className="font-inter text-[10px] uppercase tracking-widest font-medium text-white/40 max-w-sm leading-loose">
            {settings.footerText}
          </p>
          <div className="flex gap-5">
            <a
              href={settings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
              aria-label="Instagram"
            >
              <InstagramIcon />
            </a>
            <a
              href={settings.tiktokUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white/30 transition-all"
              aria-label="TikTok"
            >
              <TiktokIcon />
            </a>
            <a
              href={settings.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-[#25D366] hover:border-[#25D366]/40 transition-all"
              aria-label="WhatsApp"
            >
              <WhatsappIcon />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-white mb-2">
              Navigate
            </p>
            {footerNav.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="font-inter text-[10px] uppercase tracking-widest font-medium text-white/40 hover:text-white underline-offset-4 hover:underline transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-white mb-2">
              Legal & Support
            </p>
            {legalLinks.map(({ href, label }) => (
              <Link
                key={label}
                href={href}
                className="font-inter text-[10px] uppercase tracking-widest font-medium text-white/40 hover:text-white underline-offset-4 hover:underline transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="px-5 sm:px-8 md:px-12 pb-8 w-full max-w-[1920px] mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-t border-white/5 pt-6">
        <p className="font-inter text-[10px] uppercase tracking-widest font-medium text-white/25">
          © {new Date().getFullYear()} PIXELL IMPORT. ALL RIGHTS RESERVED.
        </p>
        <div className="flex items-center gap-3 text-white/25">
          <span className="material-symbols-outlined text-sm">globe</span>
          <p className="text-[10px] font-bold uppercase tracking-widest">
            Global / EN
          </p>
        </div>
      </div>
    </footer>
  );
}
