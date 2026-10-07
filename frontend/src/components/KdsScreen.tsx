import React, { useState, useEffect } from 'react';
import { ChefHat, Clock, CheckCircle2, Flame, RefreshCw, Utensils, AlertTriangle, Bell } from 'lucide-react';
import type { KitchenOrder } from '../data/mockData';
import { INITIAL_KITCHEN_ORDERS } from '../data/mockData';
import { getKdsOrdersApi, updateKdsStatusApi } from '../services/api';

export const KdsScreen: React.FC = () => {
  const [orders, setOrders] = useState<KitchenOrder[]>(INITIAL_KITCHEN_ORDERS);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [now, setNow] = useState<Date>(new Date());

  // Horloge en temps réel pour les timers
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);

  const fetchKds = async () => {
    setIsLoading(true);
    try {
      const data = await getKdsOrdersApi();
      if (data?.kitchenOrders?.length > 0) {
        setOrders(data.kitchenOrders);
      }
    } catch { /* fallback local */ }
    finally { setIsLoading(false); }
  };

  useEffect(() => {
    fetchKds();
    const interval = setInterval(fetchKds, 8000);
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId: string, nextStatus: KitchenOrder['status']) => {
    try { await updateKdsStatusApi(orderId, nextStatus); } catch { /* fallback */ }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: nextStatus } : o));
  };

  const archiveOrder = (orderId: string) => {
    setOrders(prev => prev.filter(o => o.id !== orderId));
  };

  // Colonnes kanban KDS
  const lanes = [
    {
      key: 'en_attente',
      label: 'À Préparer',
      labelAr: 'في الانتظار',
      color: '#dc2626',
      bg: 'rgba(220, 38, 38, 0.08)',
      border: 'rgba(220, 38, 38, 0.3)',
      headerBg: '#dc2626',
      icon: <Bell size={15} />,
    },
    {
      key: 'en_preparation',
      label: 'En Cuisson',
      labelAr: 'في الطهي',
      color: '#d97706',
      bg: 'rgba(217, 119, 6, 0.08)',
      border: 'rgba(217, 119, 6, 0.3)',
      headerBg: '#d97706',
      icon: <Flame size={15} />,
    },
    {
      key: 'pret',
      label: 'Prêt à Servir',
      labelAr: 'جاهز للتقديم',
      color: '#059669',
      bg: 'rgba(5, 150, 105, 0.08)',
      border: 'rgba(5, 150, 105, 0.3)',
      headerBg: '#059669',
      icon: <CheckCircle2 size={15} />,
    }
  ] as const;

  const totalOrders = orders.length;
  const urgentCount = orders.filter(o => o.status === 'en_attente').length;
  const currentTime = now.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: '14px', minHeight: 'calc(100vh - 80px)' }}>

      {/* ── HEADER KDS ── */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-glass)',
        borderRadius: '12px',
        padding: '14px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Left: Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#d97706',
            width: '40px', height: '40px',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0
          }}>
            <ChefHat size={20} color="#fff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
                Écran Cuisine — Kitchen Display
              </span>
              <span style={{
                background: 'rgba(5, 150, 105, 0.15)',
                color: '#059669',
                border: '1px solid rgba(5, 150, 105, 0.3)',
                padding: '2px 8px',
                borderRadius: '999px',
                fontSize: '0.65rem',
                fontWeight: 800
              }}>
                ● LIVE {currentTime}
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Synchronisation automatique avec le POS toutes les 8 secondes
            </div>
          </div>
        </div>

        {/* Right: Stats + Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Stats pills */}
          <div style={{ display: 'flex', gap: '8px' }}>
            <div style={{
              padding: '6px 12px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1 }}>{totalOrders}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', marginTop: '2px' }}>Total Bons</div>
            </div>
            {urgentCount > 0 && (
              <div style={{
                padding: '6px 12px',
                background: 'rgba(220, 38, 38, 0.12)',
                border: '1px solid rgba(220, 38, 38, 0.3)',
                borderRadius: '8px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#dc2626', lineHeight: 1 }}>{urgentCount}</div>
                <div style={{ fontSize: '0.6rem', color: '#dc2626', fontWeight: 700, textTransform: 'uppercase', marginTop: '2px' }}>Urgents</div>
              </div>
            )}
          </div>

          <button
            onClick={fetchKds}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '7px 14px',
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              color: 'var(--text-muted)',
              fontSize: '0.78rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            <RefreshCw size={13} style={{ animation: isLoading ? 'spin 0.8s linear infinite' : 'none' }} />
            Actualiser
          </button>
        </div>
      </div>

      {/* ── KANBAN BOARD ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '14px',
        flex: 1
      }}>
        {lanes.map(lane => {
          const laneOrders = orders.filter(o => o.status === lane.key);

          return (
            <div key={lane.key} style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: lane.bg,
              border: `1px solid ${lane.border}`,
              borderRadius: '12px',
              padding: '0',
              overflow: 'hidden'
            }}>
              {/* Lane Header */}
              <div style={{
                background: lane.headerBg,
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#fff' }}>{lane.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#fff' }}>{lane.label}</div>
                    <div style={{ fontSize: '0.62rem', color: 'rgba(255,255,255,0.75)', direction: 'rtl' }}>{lane.labelAr}</div>
                  </div>
                </div>
                <span style={{
                  background: 'rgba(255,255,255,0.25)',
                  color: '#fff',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {laneOrders.length}
                </span>
              </div>

              {/* Lane Cards */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '10px', overflowY: 'auto' }}>
                {laneOrders.length === 0 && (
                  <div style={{
                    textAlign: 'center',
                    padding: '28px 16px',
                    color: lane.color,
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    opacity: 0.6
                  }}>
                    <Utensils size={28} style={{ display: 'block', margin: '0 auto 8px', opacity: 0.4 }} />
                    Aucune commande
                  </div>
                )}
                {laneOrders.map(order => (
                  <KdsCard
                    key={order.id}
                    order={order}
                    laneColor={lane.color}
                    onUpdateStatus={updateStatus}
                    onArchive={archiveOrder}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ── KDS CARD COMPONENT ──
interface KdsCardProps {
  order: KitchenOrder;
  laneColor: string;
  onUpdateStatus: (id: string, status: KitchenOrder['status']) => void;
  onArchive: (id: string) => void;
}

const KdsCard: React.FC<KdsCardProps> = ({ order, laneColor, onUpdateStatus, onArchive }) => {
  const isUrgent = order.status === 'en_attente';
  const isReady = order.status === 'pret';

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: `1px solid var(--border-glass)`,
      borderLeft: `4px solid ${laneColor}`,
      borderRadius: '9px',
      padding: '12px 14px',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      boxShadow: isUrgent ? '0 2px 8px rgba(220,38,38,0.15)' : 'none',
      animation: isUrgent ? undefined : undefined
    }}>
      {/* Card Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {isUrgent && (
              <span style={{ color: '#dc2626' }}>
                <AlertTriangle size={13} />
              </span>
            )}
            <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)' }}>
              {order.tableNumber}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px', color: 'var(--text-dim)', fontSize: '0.7rem' }}>
            <Clock size={11} />
            <span>{order.time}</span>
          </div>
        </div>
        <span style={{
          fontFamily: 'monospace',
          fontSize: '0.68rem',
          fontWeight: 800,
          color: 'var(--text-dim)',
          background: 'var(--bg-tertiary)',
          padding: '2px 6px',
          borderRadius: '4px',
          border: '1px solid var(--border-glass)'
        }}>
          #{order.id}
        </span>
      </div>

      {/* Items List */}
      <div style={{
        background: 'var(--bg-primary)',
        borderRadius: '7px',
        border: '1px solid var(--border-glass)',
        overflow: 'hidden'
      }}>
        {order.items.map((item, idx) => (
          <div key={idx} style={{
            padding: '7px 10px',
            borderBottom: idx < order.items.length - 1 ? '1px solid var(--border-glass)' : 'none',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 600, fontSize: '0.82rem', color: 'var(--text-main)' }}>
                {item.name}
              </span>
              <span style={{
                background: laneColor,
                color: '#fff',
                fontWeight: 800,
                fontSize: '0.72rem',
                padding: '1px 7px',
                borderRadius: '999px',
                minWidth: '24px',
                textAlign: 'center'
              }}>
                ×{item.quantity}
              </span>
            </div>
            {item.notes && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.7rem',
                color: '#d97706',
                fontWeight: 600
              }}>
                <Flame size={11} />
                <span>{item.notes}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '6px' }}>
        {order.status === 'en_attente' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'en_preparation')}
            style={{
              flex: 1,
              padding: '8px',
              background: '#d97706',
              border: 'none',
              borderRadius: '7px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              transition: 'all 0.15s'
            }}
          >
            <Flame size={14} />
            Lancer Cuisson
          </button>
        )}
        {order.status === 'en_preparation' && (
          <button
            onClick={() => onUpdateStatus(order.id, 'pret')}
            style={{
              flex: 1,
              padding: '8px',
              background: '#059669',
              border: 'none',
              borderRadius: '7px',
              color: '#fff',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              transition: 'all 0.15s'
            }}
          >
            <CheckCircle2 size={14} />
            Marquer Prêt
          </button>
        )}
        {isReady && (
          <button
            onClick={() => onArchive(order.id)}
            style={{
              flex: 1,
              padding: '8px',
              background: '#0f172a',
              border: '1px solid #059669',
              borderRadius: '7px',
              color: '#059669',
              fontWeight: 700,
              fontSize: '0.78rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              transition: 'all 0.15s'
            }}
          >
            <CheckCircle2 size={14} />
            Servi — Archiver
          </button>
        )}
      </div>
    </div>
  );
};
