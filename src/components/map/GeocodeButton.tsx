"use client";

import { useState } from "react";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface GeocodeButtonProps {
  orderId: number;
  onSuccess?: (coords: { lat: number; lng: number }) => void;
}

export function GeocodeButton({ orderId, onSuccess }: GeocodeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGeocode = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/admin/orders/${orderId}/geocode`, {
        method: "POST",
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Koordinatės sėkmingai nustatytos");
        if (onSuccess) {
          onSuccess({ lat: data.data.lat, lng: data.data.lng });
        }
        // Reload page to show updated map
        window.location.reload();
      } else {
        toast.error(data.error || "Nepavyko nustatyti koordinačių");
      }
    } catch (error) {
      console.error("Geocode error:", error);
      toast.error("Klaida nustatant koordinates");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleGeocode}
      disabled={isLoading}
      className="mt-2"
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Ieškoma...
        </>
      ) : (
        <>
          <RefreshCw className="h-4 w-4 mr-2" />
          Nustatyti koordinates
        </>
      )}
    </Button>
  );
}
