'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Loader2, Plus, Pencil } from 'lucide-react'
import type { ScrapType } from '@/lib/types'

interface ScrapFormDialogProps {
  scrap?: ScrapType
  onSubmit: (data: Partial<ScrapType>) => Promise<void>
  trigger?: React.ReactNode
}

export function ScrapFormDialog({ scrap, onSubmit, trigger }: ScrapFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: scrap?.name || '',
    description: scrap?.description || '',
    unitMeasure: scrap?.unitMeasure || 'kg' as 'kg' | 'und'
  })

  const isEditing = !!scrap

  // Sync form data with scrap prop
  useEffect(() => {
    if (scrap) {
      setFormData({
        name: scrap.name || '',
        description: scrap.description || '',
        unitMeasure: scrap.unitMeasure || 'kg'
      })
    }
  }, [scrap])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim()) return
    setIsLoading(true)
    try {
      await onSubmit(formData)
      setOpen(false)
      if (!isEditing) {
        setFormData({ name: '', description: '', unitMeasure: 'kg' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            {isEditing ? <Pencil className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
            {isEditing ? 'Editar' : 'Nueva Chatarra'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Tipo de Chatarra' : 'Agregar Tipo de Chatarra'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Actualiza la informacion del tipo de chatarra.'
              : 'Crea un nuevo tipo de chatarra para gestionar precios.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ej: Hierro"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Unidad de Medida</Label>
              <RadioGroup
                value={formData.unitMeasure}
                onValueChange={(value: 'kg' | 'und') =>
                  setFormData({ ...formData, unitMeasure: value })
                }
                className="flex gap-4 pt-1"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="kg" id="kg" />
                  <Label htmlFor="kg" className="font-normal cursor-pointer">Kilogramos (Kg)</Label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="und" id="und" />
                  <Label htmlFor="und" className="font-normal cursor-pointer">Unidades (Und)</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Descripcion</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descripcion opcional..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading || !formData.name.trim()}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? 'Guardar Cambios' : 'Agregar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
