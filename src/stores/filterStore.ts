
import { create } from 'zustand';

interface FilterState {
  filters: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  getActiveFilters: () => Record<string, string>;
}

export const useFilterStore = create<FilterState>((set, get) => ({
  filters: {
    timePeriod: 'last-30-days',
  },
  
  setFilter: (key: string, value: string) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),
  
  clearFilters: () =>
    set({
      filters: {
        timePeriod: 'last-30-days',
      },
    }),
  
  getActiveFilters: () => {
    const { filters } = get();
    return Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value && value !== '')
    );
  },
}));
