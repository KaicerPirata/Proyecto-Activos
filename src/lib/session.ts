import { AuthResponse } from "@/types/auth.types";

const STORAGE_KEY = 'itam_session';
const COOKIE_KEY = 'itam_auth';

export function saveSession(data: AuthResponse) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    localStorage.setItem('accessToken', data.token);

    const cookiePayload = {
        authenticated: true,
        rol: data.user.rol,
    };

    document.cookie = `${COOKIE_KEY}=${encodeURIComponent(JSON.stringify(cookiePayload))}; path=/`
}

export function clearSession() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('accessToken');
    
    document.cookie = `${COOKIE_KEY}=; Max-Age=0; path=/`;
}

export function getSession(): AuthResponse | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
}

export function getAuthToken(): string | null {
    if(typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
}

export function isAuthenticated(): boolean {
    const session = getSession();
    return !!session?.token;
}


export function getCurrentUser() {
    return getSession()?.user ?? null;
}