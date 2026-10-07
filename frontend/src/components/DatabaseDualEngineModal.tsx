import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Cloud, 
  HardDrive, 
  CheckCircle2, 
  RefreshCw, 
  Wifi, 
  WifiOff, 
  ShieldCheck, 
  Layers, 
  Clock, 
  Eye,
  Trash2,
  X
} from 'lucide-react';
import { 
  getLocalDatabaseStats, 
  getAllLocalOrders, 
  syncOfflineOrdersToCloud, 
  offlineDb,
  type OfflineOrder 
} from '../services/offlineDb';

interface DatabaseDualEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  isBackendConnected: boolean;
  onToggleSimulateOffline?: (isOffline: boolean) => void;
  isSimulatingOffline?: boolean;
  onSyncCompleted?: () => void;
}

export const DatabaseDualEngineModal: React.FC<DatabaseDualEngineModalProps> = ({
  isOpen,
  onClose,
  isBackendConnected,
  onToggleSimulateOffline,
  isSimulatingOffline = false,
  onSyncCompleted
}) => {
  const [stats, setStats] = useState({
    productCount: 0,
    totalOrders: 0,
    unsyncedOrders: 0,
    syncedOrders: 0,
    estimatedSizeKb: 0
  });
  const [localOrders, setLocalOrders] = useState<OfflineOrder[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'inspector'>('overview');
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<string | null>(null);

  const loadStatsAndOrders = async () => {
    try {
      const s = await getLocalDatabaseStats();
      setStats(s);
      const orders = await getAllLocalOrders();
      setLocalOrders(orders);
    } catch (err) {
      console.warn('Erreur chargement stats DB :', err);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadStatsAndOrders();
    }
  }, [isOpen]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncFeedback(null);
    try {
      const res = await syncOfflineOrdersToCloud();
      setSyncFeedback(`✅ Synchronisation terminée : ${res.syncedCount} ticket(s) synchronisé(s) vers Neon PostgreSQL.`);
      await loadStatsAndOrders();
      if (onSyncCompleted) onSyncCompleted();
    } catch (err: any) {
      setSyncFeedback(`⚠️ Erreur de synchronisation : ${err.message || 'Serveur indisponible'}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleClearCache = async () => {
    if (window.confirm("Voulez-vous réinitialiser le cache local des commandes ? Les données sur Neon Cloud restent intactes.")) {
      await offlineDb.orders.clear();
      await loadStatsAndOrders();
    }
  };

  if (!isOpen) return null;

  return (
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
      zIndex: 99999,
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-glass)',
        borderRadius: 'var(--radius-xl)',
        width: '100%',
        maxWidth: '850px',
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.6)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'var(--bg-secondary)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-md)',
              background: '#059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
            }}>
              <Database size={22} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
                  Architecture Double Base de Données
                </h3>
                <span style={{
                  fontSize: '0.7rem',
                  padding: '2px 8px',
                  borderRadius: '999px',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--accent-emerald)',
                  fontWeight: 800,
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  DUAL-ENGINE ACTIF
                </span>
              </div>
              <p style={{ margin: '3px 0 0', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Base 1 (PostgreSQL Cloud) + Base 2 (IndexedDB Locale Hors-Ligne)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'var(--bg-tertiary)',
              border: 'none',
              borderRadius: '50%',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              cursor: 'pointer'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab selection */}
        <div style={{
          display: 'flex',
          borderBottom: '1px solid var(--border-glass)',
          background: 'var(--bg-tertiary)',
          padding: '0 24px'
        }}>
          <button
            onClick={() => setActiveTab('overview')}
            style={{
              padding: '12px 18px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'overview' ? '2px solid var(--accent-indigo)' : '2px solid transparent',
              color: activeTab === 'overview' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <Layers size={16} />
            Vue d'ensemble & Statuts
          </button>
          <button
            onClick={() => setActiveTab('inspector')}
            style={{
              padding: '12px 18px',
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'inspector' ? '2px solid var(--accent-emerald)' : '2px solid transparent',
              color: activeTab === 'inspector' ? 'var(--text-primary)' : 'var(--text-muted)',
              fontWeight: 700,
              fontSize: '0.88rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <HardDrive size={16} />
            Inspecteur Base 2 : IndexedDB ({localOrders.length} tickets)
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
          {activeTab === 'overview' ? (
            <div>
              {/* Feedback Alert */}
              {syncFeedback && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: 'var(--accent-emerald)',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <CheckCircle2 size={18} />
                  <span>{syncFeedback}</span>
                </div>
              )}

              {/* Dual Database Comparison Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                gap: '18px',
                marginBottom: '24px'
              }}>
                {/* Database 1 : PostgreSQL Cloud */}
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-glass)',
                  padding: '20px',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(5, 150, 105, 0.12)',
                        color: 'var(--accent-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <Cloud size={20} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800 }}>
                          1ère Base : PostgreSQL
                        </h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Neon Serverless Cloud (v18.6)
                        </span>
                      </div>
                    </div>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      background: isBackendConnected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                      color: isBackendConnected ? 'var(--accent-emerald)' : 'var(--accent-rose)',
                      border: `1px solid ${isBackendConnected ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}>
                      {isBackendConnected ? '🟢 CONNECTÉ' : '🔴 DÉCONNECTÉ'}
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Hôte Cloud :</span>
                      <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace', fontSize: '0.75rem' }}>
                        ep-floral-boat-b4gnlbri...
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Tables créées :</span>
                      <strong style={{ color: 'var(--accent-emerald)' }}>10 tables relationnelles</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Rôle principal :</span>
                      <span style={{ color: 'var(--text-primary)' }}>Multi-caisses, IA, Rapports Z</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Sécurité SSL :</span>
                      <strong style={{ color: 'var(--accent-emerald)' }}>TLS 1.3 / Require</strong>
                    </div>
                  </div>
                </div>

                {/* Database 2 : IndexedDB Local */}
                <div style={{
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  padding: '20px',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: 'var(--radius-md)',
                        background: 'rgba(16, 185, 129, 0.15)',
                        color: 'var(--accent-emerald)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <HardDrive size={20} />
                      </div>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 800 }}>
                          2ème Base : IndexedDB
                        </h4>
                        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          Dexie.js Client-Side Storage
                        </span>
                      </div>
                    </div>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '999px',
                      fontSize: '0.68rem',
                      fontWeight: 800,
                      background: 'rgba(16, 185, 129, 0.15)',
                      color: 'var(--accent-emerald)',
                      border: '1px solid rgba(16, 185, 129, 0.3)'
                    }}>
                      ⚡ ULTRA-RAPIDE (0ms)
                    </span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Nom de base :</span>
                      <strong style={{ color: 'var(--text-primary)', fontFamily: 'monospace' }}>CaissaOfflineDB</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Articles en cache :</span>
                      <strong style={{ color: 'var(--accent-indigo)' }}>{stats.productCount} articles</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Tickets locaux :</span>
                      <strong style={{ color: 'var(--text-primary)' }}>
                        {stats.totalOrders} ({stats.unsyncedOrders} en attente)
                      </strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Mode Hors-Ligne :</span>
                      <strong style={{ color: 'var(--accent-emerald)' }}>100% Autonome sans WiFi</strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* Architecture Explanation Banner */}
              <div style={{
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                padding: '18px 20px',
                border: '1px solid var(--border-glass)',
                marginBottom: '24px'
              }}>
                <h4 style={{ margin: '0 0 8px', fontSize: '0.92rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <ShieldCheck size={18} color="var(--accent-emerald)" />
                  Comment fonctionne la 2ème base de données avec Caissa ?
                </h4>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  Quand un restaurant encaisse une commande, <strong>la 2ème base (IndexedDB)</strong> sauvegarde instantanément le ticket dans la mémoire interne de la caisse.
                  Même si Internet coupe au même moment : le ticket de caisse s'imprime, le tiroir-caisse s'ouvre, et le total de la journée reste exact. Dès que le réseau ou le Wifi revient, 
                  le moteur synchronise automatiquement les ventes vers votre <strong>Neon PostgreSQL Cloud</strong> sans aucune intervention !
                </p>
              </div>

              {/* Action Controls */}
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingTop: '10px'
              }}>
                {/* Manual Sync Button */}
                <button
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: '#059669',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: isSyncing ? 'not-allowed' : 'pointer',
                    boxShadow: '0 2px 8px rgba(5, 150, 105, 0.25)'
                  }}
                >
                  <RefreshCw size={16} className={isSyncing ? 'spin' : ''} />
                  {isSyncing ? 'Synchronisation en cours...' : 'Synchroniser Base 2 vers Neon Cloud'}
                </button>

                {/* Simulate Offline Mode Toggle */}
                {onToggleSimulateOffline && (
                  <button
                    onClick={() => onToggleSimulateOffline(!isSimulatingOffline)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 18px',
                      borderRadius: 'var(--radius-md)',
                      background: isSimulatingOffline ? 'rgba(239, 68, 68, 0.15)' : 'var(--bg-tertiary)',
                      color: isSimulatingOffline ? 'var(--accent-rose)' : 'var(--text-primary)',
                      border: `1px solid ${isSimulatingOffline ? 'rgba(239, 68, 68, 0.4)' : 'var(--border-glass)'}`,
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      cursor: 'pointer'
                    }}
                  >
                    {isSimulatingOffline ? <WifiOff size={16} /> : <Wifi size={16} />}
                    {isSimulatingOffline ? 'Mode Coupure Réseau Simulé (Actif)' : 'Simuler Panne Internet (Test Hors-Ligne)'}
                  </button>
                )}

                {/* Inspect IndexedDB Button */}
                <button
                  onClick={() => setActiveTab('inspector')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 18px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-tertiary)',
                    color: 'var(--text-secondary)',
                    border: '1px solid var(--border-glass)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    cursor: 'pointer'
                  }}
                >
                  <Eye size={16} />
                  Inspecter les tickets ({localOrders.length})
                </button>
              </div>
            </div>
          ) : (
            <div>
              {/* Inspector of 2nd database */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>
                    Contenu direct de la 2ème Base : IndexedDB
                  </h4>
                  <p style={{ margin: '2px 0 0', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Tous les tickets enregistrés dans la mémoire interne du navigateur/caisse
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleManualSync}
                    disabled={isSyncing || stats.unsyncedOrders === 0}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--accent-indigo)',
                      color: '#fff',
                      border: 'none',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: (isSyncing || stats.unsyncedOrders === 0) ? 'not-allowed' : 'pointer',
                      opacity: (isSyncing || stats.unsyncedOrders === 0) ? 0.6 : 1
                    }}
                  >
                    <RefreshCw size={14} className={isSyncing ? 'spin' : ''} />
                    Synchroniser ({stats.unsyncedOrders})
                  </button>
                  <button
                    onClick={handleClearCache}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 14px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(239, 68, 68, 0.1)',
                      color: 'var(--accent-rose)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    <Trash2 size={14} />
                    Vider le cache
                  </button>
                </div>
              </div>

              {localOrders.length === 0 ? (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  background: 'var(--bg-card)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px dashed var(--border-glass)'
                }}>
                  <HardDrive size={36} color="var(--text-muted)" style={{ margin: '0 auto 12px' }} />
                  <p style={{ margin: 0, fontWeight: 700, color: 'var(--text-secondary)' }}>
                    Aucun ticket stocké en local pour le moment
                  </p>
                  <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Passez une commande dans la caisse : elle sera instantanément enregistrée ici dans IndexedDB !
                  </p>
                </div>
              ) : (
                <div style={{
                  overflowX: 'auto',
                  border: '1px solid var(--border-glass)',
                  borderRadius: 'var(--radius-lg)',
                  background: 'var(--bg-card)'
                }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--bg-tertiary)', textAlign: 'left', borderBottom: '1px solid var(--border-glass)' }}>
                        <th style={{ padding: '10px 14px' }}>Ticket #</th>
                        <th style={{ padding: '10px 14px' }}>Date</th>
                        <th style={{ padding: '10px 14px' }}>Articles</th>
                        <th style={{ padding: '10px 14px' }}>Montant</th>
                        <th style={{ padding: '10px 14px' }}>Paiement</th>
                        <th style={{ padding: '10px 14px' }}>Statut Synchronisation</th>
                      </tr>
                    </thead>
                    <tbody>
                      {localOrders.map((ord) => (
                        <tr key={ord.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                          <td style={{ padding: '10px 14px', fontWeight: 800, fontFamily: 'monospace' }}>
                            {ord.orderNumber}
                          </td>
                          <td style={{ padding: '10px 14px', color: 'var(--text-muted)' }}>
                            {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            {ord.items?.length || 0} article(s)
                          </td>
                          <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--accent-indigo)' }}>
                            {ord.total} MRU
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            <span style={{
                              padding: '2px 8px',
                              borderRadius: '4px',
                              background: 'var(--bg-tertiary)',
                              fontSize: '0.72rem',
                              fontWeight: 700
                            }}>
                              {ord.paymentMethod}
                            </span>
                          </td>
                          <td style={{ padding: '10px 14px' }}>
                            {ord.synced === 1 ? (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                color: 'var(--accent-emerald)',
                                fontWeight: 700,
                                fontSize: '0.75rem'
                              }}>
                                <CheckCircle2 size={13} />
                                Synchronisé (PostgreSQL)
                              </span>
                            ) : (
                              <span style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                color: 'var(--accent-amber)',
                                fontWeight: 700,
                                fontSize: '0.75rem'
                              }}>
                                <Clock size={13} />
                                En attente dans IndexedDB
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
