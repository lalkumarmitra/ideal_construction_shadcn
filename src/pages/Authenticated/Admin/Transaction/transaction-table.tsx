// transaction-table.tsx
import { format } from "date-fns";
import { ArrowDown, ArrowUp, CalendarIcon, Download, Truck, MoreHorizontal, Eye, FileEdit, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { AssetUrl } from "@/lib/helpers/api_helper";
import { TransactionType } from "@/types/typedef";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortConfigType, SortField } from "./transaction-types";
import { cn } from "@/lib/utils";

type TransactionTableProps = {
    transactions: TransactionType[];
    sortConfig: SortConfigType;
    handleSort: (field: SortField) => void;
}

export const TransactionTable = ({ transactions, sortConfig, handleSort }: TransactionTableProps) => {
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
                    <TableHead className="w-[100px] cursor-pointer select-none" onClick={() => handleSort('id')}>
                        ID {renderSortIndicator('id')}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort('loading_date')}>
                        Loading Date {renderSortIndicator('loading_date')}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none whitespace-nowrap" onClick={() => handleSort('unloading_date')}>
                        Unloading Date {renderSortIndicator('unloading_date')}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => handleSort('product_name')}>
                        Product {renderSortIndicator('product_name')}
                    </TableHead>
                    <TableHead>Loading Point</TableHead>
                    <TableHead>Unloading Point</TableHead>
                    <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('loading_quantity')}>
                        Loading Qty {renderSortIndicator('loading_quantity')}
                    </TableHead>
                    <TableHead className="cursor-pointer select-none text-right" onClick={() => handleSort('unloading_quantity')}>
                        Unloading Qty {renderSortIndicator('unloading_quantity')}
                    </TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="w-[100px] text-right">Documents</TableHead>
                    <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {transactions.map((transaction,i) => (
                    <TableRow key={transaction.id} className={cn("group whitespace-nowrap",i % 2 === 0 ? "" : "bg-muted/50")}>
                        <TableCell className="font-medium">#{transaction.id}</TableCell>
                        <TableCell>
                            <div className="flex items-center">
                                <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground" />
                                {format(new Date(transaction.loading_date), 'MMM dd, yyyy')}
                            </div>
                        </TableCell>
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
                        <TableCell className="text-right">
                            <span className="font-medium">{parseFloat(transaction.loading_quantity).toFixed(2)}</span>
                            <span className="text-muted-foreground text-xs ml-1">{transaction.product?.unit}</span>
                        </TableCell>
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
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="space-y-1">
                                                <p className="font-medium">Documents</p>
                                                <p className="text-xs">DO: {transaction.do_number || "N/A"}</p>
                                                <p className="text-xs">Challan: {transaction.challan || "N/A"}</p>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                        <span className="sr-only">Open menu</span>
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                        <Eye className="mr-2 h-4 w-4" />
                                        <span>View Details</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <FileEdit className="mr-2 h-4 w-4" />
                                        <span>Edit Transaction</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="text-destructive">
                                        <Trash2 className="mr-2 h-4 w-4" />
                                        <span>Delete Transaction</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
};