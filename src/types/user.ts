export type RoleType = {
    id: number;
    name: string;
    type: string;
    priority: number;
}
export type UserType = {
    id: number;
    name: string;
    gender: string;
    dob: string;
    email: string;
    phone: string;
    password: string;
    avatar: string;
    role_id: number;
    role: RoleType;
    is_active: boolean;
    is_blocked: boolean;
}
