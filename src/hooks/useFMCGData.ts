
import { useQuery } from '@tanstack/react-query';
import { FMCGDataService } from '@/services/fmcgDataService';

export const useRegionalPerformance = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['regional-performance', startDate, endDate],
    queryFn: () => FMCGDataService.getRegionalPerformance(startDate, endDate),
  });
};

export const useBrandPerformance = (startDate?: string, endDate?: string, category?: string) => {
  return useQuery({
    queryKey: ['brand-performance', startDate, endDate, category],
    queryFn: () => FMCGDataService.getBrandPerformance(startDate, endDate, category),
  });
};

export const useStorePerformance = (region?: string, limit = 50) => {
  return useQuery({
    queryKey: ['store-performance', region, limit],
    queryFn: () => FMCGDataService.getStorePerformance(region, limit),
  });
};

export const useCompetitiveAnalysis = (clientBrand?: string) => {
  return useQuery({
    queryKey: ['competitive-analysis', clientBrand],
    queryFn: () => FMCGDataService.getCompetitiveAnalysis(clientBrand),
  });
};

export const useClientBrands = () => {
  return useQuery({
    queryKey: ['client-brands'],
    queryFn: () => FMCGDataService.getClientBrands(),
  });
};

export const useFMCGCategories = () => {
  return useQuery({
    queryKey: ['fmcg-categories'],
    queryFn: () => FMCGDataService.getFMCGCategories(),
  });
};
