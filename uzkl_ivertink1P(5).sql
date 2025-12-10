-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Dec 09, 2025 at 04:21 PM
-- Server version: 10.6.17-MariaDB-log
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ntsmainuser_nts2db`
--

-- --------------------------------------------------------

--
-- Table structure for table `uzkl_ivertink1P`
--

CREATE TABLE `uzkl_ivertink1P` (
  `id` int(11) NOT NULL,
  `token` varchar(100) DEFAULT NULL,
  `contact_name` varchar(255) NOT NULL,
  `contact_email` varchar(255) NOT NULL,
  `contact_agree_to_newsletter` tinyint(1) DEFAULT NULL,
  `address_municipality_id` int(10) DEFAULT NULL,
  `address_municipality` varchar(255) DEFAULT NULL,
  `address_city_id` int(10) DEFAULT NULL,
  `address_city` varchar(255) DEFAULT NULL,
  `address_street_id` int(10) DEFAULT NULL,
  `address_street` varchar(255) DEFAULT NULL,
  `address_house_number` varchar(5) DEFAULT NULL,
  `address_coordinates` point DEFAULT NULL,
  `address_location_details` text DEFAULT NULL,
  `main_property` varchar(255) DEFAULT NULL,
  `main_property_type` varchar(255) DEFAULT NULL,
  `main_property_purpose` varchar(255) DEFAULT NULL,
  `main_other_property_purpose` varchar(255) DEFAULT NULL,
  `main_energy_class` varchar(10) DEFAULT NULL,
  `main_other_energy_class` varchar(255) DEFAULT NULL,
  `main_relation_to_property` varchar(255) DEFAULT NULL,
  `main_other_relation_to_property` varchar(255) DEFAULT NULL,
  `main_valuation_purpose` varchar(255) DEFAULT NULL,
  `main_retrospective_year` int(11) DEFAULT NULL,
  `main_is_property_being_sold` varchar(255) DEFAULT NULL,
  `main_seller` varchar(100) DEFAULT NULL,
  `main_want_consultation` tinyint(1) DEFAULT NULL,
  `details_indoor_area` int(11) DEFAULT NULL,
  `details_land_area` int(11) DEFAULT NULL,
  `details_land_area_type` varchar(255) DEFAULT NULL,
  `details_year_built` int(11) DEFAULT NULL,
  `details_bathrooms` int(11) DEFAULT NULL,
  `details_in_floor` int(11) DEFAULT NULL,
  `details_total_floors` int(11) DEFAULT NULL,
  `details_multiple_floors` tinyint(1) DEFAULT NULL,
  `details_rooms` int(11) DEFAULT NULL,
  `details_renovation` tinyint(1) DEFAULT NULL,
  `details_renovation_year` int(11) DEFAULT NULL,
  `details_property_state` varchar(255) DEFAULT NULL,
  `details_property_completion_percentage` int(11) DEFAULT NULL,
  `details_house_construction` varchar(255) DEFAULT NULL,
  `details_other_house_construction` varchar(255) DEFAULT NULL,
  `details_insulated_house` tinyint(1) DEFAULT NULL,
  `details_property_photos` varchar(255) DEFAULT NULL,
  `details_photos_upload` text DEFAULT NULL,
  `details_photo_link` text DEFAULT NULL,
  `features_parking` varchar(255) DEFAULT NULL,
  `features_storage_room` tinyint(1) DEFAULT NULL,
  `features_terrace` tinyint(1) DEFAULT NULL,
  `features_balcony` tinyint(1) DEFAULT NULL,
  `features_garden` tinyint(1) DEFAULT NULL,
  `features_shared_premises` tinyint(1) DEFAULT NULL,
  `features_basement` tinyint(1) DEFAULT NULL,
  `features_barn` tinyint(1) DEFAULT NULL,
  `features_garage` tinyint(1) DEFAULT NULL,
  `features_solar_power` tinyint(1) DEFAULT NULL,
  `features_city_supply_communications` tinyint(1) DEFAULT NULL,
  `features_borehole_communications` tinyint(1) DEFAULT NULL,
  `features_sewage_treatment_communications` tinyint(1) DEFAULT NULL,
  `features_gas_access_communications` tinyint(1) DEFAULT NULL,
  `features_electricity_communications` tinyint(1) DEFAULT NULL,
  `features_plumbing_communications` tinyint(1) DEFAULT NULL,
  `features_other_communications` varchar(255) DEFAULT NULL,
  `features_project_plan` varchar(255) DEFAULT NULL,
  `features_other_project_plan` varchar(255) DEFAULT NULL,
  `features_empty_land` tinyint(1) DEFAULT NULL,
  `features_boundary_with_water` tinyint(1) DEFAULT NULL,
  `features_unregistered_buildings` tinyint(1) DEFAULT NULL,
  `features_forest_in_land` tinyint(1) DEFAULT NULL,
  `features_other_additional_features` varchar(255) DEFAULT NULL,
  `opinion` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `price` int(10) DEFAULT NULL,
  `price_from` int(10) DEFAULT NULL,
  `price_to` int(10) DEFAULT NULL,
  `items_count` int(10) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `service_type` enum('1','2','3','4') DEFAULT NULL,
  `priskirta` varchar(255) DEFAULT NULL,
  `priskirta_date` datetime DEFAULT NULL,
  `variant` text NOT NULL,
  `is_enough_data_for_ai` tinyint(1) DEFAULT 0,
  `rc_variant` varchar(10) DEFAULT NULL,
  `rc_count` int(11) DEFAULT NULL,
  `rc_params_json` longtext DEFAULT NULL,
  `rc_filename` varchar(100) DEFAULT NULL,
  `soap_count` int(10) DEFAULT NULL,
  `soap_san_ids` text DEFAULT NULL,
  `rc_price` int(10) DEFAULT NULL,
  `place_di` text DEFAULT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_lithuanian_ci;

--
-- Dumping data for table `uzkl_ivertink1P`
--

INSERT INTO `uzkl_ivertink1P` (`id`, `token`, `contact_name`, `contact_email`, `contact_agree_to_newsletter`, `address_municipality_id`, `address_municipality`, `address_city_id`, `address_city`, `address_street_id`, `address_street`, `address_house_number`, `address_coordinates`, `address_location_details`, `main_property`, `main_property_type`, `main_property_purpose`, `main_other_property_purpose`, `main_energy_class`, `main_other_energy_class`, `main_relation_to_property`, `main_other_relation_to_property`, `main_valuation_purpose`, `main_retrospective_year`, `main_is_property_being_sold`, `main_seller`, `main_want_consultation`, `details_indoor_area`, `details_land_area`, `details_land_area_type`, `details_year_built`, `details_bathrooms`, `details_in_floor`, `details_total_floors`, `details_multiple_floors`, `details_rooms`, `details_renovation`, `details_renovation_year`, `details_property_state`, `details_property_completion_percentage`, `details_house_construction`, `details_other_house_construction`, `details_insulated_house`, `details_property_photos`, `details_photos_upload`, `details_photo_link`, `features_parking`, `features_storage_room`, `features_terrace`, `features_balcony`, `features_garden`, `features_shared_premises`, `features_basement`, `features_barn`, `features_garage`, `features_solar_power`, `features_city_supply_communications`, `features_borehole_communications`, `features_sewage_treatment_communications`, `features_gas_access_communications`, `features_electricity_communications`, `features_plumbing_communications`, `features_other_communications`, `features_project_plan`, `features_other_project_plan`, `features_empty_land`, `features_boundary_with_water`, `features_unregistered_buildings`, `features_forest_in_land`, `features_other_additional_features`, `opinion`, `created_at`, `price`, `price_from`, `price_to`, `items_count`, `status`, `service_type`, `priskirta`, `priskirta_date`, `variant`, `is_enough_data_for_ai`, `rc_variant`, `rc_count`, `rc_params_json`, `rc_filename`, `soap_count`, `soap_san_ids`, `rc_price`, `place_di`) VALUES
(308, '31qgoc1l', 'Mindaugas', 'mindaugas.zemaitis@1partner.lt', 0, 13, 'Vilniaus m. sav.', 31003, 'Vilniaus m.', 1326963, 'Žygio g.', '31B', 0xe610000001010000000ad6389b8e5a4b40f8a92a34104b3940, NULL, 'apartment', 'one_floor_apartment', 'residential', NULL, NULL, NULL, 'owner', NULL, 'plan_to_sell', NULL, 'already_selling', 'owner', 1, 40, NULL, NULL, 2007, 1, 7, 7, NULL, 1, 0, NULL, 'good', NULL, 'bricks', '', 1, 'no_photos', '[]', NULL, 'none', 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, NULL, NULL, NULL, 0, 0, 0, 0, NULL, NULL, '2025-12-09 09:13:12', 125068, 110500, 149500, 120, 'paid', '1', NULL, NULL, 'V1: Zonos_identifikatoriaus_numeris pagal koordinates | `Kaina_1_kvadratinio_metro` > 1 AND `Kaina_1_kvadratinio_metro` < 500000 AND `Sandorio_pavadinimas` = \"Pirkimas\" AND `Match_tipas` = \"Butas\" AND `Sandorio_data` >= \"2022-12-01\" AND `Sandorio_data` <= \"2025-12-31\" AND `ASAV_KODAS` = 13 AND `Statybos_pabaiga` >= 2003 AND `Statybos_pabaiga` <= 2011 AND `Isigytas_plotas` >= 24 AND `Isigytas_plotas` <= 56 AND `Paskirties_tipo_ID` = 160 AND `Zonos_identifikatoriaus_numeris` = 57.50', 1, 'V6', 14, '{\"sdata_nuo\":\"2025-10\",\"sdata_iki\":\"2025-12\",\"nt_tipas\":\"1\",\"sav_kodas\":\"13\",\"plotas_nuo\":\"28\",\"plotas_iki\":\"52\",\"metai_nuo\":\"2002\",\"metai_iki\":\"2012\",\"pask_tipas\":\"160\",\"gyv_kodas\":\"31003\",\"zove_nr\":\"57.50\",\"noskaicius\":\"1\",\"fmt\":\"xml\",\"opt\":\"P\",\"dtp_tipas\":\"ADRESAS\",\"dtp_reiksme\":\"Vertinimui\"}', NULL, 14, '11831564|11835292|11835479|11835827|11836520|11838287|11843615|11846099|11846271|11848836|11850219|11851871|11852842|11855320', 132000, '<div class=\'di_resp\'>\n<ol>\n<li><strong>Savivaldybės aprašymas</strong><br><br>\nVilniaus miesto savivaldybė yra Lietuvos sostinės administracinė teritorija, kuri apima didelę ir dinamišką urbanizuotą zoną su įvairiapusiška infrastruktūra ir paslaugomis. Savivaldybė pasižymi aukštu gyvenimo lygiu, gerai išvystyta socialine, kultūrine ir ekonomine aplinka. Čia veikia daug švietimo įstaigų, sveikatos priežiūros centrų, verslo ir laisvalaikio objektų, o miesto plėtra orientuota į tvarų vystymąsi bei patogumą gyventojams. Vilniaus miesto savivaldybė yra svarbus šalies politinis, ekonominis ir kultūrinis centras, kuris nuolat investuoja į miesto infrastruktūros gerinimą ir aplinkos kokybę.<br><br>\n</li>\n<li><strong>Gyvenvietės aprašymas</strong> <br><br>\nVertinamas objektas yra Vilniaus mieste, kuris yra didžiausias ir sparčiausiai augantis Lietuvos miestas. Vilnius pasižymi įvairialype urbanistine struktūra, apimančia tiek senamiesčio dalis, tiek modernius gyvenamuosius rajonus. Ši gyvenvietė yra svarbus kultūros, švietimo ir verslo centras, turintis gerai išvystytą viešojo transporto sistemą ir daugybę laisvalaikio bei rekreacijos galimybių. Vilniaus miesto teritorijoje gyvena įvairaus amžiaus ir socialinių grupių žmonės, o miesto gyvenimo kokybė nuolat gerinama per miesto plėtros projektus.<br><br>\n</li>\n<li><strong>Seniūnijos aprašymas</strong><br><br>\nŽygio gatvė priklauso Vilniaus miesto savivaldybės Žirmūnų seniūnijai, kuri yra viena iš miesto centrinės dalies seniūnijų. Žirmūnų seniūnija pasižymi gerai išvystyta infrastruktūra, daugiabučiais gyvenamaisiais kvartalais ir verslo objektais. Ši seniūnija yra patogi gyventi dėl artumo prie miesto centro, įvairių paslaugų ir gerai išvystytos viešojo transporto sistemos. Seniūnijos teritorijoje gausu parkų, mokyklų, prekybos centrų ir kitų svarbių objektų, kurie užtikrina patogų ir kokybišką gyvenimą jos gyventojams.<br><br>\n</li>\n<li><strong>Lokacijos aprašymas</strong><br><br>\nŽygio g. 31B yra strategiškai patogioje Vilniaus miesto vietoje, Žirmūnų rajone, kuris yra vienas iš populiariausių gyvenamųjų rajonų. Ši lokacija pasižymi geru susisiekimu tiek su miesto centru, tiek su kitomis miesto dalimis. Aplinka yra urbanizuota, su įvairiais gyvenamaisiais ir komerciniais objektais, taip pat netoliese yra žaliosios zonos, kurios suteikia galimybę aktyviam poilsiui. Lokacija yra patraukli tiek gyventojams, tiek verslui dėl patogios infrastruktūros ir gerai išvystytų susisiekimo galimybių.<br><br>\n</li>\n<li><strong>Vertinamo objekto aplinka</strong><br><br>\nVertinamo objekto aplinka yra urbanizuota, su daugiabučiais gyvenamaisiais namais, nedideliais verslo objektais ir viešosiomis erdvėmis. Netoliese yra parkai ir žaliosios zonos, kurios suteikia galimybę gyventojams mėgautis gamta ir aktyviu laisvalaikiu. Aplinkoje vyrauja ramus gyvenimo ritmas, tačiau tuo pačiu yra pakankamai gyvybės dėl netoliese esančių paslaugų ir prekybos vietų. Aplinkos infrastruktūra yra gerai prižiūrima, o viešosios erdvės skatina bendruomeniškumą ir saugumą.<br><br>\n</li>\n<li><strong>Artimiausia infrastruktūra</strong> <br><br>\nNetoliese nuo Žygio g. 31B yra išvystyta infrastruktūra, įskaitant kelias mokyklas ir darželius, kurie užtikrina patogias sąlygas šeimoms su vaikais. Taip pat šalia yra keli prekybos centrai ir parduotuvės, kurios suteikia galimybę patogiai įsigyti kasdienius reikmenis. Pašto paslaugos yra lengvai pasiekiamos, o pėsčiųjų takai ir dviračių takai skatina aktyvų judėjimą ir sveiką gyvenimo būdą. Ši infrastruktūra užtikrina, kad gyventojai turi prieigą prie visų būtinų paslaugų netoliese.<br><br>\n</li>\n<li><strong>Privataus transporto privažiavimo galimybės</strong> <br><br>\nŽygio gatvė yra gerai privažiuojama tiek iš pagrindinių miesto arterijų, tiek iš aplinkinių gatvių. Artimiausios pagrindinės gatvės, tokios kaip Žirmūnų gatvė ir Kalvarijų gatvė, užtikrina patogų susisiekimą su miesto centru ir kitomis svarbiomis miesto dalimis. Eismo intensyvumas piko metu yra vidutinis, tačiau dėl gerai suplanuotos gatvių tinklo ir alternatyvių maršrutų transporto srautai yra efektyviai valdomi. Ne piko metu eismas yra sklandus, todėl privataus transporto naudotojams suteikiamos patogios ir greitos privažiavimo galimybės.<br><br>\n</li>\n<li><strong>Viešasis transportas</strong> <br><br>\nŠalia Žygio g. 31B yra keli viešojo transporto sustojimai, nuo kurių iki objekto yra vos kelių minučių pėsčiomis atstumas. Šie sustojimai aptarnaujami įvairių autobusų ir troleibusų maršrutų, kurie užtikrina patogų susisiekimą su miesto centru, stotimis ir kitomis svarbiomis miesto vietomis. Viešojo transporto intervalai yra dažni, ypač piko metu, kas leidžia patogiai planuoti keliones ir sumažina laukimo laiką. Tokia viešojo transporto infrastruktūra skatina gyventojus naudotis alternatyviomis susisiekimo priemonėmis.<br><br>\n</li>\n<li><strong>Išvados dėl vertinamo turto lokacijos</strong><br>\n    - <strong>Teigiamos įtakos</strong><br>\nLokacija pasižymi puikiai išvystyta infrastruktūra, patogiu susisiekimu tiek viešuoju, tiek privačiu transportu, taip pat arti esančiomis švietimo ir prekybos įstaigomis. Aplinkos žaliosios zonos ir ramus gyvenimo ritmas didina gyvenimo kokybę.<br>\n    - <strong>Neigiamos įtakos</strong><br>\nEismo intensyvumas piko metu gali sukelti nedidelius spūsčių momentus, tačiau tai yra būdinga miesto centrinėms dalims ir yra valdomas efektyvia susisiekimo sistema.<br>\n    - <strong>Galutinė išvada dėl vertinamo turto lokacijos</strong><br>\nŽygio g. 31B lokacija Vilniaus mieste yra patraukli ir strategiškai patogi, užtikrinanti geras gyvenimo sąlygas ir patogų susisiekimą. Ši vieta tinka tiek gyvenamajam, tiek komerciniam naudojimui, atsižvelgiant į gerai išvystytą infrastruktūrą ir aplinkos kokybę.<br><br>\n</li>\n</ol>\n</div>');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `uzkl_ivertink1P`
--
ALTER TABLE `uzkl_ivertink1P`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `token` (`token`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `uzkl_ivertink1P`
--
ALTER TABLE `uzkl_ivertink1P`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=314;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
