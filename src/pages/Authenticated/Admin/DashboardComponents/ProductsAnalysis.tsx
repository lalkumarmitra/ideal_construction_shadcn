// components/ProductsAnalysis.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { Package, TrendingUp } from 'lucide-react';
import { formatIndianNumber } from '@/lib/utils';

interface Product {
  product: {
    id: number;
    name: string;
  };
  transaction_count: number;
  total_value?: number;
  total_unloading_quantity?: number;
  average_expense: number;
}

interface ProductsAnalysisProps {
  productsByValue: Product[];
  productsByQuantity: Product[];
}

const CHART_COLORS = {
  primary: ['#1d4ed8', '#2563eb', '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'],
  secondary: ['#d97706', '#f59e0b', '#fbbf24', '#fcd34d', '#fde68a', '#fef3c7'],
  accent: ['#047857', '#059669', '#10b981', '#34d399', '#6ee7b7', '#a7f3d0'],
};

// Custom tooltip component for the pie chart
const CustomPieTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null;

  const value = payload[0].value;
  const total = payload[0].payload.payload.total;
  const percentage = total > 0 ? (value / total) * 100 : 0;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      <p className="text-sm font-medium">{payload[0].name}</p>
      <p className="text-sm text-muted-foreground">
        Value: ₹{formatIndianNumber(Number(value).toFixed(2))}
      </p>
      <p className="text-sm text-muted-foreground">
        Share: {percentage.toFixed(1)}%
      </p>
    </div>
  );
};

// Custom tooltip component for the bar chart
const CustomBarTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="rounded-lg border bg-background p-2 shadow-md">
      <p className="text-sm font-medium">{label}</p>
      <p className="text-sm text-muted-foreground">
        Quantity: {formatIndianNumber(Number(payload[0].value).toFixed(2))} MT
      </p>
    </div>
  );
};

// Format Y-axis ticks
const formatYAxis = (value: number): string => {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(0)}k`;
  }
  return value.toString();
};

const ProductsAnalysis: React.FC<ProductsAnalysisProps> = ({ productsByValue, productsByQuantity }) => {
  const formatProductsForPieChart = (products: Product[]) => {
    const total = products.reduce((sum, product) => sum + (product.total_value || 0), 0);
    return products.map(product => ({
      name: product.product.name,
      value: product.total_value || 0,
      total // Add total to each item for percentage calculation
    }));
  };

  const formatProductsForQuantityChart = (products: Product[]) => {
    return products.map(product => ({
      name: product.product.name,
      quantity: product.total_unloading_quantity || 0,
      transactions: product.transaction_count
    })).sort((a, b) => b.quantity - a.quantity).slice(0, 8);
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Products Analysis</CardTitle>
        <CardDescription>Product distribution by value and quantity</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="value">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="value" className="flex items-center">
              <TrendingUp className="mr-2 h-4 w-4" />
              By Value
            </TabsTrigger>
            <TabsTrigger value="quantity" className="flex items-center">
              <Package className="mr-2 h-4 w-4" />
              By Quantity
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="value" className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                  data={formatProductsForPieChart(productsByValue)}
                  cx="50%"
                  cy="50%"
                  outerRadius="80%"
                  dataKey="value"
                  label={(props) => {
                    const { name, value, payload } = props;
                    const percentage = (value / payload.total * 100).toFixed(1);
                    return (
                      <text
                        x={props.x}
                        y={props.y}
                        fill="hsl(var(--foreground))"
                        fontSize={12}
                        fontWeight={500}
                        textAnchor={props.textAnchor}
                        dominantBaseline="central"
                      >
                        {`${name} (${percentage}%)`}
                      </text>
                    );
                  }}
                  labelLine={{
                    stroke: 'hsl(var(--foreground))',
                    strokeWidth: 1
                  }}
                  isAnimationActive={false}
                >
                  {productsByValue.map((_, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={CHART_COLORS.primary[index % CHART_COLORS.primary.length]}
                      className="outline-none focus:outline-none"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend 
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="quantity" className="h-[400px] [&_svg]:outline-none [&_.recharts-wrapper]:outline-none">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={formatProductsForQuantityChart(productsByQuantity)}
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
                  content={<CustomBarTooltip />}
                  cursor={{ fill: 'var(--border)', opacity: 0.2 }}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                />
                <Bar 
                  dataKey="quantity" 
                  fill={CHART_COLORS.accent[0]} 
                  name="Unloading Quantity"
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

export default ProductsAnalysis;