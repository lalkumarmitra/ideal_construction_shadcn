import { useAuth } from "@/Auth/AuthProvider";
import { LandingPageSkeleton } from "@/pages/Public/LandingPage/Index";
import { MiddleWareType } from "@/types/route";
import { PropsWithChildren } from "react";
import { Navigate } from "react-router-dom";


type MiddlewareProps = PropsWithChildren<{ middlewares: MiddleWareType[] }>;

export const Middleware: React.FC<MiddlewareProps> = ({ children, middlewares }) => {
    // return <LandingPageSkeleton />
    const { authToken } = useAuth();
    if (authToken === undefined)
        return <LandingPageSkeleton />
    if (middlewares.includes('auth'))
        return authToken !== null ? children : <Navigate to={'/'} />
    if (middlewares.includes('guest'))
        return authToken == null ? children : <Navigate to={'/dashboard'} />
    if (middlewares.includes('public'))
        return children;
    return children
}

type RoleMiddlewareProps = PropsWithChildren<{ users: string[] | undefined }>;
export const RoleMiddleware: React.FC<RoleMiddlewareProps> = ({ children, users }) => {
    const { user } = useAuth();
    if (users === undefined || user?.role.type === undefined)
        return children;
    return (users?.includes(user?.role.type.toLowerCase())) ? children : <Navigate to={'/404'} />
}