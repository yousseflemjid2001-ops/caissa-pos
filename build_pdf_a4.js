const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Génération du Dossier Exécutif A4 Portrait Premium (8 Pages) ---');

function toFileUri(filePath) {
  return 'file:///' + filePath.replace(/\\/g, '/');
}

const screenshotsDir = path.join(__dirname, 'frontend', 'public', 'screenshots');
const publicDir = path.join(__dirname, 'frontend', 'public');

const imgLogo = toFileUri(path.join(publicDir, 'favicon.svg'));
const imgRestaurantPhotos = toFileUri(path.join(screenshotsDir, 'pos_restaurant_screen_photos.png'));
const imgPriseCommande = toFileUri(path.join(screenshotsDir, 'prise_de_commande.png'));
const imgModifierModal = toFileUri(path.join(screenshotsDir, 'modifier_modal.png'));
const imgTables = toFileUri(path.join(screenshotsDir, 'tables_restaurant_screen_1791315425516.png'));
const imgKds = toFileUri(path.join(screenshotsDir, 'kds_restaurant_screen_1791315455733.png'));
const imgBoutique = toFileUri(path.join(screenshotsDir, 'pos_boutique_demo_1791314735684.png'));
const imgTicketCart = toFileUri(path.join(screenshotsDir, 'pos_ticket_cart.png'));
const imgSectorCards = toFileUri(path.join(screenshotsDir, 'sector_cards.png'));
const imgPaymentSuccess = toFileUri(path.join(screenshotsDir, 'payment_receipt_success_1791318272048.png'));
const imgTicketDetails = toFileUri(path.join(screenshotsDir, 'ticket_details.png'));
const imgEstablishment = toFileUri(path.join(screenshotsDir, 'establishment_profile.png'));
const imgIndexedDb = toFileUri(path.join(screenshotsDir, 'indexeddb_inspector.png'));
const imgPricingSlider = toFileUri(path.join(screenshotsDir, 'pricing_slider.png'));

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Caissa.mr — Dossier Exécutif A4</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Space+Grotesk:wght@500;600;700;800&display=swap');

@page { size: 210mm 297mm; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: #f0f0f0;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ============================
   CHAQUE PAGE = 210mm × 297mm
   ============================ */
.page {
  width: 210mm;
  height: 297mm;
  position: relative;
  overflow: hidden;
  page-break-after: always;
  background: #ffffff;
}

/* ============================
   PAGE DE COUVERTURE
   ============================ */
.cover-page {
  background: linear-gradient(160deg, #0a0e1a 0%, #0d1b3e 40%, #0a1628 70%, #071020 100%);
  display: flex;
  flex-direction: column;
}

.cover-topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10mm 14mm 0;
}

.cover-logo-group {
  display: flex;
  align-items: center;
  gap: 10px;
}
.cover-logo-img {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(16,185,129,0.35);
}
.cover-brand {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 22px;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.5px;
}
.cover-brand span { color: #34d399; }
.cover-live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(16,185,129,0.15);
  border: 1px solid rgba(16,185,129,0.4);
  padding: 5px 12px;
  border-radius: 20px;
  color: #34d399;
  font-size: 9.5px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.live-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 0 2px rgba(16,185,129,0.3);
}

.cover-hero {
  padding: 8mm 14mm 6mm;
  flex: none;
}
.cover-super {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  color: #60a5fa;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 6px;
}
.cover-headline {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.15;
  letter-spacing: -0.8px;
  margin-bottom: 10px;
}
.cover-headline em {
  font-style: normal;
  background: linear-gradient(90deg, #38bdf8, #818cf8, #34d399);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.cover-desc {
  font-size: 11.5px;
  color: #94a3b8;
  line-height: 1.55;
  max-width: 155mm;
}

.cover-screen-wrapper {
  flex: 1;
  margin: 0 14mm;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05);
  position: relative;
}
.cover-screen-bar {
  height: 26px;
  background: rgba(15,23,42,0.9);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 12px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}
.cover-screen-dots { display: flex; gap: 5px; }
.sd { width: 7px; height: 7px; border-radius: 50%; }
.sd-r { background: #ef4444; }
.sd-y { background: #f59e0b; }
.sd-g { background: #10b981; }
.cover-screen-url {
  font-size: 9px;
  color: #475569;
  font-weight: 500;
}
.cover-screen-tag {
  font-size: 8.5px;
  font-weight: 700;
  color: #10b981;
  background: rgba(16,185,129,0.15);
  padding: 2px 8px;
  border-radius: 4px;
}
.cover-screen-img {
  width: 100%;
  height: calc(100% - 26px);
  object-fit: cover;
  object-position: top;
  display: block;
}

.cover-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px;
  margin: 6mm 14mm 4mm;
  flex-none;
}
.cover-stat {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  padding: 8px 10px;
  text-align: center;
}
.cover-stat.accent {
  background: rgba(16,185,129,0.1);
  border-color: rgba(16,185,129,0.4);
}
.cover-stat-val {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 20px;
  font-weight: 800;
  color: #ffffff;
}
.cover-stat.accent .cover-stat-val { color: #34d399; }
.cover-stat-lbl {
  font-size: 8px;
  color: #64748b;
  font-weight: 600;
  margin-top: 2px;
}

.cover-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4mm 14mm 8mm;
  border-top: 1px solid rgba(255,255,255,0.08);
  flex-none;
}
.cover-dest {
  background: rgba(37,99,235,0.15);
  border: 1px dashed rgba(96,165,250,0.4);
  border-radius: 8px;
  padding: 7px 14px;
}
.cover-dest h4 { font-size: 10.5px; font-weight: 800; color: #93c5fd; }
.cover-dest p { font-size: 9px; color: #64748b; margin-top: 1px; }
.cover-conf {
  font-size: 8.5px;
  font-weight: 800;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  gap: 5px;
}
.cover-conf::before {
  content: '⬡';
  color: #2563eb;
  font-size: 12px;
}

/* ============================
   PAGES INTÉRIEURES
   ============================ */
.inner-page {
  display: flex;
  flex-direction: column;
}

.page-header {
  height: 11mm;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 13mm;
  background: #ffffff;
  border-bottom: 1.5px solid #e2e8f0;
  flex-shrink: 0;
}
.ph-brand {
  display: flex;
  align-items: center;
  gap: 8px;
}
.ph-logo {
  width: 26px; height: 26px;
  border-radius: 7px;
}
.ph-name {
  font-size: 15px; font-weight: 800; color: #0f172a;
}
.ph-name span { color: #10b981; }
.ph-sep {
  height: 14px; width: 1.5px; background: #e2e8f0; margin: 0 8px;
}
.ph-label {
  font-size: 9px; color: #64748b; font-weight: 600; text-transform: uppercase; letter-spacing: 0.8px;
}
.ph-badge {
  display: flex; align-items: center; gap: 5px;
  background: #eff6ff; border: 1px solid #bfdbfe;
  padding: 3px 9px; border-radius: 12px;
  font-size: 9px; font-weight: 700; color: #1d4ed8;
}
.ph-badge .b-dot {
  width: 5.5px; height: 5.5px; border-radius: 50%;
  background: #10b981;
}

.page-body {
  flex: 1;
  padding: 6mm 13mm;
  display: flex;
  flex-direction: column;
  gap: 7px;
  overflow: hidden;
}

.page-footer {
  height: 7mm;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 13mm;
  border-top: 1px solid #e2e8f0;
  flex-shrink: 0;
}
.pf-url { font-size: 8.5px; color: #64748b; }
.pf-url a { color: #2563eb; font-weight: 700; text-decoration: none; }
.pf-num { font-size: 8.5px; color: #94a3b8; font-weight: 700; }

/* Section Title */
.sec-label {
  font-size: 8.5px; font-weight: 800;
  color: #2563eb;
  text-transform: uppercase; letter-spacing: 1.2px;
  margin-bottom: 2px;
}
.sec-title {
  font-family: 'Space Grotesk', sans-serif;
  font-size: 17px; font-weight: 700;
  color: #0f172a;
  letter-spacing: -0.3px;
  line-height: 1.25;
  margin-bottom: 4px;
}
.sec-desc {
  font-size: 10.5px; color: #64748b; line-height: 1.5;
}

/* Screen Frame */
.screen-frame {
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(15,23,42,0.06);
}
.screen-bar {
  height: 22px;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
  display: flex; align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  flex-shrink: 0;
}
.screen-dots { display: flex; gap: 4px; }
.screen-dot { width: 6px; height: 6px; border-radius: 50%; }
.dot-r { background: #fca5a5; }
.dot-y { background: #fcd34d; }
.dot-g { background: #6ee7b7; }
.screen-title { font-size: 9px; font-weight: 700; color: #475569; }
.screen-tag {
  font-size: 8px; font-weight: 800;
  padding: 2px 7px; border-radius: 4px;
}
.tag-green { background: #dcfce7; color: #15803d; }
.tag-blue { background: #dbeafe; color: #1d4ed8; }
.tag-amber { background: #fef3c7; color: #b45309; }
.tag-purple { background: #ede9fe; color: #7c3aed; }
.screen-img {
  width: 100%; display: block;
  object-fit: cover;
  object-position: top;
}

/* Feature Pills */
.feat-row {
  display: flex; gap: 7px;
}
.feat-pill {
  flex: 1;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  padding: 9px 11px;
  display: flex; gap: 8px; align-items: flex-start;
}
.feat-pill.green { border-color: #bbf7d0; background: #f0fdf4; }
.feat-pill.blue { border-color: #bfdbfe; background: #eff6ff; }
.feat-pill.amber { border-color: #fde68a; background: #fffbeb; }
.feat-pill.purple { border-color: #ddd6fe; background: #faf5ff; }
.feat-icon {
  width: 30px; height: 30px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  font-size: 14px; flex-shrink: 0;
}
.fi-green { background: #dcfce7; }
.fi-blue { background: #dbeafe; }
.fi-amber { background: #fef3c7; }
.fi-purple { background: #ede9fe; }
.feat-text h5 { font-size: 10.5px; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
.feat-text p { font-size: 9.5px; color: #64748b; line-height: 1.4; }

/* 2-col screen grid */
.dual-screens {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

/* Full width screen */
.full-screen { width: 100%; }

/* 3-col cards (roadmap/collab) */
.tri-cards {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 8px;
}
.tri-card {
  border: 1.5px solid #e2e8f0;
  border-radius: 9px;
  padding: 10px 11px;
  background: #f8fafc;
}
.tri-card.done { border-color: #10b981; background: #f0fdf4; }
.tri-card.active { border-color: #3b82f6; background: #eff6ff; }
.tri-card.starred {
  border-color: #2563eb;
  background: linear-gradient(160deg, #eff6ff, #ffffff);
  box-shadow: 0 4px 12px rgba(37,99,235,0.10);
}
.tri-tag {
  font-size: 7.5px; font-weight: 800;
  padding: 2px 7px; border-radius: 10px;
  display: inline-block; margin-bottom: 5px;
  text-transform: uppercase;
}
.tri-card.done .tri-tag { background: #10b981; color: white; }
.tri-card.active .tri-tag { background: #2563eb; color: white; }
.tri-card.next .tri-tag { background: #94a3b8; color: white; }
.tri-card.starred .tri-tag { background: #2563eb; color: white; }
.tri-card h4 { font-size: 10.5px; font-weight: 800; color: #0f172a; margin-bottom: 3px; }
.tri-card p { font-size: 9.5px; color: #64748b; line-height: 1.4; }
.tri-card .tri-btn {
  margin-top: 6px; font-size: 8.5px; font-weight: 800;
  padding: 3px 7px; border-radius: 5px; text-align: center;
  background: #e2e8f0; color: #334155;
}
.tri-card.starred .tri-btn { background: #2563eb; color: white; }

/* CTA Banner */
.cta-banner {
  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%);
  border-radius: 10px;
  padding: 11px 16px;
  display: flex; align-items: center; justify-content: space-between;
}
.cta-text h3 { font-size: 12.5px; font-weight: 800; color: #ffffff; margin-bottom: 2px; }
.cta-text p { font-size: 10px; color: #94a3b8; }
.cta-btn {
  background: #10b981;
  color: white;
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 10.5px;
  font-weight: 800;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(16,185,129,0.35);
}

/* Comparison blocks */
.compare-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}
.compare-box {
  border-radius: 9px;
  padding: 10px 12px;
}
.compare-box.bad { background: #fef2f2; border: 1.5px solid #fecaca; }
.compare-box.good { background: #f0fdf4; border: 1.5px solid #bbf7d0; }
.compare-box h4 { font-size: 10.5px; font-weight: 800; margin-bottom: 6px; }
.compare-box.bad h4 { color: #b91c1c; }
.compare-box.good h4 { color: #15803d; }
.compare-box ul { list-style: none; display: flex; flex-direction: column; gap: 4px; }
.compare-box li { font-size: 9.5px; color: #475569; display: flex; align-items: flex-start; gap: 5px; line-height: 1.35; }

/* Kridi highlight */
.kridi-box {
  background: linear-gradient(135deg, #fffbeb, #fef9c3);
  border: 1.5px solid #fde68a;
  border-radius: 9px;
  padding: 10px 13px;
  display: flex; gap: 10px; align-items: center;
}
.kridi-icon {
  font-size: 24px; flex-shrink: 0;
}
.kridi-text h4 { font-size: 11px; font-weight: 800; color: #92400e; margin-bottom: 3px; }
.kridi-text p { font-size: 9.5px; color: #78350f; line-height: 1.4; }

/* Accent line before section */
.accent-line {
  height: 3px;
  width: 36px;
  background: linear-gradient(90deg, #2563eb, #10b981);
  border-radius: 2px;
  margin-bottom: 5px;
}
</style>
</head>
<body>

<!-- ============================================================
     PAGE 1 — COUVERTURE PREMIUM
     ============================================================ -->
<div class="page cover-page">
  <div class="cover-topbar">
    <div class="cover-logo-group">
      <img class="cover-logo-img" src="${imgLogo}" alt="Logo Caissa">
      <div class="cover-brand">Caissa<span>.mr</span></div>
    </div>
    <div class="cover-live-badge">
      <span class="live-dot"></span>
      Produit déployé en direct
    </div>
  </div>

  <div class="cover-hero">
    <div class="cover-super">Dossier Exécutif & Opportunité Commerciale — Confidentiel</div>
    <div class="cover-headline">
      La Première Solution POS SaaS<br>
      <em>100% Mauritanienne</em>
    </div>
    <p class="cover-desc">
      Plateforme de caisse enregistreuse tactile nouvelle génération : intégration native des paiements mobiles mauritaniens (Bankily, Masrvi), carnet de crédit client digitalisé (Kridi), gestion de restaurants avec plan de tables et écran cuisine KDS, fonctionnement 100% hors-ligne garanti.
    </p>
  </div>

  <div class="cover-screen-wrapper">
    <div class="cover-screen-bar">
      <div class="cover-screen-dots">
        <span class="sd sd-r"></span>
        <span class="sd sd-y"></span>
        <span class="sd sd-g"></span>
      </div>
      <div class="cover-screen-url">caissa-mr.vercel.app — Interface POS Tactile (Production Live)</div>
      <div class="cover-screen-tag">LIVE ACTIVE</div>
    </div>
    <img class="cover-screen-img" src="${imgRestaurantPhotos}" alt="Caissa POS Interface">
  </div>

  <div class="cover-stats">
    <div class="cover-stat accent">
      <div class="cover-stat-val">80%</div>
      <div class="cover-stat-lbl">Avancement Réel (MVP Opérationnel)</div>
    </div>
    <div class="cover-stat">
      <div class="cover-stat-val">MRU</div>
      <div class="cover-stat-lbl">Ouguiya + Bankily & Masrvi</div>
    </div>
    <div class="cover-stat">
      <div class="cover-stat-val">0 ms</div>
      <div class="cover-stat-lbl">Downtime (100% Offline-First)</div>
    </div>
    <div class="cover-stat">
      <div class="cover-stat-val">4-en-1</div>
      <div class="cover-stat-lbl">Resto, Retail, Épicerie & Services</div>
    </div>
  </div>

  <div class="cover-footer">
    <div class="cover-dest">
      <h4>Préparé à l'attention de : Si Taha</h4>
      <p>Opportunité de Partenariat, Distribution ou Investissement en Capital</p>
    </div>
    <div class="cover-conf">Dossier Confidentiel</div>
  </div>
</div>

<!-- ============================================================
     PAGE 2 — CONSTAT DU MARCHÉ & 4 SECTEURS
     ============================================================ -->
<div class="page inner-page">
  <div class="page-header">
    <div class="ph-brand">
      <img class="ph-logo" src="${imgLogo}" alt="Logo">
      <span class="ph-name">Caissa<span>.mr</span></span>
      <span class="ph-sep"></span>
      <span class="ph-label">Analyse du Marché Mauritanien</span>
    </div>
    <div class="ph-badge"><span class="b-dot"></span> OPPORTUNITÉ</div>
  </div>

  <div class="page-body">
    <div class="accent-line"></div>
    <div class="sec-label">Le Constat</div>
    <div class="sec-title">Un Marché à 90% Non Équipé ou Mal Desservi</div>
    <p class="sec-desc">La grande majorité des commerces et restaurants à Nouakchott fonctionnent encore avec des caisses archaïques ou des carnets manuscrits, exposés à des fuites financières importantes.</p>

    <div class="compare-row">
      <div class="compare-box bad">
        <h4>❌ Situation Actuelle (Avant Caissa.mr)</h4>
        <ul>
          <li><span>⚠️</span> Matériel importé fermé : 30 000–80 000 MRU par caisse sans flexibilité.</li>
          <li><span>⚠️</span> Kridi manuscrit contesté : des milliers d'Ouguiyas perdus chaque mois faute de traçabilité.</li>
          <li><span>⚠️</span> Paiements Bankily vérifiés manuellement sur des téléphones personnels.</li>
          <li><span>⚠️</span> Logiciels cloud étrangers inutilisables en cas de coupure réseau.</li>
        </ul>
      </div>
      <div class="compare-box good">
        <h4>✅ La Solution Caissa.mr</h4>
        <ul>
          <li><span>✔️</span> 100% logiciel SaaS : fonctionne sur n'importe quelle tablette ou PC existant.</li>
          <li><span>✔️</span> Kridi digitalisé : solde en temps réel, alertes et relevés imprimables.</li>
          <li><span>✔️</span> Bankily & Masrvi intégrés : encaissement en 1 clic avec traçabilité.</li>
          <li><span>✔️</span> Technologie Offline-First : continuité garantie même sans Internet.</li>
        </ul>
      </div>
    </div>

    <div class="accent-line" style="margin-top: 3px;"></div>
    <div class="sec-label">4 Secteurs Métiers Couverts</div>

    <div class="screen-frame" style="flex: 1;">
      <div class="screen-bar">
        <div class="screen-dots">
          <span class="screen-dot dot-r"></span>
          <span class="screen-dot dot-y"></span>
          <span class="screen-dot dot-g"></span>
        </div>
        <div class="screen-title">Solutions Métiers Adaptées : Restaurants, Épiceries, Boutiques & Services</div>
        <div class="screen-tag tag-blue">MULTI-SECTEURS</div>
      </div>
      <img class="screen-img" src="${imgSectorCards}" style="height: 85px; object-fit: cover; object-position: center;" alt="Secteurs Métiers">
    </div>

    <div class="feat-row">
      <div class="feat-pill green">
        <div class="feat-icon fi-green">🍽️</div>
        <div class="feat-text">
          <h5>Restaurants & Cafés</h5>
          <p>Plan de tables, KDS cuisine, commandes et additions en MRU.</p>
        </div>
      </div>
      <div class="feat-pill blue">
        <div class="feat-icon fi-blue">🛒</div>
        <div class="feat-text">
          <h5>Supérettes & Alimentation</h5>
          <p>Scan code-barres, pesée et stocks en temps réel.</p>
        </div>
      </div>
      <div class="feat-pill amber">
        <div class="feat-icon fi-amber">👗</div>
        <div class="feat-text">
          <h5>Boutiques & Mode</h5>
          <p>Tailles, coloris, fidélité client et tickets soignés.</p>
        </div>
      </div>
      <div class="feat-pill purple">
        <div class="feat-icon fi-purple">💈</div>
        <div class="feat-text">
          <h5>Salons & Services</h5>
          <p>Prestations, pourboires et clôture Z certifiée.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <div class="pf-url">Démo live : <a href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
    <div class="pf-num">Page 2 / 8</div>
  </div>
</div>

<!-- ============================================================
     PAGE 3 — PRISE DE COMMANDE TACTILE
     ============================================================ -->
<div class="page inner-page">
  <div class="page-header">
    <div class="ph-brand">
      <img class="ph-logo" src="${imgLogo}" alt="Logo">
      <span class="ph-name">Caissa<span>.mr</span></span>
      <span class="ph-sep"></span>
      <span class="ph-label">1. Prise de Commande Tactile</span>
    </div>
    <div class="ph-badge"><span class="b-dot"></span> ERGONOMIE & RAPIDITÉ</div>
  </div>

  <div class="page-body">
    <div class="accent-line"></div>
    <div class="sec-label">Module Cœur de Caisse</div>
    <div class="sec-title">Interface Tactile Ultra-Rapide : Photos HD & Personnalisation Instantanée</div>
    <p class="sec-desc">Conçue pour réduire l'attente au comptoir à moins de 30 secondes par commande. Navigation visuelle, photos haute définition et gestion fine des cuissons et suppléments.</p>

    <div class="dual-screens" style="flex: 1; gap: 10px;">
      <div class="screen-frame" style="display: flex; flex-direction: column;">
        <div class="screen-bar">
          <div class="screen-dots">
            <span class="screen-dot dot-r"></span>
            <span class="screen-dot dot-y"></span>
            <span class="screen-dot dot-g"></span>
          </div>
          <div class="screen-title">Sélection par Catégories & Grille Articles</div>
          <div class="screen-tag tag-green">1 CLIC</div>
        </div>
        <img class="screen-img" src="${imgPriseCommande}" style="flex: 1; height: 0; object-fit: cover; object-position: top;" alt="Prise de Commande">
      </div>

      <div class="screen-frame" style="display: flex; flex-direction: column;">
        <div class="screen-bar">
          <div class="screen-dots">
            <span class="screen-dot dot-r"></span>
            <span class="screen-dot dot-y"></span>
            <span class="screen-dot dot-g"></span>
          </div>
          <div class="screen-title">Modale Variantes, Cuissons & Suppléments</div>
          <div class="screen-tag tag-blue">ZÉRO ERREUR</div>
        </div>
        <img class="screen-img" src="${imgModifierModal}" style="flex: 1; height: 0; object-fit: cover; object-position: top;" alt="Variantes">
      </div>
    </div>

    <div class="feat-row">
      <div class="feat-pill green">
        <div class="feat-icon fi-green">📸</div>
        <div class="feat-text">
          <h5>Photos HD des Plats</h5>
          <p>Photos réelles haute définition pour chaque article, réduisant les erreurs de commande.</p>
        </div>
      </div>
      <div class="feat-pill blue">
        <div class="feat-icon fi-blue">🎯</div>
        <div class="feat-text">
          <h5>Cuissons & Suppléments Payants</h5>
          <p>Saignant, À point, Bien cuit, Sauces et fromages : répercutés instantanément sur l'addition.</p>
        </div>
      </div>
      <div class="feat-pill amber">
        <div class="feat-icon fi-amber">💵</div>
        <div class="feat-text">
          <h5>Monnaie Automatique en MRU</h5>
          <p>Calcul immédiat de la monnaie à rendre pour éliminer les erreurs de caissier.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <div class="pf-url">Démo live : <a href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
    <div class="pf-num">Page 3 / 8</div>
  </div>
</div>

<!-- ============================================================
     PAGE 4 — PLAN DE SALLE & KDS CUISINE
     ============================================================ -->
<div class="page inner-page">
  <div class="page-header">
    <div class="ph-brand">
      <img class="ph-logo" src="${imgLogo}" alt="Logo">
      <span class="ph-name">Caissa<span>.mr</span></span>
      <span class="ph-sep"></span>
      <span class="ph-label">2. Plan de Salle & Écran Cuisine KDS</span>
    </div>
    <div class="ph-badge"><span class="b-dot"></span> MODULE RESTAURATION PRO</div>
  </div>

  <div class="page-body">
    <div class="accent-line"></div>
    <div class="sec-label">Salle & Cuisine Connectées</div>
    <div class="sec-title">Gestion de Tables Graphique & KDS en Temps Réel</div>
    <p class="sec-desc">Synchronisation instantanée entre le personnel de salle et la brigade en cuisine. Fin des bons volants, des oublis et des contestations de commande.</p>

    <div class="dual-screens" style="flex: 1; gap: 10px;">
      <div class="screen-frame" style="display: flex; flex-direction: column;">
        <div class="screen-bar">
          <div class="screen-dots">
            <span class="screen-dot dot-r"></span>
            <span class="screen-dot dot-y"></span>
            <span class="screen-dot dot-g"></span>
          </div>
          <div class="screen-title">Plan de Salle — Statut Tables Temps Réel</div>
          <div class="screen-tag tag-green">SALLE</div>
        </div>
        <img class="screen-img" src="${imgTables}" style="flex: 1; height: 0; object-fit: cover; object-position: top;" alt="Plan de Tables">
      </div>

      <div class="screen-frame" style="display: flex; flex-direction: column;">
        <div class="screen-bar">
          <div class="screen-dots">
            <span class="screen-dot dot-r"></span>
            <span class="screen-dot dot-y"></span>
            <span class="screen-dot dot-g"></span>
          </div>
          <div class="screen-title">KDS — File de Commandes avec Chronomètre</div>
          <div class="screen-tag tag-amber">CUISINE</div>
        </div>
        <img class="screen-img" src="${imgKds}" style="flex: 1; height: 0; object-fit: cover; object-position: top;" alt="KDS Cuisine">
      </div>
    </div>

    <div class="feat-row">
      <div class="feat-pill green">
        <div class="feat-icon fi-green">🗺️</div>
        <div class="feat-text">
          <h5>Plan de Salle Graphique</h5>
          <p>Zones Terrasse, Salle intérieure et VIP. Transfert d'articles entre tables en 1 geste.</p>
        </div>
      </div>
      <div class="feat-pill amber">
        <div class="feat-icon fi-amber">👨‍🍳</div>
        <div class="feat-text">
          <h5>Écran KDS Cuisine</h5>
          <p>Les commandes arrivent sans délai avec les détails de cuisson et alertes de retard.</p>
        </div>
      </div>
      <div class="feat-pill blue">
        <div class="feat-icon fi-blue">⚡</div>
        <div class="feat-text">
          <h5>Synchronisation Instantanée</h5>
          <p>Le chef valide les plats prêts d'un geste pour prévenir le serveur immédiatement.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <div class="pf-url">Démo live : <a href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
    <div class="pf-num">Page 4 / 8</div>
  </div>
</div>

<!-- ============================================================
     PAGE 5 — BOUTIQUE, STOCKS & CARNET KRIDI
     ============================================================ -->
<div class="page inner-page">
  <div class="page-header">
    <div class="ph-brand">
      <img class="ph-logo" src="${imgLogo}" alt="Logo">
      <span class="ph-name">Caissa<span>.mr</span></span>
      <span class="ph-sep"></span>
      <span class="ph-label">3. Commerce de Détail & Carnet Kridi</span>
    </div>
    <div class="ph-badge"><span class="b-dot"></span> SPÉCIFICITÉ MAURITANIE</div>
  </div>

  <div class="page-body">
    <div class="accent-line"></div>
    <div class="sec-label">Retail & Crédit Client</div>
    <div class="sec-title">Scan Code-Barres & Le Kridi Électronique (الكريدي)</div>
    <p class="sec-desc">Caissa.mr répond directement au défi le plus pressant du commerce mauritanien : la maîtrise du crédit client. Le carnet de dettes digitalisé met fin aux contestations et aux pertes.</p>

    <div class="dual-screens" style="flex: 1; gap: 10px;">
      <div class="screen-frame" style="display: flex; flex-direction: column;">
        <div class="screen-bar">
          <div class="screen-dots">
            <span class="screen-dot dot-r"></span>
            <span class="screen-dot dot-y"></span>
            <span class="screen-dot dot-g"></span>
          </div>
          <div class="screen-title">Mode Boutique — Scan & Stock</div>
          <div class="screen-tag tag-blue">RETAIL</div>
        </div>
        <img class="screen-img" src="${imgBoutique}" style="flex: 1; height: 0; object-fit: cover; object-position: top;" alt="Mode Boutique">
      </div>

      <div class="screen-frame" style="display: flex; flex-direction: column;">
        <div class="screen-bar">
          <div class="screen-dots">
            <span class="screen-dot dot-r"></span>
            <span class="screen-dot dot-y"></span>
            <span class="screen-dot dot-g"></span>
          </div>
          <div class="screen-title">Panier Client — TVA 16% & Remises</div>
          <div class="screen-tag tag-green">MRU</div>
        </div>
        <img class="screen-img" src="${imgTicketCart}" style="flex: 1; height: 0; object-fit: cover; object-position: top;" alt="Panier">
      </div>
    </div>

    <div class="kridi-box">
      <div class="kridi-icon">📖</div>
      <div class="kridi-text">
        <h4>Le Carnet "Kridi" Électronique — دفتر الكريدي الرقمي</h4>
        <p>Fiche nominative par client avec numéro de téléphone, solde de dette en direct, historique complet des transactions à crédit, plafond d'endettement configurable et blocage automatique. Impression d'un relevé propre lors des remboursements.</p>
      </div>
    </div>

    <div class="feat-row">
      <div class="feat-pill blue">
        <div class="feat-icon fi-blue">🏷️</div>
        <div class="feat-text">
          <h5>Scan USB/Bluetooth</h5>
          <p>Compatible toutes douchettes standard du marché. Scan continu sans toucher l'écran.</p>
        </div>
      </div>
      <div class="feat-pill green">
        <div class="feat-icon fi-green">📦</div>
        <div class="feat-text">
          <h5>Stocks & Alertes</h5>
          <p>Décompte automatique à chaque vente avec alertes de rupture imminente.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <div class="pf-url">Démo live : <a href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
    <div class="pf-num">Page 5 / 8</div>
  </div>
</div>

<!-- ============================================================
     PAGE 6 — PAIEMENTS MOBILES & TICKET THERMIQUE
     ============================================================ -->
<div class="page inner-page">
  <div class="page-header">
    <div class="ph-brand">
      <img class="ph-logo" src="${imgLogo}" alt="Logo">
      <span class="ph-name">Caissa<span>.mr</span></span>
      <span class="ph-sep"></span>
      <span class="ph-label">4. Paiements Mobiles & Reçus Fiscaux</span>
    </div>
    <div class="ph-badge"><span class="b-dot"></span> BANKILY & MASRVI READY</div>
  </div>

  <div class="page-body">
    <div class="accent-line"></div>
    <div class="sec-label">Encaissement & Conformité</div>
    <div class="sec-title">Multicanal Mauritanien & Ticket Thermique Conforme NIF / TVA 16%</div>
    <p class="sec-desc">Tous les modes de paiement locaux en 1 clic avec traçabilité complète. Impression de reçus professionnels conformes aux normes fiscales mauritaniennes.</p>

    <div class="dual-screens" style="flex: 1; gap: 10px;">
      <div class="screen-frame" style="display: flex; flex-direction: column;">
        <div class="screen-bar">
          <div class="screen-dots">
            <span class="screen-dot dot-r"></span>
            <span class="screen-dot dot-y"></span>
            <span class="screen-dot dot-g"></span>
          </div>
          <div class="screen-title">Encaissement — Bankily / Espèces / Masrvi</div>
          <div class="screen-tag tag-green">MULTICANAL</div>
        </div>
        <img class="screen-img" src="${imgPaymentSuccess}" style="flex: 1; height: 0; object-fit: cover; object-position: top;" alt="Encaissement">
      </div>

      <div class="screen-frame" style="display: flex; flex-direction: column;">
        <div class="screen-bar">
          <div class="screen-dots">
            <span class="screen-dot dot-r"></span>
            <span class="screen-dot dot-y"></span>
            <span class="screen-dot dot-g"></span>
          </div>
          <div class="screen-title">Reçu Thermique — NIF, TVA 16%, Monnaie</div>
          <div class="screen-tag tag-blue">58mm / 80mm</div>
        </div>
        <img class="screen-img" src="${imgTicketDetails}" style="flex: 1; height: 0; object-fit: cover; object-position: top;" alt="Ticket Thermique">
      </div>
    </div>

    <div class="feat-row">
      <div class="feat-pill green">
        <div class="feat-icon fi-green">💳</div>
        <div class="feat-text">
          <h5>Bankily, Masrvi & Sedad</h5>
          <p>QR code de paiement généré + confirmation instantanée sans SMS manuel à vérifier.</p>
        </div>
      </div>
      <div class="feat-pill blue">
        <div class="feat-icon fi-blue">🧾</div>
        <div class="feat-text">
          <h5>Ticket Thermique 80mm</h5>
          <p>Logo commerce, NIF, détail TVA 16%, monnaie rendue et numéro séquentiel anti-fraude.</p>
        </div>
      </div>
      <div class="feat-pill purple">
        <div class="feat-icon fi-purple">📊</div>
        <div class="feat-text">
          <h5>Clôture Z Journalière</h5>
          <p>Rapprochement automatique Espèces / Bankily / Masrvi en fin de journée.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <div class="pf-url">Démo live : <a href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
    <div class="pf-num">Page 6 / 8</div>
  </div>
</div>

<!-- ============================================================
     PAGE 7 — OFFLINE-FIRST & MODÈLE SAAS
     ============================================================ -->
<div class="page inner-page">
  <div class="page-header">
    <div class="ph-brand">
      <img class="ph-logo" src="${imgLogo}" alt="Logo">
      <span class="ph-name">Caissa<span>.mr</span></span>
      <span class="ph-sep"></span>
      <span class="ph-label">5. Technologie Offline & Modèle Économique</span>
    </div>
    <div class="ph-badge"><span class="b-dot"></span> REVENUS RÉCURRENTS</div>
  </div>

  <div class="page-body">
    <div class="accent-line"></div>
    <div class="sec-label">Architecture & Rentabilité</div>
    <div class="sec-title">Résilience 100% Hors-Ligne & Modèle SaaS Récurrent</div>
    <p class="sec-desc">La caisse ne s'arrête jamais — même en cas de coupure de courant ou d'Internet. Le modèle d'abonnement SaaS génère des revenus mensuels récurrents prévisibles (MRR).</p>

    <div class="dual-screens" style="flex: 1; gap: 10px;">
      <div class="screen-frame" style="display: flex; flex-direction: column;">
        <div class="screen-bar">
          <div class="screen-dots">
            <span class="screen-dot dot-r"></span>
            <span class="screen-dot dot-y"></span>
            <span class="screen-dot dot-g"></span>
          </div>
          <div class="screen-title">Moteur Offline — Stockage Local IndexedDB</div>
          <div class="screen-tag tag-green">0% INTERRUPTION</div>
        </div>
        <img class="screen-img" src="${imgIndexedDb}" style="flex: 1; height: 0; object-fit: cover; object-position: center;" alt="IndexedDB Offline">
      </div>

      <div class="screen-frame" style="display: flex; flex-direction: column;">
        <div class="screen-bar">
          <div class="screen-dots">
            <span class="screen-dot dot-r"></span>
            <span class="screen-dot dot-y"></span>
            <span class="screen-dot dot-g"></span>
          </div>
          <div class="screen-title">Abonnements SaaS — 790 à 2 990 MRU / Mois</div>
          <div class="screen-tag tag-blue">MRR SCALABLE</div>
        </div>
        <img class="screen-img" src="${imgPricingSlider}" style="flex: 1; height: 0; object-fit: cover; object-position: center;" alt="Tarification SaaS">
      </div>
    </div>

    <div class="feat-row">
      <div class="feat-pill green">
        <div class="feat-icon fi-green">📡</div>
        <div class="feat-text">
          <h5>Offline-First (IndexedDB)</h5>
          <p>Toutes les ventes sont stockées localement et synchronisées à la reconnexion.</p>
        </div>
      </div>
      <div class="feat-pill blue">
        <div class="feat-icon fi-blue">💰</div>
        <div class="feat-text">
          <h5>Abonnements 790–2 990 MRU/Mois</h5>
          <p>Rétention élevée une fois adopté. Revenus mensuels récurrents prévisibles et scalables.</p>
        </div>
      </div>
      <div class="feat-pill amber">
        <div class="feat-icon fi-amber">🖨️</div>
        <div class="feat-text">
          <h5>Vente de Kits Matériels</h5>
          <p>Imprimantes thermiques, tiroirs-caisses et scanners : marges directes complémentaires.</p>
        </div>
      </div>
    </div>
  </div>

  <div class="page-footer">
    <div class="pf-url">Démo live : <a href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
    <div class="pf-num">Page 7 / 8</div>
  </div>
</div>

<!-- ============================================================
     PAGE 8 — ROADMAP (80%) & COLLABORATION SI TAHA
     ============================================================ -->
<div class="page inner-page">
  <div class="page-header">
    <div class="ph-brand">
      <img class="ph-logo" src="${imgLogo}" alt="Logo">
      <span class="ph-name">Caissa<span>.mr</span></span>
      <span class="ph-sep"></span>
      <span class="ph-label">Feuille de Route & Opportunité de Collaboration</span>
    </div>
    <div class="ph-badge" style="background: #f0fdf4; border-color: #bbf7d0; color: #15803d;">
      <span class="b-dot" style="background: #16a34a;"></span> POUR SI TAHA
    </div>
  </div>

  <div class="page-body">
    <div class="accent-line"></div>
    <div class="sec-label">Avancement Réel du Projet</div>
    <div class="sec-title">80% Réalisé & Opérationnel — Les 20% Restants</div>
    <p class="sec-desc">Le produit est dans une phase mature et largement exploitable commercialement dès aujourd'hui. Voici l'état précis d'avancement :</p>

    <div class="tri-cards">
      <div class="tri-card done">
        <span class="tri-tag">✓ 80% ACHEVÉ</span>
        <h4>Front-End & Moteur POS</h4>
        <p>Catalogue tactile, photos HD, variantes, Kridi, plan de tables, KDS, reçus, offline IndexedDB, Bankily et déploiement public sur Vercel.</p>
      </div>
      <div class="tri-card active">
        <span class="tri-tag">⚡ 10% EN COURS</span>
        <h4>Connexion Cloud Backend</h4>
        <p>Synchronisation distante sur Render / PostgreSQL et console d'administration multi-boutiques pour propriétaires de chaînes.</p>
      </div>
      <div class="tri-card next">
        <span class="tri-tag">🎯 10% PROCHAIN</span>
        <h4>Pilotes Terrain Nouakchott</h4>
        <p>Installation sur 5 premiers commerces pilotes (2 restaurants, 2 supérettes, 1 boutique) pour validation terrain.</p>
      </div>
    </div>

    <div class="accent-line" style="margin-top: 4px;"></div>
    <div class="sec-label">Propositions de Collaboration — Si Taha</div>

    <div class="tri-cards">
      <div class="tri-card starred">
        <span class="tri-tag">RECOMMANDÉ</span>
        <h4>Option 1 : Investisseur Stratégique</h4>
        <p>Entrée en capital (Seed) pour financer la force commerciale terrain, le stock matériel et l'accélération de la conquête du marché de Nouakchott.</p>
        <div class="tri-btn">FORTE RENTABILITÉ CAPITAL</div>
      </div>
      <div class="tri-card">
        <span class="tri-tag" style="background: #475569; color: white;">STRATÉGIQUE</span>
        <h4>Option 2 : Partenaire Commercial</h4>
        <p>Distribution exclusive auprès de votre réseau de commerces, hôtels et entreprises avec commissions récurrentes sur les abonnements.</p>
        <div class="tri-btn">COMMISSION SAAS RÉCURRENTE</div>
      </div>
      <div class="tri-card">
        <span class="tri-tag" style="background: #475569; color: white;">PILOTE</span>
        <h4>Option 3 : Client Pilote VIP</h4>
        <p>Équipement en avant-première de vos propres établissements ou ceux de vos associés, avec accompagnement technique prioritaire.</p>
        <div class="tri-btn">DÉPLOIEMENT PRIORITAIRE</div>
      </div>
    </div>

    <div class="cta-banner">
      <div class="cta-text">
        <h3>Testez la Plateforme en Direct Depuis Votre Téléphone</h3>
        <p>Lien public sécurisé (Mobile, Tablette, PC) : <strong style="color: #60a5fa;">https://caissa-mr.vercel.app</strong></p>
      </div>
      <a class="cta-btn" href="https://caissa-mr.vercel.app">Tester la Démo →</a>
    </div>

    <p style="font-size: 9px; color: #94a3b8; text-align: center; margin-top: 2px; font-style: italic;">
      💬 Vos remarques et retours d'expert en tant que professionnel de terrain sont les bienvenus pour enrichir les 20% restants et construire ensemble la référence du POS en Mauritanie.
    </p>
  </div>

  <div class="page-footer">
    <div class="pf-url">Dossier confidentiel — Caissa.mr © 2026</div>
    <div class="pf-num">Page 8 / 8</div>
  </div>
</div>

</body>
</html>`;

const htmlFilePath = path.join(__dirname, 'presentation_caissa.html');
const pdfFilePath = path.join(__dirname, 'PRESENTATION_CAISSA_MR.pdf');

fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('HTML A4 Portrait généré :', htmlFilePath, '— Lignes:', htmlContent.split('\n').length);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
console.log('Génération PDF via Edge Headless...');

try {
  execSync(
    `"${edgePath}" --headless --disable-gpu --allow-file-access-from-files --run-all-compositor-stages-before-draw --print-to-pdf="${pdfFilePath}" --no-pdf-header-footer "${htmlFilePath}"`,
    { stdio: 'inherit' }
  );
  const stats = fs.statSync(pdfFilePath);
  const pages = fs.readFileSync(pdfFilePath).toString('latin1').match(/\/Type\s*\/Page[^s]/g);
  console.log(`✅ PDF généré : ${(stats.size / 1024).toFixed(0)} KB — ${pages ? pages.length : '?'} pages`);
} catch (err) {
  console.error('Erreur PDF :', err.message);
}
