// Grafikų spalvų konstantos
// Naudojama su Recharts biblioteka

export const CHART_COLORS = {
  // Pagrindinės spalvos
  primary: "#2563eb",      // Blue 600
  secondary: "#7c3aed",    // Violet 600
  success: "#16a34a",      // Green 600
  warning: "#ea580c",      // Orange 600
  danger: "#dc2626",       // Red 600
  info: "#0891b2",         // Cyan 600

  // Neutralios spalvos
  gray: "#6b7280",         // Gray 500
  lightGray: "#d1d5db",    // Gray 300
  darkGray: "#374151",     // Gray 700

  // Grafikų paletė (8 spalvos)
  palette: [
    "#2563eb",  // Blue
    "#16a34a",  // Green
    "#ea580c",  // Orange
    "#7c3aed",  // Violet
    "#0891b2",  // Cyan
    "#dc2626",  // Red
    "#ca8a04",  // Yellow
    "#db2777",  // Pink
  ],

  // Statusų spalvos
  status: {
    pending: "#f59e0b",    // Amber 500 - Laukiama
    paid: "#3b82f6",       // Blue 500 - Apmokėta
    done: "#22c55e",       // Green 500 - Atlikta
    failed: "#ef4444",     // Red 500 - Nepavyko
  },

  // Paslaugų tipų spalvos
  serviceType: {
    TYPE_1: "#2563eb",     // Blue - Automatinis vertinimas
    TYPE_2: "#7c3aed",     // Violet - Vertintojo nustatymas
    TYPE_3: "#ea580c",     // Orange - Kainos patikslinimas
    TYPE_4: "#16a34a",     // Green - Turto vertinimas
  },

  // Turto tipų spalvos
  propertyType: {
    namas: "#2563eb",      // Blue - Namas
    butas: "#16a34a",      // Green - Butas
    sklypas: "#ea580c",    // Orange - Sklypas
    patalpos: "#7c3aed",   // Violet - Patalpos
  },
} as const;

// Spalvų pagalbinės funkcijos
export function getChartColor(index: number): string {
  return CHART_COLORS.palette[index % CHART_COLORS.palette.length];
}

export function getStatusColor(status: string): string {
  const statusKey = status.toLowerCase() as keyof typeof CHART_COLORS.status;
  return CHART_COLORS.status[statusKey] || CHART_COLORS.gray;
}

export function getServiceTypeColor(type: string): string {
  const typeKey = type as keyof typeof CHART_COLORS.serviceType;
  return CHART_COLORS.serviceType[typeKey] || CHART_COLORS.gray;
}

export function getPropertyTypeColor(type: string): string {
  const typeKey = type.toLowerCase() as keyof typeof CHART_COLORS.propertyType;
  return CHART_COLORS.propertyType[typeKey] || CHART_COLORS.gray;
}

// Gradient spalvos area chart'ams
export const CHART_GRADIENTS = {
  blue: {
    start: "rgba(37, 99, 235, 0.3)",
    end: "rgba(37, 99, 235, 0.05)",
  },
  green: {
    start: "rgba(22, 163, 74, 0.3)",
    end: "rgba(22, 163, 74, 0.05)",
  },
  violet: {
    start: "rgba(124, 58, 237, 0.3)",
    end: "rgba(124, 58, 237, 0.05)",
  },
  orange: {
    start: "rgba(234, 88, 12, 0.3)",
    end: "rgba(234, 88, 12, 0.05)",
  },
} as const;
