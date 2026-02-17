// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}

// Origin types (Zonas)
export interface Origin {
  id: string | number
  companyId: string | number
  name: string
  description: string
  createdAt: string | Date
  updatedAt?: string | Date
}

export interface OriginsResponse {
  origins: Origin[]
  total: number
  page: number
  limit: number
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
  id: string | number
  companyId: string | number
  ownerName: string // Nombre del dueño/gerente
  businessName: string // Nombre del local/negocio (nombre comercial)
  dni: string // Identificador de cliente
  ruc: string // Identificador de negocio
  photo?: string | null // Foto del local
  phone: string
  email: string
  address: string
  origin: string // Zona de procedencia
  notes: string
  currentDebt: number
  createdAt: string | Date
  updatedAt?: string | Date
}

export interface ClientsResponse {
  clients: Client[]
  total: number
  page: number
  limit: number
}

export interface ScrapType {
  id: string
  companyId: string | number
  name: string
  description: string
  unitMeasure: 'kg' | 'und'
  createdAt: string | Date
  updatedAt?: string | Date
}

export interface ScrapsResponse {
  scraps: ScrapType[]
  total: number
  page: number
  limit: number
}

// Credit types
export interface CreditItem {
  description: string
  price: number
}

export interface Credit {
  id: string | number
  companyId: string | number
  clientId: string | number
  clientName: string
  clientOrigin: string // Zona de procedencia del cliente
  date: string | Date
  items: CreditItem[]
  amount: number // Total amount (sum of items)
  status: 'pending' | 'partial' | 'paid'
  notes: string
  createdAt: string | Date
  updatedAt?: string | Date
}

export interface CreditsResponse {
  credits: Credit[]
  total: number
  page: number
  limit: number
}

// Scrap Payment types
export interface ScrapItem {
  scrapId: string | number
  scrapName: string
  amount: number // Monetary value
  quantity: number
}

export interface ScrapPayment {
  id: string | number
  companyId: string | number
  clientId: string | number
  clientName: string
  clientOrigin: string
  date: string | Date
  items: ScrapItem[]
  totalValue: number
  quantity?: number
  notes: string
  createdAt: string | Date
  updatedAt?: string | Date
}

export interface PaymentsResponse {
  payments: ScrapPayment[]
  total: number
  page: number
  limit: number
}

// Dashboard types
export interface DashboardStats {
  totalActiveClients: number
  totalCreditExtended: number
  totalScrapPaymentsReceived: number
  totalPendingDebt: number
}

export interface MonthlyOverviewItem {
  month: string
  credits: number
  payments: number
}

export interface MonthlyOverviewResponse {
  data: MonthlyOverviewItem[]
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

export interface ScrapCollectionItem {
  scrapId: number
  scrapName: string
  unitMeasure: string
  totalQuantity: number
}

export interface ScrapCollectionResponse {
  period: {
    startDate: string
    endDate: string
  }
  data: ScrapCollectionItem[]
}
