
import React from 'react';
import { RetailBot } from '@/components/ai/RetailBot';
import { CascadingFilters } from '@/components/filters/CascadingFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react';

const RetailBotPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">AI Retail Assistant</h1>
      </div>

      <CascadingFilters />
      
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <RetailBot />
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-500" />
                AI Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <h4 className="font-semibold text-blue-900 text-sm">Staff Optimization</h4>
                <p className="text-xs text-blue-700 mt-1">
                  Increase staff during 2-4 PM peak by 30% to reduce wait times
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <h4 className="font-semibold text-green-900 text-sm">Product Bundling</h4>
                <p className="text-xs text-green-700 mt-1">
                  Bundle Coca-Cola with Lays - 28% co-purchase rate detected
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <h4 className="font-semibold text-yellow-900 text-sm">Inventory Alert</h4>
                <p className="text-xs text-yellow-700 mt-1">
                  Low stock on Marlboro Red - high substitution rate to Philip Morris
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
                Performance Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sales Growth</span>
                <span className="text-sm font-semibold text-green-600">+14.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customer Retention</span>
                <span className="text-sm font-semibold text-blue-600">65%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Basket Value</span>
                <span className="text-sm font-semibold text-gray-900">₱347</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Peak Hour Efficiency</span>
                <span className="text-sm font-semibold text-yellow-600">78%</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 text-red-500" />
                Anomaly Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-2 bg-red-50 rounded text-xs">
                  <p className="font-medium text-red-900">Unusual Sales Drop</p>
                  <p className="text-red-700">Davao location - 15% decrease vs last week</p>
                </div>
                <div className="p-2 bg-yellow-50 rounded text-xs">
                  <p className="font-medium text-yellow-900">High Transaction Duration</p>
                  <p className="text-yellow-700">Average 2.8 min - investigate bottlenecks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RetailBotPage;
