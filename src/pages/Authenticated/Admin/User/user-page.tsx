
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import CreateUserDialog from "./create-user-dialog";
import { useQuery } from "@tanstack/react-query";
import { UserType } from "@/types/user";
import { useParams } from "react-router-dom";
import { user_apis } from "@/lib/helpers/api_urls";
import { ListPagination } from "@/components/Custom/ListPagination";
import UserCard from "./user-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

type UserQueryResponseType = {
    users:UserType[],
    last_page : number,
    per_page : number,
    current_page : number,
    total : number,
}

const UserPage = () => {
    const dispatch = useAppDispatch();
    const {page,offset} = useParams();
    const userListQuery = useQuery<any,any,UserQueryResponseType>({
        queryKey:['users',page,offset],
        queryFn: ()=>user_apis.list(page ?? 1,offset ?? 10),
        select: (res)=> res.data,
        staleTime : 10 * 60 * 100,
        gcTime : 10 * 60 * 100,
        enabled : !!page && !!offset
    });
    useEffect(()=>{
        dispatch(setBreadcrumb([{label:'Dashboard',link:'/dashboard'},{label:'User List',type:'page'}]))
    },[])
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 ">
            <div className="flex flex-row items-center justify-between gap-4 px-6 pt-6 md:pt-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Users</h1>
                <CreateUserDialog />
            </div>
            {userListQuery.isLoading && <UserPageSkeleton />}
            {userListQuery.data && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                {userListQuery.data.users.map(u=><UserCard user={u} />)}
            </div>}
            {(userListQuery.data?.last_page || 0)>1 && (
                <div className="mx-auto pb-4">
                    <ListPagination last_page={userListQuery.data?.last_page || 1} current_page={userListQuery.data?.current_page || 1} url_end_point="users" />
                </div>
            )}
        </div>
    )
}
export default UserPage;

const UserPageSkeleton = () => {
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

