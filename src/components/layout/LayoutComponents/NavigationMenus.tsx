import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Menu } from "lucide-react";
import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from '@/assets/logo_sm_transparent.png'
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useAuth } from "@/Auth/AuthProvider";
import { RouteType } from "@/types/route";
import { routes } from "@/lib/Routes";


const getRoutePath = (route: RouteType) => {
    let index = 0;
    return route.path.replace(/:[^/]+/g, () => {
        return (route.defaultParameters?.[index++]) || "";
    });
};


export const generateTooltipRoute: React.FC<RouteType> = (route, index) => {
    const Icon = route.icon;
    return route.isMenu && (
        <Tooltip key={index}>
            <TooltipTrigger>
                <NavLink
                    to={getRoutePath(route)}
                    className={({ isActive }) => `flex h-9 w-9 items-center justify-center rounded-lg ${isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground md:h-8 md:w-8`}
                >
                    {Icon && <Icon className="h-5 w-5" />}
                    <span className="sr-only">{route.label}</span>
                </NavLink>
            </TooltipTrigger>
            <TooltipContent side="right">{route.label}</TooltipContent>
        </Tooltip>
    )
}

export const VerticalCompactSideBar: React.FC<{ type?: string }> = () => {
    const { user } = useAuth();
    return (
        <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                <Link to={'/'} className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
                    <img src={logo} className="w-56 aspect-square object-contain dark:invert" />
                    <span className="sr-only">Ideal Construction</span>
                </Link>
                {
                    routes.filter(r => r.users ? (user?.role.type && r.users.includes(user?.role.type.toLowerCase())) : true)
                        .filter(r => r.isMenu && r.middlewares?.includes('auth'))
                        .map((r, i) => generateTooltipRoute(r, i))
                }
            </nav>
        </aside>
    )
}


export const VerticalFullSideBar: React.FC<{ type?: string }> = ({ type }) => {
    const { user } = useAuth();
    const generateNavLink = (route: RouteType, index?: number) => {
        const RouteIcon = route.icon;
        return route.isMenu && (
            <NavLink
                key={index}
                to={getRoutePath(route)}
                className={({ isActive }) => `flex items-center gap-4 px-2.5 ${isActive ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground`}
            >
                {RouteIcon && <RouteIcon className="size-5" />}
                {route.label}
            </NavLink>
        )
    }
    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <Menu className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <DialogTitle className="invisible"></DialogTitle>
                <SheetContent side="left" className="sm:max-w-xs">
                    {type === 'public' ? (
                        <nav className="grid gap-6 text-lg font-medium">
                            <Link to={'/'} className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:text-base">
                                <img src={logo} className={`w-[62px] aspect-square object-contain dark:invert`} />
                            </Link>
                            {routes.filter(r => r.isMenu && (r.middlewares?.includes('public') || r.middlewares?.includes('guest'))).map((route: RouteType, index: number) => generateNavLink(route, index))}
                        </nav>
                    ) : (
                        <div className="flex flex-col h-full justify-between">
                            <nav className="grid gap-6 text-lg font-medium">
                                <Link to={'/'}
                                    className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full text-lg font-semibold text-primary-foreground md:text-base"
                                >
                                    <img src={logo} className={`w-[62px] aspect-square object-contain dark:invert`} />
                                </Link>
                                {
                                    routes.filter(r => r.users ? (user?.role.type && r.users.includes(user?.role.type.toLowerCase())) : true)
                                        .filter(r => r.isMenu && r.middlewares?.includes('auth'))
                                        .map((r, i) => generateNavLink(r, i))
                                }

                            </nav>
                        </div>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    )
}

export const HorizontalNavigation: React.FC<{ type?: string }> = ({ type }) => {
    const { user } = useAuth();
    return (type === 'public' || type === 'guest') ? (
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link to={'/'} className="w-12 overflow-hidden">
                <img src={logo} className={`w-full aspect-square object-contain dark:invert`} alt={type} />
            </Link>
            {routes.filter(r => r.isMenu && (r.middlewares?.includes('public') || r.middlewares?.includes('guest'))).map((route, index) => (
                <NavLink
                    key={index}
                    to={route.path}
                    className={({ isActive }) => `${isActive ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground whitespace-nowrap`}
                >
                    {route.label}
                </NavLink>
            ))}
        </nav>
    ) : (
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link to={'/'} className="w-12 overflow-hidden">
                <img src={logo} className={`w-full aspect-square object-contain dark:invert`} alt={type} />
            </Link>
            {routes
            .filter(r => r.users ? (user?.role.type && r.users.includes(user?.role.type.toLowerCase())) : true)
            .filter(r => r.isMenu && r.middlewares?.includes('auth')).map((route, index) => (
                <NavLink
                    key={index}
                    to={getRoutePath(route)}
                    className={({ isActive }) => `${isActive ? 'text-foreground' : 'text-muted-foreground'} transition-colors hover:text-foreground whitespace-nowrap`}
                >
                    {route.label}
                </NavLink>
            ))}
        </nav>
    );
}