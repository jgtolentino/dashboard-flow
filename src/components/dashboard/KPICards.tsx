
import React from 'react';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart, Users, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative' | 'neutral';
  icon: React.ElementType;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, change, changeType, icon: Icon }) => {
  const changeColor = changeType === 'positive' ? 'text-green-600' : changeType === 'negative' ? 'text-red-600' : 'text-gray-600';
  const changeIcon = changeType === 'positive' ? TrendingUp : changeType === 'negative' ? TrendingDown : BarChart3;
  const ChangeIcon = changeIcon;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-400" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        <div className={`flex items-center text-xs ${changeColor} mt-1`}>
          <ChangeIcon className="w-3 h-3 mr-1" />
          {change}
        </div>
      </CardContent>
    </Card>
  );
};

export const KPICards = () => {
  const kpis = [
    {
      title: 'Total Sales',
      value: '₱1.2M',
      change: '+14.7% vs last month',
      changeType: 'positive' as const,
      icon: DollarSign,
    },
    {
      title: 'Transactions',
      value: '3,456',
      change: '+8.2% vs last month',
      changeType: 'positive' as const,
      icon: ShoppingCart,
    },
    {
      title: 'Avg Basket Value',
      value: '₱347',
      change: '+5.1% vs last month',
      changeType: 'positive' as const,
      icon: BarChart3,
    },
    {
      title: 'Active Customers',
      value: '2,847',
      change: '-2.4% vs last month',
      changeType: 'negative' as const,
      icon: Users,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  );
};
