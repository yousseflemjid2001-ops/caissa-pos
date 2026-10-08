import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Configuration multilingue Français / Arabe pour tout le SaaS Caissa.mr
const resources = {
  fr: {
    translation: {
      nav: {
        home: "Vitrine",
        pos: "Caisse POS",
        tables: "Tables",
        kds: "Cuisine KDS",
        ventes: "Ventes",
        kridi: "Carnet Kridi",
        stock: "Gestion Stocks",
        dashboard: "Marges & Rentabilité",
        aiHub: "IA Agent",
        pricing: "Abonnement",
        gestion: "Back-Office",
        modules: "Modules",
        login: "Connexion",
        logout: "Déconnexion",
        language: "العربية",
        theme: "Thème",
        offline: "Hors-ligne",
        online: "Connecté Cloud"
      },
      hero: {
        badge: "La Solution POS Cloud & Caisse Tactile n°1 en Mauritanie",
        title_prefix: "La Caisse Enregistreuse Intelligente pour ",
        title_highlight: "Boutiques & Restaurants",
        arabic_subtitle: "أحسن نظام سحابي لتسيير المحلات، المطاعم ونقاط البيع في موريتانيا",
        start_trial: "Créer un Compte Restaurant (Essai 14j Gratuit)",
        start_trial_logged: "Accéder à ma Caisse Restaurant ➔",
        watch_demo: "Lancer la Démo Caisse (go.caissa.mr)",
        kridi_demo: "Découvrir le Carnet Kridi",
        rating: "4.9/5 plébiscité par +180 commerces et restaurants à Nouakchott & Nouadhibou"
      },
      landing: {
        features: "Fonctionnalités",
        sectors: "Secteurs",
        kridi: "الكريدي (Crédits)",
        pricing: "Tarifs",
        contact: "Support & Contact",
        login: "Se Connecter",
        register: "Créer un Compte (14j Gratuits)",
        open_pos: "Ouvrir ma Caisse ➔"
      },
      pos: {
        ticket_current: "Ticket en cours",
        total: "Net à Payer",
        order_total: "TOTAL COMMANDE",
        pay: "Encaisser",
        clear: "Vider le panier",
        hold: "Attente",
        recall: "Rappeler",
        search: "Rechercher un produit, code-barres...",
        scan: "Scanner Code-barres",
        kridi: "الكريدي (Crédit Client)",
        dine_in: "Sur Place",
        takeaway: "À Emporter",
        delivery: "Livraison",
        cash: "Espèces",
        banknotes: "Billets",
        exact: "Exact",
        received: "Reçu en caisse",
        change: "Rendu",
        subtotal: "Sous-total",
        discount: "Remise",
        delivery_fee: "Frais de livraison",
        free_item: "Article Libre",
        empty_cart: "Le panier est vide. Cliquez sur des articles pour encaisser."
      },
      common: {
        restaurant: "Restaurant & Grillades",
        market: "Boutique & Supérette",
        butcher: "Boucherie & Pesée",
        cosmetics: "Cosmétiques & Beauté",
        save: "Enregistrer",
        cancel: "Annuler",
        confirm: "Confirmer",
        close: "Fermer"
      }
    }
  },
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        pos: "نقطة البيع POS",
        tables: "الطاولات",
        kds: "شاشة المطبخ",
        ventes: "المبيعات",
        kridi: "دفتر الكريدي",
        stock: "إدارة المخزون",
        dashboard: "الأرباح والتقارير",
        aiHub: "المساعد الذكي",
        pricing: "الاشتراك",
        gestion: "لوحة التحكم",
        modules: "الوحدات",
        login: "تسجيل الدخول",
        logout: "تسجيل الخروج",
        language: "Français",
        theme: "المظهر",
        offline: "بدون إنترنت",
        online: "متصل سحابياً"
      },
      hero: {
        badge: "الحل السحابي ونقاط البيع الذكية رقم 1 في موريتانيا",
        title_prefix: "نظام الكاشير ونقاط البيع الذكي الخاص بـ ",
        title_highlight: "المحلات والمطاعم",
        arabic_subtitle: "أحسن نظام سحابي لتسيير المحلات، المطاعم ونقاط البيع في موريتانيا",
        start_trial: "إنشاء حساب مطعم (تجربة مجانية 14 يوم)",
        start_trial_logged: "الدخول إلى نقطة البيع الخاصة بي ➔",
        watch_demo: "تشغيل العرض التجريبي للنظام",
        kridi_demo: "اكتشف دفتر الكريدي",
        rating: "4.9/5 معتمد من طرف +180 متجر ومطعم في نواكشوط ونواذيبو"
      },
      landing: {
        features: "المميزات",
        sectors: "القطاعات",
        kridi: "دفتر الكريدي",
        pricing: "الأسعار",
        contact: "الدعم والتواصل",
        login: "تسجيل الدخول",
        register: "إنشاء حساب (14 يوم مجاناً)",
        open_pos: "فتح نقطة البيع ➔"
      },
      pos: {
        ticket_current: "الفاتورة الحالية",
        total: "المبلغ الصافي",
        order_total: "إجمالي الطلب",
        pay: "دفع",
        clear: "تفريغ السلة",
        hold: "تعليق الفاتورة",
        recall: "استرجاع",
        search: "بحث عن منتج، باركود...",
        scan: "مسح الباركود",
        kridi: "دفتر الكريدي (دين)",
        dine_in: "محلي (صالات)",
        takeaway: "سفري",
        delivery: "توصيل",
        cash: "نقداً (أوقية)",
        banknotes: "الأوراق النقدية",
        exact: "المبلغ بالضبط",
        received: "المستلم في الصندوق",
        change: "الباقي للزبون",
        subtotal: "المجموع الجزئي",
        discount: "الخصم",
        delivery_fee: "رسوم التوصيل",
        free_item: "منتج حر",
        empty_cart: "السلة فارغة. انقر على المنتجات لبدء البيع."
      },
      common: {
        restaurant: "مطاعم ومشاوي",
        market: "بقالة وميني ماركت",
        butcher: "ملحمة وميزان",
        cosmetics: "مستحضرات تجميل وعناية",
        save: "حفظ",
        cancel: "إلغاء",
        confirm: "تأكيد",
        close: "إغلاق"
      }
    }
  }
};

const savedLng = typeof window !== 'undefined' ? (localStorage.getItem('i18nextLng') || 'fr') : 'fr';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLng.startsWith('ar') ? 'ar' : 'fr',
    fallbackLng: 'fr',
    interpolation: {
      escapeValue: false
    }
  });

// Synchroniser automatiquement l'attribut dir et lang du document HTML
if (typeof document !== 'undefined') {
  document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = i18n.language;

  i18n.on('languageChanged', (lng) => {
    document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lng;
    try {
      localStorage.setItem('i18nextLng', lng);
    } catch {}
  });
}

export default i18n;
