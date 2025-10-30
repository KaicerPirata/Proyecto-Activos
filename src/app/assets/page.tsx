
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
import { PlusCircle, X, Calendar as CalendarIcon, Trash2, ArrowLeft, Monitor, Zap, Laptop, ClipboardPlus, Eye } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import AssetHistory from '@/components/dashboard/asset-history';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

// Mock data for assets
const assets = [
  {
    id: 'LAP-001',
    name: 'Laptop Dell XPS 15',
    category: 'Computadores',
    status: 'Asignado',
    company: 'PALLOMARO S.A',
    responsable: 'John Doe',
    serialNumber: 'DXG-12345-ABC',
    purchaseDate: '2023-01-15',
    brand: 'Dell',
    model: 'XPS 15',
    processor: 'Intel Core i7-11800H',
    ram: '16 GB DDR4',
    storage: '1 TB SSD NVMe',
    os: 'Windows 11 Pro',
  },
  {
    id: 'MON-002',
    name: 'Monitor LG UltraWide 29"',
    category: 'Monitores',
    status: 'En Almacén',
    company: 'HYCO',
    responsable: 'Almacén',
    serialNumber: 'LGM-98765-XYZ',
    purchaseDate: '2022-11-30',
    brand: 'LG',
    model: '29WL500-B',
  },
  {
    id: 'SFT-003',
    name: 'Licencia Adobe Creative Cloud',
    category: 'Software',
    status: 'Asignado',
    company: 'PALLOMARO S.A',
    responsable: 'Jane Smith',
    serialNumber: 'N/A',
    purchaseDate: '2024-03-01',
    brand: 'Adobe',
    model: 'Creative Cloud',
  },
];

const deletedAssets = [
    {
      id: 'LAP-000',
      name: 'Laptop HP Probook',
      category: 'Computadores',
      deletionDate: '2023-10-29',
      reason: 'Dañado sin reparación',
    },
];

// Mock data for users - In a real app, this would come from an API
const users = [
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' },
    { id: '3', name: 'Robert Brown' },
    { id: '4', name: 'Almacén' },
  ];

const computerAssetSchema = z.object({
  responsable: z.string().min(1, 'El responsable es requerido.'),
  serialNumber: z.string().min(1, 'El número de serie es requerido.'),
  invoiceNumber: z.string().optional(),
  purchaseDate: z.date({ required_error: 'La fecha de compra es requerida.' }),
  assetName: z.string().min(1, 'El nombre del activo es requerido.'),
  networkName: z.string().optional(),
  equipmentType: z.enum(['micro', 'portatil', 'servidor', 'sff', 'todo en uno', 'torre', 'ups']),
  brand: z.string().min(1, 'La marca es requerida.'),
  model: z.string().min(1, 'El modelo es requerido.'),
  processor: z.string().min(1, 'El procesador es requerido.'),
  ram: z.string().min(1, 'La memoria RAM es requerida.'),
  storage: z.string().min(1, 'El disco duro es requerido.'),
  officeVersion: z.enum([
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2007',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2010',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2013',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2016',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2019',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2021',
    'MICROSOFT OFFICE HOGAR Y EMPRESAS 2024 - ES-ES'
  ]),
  officeKey: z.string().optional(),
  os: z.enum(['Windows 10 Pro', 'Windows 11 Pro']),
  osKey: z.string().optional(),
});


const simpleAssetSchema = z.object({
    assetName: z.string().min(1, 'El nombre del activo es requerido.'),
    responsable: z.string().min(1, 'El responsable es requerido.'),
    serialNumber: z.string().min(1, 'El número de serie es requerido.'),
    invoiceNumber: z.string().optional(),
    purchaseDate: z.date({ required_error: 'La fecha de compra es requerida.' }),
    brand: z.string().min(1, 'La marca es requerida.'),
    model: z.string().min(1, 'El modelo es requerido.'),
    description: z.string().optional(),
});

type ComputerAssetSchema = z.infer<typeof computerAssetSchema>;
type SimpleAssetSchema = z.infer<typeof simpleAssetSchema>;

const addHistorySchema = z.object({
    description: z.string().min(1, 'La descripción es requerida.'),
    type: z.enum(['Mantenimiento', 'Incidente'], {
        required_error: 'Debes seleccionar un tipo de registro.',
    }),
});

type AddHistorySchema = z.infer<typeof addHistorySchema>;

function AddHistoryForm({ assetId, onSaveSuccess }: { assetId: string, onSaveSuccess: () => void }) {
    const { toast } = useToast();
    const form = useForm<AddHistorySchema>({
        resolver: zodResolver(addHistorySchema),
        defaultValues: {
            description: '',
            type: 'Incidente',
        },
    });

    function onSubmit(data: AddHistorySchema) {
        try {
            console.log('New history entry for asset', assetId, data);
            toast({
                title: 'Historial Añadido',
                description: 'El nuevo registro ha sido guardado correctamente.',
            });
            form.reset();
            onSaveSuccess();
        } catch (error) {
            console.error('Error adding history:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo guardar el registro. Inténtalo de nuevo.',
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Tipo de Registro</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex items-center space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="Mantenimiento" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Mantenimiento</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl>
                                            <RadioGroupItem value="Incidente" />
                                        </FormControl>
                                        <FormLabel className="font-normal">Incidente / Intervención</FormLabel>
                                    </FormItem>
                                </RadioGroup>
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
                            <FormLabel>Descripción del Trabajo Realizado</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Detalla aquí el mantenimiento, instalación o incidente ocurrido con el equipo..."
                                    className="resize-y min-h-[150px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end">
                    <Button type="submit">Guardar Registro</Button>
                </div>
            </form>
        </Form>
    );
}

function AssetForm({ assetType, onRegisterSuccess, onBack }: { assetType: 'Equipo de cómputo' | 'Monitor' | 'UPS', onRegisterSuccess?: () => void, onBack: () => void }) {
  const { toast } = useToast();
  
  const isComputer = assetType === 'Equipo de cómputo';
  const schema = isComputer ? computerAssetSchema : simpleAssetSchema;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: isComputer ? {
      responsable: '',
      serialNumber: '',
      invoiceNumber: '',
      assetName: '',
      networkName: '',
      brand: '',
      model: '',
      processor: '',
      ram: '',
      storage: '',
      officeKey: '',
      osKey: '',
    } : {
      responsable: '',
      assetName: '',
      serialNumber: '',
      invoiceNumber: '',
      brand: '',
      model: '',
      description: '',
    },
  });

  function onSubmit(data: z.infer<typeof schema>) {
    try {
      console.log('Asset data submitted:', { assetType, ...data });
      toast({
        title: 'Registro Exitoso',
        description: `El ${assetType.toLowerCase()} ha sido registrado correctamente.`,
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
        description: `No se pudo registrar el ${assetType.toLowerCase()}. Inténtalo de nuevo.`,
      });
    }
  }

  const getPlaceholder = () => {
    switch (assetType) {
        case 'Equipo de cómputo':
            return 'LAPTOP-001';
        case 'Monitor':
            return 'MONITOR-001';
        case 'UPS':
            return 'UPS-001';
    }
  }

  return (
    <>
        <Button variant="ghost" onClick={onBack} className="absolute left-4 top-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
        </Button>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="px-6 pb-6">
            <div className="mb-6">
                 <FormField
                    control={form.control}
                    name="responsable"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Responsable</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un responsable" />
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
            </div>
            
            <Separator className="my-4" />

            <div className={`grid grid-cols-1 ${isComputer ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4`}>
                {/* Common Fields */}
                <FormField
                control={form.control}
                name="assetName"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Activo / Nombre</FormLabel>
                    <FormControl>
                        <Input placeholder={getPlaceholder()} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="serialNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Número de Serie</FormLabel>
                    <FormControl>
                        <Input placeholder="DXG-12345-ABC" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="invoiceNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Factura (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="FV-2024-9876" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="purchaseDate"
                render={({ field }) => (
                    <FormItem className="flex flex-col pt-2">
                    <FormLabel>Fecha de Compra</FormLabel>
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
                            {field.value ? (
                                format(field.value, 'PPP')
                            ) : (
                                <span>Selecciona una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value as Date | undefined}
                            onSelect={field.onChange}
                            disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                            }
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
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
                        <Input placeholder="Dell, HP, APC..." {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                {/* Computer-specific fields */}
                {isComputer && (
                <>
                <FormField
                control={form.control}
                name="model"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Modelo</FormLabel>
                    <FormControl>
                        <Input placeholder="Latitude 5420" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                    control={form.control}
                    name="networkName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nombre en Red (Opcional)</FormLabel>
                        <FormControl>
                            <Input placeholder="PC-VENTAS-01" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                control={form.control}
                name="equipmentType"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Tipo de Equipo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="micro">Micro</SelectItem>
                        <SelectItem value="portatil">Portátil</SelectItem>
                        <SelectItem value="servidor">Servidor</SelectItem>
                        <SelectItem value="sff">SFF</SelectItem>
                        <SelectItem value="todo en uno">Todo en Uno</SelectItem>
                        <SelectItem value="torre">Torre</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                
                <FormField
                control={form.control}
                name="processor"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Procesador</FormLabel>
                    <FormControl>
                        <Input placeholder="Intel Core i5-1135G7" {...field} />
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
                        <Input placeholder="16 GB DDR4" {...field} />
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
                    <FormLabel>Disco Duro</FormLabel>
                    <FormControl>
                        <Input placeholder="512 GB SSD NVMe" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <div className="md:col-span-3" />
                <FormField
                control={form.control}
                name="officeVersion"
                render={({ field }) => (
                    <FormItem className="md:col-span-1">
                    <FormLabel>Versión de Office</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona una versión" />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2007">Office 2007 Hogar y Empresas</SelectItem>
                        <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2010">Office 2010 Hogar y Empresas</SelectItem>
                        <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2013">Office 2013 Hogar y Empresas</SelectItem>
                        <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2016">Office 2016 Hogar y Empresas</SelectItem>
                        <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2019">Office 2019 Hogar y Empresas</SelectItem>
                        <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2021">Office 2021 Hogar y Empresas</SelectItem>
                        <SelectItem value="MICROSOFT OFFICE HOGAR Y EMPRESAS 2024 - ES-ES">Office 2024 Hogar y Empresas</SelectItem>
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="officeKey"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                    <FormLabel>Clave de Office (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="os"
                render={({ field }) => (
                    <FormItem className="md:col-span-1">
                    <FormLabel>Sistema Operativo</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder="Selecciona un S.O." />
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
                name="osKey"
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                    <FormLabel>Clave de S.O. (Opcional)</FormLabel>
                    <FormControl>
                        <Input placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                </>
                )}

                {/* Simple form specific fields */}
                {!isComputer && (
                    <>
                    <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                            <Input placeholder="Smart-UPS 1500" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem className="md:col-span-2">
                                <FormLabel>Descripción (Opcional)</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Cualquier detalle adicional sobre el activo..."
                                    className="resize-none"
                                    {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    </>
                )}


                <div className={`${isComputer ? "md:col-span-3" : "md:col-span-2"} pt-4`}>
                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                    Registrar Activo
                </Button>
                </div>
            </div>
        </form>
        </Form>
    </>
  );
}

function AssetTypeSelector({ onSelect, onCancel }: { onSelect: (type: 'Equipo de cómputo' | 'Monitor' | 'UPS') => void, onCancel: () => void }) {
    return (
        <div className="p-6">
            <DialogHeader className="mb-6">
                <DialogTitle className="text-2xl font-headline text-center">Selecciona un tipo de activo</DialogTitle>
                <DialogDescription className="text-center">
                    Elige la categoría del activo que deseas registrar.
                </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => onSelect('Equipo de cómputo')}>
                    <Laptop className="h-8 w-8 text-primary" />
                    <span>Equipo de Cómputo</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => onSelect('Monitor')}>
                    <Monitor className="h-8 w-8 text-primary" />
                    <span>Monitor</span>
                </Button>
                <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => onSelect('UPS')}>
                    <Zap className="h-8 w-8 text-primary" />
                    <span>UPS</span>
                </Button>
            </div>
             <DialogClose asChild>
                <Button variant="ghost" onClick={onCancel} className="w-full mt-4">Cancelar</Button>
            </DialogClose>
        </div>
    );
}

export default function ActivosPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [selectedAssetIdForHistory, setSelectedAssetIdForHistory] = useState<string | null>(null);
  const [selectedAssetType, setSelectedAssetType] = useState<'Equipo de cómputo' | 'Monitor' | 'UPS' | null>(null);

  const handleDialogChange = (open: boolean) => {
    if (!open) {
        setSelectedAssetType(null);
    }
    setIsDialogOpen(open);
  }

  const handleHistoryDialogChange = (open: boolean) => {
    if (!open) {
        setSelectedAssetIdForHistory(null);
    }
    setIsHistoryDialogOpen(open);
  }
  
  const handleOpenHistoryDialog = (assetId: string) => {
    setSelectedAssetIdForHistory(assetId);
    setIsHistoryDialogOpen(true);
  };

  const handleRegisterSuccess = () => {
    setIsDialogOpen(false);
    setSelectedAssetType(null);
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col h-full min-w-[800px]">
        <Header />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold font-headline tracking-tight">Activos</h1>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
              <DialogTrigger asChild>
                <Button>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Nuevo Activo
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-4xl rounded-lg max-h-[90vh] overflow-y-auto p-0">
                {!selectedAssetType ? (
                    <AssetTypeSelector onSelect={setSelectedAssetType} onCancel={() => handleDialogChange(false)} />
                ) : (
                    <>
                    <DialogHeader className="pt-12 px-6">
                        <DialogTitle className="text-2xl font-headline text-center">Registrar nuevo {selectedAssetType.toLowerCase()}</DialogTitle>
                        <DialogDescription className="text-center">
                            Introduce los datos para registrar el activo en el sistema.
                        </DialogDescription>
                    </DialogHeader>
                    <AssetForm 
                        assetType={selectedAssetType} 
                        onRegisterSuccess={handleRegisterSuccess}
                        onBack={() => setSelectedAssetType(null)} 
                    />
                    </>
                )}
                 <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </DialogClose>
              </DialogContent>
            </Dialog>
          </div>
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">Listado de Activos</TabsTrigger>
                <TabsTrigger value="deleted">Activos Eliminados</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
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
                            <TableHead className="text-right">Acciones</TableHead>
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
                                <TableCell className="flex justify-end gap-2">
                                    <TooltipProvider>
                                        <Dialog>
                                            <Tooltip>
                                                <TooltipTrigger asChild>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="icon">
                                                            <Eye className="h-4 w-4" />
                                                        </Button>
                                                    </DialogTrigger>
                                                </TooltipTrigger>
                                                <TooltipContent>
                                                    <p>Ver Equipo</p>
                                                </TooltipContent>
                                            </Tooltip>
                                            <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-4xl rounded-lg max-h-[90vh] overflow-y-auto">
                                                <DialogHeader>
                                                    <DialogTitle className="text-2xl font-headline">Detalles del Activo: {asset.name}</DialogTitle>
                                                    <DialogDescription>
                                                        Información completa y registros de mantenimiento.
                                                    </DialogDescription>
                                                </DialogHeader>
                                                <div className="py-4 space-y-6">
                                                    <Card>
                                                        <CardHeader>
                                                            <CardTitle className="text-xl">Especificaciones Técnicas</CardTitle>
                                                        </CardHeader>
                                                        <CardContent>
                                                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                                                                <div><span className="font-semibold">ID Activo: </span>{asset.id}</div>
                                                                <div><span className="font-semibold">Categoría: </span>{asset.category}</div>
                                                                <div><span className="font-semibold">Estado: </span>{asset.status}</div>
                                                                <div><span className="font-semibold">Empresa: </span>{asset.company}</div>
                                                                <div><span className="font-semibold">Responsable: </span>{asset.responsable}</div>
                                                                <div><span className="font-semibold">Nº de Serie: </span>{asset.serialNumber}</div>
                                                                <div><span className="font-semibold">Fecha Compra: </span>{asset.purchaseDate}</div>
                                                                <div><span className="font-semibold">Marca: </span>{asset.brand}</div>
                                                                <div><span className="font-semibold">Modelo: </span>{asset.model}</div>
                                                                {asset.processor && <div><span className="font-semibold">Procesador: </span>{asset.processor}</div>}
                                                                {asset.ram && <div><span className="font-semibold">RAM: </span>{asset.ram}</div>}
                                                                {asset.storage && <div><span className="font-semibold">Almacenamiento: </span>{asset.storage}</div>}
                                                                {asset.os && <div><span className="font-semibold">S.O.: </span>{asset.os}</div>}
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                    <AssetHistory assetId={asset.id}/>
                                                </div>
                                            </DialogContent>
                                        </Dialog>

                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button variant="secondary" size="icon" onClick={() => handleOpenHistoryDialog(asset.id)}>
                                                    <ClipboardPlus className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>Añadir Historial</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="deleted">
                 <Card>
                    <CardHeader>
                        <CardTitle>Activos Eliminados</CardTitle>
                    </CardHeader>
                    <CardContent>
                    <div className="overflow-x-auto">
                        <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>ID Activo</TableHead>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Categoría</TableHead>
                            <TableHead>Fecha de Baja</TableHead>
                            <TableHead>Motivo</TableHead>
                            <TableHead>Acciones</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {deletedAssets.map((asset) => (
                            <TableRow key={asset.id}>
                                <TableCell className="font-medium">{asset.id}</TableCell>
                                <TableCell>{asset.name}</TableCell>
                                <TableCell>{asset.category}</TableCell>
                                <TableCell>{asset.deletionDate}</TableCell>
                                <TableCell>{asset.reason}</TableCell>
                                <TableCell>
                                <Button variant="outline" size="sm">
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Restaurar
                                </Button>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                        </Table>
                    </div>
                    </CardContent>
                </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
      <Dialog open={isHistoryDialogOpen} onOpenChange={handleHistoryDialogChange}>
            <DialogContent className="w-[90vw] max-w-[90vw] md:w-full md:max-w-xl rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-headline">Añadir Registro al Historial</DialogTitle>
                    <DialogDescription>
                        Registra un nuevo mantenimiento o incidente para el activo {selectedAssetIdForHistory}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    {selectedAssetIdForHistory && (
                        <AddHistoryForm 
                            assetId={selectedAssetIdForHistory} 
                            onSaveSuccess={() => handleHistoryDialogChange(false)} 
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    </DashboardLayout>
  );
}
