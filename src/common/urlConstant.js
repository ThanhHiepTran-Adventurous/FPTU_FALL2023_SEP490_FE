const SERVICE_URL = import.meta.env.VITE_SERVER_URL;

export default {
    base: SERVICE_URL,
    endpoint: {
        auth: {
            login: '/public/auth/login',
            logout: '/auth/logout',
            refreshToken: '/auth/access-tokens/refresh',
        },
    }
}