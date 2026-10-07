import Dexie, { type Table } from 'dexie';
import type { Product, KridiCustomer } from '../data/mockData';
import { checkoutOrderApi } from './api';

// Interface pour les commandes stockées localement en mode hors-ligne
export interface OfflineOrder {
  id: string;
  tenantId?: string;
  orderNumber: string;
  items: any[];
  total: number;
  subtotal: number;
  discountPercent?: number;
  paymentMethod: string;
  cashGiven?: number;
  changeDue?: number;
  tableNumber?: string;
  orderType?: string;
  deliveryAddress?: string;
  deliveryPhone?: string;
  deliveryFee?: number;
  splitCount?: number;
  kridiCustomerId?: string;
  customerName?: string;
  cashierName?: string;
  createdAt: string;
  synced: number; // 0 = en attente de synchro, 1 = synchronisé dans PostgreSQL
  syncedAt?: string;
}

// Classe de Base de Données IndexedDB Locale
export class CaissaOfflineDatabase extends Dexie {
  public products!: Table<Product, string>;
  public orders!: Table<OfflineOrder, string>;
  public customers!: Table<KridiCustomer, string>;

  constructor() {
    super('CaissaOfflineDB');
    this.version(1).stores({
      products: 'id, barcode, category, sector, name',
      orders: 'id, createdAt, synced, tableNumber, paymentMethod',
      customers: 'id, phone, name'
    });
  }
}

export const offlineDb = new CaissaOfflineDatabase();

// 1. Mise en cache locale des produits (pour que la caisse tourne sans Internet)
export async function cacheProductsLocally(productsList: Product[]): Promise<void> {
  try {
    if (!productsList || productsList.length === 0) return;
    await offlineDb.products.bulkPut(productsList);
    // console.log(`💾 ${productsList.length} articles synchronisés dans la base locale IndexedDB.`);
  } catch (err) {
    console.warn('Erreur mise en cache locale des articles :', err);
  }
}

// 2. Récupérer les articles depuis IndexedDB en cas de coupure Internet
export async function getOfflineProducts(sector?: string): Promise<Product[]> {
  try {
    let items = await offlineDb.products.toArray();
    if (sector) {
      items = items.filter(p => p.sector === sector);
    }
    return items;
  } catch (err) {
    console.warn('Erreur lecture IndexedDB :', err);
    return [];
  }
}

// 3. Enregistrer un ticket en local (garantit qu'aucun ticket n'est perdu)
export async function saveOrderLocally(orderData: any, isAlreadySynced: boolean = false): Promise<OfflineOrder> {
  const offlineOrder: OfflineOrder = {
    id: orderData.orderId || `order-${Date.now()}`,
    orderNumber: orderData.orderId || `TICK-${Date.now().toString().slice(-4)}`,
    items: orderData.items || [],
    total: orderData.total || 0,
    subtotal: orderData.subtotal || orderData.total || 0,
    discountPercent: orderData.discountPercent || 0,
    paymentMethod: orderData.paymentMethod || 'ESPECES',
    cashGiven: orderData.cashGiven || 0,
    changeDue: orderData.changeDue || 0,
    tableNumber: orderData.tableNumber || null,
    orderType: orderData.orderType || 'SUR_PLACE',
    deliveryAddress: orderData.deliveryAddress,
    deliveryPhone: orderData.deliveryPhone,
    deliveryFee: orderData.deliveryFee || 0,
    splitCount: orderData.splitCount || 1,
    kridiCustomerId: orderData.kridiCustomerId,
    customerName: orderData.customerName,
    cashierName: orderData.cashierName || 'Caissier',
    createdAt: new Date().toISOString(),
    synced: isAlreadySynced ? 1 : 0,
    syncedAt: isAlreadySynced ? new Date().toISOString() : undefined
  };

  try {
    await offlineDb.orders.put(offlineOrder);
  } catch (err) {
    console.warn('Erreur sauvegarde IndexedDB du ticket :', err);
  }

  return offlineOrder;
}

// 4. Obtenir le nombre de commandes en attente de synchronisation
export async function getUnsyncedOrdersCount(): Promise<number> {
  try {
    return await offlineDb.orders.where('synced').equals(0).count();
  } catch {
    return 0;
  }
}

// 5. Récupérer toutes les commandes non synchronisées
export async function getUnsyncedOrders(): Promise<OfflineOrder[]> {
  try {
    return await offlineDb.orders.where('synced').equals(0).toArray();
  } catch {
    return [];
  }
}

// 6. Récupérer toutes les commandes locales
export async function getAllLocalOrders(): Promise<OfflineOrder[]> {
  try {
    return await offlineDb.orders.reverse().sortBy('createdAt');
  } catch {
    return [];
  }
}

// 7. Statistiques d'utilisation de la base locale IndexedDB
export async function getLocalDatabaseStats(): Promise<{
  productCount: number;
  totalOrders: number;
  unsyncedOrders: number;
  syncedOrders: number;
  estimatedSizeKb: number;
}> {
  try {
    const productCount = await offlineDb.products.count();
    const totalOrders = await offlineDb.orders.count();
    const unsyncedOrders = await offlineDb.orders.where('synced').equals(0).count();
    const syncedOrders = await offlineDb.orders.where('synced').equals(1).count();
    const estimatedSizeKb = Math.round((productCount * 0.4) + (totalOrders * 0.8));

    return {
      productCount,
      totalOrders,
      unsyncedOrders,
      syncedOrders,
      estimatedSizeKb
    };
  } catch {
    return {
      productCount: 0,
      totalOrders: 0,
      unsyncedOrders: 0,
      syncedOrders: 0,
      estimatedSizeKb: 0
    };
  }
}

// 8. Moteur de synchronisation automatique vers le Cloud
export async function syncOfflineOrdersToCloud(): Promise<{ syncedCount: number; errors: number }> {
  let syncedCount = 0;
  let errors = 0;

  try {
    const unsynced = await getUnsyncedOrders();
    if (unsynced.length === 0) return { syncedCount: 0, errors: 0 };

    console.log(`🔄 Démarrage de la synchronisation de ${unsynced.length} tickets hors-ligne vers le Cloud...`);

    for (const order of unsynced) {
      try {
        await checkoutOrderApi({
          items: order.items.map((it: any) => ({
            productId: it.product?.id || it.productId,
            quantity: it.quantity,
            weightInKg: it.weightInKg,
            notes: it.notes
          })),
          paymentMethod: order.paymentMethod,
          cashGiven: order.cashGiven,
          discountPercent: order.discountPercent,
          tableNumber: order.tableNumber,
          orderType: order.orderType as any,
          deliveryAddress: order.deliveryAddress,
          deliveryPhone: order.deliveryPhone,
          deliveryFee: order.deliveryFee,
          splitCount: order.splitCount,
          kridiCustomerId: order.kridiCustomerId
        });

        // Marquer comme synchronisé dans IndexedDB
        await offlineDb.orders.update(order.id, {
          synced: 1,
          syncedAt: new Date().toISOString()
        });

        syncedCount++;
      } catch (err) {
        errors++;
        console.warn(`Échec synchronisation ticket #${order.id} :`, err);
      }
    }

    if (syncedCount > 0) {
      console.log(`✅ ${syncedCount} tickets hors-ligne synchronisés avec succès vers le serveur.`);
    }

  } catch (err) {
    console.warn('Erreur générale lors de la synchronisation hors-ligne :', err);
  }

  return { syncedCount, errors };
}
