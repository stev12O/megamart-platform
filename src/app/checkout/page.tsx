"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import {
  ArrowLeft,
  ShieldCheck,
  CreditCard,
  Truck,
  Store,
  CheckCircle,
  Clock,
  MapPin,
  Lock,
  Sparkles,
} from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { formatPrice } from "@/lib/utils";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const orderMode = useCartStore((state) => state.orderMode);
  const setOrderMode = useCartStore((state) => state.setOrderMode);
  const clearCart = useCartStore((state) => state.clearCart);

  const subtotal = useCartStore((state) => state.getSubtotal());
  const deliveryFee = useCartStore((state) => (orderMode === "DELIVERY" ? 3.99 : 0));
  const tax = useCartStore((state) => state.getEstimatedTax());
  const tip = useCartStore((state) => state.tipAmount);
  const total = useCartStore((state) => state.getTotal());

  // Form states
  const [formData, setFormData] = useState({
    name: "Carlos Mendoza",
    email: "carlos.mendoza@email.com",
    phone: "+1 (703) 555-0144",
    street: "2410 Fort Drive, Apt 304",
    city: "Alexandria",
    state: "VA",
    zipCode: "22303",
    notes: "Dejar en la puerta principal, tocar timbre #304",
    pickupTime: "Hoy en 30-45 minutos",
    paymentMethod: "CARD",
  });

  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("924");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const payload = {
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        type: orderMode,
        deliveryAddress: `${formData.street}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        deliveryNotes: formData.notes,
        pickupTime: formData.pickupTime,
        paymentMethod: formData.paymentMethod,
        tip,
        items,
      };

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo procesar el pedido.");
      }

      // Celebrate with confetti!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#E31E24", "#F5C518", "#1B4DA1", "#3A9E3A"],
      });

      clearCart();

      // Redirect to tracking page
      setTimeout(() => {
        router.push(`/orders/${data.order.id}`);
      }, 800);
    } catch (err: any) {
      setIsSubmitting(false);
      setError(err.message || "Ocurrió un error. Intenta nuevamente.");
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-extrabold text-gray-900">Tu carrito está vacío</h2>
        <p className="text-xs text-gray-500 max-w-sm mx-auto">
          No tienes productos en el carrito para procesar el pago.
        </p>
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 bg-[#E31E24] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:bg-[#CC181E] transition-colors"
        >
          Ir al Catálogo de MEGAMART
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb */}
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/catalog"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-[#E31E24] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </Link>

        <div className="flex items-center gap-2 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <Lock className="w-3.5 h-3.5" />
          <span>Checkout Seguro SSL 256-bit</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form (Customer info, address, payment) */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleSubmitOrder} className="space-y-6">
            {/* 1. Fulfillment Mode (Delivery vs Pickup) */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1B4DA1] text-white text-xs flex items-center justify-center font-bold">
                  1
                </span>
                <span>Método de Entrega</span>
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderMode("DELIVERY")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    orderMode === "DELIVERY"
                      ? "border-[#E31E24] bg-[#FEF2F2]/60 ring-2 ring-[#E31E24]/20 shadow-xs"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Truck className={`w-5 h-5 ${orderMode === "DELIVERY" ? "text-[#E31E24]" : "text-gray-500"}`} />
                    <span className="text-xs font-bold text-gray-900">$3.99</span>
                  </div>
                  <div className="font-extrabold text-xs text-gray-900">Delivery a Domicilio</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Entrega estimada: 35-45 min</div>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderMode("PICKUP")}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    orderMode === "PICKUP"
                      ? "border-[#F5C518] bg-[#FEFCE8] ring-2 ring-[#F5C518]/30 shadow-xs"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <Store className={`w-5 h-5 ${orderMode === "PICKUP" ? "text-[#D4A017]" : "text-gray-500"}`} />
                    <span className="text-xs font-bold text-emerald-600">GRATIS</span>
                  </div>
                  <div className="font-extrabold text-xs text-gray-900">Recoger en Tienda</div>
                  <div className="text-[11px] text-gray-500 mt-0.5">Listo en 20 min en Alexandria</div>
                </button>
              </div>
            </div>

            {/* 2. Customer Contact Info */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1B4DA1] text-white text-xs flex items-center justify-center font-bold">
                  2
                </span>
                <span>Datos de Contacto</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="sm:col-span-2">
                  <label className="font-bold text-gray-700 block mb-1">Nombre Completo *</label>
                  <input
                    type="text"
                    required
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E31E24] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Teléfono Móvil (para notificaciones) *</label>
                  <input
                    type="tel"
                    required
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E31E24] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E31E24] outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Address or Pickup Schedule */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#1B4DA1] text-white text-xs flex items-center justify-center font-bold">
                  3
                </span>
                <span>{orderMode === "DELIVERY" ? "Dirección de Entrega en Virginia" : "Horario de Recogida"}</span>
              </h2>

              {orderMode === "DELIVERY" ? (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="sm:col-span-3">
                    <label className="font-bold text-gray-700 block mb-1">Calle y Número / Apartamento *</label>
                    <input
                      type="text"
                      required
                      name="street"
                      value={formData.street}
                      onChange={handleInputChange}
                      placeholder="Ej: 2410 Fort Drive, Apt 304"
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E31E24] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Ciudad *</label>
                    <input
                      type="text"
                      required
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E31E24] outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Estado</label>
                    <input
                      type="text"
                      readOnly
                      name="state"
                      value="VA"
                      className="w-full px-3.5 py-2.5 bg-gray-100 border border-gray-200 rounded-xl text-gray-600 cursor-not-allowed font-bold"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Código Postal *</label>
                    <input
                      type="text"
                      required
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E31E24] outline-none"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="font-bold text-gray-700 block mb-1">Instrucciones para el repartidor (opcional)</label>
                    <textarea
                      name="notes"
                      rows={2}
                      value={formData.notes}
                      onChange={handleInputChange}
                      placeholder="Ej: Tocar timbre #304, dejar en conserjería si no respondo..."
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E31E24] outline-none text-xs"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 text-amber-900">
                    <span className="font-bold block text-sm">📍 Sucursal de Recogida: MEGAMART Alexandria</span>
                    <span className="text-xs text-amber-800">7850 Richmond Hwy, Alexandria, VA 22306</span>
                  </div>

                  <div>
                    <label className="font-bold text-gray-700 block mb-1">¿A qué hora pasarás por tu pedido?</label>
                    <select
                      name="pickupTime"
                      value={formData.pickupTime}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:border-[#E31E24] outline-none text-xs font-semibold cursor-pointer"
                    >
                      <option value="Hoy en 30-45 minutos">Hoy lo antes posible (30-45 min)</option>
                      <option value="Hoy a las 5:00 PM">Hoy a las 5:00 PM</option>
                      <option value="Hoy a las 6:30 PM">Hoy a las 6:30 PM</option>
                      <option value="Hoy a las 8:00 PM">Hoy a las 8:00 PM</option>
                      <option value="Mañana por la mañana">Mañana por la mañana (9:00 AM)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* 4. Payment Method (Stripe Card / Apple Pay Simulation) */}
            <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#1B4DA1] text-white text-xs flex items-center justify-center font-bold">
                    4
                  </span>
                  <span>Método de Pago Seguro</span>
                </h2>
                <span className="text-[11px] text-gray-400 font-medium">Powered by Stripe</span>
              </div>

              {/* Payment Type Tabs */}
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: "CARD" })}
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    formData.paymentMethod === "CARD"
                      ? "border-[#1B4DA1] bg-[#EFF6FF] text-[#1B4DA1] ring-2 ring-[#1B4DA1]/20"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Tarjeta</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: "APPLE_PAY" })}
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    formData.paymentMethod === "APPLE_PAY"
                      ? "border-black bg-black text-white"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>🍏 Apple Pay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, paymentMethod: "CASH" })}
                  className={`py-2.5 px-3 rounded-xl border flex items-center justify-center gap-2 transition-all ${
                    formData.paymentMethod === "CASH"
                      ? "border-[#3A9E3A] bg-[#F0FDF4] text-[#3A9E3A] ring-2 ring-[#3A9E3A]/20"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span>💵 Al Recibir</span>
                </button>
              </div>

              {/* Card Inputs Form */}
              {formData.paymentMethod === "CARD" && (
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-gray-700 block mb-1">Número de Tarjeta</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full pl-3.5 pr-12 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-[#1B4DA1] outline-none font-mono"
                      />
                      <CreditCard className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">Vencimiento (MM/AA)</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-[#1B4DA1] outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-gray-700 block mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg focus:border-[#1B4DA1] outline-none font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === "APPLE_PAY" && (
                <div className="p-4 bg-black text-white rounded-xl text-center text-xs space-y-2">
                  <span className="font-bold block text-sm"> Pay con Touch ID / Face ID</span>
                  <span className="text-gray-300 text-[11px] block">
                    Al confirmar se procesará instantáneamente a través de Apple Pay en tu dispositivo.
                  </span>
                </div>
              )}

              {formData.paymentMethod === "CASH" && (
                <div className="p-4 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl text-xs">
                  <span className="font-bold block">💵 Pago en Efectivo al Entregar / Recoger</span>
                  <span className="text-[11px] text-emerald-700 block mt-0.5">
                    Nuestros repartidores llevan cambio para billetes de $20 y $50.
                  </span>
                </div>
              )}
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs font-bold">
                ⚠️ {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#E31E24] hover:bg-[#CC181E] disabled:bg-gray-400 text-white py-4 px-6 rounded-2xl font-extrabold text-base shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Procesando Pedido Seguro...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Confirmar Pedido • {formatPrice(total)}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Summary Sticky Box */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-md sticky top-24 space-y-4">
          <h3 className="font-extrabold text-gray-900 text-base border-b border-gray-100 pb-3">
            Resumen del Pedido ({items.length} {items.length === 1 ? "item" : "items"})
          </h3>

          {/* Items List */}
          <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 pr-1 text-xs">
            {items.map((item) => (
              <div key={item.product.id} className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-10 h-10 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                    {item.product.imageUrl && (
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-gray-900 truncate">{item.product.name}</div>
                    <div className="text-[11px] text-gray-400">
                      {item.quantity} × {formatPrice(item.product.price)} ({item.product.unit})
                    </div>
                  </div>
                </div>
                <span className="font-extrabold text-gray-900 shrink-0">
                  {formatPrice(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing Breakdown */}
          <div className="pt-3 border-t border-gray-200/70 space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal productos</span>
              <span className="font-bold text-gray-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>{orderMode === "DELIVERY" ? "Envío a Domicilio" : "Pickup en Tienda"}</span>
              <span className="font-bold text-gray-900">
                {deliveryFee === 0 ? "GRATIS" : formatPrice(deliveryFee)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Impuesto sobre ventas (VA 6%)</span>
              <span className="font-bold text-gray-900">{formatPrice(tax)}</span>
            </div>
            {tip > 0 && (
              <div className="flex justify-between">
                <span>Propina</span>
                <span className="font-bold text-gray-900">{formatPrice(tip)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t border-gray-200">
              <span>Total Final</span>
              <span className="text-xl text-[#E31E24]">{formatPrice(total)}</span>
            </div>
          </div>

          {/* Guarantees */}
          <div className="pt-3 border-t border-gray-100 space-y-2 text-[11px] text-gray-500">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#3A9E3A] shrink-0" />
              <span>Garantía de frescura total en carnes y panadería</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F5C518] shrink-0" />
              <span>Notificaciones en vivo del estado de tu pedido</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
