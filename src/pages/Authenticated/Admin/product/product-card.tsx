
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AssetUrl } from "@/lib/helpers/api_helper"
import { ProductType } from "@/types/typedef"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { AvatarFallback } from "@radix-ui/react-avatar"
import logo from '@/assets/logo_sm_transparent.png'
import { EyeIcon, IndianRupee, Loader, Loader2, PenLine, ShoppingBasket, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import React, { useState } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { product_apis } from "@/lib/helpers/api_urls"
import { toast } from "sonner"
import { useParams } from "react-router-dom"
import CreateProductModal from "./create-product-modal"
import { cn } from "@/lib/utils"


export default function ProductCard({ product }: { product: ProductType }) {
  return (
    <Card key={product.id} className="flex flex-col justify-between hover:scale-105 transition-all duration-300">
        <CardHeader className="flex flex-row justify-between items-center">
            <div className="flex gap-4 items-center">
                <Avatar>
                    <AvatarImage src={AssetUrl + product.image} />
                    <AvatarFallback><img src={logo} /></AvatarFallback>
                </Avatar>
                <CardTitle className="text-lg font-semibold mb-2">{product.name}</CardTitle>
            </div>
            <ProductCardOptions product={product} />
        </CardHeader>
        <CardContent>
            <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-bold"><IndianRupee className="inline size-6" />{product.rate.toFixed(2)}</span>
                <Badge variant="secondary" className="text-sm">{product.unit}</Badge>
            </div>
            <p className="text-sm text-gray-600 line-clamp-1">{product.description || '.....'}</p>
        </CardContent>
    </Card>
  )
}

interface ProductCardOptionsProps {
    product: ProductType;
    className?: string;
}
const ProductCardOptions: React.FC<ProductCardOptionsProps> = ({ product, className }) => {
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
        <div className={cn("group grid gap-3 grid-cols-3 place-items-center place-content-center border rounded-lg p-2 hover:scale-105 hover:shadow-md transition-all duration-300",className)}>
            <EyeIcon className="size-4 inline cursor-pointer text-muted-foreground hover:text-green-500 group-hover:text-green-500" />
            <CreateProductModal defaultProduct={product}>
                <PenLine className="size-4 inline cursor-pointer text-muted-foreground hover:text-cyan-600 group-hover:text-cyan-600" />
            </CreateProductModal>
            <Trash2 onClick={()=>setDeleteDialogOpen(!deleteDialogOpen)} className="size-4 inline cursor-pointer text-muted-foreground hover:text-red-600 group-hover:text-red-600" />
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

