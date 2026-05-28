
import { z } from 'zod';

export const registerSchema = z.object({
    cedula: z.coerce.number({required_error: "la cedula es requerida"}),
    rolId: z.string().min(3, { message: 'El rol es requerido.' }),
    companyId: z.coerce.number({required_error: "La empresa es requerida"}),
    userId: z.coerce.number({required_error: "La identificacion del usuario es requerida"}),
    firstname: z.string().min(1, { message: "El primer nombre es requerido." }).max(50, { message: "El nombre no puede superar los 50 caracteres"}),
    middlename: z.string().max(50, { message: "El segundo nombre no puede superar los 50 caracteres" }).optional(),
    lastname: z.string().min(1, { message: "El primer apellido es requerido." }).max(50, { message: "El apellido no puede superar los 50 caracteres" }),
    secondLastname: z.string().max(50, { message: "El segundo apellido no puede superar los 50 caracteres" }).optional(),
    email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
    cityId: z.string({required_error: "La ciudad es requerida."}).max(6, { message: "La ciudad no puede superar los 6 caracteres" }),
    locationId: z.coerce.number({required_error: "La ubicación es requerida."}).optional(),
    areaId: z.coerce.number({required_error: "El area es requerida."}),
    password: z.string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
        .regex(/.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+.*/, { message: "La contraseña debe contener al menos un carácter especial." })
        .optional()
});

export type RegisterSchema = z.infer<typeof registerSchema>;
