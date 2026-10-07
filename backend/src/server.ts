import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { authRouter } from './routes/auth.routes.js';
import { subscriptionRouter } from './routes/subscription.routes.js';
import { productRouter } from './routes/product.routes.js';
import { orderRouter } from './routes/order.routes.js';
import { kridiRouter } from './routes/kridi.routes.js';
import { aiRouter } from './routes/ai.routes.js';

import { initPostgres, isPostgresConnected } from './db/postgres.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Healthcheck & API Welcome
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    service: 'CaissaFlow SaaS POS Backend API',
    database: isPostgresConnected() ? 'PostgreSQL (Connecté)' : 'In-Memory Store (Actif)',
    postgresConnected: isPostgresConnected(),
    version: '2.4.0',
    timestamp: new Date().toISOString()
  });
});

// Enregistrement des routes modulaires
app.use('/api/auth', authRouter);
app.use('/api/subscriptions', subscriptionRouter);
app.use('/api/products', productRouter);
app.use('/api/orders', orderRouter);
app.use('/api/kridi', kridiRouter);
app.use('/api/ai', aiRouter);

// Démarrage du serveur
app.listen(PORT, async () => {
  console.log(`=======================================================`);
  console.log(`🚀 CaissaFlow Backend API opérationnel sur : http://localhost:${PORT}`);
  console.log(`📦 Healthcheck : http://localhost:${PORT}/api/health`);
  console.log(`🤖 Agents IA & POS prêts pour Restauration & Market`);
  console.log(`=======================================================`);

  // Initialisation de la base PostgreSQL
  await initPostgres();
});

export default app;
