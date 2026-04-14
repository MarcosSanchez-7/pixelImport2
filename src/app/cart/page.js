"use client";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();

  const total = subtotal;

  return (
    <>
      <Navbar />
      <main className="pt-32 min-h-screen bg-[var(--color-surface)]">
        <div className="max-w-6xl mx-auto px-8 pb-24">
          <div className="mb-12">
            <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-outline)] font-bold mb-2 block">
              REVIEW
            </span>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Your Cart</h1>
          </div>

          {items.length === 0 ? (
            <div className="flex flex-col items-center gap-6 py-24">
              <span
                className="material-symbols-outlined text-zinc-200"
                style={{ fontSize: "72px" }}
              >
                shopping_cart
              </span>
              <p className="text-zinc-400 font-semibold uppercase tracking-widest">
                Your cart is empty
              </p>
              <Link
                href="/products"
                className="bg-black text-white px-10 py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors"
              >
                Browse Imports
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-5 p-5 bg-white border border-zinc-100 hover:border-zinc-200 transition-colors"
                  >
                    {/* Image */}
                    <Link href={`/products/${item.id}`} className="shrink-0">
                      <div className="w-24 h-24 bg-zinc-50 border border-zinc-100 flex items-center justify-center">
                        {item.image ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-contain p-2"
                          />
                        ) : (
                          <span className="material-symbols-outlined text-zinc-300">image</span>
                        )}
                      </div>
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      {item.brand && (
                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-400 mb-1">
                          {item.brand}
                        </p>
                      )}
                      <Link href={`/products/${item.id}`}>
                        <p className="font-bold uppercase tracking-tight hover:opacity-60 transition-opacity">
                          {item.title}
                        </p>
                      </Link>
                      {item.sku && (
                        <p className="text-[9px] font-mono text-zinc-400 tracking-widest mt-0.5">
                          {item.sku}
                        </p>
                      )}
                      <p className="text-lg font-light mt-2">
                        Gs. {Number(item.price).toLocaleString("es-PY")}
                      </p>
                    </div>

                    {/* Qty + Remove */}
                    <div className="flex flex-col items-end justify-between shrink-0">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-300 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "18px" }}>
                          delete
                        </span>
                      </button>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-widest text-zinc-400 text-right mb-2">
                          Qty
                        </p>
                        <div className="flex items-center border border-zinc-200">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                              remove
                            </span>
                          </button>
                          <span className="w-9 text-center text-sm font-bold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                              add
                            </span>
                          </button>
                        </div>
                        <p className="text-sm font-semibold text-right mt-2">
                          Gs. {(item.price * item.quantity).toLocaleString("es-PY")}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                <button
                  onClick={clearCart}
                  className="text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined" style={{ fontSize: "13px" }}>
                    delete_sweep
                  </span>
                  Clear Cart
                </button>
              </div>

              {/* Summary */}
              <div className="bg-white border border-zinc-100 p-8 h-fit sticky top-32">
                <p className="text-[10px] font-black uppercase tracking-widest mb-6">
                  Order Summary
                </p>
                <div className="space-y-4 pb-6 border-b border-zinc-100">
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 uppercase tracking-wide text-xs">
                      Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)
                    </span>
                    <span className="font-light">Gs. {subtotal.toLocaleString("es-PY")}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-zinc-500 uppercase tracking-wide text-xs">Shipping</span>
                    <span className="text-emerald-600 font-bold text-xs">FREE</span>
                  </div>
                </div>
                <div className="flex justify-between py-6">
                  <span className="font-black uppercase tracking-widest text-sm">Total</span>
                  <span className="text-2xl font-light">Gs. {total.toLocaleString("es-PY")}</span>
                </div>
                <button className="w-full bg-black text-white py-4 text-xs font-black uppercase tracking-widest hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 mb-3">
                  <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                    lock
                  </span>
                  Proceed to Checkout
                </button>
                <Link
                  href="/products"
                  className="w-full border border-zinc-200 py-4 text-xs font-black uppercase tracking-widest hover:border-black transition-colors text-center block text-zinc-500 hover:text-black"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
