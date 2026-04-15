import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StorefrontHero from "@/components/StorefrontHero";
import BestSellersSection from "@/components/BestSellersSection";
import CategorySections from "@/components/CategorySections";
import RevealOnScroll from "@/components/RevealOnScroll";

export const metadata = {
  title: "Inicio",
  description:
    "Importaciones directas de tecnología de alta gama. Sin intermediarios. Sin ruido. Solo lo mejor.",
};

const reviews = [
  {
    text: '"La calidad de construcción es diferente a todo lo disponible en el mercado local. Se siente sólido, preciso y permanente."',
    name: "Marcos V.",
    role: "Diseñador Industrial",
  },
  {
    text: '"Pixel Import se convirtió en mi fuente principal de hardware. Su selección es impecable y la entrega es exacta."',
    name: "Elena K.",
    role: "Arquitecta de Sistemas",
  },
  {
    text: '"Por fin un importador que valora la estética tanto como el rendimiento. El packaging solo ya es una obra de arte."',
    name: "Julián T.",
    role: "Director Creativo",
  },
];

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        {/* ── Hero ── */}
        <StorefrontHero />

        {/* ── Más Vendidos ── */}
        <BestSellersSection />

        {/* ── Secciones por categoría ── */}
        <CategorySections />

        {/* ── Reseñas ── */}
        <section className="py-12 sm:py-20 lg:py-24 px-4 sm:px-8 bg-[var(--color-surface-container-high)]">
          <div className="max-w-[1920px] mx-auto">
            <RevealOnScroll className="text-center mb-10 sm:mb-16">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--color-outline)] mb-3 block">
                Verificación // Comunidad
              </span>
              <p className="text-2xl sm:text-4xl font-black uppercase tracking-tighter">
                La confianza de nuestra comunidad
              </p>
            </RevealOnScroll>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {reviews.map(({ text, name, role }, i) => (
                <RevealOnScroll key={name} variant="scale" delay={i * 120}>
                  <div className="bg-[var(--color-surface)] p-7 sm:p-10 border-l-2 border-[var(--color-primary)] hover:shadow-md transition-shadow duration-300 h-full">
                    <div className="flex gap-0.5 mb-4">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <span
                          key={j}
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
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
