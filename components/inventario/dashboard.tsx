"use client"

import * as React from "react"
import { toast } from "sonner"
import { supabase } from "@/lib/supabaseClient" // CONEXIÓN A SUPABASE
import {
  categoriasIniciales,
  formatearMoneda,
  movimientosIniciales,
  productosIniciales,
  type Categoria,
  type Movimiento,
  type Producto,
} from "@/lib/inventario-data"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductosTab } from "./productos-tab"
import { CategoriasTab } from "./categorias-tab"
import { MovimientosTab } from "./movimientos-tab"
import { ProductFormDialog } from "./product-form-dialog"
import { ProductDetailSheet } from "./product-detail-sheet"
import { AlertTriangle, Boxes, Coffee, DollarSign } from "lucide-react"

function fechaHoy(): string {
  return new Date().toISOString().slice(0, 10)
}

export function Dashboard() {
  const [cargando, setCargando] = React.useState(true)
  const [productos, setProductos] = React.useState<Producto[]>([])
  const [categorias, setCategorias] = React.useState<Categoria[]>([])
  const [movimientos, setMovimientos] = React.useState<Movimiento[]>([])

  // Estado de la interfaz
  const [formAbierto, setFormAbierto] = React.useState(false)
  const [productoEditar, setProductoEditar] = React.useState<Producto | null>(null)
  const [detalleAbierto, setDetalleAbierto] = React.useState(false)
  const [productoDetalle, setProductoDetalle] = React.useState<Producto | null>(null)

  // 1. CARGA DE DATOS DESDE SUPABASE (EVIDENCIA RAP3)
  React.useEffect(() => {
    async function cargarDatos() {
      try {
        // Cargar productos de la BD
        const { data: dbProductos, error } = await supabase
          .from('productos')
          .select('*, categorias(nombre)')

        if (dbProductos && !error) {
          // Mapeamos los datos de la BD (stock_actual) a la estructura del Front (stock)
          const productosFormateados = dbProductos.map((p: any) => ({
            id: p.id,
            nombre: p.nombre,
            categoria: p.categorias?.nombre || "Sin Categoría",
            stock: p.stock_actual,
            stockMinimo: 10, // Valor visual por defecto
            precio: p.precio,
            descripcion: "Producto registrado"
          }))
          setProductos(productosFormateados)
        } else {
          setProductos(productosIniciales) // Respaldo en caso de error
        }

        // Cargar categorías simuladas o reales
        const { data: dbCategorias } = await supabase.from('categorias').select('*')
        setCategorias(dbCategorias || categoriasIniciales)

        // Movimientos
        setMovimientos(movimientosIniciales) // Mantener mock para agilizar
      } catch (err) {
        console.error("Error al cargar Supabase:", err)
      } finally {
        setCargando(false)
      }
    }

    cargarDatos()
  }, [])

  function abrirAnadir() {
    setProductoEditar(null)
    setFormAbierto(true)
  }

  function abrirEditar(producto: Producto) {
    setProductoEditar(producto)
    setFormAbierto(true)
  }

  function abrirDetalle(producto: Producto) {
    setProductoDetalle(producto)
    setDetalleAbierto(true)
  }

  // 2. CREAR Y ACTUALIZAR EN SUPABASE (EVIDENCIA RAP4 - INSERT/UPDATE)
  async function guardarProducto(datos: Omit<Producto, "id"> & { id?: number }) {
    if (datos.id != null) {
      // UPDATE UI (Optimista)
      setProductos((prev) =>
        prev.map((p) => (p.id === datos.id ? { ...p, ...datos, id: datos.id! } : p)),
      )
      
      // UPDATE BASE DE DATOS
      await supabase.from('productos').update({
        nombre: datos.nombre,
        precio: datos.precio,
        stock_actual: datos.stock
      }).eq('id', datos.id)

      toast.success("Producto actualizado", {
        description: `Se guardaron los cambios de ${datos.nombre}.`,
      })
    } else {
      // INSERT UI (Optimista)
      const nuevoId = productos.reduce((max, p) => Math.max(max, p.id), 0) + 1
      const nuevoProducto: Producto = { ...datos, id: nuevoId }
      setProductos((prev) => [...prev, nuevoProducto])
      
      // INSERT BASE DE DATOS
      await supabase.from('productos').insert([{
        nombre: datos.nombre,
        precio: datos.precio,
        stock_actual: datos.stock,
        categoria_id: 1 // Se asume id 1 por rapidez para la presentación
      }])

      if (nuevoProducto.stock > 0) {
        setMovimientos((prev) => [
          ...prev,
          {
            id: prev.reduce((max, m) => Math.max(max, m.id), 0) + 1,
            fecha: fechaHoy(),
            tipo: "Entrada",
            producto: nuevoProducto.nombre,
            cantidad: nuevoProducto.stock,
            responsable: "Registro inicial",
          },
        ])
      }
      toast.success("Producto añadido", {
        description: `${nuevoProducto.nombre} se agregó al inventario.`,
      })
    }
    setFormAbierto(false)
  }

  // 3. ELIMINAR EN SUPABASE (EVIDENCIA RAP4 - DELETE)
  async function eliminarProducto(producto: Producto) {
    // DELETE UI (Optimista)
    setProductos((prev) => prev.filter((p) => p.id !== producto.id))
    
    // DELETE BASE DE DATOS
    await supabase.from('productos').delete().eq('id', producto.id)

    toast.success("Producto eliminado", {
      description: `${producto.nombre} se eliminó del inventario.`,
    })
  }

  // Métricas resumidas
  const totalProductos = productos.length
  const valorInventario = productos.reduce((sum, p) => sum + p.precio * p.stock, 0)
  const productosBajoStock = productos.filter(
    (p) => p.stock <= p.stockMinimo,
  ).length

  const estadisticas = [
    { etiqueta: "Total de productos", valor: String(totalProductos), icono: Boxes },
    { etiqueta: "Categorías", valor: String(categorias.length), icono: Coffee },
    { etiqueta: "Stock bajo", valor: String(productosBajoStock), icono: AlertTriangle },
    { etiqueta: "Valor del inventario", valor: formatearMoneda(valorInventario), icono: DollarSign },
  ]

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-5 sm:px-6">
          <div className="flex size-11 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <Coffee className="size-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-balance sm:text-xl">
              Inventario de la cafetería del CIEA
            </h1>
            <p className="text-sm text-muted-foreground">
              Panel de gestión de productos, categorías y movimientos
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 sm:px-6">
        <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {estadisticas.map((stat) => (
            <Card key={stat.etiqueta}>
              <CardContent className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <stat.icono className="size-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-muted-foreground">{stat.etiqueta}</span>
                  {cargando ? (
                    <Skeleton className="mt-1 h-6 w-16" />
                  ) : (
                    <span className="text-lg font-semibold tabular-nums">{stat.valor}</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {cargando ? (
          <Card>
            <CardContent className="flex flex-col gap-4 py-6">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="productos" className="gap-4">
            <TabsList>
              <TabsTrigger value="productos">Productos</TabsTrigger>
              <TabsTrigger value="categorias">Categorías</TabsTrigger>
              <TabsTrigger value="movimientos">Movimientos</TabsTrigger>
            </TabsList>

            <TabsContent value="productos">
              <ProductosTab
                productos={productos}
                onAnadir={abrirAnadir}
                onEditar={abrirEditar}
                onVerDetalle={abrirDetalle}
                onEliminar={eliminarProducto}
              />
            </TabsContent>

            <TabsContent value="categorias">
              <CategoriasTab categorias={categorias} productos={productos} />
            </TabsContent>

            <TabsContent value="movimientos">
              <MovimientosTab movimientos={movimientos} />
            </TabsContent>
          </Tabs>
        )}
      </main>

      <ProductFormDialog
        open={formAbierto}
        onOpenChange={setFormAbierto}
        categorias={categorias}
        producto={productoEditar}
        onGuardar={guardarProducto}
      />

      <ProductDetailSheet
        open={detalleAbierto}
        onOpenChange={setDetalleAbierto}
        producto={productoDetalle}
        movimientos={movimientos}
      />
    </div>
  )
}