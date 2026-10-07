const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('--- Génération du Rapport Exécutif A4 (Dense & Professionnel) ---');

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
const imgPaymentSuccess = toFileUri(path.join(screenshotsDir, 'payment_receipt_success_1791318272048.png'));
const imgTicketDetails = toFileUri(path.join(screenshotsDir, 'ticket_details.png'));

const htmlContent = `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Caissa.mr — Rapport Exécutif A4</title>
<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

@page { size: 210mm 297mm; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', sans-serif;
  background: #ffffff;
  color: #1e293b;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}

/* ============================
   STRUCTURE DE PAGE
   ============================ */
.page {
  width: 210mm;
  height: 297mm;
  position: relative;
  overflow: hidden;
  page-break-after: always;
  background: #ffffff;
  display: flex;
  flex-direction: column;
}

.page-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 15mm;
}

/* ============================
   TYPOGRAPHIE
   ============================ */
h1 { font-size: 28px; font-weight: 800; color: #0f172a; letter-spacing: -0.5px; margin-bottom: 5px; }
h2 { font-size: 18px; font-weight: 700; color: #334155; margin-bottom: 12px; border-bottom: 2px solid #e2e8f0; padding-bottom: 5px; }
h3 { font-size: 14px; font-weight: 700; color: #0f172a; margin-bottom: 5px; }
p { font-size: 11px; color: #475569; line-height: 1.5; margin-bottom: 8px; text-align: justify; }
ul { margin-left: 15px; margin-bottom: 10px; }
li { font-size: 11px; color: #475569; line-height: 1.5; margin-bottom: 4px; }

.text-accent { color: #10b981; font-weight: 700; }
.text-highlight { background: #fef9c3; padding: 2px 4px; border-radius: 2px; color: #854d0e; }

/* ============================
   HEADER & FOOTER (PAGES)
   ============================ */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8mm;
  padding-bottom: 4mm;
  border-bottom: 3px solid #0f172a;
}
.header-brand { display: flex; align-items: center; gap: 10px; }
.header-brand img { width: 24px; border-radius: 6px; }
.header-brand span { font-size: 18px; font-weight: 800; color: #0f172a; }
.header-title { font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 1px; }

.footer {
  margin-top: auto;
  border-top: 1px solid #e2e8f0;
  padding-top: 5mm;
  display: flex;
  justify-content: space-between;
  font-size: 9px;
  color: #94a3b8;
}

/* ============================
   COVER PAGE
   ============================ */
.cover-bg { background: #0f172a; color: white; }
.cover-bg h1, .cover-bg h2, .cover-bg h3 { color: white; }
.cover-bg p { color: #cbd5e1; }
.cover-hero { text-align: center; margin-top: 20mm; margin-bottom: 15mm; }
.cover-hero img { width: 60px; margin-bottom: 15px; border-radius: 12px; }
.cover-hero h1 { font-size: 40px; margin-bottom: 15px; }
.cover-hero p { font-size: 14px; text-align: center; max-width: 80%; margin: 0 auto; line-height: 1.6; }
.cover-image { width: 100%; border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.1); }
.cover-stats { display: flex; justify-content: space-between; margin-top: 15mm; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 10mm; }
.stat-box { text-align: center; flex: 1; }
.stat-val { font-size: 24px; font-weight: 800; color: #34d399; margin-bottom: 5px; }
.stat-lbl { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; }

/* ============================
   GRID & LAYOUT
   ============================ */
.grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8mm; }
.col-left { padding-right: 5mm; }
.col-right { padding-left: 5mm; border-left: 1px solid #e2e8f0; }

.content-box {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 8mm;
}
.content-box h3 { color: #1e293b; font-size: 13px; margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
.content-box p { margin-bottom: 0; }

/* ============================
   IMAGES & MOCKUPS
   ============================ */
.img-container {
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 6mm;
  box-shadow: 0 4px 10px rgba(0,0,0,0.05);
}
.img-header {
  background: #f1f5f9;
  height: 18px;
  border-bottom: 1px solid #cbd5e1;
  display: flex;
  align-items: center;
  padding: 0 8px;
}
.img-dots { display: flex; gap: 4px; }
.img-dot { width: 6px; height: 6px; border-radius: 50%; background: #94a3b8; }
.img-container img { width: 100%; display: block; object-fit: cover; object-position: top; }

/* Table for Roadmap */
.roadmap-table { width: 100%; border-collapse: collapse; margin-top: 5mm; }
.roadmap-table th { background: #0f172a; color: white; padding: 10px; text-align: left; font-size: 11px; }
.roadmap-table td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 11px; vertical-align: top; }
.roadmap-table tr:nth-child(even) { background: #f8fafc; }

</style>
</head>
<body>

<!-- PAGE 1: COVER DENSE -->
<div class="page cover-bg">
  <div class="page-inner">
    <div class="cover-hero">
      <img src="${imgLogo}">
      <h1>Caissa.mr</h1>
      <p>Dossier Exécutif & Stratégique — Plateforme POS SaaS Intégrée<br>Destiné à M. Si Taha</p>
    </div>
    
    <div class="img-container" style="border-color: rgba(255,255,255,0.2);">
      <div class="img-header" style="background: rgba(255,255,255,0.05); border-bottom-color: rgba(255,255,255,0.1);">
        <div class="img-dots"><span class="img-dot"></span><span class="img-dot"></span></div>
      </div>
      <img src="${imgRestaurantPhotos}" style="height: 110mm;">
    </div>
    
    <div class="cover-stats">
      <div class="stat-box">
        <div class="stat-val">100%</div>
        <div class="stat-lbl">Mauritanien & Offline</div>
      </div>
      <div class="stat-box">
        <div class="stat-val">4 en 1</div>
        <div class="stat-lbl">Secteurs Couverts</div>
      </div>
      <div class="stat-box">
        <div class="stat-val">80%</div>
        <div class="stat-lbl">Développement Réalisé</div>
      </div>
      <div class="stat-box">
        <div class="stat-val">MRR</div>
        <div class="stat-lbl">Modèle SaaS Récurrent</div>
      </div>
    </div>
  </div>
</div>

<!-- PAGE 2: MARCHÉ & SOLUTION -->
<div class="page">
  <div class="page-inner">
    <div class="header">
      <div class="header-brand"><img src="${imgLogo}"><span>Caissa.mr</span></div>
      <div class="header-title">1. Analyse du Marché & Proposition de Valeur</div>
    </div>
    
    <h1>Contexte du Marché Mauritanien</h1>
    <p>Le marché des points de vente (POS) en Mauritanie se caractérise par une forte dépendance aux méthodes traditionnelles (carnets manuscrits, caisses enregistreuses basiques sans suivi analytique) et par l'inefficacité des logiciels importés, souvent inadaptés aux réalités locales : coupures d'électricité/internet fréquentes, intégrations de paiements locaux inexistantes, et gestion complexe du crédit client de proximité.</p>
    
    <div class="grid-2" style="margin-top: 8mm;">
      <div>
        <h2>Le Problème Constaté (Pain Points)</h2>
        <ul style="margin-bottom: 0;">
          <li><strong>Gestion du "Kridi" catastrophique :</strong> Les carnets de dettes papier entraînent des pertes, des oublis et des contestations régulières avec les clients.</li>
          <li><strong>Absence de traçabilité Bankily/Masrvi :</strong> Les encaissements mobiles sont vérifiés manuellement sur le téléphone personnel du gérant, créant des fraudes et des lenteurs au comptoir.</li>
          <li><strong>Instabilité Technologique :</strong> Les solutions Cloud européennes bloquent les encaissements dès que la connexion internet locale faiblit.</li>
          <li><strong>Matériel fermé et coûteux :</strong> Obligation d'acheter du matériel propriétaire onéreux au lieu d'utiliser des tablettes ou PC existants.</li>
        </ul>
      </div>
      <div>
        <h2>La Réponse Stratégique Caissa.mr</h2>
        <ul style="margin-bottom: 0;">
          <li><strong>Kridi Numérisé & Sécurisé :</strong> Fichier client centralisé avec plafond de dette automatique, historique inaltérable et impression de relevés.</li>
          <li><strong>Paiement Mobile Intégré :</strong> Génération de QR Codes et rapprochement bancaire automatique dans la clôture de caisse Z.</li>
          <li><strong>Architecture "Offline-First" :</strong> La caisse stocke les transactions dans la base locale (IndexedDB) et se synchronise en arrière-plan. Zéro coupure de service.</li>
          <li><strong>SaaS Multi-plateforme :</strong> Déploiement web immédiat sur tout navigateur, réduisant la barrière à l'entrée matérielle.</li>
        </ul>
      </div>
    </div>
    
    <div class="content-box" style="margin-top: 8mm;">
      <h3>Modèle Économique (Business Model SaaS)</h3>
      <p>Caissa.mr est distribué sous forme de Software as a Service (SaaS). Contrairement à la vente de licences uniques (One-Off), le logiciel est loué mensuellement ou annuellement (de 790 à 2 990 MRU/mois). Ce modèle génère des revenus mensuels récurrents (MRR - Monthly Recurring Revenue), assurant une prévisibilité financière et une valorisation élevée de l'entreprise. En complément, Caissa.mr générera du chiffre d'affaires immédiat via la revente avec marge du matériel de caisse (imprimantes thermiques, tiroirs-caisses, douchettes).</p>
    </div>

    <div class="footer"><span>Dossier Confidentiel</span><span>Page 2 / 8</span></div>
  </div>
</div>

<!-- PAGE 3: PRISE DE COMMANDE -->
<div class="page">
  <div class="page-inner">
    <div class="header">
      <div class="header-brand"><img src="${imgLogo}"><span>Caissa.mr</span></div>
      <div class="header-title">2. Module Cœur : L'Interface de Caisse Tactile</div>
    </div>
    
    <h1>Prise de Commande Tactile (Core POS)</h1>
    <p>L'interface de vente est le moteur de l'application. Elle a été conçue pour être maîtrisée par n'importe quel caissier en moins de 15 minutes de formation. L'objectif technique était de réduire le temps de transaction au comptoir (Checkout Time) sous la barre des 10 secondes.</p>

    <div class="grid-2" style="margin-top: 5mm;">
      <div>
        <div class="img-container"><div class="img-header"></div><img src="${imgPriseCommande}" style="height: 105mm;"></div>
      </div>
      <div>
        <h2>Ergonomie & Vitesse d'Exécution</h2>
        <p>Le catalogue produit est entièrement visuel. Chaque article est représenté par une photographie haute définition, minimisant les erreurs de lecture et de sélection, particulièrement lors des pics d'affluence (rush hour).</p>
        <ul>
          <li><strong>Catégorisation dynamique :</strong> Navigation par onglets (Entrées, Plats, Boissons) fluides, sans temps de chargement.</li>
          <li><strong>Sélection instantanée :</strong> L'ajout au panier (Ticket) se fait en 1 clic (ou touch).</li>
          <li><strong>Calcul de la monnaie (MRU) :</strong> Le système calcule instantanément la monnaie à rendre en fonction de l'espèce perçue, sécurisant le caissier.</li>
        </ul>

        <div class="img-container" style="margin-top: 6mm;"><div class="img-header"></div><img src="${imgModifierModal}" style="height: 60mm;"></div>
        
        <h2>Modale des Variantes & Suppléments</h2>
        <p>Pour la restauration complexe, une modale de personnalisation s'affiche pour traiter les exigences des clients sans perdre de temps :</p>
        <ul>
          <li><strong>Cuissons :</strong> Saignant, à point, bien cuit.</li>
          <li><strong>Suppléments facturables :</strong> Fromage supplémentaire (+50 MRU), sauce extra, etc.</li>
          <li><strong>Impact financier direct :</strong> Le prix du ticket s'ajuste instantanément.</li>
        </ul>
      </div>
    </div>

    <div class="footer"><span>Dossier Confidentiel</span><span>Page 3 / 8</span></div>
  </div>
</div>

<!-- PAGE 4: RESTAURATION -->
<div class="page">
  <div class="page-inner">
    <div class="header">
      <div class="header-brand"><img src="${imgLogo}"><span>Caissa.mr</span></div>
      <div class="header-title">3. Spécificités Métier : Restauration Pro</div>
    </div>
    
    <h1>Plan de Salle & Écran Cuisine (KDS)</h1>
    <p>Pour les établissements proposant un service à table (Dine-In), Caissa.mr déploie des modules de gestion avancés permettant de synchroniser les serveurs en salle avec la brigade en cuisine. Cela remplace avantageusement le système archaïque des bons de commande volants (tickets papier).</p>

    <div class="grid-2" style="margin-top: 5mm;">
      <div>
        <h2>Plan de Salle Interactif</h2>
        <p>Une représentation visuelle de l'établissement (Terrasse, Salle principale, VIP) permet d'optimiser le taux de rotation des tables (Table Turnover).</p>
        <div class="img-container"><div class="img-header"></div><img src="${imgTables}" style="height: 80mm;"></div>
        <ul>
          <li><strong>Code Couleur de Statut :</strong> Vert (Libre), Rouge (Occupée, avec durée d'occupation en minutes), Orange (Addition demandée).</li>
          <li><strong>Transfert de Table :</strong> Si un client change de place, son addition est déplacée numériquement vers la nouvelle table en 2 clics.</li>
          <li><strong>Prise de commande mobile :</strong> Les serveurs peuvent prendre la commande directement sur smartphone ou tablette depuis la table.</li>
        </ul>
      </div>
      <div>
        <h2>Kitchen Display System (KDS)</h2>
        <p>L'écran cuisine digitalise le flux de préparation. Les commandes tapées en salle s'affichent instantanément sur la tablette du chef de cuisine.</p>
        <div class="img-container"><div class="img-header"></div><img src="${imgKds}" style="height: 80mm;"></div>
        <ul>
          <li><strong>Ticketing Séquentiel :</strong> Les commandes apparaissent de la plus ancienne à la plus récente.</li>
          <li><strong>Chronomètre (SLA) :</strong> Chaque bon affiche son temps de préparation écoulé pour éviter les retards de service.</li>
          <li><strong>Validation de Sortie :</strong> Le chef appuie sur un plat pour le marquer "Prêt", ce qui peut déclencher une notification visuelle en salle pour le serveur.</li>
        </ul>
      </div>
    </div>

    <div class="footer"><span>Dossier Confidentiel</span><span>Page 4 / 8</span></div>
  </div>
</div>

<!-- PAGE 5: BOUTIQUE & KRIDI -->
<div class="page">
  <div class="page-inner">
    <div class="header">
      <div class="header-brand"><img src="${imgLogo}"><span>Caissa.mr</span></div>
      <div class="header-title">4. Spécificités Métier : Retail & Crédit Client</div>
    </div>
    
    <h1>Mode Boutique, Stocks & Le Carnet "Kridi"</h1>
    <p>Caissa.mr n'est pas limité à la restauration. Le logiciel pivote parfaitement pour équiper les supérettes, pharmacies, boutiques de prêt-à-porter, ou quincailleries de Nouakchott, grâce à des modules de gestion de stocks et de scan rapide.</p>

    <div class="grid-2" style="margin-top: 5mm;">
      <div>
        <h2>Checkout Retail & Douchettes</h2>
        <p>Le mode "Boutique" est optimisé pour le volume et la vitesse d'encaissement (Fast-Moving Consumer Goods).</p>
        <div class="img-container"><div class="img-header"></div><img src="${imgBoutique}" style="height: 60mm;"></div>
        <ul>
          <li><strong>Code-barres :</strong> Support natif des douchettes USB et Bluetooth (EAN13, Code128).</li>
          <li><strong>Décrémentation de Stock :</strong> Le stock est mis à jour en temps réel à chaque vente, avec des alertes de seuil critique (Rupture imminente).</li>
        </ul>
        <div class="img-container" style="margin-top: 4mm;"><div class="img-header"></div><img src="${imgTicketCart}" style="height: 60mm;"></div>
        <p>Le panier client gère nativement les remises en pourcentage ou en montant fixe (MRU), ainsi que le calcul automatisé de la TVA.</p>
      </div>
      
      <div>
        <h2>Le Grand Enjeu : Le Carnet Kridi (الكريدي)</h2>
        <p>Dans l'écosystème commercial mauritanien, la vente à crédit de proximité est inévitable. La gestion papier est source majeure de faillites (impayés, contestations). Caissa.mr intègre un <span class="text-highlight">système financier de micro-crédit client</span> d'une précision redoutable :</p>
        
        <div class="content-box" style="background: #fffbeb; border-color: #fde68a; margin-top: 5mm;">
          <h3 style="color: #92400e;">Fonctionnement du Kridi Numérique</h3>
          <p style="color: #78350f;">
            1. <strong>Fiche Client :</strong> Création d'un profil avec nom et numéro de téléphone.<br>
            2. <strong>Plafond Sécurisé :</strong> Le gérant fixe une limite stricte (ex: 5 000 MRU). Le système bloque toute vente à crédit si la limite est atteinte.<br>
            3. <strong>Vente à crédit :</strong> Lors du paiement, le caissier sélectionne "Kridi" et le montant s'ajoute au solde du client.<br>
            4. <strong>Transparence Totale :</strong> Chaque ajout à la dette génère une ligne d'historique ineffaçable (date, heure, produits achetés).<br>
            5. <strong>Remboursement :</strong> Lors d'un versement du client, le solde diminue et le commerce peut imprimer un "Reçu d'apurement de dette" clair et net pour le client, instaurant une confiance absolue.
          </p>
        </div>
      </div>
    </div>

    <div class="footer"><span>Dossier Confidentiel</span><span>Page 5 / 8</span></div>
  </div>
</div>

<!-- PAGE 6: PAIEMENTS & CONFORMITÉ -->
<div class="page">
  <div class="page-inner">
    <div class="header">
      <div class="header-brand"><img src="${imgLogo}"><span>Caissa.mr</span></div>
      <div class="header-title">5. FinTech & Conformité Fiscale</div>
    </div>
    
    <h1>Multicanal de Paiement & Impression Thermique</h1>
    <p>L'encaissement est l'étape finale critique. Caissa.mr consolide l'ensemble des flux financiers de la journée pour assurer un rapprochement comptable sans erreur, tout en respectant le cadre réglementaire de la facturation mauritanienne.</p>

    <div class="grid-2" style="margin-top: 5mm;">
      <div>
        <h2>Intégration Mobile Money</h2>
        <p>La Mauritanie a massivement adopté les paiements par téléphone. Notre système est conçu pour absorber ces flux (Bankily, Masrvi, Sedad, Bimbank).</p>
        <div class="img-container"><div class="img-header"></div><img src="${imgPaymentSuccess}" style="height: 70mm;"></div>
        <ul>
          <li><strong>Enregistrement propre :</strong> Chaque transaction Bankily est tracée séparément des espèces pour faciliter le comptage de la caisse physique en fin de journée (Clôture Z).</li>
          <li><strong>QR Code dynamique :</strong> À terme, affichage du QR Code Bankily directement sur l'écran pour un paiement instantané par le client sans erreur de montant.</li>
        </ul>
      </div>
      
      <div>
        <h2>Reçus et Factures Fiscales</h2>
        <p>L'application communique directement avec les imprimantes thermiques de comptoir (standards 58mm et 80mm ESC/POS).</p>
        <div class="img-container" style="background: #f1f5f9; padding: 10px; display:flex; justify-content:center; align-items:flex-start;">
          <img src="${imgTicketDetails}" style="width: 60%; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
        </div>
        <ul>
          <li><strong>Mentions Légales :</strong> Impression du NIF (Numéro d'Identification Fiscale), RC et adresse du commerce.</li>
          <li><strong>TVA Dédiée :</strong> Calcul distinct de la TVA à 16% (ou taux zéro pour produits de base), avec le total Hors Taxes et Toutes Taxes Comprises.</li>
          <li><strong>Numérotation Séquentielle :</strong> Tickets numérotés de façon chronologique, empêchant les annulations frauduleuses en douce par le personnel.</li>
        </ul>
      </div>
    </div>

    <div class="footer"><span>Dossier Confidentiel</span><span>Page 6 / 8</span></div>
  </div>
</div>

<!-- PAGE 7: TECHNOLOGIE SAAS OFFLINE -->
<div class="page">
  <div class="page-inner">
    <div class="header">
      <div class="header-brand"><img src="${imgLogo}"><span>Caissa.mr</span></div>
      <div class="header-title">6. Architecture Technique & Innovation</div>
    </div>
    
    <h1>Technologie "Offline-First" PWA</h1>
    <p>La proposition de valeur technique majeure de Caissa.mr réside dans sa robustesse face aux infrastructures réseaux locales. Il s'agit d'une PWA (Progressive Web App) bâtie sur une architecture <span class="text-accent">Offline-First</span>.</p>

    <div class="content-box" style="margin-top: 5mm;">
      <h3>Comment fonctionne la base de données décentralisée ?</h3>
      <p>Contrairement à une application Web classique qui crashe si le WiFi coupe, Caissa.mr télécharge l'intégralité du catalogue produits et de la logique métier dans le navigateur de l'appareil (Chrome/Safari) via la technologie <strong>IndexedDB</strong>. <br><br>
      Lorsqu'une vente est réalisée, elle est écrite et sécurisée sur le disque dur local de la tablette. La caisse ne subit <strong>absolument aucune latence (0ms)</strong> liée au serveur distant. En arrière-plan (Background Sync), dès que la connexion internet est rétablie, les ventes cryptées sont propulsées vers nos serveurs Cloud (PostgreSQL). <br><br>
      <strong>Résultat : Le commerce ne s'arrête jamais d'encaisser, même pendant une panne d'internet de 3 jours.</strong></p>
    </div>

    <h2>Architecture Serveur (Stack Technique)</h2>
    <table class="roadmap-table">
      <tr>
        <th>Couche Système</th>
        <th>Technologie Utilisée</th>
        <th>Bénéfice Stratégique</th>
      </tr>
      <tr>
        <td><strong>Front-End (Caisse)</strong></td>
        <td>React.js 18 + TypeScript + TailwindCSS</td>
        <td>Interface extrêmement fluide (60fps), code robuste et maintenable. Déploiement via CDN Vercel.</td>
      </tr>
      <tr>
        <td><strong>Stockage Local</strong></td>
        <td>IndexedDB (API Navigateur Web)</td>
        <td>Moteur de base de données asynchrone embarqué permettant le fonctionnement 100% hors-ligne.</td>
      </tr>
      <tr>
        <td><strong>Back-End Cloud</strong></td>
        <td>Node.js / Express (Serveur API)</td>
        <td>Hébergé sur Render, il gère la synchronisation sécurisée et la multi-boutique (propriétaires de chaînes).</td>
      </tr>
      <tr>
        <td><strong>Base de Données Centrale</strong></td>
        <td>PostgreSQL</td>
        <td>La référence mondiale en matière de bases de données relationnelles sécurisées pour la finance.</td>
      </tr>
    </table>

    <div class="footer"><span>Dossier Confidentiel</span><span>Page 7 / 8</span></div>
  </div>
</div>

<!-- PAGE 8: ROADMAP & INVESTISSEMENT -->
<div class="page">
  <div class="page-inner">
    <div class="header">
      <div class="header-brand"><img src="${imgLogo}"><span>Caissa.mr</span></div>
      <div class="header-title">7. Feuille de Route & Opportunités pour Si Taha</div>
    </div>
    
    <h1>Avancement (80%) et Prochaines Étapes</h1>
    <p>Le développement du socle produit (Frontend POS, logique Offline, Design UI/UX, Gestion Kridi/Tables) est <strong>entièrement achevé et fonctionnel</strong>, comme le démontre l'environnement de staging déployé sur <em>caissa-mr.vercel.app</em>. Les 20% restants de l'effort de R&D se concentrent sur la finalisation de l'API Backend de synchronisation Cloud et la mise en place du Dashboard d'Administration pour les propriétaires d'établissements.</p>

    <h2 style="margin-top: 8mm;">Schémas de Collaboration Envisagés</h2>
    <p>Ce dossier vous est présenté, Si Taha, afin de vous impliquer stratégiquement avant le lancement officiel sur le marché de Nouakchott. L'objectif est de s'appuyer sur votre vision business, votre réseau, et potentiellement vos capacités financières pour accélérer l'acquisition client (Go-to-Market Strategy).</p>

    <div class="content-box" style="border-left: 4px solid #10b981; margin-top: 5mm;">
      <h3 style="font-size: 15px;">Option A : Investisseur Capital (Seed / Stratégique)</h3>
      <p style="font-size: 12px; margin-bottom: 5px;"><strong>Le besoin :</strong> Financer le fonds de roulement initial, l'importation de matériel de caisse (imprimantes, tablettes) en marque blanche, et le recrutement de 2 commerciaux terrain à Nouakchott.</p>
      <p style="font-size: 12px;"><strong>Votre avantage :</strong> Entrée au capital de l'entreprise logicielle à une valorisation d'amorçage. Les revenus récurrents (SaaS MRR) offrent une excellente rentabilité et une forte valorisation (Multiples x5 à x10 du CA) sur 3 à 5 ans.</p>
    </div>

    <div class="content-box" style="border-left: 4px solid #3b82f6;">
      <h3 style="font-size: 15px;">Option B : Partenaire Distributeur (Revenue Share)</h3>
      <p style="font-size: 12px; margin-bottom: 5px;"><strong>Le besoin :</strong> Accélérer la pénétration du marché en exploitant un réseau commercial existant.</p>
      <p style="font-size: 12px;"><strong>Votre avantage :</strong> Vous commercialisez Caissa.mr dans votre réseau de relations et touchez une commission récurrente sur chaque abonnement mensuel vendu (Ex: 20% à 30% du MRR généré par votre portefeuille de clients).</p>
    </div>

    <div class="content-box" style="border-left: 4px solid #f59e0b;">
      <h3 style="font-size: 15px;">Option C : Client Pilote & Prescripteur VIP</h3>
      <p style="font-size: 12px; margin-bottom: 5px;"><strong>Le besoin :</strong> Tester la solidité du logiciel (Stress Test) dans des conditions réelles intenses avant le lancement grand public.</p>
      <p style="font-size: 12px;"><strong>Votre avantage :</strong> Vous modernisez vos propres établissements avec un tarif préférentiel exclusif à vie, et un accès prioritaire à l'équipe de développement pour des fonctionnalités sur-mesure.</p>
    </div>

    <div style="margin-top: auto; text-align: center;">
      <p style="font-size: 12px; font-weight: 700; color: #0f172a; margin-bottom: 2px;">Démonstration Interactive Accessible via votre Navigateur Web :</p>
      <p style="font-size: 16px; font-weight: 800; color: #10b981;">https://caissa-mr.vercel.app</p>
    </div>

    <div class="footer"><span>Dossier Confidentiel — Propriété de Caissa.mr © 2026</span><span>Page 8 / 8</span></div>
  </div>
</div>

</body>
</html>`;

const htmlFilePath = path.join(__dirname, 'presentation_caissa_dense.html');
const pdfFilePath = path.join(__dirname, 'PRESENTATION_CAISSA_MR_RAPPORT.pdf');

fs.writeFileSync(htmlFilePath, htmlContent, 'utf8');
console.log('HTML A4 Dense généré :', htmlFilePath);

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
