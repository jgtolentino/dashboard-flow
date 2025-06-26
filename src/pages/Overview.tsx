
import React from 'react';
import { CascadingFilters } from '@/components/filters/CascadingFilters';
import { KPICards } from '@/components/dashboard/KPICards';
import { TransactionTrendsChart } from '@/components/charts/TransactionTrendsChart';
import { ProductMixChart } from '@/components/charts/ProductMixChart';

const Overview = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Analytics Overview</h1>
        <div className="text-sm text-gray-500">
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <CascadingFilters />
      
      <KPICards />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <TransactionTrendsChart />
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-sm font-medium text-blue-900">Peak Hour Optimization</p>
                <p className="text-xs text-blue-700 mt-1">Increase staff during 2-4 PM peak by 30%</p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm font-medium text-green-900">Product Bundling</p>
                <p className="text-xs text-green-700 mt-1">Bundle Coca-Cola with Lays - 28% co-purchase rate</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <p className="text-sm font-medium text-yellow-900">Promotional Strategy</p>
                <p className="text-xs text-yellow-700 mt-1">Target high-margin SKUs in low-value areas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <ProductMixChart />
    </div>
  );
};

export default Overview;
