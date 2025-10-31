
import { addMonths, subDays } from 'date-fns';

export const assets = [
  {
    id: 'LAP-001',
    name: 'Laptop Dell Latitude 5420',
    category: 'Equipo de cómputo',
    status: 'Asignado',
    company: 'PALLOMARO S.A',
    responsable: 'John Doe',
    city: 'Cali',
    serialNumber: 'DXG-12345-ABC',
    purchaseDate: '2023-01-15',
    invoiceNumber: 'FV-2023-1234',
    brand: 'Dell',
    model: 'Latitude 5420',
    processor: 'Intel Core i7-11800H',
    ram: '16 GB DDR4',
    storage: '1 TB SSD NVMe',
    os: 'Windows 11 Pro',
    osKey: 'XXXXX-XXXXX-XXXXX-XXXXX-ABCDE',
    officeVersion: 'MICROSOFT OFFICE HOGAR Y EMPRESAS 2021',
    officeKey: 'YYYYY-YYYYY-YYYYY-YYYYY-FGHIJ',
  },
  {
    id: 'MON-002',
    name: 'Monitor LG UltraWide 29"',
    category: 'Monitor',
    status: 'En Almacén',
    company: 'HYCO',
    responsable: 'Almacén',
    city: 'Cali',
    serialNumber: 'LGM-98765-XYZ',
    purchaseDate: '2022-11-30',
    invoiceNumber: 'FV-2022-5678',
    brand: 'LG',
    model: '29WL500-B',
    description: 'Monitor con resolución 2560x1080.',
  },
  {
    id: 'UPS-001',
    name: 'UPS APC 1500VA',
    category: 'UPS',
    status: 'Asignado',
    company: 'FUNDIMETAL',
    responsable: 'Jane Smith',
    city: 'Cali',
    serialNumber: 'APC-91011-JKL',
    purchaseDate: '2024-03-01',
    invoiceNumber: 'FV-2024-9101',
    brand: 'APC',
    model: 'Smart-UPS 1500',
    description: 'Batería reemplazada en Enero 2024.',
  },
  {
    id: 'LAP-002',
    name: 'Laptop HP Elitebook',
    category: 'Equipo de cómputo',
    status: 'Asignado',
    company: 'HYCO',
    responsable: 'Robert Brown',
    city: 'Cali',
    serialNumber: 'HP-ELITE-002',
    purchaseDate: '2023-08-20',
    brand: 'HP',
    model: 'Elitebook 840 G8',
    processor: 'Intel Core i5-1135G7',
    ram: '16 GB DDR4',
    storage: '512 GB SSD',
    os: 'Windows 11 Pro',
  }
];

export const assetHistory = {
    'LAP-001': [
        { id: '1', date: '2024-03-15', author: 'John Doe', type: 'Mantenimiento', description: 'Limpieza interna y cambio de pasta térmica.' },
        { id: '2', date: '2024-05-15', author: 'Jane Smith', type: 'Incidente', description: 'El equipo no enciende. Se revisa fuente de poder y se soluciona.' },
    ],
    'MON-002': [
         { id: '3', date: '2024-02-01', author: 'John Doe', type: 'Instalación', description: 'Instalación de paquete de Adobe Creative Cloud.' },
    ],
    'UPS-001': [
        { id: '4', date: '2024-07-20', author: 'Almacén', type: 'Asignación', description: 'Activo asignado a Robert Brown (Ventas).' },
        // This maintenance is overdue to test the logic
        { id: '5', date: '2024-01-10', author: 'Jane Smith', type: 'Mantenimiento', description: 'Revisión de batería y limpieza.' },
    ],
    'LAP-002': [
        { id: '6', date: '2024-02-25', author: 'Almacén', type: 'Mantenimiento', description: 'Mantenimiento preventivo general.' },
    ]
};


export const deletedAssets = [
    {
      id: 'LAP-000',
      name: 'Laptop HP Probook',
      category: 'Computadores',
      deletionDate: '2023-10-29',
      reason: 'Dañado sin reparación',
    },
];

export const users = [
    { id: '1', name: 'John Doe', company: 'PALLOMARO S.A', department: 'Tecnología' },
    { id: '2', name: 'Jane Smith', company: 'FUNDIMETAL', department: 'Operaciones' },
    { id: '3', name: 'Robert Brown', company: 'HYCO', department: 'Ventas' },
    { id: '4', name: 'Almacén', company: 'PALLOMARO S.A', department: 'Logística' },
    { id: '5', name: 'Washington Palma', company: 'PALLOMARO S.A', department: 'Tecnología' },
    { id: '6', name: 'Johana Fuentes', company: 'PALLOMARO S.A', department: 'Administración'},
    { id: '7', name: 'Claudia Moreno', company: 'HYCO', department: 'Gerencia'},
    { id: '8', name: 'Wilson Rojas', company: 'FUNDIMETAL', department: 'Producción'},
  ];

export const companies = [
    { id: 1, companyId: 'EMP001', name: 'PALLOMARO S.A', city: 'Cali' },
    { id: 2, companyId: 'EMP002', name: 'HYCO', city: 'Cali' },
    { id: 3, companyId: 'EMP003', name: 'FUNDIMETAL', city: 'Cali' },
];
