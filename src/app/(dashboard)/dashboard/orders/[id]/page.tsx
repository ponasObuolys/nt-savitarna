"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Receipt, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { getOrderStatusDisplay, getServiceTypeDisplay, formatDate } from "@/lib/translations";
import type { Order } from "@/types";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setOrder(data.data);
        } else {
          setError(data.error || "Klaida gaunant užsakymą");
          if (response.status === 403 || response.status === 404) {
            toast.error(data.error);
            router.push("/dashboard/orders");
          }
        }
      } catch {
        setError("Tinklo klaida");
        toast.error("Tinklo klaida. Bandykite vėliau.");
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchOrder();
    }
  }, [params.id, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-4">
        <Link href="/dashboard/orders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Grįžti į užsakymus
          </Button>
        </Link>
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            {error || "Užsakymas nerastas"}
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusDisplay = getOrderStatusDisplay(
    order.status,
    order.service_type,
    order.is_enough_data_for_ai
  );
  const serviceInfo = getServiceTypeDisplay(order.service_type);

  const handleDownloadPdf = () => {
    if (order.rc_filename) {
      window.open(
        `https://www.vertintojas.pro/d_pdf.php?f=${order.rc_filename}`,
        "_blank"
      );
    }
  };

  const handleDownloadInvoice = () => {
    if (order.rc_saskaita) {
      window.open(
        `https://www.vertintojas.pro/d_pdf.php?f=${order.rc_saskaita}`,
        "_blank"
      );
    }
  };

  // Build address string
  const addressParts = [
    order.address_street,
    order.address_house_number,
    order.address_city,
    order.address_municipality,
  ].filter(Boolean);
  const addressString = addressParts.join(", ") || "Adresas nenurodytas";

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link href="/dashboard/orders">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Grįžti į užsakymus
        </Button>
      </Link>

      {/* Header card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-xl">
                  Užsakymas #{order.id}
                </CardTitle>
                <Badge variant={
                  statusDisplay.variant === "success" ? "default" :
                  statusDisplay.variant === "warning" ? "secondary" :
                  statusDisplay.variant === "destructive" ? "destructive" :
                  "outline"
                } className={
                  statusDisplay.variant === "success" ? "bg-green-100 text-green-800" :
                  statusDisplay.variant === "warning" ? "bg-yellow-100 text-yellow-800" :
                  ""
                }>
                  {statusDisplay.label}
                </Badge>
              </div>
              <p className="text-muted-foreground">{addressString}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {serviceInfo.name} | Sukurta: {formatDate(order.created_at)}
              </p>
            </div>

            {/* Download buttons */}
            <div className="flex flex-wrap gap-2">
              {order.rc_filename && (
                <Button onClick={handleDownloadPdf} variant="default">
                  <FileText className="h-4 w-4 mr-2" />
                  Atsisiųsti ataskaitą
                </Button>
              )}
              {order.rc_saskaita && (
                <Button onClick={handleDownloadInvoice} variant="outline">
                  <Receipt className="h-4 w-4 mr-2" />
                  Atsisiųsti sąskaitą
                </Button>
              )}
              {!order.rc_filename && !order.rc_saskaita && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Download className="h-4 w-4 mr-2" />
                  Dokumentų dar nėra
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        {/* Price display */}
        {(order.price_from || order.price_to) && (
          <CardContent className="pt-0">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-1">Įvertinta kaina</p>
              <p className="text-2xl font-bold text-primary">
                {order.price_from && order.price_to ? (
                  <>
                    {order.price_from.toLocaleString("lt-LT")} € - {order.price_to.toLocaleString("lt-LT")} €
                  </>
                ) : order.price_from ? (
                  <>nuo {order.price_from.toLocaleString("lt-LT")} €</>
                ) : order.price_to ? (
                  <>iki {order.price_to.toLocaleString("lt-LT")} €</>
                ) : null}
              </p>
              {order.items_count && order.items_count > 0 && (
                <p className="text-sm text-muted-foreground mt-1">
                  Remiantis {order.items_count} sandoriais
                </p>
              )}
            </div>
          </CardContent>
        )}
      </Card>

      {/* Order details */}
      <OrderDetails order={order} />
    </div>
  );
}
