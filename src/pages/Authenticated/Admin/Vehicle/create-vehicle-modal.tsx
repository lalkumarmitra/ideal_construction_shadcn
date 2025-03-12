import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { vehicle_apis } from "@/lib/helpers/api_urls";
import { VehicleType } from "@/types/typedef";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BusFront, Loader, PlusCircle } from "lucide-react";
import React, { FormEvent, ReactNode, useState } from "react";
import { toast } from "sonner";


interface CreateVehicleDialogProps {
    defaultVehicle? : VehicleType,
    children?: ReactNode
}

const CreateVehicleDialog:React.FC<CreateVehicleDialogProps>=({defaultVehicle=null,children})=>{
    const [open,setOpen] = useState(false);
    const queryClient = useQueryClient();
    const vehicleMutation = useMutation({
        mutationFn: (data:FormData)=>vehicle_apis.create(data),
        onSuccess: (res)=> {
            toast.success(res.message);
            queryClient.invalidateQueries({queryKey:['vehicles'],exact:false});
            setOpen(!open);
        },
        onError:(e:any) => toast.error(e?.response?.data?.message || e.message)
    });
    const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        vehicleMutation.mutate(formData);
    }
    return <Dialog open={vehicleMutation.isPending || open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children?children:<Button className="flex gap-2">
                <PlusCircle className="size-4 inline" /> 
                <span className="hidden md:inline">Add New Vehicle</span>
            </Button>}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{defaultVehicle?'Update Vehicle Information':'Create New Vehicle'}</DialogTitle>
                <DialogDescription className="capitalize">{defaultVehicle?'Change the Vehicle data and click update to change vehicle information.':'Fill up the form and click Save to create new vehicle'}</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                    <div className="flex justify-center items-center">
                        <div className="p-6 bg-muted rounded-full flex justify-center items-center border border-dashed border-muted-foreground">
                            <BusFront className="size-8" />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="number">Vehicle ID/number <span className="text-destructive">*</span></Label>
                        <Input disabled={vehicleMutation.isPending} type='text' placeholder='eg. BR12W3456' name='number' id="number"/>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="type">Vehicle type <span className="text-destructive">*</span></Label>
                        <Input disabled={vehicleMutation.isPending} type='text' placeholder='eg. Truck, Pick up ..' name='type' id="type"/>
                    </div>
                    <DialogFooter>
                        <DialogClose>
                            <Button disabled={vehicleMutation.isPending} type="button" variant={'secondary'}>Close</Button>
                        </DialogClose>
                        <Button disabled={vehicleMutation.isPending} type="submit">
                            {vehicleMutation.isPending && <Loader className="mr-2 inline animate-spin"/>}
                            {defaultVehicle?'Update':'Save'}
                        </Button>
                    </DialogFooter>
                </div>
            </form>
        </DialogContent>
    </Dialog>
}
export default CreateVehicleDialog;