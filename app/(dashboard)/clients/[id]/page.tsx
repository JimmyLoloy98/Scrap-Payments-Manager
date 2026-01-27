"use client";

import { use, useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  Recycle,
  AlertCircle,
  Pencil,
  Store,
  User,
  FileDigit,
  MoreHorizontal,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react";
import { mockClients, mockCredits, mockScrapPayments } from "@/lib/mock-data";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate, formatCurrency } from "@/lib/utils";
import { DataTable, type Column } from "@/components/data-table";
import { Credit, ScrapPayment } from "@/lib/types";
import { PaymentFormDialog } from "@/components/payments/payment-form-dialog";
import { CreditFormDialog } from "@/components/credits/credit-form-dialog";
import { Loader2 } from "lucide-react";
import { clientsService, creditsService, paymentsService } from "@/services";
import { useClients } from "@/contexts/clients-context";



export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { clients } = useClients();
  const [client, setClient] = useState<any>(null);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [payments, setPayments] = useState<ScrapPayment[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editingPayment, setEditingPayment] = useState<ScrapPayment | null>(null);
  const [editingCredit, setEditingCredit] = useState<Credit | null>(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [clientData, creditsRes, paymentsRes, summaryData] = await Promise.all([
        clientsService.getById(id),
        creditsService.getAll({ clientId: id }),
        paymentsService.getAll({ clientId: id }),
        clientsService.getSummary(id),
      ]);
      setClient(clientData);
      setCredits(creditsRes.credits || []);
      setPayments(paymentsRes.payments || []);
      setSummary(summaryData);
    } catch (error) {
      console.error("Error loading client details:", error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddCredit = async (data: Partial<Credit>) => {
    await creditsService.create({ ...data, clientId: id });
    await loadData();
  };

  const handleAddPayment = async (data: Partial<ScrapPayment>) => {
    await paymentsService.create({ ...data, clientId: id });
    await loadData();
  };

  const handleEditPayment = async (editId: string | number, data: Partial<ScrapPayment>) => {
    await paymentsService.update(String(editId), data);
    await loadData();
  };

  const handleEditCredit = async (editId: string | number, data: Partial<Credit>) => {
    await creditsService.update(editId, data);
    await loadData();
  };

  const handleUpdateStatus = async (editId: string | number, status: Credit["status"]) => {
    await creditsService.updateStatus(editId, status);
    await loadData();
  };

  const getStatusIcon = (status: Credit["status"]) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="w-3 h-3" />;
      case "partial":
        return <Clock className="w-3 h-3" />;
      default:
        return <AlertCircle className="w-3 h-3" />;
    }
  };

  const columnsCredits: Column<Credit>[] = [
    {
      key: "date",
      header: "Fecha",
      cell: (row) => formatDate(row.date),
    },
    {
      key: "clientName",
      header: "Cliente",
      cell: (row) => (
        <Link
          href={`/clients/${row.clientId}`}
          className="font-medium hover:underline"
        >
          {row.clientName}
        </Link>
      ),
    },
    /* {
      key: 'clientOrigin',
      header: 'Procedencia',
      cell: (row) => (
        <span className="text-muted-foreground">{row.clientOrigin || '-'}</span>
      ),
    }, */
    {
      key: "items",
      header: "Productos", // Changed from 'Product' to match functionality
      cell: (row) => (
        <div className="flex flex-col gap-1">
          {row.items && row.items.length > 0 ? (
            row.items.map((item, idx) => (
              <span key={idx} className="block text-sm truncate max-w-[250px]">
                • {item.description}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground italic">Sin productos</span>
          )}
        </div>
      ),
    },
    {
      key: "amount",
      header: "Monto Total",
      cell: (row) => (
        <span className="font-bold">{formatCurrency(row.amount)}</span>
      ),
    },
    {
      key: "status",
      header: "Estado",
      cell: (row) => (
        <Badge
          variant={
            row.status === "paid"
              ? "default"
              : row.status === "partial"
                ? "secondary"
                : "destructive"
          }
          className="gap-1"
        >
          {getStatusIcon(row.status)}
          {row.status === "paid"
            ? "Pagado"
            : row.status === "partial"
              ? "Parcial"
              : "Pendiente"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Actions",
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
            <DropdownMenuItem onSelect={() => setEditingCredit(row)}>
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
            {row.status !== "paid" && (
              <>
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus(row.id, "partial")}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Mark Partial
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleUpdateStatus(row.id, "paid")}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Paid
                </DropdownMenuItem>
              </>
            )}
            {row.status === "paid" && (
              <DropdownMenuItem
                onClick={() => handleUpdateStatus(row.id, "pending")}
              >
                <AlertCircle className="w-4 h-4 mr-2" />
                Mark Pending
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const columnsPayments: Column<ScrapPayment>[] = [
    {
      key: "date",
      header: "Fecha",
      cell: (row) => formatDate(row.date),
    },
    {
      key: "clientName",
      header: "Cliente",
      cell: (row) => (
        <Link
          href={`/clients/${row.clientId}`}
          className="font-medium hover:underline"
        >
          {row.clientName}
        </Link>
      ),
    },
    {
      key: "items",
      header: "Detalle de Chatarra",
      sortable: false,
      cell: (row) => (
        <div className="flex flex-col gap-1">
          {row.items && row.items.length > 0 ? (
            row.items.map((item, idx) => (
              <span key={idx} className="block text-sm">
                • {item.scrapName}: {formatCurrency(item.amount)}
              </span>
            ))
          ) : (
            <span className="text-muted-foreground italic">Sin detalles</span>
          )}
          {/* Fallback for old data if needed */}
          {/* @ts-ignore */}
          {row.scrapDetails && (
            <span className="text-xs text-yellow-600">Old data present</span>
          )}
        </div>
      ),
    },
    {
      key: "totalValue",
      header: "Valor Total",
      cell: (row) => (
        <span className="font-medium text-primary">
          {formatCurrency(row.totalValue)}
        </span>
      ),
    },
    {
      key: "actions",
      header: "Acciones",
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
            <DropdownMenuItem onSelect={() => setEditingPayment(row)}>
              <Pencil className="w-4 h-4 mr-2" />
              Editar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const financialSummary = useMemo(() => {
    if (summary) return summary;

    const totalCredit = credits.reduce((sum, c) => sum + c.amount, 0);
    const totalPaid = payments.reduce((sum, p) => sum + p.totalValue, 0);
    return {
      totalCredit,
      total_credit: totalCredit,
      total_paid: totalPaid,
      pending_debt: totalCredit - totalPaid,
      total_items_credit: credits.length,
      total_items_payment: payments.length
    };
  }, [credits, payments, summary]);

  if (isLoading && !client) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!client) {
    return (
      <>
        <DashboardHeader title="Negocio No Encontrado" />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-xl font-semibold mb-2">
              Negocio No Encontrado
            </h1>
            <p className="text-muted-foreground mb-4">
              El negocio que buscas no existe.
            </p>
            <Button asChild>
              <Link href="/clients">Volver a Negocios</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardHeader
        title={client.businessName}
        breadcrumbs={[
          { label: "Negocios", href: "/clients" },
          { label: client.businessName },
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
                  <AvatarImage
                    src={client.photoUrl}
                    alt={client.businessName}
                  />
                ) : (
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary">
                    <Store className="w-8 h-8" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {client.businessName}
                </h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <User className="w-3 h-3" />{" "}
                  {client.ownerName || "Sin nombre de responsable"}
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-4 max-w-[600px]">
              <TabsTrigger value="overview" className="text-xs md:text-sm">
                Info del negocio
              </TabsTrigger>
              <TabsTrigger value="credits" className="text-xs md:text-sm">
                Creditos
              </TabsTrigger>
              <TabsTrigger value="payments" className="text-xs md:text-sm">
                Pagos con chatarra
              </TabsTrigger>
              <TabsTrigger value="summary" className="text-xs md:text-sm">
                Resumen
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Informacion de Contacto y Legal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                          <FileDigit className="w-3 h-3" /> RUC
                        </p>
                        <p className="text-sm font-medium">
                          {client.ruc || "No registrado"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                          <FileDigit className="w-3 h-3" /> DNI
                        </p>
                        <p className="text-sm font-medium">
                          {client.dni || "No registrado"}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-1 border-t pt-3">
                      <div className="flex items-center gap-3">
                        <Phone className="w-4 h-4 text-muted-foreground" />
                        <span>{client.phone || "No registrado"}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-muted-foreground" />
                        <span>{client.email || "No registrado"}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{client.address || "No registrado"}</span>
                      </div>
                    </div>
                    {client.notes && (
                      <div className="flex items-start gap-3 pt-2 border-t">
                        <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {client.notes}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card
                  className={
                    client.currentDebt > 0 ? "border-destructive/50" : ""
                  }
                >
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertCircle
                        className={`w-4 h-4 ${client.currentDebt > 0 ? "text-destructive" : "text-primary"}`}
                      />
                      Deuda Actual
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p
                      className={`text-3xl font-bold ${client.currentDebt > 0 ? "text-destructive" : "text-primary"}`}
                    >
                      {formatCurrency(client.currentDebt)}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      {client.currentDebt > 0
                        ? "Saldo pendiente de cobro"
                        : "Sin deuda pendiente"}
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
                    <CardDescription>
                      Todos los creditos otorgados al cliente
                    </CardDescription>
                  </div>

                  <CreditFormDialog
                    clients={clients}
                    onSubmit={handleAddCredit}
                  />
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={credits}
                    columns={columnsCredits}
                    searchPlaceholder="Search credits..."
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pagos con Chatarra</CardTitle>
                    <CardDescription>
                      Pagos recibidos en chatarra
                    </CardDescription>
                  </div>

                  <PaymentFormDialog
                    clients={clients}
                    onSubmit={handleAddPayment}
                  />
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={payments}
                    columns={columnsPayments}
                    searchPlaceholder="Search payments..."
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="summary" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Credito Total
                    </CardTitle>
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {formatCurrency(financialSummary.total_credit || financialSummary.totalCredit)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      De {financialSummary.total_items_credit || credits.length} credito(s)
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Total Pagado
                    </CardTitle>
                    <Recycle className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {formatCurrency(financialSummary.total_paid || financialSummary.totalPaid)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      De {financialSummary.total_items_payment || payments.length} pago(s)
                    </p>
                  </CardContent>
                </Card>

                <Card
                  className={
                    (financialSummary.pending_debt || financialSummary.pendingDebt) > 0
                      ? "border-destructive/50"
                      : ""
                  }
                >
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Deuda Pendiente
                    </CardTitle>
                    <AlertCircle
                      className={`h-4 w-4 ${(financialSummary.pending_debt || financialSummary.pendingDebt) > 0 ? "text-destructive" : "text-primary"}`}
                    />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${(financialSummary.pending_debt || financialSummary.pendingDebt) > 0 ? "text-destructive" : "text-primary"}`}
                    >
                      {formatCurrency(financialSummary.pending_debt || financialSummary.pendingDebt)}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {(financialSummary.pending_debt || financialSummary.pendingDebt) > 0
                        ? "Saldo pendiente"
                        : "Al dia!"}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreditFormDialog
        clients={clients}
        trigger={<span className="hidden" />}
        credit={editingCredit || undefined}
        open={!!editingCredit}
        onOpenChange={(open) => !open && setEditingCredit(null)}
        onSubmit={(data) => {
          if (editingCredit) {
            return handleEditCredit(editingCredit.id, data);
          }
          return Promise.resolve();
        }}
      />

      <PaymentFormDialog
        clients={clients}
        trigger={<span className="hidden" />}
        payment={editingPayment || undefined}
        open={!!editingPayment}
        onOpenChange={(open) => !open && setEditingPayment(null)}
        onSubmit={(data) => {
          if (editingPayment) {
            return handleEditPayment(editingPayment.id, data);
          }
          return Promise.resolve();
        }}
      />
    </>
  );
}
