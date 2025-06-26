
-- FMCG Sari-Sari Store Seed Data
-- Complete Philippine Market Simulation

-- 1. Insert Philippine Regions (17 Official Regions)
INSERT INTO scout.geography_regions (region_code, region_name, population) VALUES
('NCR', 'National Capital Region', 13484462),
('CAR', 'Cordillera Administrative Region', 1797660),
('01', 'Ilocos Region', 5301139),
('02', 'Cagayan Valley', 3685744),
('03', 'Central Luzon', 12422172),
('4A', 'CALABARZON', 16195042),
('4B', 'MIMAROPA', 3228558),
('05', 'Bicol Region', 6082165),
('06', 'Western Visayas', 7936438),
('07', 'Central Visayas', 8081988),
('08', 'Eastern Visayas', 4547150),
('09', 'Zamboanga Peninsula', 3875576),
('10', 'Northern Mindanao', 5022768),
('11', 'Davao Region', 5243536),
('12', 'SOCCSKSARGEN', 4545276),
('13', 'Caraga', 2804788),
('BARMM', 'Bangsamoro Autonomous Region', 4404288);

-- 2. Insert Sample Provinces and Cities (Key Urban Centers)
WITH region_lookup AS (
    SELECT id, region_code FROM scout.geography_regions
)
INSERT INTO scout.geography_provinces (region_id, province_code, province_name)
SELECT r.id, prov_code, prov_name
FROM region_lookup r
JOIN (VALUES 
    ('NCR', 'MNL', 'Metro Manila'),
    ('CAR', 'BEN', 'Benguet'),
    ('01', 'ILN', 'Ilocos Norte'),
    ('02', 'CAG', 'Cagayan'),
    ('03', 'BUL', 'Bulacan'),
    ('4A', 'LAG', 'Laguna'),
    ('4B', 'PLW', 'Palawan'),
    ('05', 'ALB', 'Albay'),
    ('06', 'ILO', 'Iloilo'),
    ('07', 'CEB', 'Cebu'),
    ('08', 'LEY', 'Leyte'),
    ('09', 'ZSI', 'Zamboanga del Sur'),
    ('10', 'MSR', 'Misamis Oriental'),
    ('11', 'DAV', 'Davao del Sur'),
    ('12', 'COT', 'Cotabato'),
    ('13', 'ADN', 'Agusan del Norte'),
    ('BARMM', 'SLU', 'Sulu')
) AS provinces_data(region_code, prov_code, prov_name)
ON r.region_code = provinces_data.region_code;

-- 3. Insert Major Cities
WITH province_lookup AS (
    SELECT p.id, p.province_code FROM scout.geography_provinces p
)
INSERT INTO scout.geography_cities (province_id, city_code, city_name, city_type)
SELECT p.id, city_code, city_name, city_type
FROM province_lookup p
JOIN (VALUES 
    ('MNL', 'MNL001', 'Manila', 'City'),
    ('MNL', 'QZN001', 'Quezon City', 'City'),
    ('MNL', 'MKT001', 'Makati', 'City'),
    ('BEN', 'BAG001', 'Baguio', 'City'),
    ('ILN', 'LAO001', 'Laoag', 'City'),
    ('CAG', 'TUG001', 'Tuguegarao', 'City'),
    ('BUL', 'MLN001', 'Malolos', 'City'),
    ('LAG', 'CAL001', 'Calamba', 'City'),
    ('PLW', 'PPS001', 'Puerto Princesa', 'City'),
    ('ALB', 'LEG001', 'Legazpi', 'City'),
    ('ILO', 'ILO001', 'Iloilo City', 'City'),
    ('CEB', 'CEB001', 'Cebu City', 'City'),
    ('LEY', 'TAC001', 'Tacloban', 'City'),
    ('ZSI', 'ZAM001', 'Zamboanga City', 'City'),
    ('MSR', 'CDO001', 'Cagayan de Oro', 'City'),
    ('DAV', 'DAV001', 'Davao City', 'City'),
    ('COT', 'GEN001', 'General Santos', 'City'),
    ('ADN', 'BUT001', 'Butuan', 'City'),
    ('SLU', 'JOL001', 'Jolo', 'Municipality')
) AS cities_data(province_code, city_code, city_name, city_type)
ON p.province_code = cities_data.province_code;

-- 4. Insert Sample Barangays with Coordinates
WITH city_lookup AS (
    SELECT c.id, c.city_code FROM scout.geography_cities c
)
INSERT INTO scout.geography_barangays (city_id, barangay_code, barangay_name, latitude, longitude, population)
SELECT c.id, brgy_code, brgy_name, latitude, longitude, population
FROM city_lookup c
JOIN (VALUES 
    -- Manila
    ('MNL001', 'MNL001001', 'Binondo', 14.5995, 120.9739, 12000),
    ('MNL001', 'MNL001002', 'Tondo', 14.6198, 120.9678, 45000),
    ('MNL001', 'MNL001003', 'Ermita', 14.5844, 120.9800, 8000),
    -- Quezon City
    ('QZN001', 'QZN001001', 'Commonwealth', 14.7056, 121.0813, 35000),
    ('QZN001', 'QZN001002', 'Diliman', 14.6537, 121.0689, 28000),
    -- Cebu City
    ('CEB001', 'CEB001001', 'Lahug', 10.3295, 123.8910, 25000),
    ('CEB001', 'CEB001002', 'Colon', 10.2957, 123.9015, 15000),
    -- Davao City
    ('DAV001', 'DAV001001', 'Poblacion', 7.0731, 125.6128, 20000),
    ('DAV001', 'DAV001002', 'Agdao', 7.0845, 125.6234, 18000),
    -- Add more barangays as needed
    ('BAG001', 'BAG001001', 'Burnham', 16.4116, 120.5931, 12000),
    ('ILO001', 'ILO001001', 'City Proper', 10.7202, 122.5621, 15000)
) AS barangays_data(city_code, brgy_code, brgy_name, latitude, longitude, population)
ON c.city_code = barangays_data.city_code;

-- 5. Insert FMCG Companies (Client Companies + Major Competitors)
INSERT INTO scout.fmcg_companies (company_name, company_type, market_position) VALUES
-- Client Companies
('Alaska Milk Corporation', 'Client', 'MNC'),
('Liwayway Marketing Corporation', 'Client', 'Local'),
('Peerless Products Manufacturing Corporation', 'Client', 'Local'),
('Del Monte Philippines', 'Client', 'MNC'),
('Japan Tobacco International', 'Client', 'MNC'),
-- Major Competitors
('Nestlé Philippines', 'Competitor', 'MNC'),
('Unilever Philippines', 'Competitor', 'MNC'),
('Procter & Gamble Philippines', 'Competitor', 'MNC'),
('Universal Robina Corporation', 'Competitor', 'Local'),
('San Miguel Corporation', 'Competitor', 'Local'),
('Century Pacific Food Inc.', 'Competitor', 'Local'),
('NutriAsia', 'Competitor', 'Local'),
('Philip Morris Fortune Tobacco Corp.', 'Competitor', 'MNC'),
('Ricoa', 'Competitor', 'Local'),
('Monde Nissin', 'Competitor', 'Local');

-- 6. Insert FMCG Brands
WITH company_lookup AS (
    SELECT id, company_name FROM scout.fmcg_companies
)
INSERT INTO scout.fmcg_brands (company_id, brand_name, category, sub_category, market_tier, is_client_brand)
SELECT c.id, brand_name, category, sub_category, market_tier, is_client_brand
FROM company_lookup c
JOIN (VALUES 
    -- Alaska Milk Corporation (Client)
    ('Alaska Milk Corporation', 'Alaska', 'Dairy', 'Milk', 'Mass', TRUE),
    ('Alaska Milk Corporation', 'Krem-Top', 'Dairy', 'Creamer', 'Mass', TRUE),
    ('Alaska Milk Corporation', 'Alpine', 'Dairy', 'Milk', 'Mass', TRUE),
    
    -- Liwayway Marketing (Client - Oishi)
    ('Liwayway Marketing Corporation', 'Oishi', 'Snacks', 'Chips', 'Mass', TRUE),
    ('Liwayway Marketing Corporation', 'Richeese', 'Snacks', 'Chips', 'Mass', TRUE),
    
    -- Peerless Products (Client)
    ('Peerless Products Manufacturing Corporation', 'Champion', 'Home Care', 'Detergent', 'Mass', TRUE),
    ('Peerless Products Manufacturing Corporation', 'Calla', 'Personal Care', 'Shampoo', 'Mass', TRUE),
    
    -- Del Monte Philippines (Client)
    ('Del Monte Philippines', 'Del Monte', 'Food', 'Canned Goods', 'Premium', TRUE),
    
    -- JTI (Client)
    ('Japan Tobacco International', 'Winston', 'Tobacco', 'Cigarettes', 'Mass', TRUE),
    ('Japan Tobacco International', 'Camel', 'Tobacco', 'Cigarettes', 'Premium', TRUE),
    
    -- Major Competitors
    ('Nestlé Philippines', 'Bear Brand', 'Dairy', 'Milk', 'Premium', FALSE),
    ('Nestlé Philippines', 'Nescafé', 'Beverages', 'Coffee', 'Premium', FALSE),
    ('Universal Robina Corporation', 'Jack n Jill', 'Snacks', 'Chips', 'Mass', FALSE),
    ('Universal Robina Corporation', 'Piattos', 'Snacks', 'Chips', 'Mass', FALSE),
    ('Unilever Philippines', 'Surf', 'Home Care', 'Detergent', 'Mass', FALSE),
    ('Procter & Gamble Philippines', 'Tide', 'Home Care', 'Detergent', 'Premium', FALSE),
    ('San Miguel Corporation', 'Magnolia', 'Dairy', 'Milk', 'Mass', FALSE),
    ('NutriAsia', 'UFC', 'Food', 'Condiments', 'Mass', FALSE),
    ('Philip Morris Fortune Tobacco Corp.', 'Marlboro', 'Tobacco', 'Cigarettes', 'Premium', FALSE)
) AS brands_data(company_name, brand_name, category, sub_category, market_tier, is_client_brand)
ON c.company_name = brands_data.company_name;

-- 7. Insert FMCG Products (5 SKUs per brand minimum)
WITH brand_lookup AS (
    SELECT id, brand_name FROM scout.fmcg_brands
)
INSERT INTO scout.fmcg_products (brand_id, sku, product_name, pack_size, unit_of_measure, srp, cost_price, margin_percent)
SELECT b.id, sku, product_name, pack_size, unit_of_measure, srp, cost_price, margin_percent
FROM brand_lookup b
JOIN (VALUES 
    -- Alaska Products
    ('Alaska', 'ALSK-EVM-155ML', 'Alaska Evaporated Milk', '155ml', 'can', 24.00, 18.00, 25.0),
    ('Alaska', 'ALSK-EVM-380ML', 'Alaska Evaporated Milk', '380ml', 'can', 42.50, 32.00, 24.7),
    ('Alaska', 'ALSK-CDM-300G', 'Alaska Condensed Milk', '300g', 'can', 38.75, 29.00, 25.2),
    ('Alaska', 'ALSK-PWD-33G', 'Alaska Powdered Milk', '33g', 'sachet', 12.00, 9.00, 25.0),
    ('Alaska', 'ALSK-PWD-1KG', 'Alaska Powdered Milk', '1kg', 'pack', 215.00, 165.00, 23.3),
    
    -- Oishi Products
    ('Oishi', 'OISH-PRWN-80G', 'Oishi Prawn Crackers', '80g', 'pack', 15.00, 11.00, 26.7),
    ('Oishi', 'OISH-PILL-65G', 'Oishi Pillows', '65g', 'pack', 12.50, 9.50, 24.0),
    ('Oishi', 'OISH-RDG-75G', 'Oishi Ridges', '75g', 'pack', 18.00, 13.50, 25.0),
    ('Oishi', 'OISH-MART-60G', 'Oishi Martys', '60g', 'pack', 14.25, 10.75, 24.6),
    ('Oishi', 'OISH-BRDP-85G', 'Oishi Bread Pan', '85g', 'pack', 16.50, 12.25, 25.8),
    
    -- Champion Products
    ('Champion', 'CHMP-DET-1KG', 'Champion Detergent Powder', '1kg', 'pack', 89.90, 68.00, 24.3),
    ('Champion', 'CHMP-DET-70G', 'Champion Detergent Powder', '70g', 'sachet', 8.50, 6.50, 23.5),
    ('Champion', 'CHMP-FAB-1L', 'Champion Fabric Conditioner', '1L', 'bottle', 75.00, 56.00, 25.3),
    
    -- Del Monte Products
    ('Del Monte', 'DLMT-KTCH-500G', 'Del Monte Tomato Ketchup', '500g', 'bottle', 55.25, 42.00, 24.0),
    ('Del Monte', 'DLMT-FRT-822G', 'Del Monte Fruit Cocktail', '822g', 'can', 89.00, 68.00, 23.6),
    ('Del Monte', 'DLMT-PNPL-240ML', 'Del Monte Pineapple Juice', '240ml', 'can', 25.50, 19.00, 25.5),
    
    -- Winston Products
    ('Winston', 'WINST-RED-20S', 'Winston Red', '20 sticks', 'pack', 125.00, 95.00, 24.0),
    ('Winston', 'WINST-BLUE-20S', 'Winston Blue', '20 sticks', 'pack', 125.00, 95.00, 24.0),
    
    -- Competitor Products
    ('Bear Brand', 'BEAR-EVM-155ML', 'Bear Brand Evaporated Milk', '155ml', 'can', 26.00, 20.00, 23.1),
    ('Jack n Jill', 'JNJ-CHIP-60G', 'Jack n Jill Potato Chips', '60g', 'pack', 17.50, 13.00, 25.7),
    ('Piattos', 'PIAT-CHSE-85G', 'Piattos Cheese', '85g', 'pack', 28.50, 21.50, 24.6),
    ('Surf', 'SURF-PWD-1KG', 'Surf Detergent Powder', '1kg', 'pack', 95.50, 72.00, 24.6),
    ('Marlboro', 'MRLB-RED-20S', 'Marlboro Red', '20 sticks', 'pack', 130.00, 98.00, 24.6)
) AS products_data(brand_name, sku, product_name, pack_size, unit_of_measure, srp, cost_price, margin_percent)
ON b.brand_name = products_data.brand_name;

-- 8. Create Sari-Sari Stores
WITH barangay_lookup AS (
    SELECT id, barangay_name FROM scout.geography_barangays
)
INSERT INTO scout.sari_stores (barangay_id, store_name, owner_name, store_type, has_refrigerator, monthly_revenue_estimate, latitude, longitude)
SELECT 
    b.id,
    'Tindahan ni ' || (ARRAY['Aling Maria', 'Kuya Jun', 'Ate Rosa', 'Mang Tony', 'Nanay Linda', 'Tatay Ben', 'Aling Carmen', 'Kuya Mark'])[FLOOR(1 + RANDOM() * 8)],
    (ARRAY['Maria Santos', 'Jun Cruz', 'Rosa dela Cruz', 'Tony Garcia', 'Linda Reyes', 'Ben Flores', 'Carmen Lopez', 'Mark Gonzales'])[FLOOR(1 + RANDOM() * 8)],
    'Sari-Sari',
    RANDOM() > 0.7, -- 30% have refrigerators
    15000 + RANDOM() * 35000, -- 15k to 50k monthly revenue
    b.latitude + (RANDOM() - 0.5) * 0.01, -- Small random offset
    b.longitude + (RANDOM() - 0.5) * 0.01
FROM barangay_lookup b
CROSS JOIN generate_series(1, 3); -- 3 stores per barangay

-- Continue with more seed data...
