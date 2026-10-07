# CaissaFlow – SaaS POS Intelligent & Point de Vente IA (Restauration & Commerce)

Plateforme Cloud tout-en-un de Caisse Enregistreuse (POS), gestion de stock, plan de table, KDS cuisine, carnet de crédit client (« الكريدي ») et agents d'intelligence artificielle.

---

## 🚀 État des Services en Local

| Service | Statut | URL / Port | Rôle |
| :--- | :--- | :--- | :--- |
| **Frontend Web & POS** | 🟢 **EN LIGNE** | [http://localhost:5173/](http://localhost:5173/) | Interface caisse tactile, plan de table, écran KDS, hub IA et abonnement |
| **Backend REST API** | 🟢 **EN LIGNE** | [http://localhost:4000/](http://localhost:4000/) | Moteur multi-tenant, encaissement, stock, calculs d'abonnements et agents IA |
| **Healthcheck API** | 🟢 **EN LIGNE** | [http://localhost:4000/api/health](http://localhost:4000/api/health) | Vérification de la disponibilité du serveur |

---

## 📚 Documentation & Spécifications

- [Cahier des Charges & Architecture Technique Complète](file:///c:/SAAS/CAHIER_DES_CHARGES_ET_ARCHITECTURE_SAAS_POS.md)

---

## 🔌 Endpoints de l'API Backend

### 1. Authentification & Multi-Tenancy (`/api/auth`)
- `POST /api/auth/register` : Inscription d'un nouveau commerce avec **15 jours d'essai gratuit**.
- `POST /api/auth/login-pin` : Connexion rapide à la caisse par code PIN caissier (ex: `1234` ou `0000`).
- `GET /api/auth/users` : Liste des employés et caissiers de l'établissement.

### 2. Abonnements SaaS & Facturation (`/api/subscriptions`)
- `GET /api/subscriptions/calculate-price?days=365` : Calculateur dynamique de tarif (1 DT/jour, dégressif jusqu'à 500 millimes/jour en annuel soit -50%).
- `POST /api/subscriptions/checkout` : Souscription avec passerelles de paiement (Konnect, Flouci, CB).
- `GET /api/subscriptions/status` : Statut de l'abonnement et jours restants.

### 3. Catalogue & Gestion de Stock (`/api/products`)
- `GET /api/products` : Liste des produits (filtres par secteur `restaurant` ou `market`, recherche et code-barres).
- `POST /api/products` : Création d'un nouvel article (prix de vente, prix de revient, gestion au poids).
- `PATCH /api/products/:id/stock` : Réapprovisionnement ou ajustement de stock.

### 4. Encaissement POS & Ventes (`/api/orders`)
- `POST /api/orders/checkout` : Encaissement de panier (Espèces avec rendu de monnaie, Carte TPE, Crédit Kridi) avec déduction automatique des stocks.
- `GET /api/orders` : Historique des commandes et chiffre d'affaires cumulé.

### 5. Carnet de Crédit Client (« الكريدي ») (`/api/kridi`)
- `GET /api/kridi` : Liste des clients avec solde dû, plafond autorisé et jauge de risque.
- `POST /api/kridi/:id/pay` : Enregistrement d'un acompte ou règlement de dette.
- `POST /api/kridi/:id/add-debt` : Enregistrement d'un achat à crédit avec blocage si dépassement de plafond.

### 6. Hub des Agents IA (`/api/ai`)
- `POST /api/ai/ocr-invoice` : Reconnaissance optique et extraction des lignes de factures grossistes.
- `POST /api/ai/voice-order` : Parsing de commande vocale en dialecte tunisien (Derja) et français.
- `POST /api/ai/cfo-chat` : Copilot financier WhatsApp répondant aux questions du patron en direct.
- `POST /api/ai/kridi-reminder` : Générateur de relance WhatsApp/SMS courtoise et personnalisée.
- `GET /api/ai/stock-forecast` : Recommandations d'achats prédictives basées sur la météo et les événements.
