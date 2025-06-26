
-- FMCG Sari-Sari Store Complete Schema
-- Philippine Market with 17/18 Regions and Competitors

-- 1. Geography Hierarchy (Official PSA Structure)
CREATE TABLE scout.geography_regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_code VARCHAR(20) NOT NULL UNIQUE,
    region_name VARCHAR(100) NOT NULL,
    population INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.geography_provinces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_id UUID REFERENCES scout.geography_regions(id),
    province_code VARCHAR(20) NOT NULL,
    province_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.geography_cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    province_id UUID REFERENCES scout.geography_provinces(id),
    city_code VARCHAR(20) NOT NULL,
    city_name VARCHAR(100) NOT NULL,
    city_type VARCHAR(20) DEFAULT 'City', -- City, Municipality
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.geography_barangays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID REFERENCES scout.geography_cities(id),
    barangay_code VARCHAR(20) NOT NULL,
    barangay_name VARCHAR(100) NOT NULL,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    population INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. FMCG Brands & Products (Client Companies + Competitors)
CREATE TABLE scout.fmcg_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(150) NOT NULL,
    company_type VARCHAR(50) DEFAULT 'Competitor', -- Client, Competitor
    market_position VARCHAR(20) DEFAULT 'Local', -- MNC, Local, Regional
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.fmcg_brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID REFERENCES scout.fmcg_companies(id),
    brand_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) NOT NULL,
    sub_category VARCHAR(50),
    market_tier VARCHAR(20) DEFAULT 'Mass', -- Premium, Mass, Economy
    is_client_brand BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.fmcg_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES scout.fmcg_brands(id),
    sku VARCHAR(150) NOT NULL UNIQUE,
    product_name VARCHAR(200) NOT NULL,
    pack_size VARCHAR(50),
    unit_of_measure VARCHAR(20),
    srp DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    margin_percent DECIMAL(5,2),
    is_active BOOLEAN DEFAULT TRUE,
    launch_date DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 3. Sari-Sari Stores
CREATE TABLE scout.sari_stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    barangay_id UUID REFERENCES scout.geography_barangays(id),
    store_name VARCHAR(150) NOT NULL,
    owner_name VARCHAR(100),
    store_type VARCHAR(50) DEFAULT 'Sari-Sari', -- Sari-Sari, Mini-Mart, Convenience
    store_size VARCHAR(20) DEFAULT 'Small', -- Small, Medium, Large
    has_refrigerator BOOLEAN DEFAULT FALSE,
    monthly_revenue_estimate DECIMAL(12,2),
    established_year INTEGER,
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Enhanced Transaction Tables
CREATE TABLE scout.fmcg_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES scout.sari_stores(id),
    transaction_date TIMESTAMP NOT NULL,
    transaction_time TIME NOT NULL,
    day_of_week VARCHAR(10),
    is_weekend BOOLEAN DEFAULT FALSE,
    weather_condition VARCHAR(20), -- Sunny, Rainy, Cloudy
    customer_type VARCHAR(20) DEFAULT 'Regular', -- Regular, Tourist, Worker
    total_items INTEGER DEFAULT 0,
    total_amount DECIMAL(12,2) DEFAULT 0,
    payment_method VARCHAR(20) DEFAULT 'Cash', -- Cash, GCash, Card
    transaction_duration_seconds INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.fmcg_transaction_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES scout.fmcg_transactions(id),
    product_id UUID REFERENCES scout.fmcg_products(id),
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    was_substituted BOOLEAN DEFAULT FALSE,
    original_product_id UUID REFERENCES scout.fmcg_products(id),
    substitution_reason VARCHAR(100),
    purchase_motivation VARCHAR(50), -- Branded, Generic, Price, Availability
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. Market Intelligence Tables
CREATE TABLE scout.competitor_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES scout.fmcg_brands(id),
    competitor_brand_id UUID REFERENCES scout.fmcg_brands(id),
    market_share_percent DECIMAL(5,2),
    price_positioning VARCHAR(20), -- Higher, Same, Lower
    analysis_period DATE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.regional_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_id UUID REFERENCES scout.geography_regions(id),
    category VARCHAR(50),
    brand_id UUID REFERENCES scout.fmcg_brands(id),
    preference_score DECIMAL(5,2), -- 1-10 scale
    seasonal_factor DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 6. Performance Indexes
CREATE INDEX idx_fmcg_transactions_date ON scout.fmcg_transactions(transaction_date);
CREATE INDEX idx_fmcg_transactions_store ON scout.fmcg_transactions(store_id);
CREATE INDEX idx_fmcg_transaction_items_product ON scout.fmcg_transaction_items(product_id);
CREATE INDEX idx_fmcg_transaction_items_transaction ON scout.fmcg_transaction_items(transaction_id);
CREATE INDEX idx_geography_barangays_coordinates ON scout.geography_barangays(latitude, longitude);
CREATE INDEX idx_sari_stores_barangay ON scout.sari_stores(barangay_id);
CREATE INDEX idx_fmcg_products_brand ON scout.fmcg_products(brand_id);
CREATE INDEX idx_fmcg_products_sku ON scout.fmcg_products(sku);

-- Enable RLS
ALTER TABLE scout.fmcg_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout.fmcg_transaction_items ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Enable read access for authenticated users" ON scout.fmcg_transactions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON scout.fmcg_transaction_items
    FOR SELECT USING (auth.role() = 'authenticated');

-- Grant permissions
GRANT USAGE ON SCHEMA scout TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA scout TO anon, authenticated;
