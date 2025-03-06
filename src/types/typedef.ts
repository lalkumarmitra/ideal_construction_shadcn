import { UserType } from "./user";

export type ProductType = {
    id:number;
    name:string;
    rate:number;
    unit:string;
    image:string | null;
    description:string | null;
    frequency_of_use:number;
}

export type VehicleType = {
    id:number;
    number:string;
    type:string;
    frequency_of_us:number;
}

export type ClientType = {
    id:number;
    name:string;
    address:string|null;
    state:string|null;
    pin:string|null;
    type:string;
    image:string|null;
    frequency_of_use:string;
    client_size:string;
}

export type TransactionType = {
    id:number;
    product_id:number;
    loading_point_id:number;
    loading_vehicle_id:number;
    loading_date:string;
    loading_rate:string;
    loading_quantity:string;
    unloading_point_id:number|null;
    unloading_vehicle_id:number|null;
    unloading_date:string|null;
    unloading_rate:string|null;
    unloading_quantity:string|null;
    challan:string|null;
    challan_number: string|null;
    do_number:string|null;
    txn_type:string,
    is_sold:string;
    transport_expense?:string|number;
    loading_driver_id?:string|number;
    unloading_driver_id?:string|number;
    loading_driver?:UserType;
    unloading_driver?:UserType;
    product?:ProductType;
    loading_point?:ClientType;
    unloading_point?:ClientType;
    loading_vehicle?:VehicleType;
    unloading_vehicle?:VehicleType;
}