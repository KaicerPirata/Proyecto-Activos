'use client';

import { usersService } from '@/services/users.service';
import { use, useEffect, useReducer } from 'react';

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
import RegisterForm from '@/components/auth/register-form';
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
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DetailedUser, ListUser } from '@/types/user.types';
import { useCompanies } from '@/hooks/useCompanies';

export default function UsersPage() {
  const [users, setUsers] = useState<ListUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    });
  const [advancedFilters, setAdvancedFilters] = useState({
      companyId: '',
      areaId: '',
      rolId: '',
      status: '',
      search: '',
    });
  const { companies, companiesLoading } = useCompanies();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<DetailedUser | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { toast } = useToast();

  // Fetch users
    const loadUsers = async () => {
      setIsLoading(true);

      try {
        const response = await usersService.list({
          page: currentPage,
          companyId: advancedFilters.companyId ? Number(advancedFilters.companyId) : undefined,
          rolId: advancedFilters.rolId,
          status: advancedFilters.status,
          search: debouncedSearch
        });
        setUsers(response.data);
        setPagination(response.meta);
      } catch {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar los usuarios.',
        });
      } finally {
        setIsLoading(false);
      }
    };

  useEffect(() => {
    loadUsers();
  }, [currentPage, debouncedSearch, advancedFilters]);

  const handleEditClick = async (userId: number) => {
    const res = await usersService.get(userId);
    setUserToEdit(res.data);
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (userId: number) => {
    if(!confirm('¿Seguro que deseas eliminar este usuario?')) return;

    try {
      await usersService.delete(userId);

      setUsers(prev => {
        const updated = prev.filter(u => u.userId !== userId);

        if(updated.length === 0 && currentPage > 1) {
          setCurrentPage(p => p - 1);
        }

        toast({
            title: 'Usuario Eliminado',
            description: `El usuario ha sido eliminado correctamente.`
        });

        return updated;
      });
    } catch (error) {
      console.error(error);

       toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo eliminar el usuario',
            });
    }
  };

  const handleSaveSuccess = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setUserToEdit(undefined);
    // Here you would refetch the data from your backend
  };

  const handleAdvancedFilterChange = (key: string, value: any) => {
    setAdvancedFilters(prev => ({ 
      ...prev, 
      [key]: value || undefined}));
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({ companyId: '', areaId: '', rolId: '', status: '', search: ''});
  };

    // DEBOUNCE SEARCH
  useEffect(() => {
    const timeout = setTimeout(() => {
        setDebouncedSearch(searchTerm);
    }, 600); 

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const getRoleBadgeVariant = (rolId: string) => {
    switch (rolId) {
      case 'ADM':
        return 'default';
      case 'TEC':
        return 'secondary';
      case 'PER':
        return 'outline';
      default:
        return 'default';
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[800px]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-headline tracking-tight">Usuarios</h1>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuevo Usuario
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-3xl rounded-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="text-2xl font-headline text-center">Crear una cuenta</DialogTitle>
                  <DialogDescription className="text-center">
                    Introduce los datos para registrar un nuevo usuario en el sistema.
                  </DialogDescription>
                </DialogHeader>
                <RegisterForm onRegisterSuccess={handleSaveSuccess}/>
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
          <Card>
            <CardHeader>
                <CardTitle>Listado de Usuarios</CardTitle>
                 <div className="space-y-4 pt-2">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                        type="search"
                        placeholder="Buscar usuario por nombre, email, empresa..."
                        className="w-full appearance-none bg-background pl-8 shadow-none md:w-1/3"
                        value={searchTerm}
                        onChange={(e) => {setCurrentPage(1); setSearchTerm(e.target.value);}}
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
                                    <Select value={advancedFilters.companyId || ""} onValueChange={(value) => handleAdvancedFilterChange('companyId', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Empresa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map(comp => <SelectItem key={comp.companyId} value={String(comp.companyId)}>{comp.company}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                     <Select value={advancedFilters.rolId} onValueChange={(value) => handleAdvancedFilterChange('rolId', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ADM">Admin</SelectItem>
                                            <SelectItem value="TEC">Técnico</SelectItem>
                                            <SelectItem value="PER">Estándar</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Select value={advancedFilters.status} onValueChange={(value) => handleAdvancedFilterChange('status', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Estado" />
                                        </SelectTrigger>
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
                      <TableHead>Usuario</TableHead>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.userId}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                             <Avatar className="h-9 w-9">
                                <AvatarFallback>{user.initials}</AvatarFallback>
                             </Avatar>
                             <div className="grid gap-0.5">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                             </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.company}</TableCell>
                        <TableCell>
                            <Badge variant={getRoleBadgeVariant(user.rol)}>{user.rol}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'Active' ? 'default' : 'destructive'}>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <TooltipProvider>
                                <div className="flex justify-end gap-2">
                                     <Tooltip>
                                        <TooltipTrigger asChild>
                                           <Button variant="outline" size="icon" onClick={() => handleEditClick(user.userId)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>Editar Usuario</p>
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
                                                <p>Eliminar Usuario</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Esta acción no se puede deshacer. Se eliminará permanentemente al usuario <span className="font-semibold">{user.name}</span>.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDelete(user.userId)}>Confirmar</AlertDialogAction>
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
              <div className='flex items-center justify-between pt-4'>
                    <p className='text-sm text-muted-foreground'>
                        Página {pagination.current_page} de {pagination.last_page}
                    </p>
                    <div className='flex gap-2'>
                        <Button 
                          variant="outline"
                          size="sm"
                          disabled={pagination.current_page === 1}
                          onClick={() => setCurrentPage((p) => p - 1)}
                        >
                          anterior
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={pagination.current_page === pagination.last_page}
                          onClick={() => setCurrentPage((p) => p + 1)}
                        > 
                          siguiente
                        </Button>
                    </div>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Edit User Dialog */}
       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-3xl rounded-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="text-2xl font-headline text-center">Editar usuario</DialogTitle>
                  <DialogDescription className="text-center">
                    Modifica los datos del usuario. La contraseña no se puede editar aquí.
                  </DialogDescription>
                </DialogHeader>
                <RegisterForm onRegisterSuccess={handleSaveSuccess} userToEdit={userToEdit} />
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
              </DialogContent>
        </Dialog>
    </DashboardLayout>
  );
}

    