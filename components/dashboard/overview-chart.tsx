'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type MonthlyOverviewItem } from '@/lib/types'

interface OverviewChartProps {
  data: MonthlyOverviewItem[]
}

export function OverviewChart({ data }: OverviewChartProps) {
  // Los datos siempre deben venir del API
  const chartData: MonthlyOverviewItem[] = data

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Resumen Mensual</CardTitle>
            <CardDescription>Créditos vs Pagos con Chatarra (últimos 6 meses)</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="month"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `S/ ${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                itemStyle={{ fontSize: '12px' }}
                labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 'bold', marginBottom: '4px' }}
                formatter={(value: number) => [`S/ ${value.toLocaleString()}`, '']}
              />
              <Bar
                dataKey="credits"
                name="Créditos"
                fill="hsl(var(--chart-3))"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
              <Bar
                dataKey="payments"
                name="Pagos"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-chart-3" />
            <span className="text-sm text-muted-foreground">Créditos</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            <span className="text-sm text-muted-foreground">Pagos</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
