"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, subtotal, clearCart } =
    useCart();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div
        className="flex-1 bg-black/60 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Panel */}
      <div className="w-full max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-zinc-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-black uppercase tracking-widest">Your Cart</h2>
            {items.length > 0 && (
              <span className="bg-black text-white text-[8px] font-black px-2 py-0.5 tracking-widest">
                {items.reduce((s, i) => s + i.quantity, 0)} ITEMS
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 text-zinc-400 hover:text-black transition-colors"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>
              close
            </span>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
              <span
                className="material-symbols-outlined text-zinc-200"
                style={{ fontSize: "56px" }}
              >
                shopping_cart
              </span>
              <p className="text-zinc-400 text-sm font-semibold uppercase tracking-widest">
                Your cart is empty
              </p>
              <button
                onClick={closeCart}
                className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-4 text-black hover:no-underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="divide-y divide-zinc-100">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 p-5">
                  {/* Image */}
                  <div className="w-16 h-16 bg-zinc-50 border border-zinc-100 shrink-0 flex items-center justify-center">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-contain p-1"
                      />
                    ) : (
                      <span className="material-symbols-outlined text-zinc-300">image</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold uppercase tracking-tight truncate">
                      {item.title}
                    </p>
                    {item.sku && (
                      <p className="text-[9px] font-mono text-zinc-400 tracking-widest mt-0.5">
                        {item.sku}
                      </p>
                    )}
                    <p className="text-sm font-light mt-1">
                      Gs. {Number(item.price).toLocaleString("es-PY")}
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex items-center border border-zinc-200">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                            remove
                          </span>
                        </button>
                        <span className="w-8 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors"
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>
                            add
                          </span>
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-zinc-300 hover:text-red-500 transition-colors"
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                          delete
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Line total */}
                  <div className="shrink-0 text-right">
                    <p className="text-sm font-semibold">
                      Gs. {(item.price * item.quantity).toLocaleString("es-PY")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-zinc-100 px-6 py-5 space-y-4 bg-zinc-50">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">
                Subtotal
              </span>
              <span className="text-lg font-light">Gs. {subtotal.toLocaleString("es-PY")}</span>
            </div>
            <p className="text-[9px] text-zinc-400 uppercase tracking-widest">
              Shipping calculated at checkout
            </p>
            <div className="flex flex-col gap-2">
              <Link
                href="/cart"
                onClick={closeCart}
                className="w-full py-3.5 text-center text-xs font-black uppercase tracking-widest border border-black text-black hover:bg-black hover:text-white transition-all duration-200"
              >
                View Cart
              </Link>
              <button className="w-full py-3.5 text-xs font-black uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>
                  lock
                </span>
                Checkout
              </button>
            </div>
            <button
              onClick={clearCart}
              className="w-full text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors text-center"
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
