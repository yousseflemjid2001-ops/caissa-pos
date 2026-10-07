const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Génération du Pitch Deck A4 Paysage Premium ---');

function toFileUri(filePath) {
  return 'file:///' + filePath.replace(/\\/g, '/');
}

const screenshotsDir = path.join(__dirname, 'frontend', 'public', 'screenshots');
const publicDir = path.join(__dirname, 'frontend', 'public');

// Images
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
<title>Caissa.mr — Pitch Deck</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');

@page { size: 297mm 210mm; margin: 0; } /* A4 Landscape */
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: #ffffff;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
  color: #1e293b;
}

/* ============================
   SLIDE BASE = 297mm × 210mm
   ============================ */
.slide {
  width: 297mm;
  height: 210mm;
  position: relative;
  overflow: hidden;
  page-break-after: always;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

/* Typography Options */
h1, h2, h3, h4 { color: #0f172a; margin: 0; }
p { margin: 0; }
.text-accent { color: #10b981; }

/* ============================
   SLIDE 1: COVER
   ============================ */
.slide-cover {
  background: #0f172a;
  color: white;
  display: flex;
}
.cover-left {
  width: 50%;
  padding: 20mm;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.cover-right {
  width: 50%;
  position: relative;
}
.cover-logo {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30mm;
}
.cover-logo img { width: 50px; height: 50px; border-radius: 12px; }
.cover-logo span { font-size: 32px; font-weight: 800; letter-spacing: -1px; }
.cover-title {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1.5px;
  margin-bottom: 20px;
}
.cover-subtitle {
  font-size: 18px;
  font-weight: 400;
  color: #94a3b8;
  line-height: 1.5;
  margin-bottom: 30mm;
}
.cover-footer {
  font-size: 14px;
  color: #64748b;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 15px;
}
.cover-image-container {
  position: absolute;
  top: 10%;
  left: 0;
  width: 120%;
  height: 80%;
  background: white;
  border-radius: 16px;
  box-shadow: -20px 20px 60px rgba(0,0,0,0.5);
  overflow: hidden;
}
.cover-image-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top left;
}

/* ============================
   COMMON SLIDE LAYOUT
   ============================ */
.header {
  padding: 15mm 20mm 5mm;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
}
.header-titles h2 {
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: #10b981;
  font-weight: 700;
  margin-bottom: 8px;
}
.header-titles h1 {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1px;
}
.header-logo { display: flex; align-items: center; gap: 10px; opacity: 0.5; }
.header-logo img { width: 24px; border-radius: 6px; }
.header-logo span { font-size: 16px; font-weight: 800; }

.content {
  flex: 1;
  padding: 0 20mm 15mm;
  display: flex;
  gap: 15mm;
}
.footer {
  padding: 10mm 20mm;
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #94a3b8;
  border-top: 1px solid #f1f5f9;
}

/* ============================
   SLIDE: 2-COLUMN TEXT+IMAGE
   ============================ */
.col-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.col-text p {
  font-size: 18px;
  line-height: 1.6;
  color: #475569;
  margin-bottom: 25px;
}
.col-image {
  flex: 1.5;
  background: #f8fafc;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0,0,0,0.05);
  display: flex;
}
.col-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

/* ============================
   SLIDE: GRID / CARDS
   ============================ */
.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  width: 100%;
}
.grid-3 {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 20px;
  width: 100%;
}
.card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 25px;
}
.card-icon {
  font-size: 32px;
  margin-bottom: 15px;
}
.card h3 {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 10px;
}
.card p {
  font-size: 15px;
  color: #64748b;
  line-height: 1.5;
}
.card-highlight {
  background: #f0fdf4;
  border-color: #bbf7d0;
}
.card-highlight h3 { color: #15803d; }

/* ============================
   UI MOCKUP COMPONENT
   ============================ */
.mockup {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0,0,0,0.08);
  border: 1px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  height: 100%;
}
.mockup-bar {
  background: #f1f5f9;
  height: 24px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  border-bottom: 1px solid #e2e8f0;
}
.mockup-dots { display: flex; gap: 6px; }
.mockup-dot { width: 8px; height: 8px; border-radius: 50%; background: #cbd5e1; }
.mockup-content {
  flex: 1;
  background: white;
  position: relative;
}
.mockup-content img {
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: top;
}

</style>
</head>
<body>

<!-- SLIDE 1: COVER -->
<div class="slide slide-cover">
  <div class="cover-left">
    <div class="cover-logo">
      <img src="${imgLogo}" alt="Caissa Logo">
      <span>Caissa<span class="text-accent">.mr</span></span>
    </div>
    <div class="cover-title">
      Le 1er Système de Caisse SaaS<br>
      Conçu pour la Mauritanie
    </div>
    <div class="cover-subtitle">
      Encaissements Bankily, gestion du Kridi (الكريدي), fonctionnement hors-ligne garanti. Une solution premium pour les restaurants, boutiques et services à Nouakchott.
    </div>
    <div class="cover-footer">
      Dossier de présentation commercial et stratégique — Préparé pour Si Taha
    </div>
  </div>
  <div class="cover-right">
    <div class="cover-image-container">
      <img src="${imgRestaurantPhotos}" alt="Caissa POS">
    </div>
  </div>
</div>

<!-- SLIDE 2: LE CONSTAT -->
<div class="slide">
  <div class="header">
    <div class="header-titles">
      <h2>Le Marché</h2>
      <h1>La digitalisation du commerce en Mauritanie</h1>
    </div>
    <div class="header-logo">
      <img src="${imgLogo}"><span>Caissa.mr</span>
    </div>
  </div>
  <div class="content" style="flex-direction: column; justify-content: center;">
    <div class="grid-2">
      <div class="card" style="background: #fef2f2; border-color: #fecaca;">
        <div class="card-icon">⚠️</div>
        <h3>La Situation Actuelle</h3>
        <p style="margin-bottom: 10px;">• Les commerces utilisent des caisses obsolètes ou des carnets manuscrits.</p>
        <p style="margin-bottom: 10px;">• Le crédit client (Kridi) est mal géré, entraînant des pertes financières importantes.</p>
        <p>• Les paiements Bankily/Masrvi sont vérifiés manuellement sur des téléphones personnels.</p>
      </div>
      <div class="card card-highlight">
        <div class="card-icon">💡</div>
        <h3>La Solution Caissa.mr</h3>
        <p style="margin-bottom: 10px;">• Une application SaaS moderne, fonctionnant sur n'importe quel écran (tablette, PC).</p>
        <p style="margin-bottom: 10px;">• Un carnet Kridi digital intégré avec limites et historiques clairs.</p>
        <p>• Encaissement Bankily & Masrvi en 1 clic et impression de reçus professionnels.</p>
      </div>
    </div>
  </div>
  <div class="footer">
    <span>Démo Live: caissa-mr.vercel.app</span>
    <span>02</span>
  </div>
</div>

<!-- SLIDE 3: PRISE DE COMMANDE TACTILE (PRIORITY 1) -->
<div class="slide">
  <div class="header">
    <div class="header-titles">
      <h2>Module Principal</h2>
      <h1>1. Prise de Commande Tactile</h1>
    </div>
    <div class="header-logo">
      <img src="${imgLogo}"><span>Caissa.mr</span>
    </div>
  </div>
  <div class="content">
    <div class="col-text">
      <p>Une interface fluide, visuelle et ultra-rapide. Les photos haute définition réduisent les erreurs de saisie.</p>
      <p>Idéal pour la restauration et les commerces avec un fort flux client. La gestion des variantes (cuissons, tailles, suppléments) est immédiate et s'ajoute directement à l'addition.</p>
      <div style="display: flex; gap: 20px; margin-top: 20px;">
        <div>
          <h4 style="color:#10b981; font-size:24px; font-weight:800;">1 Clic</h4>
          <span style="font-size:14px; color:#64748b;">Par article</span>
        </div>
        <div>
          <h4 style="color:#10b981; font-size:24px; font-weight:800;">MRU</h4>
          <span style="font-size:14px; color:#64748b;">Monnaie calculée</span>
        </div>
      </div>
    </div>
    <div class="col-image" style="background: transparent; border: none; box-shadow: none; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
      <div class="mockup">
        <div class="mockup-bar"><div class="mockup-dots"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span></div></div>
        <div class="mockup-content"><img src="${imgPriseCommande}"></div>
      </div>
      <div class="mockup">
        <div class="mockup-bar"><div class="mockup-dots"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span></div></div>
        <div class="mockup-content"><img src="${imgModifierModal}"></div>
      </div>
    </div>
  </div>
  <div class="footer">
    <span>Démo Live: caissa-mr.vercel.app</span>
    <span>03</span>
  </div>
</div>

<!-- SLIDE 4: RESTAURATION -->
<div class="slide">
  <div class="header">
    <div class="header-titles">
      <h2>Restauration Pro</h2>
      <h1>2. Plan de Salle & Écran Cuisine (KDS)</h1>
    </div>
    <div class="header-logo">
      <img src="${imgLogo}"><span>Caissa.mr</span>
    </div>
  </div>
  <div class="content">
    <div class="col-text">
      <p>Fini les bons papier perdus. La salle et la cuisine sont connectées en temps réel.</p>
      <p><strong>Plan de Salle :</strong> Vue graphique des tables, gestion des statuts (libre, occupée, addition demandée).</p>
      <p><strong>Écran Cuisine (KDS) :</strong> Les cuisiniers voient les commandes arriver avec des chronomètres. Une fois prêt, un clic avertit le serveur.</p>
    </div>
    <div class="col-image" style="background: transparent; border: none; box-shadow: none; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
      <div class="mockup">
        <div class="mockup-bar"><div class="mockup-dots"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span></div></div>
        <div class="mockup-content"><img src="${imgTables}"></div>
      </div>
      <div class="mockup">
        <div class="mockup-bar"><div class="mockup-dots"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span></div></div>
        <div class="mockup-content"><img src="${imgKds}"></div>
      </div>
    </div>
  </div>
  <div class="footer">
    <span>Démo Live: caissa-mr.vercel.app</span>
    <span>04</span>
  </div>
</div>

<!-- SLIDE 5: BOUTIQUE ET KRIDI -->
<div class="slide">
  <div class="header">
    <div class="header-titles">
      <h2>Retail & Crédit</h2>
      <h1>3. Commerce de Détail & Carnet "Kridi"</h1>
    </div>
    <div class="header-logo">
      <img src="${imgLogo}"><span>Caissa.mr</span>
    </div>
  </div>
  <div class="content">
    <div class="col-text">
      <p>Adapté aux supérettes, pharmacies et prêt-à-porter avec scan de codes-barres ultra-rapide.</p>
      <div class="card card-highlight" style="padding: 15px; margin-top: 10px;">
        <h3 style="font-size: 18px; margin-bottom: 5px;">📖 Le Carnet Kridi Digital</h3>
        <p>Le problème n°1 en Mauritanie résolu. Suivi des dettes clients, plafond automatique, historique transparent et impression de relevés de dette pour éviter toute contestation.</p>
      </div>
    </div>
    <div class="col-image" style="background: transparent; border: none; box-shadow: none; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
      <div class="mockup">
        <div class="mockup-bar"><div class="mockup-dots"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span></div></div>
        <div class="mockup-content"><img src="${imgBoutique}"></div>
      </div>
      <div class="mockup">
        <div class="mockup-bar"><div class="mockup-dots"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span></div></div>
        <div class="mockup-content"><img src="${imgTicketCart}"></div>
      </div>
    </div>
  </div>
  <div class="footer">
    <span>Démo Live: caissa-mr.vercel.app</span>
    <span>05</span>
  </div>
</div>

<!-- SLIDE 6: PAIEMENTS ET TICKETS -->
<div class="slide">
  <div class="header">
    <div class="header-titles">
      <h2>Conformité</h2>
      <h1>4. Paiements Locaux & Tickets de Caisse</h1>
    </div>
    <div class="header-logo">
      <img src="${imgLogo}"><span>Caissa.mr</span>
    </div>
  </div>
  <div class="content">
    <div class="col-text">
      <p><strong>Bankily & Masrvi :</strong> Encaissement intégré en 1 clic. Finies les vérifications manuelles sur les téléphones personnels.</p>
      <p><strong>Tickets Professionnels :</strong> Impression sur imprimantes thermiques (58mm/80mm) avec le NIF du commerce, détail de la TVA (16%), logo et monnaie rendue.</p>
    </div>
    <div class="col-image" style="background: transparent; border: none; box-shadow: none; display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
      <div class="mockup">
        <div class="mockup-bar"><div class="mockup-dots"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span></div></div>
        <div class="mockup-content"><img src="${imgPaymentSuccess}"></div>
      </div>
      <div class="mockup" style="background: #f8fafc;">
        <div class="mockup-bar"><div class="mockup-dots"><span class="mockup-dot"></span><span class="mockup-dot"></span><span class="mockup-dot"></span></div></div>
        <div class="mockup-content" style="padding: 20px; display: flex; justify-content: center; background: #e2e8f0;">
          <img src="${imgTicketDetails}" style="width: auto; height: 100%; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
        </div>
      </div>
    </div>
  </div>
  <div class="footer">
    <span>Démo Live: caissa-mr.vercel.app</span>
    <span>06</span>
  </div>
</div>

<!-- SLIDE 7: OFFLINE & SAAS -->
<div class="slide">
  <div class="header">
    <div class="header-titles">
      <h2>Technologie & Modèle Économique</h2>
      <h1>5. Technologie Offline-First & Modèle SaaS</h1>
    </div>
    <div class="header-logo">
      <img src="${imgLogo}"><span>Caissa.mr</span>
    </div>
  </div>
  <div class="content" style="flex-direction: column; justify-content: center;">
    <div class="grid-2">
      <div class="card">
        <div class="card-icon">📡</div>
        <h3>Technologie 100% Offline</h3>
        <p>Les coupures internet sont fréquentes à Nouakchott. Caissa.mr stocke tout localement (IndexedDB) et la caisse continue de fonctionner sans interruption. Synchronisation automatique au retour de la connexion.</p>
      </div>
      <div class="card">
        <div class="card-icon">💰</div>
        <h3>Revenus Récurrents (MRR)</h3>
        <p>Un modèle économique basé sur des abonnements mensuels ou annuels (SaaS), garantissant des revenus prévisibles et évolutifs. Des marges additionnelles sont générées par la vente du matériel (imprimantes, scanners).</p>
      </div>
    </div>
  </div>
  <div class="footer">
    <span>Démo Live: caissa-mr.vercel.app</span>
    <span>07</span>
  </div>
</div>

<!-- SLIDE 8: ROADMAP & COLLABORATION -->
<div class="slide" style="background: #0f172a; color: white;">
  <div class="header" style="border-bottom: none;">
    <div class="header-titles">
      <h2 style="color: #34d399;">Prochaines Étapes</h2>
      <h1 style="color: white;">Collaborons Ensemble</h1>
    </div>
    <div class="header-logo">
      <img src="${imgLogo}"><span style="color: white;">Caissa.mr</span>
    </div>
  </div>
  <div class="content" style="flex-direction: column;">
    
    <div style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 20px; margin-bottom: 20px;">
      <h3 style="color: #34d399; margin-bottom: 10px; font-size: 20px;">État du Projet : 80% Achevés</h3>
      <p style="color: #cbd5e1; font-size: 16px;">Le produit (Frontend) est fonctionnel. Les 20% restants concernent la connexion à la base de données cloud (Backend) et le lancement des pilotes sur le terrain à Nouakchott.</p>
    </div>

    <div class="grid-3">
      <div class="card" style="background: transparent; border: 1px solid rgba(255,255,255,0.2);">
        <h3 style="color: white;">1. Investisseur Stratégique</h3>
        <p style="color: #94a3b8;">Entrée au capital pour financer le déploiement commercial et l'achat de stock matériel.</p>
      </div>
      <div class="card" style="background: transparent; border: 1px solid rgba(255,255,255,0.2);">
        <h3 style="color: white;">2. Partenariat Commercial</h3>
        <p style="color: #94a3b8;">Distribution exclusive avec partage de revenus sur les abonnements SaaS récurrents.</p>
      </div>
      <div class="card" style="background: transparent; border: 1px solid rgba(255,255,255,0.2);">
        <h3 style="color: white;">3. Client Pilote VIP</h3>
        <p style="color: #94a3b8;">Équiper vos établissements en priorité avec un tarif préférentiel et un support direct.</p>
      </div>
    </div>

    <div style="margin-top: auto; text-align: center; padding-top: 20px;">
      <h2 style="font-size: 24px; font-weight: 800; margin-bottom: 10px;">Testez la plateforme dès maintenant</h2>
      <p style="font-size: 18px; color: #34d399; font-weight: 700;">https://caissa-mr.vercel.app</p>
    </div>

  </div>
  <div class="footer" style="border-top: 1px solid rgba(255,255,255,0.1); color: #64748b;">
    <span>Dossier Confidentiel</span>
    <span>08</span>
  </div>
</div>

</body>
</html>`;

const htmlFilePath = path.join(__dirname, 'presentation_caissa_premium.html');
const pdfFilePath = path.join(__dirname, 'PRESENTATION_CAISSA_MR_PREMIUM.pdf');

fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('HTML A4 Paysage Premium généré :', htmlFilePath);

const edgePath = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
console.log('Génération PDF via Edge Headless...');

try {
  // Use --landscape flag for horizontal orientation
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
