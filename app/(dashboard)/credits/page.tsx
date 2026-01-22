'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard-header'
import { DataTable, type Column } from '@/components/data-table'
import { CreditFormDialog } from '@/components/credits/credit-form-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal, Eye, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { mockCredits, mockClients } from '@/lib/mock-data'
import { useOrigins } from '@/contexts/origins-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Credit } from '@/lib/types'
import { formatDate, formatCurrency } from '@/lib/utils'

// const availableOrigins = ['Origin1', 'Origin2', 'Origin3']; // Declare availableOrigins here

export default function CreditsPage() {
  const { origins } = useOrigins()
  const [credits, setCredits] = useState<Credit[]>(mockCredits)
  const [originFilter, setOriginFilter] = useState<string>('all')

  const handleAddCredit = async (data: Partial<Credit>) => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    const selectedClient = mockClients.find((c) => c.id === data.clientId)
    const newCredit: Credit = {
      id: String(credits.length + 1),
      companyId: 'company-1',
      clientId: data.clientId || '',
      clientName: data.clientName || '',
      clientOrigin: selectedClient?.origin || '',
      date: data.date || new Date(),
      items: data.items || [],
      amount: data.amount || 0,
      status: 'pending',
      notes: data.notes || '',
      createdAt: new Date(),
    }
    setCredits([newCredit, ...credits])
  }

  const handleUpdateStatus = async (id: string, status: Credit['status']) => {
    await new Promise((resolve) => setTimeout(resolve, 300))
    setCredits(credits.map((c) => (c.id === id ? { ...c, status } : c)))
  }

  const getStatusIcon = (status: Credit['status']) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="w-3 h-3" />
      case 'partial':
        return <Clock className="w-3 h-3" />
      default:
        return <AlertCircle className="w-3 h-3" />
    }
  }

  const filteredCredits = credits.filter((credit) => {
    if (originFilter === 'all') return true
    return credit.clientOrigin === originFilter
  })

  const columns: Column<Credit>[] = [
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
    /* {
      key: 'clientOrigin',
      header: 'Procedencia',
      cell: (row) => (
        <span className="text-muted-foreground">{row.clientOrigin || '-'}</span>
      ),
    }, */
    {
      key: 'items',
      header: 'Productos', // Changed from 'Product' to match functionality
      cell: (row) => (
        <div className="flex flex-col gap-1">
            {row.items && row.items.length > 0 ? (
                row.items.map((item, idx) => (
                    <span key={idx} className="block text-sm truncate max-w-[250px]">
                        • {item.description}
                    </span>
                ))
            ) : (
                <span className="text-muted-foreground italic">Sin productos</span>
            )}
            {/* Fallback for old data if any */}
            {/* @ts-ignore */}
            {row.productDescription && <span className="block text-sm text-yellow-600">Old: {row.productDescription}</span>}
        </div>
      ),
    },
    {
      key: 'amount',
      header: 'Monto Total',
      cell: (row) => (
        <span className="font-bold">{formatCurrency(row.amount)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Estado',
      cell: (row) => (
        <Badge
          variant={
            row.status === 'paid'
              ? 'default'
              : row.status === 'partial'
              ? 'secondary'
              : 'destructive'
          }
          className="gap-1"
        >
          {getStatusIcon(row.status)}
          {row.status === 'paid' ? 'Pagado' : row.status === 'partial' ? 'Parcial' : 'Pendiente'}
        </Badge>
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
            {row.status !== 'paid' && (
              <>
                <DropdownMenuItem onClick={() => handleUpdateStatus(row.id, 'partial')}>
                  <Clock className="w-4 h-4 mr-2" />
                  Mark Partial
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleUpdateStatus(row.id, 'paid')}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Paid
                </DropdownMenuItem>
              </>
            )}
            {row.status === 'paid' && (
              <DropdownMenuItem onClick={() => handleUpdateStatus(row.id, 'pending')}>
                <AlertCircle className="w-4 h-4 mr-2" />
                Mark Pending
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const totalCredit = credits.reduce((sum, c) => sum + c.amount, 0)
  const pendingCredit = credits
    .filter((c) => c.status !== 'paid')
    .reduce((sum, c) => sum + c.amount, 0)

  return (
    <>
      <DashboardHeader title="Creditos" />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Creditos con productos</h1>
              <p className="text-muted-foreground">
                Track all credit deliveries to your clients
              </p>
            </div>
            <CreditFormDialog clients={mockClients} onSubmit={handleAddCredit} />
          </div>

          <div className="grid gap-4 grid-cols-2 max-w-md">
            <div className="rounded-lg border bg-card p-4">
              <p className="text-sm text-muted-foreground">Total Credit</p>
              <p className="text-2xl font-bold">{formatCurrency(totalCredit)}</p>
            </div>
            <div className="rounded-lg border bg-card p-4 border-destructive/50">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-destructive">
                {formatCurrency(pendingCredit)}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Filtrar por procedencia:</span>
              <Select value={originFilter} onValueChange={setOriginFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todas las zonas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las zonas</SelectItem>
                  {origins.map((origin) => (
                    <SelectItem key={origin.id} value={origin.name}>
                      {origin.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {originFilter !== 'all' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOriginFilter('all')}
                className="text-muted-foreground"
              >
                Limpiar filtro
              </Button>
            )}
          </div>

          <DataTable
            data={filteredCredits}
            columns={columns}
            searchPlaceholder="Search credits..."
          />
        </div>
      </div>
    </>
  )
}
