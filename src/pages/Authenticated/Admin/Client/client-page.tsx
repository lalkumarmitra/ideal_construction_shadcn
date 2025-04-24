
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import { useParams } from "react-router-dom";
import { ClientType } from "@/types/typedef";
import { client_apis } from "@/lib/helpers/api_urls";
import { useQuery } from "@tanstack/react-query";
import { ListPagination } from "@/components/Custom/ListPagination";
import CreateNewClient from "./create-client-dialog";
import ClientCard from "./client-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

type ClientListQueryResponseType = {
    clients : ClientType[],
    last_page : number,
    per_page : number,
    current_page : number,
    total : number,
}

const ClientPage = () => {
    const dispatch = useAppDispatch();
    const {page,offset} = useParams();
    const searchText = useAppSelector(state => state.ui.searchText);
    const clientListQuery = useQuery<any,any, ClientListQueryResponseType>({
        queryKey:['clients',page,offset,searchText],
        queryFn: ()=>client_apis.list(page ?? 1,offset ?? 10, searchText?'?&search_query='+searchText:null),
        select: (res)=> res.data,
        staleTime : 10 * 60 * 60 * 100,
        gcTime : 10 * 60 * 60 * 100,
        enabled : !!page && !!offset
    });
    useEffect(()=>{
        dispatch(setBreadcrumb([{label:'Dashboard',link:'/dashboard'},{label:'Client List',type:'page'}]))
    },[])
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 ">
            <div className="flex flex-row items-center justify-between gap-4 px-6 pt-6 md:pt-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Clients</h1>
                <div className="flex gap-2">
                    <CreateNewClient />
                    <Button onClick={()=>clientListQuery.refetch()} variant="outline" size="icon">
                        <RefreshCw className={(clientListQuery.isLoading || clientListQuery.isRefetching)?"animate-spin size-4": "size-4"} />
                    </Button>
                </div>
            </div>
            {clientListQuery.isLoading && <ClientPageSkeleton />}
            {clientListQuery.data && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                {clientListQuery.data.clients.map((client) => (<ClientCard client={client} />))}  
            </div>}
            {clientListQuery.data?.last_page != 1 && (
                <div className="mx-auto pb-4">
                    <ListPagination url_end_point="clients" last_page={clientListQuery.data?.last_page || 1} current_page={clientListQuery.data?.current_page || 1}/>
                </div>            
            )}
        </div>
    )
}
export default ClientPage;

const ClientPageSkeleton = () => {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {Array.from([1,2,3,4,5,6,7,8,9,10,11,12]).map(i=>(
            <Card key={i}>
                <CardHeader>
                    <div className="flex gap-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-12 rounded-full" />
                            <div className="grid gap-2"> 
                                <Skeleton className="w-32 h-2" />
                                <Skeleton className="w-12 h-2" />
                            </div>
                        </div>
                        
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <Skeleton className="w-56 h-3" />
                        <Skeleton className="w-48 h-3" />
                    </div>
                </CardContent>
            </Card> 
        ))}    
    </div>  
}

