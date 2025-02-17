import { CustomSelect } from "@/components/Custom/CustomSelect";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Users, Package, Tags, CircleDot, Truck, Users2, Plus, Handshake, ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import CreateProductModal from "./product/create-product-modal";
import CreateVehicleDialog from "./Vehicle/create-vehicle-modal";
import CreateUserDialog from "./User/create-user-dialog";
import CreateNewClient from "./Client/create-client-dialog";
import CreateTransactionDialog from "./Transaction/create-transaction-dialog";

type IntervalTypes = 'today' | 'yesterday' | 'this_week' | 'this_month' | 'this_year';

const AdminDashboard = () => {
    const [interval,setInterval] = useState<IntervalTypes>('today');
    const infoDummy = [
        { title: "Total Users", value: "100", trend: +5 , icon: <Users size={24} /> },
        { title: "Total Products", value: "100", trend: +3, icon: <Package size={24} /> },
        { title: "Total Vehicles", value: "100", trend: +8 },
        { title: "Transactions", value: "100", trend: +8, icon: <Tags size={24} /> },
        { title: "Purchased", value: "100", trend: -12, icon: <ShoppingCart size={24} /> },
        { title: "Sold", value: "100" },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Quick Menus</h1>
            </div>
            <div className="flex flex-wrap items-stretch gap-4 justify-evenly">
                <CreateNewClient>
                    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex-1 min-w-[160px] md:min-w-[240px]">
                        <CardContent className="p-3 flex-col flex justify-center items-center gap-4">
                            <Handshake className="size-8" />
                            <p className="text-xs md:text-xl font-bold"><Plus className="inline size-4 mr-2" />Add Client</p>
                        </CardContent>
                    </Card>
                </CreateNewClient>
                <CreateTransactionDialog>
                    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex-1 min-w-[160px] md:min-w-[240px]">
                        <CardContent className="p-3 flex-col flex justify-center items-center gap-4">
                            <ArrowLeftRight className="size-8" />
                            <p className="text-xs md:text-xl font-bold"><Plus className="inline size-4 mr-2" />New Transaction</p>
                        </CardContent>
                    </Card>
                </CreateTransactionDialog>
                <CreateProductModal >
                    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex-1 min-w-[160px] md:min-w-[240px]">
                        <CardContent className="p-3 flex-col flex justify-center items-center gap-4">
                            <Package className="size-8" />
                            <p className="text-xs md:text-xl font-bold"><Plus className="inline size-4 mr-2" />Add Product</p>
                        </CardContent>
                    </Card>
                </CreateProductModal>
                <CreateVehicleDialog >
                    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex-1 min-w-[160px] md:min-w-[240px]">
                        <CardContent className="p-3 flex-col flex justify-center items-center gap-4">
                            <Truck className="size-8" />
                            <p className="text-xs md:text-xl font-bold"><Plus className="inline size-4 mr-2" />Add Vehicle</p>
                        </CardContent>
                    </Card>
                </CreateVehicleDialog>
                <CreateUserDialog >
                    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex-1 min-w-[160px] md:min-w-[240px]">
                        <CardContent className="p-3 flex-col flex justify-center items-center gap-4">
                            <Users2 className="size-8" />
                            <p className="text-xs md:text-xl font-bold"><Plus className="inline size-4 mr-2" />Add User/Staff</p>
                        </CardContent>
                    </Card>
                </CreateUserDialog>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                <CustomSelect className="max-w-56" options={[
                    { label: "Today", value: "today" },
                    { label: "Yesterday", value: "yesterday" },
                    { label: "This Week", value: "this_week" },
                    { label: "This Month", value: "this_month" },
                    { label: "This Year", value: "this_year" },
                ]} value={interval} onValueChange={(e)=>setInterval(e as IntervalTypes)} />
            </div>
            <div className="flex flex-wrap items-stretch gap-4 xl:gap-6 justify-evenly">
                {infoDummy.map((info, index) => (
                    <DashboardInfoCard key={index} {...info} />
                ))}
            </div>
        </div>
    );
}


const DashboardInfoCard = ({ title, value, trend, icon }: { 
    title: string; 
    value: string; 
    trend?: number;
    icon?: React.ReactNode;
}) => {
    

    return (
        <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex-1 min-w-[160px] md:min-w-[220px] lg:min-w-[320px]">
            <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                    {icon?icon:<CircleDot size={24} />}
                    <h3 className="text-xs md:text-sm font-medium text-muted-foreground">{title}</h3>
                </div>
            </CardHeader>
            <CardContent className="space-y-1">
                <p className="text-2xl font-bold">{value}</p>
                {trend && <p className={`text-sm font-medium ${trend>0?"text-green-600":"text-destructive"}`}>{trend>0?'+':''}{trend}%</p>}
            </CardContent>
        </Card>
    );
}

export const AdminDashboardSkeleton = () => {
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 animate-pulse">
            <Skeleton className="h-9 w-[250px] rounded-lg" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {[...Array(5)].map((_, index) => (
                    <Card key={index} className="space-y-3">
                        <CardHeader className="pb-2">
                            <Skeleton className="h-4 w-[100px]" />
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Skeleton className="h-8 w-[80px]" />
                            <Skeleton className="h-4 w-[60px]" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default AdminDashboard;