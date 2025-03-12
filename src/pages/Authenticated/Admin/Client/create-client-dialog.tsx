import { CustomSelect } from "@/components/Custom/CustomSelect";
import ImageUpload from "@/components/Custom/image-upload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AssetUrl } from "@/lib/helpers/api_helper";
import { client_apis } from "@/lib/helpers/api_urls";
import { ClientType } from "@/types/typedef";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, PlusCircle } from "lucide-react";
import React, { FormEvent, ReactNode, useState } from "react";
import { toast } from "sonner";

const CreateNewClient:React.FC<{defaultClient?:ClientType,children?:ReactNode}> = ({defaultClient,children}) => {
    const [open,setOpen] = useState(false);
    const queryClient = useQueryClient();
    const clientMutation = useMutation({
        mutationFn:(data:FormData) => defaultClient ? client_apis.update(data,defaultClient.id):client_apis.create(data),
        onSuccess: (res) => {
            toast.success(res.message);
            setOpen(false);
            queryClient.invalidateQueries({queryKey:['clients'],exact:false});
        },
        onError:(e:any)=>toast.error(e?.response?.data?.message ?? e.message)
    });
    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        clientMutation.mutate(formData);
    }
    return (
        <Dialog open={clientMutation.isPending || open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children?children: 
                    <Button className="flex gap-2">
                        <PlusCircle className="size-4 inline" />
                        <span className="hidden md:inline"> Add new Client</span>
                    </Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{defaultClient ? 'Update Client Information':'Create New Client'}</DialogTitle>
                    <DialogDescription>
                        {defaultClient?'Update the client details and click save to change client information.':'Fill up the below form to create client. loading point or unloading point. click save to create new Client'}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 grid-cols-3">
                        <div className="flex justify-center items-center">
                            <ImageUpload 
                                disabled={clientMutation.isPending} 
                                defaultImage={defaultClient?AssetUrl + defaultClient?.image:''} 
                                name="image" 
                                className=" rounded-lg size-28 text-xs text-center flex justify-center items-center" 
                                label="Client Image" 
                                id="image" 
                            />
                        </div>
                        <div className="grid gap-2 col-span-2">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Client Name <span className="text-destructive">*</span></Label>
                                <Input disabled={clientMutation.isPending} defaultValue={defaultClient?.name}  name="name" id="name" placeholder="Enter Client name" type="text" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="type">Type <span className="text-destructive">*</span></Label>
                                <CustomSelect 
                                    id="type" 
                                    name="type" 
                                    disabled={clientMutation.isPending}
                                    defaultValue={defaultClient?.type || 'loading_point'}
                                    options={[
                                        {label:'Loading Point',value:'loading_point'},
                                        {label:'Unloading Point',value:'unloading_point'}
                                    ]} 
                                />
                            </div>
                        </div>
                        <div className="grid gap-4 col-span-3 grid-cols-2">
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="client_size">Client size <span className="text-destructive">*</span></Label>
                                <CustomSelect 
                                    name="client_size" 
                                    id="client_size" 
                                    disabled={clientMutation.isPending}
                                    defaultValue={defaultClient?.client_size || 'small'} 
                                    options={[
                                        {label:'Small',value:'small'},
                                        {label:'Medium',value:'medium'},
                                        {label:'Big',value:'big'},
                                        {label:'Misclenious',value:'misc'},
                                    ]} 
                                />
                            </div>
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="name">Address </Label>
                                <Input disabled={clientMutation.isPending} defaultValue={defaultClient?.address || ''}  name="address" id="address" placeholder="Enter Address" type="text" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="state">State </Label>
                                <Input disabled={clientMutation.isPending} defaultValue={defaultClient?.state || ''}  name="state" id="state" placeholder="Enter state" type="text" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="pin">Pin </Label>
                                <Input disabled={clientMutation.isPending} defaultValue={defaultClient?.pin || ''}  name="pin" id="pin" placeholder="Enter Pin" type="text" />
                            </div>
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <DialogClose asChild>
                            <Button disabled={clientMutation.isPending} variant={'outline'}>Close</Button>
                        </DialogClose>
                        <Button disabled={clientMutation.isPending} type="submit"> {clientMutation.isPending && <Loader className="animate-spin me-2 inline size-4" />} {defaultClient?'Update':'Save'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default CreateNewClient;