
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from '@/components/ui/dialog';
import { PlusCircle, X } from 'lucide-react';
import DashboardLayout from '@/components/dashboard-layout';
import Header from '@/components/dashboard/header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
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
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

// Mock data for assets
const assets = [
  {
    id: 'LAP-001',
    name: 'Laptop Dell XPS 15',
    category: 'Computadores',
    status: 'Asignado',
    company: 'Soluciones Tech SAS',
  },
  {
    id: 'MON-002',
    name: 'Monitor LG UltraWide 29"',
    category: 'Monitores',
    status: 'En Almacén',
    company: 'Innovatec Colombia',
  },
  {
    id: 'SFT-003',
    name: 'Licencia Adobe Creative Cloud',
    category: 'Software',
    status: 'Asignado',
    company: 'Soluciones Tech SAS',
  },
];

const assetSchema = z.object({
  name: z.string().min(1, 'El nombre es requerido.'),
  category: z.string().min(1, 'La categoría es requerida.'),
  description: z.string().optional(),
});

type AssetSchema = z.infer<typeof assetSchema>;

function AssetForm({ onRegisterSuccess }: { onRegisterSuccess?: () => void }) {
  const { toast } = useToast();

  const form = useForm<AssetSchema>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: '',
      category: '',
      description: '',
    },
  });

  function onSubmit(data: AssetSchema) {
    try {
      console.log('Asset data submitted:', data);
      toast({
        title: 'Registro Exitoso',
        description: 'El activo ha sido registrado correctamente.',
      });
      form.reset();
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (error) {
      console.error('Error during registration:', error);
      toast({
        variant: 'destructive',
        title: 'Error de Registro',
        description: 'No se pudo registrar el activo. Inténtalo de nuevo.',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 px-6 pb-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del Activo</FormLabel>
              <FormControl>
                <Input placeholder="Laptop Dell XPS 15" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoría</FormLabel>
              <FormControl>
                <Input placeholder="Computadores" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción (Opcional)</FormLabel>
              <FormControl>
                <Textarea placeholder="Número de serie, modelo, especificaciones..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          Registrar Activo
        </Button>
      </form>
    </Form>
  );
}

export default function ActivosPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[800px]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-headline tracking-tight">Activos</h1>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuevo Activo
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-md rounded-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-headline text-center pt-12">Registrar nuevo activo</DialogTitle>
                  <DialogDescription className="text-center">
                    Introduce los datos para registrar un nuevo activo en el sistema.
                  </DialogDescription>
                </DialogHeader>
                <AssetForm onRegisterSuccess={() => setIsDialogOpen(false)} />
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Listado de Activos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID Activo</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Categoría</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {assets.map((asset) => (
                      <TableRow key={asset.id}>
                        <TableCell className="font-medium">{asset.id}</TableCell>
                        <TableCell>{asset.name}</TableCell>
                        <TableCell>{asset.category}</TableCell>
                        <TableCell>{asset.company}</TableCell>
                        <TableCell>
                          <Badge variant={asset.status === 'Asignado' ? 'default' : 'secondary'}>
                            {asset.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button variant="outline" size="sm">
                            Ver Detalles
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </DashboardLayout>
  );
}

