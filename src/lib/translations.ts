/**
 * Lithuanian translations for database field names and values
 * Based on arr_vals_uzkl.php
 */

// Field labels - database column names to Lithuanian
export const FIELD_LABELS: Record<string, string> = {
  // Identifiers
  id: "ID",
  token: "Kodas",

  // Contact
  contact_name: "Vardas",
  contact_email: "El. paštas",
  contact_agree_to_newsletter: "Sutikimas gauti naujienlaiškį",

  // Address
  address_municipality_id: "Savivaldybės ID",
  address_municipality: "Savivaldybė",
  address_city_id: "Miesto ID",
  address_city: "Miestas",
  address_street_id: "Gatvės ID",
  address_street: "Gatvė",
  address_house_number: "Namo numeris",
  address_coordinates: "Koordinatės",
  address_location_details: "Vietos detalės",

  // Main property info
  main_property: "Turto tipas",
  main_property_type: "Turto porūšis",
  main_property_purpose: "Turto paskirtis",
  main_other_property_purpose: "Kita paskirtis",
  main_energy_class: "Energinė klasė",
  main_other_energy_class: "Kita energinė klasė",
  main_relation_to_property: "Santykis su turtu",
  main_other_relation_to_property: "Kitas santykis su turtu",
  main_valuation_purpose: "Vertinimo paskirtis",
  main_retrospective_year: "Retrospektyviniai metai",
  main_is_property_being_sold: "Ar turtas parduodamas",
  main_seller: "Pardavėjas",
  main_want_consultation: "Nori konsultacijos",

  // Property details
  details_indoor_area: "Vidaus plotas, m²",
  details_land_area: "Sklypo plotas, a",
  details_land_area_type: "Sklypo tipas",
  details_year_built: "Statybos metai",
  details_bathrooms: "Vonios kambariai",
  details_in_floor: "Aukštas",
  details_total_floors: "Iš viso aukštų",
  details_multiple_floors: "Per kelis aukštus",
  details_rooms: "Kambarių skaičius",
  details_renovation: "Renovuotas",
  details_renovation_year: "Renovacijos metai",
  details_property_state: "Būklė",
  details_property_completion_percentage: "Užbaigtumas (%)",
  details_house_construction: "Statybos tipas",
  details_other_house_construction: "Kitas statybos tipas",
  details_insulated_house: "Apšiltintas",
  details_property_photos: "Nuotraukos",
  details_photos_upload: "Įkeltos nuotraukos",
  details_photo_link: "Nuoroda į nuotraukas",

  // Property features
  features_parking: "Parkavimas",
  features_storage_room: "Sandėliukas",
  features_terrace: "Terasa",
  features_balcony: "Balkonas",
  features_garden: "Sodas",
  features_shared_premises: "Bendros patalpos",
  features_basement: "Rūsys",
  features_barn: "Ūkinis pastatas",
  features_garage: "Garažas",
  features_solar_power: "Saulės energija",
  features_city_supply_communications: "Miesto komunikacijos",
  features_borehole_communications: "Gręžinys",
  features_sewage_treatment_communications: "Nuotekų valymas",
  features_gas_access_communications: "Dujotiekis",
  features_electricity_communications: "Elektra",
  features_plumbing_communications: "Vandentiekis",
  features_other_communications: "Kitos komunikacijos",
  features_project_plan: "Projektas",
  features_other_project_plan: "Kitas projektas",
  features_empty_land: "Tuščias sklypas",
  features_boundary_with_water: "Ribojasi su vandeniu",
  features_unregistered_buildings: "Neregistruoti statiniai",
  features_forest_in_land: "Miškas sklype",
  features_other_additional_features: "Kiti ypatumai",

  // Status and results
  opinion: "Nuomonė",
  created_at: "Sukurta",
  price: "Kaina",
  price_from: "Kaina nuo",
  price_to: "Kaina iki",
  items_count: "Sandorių skaičius",
  status: "Būsena",
  service_type: "Paslaugos tipas",
  is_enough_data_for_ai: "Pakanka duomenų AI",
  priskirta: "Priskirtas vertintojas",
  priskirta_date: "Priskyrimo data",
  rc_filename: "Ataskaitos failas",
  rc_saskaita: "Sąskaitos failas",
};

// Value translations - database values to Lithuanian
export const VALUE_TRANSLATIONS: Record<string, string> = {
  // Property types (main_property)
  house: "Namas",
  apartment: "Butas",
  land: "Sklypas",
  premises: "Patalpos",

  // Property sub-types (main_property_type)
  block_house: "Sublokuotas namas",
  separate_house: "Atskiras namas",
  one_floor_apartment: "Vieno aukšto butas",
  attic_apartment: "Palėpės butas",
  multiple_floor_apartment: "Butas per kelis aukštus",
  separate_land: "Atskiras sklypas",
  part_of_land: "Sklypo dalis",
  separate_premises: "Individualios patalpos",
  premises_in_building: "Patalpos pastate",

  // Property purpose (main_property_purpose)
  residential: "Gyvenamoji",
  leisure: "Poilsio",
  non_residential: "Negyvenamoji",
  garden_house: "Sodų",
  farm_house: "Ūkio",
  agriculture: "Žemės ūkio",
  forestry: "Miškų ūkio",
  commercial: "Komercinė",
  office: "Biuro",
  storage: "Sandėlis",
  other: "Kita",

  // Energy class
  "A++": "A++",
  "A+": "A+",
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  E: "E",
  F: "F",
  G: "G",
  not_determined: "Nenustatyta",

  // Relation to property
  owner: "Savininkas",
  buyer: "Pirkėjas",
  lessee: "Nuomininkas",
  broker: "Brokeris",

  // Valuation purpose
  plan_to_buy: "Planuoju pirkti",
  plan_to_exchange: "Noriu įkeisti kredito įstaigai",
  plan_to_sell: "Planuoju parduoti",
  for_retrospective: "Retrospektyvai",
  curiosity: "Tiesiog smalsu",

  // Is property being sold
  already_selling: "Jau parduodama",
  planning_to_sell_later: "Planuojama parduoti vėliau",

  // Property state
  good: "Gera",
  average: "Vidutinė",
  partial_completion: "Dalinė apdaila",
  bad: "Bloga",
  not_finished: "Neužbaigta",

  // House construction
  bricks: "Plytos",
  blocks: "Blokeliai",
  wood: "Medis",
  monolith: "Monolitinis",

  // Property photos
  photos_upload: "Turiu nuotraukų",
  photo_link: "Turiu nuorodą",
  no_photos: "Neturiu",

  // Parking
  underground: "Požeminis",
  parking_lot: "Antžeminis",
  garage: "Garažas",
  none: "Nėra",

  // Project plan
  have_permission: "Yra leidimas",
  prepared_project: "Parengtas projektas",

  // Order status
  pending: "Laukiama apmokėjimo",
  paid: "Apmokėta",
  done: "Atlikta",
  failed: "Nepavyko",

  // Service types
  TYPE_1: "Automatinis vertinimas",
  TYPE_2: "Vertintojo nustatymas",
  TYPE_3: "Kainos patikslinimas",
  TYPE_4: "Turto vertinimas bankui",
};

/**
 * Get Lithuanian label for a database field name
 */
export function translateFieldName(field: string): string {
  return FIELD_LABELS[field] || field;
}

/**
 * Get Lithuanian translation for a database value
 */
export function translateValue(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Taip" : "Ne";
  }

  if (typeof value === "number") {
    return value.toString();
  }

  const stringValue = String(value);
  return VALUE_TRANSLATIONS[stringValue] || stringValue;
}

/**
 * Format boolean value to Lithuanian
 */
export function formatBoolean(value: boolean | null | undefined): string {
  if (value === null || value === undefined) {
    return "-";
  }
  return value ? "Taip" : "Ne";
}

/**
 * Format date to Lithuanian locale
 */
export function formatDate(date: Date | string | null | undefined): string {
  if (!date) {
    return "-";
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;

  return dateObj.toLocaleDateString("lt-LT", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format price to Lithuanian format with EUR
 */
export function formatPrice(price: number | null | undefined): string {
  if (price === null || price === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("lt-LT", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Format area with unit
 */
export function formatArea(area: number | null | undefined, unit: "m²" | "a" = "m²"): string {
  if (area === null || area === undefined) {
    return "-";
  }

  return `${area} ${unit}`;
}

/**
 * Get display status for an order
 */
export function getOrderStatusDisplay(
  status: string | null,
  serviceType: string | null,
  isEnoughDataForAi: boolean | null
): { label: string; variant: "default" | "success" | "warning" | "destructive" } {
  // Service type 1 with enough data = completed
  if (serviceType === "TYPE_1" && isEnoughDataForAi) {
    return { label: "Atlikta", variant: "success" };
  }

  // Check status
  switch (status) {
    case "done":
      return { label: "Atlikta", variant: "success" };
    case "paid":
      return { label: "Apmokėta / Vykdoma", variant: "warning" };
    case "failed":
      return { label: "Nepavyko", variant: "destructive" };
    case "pending":
    default:
      return { label: "Laukiama apmokėjimo", variant: "default" };
  }
}

/**
 * Get service type display info
 */
export function getServiceTypeDisplay(serviceType: string | null): { name: string; price: number } {
  const serviceTypes: Record<string, { name: string; price: number }> = {
    TYPE_1: { name: "Automatinis vertinimas", price: 8 },
    TYPE_2: { name: "Vertintojo nustatymas", price: 30 },
    TYPE_3: { name: "Kainos patikslinimas (Apžiūra)", price: 0 },
    TYPE_4: { name: "Turto vertinimas (Bankui)", price: 0 },
  };

  return serviceTypes[serviceType || ""] || { name: "Nežinoma", price: 0 };
}
