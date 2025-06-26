
import React from 'react';
import { Card } from '@/components/ui/card';

const ConsumerBehavior = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Consumer Behavior</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Avg. Visit Frequency</h3>
          <p className="text-3xl font-bold text-blue-600">3.2x</p>
          <p className="text-sm text-gray-600">per week</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Brand Loyalty</h3>
          <p className="text-3xl font-bold text-green-600">67%</p>
          <p className="text-sm text-gray-600">repeat purchases</p>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-2">Price Sensitivity</h3>
          <p className="text-3xl font-bold text-orange-600">Medium</p>
          <p className="text-sm text-gray-600">substitution rate</p>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Shopping Patterns</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Morning (6-12PM)</span>
              <span className="text-sm font-medium">35%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Afternoon (12-6PM)</span>
              <span className="text-sm font-medium">45%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Evening (6-10PM)</span>
              <span className="text-sm font-medium">20%</span>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Demographics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">18-25 years</span>
              <span className="text-sm font-medium">22%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">26-35 years</span>
              <span className="text-sm font-medium">35%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">36+ years</span>
              <span className="text-sm font-medium">43%</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ConsumerBehavior;
