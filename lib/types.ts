// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Origin types (Lugares de procedencia)
export interface Origin {
  id: string
  companyId: string
  name: string
  description: string
  createdAt: string | Date
}

// User and Company types
export interface Company {
  id: string
  name: string
  createdAt: string | Date
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
  ownerName: string // Nombre del dueño/gerente
  dni: string // Identificador de cliente
  ruc: string // Identificador de negocio
  businessName: string // Nombre del local/negocio (nombre comercial)
  photoUrl?: string // Foto del local
  phone: string
  email: string
  address: string
  origin: string // Lugar de procedencia
  notes: string
  currentDebt: number
  createdAt: string | Date
}

// Scrap Type (Tipos de Chatarra)
export interface ScrapType {
  id: string
  companyId: string
  name: string
  description: string
  createdAt: string | Date
}

// Credit types
export interface CreditItem {
  description: string
  price: number
}

export interface Credit {
  id: string
  companyId: string
  clientId: string
  clientName: string
  clientOrigin: string // Lugar de procedencia del cliente
  date: string | Date
  items: CreditItem[]
  amount: number // Total amount (sum of items)
  status: 'pending' | 'partial' | 'paid'
  notes: string
  createdAt: string | Date
}

// Scrap Payment types
export interface ScrapItem {
  scrapId: string
  scrapName: string
  amount: number // Monetary value
}

export interface ScrapPayment {
  id: string
  companyId: string
  clientId: string
  clientName: string
  clientOrigin: string
  date: string | Date
  items: ScrapItem[]
  totalValue: number
  notes: string
  createdAt: string | Date
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
  date: string | Date
}
