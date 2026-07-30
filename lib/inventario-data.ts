export type Categoria = {
  id: number
  nombre: string
  descripcion: string
}

export type Producto = {
  id: number
  nombre: string
  categoria: string
  stock: number
  stockMinimo: number
  precio: number
  descripcion: string
}

export type Movimiento = {
  id: number
  fecha: string
  tipo: "Entrada" | "Salida"
  producto: string
  cantidad: number
  responsable: string
}

// Datos de ejemplo (mock) que simulan la respuesta de un servidor.
export const categoriasIniciales: Categoria[] = [
  { id: 1, nombre: "Bebidas", descripcion: "Café, té, refrescos y jugos naturales." },
  { id: 2, nombre: "Snacks", descripcion: "Galletas, papas fritas y aperitivos empacados." },
  { id: 3, nombre: "Almuerzos", descripcion: "Comidas preparadas y platos del día." },
  { id: 4, nombre: "Panadería", descripcion: "Pan dulce, salado y repostería fresca." },
  { id: 5, nombre: "Dulces", descripcion: "Chocolates, caramelos y golosinas." },
]

export const productosIniciales: Producto[] = [
  {
    id: 1,
    nombre: "Café Americano",
    categoria: "Bebidas",
    stock: 120,
    stockMinimo: 30,
    precio: 1.5,
    descripcion: "Café negro recién preparado, servido en vaso de 12 oz.",
  },
  {
    id: 2,
    nombre: "Capuchino",
    categoria: "Bebidas",
    stock: 8,
    stockMinimo: 20,
    precio: 2.25,
    descripcion: "Espresso con leche vaporizada y espuma cremosa.",
  },
  {
    id: 3,
    nombre: "Galletas de Avena",
    categoria: "Snacks",
    stock: 45,
    stockMinimo: 15,
    precio: 0.75,
    descripcion: "Paquete de galletas artesanales de avena y pasas.",
  },
  {
    id: 4,
    nombre: "Sándwich de Pollo",
    categoria: "Almuerzos",
    stock: 12,
    stockMinimo: 10,
    precio: 3.5,
    descripcion: "Sándwich de pollo a la plancha con vegetales frescos.",
  },
  {
    id: 5,
    nombre: "Croissant de Mantequilla",
    categoria: "Panadería",
    stock: 0,
    stockMinimo: 12,
    precio: 1.2,
    descripcion: "Croissant hojaldrado horneado en la mañana.",
  },
  {
    id: 6,
    nombre: "Jugo de Naranja",
    categoria: "Bebidas",
    stock: 60,
    stockMinimo: 25,
    precio: 1.75,
    descripcion: "Jugo natural de naranja recién exprimido, 16 oz.",
  },
  {
    id: 7,
    nombre: "Barra de Chocolate",
    categoria: "Dulces",
    stock: 90,
    stockMinimo: 20,
    precio: 1.0,
    descripcion: "Barra de chocolate con leche de 45 gramos.",
  },
  {
    id: 8,
    nombre: "Ensalada César",
    categoria: "Almuerzos",
    stock: 6,
    stockMinimo: 8,
    precio: 4.0,
    descripcion: "Ensalada fresca con pollo, crotones y aderezo césar.",
  },
]

export const movimientosIniciales: Movimiento[] = [
  { id: 1, fecha: "2026-07-28", tipo: "Entrada", producto: "Café Americano", cantidad: 100, responsable: "María López" },
  { id: 2, fecha: "2026-07-28", tipo: "Salida", producto: "Capuchino", cantidad: 12, responsable: "Carlos Pérez" },
  { id: 3, fecha: "2026-07-29", tipo: "Entrada", producto: "Galletas de Avena", cantidad: 50, responsable: "María López" },
  { id: 4, fecha: "2026-07-29", tipo: "Salida", producto: "Sándwich de Pollo", cantidad: 8, responsable: "Ana Gómez" },
  { id: 5, fecha: "2026-07-30", tipo: "Salida", producto: "Croissant de Mantequilla", cantidad: 12, responsable: "Carlos Pérez" },
  { id: 6, fecha: "2026-07-30", tipo: "Entrada", producto: "Jugo de Naranja", cantidad: 40, responsable: "Ana Gómez" },
  { id: 7, fecha: "2026-07-30", tipo: "Salida", producto: "Barra de Chocolate", cantidad: 15, responsable: "María López" },
]

export function formatearMoneda(valor: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "USD",
  }).format(valor)
}
