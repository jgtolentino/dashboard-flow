
-- Scout Analytics Real-time Subscriptions and Triggers
-- Enable real-time features for the dashboard

-- 1. Enable Realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE scout.transactions;
ALTER PUBLICATION supabase_realtime ADD TABLE scout.transaction_items;
ALTER PUBLICATION supabase_realtime ADD TABLE scout.alerts;
ALTER PUBLICATION supabase_realtime ADD TABLE scout.system_health;

-- 2. Create notification functions
CREATE OR REPLACE FUNCTION scout.notify_high_value_transaction()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.total_value > 1000 THEN
        PERFORM pg_notify(
            'high_value_transaction',
            json_build_object(
                'transaction_id', NEW.id,
                'total_value', NEW.total_value,
                'location_id', NEW.location_id,
                'timestamp', NEW.transaction_date
            )::text
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Create alert generation function
CREATE OR REPLACE FUNCTION scout.generate_system_alerts()
RETURNS TRIGGER AS $$
DECLARE
    location_name TEXT;
    region_name TEXT;
BEGIN
    -- Get location details
    SELECT l.location_name, r.region_name 
    INTO location_name, region_name
    FROM scout.locations l
    JOIN scout.regions r ON l.region_id = r.id
    WHERE l.id = NEW.location_id;
    
    -- Generate alert for high-value transactions
    IF NEW.total_value > 2000 THEN
        INSERT INTO scout.alerts (alert_type, title, message, severity, is_read)
        VALUES (
            'Business',
            'High Value Transaction',
            'Transaction worth ₱' || NEW.total_value || ' recorded at ' || 
            COALESCE(location_name, 'Unknown Location') || ', ' || 
            COALESCE(region_name, 'Unknown Region'),
            'Medium',
            FALSE
        );
    END IF;
    
    -- Generate alert for unusually long transactions
    IF NEW.duration_seconds > 600 THEN -- 10 minutes
        INSERT INTO scout.alerts (alert_type, title, message, severity, is_read)
        VALUES (
            'Operations',
            'Long Transaction Duration',
            'Transaction took ' || NEW.duration_seconds || ' seconds at ' || 
            COALESCE(location_name, 'Unknown Location'),
            'Low',
            FALSE
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Create substitution tracking function
CREATE OR REPLACE FUNCTION scout.track_substitution_patterns()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.was_substituted = TRUE AND NEW.original_product_id IS NOT NULL THEN
        -- Update or insert substitution pattern
        INSERT INTO scout.substitution_patterns (
            original_product_id,
            substitute_product_id,
            location_id,
            frequency_count,
            substitution_reason,
            updated_at
        )
        SELECT 
            NEW.original_product_id,
            NEW.product_id,
            t.location_id,
            1,
            'Stock unavailable',
            NOW()
        FROM scout.transactions t
        WHERE t.id = NEW.transaction_id
        ON CONFLICT (original_product_id, substitute_product_id, location_id)
        DO UPDATE SET 
            frequency_count = scout.substitution_patterns.frequency_count + 1,
            updated_at = NOW();
            
        -- Generate alert for high substitution rates
        PERFORM scout.check_substitution_alert(NEW.original_product_id, NEW.product_id);
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Create substitution alert check function
CREATE OR REPLACE FUNCTION scout.check_substitution_alert(
    orig_product_id UUID,
    sub_product_id UUID
)
RETURNS VOID AS $$
DECLARE
    orig_product_name TEXT;
    sub_product_name TEXT;
    substitution_count INTEGER;
BEGIN
    -- Get product names
    SELECT p1.product_name, p2.product_name
    INTO orig_product_name, sub_product_name
    FROM scout.products p1, scout.products p2
    WHERE p1.id = orig_product_id AND p2.id = sub_product_id;
    
    -- Check recent substitution frequency
    SELECT COUNT(*)
    INTO substitution_count
    FROM scout.substitution_patterns sp
    WHERE sp.original_product_id = orig_product_id
    AND sp.substitute_product_id = sub_product_id
    AND sp.updated_at >= NOW() - INTERVAL '24 hours';
    
    -- Generate alert if substitution rate is high
    IF substitution_count > 5 THEN
        INSERT INTO scout.alerts (alert_type, title, message, severity, is_read)
        VALUES (
            'Inventory',
            'High Substitution Rate',
            'Product "' || orig_product_name || '" substituted with "' || 
            sub_product_name || '" ' || substitution_count || ' times in last 24 hours',
            'High',
            FALSE
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 6. Create system health monitoring function
CREATE OR REPLACE FUNCTION scout.update_system_metrics()
RETURNS VOID AS $$
BEGIN
    -- Insert current system metrics
    INSERT INTO scout.system_health (metric_name, metric_value, metric_unit, timestamp)
    VALUES 
        ('Active Transactions', 
         (SELECT COUNT(*) FROM scout.transactions WHERE transaction_date >= NOW() - INTERVAL '1 hour'), 
         'transactions', NOW()),
        ('Database Size', 
         (SELECT pg_database_size(current_database()) / 1024 / 1024), 
         'MB', NOW()),
        ('Total Products', 
         (SELECT COUNT(*) FROM scout.products WHERE is_active = TRUE), 
         'products', NOW()),
        ('Total Locations', 
         (SELECT COUNT(*) FROM scout.locations WHERE is_active = TRUE), 
         'locations', NOW());
         
    -- Clean up old metrics (keep last 24 hours)
    DELETE FROM scout.system_health 
    WHERE timestamp < NOW() - INTERVAL '24 hours';
END;
$$ LANGUAGE plpgsql;

-- 7. Create dashboard summary function
CREATE OR REPLACE FUNCTION scout.get_dashboard_summary()
RETURNS TABLE (
    today_sales DECIMAL(15,2),
    today_transactions BIGINT,
    active_alerts BIGINT,
    top_region TEXT,
    growth_rate DECIMAL(5,2)
) AS $$
DECLARE
    yesterday_sales DECIMAL(15,2);
    today_sales_val DECIMAL(15,2);
BEGIN
    -- Get today's sales
    SELECT COALESCE(SUM(total_value), 0)
    INTO today_sales_val
    FROM scout.transactions
    WHERE transaction_date >= CURRENT_DATE;
    
    -- Get yesterday's sales for comparison
    SELECT COALESCE(SUM(total_value), 0)
    INTO yesterday_sales
    FROM scout.transactions
    WHERE transaction_date >= CURRENT_DATE - INTERVAL '1 day'
    AND transaction_date < CURRENT_DATE;
    
    RETURN QUERY
    SELECT 
        today_sales_val,
        (SELECT COUNT(*) FROM scout.transactions WHERE transaction_date >= CURRENT_DATE),
        (SELECT COUNT(*) FROM scout.alerts WHERE is_read = FALSE),
        (SELECT r.region_name
         FROM scout.regions r
         JOIN scout.locations l ON r.id = l.region_id
         JOIN scout.transactions t ON l.id = t.location_id
         WHERE t.transaction_date >= CURRENT_DATE - INTERVAL '7 days'
         GROUP BY r.region_name
         ORDER BY SUM(t.total_value) DESC
         LIMIT 1),
        CASE 
            WHEN yesterday_sales > 0 THEN 
                ((today_sales_val - yesterday_sales) / yesterday_sales * 100)::DECIMAL(5,2)
            ELSE 0
        END;
END;
$$ LANGUAGE plpgsql;

-- 8. Create triggers
CREATE TRIGGER trigger_high_value_transaction
    AFTER INSERT ON scout.transactions
    FOR EACH ROW
    EXECUTE FUNCTION scout.notify_high_value_transaction();

CREATE TRIGGER trigger_generate_alerts
    AFTER INSERT ON scout.transactions
    FOR EACH ROW
    EXECUTE FUNCTION scout.generate_system_alerts();

CREATE TRIGGER trigger_track_substitutions
    AFTER INSERT ON scout.transaction_items
    FOR EACH ROW
    EXECUTE FUNCTION scout.track_substitution_patterns();

-- 9. Create scheduled job to update system metrics (if pg_cron is available)
-- This would typically be set up in a separate migration or cron job
-- SELECT cron.schedule('update-system-metrics', '*/5 * * * *', 'SELECT scout.update_system_metrics();');

-- 10. Create real-time subscription policies
CREATE POLICY "Enable real-time access for authenticated users" ON scout.alerts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable real-time access for authenticated users" ON scout.system_health
    FOR SELECT USING (auth.role() = 'authenticated');

-- 11. Create function to get recent activities
CREATE OR REPLACE FUNCTION scout.get_recent_activities(
    limit_count INTEGER DEFAULT 10
)
RETURNS TABLE (
    activity_type TEXT,
    activity_title TEXT,
    activity_description TEXT,
    timestamp TIMESTAMP,
    severity TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        'Transaction' as activity_type,
        'New Transaction' as activity_title,
        'Transaction worth ₱' || t.total_value || ' at ' || 
        COALESCE(l.location_name, l.barangay) as activity_description,
        t.transaction_date as timestamp,
        CASE 
            WHEN t.total_value > 1000 THEN 'High'
            WHEN t.total_value > 500 THEN 'Medium'
            ELSE 'Low'
        END as severity
    FROM scout.transactions t
    JOIN scout.locations l ON t.location_id = l.id
    WHERE t.transaction_date >= NOW() - INTERVAL '1 hour'
    
    UNION ALL
    
    SELECT 
        a.alert_type as activity_type,
        a.title as activity_title,
        a.message as activity_description,
        a.created_at as timestamp,
        a.severity
    FROM scout.alerts a
    WHERE a.created_at >= NOW() - INTERVAL '1 hour'
    
    ORDER BY timestamp DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Grant permissions
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA scout TO anon, authenticated;

-- Create indexes for real-time performance
CREATE INDEX IF NOT EXISTS idx_transactions_realtime 
ON scout.transactions(transaction_date DESC, total_value DESC) 
WHERE transaction_date >= NOW() - INTERVAL '24 hours';

CREATE INDEX IF NOT EXISTS idx_alerts_realtime 
ON scout.alerts(created_at DESC, is_read) 
WHERE created_at >= NOW() - INTERVAL '24 hours';

CREATE INDEX IF NOT EXISTS idx_system_health_realtime 
ON scout.system_health(timestamp DESC, metric_name) 
WHERE timestamp >= NOW() - INTERVAL '24 hours';
