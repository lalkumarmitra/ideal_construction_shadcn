import { useAppDispatch } from "@/redux/hooks"
import { setBreadcrumb } from "@/redux/Features/uiSlice"
import { useEffect } from "react"
import { useAuth } from "@/Auth/AuthProvider";
import { LandingPageSkeleton } from "../Public/LandingPage/Index";
import AdminDashboard from "./Admin/admin-dashboard";



export const Dashboard: React.FC = () => {
    const dispatch = useAppDispatch();
    useEffect(() => {
        dispatch(setBreadcrumb([{ label: 'Dashboard', type: 'page' }]))
    }, []);
    const {user} = useAuth();

    if(user === undefined) return <LandingPageSkeleton />
    if ( user?.role?.type === undefined) return (
        <div className="w-full text-center">
            <h1> Something went </h1>
            <p>Please contact support</p>
        </div>
    )
    return <RoleBasedDashboard role={user?.role.type} />
}

const RoleBasedDashboard = ({role}:{role:string}) => {
    if(role === 'admin')
        return <AdminDashboard />
    return (
        <div className="w-full text-center my-8 text-red-600">
            <h1> {role} users do not have access to dashboard </h1>
            <p>Please contact support</p>
        </div>
    )
}
