import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { AssetUrl } from "@/lib/helpers/api_helper"
import { UserType } from "@/types/user"
import { Loader, Loader2, Mail, MoreHorizontal, PencilLine, Phone, ScanEye, Trash, Trash2 } from "lucide-react"
import CreateUserDialog from "./create-user-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ReactNode, useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate, useParams } from "react-router-dom"
import { user_apis } from "@/lib/helpers/api_urls"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface UserCardProps {
    user: UserType
}

const UserCard:React.FC<UserCardProps> = ({user}) => {
    const navigate = useNavigate();
    const handleNavigateToProfile = () =>navigate(`/users/profile/${user.id}`)
    return (
        <Card className="hover:shadow-md hover:scale-105 transition-all duration-300">
            <CardHeader onClick={(e) => {
                // Only navigate if the click is on the card itself, not on buttons or icons
                if (!(e.target as HTMLElement).closest('button') && 
                    !(e.target as HTMLElement).closest('[role="button"]')) {
                    handleNavigateToProfile();
                }
            }} className="cursor-pointer">
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-12 w-12 border border-gray-400">
                            <AvatarImage src={AssetUrl + user.avatar} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-2"> 
                            <h3 className="text-sm font-semibold">
                                {user.name.replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, '').length > 16 ? user.name.replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, ' ').substring(0, 13) + '...' : user.name.replace(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/g, ' ')}
                            </h3>
                            <Badge className="w-fit text-xs" variant={'outline'} >{user.role.name}</Badge>
                        </div>
                    </div>
                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <CreateUserDialog defaultUser={user} >
                            <PencilLine className="size-5 ms-3 inline cursor-pointer hover:text-muted-foreground" />
                        </CreateUserDialog>
                        <UserCardOptions user={user}>
                            <MoreHorizontal className="cursor-pointer hover:text-muted-foreground" />
                        </UserCardOptions>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <div className="text-sm flex justify-between items-center w-full">
                                <span>{user.phone} </span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm flex justify-between items-center w-full">
                                <span>{user.email} </span>
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
    const handleNavigateToProfile = () =>navigate(`/users/profile/${user.id}`)
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
    
    return (
        <>
            <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                    {children?children:<MoreHorizontal className="cursor-pointer hover:text-muted-foreground" />}
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem onClick={handleNavigateToProfile} className="cursor-pointer">
                        <ScanEye className="size-4 me-2" />
                        <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>{
                        setOpen(false);
                        setDeleteDialogOpen(true);
                    }} className="cursor-pointer">
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