// components/QuantityDiscrepancies.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

interface DiscrepancyItem {
  id: number;
  product_id: number;
  loading_quantity: number;
  unloading_quantity: number;
  difference: number;
  is_sold: boolean;
  product: {
    id: number;
    name: string;
  };
}

interface QuantityDiscrepanciesProps {
  discrepancies: DiscrepancyItem[];
}

const QuantityDiscrepancies: React.FC<QuantityDiscrepanciesProps> = ({ discrepancies }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-amber-500" />
          <CardTitle>Quantity Discrepancies</CardTitle>
        </div>
        <CardDescription>Top unresolved quantity discrepancies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-[450px] overflow-y-auto pr-2">
          {discrepancies.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No discrepancies found</p>
            </div>
          ) : (
            discrepancies.map((item) => (
              <div key={item.id} className="flex justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-gray-500">
                    Transaction #{item.id}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-amber-600">+{item?.difference}</p>
                  <p className="text-sm text-gray-500">
                    {item?.unloading_quantity} unloaded
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuantityDiscrepancies;