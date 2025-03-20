// components/ClientsAnalysis.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IndianRupee, Weight } from 'lucide-react';
import { formatIndianNumber } from '@/lib/utils';

interface Client {
  client: {
    id: number;
    name: string;
  };
  transaction_count: number;
  total_quantity?: number;
  total_price?: number;
}

interface ClientsAnalysisProps {
  unloadingClients: Client[];
  unloadingClientsByPrice: Client[];
}

// Format Y-axis ticks
const formatYAxis = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(0)}M`;
  }
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return value.toString();
};

// Custom tooltip component
const CustomTooltip = ({ active, payload, label, isPrice = false }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm text-muted-foreground">
        {isPrice ? '₹' : ''}{formatIndianNumber(Number(payload[0].value).toFixed(2))}
        {!isPrice ? ' MT' : ''}
      </p>
      <p className="text-sm text-muted-foreground">
        Transactions: {payload[0].payload.transactions}
      </p>
    </div>
  );
};

const ClientsAnalysis: React.FC<ClientsAnalysisProps> = ({ unloadingClients, unloadingClientsByPrice }) => {
  const formatClientsForChart = (clients: Client[], metric: 'total_quantity' | 'total_price') => {
    return clients
      .filter(client => client[metric] !== undefined && client[metric] > 0)
      .sort((a, b) => (b[metric] || 0) - (a[metric] || 0))
      .slice(0, 10)
      .map(client => ({
        name: client.client.name,
        value: client[metric],
        transactions: client.transaction_count
      }));
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Clients Analysis</CardTitle>
        <CardDescription>Top clients by transaction volume and value</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="unloading-quantity">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="unloading-quantity" className="flex items-center">
              <Weight className="mr-2 h-4 w-4" />
              By Quantity
            </TabsTrigger>
            <TabsTrigger value="unloading-price" className="flex items-center">
              <IndianRupee className="mr-2 h-4 w-4" />
              By Value
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="unloading-quantity" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={formatClientsForChart(unloadingClients, 'total_quantity')}
                margin={{ 
                  top: 5, 
                  right: 5, 
                  left: -10,
                  bottom: 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tickFormatter={formatYAxis}
                  tick={{ fontSize: 12 }}
                  width={50}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: 'var(--border)', opacity: 0.2 }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#3b82f6" 
                  name="Unloading Quantity"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="unloading-price" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={formatClientsForChart(unloadingClientsByPrice, 'total_price')}
                margin={{ 
                  top: 5, 
                  right: 5, 
                  left: -10,
                  bottom: 5 
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  tickFormatter={formatYAxis}
                  tick={{ fontSize: 12 }}
                  width={50}
                />
                <Tooltip 
                  content={<CustomTooltip isPrice={true} />}
                  cursor={{ fill: 'var(--border)', opacity: 0.2 }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Bar 
                  dataKey="value" 
                  fill="#f59e0b" 
                  name="Unloading Value"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ClientsAnalysis;