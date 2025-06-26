
import React from 'react';
import { Card } from '@/components/ui/card';
import { useStorePerformance, useCompetitiveAnalysis } from '@/hooks/useFMCGData';
import { Skeleton } from '@/components/ui/skeleton';

const ConsumerBehavior = () => {
  const { data: storeData, isLoading: storeLoading } = useStorePerformance();
  const { data: competitiveData, isLoading: competitiveLoading } = useCompetitiveAnalysis();

  const avgVisitFreq = storeData?.reduce((sum, store) => sum + store.monthly_transactions, 0) / (storeData?.length || 1) / 30 || 0;
  const topTierStores = storeData?.filter(store => store.performance_tier === 'High') || [];
  const storesWithFridge = storeData?.filter(store => store.has_refrigerator) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Consumer Behavior</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Avg. Visit Frequency</h3>
          {storeLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-3xl font-bold text-blue-600">{avgVisitFreq.toFixed(1)}x</p>
          )}
          <p className="text-sm text-gray-600">per day</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Store Penetration</h3>
          {storeLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-3xl font-bold text-green-600">{((storesWithFridge.length / (storeData?.length || 1)) * 100).toFixed(0)}%</p>
          )}
          <p className="text-sm text-gray-600">have refrigeration</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Performance Tiers</h3>
          {storeLoading ? (
            <Skeleton className="h-8 w-24" />
          ) : (
            <p className="text-3xl font-bold text-orange-600">{topTierStores.length}</p>
          )}
          <p className="text-sm text-gray-600">high performers</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Store Performance Distribution</h3>
          <div className="space-y-3">
            {storeLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : (
              ['High', 'Medium', 'Low'].map((tier) => {
                const count = storeData?.filter(store => store.performance_tier === tier).length || 0;
                return (
                  <div key={tier} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{tier} Performance</span>
                    <span className="text-sm font-medium">{count} stores</span>
                  </div>
                );
              })
            )}
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Regional Distribution</h3>
          <div className="space-y-3">
            {storeLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
              ))
            ) : (
              storeData?.slice(0, 5).map((store) => (
                <div key={store.store_name} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{store.region_name}</span>
                  <span className="text-sm font-medium">₱{(store.avg_transaction_value).toFixed(0)}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConsumerBehavior;
