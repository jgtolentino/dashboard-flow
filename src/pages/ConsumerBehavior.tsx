
import React from 'react';
import { CascadingFilters } from '@/components/filters/CascadingFilters';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ConsumerBehavior = () => {
  const requestMethodData = [
    { name: 'Branded Request', value: 45, color: '#3b82f6' },
    { name: 'Category Request', value: 35, color: '#ef4444' },
    { name: 'Pointing/Visual', value: 15, color: '#10b981' },
    { name: 'Store Owner Suggestion', value: 5, color: '#f59e0b' },
  ];

  const demographicData = [
    { ageGroup: '18-25', male: 120, female: 180 },
    { ageGroup: '26-35', male: 200, female: 160 },
    { ageGroup: '36-45', male: 150, female: 140 },
    { ageGroup: '46-55', male: 100, female: 120 },
    { ageGroup: '55+', male: 80, female: 100 },
  ];

  const suggestionAcceptanceData = [
    { category: 'Beverages', accepted: 65, rejected: 35 },
    { category: 'Snacks', accepted: 72, rejected: 28 },
    { category: 'Cigarettes', accepted: 45, rejected: 55 },
    { category: 'Haircare', accepted: 80, rejected: 20 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Consumer Behavior & Preferences</h1>
      </div>

      <CascadingFilters />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Product Request Methods</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={requestMethodData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {requestMethodData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Demographics by Age & Gender</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demographicData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="ageGroup" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="male" fill="#3b82f6" name="Male" />
                  <Bar dataKey="female" fill="#ef4444" name="Female" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Store Owner Suggestion Acceptance Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={suggestionAcceptanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="category" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="accepted" fill="#10b981" name="Accepted %" />
                <Bar dataKey="rejected" fill="#ef4444" name="Rejected %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Brand Loyalty Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">High Brand Loyalty</span>
                <span className="text-sm font-semibold">45%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Category Shopping</span>
                <span className="text-sm font-semibold">35%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Price Sensitive</span>
                <span className="text-sm font-semibold">20%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Decision Factors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm">Brand Preference</span>
                <span className="text-sm font-semibold">40%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Price</span>
                <span className="text-sm font-semibold">30%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Availability</span>
                <span className="text-sm font-semibold">20%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Store Recommendation</span>
                <span className="text-sm font-semibold">10%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Shopping Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-xs font-medium text-blue-900">Peak Shopping</p>
                <p className="text-xs text-blue-700">Lunch hours (12-2 PM)</p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <p className="text-xs font-medium text-green-900">Impulse Buying</p>
                <p className="text-xs text-green-700">28% add unplanned items</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded">
                <p className="text-xs font-medium text-yellow-900">Repeat Customers</p>
                <p className="text-xs text-yellow-700">65% shop 3+ times/week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConsumerBehavior;
