// transaction-pagination.tsx
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

type TransactionPaginationProps = {
    paginationData: { page: number, offset: number };
    lastPage: number;
    total: number;
    onPageChange: (page: number) => void;
}

export const TransactionPagination = ({ 
    paginationData,
    lastPage,
    total,
    onPageChange 
}: TransactionPaginationProps) => {
    return (
        <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="text-sm text-muted-foreground">
                Showing <span className="font-medium">{paginationData.offset * (paginationData.page - 1) + 1}</span> to{" "}
                <span className="font-medium">
                    {Math.min(paginationData.offset * paginationData.page, total)}
                </span> of{" "}
                <span className="font-medium">{total}</span> transactions
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2">
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(paginationData.page - 1)}
                        disabled={paginationData.page <= 1}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => onPageChange(paginationData.page + 1)}
                        disabled={paginationData.page >= lastPage}
                    >
                        <span className="sr-only">Go to next page</span>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};