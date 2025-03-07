
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import { useQuery } from "@tanstack/react-query";
import { TransactionType } from "@/types/typedef";
import { useParams } from "react-router-dom";
import { transaction_apis } from "@/lib/helpers/api_urls";
import { ListPagination } from "@/components/Custom/ListPagination";
import CreateTransactionDialog from "./create-transaction-dialog";
import { TransactionCard } from "./transaction-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ArrowRightIcon, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";


type TransactionQueryResponseType = {
    transactions:TransactionType[],
    last_page : number,
    per_page : number,
    current_page : number,
    total : number,
}

const TransactionPage = () => {
    const dispatch = useAppDispatch();
    const {page,offset} = useParams();
    const transactionListQuery = useQuery<any,any,TransactionQueryResponseType>({
        queryKey:['transactions',page,offset],
        queryFn: ()=>transaction_apis.list(page ?? 1,offset ?? 10),
        select: (res)=> res.data,
        staleTime : 10 * 10 * 60 * 100,
        gcTime : 10 * 10 * 60 * 100,
        enabled : !!page && !!offset
    });
    useEffect(()=>{
        dispatch(setBreadcrumb([{label:'Dashboard',link:'/dashboard'},{label:'Transaction List',type:'page'}]))
    },[])
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 ">
            <div className="flex flex-row items-center justify-between gap-4 px-6 pt-6 md:pt-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Transactions</h1>
                <div className="flex gap-2">
                    <CreateTransactionDialog />
                    <Button onClick={()=>transactionListQuery.refetch()} variant="outline" size="icon">
                        <RefreshCw className={(transactionListQuery.isLoading || transactionListQuery.isRefetching)?"animate-spin size-4": "size-4"} />
                    </Button>
                </div>
            </div>
            {transactionListQuery.isLoading || transactionListQuery.isRefetching && <TransactionPageSkeleton />}
            <div className="grid gap-4 xl:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 place-items-center">
                {transactionListQuery.data && transactionListQuery.data.transactions.map((tr,i)=>(<TransactionCard key={i} transaction={tr} />))}
            </div>
            {(transactionListQuery.data?.last_page || 0) > 1 && (
                <div className="mx-auto pb-4">
                    <ListPagination url_end_point="transactions" last_page={transactionListQuery.data?.last_page || 1} current_page={transactionListQuery.data?.current_page || 1}/>
                </div>
            )}
        </div>
    )
}
export default TransactionPage;

const TransactionPageSkeleton = () => {
    return <div className="grid gap-4 xl:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 place-items-center">
        {Array.from([1,2,3,4,5,6,7,8]).map(i=>(
            <Card key={i} className="w-full max-w-md overflow-hidden">
                <CardHeader className="p-4 pb-0 flex flex-row justify-between items-start">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="size-16 rounded-full" />
                        <div className="grid gap-4">
                            <Skeleton className="h-4 rounded w-72" />
                            <Skeleton className="h-4 rounded w-60" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-4">
                    <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                        <Skeleton className="space-y-2 h-44"/>
                        <div className="flex flex-col items-center h-full justify-center">
                            <div className="border-l border-dotted border-gray-300 h-full"></div>
                            <ArrowRightIcon className="text-primary my-2" />
                            <div className="border-l border-dotted border-gray-300 h-full"></div>
                        </div>
                        <Skeleton className="space-y-2 h-44"/>
                    </div>
                    <Skeleton className="mt-4 h-6 w-full" />
                </CardContent>
            </Card>
        ))}    
    </div>  
}

