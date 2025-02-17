import { auth } from "@/lib/helpers/api_urls";
import { UserType } from "@/types/user";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { removeAuthToken } from "@/lib/helpers/cookie_helper";
import { toast } from "sonner";


type AuthContext = {
    authToken?: string | null;
    user?: UserType | null;
    handleLogin:(data:FormData)=>void;
    handleLogout:()=>void;
    isLoading:boolean;
}

const AuthContext = createContext<AuthContext | undefined>(undefined);
type AuthProviderProps = PropsWithChildren;
const AuthProvider =  ({children}:AuthProviderProps) => {
    const [token,setToken] = useState<string | null>();
    const [user,setUser] = useState<UserType | null>();
    const [isLoading,setIsLoading] = useState(false);
    const navigate = useNavigate();
    useEffect(()=>{
        setIsLoading(true);
        auth.validate().then((res:any)=>{
            setUser(res.data.user)
            setToken(Cookies.get('_token'))
        }).catch(e=>{
            console.log(e);
            setUser(null);
            setToken(null);
        }).finally(()=>setIsLoading(false));
    },[])
    const handleLogin = (data:FormData) => {
        setIsLoading(true);
        auth.login(data).then((res:any)=>{
            setUser(res.data.user);
            console.log(res.data.user);
            setToken(res._token);
            Cookies.set('_token',res._token);
            navigate('/dashboard');
        }).catch((e:any)=>toast.error(e.response?.data?.message ?? e.message)).finally(()=>setIsLoading(false));
    };
    const handleLogout = () => {
        setIsLoading(true);
        auth.logout().then(():any=>{
            removeAuthToken();
            setUser(null);
            setToken(null);
            navigate('/');
        }).catch(e=>toast.error(e.response?.data?.message ?? e.message)).finally(()=>setIsLoading(false));
    }
    return <AuthContext.Provider value={{authToken:token, user,handleLogin,handleLogout,isLoading}}>{children}</AuthContext.Provider>
}
export default AuthProvider;
export const useAuth = () => {
    const context = useContext(AuthContext)
    if(context === undefined){
        throw new Error("useAuth Hook must be used inside AuthProvider")
    }
    return context
}