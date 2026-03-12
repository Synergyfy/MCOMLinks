import { API_BASE_URL } from './constants';

export async function apiRequest<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<T> {
    const token = localStorage.getItem('access_token');

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        if (response.status === 401) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        const error = await response.json().catch(() => ({ message: 'An unknown error occurred' }));
        throw new Error(error.message || 'API request failed');
    }

    const text = await response.text();
    if (!text) return {} as T;
    return JSON.parse(text);
}

export const api = {
    get: <T>(endpoint: string, options?: RequestInit) =>
        apiRequest<T>(endpoint, { ...options, method: 'GET' }),

    post: <T>(endpoint: string, body: any, options?: RequestInit) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body)
        }),

    put: <T>(endpoint: string, body: any, options?: RequestInit) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body)
        }),

    patch: <T>(endpoint: string, body: any, options?: RequestInit) =>
        apiRequest<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body)
        }),

    delete: <T>(endpoint: string, options?: RequestInit) =>
        apiRequest<T>(endpoint, { ...options, method: 'DELETE' }),
};
