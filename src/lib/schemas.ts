import { z } from 'zod';

export const registerSchema = z.object({
    company: z.string().min(1, { message: "La empresa es requerida." }),
    idNumber: z.string().min(1, { message: "El número de identificación es requerido." }),
    firstName: z.string().min(1, { message: "El primer nombre es requerido." }),
    middleName: z.string().optional(),
    lastName: z.string().min(1, { message: "El primer apellido es requerido." }),
    secondLastName: z.string().optional(),
    city: z.string().min(1, { message: "La ciudad es requerida." }),
    location: z.string().min(1, { message: "La ubicación es requerida." }),
    department: z.string().min(1, { message: "El área o departamento es requerido." }),
    email: z.string().email({ message: "Por favor, introduce un correo electrónico válido." }),
    password: z.string()
        .min(8, { message: "La contraseña debe tener al menos 8 caracteres." })
        .regex(/.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+.*/, { message: "La contraseña debe contener al menos un carácter especial." }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;
