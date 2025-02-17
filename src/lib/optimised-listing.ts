
export const optimisedListingApiCall = async (apiFunction: () => Promise<any>, cacheDescription:{
    cacheKey: string, 
    expiration?: number,
    cachename?:string
}) => {
    if (typeof caches === 'undefined') {
        console.warn('Cache API is not available. Falling back to API call.');
        try {
            return  await apiFunction();
        } catch (error:any) {
            throw new Error(error.response?error.response.data.message:error.message || 'somethng went wrong');
        }
    }
    const CACHE_NAME = cacheDescription.cachename ?? 'apiCacheListing'; 
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(cacheDescription.cacheKey);
    const expiration = cacheDescription?.expiration || (5 * 60 * 100);
    if (cachedResponse) {
        const cachedData = await cachedResponse.json();
        const cachedTimestamp = cachedResponse.headers.get('x-cache-timestamp');
        if (cachedTimestamp && Date.now() - parseInt(cachedTimestamp) < expiration) {
            console.log('Using cached response');
            return cachedData;
        } else await cache.delete(cacheDescription.cacheKey);
    }
    try {
        const res = await apiFunction();
        const clonedResponse = new Response(JSON.stringify(res), {
            headers: { 'x-cache-timestamp': Date.now().toString() },
        });
        await cache.put(cacheDescription.cacheKey, clonedResponse);
        return res;
    } catch (error:any) {
        throw new Error(error.response?error.response.data.message:error.message || 'somethng went wrong');
    }
};
