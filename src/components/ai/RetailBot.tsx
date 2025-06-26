
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquare, Send, Lightbulb, TrendingUp, Package, Users } from 'lucide-react';
import { useFilterStore } from '@/stores/filterStore';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export const RetailBot = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your Retail Analytics Assistant. I can help you analyze sales trends, product performance, and consumer behavior. What would you like to know?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { filters } = useFilterStore();

  const quickActions = [
    { label: 'Top SKUs in location', icon: Package },
    { label: 'Peak hours analysis', icon: TrendingUp },
    { label: 'Consumer behavior insights', icon: Users },
    { label: 'Optimization recommendations', icon: Lightbulb },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Mock AI response - in real implementation, this would call your AI API
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: generateMockResponse(input, filters),
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  const generateMockResponse = (query: string, currentFilters: Record<string, string>) => {
    const context = Object.entries(currentFilters)
      .filter(([_, value]) => value && value !== '')
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    const contextText = context ? `Based on your current filters (${context}), ` : '';

    if (query.toLowerCase().includes('top sku')) {
      return `${contextText}here are the top performing SKUs:
      
1. **Coca-Cola 500ml** - ₱156K sales, 890 transactions
2. **Lays Classic 40g** - ₱134K sales, 780 transactions  
3. **Marlboro Red** - ₱120K sales, 650 transactions

*Recommendation: Focus on bundling Coca-Cola with Lays as they show strong co-purchase patterns.*`;
    }

    if (query.toLowerCase().includes('peak') || query.toLowerCase().includes('hour')) {
      return `${contextText}your peak transaction hours are:
      
📈 **Highest Activity**: 2-4 PM (167 avg transactions/hour)
📊 **Secondary Peak**: 12-1 PM (150 avg transactions/hour)
📉 **Lowest Activity**: 6-8 AM (45-78 transactions/hour)

*Recommendation: Increase staff by 30% during 2-4 PM peak to reduce wait times and improve customer satisfaction.*`;
    }

    return `${contextText}I can help you analyze various aspects of your retail data. Try asking about:
    
• Sales trends and patterns
• Product performance comparisons
• Customer behavior insights
• Operational optimization recommendations
• Market opportunities

What specific area would you like to explore?`;
  };

  const handleQuickAction = (action: string) => {
    setInput(action);
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MessageSquare className="h-5 w-5 mr-2 text-blue-600" />
          Retail Analytics Assistant
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickAction(action.label)}
              className="text-xs"
            >
              <action.icon className="h-3 w-3 mr-1" />
              {action.label}
            </Button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto mb-4 space-y-4 min-h-0">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-blue-50 ml-12 border-l-2 border-blue-500'
                  : 'bg-gray-50 mr-12 border-l-2 border-gray-300'
              }`}
            >
              <div className="font-medium mb-1 text-sm">
                {message.role === 'user' ? 'You' : 'AI Assistant'}
              </div>
              <div className="text-sm whitespace-pre-line">{message.content}</div>
            </div>
          ))}
          
          {isLoading && (
            <div className="bg-gray-50 mr-12 p-3 rounded-lg border-l-2 border-gray-300">
              <div className="font-medium mb-1 text-sm">AI Assistant</div>
              <div className="text-sm text-gray-500">Analyzing your data...</div>
            </div>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about sales trends, product performance, consumer insights..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
