import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PosScreen } from './components/PosScreen';
import type { CartItem } from './components/PosScreen';
import { TablesScreen } from './components/TablesScreen';
import { KdsScreen } from './components/KdsScreen';
import { KridiScreen } from './components/KridiScreen';
import { PricingScreen } from './components/PricingScreen';
import { VentesScreen } from './components/VentesScreen';
import { StockScreen } from './components/StockScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { AiHubScreen } from './components/AiHubScreen';
import { GestionScreen } from './components/GestionScreen';
import { ComptabiliteScreen } from './components/ComptabiliteScreen';
import { INITIAL_PRODUCTS } from './data/mockData';
import type { Product, Table, SectorType } from './data/mockData';
import { AuthModal } from './components/AuthModal';
import type { UserAccount, PointDeVente } from './components/AuthModal';
import { DatabaseDualEngineModal } from './components/DatabaseDualEngineModal';
import { checkBackendStatus, getProductsApi, checkoutOrderApi } from './services/api';

import { 
  cacheProductsLocally, 
  getOfflineProducts, 
  saveOrderLocally, 
  getUnsyncedOrdersCount, 
  syncOfflineOrdersToCloud 
} from './services/offlineDb';

export const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [sector, setSector] = useState<SectorType>('restaurant');
  const [theme, setTheme] = useState<'dark' | 'light'>('light');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);

  // Gestion du Compte Établissement & Authentification avec Multi-Points de Vente
  const [account, setAccount] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('caissa_account');
      if (!saved) return null;
      const parsed: UserAccount = JSON.parse(saved);
      // Auto-migration si le compte existant n'a pas encore les 4 points de vente métiers distincts
      if (!parsed.pointsDeVente || parsed.pointsDeVente.length < 4 || (parsed.pointsDeVente[0].sector === parsed.pointsDeVente[1]?.sector)) {
        const baseName = parsed.businessName || 'Groupe Commercial Al-Baraka';
        const defaultPdvs: PointDeVente[] = [
          {
            id: 'pdv-1',
            name: `${baseName} (Boutique & Hanout Al-Baraka)`,
            nameAr: `${baseName} (بقالة وهانوت البركة)`,
            sector: 'market',
            code: 'PDV-01',
            address: 'Avenue Moktar Ould Daddah, Tevragh-Zeina',
            city: 'Nouakchott',
            phone: parsed.phone || '+222 22 14 55 88',
            caisseCount: 2,
            isDefault: true
          },
          {
            id: 'pdv-2',
            name: `${baseName} (Restaurant & Chwaya El-Ksar)`,
            nameAr: `${baseName} (مطعم ومشاوي القصر)`,
            sector: 'restaurant',
            code: 'PDV-02',
            address: 'Carrefour Ksar, Nouakchott',
            city: 'Nouakchott',
            phone: parsed.phone || '+222 22 14 55 88',
            caisseCount: 2,
            isDefault: false
          },
          {
            id: 'pdv-3',
            name: `${baseName} (Boucherie & Poissonnerie Capitale)`,
            nameAr: `${baseName} (جزارة ومسمكة العاصمة)`,
            sector: 'butcher',
            code: 'PDV-03',
            address: 'Marché Capitale, Nouakchott',
            city: 'Nouakchott',
            phone: parsed.phone || '+222 22 14 55 88',
            caisseCount: 1,
            isDefault: false
          },
          {
            id: 'pdv-4',
            name: `${baseName} (Parapharmacie & Cosmétique Rim)`,
            nameAr: `${baseName} (صيدلية ومستحضرات التجميل)`,
            sector: 'cosmetics',
            code: 'PDV-04',
            address: 'Centre Commercial Ilot C, Tevragh-Zeina',
            city: 'Nouakchott',
            phone: parsed.phone || '+222 22 14 55 88',
            caisseCount: 1,
            isDefault: false
          }
        ];
        parsed.pointsDeVente = defaultPdvs;
        if (!parsed.activePointDeVenteId || !defaultPdvs.some(p => p.id === parsed.activePointDeVenteId)) {
          parsed.activePointDeVenteId = 'pdv-1';
        }
        try { localStorage.setItem('caissa_account', JSON.stringify(parsed)); } catch {}
      }
      return parsed;
    } catch {
      return null;
    }
  });

  // Point de Vente actif calculé
  const activePointDeVente = useMemo<PointDeVente | null>(() => {
    if (!account || !account.pointsDeVente || account.pointsDeVente.length === 0) return null;
    return account.pointsDeVente.find(p => p.id === account.activePointDeVenteId) || account.pointsDeVente[0];
  }, [account]);

  // Gestion multi-paniers STRICTEMENT CLOISONNÉS par Point de Vente
  const [cartsByPdv, setCartsByPdv] = useState<Record<string, CartItem[]>>(() => {
    try {
      const saved = localStorage.getItem('caissa_carts_by_pdv');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const activePdvKey = activePointDeVente?.id || 'pdv-default';
  const cart = useMemo(() => cartsByPdv[activePdvKey] || [], [cartsByPdv, activePdvKey]);

  const setCart: React.Dispatch<React.SetStateAction<CartItem[]>> = (action) => {
    setCartsByPdv(prev => {
      const currentList = prev[activePdvKey] || [];
      const updatedList = typeof action === 'function' ? action(currentList) : action;
      const next = { ...prev, [activePdvKey]: updatedList };
      try {
        localStorage.setItem('caissa_carts_by_pdv', JSON.stringify(next));
      } catch (e) {
        console.warn(e);
      }
      return next;
    });
  };

  const [notification, setNotification] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [unsyncedOrdersCount, setUnsyncedOrdersCount] = useState<number>(0);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [currentCashier, setCurrentCashier] = useState<{ name: string; role: string }>({
    name: 'Sidi Mohamed',
    role: 'Patron'
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'register' | 'login'>('register');
  const [authModalSector, setAuthModalSector] = useState<SectorType>('restaurant');
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState<boolean>(false);
  const [isSimulatingOffline, setIsSimulatingOffline] = useState<boolean>(false);

  // Aligner le secteur sur le Point de Vente actif si un compte est connecté
  useEffect(() => {
    if (activePointDeVente?.sector) {
      setSector(activePointDeVente.sector);
    } else if (account?.sector) {
      setSector(account.sector);
    }
    if (account?.ownerName) {
      setCurrentCashier({ name: account.ownerName, role: 'Patron' });
    }
  }, [activePointDeVente, account]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Déclencheur manuel ou automatique de synchronisation
  const handleTriggerSync = async () => {
    const isOnline = await checkBackendStatus();
    setIsBackendConnected(isOnline);

    if (isOnline) {
      const res = await syncOfflineOrdersToCloud();
      if (res.syncedCount > 0) {
        showToast(`☁️ ${res.syncedCount} ticket(s) hors-ligne synchronisé(s) avec PostgreSQL Cloud !`);
      }
      const count = await getUnsyncedOrdersCount();
      setUnsyncedOrdersCount(count);
    }
  };

  // Synchronisation avec l'API Backend et mise en cache IndexedDB au démarrage
  useEffect(() => {
    const syncBackend = async () => {
      const isOnline = await checkBackendStatus();
      setIsBackendConnected(isOnline);

      if (isOnline) {
        try {
          const apiProducts = await getProductsApi();
          if (apiProducts && apiProducts.length > 0) {
            setProducts(apiProducts);
            await cacheProductsLocally(apiProducts);
          }
        } catch (e) {
          console.warn("Utilisation du catalogue local suite à l'erreur:", e);
        }
      } else {
        // En cas de démarrage hors-ligne, charger le cache IndexedDB
        const offlineProducts = await getOfflineProducts();
        if (offlineProducts && offlineProducts.length > 0) {
          setProducts(offlineProducts);
        } else {
          await cacheProductsLocally(INITIAL_PRODUCTS);
        }
      }

      // Vérifier les commandes en attente de synchronisation
      const count = await getUnsyncedOrdersCount();
      setUnsyncedOrdersCount(count);

      // Si en ligne et des commandes attendent, synchroniser immédiatement
      if (isOnline && count > 0) {
        handleTriggerSync();
      }
    };

    syncBackend();

    // Écouteurs de changement de réseau (Online / Offline natif)
    const handleOnline = () => handleTriggerSync();
    const handleOffline = () => setIsBackendConnected(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérification périodique toutes les 30 secondes
    const interval = setInterval(() => {
      handleTriggerSync();
    }, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  const showToast = (message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 3500);
  };

  const handleOrderSuccess = async (orderData: any) => {
    showToast(`Commande ${orderData.orderId} validée (${orderData.total.toFixed(0)} MRU) !`);

    // 1. Sauvegarde locale systématique dans IndexedDB (Garantie zéro perte)
    await saveOrderLocally(orderData, isBackendConnected);

    // 2. Synchronisation en direct avec le backend PostgreSQL si en ligne
    if (isBackendConnected) {
      try {
        await checkoutOrderApi({
          items: orderData.items.map((it: CartItem) => ({
            productId: it.product.id,
            quantity: it.quantity,
            weightInKg: it.weightInKg,
            notes: it.notes
          })),
          paymentMethod: orderData.paymentMethod,
          cashGiven: orderData.cashGiven,
          discountPercent: orderData.discountPercent,
          tableNumber: orderData.tableNumber,
          orderType: orderData.orderType,
          deliveryAddress: orderData.deliveryAddress,
          deliveryPhone: orderData.deliveryPhone,
          deliveryFee: orderData.deliveryFee,
          splitCount: orderData.splitCount,
          kridiCustomerId: orderData.kridiCustomerId
        });
      } catch (err) {
        console.warn('Erreur lors de la synchronisation de commande avec le backend :', err);
        showToast("⚠️ Connexion interrompue : commande enregistrée hors-ligne.");
      }
    } else {
      showToast("📦 Mode Hors-Ligne : commande conservée localement.");
    }

    const count = await getUnsyncedOrdersCount();
    setUnsyncedOrdersCount(count);
  };

  const handleSelectTable = (table: Table) => {
    setSelectedTable(table.name);
    setCurrentTab('pos');
    showToast(`Prise de commande assignée à la ${table.name}`);
  };

  const handleClearTable = () => {
    setSelectedTable(null);
    showToast(`Table désélectionnée`);
  };

  const handleOpenAuthModal = (mode: 'register' | 'login' = 'register', preSector: SectorType = 'restaurant') => {
    setAuthModalMode(mode);
    setAuthModalSector(preSector);
    setIsAuthModalOpen(true);
  };

  // Protection stricte de l'accès logiciel : vérifie la connexion avant d'accéder aux écrans caisse
  const handleProtectedNavigate = (tab?: string) => {
    if (!account) {
      showToast("🔒 Connexion requise : Veuillez vous identifier pour accéder au logiciel.");
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }
    setCurrentTab(tab || 'pos');
  };

  // Sécurité renforcée : si aucun compte connecté et écran interne actif, renvoyer vers la vitrine et demander la connexion
  useEffect(() => {
    if (!account && currentTab !== 'landing') {
      setCurrentTab('landing');
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      showToast("🔒 Accès protégé : Veuillez vous connecter pour accéder au logiciel.");
    }
  }, [account, currentTab]);

  const handleSwitchPointDeVente = (pdvId: string) => {
    if (!account || !account.pointsDeVente) return;
    const targetPdv = account.pointsDeVente.find(p => p.id === pdvId);
    if (!targetPdv) return;

    const updatedAccount: UserAccount = {
      ...account,
      activePointDeVenteId: pdvId
    };
    setAccount(updatedAccount);
    setSector(targetPdv.sector);
    try {
      localStorage.setItem('caissa_account', JSON.stringify(updatedAccount));
    } catch (e) {
      console.warn(e);
    }
    showToast(`🏪 Point de Vente actif : ${targetPdv.name} (${targetPdv.code}). Caisse et données 100% isolées.`);
  };

  const handleAddPointDeVente = (newPdvData: Omit<PointDeVente, 'id'>) => {
    if (!account) return;
    const newId = `pdv-${Date.now()}`;
    const newPdv: PointDeVente = {
      ...newPdvData,
      id: newId
    };
    const existing = account.pointsDeVente || [];
    const updatedList = [...existing, newPdv];
    const updatedAccount: UserAccount = {
      ...account,
      pointsDeVente: updatedList,
      activePointDeVenteId: newId
    };
    setAccount(updatedAccount);
    setSector(newPdv.sector);
    try {
      localStorage.setItem('caissa_account', JSON.stringify(updatedAccount));
    } catch (e) {
      console.warn(e);
    }
    showToast(`✨ Nouveau Point de Vente activé : ${newPdv.name} (${newPdv.code}) !`);
  };

  const handleAccountSuccess = (newAccount: UserAccount) => {
    setAccount(newAccount);
    const activePdv = newAccount.pointsDeVente?.find(p => p.id === newAccount.activePointDeVenteId) || newAccount.pointsDeVente?.[0];
    if (activePdv) {
      setSector(activePdv.sector);
    } else {
      setSector(newAccount.sector);
    }
    setCurrentCashier({ name: newAccount.ownerName, role: 'Patron' });
    showToast(`Bienvenue dans votre établissement : ${newAccount.businessName} (Essai 14j activé)`);
    setCurrentTab('pos');
  };

  const handleLogout = () => {
    localStorage.removeItem('caissa_account');
    setAccount(null);
    showToast('Session déconnectée.');
    setCurrentTab('landing');
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Toast Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          zIndex: 1000,
          background: '#059669',
          color: '#ffffff',
          padding: '10px 18px',
          borderRadius: 'var(--radius-md)',
          fontWeight: 700,
          fontSize: '0.85rem',
          boxShadow: '0 4px 14px rgba(5, 150, 105, 0.35)',
          animation: 'fadeIn 0.25s ease'
        }}>
          {notification}
        </div>
      )}

      {/* Auth & Restaurant Account Onboarding Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialMode={authModalMode}
        initialSector={authModalSector}
        onAccountSuccess={handleAccountSuccess}
      />

      {/* Database Dual-Engine Inspector & Controls Modal */}
      <DatabaseDualEngineModal
        isOpen={isDatabaseModalOpen}
        onClose={() => setIsDatabaseModalOpen(false)}
        isBackendConnected={isBackendConnected && !isSimulatingOffline}
        isSimulatingOffline={isSimulatingOffline}
        onToggleSimulateOffline={(offline) => {
          setIsSimulatingOffline(offline);
          if (offline) {
            setIsBackendConnected(false);
            showToast('⚠️ Simulation active : Connexion Internet coupée (Mode Hors-Ligne 100% IndexedDB)');
          } else {
            checkBackendStatus().then(online => {
              setIsBackendConnected(online);
              showToast(online ? '🟢 Connexion rétablie : Reconnecté à Neon PostgreSQL !' : 'Serveur inaccessible');
            });
          }
        }}
        onSyncCompleted={async () => {
          const count = await getUnsyncedOrdersCount();
          setUnsyncedOrdersCount(count);
          showToast('✅ Synchronisation de la base IndexedDB vers Neon terminée !');
        }}
      />

      {/* If Landing Page mode, or user is not logged in, render Landing Page Portal */}
      {currentTab === 'landing' || !account ? (
        <LandingPage
          onEnterApp={handleProtectedNavigate}
          sector={sector}
          setSector={setSector}
          theme={theme}
          setTheme={setTheme}
          account={account}
          onOpenAuthModal={handleOpenAuthModal}
          onLogout={handleLogout}
        />
      ) : (
        <>
          {/* Main Top Navigation for SaaS Application */}
          <Navbar
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            sector={sector}
            setSector={(s) => {
              setSector(s);
              if (s !== 'restaurant' && (currentTab === 'tables' || currentTab === 'kds')) {
                setCurrentTab('pos');
              }
            }}
            theme={theme}
            setTheme={setTheme}
            cartCount={totalCartCount}
            isBackendConnected={isBackendConnected}
            currentCashier={currentCashier}
            onCashierChanged={(user) => {
              setCurrentCashier(user);
              showToast(`Opérateur de caisse actif : ${user.name} (${user.role})`);
            }}
            account={account}
            activePointDeVente={activePointDeVente}
            pointsDeVente={account?.pointsDeVente || []}
            onSwitchPointDeVente={handleSwitchPointDeVente}
            onAddPointDeVente={handleAddPointDeVente}
            cartsByPdv={cartsByPdv}
            onLogout={handleLogout}
            onOpenAuthModal={() => handleOpenAuthModal('login')}
            unsyncedOrdersCount={unsyncedOrdersCount}
            onTriggerSync={handleTriggerSync}
            onOpenDatabaseModal={() => setIsDatabaseModalOpen(true)}
          />

          {/* Main SaaS Workspace Content */}
          <main style={{ flex: 1 }}>
            {currentTab === 'pos' && (
              <PosScreen
                products={products}
                sector={sector}
                cart={cart}
                setCart={setCart}
                onOrderSuccess={handleOrderSuccess}
                selectedTable={selectedTable}
                onClearTable={handleClearTable}
                account={account}
                activePointDeVente={activePointDeVente}
              />
            )}

            {currentTab === 'ventes' && (
              <VentesScreen />
            )}

            {currentTab === 'stock' && (
              <StockScreen 
                sector={sector}
                onProductsUpdated={(updated) => setProducts(updated)}
              />
            )}

            {currentTab === 'dashboard' && (
              <DashboardScreen />
            )}

            {currentTab === 'tables' && sector === 'restaurant' && (
              <TablesScreen onSelectTable={handleSelectTable} />
            )}

            {currentTab === 'kds' && sector === 'restaurant' && (
              <KdsScreen />
            )}

            {currentTab === 'kridi' && (
              <KridiScreen />
            )}

            {currentTab === 'ai' && (
              <AiHubScreen 
                onAddVoiceOrderToCart={(items) => {
                  for (const it of items) {
                    const matched = products.find(p => p.name.toLowerCase().includes(it.productName.toLowerCase()));
                    if (matched) {
                      setCart(prev => [...prev, { product: matched, quantity: it.qty }]);
                    }
                  }
                  setCurrentTab('pos');
                  showToast('🎙️ Commande vocale IA ajoutée au panier de caisse !');
                }}
                onStockUpdatedFromOcr={(count) => {
                  showToast(`📄 Facture scannée par IA : ${count} articles mis à jour en stock !`);
                }}
              />
            )}

            {currentTab === 'pricing' && (
              <PricingScreen />
            )}

            {currentTab === 'gestion' && (
              <GestionScreen
                sector={sector}
                onProductsUpdated={(updated) => setProducts(updated)}
                initialProducts={products}
                account={account}
                activePointDeVente={activePointDeVente}
                pointsDeVente={account?.pointsDeVente || []}
                onAddPointDeVente={handleAddPointDeVente}
              />
            )}

            {currentTab === 'compta' && (
              <ComptabiliteScreen 
                sector={sector} 
                account={account}
                activePointDeVente={activePointDeVente}
                pointsDeVente={account?.pointsDeVente || []}
              />
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default App;
