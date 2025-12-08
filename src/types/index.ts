// Service type values that match the Prisma enum
export type ServiceType = "TYPE_1" | "TYPE_2" | "TYPE_3" | "TYPE_4";

// User role values that match the database enum
export type UserRole = "client" | "admin";

// Display status for orders
export type OrderDisplayStatus = "completed" | "paid" | "pending";

// Simplified Order interface for client-side use
// Contains only the fields needed for display components
export interface Order {
  id: number;
  token: string | null;
  contact_name: string;
  contact_email: string;
  contact_agree_to_newsletter?: boolean | null;
  address_municipality?: string | null;
  address_city?: string | null;
  address_street?: string | null;
  address_house_number?: string | null;
  main_property?: string | null;
  main_property_type?: string | null;
  service_type: ServiceType | null;
  is_enough_data_for_ai: boolean | null;
  status: string | null;
  price: number | null;
  price_from?: number | null;
  price_to?: number | null;
  rc_filename: string | null;
  priskirta: string | null;
  created_at: Date | null;
  // Allow additional fields from Prisma without explicit definition
  [key: string]: unknown;
}

// Simplified User interface for client-side use
export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date | null;
}

// Order with computed display fields
export interface OrderWithDisplay extends Order {
  displayStatus: OrderDisplayStatus;
  serviceName: string;
  servicePrice: number;
  canDownload: boolean;
}

// User session payload for JWT
export interface JWTPayload {
  userId: number;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// Auth response types
export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: {
    id: number;
    email: string;
    role: UserRole;
  };
}

// API response wrapper
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// Statistics for admin dashboard
export interface DashboardStats {
  totalOrders: number;
  monthlyOrders: number;
  monthlyRevenue: number;
  completedOrders: number;
  pendingOrders: number;
}

// Valuator info mapping
export interface ValuatorInfo {
  name: string;
  phone: string;
  email: string;
}

// Service type info
export interface ServiceTypeInfo {
  id: string;
  name: string;
  nameLt: string;
  price: number;
}
