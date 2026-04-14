import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Specials",
  description: "Exclusive limited-edition drops and special imports.",
};

const specials = [
  {
    id: "monolith-display-32",
    title: 'Monolith Display 32"',
    originalPrice: "$1,599",
    price: "$1,299",
    badge: "22% OFF",
    endsIn: "48H LEFT",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDo8bWOkhiR5Ca2EEI80k2kObk0tJbHjf-kn0MhbHkAN_XFE88_O2mMMi-94zJqgMtN3q5eIlru0iv9Q-VsM22I5Jw12FGfpFpOHaCHvzFo0ze0k8G2ljTmjYMRw7bupy6hS1X2sd0xuBGVE911skt4Yat7Khu9EDmREj5VrIvklZAS5xC1J4XgwbNbOukVmPf4uaEaX0FuIVqz2I9lXToVI2chr1N8P0_WH6eQlEtq8_2Oz1ELvNYHk4HV0WvGQOuY3Gd9bplWLo2R",
    alt: "Monolith Display",
  },
  {
    id: "audio-core-x",
    title: "Audio Core X",
    originalPrice: "$449",
    price: "$349",
    badge: "BUNDLE DEAL",
    endsIn: "72H LEFT",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAqygxONwdhp-RngHi7fMRQ14pDE2p5kwZ78-sHpB6g2w2gD8jKalP-e4by6h9vgCfTMn-4NskghoHir77cCJXSitZl9abMbnYmJiNrO5m7pkMPovt_NE8CZB4pQlWRp-LMlvX6EoXpMH9tiW4hI8ZEjY5v4rb5BtbTiqaP7LOeboHHaQkfJMcnYaNH6XvsGKvG8ozk5yJpNI8eTyHmzJK4eWjdryZaHxFiJ2kY9RYPXsdogoA0F5cfNeXvLWt-E5JsYGFlDHHBrrPI",
    alt: "Audio Core X headphones",
  },
];

export default function SpecialsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        {/* Header */}
        <section className="px-8 py-20 bg-[var(--color-primary)] text-[var(--color-on-primary)]">
          <div className="max-w-[1920px] mx-auto">
            <span className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-bold mb-2 block">
              LIMITED TIME // DROPS
            </span>
            <h1 className="text-5xl font-black tracking-tighter uppercase">
              Specials
            </h1>
          </div>
        </section>

        {/* Specials grid */}
        <section className="py-20 px-8 bg-[var(--color-surface)]">
          <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
            {specials.map((item) => (
              <Link
                key={item.id}
                href={`/products/${item.id}`}
                className="group bg-[var(--color-surface-container-lowest)] flex items-center gap-8 p-8 hover:shadow-lg transition-shadow"
              >
                <div className="relative w-48 h-48 shrink-0">
                  <Image
                    src={item.image}
                    alt={item.alt}
                    fill
                    className="object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2">
                    <span className="bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[9px] px-3 py-1 font-bold tracking-widest uppercase">
                      {item.badge}
                    </span>
                    <span className="bg-[var(--color-error-container)] text-[var(--color-on-error-container)] text-[9px] px-3 py-1 font-bold tracking-widest uppercase">
                      {item.endsIn}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tighter">
                    {item.title}
                  </h2>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-light">{item.price}</span>
                    <span className="text-sm line-through text-[var(--color-outline)]">
                      {item.originalPrice}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
                    Shop Now
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
