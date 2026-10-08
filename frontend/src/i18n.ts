import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Définition des traductions (FR / AR)
const resources = {
  fr: {
    translation: {
      nav: {
        home: "Accueil",
        pos: "Caisse POS",
        kridi: "Carnet Kridi",
        stock: "Gestion Stocks",
        dashboard: "Marges & Rentabilité",
        kds: "Cuisine KDS",
        aiHub: "IA Agent",
        pricing: "Abonnement",
        gestion: "Back-Office",
        login: "Connexion",
        logout: "Déconnexion",
        language: "العربية"
      },
      hero: {
        title: "Le Système de Caisse N°1 en Mauritanie",
        subtitle: "Gérez votre commerce, suivez vos stocks et encaisssez vos clients en un clin d'œil avec notre solution SaaS certifiée RIM.",
        start_trial: "Démarrer Essai Gratuit (14j)",
        watch_demo: "Voir Démo Interactive",
        made_for: "Conçu spécialement pour : Boutiques, Restaurants, Boucheries et Parapharmacies."
      },
      pos: {
        total: "Total",
        pay: "Encaisser",
        clear: "Vider",
        search: "Rechercher...",
        scan: "Scanner Code-barres",
        kridi: "Kridi (Crédit)"
      },
      common: {
        restaurant: "Restaurant & Grillades",
        market: "Boutique & Supérette",
        butcher: "Boucherie & Pesée",
        cosmetics: "Cosmétiques & Beauté"
      }
    }
  },
  ar: {
    translation: {
      nav: {
        home: "الرئيسية",
        pos: "نقطة البيع POS",
        kridi: "دفتر الكريدي",
        stock: "إدارة المخزون",
        dashboard: "الأرباح والتقارير",
        kds: "شاشة المطبخ",
        aiHub: "المساعد الذكي",
        pricing: "الاشتراك",
        gestion: "لوحة التحكم",
        login: "تسجيل الدخول",
        logout: "تسجيل الخروج",
        language: "Français"
      },
      hero: {
        title: "نظام نقاط البيع رقم 1 في موريتانيا",
        subtitle: "أدر متجرك، تتبع مخزونك وحاسب زبائنك في لمح البصر مع نظامنا السحابي المعتمد في موريتانيا.",
        start_trial: "ابدأ التجربة المجانية (14 يوم)",
        watch_demo: "شاهد العرض التفاعلي",
        made_for: "مصمم خصيصاً لـ: المتاجر، المطاعم، الملاحم والصيدليات شبه الطبية."
      },
      pos: {
        total: "المجموع",
        pay: "دفع",
        clear: "تفريغ",
        search: "بحث...",
        scan: "مسح الباركود",
        kridi: "الكريدي (دين)"
      },
      common: {
        restaurant: "مطعم ومشاوي",
        market: "بقالة وميني ماركت",
        butcher: "ملحمة وميزان",
        cosmetics: "مستحضرات تجميل وعناية"
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "fr", // Langue par défaut
    fallbackLng: "fr",
    interpolation: {
      escapeValue: false // React s'occupe de l'échappement XSS
    }
  });

export default i18n;
