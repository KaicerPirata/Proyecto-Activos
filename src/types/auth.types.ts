export type Role = 'ADM' | 'TEC' | 'PER';

export interface AuthUser {
    userId: number,
    name: string,
    email: string,
    rol: Role
}

export interface logUser {
    cedula: number | '',
    password: string
}

export interface AuthResponse {
    token: string;
    user: AuthUser;
}