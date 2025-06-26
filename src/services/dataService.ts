import { scoutApi, ScoutEndpoints } from './scoutApiService';

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

// Mock supabase for backward compatibility
export const supabase = {
  from: () => ({ select: () => ({ data: [], error: null }) }),
  rpc: () => ({ data: [], error: null }),
  channel: () => ({ on: () => ({ subscribe: () => {} }) })
};

// Data Service Class using Scout API
export class ScoutDataService {
  // Get KPI Summary
  static async getKPISummary(filters: Record<string, string> = {}): Promise<KPISummary> {
    try {
      const summary = await scoutApi.get<any>(ScoutEndpoints.transactionSummary, {
        start_date: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: filters.endDate || new Date().toISOString().split('T')[0],
        region: filters.region,
        category: filters.category
      });

      return {
        total_sales: parseFloat(summary.total_sales || 0),
        total_transactions: parseInt(summary.total_transactions || 0),
        avg_basket_value: parseFloat(summary.avg_transaction_value || 0),
        growth_rate: parseFloat(summary.growth_rate || 0)
      };
    } catch (error) {
      console.error('Error fetching KPI summary:', error);
      return { total_sales: 0, total_transactions: 0, avg_basket_value: 0, growth_rate: 0 };
    }
  }

  // Get Top Products
  static async getTopProducts(filters: Record<string, string> = {}, limit = 10): Promise<TopProduct[]> {
    try {
      const products = await scoutApi.get<any[]>(ScoutEndpoints.topSellingProducts, {
        limit: limit,
        start_date: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: filters.endDate || new Date().toISOString().split('T')[0],
        region: filters.region,
        category: filters.category
      });

      return products.map(p => ({
        product_name: p.product_name,
        brand_name: p.brand_name,
        category_name: p.category,
        total_sales: parseFloat(p.total_sales || 0),
        total_quantity: parseInt(p.total_qty || p.total_quantity || 0),
        avg_price: parseFloat(p.avg_price || p.srp || 0)
      }));
    } catch (error) {
      console.error('Error fetching top products:', error);
      return [];
    }
  }

  // Get Regional Performance
  static async getRegionalPerformance(filters: Record<string, string> = {}): Promise<RegionalPerformance[]> {
    try {
      const regional = await scoutApi.get<any[]>(ScoutEndpoints.salesByRegion, {
        start_date: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: filters.endDate || new Date().toISOString().split('T')[0]
      });

      return regional.map(r => ({
        region_name: r.region_name,
        city: r.top_city || 'Various',
        total_sales: parseFloat(r.total_sales || 0),
        transaction_count: parseInt(r.transaction_count || 0),
        avg_transaction_value: parseFloat(r.avg_transaction_value || 0),
        top_category: r.top_category || 'Mixed'
      }));
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
      const trends = await scoutApi.get<any[]>(ScoutEndpoints.transactionTrends, {
        period: periodType,
        start_date: filters.startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: filters.endDate || new Date().toISOString().split('T')[0],
        region: filters.region,
        category: filters.category
      });

      return trends.map(t => ({
        time_period: t.time_period || t.date,
        sales_amount: parseFloat(t.sales_amount || t.total_sales || 0),
        transaction_count: parseInt(t.transaction_count || 0),
        avg_transaction_value: parseFloat(t.avg_transaction_value || 0)
      }));
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
      let data: any[] = [];
      
      switch (filterType) {
        case 'regions':
          data = await scoutApi.get<any[]>(ScoutEndpoints.regions);
          return data.map(r => ({
            value: r.region_code,
            label: r.region_name,
            count: r.store_count || 0
          }));
          
        case 'cities':
          data = await scoutApi.get<any[]>(ScoutEndpoints.cities, { region: parentFilter.region });
          return data.map(c => ({
            value: c.city_code,
            label: c.city_name,
            count: c.store_count || 0
          }));
          
        case 'categories':
          data = await scoutApi.get<any[]>(ScoutEndpoints.productsByCategory);
          return data.map(c => ({
            value: c.category,
            label: c.category,
            count: c.product_count || 0
          }));
          
        case 'brands':
          data = await scoutApi.get<any[]>(ScoutEndpoints.brandPerformance);
          const uniqueBrands = Array.from(new Set(data.map(b => b.brand_name)));
          return uniqueBrands.map(brand => ({
            value: brand,
            label: brand,
            count: data.filter(d => d.brand_name === brand).length
          }));
          
        default:
          return [];
      }
    } catch (error) {
      console.error('Error fetching filter options:', error);
      return [];
    }
  }

  // Get AI Insights (simulated based on data patterns)
  static async getAIInsights(filters: Record<string, string> = {}): Promise<AIInsight[]> {
    try {
      // Since Scout API doesn't have AI insights, we'll generate some based on data
      const [kpi, topProducts, regional] = await Promise.all([
        this.getKPISummary(filters),
        this.getTopProducts(filters, 5),
        this.getRegionalPerformance(filters)
      ]);

      const insights: AIInsight[] = [];

      // Growth insight
      if (kpi.growth_rate > 10) {
        insights.push({
          insight_type: 'growth',
          insight_title: 'Strong Sales Growth',
          insight_description: `Sales are up ${kpi.growth_rate.toFixed(1)}% compared to the previous period. This indicates strong market performance.`,
          confidence_score: 0.85,
          priority: 'high'
        });
      }

      // Top product insight
      if (topProducts.length > 0) {
        const topProduct = topProducts[0];
        insights.push({
          insight_type: 'product',
          insight_title: 'Best Seller Alert',
          insight_description: `${topProduct.product_name} (${topProduct.brand_name}) is your top performer with ₱${topProduct.total_sales.toLocaleString()} in sales.`,
          confidence_score: 0.95,
          priority: 'medium'
        });
      }

      // Regional insight
      if (regional.length > 0) {
        const topRegion = regional[0];
        insights.push({
          insight_type: 'regional',
          insight_title: 'Regional Leader',
          insight_description: `${topRegion.region_name} leads with ${topRegion.transaction_count.toLocaleString()} transactions and ₱${topRegion.total_sales.toLocaleString()} in sales.`,
          confidence_score: 0.90,
          priority: 'medium'
        });
      }

      return insights;
    } catch (error) {
      console.error('Error generating AI insights:', error);
      return [];
    }
  }

  // Get Consumer Behavior (simulated)
  static async getConsumerBehavior(filters: Record<string, string> = {}): Promise<ConsumerBehavior[]> {
    try {
      // Simulated data based on typical sari-sari store patterns
      return [
        {
          request_method: 'Walk-in Purchase',
          count: 850,
          percentage: 85,
          avg_acceptance_rate: 95
        },
        {
          request_method: 'Phone Order',
          count: 100,
          percentage: 10,
          avg_acceptance_rate: 80
        },
        {
          request_method: 'Credit Purchase',
          count: 50,
          percentage: 5,
          avg_acceptance_rate: 60
        }
      ];
    } catch (error) {
      console.error('Error fetching consumer behavior:', error);
      return [];
    }
  }

  // Get Substitution Analysis (simulated)
  static async getSubstitutionAnalysis(filters: Record<string, string> = {}): Promise<SubstitutionPattern[]> {
    try {
      // Simulated substitution patterns
      return [
        {
          original_product: 'Alaska Powdered Milk 320g',
          substitute_product: 'Bear Brand Powdered Milk 320g',
          substitution_count: 45,
          substitution_rate: 12.5
        },
        {
          original_product: 'Del Monte Tomato Sauce 1kg',
          substitute_product: 'UFC Sweet Sauce 1kg',
          substitution_count: 32,
          substitution_rate: 8.2
        },
        {
          original_product: 'Oishi Prawn Crackers',
          substitute_product: 'Chippy BBQ',
          substitution_count: 28,
          substitution_rate: 7.1
        }
      ];
    } catch (error) {
      console.error('Error fetching substitution analysis:', error);
      return [];
    }
  }

  // Get Dashboard Summary
  static async getDashboardSummary() {
    try {
      const kpi = await this.getKPISummary();
      return {
        ...kpi,
        last_updated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);
      return null;
    }
  }

  // Subscribe to real-time updates (not available in Scout API, returns mock)
  static subscribeToTransactions(callback: (payload: any) => void) {
    console.log('Real-time subscriptions not available with Scout API');
    return { unsubscribe: () => {} };
  }

  static subscribeToAlerts(callback: (payload: any) => void) {
    console.log('Real-time subscriptions not available with Scout API');
    return { unsubscribe: () => {} };
  }

  static subscribeToSystemHealth(callback: (payload: any) => void) {
    console.log('Real-time subscriptions not available with Scout API');
    return { unsubscribe: () => {} };
  }
}

export default ScoutDataService;