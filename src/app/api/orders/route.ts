import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      customerName,
      customerEmail,
      customerPhone,
      type,
      deliveryAddress,
      deliveryNotes,
      pickupTime,
      paymentMethod,
      tip,
      items,
    } = body;

    if (!customerName || !customerPhone || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Faltan datos obligatorios para crear el pedido" },
        { status: 400 }
      );
    }

    // Get primary store
    const store = await prisma.store.findFirst({
      where: { isActive: true },
    });

    if (!store) {
      return NextResponse.json(
        { error: "No hay una tienda activa disponible" },
        { status: 500 }
      );
    }

    // Calculate subtotal
    const subtotal = items.reduce(
      (sum: number, item: any) => sum + item.product.price * item.quantity,
      0
    );

    const deliveryFee = type === "DELIVERY" ? store.deliveryFee : 0;
    const tax = subtotal * 0.06;
    const tipAmount = Number(tip) || 0;
    const total = subtotal + deliveryFee + tax + tipAmount;

    // Generate readable random order number: MM-XXXX
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `MM-${randomNum}`;

    // Create Order with Items in Prisma
    const order = await prisma.order.create({
      data: {
        orderNumber,
        storeId: store.id,
        customerName,
        customerEmail: customerEmail || "cliente@ejemplo.com",
        customerPhone,
        type: type || "DELIVERY",
        status: "PENDING",
        subtotal,
        deliveryFee,
        tax,
        tip: tipAmount,
        total,
        paymentStatus: "PAID",
        paymentMethod: paymentMethod || "CARD",
        deliveryNotes: type === "DELIVERY" ? `${deliveryAddress}. Notas: ${deliveryNotes || "Sin notas"}` : null,
        pickupTime: type === "PICKUP" ? pickupTime || "Lo antes posible" : null,
        items: {
          create: items.map((item: any) => ({
            productId: item.product.id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
            imageUrl: item.product.imageUrl,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Error al procesar el pedido", details: error?.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ orders });
  } catch (error: any) {
    return NextResponse.json({ error: "Error fetching orders" }, { status: 500 });
  }
}
