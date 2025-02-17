import DatePickerWithRange from "@/components/Custom/DatePickerWithRange";
import { MultiselectCombobox } from "@/components/Custom/MultiSelectComboBox";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { client_apis, product_apis, vehicle_apis } from "@/lib/helpers/api_urls";
import { CLIENT_SIZES } from "@/lib/helpers/constants";
import { cn } from "@/lib/utils";
import { setFilterData } from "@/redux/Features/filterSlice";
import { useAppDispatch } from "@/redux/hooks";
import { ClientType, ProductType, VehicleType } from "@/types/typedef";
import { useQuery } from "@tanstack/react-query";
import { Filter, Handshake, Ruler, ShoppingBasket, Truck, WatchIcon } from "lucide-react";
import { FormEvent, ReactNode, useState } from "react";

const TransactionHistoryFiltersSheet:React.FC<{children?:ReactNode}> = ({children}) => {
    const dispatch = useAppDispatch();
    const productListQuery = useQuery<any,any,ProductType[]>({
        queryKey:['products','all'],
        queryFn:()=>product_apis.list(1,1000),
        select:(res)=>res.data.products,
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
    const vehicleListQuery = useQuery<any,any,VehicleType[]>({
        queryKey:['vehicles','all'],
        queryFn:()=>vehicle_apis.list(1,1000),
        select:(res)=>res.data.vehicles,
        staleTime:5*60*60*100,
        gcTime:5*60*60*100,
    });
    const [open,setOpen] = useState(false);
    const [showLoadingFilters,setShowLoadingFilters] = useState(false);
    const [showUnLoadingFilters,setShowUnLoadingFilters] = useState(false);
    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const filterData = {
            product_ids: formData.getAll('products_ids[]'),
            loading_vehicle_ids: formData.getAll('vehicle_ids[]'),

            loading_date_from: showLoadingFilters?formData.get('loading_date_from'):'',
            loading_date_to: showLoadingFilters?formData.get('loading_date_to'):'',
            unloading_date_from: showUnLoadingFilters?formData.get('unloading_date_from'):'',
            unloading_date_to: showUnLoadingFilters?formData.get('unloading_date_to'):'',

            loading_client_sizes: showLoadingFilters?formData.getAll('loading_client_sizes[]'):'',
            unloading_client_sizes: showUnLoadingFilters?formData.getAll('unloading_client_sizes[]'): '',

            loading_point_ids: showLoadingFilters?formData.getAll('loading_point_ids[]'):'',
            unloading_point_ids: showUnLoadingFilters?formData.getAll('unloading_point_ids[]'): '',
        }
        console.log(filterData);
        setOpen(false);
    }
    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                {children?children:<Button><Filter className="size-4 inline mr-2" /> Filters</Button>}
            </SheetTrigger>
            <SheetContent className="p-0">
                <SheetHeader className="bg-muted/30 p-4">
                    <SheetTitle>Transaction History Filters</SheetTitle>
                    <SheetDescription>Choose the desired filters and shorting optons to get what you are looking for.</SheetDescription>
                </SheetHeader>
                <form onSubmit={handleSubmit} className="h-[calc(100svh-11rem)] overflow-y-scroll p-4">
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label><ShoppingBasket className="inline size-4 me-2" />Products</Label>
                            <MultiselectCombobox 
                                options={productListQuery.data?.map(p=>({label:p.name,value:p.id}))} 
                                placeholder="Select Products"
                                name="products_ids"
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label><Truck className="inline size-4 me-2" />Vehicles</Label>
                            <MultiselectCombobox 
                                options={vehicleListQuery.data?.map(p=>({label:p.number,value:p.id}))} 
                                placeholder="Select Vehicles"
                                name="vehicle_ids"
                            />
                        </div>
                    </div>
                    <Card className="my-4">
                        <CardContent className="p-3 flex gap-3 justify-between items-center">
                            <div className="grid gap-1">
                                <p className="text-xs font-bold" >Show <span className="text-blue-600">Loading Point</span> Filters</p>
                                <p className="text-xs text-muted-foreground">Click the switch button to toggle filters related to <b className="capitalize">loading point</b></p>
                            </div>
                            <Switch checked={showLoadingFilters} onCheckedChange={setShowLoadingFilters} />
                        </CardContent>
                    </Card>
                    <div className={cn(
                        "grid gap-4 px-2 transition-all duration-300 ease-in-out overflow-hidden",
                        showLoadingFilters ? "max-h-[500px] opacity-100 scale-y-100 mb-4" : "max-h-0 opacity-0 scale-y-0"
                        )}>
                        <div className="grid gap-2">
                            <Label><WatchIcon className="inline size-4 me-2 text-blue-600"/> Loading Date Range</Label>
                            <DatePickerWithRange name="loading_date" />
                        </div>
                        <div className="grid gap-2">
                            <Label><Ruler className="inline size-4 me-2 text-blue-600"/>Loading Client Size</Label>
                            <MultiselectCombobox options={CLIENT_SIZES} placeholder="Select Client size" name="loading_client_sizes" />
                        </div>
                        <div className="grid gap-2">
                            <Label><Handshake className="inline size-4 me-2 text-blue-600"/>Loading Points</Label>
                            <MultiselectCombobox 
                                options={clientListQuery.data?.filter(cl=>cl.type === 'loading_point')?.map(p=>({label:p.name,value:p.id}))} 
                                placeholder="Select Loading Points"
                                name="loading_point_ids"
                            />
                        </div>
                    </div>
                    <Card className="mb-4">
                        <CardContent className="p-3 flex gap-3 justify-between items-center">
                            <div className="grid gap-1">
                                <p className="text-xs font-bold" >Show <span className="text-green-600">Unloading Point</span> Filters</p>
                                <p className="text-xs text-muted-foreground">Click the switch button to toggle filters related to <b className="capitalize">unloading point</b></p>
                            </div>
                            <Switch checked={showUnLoadingFilters} onCheckedChange={setShowUnLoadingFilters} />
                        </CardContent>
                    </Card>
                    <div className={cn(
                        "grid gap-4 px-2 transition-all duration-300 ease-in-out overflow-hidden",
                        showUnLoadingFilters ? "max-h-[500px] opacity-100 scale-y-100" : "max-h-0 opacity-0 scale-y-0"
                    )}>
                        <div className="grid gap-2">
                            <Label><WatchIcon className="inline size-4 me-2 text-green-600"/>Unloading Date Range</Label>
                            <DatePickerWithRange name="unloading_date" />
                        </div>
                        <div className="grid gap-2">
                            <Label><Ruler className="inline size-4 me-2 text-green-600"/>Unloading Client Size</Label>
                            <MultiselectCombobox options={CLIENT_SIZES} placeholder="Select Client size" name="unloading_client_sizes" />
                        </div>
                        <div className="grid gap-2">
                            <Label><Handshake className="inline size-4 me-2 text-green-600"/>Unoading Points</Label>
                            <MultiselectCombobox 
                                options={clientListQuery.data?.filter(cl=>cl.type === 'unloading_point')?.map(p=>({label:p.name,value:p.id}))} 
                                name="unloading_point_ids"
                                placeholder="Select Unloading Points"
                            />
                        </div>
                    </div>
                    <SheetFooter className="gap-2 absolute bottom-0 left-0 p-4 bg-muted/30 w-full">
                        <SheetClose asChild>
                            <Button variant={'outline'}>Close</Button>
                        </SheetClose>
                        <Button type="submit">Apply</Button>
                    </SheetFooter>
                </form>
            </SheetContent>
        </Sheet>
    );
}
export default TransactionHistoryFiltersSheet;