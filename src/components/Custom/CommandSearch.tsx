import * as React from "react"
import { CommandDialog, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command"
import { useQuery } from "@tanstack/react-query"
import { ClientType, ProductType, VehicleType } from "@/types/typedef"
import { client_apis, product_apis, user_apis, vehicle_apis } from "@/lib/helpers/api_urls"
import { UserType } from "@/types/user"
import { useDebounce } from "@/hooks/use-debounce"
import { Separator } from "../ui/separator"
import { Handshake, Search, ShoppingBasket, Truck, Users } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { AvatarImage } from "@radix-ui/react-avatar"
import { AssetUrl } from "@/lib/helpers/api_helper"
import { Badge } from "../ui/badge"

export function CommandDialogDemo() {
    const [open, setOpen] = React.useState(false)
    const [searchQuery, setSearchQuery] = React.useState<string>('');
    const [initialDataLoaded, setInitialDataLoaded] = React.useState(false);
    
    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }
        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, []);

    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    
    // Reset search when dialog closes
    React.useEffect(() => {
        if (!open) {
            setSearchQuery('');
        } else if (!initialDataLoaded) {
            // Load initial data when modal opens for the first time
            setInitialDataLoaded(true);
        }
    }, [open, initialDataLoaded]);

    // Format the search query param
    const queryParam = React.useMemo(() => {
        return debouncedSearchQuery ? `/?&search_query=${encodeURI(debouncedSearchQuery)}` : '';
    }, [debouncedSearchQuery]);

    // Initial data queries - always load on open
    const productListQuery = useQuery<any, any, ProductType[]>({
        queryKey: ["products-global"],
        queryFn: () => product_apis.list(1, 3, ''),
        select: (res) => res.data.products,
        staleTime: 5 * 60 * 60 * 100,
        gcTime: 5 * 60 * 60 * 100,
        enabled: initialDataLoaded
    });

    const vehicleListQuery = useQuery<any, any, VehicleType[]>({
        queryKey: ["vehicles-global"],
        queryFn: () => vehicle_apis.list(1, 3, ''),
        select: (res) => res.data.vehicles,
        staleTime: 5 * 60 * 60 * 100,
        gcTime: 5 * 60 * 60 * 100,
        enabled: initialDataLoaded
    });

    const userListQuery = useQuery<any, any, UserType[]>({
        queryKey: ["drivers-global"],
        queryFn: () => user_apis.list(1, 3, ''),
        select: (res) => res.data.users,
        staleTime: 5 * 60 * 60 * 100,
        gcTime: 5 * 60 * 60 * 100,
        enabled: initialDataLoaded
    });

    const clientListQuery = useQuery<any, any, ClientType[]>({
        queryKey: ["clients-global"],
        queryFn: () => client_apis.list(1, 3, ''),
        select: (res) => res.data.clients,
        staleTime: 5 * 60 * 60 * 100,
        gcTime: 5 * 60 * 60 * 100,
        enabled: initialDataLoaded
    });

    // Search queries - run when there's a search query
    const searchProductsQuery = useQuery<any, any, ProductType[]>({
        queryKey: ["products-search", queryParam],
        queryFn: () => product_apis.list(1, 10, queryParam),
        select: (res) => res.data.products,
        enabled: !!queryParam && initialDataLoaded,
    });

    const searchVehiclesQuery = useQuery<any, any, VehicleType[]>({
        queryKey: ["vehicles-search", queryParam],
        queryFn: () => vehicle_apis.list(1, 10, queryParam),
        select: (res) => res.data.vehicles,
        enabled: !!queryParam && initialDataLoaded,
    });

    const searchUsersQuery = useQuery<any, any, UserType[]>({
        queryKey: ["drivers-search", queryParam],
        queryFn: () => user_apis.list(1, 10, queryParam),
        select: (res) => res.data.users,
        enabled: !!queryParam && initialDataLoaded,
    });

    const searchClientsQuery = useQuery<any, any, ClientType[]>({
        queryKey: ["clients-search", queryParam],
        queryFn: () => client_apis.list(1, 10, queryParam),
        select: (res) => res.data.clients,
        enabled: !!queryParam && initialDataLoaded,
    });

    // Determine which data to display based on search status
    const displayUsers = React.useMemo(() => {
        if (debouncedSearchQuery && searchUsersQuery.data) {
            return searchUsersQuery.data;
        }
        return userListQuery.data || [];
    }, [debouncedSearchQuery, userListQuery.data, searchUsersQuery.data]);
    
    const displayClients = React.useMemo(() => {
        if (debouncedSearchQuery && searchClientsQuery.data) {
            return searchClientsQuery.data;
        }
        return clientListQuery.data || [];
    }, [debouncedSearchQuery, clientListQuery.data, searchClientsQuery.data]);
    
    const displayProducts = React.useMemo(() => {
        if (debouncedSearchQuery && searchProductsQuery.data) {
            return searchProductsQuery.data;
        }
        return productListQuery.data || [];
    }, [debouncedSearchQuery, productListQuery.data, searchProductsQuery.data]);
    
    const displayVehicles = React.useMemo(() => {
        if (debouncedSearchQuery && searchVehiclesQuery.data) {
            return searchVehiclesQuery.data;
        }
        return vehicleListQuery.data || [];
    }, [debouncedSearchQuery, vehicleListQuery.data, searchVehiclesQuery.data]);

    // Check if any search is in progress
    const isSearching = searchUsersQuery.isLoading || searchClientsQuery.isLoading || searchProductsQuery.isLoading || searchVehiclesQuery.isLoading;
    // Check if we have no results across all categories
    const hasNoResults = debouncedSearchQuery && !isSearching && displayUsers.length === 0 && displayClients.length === 0 && displayProducts.length === 0 && displayVehicles.length === 0;
    
    const navigate = useNavigate();
    const handleNavigateToProfile = (id:string|number) => navigate(`/users/profile/${id}`)
    const handleUserSelect = (id:string|number) => {
        handleNavigateToProfile(id);
        setOpen(false);
    }

    return (
        <CommandDialog open={open} onOpenChange={setOpen} >
            <div className="flex gap-2 items-center px-3">
                <Search className="size-5 text-muted-foreground" />
                <input 
                    className="p-2 rounded-lg outline-none m-1 w-full bg-background"
                    value={searchQuery}
                    onChange={(e)=>setSearchQuery(e.target.value)} 
                    placeholder="Type a command or search..." 
                />
            </div>
            <Separator />
            <CommandList>
                {isSearching && (<CommandEmpty>Searching...</CommandEmpty>)}
                {hasNoResults && (<CommandEmpty>No results found.</CommandEmpty>)}
                {displayUsers.length > 0 && (
                    <CommandGroup heading={
                        <div className="flex items-center gap-2 text-emerald-600">
                            <Users className="size-5" />
                            <span className="text-sm">Users</span>
                        </div>
                    }>
                        {displayUsers.map((u: UserType) => (
                            <CommandItem key={u.id} onSelect={(_e) =>handleUserSelect(u.id)}>
                                <div className="flex gap-2 justify-between items-center w-full">
                                    <div className="flex gap-2 items-center">
                                        <Avatar className="h-6 w-6 border border-gray-600">
                                            <AvatarImage src={AssetUrl + u.avatar} alt={u.name} />
                                            <AvatarFallback className="text-xs">{u.name.charAt(0)}</AvatarFallback>
                                        </Avatar>   
                                        <span className="font-bold">{u.name}</span>
                                    </div>
                                    <Badge variant={'outline'} className={`${u.role.type === 'admin'?'text-destructive':''} w-fit text-xs`}>{u.role.name}</Badge>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
                {displayUsers.length > 0 && displayClients.length > 0 && <CommandSeparator />}
                {displayClients.length > 0 && (
                    <CommandGroup heading={
                        <div className="flex items-center gap-2 text-blue-600">
                            <Handshake className="size-5" />
                            <span className="text-sm">Clients</span>
                        </div>
                    }>
                        {displayClients.map((c: ClientType) => (
                            <CommandItem key={c.id}>
                                <div className="flex gap-2 justify-between items-center w-full">
                                    <div className="flex gap-2 items-center">    
                                        <Avatar className="h-6 w-6 border border-gray-600">
                                            <AvatarImage src={AssetUrl + c.image} alt={c.name} />
                                            <AvatarFallback>{c.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-bold">
                                            {c.name}{" "} 
                                            <span className="text-xs font-thin text-muted-foreground capitalize">({c.client_size} Client)</span>
                                        </span>
                                    </div>
                                    <Badge variant={'outline'} className={`${c.type === 'loading_point'?'text-blue-600':'text-green-600'} w-fit text-xs capitalize`}>{c.type.replace(/_/g, " ")}</Badge>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
                
                {displayClients.length > 0 && displayProducts.length > 0 && <CommandSeparator />}
                {displayProducts.length > 0 && (
                    <CommandGroup heading={
                        <div className="flex items-center gap-2 text-amber-600">
                            <ShoppingBasket className="size-5" />
                            <span className="text-sm">Products</span>
                        </div>
                    }>
                        {displayProducts.map((p: ProductType) => (
                            <CommandItem key={p.id}>
                                <div className="flex gap-2 justify-between items-center w-full">
                                    <div className="flex gap-2 items-center">    
                                        <Avatar className="h-6 w-6 border border-gray-600">
                                            <AvatarImage src={AssetUrl + p.image} alt={p.name} />
                                            <AvatarFallback>{p.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-bold">{p.name}</span>
                                    </div>
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
                
                {displayProducts.length > 0 && displayVehicles.length > 0 && <CommandSeparator />}
                {displayVehicles.length > 0 && (
                    <CommandGroup heading={
                        <div className="flex items-center gap-2 text-cyan-600">
                            <Truck className="size-5" />
                            <span className="text-sm">Vehicles</span>
                        </div>
                    }>
                        {displayVehicles.map((v: VehicleType) => (
                            <CommandItem key={v.id}>
                                <span>{v.number}</span>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                )}
            </CommandList>
        </CommandDialog>
    )
}