import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { notFound } from "next/navigation";

const products = {
  "monolith-display-32": {
    id: "monolith-display-32",
    title: 'Monolith Display 32"',
    price: "$1,299",
    badge: "Limited",
    category: "Displays",
    description:
      "The Monolith Display redefines what a monitor can be. With its near-borderless 4K OLED panel and a 240Hz refresh rate, every frame is rendered with surgical precision. The ultra-thin chassis is milled from a single block of aircraft-grade aluminum.",
    specs: [
      { label: "Panel", value: "4K OLED" },
      { label: "Refresh Rate", value: "240Hz" },
      { label: "Response Time", value: "0.1ms GtG" },
      { label: "Brightness", value: "1000 nit peak" },
      { label: "Color Gamut", value: "99% DCI-P3" },
      { label: "Connectivity", value: "2x HDMI 2.1 / 2x DP 2.0" },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDo8bWOkhiR5Ca2EEI80k2kObk0tJbHjf-kn0MhbHkAN_XFE88_O2mMMi-94zJqgMtN3q5eIlru0iv9Q-VsM22I5Jw12FGfpFpOHaCHvzFo0ze0k8G2ljTmjYMRw7bupy6hS1X2sd0xuBGVE911skt4Yat7Khu9EDmREj5VrIvklZAS5xC1J4XgwbNbOukVmPf4uaEaX0FuIVqz2I9lXToVI2chr1N8P0_WH6eQlEtq8_2Oz1ELvNYHk4HV0WvGQOuY3Gd9bplWLo2R",
    alt: "Monolith Display 32 inch professional monitor",
  },
  "audio-core-x": {
    id: "audio-core-x",
    title: "Audio Core X",
    price: "$349",
    category: "Audio",
    description:
      "The Audio Core X is the result of obsessive acoustic engineering. Active noise cancellation that eliminates up to 40dB of ambient sound, paired with 48 hours of battery life and a driver system tuned for uncompromising clarity.",
    specs: [
      { label: "ANC", value: "Up to -40dB" },
      { label: "Battery Life", value: "48 Hours" },
      { label: "Driver Size", value: "40mm Dynamic" },
      { label: "Frequency Response", value: "4Hz – 40kHz" },
      { label: "Codec", value: "LDAC / AAC / SBC" },
      { label: "Weight", value: "254g" },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqygxONwdhp-RngHi7fMRQ14pDE2p5kwZ78-sHpB6g2w2gD8jKalP-e4by6h9vgCfTMn-4NskghoHir77cCJXSitZl9abMbnYmJiNrO5m7pkMPovt_NE8CZB4pQlWRp-LMlvX6EoXpMH9tiW4hI8ZEjY5v4rb5BtbTiqaP7LOeboHHaQkfJMcnYaNH6XvsGKvG8ozk5yJpNI8eTyHmzJK4eWjdryZaHxFiJ2kY9RYPXsdogoA0F5cfNeXvLWt-E5JsYGFlDHHBrrPI",
    alt: "Audio Core X headphones",
  },
  "optic-v-cinema-rig": {
    id: "optic-v-cinema-rig",
    title: "Optic-V Cinema Rig",
    price: "$4,299",
    badge: "New",
    category: "Cameras",
    description:
      "Engineered for those who see what others miss. The Optic-V offers a 12K sensor in a chassis that weighs less than a standard DSLR. Milled from a single block of aerospace aluminum.",
    specs: [
      { label: "Sensor", value: "Full Frame 12K" },
      { label: "Dynamic Range", value: "16+ Stops" },
      { label: "Mount", value: "Universal L-Mount" },
      { label: "Weight", value: "840g Body Only" },
      { label: "Recording Format", value: "RAW / ProRes 422 HQ" },
      { label: "ISO Range", value: "100 – 25,600" },
    ],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC6DnQNiz4bMXH-AghSMP_30u00zjmme5OqdR-tCyxmemnOsax9qBrccMCl31KBt_iuMn2XGypIIFP3EUAfLN5YASyXNEmIR9YnTWRSIfYK1VO5i0Ym3-hbUIzFN2o3VaRzBUaaWPjwagLuEnMJaz4MrIE82pGVwpHNZckL3Rs2m0gYshvzpo9SwMPEXoXGd0D_TL-YZcIi43JJWaNXPFavb_NY4yK9hxKPdRwSquQHmOpozJ-uwpDWwYBNGbl0j4AKTm9mGKPQAHuL",
    alt: "Optic-V Cinema Rig camera",
  },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = products[slug];
  if (!product) return { title: "Not Found" };
  return {
    title: product.title,
    description: product.description,
  };
}

export async function generateStaticParams() {
  return Object.keys(products).map((slug) => ({ slug }));
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = products[slug];

  if (!product) notFound();

  return (
    <>
      <Navbar />
      <main className="pt-32">
        {/* Breadcrumb */}
        <div className="px-8 py-4 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)]/20">
          <div className="max-w-[1920px] mx-auto flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[var(--color-outline)]">
            <Link href="/" className="hover:text-[var(--color-on-surface)] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-[var(--color-on-surface)] transition-colors">Imports</Link>
            <span>/</span>
            <span className="text-[var(--color-on-surface)]">{product.title}</span>
          </div>
        </div>

        {/* Product Detail */}
        <section className="py-20 px-8 bg-[var(--color-surface)]">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
            {/* Image */}
            <div className="relative aspect-square bg-[var(--color-surface-container-lowest)] overflow-hidden">
              <Image
                src={product.image}
                alt={product.alt}
                fill
                className="object-contain p-12"
                priority
              />
              {product.badge && (
                <span className="absolute top-6 left-6 bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[9px] px-3 py-1 font-bold tracking-widest uppercase">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Info */}
            <div className="lg:pt-8">
              <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--color-outline)] mb-2 block">
                {product.category}
              </span>
              <h1 className="text-5xl font-black tracking-tighter uppercase mb-6 leading-tight">
                {product.title}
              </h1>
              <p className="text-3xl font-light mb-8">{product.price}</p>
              <p className="text-[var(--color-on-surface-variant)] leading-relaxed mb-12 text-base">
                {product.description}
              </p>

              {/* Specs */}
              <div className="border-t border-[var(--color-outline-variant)]/30 pt-8 mb-12">
                <p className="text-[10px] font-black uppercase tracking-widest mb-6">
                  Technical Specifications
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {product.specs.map(({ label, value }) => (
                    <div key={label} className="py-3 border-b border-[var(--color-outline-variant)]/20">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-outline)] mb-1">
                        {label}
                      </p>
                      <p className="text-sm font-medium uppercase">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-4">
                <button className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-6 text-xs font-black uppercase tracking-[0.3em] hover:bg-[var(--color-primary-container)] transition-colors active:scale-[0.98] duration-150 flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-sm">shopping_cart</span>
                  Add to Cart
                </button>
                <button className="w-full border border-[var(--color-primary)] py-6 text-xs font-black uppercase tracking-[0.3em] hover:bg-[var(--color-primary)] hover:text-[var(--color-on-primary)] transition-all duration-300 flex items-center justify-center gap-3">
                  <span className="material-symbols-outlined text-sm">favorite</span>
                  Add to Wishlist
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
