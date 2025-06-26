
import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const mockHourlyData = [
  { hour: '6AM', transactions: 45, sales: 15600, avgValue: 347 },
  { hour: '7AM', transactions: 78, sales: 27060, avgValue: 347 },
  { hour: '8AM', transactions: 120, sales: 41640, avgValue: 347 },
  { hour: '9AM', transactions: 95, sales: 32965, avgValue: 347 },
  { hour: '10AM', transactions: 87, sales: 30189, avgValue: 347 },
  { hour: '11AM', transactions: 110, sales: 38170, avgValue: 347 },
  { hour: '12PM', transactions: 156, sales: 54132, avgValue: 347 },
  { hour: '1PM', transactions: 145, sales: 50315, avgValue: 347 },
  { hour: '2PM', transactions: 167, sales: 57949, avgValue: 347 },
  { hour: '3PM', transactions: 134, sales: 46498, avgValue: 347 },
  { hour: '4PM', transactions: 112, sales: 38864, avgValue: 347 },
  { hour: '5PM', transactions: 89, sales: 30883, avgValue: 347 },
  { hour: '6PM', transactions: 145, sales: 50315, avgValue: 347 },
  { hour: '7PM', transactions: 123, sales: 42681, avgValue: 347 },
  { hour: '8PM', transactions: 98, sales: 34006, avgValue: 347 },
  { hour: '9PM', transactions: 67, sales: 23249, avgValue: 347 },
];

export const TransactionTrendsChart = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="hourly" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hourly">Hourly</TabsTrigger>
            <TabsTrigger value="daily">Daily</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>
          
          <TabsContent value="hourly" className="space-y-4">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockHourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="transactions" fill="#3b82f6" name="Transactions" />
                  <Line yAxisId="right" type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={2} name="Sales (₱)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="daily" className="space-y-4">
            <div className="h-80 flex items-center justify-center text-gray-500">
              Daily trends chart would be implemented here
            </div>
          </TabsContent>
          
          <TabsContent value="weekly" className="space-y-4">
            <div className="h-80 flex items-center justify-center text-gray-500">
              Weekly trends chart would be implemented here
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
