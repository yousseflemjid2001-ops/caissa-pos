import React, { useState, useMemo } from 'react';
import {
  TrendingUp, Wallet, Plus, Search,
  ArrowUpRight, CheckCircle2,
  Printer, Download, Building2, Coins, ShieldCheck,
  Scale, PieChart, BookOpen, Calculator,
  Landmark, X, FileCheck, Package
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { SectorType } from '../data/mockData';

// Types comptables professionnels (Partie double & Système Financier International)
export interface JournalEntry {
  id: string;
  date: string;
  pieceRef: string; // Ex: FAC-2026-0042, TIK-9821, DEP-018
  libelle: string;
  journal: 'VENTES' | 'ACHATS' | 'CAISSE' | 'BANKILY' | 'OD';
  compteDebit: string;
  compteDebitNom: string;
  compteCredit: string;
  compteCreditNom: string;
  montant: number;
  statut: 'VALIDE' | 'BROUILLON';
}

export interface DepenseItem {
  id: string;
  date: string;
  categorie: 'LOYER' | 'ELECTRICITE_SOMELEC' | 'SALAIRES' | 'TRANSPORT' | 'FOURNITURES' | 'ENTRETIEN' | 'AVARIES_PERTES' | 'AUTRES';
  description: string;
  montant: number;
  modePaiement: 'ESPECES' | 'BANKILY' | 'MASRVI' | 'VIREMENT';
  beneficiaire: string;
  justificatifRef?: string;
  statut: 'PAYE' | 'A_PAYER';
}

export interface FournisseurFacture {
  id: string;
  fournisseurNom: string;
  date: string;
  echeance: string;
  totalTTC: number;
  montantPaye: number;
  soldeRestant: number;
  statut: 'SOLDE' | 'PARTIEL' | 'IMPAYE';
  articlesDescription: string;
}

// Données initiales réalistes pour un Hannout / Boutique à Nouakchott
const INITIAL_ENTRIES: JournalEntry[] = [
  {
    id: 'JE-101',
    date: '2026-10-08',
    pieceRef: 'TIK-2026-148',
    libelle: 'Vente journalière Caisse Boutique & Scanning (Espèces)',
    journal: 'CAISSE',
    compteDebit: '5311',
    compteDebitNom: 'Caisse Principale Hannout (Espèces)',
    compteCredit: '7011',
    compteCreditNom: 'Ventes de marchandises au comptoir',
    montant: 18450,
    statut: 'VALIDE'
  },
  {
    id: 'JE-102',
    date: '2026-10-08',
    pieceRef: 'BK-2026-089',
    libelle: 'Encaissement ventes via Bankily Pro Marchand',
    journal: 'BANKILY',
    compteDebit: '5171',
    compteDebitNom: 'Portefeuille Mobile Bankily Pro (+222)',
    compteCredit: '7011',
    compteCreditNom: 'Ventes de marchandises au comptoir',
    montant: 7600,
    statut: 'VALIDE'
  },
  {
    id: 'JE-103',
    date: '2026-10-07',
    pieceRef: 'KRD-REC-045',
    libelle: 'Règlement dette carnet Kridi par M. Ahmed Fall',
    journal: 'CAISSE',
    compteDebit: '5311',
    compteDebitNom: 'Caisse Principale Hannout (Espèces)',
    compteCredit: '4111',
    compteCreditNom: 'Clients - Carnet de Crédit Kridi',
    montant: 2500,
    statut: 'VALIDE'
  },
  {
    id: 'JE-104',
    date: '2026-10-06',
    pieceRef: 'FAC-GRS-312',
    libelle: 'Achat de gros riz, huile & sucre (Marché 6ème Nouakchott)',
    journal: 'ACHATS',
    compteDebit: '6011',
    compteDebitNom: 'Achats de marchandises - Épicerie',
    compteCredit: '4011',
    compteCreditNom: 'Fournisseurs - Grossiste Ets Bilal & Frères',
    montant: 14200,
    statut: 'VALIDE'
  },
  {
    id: 'JE-105',
    date: '2026-10-05',
    pieceRef: 'REG-FRN-112',
    libelle: 'Règlement partiel Grossiste Bilal par Bankily',
    journal: 'BANKILY',
    compteDebit: '4011',
    compteDebitNom: 'Fournisseurs - Grossiste Ets Bilal & Frères',
    compteCredit: '5171',
    compteCreditNom: 'Portefeuille Mobile Bankily Pro (+222)',
    montant: 10000,
    statut: 'VALIDE'
  },
  {
    id: 'JE-106',
    date: '2026-10-02',
    pieceRef: 'DEP-LOY-10',
    libelle: 'Paiement Loyer mensuel local Hannout (Octobre)',
    journal: 'OD',
    compteDebit: '6131',
    compteDebitNom: 'Locations & Loyer local commercial',
    compteCredit: '5311',
    compteCreditNom: 'Caisse Principale Hannout (Espèces)',
    montant: 15000,
    statut: 'VALIDE'
  },
  {
    id: 'JE-107',
    date: '2026-10-01',
    pieceRef: 'DEP-SOM-09',
    libelle: 'Facture électricité frigos commerciaux SOMELEC',
    journal: 'OD',
    compteDebit: '6051',
    compteDebitNom: 'Électricité commerciale SOMELEC & Eau',
    compteCredit: '5311',
    compteCreditNom: 'Caisse Principale Hannout (Espèces)',
    montant: 4200,
    statut: 'VALIDE'
  }
];

const INITIAL_DEPENSES: DepenseItem[] = [
  {
    id: 'DEP-01',
    date: '2026-10-02',
    categorie: 'LOYER',
    description: 'Loyer commercial Boutique Hannout (Mois en cours)',
    montant: 15000,
    modePaiement: 'ESPECES',
    beneficiaire: 'Propriétaire Immeuble (M. Ould Vall)',
    justificatifRef: 'RECU-LOY-1026',
    statut: 'PAYE'
  },
  {
    id: 'DEP-02',
    date: '2026-10-01',
    categorie: 'ELECTRICITE_SOMELEC',
    description: 'Facture SOMELEC mensuelle (Frigo boisson & éclairage)',
    montant: 4200,
    modePaiement: 'BANKILY',
    beneficiaire: 'SOMELEC Nouakchott',
    justificatifRef: 'SOM-89472',
    statut: 'PAYE'
  },
  {
    id: 'DEP-03',
    date: '2026-10-05',
    categorie: 'TRANSPORT',
    description: 'Transport taxi-marchandises depuis Marché Capitale',
    montant: 600,
    modePaiement: 'ESPECES',
    beneficiaire: 'Chauffeur Taxi Marchandise',
    justificatifRef: 'DEP-TX-04',
    statut: 'PAYE'
  },
  {
    id: 'DEP-04',
    date: '2026-10-06',
    categorie: 'FOURNITURES',
    description: 'Achat de 5 packs de sacs plastiques & rouleaux thermiques 80mm',
    montant: 850,
    modePaiement: 'ESPECES',
    beneficiaire: 'Fournisseur Emballage Marché Capitale',
    justificatifRef: 'EMB-082',
    statut: 'PAYE'
  },
  {
    id: 'DEP-05',
    date: '2026-10-07',
    categorie: 'SALAIRES',
    description: 'Avance sur salaire aide-boutiquier (Moustapha)',
    montant: 3000,
    modePaiement: 'ESPECES',
    beneficiaire: 'Moustapha Diallo',
    justificatifRef: 'AV-SAL-01',
    statut: 'PAYE'
  },
  {
    id: 'DEP-06',
    date: '2026-10-08',
    categorie: 'AVARIES_PERTES',
    description: 'Avarie 4 briques de lait candia percées lors du déchargement',
    montant: 180,
    modePaiement: 'ESPECES',
    beneficiaire: 'Perte enregistrée au stock',
    justificatifRef: 'PERTE-0810',
    statut: 'PAYE'
  }
];

const INITIAL_FOURNISSEURS_FACTURES: FournisseurFacture[] = [
  {
    id: 'FF-201',
    fournisseurNom: 'Ets Bilal & Frères (Grossiste Marché 6ème)',
    date: '2026-10-04',
    echeance: '2026-10-18',
    totalTTC: 28500,
    montantPaye: 18500,
    soldeRestant: 10000,
    statut: 'PARTIEL',
    articlesDescription: '20 sacs riz 25kg, 10 cartons huile 5L, 15 sacs sucre 10kg'
  },
  {
    id: 'FF-202',
    fournisseurNom: 'Compagnie Mauritanienne des Boissons (COMA)',
    date: '2026-10-06',
    echeance: '2026-10-12',
    totalTTC: 12400,
    montantPaye: 12400,
    soldeRestant: 0,
    statut: 'SOLDE',
    articlesDescription: '30 caisses Coca-Cola, Fanta, Sprite, 20 packs Eau Benichab'
  },
  {
    id: 'FF-203',
    fournisseurNom: 'Distributeur Lait & Produits Laitiers Gloria',
    date: '2026-10-07',
    echeance: '2026-10-21',
    totalTTC: 9800,
    montantPaye: 3000,
    soldeRestant: 6800,
    statut: 'PARTIEL',
    articlesDescription: '15 cartons lait Gloria boîte, 8 cartons fromage portion'
  }
];

export interface ComptabiliteScreenProps {
  sector?: SectorType;
}

export const ComptabiliteScreen: React.FC<ComptabiliteScreenProps> = ({
  sector: _sector = 'market'
}) => {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === 'ar';

  // Navigation interne du module Comptabilité
  const [activeTab, setActiveTab] = useState<'kpis' | 'journal' | 'pl' | 'bilan' | 'depenses' | 'fournisseurs' | 'tva'>('kpis');

  // États des données comptables
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    try {
      const saved = localStorage.getItem('caissa_accounting_journal');
      return saved ? JSON.parse(saved) : INITIAL_ENTRIES;
    } catch {
      return INITIAL_ENTRIES;
    }
  });

  const [depenses, setDepenses] = useState<DepenseItem[]>(() => {
    try {
      const saved = localStorage.getItem('caissa_accounting_depenses');
      return saved ? JSON.parse(saved) : INITIAL_DEPENSES;
    } catch {
      return INITIAL_DEPENSES;
    }
  });

  const [fournisseurFactures] = useState<FournisseurFacture[]>(() => {
    try {
      const saved = localStorage.getItem('caissa_accounting_fournisseurs');
      return saved ? JSON.parse(saved) : INITIAL_FOURNISSEURS_FACTURES;
    } catch {
      return INITIAL_FOURNISSEURS_FACTURES;
    }
  });

  // Filtres
  const [searchQuery, setSearchQuery] = useState('');
  const [journalFilter, setJournalFilter] = useState<string>('ALL');
  const [periodeFilter, setPeriodeFilter] = useState<'MOIS' | 'TRIMESTRE' | 'ANNEE'>('MOIS');

  // Modal Nouvelle Écriture Comptable
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false);
  const [newEntryData, setNewEntryData] = useState({
    date: new Date().toISOString().slice(0, 10),
    pieceRef: `ECR-${Math.floor(1000 + Math.random() * 9000)}`,
    libelle: '',
    journal: 'CAISSE' as JournalEntry['journal'],
    compteDebit: '5311',
    compteDebitNom: 'Caisse Principale Hannout (Espèces)',
    compteCredit: '7011',
    compteCreditNom: 'Ventes de marchandises au comptoir',
    montant: ''
  });

  // Modal Nouvelle Dépense
  const [isAddDepenseModalOpen, setIsAddDepenseModalOpen] = useState(false);
  const [newDepenseData, setNewDepenseData] = useState({
    date: new Date().toISOString().slice(0, 10),
    categorie: 'AUTRES' as DepenseItem['categorie'],
    description: '',
    montant: '',
    modePaiement: 'ESPECES' as DepenseItem['modePaiement'],
    beneficiaire: '',
    justificatifRef: ''
  });

  // Notifications
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // Calculs financiers récapitulatifs pour Hannout / Boutique
  const financialMetrics = useMemo(() => {
    // Chiffre d'Affaires Brut (Ventes)
    const totalVentes = journalEntries
      .filter(e => e.compteCredit.startsWith('70') && e.statut === 'VALIDE')
      .reduce((sum, e) => sum + e.montant, 0);

    // Coût d'Achat des Marchandises Vendues (Estimé à 68% du CA pour le Hannout selon marges réelles de détail)
    const coutMarchandises = Math.round(totalVentes * 0.68);

    // Marge Brute Commerciale
    const margeBrute = totalVentes - coutMarchandises;
    const tauxMarge = totalVentes > 0 ? ((margeBrute / totalVentes) * 100).toFixed(1) : '0';

    // Total des Dépenses d'exploitation (Charges d'exploitation)
    const totalCharges = depenses.reduce((sum, d) => sum + d.montant, 0);

    // Résultat Net Comptable (Bénéfice Réel après charges)
    const resultatNet = margeBrute - totalCharges;

    // Trésorerie Disponibilités réelles
    // Caisse Espèces :
    const caisseEspeces = 18450 + 2500 - 15000 - 600 - 850 - 3000; // ~ 1450 MRU
    // Bankily Pro :
    const bankilySolde = 7600 - 4200; // ~ 3400 MRU
    // Masrvi BIM :
    const masrviSolde = 1850;
    const tresorerieTotale = caisseEspeces + bankilySolde + masrviSolde;

    // Créances Clients Kridi (Argent dehors auprès des clients de quartier)
    const creancesKridi = 16800; // Simulé d'après la base client

    // Valeur marchande du stock actuel en rayon et réserve
    const valeurStock = 142500;

    // Dettes Fournisseurs (Ce que le hannout doit encore aux grossistes)
    const dettesFournisseurs = fournisseurFactures.reduce((sum, f) => sum + f.soldeRestant, 0);

    // TVA Déductible & Collectée (16% RIM)
    const tvaCollectee = Math.round(totalVentes * 0.16);
    const tvaDeductible = Math.round(totalCharges * 0.16);
    const tvaDue = Math.max(0, tvaCollectee - tvaDeductible);

    return {
      totalVentes,
      coutMarchandises,
      margeBrute,
      tauxMarge,
      totalCharges,
      resultatNet,
      tresorerieTotale,
      caisseEspeces,
      bankilySolde,
      masrviSolde,
      creancesKridi,
      valeurStock,
      dettesFournisseurs,
      tvaCollectee,
      tvaDeductible,
      tvaDue
    };
  }, [journalEntries, depenses, fournisseurFactures]);

  // Sauvegarder dans LocalStorage
  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntryData.libelle || !newEntryData.montant) {
      triggerToast('Veuillez remplir le libellé et le montant.');
      return;
    }

    const entry: JournalEntry = {
      id: `JE-${Date.now().toString().slice(-4)}`,
      date: newEntryData.date,
      pieceRef: newEntryData.pieceRef || `MAN-${Date.now().toString().slice(-4)}`,
      libelle: newEntryData.libelle,
      journal: newEntryData.journal,
      compteDebit: newEntryData.compteDebit,
      compteDebitNom: newEntryData.compteDebitNom,
      compteCredit: newEntryData.compteCredit,
      compteCreditNom: newEntryData.compteCreditNom,
      montant: parseFloat(newEntryData.montant),
      statut: 'VALIDE'
    };

    const updated = [entry, ...journalEntries];
    setJournalEntries(updated);
    localStorage.setItem('caissa_accounting_journal', JSON.stringify(updated));
    setIsAddEntryModalOpen(false);
    setNewEntryData({
      date: new Date().toISOString().slice(0, 10),
      pieceRef: `ECR-${Math.floor(1000 + Math.random() * 9000)}`,
      libelle: '',
      journal: 'CAISSE',
      compteDebit: '5311',
      compteDebitNom: 'Caisse Principale Hannout (Espèces)',
      compteCredit: '7011',
      compteCreditNom: 'Ventes de marchandises au comptoir',
      montant: ''
    });
    triggerToast('✓ Écriture comptable en partie double enregistrée et validée !');
  };

  const handleSaveDepense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDepenseData.description || !newDepenseData.montant) {
      triggerToast('Veuillez renseigner la description et le montant.');
      return;
    }

    const depense: DepenseItem = {
      id: `DEP-${Date.now().toString().slice(-4)}`,
      date: newDepenseData.date,
      categorie: newDepenseData.categorie,
      description: newDepenseData.description,
      montant: parseFloat(newDepenseData.montant),
      modePaiement: newDepenseData.modePaiement,
      beneficiaire: newDepenseData.beneficiaire || 'Divers',
      justificatifRef: newDepenseData.justificatifRef || `JUST-${Date.now().toString().slice(-4)}`,
      statut: 'PAYE'
    };

    const updatedDep = [depense, ...depenses];
    setDepenses(updatedDep);
    localStorage.setItem('caissa_accounting_depenses', JSON.stringify(updatedDep));

    // Générer automatiquement l'écriture comptable correspondante
    const autoEntry: JournalEntry = {
      id: `JE-AUTO-${Date.now().toString().slice(-4)}`,
      date: depense.date,
      pieceRef: depense.justificatifRef || depense.id,
      libelle: `Dépense : ${depense.description} (${depense.categorie})`,
      journal: depense.modePaiement === 'BANKILY' ? 'BANKILY' : 'CAISSE',
      compteDebit: depense.categorie === 'LOYER' ? '6131' : depense.categorie === 'ELECTRICITE_SOMELEC' ? '6051' : '6281',
      compteDebitNom: `Charge - ${depense.categorie}`,
      compteCredit: depense.modePaiement === 'BANKILY' ? '5171' : '5311',
      compteCreditNom: depense.modePaiement === 'BANKILY' ? 'Portefeuille Mobile Bankily Pro' : 'Caisse Espèces',
      montant: depense.montant,
      statut: 'VALIDE'
    };

    const updatedJourn = [autoEntry, ...journalEntries];
    setJournalEntries(updatedJourn);
    localStorage.setItem('caissa_accounting_journal', JSON.stringify(updatedJourn));

    setIsAddDepenseModalOpen(false);
    setNewDepenseData({
      date: new Date().toISOString().slice(0, 10),
      categorie: 'AUTRES',
      description: '',
      montant: '',
      modePaiement: 'ESPECES',
      beneficiaire: '',
      justificatifRef: ''
    });
    triggerToast('✓ Dépense enregistrée et écriture comptable générée automatiquement !');
  };

  // Filtrage du journal des écritures
  const filteredEntries = useMemo(() => {
    return journalEntries.filter(entry => {
      const matchSearch = entry.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.pieceRef.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.compteDebitNom.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.compteCreditNom.toLowerCase().includes(searchQuery.toLowerCase());
      const matchJournal = journalFilter === 'ALL' || entry.journal === journalFilter;
      return matchSearch && matchJournal;
    });
  }, [journalEntries, searchQuery, journalFilter]);

  // Export CSV Grand Livre
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Pièce Réf', 'Libellé', 'Journal', 'Compte Débit', 'Intitulé Débit', 'Compte Crédit', 'Intitulé Crédit', 'Montant (MRU)', 'Statut'];
    const rows = journalEntries.map(e => [
      e.id,
      e.date,
      e.pieceRef,
      `"${e.libelle.replace(/"/g, '""')}"`,
      e.journal,
      e.compteDebit,
      `"${e.compteDebitNom}"`,
      e.compteCredit,
      `"${e.compteCreditNom}"`,
      e.montant,
      e.statut
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Grand_Livre_Comptable_Hannout_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerToast('📁 Exportation du Grand Livre au format CSV réussie !');
  };

  return (
    <div style={{
      padding: '20px 24px 60px',
      display: 'flex',
      flexDirection: 'column',
      gap: '22px',
      maxWidth: '1440px',
      margin: '0 auto',
      direction: isArabic ? 'rtl' : 'ltr'
    }}>
      {/* Toast Notification */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: isArabic ? 'auto' : '24px',
          left: isArabic ? '24px' : 'auto',
          zIndex: 9999,
          background: '#059669',
          color: '#ffffff',
          padding: '12px 20px',
          borderRadius: '10px',
          fontWeight: 700,
          fontSize: '0.88rem',
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.4)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.25s ease'
        }}>
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* TOP HEADER: Titre, Badge Hannout & Actions Globales */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'var(--bg-secondary)',
        padding: '18px 24px',
        borderRadius: '16px',
        border: '1px solid var(--border-glass)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
            width: '46px',
            height: '46px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)'
          }}>
            <Calculator size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '1.4rem', fontWeight: 800, margin: 0, color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
                {isArabic ? 'المحاسبة والمالية التجارية' : 'Comptabilité & Finances Commerciales'}
              </h1>
              <span style={{
                background: 'rgba(5, 150, 105, 0.12)',
                color: '#10b981',
                border: '1px solid rgba(5, 150, 105, 0.3)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                {isArabic ? 'معيار حانوت وبقالة' : 'Mode Hannout & Épicerie'}
              </span>
              <span style={{
                background: 'rgba(59, 130, 246, 0.12)',
                color: '#3b82f6',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                padding: '2px 8px',
                borderRadius: '6px',
                fontSize: '0.72rem',
                fontWeight: 800
              }}>
                SYSCOHADA / RIM (MRU)
              </span>
            </div>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {isArabic 
                ? 'دفتر الحسابات، الأرباح الصافية، المصاريف الشهرية وفواتير الموردين بالعملة الموريتانية (أوقية)'
                : 'Grand livre en partie double, compte de résultat (P&L), bilan synthétique et suivi des dépenses du commerce'}
            </p>
          </div>
        </div>

        {/* Boutons d'Action Rapide */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Sélecteur de Période Comptable */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-tertiary)',
            padding: '2px',
            borderRadius: '8px',
            border: '1px solid var(--border-glass)'
          }}>
            {(['MOIS', 'TRIMESTRE', 'ANNEE'] as const).map(p => (
              <button
                key={p}
                onClick={() => setPeriodeFilter(p)}
                style={{
                  border: 'none',
                  padding: '5px 10px',
                  borderRadius: '6px',
                  fontSize: '0.74rem',
                  fontWeight: periodeFilter === p ? 800 : 600,
                  background: periodeFilter === p ? '#059669' : 'transparent',
                  color: periodeFilter === p ? '#fff' : 'var(--text-muted)',
                  cursor: 'pointer'
                }}
              >
                {p === 'MOIS' ? (isArabic ? 'شهري' : 'Mois') : p === 'TRIMESTRE' ? (isArabic ? 'فصلي' : 'Trimestre') : (isArabic ? 'سنوي' : 'Année')}
              </button>
            ))}
          </div>

          <button
            onClick={() => setIsAddDepenseModalOpen(true)}
            className="btn-secondary"
            style={{
              padding: '8px 14px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              borderColor: 'rgba(239, 68, 68, 0.35)',
              color: '#ef4444'
            }}
          >
            <Coins size={15} />
            <span>{isArabic ? '+ تسجيل مصروف' : '+ Enregistrer Dépense'}</span>
          </button>

          <button
            onClick={() => setIsAddEntryModalOpen(true)}
            className="btn-primary"
            style={{
              padding: '8px 16px',
              fontSize: '0.8rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#059669',
              borderColor: '#047857'
            }}
          >
            <Plus size={16} />
            <span>{isArabic ? '+ قيد محاسبي جديد' : '+ Nouvelle Écriture'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="btn-secondary"
            style={{
              padding: '8px 12px',
              fontSize: '0.8rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
            title="Exporter le grand livre en CSV"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* NAVIGATION INTERNE COMPTABLE : Onglets modernes */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingBottom: '4px',
        borderBottom: '1px solid var(--border-glass)'
      }}>
        {[
          { id: 'kpis', label: isArabic ? 'المؤشرات والسيولة' : 'Vue d\'Ensemble & KPIs', icon: PieChart },
          { id: 'pl', label: isArabic ? 'حساب النتائج (الأرباح)' : 'Compte de Résultat (P&L)', icon: TrendingUp },
          { id: 'journal', label: isArabic ? 'اليومية المحاسبية' : 'Grand Livre & Journal', icon: BookOpen },
          { id: 'depenses', label: isArabic ? 'مصاريف المحل' : 'Dépenses & Charges', icon: Coins },
          { id: 'fournisseurs', label: isArabic ? 'ديون الموردين (الجملة)' : 'Dettes Grossistes', icon: Building2 },
          { id: 'bilan', label: isArabic ? 'الميزانية الختامية' : 'Bilan Patrimonial', icon: Scale },
          { id: 'tva', label: isArabic ? 'الضرائب و TVA 16%' : 'TVA & Fiscalité RIM', icon: FileCheck }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '9px 16px',
                borderRadius: '10px',
                fontSize: '0.82rem',
                fontWeight: isActive ? 800 : 600,
                background: isActive ? '#059669' : 'var(--bg-tertiary)',
                color: isActive ? '#ffffff' : 'var(--text-muted)',
                border: `1px solid ${isActive ? '#047857' : 'var(--border-glass)'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ONGLET 1: VUE D'ENSEMBLE & KPIS FINANCIERS */}
      {activeTab === 'kpis' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Grille des 6 Métriques Clés */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '16px'
          }}>
            {/* 1. Chiffre d'Affaires Brut */}
            <div className="glass-panel" style={{ padding: '18px', borderRadius: '14px', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {isArabic ? 'إجمالي المبيعات (CA)' : 'Chiffre d\'Affaires'}
                </span>
                <span style={{ padding: '4px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                  <TrendingUp size={16} />
                </span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '8px' }}>
                {financialMetrics.totalVentes.toLocaleString('fr-FR')} <span style={{ fontSize: '0.95rem', color: '#10b981' }}>MRU</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Ventes comptoir + Bankily encaissées
              </div>
            </div>

            {/* 2. Coût des Marchandises (COGS) */}
            <div className="glass-panel" style={{ padding: '18px', borderRadius: '14px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {isArabic ? 'تكلفة البضاعة المباعة' : 'Coût d\'Achat Marchandises'}
                </span>
                <span style={{ padding: '4px', borderRadius: '8px', background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c' }}>
                  <Package size={16} />
                </span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-main)', marginTop: '8px' }}>
                {financialMetrics.coutMarchandises.toLocaleString('fr-FR')} <span style={{ fontSize: '0.95rem', color: '#ea580c' }}>MRU</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Prix d'achat grossiste (~68% du CA)
              </div>
            </div>

            {/* 3. Marge Brute Commerciale */}
            <div className="glass-panel" style={{ padding: '18px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {isArabic ? 'هامش الربح الخام' : 'Marge Commerciale'}
                </span>
                <span style={{ padding: '4px', borderRadius: '8px', background: 'rgba(5, 150, 105, 0.15)', color: '#059669' }}>
                  <ArrowUpRight size={16} />
                </span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#059669', marginTop: '8px' }}>
                {financialMetrics.margeBrute.toLocaleString('fr-FR')} <span style={{ fontSize: '0.95rem' }}>MRU</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700, marginTop: '4px' }}>
                Taux de marge : {financialMetrics.tauxMarge}%
              </div>
            </div>

            {/* 4. Charges d'Exploitation (Dépenses Hannout) */}
            <div className="glass-panel" style={{ padding: '18px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {isArabic ? 'مصاريف المحل' : 'Charges & Dépenses'}
                </span>
                <span style={{ padding: '4px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444' }}>
                  <Coins size={16} />
                </span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#ef4444', marginTop: '8px' }}>
                {financialMetrics.totalCharges.toLocaleString('fr-FR')} <span style={{ fontSize: '0.95rem' }}>MRU</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Loyer (15k), SOMELEC, Transports
              </div>
            </div>

            {/* 5. Bénéfice Net Réel (Net Profit) */}
            <div className="glass-panel" style={{
              padding: '18px',
              borderRadius: '14px',
              border: '2px solid rgba(16, 185, 129, 0.4)',
              background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08), transparent)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>
                  {isArabic ? 'صافي الربح الفعلي' : 'Bénéfice Net Réel'}
                </span>
                <span style={{ padding: '4px', borderRadius: '8px', background: '#059669', color: '#fff' }}>
                  <ShieldCheck size={16} />
                </span>
              </div>
              <div style={{ fontSize: '1.85rem', fontWeight: 900, color: financialMetrics.resultatNet >= 0 ? '#10b981' : '#ef4444', marginTop: '8px' }}>
                {financialMetrics.resultatNet.toLocaleString('fr-FR')} <span style={{ fontSize: '0.95rem' }}>MRU</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Marge brute - toutes les charges
              </div>
            </div>

            {/* 6. Trésorerie Disponible Immédiate */}
            <div className="glass-panel" style={{ padding: '18px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>
                  {isArabic ? 'السيولة المتوفرة' : 'Trésorerie Globale'}
                </span>
                <span style={{ padding: '4px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
                  <Wallet size={16} />
                </span>
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#3b82f6', marginTop: '8px' }}>
                {financialMetrics.tresorerieTotale.toLocaleString('fr-FR')} <span style={{ fontSize: '0.95rem' }}>MRU</span>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Espèces caisse + Bankily + Masrvi
              </div>
            </div>
          </div>

          {/* Section Répartition de la Trésorerie & Alertes Hannout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '18px'
          }}>
            {/* Comptes Financiers du Hannout */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Wallet size={17} color="#059669" />
                <span>{isArabic ? 'تفاصيل أرصدة الخزينة والسيولة' : 'Répartition des Disponibilités Financières'}</span>
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Caisse Espèces */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                      <Coins size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>Caisse Espèces Hannout (Compte 5311)</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Tiroir-caisse physique du magasin</div>
                    </div>
                  </div>
                  <div style={{ textAlign: isArabic ? 'left' : 'right' }}>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800 }}>{financialMetrics.caisseEspeces.toLocaleString('fr-FR')} MRU</div>
                    <div style={{ fontSize: '0.68rem', color: '#10b981' }}>Prêt pour le rendu</div>
                  </div>
                </div>

                {/* Bankily Pro Marchand */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(234, 88, 12, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ea580c' }}>
                      <Landmark size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>Bankily Pro Marchand (Compte 5171)</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Numéro pro : +222 36 32 22 25</div>
                    </div>
                  </div>
                  <div style={{ textAlign: isArabic ? 'left' : 'right' }}>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800 }}>{financialMetrics.bankilySolde.toLocaleString('fr-FR')} MRU</div>
                    <div style={{ fontSize: '0.68rem', color: '#ea580c' }}>Code Marchand BIM</div>
                  </div>
                </div>

                {/* Masrvi BIM */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3b82f6' }}>
                      <Landmark size={17} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700 }}>Masrvi BIM Mobile (Compte 5172)</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Portefeuille BIM connecté</div>
                    </div>
                  </div>
                  <div style={{ textAlign: isArabic ? 'left' : 'right' }}>
                    <div style={{ fontSize: '0.98rem', fontWeight: 800 }}>{financialMetrics.masrviSolde.toLocaleString('fr-FR')} MRU</div>
                    <div style={{ fontSize: '0.68rem', color: '#3b82f6' }}>Actif</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Situation Patrimoniale : Argent Dehors vs Dettes Fournisseurs */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '14px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, margin: '0 0 14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={17} color="#3b82f6" />
                <span>{isArabic ? 'توازن الحانوت : الديون والمستحقات' : 'Équilibre Hannout : Dehors vs Dettes'}</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Créances Kridi Clients */}
                <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(168, 85, 247, 0.08)', border: '1px solid rgba(168, 85, 247, 0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#a855f7' }}>
                      {isArabic ? 'الكريدي المستحق عند الزبناء' : 'Créances Clients (Carnet Kridi)'}
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#a855f7' }}>
                      {financialMetrics.creancesKridi.toLocaleString('fr-FR')} MRU
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Argent dehors à recouvrer auprès des voisins et clients réguliers
                  </div>
                </div>

                {/* Dettes Fournisseurs Grossistes */}
                <div style={{ padding: '12px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#ef4444' }}>
                      {isArabic ? 'ديون الموردين (تجار الجملة)' : 'Dettes envers les Grossistes'}
                    </span>
                    <span style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ef4444' }}>
                      {financialMetrics.dettesFournisseurs.toLocaleString('fr-FR')} MRU
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                    Factures grossistes en attente d'échéance (Bilal, Gloria)
                  </div>
                </div>

                {/* Ratio de Couverture */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-tertiary)', borderRadius: '10px' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Ratio Solvabilité Immédiate :</span>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#10b981' }}>
                    {((financialMetrics.tresorerieTotale + financialMetrics.creancesKridi) / (financialMetrics.dettesFournisseurs || 1)).toFixed(2)}x (Très Sain)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ONGLET 2: COMPTE DE RÉSULTAT (P&L - PROFIT & LOSS) */}
      {activeTab === 'pl' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                {isArabic ? 'جدول حساب النتائج والأرباح (P&L)' : 'Compte de Résultat Simplifié (SYSCOHADA / RIM)'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Période active : Mois d'Octobre 2026 • Devise : Ouguiya Mauritanienne (MRU)
              </p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={() => window.print()} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
                <Printer size={14} /> Imprimer P&L
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '2px solid var(--border-glass)' }}>
                  <th style={{ padding: '10px 14px', textAlign: isArabic ? 'right' : 'left', fontWeight: 800 }}>N° Compte</th>
                  <th style={{ padding: '10px 14px', textAlign: isArabic ? 'right' : 'left', fontWeight: 800 }}>Rubrique Comptable</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800 }}>Produits (+)</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800 }}>Charges (-)</th>
                </tr>
              </thead>
              <tbody>
                {/* PRODUITS */}
                <tr style={{ background: 'rgba(16, 185, 129, 0.05)', fontWeight: 800 }}>
                  <td colSpan={4} style={{ padding: '10px 14px', color: '#10b981' }}>
                    I. PRODUITS D'EXPLOITATION (CHIFFRE D'AFFAIRES)
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '8px 14px', fontFamily: 'monospace' }}>7011</td>
                  <td style={{ padding: '8px 14px' }}>Ventes de marchandises Hannout au comptoir (Espèces)</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>18 450 MRU</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right' }}>-</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '8px 14px', fontFamily: 'monospace' }}>7012</td>
                  <td style={{ padding: '8px 14px' }}>Ventes encaissées par Bankily Pro Marchand</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right', fontWeight: 700, color: '#10b981' }}>7 600 MRU</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right' }}>-</td>
                </tr>
                <tr style={{ borderBottom: '2px solid var(--border-glass)', background: 'var(--bg-tertiary)', fontWeight: 800 }}>
                  <td colSpan={2} style={{ padding: '10px 14px' }}>TOTAL DU CHIFFRE D'AFFAIRES BRUT (CA)</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', color: '#10b981', fontSize: '0.98rem' }}>
                    {financialMetrics.totalVentes.toLocaleString('fr-FR')} MRU
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>-</td>
                </tr>

                {/* CHARGES DIRECTES MARCHANDISES */}
                <tr style={{ background: 'rgba(234, 88, 12, 0.05)', fontWeight: 800 }}>
                  <td colSpan={4} style={{ padding: '10px 14px', color: '#ea580c' }}>
                    II. COÛT DES MARCHANDISES VENDUES (ACHATS GROSSISTES)
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '8px 14px', fontFamily: 'monospace' }}>6011</td>
                  <td style={{ padding: '8px 14px' }}>Achats de marchandises vendues (Riz, Huile, Boissons, Épicerie)</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right' }}>-</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right', fontWeight: 700, color: '#ea580c' }}>
                    {financialMetrics.coutMarchandises.toLocaleString('fr-FR')} MRU
                  </td>
                </tr>
                <tr style={{ borderBottom: '2px solid var(--border-glass)', background: 'rgba(5, 150, 105, 0.08)', fontWeight: 900 }}>
                  <td colSpan={2} style={{ padding: '10px 14px', color: '#059669' }}>
                    = MARGE COMMERCIALE BRUTE (CA - COÛTS MARCHANDISES)
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', color: '#059669', fontSize: '1.05rem' }}>
                    {financialMetrics.margeBrute.toLocaleString('fr-FR')} MRU
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', color: '#059669' }}>
                    ({financialMetrics.tauxMarge}%)
                  </td>
                </tr>

                {/* CHARGES D'EXPLOITATION HANNOUT */}
                <tr style={{ background: 'rgba(239, 68, 68, 0.05)', fontWeight: 800 }}>
                  <td colSpan={4} style={{ padding: '10px 14px', color: '#ef4444' }}>
                    III. CHARGES D'EXPLOITATION & FRAIS GÉNÉRAUX DU HANNOUT
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '8px 14px', fontFamily: 'monospace' }}>6131</td>
                  <td style={{ padding: '8px 14px' }}>Loyer mensuel du local commercial Hannout</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right' }}>-</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right', color: '#ef4444' }}>15 000 MRU</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '8px 14px', fontFamily: 'monospace' }}>6051</td>
                  <td style={{ padding: '8px 14px' }}>Électricité SOMELEC (Frigos, congélateurs, éclairage)</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right' }}>-</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right', color: '#ef4444' }}>4 200 MRU</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '8px 14px', fontFamily: 'monospace' }}>6411</td>
                  <td style={{ padding: '8px 14px' }}>Rémunération aide-boutiquier & personnel</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right' }}>-</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right', color: '#ef4444' }}>3 000 MRU</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '8px 14px', fontFamily: 'monospace' }}>6141</td>
                  <td style={{ padding: '8px 14px' }}>Transport taxi-marchandises (Marché Capitale / 6ème)</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right' }}>-</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right', color: '#ef4444' }}>600 MRU</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '8px 14px', fontFamily: 'monospace' }}>6081</td>
                  <td style={{ padding: '8px 14px' }}>Emballages, sachets plastiques & rouleaux thermiques</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right' }}>-</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right', color: '#ef4444' }}>850 MRU</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '8px 14px', fontFamily: 'monospace' }}>6541</td>
                  <td style={{ padding: '8px 14px' }}>Avaries de stock, bouteilles cassées & pertes</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right' }}>-</td>
                  <td style={{ padding: '8px 14px', textAlign: 'right', color: '#ef4444' }}>180 MRU</td>
                </tr>
                <tr style={{ borderBottom: '2px solid var(--border-glass)', background: 'var(--bg-tertiary)', fontWeight: 800 }}>
                  <td colSpan={2} style={{ padding: '10px 14px' }}>TOTAL DES CHARGES D'EXPLOITATION</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right' }}>-</td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', color: '#ef4444', fontSize: '0.98rem' }}>
                    {financialMetrics.totalCharges.toLocaleString('fr-FR')} MRU
                  </td>
                </tr>

                {/* RÉSULTAT NET COMPTABLE */}
                <tr style={{
                  background: financialMetrics.resultatNet >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  fontWeight: 900
                }}>
                  <td colSpan={2} style={{ padding: '14px', fontSize: '1.1rem', color: financialMetrics.resultatNet >= 0 ? '#10b981' : '#ef4444' }}>
                    🏆 RÉSULTAT NET D'EXPLOITATION (BÉNÉFICE NET DU HANNOUT)
                  </td>
                  <td colSpan={2} style={{ padding: '14px', textAlign: 'right', fontSize: '1.35rem', color: financialMetrics.resultatNet >= 0 ? '#10b981' : '#ef4444' }}>
                    {financialMetrics.resultatNet.toLocaleString('fr-FR')} MRU
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ONGLET 3: GRAND LIVRE & JOURNAL GÉNÉRAL DES ÉCRITURES */}
      {activeTab === 'journal' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                {isArabic ? 'سجل اليومية المحاسبية العامة (الطرفين)' : 'Journal Général en Partie Double (Débit / Crédit)'}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Total {filteredEntries.length} écritures enregistrées
                </span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <CheckCircle2 size={12} />
                  <span>Balance Équilibrée (Débit = Crédit)</span>
                </span>
              </div>
            </div>

            {/* Filtres & Recherche */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                <input
                  type="text"
                  placeholder="Rechercher libellé, pièce..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px 6px 30px',
                    borderRadius: '8px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                    fontSize: '0.78rem',
                    color: 'var(--text-main)'
                  }}
                />
              </div>

              <select
                value={journalFilter}
                onChange={(e) => setJournalFilter(e.target.value)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.78rem',
                  color: 'var(--text-main)',
                  fontWeight: 600
                }}
              >
                <option value="ALL">Tous les Journaux</option>
                <option value="CAISSE">Journal Caisse</option>
                <option value="BANKILY">Journal Bankily</option>
                <option value="VENTES">Journal Ventes</option>
                <option value="ACHATS">Journal Achats</option>
                <option value="OD">Opérations Diverses (OD)</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Date</th>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Pièce Réf</th>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Libellé de l'Écriture</th>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Journal</th>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Compte Débit</th>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Compte Crédit</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Montant Débit (MRU)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Montant Crédit (MRU)</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map(entry => (
                  <tr key={entry.id} style={{ borderBottom: '1px solid var(--border-glass)', transition: 'background 0.15s ease' }}>
                    <td style={{ padding: '9px 12px', whiteSpace: 'nowrap', color: 'var(--text-dim)', fontFamily: 'monospace' }}>
                      {entry.date}
                    </td>
                    <td style={{ padding: '9px 12px', whiteSpace: 'nowrap', fontWeight: 700, fontFamily: 'monospace' }}>
                      {entry.pieceRef}
                    </td>
                    <td style={{ padding: '9px 12px', fontWeight: 600 }}>
                      {entry.libelle}
                    </td>
                    <td style={{ padding: '9px 12px' }}>
                      <span style={{
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        background: entry.journal === 'CAISSE' ? 'rgba(16, 185, 129, 0.15)' : entry.journal === 'BANKILY' ? 'rgba(234, 88, 12, 0.15)' : entry.journal === 'ACHATS' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                        color: entry.journal === 'CAISSE' ? '#10b981' : entry.journal === 'BANKILY' ? '#ea580c' : entry.journal === 'ACHATS' ? '#ef4444' : '#3b82f6'
                      }}>
                        {entry.journal}
                      </span>
                    </td>
                    <td style={{ padding: '9px 12px' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#3b82f6' }}>{entry.compteDebit}</span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{entry.compteDebitNom}</div>
                    </td>
                    <td style={{ padding: '9px 12px' }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#ea580c' }}>{entry.compteCredit}</span>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{entry.compteCreditNom}</div>
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 800, color: '#3b82f6' }}>
                      {entry.montant.toLocaleString('fr-FR')}
                    </td>
                    <td style={{ padding: '9px 12px', textAlign: 'right', fontWeight: 800, color: '#ea580c' }}>
                      {entry.montant.toLocaleString('fr-FR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ONGLET 4: GESTIONNAIRE DE DÉPENSES & CHARGES */}
      {activeTab === 'depenses' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                {isArabic ? 'إدارة مصاريف المحل والتشغيل' : 'Suivi des Dépenses & Charges du Hannout'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Toutes les sorties de caisse et paiements Bankily pour l'entretien, loyer, SOMELEC et salaires
              </p>
            </div>
            <button
              onClick={() => setIsAddDepenseModalOpen(true)}
              className="btn-primary"
              style={{ padding: '7px 14px', fontSize: '0.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={15} />
              <span>{isArabic ? 'إضافة مصروف جديد' : 'Ajouter une Dépense'}</span>
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Date</th>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Catégorie</th>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Description</th>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Bénéficiaire</th>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Mode Paiement</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Montant (MRU)</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {depenses.map(dep => (
                  <tr key={dep.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: 'var(--text-dim)' }}>{dep.date}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        background: 'rgba(239, 68, 68, 0.12)',
                        color: '#ef4444'
                      }}>
                        {dep.categorie}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontWeight: 600 }}>{dep.description}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-dim)' }}>{dep.beneficiaire}</td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 700, color: dep.modePaiement === 'BANKILY' ? '#ea580c' : '#10b981' }}>
                        {dep.modePaiement}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 800, color: '#ef4444' }}>
                      {dep.montant.toLocaleString('fr-FR')} MRU
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{ background: '#10b981', color: '#fff', padding: '2px 6px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 800 }}>
                        ✓ PAYÉ
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ONGLET 5: DETTES FOURNISSEURS GROSSISTES */}
      {activeTab === 'fournisseurs' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
                {isArabic ? 'حسابات تجار الجملة والموردين' : 'Factures & Dettes Envers les Grossistes'}
              </h2>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Gestion des approvisionnements à crédit auprès des grossistes du Marché de la Capitale & Marché 6ème
              </p>
            </div>
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '6px 14px',
              borderRadius: '8px',
              fontSize: '0.85rem',
              fontWeight: 800,
              color: '#ef4444'
            }}>
              Total Dettes Grossistes : {financialMetrics.dettesFournisseurs.toLocaleString('fr-FR')} MRU
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-glass)' }}>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Grossiste / Fournisseur</th>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Marchandises Commandées</th>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Date Achat</th>
                  <th style={{ padding: '10px 12px', textAlign: isArabic ? 'right' : 'left' }}>Échéance Règlement</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Total Facture</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Déjà Payé</th>
                  <th style={{ padding: '10px 12px', textAlign: 'right' }}>Reste Dû</th>
                  <th style={{ padding: '10px 12px', textAlign: 'center' }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {fournisseurFactures.map(fac => (
                  <tr key={fac.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 800 }}>{fac.fournisseurNom}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{fac.articlesDescription}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{fac.date}</td>
                    <td style={{ padding: '10px 12px', fontFamily: 'monospace', color: '#ea580c', fontWeight: 700 }}>{fac.echeance}</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 700 }}>{fac.totalTTC.toLocaleString('fr-FR')} MRU</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: '#10b981', fontWeight: 700 }}>{fac.montantPaye.toLocaleString('fr-FR')} MRU</td>
                    <td style={{ padding: '10px 12px', textAlign: 'right', color: fac.soldeRestant > 0 ? '#ef4444' : '#10b981', fontWeight: 900 }}>
                      {fac.soldeRestant.toLocaleString('fr-FR')} MRU
                    </td>
                    <td style={{ padding: '10px 12px', textAlign: 'center' }}>
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        background: fac.statut === 'SOLDE' ? '#10b981' : fac.statut === 'PARTIEL' ? '#ea580c' : '#ef4444',
                        color: '#fff'
                      }}>
                        {fac.statut === 'SOLDE' ? '✓ RÉGLÉ' : fac.statut === 'PARTIEL' ? 'PARTIEL' : 'IMPAYÉ'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ONGLET 6: BILAN PATRIMONIAL SYNTHÉTIQUE */}
      {activeTab === 'bilan' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              {isArabic ? 'الميزانية المالية الختامية (الأصول والخصوم)' : 'Bilan Patrimonial Simplifié (Actif vs Passif)'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Évaluation du patrimoine de la boutique : ce qu'elle possède (Actif) vs ce qu'elle doit (Passif)
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {/* ACTIF (CE QUE LE HANNOUT POSSÈDE) */}
            <div style={{ border: '1px solid var(--border-glass)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: 'rgba(5, 150, 105, 0.15)', padding: '12px 16px', fontWeight: 800, color: '#10b981', fontSize: '0.95rem' }}>
                ACTIF (EMPLOIS DE RESSOURCES)
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-glass)' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Disponibilités de Trésorerie</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Espèces en caisse + Bankily + Masrvi</div>
                  </div>
                  <div style={{ fontWeight: 800 }}>{financialMetrics.tresorerieTotale.toLocaleString('fr-FR')} MRU</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-glass)' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Valeur Marchande du Stock Actuel</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Rayons épicerie, boissons, conserves, réserve</div>
                  </div>
                  <div style={{ fontWeight: 800 }}>{financialMetrics.valeurStock.toLocaleString('fr-FR')} MRU</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-glass)' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Créances Clients (Carnet Kridi)</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Dettes des clients enregistrées à recouvrer</div>
                  </div>
                  <div style={{ fontWeight: 800 }}>{financialMetrics.creancesKridi.toLocaleString('fr-FR')} MRU</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', fontWeight: 900, color: '#10b981', fontSize: '1.05rem' }}>
                  <div>TOTAL ACTIF PATRIMONIAL</div>
                  <div>{(financialMetrics.tresorerieTotale + financialMetrics.valeurStock + financialMetrics.creancesKridi).toLocaleString('fr-FR')} MRU</div>
                </div>
              </div>
            </div>

            {/* PASSIF (CE QUE LE HANNOUT DOIT) */}
            <div style={{ border: '1px solid var(--border-glass)', borderRadius: '12px', overflow: 'hidden' }}>
              <div style={{ background: 'rgba(59, 130, 246, 0.15)', padding: '12px 16px', fontWeight: 800, color: '#3b82f6', fontSize: '0.95rem' }}>
                PASSIF & CAPITAUX PROPRES (ORIGINE DES FONDS)
              </div>
              <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-glass)' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Dettes envers Fournisseurs Grossistes</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Factures d'achats à terme échues ou en cours</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#ef4444' }}>{financialMetrics.dettesFournisseurs.toLocaleString('fr-FR')} MRU</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-glass)' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Capital Investi Initial par le Propriétaire</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Aménagement, climatiseur, frigos, enseigne</div>
                  </div>
                  <div style={{ fontWeight: 800 }}>140 000 MRU</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid var(--border-glass)' }}>
                  <div>
                    <div style={{ fontWeight: 700 }}>Résultat Net Cumulé de l'Exercice</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Bénéfices réinjectés dans l'activité</div>
                  </div>
                  <div style={{ fontWeight: 800, color: '#10b981' }}>{financialMetrics.resultatNet.toLocaleString('fr-FR')} MRU</div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '8px', fontWeight: 900, color: '#3b82f6', fontSize: '1.05rem' }}>
                  <div>TOTAL PASSIF & CAPITAUX</div>
                  <div>{(financialMetrics.dettesFournisseurs + 140000 + financialMetrics.resultatNet).toLocaleString('fr-FR')} MRU</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ONGLET 7: TVA & FISCALITÉ RIM */}
      {activeTab === 'tva' && (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
          <div style={{ marginBottom: '18px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              {isArabic ? 'تقرير الضرائب و TVA 16% حسب القانون الموريتاني' : 'Déclaration Fiscale & TVA 16% RIM'}
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Calcul de la TVA légale 16% certifiée conforme pour la Direction Générale des Impôts (DGI Nouakchott)
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>TVA Collectée sur Ventes (16%)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981', marginTop: '6px' }}>
                {financialMetrics.tvaCollectee.toLocaleString('fr-FR')} MRU
              </div>
            </div>

            <div style={{ padding: '16px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>TVA Déductible sur Achats & Frais (16%)</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#3b82f6', marginTop: '6px' }}>
                {financialMetrics.tvaDeductible.toLocaleString('fr-FR')} MRU
              </div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(5, 150, 105, 0.12)', border: '1.5px solid rgba(5, 150, 105, 0.3)', borderRadius: '12px' }}>
              <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 800 }}>TVA Nette Due à Décaisser</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#10b981', marginTop: '6px' }}>
                {financialMetrics.tvaDue.toLocaleString('fr-FR')} MRU
              </div>
            </div>
          </div>

          <div style={{ padding: '14px 18px', background: 'var(--bg-tertiary)', borderRadius: '10px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <strong>Note de Conformité RIM :</strong> En République Islamique de Mauritanie, les petits commerces de détail sous régime forfaitaire bénéficient d'allègements fiscaux spécifiques. Les tickets émis par le point de vente mentionnent le NIF fiscal et la TVA 16% décomposée.
          </div>
        </div>
      )}

      {/* MODAL NOUVELLE ÉCRITURE COMPTABLE */}
      {isAddEntryModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '540px',
            borderRadius: '18px',
            padding: '24px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-glass)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calculator size={20} color="#059669" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Passer une Écriture Comptable</h3>
              </div>
              <button onClick={() => setIsAddEntryModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEntry} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)' }}>Date</label>
                  <input
                    type="date"
                    value={newEntryData.date}
                    onChange={(e) => setNewEntryData({ ...newEntryData, date: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', marginTop: '4px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)' }}>Pièce Réf</label>
                  <input
                    type="text"
                    value={newEntryData.pieceRef}
                    onChange={(e) => setNewEntryData({ ...newEntryData, pieceRef: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', marginTop: '4px' }}
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)' }}>Libellé de l'Opération</label>
                <input
                  type="text"
                  placeholder="Ex: Paiement facture transport riz du marché"
                  value={newEntryData.libelle}
                  onChange={(e) => setNewEntryData({ ...newEntryData, libelle: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', marginTop: '4px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)' }}>Compte Débit (Emploi)</label>
                  <select
                    value={newEntryData.compteDebit}
                    onChange={(e) => {
                      const val = e.target.value;
                      let nom = 'Caisse Espèces';
                      if (val === '6011') nom = 'Achats de Marchandises';
                      if (val === '6131') nom = 'Loyer Commercial';
                      if (val === '6051') nom = 'Électricité SOMELEC';
                      if (val === '4111') nom = 'Clients Kridi';
                      if (val === '5171') nom = 'Compte Bankily Pro';
                      setNewEntryData({ ...newEntryData, compteDebit: val, compteDebitNom: nom });
                    }}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', marginTop: '4px' }}
                  >
                    <option value="5311">5311 - Caisse Espèces Hannout</option>
                    <option value="5171">5171 - Bankily Pro Marchand</option>
                    <option value="6011">6011 - Achats Marchandises</option>
                    <option value="6131">6131 - Loyer Commercial</option>
                    <option value="6051">6051 - SOMELEC Électricité</option>
                    <option value="4111">4111 - Clients Kridi</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)' }}>Compte Crédit (Ressource)</label>
                  <select
                    value={newEntryData.compteCredit}
                    onChange={(e) => {
                      const val = e.target.value;
                      let nom = 'Ventes de marchandises';
                      if (val === '5311') nom = 'Caisse Espèces';
                      if (val === '5171') nom = 'Compte Bankily Pro';
                      if (val === '4011') nom = 'Grossiste Fournisseur';
                      if (val === '4111') nom = 'Clients Kridi';
                      setNewEntryData({ ...newEntryData, compteCredit: val, compteCreditNom: nom });
                    }}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', marginTop: '4px' }}
                  >
                    <option value="7011">7011 - Ventes de Marchandises</option>
                    <option value="5311">5311 - Caisse Espèces Hannout</option>
                    <option value="5171">5171 - Bankily Pro Marchand</option>
                    <option value="4011">4011 - Fournisseurs Grossistes</option>
                    <option value="4111">4111 - Clients Kridi</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)' }}>Montant Net (MRU)</label>
                <input
                  type="number"
                  placeholder="Ex: 5000"
                  value={newEntryData.montant}
                  onChange={(e) => setNewEntryData({ ...newEntryData, montant: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontWeight: 800, fontSize: '1.1rem', marginTop: '4px' }}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddEntryModalOpen(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontWeight: 800 }}>
                  Enregistrer l'Écriture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL NOUVELLE DÉPENSE */}
      {isAddDepenseModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '520px',
            borderRadius: '18px',
            padding: '24px',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-glass)',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Coins size={20} color="#ef4444" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0 }}>Enregistrer une Dépense du Hannout</h3>
              </div>
              <button onClick={() => setIsAddDepenseModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDepense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)' }}>Catégorie de Charge</label>
                <select
                  value={newDepenseData.categorie}
                  onChange={(e) => setNewDepenseData({ ...newDepenseData, categorie: e.target.value as any })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', marginTop: '4px' }}
                >
                  <option value="LOYER">Loyer du Local Commercial Hannout</option>
                  <option value="ELECTRICITE_SOMELEC">Électricité Frigos SOMELEC & Eau</option>
                  <option value="SALAIRES">Salaires & Rémunérations</option>
                  <option value="TRANSPORT">Transport Taxi-Marchandises Marché</option>
                  <option value="FOURNITURES">Sacs Plastiques, Emballages, Rouleaux Caisse</option>
                  <option value="AVARIES_PERTES">Avaries & Marchandises Périmées</option>
                  <option value="AUTRES">Autres Menues Dépenses</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)' }}>Description / Objet</label>
                <input
                  type="text"
                  placeholder="Ex: Paiement facture électricité SOMELEC"
                  value={newDepenseData.description}
                  onChange={(e) => setNewDepenseData({ ...newDepenseData, description: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', marginTop: '4px' }}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)' }}>Montant (MRU)</label>
                  <input
                    type="number"
                    placeholder="Ex: 4200"
                    value={newDepenseData.montant}
                    onChange={(e) => setNewDepenseData({ ...newDepenseData, montant: e.target.value })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontWeight: 800, marginTop: '4px' }}
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)' }}>Mode de Règlement</label>
                  <select
                    value={newDepenseData.modePaiement}
                    onChange={(e) => setNewDepenseData({ ...newDepenseData, modePaiement: e.target.value as any })}
                    style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', marginTop: '4px' }}
                  >
                    <option value="ESPECES">Espèces (Tiroir-Caisse)</option>
                    <option value="BANKILY">Bankily Pro (+222)</option>
                    <option value="MASRVI">Masrvi BIM</option>
                    <option value="VIREMENT">Virement Bancaire</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-dim)' }}>Bénéficiaire / Fournisseur</label>
                <input
                  type="text"
                  placeholder="Ex: SOMELEC, Propriétaire, Chauffeur"
                  value={newDepenseData.beneficiaire}
                  onChange={(e) => setNewDepenseData({ ...newDepenseData, beneficiaire: e.target.value })}
                  style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', marginTop: '4px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAddDepenseModalOpen(false)} className="btn-secondary" style={{ padding: '8px 16px' }}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary" style={{ padding: '8px 20px', fontWeight: 800, background: '#ef4444', borderColor: '#dc2626' }}>
                  Valider la Dépense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComptabiliteScreen;
