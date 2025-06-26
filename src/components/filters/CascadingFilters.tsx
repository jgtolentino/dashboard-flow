
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Calendar, CalendarDays } from 'lucide-react';
import { useFilterStore } from '@/stores/filterStore';

interface FilterOption {
  value: string;
  label: string;
}

export const CascadingFilters = () => {
  const { filters, setFilter, clearFilters } = useFilterStore();
  const [options, setOptions] = useState<Record<string, FilterOption[]>>({});

  // Mock data - in real implementation, these would come from API
  const mockData = {
    region: [
      { value: 'ncr', label: 'NCR' },
      { value: 'calabarzon', label: 'Calabarzon' },
      { value: 'central-luzon', label: 'Central Luzon' },
      { value: 'mindanao', label: 'Mindanao' },
    ],
    city: {
      ncr: [
        { value: 'manila', label: 'Manila' },
        { value: 'quezon-city', label: 'Quezon City' },
        { value: 'makati', label: 'Makati' },
      ],
      mindanao: [
        { value: 'davao', label: 'Davao' },
        { value: 'cagayan-de-oro', label: 'Cagayan de Oro' },
      ],
    },
    category: [
      { value: 'beverages', label: 'Beverages' },
      { value: 'snacks', label: 'Snacks' },
      { value: 'cigarettes', label: 'Cigarettes' },
      { value: 'haircare', label: 'Haircare' },
    ],
    brand: {
      beverages: [
        { value: 'coca-cola', label: 'Coca-Cola' },
        { value: 'pepsi', label: 'Pepsi' },
      ],
      snacks: [
        { value: 'lays', label: 'Lays' },
        { value: 'pringles', label: 'Pringles' },
      ],
    },
  };

  useEffect(() => {
    setOptions({
      region: mockData.region,
      city: filters.region ? mockData.city[filters.region as keyof typeof mockData.city] || [] : [],
      category: mockData.category,
      brand: filters.category ? mockData.brand[filters.category as keyof typeof mockData.brand] || [] : [],
    });
  }, [filters.region, filters.category]);

  const handleFilterChange = (level: string, value: string) => {
    setFilter(level, value);
    
    // Clear downstream filters when parent changes
    if (level === 'region') {
      setFilter('city', '');
    }
    if (level === 'category') {
      setFilter('brand', '');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={clearFilters}
          className="text-gray-600 hover:text-gray-900"
        >
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Geography Filters */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Region</label>
          <Select value={filters.region || ''} onValueChange={(value) => handleFilterChange('region', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Regions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Regions</SelectItem>
              {options.region?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">City</label>
          <Select 
            value={filters.city || ''} 
            onValueChange={(value) => handleFilterChange('city', value)}
            disabled={!filters.region}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Cities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Cities</SelectItem>
              {options.city?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Organization Filters */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Category</label>
          <Select value={filters.category || ''} onValueChange={(value) => handleFilterChange('category', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Categories</SelectItem>
              {options.category?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Brand</label>
          <Select 
            value={filters.brand || ''} 
            onValueChange={(value) => handleFilterChange('brand', value)}
            disabled={!filters.category}
          >
            <SelectTrigger>
              <SelectValue placeholder="All Brands" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Brands</SelectItem>
              {options.brand?.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Time Filters */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Time Period</label>
          <Select value={filters.timePeriod || 'last-30-days'} onValueChange={(value) => handleFilterChange('timePeriod', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="last-7-days">Last 7 Days</SelectItem>
              <SelectItem value="last-30-days">Last 30 Days</SelectItem>
              <SelectItem value="last-90-days">Last 90 Days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Day Type</label>
          <Select value={filters.dayType || ''} onValueChange={(value) => handleFilterChange('dayType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Days" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Days</SelectItem>
              <SelectItem value="weekday">Weekdays</SelectItem>
              <SelectItem value="weekend">Weekends</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
