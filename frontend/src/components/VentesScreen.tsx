import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Printer, 
  Smartphone, 
  Banknote, 
  BookOpen, 
  Download,
  RotateCcw,
  Calendar,
  CreditCard,
  Receipt
} from 'lucide-react';
import { getOrdersApi } from '../services/api';
import { getAllLocalOrders } from '../services/offlineDb';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  weightInKg?: number;
  unitPrice: number;
  totalPrice: number;
  notes?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  deliveryFee?: number;
  total: number;
  paymentMethod: 'ESPECES' | 'BANKILY' | 'MASRVI' | 'CARTE_TPE' | 'CARTE' | 'KRIDI';
  paymentReference?: string;
  cashGiven?: number;
  changeDue?: number;
  tableNumber?: string;
  customerName?: string;
  kridiCustomerId?: string;
  createdAt: string;
  status?: 'PAYE' | 'ANNULE';
}

export const VentesScreen: React.FC = () => {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [paymentFilter, setPaymentFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<'ALL' | 'TODAY' | 'WEEK'>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<OrderRecord | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const [apiData, localOrders] = await Promise.allSettled([
        getOrdersApi(),
        getAllLocalOrders()
      ]);

      const cloudList = apiData.status === 'fulfilled' && apiData.value?.orders ? apiData.value.orders : [];
      const offlineList = localOrders.status === 'fulfilled' ? localOrders.value : [];

      // Fusionner intelligemment par orderNumber / id sans doublon
      const map = new Map<string, any>();
      cloudList.forEach((o: any) => map.set(o.orderNumber || o.id, { ...o, status: o.status || 'PAYE' }));
      offlineList.forEach((o: any) => {
        const key = o.orderNumber || o.id;
        if (!map.has(key)) {
          map.set(key, { ...o, status: 'PAYE' });
        }
      });

      const merged = Array.from(map.values()).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setOrders(merged);
    } catch (err) {
      console.warn('Chargement des commandes depuis fallback local', err);
      const local = await getAllLocalOrders();
      setOrders(local.map(o => ({ ...o, status: 'PAYE' })) as any);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Annulation / Remboursement de ticket (Avoir)
  const handleCancelOrder = (orderId: string, orderNumber: string) => {
    if (!window.confirm(`Confirmer l'annulation du ticket ${orderNumber} et la génération d'un avoir ?`)) return;

    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: 'ANNULE' } : o));
    showToast(`Ticket ${orderNumber} annulé avec succès. Avoir comptabilisé.`);
  };

  // Exportation des ventes au format CSV / Excel
  const handleExportCSV = () => {
    if (orders.length === 0) return;

    const headers = ['N° Ticket', 'Date', 'Type / Table', 'Client', 'Articles', 'Mode Paiement', 'Sous-Total (MRU)', 'Remise (MRU)', 'Total TTC (MRU)', 'Statut'];
    const rows = filteredOrders.map(o => [
      `"${o.orderNumber}"`,
      `"${new Date(o.createdAt).toLocaleDateString('fr-TN')} ${new Date(o.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}"`,
      `"${o.tableNumber || 'Emporter / Comptoir'}"`,
      `"${o.customerName || 'Client Comptoir'}"`,
      `"${o.items.map(it => `${it.quantity}x ${it.productName}`).join('; ')}"`,
      `"${o.paymentMethod}"`,
      o.subtotal || o.total,
      o.discountAmount || 0,
      o.total,
      `"${o.status || 'PAYE'}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ventes_caissa_mr_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Journal des ventes exporté (${filteredOrders.length} tickets en CSV)`);
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (order.tableNumber && order.tableNumber.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (order.customerName && order.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      order.items.some(it => it.productName.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesPayment = paymentFilter === 'ALL' || order.paymentMethod === paymentFilter;

    let matchesDate = true;
    if (dateFilter === 'TODAY') {
      const orderDate = new Date(order.createdAt).toDateString();
      const today = new Date().toDateString();
      matchesDate = orderDate === today;
    } else if (dateFilter === 'WEEK') {
      const orderTime = new Date(order.createdAt).getTime();
      const oneWeekAgo = Date.now() - 7 * 86400000;
      matchesDate = orderTime >= oneWeekAgo;
    }

    return matchesSearch && matchesPayment && matchesDate;
  });

  const totalFilteredSales = filteredOrders
    .filter(o => o.status !== 'ANNULE')
    .reduce((sum, o) => sum + o.total, 0);

  const getPaymentBadge = (method: string) => {
    switch (method) {
      case 'BANKILY':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(234, 88, 12, 0.15)', color: '#ea580c', border: '1px solid rgba(234, 88, 12, 0.3)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
            <Smartphone size={12} /> Bankily
          </span>
        );
      case 'MASRVI':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(2, 132, 199, 0.15)', color: '#0284c7', border: '1px solid rgba(2, 132, 199, 0.3)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
            <CreditCard size={12} /> Masrvi
          </span>
        );
      case 'ESPECES':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(16, 185, 129, 0.15)', color: '#16a34a', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
            <Banknote size={12} /> Espèces
          </span>
        );
      case 'KRIDI':
        return (
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 700 }}>
            <BookOpen size={12} /> الكريدي
          </span>
        );
      default:
        return (
          <span style={{ padding: '3px 8px', borderRadius: '6px', fontSize: '0.72rem', background: 'var(--bg-tertiary)', color: 'var(--text-muted)' }}>
            {method}
          </span>
        );
    }
  };

  return (
    <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Toast */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: '#047857',
          color: '#ffffff',
          padding: '10px 20px',
          borderRadius: '999px',
          fontWeight: 700,
          fontSize: '0.85rem',
          boxShadow: '0 8px 20px rgba(4, 120, 87, 0.4)'
        }}>
          {toastMessage}
        </div>
      )}

      {/* ── HEADER ── */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-glass)',
        borderRadius: '12px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px'
      }}>
        {/* Left: Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: '#059669', width: '40px', height: '40px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Receipt size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>Journal des Ventes</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '2px' }}>Tickets encaissés • Réimpression thermique • Avoirs & Annulations</div>
          </div>
        </div>

        {/* Right: KPIs + Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { label: 'CA Total', value: `${totalFilteredSales.toLocaleString('fr-FR')} MRU`, color: '#059669', bg: 'rgba(5,150,105,0.1)' },
            { label: 'Tickets', value: filteredOrders.length, color: 'var(--text-main)', bg: 'var(--bg-tertiary)' },
            { label: 'Ticket Moy.', value: filteredOrders.length > 0 ? `${Math.round(totalFilteredSales / filteredOrders.filter(o => o.status !== 'ANNULE').length || 0)} MRU` : '—', color: '#0284c7', bg: 'rgba(2,132,199,0.1)' }
          ].map((kpi, i) => (
            <div key={i} style={{ padding: '5px 12px', background: kpi.bg, border: '1px solid var(--border-glass)', borderRadius: '8px', textAlign: 'right' }}>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>{kpi.label}</div>
              <div style={{ fontWeight: 900, fontSize: '0.95rem', color: kpi.color, lineHeight: 1.2 }}>{kpi.value}</div>
            </div>
          ))}
          <button
            onClick={handleExportCSV}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-glass)', borderRadius: '8px', color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s' }}
          >
            <Download size={13} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* ── FILTER BAR ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="N° ticket, client, table, article..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: '100%', padding: '7px 12px 7px 34px', borderRadius: '8px', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', color: 'var(--text-main)', fontSize: '0.82rem' }}
          />
        </div>

        {/* Date Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '2px', gap: '2px' }}>
          {[
            { id: 'ALL', label: 'Tout' },
            { id: 'TODAY', label: "Aujourd'hui" },
            { id: 'WEEK', label: '7 jours' }
          ].map(d => (
            <button key={d.id} onClick={() => setDateFilter(d.id as any)} style={{ border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: dateFilter === d.id ? 700 : 500, background: dateFilter === d.id ? '#059669' : 'transparent', color: dateFilter === d.id ? '#fff' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '4px' }}>
              {d.id === 'TODAY' && <Calendar size={11} />}<span>{d.label}</span>
            </button>
          ))}
        </div>

        {/* Payment Tabs */}
        <div style={{ display: 'flex', background: 'var(--bg-secondary)', border: '1px solid var(--border-glass)', borderRadius: '8px', padding: '2px', gap: '2px' }}>
          {[
            { id: 'ALL', label: 'Tout' },
            { id: 'ESPECES', label: 'Espèces' },
            { id: 'BANKILY', label: 'Bankily' },
            { id: 'MASRVI', label: 'Masrvi' },
            { id: 'KRIDI', label: 'الكريدي' }
          ].map(tab => (
            <button key={tab.id} onClick={() => setPaymentFilter(tab.id)} style={{ border: 'none', padding: '5px 10px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: paymentFilter === tab.id ? 700 : 500, background: paymentFilter === tab.id ? '#059669' : 'transparent', color: paymentFilter === tab.id ? '#fff' : 'var(--text-muted)', cursor: 'pointer', transition: 'all 0.15s' }}>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table of Orders */}
      <div className="glass-panel" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chargement des tickets de vente...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
            Aucun ticket de vente ne correspond aux critères.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-glass)', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                  <th style={{ padding: '10px 14px' }}>N° Commande</th>
                  <th style={{ padding: '10px 14px' }}>Date & Heure</th>
                  <th style={{ padding: '10px 14px' }}>Client / Table</th>
                  <th style={{ padding: '10px 14px' }}>Détail des Articles</th>
                  <th style={{ padding: '10px 14px' }}>Règlement</th>
                  <th style={{ padding: '10px 14px' }}>Statut</th>
                  <th style={{ padding: '10px 14px', textAlign: 'right' }}>Total</th>
                  <th style={{ padding: '10px 14px', textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => {
                  const dateFormatted = order.createdAt 
                    ? new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
                    : '14:30';

                  const isCancelled = order.status === 'ANNULE';

                  return (
                    <tr 
                      key={order.id}
                      style={{
                        borderBottom: '1px solid var(--border-glass)',
                        opacity: isCancelled ? 0.5 : 1,
                        background: isCancelled ? 'rgba(239, 68, 68, 0.04)' : 'transparent',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <td style={{ padding: '10px 14px', fontWeight: 800, color: isCancelled ? 'var(--text-dim)' : 'var(--accent-primary)' }}>
                        {order.orderNumber}
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>
                        {dateFormatted}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <div>
                          {order.tableNumber ? (
                            <span style={{ background: 'rgba(5, 150, 105, 0.12)', color: '#059669', padding: '2px 6px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 700 }}>
                              {order.tableNumber}
                            </span>
                          ) : (
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem' }}>Comptoir</span>
                          )}
                          {order.customerName && (
                            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '2px' }}>
                              👤 {order.customerName}
                            </div>
                          )}
                        </div>
                      </td>
                      <td style={{ padding: '10px 14px', color: 'var(--text-main)', maxWidth: '220px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {order.items.map(it => `${it.quantity}x ${it.productName}`).join(', ')}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        {getPaymentBadge(order.paymentMethod)}
                      </td>
                      <td style={{ padding: '10px 14px' }}>
                        <span style={{
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontSize: '0.68rem',
                          fontWeight: 700,
                          background: isCancelled ? 'rgba(239, 68, 68, 0.15)' : 'rgba(22, 163, 74, 0.15)',
                          color: isCancelled ? '#ef4444' : '#16a34a'
                        }}>
                          {isCancelled ? 'ANNULÉ' : 'PAYÉ'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 800, fontSize: '0.95rem', textDecoration: isCancelled ? 'line-through' : 'none' }}>
                        {order.total.toLocaleString('fr-FR')} <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>MRU</span>
                      </td>
                      <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', gap: '6px' }}>
                          <button
                            onClick={() => {
                              setSelectedOrder(order);
                              setShowReceiptModal(true);
                            }}
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.72rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                            title="Voir et Réimprimer le ticket thermique"
                          >
                            <Printer size={13} />
                            <span>Imprimer</span>
                          </button>

                          {!isCancelled && (
                            <button
                              onClick={() => handleCancelOrder(order.id, order.orderNumber)}
                              className="btn-secondary"
                              style={{ padding: '4px 6px', fontSize: '0.72rem', color: 'var(--accent-rose)', borderColor: 'rgba(239, 68, 68, 0.3)' }}
                              title="Annuler le ticket et générer un avoir"
                            >
                              <RotateCcw size={12} />
                            </button>
                          )}
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

      {/* Ticket Reprint Modal */}
      {showReceiptModal && selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{ width: '380px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="receipt-paper">
              <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'inline-block', background: '#334155', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontSize: '0.65rem', fontWeight: 800, marginBottom: '4px' }}>
                  DUPLICATA / RÉIMPRESSION
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 900, margin: 0 }}>CAISSA MAURITANIE</h3>
                <div style={{ fontSize: '0.72rem' }}>Tevragh-Zeina, Nouakchott</div>
                <div style={{ fontSize: '0.72rem' }}>Tél: +222 45 25 00 00 • NIF: 12048592/RIM</div>
              </div>

              <div style={{ borderTop: '1px dashed #111', borderBottom: '1px dashed #111', padding: '6px 0', margin: '8px 0', fontSize: '0.75rem' }}>
                <div>Ticket : #{selectedOrder.orderNumber}</div>
                <div>Date : {new Date(selectedOrder.createdAt).toLocaleDateString('fr-TN')} {new Date(selectedOrder.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</div>
                {selectedOrder.tableNumber && <div>Table : <strong>{selectedOrder.tableNumber}</strong></div>}
                {selectedOrder.customerName && <div>Client : <strong>{selectedOrder.customerName}</strong></div>}
                <div>Règlement : <strong>{selectedOrder.paymentMethod}</strong> {selectedOrder.paymentReference ? `(${selectedOrder.paymentReference})` : ''}</div>
                {selectedOrder.status === 'ANNULE' && (
                  <div style={{ color: '#dc2626', fontWeight: 800, marginTop: '2px' }}>*** TICKET ANNULÉ / AVOIR ***</div>
                )}
              </div>

              <div style={{ fontSize: '0.78rem', display: 'flex', flexDirection: 'column', gap: '4px', margin: '8px 0' }}>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{it.quantity}x {it.productName}</span>
                    <strong>{it.totalPrice || (it.unitPrice * it.quantity)} MRU</strong>
                  </div>
                ))}
              </div>

              <div style={{ borderTop: '1px dashed #111', paddingTop: '6px', marginTop: '6px', fontSize: '0.82rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Sous-total HT :</span>
                  <span>{((selectedOrder.subtotal || selectedOrder.total) * 0.84).toFixed(0)} MRU</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#555' }}>
                  <span>TVA (16%) :</span>
                  <span>{((selectedOrder.subtotal || selectedOrder.total) * 0.16).toFixed(0)} MRU</span>
                </div>
                {selectedOrder.discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                    <span>Remise :</span>
                    <span>-{selectedOrder.discountAmount} MRU</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.25rem', fontWeight: 900, marginTop: '4px' }}>
                  <span>TOTAL TTC :</span>
                  <span>{selectedOrder.total} MRU</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.72rem', color: '#555' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>*** Duplicata Conforme ***</p>
                <p style={{ margin: '2px 0 0 0', direction: 'rtl' }}>نسخة مطابقة للأصل</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => window.print()}
                className="btn-primary"
                style={{ flex: 1 }}
              >
                <Printer size={15} /> Imprimer Reçu
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
