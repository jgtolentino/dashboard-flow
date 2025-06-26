
import React from 'react';
import { CascadingFilters } from '@/components/filters/CascadingFilters';
import { TransactionTrendsChart } from '@/components/charts/TransactionTrendsChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const TransactionTrends = () => {
  const valueDistributionData = [
    { range: '₱0-50', count: 45 },
    { range: '₱51-100', count: 123 },
    { range: '₱101-200', count: 189 },
    { range: '₱201-500', count: 234 },
    { range: '₱501-1000', count: 156 },
    { range: '₱1000+', count: 67 },
  ];

  const durationData = [
    { location: 'Manila', avgDuration: 2.3, medianDuration: 2.1 },
    { location: 'Quezon City', avgDuration: 1.8, medianDuration: 1.7 },
    { location: 'Makati', avgDuration: 2.1, medianDuration: 2.0 },
    { location: 'Davao', avgDuration: 2.8, medianDuration: 2.5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Transaction Trends Analysis</h1>
      </div>

      <CascadingFilters />
      
      <TransactionTrendsChart />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Transaction Value Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={valueDistributionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="range" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transaction Duration by Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={durationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="avgDuration" fill="#ef4444" name="Avg Duration (min)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Key Insights & Patterns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900">Peak Hours</h4>
              <p className="text-sm text-blue-700 mt-2">
                Highest activity: 2-4 PM with 167 avg transactions/hour. Consider increasing staff during these hours.
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-900">Transaction Size</h4>
              <p className="text-sm text-green-700 mt-2">
                Most transactions (234) fall in ₱201-500 range. Average basket value is ₱347.
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-900">Duration Patterns</h4>
              <p className="text-sm text-yellow-700 mt-2">
                Davao shows longest transaction times (2.8 min avg). May indicate process optimization opportunities.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionTrends;
