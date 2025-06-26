
-- Scout Analytics Functions
-- Advanced analytics and reporting functions

-- 1. Get KPI Summary
CREATE OR REPLACE FUNCTION scout.get_kpi_summary(
    start_date TIMESTAMP DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP DEFAULT NOW(),
    region_filter TEXT DEFAULT NULL,
    category_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    total_sales DECIMAL(15,2),
    total_transactions BIGINT,
    avg_basket_value DECIMAL(10,2),
    growth_rate DECIMAL(5,2)
) AS $$
DECLARE
    prev_period_sales DECIMAL(15,2);
    current_period_sales DECIMAL(15,2);
BEGIN
    -- Current period sales
    SELECT COALESCE(SUM(t.total_value), 0)
    INTO current_period_sales
    FROM scout.transactions t
    JOIN scout.locations l ON t.location_id = l.id
    JOIN scout.regions r ON l.region_id = r.id
    LEFT JOIN scout.transaction_items ti ON t.id = ti.transaction_id
    LEFT JOIN scout.products p ON ti.product_id = p.id
    LEFT JOIN scout.brands b ON p.brand_id = b.id
    LEFT JOIN scout.categories c ON b.category_id = c.id
    WHERE 
        t.transaction_date BETWEEN start_date AND end_date
        AND (region_filter IS NULL OR r.region_name ILIKE '%' || region_filter || '%')
        AND (category_filter IS NULL OR c.name ILIKE '%' || category_filter || '%');
    
    -- Previous period sales (same duration)
    SELECT COALESCE(SUM(t.total_value), 0)
    INTO prev_period_sales
    FROM scout.transactions t
    JOIN scout.locations l ON t.location_id = l.id
    JOIN scout.regions r ON l.region_id = r.id
    LEFT JOIN scout.transaction_items ti ON t.id = ti.transaction_id
    LEFT JOIN scout.products p ON ti.product_id = p.id
    LEFT JOIN scout.brands b ON p.brand_id = b.id
    LEFT JOIN scout.categories c ON b.category_id = c.id
    WHERE 
        t.transaction_date BETWEEN (start_date - (end_date - start_date)) AND start_date
        AND (region_filter IS NULL OR r.region_name ILIKE '%' || region_filter || '%')
        AND (category_filter IS NULL OR c.name ILIKE '%' || category_filter || '%');
    
    RETURN QUERY
    SELECT 
        COALESCE(SUM(t.total_value), 0) as total_sales,
        COUNT(t.id) as total_transactions,
        COALESCE(AVG(t.total_value), 0) as avg_basket_value,
        CASE 
            WHEN prev_period_sales > 0 THEN 
                ((current_period_sales - prev_period_sales) / prev_period_sales * 100)::DECIMAL(5,2)
            ELSE 0
        END as growth_rate
    FROM scout.transactions t
    JOIN scout.locations l ON t.location_id = l.id
    JOIN scout.regions r ON l.region_id = r.id
    LEFT JOIN scout.transaction_items ti ON t.id = ti.transaction_id
    LEFT JOIN scout.products p ON ti.product_id = p.id
    LEFT JOIN scout.brands b ON p.brand_id = b.id
    LEFT JOIN scout.categories c ON b.category_id = c.id
    WHERE 
        t.transaction_date BETWEEN start_date AND end_date
        AND (region_filter IS NULL OR r.region_name ILIKE '%' || region_filter || '%')
        AND (category_filter IS NULL OR c.name ILIKE '%' || category_filter || '%');
END;
$$ LANGUAGE plpgsql;

-- 2. Get Top Products
CREATE OR REPLACE FUNCTION scout.get_top_products(
    limit_count INTEGER DEFAULT 10,
    start_date TIMESTAMP DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP DEFAULT NOW(),
    region_filter TEXT DEFAULT NULL,
    category_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    product_name TEXT,
    brand_name TEXT,
    category_name TEXT,
    total_sales DECIMAL(15,2),
    total_quantity BIGINT,
    avg_price DECIMAL(10,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.product_name::TEXT,
        b.name::TEXT as brand_name,
        c.name::TEXT as category_name,
        SUM(ti.total_price) as total_sales,
        SUM(ti.quantity) as total_quantity,
        AVG(ti.unit_price) as avg_price
    FROM scout.transaction_items ti
    JOIN scout.products p ON ti.product_id = p.id
    JOIN scout.brands b ON p.brand_id = b.id
    JOIN scout.categories c ON b.category_id = c.id
    JOIN scout.transactions t ON ti.transaction_id = t.id
    JOIN scout.locations l ON t.location_id = l.id
    JOIN scout.regions r ON l.region_id = r.id
    WHERE 
        t.transaction_date BETWEEN start_date AND end_date
        AND (region_filter IS NULL OR r.region_name ILIKE '%' || region_filter || '%')
        AND (category_filter IS NULL OR c.name ILIKE '%' || category_filter || '%')
    GROUP BY p.product_name, b.name, c.name
    ORDER BY total_sales DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 3. Get Regional Performance
CREATE OR REPLACE FUNCTION scout.get_regional_performance(
    start_date TIMESTAMP DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP DEFAULT NOW()
)
RETURNS TABLE (
    region_name TEXT,
    city TEXT,
    total_sales DECIMAL(15,2),
    transaction_count BIGINT,
    avg_transaction_value DECIMAL(10,2),
    top_category TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH regional_sales AS (
        SELECT 
            r.region_name,
            l.city,
            SUM(t.total_value) as total_sales,
            COUNT(t.id) as transaction_count,
            AVG(t.total_value) as avg_transaction_value
        FROM scout.transactions t
        JOIN scout.locations l ON t.location_id = l.id
        JOIN scout.regions r ON l.region_id = r.id
        WHERE t.transaction_date BETWEEN start_date AND end_date
        GROUP BY r.region_name, l.city
    ),
    top_categories AS (
        SELECT DISTINCT ON (r.region_name, l.city)
            r.region_name,
            l.city,
            c.name as category_name
        FROM scout.transactions t
        JOIN scout.locations l ON t.location_id = l.id
        JOIN scout.regions r ON l.region_id = r.id
        JOIN scout.transaction_items ti ON t.id = ti.transaction_id
        JOIN scout.products p ON ti.product_id = p.id
        JOIN scout.brands b ON p.brand_id = b.id
        JOIN scout.categories c ON b.category_id = c.id
        WHERE t.transaction_date BETWEEN start_date AND end_date
        GROUP BY r.region_name, l.city, c.name
        ORDER BY r.region_name, l.city, SUM(ti.total_price) DESC
    )
    SELECT 
        rs.region_name::TEXT,
        rs.city::TEXT,
        rs.total_sales,
        rs.transaction_count,
        rs.avg_transaction_value,
        COALESCE(tc.category_name, 'N/A')::TEXT as top_category
    FROM regional_sales rs
    LEFT JOIN top_categories tc ON rs.region_name = tc.region_name AND rs.city = tc.city
    ORDER BY rs.total_sales DESC;
END;
$$ LANGUAGE plpgsql;

-- 4. Get Substitution Analysis
CREATE OR REPLACE FUNCTION scout.get_substitution_analysis(
    start_date TIMESTAMP DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP DEFAULT NOW()
)
RETURNS TABLE (
    original_product TEXT,
    substitute_product TEXT,
    substitution_count BIGINT,
    substitution_rate DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH substitution_data AS (
        SELECT 
            orig_p.product_name as original_product,
            sub_p.product_name as substitute_product,
            COUNT(*) as substitution_count,
            COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (PARTITION BY orig_p.product_name) as substitution_rate
        FROM scout.transaction_items ti
        JOIN scout.products sub_p ON ti.product_id = sub_p.id
        JOIN scout.products orig_p ON ti.original_product_id = orig_p.id
        JOIN scout.transactions t ON ti.transaction_id = t.id
        WHERE 
            ti.was_substituted = TRUE
            AND ti.original_product_id IS NOT NULL
            AND t.transaction_date BETWEEN start_date AND end_date
        GROUP BY orig_p.product_name, sub_p.product_name
    )
    SELECT 
        sd.original_product::TEXT,
        sd.substitute_product::TEXT,
        sd.substitution_count,
        sd.substitution_rate::DECIMAL(5,2)
    FROM substitution_data sd
    ORDER BY sd.substitution_count DESC;
END;
$$ LANGUAGE plpgsql;

-- 5. Get Consumer Behavior Analysis
CREATE OR REPLACE FUNCTION scout.get_consumer_behavior(
    start_date TIMESTAMP DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP DEFAULT NOW()
)
RETURNS TABLE (
    request_method TEXT,
    count BIGINT,
    percentage DECIMAL(5,2),
    avg_acceptance_rate DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH behavior_data AS (
        SELECT 
            ti.request_method,
            COUNT(*) as count,
            COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percentage
        FROM scout.transaction_items ti
        JOIN scout.transactions t ON ti.transaction_id = t.id
        WHERE 
            t.transaction_date BETWEEN start_date AND end_date
            AND ti.request_method IS NOT NULL
        GROUP BY ti.request_method
    ),
    acceptance_rates AS (
        SELECT 
            ti.request_method,
            AVG(CASE WHEN ai.was_accepted THEN 100.0 ELSE 0.0 END) as avg_acceptance_rate
        FROM scout.transaction_items ti
        JOIN scout.transactions t ON ti.transaction_id = t.id
        LEFT JOIN scout.ai_suggestions ai ON t.id = ai.transaction_id
        WHERE t.transaction_date BETWEEN start_date AND end_date
        GROUP BY ti.request_method
    )
    SELECT 
        bd.request_method::TEXT,
        bd.count,
        bd.percentage::DECIMAL(5,2),
        COALESCE(ar.avg_acceptance_rate, 0)::DECIMAL(5,2)
    FROM behavior_data bd
    LEFT JOIN acceptance_rates ar ON bd.request_method = ar.request_method
    ORDER BY bd.count DESC;
END;
$$ LANGUAGE plpgsql;

-- 6. Get Time Series Data
CREATE OR REPLACE FUNCTION scout.get_transaction_trends(
    period_type TEXT DEFAULT 'daily', -- 'hourly', 'daily', 'weekly', 'monthly'
    start_date TIMESTAMP DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP DEFAULT NOW(),
    region_filter TEXT DEFAULT NULL,
    category_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    time_period TIMESTAMP,
    sales_amount DECIMAL(15,2),
    transaction_count BIGINT,
    avg_transaction_value DECIMAL(10,2)
) AS $$
DECLARE
    date_trunc_param TEXT;
BEGIN
    -- Set date truncation parameter based on period type
    CASE period_type
        WHEN 'hourly' THEN date_trunc_param := 'hour';
        WHEN 'daily' THEN date_trunc_param := 'day';
        WHEN 'weekly' THEN date_trunc_param := 'week';
        WHEN 'monthly' THEN date_trunc_param := 'month';
        ELSE date_trunc_param := 'day';
    END CASE;
    
    RETURN QUERY
    EXECUTE format('
        SELECT 
            DATE_TRUNC(%L, t.transaction_date) as time_period,
            SUM(t.total_value) as sales_amount,
            COUNT(t.id) as transaction_count,
            AVG(t.total_value) as avg_transaction_value
        FROM scout.transactions t
        JOIN scout.locations l ON t.location_id = l.id
        JOIN scout.regions r ON l.region_id = r.id
        LEFT JOIN scout.transaction_items ti ON t.id = ti.transaction_id
        LEFT JOIN scout.products p ON ti.product_id = p.id
        LEFT JOIN scout.brands b ON p.brand_id = b.id
        LEFT JOIN scout.categories c ON b.category_id = c.id
        WHERE 
            t.transaction_date BETWEEN $1 AND $2
            AND ($3 IS NULL OR r.region_name ILIKE ''%%'' || $3 || ''%%'')
            AND ($4 IS NULL OR c.name ILIKE ''%%'' || $4 || ''%%'')
        GROUP BY DATE_TRUNC(%L, t.transaction_date)
        ORDER BY time_period
    ', date_trunc_param, date_trunc_param)
    USING start_date, end_date, region_filter, category_filter;
END;
$$ LANGUAGE plpgsql;

-- 7. Get AI Insights
CREATE OR REPLACE FUNCTION scout.get_ai_insights(
    start_date TIMESTAMP DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP DEFAULT NOW()
)
RETURNS TABLE (
    insight_type TEXT,
    insight_title TEXT,
    insight_description TEXT,
    confidence_score DECIMAL(3,2),
    priority TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH insights AS (
        -- Peak hour analysis
        SELECT 
            'Peak Hours' as insight_type,
            'Optimize Staff Scheduling' as insight_title,
            'Peak transaction hours: ' || 
            string_agg(EXTRACT(hour FROM transaction_date)::TEXT, ', ' ORDER BY COUNT(*) DESC) ||
            ' - Consider increasing staff during these hours' as insight_description,
            0.95 as confidence_score,
            'High' as priority
        FROM (
            SELECT transaction_date, COUNT(*) as transaction_count
            FROM scout.transactions
            WHERE transaction_date BETWEEN start_date AND end_date
            GROUP BY EXTRACT(hour FROM transaction_date), transaction_date
            ORDER BY COUNT(*) DESC
            LIMIT 3
        ) peak_hours
        
        UNION ALL
        
        -- Product bundling opportunities
        SELECT 
            'Product Bundling' as insight_type,
            'Cross-sell Opportunities' as insight_title,
            'Products frequently bought together: ' || 
            string_agg(bundle_products, ' + ' ORDER BY bundle_frequency DESC) ||
            ' - Consider creating product bundles' as insight_description,
            0.87 as confidence_score,
            'Medium' as priority
        FROM (
            SELECT 
                t.id,
                string_agg(p.product_name, ' + ') as bundle_products,
                COUNT(*) as bundle_frequency
            FROM scout.transactions t
            JOIN scout.transaction_items ti ON t.id = ti.transaction_id
            JOIN scout.products p ON ti.product_id = p.id
            WHERE t.transaction_date BETWEEN start_date AND end_date
            GROUP BY t.id
            HAVING COUNT(ti.id) > 1
            ORDER BY COUNT(*) DESC
            LIMIT 5
        ) bundles
        
        UNION ALL
        
        -- Substitution patterns
        SELECT 
            'Substitution Alert' as insight_type,
            'High Substitution Rate Detected' as insight_title,
            'Product ' || orig_p.product_name || ' frequently substituted with ' || 
            sub_p.product_name || ' - Check stock levels' as insight_description,
            0.92 as confidence_score,
            'High' as priority
        FROM scout.transaction_items ti
        JOIN scout.products orig_p ON ti.original_product_id = orig_p.id
        JOIN scout.products sub_p ON ti.product_id = sub_p.id
        JOIN scout.transactions t ON ti.transaction_id = t.id
        WHERE 
            ti.was_substituted = TRUE
            AND t.transaction_date BETWEEN start_date AND end_date
        GROUP BY orig_p.product_name, sub_p.product_name
        HAVING COUNT(*) > 10
        LIMIT 3
    )
    SELECT 
        i.insight_type::TEXT,
        i.insight_title::TEXT,
        i.insight_description::TEXT,
        i.confidence_score,
        i.priority::TEXT
    FROM insights i
    ORDER BY i.confidence_score DESC;
END;
$$ LANGUAGE plpgsql;

-- 8. Get Filter Options (for cascading filters)
CREATE OR REPLACE FUNCTION scout.get_filter_options(
    filter_type TEXT, -- 'regions', 'cities', 'categories', 'brands'
    parent_filter JSONB DEFAULT '{}'
)
RETURNS TABLE (
    value TEXT,
    label TEXT,
    count BIGINT
) AS $$
BEGIN
    CASE filter_type
        WHEN 'regions' THEN
            RETURN QUERY
            SELECT 
                r.region_name as value,
                r.region_name as label,
                COUNT(DISTINCT t.id) as count
            FROM scout.regions r
            JOIN scout.locations l ON r.id = l.region_id
            JOIN scout.transactions t ON l.id = t.location_id
            GROUP BY r.region_name
            ORDER BY count DESC;
            
        WHEN 'cities' THEN
            RETURN QUERY
            SELECT 
                l.city as value,
                l.city as label,
                COUNT(DISTINCT t.id) as count
            FROM scout.locations l
            JOIN scout.regions r ON l.region_id = r.id
            JOIN scout.transactions t ON l.id = t.location_id
            WHERE (parent_filter->>'region' IS NULL OR r.region_name = parent_filter->>'region')
            GROUP BY l.city
            ORDER BY count DESC;
            
        WHEN 'categories' THEN
            RETURN QUERY
            SELECT 
                c.name as value,
                c.name as label,
                COUNT(DISTINCT ti.id) as count
            FROM scout.categories c
            JOIN scout.brands b ON c.id = b.category_id
            JOIN scout.products p ON b.id = p.brand_id
            JOIN scout.transaction_items ti ON p.id = ti.product_id
            GROUP BY c.name
            ORDER BY count DESC;
            
        WHEN 'brands' THEN
            RETURN QUERY
            SELECT 
                b.name as value,
                b.name as label,
                COUNT(DISTINCT ti.id) as count
            FROM scout.brands b
            JOIN scout.categories c ON b.category_id = c.id
            JOIN scout.products p ON b.id = p.brand_id
            JOIN scout.transaction_items ti ON p.id = ti.product_id
            WHERE (parent_filter->>'category' IS NULL OR c.name = parent_filter->>'category')
            GROUP BY b.name
            ORDER BY count DESC;
            
        ELSE
            -- Return empty result for unknown filter types
            RETURN;
    END CASE;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA scout TO anon, authenticated;
