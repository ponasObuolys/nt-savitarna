/**
 * Geocoding utilities using OpenStreetMap Nominatim API
 * Free, no API key required, but has rate limits (1 req/sec)
 */

export interface GeocodingResult {
  lat: number;
  lng: number;
  displayName: string;
}

/**
 * Normalize Lithuanian city names for geocoding
 * Removes common suffixes like "m.", "mst.", "sav." that Nominatim doesn't understand
 */
function normalizeCityName(city: string | null | undefined): string | null {
  if (!city) return null;
  
  // Remove common Lithuanian suffixes
  const normalized = city
    .replace(/\s*m\.\s*$/, "") // "Vilniaus m." -> "Vilniaus"
    .replace(/\s*mst\.\s*$/, "") // "Vilniaus mst." -> "Vilniaus"
    .replace(/\s*sav\.\s*$/, "") // "Vilniaus m. sav." -> "Vilniaus m."
    .replace(/\s*m\.\s*sav\.\s*$/, "") // Full cleanup
    .trim();
  
  // Convert genitive to nominative for common cities
  const cityMappings: Record<string, string> = {
    "Vilniaus": "Vilnius",
    "Kauno": "Kaunas",
    "Klaipėdos": "Klaipėda",
    "Šiaulių": "Šiauliai",
    "Panevėžio": "Panevėžys",
    "Alytaus": "Alytus",
    "Marijampolės": "Marijampolė",
    "Utenos": "Utena",
    "Telšių": "Telšiai",
    "Tauragės": "Tauragė",
  };
  
  return cityMappings[normalized] || normalized;
}

/**
 * Geocode an address to coordinates using Nominatim
 * @param address - Address components
 * @returns Coordinates or null if not found
 */
export async function geocodeAddress(address: {
  street?: string | null;
  houseNumber?: string | null;
  city?: string | null;
  municipality?: string | null;
  country?: string;
}): Promise<GeocodingResult | null> {
  try {
    // Normalize city name for better geocoding results
    const normalizedCity = normalizeCityName(address.city);
    
    // Build search query - simpler format works better with Nominatim
    const parts: string[] = [];
    
    // Street without house number first (more reliable)
    if (address.street) {
      parts.push(address.street);
    }
    
    if (normalizedCity) {
      parts.push(normalizedCity);
    }
    
    if (!parts.length) {
      console.warn("Geocoding: Insufficient address data");
      return null;
    }
    
    const query = parts.join(", ");

    // Call Nominatim API
    const url = new URL("https://nominatim.openstreetmap.org/search");
    url.searchParams.set("q", query);
    url.searchParams.set("format", "json");
    url.searchParams.set("limit", "1");
    url.searchParams.set("countrycodes", "lt"); // Limit to Lithuania
    
    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent": "NT-Savitarna/1.0 (property valuation service)",
        "Accept-Language": "lt,en",
      },
    });

    if (!response.ok) {
      console.error(`Geocoding API error: ${response.status}`);
      return null;
    }

    const results = await response.json();
    
    if (!results || results.length === 0) {
      console.warn(`Geocoding: No results for "${query}"`);
      return null;
    }

    const result = results[0];
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);

    if (isNaN(lat) || isNaN(lng)) {
      console.error("Geocoding: Invalid coordinates in response");
      return null;
    }

    return {
      lat,
      lng,
      displayName: result.display_name,
    };
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}

/**
 * Update order coordinates in database
 */
export async function updateOrderCoordinates(
  orderId: number,
  lat: number,
  lng: number
): Promise<boolean> {
  try {
    // This will be called from API route with prisma
    const { prisma } = await import("@/lib/prisma");
    
    // Use raw SQL to update POINT type
    await prisma.$executeRaw`
      UPDATE uzkl_ivertink1P 
      SET address_coordinates = POINT(${lat}, ${lng})
      WHERE id = ${orderId}
    `;
    
    return true;
  } catch (error) {
    console.error(`Failed to update coordinates for order ${orderId}:`, error);
    return false;
  }
}
