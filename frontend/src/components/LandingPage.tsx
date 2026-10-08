import React, { useState } from 'react';
import { 
  Store, 
  Package, 
  TrendingUp, 
  ChefHat, 
  BookOpen, 
  Smartphone, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  Scale, 
  Sparkles,
  UtensilsCrossed,
  ShoppingBag,
  ExternalLink,
  Bell,
  Activity,
  ArrowUpRight,
  Wifi,
  Battery,
  Layers,
  Phone,
  Globe,
  CreditCard,
  QrCode,
  Award,
  Download,
  Users
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { UserAccount } from './AuthModal';
import type { SectorType } from '../data/mockData';

interface LandingPageProps {
  onEnterApp: (tab?: string) => void;
  sector?: SectorType;
  setSector: (sector: SectorType) => void;
  theme?: 'dark' | 'light';
  setTheme?: (theme: 'dark' | 'light') => void;
  account?: UserAccount | null;
  onOpenAuthModal?: (mode?: 'register' | 'login', preSector?: SectorType) => void;
  onLogout?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  setSector,
  account,
  onOpenAuthModal,
  onLogout
}) => {
  const { i18n } = useTranslation();
  const [activePreviewTab, setActivePreviewTab] = useState<'pos' | 'kridi' | 'stock' | 'dashboard' | 'kds'>('pos');
  const [showcaseSector, setShowcaseSector] = useState<SectorType>('restaurant');
  const [restaurantCaptureTab, setRestaurantCaptureTab] = useState<'pos' | 'tables' | 'kds' | 'receipt'>('pos');
  const [marketCaptureTab, setMarketCaptureTab] = useState<'pos' | 'kridi' | 'nobarcode' | 'mobile'>('pos');
  const [butcherCaptureTab, setButcherCaptureTab] = useState<'scale' | 'tare' | 'ticket' | 'margins'>('scale');
  const [cosmeticsCaptureTab, setCosmeticsCaptureTab] = useState<'shades' | 'lots' | 'clients' | 'zreport'>('shades');
  const [subscriptionDays, setSubscriptionDays] = useState<number>(365);
  const [trialPhone, setTrialPhone] = useState<string>('');
  const [trialName, setTrialName] = useState<string>('');
  const [trialSuccess, setTrialSuccess] = useState<boolean>(false);

  // État pour la section Fidélité & Portefeuille Cartes Mauritanie
  const [selectedLoyaltyIndex, setSelectedLoyaltyIndex] = useState<number>(0);
  const [loyaltyScannedNotification, setLoyaltyScannedNotification] = useState<string | null>(null);

  const loyaltyCardsList = [
    {
      id: 'baraka',
      storeName: 'Supermarché Al-Baraka',
      category: 'Grande Distribution & Alimentation',
      city: 'Tevragh-Zeina, Nouakchott',
      colorGradient: 'linear-gradient(135deg, #059669 0%, #065f46 100%)',
      accentColor: '#10b981',
      tier: 'Membre Gold',
      points: 1450,
      rewardText: '145 MRU de réduction immédiate en caisse',
      cardNumber: 'RIM-8492-7710-99',
      qrCodeData: 'BARAKA-GOLD-RIM-8492',
      badge: '★ 5% Cashback',
      perks: ['Cashback automatique sur chaque ticket', 'Coupons exclusifs fruits & légumes', 'Passage prioritaire caisse rapide']
    },
    {
      id: 'khaima',
      storeName: 'Restaurant Al-Khaima',
      category: 'Gastronomie & Salons de Thé',
      city: 'Centre-Ville, Nouakchott',
      colorGradient: 'linear-gradient(135deg, #b45309 0%, #78350f 100%)',
      accentColor: '#f59e0b',
      tier: 'Club VIP Gourmet',
      points: 820,
      rewardText: 'Plat signature ou dessert offert dès 900 pts',
      cardNumber: 'RIM-2204-6188-33',
      qrCodeData: 'KHAIMA-VIP-RIM-2204',
      badge: '🍽️ Menu Privilège',
      perks: ['Table réservée garantie le weekend', '-15% sur les dîners de groupe', 'Thé à la menthe offert à chaque repas']
    },
    {
      id: 'oud',
      storeName: 'Oud El-Khaleej Parfums',
      category: 'Parfumerie, Bakhour & Cosmétiques',
      city: 'Marché Capitale & Tevragh',
      colorGradient: 'linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)',
      accentColor: '#a855f7',
      tier: 'Membre Prestige',
      points: 1200,
      rewardText: 'Flacon Bakhour Royal offert débloqué !',
      cardNumber: 'RIM-9011-3442-88',
      qrCodeData: 'OUD-ROYAL-RIM-9011',
      badge: '✨ Prestige Club',
      perks: ['Testeurs exclusifs d’essences d’Orient', 'Invitation aux ventes privées de fêtes', 'Emballage cadeau de luxe offert']
    },
    {
      id: 'medina_butcher',
      storeName: 'Boucherie Al-Medina',
      category: 'Boucherie Moderne & Viandes Fraîches',
      city: 'Ksar / Tevragh-Zeina',
      colorGradient: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
      accentColor: '#ef4444',
      tier: 'Client Privilège',
      points: 650,
      rewardText: '1 kg de viande fraîche offert à 800 pts',
      cardNumber: 'RIM-5510-9082-12',
      qrCodeData: 'MEDINA-MEAT-RIM-5510',
      badge: '🥩 Viande 100% Locale',
      perks: ['Pesée certifiée et découpe sur mesure', 'Offres spéciales méchoui Aïd & fêtes', 'Livraison prioritaire à domicile']
    },
    {
      id: 'medina_chic',
      storeName: 'Medina Chic Mode',
      category: 'Prêt-à-Porter & Accessoires',
      city: 'Avenue Moktar Ould Daddah',
      colorGradient: 'linear-gradient(135deg, #2563eb 0%, #1e3a8a 100%)',
      accentColor: '#3b82f6',
      tier: 'Silver Fashion',
      points: 480,
      rewardText: '-10% sur toute la nouvelle collection',
      cardNumber: 'RIM-3390-1123-54',
      qrCodeData: 'CHIC-SILVER-RIM-3390',
      badge: '👗 Tendance RIM',
      perks: ['Retouches gratuites en boutique', 'Points doublés les mercredis', 'Accès avant-première aux arrivages']
    }
  ];

  const handleSimulateLoyaltyScan = () => {
    const card = loyaltyCardsList[selectedLoyaltyIndex];
    setLoyaltyScannedNotification(`🎉 Carte ${card.storeName} scannée avec succès en caisse ! +50 points crédités.`);
    setTimeout(() => {
      setLoyaltyScannedNotification(null);
    }, 3500);
  };

  // États pour l'Application Mobile Interactive & Activité en Direct
  const [mobileTab, setMobileTab] = useState<'live' | 'payments' | 'top'>('live');
  const [liveSalesTotal, setLiveSalesTotal] = useState<number>(18450);
  const [liveTicketCount, setLiveTicketCount] = useState<number>(148);
  const [showPushNotification, setShowPushNotification] = useState<boolean>(true);
  const [pushNotificationText, setPushNotificationText] = useState<string>('⚡ Bankily : +1 100 MRU reçu (Table 4)');
  const [liveFeed, setLiveFeed] = useState([
    { id: 1, table: 'Table 4 (Ahmed)', detail: 'Méchoui d\'Agneau x2, Thé (3 Verres)', amount: 1100, method: 'Bankily', badgeColor: '#ea580c', time: 'À l\'instant' },
    { id: 2, table: 'Comptoir #1 (Fatimetou)', detail: 'Dorade Royale Grillée, Salade', amount: 450, method: 'Masrvi BIM', badgeColor: '#2563eb', time: 'Il y a 3 min' },
    { id: 3, table: 'Client Mohameden Fall', detail: 'Règlement Carnet de Dettes', amount: 1500, method: 'Kridi Soldé', badgeColor: '#9333ea', time: 'Il y a 7 min' },
    { id: 4, table: 'Emporter (Caisse 2)', detail: 'Riz au Poisson (Thieb) x2', amount: 300, method: 'Espèces Cash', badgeColor: '#10b981', time: 'Il y a 12 min' }
  ]);

  const handleSimulateSale = () => {
    const sampleSales = [
      { table: 'Table 2 (Terrasse)', detail: 'Méchoui d\'Agneau x1, Thé x2', amount: 650, method: 'Bankily', badgeColor: '#ea580c' },
      { table: 'Caisse #1 (Boutique)', detail: 'Parfum & Bakhour Mauritanie', amount: 800, method: 'Masrvi BIM', badgeColor: '#2563eb' },
      { table: 'Table 8 (VIP)', detail: 'Dorade Royale x2, Jus Bouye', amount: 950, method: 'Espèces Cash', badgeColor: '#10b981' },
      { table: 'Client Elemine Ould', detail: 'Acompte Carnet Kridi', amount: 500, method: 'Kridi Reçu', badgeColor: '#9333ea' }
    ];
    const picked = sampleSales[Math.floor(Math.random() * sampleSales.length)];
    const newEntry = {
      id: Date.now(),
      table: picked.table,
      detail: picked.detail,
      amount: picked.amount,
      method: picked.method,
      badgeColor: picked.badgeColor,
      time: 'À l\'instant'
    };
    setLiveFeed(prev => [newEntry, ...prev.slice(0, 3)]);
    setLiveSalesTotal(prev => prev + picked.amount);
    setLiveTicketCount(prev => prev + 1);
    setPushNotificationText(`⚡ ${picked.method} : +${picked.amount} MRU (${picked.table})`);
    setShowPushNotification(false);
    setTimeout(() => setShowPushNotification(true), 60);
  };

  // Pricing formula matching Caissa.mr (MRU)
  const basePricePerDay = 15; // 15 MRU / jour
  let effectiveRate = basePricePerDay;
  let discountPct = 0;

  if (subscriptionDays >= 365) {
    effectiveRate = 7.5; // -50%
    discountPct = 50;
  } else if (subscriptionDays >= 180) {
    effectiveRate = 8.5; // -43%
    discountPct = 43;
  } else if (subscriptionDays >= 90) {
    effectiveRate = 10.0; // -33%
    discountPct = 33;
  }

  const calculatedTotal = Math.round(subscriptionDays * effectiveRate);
  const originalTotal = subscriptionDays * basePricePerDay;
  const savings = originalTotal - calculatedTotal;

  const handleStartTrial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trialPhone) return;
    setTrialSuccess(true);
    setTimeout(() => {
      if (onOpenAuthModal) {
        onOpenAuthModal('register', 'restaurant');
      } else {
        onEnterApp('pos');
      }
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* 1. TOP ANNOUNCEMENT BANNER (PREMIUM SLEEK DESIGN) */}
      <div style={{
        background: 'linear-gradient(90deg, #022c22 0%, #065f46 50%, #047857 100%)',
        color: '#ffffff',
        padding: '7px 20px',
        textAlign: 'center',
        fontSize: '0.78rem',
        fontWeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
      }}>
        <span style={{
          background: 'rgba(255, 255, 255, 0.16)',
          color: '#a7f3d0',
          padding: '2px 8px',
          borderRadius: '999px',
          fontSize: '0.66rem',
          fontWeight: 800,
          letterSpacing: '0.03em',
          textTransform: 'uppercase'
        }}>
          🇲🇷 Mauritanie
        </span>
        <span style={{ color: '#ecfdf5' }}>
          {i18n.language === 'ar'
            ? 'عرض إطلاق حصري: خصم يصل إلى 50% مع 14 يوماً تجربة مجانية كاملة بدون التزام!'
            : "Offre Spéciale Lancement : Jusqu'à -50% sur l'abonnement annuel & 14 jours d'essai offerts !"}
        </span>
        <button 
          onClick={() => {
            const pricingEl = document.getElementById('pricing');
            if (pricingEl) pricingEl.scrollIntoView({ behavior: 'smooth' });
          }}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.35)',
            color: '#ffffff',
            padding: '2px 10px',
            borderRadius: '999px',
            fontSize: '0.72rem',
            cursor: 'pointer',
            fontWeight: 800,
            whiteSpace: 'nowrap',
            transition: 'all 0.15s ease'
          }}
        >
          {i18n.language === 'ar' ? 'عرض الأسعار ➔' : 'Voir les Tarifs ➔'}
        </button>
      </div>

      {/* 2. LANDING NAVBAR (PROFESSIONAL SAAS AESTHETIC) */}
      <header style={{
        borderBottom: '1px solid var(--border-glass)',
        background: 'rgba(255, 255, 255, 0.94)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(16px)',
        boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{
          maxWidth: '1380px',
          margin: '0 auto',
          padding: '11px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Logo & Brand */}
          <div 
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', flexShrink: 0 }} 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div style={{
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)',
              color: '#ffffff'
            }}>
              <Store size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                  Caissa<span style={{ color: '#10b981' }}>.mr</span>
                </span>
                <span style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  color: '#059669',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '1px 6px',
                  borderRadius: '5px',
                  fontSize: '0.64rem',
                  fontWeight: 800,
                  letterSpacing: '0.02em'
                }}>
                  MRU 🇲🇷
                </span>
              </div>
              <div style={{ fontSize: '0.67rem', color: 'var(--text-dim)', fontWeight: 500, letterSpacing: '-0.01em' }}>
                Point de Vente & Gestion Commerciale
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '22px', flexWrap: 'wrap' }}>
            <a href="#features" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600, whiteSpace: 'nowrap', transition: 'color 0.15s ease' }}>
              {i18n.language === 'ar' ? 'المميزات' : 'Fonctionnalités'}
            </a>
            <a href="#sectors" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600, whiteSpace: 'nowrap', transition: 'color 0.15s ease' }}>
              {i18n.language === 'ar' ? 'القطاعات' : 'Secteurs'}
            </a>
            <a href="#kridi" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600, whiteSpace: 'nowrap', transition: 'color 0.15s ease' }}>
              {i18n.language === 'ar' ? 'دفتر الكريدي' : 'Carnet Kridi'}
            </a>
            <a href="#fidelite" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px', whiteSpace: 'nowrap', transition: 'color 0.15s ease' }}>
              <span>{i18n.language === 'ar' ? 'بطاقات الولاء' : 'Fidélité'}</span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.12)',
                color: '#10b981',
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '1px 5px',
                borderRadius: '999px',
                border: '1px solid rgba(16, 185, 129, 0.25)'
              }}>
                {i18n.language === 'ar' ? 'جديد' : 'Nouveau'}
              </span>
            </a>
            <a href="#pricing" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600, whiteSpace: 'nowrap', transition: 'color 0.15s ease' }}>
              {i18n.language === 'ar' ? 'الأسعار' : 'Tarifs'}
            </a>
            <a href="#contact" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.84rem', fontWeight: 600, whiteSpace: 'nowrap', transition: 'color 0.15s ease' }}>
              {i18n.language === 'ar' ? 'التواصل' : 'Contact'}
            </a>
          </nav>

          {/* CTA Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            {/* Language Switcher */}
            <button
              onClick={() => i18n.changeLanguage(i18n.language === 'fr' ? 'ar' : 'fr')}
              style={{
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                padding: '6px 11px',
                borderRadius: '8px',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.78rem',
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
              title="Changer de langue / تغيير اللغة"
            >
              <Globe size={13} />
              <span>{i18n.language === 'fr' ? 'العربية' : 'Français'}</span>
            </button>

            {account ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  borderRadius: '8px',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  whiteSpace: 'nowrap'
                }}>
                  <UtensilsCrossed size={13} color="#10b981" />
                  <span style={{ color: 'var(--text-main)' }}>{account.businessName}</span>
                  <span style={{ fontSize: '0.62rem', background: '#10b981', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 800 }}>
                    {i18n.language === 'ar' ? '14 يوم' : 'Essai 14j'}
                  </span>
                </div>
                <button
                  onClick={() => onEnterApp('pos')}
                  style={{
                    padding: '7px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <Store size={14} />
                  <span>{i18n.language === 'ar' ? 'فتح نقطة البيع ➔' : 'Ouvrir ma Caisse ➔'}</span>
                </button>
                <button
                  onClick={onLogout}
                  style={{
                    padding: '7px 12px',
                    borderRadius: '8px',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                  title="Se déconnecter"
                >
                  {i18n.language === 'ar' ? 'خروج' : 'Déconnexion'}
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuthModal ? onOpenAuthModal('login') : onEnterApp('pos')}
                  style={{
                    padding: '7px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    border: '1px solid var(--border-glass)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-main)',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Store size={13} color="var(--text-muted)" />
                  <span>{i18n.language === 'ar' ? 'تسجيل الدخول' : 'Se Connecter'}</span>
                </button>

                <button
                  onClick={() => onOpenAuthModal ? onOpenAuthModal('register', 'restaurant') : onEnterApp('pos')}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 14px rgba(16, 185, 129, 0.35)',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Sparkles size={13} />
                  <span>{i18n.language === 'ar' ? 'تجربة مجانية (14 يوم)' : 'Essai Gratuit 14 Jours'}</span>
                  <ArrowRight size={13} />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* 3. HERO SECTION AVANCÉE & TRÈS PRO */}
      <section style={{
        padding: '70px 24px 50px',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Ambient Lighting Orbs & Tech Grid */}
        <div className="hero-ambient-orb-1" />
        <div className="hero-ambient-orb-2" />
        <div className="hero-grid-pattern" />

        {/* Floating Interactive Live Cards (Desktop & Tablets) */}
        <div className="hero-floating-card-1">
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.12), 0 0 20px rgba(16, 185, 129, 0.15)',
            borderRadius: '16px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(234, 88, 12, 0.15)',
              color: '#ea580c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Smartphone size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="pulse-live-dot" />
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Vente Bankily En Direct
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)', marginTop: '2px' }}>
                +1 450 MRU <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>(Table 4)</span>
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                Il y a 3s • Caisse Tevragh-Zeina
              </div>
            </div>
          </div>
        </div>

        <div className="hero-floating-card-2">
          <div style={{
            background: 'var(--bg-secondary)',
            border: '1px solid rgba(59, 130, 246, 0.35)',
            boxShadow: '0 16px 36px rgba(0, 0, 0, 0.12), 0 0 20px rgba(59, 130, 246, 0.15)',
            borderRadius: '16px',
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            backdropFilter: 'blur(12px)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(59, 130, 246, 0.15)',
              color: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Zap size={20} />
            </div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#3b82f6' }} />
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Mode 100% Hors-Ligne
                </span>
              </div>
              <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)', marginTop: '2px' }}>
                Encaissement Garanti
              </div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>
                Fonctionne sans coupure internet
              </div>
            </div>
          </div>
        </div>

        {/* Top Trust Badge */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            padding: '8px 20px',
            borderRadius: '999px',
            fontSize: '0.82rem',
            fontWeight: 800,
            marginBottom: '24px',
            boxShadow: '0 4px 20px rgba(16, 185, 129, 0.15)',
            backdropFilter: 'blur(10px)',
            transition: 'transform 0.2s ease'
          }}>
            <span className="pulse-live-dot" />
            <span style={{ color: '#10b981' }}>{i18n.language === 'fr' ? 'La Solution POS Cloud & Caisse Tactile n°1 en Mauritanie' : 'الحل السحابي رقم 1 لنقاط البيع في موريتانيا'}</span>
            <span style={{
              background: '#10b981',
              color: '#000000',
              fontSize: '0.62rem',
              fontWeight: 900,
              padding: '2px 7px',
              borderRadius: '6px',
              letterSpacing: '0.04em'
            }}>
              MRU 2026
            </span>
          </div>

          {/* Main Headline with Gradient Accent */}
          <h1 style={{
            fontSize: 'clamp(2.3rem, 4.8vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: '1.14',
            maxWidth: '960px',
            margin: '0 auto 16px',
            letterSpacing: '-0.03em',
            color: 'var(--text-main)',
            direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
          }}>
            {i18n.language === 'fr' ? 'La Caisse Enregistreuse Intelligente pour ' : 'نظام الكاشير الذكي الخاص بـ '}
            <span style={{
              color: '#10b981',
              display: 'inline-block'
            }}>
              {i18n.language === 'fr' ? 'Boutiques & Restaurants' : 'المحلات والمطاعم'}
            </span>
          </h1>

          {/* Arabic Subtitle */}
          <div style={{
            fontSize: 'clamp(1.15rem, 2.5vw, 1.7rem)',
            fontWeight: 800,
            color: '#10b981',
            direction: 'rtl',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
            <span>أحسن نظام سحابي لتسيير المحلات، المطاعم ونقاط البيع في موريتانيا</span>
            <span style={{ fontSize: '1.4rem' }}>🇲🇷</span>
          </div>

          {/* Value Prop Description with Highlight Badges */}
          <p style={{
            fontSize: '1.08rem',
            color: 'var(--text-muted)',
            maxWidth: '820px',
            margin: '0 auto 32px',
            lineHeight: '1.65',
            direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
          }}>
            {i18n.language === 'fr' ? (
              <>Encaissez en un éclair avec <strong style={{ color: '#ea580c' }}>Bankily (BPM)</strong>, <strong style={{ color: '#2563eb' }}>Masrvi (BIM)</strong> et Espèces. Maîtrisez vos dettes clients avec le <strong style={{ color: '#a855f7' }}>Carnet de Crédit (الكريدي)</strong>, gérez vos stocks et imprimez des tickets conformes <strong style={{ color: '#10b981' }}>NIF & TVA 16%</strong>, même sans connexion internet.</>
            ) : (
              <>حاسب زبائنك بسرعة البرق مع <strong style={{ color: '#ea580c' }}>بنكيلي (BPM)</strong>، <strong style={{ color: '#2563eb' }}>مصرفي (BIM)</strong> والنقد. تحكم في ديون الزبائن مع <strong style={{ color: '#a855f7' }}>دفتر الكريدي</strong>، أدر مخزونك واطبع تذاكر مطابقة لـ <strong style={{ color: '#10b981' }}>NIF & TVA 16%</strong>، حتى بدون إنترنت.</>
            )}
          </p>

          {/* Social Proof Rating */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            padding: '6px 16px',
            borderRadius: '999px',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            fontWeight: 600,
            direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
          }}>
            <span style={{ color: '#f59e0b', fontSize: '0.9rem', letterSpacing: '1px' }}>★★★★★</span>
            <span><strong>4.9/5</strong> {i18n.language === 'fr' ? 'plébiscité par +180 commerces et restaurants à Nouakchott & Nouadhibou' : 'معتمد من طرف +180 متجر ومطعم في نواكشوط ونواذيبو'}</span>
          </div>

          {/* Hero CTAs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            flexWrap: 'wrap',
            marginBottom: '40px'
          }}>
            <button
              onClick={() => {
                if (account) {
                  onEnterApp('pos');
                } else if (onOpenAuthModal) {
                  onOpenAuthModal('register', 'restaurant');
                } else {
                  onEnterApp('pos');
                }
              }}
              className="hero-cta-btn-primary"
            >
              <UtensilsCrossed size={18} />
              <span>
                {account 
                  ? (i18n.language === 'fr' ? 'Accéder à ma Caisse Restaurant ➔' : 'الدخول إلى الكاشير الخاص بي ➔') 
                  : (i18n.language === 'fr' ? 'Créer un Compte Restaurant (Essai 14j Gratuit)' : 'إنشاء حساب مطعم (14 يوم مجاناً)')}
              </span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => {
                if (account) {
                  onEnterApp('pos');
                } else if (onOpenAuthModal) {
                  onOpenAuthModal('login');
                } else {
                  onEnterApp('pos');
                }
              }}
              className="hero-cta-btn-glass"
            >
              <Store size={18} color="#10b981" />
              <span>
                {account 
                  ? (i18n.language === 'fr' ? 'Accéder à la Caisse POS' : 'فتح نقطة البيع') 
                  : (i18n.language === 'fr' ? 'Se Connecter à la Caisse' : 'تسجيل الدخول إلى نقطة البيع')}
              </span>
            </button>

            <button
              onClick={() => {
                if (account) {
                  onEnterApp('kridi');
                } else if (onOpenAuthModal) {
                  onOpenAuthModal('login');
                } else {
                  onEnterApp('kridi');
                }
              }}
              className="hero-cta-btn-glass"
            >
              <BookOpen size={18} color="#a855f7" />
              <span>
                {account 
                  ? (i18n.language === 'fr' ? 'Accéder au Carnet Kridi' : 'الدخول إلى دفتر الكريدي') 
                  : (i18n.language === 'fr' ? 'Carnet Kridi (Connexion)' : 'دفتر الكريدي (تسجيل الدخول)')}
              </span>
            </button>

            <a
              href="https://wa.me/22236322225"
              target="_blank"
              rel="noreferrer"
              className="hero-cta-btn-glass"
              style={{
                color: '#22c55e',
                borderColor: 'rgba(34, 197, 94, 0.45)',
                background: 'rgba(34, 197, 94, 0.08)'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
              <MessageSquare size={16} />
              <span>WhatsApp Conseiller (+222 36 32 22 25)</span>
            </a>
          </div>

          {/* Trust Badges */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            color: 'var(--text-dim)',
            fontSize: '0.85rem',
            fontWeight: 600,
            borderTop: '1px solid var(--border-glass)',
            paddingTop: '28px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: '999px', border: '1px solid var(--border-glass)' }}>
              <CheckCircle2 size={16} color="#10b981" />
              <span>15 Jours Gratuits sans carte bancaire</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: '999px', border: '1px solid var(--border-glass)' }}>
              <Zap size={16} color="#f59e0b" />
              <span>Mode Hors-Ligne (Fonctionne sans Internet)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: '999px', border: '1px solid var(--border-glass)' }}>
              <Smartphone size={16} color="#3b82f6" />
              <span>100% Compatible Bankily, Masrvi & TPE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--bg-secondary)', padding: '6px 14px', borderRadius: '999px', border: '1px solid var(--border-glass)' }}>
              <ShieldCheck size={16} color="#10b981" />
              <span>Factures avec NIF & TVA 16% RIM</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3.5. VITRINE INTERACTIVE MULTI-MÉTIERS : LES 4 CAISSES SPÉCIALISÉES EN DIRECT */}
      <section className="restaurant-showcase-section">
        {/* Sélecteur de Secteur Métier Principal de la Vitrine */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '28px'
        }}>
          {[
            { id: 'restaurant', label: '1. Restauration & Chwaya', icon: UtensilsCrossed, color: '#ea580c', badge: 'LE PLUS CHOISI' },
            { id: 'market', label: '2. Boutique & Hanout', icon: ShoppingBag, color: '#10b981', badge: '100% CODE-BARRES' },
            { id: 'butcher', label: '3. Boucherie & Vrac', icon: Scale, color: '#d97706', badge: 'VENTE AU KG' },
            { id: 'cosmetics', label: '4. Cosmétiques & Beauté', icon: ShieldCheck, color: '#0284c7', badge: 'LOTS & DLUO' }
          ].map(s => {
            const Icon = s.icon;
            const active = showcaseSector === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setShowcaseSector(s.id as any);
                  setSector(s.id as any);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '9px 18px',
                  borderRadius: '12px',
                  border: `1.5px solid ${active ? s.color : 'var(--border-glass)'}`,
                  background: active ? `linear-gradient(135deg, ${s.color}22, ${s.color}08)` : 'var(--bg-card)',
                  color: active ? 'var(--text-main)' : 'var(--text-muted)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: active ? `0 8px 20px -6px ${s.color}40` : 'none',
                  transition: 'all 0.25s ease'
                }}
              >
                <div style={{ color: s.color, display: 'flex' }}>
                  <Icon size={17} />
                </div>
                <span>{s.label}</span>
                <span style={{
                  fontSize: '0.62rem',
                  padding: '2px 7px',
                  borderRadius: '999px',
                  background: active ? s.color : 'var(--bg-tertiary)',
                  color: active ? '#ffffff' : 'var(--text-dim)',
                  fontWeight: 900
                }}>
                  {s.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* En-tête Dynamique selon le Secteur */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: showcaseSector === 'restaurant' ? 'rgba(234, 88, 12, 0.12)' : showcaseSector === 'market' ? 'rgba(16, 185, 129, 0.12)' : showcaseSector === 'butcher' ? 'rgba(217, 119, 6, 0.12)' : 'rgba(2, 132, 199, 0.12)',
            border: `1px solid ${showcaseSector === 'restaurant' ? 'rgba(234, 88, 12, 0.35)' : showcaseSector === 'market' ? 'rgba(16, 185, 129, 0.35)' : showcaseSector === 'butcher' ? 'rgba(217, 119, 6, 0.35)' : 'rgba(2, 132, 199, 0.35)'}`,
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: showcaseSector === 'restaurant' ? '#ea580c' : showcaseSector === 'market' ? '#10b981' : showcaseSector === 'butcher' ? '#d97706' : '#0284c7',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '12px'
          }}>
            {showcaseSector === 'restaurant' && <UtensilsCrossed size={14} />}
            {showcaseSector === 'market' && <ShoppingBag size={14} />}
            {showcaseSector === 'butcher' && <Scale size={14} />}
            {showcaseSector === 'cosmetics' && <ShieldCheck size={14} />}
            <span>
              {showcaseSector === 'restaurant' && 'Spécial Restaurants, Cafés & Chwaya Mauritanie'}
              {showcaseSector === 'market' && 'Spécial Boutiques, Épiceries & Hanout Mauritanie'}
              {showcaseSector === 'butcher' && 'Spécial Boucheries, Poissonneries & Marché en Vrac'}
              {showcaseSector === 'cosmetics' && 'Spécial Cosmétiques, Parfumerie & Parapharmacie'}
            </span>
            <span style={{ 
              background: showcaseSector === 'restaurant' ? '#ea580c' : showcaseSector === 'market' ? '#10b981' : showcaseSector === 'butcher' ? '#d97706' : '#0284c7', 
              color: '#fff', fontSize: '0.62rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 900 
            }}>
              SUR-MESURE
            </span>
          </div>

          <h2 style={{ 
            fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', 
            fontWeight: 900, 
            letterSpacing: '-0.02em', 
            margin: '0 0 10px',
            color: 'var(--text-main)',
            direction: i18n.language === 'ar' ? 'rtl' : 'ltr'
          }}>
            {i18n.language === 'ar' ? (
              <>
                {showcaseSector === 'restaurant' && 'نظام متكامل للمطاعم و '}
                {showcaseSector === 'market' && 'كاشير فائق السرعة و '}
                {showcaseSector === 'butcher' && 'ميزان إلكتروني متصل و '}
                {showcaseSector === 'cosmetics' && 'إدارة الأصناف والصلاحية و '}
                <span style={{
                  color: showcaseSector === 'restaurant' 
                    ? '#ea580c' 
                    : showcaseSector === 'market' 
                    ? '#10b981' 
                    : showcaseSector === 'butcher' 
                    ? '#d97706' 
                    : '#0284c7'
                }}>
                  {showcaseSector === 'restaurant' && 'مباشر وشديد السلاسة'}
                  {showcaseSector === 'market' && 'دفتر كريدي ذكي'}
                  {showcaseSector === 'butcher' && 'حساب سعر الكيلوغرام'}
                  {showcaseSector === 'cosmetics' && 'تتبع دقيق للصلاحية DLUO'}
                </span>
              </>
            ) : (
              <>
                {showcaseSector === 'restaurant' && 'Un Système Restaurant Complet & '}
                {showcaseSector === 'market' && 'Caisse Douchette Ultra-Rapide & '}
                {showcaseSector === 'butcher' && 'Pesée Connectée en Direct & '}
                {showcaseSector === 'cosmetics' && 'Gestion Parfaite des Nuances, Lots & '}
                <span style={{
                  color: showcaseSector === 'restaurant' 
                    ? '#ea580c' 
                    : showcaseSector === 'market' 
                    ? '#10b981' 
                    : showcaseSector === 'butcher' 
                    ? '#d97706' 
                    : '#0284c7'
                }}>
                  {showcaseSector === 'restaurant' && 'Ultra-Fluide en Direct'}
                  {showcaseSector === 'market' && 'Carnet Kridi Intelligent'}
                  {showcaseSector === 'butcher' && 'Calcul Prix au Kilogramme'}
                  {showcaseSector === 'cosmetics' && 'Péremptions DLUO'}
                </span>
              </>
            )}
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', maxWidth: '780px', margin: '0 auto', lineHeight: '1.6' }}>
            {showcaseSector === 'restaurant' && "Découvrez en direct l'interface tactile utilisée par les serveurs, le plan de table 2D interactif, l'écran cuisine KDS sans fil et l'impression automatique des tickets d'addition en MRU."}
            {showcaseSector === 'market' && "Lecture code-barres instantanée (< 0.2s), carnet de crédit Kridi (الكريدي) avec NNI et alertes SMS de relance, gestion des articles sans code-barres et rapprochement Bankily / Masrvi."}
            {showcaseSector === 'butcher' && "Vente au poids de Viande de Chameau (حوار), Agneau du pays et Poisson Thiof. Connexion balance directe, déduction automatique de la tare barquette, impression ticket avec poids exact au gramme."}
            {showcaseSector === 'cosmetics' && "Nuancier de teintes pour rouges à lèvres et fonds de teint, traçabilité des lots et dates d'expiration (DLUO), fiches clientes beauté et clôtures Z certifiées conformes."}
          </p>
        </div>

        {/* Sélecteur d'onglets pour le secteur Restauration */}
        {showcaseSector === 'restaurant' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {[
              { id: 'pos', label: '1. Prise de Commande Tactile', icon: Store, badge: 'Rapide < 5s' },
              { id: 'tables', label: '2. Plan de Tables & Salons', icon: UtensilsCrossed, badge: 'Salles VIP & Terrasse' },
              { id: 'kds', label: '3. Écran Cuisine KDS', icon: ChefHat, badge: 'Zéro Papier' },
              { id: 'receipt', label: '4. Ticket & Rapprochement Bankily', icon: Sparkles, badge: 'NIF & TVA 16%' }
            ].map(tab => {
              const Icon = tab.icon;
              const active = restaurantCaptureTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setRestaurantCaptureTab(tab.id as any)}
                  className={`restaurant-tab-pill ${active ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: active ? 'rgba(255, 255, 255, 0.22)' : 'var(--bg-tertiary)',
                    color: active ? '#ffffff' : 'var(--text-dim)',
                    fontWeight: 800
                  }}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Sélecteur d'onglets pour le secteur Boutique */}
        {showcaseSector === 'market' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {[
              { id: 'pos', label: '1. Scan Douchette Ultra-Rapide', icon: Store, badge: '< 0.2s / Article' },
              { id: 'kridi', label: '2. Carnet Kridi Client (الكريدي)', icon: BookOpen, badge: 'Plafonds & SMS' },
              { id: 'nobarcode', label: '3. Raccourcis Sans Code-Barres', icon: Zap, badge: 'Pain & Recharges' },
              { id: 'mobile', label: '4. Validation Bankily & Masrvi', icon: Smartphone, badge: 'Zéro Écart' }
            ].map(tab => {
              const Icon = tab.icon;
              const active = marketCaptureTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setMarketCaptureTab(tab.id as any)}
                  className={`restaurant-tab-pill ${active ? 'active' : ''}`}
                  style={{ borderColor: active ? '#10b981' : undefined, background: active ? '#10b981' : undefined }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: active ? 'rgba(255, 255, 255, 0.22)' : 'var(--bg-tertiary)',
                    color: active ? '#ffffff' : 'var(--text-dim)',
                    fontWeight: 800
                  }}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Sélecteur d'onglets pour le secteur Boucherie */}
        {showcaseSector === 'butcher' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {[
              { id: 'scale', label: '1. Balance Connectée en Direct', icon: Scale, badge: 'Port COM / USB' },
              { id: 'tare', label: '2. Calculateur Prix/Kg & Tare', icon: Zap, badge: 'Tare Déduite' },
              { id: 'ticket', label: '3. Ticket Poids Net au Gramme', icon: Sparkles, badge: 'Exactitude 100%' },
              { id: 'margins', label: '4. Suivi Rendement & Découpe', icon: TrendingUp, badge: 'Marges Nettes' }
            ].map(tab => {
              const Icon = tab.icon;
              const active = butcherCaptureTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setButcherCaptureTab(tab.id as any)}
                  className={`restaurant-tab-pill ${active ? 'active' : ''}`}
                  style={{ borderColor: active ? '#d97706' : undefined, background: active ? '#d97706' : undefined }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: active ? 'rgba(255, 255, 255, 0.22)' : 'var(--bg-tertiary)',
                    color: active ? '#ffffff' : 'var(--text-dim)',
                    fontWeight: 800
                  }}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Sélecteur d'onglets pour le secteur Cosmétiques */}
        {showcaseSector === 'cosmetics' && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
            {[
              { id: 'shades', label: '1. Nuancier Teintes & Couleurs', icon: Sparkles, badge: 'Nuances Lèvres/Teint' },
              { id: 'lots', label: '2. Traçabilité Lots & DLUO', icon: ShieldCheck, badge: 'Dates Péremption' },
              { id: 'clients', label: '3. Fiches Clientes Beauté', icon: Store, badge: 'Historique Soins' },
              { id: 'zreport', label: '4. Clôture Z & TVA 16% RIM', icon: BookOpen, badge: 'Certifié Conforme' }
            ].map(tab => {
              const Icon = tab.icon;
              const active = cosmeticsCaptureTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setCosmeticsCaptureTab(tab.id as any)}
                  className={`restaurant-tab-pill ${active ? 'active' : ''}`}
                  style={{ borderColor: active ? '#0284c7' : undefined, background: active ? '#0284c7' : undefined }}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                  <span style={{
                    fontSize: '0.68rem',
                    padding: '2px 8px',
                    borderRadius: '999px',
                    background: active ? 'rgba(255, 255, 255, 0.22)' : 'var(--bg-tertiary)',
                    color: active ? '#ffffff' : 'var(--text-dim)',
                    fontWeight: 800
                  }}>
                    {tab.badge}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Cadre Mockup Haute Définition avec la capture sélectionnée & badges flottants */}
        <div className="restaurant-mockup-frame">
          {/* Topbar style macOS / Tablette Métier */}
          <div className="restaurant-mockup-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ marginLeft: '12px', fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>
                {showcaseSector === 'restaurant' && restaurantCaptureTab === 'tables' && 'caissa.mr/restaurant/plan-de-tables • Salle Principale & Terrasse'}
                {showcaseSector === 'restaurant' && restaurantCaptureTab === 'kds' && 'caissa.mr/restaurant/cuisine-kds • Écran Chef Cuisinier en Direct'}
                {showcaseSector === 'restaurant' && restaurantCaptureTab === 'pos' && 'caissa.mr/restaurant/caisse-tactile • Prise de Commande & Menu'}
                {showcaseSector === 'restaurant' && restaurantCaptureTab === 'receipt' && 'caissa.mr/restaurant/ticket • Rapprochement Bankily / Masrvi'}

                {showcaseSector === 'market' && marketCaptureTab === 'pos' && 'caissa.mr/boutique/douchette • Scan Douchette < 0.2s'}
                {showcaseSector === 'market' && marketCaptureTab === 'kridi' && 'caissa.mr/boutique/carnet-kridi • Carnet de Crédit (الكريدي) & Relances'}
                {showcaseSector === 'market' && marketCaptureTab === 'nobarcode' && 'caissa.mr/boutique/sans-code-barres • Baguettes & Recharges Télécom'}
                {showcaseSector === 'market' && marketCaptureTab === 'mobile' && 'caissa.mr/boutique/mobile-money • Validation Bankily & Masrvi'}

                {showcaseSector === 'butcher' && butcherCaptureTab === 'scale' && 'caissa.mr/boucherie/balance-directe • Pesée Électronique Connectée'}
                {showcaseSector === 'butcher' && butcherCaptureTab === 'tare' && 'caissa.mr/boucherie/tare-automatique • Déduction Poids Barquette & Prix Kg'}
                {showcaseSector === 'butcher' && butcherCaptureTab === 'ticket' && 'caissa.mr/boucherie/ticket-poids • Ticket Poids Net & Mentions Légales'}
                {showcaseSector === 'butcher' && butcherCaptureTab === 'margins' && 'caissa.mr/boucherie/rendement • Suivi Pertes & Rendement Découpe'}

                {showcaseSector === 'cosmetics' && cosmeticsCaptureTab === 'shades' && 'caissa.mr/cosmetiques/nuancier • Teintes Rouges à Lèvres & Fonds de Teint'}
                {showcaseSector === 'cosmetics' && cosmeticsCaptureTab === 'lots' && 'caissa.mr/cosmetiques/lots-dluo • Traçabilité Lots & Alertes Péremption'}
                {showcaseSector === 'cosmetics' && cosmeticsCaptureTab === 'clients' && 'caissa.mr/cosmetiques/fiches-clientes • Historique d\'Achat & Soins'}
                {showcaseSector === 'cosmetics' && cosmeticsCaptureTab === 'zreport' && 'caissa.mr/cosmetiques/cloture-z • Clôture Fiscale Z & TVA 16% RIM'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="pulse-live-dot" />
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Système Actif en Ligne
              </span>
              <button
                onClick={() => {
                  if (!account) {
                    if (onOpenAuthModal) onOpenAuthModal('register', showcaseSector);
                    else onEnterApp('pos');
                    return;
                  }
                  setSector(showcaseSector);
                  onEnterApp(
                    showcaseSector === 'restaurant'
                      ? (restaurantCaptureTab === 'tables' ? 'tables' : restaurantCaptureTab === 'kds' ? 'kds' : 'pos')
                      : 'pos'
                  );
                }}
                className="btn-primary"
                style={{ 
                  padding: '4px 12px', 
                  fontSize: '0.75rem', 
                  fontWeight: 800, 
                  borderRadius: '6px', 
                  marginLeft: '6px',
                  background: showcaseSector === 'restaurant' ? '#ea580c' : showcaseSector === 'market' ? '#10b981' : showcaseSector === 'butcher' ? '#d97706' : '#0284c7'
                }}
              >
                {account ? 'Tester ce mode ➔' : 'Activer ce mode (Essai) ➔'}
              </button>
            </div>
          </div>

          {/* Zone d'affichage de la capture d'écran avec badges flottants */}
          <div style={{ position: 'relative', width: '100%', minHeight: '380px', maxHeight: '620px', overflow: 'hidden', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* L'image de capture réelle selon le secteur et l'onglet */}
            <img
              src={
                showcaseSector === 'restaurant'
                  ? (restaurantCaptureTab === 'tables'
                    ? '/screenshots/tables_restaurant_screen_1791315425516.png'
                    : restaurantCaptureTab === 'kds'
                    ? '/screenshots/kds_restaurant_screen_1791315455733.png'
                    : restaurantCaptureTab === 'pos'
                    ? '/screenshots/pos_restaurant_screen_photos.png'
                    : '/screenshots/payment_receipt_success_1791318272048.png')
                  : showcaseSector === 'market'
                  ? '/screenshots/pos_boutique_demo_1791314735684.png'
                  : showcaseSector === 'butcher'
                  ? '/screenshots/pos_restaurant_screen_photos.png'
                  : '/screenshots/pos_boutique_demo_1791314735684.png'
              }
              alt="Capture Système Caissa"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
                transition: 'transform 0.4s ease, opacity 0.3s ease',
                maxHeight: '620px'
              }}
            />

            {/* Badges Flottants Interactifs Animés : RESTAURANT */}
            {showcaseSector === 'restaurant' && restaurantCaptureTab === 'tables' && (
              <>
                <div className="restaurant-floating-badge restaurant-badge-1">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <UtensilsCrossed size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#ef4444', fontWeight: 800, textTransform: 'uppercase' }}>🔴 Table 4 Occupée</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Méchoui d'Agneau • 1 450 MRU</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Temps : 45 min • Serveur Ahmed</div>
                  </div>
                </div>

                <div className="restaurant-floating-badge restaurant-badge-2">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <CheckCircle2 size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>🟢 Table 2 Prête</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Terrasse Extérieure • 4 Couverts</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Prête pour installation client</div>
                  </div>
                </div>
              </>
            )}

            {showcaseSector === 'restaurant' && restaurantCaptureTab === 'kds' && (
              <>
                <div className="restaurant-floating-badge restaurant-badge-1">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(234, 88, 12, 0.2)', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ChefHat size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#ea580c', fontWeight: 800, textTransform: 'uppercase' }}>⏳ En Cuisson (12 min)</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Table 8 VIP • 2x Dorade Royale</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Alerte sonore automatique au chef</div>
                  </div>
                </div>

                <div className="restaurant-floating-badge restaurant-badge-2">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>✅ Prêt pour le Service</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Table 1 • Riz au Poisson (Thieb)</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Notification serveur envoyée</div>
                  </div>
                </div>
              </>
            )}

            {showcaseSector === 'restaurant' && restaurantCaptureTab === 'pos' && (
              <>
                <div className="restaurant-floating-badge" style={{ bottom: '30px', left: '30px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Store size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#3b82f6', fontWeight: 800, textTransform: 'uppercase' }}>⚡ Prise de Commande Tactile</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Photos HD & Plats Traditionnels</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Thieb, Méchoui, Chwaya, Atay mauritanien</div>
                  </div>
                </div>

                <div className="restaurant-floating-badge" style={{ bottom: '30px', right: '30px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>⚡ Envoi Cuisine Immédiat</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Impression ou Écran KDS</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Affectation directe à la Table 1</div>
                  </div>
                </div>
              </>
            )}

            {showcaseSector === 'restaurant' && restaurantCaptureTab === 'receipt' && (
              <>
                <div className="restaurant-floating-badge restaurant-badge-1">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(234, 88, 12, 0.2)', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Smartphone size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#ea580c', fontWeight: 800, textTransform: 'uppercase' }}>⚡ Bankily Validé</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>+1 450 MRU Reçu Instantanément</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Notification SMS & QR Code client</div>
                  </div>
                </div>

                <div className="restaurant-floating-badge restaurant-badge-2">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>🧾 Ticket Légal NIF / TVA 16%</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Imprimante Thermique 80mm</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Conforme réglementation Mauritanie</div>
                  </div>
                </div>
              </>
            )}

            {/* Badges Flottants Interactifs Animés : BOUTIQUE */}
            {showcaseSector === 'market' && (
              <>
                <div className="restaurant-floating-badge restaurant-badge-1">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>⚡ Scan Douchette Ultra-Rapide</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Lait Gloria 400g • 140 MRU</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Code 2222000104 scanné en 0.18s</div>
                  </div>
                </div>

                <div className="restaurant-floating-badge restaurant-badge-2">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(217, 119, 6, 0.2)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 800, textTransform: 'uppercase' }}>📖 Carnet Kridi (الكريدي)</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Cheikh Ould Sidi • Dette: 850 MRU</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Plafond 5 000 MRU • SMS de relance envoyé</div>
                  </div>
                </div>
              </>
            )}

            {/* Badges Flottants Interactifs Animés : BOUCHERIE */}
            {showcaseSector === 'butcher' && (
              <>
                <div className="restaurant-floating-badge restaurant-badge-1">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(217, 119, 6, 0.2)', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Scale size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#d97706', fontWeight: 800, textTransform: 'uppercase' }}>⚖️ Balance Connectée en Direct</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Viande Chameau Hwar : 1.450 kg</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Prix au kg : 280 MRU • Total: 406 MRU</div>
                  </div>
                </div>

                <div className="restaurant-floating-badge restaurant-badge-2">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.2)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>🐟 Marché aux Poissons Nouakchott</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Thiof / Mérou Frais : 2.100 kg</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Tare barquette déduite automatiquement</div>
                  </div>
                </div>
              </>
            )}

            {/* Badges Flottants Interactifs Animés : COSMÉTIQUES */}
            {showcaseSector === 'cosmetics' && (
              <>
                <div className="restaurant-floating-badge restaurant-badge-1">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(2, 132, 199, 0.2)', color: '#0284c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Sparkles size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#0284c7', fontWeight: 800, textTransform: 'uppercase' }}>💄 Nuancier Teinte Confirmée</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Rouge à Lèvres #02 Rose Pêche</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>L'Oréal Paris • 250 MRU au comptoir</div>
                  </div>
                </div>

                <div className="restaurant-floating-badge restaurant-badge-2">
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>🌿 Traçabilité DLUO Certifiée</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800 }}>Crème CeraVe 454g • Lot #9821-CR</div>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Date expiration: 11/2026 • Zéro périmé</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Bandeau d'information sous la capture avec 3 piliers selon le secteur */}
          <div style={{
            background: 'var(--bg-card)',
            borderTop: '1px solid var(--border-glass)',
            padding: '20px 24px',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '16px',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '42px', height: '42px', borderRadius: '12px', 
                background: showcaseSector === 'restaurant' ? 'rgba(16, 185, 129, 0.12)' : showcaseSector === 'market' ? 'rgba(16, 185, 129, 0.12)' : showcaseSector === 'butcher' ? 'rgba(217, 119, 6, 0.12)' : 'rgba(2, 132, 199, 0.12)', 
                color: showcaseSector === 'restaurant' ? '#10b981' : showcaseSector === 'market' ? '#10b981' : showcaseSector === 'butcher' ? '#d97706' : '#0284c7', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
              }}>
                {showcaseSector === 'restaurant' && <UtensilsCrossed size={20} />}
                {showcaseSector === 'market' && <Zap size={20} />}
                {showcaseSector === 'butcher' && <Scale size={20} />}
                {showcaseSector === 'cosmetics' && <Sparkles size={20} />}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                  {showcaseSector === 'restaurant' && 'Plan de Salle Sur-Mesure'}
                  {showcaseSector === 'market' && 'Scan Douchette < 0.2s'}
                  {showcaseSector === 'butcher' && 'Balance USB & Port Série'}
                  {showcaseSector === 'cosmetics' && 'Nuancier Teintes & Couleurs'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {showcaseSector === 'restaurant' && 'Glissez-déposez vos tables (VIP, Terrasse, Salons)'}
                  {showcaseSector === 'market' && 'Encaissement ultra-fluide des articles à code-barres'}
                  {showcaseSector === 'butcher' && 'Pesée directe et déduction automatique de tare'}
                  {showcaseSector === 'cosmetics' && 'Sélection visuelle des variantes et nuances maquillage'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '42px', height: '42px', borderRadius: '12px', 
                background: showcaseSector === 'restaurant' ? 'rgba(234, 88, 12, 0.12)' : showcaseSector === 'market' ? 'rgba(217, 119, 6, 0.12)' : showcaseSector === 'butcher' ? 'rgba(234, 88, 12, 0.12)' : 'rgba(16, 185, 129, 0.12)', 
                color: showcaseSector === 'restaurant' ? '#ea580c' : showcaseSector === 'market' ? '#d97706' : showcaseSector === 'butcher' ? '#ea580c' : '#10b981', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
              }}>
                {showcaseSector === 'restaurant' && <ChefHat size={20} />}
                {showcaseSector === 'market' && <BookOpen size={20} />}
                {showcaseSector === 'butcher' && <TrendingUp size={20} />}
                {showcaseSector === 'cosmetics' && <ShieldCheck size={20} />}
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                  {showcaseSector === 'restaurant' && 'KDS Cuisine Connecté'}
                  {showcaseSector === 'market' && 'Carnet Kridi (الكريدي)'}
                  {showcaseSector === 'butcher' && 'Suivi Pertes & Rendement'}
                  {showcaseSector === 'cosmetics' && 'Traçabilité Lots & DLUO'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {showcaseSector === 'restaurant' && 'Chronomètres de cuisson et alertes de retard'}
                  {showcaseSector === 'market' && 'Plafonds de crédit et relances SMS automatiques'}
                  {showcaseSector === 'butcher' && 'Calcul des marges brutes de découpe et parages'}
                  {showcaseSector === 'cosmetics' && 'Alertes préventives sur les dates de péremption'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ 
                width: '42px', height: '42px', borderRadius: '12px', 
                background: showcaseSector === 'restaurant' ? 'rgba(59, 130, 246, 0.12)' : showcaseSector === 'market' ? 'rgba(59, 130, 246, 0.12)' : showcaseSector === 'butcher' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(59, 130, 246, 0.12)', 
                color: showcaseSector === 'restaurant' ? '#3b82f6' : showcaseSector === 'market' ? '#3b82f6' : showcaseSector === 'butcher' ? '#10b981' : '#3b82f6', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 
              }}>
                <Smartphone size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                  {showcaseSector === 'restaurant' && 'Prise de Commande Mobile'}
                  {showcaseSector === 'market' && 'Rapprochement Bankily / Masrvi'}
                  {showcaseSector === 'butcher' && 'Ticket avec Poids Net Homologué'}
                  {showcaseSector === 'cosmetics' && 'Clôtures Z & TVA 16% RIM'}
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {showcaseSector === 'restaurant' && 'Serveurs équipés de téléphones ou tablettes'}
                  {showcaseSector === 'market' && 'Validation instantanée des paiements sans erreur'}
                  {showcaseSector === 'butcher' && 'Impression thermique 80mm conforme'}
                  {showcaseSector === 'cosmetics' && 'Clôture comptable inaltérable et conforme'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. LIVE INTERACTIVE SHOWCASE (TABBED PRODUCT PREVIEWS) */}
      <section style={{
        padding: '30px 24px 60px',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0 0 8px' }}>
            Explorez les Modules du SaaS Caissa
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', margin: 0 }}>
            Cliquez sur un module pour prévisualiser l'interface de travail de votre établissement.
          </p>
        </div>

        {/* Interactive Selector Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '20px'
        }}>
          {[
            { id: 'pos', label: 'Caisse Tactile POS', icon: Store, count: 'Paiements MRU' },
            { id: 'kridi', label: 'الكريدي (Carnet Dettes)', icon: BookOpen, count: 'Plafonds & SMS' },
            { id: 'stock', label: 'Gestion des Stocks', icon: Package, count: 'Inventaire & Coûts' },
            { id: 'dashboard', label: 'Marges & CA Réel', icon: TrendingUp, count: 'Bénéfice Net' },
            { id: 'kds', label: 'Cuisine KDS & Tables', icon: ChefHat, count: 'Restauration' }
          ].map(tab => {
            const Icon = tab.icon;
            const active = activePreviewTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePreviewTab(tab.id as any)}
                style={{
                  background: active ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
                  border: `1px solid ${active ? 'transparent' : 'var(--border-glass)'}`,
                  color: active ? '#ffffff' : 'var(--text-muted)',
                  padding: '10px 18px',
                  borderRadius: 'var(--radius-md)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  boxShadow: active ? '0 2px 8px rgba(5, 150, 105, 0.3)' : 'none',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
                <span style={{
                  fontSize: '0.7rem',
                  background: active ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-tertiary)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Tab Preview Mockup Box */}
        <div className="glass-panel" style={{
          borderRadius: 'var(--radius-xl)',
          border: '1px solid var(--border-glass)',
          padding: '24px',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}>
          {/* Top fake browser bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-glass)',
            paddingBottom: '14px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: '12px', fontFamily: 'monospace' }}>
                https://go.caissa.mr/{activePreviewTab}
              </span>
            </div>

            <button
              onClick={() => {
                if (!account) {
                  if (onOpenAuthModal) onOpenAuthModal('login');
                  else onEnterApp(activePreviewTab);
                  return;
                }
                onEnterApp(activePreviewTab);
              }}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>{account ? 'Ouvrir ce module dans le SaaS' : 'Se Connecter pour Ouvrir'}</span>
              <ExternalLink size={14} />
            </button>
          </div>

          {/* Module Content Preview */}
          {activePreviewTab === 'pos' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#22c55e', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  Module Caisse Tactile & Encaissement
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 12px' }}>
                  Une Caisse Ultra-Rapide avec Bankily, Masrvi & Espèces
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Catalogue tactile avec photos, recherche instantanée par code-barres ou nom en arabe/français. Encaissement fractionné, raccourcis de coupures mauritaniennes (50, 100, 200, 500, 1000 MRU) et impression thermique instantanée avec NIF & TVA 16%.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <CheckCircle2 size={16} color="#10b981" /> Télé-collecte mobile Bankily (+222) et code marchand Masrvi BIM
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <CheckCircle2 size={16} color="#10b981" /> Calculateur de rendu de monnaie et mise en attente de tickets
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <CheckCircle2 size={16} color="#10b981" /> Pesée d'articles au kg pour poissonnerie & boucherie
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                padding: '20px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>Simulation Panier POS</span>
                  <span style={{ color: '#22c55e', fontWeight: 800 }}>380 MRU</span>
                </div>
                <div style={{ fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
                    <span>2x Thieb Poisson (Ceebu Jën)</span>
                    <span style={{ fontWeight: 700 }}>300 MRU</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
                    <span>2x Jus de Bissap Frais</span>
                    <span style={{ fontWeight: 700 }}>80 MRU</span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '14px' }}>
                  <button onClick={() => {
                    if (!account) {
                      if (onOpenAuthModal) onOpenAuthModal('login');
                      else onEnterApp('pos');
                    } else {
                      onEnterApp('pos');
                    }
                  }} className="btn-secondary" style={{ padding: '8px', fontSize: '0.75rem', color: '#f97316' }}>
                    📱 Payer par Bankily
                  </button>
                  <button onClick={() => {
                    if (!account) {
                      if (onOpenAuthModal) onOpenAuthModal('login');
                      else onEnterApp('pos');
                    } else {
                      onEnterApp('pos');
                    }
                  }} className="btn-secondary" style={{ padding: '8px', fontSize: '0.75rem', color: '#60a5fa' }}>
                    📱 Payer par Masrvi
                  </button>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'kridi' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#c084fc', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  Module Carnet de Crédit Client (البيع بالكريدي)
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 12px' }}>
                  Fini les Cahiers Papier Perdus ou Contestés
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Attribuez un compte de crédit nominatif avec plafond de dette personnalisé en MRU. Chaque achat y est consigné avec ticket. Enregistrez les règlements partiels par Bankily ou Espèces et envoyez des rappels polis en Arabe / Hassaniya en un clic.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <CheckCircle2 size={16} color="#10b981" /> Blocage automatique de vente si le plafond de crédit est dépassé
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <CheckCircle2 size={16} color="#10b981" /> Historique complet des remboursements et solde restant en direct
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <CheckCircle2 size={16} color="#10b981" /> Relances amicales par SMS & WhatsApp (سلام عليكم أخي الكريم...)
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '10px', color: '#c084fc' }}>
                  Extrait du Carnet de Crédit (Dettes en cours)
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.78rem' }}>
                  <div style={{ padding: '8px', background: 'var(--bg-secondary)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>Cheikh Ould Sidi</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>+222 22 14 55 88 • Plafond 5 000 MRU</div>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--accent-emerald)' }}>1 450 MRU</span>
                  </div>
                  <div style={{ padding: '8px', background: 'var(--bg-secondary)', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: 700 }}>Mohamed Lemine Ould Amar</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>+222 44 89 77 10 • Alerte 95%</div>
                    </div>
                    <span style={{ fontWeight: 800, color: 'var(--accent-rose)' }}>7 850 MRU</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'stock' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
              <div>
                <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  Module Gestion des Stocks & Lots
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 12px' }}>
                  Maîtrisez Vos Achats et Évitez les Ruptures
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Suivez en direct la valeur de votre stock au prix de revient fournisseur. Définissez des seuils de réapprovisionnement automatique et ajustez vos quantités en un clic depuis le comptoir.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <CheckCircle2 size={16} color="#10b981" /> Déduction automatique du stock lors de chaque validation de ticket
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <CheckCircle2 size={16} color="#10b981" /> Valorisation globale en MRU (Prix d'achat vs Prix de vente potentiel)
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                  <div style={{ padding: '10px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>VALEUR STOCK ACHAT</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>45 200 MRU</div>
                  </div>
                  <div style={{ padding: '10px', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>MARGE BRUTE STOCK</div>
                    <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#10b981' }}>+23 800 MRU</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#f59e0b', padding: '6px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '6px' }}>
                  ⚠️ 3 articles sous le seuil d'alerte (Riz Mauritanien 5kg, Huile 1L)
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'dashboard' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
              <div>
                <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  Module Tableau de Bord & Marges Nettes
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 12px' }}>
                  Votre Chiffre d'Affaires & Bénéfice Réel en Direct
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Visualisez instantanément votre marge commerciale déduite du coût des marchandises vendues (COGS). Répartition précise de vos encaissements Bankily, Masrvi, Espèces et créances Kridi.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <CheckCircle2 size={16} color="#10b981" /> Taux de rentabilité nette calculé en temps réel
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <CheckCircle2 size={16} color="#10b981" /> Rapport Z de caisse journalier imprimable avec mention fiscale NIF
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 700 }}>CHIFFRE D'AFFAIRES DU JOUR</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-main)', margin: '4px 0' }}>
                  14 850 <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>MRU</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 700, marginBottom: '12px' }}>
                  +5 420 MRU de Marge Nette Réelle (36.5%)
                </div>
                <div style={{ fontSize: '0.72rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Bankily : 6 200 MRU (42%)</span>
                    <span>Masrvi : 3 800 MRU (25%)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Espèces : 3 350 MRU (23%)</span>
                    <span>Kridi : 1 500 MRU (10%)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activePreviewTab === 'kds' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', alignItems: 'center' }}>
              <div>
                <span style={{ color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase' }}>
                  Module Restauration, Tables & Cuisine (KDS)
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '6px 0 12px' }}>
                  Organisation Parfaite pour Chwaya, Cafés & Restaurants
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                  Plan de salle interactif (Terrasse, Salle, Salons VIP). Transmission instantanée des commandes vers l'écran de cuisine KDS pour synchroniser la cuisson sans crier ni perdre de bons.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <CheckCircle2 size={16} color="#10b981" /> Suivi de statut : En attente ➔ En cuisson ➔ Prêt à servir
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem' }}>
                    <CheckCircle2 size={16} color="#10b981" /> Gestion de tables occupées et attribution de serveurs
                  </div>
                </div>
              </div>

              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                padding: '16px',
                border: '1px solid var(--border-glass)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.85rem' }}>Bon Cuisine #KDS-102 (Table 2)</span>
                  <span style={{ background: '#f59e0b', color: '#000', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800 }}>En Cuisson</span>
                </div>
                <div style={{ fontSize: '0.8rem', padding: '8px', background: 'var(--bg-secondary)', borderRadius: '6px' }}>
                  <div>1x Chwaya Viande d'Agneau (Bien cuite)</div>
                  <div>1x Thé Traditionnel Atay (3 verres)</div>
                </div>
                <div style={{ marginTop: '10px', textAlign: 'right' }}>
                  <button onClick={() => {
                    if (!account) {
                      if (onOpenAuthModal) onOpenAuthModal('login');
                      else onEnterApp('kds');
                    } else {
                      onEnterApp('kds');
                    }
                  }} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
                    Passer à l'Écran Cuisine
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 5. SECTEURS D'ACTIVITÉ PRÉCONFIGURÉS AVEC DESIGN & ANIMATIONS PRO */}
      <section id="sectors" style={{
        padding: '70px 24px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-glass)',
        borderBottom: '1px solid var(--border-glass)',
        position: 'relative'
      }}>
        <div style={{ maxWidth: '1260px', margin: '0 auto' }}>
          {/* Section Header */}
          <div style={{ textAlign: 'center', marginBottom: '44px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              padding: '6px 16px',
              borderRadius: '999px',
              fontSize: '0.78rem',
              fontWeight: 800,
              color: '#10b981',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              marginBottom: '12px'
            }}>
              <Sparkles size={14} />
              <span>Solutions Métiers Adaptées • 100% Modulaire</span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.7rem)', fontWeight: 900, margin: '6px 0 12px', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
              Une Caisse Préconfigurée pour{' '}
              <span style={{
                color: '#10b981',
                display: 'inline-block'
              }}>
                Chaque Commerce en Mauritanie
              </span>
            </h2>
            <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.6' }}>
              Basculez d'un secteur à l'autre en un clic sans réinstallation. Chaque mode active les outils spécifiques dont votre équipe a besoin.
            </p>
          </div>

          {/* Grid des 4 cartes métiers Pro */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '22px' }}>
            {/* 1. Restauration & Chwaya */}
            <div
              className="sector-card-pro"
              style={{
                ['--sector-accent' as any]: '#059669',
                ['--sector-shadow' as any]: 'rgba(5, 150, 105, 0.35)',
                border: '1.5px solid rgba(5, 150, 105, 0.3)'
              }}
            >
              <div>
                {/* Top Badge & Icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div className="sector-icon-orb" style={{ background: 'linear-gradient(135deg, rgba(5, 150, 105, 0.2), rgba(16, 185, 129, 0.1))', color: '#10b981', border: '1px solid rgba(5, 150, 105, 0.3)' }}>
                    <UtensilsCrossed size={26} />
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 900,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: 'linear-gradient(135deg, #006233, #16a34a)',
                    color: '#ffffff',
                    letterSpacing: '0.04em',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                  }}>
                    👑 LE PLUS CHOISI
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>
                  Restauration & Chwaya
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.55', marginBottom: '18px' }}>
                  Plan de salle en direct, envoi cuisine KDS, gestion des cuissons de grillades et suppléments Atay mauritanien.
                </p>

                {/* Micro Checklist */}
                <div style={{ marginBottom: '22px' }}>
                  <div className="sector-feature-item">
                    <CheckCircle2 size={15} color="#10b981" />
                    <span>Plan de Tables 2D & Salons VIP</span>
                  </div>
                  <div className="sector-feature-item">
                    <CheckCircle2 size={15} color="#10b981" />
                    <span>Écran KDS Cuisine & Chrono Cuisson</span>
                  </div>
                  <div className="sector-feature-item">
                    <CheckCircle2 size={15} color="#10b981" />
                    <span>Partage d'Addition & Rendu Monnaie</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSector('restaurant');
                  if (account) {
                    onEnterApp('pos');
                  } else if (onOpenAuthModal) {
                    onOpenAuthModal('register', 'restaurant');
                  } else {
                    onEnterApp('pos');
                  }
                }}
                className="sector-btn-action"
                style={{
                  background: 'linear-gradient(135deg, #006233 0%, #16a34a 100%)',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)'
                }}
              >
                <span>{account ? 'Accéder Mode Restaurant' : 'Créer Compte Restaurant (14j)'}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* 2. Boutique, Épicerie & Hanout */}
            <div
              className="sector-card-pro"
              style={{
                ['--sector-accent' as any]: '#10b981',
                ['--sector-shadow' as any]: 'rgba(16, 185, 129, 0.35)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div className="sector-icon-orb" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.18), rgba(5, 150, 105, 0.08))', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                    <ShoppingBag size={26} />
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    color: '#10b981'
                  }}>
                    ⚡ 100% CODE-BARRES
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>
                  Boutique, Épicerie & Hanout
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.55', marginBottom: '18px' }}>
                  Lecture douchette ultra-rapide, carnet de crédit Kridi (الكريدي) avec plafonds et alertes de rupture de stock.
                </p>

                <div style={{ marginBottom: '22px' }}>
                  <div className="sector-feature-item">
                    <CheckCircle2 size={15} color="#10b981" />
                    <span>Scan code-barres & Articles illimités</span>
                  </div>
                  <div className="sector-feature-item">
                    <CheckCircle2 size={15} color="#10b981" />
                    <span>Carnet Kridi avec SMS de relance</span>
                  </div>
                  <div className="sector-feature-item">
                    <CheckCircle2 size={15} color="#10b981" />
                    <span>Rapprochement Bankily & Masrvi</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSector('market');
                  if (account) {
                    onEnterApp('pos');
                  } else if (onOpenAuthModal) {
                    onOpenAuthModal('register', 'market');
                  } else {
                    onEnterApp('pos');
                  }
                }}
                className="sector-btn-action"
                style={{
                  background: 'linear-gradient(135deg, #065f46 0%, #10b981 100%)',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
                }}
              >
                <span>{account ? 'Accéder Mode Boutique' : 'Créer Compte Boutique (14j)'}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* 3. Boucherie, Poisson & Vrac */}
            <div
              className="sector-card-pro"
              style={{
                ['--sector-accent' as any]: '#d97706',
                ['--sector-shadow' as any]: 'rgba(217, 119, 6, 0.35)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div className="sector-icon-orb" style={{ background: 'linear-gradient(135deg, rgba(217, 119, 6, 0.2), rgba(245, 158, 11, 0.08))', color: '#d97706', border: '1px solid rgba(217, 119, 6, 0.3)' }}>
                    <Scale size={26} />
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: 'rgba(217, 119, 6, 0.15)',
                    color: '#d97706'
                  }}>
                    ⚖️ VENTE AU KG
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>
                  Boucherie, Poisson & Vrac
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.55', marginBottom: '18px' }}>
                  Articles vendus au poids (Viande Chameau, Agneau, Thiof). Pesée intégrée avec calcul automatique du prix/kg.
                </p>

                <div style={{ marginBottom: '22px' }}>
                  <div className="sector-feature-item">
                    <CheckCircle2 size={15} color="#d97706" />
                    <span>Calculateur tare & prix au kilogramme</span>
                  </div>
                  <div className="sector-feature-item">
                    <CheckCircle2 size={15} color="#d97706" />
                    <span>Impression ticket avec poids exact</span>
                  </div>
                  <div className="sector-feature-item">
                    <CheckCircle2 size={15} color="#d97706" />
                    <span>Suivi des pertes & marges nettes</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSector('butcher');
                  if (account) {
                    onEnterApp('pos');
                  } else if (onOpenAuthModal) {
                    onOpenAuthModal('register', 'butcher');
                  } else {
                    onEnterApp('pos');
                  }
                }}
                className="sector-btn-action"
                style={{
                  background: 'linear-gradient(135deg, #b45309 0%, #d97706 100%)',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(217, 119, 6, 0.4)'
                }}
              >
                <span>{account ? 'Accéder Mode Pesée' : 'Créer Compte Boucherie (14j)'}</span>
                <ArrowRight size={16} />
              </button>
            </div>

            {/* 4. Cosmétiques & Parapharmacie */}
            <div
              className="sector-card-pro"
              style={{
                ['--sector-accent' as any]: '#0284c7',
                ['--sector-shadow' as any]: 'rgba(2, 132, 199, 0.35)'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                  <div className="sector-icon-orb" style={{ background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.2), rgba(56, 189, 248, 0.08))', color: '#0284c7', border: '1px solid rgba(2, 132, 199, 0.3)' }}>
                    <ShieldCheck size={26} />
                  </div>
                  <span style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '3px 10px',
                    borderRadius: '999px',
                    background: 'rgba(2, 132, 199, 0.15)',
                    color: '#0284c7'
                  }}>
                    📦 LOTS & DLUO
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>
                  Cosmétiques & Parapharmacie
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.55', marginBottom: '18px' }}>
                  Suivi fin des références par teintes, gestion des dates d'expiration, réassort intelligent et clôtures Z certifiées.
                </p>

                <div style={{ marginBottom: '22px' }}>
                  <div className="sector-feature-item">
                    <CheckCircle2 size={15} color="#0284c7" />
                    <span>Variantes & teintes par référence</span>
                  </div>
                  <div className="sector-feature-item">
                    <CheckCircle2 size={15} color="#0284c7" />
                    <span>Historique d'achats par client</span>
                  </div>
                  <div className="sector-feature-item">
                    <CheckCircle2 size={15} color="#0284c7" />
                    <span>Clôtures Z & TVA 16% RIM conformes</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSector('cosmetics');
                  if (account) {
                    onEnterApp('pos');
                  } else if (onOpenAuthModal) {
                    onOpenAuthModal('register', 'cosmetics');
                  } else {
                    onEnterApp('pos');
                  }
                }}
                className="sector-btn-action"
                style={{
                  background: 'linear-gradient(135deg, #0369a1 0%, #0284c7 100%)',
                  color: '#ffffff',
                  boxShadow: '0 4px 14px rgba(2, 132, 199, 0.4)'
                }}
              >
                <span>{account ? 'Accéder Mode Beauté' : 'Créer Compte Cosmétiques (14j)'}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: MOBILE APP & LIVE ACTIVITY SECTION */}
      <section style={{ padding: '60px 24px', maxWidth: '1240px', margin: '0 auto', width: '100%' }}>
        <div className="glass-panel" style={{ 
          padding: 'clamp(24px, 4vw, 44px)', 
          borderRadius: '24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '40px',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(5, 150, 105, 0.08) 50%, var(--bg-card) 100%)',
          border: '1px solid rgba(5, 150, 105, 0.3)',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle background glow */}
          <div style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '400px',
            height: '400px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {/* Left Column: Presentation & Value Propositions */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.35)', padding: '5px 14px', borderRadius: '999px', marginBottom: '16px' }}>
              <span className="pulse-live-dot" />
              <span style={{ color: '#10b981', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Application Mobile Gérant & Propriétaire
              </span>
            </div>

            <h2 style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.5rem)', fontWeight: 900, lineHeight: '1.2', margin: '0 0 12px', color: 'var(--text-main)' }}>
              Pilotez toute l'activité de vos commerces en direct sur votre mobile.
            </h2>

            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-emerald)', direction: 'rtl', marginBottom: '16px' }}>
              تابع كل مبيعاتك، مداخيلك وحركات الصندوق لحظة بلحظة من هاتفك 📱
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '24px' }}>
              Ne perdez plus une miette de ce qui se passe dans votre établissement. Que vous soyez chez vous, en déplacement ou à l'étranger, gardez un œil sur chaque vente, vos marges nettes, vos encaissements <strong>Bankily & Masrvi</strong>, et recevez les clôtures journalières (Rapport Z) en direct.
            </p>

            {/* Feature Highlights Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '28px' }}>
              <div style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-glass)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.15)', padding: '6px', borderRadius: '8px', color: '#10b981', flexShrink: 0 }}>
                  <Activity size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-main)' }}>Activité en direct</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>Chaque ticket validé ou table servie s'affiche à la seconde près.</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-glass)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(234, 88, 12, 0.15)', padding: '6px', borderRadius: '8px', color: '#ea580c', flexShrink: 0 }}>
                  <Bell size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-main)' }}>Alertes Push Immédiates</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>Notifié lors des gros encaissements ou annulations suspectes.</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-glass)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(37, 99, 235, 0.15)', padding: '6px', borderRadius: '8px', color: '#3b82f6', flexShrink: 0 }}>
                  <TrendingUp size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-main)' }}>Rapport Z & Marges</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>Total du chiffre d'affaires, TVA et bénéfice net consolidés.</div>
                </div>
              </div>

              <div style={{ background: 'var(--bg-secondary)', padding: '12px 14px', borderRadius: '12px', border: '1px solid var(--border-glass)', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{ background: 'rgba(168, 85, 247, 0.15)', padding: '6px', borderRadius: '8px', color: '#a855f7', flexShrink: 0 }}>
                  <Layers size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.82rem', color: 'var(--text-main)' }}>Multi-Magasins RIM</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>Supervisez toutes vos caisses de Tevragh-Zeina, Ksar et Sebkha.</div>
                </div>
              </div>
            </div>

            {/* Download CTAs */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
              <a 
                href="#contact" 
                className="btn-secondary" 
                style={{ 
                  padding: '10px 18px', 
                  borderRadius: '10px', 
                  textDecoration: 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <div style={{ fontSize: '1.4rem', lineHeight: '1' }}>🤖</div>
                <div style={{ textAlign: 'left', lineHeight: '1.1' }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Disponible sur</div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>Google Play (APK)</div>
                </div>
              </a>

              <a 
                href="#contact" 
                className="btn-secondary" 
                style={{ 
                  padding: '10px 18px', 
                  borderRadius: '10px', 
                  textDecoration: 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.15)'
                }}
              >
                <div style={{ fontSize: '1.4rem', lineHeight: '1', color: 'var(--text-main)' }}></div>
                <div style={{ textAlign: 'left', lineHeight: '1.1' }}>
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Télécharger sur</div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem' }}>App Store (iOS)</div>
                </div>
              </a>

              <button
                onClick={() => {
                  if (!account) {
                    if (onOpenAuthModal) onOpenAuthModal('login');
                    else onEnterApp('dashboard');
                  } else {
                    onEnterApp('dashboard');
                  }
                }}
                className="btn-primary"
                style={{
                  padding: '10px 18px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>Accès Web Mobile (PWA)</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <div style={{ marginTop: '14px', fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>💡</span>
              <span><strong>Astuce :</strong> Testez l'application sur le smartphone interactif ci-contre ! Cliquez sur les onglets ou le bouton de simulation.</span>
            </div>
          </div>

          {/* Right Column: Realistic Animated Smartphone Mockup */}
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <div 
              className="phone-mockup-container"
              style={{ 
                width: '100%',
                maxWidth: '320px', 
                borderRadius: '40px', 
                border: '8px solid #1e293b', 
                background: '#0a0f1d',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 40px rgba(16, 185, 129, 0.15)',
                overflow: 'hidden',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Dynamic Island & Phone Status Bar */}
              <div style={{ 
                background: '#060a14', 
                padding: '10px 16px 6px', 
                display: 'flex', 
                flexDirection: 'column', 
                gap: '6px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>
                  <span>18:24</span>
                  {/* Dynamic Island Capsule */}
                  <div style={{
                    background: '#000000',
                    borderRadius: '14px',
                    padding: '3px 10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '0.62rem', color: '#ffffff', fontWeight: 700 }}>Caissa Live</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Wifi size={11} />
                    <Battery size={13} />
                  </div>
                </div>

                {/* Animated Push Notification Banner in Dynamic Island */}
                {showPushNotification && (
                  <div style={{
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: '8px',
                    padding: '4px 8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '6px',
                    fontSize: '0.66rem',
                    color: '#6ee7b7',
                    fontWeight: 700,
                    animation: 'notificationDrop 0.4s ease-out'
                  }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {pushNotificationText}
                    </span>
                    <span style={{ fontSize: '0.55rem', opacity: 0.8 }}>Live</span>
                  </div>
                )}
              </div>

              {/* Mobile App Screen Content */}
              <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {/* Store Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #006233, #16a34a)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff'
                    }}>
                      <ChefHat size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#f8fafc', lineHeight: '1.2' }}>
                        Restaurant Le Nil
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#64748b' }}>
                        Tevragh-Zeina • Nouakchott
                      </div>
                    </div>
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    padding: '3px 8px',
                    borderRadius: '999px',
                    border: '1px solid rgba(16, 185, 129, 0.3)'
                  }}>
                    <span className="pulse-live-dot" />
                    <span style={{ fontSize: '0.62rem', fontWeight: 800, color: '#10b981' }}>EN DIRECT</span>
                  </div>
                </div>

                {/* Primary Daily KPI Card */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.25) 100%)',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  padding: '12px',
                  borderRadius: '14px',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.65rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase' }}>
                      Chiffre d'Affaires du Jour
                    </span>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '2px',
                      background: 'rgba(16, 185, 129, 0.2)',
                      color: '#10b981',
                      fontSize: '0.62rem',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '4px'
                    }}>
                      <ArrowUpRight size={10} /> +22.4%
                    </span>
                  </div>

                  <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: '4px 0 8px' }}>
                    {liveSalesTotal.toLocaleString('fr-FR')} <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>MRU</span>
                  </div>

                  {/* 3 mini metrics */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                    <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '6px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>Tickets</div>
                      <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#fff' }}>{liveTicketCount}</div>
                    </div>
                    <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '6px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>Marge</div>
                      <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#10b981' }}>7 380</div>
                    </div>
                    <div style={{ background: 'rgba(0, 0, 0, 0.25)', padding: '6px', borderRadius: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '0.58rem', color: '#94a3b8' }}>Panier</div>
                      <div style={{ fontWeight: 800, fontSize: '0.78rem', color: '#38bdf8' }}>125</div>
                    </div>
                  </div>
                </div>

                {/* Interactive Phone Tabs */}
                <div style={{
                  display: 'flex',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '3px',
                  borderRadius: '10px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}>
                  <button
                    onClick={() => setMobileTab('live')}
                    style={{
                      flex: 1,
                      padding: '5px 2px',
                      borderRadius: '7px',
                      border: 'none',
                      background: mobileTab === 'live' ? '#10b981' : 'transparent',
                      color: mobileTab === 'live' ? '#000000' : '#94a3b8',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    ⚡ Activité Live
                  </button>
                  <button
                    onClick={() => setMobileTab('payments')}
                    style={{
                      flex: 1,
                      padding: '5px 2px',
                      borderRadius: '7px',
                      border: 'none',
                      background: mobileTab === 'payments' ? '#10b981' : 'transparent',
                      color: mobileTab === 'payments' ? '#000000' : '#94a3b8',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    💳 Paiements
                  </button>
                  <button
                    onClick={() => setMobileTab('top')}
                    style={{
                      flex: 1,
                      padding: '5px 2px',
                      borderRadius: '7px',
                      border: 'none',
                      background: mobileTab === 'top' ? '#10b981' : 'transparent',
                      color: mobileTab === 'top' ? '#000000' : '#94a3b8',
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    🏆 Top Ventes
                  </button>
                </div>

                {/* TAB 1: ACTIVITÉ EN DIRECT */}
                {mobileTab === 'live' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {/* Hourly Activity Sparkline Bars */}
                    <div style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '10px',
                      padding: '8px 10px',
                      border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6rem', color: '#94a3b8', marginBottom: '6px' }}>
                        <span>Activité par heure (08h - 22h)</span>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>Pic Dîner : 21h</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '36px', gap: '3px' }}>
                        {[
                          { hour: '09h', h: '25%', active: false },
                          { hour: '11h', h: '45%', active: false },
                          { hour: '13h', h: '85%', active: false },
                          { hour: '15h', h: '35%', active: false },
                          { hour: '17h', h: '30%', active: false },
                          { hour: '19h', h: '70%', active: false },
                          { hour: '21h', h: '98%', active: true },
                          { hour: '22h', h: '60%', active: false }
                        ].map((bar, i) => (
                          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', height: '100%', justifyContent: 'flex-end' }}>
                            <div 
                              style={{ 
                                width: '100%', 
                                height: bar.h, 
                                background: bar.active ? '#10b981' : 'rgba(255, 255, 255, 0.18)', 
                                borderRadius: '3px',
                                transition: 'height 0.4s ease'
                              }} 
                            />
                            <span style={{ fontSize: '0.5rem', color: bar.active ? '#10b981' : '#64748b' }}>{bar.hour}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Live Stream Feed */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#f8fafc', textTransform: 'uppercase' }}>
                        Flux des Commandes en Direct
                      </span>
                      <span style={{ fontSize: '0.58rem', color: '#64748b' }}>4 récentes</span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {liveFeed.map((item) => (
                        <div 
                          key={item.id}
                          className="live-activity-item"
                          style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            padding: '6px 8px',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px'
                          }}
                        >
                          <div style={{ overflow: 'hidden' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ fontWeight: 800, fontSize: '0.7rem', color: '#f8fafc' }}>{item.table}</span>
                              <span style={{
                                fontSize: '0.55rem',
                                padding: '1px 5px',
                                borderRadius: '4px',
                                fontWeight: 800,
                                background: `${item.badgeColor}22`,
                                color: item.badgeColor,
                                border: `1px solid ${item.badgeColor}44`
                              }}>
                                {item.method}
                              </span>
                            </div>
                            <div style={{ fontSize: '0.6rem', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {item.detail}
                            </div>
                          </div>

                          <div style={{ textAlign: 'right', flexShrink: 0 }}>
                            <div style={{ fontWeight: 800, fontSize: '0.74rem', color: '#10b981' }}>
                              +{item.amount} MRU
                            </div>
                            <div style={{ fontSize: '0.55rem', color: '#64748b' }}>
                              {item.time}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Interactive Simulator CTA Button */}
                    <button
                      onClick={handleSimulateSale}
                      style={{
                        marginTop: '2px',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(5, 150, 105, 0.3) 100%)',
                        border: '1px dashed #10b981',
                        color: '#6ee7b7',
                        padding: '6px',
                        borderRadius: '8px',
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      <Zap size={12} />
                      <span>Simuler une nouvelle vente en direct</span>
                    </button>
                  </div>
                )}

                {/* TAB 2: PAIEMENTS MRU */}
                {mobileTab === 'payments' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', marginBottom: '2px' }}>
                      Ventilation des encaissements (Mauritanie) :
                    </div>

                    {/* Bankily */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 700, marginBottom: '3px' }}>
                        <span style={{ color: '#ea580c' }}>🟠 Bankily (BPM)</span>
                        <span style={{ color: '#fff' }}>8 950 MRU (48.5%)</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: '48.5%', height: '100%', background: '#ea580c', borderRadius: '999px' }} />
                      </div>
                    </div>

                    {/* Masrvi */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 700, marginBottom: '3px' }}>
                        <span style={{ color: '#3b82f6' }}>🔵 Masrvi (BIM)</span>
                        <span style={{ color: '#fff' }}>4 600 MRU (24.9%)</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: '24.9%', height: '100%', background: '#3b82f6', borderRadius: '999px' }} />
                      </div>
                    </div>

                    {/* Cash */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 700, marginBottom: '3px' }}>
                        <span style={{ color: '#10b981' }}>🟢 Espèces Cash</span>
                        <span style={{ color: '#fff' }}>3 700 MRU (20.1%)</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: '20.1%', height: '100%', background: '#10b981', borderRadius: '999px' }} />
                      </div>
                    </div>

                    {/* Kridi */}
                    <div style={{ background: 'rgba(255, 255, 255, 0.03)', padding: '8px', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', fontWeight: 700, marginBottom: '3px' }}>
                        <span style={{ color: '#c084fc' }}>🟣 الكريدي (Dettes)</span>
                        <span style={{ color: '#fff' }}>1 200 MRU (6.5%)</span>
                      </div>
                      <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.1)', borderRadius: '999px', overflow: 'hidden' }}>
                        <div style={{ width: '6.5%', height: '100%', background: '#a855f7', borderRadius: '999px' }} />
                      </div>
                    </div>

                    <div style={{ fontSize: '0.58rem', color: '#10b981', textAlign: 'center', marginTop: '2px' }}>
                      ✓ Toutes les caisses sont équilibrées à l'ouguiya près.
                    </div>
                  </div>
                )}

                {/* TAB 3: TOP ARTICLES & STAFF */}
                {mobileTab === 'top' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                    <div style={{ fontSize: '0.62rem', color: '#94a3b8' }}>Meilleures ventes du jour :</div>
                    
                    {[
                      { rank: '1', name: 'Méchoui d\'Agneau', qty: '32 vendus', total: '9 600 MRU', color: '#f59e0b' },
                      { rank: '2', name: 'Dorade Royale Grillée', qty: '24 portions', total: '4 800 MRU', color: '#94a3b8' },
                      { rank: '3', name: 'Thé Mauritanien (3V)', qty: '68 verres', total: '2 040 MRU', color: '#b45309' },
                      { rank: '4', name: 'Riz au Poisson (Thieb)', qty: '18 portions', total: '2 700 MRU', color: '#10b981' }
                    ].map((item, idx) => (
                      <div key={idx} style={{
                        background: 'rgba(255, 255, 255, 0.03)',
                        padding: '5px 8px',
                        borderRadius: '6px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 800, color: item.color }}>#{item.rank}</span>
                          <div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#f8fafc' }}>{item.name}</div>
                            <div style={{ fontSize: '0.55rem', color: '#64748b' }}>{item.qty}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#10b981' }}>{item.total}</span>
                      </div>
                    ))}

                    <div style={{ marginTop: '4px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '6px' }}>
                      <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginBottom: '4px' }}>Caissiers en service :</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem' }}>
                        <span style={{ color: '#fff' }}>🟢 Ahmed (Caisse 1)</span>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>84 tickets</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', marginTop: '2px' }}>
                        <span style={{ color: '#fff' }}>🟢 Fatimetou (Caisse 2)</span>
                        <span style={{ color: '#10b981', fontWeight: 700 }}>64 tickets</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Home indicator bar at bottom */}
              <div style={{
                padding: '8px 0 10px',
                display: 'flex',
                justifyContent: 'center',
                background: '#060a14',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div style={{ width: '90px', height: '4px', background: 'rgba(255, 255, 255, 0.4)', borderRadius: '999px' }} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BIS - ANNONCE OFFICIELLE APPLICATION MOBILE & WALLET FIDÉLITÉ MAURITANIE */}
      <section id="fidelite" style={{
        padding: '90px 24px',
        maxWidth: '1240px',
        margin: '0 auto',
        width: '100%',
        position: 'relative'
      }}>
        {/* Glow ambient background effects */}
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: '500px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, rgba(217, 119, 6, 0.08) 50%, transparent 70%)',
          filter: 'blur(70px)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />
        <div style={{
          position: 'absolute',
          bottom: '10%',
          left: '5%',
          width: '450px',
          height: '350px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
          filter: 'blur(70px)',
          zIndex: 0,
          pointerEvents: 'none'
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          {/* Header Title & Pitch */}
          <div style={{ textAlign: 'center', maxWidth: '840px', margin: '0 auto 56px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.18), rgba(245, 158, 11, 0.18))',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              borderRadius: '999px',
              padding: '8px 18px',
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#34d399',
              marginBottom: '18px',
              boxShadow: '0 4px 15px rgba(16, 185, 129, 0.15)'
            }}>
              <Award size={16} color="#fbbf24" />
              <span>{i18n.language === 'ar' ? 'حصرياً في موريتانيا · المحفظة الرقمية لبطاقات الولاء' : 'NOUVEAU EN MAURITANIE · APPLICATION & WALLET FIDÉLITÉ CLIENTÈLE'}</span>
            </div>

            <h2 style={{
              fontSize: 'clamp(2rem, 3.8vw, 3rem)',
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.18,
              color: 'var(--text-main)',
              marginBottom: '20px'
            }}>
              {i18n.language === 'ar' ? (
                <>
                  جميع بطاقات الولاء الموريتانية في{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #fbbf24 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    محفظة رقمية واحدة على هاتفك
                  </span>
                </>
              ) : (
                <>
                  Dites adieu aux cartes papier perdues.{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 50%, #fbbf24 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Un seul portefeuille digital pour toutes vos enseignes.
                  </span>
                </>
              )}
            </h2>

            <p style={{
              fontSize: '1.05rem',
              lineHeight: 1.65,
              color: 'var(--text-muted)',
              margin: '0 auto',
              maxWidth: '720px'
            }}>
              {i18n.language === 'ar' 
                ? 'تطبيق عصري وسريع يتيح للزبناء حفظ بطاقات الولاء لأشهر المحلات والسوبرماركتات والمطاعم في موريتانيا، كسب النقاط الفوري عند الدفع، وجذب زبناء جدد لمشروعك عبر شبكة Caissa الذكية.'
                : 'Permettez à vos clients de numériser toutes leurs cartes de fidélité préférées (Supermarchés, Restaurants, Parfumeries, Boucheries) sur leur smartphone, gagnez leur fidélité et attirez un flux continu de nouveaux clients à Nouakchott et dans toute la Mauritanie.'}
            </p>
          </div>

          {/* Interactive Presentation Grid: Left Phone App Mockup / Right Business Value & Downloads */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
            gap: '40px',
            alignItems: 'center'
          }}>
            {/* LEFT: Realistic Luxury Smartphone Mockup with Mauritanian Loyalty Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {/* Phone Container */}
              <div style={{
                width: '100%',
                maxWidth: '380px',
                borderRadius: '42px',
                background: '#090d16',
                border: '7px solid #1f293d',
                boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.7), 0 0 40px rgba(16, 185, 129, 0.2)',
                overflow: 'hidden',
                position: 'relative'
              }}>
                {/* Phone Top Notch / Dynamic Island */}
                <div style={{
                  padding: '12px 20px 8px',
                  background: '#090d16',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#94a3b8' }}>09:41</span>
                  <div style={{
                    width: '90px',
                    height: '18px',
                    background: '#000',
                    borderRadius: '999px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
                    <span style={{ fontSize: '0.55rem', color: '#64748b', fontWeight: 600 }}>Caissa Pay</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Wifi size={12} color="#94a3b8" />
                    <Battery size={13} color="#94a3b8" />
                  </div>
                </div>

                {/* App Internal Header */}
                <div style={{
                  padding: '14px 18px',
                  background: 'linear-gradient(180deg, #0d1527 0%, #090d16 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, #10b981, #059669)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CreditCard size={18} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#f8fafc' }}>Caissa Wallet</div>
                      <div style={{ fontSize: '0.65rem', color: '#64748b' }}>🇲🇷 Mauritanie · 5 Cartes Actives</div>
                    </div>
                  </div>

                  <button
                    onClick={handleSimulateLoyaltyScan}
                    style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      borderRadius: '8px',
                      padding: '5px 9px',
                      color: '#34d399',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                    title="Simuler un scan en caisse"
                  >
                    <QrCode size={13} />
                    <span>Scan Caisse</span>
                  </button>
                </div>

                {/* Toast Notification Simulation */}
                {loyaltyScannedNotification && (
                  <div style={{
                    margin: '8px 12px 0',
                    padding: '8px 12px',
                    background: 'rgba(16, 185, 129, 0.95)',
                    color: '#fff',
                    borderRadius: '10px',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    boxShadow: '0 8px 20px rgba(16, 185, 129, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    animation: 'fadeIn 0.3s ease'
                  }}>
                    <Sparkles size={14} />
                    <span>{loyaltyScannedNotification}</span>
                  </div>
                )}

                {/* Active Loyalty Card Visual */}
                <div style={{ padding: '16px' }}>
                  {(() => {
                    const activeCard = loyaltyCardsList[selectedLoyaltyIndex];
                    return (
                      <div style={{
                        borderRadius: '20px',
                        background: activeCard.colorGradient,
                        padding: '18px',
                        color: '#ffffff',
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.45)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease'
                      }}>
                        {/* Background subtle watermark icon */}
                        <div style={{
                          position: 'absolute',
                          right: '-15px',
                          bottom: '-15px',
                          opacity: 0.12,
                          transform: 'rotate(-15deg)',
                          pointerEvents: 'none'
                        }}>
                          <CreditCard size={140} color="#fff" />
                        </div>

                        {/* Top Card Info */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                          <div>
                            <span style={{
                              background: 'rgba(0, 0, 0, 0.3)',
                              backdropFilter: 'blur(4px)',
                              padding: '2px 8px',
                              borderRadius: '6px',
                              fontSize: '0.65rem',
                              fontWeight: 800,
                              letterSpacing: '0.04em',
                              border: '1px solid rgba(255, 255, 255, 0.2)'
                            }}>
                              {activeCard.badge}
                            </span>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: '6px 0 2px', letterSpacing: '-0.02em' }}>
                              {activeCard.storeName}
                            </h3>
                            <p style={{ fontSize: '0.68rem', opacity: 0.9, margin: 0 }}>
                              📍 {activeCard.city}
                            </p>
                          </div>

                          <div style={{
                            background: 'rgba(255, 255, 255, 0.2)',
                            borderRadius: '10px',
                            padding: '6px 8px',
                            textAlign: 'right'
                          }}>
                            <div style={{ fontSize: '0.6rem', opacity: 0.85, fontWeight: 600 }}>Statut</div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800 }}>{activeCard.tier}</div>
                          </div>
                        </div>

                        {/* Middle: Points & Reward */}
                        <div style={{
                          background: 'rgba(0, 0, 0, 0.25)',
                          borderRadius: '12px',
                          padding: '10px 12px',
                          marginBottom: '14px',
                          backdropFilter: 'blur(6px)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{ fontSize: '0.62rem', opacity: 0.8 }}>Solde de Points</div>
                            <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#fef08a' }}>
                              {activeCard.points} <span style={{ fontSize: '0.75rem' }}>pts</span>
                            </div>
                          </div>
                          <div style={{ textAlign: 'right', maxWidth: '140px' }}>
                            <div style={{ fontSize: '0.6rem', opacity: 0.8 }}>Avantage Débloqué</div>
                            <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#86efac' }}>
                              {activeCard.rewardText}
                            </div>
                          </div>
                        </div>

                        {/* Bottom: Barcode / QR Simulation & Card Number */}
                        <div style={{
                          background: '#ffffff',
                          borderRadius: '10px',
                          padding: '8px 12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between'
                        }}>
                          <div>
                            {/* Stylized Barcode Lines */}
                            <div style={{ display: 'flex', gap: '2px', height: '24px', alignItems: 'center' }}>
                              {[3, 1, 4, 1, 2, 5, 1, 3, 2, 4, 1, 3, 2, 5, 1, 2, 4, 1, 3, 2, 1, 4, 2].map((w, i) => (
                                <div key={i} style={{ width: `${w}px`, height: '22px', background: '#0f172a' }} />
                              ))}
                            </div>
                            <div style={{ fontSize: '0.58rem', color: '#475569', fontWeight: 700, letterSpacing: '0.08em', marginTop: '2px' }}>
                              {activeCard.cardNumber}
                            </div>
                          </div>

                          <div style={{
                            background: '#f1f5f9',
                            padding: '4px',
                            borderRadius: '6px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <QrCode size={26} color="#0f172a" />
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Card Switcher Carousel (Clickable recognized Mauritanian brands) */}
                <div style={{ padding: '0 16px 14px' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#94a3b8', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Vos Enseignes Enregistrées</span>
                    <span style={{ color: '#10b981' }}>Touchez pour afficher</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {loyaltyCardsList.map((card, idx) => (
                      <div
                        key={card.id}
                        onClick={() => setSelectedLoyaltyIndex(idx)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '7px 10px',
                          borderRadius: '10px',
                          background: selectedLoyaltyIndex === idx ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                          border: selectedLoyaltyIndex === idx ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255, 255, 255, 0.05)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            background: card.accentColor
                          }} />
                          <div>
                            <div style={{ fontSize: '0.72rem', fontWeight: 800, color: selectedLoyaltyIndex === idx ? '#fff' : '#cbd5e1' }}>
                              {card.storeName}
                            </div>
                            <div style={{ fontSize: '0.6rem', color: '#64748b' }}>
                              {card.tier} · {card.points} pts
                            </div>
                          </div>
                        </div>

                        <span style={{
                          fontSize: '0.65rem',
                          fontWeight: 700,
                          color: selectedLoyaltyIndex === idx ? '#34d399' : '#64748b'
                        }}>
                          {selectedLoyaltyIndex === idx ? '● Actif' : 'Afficher'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Phone Bottom Bar */}
                <div style={{
                  padding: '10px 0 12px',
                  display: 'flex',
                  justifyContent: 'center',
                  background: '#090d16',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)'
                }}>
                  <div style={{ width: '100px', height: '4px', background: 'rgba(255, 255, 255, 0.35)', borderRadius: '999px' }} />
                </div>
              </div>
            </div>

            {/* RIGHT: Business Impact, Merchant Benefits & Download Badges */}
            <div>
              {/* Feature Highlights Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '32px' }}>
                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px'
                  }}>
                    <CreditCard size={20} color="#10b981" />
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px' }}>
                    {i18n.language === 'ar' ? 'جميع البطاقات في جيب واحد' : 'Toutes les cartes dans un seul Wallet'}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {i18n.language === 'ar'
                      ? 'لا داعي للبحث عن بطاقات بلاستيكية أو ورق قديم. الزبون يقدم هاتفه لمسحه في ثانية واحدة.'
                      : 'Plus jamais de carte oubliée à la maison. Vos clients scannent leur QR en 1 seconde devant le lecteur Caissa.'}
                  </p>
                </div>

                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px'
                  }}>
                    <TrendingUp size={20} color="#f59e0b" />
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px' }}>
                    {i18n.language === 'ar' ? 'مضاعفة عودة الزبناء' : 'Fidélisation Clientèle x3'}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {i18n.language === 'ar'
                      ? 'نقاط تراكمية، هدايا عيد الفطر والأعياد، وإشعارات بالواتساب عند وصول منتجات جديدة وتخفيضات.'
                      : 'Points cumulables, cashback en MRU et alertes WhatsApp personnalisées pour faire revenir vos clients.'}
                  </p>
                </div>

                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(59, 130, 246, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px'
                  }}>
                    <Users size={20} color="#3b82f6" />
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px' }}>
                    {i18n.language === 'ar' ? 'استقطاب زبناء جدد يومياً' : 'Attirez de nouveaux clients'}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {i18n.language === 'ar'
                      ? 'متجرك يظهر في دليل محلات Caissa للآلاف من مستخدمي التطبيق في نواكشوط وانواذيبو وروصو.'
                      : 'Votre enseigne est référencée sur le réseau Caissa et découverte par des milliers de consommateurs locaux.'}
                  </p>
                </div>

                <div style={{
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '16px',
                  padding: '18px',
                  boxShadow: '0 4px 15px rgba(0, 0, 0, 0.05)'
                }}>
                  <div style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'rgba(168, 85, 247, 0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '12px'
                  }}>
                    <Zap size={20} color="#a855f7" />
                  </div>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px' }}>
                    {i18n.language === 'ar' ? 'متصل فوراً بكاشير Caissa' : 'Synchronisé Direct avec le POS'}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                    {i18n.language === 'ar'
                      ? 'تطبيق الكاشير يتعرف على الزبون تلقائياً، يطبق خصوماته ويخصم النقاط من الفاتورة مباشرة.'
                      : 'Reconnaissance instantanée à la caisse, déduction des points sur le ticket et zéro configuration manuelle.'}
                  </p>
                </div>
              </div>

              {/* DOWNLOAD & APP ACCESS SECTION */}
              <div style={{
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(245, 158, 11, 0.05) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '20px',
                padding: '24px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <Download size={18} color="#10b981" />
                  <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#10b981', letterSpacing: '0.04em' }}>
                    {i18n.language === 'ar' ? 'تحميل التطبيق الرسمي للزبناء' : 'TÉLÉCHARGEMENT DE L\'APPLICATION CLIENT'}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-main)', margin: '0 0 8px' }}>
                  {i18n.language === 'ar' ? 'حمل Caissa Wallet مجاناً أو استخدمه فوراً' : 'Téléchargez Caissa Fidélité sur votre mobile'}
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 20px', lineHeight: 1.5 }}>
                  {i18n.language === 'ar'
                    ? 'متوفر على جميع الهواتف الذكية. سجل بطاقاتك خلال أقل من دقيقة وابدأ بجمع المكافآت عند كل شراء.'
                    : 'Compatible iOS, Android et Web PWA instantanée. Enregistrez vos cartes en moins de 60 secondes.'}
                </p>

                {/* Download Store Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                  {/* Apple App Store */}
                  <a
                    href="#trial-form"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Caissa Wallet iOS : Version Pré-lancement Mauritanie. Inscrivez-vous ci-dessous pour recevoir l\'accès Beta prioritaire TestFlight.');
                    }}
                    style={{
                      background: '#0a0f1d',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textDecoration: 'none',
                      color: '#ffffff',
                      transition: 'transform 0.2s, border-color 0.2s',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.61-.75 1.04-1.8 1.01-2.87-.96.04-2.13.65-2.79 1.41-.58.66-1.1 1.74-1.04 2.8.07 0 2.21-.59 2.82-1.34z"/>
                    </svg>
                    <div>
                      <div style={{ fontSize: '0.62rem', opacity: 0.7, textTransform: 'uppercase' }}>Télécharger dans l'</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>App Store</div>
                    </div>
                  </a>

                  {/* Google Play Store */}
                  <a
                    href="#trial-form"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Caissa Wallet Android : APK disponible pour les commerces partenaires. Contactez le support Caissa Mauritanie via WhatsApp.');
                    }}
                    style={{
                      background: '#0a0f1d',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      borderRadius: '12px',
                      padding: '10px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      textDecoration: 'none',
                      color: '#ffffff',
                      transition: 'transform 0.2s, border-color 0.2s',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffffff">
                      <path d="M3.609 1.814L13.792 12 3.61 22.186a1.99 1.99 0 0 1-.61-1.464V3.278c0-.573.226-1.1.609-1.464zm11.242 11.245l2.456 2.456-11.89 6.86 9.434-9.316zm0-2.118L5.417 1.625l11.89 6.86-2.456 2.456zm1.472 1.059l4.088 2.36a1.5 1.5 0 0 1 0 2.59l-4.088 2.36-1.472-1.472 1.472-5.838z"/>
                    </svg>
                    <div>
                      <div style={{ fontSize: '0.62rem', opacity: 0.7, textTransform: 'uppercase' }}>DISPONIBLE SUR</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800 }}>Google Play</div>
                    </div>
                  </a>

                  {/* Instant Web PWA */}
                  <button
                    onClick={() => {
                      onEnterApp('pos');
                    }}
                    style={{
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '12px',
                      padding: '10px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      color: '#ffffff',
                      cursor: 'pointer',
                      fontWeight: 800,
                      boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)'
                    }}
                  >
                    <Smartphone size={20} />
                    <div style={{ textAlign: 'left' }}>
                      <div style={{ fontSize: '0.62rem', opacity: 0.85, textTransform: 'uppercase' }}>Accès Instantané</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800 }}>Web App PWA</div>
                    </div>
                  </button>
                </div>

                {/* Merchant Partnership Callout */}
                <div style={{
                  borderTop: '1px dashed rgba(16, 185, 129, 0.3)',
                  paddingTop: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-main)', fontWeight: 700 }}>
                      {i18n.language === 'ar' ? 'هل تملك محلاً في موريتانيا وتريد ربطه؟' : 'Vous avez un commerce et souhaitez rejoindre le réseau ?'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      const formEl = document.getElementById('trial-form');
                      if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid #10b981',
                      borderRadius: '8px',
                      color: '#10b981',
                      padding: '6px 12px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <span>{i18n.language === 'ar' ? 'تفعيل ميزة الولاء لمشروعي' : 'Activer sur ma caisse'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* 6. CALCULATEUR DE PRIX DYNAMIQUE ULTRA-ATTIRANT AVEC ANIMATIONS & DESIGN PREMIUM */}
      <section id="pricing" style={{ padding: '70px 24px', maxWidth: '1060px', margin: '0 auto', width: '100%', position: 'relative' }}>
        {/* Glow Orb en arrière-plan */}
        <div style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px',
          height: '350px',
          background: 'radial-gradient(ellipse, rgba(16, 185, 129, 0.18) 0%, rgba(0, 98, 51, 0.05) 50%, transparent 70%)',
          filter: 'blur(60px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div style={{ textAlign: 'center', marginBottom: '36px', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.12)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#10b981',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '12px'
          }}>
            <Sparkles size={14} />
            <span>Tarification 100% Transparente • Facturée en Ouguiya (MRU)</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.9rem, 3.8vw, 2.7rem)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
            Abonnez-vous à la Journée selon{' '}
            <span style={{
              color: '#10b981',
              display: 'inline-block'
            }}>
              Vos Vrais Besoins
            </span>
          </h2>
          <p style={{ fontSize: '0.98rem', color: 'var(--text-muted)', maxWidth: '680px', margin: '0 auto', lineHeight: '1.6' }}>
            Sans engagement à long terme. Choisissez la durée exacte de votre activité. Règlement direct et instantané par <strong style={{ color: '#ea580c' }}>Bankily</strong> ou <strong style={{ color: '#2563eb' }}>Masrvi</strong>.
          </p>
        </div>

        {/* Boîte Principale Ultra-Pro Glassmorphism */}
        <div className="pricing-pro-container" style={{ padding: 'clamp(24px, 5vw, 44px)', position: 'relative', zIndex: 1 }}>
          {/* Header avec Durée et Prix Journalier Animé */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '24px',
            flexWrap: 'wrap',
            gap: '16px',
            borderBottom: '1px solid var(--border-glass)',
            paddingBottom: '20px'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Durée de l'Abonnement Choisie
              </div>
              <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                <span style={{
                  color: '#10b981'
                }}>
                  {subscriptionDays}
                </span>
                <span style={{ fontSize: '1.2rem', color: 'var(--text-muted)', fontWeight: 700 }}>Jours</span>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '3px 10px',
                  borderRadius: '999px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10b981',
                  fontWeight: 800
                }}>
                  {subscriptionDays >= 365 ? '1 An Complet' : subscriptionDays >= 180 ? '6 Mois' : subscriptionDays >= 90 ? '1 Trimestre' : `${subscriptionDays} jours`}
                </span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tarif Journalier Effectif
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px', marginTop: '2px' }}>
                <span>{effectiveRate.toFixed(1)}</span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>MRU / jour</span>
                {discountPct > 0 && (
                  <span style={{
                    fontSize: '0.76rem',
                    background: 'linear-gradient(135deg, #ea580c, #f59e0b)',
                    color: '#ffffff',
                    padding: '3px 9px',
                    borderRadius: '8px',
                    fontWeight: 900,
                    boxShadow: '0 2px 8px rgba(234, 88, 12, 0.4)'
                  }}>
                    -{discountPct}%
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Range Slider Stylé avec barre dynamique */}
          <div style={{ marginBottom: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 700, marginBottom: '8px' }}>
              <span>1 Jour</span>
              <span>90 Jours (3 Mois)</span>
              <span>180 Jours (6 Mois)</span>
              <span>365 Jours (1 An)</span>
            </div>

            <input
              type="range"
              min="1"
              max="365"
              value={subscriptionDays}
              onChange={(e) => setSubscriptionDays(parseInt(e.target.value))}
              className="pricing-range-custom"
              style={{
                background: `linear-gradient(90deg, #10b981 0%, #059669 ${((subscriptionDays - 1) / 364) * 100}%, var(--border-glass) ${((subscriptionDays - 1) / 364) * 100}%, var(--border-glass) 100%)`
              }}
            />
          </div>

          {/* Cartes Préréglées (Quick Presets) avec Badges & Animations */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '28px' }}>
            {[
              { days: 30, label: '1 Mois', icon: '🥉', discount: 'Tarif standard (15 MRU/j)', badge: 'Formule Découverte', isBest: false },
              { days: 90, label: '3 Mois', icon: '🥈', discount: '-33% (10 MRU/j)', badge: 'Populaire', isBest: false },
              { days: 180, label: '6 Mois', icon: '🥇', discount: '-43% (8.5 MRU/j)', badge: 'Économique', isBest: false },
              { days: 365, label: '1 An', icon: '👑', discount: '-50% (7.5 MRU/j)', badge: '⭐ MEILLEURE OFFRE', isBest: true }
            ].map(p => {
              const active = subscriptionDays === p.days;
              return (
                <div
                  key={p.days}
                  onClick={() => setSubscriptionDays(p.days)}
                  className={`pricing-preset-card ${active ? 'active' : ''}`}
                  style={{
                    border: active ? '2px solid #10b981' : p.isBest ? '1.5px solid rgba(245, 158, 11, 0.4)' : undefined
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '1.2rem' }}>{p.icon}</span>
                    <span style={{
                      fontSize: '0.62rem',
                      fontWeight: 900,
                      padding: '2px 8px',
                      borderRadius: '999px',
                      background: active ? 'rgba(255, 255, 255, 0.25)' : p.isBest ? 'rgba(245, 158, 11, 0.18)' : 'var(--bg-card)',
                      color: active ? '#ffffff' : p.isBest ? '#f59e0b' : 'var(--text-dim)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em'
                    }}>
                      {p.badge}
                    </span>
                  </div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {p.label}
                  </div>
                  <div style={{ fontSize: '0.72rem', opacity: active ? 0.95 : 0.75, marginTop: '4px', fontWeight: 600 }}>
                    {p.discount}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Total Box Premium avec Shimmer & Logos Bankily / Masrvi */}
          <div style={{
            background: 'var(--bg-tertiary)',
            border: '1.5px solid var(--border-glass)',
            padding: '28px',
            borderRadius: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '24px'
          }}>
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Total Net Garanti à Régler
              </div>
              <div style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--text-main)', lineHeight: '1.1', marginTop: '4px', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span>{calculatedTotal.toLocaleString('fr-FR')}</span>
                <span style={{ fontSize: '1.2rem', color: 'var(--accent-emerald)', fontWeight: 800 }}>MRU</span>
              </div>
              {savings > 0 ? (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginTop: '8px',
                  fontSize: '0.78rem',
                  color: '#10b981',
                  fontWeight: 800,
                  background: 'rgba(16, 185, 129, 0.12)',
                  padding: '4px 12px',
                  borderRadius: '999px'
                }}>
                  <CheckCircle2 size={14} />
                  <span>Vous économisez {savings.toLocaleString('fr-FR')} MRU sur cette durée (-{discountPct}%)</span>
                </div>
              ) : (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '6px' }}>
                  Tarif standard journalier sans engagement
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-start' }}>
              <button
                onClick={() => {
                  if (!account) {
                    if (onOpenAuthModal) onOpenAuthModal('register', 'restaurant');
                    else onEnterApp('pricing');
                  } else {
                    onEnterApp('pricing');
                  }
                }}
                className="btn-pricing-shimmer"
              >
                <span>Payer par Bankily ou Masrvi</span>
                <ArrowRight size={18} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={14} color="#10b981" /> Activation Instantanée
                </span>
                <span>•</span>
                <span>Sans frais cachés</span>
                <span>•</span>
                <span>Support 24/7 Mauritanie</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FORMULAIRE ESSAI GRATUIT 15 JOURS HAUT DE GAMME */}
      <section id="trial-form" style={{
        padding: '70px 24px',
        maxWidth: '920px',
        margin: '0 auto',
        width: '100%',
        position: 'relative'
      }}>
        {/* Ambient Glow */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '500px',
          height: '350px',
          background: 'radial-gradient(ellipse, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          pointerEvents: 'none',
          zIndex: 0
        }} />

        <div className="glass-panel" style={{
          borderRadius: '28px',
          padding: 'clamp(28px, 5vw, 48px)',
          textAlign: 'center',
          position: 'relative',
          zIndex: 1,
          background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(5, 150, 105, 0.08) 50%, var(--bg-card) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.25), 0 0 35px rgba(16, 185, 129, 0.12)'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#10b981',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 800,
            marginBottom: '16px',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}>
            <span className="pulse-live-dot" />
            <Sparkles size={14} />
            <span>Essai 15 Jours 100% Offert • Sans Carte Bancaire</span>
          </div>

          <h2 style={{
            fontSize: 'clamp(1.9rem, 3.8vw, 2.6rem)',
            fontWeight: 900,
            marginBottom: '10px',
            letterSpacing: '-0.02em',
            color: 'var(--text-main)'
          }}>
            Démarrez Votre Caisse{' '}
            <span style={{
              color: '#10b981',
              display: 'inline-block'
            }}>
              dès Aujourd'hui
            </span>
          </h2>

          <p style={{
            fontSize: '0.95rem',
            color: 'var(--text-muted)',
            marginBottom: '32px',
            maxWidth: '620px',
            margin: '0 auto 32px',
            lineHeight: '1.6'
          }}>
            Aucune carte bancaire requise. Accès immédiat à la version complète : Caisse tactile, gestion des tables, cuisine KDS et carnet de dettes <strong>الكريدي</strong>.
          </p>

          {trialSuccess ? (
            <div style={{
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.35)',
              color: 'var(--accent-emerald)',
              padding: '24px',
              borderRadius: '16px',
              fontWeight: 800,
              fontSize: '1.05rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              animation: 'modalPopIn 0.3s ease-out'
            }}>
              <CheckCircle2 size={24} />
              <span>Félicitations ! Votre compte d'essai 15 jours est activé. Redirection vers votre caisse...</span>
            </div>
          ) : (
            <form onSubmit={handleStartTrial} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '640px', margin: '0 auto' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px' }}>
                <div style={{ position: 'relative' }}>
                  <Store size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  <input
                    type="text"
                    required
                    placeholder="Nom de votre boutique / restaurant *"
                    value={trialName}
                    onChange={(e) => setTrialName(e.target.value)}
                    className="pro-input"
                    style={{ padding: '13px 14px 13px 40px', fontSize: '0.9rem' }}
                  />
                </div>

                <div style={{ position: 'relative' }}>
                  <Phone size={16} color="var(--text-dim)" style={{ position: 'absolute', left: '14px', top: '15px' }} />
                  <input
                    type="tel"
                    required
                    placeholder="Numéro WhatsApp (+222 ...) *"
                    value={trialPhone}
                    onChange={(e) => setTrialPhone(e.target.value)}
                    className="pro-input"
                    style={{ padding: '13px 14px 13px 40px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="hero-cta-btn-primary"
                style={{
                  width: '100%',
                  padding: '15px 24px',
                  fontSize: '1rem',
                  fontWeight: 900,
                  marginTop: '4px',
                  borderRadius: '14px'
                }}
              >
                <span>Activer mon Essai Gratuit & Ouvrir la Caisse</span>
                <ArrowRight size={18} />
              </button>
            </form>
          )}

          {/* Social Proof & Guarantees */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            flexWrap: 'wrap',
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-glass)',
            fontSize: '0.78rem',
            color: 'var(--text-dim)',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={14} color="#10b981" /> 15 Jours Sans Engagement
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Zap size={14} color="#f59e0b" /> Mode 100% Hors-Ligne
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Smartphone size={14} color="#3b82f6" /> Compatible Bankily & Masrvi
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="#10b981" /> Support WhatsApp 7j/7 (+222)
            </div>
          </div>
        </div>
      </section>


      {/* 8. FOOTER CORPORATE (CAISSA.MR) */}
      <footer id="contact" style={{
        background: 'var(--bg-primary)',
        borderTop: '1px solid var(--border-glass)',
        padding: '40px 24px 24px',
        color: 'var(--text-dim)',
        fontSize: '0.8rem'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '30px',
          marginBottom: '30px'
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              Caissa<span style={{ color: '#22c55e' }}>.mr</span>
            </div>
            <p style={{ lineHeight: '1.5' }}>
              Plateforme SaaS de caisse tactile intelligente et gestion commerciale conçue pour les commerces, restaurants et supérettes en Mauritanie.
            </p>
          </div>

          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>Contact & Siège Nouakchott</div>
            <div>Avenue Moktar Ould Daddah</div>
            <div>Tevragh-Zeina, Nouakchott, Mauritanie</div>
            <div style={{ marginTop: '6px' }}>Tél / WhatsApp : +222 36 32 22 25</div>
          </div>

          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>Modules & Services</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span onClick={() => { if (!account) { onOpenAuthModal?.('login'); } else { onEnterApp('pos'); } }} style={{ cursor: 'pointer' }}>Point de Vente POS</span>
              <span onClick={() => { if (!account) { onOpenAuthModal?.('login'); } else { onEnterApp('kridi'); } }} style={{ cursor: 'pointer' }}>Carnet الكريدي</span>
              <span onClick={() => { if (!account) { onOpenAuthModal?.('login'); } else { onEnterApp('stock'); } }} style={{ cursor: 'pointer' }}>Gestion des Stocks</span>
              <span onClick={() => { if (!account) { onOpenAuthModal?.('login'); } else { onEnterApp('dashboard'); } }} style={{ cursor: 'pointer' }}>Marges & Rentabilité</span>
              <span onClick={() => { if (!account) { onOpenAuthModal?.('login'); } else { onEnterApp('kds'); } }} style={{ cursor: 'pointer' }}>Écran Cuisine (KDS)</span>
            </div>
          </div>

          <div>
            <div style={{ fontWeight: 800, color: 'var(--text-main)', marginBottom: '10px' }}>Conformité RIM</div>
            <div>N.I.F : 12048592/RIM</div>
            <div>R.C : 89452/NKC</div>
            <div>TVA légale : 16%</div>
            <div style={{ marginTop: '8px', color: '#10b981', fontWeight: 700 }}>
              ✓ Factures et tickets certifiés
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '20px',
          textAlign: 'center',
          color: 'var(--text-dim)',
          fontSize: '0.8rem'
        }}>
          <div>© 2026 Caissa.mr — Tous droits réservés.</div>
        </div>
      </footer>
    </div>
  );
};
