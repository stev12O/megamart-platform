"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bell,
  Volume2,
  VolumeX,
  RefreshCw,
  Clock,
  Package,
  Truck,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Edit2,
  DollarSign,
  TrendingUp,
  Store,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Search,
  ExternalLink,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "inventory" | "store">("orders");
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const [isNewProductOpen, setIsNewProductOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    imageUrl: "",
    stock: "50",
    unit: "unidad",
    categoryId: "",
    badge: "",
  });

  const lastOrderCountRef = useRef<number>(0);

  // Play audio chime function using Web Audio API
  const playChime = () => {
    if (!soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880.0, audioCtx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start();
      osc.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      console.warn("Audio context not allowed yet:", e);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data.orders) {
        if (lastOrderCountRef.current > 0 && data.orders.length > lastOrderCountRef.current) {
          playChime();
          // Desktop Web Notification
          if ("Notification" in window && Notification.permission === "granted") {
            new Notification("🐂 MEGAMART: ¡Nuevo Pedido Entrante!", {
              body: `Pedido #${data.orders[0].orderNumber} por ${formatPrice(data.orders[0].total)}`,
              icon: "/images/logo-megamart.png",
            });
          }
        }
        lastOrderCountRef.current = data.orders.length;
        setOrders(data.orders);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchOrders(), fetchProducts()]);
    setLoading(false);
  };

  useEffect(() => {
    loadAll();
    // Auto poll orders every 8 seconds
    const interval = setInterval(fetchOrders, 8000);
    return () => clearInterval(interval);
  }, []);

  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then((perm) => {
        if (perm === "granted") {
          new Notification("MEGAMART Notificaciones Activadas", {
            body: "Recibirás alertas en tu pantalla cuando entre un pedido nuevo.",
          });
        }
      });
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStock = async (productId: string, newStock: number) => {
    try {
      const res = await fetch("/api/admin/products", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: productId, stock: newStock }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((p) => (p.id === productId ? { ...p, stock: newStock } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Find first category if not selected
      const catId = newProduct.categoryId || (products[0]?.categoryId || "");
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newProduct, categoryId: catId }),
      });
      const data = await res.json();
      if (res.ok && data.product) {
        setProducts([data.product, ...products]);
        setIsNewProductOpen(false);
        setNewProduct({
          name: "",
          description: "",
          price: "",
          originalPrice: "",
          imageUrl: "",
          stock: "50",
          unit: "unidad",
          categoryId: "",
          badge: "",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const pendingOrders = orders.filter((o) => o.status === "PENDING" || o.status === "PREPARING");
  const completedOrders = orders.filter((o) => o.status === "DELIVERED" || o.status === "READY");

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "ALL" && o.status !== statusFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        o.customerPhone.includes(term)
      );
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      {/* Admin Top Header */}
      <div className="bg-white rounded-2xl border border-gray-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#E31E24]/10 text-[#E31E24] flex items-center justify-center font-black">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Panel de Tienda MEGAMART
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                En Vivo
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Alexandria, Virginia • Gestión de Pedidos, Inventario y Despacho
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors ${
              soundEnabled
                ? "bg-amber-50 border-amber-200 text-amber-900"
                : "bg-gray-100 border-gray-200 text-gray-400"
            }`}
            title="Sonido de nuevos pedidos"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? "Sonido Activado" : "Silenciado"}</span>
          </button>

          {/* Browser Push Perms */}
          <button
            onClick={requestNotificationPermission}
            className="p-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 rounded-xl text-xs font-bold flex items-center gap-1.5"
            title="Activar notificaciones push de escritorio"
          >
            <Bell className="w-4 h-4 text-[#1B4DA1]" />
            <span className="hidden sm:inline">Push Notif</span>
          </button>

          {/* Refresh Button */}
          <button
            onClick={loadAll}
            className="p-2.5 bg-[#E31E24] hover:bg-[#CC181E] text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Ventas Totales
            </span>
            <span className="text-2xl font-black text-gray-900">{formatPrice(totalRevenue)}</span>
            <div className="text-[11px] text-emerald-600 font-bold mt-1">
              {orders.length} pedidos procesados
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Pedidos Pendientes / En Prep
            </span>
            <span className="text-2xl font-black text-[#E31E24]">{pendingOrders.length}</span>
            <div className="text-[11px] text-amber-600 font-bold mt-1">
              Requieren atención inmediata
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-red-50 text-[#E31E24] flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-1">
              Completados / Entregados
            </span>
            <span className="text-2xl font-black text-gray-900">{completedOrders.length}</span>
            <div className="text-[11px] text-gray-400 font-bold mt-1">
              {products.length} productos en catálogo
            </div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1B4DA1] flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2">
        <button
          onClick={() => setActiveTab("orders")}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === "orders"
              ? "bg-[#E31E24] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Pedidos en Vivo ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("inventory")}
          className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all ${
            activeTab === "inventory"
              ? "bg-[#E31E24] text-white shadow-sm"
              : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Inventario & Productos ({products.length})</span>
        </button>
      </div>

      {/* TAB 1: LIVE ORDERS FEED */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          {/* Filter and Search Bar */}
          <div className="bg-white rounded-xl border border-gray-200/80 p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por # pedido, cliente..."
                className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#E31E24]"
              />
              <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs font-bold">
              {["ALL", "PENDING", "PREPARING", "ON_THE_WAY", "DELIVERED"].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg border transition-colors ${
                    statusFilter === st
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  {st === "ALL" ? "Todos" : st}
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center text-gray-400">
              <Clock className="w-10 h-10 mx-auto mb-2 text-gray-300" />
              <p className="font-bold text-gray-700 text-sm">No hay pedidos con este criterio</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className={`bg-white rounded-2xl border p-5 shadow-xs transition-all ${
                    order.status === "PENDING"
                      ? "border-[#E31E24] ring-2 ring-[#E31E24]/15 bg-red-50/10"
                      : "border-gray-200/80"
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-black text-gray-900">
                          Pedido #{order.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                            order.type === "DELIVERY"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {order.type === "DELIVERY" ? "🚀 DELIVERY" : "🏬 PICKUP"}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(order.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>

                      <div className="text-xs text-gray-600 mt-1">
                        <strong>Cliente:</strong> {order.customerName} • <strong>Tel:</strong> {order.customerPhone}
                      </div>

                      {order.deliveryNotes && (
                        <div className="text-[11px] text-gray-500 mt-0.5">
                          📍 {order.deliveryNotes}
                        </div>
                      )}
                    </div>

                    {/* Price and Status Actions */}
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs text-gray-400 block">Total a Cobrar</span>
                        <span className="text-lg font-black text-gray-900">{formatPrice(order.total)}</span>
                      </div>

                      <Link
                        href={`/orders/${order.id}`}
                        target="_blank"
                        className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                        title="Ver comprobante del cliente"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>

                      {/* Status Stepper Actions */}
                      <div className="flex items-center gap-1.5">
                        {order.status === "PENDING" && (
                          <button
                            onClick={() => handleStatusChange(order.id, "PREPARING")}
                            className="bg-[#E31E24] hover:bg-[#CC181E] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs"
                          >
                            Aceptar & Preparar →
                          </button>
                        )}

                        {order.status === "PREPARING" && (
                          <button
                            onClick={() => handleStatusChange(order.id, order.type === "DELIVERY" ? "ON_THE_WAY" : "READY")}
                            className="bg-[#1B4DA1] hover:bg-[#153E85] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs"
                          >
                            {order.type === "DELIVERY" ? "Despachar Repartidor →" : "Listo para Pickup →"}
                          </button>
                        )}

                        {(order.status === "ON_THE_WAY" || order.status === "READY") && (
                          <button
                            onClick={() => handleStatusChange(order.id, "DELIVERED")}
                            className="bg-[#3A9E3A] hover:bg-[#2E822E] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-xs"
                          >
                            Marcar Entregado ✓
                          </button>
                        )}

                        {order.status === "DELIVERED" && (
                          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-xl">
                            ✓ Completado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Items Mini List */}
                  <div className="pt-3 flex flex-wrap gap-2 text-xs">
                    {order.items?.map((item: any) => (
                      <span
                        key={item.id}
                        className="bg-gray-50 border border-gray-200 px-2.5 py-1 rounded-lg text-gray-700 font-medium"
                      >
                        {item.quantity}x {item.name} ({formatPrice(item.price)})
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVENTORY & PRODUCTS */}
      {activeTab === "inventory" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-gray-900 text-base">
              Catálogo de Productos ({products.length})
            </h2>
            <button
              onClick={() => setIsNewProductOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#E31E24] hover:bg-[#CC181E] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Nuevo Producto</span>
            </button>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-2xl border border-gray-200/80 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Producto</th>
                    <th className="p-4">Categoría</th>
                    <th className="p-4">Precio</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4">Disponibilidad</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                            {prod.imageUrl && (
                              <Image src={prod.imageUrl} alt={prod.name} fill className="object-cover" />
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block">{prod.name}</span>
                            <span className="text-[11px] text-gray-400">Por {prod.unit}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 font-semibold text-gray-600">
                        {prod.category?.name || "General"}
                      </td>

                      <td className="p-4 font-black text-gray-900">
                        {formatPrice(prod.price)}
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            defaultValue={prod.stock}
                            onBlur={(e) => handleUpdateStock(prod.id, parseInt(e.target.value) || 0)}
                            className="w-16 px-2 py-1 bg-gray-50 border border-gray-200 rounded-lg font-bold text-center outline-none focus:border-[#E31E24]"
                          />
                          {prod.stock <= 10 && (
                            <span className="text-[10px] text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                              Bajo
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <span className="inline-block bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded-full">
                          En Venta
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* New Product Modal */}
      {isNewProductOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-gray-100">
            <h3 className="text-lg font-extrabold text-gray-900">Agregar Nuevo Producto</h3>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  required
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Ej: Empanadas de Piña Horneadas"
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Precio ($ USD) *</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    placeholder="3.99"
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Stock Inicial</label>
                  <input
                    type="number"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Unidad de Medida</label>
                <input
                  type="text"
                  value={newProduct.unit}
                  onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}
                  placeholder="unidad, lb, paquete 4u..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">URL de Imagen (Unsplash)</label>
                <input
                  type="url"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Descripción</label>
                <textarea
                  rows={2}
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  placeholder="Descripción del producto..."
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none text-xs"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsNewProductOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#E31E24] hover:bg-[#CC181E] text-white px-5 py-2 rounded-xl font-bold"
                >
                  Guardar Producto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
