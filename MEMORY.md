# MEMORY — MEGAMART

## 🎯 Objetivo del Proyecto
Plataforma web de delivery y pickup on-demand para supermercado (estilo Instacart/Walmart/Rappi).
- **Fase 1 (ACTUAL):** Preview funcional completo con datos ficticios — 1 tienda en Alexandria, Virginia, EE.UU.
- **Fase 2:** Conectar inventario real del POS (~50,000 SKUs)
- **Fase 3:** Multi-tienda / marketplace multi-vendor
- **Fase 4:** Apps nativas iOS y Android

**Idea central:** El cliente navega el catálogo organizado por categorías, agrega productos al carrito con feedback visual inmediato, elige entre Delivery ($3.99 o Gratis > $35) y Pickup en tienda, completa el checkout seguro en español con dirección en Virginia y simulación de Stripe / Apple Pay / Efectivo, y sigue el estado de su pedido en tiempo real. La tienda cuenta con un panel de administración en vivo con alertas sonoras Web Audio, notificaciones push del navegador, y gestión rápida de inventario y pedidos.

## 🏗️ Stack / Tecnologías
| Capa | Tecnología |
|------|------------|
| **Frontend** | Next.js 14 (App Router) + React 18 + TypeScript |
| **Estilos & Diseño** | Tailwind CSS con tokens de marca propios + Google Fonts (Outfit & Plus Jakarta Sans) |
| **Estado cliente** | Zustand con persistencia en localStorage (carrito y drawer UI) |
| **Backend** | Next.js API Routes (monolito modular) |
| **Base de datos** | SQLite (`dev.db`) con Prisma ORM (diseñado para migración directa a PostgreSQL) |
| **Mapa** | Leaflet JS interactivo con OpenStreetMap y geolocalizador de distancia a tienda |
| **Pagos** | Formulario Checkout seguro con soporte visual para Tarjeta (Stripe), Apple Pay y Efectivo |
| **Realtime & Alertas** | Web Audio API (chime sintetizado) + Web Notifications API + polling reactivo |
| **Efectos** | Canvas-confetti al confirmar pedido |

## 🎨 Identidad de Marca
- **Logo:** ✅ Logo oficial integrado — Cabeza de vaca café realista con cuernos saliendo de óvalo verde con borde dorado. "Mega" en rojo cursivo 3D y "mart" en azul.
- **Paleta oficial aplicada:**
  - Rojo principal: `#E31E24` (acciones primarias, botones, ofertas, precios)
  - Azul secundario: `#1B4DA1` (banners de confianza, acentos corporativos)
  - Dorado / Amarillo: `#F5C518` (badges de tradición, Panadería, estrellas)
  - Verde Fresco: `#3A9E3A` (frescura, garantía, disponibilidad)
  - Crema / Fondo: `#FAF9F6` & `#FFFFFF`
  - Texto principal: `#1A1A1A`
- **Tipografía:** Display *Outfit* para títulos con personalidad + Body *Plus Jakarta Sans* para legibilidad ultra limpia de precios y descripciones.
- **Tono:** Cálido, profesional, tradicional y cercano. Cero estética genérica de IA.

## 📁 Estructura de Archivos
```
MEGAMART/
├── MEMORY.md
├── MEGAMART_PROYECTO (1).md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
├── .env
├── prisma/
│   ├── schema.prisma            # Modelos: Store, Category, Product, User, Address, Order, OrderItem
│   └── seed.ts                  # Seed con tienda en Alexandria VA, 7 categorías, 21 productos y 2 órdenes
├── public/
│   └── images/
│       └── logo-megamart.png    # Logo oficial recibido
└── src/
    ├── app/
    │   ├── globals.css          # Tipografías, utilidades, estilos Leaflet
    │   ├── layout.tsx           # RootLayout con Header, Footer, MobileNav, CartDrawer, QuickViewModal
    │   ├── page.tsx             # Homepage: Hero, Categorías, Ofertas, Panadería, Carnicería, Mapa
    │   ├── catalog/page.tsx     # Catálogo con filtros por categoría, búsqueda y ordenación
    │   ├── checkout/page.tsx    # Checkout seguro con dirección en VA, métodos de pago y confetti
    │   ├── orders/[id]/page.tsx # Seguimiento de pedido en tiempo real con 5 etapas visuales
    │   ├── admin/page.tsx       # Dashboard de tienda: Pedidos en vivo, alertas sonoras, gestión stock
    │   └── api/
    │       ├── orders/route.ts                    # Creación y listado de pedidos
    │       ├── admin/orders/[id]/status/route.ts  # Actualización de estados (PENDING → PREPARING → READY/ON_THE_WAY → DELIVERED)
    │       └── admin/products/route.ts            # CRUD de productos y actualización de stock/precio
    ├── components/
    │   ├── Header.tsx           # Header con logo oficial, buscador, selector de sucursal y carrito
    │   ├── Footer.tsx           # Footer con información de Virginia, horarios y garantías
    │   ├── MobileNav.tsx        # Barra de navegación inferior fija para móviles (mobile-first)
    │   ├── HeroBanner.tsx       # Hero con selector Delivery/Pickup, promo panadería y badges
    │   ├── CategorySlider.tsx   # Grid interactivo de 7 categorías con íconos temáticos
    │   ├── ProductCard.tsx      # Card de producto con zoom, badges, precio en USD y stepper interactivo
    │   ├── StoreMap.tsx         # Mapa interactivo Leaflet con geolocalización y cálculo de distancia
    │   ├── StoreMapInner.tsx    # Instancia nativa Leaflet L.map
    │   ├── CartDrawer.tsx       # Drawer lateral con cálculo de subtotal, propinas y barra de envío gratis
    │   └── QuickViewModal.tsx   # Modal de vista rápida de producto
    ├── lib/
    │   ├── prisma.ts            # Singleton PrismaClient
    │   └── utils.ts             # Utilidades cn() y formateo de precios en USD
    └── stores/
        ├── cartStore.ts         # Store Zustand de carrito con persistencia en localStorage
        └── uiStore.ts           # Store Zustand para drawer de carrito y vista rápida
```

## ✅ Hecho (Changelog)
| Fecha | Qué se hizo |
|-------|-------------|
| 2026-08-20 | Documento de especificación del proyecto analizado (477 líneas). |
| 2026-08-20 | `MEMORY.md` creado como memoria persistente. |
| 2026-08-20 | Logo oficial guardado en `public/images/logo-megamart.png`. |
| 2026-08-20 | Decisiones confirmadas: SQLite para preview, Leaflet para mapa, UI de checkout primero, idioma español principal. |
| 2026-08-20 | Setup de Next.js 14 + Tailwind CSS + Prisma completado con éxito. |
| 2026-08-20 | Sistema de diseño implementado con tokens de marca en `tailwind.config.ts` y fuentes Google Fonts. |
| 2026-08-20 | Base de datos SQLite inicializada y poblada con 21 productos, 7 categorías, tienda y 2 pedidos de prueba (`prisma/seed.ts`). |
| 2026-08-20 | Componentes UI desarrollados: Header, Footer, MobileNav, HeroBanner, CategorySlider, ProductCard, StoreMap, CartDrawer, QuickViewModal. |
| 2026-08-20 | Catálogo con filtros y búsqueda (`/catalog`). |
| 2026-08-20 | Flujo de Checkout con selector Delivery/Pickup, formulario Virginia, opciones de pago y confetti (`/checkout`). |
| 2026-08-20 | Página de seguimiento de pedidos en vivo con 5 estados (`/orders/[id]`). |
| 2026-08-20 | Panel de administración de tienda con recepción en vivo de pedidos, avisos sonoros Web Audio, notificaciones push y tabla de stock (`/admin`). |
| 2026-08-20 | Compilación de producción `npm run build` ejecutada con éxito (9/9 páginas estáticas y dinámicas compiladas). |
| 2026-08-20 | Servidor de desarrollo `npm run dev` corriendo en `http://localhost:3000`. |
| 2026-08-20 | Pruebas end-to-end completas realizadas en el navegador registrando pedidos y cambiando estados. |
| 2026-08-20 | Logo optimizado: se eliminaron los márgenes blancos, se hizo el fondo 100% transparente y se ajustó la proporción para que la vaca y el texto resalten sin alterar la altura del header. |
| 2026-08-20 | Creado `StoreLocationModal`: al hacer clic en la dirección del header ("Alexandria, Virginia • Ver Mapa") o en los enlaces de la tienda, se abre un modal interactivo con el mapa Leaflet, horarios, teléfono, calculadora de distancia y botón de Pickup. |
| 2026-08-20 | Pin del Torito personalizado: se creó `public/images/torito-pin.png` y se integró como marcador oficial en el mapa Leaflet con animación de pulso y marco dorado. |
| 2026-08-20 | Modal de Bienvenida y Selección de Ubicación Inicial (`InitialLocationModal`): cuando un usuario nuevo abre la app por primera vez, aparece una ventana modal estilo Instacart/Rappi con el Torito y el mapa para seleccionar Delivery o Pickup. |
| 2026-08-20 | Corregido error de hidratación en React/Next.js agregando guardas `mounted` en todos los componentes que leen el estado persistido del carrito en localStorage. |
| 2026-08-20 | Corregidas todas las importaciones de hooks (`useState`, `useEffect`) en `HeroBanner`, `MobileNav`, `ProductCard` y `Header`. Verificado con `npx tsc --noEmit` (0 errores). |
| 2026-08-20 | Repositorio GitHub actualizado y sincronizado en: `https://github.com/stev12O/megamart-platform`. |
| 2026-08-20 | Generado túnel público seguro HTTPS para pruebas móviles inmediatas y configuración de Vercel lista con auto-seed en build. |

## 🚧 En Progreso
- [ ] Revisión visual y feedback del usuario sobre la experiencia completa

## 📋 Pendiente / TODO
- [ ] Conectar Stripe API keys cuando el usuario las configure en `.env`
- [ ] Conectar bot de Telegram (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`) para alertas a teléfono
- [ ] Conectar servicio de emails transaccionales con Resend (`RESEND_API_KEY`)
- [ ] Fase 2: Sincronización con POS del supermercado

## ⚠️ Decisiones Importantes
| Decisión | Motivo |
|----------|--------|
| Arquitectura multi-tienda desde el día 1 | Cada `Product` y `Order` tiene `storeId`. Evita reescribir en Fase 3 |
| Monolito modular (API Routes en Next.js) | Simple para el preview, escalable y mantenible |
| SQLite para el preview | Cero configuración externa necesaria para probar inmediatamente; Prisma permite migrar a Postgres cambiando el provider en `schema.prisma` |
| Leaflet JS + OpenStreetMap para mapa | Gratuito, sin costo por API calls, con cálculo de distancia por geolocalización |
| Español como idioma principal | Dirigido al mercado hispano de Virginia, EE.UU. con precios en USD |
| Web Audio API para alertas sonoras del admin | No requiere descargar archivos de audio pesados y funciona nativamente en todos los navegadores |
| Mobile-first con `MobileNav` fija inferior | Facilita la compra desde celulares como una app nativa |

## 🐛 Problemas Conocidos / Bugs
- Ninguno. Todo el flujo (Home → Catálogo → Carrito → Checkout → Seguimiento → Admin) verificado y funcionando sin errores.
