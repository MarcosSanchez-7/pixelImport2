"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { useStorefront } from "@/context/StorefrontContext";

/* ── Checkout step ─────────────────────────────────────────── */
function CheckoutPanel({ items, subtotal, onBack }) {
  const { settings } = useStorefront();
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(null); // { lat, lng }
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState("");

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setLocError("Tu navegador no soporta geolocalización.");
      return;
    }
    setLocating(true);
    setLocError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setLocError("No se pudo obtener la ubicación. Escribí tu dirección manualmente.");
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const mapSrc = coords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${coords.lng - 0.01},${coords.lat - 0.01},${coords.lng + 0.01},${coords.lat + 0.01}&layer=mapnik&marker=${coords.lat},${coords.lng}`
    : null;

  const mapsLink = coords
    ? `https://www.google.com/maps?q=${coords.lat},${coords.lng}`
    : null;

  const handleWhatsApp = () => {
    if (!nombre.trim() || !apellido.trim()) return;

    const locationText = coords
      ? `${address.trim() ? address + " — " : ""}${coords.lat.toFixed(6)}, ${coords.lng.toFixed(6)} (${mapsLink})`
      : address.trim() || "No especificada";

    const itemLines = items
      .map((i) => `• ${i.title} x${i.quantity} — Gs. ${(i.price * i.quantity).toLocaleString("es-PY")}`)
      .join("\n");

    const msg =
      `¡Hola! Quiero confirmar mi pedido 🛒\n\n` +
      `*Datos del cliente:*\n` +
      `Nombre: ${nombre.trim()} ${apellido.trim()}\n` +
      `Ubicación: ${locationText}\n\n` +
      `*Productos:*\n${itemLines}\n\n` +
      `*Total: Gs. ${subtotal.toLocaleString("es-PY")}*`;

    const baseUrl = (settings.whatsappUrl || "https://wa.me/").replace(/\?.*$/, "");
    const waUrl = `${baseUrl}?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, "_blank", "noopener,noreferrer");
  };

  const canSubmit = nombre.trim() && apellido.trim();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-zinc-100 shrink-0">
        <button
          onClick={onBack}
          className="p-1.5 text-zinc-400 hover:text-black transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>arrow_back</span>
        </button>
        <div>
          <p className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold">Paso 2 de 2</p>
          <h2 className="text-sm font-black uppercase tracking-widest">Datos del Pedido</h2>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">

        {/* Nombre + Apellido */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1.5">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Juan"
              className="w-full border border-zinc-200 focus:border-black text-sm px-3 py-2.5 outline-none transition-colors"
            />
          </div>
          <div>
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1.5">
              Apellido <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholder="García"
              className="w-full border border-zinc-200 focus:border-black text-sm px-3 py-2.5 outline-none transition-colors"
            />
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1.5">
            Ubicación / Dirección
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Calle, barrio, ciudad o referencia..."
            className="w-full border border-zinc-200 focus:border-black text-sm px-3 py-2.5 outline-none transition-colors mb-2"
          />

          {/* Detect location button */}
          <button
            onClick={detectLocation}
            disabled={locating}
            className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest border border-zinc-200 px-3 py-2 hover:bg-zinc-50 transition-colors disabled:opacity-50 w-full justify-center"
          >
            <span className="material-symbols-outlined" style={{ fontSize: "15px" }}>
              {locating ? "autorenew" : "my_location"}
            </span>
            {locating ? "Detectando ubicación..." : "Usar mi ubicación actual"}
          </button>

          {locError && (
            <p className="text-red-500 text-[10px] mt-1.5 leading-relaxed">{locError}</p>
          )}

          {/* Map preview */}
          {mapSrc && (
            <div className="mt-3 rounded overflow-hidden border border-zinc-200">
              <iframe
                src={mapSrc}
                width="100%"
                height="200"
                style={{ border: 0 }}
                loading="lazy"
                title="Ubicación seleccionada"
              />
              <div className="px-3 py-2 bg-zinc-50 border-t border-zinc-200 flex items-center gap-2">
                <span className="material-symbols-outlined text-emerald-500" style={{ fontSize: "14px" }}>
                  check_circle
                </span>
                <p className="text-[10px] text-zinc-500 font-semibold">
                  Ubicación detectada: {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Order summary */}
        <div className="border border-zinc-100 rounded">
          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-400 px-4 py-2.5 border-b border-zinc-100">
            Resumen del pedido
          </p>
          <div className="divide-y divide-zinc-50">
            {items.map((item) => (
              <div key={item.id} className="px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 bg-zinc-50 border border-zinc-100 shrink-0 flex items-center justify-center">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={item.image} alt={item.title} className="w-full h-full object-contain p-0.5" />
                    ) : (
                      <span className="material-symbols-outlined text-zinc-300" style={{ fontSize: "14px" }}>image</span>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-tight truncate">{item.title}</p>
                    <p className="text-[10px] text-zinc-400">x{item.quantity}</p>
                  </div>
                </div>
                <p className="text-xs font-semibold shrink-0 tabular-nums">
                  Gs. {(item.price * item.quantity).toLocaleString("es-PY")}
                </p>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-zinc-100 flex justify-between items-center bg-zinc-50">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Total</span>
            <span className="text-base font-light">Gs. {subtotal.toLocaleString("es-PY")}</span>
          </div>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="border-t border-zinc-100 px-6 py-5 shrink-0 space-y-2">
        {!canSubmit && (
          <p className="text-[10px] text-zinc-400 text-center uppercase tracking-widest">
            Completá nombre y apellido para continuar
          </p>
        )}
        <button
          onClick={handleWhatsApp}
          disabled={!canSubmit}
          className="w-full py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2.5 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ backgroundColor: canSubmit ? "#25D366" : "#ccc", color: "white" }}
        >
          {/* WhatsApp icon */}
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Finalizar en WhatsApp
        </button>
      </div>
    </div>
  );
}

/* ── Main CartDrawer ───────────────────────────────────────── */
export default function CartDrawer() {
  const { items, isOpen, closeCart, removeFromCart, updateQuantity, subtotal, clearCart } = useCart();
  const router = useRouter();
  const [step, setStep] = useState("cart"); // "cart" | "checkout"

  // Reset to cart step when drawer closes
  useEffect(() => {
    if (!isOpen) setStep("cart");
  }, [isOpen]);

  const handleSeguirComprando = () => {
    closeCart();
    router.push("/");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={closeCart} />

      {/* Panel */}
      <div className="w-full max-w-full sm:max-w-md bg-white h-full flex flex-col shadow-2xl border-l border-zinc-200">

        {step === "checkout" ? (
          <CheckoutPanel
            items={items}
            subtotal={subtotal}
            onBack={() => setStep("cart")}
          />
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-zinc-100 shrink-0">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-black uppercase tracking-widest">Tu Carrito</h2>
                {items.length > 0 && (
                  <span className="bg-black text-white text-[8px] font-black px-2 py-0.5 tracking-widest">
                    {items.reduce((s, i) => s + i.quantity, 0)} {items.reduce((s, i) => s + i.quantity, 0) === 1 ? "ITEM" : "ITEMS"}
                  </span>
                )}
              </div>
              <button onClick={closeCart} className="p-1.5 text-zinc-400 hover:text-black transition-colors">
                <span className="material-symbols-outlined" style={{ fontSize: "20px" }}>close</span>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-8 text-center">
                  <span className="material-symbols-outlined text-zinc-200" style={{ fontSize: "56px" }}>
                    shopping_cart
                  </span>
                  <p className="text-zinc-400 text-sm font-semibold uppercase tracking-widest">
                    Tu carrito está vacío
                  </p>
                  <button
                    onClick={handleSeguirComprando}
                    className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-4 text-black hover:no-underline"
                  >
                    Seguir comprando
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
                          <img src={item.image} alt={item.title} className="w-full h-full object-contain p-1" />
                        ) : (
                          <span className="material-symbols-outlined text-zinc-300">image</span>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold uppercase tracking-tight truncate">{item.title}</p>
                        {item.sku && (
                          <p className="text-[9px] font-mono text-zinc-400 tracking-widest mt-0.5">{item.sku}</p>
                        )}
                        <p className="text-sm font-light mt-1">
                          Gs. {Number(item.price).toLocaleString("es-PY")}
                        </p>
                        {/* Quantity */}
                        <div className="flex items-center gap-3 mt-3">
                          <div className="flex items-center border border-zinc-200">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>remove</span>
                            </button>
                            <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-black hover:bg-zinc-50 transition-colors"
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: "14px" }}>add</span>
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-zinc-300 hover:text-red-500 transition-colors"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>delete</span>
                          </button>
                        </div>
                      </div>

                      {/* Line total */}
                      <div className="shrink-0 text-right">
                        <p className="text-sm font-semibold tabular-nums">
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
              <div className="border-t border-zinc-100 px-6 py-5 space-y-3 bg-zinc-50 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Subtotal</span>
                  <span className="text-lg font-light tabular-nums">Gs. {subtotal.toLocaleString("es-PY")}</span>
                </div>
                <div className="flex flex-col gap-2 pt-1">
                  <button
                    onClick={handleSeguirComprando}
                    className="w-full py-3.5 text-xs font-black uppercase tracking-widest border border-black text-black hover:bg-black hover:text-white transition-all duration-200"
                  >
                    Seguir Comprando
                  </button>
                  <button
                    onClick={() => setStep("checkout")}
                    className="w-full py-3.5 text-xs font-black uppercase tracking-widest bg-black text-white hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: "16px" }}>shopping_bag</span>
                    Confirmar Pedido
                  </button>
                </div>
                <button
                  onClick={clearCart}
                  className="w-full text-[9px] font-bold uppercase tracking-widest text-zinc-400 hover:text-red-500 transition-colors text-center"
                >
                  Vaciar Carrito
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
