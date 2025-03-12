// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Input } from "@/components/ui/input"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeToggler } from "./LayoutComponents/ThemeToggler"
import AvatarMenu from "./LayoutComponents/AvatarMenu"
import { VerticalCompactSideBar, VerticalFullSideBar } from "./LayoutComponents/NavigationMenus"
import { Search } from "lucide-react"
import BreadcrumbNav from "./LayoutComponents/BreadcrumbNav"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { setSearchText } from "@/redux/Features/uiSlice"
// import NotificationMenu from "./LayoutComponents/NotificationMenu"
type MainLayoutProps = {
    children: React.ReactNode;
};
export function MainLayout({children}:MainLayoutProps) {
    const dispatch = useAppDispatch();
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchText(e.target.value ?? null))
    }
    const searchText = useAppSelector(state => state.ui.searchText);
    return (
        <TooltipProvider>
            <div className="flex min-h-screen w-full max-w-screen-2xl mx-auto flex-col">
                <VerticalCompactSideBar />
                <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
                    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
                        <VerticalFullSideBar />
                        <BreadcrumbNav />
                        <div className="relative ml-auto flex-1 md:grow-0">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={searchText || ''}
                                onChange={handleSearch}
                                type="search"
                                placeholder="Search ..."
                                className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                            />
                        </div>
                        {/* <NotificationMenu /> */}
                        <ThemeToggler />
                        <AvatarMenu />
                    </header>
                    {/* <Separator /> */}
                    {children}
                </div>
            </div>
        </TooltipProvider>
    )
}
