import React, { useState, useEffect } from 'react';
import { 
  Package, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Scale, 
  Barcode, 
  X,
  Download
} from 'lucide-react';
import type { Product } from '../data/mockData';
import { INITIAL_PRODUCTS } from '../data/mockData';
import { 
  getProductsApi, 
  createProductApi, 
  updateProductApi, 
  deleteProductApi, 
  adjustProductStockApi 
} from '../services/api';

interface StockScreenProps {
  sector: 'restaurant' | 'market';
  onProductsUpdated?: (products: Product[]) => void;
}

export const StockScreen: React.FC<StockScreenProps> = ({ sector, onProductsUpdated }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [stockStatusFilter, setStockStatusFilter] = useState<'ALL' | 'LOW' | 'OUT'>('ALL');
  
  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    category: '',
    price: '',
    costPrice: '',
    barcode: '',
    stock: '50',
    isWeighted: false,
    sector: sector,
    image: '📦'
  });

  useEffect(() => {
    loadProducts();
  }, [sector]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProductsApi();
      if (data && data.length > 0) {
        setProducts(data);
        if (onProductsUpdated) onProductsUpdated(data);
      } else {
        setProducts(INITIAL_PRODUCTS);
        if (onProductsUpdated) onProductsUpdated(INITIAL_PRODUCTS);
      }
    } catch (err) {
      console.warn('Erreur chargement catalogue stock, chargement du catalogue local', err);
      setProducts(INITIAL_PRODUCTS);
      if (onProductsUpdated) onProductsUpdated(INITIAL_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustStock = async (id: string, delta: number) => {
    try {
      const res = await adjustProductStockApi(id, delta);
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: res.newStock } : p));
    } catch (e) {
      // Local fallback
      setProducts(prev => prev.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cet article du catalogue ?")) return;
    try {
      await deleteProductApi(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleExportStockCSV = () => {
    if (products.length === 0) return;

    const headers = ['ID', 'Désignation', 'Nom Arabe', 'Catégorie', 'Secteur', 'Prix Achat (MRU)', 'Prix Vente (MRU)', 'Marge (MRU)', 'Marge (%)', 'Stock', 'Code-barres', 'Vendu au Poids'];
    const rows = products.map(p => {
      const margin = p.price - p.costPrice;
      const marginPct = p.costPrice > 0 ? Math.round((margin / p.costPrice) * 100) : 100;
      return [
        `"${p.id}"`,
        `"${p.name}"`,
        `"${p.nameAr || ''}"`,
        `"${p.category}"`,
        `"${p.sector}"`,
        p.costPrice,
        p.price,
        margin,
        `"${marginPct}%"`,
        p.stock,
        `"${p.barcode}"`,
        p.isWeighted ? 'Oui' : 'Non'
      ];
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `catalogue_stock_caissa_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      nameAr: '',
      category: sector === 'restaurant' ? 'Plats Traditionnels' : 'Épicerie & Céréales',
      price: '',
      costPrice: '',
      barcode: `${Math.floor(22200000 + Math.random() * 999999)}`,
      stock: '50',
      isWeighted: false,
      sector: sector,
      image: sector === 'restaurant' ? '🍲' : '📦'
    });
    setEditingProduct(null);
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      nameAr: p.nameAr || '',
      category: p.category,
      price: p.price.toString(),
      costPrice: p.costPrice.toString(),
      barcode: p.barcode,
      stock: p.stock.toString(),
      isWeighted: Boolean(p.isWeighted),
      sector: p.sector,
      image: p.image
    });
    setIsAddModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert("Veuillez renseigner le nom et le prix de vente en MRU.");
      return;
    }

    try {
      if (editingProduct) {
        // Update
        const payload = {
          ...formData,
          price: parseFloat(formData.price),
          costPrice: parseFloat(formData.costPrice || '0'),
          stock: parseInt(formData.stock || '0')
        };
        await updateProductApi(editingProduct.id, payload);
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...payload } : p));
      } else {
        // Create
        const payload = {
          ...formData,
          price: parseFloat(formData.price),
          costPrice: parseFloat(formData.costPrice || '0'),
          stock: parseInt(formData.stock || '0')
        };
        const res = await createProductApi(payload);
        if (res && res.product) {
          setProducts(prev => [...prev, res.product]);
        }
      }
      setIsAddModalOpen(false);
    } catch (err) {
      console.warn('Erreur sauvegarde produit', err);
      setIsAddModalOpen(false);
    }
  };

  // Filter calculations
  const categories = Array.from(new Set(products.map(p => p.category)));

  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery) ||
      (p.nameAr && p.nameAr.includes(searchQuery));
    
    const matchesCategory = selectedCategory === 'ALL' || p.category === selectedCategory;

    let matchesStock = true;
    if (stockStatusFilter === 'LOW') matchesStock = p.stock > 0 && p.stock <= 10;
    if (stockStatusFilter === 'OUT') matchesStock = p.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  // KPI Metrics
  const totalStockValueCost = products.reduce((sum, p) => sum + (p.stock * p.costPrice), 0);
  const totalStockValueRetail = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
  const lowStockCount = products.filter(p => p.stock > 0 && p.stock <= 10).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Banner & Financial Stock Valuation */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'var(--bg-secondary)',
        padding: '16px 20px',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-glass)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #10b981, #059669)',
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            <Package size={24} color="#fff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              Gestion des Stocks & Catalogue Articles (MRU)
            </h1>
            <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Suivi des seuils d'alerte, prix d'achat/vente, pesée au kg et inventaire en temps réel.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleExportStockCSV}
            className="btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 14px', fontSize: '0.85rem' }}
            title="Exporter le catalogue en fichier Excel / CSV"
          >
            <Download size={15} />
            <span>Exporter CSV</span>
          </button>
          <button
            onClick={handleOpenAddModal}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 18px', fontSize: '0.85rem' }}
          >
            <Plus size={16} />
            <span>Ajouter un Nouvel Article</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '16px'
      }}>
        <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
            Valeur du Stock (Prix d'Achat)
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '4px' }}>
            {totalStockValueCost.toLocaleString('fr-FR')} <span style={{ fontSize: '0.8rem' }}>MRU</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Coût d'acquisition total immobilisé
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
            Valeur Potentielle (Prix Vente)
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-emerald)', marginTop: '4px' }}>
            {totalStockValueRetail.toLocaleString('fr-FR')} <span style={{ fontSize: '0.8rem' }}>MRU</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)', marginTop: '2px' }}>
            +{((totalStockValueRetail - totalStockValueCost)).toLocaleString('fr-FR')} MRU de marge brute
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
            Articles en Alerte Faible
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: lowStockCount > 0 ? '#f59e0b' : 'var(--text-main)', marginTop: '4px' }}>
            {lowStockCount} <span style={{ fontSize: '0.8rem' }}>articles (≤ 10)</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: '#f59e0b', marginTop: '2px' }}>
            À réapprovisionner rapidement
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '16px', borderRadius: 'var(--radius-md)' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
            Ruptures de Stock
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: outOfStockCount > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)', marginTop: '4px' }}>
            {outOfStockCount} <span style={{ fontSize: '0.8rem' }}>épuisés</span>
          </div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Non disponibles à la caisse
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
          <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Rechercher par article, code-barres (ex: 2221...), nom arabe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 38px',
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-main)',
              fontSize: '0.85rem'
            }}
          />
        </div>

        {/* Categories selector */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-glass)',
            color: 'var(--text-main)',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <option value="ALL">Toutes les Catégories</option>
          {categories.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {/* Stock status filter buttons */}
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setStockStatusFilter('ALL')}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: stockStatusFilter === 'ALL' ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
              color: stockStatusFilter === 'ALL' ? '#ffffff' : 'var(--text-muted)'
            }}
          >
            Tous ({products.length})
          </button>
          <button
            onClick={() => setStockStatusFilter('LOW')}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: stockStatusFilter === 'LOW' ? '#f59e0b' : 'var(--bg-secondary)',
              color: stockStatusFilter === 'LOW' ? '#ffffff' : '#f59e0b'
            }}
          >
            Stock Faible ({lowStockCount})
          </button>
          <button
            onClick={() => setStockStatusFilter('OUT')}
            style={{
              padding: '8px 12px',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: 600,
              background: stockStatusFilter === 'OUT' ? 'var(--accent-rose)' : 'var(--bg-secondary)',
              color: stockStatusFilter === 'OUT' ? '#ffffff' : 'var(--accent-rose)'
            }}
          >
            Rupture ({outOfStockCount})
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-glass)',
        overflow: 'hidden'
      }}>
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chargement du stock...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Aucun article trouvé. Cliquez sur "Ajouter un Nouvel Article" pour enrichir le catalogue.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-glass)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '12px 16px' }}>Article & Code</th>
                  <th style={{ padding: '12px 16px' }}>Catégorie</th>
                  <th style={{ padding: '12px 16px' }}>Type</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Prix Achat (Coût)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Prix Vente (TTC)</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Marge Unitaire</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Stock Actuel</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Ajustement Rapide</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map(p => {
                  const unitMargin = p.price - p.costPrice;
                  const marginPercent = p.price > 0 ? ((unitMargin / p.price) * 100).toFixed(0) : '0';

                  return (
                    <tr
                      key={p.id}
                      style={{
                        borderBottom: '1px solid var(--border-glass)',
                        transition: 'background 0.15s ease'
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1.3rem' }}>{p.image}</span>
                          <div>
                            <div style={{ fontWeight: 700, color: 'var(--text-main)' }}>{p.name}</div>
                            {p.nameAr && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', direction: 'rtl' }}>
                                {p.nameAr}
                              </div>
                            )}
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                              <Barcode size={12} /> {p.barcode}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px', color: 'var(--text-muted)' }}>
                        <span style={{ background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>
                          {p.category}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        {p.isWeighted ? (
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                            <Scale size={11} /> Pesé (Kg)
                          </span>
                        ) : (
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.75rem' }}>Pièce / Unité</span>
                        )}
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right', color: 'var(--text-dim)' }}>
                        {p.costPrice} MRU
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 800, color: 'var(--text-main)' }}>
                        {p.price} MRU
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <span style={{ color: unitMargin >= 0 ? 'var(--accent-emerald)' : 'var(--accent-rose)', fontWeight: 700 }}>
                          +{unitMargin} MRU ({marginPercent}%)
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '999px',
                          fontWeight: 800,
                          fontSize: '0.8rem',
                          background: p.stock === 0 
                            ? 'rgba(239, 68, 68, 0.15)' 
                            : p.stock <= 10 
                              ? 'rgba(245, 158, 11, 0.15)' 
                              : 'rgba(16, 185, 129, 0.15)',
                          color: p.stock === 0 
                            ? 'var(--accent-rose)' 
                            : p.stock <= 10 
                              ? '#f59e0b' 
                              : 'var(--accent-emerald)'
                        }}>
                          {p.stock} {p.isWeighted ? 'kg' : 'pcs'}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <button
                            onClick={() => handleAdjustStock(p.id, -5)}
                            className="btn-secondary"
                            style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                            title="-5 unités"
                          >
                            -5
                          </button>
                          <button
                            onClick={() => handleAdjustStock(p.id, -1)}
                            className="btn-secondary"
                            style={{ padding: '2px 6px', fontSize: '0.7rem' }}
                            title="-1 unité"
                          >
                            -1
                          </button>
                          <button
                            onClick={() => handleAdjustStock(p.id, 1)}
                            className="btn-secondary"
                            style={{ padding: '2px 6px', fontSize: '0.7rem', color: 'var(--accent-emerald)' }}
                            title="+1 unité"
                          >
                            +1
                          </button>
                          <button
                            onClick={() => handleAdjustStock(p.id, 10)}
                            className="btn-secondary"
                            style={{ padding: '2px 6px', fontSize: '0.7rem', color: 'var(--accent-emerald)' }}
                            title="+10 unités"
                          >
                            +10
                          </button>
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-primary)', padding: '4px' }}
                            title="Modifier l'article"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-rose)', padding: '4px' }}
                            title="Supprimer l'article"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
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
            maxWidth: '520px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '1px solid var(--border-glass)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                {editingProduct ? 'Modifier l\'Article' : 'Ajouter un Nouvel Article (Mauritanie)'}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px' }}>
                  Désignation de l'article (Français) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Riz au Poisson (Ceebu Jën / Thieb)"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px' }}>
                  Nom en Arabe / Hassaniya (Optionnel)
                </label>
                <input
                  type="text"
                  placeholder="ex: مارو بالحوت"
                  dir="rtl"
                  value={formData.nameAr}
                  onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px' }}>
                    Catégorie
                  </label>
                  <input
                    type="text"
                    placeholder="ex: Plats Traditionnels"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px' }}>
                    Code-barres / Référence
                  </label>
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px' }}>
                    Prix Vente (MRU) *
                  </label>
                  <input
                    type="number"
                    step="any"
                    required
                    placeholder="150"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--accent-emerald)',
                      fontWeight: 800,
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px' }}>
                    Prix Achat / Coût (MRU)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="85"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-main)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', marginBottom: '4px' }}>
                    Stock Initial
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--text-main)',
                      fontSize: '0.95rem'
                    }}
                  />
                </div>
              </div>

              {/* Calculateur de Marge en Direct */}
              {formData.price && formData.costPrice && parseFloat(formData.price) > 0 && (
                <div style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  background: parseFloat(formData.price) >= parseFloat(formData.costPrice || '0') ? 'rgba(22, 163, 74, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid',
                  borderColor: parseFloat(formData.price) >= parseFloat(formData.costPrice || '0') ? 'rgba(22, 163, 74, 0.3)' : 'rgba(239, 68, 68, 0.3)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '0.8rem',
                  marginTop: '8px'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>Marge commerciale estimée :</span>
                  <strong style={{ color: parseFloat(formData.price) >= parseFloat(formData.costPrice || '0') ? '#16a34a' : '#ef4444' }}>
                    +{(parseFloat(formData.price) - parseFloat(formData.costPrice || '0')).toFixed(0)} MRU (
                    {parseFloat(formData.costPrice || '0') > 0
                      ? Math.round(((parseFloat(formData.price) - parseFloat(formData.costPrice || '0')) / parseFloat(formData.costPrice || '1')) * 100)
                      : 100}%)
                  </strong>
                </div>
              )}

              {/* Toggles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', color: 'var(--text-main)' }}>
                  <input
                    type="checkbox"
                    checked={formData.isWeighted}
                    onChange={(e) => setFormData({ ...formData, isWeighted: e.target.checked })}
                  />
                  <span>Article pesé à la balance (au Kg)</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ padding: '8px 20px', fontWeight: 700 }}
                >
                  {editingProduct ? 'Mettre à jour' : 'Enregistrer l\'Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
