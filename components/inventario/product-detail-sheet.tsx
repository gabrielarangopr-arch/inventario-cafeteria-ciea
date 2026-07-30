"use client"

import type { Movimiento, Producto } from "@/lib/inventario-data"
import { formatearMoneda } from "@/lib/inventario-data"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { ArrowDownLeft, ArrowUpRight, Package } from "lucide-react"

type ProductDetailSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  producto: Producto | null
  movimientos: Movimiento[]
}

function estadoStock(producto: Producto) {
  if (producto.stock === 0) {
    return { etiqueta: "Sin stock", variante: "destructive" as const }
  }
  if (producto.stock <= producto.stockMinimo) {
    return { etiqueta: "Stock bajo", variante: "secondary" as const }
  }
  return { etiqueta: "Disponible", variante: "default" as const }
}

export function ProductDetailSheet({
  open,
  onOpenChange,
  producto,
  movimientos,
}: ProductDetailSheetProps) {
  if (!producto) return null

  const estado = estadoStock(producto)
  const historial = movimientos.filter((m) => m.producto === producto.nombre)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 sm:max-w-md">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <Package className="size-5" />
            </div>
            <div className="flex flex-col">
              <SheetTitle className="text-lg">{producto.nombre}</SheetTitle>
              <SheetDescription>Producto #{producto.id}</SheetDescription>
            </div>
          </div>
        </SheetHeader>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{producto.categoria}</Badge>
            <Badge variant={estado.variante}>{estado.etiqueta}</Badge>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {producto.descripcion || "Sin descripción disponible."}
          </p>

          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs text-muted-foreground">Stock actual</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{producto.stock}</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs text-muted-foreground">Stock mínimo</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{producto.stockMinimo}</p>
            </div>
            <div className="rounded-lg border bg-card p-3">
              <p className="text-xs text-muted-foreground">Precio</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">
                {formatearMoneda(producto.precio)}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">Historial de movimientos</h3>
            {historial.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Este producto no tiene movimientos registrados.
              </p>
            ) : (
              <ul className="flex flex-col gap-2">
                {historial.map((movimiento) => {
                  const esEntrada = movimiento.tipo === "Entrada"
                  return (
                    <li
                      key={movimiento.id}
                      className="flex items-center gap-3 rounded-lg border bg-card p-3"
                    >
                      <div
                        className={
                          esEntrada
                            ? "flex size-9 items-center justify-center rounded-full bg-accent text-accent-foreground"
                            : "flex size-9 items-center justify-center rounded-full bg-muted text-muted-foreground"
                        }
                      >
                        {esEntrada ? (
                          <ArrowDownLeft className="size-4" />
                        ) : (
                          <ArrowUpRight className="size-4" />
                        )}
                      </div>
                      <div className="flex flex-1 flex-col">
                        <span className="text-sm font-medium">{movimiento.tipo}</span>
                        <span className="text-xs text-muted-foreground">
                          {movimiento.fecha} · {movimiento.responsable}
                        </span>
                      </div>
                      <span className="text-sm font-semibold tabular-nums">
                        {esEntrada ? "+" : "-"}
                        {movimiento.cantidad}
                      </span>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
