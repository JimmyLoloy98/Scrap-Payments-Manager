"use client";

import { use, useMemo, useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { DashboardHeader } from "@/components/dashboard-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  Recycle,
  AlertCircle,
  User,
  Edit,
  Mail,
  Calendar,
  Building,
  Eye,
  Trash2,
  Upload,
} from "lucide-react";
import { formatDate, formatCurrency, getAssetUrl } from "@/lib/utils";
import { DataTable, type Column } from "@/components/data-table";
import { Credit, ScrapPayment } from "@/lib/types";
import { PaymentFormDialog } from "@/components/payments/payment-form-dialog";
import { CreditFormDialog } from "@/components/credits/credit-form-dialog";
import { Loader2 } from "lucide-react";
import { clientsService, creditsService, paymentsService } from "@/services";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [client, setClient] = useState<any>(null);
  const [credits, setCredits] = useState<Credit[]>([]);
  const [payments, setPayments] = useState<ScrapPayment[]>([]);
  const [summary, setSummary] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [editingPayment, setEditingPayment] = useState<ScrapPayment | null>(null);
  const [editingCredit, setEditingCredit] = useState<Credit | null>(null);
  const [showPhotoPreview, setShowPhotoPreview] = useState(false);

  // New state for direct upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadPreviewUrl, setUploadPreviewUrl] = useState<string>("");
  const [showUploadModal, setShowUploadModal] = useState(false);

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

  const handleDeletePhoto = async () => {
    if (!client) return;
    try {
      setIsLoading(true);
      await clientsService.deletePhoto(id);
      await loadData();
      setShowPhotoPreview(false);
    } catch (error) {
      console.error("Error deleting photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setUploadPreviewUrl(url);
      setShowUploadModal(true);
    }
  };

  const handleSavePhoto = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    try {
      await clientsService.uploadPhoto(id, selectedFile);
      await loadData();
      handleCancelPhoto();
    } catch (error) {
      console.error("Error uploading photo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelPhoto = () => {
    setSelectedFile(null);
    if (uploadPreviewUrl) {
      URL.revokeObjectURL(uploadPreviewUrl);
    }
    setUploadPreviewUrl("");
    setShowUploadModal(false);
    // Reset file input
    const input = document.getElementById('photo-input') as HTMLInputElement;
    if (input) input.value = '';
  };

  const columnsCredits: Column<Credit>[] = [
    {
      key: "date",
      header: "Fecha",
      cell: (row) => formatDate(row.date),
    },
    {
      key: "items",
      header: "Detalle de Crédito",
      cell: (row) => (
        <div className="flex flex-col gap-1">
          {row.items && row.items.length > 0 ? (
            row.items.map((item, idx) => (
              <span key={idx} className="block text-sm truncate max-w-[250px]">
                • {item.description}{row.items.length > 1 && `: ${formatCurrency(item.price)}`}
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
        <span className="font-medium">{formatCurrency(row.amount)}</span>
      ),
    },

    {
      key: "actions",
      header: "Acciones",
      sortable: false,
      searchable: false,
      cell: (row) => (
        <Button title="Editar" variant="ghost" size="sm" onClick={() => setEditingCredit(row)}>
          <Edit className="w-4 h-4 text-green-500" />
        </Button>
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
      key: "items",
      header: "Detalle de Chatarra",
      sortable: false,
      cell: (row) => (
        <div className="flex flex-col gap-1">
          {row.items && row.items.length > 0 ? (
            row.items.map((item, idx) => (
              <span key={idx} className="block text-sm">
                • {item.scrapName}{row.items.length > 1 && `: ${formatCurrency(item.amount)}`}
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
      header: "Monto Total",
      cell: (row) => (
        <span className="font-medium">
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
        <Button title="Editar" variant="ghost" size="sm" onClick={() => setEditingPayment(row)}>
          <Edit className="w-4 h-4 text-indigo-500" />
        </Button>
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
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  {client.businessName}
                  <span className="ml-2 text-sm font-medium text-muted-foreground">
                    - {client.ownerName || "Sin nombre de responsable"}
                  </span>
                </h1>
                <div className="mt-1 flex items-center gap-4 text-sm md:text-base">
                  {client.phone ? (
                    <a
                      href={`tel:${client.phone}`}
                      className="text-muted-foreground flex items-center gap-1 hover:text-primary transition-colors underline font-semibold"
                    >
                      <Phone className="w-3 h-3" /> {client.phone}
                    </a>
                  ) : (
                    <p className="text-muted-foreground flex items-center gap-1">
                      <Phone className="w-3 h-3" /> Sin número de teléfono
                    </p>
                  )}

                  <p className="text-muted-foreground flex items-center gap-1">
                    <MapPin className="w-3 h-3" />{" "}
                    {client.address || "Sin dirección"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3 max-w-[600px]">
              <TabsTrigger value="overview" className="text-xs md:text-sm">
                Resumen
              </TabsTrigger>
              <TabsTrigger value="credits" className="text-xs md:text-sm">
                Creditos
              </TabsTrigger>
              <TabsTrigger value="payments" className="text-xs md:text-sm">
                Pagos con chatarra
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="gap-0">
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>Acceso rapido</span>
                      {client.photo ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPhotoPreview(true)}
                          className="text-xs gap-1"
                        >
                          <Eye className="w-4 h-4" />
                          Ver Foto
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById('photo-input')?.click()}
                          className="text-xs gap-1"
                        >
                          <Upload className="w-4 h-4" />
                          Subir Foto
                        </Button>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-evenly">
                      <CreditFormDialog
                        onSubmit={handleAddCredit}
                        className="py-6"
                        pendingDebt={financialSummary.pending_debt || financialSummary.pendingDebt}
                      />

                      <PaymentFormDialog
                        onSubmit={handleAddPayment}
                        className="py-6 bg-indigo-500"
                        pendingDebt={financialSummary.pending_debt || financialSummary.pendingDebt}
                      />
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

                {/* <Card
                  className={
                    client.currentDebt > 0 ? "border-destructive/50" : ""
                  }
                >
                  <CardContent className="flex flex-col items-stretch justify-between gap-4">
                    <div className="flex justify-between">
                      <div className="text-lg flex items-center gap-2">
                        <AlertCircle
                          className={`w-4 h-4 ${client.currentDebt > 0 ? "text-destructive" : "text-primary"}`}
                        />
                        Deuda Actual
                      </div>
                      <div>
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
                      </div>
                    </div>
                  </CardContent>
                </Card> */}
              </div>

              <Card>
                <CardContent className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div className="flex justify-between gap-4">
                    <div className="text-lg flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Credito Total</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {formatCurrency(financialSummary.total_credit || financialSummary.totalCredit)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        De {financialSummary.total_items_credit || credits.length} credito(s)
                      </p>
                    </div>
                  </div>

                  <Separator orientation="vertical" className="hidden md:block" />
                  <Separator orientation="horizontal" className="block md:hidden" />

                  <div className="flex justify-between gap-4">
                    <div className="text-lg flex items-center gap-2">
                      <Recycle className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total Pagado</span>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">
                        {formatCurrency(financialSummary.total_paid || financialSummary.totalPaid)}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        De {financialSummary.total_items_payment || payments.length} pago(s)
                      </p>
                    </div>
                  </div>

                  <Separator orientation="vertical" className="hidden md:block" />
                  <Separator orientation="horizontal" className="block md:hidden" />

                  <div className="flex justify-between gap-4">
                    <div className="text-lg flex items-center gap-2">
                      <AlertCircle
                        className={`h-4 w-4 ${(financialSummary.pending_debt || financialSummary.pendingDebt) > 0 ? "text-destructive" : "text-primary"}`}
                      />
                      <span className="text-sm font-medium">Deuda Pendiente</span>
                    </div>
                    <div>
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
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Información Adicional</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap justify-between gap-4">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Mail className="h-4 w-4" /> Email
                    </p>
                    <p className="text-sm font-medium">
                      {client.email || "No registrado"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" /> RUC
                    </p>
                    <p className="text-sm font-medium">
                      {client.ruc || "No registrado"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                       <FileText className="h-4 w-4" /> DNI
                    </p>
                    <p className="text-sm font-medium">
                      {client.dni || "No registrado"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Building className="h-4 w-4" /> Procedencia
                    </p>
                    <p className="text-sm font-medium">
                      {client.origin || "No registrado"}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" /> Fecha de Registro
                    </p>
                    <p className="text-sm font-medium">
                      {client.createdAt ? formatDate(client.createdAt) : "Desconocida"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="credits" className="space-y-4">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>Historial de Creditos</CardTitle>
                    <CardDescription>
                      Productos dados a credito
                    </CardDescription>
                  </div>

                  <CreditFormDialog
                    onSubmit={handleAddCredit}
                    pendingDebt={financialSummary.pending_debt || financialSummary.pendingDebt}
                  />
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={credits}
                    columns={columnsCredits}
                    searchPlaceholder="Buscar por producto..."
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="payments" className="space-y-4">
              <Card>
                <CardHeader className="flex items-center justify-between">
                  <div>
                    <CardTitle>Historial de Pagos</CardTitle>
                    <CardDescription>
                      Pagos recibidos en chatarra
                    </CardDescription>
                  </div>

                  <PaymentFormDialog
                    onSubmit={handleAddPayment}
                    className="bg-indigo-500"
                    pendingDebt={financialSummary.pending_debt || financialSummary.pendingDebt}
                  />
                </CardHeader>
                <CardContent>
                  <DataTable
                    data={payments}
                    columns={columnsPayments}
                    searchPlaceholder="Buscar por nombre..."
                    isLoading={isLoading}
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <CreditFormDialog
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

      {/* Photo Preview Modal */}
      <Dialog open={showPhotoPreview} onOpenChange={setShowPhotoPreview}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Foto del Local - {client?.businessName}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 gap-4">
            {client?.photo && (
              <>
                <img
                  src={getAssetUrl(client.photo)}
                  alt={`Foto de ${client.businessName}`}
                  className="max-w-full max-h-[70vh] rounded-lg object-contain"
                />
                <Button
                  variant="destructive"
                  onClick={handleDeletePhoto}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Eliminando..." : "Eliminar Foto"}
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showUploadModal} onOpenChange={(open) => !open && handleCancelPhoto()}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Previsualización de Foto</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4 gap-4">
            {uploadPreviewUrl && (
              <img
                src={uploadPreviewUrl}
                alt="Upload preview"
                className="max-w-full max-h-[50vh] rounded-lg object-contain border"
              />
            )}
            <div className="flex gap-4 w-full">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCancelPhoto}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button
                className="flex-1"
                onClick={handleSavePhoto}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                {isLoading ? "Guardando..." : "Guardar Foto"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Hidden File Input for Direct Upload */}
      <input
        type="file"
        id="photo-input"
        className="hidden"
        accept="image/*"
        onChange={handleFileChange}
      />
    </>
  );
}
