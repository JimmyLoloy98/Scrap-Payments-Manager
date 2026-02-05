'use client'

import { CreditCard, Recycle } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { RecentActivity } from '@/lib/types'
import { formatCurrency } from '@/lib/utils'

interface RecentActivityTableProps {
  activities: RecentActivity[]
}

export function RecentActivityTable({ activities }: RecentActivityTableProps) {
  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('es-PE', {
      month: 'numeric',
      day: 'numeric',
    }).format(new Date(date))
  }

  return (
    <Card className="w-[93%] px-0">
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
        <CardDescription>Últimos créditos y pagos registrados</CardDescription>
      </CardHeader>
      <CardContent className="px-3">
        <div className="space-y-4">
          {activities.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground italic">No hay actividad reciente</p>
          ) : (
            activities.map((activity, idx) => (
              <div
                key={`${activity.type}-${activity.id}-${idx}`}
                className="flex items-center justify-between gap-4 py-2 border-b last:border-0"
              >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full shrink-0 ${
                    activity.type === 'credit'
                      ? 'bg-chart-3/10 text-chart-3'
                      : 'bg-primary/10 text-primary'
                  }`}
                >
                  {activity.type === 'credit' ? (
                    <CreditCard className="w-4 h-4" />
                  ) : (
                    <Recycle className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">
                    {activity.clientName || (activity as any).client_name || 'Cliente desconocido'}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {activity.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge variant={activity.type === 'credit' ? 'secondary' : 'default'}>
                  {activity.type === 'credit' ? '-' : '+'}
                  {formatCurrency(activity.amount || (activity as any).total_amount || 0)}
                </Badge>
                <span className="text-sm text-muted-foreground hidden sm:block">
                  {formatDate(activity.date)}
                </span>
              </div>
            </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
