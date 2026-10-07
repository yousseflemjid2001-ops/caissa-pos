import { Router, Request, Response } from 'express';
import { db } from '../db/inMemoryStore.js';
import { Subscription } from '../types/index.js';

export const subscriptionRouter = Router();

// 1. Liste des offres et forfaits d'abonnement (Mauritanie MRU)
subscriptionRouter.get('/plans', (_req: Request, res: Response): any => {
  const plans = [
    {
      id: 'plan-30',
      name: 'Découverte (1 Mois)',
      durationDays: 30,
      pricePerDay: 15.0,
      originalTotal: 450,
      totalPrice: 450,
      discountPercent: 0,
      badge: null,
      popular: false,
      features: [
        'Accès complet Caisse POS (Resto & Market)',
        'Mode Hors-Ligne 100% garanti (IndexedDB)',
        'Gestion de Stock & Produits illimités',
        'Support technique WhatsApp Mauritanie'
      ]
    },
    {
      id: 'plan-90',
      name: 'Trimestriel (3 Mois)',
      durationDays: 90,
      pricePerDay: 13.5,
      originalTotal: 1350,
      totalPrice: 1215,
      discountPercent: 10,
      badge: 'Populaire 🔥',
      popular: true,
      features: [
        'Toutes les fonctionnalités Caisse POS',
        'Carnet de Crédit Kridi & Alertes WhatsApp',
        'Clôture Journalière (Rapport Z officiel)',
        'Gestion multi-caissiers avec codes PIN',
        'Assistant IA Copilot & Analyse financière'
      ]
    },
    {
      id: 'plan-180',
      name: 'Semestriel (6 Mois)',
      durationDays: 180,
      pricePerDay: 10.5,
      originalTotal: 2700,
      totalPrice: 1890,
      discountPercent: 30,
      badge: 'Économique 💰',
      popular: false,
      features: [
        'Toutes les options du pack Trimestriel',
        'Synchronisation Cloud PostgreSQL automatique',
        'Gestion multi-postes de caisse & rayons',
        'Support téléphonique & WhatsApp prioritaire 7j/7'
      ]
    },
    {
      id: 'plan-365',
      name: 'Annuel - Sérénité (1 An)',
      durationDays: 365,
      pricePerDay: 7.5,
      originalTotal: 5475,
      totalPrice: 2738,
      discountPercent: 50,
      badge: 'Meilleure Offre ⭐ (-50%)',
      popular: false,
      bestValue: true,
      features: [
        'Remise massive de 50% sur l\'année entière',
        'Accès illimité à vie aux futures mises à jour',
        'Multi-établissements & Tableaux de bord avancés',
        'Formation sur place ou à distance de votre équipe',
        'Garantie Zéro Perte de données'
      ]
    }
  ];

  return res.json({
    status: 'SUCCESS',
    currency: 'MRU',
    supportedPaymentGateways: [
      { id: 'BANKILY', name: 'Bankily (BPM)', popular: true },
      { id: 'MASRVI', name: 'Masrvi (BIM)', popular: true },
      { id: 'SEDAD', name: 'Sedad (BMCI)' },
      { id: 'CLICK', name: 'Bimbank Click' },
      { id: 'ESPECES', name: 'Espèces en agence / Dépôt' }
    ],
    plans
  });
});

// Calculateur dynamique de prix selon la durée choisie (Mauritanie MRU)
subscriptionRouter.get('/calculate-price', (req: Request, res: Response): any => {
  const days = parseInt(req.query.days as string) || 90;

  let discountPercent = 0;
  let pricePerDay = 15; // 15 MRU/jour

  if (days >= 365) {
    discountPercent = 50;
    pricePerDay = 7.5; // 7.5 MRU / jour en annuel
  } else if (days >= 180) {
    discountPercent = 40;
    pricePerDay = 8.5;
  } else if (days >= 90) {
    discountPercent = 33;
    pricePerDay = 10.0;
  }

  const originalTotal = days * 15;
  const finalTotal = days * pricePerDay;

  return res.json({
    days,
    pricePerDay,
    discountPercent,
    originalTotal: Math.round(originalTotal),
    finalTotal: Math.round(finalTotal),
    currency: 'MRU'
  });
});

// Souscription / Paiement d'abonnement
subscriptionRouter.post('/checkout', (req: Request, res: Response): any => {
  const { tenantId, days, paymentGateway } = req.body;
  const targetTenantId = tenantId || db.tenants[0].id;
  const duration = parseInt(days) || 90;

  const tenant = db.tenants.find(t => t.id === targetTenantId);
  if (!tenant) {
    return res.status(404).json({ error: "Établissement introuvable." });
  }

  let pricePerDay = 15;
  if (duration >= 365) pricePerDay = 7.5;
  else if (duration >= 180) pricePerDay = 8.5;
  else if (duration >= 90) pricePerDay = 10.0;

  const amountPaid = Math.round(duration * pricePerDay);
  const now = new Date();
  const startsAt = now.toISOString();
  const expiresAt = new Date(now.getTime() + duration * 86400000).toISOString();

  const newSub: Subscription = {
    id: `sub-${Date.now()}`,
    tenantId: targetTenantId,
    durationDays: duration,
    amountPaid,
    paymentGateway: paymentGateway || 'KONNECT',
    transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
    startsAt,
    expiresAt,
    status: 'ACTIVE'
  };

  db.subscriptions.push(newSub);
  tenant.subscriptionPlan = 'ACTIVE_PAID';
  tenant.subscriptionExpiresAt = expiresAt;

  return res.status(201).json({
    message: `Abonnement de ${duration} jours activé avec succès !`,
    subscription: newSub,
    tenantStatus: tenant.subscriptionPlan,
    expiresAt: tenant.subscriptionExpiresAt
  });
});

// Statut actuel de l'abonnement
subscriptionRouter.get('/status', (req: Request, res: Response): any => {
  const tenantId = (req.query.tenantId as string) || db.tenants[0].id;
  const tenant = db.tenants.find(t => t.id === tenantId);

  if (!tenant) {
    return res.status(404).json({ error: "Établissement introuvable." });
  }

  const isExpired = new Date(tenant.subscriptionExpiresAt).getTime() < Date.now();

  return res.json({
    tenantId: tenant.id,
    businessName: tenant.businessName,
    plan: tenant.subscriptionPlan,
    isExpired,
    expiresAt: tenant.subscriptionExpiresAt,
    daysRemaining: Math.max(0, Math.ceil((new Date(tenant.subscriptionExpiresAt).getTime() - Date.now()) / 86400000))
  });
});
