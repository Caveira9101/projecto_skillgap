'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Sparkles,
  Briefcase,
  Building2,
  Layers,
  Calendar,
  MapPin,
  Languages,
  GraduationCap,
  User,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Search,
  X
} from 'lucide-react';
import { supabase, type LangCode } from '@/lib/business-supabase';
import { useBusinessDashboardLang } from './layout';

export interface IndustryItem {
  key: string;
  labels: Record<LangCode, string>;
}

export const SKILLGAP_50_INDUSTRIES: IndustryItem[] = [
  {
    key: 'Information Technology & Software',
    labels: {
      en: 'Information Technology & Software',
      pt: 'Tecnologia da Informação e Software',
      es: 'Tecnología de la Información y Software',
      fr: 'Technologies de l’Information et Logiciels',
      de: 'Informationstechnologie & Software',
      ar: 'تكنولوجيا المعلومات والبرمجيات'
    }
  },
  {
    key: 'Artificial Intelligence & Machine Learning',
    labels: {
      en: 'Artificial Intelligence & Machine Learning',
      pt: 'Inteligência Artificial e Aprendizagem Automática',
      es: 'Inteligencia Artificial y Aprendizaje Automático',
      fr: 'Intelligence Artificielle et Apprentissage Automatique',
      de: 'Künstliche Intelligenz & Maschinelles Lernen',
      ar: 'الذكاء الاصطناعي وتعلم الآلة'
    }
  },
  {
    key: 'Cybersecurity',
    labels: {
      en: 'Cybersecurity',
      pt: 'Cibersegurança',
      es: 'Ciberseguridad',
      fr: 'Cybersécurité',
      de: 'Cybersicherheit',
      ar: 'الأمن السيبراني'
    }
  },
  {
    key: 'Telecommunications',
    labels: {
      en: 'Telecommunications',
      pt: 'Telecomunicações',
      es: 'Telecomunicaciones',
      fr: 'Télécommunications',
      de: 'Telekommunikation',
      ar: 'الاتصالات'
    }
  },
  {
    key: 'Banking & Financial Services',
    labels: {
      en: 'Banking & Financial Services',
      pt: 'Banca e Serviços Financeiros',
      es: 'Banca y Servicios Financieros',
      fr: 'Banque et Services Financiers',
      de: 'Bankwesen & Finanzdienstleistungen',
      ar: 'الخدمات المصرفية والمالية'
    }
  },
  {
    key: 'Insurance',
    labels: {
      en: 'Insurance',
      pt: 'Seguros',
      es: 'Seguros',
      fr: 'Assurance',
      de: 'Versicherungen',
      ar: 'التأمين'
    }
  },
  {
    key: 'Investment & Asset Management',
    labels: {
      en: 'Investment & Asset Management',
      pt: 'Investimentos e Gestão de Ativos',
      es: 'Inversión y Gestión de Activos',
      fr: 'Investissement et Gestion d’Actifs',
      de: 'Investment & Vermögensverwaltung',
      ar: 'الاستثمار وإدارة الأصول'
    }
  },
  {
    key: 'FinTech',
    labels: {
      en: 'FinTech',
      pt: 'FinTech e Tecnologia Financeira',
      es: 'FinTech y Tecnología Financiera',
      fr: 'FinTech et Technologie Financière',
      de: 'FinTech',
      ar: 'التكنولوجيا المالية (FinTech)'
    }
  },
  {
    key: 'Consulting & Professional Services',
    labels: {
      en: 'Consulting & Professional Services',
      pt: 'Consultoria e Serviços Profissionais',
      es: 'Consultoría y Servicios Profesionales',
      fr: 'Conseil et Services Professionnels',
      de: 'Beratung & Professionelle Dienstleistungen',
      ar: 'الاستشارات والخدمات المهنية'
    }
  },
  {
    key: 'Sales & Business Development',
    labels: {
      en: 'Sales & Business Development',
      pt: 'Vendas e Desenvolvimento de Negócios',
      es: 'Ventas y Desarrollo de Negocios',
      fr: 'Ventes et Développement Commercial',
      de: 'Vertrieb & Geschäftsentwicklung',
      ar: 'المبيعات وتطوير الأعمال'
    }
  },
  {
    key: 'Marketing & Advertising',
    labels: {
      en: 'Marketing & Advertising',
      pt: 'Marketing e Publicidade',
      es: 'Marketing y Publicidad',
      fr: 'Marketing et Publicité',
      de: 'Marketing & Werbung',
      ar: 'التسويق والإعلان'
    }
  },
  {
    key: 'Human Resources & Recruitment',
    labels: {
      en: 'Human Resources & Recruitment',
      pt: 'Recursos Humanos e Recrutamento',
      es: 'Recursos Humanos y Reclutamiento',
      fr: 'Ressources Humaines et Recrutement',
      de: 'Personalwesen & Recruiting',
      ar: 'الموارد البشرية والتوظيف'
    }
  },
  {
    key: 'Education & E-learning',
    labels: {
      en: 'Education & E-learning',
      pt: 'Educação e Ensino Online',
      es: 'Educación y Aprendizaje en Línea',
      fr: 'Éducation et E-learning',
      de: 'Bildung & E-Learning',
      ar: 'التعليم والتعلم الإلكتروني'
    }
  },
  {
    key: 'Healthcare & Medical',
    labels: {
      en: 'Healthcare & Medical',
      pt: 'Saúde e Serviços Médicos',
      es: 'Salud y Servicios Médicos',
      fr: 'Santé et Services Médicaux',
      de: 'Gesundheitswesen & Medizin',
      ar: 'الرعاية الصحية والخدمات الطبية'
    }
  },
  {
    key: 'Pharmaceuticals & Biotechnology',
    labels: {
      en: 'Pharmaceuticals & Biotechnology',
      pt: 'Indústria Farmacêutica e Biotecnologia',
      es: 'Farmacéutica y Biotecnología',
      fr: 'Pharmacie et Biotechnologie',
      de: 'Pharma & Biotechnologie',
      ar: 'الأدوية والتكنولوجيا الحيوية'
    }
  },
  {
    key: 'Retail & E-commerce',
    labels: {
      en: 'Retail & E-commerce',
      pt: 'Retalho e Comércio Eletrónico',
      es: 'Comercio Minorista y Comercio Electrónico',
      fr: 'Commerce de Détail et E-commerce',
      de: 'Einzelhandel & E-Commerce',
      ar: 'التجزئة والتجارة الإلكترونية'
    }
  },
  {
    key: 'Consumer Goods & FMCG',
    labels: {
      en: 'Consumer Goods & FMCG',
      pt: 'Bens de Consumo e Grande Consumo',
      es: 'Bienes de Consumo y Gran Consumo',
      fr: 'Biens de Consommation et Grande Distribution',
      de: 'Konsumgüter & FMCG',
      ar: 'السلع الاستهلاكية'
    }
  },
  {
    key: 'Manufacturing & Industrial',
    labels: {
      en: 'Manufacturing & Industrial',
      pt: 'Indústria Transformadora e Manufatura',
      es: 'Manufactura e Industria',
      fr: 'Industrie Manufacturière',
      de: 'Fertigung & Industrie',
      ar: 'التصنيع والصناعة'
    }
  },
  {
    key: 'Automotive',
    labels: {
      en: 'Automotive',
      pt: 'Indústria Automóvel',
      es: 'Automoción',
      fr: 'Automobile',
      de: 'Automobilindustrie',
      ar: 'صناعة السيارات'
    }
  },
  {
    key: 'Logistics & Supply Chain',
    labels: {
      en: 'Logistics & Supply Chain',
      pt: 'Logística e Cadeia de Abastecimento',
      es: 'Logística y Cadena de Suministro',
      fr: 'Logistique et Chaîne d’Approvisionnement',
      de: 'Logistik & Lieferkette',
      ar: 'الخدمات اللوجستية وسلسلة الإمداد'
    }
  },
  {
    key: 'Transportation & Mobility',
    labels: {
      en: 'Transportation & Mobility',
      pt: 'Transportes e Mobilidade',
      es: 'Transporte y Movilidad',
      fr: 'Transport et Mobilité',
      de: 'Transport & Mobilität',
      ar: 'النقل والتنقل'
    }
  },
  {
    key: 'Aviation & Aerospace',
    labels: {
      en: 'Aviation & Aerospace',
      pt: 'Aviação e Indústria Aeroespacial',
      es: 'Aviación y Aeroespacial',
      fr: 'Aviation et Aérospatiale',
      de: 'Luft- & Raumfahrt',
      ar: 'الطيران والفضاء'
    }
  },
  {
    key: 'Construction & Engineering',
    labels: {
      en: 'Construction & Engineering',
      pt: 'Construção Civil e Engenharia',
      es: 'Construcción e Ingeniería',
      fr: 'Construction et Ingénierie',
      de: 'Bauwesen & Ingenieurwesen',
      ar: 'البناء والهندسة'
    }
  },
  {
    key: 'Real Estate & Property Management',
    labels: {
      en: 'Real Estate & Property Management',
      pt: 'Imobiliário e Gestão de Propriedades',
      es: 'Bienes Raíces y Gestión Inmobiliaria',
      fr: 'Immobilier et Gestion de Biens',
      de: 'Immobilien & Hausverwaltung',
      ar: 'العقارات وإدارة الممتلكات'
    }
  },
  {
    key: 'Energy & Renewable Energy',
    labels: {
      en: 'Energy & Renewable Energy',
      pt: 'Energia e Energias Renováveis',
      es: 'Energía y Energías Renovables',
      fr: 'Énergie et Énergies Renouvelables',
      de: 'Energie & Erneuerbare Energien',
      ar: 'الطاقة والطاقة المتجددة'
    }
  },
  {
    key: 'Oil & Gas',
    labels: {
      en: 'Oil & Gas',
      pt: 'Petróleo e Gás',
      es: 'Petróleo y Gas',
      fr: 'Pétrole et Gaz',
      de: 'Öl & Gas',
      ar: 'النفط والغاز'
    }
  },
  {
    key: 'Mining & Natural Resources',
    labels: {
      en: 'Mining & Natural Resources',
      pt: 'Mineração e Recursos Naturais',
      es: 'Minería y Recursos Naturales',
      fr: 'Mines et Ressources Naturelles',
      de: 'Bergbau & Rohstoffe',
      ar: 'التعدين والموارد الطبيعية'
    }
  },
  {
    key: 'Hospitality & Tourism',
    labels: {
      en: 'Hospitality & Tourism',
      pt: 'Hotelaria e Turismo',
      es: 'Hotelería y Turismo',
      fr: 'Hôtellerie et Tourisme',
      de: 'Gastgewerbe & Tourismus',
      ar: 'الضيافة والسياحة'
    }
  },
  {
    key: 'Food & Beverage',
    labels: {
      en: 'Food & Beverage',
      pt: 'Alimentação e Bebidas',
      es: 'Alimentos y Bebidas',
      fr: 'Agroalimentaire et Boissons',
      de: 'Lebensmittel & Getränke',
      ar: 'الأغذية والمشروبات'
    }
  },
  {
    key: 'Restaurants & Food Services',
    labels: {
      en: 'Restaurants & Food Services',
      pt: 'Restauração e Serviços Alimentares',
      es: 'Restaurantes y Servicios de Alimentación',
      fr: 'Restauration et Services Alimentaires',
      de: 'Gastronomie & Verpflegungsdienste',
      ar: 'المطاعم والخدمات الغذائية'
    }
  },
  {
    key: 'Media & Entertainment',
    labels: {
      en: 'Media & Entertainment',
      pt: 'Comunicação Social e Entretenimento',
      es: 'Medios y Entretenimiento',
      fr: 'Médias et Divertissement',
      de: 'Medien & Unterhaltung',
      ar: 'الإعلام والترفيه'
    }
  },
  {
    key: 'Film & Television',
    labels: {
      en: 'Film & Television',
      pt: 'Cinema e Televisão',
      es: 'Cine y Televisión',
      fr: 'Cinéma et Télévision',
      de: 'Film & Fernsehen',
      ar: 'السينما والتلفزيون'
    }
  },
  {
    key: 'Gaming & Esports',
    labels: {
      en: 'Gaming & Esports',
      pt: 'Videojogos e Esports',
      es: 'Videojuegos y Esports',
      fr: 'Jeux Vidéo et Esports',
      de: 'Gaming & Esports',
      ar: 'الألعاب والرياضات الإلكترونية'
    }
  },
  {
    key: 'Sports & Fitness',
    labels: {
      en: 'Sports & Fitness',
      pt: 'Desporto e Fitness',
      es: 'Deportes y Fitness',
      fr: 'Sports et Fitness',
      de: 'Sport & Fitness',
      ar: 'الرياضة واللياقة البدنية'
    }
  },
  {
    key: 'Fashion & Apparel',
    labels: {
      en: 'Fashion & Apparel',
      pt: 'Moda e Vestuário',
      es: 'Moda y Confección',
      fr: 'Mode et Habillement',
      de: 'Mode & Bekleidung',
      ar: 'الأزياء والملابس'
    }
  },
  {
    key: 'Beauty & Cosmetics',
    labels: {
      en: 'Beauty & Cosmetics',
      pt: 'Beleza e Cosmética',
      es: 'Belleza y Cosmética',
      fr: 'Beauté et Cosmétiques',
      de: 'Schönheit & Kosmetik',
      ar: 'الجمال ومستحضرات التجميل'
    }
  },
  {
    key: 'Architecture & Interior Design',
    labels: {
      en: 'Architecture & Interior Design',
      pt: 'Arquitetura e Design de Interiores',
      es: 'Arquitectura y Diseño de Interiores',
      fr: 'Architecture et Design d’Intérieur',
      de: 'Architektur & Innenarchitektur',
      ar: 'الهندسة المعمارية والتصميم الداخلي'
    }
  },
  {
    key: 'Legal Services',
    labels: {
      en: 'Legal Services',
      pt: 'Serviços Jurídicos e Advocacia',
      es: 'Servicios Legales',
      fr: 'Services Juridiques',
      de: 'Rechtsdienstleistungen',
      ar: 'الخدمات القانونية'
    }
  },
  {
    key: 'Government & Public Administration',
    labels: {
      en: 'Government & Public Administration',
      pt: 'Governo e Administração Pública',
      es: 'Gobierno y Administración Pública',
      fr: 'Gouvernement et Administration Publique',
      de: 'Regierung & Öffentliche Verwaltung',
      ar: 'الحكومة والإدارة العامة'
    }
  },
  {
    key: 'Non-profit & NGOs',
    labels: {
      en: 'Non-profit & NGOs',
      pt: 'Organizações Sem Fins Lucrativos e ONGs',
      es: 'Organizaciones sin Fines de Lucro y ONG',
      fr: 'Organisations à But Non Lucratif et ONG',
      de: 'Gemeinnützige Organisationen & NGOs',
      ar: 'المنظمات غير الربحية'
    }
  },
  {
    key: 'Agriculture & Agribusiness',
    labels: {
      en: 'Agriculture & Agribusiness',
      pt: 'Agricultura e Agronegócio',
      es: 'Agricultura y Agronegocios',
      fr: 'Agriculture et Agro-industrie',
      de: 'Landwirtschaft & Agrarwirtschaft',
      ar: 'الزراعة والأعمال الزراعية'
    }
  },
  {
    key: 'Environmental Services',
    labels: {
      en: 'Environmental Services',
      pt: 'Serviços Ambientais',
      es: 'Servicios Ambientales',
      fr: 'Services Environnementaux',
      de: 'Umweltdienstleistungen',
      ar: 'الخدمات البيئية'
    }
  },
  {
    key: 'Sustainability & Climate Technology',
    labels: {
      en: 'Sustainability & Climate Technology',
      pt: 'Sustentabilidade e Tecnologia Climática',
      es: 'Sostenibilidad y Tecnología Climática',
      fr: 'Durabilité et Technologies Climatiques',
      de: 'Nachhaltigkeit & Klimatechnologie',
      ar: 'الاستدامة وتكنولوجيا المناخ'
    }
  },
  {
    key: 'Research & Development',
    labels: {
      en: 'Research & Development',
      pt: 'Investigação e Desenvolvimento (I&D)',
      es: 'Investigación y Desarrollo (I+D)',
      fr: 'Recherche et Développement (R&D)',
      de: 'Forschung & Entwicklung',
      ar: 'البحث والتطوير'
    }
  },
  {
    key: 'Events & Conferences',
    labels: {
      en: 'Events & Conferences',
      pt: 'Eventos e Conferências',
      es: 'Eventos y Conferencias',
      fr: 'Événements et Conférences',
      de: 'Veranstaltungen & Konferenzen',
      ar: 'الفعاليات والمؤتمرات'
    }
  },
  {
    key: 'Security Services',
    labels: {
      en: 'Security Services',
      pt: 'Serviços de Segurança',
      es: 'Servicios de Seguridad',
      fr: 'Services de Sécurité',
      de: 'Sicherheitsdienste',
      ar: 'الخدمات الأمنية'
    }
  },
  {
    key: 'Maritime & Shipping',
    labels: {
      en: 'Maritime & Shipping',
      pt: 'Transporte Marítimo e Navegação',
      es: 'Transporte Marítimo y Naviero',
      fr: 'Transport Maritime et Expédition',
      de: 'Schifffahrt & Seetransport',
      ar: 'النقل البحري والشحن'
    }
  },
  {
    key: 'E-commerce & Digital Platforms',
    labels: {
      en: 'E-commerce & Digital Platforms',
      pt: 'Comércio Eletrónico e Plataformas Digitais',
      es: 'Comercio Electrónico y Plataformas Digitales',
      fr: 'E-commerce et Plateformes Numériques',
      de: 'E-Commerce & Digitale Plattformen',
      ar: 'التجارة الإلكترونية والمنصات الرقمية'
    }
  },
  {
    key: 'Pharmaceuticals Distribution',
    labels: {
      en: 'Pharmaceuticals Distribution',
      pt: 'Distribuição Farmacêutica',
      es: 'Distribución Farmacéutica',
      fr: 'Distribution Pharmaceutique',
      de: 'Pharmagroßhandel & Vertrieb',
      ar: 'توزيع الأدوية'
    }
  },
  {
    key: 'Other',
    labels: {
      en: 'Other',
      pt: 'Outra',
      es: 'Otra',
      fr: 'Autre',
      de: 'Sonstige',
      ar: 'أخرى'
    }
  }
];

interface DbJobPosition {
  id: string;
  title: string;
  department?: string | null;
  status?: string | null;
  location?: string | null;
  required_skills?: string[] | null;
}

interface DbCandidate {
  id: string;
  full_name: string;
  role: string;
  location: string;
  experience_years: number;
  education: string;
  languages: string[];
  skills: string[];
  availability: string;
  industry?: string | null;
}

const FILTER_ICONS = [Briefcase, Layers, Calendar, MapPin, Languages, GraduationCap];

const PAGE_COPY: Record<
  LangCode,
  {
    specificJobLabel: string;
    generalSearch: string;
    industryDirectoryLabel: string;
    selectIndustryBtn: string;
    allIndustries: string;
    filterIndustriesPlaceholder: string;
    otherIndustryPlaceholder: string;
    clearRequirements: string;
    noJobs: string;
    goToJobs: string;
    resultsTitle: string;
    planLimitNote: string;
    reset: string;
    emptyCandidates: string;
    viewProfile: string;
    shortlist: string;
    shortlisted: string;
    years: string;
  }
> = {
  en: {
    specificJobLabel: 'Search for a specific job',
    generalSearch: 'General Talent Search',
    industryDirectoryLabel: 'Industry Directory',
    selectIndustryBtn: 'Select Industry',
    allIndustries: 'All Industries',
    filterIndustriesPlaceholder: 'Filter industries...',
    otherIndustryPlaceholder: 'Specify custom industry (optional)...',
    clearRequirements: 'Clear requirements',
    noJobs: 'No job positions found in the database.',
    goToJobs: 'Go to Job Positions',
    resultsTitle: 'Recommended Candidates',
    planLimitNote: 'Active plan limit per job:',
    reset: 'Reset',
    emptyCandidates: 'No candidates matched your search and requirements in the Supabase database.',
    viewProfile: 'View Profile',
    shortlist: 'Shortlist',
    shortlisted: 'Shortlisted',
    years: 'years'
  },
  pt: {
    specificJobLabel: 'Pesquisar para uma vaga específica',
    generalSearch: 'Pesquisa Geral de Talentos',
    industryDirectoryLabel: 'Diretório de Indústrias',
    selectIndustryBtn: 'Selecionar Indústria',
    allIndustries: 'Todas as Indústrias',
    filterIndustriesPlaceholder: 'Filtrar indústrias...',
    otherIndustryPlaceholder: 'Especifica a indústria (opcional)...',
    clearRequirements: 'Limpar requisitos',
    noJobs: 'Nenhuma vaga encontrada na base de dados.',
    goToJobs: 'Ir para Vagas',
    resultsTitle: 'Candidatos Recomendados',
    planLimitNote: 'Limite do plano ativo por vaga:',
    reset: 'Limpar',
    emptyCandidates: 'Nenhum candidato correspondeu aos requisitos na base de dados do Supabase.',
    viewProfile: 'Ver Perfil',
    shortlist: 'Pré-selecionar',
    shortlisted: 'Pré-selecionado',
    years: 'anos'
  },
  es: {
    specificJobLabel: 'Buscar para un puesto específico',
    generalSearch: 'Búsqueda General de Talento',
    industryDirectoryLabel: 'Directorio de Industrias',
    selectIndustryBtn: 'Seleccionar Industria',
    allIndustries: 'Todas las Industrias',
    filterIndustriesPlaceholder: 'Filtrar industrias...',
    otherIndustryPlaceholder: 'Especifica la industria (opcional)...',
    clearRequirements: 'Limpiar requisitos',
    noJobs: 'No se encontraron puestos en la base de datos.',
    goToJobs: 'Ir a Puestos',
    resultsTitle: 'Candidatos Recomendados',
    planLimitNote: 'Límite del plan activo por puesto:',
    reset: 'Limpiar',
    emptyCandidates: 'Ningún candidato coincidió con los requisitos en Supabase.',
    viewProfile: 'Ver Perfil',
    shortlist: 'Preseleccionar',
    shortlisted: 'Preseleccionado',
    years: 'años'
  },
  fr: {
    specificJobLabel: 'Rechercher pour un poste spécifique',
    generalSearch: 'Recherche Générale de Talents',
    industryDirectoryLabel: 'Répertoire des Secteurs',
    selectIndustryBtn: 'Choisir un Secteur',
    allIndustries: 'Tous les Secteurs',
    filterIndustriesPlaceholder: 'Filtrer les secteurs...',
    otherIndustryPlaceholder: 'Précisez le secteur (facultatif)...',
    clearRequirements: 'Effacer les critères',
    noJobs: 'Aucun poste trouvé dans la base de données.',
    goToJobs: 'Voir les Postes',
    resultsTitle: 'Candidats Recommandés',
    planLimitNote: 'Limite du forfait actif par poste :',
    reset: 'Réinitialiser',
    emptyCandidates: 'Aucun candidat ne correspond aux critères dans Supabase.',
    viewProfile: 'Voir le Profil',
    shortlist: 'Présélectionner',
    shortlisted: 'Présélectionné',
    years: 'ans'
  },
  de: {
    specificJobLabel: 'Nach einer bestimmten Stelle suchen',
    generalSearch: 'Allgemeine Talentsuche',
    industryDirectoryLabel: 'Branchenverzeichnis',
    selectIndustryBtn: 'Branche auswählen',
    allIndustries: 'Alle Branchen',
    filterIndustriesPlaceholder: 'Branchen filtern...',
    otherIndustryPlaceholder: 'Eigene Branche angeben (optional)...',
    clearRequirements: 'Anforderungen löschen',
    noJobs: 'Keine Stellenpositionen in der Datenbank gefunden.',
    goToJobs: 'Zu Stellenpositionen',
    resultsTitle: 'Empfohlene Kandidaten',
    planLimitNote: 'Limit des aktiven Tarifs pro Stelle:',
    reset: 'Zurücksetzen',
    emptyCandidates: 'Keine Kandidaten erfüllten die Anforderungen in Supabase.',
    viewProfile: 'Profil Ansehen',
    shortlist: 'Vormerken',
    shortlisted: 'Vorgemerkt',
    years: 'Jahre'
  },
  ar: {
    specificJobLabel: 'البحث لوظيفة محددة',
    generalSearch: 'بحث عام عن المواهب',
    industryDirectoryLabel: 'دليل القطاعات والصناعات',
    selectIndustryBtn: 'اختر القطاع',
    allIndustries: 'جميع القطاعات',
    filterIndustriesPlaceholder: 'تصفية القطاعات...',
    otherIndustryPlaceholder: 'حدد القطاع المخصص (اختياري)...',
    clearRequirements: 'مسح المتطلبات',
    noJobs: 'لا توجد وظائف في قاعدة البيانات.',
    goToJobs: 'الانتقال إلى الوظائف',
    resultsTitle: 'المرشحون الموصى بهم',
    planLimitNote: 'حد الباقة النشطة لكل وظيفة:',
    reset: 'إعادة ضبط',
    emptyCandidates: 'لا يوجد مرشحون مطابقون للمتطلبات في قاعدة بيانات Supabase.',
    viewProfile: 'عرض الملف',
    shortlist: 'إضافة للقائمة المختصرة',
    shortlisted: 'في القائمة المختصرة',
    years: 'سنوات'
  }
};

export default function BusinessFindTalentPage() {
  const { lang, t, activePlan } = useBusinessDashboardLang();
  const page = t.findTalentPage || {};
  const copy = PAGE_COPY[lang] || PAGE_COPY.en;
  const isRtl = lang === 'ar';

  const [jobs, setJobs] = useState<DbJobPosition[]>([]);
  const [candidates, setCandidates] = useState<DbCandidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJobId, setSelectedJobId] = useState('');

  // Industry Directory (50 indústrias traduzidas, sem números, em ordem alfabética por idioma + Other no fim)
  const [industryPickerOpen, setIndustryPickerOpen] = useState(false);
  const [industrySearch, setIndustrySearch] = useState('');
  const [selectedIndustryKey, setSelectedIndustryKey] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');

  // Prompt + "+ Add requirements" com os filtros manuais reais dentro
  const [prompt, setPrompt] = useState('');
  const [requirementsOpen, setRequirementsOpen] = useState(false);
  const [focusedFilter, setFocusedFilter] = useState<string | null>(null);
  const [requirementValues, setRequirementValues] = useState<Record<string, string>>({});

  const [showResults, setShowResults] = useState(false);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [inspected, setInspected] = useState<DbCandidate | null>(null);

  useEffect(() => {
    async function loadFromSupabase() {
      setLoading(true);
      try {
        if (!supabase) {
          setJobs([]);
          setCandidates([]);
          return;
        }

        const [jobsRes, candRes, shortRes] = await Promise.all([
          supabase.from('job_positions').select('id,title,department,status,location,required_skills'),
          supabase
            .from('candidates')
            .select('id,full_name,role,location,experience_years,education,languages,skills,availability,industry'),
          supabase.from('shortlisted_candidates').select('candidate_id')
        ]);

        setJobs((jobsRes.data as DbJobPosition[]) || []);
        setCandidates((candRes.data as DbCandidate[]) || []);
        setShortlistedIds(
          ((shortRes.data as { candidate_id: string }[]) || []).map((r) => r.candidate_id)
        );
      } finally {
        setLoading(false);
      }
    }

    loadFromSupabase();
  }, []);

  const maxPerJob = activePlan?.candidatesPerJob ?? 5;

  // Ordena alfabeticamente no idioma selecionado, mantendo "Other" sempre no final
  const sortedIndustries = useMemo(() => {
    const standard = SKILLGAP_50_INDUSTRIES.filter((item) => item.key !== 'Other').sort((a, b) =>
      (a.labels[lang] || a.labels.en).localeCompare(b.labels[lang] || b.labels.en, lang, {
        sensitivity: 'base'
      })
    );
    const otherItem = SKILLGAP_50_INDUSTRIES.find((item) => item.key === 'Other');
    return otherItem ? [...standard, otherItem] : standard;
  }, [lang]);

  const filteredIndustries = useMemo(() => {
    const q = industrySearch.trim().toLowerCase();
    if (!q) return sortedIndustries;
    return sortedIndustries.filter((item) => {
      const localized = (item.labels[lang] || item.labels.en).toLowerCase();
      return localized.includes(q) || item.key.toLowerCase().includes(q);
    });
  }, [industrySearch, sortedIndustries, lang]);

  const selectedIndustryDisplay = useMemo(() => {
    if (!selectedIndustryKey) return '';
    const found = SKILLGAP_50_INDUSTRIES.find((i) => i.key === selectedIndustryKey);
    return found ? found.labels[lang] || found.labels.en : selectedIndustryKey;
  }, [selectedIndustryKey, lang]);

  const activeRequirementsCount = useMemo(
    () => Object.values(requirementValues).filter((v) => v && v.trim().length > 0).length,
    [requirementValues]
  );

  const filteredCandidates = useMemo(() => {
    const selectedJob = jobs.find((j) => j.id === selectedJobId) || null;
    const jobSkills = (selectedJob?.required_skills || []).map((s) => s.toLowerCase().trim());
    const promptQuery = prompt.trim().toLowerCase();

    const industryItem = SKILLGAP_50_INDUSTRIES.find((i) => i.key === selectedIndustryKey);
    const industryTerms: string[] =
      selectedIndustryKey === 'Other'
        ? customIndustry.trim()
          ? [customIndustry.trim().toLowerCase()]
          : []
        : industryItem
        ? Array.from(
            new Set(
              [industryItem.key, ...Object.values(industryItem.labels)].map((v) =>
                v.toLowerCase().trim()
              )
            )
          )
        : [];

    const activeReqs = Object.entries(requirementValues).filter(
      ([, val]) => val && val.trim().length > 0
    );

    const list = candidates
      .filter((c) => {
        const candBlob = [
          c.full_name,
          c.role,
          c.location,
          c.education,
          c.availability,
          c.industry || '',
          ...(c.languages || []),
          ...(c.skills || [])
        ]
          .join(' ')
          .toLowerCase();

        // 1. Filtro pela vaga selecionada (se tiver required_skills)
        if (jobSkills.length > 0) {
          const candSkillsLower = (c.skills || []).map((s) => s.toLowerCase().trim());
          const matchesJobSkill = jobSkills.some((js) =>
            candSkillsLower.some((cs) => cs.includes(js) || js.includes(cs))
          );
          if (!matchesJobSkill) return false;
        }

        // 2. Centralização real na indústria selecionada (verifica em qualquer idioma guardado)
        if (industryTerms.length > 0) {
          const candInd = (c.industry || '').toLowerCase();
          const matchesIndustry = industryTerms.some(
            (term) => candInd.includes(term) || candBlob.includes(term)
          );
          if (!matchesIndustry) return false;
        }

        // 3. Filtro pelo texto principal da descrição
        if (promptQuery && !candBlob.includes(promptQuery)) {
          const words = promptQuery.split(/[\s,.;:!?]+/).filter((w) => w.length >= 3);
          if (words.length > 0 && !words.some((w) => candBlob.includes(w))) {
            return false;
          }
        }

        // 4. Filtros manuais reais adicionados dentro de "+ Add requirements"
        for (const [filterLabel, rawVal] of activeReqs) {
          const val = rawVal.trim().toLowerCase();
          const labelLower = filterLabel.toLowerCase();

          if (
            labelLower.includes('exp') ||
            labelLower.includes('year') ||
            labelLower.includes('ano') ||
            labelLower.includes('jahr') ||
            labelLower.includes('ans') ||
            labelLower.includes('سنوات') ||
            labelLower.includes('خبرة')
          ) {
            const minYears = parseInt(val.replace(/[^\d]/g, ''), 10);
            if (!Number.isNaN(minYears) && Number(c.experience_years || 0) < minYears) {
              return false;
            }
            continue;
          }

          const terms = val
            .split(',')
            .map((tItem) => tItem.trim())
            .filter(Boolean);

          const matchesAllTerms = terms.every((term) => candBlob.includes(term));
          if (!matchesAllTerms) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (industryTerms.length === 0) return 0;
        const aExact = industryTerms.some((tItem) =>
          (a.industry || '').toLowerCase().includes(tItem)
        );
        const bExact = industryTerms.some((tItem) =>
          (b.industry || '').toLowerCase().includes(tItem)
        );
        return Number(bExact) - Number(aExact);
      });

    return list.slice(0, maxPerJob);
  }, [
    candidates,
    jobs,
    selectedJobId,
    selectedIndustryKey,
    customIndustry,
    prompt,
    requirementValues,
    maxPerJob
  ]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowResults(true);

    if (supabase) {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.id) {
        await supabase.from('business_talent_searches').insert({
          company_user_id: authData.user.id,
          job_id: selectedJobId || 'general',
          industry: selectedIndustryKey || null,
          custom_industry: selectedIndustryKey === 'Other' ? customIndustry.trim() || null : null,
          prompt_text: prompt.trim() || null,
          manual_requirements: requirementValues,
          matched_count: filteredCandidates.length
        });
      }
    }
  };

  const handleShortlist = async (candidateId: string) => {
    const exists = shortlistedIds.includes(candidateId);
    setShortlistedIds((prev) =>
      exists ? prev.filter((id) => id !== candidateId) : [...prev, candidateId]
    );

    if (supabase) {
      if (exists) {
        await supabase.from('shortlisted_candidates').delete().eq('candidate_id', candidateId);
      } else {
        await supabase.from('shortlisted_candidates').insert({
          candidate_id: candidateId,
          job_position_id: selectedJobId || null
        });
      }
    }
  };

  const filtersList: string[] = page.filters || [
    'Role / Title',
    'Skills',
    'Experience (Years)',
    'Location',
    'Languages',
    'Education'
  ];

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="flex-1 flex flex-col items-center relative">
      <div
        className="w-full max-w-4xl flex flex-col items-center text-center py-4"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 35%, rgba(124, 58, 237, 0.14) 0%, rgba(124, 58, 237, 0.03) 45%, transparent 72%)'
        }}
      >
        <div className="inline-flex items-center px-3.5 py-1 rounded-full bg-[#1a0d33] border border-purple-500/35 text-[10px] font-semibold tracking-widest text-purple-300 uppercase mb-5">
          {page.pill}
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
          {page.titlePrefix} <span className="text-[#9353ff]">{page.titleHighlight}</span>
        </h1>

        <p className="text-xs sm:text-sm text-gray-400 max-w-xl mt-3 leading-relaxed">
          {page.subtitle}
        </p>

        {/* Bloco 1: Search for a specific job + Industry Directory (sem números, ordem alfabética por idioma) */}
        <div className="w-full max-w-3xl mt-6 text-left">
          <div className="rounded-2xl bg-[#0b0614]/95 border border-purple-500/25 px-4 py-3 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <Briefcase className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-xs font-semibold text-white truncate">
                  {copy.specificJobLabel}
                </span>
              </div>

              <div className="relative sm:w-72 shrink-0">
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full appearance-none pl-3.5 pr-9 py-2 rounded-xl bg-[#130a24] border border-purple-500/35 text-xs font-medium text-white focus:outline-none focus:border-purple-400 cursor-pointer"
                >
                  <option value="" className="bg-[#0d0718] text-white">
                    {copy.generalSearch}
                  </option>
                  {jobs.map((job) => (
                    <option key={job.id} value={job.id} className="bg-[#0d0718] text-white">
                      {job.title}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-purple-300 pointer-events-none right-3 top-1/2 -translate-y-1/2 absolute" />
              </div>
            </div>

            {/* Industry Directory */}
            <div className="pt-3 border-t border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div className="flex items-center gap-2.5 min-w-0">
                <Building2 className="w-4 h-4 text-purple-400 shrink-0" />
                <span className="text-xs font-semibold text-white truncate">
                  {copy.industryDirectoryLabel}
                </span>
              </div>

              <div className="relative sm:w-72 shrink-0">
                <button
                  type="button"
                  onClick={() => setIndustryPickerOpen((prev) => !prev)}
                  className="w-full pl-3.5 pr-3 py-2 rounded-xl bg-[#130a24] border border-purple-500/35 hover:border-purple-400 text-xs font-medium text-white flex items-center justify-between gap-2 transition cursor-pointer"
                >
                  <span className="truncate">
                    {selectedIndustryDisplay || copy.selectIndustryBtn}
                  </span>
                  {industryPickerOpen ? (
                    <ChevronUp className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                  )}
                </button>

                {industryPickerOpen && (
                  <div className="absolute right-0 mt-2 w-full sm:w-80 rounded-2xl bg-[#110820] border border-purple-500/40 shadow-2xl z-30 p-3 space-y-2">
                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={industrySearch}
                        onChange={(e) => setIndustrySearch(e.target.value)}
                        placeholder={copy.filterIndustriesPlaceholder}
                        className="w-full bg-white/5 border border-purple-500/25 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                      />
                    </div>

                    <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedIndustryKey('');
                          setCustomIndustry('');
                          setIndustryPickerOpen(false);
                        }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                          !selectedIndustryKey
                            ? 'bg-purple-600/30 text-white font-semibold'
                            : 'text-gray-300 hover:bg-white/5'
                        }`}
                      >
                        {copy.allIndustries}
                      </button>

                      {filteredIndustries.map((item) => {
                        const label = item.labels[lang] || item.labels.en;
                        const isSelected = selectedIndustryKey === item.key;
                        return (
                          <button
                            key={item.key}
                            type="button"
                            onClick={() => {
                              setSelectedIndustryKey(item.key);
                              if (item.key !== 'Other') setCustomIndustry('');
                              setIndustryPickerOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition cursor-pointer ${
                              isSelected
                                ? 'bg-purple-600/30 text-white font-semibold'
                                : 'text-gray-300 hover:bg-white/5'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Campo opcional quando o recrutador escolhe Other */}
            {selectedIndustryKey === 'Other' && (
              <div className="pt-2 flex items-center gap-2">
                <input
                  type="text"
                  value={customIndustry}
                  onChange={(e) => setCustomIndustry(e.target.value)}
                  placeholder={copy.otherIndustryPlaceholder}
                  className="flex-1 bg-white/5 border border-purple-500/30 rounded-xl px-3.5 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-400"
                />
                {customIndustry && (
                  <button
                    type="button"
                    onClick={() => setCustomIndustry('')}
                    className="p-2 rounded-lg bg-white/5 text-gray-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bloco 2: Caixa de pesquisa + "+ Add requirements" com os filtros manuais dentro */}
        <form onSubmit={handleSearch} className="w-full max-w-3xl mt-4 text-left">
          <div className="rounded-2xl bg-[#0d0718]/95 border border-purple-500/45 shadow-[0_0_45px_-12px_rgba(124,58,237,0.45)] p-5">
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={page.promptPlaceholder}
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-gray-400/80 resize-none focus:outline-none"
            />
            <p className="text-xs text-gray-500 mt-1 mb-4">{page.promptExample}</p>

            {/* Painel de requisitos manuais dentro de "+ Add requirements" */}
            {requirementsOpen && (
              <div className="mb-4 p-4 rounded-xl bg-[#0b0614] border border-purple-500/30 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-purple-200">
                    {page.orFilters || 'Manual Requirements'}
                  </span>
                  {activeRequirementsCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setRequirementValues({});
                        setFocusedFilter(null);
                      }}
                      className="text-[11px] text-gray-400 hover:text-white cursor-pointer"
                    >
                      {copy.clearRequirements}
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {filtersList.map((label: string, idx: number) => {
                    const Icon = FILTER_ICONS[idx % FILTER_ICONS.length];
                    const hasValue = Boolean(requirementValues[label]?.trim());
                    const isFocused = focusedFilter === label;
                    return (
                      <button
                        key={label}
                        type="button"
                        onClick={() => setFocusedFilter(isFocused ? null : label)}
                        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium border transition cursor-pointer ${
                          isFocused || hasValue
                            ? 'bg-purple-950/70 border-purple-400 text-white'
                            : 'bg-[#120922] border-purple-900/50 text-gray-200 hover:border-purple-500/50'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5 text-purple-300/80" />
                        <span>{label}</span>
                        {hasValue && (
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {filtersList.map((label: string, idx: number) => {
                    const Icon = FILTER_ICONS[idx % FILTER_ICONS.length];
                    const val = requirementValues[label] || '';
                    if (focusedFilter && focusedFilter !== label && !val.trim()) {
                      return null;
                    }
                    return (
                      <div
                        key={label}
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#130a24] border border-purple-500/25 focus-within:border-purple-400"
                      >
                        <Icon className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                        <input
                          type="text"
                          value={val}
                          onChange={(e) =>
                            setRequirementValues((prev) => ({
                              ...prev,
                              [label]: e.target.value
                            }))
                          }
                          placeholder={`${label}...`}
                          className="w-full bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
                        />
                        {val && (
                          <button
                            type="button"
                            onClick={() =>
                              setRequirementValues((prev) => {
                                const next = { ...prev };
                                delete next[label];
                                return next;
                              })
                            }
                            className="text-gray-400 hover:text-white cursor-pointer"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => setRequirementsOpen((prev) => !prev)}
                className="inline-flex items-center gap-2 text-xs font-medium text-gray-300 hover:text-white transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-purple-400" />
                <span>{page.addRequirements}</span>
                {activeRequirementsCount > 0 && (
                  <span className="px-1.5 py-0.5 rounded-full bg-purple-600 text-[10px] font-bold text-white">
                    {activeRequirementsCount}
                  </span>
                )}
              </button>

              <div className="flex items-center gap-2.5 ml-auto">
                <Link
                  href="/dashboard/business/skillgap-ai"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-950/50 hover:bg-purple-900/50 border border-purple-500/35 text-xs font-semibold text-purple-200 transition"
                >
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                  <span>{page.aiBrandBadge}</span>
                </Link>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] text-xs font-semibold text-white transition cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{page.findMatches}</span>
                </button>
              </div>
            </div>
          </div>
        </form>

        {/* Bloco 3: Retângulo "No job positions found in the database." abaixo de "Find AI Matches" */}
        {!loading && jobs.length === 0 && (
          <div className="w-full max-w-3xl mt-4 rounded-xl bg-[#0e081a] border border-white/10 px-4 py-3 flex items-center justify-between gap-2 text-xs text-left">
            <span className="text-gray-400">{copy.noJobs}</span>
            <Link href="/dashboard/business/job-positions" className="text-purple-300 hover:text-white underline shrink-0">
              {copy.goToJobs}
            </Link>
          </div>
        )}
      </div>

      {showResults && (
        <div className="w-full max-w-4xl mt-8 rounded-2xl bg-[#07030e] border border-white/[0.08] p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">{copy.resultsTitle}</h2>
              <p className="text-xs text-purple-300 mt-0.5">
                {copy.planLimitNote} <strong>{maxPerJob}</strong>
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setPrompt('');
                setRequirementValues({});
                setFocusedFilter(null);
                setSelectedJobId('');
                setSelectedIndustryKey('');
                setCustomIndustry('');
                setShowResults(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{copy.reset}</span>
            </button>
          </div>

          {filteredCandidates.length === 0 ? (
            <p className="text-xs text-gray-400 py-6 text-center">{copy.emptyCandidates}</p>
          ) : (
            <div className="space-y-4">
              {filteredCandidates.map((cand) => {
                const isSaved = shortlistedIds.includes(cand.id);
                return (
                  <div
                    key={cand.id}
                    className="rounded-2xl bg-[#0b0614] border border-white/[0.08] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className="w-10 h-10 rounded-full bg-[#1a0d33] border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0">
                        <User className="w-4 h-4" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="text-sm font-bold text-white">{cand.full_name}</h3>
                          {cand.industry && (
                            <span className="px-2 py-0.5 rounded-full bg-purple-950 border border-purple-500/30 text-[10px] text-purple-200">
                              {cand.industry}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          {cand.role} • {cand.location} • {cand.experience_years} {copy.years}
                        </p>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {(cand.skills || []).map((sk) => (
                            <span
                              key={sk}
                              className="px-2 py-0.5 rounded bg-purple-950/70 border border-purple-500/25 text-[11px] text-purple-200"
                            >
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => setInspected(cand)}
                        className="px-3.5 py-2 rounded-lg bg-[#0d0718] border border-purple-500/45 text-xs font-semibold text-white cursor-pointer"
                      >
                        {copy.viewProfile}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleShortlist(cand.id)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold cursor-pointer ${
                          isSaved ? 'bg-emerald-500 text-black' : 'bg-white text-black'
                        }`}
                      >
                        {isSaved ? copy.shortlisted : copy.shortlist}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {inspected && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl bg-[#0c0716] border border-purple-500/35 p-6 space-y-3 text-xs">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-bold text-white">{inspected.full_name}</h3>
                <p className="text-purple-300">{inspected.role}</p>
              </div>
              <button onClick={() => setInspected(null)} className="text-gray-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            {inspected.industry && <p className="text-purple-200">{inspected.industry}</p>}
            <p className="text-gray-300">{inspected.location}</p>
            <p className="text-gray-300">{inspected.education}</p>
            <p className="text-gray-300">{(inspected.languages || []).join(', ')}</p>
          </div>
        </div>
      )}
    </div>
  );
}