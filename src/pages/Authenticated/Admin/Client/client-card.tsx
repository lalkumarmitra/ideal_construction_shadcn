import { ClientType } from "@/types/typedef";
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AssetUrl } from "@/lib/helpers/api_helper";
import { Handshake, Loader, Loader2, MoreHorizontal, PencilLine, ScanEyeIcon, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CreateNewClient from "./create-client-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client_apis } from "@/lib/helpers/api_urls";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { useState } from "react";
import { Button } from "@/components/ui/button";


const ClientCard:React.FC<{client:ClientType}> = ({client}) => {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-12 w-12">
                            <AvatarImage src={AssetUrl + client.image} alt={client.name} />
                            <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-1"> 
                            <h3 className="text-sm font-semibold">
                                {client.name.length > 14 ? client.name.substring(0, 11) + '...' : client.name}
                                <CreateNewClient defaultClient={client}>
                                    <PencilLine className="size-5 ms-3 inline cursor-pointer hover:text-muted-foreground text-sky-600" />
                                </CreateNewClient>
                            </h3>
                            <Badge className="capitalize">{client.type.replace(/_/g, " ")}</Badge>
                        </div>
                    </div>
                    <ClientCardOptions client={client} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col text-muted-foreground text-sm">
                    <p className="capitalize">{client.client_size} Client</p>
                    <p className="capitalize line-clamp-1">{client.address} {client.state} {client.pin} </p>
                </div>
            </CardContent>
        </Card>
    );
}
export default ClientCard;

const ClientCardOptions:React.FC<{client:ClientType}> = ({client}) => {
    const [deleteDialogOpen,setDeleteDialogOpen] = useState(false);
    const [open,setOpen] = useState(false);
    const queryClient = useQueryClient();
    const {page,offset} = useParams();
    const clientDeleteMutation = useMutation({
        mutationFn:()=>client_apis.trash(client.id),
        onSuccess: res=> {
            toast.success(res.message);
            setDeleteDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['clients',page,offset]});
        },
        onError : (e:any) => toast.error(e?.response?.data?.message ?? e.message)
    });
    const handleClientDelete = () => clientDeleteMutation.mutate();
    return (
        <>
            <DropdownMenu open={clientDeleteMutation.isPending || open} onOpenChange={setOpen}>
                <DropdownMenuTrigger>
                    <MoreHorizontal className="cursor-pointer hover:text-muted-foreground" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem>
                        <ScanEyeIcon className="size-4 inline me-3" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=> {
                        setOpen(false);
                        setDeleteDialogOpen(true);
                    }}>
                        <Trash2 className="size-4 inline me-3" /> Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            <Dialog open={clientDeleteMutation.isPending || deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader className="space-y-3">
                        <DialogTitle className="text-2xl font-bold text-center">Delete Client <Handshake className="inline size-8 ms-3" /></DialogTitle>
                        <div className="flex items-center justify-center">
                            <div className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-50/10 flex items-center justify-center">
                                {clientDeleteMutation.isPending ?<Loader className="h-10 w-10 text-red-500 animate-spin" /> : <Trash2 className="h-10 w-10 text-red-500" /> }
                                
                            </div>
                        </div>
                        <p className="text-center text-lg font-medium text-gray-700 dark:text-gray-100">
                            Are you sure you want to delete "<span className="whitespace-nowrap">{client.name}</span>"?
                        </p>
                    </DialogHeader>
                    <div className="p-4 mt-2 bg-red-50 dark:bg-red-50/10 rounded-lg border border-red-100 dark:border-red-100/10">
                        <p className="text-sm text-red-600 leading-relaxed">
                            This will permanently remove the client and all associated data from our servers.
                            This action cannot be undone.
                        </p>
                    </div>
                    <DialogFooter className="gap-2 mt-6">
                        <DialogClose asChild>
                            <Button disabled={clientDeleteMutation.isPending} variant="outline" className="w-full sm:w-auto">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button disabled={clientDeleteMutation.isPending} onClick={handleClientDelete} variant="destructive" className="w-full sm:w-auto gap-2">
                            {clientDeleteMutation.isPending?<Loader2 className="h-4 w-4" />:<Trash2 className="h-4 w-4" />}
                            Delete Client
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}