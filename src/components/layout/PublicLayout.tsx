import React from "react"
import { ThemeToggler } from "./LayoutComponents/ThemeToggler"
import AvatarMenu from "./LayoutComponents/AvatarMenu"
import { HorizontalNavigation, VerticalFullSideBar } from "./LayoutComponents/NavigationMenus"
import { useAuth } from "@/Auth/AuthProvider"
type PublicLayoutProps = {
    children: React.ReactNode;
};
export const PublicLayout = ({ children }: PublicLayoutProps) => {
    const { authToken } = useAuth();
    const currentDate = new Date();
    return (
        <div className="flex min-h-screen w-full flex-col">
            <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background z-10 px-4 md:px-6">
                <HorizontalNavigation type={authToken ? '':'public'} />
                <VerticalFullSideBar type={authToken ? '':'public'} />
                <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
                    <div className="ml-auto flex-1 sm:flex-initial"></div>
                    <ThemeToggler />
                    {authToken ? (<AvatarMenu />) : null}
                </div>
            </header>
            <main className="flex flex-1 flex-col gap-4 bg-muted/40 md:gap-8">
                {children}
            </main>
            <footer className="h-12 border-t flex items-center z-20 bg-background">
                <p className="text-sm text-center w-full">© {currentDate.getFullYear()} Ideal Construction. All rights reserved.</p>
            </footer>
        </div>
    )
}
