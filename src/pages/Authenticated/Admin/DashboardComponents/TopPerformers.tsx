// components/TopPerformers.tsx
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { IndianRupee, MoveRight, Route, Truck, User } from 'lucide-react';
import { TransactionRouteType } from '@/types/typedef';


interface Vehicle {
    vehicle: {
        id: number;
        number: string;
        type: string;
    };
    transaction_count: number;
    average_expense: number;
}

interface Driver {
    driver: {
        id: number;
        name: string;
    };
    transaction_count: number;
    total_expense: number;
    average_expense: number;
}

interface TopPerformersProps {
    vehicles: Vehicle[];
    drivers: Driver[];
    transactionRoute: TransactionRouteType[];
}

const TopPerformers: React.FC<TopPerformersProps> = ({ vehicles, drivers, transactionRoute }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center space-x-2">
            <div className="text-center p-2 bg-destructive/20 border-destructive border rounded-full">
                <IndianRupee className="h-5 w-5 text-destructive" />
            </div>
          <CardTitle>Expensive Resources</CardTitle>
        </div>
        <CardDescription>Most Expensive routes,drivers and vehicles</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="transactionroutes">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="transactionroutes" className="flex items-center">
                <Route className="mr-2 h-4 w-4" />
                Routes
            </TabsTrigger>
            <TabsTrigger value="vehicles" className="flex items-center">
                <Truck className="mr-2 h-4 w-4" />
                Vehicles
            </TabsTrigger>
            <TabsTrigger value="drivers" className="flex items-center">
                <User className="mr-2 h-4 w-4" />
                Drivers
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="vehicles" className="space-y-4">
            {vehicles.map((item, index) => (
              <div key={item.vehicle.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-50/10">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-600 font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{item.vehicle.number}</p>
                    <p className="text-sm text-gray-500">{item.transaction_count} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{item.average_expense.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Avg. Expense</p>
                </div>
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="drivers" className="space-y-4">
            {drivers.map((item, index) => (
              <div key={item.driver.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-50/10">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 text-green-600 font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{item.driver.name}</p>
                    <p className="text-sm text-gray-500">{item.transaction_count} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">₹{item.average_expense.toFixed(2)}</p>
                  <p className="text-sm text-gray-500">Avg. Expense</p>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="transactionroutes" className="space-y-4">
            {transactionRoute.map((item,index)=> (
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
                        <p className="text-xs md:text-base font-bold">₹{item.average_expense?.toFixed(2)}</p>
                        <p className="text-xs md:text-sm text-gray-500">Avg. Expense</p>
                    </div>
                </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default TopPerformers;