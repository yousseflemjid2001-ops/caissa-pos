import dotenv from 'dotenv';
dotenv.config();
import { initPostgres, query } from './db/postgres';

async function main() {
  console.log('🚀 Connexion à Neon PostgreSQL en cours...');
  const success = await initPostgres();
  if (!success) {
    console.error('❌ Échec de la connexion à Neon.');
    process.exit(1);
  }

  const countRes = await query("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'");
  console.log('📊 Tables créées dans la base Neon :', countRes.rows[0].count);

  const tablesRes = await query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
  console.log('📋 Liste des tables :', tablesRes.rows.map(r => r.table_name).join(', '));

  const tenantsRes = await query("SELECT business_name, city, phone, table_count, subscription_plan FROM tenants ORDER BY created_at DESC");
  console.log('🏪 Établissements en base Neon :');
  console.table(tenantsRes.rows);

  console.log('🎉 Succès total : Base de données Neon prête et opérationnelle !');
  process.exit(0);
}

main().catch(err => {
  console.error('Exception :', err);
  process.exit(1);
});
