import { useAuth } from '@/Auth/AuthProvider';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import React from 'react'


const AvatarMenu: React.FC = () => {
    const AssetUrl = import.meta.env.VITE_MAIN_ASSET_URL;
    const { user, handleLogout } = useAuth();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={AssetUrl + user?.avatar} alt="Avatar" />
                    <AvatarFallback>{user?.name[0]}</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>{user?.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Support</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='cursor-pointer' onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default AvatarMenu