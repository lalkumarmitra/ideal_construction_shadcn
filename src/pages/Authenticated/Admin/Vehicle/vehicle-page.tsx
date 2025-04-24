
import { Skeleton } from "@/components/ui/skeleton";
import { vehicle_apis } from "@/lib/helpers/api_urls";
import { VehicleType } from "@/types/typedef";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import VehicleCard from "./vehicle-card";
import CreateVehicleDialog from "./create-vehicle-modal";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";


interface VehicleListQueryResponse {
    vehicles:VehicleType[],
    last_page : number,
    per_page : number,
    current_page : number,
    total : number,
}

const VehiclePage = () => {
    const dispatch = useAppDispatch();
    const {page,offset} = useParams();
    const searchText = useAppSelector(state=>state.ui.searchText);
    const vehicleListQuery = useQuery<any,any,VehicleListQueryResponse>({
        queryKey:['vehicles',page,offset,searchText],
        queryFn: ()=>vehicle_apis.list(page ?? 1,offset ?? 10, searchText?'?&search_query='+searchText:null),
        select: (res)=> res.data,
        staleTime : 10 * 60 * 60 * 100,
        gcTime : 10 * 60 * 60 * 100,
        enabled : !!page && !!offset
    });
    useEffect(()=>{
        dispatch(setBreadcrumb([{label:'Dashboard',link:'/dashboard'},{label:'Vehicle List',type:'page'}]))
    },[])
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 ">
            <div className="flex flex-row items-center justify-between gap-4 px-6 pt-6 md:pt-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Vehicles</h1>
                <div className="flex gap-2">
                    <CreateVehicleDialog />
                    <Button onClick={()=>vehicleListQuery.refetch()} variant="outline" size="icon">
                        <RefreshCw className={(vehicleListQuery.isLoading || vehicleListQuery.isRefetching)?"animate-spin size-4": "size-4"} />
                    </Button>
                </div>
            </div>
            {vehicleListQuery.isLoading && <VehiclePageSkeleton />}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {vehicleListQuery.data && vehicleListQuery.data.vehicles.map((v,i)=>(<VehicleCard vehicle={v} key={i} />))}
            </div>
            
        </div>
    )
}
export default VehiclePage;

const VehiclePageSkeleton = () => {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {Array.from([1,2,3,4,5,6,7,8,9,10,11,12]).map(i=>(
            <Skeleton key={i} className="h-40">
                <Skeleton className="size-8 rounded-full" />
            </Skeleton>
        ))}    
    </div>  
}

