import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  Store,
  MapPin,
  Phone,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

interface OrderPageProps {
  params: {
    id: string;
  };
}

export const revalidate = 0;

const statusSteps = [
  {
    key: "PENDING",
    label: "Recibido",
    desc: "Tu pedido entró al sistema",
    icon: Clock,
  },
  {
    key: "CONFIRMED",
    label: "Confirmado",
    desc: "Tienda aceptó el pedido",
    icon: CheckCircle2,
  },
  {
    key: "PREPARING",
    label: "Preparando",
    desc: "Empacando panadería y carnes",
    icon: Package,
  },
  {
    key: "ON_THE_WAY",
    label: "En Camino / Listo",
    desc: "Repartidor en ruta hacia ti",
    icon: Truck,
  },
  {
    key: "DELIVERED",
    label: "Entregado",
    desc: "¡Buen provecho!",
    icon: ShieldCheck,
  },
];

export default async function OrderTrackingPage({ params }: OrderPageProps) {
  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: true,
      store: true,
    },
  });

  if (!order) {
    notFound();
  }

  // Calculate current step index
  const statusHierarchy = ["PENDING", "CONFIRMED", "PREPARING", "READY", "ON_THE_WAY", "DELIVERED"];
  const currentIndex = statusHierarchy.indexOf(order.status);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Badge & Order Number */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 font-bold px-3 py-1 rounded-full text-xs border border-emerald-200 mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>¡Pedido Registrado con Éxito!</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Pedido #{order.orderNumber}
          </h1>

          <p className="text-xs text-gray-500 mt-1">
            Fecha: {new Date(order.createdAt).toLocaleDateString("es-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-[#E31E24] bg-gray-100 hover:bg-gray-200 px-4 py-2.5 rounded-xl transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Hacer otro pedido</span>
          </Link>
        </div>
      </div>

      {/* Live Order Status Bar */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-900 flex items-center gap-2">
            <span>Estado en Tiempo Real</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </h2>
          <span className="text-xs font-bold text-[#E31E24] bg-[#FEF2F2] px-3 py-1 rounded-full border border-red-100">
            {order.type === "DELIVERY" ? "🚀 Delivery a Domicilio" : "🏬 Pickup en Tienda"}
          </span>
        </div>

        {/* Step Indicator */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {statusSteps.map((step, idx) => {
            const isCompleted = currentIndex >= idx;
            const isCurrent = currentIndex === idx;
            const StepIcon = step.icon;

            return (
              <div
                key={step.key}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? "bg-[#FEF2F2] border-[#E31E24] ring-2 ring-[#E31E24]/20 shadow-xs"
                    : isCompleted
                    ? "bg-emerald-50/70 border-emerald-200 text-emerald-800"
                    : "bg-gray-50 border-gray-200 text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 font-bold ${
                    isCurrent
                      ? "bg-[#E31E24] text-white"
                      : isCompleted
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  <StepIcon className="w-4 h-4" />
                </div>
                <div className={`text-xs font-extrabold ${isCurrent ? "text-[#E31E24]" : "text-gray-900"}`}>
                  {step.label}
                </div>
                <div className="text-[10px] text-gray-500 mt-0.5 line-clamp-1">{step.desc}</div>
              </div>
            );
          })}
        </div>

        {/* Delivery / Pickup Address Details */}
        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200/80 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <span className="font-bold text-gray-900 block mb-1">
              {order.type === "DELIVERY" ? "Dirección de Entrega:" : "Punto de Recogida:"}
            </span>
            <p className="text-gray-600">
              {order.type === "DELIVERY"
                ? order.deliveryNotes || "Dirección registrada"
                : `${order.store.name} — ${order.store.address}`}
            </p>
          </div>

          <div>
            <span className="font-bold text-gray-900 block mb-1">Contacto del Cliente:</span>
            <p className="text-gray-600">
              {order.customerName} • {order.customerPhone}
            </p>
          </div>
        </div>
      </div>

      {/* Order Items Breakdown */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-6 sm:p-8 shadow-sm space-y-4">
        <h3 className="font-extrabold text-gray-900 text-base border-b border-gray-100 pb-3">
          Detalle de Productos ({order.items.length} items)
        </h3>

        <div className="divide-y divide-gray-100 text-xs">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                  {item.imageUrl && (
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900">{item.name}</h4>
                  <span className="text-[11px] text-gray-500">
                    {item.quantity} unidades a {formatPrice(item.price)}
                  </span>
                </div>
              </div>
              <span className="font-extrabold text-gray-900 text-sm">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Pricing Summary */}
        <div className="pt-4 border-t border-gray-200 space-y-2 text-xs text-gray-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-bold text-gray-900">{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>{order.type === "DELIVERY" ? "Envío" : "Pickup"}</span>
            <span className="font-bold text-gray-900">
              {order.deliveryFee === 0 ? "GRATIS" : formatPrice(order.deliveryFee)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Impuesto estimado (VA 6%)</span>
            <span className="font-bold text-gray-900">{formatPrice(order.tax)}</span>
          </div>
          {order.tip > 0 && (
            <div className="flex justify-between">
              <span>Propina repartidor</span>
              <span className="font-bold text-gray-900">{formatPrice(order.tip)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-black text-gray-900 pt-3 border-t border-gray-200">
            <span>Total Pagado</span>
            <span className="text-xl text-[#E31E24]">{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
