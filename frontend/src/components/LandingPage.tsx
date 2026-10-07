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
  Phone
} from 'lucide-react';
import type { UserAccount } from './AuthModal';

interface LandingPageProps {
  onEnterApp: (tab?: string) => void;
  sector?: 'restaurant' | 'market';
  setSector: (sector: 'restaurant' | 'market') => void;
  theme?: 'dark' | 'light';
  setTheme?: (theme: 'dark' | 'light') => void;
  account?: UserAccount | null;
  onOpenAuthModal?: (mode?: 'register' | 'login', preSector?: 'restaurant' | 'market') => void;
  onLogout?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  setSector,
  account,
  onOpenAuthModal,
  onLogout
}) => {
  const [activePreviewTab, setActivePreviewTab] = useState<'pos' | 'kridi' | 'stock' | 'dashboard' | 'kds'>('pos');
  const [restaurantCaptureTab, setRestaurantCaptureTab] = useState<'tables' | 'kds' | 'pos' | 'receipt'>('tables');
  const [subscriptionDays, setSubscriptionDays] = useState<number>(365);
  const [trialPhone, setTrialPhone] = useState<string>('');
  const [trialName, setTrialName] = useState<string>('');
  const [trialSuccess, setTrialSuccess] = useState<boolean>(false);

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
      onEnterApp('pos');
    }, 1500);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* 1. TOP ANNOUNCEMENT BANNER */}
      <div style={{
        background: 'linear-gradient(90deg, #006233 0%, #16a34a 50%, #d97706 100%)',
        color: '#ffffff',
        padding: '8px 16px',
        textAlign: 'center',
        fontSize: '0.8rem',
        fontWeight: 700,
        letterSpacing: '0.02em',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <span>🎉 Offre Lancement Mauritanie : Jusqu'à -50% sur l'abonnement annuel & 15 jours d'essai 100% gratuit !</span>
        <button 
          onClick={() => onEnterApp('pricing')}
          style={{
            background: 'rgba(255, 255, 255, 0.25)',
            border: 'none',
            color: '#fff',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            cursor: 'pointer',
            fontWeight: 800
          }}
        >
          Voir les Tarifs ➔
        </button>
      </div>

      {/* 2. LANDING NAVBAR */}
      <header style={{
        borderBottom: '1px solid var(--border-glass)',
        background: 'var(--bg-secondary)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)'
      }}>
        <div style={{
          maxWidth: '1240px',
          margin: '0 auto',
          padding: '14px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '20px'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div style={{
              background: 'linear-gradient(135deg, #006233, #16a34a)',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(22, 163, 74, 0.35)'
            }}>
              <Store size={20} color="#fff" />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
                  Caissa<span style={{ color: '#22c55e' }}>.mr</span>
                </span>
                <span style={{
                  background: 'rgba(22, 163, 74, 0.15)',
                  color: '#22c55e',
                  border: '1px solid rgba(22, 163, 74, 0.3)',
                  padding: '1px 6px',
                  borderRadius: '4px',
                  fontSize: '0.65rem',
                  fontWeight: 800
                }}>
                  🇲🇷 RIM
                </span>
              </div>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                Point de Vente & Gestion Commerciale
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <a href="#features" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
              Fonctionnalités
            </a>
            <a href="#sectors" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
              Secteurs
            </a>
            <a href="#kridi" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
              الكريدي (Crédits)
            </a>
            <a href="#pricing" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
              Tarifs
            </a>
            <a href="#contact" style={{ textDecoration: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
              Support & Contact
            </a>
          </nav>

          {/* CTA Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {account ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 12px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  border: '1px solid rgba(34, 197, 94, 0.35)',
                  borderRadius: '999px',
                  fontSize: '0.78rem',
                  fontWeight: 800
                }}>
                  <UtensilsCrossed size={13} color="#22c55e" />
                  <span>{account.businessName}</span>
                  <span style={{ fontSize: '0.62rem', background: '#22c55e', color: '#000', padding: '1px 5px', borderRadius: '4px', fontWeight: 800 }}>
                    Essai 14j
                  </span>
                </div>
                <button
                  onClick={() => onEnterApp('pos')}
                  className="btn-primary"
                  style={{
                    padding: '8px 16px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Store size={14} />
                  <span>Ouvrir ma Caisse ➔</span>
                </button>
                <button
                  onClick={onLogout}
                  className="btn-secondary"
                  style={{ padding: '8px 12px', fontSize: '0.76rem' }}
                  title="Se déconnecter"
                >
                  Déconnexion
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => onOpenAuthModal ? onOpenAuthModal('login') : onEnterApp('pos')}
                  className="btn-secondary"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: '1px solid var(--border-glass)',
                    background: 'var(--bg-card)'
                  }}
                >
                  <Store size={14} />
                  <span>Se Connecter</span>
                </button>

                <button
                  onClick={() => onOpenAuthModal ? onOpenAuthModal('register', 'restaurant') : onEnterApp('pos')}
                  className="btn-primary"
                  style={{
                    padding: '9px 20px',
                    borderRadius: '999px',
                    fontSize: '0.82rem',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '7px',
                    background: 'linear-gradient(135deg, #006233, #16a34a)',
                    boxShadow: '0 4px 16px rgba(22, 163, 74, 0.4)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}
                >
                  <Sparkles size={14} />
                  <span>Créer un Compte Restaurant (14j Gratuits)</span>
                  <ArrowRight size={14} />
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
            <span style={{ color: '#10b981' }}>La Solution POS Cloud & Caisse Tactile n°1 en Mauritanie</span>
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
            color: 'var(--text-main)'
          }}>
            La Caisse Enregistreuse Intelligente pour{' '}
            <span style={{
              background: 'linear-gradient(135deg, #006233 0%, #16a34a 50%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Boutiques & Restaurants
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
            lineHeight: '1.65'
          }}>
            Encaissez en un éclair avec <strong style={{ color: '#ea580c' }}>Bankily (BPM)</strong>, <strong style={{ color: '#2563eb' }}>Masrvi (BIM)</strong> et Espèces. Maîtrisez vos dettes clients avec le <strong style={{ color: '#a855f7' }}>Carnet de Crédit (الكريدي)</strong>, gérez vos stocks et imprimez des tickets conformes <strong style={{ color: '#10b981' }}>NIF & TVA 16%</strong>, même sans connexion internet.
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
            fontWeight: 600
          }}>
            <span style={{ color: '#f59e0b', fontSize: '0.9rem', letterSpacing: '1px' }}>★★★★★</span>
            <span><strong>4.9/5</strong> plébiscité par +180 commerces et restaurants à Nouakchott & Nouadhibou</span>
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
              <span>{account ? 'Accéder à ma Caisse Restaurant ➔' : 'Créer un Compte Restaurant (Essai 14j Gratuit)'}</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => onEnterApp('pos')}
              className="hero-cta-btn-glass"
            >
              <Store size={18} color="#10b981" />
              <span>Lancer la Démo Caisse (go.caissa.mr)</span>
            </button>

            <button
              onClick={() => onEnterApp('kridi')}
              className="hero-cta-btn-glass"
            >
              <BookOpen size={18} color="#a855f7" />
              <span>Découvrir le Carnet Kridi</span>
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

      {/* 3.5. NOUVELLE SECTION VITRINE : SYSTÈME RESTAURATION COMPLET AVEC CAPTURES RÉELLES & ANIMATIONS */}
      <section className="restaurant-showcase-section">
        {/* En-tête de la section Restauration */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(234, 88, 12, 0.12)',
            border: '1px solid rgba(234, 88, 12, 0.35)',
            padding: '6px 16px',
            borderRadius: '999px',
            fontSize: '0.78rem',
            fontWeight: 800,
            color: '#ea580c',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '12px'
          }}>
            <UtensilsCrossed size={14} />
            <span>Spécial Restaurants, Cafés & Fast-Foods Mauritanie</span>
            <span style={{ background: '#ea580c', color: '#fff', fontSize: '0.62rem', padding: '1px 6px', borderRadius: '4px', fontWeight: 900 }}>NOUVEAU</span>
          </div>

          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 900, letterSpacing: '-0.02em', margin: '0 0 10px' }}>
            Un Système Restaurant Complet &{' '}
            <span style={{
              background: 'linear-gradient(135deg, #ea580c 0%, #f59e0b 50%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block'
            }}>
              Ultra-Fluide en Direct
            </span>
          </h2>
          <p style={{ fontSize: '0.96rem', color: 'var(--text-muted)', maxWidth: '780px', margin: '0 auto', lineHeight: '1.6' }}>
            Découvrez en direct l'interface tactile utilisée par les serveurs, le plan de table 2D interactif, l'écran cuisine KDS sans fil et l'impression automatique des tickets d'addition en MRU.
          </p>
        </div>

        {/* Sélecteur d'onglets animé pour basculer entre les captures */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '28px'
        }}>
          {[
            { id: 'tables', label: '1. Plan de Tables & Salons', icon: UtensilsCrossed, badge: 'Salles VIP & Terrasse' },
            { id: 'kds', label: '2. Écran Cuisine KDS', icon: ChefHat, badge: 'Zéro Papier' },
            { id: 'pos', label: '3. Prise de Commande Tactile', icon: Store, badge: 'Rapide < 5s' },
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

        {/* Cadre Mockup Haute Définition avec la capture sélectionnée & badges flottants */}
        <div className="restaurant-mockup-frame">
          {/* Topbar style macOS / Tablette Restaurant */}
          <div className="restaurant-mockup-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }} />
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ marginLeft: '12px', fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace', fontWeight: 600 }}>
                {restaurantCaptureTab === 'tables' && 'caissa.mr/restaurant/plan-de-tables • Salle Principale & Terrasse'}
                {restaurantCaptureTab === 'kds' && 'caissa.mr/restaurant/cuisine-kds • Écran Chef Cuisinier en Direct'}
                {restaurantCaptureTab === 'pos' && 'caissa.mr/restaurant/caisse-tactile • Prise de Commande & Menu'}
                {restaurantCaptureTab === 'receipt' && 'caissa.mr/restaurant/ticket • Rapprochement Bankily / Masrvi'}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span className="pulse-live-dot" />
              <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Système Actif en Ligne
              </span>
              <button
                onClick={() => {
                  setSector('restaurant');
                  onEnterApp(restaurantCaptureTab === 'tables' ? 'tables' : restaurantCaptureTab === 'kds' ? 'kds' : 'pos');
                }}
                className="btn-primary"
                style={{ padding: '4px 12px', fontSize: '0.75rem', fontWeight: 800, borderRadius: '6px', marginLeft: '6px' }}
              >
                Tester ce mode ➔
              </button>
            </div>
          </div>

          {/* Zone d'affichage de la capture d'écran avec badges flottants */}
          <div style={{ position: 'relative', width: '100%', minHeight: '380px', maxHeight: '620px', overflow: 'hidden', background: '#020617', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* L'image de capture réelle */}
            <img
              src={
                restaurantCaptureTab === 'tables'
                  ? '/screenshots/tables_restaurant_screen_1791315425516.png'
                  : restaurantCaptureTab === 'kds'
                  ? '/screenshots/kds_restaurant_screen_1791315455733.png'
                  : restaurantCaptureTab === 'pos'
                  ? '/screenshots/pos_restaurant_screen_photos.png'
                  : '/screenshots/payment_receipt_success_1791318272048.png'
              }
              alt="Capture Système Restaurant Caissa"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain',
                transition: 'transform 0.4s ease, opacity 0.3s ease',
                maxHeight: '620px'
              }}
            />

            {/* Badges Flottants Interactifs Animés selon l'onglet actif */}
            {restaurantCaptureTab === 'tables' && (
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

            {restaurantCaptureTab === 'kds' && (
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

            {restaurantCaptureTab === 'pos' && (
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

            {restaurantCaptureTab === 'receipt' && (
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
          </div>

          {/* Bandeau d'information sous la capture avec 3 piliers */}
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
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <UtensilsCrossed size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>Plan de Salle Sur-Mesure</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Glissez-déposez vos tables (VIP, Terrasse, Salons)</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(234, 88, 12, 0.12)', color: '#ea580c', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <ChefHat size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>KDS Cuisine Connecté</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Chronomètres de cuisson et alertes de retard</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Smartphone size={20} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>Prise de Commande Mobile</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Serveurs équipés de téléphones ou tablettes</div>
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
              onClick={() => onEnterApp(activePreviewTab)}
              className="btn-primary"
              style={{ padding: '6px 14px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Ouvrir ce module dans le SaaS</span>
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
                  <button onClick={() => onEnterApp('pos')} className="btn-secondary" style={{ padding: '8px', fontSize: '0.75rem', color: '#f97316' }}>
                    📱 Payer par Bankily
                  </button>
                  <button onClick={() => onEnterApp('pos')} className="btn-secondary" style={{ padding: '8px', fontSize: '0.75rem', color: '#60a5fa' }}>
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
                  <button onClick={() => onEnterApp('kds')} className="btn-primary" style={{ padding: '6px 12px', fontSize: '0.75rem' }}>
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
                background: 'linear-gradient(135deg, #006233 0%, #16a34a 50%, #10b981 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
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
                  onEnterApp('pos');
                }}
                className="sector-btn-action"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-main)'
                }}
              >
                <span>Tester Mode Boutique (Démo)</span>
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
                  setSector('market');
                  onEnterApp('pos');
                }}
                className="sector-btn-action"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-main)'
                }}
              >
                <span>Tester Mode Pesée (Démo)</span>
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
                  setSector('market');
                  onEnterApp('pos');
                }}
                className="sector-btn-action"
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-main)'
                }}
              >
                <span>Tester Mode Cosmétique (Démo)</span>
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
                onClick={() => onEnterApp('dashboard')}
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
              background: 'linear-gradient(135deg, #006233 0%, #16a34a 50%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
                  background: 'linear-gradient(135deg, #10b981, #22c55e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
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
                onClick={() => onEnterApp('pricing')}
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
              background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
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
              <span onClick={() => onEnterApp('pos')} style={{ cursor: 'pointer' }}>Point de Vente POS</span>
              <span onClick={() => onEnterApp('kridi')} style={{ cursor: 'pointer' }}>Carnet الكريدي</span>
              <span onClick={() => onEnterApp('stock')} style={{ cursor: 'pointer' }}>Gestion des Stocks</span>
              <span onClick={() => onEnterApp('dashboard')} style={{ cursor: 'pointer' }}>Marges & Rentabilité</span>
              <span onClick={() => onEnterApp('kds')} style={{ cursor: 'pointer' }}>Écran Cuisine (KDS)</span>
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
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px'
        }}>
          <div>© 2026 Caissa.mr — Tous droits réservés. Modèle SaaS inspiré de Caissa.tn adapté pour la Mauritanie.</div>
          <button
            onClick={() => onEnterApp('pos')}
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.75rem' }}
          >
            Lancer l'Application Caisse ➔
          </button>
        </div>
      </footer>
    </div>
  );
};
