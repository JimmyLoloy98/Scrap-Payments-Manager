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
import { ArrowLeft, Phone, Mail, MapPin, FileText, CreditCard, Recycle, AlertCircle, Plus, Store, Users, User, FileDigit } from 'lucide-react'
import { mockClients, mockCredits, mockScrapPayments } from '@/lib/mock-data'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

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
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
    }).format(value)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(date))
  }

  if (!client) {
    return (
      <>
        <DashboardHeader title="Negocio No Encontrado" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">Negocio No Encontrado</h1>
            <p className="text-muted-foreground mb-4">
              El negocio que buscas no existe.
            </p>
            <Button asChild>
              <Link href="/clients">Volver a Negocios</Link>
            </Button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <DashboardHeader
        title={client.businessName || client.name}
        breadcrumbs={[
          { label: 'Negocios', href: '/clients' },
          { label: client.businessName || client.name },
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
            <div className="flex items-center gap-4">
                 <Avatar className="w-16 h-16 rounded-lg border">
                    {client.photoUrl ? (
                        <AvatarImage src={client.photoUrl} alt={client.businessName} />
                    ) : (
                        <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                            <Store className="w-8 h-8" />
                        </AvatarFallback>
                    )}
                 </Avatar>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight">{client.businessName || client.name}</h1>
                  <p className="text-muted-foreground flex items-center gap-2">
                    <User className="w-3 h-3" /> {client.ownerName || 'Sin nombre de responsable'}
                  </p>
                </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 max-w-[600px]">
              <TabsTrigger value="overview">Info del negocio</TabsTrigger>
              <TabsTrigger value="credits">Creditos</TabsTrigger>
              <TabsTrigger value="payments">Pagos con chatarra</TabsTrigger>
              <TabsTrigger value="summary">Resumen</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Informacion de Contacto y Legal</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-1">
                             <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                <FileDigit className="w-3 h-3" /> RUC
                             </p>
                             <p className="text-sm font-medium">{client.ruc || 'No registrado'}</p>
                         </div>
                         <div className="space-y-1">
                             <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                                <FileDigit className="w-3 h-3" /> DNI
                             </p>
                             <p className="text-sm font-medium">{client.dni || 'No registrado'}</p>
                         </div>
                    </div>
                    <div className="space-y-1 border-t pt-3">
                         <div className="flex items-center gap-3">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{client.phone || 'No registrado'}</span>
                         </div>
                    </div>
                     <div className="space-y-1">
                         <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{client.email || 'No registrado'}</span>
                         </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex items-center gap-3">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <span>{client.address || 'No registrado'}</span>
                        </div>
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
                      Deuda Actual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className={`text-3xl font-bold ${client.currentDebt > 0 ? 'text-destructive' : 'text-primary'}`}>
                      {formatCurrency(client.currentDebt)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {client.currentDebt > 0
                        ? 'Saldo pendiente de cobro'
                        : 'Sin deuda pendiente'}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="credits" className="space-y-4">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>Historial de Creditos</CardTitle>
                    <CardDescription>Todos los creditos otorgados al cliente</CardDescription>
                  </div>

                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Credito
                  </Button>
                </CardHeader>
                <CardContent>
                  {clientCredits.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Producto</TableHead>
                          <TableHead>Monto</TableHead>
                          <TableHead>Estado</TableHead>
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
                                {credit.status === 'paid' ? 'Pagado' : credit.status === 'partial' ? 'Parcial' : 'Pendiente'}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">
                      Sin historial de creditos
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pagos con Chatarra</CardTitle>
                    <CardDescription>Pagos recibidos en chatarra</CardDescription>
                  </div>

                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Pago
                  </Button>
                </CardHeader>
                <CardContent>
                  {clientPayments.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Detalle</TableHead>
                          <TableHead>Valor</TableHead>
                          <TableHead>Notas</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientPayments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{formatDate(payment.date)}</TableCell>
                            <TableCell>
                              <div className="text-sm space-y-1">
                                {payment.scrapDetails.ironKg > 0 && (
                                  <div>Hierro: {payment.scrapDetails.ironKg}kg</div>
                                )}
                                {payment.scrapDetails.batteriesUnits > 0 && (
                                  <div>Baterias: {payment.scrapDetails.batteriesUnits} u</div>
                                )}
                                {payment.scrapDetails.copperKg > 0 && (
                                  <div>Cobre: {payment.scrapDetails.copperKg}kg</div>
                                )}
                                {payment.scrapDetails.aluminumKg > 0 && (
                                  <div>Aluminio: {payment.scrapDetails.aluminumKg}kg</div>
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
                      No hay pagos registrados
                    </p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Credito Total</CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(financialSummary.totalCredit)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      De {clientCredits.length} credito(s)
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Pagado</CardTitle>
                    <Recycle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(financialSummary.totalPaid)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      De {clientPayments.length} pago(s)
                    </p>
                  </CardContent>
                </Card>

                <Card className={financialSummary.pendingDebt > 0 ? 'border-destructive/50' : ''}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Deuda Pendiente</CardTitle>
                    <AlertCircle className={`h-4 w-4 ${financialSummary.pendingDebt > 0 ? 'text-destructive' : 'text-primary'}`} />
                  </CardHeader>
                  <CardContent>
                    <div className={`text-2xl font-bold ${financialSummary.pendingDebt > 0 ? 'text-destructive' : 'text-primary'}`}>
                      {formatCurrency(financialSummary.pendingDebt)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {financialSummary.pendingDebt > 0 ? 'Saldo pendiente' : 'Al dia!'}
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
