import { del, get, post } from "./api_helper";


export const auth = {
    validate: () => get('/validate'),
    logout: () => get("/logout"),
    login:(data:FormData) => post('/login',data),
}

export const role_apis = {
    create:(formData:FormData)=>post('/new-role',formData),
    update: (data:FormData,id:string|number)=>post(`/update-role/${id}`,data),
    list: ()=>get(`/roles`),
    select: (id:string|number)=>get(`/roles/${id}`),
    trash: (id:string|number)=> del(`/role/${id}`)
}

export const product_apis = {
    create:(formData:FormData)=>post('/new-product',formData),
    update: (data:FormData,id:string|number)=>post(`/update-product/${id}`,data),
    list: (page:string|number,offset:string|number)=>get(`/products/${page}/${offset}`),
    select:(id:string|number)=>get(`/product-details/${id}`),
    trash: (id:string|number)=> del(`/product/${id}`)
}

export const client_apis = {
    create:(formData:FormData)=>post('/new-client',formData),
    update: (data:FormData,id:string|number)=>post(`/update-client/${id}`,data),
    list: (page:string|number,offset:string|number)=>get(`/clients/${page}/${offset}`),
    select:(id:string|number)=>get(`/client-details/${id}`),
    trash: (id:string|number)=> del(`/client/${id}`)
}

export const vehicle_apis = {
    create:(formData:FormData)=>post('/new-vehicle',formData),
    update: (data:FormData,id:string|number)=>post(`/update-vehicle/${id}`,data),
    list: (page:string|number,offset:string|number)=>get(`/vehicles/${page}/${offset}`),
    listAll: () => get(`/all-vehicles`),
    select:(id:string|number)=>get(`/vehicle-details/${id}`),
    trash: (id:string|number)=> del(`/vehicle/${id}`)
}

export const user_apis = {
    create:(data:FormData)=>post(`/new-user`,data),
    update:(data:FormData,id:string|number)=>post(`/update-user/${id}`,data),
    list:(page:string|number,offset:string|number)=>get(`/users/${page}/${offset}`),
    select:(id:string|number)=>get(`/user-details/${id}`),
    trash:(id:string|number)=>del(`/user/${id}`),
    toggleStatus:(id:string|number)=>get(`/toggle-user-status/${id}`),
    toggleBlockStatus:(id:string|number)=>get(`/toggle-user-block-status/${id}`),
    changePhone:(id:string|number,phone:string)=>get(`/update-user-phone/${id}/${phone}`),
    changeEmail:(id:string|number,email:string)=>get(`/update-user-email/${id}/${email}`),
    changePassword:(data:FormData)=>post(`/update-user-password`,data),
}

export const transaction_apis = {
    create:(formData:FormData)=>post('/new-transaction',formData),
    update: (data:FormData,id:string|number)=>post(`/update-transaction/${id}`,data),
    list: (page:string|number,offset:string|number)=>get(`/transactions/${page}/${offset}`),
    select:(id:string|number)=>get(`/transaction-details/${id}`),
    trash: (id:string|number)=> del(`/transaction/${id}`),
    search: (data:FormData | null ,page:string|number,offset:string|number)=>post(`/search-transactions/${page}/${offset}`,data),
    export: (data:FormData | null)=>post('/export-transactions',data,{responseType: "blob"})
}



