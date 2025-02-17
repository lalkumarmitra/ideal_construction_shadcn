import { useAuth } from '@/Auth/AuthProvider'
import { RouteType } from '@/types/route'
import React from 'react'
import { NavLink } from 'react-router-dom'

export const SettingSideLinks: React.FC = () => {
    return (
        <div className='grid gap-4 lg:col-span-1 ps-4'>
            <div className="grid gap-2">
                <h1 className="text-3xl font-semibold">Settings</h1>
            </div>

            <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0" >
                <NavLink to={'/settings'} className={({ isActive }) => isActive ? `font-semibold text-primary` : ``} end> General </NavLink>
                <NavLink to={'/settings/events-category'} className={({ isActive }) => isActive ? `font-semibold text-primary` : ``} end >Category</NavLink>
                {/* <NavLink to={'/settings/security'} className={({ isActive }) => isActive ? `font-semibold text-primary` : ``} end >Security</NavLink>
                <NavLink to={'/settings/authors'} className={({ isActive }) => isActive ? `font-semibold text-primary` : ``} end >Authors</NavLink>
                <NavLink to={'/settings/support'} className={({ isActive }) => isActive ? `font-semibold text-primary` : ``} end >Support</NavLink>
                <NavLink to={'/settings/advance'} className={({ isActive }) => isActive ? `font-semibold text-primary` : ``} end >Advanced</NavLink> */}
            </nav>
        </div>
    )
}

export default SettingSideLinks

export const SideLinkMenu: React.FC<{ children: RouteType[], heading: string }> = ({ children, heading }) => {
    const { user } = useAuth();
    return <div className='grid gap-4 lg:col-span-1 ps-4'>
        <div className="grid gap-2">
            <h1 className="text-3xl font-semibold">{heading}</h1>
        </div>
        {children && (
            <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0" >
                {children.map((child, index) => {
                    if(child.users?.length){
                        if(user?.role.type)
                        if(!child.users?.includes(user?.role.type.toLowerCase()))
                            return
                    }
                   return <NavLink key={index} to={child.path} className={({ isActive }) => isActive ? `font-semibold text-primary` : ``} end> {child.label} </NavLink>
                } )}
            </nav>
        )}
    </div>
}