import React from 'react';
import { Card, CardContent, CardHeader,  CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TransactionFormSkeleton: React.FC = () => {
  return (
    <div className="space-y-3">
      {/* Progress bar skeleton */}
      <Skeleton className="w-full h-4 rounded-full" />
      
      {/* Form Step 1 Skeleton */}
      <Card className="w-full">
        <CardHeader>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-5 w-72" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Generate 8 form field skeletons (matching the layout of form-1.tsx) */}
            {Array(8).fill(0).map((_, index) => (
              <div className="grid gap-2" key={`field-${index}`}>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Form Navigation Footer */}
      <Card>
        <CardFooter className="flex justify-between p-4">
          <div className="flex-1"></div>
          <Skeleton className="h-10 w-28" />
        </CardFooter>
      </Card>
    </div>
  );
};

export default TransactionFormSkeleton;