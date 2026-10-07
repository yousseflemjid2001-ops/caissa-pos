import { Router, Request, Response } from 'express';
import { db } from '../db/inMemoryStore.js';
import { KridiCustomer } from '../types/index.js';

export const kridiRouter = Router();

// 1. Récupérer tous les clients crédits d'un commerce
kridiRouter.get('/', (req: Request, res: Response): any => {
  const tenantId = (req.query.tenantId as string) || db.tenants[0].id;
  const list = db.kridiCustomers.filter(c => c.tenantId === tenantId);
  const totalDebt = list.reduce((sum, c) => sum + c.currentDebt, 0);

  return res.json({
    customers: list,
    totalOutstandingDebt: totalDebt
  });
});

// 2. Créer un nouveau client Kridi
kridiRouter.post('/', (req: Request, res: Response): any => {
  const { tenantId, name, phone, creditLimit } = req.body;
  const targetTenantId = tenantId || db.tenants[0].id;

  if (!name || !phone) {
    return res.status(400).json({ error: "Le nom et le numéro de téléphone sont requis." });
  }

  const newCustomer: KridiCustomer = {
    id: `c-${Date.now()}`,
    tenantId: targetTenantId,
    name,
    phone,
    creditLimit: parseFloat(creditLimit || '200'),
    currentDebt: 0,
    lastPaymentDate: "Nouveau compte",
    status: 'bon'
  };

  db.kridiCustomers.push(newCustomer);

  return res.status(201).json({
    message: "Client ajouté au carnet de crédit.",
    customer: newCustomer
  });
});

// 3. Encaisser un remboursement (partiel ou total)
kridiRouter.post('/:id/pay', (req: Request, res: Response): any => {
  const { id } = req.params;
  const { amount } = req.body;
  const payVal = parseFloat(amount || '0');

  const customer = db.kridiCustomers.find(c => c.id === id);
  if (!customer) {
    return res.status(404).json({ error: "Client introuvable." });
  }

  customer.currentDebt = Math.max(0, customer.currentDebt - payVal);
  customer.lastPaymentDate = "Aujourd'hui";
  customer.status = customer.currentDebt === 0 ? 'bon' : (customer.currentDebt > customer.creditLimit * 0.8 ? 'alerte' : 'bon');

  return res.json({
    message: `Règlement de ${payVal.toFixed(0)} MRU enregistré avec succès !`,
    customer,
    remainingDebt: customer.currentDebt,
    status: customer.status
  });
});

// 4. Ajouter un crédit à un client
kridiRouter.post('/:id/add-debt', (req: Request, res: Response): any => {
  const { id } = req.params;
  const { amount } = req.body;
  const addVal = parseFloat(amount || '0');

  const customer = db.kridiCustomers.find(c => c.id === id);
  if (!customer) {
    return res.status(404).json({ error: "Client introuvable." });
  }

  if (customer.currentDebt + addVal > customer.creditLimit) {
    return res.status(400).json({
      error: `Dépassement de plafond ! Plafond: ${customer.creditLimit} MRU, Dette après achat: ${(customer.currentDebt + addVal).toFixed(0)} MRU.`
    });
  }

  customer.currentDebt += addVal;
  customer.status = customer.currentDebt > customer.creditLimit * 0.8 ? 'alerte' : 'bon';

  return res.json({
    message: "Achat à crédit enregistré.",
    customer
  });
});
