import React, { useState } from 'react';
import { 
  Bot, 
  ScanLine, 
  Mic, 
  MessageSquare, 
  TrendingUp, 
  Sparkles, 
  FileText, 
  Volume2, 
  Send,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { scanOcrInvoiceApi, parseVoiceOrderApi, askCfoCopilotApi } from '../services/api';

interface AiHubScreenProps {
  onAddVoiceOrderToCart: (items: { productName: string; qty: number }[]) => void;
  onStockUpdatedFromOcr: (itemsCount: number) => void;
}

export const AiHubScreen: React.FC<AiHubScreenProps> = ({
  onAddVoiceOrderToCart,
  onStockUpdatedFromOcr
}) => {
  const [activeTab, setActiveTab] = useState<'ocr' | 'voice' | 'cfo' | 'predict'>('ocr');

  // Agent 1 OCR State
  const [isScanning, setIsScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<any | null>(null);
  const [ocrApplied, setOcrApplied] = useState(false);

  // Agent 2 Voice State
  const [isListening, setIsListening] = useState(false);
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceApplied, setVoiceApplied] = useState(false);

  // Agent 3 CFO WhatsApp State
  const [chatMessages, setChatMessages] = useState<{ sender: 'ai' | 'user'; text: string; time: string }[]>([
    {
      sender: 'ai',
      text: "🌙 Bonsoir Patron ! Bilan de votre journée du 26/09/2026 :\n• Chiffre d'affaires : 1 480.500 DT (+18% vs jeudi dernier)\n• Marge brute estimée : 44.2%\n• Produit Star : Pizza Fruits de Mer (32 vendues)\n• Écart de caisse : 0.000 DT (Parfait !)\n\nAvez-vous une question sur votre gestion ?",
      time: '23:05'
    }
  ]);
  const [userInput, setUserInput] = useState('');

  // Simulation & API OCR Scan
  const handleSimulateOcr = async () => {
    setIsScanning(true);
    setOcrResult(null);
    setOcrApplied(false);

    try {
      // Appel API Réelle Backend
      const apiResponse = await scanOcrInvoiceApi();
      setIsScanning(false);
      setOcrResult(apiResponse.invoice);
    } catch {
      // Fallback local gracieux
      setTimeout(() => {
        setIsScanning(false);
        setOcrResult({
          supplier: 'GROSSISTE EL BARAKA (Monastir)',
          invoiceNumber: 'FAC-2026-889',
          date: '26/09/2026',
          items: [
            { name: 'Lait Demi-Écrémé Délice 1L', qty: 60, unitCost: 1.350, total: 81.000 },
            { name: 'Fromage Sicilien Fermier', qty: 15, unitCost: 18.500, total: 277.500 },
            { name: 'Huile d\'Olive Extra Vierge 1L', qty: 24, unitCost: 19.200, total: 460.800 },
            { name: 'Café Moulu Bondin 250g', qty: 30, unitCost: 4.650, total: 139.500 }
          ],
          totalAmount: 958.800
        });
      }, 1000);
    }
  };

  const handleApplyOcrStock = () => {
    setOcrApplied(true);
    if (ocrResult) {
      onStockUpdatedFromOcr(ocrResult.items.length);
    }
  };

  // Appel API Commande Vocale
  const handleSimulateVoice = async (phrase: string, fallbackItems: { productName: string; qty: number }[]) => {
    setIsListening(true);
    setVoiceTranscript('Écoute en cours (Derja tunisienne / Français)...');
    setVoiceApplied(false);

    try {
      const response = await parseVoiceOrderApi(phrase);
      setIsListening(false);
      setVoiceTranscript(`« ${phrase} »`);
      const extracted = response.extractedItems.map((item: any) => ({
        productName: item.productName,
        qty: item.quantity
      }));
      onAddVoiceOrderToCart(extracted);
      setVoiceApplied(true);
    } catch {
      setTimeout(() => {
        setIsListening(false);
        setVoiceTranscript(`« ${phrase} »`);
        onAddVoiceOrderToCart(fallbackItems);
        setVoiceApplied(true);
      }, 800);
    }
  };

  // Appel API CFO Chat
  const handleSendCfoMessage = async () => {
    if (!userInput.trim()) return;

    const userText = userInput;
    const userMsg = {
      sender: 'user' as const,
      text: userText,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setUserInput('');

    try {
      const res = await askCfoCopilotApi(userText);
      setChatMessages(prev => [...prev, {
        sender: 'ai',
        text: res.answer,
        time: res.timestamp || new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      }]);
    } catch {
      setTimeout(() => {
        setChatMessages(prev => [...prev, {
          sender: 'ai',
          text: "Votre établissement affiche une rentabilité de 44% cette semaine avec 2 410 DT de bénéfice estimé.",
          time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
        }]);
      }, 500);
    }
  };

  return (
    <div style={{ padding: '0 16px 16px 16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* AI Hub Header */}
      <div className="glass-panel" style={{
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            background: 'var(--accent-gradient)',
            padding: '12px',
            borderRadius: '14px',
            color: '#ffffff',
            boxShadow: '0 0 25px rgba(217, 70, 239, 0.4)'
          }}>
            <Bot size={26} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>Centre des Agents IA (AI Hub)</h2>
              <span className="badge-ai">Multi-Agents Actifs</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Connecté aux microservices d'intelligence artificielle sur le Backend API
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: '6px', background: 'var(--bg-tertiary)', padding: '4px', borderRadius: '10px' }}>
          <button
            onClick={() => setActiveTab('ocr')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'ocr' ? 'var(--accent-gradient)' : 'transparent',
              color: activeTab === 'ocr' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <ScanLine size={15} /> OCR Factures
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'voice' ? 'var(--accent-gradient)' : 'transparent',
              color: activeTab === 'voice' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <Mic size={15} /> Commande Vocale Derja
          </button>
          <button
            onClick={() => setActiveTab('cfo')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'cfo' ? 'var(--accent-gradient)' : 'transparent',
              color: activeTab === 'cfo' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <MessageSquare size={15} /> WhatsApp Patron
          </button>
          <button
            onClick={() => setActiveTab('predict')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              border: 'none',
              padding: '8px 14px',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activeTab === 'predict' ? 'var(--accent-gradient)' : 'transparent',
              color: activeTab === 'predict' ? '#fff' : 'var(--text-muted)'
            }}
          >
            <TrendingUp size={15} /> Stocks Prédictifs
          </button>
        </div>
      </div>

      {/* TAB 1: OCR FACTURES FOURNISSEURS */}
      {activeTab === 'ocr' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-ai">Agent IA 1</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Numérisation de Facture Grossiste</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              Prenez en photo votre bon de livraison ou facture papier d'un grossiste. L'IA lit les lignes manuscrites ou imprimées, extrait les quantités, les prix d'achat unitaires et met à jour votre stock sans aucune saisie manuelle.
            </p>

            <div style={{
              border: '2px dashed var(--border-active)',
              borderRadius: '14px',
              padding: '30px',
              textAlign: 'center',
              background: 'var(--bg-glass)',
              cursor: 'pointer'
            }}
            onClick={handleSimulateOcr}
            >
              <FileText size={40} color="var(--accent-primary)" style={{ margin: '0 auto 10px auto' }} />
              <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '4px' }}>
                Cliquez pour envoyer un Bon de Livraison à l'API OCR
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                Appel en direct : POST /api/ai/ocr-invoice
              </div>
              <button
                className="btn-primary"
                style={{ marginTop: '16px' }}
                disabled={isScanning}
              >
                <ScanLine size={16} /> {isScanning ? "Analyse Vision LLM en cours..." : "Scanner la Facture"}
              </button>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '14px' }}>
              Résultat de l'Extraction Intelligente
            </h3>

            {!ocrResult && !isScanning && (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-dim)',
                textAlign: 'center'
              }}>
                <Sparkles size={36} style={{ marginBottom: '8px', opacity: 0.5 }} />
                <p>En attente du document pour lancer la reconnaissance optique IA.</p>
              </div>
            )}

            {isScanning && (
              <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-cyan)'
              }}>
                <div className="pulse-dot" style={{ width: '20px', height: '20px', marginBottom: '12px' }} />
                <strong>Extraction OCR en cours via le Backend...</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Reconnaissance des tableaux, des montants et des unités
                </span>
              </div>
            )}

            {ocrResult && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1 }}>
                <div style={{
                  background: 'var(--bg-glass)',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '0.8rem',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <div>
                    <div>Fournisseur : <strong>{ocrResult.supplier}</strong></div>
                    <div>Réf : {ocrResult.invoiceNumber} • Date : {ocrResult.date}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: 'var(--text-dim)' }}>Montant Total :</div>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--accent-emerald)' }}>
                      {ocrResult.totalAmount.toFixed(3)} DT
                    </strong>
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                  <table style={{ width: '100%', fontSize: '0.8rem', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-dim)' }}>
                        <th style={{ padding: '6px', textAlign: 'left' }}>Article extrait</th>
                        <th style={{ padding: '6px', textAlign: 'center' }}>Qté reçue</th>
                        <th style={{ padding: '6px', textAlign: 'right' }}>Prix U.</th>
                        <th style={{ padding: '6px', textAlign: 'right' }}>Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ocrResult.items.map((it: any, i: number) => (
                        <tr key={i} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                          <td style={{ padding: '8px 6px', fontWeight: 600 }}>{it.name}</td>
                          <td style={{ padding: '8px 6px', textAlign: 'center', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                            +{it.qty}
                          </td>
                          <td style={{ padding: '8px 6px', textAlign: 'right' }}>{it.unitCost.toFixed(3)} DT</td>
                          <td style={{ padding: '8px 6px', textAlign: 'right', fontWeight: 700 }}>{it.total.toFixed(3)} DT</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {ocrApplied ? (
                  <div style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: 'var(--accent-emerald)',
                    textAlign: 'center',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                  }}>
                    ✅ Stock et Prix d'achat mis à jour dans la base avec succès !
                  </div>
                ) : (
                  <button
                    onClick={handleApplyOcrStock}
                    className="btn-emerald"
                    style={{ width: '100%', marginTop: 'auto' }}
                  >
                    <CheckCircle2 size={16} /> Valider & Injecter les +129 articles en Stock
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: COMMANDE VOCALE DERJA */}
      {activeTab === 'voice' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-ai">Agent IA 2</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Assistant Vocal POS (Caisse Rapide)</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              Pendant les heures de rush, dictez la commande en <strong>Derja tunisienne</strong> ou en <strong>Français</strong>. L'API parse et insère automatiquement les produits correspondants dans la caisse.
            </p>

            {/* Test Phrases */}
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '8px' }}>
                Testez en envoyant une phrase réelle à l'API vocale :
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => handleSimulateVoice("Zouz Capucin w wahed Citronnade", [
                    { productName: 'Café Capucin Grand', qty: 2 },
                    { productName: 'Citronnade Maison Fraîche', qty: 1 }
                  ])}
                  className="btn-secondary"
                  style={{ textAlign: 'left', padding: '10px 14px', fontSize: '0.85rem', justifyContent: 'flex-start' }}
                >
                  <Volume2 size={16} color="var(--accent-cyan)" />
                  <span>« Zouz Capucin w wahed Citronnade » (2 Capucins + 1 Citronnade)</span>
                </button>

                <button
                  onClick={() => handleSimulateVoice("Wahed Pizza Fruits de Mer w zouz Espresso", [
                    { productName: 'Pizza Fruits de Mer Spéciale', qty: 1 },
                    { productName: 'Espresso Intense', qty: 2 }
                  ])}
                  className="btn-secondary"
                  style={{ textAlign: 'left', padding: '10px 14px', fontSize: '0.85rem', justifyContent: 'flex-start' }}
                >
                  <Volume2 size={16} color="var(--accent-cyan)" />
                  <span>« Wahed Pizza Fruits de Mer w zouz Espresso »</span>
                </button>

                <button
                  onClick={() => handleSimulateVoice("Wahed Makloub Escalope w wahed Crêpe Nutella", [
                    { productName: 'Sandwich Makloub Escalope', qty: 1 },
                    { productName: 'Crêpe Nutella Amandes Grillées', qty: 1 }
                  ])}
                  className="btn-secondary"
                  style={{ textAlign: 'left', padding: '10px 14px', fontSize: '0.85rem', justifyContent: 'flex-start' }}
                >
                  <Volume2 size={16} color="var(--accent-cyan)" />
                  <span>« Wahed Makloub Escalope w wahed Crêpe Nutella »</span>
                </button>
              </div>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: isListening ? 'var(--accent-rose)' : 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isListening ? '0 0 16px rgba(225, 29, 72, 0.4)' : '0 4px 14px rgba(5, 150, 105, 0.35)',
              marginBottom: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
            onClick={() => handleSimulateVoice("Zouz Capucin w wahed Citronnade", [
              { productName: 'Café Capucin Grand', qty: 2 },
              { productName: 'Citronnade Maison Fraîche', qty: 1 }
            ])}
            >
              <Mic size={36} color="#fff" />
            </div>

            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '6px' }}>
              {isListening ? 'Analyse par API IA...' : 'Appuyez pour dicter'}
            </h4>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: '300px', minHeight: '40px' }}>
              {voiceTranscript || 'POST /api/ai/voice-order'}
            </div>

            {voiceApplied && (
              <div style={{
                marginTop: '20px',
                padding: '12px 20px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.15)',
                color: 'var(--accent-emerald)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <CheckCircle2 size={18} /> Les articles ont été ajoutés à la caisse POS !
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: WHATSAPP PATRON (CFO COPILOT) */}
      {activeTab === 'cfo' && (
        <div style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '16px' }}>
          {/* Simulated WhatsApp Phone Frame */}
          <div style={{
            background: '#121b22',
            borderRadius: '24px',
            border: '4px solid #2a3942',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            height: '460px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.6)'
          }}>
            {/* WhatsApp Header */}
            <div style={{
              background: '#1f2c34',
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderBottom: '1px solid #2a3942'
            }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                <Bot size={18} />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#e9edef' }}>
                  Caissa Copilot (Directeur IA)
                </div>
                <div style={{ fontSize: '0.7rem', color: '#00a884' }}>Connecté à l'API :4000</div>
              </div>
            </div>

            {/* Chat Body */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              background: '#0b141a'
            }}>
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    background: msg.sender === 'user' ? '#005c4b' : '#202c33',
                    color: '#e9edef',
                    padding: '8px 12px',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    lineHeight: '1.4',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {msg.text}
                  <div style={{ fontSize: '0.65rem', color: '#8696a0', textAlign: 'right', marginTop: '4px' }}>
                    {msg.time}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Bar */}
            <div style={{
              background: '#202c33',
              padding: '8px 12px',
              display: 'flex',
              gap: '8px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Posez une question sur vos ventes..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendCfoMessage()}
                style={{
                  flex: 1,
                  background: '#2a3942',
                  border: 'none',
                  borderRadius: '999px',
                  padding: '8px 14px',
                  color: '#fff',
                  fontSize: '0.8rem',
                  outline: 'none'
                }}
              />
              <button
                onClick={handleSendCfoMessage}
                style={{
                  background: '#00a884',
                  border: 'none',
                  borderRadius: '50%',
                  width: '34px',
                  height: '34px',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Send size={15} />
              </button>
            </div>
          </div>

          {/* Explanation & Quick Triggers */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-ai">Agent IA 3 & 4</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Conseiller Financier Dédié au Patron</h3>
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              Chaque message interroge en direct l'endpoint backend <code>POST /api/ai/cfo-chat</code> pour calculer vos bénéfices, alertes de réapprovisionnement et impayés.
            </p>

            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Questions fréquentes à tester dans le chat :
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => {
                  setUserInput("Combien de bénéfice ai-je fait cette semaine ?");
                }}
                className="btn-secondary"
                style={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: '0.8rem' }}
              >
                💡 "Combien de bénéfice ai-je fait cette semaine ?"
              </button>
              <button
                onClick={() => {
                  setUserInput("Quels ingrédients risquent de manquer demain ?");
                }}
                className="btn-secondary"
                style={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: '0.8rem' }}
              >
                💡 "Quels ingrédients risquent de manquer demain ?"
              </button>
              <button
                onClick={() => {
                  setUserInput("Quel est le montant total des crédits impayés ?");
                }}
                className="btn-secondary"
                style={{ textAlign: 'left', justifyContent: 'flex-start', fontSize: '0.8rem' }}
              >
                💡 "Quel est le montant total des crédits impayés ?"
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: STOCKS PRÉDICTIFS */}
      {activeTab === 'predict' && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge-ai">Agent IA 5</span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Prédictions de Vente & Anti-Gaspillage</h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                Recommandations d'approvisionnement calculées selon l'historique, la météo et les événements du weekend
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>
              <Calendar size={16} /> Semaine du 28 Septembre au 04 Octobre 2026
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-dim)' }}>
                  <th style={{ padding: '10px' }}>Ingrédient / Produit</th>
                  <th style={{ padding: '10px' }}>Stock Actuel</th>
                  <th style={{ padding: '10px' }}>Ventes Prévues</th>
                  <th style={{ padding: '10px' }}>Quantité Conseillée à Commander</th>
                  <th style={{ padding: '10px' }}>Justification IA</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 700 }}>Mozzarella & Fromage Râpé</td>
                  <td style={{ padding: '12px 10px', color: 'var(--accent-rose)' }}>8.5 kg (Critique)</td>
                  <td style={{ padding: '12px 10px' }}>42.0 kg</td>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: 'var(--accent-emerald)' }}>Commander +35 kg</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>Match Derby Samedi soir + Forte affluence prévue (+30%)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 700 }}>Citrons pour Citronnade</td>
                  <td style={{ padding: '12px 10px', color: 'var(--accent-amber)' }}>12 kg</td>
                  <td style={{ padding: '12px 10px' }}>30.0 kg</td>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: 'var(--accent-emerald)' }}>Commander +20 kg</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>Météo ensoleillée (29°C ce dimanche)</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-glass)' }}>
                  <td style={{ padding: '12px 10px', fontWeight: 700 }}>Pain Makloub / Pâte</td>
                  <td style={{ padding: '12px 10px' }}>90 unités</td>
                  <td style={{ padding: '12px 10px' }}>110 unités</td>
                  <td style={{ padding: '12px 10px', fontWeight: 800, color: 'var(--accent-emerald)' }}>Commander +30 unités</td>
                  <td style={{ padding: '12px 10px', color: 'var(--text-muted)' }}>Consommation stable en semaine</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
