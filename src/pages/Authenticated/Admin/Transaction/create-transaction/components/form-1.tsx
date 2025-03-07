import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ComboBox from "@/components/Custom/ComboBox";
import {  CalendarIcon,  PackageIcon,  TruckIcon,  CarTaxiFront,  DockIcon,  WeightIcon,  ScaleIcon } from "lucide-react";
import { product_apis, vehicle_apis, user_apis, client_apis } from "@/lib/helpers/api_urls";
import { StepProps } from './transaction-form-types';
import { ClientType, ProductType, VehicleType } from '@/types/typedef';
import { UserType } from '@/types/user';


const TransactionFormStep1: React.FC<StepProps> = ({ formData, updateFormData, defaultTransaction }) => {
    const productListQuery = useQuery<any, any, ProductType[]>({
        queryKey: ["products", "all"],
        queryFn: () => product_apis.list(1, 1000),
        select: (res) => res.data.products,
        staleTime: 5 * 60 * 60 * 100,
        gcTime: 5 * 60 * 60 * 100,
    });

    const vehicleListQuery = useQuery<any, any, VehicleType[]>({
        queryKey: ["vehicles", "all"],
        queryFn: () => vehicle_apis.list(1, 1000),
        select: (res) => res.data.vehicles,
        staleTime: 5 * 60 * 60 * 100,
        gcTime: 5 * 60 * 60 * 100,
    });

    const driverListQuery = useQuery<any, any, UserType[]>({
        queryKey: ["drivers", "all"],
        queryFn: () => user_apis.list(1, 1000),
        select: (res) => res.data.users.filter((u:UserType) => u.role.type.toLowerCase() === 'driver'),
        staleTime: 5 * 60 * 60 * 100,
        gcTime: 5 * 60 * 60 * 100,
    });

    const loadingPointQuery = useQuery<any, any, ClientType[]>({
        queryKey: ["clients", "loading_points"],
        queryFn: () => client_apis.list(1, 1000),
        select: (res) => res.data.clients.filter((cl:ClientType) => cl.type === "loading_point"),
        staleTime: 5 * 60 * 60 * 100,
        gcTime: 5 * 60 * 60 * 100,
    });
    useEffect(()=>{
        if(!formData.loading_date)
        updateFormData({ loading_date: defaultTransaction?.loading_date || new Date().toISOString().split('T')[0] })
    },[]);
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Loading Details</CardTitle>
                <CardDescription>Provide details for loading the transaction</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 lg:grid-cols-2">
                    {/* Product Selection */}
                    <div className="grid gap-2">
                        <Label htmlFor="product_id">
                            <PackageIcon className="size-4 inline mr-2" /> Product <span className="text-destructive">*</span>
                        </Label>
                        <ComboBox
                            id="product_id"
                            placeholder="Select a Product"
                            options={productListQuery.data?.map(p => ({ 
                                label: p.name, 
                                value: p.id.toString() 
                            }))}
                            defaultValue={formData.product_id || defaultTransaction?.product_id?.toString()}
                            onValueChange={(val) => updateFormData({ product_id: val, loading_rate: String(productListQuery?.data?.find(p=>p.id.toString() == val)?.rate), unloading_rate: String(productListQuery?.data?.find(p=>p.id.toString() == val)?.rate) })}
                        />
                    </div>

                    {/* Loading Date */}
                    <div className="grid gap-2">
                        <Label htmlFor="loading_date"><CalendarIcon className="size-4 inline mr-2" /> Loading Date <span className="text-destructive">*</span></Label>
                        <Input  type="date"  id="loading_date" value={formData.loading_date} onChange={(e) => updateFormData({ loading_date: e.target.value, unloading_date:e.target.value })}/>
                    </div>

                    {/* Loading Vehicle */}
                    <div className="grid gap-2">
                        <Label htmlFor="loading_vehicle_id"><TruckIcon className="size-4 inline mr-2" /> Loading Vehicle <span className="text-destructive">*</span></Label>
                        <ComboBox
                            id="loading_vehicle_id"
                            placeholder="Select Loading Vehicle"
                            options={vehicleListQuery.data?.map(v => ({ 
                                label: `${v.number} (${v.type})`, 
                                value: v.id.toString() 
                            }))}
                            defaultValue={formData.loading_vehicle_id || defaultTransaction?.loading_vehicle_id}
                            onValueChange={(val) => updateFormData({ loading_vehicle_id: val, unloading_vehicle_id: val })}
                        />
                    </div>

                    {/* Loading Driver (Optional) */}
                    <div className="grid gap-2">
                        <Label htmlFor="loading_driver_id"><CarTaxiFront className="size-4 inline mr-2" /> Loading Driver (Optional)</Label>
                        <ComboBox
                            id="loading_driver_id"
                            placeholder="Select Loading Driver"
                            options={driverListQuery.data?.map(d => ({ 
                                label: d.name, 
                                value: d.id.toString() 
                            }))}
                            defaultValue={formData.loading_driver_id || defaultTransaction?.loading_driver_id}
                            onValueChange={(val) => updateFormData({ loading_driver_id: val, unloading_driver_id: val })}
                        />
                    </div>

                    {/* Loading Point */}
                    <div className="grid gap-2">
                        <Label htmlFor="loading_point_id"><DockIcon className="size-4 inline mr-2" /> Loading Point <span className="text-destructive">*</span></Label>
                        <ComboBox
                            id="loading_point_id"
                            placeholder="Select Loading Point"
                            options={loadingPointQuery.data?.map(p => ({ 
                                label: p.name, 
                                value: p.id.toString() 
                            }))}
                            defaultValue={formData.loading_point_id || defaultTransaction?.loading_point_id}
                            onValueChange={(val) => updateFormData({ loading_point_id: val })}
                        />
                    </div>

                    {/* DO Number (Optional) */}
                    <div className="grid gap-2 text-muted-foreground" >
                        <Label htmlFor="do_number">
                            <DockIcon className="size-4 inline mr-2" /> DO Number (Optional)
                        </Label>
                        <Input 
                            disabled
                            id="do_number"
                            placeholder="DO Number"
                            value={formData.do_number || defaultTransaction?.do_number || ''}
                            onChange={(e) => updateFormData({ do_number: e.target.value })}
                        />
                    </div>

                    {/* Loading Rate (Optional) */}
                    <div className="grid gap-2 text-muted-foreground">
                        <Label htmlFor="loading_rate">
                            <WeightIcon className="size-4 inline mr-2" /> Loading Rate (Optional)
                        </Label>
                        <Input 
                            disabled
                            id="loading_rate"
                            type="number"
                            step="0.01"
                            placeholder="Loading Rate"
                            value={formData.loading_rate || defaultTransaction?.loading_rate || ''}
                            onChange={(e) => updateFormData({ loading_rate: e.target.value })}
                        />
                    </div>

                    {/* Loading Quantity (Optional) */}
                    <div className="grid gap-2">
                        <Label htmlFor="loading_quantity">
                            <ScaleIcon className="size-4 inline mr-2" /> Loading Quantity (Optional)
                        </Label>
                        <Input 
                            id="loading_quantity"
                            type="number"
                            step="0.001"
                            placeholder="Loading Quantity"
                            value={formData.loading_quantity || defaultTransaction?.loading_quantity || ''}
                            onChange={(e) => updateFormData({ loading_quantity: e.target.value })}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TransactionFormStep1;