import Cookies from "js-cookie";

export const removeAuthToken = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    Cookies.remove('_token', {
        domain: isProduction ? '.fittestwarrior.com' : undefined,
        path: '/',
    });
};