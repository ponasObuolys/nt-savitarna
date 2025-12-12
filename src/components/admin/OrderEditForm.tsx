"use client";

import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Order, Valuator } from "@/types";

interface OrderEditFormProps {
  order: Order;
  onUpdate: (updatedOrder: Order) => void;
}

const STATUS_OPTIONS = [
  { value: "pending", label: "Laukiama apmokėjimo" },
  { value: "paid", label: "Apmokėta" },
  { value: "done", label: "Atlikta" },
  { value: "failed", label: "Nepavyko" },
];

export function OrderEditForm({ order, onUpdate }: OrderEditFormProps) {
  const [status, setStatus] = useState<string>(order.status || "pending");
  const [priskirta, setPriskirta] = useState<string>(order.priskirta || "");
  const [rcFilename, setRcFilename] = useState<string>(order.rc_filename || "");
  const [rcSaskaita, setRcSaskaita] = useState<string>(order.rc_saskaita || "");
  const [valuators, setValuators] = useState<Valuator[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch valuators
  useEffect(() => {
    const fetchValuators = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/valuators");
        const data = await response.json();
        if (data.success) {
          setValuators(data.data.valuators);
        }
      } catch (error) {
        console.error("Error fetching valuators:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchValuators();
  }, []);

  const handleSave = async () => {
    // Validate PDF filenames
    if (rcFilename && !rcFilename.endsWith(".pdf")) {
      toast.error("Ataskaitos failas turi būti PDF formatu (.pdf)");
      return;
    }
    if (rcSaskaita && !rcSaskaita.endsWith(".pdf")) {
      toast.error("Sąskaitos failas turi būti PDF formatu (.pdf)");
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: status || null,
          priskirta: priskirta || null,
          rc_filename: rcFilename || null,
          rc_saskaita: rcSaskaita || null,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Užsakymas sėkmingai atnaujintas");
        onUpdate(data.data);
      } else {
        toast.error(data.error || "Klaida atnaujinant užsakymą");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("Tinklo klaida. Bandykite vėliau.");
    } finally {
      setIsSaving(false);
    }
  };

  const hasChanges =
    status !== (order.status || "pending") ||
    priskirta !== (order.priskirta || "") ||
    rcFilename !== (order.rc_filename || "") ||
    rcSaskaita !== (order.rc_saskaita || "");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Redaguoti užsakymą</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div className="space-y-2">
          <Label htmlFor="status">Statusas</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger id="status">
              <SelectValue placeholder="Pasirinkite statusą" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Valuator */}
        <div className="space-y-2">
          <Label htmlFor="valuator">Vertintojas</Label>
          <Select
            value={priskirta || "none"}
            onValueChange={(value) => setPriskirta(value === "none" ? "" : value)}
            disabled={isLoading}
          >
            <SelectTrigger id="valuator">
              <SelectValue placeholder="Pasirinkite vertintoją" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Nepriskirtas</SelectItem>
              {valuators.map((valuator) => (
                <SelectItem key={valuator.code} value={valuator.code}>
                  {valuator.first_name} {valuator.last_name} ({valuator.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {order.priskirta_date ? (
            <p className="text-xs text-muted-foreground">
              Priskirta: {new Date(order.priskirta_date as string | number | Date).toLocaleString("lt-LT")}
            </p>
          ) : null}
        </div>

        {/* Report filename */}
        <div className="space-y-2">
          <Label htmlFor="rc_filename">Ataskaitos failas (PDF)</Label>
          <Input
            id="rc_filename"
            type="text"
            value={rcFilename}
            onChange={(e) => setRcFilename(e.target.value)}
            placeholder="pvz.: ataskaita_123.pdf"
          />
          <p className="text-xs text-muted-foreground">
            Failo pavadinimas turi baigtis .pdf
          </p>
        </div>

        {/* Invoice filename */}
        <div className="space-y-2">
          <Label htmlFor="rc_saskaita">Sąskaitos failas (PDF)</Label>
          <Input
            id="rc_saskaita"
            type="text"
            value={rcSaskaita}
            onChange={(e) => setRcSaskaita(e.target.value)}
            placeholder="pvz.: saskaita_123.pdf"
          />
          <p className="text-xs text-muted-foreground">
            Failo pavadinimas turi baigtis .pdf
          </p>
        </div>

        {/* Admin-only info display */}
        <div className="pt-4 border-t space-y-2">
          <h4 className="font-medium text-sm text-muted-foreground">
            Papildoma informacija (tik peržiūra)
          </h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">AI duomenų pakanka:</span>
              <span className="ml-2 font-medium">
                {order.is_enough_data_for_ai ? "Taip" : "Ne"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">Nuomonė:</span>
              <span className="ml-2 font-medium">
                {(order.opinion as string) || "—"}
              </span>
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="pt-4">
          <Button
            onClick={handleSave}
            disabled={isSaving || !hasChanges}
            className="w-full"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saugoma...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Išsaugoti pakeitimus
              </>
            )}
          </Button>
          {!hasChanges && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              Nėra pakeitimų išsaugoti
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
