'use client'

import React from "react"

import { useState } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Plus, Pencil, Upload } from 'lucide-react'
import type { Client } from '@/lib/types'
import { useOrigins } from '@/contexts/origins-context'

interface ClientFormDialogProps {
  client?: Client
  onSubmit: (data: Partial<Client>) => Promise<void>
  trigger?: React.ReactNode
}

export function ClientFormDialog({ client, onSubmit, trigger }: ClientFormDialogProps) {
  const { origins } = useOrigins()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessName: client?.businessName || '',
    ownerName: client?.ownerName || '',
    dni: client?.dni || '',
    ruc: client?.ruc || '',
    phone: client?.phone || '',
    email: client?.email || '',
    address: client?.address || '',
    origin: client?.origin || '',
    notes: client?.notes || '',
    photoUrl: client?.photoUrl || '',
  })

  // Fallback for sync with old format if editing
  React.useEffect(() => {
    if (client) {
      setFormData(prev => ({
        ...prev,
        businessName: client.businessName || client.name || '',
      }))
    }
  }, [client])

  const isEditing = !!client

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      // Map businessName to name for compatibility with existing types/codebase until fully migrated
      const submissionData = {
        ...formData,
        name: formData.businessName, // Keep name synced with businessName for now
      }
      await onSubmit(submissionData)
      setOpen(false)
      if (!isEditing) {
        setFormData({
          businessName: '',
          ownerName: '',
          dni: '',
          ruc: '',
          phone: '',
          email: '',
          address: '',
          origin: '',
          notes: '',
          photoUrl: '',
        })
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
            {isEditing ? 'Editar Negocio' : 'Nuevo Negocio'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Negocio' : 'Agregar Nuevo Negocio'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Actualiza la informacion del negocio a continuacion.'
              : 'Complete los detalles para agregar un nuevo negocio.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="businessName">Nombre del Negocio (Comercial) *</Label>
              <Input
                id="businessName"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="Ej: Recicladora Martinez"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="ownerName">Nombre del Dueño/Gerente</Label>
                <Input
                  id="ownerName"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="Ej: Roberto Martinez"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">Telefono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+51 999 999 999"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="dni">DNI (Cliente)</Label>
                <Input
                  id="dni"
                  value={formData.dni}
                  onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                  placeholder="DNI del dueño"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="ruc">RUC (Negocio)</Label>
                <Input
                  id="ruc"
                  value={formData.ruc}
                  onChange={(e) => setFormData({ ...formData, ruc: e.target.value })}
                  placeholder="RUC del negocio"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="negocio@ejemplo.com"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="address">Direccion</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Av. Principal 123, Ciudad"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="origin">Lugar de Procedencia</Label>
              <Select
                value={formData.origin}
                onValueChange={(value) => setFormData({ ...formData, origin: value })}
              >
                <SelectTrigger id="origin">
                  <SelectValue placeholder="Seleccionar zona" />
                </SelectTrigger>
                <SelectContent>
                  {origins.map((origin) => (
                    <SelectItem key={origin.id} value={origin.name}>
                      {origin.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="photo">Foto del Local</Label>
              <div className="flex items-center gap-4">
                 <Button type="button" variant="outline" className="w-full" onClick={() => alert('Simulacion: Foto subida')}>
                    <Upload className="w-4 h-4 mr-2" />
                    Subir Foto
                 </Button>
                 {formData.photoUrl && <span className="text-xs text-green-600">Foto cargada</span>}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Notas adicionales..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? 'Guardar Cambios' : 'Crear Negocio'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
