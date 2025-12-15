import type { Coordinates } from "@/types";

/**
 * Parse MySQL POINT binary data to [lat, lng] coordinates.
 * MySQL POINT format (WKB):
 * - First 4 bytes: SRID (usually 0 for basic storage)
 * - Byte 5: Byte order (01 = little-endian)
 * - Bytes 6-9: WKB type (01 00 00 00 = Point)
 * - Bytes 10-17: X coordinate (longitude) as double LE
 * - Bytes 18-25: Y coordinate (latitude) as double LE
 *
 * Note: MySQL stores as (X, Y) = (longitude, latitude)
 * We return as [lat, lng] for Leaflet compatibility
 */
export function parseCoordinates(point: unknown): Coordinates {
  // Handle null/undefined
  if (!point) return null;

  // If it's already an array of two numbers, return as-is
  if (Array.isArray(point) && point.length === 2) {
    const [first, second] = point;
    if (typeof first === "number" && typeof second === "number") {
      return [first, second];
    }
  }

  // If it's an object with lat/lng properties
  if (typeof point === "object" && point !== null) {
    const obj = point as Record<string, unknown>;
    if ("lat" in obj && "lng" in obj) {
      const lat = obj.lat;
      const lng = obj.lng;
      if (typeof lat === "number" && typeof lng === "number") {
        return [lat, lng];
      }
    }
    if ("latitude" in obj && "longitude" in obj) {
      const lat = obj.latitude;
      const lng = obj.longitude;
      if (typeof lat === "number" && typeof lng === "number") {
        return [lat, lng];
      }
    }
  }

  // If it's a Buffer or Uint8Array (MySQL POINT binary)
  if (Buffer.isBuffer(point) || point instanceof Uint8Array) {
    return parsePointBuffer(point);
  }

  // If it's a JSON-serialized Buffer object (from API response)
  if (typeof point === "object" && point !== null) {
    const obj = point as Record<string, unknown>;
    if (obj.type === "Buffer" && Array.isArray(obj.data)) {
      const buffer = Buffer.from(obj.data as number[]);
      return parsePointBuffer(buffer);
    }

    // Handle object with numeric keys (serialized Buffer without type field)
    // e.g., {0: 0, 1: 0, 2: 0, ..., 24: 64}
    if ("0" in obj && typeof obj["0"] === "number") {
      const keys = Object.keys(obj).filter(k => /^\d+$/.test(k)).sort((a, b) => Number(a) - Number(b));
      if (keys.length >= 25) {
        const data = keys.map(k => obj[k] as number);
        const buffer = Buffer.from(data);
        return parsePointBuffer(buffer);
      }
    }
  }

  // If it's a string that looks like binary data, try to convert
  if (typeof point === "string") {
    // Check if it's a hex string
    if (/^[0-9a-fA-F]+$/.test(point)) {
      try {
        const buffer = Buffer.from(point, "hex");
        return parsePointBuffer(buffer);
      } catch {
        return null;
      }
    }
  }

  return null;
}

/**
 * Parse binary buffer containing MySQL POINT data
 */
function parsePointBuffer(buffer: Buffer | Uint8Array): Coordinates {
  // Minimum length for WKB Point: 25 bytes (4 SRID + 1 byte order + 4 type + 8 X + 8 Y)
  if (buffer.length < 25) {
    return null;
  }

  try {
    // Convert Uint8Array to Buffer if needed
    const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);

    // Skip SRID (4 bytes) and byte order (1 byte) and WKB type (4 bytes)
    // Start reading coordinates from byte 9
    let lng = buf.readDoubleLE(9); // X coordinate (longitude)
    let lat = buf.readDoubleLE(17); // Y coordinate (latitude)

    // Heuristic: Detect and fix swapped coordinates for Lithuania
    // Lithuania bounds: lat 53.89-56.45, lng 20.95-26.84
    // If lng > 50 and lat < 30, coordinates are likely swapped
    if (lng > 50 && lat < 30) {
      [lat, lng] = [lng, lat]; // Swap them
    }

    // Validate coordinates are in reasonable range
    if (!isValidLatitude(lat) || !isValidLongitude(lng)) {
      return null;
    }

    return [lat, lng];
  } catch {
    return null;
  }
}

/**
 * Check if latitude is valid (-90 to 90)
 */
export function isValidLatitude(lat: number): boolean {
  return typeof lat === "number" && !isNaN(lat) && lat >= -90 && lat <= 90;
}

/**
 * Check if longitude is valid (-180 to 180)
 */
export function isValidLongitude(lng: number): boolean {
  return typeof lng === "number" && !isNaN(lng) && lng >= -180 && lng <= 180;
}

/**
 * Check if coordinates are valid
 * Note: Rejects (0, 0) as it's "Null Island" - indicates missing coordinates
 */
export function isValidCoordinates(coords: Coordinates): coords is [number, number] {
  if (!coords || !Array.isArray(coords) || coords.length !== 2) {
    return false;
  }
  const [lat, lng] = coords;
  
  // Reject "Null Island" (0, 0) - this means coordinates were not set
  if (lat === 0 && lng === 0) {
    return false;
  }
  
  return isValidLatitude(lat) && isValidLongitude(lng);
}

/**
 * Format coordinates for display
 */
export function formatCoordinates(coords: Coordinates): string {
  if (!isValidCoordinates(coords)) {
    return "—";
  }
  const [lat, lng] = coords;
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

/**
 * Default center for Lithuania (Vilnius)
 */
export const DEFAULT_CENTER: [number, number] = [54.6872, 25.2797];

/**
 * Default zoom level for property viewing
 */
export const DEFAULT_ZOOM = 15;

/**
 * Lithuania bounding box for map constraints
 */
export const LITHUANIA_BOUNDS = {
  north: 56.45,
  south: 53.89,
  west: 20.95,
  east: 26.84,
};
