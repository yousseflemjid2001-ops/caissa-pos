import React, { useState } from 'react';
import {
  Users, Package, Settings, Plus, Trash2, Edit3,
  Save, X, LayoutGrid, Building2, ShieldCheck,
  Eye, EyeOff, Search, CheckCircle2,
  UtensilsCrossed, ShoppingBag, Store
} from 'lucide-react';
import type { Product, SectorType } from '../data/mockData';
import { INITIAL_PRODUCTS } from '../data/mockData';
import type { PointDeVente, UserAccount } from './AuthModal';

interface TableItem {
  id: number;
  name: string;
  zone: string;
  seats: number;
  status: 'libre' | 'occupee' | 'reservee';
}

interface CaisseRayonItem {
  id: string;
  name: string;
  type: 'caisse' | 'rayon';
  location: string;
  status: 'active' | 'fermee' | 'maintenance';
  operatorName?: string;
}

interface CashierItem {
  id: string;
  name: string;
  role: 'OWNER' | 'MANAGER' | 'CASHIER' | 'WAITER';
  pin: string;
  phone: string;
  active: boolean;
}

const DEFAULT_TABLES: TableItem[] = [
  { id: 1, name: 'Table 1', zone: 'Salle Principale', seats: 4, status: 'libre' },
  { id: 2, name: 'Table 2', zone: 'Salle Principale', seats: 4, status: 'libre' },
  { id: 3, name: 'Table 3', zone: 'Salle Principale', seats: 6, status: 'libre' },
  { id: 4, name: 'Table 4', zone: 'Salle Principale', seats: 2, status: 'libre' },
  { id: 5, name: 'Table 5 (Terrasse)', zone: 'Terrasse Extérieure', seats: 4, status: 'libre' },
  { id: 6, name: 'Table 6 (Terrasse)', zone: 'Terrasse Extérieure', seats: 4, status: 'libre' },
  { id: 7, name: 'Salon VIP 1', zone: 'Salon VIP Privé', seats: 8, status: 'libre' },
  { id: 8, name: 'Salon VIP 2', zone: 'Salon VIP Privé', seats: 10, status: 'libre' },
];

const DEFAULT_CAISSES_RAYONS: CaisseRayonItem[] = [
  { id: 'cr-1', name: 'Caisse N°1 (Comptoir Principal)', type: 'caisse', location: 'Entrée Principale', status: 'active', operatorName: 'Sidi Mohamed' },
  { id: 'cr-2', name: 'Caisse N°2 (Sortie Rapide)', type: 'caisse', location: 'Allée Centrale', status: 'active', operatorName: 'Aminata Ba' },
  { id: 'cr-3', name: 'Caisse N°3 (Pesée Balance & Vrac)', type: 'caisse', location: 'Espace Boucherie / Fruits', status: 'active', operatorName: 'Mohamed Lemine' },
  { id: 'cr-4', name: 'Rayon Alimentation Générale & Épicerie', type: 'rayon', location: 'Allée A1 - A3', status: 'active' },
  { id: 'cr-5', name: 'Rayon Boissons Fraîches & Laitiers', type: 'rayon', location: 'Mural Réfrigéré', status: 'active' },
  { id: 'cr-6', name: 'Rayon Boucherie & Surgelés', type: 'rayon', location: 'Comptoir Froid', status: 'active' },
  { id: 'cr-7', name: 'Rayon Tabacs & Confiserie Caisse', type: 'rayon', location: 'Tête de Caisse', status: 'active' },
  { id: 'cr-8', name: 'Rayon Hygiène, Beauté & Entretien', type: 'rayon', location: 'Allée B1 - B2', status: 'active' },
];

const DEFAULT_CASHIERS: CashierItem[] = [
  { id: 'c-1', name: 'Sidi Mohamed', role: 'OWNER', pin: '1234', phone: '+222 22 14 55 88', active: true },
  { id: 'c-2', name: 'Aminata Ba', role: 'MANAGER', pin: '5678', phone: '+222 36 78 91 23', active: true },
  { id: 'c-3', name: 'Mohamed Lemine', role: 'CASHIER', pin: '9012', phone: '+222 44 22 11 33', active: true },
  { id: 'c-4', name: 'Oumar Diallo', role: 'WAITER', pin: '3456', phone: '+222 26 99 88 77', active: true },
];

const ROLE_INFO: Record<string, { label: string; color: string; bg: string }> = {
  OWNER: { label: 'Propriétaire / Patron', color: '#ea580c', bg: 'rgba(234, 88, 12, 0.12)' },
  MANAGER: { label: 'Gérant / Manager', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.12)' },
  CASHIER: { label: 'Caissier(e)', color: '#059669', bg: 'rgba(5, 150, 105, 0.12)' },
  WAITER: { label: 'Vendeur / Serveur', color: '#0284c7', bg: 'rgba(2, 132, 199, 0.12)' },
};

const RESTO_ZONES = ['Salle Principale', 'Terrasse Extérieure', 'Salon VIP Privé', 'Étage & Balcon'];
const STORE_LOCATIONS = ['Entrée Principale', 'Allée Centrale', 'Comptoir Froid', 'Tête de Caisse', 'Réserve Arrière'];

export interface GestionScreenProps {
  sector?: SectorType;
  onProductsUpdated?: (products: Product[]) => void;
  initialProducts?: Product[];
  account?: UserAccount | null;
  activePointDeVente?: PointDeVente | null;
  pointsDeVente?: PointDeVente[];
  onAddPointDeVente?: (newPdv: Omit<PointDeVente, 'id'>) => void;
}

export const GestionScreen: React.FC<GestionScreenProps> = ({
  sector = 'restaurant',
  onProductsUpdated,
  initialProducts,
  account: _account,
  activePointDeVente,
  pointsDeVente = [],
  onAddPointDeVente
}) => {
  // Mode de caisse actif dans le Back-Office (permet de gérer Restaurant, Boutique, Boucherie ou Cosmétiques)
  const [activeSector, setActiveSector] = useState<SectorType>(sector);
  const [activeTab, setActiveTab] = useState<'infrastructure' | 'cashiers' | 'articles' | 'settings' | 'pdv'>('infrastructure');

  // Multi-Points de Vente
  const [showAddPdvModal, setShowAddPdvModal] = useState(false);
  const [newPdvName, setNewPdvName] = useState('');
  const [newPdvNameAr, setNewPdvNameAr] = useState('');
  const [newPdvAddress, setNewPdvAddress] = useState('');
  const [newPdvSector, setNewPdvSector] = useState<SectorType>('market');

  const handleAddPdvSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPdvName.trim()) return;
    if (onAddPointDeVente) {
      onAddPointDeVente({
        name: newPdvName.trim(),
        nameAr: newPdvNameAr.trim() || newPdvName.trim(),
        sector: newPdvSector,
        code: `PDV-${String(pointsDeVente.length + 1).padStart(2, '0')}`,
        address: newPdvAddress.trim() || 'Nouakchott, Mauritanie',
        city: 'Nouakchott',
        phone: '+222 22 14 55 88',
        caisseCount: 1,
        isDefault: false
      });
    }
    setNewPdvName('');
    setNewPdvNameAr('');
    setNewPdvAddress('');
    setShowAddPdvModal(false);
  };

  // 1A. GESTION DES TABLES (Restaurant)
  const [tables, setTables] = useState<TableItem[]>(() => {
    try {
      const saved = localStorage.getItem('caissa_gestion_tables');
      return saved ? JSON.parse(saved) : DEFAULT_TABLES;
    } catch {
      return DEFAULT_TABLES;
    }
  });
  const [editingTableId, setEditingTableId] = useState<number | null>(null);
  const [tableForm, setTableForm] = useState<Partial<TableItem>>({ name: '', zone: 'Salle Principale', seats: 4 });
  const [showAddTableModal, setShowAddTableModal] = useState<boolean>(false);
  const [newTable, setNewTable] = useState<{ name: string; zone: string; seats: number }>({
    name: '',
    zone: 'Salle Principale',
    seats: 4
  });

  // 1B. GESTION DES CAISSES & RAYONS (Boutique, Boucherie, Hanout, Parapharmacie)
  const [caissesRayons, setCaissesRayons] = useState<CaisseRayonItem[]>(() => {
    try {
      const saved = localStorage.getItem('caissa_gestion_caisses_rayons');
      return saved ? JSON.parse(saved) : DEFAULT_CAISSES_RAYONS;
    } catch {
      return DEFAULT_CAISSES_RAYONS;
    }
  });
  const [editingCrId, setEditingCrId] = useState<string | null>(null);
  const [crForm, setCrForm] = useState<Partial<CaisseRayonItem>>({});
  const [showAddCrModal, setShowAddCrModal] = useState<boolean>(false);
  const [newCr, setNewCr] = useState<{ name: string; type: 'caisse' | 'rayon'; location: string }>({
    name: '',
    type: 'caisse',
    location: 'Entrée Principale'
  });

  // 2. GESTION DES CAISSIERS
  const [cashiers, setCashiers] = useState<CashierItem[]>(() => {
    try {
      const saved = localStorage.getItem('caissa_gestion_cashiers');
      return saved ? JSON.parse(saved) : DEFAULT_CASHIERS;
    } catch {
      return DEFAULT_CASHIERS;
    }
  });
  const [showAddCashierModal, setShowAddCashierModal] = useState<boolean>(false);
  const [newCashier, setNewCashier] = useState<{ name: string; role: CashierItem['role']; pin: string; phone: string }>({
    name: '',
    role: 'CASHIER',
    pin: '',
    phone: ''
  });
  const [revealedPins, setRevealedPins] = useState<Record<string, boolean>>({});

  // 3. GESTION DES ARTICLES / PRODUITS
  const allAvailableProducts = initialProducts && initialProducts.length > 0 ? initialProducts : INITIAL_PRODUCTS;
  const [productsList, setProductsList] = useState<Product[]>(allAvailableProducts);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<Partial<Product>>({});
  const [showAddProductModal, setShowAddProductModal] = useState<boolean>(false);
  const [newProduct, setNewProduct] = useState<{
    name: string;
    category: string;
    barcode: string;
    brand: string;
    isWeighted: boolean;
    price: number;
    costPrice: number;
    stock: number;
    image: string;
  }>({
    name: '',
    category: activeSector === 'restaurant' ? 'Plats Traditionnels' : 'Épicerie & Céréales',
    barcode: `2222000${Math.floor(100 + Math.random() * 900)}`,
    brand: '',
    isWeighted: false,
    price: 150,
    costPrice: 80,
    stock: 50,
    image: ''
  });
  const [productSearch, setProductSearch] = useState<string>('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');

  // 4. PARAMÈTRES ÉTABLISSEMENT
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('caissa_gestion_settings');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return {
      businessName: activeSector === 'restaurant' ? 'Restaurant Al-Baraka Tevragh-Zeina' : 'Supermarché & Épicerie Centrale',
      address: 'Avenue Moktar Ould Daddah, Nouakchott, Mauritanie',
      phone: '+222 22 14 55 88',
      nif: '00349812-MN',
      currency: 'MRU',
      taxRate: 18,
      receiptFooter: 'Choukran pour votre visite ! Service Client : +222 22 14 55 88',
      wifiPassword: 'Caissa-Client / AlBaraka2026',
      ticketWidth: '80mm'
    };
  });
  const [settingsSavedToast, setSettingsSavedToast] = useState<boolean>(false);

  // Persistence helpers
  const saveTablesToStorage = (updated: TableItem[]) => {
    setTables(updated);
    try { localStorage.setItem('caissa_gestion_tables', JSON.stringify(updated)); } catch (e) { console.warn(e); }
  };

  const saveCaissesRayonsToStorage = (updated: CaisseRayonItem[]) => {
    setCaissesRayons(updated);
    try { localStorage.setItem('caissa_gestion_caisses_rayons', JSON.stringify(updated)); } catch (e) { console.warn(e); }
  };

  const saveCashiersToStorage = (updated: CashierItem[]) => {
    setCashiers(updated);
    try { localStorage.setItem('caissa_gestion_cashiers', JSON.stringify(updated)); } catch (e) { console.warn(e); }
  };

  // Handlers Tables
  const handleAddTable = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTable.name.trim()) return;
    const nextId = tables.length > 0 ? Math.max(...tables.map(t => t.id)) + 1 : 1;
    const item: TableItem = {
      id: nextId,
      name: newTable.name.trim(),
      zone: newTable.zone,
      seats: Number(newTable.seats) || 4,
      status: 'libre'
    };
    const updated = [...tables, item];
    saveTablesToStorage(updated);
    setShowAddTableModal(false);
    setNewTable({ name: '', zone: 'Salle Principale', seats: 4 });
  };

  const handleSaveEditTable = (id: number) => {
    const updated = tables.map(t => t.id === id ? { ...t, ...tableForm } : t);
    saveTablesToStorage(updated);
    setEditingTableId(null);
  };

  const handleDeleteTable = (id: number) => {
    if (window.confirm('Voulez-vous supprimer cette table ?')) {
      const updated = tables.filter(t => t.id !== id);
      saveTablesToStorage(updated);
    }
  };

  // Handlers Caisses & Rayons
  const handleAddCaisseRayon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCr.name.trim()) return;
    const item: CaisseRayonItem = {
      id: `cr-${Date.now()}`,
      name: newCr.name.trim(),
      type: newCr.type,
      location: newCr.location,
      status: 'active'
    };
    const updated = [...caissesRayons, item];
    saveCaissesRayonsToStorage(updated);
    setShowAddCrModal(false);
    setNewCr({ name: '', type: 'caisse', location: 'Entrée Principale' });
  };

  const handleSaveEditCaisseRayon = (id: string) => {
    const updated = caissesRayons.map(cr => cr.id === id ? { ...cr, ...crForm } : cr);
    saveCaissesRayonsToStorage(updated);
    setEditingCrId(null);
  };

  const handleDeleteCaisseRayon = (id: string) => {
    if (window.confirm('Voulez-vous supprimer cet élément ?')) {
      const updated = caissesRayons.filter(cr => cr.id !== id);
      saveCaissesRayonsToStorage(updated);
    }
  };

  // Handlers Caissiers
  const handleAddCashier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCashier.name.trim() || !newCashier.pin.trim()) return;
    const item: CashierItem = {
      id: `c-${Date.now()}`,
      name: newCashier.name.trim(),
      role: newCashier.role,
      pin: newCashier.pin.trim(),
      phone: newCashier.phone.trim() || '+222 -- -- -- --',
      active: true
    };
    const updated = [...cashiers, item];
    saveCashiersToStorage(updated);
    setShowAddCashierModal(false);
    setNewCashier({ name: '', role: 'CASHIER', pin: '', phone: '' });
  };

  const handleDeleteCashier = (id: string) => {
    if (window.confirm('Voulez-vous supprimer cet utilisateur ?')) {
      const updated = cashiers.filter(c => c.id !== id);
      saveCashiersToStorage(updated);
    }
  };

  const togglePinVisibility = (id: string) => {
    setRevealedPins(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Products filtered by active caisse/sector
  const currentSectorProducts = productsList.filter(p => p.sector === activeSector);
  const categoriesList = Array.from(new Set(currentSectorProducts.map(p => p.category)));

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name.trim() || !newProduct.price) return;
    const item: Product = {
      id: `prod-${Date.now()}`,
      name: newProduct.name.trim(),
      category: newProduct.category,
      barcode: newProduct.barcode.trim() || `BC-${Date.now().toString().slice(-7)}`,
      brand: newProduct.brand.trim() || undefined,
      isWeighted: newProduct.isWeighted,
      unit: newProduct.isWeighted ? 'kg' : 'u',
      price: Number(newProduct.price),
      costPrice: Number(newProduct.costPrice) || Math.round(Number(newProduct.price) * 0.6),
      stock: Number(newProduct.stock) || 50,
      image: newProduct.image.trim() || 'divers',
      sector: activeSector
    };
    const updated = [item, ...productsList];
    setProductsList(updated);
    if (onProductsUpdated) onProductsUpdated(updated);
    setShowAddProductModal(false);
    setNewProduct({
      name: '',
      category: categoriesList[0] || (activeSector === 'restaurant' ? 'Plats Traditionnels' : 'Épicerie & Céréales'),
      barcode: `2222000${Math.floor(100 + Math.random() * 900)}`,
      brand: '',
      isWeighted: false,
      price: 150,
      costPrice: 80,
      stock: 50,
      image: ''
    });
  };

  const handleSaveEditProduct = (id: string) => {
    const updated = productsList.map(p => p.id === id ? { ...p, ...productForm } : p);
    setProductsList(updated);
    if (onProductsUpdated) onProductsUpdated(updated);
    setEditingProductId(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm('Voulez-vous supprimer cet article ?')) {
      const updated = productsList.filter(p => p.id !== id);
      setProductsList(updated);
      if (onProductsUpdated) onProductsUpdated(updated);
    }
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      localStorage.setItem('caissa_gestion_settings', JSON.stringify(settings));
      setSettingsSavedToast(true);
      setTimeout(() => setSettingsSavedToast(false), 3000);
    } catch (e) {
      console.warn(e);
    }
  };

  const filteredProducts = currentSectorProducts.filter(p => {
    const matchCat = selectedCategoryFilter === 'all' || p.category === selectedCategoryFilter;
    const matchSearch = p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
      (p.barcode && p.barcode.toLowerCase().includes(productSearch.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div style={{ padding: '0 16px 32px', display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Banner Header with Caisse Switcher */}
      <div style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #0f172a 100%)',
        borderRadius: '14px',
        padding: '20px 24px',
        color: '#ffffff',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)'
          }}>
            <ShieldCheck size={26} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                Back-Office & Administration
              </h2>

              {/* Selector to manage Restaurant OR Boutique/Boucherie */}
              <div style={{ display: 'flex', background: 'rgba(0,0,0,0.3)', padding: '2px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <button
                  type="button"
                  onClick={() => { setActiveSector('restaurant'); setSelectedCategoryFilter('all'); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: activeSector === 'restaurant' ? 800 : 500,
                    background: activeSector === 'restaurant' ? '#10b981' : 'transparent',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <UtensilsCrossed size={12} />
                  <span>Caisse Restaurant</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setActiveSector('market'); setSelectedCategoryFilter('all'); }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '0.74rem',
                    fontWeight: activeSector === 'market' ? 800 : 500,
                    background: activeSector === 'market' ? '#10b981' : 'transparent',
                    color: '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <ShoppingBag size={12} />
                  <span>Caisse Boutique & Pesée</span>
                </button>
              </div>
            </div>

            <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>
              {activeSector === 'restaurant'
                ? "Gérez vos Tables de salle, Caissiers & PINs, Plats & Boissons du menu et paramètres restaurant."
                : "Gérez vos Postes de Caisse & Rayons, Caissiers, Articles & Stocks (Code-barres & Pesée kg), et coordonnées du magasin."}
            </p>
          </div>
        </div>

        {/* Global Statistics Badges */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '8px 14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#34d399' }}>
              {activeSector === 'restaurant' ? tables.length : caissesRayons.length}
            </div>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
              {activeSector === 'restaurant' ? 'Tables' : 'Caisses & Rayons'}
            </div>
          </div>
          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '8px 14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#a78bfa' }}>{cashiers.length}</div>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Utilisateurs</div>
          </div>
          <div style={{
            background: 'rgba(0, 0, 0, 0.35)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '10px',
            padding: '8px 14px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#38bdf8' }}>{currentSectorProducts.length}</div>
            <div style={{ fontSize: '0.66rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>Articles au Catalogue</div>
          </div>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div style={{
        display: 'flex',
        gap: '8px',
        borderBottom: '1px solid var(--border-glass)',
        paddingBottom: '8px',
        flexWrap: 'wrap'
      }}>
        <button
          type="button"
          onClick={() => setActiveTab('infrastructure')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: activeTab === 'infrastructure' ? '1px solid #059669' : '1px solid transparent',
            background: activeTab === 'infrastructure' ? '#059669' : 'var(--bg-secondary)',
            color: activeTab === 'infrastructure' ? '#ffffff' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          {activeSector === 'restaurant' ? <LayoutGrid size={16} /> : <Store size={16} />}
          <span>{activeSector === 'restaurant' ? 'Plan des Tables & Salles' : 'Postes de Caisse & Rayons'}</span>
          <span style={{
            background: activeTab === 'infrastructure' ? 'rgba(0, 0, 0, 0.25)' : 'var(--bg-tertiary)',
            color: activeTab === 'infrastructure' ? '#ffffff' : 'var(--text-dim)',
            padding: '1px 6px',
            borderRadius: '999px',
            fontSize: '0.7rem'
          }}>
            {activeSector === 'restaurant' ? tables.length : caissesRayons.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('cashiers')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: activeTab === 'cashiers' ? '1px solid #7c3aed' : '1px solid transparent',
            background: activeTab === 'cashiers' ? '#7c3aed' : 'var(--bg-secondary)',
            color: activeTab === 'cashiers' ? '#ffffff' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Users size={16} />
          <span>Caissiers & Équipe (Codes PIN)</span>
          <span style={{
            background: activeTab === 'cashiers' ? 'rgba(0, 0, 0, 0.25)' : 'var(--bg-tertiary)',
            color: activeTab === 'cashiers' ? '#ffffff' : 'var(--text-dim)',
            padding: '1px 6px',
            borderRadius: '999px',
            fontSize: '0.7rem'
          }}>
            {cashiers.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('articles')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: activeTab === 'articles' ? '1px solid #0284c7' : '1px solid transparent',
            background: activeTab === 'articles' ? '#0284c7' : 'var(--bg-secondary)',
            color: activeTab === 'articles' ? '#ffffff' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Package size={16} />
          <span>Articles, Tarifs & Marges</span>
          <span style={{
            background: activeTab === 'articles' ? 'rgba(0, 0, 0, 0.25)' : 'var(--bg-tertiary)',
            color: activeTab === 'articles' ? '#ffffff' : 'var(--text-dim)',
            padding: '1px 6px',
            borderRadius: '999px',
            fontSize: '0.7rem'
          }}>
            {currentSectorProducts.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: activeTab === 'settings' ? '1px solid #d97706' : '1px solid transparent',
            background: activeTab === 'settings' ? '#d97706' : 'var(--bg-secondary)',
            color: activeTab === 'settings' ? '#ffffff' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Settings size={16} />
          <span>Paramètres Établissement</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pdv')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            borderRadius: '10px',
            border: activeTab === 'pdv' ? '1px solid #10b981' : '1px solid transparent',
            background: activeTab === 'pdv' ? '#10b981' : 'var(--bg-secondary)',
            color: activeTab === 'pdv' ? '#ffffff' : 'var(--text-main)',
            fontWeight: 800,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease'
          }}
        >
          <Building2 size={16} />
          <span>Points de Vente & Succursales</span>
          <span style={{
            background: activeTab === 'pdv' ? 'rgba(0, 0, 0, 0.25)' : 'var(--bg-tertiary)',
            color: activeTab === 'pdv' ? '#ffffff' : 'var(--text-dim)',
            padding: '1px 6px',
            borderRadius: '999px',
            fontSize: '0.7rem'
          }}>
            {pointsDeVente.length || 2}
          </span>
        </button>
      </div>

      {/* TAB 1: GESTION DE L'INFRASTRUCTURE (TABLES EN RESTO OU CAISSES & RAYONS EN BOUTIQUE) */}
      {activeTab === 'infrastructure' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {activeSector === 'restaurant' ? (
            /* --- RESTAURANT: PLAN DES TABLES --- */
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Plan des Tables de Restaurant</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Organisez les tables par zones (Salle principale, Terrasse, VIP) avec le nombre de chaises.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddTableModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                  }}
                >
                  <Plus size={16} />
                  <span>Ajouter une Table</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {tables.map(table => {
                  const isEditing = editingTableId === table.id;
                  return (
                    <div
                      key={table.id}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-glass)',
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}
                    >
                      {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input
                            type="text"
                            value={tableForm.name ?? table.name}
                            onChange={(e) => setTableForm({ ...tableForm, name: e.target.value })}
                            style={{ padding: '6px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                          />
                          <select
                            value={tableForm.zone ?? table.zone}
                            onChange={(e) => setTableForm({ ...tableForm, zone: e.target.value })}
                            style={{ padding: '6px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                          >
                            {RESTO_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                          </select>
                          <input
                            type="number"
                            min="1"
                            value={tableForm.seats ?? table.seats}
                            onChange={(e) => setTableForm({ ...tableForm, seats: Number(e.target.value) })}
                            style={{ padding: '6px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                          />
                          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                            <button onClick={() => handleSaveEditTable(table.id)} style={{ flex: 1, padding: '6px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>Enregistrer</button>
                            <button onClick={() => setEditingTableId(null)} style={{ padding: '6px 12px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-glass)', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}>Annuler</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: '#059669', background: 'rgba(5, 150, 105, 0.12)', padding: '2px 6px', borderRadius: '4px' }}>
                                {table.zone}
                              </span>
                              <h4 style={{ margin: '6px 0 0', fontSize: '1.05rem', fontWeight: 800 }}>{table.name}</h4>
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: table.status === 'libre' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: table.status === 'libre' ? '#10b981' : '#ef4444' }}>
                              {table.status === 'libre' ? '🟢 Libre' : '🔴 Occupée'}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <Users size={14} />
                            <span>Capacité : <b>{table.seats} couverts</b></span>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid var(--border-glass)', paddingTop: '10px' }}>
                            <button onClick={() => { setEditingTableId(table.id); setTableForm({ name: table.name, zone: table.zone, seats: table.seats }); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '6px', padding: '4px 8px', color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                              <Edit3 size={13} /> Modifier
                            </button>
                            <button onClick={() => handleDeleteTable(table.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '6px', padding: '4px 8px', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                              <Trash2 size={13} /> Supprimer
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            /* --- BOUTIQUE / BOUCHERIE: POSTES DE CAISSE & RAYONS --- */
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Postes de Caisse & Rayons du Magasin</h3>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Configurez vos caisses de sortie, caisses pesée balances et rayons de vente.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowAddCrModal(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#059669',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
                  }}
                >
                  <Plus size={16} />
                  <span>Ajouter Caisse ou Rayon</span>
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
                {caissesRayons.map(cr => {
                  const isEditing = editingCrId === cr.id;
                  const isCaisse = cr.type === 'caisse';

                  return (
                    <div
                      key={cr.id}
                      style={{
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-glass)',
                        borderLeft: `4px solid ${isCaisse ? '#10b981' : '#0284c7'}`,
                        borderRadius: '12px',
                        padding: '16px',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                      }}
                    >
                      {isEditing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                          <input
                            type="text"
                            value={crForm.name ?? cr.name}
                            onChange={(e) => setCrForm({ ...crForm, name: e.target.value })}
                            style={{ padding: '6px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                          />
                          <select
                            value={crForm.location ?? cr.location}
                            onChange={(e) => setCrForm({ ...crForm, location: e.target.value })}
                            style={{ padding: '6px 8px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                          >
                            {STORE_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                          </select>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                            <button onClick={() => handleSaveEditCaisseRayon(cr.id)} style={{ flex: 1, padding: '6px', background: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>Enregistrer</button>
                            <button onClick={() => setEditingCrId(null)} style={{ padding: '6px 12px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-glass)', borderRadius: '6px', fontSize: '0.78rem', cursor: 'pointer' }}>Annuler</button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <span style={{
                                fontSize: '0.68rem',
                                fontWeight: 700,
                                color: isCaisse ? '#10b981' : '#0284c7',
                                background: isCaisse ? 'rgba(16, 185, 129, 0.12)' : 'rgba(2, 132, 199, 0.12)',
                                padding: '2px 6px',
                                borderRadius: '4px'
                              }}>
                                {isCaisse ? '🖥️ POSTE DE CAISSE' : '📦 RAYON DE VENTE'}
                              </span>
                              <h4 style={{ margin: '6px 0 0', fontSize: '1rem', fontWeight: 800 }}>{cr.name}</h4>
                            </div>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '3px 8px', borderRadius: '6px', background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                              🟢 Actif
                            </span>
                          </div>

                          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            Emplacement : <b>{cr.location}</b>
                            {cr.operatorName && <div>Caissier rattaché : <b>{cr.operatorName}</b></div>}
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px', borderTop: '1px solid var(--border-glass)', paddingTop: '10px' }}>
                            <button onClick={() => { setEditingCrId(cr.id); setCrForm({ name: cr.name, location: cr.location }); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '6px', padding: '4px 8px', color: 'var(--text-main)', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                              <Edit3 size={13} /> Modifier
                            </button>
                            <button onClick={() => handleDeleteCaisseRayon(cr.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '6px', padding: '4px 8px', color: '#ef4444', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}>
                              <Trash2 size={13} /> Supprimer
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Modal Ajouter Table (Restaurant) */}
          {showAddTableModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '14px', width: '100%', maxWidth: '420px', padding: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Ajouter une Nouvelle Table</h3>
                  <button onClick={() => setShowAddTableModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <form onSubmit={handleAddTable} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Nom ou Numéro de la Table *</label>
                    <input type="text" placeholder="Ex: Table 9, Terrasse 4..." value={newTable.name} onChange={(e) => setNewTable({ ...newTable, name: e.target.value })} required style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Zone / Emplacement</label>
                    <select value={newTable.zone} onChange={(e) => setNewTable({ ...newTable, zone: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                      {RESTO_ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Couverts (Chaises)</label>
                    <input type="number" min="1" max="40" value={newTable.seats} onChange={(e) => setNewTable({ ...newTable, seats: Number(e.target.value) })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button type="submit" style={{ flex: 1, background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Créer la Table</button>
                    <button type="button" onClick={() => setShowAddTableModal(false)} style={{ padding: '10px 16px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-glass)', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>Annuler</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal Ajouter Caisse ou Rayon (Boutique) */}
          {showAddCrModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '14px', width: '100%', maxWidth: '420px', padding: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Nouveau Poste de Caisse ou Rayon</h3>
                  <button onClick={() => setShowAddCrModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <form onSubmit={handleAddCaisseRayon} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Type d'élément</label>
                    <select value={newCr.type} onChange={(e) => setNewCr({ ...newCr, type: e.target.value as 'caisse' | 'rayon' })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                      <option value="caisse">🖥️ Poste de Caisse (Encaissement)</option>
                      <option value="rayon">📦 Rayon de Magasin (Emplacement)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Désignation *</label>
                    <input type="text" placeholder="Ex: Caisse N°4 Express, Rayon Produits Frais..." value={newCr.name} onChange={(e) => setNewCr({ ...newCr, name: e.target.value })} required style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Emplacement</label>
                    <select value={newCr.location} onChange={(e) => setNewCr({ ...newCr, location: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                      {STORE_LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button type="submit" style={{ flex: 1, background: '#059669', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Enregistrer</button>
                    <button type="button" onClick={() => setShowAddCrModal(false)} style={{ padding: '10px 16px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-glass)', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>Annuler</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: GESTION DES CAISSIERS & CODES PIN */}
      {activeTab === 'cashiers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Gestion des Caissiers & Utilisateurs POS</h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Attribuez un code PIN à 4 chiffres sécurisé à chaque membre de votre équipe pour verrouiller ou ouvrir la caisse.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddCashierModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#7c3aed',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(124, 58, 237, 0.3)'
              }}
            >
              <Plus size={16} />
              <span>Nouveau Caissier / Utilisateur</span>
            </button>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-glass)', color: 'var(--text-dim)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Utilisateur / Nom</th>
                  <th style={{ padding: '12px 16px' }}>Rôle & Permissions</th>
                  <th style={{ padding: '12px 16px' }}>Code PIN (4 chiffres)</th>
                  <th style={{ padding: '12px 16px' }}>Téléphone</th>
                  <th style={{ padding: '12px 16px' }}>Statut</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cashiers.map(cashier => {
                  const roleStyle = ROLE_INFO[cashier.role] || ROLE_INFO.CASHIER;
                  const isRevealed = revealedPins[cashier.id];

                  return (
                    <tr key={cashier.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: roleStyle.bg, color: roleStyle.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                            {cashier.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{cashier.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>ID: {cashier.id}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: roleStyle.bg, color: roleStyle.color, padding: '3px 8px', borderRadius: '6px', fontWeight: 700, fontSize: '0.75rem' }}>
                          {roleStyle.label}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontFamily: 'monospace', fontWeight: 800, letterSpacing: isRevealed ? '3px' : '4px', fontSize: '0.95rem', color: '#10b981' }}>
                            {isRevealed ? cashier.pin : '••••'}
                          </span>
                          <button type="button" onClick={() => togglePinVisibility(cashier.id)} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '2px' }} title={isRevealed ? 'Masquer' : 'Afficher'}>
                            {isRevealed ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>{cashier.phone}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: cashier.active ? '#10b981' : '#ef4444', background: cashier.active ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)', padding: '2px 8px', borderRadius: '4px' }}>
                          {cashier.active ? 'Actif' : 'Désactivé'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button onClick={() => handleDeleteCashier(cashier.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }} title="Supprimer">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {showAddCashierModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '14px', width: '100%', maxWidth: '440px', padding: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Créer un Caissier ou Opérateur</h3>
                  <button onClick={() => setShowAddCashierModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                </div>
                <form onSubmit={handleAddCashier} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Nom Complet *</label>
                    <input type="text" placeholder="Ex: Mohamed Lemine, Fatimetou..." value={newCashier.name} onChange={(e) => setNewCashier({ ...newCashier, name: e.target.value })} required style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Rôle et Permissions</label>
                    <select value={newCashier.role} onChange={(e) => setNewCashier({ ...newCashier, role: e.target.value as CashierItem['role'] })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                      <option value="CASHIER">Caissier(e) - Encaissements standards</option>
                      <option value="WAITER">Vendeur / Serveur - Prise de commandes</option>
                      <option value="MANAGER">Gérant / Manager - Annulations, Clôtures Z</option>
                      <option value="OWNER">Patron / Propriétaire - Accès complet</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Code PIN Secret (4 Chiffres) *</label>
                    <input type="password" maxLength={4} placeholder="Ex: 4321" value={newCashier.pin} onChange={(e) => setNewCashier({ ...newCashier, pin: e.target.value.replace(/\D/g, '') })} required style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.95rem', letterSpacing: '4px', fontFamily: 'monospace' }} />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Téléphone Mauritanie</label>
                    <input type="text" placeholder="+222 22 14 55 88" value={newCashier.phone} onChange={(e) => setNewCashier({ ...newCashier, phone: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button type="submit" style={{ flex: 1, background: '#7c3aed', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Enregistrer</button>
                    <button type="button" onClick={() => setShowAddCashierModal(false)} style={{ padding: '10px 16px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-glass)', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>Annuler</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: GESTION DES ARTICLES & STOCKS (MULTI-CAISSE) */}
      {activeTab === 'articles' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                {activeSector === 'restaurant' ? 'Carte des Plats & Tarifs' : 'Catalogue Articles, Code-Barres & Stocks'}
              </h3>
              <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {activeSector === 'restaurant'
                  ? "Gérez les plats, suppléments et prix avec calcul automatique de la rentabilité."
                  : "Gérez vos références de vente, codes-barres, articles au poids (kg / balances) et marges."}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowAddProductModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontWeight: 700,
                fontSize: '0.82rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(2, 132, 199, 0.3)'
              }}
            >
              <Plus size={16} />
              <span>Ajouter un Article</span>
            </button>
          </div>

          {/* Search and Category Filter Bar */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                placeholder="Rechercher par nom, catégorie ou code-barres..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                style={{ width: '100%', padding: '8px 10px 8px 32px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', paddingBottom: '2px' }}>
              <button
                type="button"
                onClick={() => setSelectedCategoryFilter('all')}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)',
                  background: selectedCategoryFilter === 'all' ? '#0284c7' : 'var(--bg-secondary)',
                  color: selectedCategoryFilter === 'all' ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Tous ({currentSectorProducts.length})
              </button>
              {categoriesList.map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategoryFilter(cat)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-glass)',
                    background: selectedCategoryFilter === cat ? '#0284c7' : 'var(--bg-secondary)',
                    color: selectedCategoryFilter === cat ? '#fff' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Articles Table */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-glass)', color: 'var(--text-dim)', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '12px 16px' }}>Article / Référence</th>
                  <th style={{ padding: '12px 16px' }}>Catégorie</th>
                  <th style={{ padding: '12px 16px' }}>Unité & Type</th>
                  <th style={{ padding: '12px 16px' }}>Prix Vente (MRU)</th>
                  <th style={{ padding: '12px 16px' }}>Coût Revient (MRU)</th>
                  <th style={{ padding: '12px 16px' }}>Marge Brute</th>
                  <th style={{ padding: '12px 16px' }}>Stock</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(product => {
                  const isEditing = editingProductId === product.id;
                  const cost = product.costPrice || Math.round(product.price * 0.6);
                  const marginMRU = product.price - cost;
                  const marginPercent = Math.round((marginMRU / product.price) * 100);

                  return (
                    <tr key={product.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                      <td style={{ padding: '12px 16px' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <input
                              type="text"
                              value={productForm.name ?? product.name}
                              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                              style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                            />
                            <input
                              type="text"
                              placeholder="URL de l'image (optionnel)"
                              value={productForm.image ?? product.image ?? ''}
                              onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                              style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-dim)', fontSize: '0.75rem' }}
                            />
                          </div>
                        ) : (
                          <div>
                            <div style={{ fontWeight: 800, color: 'var(--text-main)' }}>{product.name}</div>
                            {product.barcode && (
                              <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)', fontFamily: 'monospace', marginTop: '2px' }}>
                                🏷️ {product.barcode} {product.brand ? `• ${product.brand}` : ''}
                              </div>
                            )}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: 'var(--bg-tertiary)', color: 'var(--text-dim)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                          {product.category}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '0.74rem',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: product.isWeighted ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-tertiary)',
                          color: product.isWeighted ? '#0284c7' : 'var(--text-main)'
                        }}>
                          {product.isWeighted ? '⚖️ Au Kilo (Kg)' : '📦 À l\'Unité'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {isEditing ? (
                          <input
                            type="number"
                            value={productForm.price ?? product.price}
                            onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                            style={{ width: '70px', padding: '4px 6px', borderRadius: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                          />
                        ) : (
                          <span style={{ fontWeight: 800, color: '#10b981', fontSize: '0.92rem' }}>
                            {product.price} MRU
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        {isEditing ? (
                          <input
                            type="number"
                            value={productForm.costPrice ?? cost}
                            onChange={(e) => setProductForm({ ...productForm, costPrice: Number(e.target.value) })}
                            style={{ width: '70px', padding: '4px 6px', borderRadius: '4px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                          />
                        ) : (
                          <span>{cost} MRU</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: 800,
                          color: marginPercent > 40 ? '#10b981' : '#f59e0b',
                          background: marginPercent > 40 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          +{marginMRU} MRU ({marginPercent}%)
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: (product.stock ?? 50) < 10 ? '#ef4444' : 'var(--text-main)' }}>
                          {product.stock ?? 50} {product.isWeighted ? 'kg' : 'u.'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '4px' }}>
                            <button onClick={() => handleSaveEditProduct(product.id)} style={{ padding: '4px 8px', background: '#059669', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>Valider</button>
                            <button onClick={() => setEditingProductId(null)} style={{ padding: '4px 8px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: 'none', borderRadius: '4px', fontSize: '0.75rem', cursor: 'pointer' }}>✕</button>
                          </div>
                        ) : (
                          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
                            <button onClick={() => { setEditingProductId(product.id); setProductForm({ name: product.name, price: product.price, costPrice: cost, image: product.image }); }} style={{ background: 'transparent', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', padding: '4px' }} title="Modifier">
                              <Edit3 size={15} />
                            </button>
                            <button onClick={() => handleDeleteProduct(product.id)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }} title="Supprimer">
                              <Trash2 size={15} />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Modal Nouveau Produit (Multi-Caisse avec Code-barres & Pesée) */}
          {showAddProductModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '16px' }}>
              <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '14px', width: '100%', maxWidth: '460px', padding: '20px', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                    Ajouter un Article ({activeSector === 'restaurant' ? 'Restaurant' : 'Boutique / Pesée'})
                  </h3>
                  <button onClick={() => setShowAddProductModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={18} /></button>
                </div>

                <form onSubmit={handleAddProduct} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Nom de l'article *</label>
                    <input type="text" placeholder="Ex: Viande de Chameau, Lait Gloria, Thé Warka..." value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} required style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Catégorie</label>
                      <input type="text" placeholder="Ex: Épicerie, Boissons..." value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} required style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Type de Vente</label>
                      <select value={newProduct.isWeighted ? 'weighted' : 'unit'} onChange={(e) => setNewProduct({ ...newProduct, isWeighted: e.target.value === 'weighted' })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                        <option value="unit">📦 À l'Unité (Pièce)</option>
                        <option value="weighted">⚖️ Au Poids (Balance / Kg)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Code-Barres EAN</label>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <input type="text" placeholder="2222000..." value={newProduct.barcode} onChange={(e) => setNewProduct({ ...newProduct, barcode: e.target.value })} style={{ flex: 1, padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem', fontFamily: 'monospace' }} />
                      <button type="button" onClick={() => setNewProduct({ ...newProduct, barcode: `2222000${Math.floor(100 + Math.random() * 900)}` })} style={{ padding: '8px 10px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: '6px', fontSize: '0.75rem', cursor: 'pointer', color: 'var(--text-main)' }}>Auto</button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Prix de Vente (MRU) *</label>
                      <input type="number" min="1" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })} required style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: '#10b981', fontWeight: 800, fontSize: '0.95rem' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Coût de Revient (MRU)</label>
                      <input type="number" min="0" value={newProduct.costPrice} onChange={(e) => setNewProduct({ ...newProduct, costPrice: Number(e.target.value) })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.95rem' }} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Stock Initial ({newProduct.isWeighted ? 'kg' : 'unités'})</label>
                      <input type="number" min="0" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Image (Clé ou URL)</label>
                      <input type="text" placeholder="Ex: thieboudienne ou https://..." value={newProduct.image} onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })} style={{ width: '100%', padding: '8px 10px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                    <button type="submit" style={{ flex: 1, background: '#0284c7', color: '#fff', border: 'none', borderRadius: '8px', padding: '10px', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}>Enregistrer l'Article</button>
                    <button type="button" onClick={() => setShowAddProductModal(false)} style={{ padding: '10px 16px', background: 'var(--bg-tertiary)', color: 'var(--text-muted)', border: '1px solid var(--border-glass)', borderRadius: '8px', fontSize: '0.85rem', cursor: 'pointer' }}>Annuler</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: PARAMÈTRES ÉTABLISSEMENT */}
      {activeTab === 'settings' && (
        <div style={{ maxWidth: '720px' }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glass)', borderRadius: '12px', padding: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(217, 119, 6, 0.15)', padding: '8px', borderRadius: '8px', color: '#d97706' }}>
                <Building2 size={20} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Paramètres & Entête Fiscale des Tickets</h3>
                <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Coordonnées certifiées imprimées sur les tickets de caisse en Mauritanie.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Nom Commercial de l'Établissement *</label>
                <input type="text" value={settings.businessName} onChange={(e) => setSettings({ ...settings, businessName: e.target.value })} required style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Numéro NIF Fiscal (Mauritanie)</label>
                  <input type="text" value={settings.nif} onChange={(e) => setSettings({ ...settings, nif: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Téléphone Support</label>
                  <input type="text" value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Adresse en Mauritanie</label>
                <input type="text" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Devise Monétaire</label>
                  <input type="text" value={settings.currency} disabled style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', color: 'var(--text-dim)', fontSize: '0.85rem', fontWeight: 800 }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Format d'Imprimante Thermique</label>
                  <select value={settings.ticketWidth} onChange={(e) => setSettings({ ...settings, ticketWidth: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                    <option value="80mm">Standard 80mm (ESC/POS)</option>
                    <option value="58mm">Compacte 58mm (Mobile / Bluetooth)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Code Wi-Fi Invité</label>
                <input type="text" value={settings.wifiPassword} onChange={(e) => setSettings({ ...settings, wifiPassword: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>Message Pied de Ticket</label>
                <textarea rows={2} value={settings.receiptFooter} onChange={(e) => setSettings({ ...settings, receiptFooter: e.target.value })} style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem', resize: 'none' }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '10px' }}>
                <button type="submit" style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#059669', color: '#ffffff', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer', boxShadow: '0 2px 10px rgba(5, 150, 105, 0.3)' }}>
                  <Save size={16} /> Enregistrer les Paramètres
                </button>
                {settingsSavedToast && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#10b981', fontSize: '0.82rem', fontWeight: 700 }}>
                    <CheckCircle2 size={16} /> Paramètres enregistrés avec succès !
                  </span>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 5: POINTS DE VENTE & SUCCURSALES (SÉPARATION ET CLOISONNEMENT) */}
      {activeTab === 'pdv' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Header Banner */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 78, 59, 0.25) 100%)',
            border: '1.5px solid rgba(16, 185, 129, 0.35)',
            borderRadius: '16px',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 14px rgba(5, 150, 105, 0.4)'
              }}>
                <Building2 size={24} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Architecture Multi-Points de Vente & Cloisonnement Strict
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Chaque succursale possède ses propres caisses, son panier actif indépendant, ses tickets numérotés et sa comptabilité hermétique.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowAddPdvModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#059669',
                color: '#ffffff',
                border: 'none',
                padding: '10px 18px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)'
              }}
            >
              <Plus size={16} />
              <span>Ajouter une Succursale</span>
            </button>
          </div>

          {/* Active PDV Status Box */}
          <div style={{
            background: 'var(--bg-card)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '12px',
            padding: '14px 20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.1rem' }}>📍</span>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  Point de Vente actuellement sélectionné sur ce terminal :
                </div>
                <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700 }}>
                  [{activePointDeVente?.code || 'PDV-01'}] {activePointDeVente?.name || 'Siège Principal'} ({activePointDeVente?.address || 'Tevragh-Zeina'})
                </div>
              </div>
            </div>
            <div style={{
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#10b981',
              padding: '4px 12px',
              borderRadius: '999px',
              fontSize: '0.76rem',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <ShieldCheck size={14} /> Données & Panier 100% Cloisonnés
            </div>
          </div>

          {/* Points de Vente Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '16px'
          }}>
            {pointsDeVente.map(pdv => {
              const isActive = activePointDeVente?.id === pdv.id;
              return (
                <div
                  key={pdv.id}
                  style={{
                    background: 'var(--bg-card)',
                    borderRadius: '14px',
                    border: isActive ? '2px solid #059669' : '1px solid var(--border-glass)',
                    padding: '18px 20px',
                    boxShadow: isActive ? '0 4px 20px rgba(5, 150, 105, 0.15)' : '0 2px 8px rgba(0,0,0,0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '14px',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{
                          background: isActive ? '#059669' : 'var(--bg-tertiary)',
                          color: isActive ? '#ffffff' : 'var(--text-dim)',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.72rem',
                          fontWeight: 800
                        }}>
                          {pdv.code}
                        </span>
                        <span style={{
                          background: 'rgba(59, 130, 246, 0.1)',
                          color: '#3b82f6',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontSize: '0.7rem',
                          fontWeight: 700
                        }}>
                          {pdv.sector === 'restaurant' ? 'Restaurant' : pdv.sector === 'cosmetics' ? 'Cosmétique' : pdv.sector === 'butcher' ? 'Boucherie' : 'Boutique / Hannout'}
                        </span>
                      </div>
                      <h4 style={{ margin: '8px 0 2px', fontSize: '1.02rem', fontWeight: 800, color: 'var(--text-main)' }}>
                        {pdv.name}
                      </h4>
                      {pdv.nameAr && (
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', direction: 'rtl' }}>
                          {pdv.nameAr}
                        </div>
                      )}
                    </div>

                    {isActive && (
                      <span style={{
                        background: '#10b981',
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '3px 8px',
                        borderRadius: '999px',
                        whiteSpace: 'nowrap'
                      }}>
                        En cours
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    <div>📍 {pdv.address || 'Nouakchott, Mauritanie'}</div>
                    <div>📞 {pdv.phone || '+222 22 14 55 88'}</div>
                    <div>🖥️ {pdv.caisseCount || 1} poste(s) de caisse configuré(s)</div>
                  </div>

                  <div style={{
                    marginTop: 'auto',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <span style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} /> Panier & Ventes Isolés
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                      ID: {pdv.id}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modal Ajout Succursale */}
          {showAddPdvModal && (
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
              zIndex: 9999,
              padding: '20px'
            }}>
              <div style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-glass)',
                borderRadius: '16px',
                width: '100%',
                maxWidth: '480px',
                padding: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: '#059669', color: '#fff', padding: '8px', borderRadius: '8px' }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>Nouvelle Succursale / Point de Vente</h3>
                      <p style={{ margin: '2px 0 0', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
                        Créer un établissement indépendant avec caisse et panier isolés
                      </p>
                    </div>
                  </div>
                  <button onClick={() => setShowAddPdvModal(false)} style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer' }}>
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleAddPdvSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                      Nom Commercial de la Succursale *
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Supérette Al-Baraka (Succursale Arafat)"
                      value={newPdvName}
                      onChange={(e) => setNewPdvName(e.target.value)}
                      required
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                      Nom en Arabe (الاسم بالعربية)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: بقالة البركة (فرع عرفات)"
                      value={newPdvNameAr}
                      onChange={(e) => setNewPdvNameAr(e.target.value)}
                      dir="rtl"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                        Activité / Secteur
                      </label>
                      <select
                        value={newPdvSector}
                        onChange={(e) => setNewPdvSector(e.target.value as SectorType)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      >
                        <option value="market">Boutique & Hannout</option>
                        <option value="restaurant">Restaurant & Café</option>
                        <option value="cosmetics">Parapharmacie & Cosmétique</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                        Quartier / Adresse
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Arafat Carrefour Madrid"
                        value={newPdvAddress}
                        onChange={(e) => setNewPdvAddress(e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.85rem' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setShowAddPdvModal(false)}
                      style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'var(--bg-secondary)', color: 'var(--text-main)', cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem' }}
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#059669', color: '#ffffff', cursor: 'pointer', fontWeight: 800, fontSize: '0.85rem', boxShadow: '0 2px 8px rgba(5, 150, 105, 0.4)' }}
                    >
                      Créer la Succursale
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GestionScreen;