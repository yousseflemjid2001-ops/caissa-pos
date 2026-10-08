import React, { useState } from 'react';
import { 
  Store, 
  UtensilsCrossed, 
  ShoppingBag, 
  LayoutGrid, 
  ChefHat, 
  BookOpen, 
  CreditCard, 
  Sun, 
  Moon, 
  Server, 
  Receipt, 
  Package, 
  TrendingUp, 
  User, 
  KeyRound, 
  X,
  Home,
  Bot,
  ChevronDown,
  SlidersHorizontal,
  Scale,
  Sparkles,
  Globe,
  Calculator,
  Building2,
  Plus,
  ShieldCheck
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { loginPinApi } from '../services/api';
import type { UserAccount, PointDeVente } from './AuthModal';
import type { SectorType } from '../data/mockData';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  sector: SectorType;
  setSector: (sector: SectorType) => void;
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  cartCount: number;
  isBackendConnected: boolean;
  currentCashier?: { name: string; role: string };
  onCashierChanged?: (user: { name: string; role: string }) => void;
  account?: UserAccount | null;
  onLogout?: () => void;
  onOpenAuthModal?: () => void;
  unsyncedOrdersCount?: number;
  onTriggerSync?: () => void;
  onOpenDatabaseModal?: () => void;
  // Multi-Points de Vente & Cloisonnement Strict
  activePointDeVente?: PointDeVente | null;
  pointsDeVente?: PointDeVente[];
  onSwitchPointDeVente?: (pdvId: string) => void;
  onAddPointDeVente?: (newPdv: Omit<PointDeVente, 'id'>) => void;
  cartsByPdv?: Record<string, any[]>;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  sector,
  setSector,
  theme,
  setTheme,
  cartCount,
  isBackendConnected,
  currentCashier = { name: 'Sidi Mohamed', role: 'Patron' },
  onCashierChanged,
  account,
  onLogout,
  onOpenAuthModal,
  unsyncedOrdersCount = 0,
  onTriggerSync,
  onOpenDatabaseModal,
  activePointDeVente,
  pointsDeVente = [],
  onSwitchPointDeVente,
  onAddPointDeVente,
  cartsByPdv = {}
}) => {
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState<boolean>(false);
  const [isGestionMenuOpen, setIsGestionMenuOpen] = useState<boolean>(false);
  const [isPdvDropdownOpen, setIsPdvDropdownOpen] = useState<boolean>(false);
  const [isAddPdvModalOpen, setIsAddPdvModalOpen] = useState<boolean>(false);
  const [newPdvName, setNewPdvName] = useState<string>('');
  const [newPdvSector, setNewPdvSector] = useState<SectorType>('market');
  const [newPdvAddress, setNewPdvAddress] = useState<string>('Tevragh-Zeina, Nouakchott');
  const [newPdvCaisses, setNewPdvCaisses] = useState<number>(1);
  const [pinCode, setPinCode] = useState<string>('');
  const [pinError, setPinError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'fr' ? 'ar' : 'fr');
  };

  const handlePinSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setPinError(null);

    try {
      const res = await loginPinApi(pinCode);
      if (res && res.user) {
        if (onCashierChanged) {
          onCashierChanged({ name: res.user.fullName, role: res.user.role === 'OWNER' ? 'Patron' : 'Caissier' });
        }
        setIsPinModalOpen(false);
        setPinCode('');
      }
    } catch (err: any) {
      if (pinCode === '1234') {
        if (onCashierChanged) onCashierChanged({ name: 'Sidi Mohamed', role: 'Patron' });
        setIsPinModalOpen(false);
        setPinCode('');
      } else if (pinCode === '0000') {
        if (onCashierChanged) onCashierChanged({ name: 'Ely', role: 'Caissier' });
        setIsPinModalOpen(false);
        setPinCode('');
      } else {
        setPinError('Code PIN incorrect (essayez 1234 ou 0000)');
      }
    }
  };

  const handleAppendPin = (digit: string) => {
    if (pinCode.length < 4) {
      const next = pinCode + digit;
      setPinCode(next);
      if (next.length === 4) {
        setTimeout(() => {
          if (next === '1234') {
            if (onCashierChanged) onCashierChanged({ name: 'Sidi Mohamed', role: 'Patron' });
            setIsPinModalOpen(false);
            setPinCode('');
          } else if (next === '0000') {
            if (onCashierChanged) onCashierChanged({ name: 'Ely', role: 'Caissier' });
            setIsPinModalOpen(false);
            setPinCode('');
          } else {
            handlePinSubmit();
          }
        }, 150);
      }
    }
  };

  return (
    <header className="glass-panel" style={{
      margin: '8px 16px',
      padding: '0 16px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      position: 'sticky',
      top: '8px',
      zIndex: 50,
      flexWrap: 'nowrap'
    }}>
      {/* 1. Left: Brand & Business Switcher */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        <button
          onClick={() => setCurrentTab('landing')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0
          }}
          title="Retourner au portail vitrine Caissa.mr"
        >
          <div style={{
            background: '#059669',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
          }}>
            <Store size={17} color="#fff" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '-0.02em', color: 'var(--text-main)' }}>
                Caissa<span style={{ color: '#10b981' }}>.mr</span>
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#10b981',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                padding: '0 4px',
                borderRadius: '4px',
                fontSize: '0.58rem',
                fontWeight: 800
              }}>
                MRU
              </span>
            </div>
          </div>
        </button>

        <div style={{ width: '1px', height: '22px', background: 'var(--border-glass)' }} />

        {/* Active Account Pill & Dedicated Point of Sale Selector */}
        {account ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', position: 'relative' }}>
            {/* Account Pill */}
            <button
              onClick={() => setIsAccountModalOpen(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-main)',
                cursor: 'pointer',
                fontSize: '0.74rem'
              }}
              title="Gérer les informations de l'entreprise et succursales"
            >
              <Building2 size={13} color="#10b981" />
              <span style={{ fontWeight: 800, maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {account.businessName}
              </span>
              <span style={{
                background: '#059669',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.58rem',
                padding: '1px 4px',
                borderRadius: '3px'
              }}>
                14j
              </span>
            </button>

            {/* SEPARATED POINT OF SALE (PDV) SWITCHER */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsPdvDropdownOpen(prev => !prev)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  background: isPdvDropdownOpen ? 'rgba(16, 185, 129, 0.18)' : 'var(--bg-tertiary)',
                  border: isPdvDropdownOpen ? '1px solid #10b981' : '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  cursor: 'pointer',
                  fontSize: '0.74rem',
                  boxShadow: isPdvDropdownOpen ? '0 0 10px rgba(16, 185, 129, 0.25)' : 'none'
                }}
                title="Changer de Point de Vente (Caisses et Données 100% Séparées)"
              >
                <div style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#10b981',
                  boxShadow: '0 0 6px #10b981'
                }} />
                <Store size={13} color="#10b981" />
                <span style={{ fontWeight: 800, maxWidth: '135px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {activePointDeVente ? activePointDeVente.name : 'Point de Vente 1'}
                </span>
                <span style={{
                  background: sector === 'restaurant' ? '#ea580c' : (sector === 'market' ? '#059669' : (sector === 'butcher' ? '#d97706' : '#9333ea')),
                  color: '#ffffff',
                  fontSize: '0.58rem',
                  fontWeight: 800,
                  padding: '1px 5px',
                  borderRadius: '3px'
                }}>
                  {activePointDeVente?.code || 'PDV-01'}
                </span>
                <ChevronDown size={11} color="var(--text-muted)" style={{ transform: isPdvDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
              </button>

              {/* Point of Sale Dropdown Menu */}
              {isPdvDropdownOpen && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '8px',
                  width: '320px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.45)',
                  padding: '12px',
                  zIndex: 100,
                  backdropFilter: 'blur(16px)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px solid var(--border-glass)' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 900, color: 'var(--text-main)' }}>
                        Points de Vente ({pointsDeVente.length || 1})
                      </div>
                      <div style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 700 }}>
                        🔒 Données et caisses 100% isolées par succursale
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPdvDropdownOpen(false)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  {/* List of Points of Sale */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '240px', overflowY: 'auto' }}>
                    {pointsDeVente.map((pdv) => {
                      const isActive = pdv.id === activePointDeVente?.id;
                      const pdvCartCount = cartsByPdv[pdv.id]?.reduce((sum: number, it: any) => sum + it.quantity, 0) || 0;
                      return (
                        <div
                          key={pdv.id}
                          onClick={() => {
                            if (onSwitchPointDeVente) onSwitchPointDeVente(pdv.id);
                            setIsPdvDropdownOpen(false);
                          }}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'var(--bg-tertiary)',
                            border: isActive ? '1px solid #10b981' : '1px solid transparent',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              background: isActive ? '#10b981' : 'var(--text-dim)',
                              boxShadow: isActive ? '0 0 6px #10b981' : 'none'
                            }} />
                            <div>
                              <div style={{ fontSize: '0.74rem', fontWeight: 800, color: isActive ? '#10b981' : 'var(--text-main)' }}>
                                {pdv.name}
                              </div>
                              <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)' }}>
                                📍 {pdv.address || pdv.city} • {pdv.caisseCount || 1} caisse(s)
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                            <span style={{
                              fontSize: '0.58rem',
                              fontWeight: 800,
                              padding: '1px 5px',
                              borderRadius: '3px',
                              background: pdv.sector === 'restaurant' ? 'rgba(234, 88, 12, 0.2)' : (pdv.sector === 'market' ? 'rgba(5, 150, 105, 0.2)' : 'rgba(217, 119, 6, 0.2)'),
                              color: pdv.sector === 'restaurant' ? '#ea580c' : (pdv.sector === 'market' ? '#10b981' : '#d97706')
                            }}>
                              {pdv.code}
                            </span>
                            {pdvCartCount > 0 && (
                              <span style={{ fontSize: '0.6rem', color: '#f59e0b', fontWeight: 700 }}>
                                🛒 {pdvCartCount}
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Add New Point of Sale Button */}
                  <button
                    onClick={() => {
                      setIsPdvDropdownOpen(false);
                      setIsAddPdvModalOpen(true);
                    }}
                    style={{
                      width: '100%',
                      marginTop: '8px',
                      padding: '8px',
                      borderRadius: '8px',
                      background: 'none',
                      border: '1px dashed #10b981',
                      color: '#10b981',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px'
                    }}
                  >
                    <Plus size={13} />
                    <span>+ Ajouter un Point de Vente / Succursale</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={onOpenAuthModal}
              className="btn-primary"
              style={{
                padding: '4px 8px',
                fontSize: '0.72rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                borderRadius: '6px'
              }}
            >
              <span>{t('nav.login') || 'Créer Compte'}</span>
            </button>

            {/* Sector Switcher Segmented Control (Fallback Mode Visiteur) */}
            <div style={{
              display: 'flex',
              background: 'var(--bg-tertiary)',
              padding: '2px',
              borderRadius: '6px',
              border: '1px solid var(--border-glass)'
            }}>
              <button
                onClick={() => setSector('restaurant')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: sector === 'restaurant' ? 700 : 500,
                  background: sector === 'restaurant' ? '#ea580c' : 'transparent',
                  color: sector === 'restaurant' ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
                title="Mode Restauration & Chwaya"
              >
                <UtensilsCrossed size={11} />
                <span>{i18n.language === 'ar' ? 'مطاعم' : 'Resto'}</span>
              </button>
              <button
                onClick={() => setSector('market')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: sector === 'market' ? 700 : 500,
                  background: sector === 'market' ? '#059669' : 'transparent',
                  color: sector === 'market' ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
                title="Mode Boutique, Épicerie & Hanout"
              >
                <ShoppingBag size={11} />
                <span>{i18n.language === 'ar' ? 'بقالة' : 'Boutique'}</span>
              </button>
              <button
                onClick={() => setSector('butcher')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: sector === 'butcher' ? 700 : 500,
                  background: sector === 'butcher' ? '#d97706' : 'transparent',
                  color: sector === 'butcher' ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
                title="Mode Boucherie, Poisson & Pesée au Kg"
              >
                <Scale size={11} />
                <span>{i18n.language === 'ar' ? 'ميزان' : 'Pesée'}</span>
              </button>
              <button
                onClick={() => setSector('cosmetics')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '3px 7px',
                  borderRadius: '4px',
                  fontSize: '0.7rem',
                  fontWeight: sector === 'cosmetics' ? 700 : 500,
                  background: sector === 'cosmetics' ? '#0284c7' : 'transparent',
                  color: sector === 'cosmetics' ? '#fff' : 'var(--text-muted)',
                  transition: 'all 0.15s ease'
                }}
                title="Mode Cosmétiques & Parapharmacie"
              >
                <Sparkles size={11} />
                <span>{i18n.language === 'ar' ? 'تجميل' : 'Beauté'}</span>
              </button>
            </div>
          </>
        )}
      </div>

      {/* 2. Center: Sleek Unified Navigation Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexShrink: 0
      }}>
        {/* Point de Vente */}
        <button
          onClick={() => { setCurrentTab('pos'); setIsGestionMenuOpen(false); }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: currentTab === 'pos' ? 700 : 600,
            background: currentTab === 'pos' ? '#059669' : 'transparent',
            color: currentTab === 'pos' ? '#ffffff' : 'var(--text-muted)',
            border: `1px solid ${currentTab === 'pos' ? '#047857' : 'transparent'}`,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Store size={14} />
          <span>{t('nav.pos') || 'Point de Vente'}</span>
          {cartCount > 0 && (
            <span style={{
              background: currentTab === 'pos' ? 'rgba(0,0,0,0.25)' : '#e11d48',
              color: 'white',
              fontSize: '0.62rem',
              fontWeight: 800,
              padding: '1px 5px',
              borderRadius: '999px'
            }}>
              {cartCount}
            </span>
          )}
        </button>

        {/* Restaurant Mode: Tables & Cuisine KDS */}
        {sector === 'restaurant' && (
          <>
            <button
              onClick={() => { setCurrentTab('tables'); setIsGestionMenuOpen(false); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: currentTab === 'tables' ? 700 : 600,
                background: currentTab === 'tables' ? '#059669' : 'transparent',
                color: currentTab === 'tables' ? '#ffffff' : 'var(--text-muted)',
                border: `1px solid ${currentTab === 'tables' ? '#047857' : 'transparent'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <LayoutGrid size={14} />
              <span>{t('nav.tables')}</span>
            </button>

            <button
              onClick={() => { setCurrentTab('kds'); setIsGestionMenuOpen(false); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: currentTab === 'kds' ? 700 : 600,
                background: currentTab === 'kds' ? '#059669' : 'transparent',
                color: currentTab === 'kds' ? '#ffffff' : 'var(--text-muted)',
                border: `1px solid ${currentTab === 'kds' ? '#047857' : 'transparent'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <ChefHat size={14} />
              <span>{t('nav.kds')}</span>
            </button>
          </>
        )}

        {/* Ventes (Tickets) */}
        <button
          onClick={() => { setCurrentTab('ventes'); setIsGestionMenuOpen(false); }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: currentTab === 'ventes' ? 700 : 600,
            background: currentTab === 'ventes' ? '#059669' : 'transparent',
            color: currentTab === 'ventes' ? '#ffffff' : 'var(--text-muted)',
            border: `1px solid ${currentTab === 'ventes' ? '#047857' : 'transparent'}`,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Receipt size={14} />
          <span>{t('nav.ventes')}</span>
        </button>

        {/* Market Mode: Stocks & Kridi */}
        {sector === 'market' && (
          <>
            <button
              onClick={() => { setCurrentTab('stock'); setIsGestionMenuOpen(false); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: currentTab === 'stock' ? 700 : 600,
                background: currentTab === 'stock' ? '#059669' : 'transparent',
                color: currentTab === 'stock' ? '#ffffff' : 'var(--text-muted)',
                border: `1px solid ${currentTab === 'stock' ? '#047857' : 'transparent'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Package size={14} />
              <span>{t('nav.stock') || 'Stocks'}</span>
            </button>

            <button
              onClick={() => { setCurrentTab('kridi'); setIsGestionMenuOpen(false); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: currentTab === 'kridi' ? 700 : 600,
                background: currentTab === 'kridi' ? '#059669' : 'transparent',
                color: currentTab === 'kridi' ? '#ffffff' : 'var(--text-muted)',
                border: `1px solid ${currentTab === 'kridi' ? '#047857' : 'transparent'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <BookOpen size={14} />
              <span>{t('nav.kridi') || 'الكريدي'}</span>
            </button>

            <button
              onClick={() => { setCurrentTab('compta'); setIsGestionMenuOpen(false); }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 12px',
                borderRadius: '6px',
                fontSize: '0.78rem',
                fontWeight: currentTab === 'compta' ? 700 : 600,
                background: currentTab === 'compta' ? '#059669' : 'transparent',
                color: currentTab === 'compta' ? '#ffffff' : 'var(--text-muted)',
                border: `1px solid ${currentTab === 'compta' ? '#047857' : 'transparent'}`,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              <Calculator size={14} />
              <span>{t('nav.compta') || 'Comptabilité'}</span>
            </button>
          </>
        )}

        {/* Administration & Configuration */}
        <button
          onClick={() => { setCurrentTab('gestion'); setIsGestionMenuOpen(false); }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            padding: '5px 12px',
            borderRadius: '6px',
            fontSize: '0.78rem',
            fontWeight: currentTab === 'gestion' ? 700 : 600,
            background: currentTab === 'gestion' ? '#059669' : 'transparent',
            color: currentTab === 'gestion' ? '#ffffff' : 'var(--text-muted)',
            border: `1px solid ${currentTab === 'gestion' ? '#047857' : 'transparent'}`,
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <SlidersHorizontal size={14} />
          <span>{t('nav.gestion')}</span>
        </button>

        {/* Executive Dropdown: Back-Office & Gestion */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setIsGestionMenuOpen(!isGestionMenuOpen)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: ['gestion', 'stock', 'kridi', 'dashboard', 'ai', 'pricing', 'compta'].includes(currentTab) ? 700 : 600,
              background: ['gestion', 'stock', 'kridi', 'dashboard', 'ai', 'pricing', 'compta'].includes(currentTab) ? 'rgba(5, 150, 105, 0.15)' : 'transparent',
              color: ['gestion', 'stock', 'kridi', 'dashboard', 'ai', 'pricing', 'compta'].includes(currentTab) ? '#10b981' : 'var(--text-muted)',
              border: '1px solid var(--border-glass)',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <SlidersHorizontal size={13} />
            <span>{t('nav.modules')}</span>
            <ChevronDown size={11} style={{ transform: isGestionMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
          </button>

          {isGestionMenuOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              zIndex: 100,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              padding: '6px',
              minWidth: '220px',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <button
                onClick={() => { setCurrentTab('gestion'); setIsGestionMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '5px',
                  background: currentTab === 'gestion' ? 'var(--bg-tertiary)' : 'transparent',
                  color: currentTab === 'gestion' ? '#10b981' : 'var(--text-main)',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <SlidersHorizontal size={13} color="#10b981" />
                <span>⚙️ Tables, Caissiers & Articles</span>
              </button>
              {sector === 'restaurant' && (
                <>
                  <button
                    onClick={() => { setCurrentTab('stock'); setIsGestionMenuOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 10px',
                      borderRadius: '5px',
                      background: currentTab === 'stock' ? 'var(--bg-tertiary)' : 'transparent',
                      color: currentTab === 'stock' ? '#10b981' : 'var(--text-main)',
                      border: 'none',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <Package size={13} />
                    <span>Stocks & Articles</span>
                  </button>

                  <button
                    onClick={() => { setCurrentTab('kridi'); setIsGestionMenuOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '7px 10px',
                      borderRadius: '5px',
                      background: currentTab === 'kridi' ? 'var(--bg-tertiary)' : 'transparent',
                      color: currentTab === 'kridi' ? '#10b981' : 'var(--text-main)',
                      border: 'none',
                      fontSize: '0.76rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    <BookOpen size={13} />
                    <span>الكريدي (Crédits Clients)</span>
                  </button>
                </>
              )}

              <button
                onClick={() => { setCurrentTab('dashboard'); setIsGestionMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '5px',
                  background: currentTab === 'dashboard' ? 'var(--bg-tertiary)' : 'transparent',
                  color: currentTab === 'dashboard' ? '#10b981' : 'var(--text-main)',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <TrendingUp size={13} />
                <span>Marges & Analyse CA</span>
              </button>

              <button
                onClick={() => { setCurrentTab('compta'); setIsGestionMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '5px',
                  background: currentTab === 'compta' ? 'var(--bg-tertiary)' : 'transparent',
                  color: currentTab === 'compta' ? '#10b981' : 'var(--text-main)',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Calculator size={13} color="#10b981" />
                <span>📊 Comptabilité & Grand Livre (P&L)</span>
              </button>

              <button
                onClick={() => { setCurrentTab('ai'); setIsGestionMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '5px',
                  background: currentTab === 'ai' ? 'var(--bg-tertiary)' : 'transparent',
                  color: currentTab === 'ai' ? '#10b981' : 'var(--text-main)',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <Bot size={13} />
                <span>IA Copilot (4 Agents)</span>
              </button>

              <button
                onClick={() => { setCurrentTab('pricing'); setIsGestionMenuOpen(false); }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '7px 10px',
                  borderRadius: '5px',
                  background: currentTab === 'pricing' ? 'var(--bg-tertiary)' : 'transparent',
                  color: currentTab === 'pricing' ? '#10b981' : 'var(--text-main)',
                  border: 'none',
                  fontSize: '0.76rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <CreditCard size={13} />
                <span>Tarifs & Abonnements</span>
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* 3. Right: Dual-DB Sync, Cashier & Utilities */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
        {/* Network & Offline Status Badge */}
        <div 
          onClick={onOpenDatabaseModal || (unsyncedOrdersCount > 0 ? onTriggerSync : undefined)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 9px',
            borderRadius: '6px',
            fontSize: '0.68rem',
            fontWeight: 700,
            cursor: 'pointer',
            background: isBackendConnected 
              ? (unsyncedOrdersCount > 0 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.12)') 
              : 'rgba(245, 158, 11, 0.2)',
            color: isBackendConnected 
              ? (unsyncedOrdersCount > 0 ? 'var(--accent-amber)' : 'var(--accent-emerald)') 
              : 'var(--accent-amber)',
            border: `1px solid ${isBackendConnected ? (unsyncedOrdersCount > 0 ? 'rgba(245, 158, 11, 0.4)' : 'rgba(16, 185, 129, 0.3)') : 'rgba(245, 158, 11, 0.4)'}`,
            transition: 'all 0.2s'
          }}
          title="Architecture Double Base : Cliquez pour inspecter PostgreSQL Cloud & IndexedDB Hors-Ligne"
        >
          <Server size={11} />
          <span>{isBackendConnected ? 'Cloud Neon' : 'IndexedDB'}</span>
          {unsyncedOrdersCount > 0 && (
            <span style={{
              background: '#f59e0b',
              color: '#000',
              padding: '1px 5px',
              borderRadius: '999px',
              fontSize: '0.6rem',
              fontWeight: 900
            }}>
              {unsyncedOrdersCount} 🔄
            </span>
          )}
        </div>

        {/* Cashier Badge */}
        <button
          onClick={() => setIsPinModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 9px',
            borderRadius: '6px',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-main)',
            fontSize: '0.72rem',
            fontWeight: 700,
            cursor: 'pointer'
          }}
          title="Changer de caissier via code PIN"
        >
          <User size={12} color="var(--accent-primary)" />
          <span>{currentCashier.name}</span>
          <KeyRound size={11} color="var(--text-dim)" />
        </button>

        {/* Portail Vitrine Button */}
        <button
          onClick={() => setCurrentTab('landing')}
          className="btn-secondary"
          style={{
            padding: '4px 8px',
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            borderRadius: '6px'
          }}
          title="Voir la page d'accueil vitrine"
        >
          <Home size={12} />
          <span>{t('nav.home')}</span>
        </button>

        <button
          onClick={toggleLanguage}
          className="btn-secondary"
          style={{
            padding: '4px 8px',
            fontSize: '0.72rem',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            borderRadius: '6px'
          }}
          title="Changer la langue / Change Language"
        >
          <Globe size={12} />
          <span>{i18n.language === 'fr' ? 'العربية' : 'Français'}</span>
        </button>

        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-main)',
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Changer le thème"
        >
          {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
        </button>
      </div>

      {/* Cashier PIN Modal */}
      {isPinModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-glass)',
            width: '100%',
            maxWidth: '320px',
            padding: '20px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
            textAlign: 'center'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ fontWeight: 800, fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <KeyRound size={18} color="var(--accent-primary)" />
                Changement de Caissier
              </div>
              <button
                onClick={() => {
                  setIsPinModalOpen(false);
                  setPinCode('');
                  setPinError(null);
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Tapez votre code PIN à 4 chiffres.
            </p>

            {/* PIN Dots */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
              {[0, 1, 2, 3].map(idx => (
                <div
                  key={idx}
                  style={{
                    width: '14px',
                    height: '14px',
                    borderRadius: '50%',
                    background: pinCode.length > idx ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                    boxShadow: pinCode.length > idx ? '0 0 6px rgba(5, 150, 105, 0.5)' : 'none',
                    transition: 'all 0.15s ease'
                  }}
                />
              ))}
            </div>

            {pinError && (
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-rose)', marginBottom: '10px', fontWeight: 600 }}>
                {pinError}
              </div>
            )}

            {/* Keypad */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '14px' }}>
              {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', '⌫'].map(btn => (
                <button
                  key={btn}
                  onClick={() => {
                    if (btn === 'C') {
                      setPinCode('');
                    } else if (btn === '⌫') {
                      setPinCode(prev => prev.slice(0, -1));
                    } else {
                      handleAppendPin(btn);
                    }
                  }}
                  className="btn-secondary"
                  style={{
                    padding: '12px',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  {btn}
                </button>
              ))}
            </div>

            {/* Presets */}
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>Comptes Démo :</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <button
                  onClick={() => {
                    if (onCashierChanged) onCashierChanged({ name: 'Sidi Mohamed', role: 'Patron' });
                    setIsPinModalOpen(false);
                    setPinCode('');
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.7rem', padding: '6px' }}
                >
                  🔑 1234 (Patron)
                </button>
                <button
                  onClick={() => {
                    if (onCashierChanged) onCashierChanged({ name: 'Ely', role: 'Caissier' });
                    setIsPinModalOpen(false);
                    setPinCode('');
                  }}
                  className="btn-secondary"
                  style={{ fontSize: '0.7rem', padding: '6px' }}
                >
                  🔑 0000 (Caissier)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Establishment & Account Profile Modal */}
      {isAccountModalOpen && account && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '460px',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #006233, #16a34a)',
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <UtensilsCrossed size={18} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0 }}>
                    {account.businessName}
                  </h3>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    {account.restaurantType || 'Restauration'} • {account.city}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAccountModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Trial Banner */}
            <div style={{
              background: 'rgba(5, 150, 105, 0.1)',
              border: '1px solid rgba(5, 150, 105, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#22c55e' }}>
                  🎉 Essai Gratuit Pro 14 Jours Actif
                </span>
                <span style={{ fontSize: '0.72rem', background: '#22c55e', color: '#000', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                  {account.trialDaysRemaining || 14} jours restants
                </span>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>
                Accès complet aux modules Plan de Tables, Écran Cuisine KDS, Ventes, Stocks et encaissements Bankily & Masrvi.
              </p>
            </div>

            {/* Establishment Details Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              fontSize: '0.78rem',
              marginBottom: '16px'
            }}>
              <div style={{ padding: '8px 10px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>GÉRANT / RESPONSABLE</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>{account.ownerName}</div>
              </div>
              <div style={{ padding: '8px 10px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>TÉLÉPHONE</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>{account.phone}</div>
              </div>
              <div style={{ padding: '8px 10px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>PLAN DE SALLE</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>{account.tableCount || 10} Tables actives</div>
              </div>
              <div style={{ padding: '8px 10px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)' }}>FISCALITÉ</div>
                <div style={{ fontWeight: 700, marginTop: '2px' }}>NIF & TVA 16% Conforme</div>
              </div>
            </div>

            {/* Enterprise Points of Sale (Succursales & Cloisonnement) */}
            <div style={{
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-glass)',
              borderRadius: '10px',
              padding: '12px',
              marginBottom: '16px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Store size={13} color="#10b981" />
                  <span>Points de Vente ({pointsDeVente.length || 1})</span>
                </span>
                <span style={{ fontSize: '0.62rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <ShieldCheck size={11} />
                  <span>Cloisonnement Garanti</span>
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
                {pointsDeVente.map(pdv => (
                  <div key={pdv.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    background: pdv.id === activePointDeVente?.id ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: pdv.id === activePointDeVente?.id ? '1px solid #10b981' : '1px solid var(--border-glass)'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: pdv.id === activePointDeVente?.id ? '#10b981' : 'var(--text-main)' }}>
                        {pdv.name}
                      </div>
                      <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)' }}>
                        📍 {pdv.address} • {pdv.code} ({pdv.caisseCount || 1} caisse)
                      </div>
                    </div>
                    {pdv.id === activePointDeVente?.id ? (
                      <span style={{ fontSize: '0.6rem', color: '#10b981', fontWeight: 800, background: 'rgba(16, 185, 129, 0.2)', padding: '2px 6px', borderRadius: '4px' }}>
                        ● Actif
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          if (onSwitchPointDeVente) onSwitchPointDeVente(pdv.id);
                          setIsAccountModalOpen(false);
                        }}
                        style={{
                          background: 'none',
                          border: '1px solid var(--border-glass)',
                          color: 'var(--text-main)',
                          padding: '2px 7px',
                          borderRadius: '4px',
                          fontSize: '0.65rem',
                          cursor: 'pointer',
                          fontWeight: 700
                        }}
                      >
                        Activer
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  setIsAccountModalOpen(false);
                  setIsAddPdvModalOpen(true);
                }}
                style={{
                  width: '100%',
                  marginTop: '8px',
                  padding: '6px',
                  borderRadius: '6px',
                  background: 'none',
                  border: '1px dashed #10b981',
                  color: '#10b981',
                  fontSize: '0.68rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '4px'
                }}
              >
                <Plus size={12} />
                <span>+ Nouvelle Succursale / Point de Vente</span>
              </button>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => {
                  setIsAccountModalOpen(false);
                  setCurrentTab('pricing');
                }}
                className="btn-primary"
                style={{ padding: '10px', fontSize: '0.82rem', fontWeight: 800 }}
              >
                Prolonger l'Abonnement (Bankily / Masrvi) ➔
              </button>

              <button
                onClick={() => {
                  setIsAccountModalOpen(false);
                  setIsPinModalOpen(true);
                }}
                className="btn-secondary"
                style={{ padding: '8px', fontSize: '0.8rem', fontWeight: 700 }}
              >
                <KeyRound size={14} />
                <span>Changer d'Opérateur / Code PIN</span>
              </button>

              <button
                onClick={() => {
                  setIsAccountModalOpen(false);
                  if (onLogout) onLogout();
                }}
                className="btn-secondary"
                style={{
                  padding: '8px',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  color: 'var(--accent-rose)',
                  borderColor: 'rgba(239, 68, 68, 0.3)'
                }}
              >
                Se Déconnecter / Changer d'Établissement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Point of Sale Modal */}
      {isAddPdvModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '440px',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{
                  background: 'linear-gradient(135deg, #006233, #16a34a)',
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Store size={18} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 900, margin: 0, color: 'var(--text-main)' }}>
                    Nouveau Point de Vente
                  </h3>
                  <span style={{ fontSize: '0.68rem', color: '#10b981', fontWeight: 700 }}>
                    🔒 Caisse et stock totalement isolés
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsAddPdvModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              if (onAddPointDeVente && newPdvName.trim()) {
                onAddPointDeVente({
                  name: newPdvName.trim(),
                  nameAr: newPdvName.trim(),
                  sector: newPdvSector,
                  code: `PDV-0${pointsDeVente.length + 1}`,
                  address: newPdvAddress.trim() || 'Nouakchott',
                  city: 'Nouakchott',
                  caisseCount: Number(newPdvCaisses) || 1,
                  isDefault: false
                });
                setIsAddPdvModalOpen(false);
                setNewPdvName('');
              }
            }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '5px' }}>
                    Nom de la Succursale / Boutique *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Supérette Ksar N°2, Hannout Sebkha..."
                    value={newPdvName}
                    onChange={(e) => setNewPdvName(e.target.value)}
                    className="input-field"
                    style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '5px' }}>
                    Secteur d'activité *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {[
                      { key: 'market', label: 'Boutique & Hannout', icon: ShoppingBag, color: '#059669' },
                      { key: 'restaurant', label: 'Restaurant & Café', icon: UtensilsCrossed, color: '#ea580c' },
                      { key: 'butcher', label: 'Boucherie / Poids', icon: Scale, color: '#d97706' },
                      { key: 'cosmetics', label: 'Cosmétique & Beauté', icon: Sparkles, color: '#0284c7' }
                    ].map(s => {
                      const Icon = s.icon;
                      const isSel = newPdvSector === s.key;
                      return (
                        <div
                          key={s.key}
                          onClick={() => setNewPdvSector(s.key as SectorType)}
                          style={{
                            padding: '8px 10px',
                            borderRadius: '8px',
                            background: isSel ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-tertiary)',
                            border: isSel ? `1px solid ${s.color}` : '1px solid var(--border-glass)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Icon size={14} color={s.color} />
                          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isSel ? 'var(--text-main)' : 'var(--text-muted)' }}>
                            {s.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '5px' }}>
                      Quartier / Adresse
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Marché Ksar, Tevragh-Zeina..."
                      value={newPdvAddress}
                      onChange={(e) => setNewPdvAddress(e.target.value)}
                      className="input-field"
                      style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '5px' }}>
                      Nbre Caisses
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={newPdvCaisses}
                      onChange={(e) => setNewPdvCaisses(Number(e.target.value))}
                      className="input-field"
                      style={{ width: '100%', padding: '9px 12px', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddPdvModalOpen(false)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '10px', fontSize: '0.8rem', fontWeight: 700 }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ flex: 2, padding: '10px', fontSize: '0.82rem', fontWeight: 800 }}
                >
                  Créer et Activer la Caisse ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
