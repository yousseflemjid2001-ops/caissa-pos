# CAHIER DES CHARGES & ARCHITECTURE TECHNIQUE
# SAAS DE POINT DE VENTE (POS) & GESTION COMMERCIALE (RESTAURATION & MARKET)
*Inspiré et enrichi à partir du modèle Caissa.tn avec intégration d'Agents IA*

---

## 1. VISION DU PRODUIT & ANALYSE DE LA CONCURRENCE (Caissa.tn)

### 1.1 Ce que fait Caissa.tn aujourd'hui
Après analyse approfondie de **caissa.tn**, la plateforme repose sur :
- **Modèle économique :** SaaS par abonnement prépayé/flexible basé sur un tarif journalier (1 DT / jour, jusqu'à 0.500 DT / jour en paiement annuel soit -50%). Essai gratuit de 15 jours sans carte bancaire.
- **Secteurs ciblés :** Drugstore / Supérette, Parfumerie, Parapharmacie, Librairie, Animalerie, Café / Restaurant, Fromagerie, Grossiste, Magasins fermiers (produits frais).
- **Fonctionnalités clés :**
  - **POS tactile :** Prise de commande rapide, encaissement, impression de tickets de caisse thermiques, liaison TPE.
  - **Gestion de Stock :** Suivi en temps réel, alertes de rupture, gestion des variantes, codes-barres.
  - **Gestion du Crédit Client (« البيع بالكريدي ») :** Suivi du carnet de dettes, plafonds, historiques des règlements (indispensable au commerce de proximité tunisien et maghrébin).
  - **Rapports & Statistiques :** Suivi du CA, marge brute, filtres par caissier/période/produit.
  - **Multi-utilisateurs :** Contrôle des accès selon les rôles (Admin, Gérant, Caissier).
  - **Authentification :** Basée sur un serveur Keycloak (OIDC/OAuth2).

### 1.2 Notre Valeur Ajoutée (Comment faire MIEUX que Caissa)
1. **Mode Hors-Ligne Résilient (Offline-First) :** Si la connexion Internet tombe, la caisse continue d'encaisser et synchronise dès le retour du réseau (gros point noir des commerces locaux).
2. **Écosystème d'Agents IA Autonomes :** Au lieu d'un simple tableau de bord passif, des agents IA conseillent le gérant, saisissent ses factures par photo (OCR), automatisent les relances de crédit et prédisent les ruptures de stock.
3. **Module Restauration Avancé :** Écran cuisine (KDS - Kitchen Display System) en temps réel, QR Code sur table, gestion des menus et ingrédients.
4. **Paiement d'Abonnement 100% Automatisé :** Intégration directe des passerelles tunisiennes (Konnect, Flouci, GPG Checkout) et internationales (Stripe).

---

## 2. STACK TECHNIQUE RECOMMANDÉE (LANGAGES & OUTILS)

Pour un SaaS haute performance, moderne, sécurisé et rapide à déployer :

### 2.1 Frontend (Web, Mobile & Caisse POS)
- **Framework Web (Dashboard & POS) :** **Next.js 15 / React (TypeScript)** avec **Tailwind CSS** et **shadcn/ui**.
  - *Raison :* SEO optimal pour la page vitrine, vitesse de rendu maximale (SSR/SSG), composabilité et modernité.
- **Support POS / Caisse Hors-Ligne (PWA & Desktop) :**
  - **PWA (Progressive Web App)** avec Service Workers et **IndexedDB / RxDB** pour fonctionner même sans connexion Internet.
  - Option Desktop : **Tauri** (ou Electron) pour communiquer directement avec les imprimantes thermiques (ESC/POS) via USB, Bluetooth ou Réseau local, ainsi que les tiroirs-caisses et balances.
- **Application Mobile (Patron / Gérant) :** **Flutter** ou **React Native** (iOS & Android) pour consulter le CA en direct et recevoir les alertes des agents IA.

### 2.2 Backend & API
- **Langage & Framework principal :** **Node.js avec NestJS (TypeScript)** ou **Go (Golang)**.
  - *Recommandation :* **NestJS (TypeScript)** pour l'architecture modulaire d'entreprise, la maintenabilité, et le partage des types TypeScript avec le frontend.
- **Service des Agents IA :** **Python (FastAPI)**.
  - *Raison :* Meilleur écosystème IA (LangChain, LlamaIndex, OpenAI / Gemini SDK, vLLM, OpenCV pour l'OCR).
- **Communication inter-services :** API REST + WebSockets (Socket.io) pour les événements en direct (commandes de cuisine en temps réel, alertes caisse).

### 2.3 Base de Données & Caching
- **Base de Données Principale :** **PostgreSQL** avec schéma **Multi-Tenant** (chaque client/commerce a ses données cloisonnées par `tenant_id` ou schéma dédié via Row-Level Security).
- **ORM :** **Prisma** ou **Drizzle ORM** (TypeScript).
- **Cache & Files d'attente (Queues) :** **Redis** avec **BullMQ** pour les tâches d'arrière-plan (génération de rapports, envois de SMS/WhatsApp, calculs IA asynchrones).
- **Stockage de Fichiers (Médias, Photos produits, Factures) :** MinIO ou AWS S3 / Cloudflare R2.

### 2.4 Authentification & Sécurité
- **Auth Multi-Tenant :** **Supabase Auth**, **Clerk** ou **Keycloak** (OpenID Connect / OAuth2 avec gestion fine des rôles RBAC : SuperAdmin, TenantAdmin, StoreManager, Cashier, Waiter).

---

## 3. CE QU'ON DOIT FAIRE EXACTEMENT (MODULE PAR MODULE)

### Module A : Site Vitrine & Entonnoir d'Inscription SaaS (Landing & Onboarding)
1. **Page d'accueil interactive :** Présentation dynamique, calculateur de prix en temps réel (slider de jours comme Caissa, avec réduction dégressive 1 mois, 3 mois, 6 mois, 1 an).
2. **Inscription en libre-service (Self-service Sign Up) :**
   - Saisie des informations de la boutique (Nom de l'enseigne, type d'activité : Café, Resto, Supérette, etc., pays/ville, devise).
   - Activation immédiate d'une période d'**essai gratuit de 14 ou 15 jours** sans obligation de carte bancaire.
3. **Module de Facturation & Paiement d'Abonnement (Billing) :**
   - Gestion des formules d'abonnement (Abonnement Journalier / Mensuel / Annuel).
   - Intégration de passerelles locales tunisiennes : **Konnect**, **Flouci**, **GPG Checkout** (cartes bancaires locales, e-Dinar, virements) et internationales (**Stripe**).
   - Génération automatique des factures d'abonnement et blocage/notification en cas d'expiration.

### Module B : Module Caisse & Point de Vente (POS)
1. **Écran de Vente Tactile :**
   - Grille de produits avec photos, catégories, favoris rapides.
   - Recherche rapide par code-barres (douchette USB/Bluetooth ou caméra).
   - Prise en charge des balances de pesage pour les fruits/légumes, fromages, vrac (articles au poids en Kg/g).
   - Application de remises (en pourcentage ou montant fixe), gestion de la TVA.
2. **Encaissement Multi-moyens :**
   - Espèces (avec calcul automatique du rendu de monnaie).
   - Carte Bancaire / TPE.
   - Vente à crédit (Carnet client).
   - Multi-paiements (ex: 50% espèces, 50% carte).
3. **Périphériques Matériels :**
   - Impression des tickets de caisse via protocole **ESC/POS** (80mm ou 58mm).
   - Ouverture automatique du tiroir-caisse.
   - Affichage client (Customer Display) en option.

### Module C : Spécificités Restauration & Cafés
1. **Gestion des Tables & Salle :**
   - Plan de salle interactif (terrasse, intérieur, étage).
   - Statut des tables (Libre, Occupée, Facture émise, En nettoyage).
   - Transfert de table, fusion ou division de note (Split Bill).
2. **Affichage Cuisine (KDS - Kitchen Display System) :**
   - Écran ou tablette pour les cuisiniers/barmans affichant les bons de commande en temps réel avec minuterie.
   - Impression automatique des bons de commande sur imprimante cuisine/bar.
3. **Recettes & Fiches Techniques :**
   - Déduction automatique des ingrédients du stock (ex: 1 Pizza Marguerita vendue = déduction de 150g de farine, 100g de mozzarella, 80g de sauce tomate).

### Module D : Spécificités Commerce / Supérette / Parapharmacie
1. **Gestion des Lots & Dates de Péremption (DLC / DLUO) :**
   - Alerte sur les produits proches de l'expiration pour mise en promotion déstockage.
2. **Gestion des Codes-barres & Étiquettes :**
   - Génération et impression d'étiquettes de prix à code-barres pour les rayons.
3. **Gestion des Fournisseurs & Commandes d'Achat :**
   - Bons de commande, réceptions de marchandises, suivi des dettes fournisseurs.

### Module E : Gestion du Crédit Client (« Carnet Kridi » - البيع بالكريدي)
1. Fiche client avec historique complet des achats à crédit et des acomptes versés.
2. Définition d'un **plafond maximal de crédit** par client (blocage automatique de la vente si dépassé sans accord du gérant).
3. Reçu de paiement de dette avec signature numérique ou ticket de preuve.

### Module F : Rapports, Statistiques & Clôture de Caisse (Z de Caisse)
1. **Clôture quotidienne (Rapport Z) :** Rapprochement entre l'argent théorique dans la caisse et l'argent réel compté (détection des écarts de caisse).
2. **Dashboard Financier :** Chiffre d'affaires journalier/mensuel, marge brute, bénéfice net estimé, tops et flops des ventes, heures de pointe.
3. **Export comptable :** Export Excel/PDF pour l'expert-comptable.

---

## 4. ARCHITECTURE & RÔLE DE CHAQUE AGENT IA (AI AGENTS)

Pour transformer cette plateforme en une solution révolutionnaire qui surpasse largement les solutions classiques du marché, nous intégrons **6 Agents IA spécialisés** :

```
                  ┌──────────────────────────────────────────────┐
                  │           SUPERVISOR IA (COORDINATEUR)       │
                  └──────────────────────┬───────────────────────┘
                                         │
     ┌───────────────┬───────────────────┼───────────────────┬───────────────┐
     ▼               ▼                   ▼                   ▼               ▼
[Agent 1: OCR]  [Agent 2: Stock]   [Agent 3: POS Vocal] [Agent 4: CFO]  [Agent 5: Kridi]
Factures & BL   Prédiction/Pertes  Commande Derja/FR    WhatsApp Patron  Relances Dettes
```

### Agent 1 : L'Agent OCR Factures Fournisseurs (Smart Invoice Ingestion)
- **Rôle :** Éliminer la corvée de saisie manuelle des stocks lors de la réception des marchandises.
- **Fonctionnement :**
  1. Le commerçant prend en photo la facture ou le bon de livraison (BL) papier de son grossiste avec son smartphone.
  2. L'Agent IA (Vision LLM + OCR) extrait automatiquement : le nom du fournisseur, chaque article, la quantité livrée, le prix unitaire d'achat, la date et le total.
  3. L'Agent fait la correspondance avec les produits existants dans le catalogue ou propose de créer les nouveaux produits.
  4. Le stock et le prix de revient moyen pondéré (PUMP) sont mis à jour en 1 clic.

### Agent 2 : L'Agent Prédiction des Ventes & Anti-Gaspillage (Predictive Stock AI)
- **Rôle :** Prévoir les ruptures de stock et le gaspillage d'ingrédients périssables.
- **Fonctionnement :**
  1. Analyse l'historique des ventes combiné aux facteurs externes (jour de la semaine, météo, jours fériés, Ramadan, matchs de football, événements locaux).
  2. Génère chaque lundi matin la liste exacte d'approvisionnement recommandée : *"Prévoyez 35 kg de mozzarella cette semaine au lieu de 20 kg (match de derby ce weekend + beau temps)"*.
  3. Alerte sur les stocks dormants (produits qui ne tournent pas depuis 30 jours) et suggère des remises promotionnelles.

### Agent 3 : L'Agent Caisse Vocale & Assistance Vente (Voice POS & Upselling Agent)
- **Rôle :** Accélérer la saisie des commandes pendant les heures de rush (particulièrement adapté aux cafés et fast-foods).
- **Fonctionnement :**
  1. Compréhension multilingue et dialectale (Arabe, Français, et **Derja Tunisienne** : *"Zouz Capucin, wahed Citronnade w wahed Crêpe Nutella"*).
  2. L'Agent compose le panier instantanément sur l'écran tactile sans que le serveur n'ait à chercher dans les menus.
  3. **Suggestion d'Up-Selling intelligent :** Indique au caissier en 1 seconde l'article complémentaire à suggérer pour augmenter le panier moyen (*"Suggérer une formule boisson + dessert pour 3 DT de plus"*).

### Agent 4 : Le Copilote Financier & Directeur Virtuel (CFO Copilot via WhatsApp)
- **Rôle :** Donner au propriétaire du restaurant ou du commerce une visibilité totale sur son entreprise sans qu'il ait besoin d'ouvrir un ordinateur.
- **Fonctionnement :**
  1. Envoie chaque soir à 23h un résumé concis sur le WhatsApp ou Telegram du propriétaire :
     - Chiffre d'affaires du jour, marge estimée, écart de caisse constaté.
     - Employé le plus performant du jour.
  2. Le patron peut poser des questions en langage naturel : *"Quel est mon bénéfice net cette semaine ?"*, *"Combien de viande a-t-on consommé ce mois-ci par rapport au mois dernier ?"*.
  3. L'Agent répond immédiatement avec des chiffres précis et des graphiques.

### Agent 5 : L'Agent Recouvrement des Crédits & Fidélité (Kridi & Loyalty Agent)
- **Rôle :** Récupérer l'argent des dettes clients sans heurter la relation humaine.
- **Fonctionnement :**
  1. Surveille les échéances de crédit accordées aux clients réguliers.
  2. Envoie des rappels polis et personnalisés par SMS ou WhatsApp : *"Bonjour M. Mohamed, juste un petit rappel amical concernant votre solde de 85 DT chez Supérette El Baraka. Vous pouvez passer le régler quand vous voulez !"*.
  3. Établit un score de solvabilité par client (autorise ou déconseille au caissier d'accorder un nouveau crédit).

### Agent 6 : L'Agent Support Technique & Diagnostic Matériel 24/7 (AI Support)
- **Rôle :** Résoudre immédiatement les pannes techniques du commerçant sans dépendre d'un technicien humain.
- **Fonctionnement :**
  1. Diagnostic instantané des pannes matérielles (imprimante de ticket bloquée, tiroir qui ne s'ouvre pas, déconnexion réseau).
  2. Guide le commerçant pas à pas (instructions interactives illustrées) en Français et en Arabe.

---

## 5. MODÈLE DE DONNÉES CLÉ (STRUCTURE POSTGRESQL MULTI-TENANT)

- **Tenants (Organisations / Commerces) :** `id, name, slug, phone, logo, currency, subscription_plan, trial_ends_at, is_active, created_at`
- **Subscriptions (Abonnements SaaS) :** `id, tenant_id, plan_name, duration_days, amount_paid, payment_gateway, transaction_id, starts_at, expires_at, status`
- **Stores / Branches (Boutiques / Succursales) :** `id, tenant_id, name, address, phone`
- **Users (Utilisateurs / Personnel) :** `id, tenant_id, store_id, full_name, email, pin_code, role (OWNER, MANAGER, CASHIER, WAITER), is_active`
- **Categories & Products :** `id, tenant_id, name, barcode, sku, cost_price, selling_price, stock_quantity, min_stock_alert, is_weighted, expires_at`
- **Orders & OrderItems :** `id, tenant_id, store_id, cashier_id, table_number, total_amount, discount_amount, payment_method, payment_status, created_at`
- **Kridi / CustomerDebts :** `id, tenant_id, customer_id, order_id, amount_due, amount_paid, status, due_date`
- **AI_Logs & Forecasts :** `id, tenant_id, agent_type, prompt_data, result_data, created_at`

---

## 6. FEUILLE DE ROUTE DE RÉALISATION (ROADMAP PAR PHASES)

### Phase 1 : Cœur du Système & MVP (Semaines 1 à 4)
- Mise en place du socle technique (Next.js + NestJS + PostgreSQL + Prisma).
- Système Multi-Tenant & Authentification avec rôles et code PIN caissier.
- Gestion du catalogue produits (catégories, prix, codes-barres).
- Interface de caisse POS rapide avec panier, encaissement espèces/CB et impression de ticket.
- Période d'essai gratuit de 15 jours activée à la création du compte.

### Phase 2 : Gestion Métier & Abonnements SaaS (Semaines 5 à 8)
- Module de gestion des tables & écran cuisine (KDS) pour la restauration.
- Module de gestion des stocks avec alertes de seuil critique.
- Module Crédit Client (« Kridi ») complet.
- Portail d'abonnement SaaS avec calcul dynamique des prix et intégration passerelle de paiement (Konnect / Flouci).

### Phase 3 : Déploiement des Agents IA (Semaines 9 à 12)
- Agent 1 : OCR Factures avec extraction automatique des articles et mise à jour stock.
- Agent 4 : Synthèse WhatsApp quotidienne pour le patron.
- Agent 5 : Relances automatiques de crédits par SMS / WhatsApp.
- Agent 3 : Assistant de commande vocale Derja/FR pour les heures de rush.

### Phase 4 : Tests Terrains, Offline-First & Lancement Commercial (Semaines 13+)
- PWA avec stockage local pour garantir 100% de disponibilité même hors-ligne.
- Pilote dans 5 restaurants et 5 commerces locaux pour retours d'expérience.
- Campagne de communication digitale et commerciale.
