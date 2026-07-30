"use client"

import * as React from "react"
import type { Categoria, Producto } from "@/lib/inventario-data"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldGroup, FieldLabel, FieldDescription } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type ProductFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  categorias: Categoria[]
  producto: Producto | null
  onGuardar: (producto: Omit<Producto, "id"> & { id?: number }) => void
}

type FormState = {
  nombre: string
  categoria: string
  stock: string
  stockMinimo: string
  precio: string
  descripcion: string
}

const estadoVacio: FormState = {
  nombre: "",
  categoria: "",
  stock: "",
  stockMinimo: "",
  precio: "",
  descripcion: "",
}

export function ProductFormDialog({
  open,
  onOpenChange,
  categorias,
  producto,
  onGuardar,
}: ProductFormDialogProps) {
  const [form, setForm] = React.useState<FormState>(estadoVacio)

  // Sincroniza el formulario con el producto a editar cada vez que se abre.
  React.useEffect(() => {
    if (open) {
      if (producto) {
        setForm({
          nombre: producto.nombre,
          categoria: producto.categoria,
          stock: String(producto.stock),
          stockMinimo: String(producto.stockMinimo),
          precio: String(producto.precio),
          descripcion: producto.descripcion,
        })
      } else {
        setForm(estadoVacio)
      }
    }
  }, [open, producto])

  const esEdicion = Boolean(producto)

  function actualizarCampo(campo: keyof FormState, valor: string) {
    setForm((prev) => ({ ...prev, [campo]: valor }))
  }

  function manejarEnvio(event: React.FormEvent) {
    event.preventDefault()
    onGuardar({
      id: producto?.id,
      nombre: form.nombre.trim(),
      categoria: form.categoria,
      stock: Number(form.stock) || 0,
      stockMinimo: Number(form.stockMinimo) || 0,
      precio: Number(form.precio) || 0,
      descripcion: form.descripcion.trim(),
    })
  }

  const formularioValido =
    form.nombre.trim() !== "" && form.categoria !== "" && form.precio !== ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={manejarEnvio}>
          <DialogHeader>
            <DialogTitle>{esEdicion ? "Editar producto" : "Añadir producto"}</DialogTitle>
            <DialogDescription>
              {esEdicion
                ? "Modifica la información del producto y guarda los cambios."
                : "Completa los campos para registrar un nuevo producto en el inventario."}
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="nombre">Nombre del producto</FieldLabel>
              <Input
                id="nombre"
                placeholder="Ej. Café Latte"
                value={form.nombre}
                onChange={(e) => actualizarCampo("nombre", e.target.value)}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="categoria">Categoría</FieldLabel>
              <Select
                value={form.categoria}
                onValueChange={(valor) => actualizarCampo("categoria", (valor as string) ?? "")}
              >
                <SelectTrigger id="categoria" className="w-full">
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categorias.map((categoria) => (
                    <SelectItem key={categoria.id} value={categoria.nombre}>
                      {categoria.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field>
                <FieldLabel htmlFor="stock">Stock actual</FieldLabel>
                <Input
                  id="stock"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.stock}
                  onChange={(e) => actualizarCampo("stock", e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="stockMinimo">Stock mínimo</FieldLabel>
                <Input
                  id="stockMinimo"
                  type="number"
                  min={0}
                  placeholder="0"
                  value={form.stockMinimo}
                  onChange={(e) => actualizarCampo("stockMinimo", e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="precio">Precio ($)</FieldLabel>
                <Input
                  id="precio"
                  type="number"
                  min={0}
                  step="0.01"
                  placeholder="0.00"
                  value={form.precio}
                  onChange={(e) => actualizarCampo("precio", e.target.value)}
                  required
                />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="descripcion">Descripción</FieldLabel>
              <Textarea
                id="descripcion"
                placeholder="Breve descripción del producto"
                value={form.descripcion}
                onChange={(e) => actualizarCampo("descripcion", e.target.value)}
                rows={3}
              />
              <FieldDescription>Opcional. Ayuda a identificar el producto.</FieldDescription>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={!formularioValido}>
              {esEdicion ? "Guardar cambios" : "Añadir producto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
