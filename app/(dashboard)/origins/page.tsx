'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard-header'
import { DataTable, type Column } from '@/components/data-table'
import { OriginFormDialog } from '@/components/origins/origin-form-dialog'
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
import { MoreHorizontal, Pencil, Trash2, MapPin } from 'lucide-react'
import { useOrigins } from '@/contexts/origins-context'
import type { Origin } from '@/lib/types'
import { formatDate } from '@/lib/utils'

export default function OriginsPage() {
  const { origins, addOrigin, updateOrigin, deleteOrigin, isLoading, total } = useOrigins()
  const [deleteTarget, setDeleteTarget] = useState<Origin | null>(null)

  const handleAddOrigin = async (data: Partial<Origin>) => {
    await addOrigin(data)
  }

  const handleEditOrigin = async (id: string | number, data: Partial<Origin>) => {
    await updateOrigin(id, data)
  }

  const handleDeleteOrigin = async () => {
    if (!deleteTarget) return
    await deleteOrigin(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns: Column<Origin>[] = [
    {
      key: 'name',
      header: 'Nombre',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Descripcion',
      cell: (row) => (
        <span className="text-muted-foreground max-w-[300px] truncate block">
          {row.description || '-'}
        </span>
      ),
    },
    {
      key: 'createdAt',
      header: 'Fecha de Creacion',
      cell: (row) => (
        <span className="text-muted-foreground">{formatDate(row.createdAt)}</span>
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
              <span className="sr-only">Abrir menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <OriginFormDialog
              origin={row}
              onSubmit={(data) => handleEditOrigin(row.id, data)}
              trigger={
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Pencil className="w-4 h-4 mr-2" />
                  Editar
                </DropdownMenuItem>
              }
            />
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
      <DashboardHeader title="Zonas" />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-muted-foreground">
                Administra las zonas para clasificar a tus clientes
              </p>
            </div>
            <OriginFormDialog onSubmit={handleAddOrigin} />
          </div>

          <DataTable
            data={origins}
            columns={columns}
            searchPlaceholder="Buscar zona..."
            isLoading={isLoading}
          />
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Zona</AlertDialogTitle>
            <AlertDialogDescription>
              Estas seguro de que deseas eliminar &quot;{deleteTarget?.name}&quot;? Esta accion no se
              puede deshacer. Los clientes asignados a esta zona mantendran el valor pero
              no aparecera en los filtros.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOrigin}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
