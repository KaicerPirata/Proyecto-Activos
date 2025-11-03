
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

// Mock data for users
const initialUsers = [
  {
    id: 1,
    name: 'Johana Fuentes',
    email: 'J_fuentes@pallomaro.com',
    role: 'Admin',
    status: 'Active',
    company: 'PALLOMARO S.A',
    idNumber: '111111111',
    firstName: 'Johana',
    lastName: 'Fuentes',
    city: 'Cali',
    location: 'Sede Principal',
    department: 'Tecnología',
  },
  {
    id: 2,
    name: 'Claudia Moreno',
    email: 'C_moreno@hyco.co.com',
    role: 'Admin',
    status: 'Active',
    company: 'HYCO',
    idNumber: '222222222',
    firstName: 'Claudia',
    lastName: 'Moreno',
    city: 'Cali',
    location: 'Oficina Central',
    department: 'Gerencia',
  },
  {
    id: 3,
    name: 'Wilson Rojas',
    email: 'Wilson_r@fundimetal.com',
    role: 'Admin',
    status: 'Active',
    company: 'FUNDIMETAL',
    idNumber: '333333333',
    firstName: 'Wilson',
    lastName: 'Rojas',
    city: 'Cali',
    location: 'Planta',
    department: 'Operaciones',
  },
  {
    id: 4,
    name: 'William Aguilera',
    email: 'sistemas@wfm.com',
    role: 'Admin',
    status: 'Active',
    company: 'WFM',
    idNumber: '444444444',
    firstName: 'William',
    lastName: 'Aguilera',
    city: 'Cali',
    location: 'Sede Principal',
    department: 'Tecnología',
  },
  {
    id: 5,
    name: 'Dylam Moralez',
    email: 'sistemas@wfm.com',
    role: 'Admin',
    status: 'Active',
    company: 'WFM',
    idNumber: '555555555',
    firstName: 'Dylam',
    lastName: 'Moralez',
    city: 'Cali',
    location: 'Planta',
    department: 'Operaciones',
  },
  {
    id: 6,
    name: 'Carlos Fierro',
    email: 'sistemas@wfm.com',
    role: 'Admin',
    status: 'Active',
    company: 'WFM',
    idNumber: '666666666',
    firstName: 'Carlos',
    lastName: 'Fierro',
    city: 'Bogota',
    location: 'Oficina Central',
    department: 'Ventas',
  },
];

// Mock data for companies
const companies = [
    {
      id: 1,
      name: 'PALLOMARO S.A',
    },
    {
      id: 2,
      name: 'HYCO',
    },
    {
      id: 3,
      name: 'FUNDIMETAL',
    },
    {
      id: 4,
      name: 'WFM',
    },
];

const getInitials = (name: string) => {
    if (!name) return '';
    const names = name.split(' ');
    if (names.length > 1) {
        return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

interface AdvancedFilters {
    company: string;
    role: string;
    status: string;
}

export default function UsersPage() {
  const [users, setUsers] = useState(initialUsers);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters>({
    company: '',
    role: '',
    status: '',
  });
  const { toast } = useToast();

  const handleEditClick = (user: any) => {
    setUserToEdit(user);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (userId: number, userName: string) => {
    // In a real app, you'd call an API here
    setUsers(users.filter(u => u.id !== userId));
    toast({
        title: 'Usuario Eliminado',
        description: `El usuario ${userName} ha sido eliminado.`,
    });
  };

  const handleSaveSuccess = () => {
    setIsCreateDialogOpen(false);
    setIsEditDialogOpen(false);
    setUserToEdit(null);
    // Here you would refetch the data from your backend
  };

  const handleAdvancedFilterChange = (filterName: keyof AdvancedFilters, value: string) => {
    setAdvancedFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const clearAdvancedFilters = () => {
    setAdvancedFilters({ company: '', role: '', status: '' });
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
        const matchesCompany = advancedFilters.company ? user.company === advancedFilters.company : true;
        const matchesRole = advancedFilters.role ? user.role === advancedFilters.role : true;
        const matchesStatus = advancedFilters.status ? user.status === advancedFilters.status : true;

        const matchesSearchTerm = searchTerm ? Object.values(user).some(value =>
            String(value).toLowerCase().includes(searchTerm.toLowerCase())
        ) : true;

        return matchesCompany && matchesRole && matchesStatus && matchesSearchTerm;
    });
  }, [searchTerm, users, advancedFilters]);

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
                <RegisterForm onRegisterSuccess={handleSaveSuccess} companies={companies} />
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
                                    <Select value={advancedFilters.company} onValueChange={(value) => handleAdvancedFilterChange('company', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Empresa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {companies.map(comp => <SelectItem key={comp.id} value={comp.name}>{comp.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                     <Select value={advancedFilters.role} onValueChange={(value) => handleAdvancedFilterChange('role', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                             <SelectItem value="Admin">Admin</SelectItem>
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
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                             <Avatar className="h-9 w-9">
                                <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                             </Avatar>
                             <div className="grid gap-0.5">
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                             </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.company}</TableCell>
                        <TableCell>{user.role}</TableCell>
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
                                           <Button variant="outline" size="icon" onClick={() => handleEditClick(user)}>
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
                                            <AlertDialogAction onClick={() => handleDeleteClick(user.id, user.name)}>Confirmar</AlertDialogAction>
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

      {/* Edit User Dialog */}
       <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-3xl rounded-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle className="text-2xl font-headline text-center">Editar usuario</DialogTitle>
                  <DialogDescription className="text-center">
                    Modifica los datos del usuario. La contraseña no se puede editar aquí.
                  </DialogDescription>
                </DialogHeader>
                <RegisterForm onRegisterSuccess={handleSaveSuccess} companies={companies} userToEdit={userToEdit} />
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
              </DialogContent>
        </Dialog>
    </DashboardLayout>
  );
}

    