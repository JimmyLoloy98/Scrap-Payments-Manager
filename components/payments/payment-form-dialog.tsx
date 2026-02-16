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
import { Loader2, Plus, Trash2, CalendarIcon, Pencil } from "lucide-react";
import type { ScrapPayment, ScrapItem } from "@/lib/types";
import { useScraps } from "@/contexts/scraps-context";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn, formatCurrency } from "@/lib/utils";

interface PaymentFormDialogProps {
  onSubmit: (data: Partial<ScrapPayment>) => Promise<void>;
  trigger?: React.ReactNode;
  payment?: ScrapPayment;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  pendingDebt?: number;
}

export function PaymentFormDialog({
  onSubmit,
  payment,
  trigger,
  open: controlledOpen,
  onOpenChange,
  className,
  pendingDebt,
}: PaymentFormDialogProps) {
  const { scraps } = useScraps();
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

  const [formData, setFormData] = useState({
    date: new Date(),
    notes: "",
  });

  const [items, setItems] = useState<Partial<ScrapItem>[]>([
    { scrapId: "", amount: 0 },
  ]);

  const isEditing = !!payment;

  React.useEffect(() => {
    if (open) {
      if (payment) {
        setFormData({
          date: payment.date ? new Date(payment.date) : new Date(),
          notes: payment.notes || "",
        });
        setItems(
          payment.items && payment.items.length > 0
            ? payment.items
            : [{ scrapId: "", amount: 0 }]
        );
      } else {
        setFormData({
            date: new Date(),
            notes: "",
        });
        setItems([{ scrapId: "", amount: 0 }]);
      }
    }
  }, [payment, open]);

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + (item.amount || 0), 0);
  };

  const handleAddItem = () => {
    setItems([...items, { scrapId: "", amount: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const handleItemChange = (
    index: number,
    field: keyof ScrapItem,
    value: string | number,
  ) => {
    const newItems = [...items];
    if (field === "amount") {
      newItems[index] = {
        ...newItems[index],
        [field]: typeof value === "string" ? parseFloat(value) || 0 : value,
      };
    } else if (field === "scrapId") {
      const selectedScrap = scraps.find((s) => s.id === value);
      newItems[index] = {
        ...newItems[index],
        scrapId: String(value),
        scrapName: selectedScrap?.name || "",
      };
    } else {
      // @ts-ignore
      newItems[index] = { ...newItems[index], [field]: value };
    }
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const validItems = items.filter(
        (i) => i.scrapId && i.amount && i.amount > 0,
      ) as ScrapItem[];

      await onSubmit({
        date: formData.date,
        items: validItems,
        totalValue: calculateTotal(),
        notes: formData.notes,
      });

      setOpen(false);
      setFormData({
        date: new Date(),
        notes: "",
      });
      setItems([{ scrapId: "", amount: 0 }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className={className}>
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Pago
          </Button>
        )}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
      >
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Pago' : 'Registrar Pago con Chatarra'}</DialogTitle>
          <DialogDescription>
            {pendingDebt !== undefined && (
              <span className="text-sm mt-2">
                <span className="mr-3">Deuda Pendiente:</span>
                <span className={cn(
                  "text-base font-bold",
                  pendingDebt > 0 ? "text-destructive" : "text-primary"
                )}>
                  {formatCurrency(pendingDebt)}
                </span>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Fecha</Label>
              <Popover modal={true}>
                <PopoverTrigger asChild>

                  <Button
                    type="button"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.date && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.date ? (
                      format(formData.date, "dd/MM/yyyy")
                    ) : (
                      <span>Seleccionar fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.date}
                    onSelect={(d: Date | undefined) =>
                      d && setFormData({ ...formData, date: d })
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-4 border rounded-md p-4 bg-muted/20">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-sm">Detalle de chatarras</h4>
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
                        Tipo de Chatarra
                      </Label>
                    )}
                    <Select
                      value={String(item.scrapId || "")}
                      onValueChange={(value) =>
                        handleItemChange(index, "scrapId", value)
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        {scraps.map((scrap) => (
                          <SelectItem key={scrap.id} value={String(scrap.id)}>
                            {scrap.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
                      value={item.amount || ""}
                      onChange={(e) =>
                        handleItemChange(index, "amount", e.target.value)
                      }
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
                  <span className="text-lg font-bold ml-2 text-primary">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notas</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
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
              disabled={isLoading || calculateTotal() === 0}
            >
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? 'Guardar Cambios' : 'Registrar Pago'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
