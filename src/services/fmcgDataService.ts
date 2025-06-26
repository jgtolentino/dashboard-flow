
import { supabase } from './dataService';

// Enhanced types for FMCG data
export interface FMCGRegionalPerformance {
  region_name: string;
  total_sales: number;
  transaction_count: number;
  avg_transaction_value: number;
  top_category: string;
  market_share_percent: number;
}

export interface FMCGBrandPerformance {
  brand_name: string;
  category: string;
  is_client_brand: boolean;
  total_sales: number;
  total_units: number;
  market_share_percent: number;
  avg_selling_price: number;
  substitution_rate: number;
}

export interface FMCGStorePerformance {
  store_name: string;
  region_name: string;
  barangay_name: string;
  monthly_transactions: number;
  avg_transaction_value: number;
  top_selling_category: string;
  has_refrigerator: boolean;
  performance_tier: string;
}

export interface FMCGCompetitiveAnalysis {
  client_brand: string;
  competitor_brand: string;
  category: string;
  client_market_share: number;
  competitor_market_share: number;
  price_difference_percent: number;
  substitution_frequency: number;
}

export interface FMCGGeographyHierarchy {
  regions: Array<{
    id: string;
    region_name: string;
    region_code: string;
  }>;
  provinces: Array<{
    id: string;
    province_name: string;
    region_id: string;
  }>;
  cities: Array<{
    id: string;
    city_name: string;
    province_id: string;
  }>;
  barangays: Array<{
    id: string;
    barangay_name: string;
    city_id: string;
    latitude: number;
    longitude: number;
  }>;
}

// FMCG Data Service
export class FMCGDataService {
  // Get Regional Performance
  static async getRegionalPerformance(
    startDate?: string,
    endDate?: string
  ): Promise<FMCGRegionalPerformance[]> {
    try {
      const { data, error } = await supabase.rpc('get_regional_fmcg_performance', {
        start_date: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: endDate || new Date().toISOString()
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching regional performance:', error);
      return [];
    }
  }

  // Get Brand Performance Analysis
  static async getBrandPerformance(
    startDate?: string,
    endDate?: string,
    category?: string
  ): Promise<FMCGBrandPerformance[]> {
    try {
      const { data, error } = await supabase.rpc('get_brand_performance_analysis', {
        start_date: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        end_date: endDate || new Date().toISOString(),
        category_filter: category || null
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching brand performance:', error);
      return [];
    }
  }

  // Get Store Performance Metrics
  static async getStorePerformance(
    region?: string,
    limit = 50
  ): Promise<FMCGStorePerformance[]> {
    try {
      const { data, error } = await supabase.rpc('get_store_performance_metrics', {
        region_filter: region || null,
        limit_count: limit
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching store performance:', error);
      return [];
    }
  }

  // Get Competitive Analysis
  static async getCompetitiveAnalysis(
    clientBrand?: string
  ): Promise<FMCGCompetitiveAnalysis[]> {
    try {
      const { data, error } = await supabase.rpc('get_competitive_analysis', {
        client_brand_filter: clientBrand || null
      });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching competitive analysis:', error);
      return [];
    }
  }

  // Get Geography Hierarchy
  static async getGeographyHierarchy(): Promise<FMCGGeographyHierarchy> {
    try {
      const [regions, provinces, cities, barangays] = await Promise.all([
        supabase.from('geography_regions').select('id, region_name, region_code'),
        supabase.from('geography_provinces').select('id, province_name, region_id'),
        supabase.from('geography_cities').select('id, city_name, province_id'),
        supabase.from('geography_barangays').select('id, barangay_name, city_id, latitude, longitude')
      ]);

      return {
        regions: regions.data || [],
        provinces: provinces.data || [],
        cities: cities.data || [],
        barangays: barangays.data || []
      };
    } catch (error) {
      console.error('Error fetching geography hierarchy:', error);
      return {
        regions: [],
        provinces: [],
        cities: [],
        barangays: []
      };
    }
  }

  // Get Client Brands
  static async getClientBrands(): Promise<Array<{
    id: string;
    brand_name: string;
    category: string;
    company_name: string;
  }>> {
    try {
      const { data, error } = await supabase
        .from('fmcg_brands')
        .select(`
          id,
          brand_name,
          category,
          fmcg_companies(company_name)
        `)
        .eq('is_client_brand', true);

      if (error) throw error;
      
      return data?.map(item => ({
        id: item.id,
        brand_name: item.brand_name,
        category: item.category,
        company_name: (item.fmcg_companies as any)?.company_name || 'Unknown'
      })) || [];
    } catch (error) {
      console.error('Error fetching client brands:', error);
      return [];
    }
  }

  // Get FMCG Categories
  static async getFMCGCategories(): Promise<Array<{
    category: string;
    brand_count: number;
    client_brands: number;
    competitor_brands: number;
  }>> {
    try {
      const { data, error } = await supabase
        .from('fmcg_brands')
        .select('category, is_client_brand');

      if (error) throw error;

      const categoryStats = (data || []).reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = {
            category: item.category,
            brand_count: 0,
            client_brands: 0,
            competitor_brands: 0
          };
        }
        
        acc[item.category].brand_count++;
        if (item.is_client_brand) {
          acc[item.category].client_brands++;
        } else {
          acc[item.category].competitor_brands++;
        }
        
        return acc;
      }, {} as Record<string, any>);

      return Object.values(categoryStats);
    } catch (error) {
      console.error('Error fetching FMCG categories:', error);
      return [];
    }
  }
}

export default FMCGDataService;
