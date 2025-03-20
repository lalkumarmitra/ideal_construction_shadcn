// transaction-history-page.tsx
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import { useMutation, useQuery } from "@tanstack/react-query";
import { transaction_apis } from "@/lib/helpers/api_urls";
import TransactionHistoryFiltersSheet from "./transaction-history-filters-sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DownloadCloud, FileSpreadsheet, FileTextIcon, Loader2, RefreshCw, TableProperties } from "lucide-react";

import { TransactionHistoryTableSkeleton } from "./transaction-table-skeleton";
import { TransactionPagination } from "./transaction-pagination";
import { TransactionEmptyState } from "./transaction-empty-state";
import { ColumnFilterType, SortField, SortOrder, TransactionQueryResponseType } from "./transaction-types";
import { TransactionTable } from "./transaction-table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { TRANSACTION_TABLE_COLUMNS } from "@/lib/helpers/constants";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckedState } from "@radix-ui/react-checkbox";
import { format } from "date-fns";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/use-debounce";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CustomSelect } from "@/components/Custom/CustomSelect";


const TransactionHistoryPage = () => {
    const dispatch = useAppDispatch();
    const searchText = useAppSelector(state => state.ui.searchText);
    const debouncedSearchText = useDebounce(searchText, 500);
    const [paginationData, setPaginationData] = useState<{page: number, offset: number}>(()=>{
        const paginationPreference = localStorage.getItem('transaction_pagination_preference');
        return paginationPreference ? JSON.parse(paginationPreference) : { page: 1, offset: 7 };
    });
    const [selectedColumns,setSelectedColumns] = useState<ColumnFilterType|null>(()=>{
        const columnsPreference = localStorage.getItem('transaction_table_columns');
        return columnsPreference ? JSON.parse(columnsPreference) : TRANSACTION_TABLE_COLUMNS.reduce((acc, tc) => {
            acc[tc] = { status: 'show', iconise: false };
            return acc;
        }, {} as ColumnFilterType);
    });
    const [filterFormData, setFilterFormData] = useState<FormData | null>(null);
    const [sortConfig, setSortConfig] = useState<{field: SortField, order: SortOrder}>({
        field: 'loading_date',
        order: 'desc'
    });
    
    useEffect(() => {
        const formData = new FormData();
        setFilterFormData(formData);
        dispatch(setBreadcrumb([
            { label: 'Dashboard', link: '/dashboard' },
            { label: 'Transaction History', type: 'page' }
        ]));
    }, []);

    // Update search in filter form data
    useEffect(() => {
        if (!filterFormData) return;
        const newFilterFormData = new FormData();
        for (const [key, value] of filterFormData.entries()) 
            newFilterFormData.append(key, value as string);
        if (debouncedSearchText) newFilterFormData.set('search', debouncedSearchText);
        else newFilterFormData.delete('search');
        newFilterFormData.set('sort_field', sortConfig.field);
        newFilterFormData.set('sort_order', sortConfig.order);
        setFilterFormData(newFilterFormData);
    }, [debouncedSearchText, sortConfig]); 

    // Query with filters
    const transactionHistoryQuery = useQuery<any, any, TransactionQueryResponseType>({
        queryKey: ['transactions', 'history', {
            page: paginationData.page,
            offset: paginationData.offset,
            filters: Array.from(filterFormData?.entries() ?? []),
            sort: sortConfig,
            search: debouncedSearchText
        }],
        queryFn: () => transaction_apis.search(filterFormData, paginationData.page, paginationData.offset),
        select: (res) => res.data,
        staleTime: 10 * 60 * 60 * 1000,
        gcTime: 10 * 60 * 60 * 1000,
        enabled: !!filterFormData,
    });
    const { mutate:download, isPending:downloading } = useMutation({
        mutationFn: (payload: FormData) => transaction_apis.export(payload),
        onSuccess: (data) => {
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download",`${format(new Date(), "dd-MM-yyyy")}_export.xlsx`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        },
        onError: (error) => toast.error("Download failed "+ error),
    });
    const handleExportExcel = () => {
        if (!selectedColumns) return;
        const newFilterFormData = new FormData();
        if (filterFormData) {
            for (const [key, value] of filterFormData.entries()) {
                newFilterFormData.append(key, value as string);
            }
        }
        const columnNames = Object.entries(selectedColumns).filter(([_, value]) => value.status === 'show').map(([key]) => key);
        columnNames.forEach((column) => {
            newFilterFormData.append('columns[]', column);
        });
        download(newFilterFormData);
    };
    const handleExportPdf = () => {
        toast.info('This action is not included in the this version, Please Contanct Admin for more details');
    }
    // Handle filter updates
    const handleFilterUpdate = (newFilterData: FormData) => {
        if (debouncedSearchText) newFilterData.set('search', debouncedSearchText);
        newFilterData.set('sort_field', sortConfig.field);
        newFilterData.set('sort_order', sortConfig.order);
        setFilterFormData(newFilterData);
        setPaginationData(prev => ({ ...prev, page: 1 })); 
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
        localStorage.setItem('transaction_pagination_preference', JSON.stringify({ page: newPage, offset: paginationData.offset }));
        setPaginationData(prev => ({
            ...prev,
            page: newPage
        }));
    };

    
    const handleCheckChange = (e: CheckedState, tc: string) => {
        setSelectedColumns((prev) => {
            if (!prev) return prev;
            const newColumns: ColumnFilterType = {
                ...prev,
                [tc]: {
                    status: e ? 'show' : 'hide',
                    iconise: false
                }
            };
            localStorage.setItem('transaction_table_columns', JSON.stringify(newColumns));
            return newColumns;
        });
    }
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-2 sm:px-6 pt-6 md:pt-0">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transaction History</h1>
                    <p className="text-muted-foreground mt-1">
                        View and manage all transactions with advanced filtering options
                    </p>
                </div>
                <div className="flex items-center gap-3 self-end md:self-auto flex-wrap ">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                                <TableProperties className="mr-2 h-4 w-4" />
                                Columns
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="bg-background/30 backdrop-blur-sm">
                            <div className="grid gap-4 ">
                                <div className="space-y-2">
                                    <h4 className="font-medium leading-none">Select Columns</h4>
                                    <p className="text-sm text-muted-foreground">
                                        Choose the columns you want to see in the table
                                    </p>
                                </div>
                                <div className="grid gap-3 h-64 overflow-y-auto">
                                    {TRANSACTION_TABLE_COLUMNS.map(tc=>(
                                        <Label key={tc} className="capitalize text-xs flex gap-2 items-center">
                                            <Checkbox checked={selectedColumns?.[tc]?.status === 'show'} onCheckedChange={(e)=>handleCheckChange(e,tc)} id={tc} />{tc.replace(/_/g, ' ')}
                                        </Label>
                                    ))}
                                </div>
                            </div>
                        </PopoverContent>
                    </Popover>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="flex">
                                {downloading?(<>
                                    <Loader2 className="inline mr-2 animate-spin size-4" />
                                    Downloading ....
                                </>):(<>
                                    <DownloadCloud className="mr-2 h-4 w-4" />
                                    Export
                                </>)}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-background/20 backdrop-blur-sm">
                            <DropdownMenuItem className="cursor-pointer" onClick={handleExportExcel}>
                                <FileSpreadsheet className="mr-2 h-4 w-4" />
                                <span>Excel</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer" onClick={handleExportPdf}>
                                <FileTextIcon className="mr-2 h-4 w-4" />
                                <span>Pdf</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <TransactionHistoryFiltersSheet onFilterUpdate={handleFilterUpdate} />
                </div>
            </div>
            <div className="flex gap-2 justify-between">
                <div className="flex gap-2">
                    <CustomSelect 
                        className="w-44"
                        dropdownClassName="bg-background/40 backdrop-blur-sm"
                        onValueChange={v=>{
                            localStorage.setItem('transaction_pagination_preference', JSON.stringify({ page: 1, offset: Number(v) }));
                            setPaginationData((_prev)=>({page:1,offset:Number(v)}))
                        }}
                        value={paginationData.offset.toString()}
                        options={Array.from([7,10,20,30,40,50,60]).map(i=>({label:`${i} per page`,value:i}))}
                    />
                    <Button onClick={()=>transactionHistoryQuery.refetch()} variant="outline" size="icon">
                        <RefreshCw className={(transactionHistoryQuery.isLoading || transactionHistoryQuery.isRefetching)?"animate-spin size-4": "size-4"} />
                    </Button>
                </div>
            </div>
            <Card className="overflow-hidden border-border/40">
                <CardContent className="p-0 flex flex-col">
                    {(transactionHistoryQuery.isLoading || transactionHistoryQuery.isRefetching) ? (
                        <TransactionHistoryTableSkeleton />
                    ) : transactionHistoryQuery.data?.transactions?.length ? (
                        <>
                            <TransactionTable 
                                transactions={transactionHistoryQuery.data.transactions}
                                sortConfig={sortConfig}
                                handleSort={handleSort}
                                columnsFilters={selectedColumns}
                            />
                            {(transactionHistoryQuery.data?.last_page || 0) > 1 && (
                                <div className="border-t">
                                    <TransactionPagination
                                        paginationData={paginationData}
                                        lastPage={transactionHistoryQuery.data.last_page}
                                        total={transactionHistoryQuery.data.total}
                                        onPageChange={handlePageChange}
                                    />
                                </div>
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
