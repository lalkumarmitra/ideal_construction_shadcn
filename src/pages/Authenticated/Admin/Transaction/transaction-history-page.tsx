import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import { useQuery } from "@tanstack/react-query";
import { TransactionType } from "@/types/typedef";
import { transaction_apis } from "@/lib/helpers/api_urls";
import TransactionHistoryFiltersSheet from "./transaction-history-filters-sheet";

type TransactionQueryResponseType = {
    transactions: TransactionType[],
    last_page: number,
    per_page: number,
    current_page: number,
    total: number,
}

const TransactionHistoryPage = () => {
    const dispatch = useAppDispatch();
    const [paginationData, setPaginationData] = useState<{page: number, offset: number}>({page: 1, offset: 12});
    const [filterFormData, setFilterFormData] = useState<FormData | null>(null);

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
            filters: Array.from(filterFormData?.entries() ?? [])
        }],
        queryFn: () => transaction_apis.search(filterFormData, paginationData.page, paginationData.offset),
        select: (res) => res.data,
        staleTime: 10 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
        enabled: !!filterFormData,
    });

    // Handle filter updates
    const handleFilterUpdate = (newFilterData: FormData) => {
        setFilterFormData(newFilterData);
        setPaginationData(prev => ({ ...prev, page: 1 })); // Reset to first page when filters change
    };

    useEffect(() => {
        dispatch(setBreadcrumb([
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Transaction History', type: 'page' }
        ]));
    }, []);

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="flex flex-row items-center justify-between gap-4 px-6 pt-6 md:pt-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transaction History</h1>
                <TransactionHistoryFiltersSheet onFilterUpdate={handleFilterUpdate} />
            </div>
            {transactionHistoryQuery.isLoading && (<TransactionHistoryPageSkeleton />)}
            <div className="grid gap-2">
                {transactionHistoryQuery.data?.transactions?.map(tr=>(<div className="bg-muted/30 flex justify-between items-center p-4 gap-2">
                    <span>{tr.id}</span>
                    <span>{tr.loading_date}</span>
                    <span>{tr.product?.name}</span>
                    <span>{tr.loading_point?.name}</span>
                    <span>{tr.loading_vehicle?.number}</span>
                </div>))}
            </div>
        </div>
    );
};

export default TransactionHistoryPage;

const TransactionHistoryPageSkeleton = () => {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {Array.from([1]).map(i=>(
            <Skeleton key={i} className="h-40">
                <Skeleton className="size-8 rounded-full" />
            </Skeleton>
        ))}    
    </div>  
}

