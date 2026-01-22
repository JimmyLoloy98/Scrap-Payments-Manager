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
import { MoreHorizontal, Eye, Pencil } from 'lucide-react'
import { mockScrapPayments, mockClients } from '@/lib/mock-data'
import type { ScrapPayment } from '@/lib/types'
import { formatDate, formatCurrency } from '@/lib/utils'

export default function PaymentsPage() {
  const [payments, setPayments] = useState<ScrapPayment[]>(mockScrapPayments)
  const [editingPayment, setEditingPayment] = useState<ScrapPayment | null>(null)

  const handleAddPayment = async (data: Partial<ScrapPayment>) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newPayment: ScrapPayment = {
      id: String(payments.length + 1),
      companyId: 'company-1',
      clientId: data.clientId || '',
      clientName: data.clientName || '',
      clientOrigin: mockClients.find(c => c.id === data.clientId)?.origin || '',
      date: data.date || new Date(),
      items: data.items || [],
      totalValue: data.totalValue || 0,
      notes: data.notes || '',
      createdAt: new Date(),
    }
    setPayments([newPayment, ...payments])
  }

  const handleEditPayment = async (id: string, data: Partial<ScrapPayment>) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setPayments(
      payments.map((p) => {
        if (p.id === id) {
          return { ...p, ...data }
        }
        return p
      })
    )
  }

  const columns: Column<ScrapPayment>[] = [
    {
      key: 'date',
      header: 'Fecha',
      cell: (row) => formatDate(row.date),
    },
    {
      key: 'clientName',
      header: 'Cliente',
      cell: (row) => (
        <Link href={`/clients/${row.clientId}`} className="font-medium hover:underline">
          {row.clientName}
        </Link>
      ),
    },
    {
      key: 'items',
      header: 'Detalle de Chatarra',
      sortable: false,
      cell: (row) => (
         <div className="flex flex-col gap-1">
            {row.items && row.items.length > 0 ? (
                row.items.map((item, idx) => (
                    <span key={idx} className="block text-sm">
                        • {item.scrapName}: {formatCurrency(item.amount)}
                    </span>
                ))
            ) : (
                <span className="text-muted-foreground italic">Sin detalles</span>
            )}
             {/* Fallback for old data if needed */}
             {/* @ts-ignore */}
             {row.scrapDetails && <span className="text-xs text-yellow-600">Old data present</span>}
        </div>
      ),
    },
    {
      key: 'totalValue',
      header: 'Valor Total',
      cell: (row) => (
        <span className="font-medium text-primary">{formatCurrency(row.totalValue)}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Acciones',
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
                Ver Cliente
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setEditingPayment(row)}>
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const totalReceived = payments.reduce((sum, p) => sum + p.totalValue, 0)

  return (
    <>
      <DashboardHeader title="Scrap Payments" />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Pagos con Chatarra</h1>
              <p className="text-muted-foreground">
                Realizar un seguimiento de todos los pagos con chatarra recibidos de los clientes.
              </p>
            </div>
            <PaymentFormDialog clients={mockClients} onSubmit={handleAddPayment} />
          </div>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 max-w-xl">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Recibido</p>
              <p className="text-2xl font-bold text-primary">{formatCurrency(totalReceived)}</p>
            </div>
          </div>

          <DataTable
            data={payments}
            columns={columns}
            searchPlaceholder="Search payments..."
          />
        </div>
      </div>

      <PaymentFormDialog
        clients={mockClients}
        payment={editingPayment || undefined}
        open={!!editingPayment}
        onOpenChange={(open) => !open && setEditingPayment(null)}
        onSubmit={(data) => {
          if (editingPayment) {
            return handleEditPayment(editingPayment.id, data)
          }
          return Promise.resolve()
        }}
      />
    </>
  )
}
