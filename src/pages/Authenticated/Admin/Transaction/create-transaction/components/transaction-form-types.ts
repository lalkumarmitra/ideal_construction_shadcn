// src/types/transaction-form.ts
// import { ProductType, VehicleType, ClientType, UserType } from "./typedef";

export interface TransactionFormStep1Data {
    product_id: string;
    loading_date: string;
    loading_vehicle_id: string;
    loading_driver_id?: string;
    loading_point_id: string;
    do_number?: string;
    loading_rate?: string;
    loading_quantity?: string;
}

export interface TransactionFormStep2Data {
    unloading_date: string;
    unloading_vehicle_id: string;
    unloading_driver_id?: string;
    unloading_point_id: string;
    challan_number?: string;
    unloading_rate?: string;
    unloading_quantity?: string;
    transport_expense?: string;
    unit:string;
}

export interface TransactionFormData extends TransactionFormStep1Data, TransactionFormStep2Data {
    id:number
}

export interface TransactionFormProps {
    defaultTransaction?: TransactionFormData;
    onSubmit: (data: TransactionFormData) => void;
}

export interface StepProps {
    formData: Partial<TransactionFormData>;
    updateFormData: (data: Partial<TransactionFormData>) => void;
    defaultTransaction?: TransactionFormData;
}