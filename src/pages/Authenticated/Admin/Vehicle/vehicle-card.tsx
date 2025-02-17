import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { vehicle_apis } from "@/lib/helpers/api_urls";
import { VehicleType } from "@/types/typedef";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, Loader2, Trash2, Truck } from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";

interface VehicleCardProps {
    vehicle: VehicleType
}

const VehicleCard:React.FC<VehicleCardProps> = ({vehicle}) => {
    return <Card>
        <CardHeader className="flex flex-row gap-4 items-center justify-between">
            <div className="grid gap-2">
                <CardTitle className="text-sm sm:text-lg md:text-xl" >{vehicle.number}</CardTitle>
                <Badge variant={'outline'} className="w-fit" >{vehicle.type}</Badge>
            </div>
            <VehicleDeleteConfirmationDialog vehicle={vehicle} />
        </CardHeader>
    </Card>
}
export default VehicleCard;

interface VehicleDeleteConfirmationDialogProps {
    vehicle: VehicleType
}
const VehicleDeleteConfirmationDialog:React.FC<VehicleDeleteConfirmationDialogProps> = ({vehicle})=>{
    const [deleteDialogOpen,setDeleteDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const VehicleDeleteMutaion = useMutation({
        mutationFn:(id:string|number) => vehicle_apis.trash(id),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({queryKey:['vehicles'],exact:false});
            setDeleteDialogOpen(false);
        },
        onError:(e:any)=>toast.error(e?.response?.data?.message || e.message)
    });
    const handleDelete = () => VehicleDeleteMutaion.mutate(vehicle.id)
    return (
        <Dialog open={VehicleDeleteMutaion.isPending || deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
                <Button variant={'ghost'} className="text-destructive" size={'icon'} ><Trash2 className="size-6" /></Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold text-center">Delete Vehicle <Truck className="inline ms-2 size-8" /></DialogTitle>
                    <div className="flex items-center justify-center">
                        <div className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-50/10 flex items-center justify-center">
                            {VehicleDeleteMutaion.isPending ?<Loader className="h-10 w-10 text-red-500 animate-spin" /> : <Trash2 className="h-10 w-10 text-red-500" /> }
                            
                        </div>
                    </div>
                    <p className="text-center text-lg font-medium text-gray-700 dark:text-gray-100">
                        Are you sure you want to delete "<span className="whitespace-nowrap">{vehicle.number} <Badge>{vehicle.type}</Badge></span>"?
                    </p>
                </DialogHeader>
                <div className="p-4 mt-2 bg-red-50 dark:bg-red-50/10 rounded-lg border border-red-100 dark:border-red-100/10">
                    <p className="text-sm text-red-600 leading-relaxed">
                        This will permanently remove the vehicle and all associated data from our servers.
                        This action cannot be undone.
                    </p>
                </div>
                <DialogFooter className="gap-2 mt-6">
                    <DialogClose asChild>
                        <Button disabled={VehicleDeleteMutaion.isPending} variant="outline" className="w-full sm:w-auto">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button disabled={VehicleDeleteMutaion.isPending} onClick={handleDelete} variant="destructive" className="w-full sm:w-auto gap-2">
                        {VehicleDeleteMutaion.isPending?<Loader2 className="h-4 w-4 animate-spin" />:<Trash2 className="h-4 w-4" />}
                        Delete Vehicle
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}