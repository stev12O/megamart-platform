import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al obtener productos" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, originalPrice, imageUrl, stock, unit, categoryId, badge } = body;

    const store = await prisma.store.findFirst({ where: { isActive: true } });
    if (!store) {
      return NextResponse.json({ error: "No store found" }, { status: 500 });
    }

    const product = await prisma.product.create({
      data: {
        storeId: store.id,
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        imageUrl,
        stock: parseInt(stock) || 50,
        unit: unit || "unidad",
        categoryId,
        badge,
        isAvailable: true,
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, product });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al crear producto", details: error?.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { id, stock, price, isAvailable } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        ...(stock !== undefined && { stock: parseInt(stock) }),
        ...(price !== undefined && { price: parseFloat(price) }),
        ...(isAvailable !== undefined && { isAvailable }),
      },
      include: { category: true },
    });

    return NextResponse.json({ success: true, product: updated });
  } catch (error: any) {
    return NextResponse.json({ error: "Error al actualizar producto" }, { status: 500 });
  }
}
