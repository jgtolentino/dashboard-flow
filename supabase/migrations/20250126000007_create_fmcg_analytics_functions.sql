
-- FMCG Analytics Functions for Scout Dashboard

-- 1. Get Regional Sales Performance
CREATE OR REPLACE FUNCTION scout.get_regional_fmcg_performance(
    start_date TIMESTAMP DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP DEFAULT NOW()
)
RETURNS TABLE (
    region_name TEXT,
    total_sales DECIMAL(15,2),
    transaction_count BIGINT,
    avg_transaction_value DECIMAL(10,2),
    top_category TEXT,
    market_share_percent DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH regional_sales AS (
        SELECT 
            gr.region_name,
            SUM(ft.total_amount) as total_sales,
            COUNT(ft.id) as transaction_count,
            AVG(ft.total_amount) as avg_transaction_value
        FROM scout.fmcg_transactions ft
        JOIN scout.sari_stores ss ON ft.store_id = ss.id
        JOIN scout.geography_barangays gb ON ss.barangay_id = gb.id
        JOIN scout.geography_cities gc ON gb.city_id = gc.id
        JOIN scout.geography_provinces gp ON gc.province_id = gp.id
        JOIN scout.geography_regions gr ON gp.region_id = gr.id
        WHERE ft.transaction_date BETWEEN start_date AND end_date
        GROUP BY gr.region_name
    ),
    category_rankings AS (
        SELECT DISTINCT ON (gr.region_name)
            gr.region_name,
            fb.category as top_category
        FROM scout.fmcg_transactions ft
        JOIN scout.fmcg_transaction_items fti ON ft.id = fti.transaction_id
        JOIN scout.fmcg_products fp ON fti.product_id = fp.id
        JOIN scout.fmcg_brands fb ON fp.brand_id = fb.id
        JOIN scout.sari_stores ss ON ft.store_id = ss.id
        JOIN scout.geography_barangays gb ON ss.barangay_id = gb.id
        JOIN scout.geography_cities gc ON gb.city_id = gc.id
        JOIN scout.geography_provinces gp ON gc.province_id = gp.id
        JOIN scout.geography_regions gr ON gp.region_id = gr.id
        WHERE ft.transaction_date BETWEEN start_date AND end_date
        GROUP BY gr.region_name, fb.category
        ORDER BY gr.region_name, SUM(fti.total_price) DESC
    ),
    total_market AS (
        SELECT SUM(total_sales) as total_market_sales
        FROM regional_sales
    )
    SELECT 
        rs.region_name::TEXT,
        rs.total_sales,
        rs.transaction_count,
        rs.avg_transaction_value,
        COALESCE(cr.top_category, 'N/A')::TEXT,
        CASE WHEN tm.total_market_sales > 0 
             THEN (rs.total_sales / tm.total_market_sales * 100)::DECIMAL(5,2)
             ELSE 0::DECIMAL(5,2) 
        END
    FROM regional_sales rs
    LEFT JOIN category_rankings cr ON rs.region_name = cr.region_name
    CROSS JOIN total_market tm
    ORDER BY rs.total_sales DESC;
END;
$$ LANGUAGE plpgsql;

-- 2. Get Brand Performance Analysis
CREATE OR REPLACE FUNCTION scout.get_brand_performance_analysis(
    start_date TIMESTAMP DEFAULT NOW() - INTERVAL '30 days',
    end_date TIMESTAMP DEFAULT NOW(),
    category_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    brand_name TEXT,
    category TEXT,
    is_client_brand BOOLEAN,
    total_sales DECIMAL(15,2),
    total_units BIGINT,
    market_share_percent DECIMAL(5,2),
    avg_selling_price DECIMAL(10,2),
    substitution_rate DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH brand_sales AS (
        SELECT 
            fb.brand_name,
            fb.category,
            fb.is_client_brand,
            SUM(fti.total_price) as total_sales,
            SUM(fti.quantity) as total_units,
            AVG(fti.unit_price) as avg_selling_price,
            COUNT(CASE WHEN fti.was_substituted THEN 1 END) * 100.0 / COUNT(*) as substitution_rate
        FROM scout.fmcg_transaction_items fti
        JOIN scout.fmcg_products fp ON fti.product_id = fp.id
        JOIN scout.fmcg_brands fb ON fp.brand_id = fb.id
        JOIN scout.fmcg_transactions ft ON fti.transaction_id = ft.id
        WHERE ft.transaction_date BETWEEN start_date AND end_date
        AND (category_filter IS NULL OR fb.category = category_filter)
        GROUP BY fb.brand_name, fb.category, fb.is_client_brand
    ),
    category_totals AS (
        SELECT 
            category,
            SUM(total_sales) as category_total_sales
        FROM brand_sales
        GROUP BY category
    )
    SELECT 
        bs.brand_name::TEXT,
        bs.category::TEXT,
        bs.is_client_brand,
        bs.total_sales,
        bs.total_units,
        CASE WHEN ct.category_total_sales > 0 
             THEN (bs.total_sales / ct.category_total_sales * 100)::DECIMAL(5,2)
             ELSE 0::DECIMAL(5,2) 
        END,
        bs.avg_selling_price::DECIMAL(10,2),
        bs.substitution_rate::DECIMAL(5,2)
    FROM brand_sales bs
    JOIN category_totals ct ON bs.category = ct.category
    ORDER BY bs.total_sales DESC;
END;
$$ LANGUAGE plpgsql;

-- 3. Get Sari-Sari Store Performance Metrics
CREATE OR REPLACE FUNCTION scout.get_store_performance_metrics(
    region_filter TEXT DEFAULT NULL,
    limit_count INTEGER DEFAULT 50
)
RETURNS TABLE (
    store_name TEXT,
    region_name TEXT,
    barangay_name TEXT,
    monthly_transactions BIGINT,
    avg_transaction_value DECIMAL(10,2),
    top_selling_category TEXT,
    has_refrigerator BOOLEAN,
    performance_tier TEXT
) AS $$
BEGIN
    RETURN QUERY
    WITH store_metrics AS (
        SELECT 
            ss.store_name,
            gr.region_name,
            gb.barangay_name,
            COUNT(ft.id) as monthly_transactions,
            AVG(ft.total_amount) as avg_transaction_value,
            ss.has_refrigerator,
            ROW_NUMBER() OVER (PARTITION BY ss.id ORDER BY SUM(fti.total_price) DESC) as cat_rank,
            fb.category
        FROM scout.sari_stores ss
        JOIN scout.geography_barangays gb ON ss.barangay_id = gb.id
        JOIN scout.geography_cities gc ON gb.city_id = gc.id
        JOIN scout.geography_provinces gp ON gc.province_id = gp.id
        JOIN scout.geography_regions gr ON gp.region_id = gr.id
        LEFT JOIN scout.fmcg_transactions ft ON ss.id = ft.store_id
        LEFT JOIN scout.fmcg_transaction_items fti ON ft.id = fti.transaction_id
        LEFT JOIN scout.fmcg_products fp ON fti.product_id = fp.id
        LEFT JOIN scout.fmcg_brands fb ON fp.brand_id = fb.id
        WHERE ft.transaction_date >= NOW() - INTERVAL '30 days'
        AND (region_filter IS NULL OR gr.region_name = region_filter)
        GROUP BY ss.id, ss.store_name, gr.region_name, gb.barangay_name, ss.has_refrigerator, fb.category
    ),
    top_categories AS (
        SELECT 
            store_name,
            category as top_selling_category
        FROM store_metrics
        WHERE cat_rank = 1
    ),
    final_metrics AS (
        SELECT 
            sm.store_name,
            sm.region_name,
            sm.barangay_name,
            sm.monthly_transactions,
            sm.avg_transaction_value,
            sm.has_refrigerator,
            CASE 
                WHEN sm.avg_transaction_value > 200 AND sm.monthly_transactions > 100 THEN 'High Performer'
                WHEN sm.avg_transaction_value > 100 AND sm.monthly_transactions > 50 THEN 'Average Performer'
                ELSE 'Low Performer'
            END as performance_tier
        FROM store_metrics sm
        WHERE sm.cat_rank = 1
        GROUP BY sm.store_name, sm.region_name, sm.barangay_name, sm.monthly_transactions, sm.avg_transaction_value, sm.has_refrigerator
    )
    SELECT 
        fm.store_name::TEXT,
        fm.region_name::TEXT,
        fm.barangay_name::TEXT,
        fm.monthly_transactions,
        fm.avg_transaction_value,
        COALESCE(tc.top_selling_category, 'Mixed')::TEXT,
        fm.has_refrigerator,
        fm.performance_tier::TEXT
    FROM final_metrics fm
    LEFT JOIN top_categories tc ON fm.store_name = tc.store_name
    ORDER BY fm.avg_transaction_value DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- 4. Get Competitive Analysis
CREATE OR REPLACE FUNCTION scout.get_competitive_analysis(
    client_brand_filter TEXT DEFAULT NULL
)
RETURNS TABLE (
    client_brand TEXT,
    competitor_brand TEXT,
    category TEXT,
    client_market_share DECIMAL(5,2),
    competitor_market_share DECIMAL(5,2),
    price_difference_percent DECIMAL(5,2),
    substitution_frequency INTEGER
) AS $$
BEGIN
    RETURN QUERY
    WITH market_shares AS (
        SELECT 
            fb.brand_name,
            fb.category,
            fb.is_client_brand,
            SUM(fti.total_price) as brand_sales,
            AVG(fti.unit_price) as avg_price
        FROM scout.fmcg_transaction_items fti
        JOIN scout.fmcg_products fp ON fti.product_id = fp.id
        JOIN scout.fmcg_brands fb ON fp.brand_id = fb.id
        JOIN scout.fmcg_transactions ft ON fti.transaction_id = ft.id
        WHERE ft.transaction_date >= NOW() - INTERVAL '30 days'
        GROUP BY fb.brand_name, fb.category, fb.is_client_brand
    ),
    category_totals AS (
        SELECT 
            category,
            SUM(brand_sales) as total_category_sales
        FROM market_shares
        GROUP BY category
    ),
    substitutions AS (
        SELECT 
            orig_fb.brand_name as original_brand,
            sub_fb.brand_name as substitute_brand,
            COUNT(*) as substitution_count
        FROM scout.fmcg_transaction_items fti
        JOIN scout.fmcg_products orig_fp ON fti.original_product_id = orig_fp.id
        JOIN scout.fmcg_brands orig_fb ON orig_fp.brand_id = orig_fb.id
        JOIN scout.fmcg_products sub_fp ON fti.product_id = sub_fp.id
        JOIN scout.fmcg_brands sub_fb ON sub_fp.brand_id = sub_fb.id
        WHERE fti.was_substituted = TRUE
        GROUP BY orig_fb.brand_name, sub_fb.brand_name
    )
    SELECT 
        client_ms.brand_name::TEXT as client_brand,
        comp_ms.brand_name::TEXT as competitor_brand,
        client_ms.category::TEXT,
        (client_ms.brand_sales / ct.total_category_sales * 100)::DECIMAL(5,2) as client_market_share,
        (comp_ms.brand_sales / ct.total_category_sales * 100)::DECIMAL(5,2) as competitor_market_share,
        CASE WHEN client_ms.avg_price > 0 
             THEN ((comp_ms.avg_price - client_ms.avg_price) / client_ms.avg_price * 100)::DECIMAL(5,2)
             ELSE 0::DECIMAL(5,2) 
        END as price_difference_percent,
        COALESCE(s.substitution_count, 0) as substitution_frequency
    FROM market_shares client_ms
    JOIN market_shares comp_ms ON client_ms.category = comp_ms.category 
    JOIN category_totals ct ON client_ms.category = ct.category
    LEFT JOIN substitutions s ON client_ms.brand_name = s.original_brand 
                              AND comp_ms.brand_name = s.substitute_brand
    WHERE client_ms.is_client_brand = TRUE 
    AND comp_ms.is_client_brand = FALSE
    AND (client_brand_filter IS NULL OR client_ms.brand_name = client_brand_filter)
    ORDER BY client_ms.category, client_market_share DESC;
END;
$$ LANGUAGE plpgsql;

-- Grant execute permissions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA scout TO anon, authenticated;
