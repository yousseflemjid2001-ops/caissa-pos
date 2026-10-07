import React, { useState } from 'react';
import { Users, Clock, Utensils, Plus, CheckCircle2, ArrowRight, LayoutGrid, Receipt } from 'lucide-react';
import type { Table } from '../data/mockData';
import { INITIAL_TABLES } from '../data/mockData';

interface TablesScreenProps {
  onSelectTable: (table: Table) => void;
}

export const TablesScreen: React.FC<TablesScreenProps> = ({ onSelectTable }) => {
  const [tables, setTables] = useState<Table[]>(INITIAL_TABLES);
  const [activeZone, setActiveZone] = useState<string>('all');

  const zones = ['all', 'Salle Climatisée', 'Terrasse', 'Salon VIP'];

  const filteredTables = activeZone === 'all' ? tables : tables.filter(t => t.zone === activeZone);

  const countByStatus = (status: Table['status']) => tables.filter(t => t.status === status).length;
  const occupancyRate = Math.round((tables.filter(t => t.status !== 'libre').length / tables.length) * 100);
  const totalCA = tables.reduce((sum, t) => sum + (t.currentTotal || 0), 0);

  const getStatusConfig = (status: Table['status']) => {
    switch (status) {
      case 'libre':
        return {
          color: '#059669', bg: 'rgba(5, 150, 105, 0.1)', border: 'rgba(5, 150, 105, 0.35)',
          label: 'Libre', dotColor: '#10b981'
        };
      case 'occupee':
        return {
          color: '#dc2626', bg: 'rgba(220, 38, 38, 0.1)', border: 'rgba(220, 38, 38, 0.35)',
          label: 'Occupée', dotColor: '#f87171'
        };
      case 'addition':
        return {
          color: '#d97706', bg: 'rgba(217, 119, 6, 0.1)', border: 'rgba(217, 119, 6, 0.35)',
          label: 'Addition !', dotColor: '#fbbf24'
        };
    }
  };

  const getZoneIcon = (zone: string) => {
    if (zone === 'Terrasse') return '☀️';
    if (zone === 'Salon VIP') return '👑';
    return '❄️';
  };

  const handleTableAction = (tableId: number) => {
    setTables(prev => prev.map(t => {
      if (t.id !== tableId) return t;
      if (t.status === 'libre') {
        return { ...t, status: 'occupee', currentTotal: 0, activeOrderTime: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) };
      } else if (t.status === 'occupee') {
        return { ...t, status: 'addition' };
      } else {
        return { ...t, status: 'libre', currentTotal: undefined, activeOrderTime: undefined };
      }
    }));
  };

  return (
    <div style={{ padding: '0 16px 20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#059669',
            width: '40px', height: '40px',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <LayoutGrid size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-main)' }}>
              Plan de Salle — Gestion des Tables
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
              Suivi en direct de l'occupation • Taux de remplissage {occupancyRate}%
            </div>
          </div>
        </div>

        {/* KPI Row */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {[
            { value: countByStatus('libre'), label: 'Libres', color: '#059669', bg: 'rgba(5,150,105,0.1)' },
            { value: countByStatus('occupee'), label: 'Occupées', color: '#dc2626', bg: 'rgba(220,38,38,0.1)' },
            { value: countByStatus('addition'), label: 'Addition', color: '#d97706', bg: 'rgba(217,119,6,0.1)' },
            { value: `${totalCA.toLocaleString()} MRU`, label: 'CA en salle', color: 'var(--text-main)', bg: 'var(--bg-tertiary)' }
          ].map((kpi, i) => (
            <div key={i} style={{
              padding: '6px 12px',
              background: kpi.bg,
              border: '1px solid var(--border-glass)',
              borderRadius: '8px',
              textAlign: 'center',
              minWidth: '70px'
            }}>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
              <div style={{ fontSize: '0.6rem', color: 'var(--text-dim)', fontWeight: 600, marginTop: '2px', textTransform: 'uppercase' }}>{kpi.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── ZONE TABS ── */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
        {zones.map(zone => {
          const active = activeZone === zone;
          const count = zone === 'all' ? tables.length : tables.filter(t => t.zone === zone).length;
          return (
            <button
              key={zone}
              onClick={() => setActiveZone(zone)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '8px',
                border: `1px solid ${active ? '#059669' : 'var(--border-glass)'}`,
                background: active ? '#059669' : 'var(--bg-secondary)',
                color: active ? '#fff' : 'var(--text-muted)',
                fontSize: '0.8rem',
                fontWeight: active ? 700 : 600,
                cursor: 'pointer',
                transition: 'all 0.15s'
              }}
            >
              {zone !== 'all' && <span>{getZoneIcon(zone)}</span>}
              <span>{zone === 'all' ? 'Tout le restaurant' : zone}</span>
              <span style={{
                background: active ? 'rgba(255,255,255,0.25)' : 'var(--bg-tertiary)',
                color: active ? '#fff' : 'var(--text-dim)',
                fontSize: '0.65rem',
                fontWeight: 800,
                padding: '1px 5px',
                borderRadius: '4px'
              }}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── TABLES GRID ── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '12px'
      }}>
        {filteredTables.map(table => {
          const status = getStatusConfig(table.status);

          return (
            <div
              key={table.id}
              style={{
                background: 'var(--bg-secondary)',
                border: `1px solid ${status.border}`,
                borderRadius: '11px',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                transition: 'box-shadow 0.15s',
                boxShadow: table.status === 'addition' ? `0 0 0 2px ${status.border}` : 'none'
              }}
            >
              {/* Table Header Band */}
              <div style={{
                background: status.bg,
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: `1px solid ${status.border}`
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>{getZoneIcon(table.zone)}</span>
                  <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-main)' }}>
                    {table.name}
                  </span>
                </div>
                <span style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  background: status.color,
                  color: '#fff',
                  padding: '3px 9px',
                  borderRadius: '999px',
                  fontSize: '0.68rem',
                  fontWeight: 800
                }}>
                  <span style={{
                    width: '6px', height: '6px',
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.7)',
                    display: 'inline-block',
                    animation: table.status === 'addition' ? 'pulse 1.5s infinite' : 'none'
                  }} />
                  {status.label}
                </span>
              </div>

              {/* Table Body */}
              <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {/* Meta info */}
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Users size={13} />
                    <span>{table.seats} places</span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', fontWeight: 500 }}>
                    {table.zone}
                  </div>
                  {table.activeOrderTime && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }}>
                      <Clock size={12} color="#d97706" />
                      <span style={{ color: '#d97706', fontWeight: 600 }}>{table.activeOrderTime}</span>
                    </div>
                  )}
                </div>

                {/* Total or Empty indicator */}
                {table.currentTotal !== undefined && table.currentTotal >= 0 ? (
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: 'var(--bg-primary)',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-glass)'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.62rem', color: 'var(--text-dim)', fontWeight: 700, textTransform: 'uppercase' }}>Addition en cours</div>
                      <div style={{ fontWeight: 900, fontSize: '1.15rem', color: table.status === 'addition' ? '#d97706' : '#059669', lineHeight: 1.1, marginTop: '2px' }}>
                        {table.currentTotal.toLocaleString()} <span style={{ fontSize: '0.75rem' }}>MRU</span>
                      </div>
                    </div>
                    <Receipt size={22} color={table.status === 'addition' ? '#d97706' : '#059669'} />
                  </div>
                ) : (
                  <div style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px dashed var(--border-glass)',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: 'var(--text-dim)',
                    fontWeight: 500
                  }}>
                    Table disponible
                  </div>
                )}

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                  <button
                    onClick={() => handleTableAction(table.id)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '7px',
                      border: `1px solid ${status.border}`,
                      background: status.bg,
                      color: status.color,
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px'
                    }}
                  >
                    {table.status === 'libre' && <><Plus size={13} /> Ouvrir</>}
                    {table.status === 'occupee' && <><Receipt size={13} /> Demander Addition</>}
                    {table.status === 'addition' && <><CheckCircle2 size={13} /> Libérer</>}
                  </button>

                  <button
                    onClick={() => onSelectTable(table)}
                    title="Prendre commande sur cette table"
                    style={{
                      padding: '8px 12px',
                      borderRadius: '7px',
                      border: 'none',
                      background: '#059669',
                      color: '#fff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      transition: 'all 0.15s'
                    }}
                  >
                    <Utensils size={13} />
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
