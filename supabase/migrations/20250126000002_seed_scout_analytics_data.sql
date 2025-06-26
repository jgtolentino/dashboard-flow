
-- Scout Analytics Comprehensive Seed Data
-- Philippine Market Simulation with Realistic Data

-- 1. Insert Philippine Regions
INSERT INTO scout.regions (region_code, region_name) VALUES
('NCR', 'National Capital Region'),
('CAR', 'Cordillera Administrative Region'),
('R1', 'Ilocos Region'),
('R2', 'Cagayan Valley'),
('R3', 'Central Luzon'),
('R4A', 'CALABARZON'),
('R4B', 'MIMAROPA'),
('R5', 'Bicol Region'),
('R6', 'Western Visayas'),
('R7', 'Central Visayas'),
('R8', 'Eastern Visayas'),
('R9', 'Zamboanga Peninsula'),
('R10', 'Northern Mindanao'),
('R11', 'Davao Region'),
('R12', 'SOCCSKSARGEN'),
('R13', 'Caraga'),
('BARMM', 'Bangsamoro Autonomous Region');

-- 2. Insert Locations with Geographic Coordinates
WITH region_lookup AS (
    SELECT id, region_code FROM scout.regions
)
INSERT INTO scout.locations (region_id, city, municipality, barangay, location_name, coordinates) 
SELECT r.id, city, municipality, barangay, location_name, ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)
FROM region_lookup r
JOIN (VALUES 
    -- NCR Locations
    ('NCR', 'Manila', 'Manila', 'Tondo', 'Tondo Public Market', 120.9678, 14.6198),
    ('NCR', 'Quezon City', 'Quezon City', 'Commonwealth', 'Commonwealth Market', 121.0813, 14.7056),
    ('NCR', 'Makati', 'Makati', 'Poblacion', 'Makati CBD', 121.0244, 14.5547),
    ('NCR', 'Pasig', 'Pasig', 'Kapitolyo', 'Kapitolyo Market', 121.0648, 14.5648),
    ('NCR', 'Mandaluyong', 'Mandaluyong', 'Poblacion', 'Mandaluyong Center', 121.0340, 14.5794),
    
    -- Luzon Locations
    ('CAR', 'Baguio', 'Baguio', 'Burnham', 'Baguio Public Market', 120.5931, 16.4116),
    ('R1', 'Dagupan', 'Dagupan', 'Poblacion', 'Dagupan Market', 120.3329, 16.0439),
    ('R3', 'San Fernando', 'San Fernando', 'Centro', 'San Fernando Market', 120.6879, 15.0319),
    ('R4A', 'Lipa', 'Lipa', 'Poblacion', 'Lipa Public Market', 121.1644, 13.9411),
    ('R5', 'Legazpi', 'Legazpi', 'Poblacion', 'Legazpi Market', 123.7443, 13.1391),
    
    -- Visayas Locations
    ('R6', 'Iloilo', 'Iloilo', 'City Proper', 'Iloilo Central Market', 122.5621, 10.7202),
    ('R7', 'Cebu City', 'Cebu', 'Lahug', 'Lahug Market', 123.8854, 10.3157),
    ('R7', 'Mandaue', 'Mandaue', 'Centro', 'Mandaue Public Market', 123.9292, 10.3297),
    ('R8', 'Tacloban', 'Tacloban', 'Poblacion', 'Tacloban Market', 125.0045, 11.2448),
    
    -- Mindanao Locations
    ('R9', 'Zamboanga', 'Zamboanga', 'Poblacion', 'Zamboanga Port Area', 122.0790, 6.9214),
    ('R10', 'Cagayan de Oro', 'Cagayan de Oro', 'Poblacion', 'CDO Central Market', 124.6319, 8.4542),
    ('R11', 'Davao', 'Davao', 'Poblacion', 'Davao Central Market', 125.6127, 7.0735),
    ('R12', 'General Santos', 'General Santos', 'Poblacion', 'GenSan Fish Market', 125.1717, 6.1164)
) AS locations_data(region_code, city, municipality, barangay, location_name, longitude, latitude)
ON r.region_code = locations_data.region_code;

-- 3. Insert Holding Companies & Organizational Structure
INSERT INTO scout.holding_companies (name, description) VALUES
('JG Summit Holdings', 'Diversified conglomerate with food, retail, and consumer goods'),
('San Miguel Corporation', 'Food, beverage, and packaging company'),
('Nestlé Philippines', 'Global food and beverage multinational'),
('Unilever Philippines', 'Consumer goods and personal care products'),
('Japan Tobacco International', 'International tobacco company'),
('Procter & Gamble Philippines', 'Consumer goods and personal care');

-- Insert Clients
WITH hc_lookup AS (SELECT id, name FROM scout.holding_companies)
INSERT INTO scout.clients (holding_company_id, name, industry) 
SELECT hc.id, client_name, industry
FROM hc_lookup hc
JOIN (VALUES 
    ('JG Summit Holdings', 'Universal Robina Corporation', 'Food & Beverage'),
    ('JG Summit Holdings', 'Robinsons Retail', 'Retail'),
    ('San Miguel Corporation', 'San Miguel Food and Beverage', 'Food & Beverage'),
    ('Nestlé Philippines', 'Nestlé Philippines Inc.', 'Food & Beverage'),
    ('Unilever Philippines', 'Unilever Philippines Inc.', 'Personal Care'),
    ('Japan Tobacco International', 'JTI Philippines', 'Tobacco'),
    ('Procter & Gamble Philippines', 'P&G Philippines', 'Personal Care')
) AS clients_data(holding_company, client_name, industry)
ON hc.name = clients_data.holding_company;

-- Insert Categories
WITH client_lookup AS (SELECT id, name FROM scout.clients)
INSERT INTO scout.categories (client_id, name, description)
SELECT c.id, category_name, description
FROM client_lookup c
JOIN (VALUES 
    ('Universal Robina Corporation', 'Snacks', 'Potato chips, crackers, and snack foods'),
    ('Universal Robina Corporation', 'Beverages', 'Soft drinks and juice products'),
    ('San Miguel Food and Beverage', 'Beer', 'Alcoholic beverages'),
    ('San Miguel Food and Beverage', 'Dairy', 'Milk and dairy products'),
    ('Nestlé Philippines Inc.', 'Instant Beverages', 'Coffee and chocolate drinks'),
    ('Nestlé Philippines Inc.', 'Dairy', 'Condensed milk and dairy products'),
    ('Unilever Philippines Inc.', 'Personal Care', 'Shampoo, soap, and personal hygiene'),
    ('JTI Philippines', 'Tobacco', 'Cigarettes and tobacco products'),
    ('P&G Philippines', 'Personal Care', 'Shampoo, detergent, and household products')
) AS categories_data(client_name, category_name, description)
ON c.name = categories_data.client_name;

-- Insert Brands
WITH category_lookup AS (
    SELECT c.id, c.name as category_name, cl.name as client_name 
    FROM scout.categories c 
    JOIN scout.clients cl ON c.client_id = cl.id
)
INSERT INTO scout.brands (category_id, name, is_premium)
SELECT cat.id, brand_name, is_premium
FROM category_lookup cat
JOIN (VALUES 
    -- URC Brands
    ('Universal Robina Corporation', 'Snacks', 'Piattos', FALSE),
    ('Universal Robina Corporation', 'Snacks', 'Nova', FALSE),
    ('Universal Robina Corporation', 'Snacks', 'Jack n Jill', FALSE),
    ('Universal Robina Corporation', 'Beverages', 'C2', FALSE),
    ('Universal Robina Corporation', 'Beverages', 'Great Taste', FALSE),
    
    -- SMC Brands
    ('San Miguel Food and Beverage', 'Beer', 'San Miguel', FALSE),
    ('San Miguel Food and Beverage', 'Dairy', 'Magnolia', FALSE),
    
    -- Nestlé Brands
    ('Nestlé Philippines Inc.', 'Instant Beverages', 'Nescafé', TRUE),
    ('Nestlé Philippines Inc.', 'Dairy', 'Carnation', TRUE),
    
    -- Unilever Brands
    ('Unilever Philippines Inc.', 'Personal Care', 'Dove', TRUE),
    ('Unilever Philippines Inc.', 'Personal Care', 'Sunsilk', FALSE),
    ('Unilever Philippines Inc.', 'Personal Care', 'Surf', FALSE),
    
    -- JTI Brands
    ('JTI Philippines', 'Tobacco', 'Winston', FALSE),
    ('JTI Philippines', 'Tobacco', 'Camel', TRUE),
    ('JTI Philippines', 'Tobacco', 'Mevius', TRUE),
    
    -- P&G Brands
    ('P&G Philippines', 'Personal Care', 'Pantene', TRUE),
    ('P&G Philippines', 'Personal Care', 'Head & Shoulders', TRUE),
    ('P&G Philippines', 'Personal Care', 'Tide', TRUE)
) AS brands_data(client_name, category_name, brand_name, is_premium)
ON cat.client_name = brands_data.client_name AND cat.category_name = brands_data.category_name;

-- Insert Products with Realistic Philippine Pricing
WITH brand_lookup AS (
    SELECT b.id, b.name as brand_name, c.name as category_name, cl.name as client_name
    FROM scout.brands b 
    JOIN scout.categories c ON b.category_id = c.id
    JOIN scout.clients cl ON c.client_id = cl.id
)
INSERT INTO scout.products (brand_id, sku, product_name, unit_price, unit_size)
SELECT bl.id, sku, product_name, unit_price, unit_size
FROM brand_lookup bl
JOIN (VALUES 
    -- Piattos Products
    ('Piattos', 'PIATTOS-CHSE-85G', 'Piattos Cheese 85g', '28.50', '85g'),
    ('Piattos', 'PIATTOS-BBQ-85G', 'Piattos BBQ 85g', '28.50', '85g'),
    ('Piattos', 'PIATTOS-SPCY-85G', 'Piattos Spicy 85g', '28.50', '85g'),
    
    -- Nova Products
    ('Nova', 'NOVA-ORIG-78G', 'Nova Original 78g', '18.00', '78g'),
    ('Nova', 'NOVA-BBQ-78G', 'Nova BBQ 78g', '18.00', '78g'),
    
    -- Jack n Jill Products
    ('Jack n Jill', 'JNJ-POTATO-60G', 'Jack n Jill Potato Chips 60g', '22.50', '60g'),
    ('Jack n Jill', 'JNJ-CHICHARON-90G', 'Chicharon ni Mang Juan 90g', '35.00', '90g'),
    
    -- C2 Products
    ('C2', 'C2-APPLE-230ML', 'C2 Apple 230ml', '15.00', '230ml'),
    ('C2', 'C2-LEMON-230ML', 'C2 Lemon 230ml', '15.00', '230ml'),
    
    -- Great Taste Products
    ('Great Taste', 'GT-COFFEE-30G', 'Great Taste Coffee 30g', '12.50', '30g'),
    ('Great Taste', 'GT-WHITE-25G', 'Great Taste White 25g', '10.00', '25g'),
    
    -- San Miguel Products
    ('San Miguel', 'SMB-PILSEN-330ML', 'San Miguel Pilsen 330ml', '45.00', '330ml'),
    ('San Miguel', 'SMB-LIGHT-330ML', 'San Miguel Light 330ml', '45.00', '330ml'),
    
    -- Magnolia Products
    ('Magnolia', 'MAG-MILK-1L', 'Magnolia Fresh Milk 1L', '95.00', '1L'),
    ('Magnolia', 'MAG-CHOCO-236ML', 'Magnolia Chocolait 236ml', '25.00', '236ml'),
    
    -- Nescafé Products
    ('Nescafé', 'NESCAFE-ORIG-50G', 'Nescafé Original 50g', '125.00', '50g'),
    ('Nescafé', 'NESCAFE-DECAF-50G', 'Nescafé Decaf 50g', '135.00', '50g'),
    
    -- Carnation Products
    ('Carnation', 'CARN-EVAP-410ML', 'Carnation Evaporated Milk 410ml', '48.50', '410ml'),
    ('Carnation', 'CARN-COND-300ML', 'Carnation Condensed Milk 300ml', '42.00', '300ml'),
    
    -- Dove Products
    ('Dove', 'DOVE-SOAP-135G', 'Dove Beauty Bar 135g', '85.00', '135g'),
    ('Dove', 'DOVE-SHMP-340ML', 'Dove Shampoo 340ml', '175.00', '340ml'),
    
    -- Sunsilk Products
    ('Sunsilk', 'SUNSILK-SHMP-340ML', 'Sunsilk Shampoo 340ml', '89.50', '340ml'),
    ('Sunsilk', 'SUNSILK-COND-340ML', 'Sunsilk Conditioner 340ml', '89.50', '340ml'),
    
    -- Surf Products
    ('Surf', 'SURF-POWDER-1KG', 'Surf Detergent Powder 1kg', '68.00', '1kg'),
    ('Surf', 'SURF-LIQUID-1L', 'Surf Liquid Detergent 1L', '125.00', '1L'),
    
    -- Winston Products
    ('Winston', 'WINSTON-RED-20S', 'Winston Red 20s', '130.00', '20 sticks'),
    ('Winston', 'WINSTON-BLUE-20S', 'Winston Blue 20s', '130.00', '20 sticks'),
    
    -- Camel Products
    ('Camel', 'CAMEL-YELLOW-20S', 'Camel Yellow 20s', '140.00', '20 sticks'),
    ('Camel', 'CAMEL-BLUE-20S', 'Camel Blue 20s', '140.00', '20 sticks'),
    
    -- Mevius Products
    ('Mevius', 'MEVIUS-GOLD-20S', 'Mevius Gold 20s', '150.00', '20 sticks'),
    ('Mevius', 'MEVIUS-BLUE-20S', 'Mevius Blue 20s', '150.00', '20 sticks'),
    
    -- Pantene Products
    ('Pantene', 'PANTENE-SHMP-340ML', 'Pantene Shampoo 340ml', '189.00', '340ml'),
    ('Pantene', 'PANTENE-COND-340ML', 'Pantene Conditioner 340ml', '189.00', '340ml'),
    
    -- Head & Shoulders Products
    ('Head & Shoulders', 'HS-SHMP-340ML', 'Head & Shoulders Shampoo 340ml', '195.00', '340ml'),
    ('Head & Shoulders', 'HS-COND-340ML', 'Head & Shoulders Conditioner 340ml', '195.00', '340ml'),
    
    -- Tide Products
    ('Tide', 'TIDE-POWDER-1KG', 'Tide Detergent Powder 1kg', '185.00', '1kg'),
    ('Tide', 'TIDE-LIQUID-1L', 'Tide Liquid Detergent 1L', '295.00', '1L')
) AS products_data(brand_name, sku, product_name, unit_price, unit_size)
ON bl.brand_name = products_data.brand_name;

-- Insert Consumers with Realistic Demographics
INSERT INTO scout.consumers (gender, age_bracket, location_id, is_frequent_shopper)
SELECT 
    CASE 
        WHEN random() < 0.52 THEN 'F'  -- 52% female (Philippine census)
        WHEN random() < 0.48 THEN 'M'  -- 48% male
        ELSE 'O'  -- 0.1% other
    END as gender,
    CASE 
        WHEN random() < 0.22 THEN '18-24'
        WHEN random() < 0.28 THEN '25-34'
        WHEN random() < 0.25 THEN '35-44'
        WHEN random() < 0.15 THEN '45-54'
        ELSE '55+'
    END as age_bracket,
    (SELECT id FROM scout.locations ORDER BY random() LIMIT 1) as location_id,
    random() < 0.35 as is_frequent_shopper  -- 35% frequent shoppers
FROM generate_series(1, 5000);  -- Generate 5000 consumers

-- Generate Realistic Transactions (Last 12 Months)
INSERT INTO scout.transactions (
    transaction_date,
    location_id,
    consumer_id,
    duration_seconds,
    total_units,
    total_value,
    payment_method,
    is_weekend,
    time_category
)
SELECT 
    -- Generate random dates in the last 12 months
    NOW() - INTERVAL '365 days' + (random() * INTERVAL '365 days') as transaction_date,
    (SELECT id FROM scout.locations ORDER BY random() LIMIT 1) as location_id,
    CASE WHEN random() < 0.7 THEN (SELECT id FROM scout.consumers ORDER BY random() LIMIT 1) ELSE NULL END as consumer_id,
    30 + (random() * 270)::INTEGER as duration_seconds,  -- 30-300 seconds
    (1 + random() * 19)::INTEGER as total_units,  -- 1-20 units
    0 as total_value,  -- Will be calculated from items
    CASE 
        WHEN random() < 0.85 THEN 'Cash'
        WHEN random() < 0.12 THEN 'GCash'
        ELSE 'Card'
    END as payment_method,
    EXTRACT(DOW FROM (NOW() - INTERVAL '365 days' + (random() * INTERVAL '365 days'))) IN (0, 6) as is_weekend,
    CASE 
        WHEN EXTRACT(HOUR FROM (NOW() - INTERVAL '365 days' + (random() * INTERVAL '365 days'))) BETWEEN 6 AND 11 THEN 'Morning'
        WHEN EXTRACT(HOUR FROM (NOW() - INTERVAL '365 days' + (random() * INTERVAL '365 days'))) BETWEEN 12 AND 17 THEN 'Afternoon'
        WHEN EXTRACT(HOUR FROM (NOW() - INTERVAL '365 days' + (random() * INTERVAL '365 days'))) BETWEEN 18 AND 21 THEN 'Evening'
        ELSE 'Night'
    END as time_category
FROM generate_series(1, 50000);  -- Generate 50,000 transactions

-- Generate Transaction Items
INSERT INTO scout.transaction_items (
    transaction_id,
    product_id,
    quantity,
    unit_price,
    total_price,
    was_substituted,
    original_product_id,
    request_method
)
SELECT 
    t.id as transaction_id,
    p.id as product_id,
    (1 + random() * 4)::INTEGER as quantity,  -- 1-5 quantity per item
    p.unit_price,
    p.unit_price * (1 + random() * 4)::INTEGER as total_price,
    random() < 0.15 as was_substituted,  -- 15% substitution rate
    CASE 
        WHEN random() < 0.15 THEN (
            SELECT id FROM scout.products p2 
            WHERE p2.brand_id != p.brand_id 
            AND p2.id IN (
                SELECT p3.id FROM scout.products p3
                JOIN scout.brands b3 ON p3.brand_id = b3.id
                JOIN scout.categories c3 ON b3.category_id = c3.id
                WHERE c3.id = (
                    SELECT c.id FROM scout.categories c
                    JOIN scout.brands b ON c.id = b.category_id
                    WHERE b.id = p.brand_id
                )
            )
            ORDER BY random() LIMIT 1
        )
        ELSE NULL 
    END as original_product_id,
    (ARRAY['Branded', 'Category', 'Pointing', 'Verbal', 'Indirect', 'Suggestion'])[floor(random() * 6 + 1)] as request_method
FROM scout.transactions t
CROSS JOIN LATERAL (
    SELECT id, unit_price, brand_id
    FROM scout.products
    ORDER BY random()
    LIMIT (1 + random() * 8)::INTEGER  -- 1-9 items per transaction
) p;

-- Update transaction totals
UPDATE scout.transactions 
SET 
    total_value = coalesce(item_totals.total, 0),
    total_units = coalesce(item_totals.units, 0)
FROM (
    SELECT 
        ti.transaction_id,
        SUM(ti.total_price) as total,
        SUM(ti.quantity) as units
    FROM scout.transaction_items ti
    GROUP BY ti.transaction_id
) item_totals
WHERE scout.transactions.id = item_totals.transaction_id;

-- Generate AI Suggestions
INSERT INTO scout.ai_suggestions (transaction_id, suggested_product_id, suggestion_type, was_accepted, confidence_score)
SELECT 
    t.id as transaction_id,
    (SELECT id FROM scout.products ORDER BY random() LIMIT 1) as suggested_product_id,
    (ARRAY['Cross-sell', 'Upsell', 'Substitute', 'Bundle'])[floor(random() * 4 + 1)] as suggestion_type,
    random() < 0.25 as was_accepted,  -- 25% acceptance rate
    (0.5 + random() * 0.5)::DECIMAL(3,2) as confidence_score  -- 0.5-1.0 confidence
FROM scout.transactions t
WHERE random() < 0.3;  -- 30% of transactions get AI suggestions

-- Generate System Health Metrics
INSERT INTO scout.system_health (metric_name, metric_value, metric_unit, timestamp)
SELECT 
    metric_name,
    metric_value,
    metric_unit,
    NOW() - INTERVAL '1 hour' * generate_series(0, 23)
FROM (VALUES 
    ('CPU Usage', 45.2, '%'),
    ('Memory Usage', 67.8, '%'),
    ('Database Connections', 12, 'connections'),
    ('Response Time', 285, 'ms'),
    ('Active Users', 156, 'users'),
    ('Error Rate', 0.8, '%')
) AS metrics(metric_name, metric_value, metric_unit);

-- Generate Alerts
INSERT INTO scout.alerts (alert_type, title, message, severity, is_read)
VALUES 
    ('System', 'High Transaction Volume', 'Unusual spike in transactions detected in NCR region', 'Medium', FALSE),
    ('Business', 'Low Stock Alert', 'Winston Red running low in Cebu locations', 'High', FALSE),
    ('Performance', 'Slow Query Detected', 'Analytics query taking longer than usual', 'Low', TRUE),
    ('Security', 'Multiple Failed Logins', 'Suspicious login attempts detected', 'High', FALSE),
    ('Business', 'High Substitution Rate', 'Camel Blue substitution rate above 40% in Davao', 'Medium', FALSE);

-- Refresh the materialized view
REFRESH MATERIALIZED VIEW scout.hourly_sales_summary;

-- Create trigger to automatically refresh materialized view
CREATE OR REPLACE FUNCTION scout.refresh_sales_summary_trigger()
RETURNS TRIGGER AS $$
BEGIN
    -- Schedule refresh for later to avoid blocking
    PERFORM pg_notify('refresh_sales_summary', '');
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_refresh_sales_summary
    AFTER INSERT OR UPDATE OR DELETE ON scout.transactions
    FOR EACH STATEMENT
    EXECUTE FUNCTION scout.refresh_sales_summary_trigger();
