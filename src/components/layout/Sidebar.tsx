
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, TrendingUp, Package, Users, MessageSquare, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Overview',
    icon: Home,
    href: '/',
  },
  {
    title: 'Transaction Trends',
    icon: TrendingUp,
    href: '/transaction-trends',
  },
  {
    title: 'Product Mix',
    icon: Package,
    href: '/product-mix',
  },
  {
    title: 'Consumer Behavior',
    icon: Users,
    href: '/consumer-behavior',
  },
  {
    title: 'Retail Assistant',
    icon: MessageSquare,
    href: '/retail-bot',
  },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <BarChart3 className="h-8 w-8 text-blue-600" />
          <span className="text-xl font-bold text-gray-900">Scout Analytics</span>
        </div>
      </div>
      
      <nav className="mt-8">
        <div className="px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  'group flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 flex-shrink-0',
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.title}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
