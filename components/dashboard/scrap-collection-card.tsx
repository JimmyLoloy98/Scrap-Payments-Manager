'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar, CalendarDayButton } from '@/components/ui/calendar'
import { dashboardService, scrapsService } from '@/services'
import { ScrapCollectionItem, ScrapType } from '@/lib/types'
import { format, startOfMonth, endOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { DateRange } from 'react-day-picker'
import { Loader2, Filter, Recycle, Calendar as CalendarIcon, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

export function ScrapCollectionCard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: startOfMonth(new Date()),
    to: new Date(),
  })
  const [data, setData] = useState<ScrapCollectionItem[]>([])
  const [scrapTypes, setScrapTypes] = useState<ScrapType[]>([])
  const [selectedScrapId, setSelectedScrapId] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(false)

  const fetchData = async () => {
    if (!dateRange?.from || !dateRange?.to) return

    setIsLoading(true)
    try {
      const response = await dashboardService.getScrapCollection(
        format(dateRange.from, 'yyyy-MM-dd'),
        format(dateRange.to, 'yyyy-MM-dd'),
        selectedScrapId === "all" ? undefined : selectedScrapId
      )
      setData(response.data || [])
    } catch (error) {
      console.error('Error fetching scrap collection:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchScrapTypes = async () => {
    try {
      const response = await scrapsService.getAll(1, 100)
      setScrapTypes(response.scraps || [])
    } catch (error) {
      console.error('Error fetching scrap types:', error)
    }
  }

  useEffect(() => {
    fetchScrapTypes()
    fetchData()
  }, [])

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 space-y-0">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Recycle className="w-5 h-5 text-primary" />
            Recolección de Chatarra
          </CardTitle>
          <CardDescription>
            Resumen de materiales recibidos por periodo
          </CardDescription>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-full sm:w-[300px] justify-start text-left font-normal h-9 bg-muted/20",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "dd/MM/yyyy", { locale: es })} -{" "}
                      {format(dateRange.to, "dd/MM/yyyy", { locale: es })}
                    </>
                  ) : (
                    format(dateRange.from, "dd/MM/yyyy", { locale: es })
                  )
                ) : (
                  <span>Seleccionar fecha</span>
                )}
                <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={1}
                captionLayout="dropdown"
                locale={es}
                className="p-3 [--cell-size:--spacing(10)] md:[--cell-size:--spacing(12)]"
                formatters={{
                  formatMonthDropdown: (date) => {
                    return date.toLocaleString("es-PE", { month: "long" })
                  },
                }}
                components={{
                  DayButton: ({ children, modifiers, day, ...props }) => {
                    return (
                      <CalendarDayButton day={day} modifiers={modifiers} {...props}>
                        {children}
                      </CalendarDayButton>
                    )
                  },
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={selectedScrapId} onValueChange={setSelectedScrapId}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 bg-muted/20">
              <SelectValue placeholder="Seleccionar material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los materiales</SelectItem>
              {scrapTypes.map((scrap) => (
                <SelectItem key={scrap.id} value={String(scrap.id)}>
                  {scrap.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            size="sm"
            onClick={fetchData}
            disabled={isLoading || !dateRange?.from || !dateRange?.to}
            className="flex-none"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Filter className="w-4 h-4 mr-2" />}
            Filtrar
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border overflow-hidden">
          <div className="max-h-[350px] overflow-y-auto relative">
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10 shadow-sm">
                <TableRow className="bg-muted hover:bg-muted">
                  <TableHead className="text-muted-foreground">Tipo de Material</TableHead>
                  <TableHead className="text-right text-muted-foreground">Acumulados</TableHead>
                  <TableHead className="text-muted-foreground">Unidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center">
                    <div className="flex flex-col items-center justify-center gap-2">
                       <Loader2 className="w-6 h-6 animate-spin text-primary" />
                       <span className="text-sm text-muted-foreground">Cargando estadísticas...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : data.length > 0 ? (
                data.map((item) => (
                  <TableRow key={item.scrapId} className="hover:bg-muted/30 transition-colors">
                    <TableCell className="font-semibold">{item.scrapName}</TableCell>
                    <TableCell className="text-right text-base">
                      {item.totalQuantity.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 2 })}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                        {item.unitMeasure}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center gap-1">
                      <Recycle className="w-8 h-8 opacity-20" />
                      <p>No se encontraron recolecciones en este periodo</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      </CardContent>
    </Card>
  )
}
