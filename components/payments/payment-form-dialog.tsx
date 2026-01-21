'use client'

import React from "react"

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Loader2, Plus } from 'lucide-react'
import { calculateScrapValue, scrapPrices } from '@/lib/mock-data'
import type { Client, ScrapPayment, ScrapDetails } from '@/lib/types'

interface PaymentFormDialogProps {
  clients: Client[]
  onSubmit: (data: Partial<ScrapPayment>) => Promise<void>
}

export function PaymentFormDialog({ clients, onSubmit }: PaymentFormDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    clientId: '',
    date: new Date().toISOString().split('T')[0],
    ironKg: '',
    batteriesUnits: '',
    copperKg: '',
    aluminumKg: '',
    notes: '',
  })
  const [calculatedValue, setCalculatedValue] = useState(0)

  useEffect(() => {
    const scrapDetails: ScrapDetails = {
      ironKg: parseFloat(formData.ironKg) || 0,
      batteriesUnits: parseFloat(formData.batteriesUnits) || 0,
      copperKg: parseFloat(formData.copperKg) || 0,
      aluminumKg: parseFloat(formData.aluminumKg) || 0,
    }
    setCalculatedValue(calculateScrapValue(scrapDetails))
  }, [formData.ironKg, formData.batteriesUnits, formData.copperKg, formData.aluminumKg])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.clientId) return

    setIsLoading(true)
    try {
      const selectedClient = clients.find((c) => c.id === formData.clientId)
      const scrapDetails: ScrapDetails = {
        ironKg: parseFloat(formData.ironKg) || 0,
        batteriesUnits: parseFloat(formData.batteriesUnits) || 0,
        copperKg: parseFloat(formData.copperKg) || 0,
        aluminumKg: parseFloat(formData.aluminumKg) || 0,
      }

      await onSubmit({
        clientId: formData.clientId,
        clientName: selectedClient?.name || '',
        date: new Date(formData.date),
        scrapDetails,
        totalValue: calculatedValue,
        notes: formData.notes,
      })

      setOpen(false)
      setFormData({
        clientId: '',
        date: new Date().toISOString().split('T')[0],
        ironKg: '',
        batteriesUnits: '',
        copperKg: '',
        aluminumKg: '',
        notes: '',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Record Scrap Payment</DialogTitle>
          <DialogDescription>
            Enter the scrap details received from a client.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="client">Client *</Label>
                <Select
                  value={formData.clientId}
                  onValueChange={(value) => setFormData({ ...formData, clientId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
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
            </div>

            <div className="rounded-lg border p-4 space-y-4">
              <h4 className="font-medium text-sm">Scrap Details</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="iron" className="text-sm">
                    Iron (kg) @ ${scrapPrices.ironPerKg}/kg
                  </Label>
                  <Input
                    id="iron"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.ironKg}
                    onChange={(e) => setFormData({ ...formData, ironKg: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="batteries" className="text-sm">
                    Batteries (units) @ ${scrapPrices.batteriesPerUnit}/unit
                  </Label>
                  <Input
                    id="batteries"
                    type="number"
                    step="1"
                    min="0"
                    value={formData.batteriesUnits}
                    onChange={(e) =>
                      setFormData({ ...formData, batteriesUnits: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="copper" className="text-sm">
                    Copper (kg) @ ${scrapPrices.copperPerKg}/kg
                  </Label>
                  <Input
                    id="copper"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.copperKg}
                    onChange={(e) => setFormData({ ...formData, copperKg: e.target.value })}
                    placeholder="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="aluminum" className="text-sm">
                    Aluminum (kg) @ ${scrapPrices.aluminumPerKg}/kg
                  </Label>
                  <Input
                    id="aluminum"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.aluminumKg}
                    onChange={(e) =>
                      setFormData({ ...formData, aluminumKg: e.target.value })
                    }
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-primary/10 p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Calculated Value</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(calculatedValue)}
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional notes about this payment..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading || calculatedValue === 0}>
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Record Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
