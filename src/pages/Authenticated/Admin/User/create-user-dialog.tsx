import { CustomSelect } from "@/components/Custom/CustomSelect";
import ImageUpload from "@/components/Custom/image-upload";
import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AssetUrl } from "@/lib/helpers/api_helper";
import { role_apis, user_apis } from "@/lib/helpers/api_urls";
import { RoleType, UserType } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, PlusCircle } from "lucide-react";
import React, { FormEvent, ReactNode, useState } from "react";
import { toast } from "sonner";

interface CreateUserDialogProps {
    defaultUser?:UserType,
    children?: ReactNode;
}

const CreateUserDialog:React.FC<CreateUserDialogProps> = ({defaultUser,children}) => {
    const [open,setOpen] = useState(false);
    const queryClient = useQueryClient();
    const userMutation = useMutation({
        mutationFn:(data:FormData) => defaultUser? user_apis.update(data,defaultUser.id) : user_apis.create(data),
        onSuccess: (res) => {
            toast.success(res.message);
            queryClient.invalidateQueries({queryKey:['users'],exact:false});
            setOpen(false);
        },
        onError:(e:any)=>toast.error(e?.response?.data?.message || e.message)
    });
    const handleSubmit = (e:FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        userMutation.mutate(formData)
    }
    const rolesQuery = useQuery<any,any,RoleType[]>({
        queryKey: ['roles'],
        queryFn:role_apis.list,
        select: (res)=>res.data.roles,
        staleTime: 15 * 60 * 60 * 100,
        gcTime : 15 * 60 * 60 * 100
    });
    return (
        <Dialog open={userMutation.isPending || open} onOpenChange={setOpen} >
            <DialogTrigger asChild>
                {children ? children  : <Button><PlusCircle className="size-4 mr-2 inline" />{defaultUser?'Update User Details':'Add New User'}</Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{defaultUser?'Update User Details':'Add New User'}</DialogTitle>
                    <DialogDescription>{defaultUser?'Change the user details and click update to change the user information.':'Enter the details for the new Product. Click save when you\'re done.'}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid gap-4 grid-cols-3">
                        <div className="flex justify-center items-center">
                            <ImageUpload disabled={userMutation.isPending} defaultImage={defaultUser?AssetUrl + defaultUser?.avatar:''} name="avatar" className="p-1 rounded-lg size-24 text-xs text-center flex justify-center items-center" label="Profile Image" id="avatar" />
                        </div>
                        <div className="grid gap-4 grid-cols-2 col-span-2">
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="name">Full Name <span className="text-destructive">*</span></Label>
                                <Input disabled={userMutation.isPending} defaultValue={defaultUser?.name}  name="name" id="name" placeholder="Enter full name" type="text" />
                            </div>
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="phone">Phone <span className="text-destructive">*</span></Label>
                                <Input disabled={userMutation.isPending || !!defaultUser} defaultValue={defaultUser?.phone ?? ''} name="phone" id="phone" placeholder="Phone number" />
                            </div>
                        </div>
                        <div className="grid gap-4 grid-cols-2 col-span-3">
                            <div className="grid gap-2 col-span-3">
                                <Label htmlFor="email">Email</Label>
                                <Input disabled={userMutation.isPending || !!defaultUser} defaultValue={defaultUser?.email ?? ''} name="email" id="email" placeholder="Enter Product email" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="role">Role <span className="text-destructive">*</span></Label>
                                <CustomSelect 
                                    key={defaultUser?.id || 0} 
                                    name="role_id" 
                                    disabled={rolesQuery.isLoading || userMutation.isPending} 
                                    defaultValue={defaultUser?.role?.id.toString()} 
                                    id="role" 
                                    options={rolesQuery.data?.map(r=>({label:r.name,value:r.id}))} 
                                />    
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="gender">Gender</Label>
                                <CustomSelect disabled={userMutation.isPending} id="gender" defaultValue={defaultUser?.gender ?? "male"} options={[{label:'Male',value:'male'},{label:'Female',value:'female'},{label:'Other',value:'other'}]} />    
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="dob">Date of Birth</Label>
                                <Input disabled={userMutation.isPending} defaultValue={defaultUser?.dob ? defaultUser.dob.split('T')[0] : ''} name="dob" type="date" id="dob" />   
                            </div>
                            <div className="grid gap-2 col-span-3">
                                <Label htmlFor="password">Password</Label>
                                <Input disabled={userMutation.isPending} name="password" id="password" />   
                            </div>
                        </div>
                        <DialogFooter className="col-span-3 gap-2">
                            <DialogClose asChild>
                                <Button variant={'secondary'}>Close</Button>
                            </DialogClose>
                            <Button type="submit"> {userMutation.isPending && <Loader2 className="animate-spin inline size-4" />} {defaultUser ? 'Update' : 'Save'}</Button>
                        </DialogFooter>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default CreateUserDialog;