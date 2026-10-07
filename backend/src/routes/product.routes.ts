import { Router, Request, Response } from 'express';
import { db } from '../db/inMemoryStore.js';
import { Product } from '../types/index.js';

export const productRouter = Router();

// Récupérer le catalogue par secteur et recherche
productRouter.get('/', (req: Request, res: Response): any => {
  const tenantId = (req.query.tenantId as string) || db.tenants[0].id;
  const sector = req.query.sector as string;
  const search = (req.query.search as string || '').toLowerCase();

  let list = db.products.filter(p => p.tenantId === tenantId);

  if (sector) {
    list = list.filter(p => p.sector === sector);
  }

  if (search) {
    list = list.filter(p => 
      p.name.toLowerCase().includes(search) || 
      p.barcode.includes(search) ||
      (p.nameAr && p.nameAr.includes(search))
    );
  }

  return res.json({ products: list, count: list.length });
});

// Créer un nouveau produit
productRouter.post('/', (req: Request, res: Response): any => {
  const { tenantId, name, nameAr, category, price, costPrice, barcode, stock, isWeighted, sector, image } = req.body;
  const targetTenantId = tenantId || db.tenants[0].id;

  if (!name || price === undefined) {
    return res.status(400).json({ error: "Le nom et le prix de vente sont requis." });
  }

  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    tenantId: targetTenantId,
    name,
    nameAr,
    category: category || 'Divers',
    price: parseFloat(price),
    costPrice: parseFloat(costPrice || '0'),
    barcode: barcode || `${Math.floor(10000000 + Math.random() * 90000000)}`,
    stock: parseInt(stock || '100'),
    isWeighted: Boolean(isWeighted),
    sector: sector || 'restaurant',
    image: image || '📦'
  };

  db.products.push(newProduct);

  return res.status(201).json({ message: "Produit ajouté avec succès.", product: newProduct });
});

// Mise à jour de stock rapide
productRouter.patch('/:id/stock', (req: Request, res: Response): any => {
  const { id } = req.params;
  const { deltaQuantity } = req.body;

  const product = db.products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Produit introuvable." });
  }

  product.stock += parseInt(deltaQuantity || 0);

  return res.json({
    message: "Stock mis à jour avec succès.",
    productName: product.name,
    newStock: product.stock
  });
});

// Mise à jour complète d'un produit
productRouter.put('/:id', (req: Request, res: Response): any => {
  const { id } = req.params;
  const { name, nameAr, category, price, costPrice, barcode, stock, isWeighted, sector, image } = req.body;

  const product = db.products.find(p => p.id === id);
  if (!product) {
    return res.status(404).json({ error: "Produit introuvable." });
  }

  if (name !== undefined) product.name = name;
  if (nameAr !== undefined) product.nameAr = nameAr;
  if (category !== undefined) product.category = category;
  if (price !== undefined) product.price = parseFloat(price);
  if (costPrice !== undefined) product.costPrice = parseFloat(costPrice);
  if (barcode !== undefined) product.barcode = barcode;
  if (stock !== undefined) product.stock = parseInt(stock);
  if (isWeighted !== undefined) product.isWeighted = Boolean(isWeighted);
  if (sector !== undefined) product.sector = sector;
  if (image !== undefined) product.image = image;

  return res.json({ message: "Produit mis à jour avec succès.", product });
});

// Supprimer un produit
productRouter.delete('/:id', (req: Request, res: Response): any => {
  const { id } = req.params;
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Produit introuvable." });
  }

  const removed = db.products.splice(index, 1)[0];
  return res.json({ message: "Produit supprimé avec succès.", product: removed });
});

