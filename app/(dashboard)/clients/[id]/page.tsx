'use client'

import { use, useMemo } from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard-header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { ArrowLeft, Phone, Mail, MapPin, FileText, CreditCard, Recycle, AlertCircle } from 'lucide-react'
import { mockClients, mockCredits, mockScrapPayments } from '@/lib/mock-data'

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  
  const client = mockClients.find((c) => c.id === id)
  const clientCredits = mockCredits.filter((c) => c.clientId === id)
  const clientPayments = mockScrapPayments.filter((p) => p.clientId === id)

  const financialSummary = useMemo(() => {
    const totalCredit = clientCredits.reduce((sum, c) => sum + c.amount, 0)
    const totalPaid = clientPayments.reduce((sum, p) => sum + p.totalValue, 0)
    return {
      totalCredit,
      totalPaid,
      pendingDebt: totalCredit - totalPaid,
    }
  }, [clientCredits, clientPayments])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date))
  }

  if (!client) {
    return (
      <>
        <DashboardHeader title="Client Not Found" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">Client Not Found</h1>
            <p className="text-muted-foreground mb-4">
              The client you are looking for does not exist.
            </p>
            <Button asChild>
              <Link href="/clients">Back to Clients</Link>
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <DashboardHeader
        title={client.name}
        breadcrumbs={[
          { label: 'Clients', href: '/clients' },
          { label: client.name },
        ]}
      />
      <div className="flex-1 overflow-auto p-4 md:p-6">
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
              <Link href="/clients">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold tracking-tight">{client.name}</h1>
              <p className="text-muted-foreground">Client since {formatDate(client.createdAt)}</p>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 max-w-[600px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="credits">Credits</TabsTrigger>
              <TabsTrigger value="payments">Payments</TabsTrigger>
              <TabsTrigger value="summary">Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span>{client.phone || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span>{client.email || 'Not provided'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{client.address || 'Not provided'}</span>
                    </div>
                    {client.notes && (
                      <div className="flex items-start gap-3 pt-2 border-t">
                        <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm text-muted-foreground">{client.notes}</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card className={client.currentDebt > 0 ? 'border-destructive/50' : ''}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle className={`w-4 h-4 ${client.currentDebt > 0 ? 'text-destructive' : 'text-primary'}`} />
                      Current Debt
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-3xl font-bold ${client.currentDebt > 0 ? 'text-destructive' : 'text-primary'}`}>
                      {formatCurrency(client.currentDebt)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {client.currentDebt > 0
                        ? 'Outstanding balance to be collected'
                        : 'No outstanding debt'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="credits" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Credit History</CardTitle>
                  <CardDescription>All credit deliveries for this client</CardDescription>
                </CardHeader>
                <CardContent>
                  {clientCredits.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientCredits.map((credit) => (
                          <TableRow key={credit.id}>
                            <TableCell>{formatDate(credit.date)}</TableCell>
                            <TableCell>{credit.productDescription}</TableCell>
                            <TableCell>{formatCurrency(credit.amount)}</TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  credit.status === 'paid'
                                    ? 'default'
                                    : credit.status === 'partial'
                                    ? 'secondary'
                                    : 'destructive'
                                }
                              >
                                {credit.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No credit history for this client
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Scrap Payments</CardTitle>
                  <CardDescription>All scrap payments received from this client</CardDescription>
                </CardHeader>
                <CardContent>
                  {clientPayments.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Scrap Details</TableHead>
                          <TableHead>Value</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatDate(payment.date)}</TableCell>
                            <TableCell>
                              <div className="text-sm space-y-1">
                                {payment.scrapDetails.ironKg > 0 && (
                                  <div>Iron: {payment.scrapDetails.ironKg}kg</div>
                                )}
                                {payment.scrapDetails.batteriesUnits > 0 && (
                                  <div>Batteries: {payment.scrapDetails.batteriesUnits} units</div>
                                )}
                                {payment.scrapDetails.copperKg > 0 && (
                                  <div>Copper: {payment.scrapDetails.copperKg}kg</div>
                                )}
                                {payment.scrapDetails.aluminumKg > 0 && (
                                  <div>Aluminum: {payment.scrapDetails.aluminumKg}kg</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-primary font-medium">
                              {formatCurrency(payment.totalValue)}
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate">
                              {payment.notes}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      No payments received from this client
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Credit</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(financialSummary.totalCredit)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      From {clientCredits.length} credit(s)
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
                    <Recycle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(financialSummary.totalPaid)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      From {clientPayments.length} payment(s)
                    </p>
                  </CardContent>
                </Card>

                <Card className={financialSummary.pendingDebt > 0 ? 'border-destructive/50' : ''}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pending Debt</CardTitle>
                    <AlertCircle className={`h-4 w-4 ${financialSummary.pendingDebt > 0 ? 'text-destructive' : 'text-primary'}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${financialSummary.pendingDebt > 0 ? 'text-destructive' : 'text-primary'}`}>
                      {formatCurrency(financialSummary.pendingDebt)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {financialSummary.pendingDebt > 0 ? 'Outstanding balance' : 'All paid up!'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
