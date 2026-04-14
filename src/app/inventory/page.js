import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Inventory",
  description: "Real-time inventory of all available PIXELL IMPORT stock.",
};

const inventoryItems = [
  { id: "monolith-display-32", title: 'Monolith Display 32"', sku: "PX-MON-32-OL", stock: 4, price: "$1,299", status: "low" },
  { id: "audio-core-x", title: "Audio Core X", sku: "PX-AUD-CX-BLK", stock: 23, price: "$349", status: "in-stock" },
  { id: "tactile-key-01", title: "Tactile Key-01", sku: "PX-KEY-T01-GY", stock: 11, price: "$189", status: "in-stock" },
  { id: "pulse-mouse", title: "Pulse Mouse", sku: "PX-MSE-PLS-WL", stock: 0, price: "$89", status: "out" },
  { id: "optic-v-cinema-rig", title: "Optic-V Cinema Rig", sku: "PX-CAM-OPV-12K", stock: 2, price: "$4,299", status: "low" },
  { id: "precision-laptop-mk2", title: "Precision Laptop MK2", sku: "PX-LPT-MK2-5N", stock: 7, price: "$2,199", status: "in-stock" },
];

const statusConfig = {
  "in-stock": { label: "In Stock", color: "text-emerald-700 bg-emerald-50" },
  low: { label: "Low Stock", color: "text-amber-700 bg-amber-50" },
  out: { label: "Out of Stock", color: "text-red-700 bg-red-50" },
};

export default function InventoryPage() {
  return (
    <>
      <Navbar />
      <main className="pt-32">
        {/* Header */}
        <section className="px-8 py-20 bg-[var(--color-surface-container-low)] border-b border-[var(--color-outline-variant)]/20">
          <div className="max-w-[1920px] mx-auto flex justify-between items-end">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] font-bold mb-2 block">
                LIVE STOCK // UPDATED NOW
              </span>
              <h1 className="text-5xl font-black tracking-tighter uppercase">
                Inventory
              </h1>
            </div>
            <p className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-outline)] hidden md:block">
              {inventoryItems.length} SKUs TRACKED
            </p>
          </div>
        </section>

        {/* Table */}
        <section className="py-12 px-8 bg-[var(--color-surface)]">
          <div className="max-w-[1920px] mx-auto overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[var(--color-outline-variant)]/30">
                  {["SKU", "Product", "Stock", "Price", "Status", ""].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[9px] font-black uppercase tracking-widest text-[var(--color-outline)] pb-4 pr-6"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventoryItems.map((item) => {
                  const s = statusConfig[item.status];
                  return (
                    <tr
                      key={item.id}
                      className="border-b border-[var(--color-outline-variant)]/10 hover:bg-[var(--color-surface-container-low)] transition-colors group"
                    >
                      <td className="py-5 pr-6">
                        <span className="text-[9px] font-mono text-[var(--color-outline)] tracking-widest">
                          {item.sku}
                        </span>
                      </td>
                      <td className="py-5 pr-6">
                        <span className="text-sm font-bold uppercase tracking-tight">
                          {item.title}
                        </span>
                      </td>
                      <td className="py-5 pr-6">
                        <span className="text-sm font-light">
                          {item.stock === 0 ? "—" : `${item.stock} units`}
                        </span>
                      </td>
                      <td className="py-5 pr-6">
                        <span className="text-sm font-light">{item.price}</span>
                      </td>
                      <td className="py-5 pr-6">
                        <span
                          className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 ${s.color}`}
                        >
                          {s.label}
                        </span>
                      </td>
                      <td className="py-5">
                        {item.status !== "out" && (
                          <Link
                            href={`/products/${item.id}`}
                            className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            View
                            <span className="material-symbols-outlined text-xs">
                              arrow_forward
                            </span>
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
