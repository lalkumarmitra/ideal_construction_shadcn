
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import CreateUserDialog from "./create-user-dialog";
import { useQuery } from "@tanstack/react-query";
import { RoleType, UserType } from "@/types/user";
import { role_apis, user_apis } from "@/lib/helpers/api_urls";
import { ListPagination } from "@/components/Custom/ListPagination";
import UserCard from "./user-card";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { CustomSelect } from "@/components/Custom/CustomSelect";

type UserQueryResponseType = {
    users:UserType[],
    last_page : number,
    per_page : number,
    current_page : number,
    total : number,
}

const UserPage = () => {
    const dispatch = useAppDispatch();
    const [pageSize,setPageSize] = useState<string|undefined>(() => {
        const config = localStorage.getItem('userpageconfig');
        return config ? JSON.parse(config).pageSize : 10;
    });
    const [pageNumber,setPageNumber] = useState<string|number>(() => {
        const config = localStorage.getItem('userpageconfig');
        return config ? JSON.parse(config).pageNumber : 1;
    });
    const [usersRole,setUsersRole] = useState<string|undefined>(() => {
        const config = localStorage.getItem('userpageconfig');
        return config ? JSON.parse(config).usersRole : 'all';
    });

    useEffect(() => {
        localStorage.setItem('userpageconfig', JSON.stringify({
            pageSize,
            pageNumber,
            usersRole
        }));
    }, [pageSize, pageNumber, usersRole]);
    
    const userListQuery = useQuery<any,any,UserQueryResponseType>({
        queryKey:['users',pageNumber,pageSize,usersRole],
        queryFn: ()=>user_apis.list(pageNumber ?? 1,pageSize ?? 10, usersRole == 'all'? null: usersRole),
        select: (res)=> res.data,
        staleTime : 10 * 60 * 60 * 100,
        gcTime : 10 * 60 * 60 * 100,
        enabled : !!pageNumber && !!pageSize || !!usersRole
    });
    const roleListQuery = useQuery<any, any, RoleType[]>({
        queryKey:['roles'],
        queryFn: role_apis.list,
        select: (res)=> res.data.roles,
        staleTime: 10 * 60 * 60 * 100,
        gcTime: 10 * 60 * 60 * 100,
    });
    useEffect(()=>{
        dispatch(setBreadcrumb([{label:'Dashboard',link:'/dashboard'},{label:'User List',type:'page'}]))
    },[])
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 ">
            <div className="flex flex-row items-center justify-between gap-4 px-6 pt-6 md:pt-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Users</h1>
                <div className="flex gap-2">
                    <CreateUserDialog />
                    <Button onClick={()=>userListQuery.refetch()} variant="outline" size="icon">
                        <RefreshCw className={(userListQuery.isLoading || userListQuery.isRefetching)?"animate-spin size-4": "size-4"} />
                    </Button>
                </div>
            </div>
            <div className="flex gap-2 px-6 justify-between">
                <CustomSelect 
                    className="w-44"
                    dropdownClassName="bg-background/40 backdrop-blur-sm"
                    onValueChange={v=>setPageSize(v)}
                    defaultValue={pageSize}
                    options={Array.from([10,20,30,40,50,60,70,80,90,100]).map(i=>({label:`${i} per page`,value:i}))}
                />
                <CustomSelect 
                        className="w-48"
                        dropdownClassName="bg-background/40 backdrop-blur-sm"
                        value={usersRole}
                        options={[
                            {label: 'All User Type', value: 'all'}, 
                            ...(roleListQuery.data?.map(role => ({
                                label: `${role.name} (${role.type})`,
                                value: role.id.toString()
                            })) || [])
                        ]} 
                        onValueChange={v=>{
                            setUsersRole(v);
                            setPageNumber(1);
                        }}
                    />
            </div>
            {userListQuery.isLoading && <UserPageSkeleton />}
            {userListQuery.data && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-6">
                {userListQuery.data.users.map(u=><UserCard user={u} />)}
            </div>}
            {(userListQuery.data?.last_page || 0)>1 && (
                <div className="mx-auto pb-4">
                    <ListPagination 
                        last_page={userListQuery.data?.last_page || 1} 
                        current_page={userListQuery.data?.current_page || 1} 
                        url_end_point="users" 
                        onPageChange={p=>setPageNumber(p)}
                    />
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

