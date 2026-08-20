# 🐂 MEGAMART — Plataforma de Delivery y Pickup On-Demand

> **Documento de proyecto para Antigravity**
> Versión 1.0 — Preview funcional con arquitectura escalable a multi-tienda
> Tipo: On-demand delivery platform / Q-commerce (estilo Walmart, Instacart, Rappi)

---

## 1. RESUMEN DEL PROYECTO

MEGAMART es una plataforma web donde los clientes pueden:
- Ver el supermercado más cercano en un **mapa**
- Navegar el catálogo de productos por categorías
- Agregar productos al carrito y hacer un pedido en línea
- Elegir entre **Delivery** (repartidor propio del súper) o **Pickup** (recoger en tienda)
- Pagar con **tarjeta / Apple Pay** (operación en Virginia, EE.UU.)
- Recibir notificaciones del estado de su pedido

Cuando entra un pedido, se notifica automáticamente a:
- **Panel de administración** de la tienda (con sonido + notificación push del navegador)
- **Telegram** del dueño/tienda (respaldo)
- **Cliente** (estados por pantalla + email)

> **IMPORTANTE PARA ESTE PREVIEW:** Usaremos datos **ficticios** (pocos productos de ejemplo). El objetivo es mostrar la experiencia completa para validar la idea con el cliente antes de conectar el inventario real.

---

## 2. VISIÓN DEL NEGOCIO (para entender las decisiones técnicas)

Aunque arrancamos con **una sola tienda MEGAMART**, TODA la arquitectura debe diseñarse desde el día uno para soportar **múltiples supermercados** (multi-tienda / marketplace). Cada tienda tendrá su propio inventario, sus repartidores, su panel de admin y su ubicación en el mapa.

**Roadmap:**
1. **Fase 1 (AHORA):** Preview web funcional con datos ficticios — 1 tienda
2. **Fase 2:** Conectar inventario real del POS del supermercado
3. **Fase 3:** Escalar a varias tiendas (multi-vendor)
4. **Fase 4:** Apps nativas iPhone y Android

> El backend de notificaciones y la base de datos deben construirse pensando en la Fase 4 desde ahora, para no reescribir después.

---

## 3. IDENTIDAD DE MARCA

**Logo:** Cabeza de vaca café sobre óvalo verde con borde dorado. Texto "Megamart" en rojo (Mega) y azul (mart).

### Paleta de colores oficial

| Color | Uso | Hex aproximado |
|-------|-----|----------------|
| 🔴 Rojo intenso | Color principal, botones de acción, precios, ofertas | `#E31E24` |
| 🔵 Azul | Color secundario, enlaces, texto de marca | `#1B4DA1` |
| 🟡 Amarillo/Dorado | Acentos, badges, bordes destacados | `#F5B800` |
| 🟢 Verde | Detalles, categoría "frescos", fondo del óvalo del logo | `#3A9E3A` |
| ⚪ Blanco/Crema | Fondos, espacios limpios | `#FFFFFF` / `#FBF7F0` |
| ⚫ Negro suave | Texto principal | `#1A1A1A` |

**Estilo visual:** Limpio, moderno, confiable, con toques de "tradición" y calidez (el súper se vende como "hecho con tradición, sabor tradicional"). Tipografía redondeada y amigable para títulos, legible para producto. Nada frío ni corporativo genérico — debe sentirse cercano y familiar.

---

## 3.5 SISTEMA DE DISEÑO PREMIUM (reglas obligatorias — leer antes de tocar el frontend)

> **Objetivo: que NO se vea hecho por IA.** El diseño debe verse como el de una app profesional real (Instacart, Whole Foods, Gorillas), no como una plantilla genérica. Estas son reglas duras, no sugerencias.

### Filosofía
Actúa como el diseñador líder de un estudio que le da a cada cliente una identidad visual que no se puede confundir con ninguna otra. El cliente ya rechazó lo que se siente "de plantilla". Toma decisiones deliberadas y con criterio sobre color, tipografía y layout, específicas para MEGAMART (un supermercado familiar con tradición). La calidez y la confianza son el alma de la marca.

### ❌ PROHIBIDO (esto es lo que grita "hecho por IA")
- **NADA de gradientes morados/violetas** ni gradientes decorativos porque sí.
- **NADA de íconos genéricos por defecto** (los típicos de librerías tipo Feather/Lucide puestos en todos lados sin razón). Si un ícono no aporta significado real, se elimina.
- **NADA de flechas decorativas** ni "→" de adorno en botones y títulos.
- **NADA de emojis** usados como íconos de interfaz.
- **NADA de marcadores numerados 01 / 02 / 03** a menos que el contenido sea realmente una secuencia (un proceso paso a paso).
- **NADA de fondo crema `#F4F1EA` con serif de alto contraste y acento terracota** — ese es EL look por defecto de IA, lo detecta cualquiera.
- **NADA de "card con sombra flotante genérica"** repetida en todo. Las sombras deben ser sutiles e intencionales.
- **NADA de animaciones dispersas** por todos lados. El exceso de animación grita IA.
- **NADA de bordes redondeados exagerados** ni inconsistentes. Definir UN radio y respetarlo.

### ✅ OBLIGATORIO (así se ve premium)
- **Tipografía con personalidad.** Elegir dos familias deliberadas: una display con carácter para títulos (usada con restricción) y una body limpísima y legible para producto/precios. NO usar la misma fuente para todo. Sugerencia: una sans geométrica cálida y confiable (ej. *Sora*, *Bricolage Grotesque* o *Cabinet Grotesk* para display; *Inter* o *General Sans* para body). Definir una escala tipográfica clara con pesos intencionales.
- **El color manda con disciplina.** El rojo MEGAMART `#E31E24` es el acento de acción (botones comprar, precios, ofertas) — usado con fuerza pero sin saturar. Blancos y crema muy suave para respirar. Azul y verde como apoyo, no protagonistas. El dorado solo para detalles premium (badges de calidad, "hecho con tradición").
- **Espaciado generoso y sistema de grid consistente.** El aire (whitespace) es lo que separa lo premium de lo amateur. Definir una escala de espaciado (4/8/12/16/24/32/48/64) y respetarla religiosamente.
- **Jerarquía visual clara.** El ojo debe saber siempre qué es lo más importante. Precio y botón de compra siempre destacados.
- **Fotografía de producto grande y protagonista.** Los productos de comida se venden con imagen. Fotos limpias, bien encuadradas, fondo neutro.
- **Un solo elemento "firma" memorable.** Gastar la audacia en UN lugar (ej. el hero con la vaca de la marca integrada con elegancia, o un tratamiento tipográfico distintivo del logo). Todo lo demás, callado y disciplinado.
- **Microinteracciones sutiles y con propósito:** hover suave en productos, transición limpia al agregar al carrito, feedback claro al hacer una acción. Nada más.
- **Copy escrito como humano.** Los botones dicen exactamente qué hacen: "Agregar al carrito", "Pagar ahora", "Ver mi pedido". Voz activa, cercana, sin relleno. Los estados vacíos y errores hablan claro y guían ("Tu carrito está vacío — explora la panadería").

### Reglas de implementación de diseño
- **Definir tokens de diseño en `tailwind.config`:** los colores de marca, la escala de espaciado, el radio de bordes único, las sombras. Todo derivado de estos tokens, nada hardcodeado suelto.
- Cuidar la especificidad de los selectores CSS para que las clases no se cancelen entre sí (típico en paddings/márgenes entre secciones).
- Respetar accesibilidad como piso mínimo: foco visible en teclado, contraste suficiente, `prefers-reduced-motion` respetado.

### Referencia mental
Piensa en cómo se ven **Instacart, Gorillas, Getir, Whole Foods Market, o la app de Walmart** — limpias, con producto grande, precio claro, acción evidente, y una identidad de marca fuerte. Ese es el estándar. MEGAMART debe sentirse a ese nivel pero con su calidez familiar y su rojo característico.

---

## 4. STACK TECNOLÓGICO (decisiones ya tomadas)

> Elegido para ser profesional, escalable a móvil, y con buen soporte para mapas, pagos y notificaciones en tiempo real.

### Frontend
- **Next.js 14** (App Router) + **React** + **TypeScript**
- **Tailwind CSS** para estilos (rápido de aplicar la paleta de marca)
- **shadcn/ui** para componentes base (botones, cards, modales)
- **Zustand** para el estado del carrito
- **React Query (TanStack Query)** para datos del servidor

### Backend
- **Next.js API Routes** (mismo proyecto, monolito modular) — simple para el preview, se puede separar después
- **PostgreSQL** como base de datos (soporta multi-tienda perfectamente)
- **Prisma** como ORM (define el esquema y migraciones fácil)

### Servicios clave
- **Mapa:** Google Maps JavaScript API (mostrar tienda cercana + geolocalización del cliente) — alternativa gratuita: Leaflet + OpenStreetMap
- **Pagos:** **Stripe** (soporta tarjeta + Apple Pay nativamente, ideal para EE.UU./Virginia)
- **Notificaciones tiempo real:** **Supabase Realtime** o **Pusher** (para el panel admin en vivo)
- **Web Push (navegador):** API nativa de notificaciones push
- **Telegram:** Bot de Telegram (Bot API) para avisar pedidos al dueño
- **Email:** **Resend** (moderno, fácil, buena entregabilidad)

### Autenticación
- **NextAuth.js** (Auth.js) — login de clientes y admins con roles

### Hosting recomendado
- **Vercel** (frontend + API, integración perfecta con Next.js) para el preview
- **Supabase** o **Neon** para la base de datos PostgreSQL

---

## 5. ROLES DE USUARIO

| Rol | Qué puede hacer |
|-----|-----------------|
| **Cliente** | Navegar catálogo, carrito, hacer pedido, pagar, ver estado del pedido, elegir delivery/pickup |
| **Admin de tienda** | Ver pedidos entrantes en tiempo real, cambiar estado del pedido, gestionar productos y stock, asignar repartidor |
| **Repartidor** | Ver pedidos asignados, marcar "recogido" y "entregado" (Fase 2+) |
| **Super Admin** | Gestionar TODAS las tiendas (Fase 3, multi-tienda) |

---

## 6. MODELO DE BASE DE DATOS (esquema Prisma)

> Diseñado desde ya para multi-tienda. Cada producto y pedido pertenece a una `Store`.

```prisma
// Tiendas (multi-tienda desde el día uno)
model Store {
  id          String    @id @default(cuid())
  name        String    // "MEGAMART - Sucursal Centro"
  slug        String    @unique
  address     String
  latitude    Float     // para el mapa
  longitude   Float
  phone       String
  logoUrl     String?
  isActive    Boolean   @default(true)
  deliveryFee Float     @default(0)
  minOrder    Float     @default(0)
  products    Product[]
  orders      Order[]
  createdAt   DateTime  @default(now())
}

// Categorías (Panadería, Lácteos, Frutas, etc.)
model Category {
  id        String    @id @default(cuid())
  name      String
  slug      String    @unique
  iconUrl   String?
  order     Int       @default(0)
  products  Product[]
}

// Productos
model Product {
  id           String   @id @default(cuid())
  storeId      String
  store        Store    @relation(fields: [storeId], references: [id])
  categoryId   String
  category     Category @relation(fields: [categoryId], references: [id])
  name         String
  description  String?
  price        Float
  imageUrl     String?
  stock        Int      @default(0)   // inventario en tiempo real
  unit         String   @default("unidad") // "kg", "unidad", "paquete"
  isAvailable  Boolean  @default(true)
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
}

// Clientes
model User {
  id        String   @id @default(cuid())
  name      String
  email     String   @unique
  phone     String?
  password  String?  // hasheado
  role      Role     @default(CUSTOMER)
  addresses Address[]
  orders    Order[]
  createdAt DateTime @default(now())
}

enum Role {
  CUSTOMER
  STORE_ADMIN
  DRIVER
  SUPER_ADMIN
}

// Direcciones de entrega del cliente
model Address {
  id        String  @id @default(cuid())
  userId    String
  user      User    @relation(fields: [userId], references: [id])
  label     String  // "Casa", "Trabajo"
  street    String
  city      String
  zipCode   String
  latitude  Float?
  longitude Float?
  isDefault Boolean @default(false)
}

// Pedidos
model Order {
  id            String       @id @default(cuid())
  storeId       String
  store         Store        @relation(fields: [storeId], references: [id])
  userId        String
  user          User         @relation(fields: [userId], references: [id])
  items         OrderItem[]
  type          OrderType    // DELIVERY o PICKUP
  status        OrderStatus  @default(PENDING)
  subtotal      Float
  deliveryFee   Float        @default(0)
  total         Float
  paymentStatus PaymentStatus @default(UNPAID)
  paymentId     String?      // ID de Stripe
  addressId     String?      // solo si es delivery
  notes         String?
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @updatedAt
}

model OrderItem {
  id        String  @id @default(cuid())
  orderId   String
  order     Order   @relation(fields: [orderId], references: [id])
  productId String
  name      String  // guardado por si el producto cambia después
  price     Float
  quantity  Int
}

enum OrderType {
  DELIVERY
  PICKUP
}

enum OrderStatus {
  PENDING      // recién llegó
  CONFIRMED    // tienda lo aceptó
  PREPARING    // preparando
  READY        // listo para pickup / listo para salir
  ON_THE_WAY   // repartidor en camino
  DELIVERED    // entregado
  CANCELLED
}

enum PaymentStatus {
  UNPAID
  PAID
  REFUNDED
}
```

---

## 7. PANTALLAS DEL PREVIEW (lo que se debe construir)

### A. Lado del CLIENTE (público)

1. **Home / Landing**
   - Header con logo MEGAMART, buscador, ícono de carrito, botón login
   - Banner hero con promo (estilo el flyer del pan dulce)
   - **Mapa mostrando la tienda MEGAMART más cercana** al cliente (usa su geolocalización)
   - Categorías destacadas (íconos: Panadería, Lácteos, Frutas, Carnes, Bebidas, Limpieza)
   - Productos destacados / en oferta

2. **Catálogo / Categoría**
   - Grid de productos con foto, nombre, precio, botón "Agregar al carrito"
   - Filtros por categoría, buscador
   - Indicador de stock ("Disponible" / "Últimas unidades")

3. **Detalle de producto**
   - Foto grande, descripción, precio, selector de cantidad, botón agregar

4. **Carrito**
   - Lista de productos, cantidades editables, subtotal
   - Selector: **Delivery** o **Pickup**
   - Si delivery: seleccionar dirección + mostrar costo de envío
   - Botón "Proceder al pago"

5. **Checkout**
   - Resumen del pedido
   - Formulario de pago con **Stripe** (tarjeta + Apple Pay)
   - Confirmación

6. **Seguimiento del pedido**
   - Barra de estados: Recibido → Confirmado → Preparando → Listo → En camino → Entregado
   - Actualización en tiempo real

### B. Panel de ADMIN de la tienda

1. **Dashboard de pedidos en vivo**
   - Lista de pedidos entrantes en tiempo real
   - **Sonido + notificación push del navegador** cuando entra un pedido nuevo
   - Cada pedido: cliente, productos, tipo (delivery/pickup), total, estado
   - Botones para cambiar estado (Confirmar → Preparando → Listo → etc.)

2. **Gestión de productos**
   - CRUD de productos (crear, editar, eliminar)
   - Editar stock, precio, disponibilidad
   - Subir imágenes

3. **Vista general**
   - Pedidos del día, ventas, productos con bajo stock

---

## 8. SISTEMA DE NOTIFICACIONES (crítico)

Cuando entra un pedido, se disparan 3 canales en paralelo:

| Destino | Canal | Cuándo |
|---------|-------|--------|
| Admin tienda | Panel en vivo + sonido + Web Push del navegador | Pedido nuevo entra |
| Dueño | **Telegram Bot** (mensaje con detalle del pedido) | Pedido nuevo entra |
| Cliente | Estados en pantalla (tiempo real) + Email | En cada cambio de estado |

**Implementación técnica:**
- Al crear un `Order`, un servicio de notificaciones envía a los 3 canales.
- **Telegram:** crear un bot con @BotFather, guardar el `BOT_TOKEN` y el `CHAT_ID` del dueño en variables de entorno. Enviar mensaje formateado con los productos y el total.
- **Web Push:** pedir permiso de notificación al admin al iniciar sesión, guardar la suscripción, disparar push al entrar pedido.
- **Realtime del panel:** Supabase Realtime o Pusher para que la lista de pedidos se actualice sin recargar.
- **Email:** Resend con plantilla de "Pedido recibido / En camino / Entregado".

> Este diseño ya deja listo el terreno para agregar **push nativo de iPhone/Android** en la Fase 4 sin rehacer nada — solo se suma un canal más al mismo servicio.

---

## 9. INTEGRACIÓN CON EL POS (Fase 2 — documentar, no construir aún)

El supermercado probablemente tiene un **sistema POS** que maneja los 50,000 productos y su inventario. Así operan los supermercados grandes: **el POS es la fuente de verdad del inventario, no la web.**

**Cómo se conectará (más adelante):**
- La web NO inventa el stock. Se **sincroniza** con el POS.
- Opción A: el POS expone una **API** → la web consulta stock/precios en tiempo real.
- Opción B: exportación **CSV/Excel** periódica → se importa a la base de datos (sincronización cada X horas).
- Opción C: webhook del POS que avisa cuando cambia el stock.

> **Acción pendiente:** preguntar al supermercado qué POS usan y si tiene API o exportación. Por ahora el preview usa productos ficticios cargados manualmente.

**Diseño defensivo:** el campo `stock` en la tabla `Product` ya existe. Cuando llegue la integración, solo se llena desde el POS en lugar de manualmente.

---

## 10. DATOS FICTICIOS PARA EL PREVIEW (seed)

Cargar ~15-20 productos de ejemplo repartidos en categorías, para que se vea real:

- **Panadería:** Pan dulce, Concha, Bolillo, Croissant
- **Lácteos:** Leche entera, Queso fresco, Yogurt, Mantequilla
- **Frutas y Verduras:** Plátano, Manzana, Tomate, Aguacate
- **Carnes:** Pollo entero, Carne molida, Chuleta
- **Bebidas:** Coca-Cola, Agua, Jugo de naranja
- **Limpieza:** Detergente, Jabón, Papel higiénico

Cada uno con foto (placeholder o imagen real), precio en USD, stock ficticio.

Una tienda de ejemplo:
- **MEGAMART - Sucursal Principal**, dirección en Virginia, con coordenadas reales para que aparezca en el mapa.

---

## 11. VARIABLES DE ENTORNO NECESARIAS

```env
# Base de datos
DATABASE_URL=

# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=

# Stripe (pagos)
STRIPE_SECRET_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_WEBHOOK_SECRET=

# Telegram
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# Email (Resend)
RESEND_API_KEY=

# Realtime (Pusher o Supabase)
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
```

---

## 12. ORDEN DE CONSTRUCCIÓN SUGERIDO (para Antigravity)

1. Setup: Next.js + Tailwind + Prisma + PostgreSQL
2. **Definir el sistema de diseño primero** (sección 3.5): tokens en `tailwind.config` (colores de marca, escala de espaciado, radio único, sombras, tipografías con `next/font`). Esto va ANTES de cualquier pantalla para que todo el frontend salga consistente y premium.
3. Modelo de base de datos (schema Prisma) + seed con datos ficticios
4. Home con header, hero y **mapa de tienda cercana**
5. Catálogo + detalle de producto
6. Carrito (Zustand) + selector delivery/pickup
7. Checkout con Stripe (tarjeta + Apple Pay)
8. Seguimiento de pedido con estados
9. Panel admin: dashboard de pedidos en vivo + sonido + Web Push
10. CRUD de productos en admin
11. Notificaciones Telegram + Email
12. Pulido visual y responsive (móvil primero)

---

## 12.5 OPTIMIZACIÓN PARA DISPOSITIVOS Y RENDIMIENTO (obligatorio)

> No basta con "responsive". Una app profesional carga rápido y se siente fluida en cualquier celular, incluso con internet lento. Reglas:

### Adaptación a pantallas
- **Mobile-first real:** diseñar primero para celular (la mayoría de pedidos vienen de ahí) y luego escalar a tablet y desktop. No al revés.
- **Breakpoints definidos:** móvil (`< 640px`), tablet (`640–1024px`), desktop (`> 1024px`). Probar en los tres.
- **Áreas táctiles cómodas:** botones y controles de mínimo 44×44px para el dedo. Nada de botones diminutos.
- **Navegación móvil pensada:** barra inferior fija en móvil (Inicio, Buscar, Carrito, Pedidos) como las apps reales — más cómoda que un menú hamburguesa para e-commerce.
- **El carrito siempre accesible:** contador visible del carrito en todo momento.

### Rendimiento (velocidad de carga)
- **Imágenes optimizadas:** usar el componente `<Image>` de Next.js con lazy-loading, tamaños responsivos (`srcset`) y formato moderno (WebP/AVIF). Las fotos de producto son lo más pesado — comprimirlas bien.
- **Lazy loading:** cargar productos y secciones a medida que se necesitan, no todo de golpe. Paginación o scroll infinito en el catálogo.
- **Code splitting:** Next.js lo hace por defecto con el App Router — respetarlo, no romperlo con imports gigantes.
- **Skeleton loaders** (placeholders de carga) en vez de spinners genéricos, para que se sienta rápido mientras carga.
- **Fuentes optimizadas:** usar `next/font` para cargar tipografías sin bloquear el render.
- **Objetivo de rendimiento:** apuntar a un Lighthouse score alto (>90 en Performance móvil). Carga inicial rápida aunque haya muchos productos.

### Experiencia
- **Funciona con conexión lenta:** estados de carga claros, nada que se rompa si el internet es malo.
- **Transiciones suaves** entre páginas, sin saltos bruscos.
- **PWA-ready (opcional pero recomendado):** dejar la base para que la web se pueda "instalar" en el celular como app (manifest + service worker). Esto es un puente natural antes de las apps nativas de la Fase 4.

---

## 13. NOTAS FINALES

- **Todo responsive y mobile-first** — la mayoría de clientes pedirán desde el celular.
- **La marca manda:** aplicar los colores MEGAMART consistentemente, mantener el logo de la vaca visible, transmitir la sensación de "tradición y cercanía".
- **Preview con datos ficticios**, pero arquitectura de producción real.
- **Multi-tienda desde el esquema**, aunque solo se muestre una tienda ahora.
- Guardar todas las claves en variables de entorno, nunca en el código.

---

*Fin del documento — listo para Antigravity.*
