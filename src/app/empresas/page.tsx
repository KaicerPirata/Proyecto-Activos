
'use client';

import { useEffect } from 'react';
import { companiesService } from '@/services/companies.service';
import { Company } from '@/types/company.types';
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
import { PlusCircle, X, Pencil, Trash2, Search, Filter } from 'lucide-react';
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const companySchema = z.object({
  company: z.string().min(1, 'El nombre es requerido.'),
});

type CompanySchema = z.infer<typeof companySchema>;

function CompanyForm({ onSaveSuccess, companyToEdit }: { onSaveSuccess?: (company: Company, mode: 'create' | 'edit') => void, companyToEdit?: Company | null }) {
  const { toast } = useToast();
  const isEditMode = !!companyToEdit;

  const form = useForm<CompanySchema>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      company: companyToEdit?.company || '',
    },
  });

  async function onSubmit(data: CompanySchema) {
    try {
      if(isEditMode && companyToEdit) {
        const updatedCompany = {
          ...companyToEdit,
          company: data.company,
        };

        onSaveSuccess?.(updatedCompany, 'edit');
        await companiesService.update(Number(companyToEdit.companyId), {company: data.company});

        toast({
          title: 'Actualizacion exitosa',
          description: 'La empresa ha sido actualizada correctamente.',
        });
      } else {
        const tempCompany: Company = {
          companyId: -Date.now(),
          company: data.company,
          status: 'A'
        };

        const realCompany = await companiesService.create({
          company: data.company
        });

        onSaveSuccess?.(realCompany, 'edit');

        toast({
          title: 'Registro exitoso',
          description: 'La empresa ha sido registrada correctamente'
        });
      }

      form.reset();

    } catch (error) {

      console.error(error);

      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo guardar la empresa',
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-4 px-6 pb-6">
        {/* <FormField
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
        /> */}
        <FormField
          control={form.control}
          name="company"
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
        {/* <FormField
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
        /> */}
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
          {isEditMode ? 'Guardar Cambios' : 'Registrar Empresa'}
        </Button>
      </form>
    </Form>
  );
}

interface AdvancedFilters {
    status: string;
}

export default function EmpresasPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [companyToEdit, setCompanyToEdit] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    status: '',
  });

  const loadCompanies = async () => {
    try {
      const data = await companiesService.list();
      setCompanies(data);
    } catch(e){
      console.error('error al cargar empresas', e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar las empresas',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  loadCompanies();
}, []);

  const { toast } = useToast();

  const handleEditClick = (company: any) => {
    setCompanyToEdit(company);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = async (companyId: number) => {
    try {
      await companiesService.delete(companyId);
      setCompanies(prev => prev.filter(c => c.companyId !== companyId));
      
      toast({
        title: 'Empresa eliminada',
        description: 'La empresa ha sido eliminada correctamente',
      });
    } catch (e){
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar la empresa',
      })
    } finally {

    }
  }

  const handleSaveSuccess = (company: Company, mode: 'create' | 'edit') => {
    if (mode === 'create') {
      setCompanies(prev => [...prev, company]);
    }

    if (mode === 'edit'){
      setCompanies(prev => 
        prev.map(c => 
          c.companyId === company.companyId ||
          c.companyId < 0
            ? company : c)
      );
    }

    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setCompanyToEdit(null);
  };

  const handleAdvancedFilterChange = (filterName: keyof AdvancedFilters, value: string) => {
    setAdvancedFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({ status: '' });
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
        // Advanced filters
        const matchesStatus = advancedFilters.status ? company.status === advancedFilters.status : true;

        // Simple search term filter
        const matchesSearchTerm = searchTerm ? Object.values(company).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        ) : true;

        return matchesStatus && matchesSearchTerm;
    });
  }, [searchTerm, companies, advancedFilters]);

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
                <div className="space-y-4 pt-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Buscar empresa por nombre, ID, ciudad..."
                        className="w-full appearance-none bg-background pl-8 shadow-none md:w-1/3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <Accordion type="single" collapsible className="w-full">
                        <AccordionItem value="advanced-search">
                            <AccordionTrigger>
                                <div className="flex items-center gap-2">
                                    <Filter className="h-4 w-4" />
                                    Búsqueda Avanzada
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="pt-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {/* <Select value={advancedFilters.city} onValueChange={(value) => handleAdvancedFilterChange('city', value)}>
                                        <SelectTrigger><SelectValue placeholder="Ciudad" /></SelectTrigger>
                                        <SelectContent>
                                            {[...new Set(companies.map(c => c.city))].map(city => <SelectItem key={city} value={city}>{city}</SelectItem>)}
                                        </SelectContent>
                                    </Select> */}
                                    <Select value={advancedFilters.status} onValueChange={(value) => handleAdvancedFilterChange('status', value)}>
                                        <SelectTrigger><SelectValue placeholder="Estado" /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Active">Activo</SelectItem>
                                            <SelectItem value="Inactive">Inactivo</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="pt-4 flex justify-end">
                                    <Button variant="ghost" onClick={clearAdvancedFilters}>Limpiar filtros</Button>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>ID Empresa</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map((company) => (
                      <TableRow key={company.companyId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                             <Avatar className="h-9 w-9">
                                <AvatarFallback>{company.company.charAt(0)}</AvatarFallback>
                             </Avatar>
                             <div className="grid gap-0.5">
                                <p className="font-medium">{company.company}</p>
                             </div>
                          </div>
                        </TableCell>
                        <TableCell>EMP-{String(company.companyId).padStart(4, '0')}</TableCell>
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
                                                Esta acción no se puede deshacer. Se eliminará permanentemente la empresa <span className="font-semibold">{company.company}</span>.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteClick(company.companyId)}>Confirmar</AlertDialogAction>
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
