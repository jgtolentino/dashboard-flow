
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Types for Scout Analytics
export interface KPISummary {
  total_sales: number;
  total_transactions: number;
  avg_basket_value: number;
  growth_rate: number;
}

export interface TopProduct {
  product_name: string;
  brand_name: string;
  category_name: string;
  total_sales: number;
  total_quantity: number;
  avg_price: number;
}

export interface RegionalPerformance {
  region_name: string;
  city: string;
  total_sales: number;
  transaction_count: number;
  avg_transaction_value: number;
  top_category: string;
}

export interface TransactionTrend {
  time_period: string;
  sales_amount: number;
  transaction_count: number;
  avg_transaction_value: number;
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface AIInsight {
  insight_type: string;
  insight_title: string;
  insight_description: string;
  confidence_score: number;
  priority: string;
}

export interface ConsumerBehavior {
  request_method: string;
  count: number;
  percentage: number;
  avg_acceptance_rate: number;
}

export interface SubstitutionPattern {
  original_product: string;
  substitute_product: string;
  substitution_count: number;
  substitution_rate: number;
}

// Data Service Class
export class ScoutDataService {
  // Get KPI Summary
  static async getKPISummary(filters: Record<string, string> = {}): Promise<KPISummary> {
    try {
      const { data, error } = await supabase.rpc('get_kpi_summary', {
        start_date: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: filters.endDate || new Date().toISOString(),
        region_filter: filters.region || null,
        category_filter: filters.category || null
      });

      if (error) throw error;
      return data[0] || { total_sales: 0, total_transactions: 0, avg_basket_value: 0, growth_rate: 0 };
    } catch (error) {
      console.error('Error fetching KPI summary:', error);
      return { total_sales: 0, total_transactions: 0, avg_basket_value: 0, growth_rate: 0 };
    }
  }

  // Get Top Products
  static async getTopProducts(filters: Record<string, string> = {}, limit = 10): Promise<TopProduct[]> {
    try {
      const { data, error } = await supabase.rpc('get_top_products', {
        limit_count: limit,
        start_date: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: filters.endDate || new Date().toISOString(),
        region_filter: filters.region || null,
        category_filter: filters.category || null
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  }

  // Get Regional Performance
  static async getRegionalPerformance(filters: Record<string, string> = {}): Promise<RegionalPerformance[]> {
    try {
      const { data, error } = await supabase.rpc('get_regional_performance', {
        start_date: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: filters.endDate || new Date().toISOString()
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching regional performance:', error);
      return [];
    }
  }

  // Get Transaction Trends
  static async getTransactionTrends(
    periodType: 'hourly' | 'daily' | 'weekly' | 'monthly' = 'daily',
    filters: Record<string, string> = {}
  ): Promise<TransactionTrend[]> {
    try {
      const { data, error } = await supabase.rpc('get_transaction_trends', {
        period_type: periodType,
        start_date: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: filters.endDate || new Date().toISOString(),
        region_filter: filters.region || null,
        category_filter: filters.category || null
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching transaction trends:', error);
      return [];
    }
  }

  // Get Filter Options
  static async getFilterOptions(
    filterType: 'regions' | 'cities' | 'categories' | 'brands',
    parentFilter: Record<string, string> = {}
  ): Promise<FilterOption[]> {
    try {
      const { data, error } = await supabase.rpc('get_filter_options', {
        filter_type: filterType,
        parent_filter: parentFilter
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching filter options:', error);
      return [];
    }
  }

  // Get AI Insights
  static async getAIInsights(filters: Record<string, string> = {}): Promise<AIInsight[]> {
    try {
      const { data, error } = await supabase.rpc('get_ai_insights', {
        start_date: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: filters.endDate || new Date().toISOString()
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      return [];
    }
  }

  // Get Consumer Behavior
  static async getConsumerBehavior(filters: Record<string, string> = {}): Promise<ConsumerBehavior[]> {
    try {
      const { data, error } = await supabase.rpc('get_consumer_behavior', {
        start_date: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: filters.endDate || new Date().toISOString()
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching consumer behavior:', error);
      return [];
    }
  }

  // Get Substitution Analysis
  static async getSubstitutionAnalysis(filters: Record<string, string> = {}): Promise<SubstitutionPattern[]> {
    try {
      const { data, error } = await supabase.rpc('get_substitution_analysis', {
        start_date: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: filters.endDate || new Date().toISOString()
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching substitution analysis:', error);
      return [];
    }
  }

  // Get Dashboard Summary
  static async getDashboardSummary() {
    try {
      const { data, error } = await supabase.rpc('get_dashboard_summary');
      if (error) throw error;
      return data[0] || null;
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      return null;
    }
  }

  // Subscribe to real-time updates
  static subscribeToTransactions(callback: (payload: any) => void) {
    return supabase
      .channel('transactions')
      .on('postgres_changes', { event: 'INSERT', schema: 'scout', table: 'transactions' }, callback)
      .subscribe();
  }

  static subscribeToAlerts(callback: (payload: any) => void) {
    return supabase
      .channel('alerts')
      .on('postgres_changes', { event: 'INSERT', schema: 'scout', table: 'alerts' }, callback)
      .subscribe();
  }

  static subscribeToSystemHealth(callback: (payload: any) => void) {
    return supabase
      .channel('system_health')
      .on('postgres_changes', { event: 'INSERT', schema: 'scout', table: 'system_health' }, callback)
      .subscribe();
  }
}

export default ScoutDataService;
