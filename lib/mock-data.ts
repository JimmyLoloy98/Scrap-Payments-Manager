import type { Client, Credit, ScrapPayment, DashboardStats, RecentActivity, Origin } from './types'

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

// Mock clients
export const mockClients: Client[] = [
  {
    id: '1',
    companyId: 'company-1',
    name: 'Roberto Martinez',
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
    productDescription: 'Steel sheets (50 units)',
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
    productDescription: 'Copper wire rolls (20 units)',
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
    productDescription: 'Aluminum ingots (30 units)',
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
    productDescription: 'Mixed metal supplies',
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
    productDescription: 'Battery cores (100 units)',
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
    date: new Date('2025-01-06'),
    scrapDetails: {
      ironKg: 150,
      batteriesUnits: 20,
      copperKg: 10,
      aluminumKg: 25,
    },
    totalValue: 2100,
    notes: 'Full payment for credit #3',
    createdAt: new Date('2025-01-06'),
  },
  {
    id: '2',
    companyId: 'company-1',
    clientId: '2',
    clientName: 'Maria Santos',
    date: new Date('2025-01-09'),
    scrapDetails: {
      ironKg: 80,
      batteriesUnits: 10,
      copperKg: 5,
      aluminumKg: 0,
    },
    totalValue: 1200,
    notes: 'Partial payment',
    createdAt: new Date('2025-01-09'),
  },
  {
    id: '3',
    companyId: 'company-1',
    clientId: '1',
    clientName: 'Roberto Martinez',
    date: new Date('2025-01-11'),
    scrapDetails: {
      ironKg: 200,
      batteriesUnits: 0,
      copperKg: 15,
      aluminumKg: 30,
    },
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
export const scrapPrices = {
  ironPerKg: 0.5,
  batteriesPerUnit: 15,
  copperPerKg: 8,
  aluminumPerKg: 2,
}

export function calculateScrapValue(details: {
  ironKg: number
  batteriesUnits: number
  copperKg: number
  aluminumKg: number
}): number {
  return (
    details.ironKg * scrapPrices.ironPerKg +
    details.batteriesUnits * scrapPrices.batteriesPerUnit +
    details.copperKg * scrapPrices.copperPerKg +
    details.aluminumKg * scrapPrices.aluminumPerKg
  )
}
