
import React from 'react';
import { Card } from '@/components/ui/card';
import { useRegionalPerformance } from '@/hooks/useFMCGData';
import { Skeleton } from '@/components/ui/skeleton';

const TransactionTrends = () => {
  const { data: regionalData, isLoading } = useRegionalPerformance();

  const totalTransactions = regionalData?.reduce((sum, region) => sum + region.transaction_count, 0) || 0;
  const avgBasket = regionalData?.reduce((sum, region) => sum + region.avg_transaction_value, 0) / (regionalData?.length || 1) || 0;
  const topRegion = regionalData?.[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Transaction Trends</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Daily Transactions</h3>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-3xl font-bold text-blue-600">{Math.round(totalTransactions / 30).toLocaleString()}</p>
          )}
          <p className="text-sm text-green-600">Avg per day</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Average Basket</h3>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-3xl font-bold text-purple-600">₱{avgBasket.toFixed(0)}</p>
          )}
          <p className="text-sm text-green-600">Per transaction</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Top Region</h3>
          {isLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-3xl font-bold text-orange-600">{topRegion?.region_name || 'N/A'}</p>
          )}
          <p className="text-sm text-gray-600">Best performance</p>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Regional Performance</h3>
        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between p-3 border rounded">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))
          ) : (
            regionalData?.slice(0, 8).map((region) => (
              <div key={region.region_name} className="flex items-center justify-between p-3 border rounded hover:bg-gray-50">
                <div>
                  <span className="font-medium">{region.region_name}</span>
                  <p className="text-sm text-gray-600">Top category: {region.top_category}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">₱{(region.total_sales / 1000).toFixed(0)}K</p>
                  <p className="text-sm text-gray-600">{region.transaction_count} txns</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">₱{region.avg_transaction_value.toFixed(0)}</p>
                  <p className="text-xs text-gray-500">avg basket</p>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};

export default TransactionTrends;
