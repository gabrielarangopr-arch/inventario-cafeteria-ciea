"use client"

import type { Movimiento } from "@/lib/inventario-data"
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
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

type MovimientosTabProps = {
  movimientos: Movimiento[]
}

export function MovimientosTab({ movimientos }: MovimientosTabProps) {
  const ordenados = [...movimientos].sort((a, b) => b.id - a.id)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimientos</CardTitle>
        <CardDescription>
          Registro de entradas y salidas de stock del inventario.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-14">ID</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead>Responsable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ordenados.map((movimiento) => {
                const esEntrada = movimiento.tipo === "Entrada"
                return (
                  <TableRow key={movimiento.id}>
                    <TableCell className="font-mono text-muted-foreground">
                      {movimiento.id}
                    </TableCell>
                    <TableCell className="tabular-nums">{movimiento.fecha}</TableCell>
                    <TableCell>
                      <Badge
                        variant={esEntrada ? "default" : "secondary"}
                        className="gap-1"
                      >
                        {esEntrada ? (
                          <ArrowDownLeft className="size-3" />
                        ) : (
                          <ArrowUpRight className="size-3" />
                        )}
                        {movimiento.tipo}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{movimiento.producto}</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {esEntrada ? "+" : "-"}
                      {movimiento.cantidad}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {movimiento.responsable}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
