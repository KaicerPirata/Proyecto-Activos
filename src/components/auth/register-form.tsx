
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { RegisterSchema } from "@/lib/schemas";
import { registerSchema } from "@/lib/schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "../ui/separator";

// Mock onRegister function
const onRegister = (data: RegisterSchema) => {
  console.log("Registration data submitted:", data);
  // Here you would connect to Firebase, Supabase, PostgreSQL, etc.
};

interface RegisterFormProps {
    onRegisterSuccess?: () => void;
    companies: { id: number; name: string }[];
}

export default function RegisterForm({ onRegisterSuccess, companies }: RegisterFormProps) {
  const { toast } = useToast();

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      company: "",
      idNumber: "",
      firstName: "",
      middleName: "",
      lastName: "",
      secondLastName: "",
      city: "",
      location: "",
      department: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: RegisterSchema) {
    try {
      onRegister(data);
      toast({
        title: "Registro Exitoso",
        description: "El usuario ha sido registrado correctamente.",
      });
      form.reset();
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error) {
       console.error("Error during registration:", error);
       toast({
        variant: "destructive",
        title: "Error de Registro",
        description: "No se pudo registrar el usuario. Inténtalo de nuevo.",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">
        <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Empresa a la que pertenece</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Selecciona una empresa" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        {companies.map(company => (
                            <SelectItem key={company.id} value={company.name}>{company.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
        />

        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="idNumber"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Número de identificación</FormLabel>
                <FormControl>
                    <Input placeholder="123456789" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Correo electrónico</FormLabel>
                <FormControl>
                    <Input placeholder="nombre@empresa.com" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Primer nombre</FormLabel>
                <FormControl>
                    <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Segundo nombre (Opcional)</FormLabel>
                <FormControl>
                    <Input placeholder="Fitzgerald" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Primer apellido</FormLabel>
                    <FormControl>
                    <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="secondLastName"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Segundo apellido (Opcional)</FormLabel>
                    <FormControl>
                    <Input placeholder="Smith" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <FormControl>
                    <Input placeholder="Bogotá" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <FormControl>
                    <Input placeholder="Cra 1 # 1-1, Zona Centro" {...field} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="department"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                    <FormLabel>Área o departamento</FormLabel>
                    <FormControl>
                        <Input placeholder="Tecnología" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem className="md:col-span-2">
                <FormLabel>Contraseña</FormLabel>
                <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
        <div className="md:col-span-2">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
            Registrar
            </Button>
        </div>
      </form>
    </Form>
  );
}
