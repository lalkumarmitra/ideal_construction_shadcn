// src/components/transaction/TransactionFormStep2.tsx
import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import ComboBox from "@/components/Custom/ComboBox";
import { 
    CalendarIcon, 
    TruckIcon, 
    CarTaxiFront, 
    DockIcon, 
    WeightIcon, 
    ScaleIcon,
    ReceiptIndianRupee
} from "lucide-react";
import { vehicle_apis, user_apis, client_apis } from "@/lib/helpers/api_urls";
import { StepProps } from './transaction-form-types';
import { UserType } from '@/types/user';
import { ClientType, VehicleType } from '@/types/typedef';


const TransactionFormStep2: React.FC<StepProps> = ({ formData, updateFormData, defaultTransaction }) => {
    const vehicleListQuery = useQuery<any, any, VehicleType[]>({
        queryKey: ["vehicles", "all"],
        queryFn: () => vehicle_apis.list(1, 1000),
        select: (res) => res.data.vehicles,
    });
    const driverListQuery = useQuery<any, any, UserType[]>({
        queryKey: ["drivers", "all"],
        queryFn: () => user_apis.list(1, 1000),
        select: (res) => res.data.users.filter((u:UserType) => u.role.type.toLowerCase() === 'driver'),
    });

    const unloadingPointQuery = useQuery<any, any, ClientType[]>({
        queryKey: ["clients", "unloading_points"],
        queryFn: () => client_apis.list(1, 1000),
        select: (res) => res.data.clients.filter((cl:ClientType) => cl.type === "unloading_point"),
    });
    useEffect(()=>{
        if(!formData.unloading_date) updateFormData({unloading_date: formData.loading_date})
        if(!formData.unloading_vehicle_id) updateFormData({unloading_vehicle_id: formData.loading_vehicle_id})
        if(!formData.unloading_driver_id) updateFormData({unloading_driver_id: formData.loading_driver_id})
    },[formData]);
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Unloading Details</CardTitle>
                <CardDescription>Provide details for unloading the transaction</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6 lg:grid-cols-2">
                    {/* Transport Expense (Optional) */}
                    <div className="grid gap-2">
                        <Label htmlFor="transport_expense">
                            <ReceiptIndianRupee className="size-4 inline mr-2" /> Transport Expense (Optional)
                        </Label>
                        <Input 
                            id="transport_expense"
                            type="number"
                            step="0.01"
                            placeholder="Transport Expense"
                            value={formData.transport_expense || defaultTransaction?.transport_expense || ''}
                            onChange={(e) => updateFormData({ transport_expense: e.target.value })}
                        />
                    </div>
                    {/* Unloading Date */}
                    <div className="grid gap-2">
                        <Label htmlFor="unloading_date">
                            <CalendarIcon className="size-4 inline mr-2" /> Unloading Date
                        </Label>
                        <Input 
                            type="date" 
                            id="unloading_date"
                            value={formData.unloading_date || defaultTransaction?.unloading_date || ''}
                            onChange={(e) => updateFormData({ unloading_date: e.target.value })}
                        />
                    </div>

                    {/* Unloading Vehicle */}
                    <div className="grid gap-2">
                        <Label htmlFor="unloading_vehicle_id">
                            <TruckIcon className="size-4 inline mr-2" /> Unloading Vehicle
                        </Label>
                        <ComboBox
                            id="unloading_vehicle_id"
                            placeholder="Select Unloading Vehicle"
                            options={vehicleListQuery.data?.map(v => ({ 
                                label: `${v.number} (${v.type})`, 
                                value: v.id.toString() 
                            }))}
                            defaultValue={formData.unloading_vehicle_id || defaultTransaction?.unloading_vehicle_id}
                            onValueChange={(val) => updateFormData({ unloading_vehicle_id: val })}
                        />
                    </div>

                    {/* Unloading Driver (Optional) */}
                    <div className="grid gap-2">
                        <Label htmlFor="unloading_driver_id">
                            <CarTaxiFront className="size-4 inline mr-2" /> Unloading Driver (Optional)
                        </Label>
                        <ComboBox
                            id="unloading_driver_id"
                            placeholder="Select Unloading Driver"
                            options={driverListQuery.data?.map(d => ({ 
                                label: d.name, 
                                value: d.id.toString() 
                            }))}
                            defaultValue={formData.unloading_driver_id || defaultTransaction?.unloading_driver_id}
                            onValueChange={(val) => updateFormData({ unloading_driver_id: val })}
                        />
                    </div>

                    {/* Unloading Point */}
                    <div className="grid gap-2">
                        <Label htmlFor="unloading_point_id">
                            <DockIcon className="size-4 inline mr-2" /> Unloading Point
                        </Label>
                        <ComboBox
                            id="unloading_point_id"
                            placeholder="Select Unloading Point"
                            options={unloadingPointQuery.data?.map(p => ({ 
                                label: p.name, 
                                value: p.id.toString() 
                            }))}
                            defaultValue={formData.unloading_point_id || defaultTransaction?.unloading_point_id}
                            onValueChange={(val) => updateFormData({ unloading_point_id: val })}
                        />
                    </div>

                    {/* Challan Number (Optional) */}
                    <div className="grid gap-2">
                        <Label htmlFor="challan_number">
                            <DockIcon className="size-4 inline mr-2" /> Challan Number (Optional)
                        </Label>
                        <Input 
                            id="challan_number"
                            placeholder="Challan Number"
                            value={formData.challan_number || defaultTransaction?.challan_number || ''}
                            onChange={(e) => updateFormData({ challan_number: e.target.value })}
                        />
                    </div>

                    {/* Unloading Rate (Optional) */}
                    <div className="grid gap-2">
                        <Label htmlFor="unloading_rate">
                            <WeightIcon className="size-4 inline mr-2" /> Unloading Rate
                        </Label>
                        <Input 
                            id="unloading_rate"
                            type="number"
                            step="0.01"
                            placeholder="Unloading Rate"
                            value={formData.unloading_rate || defaultTransaction?.unloading_rate || ''}
                            onChange={(e) => updateFormData({ unloading_rate: e.target.value })}
                        />
                    </div>

                    {/* Unloading Quantity (Optional) */}
                    <div className="grid gap-2">
                        <Label htmlFor="unloading_quantity">
                            <ScaleIcon className="size-4 inline mr-2" /> Unloading Quantity (Optional)
                        </Label>
                        <Input 
                            id="unloading_quantity"
                            type="number"
                            step="0.001"
                            placeholder="Unloading Quantity"
                            value={formData.unloading_quantity || defaultTransaction?.unloading_quantity || ''}
                            onChange={(e) => updateFormData({ unloading_quantity: e.target.value })}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default TransactionFormStep2;