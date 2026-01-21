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
import { Loader2, Plus } from 'lucide-react'
import type { Client, Credit } from '@/lib/types'

interface CreditFormDialogProps {
  clients: Client[]
  onSubmit: (data: Partial<Credit>) => Promise<void>
}

export function CreditFormDialog({ clients, onSubmit }: CreditFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    productDescription: '',
    amount: '',
    notes: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientId || !formData.productDescription || !formData.amount) {
      return
    }

    setIsLoading(true)
    try {
      const selectedClient = clients.find((c) => c.id === formData.clientId)
      await onSubmit({
        clientId: formData.clientId,
        clientName: selectedClient?.name || '',
        date: new Date(formData.date),
        productDescription: formData.productDescription,
        amount: parseFloat(formData.amount),
        notes: formData.notes,
        status: 'pending',
      })
      setOpen(false)
      setFormData({
        clientId: '',
        date: new Date().toISOString().split('T')[0],
        productDescription: '',
        amount: '',
        notes: '',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Credit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Credit</DialogTitle>
          <DialogDescription>
            Record a new credit delivery to a client.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="client">Client *</Label>
              <Select
                value={formData.clientId}
                onValueChange={(value) => setFormData({ ...formData, clientId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="product">Product Description *</Label>
              <Input
                id="product"
                value={formData.productDescription}
                onChange={(e) =>
                  setFormData({ ...formData, productDescription: e.target.value })
                }
                placeholder="e.g., Steel sheets (50 units)"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount ($) *</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Add Credit
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
