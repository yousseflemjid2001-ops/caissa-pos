import type { Product, KridiCustomer } from '../data/mockData';

const API_BASE_URL = (import.meta as any).env?.VITE_API_BASE_URL || 'http://localhost:4000/api';

// Vérification de la connectivité Backend
export async function checkBackendStatus(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
    return res.ok;
  } catch (err) {
    console.warn('Backend injoignable, passage en mode autonome/hors-ligne :', err);
    return false;
  }
}

// 1. PRODUITS & STOCKS
export async function getProductsApi(sector?: string): Promise<Product[]> {
  try {
    const url = sector ? `${API_BASE_URL}/products?sector=${sector}` : `${API_BASE_URL}/products`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Erreur API Produits');
    const data = await res.json();
    return data.products;
  } catch (error) {
    console.warn('Échec getProductsApi, utilisation du fallback local');
    throw error;
  }
}

export async function createProductApi(productPayload: Partial<Product>) {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productPayload)
  });
  if (!res.ok) throw new Error('Erreur création produit');
  return await res.json();
}

export async function updateProductApi(id: string, productPayload: Partial<Product>) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productPayload)
  });
  if (!res.ok) throw new Error('Erreur mise à jour produit');
  return await res.json();
}

export async function deleteProductApi(id: string) {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Erreur suppression produit');
  return await res.json();
}

export async function adjustProductStockApi(id: string, deltaQuantity: number) {
  const res = await fetch(`${API_BASE_URL}/products/${id}/stock`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deltaQuantity })
  });
  if (!res.ok) throw new Error('Erreur ajustement stock');
  return await res.json();
}

// 2. ENCAISSEMENT & HISTORIQUE DES VENTES
export async function getOrdersApi() {
  const res = await fetch(`${API_BASE_URL}/orders`);
  if (!res.ok) throw new Error('Erreur historique des ventes');
  return await res.json();
}

export async function getAnalyticsApi() {
  const res = await fetch(`${API_BASE_URL}/orders/analytics`);
  if (!res.ok) throw new Error('Erreur analyse financière');
  return await res.json();
}

export async function checkoutOrderApi(orderPayload: {
  items: { productId: string; quantity: number; weightInKg?: number; notes?: string }[];
  paymentMethod: string;
  cashGiven?: number;
  discountPercent?: number;
  tableNumber?: string;
  orderType?: 'SUR_PLACE' | 'A_EMPORTER' | 'LIVRAISON';
  deliveryAddress?: string;
  deliveryPhone?: string;
  deliveryFee?: number;
  splitCount?: number;
  kridiCustomerId?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/orders/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(orderPayload)
  });
  if (!res.ok) throw new Error('Erreur encaissement');
  return await res.json();
}

// 2b. MOUVEMENTS DE CAISSE (Fond de caisse, Dépenses)
export async function createCashMovementApi(payload: {
  type: 'FLOAT_OPEN' | 'IN' | 'OUT';
  amount: number;
  reason: string;
  cashierName?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/orders/cash-movement`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Erreur enregistrement mouvement de caisse');
  return await res.json();
}

export async function getCashMovementsApi() {
  const res = await fetch(`${API_BASE_URL}/orders/cash-movements`);
  if (!res.ok) throw new Error('Erreur chargement mouvements de caisse');
  return await res.json();
}

// 2b. GESTION DES CAISSIERS ET CODE PIN
export async function loginPinApi(pinCode: string) {
  const res = await fetch(`${API_BASE_URL}/auth/login-pin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pinCode })
  });
  if (!res.ok) throw new Error('Code PIN invalide');
  return await res.json();
}

export async function getCashiersApi() {
  const res = await fetch(`${API_BASE_URL}/auth/users`);
  if (!res.ok) throw new Error('Erreur chargement des caissiers');
  return await res.json();
}

// 3. CUISINE KDS (Kitchen Display System)
export async function getKdsOrdersApi() {
  const res = await fetch(`${API_BASE_URL}/orders/kds`);
  if (!res.ok) throw new Error('Erreur récupération KDS');
  return await res.json();
}

export async function updateKdsStatusApi(orderId: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/orders/kds/${orderId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });
  if (!res.ok) throw new Error('Erreur mise à jour KDS');
  return await res.json();
}

// 4. RAPPORT Z DE CLÔTURE DE CAISSE
export async function getDailyZReportApi() {
  const res = await fetch(`${API_BASE_URL}/orders/daily-z-report`);
  if (!res.ok) throw new Error('Erreur génération rapport Z');
  return await res.json();
}

// 5. CARNET DE CRÉDIT CLIENT (KRIDI)
export async function getKridiCustomersApi(): Promise<{ customers: KridiCustomer[]; totalOutstandingDebt: number }> {
  const res = await fetch(`${API_BASE_URL}/kridi`);
  if (!res.ok) throw new Error('Erreur API Kridi');
  return await res.json();
}

export async function createKridiCustomerApi(payload: { name: string; phone: string; creditLimit: number }) {
  const res = await fetch(`${API_BASE_URL}/kridi`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Erreur création client Kridi');
  return await res.json();
}

export async function payKridiDebtApi(customerId: string, amount: number) {
  const res = await fetch(`${API_BASE_URL}/kridi/${customerId}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount })
  });
  if (!res.ok) throw new Error('Erreur règlement Kridi');
  return await res.json();
}

// 6. AGENTS IA
export async function parseVoiceOrderApi(voiceTranscript: string) {
  const res = await fetch(`${API_BASE_URL}/ai/voice-order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ voiceTranscript })
  });
  if (!res.ok) throw new Error('Erreur API Vocale');
  return await res.json();
}

export async function scanOcrInvoiceApi() {
  const res = await fetch(`${API_BASE_URL}/ai/ocr-invoice`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error('Erreur API OCR');
  return await res.json();
}

export async function askCfoCopilotApi(question: string) {
  const res = await fetch(`${API_BASE_URL}/ai/cfo-chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question })
  });
  if (!res.ok) throw new Error('Erreur API CFO Copilot');
  return await res.json();
}

// 7. ABONNEMENTS ET INSCRIPTION
export async function registerTenantApi(formData: {
  businessName: string;
  sector: string;
  phone: string;
  email: string;
  ownerName?: string;
  pinCode?: string;
  restaurantType?: string;
  city?: string;
  tableCount?: number;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  if (!res.ok) throw new Error("Erreur lors de l'inscription");
  return await res.json();
}

export async function loginUserApi(credentials: {
  identifier: string;
  password?: string;
  pinCode?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  if (!res.ok) throw new Error("Erreur lors de la connexion");
  return await res.json();
}

export async function getSubscriptionPlansApi() {
  const res = await fetch(`${API_BASE_URL}/subscriptions/plans`);
  if (!res.ok) throw new Error("Erreur chargement des forfaits d'abonnement");
  return await res.json();
}

export async function subscribePlanApi(days: number, paymentGateway: string) {
  const res = await fetch(`${API_BASE_URL}/subscriptions/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ days, paymentGateway })
  });
  if (!res.ok) throw new Error("Erreur de paiement d'abonnement");
  return await res.json();
}

