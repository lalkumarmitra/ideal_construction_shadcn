// transaction-history-page.tsx
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import { useQuery } from "@tanstack/react-query";
import { transaction_apis } from "@/lib/helpers/api_urls";
import TransactionHistoryFiltersSheet from "./transaction-history-filters-sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";

import { TransactionHistoryTableSkeleton } from "./transaction-table-skeleton";
import { TransactionPagination } from "./transaction-pagination";
import { TransactionEmptyState } from "./transaction-empty-state";
import { SortField, SortOrder, TransactionQueryResponseType } from "./transaction-types";
import { TransactionTable } from "./transaction-table";

const TransactionHistoryPage = () => {
    const dispatch = useAppDispatch();
    const [paginationData, setPaginationData] = useState<{page: number, offset: number}>({page: 1, offset: 7});
    const [filterFormData, setFilterFormData] = useState<FormData | null>(null);
    const [sortConfig, setSortConfig] = useState<{field: SortField, order: SortOrder}>({
        field: 'loading_date',
        order: 'desc'
    });

    // Initialize default form data
    useEffect(() => {
        const formData = new FormData();
        formData.append('start_date', '');
        formData.append('end_date', '');
        setFilterFormData(formData);
    }, []);

    // Query with filters
    const transactionHistoryQuery = useQuery<any, any, TransactionQueryResponseType>({
        queryKey: ['transactions', 'history', {
            page: paginationData.page,
            offset: paginationData.offset,
            filters: Array.from(filterFormData?.entries() ?? []),
            sort: sortConfig
        }],
        queryFn: () => transaction_apis.search(filterFormData, paginationData.page, paginationData.offset),
        select: (res) => {
            // In a real application, sorting would be handled by the backend
            // This is just a client-side simulation for demonstration purposes
            const sortedTransactions = [...res.data.transactions].sort((a, b) => {
                let aValue, bValue;
                
                switch(sortConfig.field) {
                    case 'id':
                        aValue = a.id;
                        bValue = b.id;
                        break;
                    case 'loading_date':
                        aValue = new Date(a.loading_date).getTime();
                        bValue = new Date(b.loading_date).getTime();
                        break;
                    case 'unloading_date':
                        aValue = a.unloading_date ? new Date(a.unloading_date).getTime() : 0;
                        bValue = b.unloading_date ? new Date(b.unloading_date).getTime() : 0;
                        break;
                    case 'product_name':
                        aValue = a.product?.name || '';
                        bValue = b.product?.name || '';
                        break;
                    case 'loading_quantity':
                        aValue = parseFloat(a.loading_quantity);
                        bValue = parseFloat(b.loading_quantity);
                        break;
                    case 'unloading_quantity':
                        aValue = parseFloat(a.unloading_quantity || '0');
                        bValue = parseFloat(b.unloading_quantity || '0');
                        break;
                    default:
                        aValue = a.id;
                        bValue = b.id;
                }
                
                if (sortConfig.order === 'asc') {
                    return aValue > bValue ? 1 : -1;
                } else {
                    return aValue < bValue ? 1 : -1;
                }
            });
            
            return {
                ...res.data,
                transactions: sortedTransactions
            };
        },
        staleTime: 10 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!filterFormData,
    });

    // Handle filter updates
    const handleFilterUpdate = (newFilterData: FormData) => {
        setFilterFormData(newFilterData);
        setPaginationData(prev => ({ ...prev, page: 1 })); // Reset to first page when filters change
    };

    // Handle sorting
    const handleSort = (field: SortField) => {
        setSortConfig(current => ({
            field,
            order: current.field === field && current.order === 'asc' ? 'desc' : 'asc'
        }));
    };

    // Handle pagination change
    const handlePageChange = (newPage: number) => {
        setPaginationData(prev => ({
            ...prev,
            page: newPage
        }));
    };

    useEffect(() => {
        dispatch(setBreadcrumb([
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Transaction History', type: 'page' }
        ]));
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2 sm:px-6 pt-6 md:pt-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transaction History</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage all transactions with advanced filtering options
                    </p>
                </div>
                <div className="flex items-center gap-3 self-end md:self-auto">
                    <Button variant="outline" size="sm" className="hidden md:flex">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                    </Button>
                    <TransactionHistoryFiltersSheet onFilterUpdate={handleFilterUpdate} />
                    <Button onClick={()=>transactionHistoryQuery.refetch()} variant="outline" size="icon">
                        <RefreshCw className={(transactionHistoryQuery.isLoading || transactionHistoryQuery.isRefetching)?"animate-spin size-4": "size-4"} />
                    </Button>
                </div>
            </div>

            <Card className="overflow-hidden border-border/40">
                <CardContent className="p-0">
                    {(transactionHistoryQuery.isLoading || transactionHistoryQuery.isRefetching) ? (
                        <TransactionHistoryTableSkeleton />
                    ) : transactionHistoryQuery.data?.transactions?.length ? (
                        <>
                            <div className="overflow-x-auto">
                                <TransactionTable 
                                    transactions={transactionHistoryQuery.data.transactions}
                                    sortConfig={sortConfig}
                                    handleSort={handleSort}
                                />
                            </div>
                            {(transactionHistoryQuery.data?.last_page || 0) > 1 && (
                                <TransactionPagination
                                    paginationData={paginationData}
                                    lastPage={transactionHistoryQuery.data.last_page}
                                    total={transactionHistoryQuery.data.total}
                                    onPageChange={handlePageChange}
                                />
                            )}
                        </>
                    ) : (
                        <TransactionEmptyState />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default TransactionHistoryPage;