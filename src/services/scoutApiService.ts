// Scout API Service - Connects to MySQL Scout Backend
const SCOUT_API_URL = import.meta.env.VITE_SCOUT_API_URL || 'http://localhost:8001/api/v1';

export interface ScoutApiConfig {
  baseUrl: string;
  timeout?: number;
}

class ScoutApiService {
  private baseUrl: string;
  private timeout: number;

  constructor(config?: Partial<ScoutApiConfig>) {
    this.baseUrl = config?.baseUrl || SCOUT_API_URL;
    this.timeout = config?.timeout || 30000;
  }

  private async fetchWithTimeout(url: string, options: RequestInit = {}): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          url.searchParams.append(key, params[key].toString());
        }
      });
    }

    const response = await this.fetchWithTimeout(url.toString());
    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.fetchWithTimeout(`${this.baseUrl}${endpoint}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  }
}

// Create singleton instance
export const scoutApi = new ScoutApiService();

// Convenience methods for common endpoints
export const ScoutEndpoints = {
  // Geography
  regions: '/geography/regions',
  provinces: '/geography/provinces',
  cities: '/geography/cities',
  barangays: '/geography/barangays',
  
  // Sales & Performance
  salesByRegion: '/sales/by-region',
  salesByBrand: '/sales/by-brand',
  salesByCategory: '/sales/by-category',
  salesTrends: '/sales/trends',
  
  // Products
  topSellingProducts: '/products/top-selling',
  productsByCategory: '/products/by-category',
  brandPerformance: '/products/brand-performance',
  
  // Stores
  storesByRegion: '/stores/by-region',
  storePerformance: '/stores/performance',
  
  // Transactions
  transactionSummary: '/transactions/summary',
  transactionTrends: '/transactions/trends',
  
  // Analytics
  competitiveAnalysis: '/analytics/competitive',
  marketShare: '/analytics/market-share',
  regionalPreferences: '/analytics/regional-preferences',
};

export default scoutApi;