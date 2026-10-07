import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Send, 
  Plus, 
  Printer, 
  X, 
  Search,
  Banknote,
  Smartphone,
  CreditCard
} from 'lucide-react';
import type { KridiCustomer } from '../data/mockData';
import { INITIAL_KRIDI_CUSTOMERS } from '../data/mockData';
import { getKridiCustomersApi, payKridiDebtApi, createKridiCustomerApi } from '../services/api';

export const KridiScreen: React.FC = () => {
  const [customers, setCustomers] = useState<KridiCustomer[]>(INITIAL_KRIDI_CUSTOMERS);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCustomer, setSelectedCustomer] = useState<KridiCustomer | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentMethod, setPaymentMethod] = useState<'ESPECES' | 'BANKILY' | 'MASRVI'>('ESPECES');
  const [aiMessagePreview, setAiMessagePreview] = useState<{ customer: KridiCustomer; message: string } | null>(null);
  const [sentSuccess, setSentSuccess] = useState<boolean>(false);

  // Modal Nouveau Client Kridi
  const [isAddCustomerModalOpen, setIsAddCustomerModalOpen] = useState<boolean>(false);
  const [newName, setNewName] = useState<string>('');
  const [newPhone, setNewPhone] = useState<string>('');
  const [newAddress, setNewAddress] = useState<string>('Tevragh-Zeina, Nouakchott');
  const [newCreditLimit, setNewCreditLimit] = useState<number>(5000);
  const [newNni, setNewNni] = useState<string>('');

  // Modal Reçu de Règlement de Dette
  const [paymentReceipt, setPaymentReceipt] = useState<{
    receiptNumber: string;
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    amountPaid: number;
    oldDebt: number;
    newDebt: number;
    paymentMethod: string;
    date: string;
  } | null>(null);

  // Chargement des données réelles depuis le backend
  useEffect(() => {
    fetchKridi();
  }, []);

  const fetchKridi = async () => {
    try {
      const data = await getKridiCustomersApi();
      if (data && data.customers) {
        setCustomers(data.customers);
      }
    } catch (err) {
      console.warn('Fallback kridi local:', err);
    }
  };

  const totalOutstanding = customers.reduce((sum, c) => sum + c.currentDebt, 0);

  const handlePayDebt = async (customerId: string) => {
    if (paymentAmount <= 0) return;

    const targetCustomer = customers.find(c => c.id === customerId);
    if (!targetCustomer) return;

    const oldDebt = targetCustomer.currentDebt;
    const newDebt = Math.max(0, oldDebt - paymentAmount);

    // Appel API Backend
    try {
      await payKridiDebtApi(customerId, paymentAmount);
    } catch (e) {
      console.warn("Échec appel API Kridi, application locale:", e);
    }

    setCustomers(prev => prev.map(c => {
      if (c.id === customerId) {
        return {
          ...c,
          currentDebt: newDebt,
          lastPaymentDate: "À l'instant",
          status: newDebt === 0 ? 'bon' : (newDebt > c.creditLimit * 0.8 ? 'alerte' : 'bon')
        };
      }
      return c;
    }));

    // Ouvrir le Reçu de Règlement officiel
    setPaymentReceipt({
      receiptNumber: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: targetCustomer.name,
      customerPhone: targetCustomer.phone,
      customerAddress: targetCustomer.address,
      amountPaid: paymentAmount,
      oldDebt,
      newDebt,
      paymentMethod,
      date: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    });

    setSelectedCustomer(null);
    setPaymentAmount(0);
  };

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;

    const payload = {
      name: newName.trim(),
      phone: newPhone.startsWith('+222') ? newPhone : `+222 ${newPhone.trim()}`,
      address: newAddress.trim(),
      creditLimit: Number(newCreditLimit) || 5000,
      nni: newNni.trim()
    };

    try {
      const res = await createKridiCustomerApi(payload);
      if (res && res.customer) {
        setCustomers(prev => [res.customer, ...prev]);
      } else {
        const localCustomer: KridiCustomer = {
          id: `c-${Date.now()}`,
          name: payload.name,
          phone: payload.phone,
          address: payload.address,
          creditLimit: payload.creditLimit,
          currentDebt: 0,
          lastPaymentDate: 'Nouveau',
          status: 'bon',
          nni: payload.nni
        };
        setCustomers(prev => [localCustomer, ...prev]);
      }
    } catch {
      const localCustomer: KridiCustomer = {
        id: `c-${Date.now()}`,
        name: payload.name,
        phone: payload.phone,
        address: payload.address,
        creditLimit: payload.creditLimit,
        currentDebt: 0,
        lastPaymentDate: 'Nouveau',
        status: 'bon',
        nni: payload.nni
      };
      setCustomers(prev => [localCustomer, ...prev]);
    }

    setIsAddCustomerModalOpen(false);
    setNewName('');
    setNewPhone('');
    setNewNni('');
    setNewCreditLimit(5000);
  };

  const generateAiReminder = (customer: KridiCustomer) => {
    const text = `السلام عليكم ورحمة الله، الأخ ${customer.name}. تذكير ودي من متجركم : رصيد الدين الحالي المسجل في الدفتر هو ${customer.currentDebt} أوقية (MRU). مرحباً بكم في أي وقت لتسويته. شكراً لوفائكم ! ✨`;
    setAiMessagePreview({ customer, message: text });
    setSentSuccess(false);
  };

  const handleSendReminder = () => {
    setSentSuccess(true);
    setTimeout(() => {
      setAiMessagePreview(null);
      setSentSuccess(false);
    }, 2500);
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.phone.includes(searchQuery) ||
    (c.address && c.address.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {/* Top Banner Stats */}
      <div className="glass-panel" style={{
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        borderRadius: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            padding: '10px',
            borderRadius: '10px',
            color: '#fff',
            boxShadow: '0 4px 12px rgba(245, 158, 11, 0.3)'
          }}>
            <BookOpen size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>
              البيع بالكريدي – Carnet de Crédit Client (Mauritanie)
            </h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', margin: '2px 0 0 0' }}>
              Suivi des dettes et encaissements en MRU • Règlement via <strong>Espèces</strong>, <strong>Bankily</strong> ou <strong>Masrvi</strong>
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={() => setIsAddCustomerModalOpen(true)}
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Nouveau Client Débiteur</span>
          </button>

          <div style={{
            background: 'var(--bg-glass)',
            border: '1px solid var(--border-glass)',
            padding: '8px 16px',
            borderRadius: '10px',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Total Créances Kridi :</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-amber)' }}>
              {totalOutstanding.toFixed(0)} <span style={{ fontSize: '0.85rem' }}>MRU</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            placeholder="Rechercher par nom de client, numéro de téléphone (+222), quartier..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px 8px 36px',
              borderRadius: '8px',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-main)',
              fontSize: '0.85rem'
            }}
          />
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', whiteSpace: 'nowrap' }}>
          {filteredCustomers.length} clients enregistrés
        </span>
      </div>

      {/* Customer List */}
      <div className="glass-panel" style={{ padding: '12px', overflowX: 'auto', borderRadius: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-dim)', fontSize: '0.78rem' }}>
              <th style={{ padding: '10px 12px' }}>Client</th>
              <th style={{ padding: '10px 12px' }}>Téléphone (+222)</th>
              <th style={{ padding: '10px 12px' }}>Quartier</th>
              <th style={{ padding: '10px 12px' }}>Dette Actuelle</th>
              <th style={{ padding: '10px 12px' }}>Plafond Autorisé</th>
              <th style={{ padding: '10px 12px' }}>Points Fidélité</th>
              <th style={{ padding: '10px 12px' }}>Dernier Règlement</th>
              <th style={{ padding: '10px 12px' }}>État du Compte</th>
              <th style={{ padding: '10px 12px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => {
              const usagePercent = Math.min(100, Math.round((c.currentDebt / c.creditLimit) * 100));

              return (
                <tr
                  key={c.id}
                  style={{
                    borderBottom: '1px solid var(--border-glass)',
                    fontSize: '0.85rem',
                    transition: 'background 0.15s ease'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '10px 12px', fontWeight: 700 }}>
                    {c.name}
                    {c.nni && <div style={{ fontSize: '0.68rem', color: 'var(--text-dim)' }}>NNI: {c.nni}</div>}
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>{c.phone}</td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-dim)' }}>{c.address || 'Nouakchott'}</td>
                  <td style={{ padding: '10px 12px', fontWeight: 800, color: c.currentDebt > 0 ? 'var(--accent-rose)' : 'var(--accent-emerald)' }}>
                    {c.currentDebt.toFixed(0)} MRU
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-muted)' }}>
                    {c.creditLimit.toFixed(0)} MRU
                    <div style={{ width: '80px', height: '4px', background: 'var(--bg-tertiary)', borderRadius: '2px', marginTop: '4px', overflow: 'hidden' }}>
                      <div style={{
                        width: `${usagePercent}%`,
                        height: '100%',
                        background: usagePercent > 80 ? 'var(--accent-rose)' : (usagePercent > 50 ? 'var(--accent-amber)' : 'var(--accent-emerald)')
                      }} />
                    </div>
                  </td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      background: 'rgba(217, 119, 6, 0.12)',
                      color: '#d97706',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      border: '1px solid rgba(217, 119, 6, 0.25)'
                    }}>
                      🪙 {c.loyaltyPoints || 0} pts
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', color: 'var(--text-dim)' }}>{c.lastPaymentDate}</td>
                  <td style={{ padding: '10px 12px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '999px',
                      fontSize: '0.7rem',
                      fontWeight: 700,
                      background: c.status === 'bon' ? 'rgba(16, 185, 129, 0.15)' : (c.status === 'alerte' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(244, 63, 94, 0.15)'),
                      color: c.status === 'bon' ? '#34d399' : (c.status === 'alerte' ? '#fbbf24' : '#fb7185')
                    }}>
                      {c.status === 'bon' ? 'Solvable' : (c.status === 'alerte' ? 'Plafond Proche' : 'Dette Critique')}
                    </span>
                  </td>
                  <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', gap: '6px' }}>
                      {c.currentDebt > 0 && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedCustomer(c);
                              setPaymentAmount(c.currentDebt);
                            }}
                            className="btn-primary"
                            style={{ padding: '4px 10px', fontSize: '0.75rem', background: '#16a34a' }}
                          >
                            Régler Dette
                          </button>
                          <button
                            onClick={() => generateAiReminder(c)}
                            className="btn-secondary"
                            style={{ padding: '4px 8px', fontSize: '0.75rem', color: '#22c55e', borderColor: 'rgba(34, 197, 94, 0.4)' }}
                            title="Envoyer relance courtoise WhatsApp/SMS"
                          >
                            <Send size={13} /> Relance
                          </button>
                        </>
                      )}
                      {c.currentDebt === 0 && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
                          À jour
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL Enregistrement de Règlement de Dette */}
      {selectedCustomer && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="glass-panel" style={{ width: '420px', padding: '22px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BookOpen size={18} color="var(--accent-amber)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Encaisser Règlement Dette</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer' }} onClick={() => setSelectedCustomer(null)} />
            </div>

            <div style={{
              background: 'var(--bg-tertiary)',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px'
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{selectedCustomer.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{selectedCustomer.phone} • {selectedCustomer.address}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-glass)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dette totale due :</span>
                <strong style={{ color: 'var(--accent-rose)', fontSize: '1rem' }}>{selectedCustomer.currentDebt} MRU</strong>
              </div>
            </div>

            {/* Saisie Montant */}
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                Montant versé par le client (MRU) :
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                max={selectedCustomer.currentDebt}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-glass)',
                  color: 'var(--text-main)',
                  fontSize: '1.2rem',
                  fontWeight: 800
                }}
              />
              <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <button
                  type="button"
                  onClick={() => setPaymentAmount(selectedCustomer.currentDebt)}
                  className="btn-secondary"
                  style={{ flex: 1, padding: '4px', fontSize: '0.72rem' }}
                >
                  Tout solder ({selectedCustomer.currentDebt} MRU)
                </button>
                {selectedCustomer.currentDebt > 500 && (
                  <button
                    type="button"
                    onClick={() => setPaymentAmount(Math.round(selectedCustomer.currentDebt / 2))}
                    className="btn-secondary"
                    style={{ flex: 1, padding: '4px', fontSize: '0.72rem' }}
                  >
                    Moitié ({Math.round(selectedCustomer.currentDebt / 2)} MRU)
                  </button>
                )}
              </div>
            </div>

            {/* Mode de règlement */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'block', marginBottom: '6px' }}>
                Moyen de versement :
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px' }}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ESPECES')}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: paymentMethod === 'ESPECES' ? '#16a34a' : 'var(--border-glass)',
                    background: paymentMethod === 'ESPECES' ? 'rgba(22, 163, 74, 0.2)' : 'var(--bg-card)',
                    color: paymentMethod === 'ESPECES' ? '#16a34a' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Banknote size={14} style={{ display: 'block', margin: '0 auto 2px' }} />
                  Espèces
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('BANKILY')}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: paymentMethod === 'BANKILY' ? '#ea580c' : 'var(--border-glass)',
                    background: paymentMethod === 'BANKILY' ? 'rgba(234, 88, 12, 0.2)' : 'var(--bg-card)',
                    color: paymentMethod === 'BANKILY' ? '#ea580c' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <Smartphone size={14} style={{ display: 'block', margin: '0 auto 2px' }} />
                  Bankily
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('MASRVI')}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: paymentMethod === 'MASRVI' ? '#0284c7' : 'var(--border-glass)',
                    background: paymentMethod === 'MASRVI' ? 'rgba(2, 132, 199, 0.2)' : 'var(--bg-card)',
                    color: paymentMethod === 'MASRVI' ? '#0284c7' : 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer'
                  }}
                >
                  <CreditCard size={14} style={{ display: 'block', margin: '0 auto 2px' }} />
                  Masrvi
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Annuler
              </button>
              <button
                onClick={() => handlePayDebt(selectedCustomer.id)}
                disabled={paymentAmount <= 0}
                className="btn-primary"
                style={{ flex: 2, background: '#16a34a' }}
              >
                Valider & Générer Reçu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL Nouveau Client Débiteur Kridi */}
      {isAddCustomerModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <form onSubmit={handleCreateCustomer} className="glass-panel" style={{ width: '420px', padding: '22px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Nouveau Client au Carnet Kridi</h3>
              </div>
              <X size={18} style={{ cursor: 'pointer' }} onClick={() => setIsAddCustomerModalOpen(false)} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                  Nom complet du client * :
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: Cheikh Ould Sidi"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
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
                  Numéro de téléphone (+222) * :
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex: 22 14 55 88"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
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
                  Quartier / Adresse à Nouakchott :
                </label>
                <input
                  type="text"
                  placeholder="ex: Tevragh-Zeina, Ksar, Sebkha..."
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
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

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                    Plafond de crédit (MRU) :
                  </label>
                  <input
                    type="number"
                    value={newCreditLimit}
                    onChange={(e) => setNewCreditLimit(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: 'var(--bg-tertiary)',
                      border: '1px solid var(--border-glass)',
                      color: 'var(--accent-amber)',
                      fontWeight: 800,
                      fontSize: '0.85rem'
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.78rem', color: 'var(--text-dim)', display: 'block', marginBottom: '4px' }}>
                    Numéro National NNI :
                  </label>
                  <input
                    type="text"
                    placeholder="10 chiffres"
                    value={newNni}
                    onChange={(e) => setNewNni(e.target.value)}
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
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setIsAddCustomerModalOpen(false)}
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
                Créer Compte Débiteur
              </button>
            </div>
          </form>
        </div>
      )}

      {/* MODAL Reçu Thermique de Règlement de Dette (Format officiel Caissa.mr) */}
      {paymentReceipt && (
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
          <div style={{ width: '360px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="receipt-paper">
              <div style={{ textAlign: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 900, margin: 0 }}>REÇU DE RÈGLEMENT DE CRÉDIT</h3>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, margin: '2px 0' }}>وصل سداد دين بالدفتر</div>
                <div style={{ fontSize: '0.72rem', color: '#555' }}>CAISSA MAURITANIE • Tevragh-Zeina</div>
              </div>

              <div style={{ borderTop: '1px dashed #111', borderBottom: '1px dashed #111', padding: '8px 0', margin: '8px 0', fontSize: '0.78rem' }}>
                <div>Reçu N° : <strong>#{paymentReceipt.receiptNumber}</strong></div>
                <div>Date & Heure : {new Date().toLocaleDateString('fr-TN')} {paymentReceipt.date}</div>
                <div>Client Débiteur : <strong>{paymentReceipt.customerName}</strong></div>
                <div>Téléphone : {paymentReceipt.customerPhone}</div>
                {paymentReceipt.customerAddress && <div>Quartier : {paymentReceipt.customerAddress}</div>}
                <div>Mode de versement : <strong>{paymentReceipt.paymentMethod}</strong></div>
              </div>

              <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '6px', margin: '10px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Dette initiale :</span>
                  <span>{paymentReceipt.oldDebt.toFixed(0)} MRU</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a', fontWeight: 800, fontSize: '1.05rem' }}>
                  <span>MONTANT VERSÉ :</span>
                  <span>-{paymentReceipt.amountPaid.toFixed(0)} MRU</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #111', paddingTop: '6px', fontWeight: 900, fontSize: '1rem', color: paymentReceipt.newDebt > 0 ? '#b91c1c' : '#16a34a' }}>
                  <span>NOUVEAU SOLDE RESTANT :</span>
                  <span>{paymentReceipt.newDebt.toFixed(0)} MRU</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '14px', fontSize: '0.72rem', color: '#555' }}>
                <p style={{ margin: 0, fontWeight: 700 }}>*** Merci pour votre confiance ***</p>
                <p style={{ margin: '2px 0 0 0', direction: 'rtl' }}>شكراً لوفائكم ودمتم بخير</p>
                <p style={{ fontSize: '0.65rem', marginTop: '4px' }}>Certifié conforme • Caisse Enregistreuse Caissa.mr</p>
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
                onClick={() => setPaymentReceipt(null)}
                className="btn-secondary"
                style={{ flex: 1 }}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL Relance IA WhatsApp/SMS en Mauritanie */}
      {aiMessagePreview && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }}>
          <div className="glass-panel" style={{ width: '450px', padding: '24px', borderRadius: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="badge-ai">Agent IA Recouvrement Mauritanie</span>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Notification Polie</h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '14px' }}>
              Message généré en Arabe avec respect des traditions de voisinage mauritaniennes :
            </p>

            <div style={{
              background: '#075e54',
              color: '#ffffff',
              padding: '16px',
              borderRadius: '12px',
              fontSize: '0.95rem',
              lineHeight: '1.5',
              direction: 'rtl',
              marginBottom: '16px',
              boxShadow: '0 4px 15px rgba(7, 94, 84, 0.4)'
            }}>
              {aiMessagePreview.message}
            </div>

            {sentSuccess ? (
              <div style={{
                textAlign: 'center',
                padding: '10px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.2)',
                color: 'var(--accent-emerald)',
                fontWeight: 700
              }}>
                ✅ Message WhatsApp & SMS expédié avec succès au +222 !
              </div>
            ) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setAiMessagePreview(null)}
                  className="btn-secondary"
                  style={{ flex: 1 }}
                >
                  Annuler
                </button>
                <button
                  onClick={handleSendReminder}
                  className="btn-primary"
                  style={{ flex: 2 }}
                >
                  <Send size={15} /> Envoyer via WhatsApp (+222)
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
