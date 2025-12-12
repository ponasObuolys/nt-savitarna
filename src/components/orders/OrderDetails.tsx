"use client";

import { User, MapPin, Home, Settings, Sparkles, FileText } from "lucide-react";
import { OrderCategory, type OrderField } from "./OrderCategory";
import type { Order } from "@/types";

interface OrderDetailsProps {
  order: Order;
}

export function OrderDetails({ order }: OrderDetailsProps) {
  // Category 1: Kontaktinė informacija
  const contactFields: OrderField[] = [
    { key: "contact_name", value: order.contact_name },
    { key: "contact_email", value: order.contact_email },
    { key: "contact_agree_to_newsletter", value: order.contact_agree_to_newsletter, type: "boolean" },
  ];

  // Category 2: Adresas
  const addressFields: OrderField[] = [
    { key: "address_municipality", value: order.address_municipality },
    { key: "address_city", value: order.address_city },
    { key: "address_street", value: order.address_street },
    { key: "address_house_number", value: order.address_house_number },
    { key: "address_location_details", value: order.address_location_details },
  ];

  // Category 3: Pagrindinė turto informacija
  const mainInfoFields: OrderField[] = [
    { key: "main_property", value: order.main_property },
    { key: "main_property_type", value: order.main_property_type },
    { key: "main_property_purpose", value: order.main_property_purpose },
    { key: "main_other_property_purpose", value: order.main_other_property_purpose },
    { key: "main_energy_class", value: order.main_energy_class },
    { key: "main_other_energy_class", value: order.main_other_energy_class },
    { key: "main_relation_to_property", value: order.main_relation_to_property },
    { key: "main_other_relation_to_property", value: order.main_other_relation_to_property },
    { key: "main_valuation_purpose", value: order.main_valuation_purpose },
    { key: "main_retrospective_year", value: order.main_retrospective_year, type: "number" },
    { key: "main_is_property_being_sold", value: order.main_is_property_being_sold },
    { key: "main_seller", value: order.main_seller },
    { key: "main_want_consultation", value: order.main_want_consultation, type: "boolean" },
  ];

  // Category 4: Turto detalės
  const detailsFields: OrderField[] = [
    { key: "details_indoor_area", value: order.details_indoor_area, type: "number", unit: "m²" },
    { key: "details_land_area", value: order.details_land_area, type: "number", unit: "a" },
    { key: "details_land_area_type", value: order.details_land_area_type },
    { key: "details_year_built", value: order.details_year_built, type: "number" },
    { key: "details_rooms", value: order.details_rooms, type: "number" },
    { key: "details_bathrooms", value: order.details_bathrooms, type: "number" },
    { key: "details_in_floor", value: order.details_in_floor, type: "number" },
    { key: "details_total_floors", value: order.details_total_floors, type: "number" },
    { key: "details_multiple_floors", value: order.details_multiple_floors, type: "boolean" },
    { key: "details_renovation", value: order.details_renovation, type: "boolean" },
    { key: "details_renovation_year", value: order.details_renovation_year, type: "number" },
    { key: "details_property_state", value: order.details_property_state },
    { key: "details_property_completion_percentage", value: order.details_property_completion_percentage, type: "number", unit: "%" },
    { key: "details_house_construction", value: order.details_house_construction },
    { key: "details_other_house_construction", value: order.details_other_house_construction },
    { key: "details_insulated_house", value: order.details_insulated_house, type: "boolean" },
  ];

  // Category 5: Turto ypatybės
  const featuresFields: OrderField[] = [
    { key: "features_parking", value: order.features_parking },
    { key: "features_storage_room", value: order.features_storage_room, type: "boolean" },
    { key: "features_terrace", value: order.features_terrace, type: "boolean" },
    { key: "features_balcony", value: order.features_balcony, type: "boolean" },
    { key: "features_garden", value: order.features_garden, type: "boolean" },
    { key: "features_shared_premises", value: order.features_shared_premises, type: "boolean" },
    { key: "features_basement", value: order.features_basement, type: "boolean" },
    { key: "features_barn", value: order.features_barn, type: "boolean" },
    { key: "features_garage", value: order.features_garage, type: "boolean" },
    { key: "features_solar_power", value: order.features_solar_power, type: "boolean" },
    { key: "features_city_supply_communications", value: order.features_city_supply_communications, type: "boolean" },
    { key: "features_borehole_communications", value: order.features_borehole_communications, type: "boolean" },
    { key: "features_sewage_treatment_communications", value: order.features_sewage_treatment_communications, type: "boolean" },
    { key: "features_gas_access_communications", value: order.features_gas_access_communications, type: "boolean" },
    { key: "features_electricity_communications", value: order.features_electricity_communications, type: "boolean" },
    { key: "features_plumbing_communications", value: order.features_plumbing_communications, type: "boolean" },
    { key: "features_other_communications", value: order.features_other_communications },
    { key: "features_project_plan", value: order.features_project_plan },
    { key: "features_other_project_plan", value: order.features_other_project_plan },
    { key: "features_empty_land", value: order.features_empty_land, type: "boolean" },
    { key: "features_boundary_with_water", value: order.features_boundary_with_water, type: "boolean" },
    { key: "features_unregistered_buildings", value: order.features_unregistered_buildings, type: "boolean" },
    { key: "features_forest_in_land", value: order.features_forest_in_land, type: "boolean" },
    { key: "features_other_additional_features", value: order.features_other_additional_features },
  ];

  // Category 6: Vertinimo rezultatai
  const resultsFields: OrderField[] = [
    { key: "created_at", value: order.created_at, type: "date" },
    { key: "service_type", value: order.service_type },
    { key: "status", value: order.status },
    { key: "price_from", value: order.price_from, type: "number", unit: "€" },
    { key: "price_to", value: order.price_to, type: "number", unit: "€" },
    { key: "items_count", value: order.items_count, type: "number" },
    { key: "priskirta", value: order.priskirta },
  ];

  return (
    <div className="space-y-4">
      <OrderCategory
        title="Kontaktinė informacija"
        icon={<User className="h-5 w-5 text-blue-600" />}
        fields={contactFields}
        defaultOpen={true}
      />

      <OrderCategory
        title="Adresas"
        icon={<MapPin className="h-5 w-5 text-green-600" />}
        fields={addressFields}
        defaultOpen={true}
      />

      <OrderCategory
        title="Pagrindinė turto informacija"
        icon={<Home className="h-5 w-5 text-orange-600" />}
        fields={mainInfoFields}
      />

      <OrderCategory
        title="Turto detalės"
        icon={<Settings className="h-5 w-5 text-purple-600" />}
        fields={detailsFields}
      />

      <OrderCategory
        title="Turto ypatybės"
        icon={<Sparkles className="h-5 w-5 text-yellow-600" />}
        fields={featuresFields}
      />

      <OrderCategory
        title="Vertinimo rezultatai"
        icon={<FileText className="h-5 w-5 text-red-600" />}
        fields={resultsFields}
        defaultOpen={true}
      />
    </div>
  );
}
