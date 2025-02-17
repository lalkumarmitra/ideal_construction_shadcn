import ImageUpload from "@/components/Custom/image-upload";
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AssetUrl } from "@/lib/helpers/api_helper";
import { product_apis } from "@/lib/helpers/api_urls";
import { ProductType } from "@/types/typedef";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader, PlusCircle } from "lucide-react"
import React, { FormEvent, ReactNode, useState } from "react";
import { toast } from "sonner";

interface CreateProductModalProps {
    defaultProduct?:ProductType,
    children?: ReactNode;
}

const CreateProductModal: React.FC<CreateProductModalProps> = ({children,defaultProduct=null}) => {
    const [open,setOpen] = useState(false);
    const queryClient = useQueryClient();
    const productMutation = useMutation({
        mutationFn:(data:FormData)=>defaultProduct?product_apis.update(data,defaultProduct.id):product_apis.create(data),
        onSuccess: (res) => {
            toast.success(res.message);
            setOpen(false);
            queryClient.invalidateQueries({queryKey:['products'],exact:false});
        },
        onError:(e:any)=>toast.error(e?.response?.data?.message ?? e.message)
    });
    const handleSubmit = (e:FormEvent<HTMLFormElement>)=>{
        e.preventDefault();
        const formData = new FormData(e.currentTarget)
        productMutation.mutate(formData)
    }
    return (
        <Dialog open={productMutation.isPending || open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children ? children  : <Button><PlusCircle className="size-4 mr-2 inline" />{defaultProduct?'Update Product':'Add New Product'}</Button>}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{defaultProduct?'Update Product':'Add New Product'}</DialogTitle>
                    <DialogDescription>{defaultProduct?'Change the product details and click update to change the product information.':'Enter the details for the new product. Click save when you\'re done.'}</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="grid gap-4 grid-cols-3">
                        <div className="flex justify-center items-center">
                            <ImageUpload disabled={productMutation.isPending} defaultImage={defaultProduct?AssetUrl + defaultProduct?.image:''} name="image" className=" rounded-lg size-24 text-xs text-center flex justify-center items-center" label="Product Image" id="image" />
                        </div>
                        <div className="grid gap-4 grid-cols-2 col-span-2">
                            <div className="grid gap-2 col-span-2">
                                <Label htmlFor="name">Product Name <span className="text-destructive">*</span></Label>
                                <Input disabled={productMutation.isPending} defaultValue={defaultProduct?.name}  name="name" id="name" placeholder="Enter Product name" type="text" />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="rate">Rate <span className="text-destructive">*</span></Label>
                                <Input disabled={productMutation.isPending} defaultValue={defaultProduct?.rate ?? 0.00} name="rate" id="rate" placeholder="Enter Product Rate" type="number" step={0.001} />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="unit">Unit <span className="text-destructive">*</span></Label>
                                <Input disabled={productMutation.isPending} defaultValue={defaultProduct?.unit ?? ''} name="unit" id="unit" placeholder="Product Unit" />
                            </div>
                        </div>
                        <div className="grid gap-2 col-span-3">
                            <Label htmlFor="description">Description (optional)</Label>
                            <Textarea disabled={productMutation.isPending} defaultValue={defaultProduct?.description ?? ''} name="description" id="description" placeholder="Enter Product description" />
                        </div>
                    </div>
                    <DialogFooter className="mt-6">
                        <Button disabled={productMutation.isPending} type="submit"> {productMutation.isPending && <Loader className="inline size-4 animate-spin" />} {defaultProduct?'Update':'Save Product'}</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
export default CreateProductModal;