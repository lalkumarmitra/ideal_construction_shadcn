import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AssetUrl } from "@/lib/helpers/api_helper"
import { UserType } from "@/types/user"
import { Eye, Loader, Loader2, MapPin, MoreHorizontal, Pencil, PencilLine, Phone, ShieldCheck, Trash, Trash2 } from "lucide-react"
import CreateUserDialog from "./create-user-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ReactNode, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { user_apis } from "@/lib/helpers/api_urls"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import ChangeEmailPhoneDialog from "./change-email-phone"

interface UserCardProps {
    user: UserType
}

const UserCard:React.FC<UserCardProps> = ({user}) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={AssetUrl + user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1"> 
                            <h3 className="text-base font-semibold">
                                {user.name.length > 16 ? user.name.substring(0, 13) + '...' : user.name}
                                <CreateUserDialog defaultUser={user} >
                                    <PencilLine className="size-5 ms-3 inline cursor-pointer hover:text-muted-foreground text-sky-600" />
                                </CreateUserDialog>
                            </h3>
                            <Badge className="w-fit" variant={'outline'} ><ShieldCheck className="h-4 w-4 mr-2" /> {user.role.name}</Badge>
                        </div>
                    </div>
                    <UserCardOptions user={user}>
                        <MoreHorizontal className="cursor-pointer hover:text-muted-foreground" />
                    </UserCardOptions>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm flex justify-between items-center w-full">
                                <span>{user.phone} </span>
                                <ChangeEmailPhoneDialog user={user} type="phone">
                                    <Pencil className="size-4 ms-3 inline cursor-pointer hover:text-muted-foreground" />
                                </ChangeEmailPhoneDialog>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm flex justify-between items-center w-full">
                                <span>{user.email} </span>
                                <ChangeEmailPhoneDialog user={user} type="email">
                                    <Pencil className="size-4 ms-3 inline cursor-pointer hover:text-muted-foreground" />
                                </ChangeEmailPhoneDialog>
                            </span>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
export default UserCard

const UserCardOptions:React.FC<{user:UserType,children?:ReactNode}> = ({user,children}) => {
    const [deleteDialogOpen,setDeleteDialogOpen] = useState(false);
    const [open,setOpen] = useState(false);
    const queryClient = useQueryClient();
    const {page,offset} = useParams();
    const navigate = useNavigate();
    const userDeleteMutation = useMutation({
        mutationFn:(id:string|number) => user_apis.trash(id),
        onSuccess: res=> {
            toast.success(res.message);
            setDeleteDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['users',page,offset]});
        },
        onError : (e:any) => toast.error(e?.response?.data?.message ?? e.message)
    })
    const handleUserDelete = () => userDeleteMutation.mutate(user.id)
    const handleNavigateToProfile = () =>navigate(`/users/profile/${user.id}`)
    return (
        <>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    {children?children:<MoreHorizontal className="cursor-pointer hover:text-muted-foreground" />}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleNavigateToProfile} className="text-green-600 cursor-pointer">
                        <Eye className="size-4 me-2" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>{
                        setOpen(false);
                        setDeleteDialogOpen(true);
                    }} className="text-destructive cursor-pointer">
                        <Trash className="size-4 me-2" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={userDeleteMutation.isPending || deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl font-bold text-center">Delete User</DialogTitle>
                        <div className="flex items-center justify-center">
                            <div className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-50/10 flex items-center justify-center">
                                {userDeleteMutation.isPending ?<Loader className="h-10 w-10 text-red-500 animate-spin" /> : <Trash2 className="h-10 w-10 text-red-500" /> }
                                
                            </div>
                        </div>
                        <p className="text-center text-lg font-medium text-gray-700 dark:text-gray-100">
                            Are you sure you want to delete "<span className="whitespace-nowrap">{user.name}</span>"?
                        </p>
                    </DialogHeader>
                    <div className="p-4 mt-2 bg-red-50 dark:bg-red-50/10 rounded-lg border border-red-100 dark:border-red-100/10">
                        <p className="text-sm text-red-600 leading-relaxed">
                            This will permanently remove the user and all associated data from our servers.
                            This action cannot be undone.
                        </p>
                    </div>
                    <DialogFooter className="gap-2 mt-6">
                        <DialogClose asChild>
                            <Button disabled={userDeleteMutation.isPending} variant="outline" className="w-full sm:w-auto">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button disabled={userDeleteMutation.isPending} onClick={handleUserDelete} variant="destructive" className="w-full sm:w-auto gap-2">
                            {userDeleteMutation.isPending?<Loader2 className="h-4 w-4" />:<Trash2 className="h-4 w-4" />}
                            Delete Product
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}