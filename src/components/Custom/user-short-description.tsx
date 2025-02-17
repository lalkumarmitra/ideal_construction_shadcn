import { AssetUrl } from "@/lib/helpers/api_helper";
import { UserType } from "@/types/user";
import React from "react";

interface UserDescriptionWithAvatarProps {
    user?:UserType,
}

export const UserDescriptionWithAvatar: React.FC<UserDescriptionWithAvatarProps> = ({user}) => {
    return user && (
        <div className="flex gap-3 items-center cursor-pointer">
            <img src={AssetUrl + user.avatar}  className="w-11 aspect-square object-cover rounded-full" />
            <div className="grid gap-1">
                <h1 className="capitalize text-base font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email} | {user.phone}</p>
            </div>
        </div>
    );
}
