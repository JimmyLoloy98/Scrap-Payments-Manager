'use client'

import { useState } from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard-header'
import { DataTable, type Column } from '@/components/data-table'
import { ClientFormDialog } from '@/components/clients/client-form-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { MoreHorizontal, Eye, Pencil, Trash2 } from 'lucide-react'
import { mockClients } from '@/lib/mock-data'
import { useOrigins } from '@/contexts/origins-context'
import { useClients } from '@/contexts/clients-context'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Client } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

export default function ClientsPage() {
  const { origins } = useOrigins()
  const { clients, addClient, updateClient, deleteClient, isLoading: clientsLoading } = useClients()
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [originFilter, setOriginFilter] = useState<string>('all')

  const handleAddClient = async (data: Partial<Client>) => {
    await addClient(data)
  }

  const handleEditClient = async (id: string | number, data: Partial<Client>) => {
    await updateClient(id, data)
  }

  const handleDeleteClient = async () => {
    if (!deleteTarget) return
    await deleteClient(deleteTarget.id)
    setDeleteTarget(null)
  }

  const filteredClients = clients.filter((client) => {
    if (originFilter === 'all') return true
    return client.origin === originFilter
  })

  const columns: Column<Client>[] = [
    {
      key: 'businessName',
      header: 'Negocio / Dueño',
      cell: (row) => (
        <div className="flex flex-col">
          <Link href={`/clients/${row.id}`} className="font-medium hover:underline">
            {row.businessName}
          </Link>
          <span className="text-xs text-muted-foreground">{row.ownerName}</span>
        </div>
      ),
    },
    {
      key: 'origin',
      header: 'Procedencia',
      cell: (row) => (
        <span className="text-muted-foreground">{row.origin || '-'}</span>
      ),
    },
    {
      key: 'currentDebt',
      header: 'Deuda Actual',
      cell: (row) => (
        <span className={row.currentDebt > 0 ? 'text-destructive font-medium' : 'text-primary'}>
          {formatCurrency(row.currentDebt)}
        </span>
      ),
    },
    {
      key: 'actions', // This key is virtual/custom in DataTable but we use 'id' or similar to satisfy TS if needed, but DataTable likely handles any string key for custom cells
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
              <Link href={`/clients/${row.id}`}>
                <Eye className="w-4 h-4 mr-2" />
                Ver Detalles
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setEditingClient(row)}>
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onSelect={() => setDeleteTarget(row)}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Eliminar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <>
      <DashboardHeader title="Negocios" />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Negocios</h1>
              <p className="text-muted-foreground">
                Gestiona tu base de datos de clientes y sus cuentas
              </p>
            </div>
            <ClientFormDialog onSubmit={handleAddClient} />
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
            data={filteredClients}
            columns={columns}
            searchPlaceholder="Buscar negocios..."
            isLoading={clientsLoading}
          />
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Negocio</AlertDialogTitle>
            <AlertDialogDescription>
              Estas seguro de que deseas eliminar a {deleteTarget?.businessName}? Esta accion no se
              puede deshacer y eliminara todos los registros asociados.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteClient}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {<ClientFormDialog
        client={editingClient || undefined}
        trigger={<span className="hidden" />}
        open={!!editingClient}
        onOpenChange={(open) => !open && setEditingClient(null)}
        onSubmit={(data) => {
          if (editingClient) {
            return handleEditClient(editingClient.id, data)
          }
          return Promise.resolve()
        }}
      />}
    </>
  )
}
