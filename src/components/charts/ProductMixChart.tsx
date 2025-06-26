
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const ProductMixChart = () => {
  const categoryData = [
    { name: 'Beverages', value: 35, color: '#3b82f6' },
    { name: 'Snacks', value: 25, color: '#ef4444' },
    { name: 'Tobacco', value: 20, color: '#10b981' },
    { name: 'Personal Care', value: 15, color: '#f59e0b' },
    { name: 'Others', value: 5, color: '#8b5cf6' }
  ];

  const skuPerformanceData = [
    { sku: 'Coca-Cola 500ml', sales: 156000, transactions: 890 },
    { sku: 'Marlboro Red', sales: 134000, transactions: 670 },
    { sku: 'Lays Chips', sales: 89000, transactions: 450 },
    { sku: 'Pantene Shampoo', sales: 67000, transactions: 320 },
    { sku: 'Lucky Me Noodles', sales: 54000, transactions: 280 }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Product Mix by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
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
          <CardTitle>Top SKU Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={skuPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sku" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="sales" fill="#3b82f6" name="Sales (₱)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
