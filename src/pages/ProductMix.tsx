
import React from 'react';
import { Card } from '@/components/ui/card';
import { useBrandPerformance, useFMCGCategories } from '@/hooks/useFMCGData';
import { Skeleton } from '@/components/ui/skeleton';

const ProductMix = () => {
  const { data: brandData, isLoading: brandLoading } = useBrandPerformance();
  const { data: categoryData, isLoading: categoryLoading } = useFMCGCategories();

  const topCategories = categoryData?.slice(0, 4) || [];
  const topBrands = brandData?.slice(0, 3) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Product Mix Analysis</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categoryLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-6 w-32 mb-2" />
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-4 w-24" />
            </Card>
          ))
        ) : (
          topCategories.map((category, index) => {
            const colors = ['blue', 'green', 'purple', 'orange'];
            const color = colors[index % colors.length];
            return (
              <Card key={category.category} className="p-6">
                <h3 className="text-lg font-semibold mb-2">{category.category}</h3>
                <p className={`text-2xl font-bold text-${color}-600`}>
                  {((category.brand_count / (categoryData?.reduce((sum, c) => sum + c.brand_count, 0) || 1)) * 100).toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600">{category.brand_count} brands</p>
              </Card>
            );
          })
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Brands by Performance</h3>
          <div className="space-y-3">
            {brandLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : (
              topBrands.map((brand) => (
                <div key={brand.brand_name} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{brand.brand_name}</span>
                  <span className="text-sm text-blue-600">{brand.market_share_percent.toFixed(1)}%</span>
                </div>
              ))
            )}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Category Distribution</h3>
          <div className="space-y-3">
            {categoryLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : (
              categoryData?.map((category) => (
                <div key={category.category} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{category.category}</span>
                  <div className="text-right">
                    <span className="text-sm font-medium">{category.client_brands} client</span>
                    <span className="text-xs text-gray-500 ml-1">/ {category.competitor_brands} comp</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductMix;
