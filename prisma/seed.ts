import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed for MEGAMART...");

  // Clean existing data
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.address.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.store.deleteMany({});

  // 1. Create Main Store
  const store = await prisma.store.create({
    data: {
      name: "MEGAMART - Sucursal Principal Alexandria",
      slug: "megamart-alexandria",
      address: "7850 Richmond Hwy, Alexandria, VA 22306",
      latitude: 38.7425,
      longitude: -77.1032,
      phone: "+1 (703) 555-0199",
      logoUrl: "/images/logo-megamart.png",
      isActive: true,
      deliveryFee: 3.99,
      minOrder: 15.0,
    },
  });

  console.log(`✅ Store created: ${store.name}`);

  // 2. Create Categories
  const categoriesData = [
    {
      name: "Panadería & Tortillas",
      slug: "panaderia",
      icon: "Croissant",
      order: 1,
    },
    {
      name: "Carnicería Fresca",
      slug: "carnes",
      icon: "Beef",
      order: 2,
    },
    {
      name: "Frutas & Verduras",
      slug: "frutas-verduras",
      icon: "Apple",
      order: 3,
    },
    {
      name: "Lácteos & Quesos",
      slug: "lacteos",
      icon: "Milk",
      order: 4,
    },
    {
      name: "Abarrotes & Despensa",
      slug: "despensa",
      icon: "ShoppingBag",
      order: 5,
    },
    {
      name: "Bebidas & Jugos",
      slug: "bebidas",
      icon: "Coffee",
      order: 6,
    },
    {
      name: "Limpieza & Hogar",
      slug: "limpieza",
      icon: "Sparkles",
      order: 7,
    },
  ];

  const categories: Record<string, string> = {};

  for (const cat of categoriesData) {
    const created = await prisma.category.create({
      data: cat,
    });
    categories[cat.slug] = created.id;
  }

  console.log(`✅ Created ${Object.keys(categories).length} categories`);

  // 3. Create Sample Products
  const products = [
    // Panadería
    {
      name: "Conchas Tradicionales de Vainilla y Chocolate (Pack 4)",
      description: "Pan dulce mexicano horneado diariamente con la receta tradicional de la casa.",
      price: 4.50,
      originalPrice: 5.50,
      imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
      stock: 45,
      unit: "paquete 4u",
      isFeatured: true,
      badge: "Más Vendido",
      categoryId: categories["panaderia"],
    },
    {
      name: "Bolillo Crujiente Recién Horneado",
      description: "Bolillo artesanal crujiente por fuera y suave por dentro, ideal para tortas.",
      price: 0.65,
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=800&q=80",
      stock: 120,
      unit: "unidad",
      isFeatured: false,
      badge: "Horneado Hoy",
      categoryId: categories["panaderia"],
    },
    {
      name: "Tortillas de Maíz Nixtamalizadas (800g)",
      description: "Tortillas 100% de maíz blanco hechas al día, perfectas para calentar en comal.",
      price: 2.49,
      originalPrice: 2.99,
      imageUrl: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&w=800&q=80",
      stock: 80,
      unit: "paquete",
      isFeatured: true,
      badge: "Fresco",
      categoryId: categories["panaderia"],
    },

    // Carnicería
    {
      name: "Carne Molida de Res Premium 85/15",
      description: "Corte de res selecto molido fresco del día, ideal para hamburguesas y guisados.",
      price: 5.99,
      originalPrice: 6.99,
      imageUrl: "https://images.unsplash.com/photo-1588347818036-558601350947?auto=format&fit=crop&w=800&q=80",
      stock: 35,
      unit: "lb",
      isFeatured: true,
      badge: "Oferta",
      categoryId: categories["carnes"],
    },
    {
      name: "Pechuga de Pollo Deshuesada y Sin Piel",
      description: "Pechuga de pollo fresca de granja, limpia y lista para sazonar.",
      price: 3.89,
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=800&q=80",
      stock: 50,
      unit: "lb",
      isFeatured: true,
      badge: "Calidad Selecta",
      categoryId: categories["carnes"],
    },
    {
      name: "Fajitas de Res Marinadas estilo Norteño",
      description: "Arrachera marinada con jugo de limón, cebolla y especias tradicionales.",
      price: 8.99,
      originalPrice: 10.50,
      imageUrl: "https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80",
      stock: 25,
      unit: "lb",
      isFeatured: false,
      badge: "Especialidad",
      categoryId: categories["carnes"],
    },

    // Frutas y Verduras
    {
      name: "Aguacate Hass Maduro Seleccionado",
      description: "Aguacate cremoso en punto perfecto para guacamole o ensaladas.",
      price: 1.25,
      originalPrice: 1.69,
      imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
      stock: 90,
      unit: "unidad",
      isFeatured: true,
      badge: "Super Oferta",
      categoryId: categories["frutas-verduras"],
    },
    {
      name: "Tomate Roma Rojo Maduro",
      description: "Tomates firmes, dulces y jugosos para salsas y cocina diaria.",
      price: 1.39,
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80",
      stock: 75,
      unit: "lb",
      isFeatured: false,
      badge: "De Temporada",
      categoryId: categories["frutas-verduras"],
    },
    {
      name: "Plátano Maduro Dulce",
      description: "Plátanos amarillos ideales para freír o comer frescos.",
      price: 0.89,
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?auto=format&fit=crop&w=800&q=80",
      stock: 110,
      unit: "lb",
      isFeatured: false,
      badge: null,
      categoryId: categories["frutas-verduras"],
    },
    {
      name: "Limón Verde Mexicano (Limes)",
      description: "Limones jugosos con alto rendimiento para aguas frescas y sazón.",
      price: 2.29,
      originalPrice: 2.89,
      imageUrl: "https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=800&q=80",
      stock: 60,
      unit: "bolsa 2lb",
      isFeatured: false,
      badge: "Esencial",
      categoryId: categories["frutas-verduras"],
    },

    // Lácteos & Quesos
    {
      name: "Queso Fresco Casero Centroamericano (400g)",
      description: "Queso suave y salado artesanal, ideal para frijoles, plátanos y pupusas.",
      price: 4.89,
      originalPrice: 5.50,
      imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80",
      stock: 40,
      unit: "pieza",
      isFeatured: true,
      badge: "Favorito Latino",
      categoryId: categories["lacteos"],
    },
    {
      name: "Crema Salvadoreña Auténtica (16 oz)",
      description: "Crema espesa y cremosa con el toque auténtico de Centroamérica.",
      price: 3.69,
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1528750997573-59b89d56f4f7?auto=format&fit=crop&w=800&q=80",
      stock: 55,
      unit: "tarro",
      isFeatured: false,
      badge: null,
      categoryId: categories["lacteos"],
    },
    {
      name: "Leche Entera Grado A (1 Galón)",
      description: "Leche pasteurizada enriquecida con vitaminas A y D.",
      price: 4.19,
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=800&q=80",
      stock: 65,
      unit: "galón",
      isFeatured: false,
      badge: null,
      categoryId: categories["lacteos"],
    },

    // Abarrotes & Despensa
    {
      name: "Arroz Grano Extra Largo Jasmine (5 lbs)",
      description: "Arroz seleccionado de cocción esponjosa y aroma suave.",
      price: 6.49,
      originalPrice: 7.99,
      imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80",
      stock: 70,
      unit: "bolsa 5lb",
      isFeatured: true,
      badge: "Ahorro",
      categoryId: categories["despensa"],
    },
    {
      name: "Frijoles Rojos de Seda (32 oz)",
      description: "Frijol suave de grano fino para cocer tradicional.",
      price: 2.99,
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80",
      stock: 85,
      unit: "paquete",
      isFeatured: false,
      badge: null,
      categoryId: categories["despensa"],
    },
    {
      name: "Aceite de Oliva Extra Virgen Puro (750 ml)",
      description: "Prensado en frío de primera calidad para ensaladas y cocina gourmet.",
      price: 8.99,
      originalPrice: 11.50,
      imageUrl: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
      stock: 30,
      unit: "botella",
      isFeatured: false,
      badge: "Premium",
      categoryId: categories["despensa"],
    },

    // Bebidas
    {
      name: "Coca-Cola Mexicana con Azúcar de Caña (500ml)",
      description: "La auténtica fórmula en botella de vidrio retornable.",
      price: 2.50,
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
      stock: 150,
      unit: "botella 500ml",
      isFeatured: true,
      badge: "Clásico",
      categoryId: categories["bebidas"],
    },
    {
      name: "Jarritos de Mandarina Refresco de Fruta (370ml)",
      description: "Refresco gasificado 100% con sabor natural a fruta cítrica.",
      price: 1.65,
      originalPrice: 1.99,
      imageUrl: "https://images.unsplash.com/photo-1527661591475-527312dd65f5?auto=format&fit=crop&w=800&q=80",
      stock: 100,
      unit: "botella",
      isFeatured: false,
      badge: null,
      categoryId: categories["bebidas"],
    },
    {
      name: "Agua Mineral Gasificada Topo Chico (355ml)",
      description: "Agua mineralizada con gas natural proveniente de manantial.",
      price: 2.19,
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1559839914-ba2a333f2e14?auto=format&fit=crop&w=800&q=80",
      stock: 80,
      unit: "botella vidrio",
      isFeatured: false,
      badge: "Popular",
      categoryId: categories["bebidas"],
    },

    // Limpieza
    {
      name: "Detergente Líquido Aroma Floral Intenso (64 oz)",
      description: "Elimina manchas difíciles y deja una frescura duradera en la ropa.",
      price: 8.49,
      originalPrice: 9.99,
      imageUrl: "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=800&q=80",
      stock: 45,
      unit: "galón 64oz",
      isFeatured: false,
      badge: "Ahorro",
      categoryId: categories["limpieza"],
    },
    {
      name: "Jabón Líquido para Trastes Desengrasante Limón",
      description: "Fórmula concentrada que corta grasa al instante y rinde el doble.",
      price: 2.79,
      originalPrice: null,
      imageUrl: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80",
      stock: 60,
      unit: "botella 750ml",
      isFeatured: false,
      badge: null,
      categoryId: categories["limpieza"],
    },
  ];

  for (const prod of products) {
    await prisma.product.create({
      data: {
        ...prod,
        storeId: store.id,
      },
    });
  }

  console.log(`✅ Created ${products.length} sample products`);

  // 4. Create Demo Admin & Demo Customer
  const adminUser = await prisma.user.create({
    data: {
      name: "Gerente Megamart",
      email: "admin@megamart.com",
      phone: "+1 (703) 555-0100",
      role: "STORE_ADMIN",
    },
  });

  const customerUser = await prisma.user.create({
    data: {
      name: "Carlos Mendoza",
      email: "carlos.mendoza@email.com",
      phone: "+1 (703) 555-0144",
      role: "CUSTOMER",
    },
  });

  const customerAddress = await prisma.address.create({
    data: {
      userId: customerUser.id,
      label: "Casa",
      street: "2410 Fort Drive, Apt 304",
      city: "Alexandria",
      state: "VA",
      zipCode: "22303",
      notes: "Dejar en la puerta principal, tocar timbre #304",
      isDefault: true,
    },
  });

  // 5. Create 2 Sample Orders (for the admin preview live feed)
  const sampleOrder1 = await prisma.order.create({
    data: {
      orderNumber: "MM-7281",
      storeId: store.id,
      userId: customerUser.id,
      customerName: "Carlos Mendoza",
      customerEmail: "carlos.mendoza@email.com",
      customerPhone: "+1 (703) 555-0144",
      type: "DELIVERY",
      status: "PREPARING",
      subtotal: 23.86,
      deliveryFee: 3.99,
      tip: 3.00,
      tax: 1.43,
      total: 32.28,
      paymentStatus: "PAID",
      paymentMethod: "CARD",
      addressId: customerAddress.id,
      deliveryNotes: "Dejar en la puerta principal",
      items: {
        create: [
          {
            name: "Carne Molida de Res Premium 85/15",
            price: 5.99,
            quantity: 2,
            imageUrl: "https://images.unsplash.com/photo-1588347818036-558601350947?auto=format&fit=crop&w=800&q=80",
          },
          {
            name: "Conchas Tradicionales de Vainilla y Chocolate (Pack 4)",
            price: 4.50,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
          },
          {
            name: "Aguacate Hass Maduro Seleccionado",
            price: 1.25,
            quantity: 4,
            imageUrl: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=800&q=80",
          },
          {
            name: "Coca-Cola Mexicana (500ml)",
            price: 2.50,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    },
  });

  const sampleOrder2 = await prisma.order.create({
    data: {
      orderNumber: "MM-7282",
      storeId: store.id,
      customerName: "María Elena García",
      customerEmail: "maria.garcia@email.com",
      customerPhone: "+1 (703) 555-0188",
      type: "PICKUP",
      status: "PENDING",
      subtotal: 18.57,
      deliveryFee: 0,
      tip: 2.00,
      tax: 1.11,
      total: 21.68,
      paymentStatus: "PAID",
      paymentMethod: "APPLE_PAY",
      pickupTime: "Hoy a las 6:30 PM",
      items: {
        create: [
          {
            name: "Queso Fresco Casero Centroamericano (400g)",
            price: 4.89,
            quantity: 2,
            imageUrl: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=800&q=80",
          },
          {
            name: "Tortillas de Maíz Nixtamalizadas (800g)",
            price: 2.49,
            quantity: 2,
            imageUrl: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&w=800&q=80",
          },
          {
            name: "Frijoles Rojos de Seda (32 oz)",
            price: 2.99,
            quantity: 1,
            imageUrl: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=800&q=80",
          },
        ],
      },
    },
  });

  console.log("✅ Created 2 initial orders for testing (MM-7281, MM-7282)");
  console.log("✨ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
