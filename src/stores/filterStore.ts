
import { create } from 'zustand';
import { ScoutDataService } from '@/services/dataService';

interface FilterState {
  filters: Record<string, string>;
  filterOptions: Record<string, Array<{ value: string; label: string; count: number }>>;
  isLoading: boolean;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  getActiveFilters: () => Record<string, string>;
  loadFilterOptions: (filterType: string, parentFilter?: Record<string, string>) => Promise<void>;
  initializeFilters: () => Promise<void>;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: {
    timePeriod: 'last-30-days',
    region: '',
    city: '',
    category: '',
    brand: '',
    startDate: '',
    endDate: ''
  },
  
  filterOptions: {
    regions: [],
    cities: [],
    categories: [],
    brands: []
  },
  
  isLoading: false,
  
  setFilter: (key: string, value: string) => {
    set((state) => {
      const newFilters = {
        ...state.filters,
        [key]: value,
      };
      
      // Clear dependent filters when parent changes
      if (key === 'region') {
        newFilters.city = '';
      }
      if (key === 'category') {
        newFilters.brand = '';
      }
      
      return { filters: newFilters };
    });
    
    // Load dependent filter options
    const { filters } = get();
    if (key === 'region' && value) {
      get().loadFilterOptions('cities', { region: value });
    }
    if (key === 'category' && value) {
      get().loadFilterOptions('brands', { category: value });
    }
  },
  
  clearFilters: () => {
    set({
      filters: {
        timePeriod: 'last-30-days',
        region: '',
        city: '',
        category: '',
        brand: '',
        startDate: '',
        endDate: ''
      },
    });
    // Reload base filter options
    get().initializeFilters();
  },
  
  getActiveFilters: () => {
    const { filters } = get();
    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value && value !== '')
    );
  },
  
  loadFilterOptions: async (filterType: string, parentFilter?: Record<string, string>) => {
    set({ isLoading: true });
    
    try {
      const options = await ScoutDataService.getFilterOptions(
        filterType as 'regions' | 'cities' | 'categories' | 'brands',
        parentFilter || {}
      );
      
      set((state) => ({
        filterOptions: {
          ...state.filterOptions,
          [filterType]: options
        },
        isLoading: false
      }));
    } catch (error) {
      console.error(`Error loading ${filterType} options:`, error);
      set({ isLoading: false });
    }
  },
  
  initializeFilters: async () => {
    set({ isLoading: true });
    
    try {
      // Load all base filter options in parallel
      const [regions, categories] = await Promise.all([
        ScoutDataService.getFilterOptions('regions'),
        ScoutDataService.getFilterOptions('categories')
      ]);
      
      set({
        filterOptions: {
          regions,
          cities: [],
          categories,
          brands: []
        },
        isLoading: false
      });
    } catch (error) {
      console.error('Error initializing filters:', error);
      set({ isLoading: false });
    }
  }
}));
