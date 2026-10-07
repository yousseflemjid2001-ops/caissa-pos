import { Router, Request, Response } from 'express';
import { db } from '../db/inMemoryStore.js';
import { Order, OrderItem, KitchenOrder, DailyZReport } from '../types/index.js';
import { query, isPostgresConnected } from '../db/postgres.js';

export const orderRouter = Router();

// 1. Créer et encaisser une commande POS
orderRouter.post('/checkout', async (req: Request, res: Response): Promise<any> => {
  const { 
    tenantId, 
    items, 
    discountPercent, 
    paymentMethod, 
    cashGiven, 
    tableNumber, 
    kridiCustomerId,
    orderType,
    deliveryAddress,
    deliveryPhone,
    deliveryFee,
    splitCount
  } = req.body;
  const targetTenantId = tenantId || db.tenants[0].id;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Le panier de commande est vide." });
  }

  // Calculs financiers
  let subtotal = 0;
  const processedItems: OrderItem[] = [];

  for (const item of items) {
    const product = db.products.find(p => p.id === item.productId);
    const unitPrice = product ? product.price : parseFloat(item.price || '0');
    const qty = item.quantity || 1;
    const weight = item.weightInKg ? parseFloat(item.weightInKg) : undefined;
    const itemTotal = weight ? unitPrice * weight : unitPrice * qty;

    subtotal += itemTotal;

    // Déduction automatique du stock en temps réel
    if (product) {
      product.stock = Math.max(0, product.stock - (weight ? Math.ceil(weight) : qty));
    }

    processedItems.push({
      productId: item.productId,
      productName: product ? product.name : (item.name || 'Article'),
      quantity: qty,
      weightInKg: weight,
      unitPrice,
      totalPrice: itemTotal,
      notes: item.notes || undefined
    });
  }

  const discountRate = parseFloat(discountPercent || '0');
  const discountAmount = (subtotal * discountRate) / 100;
  const fee = parseFloat(deliveryFee || '0');
  const total = Math.max(0, subtotal - discountAmount + fee);
  const cash = cashGiven ? parseFloat(cashGiven) : total;
  const changeDue = cash > total ? cash - total : 0;

  const orderNumber = `CMD-${Math.floor(1000 + Math.random() * 9000)}`;

  // Si paiement en Kridi (crédit client), ajouter la dette au client
  if (paymentMethod === 'KRIDI' && kridiCustomerId) {
    const customer = db.kridiCustomers.find(c => c.id === kridiCustomerId);
    if (customer) {
      customer.currentDebt += total;
      customer.status = customer.currentDebt > customer.creditLimit * 0.8 ? 'alerte' : 'bon';
    }
  }

  const newOrder: Order = {
    id: `order-${Date.now()}`,
    tenantId: targetTenantId,
    orderNumber,
    items: processedItems,
    subtotal,
    discountAmount,
    total,
    paymentMethod: paymentMethod || 'ESPECES',
    cashGiven: paymentMethod === 'ESPECES' ? cash : undefined,
    changeDue: paymentMethod === 'ESPECES' ? changeDue : undefined,
    tableNumber,
    orderType: orderType || (tableNumber ? 'SUR_PLACE' : 'A_EMPORTER'),
    deliveryAddress,
    deliveryPhone,
    deliveryFee: fee > 0 ? fee : undefined,
    splitCount: splitCount ? parseInt(splitCount) : undefined,
    kridiCustomerId,
    createdAt: new Date().toISOString()
  };

  db.orders.unshift(newOrder);

  // Si c'est de la restauration (ou commande avec table), injecter automatiquement un bon KDS en cuisine !
  const restaurantItems = processedItems.filter(it => {
    const p = db.products.find(prod => prod.id === it.productId);
    return p ? p.sector === 'restaurant' : true;
  });

  if (restaurantItems.length > 0 || tableNumber || orderType === 'LIVRAISON') {
    const tableLabel = orderType === 'LIVRAISON'
      ? `Livraison (${deliveryPhone || 'Tél'})`
      : orderType === 'A_EMPORTER'
        ? `À Emporter #${orderNumber}`
        : (tableNumber || `Comptoir #${orderNumber}`);

    const kdsOrder: KitchenOrder = {
      id: `KDS-${Math.floor(100 + Math.random() * 900)}`,
      tenantId: targetTenantId,
      tableNumber: tableLabel,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      status: 'en_attente',
      items: (restaurantItems.length > 0 ? restaurantItems : processedItems).map(it => ({
        name: it.productName,
        quantity: it.quantity,
        notes: it.notes
      }))
    };
    db.kitchenOrders.unshift(kdsOrder);
  }

  // Persistance dans Neon PostgreSQL Cloud si connecté
  if (isPostgresConnected()) {
    try {
      await query(`
        INSERT INTO orders (
          id, tenant_id, cashier_name, total, subtotal, discount_percent, discount_amount,
          payment_method, cash_given, change_due, table_number, order_type,
          delivery_address, delivery_phone, delivery_fee, kridi_customer_id, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        ON CONFLICT (id) DO NOTHING
      `, [
        newOrder.id, newOrder.tenantId, newOrder.cashierName, newOrder.total, newOrder.subtotal,
        newOrder.discountPercent, newOrder.discountAmount, newOrder.paymentMethod,
        newOrder.cashGiven || 0, newOrder.changeDue || 0, newOrder.tableNumber || null,
        newOrder.orderType, newOrder.deliveryAddress || null, newOrder.deliveryPhone || null,
        newOrder.deliveryFee || 0, newOrder.kridiCustomerId || null, newOrder.createdAt
      ]);

      for (const it of processedItems) {
        // Si l'ID produit est un article custom (non répertorié) ou hors catalogue, on met NULL
        const safeProductId = (it.productId && !it.productId.startsWith('custom-')) ? it.productId : null;
        await query(`
          INSERT INTO order_items (id, order_id, product_id, product_name, unit_price, quantity, weight_in_kg, total_line, notes)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        `, [
          `item-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          newOrder.id, safeProductId, it.productName, it.unitPrice, it.quantity,
          it.weightInKg || null, it.totalPrice, it.notes || null
        ]);
      }
      console.log(`✅ Commande #${newOrder.orderNumber} (${newOrder.total} MRU) sauvegardée dans Neon PostgreSQL !`);
    } catch (dbErr: any) {
      console.warn('⚠️ Erreur écriture commande Neon DB :', dbErr.message);
    }
  }

  return res.status(201).json({
    message: "Commande enregistrée et transmise en cuisine avec succès !",
    order: newOrder,
    cloudSync: isPostgresConnected()
  });
});

// 2. Récupérer l'historique des ventes
orderRouter.get('/', (req: Request, res: Response): any => {
  const tenantId = (req.query.tenantId as string) || db.tenants[0].id;
  const list = db.orders.filter(o => o.tenantId === tenantId);
  const totalSalesAmount = list.reduce((sum, o) => sum + o.total, 0);

  return res.json({
    orders: list,
    count: list.length,
    totalSalesAmount
  });
});

// 3. Récupérer les bons de cuisine (KDS)
orderRouter.get('/kds', (req: Request, res: Response): any => {
  const tenantId = (req.query.tenantId as string) || db.tenants[0].id;
  const kdsList = db.kitchenOrders.filter(k => k.tenantId === tenantId);
  return res.json({ kitchenOrders: kdsList });
});

// 4. Mettre à jour le statut d'un bon de cuisine (en_attente -> en_preparation -> pret)
orderRouter.patch('/kds/:id/status', (req: Request, res: Response): any => {
  const { id } = req.params;
  const { status } = req.body;

  const order = db.kitchenOrders.find(k => k.id === id);
  if (!order) {
    return res.status(404).json({ error: "Bon de commande cuisine introuvable." });
  }

  order.status = status;
  return res.json({ message: "Statut cuisine mis à jour avec succès.", order });
});

// 5. Clôture de Caisse Journalière (Rapport Z de caisse) avec Fond de Caisse Réel
orderRouter.get('/daily-z-report', (req: Request, res: Response): any => {
  const tenantId = (req.query.tenantId as string) || db.tenants[0].id;
  const tenant = db.tenants.find(t => t.id === tenantId);
  const todayOrders = db.orders.filter(o => o.tenantId === tenantId);

  const totalSales = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const totalCash = todayOrders.filter(o => o.paymentMethod === 'ESPECES').reduce((sum, o) => sum + o.total, 0);
  const totalBankily = todayOrders.filter(o => o.paymentMethod === 'BANKILY').reduce((sum, o) => sum + o.total, 0);
  const totalMasrvi = todayOrders.filter(o => o.paymentMethod === 'MASRVI').reduce((sum, o) => sum + o.total, 0);
  const totalCard = todayOrders.filter(o => o.paymentMethod === 'CARTE_TPE' || o.paymentMethod === 'CARTE').reduce((sum, o) => sum + o.total, 0);
  const totalKridi = todayOrders.filter(o => o.paymentMethod === 'KRIDI').reduce((sum, o) => sum + o.total, 0);
  const totalDiscounts = todayOrders.reduce((sum, o) => sum + o.discountAmount, 0);
  const averageTicket = todayOrders.length > 0 ? totalSales / todayOrders.length : 0;

  // Réconciliation du tiroir caisse
  const movements = db.cashMovements.filter(m => m.tenantId === tenantId);
  const openingFloat = movements.filter(m => m.type === 'FLOAT_OPEN').reduce((sum, m) => sum + m.amount, 0);
  const cashIn = movements.filter(m => m.type === 'IN').reduce((sum, m) => sum + m.amount, 0);
  const cashOut = movements.filter(m => m.type === 'OUT').reduce((sum, m) => sum + m.amount, 0);
  const expectedDrawerCash = openingFloat + totalCash + cashIn - cashOut;

  const report = {
    date: new Date().toLocaleDateString('fr-TN'),
    tenantName: tenant ? tenant.businessName : 'Caisse Principale (Nouakchott)',
    city: 'Tevragh-Zeina, Nouakchott',
    nif: 'NIF 12048592/RIM',
    totalSales,
    ordersCount: todayOrders.length,
    openingFloat,
    cashIn,
    cashOut,
    expectedDrawerCash,
    totalCash,
    totalBankily,
    totalMasrvi,
    totalCard,
    totalKridi,
    averageTicket,
    totalDiscounts,
    generatedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
  };

  return res.json({ report });
});

// 5b. Mouvements de caisse (Fond de caisse, Dépenses imprévues, Apport espèces)
orderRouter.post('/cash-movement', (req: Request, res: Response): any => {
  const { tenantId, type, amount, reason, cashierName } = req.body;
  const targetTenantId = tenantId || db.tenants[0].id;

  if (!amount || isNaN(parseFloat(amount))) {
    return res.status(400).json({ error: "Le montant est obligatoire." });
  }

  const newMovement = {
    id: `cm-${Date.now()}`,
    tenantId: targetTenantId,
    type: type || 'OUT',
    amount: parseFloat(amount),
    reason: reason || (type === 'FLOAT_OPEN' ? 'Fond de caisse initial' : type === 'IN' ? 'Entrée d\'espèces' : 'Sortie d\'espèces'),
    cashierName: cashierName || 'Caissier',
    createdAt: new Date().toISOString()
  };

  db.cashMovements.push(newMovement);

  return res.status(201).json({
    message: "Mouvement de caisse enregistré avec succès.",
    movement: newMovement
  });
});

orderRouter.get('/cash-movements', (req: Request, res: Response): any => {
  const tenantId = (req.query.tenantId as string) || db.tenants[0].id;
  const list = db.cashMovements.filter(m => m.tenantId === tenantId);
  return res.json({ cashMovements: list });
});

// 6. Tableau de bord Financier & Marges (Net Profit & Analytics)
orderRouter.get('/analytics', (req: Request, res: Response): any => {
  const tenantId = (req.query.tenantId as string) || db.tenants[0].id;
  const orders = db.orders.filter(o => o.tenantId === tenantId);

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);

  // Calcul du coût de revient des marchandises vendues (COGS)
  let totalCost = 0;
  const productSalesMap: { [id: string]: { name: string; quantity: number; revenue: number } } = {};

  for (const order of orders) {
    for (const item of order.items) {
      const prod = db.products.find(p => p.id === item.productId);
      const unitCost = prod ? prod.costPrice : item.unitPrice * 0.6; // Estimation 60% si non renseigné
      const qty = item.quantity || 1;
      const weight = item.weightInKg ? item.weightInKg : undefined;
      const itemCost = weight ? unitCost * weight : unitCost * qty;
      totalCost += itemCost;

      // Agrégation top produits
      const key = item.productId || item.productName;
      if (!productSalesMap[key]) {
        productSalesMap[key] = {
          name: item.productName,
          quantity: 0,
          revenue: 0
        };
      }
      productSalesMap[key].quantity += (weight || qty);
      productSalesMap[key].revenue += item.totalPrice;
    }
  }

  const netProfit = Math.max(0, totalSales - totalCost);
  const marginPercentage = totalSales > 0 ? (netProfit / totalSales) * 100 : 0;
  const averageTicket = orders.length > 0 ? totalSales / orders.length : 0;

  // Répartition par mode de paiement
  const paymentBreakdown = {
    ESPECES: {
      amount: orders.filter(o => o.paymentMethod === 'ESPECES').reduce((sum, o) => sum + o.total, 0),
      count: orders.filter(o => o.paymentMethod === 'ESPECES').length
    },
    BANKILY: {
      amount: orders.filter(o => o.paymentMethod === 'BANKILY').reduce((sum, o) => sum + o.total, 0),
      count: orders.filter(o => o.paymentMethod === 'BANKILY').length
    },
    MASRVI: {
      amount: orders.filter(o => o.paymentMethod === 'MASRVI').reduce((sum, o) => sum + o.total, 0),
      count: orders.filter(o => o.paymentMethod === 'MASRVI').length
    },
    CARTE_TPE: {
      amount: orders.filter(o => o.paymentMethod === 'CARTE_TPE' || o.paymentMethod === 'CARTE').reduce((sum, o) => sum + o.total, 0),
      count: orders.filter(o => o.paymentMethod === 'CARTE_TPE' || o.paymentMethod === 'CARTE').length
    },
    KRIDI: {
      amount: orders.filter(o => o.paymentMethod === 'KRIDI').reduce((sum, o) => sum + o.total, 0),
      count: orders.filter(o => o.paymentMethod === 'KRIDI').length
    }
  };

  const topProducts = Object.values(productSalesMap)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 6);

  return res.json({
    totalSales,
    totalCost: Math.round(totalCost),
    netProfit: Math.round(netProfit),
    marginPercentage: parseFloat(marginPercentage.toFixed(1)),
    ordersCount: orders.length,
    averageTicket: Math.round(averageTicket),
    paymentBreakdown,
    topProducts,
    currency: 'MRU'
  });
});

