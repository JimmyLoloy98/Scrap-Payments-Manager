'use client'

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const data = [
  { month: 'Aug', credits: 4200, payments: 2400 },
  { month: 'Sep', credits: 3800, payments: 2800 },
  { month: 'Oct', credits: 5100, payments: 3200 },
  { month: 'Nov', credits: 4600, payments: 3800 },
  { month: 'Dec', credits: 5800, payments: 4100 },
  { month: 'Jan', credits: 6200, payments: 5100 },
]

export function OverviewChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>Credits vs Scrap Payments (last 6 months)</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Bar
                dataKey="credits"
                name="Credits"
                fill="hsl(var(--chart-3))"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="payments"
                name="Payments"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-chart-3" />
            <span className="text-sm text-muted-foreground">Credits</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-primary" />
            <span className="text-sm text-muted-foreground">Payments</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
