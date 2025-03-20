import { Card, CardContent } from "@/components/ui/card";
import { Package, Truck, Users2, Handshake, ArrowLeftRight } from "lucide-react";
import CreateProductModal from "../product/create-product-modal";
import CreateVehicleDialog from "../Vehicle/create-vehicle-modal";
import CreateNewClient from "../Client/create-client-dialog";
import CreateUserDialog from "../User/create-user-dialog";
import CreateTransactionDialog from "../Transaction/create-transaction-dialog";

const QuickActionGrid = () => {
    return (
        <div className="mb-8">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                <CreateNewClient>
                    <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
                        <CardContent className="p-3 flex-col flex justify-center items-center text-center">
                            <Handshake className="size-8 text-blue-500 mb-2 mt-3" />
                            <p className="text-xs sm:text-sm font-medium">Add Client</p>
                        </CardContent>
                    </Card>
                </CreateNewClient>
                <CreateTransactionDialog>
                    <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
                        <CardContent className="p-3 flex-col flex justify-center items-center text-center">
                            <ArrowLeftRight className="size-8 text-purple-500 mb-2 mt-3" />
                            <p className="text-xs sm:text-sm font-medium">New Transaction</p>
                        </CardContent>
                    </Card>
                </CreateTransactionDialog>
                <CreateProductModal>
                    <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
                        <CardContent className="p-3 flex-col flex justify-center items-center text-center">
                            <Package className="size-8 text-green-500 mb-2 mt-3" />
                            <p className="text-xs sm:text-sm font-medium">Add Product</p>
                        </CardContent>
                    </Card>
                </CreateProductModal>
                <CreateVehicleDialog>
                    <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
                        <CardContent className="p-3 flex-col flex justify-center items-center text-center">
                            <Truck className="size-8 text-amber-500 mb-2 mt-3" />
                            <p className="text-xs sm:text-sm font-medium">Add Vehicle</p>
                        </CardContent>
                    </Card>
                </CreateVehicleDialog>
                <CreateUserDialog>
                    <Card className="transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer">
                        <CardContent className="p-3 flex-col flex justify-center items-center text-center">
                            <Users2 className="size-8 text-cyan-500 mb-2 mt-3" />
                            <p className="text-xs sm:text-sm font-medium">Add User/Staff</p>
                        </CardContent>
                    </Card>
                </CreateUserDialog>
            </div>
        </div>
    )
}
export default QuickActionGrid;