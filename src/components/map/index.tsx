"use client";

import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import type { Coordinates } from "@/types";

// Dynamic import with SSR disabled - Leaflet requires browser APIs
const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center bg-gray-100 rounded-lg animate-pulse h-[200px] md:h-[300px]">
      <div className="text-center text-gray-400">
        <MapPin className="h-8 w-8 mx-auto mb-2" />
        <p className="text-sm">Kraunamas žemėlapis...</p>
      </div>
    </div>
  ),
});

export interface PropertyMapProps {
  coordinates: Coordinates;
  address?: {
    municipality?: string | null;
    city?: string | null;
    street?: string | null;
    houseNumber?: string | null;
  };
  className?: string;
}

export function PropertyMap({ coordinates, address, className }: PropertyMapProps) {
  return (
    <MapView
      coordinates={coordinates}
      address={address}
      className={className}
    />
  );
}

export default PropertyMap;
