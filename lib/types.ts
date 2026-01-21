// Origin types (Lugares de procedencia)
export interface Origin {
  id: string
  companyId: string
  name: string
  description: string
  createdAt: Date
}

// User and Company types
export interface Company {
  id: string
  name: string
  createdAt: Date
}

export interface User {
  id: string
  email: string
  name: string
  companyId: string
  company: Company
  avatar?: string
}

// Client types
export interface Client {
  id: string
  companyId: string
  name: string
  phone: string
  email: string
  address: string
  origin: string // Lugar de procedencia
  notes: string
  currentDebt: number
  createdAt: Date
}

// Scrap Type (Tipos de Chatarra)
export interface ScrapType {
  id: string
  companyId: string
  name: string
  description: string
  createdAt: Date
}

// Credit types
export interface Credit {
  id: string
  companyId: string
  clientId: string
  clientName: string
  clientOrigin: string // Lugar de procedencia del cliente
  date: Date
  productDescription: string
  amount: number
  status: 'pending' | 'partial' | 'paid'
  notes: string
  createdAt: Date
}

// Scrap Payment types
export interface ScrapDetails {
  ironKg: number
  batteriesUnits: number
  copperKg: number
  aluminumKg: number
}

export interface ScrapPayment {
  id: string
  companyId: string
  clientId: string
  clientName: string
  clientOrigin: string
  date: Date
  scrapDetails: ScrapDetails
  totalValue: number
  notes: string
  createdAt: Date
}

// Dashboard stats
export interface DashboardStats {
  totalActiveClients: number
  totalCreditExtended: number
  totalScrapPaymentsReceived: number
  totalPendingDebt: number
}

// Activity types
export interface RecentActivity {
  id: string
  type: 'credit' | 'payment'
  clientName: string
  description: string
  amount: number
  date: Date
}
