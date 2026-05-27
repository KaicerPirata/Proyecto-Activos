import { getAuthToken, clearSession } from '@/lib/session';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://192.168.1.11:8000/api';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface RequestOptions {
    method?: HttpMethod,
    body?: any,
    headers?: Record<string, string>,
    params?: Record<string, string | number | undefined>
}

export async function apiFetch<T>(
    endpoint: string,
    options: RequestOptions = {}
): Promise<T> {
    const token = getAuthToken();
    // console.log(token);

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'accept': 'application/json'
    };

    if(options.headers) {
        Object.assign(headers, options.headers);
    }

    if(token) {
        headers.Authorization = `Bearer ${token}`;
    }

    let url = `${API_URL}${endpoint}`;

    if (options.params) {
        const query = new URLSearchParams();

        Object.entries(options.params).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                query.append(key, String(value));
            }
        });

        url += `?${query.toString()}`
    }

    const response = await fetch(url, {
        method: options.method ??  'GET',
        headers,
        body: options.body ? JSON.stringify(options.body): undefined
    });

    if(response.status === 401) {
        if(typeof window !== 'undefined') {
            clearSession();

            window.location.href = '/login';
        }
        throw new Error('UNAUTHORIZED');
    }

    if(!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(errorBody?.message ?? 'API_ERROR');
    }

    return response.json() as Promise<T>;
}

export const api = {
    get: <T>(url: string, params?: RequestOptions["params"]) => apiFetch<T>(url, { params }),
    post: <T>(url: string, body?: any) => apiFetch<T>(url, {method: 'POST', body}),
    put: <T>(url: string, body?: any) => apiFetch<T>(url, {method: 'PUT', body}),
    patch: <T>(url: string, body?: any) => apiFetch<T>(url, {method: 'PATCH', body}),
    delete: <T>(url: string, body?:any) => apiFetch<T>(url, {method: 'DELETE', body}),
};