
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AssetUrl } from "@/lib/helpers/api_helper"
import { ProductType } from "@/types/typedef"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { AvatarFallback } from "@radix-ui/react-avatar"
import logo from '@/assets/logo_sm_transparent.png'
import { EyeIcon, IndianRupee, Loader, Loader2, PenLine, ShoppingBasket, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { product_apis } from "@/lib/helpers/api_urls"
import { toast } from "sonner"
import { useParams } from "react-router-dom"
import CreateProductModal from "./create-product-modal"


export default function ProductCard({ product }: { product: ProductType }) {
  return (
    <Card key={product.id} className="flex flex-col justify-between">
        <CardHeader className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-4 items-center">
                <Avatar>
                    <AvatarImage src={AssetUrl + product.image} />
                    <AvatarFallback><img src={logo} /></AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg font-semibold mb-2">{product.name}</CardTitle>
            </div>
        </CardHeader>
        <CardContent>
            <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold"><IndianRupee className="inline size-6" />{product.rate.toFixed(2)}</span>
                <Badge variant="secondary" className="text-sm">{product.unit}</Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-1">{product.description || '.....'}</p>
        </CardContent>
        <CardFooter className="flex flex-row justify-end pt-1">
            <ProductCardOptions product={product} />
        </CardFooter>
    </Card>
  )
}

const ProductCardOptions = ({ product }: { product: ProductType }) => {
    const [deleteDialogOpen,setDeleteDialogOpen] = useState(false);
    const queryClient = useQueryClient();
    const {page,offset} = useParams();
    const productDeleteMutation = useMutation({
        mutationFn:(id:string|number) => product_apis.trash(id),
        onSuccess: res=> {
            toast.success(res.message);
            setDeleteDialogOpen(false);
            queryClient.invalidateQueries({ queryKey: ['products',page,offset]});
        },
        onError : (e:any) => toast.error(e?.response?.data?.message ?? e.message)
    });
    const handleProductDelete = () => productDeleteMutation.mutate(product.id)
    return <>
        <div className="grid gap-2 grid-cols-3">
            <Button variant={'outline'} size={'icon'}><EyeIcon className="size-4 inline text-green-600" /></Button>
            <CreateProductModal defaultProduct={product}>
                <Button variant={'outline'} size={'icon'}> 
                    <PenLine className="size-4 inline" />
                </Button>
            </CreateProductModal>
            <Button variant={'outline'} onClick={()=>setDeleteDialogOpen(!deleteDialogOpen)} size={'icon'}><Trash2 className="size-4 inline text-destructive" /></Button>
        </div>
        
        <Dialog open={productDeleteMutation.isPending || deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogContent className="max-w-md">
                <DialogHeader className="space-y-3">
                    <DialogTitle className="text-2xl font-bold text-center">Delete Product <ShoppingBasket className="inline size-8 ms-3" /></DialogTitle>
                    <div className="flex items-center justify-center">
                        <div className="h-20 w-20 rounded-full bg-red-50 dark:bg-red-50/10 flex items-center justify-center">
                            {productDeleteMutation.isPending ?<Loader className="h-10 w-10 text-red-500 animate-spin" /> : <Trash2 className="h-10 w-10 text-red-500" /> }
                            
                        </div>
                    </div>
                    <p className="text-center text-lg font-medium text-gray-700 dark:text-gray-100">
                        Are you sure you want to delete "<span className="whitespace-nowrap">{product.name}</span>"?
                    </p>
                </DialogHeader>
                <div className="p-4 mt-2 bg-red-50 dark:bg-red-50/10 rounded-lg border border-red-100 dark:border-red-100/10">
                    <p className="text-sm text-red-600 leading-relaxed">
                        This will permanently remove the product and all associated data from our servers.
                        This action cannot be undone.
                    </p>
                </div>
                <DialogFooter className="gap-2 mt-6">
                    <DialogClose asChild>
                        <Button disabled={productDeleteMutation.isPending} variant="outline" className="w-full sm:w-auto">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button disabled={productDeleteMutation.isPending} onClick={handleProductDelete} variant="destructive" className="w-full sm:w-auto gap-2">
                        {productDeleteMutation.isPending?<Loader2 className="h-4 w-4" />:<Trash2 className="h-4 w-4" />}
                        Delete Product
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
}

