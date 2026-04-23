export const getToken = () => {
    if (typeof window !== 'undefined') {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; token=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    return null;
}

export const setToken = (token) => {
    if (typeof window !== 'undefined') {
        document.cookie = `token=${token}; max-age=86400; path=/`;
    }
}

export const removeToken = () => {
    if (typeof window !== 'undefined') {
        document.cookie = `token=; max-age=0; path=/`;
    }
}
