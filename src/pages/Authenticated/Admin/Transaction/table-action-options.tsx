import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ArrowRight, Eye, FileEdit, Loader, Loader2, MoreHorizontal, Trash2 } from "lucide-react"
import CreateTransactionModal from "./create-transaction-dialog"
import { TransactionType } from "@/types/typedef"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { transaction_apis } from "@/lib/helpers/api_urls"
import { toast } from "sonner"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { TransactionCard } from "./transaction-card"

const TableActionOptions: React.FC<{transaction:TransactionType}> = ({transaction}) => {
    const [open,setOpen] = useState(false);
    const [deleteDialogOpen,setDeleteDialogOpen] = useState(false);
    const [viewDialogOpen,setViewDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const transactionDeleteMutation = useMutation({
        mutationFn:()=>transaction_apis.trash(transaction.id),
        onSuccess: res=> {
            toast.success(res.message);
            setDeleteDialogOpen(false);
            queryClient.invalidateQueries({queryKey:['transactions'],exact:false});
        },
        onError : (e:any) => toast.error(e?.response?.data?.message ?? e.message)
     });
     const handleDelete = () => transactionDeleteMutation.mutate();
    return (
        <>
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background/20 backdrop-blur-sm">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem className="cursor-pointer" onClick={()=>{
                    setOpen(false);
                    setViewDialogOpen(true);
                }}>
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View Details</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" >
                    <CreateTransactionModal defaultTransaction={transaction} >
                        <FileEdit className="mr-2 h-4 w-4 inline" />
                        <span>Edit Transaction</span>
                    </CreateTransactionModal>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem  onClick={()=>{
                    setOpen(false);
                    setDeleteDialogOpen(true);
                }} className="cursor-pointer text-destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Delete Transaction</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <Dialog open={transactionDeleteMutation.isPending || deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold text-center">Delete Transaction</DialogTitle>
                    <div className="flex items-center justify-center">
                        <div className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-50/10 flex items-center justify-center">
                            {transactionDeleteMutation.isPending ?<Loader className="h-10 w-10 text-red-500 animate-spin" /> : <Trash2 className="h-10 w-10 text-red-500" /> }
                            
                        </div>
                    </div>
                    <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-100">
                        Are you sure you want to delete this Transaction?
                    </p>
                </DialogHeader>
                <div className="grid gap-2">
                    <h3 className="text-center font-bold">Transaction Details</h3>
                    <div className="text-xs">
                        <p>Transaction ID : <span className="font-semibold">#{transaction.id}</span> on <span className="font-semibold">{transaction.loading_date}</span></p>
                        <p className="font-bold">{transaction.product?.name}  ({transaction.loading_point?.name} <ArrowRight className="size-4 inline mx-2" /> {transaction.unloading_point?.name})</p>
                        <p>DO : {transaction.do_number ?? 'N/A'}</p>
                        <p>Challan : {transaction.challan ?? 'N/A'}</p>
                    </div>
                </div>
                <div className="p-4 mt-2 bg-red-50 dark:bg-red-50/10 rounded-lg border border-red-100 dark:border-red-100/10">
                    <p className="text-sm text-red-600 leading-relaxed">
                        This will permanently remove the transaction and all associated data from our servers.
                        This action cannot be undone.
                    </p>
                </div>
                <DialogFooter className="gap-2 mt-6">
                    <DialogClose asChild>
                        <Button disabled={transactionDeleteMutation.isPending} variant="outline" className="w-full sm:w-auto">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button disabled={transactionDeleteMutation.isPending} onClick={handleDelete} variant="destructive" className="w-full sm:w-auto gap-2">
                        {transactionDeleteMutation.isPending?<Loader2 className="h-4 w-4" />:<Trash2 className="h-4 w-4" />}
                        Delete Transaction
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogContent className="">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold text-center">View Transaction</DialogTitle>
                    <p className="text-center text-sm font-medium text-gray-700 dark:text-gray-100">
                        All transaction details are listed here
                    </p>
                </DialogHeader>
                <div className="grid gap-2">
                    <TransactionCard transaction={transaction} />
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button>Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
        </>
    )
}
export default TableActionOptions;