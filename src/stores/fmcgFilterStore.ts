
import { create } from 'zustand';
import { FMCGDataService } from '@/services/fmcgDataService';

interface FMCGFilterState {
  filters: {
    timePeriod: string;
    region: string;
    category: string;
    clientBrand: string;
    storeType: string;
    startDate: string;
    endDate: string;
  };
  
  filterOptions: {
    regions: Array<{ value: string; label: string; count: number }>;
    categories: Array<{ value: string; label: string; count: number }>;
    clientBrands: Array<{ value: string; label: string; count: number }>;
    storeTypes: Array<{ value: string; label: string; count: number }>;
  };
  
  isLoading: boolean;
  
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  getActiveFilters: () => Record<string, string>;
  loadFilterOptions: () => Promise<void>;
  initializeFilters: () => Promise<void>;
}

export const useFMCGFilterStore = create<FMCGFilterState>((set, get) => ({
  filters: {
    timePeriod: 'last-30-days',
    region: '',
    category: '',
    clientBrand: '',
    storeType: '',
    startDate: '',
    endDate: ''
  },
  
  filterOptions: {
    regions: [],
    categories: [],
    clientBrands: [],
    storeTypes: [
      { value: 'Sari-Sari', label: 'Sari-Sari Store', count: 0 },
      { value: 'Mini-Mart', label: 'Mini Mart', count: 0 },
      { value: 'Convenience', label: 'Convenience Store', count: 0 }
    ]
  },
  
  isLoading: false,
  
  setFilter: (key: string, value: string) => {
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      }
    }));
  },
  
  clearFilters: () => {
    set({
      filters: {
        timePeriod: 'last-30-days',
        region: '',
        category: '',
        clientBrand: '',
        storeType: '',
        startDate: '',
        endDate: ''
      },
    });
  },
  
  getActiveFilters: () => {
    const { filters } = get();
    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value && value !== '')
    );
  },
  
  loadFilterOptions: async () => {
    set({ isLoading: true });
    
    try {
      const [geography, categories, clientBrands] = await Promise.all([
        FMCGDataService.getGeographyHierarchy(),
        FMCGDataService.getFMCGCategories(),
        FMCGDataService.getClientBrands()
      ]);
      
      const regionOptions = geography.regions.map(region => ({
        value: region.region_name,
        label: region.region_name,
        count: 0 // Would need additional query to get counts
      }));
      
      const categoryOptions = categories.map(cat => ({
        value: cat.category,
        label: cat.category,
        count: cat.brand_count
      }));
      
      const clientBrandOptions = clientBrands.map(brand => ({
        value: brand.brand_name,
        label: `${brand.brand_name} (${brand.company_name})`,
        count: 0 // Would need additional query to get counts
      }));
      
      set({
        filterOptions: {
          regions: regionOptions,
          categories: categoryOptions,
          clientBrands: clientBrandOptions,
          storeTypes: [
            { value: 'Sari-Sari', label: 'Sari-Sari Store', count: 0 },
            { value: 'Mini-Mart', label: 'Mini Mart', count: 0 },
            { value: 'Convenience', label: 'Convenience Store', count: 0 }
          ]
        },
        isLoading: false
      });
    } catch (error) {
      console.error('Error loading filter options:', error);
      set({ isLoading: false });
    }
  },
  
  initializeFilters: async () => {
    await get().loadFilterOptions();
  }
}));
