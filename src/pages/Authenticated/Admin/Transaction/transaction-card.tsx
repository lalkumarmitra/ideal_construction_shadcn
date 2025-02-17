import { CalendarIcon, TruckIcon, PackageIcon, ArrowRightIcon, PenBox, Trash2, Loader, Loader2, ArrowRight } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TransactionType } from "@/types/typedef"
import { AssetUrl } from "@/lib/helpers/api_helper"
import CreateTransactionDialog from "./create-transaction-dialog"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { transaction_apis } from "@/lib/helpers/api_urls"
import { toast } from "sonner"
import { useParams } from "react-router-dom"



export function TransactionCard({ transaction }: { transaction: TransactionType }) {
    return (
        <Card className="w-full max-w-md overflow-hidden">
            <CardHeader className="p-4 pb-0 flex flex-row justify-between items-start">
                <div className="flex items-center space-x-4">
                    <Avatar className="w-16 h-16">
                        <AvatarImage src={AssetUrl + transaction.product?.image} alt={transaction.product?.name} />
                        <AvatarFallback>{transaction.product?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                        <h3 className="font-bold text-lg">{transaction.product?.name}</h3>
                        <p className="text-sm text-muted-foreground">TXN ID: {transaction.id}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <CreateTransactionDialog defaultTransaction={transaction}>
                        <PenBox className="size-6 cursor-pointer hover:text-muted-foreground" />
                    </CreateTransactionDialog>
                    <TransactionDeleteDialog transaction={transaction} />
                </div>
            </CardHeader>
            <CardContent className="p-4">
                <div className="grid grid-cols-[1fr,auto,1fr] gap-2 items-center">
                    {/* Loading (Purchase) Details */}
                    <div className="space-y-2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 mb-2">Loading</Badge>
                        <div className="flex items-center space-x-2">
                            <Avatar className="w-8 h-8">
                                <AvatarImage src={AssetUrl + transaction.loading_point?.image} alt={transaction.loading_point?.name} />
                                <AvatarFallback>{transaction.loading_point?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">{transaction.loading_point?.name}</span>
                        </div>
                        <div className="bg-primary/10 p-2 rounded-md">
                            <div className="flex items-center text-sm">
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span className="font-semibold">{new Date(transaction.loading_date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center text-sm mt-1">
                                <PackageIcon className="mr-2 h-4 w-4" />
                                <span className="font-semibold">{transaction.loading_quantity} {transaction.product?.unit}</span>
                            </div>
                        </div>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <TruckIcon className="mr-2 h-4 w-4" />
                            {transaction.loading_vehicle?.number}
                        </div>
                    </div>

                    {/* Separator and Arrow */}
                    <div className="flex flex-col items-center h-full justify-center">
                        <div className="border-l border-dotted border-gray-300 h-full"></div>
                        <ArrowRightIcon className="text-primary my-2" />
                        <div className="border-l border-dotted border-gray-300 h-full"></div>
                    </div>

                    {/* Unloading (Sale) Details */}
                    <div className="space-y-2">
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-100 mb-2">Unloading</Badge>
                        {transaction.unloading_date ? (
                            <>
                                <div className="flex items-center space-x-2">
                                    <Avatar className="w-8 h-8">
                                        <AvatarImage
                                            src={AssetUrl+ transaction.unloading_point?.image}
                                            alt={transaction.unloading_point?.name}
                                        />
                                        <AvatarFallback>{transaction.unloading_point?.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium text-sm">{transaction.unloading_point?.name}</span>
                                </div>
                                <div className="bg-primary/10 p-2 rounded-md">
                                    <div className="flex items-center text-sm">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        <span className="font-semibold">{new Date(transaction.unloading_date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center text-sm mt-1">
                                        <PackageIcon className="mr-2 h-4 w-4" />
                                        <span className="font-semibold">{transaction.unloading_quantity} {transaction.product?.unit}</span>
                                    </div>
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <TruckIcon className="mr-2 h-4 w-4" />
                                    {transaction.unloading_vehicle?.number}
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground">No unloading data</p>
                        )}
                    </div>
                </div>
                <Separator className="my-4" />
                <div className="text-xs text-muted-foreground flex justify-between">
                    <span>DO: {transaction.do_number || "N/A"}</span>
                    <span>Challan: {transaction.challan || "N/A"}</span>
                </div>
            </CardContent>
        </Card>
    )
}

const TransactionDeleteDialog:React.FC<{transaction:TransactionType}> = ({transaction}) => {
    const [deleteDialogOpen,setDeleteDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const {page,offset} = useParams();
     const transactionDeleteMutation = useMutation({
        mutationFn:()=>transaction_apis.trash(transaction.id),
        onSuccess: res=> {
            toast.success(res.message);
            setDeleteDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['transactions',page,offset]});
        },
        onError : (e:any) => toast.error(e?.response?.data?.message ?? e.message)
     });
     const handleDelete = () => transactionDeleteMutation.mutate();
    return (
        <Dialog open={transactionDeleteMutation.isPending || deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
                <Trash2 className="size-6 cursor-pointer hover:text-muted-foreground" />
            </DialogTrigger>
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
    )
}

