
import axios from "axios";
import Cookies from "js-cookie";

export const AssetUrl = import.meta.env.VITE_MAIN_ASSET_URL;
const axiosApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});
const setToken = () => {
    const token = Cookies.get('_token');
    axiosApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

axiosApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // if (error?.response?.status === 401) window.location.href = '/login';
        return Promise.reject(error)
    }
);


export async function get(url: string, config = {}) {
    setToken();
    return await axiosApi
        .get(url, { ...config })
        .then((response) => response.data);
}

export async function post(url: string, data: any, config = {}) {
    setToken();
    return axiosApi
        .post(url, data, { ...config })
        .then((response) => response.data);
}

export async function put(url: string, data: any, config = {}) {
    setToken();
    return axiosApi
        .put(url, { ...data }, { ...config })
        .then((response) => response.data);
}

export async function del(url: string, config = {}) {
    setToken();
    return await axiosApi
        .delete(url, { ...config })
        .then((response) => response.data);
}

// export async function countries(url:any, config = {}) {
//   setToken();
//   return await axiosInstance
//     .get(url, { ...config })
//     .then((response) => response.data);
// }
