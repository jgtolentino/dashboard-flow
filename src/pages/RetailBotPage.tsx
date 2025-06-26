
import React from 'react';
import { Card } from '@/components/ui/card';
import { MessageSquare, Bot, TrendingUp } from 'lucide-react';

const RetailBotPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Retail Assistant</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <Bot className="h-8 w-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">AI Insights</h3>
              <p className="text-sm text-gray-600">Get intelligent recommendations</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <MessageSquare className="h-8 w-8 text-green-600" />
            <div>
              <h3 className="text-lg font-semibold">Chat Support</h3>
              <p className="text-sm text-gray-600">Ask questions about your data</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-8 w-8 text-purple-600" />
            <div>
              <h3 className="text-lg font-semibold">Trend Analysis</h3>
              <p className="text-sm text-gray-600">Identify market opportunities</p>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Chat with Retail Assistant</h3>
        <div className="border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center">
          <div className="text-center">
            <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Retail Assistant will be available here</p>
            <p className="text-sm text-gray-400 mt-2">Ask about sales trends, product performance, or market insights</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RetailBotPage;
