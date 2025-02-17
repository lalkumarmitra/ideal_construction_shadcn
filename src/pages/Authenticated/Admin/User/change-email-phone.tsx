import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { user_apis } from "@/lib/helpers/api_urls";
import { UserType } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PenLine } from "lucide-react";
import { FormEvent, ReactNode, useState } from "react";
import { toast } from "sonner";

const ChangeEmailPhoneDialog:React.FC<{user:UserType,children?:ReactNode,type:'email'|'phone'}> = ({user,children,type}) => {
    const [open,setOpen] = useState(false);
    const queryClient = useQueryClient();
    const updateUserMutation = useMutation({
        mutationFn:(data:FormData) => {
            const value = data.get('value')?.toString();
            if(type==='phone')
                return user_apis.changePhone(user.id,value || '')
                return user_apis.changeEmail(user.id,value || '')
        },
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
        updateUserMutation.mutate(formData);
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children?children:<PenLine className="size-4 inline" />}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{type === 'phone'?'Update Phone number':'Update Email address'}</DialogTitle>
                    <DialogDescription>{type === 'phone'?'Enter Phone number and click update to update phone number':'Enter email address and click update to update email'}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label className="text-muted-foreground" >{type==='phone'?'Current Phone Number':'Current Email Address'}</Label>
                            <Input type={'text'} disabled value={type==='phone'?user.phone:user.email} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="value">{type==='phone'?'New Phone Number':'New Email Address'}</Label>
                            <Input type={type==='phone'?'tel':'email'} required id="value" name='value' placeholder={type==='phone'?'Enter Phone number':'Enter Email address'} />
                        </div>
                    </div>
                    <DialogFooter className="gap-2 mt-4">
                        <DialogClose asChild>
                            <Button variant={'outline'} >Close</Button>
                        </DialogClose>
                        <Button type="submit" >Update</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default ChangeEmailPhoneDialog;