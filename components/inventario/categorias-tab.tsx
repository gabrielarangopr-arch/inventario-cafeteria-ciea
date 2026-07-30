"use client"

import type { Categoria, Producto } from "@/lib/inventario-data"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tag } from "lucide-react"

type CategoriasTabProps = {
  categorias: Categoria[]
  productos: Producto[]
}

export function CategoriasTab({ categorias, productos }: CategoriasTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorías</CardTitle>
        <CardDescription>
          Listado de categorías que organizan los productos de la cafetería.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {categorias.map((categoria) => {
            const totalProductos = productos.filter(
              (p) => p.categoria === categoria.nombre,
            ).length
            return (
              <li
                key={categoria.id}
                className="flex items-center gap-4 rounded-lg border bg-card p-4"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <Tag className="size-5" />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="font-medium">{categoria.nombre}</span>
                  <span className="text-sm text-muted-foreground">
                    {categoria.descripcion}
                  </span>
                </div>
                <Badge variant="secondary">
                  {totalProductos} {totalProductos === 1 ? "producto" : "productos"}
                </Badge>
              </li>
            )
          })}
        </ul>
      </CardContent>
    </Card>
  )
}
