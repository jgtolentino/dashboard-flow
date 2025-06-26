
import React from 'react';
import { Card } from '@/components/ui/card';

const TransactionTrends = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Transaction Trends</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Daily Transactions</h3>
          <p className="text-3xl font-bold text-blue-600">1,842</p>
          <p className="text-sm text-green-600">+12% vs yesterday</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Average Basket</h3>
          <p className="text-3xl font-bold text-purple-600">₱158</p>
          <p className="text-sm text-green-600">+5% vs last week</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Peak Hours</h3>
          <p className="text-3xl font-bold text-orange-600">2-4 PM</p>
          <p className="text-sm text-gray-600">Weekend pattern</p>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Transaction Volume by Time</h3>
        <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">Chart will render here</p>
        </div>
      </Card>
    </div>
  );
};

export default TransactionTrends;
