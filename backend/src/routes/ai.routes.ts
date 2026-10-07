import { Router, Request, Response } from 'express';
import { db } from '../db/inMemoryStore.js';

export const aiRouter = Router();

// AGENT 1: OCR Factures Grossistes & Bons de Livraison (Mauritanie)
aiRouter.post('/ocr-invoice', (req: Request, res: Response): any => {
  // Simulation de l'extraction Vision LLM / OCR
  const mockExtractedInvoice = {
    agent: "Agent 1 - OCR Ingestion (Mauritanie)",
    supplier: "ETS AL-BARAKA GROS (Marché 6ème, Nouakchott)",
    invoiceNumber: "BL-2026-449",
    date: new Date().toLocaleDateString('fr-TN'),
    detectedCurrency: "MRU",
    items: [
      { name: "Riz Mauritanien Sac 25kg", qty: 10, unitCost: 1100, total: 11000 },
      { name: "Huile Végétale Carton 12x1L", qty: 5, unitCost: 750, total: 3750 },
      { name: "Thé Vert Al-Warka Carton", qty: 4, unitCost: 600, total: 2400 },
      { name: "Sucre en Poudre Sac 50kg", qty: 6, unitCost: 1800, total: 10800 }
    ],
    totalAmount: 27950,
    confidenceScore: 0.99
  };

  return res.json({
    message: "Facture grossiste Nouakchott extraite avec succès par l'Agent IA.",
    invoice: mockExtractedInvoice,
    invoiceData: mockExtractedInvoice
  });
});

// AGENT 2: Parsing Commande Vocale (Arabe, Hassaniya & Français)
aiRouter.post('/voice-order', (req: Request, res: Response): any => {
  const { voiceTranscript } = req.body;
  const transcript = (voiceTranscript || '').toLowerCase();

  const recognizedItems: { productId?: string; productName: string; quantity: number }[] = [];

  if (transcript.includes('thieb') || transcript.includes('poisson') || transcript.includes('ceebu') || transcript.includes('jen') || transcript.includes('حوت') || transcript.includes('مارو')) {
    const qty = transcript.includes('2') || transcript.includes('zouz') || transcript.includes('اثنان') ? 2 : 1;
    recognizedItems.push({ productName: 'Riz au Poisson (Ceebu Jën / Thieb)', quantity: qty });
  }

  if (transcript.includes('chwaya') || transcript.includes('grillade') || transcript.includes('شواية')) {
    const isCamel = transcript.includes('chameau') || transcript.includes('naga') || transcript.includes('إبل');
    recognizedItems.push({ 
      productName: isCamel ? 'Chwaya Viande de Chameau (Naga)' : 'Chwaya Viande d\'Agneau Grillée', 
      quantity: 1 
    });
  }

  if (transcript.includes('atay') || transcript.includes('thé') || transcript.includes('شاي') || transcript.includes('اتاي')) {
    recognizedItems.push({ productName: 'Thé Traditionnel Mauritanien (Atay 3 verres)', quantity: 1 });
  }

  if (transcript.includes('bissap') || transcript.includes('بيصاب')) {
    recognizedItems.push({ productName: 'Jus de Bissap Frais Artisanal', quantity: 1 });
  }

  if (transcript.includes('poulet') || transcript.includes('دجاج')) {
    recognizedItems.push({ productName: 'Demi-Poulet Rôti Épicé & Frites', quantity: 1 });
  }

  // Si rien n'est matché, renvoyer une suggestion par défaut
  if (recognizedItems.length === 0) {
    recognizedItems.push({ productName: 'Riz au Poisson (Ceebu Jën / Thieb)', quantity: 1 });
  }

  return res.json({
    agent: "Agent 2 - Voice POS Mauritanie",
    rawTranscript: voiceTranscript,
    extractedItems: recognizedItems,
    items: recognizedItems,
    matchedCount: recognizedItems.length
  });
});

// AGENT 3 & 4: Copilot Financier WhatsApp Patron (CFO Copilot Mauritanie)
aiRouter.post('/cfo-chat', (req: Request, res: Response): any => {
  const { question } = req.body;
  const q = (question || '').toLowerCase();

  let answer = "Les indicateurs de votre établissement à Nouakchott sont très positifs aujourd'hui.";

  if (q.includes('bénéfice') || q.includes('marge') || q.includes('profit') || q.includes('ربح')) {
    answer = "Votre bénéfice net estimé s'élève à 48 500 MRU sur les 7 derniers jours avec une marge moyenne de 43.5%. Votre plat le plus rentable est la Chwaya d'Agneau (marge de 36%).";
  } else if (q.includes('stock') || q.includes('fournisseur') || q.includes('manque')) {
    answer = "Alerte stock Nouakchott : Le Riz Mauritanien (reste 15 sacs) et l'Huile 1L risquent de manquer avant jeudi. Recommandation : passer commande chez Ets Al-Baraka.";
  } else if (q.includes('kridi') || q.includes('crédit') || q.includes('dette') || q.includes('دين')) {
    const totalDebt = db.kridiCustomers.reduce((sum, c) => sum + c.currentDebt, 0);
    answer = `Vous avez actuellement ${totalDebt} MRU de créances au carnet réparties sur ${db.kridiCustomers.length} clients. 1 client a atteint son plafond maximum de dette.`;
  } else if (q.includes('ca') || q.includes('chiffre') || q.includes('vente') || q.includes('دخل')) {
    answer = "Le chiffre d'affaires du jour est de 28 450 MRU (+15% par rapport à hier). 48 transactions enregistrées (dont 65% via Bankily).";
  }

  return res.json({
    agent: "Agent 3 & 4 - CFO WhatsApp Copilot",
    question,
    answer,
    reply: answer,
    timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  });
});

// AGENT 5: Relance courtoise des dettes clients (« Kridi »)
aiRouter.post('/kridi-reminder', (req: Request, res: Response): any => {
  const { customerId } = req.body;
  const customer = db.kridiCustomers.find(c => c.id === customerId);

  if (!customer) {
    return res.status(404).json({ error: "Client introuvable." });
  }

  const generatedMessage = `السلام عليكم ورحمة الله، الأخ ${customer.name}. تذكير ودي من متجركم : رصيد الدين الحالي المسجل في الدفتر هو ${customer.currentDebt} أوقية (MRU). مرحباً بكم في أي وقت لتسويته. شكراً لوفائكم ! ✨`;

  return res.json({
    agent: "Agent 5 - Kridi Recovery Mauritanie",
    customerName: customer.name,
    phone: customer.phone,
    amountDue: customer.currentDebt,
    message: generatedMessage,
    channel: "WHATSAPP_SMS"
  });
});

// AGENT 6: Stocks Prédictifs & Météo
aiRouter.get('/stock-forecast', (_req: Request, res: Response): any => {
  return res.json({
    agent: "Agent 6 - Predictive Stock AI",
    period: "Semaine du 28 Septembre au 04 Octobre 2026",
    forecasts: [
      {
        item: "Mozzarella & Fromage Râpé",
        currentStock: "8.5 kg (Critique)",
        forecastSales: "42.0 kg",
        recommendedOrder: "+35 kg",
        aiReason: "Match de Derby samedi soir + forte affluence (+30%)"
      },
      {
        item: "Citrons pour Citronnade",
        currentStock: "12.0 kg",
        forecastSales: "30.0 kg",
        recommendedOrder: "+20 kg",
        aiReason: "Météo ensoleillée (29°C ce dimanche)"
      },
      {
        item: "Pain Makloub / Pâte",
        currentStock: "90 unités",
        forecastSales: "110 unités",
        recommendedOrder: "+30 unités",
        aiReason: "Consommation stable en semaine"
      }
    ]
  });
});
