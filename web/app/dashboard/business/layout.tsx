'use client';

import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Search,
  LayoutGrid,
  Users,
  Briefcase,
  Calendar,
  Bookmark,
  BarChart3,
  CreditCard,
  Settings,
  Building2,
  Bell,
  ChevronDown,
  Menu,
  X,
  Globe,
  LogOut,
  Sparkles
} from 'lucide-react';
import {
  supabase,
  fetchActiveCompanySubscription,
  type LangCode,
  type B2BPlanConfig
} from '@/lib/business-supabase';

const BUSINESS_TRANSLATIONS: Record<LangCode, any> = {
  en: {
    accountSub: 'Company Account',
    planLabel: 'Plan',
    nav: {
      findTalent: 'Find Talent',
      overview: 'Overview',
      companyProfile: 'Company Profile',
      candidates: 'Candidates',
      jobPositions: 'Job Positions',
      interviews: 'Interviews',
      shortlisted: 'Shortlisted',
      analytics: 'Analytics',
      skillgapAi: 'SkillGap AI',
      teamManagement: 'Team Management',
      subscription: 'Subscription',
      settings: 'Settings',
      signOut: 'Sign Out'
    },
    findTalentPage: {
      pill: 'AI-POWERED RECRUITMENT',
      titlePrefix: 'Find the right talent with',
      titleHighlight: 'AI.',
      subtitle: 'Describe the professional you are looking for, or use filters to get instant AI-recommended candidates.',
      promptPlaceholder: 'Describe the employee you are looking for...',
      promptExample: 'e.g. "I need 20 Account Managers in Germany with 3+ years of experience and strong sales skills."',
      addRequirements: 'Add requirements',
      aiBrandBadge: 'SkillGap AI',
      findMatches: 'Find AI Matches',
      orFilters: 'Or use manual filters',
      filters: ['Job Title', 'Skills', 'Experience', 'Location', 'Languages', 'Education']
    }
  },
  pt: {
    accountSub: 'Conta Empresarial',
    planLabel: 'Plano',
    nav: {
      findTalent: 'Encontrar Talento',
      overview: 'Visão Geral',
      companyProfile: 'Perfil da Empresa',
      candidates: 'Candidatos',
      jobPositions: 'Vagas',
      interviews: 'Entrevistas',
      shortlisted: 'Pré-Selecionados',
      analytics: 'Estatísticas',
      skillgapAi: 'SkillGap AI',
      teamManagement: 'Gestão de Equipa',
      subscription: 'Subscrição',
      settings: 'Definições',
      signOut: 'Terminar Sessão'
    },
    findTalentPage: {
      pill: 'RECRUTAMENTO POTENCIADO POR IA',
      titlePrefix: 'Encontra o talento certo com',
      titleHighlight: 'IA.',
      subtitle: 'Descreve o profissional que procuras ou usa filtros para obter candidatos recomendados por IA na hora.',
      promptPlaceholder: 'Descreve o colaborador que estás a procurar...',
      promptExample: 'ex: "Preciso de 20 Gestores de Conta na Alemanha com 3+ anos de experiência e fortes competências comerciais."',
      addRequirements: 'Adicionar requisitos',
      aiBrandBadge: 'SkillGap AI',
      findMatches: 'Encontrar Matches IA',
      orFilters: 'Ou usa filtros manuais',
      filters: ['Cargo', 'Competências', 'Experiência', 'Localização', 'Idiomas', 'Educação']
    }
  },
  es: {
    accountSub: 'Cuenta de Empresa',
    planLabel: 'Plan',
    nav: {
      findTalent: 'Buscar Talento',
      overview: 'Resumen',
      companyProfile: 'Perfil de Empresa',
      candidates: 'Candidatos',
      jobPositions: 'Puestos',
      interviews: 'Entrevistas',
      shortlisted: 'Preseleccionados',
      analytics: 'Analítica',
      skillgapAi: 'SkillGap AI',
      teamManagement: 'Gestión de Equipo',
      subscription: 'Suscripción',
      settings: 'Ajustes',
      signOut: 'Cerrar Sesión'
    },
    findTalentPage: {
      pill: 'RECLUTAMIENTO CON IA',
      titlePrefix: 'Encuentra el talento ideal con',
      titleHighlight: 'IA.',
      subtitle: 'Describe al profesional que buscas o usa filtros para obtener candidatos recomendados por IA al instante.',
      promptPlaceholder: 'Describe al empleado que estás buscando...',
      promptExample: 'ej: "Necesito 20 Account Managers en Alemania con más de 3 años de experiencia y sólidas habilidades de ventas."',
      addRequirements: 'Añadir requisitos',
      aiBrandBadge: 'SkillGap AI',
      findMatches: 'Buscar Matches IA',
      orFilters: 'O usa filtros manuales',
      filters: ['Puesto', 'Habilidades', 'Experiencia', 'Ubicación', 'Idiomas', 'Educación']
    }
  },
  fr: {
    accountSub: 'Compte Entreprise',
    planLabel: 'Offre',
    nav: {
      findTalent: 'Trouver des Talents',
      overview: "Vue d'ensemble",
      companyProfile: 'Profil Entreprise',
      candidates: 'Candidats',
      jobPositions: 'Postes',
      interviews: 'Entretiens',
      shortlisted: 'Présélectionnés',
      analytics: 'Analytique',
      skillgapAi: 'SkillGap AI',
      teamManagement: "Gestion d'Équipe",
      subscription: 'Abonnement',
      settings: 'Paramètres',
      signOut: 'Déconnexion'
    },
    findTalentPage: {
      pill: 'RECRUTEMENT PILOTÉ PAR IA',
      titlePrefix: "Trouvez le bon talent grâce à l'",
      titleHighlight: 'IA.',
      subtitle: 'Décrivez le profil recherché ou utilisez des filtres pour obtenir instantanément des candidats recommandés par IA.',
      promptPlaceholder: 'Décrivez le collaborateur que vous recherchez...',
      promptExample: 'ex : "Je recherche 20 Account Managers en Allemagne avec 3+ ans d\'expérience et de solides compétences commerciales."',
      addRequirements: 'Ajouter des critères',
      aiBrandBadge: 'SkillGap AI',
      findMatches: 'Trouver des Matches IA',
      orFilters: 'Ou utilisez des filtres manuels',
      filters: ['Poste', 'Compétences', 'Expérience', 'Localisation', 'Langues', 'Formation']
    }
  },
  de: {
    accountSub: 'Unternehmenskonto',
    planLabel: 'Tarif',
    nav: {
      findTalent: 'Talente Finden',
      overview: 'Übersicht',
      companyProfile: 'Unternehmensprofil',
      candidates: 'Kandidaten',
      jobPositions: 'Stellenpositionen',
      interviews: 'Interviews',
      shortlisted: 'Auswahlliste',
      analytics: 'Analytik',
      skillgapAi: 'SkillGap AI',
      teamManagement: 'Teamverwaltung',
      subscription: 'Abonnement',
      settings: 'Einstellungen',
      signOut: 'Abmelden'
    },
    findTalentPage: {
      pill: 'KI-GESTÜTZTES RECRUITING',
      titlePrefix: 'Finden Sie passende Talente mit',
      titleHighlight: 'KI.',
      subtitle: 'Beschreiben Sie die gesuchte Fachkraft oder nutzen Sie Filter für sofortige KI-Kandidatenvorschläge.',
      promptPlaceholder: 'Beschreiben Sie den gewünschten Mitarbeiter...',
      promptExample: 'z.B. "Ich suche 20 Account Manager in Deutschland mit 3+ Jahren Erfahrung und starker Vertriebskompetenz."',
      addRequirements: 'Anforderungen hinzufügen',
      aiBrandBadge: 'SkillGap AI',
      findMatches: 'KI-Matches Finden',
      orFilters: 'Oder manuelle Filter nutzen',
      filters: ['Jobtitel', 'Skills', 'Erfahrung', 'Standort', 'Sprachen', 'Ausbildung']
    }
  },
  ar: {
    accountSub: 'حساب شركة',
    planLabel: 'الباقة',
    nav: {
      findTalent: 'البحث عن المواهب',
      overview: 'نظرة عامة',
      companyProfile: 'ملف الشركة',
      candidates: 'المرشحون',
      jobPositions: 'الوظائف الشاغرة',
      interviews: 'المقابلات',
      shortlisted: 'القائمة المختصرة',
      analytics: 'الإحصاءات',
      skillgapAi: 'SkillGap AI',
      teamManagement: 'إدارة الفريق',
      subscription: 'الاشتراك',
      settings: 'الإعدادات',
      signOut: 'تسجيل الخروج'
    },
    findTalentPage: {
      pill: 'توظيف مدعوم بالذكاء الاصطناعي',
      titlePrefix: 'اعثر على الكفاءات المناسبة مع',
      titleHighlight: 'الذكاء الاصطناعي.',
      subtitle: 'صف الكادر الوظيفي المطلوب أو استخدم الفلاتر للحصول على مرشحين موصى بهم بالذكاء الاصطناعي فوراً.',
      promptPlaceholder: 'صف الموظف الذي تبحث عنه...',
      promptExample: 'مثال: "أحتاج إلى 20 مدير حسابات في ألمانيا بخبرة 3+ سنوات ومهارات بيع قوية."',
      addRequirements: 'إضافة متطلبات',
      aiBrandBadge: 'SkillGap AI',
      findMatches: 'إيجاد تطابقات الذكاء الاصطناعي',
      orFilters: 'أو استخدم الفلاتر اليدوية',
      filters: ['المسمى الوظيفي', 'المهارات', 'الخبرة', 'الموقع', 'اللغات', 'التعليم']
    }
  }
};

interface BusinessDashboardContextType {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  t: any;
  companyName: string;
  companyLogoUrl: string;
  activePlan: B2BPlanConfig | null;
  refreshSubscription: () => Promise<void>;
}

const BusinessDashboardContext = createContext<BusinessDashboardContextType>({
  lang: 'en',
  setLang: () => {},
  t: BUSINESS_TRANSLATIONS['en'],
  companyName: '',
  companyLogoUrl: '',
  activePlan: null,
  refreshSubscription: async () => {}
});

export const useBusinessDashboardLang = () => useContext(BusinessDashboardContext);

const SIX_LANGUAGES: { code: LangCode; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'pt', label: 'PT' },
  { code: 'es', label: 'ES' },
  { code: 'fr', label: 'FR' },
  { code: 'de', label: 'DE' },
  { code: 'ar', label: 'AR' }
];

export default function BusinessDashboardLayout({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<LangCode>('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [companyName, setCompanyName] = useState<string>('');
  const [companyLogoUrl, setCompanyLogoUrl] = useState<string>('');
  const [activePlan, setActivePlan] = useState<B2BPlanConfig | null>(null);
  const pathname = usePathname();
  const t = BUSINESS_TRANSLATIONS[lang] || BUSINESS_TRANSLATIONS['en'];
  const isRtl = lang === 'ar';

  const loadWorkspaceData = useCallback(async () => {
    const sub = await fetchActiveCompanySubscription();
    setActivePlan(sub.plan);

    if (supabase) {
      const {
        data: { user }
      } = await supabase.auth.getUser();

      if (user) {
        const [compRes, profRes] = await Promise.all([
          supabase.from('companies').select('name').eq('owner_id', user.id).maybeSingle(),
          supabase
            .from('business_company_profiles')
            .select('logo_url, profile_data')
            .eq('user_id', user.id)
            .maybeSingle()
        ]);

        const profName = profRes.data?.profile_data?.commercialName || profRes.data?.profile_data?.officialName;
        if (profName) {
          setCompanyName(profName);
        } else if (compRes.data?.name) {
          setCompanyName(compRes.data.name);
        }
        setCompanyLogoUrl(profRes.data?.logo_url || '');
      }
    }
  }, []);

  useEffect(() => {
    loadWorkspaceData();
  }, [loadWorkspaceData, pathname]);

  const primaryNav = [
    { href: '/dashboard/business', label: t.nav.findTalent, icon: Search },
    { href: '/dashboard/business/overview', label: t.nav.overview, icon: LayoutGrid },
    { href: '/dashboard/business/company-profile', label: t.nav.companyProfile, icon: Building2 },
    { href: '/dashboard/business/candidates', label: t.nav.candidates, icon: Users },
    { href: '/dashboard/business/job-positions', label: t.nav.jobPositions, icon: Briefcase },
    { href: '/dashboard/business/interviews', label: t.nav.interviews, icon: Calendar },
    { href: '/dashboard/business/shortlisted', label: t.nav.shortlisted, icon: Bookmark },
    { href: '/dashboard/business/analytics', label: t.nav.analytics, icon: BarChart3 },
    { href: '/dashboard/business/skillgap-ai', label: t.nav.skillgapAi, icon: Sparkles }
  ];

  const secondaryNav = [
    { href: '/dashboard/business/team', label: t.nav.teamManagement, icon: Users },
    { href: '/dashboard/business/subscription', label: t.nav.subscription, icon: CreditCard },
    { href: '/dashboard/business/settings', label: t.nav.settings, icon: Settings }
  ];

  const isActive = (href: string) => pathname === href.split('?')[0];

  return (
    <BusinessDashboardContext.Provider
      value={{
        lang,
        setLang,
        t,
        companyName,
        companyLogoUrl,
        activePlan,
        refreshSubscription: loadWorkspaceData
      }}
    >
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="min-h-screen bg-[#05020a] text-white flex font-sans selection:bg-purple-600 selection:text-white"
      >
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        <aside
          className={`fixed lg:static inset-y-0 ${
            isRtl ? 'right-0' : 'left-0'
          } z-50 w-64 bg-[#07030e] border-white/[0.06] ${
            isRtl ? 'border-l' : 'border-r'
          } flex flex-col justify-between transition-transform duration-300 ease-in-out ${
            mobileMenuOpen
              ? 'translate-x-0'
              : isRtl
              ? 'translate-x-full lg:translate-x-0'
              : '-translate-x-full lg:translate-x-0'
          }`}
        >
          <div>
            <div className="px-5 pt-6 pb-5 flex items-center justify-between gap-2">
              <Link href={`/?lang=${lang}`} className="flex items-center gap-3 min-w-0">
                <div className="relative w-9 h-9 flex-shrink-0 flex items-center justify-center rounded-xl bg-purple-950/40 border border-purple-500/40 shadow-lg shadow-purple-900/50 p-1">
                  <Image
                    src="/images/logo-icon.png"
                    alt="Logotipo SkillGap"
                    width={36}
                    height={36}
                    priority
                    className="w-full h-full object-contain"
                  />
                </div>
                <span className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
                  SKILLGAP
                </span>
              </Link>

              <button
                onClick={() => setMobileMenuOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <nav className="px-3 space-y-1">
              {primaryNav.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                      active
                        ? 'bg-[#6d28d9] text-white shadow-md shadow-purple-900/40'
                        : 'text-gray-300/90 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-gray-400'}`} />
                    <span className="truncate">{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="my-4 mx-4 border-t border-white/[0.06]" />

            <nav className="px-3 space-y-1">
              {secondaryNav.map(({ href, label, icon: Icon }) => {
                const active = isActive(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                      active
                        ? 'bg-[#6d28d9] text-white'
                        : 'text-gray-300/90 hover:bg-white/[0.04] hover:text-white'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-gray-400'}`} />
                    <span className="truncate">{label}</span>
                  </Link>
                );
              })}

              <Link
                href={`/?lang=${lang}`}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-red-400/80 hover:bg-red-950/30 hover:text-red-300 transition-all"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="truncate">{t.nav.signOut}</span>
              </Link>
            </nav>
          </div>

          <div className="p-3 border-t border-white/[0.06]">
            <div className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl bg-[#0d0718] border border-white/[0.06]">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-[#160d29] border border-purple-500/20 flex items-center justify-center text-gray-300 shrink-0 overflow-hidden">
                  {companyLogoUrl ? (
                    <img
                      src={companyLogoUrl}
                      alt={companyName || 'Company Logo'}
                      className="w-full h-full object-contain p-0.5"
                    />
                  ) : (
                    <Building2 className="w-4 h-4" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">
                    {companyName || t.accountSub}
                  </p>
                  <p className="text-[11px] text-purple-300 truncate">
                    {activePlan ? `${t.planLabel}: ${activePlan.name}` : t.accountSub}
                  </p>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-gray-500 shrink-0" />
            </div>
          </div>
        </aside>

        <div className="flex-1 flex flex-col min-w-0 bg-[#05020a]">
          {/* Topo esquerdo com o logotipo da empresa + topo direito com idioma e notificações */}
          <header className="px-6 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-lg bg-white/5 text-gray-300 hover:text-white"
              >
                <Menu className="w-5 h-5" />
              </button>

              {companyLogoUrl && (
                <Link
                  href="/dashboard/business/company-profile"
                  className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-xl bg-[#0d0718] border border-purple-500/30 hover:border-purple-400 transition min-w-0"
                >
                  <img
                    src={companyLogoUrl}
                    alt={companyName || 'Company Logo'}
                    className="w-7 h-7 rounded-lg object-contain bg-white/5 shrink-0"
                  />
                  {companyName && (
                    <span className="text-xs font-bold text-white truncate max-w-[180px]">
                      {companyName}
                    </span>
                  )}
                </Link>
              )}
            </div>

            <div className={`flex items-center gap-3 ${isRtl ? 'mr-auto' : 'ml-auto'}`}>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#0e081a] border border-purple-500/25">
                <Globe className="w-3.5 h-3.5 text-purple-400" />
                <select
                  aria-label="Language"
                  value={lang}
                  onChange={(e) => setLang(e.target.value as LangCode)}
                  className="bg-transparent text-xs font-semibold text-white focus:outline-none cursor-pointer"
                >
                  {SIX_LANGUAGES.map((l) => (
                    <option key={l.code} value={l.code} className="bg-[#0e081a] text-white">
                      {l.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                aria-label="Notifications"
                className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.04] transition cursor-pointer"
              >
                <Bell className="w-4 h-4" />
              </button>
            </div>
          </header>

          <main className="flex-1 px-6 pb-8 flex flex-col">{children}</main>
        </div>
      </div>
    </BusinessDashboardContext.Provider>
  );
}