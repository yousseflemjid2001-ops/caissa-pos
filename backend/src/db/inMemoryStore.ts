import { Tenant, User, Product, Order, KridiCustomer, Subscription, KitchenOrder, CashMovement } from '../types/index.js';

export class DataStore {
  public tenants: Tenant[] = [
    {
      id: 'tenant-demo-1',
      businessName: 'Boutique & Restaurant Al-Baraka Nouakchott',
      sector: 'restaurant',
      phone: '+222 22 14 55 88',
      email: 'contact@albaraka.mr',
      currency: 'MRU',
      subscriptionPlan: 'TRIAL_15_DAYS',
      trialEndsAt: new Date(Date.now() + 15 * 86400000).toISOString(),
      subscriptionExpiresAt: new Date(Date.now() + 15 * 86400000).toISOString(),
      createdAt: new Date().toISOString()
    }
  ];

  public users: User[] = [
    {
      id: 'user-1',
      tenantId: 'tenant-demo-1',
      fullName: 'Sidi Mohamed (Patron)',
      email: 'sidi@albaraka.mr',
      pinCode: '1234',
      role: 'OWNER',
      isActive: true
    },
    {
      id: 'user-2',
      tenantId: 'tenant-demo-1',
      fullName: 'Ely (Caissier)',
      pinCode: '0000',
      role: 'CASHIER',
      isActive: true
    }
  ];

  public subscriptions: Subscription[] = [];

  public products: Product[] = [
    // ==========================================
    // --- RESTAURATION & CAFÉ (MAURITANIE) ---
    // ==========================================
    {
      id: 'rest-1',
      tenantId: 'tenant-demo-1',
      name: 'Riz au Poisson (Ceebu Jën / Thieb Rouge)',
      nameAr: 'مارو بالحوت الأحمر (كسكس الحوت)',
      category: 'Plats Traditionnels',
      brand: 'Cuisine Maison',
      price: 150,
      costPrice: 85,
      image: 'thieb',
      barcode: '22210001',
      sector: 'restaurant',
      stock: 45
    },
    {
      id: 'rest-1b',
      tenantId: 'tenant-demo-1',
      name: 'Riz à la Viande (Ceebu Yapp Mauritanien)',
      nameAr: 'مارو باللحم الموريتاني',
      category: 'Plats Traditionnels',
      brand: 'Cuisine Maison',
      price: 180,
      costPrice: 105,
      image: 'ceebu_yapp',
      barcode: '22210011',
      sector: 'restaurant',
      stock: 30
    },
    {
      id: 'rest-1c',
      tenantId: 'tenant-demo-1',
      name: 'Couscous Mauritanien au Chameau',
      nameAr: 'كسكس موريتاني بلحم الإبل',
      category: 'Plats Traditionnels',
      brand: 'Cuisine Maison',
      price: 200,
      costPrice: 120,
      image: 'couscous',
      barcode: '22210012',
      sector: 'restaurant',
      stock: 25
    },
    {
      id: 'rest-2',
      tenantId: 'tenant-demo-1',
      name: 'Chwaya Viande d\'Agneau Grillée',
      nameAr: 'شواية لحم خروف مشوي',
      category: 'Grillades & Chwaya',
      brand: 'Chwaya Chef',
      price: 250,
      costPrice: 160,
      image: 'chwaya_agneau',
      barcode: '22210002',
      sector: 'restaurant',
      stock: 35
    },
    {
      id: 'rest-3',
      tenantId: 'tenant-demo-1',
      name: 'Chwaya Viande de Chameau (Naga / Hwar)',
      nameAr: 'شواية لحم إبل طري (حوار)',
      category: 'Grillades & Chwaya',
      brand: 'Chwaya Chef',
      price: 220,
      costPrice: 140,
      image: 'chwaya_chameau',
      barcode: '22210003',
      sector: 'restaurant',
      stock: 40
    },
    {
      id: 'rest-3b',
      tenantId: 'tenant-demo-1',
      name: 'Brochettes Mixtes Braisées (6 pièces)',
      nameAr: 'مشاوي مشكلة لحم وكبدة',
      category: 'Grillades & Chwaya',
      brand: 'Chwaya Chef',
      price: 180,
      costPrice: 100,
      image: 'brochettes',
      barcode: '22210013',
      sector: 'restaurant',
      stock: 50
    },
    {
      id: 'rest-4',
      tenantId: 'tenant-demo-1',
      name: 'Demi-Poulet Rôti Épicé & Frites',
      nameAr: 'نصف دجاج مشوي متبل وبطاطس',
      category: 'Plats & Volailles',
      brand: 'Rotisserie',
      price: 180,
      costPrice: 110,
      image: 'poulet_roti',
      barcode: '22210004',
      sector: 'restaurant',
      stock: 50
    },
    {
      id: 'rest-4b',
      tenantId: 'tenant-demo-1',
      name: 'Poulet Entier Braisé Façon Nouakchott',
      nameAr: 'دجاجة كاملة متبلة على الفحم',
      category: 'Plats & Volailles',
      brand: 'Rotisserie',
      price: 320,
      costPrice: 200,
      image: 'poulet_braise',
      barcode: '22210014',
      sector: 'restaurant',
      stock: 20
    },
    {
      id: 'rest-5',
      tenantId: 'tenant-demo-1',
      name: 'Sandwich Chawarma Viande & Fromage',
      nameAr: 'سندويش شاورما لحم بالجبن',
      category: 'Sandwiches & Fast-Food',
      brand: 'Fast-Food',
      price: 90,
      costPrice: 48,
      image: 'chawarma',
      barcode: '22210005',
      sector: 'restaurant',
      stock: 90
    },
    {
      id: 'rest-5b',
      tenantId: 'tenant-demo-1',
      name: 'Burger Royal Double Bœuf & Frites',
      nameAr: 'برغر ملكي دبل لحم مع بطاطس',
      category: 'Sandwiches & Fast-Food',
      brand: 'Fast-Food',
      price: 150,
      costPrice: 85,
      image: 'burger',
      barcode: '22210015',
      sector: 'restaurant',
      stock: 60
    },
    {
      id: 'rest-5c',
      tenantId: 'tenant-demo-1',
      name: 'Panini Poulet Épicé Mozzarella',
      nameAr: 'بانيني دجاج بالجبن',
      category: 'Sandwiches & Fast-Food',
      brand: 'Fast-Food',
      price: 100,
      costPrice: 55,
      image: 'panini',
      barcode: '22210016',
      sector: 'restaurant',
      stock: 75
    },
    {
      id: 'rest-5d',
      tenantId: 'tenant-demo-1',
      name: 'Pizza Margherita Mozzarella & Basilic',
      nameAr: 'بيتزا مارغريتا كلاسيكية',
      category: 'Pizzas',
      brand: 'Pizzeria',
      price: 160,
      costPrice: 70,
      image: 'pizza_margherita',
      barcode: '22210017',
      sector: 'restaurant',
      stock: 40
    },
    {
      id: 'rest-5e',
      tenantId: 'tenant-demo-1',
      name: 'Pizza Viande Hachée & Fromage',
      nameAr: 'بيتزا لحم مفروم بالجبن',
      category: 'Pizzas',
      brand: 'Pizzeria',
      price: 220,
      costPrice: 110,
      image: 'pizza_viande',
      barcode: '22210018',
      sector: 'restaurant',
      stock: 35
    },
    {
      id: 'rest-6',
      tenantId: 'tenant-demo-1',
      name: 'Thé Traditionnel Mauritanien (Atay 3 verres)',
      nameAr: 'شاي موريتاني أصيل (أتاي ثلاث كؤوس)',
      category: 'Boissons Chaudes & Atay',
      brand: 'Salon de Thé',
      price: 30,
      costPrice: 8,
      image: 'atay',
      barcode: '22210006',
      sector: 'restaurant',
      stock: 300
    },
    {
      id: 'rest-9',
      tenantId: 'tenant-demo-1',
      name: 'Café Touba Épicé Traditionnel',
      nameAr: 'قهوة طوبى التقليدية بالفلفل',
      category: 'Boissons Chaudes & Atay',
      brand: 'Salon de Thé',
      price: 30,
      costPrice: 10,
      image: 'cafe_touba',
      barcode: '22210009',
      sector: 'restaurant',
      stock: 120
    },
    {
      id: 'rest-9b',
      tenantId: 'tenant-demo-1',
      name: 'Café Expresso Pur Arabica',
      nameAr: 'إسبريسو إيطالي مركز',
      category: 'Boissons Chaudes & Atay',
      brand: 'Salon de Thé',
      price: 40,
      costPrice: 12,
      image: 'expresso',
      barcode: '22210019',
      sector: 'restaurant',
      stock: 150
    },
    {
      id: 'rest-7',
      tenantId: 'tenant-demo-1',
      name: 'Jus de Bissap Frais Artisanal 50cl',
      nameAr: 'عصير كركديه طبيعي بارد (بيصاب)',
      category: 'Jus Frais & Boissons',
      brand: 'Boissons Fraîches',
      price: 40,
      costPrice: 15,
      image: 'bissap',
      barcode: '22210007',
      sector: 'restaurant',
      stock: 65
    },
    {
      id: 'rest-8',
      tenantId: 'tenant-demo-1',
      name: 'Jus de Bouye Naturel (Pain de Singe)',
      nameAr: 'عصير بوي طبيعي مركز',
      category: 'Jus Frais & Boissons',
      brand: 'Boissons Fraîches',
      price: 50,
      costPrice: 20,
      image: 'bouye',
      barcode: '22210008',
      sector: 'restaurant',
      stock: 60
    },
    {
      id: 'rest-10',
      tenantId: 'tenant-demo-1',
      name: 'Eau Minérale Benichab 1.5L',
      nameAr: 'ماء بنيشاب معدني طبيعي',
      category: 'Jus Frais & Boissons',
      brand: 'Benichab',
      price: 25,
      costPrice: 16,
      image: 'eau_benichab',
      barcode: '22210010',
      sector: 'restaurant',
      stock: 200
    },
    {
      id: 'rest-10b',
      tenantId: 'tenant-demo-1',
      name: 'Crêpe Sucrée Nutella & Banane',
      nameAr: 'كريب نوتيلا بالموز',
      category: 'Desserts & Crêpes',
      brand: 'Pâtisserie',
      price: 110,
      costPrice: 45,
      image: 'crepe',
      barcode: '22210020',
      sector: 'restaurant',
      stock: 40
    },
    {
      id: 'rest-10c',
      tenantId: 'tenant-demo-1',
      name: 'Gaufre Croustillante Miel & Beurre',
      nameAr: 'وافل مقرمش بالعسل والزبدة',
      category: 'Desserts & Crêpes',
      brand: 'Pâtisserie',
      price: 90,
      costPrice: 35,
      image: 'gaufre',
      barcode: '22210021',
      sector: 'restaurant',
      stock: 35
    },

    // ==========================================
    // --- COMMERCE & BOUTIQUE (MAURITANIE) ---
    // ==========================================
    {
      id: 'mkt-tab-1',
      tenantId: 'tenant-demo-1',
      name: 'Marlboro Gold Boîte (Paquet)',
      nameAr: 'سجائر مارلبورو جولد',
      category: 'Tabacs',
      brand: 'Marlboro',
      price: 110,
      costPrice: 95,
      image: 'tabac_marlboro',
      barcode: '76221001',
      sector: 'market',
      stock: 120
    },
    {
      id: 'mkt-tab-2',
      tenantId: 'tenant-demo-1',
      name: 'Dunhill International Bleu',
      nameAr: 'سجائر دانهيل الدولية',
      category: 'Tabacs',
      brand: 'Dunhill',
      price: 130,
      costPrice: 112,
      image: 'tabac_dunhill',
      barcode: '76221002',
      sector: 'market',
      stock: 90
    },
    {
      id: 'mkt-tab-3',
      tenantId: 'tenant-demo-1',
      name: 'Rym Mauritanie Classic',
      nameAr: 'سجائر ريم الكلاسيكية',
      category: 'Tabacs',
      brand: 'Rym',
      price: 60,
      costPrice: 48,
      image: 'tabac_rym',
      barcode: '76221003',
      sector: 'market',
      stock: 160
    },
    {
      id: 'mkt-1',
      tenantId: 'tenant-demo-1',
      name: 'Riz Blanc Mauritanien Sac 5kg',
      nameAr: 'أرز موريتاني فاخر كيس 5 كغ',
      category: 'Épicerie & Céréales',
      brand: 'Sedar',
      price: 220,
      costPrice: 185,
      image: 'riz_sac',
      barcode: '2222000101',
      sector: 'market',
      stock: 80
    },
    {
      id: 'mkt-5',
      tenantId: 'tenant-demo-1',
      name: 'Huile Végétale Raffinée 1L',
      nameAr: 'زيت طعام نباتي 1 لتر',
      category: 'Épicerie & Céréales',
      brand: 'Savor',
      price: 75,
      costPrice: 62,
      image: 'huile',
      barcode: '2222000105',
      sector: 'market',
      stock: 130
    },
    {
      id: 'mkt-6',
      tenantId: 'tenant-demo-1',
      name: 'Sucre en Poudre Blanc 1kg',
      nameAr: 'سكر أبيض ناعم 1 كغ',
      category: 'Épicerie & Céréales',
      brand: 'Sucrim',
      price: 45,
      costPrice: 38,
      image: 'sucre',
      barcode: '2222000106',
      sector: 'market',
      stock: 150
    },
    {
      id: 'mkt-7',
      tenantId: 'tenant-demo-1',
      name: 'Thé Vert de Chine Al-Warka Boîte 250g',
      nameAr: 'شاي الورقة الأخضر 250غ',
      category: 'Café & Thés',
      brand: 'Al-Warka',
      price: 60,
      costPrice: 48,
      image: 'the_warka',
      barcode: '2222000107',
      sector: 'market',
      stock: 110
    },
    {
      id: 'mkt-7b',
      tenantId: 'tenant-demo-1',
      name: 'Café Touba Moulu Épicé 250g',
      nameAr: 'بن طوبى مطحون فاخر 250غ',
      category: 'Café & Thés',
      brand: 'Touba',
      price: 80,
      costPrice: 60,
      image: 'cafe_touba_pack',
      barcode: '2222000120',
      sector: 'market',
      stock: 70
    },
    {
      id: 'mkt-4',
      tenantId: 'tenant-demo-1',
      name: 'Lait en Poudre Célia / Gloria 400g',
      nameAr: 'حليب مجفف سيليا / غلوريا 400غ',
      category: 'Produits Laitiers',
      brand: 'Celia',
      price: 140,
      costPrice: 118,
      image: 'lait_poudre',
      barcode: '2222000104',
      sector: 'market',
      stock: 95
    },
    {
      id: 'mkt-4b',
      tenantId: 'tenant-demo-1',
      name: 'Lait Frais Pasteurisé Tiviski 1L',
      nameAr: 'حليب تيفسكي طازج 1 لتر',
      category: 'Produits Laitiers',
      brand: 'Tiviski',
      price: 45,
      costPrice: 35,
      image: 'lait_tiviski',
      barcode: '2222000121',
      sector: 'market',
      stock: 60
    },
    {
      id: 'mkt-4c',
      tenantId: 'tenant-demo-1',
      name: 'Fromage Portion La Vache Qu\'il Faut (8 Portions)',
      nameAr: 'جبنة لافاش كي ري 8 قطع',
      category: 'Produits Laitiers',
      brand: 'Bel',
      price: 55,
      costPrice: 42,
      image: 'fromage_portion',
      barcode: '2222000122',
      sector: 'market',
      stock: 85
    },
    {
      id: 'mkt-soda-1',
      tenantId: 'tenant-demo-1',
      name: 'Coca-Cola Canette Fraîche 33cl',
      nameAr: 'كوكا كولا علبة باردة 33 سل',
      category: 'Eaux Gazeuses & Sodas',
      brand: 'Coca-Cola',
      price: 30,
      costPrice: 22,
      image: 'coca_canette',
      barcode: '54490001',
      sector: 'market',
      stock: 140
    },
    {
      id: 'mkt-soda-2',
      tenantId: 'tenant-demo-1',
      name: 'Fanta Orange Canette 33cl',
      nameAr: 'فانتا برتقال علبة 33 سل',
      category: 'Eaux Gazeuses & Sodas',
      brand: 'Fanta',
      price: 30,
      costPrice: 22,
      image: 'fanta_canette',
      barcode: '54490002',
      sector: 'market',
      stock: 110
    },
    {
      id: 'mkt-soda-3',
      tenantId: 'tenant-demo-1',
      name: 'Sprite Citron Canette 33cl',
      nameAr: 'سبرايت ليمون علبة 33 سل',
      category: 'Eaux Gazeuses & Sodas',
      brand: 'Sprite',
      price: 30,
      costPrice: 22,
      image: 'sprite_canette',
      barcode: '54490003',
      sector: 'market',
      stock: 95
    },
    {
      id: 'mkt-eau-1',
      tenantId: 'tenant-demo-1',
      name: 'Eau Minérale Naturelle Benichab 1.5L',
      nameAr: 'ماء بنيشاب معدني طبيعي 1.5 لتر',
      category: 'Boissons & Eaux',
      brand: 'Benichab',
      price: 25,
      costPrice: 17,
      image: 'eau_benichab',
      barcode: '2222000111',
      sector: 'market',
      stock: 250
    },
    {
      id: 'mkt-eau-2',
      tenantId: 'tenant-demo-1',
      name: 'Eau Minérale Benichab Petite 0.5L',
      nameAr: 'ماء بنيشاب معدني صغير 0.5 لتر',
      category: 'Boissons & Eaux',
      brand: 'Benichab',
      price: 15,
      costPrice: 9,
      image: 'eau_benichab_small',
      barcode: '2222000112',
      sector: 'market',
      stock: 200
    },
    {
      id: 'mkt-dattes',
      tenantId: 'tenant-demo-1',
      name: 'Dattes de Tidjikja Al-Madina 500g',
      nameAr: 'تمر تجكجة الفاخر 500غ',
      category: 'Fruits Secs & Dattes',
      brand: 'Oasis Tidjikja',
      price: 120,
      costPrice: 85,
      image: 'dattes',
      barcode: '2222000123',
      sector: 'market',
      stock: 65
    },
    {
      id: 'mkt-amandes',
      tenantId: 'tenant-demo-1',
      name: 'Amandes Grillées Salées 200g',
      nameAr: 'لوز محمص ومملح 200غ',
      category: 'Fruits Secs & Dattes',
      brand: 'Snacks Al-Baraka',
      price: 90,
      costPrice: 65,
      image: 'amandes',
      barcode: '2222000124',
      sector: 'market',
      stock: 50
    },
    {
      id: 'mkt-10',
      tenantId: 'tenant-demo-1',
      name: 'Biscuits Oumou Snacks Crème',
      nameAr: 'بسكويت أمو المحشو بالكريمة',
      category: 'Biscuits & Confiserie',
      brand: 'Oumou',
      price: 20,
      costPrice: 14,
      image: 'biscuits_oumou',
      barcode: '2222000110',
      sector: 'market',
      stock: 140
    },
    {
      id: 'mkt-chips',
      tenantId: 'tenant-demo-1',
      name: 'Chips au Barbecue Croustillantes 50g',
      nameAr: 'شيبس بنكهة الشواء 50غ',
      category: 'Biscuits & Confiserie',
      brand: 'Crunchy',
      price: 25,
      costPrice: 16,
      image: 'chips',
      barcode: '2222000125',
      sector: 'market',
      stock: 120
    },
    {
      id: 'mkt-2',
      tenantId: 'tenant-demo-1',
      name: 'Poisson Frais Thiof / Mérou (au Kg)',
      nameAr: 'سمك تيشوف طازج (بالكيلوغرام)',
      category: 'Boucherie & Poissonnerie',
      brand: 'Pêche Artisanale Nouakchott',
      price: 350,
      costPrice: 270,
      image: 'poisson_thiof',
      barcode: '2222000102',
      sector: 'market',
      stock: 25,
      isWeighted: true,
      unit: 'kg'
    },
    {
      id: 'mkt-3',
      tenantId: 'tenant-demo-1',
      name: 'Viande de Chameau Fraîche (au Kg)',
      nameAr: 'لحم إبل طازج من النحر (بالكيلوغرام)',
      category: 'Boucherie & Poissonnerie',
      brand: 'Boucherie El-Baraka',
      price: 280,
      costPrice: 220,
      image: 'viande_chameau',
      barcode: '2222000103',
      sector: 'market',
      stock: 40,
      isWeighted: true,
      unit: 'kg'
    },
    {
      id: 'mkt-3b',
      tenantId: 'tenant-demo-1',
      name: 'Viande d\'Agneau Fraîche (au Kg)',
      nameAr: 'لحم خروف محلي طازج (بالكيلوغرام)',
      category: 'Boucherie & Poissonnerie',
      brand: 'Boucherie El-Baraka',
      price: 320,
      costPrice: 250,
      image: 'viande_agneau',
      barcode: '2222000126',
      sector: 'market',
      stock: 30,
      isWeighted: true,
      unit: 'kg'
    },
    {
      id: 'mkt-9',
      tenantId: 'tenant-demo-1',
      name: 'Savon Artisanal Tidjikja Pack 4',
      nameAr: 'صابون تجكجة الطبيعي باقة 4',
      category: 'Hygiène & Entretien',
      brand: 'Tidjikja Savon',
      price: 35,
      costPrice: 22,
      image: 'savon_tidjikja',
      barcode: '2222000109',
      sector: 'market',
      stock: 75
    },
    {
      id: 'mkt-9b',
      tenantId: 'tenant-demo-1',
      name: 'Lessive OMO Poudre 500g',
      nameAr: 'مسحوق غسيل أومو 500غ',
      category: 'Hygiène & Entretien',
      brand: 'OMO',
      price: 50,
      costPrice: 38,
      image: 'omo_lessive',
      barcode: '2222000127',
      sector: 'market',
      stock: 80
    },

    // ARTICLES SANS CODE-BARRES (CAISSA.TN SANS CODE-BARRES)
    {
      id: 'mkt-nobarcode-1',
      tenantId: 'tenant-demo-1',
      name: 'Pain Baguette Frais Chaud du Jour',
      nameAr: 'خبز باقيت طازج وساخن',
      category: 'Sans Code-Barres',
      brand: 'Boulangerie Locale',
      price: 10,
      costPrice: 7,
      image: 'baguette',
      barcode: 'NOBAR-001',
      sector: 'market',
      stock: 250,
      hasNoBarcode: true
    },
    {
      id: 'mkt-nobarcode-2',
      tenantId: 'tenant-demo-1',
      name: 'Grand Sac Plastique Écologique',
      nameAr: 'كيس تسوق كبير متين',
      category: 'Sans Code-Barres',
      brand: 'Emballage',
      price: 5,
      costPrice: 2,
      image: 'sac_eco',
      barcode: 'NOBAR-002',
      sector: 'market',
      stock: 500,
      hasNoBarcode: true
    },
    {
      id: 'mkt-nobarcode-3',
      tenantId: 'tenant-demo-1',
      name: 'Recharge Télécom Mauritel 100 MRU',
      nameAr: 'رصيد موريتل 100 أوقية',
      category: 'Sans Code-Barres',
      brand: 'Mauritel',
      price: 100,
      costPrice: 95,
      image: 'recharge_mauritel',
      barcode: 'NOBAR-003',
      sector: 'market',
      stock: 200,
      hasNoBarcode: true
    },
    {
      id: 'mkt-nobarcode-4',
      tenantId: 'tenant-demo-1',
      name: 'Recharge Télécom Chinguitel 100 MRU',
      nameAr: 'رصيد شنقيتل 100 أوقية',
      category: 'Sans Code-Barres',
      brand: 'Chinguitel',
      price: 100,
      costPrice: 95,
      image: 'recharge_chinguitel',
      barcode: 'NOBAR-004',
      sector: 'market',
      stock: 200,
      hasNoBarcode: true
    },
    {
      id: 'mkt-nobarcode-5',
      tenantId: 'tenant-demo-1',
      name: 'Recharge Télécom Mattel 100 MRU',
      nameAr: 'رصيد ماتال 100 أوقية',
      category: 'Sans Code-Barres',
      brand: 'Mattel',
      price: 100,
      costPrice: 95,
      image: 'recharge_mattel',
      barcode: 'NOBAR-005',
      sector: 'market',
      stock: 200,
      hasNoBarcode: true
    }
  ];

  public orders: Order[] = [
    {
      id: 'order-seed-1',
      tenantId: 'tenant-demo-1',
      orderNumber: 'CMD-1082',
      items: [
        { productId: 'rest-1', productName: 'Riz au Poisson (Ceebu Jën / Thieb Rouge)', quantity: 2, unitPrice: 150, totalPrice: 300 },
        { productId: 'rest-7', productName: 'Jus de Bissap Frais Artisanal 50cl', quantity: 2, unitPrice: 40, totalPrice: 80 }
      ],
      subtotal: 380,
      discountAmount: 0,
      total: 380,
      paymentMethod: 'BANKILY',
      tableNumber: 'Table 2',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    },
    {
      id: 'order-seed-2',
      tenantId: 'tenant-demo-1',
      orderNumber: 'CMD-1083',
      items: [
        { productId: 'rest-2', productName: 'Chwaya Viande d\'Agneau Grillée', quantity: 1, unitPrice: 250, totalPrice: 250 },
        { productId: 'rest-6', productName: 'Thé Traditionnel Mauritanien (Atay 3 verres)', quantity: 1, unitPrice: 30, totalPrice: 30 }
      ],
      subtotal: 280,
      discountAmount: 0,
      total: 280,
      paymentMethod: 'MASRVI',
      tableNumber: 'Terrasse 1',
      createdAt: new Date(Date.now() - 3600000 * 3).toISOString()
    },
    {
      id: 'order-seed-3',
      tenantId: 'tenant-demo-1',
      orderNumber: 'CMD-1084',
      items: [
        { productId: 'rest-3', productName: 'Chwaya Viande de Chameau (Naga / Hwar)', quantity: 2, unitPrice: 220, totalPrice: 440 },
        { productId: 'rest-10', productName: 'Eau Minérale Benichab 1.5L', quantity: 2, unitPrice: 25, totalPrice: 50 }
      ],
      subtotal: 490,
      discountAmount: 49,
      total: 441,
      paymentMethod: 'ESPECES',
      cashGiven: 500,
      changeDue: 59,
      tableNumber: 'Salon VIP Tevragh',
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ];

  public kitchenOrders: KitchenOrder[] = [
    {
      id: 'KDS-101',
      orderId: 'order-seed-1',
      tableNumber: 'Table 1',
      time: '13:15 (Il y a 7 min)',
      status: 'en_preparation',
      items: [
        { name: 'Riz au Poisson (Ceebu Jën / Thieb Rouge)', quantity: 2, notes: 'Sans piment fort' },
        { name: 'Jus de Bissap Frais Artisanal 50cl', quantity: 2 }
      ]
    },
    {
      id: 'KDS-102',
      orderId: 'order-seed-2',
      tableNumber: 'Terrasse 3',
      time: '13:20 (Il y a 2 min)',
      status: 'en_attente',
      items: [
        { name: 'Chwaya Viande d\'Agneau Grillée', quantity: 1, notes: 'Bien cuite' },
        { name: 'Thé Mauritanien (Atay 3 verres)', quantity: 1 }
      ]
    }
  ];

  public kridiCustomers: KridiCustomer[] = [
    { id: 'c1', tenantId: 'tenant-demo-1', name: 'Cheikh Ould Sidi', phone: '+222 22 14 55 88', nni: '4892019482', address: 'Tevragh-Zeina, Nouakchott', creditLimit: 5000, currentDebt: 1450, lastPaymentDate: 'Il y a 3 jours', status: 'bon' },
    { id: 'c2', tenantId: 'tenant-demo-1', name: 'Fatimetou Mint Mohamed', phone: '+222 36 21 00 12', nni: '9102830192', address: 'Ksar, Nouakchott', creditLimit: 3500, currentDebt: 2100, lastPaymentDate: 'Il y a 14 jours', status: 'alerte' },
    { id: 'c3', tenantId: 'tenant-demo-1', name: 'Mohamed Lemine Ould Amar', phone: '+222 44 89 77 10', nni: '1290384729', address: 'Sebkha, Nouakchott', creditLimit: 8000, currentDebt: 7850, lastPaymentDate: 'Il y a 28 jours', status: 'critique' },
    { id: 'c4', tenantId: 'tenant-demo-1', name: 'Mariem Mint Cheikh', phone: '+222 26 50 11 99', nni: '8291048201', address: 'Arafat, Nouakchott', creditLimit: 4000, currentDebt: 600, lastPaymentDate: 'Hier', status: 'bon' }
  ];

  public cashMovements: CashMovement[] = [
    {
      id: 'cm-1',
      tenantId: 'tenant-demo-1',
      type: 'FLOAT_OPEN',
      amount: 2000,
      reason: 'Fond de caisse initial ouverture',
      cashierName: 'Sidi Mohamed (Patron)',
      createdAt: new Date(Date.now() - 3600000 * 8).toISOString()
    }
  ];
}

export const db = new DataStore();
