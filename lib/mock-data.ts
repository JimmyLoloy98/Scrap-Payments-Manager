import type { Client, Credit, ScrapPayment, DashboardStats, RecentActivity, Origin, ScrapType, User } from './types'


export const mockUser: User[] = [
  {
    id: 'user-1',
    email: 'admin@scrapflow.com',
    name: 'John Admin',
    companyId: 'company-1',
    company: {
      id: 'company-1',
      name: 'Metro Scrap Solutions',
      createdAt: new Date('2023-01-01'),
    },
    avatar: undefined,
  },
]

// Mock origins (lugares de procedencia)
export const mockOrigins: Origin[] = [
  {
    id: '1',
    companyId: 'company-1',
    name: 'Zona Norte',
    description: 'Clientes de la zona norte de la ciudad',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    companyId: 'company-1',
    name: 'Zona Sur',
    description: 'Clientes de la zona sur de la ciudad',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    companyId: 'company-1',
    name: 'Zona Centro',
    description: 'Clientes del centro de la ciudad',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    companyId: 'company-1',
    name: 'Zona Industrial',
    description: 'Clientes de la zona industrial',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    companyId: 'company-1',
    name: 'Zona Rural',
    description: 'Clientes de zonas rurales cercanas',
    createdAt: new Date('2024-01-01'),
  },
]

// Mock scrap types (tipos de chatarra)
export const mockScrapTypes: ScrapType[] = [
  {
    id: '1',
    companyId: 'company-1',
    name: 'Hierro',
    description: 'Chatarra de hierro general',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    companyId: 'company-1',
    name: 'Baterias',
    description: 'Baterias de auto usadas',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    companyId: 'company-1',
    name: 'Cobre',
    description: 'Cobre limpio',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    companyId: 'company-1',
    name: 'Aluminio',
    description: 'Aluminio de latas y perfiles',
    createdAt: new Date('2024-01-01'),
  },
]

// Mock clients
export const mockClients: Client[] = [
  {
    id: '1',
    companyId: 'company-1',
    name: 'Roberto Martinez',
    businessName: 'Taller Martinez',
    ownerName: 'Roberto Martinez',
    dni: '12345678',
    ruc: '10123456789',
    phone: '+1 555-0101',
    email: 'roberto@example.com',
    address: '123 Industrial Ave, Metro City',
    origin: 'Zona Industrial',
    notes: 'Reliable customer, prefers morning deliveries',
    currentDebt: 2500,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    companyId: 'company-1',
    name: 'Maria Santos',
    businessName: 'Recicladora Santos',
    ownerName: 'Maria Santos',
    dni: '87654321',
    ruc: '10876543210',
    phone: '+1 555-0102',
    email: 'maria.santos@example.com',
    address: '456 Commerce St, Metro City',
    origin: 'Zona Centro',
    notes: 'Large volume buyer',
    currentDebt: 5200,
    createdAt: new Date('2024-02-20'),
  },
  {
    id: '3',
    companyId: 'company-1',
    name: 'Carlos Fernandez',
    businessName: 'Chatarreria El Gallo',
    ownerName: 'Carlos Fernandez',
    dni: '11223344',
    ruc: '10112233445',
    phone: '+1 555-0103',
    email: 'carlos.f@example.com',
    address: '789 Trade Blvd, Metro City',
    origin: 'Zona Norte',
    notes: 'Weekly payment schedule',
    currentDebt: 0,
    createdAt: new Date('2024-03-10'),
  },
  {
    id: '4',
    companyId: 'company-1',
    name: 'Ana Rodriguez',
    businessName: 'Metales Rodriguez',
    ownerName: 'Ana Rodriguez',
    dni: '44332211',
    ruc: '10443322110',
    phone: '+1 555-0104',
    email: 'ana.rodriguez@example.com',
    address: '321 Market Lane, Metro City',
    origin: 'Zona Sur',
    notes: 'New customer',
    currentDebt: 1800,
    createdAt: new Date('2024-04-05'),
  },
  {
    id: '5',
    companyId: 'company-1',
    name: 'Pedro Gonzalez',
    businessName: 'Autopartes Pedro',
    ownerName: 'Pedro Gonzalez',
    dni: '55667788',
    ruc: '10556677889',
    phone: '+1 555-0105',
    email: 'pedro.g@example.com',
    address: '654 Factory Rd, Metro City',
    origin: 'Zona Rural',
    notes: 'Pays with mixed scrap',
    currentDebt: 3100,
    createdAt: new Date('2024-05-12'),
  },
]

// Mock credits
export const mockCredits: Credit[] = [
  {
    id: '1',
    companyId: 'company-1',
    clientId: '1',
    clientName: 'Roberto Martinez',
    clientOrigin: 'Zona Industrial',
    date: new Date('2025-01-10'),
    items: [{ description: 'Steel sheets (50 units)', price: 1500 }],
    amount: 1500,
    status: 'pending',
    notes: 'Delivered to warehouse',
    createdAt: new Date('2025-01-10'),
  },
  {
    id: '2',
    companyId: 'company-1',
    clientId: '2',
    clientName: 'Maria Santos',
    clientOrigin: 'Zona Centro',
    date: new Date('2025-01-08'),
    items: [{ description: 'Copper wire rolls (20 units)', price: 2800 }],
    amount: 2800,
    status: 'partial',
    notes: 'Partial payment received',
    createdAt: new Date('2025-01-08'),
  },
  {
    id: '3',
    companyId: 'company-1',
    clientId: '3',
    clientName: 'Carlos Fernandez',
    clientOrigin: 'Zona Norte',
    date: new Date('2025-01-05'),
    items: [{ description: 'Aluminum ingots (30 units)', price: 2100 }],
    amount: 2100,
    status: 'paid',
    notes: 'Fully paid with scrap',
    createdAt: new Date('2025-01-05'),
  },
  {
    id: '4',
    companyId: 'company-1',
    clientId: '4',
    clientName: 'Ana Rodriguez',
    clientOrigin: 'Zona Sur',
    date: new Date('2025-01-12'),
    items: [{ description: 'Mixed metal supplies', price: 1800 }],
    amount: 1800,
    status: 'pending',
    notes: 'New order',
    createdAt: new Date('2025-01-12'),
  },
  {
    id: '5',
    companyId: 'company-1',
    clientId: '5',
    clientName: 'Pedro Gonzalez',
    clientOrigin: 'Zona Rural',
    date: new Date('2025-01-15'),
    items: [{ description: 'Battery cores (100 units)', price: 3100 }],
    amount: 3100,
    status: 'pending',
    notes: 'Urgent delivery',
    createdAt: new Date('2025-01-15'),
  },
]

// Mock scrap payments
export const mockScrapPayments: ScrapPayment[] = [
  {
    id: '1',
    companyId: 'company-1',
    clientId: '3',
    clientName: 'Carlos Fernandez',
    clientOrigin: 'Zona Norte',
    date: new Date('2025-01-06'),
    items: [
      { scrapId: '1', scrapName: 'Hierro', amount: 1500 },
      { scrapId: '3', scrapName: 'Cobre', amount: 600 }
    ],
    totalValue: 2100,
    notes: 'Full payment for credit #3',
    createdAt: new Date('2025-01-06'),
  },
  {
    id: '2',
    companyId: 'company-1',
    clientId: '2',
    clientName: 'Maria Santos',
    clientOrigin: 'Zona Centro',
    date: new Date('2025-01-09'),
    items: [
       { scrapId: '2', scrapName: 'Baterias', amount: 800 },
       { scrapId: '1', scrapName: 'Hierro', amount: 400 }
    ],
    totalValue: 1200,
    notes: 'Partial payment',
    createdAt: new Date('2025-01-09'),
  },
  {
    id: '3',
    companyId: 'company-1',
    clientId: '1',
    clientName: 'Roberto Martinez',
    clientOrigin: 'Zona Industrial',
    date: new Date('2025-01-11'),
    items: [
       { scrapId: '1', scrapName: 'Hierro', amount: 1000 },
       { scrapId: '4', scrapName: 'Aluminio', amount: 800 }
    ],
    totalValue: 1800,
    notes: 'Regular collection',
    createdAt: new Date('2025-01-11'),
  },
]

// Dashboard stats
export const mockDashboardStats: DashboardStats = {
  totalActiveClients: 5,
  totalCreditExtended: 11300,
  totalScrapPaymentsReceived: 5100,
  totalPendingDebt: 12600,
}

// Recent activity
export const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'credit',
    clientName: 'Pedro Gonzalez',
    description: 'Battery cores (100 units)',
    amount: 3100,
    date: new Date('2025-01-15'),
  },
  {
    id: '2',
    type: 'credit',
    clientName: 'Ana Rodriguez',
    description: 'Mixed metal supplies',
    amount: 1800,
    date: new Date('2025-01-12'),
  },
  {
    id: '3',
    type: 'payment',
    clientName: 'Roberto Martinez',
    description: 'Scrap payment',
    amount: 1800,
    date: new Date('2025-01-11'),
  },
  {
    id: '4',
    type: 'credit',
    clientName: 'Roberto Martinez',
    description: 'Steel sheets (50 units)',
    amount: 1500,
    date: new Date('2025-01-10'),
  },
  {
    id: '5',
    type: 'payment',
    clientName: 'Maria Santos',
    description: 'Scrap payment',
    amount: 1200,
    date: new Date('2025-01-09'),
  },
  {
    id: '6',
    type: 'credit',
    clientName: 'Maria Santos',
    description: 'Copper wire rolls (20 units)',
    amount: 2800,
    date: new Date('2025-01-08'),
  },
  {
    id: '7',
    type: 'payment',
    clientName: 'Carlos Fernandez',
    description: 'Scrap payment',
    amount: 2100,
    date: new Date('2025-01-06'),
  },
  {
    id: '8',
    type: 'credit',
    clientName: 'Carlos Fernandez',
    description: 'Aluminum ingots (30 units)',
    amount: 2100,
    date: new Date('2025-01-05'),
  },
]

// Scrap prices (per unit/kg)
// Scrap prices and calc functions removed
