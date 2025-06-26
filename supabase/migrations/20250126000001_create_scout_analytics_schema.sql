
-- Scout Analytics Complete Database Schema
-- Created: 2025-01-26
-- Description: Comprehensive database schema for Scout Analytics Dashboard

-- Enable PostGIS extension for geographic data
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create scout schema
CREATE SCHEMA IF NOT EXISTS scout;

-- 1. Geography/Location Tables
CREATE TABLE scout.regions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_code VARCHAR(20) NOT NULL UNIQUE,
    region_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    region_id UUID REFERENCES scout.regions(id),
    city VARCHAR(100) NOT NULL,
    municipality VARCHAR(100),
    barangay VARCHAR(100) NOT NULL,
    location_name VARCHAR(150),
    coordinates GEOGRAPHY(POINT, 4326),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Organization Structure
CREATE TABLE scout.holding_companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    holding_company_id UUID REFERENCES scout.holding_companies(id),
    name VARCHAR(100) NOT NULL,
    industry VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID REFERENCES scout.clients(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.brands (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES scout.categories(id),
    name VARCHAR(100) NOT NULL,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    brand_id UUID REFERENCES scout.brands(id),
    sku VARCHAR(150) NOT NULL UNIQUE,
    product_name VARCHAR(200) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    unit_size VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Consumer Demographics
CREATE TABLE scout.consumers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gender VARCHAR(1) CHECK (gender IN ('M', 'F', 'O')),
    age_bracket VARCHAR(10) CHECK (age_bracket IN ('18-24', '25-34', '35-44', '45-54', '55+')),
    location_id UUID REFERENCES scout.locations(id),
    is_frequent_shopper BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 4. Transaction Tables
CREATE TABLE scout.transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_date TIMESTAMP NOT NULL,
    location_id UUID REFERENCES scout.locations(id) NOT NULL,
    consumer_id UUID REFERENCES scout.consumers(id),
    duration_seconds INTEGER,
    total_units INTEGER NOT NULL DEFAULT 0,
    total_value DECIMAL(15,2) NOT NULL DEFAULT 0,
    payment_method VARCHAR(20) DEFAULT 'Cash',
    is_weekend BOOLEAN DEFAULT FALSE,
    time_category VARCHAR(20) CHECK (time_category IN ('Morning', 'Afternoon', 'Evening', 'Night')),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.transaction_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES scout.transactions(id) NOT NULL,
    product_id UUID REFERENCES scout.products(id) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    was_substituted BOOLEAN DEFAULT FALSE,
    original_product_id UUID REFERENCES scout.products(id),
    request_method VARCHAR(20) CHECK (request_method IN ('Branded', 'Category', 'Pointing', 'Verbal', 'Indirect', 'Suggestion')),
    created_at TIMESTAMP DEFAULT NOW()
);

-- 5. AI & Analytics Tables
CREATE TABLE scout.ai_suggestions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID REFERENCES scout.transactions(id),
    suggested_product_id UUID REFERENCES scout.products(id),
    suggestion_type VARCHAR(50),
    was_accepted BOOLEAN DEFAULT FALSE,
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.substitution_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    original_product_id UUID REFERENCES scout.products(id),
    substitute_product_id UUID REFERENCES scout.products(id),
    location_id UUID REFERENCES scout.locations(id),
    frequency_count INTEGER DEFAULT 1,
    substitution_reason VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 6. System & Monitoring Tables
CREATE TABLE scout.user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100),
    session_start TIMESTAMP DEFAULT NOW(),
    session_end TIMESTAMP,
    page_views INTEGER DEFAULT 0,
    filters_applied JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE scout.system_health (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value DECIMAL(10,2) NOT NULL,
    metric_unit VARCHAR(20),
    timestamp TIMESTAMP DEFAULT NOW()
);

-- 7. Alerts & Notifications
CREATE TABLE scout.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT,
    severity VARCHAR(20) CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX idx_locations_region ON scout.locations(region_id);
CREATE INDEX idx_locations_coordinates ON scout.locations USING GIST(coordinates);
CREATE INDEX idx_products_brand ON scout.products(brand_id);
CREATE INDEX idx_products_sku ON scout.products(sku);
CREATE INDEX idx_transactions_date ON scout.transactions(transaction_date);
CREATE INDEX idx_transactions_location ON scout.transactions(location_id);
CREATE INDEX idx_transactions_consumer ON scout.transactions(consumer_id);
CREATE INDEX idx_transaction_items_transaction ON scout.transaction_items(transaction_id);
CREATE INDEX idx_transaction_items_product ON scout.transaction_items(product_id);
CREATE INDEX idx_substitution_patterns_original ON scout.substitution_patterns(original_product_id);

-- Create Materialized View for Analytics
CREATE MATERIALIZED VIEW scout.hourly_sales_summary AS
SELECT 
    DATE_TRUNC('hour', t.transaction_date) as hour,
    l.barangay,
    l.city,
    r.region_name,
    b.name as brand_name,
    c.name as category_name,
    COUNT(t.id) as transaction_count,
    SUM(t.total_value) as total_sales,
    AVG(t.total_value) as avg_transaction_value,
    SUM(t.total_units) as total_units
FROM scout.transactions t
JOIN scout.locations l ON t.location_id = l.id
JOIN scout.regions r ON l.region_id = r.id
JOIN scout.transaction_items ti ON t.id = ti.transaction_id
JOIN scout.products p ON ti.product_id = p.id
JOIN scout.brands b ON p.brand_id = b.id
JOIN scout.categories c ON b.category_id = c.id
GROUP BY 
    DATE_TRUNC('hour', t.transaction_date),
    l.barangay, l.city, r.region_name,
    b.name, c.name;

-- Create unique index on materialized view
CREATE UNIQUE INDEX idx_hourly_sales_summary_unique 
ON scout.hourly_sales_summary(hour, barangay, city, region_name, brand_name, category_name);

-- Enable Row Level Security (RLS)
ALTER TABLE scout.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout.transaction_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout.consumers ENABLE ROW LEVEL SECURITY;
ALTER TABLE scout.ai_suggestions ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies (basic read access for authenticated users)
CREATE POLICY "Enable read access for authenticated users" ON scout.transactions
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON scout.transaction_items
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON scout.consumers
    FOR SELECT USING (auth.role() = 'authenticated');

-- Create Functions for Analytics
CREATE OR REPLACE FUNCTION scout.get_sales_by_period(
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    region_filter TEXT DEFAULT NULL,
    category_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    period_date DATE,
    total_sales DECIMAL(15,2),
    transaction_count BIGINT,
    avg_transaction_value DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.transaction_date::DATE as period_date,
        SUM(t.total_value) as total_sales,
        COUNT(t.id) as transaction_count,
        AVG(t.total_value) as avg_transaction_value
    FROM scout.transactions t
    JOIN scout.locations l ON t.location_id = l.id
    JOIN scout.regions r ON l.region_id = r.id
    JOIN scout.transaction_items ti ON t.id = ti.transaction_id
    JOIN scout.products p ON ti.product_id = p.id
    JOIN scout.brands b ON p.brand_id = b.id
    JOIN scout.categories c ON b.category_id = c.id
    WHERE 
        t.transaction_date BETWEEN start_date AND end_date
        AND (region_filter IS NULL OR r.region_name = region_filter)
        AND (category_filter IS NULL OR c.name = category_filter)
    GROUP BY t.transaction_date::DATE
    ORDER BY period_date;
END;
$$ LANGUAGE plpgsql;

-- Refresh materialized view function
CREATE OR REPLACE FUNCTION scout.refresh_hourly_sales()
RETURNS VOID AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY scout.hourly_sales_summary;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT USAGE ON SCHEMA scout TO anon, authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA scout TO anon, authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA scout TO anon, authenticated;
