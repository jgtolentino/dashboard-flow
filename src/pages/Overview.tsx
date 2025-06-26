
import React from 'react';
import { Card } from '@/components/ui/card';

const Overview = () => {
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
              <p className="text-3xl font-bold text-gray-900">₱2.4M</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Transactions</p>
              <p className="text-3xl font-bold text-gray-900">15,234</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Active Stores</p>
              <p className="text-3xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">Growth</p>
              <p className="text-3xl font-bold text-green-600">+24%</p>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Alaska Milk - NCR</span>
              <span className="text-sm font-medium">₱125,000</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Oishi Snacks - Region VII</span>
              <span className="text-sm font-medium">₱89,500</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Del Monte - Region III</span>
              <span className="text-sm font-medium">₱67,200</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Regions</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">NCR</span>
              <span className="text-sm font-medium">32.5%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Region VII</span>
              <span className="text-sm font-medium">18.2%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Region III</span>
              <span className="text-sm font-medium">14.8%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
