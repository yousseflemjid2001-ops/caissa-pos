const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Compilation Optimisée du Dossier de Présentation (6 Pages, 14 Captures) ---');

// Chemins locaux directs en URI file:///
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

console.log('Images référencées par URI locale avec succès.');

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <title>Caissa.mr — Dossier de Présentation & Partenariat</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap');

    @page {
      size: A4 portrait;
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
      background-color: #f1f5f9;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .page {
      width: 210mm;
      height: 297mm;
      position: relative;
      background: #ffffff;
      padding: 12mm 15mm;
      box-sizing: border-box;
      page-break-after: always;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }

    /* En-tête */
    .doc-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 8px;
      border-bottom: 1.5px solid #e2e8f0;
      flex-shrink: 0;
    }
    .brand-group {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-logo-img {
      width: 34px;
      height: 34px;
      border-radius: 8px;
      box-shadow: 0 4px 10px rgba(16, 185, 129, 0.25);
    }
    .brand-name {
      font-size: 19px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.5px;
      line-height: 1;
    }
    .brand-name span {
      color: #10b981;
    }
    .brand-sub {
      font-size: 9px;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.8px;
      font-weight: 600;
      margin-top: 3px;
    }
    .header-badge {
      background: linear-gradient(135deg, #eff6ff, #dbeafe);
      color: #1d4ed8;
      border: 1px solid #bfdbfe;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .header-badge .dot {
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
    }

    /* Pied de page */
    .doc-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      font-size: 9px;
      color: #64748b;
      flex-shrink: 0;
    }
    .doc-footer .link {
      color: #2563eb;
      font-weight: 700;
      text-decoration: none;
    }

    /* Titres */
    h1 {
      font-size: 22px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.2;
      letter-spacing: -0.5px;
    }
    h2 {
      font-size: 15px;
      font-weight: 800;
      color: #0f172a;
      letter-spacing: -0.3px;
      display: flex;
      align-items: center;
      gap: 7px;
      margin-bottom: 5px;
    }
    h2::before {
      content: '';
      display: inline-block;
      width: 4px;
      height: 15px;
      background: #2563eb;
      border-radius: 2px;
    }
    p {
      font-size: 10.5px;
      line-height: 1.45;
      color: #475569;
    }

    /* Containers visuels & Mockups */
    .mockup-frame {
      background: #ffffff;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.06);
      position: relative;
    }
    .mockup-bar {
      background: #f8fafc;
      padding: 5px 10px;
      border-bottom: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .mockup-dots {
      display: flex;
      gap: 4px;
    }
    .mockup-dot {
      width: 6.5px;
      height: 6.5px;
      border-radius: 50%;
    }
    .dot-red { background: #ef4444; }
    .dot-yellow { background: #f59e0b; }
    .dot-green { background: #10b981; }
    .mockup-title {
      font-size: 9.5px;
      font-weight: 700;
      color: #334155;
    }
    .mockup-tag {
      font-size: 8.5px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 4px;
      background: #e0f2fe;
      color: #0369a1;
    }
    .mockup-tag.green {
      background: #dcfce7;
      color: #15803d;
    }
    .mockup-img {
      width: 100%;
      display: block;
      object-fit: cover;
    }

    /* Grilles d'images */
    .grid-2-equal {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
      margin: 8px 0;
    }
    .grid-2-asym {
      display: grid;
      grid-template-columns: 1.25fr 1fr;
      gap: 10px;
      margin: 8px 0;
      align-items: stretch;
    }

    /* Boîtes d'arguments */
    .card-info {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 10px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    .card-info h3 {
      font-size: 11.5px;
      font-weight: 800;
      color: #0f172a;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .card-info ul {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .card-info li {
      font-size: 10px;
      color: #475569;
      display: flex;
      align-items: flex-start;
      gap: 5px;
      line-height: 1.35;
    }

    /* Badges & Tags */
    .badge-pill {
      display: inline-block;
      font-size: 8.5px;
      font-weight: 700;
      padding: 2px 7px;
      border-radius: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .badge-blue { background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .badge-green { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
    .badge-amber { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }

    /* Page 1 Hero Specifics */
    .hero-banner-p1 {
      background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #1e293b 100%);
      border-radius: 12px;
      padding: 16px 18px;
      color: white;
      margin: 6px 0;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    .hero-banner-p1 h1 {
      color: #ffffff;
      font-size: 21px;
      margin: 4px 0 6px 0;
      font-family: 'Space Grotesk', sans-serif;
    }
    .hero-banner-p1 h1 span {
      background: linear-gradient(90deg, #38bdf8, #818cf8);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .hero-banner-p1 p {
      font-size: 11px;
      color: #cbd5e1;
      line-height: 1.45;
    }

    .kpi-row {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin: 6px 0;
    }
    .kpi-card {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      padding: 8px;
      text-align: center;
    }
    .kpi-card.highlight {
      border-color: #10b981;
      background: #f0fdf4;
    }
    .kpi-num {
      font-size: 20px;
      font-weight: 800;
      color: #0f172a;
      font-family: 'Space Grotesk', sans-serif;
    }
    .kpi-card.highlight .kpi-num {
      color: #059669;
    }
    .kpi-label {
      font-size: 9px;
      color: #64748b;
      font-weight: 600;
      margin-top: 2px;
    }

    .dest-card-p1 {
      background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
      border: 1.5px dashed #93c5fd;
      border-radius: 10px;
      padding: 8px 12px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    /* Timeline & Roadmap */
    .timeline-row {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      gap: 8px;
      margin: 6px 0;
    }
    .timeline-box {
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px;
      background: #f8fafc;
    }
    .timeline-box.done {
      border-color: #10b981;
      background: #f0fdf4;
    }
    .timeline-box.active {
      border-color: #3b82f6;
      background: #eff6ff;
    }
    .timeline-tag {
      font-size: 8.5px;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 10px;
      display: inline-block;
      margin-bottom: 5px;
    }
    .timeline-box.done .timeline-tag { background: #10b981; color: white; }
    .timeline-box.active .timeline-tag { background: #2563eb; color: white; }
    .timeline-box.next .timeline-tag { background: #94a3b8; color: white; }
    .timeline-box h4 {
      font-size: 10.5px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 3px;
    }
    .timeline-box p {
      font-size: 9px;
      color: #64748b;
      line-height: 1.35;
    }

    /* Collaboration options */
    .collab-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin: 6px 0;
    }
    .collab-item {
      border: 1.5px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .collab-item.prime {
      border-color: #2563eb;
      background: linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%);
      box-shadow: 0 4px 10px rgba(37, 99, 235, 0.08);
    }
    .collab-item h4 {
      font-size: 11px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 3px;
    }
    .collab-item p {
      font-size: 9.5px;
      color: #64748b;
      line-height: 1.35;
    }
    .collab-btn {
      margin-top: 6px;
      font-size: 8.5px;
      font-weight: 700;
      padding: 3px 6px;
      border-radius: 5px;
      text-align: center;
      background: #e2e8f0;
      color: #334155;
    }
    .collab-item.prime .collab-btn {
      background: #2563eb;
      color: #ffffff;
    }

    .cta-banner {
      background: linear-gradient(135deg, #0f172a, #1e293b);
      border-radius: 10px;
      padding: 10px 14px;
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 6px;
    }
    .cta-banner h3 {
      font-size: 12px;
      font-weight: 800;
      color: #ffffff;
    }
    .cta-banner p {
      font-size: 10px;
      color: #94a3b8;
    }
    .cta-action-btn {
      background: #10b981;
      color: #ffffff;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 10.5px;
      font-weight: 800;
      text-decoration: none;
      box-shadow: 0 4px 10px rgba(16, 185, 129, 0.35);
    }
  </style>
</head>
<body>

  <!-- ==================== PAGE 1 : COUVERTURE & VITRINE PRINCIPALE ==================== -->
  <div class="page">
    <div class="doc-header">
      <div class="brand-group">
        <img class="brand-logo-img" src="${imgLogo}" alt="Logo Caissa">
        <div>
          <div class="brand-name">Caissa<span>.mr</span></div>
          <div class="brand-sub">Caisse Enregistreuse & POS Intelligent Mauritanie</div>
        </div>
      </div>
      <div class="header-badge">
        <span class="dot"></span>
        80% ACHEVÉ & TESTABLE EN DIRECT
      </div>
    </div>

    <div class="hero-banner-p1">
      <span class="badge-pill" style="background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.4);">
        DOSSIER STRATÉGIQUE & PRÉSENTATION PRODUIT
      </span>
      <h1>La Première Solution POS SaaS <span>100% Mauritanienne</span></h1>
      <p>
        Plateforme de caisse tactile connectée : paiements mobiles locaux (Bankily, Masrvi), carnet de crédit client (Kridi), plan de table & écran cuisine KDS, résilience totale 100% hors-ligne.
      </p>
    </div>

    <!-- Grande Capture Principale de l'Application Réelle -->
    <div class="mockup-frame">
      <div class="mockup-bar">
        <div class="mockup-dots">
          <span class="mockup-dot dot-red"></span>
          <span class="mockup-dot dot-yellow"></span>
          <span class="mockup-dot dot-green"></span>
        </div>
        <div class="mockup-title">Capture 1 : Écran Principal POS Tactile avec Photos des Plats & Panier Actif</div>
        <div class="mockup-tag green">PRODUCTION VERCEL ACTIVE</div>
      </div>
      <img class="mockup-img" src="${imgRestaurantPhotos}" style="height: 255px;" alt="Écran Principal Caissa.mr">
    </div>

    <div class="kpi-row">
      <div class="kpi-card highlight">
        <div class="kpi-num">80%</div>
        <div class="kpi-label">Développement Fait (MVP Opérationnel)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-num">MRU</div>
        <div class="kpi-label">Ouguiya, Bankily, Masrvi & Kridi</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-num">0 ms</div>
        <div class="kpi-label">Arrêt de Caisse (100% Offline-First)</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-num">4 Métiers</div>
        <div class="kpi-label">Resto, Retail, Épicerie & Services</div>
      </div>
    </div>

    <div class="dest-card-p1">
      <div>
        <h4 style="font-size: 11px; font-weight: 800; color: #1e3a8a;">Dossier Préparé pour : Si Taha</h4>
        <p style="font-size: 9.5px; color: #475569;">Revue de l'état d'avancement, opportunité de partenariat stratégique et investissement.</p>
      </div>
      <span class="badge-pill badge-blue" style="font-size: 9.5px; padding: 4px 10px;">CONFIDENTIEL</span>
    </div>

    <div class="doc-footer">
      <div>Démo active : <a class="link" href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
      <div>Page 1 / 6</div>
    </div>
  </div>

  <!-- ==================== PAGE 2 : PRISE DE COMMANDE & PERSONNALISATION ==================== -->
  <div class="page">
    <div class="doc-header">
      <div class="brand-group">
        <img class="brand-logo-img" src="${imgLogo}" alt="Logo Caissa">
        <div>
          <div class="brand-name">Caissa<span>.mr</span></div>
          <div class="brand-sub">Ergonomie Caisse & Prise de Commande Tactile</div>
        </div>
      </div>
      <div class="header-badge">
        <span class="dot"></span>
        MODULE COMMANDE TACTILE
      </div>
    </div>

    <div>
      <h2>Vitesse de Saisie & Personnalisation Instantanée des Articles</h2>
      <p style="margin-bottom: 6px;">Conçu pour réduire l'attente au comptoir à moins de 30 secondes par client, avec photos haute définition des plats et gestion fine des options.</p>
    </div>

    <div class="grid-2-asym">
      <!-- Capture 2 : Prise de commande globale -->
      <div class="mockup-frame">
        <div class="mockup-bar">
          <div class="mockup-title">Capture 2 : Navigation par Catégories & Grille Produits</div>
          <div class="mockup-tag">SÉLECTION EN 1 CLIC</div>
        </div>
        <img class="mockup-img" src="${imgPriseCommande}" style="height: 220px;" alt="Prise de commande">
      </div>

      <!-- Capture 3 : Modale des variantes & suppléments -->
      <div class="mockup-frame">
        <div class="mockup-bar">
          <div class="mockup-title">Capture 3 : Gestion des Variantes & Cuissons</div>
          <div class="mockup-tag green">ZÉRO ERREUR</div>
        </div>
        <img class="mockup-img" src="${imgModifierModal}" style="height: 220px;" alt="Modale Variantes">
      </div>
    </div>

    <div>
      <h2>Une Solution Déclinée en 4 Secteurs Métiers</h2>
      <p style="margin-bottom: 6px;">Le système s'adapte automatiquement à la typologie de chaque commerce d'un simple clic dans la configuration :</p>
      
      <!-- Capture 4 : cartes métiers -->
      <div class="mockup-frame" style="margin-bottom: 6px;">
        <div class="mockup-bar">
          <div class="mockup-title">Capture 4 : Architecture Métiers (Restaurants, Épiceries, Boutiques Retail & Salons)</div>
          <div class="mockup-tag">MULTI-ACTIVITÉS</div>
        </div>
        <img class="mockup-img" src="${imgSectorCards}" style="height: 155px;" alt="Cartes métiers">
      </div>
    </div>

    <div class="grid-2-equal" style="margin: 0;">
      <div class="card-info">
        <h3>⚡ Encaissement Éclair</h3>
        <p>Touches rapides, filtrage instantané par famille de produits, calcul immédiat de la monnaie à rendre en Ouguiya (MRU).</p>
      </div>
      <div class="card-info">
        <h3>🎯 Cuisson & Suppléments Automatisés</h3>
        <p>Sélection des cuissons (Saignant, À point), des sauces et des suppléments payants répercutés instantanément sur l'addition.</p>
      </div>
    </div>

    <div class="doc-footer">
      <div>Démo active : <a class="link" href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
      <div>Page 2 / 6</div>
    </div>
  </div>

  <!-- ==================== PAGE 3 : RESTAURATION — PLAN DE TABLE & KDS CUISINE ==================== -->
  <div class="page">
    <div class="doc-header">
      <div class="brand-group">
        <img class="brand-logo-img" src="${imgLogo}" alt="Logo Caissa">
        <div>
          <div class="brand-name">Caissa<span>.mr</span></div>
          <div class="brand-sub">Module Restauration : Salle & Cuisine Connectées</div>
        </div>
      </div>
      <div class="header-badge">
        <span class="dot"></span>
        MODULE RESTAURATION PRO
      </div>
    </div>

    <div>
      <h2>Plan de Salle Interactif & Écran Cuisine KDS en Temps Réel</h2>
      <p style="margin-bottom: 6px;">Suppression totale des carnets manuscrits en salle et des bons de commande volants en cuisine. Tout est synchronisé sans fil et instantanément.</p>
    </div>

    <!-- Capture 5 : Plan de Tables -->
    <div class="mockup-frame" style="margin-bottom: 8px;">
      <div class="mockup-bar">
        <div class="mockup-dots">
          <span class="mockup-dot dot-red"></span>
          <span class="mockup-dot dot-yellow"></span>
          <span class="mockup-dot dot-green"></span>
        </div>
        <div class="mockup-title">Capture 5 : Plan de Salle Graphique — Gestion Visuelle des Tables & Zones (Terrasse, Salle, VIP)</div>
        <div class="mockup-tag">STATUT TEMPS RÉEL</div>
      </div>
      <img class="mockup-img" src="${imgTables}" style="height: 185px;" alt="Plan de Tables Restaurant">
    </div>

    <!-- Capture 6 : Écran Cuisine KDS -->
    <div class="mockup-frame" style="margin-bottom: 8px;">
      <div class="mockup-bar">
        <div class="mockup-dots">
          <span class="mockup-dot dot-red"></span>
          <span class="mockup-dot dot-yellow"></span>
          <span class="mockup-dot dot-green"></span>
        </div>
        <div class="mockup-title">Capture 6 : KDS Écran Cuisine — File d'Attente des Commandes avec Chronomètre pour le Chef</div>
        <div class="mockup-tag green">SYNCHRONISATION 0 SECONDE</div>
      </div>
      <img class="mockup-img" src="${imgKds}" style="height: 185px;" alt="Écran KDS Cuisine">
    </div>

    <div class="grid-2-equal" style="margin: 0;">
      <div class="card-info">
        <h3>🍽️ Plan de Tables Intelligent</h3>
        <ul>
          <li>• Visualisation en direct : <em>Disponible (Vert)</em>, <em>Occupée (Bleu)</em>, <em>Addition demandée (Orange)</em>.</li>
          <li>• Affectation des serveurs par zone, transfert d'articles d'une table à une autre en un clic.</li>
        </ul>
      </div>
      <div class="card-info">
        <h3>👨‍🍳 Écran Tactile Cuisine (KDS)</h3>
        <ul>
          <li>• Les commandes de la salle s'affichent automatiquement sur l'écran du chef avec minuteur d'attente.</li>
          <li>• Notification visuelle des suppléments et allergies, validation au doigt quand le plat est prêt.</li>
        </ul>
      </div>
    </div>

    <div class="doc-footer">
      <div>Démo active : <a class="link" href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
      <div>Page 3 / 6</div>
    </div>
  </div>

  <!-- ==================== PAGE 4 : BOUTIQUE, STOCKS & CARNET KRIDI ==================== -->
  <div class="page">
    <div class="doc-header">
      <div class="brand-group">
        <img class="brand-logo-img" src="${imgLogo}" alt="Logo Caissa">
        <div>
          <div class="brand-name">Caissa<span>.mr</span></div>
          <div class="brand-sub">Commerce de Détail, Scan Code-Barres & Carnet Kridi</div>
        </div>
      </div>
      <div class="header-badge">
        <span class="dot"></span>
        SPÉCIFICITÉ MAURITANIE
      </div>
    </div>

    <div>
      <h2>Commerce de Détail & La Fin des Pertes d'Argent sur le "Kridi"</h2>
      <p style="margin-bottom: 6px;">En Mauritanie, des milliers d'Ouguiyas sont perdus chaque mois à cause de cahiers de dettes illisibles ou contestés. Caissa.mr digitalise le Kridi à 100%.</p>
    </div>

    <div class="grid-2-equal">
      <!-- Capture 7 : Mode Boutique -->
      <div class="mockup-frame">
        <div class="mockup-bar">
          <div class="mockup-title">Capture 7 : Interface Boutique (Scan Code-Barres & Stocks)</div>
          <div class="mockup-tag">RETAIL MODE</div>
        </div>
        <img class="mockup-img" src="${imgBoutique}" style="height: 225px;" alt="Mode Boutique">
      </div>

      <!-- Capture 8 : Panier Détaillé -->
      <div class="mockup-frame">
        <div class="mockup-bar">
          <div class="mockup-title">Capture 8 : Gestion du Panier Client & Calculs Précis</div>
          <div class="mockup-tag green">TVA 16% & REMISES</div>
        </div>
        <img class="mockup-img" src="${imgTicketCart}" style="height: 225px;" alt="Panier Détaillé">
      </div>
    </div>

    <div style="background: linear-gradient(135deg, #fffbeb, #fef3c7); border: 1.5px solid #fde68a; border-radius: 10px; padding: 10px 14px; margin: 6px 0;">
      <h3 style="font-size: 12px; font-weight: 800; color: #92400e; margin-bottom: 3px; display: flex; align-items: center; gap: 6px;">
        <span>📖</span> L'Innovation "Kridi" Électronique (دفتر الكريدي الرقمي)
      </h3>
      <p style="font-size: 10px; color: #78350f; line-height: 1.45;">
        Chaque client régulier possède sa fiche nominative avec son numéro de téléphone. Lorsqu'il achète à crédit, la dette est ajoutée en 1 seconde à son solde. Le système bloque automatiquement les ventes si le plafond autorisé est atteint et imprime un relevé clair lors des remboursements partiels.
      </p>
    </div>

    <div class="grid-2-equal" style="margin: 0;">
      <div class="card-info">
        <h3>🏷️ Scan Code-Barres Ultra-Fluide</h3>
        <p>Compatible avec toutes les douchettes USB/Bluetooth standard du marché. Scan continu sans toucher à l'écran.</p>
      </div>
      <div class="card-info">
        <h3>📦 Gestion & Alertes de Stock</h3>
        <p>Décompte automatique des stocks à chaque vente, alerte visuelle orange dès qu'un article approche du seuil critique.</p>
      </div>
    </div>

    <div class="doc-footer">
      <div>Démo active : <a class="link" href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
      <div>Page 4 / 6</div>
    </div>
  </div>

  <!-- ==================== PAGE 5 : ENCAISSEMENT MOBILE & TICKET THERMIQUE ==================== -->
  <div class="page">
    <div class="doc-header">
      <div class="brand-group">
        <img class="brand-logo-img" src="${imgLogo}" alt="Logo Caissa">
        <div>
          <div class="brand-name">Caissa<span>.mr</span></div>
          <div class="brand-sub">Paiements Mobiles Mauritanie & Reçus Fiscaux</div>
        </div>
      </div>
      <div class="header-badge">
        <span class="dot"></span>
        BANKILY & MASRVI PRÊTS
      </div>
    </div>

    <div>
      <h2>Encaissement Multicanal : Espèces, Bankily, Masrvi & Reçu Conforme</h2>
      <p style="margin-bottom: 6px;">Gestion centralisée de tous les modes de paiement mauritaniens avec impression de ticket thermique instantanée conforme aux normes fiscales.</p>
    </div>

    <div class="grid-2-equal">
      <!-- Capture 9 : Validation Paiement -->
      <div class="mockup-frame">
        <div class="mockup-bar">
          <div class="mockup-title">Capture 9 : Écran d'Encaissement & Validation du Paiement</div>
          <div class="mockup-tag green">BANKILY / ESPÈCES</div>
        </div>
        <img class="mockup-img" src="${imgPaymentSuccess}" style="height: 235px;" alt="Paiement Succès">
      </div>

      <!-- Capture 10 : Ticket de Caisse Thermique -->
      <div class="mockup-frame">
        <div class="mockup-bar">
          <div class="mockup-title">Capture 10 : Reçu Thermique Officiel avec NIF & TVA 16%</div>
          <div class="mockup-tag">FORMAT 80MM / 58MM</div>
        </div>
        <img class="mockup-img" src="${imgTicketDetails}" style="height: 235px;" alt="Ticket Thermique Détaillé">
      </div>
    </div>

    <div>
      <h2>Paramétrage Fiscal & Personnalisation du Commerce</h2>
      <div class="grid-2-asym" style="margin: 5px 0;">
        <!-- Capture 11 : Établissement -->
        <div class="mockup-frame">
          <div class="mockup-bar">
            <div class="mockup-title">Capture 11 : Fiche Établissement (NIF, Devise MRU, Taux TVA)</div>
            <div class="mockup-tag">PARAMÈTRES</div>
          </div>
          <img class="mockup-img" src="${imgEstablishment}" style="height: 145px;" alt="Fiche Établissement">
        </div>

        <div class="card-info" style="justify-content: center;">
          <h3>📋 Traçabilité & Clôture Z</h3>
          <ul>
            <li>• Numéro de facture unique séquentiel anti-fraude.</li>
            <li>• Calcul transparent de la TVA mauritanienne (16%).</li>
            <li>• Clôture journalière (Z de caisse) avec réconciliation automatique des totaux espèces vs Bankily vs Masrvi.</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="doc-footer">
      <div>Démo active : <a class="link" href="https://caissa-mr.vercel.app">https://caissa-mr.vercel.app</a></div>
      <div>Page 5 / 6</div>
    </div>
  </div>

  <!-- ==================== PAGE 6 : OFFLINE, MODÈLE & COLLABORATION SI TAHA ==================== -->
  <div class="page">
    <div class="doc-header">
      <div class="brand-group">
        <img class="brand-logo-img" src="${imgLogo}" alt="Logo Caissa">
        <div>
          <div class="brand-name">Caissa<span>.mr</span></div>
          <div class="brand-sub">Roadmap, Modèle Économique & Partenariat</div>
        </div>
      </div>
      <div class="header-badge">
        <span class="dot"></span>
        COLLABORATION & INVESTISSEMENT
      </div>
    </div>

    <div>
      <h2>Résilience Hors-Ligne (Offline-First) & Modèle Économique SaaS</h2>
      <p style="margin-bottom: 5px;">Aucune dépendance réseau : même en coupure d'Internet ou d'électricité, la caisse tourne sur batterie et stocke tout localement.</p>
    </div>

    <div class="grid-2-equal">
      <!-- Capture 12 : IndexedDB -->
      <div class="mockup-frame">
        <div class="mockup-bar">
          <div class="mockup-title">Capture 12 : Moteur Offline (Base Locale IndexedDB Résiliente)</div>
          <div class="mockup-tag green">0% INTERRUPTION</div>
        </div>
        <img class="mockup-img" src="${imgIndexedDb}" style="height: 140px;" alt="Inspecteur IndexedDB">
      </div>

      <!-- Capture 13 : Pricing Slider -->
      <div class="mockup-frame">
        <div class="mockup-bar">
          <div class="mockup-title">Capture 13 : Abonnements SaaS Récurrents (790 à 2 990 MRU)</div>
          <div class="mockup-tag">REVENUS RÉCURRENTS</div>
        </div>
        <img class="mockup-img" src="${imgPricingSlider}" style="height: 140px;" alt="Grille Tarifaire">
      </div>
    </div>

    <div>
      <h2>État d'Avancement Réel (80% Réalisé)</h2>
      <div class="timeline-row">
        <div class="timeline-box done">
          <span class="timeline-tag">✓ 80% ACHEVÉ</span>
          <h4>Front-End & Moteur POS</h4>
          <p>Panier, catalogue tactile, photos, variantes, Kridi, tables, KDS, reçus, offline IndexedDB & déploiement Vercel actif.</p>
        </div>
        <div class="timeline-box active">
          <span class="timeline-tag">⚡ 10% EN COURS</span>
          <h4>Backend Cloud & Base</h4>
          <p>Synchronisation cloud sur Render/PostgreSQL et console d'administration multi-boutiques.</p>
        </div>
        <div class="timeline-box next">
          <span class="timeline-tag">🎯 10% PROCHAIN</span>
          <h4>Pilotes Terrain</h4>
          <p>Installation sur les 5 premiers commerces pilotes à Nouakchott pour retours d'usage.</p>
        </div>
      </div>
    </div>

    <div>
      <h2>Modalités de Collaboration Proposées à Si Taha</h2>
      <div class="collab-grid">
        <div class="collab-item prime">
          <div>
            <h4>Option 1 : Investisseur Stratégique</h4>
            <p>Entrée au capital (Seed) pour financer le stock matériel de caisse et l'équipe commerciale à Nouakchott.</p>
          </div>
          <div class="collab-btn">FORTE RENTABILITÉ</div>
        </div>
        <div class="collab-item">
          <div>
            <h4>Option 2 : Partenaire Commercial</h4>
            <p>Distribution exclusive sur votre réseau de commerces, cafés et entreprises avec commissions récurrentes.</p>
          </div>
          <div class="collab-btn">COMMISSION SAAS</div>
        </div>
        <div class="collab-item">
          <div>
            <h4>Option 3 : Client Pilote VIP</h4>
            <p>Équipement en avant-première de vos points de vente avec accompagnement technique sur-mesure.</p>
          </div>
          <div class="collab-btn">DÉPLOIEMENT PRIORITAIRE</div>
        </div>
      </div>
    </div>

    <div class="cta-banner">
      <div>
        <h3>Découvrez la plateforme en direct dès maintenant</h3>
        <p>Lien public sécurisé : <strong>https://caissa-mr.vercel.app</strong></p>
      </div>
      <a class="cta-action-btn" href="https://caissa-mr.vercel.app">Tester la Démo Live →</a>
    </div>

    <div style="margin-top: 5px; text-align: center; font-size: 9px; color: #64748b;">
      💬 <em>"Vos remarques et retours d'expert sont les bienvenus pour enrichir la version finale. Discutons ensemble des prochaines étapes !"</em>
    </div>

    <div class="doc-footer">
      <div>Dossier confidentiel adressé à Si Taha — Caissa.mr</div>
      <div>Page 6 / 6</div>
    </div>
  </div>

</body>
</html>
`;

const htmlFilePath = path.join(__dirname, 'presentation_caissa.html');
const pdfFilePath = path.join(__dirname, 'PRESENTATION_CAISSA_MR.pdf');

fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('Fichier HTML généré avec succès :', htmlFilePath);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
console.log('Lancement de l\'impression PDF via Edge Headless...');

try {
  const edgeCmd = `"${edgePath}" --headless --disable-gpu --allow-file-access-from-files --run-all-compositor-stages-before-draw --print-to-pdf="${pdfFilePath}" --no-pdf-header-footer "${htmlFilePath}"`;
  execSync(edgeCmd, { stdio: 'inherit' });
  console.log('PDF généré avec succès :', pdfFilePath);

  if (fs.existsSync(pdfFilePath)) {
    const stats = fs.statSync(pdfFilePath);
    console.log(`Taille finale du fichier PDF : ${(stats.size / 1024).toFixed(1)} KB`);
  }
} catch (err) {
  console.error('Erreur lors de la génération du PDF :', err);
}
