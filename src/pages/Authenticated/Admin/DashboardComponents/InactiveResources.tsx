// components/InactiveResources.tsx
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { AlertCircle, Truck, User } from 'lucide-react';

interface Driver {
  id: number;
  name: string;
}

interface Vehicle {
  id: number;
  number: string;
  type: string;
}

interface InactiveResourcesProps {
  inactiveVehicles: Vehicle[];
  inactiveDrivers: Driver[];
}

const InactiveResources: React.FC<InactiveResourcesProps> = ({ inactiveVehicles, inactiveDrivers }) => {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <CardTitle>Inactive Resources</CardTitle>
        </div>
        <CardDescription>Resources with no recent transactions</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="drivers">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="vehicles" className="flex items-center">
              <Truck className="mr-2 h-4 w-4" />
              Vehicles ({inactiveVehicles.length})
            </TabsTrigger>
            <TabsTrigger value="drivers" className="flex items-center">
              <User className="mr-2 h-4 w-4" />
              Drivers ({inactiveDrivers.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="drivers" className="max-h-[400px] overflow-y-auto pr-2">
            {inactiveDrivers.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>No inactive drivers</p>
              </div>
            ) : (
              <div className="space-y-2">
                {inactiveDrivers.map((driver) => (
                  <div key={driver.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-50/10">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{driver.name}</p>
                      <p className="text-xs text-gray-500">ID: {driver.id}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="vehicles" className="max-h-[400px] overflow-y-auto pr-2">
            {inactiveVehicles.length === 0 ? (
              <div className="text-center py-6 text-gray-500">
                <p>No inactive vehicles</p>
              </div>
            ) : (
              <div className="space-y-2">
                {inactiveVehicles.map((vehicle) => (
                  <div key={vehicle.id} className="flex items-center p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-50/10 ">
                    <div className="flex-shrink-0 mr-3">
                      <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <Truck className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{vehicle.number}</p>
                      <p className="text-xs text-gray-500">Type: {vehicle.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default InactiveResources;