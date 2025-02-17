import { UserType } from "./user";


export const FC_ROLES = [
    'ADMIN',
    'CLIENT',
    'VENDOR',
    'TRAINER',
    'STAFF',
    'MEMBER',
    'GUEST',
] as const

export type GymServiceType = {
    id: number;
    name: string;
    type: 'facility' | 'service';
    description: string;
    gst_type: 'hsn' | 'sac';
    hsn_sac_code?: string;
    gst_percentage?: number;
    pivot?:any;
}

export type PackagePlanType = {
    id: number;
    fitness_center_id: number;
    package_name: string;
    duration: number;
    package_price: number;
    services: string;
    is_free_trial: boolean;
    gst_number: string | null;
    gst_tax: number | null;
    description: string | null;
    terms_and_conditions: string | null;
    services_array: GymServiceType[];
    fitness_center?: FitnessCenterType;
}

export type GymBillingType = {
    id: number;
    fitness_center_id: number;
    name: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
    account_holder_name: string;
    account_number: string;
    ifsc_code: string;
    bank_name?: string;
    branch_name?: string;
    upi_id?: string;
    qr_code?: string;
    company_type?: string;
    gst_number?: string;
    pan_number?: string;
    tan_number?: string;
    cin_number?: string;
    fitnessCenter?: FitnessCenterType;
}

export type GymContactType = {
    id: number;
    designation: string;
    fitness_center_id: number;
    name: string;
    email: string;
    phone: string;
    whatsapp?: string;
    landline?: string;
    image?: string;
    fitnessCenter: FitnessCenterType;
}
export type FitnessCenterUserType = {
    id: number;
    fitness_center_id: number;
    user_id: number;
    status: string;
    role: string;
    created_by: number;
    updated_by: number;
    fitness_center: FitnessCenterType;
    user: UserType;
}

export type FitnessCenterType = {
    id: number;
    user_id: number;
    parent_id: number;
    name: string;
    tagline: string;
    description?: string;
    logo: string;
    cover?: string;
    banner?: string;
    capacity_per_session: number;
    capacity_per_day: number;
    language: string;
    currency: string;
    address_line_1: string;
    address_line_2: string;
    city: string;
    state: string;
    country: string;
    pincode: string;

    users?: FitnessCenterUserType;
    gym_billing?: GymBillingType;
    gym_contacts?: GymContactType[];
    parent?: FitnessCenterType;
    gym_services?: GymServiceType[];
}
