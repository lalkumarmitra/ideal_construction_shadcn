import { user_apis } from "@/lib/helpers/api_urls";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import { UserType } from "@/types/user";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom"

const UserProfile = () => {
    const {user_id} = useParams();
    const dispatch = useDispatch();
    const userProfileQuery = useQuery<any,any,UserType>({
        queryKey:['user',user_id],
        queryFn:()=>user_apis.select(user_id || ''),
        select:(res)=>res.data.user,
        staleTime:10*60*100,
        gcTime:10*60*100,
        enabled: !!user_id
    });
    useEffect(()=>{
        dispatch(setBreadcrumb([{label:'Dashboard',link:'/dashboard'},{label:'User List',link:'/users/1/12'},{label:'User Profile',type:'page'}]))
    },[])
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 ">
            {userProfileQuery.isLoading && <Loader className="animate-spin" />}
           
            {userProfileQuery.data && <div className="flex flex-row items-center justify-between gap-4 px-6 pt-6 md:pt-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{userProfileQuery.data.name}</h1>
            </div>}
        </div>
    )
}
export default UserProfile;