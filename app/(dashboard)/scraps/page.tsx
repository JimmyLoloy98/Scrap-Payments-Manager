'use client'

import { useState } from 'react'
import { DashboardHeader } from '@/components/dashboard-header'
import { DataTable, type Column } from '@/components/data-table'
import { ScrapFormDialog } from '@/components/scraps/scrap-form-dialog'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import { MoreHorizontal, Pencil, Trash2, Recycle } from 'lucide-react'
import { useScraps } from '@/contexts/scraps-context'
import type { ScrapType } from '@/lib/types'
import { formatDate } from '@/lib/utils'

export default function ScrapsPage() {
  const {
    scraps,
    addScrap,
    updateScrap,
    deleteScrap,
    isLoading,
    total,
    unitFilter,
    setUnitFilter,
    searchTerm,
    setSearchTerm
  } = useScraps()
  const [deleteTarget, setDeleteTarget] = useState<ScrapType | null>(null)

  const handleAddScrap = async (data: Partial<ScrapType>) => {
    await addScrap(data)
  }

  const handleEditScrap = async (id: string | number, data: Partial<ScrapType>) => {
    await updateScrap(id, data)
  }

  const handleDeleteScrap = async () => {
    if (!deleteTarget) return
    await deleteScrap(deleteTarget.id)
    setDeleteTarget(null)
  }

  const columns: Column<ScrapType>[] = [
    {
      key: 'name',
      header: 'Nombre',
      cell: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Recycle className="w-4 h-4 text-primary" />
          </div>
          <span className="font-medium">{row.name}</span>
        </div>
      ),
    },
    {
      key: 'unitMeasure',
      header: 'Unidad',
      cell: (row) => (
        <span className="capitalize px-2 py-1 rounded-md bg-muted text-xs font-medium">
          {row.unitMeasure === 'kg' ? '(Kg)' : '(Und)'}
        </span>
      ),
    },
    /* {
      key: 'description',
      header: 'Descripcion',
      cell: (row) => (
        <span className="text-muted-foreground max-w-[300px] truncate block">
          {row.description || '-'}
        </span>
      ),
    }, */
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
            <ScrapFormDialog
              scrap={row}
              onSubmit={(data) => handleEditScrap(row.id, data)}
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
      <DashboardHeader title="Gestion de Chatarras" />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-muted-foreground">
                Administra los tipos de chatarra
              </p>
            </div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">Filtrar:</span>
                <Select value={unitFilter} onValueChange={setUnitFilter}>
                  <SelectTrigger className="w-[130px]">
                    <SelectValue placeholder="Unidad de medida" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="kg">(Kg)</SelectItem>
                    <SelectItem value="und">(Und)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <ScrapFormDialog onSubmit={handleAddScrap} />
            </div>
          </div>

          <div className="rounded-lg border bg-card p-4 max-w-xs">
            <p className="text-sm text-muted-foreground">Total de tipos de chatarra</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>

          <DataTable
            data={scraps}
            columns={columns}
            searchPlaceholder="Buscar chatarras..."
            isLoading={isLoading}
            onSearch={setSearchTerm}
            searchValue={searchTerm}
          />
        </div>
      </div>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Tipo de Chatarra</AlertDialogTitle>
            <AlertDialogDescription>
              Estas seguro de que deseas eliminar &quot;{deleteTarget?.name}&quot;? Esta accion no se
              puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteScrap}
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
