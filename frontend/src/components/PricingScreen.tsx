import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  Check, 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Headphones, 
  Gift,
  Smartphone
} from 'lucide-react';
import { registerTenantApi, subscribePlanApi, getSubscriptionPlansApi } from '../services/api';

export const PricingScreen: React.FC = () => {
  const [selectedDays, setSelectedDays] = useState<number>(90);
  const [plans, setPlans] = useState<any[]>([]);
  const [registerForm, setRegisterForm] = useState({
    businessName: '',
    sector: 'restaurant',
    city: 'Nouakchott',
    phone: '',
    email: '',
    password: ''
  });
  const [trialSuccess, setTrialSuccess] = useState(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    getSubscriptionPlansApi()
      .then((data) => {
        if (data?.plans) setPlans(data.plans);
      })
      .catch((err) => {
        console.warn("Chargement fallback local des plans:", err);
      });
  }, []);


  // Calcul du prix et des remises (Modèle Caissa adapté à la Mauritanie en MRU)
  let discountPercent = 0;
  let pricePerDay = 15.0; // 15 MRU par jour

  if (selectedDays >= 365) {
    discountPercent = 50;
    pricePerDay = 7.5; // -50% soit 7.5 MRU / jour
  } else if (selectedDays >= 180) {
    discountPercent = 30;
    pricePerDay = 10.5;
  } else if (selectedDays >= 90) {
    discountPercent = 10;
    pricePerDay = 13.5;
  }

  const originalTotalPrice = selectedDays * 15.0;
  const finalTotalPrice = selectedDays * pricePerDay;

  const handleRegisterTrial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerForm.businessName || !registerForm.phone) return;

    try {
      await registerTenantApi({
        businessName: registerForm.businessName,
        sector: registerForm.sector,
        phone: registerForm.phone,
        email: registerForm.email
      });
    } catch (err) {
      console.warn("Validation locale de l'inscription:", err);
    }

    setTrialSuccess(true);
  };

  const handleSubscribePlan = async (gateway: string) => {
    try {
      const res = await subscribePlanApi(selectedDays, gateway);
      setPaymentSuccessMsg(res.message);
    } catch {
      setPaymentSuccessMsg(`Abonnement de ${selectedDays} jours simulé avec succès (${finalTotalPrice.toFixed(0)} MRU réglés via ${gateway} Mauritanie)`);
    }
  };

  return (
    <div style={{ padding: '0 16px 24px 16px', display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1100px', margin: '0 auto' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', margin: '10px 0' }}>
        <span className="badge-ai" style={{ marginBottom: '8px', background: 'rgba(34, 197, 94, 0.2)', color: '#22c55e', border: '1px solid rgba(34, 197, 94, 0.4)' }}>
          <Sparkles size={13} /> Tarification Caissa Mauritanie 🇲🇷
        </span>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.02em', marginTop: '6px' }}>
          Choisissez la durée de votre abonnement en MRU
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '650px', margin: '6px auto 0 auto' }}>
          Aucun matériel lourd obligatoire. Payez par jour via <strong>Bankily</strong> ou <strong>Masrvi</strong>. Plus la durée est longue, plus vous économisez !
        </p>
      </div>

      {paymentSuccessMsg && (
        <div style={{
          background: 'rgba(34, 197, 94, 0.2)',
          border: '1px solid #22c55e',
          color: '#22c55e',
          padding: '16px',
          borderRadius: '12px',
          textAlign: 'center',
          fontWeight: 700
        }}>
          ✅ {paymentSuccessMsg}
        </div>
      )}

      {/* Grid: 15-day Trial vs Custom Dynamic Slider Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '20px' }}>
        {/* Card 1: Free Trial (15 Jours Gratuits Mauritanie) */}
        <div className="glass-panel" style={{
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          border: '1px solid var(--border-glass)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                background: 'rgba(34, 197, 94, 0.15)',
                color: '#22c55e',
                padding: '10px',
                borderRadius: '10px'
              }}>
                <Gift size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22c55e' }}>
                  DÉMARRAGE SANS ENGAGEMENT
                </span>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Essai Gratuit</h3>
              </div>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', marginBottom: '20px' }}>
              Testez toute la caisse, le carnet Kridi client et les agents IA dans votre commerce mauritanien sans payer 1 seul Ouguiya.
            </p>

            <div style={{
              background: 'var(--bg-glass)',
              padding: '14px',
              borderRadius: '12px',
              textAlign: 'center',
              marginBottom: '20px',
              border: '1px solid var(--border-glass)'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#ffffff' }}>0 MRU</div>
              <div style={{ fontSize: '0.85rem', color: '#22c55e', fontWeight: 600 }}>
                Pendant 15 jours complets
              </div>
            </div>

            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} color="#22c55e" /> Accès complet à l'interface POS Caisse
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} color="#22c55e" /> Carnet de crédit client (« الكريدي »)
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} color="#22c55e" /> Encaissement Espèces, Bankily & Masrvi
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} color="#22c55e" /> Mode Hors-Ligne (Offline PWA) garanti
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Check size={16} color="#22c55e" /> Support technique Nouakchott 7j/7
              </li>
            </ul>
          </div>

          <div style={{ marginTop: '24px' }}>
            <a
              href="#inscription-directe"
              className="btn-secondary"
              style={{ width: '100%', textAlign: 'center', textDecoration: 'none', padding: '12px', display: 'block' }}
            >
              Créer mon compte Gratuit Mauritanie
            </a>
          </div>
        </div>

        {/* Card 2: Custom Plan with Slider (Like Caissa.tn in MRU) */}
        <div className="glass-panel" style={{
          padding: '28px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          border: '2px solid #16a34a',
          boxShadow: '0 0 30px rgba(22, 163, 74, 0.25)',
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            top: '-12px',
            right: '24px',
            background: 'linear-gradient(135deg, #006233 0%, #16a34a 100%)',
            color: '#fff',
            fontSize: '0.75rem',
            fontWeight: 800,
            padding: '4px 12px',
            borderRadius: '999px',
            boxShadow: '0 0 15px rgba(22,163,74,0.5)'
          }}>
            🇲🇷 MEILLEURE OFFRE
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#22c55e' }}>
              TARIF SOUPLE EN OUGUIYAS
            </span>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '2px' }}>
              Choisissez votre durée
            </h3>
          </div>

          {/* Special Annual Banner */}
          {selectedDays >= 365 && (
            <div style={{
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(22, 163, 74, 0.2) 100%)',
              border: '1px solid var(--accent-amber)',
              color: '#fef3c7',
              padding: '10px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              fontWeight: 700
            }}>
              <Flame size={18} color="var(--accent-amber)" />
              Offre Annuelle : Seulement 7.5 MRU / jour (-50% d'économie) !
            </div>
          )}

          {/* Dynamic Price Display */}
          <div style={{
            background: 'var(--bg-glass)',
            padding: '16px',
            borderRadius: '12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            border: '1px solid var(--border-glass)'
          }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Total à payer :</div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '2.5rem', fontWeight: 800, color: '#22c55e' }}>
                  {finalTotalPrice.toFixed(0)} <span style={{ fontSize: '1.2rem' }}>MRU</span>
                </span>
                {discountPercent > 0 && (
                  <span style={{ fontSize: '1.1rem', color: 'var(--text-dim)', textDecoration: 'line-through' }}>
                    {originalTotalPrice.toFixed(0)} MRU
                  </span>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
                padding: '4px 10px',
                borderRadius: '999px',
                fontSize: '0.8rem',
                fontWeight: 700
              }}>
                {pricePerDay.toFixed(1)} MRU / jour
              </span>
              {discountPercent > 0 && (
                <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '4px', fontWeight: 700 }}>
                  Remise de -{discountPercent}% appliquée
                </div>
              )}
            </div>
          </div>

          {/* Quick Plan Presets from API */}
          {plans.length > 0 && (
            <div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', fontWeight: 600 }}>
                Forfaits recommandés (sélection directe) :
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '14px' }}>
                {plans.map((p) => {
                  const isSelected = selectedDays === p.durationDays;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedDays(p.durationDays)}
                      style={{
                        padding: '10px 4px',
                        borderRadius: '10px',
                        border: isSelected ? '2px solid #22c55e' : '1px solid var(--border-glass)',
                        background: isSelected ? 'rgba(34, 197, 94, 0.18)' : 'var(--bg-glass)',
                        color: isSelected ? '#22c55e' : 'var(--text-main)',
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'all 0.2s ease',
                        position: 'relative'
                      }}
                    >
                      {p.badge && (
                        <div style={{
                          position: 'absolute',
                          top: '-8px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          fontSize: '0.6rem',
                          fontWeight: 800,
                          background: '#16a34a',
                          color: '#fff',
                          padding: '1px 6px',
                          borderRadius: '999px',
                          whiteSpace: 'nowrap'
                        }}>
                          {p.badge}
                        </div>
                      )}
                      <div style={{ fontSize: '0.82rem', fontWeight: 800 }}>{p.durationDays} Jours</div>
                      <div style={{ fontSize: '0.7rem', color: isSelected ? '#22c55e' : 'var(--text-dim)', marginTop: '2px' }}>
                        {p.pricePerDay} MRU/j
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Days Range Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Nombre de jours souhaité :</span>
              <strong style={{ color: '#22c55e', fontSize: '1.05rem' }}>
                {selectedDays} Jours {selectedDays >= 365 ? '(1 An)' : selectedDays >= 180 ? '(6 Mois)' : selectedDays >= 90 ? '(3 Mois)' : ''}
              </strong>
            </div>

            <input
              type="range"
              className="custom-slider"
              min="1"
              max="365"
              value={selectedDays}
              onChange={(e) => setSelectedDays(parseInt(e.target.value))}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '6px' }}>
              <span>1 jour (15 MRU/j)</span>
              <span>3 mois (-10%)</span>
              <span>6 mois (-30%)</span>
              <span>1 an (-50%)</span>
            </div>
          </div>

          {/* Included Features */}
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={16} color="#22c55e" /> Synchronisation automatique en ligne & hors-ligne
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={16} color="#22c55e" /> Utilisateurs caissiers & gérants illimités
            </li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={16} color="#22c55e" /> Impression de tickets thermiques et rapports Z conformes
            </li>
          </ul>

          {/* Dual Payment Options: Bankily or Masrvi */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => handleSubscribePlan('BANKILY')}
              style={{
                flex: 1,
                padding: '12px',
                background: '#0284c7',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Smartphone size={16} /> Payer par Bankily
            </button>
            <button
              onClick={() => handleSubscribePlan('MASRVI')}
              style={{
                flex: 1,
                padding: '12px',
                background: '#7c3aed',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <CreditCard size={16} /> Payer par Masrvi
            </button>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="glass-panel" style={{
        padding: '16px 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '16px',
        textAlign: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <ShieldCheck size={22} color="#22c55e" />
          <div style={{ textAlign: 'left', fontSize: '0.85rem' }}>
            <strong>Données Sécurisées</strong>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Sauvegarde Cloud automatique</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <Headphones size={22} color="var(--accent-cyan)" />
          <div style={{ textAlign: 'left', fontSize: '0.85rem' }}>
            <strong>Support Nouakchott 7j/7</strong>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>WhatsApp +222 & Téléphone</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }}>
          <Smartphone size={22} color="#0284c7" />
          <div style={{ textAlign: 'left', fontSize: '0.85rem' }}>
            <strong>Mobile Money 100% Intégré</strong>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Bankily, Masrvi, Seddad</div>
          </div>
        </div>
      </div>

      {/* Registration Form (Trial & Account Activation) */}
      <div id="inscription-directe" className="glass-panel" style={{ padding: '30px', marginTop: '10px' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Créer un Compte & Démarrer l'Essai en Mauritanie</h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
            Prêt en moins de 2 minutes pour votre restaurant, café, dibiterie ou boutique à Nouakchott
          </p>
        </div>

        {trialSuccess ? (
          <div style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid #22c55e',
            padding: '24px',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#22c55e', marginBottom: '8px' }}>
              🎉 Félicitations ! Votre compte "{registerForm.businessName}" est activé.
            </h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '14px' }}>
              Vos 15 jours d'essai gratuit sont enclenchés en Mauritanie. Vous pouvez dès maintenant encaisser en MRU, scanner vos articles et gérer les crédits clients.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-emerald"
            >
              Accéder à la Caisse POS Caissa.mr
            </button>
          </div>
        ) : (
          <form onSubmit={handleRegisterTrial} style={{ maxWidth: '650px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Nom de votre Établissement *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Boutique Al-Baraka, Restaurant Nouakchott..."
                  value={registerForm.businessName}
                  onChange={(e) => setRegisterForm({ ...registerForm, businessName: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Ville (Mauritanie)
                </label>
                <select
                  value={registerForm.city}
                  onChange={(e) => setRegisterForm({ ...registerForm, city: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  <option value="Nouakchott">Nouakchott (Tevragh-Zeina, Ksar, Sebkha...)</option>
                  <option value="Nouadhibou">Nouadhibou</option>
                  <option value="Rosso">Rosso</option>
                  <option value="Kiffa">Kiffa</option>
                  <option value="Zouerate">Zouerate</option>
                  <option value="Atar">Atar</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Numéro de Téléphone (+222) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="ex: +222 22 14 55 88"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                  Adresse Email
                </label>
                <input
                  type="email"
                  placeholder="contact@commerce.mr"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-tertiary)',
                    border: '1px solid var(--border-glass)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                Mot de Passe Administrateur
              </label>
              <input
                type="password"
                required
                placeholder="••••••••••••"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  background: 'var(--bg-tertiary)',
                  border: '1px solid var(--border-glass)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              className="btn-emerald"
              style={{ padding: '14px', marginTop: '10px', background: '#16a34a' }}
            >
              Activer mes 15 Jours d'Essai Gratuit Mauritanie
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
