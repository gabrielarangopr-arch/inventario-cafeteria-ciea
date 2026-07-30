"use client"

import * as React from "react"
import type { Producto } from "@/lib/inventario-data"
import { formatearMoneda } from "@/lib/inventario-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
} from "@/components/ui/input-group"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Eye, Pencil, Plus, Search, Trash2 } from "lucide-react"

type ProductosTabProps = {
  productos: Producto[]
  onAnadir: () => void
  onEditar: (producto: Producto) => void
  onVerDetalle: (producto: Producto) => void
  onEliminar: (producto: Producto) => void
}

function estadoStock(producto: Producto) {
  if (producto.stock === 0) {
    return { etiqueta: "Sin stock", variante: "destructive" as const }
  }
  if (producto.stock <= producto.stockMinimo) {
    return { etiqueta: "Stock bajo", variante: "secondary" as const }
  }
  return { etiqueta: "Disponible", variante: "outline" as const }
}

export function ProductosTab({
  productos,
  onAnadir,
  onEditar,
  onVerDetalle,
  onEliminar,
}: ProductosTabProps) {
  const [busqueda, setBusqueda] = React.useState("")
  const [productoAEliminar, setProductoAEliminar] = React.useState<Producto | null>(null)

  const productosFiltrados = productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      producto.categoria.toLowerCase().includes(busqueda.toLowerCase()),
  )

  function confirmarEliminacion() {
    if (productoAEliminar) {
      onEliminar(productoAEliminar)
      setProductoAEliminar(null)
    }
  }

  return (
    <Card>
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-1.5">
          <CardTitle>Productos</CardTitle>
          <CardDescription>
            Gestiona los productos disponibles en la cafetería.
          </CardDescription>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <InputGroup className="sm:w-64">
            <InputGroupInput
              placeholder="Buscar producto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
          </InputGroup>
          <Button onClick={onAnadir}>
            <Plus data-icon="inline-start" />
            Añadir producto
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead className="text-right">Stock actual</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No se encontraron productos.
                  </TableCell>
                </TableRow>
              ) : (
                productosFiltrados.map((producto) => {
                  const estado = estadoStock(producto)
                  return (
                    <TableRow key={producto.id}>
                      <TableCell className="font-mono text-muted-foreground">
                        {producto.id}
                      </TableCell>
                      <TableCell className="font-medium">{producto.nombre}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{producto.categoria}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <span className="tabular-nums">{producto.stock}</span>
                          <Badge variant={estado.variante}>{estado.etiqueta}</Badge>
                        </div>
                      </TableCell>
                      <TableCell className="text-right tabular-nums">
                        {formatearMoneda(producto.precio)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onVerDetalle(producto)}
                          >
                            <Eye data-icon="inline-start" />
                            Ver detalle
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Editar ${producto.nombre}`}
                            onClick={() => onEditar(producto)}
                          >
                            <Pencil />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            aria-label={`Eliminar ${producto.nombre}`}
                            onClick={() => setProductoAEliminar(producto)}
                          >
                            <Trash2 />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>

      <AlertDialog
        open={productoAEliminar !== null}
        onOpenChange={(open) => !open && setProductoAEliminar(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará permanentemente{" "}
              <span className="font-medium text-foreground">
                {productoAEliminar?.nombre}
              </span>{" "}
              del inventario. No se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={confirmarEliminacion}>
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
