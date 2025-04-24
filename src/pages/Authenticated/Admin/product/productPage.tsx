import { Skeleton } from "@/components/ui/skeleton";
import { product_apis } from "@/lib/helpers/api_urls";
import { ProductType } from "@/types/typedef";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import ProductCard from "./product-card";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { setBreadcrumb } from "@/redux/Features/uiSlice";
import CreateProductModal from "./create-product-modal";
import { ListPagination } from "@/components/Custom/ListPagination";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

type ProductQueryResponseType = {
    products:ProductType[],
    last_page : number,
    per_page : number,
    current_page : number,
    total : number,
}

const ProductPage = () => {
    const dispatch = useAppDispatch();
    const searchText = useAppSelector(state=>state.ui.searchText);
    const {page,offset} = useParams();
    const productListQuery = useQuery<any,any,ProductQueryResponseType>({
        queryKey:['products',page,offset,searchText],
        queryFn: ()=>product_apis.list(page ?? 1,offset ?? 10, searchText?'?&search_query='+searchText:null),
        select: (res)=> res.data,
        staleTime : 10 * 60 * 60 * 100,
        gcTime : 10 * 60 * 60 * 100,
        enabled : !!page && !!offset
    });
    useEffect(()=>{
        dispatch(setBreadcrumb([{label:'Dashboard',link:'/dashboard'},{label:'Product List',type:'page'}]))
    },[])
    return (
        <div className="p-4 sm:p-6 lg:p-8 space-y-8 ">
            <div className="flex flex-row items-center justify-between gap-4 px-6 pt-6 md:pt-0">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Products</h1>
                <div className="flex gap-2">
                    <CreateProductModal />
                    <Button onClick={()=>productListQuery.refetch()} variant="outline" size="icon">
                        <RefreshCw className={(productListQuery.isLoading || productListQuery.isRefetching)?"animate-spin size-4": "size-4"} />
                    </Button>
                </div>
            </div>
            {productListQuery.isLoading && <ProductPageSkeleton />}
            {productListQuery.data && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
                {productListQuery.data.products.map((product) => (<ProductCard key={product.id} product={product} />))}    
            </div>}
            {(productListQuery.data?.last_page || 0) > 1 && (
                <div className="mx-auto pb-4">
                    <ListPagination url_end_point="products" last_page={productListQuery.data?.last_page || 1} current_page={productListQuery.data?.current_page || 1}/>
                </div>
            )}
        </div>
    )
}
export default ProductPage;

const ProductPageSkeleton = () => {
    return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
        {Array.from([1,2,3,4,5,6,7,8,9,10,11,12]).map(i=>(
            <Skeleton key={i} className="h-40">
                <Skeleton className="size-8 rounded-full" />
            </Skeleton>
        ))}    
    </div>  
}


