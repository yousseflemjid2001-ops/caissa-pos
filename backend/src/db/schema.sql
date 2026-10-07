-- =========================================================================
-- ARCHITECTURE DE BASE DE DONNÉES POSTGRESQL (SAAS POS MULTI-TENANT)
-- Modèle Caissa : Restauration, Boutiques, Stocks & Carnet Kridi
-- =========================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ÉTABLISSEMENTS / RESTAURANTS (MULTI-TENANT)
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(64) PRIMARY KEY,
    business_name VARCHAR(255) NOT NULL,
    sector VARCHAR(50) DEFAULT 'restaurant',
    restaurant_type VARCHAR(100) DEFAULT 'Restaurant & Grillades',
    city VARCHAR(100) DEFAULT 'Nouakchott',
    table_count INT DEFAULT 10,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    currency VARCHAR(10) DEFAULT 'MRU',
    subscription_plan VARCHAR(50) DEFAULT 'TRIAL_14_DAYS',
    trial_ends_at TIMESTAMP WITH TIME ZONE,
    subscription_expires_at TIMESTAMP WITH TIME ZONE,
    nif_fiscal VARCHAR(50) DEFAULT '12048592/RIM',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. UTILISATEURS / OPÉRATEURS DE CAISSE (RÔLES & PIN)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    pin_code VARCHAR(10) DEFAULT '1234',
    role VARCHAR(50) DEFAULT 'OWNER', -- OWNER, CASHIER, WAITER, CHEF
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUITS & ARTICLES DU CATALOGUE
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100) DEFAULT 'Générique',
    price NUMERIC(12, 2) NOT NULL,
    cost_price NUMERIC(12, 2) DEFAULT 0,
    barcode VARCHAR(100),
    image VARCHAR(100) DEFAULT 'plat',
    sector VARCHAR(50) DEFAULT 'restaurant',
    stock NUMERIC(12, 3) DEFAULT 0,
    is_weighted BOOLEAN DEFAULT FALSE,
    has_no_barcode BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. TABLES DE SALLE (RESTAURATION)
CREATE TABLE IF NOT EXISTS dining_tables (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(50) NOT NULL,
    zone VARCHAR(50) DEFAULT 'Salle Principale', -- Salle, Terrasse, Salons VIP
    capacity INT DEFAULT 4,
    status VARCHAR(50) DEFAULT 'LIBRE', -- LIBRE, OCCUPE, EN_ATTENTE
    current_order_id VARCHAR(64),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. CLIENTS CARNET DE CRÉDIT (الكريدي)
CREATE TABLE IF NOT EXISTS kridi_customers (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    credit_limit NUMERIC(12, 2) DEFAULT 5000,
    current_debt NUMERIC(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. COMMANDES & ENCAISSEMENTS (VENTES POS)
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
    cashier_name VARCHAR(150),
    total NUMERIC(12, 2) NOT NULL,
    subtotal NUMERIC(12, 2) NOT NULL,
    discount_percent NUMERIC(5, 2) DEFAULT 0,
    discount_amount NUMERIC(12, 2) DEFAULT 0,
    payment_method VARCHAR(50) NOT NULL, -- ESPECES, BANKILY, MASRVI, KRIDI, CARTE
    payment_reference VARCHAR(100),
    cash_given NUMERIC(12, 2) DEFAULT 0,
    change_due NUMERIC(12, 2) DEFAULT 0,
    table_number VARCHAR(50),
    order_type VARCHAR(50) DEFAULT 'SUR_PLACE', -- SUR_PLACE, A_EMPORTER, LIVRAISON
    delivery_address VARCHAR(255),
    delivery_phone VARCHAR(50),
    delivery_fee NUMERIC(12, 2) DEFAULT 0,
    kridi_customer_id VARCHAR(64) REFERENCES kridi_customers(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. LIGNES DE COMMANDES (DÉTAILS DES ARTICLES VENDUS)
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(64) PRIMARY KEY,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
    product_id VARCHAR(64) REFERENCES products(id) ON DELETE SET NULL,
    product_name VARCHAR(255) NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL,
    quantity NUMERIC(12, 3) NOT NULL,
    weight_in_kg NUMERIC(12, 3),
    total_line NUMERIC(12, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. ÉCRAN CUISINE (KDS - KITCHEN DISPLAY SYSTEM)
CREATE TABLE IF NOT EXISTS kds_orders (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
    order_id VARCHAR(64) REFERENCES orders(id) ON DELETE CASCADE,
    table_number VARCHAR(50),
    order_type VARCHAR(50) DEFAULT 'SUR_PLACE',
    status VARCHAR(50) DEFAULT 'EN_ATTENTE', -- EN_ATTENTE, EN_CUISSON, PRET, SERVI
    elapsed_minutes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. MOUVEMENTS DU TIROIR-CAISSE (FOND & DÉPENSES)
CREATE TABLE IF NOT EXISTS cash_movements (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- FLOAT_OPEN, IN, OUT
    amount NUMERIC(12, 2) NOT NULL,
    reason TEXT NOT NULL,
    cashier_name VARCHAR(150),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. CLÔTURES DE CAISSE (RAPPORT Z FISCAL)
CREATE TABLE IF NOT EXISTS daily_z_reports (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) REFERENCES tenants(id) ON DELETE CASCADE,
    report_date DATE NOT NULL,
    orders_count INT DEFAULT 0,
    total_sales NUMERIC(12, 2) NOT NULL,
    total_cash NUMERIC(12, 2) DEFAULT 0,
    total_bankily NUMERIC(12, 2) DEFAULT 0,
    total_masrvi NUMERIC(12, 2) DEFAULT 0,
    total_kridi NUMERIC(12, 2) DEFAULT 0,
    average_ticket NUMERIC(12, 2) DEFAULT 0,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- INDEX POUR RECHERCHE ULTRA-RAPIDE MULTI-TENANT
CREATE INDEX IF NOT EXISTS idx_products_tenant ON products(tenant_id);
CREATE INDEX IF NOT EXISTS idx_products_barcode ON products(barcode);
CREATE INDEX IF NOT EXISTS idx_orders_tenant ON orders(tenant_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_kds_status ON kds_orders(status);
