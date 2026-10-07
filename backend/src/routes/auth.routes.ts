import { Router, Request, Response } from 'express';
import { db } from '../db/inMemoryStore.js';
import { Tenant, User } from '../types/index.js';
import { query, isPostgresConnected } from '../db/postgres.js';

export const authRouter = Router();

// Inscription d'un nouveau commerce avec 14 jours d'essai gratuit
authRouter.post('/register', async (req: Request, res: Response): Promise<any> => {
  const { businessName, sector, phone, email, ownerName, pinCode, restaurantType, city, tableCount } = req.body;

  if (!businessName || !phone) {
    return res.status(400).json({ error: "Le nom de l'établissement et le numéro de téléphone sont obligatoires." });
  }

  const tenantId = `tenant-${Date.now()}`;
  const now = new Date();
  const trialEnds = new Date(now.getTime() + 14 * 86400000); // 14 jours d'essai

  const newTenant: any = {
    id: tenantId,
    businessName,
    sector: sector || 'restaurant',
    restaurantType: restaurantType || 'Restaurant & Grillades',
    city: city || 'Nouakchott',
    tableCount: tableCount || 10,
    phone,
    email: email || '',
    currency: 'MRU',
    subscriptionPlan: 'TRIAL_14_DAYS',
    trialEndsAt: trialEnds.toISOString(),
    subscriptionExpiresAt: trialEnds.toISOString(),
    createdAt: now.toISOString()
  };

  const newUser: User = {
    id: `user-${Date.now()}`,
    tenantId,
    fullName: ownerName || 'Gérant Restaurant',
    email,
    pinCode: pinCode || '1234',
    role: 'OWNER',
    isActive: true
  };

  // Stockage mémoire immédiat
  db.tenants.push(newTenant);
  db.users.push(newUser);

  // Persistance dans Neon PostgreSQL Cloud
  if (isPostgresConnected()) {
    try {
      await query(`
        INSERT INTO tenants (id, business_name, sector, restaurant_type, city, table_count, phone, email, currency, subscription_plan, trial_ends_at, subscription_expires_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        ON CONFLICT (id) DO NOTHING
      `, [newTenant.id, newTenant.businessName, newTenant.sector, newTenant.restaurantType, newTenant.city, newTenant.tableCount, newTenant.phone, newTenant.email, newTenant.currency, newTenant.subscriptionPlan, newTenant.trialEndsAt, newTenant.subscriptionExpiresAt]);

      await query(`
        INSERT INTO users (id, tenant_id, full_name, email, pin_code, role)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (id) DO NOTHING
      `, [newUser.id, newUser.tenantId, newUser.fullName, newUser.email, newUser.pinCode, newUser.role]);

      console.log(`✅ Nouveau restaurant [${newTenant.businessName}] enregistré avec succès dans Neon PostgreSQL Cloud !`);
    } catch (err: any) {
      console.warn('⚠️ Erreur écriture Neon DB tenant/user :', err.message);
    }
  }

  return res.status(201).json({
    message: "Compte restaurant créé avec succès ! Votre essai gratuit de 14 jours est activé.",
    tenant: newTenant,
    user: newUser,
    token: `token-jwt-simulated-${newTenant.id}`,
    cloudSync: isPostgresConnected()
  });
});

// Connexion classique par Email ou Téléphone
authRouter.post('/login', (req: Request, res: Response): any => {
  const { identifier, password, pinCode } = req.body;

  if (!identifier) {
    return res.status(400).json({ error: "L'identifiant (email ou téléphone) est requis." });
  }

  // Chercher par email ou téléphone dans les tenants et utilisateurs
  const matchedTenant = db.tenants.find(t => 
    (t.email && t.email.toLowerCase() === identifier.toLowerCase()) || 
    (t.phone && t.phone.includes(identifier)) ||
    (t.businessName && t.businessName.toLowerCase().includes(identifier.toLowerCase()))
  );

  if (!matchedTenant) {
    return res.status(401).json({ error: "Identifiant ou mot de passe incorrect." });
  }

  const matchedUser = db.users.find(u => 
    u.tenantId === matchedTenant.id && (
      (u.email && u.email.toLowerCase() === identifier.toLowerCase()) ||
      (!pinCode || u.pinCode === pinCode)
    )
  );

  if (!matchedUser) {
    return res.status(401).json({ error: "Identifiant ou mot de passe incorrect." });
  }

  // TODO: Implement proper password verification here in the future
  // if (password && matchedUser.password !== password) {
  //   return res.status(401).json({ error: "Identifiant ou mot de passe incorrect." });
  // }

  return res.json({
    message: `Connexion réussie ! Bienvenue dans votre restaurant.`,
    tenant: matchedTenant,
    user: matchedUser,
    token: `token-jwt-simulated-${matchedUser.id}`
  });
});

// Connexion rapide par code PIN caissier
authRouter.post('/login-pin', (req: Request, res: Response): any => {
  const pin = req.body.pinCode || req.body.pin;
  const tenantId = req.body.tenantId;

  const targetTenantId = tenantId || db.tenants[0].id;
  const user = db.users.find(u => u.tenantId === targetTenantId && u.pinCode === pin);

  if (!user) {
    return res.status(401).json({ error: "Code PIN invalide ou utilisateur introuvable." });
  }

  const tenant = db.tenants.find(t => t.id === targetTenantId);

  return res.json({
    message: `Bienvenue ${user.fullName} !`,
    user,
    tenant,
    token: `token-jwt-simulated-${user.id}`
  });
});

// Liste des caissiers autorisés pour la caisse
authRouter.get('/users', (req: Request, res: Response): any => {
  const tenantId = (req.query.tenantId as string) || db.tenants[0].id;
  const users = db.users.filter(u => u.tenantId === tenantId).map(({ pinCode, ...safeUser }) => safeUser);
  return res.json({ users });
});
