import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StorefrontHero from "@/components/StorefrontHero";

export const metadata = {
  title: "Home",
  description:
    "Direct imports of hyper-refined technology. No middleman. No noise. Just the pure essence of silicon and glass.",
};

import BestSellersSection from "@/components/BestSellersSection";

const reviews = [
  {
    text: '"The build quality is unlike anything available in retail. It feels substantial, purposeful, and permanent."',
    name: "Marcus V.",
    role: "Lead Industrial Designer",
  },
  {
    text: '"Pixel Import has become my primary source for hardware. Their curation is flawless and the delivery is surgical."',
    name: "Elena K.",
    role: "System Architect",
  },
  {
    text: '"Finally, an importer that values aesthetics as much as performance. The packaging alone is a work of art."',
    name: "Julian T.",
    role: "Creative Director",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <StorefrontHero />

        {/* ── Best Sellers ── */}
        <BestSellersSection />

        {/* ── Featured Product ── */}
        <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-8 bg-[var(--color-surface)]">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="relative aspect-square bg-[var(--color-surface-container-high)] overflow-hidden">
                <Image
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC6DnQNiz4bMXH-AghSMP_30u00zjmme5OqdR-tCyxmemnOsax9qBrccMCl31KBt_iuMn2XGypIIFP3EUAfLN5YASyXNEmIR9YnTWRSIfYK1VO5i0Ym3-hbUIzFN2o3VaRzBUaaWPjwagLuEnMJaz4MrIE82pGVwpHNZckL3Rs2m0gYshvzpo9SwMPEXoXGd0D_TL-YZcIi43JJWaNXPFavb_NY4yK9hxKPdRwSquQHmOpozJ-uwpDWwYBNGbl0j4AKTm9mGKPQAHuL"
                  alt="Macro close-up of high-end camera lens details"
                  fill
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 p-5 sm:p-8 lg:p-12 bg-white/40 backdrop-blur-md max-w-xs">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] mb-2">
                    Import Origin
                  </p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] italic">
                    &ldquo;The clarity of this lens exceeds any consumer-grade
                    optics we&apos;ve tested in a decade.&rdquo;
                  </p>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] font-bold mb-3 block">
                NEW ARRIVAL
              </span>
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-5 sm:mb-8 leading-[0.95]">
                OPTIC-V
                <br />
                CINEMA RIG
              </h2>
              <p className="text-[var(--color-on-surface-variant)] text-base sm:text-lg leading-relaxed mb-8 sm:mb-10">
                Engineered for those who see what others miss. The Optic-V
                offers a 12K sensor in a chassis that weighs less than a
                standard DSLR. Milled from a single block of aerospace aluminum.
              </p>
              <div className="grid grid-cols-2 gap-5 sm:gap-8 mb-8 sm:mb-10">
                {[
                  { label: "Sensor", value: "Full Frame 12K" },
                  { label: "Dynamic Range", value: "16+ Stops" },
                  { label: "Mount", value: "Universal L-Mount" },
                  { label: "Weight", value: "840g Body Only" },
                ].map(({ label, value }) => (
                  <div key={label}>
                    <p className="text-xs font-bold uppercase tracking-widest text-[var(--color-outline)] mb-1">
                      {label}
                    </p>
                    <p className="text-sm font-medium uppercase">{value}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/products/optic-v-cinema-rig"
                className="w-full border border-[var(--color-primary)] py-4 sm:py-5 text-xs font-black uppercase tracking-[0.3em] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-all duration-300 flex items-center justify-center"
              >
                Explore Configuration
              </Link>
            </div>
          </div>
        </section>

        {/* ── Reviews ── */}
        <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-8 bg-[var(--color-surface-container-high)]">
          <div className="max-w-[1920px] mx-auto">
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-outline)] mb-3 block">
                Verification // Community
              </span>
              <p className="text-2xl sm:text-4xl font-black uppercase tracking-tighter">
                Trusted by Architects of Tech
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {reviews.map(({ text, name, role }) => (
                <div
                  key={name}
                  className="bg-[var(--color-surface)] p-7 sm:p-10 border-l-2 border-[var(--color-primary)] hover:shadow-md transition-shadow duration-300"
                >
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="material-symbols-outlined"
                        style={{ fontVariationSettings: "'FILL' 1", fontSize: "14px" }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-sm sm:text-base leading-relaxed mb-6 italic text-[var(--color-on-surface-variant)]">{text}</p>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest">
                      {name}
                    </p>
                    <p className="text-[9px] text-[var(--color-outline)] uppercase mt-1 tracking-widest">
                      {role}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
