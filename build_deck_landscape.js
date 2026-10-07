const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Compilation du Pitch Deck Exécutif A4 Paysage (8 Slides Premium) ---');

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
  <title>Caissa.mr — Pitch Deck Exécutif & Partenariat</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&family=Amiri:wght@700&display=swap');

    @page {
      size: 297mm 210mm; /* A4 Paysage */
      margin: 0;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1e293b;
      background-color: #0f172a;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .slide {
      width: 297mm;
      height: 210mm;
      position: relative;
      background: #ffffff;
      padding: 10mm 14mm;
      box-sizing: border-box;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    /* En-tête Slide */
    .slide-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 38px;
      border-bottom: 1.5px solid #e2e8f0;
      padding-bottom: 6px;
      flex-shrink: 0;
    }
    .brand-box {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-logo {
      width: 32px;
      height: 32px;
      border-radius: 8px;
    }
    .brand-title {
      font-size: 19px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      line-height: 1;
    }
    .brand-title span {
      color: #10b981;
    }
    .brand-tag {
      font-size: 9px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 700;
      margin-left: 6px;
      padding-left: 8px;
      border-left: 1.5px solid #cbd5e1;
    }
    .slide-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      background: #eff6ff;
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
    }
    .slide-badge .dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #10b981;
    }

    /* Pied de page Slide */
    .slide-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 24px;
      border-top: 1px solid #e2e8f0;
      padding-top: 6px;
      font-size: 9px;
      color: #64748b;
      flex-shrink: 0;
    }
    .slide-footer .link {
      color: #2563eb;
      font-weight: 700;
      text-decoration: none;
    }

    /* Corps de la Slide */
    .slide-body {
      flex: 1;
      display: flex;
      gap: 16px;
      padding: 10px 0;
      overflow: hidden;
    }

    /* Layout 2 Colonnes Paysage */
    .col-left {
      width: 42%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 8px;
    }
    .col-right {
      width: 58%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .col-half {
      width: 50%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 8px;
    }

    /* Typographie */
    .slide-title-group h2 {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.4px;
      line-height: 1.25;
      margin-bottom: 4px;
    }
    .slide-title-group p {
      font-size: 11px;
      color: #475569;
      line-height: 1.45;
    }
    .tag-category {
      font-size: 8.5px;
      font-weight: 800;
      color: #2563eb;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      margin-bottom: 3px;
      display: inline-block;
    }

    /* Cartes & Blocs d'Arguments */
    .feature-card {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 12px;
      display: flex;
      gap: 10px;
      align-items: flex-start;
    }
    .feature-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 15px;
      flex-shrink: 0;
      font-weight: 800;
    }
    .icon-blue { background: #eff6ff; color: #2563eb; }
    .icon-green { background: #dcfce7; color: #16a34a; }
    .icon-amber { background: #fef3c7; color: #d97706; }
    .icon-purple { background: #f3e8ff; color: #9333ea; }

    .feature-content h4 {
      font-size: 11.5px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .feature-content p {
      font-size: 10px;
      color: #64748b;
      line-height: 1.4;
    }

    /* Cadres Mockup d'Écran */
    .mockup-window {
      width: 100%;
      height: 100%;
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
      display: flex;
      flex-direction: column;
    }
    .mockup-header {
      background: #f1f5f9;
      height: 24px;
      padding: 0 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e2e8f0;
      flex-shrink: 0;
    }
    .mockup-controls {
      display: flex;
      gap: 5px;
    }
    .mockup-c-dot {
      width: 6.5px;
      height: 6.5px;
      border-radius: 50%;
    }
    .c-red { background: #ef4444; }
    .c-yellow { background: #f59e0b; }
    .c-green { background: #10b981; }
    .mockup-caption {
      font-size: 9.5px;
      font-weight: 700;
      color: #334155;
    }
    .mockup-badge {
      font-size: 8px;
      font-weight: 800;
      padding: 2px 6px;
      border-radius: 4px;
      background: #dcfce7;
      color: #15803d;
      text-transform: uppercase;
    }
    .mockup-content-img {
      width: 100%;
      height: calc(100% - 24px);
      object-fit: cover;
      display: block;
    }

    /* Grille de 2 Mockups */
    .dual-mockup-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      width: 100%;
      height: 100%;
    }

    /* Arabic typography */
    .arabic-text {
      font-family: 'Amiri', serif;
      font-size: 13px;
      font-weight: 700;
      direction: rtl;
    }

    /* Couverture Spécifique (Slide 1) */
    .slide-cover {
      background: linear-gradient(135deg, #0b1329 0%, #172554 50%, #0f172a 100%);
      color: #ffffff;
    }
    .slide-cover .slide-header {
      border-bottom-color: rgba(255, 255, 255, 0.12);
    }
    .slide-cover .brand-title {
      color: #ffffff;
    }
    .slide-cover .brand-tag {
      color: #94a3b8;
      border-left-color: rgba(255, 255, 255, 0.2);
    }
    .slide-cover .slide-footer {
      border-top-color: rgba(255, 255, 255, 0.12);
      color: #94a3b8;
    }
    .cover-left {
      width: 48%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 12px;
    }
    .cover-right {
      width: 52%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .cover-badge-top {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.4);
      color: #34d399;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 9.5px;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 0.8px;
    }
    .cover-title {
      font-size: 26px;
      font-weight: 800;
      line-height: 1.2;
      color: #ffffff;
      font-family: 'Space Grotesk', sans-serif;
    }
    .cover-title span {
      background: linear-gradient(90deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .cover-desc {
      font-size: 11px;
      color: #cbd5e1;
      line-height: 1.5;
    }
    .cover-kpis {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .cover-kpi {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 8px 6px;
      text-align: center;
    }
    .cover-kpi.highlight {
      border-color: #10b981;
      background: rgba(16, 185, 129, 0.1);
    }
    .cover-kpi-val {
      font-size: 18px;
      font-weight: 800;
      color: #ffffff;
      font-family: 'Space Grotesk', sans-serif;
    }
    .cover-kpi.highlight .cover-kpi-val {
      color: #34d399;
    }
    .cover-kpi-lbl {
      font-size: 8px;
      color: #94a3b8;
      font-weight: 600;
      margin-top: 2px;
    }
    .dest-pill {
      background: rgba(37, 99, 235, 0.15);
      border: 1px dashed rgba(96, 165, 250, 0.5);
      border-radius: 8px;
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .dest-pill h4 {
      font-size: 10.5px;
      font-weight: 800;
      color: #93c5fd;
    }
    .dest-pill p {
      font-size: 9px;
      color: #cbd5e1;
    }

    /* Grille Roadmap (Slide 8) */
    .roadmap-strip {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      margin-bottom: 10px;
    }
    .rm-card {
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 12px;
      background: #f8fafc;
    }
    .rm-card.done {
      border-color: #10b981;
      background: #f0fdf4;
    }
    .rm-card.active {
      border-color: #3b82f6;
      background: #eff6ff;
    }
    .rm-tag {
      font-size: 8px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 12px;
      display: inline-block;
      margin-bottom: 4px;
    }
    .rm-card.done .rm-tag { background: #10b981; color: white; }
    .rm-card.active .rm-tag { background: #2563eb; color: white; }
    .rm-card.next .rm-tag { background: #94a3b8; color: white; }
    .rm-card h4 {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .rm-card p {
      font-size: 9.5px;
      color: #64748b;
      line-height: 1.35;
    }

    /* Options d'investissement (Slide 8) */
    .collab-strip {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 12px;
      margin-bottom: 10px;
    }
    .collab-box {
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 12px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .collab-box.starred {
      border-color: #2563eb;
      background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%);
      box-shadow: 0 4px 12px rgba(37, 99, 235, 0.08);
    }
    .collab-box h4 {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 2px;
    }
    .collab-box p {
      font-size: 9.5px;
      color: #64748b;
      line-height: 1.35;
    }
    .collab-badge {
      margin-top: 6px;
      font-size: 8.5px;
      font-weight: 800;
      padding: 3px 6px;
      border-radius: 5px;
      text-align: center;
      background: #e2e8f0;
      color: #334155;
    }
    .collab-box.starred .collab-badge {
      background: #2563eb;
      color: #ffffff;
    }

    .cta-deck {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      border-radius: 10px;
      padding: 10px 16px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .cta-deck h3 {
      font-size: 12px;
      font-weight: 800;
      color: #ffffff;
    }
    .cta-deck p {
      font-size: 9.5px;
      color: #94a3b8;
    }
    .cta-deck-btn {
      background: #10b981;
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 10px;
      font-weight: 800;
      text-decoration: none;
    }
  </style>
</head>
<body>

  <!-- ==================== SLIDE 1 : COUVERTURE & VISION STRATÉGIQUE ==================== -->
  <div class="slide slide-cover">
    <div class="slide-header">
      <div class="brand-box">
        <img class="brand-logo" src="${imgLogo}" alt="Logo">
        <div class="brand-title">Caissa<span>.mr</span></div>
        <div class="brand-tag">POS Intelligent Mauritanie</div>
      </div>
      <div class="slide-badge" style="background: rgba(16, 185, 129, 0.2); border-color: rgba(16, 185, 129, 0.5); color: #34d399;">
        <span class="dot"></span>
        80% ACHEVÉ & DÉPLOYÉ EN LIGNE
      </div>
    </div>

    <div class="slide-body">
      <div class="cover-left">
        <div>
          <span class="cover-badge-top">Dossier Exécutif & Partenariat</span>
          <h1 class="cover-title" style="margin-top: 6px;">La Première Solution POS SaaS <span>100% Mauritanienne</span></h1>
          <p class="cover-desc" style="margin-top: 6px;">
            Plateforme de caisse enregistreuse tactile connectée : paiements mobiles locaux (Bankily, Masrvi), carnet de crédit client (Kridi), écran cuisine KDS en temps réel et résilience totale 100% hors-ligne.
          </p>
        </div>

        <div class="cover-kpis">
          <div class="cover-kpi highlight">
            <div class="cover-kpi-val">80%</div>
            <div class="cover-kpi-lbl">Développement Réalisé (MVP Live)</div>
          </div>
          <div class="cover-kpi">
            <div class="cover-kpi-val">MRU</div>
            <div class="cover-kpi-lbl">Ouguiya, Bankily & Masrvi</div>
          </div>
          <div class="cover-kpi">
            <div class="cover-kpi-val">0 ms</div>
            <div class="cover-kpi-lbl">Temps d'Arrêt (Offline-First)</div>
          </div>
          <div class="cover-kpi">
            <div class="cover-kpi-val">4-en-1</div>
            <div class="cover-kpi-lbl">Resto, Retail, Épicerie & Services</div>
          </div>
        </div>

        <div class="dest-pill">
          <div>
            <h4>Dossier Préparé pour : Si Taha</h4>
            <p>Revue du projet, opportunité de partenariat stratégique et investissement.</p>
          </div>
          <span style="font-size: 8.5px; font-weight: 800; background: #2563eb; color: white; padding: 3px 8px; border-radius: 4px;">CONFIDENTIEL</span>
        </div>
      </div>

      <div class="cover-right">
        <div class="mockup-window" style="height: 125mm; border-color: rgba(255, 255, 255, 0.2);">
          <div class="mockup-header" style="background: rgba(15, 23, 42, 0.85); border-bottom-color: rgba(255, 255, 255, 0.1);">
            <div class="mockup-controls">
              <span class="mockup-c-dot c-red"></span>
              <span class="mockup-c-dot c-yellow"></span>
              <span class="mockup-c-dot c-green"></span>
            </div>
            <div class="mockup-caption" style="color: #cbd5e1;">Écran Tactile Caisse Restauration (Direct Production Vercel)</div>
            <div class="mockup-badge">LIVE ACTIVE</div>
          </div>
          <img class="mockup-content-img" src="${imgRestaurantPhotos}" alt="Écran Principal">
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>Plateforme déployée et testable : <a class="link" href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
      <div>Slide 1 / 8</div>
    </div>
  </div>

  <!-- ==================== SLIDE 2 : MARCHÉ MAURITANIEN & 4 MÉTIERS ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-box">
        <img class="brand-logo" src="${imgLogo}" alt="Logo">
        <div class="brand-title">Caissa<span>.mr</span></div>
        <div class="brand-tag">Opportunité & Secteurs</div>
      </div>
      <div class="slide-badge"><span class="dot"></span> ANALYSE DE MARCHÉ</div>
    </div>

    <div class="slide-body">
      <div class="col-left">
        <div class="slide-title-group">
          <span class="tag-category">LE MARCHÉ EN MAURITANIE</span>
          <h2>Remplacer les Caisses Obsolètes & les Cahiers Papier</h2>
          <p>Plus de 90% des commerces et restaurants à Nouakchott fonctionnent avec des caisses fermées archaïques ou des carnets manuscrits sujets à d'importantes fuites financières.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-amber">⚠️</div>
          <div class="feature-content">
            <h4>Pertes d'argent sur le Kridi</h4>
            <p>Le crédit client manuscrit est source de contestations permanentes et de dettes jamais recouvrées.</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-blue">📱</div>
          <div class="feature-content">
            <h4>Paiements Mobiles Déconnectés</h4>
            <p>Vérification manuelle des SMS Bankily sur des téléphones personnels sans rapprochement avec la caisse.</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-green">✅</div>
          <div class="feature-content">
            <h4>La Réponse Caissa.mr</h4>
            <p>Une solution 100% logicielle sur tablette ou PC, connectée à Bankily/Masrvi et résiliente hors-ligne.</p>
          </div>
        </div>
      </div>

      <div class="col-right">
        <div class="mockup-window" style="height: 125mm;">
          <div class="mockup-header">
            <div class="mockup-controls">
              <span class="mockup-c-dot c-red"></span>
              <span class="mockup-c-dot c-yellow"></span>
              <span class="mockup-c-dot c-green"></span>
            </div>
            <div class="mockup-caption">Les 4 Solutions Métiers Spécialisées : Restauration, Épicerie, Mode & Services</div>
            <div class="mockup-badge">MULTI-SECTEURS</div>
          </div>
          <img class="mockup-content-img" src="${imgSectorCards}" alt="Solutions Métiers">
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>Plateforme déployée et testable : <a class="link" href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
      <div>Slide 2 / 8</div>
    </div>
  </div>

  <!-- ==================== SLIDE 3 : PRISE DE COMMANDE & VARIANTES ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-box">
        <img class="brand-logo" src="${imgLogo}" alt="Logo">
        <div class="brand-title">Caissa<span>.mr</span></div>
        <div class="brand-tag">Cœur de Caisse Tactile</div>
      </div>
      <div class="slide-badge"><span class="dot"></span> RAPIDITÉ & ZÉRO ERREUR</div>
    </div>

    <div class="slide-body">
      <div class="col-left">
        <div class="slide-title-group">
          <span class="tag-category">EXPÉRIENCE UTILISATEUR</span>
          <h2>Prise de Commande Tactile Ultra-Rapide</h2>
          <p>Interface ergonomique pensée pour les rushs d'affluence. Un serveur ou caissier est immédiatement opérationnel en moins de 5 minutes de prise en main.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-blue">⚡</div>
          <div class="feature-content">
            <h4>Navigation Visuelle en 1 Clic</h4>
            <p>Filtrage instantané par familles de produits (Burgers, Plats, Boissons, Desserts) avec photos HD alléchantes.</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-purple">🎯</div>
          <div class="feature-content">
            <h4>Modale des Variantes & Cuissons</h4>
            <p>Sélection automatique des cuissons (Saignant, À point), des sauces et des suppléments payants répercutés au centime près.</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-green">💵</div>
          <div class="feature-content">
            <h4>Calcul Automatique en Ouguiya (MRU)</h4>
            <p>Calcul immédiat de la monnaie à rendre pour éviter les erreurs de caisse des employés.</p>
          </div>
        </div>
      </div>

      <div class="col-right">
        <div class="dual-mockup-grid" style="height: 125mm;">
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="mockup-caption">Grille de Sélection Rapide</div>
              <div class="mockup-badge">PHOTO HD</div>
            </div>
            <img class="mockup-content-img" src="${imgPriseCommande}" alt="Prise Commande">
          </div>
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="mockup-caption">Modale Options & Cuissons</div>
              <div class="mockup-badge">OPTIONS</div>
            </div>
            <img class="mockup-content-img" src="${imgModifierModal}" alt="Modale Variantes">
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>Plateforme déployée et testable : <a class="link" href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
      <div>Slide 3 / 8</div>
    </div>
  </div>

  <!-- ==================== SLIDE 4 : RESTAURATION — PLAN DE SALLE & KDS CUISINE ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-box">
        <img class="brand-logo" src="${imgLogo}" alt="Logo">
        <div class="brand-title">Caissa<span>.mr</span></div>
        <div class="brand-tag">Restauration & Cafés</div>
      </div>
      <div class="slide-badge"><span class="dot"></span> SALLE & CUISINE CONNECTÉES</div>
    </div>

    <div class="slide-body">
      <div class="col-left">
        <div class="slide-title-group">
          <span class="tag-category">MODULE RESTAURATION PRO</span>
          <h2>Plan de Salle Interactif & Écran Cuisine KDS</h2>
          <p>Synchronisation sans fil instantanée entre le personnel de salle et la brigade en cuisine. Suppression totale des bons papier volants et des oublis de commande.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-blue">🍽️</div>
          <div class="feature-content">
            <h4>Plan de Tables Graphique en Direct</h4>
            <p>Visualisation des zones (Terrasse, Salle, VIP) et des statuts en direct : <em>Disponible (Vert)</em>, <em>Occupée (Bleu)</em>, <em>Addition (Orange)</em>.</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-green">👨‍🍳</div>
          <div class="feature-content">
            <h4>KDS Écran Tactile Cuisine</h4>
            <p>Les commandes apparaissent instantanément sous les yeux du chef avec chronomètre d'attente et détails des cuissons.</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-amber">⏱️</div>
          <div class="feature-content">
            <h4>Zéro Seconde de Latence</h4>
            <p>Les plats préparés sont validés d'un simple geste tactile pour prévenir le serveur que l'assiette est prête à servir.</p>
          </div>
        </div>
      </div>

      <div class="col-right">
        <div class="dual-mockup-grid" style="height: 125mm;">
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="mockup-caption">Plan de Salle & Statut Tables</div>
              <div class="mockup-badge">SALLE</div>
            </div>
            <img class="mockup-content-img" src="${imgTables}" alt="Plan Tables">
          </div>
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="mockup-caption">KDS Écran Cuisine Tactile</div>
              <div class="mockup-badge">CUISINE</div>
            </div>
            <img class="mockup-content-img" src="${imgKds}" alt="KDS Cuisine">
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>Plateforme déployée et testable : <a class="link" href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
      <div>Slide 4 / 8</div>
    </div>
  </div>

  <!-- ==================== SLIDE 5 : COMMERCE DE DÉTAIL & CARNET KRIDI ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-box">
        <img class="brand-logo" src="${imgLogo}" alt="Logo">
        <div class="brand-title">Caissa<span>.mr</span></div>
        <div class="brand-tag">Boutiques, Supérettes & Kridi</div>
      </div>
      <div class="slide-badge"><span class="dot"></span> SPÉCIFICITÉ MAURITANIE</div>
    </div>

    <div class="slide-body">
      <div class="col-left">
        <div class="slide-title-group">
          <span class="tag-category">RETAIL & CRÉDIT CLIENT</span>
          <h2>Scan Code-Barres & Le Carnet "Kridi" Électronique</h2>
          <p>Une réponse technologique directe au plus grand problème de gestion des commerçants mauritaniens : la maîtrise du crédit client (الكريدي).</p>
        </div>

        <div class="feature-card" style="background: #fffbeb; border-color: #fde68a;">
          <div class="feature-icon icon-amber">📖</div>
          <div class="feature-content">
            <h4><span class="arabic-text">دفتر الكريدي الرقمي</span> — Carnet Kridi Sécurisé</h4>
            <p>Fiche nominative avec numéro de téléphone, historique des dettes, plafonds d'endettement autorisés et édition de relevé lors des remboursements.</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-blue">🏷️</div>
          <div class="feature-content">
            <h4>Scan Code-Barres Douchette</h4>
            <p>Prise en charge des lecteurs USB/Bluetooth pour le scan rapide des articles en supérette et boutique de prêt-à-porter.</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-green">📦</div>
          <div class="feature-content">
            <h4>Gestion & Alertes de Stock</h4>
            <p>Décompte en temps réel, alertes automatiques en cas de rupture imminente et historique des mouvements d'inventaire.</p>
          </div>
        </div>
      </div>

      <div class="col-right">
        <div class="dual-mockup-grid" style="height: 125mm;">
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="mockup-caption">Mode Boutique & Scan</div>
              <div class="mockup-badge">RETAIL</div>
            </div>
            <img class="mockup-content-img" src="${imgBoutique}" alt="Mode Boutique">
          </div>
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="mockup-caption">Panier & Calcul TVA 16%</div>
              <div class="mockup-badge">PANIER</div>
            </div>
            <img class="mockup-content-img" src="${imgTicketCart}" alt="Panier Détaillé">
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>Plateforme déployée et testable : <a class="link" href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
      <div>Slide 5 / 8</div>
    </div>
  </div>

  <!-- ==================== SLIDE 6 : PAIEMENTS MOBILES & TICKET THERMIQUE ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-box">
        <img class="brand-logo" src="${imgLogo}" alt="Logo">
        <div class="brand-title">Caissa<span>.mr</span></div>
        <div class="brand-tag">Paiements & Reçus Fiscaux</div>
      </div>
      <div class="slide-badge"><span class="dot"></span> BANKILY & MASRVI PRÊTS</div>
    </div>

    <div class="slide-body">
      <div class="col-left">
        <div class="slide-title-group">
          <span class="tag-category">CONFORMITÉ & ENCAISSEMENT</span>
          <h2>Encaissement Multicanal & Ticket Thermique Conforme</h2>
          <p>Intégration directe des canaux de paiement mauritaniens et impression de reçus professionnels aux normes fiscales avec NIF et TVA 16%.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-green">💳</div>
          <div class="feature-content">
            <h4>Bankily, Masrvi, Sedad & Espèces</h4>
            <p>Validation instantanée du mode de règlement avec génération de QR code de paiement et calcul automatique de la monnaie rendue.</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-blue">🧾</div>
          <div class="feature-content">
            <h4>Ticket Thermique 58mm / 80mm</h4>
            <p>Impression avec raison sociale, logo, identifiant NIF, détail des lignes, ventilation TVA et mentions légales mauritaniennes.</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-purple">📊</div>
          <div class="feature-content">
            <h4>Clôture Journalière (Z de Caisse)</h4>
            <p>Rapprochement automatique en fin de journée : total Espèces vs total Bankily vs total Masrvi pour éviter tout écart de trésorerie.</p>
          </div>
        </div>
      </div>

      <div class="col-right">
        <div class="dual-mockup-grid" style="height: 125mm;">
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="mockup-caption">Encaissement & Validation</div>
              <div class="mockup-badge">PAIEMENT</div>
            </div>
            <img class="mockup-content-img" src="${imgPaymentSuccess}" alt="Encaissement">
          </div>
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="mockup-caption">Reçu Thermique Officiel</div>
              <div class="mockup-badge">NIF & TVA</div>
            </div>
            <img class="mockup-content-img" src="${imgTicketDetails}" alt="Ticket Thermique">
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>Plateforme déployée et testable : <a class="link" href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
      <div>Slide 6 / 8</div>
    </div>
  </div>

  <!-- ==================== SLIDE 7 : OFFLINE & MODÈLE SAAS ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-box">
        <img class="brand-logo" src="${imgLogo}" alt="Logo">
        <div class="brand-title">Caissa<span>.mr</span></div>
        <div class="brand-tag">Technologie & Modèle Récurrent</div>
      </div>
      <div class="slide-badge"><span class="dot"></span> OFFLINE-FIRST & MRR</div>
    </div>

    <div class="slide-body">
      <div class="col-left">
        <div class="slide-title-group">
          <span class="tag-category">ARCHITECTURE & REVENUS</span>
          <h2>Résilience 100% Hors-Ligne & Modèle d'Abonnement SaaS</h2>
          <p>Une résilience absolue adaptée aux coupures fréquentes d'électricité ou d'Internet, couplée à un modèle d'affaires récurrent prévisible.</p>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-green">📡</div>
          <div class="feature-content">
            <h4>Moteur Offline-First (IndexedDB)</h4>
            <p>Le point de vente continue d'enregistrer les ventes même sans signal. Les données sont automatiquement resynchronisées dès le retour du réseau.</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-blue">💰</div>
          <div class="feature-content">
            <h4>Revenus Récurrents Prévisibles (MRR)</h4>
            <p>Abonnements mensuels et annuels de 790 à 2 990 MRU par point de vente, avec un coût de rétention élevé une fois la solution adoptée.</p>
          </div>
        </div>

        <div class="feature-card">
          <div class="feature-icon icon-amber">🖨️</div>
          <div class="feature-content">
            <h4>Vente de Packs Matériels Certifiés</h4>
            <p>Marge directe sur la fourniture d'imprimantes thermiques Bluetooth, tiroirs-caisses et douchettes codes-barres.</p>
          </div>
        </div>
      </div>

      <div class="col-right">
        <div class="dual-mockup-grid" style="height: 125mm;">
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="mockup-caption">Moteur Offline Local</div>
              <div class="mockup-badge">INDEXEDDB</div>
            </div>
            <img class="mockup-content-img" src="${imgIndexedDb}" alt="IndexedDB">
          </div>
          <div class="mockup-window">
            <div class="mockup-header">
              <div class="mockup-caption">Grille Tarifaire SaaS</div>
              <div class="mockup-badge">MRU / MOIS</div>
            </div>
            <img class="mockup-content-img" src="${imgPricingSlider}" alt="Tarifs SaaS">
          </div>
        </div>
      </div>
    </div>

    <div class="slide-footer">
      <div>Plateforme déployée et testable : <a class="link" href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
      <div>Slide 7 / 8</div>
    </div>
  </div>

  <!-- ==================== SLIDE 8 : STATUT (80%), ROADMAP & COLLABORATION SI TAHA ==================== -->
  <div class="slide">
    <div class="slide-header">
      <div class="brand-box">
        <img class="brand-logo" src="${imgLogo}" alt="Logo">
        <div class="brand-title">Caissa<span>.mr</span></div>
        <div class="brand-tag">Partenariat & Investissement</div>
      </div>
      <div class="slide-badge" style="background: #f0fdf4; border-color: #bbf7d0; color: #16a34a;">
        <span class="dot" style="background: #16a34a;"></span>
        OPPORTUNITÉ SI TAHA
      </div>
    </div>

    <div class="slide-body" style="flex-direction: column; justify-content: space-between;">
      <div class="slide-title-group" style="margin-bottom: 2px;">
        <span class="tag-category">FEUILLE DE ROUTE & OPPORTUNITÉ D'AFFAIRES</span>
        <h2>Statut Actuel (80% Réalisé) & Modalités de Collaboration</h2>
        <p>Le produit est déjà mature et opérationnel. Voici les étapes de finalisation et les opportunités d'association proposées :</p>
      </div>

      <!-- Frise Chronologique Roadmap -->
      <div class="roadmap-strip">
        <div class="rm-card done">
          <span class="rm-tag">✓ FAIT (80%)</span>
          <h4>Front-End & Moteur POS Complet</h4>
          <p>Catalogue tactile, photos HD, gestion tables, écran cuisine KDS, panier, TVA 16%, monnaie, offline IndexedDB et déploiement public en ligne.</p>
        </div>

        <div class="rm-card active">
          <span class="rm-tag">⚡ EN COURS (10%)</span>
          <h4>Connexion Cloud & PostgreSQL</h4>
          <p>Synchronisation cloud des données sur Render/PostgreSQL et console de supervision multi-boutiques pour propriétaires de franchises.</p>
        </div>

        <div class="rm-card next">
          <span class="rm-tag">🎯 PROCHAIN (10%)</span>
          <h4>Déploiement Pilotes (Nouakchott)</h4>
          <p>Installation sur les 5 premiers commerces pilotes partenaires (2 restaurants, 2 supérettes, 1 boutique) pour retour terrain.</p>
        </div>
      </div>

      <!-- 3 Formules de Collaboration pour Si Taha -->
      <div class="collab-strip">
        <div class="collab-box starred">
          <div>
            <h4>Option 1 : Investisseur Stratégique (Seed)</h4>
            <p>Prise de participation au capital pour financer le fonds de roulement, le stock matériel (imprimantes/tiroirs) et la force commerciale terrain.</p>
          </div>
          <span class="collab-badge">FORTE RENTABILITÉ CAPITAL</span>
        </div>

        <div class="collab-box">
          <div>
            <h4>Option 2 : Partenaire Commercial & Réseau</h4>
            <p>Distribution exclusive ou recommandée auprès de votre réseau de commerces, cafés et entreprises, avec partage de commissions récurrentes.</p>
          </div>
          <span class="collab-badge">COMMISSIONS SAAS RÉCURRENTES</span>
        </div>

        <div class="collab-box">
          <div>
            <h4>Option 3 : Partenaire Pilote d'Honneur</h4>
            <p>Équipement en avant-première de vos établissements ou de ceux de vos partenaires, avec intégrations sur-mesure et support VIP dédié.</p>
          </div>
          <span class="collab-badge">DÉPLOIEMENT PRIORITAIRE</span>
        </div>
      </div>

      <!-- Bannière d'Action CTA -->
      <div class="cta-deck">
        <div>
          <h3>Découvrez le SaaS en direct dès maintenant</h3>
          <p>Lien public sécurisé testable sur mobile, tablette et PC : <strong>https://caissa-mr.vercel.app</strong></p>
        </div>
        <a class="cta-deck-btn" href="https://caissa-mr.vercel.app">Tester la Démo Live →</a>
      </div>
    </div>

    <div class="slide-footer">
      <div>Dossier confidentiel adressé à Si Taha — Caissa.mr POS Mauritanie</div>
      <div>Slide 8 / 8</div>
    </div>
  </div>

</body>
</html>
`;

const htmlFilePath = path.join(__dirname, 'presentation_caissa.html');
const pdfFilePath = path.join(__dirname, 'PRESENTATION_CAISSA_MR.pdf');

fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('Fichier HTML Paysage généré avec succès :', htmlFilePath);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
console.log('Lancement de l\'impression PDF Paysage via Edge Headless...');

try {
  const edgeCmd = `"${edgePath}" --headless --disable-gpu --allow-file-access-from-files --run-all-compositor-stages-before-draw --print-to-pdf="${pdfFilePath}" --no-pdf-header-footer "${htmlFilePath}"`;
  execSync(edgeCmd, { stdio: 'inherit' });
  console.log('PDF Paysage généré avec succès :', pdfFilePath);

  if (fs.existsSync(pdfFilePath)) {
    const stats = fs.statSync(pdfFilePath);
    console.log(`Taille finale du fichier PDF Paysage : ${(stats.size / 1024).toFixed(1)} KB`);
  }
} catch (err) {
  console.error('Erreur lors de la génération du PDF :', err);
}
