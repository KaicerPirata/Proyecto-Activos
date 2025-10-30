
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { CalendarIcon, Search, Download, X } from 'lucide-react';
import { format } from 'date-fns';
import DashboardLayout from '@/components/dashboard-layout';
import Header from '@/components/dashboard/header';
import { Separator } from '@/components/ui/separator';

const users = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Robert Brown' },
    { id: '4', name: 'Almacén' },
];

const reportFiltersSchema = z.object({
  responsable: z.string().optional(),
  assetCategory: z.string().optional(),
  brand: z.string().optional(),
  model: z.string().optional(),
  processor: z.string().optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  os: z.string().optional(),
  officeVersion: z.string().optional(),
  dateFrom: z.date().optional(),
  dateTo: z.date().optional(),
});

type ReportFiltersSchema = z.infer<typeof reportFiltersSchema>;

export default function ReportsPage() {
  const form = useForm<ReportFiltersSchema>({
    resolver: zodResolver(reportFiltersSchema),
    defaultValues: {
        responsable: '',
        assetCategory: '',
        brand: '',
        model: '',
        processor: '',
        ram: '',
        storage: '',
        os: '',
        officeVersion: '',
    },
  });

  function onSubmit(data: ReportFiltersSchema) {
    console.log('Generating report with filters:', data);
    // Here you would typically trigger the report generation
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[800px]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-headline tracking-tight">Reportes</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Generador de Reportes de Activos</CardTitle>
              <CardDescription>
                Utiliza los filtros para generar un reporte personalizado de los activos.
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="responsable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Responsable</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Todos" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              
                              {users.map(user => (
                                <SelectItem key={user.id} value={user.name}>{user.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="assetCategory"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoría de Activo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Todas" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              
                              <SelectItem value="equipo-de-computo">Equipo de Cómputo</SelectItem>
                              <SelectItem value="monitor">Monitor</SelectItem>
                              <SelectItem value="ups">UPS</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Marca</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Dell, HP, APC..." {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="model"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modelo</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Latitude 5420" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="dateFrom"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pt-2">
                          <FormLabel>Fecha de Compra (Desde)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? format(field.value, 'PPP') : <span>Selecciona fecha</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dateTo"
                      render={({ field }) => (
                        <FormItem className="flex flex-col pt-2">
                          <FormLabel>Fecha de Compra (Hasta)</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={'outline'}
                                  className={cn(
                                    'w-full pl-3 text-left font-normal',
                                    !field.value && 'text-muted-foreground'
                                  )}
                                >
                                  {field.value ? format(field.value, 'PPP') : <span>Selecciona fecha</span>}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Separator />
                  <h3 className="text-lg font-medium text-foreground">Filtros para Equipos de Cómputo</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                     <FormField
                      control={form.control}
                      name="processor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Procesador</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: Intel Core i5" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Memoria RAM</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: 16 GB" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="storage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Almacenamiento</FormLabel>
                          <FormControl>
                            <Input placeholder="Ej: 512 GB SSD" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="os"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sistema Operativo</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Todos" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              
                              <SelectItem value="Windows 10 Pro">Windows 10 Pro</SelectItem>
                              <SelectItem value="Windows 11 Pro">Windows 11 Pro</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="officeVersion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Versión de Office</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Todas" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                
                                <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2007">Office 2007</SelectItem>
                                <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2010">Office 2010</SelectItem>
                                <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2013">Office 2013</SelectItem>
                                <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2016">Office 2016</SelectItem>
                                <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2019">Office 2019</SelectItem>
                                <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2021">Office 2021</SelectItem>
                                <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2024 - ES-ES">Office 2024</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                   </div>
                </CardContent>
                <CardFooter className="flex justify-end gap-2 border-t pt-6">
                    <Button type="reset" variant="outline" onClick={() => form.reset()}>
                        <X className="mr-2 h-4 w-4" />
                        Limpiar Filtros
                    </Button>
                    <Button type="submit">
                        <Search className="mr-2 h-4 w-4" />
                        Buscar
                    </Button>
                    <Button type="button" variant="secondary">
                        <Download className="mr-2 h-4 w-4" />
                        Exportar
                    </Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </main>
      </div>
    </DashboardLayout>
  );
}
