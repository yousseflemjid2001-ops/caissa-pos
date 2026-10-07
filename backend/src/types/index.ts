export type BusinessSector = 'restaurant' | 'market' | 'parapharmacie' | 'autre';

export type UserRole = 'OWNER' | 'MANAGER' | 'CASHIER' | 'WAITER';

export interface Tenant {
  id: string;
  businessName: string;
  sector: BusinessSector;
  phone: string;
  email: string;
  currency: string;
  subscriptionPlan: 'TRIAL_15_DAYS' | 'ACTIVE_PAID' | 'EXPIRED';
  trialEndsAt: string;
  subscriptionExpiresAt: string;
  createdAt: string;
}

export interface User {
  id: string;
  tenantId: string;
  fullName: string;
  email?: string;
  pinCode: string;
  role: UserRole;
  isActive: boolean;
}

export interface Subscription {
  id: string;
  tenantId: string;
  durationDays: number;
  amountPaid: number;
  paymentGateway: 'BANKILY' | 'MASRVI' | 'SEDADD' | 'KONNECT' | 'FLOUCI' | 'CARTE_BANCAIRE' | 'GRATUIT';
  transactionId: string;
  startsAt: string;
  expiresAt: string;
  status: 'ACTIVE' | 'EXPIRED';
}

export interface Product {
  id: string;
  tenantId: string;
  name: string;
  nameAr?: string;
  category: string;
  brand?: string;
  price: number;
  costPrice: number;
  barcode: string;
  stock: number;
  isWeighted?: boolean;
  unit?: string;
  sector: 'restaurant' | 'market';
  image: string;
  hasNoBarcode?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  weightInKg?: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  tenantId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discountPercent?: number;
  discountAmount: number;
  deliveryFee?: number;
  total: number;
  paymentMethod: 'ESPECES' | 'BANKILY' | 'MASRVI' | 'KRIDI' | 'CARTE' | 'CARTE_TPE';
  paymentReference?: string;
  cashGiven?: number;
  changeDue?: number;
  tableNumber?: string;
  orderType?: 'SUR_PLACE' | 'A_EMPORTER' | 'LIVRAISON';
  deliveryAddress?: string;
  deliveryPhone?: string;
  splitCount?: number;
  kridiCustomerId?: string;
  customerName?: string;
  cashierName?: string;
  createdAt: string;
}

export interface KridiCustomer {
  id: string;
  tenantId: string;
  name: string;
  phone: string;
  nni?: string;
  address?: string;
  creditLimit: number;
  currentDebt: number;
  lastPaymentDate: string;
  status: 'bon' | 'alerte' | 'critique';
}

export interface KitchenOrder {
  id: string;
  tenantId?: string;
  orderId?: string;
  tableNumber: string;
  time: string;
  items: { name: string; quantity: number; notes?: string }[];
  status: 'en_attente' | 'en_preparation' | 'pret';
}

export interface CashMovement {
  id: string;
  tenantId: string;
  type: 'FLOAT_OPEN' | 'IN' | 'OUT';
  amount: number;
  reason: string;
  cashierName: string;
  createdAt: string;
}

export interface DailyZReport {
  id?: string;
  tenantId?: string;
  tenantName: string;
  nif: string;
  city: string;
  date: string;
  ordersCount: number;
  totalSales: number;
  totalCash: number;
  totalBankily: number;
  totalMasrvi: number;
  totalKridi: number;
  averageTicket: number;
  generatedAt: string;
}
