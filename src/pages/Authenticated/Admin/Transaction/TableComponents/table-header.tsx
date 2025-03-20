import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { styles } from "../transaction-table";
import { ColumnFilterType, SortConfigType, SortField } from "../transaction-types";
import { ArrowDown, ArrowUp } from "lucide-react";

const TableHeaderComponent = ({
    columnsFilters,
    handleSort,
    sortConfig
}:{
    columnsFilters?:ColumnFilterType|null,
    handleSort: (field: SortField) => void;
    sortConfig: SortConfigType;
}) => {
    const renderSortIndicator = (field: SortField) => {
        if (sortConfig.field !== field) {
            return null;
        }
        return sortConfig.order === 'asc' ? 
            <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
            <ArrowDown className="ml-1 h-4 w-4 inline" />;
    };
    return (
        <TableHeader className={cn("bg-muted/50", styles.stickyHeader)}>
            <TableRow className="whitespace-nowrap">
                {columnsFilters?.transaction_id?.status === 'show' && (
                    <TableHead className="w-[100px] cursor-pointer select-none" onClick={() => handleSort('id')}>
                        ID {renderSortIndicator('id')}
                    </TableHead>
                )}
                {columnsFilters?.loading_date?.status === 'show' && (
                    <TableHead className="cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort('loading_date')}>
                        Loading Date {renderSortIndicator('loading_date')}
                    </TableHead>
                )}
                {columnsFilters?.unloading_date?.status === 'show' && (
                    <TableHead className="cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort('unloading_date')}>
                        Unloading Date {renderSortIndicator('unloading_date')}
                    </TableHead>
                )}
                {columnsFilters?.product?.status === 'show' && (
                    <TableHead className="select-none" >
                        Product 
                    </TableHead>
                )}
                {columnsFilters?.loading_point?.status === 'show' && (
                    <TableHead className="cursor-pointer select-none">Loading Point</TableHead>
                )}
                {columnsFilters?.unloading_point?.status === 'show' && (
                    <TableHead className="cursor-pointer select-none">Unloading Point</TableHead>
                )}
                {columnsFilters?.loading_rate?.status === 'show' && (
                    <TableHead className="cursor-pointer select-none text-right">
                        Loading Rate
                    </TableHead>
                )}
                {columnsFilters?.loading_quantity?.status === 'show' && (
                    <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('loading_quantity')}>
                        Loading Qty {renderSortIndicator('loading_quantity')}
                    </TableHead>
                )}
                {columnsFilters?.unloading_rate?.status === 'show' && (
                    <TableHead className="cursor-pointer select-none text-right">
                        Unloading Rate
                    </TableHead>
                )}
                {columnsFilters?.unloading_quantity?.status === 'show' && (
                    <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('unloading_quantity')}>
                        Unloading Qty {renderSortIndicator('unloading_quantity')}
                    </TableHead>
                )}
                {columnsFilters?.loading_price?.status === 'show' && (
                    <TableHead className="cursor-pointer select-none text-right">Loading Price</TableHead>
                )}
                {columnsFilters?.unloading_price?.status === 'show' && (
                    <TableHead className="cursor-pointer select-none text-right">Unloading Price</TableHead>
                )}

                {columnsFilters?.loading_driver?.status === 'show' && (
                    <TableHead className="cursor-pointer select-none text-right">Driver <span className="text-blue-500">(LDG)</span></TableHead>
                )}
                {columnsFilters?.unloading_driver?.status === 'show' && (
                    <TableHead className="cursor-pointer select-none text-right">Driver <span className="text-green-500">(UNL)</span></TableHead>
                )}

                {columnsFilters?.status?.status === 'show' && (
                    <TableHead>Status</TableHead>
                )}
                {(columnsFilters?.vehicle?.status === 'show') && (
                    <TableHead className="w-[100px] text-right">Vehicle</TableHead>
                )}
                {columnsFilters?.do_number?.status === 'show' && (
                    <TableHead className="w-[100px] text-right">Do Number</TableHead>
                )}
                {columnsFilters?.challan_number?.status === 'show' && (
                    <TableHead className="w-[100px] text-right">Challan Number</TableHead>
                )}
                {columnsFilters?.transport_expense?.status === 'show' && (
                    <TableHead className="w-[100px] text-right cursor-pointer" onClick={() => handleSort('transport_expense')}>Expense {renderSortIndicator('unloading_quantity')}</TableHead>
                )}
                <TableHead className="w-[100px] text-right">Info</TableHead>
                <TableHead className={cn("text-right", styles.stickyColumnHeader)}>
                    More
                </TableHead>
            </TableRow>
        </TableHeader>
    );
}

export default TableHeaderComponent;