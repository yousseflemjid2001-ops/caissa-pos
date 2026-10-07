import React, { useState, useEffect } from 'react';
import {
  Search,
  Barcode,
  Trash2,
  Plus,
  Minus,
  Printer,
  CreditCard,
  Banknote,
  BookOpen,
  CheckCircle2,
  Scale,
  X,
  FileSpreadsheet,
  Utensils,
  PauseCircle,
  PlayCircle,
  Calculator,
  Smartphone,
  Check,
  UtensilsCrossed,
  ShoppingBag,
  Bike,
  Split,
  FileText,
  Flame,
  Coffee,
  ChevronDown,
  Phone,
  MapPin,
  ChefHat,
  Coins,
  UserCheck,
  SlidersHorizontal,
  Package,
  Edit3
} from 'lucide-react';
import type { Product, KridiCustomer, Table } from '../data/mockData';
import { INITIAL_KRIDI_CUSTOMERS, INITIAL_TABLES } from '../data/mockData';
import type { UserAccount } from './AuthModal';
import { 
  getDailyZReportApi, 
  getKridiCustomersApi, 
  createCashMovementApi, 
  getCashMovementsApi 
} from '../services/api';

export interface CartItem {
  product: Product;
  quantity: number;
  weightInKg?: number;
  notes?: string;
}

export interface HeldTicket {
  id: string;
  time: string;
  items: CartItem[];
  subtotal: number;
  table?: string | null;
  orderType?: 'SUR_PLACE' | 'A_EMPORTER' | 'LIVRAISON';
}

interface PosScreenProps {
  products: Product[];
  sector: 'restaurant' | 'market';
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrderSuccess: (orderData: any) => void;
  selectedTable?: string | null;
  onClearTable?: () => void;
  onSelectTable?: (table: Table) => void;
  account?: UserAccount | null;
}

export const PosScreen: React.FC<PosScreenProps> = ({
  products,
  sector,
  cart,
  setCart,
  onOrderSuccess,
  selectedTable,
  onClearTable,
  account
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [showOnlyNoBarcode, setShowOnlyNoBarcode] = useState<boolean>(false);
  const [weighingProduct, setWeighingProduct] = useState<Product | null>(null);
  const [scaleWeight, setScaleWeight] = useState<number>(1.25); // kg simulation balance
  const [scaleTare, setScaleTare] = useState<number>(0);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [cashGiven, setCashGiven] = useState<number>(0);
  const [completedOrder, setCompletedOrder] = useState<any | null>(null);

  // Tickets en Attente (Hold / Resume)
  const [heldTickets, setHeldTickets] = useState<HeldTicket[]>([]);
  const [isHeldModalOpen, setIsHeldModalOpen] = useState(false);

  // Calculatrice Tactile Intégrée
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [calcInput, setCalcInput] = useState('0');

  // Modal Kridi Customer Select (Mauritanie)
  const [isKridiModalOpen, setIsKridiModalOpen] = useState(false);
  const [kridiCustomers, setKridiCustomers] = useState<KridiCustomer[]>(INITIAL_KRIDI_CUSTOMERS);
  const [selectedKridiCustomer, setSelectedKridiCustomer] = useState<KridiCustomer | null>(null);

  // Modal Bankily / Masrvi Mobile Money (Mauritanie)
  const [isBankilyModalOpen, setIsBankilyModalOpen] = useState(false);
  const [mobileGateway, setMobileGateway] = useState<'BANKILY' | 'MASRVI'>('BANKILY');
  const [mobilePhoneInput, setMobilePhoneInput] = useState('');
  const [mobileRefInput, setMobileRefInput] = useState('');

  // Modal Rapport Z (Clôture de Caisse) & Rapport X (Intermédiaire)
  const [isZReportModalOpen, setIsZReportModalOpen] = useState(false);
  const [zReportData, setZReportData] = useState<any | null>(null);
  const [isXReportModalOpen, setIsXReportModalOpen] = useState(false);
  const [xReportData, setXReportData] = useState<any | null>(null);

  // Mouvements de caisse & Fond de caisse
  const [isCashDrawerModalOpen, setIsCashDrawerModalOpen] = useState(false);
  const [drawerType, setDrawerType] = useState<'FLOAT_OPEN' | 'IN' | 'OUT'>('OUT');
  const [drawerAmount, setDrawerAmount] = useState<string>('');
  const [drawerReason, setDrawerReason] = useState<string>('');
  const [drawerMovements, setDrawerMovements] = useState<any[]>([
    { id: 'cm-1', type: 'FLOAT_OPEN', amount: 2000, reason: 'Fond de caisse initial ouverture', cashierName: 'Sidi Mohamed (Patron)', time: '08:00' }
  ]);

  // Article Libre (Vente au montant libre / Hors catalogue)
  const [isCustomItemModalOpen, setIsCustomItemModalOpen] = useState(false);
  const [customItemName, setCustomItemName] = useState('');
  const [customItemPrice, setCustomItemPrice] = useState('');

  // Client au ticket (Comptoir ou Nominatif)
  const [isCustomerPickerModalOpen, setIsCustomerPickerModalOpen] = useState(false);
  const [activeCustomerName, setActiveCustomerName] = useState('Client Comptoir');

  // Modes de Service Restaurant (Sur Place, À Emporter, Livraison)
  const [orderType, setOrderType] = useState<'SUR_PLACE' | 'A_EMPORTER' | 'LIVRAISON'>('SUR_PLACE');
  const [activeTable, setActiveTable] = useState<string>(selectedTable || 'Table 1');
  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Tevragh-Zeina, Nouakchott');
  const [deliveryPhone, setDeliveryPhone] = useState<string>('');
  const [deliveryFee, setDeliveryFee] = useState<number>(50);

  // Notes de cuisson & modificateurs d'articles
  const [editingItemNoteIndex, setEditingItemNoteIndex] = useState<number | null>(null);
  const [itemNoteText, setItemNoteText] = useState<string>('');

  // Division de l'addition (Split Bill)
  const [isSplitModalOpen, setIsSplitModalOpen] = useState<boolean>(false);
  const [splitCount, setSplitCount] = useState<number>(2);

  // Pré-Addition (Note de Table Proforma)
  const [isProformaModalOpen, setIsProformaModalOpen] = useState<boolean>(false);

  // Couverts (Nombre de personnes en salle)
  const [coversCount, setCoversCount] = useState<number>(2);

  // Menu Clôtures & Rapports
  const [isReportMenuOpen, setIsReportMenuOpen] = useState<boolean>(false);

  // Modificateurs de plats & Cuisson (Toast POS style)
  const [customizingProduct, setCustomizingProduct] = useState<Product | null>(null);
  const [modCuisson, setModCuisson] = useState<string>('À point');
  const [modAccompagnement, setModAccompagnement] = useState<string>('Riz Maison');
  const [modPiment, setModPiment] = useState<string>('Piment vert à part');
  const [modSupplements, setModSupplements] = useState<string[]>([]);
  const [modSpecialNote, setModSpecialNote] = useState<string>('');

  // Message d'envoi KDS
  const [kdsToast, setKdsToast] = useState<string | null>(null);

  useEffect(() => {
    if (selectedTable) {
      setActiveTable(selectedTable);
    }
  }, [selectedTable]);

  useEffect(() => {
    const fetchCustomersAndMovements = async () => {
      try {
        const custData = await getKridiCustomersApi();
        if (custData && custData.customers) {
          setKridiCustomers(custData.customers);
        }
      } catch {
        // Fallback local
      }

      try {
        const movData = await getCashMovementsApi();
        if (movData && movData.cashMovements && movData.cashMovements.length > 0) {
          setDrawerMovements(movData.cashMovements);
        }
      } catch {
        // Fallback local
      }
    };
    fetchCustomersAndMovements();
  }, []);

  // Filtrer les produits selon le secteur courant
  const sectorProducts = products.filter(p => p.sector === sector);

  // Catégories uniques
  const categories = ['all', ...Array.from(new Set(sectorProducts.map(p => p.category)))];

  // Marques uniques
  const brands = ['all', ...Array.from(new Set(sectorProducts.map(p => p.brand).filter(Boolean))) as string[]];

  // Filtrage combiné recherche + catégorie + marque + sans code-barres
  const filteredProducts = sectorProducts.filter(p => {
    if (showOnlyNoBarcode && !p.hasNoBarcode) return false;
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchBrand = selectedBrand === 'all' || p.brand === selectedBrand;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.nameAr && p.nameAr.includes(searchQuery));
    return matchCategory && matchBrand && matchSearch;
  });

  // Soumission scanner code-barres (douchette USB / sans fil)
  const handleBarcodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    const clean = searchQuery.trim();
    const match = sectorProducts.find(p => p.barcode === clean || p.barcode.endsWith(clean));
    if (match) {
      handleProductClick(match);
      setSearchQuery('');
    }
  };

  // Ajout au panier
  const handleProductClick = (product: Product) => {
    if (product.isWeighted) {
      setWeighingProduct(product);
      setScaleWeight(1.25);
      setScaleTare(0);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id && !item.notes);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id && !item.notes
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  // Ajout d'un article libre / non répertorié au ticket
  const handleAddCustomItem = (e: React.FormEvent) => {
    e.preventDefault();
    const priceNum = parseFloat(customItemPrice);
    if (!customItemName.trim() || isNaN(priceNum) || priceNum <= 0) return;

    const customProduct: Product = {
      id: `custom-${Date.now()}`,
      name: customItemName.trim(),
      nameAr: 'مادة حرة',
      category: 'Divers',
      price: priceNum,
      costPrice: Math.round(priceNum * 0.7),
      barcode: `DIV-${Date.now().toString().slice(-6)}`,
      sector: sector,
      stock: 999,
      image: 'divers',
      hasNoBarcode: true
    };

    setCart(prev => [...prev, { product: customProduct, quantity: 1 }]);
    setIsCustomItemModalOpen(false);
    setCustomItemName('');
    setCustomItemPrice('');
  };

  // Enregistrement d'un mouvement de caisse
  const handleRecordCashMovement = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(drawerAmount);
    if (isNaN(amt) || amt <= 0) return;

    const payload = {
      type: drawerType,
      amount: amt,
      reason: drawerReason.trim() || (drawerType === 'FLOAT_OPEN' ? 'Fond de caisse initial' : (drawerType === 'IN' ? 'Entrée de caisse' : 'Sortie dépense')),
      cashierName: 'Sidi Mohamed (Patron)'
    };

    try {
      const res = await createCashMovementApi(payload);
      if (res && res.movement) {
        setDrawerMovements(prev => [res.movement, ...prev]);
      }
    } catch {
      const localMov = {
        id: `cm-${Date.now()}`,
        type: payload.type,
        amount: payload.amount,
        reason: payload.reason,
        cashierName: payload.cashierName,
        createdAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setDrawerMovements(prev => [localMov, ...prev]);
    }

    setDrawerAmount('');
    setDrawerReason('');
  };

  const handleAddWeightedItem = () => {
    if (!weighingProduct) return;
    const effectiveWeight = Math.max(0.05, scaleWeight - scaleTare);
    setCart(prev => {
      return [...prev, { product: weighingProduct, quantity: 1, weightInKg: effectiveWeight }];
    });
    setWeighingProduct(null);
  };

  const updateQuantity = (index: number, delta: number) => {
    setCart(prev => {
      return prev.map((item, idx) => {
        if (idx === index) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeItem = (index: number) => {
    setCart(prev => prev.filter((_, idx) => idx !== index));
  };

  const clearCart = () => {
    setCart([]);
    setCashGiven(0);
    setActiveCustomerName('Client Comptoir');
  };

  // Sauvegarder la note d'un article
  const handleSaveItemNote = (index: number) => {
    setCart(prev => prev.map((it, idx) => idx === index ? { ...it, notes: itemNoteText.trim() || undefined } : it));
    setEditingItemNoteIndex(null);
    setItemNoteText('');
  };

  // Calculs financiers (en MRU)
  const subtotal = cart.reduce((sum, item) => {
    if (item.weightInKg) {
      return sum + (item.product.price * item.weightInKg);
    }
    return sum + (item.product.price * item.quantity);
  }, 0);

  const discountAmount = (subtotal * discountPercent) / 100;
  const deliverySurcharge = (sector === 'restaurant' && orderType === 'LIVRAISON') ? deliveryFee : 0;
  const total = Math.max(0, subtotal - discountAmount + deliverySurcharge);
  const changeDue = cashGiven > total ? cashGiven - total : 0;

  // Calcul du solde théorique actuel du tiroir-caisse
  const currentDrawerCash = drawerMovements.reduce((sum, m) => {
    if (m.type === 'FLOAT_OPEN' || m.type === 'IN') return sum + m.amount;
    if (m.type === 'OUT') return sum - m.amount;
    return sum;
  }, 0);

  // Mise en attente du ticket (Hold)
  const handleHoldTicket = () => {
    if (cart.length === 0) return;
    const newHold: HeldTicket = {
      id: `ATT-${Math.floor(100 + Math.random() * 900)}`,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      items: [...cart],
      subtotal: total,
      table: sector === 'restaurant' && orderType === 'SUR_PLACE' ? activeTable : null,
      orderType
    };
    setHeldTickets(prev => [newHold, ...prev]);
    clearCart();
    if (onClearTable) onClearTable();
  };

  // Reprise d'un ticket suspendu
  const handleResumeTicket = (held: HeldTicket) => {
    setCart(held.items);
    if (held.table) setActiveTable(held.table);
    if (held.orderType) setOrderType(held.orderType);
    setHeldTickets(prev => prev.filter(t => t.id !== held.id));
    setIsHeldModalOpen(false);
  };

  // Envoi de commande vers l'écran de cuisine KDS
  const handleSendToKds = () => {
    if (cart.length === 0) return;
    const destination = orderType === 'SUR_PLACE' ? activeTable : (orderType === 'A_EMPORTER' ? 'À Emporter' : 'Livraison');
    setKdsToast(`✅ Bon envoyé en cuisine KDS pour ${destination} (${cart.length} plats)`);
    setTimeout(() => {
      setKdsToast(null);
    }, 4000);
  };

  // Calculatrice logique
  const handleCalcPress = (btn: string) => {
    if (btn === 'C') {
      setCalcInput('0');
    } else if (btn === '=') {
      try {
        const sanitized = calcInput.replace(/[^0-9+\-*/.]/g, '').replace('×', '*').replace('÷', '/');
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const res = Function(`"use strict"; return (${sanitized})`)();
        setCalcInput(String(res));
      } catch {
        setCalcInput('Erreur');
      }
    } else {
      if (calcInput === '0' || calcInput === 'Erreur') {
        setCalcInput(btn);
      } else {
        setCalcInput(prev => prev + btn);
      }
    }
  };

  // Finalisation de commande (Mauritanie: ESPECES, BANKILY, MASRVI, KRIDI)
  const handleCheckout = (
    paymentMethod: 'ESPECES' | 'BANKILY' | 'MASRVI' | 'KRIDI' | 'CARTE',
    customer?: KridiCustomer,
    paymentRef?: string
  ) => {
    if (cart.length === 0) return;

    const orderId = `CMD-${Math.floor(10000 + Math.random() * 90000)}`;
    const finalCustomerName = customer ? customer.name : (activeCustomerName !== 'Client Comptoir' ? activeCustomerName : undefined);

    const orderData = {
      orderId,
      items: [...cart],
      subtotal,
      discountPercent,
      discountAmount,
      deliveryFee: deliverySurcharge,
      total,
      paymentMethod,
      paymentReference: paymentRef,
      cashGiven: paymentMethod === 'ESPECES' ? (cashGiven || total) : undefined,
      changeDue: paymentMethod === 'ESPECES' ? (cashGiven > total ? cashGiven - total : 0) : 0,
      customerName: finalCustomerName,
      customerId: customer ? customer.id : undefined,
      tableNumber: sector === 'restaurant' && orderType === 'SUR_PLACE' ? activeTable : undefined,
      orderType,
      deliveryAddress: orderType === 'LIVRAISON' ? deliveryAddress : undefined,
      deliveryPhone: orderType === 'LIVRAISON' ? deliveryPhone : undefined,
      splitCount: isSplitModalOpen ? splitCount : 1,
      date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    onOrderSuccess(orderData);
    setCompletedOrder(orderData);
    setIsBankilyModalOpen(false);
    setIsKridiModalOpen(false);
    setIsSplitModalOpen(false);
  };

  // Clôture Z Report (Définitive)
  const handleOpenZReport = async () => {
    try {
      const data = await getDailyZReportApi();
      setZReportData(data.report || data);
    } catch {
      setZReportData({
        date: new Date().toLocaleDateString('fr-TN'),
        tenantName: 'Caissa.mr Mauritanie - Station Centrale',
        city: 'Tevragh-Zeina, Nouakchott',
        nif: 'NIF 12048592/RIM',
        totalSales: 24850,
        ordersCount: 68,
        totalCash: 12400,
        totalBankily: 8200,
        totalMasrvi: 2750,
        totalKridi: 1500,
        averageTicket: 365.44,
        totalDiscounts: 350,
        generatedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      });
    }
    setIsZReportModalOpen(true);
  };

  // Rapport X (Intermédiaire en cours de journée)
  const handleOpenXReport = async () => {
    try {
      const data = await getDailyZReportApi();
      setXReportData(data.report || data);
    } catch {
      setXReportData({
        date: new Date().toLocaleDateString('fr-TN'),
        tenantName: 'Caissa.mr Mauritanie - Station Centrale',
        city: 'Tevragh-Zeina, Nouakchott',
        totalSales: 16420,
        ordersCount: 42,
        totalCash: 8500,
        totalBankily: 5200,
        totalMasrvi: 1800,
        totalKridi: 920,
        averageTicket: 390.95,
        totalDiscounts: 180,
        generatedAt: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      });
    }
    setIsXReportModalOpen(true);
  };

  // Visual helper for product cards with real culinary photography (Toast / Lightspeed style)
  const RESTAURANT_FOOD_IMAGES: Record<string, string> = {
    thieb: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
    ceebu_yapp: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
    couscous: 'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=400&q=80',
    chwaya_agneau: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
    chwaya_chameau: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&w=400&q=80',
    brochettes: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=400&q=80',
    poulet_roti: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?auto=format&fit=crop&w=400&q=80',
    poulet_braise: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80',
    chawarma: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?auto=format&fit=crop&w=400&q=80',
    burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    panini: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80',
    pizza_margherita: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80',
    pizza_viande: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80',
    atay: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=400&q=80',
    cafe_touba: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=400&q=80',
    expresso: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=400&q=80',
    jus_bissap: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=400&q=80',
    jus_bouye: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=400&q=80',
    eau_minerale: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?auto=format&fit=crop&w=400&q=80'
  };

  const openModifierModal = (product: Product) => {
    setCustomizingProduct(product);
    setModCuisson(product.category.includes('Grillades') || product.name.includes('Burger') ? 'À point' : 'Standard');
    setModAccompagnement('Riz Maison');
    setModPiment('Piment vert à part');
    setModSupplements([]);
    setModSpecialNote('');
  };

  const handleConfirmModifiers = () => {
    if (!customizingProduct) return;

    let extraPrice = 0;
    if (modSupplements.includes('Double Viande (+60 MRU)')) extraPrice += 60;
    if (modSupplements.includes('Fromage Fondu (+20 MRU)')) extraPrice += 20;
    if (modSupplements.includes('Œuf Frit (+10 MRU)')) extraPrice += 10;
    if (modSupplements.includes('Frites Extra (+30 MRU)')) extraPrice += 30;

    const parts: string[] = [];
    if (modCuisson && modCuisson !== 'Standard') parts.push(`Cuisson: ${modCuisson}`);
    if (modAccompagnement && modAccompagnement !== 'Sans') parts.push(modAccompagnement);
    if (modPiment) parts.push(modPiment);
    if (modSupplements.length > 0) parts.push(`Extra: ${modSupplements.join(', ')}`);
    if (modSpecialNote.trim()) parts.push(modSpecialNote.trim());

    const noteString = parts.join(' • ');

    const itemToAdd: Product = extraPrice > 0 
      ? { ...customizingProduct, price: customizingProduct.price + extraPrice }
      : customizingProduct;

    setCart(prev => [...prev, { product: itemToAdd, quantity: 1, notes: noteString }]);
    setCustomizingProduct(null);
  };

  const renderProductVisual = (p: Product) => {
    // Si secteur restaurant et image culinaire disponible OU image est une URL HTTP
    if ((sector === 'restaurant' && RESTAURANT_FOOD_IMAGES[p.image]) || p.image?.startsWith('http')) {
      return (
        <div style={{
          height: '104px',
          borderRadius: '8px',
          overflow: 'hidden',
          position: 'relative',
          marginBottom: '8px',
          background: 'linear-gradient(135deg, #1e293b, #0f172a)'
        }}>
          <img
            src={p.image?.startsWith('http') ? p.image : RESTAURANT_FOOD_IMAGES[p.image]}
            alt={p.name}
            loading="lazy"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: 'block'
            }}
            onError={(e) => {
              (e.currentTarget as HTMLElement).style.display = 'none';
            }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%)',
            pointerEvents: 'none'
          }} />
          <span style={{
            position: 'absolute',
            bottom: '6px',
            left: '6px',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            color: '#f8fafc',
            fontSize: '0.62rem',
            fontWeight: 700,
            padding: '2px 7px',
            borderRadius: '4px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            textTransform: 'uppercase',
            letterSpacing: '0.03em'
          }}>
            {p.category}
          </span>
        </div>
      );
    }

    // Fallback tuile professionnelle (Boutique ou Image absente)
    let icon = <ShoppingBag size={24} color="#0284c7" />;
    let badgeText = p.brand || p.category;
    let badgeColor = '#0284c7';
    let bg = 'rgba(2, 132, 199, 0.08)';
    let border = '1px solid rgba(2, 132, 199, 0.2)';

    if (p.category === 'Plats Traditionnels' || p.category === 'Plats & Volailles') {
      icon = <Utensils size={24} color="#b45309" />;
      badgeColor = '#b45309';
      bg = 'rgba(180, 83, 9, 0.08)';
      border = '1px solid rgba(180, 83, 9, 0.2)';
    } else if (p.category === 'Grillades & Chwaya') {
      icon = <Flame size={24} color="#c2410c" />;
      badgeColor = '#c2410c';
      bg = 'rgba(194, 65, 12, 0.08)';
      border = '1px solid rgba(194, 65, 12, 0.2)';
    } else if (p.category === 'Sandwiches & Fast-Food' || p.category === 'Pizzas') {
      icon = <UtensilsCrossed size={24} color="#d97706" />;
      badgeColor = '#d97706';
      bg = 'rgba(217, 119, 6, 0.08)';
      border = '1px solid rgba(217, 119, 6, 0.2)';
    } else if (p.category.includes('Boissons') || p.category.includes('Jus') || p.category.includes('Eaux')) {
      icon = <Coffee size={24} color="#059669" />;
      badgeColor = '#059669';
      bg = 'rgba(5, 150, 105, 0.08)';
      border = '1px solid rgba(5, 150, 105, 0.2)';
    }

    return (
      <div style={{
        height: '74px',
        borderRadius: '8px',
        background: bg,
        border: border,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '4px',
        marginBottom: '8px',
        position: 'relative'
      }}>
        {icon}
        <span style={{
          fontSize: '0.62rem',
          fontWeight: 700,
          color: badgeColor,
          textTransform: 'uppercase',
          letterSpacing: '0.04em'
        }}>
          {badgeText}
        </span>
      </div>
    );
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 440px',
      gap: '14px',
      padding: '0 16px 16px 16px',
      height: 'calc(100vh - 84px)',
      boxSizing: 'border-box'
    }}>
      {/* Toast Notification KDS */}
      {kdsToast && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: '#047857',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: '8px',
          fontWeight: 700,
          fontSize: '0.85rem',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ChefHat size={16} />
          <span>{kdsToast}</span>
        </div>
      )}

      {/* LEFT: Product Catalog & Fast Grid (Like Caissa.tn POS) */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', overflow: 'hidden' }}>
        {/* Top Filter Bar: Search, Category Dropdown, Brand Dropdown & Utilities */}
        <div className="glass-panel" style={{
          padding: '8px 12px',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          borderRadius: '8px'
        }}>
          {/* Barcode / Product Search Form */}
          <form onSubmit={handleBarcodeSubmit} style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder={sector === 'restaurant' ? "Rechercher un plat (Thieb, Chwaya, Café...)" : "Scanner un code-barre ou rechercher un article..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 10px 7px 32px',
                borderRadius: '6px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-main)',
                fontSize: '0.82rem',
                outline: 'none'
              }}
            />
          </form>

          {/* Quick Category Dropdown */}
          <div style={{ position: 'relative' }}>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                padding: '7px 24px 7px 10px',
                borderRadius: '6px',
                background: 'var(--bg-tertiary)',
                border: '1px solid var(--border-glass)',
                color: 'var(--text-main)',
                fontSize: '0.78rem',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none'
              }}
            >
              <option value="all">Catégories (Toutes)</option>
              {categories.filter(c => c !== 'all').map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <ChevronDown size={13} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-dim)' }} />
          </div>

          {/* Quick Brand Dropdown (Only for Market/Boutique) */}
          {sector === 'market' && brands.length > 2 && (
            <div style={{ position: 'relative' }}>
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                style={{
                  padding: '7px 24px 7px 10px',
                  borderRadius: '6px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                  appearance: 'none'
                }}
              >
                <option value="all">Marques (Toutes)</option>
                {brands.filter(b => b !== 'all').map(br => (
                  <option key={br} value={br}>{br}</option>
                ))}
              </select>
              <ChevronDown size={13} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: 'var(--text-dim)' }} />
            </div>
          )}

          {/* Bouton Sans Code-Barres (Uniquement en mode Boutique) */}
          {sector === 'market' && (
            <button
              onClick={() => setShowOnlyNoBarcode(!showOnlyNoBarcode)}
              className="btn-secondary"
              style={{
                padding: '6px 10px',
                fontSize: '0.75rem',
                borderColor: showOnlyNoBarcode ? 'var(--accent-primary)' : 'var(--border-glass)',
                background: showOnlyNoBarcode ? 'rgba(5, 150, 105, 0.15)' : 'transparent',
                color: showOnlyNoBarcode ? 'var(--accent-primary)' : 'var(--text-main)',
                fontWeight: 700
              }}
              title="Filtrer les articles vendus sans code-barres (pain, recharges, sacs, vrac)"
            >
              <Barcode size={14} />
              <span>Sans Code-Barres</span>
            </button>
          )}

          {/* Article Libre */}
          <button
            onClick={() => setIsCustomItemModalOpen(true)}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#059669', borderColor: 'rgba(5, 150, 105, 0.3)' }}
            title="Ajouter un article divers ou montant libre au ticket"
          >
            <Plus size={13} />
            <span>Article Libre</span>
          </button>

          {/* Mouvements de Caisse & Fond */}
          <button
            onClick={() => setIsCashDrawerModalOpen(true)}
            className="btn-secondary"
            style={{ padding: '6px 10px', fontSize: '0.75rem', color: '#d97706', borderColor: 'rgba(217, 119, 6, 0.3)' }}
            title="Gérer le tiroir-caisse : fond d'ouverture, dépenses et entrées"
          >
            <Coins size={13} />
            <span>Caisse</span>
          </button>

          {/* Douchette Scanner Shortcut (Seulement en Boutique) */}
          {sector === 'market' && (
            <button
              className="btn-secondary"
              title="Scan simulation douchette"
              onClick={() => {
                const random = sectorProducts[Math.floor(Math.random() * sectorProducts.length)];
                handleProductClick(random);
              }}
              style={{ padding: '6px 10px', fontSize: '0.75rem' }}
            >
              <Barcode size={13} />
              <span>Douchette</span>
            </button>
          )}

          {/* Calculatrice Toggle */}
          <button
            onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
            className="btn-secondary"
            style={{
              padding: '6px 10px',
              fontSize: '0.75rem',
              borderColor: isCalculatorOpen ? 'var(--accent-primary)' : 'var(--border-glass)'
            }}
            title="Calculatrice tactile"
          >
            <Calculator size={13} />
          </button>

          {/* Clôture & Rapports Dropdown */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setIsReportMenuOpen(!isReportMenuOpen)}
              className="btn-secondary"
              style={{
                padding: '6px 10px',
                fontSize: '0.75rem',
                borderColor: '#d97706',
                color: '#d97706',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '5px'
              }}
              title="Clôtures de caisse et rapports fiscaux"
            >
              <FileSpreadsheet size={13} />
              <span>Clôture & Rapports</span>
              <ChevronDown size={11} style={{ transform: isReportMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>

            {isReportMenuOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                right: 0,
                zIndex: 100,
                background: 'var(--bg-secondary)',
                border: '1px solid var(--border-glass)',
                borderRadius: '8px',
                padding: '6px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                minWidth: '200px',
                display: 'flex',
                flexDirection: 'column',
                gap: '2px'
              }}>
                <button
                  onClick={() => { handleOpenXReport(); setIsReportMenuOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '5px',
                    border: 'none',
                    background: 'transparent',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FileText size={14} color="#64748b" />
                  <div>
                    <div style={{ fontWeight: 600 }}>Rapport X (Intermédiaire)</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Contrôle partiel sans clôture</div>
                  </div>
                </button>

                <button
                  onClick={() => { handleOpenZReport(); setIsReportMenuOpen(false); }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '8px 10px',
                    borderRadius: '5px',
                    border: 'none',
                    background: 'rgba(217, 119, 6, 0.1)',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                    color: '#d97706',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <FileSpreadsheet size={14} color="#d97706" />
                  <div>
                    <div style={{ fontWeight: 800 }}>Rapport Z (Clôture Définitive)</div>
                    <div style={{ fontSize: '0.65rem', color: '#b45309' }}>Remise à zéro journalière</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Category Pills Strip */}
        <div style={{
          display: 'flex',
          gap: '6px',
          overflowX: 'auto',
          paddingBottom: '2px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setSelectedCategory(cat); setShowOnlyNoBarcode(false); }}
              style={{
                padding: '6px 14px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: selectedCategory === cat && !showOnlyNoBarcode ? '#047857' : 'var(--border-glass)',
                background: selectedCategory === cat && !showOnlyNoBarcode ? '#059669' : 'var(--bg-card)',
                color: selectedCategory === cat && !showOnlyNoBarcode ? '#ffffff' : 'var(--text-muted)',
                fontWeight: selectedCategory === cat && !showOnlyNoBarcode ? 700 : 500,
                fontSize: '0.78rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease'
              }}
            >
              {cat === 'all' ? 'Tout le catalogue' : cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '12px',
          paddingRight: '4px'
        }}>
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="glass-panel glass-panel-hover"
              style={{
                padding: '12px',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
                userSelect: 'none',
                borderRadius: '10px'
              }}
            >
              {product.isWeighted && (
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: 'rgba(6, 182, 212, 0.15)',
                  color: 'var(--accent-cyan)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  borderRadius: '999px',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  padding: '2px 6px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  zIndex: 2
                }}>
                  <Scale size={10} /> Pesée / Kg
                </span>
              )}

              {product.hasNoBarcode && (
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  left: '8px',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-dim)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '4px',
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  padding: '1px 5px',
                  zIndex: 2
                }}>
                  Vrac
                </span>
              )}

              {/* Product Visual */}
              {renderProductVisual(product)}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                <div style={{
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  lineHeight: '1.25',
                  color: 'var(--text-main)',
                  minHeight: '2.4em'
                }}>
                  {product.name}
                </div>

                {product.nameAr && (
                  <div style={{
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    color: 'var(--text-muted)',
                    direction: 'rtl',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontFamily: "'Cairo', 'Amiri', 'Segoe UI', Tahoma, sans-serif"
                  }}>
                    {product.nameAr}
                  </div>
                )}

                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  paddingTop: '6px',
                  marginTop: '4px',
                  borderTop: '1px solid var(--border-glass)'
                }}>
                  <span style={{
                    fontWeight: 900,
                    fontSize: '1.2rem',
                    color: '#059669',
                    fontVariantNumeric: 'tabular-nums'
                  }}>
                    {product.price} <small style={{ fontSize: '0.72rem', color: 'var(--text-dim)', fontWeight: 600 }}>MRU</small>
                  </span>

                  {sector === 'restaurant' ? (
                    <span style={{
                      fontSize: '0.66rem',
                      fontWeight: 700,
                      color: product.stock <= 10 ? '#ea580c' : '#10b981',
                      background: product.stock <= 10 ? 'rgba(234, 88, 12, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                      border: `1px solid ${product.stock <= 10 ? 'rgba(234, 88, 12, 0.25)' : 'rgba(16, 185, 129, 0.25)'}`,
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      {product.stock <= 10 ? `Reste ${product.stock}` : '● Disponible'}
                    </span>
                  ) : (
                    <span style={{
                      fontSize: '0.68rem',
                      color: product.stock < 30 ? 'var(--accent-amber)' : 'var(--text-dim)',
                      background: 'var(--bg-tertiary)',
                      padding: '2px 6px',
                      borderRadius: '4px'
                    }}>
                      Stock: {product.stock}
                    </span>
                  )}
                </div>

                {/* Option / Cuisson Button for Restaurant Dishes */}
                {sector === 'restaurant' && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openModifierModal(product);
                    }}
                    style={{
                      marginTop: '6px',
                      width: '100%',
                      padding: '4px 6px',
                      borderRadius: '6px',
                      border: '1px dashed rgba(5, 150, 105, 0.4)',
                      background: 'rgba(5, 150, 105, 0.05)',
                      color: '#059669',
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      transition: 'background 0.15s ease'
                    }}
                    title="Personnaliser : cuisson, accompagnement, piment et suppléments"
                  >
                    <SlidersHorizontal size={11} />
                    <span>Options & Cuisson</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Live POS Cart & Checkout Panel */}
      <div className="glass-panel" style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
        borderRadius: '12px'
      }}>
        {/* Cart Top Header with Customer Selector */}
        <div style={{
          padding: '12px 14px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800 }}>Ticket en cours</h3>
              {cart.length > 0 && (
                <span style={{
                  background: 'var(--accent-primary)',
                  color: '#fff',
                  borderRadius: '999px',
                  padding: '1px 6px',
                  fontSize: '0.7rem',
                  fontWeight: 800
                }}>
                  {cart.length}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                Caisse N°1 • Tevragh-Zeina •
              </span>
              <button
                onClick={() => setIsCustomerPickerModalOpen(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-main)',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                  padding: 0,
                  textDecoration: 'underline',
                  textUnderlineOffset: '2px'
                }}
                title="Changer le client rattaché au ticket"
              >
                <span>{activeCustomerName}</span>
                <ChevronDown size={11} />
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {heldTickets.length > 0 && (
              <button
                onClick={() => setIsHeldModalOpen(true)}
                style={{
                  background: 'rgba(245, 158, 11, 0.2)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: 'var(--accent-amber)',
                  borderRadius: '6px',
                  padding: '4px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <PlayCircle size={13} /> ({heldTickets.length})
              </button>
            )}

            {cart.length > 0 && (
              <>
                <button
                  onClick={handleHoldTicket}
                  className="btn-secondary"
                  style={{ padding: '4px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                  title="Suspendre le ticket"
                >
                  <PauseCircle size={13} color="var(--accent-amber)" /> Attente
                </button>
                <button
                  onClick={clearCart}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--accent-rose)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  title="Vider le panier"
                >
                  <Trash2 size={15} />
                </button>
              </>
            )}
          </div>
        </div>

        {/* RESTAURATION MODE: Service Types Bar */}
        {sector === 'restaurant' && (
          <div style={{
            padding: '8px 12px',
            background: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* 3 Service Type Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
              <button
                onClick={() => setOrderType('SUR_PLACE')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '6px 4px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: orderType === 'SUR_PLACE' ? '#047857' : 'var(--border-glass)',
                  background: orderType === 'SUR_PLACE' ? '#059669' : 'var(--bg-card)',
                  color: orderType === 'SUR_PLACE' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Utensils size={13} />
                <span>Sur Place</span>
              </button>

              <button
                onClick={() => setOrderType('A_EMPORTER')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '6px 4px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: orderType === 'A_EMPORTER' ? '#047857' : 'var(--border-glass)',
                  background: orderType === 'A_EMPORTER' ? '#059669' : 'var(--bg-card)',
                  color: orderType === 'A_EMPORTER' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <ShoppingBag size={13} />
                <span>À Emporter</span>
              </button>

              <button
                onClick={() => setOrderType('LIVRAISON')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '6px 4px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: orderType === 'LIVRAISON' ? '#047857' : 'var(--border-glass)',
                  background: orderType === 'LIVRAISON' ? '#059669' : 'var(--bg-card)',
                  color: orderType === 'LIVRAISON' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Bike size={13} />
                <span>Livraison</span>
              </button>
            </div>

            {/* Service Type Details Bar */}
            {orderType === 'SUR_PLACE' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                  {/* Table Selector */}
                  <button
                    onClick={() => setIsTableModalOpen(true)}
                    style={{
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '6px',
                      padding: '5px 10px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: 'var(--text-main)',
                      cursor: 'pointer'
                    }}
                  >
                    <Utensils size={13} color="var(--accent-primary)" />
                    <span>{activeTable}</span>
                    <ChevronDown size={12} color="var(--text-dim)" />
                  </button>

                  {/* Actions KDS / Addition / Split */}
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button
                      onClick={handleSendToKds}
                      disabled={cart.length === 0}
                      className="btn-secondary"
                      style={{ padding: '5px 9px', fontSize: '0.72rem', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.3)', fontWeight: 700 }}
                      title="Envoyer les plats en cuisine KDS"
                    >
                      <ChefHat size={13} /> KDS
                    </button>

                    <button
                      onClick={() => setIsProformaModalOpen(true)}
                      disabled={cart.length === 0}
                      className="btn-secondary"
                      style={{ padding: '5px 9px', fontSize: '0.72rem' }}
                      title="Imprimer note / addition provisoire pour le client"
                    >
                      <FileText size={13} /> Addition
                    </button>

                    <button
                      onClick={() => setIsSplitModalOpen(true)}
                      disabled={cart.length === 0}
                      className="btn-secondary"
                      style={{ padding: '5px 9px', fontSize: '0.72rem' }}
                      title="Diviser l'addition entre plusieurs personnes"
                    >
                      <Split size={13} /> Split
                    </button>
                  </div>
                </div>

                {/* Couverts (Nombre de convives assis) */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '4px 8px',
                  borderRadius: '6px',
                  background: 'var(--bg-glass)',
                  border: '1px solid var(--border-glass)',
                  fontSize: '0.74rem'
                }}>
                  <span style={{ color: 'var(--text-dim)', fontWeight: 600 }}>👥 Couverts en salle :</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setCoversCount(Math.max(1, coversCount - 1))}
                      style={{
                        border: '1px solid var(--border-glass)',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '4px',
                        padding: '1px 6px',
                        cursor: 'pointer',
                        color: 'var(--text-main)',
                        fontWeight: 700
                      }}
                    >
                      -
                    </button>
                    <span style={{ fontWeight: 800, minWidth: '16px', textAlign: 'center' }}>
                      {coversCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setCoversCount(coversCount + 1)}
                      style={{
                        border: '1px solid var(--border-glass)',
                        background: 'var(--bg-tertiary)',
                        borderRadius: '4px',
                        padding: '1px 6px',
                        cursor: 'pointer',
                        color: 'var(--text-main)',
                        fontWeight: 700
                      }}
                    >
                      +
                    </button>
                    {total > 0 && (
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginLeft: '4px' }}>
                        ({(total / Math.max(1, coversCount)).toFixed(0)} MRU/p.)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {orderType === 'LIVRAISON' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Phone size={12} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input
                      type="text"
                      placeholder="Tél: +222 22 14 55 88"
                      value={deliveryPhone}
                      onChange={(e) => setDeliveryPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '4px 6px 4px 26px',
                        borderRadius: '4px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-glass)',
                        color: 'var(--text-main)',
                        fontSize: '0.75rem'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Frais:</span>
                    <input
                      type="number"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(Number(e.target.value))}
                      style={{
                        width: '50px',
                        padding: '4px',
                        borderRadius: '4px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-glass)',
                        color: '#16a34a',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textAlign: 'center'
                      }}
                    />
                    <span>MRU</span>
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <MapPin size={12} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input
                    type="text"
                    placeholder="Adresse: Tevragh-Zeina, Nouakchott"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '4px 6px 4px 26px',
                      borderRadius: '4px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-main)',
                      fontSize: '0.75rem'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* MARKET & BOUTIQUE & PESÉE MODE: Quick Action Header */}
        {sector === 'market' && (
          <div style={{
            padding: '8px 12px',
            background: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* 3 Service Type Buttons: Vente Comptoir, Commande Réserve, Livraison */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px' }}>
              <button
                type="button"
                onClick={() => setOrderType('SUR_PLACE')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '6px 4px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: orderType === 'SUR_PLACE' ? '#047857' : 'var(--border-glass)',
                  background: orderType === 'SUR_PLACE' ? '#059669' : 'var(--bg-card)',
                  color: orderType === 'SUR_PLACE' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <ShoppingBag size={13} />
                <span>Comptoir</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('A_EMPORTER')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '6px 4px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: orderType === 'A_EMPORTER' ? '#047857' : 'var(--border-glass)',
                  background: orderType === 'A_EMPORTER' ? '#059669' : 'var(--bg-card)',
                  color: orderType === 'A_EMPORTER' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Package size={13} />
                <span>Réserve</span>
              </button>

              <button
                type="button"
                onClick={() => setOrderType('LIVRAISON')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  padding: '6px 4px',
                  borderRadius: '6px',
                  border: '1px solid',
                  borderColor: orderType === 'LIVRAISON' ? '#047857' : 'var(--border-glass)',
                  background: orderType === 'LIVRAISON' ? '#059669' : 'var(--bg-card)',
                  color: orderType === 'LIVRAISON' ? '#ffffff' : 'var(--text-muted)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <Bike size={13} />
                <span>Livraison</span>
              </button>
            </div>

            {/* Quick Actions Bar for Market: Kridi / Balance Pesée / Article Libre */}
            <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
              <button
                type="button"
                onClick={() => setIsKridiModalOpen(true)}
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: selectedKridiCustomer ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
                  border: `1px solid ${selectedKridiCustomer ? '#10b981' : 'var(--border-glass)'}`,
                  color: selectedKridiCustomer ? '#10b981' : 'var(--text-main)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Rattacher un compte carnet de crédit client (الكريدي)"
              >
                <BookOpen size={12} />
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {selectedKridiCustomer ? `الكريدي: ${selectedKridiCustomer.name}` : 'الكريدي (Crédit Client)'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setIsCustomItemModalOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
                title="Ajouter un article hors catalogue / montant libre"
              >
                <Plus size={12} color="#059669" />
                <span>Article Libre</span>
              </button>
            </div>

            {/* Delivery address & phone if delivery selected */}
            {orderType === 'LIVRAISON' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Phone size={12} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                    <input
                      type="text"
                      placeholder="Tél client: +222 22 14 55 88"
                      value={deliveryPhone}
                      onChange={(e) => setDeliveryPhone(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '4px 6px 4px 26px',
                        borderRadius: '4px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-glass)',
                        color: 'var(--text-main)',
                        fontSize: '0.75rem'
                      }}
                    />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: 'var(--text-dim)' }}>Frais:</span>
                    <input
                      type="number"
                      value={deliveryFee}
                      onChange={(e) => setDeliveryFee(Number(e.target.value))}
                      style={{
                        width: '50px',
                        padding: '4px',
                        borderRadius: '4px',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border-glass)',
                        color: '#16a34a',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        textAlign: 'center'
                      }}
                    />
                    <span>MRU</span>
                  </div>
                </div>
                <div style={{ position: 'relative' }}>
                  <MapPin size={12} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
                  <input
                    type="text"
                    placeholder="Adresse: Tevragh-Zeina / Ksar / Sebkha..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '4px 6px 4px 26px',
                      borderRadius: '4px',
                      background: 'var(--bg-card)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-main)',
                      fontSize: '0.75rem'
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cart Items List */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '6px'
        }}>
          {cart.length === 0 ? (
            <div style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-dim)',
              textAlign: 'center',
              padding: '20px'
            }}>
              <ShoppingBag size={40} style={{ opacity: 0.3, marginBottom: '10px' }} />
              <p style={{ fontWeight: 700, color: 'var(--text-muted)', fontSize: '0.9rem' }}>Ticket vide</p>
              <p style={{ fontSize: '0.78rem', marginTop: '4px', maxWidth: '240px' }}>
                {sector === 'restaurant'
                  ? "Sélectionnez des plats pour ouvrir la note de table."
                  : "Scannez un code-barres ou cliquez sur un produit pour encaisser."}
              </p>
            </div>
          ) : (
            cart.map((item, index) => {
              const itemTotal = item.weightInKg
                ? (item.product.price * item.weightInKg)
                : (item.product.price * item.quantity);

              return (
                <div
                  key={`${item.product.id}-${index}`}
                  style={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-glass)',
                    borderLeft: `4px solid ${item.weightInKg ? '#0284c7' : '#059669'}`,
                    borderRadius: '10px',
                    padding: '10px 12px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    {/* Item Number & Title & Unit Price */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', flex: 1, minWidth: 0 }}>
                      <span style={{
                        width: '22px',
                        height: '22px',
                        borderRadius: '6px',
                        background: 'var(--bg-tertiary)',
                        color: 'var(--text-main)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.72rem',
                        fontWeight: 800,
                        flexShrink: 0,
                        border: '1px solid var(--border-glass)'
                      }}>
                        {index + 1}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontWeight: 800,
                          fontSize: '0.92rem',
                          color: 'var(--text-main)',
                          lineHeight: '1.25',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}>
                          {item.product.name}
                        </div>
                        <div style={{
                          fontSize: '0.74rem',
                          color: 'var(--text-dim)',
                          marginTop: '2px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          flexWrap: 'wrap'
                        }}>
                          <span style={{
                            background: item.weightInKg ? 'rgba(2, 132, 199, 0.12)' : 'var(--bg-tertiary)',
                            color: item.weightInKg ? '#0284c7' : 'var(--text-main)',
                            padding: '1px 6px',
                            borderRadius: '4px',
                            fontWeight: 700
                          }}>
                            {item.weightInKg
                              ? `⚖️ ${item.product.price} MRU / kg`
                              : `${item.product.price} MRU / u.`}
                          </span>
                          {item.product.barcode && !item.product.barcode.startsWith('NOBAR') && (
                            <span style={{
                              background: 'var(--bg-tertiary)',
                              padding: '1px 5px',
                              borderRadius: '4px',
                              fontFamily: 'monospace',
                              fontSize: '0.68rem',
                              color: 'var(--text-dim)'
                            }}>
                              🏷️ {item.product.barcode}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Quantity or Weight Controls & Line Total */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      {item.weightInKg ? (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: 'var(--bg-secondary)',
                          borderRadius: '6px',
                          border: '1px solid rgba(2, 132, 199, 0.3)',
                          overflow: 'hidden'
                        }}>
                          <button
                            type="button"
                            onClick={() => {
                              const newWeight = Math.max(0.1, Number(((item.weightInKg || 1) - 0.25).toFixed(2)));
                              setCart(prev => prev.map((it, idx) => idx === index ? { ...it, weightInKg: newWeight } : it));
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-main)',
                              padding: '4px 6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Diminuer poids (-0.25 kg)"
                          >
                            <Minus size={11} />
                          </button>
                          <span style={{
                            padding: '0 4px',
                            fontSize: '0.8rem',
                            fontWeight: 900,
                            minWidth: '52px',
                            textAlign: 'center',
                            color: '#0284c7'
                          }}>
                            {item.weightInKg.toFixed(2)} kg
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              const newWeight = Number(((item.weightInKg || 1) + 0.25).toFixed(2));
                              setCart(prev => prev.map((it, idx) => idx === index ? { ...it, weightInKg: newWeight } : it));
                            }}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-main)',
                              padding: '4px 6px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                            title="Augmenter poids (+0.25 kg)"
                          >
                            <Plus size={11} />
                          </button>
                        </div>
                      ) : (
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          background: 'var(--bg-secondary)',
                          borderRadius: '6px',
                          border: '1px solid var(--border-glass)',
                          overflow: 'hidden'
                        }}>
                          <button
                            onClick={() => updateQuantity(index, -1)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-main)',
                              padding: '4px 7px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.1s'
                            }}
                            title="Diminuer la quantité"
                          >
                            <Minus size={12} />
                          </button>
                          <span style={{
                            padding: '0 6px',
                            fontSize: '0.88rem',
                            fontWeight: 900,
                            minWidth: '22px',
                            textAlign: 'center',
                            color: 'var(--text-main)'
                          }}>
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(index, 1)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-main)',
                              padding: '4px 7px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'background 0.1s'
                            }}
                            title="Augmenter la quantité"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      )}

                      {/* Total MRU Badge */}
                      <span style={{
                        fontWeight: 900,
                        fontSize: '0.95rem',
                        minWidth: '68px',
                        textAlign: 'right',
                        color: item.weightInKg ? '#0284c7' : '#059669',
                        background: item.weightInKg ? 'rgba(2, 132, 199, 0.08)' : 'rgba(5, 150, 105, 0.08)',
                        border: `1px solid ${item.weightInKg ? 'rgba(2, 132, 199, 0.25)' : 'rgba(5, 150, 105, 0.2)'}`,
                        padding: '3px 8px',
                        borderRadius: '6px',
                        fontVariantNumeric: 'tabular-nums'
                      }}>
                        {itemTotal.toFixed(0)} <span style={{ fontSize: '0.72rem', fontWeight: 700 }}>MRU</span>
                      </span>

                      {/* Delete Line Button */}
                      <button
                        onClick={() => removeItem(index)}
                        style={{
                          background: 'rgba(239, 68, 68, 0.08)',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '4px 6px',
                          borderRadius: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.15s ease'
                        }}
                        title="Supprimer cette ligne du ticket"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Cooking Note / Instruction in Restaurant Mode */}
                  {sector === 'restaurant' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', borderTop: '1px dashed var(--border-glass)', paddingTop: '4px' }}>
                      {item.notes ? (
                        <div style={{
                          fontSize: '0.74rem',
                          background: 'rgba(234, 88, 12, 0.12)',
                          color: '#ea580c',
                          padding: '3px 8px',
                          borderRadius: '5px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontWeight: 600,
                          width: '100%',
                          justifyContent: 'space-between'
                        }}>
                          <span>👨‍🍳 Cuisson : <b>{item.notes}</b></span>
                          <X
                            size={12}
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                              setCart(prev => prev.map((it, idx) => idx === index ? { ...it, notes: undefined } : it));
                            }}
                          />
                        </div>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingItemNoteIndex(index);
                            setItemNoteText('');
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text-dim)',
                            fontSize: '0.72rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                            padding: '2px 4px',
                            borderRadius: '4px',
                            fontWeight: 600
                          }}
                        >
                          <Edit3 size={11} />
                          <span>+ Ajouter note de cuisine / cuisson</span>
                        </button>
                      )}
                    </div>
                  )}

                  {/* Inline Note Editor */}
                  {editingItemNoteIndex === index && (
                    <div style={{
                      marginTop: '4px',
                      padding: '8px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '8px',
                      border: '1px solid var(--border-glass)'
                    }}>
                      <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginBottom: '6px' }}>
                        {['Sans piment', 'Bien cuit', 'À point', 'Sauce à part', 'Sans oignon', 'Chaud'].map(tag => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setItemNoteText(prev => prev ? `${prev}, ${tag}` : tag)}
                            style={{
                              background: 'var(--bg-tertiary)',
                              border: '1px solid var(--border-glass)',
                              borderRadius: '4px',
                              padding: '2px 7px',
                              fontSize: '0.68rem',
                              color: 'var(--text-main)',
                              cursor: 'pointer',
                              fontWeight: 600
                            }}
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="text"
                          placeholder="Instruction spéciale pour le chef..."
                          value={itemNoteText}
                          onChange={(e) => setItemNoteText(e.target.value)}
                          style={{
                            flex: 1,
                            padding: '5px 8px',
                            borderRadius: '5px',
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--border-glass)',
                            color: 'var(--text-main)',
                            fontSize: '0.78rem'
                          }}
                        />
                        <button
                          onClick={() => handleSaveItemNote(index)}
                          className="btn-primary"
                          style={{ padding: '5px 10px', fontSize: '0.72rem', fontWeight: 700 }}
                        >
                          Valider
                        </button>
                        <button
                          onClick={() => setEditingItemNoteIndex(null)}
                          className="btn-secondary"
                          style={{ padding: '5px 8px', fontSize: '0.72rem' }}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Cart Totals & Payment Section (Exact Caissa.tn Flow) */}
        {cart.length > 0 && (
          <div style={{
            padding: '12px 14px',
            borderTop: '1px solid var(--border-glass)',
            background: 'var(--bg-secondary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {/* Discount selector */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Remise commerciale :</span>
              <div style={{ display: 'flex', gap: '4px' }}>
                {[0, 5, 10, 15].map(disc => (
                  <button
                    key={disc}
                    onClick={() => setDiscountPercent(disc)}
                    style={{
                      background: discountPercent === disc ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                      color: discountPercent === disc ? '#fff' : 'var(--text-muted)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      fontSize: '0.72rem',
                      cursor: 'pointer'
                    }}
                  >
                    {disc === 0 ? '0%' : `-${disc}%`}
                  </button>
                ))}
              </div>
            </div>

            {/* Financial breakdown */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Sous-total :</span>
              <span>{subtotal.toFixed(0)} MRU</span>
            </div>

            {discountPercent > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#16a34a' }}>
                <span>Remise ({discountPercent}%) :</span>
                <span>-{discountAmount.toFixed(0)} MRU</span>
              </div>
            )}

            {deliverySurcharge > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
                <span>Frais de livraison :</span>
                <span>+{deliverySurcharge} MRU</span>
              </div>
            )}

            {/* Grand Total Display */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              padding: '8px 12px',
              background: 'var(--bg-card)',
              borderRadius: '8px',
              border: '1px solid var(--border-glass)'
            }}>
              <div>
                <div style={{ fontSize: '0.66rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
                  Net à Payer
                </div>
                <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-main)' }}>
                  TOTAL COMMANDE
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontWeight: 900, fontSize: '1.65rem', color: '#10b981', fontVariantNumeric: 'tabular-nums' }}>
                  {total.toFixed(0)} <span style={{ fontSize: '0.9rem', color: '#059669' }}>MRU</span>
                </span>
              </div>
            </div>

            {/* Fast Cash Buttons (Mauritanian Banknotes: 50, 100, 200, 500, 1000 MRU) */}
            <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
              <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>Billets :</span>
              {[50, 100, 200, 500, 1000].map(cash => (
                <button
                  key={cash}
                  type="button"
                  onClick={() => setCashGiven(cash)}
                  style={{
                    flex: 1,
                    background: cashGiven === cash ? '#059669' : 'var(--bg-tertiary)',
                    borderColor: cashGiven === cash ? '#047857' : 'var(--border-glass)',
                    color: cashGiven === cash ? '#ffffff' : 'var(--text-main)',
                    border: '1px solid',
                    borderRadius: '5px',
                    padding: '5px 0',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {cash}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCashGiven(total)}
                style={{
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-muted)',
                  borderRadius: '5px',
                  padding: '5px 8px',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Exact
              </button>
            </div>

            {/* Rendu de Monnaie (Instant Change Calculator) */}
            {cashGiven > 0 && (
              <div style={{
                background: changeDue >= 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${changeDue >= 0 ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                padding: '8px 12px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.85rem'
              }}>
                <span>Reçu en caisse : <strong>{cashGiven} MRU</strong></span>
                <span style={{ color: changeDue >= 0 ? '#10b981' : '#ef4444', fontWeight: 900, fontSize: '0.95rem' }}>
                  Rendu : {changeDue.toFixed(0)} MRU
                </span>
              </div>
            )}

            {/* 4 Moyens d'Encaissement Mauritanie */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr 1fr', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleCheckout('ESPECES')}
                style={{
                  padding: '11px 4px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  background: '#059669',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(5, 150, 105, 0.3)'
                }}
                title="Paiement Espèces (Ouguiya)"
              >
                <Banknote size={15} /> Espèces
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileGateway('BANKILY');
                  setIsBankilyModalOpen(true);
                }}
                style={{
                  padding: '11px 4px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#ffffff',
                  background: '#ea580c',
                  border: 'none',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  cursor: 'pointer',
                  boxShadow: '0 2px 6px rgba(234, 88, 12, 0.3)'
                }}
                title="Paiement Mobile Bankily (BPM)"
              >
                <Smartphone size={15} /> Bankily
              </button>

              <button
                type="button"
                onClick={() => {
                  setMobileGateway('MASRVI');
                  setIsBankilyModalOpen(true);
                }}
                style={{
                  padding: '11px 4px',
                  fontSize: '0.82rem',
                  fontWeight: 700,
                  color: '#0284c7',
                  background: 'rgba(2, 132, 199, 0.12)',
                  border: '1px solid rgba(2, 132, 199, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  cursor: 'pointer'
                }}
                title="Paiement Masrvi (BIM)"
              >
                <CreditCard size={15} /> Masrvi
              </button>

              <button
                type="button"
                onClick={() => setIsKridiModalOpen(true)}
                style={{
                  padding: '11px 4px',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  color: '#d97706',
                  background: 'rgba(217, 119, 6, 0.12)',
                  border: '1px solid rgba(217, 119, 6, 0.3)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '5px',
                  cursor: 'pointer'
                }}
                title="Vente à crédit / Carnet Kridi"
              >
                <BookOpen size={15} /> الكريدي
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Article Libre (Vente au montant libre) */}
      {isCustomItemModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110
        }}>
          <form onSubmit={handleAddCustomItem} className="glass-panel" style={{ width: '400px', padding: '22px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="#10b981" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Article Libre / Montant Divers</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsCustomItemModalOpen(false)} />
            </div>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
              Encaisser un article ou une prestation non programmée au catalogue.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Désignation de l'article * :
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Pain Spécial, Plat du jour, Sac glaçons..."
                  value={customItemName}
                  onChange={(e) => setCustomItemName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Prix TTC en Ouguiya (MRU) * :
                </label>
                <input
                  type="number"
                  required
                  step="1"
                  min="1"
                  placeholder="ex: 120"
                  value={customItemPrice}
                  onChange={(e) => setCustomItemPrice(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '6px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                    color: '#16a34a',
                    fontWeight: 800,
                    fontSize: '1.15rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsCustomItemModalOpen(false)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Annuler
              </button>
              <button
                type="submit"
                className="btn-primary"
                style={{ flex: 2 }}
              >
                Ajouter au Ticket
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL: Mouvements de Caisse & Fond de Caisse */}
      {isCashDrawerModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110
        }}>
          <div className="glass-panel" style={{ width: '460px', padding: '22px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Coins size={18} color="#f59e0b" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Tiroir-Caisse & Mouvements d'Espèces</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsCashDrawerModalOpen(false)} />
            </div>

            {/* Solde théorique en caisse */}
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Solde Espèces Théorique en Tiroir</div>
                <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#16a34a' }}>
                  {currentDrawerCash.toFixed(0)} <small style={{ fontSize: '0.85rem' }}>MRU</small>
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Caisse N°1</span>
            </div>

            {/* Formulaire nouveau mouvement */}
            <form onSubmit={handleRecordCashMovement} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', marginBottom: '10px' }}>
                <button
                  type="button"
                  onClick={() => setDrawerType('OUT')}
                  style={{
                    padding: '6px 4px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: drawerType === 'OUT' ? '#ef4444' : 'var(--border-glass)',
                    background: drawerType === 'OUT' ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-card)',
                    color: drawerType === 'OUT' ? '#ef4444' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Sortie (Dépense)
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerType('IN')}
                  style={{
                    padding: '6px 4px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: drawerType === 'IN' ? '#16a34a' : 'var(--border-glass)',
                    background: drawerType === 'IN' ? 'rgba(22, 163, 74, 0.15)' : 'var(--bg-card)',
                    color: drawerType === 'IN' ? '#16a34a' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Entrée (Apport)
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerType('FLOAT_OPEN')}
                  style={{
                    padding: '6px 4px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: drawerType === 'FLOAT_OPEN' ? '#f59e0b' : 'var(--border-glass)',
                    background: drawerType === 'FLOAT_OPEN' ? 'rgba(245, 158, 11, 0.15)' : 'var(--bg-card)',
                    color: drawerType === 'FLOAT_OPEN' ? '#f59e0b' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  Fond de caisse
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '8px', marginBottom: '8px' }}>
                <input
                  type="number"
                  required
                  placeholder="Montant (MRU)"
                  value={drawerAmount}
                  onChange={(e) => setDrawerAmount(e.target.value)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    fontWeight: 700
                  }}
                />
                <input
                  type="text"
                  placeholder="Motif (ex: Achat pain, Fournisseur...)"
                  value={drawerReason}
                  onChange={(e) => setDrawerReason(e.target.value)}
                  style={{
                    padding: '8px',
                    borderRadius: '6px',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary"
                style={{ width: '100%', padding: '7px', fontSize: '0.8rem' }}
              >
                Enregistrer le Mouvement
              </button>
            </form>

            {/* Historique récent */}
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '6px', fontWeight: 700 }}>
              Derniers Mouvements de Caisse :
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
              {drawerMovements.slice(0, 5).map(m => (
                <div
                  key={m.id}
                  style={{
                    padding: '6px 10px',
                    borderRadius: '6px',
                    background: 'var(--bg-glass)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.78rem'
                  }}
                >
                  <div>
                    <span style={{ fontWeight: 700 }}>{m.reason}</span>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>
                      {m.cashierName} • {m.time || new Date(m.createdAt || Date.now()).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <span style={{
                    fontWeight: 800,
                    color: m.type === 'OUT' ? '#ef4444' : '#16a34a'
                  }}>
                    {m.type === 'OUT' ? '-' : '+'}{m.amount} MRU
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Choix du Client au Ticket */}
      {isCustomerPickerModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110
        }}>
          <div className="glass-panel" style={{ width: '420px', padding: '22px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <UserCheck size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Client Rattaché au Ticket</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsCustomerPickerModalOpen(false)} />
            </div>

            <button
              onClick={() => {
                setActiveCustomerName('Client Comptoir');
                setIsCustomerPickerModalOpen(false);
              }}
              className="btn-secondary"
              style={{
                width: '100%',
                marginBottom: '12px',
                padding: '8px',
                fontSize: '0.82rem',
                justifyContent: 'center',
                borderColor: activeCustomerName === 'Client Comptoir' ? 'var(--accent-primary)' : 'var(--border-glass)'
              }}
            >
              👤 Client Comptoir (Par défaut)
            </button>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '8px', fontWeight: 700 }}>
              Ou sélectionner un client en compte :
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '220px', overflowY: 'auto' }}>
              {kridiCustomers.map(cust => (
                <div
                  key={cust.id}
                  onClick={() => {
                    setActiveCustomerName(cust.name);
                    setIsCustomerPickerModalOpen(false);
                  }}
                  style={{
                    padding: '8px 10px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: activeCustomerName === cust.name ? 'var(--accent-primary)' : 'var(--border-glass)',
                    background: activeCustomerName === cust.name ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-tertiary)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{cust.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{cust.phone} {cust.address ? `• ${cust.address}` : ''}</div>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Sélectionner</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Rapport X de Caisse (Lecture Intermédiaire en cours de journée) */}
      {isXReportModalOpen && xReportData && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110
        }}>
          <div className="receipt-paper" style={{ width: '400px' }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <div style={{ display: 'inline-block', background: '#3b82f6', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, marginBottom: '4px' }}>
                LECTURE INTERMÉDIAIRE (SESSION OUVERTE)
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>SITUATION DE CAISSE (RAPPORT X)</h2>
              <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{xReportData.tenantName}</div>
              <div style={{ fontSize: '0.72rem' }}>{xReportData.city}</div>
              <div style={{ fontSize: '0.72rem' }}>Date : {xReportData.date} • Lecture à : {xReportData.generatedAt}</div>
            </div>

            <div style={{ borderTop: '2px dashed #111', borderBottom: '2px dashed #111', padding: '10px 0', margin: '10px 0', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Nombre de ventes à cet instant :</span>
                <strong>{xReportData.ordersCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Espèces encaissées :</span>
                <strong>{xReportData.totalCash} MRU</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Paiements Bankily :</span>
                <strong>{xReportData.totalBankily} MRU</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Paiements Masrvi :</span>
                <strong>{xReportData.totalMasrvi} MRU</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Crédits accordés (« Kridi ») :</span>
                <strong>{xReportData.totalKridi} MRU</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px solid #111', fontSize: '1.15rem', fontWeight: 900 }}>
                <span>TOTAL VENTES CUMULÉ :</span>
                <span>{xReportData.totalSales} MRU</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.7rem', marginBottom: '14px', color: '#555' }}>
              <div>Panier Moyen provisoire : {xReportData.averageTicket} MRU</div>
              <div>Ce rapport ne clôture pas la journée • Caissa.mr</div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => window.print()}
                className="btn-primary"
                style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
              >
                <Printer size={15} /> Imprimer Rapport X
              </button>
              <button
                onClick={() => setIsXReportModalOpen(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Choix de la Table (Restauration) */}
      {isTableModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110
        }}>
          <div className="glass-panel" style={{ width: '460px', padding: '20px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Utensils size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Affecter une Table (Salle & Salons)</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsTableModalOpen(false)} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {INITIAL_TABLES.map(table => (
                <div
                  key={table.id}
                  onClick={() => {
                    setActiveTable(table.name);
                    setIsTableModalOpen(false);
                  }}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: activeTable === table.name ? 'var(--accent-primary)' : 'var(--border-glass)',
                    background: activeTable === table.name ? 'rgba(5, 150, 105, 0.15)' : 'var(--bg-tertiary)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{table.name}</span>
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: table.status === 'libre' ? 'rgba(16, 185, 129, 0.2)' : (table.status === 'occupee' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'),
                      color: table.status === 'libre' ? '#10b981' : (table.status === 'occupee' ? '#ef4444' : '#f59e0b')
                    }}>
                      {table.status.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                    {table.zone} • {table.seats} Couverts
                  </div>
                  {table.currentTotal && (
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#16a34a', marginTop: '4px' }}>
                      En cours : {table.currentTotal} MRU
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Division d'Addition (Split Bill) */}
      {isSplitModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110
        }}>
          <div className="glass-panel" style={{ width: '420px', padding: '22px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Split size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Diviser l'Addition (Split Bill)</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsSplitModalOpen(false)} />
            </div>

            <div style={{ textAlign: 'center', margin: '14px 0', padding: '12px', background: 'var(--bg-tertiary)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Total à partager :</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 900, color: '#16a34a' }}>{total.toFixed(0)} MRU</div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '16px' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Nombre de personnes :</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                  className="btn-secondary"
                  style={{ width: '32px', height: '32px', padding: 0 }}
                >
                  <Minus size={14} />
                </button>
                <span style={{ fontSize: '1.2rem', fontWeight: 800, minWidth: '24px', textAlign: 'center' }}>
                  {splitCount}
                </span>
                <button
                  onClick={() => setSplitCount(Math.min(10, splitCount + 1))}
                  className="btn-secondary"
                  style={{ width: '32px', height: '32px', padding: 0 }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div style={{
              background: 'rgba(5, 150, 105, 0.08)',
              border: '1px solid rgba(5, 150, 105, 0.25)',
              borderRadius: '8px',
              padding: '12px',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Part individuelle par personne :</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#059669' }}>
                {(total / splitCount).toFixed(0)} MRU <small style={{ fontSize: '0.75rem' }}>/ pers</small>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsSplitModalOpen(false)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Fermer
              </button>
              <button
                onClick={() => {
                  handleCheckout('ESPECES');
                }}
                className="btn-primary"
                style={{ flex: 2 }}
              >
                Encaisser par part
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Addition Proforma / Note de Table (Restauration) */}
      {isProformaModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110
        }}>
          <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="receipt-paper">
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: 0 }}>
                  {account?.businessName?.toUpperCase() || 'NOTE DE TABLE (PROFORMA)'}
                </h3>
                <div style={{ fontSize: '0.72rem', color: '#555' }}>Document non fiscal • {account?.restaurantType || 'Restauration'}</div>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, marginTop: '4px' }}>{activeTable}</div>
                <div style={{ fontSize: '0.7rem' }}>Date : {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
              </div>

              <div style={{ borderTop: '1px dashed #111', borderBottom: '1px dashed #111', padding: '8px 0', margin: '8px 0', fontSize: '0.78rem' }}>
                {cart.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>{it.quantity}x {it.product.name} {it.notes ? `(${it.notes})` : ''}</span>
                    <strong>{(it.product.price * it.quantity).toFixed(0)} MRU</strong>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 900, marginTop: '8px' }}>
                <span>TOTAL :</span>
                <span>{total.toFixed(0)} MRU</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => window.print()}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                <Printer size={15} /> Imprimer Note
              </button>
              <button
                onClick={() => setIsProformaModalOpen(false)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Bankily / Masrvi Mobile Money (Mauritanie) */}
      {isBankilyModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110
        }}>
          <div className="glass-panel" style={{ width: '420px', padding: '24px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Smartphone size={20} color={mobileGateway === 'BANKILY' ? '#f97316' : '#0284c7'} />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                  Encaissement {mobileGateway === 'BANKILY' ? 'Bankily (BPM)' : 'Masrvi (BIM)'}
                </h3>
              </div>
              <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsBankilyModalOpen(false)} />
            </div>

            <div style={{
              background: mobileGateway === 'BANKILY' ? 'rgba(249, 115, 22, 0.1)' : 'rgba(2, 132, 199, 0.1)',
              border: `1px solid ${mobileGateway === 'BANKILY' ? 'rgba(249, 115, 22, 0.3)' : 'rgba(2, 132, 199, 0.3)'}`,
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Montant à transférer :</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: mobileGateway === 'BANKILY' ? '#f97316' : '#0284c7' }}>
                {total.toFixed(0)} MRU
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                Code Marchand : <strong>45 25 00 00</strong>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Numéro de téléphone client (8 chiffres) :
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>+222</span>
                  <input
                    type="text"
                    placeholder="ex: 22 14 55 88"
                    value={mobilePhoneInput}
                    onChange={(e) => setMobilePhoneInput(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-main)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Référence / Code SMS reçu :
                </label>
                <input
                  type="text"
                  placeholder="ex: BK-849204"
                  value={mobileRefInput}
                  onChange={(e) => setMobileRefInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setIsBankilyModalOpen(false)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Annuler
              </button>
              <button
                onClick={() => handleCheckout(mobileGateway, undefined, mobileRefInput || 'AUTO')}
                className="btn-primary"
                style={{
                  flex: 2,
                  background: mobileGateway === 'BANKILY' ? '#ea580c' : '#0284c7',
                  color: '#fff',
                  fontWeight: 700
                }}
              >
                <Check size={16} /> Confirmer Paiement
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Choix du Client Kridi pour la vente (Mauritanie) */}
      {isKridiModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110
        }}>
          <div className="glass-panel" style={{ width: '440px', padding: '24px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={20} color="var(--accent-amber)" />
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Vente au Carnet (« الكريدي »)</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsKridiModalOpen(false)} />
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
              Montant à enregistrer : <strong>{total.toFixed(0)} MRU</strong>. Choisissez le client :
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
              {kridiCustomers.map(cust => (
                <div
                  key={cust.id}
                  onClick={() => setSelectedKridiCustomer(cust)}
                  style={{
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedKridiCustomer?.id === cust.id ? 'var(--accent-amber)' : 'var(--border-glass)',
                    background: selectedKridiCustomer?.id === cust.id ? 'rgba(245, 158, 11, 0.2)' : 'var(--bg-glass)',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{cust.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {cust.phone} {cust.address ? `• ${cust.address}` : ''}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--accent-rose)' }}>
                      Dette: {cust.currentDebt} MRU
                    </div>
                    <div style={{ fontSize: '0.68rem', color: '#d97706', fontWeight: 700 }}>
                      🪙 {cust.loyaltyPoints || 0} pts fidélité
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button
                onClick={() => setIsKridiModalOpen(false)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Annuler
              </button>
              <button
                onClick={() => selectedKridiCustomer && handleCheckout('KRIDI', selectedKridiCustomer)}
                disabled={!selectedKridiCustomer}
                className="btn-primary"
                style={{ flex: 2, background: 'var(--accent-amber)', color: '#000', fontWeight: 800 }}
              >
                Valider sur le Carnet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Balance de Pesée Électronique */}
      {weighingProduct && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110
        }}>
          <div className="glass-panel" style={{ width: '420px', padding: '24px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Scale size={24} color="var(--accent-cyan)" />
                <div>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>{weighingProduct.name}</h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    Prix unitaire : {weighingProduct.price} MRU / Kg
                  </span>
                </div>
              </div>
              <X size={18} style={{ cursor: 'pointer' }} onClick={() => setWeighingProduct(null)} />
            </div>

            {/* Visual Digital Scale Display */}
            <div style={{
              background: '#040d1a',
              border: '2px solid var(--accent-cyan)',
              borderRadius: '10px',
              padding: '16px',
              textAlign: 'center',
              boxShadow: '0 0 20px rgba(6, 182, 212, 0.25)',
              marginBottom: '16px'
            }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--accent-cyan)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                Balance Électronique Connectée (Port COM / USB)
              </div>
              <div style={{ fontSize: '2.8rem', fontWeight: 900, color: '#38bdf8', fontFamily: 'monospace', margin: '4px 0' }}>
                {Math.max(0, scaleWeight - scaleTare).toFixed(3)} <span style={{ fontSize: '1.2rem' }}>kg</span>
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>
                Prix total : {(weighingProduct.price * Math.max(0, scaleWeight - scaleTare)).toFixed(0)} MRU
              </div>
            </div>

            {/* Quick Weight Adjusters */}
            <div style={{ display: 'flex', gap: '6px', marginBottom: '14px' }}>
              {[0.25, 0.5, 1.0, 1.5, 2.0].map(kg => (
                <button
                  key={kg}
                  type="button"
                  onClick={() => setScaleWeight(kg)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '6px 0', fontSize: '0.75rem', fontWeight: 700 }}
                >
                  +{kg}kg
                </button>
              ))}
              <button
                type="button"
                onClick={() => setScaleTare(scaleWeight)}
                className="btn-secondary"
                style={{ padding: '6px 8px', fontSize: '0.75rem', color: 'var(--accent-amber)' }}
                title="Tarer la balance à zéro"
              >
                Tare
              </button>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setWeighingProduct(null)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Annuler
              </button>
              <button
                onClick={handleAddWeightedItem}
                className="btn-primary"
                style={{ flex: 2 }}
              >
                <CheckCircle2 size={16} /> Ajouter la Pesée
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Rapport Z de Clôture de Caisse (Mauritanie) */}
      {isZReportModalOpen && zReportData && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110
        }}>
          <div className="receipt-paper" style={{ width: '400px' }}>
            <div style={{ textAlign: 'center', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>CLÔTURE DE CAISSE (RAPPORT Z)</h2>
              <div style={{ fontSize: '0.75rem', fontWeight: 700 }}>{zReportData.tenantName}</div>
              <div style={{ fontSize: '0.72rem' }}>{zReportData.city} • {zReportData.nif}</div>
              <div style={{ fontSize: '0.72rem' }}>Date : {zReportData.date} • {zReportData.generatedAt}</div>
            </div>

            <div style={{ borderTop: '2px solid #111', borderBottom: '2px solid #111', padding: '10px 0', margin: '10px 0', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Nombre de tickets émis :</span>
                <strong>{zReportData.ordersCount}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Total Espèces compté :</span>
                <strong>{zReportData.totalCash} MRU</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Total Mobile Bankily :</span>
                <strong>{zReportData.totalBankily} MRU</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Total Masrvi :</span>
                <strong>{zReportData.totalMasrvi} MRU</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span>Total Ventes à Crédit (« Kridi ») :</span>
                <strong>{zReportData.totalKridi} MRU</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '6px', borderTop: '1px dashed #666', fontSize: '1.15rem', fontWeight: 900 }}>
                <span>CHIFFRE TOTAL DU JOUR :</span>
                <span>{zReportData.totalSales} MRU</span>
              </div>
            </div>

            <div style={{ textAlign: 'center', fontSize: '0.72rem', marginBottom: '14px', color: '#555' }}>
              <div>Panier Moyen : {zReportData.averageTicket} MRU</div>
              <div>Caisse certifiée conforme • Caissa.mr Mauritanie</div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => window.print()}
                className="btn-primary"
                style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
              >
                <Printer size={15} /> Imprimer Rapport Z
              </button>
              <button
                onClick={() => setIsZReportModalOpen(false)}
                className="btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '0.8rem' }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Tickets Suspendus (Hold / Resume) */}
      {isHeldModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 110
        }}>
          <div className="glass-panel" style={{ width: '440px', padding: '20px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PauseCircle size={18} color="var(--accent-amber)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Tickets en Attente ({heldTickets.length})</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsHeldModalOpen(false)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
              {heldTickets.map(held => (
                <div
                  key={held.id}
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-glass)',
                    background: 'var(--bg-glass)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>
                      {held.id} {held.table ? `• ${held.table}` : ''}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                      {held.time} • {held.items.length} articles
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 800, color: '#16a34a', fontSize: '0.9rem' }}>
                      {held.subtotal.toFixed(0)} MRU
                    </span>
                    <button
                      onClick={() => handleResumeTicket(held)}
                      className="btn-primary"
                      style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                    >
                      Reprendre
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Ticket de Caisse Thermique Conforme Mauritanie */}
      {completedOrder && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '14px', position: 'relative' }}>
            <button
              onClick={() => {
                setCompletedOrder(null);
                clearCart();
                setCashGiven(0);
                if (onClearTable) onClearTable();
              }}
              style={{
                position: 'absolute',
                top: '-12px',
                right: '-12px',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: '#fff',
                border: '1px solid rgba(0,0,0,0.2)',
                color: '#111',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                zIndex: 10
              }}
              title="Fermer le ticket"
            >
              <X size={18} />
            </button>
            <div className="receipt-paper">
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>
                  {account?.businessName?.toUpperCase() || 'CAISSA MAURITANIE'}
                </h2>
                <div style={{ fontSize: '0.72rem' }}>{account?.restaurantType || 'Solution Caisse & Gestion POS'}</div>
                <div style={{ fontSize: '0.72rem' }}>{account?.city || 'Tevragh-Zeina, Nouakchott, Mauritanie'}</div>
                <div style={{ fontSize: '0.72rem' }}>Tél: {account?.phone || '+222 45 25 00 00'} • NIF: 12048592/RIM</div>
              </div>

              <div style={{ borderTop: '1px dashed #111', borderBottom: '1px dashed #111', padding: '6px 0', margin: '8px 0', fontSize: '0.75rem' }}>
                <div>Ticket : #{completedOrder.orderId}</div>
                {completedOrder.tableNumber && (
                  <div>Table : <strong>{completedOrder.tableNumber}</strong></div>
                )}
                <div>Date : {new Date().toLocaleDateString('fr-TN')} {completedOrder.date}</div>
                <div>Règlement : <strong>{completedOrder.paymentMethod}</strong> {completedOrder.paymentReference ? `(${completedOrder.paymentReference})` : ''}</div>
                {completedOrder.customerName && (
                  <div>Client : <strong>{completedOrder.customerName}</strong></div>
                )}
              </div>

              {/* Items */}
              <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '4px', margin: '8px 0' }}>
                {completedOrder.items.map((it: CartItem, idx: number) => {
                  const itTot = it.weightInKg ? (it.product.price * it.weightInKg) : (it.product.price * it.quantity);
                  return (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>
                        {it.weightInKg ? `${it.weightInKg.toFixed(2)}kg` : `${it.quantity}x`} {it.product.name}
                        {it.notes ? ` (${it.notes})` : ''}
                      </span>
                      <strong>{itTot.toFixed(0)} MRU</strong>
                    </div>
                  );
                })}
              </div>

              <div style={{ borderTop: '1px dashed #111', paddingTop: '6px', marginTop: '6px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Sous-total HT :</span>
                  <span>{(completedOrder.subtotal * 0.84).toFixed(0)} MRU</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#555' }}>
                  <span>TVA (16%) :</span>
                  <span>{(completedOrder.subtotal * 0.16).toFixed(0)} MRU</span>
                </div>
                {completedOrder.discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Remise :</span>
                    <span>-{completedOrder.discountAmount.toFixed(0)} MRU</span>
                  </div>
                )}
                {completedOrder.deliveryFee > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Livraison :</span>
                    <span>+{completedOrder.deliveryFee.toFixed(0)} MRU</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900, marginTop: '4px' }}>
                  <span>TOTAL TTC :</span>
                  <span>{completedOrder.total.toFixed(0)} MRU</span>
                </div>
                {completedOrder.cashGiven && (
                  <>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '4px' }}>
                      <span>Espèces reçues :</span>
                      <span>{completedOrder.cashGiven.toFixed(0)} MRU</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                      <span>Monnaie rendue :</span>
                      <strong>{completedOrder.changeDue.toFixed(0)} MRU</strong>
                    </div>
                  </>
                )}

                {completedOrder.customerName && (
                  <div style={{
                    marginTop: '8px',
                    padding: '6px 8px',
                    borderRadius: '4px',
                    background: '#f4f4f5',
                    fontSize: '0.72rem',
                    border: '1px dashed #888'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#111' }}>
                      <span>🪙 Points fidélité gagnés :</span>
                      <span>+{Math.max(1, Math.floor(completedOrder.total / 10))} pts</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#555', marginTop: '2px' }}>
                      <span>Programme fidélité :</span>
                      <span>1 pt / 10 MRU</span>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.72rem' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>*** Merci de votre visite ***</p>
                <p style={{ margin: '2px 0 0 0', direction: 'rtl' }}>شكراً لزيارتكم</p>
                <p style={{ fontSize: '0.65rem', color: '#666', marginTop: '4px' }}>Logiciel de Caisse Caissa.mr</p>
              </div>
            </div>

            {/* Actions for receipt */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => window.print()}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                <Printer size={16} /> Imprimer Ticket
              </button>
              <button
                onClick={() => {
                  setCompletedOrder(null);
                  clearCart();
                  setCashGiven(0);
                  if (onClearTable) onClearTable();
                }}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Nouvelle Vente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Calculatrice Tactile Intégrée */}
      {isCalculatorOpen && (
        <div style={{
          position: 'fixed',
          top: '70px',
          right: '460px',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-glass)',
          borderRadius: '12px',
          padding: '16px',
          width: '240px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 110
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Calculatrice Tactile</span>
            <X size={16} style={{ cursor: 'pointer' }} onClick={() => setIsCalculatorOpen(false)} />
          </div>
          <div style={{
            background: 'var(--bg-tertiary)',
            padding: '8px 12px',
            borderRadius: '6px',
            textAlign: 'right',
            fontSize: '1.4rem',
            fontWeight: 800,
            fontFamily: 'monospace',
            marginBottom: '10px',
            overflow: 'hidden'
          }}>
            {calcInput}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
            {['7','8','9','÷','4','5','6','×','1','2','3','-','C','0','=','+'].map(btn => (
              <button
                key={btn}
                onClick={() => handleCalcPress(btn)}
                style={{
                  padding: '8px 0',
                  borderRadius: '6px',
                  background: btn === '=' ? 'var(--accent-primary)' : 'var(--bg-card)',
                  color: btn === '=' ? '#fff' : 'var(--text-main)',
                  border: '1px solid var(--border-glass)',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  cursor: 'pointer'
                }}
              >
                {btn}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* MODAL: Modificateurs & Options Culinaires (Toast POS style) */}
      {customizingProduct && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120
        }}>
          <div className="glass-panel" style={{
            width: '460px',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '22px',
            borderRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.4)',
            background: 'var(--bg-secondary)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <span style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  color: '#059669',
                  background: 'rgba(5, 150, 105, 0.1)',
                  padding: '2px 6px',
                  borderRadius: '4px'
                }}>
                  {customizingProduct.category}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 900, margin: '4px 0 2px 0' }}>
                  {customizingProduct.name}
                </h3>
                {customizingProduct.nameAr && (
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', direction: 'rtl' }}>
                    {customizingProduct.nameAr}
                  </div>
                )}
              </div>
              <X size={20} style={{ cursor: 'pointer', color: 'var(--text-dim)' }} onClick={() => setCustomizingProduct(null)} />
            </div>

            {/* 1. Cuisson (pour viandes et grillades) */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                🥩 Cuisson de la viande :
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {['Saignant', 'À point', 'Bien cuit'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setModCuisson(c)}
                    style={{
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: modCuisson === c ? '#047857' : 'var(--border-glass)',
                      background: modCuisson === c ? '#059669' : 'var(--bg-card)',
                      color: modCuisson === c ? '#ffffff' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.78rem',
                      cursor: 'pointer'
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Accompagnement */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                🍚 Accompagnement inclus :
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                {['Riz Maison', 'Frites', 'Aloco', 'Pain'].map(acc => (
                  <button
                    key={acc}
                    type="button"
                    onClick={() => setModAccompagnement(acc)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: modAccompagnement === acc ? '#047857' : 'var(--border-glass)',
                      background: modAccompagnement === acc ? '#059669' : 'var(--bg-card)',
                      color: modAccompagnement === acc ? '#ffffff' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.74rem',
                      cursor: 'pointer'
                    }}
                  >
                    {acc}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Piment & Sauce */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                🌶️ Préférence piment & sauces :
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                {['Sans piment', 'Piment vert à part', 'Bien épicé (fort)'].map(pim => (
                  <button
                    key={pim}
                    type="button"
                    onClick={() => setModPiment(pim)}
                    style={{
                      padding: '8px 4px',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: modPiment === pim ? '#ea580c' : 'var(--border-glass)',
                      background: modPiment === pim ? '#ea580c' : 'var(--bg-card)',
                      color: modPiment === pim ? '#ffffff' : 'var(--text-main)',
                      fontWeight: 700,
                      fontSize: '0.74rem',
                      cursor: 'pointer'
                    }}
                  >
                    {pim}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Suppléments payants */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '6px' }}>
                ➕ Suppléments & Extras :
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                {[
                  'Double Viande (+60 MRU)',
                  'Fromage Fondu (+20 MRU)',
                  'Œuf Frit (+10 MRU)',
                  'Frites Extra (+30 MRU)'
                ].map(extra => {
                  const isChecked = modSupplements.includes(extra);
                  return (
                    <button
                      key={extra}
                      type="button"
                      onClick={() => {
                        setModSupplements(prev => isChecked ? prev.filter(x => x !== extra) : [...prev, extra]);
                      }}
                      style={{
                        padding: '8px 10px',
                        borderRadius: '6px',
                        border: '1px solid',
                        borderColor: isChecked ? '#10b981' : 'var(--border-glass)',
                        background: isChecked ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
                        color: isChecked ? '#047857' : 'var(--text-main)',
                        fontWeight: 700,
                        fontSize: '0.74rem',
                        cursor: 'pointer',
                        textAlign: 'left',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{extra}</span>
                      {isChecked && <Check size={14} color="#047857" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. Instruction spéciale pour la cuisine KDS */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--text-main)', display: 'block', marginBottom: '4px' }}>
                👨‍🍳 Message spécifique pour la cuisine KDS :
              </label>
              <input
                type="text"
                placeholder="Ex: Sans oignon, servir chaud en premier..."
                value={modSpecialNote}
                onChange={(e) => setModSpecialNote(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-glass)',
                  background: 'var(--bg-tertiary)',
                  color: 'var(--text-main)',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Boutons d'action */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
              <button
                type="button"
                onClick={() => setCustomizingProduct(null)}
                className="btn-secondary"
                style={{ flex: 1, padding: '10px', fontSize: '0.82rem' }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={handleConfirmModifiers}
                className="btn-primary"
                style={{
                  flex: 2,
                  padding: '10px',
                  fontSize: '0.85rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <ChefHat size={16} />
                <span>Valider & Ajouter au Panier</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
