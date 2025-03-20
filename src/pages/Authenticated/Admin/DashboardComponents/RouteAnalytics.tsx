// components/TopPerformers.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CreditCardIcon, IndianRupee, MoveRight, Route, Weight } from 'lucide-react';
import { TransactionRouteType } from '@/types/typedef';
import { formatIndianNumber } from '@/lib/utils';

interface TopPerformersProps {
    highExpenseRoute: TransactionRouteType[];
    highQuantityRoute: TransactionRouteType[];
    highValueRoute: TransactionRouteType[];
}

const RouteAnalytics: React.FC<TopPerformersProps> = ({ highExpenseRoute, highQuantityRoute, highValueRoute }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center space-x-2">
            <div className="text-center p-2 bg-lime-100 border-lime-600 border rounded-full">
                <Route className="h-5 w-5 text-lime-600" />
            </div>
          <CardTitle>Route analytics</CardTitle>
        </div>
        <CardDescription>Top 5 routes by transaction volume, expense and value </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="highValue">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="highValue" className="flex items-center">
                <IndianRupee className="mr-2 h-4 w-4" />
                Value
            </TabsTrigger>
            <TabsTrigger value="highQuantity" className="flex items-center">
                <Weight className="mr-2 h-4 w-4" />
                Quantity
            </TabsTrigger>
            <TabsTrigger value="highExpense" className="flex items-center">
                <CreditCardIcon className="mr-2 h-4 w-4" />
                Expense
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="highValue" className="space-y-4">
            {highValueRoute.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-50/10">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex gap-1 items-center text-[10px] md:text-sm md:font-medium">
                        <p className="">{item.loading_point}</p>
                        <MoveRight className="size-4" />
                        <p className="">{item.unloading_point}</p>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">{item.transaction_count} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-base font-bold">₹{formatIndianNumber(item?.total_value?.toFixed(2) || 0)}</p>
                  <p className="text-xs md:text-sm text-gray-500">Total value</p>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="highQuantity" className="space-y-4">
            {highQuantityRoute.map((item, index) => (
              <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-50/10">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex gap-1 items-center text-[10px] md:text-sm md:font-medium">
                        <p className="">{item.loading_point}</p>
                        <MoveRight className="size-4" />
                        <p className="">{item.unloading_point}</p>
                    </div>
                    <p className="text-xs md:text-sm text-gray-500">{item.transaction_count} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs md:text-base font-bold">{formatIndianNumber(item?.total_quantity?.toFixed(2) || 0)} <span className='text-muted-foreground text-sm'>MT</span></p>
                  <p className="text-xs md:text-sm text-gray-500">Total Quantity</p>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="highExpense" className="space-y-4">
            {highExpenseRoute.map((item,index)=> (
                <div key={index} className="flex flex-col md:flex-row md:items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-50/10">
                    <div className="flex items-center">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600 font-bold mr-3">
                            {index + 1}
                        </div>
                        <div>
                            <div className="flex gap-1 items-center text-[10px] md:text-sm md:font-medium">
                                <p className="">{item.loading_point}</p>
                                <MoveRight className="size-4" />
                                <p className="">{item.unloading_point}</p>
                            </div>
                            <p className="text-xs md:text-sm text-gray-500">{item.transaction_count} transactions</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-xs md:text-base font-bold">₹{formatIndianNumber(item?.total_expense?.toFixed(2) || 0)}</p>
                        <p className="text-xs md:text-sm text-gray-500">Total Expense</p>
                    </div>
                </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default RouteAnalytics;