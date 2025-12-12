"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Receipt, Loader2, User, Calendar, Hash, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { OrderDetails } from "@/components/orders/OrderDetails";
import { OrderEditForm } from "@/components/admin/OrderEditForm";
import { PropertyMap } from "@/components/map";
import { getOrderStatusDisplay, getServiceTypeDisplay, formatDate } from "@/lib/translations";
import { parseCoordinates } from "@/lib/coordinates";
import type { Order } from "@/types";

export default function AdminOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/admin/orders/${params.id}`);
        const data = await response.json();

        if (data.success) {
          setOrder(data.data);
        } else {
          setError(data.error || "Klaida gaunant užsakymą");
          if (response.status === 401 || response.status === 403) {
            toast.error(data.error);
            router.push("/admin/orders");
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

  const handleOrderUpdate = (updatedOrder: Order) => {
    setOrder(updatedOrder);
  };

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
        <Link href="/admin/orders">
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
      <Link href="/admin/orders">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Grįžti į užsakymus
        </Button>
      </Link>

      {/* Header card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="flex-1">
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

              {/* Admin-specific info */}
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Hash className="h-4 w-4" />
                  <span>Token: <code className="bg-muted px-1 rounded">{order.token || "—"}</code></span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Klientas: {order.contact_email || "—"}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Vertintojas: {order.priskirta || "Nepriskirtas"}</span>
                </div>
              </div>
            </div>

            {/* Download buttons */}
            <div className="flex flex-wrap gap-2">
              {order.rc_filename && (
                <Button onClick={handleDownloadPdf} variant="default" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Ataskaita
                </Button>
              )}
              {order.rc_saskaita && (
                <Button onClick={handleDownloadInvoice} variant="outline" size="sm">
                  <Receipt className="h-4 w-4 mr-2" />
                  Sąskaita
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

      {/* Main content grid: Edit form + Order details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Edit form - sidebar on large screens */}
        <div className="lg:col-span-1 order-first lg:order-last">
          <OrderEditForm order={order} onUpdate={handleOrderUpdate} />
        </div>

        {/* Order details - main content */}
        <div className="lg:col-span-2">
          <OrderDetails order={order} />
        </div>
      </div>

      {/* Map section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5" />
            Turto lokacija
          </CardTitle>
        </CardHeader>
        <CardContent>
          <PropertyMap
            coordinates={parseCoordinates(order.address_coordinates)}
            address={{
              municipality: order.address_municipality,
              city: order.address_city,
              street: order.address_street,
              houseNumber: order.address_house_number,
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
