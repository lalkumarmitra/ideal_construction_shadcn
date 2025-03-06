import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TransactionType } from "@/types/typedef";
import { AssetUrl } from "@/lib/helpers/api_helper";
import { ColumnFilterType, SortConfigType, SortField } from "./transaction-types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowDown, ArrowUp, CalendarIcon, Truck, IndianRupee, UserCog2 } from "lucide-react";
import TableActionOptions from "./table-action-options";

type TransactionTableProps = {
    transactions: TransactionType[];
    sortConfig: SortConfigType;
    handleSort: (field: SortField) => void;
    columnsFilters?: ColumnFilterType|null;
}

export const TransactionTable = ({ transactions, sortConfig, handleSort,columnsFilters }: TransactionTableProps) => {
    // Render sort indicator
    const renderSortIndicator = (field: SortField) => {
        if (sortConfig.field !== field) {
            return null;
        }
        return sortConfig.order === 'asc' ? 
            <ArrowUp className="ml-1 h-4 w-4 inline" /> : 
            <ArrowDown className="ml-1 h-4 w-4 inline" />;
    };

    return (
        <Table>
            <TableHeader className="bg-muted/50">
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
                        <TableHead className="cursor-pointer select-none" onClick={() => handleSort('product_name')}>
                            Product {renderSortIndicator('product_name')}
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
                        <TableHead className="w-[100px] text-right">Expense</TableHead>
                    )}
                    <TableHead className="w-[100px] text-right">Info</TableHead>
                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((transaction,i) => (
                    <TableRow key={transaction.id} className={cn("group whitespace-nowrap",i % 2 === 0 ? "" : "bg-muted/50")}>
                        {columnsFilters?.transaction_id?.status === 'show' && (
                            <TableCell className="font-medium">#{transaction.id}</TableCell>
                        )}
                        {columnsFilters?.loading_date?.status === 'show' && (
                            <TableCell>
                                <div className="flex items-center">
                                    <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                    {format(new Date(transaction.loading_date), 'MMM dd, yyyy')}
                                </div>
                            </TableCell>
                        )}
                        {columnsFilters?.unloading_date?.status === 'show' && (
                            <TableCell>
                                {transaction.unloading_date ? (
                                    <div className="flex items-center">
                                        <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                        {format(new Date(transaction.unloading_date), 'MMM dd, yyyy')}
                                    </div>
                                ) : (
                                    <span className="text-muted-foreground text-sm">Not unloaded</span>
                                )}
                            </TableCell>
                        )}
                        {columnsFilters?.product?.status === 'show' && (
                            <TableCell>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger className="cursor-pointer">
                                            <div className="flex items-center space-x-2">
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={AssetUrl + transaction.product?.image} alt={transaction.product?.name} />
                                                    <AvatarFallback>{transaction.product?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <span className="font-medium">{transaction.product?.name}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="space-y-2 p-1 max-w-xs">
                                                <p className="font-medium">{transaction.product?.name}</p>
                                                <div className="grid grid-cols-2 gap-2 text-sm">
                                                    <span className="text-muted-foreground">Rate:</span>
                                                    <span>{transaction.product?.rate}</span>
                                                    <span className="text-muted-foreground">Unit:</span>
                                                    <span>{transaction.product?.unit}</span>
                                                </div>
                                                {transaction.product?.description && (
                                                    <p className="text-xs">{transaction.product?.description}</p>
                                                )}
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                        )}
                        {columnsFilters?.loading_point?.status === 'show' && (
                            <TableCell>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger className="cursor-default">
                                            <div className="flex items-center space-x-2 max-w-[200px]">
                                                <Avatar className="h-6 w-6">
                                                    <AvatarImage src={AssetUrl + transaction.loading_point?.image} alt={transaction.loading_point?.name} />
                                                    <AvatarFallback className="text-xs">{transaction.loading_point?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                                <span className="truncate">{transaction.loading_point?.name}</span>
                                            </div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="flex gap-2">
                                                <p>{transaction.loading_point?.name}</p>
                                                <Badge variant={'outline'} className="capitalize text-xs" >{transaction.loading_point?.client_size} Client</Badge>
                                            </div>
                                            <p className="text-xs text-muted-foreground">{transaction.loading_point?.address}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </TableCell>
                        )}
                        {columnsFilters?.unloading_point?.status === 'show' && (
                            <TableCell>
                                {transaction.unloading_point ? (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger className="cursor-default">
                                                <div className="flex items-center space-x-2 max-w-[200px]">
                                                    <Avatar className="h-6 w-6">
                                                        <AvatarImage src={AssetUrl + transaction.unloading_point?.image} alt={transaction.unloading_point?.name} />
                                                        <AvatarFallback className="text-xs" >{transaction.unloading_point?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <span className="truncate">{transaction.unloading_point?.name}</span>
                                                </div>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <div className="flex gap-2">
                                                    <p>{transaction.unloading_point?.name}</p>
                                                    <Badge variant={'outline'} className="capitalize text-xs" >{transaction.unloading_point?.client_size} Client</Badge>
                                                </div>
                                                <p className="text-xs text-muted-foreground">{transaction.unloading_point?.address}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                ) : (
                                    <span className="text-muted-foreground text-sm">Not set</span>
                                )}
                            </TableCell>
                        )}
                        {columnsFilters?.loading_rate?.status === 'show' && (
                            <TableCell className="text-right">
                                <span className="text-muted-foreground text-sm">{transaction.loading_rate}</span>
                            </TableCell>
                        )}
                        {columnsFilters?.loading_quantity?.status === 'show' && (
                            <TableCell className="text-right">
                                <span className="font-medium">{parseFloat(transaction.loading_quantity).toFixed(2)}</span>
                                <span className="text-muted-foreground text-xs ml-1">{transaction.product?.unit}</span>
                            </TableCell>
                        )}
                        {columnsFilters?.unloading_rate?.status === 'show' && (
                            <TableCell className="text-right">
                                <span className="text-muted-foreground text-sm">{transaction.unloading_rate}</span>
                            </TableCell>
                        )}
                        {columnsFilters?.unloading_quantity?.status === 'show' && (
                            <TableCell className="text-right">
                                {transaction.unloading_quantity ? (
                                    <>
                                        <span className="font-medium">{parseFloat(transaction.unloading_quantity).toFixed(2)}</span>
                                        <span className="text-muted-foreground text-xs ml-1">{transaction.product?.unit}</span>
                                    </>
                                ) : (
                                    <span className="text-muted-foreground text-sm">-</span>
                                )}
                            </TableCell>
                        )}
                        {columnsFilters?.loading_price?.status === 'show' && (
                            <TableCell className="text-right">
                                <div className="flex gap-1 items-center justify-end">
                                    <IndianRupee className="size-4" />
                                    <span className="font-medium">{(parseFloat(transaction.loading_quantity) * parseFloat(transaction.loading_rate)).toFixed(2)}</span>
                                </div>
                            </TableCell>
                        )}
                        {columnsFilters?.unloading_price?.status === 'show' && (
                            <TableCell className="text-right">
                                {transaction.unloading_quantity && transaction.unloading_rate ? (
                                    <div className="flex gap-1 items-center justify-end">
                                        <IndianRupee className="size-4" />
                                        <span className="font-medium">{(parseFloat(transaction.unloading_quantity) * parseFloat(transaction?.unloading_rate)).toFixed(2)}</span>
                                    </div>
                                ):(
                                    <span className="text-muted-foreground text-sm">-</span>
                                )}
                            </TableCell>
                        )}
                        {columnsFilters?.status?.status === 'show' && (
                            <TableCell>
                                <Badge variant={
                                    transaction.is_sold === "1" ? "default" :
                                    transaction.unloading_quantity ? "outline" : "secondary"
                                } className={
                                    transaction.is_sold === "1" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                                    transaction.unloading_quantity ? "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200" :
                                    "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                                }>
                                    {transaction.is_sold === "1" ? "Completed" :
                                    transaction.unloading_quantity ? "Unloaded" : "In Transit"}
                                </Badge>
                            </TableCell>
                        )}
                        {(columnsFilters?.vehicle?.status === 'show') && (
                            <TableCell> {transaction.loading_vehicle?.number} </TableCell>
                        )}
                        {columnsFilters?.do_number?.status === 'show' && (
                            <TableCell className="text-right">
                                {transaction.do_number ? ('DO: ' + transaction.do_number) : 'N/A'}
                            </TableCell>
                        )}
                        {columnsFilters?.challan_number?.status === 'show' && (
                            <TableCell className="text-right">
                                {transaction.challan_number ? (transaction.challan_number) : 'N/A'}
                            </TableCell>
                        )}
                        {columnsFilters?.transport_expense?.status === 'show' && (
                            <TableCell className="text-right">
                                {transaction.transport_expense ? (<>
                                    <IndianRupee className="inline size-4 me-2" />{transaction.transport_expense}
                                </>) : 'N/A'}
                            </TableCell>
                        )}
                        <TableCell className="text-right">
                            <div className="flex items-center justify-end space-x-1">
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <Truck className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="space-y-1">
                                                <p className="font-medium">Vehicles</p>
                                                <p className="text-xs">Loading: {transaction.loading_vehicle?.number}</p>
                                                {transaction.unloading_vehicle && (
                                                    <p className="text-xs">Unloading: {transaction.unloading_vehicle?.number}</p>
                                                )}
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <UserCog2 className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="space-y-1">
                                                <p className="font-medium">Drivers</p>
                                                <p className="text-xs">Loading: {transaction.loading_driver?.name || "N/A"}</p>
                                                <p className="text-xs">Unloading: {transaction.unloading_driver?.name || "N/A"}</p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </TableCell>
                        <TableCell>
                            <TableActionOptions transaction={transaction} />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};