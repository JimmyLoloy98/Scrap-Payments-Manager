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
import { Loader2, Plus, Pencil } from 'lucide-react'
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
    name: client?.name || '',
    phone: client?.phone || '',
    email: client?.email || '',
    address: client?.address || '',
    origin: client?.origin || '',
    notes: client?.notes || '',
  })

  const isEditing = !!client
  const { availableOrigins } = useOrigins()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
      setOpen(false)
      if (!isEditing) {
        setFormData({ name: '', phone: '', email: '', address: '', origin: '', notes: '' })
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
            {isEditing ? 'Edit Client' : 'New Client'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Client' : 'Add New Client'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Update the client information below.'
              : 'Fill in the details to add a new client.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Client name"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 555-0123"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="client@example.com"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="123 Main St, City"
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
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this client..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? 'Save Changes' : 'Add Client'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
