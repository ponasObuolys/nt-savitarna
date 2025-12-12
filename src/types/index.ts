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
  items_count?: number | null;
  rc_filename: string | null;
  rc_saskaita?: string | null;
  priskirta: string | null;
  created_at: Date | null;
  // Additional fields for order details
  address_location_details?: string | null;
  main_property_purpose?: string | null;
  main_other_property_purpose?: string | null;
  main_energy_class?: string | null;
  main_other_energy_class?: string | null;
  main_relation_to_property?: string | null;
  main_other_relation_to_property?: string | null;
  main_valuation_purpose?: string | null;
  main_retrospective_year?: number | null;
  main_is_property_being_sold?: string | null;
  main_seller?: string | null;
  main_want_consultation?: boolean | null;
  details_indoor_area?: number | null;
  details_land_area?: number | null;
  details_land_area_type?: string | null;
  details_year_built?: number | null;
  details_bathrooms?: number | null;
  details_in_floor?: number | null;
  details_total_floors?: number | null;
  details_multiple_floors?: boolean | null;
  details_rooms?: number | null;
  details_renovation?: boolean | null;
  details_renovation_year?: number | null;
  details_property_state?: string | null;
  details_property_completion_percentage?: number | null;
  details_house_construction?: string | null;
  details_other_house_construction?: string | null;
  details_insulated_house?: boolean | null;
  features_parking?: string | null;
  features_storage_room?: boolean | null;
  features_terrace?: boolean | null;
  features_balcony?: boolean | null;
  features_garden?: boolean | null;
  features_shared_premises?: boolean | null;
  features_basement?: boolean | null;
  features_barn?: boolean | null;
  features_garage?: boolean | null;
  features_solar_power?: boolean | null;
  features_city_supply_communications?: boolean | null;
  features_borehole_communications?: boolean | null;
  features_sewage_treatment_communications?: boolean | null;
  features_gas_access_communications?: boolean | null;
  features_electricity_communications?: boolean | null;
  features_plumbing_communications?: boolean | null;
  features_other_communications?: string | null;
  features_project_plan?: string | null;
  features_other_project_plan?: string | null;
  features_empty_land?: boolean | null;
  features_boundary_with_water?: boolean | null;
  features_unregistered_buildings?: boolean | null;
  features_forest_in_land?: boolean | null;
  features_other_additional_features?: string | null;
  // Allow additional fields from Prisma without explicit definition
  [key: string]: unknown;
}

// Simplified User interface for client-side use
export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  company: string | null;
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

// Valuator info mapping (legacy - hardcoded)
export interface ValuatorInfo {
  name: string;
  phone: string;
  email: string;
}

// Valuator from database
export interface Valuator {
  id: number;
  code: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: Date | null;
}

// Service type info
export interface ServiceTypeInfo {
  id: string;
  name: string;
  nameLt: string;
  price: number;
}
