
'use client';

import { useState, useMemo } from 'react';
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
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { PlusCircle, X, Pencil, Trash2, Search } from 'lucide-react';
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';


// Mock data for companies
const initialCompanies = [
  {
    id: 1,
    companyId: 'PALLOMARO',
    name: 'PALLOMARO S.A',
    city: 'Cali',
    status: 'Active',
  },
  {
    id: 2,
    companyId: 'HYCO',
    name: 'HYCO',
    city: 'Cali',
    status: 'Active',
  },
  {
    id: 3,
    companyId: 'FUNDIMETAL',
    name: 'FUNDIMETAL',
    city: 'Cali',
    status: 'Active',
  },
];

const companySchema = z.object({
  companyId: z.string().min(1, 'El ID de la empresa es requerido.'),
  name: z.string().min(1, 'El nombre es requerido.'),
  city: z.string().min(1, 'La ciudad es requerida.'),
});

type CompanySchema = z.infer<typeof companySchema>;

function CompanyForm({ onSaveSuccess, companyToEdit }: { onSaveSuccess?: () => void, companyToEdit?: CompanySchema | null }) {
  const { toast } = useToast();
  const isEditMode = !!companyToEdit;

  const form = useForm<CompanySchema>({
    resolver: zodResolver(companySchema),
    defaultValues: companyToEdit || {
      companyId: '',
      name: '',
      city: '',
    },
  });

  function onSubmit(data: CompanySchema) {
    try {
      if(isEditMode) {
        console.log('Company data updated:', data);
        toast({
          title: 'Actualización Exitosa',
          description: 'La empresa ha sido actualizada correctamente.',
        });
      } else {
        console.log('Company data submitted:', data);
        toast({
          title: 'Registro Exitoso',
          description: 'La empresa ha sido registrada correctamente.',
        });
      }
      form.reset();
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (error) {
      console.error('Error during operation:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `No se pudo ${isEditMode ? 'actualizar' : 'registrar'} la empresa. Inténtalo de nuevo.`,
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 px-6 pb-6">
        <FormField
          control={form.control}
          name="companyId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID Empresa</FormLabel>
              <FormControl>
                <Input placeholder="EJ: EMP001" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre / Razón Social</FormLabel>
              <FormControl>
                <Input placeholder="Soluciones Tech SAS" {...field} />
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
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          {isEditMode ? 'Guardar Cambios' : 'Registrar Empresa'}
        </Button>
      </form>
    </Form>
  );
}

export default function EmpresasPage() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const { toast } = useToast();

  const handleEditClick = (company: any) => {
    setCompanyToEdit(company);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (companyId: number) => {
    // In a real app, you'd call an API here
    setCompanies(companies.filter(c => c.id !== companyId));
    toast({
        title: 'Empresa Eliminada',
        description: 'La empresa ha sido eliminada correctamente.',
    });
  }

  const handleSaveSuccess = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setCompanyToEdit(null);
    // Here you would refetch the data from your backend
  };

  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return companies;

    return companies.filter(company =>
      Object.values(company).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, companies]);

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[800px]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-headline tracking-tight">Empresas</h1>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nueva Empresa
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-md rounded-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="text-2xl font-headline text-center">Crear nueva empresa</DialogTitle>
                  <DialogDescription className="text-center">
                    Introduce los datos para registrar una nueva empresa.
                  </DialogDescription>
                </DialogHeader>
                <CompanyForm onSaveSuccess={handleSaveSuccess} />
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardHeader>
                <CardTitle>Listado de Empresas</CardTitle>
                <div className="relative mt-2">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                    type="search"
                    placeholder="Buscar empresa por nombre, ID, ciudad..."
                    className="w-full appearance-none bg-background pl-8 shadow-none md:w-1/3"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>ID Empresa</TableHead>
                      <TableHead>Ciudad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                             <Avatar className="h-9 w-9">
                                <AvatarFallback>{company.name.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <div className="grid gap-0.5">
                                <p className="font-medium">{company.name}</p>
                             </div>
                          </div>
                        </TableCell>
                        <TableCell>{company.companyId}</TableCell>
                        <TableCell>{company.city}</TableCell>
                        <TableCell>
                          <Badge variant={company.status === 'Active' ? 'default' : 'destructive'}>
                            {company.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                           <TooltipProvider>
                                <div className="flex justify-end gap-2">
                                     <Tooltip>
                                        <TooltipTrigger asChild>
                                           <Button variant="outline" size="icon" onClick={() => handleEditClick(company)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Editar Empresa</p>
                                        </TooltipContent>
                                    </Tooltip>

                                    <AlertDialog>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <AlertDialogTrigger asChild>
                                                     <Button variant="destructive" size="icon">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Eliminar Empresa</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción no se puede deshacer. Se eliminará permanentemente la empresa <span className="font-semibold">{company.name}</span>.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteClick(company.id)}>Confirmar</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                           </TooltipProvider>
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
      
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-md rounded-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader className="p-6 pb-0">
                <DialogTitle className="text-2xl font-headline text-center">Editar empresa</DialogTitle>
                <DialogDescription className="text-center">
                    Modifica los datos de la empresa.
                </DialogDescription>
            </DialogHeader>
            <CompanyForm onSaveSuccess={handleSaveSuccess} companyToEdit={companyToEdit} />
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <X className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogClose>
        </DialogContent>
      </Dialog>

    </DashboardLayout>
  );
}
    