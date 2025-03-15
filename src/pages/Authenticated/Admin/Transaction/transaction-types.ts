// transaction-types.ts
import { TransactionType } from "@/types/typedef";

export type SortField = 'id' | 'loading_date' | 'unloading_date' | 'product_name' | 'loading_quantity' | 'unloading_quantity'|'transport_expense';
export type SortOrder = 'asc' | 'desc';

export type TransactionQueryResponseType = {
    transactions: TransactionType[],
    last_page: number,
    per_page: number,
    current_page: number,
    total: number, 
}

export type SortConfigType = {
    field: SortField;
    order: SortOrder;
}
export type ColumnStatusType = {
    status: 'show'|'hide',
    iconise?: boolean
}
export type ColumnFilterType = {
    [key: string]: ColumnStatusType;
}