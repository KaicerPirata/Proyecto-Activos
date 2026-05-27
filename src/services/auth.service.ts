/**
 * @deprecated
 * Este servicio será eliminado. Usar users.service + API
 */

import { AuthResponse, AuthUser } from '../types/auth.types';

// Temporal Mock

// const users: Record<string, AuthUser & {password: string}> = {
//     '1193228979': {
//         userId: 1193228979,
//         password: 'wpq12345',
//         name: 'Whashintong Palma',
//         rol: 'ADM',
//         email: 'fminformaticaytecnologia@gmail.com',
//     }
// };

export async function login(userId: number, password: String): Promise<AuthResponse> {
    await new Promise((res) => setTimeout(res, 1000));

    const user = users[userId];

    if(!user || user.password !== password) {
        throw new Error ('Credenciales Invalidas');
    }

    const {password: _, ...safeUser } = user;

    return {
        token: 'mock-jwt-token',
        user: safeUser,
    };
}