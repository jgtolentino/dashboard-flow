import { scoutApi, ScoutEndpoints } from './scoutApiService';

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

// TBWA Client brands
const TBWA_CLIENTS = ['Alaska', 'Oishi', 'Champion', 'Del Monte', 'Winston'];

// FMCG Data Service using Scout API
export class FMCGDataService {
  // Get Regional Performance from Scout API
  static async getRegionalPerformance(
    startDate?: string,
    endDate?: string
  ): Promise<FMCGRegionalPerformance[]> {
    try {
      const data = await scoutApi.get<any[]>(ScoutEndpoints.salesByRegion, {
        start_date: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: endDate || new Date().toISOString().split('T')[0]
      });

      return data.map(item => ({
        region_name: item.region_name,
        total_sales: parseFloat(item.total_sales || 0),
        transaction_count: parseInt(item.transaction_count || 0),
        avg_transaction_value: parseFloat(item.avg_transaction_value || 0),
        top_category: item.top_category || 'Mixed',
        market_share_percent: parseFloat(item.market_share_percent || 0)
      }));
    } catch (error) {
      console.error('Error fetching regional performance:', error);
      return [];
    }
  }

  // Get Brand Performance Analysis from Scout API
  static async getBrandPerformance(
    startDate?: string,
    endDate?: string,
    category?: string
  ): Promise<FMCGBrandPerformance[]> {
    try {
      const data = await scoutApi.get<any[]>(ScoutEndpoints.brandPerformance, {
        start_date: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        end_date: endDate || new Date().toISOString().split('T')[0],
        category: category
      });

      return data.map(item => ({
        brand_name: item.brand_name,
        category: item.category,
        is_client_brand: TBWA_CLIENTS.includes(item.brand_name),
        total_sales: parseFloat(item.total_sales || 0),
        total_units: parseInt(item.total_units || 0),
        market_share_percent: parseFloat(item.market_share || 0),
        avg_selling_price: parseFloat(item.avg_price || 0),
        substitution_rate: 0 // Not available in current API
      }));
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
      const data = await scoutApi.get<any[]>(ScoutEndpoints.storePerformance, {
        region: region,
        limit: limit
      });

      return data.map(item => ({
        store_name: item.store_name,
        region_name: item.region_name,
        barangay_name: item.barangay_name || 'Unknown',
        monthly_transactions: parseInt(item.transaction_count || 0),
        avg_transaction_value: parseFloat(item.avg_transaction_value || 0),
        top_selling_category: item.top_category || 'Mixed',
        has_refrigerator: false, // Not in current schema
        performance_tier: this.getPerformanceTier(parseFloat(item.total_sales || 0))
      }));
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
      const data = await scoutApi.get<any[]>(ScoutEndpoints.competitiveAnalysis, {
        client_brand: clientBrand
      });

      // If API doesn't have this endpoint yet, compute from brand performance
      if (!data || data.length === 0) {
        const brandData = await this.getBrandPerformance();
        const clientBrands = brandData.filter(b => b.is_client_brand);
        const competitorBrands = brandData.filter(b => !b.is_client_brand);
        
        const analysis: FMCGCompetitiveAnalysis[] = [];
        
        clientBrands.forEach(client => {
          const categoryCompetitors = competitorBrands.filter(c => c.category === client.category);
          
          categoryCompetitors.forEach(competitor => {
            analysis.push({
              client_brand: client.brand_name,
              competitor_brand: competitor.brand_name,
              category: client.category,
              client_market_share: client.market_share_percent,
              competitor_market_share: competitor.market_share_percent,
              price_difference_percent: ((client.avg_selling_price - competitor.avg_selling_price) / competitor.avg_selling_price) * 100,
              substitution_frequency: 0
            });
          });
        });
        
        return analysis;
      }

      return data;
    } catch (error) {
      console.error('Error fetching competitive analysis:', error);
      return [];
    }
  }

  // Get Geography Hierarchy from Scout API
  static async getGeographyHierarchy(): Promise<FMCGGeographyHierarchy> {
    try {
      const [regions, provinces, cities, barangays] = await Promise.all([
        scoutApi.get<any[]>(ScoutEndpoints.regions),
        scoutApi.get<any[]>(ScoutEndpoints.provinces),
        scoutApi.get<any[]>(ScoutEndpoints.cities),
        scoutApi.get<any[]>(ScoutEndpoints.barangays)
      ]);

      return {
        regions: regions.map(r => ({
          id: r.region_id?.toString() || r.id?.toString(),
          region_name: r.region_name,
          region_code: r.region_code
        })),
        provinces: provinces.map(p => ({
          id: p.province_id?.toString() || p.id?.toString(),
          province_name: p.prov_name || p.province_name,
          region_id: p.region_id?.toString()
        })),
        cities: cities.map(c => ({
          id: c.city_id?.toString() || c.id?.toString(),
          city_name: c.city_name,
          province_id: c.province_id?.toString()
        })),
        barangays: barangays.map(b => ({
          id: b.brgy_id?.toString() || b.id?.toString(),
          barangay_name: b.brgy_name || b.barangay_name,
          city_id: b.city_id?.toString(),
          latitude: parseFloat(b.lat || b.latitude || 0),
          longitude: parseFloat(b.lon || b.longitude || 0)
        }))
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
      const brands = await scoutApi.get<any[]>(ScoutEndpoints.brandPerformance);
      
      return brands
        .filter(b => TBWA_CLIENTS.includes(b.brand_name))
        .map(b => ({
          id: b.brand_id?.toString() || b.id?.toString(),
          brand_name: b.brand_name,
          category: b.category,
          company_name: b.parent_company || 'TBWA Client'
        }));
    } catch (error) {
      console.error('Error fetching client brands:', error);
      // Return hardcoded TBWA clients as fallback
      return TBWA_CLIENTS.map((brand, idx) => ({
        id: idx.toString(),
        brand_name: brand,
        category: this.getBrandCategory(brand),
        company_name: this.getBrandCompany(brand)
      }));
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
      const brands = await scoutApi.get<any[]>(ScoutEndpoints.brandPerformance);
      
      const categoryStats = brands.reduce((acc, brand) => {
        const category = brand.category;
        const isClient = TBWA_CLIENTS.includes(brand.brand_name);
        
        if (!acc[category]) {
          acc[category] = {
            category: category,
            brand_count: 0,
            client_brands: 0,
            competitor_brands: 0
          };
        }
        
        acc[category].brand_count++;
        if (isClient) {
          acc[category].client_brands++;
        } else {
          acc[category].competitor_brands++;
        }
        
        return acc;
      }, {} as Record<string, any>);

      return Object.values(categoryStats);
    } catch (error) {
      console.error('Error fetching FMCG categories:', error);
      // Return hardcoded categories as fallback
      return [
        { category: 'Dairy', brand_count: 6, client_brands: 1, competitor_brands: 5 },
        { category: 'Snacks', brand_count: 6, client_brands: 1, competitor_brands: 5 },
        { category: 'Home Care', brand_count: 6, client_brands: 1, competitor_brands: 5 },
        { category: 'Canned/Sauce', brand_count: 6, client_brands: 1, competitor_brands: 5 },
        { category: 'Tobacco', brand_count: 5, client_brands: 1, competitor_brands: 4 }
      ];
    }
  }

  // Helper methods
  private static getPerformanceTier(totalSales: number): string {
    if (totalSales > 100000) return 'Top Performer';
    if (totalSales > 50000) return 'High Performer';
    if (totalSales > 20000) return 'Average Performer';
    return 'Low Performer';
  }

  private static getBrandCategory(brand: string): string {
    const categoryMap: Record<string, string> = {
      'Alaska': 'Dairy',
      'Oishi': 'Snacks',
      'Champion': 'Home Care',
      'Del Monte': 'Canned/Sauce',
      'Winston': 'Tobacco'
    };
    return categoryMap[brand] || 'Unknown';
  }

  private static getBrandCompany(brand: string): string {
    const companyMap: Record<string, string> = {
      'Alaska': 'Alaska Milk Corporation',
      'Oishi': 'Liwayway Marketing Corporation',
      'Champion': 'Peerless Products Manufacturing',
      'Del Monte': 'Del Monte Philippines',
      'Winston': 'Japan Tobacco International'
    };
    return companyMap[brand] || 'Unknown';
  }
}

export default FMCGDataService;