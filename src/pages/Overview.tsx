
import React from 'react';
import { Card } from '@/components/ui/card';
import { useRegionalPerformance, useBrandPerformance, useClientBrands } from '@/hooks/useFMCGData';
import { Skeleton } from '@/components/ui/skeleton';

const Overview = () => {
  const { data: regionalData, isLoading: regionalLoading } = useRegionalPerformance();
  const { data: brandData, isLoading: brandLoading } = useBrandPerformance();
  const { data: clientBrands, isLoading: brandsLoading } = useClientBrands();

  const totalSales = regionalData?.reduce((sum, region) => sum + region.total_sales, 0) || 0;
  const totalTransactions = regionalData?.reduce((sum, region) => sum + region.transaction_count, 0) || 0;
  const avgTransactionValue = totalSales > 0 ? totalSales / totalTransactions : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Scout Analytics Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Total Sales</p>
              {regionalLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">₱{(totalSales / 1000000).toFixed(1)}M</p>
              )}
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              {regionalLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{totalTransactions.toLocaleString()}</p>
              )}
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Active Stores</p>
              {regionalLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{regionalData?.length || 0}</p>
              )}
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Avg Transaction</p>
              {regionalLoading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <p className="text-3xl font-bold text-green-600">₱{avgTransactionValue.toFixed(0)}</p>
              )}
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Regions by Sales</h3>
          <div className="space-y-3">
            {regionalLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : (
              regionalData?.slice(0, 3).map((region) => (
                <div key={region.region_name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{region.region_name}</span>
                  <span className="text-sm font-medium">₱{(region.total_sales / 1000).toFixed(0)}K</span>
                </div>
              ))
            )}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Client Brands</h3>
          <div className="space-y-3">
            {brandsLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : (
              clientBrands?.slice(0, 5).map((brand) => (
                <div key={brand.id} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{brand.brand_name}</span>
                  <span className="text-sm font-medium">{brand.category}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
