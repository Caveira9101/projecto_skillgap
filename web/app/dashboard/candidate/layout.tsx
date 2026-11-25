'use client';

import React, { useState, useEffect, createContext, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  User,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Search,
  Target,
  TrendingUp,
  Building2,
  Send,
  Sparkles,
  Compass,
  Bell,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
  Globe,
  ShieldCheck
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';

export type PlanTier = 'free' | 'normal' | 'advanced';
export type BillingCurrency = 'EUR' | 'USD';

export interface CandidateSessionProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
  planTier: PlanTier;
  planName: string;
  currency: BillingCurrency;
  isPaidPlan: boolean;
  hasAiAccess: boolean;
  unlimitedInterviews: boolean;
  unreadNotifications: number;
}

const CANDIDATE_TRANSLATIONS: Record<string, any> = {
  en: {
    roleBadge: "Professional Candidate",
    mainMenu: "Main Menu",
    accountMenu: "Account & System",
    greeting: "Welcome",
    greetingSub: "Manage your profile, skills, and job applications in real time.",
    nav: {
      dashboard: "Main Dashboard",
      profile: "My Profile",
      education: "Education",
      experience: "Experience",
      skills: "Skills",
      cv: "CV & Documents",
      opportunities: "Opportunities",
      matching: "Matching Score",
      skillGap: "Skill Gap",
      companies: "Companies",
      applications: "Applications",
      aiAssistant: "AI Assistant",
      development: "Development",
      messages: "Messages",
      subscription: "Subscription",
      settings: "Settings",
      logout: "Sign Out"
    },
    overview: {
      profileComplete: "Profile Completion",
      profileReady: "Active Profile",
      profileIncomplete: "Complete Your Profile",
      compatibleJobs: "Compatible Jobs",
      compatibleSub: "Available",
      compatibleDesc: "Based on your verified skills",
      profileViews: "Profile Views",
      viewsSub: "Total",
      viewsDesc: "Companies that viewed your profile",
      savedJobs: "Saved Jobs",
      savedSub: "Bookmarked",
      savedDesc: "Opportunities saved for later",
      bestMatchLabel: "Top Job Match",
      bestMatchBadge: "Match",
      compatibilityBreakdown: "Overall Compatibility",
      overallScore: "Score",
      viewDetailedAnalysis: "View Detailed Analysis",
      recentActivity: "Recent Activity",
      noActivityTitle: "No recent activity yet",
      noActivitySub: "Complete your profile and apply to jobs to see updates here.",
      noMatchTitle: "No job matches calculated yet",
      noMatchDesc: "Add your education, skills, and CV so SkillGap AI can match you with open positions."
    },
    aiPanel: {
      title: "SkillGap AI Career Insights",
      status: "AI Ready",
      emptyInsight: "Complete your profile and upload your CV to receive personalized AI career insights."
    },
    profile: {
      myProfile: "My Profile",
      personalData: "PERSONAL DATA",
      location: "LOCATION",
      availability: "AVAILABILITY",
      visibility: "VISIBILITY",
      profileStatus: "PROFILE STATUS",
      fullName: "Full Name",
      email: "Email",
      phone: "Phone",
      residence: "Residence",
      notProvided: "Not provided"
    },
    planCard: {
      label: "Current Plan",
      freePlan: "Free Plan • 3 interviews",
      normalPlan: "Normal Plan • Unlimited interviews",
      advancedPlan: "Advanced Plan • Full AI & Unlimited",
      manage: "Manage Subscription",
      supportPaid: "Priority Support (Settings)",
      supportLocked: "Support available on paid plans"
    }
  },
  pt: {
    roleBadge: "Candidato Profissional",
    mainMenu: "Menu Principal",
    accountMenu: "Conta & Sistema",
    greeting: "Bem-vindo(a)",
    greetingSub: "Gere o teu perfil, competências e candidaturas em tempo real.",
    nav: {
      dashboard: "Painel Principal",
      profile: "O meu Perfil",
      education: "Educação",
      experience: "Experiência",
      skills: "Competências",
      cv: "CV & Documentos",
      opportunities: "Oportunidades",
      matching: "Pontuação de Match",
      skillGap: "Lacuna de Competências",
      companies: "Empresas",
      applications: "Candidaturas",
      aiAssistant: "Assistente IA",
      development: "Desenvolvimento",
      messages: "Mensagens",
      subscription: "Subscrição",
      settings: "Definições",
      logout: "Sair"
    },
    overview: {
      profileComplete: "Conclusão do Perfil",
      profileReady: "Perfil Ativo",
      profileIncomplete: "Completa o teu Perfil",
      compatibleJobs: "Vagas Compatíveis",
      compatibleSub: "Disponíveis",
      compatibleDesc: "Com base nas tuas competências",
      profileViews: "Visualizações",
      viewsSub: "Total",
      viewsDesc: "Empresas que viram o teu perfil",
      savedJobs: "Vagas Guardadas",
      savedSub: "Favoritos",
      savedDesc: "Oportunidades guardadas",
      bestMatchLabel: "Melhor Compatibilidade",
      bestMatchBadge: "Match",
      compatibilityBreakdown: "Compatibilidade Geral",
      overallScore: "Pontuação",
      viewDetailedAnalysis: "Ver Análise Detalhada",
      recentActivity: "Atividade Recente",
      noActivityTitle: "Sem atividade recente",
      noActivitySub: "Completa o teu perfil e candidata-te a vagas para veres atualizações aqui.",
      noMatchTitle: "Ainda sem correspondências calculadas",
      noMatchDesc: "Adiciona a tua formação, competências e CV para a IA encontrar vagas compatíveis."
    },
    aiPanel: {
      title: "Insights de Carreira IA SkillGap",
      status: "IA Pronta",
      emptyInsight: "Completa o teu perfil e carrega o teu CV para receberes recomendações personalizadas de IA."
    },
    profile: {
      myProfile: "O meu Perfil",
      personalData: "DADOS PESSOAIS",
      location: "LOCALIZAÇÃO",
      availability: "DISPONIBILIDADE",
      visibility: "VISIBILIDADE",
      profileStatus: "ESTADO DO PERFIL",
      fullName: "Nome Completo",
      email: "E-mail",
      phone: "Telefone",
      residence: "Residência",
      notProvided: "Não preenchido"
    },
    planCard: {
      label: "Plano Atual",
      freePlan: "Plano Grátis • 3 entrevistas",
      normalPlan: "Plano Normal • Entrevistas ilimitadas",
      advancedPlan: "Plano Avançado • IA Completa & Ilimitado",
      manage: "Gerir Subscrição",
      supportPaid: "Suporte Prioritário (Definições)",
      supportLocked: "Suporte disponível em planos pagos"
    }
  },
  es: {
    roleBadge: "Candidato Profesional",
    mainMenu: "Menú Principal",
    accountMenu: "Cuenta y Sistema",
    greeting: "Bienvenido(a)",
    greetingSub: "Gestiona tu perfil, habilidades y postulaciones en tiempo real.",
    nav: {
      dashboard: "Panel Principal",
      profile: "Mi Perfil",
      education: "Educación",
      experience: "Experiencia",
      skills: "Habilidades",
      cv: "CV y Documentos",
      opportunities: "Oportunidades",
      matching: "Puntuación de Match",
      skillGap: "Brecha de Habilidades",
      companies: "Empresas",
      applications: "Postulaciones",
      aiAssistant: "Asistente IA",
      development: "Desarrollo",
      messages: "Mensajes",
      subscription: "Suscripción",
      settings: "Ajustes",
      logout: "Cerrar Sesión"
    },
    overview: {
      profileComplete: "Perfil Completado",
      profileReady: "Perfil Activo",
      profileIncomplete: "Completa tu Perfil",
      compatibleJobs: "Vacantes Compatibles",
      compatibleSub: "Disponibles",
      compatibleDesc: "Basado en tus habilidades",
      profileViews: "Vistas del Perfil",
      viewsSub: "Total",
      viewsDesc: "Empresas que vieron tu perfil",
      savedJobs: "Vacantes Guardadas",
      savedSub: "Favoritos",
      savedDesc: "Oportunidades guardadas",
      bestMatchLabel: "Mejor Coincidencia",
      bestMatchBadge: "Match",
      compatibilityBreakdown: "Compatibilidad General",
      overallScore: "Puntuación",
      viewDetailedAnalysis: "Ver Análisis Detallado",
      recentActivity: "Actividad Reciente",
      noActivityTitle: "Sin actividad reciente",
      noActivitySub: "Completa tu perfil y postúlate a vacantes para ver actualizaciones aquí.",
      noMatchTitle: "Aún sin coincidencias calculadas",
      noMatchDesc: "Añade tu formación, habilidades y CV para que la IA encuentre vacantes compatibles."
    },
    aiPanel: {
      title: "Perspectivas de Carrera IA SkillGap",
      status: "IA Lista",
      emptyInsight: "Completa tu perfil y sube tu CV para recibir recomendaciones personalizadas de IA."
    },
    profile: {
      myProfile: "Mi Perfil",
      personalData: "DATOS PERSONALES",
      location: "UBICACIÓN",
      availability: "DISPONIBILIDAD",
      visibility: "VISIBILIDAD",
      profileStatus: "ESTADO DEL PERFIL",
      fullName: "Nombre Completo",
      email: "Correo",
      phone: "Teléfono",
      residence: "Residencia",
      notProvided: "No proporcionado"
    },
    planCard: {
      label: "Plan Actual",
      freePlan: "Plan Gratis • 3 entrevistas",
      normalPlan: "Plan Normal • Entrevistas ilimitadas",
      advancedPlan: "Plan Avanzado • IA Completa e Ilimitado",
      manage: "Gestionar Suscripción",
      supportPaid: "Soporte Prioritario (Ajustes)",
      supportLocked: "Soporte disponible en planes de pago"
    }
  },
  fr: {
    roleBadge: "Candidat Professionnel",
    mainMenu: "Menu Principal",
    accountMenu: "Compte & Système",
    greeting: "Bienvenue",
    greetingSub: "Gérez votre profil, vos compétences et vos candidatures en temps réel.",
    nav: {
      dashboard: "Tableau de Bord",
      profile: "Mon Profil",
      education: "Éducation",
      experience: "Expérience",
      skills: "Compétences",
      cv: "CV & Documents",
      opportunities: "Opportunités",
      matching: "Score de Correspondance",
      skillGap: "Écart de Compétences",
      companies: "Entreprises",
      applications: "Candidatures",
      aiAssistant: "Assistant IA",
      development: "Développement",
      messages: "Messages",
      subscription: "Abonnement",
      settings: "Paramètres",
      logout: "Se Déconnecter"
    },
    overview: {
      profileComplete: "Profil Complété",
      profileReady: "Profil Actif",
      profileIncomplete: "Complétez votre Profil",
      compatibleJobs: "Offres Compatibles",
      compatibleSub: "Disponibles",
      compatibleDesc: "Selon vos compétences vérifiées",
      profileViews: "Vues du Profil",
      viewsSub: "Total",
      viewsDesc: "Entreprises ayant consulté votre profil",
      savedJobs: "Offres Sauvegardées",
      savedSub: "Favoris",
      savedDesc: "Opportunités enregistrées",
      bestMatchLabel: "Meilleure Correspondance",
      bestMatchBadge: "Match",
      compatibilityBreakdown: "Compatibilité Globale",
      overallScore: "Score",
      viewDetailedAnalysis: "Voir l'Analyse Détaillée",
      recentActivity: "Activité Récente",
      noActivityTitle: "Aucune activité récente",
      noActivitySub: "Complétez votre profil et postulez aux offres pour voir les mises à jour ici.",
      noMatchTitle: "Aucune correspondance calculée",
      noMatchDesc: "Ajoutez votre formation, vos compétences et votre CV pour obtenir des recommandations IA."
    },
    aiPanel: {
      title: "Analyses de Carrière IA SkillGap",
      status: "IA Prête",
      emptyInsight: "Complétez votre profil et téléchargez votre CV pour recevoir des conseils personnalisés."
    },
    profile: {
      myProfile: "Mon Profil",
      personalData: "DONNÉES PERSONNELLES",
      location: "LOCALISATION",
      availability: "DISPONIBILITÉ",
      visibility: "VISIBILITÉ",
      profileStatus: "STATUT DU PROFIL",
      fullName: "Nom Complet",
      email: "E-mail",
      phone: "Téléphone",
      residence: "Résidence",
      notProvided: "Non renseigné"
    },
    planCard: {
      label: "Offre Actuelle",
      freePlan: "Offre Gratuite • 3 entretiens",
      normalPlan: "Offre Normal • Entretiens illimités",
      advancedPlan: "Offre Avancé • IA Complète & Illimité",
      manage: "Gérer l'abonnement",
      supportPaid: "Support Prioritaire (Paramètres)",
      supportLocked: "Support réservé aux offres payantes"
    }
  },
  de: {
    roleBadge: "Professioneller Kandidat",
    mainMenu: "Hauptmenü",
    accountMenu: "Konto & System",
    greeting: "Willkommen",
    greetingSub: "Verwalten Sie Ihr Profil, Ihre Fähigkeiten und Bewerbungen in Echtzeit.",
    nav: {
      dashboard: "Haupt-Dashboard",
      profile: "Mein Profil",
      education: "Bildung",
      experience: "Erfahrung",
      skills: "Fähigkeiten",
      cv: "CV & Dokumente",
      opportunities: "Stellenangebote",
      matching: "Matching-Score",
      skillGap: "Kompetenzlücke",
      companies: "Unternehmen",
      applications: "Bewerbungen",
      aiAssistant: "KI-Assistent",
      development: "Entwicklung",
      messages: "Nachrichten",
      subscription: "Abonnement",
      settings: "Einstellungen",
      logout: "Abmelden"
    },
    overview: {
      profileComplete: "Profil Vollständig",
      profileReady: "Aktives Profil",
      profileIncomplete: "Profil vervollständigen",
      compatibleJobs: "Passende Stellen",
      compatibleSub: "Verfügbar",
      compatibleDesc: "Basierend auf Ihren Fähigkeiten",
      profileViews: "Profilaufrufe",
      viewsSub: "Gesamt",
      viewsDesc: "Unternehmen, die Ihr Profil angesehen haben",
      savedJobs: "Gespeicherte Stellen",
      savedSub: "Merkliste",
      savedDesc: "Für später gespeicherte Stellen",
      bestMatchLabel: "Beste Übereinstimmung",
      bestMatchBadge: "Match",
      compatibilityBreakdown: "Gesamtkompatibilität",
      overallScore: "Bewertung",
      viewDetailedAnalysis: "Detaillierte Analyse ansehen",
      recentActivity: "Letzte Aktivitäten",
      noActivityTitle: "Noch keine aktuellen Aktivitäten",
      noActivitySub: "Vervollständigen Sie Ihr Profil und bewerben Sie sich, um Updates zu sehen.",
      noMatchTitle: "Noch keine Job-Matches berechnet",
      noMatchDesc: "Fügen Sie Ausbildung, Fähigkeiten und Lebenslauf hinzu, damit die KI passende Stellen findet."
    },
    aiPanel: {
      title: "SkillGap KI-Karriere-Einblicke",
      status: "KI Bereit",
      emptyInsight: "Vervollständigen Sie Ihr Profil und laden Sie Ihren Lebenslauf hoch, um KI-Empfehlungen zu erhalten."
    },
    profile: {
      myProfile: "Mein Profil",
      personalData: "PERSÖNLICHE DATEN",
      location: "STANDORT",
      availability: "VERFÜGBARKEIT",
      visibility: "SICHTBARKEIT",
      profileStatus: "PROFILSTATUS",
      fullName: "Vollständiger Name",
      email: "E-Mail",
      phone: "Telefon",
      residence: "Wohnsitz",
      notProvided: "Nicht angegeben"
    },
    planCard: {
      label: "Aktueller Tarif",
      freePlan: "Gratisplan • 3 Interviews",
      normalPlan: "Normalplan • Unbegrenzte Interviews",
      advancedPlan: "Erweitert • Volle KI & Unbegrenzt",
      manage: "Abonnement verwalten",
      supportPaid: "Prioritäts-Support (Einstellungen)",
      supportLocked: "Support nur in Bezahltarifen verfügbar"
    }
  },
  ar: {
    roleBadge: "مرشح محترف",
    mainMenu: "القائمة الرئيسية",
    accountMenu: "الحساب والنظام",
    greeting: "مرحباً",
    greetingSub: "أدر ملفك الشخصي ومهاراتك وطلبات التوظيف في الوقت الفعلي.",
    nav: {
      dashboard: "لوحة التحكم الرئيسية",
      profile: "ملفي الشخصي",
      education: "التعليم",
      experience: "الخبرة المهنية",
      skills: "المهارات",
      cv: "السيرة الذاتية والمستندات",
      opportunities: "الفرص الوظيفية",
      matching: "نسبة التطابق",
      skillGap: "فجوة المهارات",
      companies: "الشركات",
      applications: "طلبات التوظيف",
      aiAssistant: "مساعد الذكاء الاصطناعي",
      development: "التطوير المهني",
      messages: "الرسائل",
      subscription: "الاشتراك",
      settings: "الإعدادات",
      logout: "تسجيل الخروج"
    },
    overview: {
      profileComplete: "اكتمال الملف الشخصي",
      profileReady: "ملف نشط",
      profileIncomplete: "أكمل ملفك الشخصي",
      compatibleJobs: "الوظائف المتوافقة",
      compatibleSub: "متاحة",
      compatibleDesc: "بناءً على مهاراتك المعتمدة",
      profileViews: "مشاهدات الملف",
      viewsSub: "الإجمالي",
      viewsDesc: "الشركات التي شاهدت ملفك",
      savedJobs: "الوظائف المحفوظة",
      savedSub: "المفضلة",
      savedDesc: "فرص محفوظة لوقت لاحق",
      bestMatchLabel: "أفضل تطابق وظيفي",
      bestMatchBadge: "تطابق",
      compatibilityBreakdown: "التوافق العام",
      overallScore: "النتيجة",
      viewDetailedAnalysis: "عرض التحليل التفصيلي",
      recentActivity: "النشاط الأخير",
      noActivityTitle: "لا يوجد نشاط حديث بعد",
      noActivitySub: "أكمل ملفك الشخصي وتقدم للوظائف لعرض التحديثات هنا.",
      noMatchTitle: "لم يتم حساب أي تطابقات وظيفية بعد",
      noMatchDesc: "أضف تعليمك ومهاراتك وسيرتك الذاتية ليتمكن الذكاء الاصطناعي من مطابقتك مع الوظائف."
    },
    aiPanel: {
      title: "رؤى المسار المهني بالذكاء الاصطناعي SkillGap",
      status: "الذكاء الاصطناعي جاهز",
      emptyInsight: "أكمل ملفك الشخصي وارفع سيرتك الذاتية للحصول على توصيات مهنية مخصصة."
    },
    profile: {
      myProfile: "ملفي الشخصي",
      personalData: "البيانات الشخصية",
      location: "الموقع",
      availability: "التوفر",
      visibility: "الخصوصية والظهور",
      profileStatus: "حالة الملف الشخصي",
      fullName: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      residence: "مكان الإقامة",
      notProvided: "غير محدد"
    },
    planCard: {
      label: "الخطة الحالية",
      freePlan: "الباقة المجانية • 3 مقابلات",
      normalPlan: "باقة عادية • مقابلات غير محدودة",
      advancedPlan: "باقة متقدمة • ذكاء اصطناعي كامل وغير محدود",
      manage: "إدارة الاشتراك",
      supportPaid: "الدعم ذو الأولوية (الإعدادات)",
      supportLocked: "الدعم متاح في الخطط المدفوعة"
    }
  }
};

interface DashboardLangContextType {
  lang: string;
  setLang: (lang: string) => void;
  isRtl: boolean;
  t: any;
  candidate: CandidateSessionProfile | null;
  refreshCandidate: () => Promise<void>;
}

const DashboardLangContext = createContext<DashboardLangContextType>({
  lang: 'en',
  setLang: () => {},
  isRtl: false,
  t: CANDIDATE_TRANSLATIONS['en'],
  candidate: null,
  refreshCandidate: async () => {},
});

export const useDashboardLang = () => useContext(DashboardLangContext);

const LANGUAGES = [
  { code: 'en', label: 'English (EN)' },
  { code: 'pt', label: 'Português (PT)' },
  { code: 'es', label: 'Español (ES)' },
  { code: 'fr', label: 'Français (FR)' },
  { code: 'de', label: 'Deutsch (DE)' },
  { code: 'ar', label: 'العربية (AR)' },
];

export default function CandidateDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lang, setLang] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [candidate, setCandidate] = useState<CandidateSessionProfile | null>(null);
  const pathname = usePathname();
  const t = CANDIDATE_TRANSLATIONS[lang] || CANDIDATE_TRANSLATIONS['en'];
  const isRtl = lang === 'ar';

  const refreshCandidate = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) {
        setCandidate(null);
        return;
      }

      const { data: profileData } = await supabase
        .from('individual_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: subData } = await supabase
        .from('candidate_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      const { count: unreadCount } = await supabase
        .from('notifications')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false);

      const rawTier = subData?.plan_tier || profileData?.plan_tier || 'free';
      const planTier: PlanTier =
        rawTier === 'advanced' || rawTier === 'normal' ? rawTier : 'free';
      const currency: BillingCurrency = subData?.currency === 'USD' ? 'USD' : 'EUR';
      const isPaidPlan = planTier !== 'free';
      const hasAiAccess = planTier === 'advanced';
      const unlimitedInterviews = planTier === 'normal' || planTier === 'advanced';

      setCandidate({
        id: user.id,
        fullName:
          profileData?.full_name ||
          user.user_metadata?.full_name ||
          user.email?.split('@')[0] ||
          '',
        email: user.email || '',
        avatarUrl: profileData?.avatar_url || user.user_metadata?.avatar_url || null,
        planTier,
        planName: planTier,
        currency,
        isPaidPlan,
        hasAiAccess,
        unlimitedInterviews,
        unreadNotifications: unreadCount || 0,
      });
    } catch {
      setCandidate(null);
    }
  };

  useEffect(() => {
    refreshCandidate();
  }, [pathname]);

  const mainNavItems = [
    { href: '/dashboard/candidate', label: t.nav.dashboard, icon: LayoutDashboard },
    { href: '/dashboard/candidate/profile', label: t.nav.profile, icon: User },
    { href: '/dashboard/candidate/education', label: t.nav.education, icon: GraduationCap },
    { href: '/dashboard/candidate/experience', label: t.nav.experience, icon: Briefcase },
    { href: '/dashboard/candidate/skills', label: t.nav.skills, icon: Award },
    { href: '/dashboard/candidate/cv', label: t.nav.cv, icon: FileText },
    { href: '/dashboard/candidate/opportunities', label: t.nav.opportunities, icon: Search },
    { href: '/dashboard/candidate/matching', label: t.nav.matching, icon: Target },
    { href: '/dashboard/candidate/skill-gap', label: t.nav.skillGap, icon: TrendingUp },
    { href: '/dashboard/candidate/companies', label: t.nav.companies, icon: Building2 },
    { href: '/dashboard/candidate/applications', label: t.nav.applications, icon: Send },
    { href: '/dashboard/candidate/ai-assistant', label: t.nav.aiAssistant, icon: Sparkles, highlight: true },
    { href: '/dashboard/candidate/development', label: t.nav.development, icon: Compass },
    {
      href: '/dashboard/candidate/messages',
      label: t.nav.messages,
      icon: Bell,
      badge: candidate && candidate.unreadNotifications > 0 ? String(candidate.unreadNotifications) : undefined,
    },
  ];

  const accountNavItems = [
    { href: '/dashboard/candidate/subscriptions', label: t.nav.subscription, icon: CreditCard },
    { href: '/dashboard/candidate/settings', label: t.nav.settings, icon: Settings },
  ];

  const isActive = (href: string) => pathname === href;

  const planSummaryText =
    candidate?.planTier === 'advanced'
      ? t.planCard.advancedPlan
      : candidate?.planTier === 'normal'
      ? t.planCard.normalPlan
      : t.planCard.freePlan;

  return (
    <DashboardLangContext.Provider value={{ lang, setLang, isRtl, t, candidate, refreshCandidate }}>
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        lang={lang}
        className="min-h-screen bg-[#07030e] text-white flex font-sans selection:bg-purple-600 selection:text-white"
      >
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <aside
          className={`fixed lg:static inset-y-0 ${isRtl ? 'right-0 border-l' : 'left-0 border-r'} z-50 w-72 bg-[#0c0716] border-purple-900/30 flex flex-col transition-transform duration-300 ease-in-out ${
            mobileMenuOpen
              ? 'translate-x-0'
              : isRtl
              ? 'translate-x-full lg:translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div className="p-6 border-b border-purple-900/30 flex items-center justify-between">
            <Link href={`/?lang=${lang}`} className="flex items-center gap-3">
              <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-xl bg-purple-950/40 border border-purple-500/40 shadow-lg shadow-purple-900/50 p-1">
                <Image
                  src="/images/logo-icon.png"
                  alt="Logotipo SkillGap"
                  width={40}
                  height={40}
                  priority
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <span className="text-lg font-extrabold tracking-wider block leading-none bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
                  SKILLGAP
                </span>
                <span className="text-[10px] font-semibold tracking-widest text-purple-400 uppercase mt-1 block">
                  {t.roleBadge}
                </span>
              </div>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 scrollbar-thin scrollbar-thumb-purple-900/50">
            <div>
              <p className="px-3 text-[11px] font-bold tracking-wider text-gray-500 uppercase mb-3">
                {t.mainMenu}
              </p>
              <nav className="space-y-1">
                {mainNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? 'bg-gradient-to-r from-purple-600/25 to-indigo-600/15 text-white border border-purple-500/40 shadow-sm'
                          : item.highlight
                          ? 'text-purple-300 hover:bg-purple-950/40 hover:text-white'
                          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon
                          className={`w-4 h-4 ${
                            active
                              ? 'text-purple-400'
                              : item.highlight
                              ? 'text-fuchsia-400'
                              : 'text-gray-500'
                          }`}
                        />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-600 text-white">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-purple-900/30">
              <p className="px-3 text-[11px] font-bold tracking-wider text-gray-500 uppercase mb-3">
                {t.accountMenu}
              </p>
              <nav className="space-y-1">
                {accountNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        active
                          ? 'bg-purple-600/20 text-white border border-purple-500/40'
                          : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${active ? 'text-purple-400' : 'text-gray-500'}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
                <button
                  type="button"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    window.location.href = `/?lang=${lang}`;
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400/80 hover:bg-red-950/30 hover:text-red-300 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t.nav.logout}</span>
                </button>
              </nav>
            </div>
          </div>

          <div className="p-4 border-t border-purple-900/30">
            <div className="p-3.5 rounded-xl bg-gradient-to-br from-purple-950/60 to-indigo-950/40 border border-purple-500/25 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold tracking-wider text-purple-300 uppercase">
                  {t.planCard.label}
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs font-semibold text-emerald-400">
                {planSummaryText}
              </p>
              <Link
                href="/dashboard/candidate/subscriptions"
                className="block text-center py-1.5 px-3 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 text-xs font-medium text-white transition"
              >
                {t.planCard.manage}
              </Link>
              {candidate?.isPaidPlan ? (
                <Link
                  href="/dashboard/candidate/settings#support"
                  className="block text-center py-1.5 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/35 border border-emerald-500/30 text-[11px] font-medium text-emerald-300 transition"
                >
                  {t.planCard.supportPaid}
                </Link>
              ) : (
                <p className="text-[10px] text-gray-400 text-center pt-0.5">
                  {t.planCard.supportLocked}
                </p>
              )}
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 bg-[#07030e]/85 backdrop-blur-md border-b border-purple-900/30 px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>

              {candidate?.avatarUrl ? (
                <img
                  src={candidate.avatarUrl}
                  alt={candidate.fullName}
                  className="w-9 h-9 rounded-full object-cover border border-purple-500/40"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-purple-950 border border-purple-500/30 flex items-center justify-center text-purple-300">
                  <User className="w-4 h-4" />
                </div>
              )}

              <div>
                <p className="text-sm font-semibold text-white">
                  {t.greeting}
                  {candidate?.fullName ? (
                    <>
                      , <span className="text-purple-400">{candidate.fullName}</span>!
                    </>
                  ) : (
                    '!'
                  )}
                </p>
                <p className="text-xs text-gray-400 hidden sm:block">
                  {t.greetingSub}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-white/5 border border-purple-500/20 rounded-xl px-2.5 py-1.5">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <select
                  value={lang}
                  onChange={(e) => setLang(e.target.value)}
                  className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#0c0716] text-white">
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <Link
                href="/dashboard/candidate/messages"
                className="relative p-2 rounded-xl bg-white/5 border border-purple-500/20 text-gray-300 hover:text-white hover:border-purple-500/40 transition"
              >
                <Bell className="w-4 h-4" />
                {candidate && candidate.unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-purple-500" />
                )}
              </Link>
            </div>
          </header>

          <main className="flex-1 p-6 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>
    </DashboardLangContext.Provider>
  );
}