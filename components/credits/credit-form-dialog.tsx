"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Plus, Trash2, Pencil } from "lucide-react";
import type { Client, Credit, CreditItem } from "@/lib/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface CreditFormDialogProps {
  clients: Client[];
  onSubmit: (data: Partial<Credit>) => Promise<void>;
  trigger?: React.ReactNode;
  credit?: Credit;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function CreditFormDialog({
  clients,
  onSubmit,
  trigger,
  credit,
  open: controlledOpen,
  onOpenChange,
}: CreditFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : internalOpen;

  const setOpen = (val: boolean) => {
    if (isControlled && onOpenChange) {
      onOpenChange(val);
    }
    if (!isControlled) {
      setInternalOpen(val);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  const [clientId, setClientId] = useState("");
  const [date, setDate] = useState<Date>(new Date());
  const [items, setItems] = useState<CreditItem[]>([
    { description: "", price: 0 },
  ]);
  const [notes, setNotes] = useState("");

  const isEditing = !!credit;

  React.useEffect(() => {
    if (open) {
      if (credit) {
        setClientId(credit.clientId);
        setDate(credit.date ? new Date(credit.date) : new Date());
        setItems(
          credit.items && credit.items.length > 0
            ? credit.items
            : [{ description: "", price: 0 }]
        );
        setNotes(credit.notes || "");
      } else {
        setClientId("");
        setDate(new Date());
        setItems([{ description: "", price: 0 }]);
        setNotes("");
      }
    }
  }, [credit, open]);

  const handleAddItem = () => {
    setItems([...items, { description: "", price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof CreditItem,
    value: string | number,
  ) => {
    const newItems = [...items];
    if (field === "price") {
      newItems[index] = {
        ...newItems[index],
        [field]: typeof value === "string" ? parseFloat(value) || 0 : value,
      };
    } else {
      newItems[index] = { ...newItems[index], [field]: String(value) };
    }
    setItems(newItems);
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.price || 0), 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return;
    setIsLoading(true);
    try {
      const selectedClient = clients.find((c) => c.id === clientId);

      const creditData: Partial<Credit> = {
        clientId,
        clientName:
          selectedClient?.businessName || selectedClient?.name || "Unknown",
        date,
        items: items.filter((item) => item.description.trim() !== ""),
        amount: calculateTotal(),
        notes,
      };

      await onSubmit(creditData);
      setOpen(false);
      // Reset form
      setClientId("");
      setDate(new Date());
      setItems([{ description: "", price: 0 }]);
      setNotes("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Credito
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Credito' : 'Registrar Credito'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Modifica los detalles del credito.' : 'Ingresa los detalles del credito.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex justify-between">
              <div className="grid gap-2">
                <Label htmlFor="client">Cliente *</Label>
                <Select value={clientId} onValueChange={setClientId}>
                  <SelectTrigger id="client">
                    <SelectValue placeholder="Seleccionar cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        {client.businessName || client.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label>Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "dd/MM/yyyy")
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={(d: Date | undefined) => d && setDate(d)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="space-y-4 border rounded-md p-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <Label>Detalles de productos</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                >
                  <Plus className="w-4 h-4 mr-1" /> Agregar Item
                </Button>
              </div>

              {items.map((item, index) => (
                <div
                  key={index}
                  className="grid sm:grid-cols-[1fr_120px_auto] gap-2 items-start"
                >
                  <div className="grid gap-1">
                    {index === 0 && (
                      <Label className="text-xs text-muted-foreground">
                        Descripcion
                      </Label>
                    )}
                    <Input
                      placeholder="Ej: Laminas de acero"
                      value={item.description}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div className="grid gap-1">
                    {index === 0 && (
                      <Label className="text-xs text-muted-foreground">
                        Precio
                      </Label>
                    )}
                    <Input
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      value={item.price || ""}
                      onChange={(e) =>
                        handleItemChange(index, "price", e.target.value)
                      }
                      required
                    />
                  </div>
                  <div
                    className={`flex items-end ${index === 0 ? "pt-6" : ""}`}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveItem(index)}
                      disabled={items.length === 1}
                      className="text-destructive hover:text-destructive/90"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <div className="flex justify-end pt-2 border-t">
                <div className="text-right">
                  <span className="text-sm font-medium text-muted-foreground">
                    Total:{" "}
                  </span>
                  <span className="text-lg font-bold ml-2">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Notas adicionales..."
                rows={2}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !clientId ||
                items.some((i) => !i.description || !i.price)
              }
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? 'Guardar Cambios' : 'Crear Credito'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
