import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center bg-[var(--color-surface)] px-8 pt-32">
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] text-[var(--color-outline)] font-bold mb-4">
            ERROR // 404
          </p>
          <h1 className="text-[8rem] font-black tracking-tighter leading-none mb-6 text-[var(--color-surface-container-highest)]">
            404
          </h1>
          <p className="text-[var(--color-on-surface-variant)] mb-12 text-lg">
            This import could not be located.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-3 bg-[var(--color-primary)] text-[var(--color-on-primary)] px-10 py-4 text-xs font-bold uppercase tracking-widest hover:bg-[var(--color-primary-container)] transition-colors active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Return to Home
          </Link>
        </div>
      </main>
    </>
  );
}
