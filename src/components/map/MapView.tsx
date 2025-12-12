"use client";

import { useState, useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon, LatLngExpression } from "leaflet";
import { Maximize2, Minimize2, ZoomIn, ZoomOut, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DEFAULT_CENTER, DEFAULT_ZOOM, isValidCoordinates } from "@/lib/coordinates";
import type { Coordinates } from "@/types";
import "leaflet/dist/leaflet.css";

// Fix for default marker icon in Next.js/Webpack
const defaultIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface MapViewProps {
  coordinates: Coordinates;
  address?: {
    municipality?: string | null;
    city?: string | null;
    street?: string | null;
    houseNumber?: string | null;
  };
  className?: string;
}

// Zoom controls component
function ZoomControls() {
  const map = useMap();

  const handleZoomIn = useCallback(() => {
    map.zoomIn();
  }, [map]);

  const handleZoomOut = useCallback(() => {
    map.zoomOut();
  }, [map]);

  return (
    <div className="absolute top-2 right-2 z-[1000] flex flex-col gap-1">
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8 bg-white shadow-md hover:bg-gray-100"
        onClick={handleZoomIn}
        title="Priartinti"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="h-8 w-8 bg-white shadow-md hover:bg-gray-100"
        onClick={handleZoomOut}
        title="Atitolinti"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Map component that handles fullscreen
function MapContent({
  coordinates,
  address,
  isFullscreen,
  onToggleFullscreen,
}: {
  coordinates: Coordinates;
  address?: MapViewProps["address"];
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
}) {
  const validCoords = isValidCoordinates(coordinates);
  const center: LatLngExpression = validCoords ? coordinates : DEFAULT_CENTER;
  const zoom = validCoords ? DEFAULT_ZOOM : 6;

  // Build address string for popup
  const addressParts = [
    address?.street,
    address?.houseNumber,
    address?.city,
    address?.municipality,
  ].filter(Boolean);
  const addressString = addressParts.join(", ") || "Adresas";

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full rounded-lg"
        style={{ zIndex: 1 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {validCoords && (
          <Marker position={coordinates} icon={defaultIcon}>
            <Popup>
              <div className="font-medium text-sm">
                <MapPin className="h-4 w-4 inline mr-1 text-blue-600" />
                {addressString}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {coordinates[0].toFixed(6)}, {coordinates[1].toFixed(6)}
              </div>
            </Popup>
          </Marker>
        )}
        <ZoomControls />
      </MapContainer>

      {/* Fullscreen toggle button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute bottom-2 right-2 z-[1000] h-8 w-8 bg-white shadow-md hover:bg-gray-100"
        onClick={onToggleFullscreen}
        title={isFullscreen ? "Išeiti iš pilno ekrano" : "Pilnas ekranas"}
      >
        {isFullscreen ? (
          <Minimize2 className="h-4 w-4" />
        ) : (
          <Maximize2 className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}

export default function MapView({ coordinates, address, className = "" }: MapViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((prev) => !prev);
  }, []);

  // Handle escape key to exit fullscreen
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Escape" && isFullscreen) {
      setIsFullscreen(false);
    }
  }, [isFullscreen]);

  // Check if coordinates are valid
  const hasValidCoordinates = isValidCoordinates(coordinates);

  // If no valid coordinates, show placeholder
  if (!hasValidCoordinates) {
    return (
      <div
        className={`flex items-center justify-center bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 ${className}`}
        style={{ minHeight: "200px" }}
      >
        <div className="text-center text-gray-500">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm font-medium">Koordinatės nenurodytos</p>
          <p className="text-xs mt-1">Žemėlapis neprieinamas</p>
        </div>
      </div>
    );
  }

  // Fullscreen overlay
  if (isFullscreen) {
    return (
      <div
        className="fixed inset-0 z-50 bg-black/90"
        onKeyDown={handleKeyDown}
        tabIndex={0}
      >
        <MapContent
          coordinates={coordinates}
          address={address}
          isFullscreen={isFullscreen}
          onToggleFullscreen={toggleFullscreen}
        />
      </div>
    );
  }

  // Normal view
  return (
    <div
      className={`relative h-[200px] md:h-[300px] rounded-lg overflow-hidden shadow-sm border ${className}`}
    >
      <MapContent
        coordinates={coordinates}
        address={address}
        isFullscreen={isFullscreen}
        onToggleFullscreen={toggleFullscreen}
      />
    </div>
  );
}
