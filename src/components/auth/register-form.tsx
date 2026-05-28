
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
import { Company } from "@/types/company.types";
import { City } from "@/types/city.type";
import { Location } from "@/types/location.type";
import { Area } from "@/types/area.type";
import { useEffect, useState } from "react";
import { citiesService } from "@/services/cities.service";
import { areasService } from "@/services/areas.service";
import { locationService } from "@/services/locations.service";
import { useCompanies } from "@/hooks/useCompanies";
import { useAreas } from "@/hooks/useAreas";
import { useCities } from "@/hooks/useCities";
// import { watch } from "fs";

// Mock onRegister function
const onRegister = (data: RegisterSchema) => {
  console.log("Registration data submitted:", data);
  // Here you would connect to your database connector (e.g., Firebase, Supabase, PostgreSQL)
};

interface RegisterFormProps {
    onRegisterSuccess?: () => void;
    userToEdit?: Partial<RegisterSchema>;
}

export default function RegisterForm({ onRegisterSuccess, userToEdit }: RegisterFormProps) {

  const { companies, companiesLoading } = useCompanies();
  const { areas, areasLoading } = useAreas();
  const { cities, citiesLoading} = useCities();
//   const [cities, setCities] = useState<City[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const { toast } = useToast();
  const isEditMode = !!userToEdit;

  // If in edit mode, we don't need to validate the password
  const finalSchema = isEditMode ? registerSchema.omit({ password: true }) : registerSchema;

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(finalSchema),
    defaultValues: userToEdit || {
      cedula: undefined,
      rolId: undefined,
      firstname: "",
      middlename: "",
      lastname: "",
      secondLastname: "",
      email: "",
      companyId: undefined,
      cityId: undefined,
      locationId: undefined,
      areaId: undefined,
      password: ""
    },
  });

  const selectedCompany = form.watch("companyId");
  const selectedCity = form.watch("cityId");

  function onSubmit(data: RegisterSchema) {
    try {
      if (isEditMode) {
        console.log("User data updated:", data);
         toast({
          title: "Actualización Exitosa",
          description: "El usuario ha sido actualizado correctamente.",
        });
      } else {
        onRegister(data);
        toast({
          title: "Registro Exitoso",
          description: "El usuario ha sido registrado correctamente.",
        });
      }
      form.reset();
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error) {
       console.error("Error during operation:", error);
       toast({
        variant: "destructive",
        title: `Error de ${isEditMode ? 'Actualización' : 'Registro'}`,
        description: `No se pudo ${isEditMode ? 'actualizar' : 'registrar'} el usuario. Inténtalo de nuevo.`,
      });
    }
  }

  // Fetch locations of the selected company and city
  useEffect(() => {
    const fetchLocations = async () => {
        if(!selectedCompany || !selectedCity) {
            setLocations([]);
            form.setValue("locationId", undefined);
            return;
        }
        
        try{
            const response = await locationService.list(selectedCompany, selectedCity);

            setLocations(response.data);
            form.setValue("locationId", undefined); // reset cuando cambia el filtro 
        } catch (e) {
            console.log(e);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudieron cargar las ubicaciones'
            });
        }
    };

    fetchLocations();

    }, [selectedCompany, selectedCity])

  // Fetch cities to select
//   useEffect(() => {
//     const fetchCities = async () => {
//         try {
//             const response = await citiesService.list();
//             setCities(response.data);
//         } catch (e) {
//             console.error(e);
//             toast({
//                 variant: 'destructive',
//                 title: 'Error',
//                 description: 'No se pudieron cargar las ciudades'
//             });
//         }
//     };

//     fetchCities();
//   }, []);

  // Fetch areas to select
//   useEffect(() => {
//     const fetchAreas = async () => {
//         try {
//             const response = await areasService.list();
//             setAreas(response.data);
//         } catch (e) {
//             console.error(e);
//             toast({
//                 variant: 'destructive',
//                 title: 'Error',
//                 description: 'No se pudieron cargar las empresas'
//             });
//         }
//     };

//     fetchAreas();
//   }, []);
  

  useEffect(() => {
    if(userToEdit) {
        form.reset(userToEdit);
    }
  }, [userToEdit, form])

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
                control={form.control}
                name="companyId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Empresa a la que pertenece</FormLabel>
                    <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(Number(value))}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una empresa" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {companies.map(company => (
                                <SelectItem key = {company.companyId.toString()} value={company.companyId.toString()}>{company.company}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
             <FormField
                control={form.control}
                name="rolId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Rol</FormLabel>
                    <Select value= {field.value} onValueChange={field.onChange}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un rol" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            <SelectItem value="ADM">Admin</SelectItem>
                            <SelectItem value="TEC">Técnico</SelectItem>
                            <SelectItem value="PER">Estándar</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="cedula"
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
            name="firstname"
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
            name="middlename"
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
                name="lastname"
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
                name="secondLastname"
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
                name="cityId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Ciudad</FormLabel>
                    <Select value={field.value} onValueChange={(value) => field.onChange(value)}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una ciudad" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {cities.map(city => (
                                <SelectItem key = {city.cityId} value={city.cityId}>{city.city}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="locationId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Ubicación</FormLabel>
                    <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(Number(value))}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una ubicacion" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {locations.map(location => (
                                <SelectItem key = {location.locationId} value={location.locationId.toString()}>{location.locationName}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="areaId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Area o departamento</FormLabel>
                    <Select value={field.value?.toString()} onValueChange={(value) => field.onChange(Number(value))}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un area" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                            {areas.map(area => (
                                <SelectItem key = {area.areaId} value={area.areaId.toString()}>{area.area}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
            />
            {!isEditMode && (
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
            )}
        </div>
        <div className="md:col-span-2 pt-4">
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                {isEditMode ? 'Guardar Cambios' : 'Registrar'}
            </Button>
        </div>
      </form>
    </Form>
  );
}
