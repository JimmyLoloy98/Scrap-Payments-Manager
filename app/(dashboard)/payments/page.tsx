'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard-header'
import { DataTable, type Column } from '@/components/data-table'
import { PaymentFormDialog } from '@/components/payments/payment-form-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { MoreHorizontal, Eye, Package } from 'lucide-react'
import { mockScrapPayments, mockClients } from '@/lib/mock-data'
import type { ScrapPayment } from '@/lib/types'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<ScrapPayment[]>(mockScrapPayments)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date))
  }

  const handleAddPayment = async (data: Partial<ScrapPayment>) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newPayment: ScrapPayment = {
      id: String(payments.length + 1),
      companyId: 'company-1',
      clientId: data.clientId || '',
      clientName: data.clientName || '',
      date: data.date || new Date(),
      scrapDetails: data.scrapDetails || {
        ironKg: 0,
        batteriesUnits: 0,
        copperKg: 0,
        aluminumKg: 0,
      },
      totalValue: data.totalValue || 0,
      notes: data.notes || '',
      createdAt: new Date(),
    }
    setPayments([newPayment, ...payments])
  }

  const formatScrapSummary = (payment: ScrapPayment) => {
    const parts: string[] = []
    if (payment.scrapDetails.ironKg > 0) {
      parts.push(`Iron: ${payment.scrapDetails.ironKg}kg`)
    }
    if (payment.scrapDetails.batteriesUnits > 0) {
      parts.push(`Batteries: ${payment.scrapDetails.batteriesUnits}`)
    }
    if (payment.scrapDetails.copperKg > 0) {
      parts.push(`Copper: ${payment.scrapDetails.copperKg}kg`)
    }
    if (payment.scrapDetails.aluminumKg > 0) {
      parts.push(`Aluminum: ${payment.scrapDetails.aluminumKg}kg`)
    }
    return parts
  }

  const columns: Column<ScrapPayment>[] = [
    {
      key: 'date',
      header: 'Date',
      cell: (row) => formatDate(row.date),
    },
    {
      key: 'clientName',
      header: 'Client',
      cell: (row) => (
        <Link href={`/clients/${row.clientId}`} className="font-medium hover:underline">
          {row.clientName}
        </Link>
      ),
    },
    {
      key: 'scrapDetails',
      header: 'Scrap Types',
      sortable: false,
      cell: (row) => {
        const parts = formatScrapSummary(row)
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">
                    {parts.length} type{parts.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-1">
                  {parts.map((part, i) => (
                    <div key={i}>{part}</div>
                  ))}
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )
      },
    },
    {
      key: 'totalValue',
      header: 'Total Value',
      cell: (row) => (
        <span className="font-medium text-primary">{formatCurrency(row.totalValue)}</span>
      ),
    },
    {
      key: 'notes',
      header: 'Notes',
      cell: (row) => (
        <span className="max-w-[150px] truncate block text-muted-foreground">
          {row.notes || '-'}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Actions',
      sortable: false,
      searchable: false,
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
              <Link href={`/clients/${row.clientId}`}>
                <Eye className="w-4 h-4 mr-2" />
                View Client
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const totalReceived = payments.reduce((sum, p) => sum + p.totalValue, 0)
  const totalIron = payments.reduce((sum, p) => sum + p.scrapDetails.ironKg, 0)
  const totalCopper = payments.reduce((sum, p) => sum + p.scrapDetails.copperKg, 0)

  return (
    <>
      <DashboardHeader title="Scrap Payments" />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Scrap Payments</h1>
              <p className="text-muted-foreground">
                Track all scrap metal payments received from clients
              </p>
            </div>
            <PaymentFormDialog clients={mockClients} onSubmit={handleAddPayment} />
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 max-w-xl">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Received</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalReceived)}</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Iron Collected</p>
              <p className="text-2xl font-bold">{totalIron.toFixed(1)} kg</p>
            </div>
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Copper Collected</p>
              <p className="text-2xl font-bold">{totalCopper.toFixed(1)} kg</p>
            </div>
          </div>

          <DataTable
            data={payments}
            columns={columns}
            searchPlaceholder="Search payments..."
          />
        </div>
      </div>
    </>
  )
}
