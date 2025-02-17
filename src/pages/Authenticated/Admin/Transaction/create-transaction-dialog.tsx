import ComboBox from "@/components/Custom/ComboBox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { client_apis, product_apis, transaction_apis, vehicle_apis } from "@/lib/helpers/api_urls";
import { ClientType, ProductType, TransactionType, VehicleType } from "@/types/typedef";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, ChevronsLeft, ChevronsRight, Loader2, PlusCircle, RefreshCw } from "lucide-react";
import React, { FormEvent, ReactNode, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const CreateTransactionDialog:React.FC<{defaultTransaction?:TransactionType,children?:ReactNode}> = ({defaultTransaction,children}) => {
    const [open,setOpen] = useState(false);
    const [tabsValue,setTabsValue] = useState('purchase');
    const purchaseDataRef = useRef<FormData | null>(null);
    const queryClient = useQueryClient();
    const productListQuery = useQuery<any,any,ProductType[]>({
        queryKey:['products','all'],
        queryFn:()=>product_apis.list(1,1000),
        select:(res)=>res.data.products,
        staleTime:5*60*60*100,
        gcTime:5*60*60*100,
    });
    const [selectedProduct,setSelectedProduct] = useState<ProductType|null>(defaultTransaction?productListQuery.data?.find(p=>p.id==defaultTransaction.product_id)??null:null);
    useEffect(()=>{
        purchaseDataRef.current = null;
    },[open]);
    const vehicleListQuery = useQuery<any,any,VehicleType[]>({
        queryKey:['vehicles','all'],
        queryFn:()=>vehicle_apis.list(1,1000),
        select:(res)=>res.data.vehicles,
        staleTime:5*60*60*100,
        gcTime:5*60*60*100,
    });
    const clientListQuery = useQuery<any,any,ClientType[]>({
        queryKey:['clients','all'],
        queryFn:()=>client_apis.list(1,1000),
        select:(res)=>res.data.clients,
        staleTime:5*60*60*100,
        gcTime:5*60*60*100,
    });
    const transactionMutation = useMutation({
        mutationFn:(data:FormData)=>defaultTransaction? transaction_apis.update(data,defaultTransaction.id) :transaction_apis.create(data),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({queryKey:['transactions'],exact:false});
            setOpen(false);
        },
        onError:(e:any)=>toast.error(e?.response?.data?.message || e.message)
    });
    const handlePurchaseSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        purchaseDataRef.current = formData;
        setTabsValue('sale')
    }
    const handleSaleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const finalData = new FormData(e.currentTarget)
        if (purchaseDataRef.current) {
            for (const [key, value] of purchaseDataRef.current.entries()) {
              finalData.append(key, value);
            }
        }
        transactionMutation.mutate(finalData)
    }
    return (
        <Dialog open={transactionMutation.isPending || open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children?children:(<Button><PlusCircle className="size-4 inline me-2" />New Transaction</Button>)}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{defaultTransaction?'Update Transaction':'Create New Transaction'}</DialogTitle>
                    <DialogDescription>{defaultTransaction?'Change the transaction details and click update to update transaction details.':'Enter the transaction details and click save to create new transaction.'}</DialogDescription>
                </DialogHeader>
                <Tabs value={tabsValue} onValueChange={setTabsValue}>
                    <TabsList className="w-full grid grid-cols-2">
                        <TabsTrigger disabled={transactionMutation.isPending} value="purchase">Purchase Information</TabsTrigger>
                        <TabsTrigger value="sale">Sales Information</TabsTrigger>
                    </TabsList>
                    <TabsContent value='purchase'>
                        <form onSubmit={handlePurchaseSubmit} className="mt-6">
                            <div className="grid gap-3 grid-cols-2">
                                <div className="grid gap-2 col-span-2">
                                    <div className="flex gap-2">
                                        <Label htmlFor="product_id">Product <span className="text-destructive">*</span> </Label>
                                        {(productListQuery.isFetching || productListQuery.isLoading) ? <Loader2 className="size-3 inline ms-1 animate-spin cursor-wait" />
                                            :<RefreshCw
                                            onClick={() => productListQuery.refetch()} 
                                            className={`size-3 inline ms-1 cursor-pointer`} 
                                        />}
                                    </div>
                                    <ComboBox 
                                        disabled={productListQuery.isFetching || productListQuery.isLoading} 
                                        id="product_id" name="product_id" 
                                        placeholder="Select a Product"
                                        defaultValue={defaultTransaction?.product_id?.toString() || ""}
                                        options={productListQuery.data?.map(p=>({label:p.name,value:p.id.toString()}))}
                                        onValueChange={(val)=>setSelectedProduct(productListQuery.data?.find(p=>p.id == Number(val)) || null)}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="loading_date">Transaction Date</Label>
                                    <Input type="date" defaultValue={defaultTransaction?defaultTransaction.loading_date:new Date().toISOString().split('T')[0]}  name="loading_date" id="loading_date" />
                                </div>
                            
                                
                                <div className="grid gap-2">
                                    <div className="flex gap-2">
                                        <Label htmlFor="loading_vehicle_id">Vehicle <span className="text-destructive">*</span> </Label>
                                        {(vehicleListQuery.isFetching || vehicleListQuery.isLoading) ? <Loader2 className="size-3 inline ms-1 animate-spin cursor-wait" />
                                            :<RefreshCw
                                            onClick={() => vehicleListQuery.refetch()} 
                                            className={`size-3 inline ms-1 cursor-pointer`} 
                                        />}
                                    </div>
                                    <ComboBox 
                                        defaultValue={defaultTransaction?.loading_vehicle_id?.toString() || ""}
                                        placeholder="Select Loading Vehicle" name="loading_vehicle_id" 
                                        options={vehicleListQuery.data?.map(v=>({label:`${v.number} (${v.type})`,value:v.id.toString()}))} 
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="loading_rate">Rate : </Label>
                                    <Input id="loading_rate" name="loading_rate" defaultValue={selectedProduct?.rate ?? ""}  key={selectedProduct?.id || "default"}  />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="loading_quantity">Quantity : </Label>
                                    <Input name="loading_quantity" id="loading_quantity" defaultValue={defaultTransaction?.loading_quantity || 0} type="number" step={0.001} />
                                </div>
                                <div className="grid gap-2 col-span-2">
                                    <div className="flex gap-2">
                                        <Label htmlFor="loading_point_id">Loading Point <span className="text-destructive">*</span> </Label>
                                        {(clientListQuery.isFetching || clientListQuery.isLoading) ? <Loader2 className="size-3 inline ms-1 animate-spin cursor-wait" />
                                            :<RefreshCw
                                            onClick={() => clientListQuery.refetch()} 
                                            className={`size-3 inline ms-1 cursor-pointer`} 
                                        />}
                                    </div>
                                    <ComboBox 
                                        placeholder="Select Loading point" 
                                        name="loading_point_id" 
                                        id="loading_point_id"
                                        defaultValue={defaultTransaction?.loading_point_id?.toString() ?? ''}
                                        options={clientListQuery.data?.filter(cl=>cl.type==='loading_point').map(cl=>({label:cl.name,value:cl.id.toString()}))} 
                                    />
                                </div>
                            </div>

                            <DialogFooter className="gap-2 mt-6">
                                <DialogClose asChild>
                                    <Button variant={'ghost'}>Close</Button>
                                </DialogClose>
                                <Button type="submit" variant={'secondary'}>Next <ChevronsRight className="inline ms-2 size-4" /></Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>
                    <TabsContent value="sale">
                        <form onSubmit={handleSaleSubmit} className="mt-6">
                            <div className="grid gap-3 grid-cols-2">
                                <div className="grid gap-2 col-span-2">
                                    <div className="flex gap-2">
                                        <Label htmlFor="unloading_point_id">Unloading Point </Label>
                                        {(clientListQuery.isFetching || clientListQuery.isLoading) ? <Loader2 className="size-3 inline ms-1 animate-spin cursor-wait" />
                                            :<RefreshCw
                                            onClick={() => clientListQuery.refetch()} 
                                            className={`size-3 inline ms-1 cursor-pointer`} 
                                        />}
                                    </div>
                                    <ComboBox 
                                        disabled={transactionMutation.isPending}
                                        placeholder="Select Unloading point" 
                                        name="unloading_point_id" 
                                        id="unloading_point_id"
                                        defaultValue={defaultTransaction?.unloading_point_id?.toString() || ''}
                                        options={clientListQuery.data?.filter(cl=>cl.type==='unloading_point').map(cl=>({label:cl.name,value:cl.id.toString()}))} 
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="unloading_date">Unloading Date</Label>
                                    <Input disabled={transactionMutation.isPending} type="date" defaultValue={defaultTransaction?.unloading_date ?? new Date().toISOString().split('T')[0]}  name="unloading_date" id="unloading_date" />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="challan">Challan : </Label>
                                    <Input disabled={transactionMutation.isPending} name="challan" id="challan" defaultValue={defaultTransaction?.challan?.toString() || ''} type="number" step={1} />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="unloading_rate">Sales Rate : </Label>
                                    <Input disabled={transactionMutation.isPending} id="unloading_rate" name="unloading_rate" defaultValue={defaultTransaction?.unloading_rate ?? selectedProduct?.rate ?? ""}  key={selectedProduct?.id || "default"}  />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="unloading_quantity">Unloading Quantity : </Label>
                                    <Input disabled={transactionMutation.isPending} id="unloading_quantity" name="unloading_quantity" defaultValue={defaultTransaction?.unloading_quantity ?? 0} type="number" step={0.001} />
                                </div>
                                <div className="grid gap-2 col-span-2">
                                    <div className="flex gap-2">
                                        <Label htmlFor="loading_vehicle_id">Vehicle </Label>
                                        {(vehicleListQuery.isFetching || vehicleListQuery.isLoading) ? <Loader2 className="size-3 inline ms-1 animate-spin cursor-wait" />
                                            :<RefreshCw
                                            onClick={() => vehicleListQuery.refetch()} 
                                            className={`size-3 inline ms-1 cursor-pointer`} 
                                        />}
                                    </div>
                                    <ComboBox 
                                        disabled={transactionMutation.isPending}
                                        placeholder="Select Unloading Vehicle" 
                                        name="unloading_vehicle_id"
                                        id="unloading_vehicle_id"
                                        defaultValue={defaultTransaction?.unloading_vehicle_id?.toString()}
                                        options={vehicleListQuery.data?.map(v=>({label:`${v.number} (${v.type})`,value:v.id.toString()}))} 
                                    />
                                </div>
                            </div>
                            <DialogFooter className="gap-2 mt-6">
                                <Button disabled={transactionMutation.isPending} onClick={()=>setTabsValue('purchase')} type="button" variant={'secondary'}> <ChevronsLeft className="inline me-2 size-4" />Prev</Button>
                                <Button type="submit">
                                    {defaultTransaction?'Update':'Save'}
                                    {transactionMutation.isPending?<Loader2 className="animate-spin inline ms-2 size-4" /> : <Check className="inline ms-2 size-4" />}
                                </Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}

export default CreateTransactionDialog;