import 'dotenv/config';
import pg from 'pg';
import fs from 'fs';
import path from 'path';

const { Pool } = pg;

let pool: pg.Pool | null = null;
let isConnected = false;

export function getPool(): pg.Pool | null {
  return pool;
}

export function isPostgresConnected(): boolean {
  return isConnected;
}

export async function initPostgres(): Promise<boolean> {
  try {
    const rawUrl = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/caissa_pos';
    console.log('🔄 Tentative de connexion à PostgreSQL :', rawUrl.replace(/:[^:@]+@/, ':***@'));

    // Nettoyer d'éventuels paramètres non supportés directement par le driver node-postgres si besoin
    const cleanUrl = rawUrl.replace(/[?&]channel_binding=[^&]+/, '');

    pool = new Pool({
      connectionString: cleanUrl,
      connectionTimeoutMillis: 10000,
      ssl: { rejectUnauthorized: false }
    });

    // Test simple de connexion
    const client = await pool.connect();
    const res = await client.query('SELECT NOW() as current_time, version()');
    client.release();

    isConnected = true;
    console.log('✅ PostgreSQL connecté avec succès ! Version :', res.rows[0].version.split(' ')[0], res.rows[0].version.split(' ')[1]);

    // Initialisation automatique des tables si le fichier schema.sql existe
    await executeSchemaMigration();

    return true;
  } catch (err: any) {
    isConnected = false;
    console.warn('⚠️ PostgreSQL non joignable (mode mémoire/hors-ligne actif) :', err.message);
    return false;
  }
}

// Exécution du schéma SQL de démarrage
async function executeSchemaMigration() {
  if (!pool || !isConnected) return;

  try {
    const possiblePaths = [
      path.join(process.cwd(), 'src', 'db', 'schema.sql'),
      path.join(process.cwd(), 'dist', 'db', 'schema.sql'),
      path.join(process.cwd(), 'backend', 'src', 'db', 'schema.sql')
    ];
    const schemaPath = possiblePaths.find(p => fs.existsSync(p));
    if (schemaPath) {
      const sql = fs.readFileSync(schemaPath, 'utf8');
      await pool.query(sql);
      console.log('✅ Schéma PostgreSQL (tenants, products, orders, tables, kds, kridi) vérifié et prêt.');

      // Insérer les données démo si vide
      await seedDefaultDataIfEmpty();
    }
  } catch (err: any) {
    console.warn('Erreur lors de l\'exécution du schema.sql :', err.message);
  }
}

// Initialisation des données restaurant et boutique par défaut
async function seedDefaultDataIfEmpty() {
  if (!pool || !isConnected) return;
  try {
    const res = await pool.query('SELECT COUNT(*) as count FROM tenants');
    if (parseInt(res.rows[0].count) === 0) {
      console.log('🌱 Insertion des données initiales dans PostgreSQL...');
      await pool.query(`
        INSERT INTO tenants (id, business_name, sector, restaurant_type, city, table_count, phone, email, currency, subscription_plan)
        VALUES ('tenant-demo-1', 'Restaurant & Lounge Le Palmier', 'restaurant', 'Restaurant Gastronomique & Salons VIP', 'Tevragh-Zeina, Nouakchott', 12, '+222 22 14 55 88', 'palmier@caissa.mr', 'MRU', 'TRIAL_14_DAYS')
        ON CONFLICT (id) DO NOTHING;
      `);
      await pool.query(`
        INSERT INTO users (id, tenant_id, full_name, email, pin_code, role)
        VALUES ('user-1', 'tenant-demo-1', 'Sidi Mohamed (Patron)', 'sidi@palmier.mr', '1234', 'OWNER')
        ON CONFLICT (id) DO NOTHING;
      `);
      console.log('✅ Établissement et gérant par défaut créés dans PostgreSQL.');
    }
  } catch (err: any) {
    console.warn('Erreur seedDefaultDataIfEmpty :', err.message);
  }
}

// Exécuteur de requêtes SQL avec gestion des erreurs
export async function query(text: string, params?: any[]) {
  if (!pool || !isConnected) {
    throw new Error('Base de données PostgreSQL non connectée');
  }
  const start = Date.now();
  const res = await pool.query(text, params);
  const duration = Date.now() - start;
  // console.log('Query exécutée en', duration, 'ms');
  return res;
}
