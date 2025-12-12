import type { ServiceTypeInfo, ValuatorInfo, OrderDisplayStatus, ServiceType } from "@/types";

// Service type enum values (matching Prisma enum)
export const SERVICE_TYPE_VALUES = {
  TYPE_1: "TYPE_1",
  TYPE_2: "TYPE_2",
  TYPE_3: "TYPE_3",
  TYPE_4: "TYPE_4",
} as const;

// Service types with names and prices
// Keys are the Prisma enum values
export const SERVICE_TYPES: Record<string, ServiceTypeInfo> = {
  TYPE_1: {
    id: "TYPE_1",
    name: "Automatic Valuation",
    nameLt: "Automatinis vertinimas",
    price: 8,
  },
  TYPE_2: {
    id: "TYPE_2",
    name: "Valuator Assessment",
    nameLt: "Vertintojo nustatymas",
    price: 30,
  },
  TYPE_3: {
    id: "TYPE_3",
    name: "Price Adjustment (Inspection)",
    nameLt: "Kainos patikslinimas (Apžiūra)",
    price: 0, // Variable pricing
  },
  TYPE_4: {
    id: "TYPE_4",
    name: "Property Valuation (Bank)",
    nameLt: "Turto vertinimas (Bankui)",
    price: 0, // Variable pricing
  },
};

// Get service info by type
export function getServiceInfo(serviceType: ServiceType | null): ServiceTypeInfo {
  if (!serviceType) {
    return {
      id: "unknown",
      name: "Unknown Service",
      nameLt: "Nežinoma paslauga",
      price: 0,
    };
  }
  return SERVICE_TYPES[serviceType] || SERVICE_TYPES.TYPE_1;
}

// Valuator mapping (priskirta code → contact info)
export const VALUATOR_MAP: Record<string, ValuatorInfo> = {
  KODAS1: {
    name: "Jonas Jonaitis",
    phone: "+370 600 00001",
    email: "jonas@1p.lt",
  },
  KODAS2: {
    name: "Petras Petraitis",
    phone: "+370 600 00002",
    email: "petras@1p.lt",
  },
  KODAS3: {
    name: "Antanas Antanaitis",
    phone: "+370 600 00003",
    email: "antanas@1p.lt",
  },
};

// Default valuator info when code is unknown
export const DEFAULT_VALUATOR: ValuatorInfo = {
  name: "1Partner Vertintojai",
  phone: "+370 600 00000",
  email: "info@1partner.lt",
};

// Get valuator info by code
export function getValuatorInfo(priskirtaCode: string | null): ValuatorInfo {
  if (!priskirtaCode) return DEFAULT_VALUATOR;
  return VALUATOR_MAP[priskirtaCode] || DEFAULT_VALUATOR;
}

// PDF download base URL
export const PDF_BASE_URL = "https://www.vertintojas.pro/d_pdf.php?f=";

// Generate PDF download URL
export function getPdfDownloadUrl(rcFilename: string | null): string | null {
  if (!rcFilename) return null;
  return `${PDF_BASE_URL}${encodeURIComponent(rcFilename)}`;
}

// Determine display status for an order
export function getOrderDisplayStatus(
  serviceType: ServiceType | null,
  isEnoughDataForAi: boolean | null,
  status: string | null
): OrderDisplayStatus {
  // Service type 1 (automatic) with enough data = completed
  if (serviceType === SERVICE_TYPE_VALUES.TYPE_1 && isEnoughDataForAi === true) {
    return "completed";
  }

  // Status is 'paid' or 'done' = paid/in progress
  if (status === "paid" || status === "done") {
    return "paid";
  }

  // Default = pending payment
  return "pending";
}

// Check if order can be downloaded
export function canDownloadOrder(
  rcFilename: string | null,
  displayStatus: OrderDisplayStatus
): boolean {
  return !!rcFilename && displayStatus === "completed";
}

// Status display labels (Lithuanian)
export const STATUS_LABELS: Record<OrderDisplayStatus, string> = {
  completed: "Atlikta",
  paid: "Apmokėta / Vykdoma",
  pending: "Laukiama apmokėjimo",
};

// Status badge colors
export const STATUS_COLORS: Record<OrderDisplayStatus, string> = {
  completed: "bg-green-100 text-green-800",
  paid: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
};

// Get display status from order object (alias for getOrderDisplayStatus)
export function getDisplayStatus(order: {
  service_type: ServiceType | null;
  is_enough_data_for_ai: boolean | null;
  status: string | null;
}): OrderDisplayStatus {
  return getOrderDisplayStatus(order.service_type, order.is_enough_data_for_ai, order.status);
}

// Get badge variant for status (for shadcn Badge component)
export function getStatusBadgeVariant(
  status: OrderDisplayStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "completed":
      return "default"; // Green-ish in default theme
    case "paid":
      return "secondary"; // Blue-ish
    case "pending":
      return "outline"; // Yellow/neutral
    default:
      return "outline";
  }
}
