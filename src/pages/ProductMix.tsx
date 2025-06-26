
import React from 'react';
import { Card } from '@/components/ui/card';

const ProductMix = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Product Mix Analysis</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Dairy Products</h3>
          <p className="text-2xl font-bold text-blue-600">28.5%</p>
          <p className="text-sm text-gray-600">Market share</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Snacks</h3>
          <p className="text-2xl font-bold text-green-600">22.1%</p>
          <p className="text-sm text-gray-600">Market share</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Beverages</h3>
          <p className="text-2xl font-bold text-purple-600">18.7%</p>
          <p className="text-sm text-gray-600">Market share</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Personal Care</h3>
          <p className="text-2xl font-bold text-orange-600">15.2%</p>
          <p className="text-sm text-gray-600">Market share</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Brands</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Alaska</span>
              <span className="text-sm text-blue-600">24.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Oishi</span>
              <span className="text-sm text-green-600">18.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Del Monte</span>
              <span className="text-sm text-purple-600">16.8%</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
          <div className="h-48 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
            <p className="text-gray-500">Product mix chart will render here</p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ProductMix;
