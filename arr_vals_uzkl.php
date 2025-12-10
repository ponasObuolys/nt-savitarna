<?php
// Define the mapping of database columns to JSON paths and bind types.
// "s" is used for strings and "i" for integers (or booleans cast to int).
$fields = [
    
    //token
    'token'                       => ['path' => 'token', 'type' => 's'],
    
    // Contact
    'contact_name'                => ['path' => 'contact.name', 'type' => 's'],
    'contact_email'               => ['path' => 'contact.email', 'type' => 's'],
    'contact_agree_to_newsletter' => ['path' => 'contact.agree_to_newsletter', 'type' => 'i'],

    // Address
    'address_coordinates'         => ['path' => 'address.coordinates', 'type' => 's'],
    'address_location_details'    => ['path' => 'address.location_details', 'type' => 's'],
    'address_municipality'        => ['path' => 'address.municipality', 'type' => 's'],
    'address_municipality_id'        => ['path' => 'address.municipality_id', 'type' => 'i'],
    'address_city'                => ['path' => 'address.city', 'type' => 's'],
    'address_city_id'                => ['path' => 'address.city_id', 'type' => 'i'],
    'address_street'              => ['path' => 'address.street', 'type' => 's'],
    'address_street_id'              => ['path' => 'address.street_id', 'type' => 'i'],
    'address_house_number'        => ['path' => 'address.house_number', 'type' => 's'],
    
    // Main Info
    'main_property'               => ['path' => 'main_info.property', 'type' => 's'],
    'main_property_type'          => ['path' => 'main_info.property_type', 'type' => 's'],
    'main_property_purpose'       => ['path' => 'main_info.property_purpose', 'type' => 's'],
    'main_other_property_purpose' => ['path' => 'main_info.other_property_purpose', 'type' => 's'],
    'main_energy_class'           => ['path' => 'main_info.energy_class', 'type' => 's'],
    'main_other_energy_class'     => ['path' => 'main_info.other_energy_class', 'type' => 's'],
    'main_relation_to_property'   => ['path' => 'main_info.relation_to_property', 'type' => 's'],
    'main_other_relation_to_property' => ['path' => 'main_info.other_relation_to_property', 'type' => 's'],
    'main_valuation_purpose'      => ['path' => 'main_info.valuation_purpose', 'type' => 's'],
    'main_retrospective_year'     => ['path' => 'main_info.retrospective_year', 'type' => 'i'],
    'main_is_property_being_sold' => ['path' => 'main_info.is_property_being_sold', 'type' => 's'],
    'main_seller'                 => ['path' => 'main_info.seller', 'type' => 's'],
    'main_want_consultation'      => ['path' => 'main_info.want_consultation', 'type' => 'i'],

    // Property Details
    'details_indoor_area'         => ['path' => 'property_details.indoor_area', 'type' => 'i'],
    'details_land_area'           => ['path' => 'property_details.land_area', 'type' => 'i'],
    'details_land_area_type'      => ['path' => 'property_details.land_area_type', 'type' => 's'],
    'details_year_built'          => ['path' => 'property_details.year_built', 'type' => 'i'],
    'details_bathrooms'           => ['path' => 'property_details.bathrooms', 'type' => 'i'],
    'details_in_floor'            => ['path' => 'property_details.in_floor', 'type' => 'i'],
    'details_total_floors'        => ['path' => 'property_details.total_floors', 'type' => 'i'],
    'details_multiple_floors'     => ['path' => 'property_details.multiple_floors', 'type' => 'i'],
    'details_rooms'               => ['path' => 'property_details.rooms', 'type' => 'i'],
    'details_renovation'          => ['path' => 'property_details.renovation', 'type' => 'i'],
    'details_renovation_year'     => ['path' => 'property_details.renovation_year', 'type' => 'i'],
    'details_property_state'      => ['path' => 'property_details.property_state', 'type' => 's'],
    'details_property_completion_percentage' => ['path' => 'property_details.property_completion_percentage', 'type' => 'i'],
    'details_house_construction'  => ['path' => 'property_details.house_construction', 'type' => 's'],
    'details_other_house_construction' => ['path' => 'property_details.other_house_construction', 'type' => 's'],
    'details_insulated_house'     => ['path' => 'property_details.insulated_house', 'type' => 'i'],
    'details_property_photos'     => ['path' => 'property_details.property_photos', 'type' => 's'],
    'details_photos_upload'       => ['path' => 'property_details.photos_upload', 'type' => 's'],
    'details_photo_link'          => ['path' => 'property_details.photo_link', 'type' => 's'],

    // Property Features
    'features_parking'                   => ['path' => 'property_features.parking', 'type' => 's'],
    'features_storage_room'              => ['path' => 'property_features.storage_room', 'type' => 'i'],
    'features_terrace'                   => ['path' => 'property_features.terrace', 'type' => 'i'],
    'features_balcony'                   => ['path' => 'property_features.balcony', 'type' => 'i'],
    'features_garden'                    => ['path' => 'property_features.garden', 'type' => 'i'],
    'features_shared_premises'           => ['path' => 'property_features.shared_premises', 'type' => 'i'],
    'features_basement'                  => ['path' => 'property_features.basement', 'type' => 'i'],
    'features_barn'                      => ['path' => 'property_features.barn', 'type' => 'i'],
    'features_garage'                    => ['path' => 'property_features.garage', 'type' => 'i'],
    'features_solar_power'               => ['path' => 'property_features.solar_power', 'type' => 'i'],
    'features_city_supply_communications'=> ['path' => 'property_features.city_supply_communications', 'type' => 'i'],
    'features_borehole_communications'   => ['path' => 'property_features.borehole_communications', 'type' => 'i'],
    'features_sewage_treatment_communications' => ['path' => 'property_features.sewage_treatment_communications', 'type' => 'i'],
    'features_gas_access_communications' => ['path' => 'property_features.gas_access_communications', 'type' => 'i'],
    'features_electricity_communications'=> ['path' => 'property_features.electricity_communications', 'type' => 'i'],
    'features_plumbing_communications'   => ['path' => 'property_features.plumbing_communications', 'type' => 'i'],
    'features_other_communications'      => ['path' => 'property_features.other_communications', 'type' => 's'],
    'features_project_plan'              => ['path' => 'property_features.project_plan', 'type' => 's'],
    'features_other_project_plan'        => ['path' => 'property_features.other_project_plan', 'type' => 's'],
    'features_empty_land'                => ['path' => 'property_features.empty_land', 'type' => 'i'],
    'features_boundary_with_water'       => ['path' => 'property_features.boundary_with_water', 'type' => 'i'],
    'features_unregistered_buildings'    => ['path' => 'property_features.unregistered_buildings', 'type' => 'i'],
    'features_forest_in_land'            => ['path' => 'property_features.forest_in_land', 'type' => 'i'],
    'features_other_additional_features' => ['path' => 'property_features.other_additional_features', 'type' => 's'],
    
    //Opinion
    'opinion'                            => ['path' => 'opinion', 'type' => 's'],
    
    'is_enough_data_for_ai'              => ['path' => 'is_enough_data_for_ai', 'type' => 'i']
];

$arr_vals = [
    'id'                                => 'ID',
    'token'                             => 'Kodas',
    'contact_name'                      => 'Vardas',
    'contact_email'                     => 'El. paštas',
    'contact_agree_to_newsletter'       => 'Sutikimas gauti naujienlaiškį',
    'address_municipality_id'           => 'Savivaldybės ID',
    'address_municipality'              => 'Savivaldybė',
    'address_city_id'                   => 'Miestų ID',
    'address_city'                      => 'Miestas',
    'address_street_id'                 => 'Gatvės ID',
    'address_street'                    => 'Gatvė',
    'address_house_number'              => 'Namo numeris',
    'address_coordinates'               => 'Koordinatės',
    'address_location_details'          => 'Vietos detalės',
    'main_property'                     => 'Pagrindinė nuosavybė',
    'main_property_type'                => 'Nuosavybės tipas',
    'main_property_purpose'             => 'Nuosavybės paskirtis',
    'main_other_property_purpose'       => 'Kita paskirtis',
    'main_energy_class'                 => 'Energinė klasė',
    'main_other_energy_class'           => 'Kita energinė klasė',
    'main_relation_to_property'         => 'Santykis su nuosavybe',
    'main_other_relation_to_property'   => 'Kitas santykis su nuosavybe',
    'main_valuation_purpose'            => 'Vertinimo paskirtis',
    'main_retrospective_year'           => 'Retrospektyviniai metai',
    'main_is_property_being_sold'       => 'Ar nuosavybė parduodama',
    'main_seller'                       => 'Pardavėjas',
    'main_want_consultation'            => 'Nori konsultacijos',
    'details_indoor_area'               => 'Vidaus plotas',
    'details_land_area'                 => 'Sklypo plotas, a',
    'details_land_area_type'            => 'Sklypo ploto tipas',
    'details_year_built'                => 'Statybos metai',
    'details_bathrooms'                 => 'Vonios kambarių skaičius',
    'details_in_floor'                  => 'Aukštas',
    'details_total_floors'              => 'Viso aukštų',
    'details_multiple_floors'           => 'Kelių aukštų',
    'details_rooms'                     => 'Kambarių skaičius',
    'details_renovation'                => 'Renovacija',
    'details_renovation_year'           => 'Renovacijos metai',
    'details_property_state'            => 'Būklė',
    'details_property_completion_percentage' => 'Užbaigtumas (%)',
    'details_house_construction'        => 'Statybos tipas',
    'details_other_house_construction'  => 'Kitas statybos tipas',
    'details_insulated_house'           => 'Šiltinimas',
    'details_property_photos'           => 'Nuosavybės nuotraukos',
    'details_photos_upload'             => 'Įkeltos nuotraukos',
    'details_photo_link'                => 'Nuoroda į nuotraukas',
    'features_parking'                  => 'Parkavimas',
    'features_storage_room'             => 'Sandėliukas',
    'features_terrace'                  => 'Terasa',
    'features_balcony'                  => 'Balkonas',
    'features_garden'                   => 'Sodas',
    'features_shared_premises'          => 'Bendros patalpos',
    'features_basement'                 => 'Rūsys',
    'features_barn'                     => 'Ūkinis pastatas',
    'features_garage'                   => 'Garažas',
    'features_solar_power'              => 'Saulės energija',
    'features_city_supply_communications'  => 'Miesto komunikacijos',
    'features_borehole_communications'     => 'Gręžinių komunikacijos',
    'features_sewage_treatment_communications' => 'Nuotekų valymo komunikacijos',
    'features_gas_access_communications'     => 'Dujotiekis',
    'features_electricity_communications'    => 'Elektra',
    'features_plumbing_communications'       => 'Vandentiekis',
    'features_other_communications'          => 'Kitos komunikacijos',
    'features_project_plan'               => 'Projekto planas',
    'features_other_project_plan'         => 'Kitas projekto planas',
    'features_empty_land'                 => 'Tuščias žemės sklypas',
    'features_boundary_with_water'        => 'Ribojasi su vandeniu',
    'features_unregistered_buildings'     => 'Neregistruoti statiniai',
    'features_forest_in_land'             => 'Miškas sklype',
    'features_other_additional_features'  => 'Kiti papildomi ypatumai',
    'opinion'                             => 'Nuomonė',
    'created_at'                          => 'Sukurta',
    'price'                               => 'Kaina',
    'price_from'                          => 'Kaina nuo',
    'price_to'                            => 'Kaina iki',
    'items_count'                         => 'Sandorių skaičius',
    'status'                              => 'Būsena',
    'service_type'                        => 'Paslaugos tipas',
    'is_enough_data_for_ai'               => 'Ar pakanka duomenų'
];

$value_translations = [
    // main_info.property
    'house'                     => 'Namas',
    'apartment'                 => 'Butas',
    'land'                      => 'Sklypas',
    'premises'                  => 'Patalpos',

    // main_info.property_type
    'block_house'               => 'Sublokuotas namas',
    'separate_house'            => 'Atskiras namas',
    'one_floor_apartment'       => 'Įprastas vieno aukšto butas',
    'attic_apartment'           => 'Palėpėje',
    'multiple_floor_apartment'  => 'Butas per kelis aukštus',
    'separate_land'             => 'Atskiras sklypas',
    'part_of_land'              => 'Sklypo dalis',
    'separate_premises'         => 'Individualios patalpos',
    'premises_in_building'      => 'Patalpos pastate',

    // main_info.property_purpose
    'residential'               => 'Gyvenamoji',
    'leisure'                   => 'Poilsio',
    'non_residential'           => 'Negyvenamoji',
    'garden_house'              => 'Sodų',
    'farm_house'                => 'Ūkio',
    'agriculture'               => 'Žemės ūkio paskirtis',
    'forestry'                  => 'Miškų ūkio paskirtis',
    'commercial'                => 'Komercinė paskirtis',
    'office'                    => 'Biuro patalpos',
    'storage'                   => 'Sandėlis',
    'other'                     => 'Kita',

    // main_info.energy_class
    'A++'                       => 'A++',
    'A+'                        => 'A+',
    'A'                         => 'A',
    'B'                         => 'B',
    'not_determined'            => 'Nenurodyta',
    'other'                     => 'Kita',

    // main_info.relation_to_property
    'owner'                     => 'Savininkas',
    'buyer'                     => 'Pirkėjas',
    'lessee'                    => 'Nuomininkas',
    'broker'                    => 'Brokeris',
    'other'                     => 'Kita',

    // main_info.valuation_purpose
    'plan_to_buy'               => 'Planuoju pirkti',
    'plan_to_exchange'          => 'Noriu įkeisti kredito įstaigai',
    'plan_to_sell'              => 'Planuoju parduoti',
    'for_retrospective'         => 'Retrospektyvai',
    'curiosity'                 => 'Tiesiog smalsu',

    // main_info.is_property_being_sold
    'already_selling'           => 'Jau parduodama',
    'planning_to_sell_later'    => 'Planuojama parduoti vėliau',

    // main_info.seller
    'owner'                     => 'Savininkas',
    'broker'                    => 'Brokeris',

    // main_info.want_consultation (optional Boolean)
    '1'                         => 'Taip',
    '0'                         => 'Ne',

    // property_details.land_area_type
    'separate_land'             => 'Atskiras sklypas',
    'part_of_land'              => 'Sklypo dalis',

    // property_details.property_state
    'good'                      => 'Gera',
    'average'                   => 'Vidutinė',
    'partial_completion'        => 'Dalinė apdaila',
    'bad'                       => 'Bloga',
    'not_finished'              => 'Neužbaigta',

    // property_details.house_construction
    'bricks'                    => 'Plytos',
    'blocks'                    => 'Blokeliai',
    'wood'                      => 'Medis',
    'monolith'                  => 'Monolitinis',
    'other'                     => 'Kita',

    // property_details.property_photos
    'photos_upload'             => 'Turiu nuotraukų',
    'photo_link'                => 'Turiu nuorodą',
    'no_photos'                 => 'Neturiu',

    // property_features.parking
    'underground'               => 'Požeminis parkingas',
    'parking_lot'               => 'Antžeminis parkingas',
    'garage'                    => 'Priklauso garažas',
    'none'                      => 'Neturi',

    // property_features.project_plan
    'none'                      => 'Nėra',
    'have_permission'           => 'Yra leidimas',
    'prepared_project'          => 'Parengtas projektas',
    'other'                     => 'Kita',

    // property_features (all other Boolean flags)
    '1'                         => 'Taip',
    '0'                         => 'Ne',
    
    'pending'                   => 'Laukiama apmokėjimo',
    'paid'                      => 'Apmokėta',
    'failed'                    => 'Mokėjimas nepavyko',
];

$cols = [
           'service_type','token','contact_name','contact_email',
           'address_municipality','address_city','address_street','address_house_number','address_coordinates','address_location_details',
           'main_property','main_property_type','main_property_purpose','main_other_property_purpose','main_energy_class','main_other_energy_class',
           'main_relation_to_property','main_other_relation_to_property','main_valuation_purpose','main_retrospective_year',
           'main_is_property_being_sold','main_seller','main_want_consultation',
           'details_indoor_area','details_land_area','details_land_area_type','details_year_built','details_bathrooms',
           'details_in_floor','details_total_floors','details_multiple_floors','details_rooms','details_renovation','details_renovation_year',
           'details_property_state','details_property_completion_percentage','details_house_construction','details_other_house_construction',
           'details_insulated_house','details_property_photos','details_photos_upload','details_photo_link',
           'features_parking','features_storage_room','features_terrace','features_balcony','features_garden',
           'features_shared_premises','features_basement','features_barn','features_garage','features_solar_power',
           'features_city_supply_communications','features_borehole_communications','features_sewage_treatment_communications',
           'features_gas_access_communications','features_electricity_communications','features_plumbing_communications',
           'features_other_communications','features_project_plan','features_other_project_plan','features_empty_land',
           'features_boundary_with_water','features_unregistered_buildings','features_forest_in_land','features_other_additional_features',
           'opinion','created_at','price','price_from','price_to','items_count','status'
];
?>