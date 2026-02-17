'use client'

import { Users, CreditCard, Recycle, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { DashboardStats } from '@/lib/types'

interface StatsCardsProps {
  stats: DashboardStats
}

export function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Clientes Activos',
      value: stats.totalActiveClients,
      icon: Users,
      format: 'number' as const,
      description: 'Total de negocios registrados',
    },
    {
      title: 'Créditos Otorgados',
      value: stats.totalCreditExtended,
      icon: CreditCard,
      format: 'currency' as const,
      description: 'Monto total en créditos',
    },
    {
      title: 'Pagos con Chatarra',
      value: stats.totalScrapPaymentsReceived,
      icon: Recycle,
      format: 'currency' as const,
      description: 'Valor total recibido en material',
    },
    {
      title: 'Deuda Pendiente',
      value: stats.totalPendingDebt,
      icon: AlertCircle,
      format: 'currency' as const,
      description: 'Balance total por cobrar',
      highlight: true,
    },
  ]

  const formatValue = (value: number, format: 'number' | 'currency') => {
    if (format === 'currency') {
      return new Intl.NumberFormat('es-PE', {
        style: 'currency',
        currency: 'PEN',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }
    return value.toLocaleString()
  }

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title} className={card.highlight ? 'border-destructive/50' : ''}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className={`h-4 w-4 ${card.highlight ? 'text-destructive' : 'text-muted-foreground'}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${card.highlight ? 'text-destructive' : ''}`}>
              {formatValue(card.value, card.format)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
