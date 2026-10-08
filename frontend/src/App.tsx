import React, { useState, useEffect } from 'react';
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
import { INITIAL_PRODUCTS } from './data/mockData';
import type { Product, Table, SectorType } from './data/mockData';
import { AuthModal } from './components/AuthModal';
import type { UserAccount } from './components/AuthModal';
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notification, setNotification] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean>(false);
  const [unsyncedOrdersCount, setUnsyncedOrdersCount] = useState<number>(0);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  const [currentCashier, setCurrentCashier] = useState<{ name: string; role: string }>({
    name: 'Sidi Mohamed',
    role: 'Patron'
  });

  // Gestion du Compte Restaurant & Authentification
  const [account, setAccount] = useState<UserAccount | null>(() => {
    try {
      const saved = localStorage.getItem('caissa_account');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'register' | 'login'>('register');
  const [authModalSector, setAuthModalSector] = useState<SectorType>('restaurant');
  const [isDatabaseModalOpen, setIsDatabaseModalOpen] = useState<boolean>(false);
  const [isSimulatingOffline, setIsSimulatingOffline] = useState<boolean>(false);

  // Si un compte restaurant est déjà enregistré, aligner le secteur
  useEffect(() => {
    if (account?.sector) {
      setSector(account.sector);
    }
    if (account?.ownerName) {
      setCurrentCashier({ name: account.ownerName, role: 'Patron' });
    }
  }, [account]);

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

  const handleAccountSuccess = (newAccount: UserAccount) => {
    setAccount(newAccount);
    setSector(newAccount.sector);
    setCurrentCashier({ name: newAccount.ownerName, role: 'Patron' });
    showToast(`Bienvenue dans votre restaurant : ${newAccount.businessName} (Essai 14j activé)`);
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
              />
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default App;
