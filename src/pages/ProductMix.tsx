
import React from 'react';
import { CascadingFilters } from '@/components/filters/CascadingFilters';
import { ProductMixChart } from '@/components/charts/ProductMixChart';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const ProductMix = () => {
  const substitutionData = [
    { original: 'Coca-Cola', substitute: 'Pepsi', frequency: '23%', reason: 'Out of stock' },
    { original: 'Lays', substitute: 'Pringles', frequency: '18%', reason: 'Price preference' },
    { original: 'Palmolive', substitute: 'Pantene', frequency: '15%', reason: 'Availability' },
    { original: 'Marlboro Red', substitute: 'Philip Morris', frequency: '12%', reason: 'Out of stock' },
  ];

  const bundleData = [
    { combo: 'Coca-Cola + Lays', frequency: '28%', lift: '+15%' },
    { combo: 'Cigarettes + Lighter', frequency: '45%', lift: '+22%' },
    { combo: 'Shampoo + Conditioner', frequency: '35%', lift: '+18%' },
    { combo: 'Energy Drink + Snack', frequency: '19%', lift: '+8%' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Product Mix & SKU Analysis</h1>
      </div>

      <CascadingFilters />
      
      <ProductMixChart />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Substitution Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Original Brand</TableHead>
                  <TableHead>Substitute</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {substitutionData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.original}</TableCell>
                    <TableCell>{item.substitute}</TableCell>
                    <TableCell>{item.frequency}</TableCell>
                    <TableCell>{item.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Product Bundles & Cross-sell</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Combo</TableHead>
                  <TableHead>Co-purchase Rate</TableHead>
                  <TableHead>Sales Lift</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bundleData.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{item.combo}</TableCell>
                    <TableCell>{item.frequency}</TableCell>
                    <TableCell className="text-green-600 font-semibold">{item.lift}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>SKU Performance Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-900">Top Performer</h4>
              <p className="text-sm text-green-700 mt-2">
                <strong>Coca-Cola 500ml</strong><br />
                ₱156K sales, 890 transactions<br />
                Consistent demand across all locations
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900">Growth Opportunity</h4>
              <p className="text-sm text-blue-700 mt-2">
                <strong>Premium Haircare</strong><br />
                High margin, low volume<br />
                Target urban locations for growth
              </p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
              <h4 className="font-semibold text-yellow-900">Bundle Recommendation</h4>
              <p className="text-sm text-yellow-700 mt-2">
                <strong>Beverages + Snacks</strong><br />
                28% co-purchase rate<br />
                +15% sales lift potential
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductMix;
