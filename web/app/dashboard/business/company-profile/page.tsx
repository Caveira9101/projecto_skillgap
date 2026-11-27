'use client';

import React, { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Building2,
  Upload,
  Trash2,
  Eye,
  Save,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Plus,
  Layers,
  Award,
  HeartHandshake,
  Users,
  Briefcase,
  ShieldCheck,
  Languages as LanguagesIcon,
  Check,
  X
} from 'lucide-react';
import { supabase, type LangCode } from '@/lib/business-supabase';
import { useBusinessDashboardLang } from '../layout';

export interface LeadershipMember {
  id: string;
  fullName: string;
  position: string;
  department: string;
  photoUrl: string;
  bio: string;
  linkedin: string;
  responsibilities: string;
  verified: boolean;
}

export interface ProductServiceItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  website: string;
  features: string;
}

export interface GalleryMediaItem {
  id: string;
  category:
    | 'Office Spaces'
    | 'Workstations'
    | 'Meeting Rooms'
    | 'Company Events'
    | 'Team Activities'
    | 'Facilities';
  caption: string;
  imageUrl: string;
}

export interface AchievementCertItem {
  id: string;
  title: string;
  category: 'Award' | 'Certification' | 'Licence' | 'Partnership' | 'Project' | 'Milestone';
  issuingOrg: string;
  issueDate: string;
  expiryDate: string;
  description: string;
  documentUrl: string;
  verificationUrl: string;
  status:
    | 'Not Submitted'
    | 'Verification Pending'
    | 'Verified'
    | 'Verification Rejected'
    | 'Additional Information Required';
}

export interface SocialInitiativeItem {
  id: string;
  title: string;
  category:
    | 'Community Projects'
    | 'Environmental Initiatives'
    | 'Social Impact'
    | 'Inclusion Programmes'
    | 'Volunteering Activities'
    | 'Sustainability Projects';
  description: string;
  imageUrl: string;
  date: string;
  externalLink: string;
}

export type BenefitCategoryKey =
  | 'financial'
  | 'health'
  | 'growth'
  | 'flexibility'
  | 'career'
  | 'additional';

export interface CompanyProfileData {
  officialName: string;
  commercialName: string;
  tagline: string;
  industry: string;
  companyType: string;
  yearFounded: string;
  companySize: string;
  website: string;
  officialEmail: string;
  businessPhone: string;
  country: string;
  provinceState: string;
  city: string;
  physicalAddress: string;

  overview: string;
  ourStory: string;
  mission: string;
  vision: string;
  coreValues: string;
  whatWeDo: string;
  ourImpact: string;

  workEnvironmentDesc: string;
  leadershipStyle: string;
  teamCollaboration: string;
  diversityInclusion: string;
  professionalGrowth: string;
  workLifeBalance: string;
  learningCulture: string;
  innovationCulture: string;
  cultureTags: string[];
  cultureInPractice: string;

  totalEmployees: string;
  departmentsList: string;
  geographicalPresence: string;
  internationalTeams: string;
  orgStructure: string;
  leadership: LeadershipMember[];

  productsServices: ProductServiceItem[];

  workModel: 'On-site' | 'Remote' | 'Hybrid' | 'Flexible Working';
  gallery: GalleryMediaItem[];

  benefits: Record<BenefitCategoryKey, string[]>;
  benefitConditions: string;

  achievements: AchievementCertItem[];
  socialInitiatives: SocialInitiativeItem[];

  teamPermissions: {
    viewProfile: boolean;
    editProfile: boolean;
    manageMedia: boolean;
    manageVerificationDocs: boolean;
    publishProfile: boolean;
  };
}

export type SectionKey =
  | 'identity'
  | 'about'
  | 'culture'
  | 'leadership'
  | 'products'
  | 'environment'
  | 'benefits'
  | 'achievements'
  | 'social';

const DEFAULT_PROFILE_DATA: CompanyProfileData = {
  officialName: '',
  commercialName: '',
  tagline: '',
  industry: '',
  companyType: '',
  yearFounded: '',
  companySize: '',
  website: '',
  officialEmail: '',
  businessPhone: '',
  country: '',
  provinceState: '',
  city: '',
  physicalAddress: '',
  overview: '',
  ourStory: '',
  mission: '',
  vision: '',
  coreValues: '',
  whatWeDo: '',
  ourImpact: '',
  workEnvironmentDesc: '',
  leadershipStyle: '',
  teamCollaboration: '',
  diversityInclusion: '',
  professionalGrowth: '',
  workLifeBalance: '',
  learningCulture: '',
  innovationCulture: '',
  cultureTags: [],
  cultureInPractice: '',
  totalEmployees: '',
  departmentsList: '',
  geographicalPresence: '',
  internationalTeams: '',
  orgStructure: '',
  leadership: [],
  productsServices: [],
  workModel: 'Hybrid',
  gallery: [],
  benefits: {
    financial: [],
    health: [],
    growth: [],
    flexibility: [],
    career: [],
    additional: []
  },
  benefitConditions: '',
  achievements: [],
  socialInitiatives: [],
  teamPermissions: {
    viewProfile: true,
    editProfile: true,
    manageMedia: true,
    manageVerificationDocs: true,
    publishProfile: true
  }
};

const DEFAULT_VISIBILITY: Record<SectionKey, boolean> = {
  identity: true,
  about: true,
  culture: true,
  leadership: true,
  products: true,
  environment: true,
  benefits: true,
  achievements: true,
  social: true
};

const CULTURE_TAG_KEYS = [
  'Innovation',
  'Collaboration',
  'Flexibility',
  'Professional Growth',
  'Diversity',
  'Remote Friendly',
  'Continuous Learning',
  'Teamwork',
  'Accountability',
  'Creativity'
] as const;

const BENEFIT_KEYS: Record<BenefitCategoryKey, readonly string[]> = {
  financial: ['Performance Bonus', 'Equity / Stock Options', 'Transport Allowance', 'Meal Allowance'],
  health: ['Private Health Insurance', 'Dental & Vision Care', 'Mental Health Support', 'Wellness Stipend'],
  growth: ['Training Budget', 'Conference Sponsorship', 'Certification Support', 'Language Courses'],
  flexibility: ['Flexible Hours', 'Remote Work Days', 'Compressed Workweek', 'Paid Sabbatical'],
  career: ['Mentorship Programme', 'Internal Mobility', 'Leadership Track', 'Clear Career Ladder'],
  additional: ['Relocation Support', 'Parental Leave', 'Laptop & Home Office Kit', 'Team Retreats']
};

interface LocalizedCopy {
  title: string;
  subtitle: string;
  saveDraft: string;
  saving: string;
  publish: string;
  unpublish: string;
  previewTab: string;
  editTab: string;
  aiTab: string;
  strengthTitle: string;
  published: string;
  draft: string;
  verificationStatus: string;
  completeSections: string;
  incompleteSections: string;
  recommendations: string;
  allSectionsComplete: string;
  uploadLogo: string;
  uploadCover: string;
  companyLogoLabel: string;
  coverImageLabel: string;
  removeImage: string;
  savedSuccess: string;
  publishedSuccess: string;
  unpublishedSuccess: string;
  errorPrefix: string;
  aiBuilderTitle: string;
  aiWriterTitle: string;
  aiTranslateTitle: string;
  targetFieldLabel: string;
  polishBtn: string;
  acceptSuggestion: string;
  rejectSuggestion: string;
  translateBtn: string;
  approveTranslation: string;
  publicWarning: string;
  addItem: string;
  deleteItem: string;
  confirmDelete: string;
  publicBadge: string;
  hiddenBadge: string;
  sections: Record<SectionKey, string>;
  fields: Record<string, string>;
  benefitCategories: Record<BenefitCategoryKey, string>;
  benefitItems: Record<string, string>;
  cultureTags: Record<string, string>;
  hints: Record<SectionKey, string>;
}

const UI_COPY: Record<LangCode, LocalizedCopy> = {
  en: {
    title: 'Company Profile',
    subtitle: 'Build a complete, credible institutional presentation for candidates before they apply.',
    saveDraft: 'Save as Draft',
    saving: 'Saving...',
    publish: 'Publish Profile',
    unpublish: 'Unpublish Profile',
    previewTab: 'Public Profile Preview',
    editTab: 'Edit Profile',
    aiTab: 'SkillGap AI Assistant',
    strengthTitle: 'Company Profile Strength',
    published: 'Published',
    draft: 'Draft',
    verificationStatus: 'Verification Status',
    completeSections: 'Completed Sections',
    incompleteSections: 'Incomplete Sections',
    recommendations: 'Recommendations',
    allSectionsComplete: 'Profile core sections are complete.',
    uploadLogo: 'Upload Company Logo',
    uploadCover: 'Upload Cover Image',
    companyLogoLabel: 'Company Logo',
    coverImageLabel: 'Cover Image',
    removeImage: 'Remove Image',
    savedSuccess: 'Company profile saved to Supabase.',
    publishedSuccess: 'Company profile is now live for candidates.',
    unpublishedSuccess: 'Company profile set back to draft.',
    errorPrefix: 'Error: ',
    aiBuilderTitle: 'AI Profile Builder & Completeness Analysis',
    aiWriterTitle: 'AI Writing Assistant (Editable Suggestions Only)',
    aiTranslateTitle: 'AI Translation (Review & Approve Before Applying)',
    targetFieldLabel: 'Target Field',
    polishBtn: 'Polish & Structure Text',
    acceptSuggestion: 'Accept Suggestion',
    rejectSuggestion: 'Reject',
    translateBtn: 'Generate Translation',
    approveTranslation: 'Approve & Apply to Field',
    publicWarning: 'Review the public summary below. Private contact details (phone/internal notes) are never exposed publicly.',
    addItem: 'Add',
    deleteItem: 'Delete',
    confirmDelete: 'Confirm deletion of this item?',
    publicBadge: 'Public',
    hiddenBadge: 'Hidden',
    sections: {
      identity: '4.1 Company Identity',
      about: '4.2 About the Company',
      culture: '4.3 Company Culture',
      leadership: '4.4 Leadership & Team',
      products: '4.5 Products & Services',
      environment: '4.6 Work Environment',
      benefits: '4.7 Benefits & Experience',
      achievements: '4.8 Achievements & Certs',
      social: '4.9 Social & Sustainability'
    },
    fields: {
      officialName: 'Official Company Name',
      commercialName: 'Commercial Name',
      tagline: 'Company Tagline',
      industry: 'Industry',
      companyType: 'Company Type',
      yearFounded: 'Year Founded',
      companySize: 'Company Size',
      website: 'Website',
      officialEmail: 'Official E-mail',
      businessPhone: 'Business Phone',
      country: 'Country',
      provinceState: 'Province/State',
      city: 'City',
      physicalAddress: 'Physical Address',
      overview: 'Company Overview',
      ourStory: 'Our Story',
      mission: 'Mission',
      vision: 'Vision',
      coreValues: 'Core Values',
      whatWeDo: 'What We Do',
      ourImpact: 'Our Impact',
      workEnvironmentDesc: 'Work Environment',
      leadershipStyle: 'Leadership Style',
      teamCollaboration: 'Team Collaboration',
      diversityInclusion: 'Diversity & Inclusion',
      professionalGrowth: 'Professional Growth',
      workLifeBalance: 'Work-Life Balance',
      learningCulture: 'Learning Culture',
      innovationCulture: 'Innovation Culture',
      cultureTags: 'Culture Tags',
      cultureInPractice: 'Our Culture in Practice',
      totalEmployees: 'Total Number of Employees',
      departmentsList: 'Departments',
      geographicalPresence: 'Geographical Presence',
      internationalTeams: 'International Teams',
      orgStructure: 'Organisational Structure',
      workModel: 'General Work Model',
      benefitConditions: 'Conditions or Role Restrictions'
    },
    benefitCategories: {
      financial: 'Financial',
      health: 'Health',
      growth: 'Growth',
      flexibility: 'Flexibility',
      career: 'Career',
      additional: 'Additional'
    },
    benefitItems: {
      'Performance Bonus': 'Performance Bonus',
      'Equity / Stock Options': 'Equity / Stock Options',
      'Transport Allowance': 'Transport Allowance',
      'Meal Allowance': 'Meal Allowance',
      'Private Health Insurance': 'Private Health Insurance',
      'Dental & Vision Care': 'Dental & Vision Care',
      'Mental Health Support': 'Mental Health Support',
      'Wellness Stipend': 'Wellness Stipend',
      'Training Budget': 'Training Budget',
      'Conference Sponsorship': 'Conference Sponsorship',
      'Certification Support': 'Certification Support',
      'Language Courses': 'Language Courses',
      'Flexible Hours': 'Flexible Hours',
      'Remote Work Days': 'Remote Work Days',
      'Compressed Workweek': 'Compressed Workweek',
      'Paid Sabbatical': 'Paid Sabbatical',
      'Mentorship Programme': 'Mentorship Programme',
      'Internal Mobility': 'Internal Mobility',
      'Leadership Track': 'Leadership Track',
      'Clear Career Ladder': 'Clear Career Ladder',
      'Relocation Support': 'Relocation Support',
      'Parental Leave': 'Parental Leave',
      'Laptop & Home Office Kit': 'Laptop & Home Office Kit',
      'Team Retreats': 'Team Retreats'
    },
    cultureTags: {
      Innovation: 'Innovation',
      Collaboration: 'Collaboration',
      Flexibility: 'Flexibility',
      'Professional Growth': 'Professional Growth',
      Diversity: 'Diversity',
      'Remote Friendly': 'Remote Friendly',
      'Continuous Learning': 'Continuous Learning',
      Teamwork: 'Teamwork',
      Accountability: 'Accountability',
      Creativity: 'Creativity'
    },
    hints: {
      identity: 'Add Official Company Name, Industry, and Country.',
      about: 'Fill Company Overview, Mission, and Vision.',
      culture: 'Describe Work Environment or select Culture Tags.',
      leadership: 'Add total employees or a leadership member.',
      products: 'Add at least one product or service.',
      environment: 'Confirm work model and upload logo or workspace gallery media.',
      benefits: 'Select at least one benefit offered to employees.',
      achievements: 'Add certifications, awards, or milestones.',
      social: 'Add a community or sustainability initiative.'
    }
  },
  pt: {
    title: 'Perfil da Empresa',
    subtitle: 'Constrói uma apresentação institucional completa e credível para os candidatos antes de se candidatarem.',
    saveDraft: 'Guardar Rascunho',
    saving: 'A guardar...',
    publish: 'Publicar Perfil',
    unpublish: 'Despublicar Perfil',
    previewTab: 'Pré-visualização Pública',
    editTab: 'Editar Perfil',
    aiTab: 'Assistente SkillGap AI',
    strengthTitle: 'Força do Perfil da Empresa',
    published: 'Publicado',
    draft: 'Rascunho',
    verificationStatus: 'Estado de Verificação',
    completeSections: 'Secções Completas',
    incompleteSections: 'Secções Incompletas',
    recommendations: 'Recomendações',
    allSectionsComplete: 'As secções principais do perfil estão completas.',
    uploadLogo: 'Carregar Logótipo',
    uploadCover: 'Carregar Imagem de Capa',
    companyLogoLabel: 'Logótipo da Empresa',
    coverImageLabel: 'Imagem de Capa',
    removeImage: 'Remover Imagem',
    savedSuccess: 'Perfil da empresa guardado no Supabase.',
    publishedSuccess: 'O perfil da empresa está agora público para candidatos.',
    unpublishedSuccess: 'O perfil da empresa voltou ao estado de rascunho.',
    errorPrefix: 'Erro: ',
    aiBuilderTitle: 'Construtor IA de Perfil & Análise de Completude',
    aiWriterTitle: 'Assistente de Escrita IA (Apenas Sugestões Editáveis)',
    aiTranslateTitle: 'Tradução IA (Rever e Aprovar Antes de Aplicar)',
    targetFieldLabel: 'Campo Alvo',
    polishBtn: 'Melhorar e Organizar Texto',
    acceptSuggestion: 'Aceitar Sugestão',
    rejectSuggestion: 'Rejeitar',
    translateBtn: 'Gerar Tradução',
    approveTranslation: 'Aprovar e Aplicar no Campo',
    publicWarning: 'Revê o resumo público abaixo. Dados privados não são expostos na versão pública.',
    addItem: 'Adicionar',
    deleteItem: 'Apagar',
    confirmDelete: 'Confirmar a eliminação deste item?',
    publicBadge: 'Público',
    hiddenBadge: 'Oculto',
    sections: {
      identity: '4.1 Identidade da Empresa',
      about: '4.2 Sobre a Empresa',
      culture: '4.3 Cultura da Empresa',
      leadership: '4.4 Liderança e Equipa',
      products: '4.5 Produtos e Serviços',
      environment: '4.6 Ambiente de Trabalho',
      benefits: '4.7 Benefícios e Experiência',
      achievements: '4.8 Conquistas e Certificações',
      social: '4.9 Responsabilidade Social e Sustentabilidade'
    },
    fields: {
      officialName: 'Nome Oficial da Empresa',
      commercialName: 'Nome Comercial',
      tagline: 'Slogan da Empresa',
      industry: 'Setor de Atividade',
      companyType: 'Tipo de Empresa',
      yearFounded: 'Ano de Fundação',
      companySize: 'Dimensão da Empresa',
      website: 'Website',
      officialEmail: 'E-mail Oficial',
      businessPhone: 'Telefone Corporativo',
      country: 'País',
      provinceState: 'Província / Estado',
      city: 'Cidade',
      physicalAddress: 'Endereço Físico',
      overview: 'Visão Geral da Empresa',
      ourStory: 'A Nossa História',
      mission: 'Missão',
      vision: 'Visão',
      coreValues: 'Valores Fundamentais',
      whatWeDo: 'O Que Fazemos',
      ourImpact: 'O Nosso Impacto',
      workEnvironmentDesc: 'Ambiente de Trabalho',
      leadershipStyle: 'Estilo de Liderança',
      teamCollaboration: 'Colaboração em Equipa',
      diversityInclusion: 'Diversidade e Inclusão',
      professionalGrowth: 'Crescimento Profissional',
      workLifeBalance: 'Equilíbrio Vida-Trabalho',
      learningCulture: 'Cultura de Aprendizagem',
      innovationCulture: 'Cultura de Inovação',
      cultureTags: 'Etiquetas de Cultura',
      cultureInPractice: 'A Nossa Cultura na Prática',
      totalEmployees: 'Número Total de Colaboradores',
      departmentsList: 'Departamentos',
      geographicalPresence: 'Presença Geográfica',
      internationalTeams: 'Equipas Internacionais',
      orgStructure: 'Estrutura Organizacional',
      workModel: 'Modelo Geral de Trabalho',
      benefitConditions: 'Condições ou Restrições por Função'
    },
    benefitCategories: {
      financial: 'Financeiros',
      health: 'Saúde',
      growth: 'Crescimento',
      flexibility: 'Flexibilidade',
      career: 'Carreira',
      additional: 'Adicionais'
    },
    benefitItems: {
      'Performance Bonus': 'Bónus de Desempenho',
      'Equity / Stock Options': 'Participação / Stock Options',
      'Transport Allowance': 'Subsídio de Transporte',
      'Meal Allowance': 'Subsídio de Alimentação',
      'Private Health Insurance': 'Seguro de Saúde Privado',
      'Dental & Vision Care': 'Cuidados Dentários e Visão',
      'Mental Health Support': 'Apoio à Saúde Mental',
      'Wellness Stipend': 'Subsídio de Bem-Estar',
      'Training Budget': 'Orçamento de Formação',
      'Conference Sponsorship': 'Patrocínio a Conferências',
      'Certification Support': 'Apoio a Certificações',
      'Language Courses': 'Cursos de Línguas',
      'Flexible Hours': 'Horário Flexível',
      'Remote Work Days': 'Dias de Trabalho Remoto',
      'Compressed Workweek': 'Semana de Trabalho Compactada',
      'Paid Sabbatical': 'Licença Sabática Remunerada',
      'Mentorship Programme': 'Programa de Mentoria',
      'Internal Mobility': 'Mobilidade Interna',
      'Leadership Track': 'Percurso de Liderança',
      'Clear Career Ladder': 'Plano de Carreira Claro',
      'Relocation Support': 'Apoio à Deslocação',
      'Parental Leave': 'Licença Parental',
      'Laptop & Home Office Kit': 'Computador e Kit de Home Office',
      'Team Retreats': 'Encontros de Equipa'
    },
    cultureTags: {
      Innovation: 'Inovação',
      Collaboration: 'Colaboração',
      Flexibility: 'Flexibilidade',
      'Professional Growth': 'Crescimento Profissional',
      Diversity: 'Diversidade',
      'Remote Friendly': 'Trabalho Remoto',
      'Continuous Learning': 'Aprendizagem Contínua',
      Teamwork: 'Trabalho em Equipa',
      Accountability: 'Responsabilização',
      Creativity: 'Criatividade'
    },
    hints: {
      identity: 'Adiciona o Nome Oficial da Empresa, o Setor de Atividade e o País.',
      about: 'Preenche a Visão Geral, a Missão e a Visão.',
      culture: 'Descreve o Ambiente de Trabalho ou seleciona Etiquetas de Cultura.',
      leadership: 'Adiciona o número total de colaboradores ou um membro da liderança.',
      products: 'Adiciona pelo menos um produto ou serviço.',
      environment: 'Confirma o modelo de trabalho e carrega o logótipo ou fotos do espaço.',
      benefits: 'Seleciona pelo menos um benefício oferecido aos colaboradores.',
      achievements: 'Adiciona certificações, prémios ou marcos.',
      social: 'Adiciona uma iniciativa comunitária ou de sustentabilidade.'
    }
  },
  es: {
    title: 'Perfil de Empresa',
    subtitle: 'Crea una presentación institucional completa y creíble para los candidatos.',
    saveDraft: 'Guardar Borrador',
    saving: 'Guardando...',
    publish: 'Publicar Perfil',
    unpublish: 'Despublicar Perfil',
    previewTab: 'Vista Previa Pública',
    editTab: 'Editar Perfil',
    aiTab: 'Asistente SkillGap AI',
    strengthTitle: 'Nivel de Completitud del Perfil',
    published: 'Publicado',
    draft: 'Borrador',
    verificationStatus: 'Estado de Verificación',
    completeSections: 'Secciones Completas',
    incompleteSections: 'Secciones Incompletas',
    recommendations: 'Recomendaciones',
    allSectionsComplete: 'Las secciones principales del perfil están completas.',
    uploadLogo: 'Subir Logotipo',
    uploadCover: 'Subir Imagen de Portada',
    companyLogoLabel: 'Logotipo de la Empresa',
    coverImageLabel: 'Imagen de Portada',
    removeImage: 'Eliminar Imagen',
    savedSuccess: 'Perfil empresarial guardado en Supabase.',
    publishedSuccess: 'El perfil empresarial ya está publicado.',
    unpublishedSuccess: 'El perfil empresarial volvió a borrador.',
    errorPrefix: 'Error: ',
    aiBuilderTitle: 'Constructor IA de Perfil y Análisis',
    aiWriterTitle: 'Asistente de Redacción IA (Sugerencias Editables)',
    aiTranslateTitle: 'Traducción IA (Revisar y Aprobar)',
    targetFieldLabel: 'Campo Objetivo',
    polishBtn: 'Mejorar y Organizar Texto',
    acceptSuggestion: 'Aceptar Sugerencia',
    rejectSuggestion: 'Rechazar',
    translateBtn: 'Generar Traducción',
    approveTranslation: 'Aprobar y Aplicar',
    publicWarning: 'Revisa el resumen público. La información privada nunca se muestra públicamente.',
    addItem: 'Añadir',
    deleteItem: 'Eliminar',
    confirmDelete: '¿Confirmar la eliminación de este elemento?',
    publicBadge: 'Público',
    hiddenBadge: 'Oculto',
    sections: {
      identity: '4.1 Identidad de la Empresa',
      about: '4.2 Sobre la Empresa',
      culture: '4.3 Cultura Empresarial',
      leadership: '4.4 Liderazgo y Equipo',
      products: '4.5 Productos y Servicios',
      environment: '4.6 Entorno de Trabajo',
      benefits: '4.7 Beneficios y Experiencia',
      achievements: '4.8 Logros y Certificaciones',
      social: '4.9 Responsabilidad Social y Sostenibilidad'
    },
    fields: {
      officialName: 'Nombre Oficial de la Empresa',
      commercialName: 'Nombre Comercial',
      tagline: 'Lema de la Empresa',
      industry: 'Industria',
      companyType: 'Tipo de Empresa',
      yearFounded: 'Año de Fundación',
      companySize: 'Tamaño de la Empresa',
      website: 'Sitio Web',
      officialEmail: 'Correo Oficial',
      businessPhone: 'Teléfono Corporativo',
      country: 'País',
      provinceState: 'Provincia / Estado',
      city: 'Ciudad',
      physicalAddress: 'Dirección Física',
      overview: 'Resumen de la Empresa',
      ourStory: 'Nuestra Historia',
      mission: 'Misión',
      vision: 'Visión',
      coreValues: 'Valores Fundamentales',
      whatWeDo: 'Qué Hacemos',
      ourImpact: 'Nuestro Impacto',
      workEnvironmentDesc: 'Entorno de Trabajo',
      leadershipStyle: 'Estilo de Liderazgo',
      teamCollaboration: 'Colaboración en Equipo',
      diversityInclusion: 'Diversidad e Inclusión',
      professionalGrowth: 'Crecimiento Profesional',
      workLifeBalance: 'Equilibrio Vida-Trabajo',
      learningCulture: 'Cultura de Aprendizaje',
      innovationCulture: 'Cultura de Innovación',
      cultureTags: 'Etiquetas de Cultura',
      cultureInPractice: 'Nuestra Cultura en la Práctica',
      totalEmployees: 'Número Total de Empleados',
      departmentsList: 'Departamentos',
      geographicalPresence: 'Presencia Geográfica',
      internationalTeams: 'Equipos Internacionales',
      orgStructure: 'Estructura Organizativa',
      workModel: 'Modelo General de Trabajo',
      benefitConditions: 'Condiciones o Restricciones por Puesto'
    },
    benefitCategories: {
      financial: 'Financieros',
      health: 'Salud',
      growth: 'Crecimiento',
      flexibility: 'Flexibilidad',
      career: 'Carrera',
      additional: 'Adicionales'
    },
    benefitItems: {
      'Performance Bonus': 'Bono por Desempeño',
      'Equity / Stock Options': 'Participación / Stock Options',
      'Transport Allowance': 'Auxilio de Transporte',
      'Meal Allowance': 'Auxilio de Alimentación',
      'Private Health Insurance': 'Seguro Médico Privado',
      'Dental & Vision Care': 'Salud Dental y Visual',
      'Mental Health Support': 'Apoyo de Salud Mental',
      'Wellness Stipend': 'Subsidio de Bienestar',
      'Training Budget': 'Presupuesto de Formación',
      'Conference Sponsorship': 'Patrocinio de Conferencias',
      'Certification Support': 'Apoyo a Certificaciones',
      'Language Courses': 'Cursos de Idiomas',
      'Flexible Hours': 'Horario Flexible',
      'Remote Work Days': 'Días de Trabajo Remoto',
      'Compressed Workweek': 'Semana Laboral Comprimida',
      'Paid Sabbatical': 'Año Sabático Pagado',
      'Mentorship Programme': 'Programa de Mentoría',
      'Internal Mobility': 'Movilidad Interna',
      'Leadership Track': 'Ruta de Liderazgo',
      'Clear Career Ladder': 'Plan de Carrera Claro',
      'Relocation Support': 'Apoyo de Reubicación',
      'Parental Leave': 'Licencia Parental',
      'Laptop & Home Office Kit': 'Equipo Portátil y Oficina en Casa',
      'Team Retreats': 'Encuentros de Equipo'
    },
    cultureTags: {
      Innovation: 'Innovación',
      Collaboration: 'Colaboración',
      Flexibility: 'Flexibilidad',
      'Professional Growth': 'Crecimiento Profesional',
      Diversity: 'Diversidad',
      'Remote Friendly': 'Trabajo Remoto',
      'Continuous Learning': 'Aprendizaje Continuo',
      Teamwork: 'Trabajo en Equipo',
      Accountability: 'Responsabilidad',
      Creativity: 'Creatividad'
    },
    hints: {
      identity: 'Añade Nombre Oficial, Industria y País.',
      about: 'Completa Resumen, Misión y Visión.',
      culture: 'Describe el Entorno de Trabajo o selecciona Etiquetas de Cultura.',
      leadership: 'Añade el total de empleados o un miembro de liderazgo.',
      products: 'Añade al menos un producto o servicio.',
      environment: 'Confirma el modelo de trabajo y sube logotipo o galería.',
      benefits: 'Selecciona al menos un beneficio.',
      achievements: 'Añade certificaciones, premios o hitos.',
      social: 'Añade una iniciativa comunitaria o de sostenibilidad.'
    }
  },
  fr: {
    title: 'Profil Entreprise',
    subtitle: 'Présentez votre identité institutionnelle, votre culture et vos engagements aux candidats.',
    saveDraft: 'Enregistrer Brouillon',
    saving: 'Enregistrement...',
    publish: 'Publier le Profil',
    unpublish: 'Dépublier le Profil',
    previewTab: 'Aperçu Public',
    editTab: 'Modifier le Profil',
    aiTab: 'Assistant SkillGap AI',
    strengthTitle: 'Solidité du Profil Entreprise',
    published: 'Publié',
    draft: 'Brouillon',
    verificationStatus: 'Statut de Vérification',
    completeSections: 'Sections Complètes',
    incompleteSections: 'Sections Incomplètes',
    recommendations: 'Recommandations',
    allSectionsComplete: 'Les sections principales du profil sont complètes.',
    uploadLogo: 'Téléverser le Logo',
    uploadCover: 'Téléverser la Couverture',
    companyLogoLabel: 'Logo de l’Entreprise',
    coverImageLabel: 'Image de Couverture',
    removeImage: 'Supprimer l’Image',
    savedSuccess: 'Profil entreprise enregistré dans Supabase.',
    publishedSuccess: 'Le profil entreprise est maintenant publié.',
    unpublishedSuccess: 'Le profil entreprise est repassé en brouillon.',
    errorPrefix: 'Erreur : ',
    aiBuilderTitle: 'Assistant Profil IA & Complétude',
    aiWriterTitle: 'Assistant Rédaction IA (Suggestions Modifiables)',
    aiTranslateTitle: 'Traduction IA (Vérifier et Approuver)',
    targetFieldLabel: 'Champ Cible',
    polishBtn: 'Améliorer et Structurer',
    acceptSuggestion: 'Accepter la Suggestion',
    rejectSuggestion: 'Rejeter',
    translateBtn: 'Générer la Traduction',
    approveTranslation: 'Approuver et Appliquer',
    publicWarning: 'Vérifiez le résumé public. Les données privées ne sont jamais affichées publiquement.',
    addItem: 'Ajouter',
    deleteItem: 'Supprimer',
    confirmDelete: 'Confirmer la suppression de cet élément ?',
    publicBadge: 'Public',
    hiddenBadge: 'Masqué',
    sections: {
      identity: '4.1 Identité de l’Entreprise',
      about: '4.2 À Propos de l’Entreprise',
      culture: '4.3 Culture d’Entreprise',
      leadership: '4.4 Direction et Équipe',
      products: '4.5 Produits et Services',
      environment: '4.6 Environnement de Travail',
      benefits: '4.7 Avantages et Expérience',
      achievements: '4.8 Réalisations et Certifications',
      social: '4.9 Responsabilité Sociale et Durabilité'
    },
    fields: {
      officialName: 'Nom Officiel de l’Entreprise',
      commercialName: 'Nom Commercial',
      tagline: 'Slogan de l’Entreprise',
      industry: 'Secteur',
      companyType: 'Type d’Entreprise',
      yearFounded: 'Année de Création',
      companySize: 'Taille de l’Entreprise',
      website: 'Site Web',
      officialEmail: 'E-mail Officiel',
      businessPhone: 'Téléphone Professionnel',
      country: 'Pays',
      provinceState: 'Province / État',
      city: 'Ville',
      physicalAddress: 'Adresse Physique',
      overview: 'Présentation Générale',
      ourStory: 'Notre Histoire',
      mission: 'Mission',
      vision: 'Vision',
      coreValues: 'Valeurs Fondamentales',
      whatWeDo: 'Ce Que Nous Faisons',
      ourImpact: 'Notre Impact',
      workEnvironmentDesc: 'Environnement de Travail',
      leadershipStyle: 'Style de Direction',
      teamCollaboration: 'Collaboration d’Équipe',
      diversityInclusion: 'Diversité et Inclusion',
      professionalGrowth: 'Croissance Professionnelle',
      workLifeBalance: 'Équilibre Vie Pro / Vie Perso',
      learningCulture: 'Culture d’Apprentissage',
      innovationCulture: 'Culture d’Innovation',
      cultureTags: 'Tags de Culture',
      cultureInPractice: 'Notre Culture en Pratique',
      totalEmployees: 'Nombre Total d’Employés',
      departmentsList: 'Départements',
      geographicalPresence: 'Présence Géographique',
      internationalTeams: 'Équipes Internationales',
      orgStructure: 'Structure Organisationnelle',
      workModel: 'Modèle de Travail Général',
      benefitConditions: 'Conditions ou Restrictions par Poste'
    },
    benefitCategories: {
      financial: 'Financiers',
      health: 'Santé',
      growth: 'Développement',
      flexibility: 'Flexibilité',
      career: 'Carrière',
      additional: 'Complémentaires'
    },
    benefitItems: {
      'Performance Bonus': 'Prime de Performance',
      'Equity / Stock Options': 'Actions / Stock Options',
      'Transport Allowance': 'Indemnité de Transport',
      'Meal Allowance': 'Ticket / Indemnité Repas',
      'Private Health Insurance': 'Mutuelle Santé Privée',
      'Dental & Vision Care': 'Soins Dentaires et Optiques',
      'Mental Health Support': 'Soutien Santé Mentale',
      'Wellness Stipend': 'Allocation Bien-Être',
      'Training Budget': 'Budget Formation',
      'Conference Sponsorship': 'Prise en Charge Conférences',
      'Certification Support': 'Aide aux Certifications',
      'Language Courses': 'Cours de Langues',
      'Flexible Hours': 'Horaires Flexibles',
      'Remote Work Days': 'Télétravail',
      'Compressed Workweek': 'Semaine Compressée',
      'Paid Sabbatical': 'Congé Sabbatique Payé',
      'Mentorship Programme': 'Programme de Mentorat',
      'Internal Mobility': 'Mobilité Interne',
      'Leadership Track': 'Parcours Leadership',
      'Clear Career Ladder': 'Évolution de Carrière Claire',
      'Relocation Support': 'Aide à la Relocalisation',
      'Parental Leave': 'Congé Parental',
      'Laptop & Home Office Kit': 'Ordinateur et Kit Télétravail',
      'Team Retreats': 'Séminaires d’Équipe'
    },
    cultureTags: {
      Innovation: 'Innovation',
      Collaboration: 'Collaboration',
      Flexibility: 'Flexibilité',
      'Professional Growth': 'Croissance Professionnelle',
      Diversity: 'Diversité',
      'Remote Friendly': 'Télétravail',
      'Continuous Learning': 'Apprentissage Continu',
      Teamwork: 'Esprit d’Équipe',
      Accountability: 'Responsabilité',
      Creativity: 'Créativité'
    },
    hints: {
      identity: 'Ajoutez le Nom Officiel, le Secteur et le Pays.',
      about: 'Renseignez Présentation, Mission et Vision.',
      culture: 'Décrivez l’Environnement de Travail ou sélectionnez des Tags.',
      leadership: 'Ajoutez l’effectif total ou un membre de direction.',
      products: 'Ajoutez au moins un produit ou service.',
      environment: 'Confirmez le modèle de travail et ajoutez logo ou galerie.',
      benefits: 'Sélectionnez au moins un avantage.',
      achievements: 'Ajoutez certifications, distinctions ou étapes clés.',
      social: 'Ajoutez une initiative solidaire ou durable.'
    }
  },
  de: {
    title: 'Unternehmensprofil',
    subtitle: 'Gestalten Sie eine glaubwürdige Unternehmenspräsentation für potenzielle Bewerber.',
    saveDraft: 'Als Entwurf speichern',
    saving: 'Speichern...',
    publish: 'Profil veröffentlichen',
    unpublish: 'Veröffentlichung aufheben',
    previewTab: 'Öffentliche Vorschau',
    editTab: 'Profil bearbeiten',
    aiTab: 'SkillGap AI Assistent',
    strengthTitle: 'Profilstärke des Unternehmens',
    published: 'Veröffentlicht',
    draft: 'Entwurf',
    verificationStatus: 'Verifizierungsstatus',
    completeSections: 'Vollständige Bereiche',
    incompleteSections: 'Unvollständige Bereiche',
    recommendations: 'Empfehlungen',
    allSectionsComplete: 'Die Kernbereiche des Profils sind vollständig.',
    uploadLogo: 'Logo hochladen',
    uploadCover: 'Titelbild hochladen',
    companyLogoLabel: 'Unternehmenslogo',
    coverImageLabel: 'Titelbild',
    removeImage: 'Bild entfernen',
    savedSuccess: 'Unternehmensprofil in Supabase gespeichert.',
    publishedSuccess: 'Das Unternehmensprofil ist jetzt veröffentlicht.',
    unpublishedSuccess: 'Das Unternehmensprofil ist wieder ein Entwurf.',
    errorPrefix: 'Fehler: ',
    aiBuilderTitle: 'KI-Profil-Assistent & Vollständigkeit',
    aiWriterTitle: 'KI-Schreibassistent (Nur bearbeitbare Vorschläge)',
    aiTranslateTitle: 'KI-Übersetzung (Prüfen & Freigeben)',
    targetFieldLabel: 'Zielfeld',
    polishBtn: 'Text verbessern & gliedern',
    acceptSuggestion: 'Vorschlag übernehmen',
    rejectSuggestion: 'Verwerfen',
    translateBtn: 'Übersetzung erstellen',
    approveTranslation: 'Freigeben & Übernehmen',
    publicWarning: 'Prüfen Sie die öffentliche Zusammenfassung. Private Daten werden niemals öffentlich angezeigt.',
    addItem: 'Hinzufügen',
    deleteItem: 'Löschen',
    confirmDelete: 'Diesen Eintrag wirklich löschen?',
    publicBadge: 'Öffentlich',
    hiddenBadge: 'Ausgeblendet',
    sections: {
      identity: '4.1 Unternehmensidentität',
      about: '4.2 Über das Unternehmen',
      culture: '4.3 Unternehmenskultur',
      leadership: '4.4 Führung & Team',
      products: '4.5 Produkte & Leistungen',
      environment: '4.6 Arbeitsumfeld',
      benefits: '4.7 Benefits & Erfahrung',
      achievements: '4.8 Erfolge & Zertifikate',
      social: '4.9 Soziales & Nachhaltigkeit'
    },
    fields: {
      officialName: 'Offizieller Firmenname',
      commercialName: 'Handelsname',
      tagline: 'Claim / Slogan',
      industry: 'Branche',
      companyType: 'Unternehmensform',
      yearFounded: 'Gründungsjahr',
      companySize: 'Unternehmensgröße',
      website: 'Website',
      officialEmail: 'Offizielle E-Mail',
      businessPhone: 'Geschäftstelefon',
      country: 'Land',
      provinceState: 'Bundesland / Region',
      city: 'Stadt',
      physicalAddress: 'Physische Adresse',
      overview: 'Unternehmensüberblick',
      ourStory: 'Unsere Geschichte',
      mission: 'Mission',
      vision: 'Vision',
      coreValues: 'Grundwerte',
      whatWeDo: 'Was wir tun',
      ourImpact: 'Unsere Wirkung',
      workEnvironmentDesc: 'Arbeitsumfeld',
      leadershipStyle: 'Führungsstil',
      teamCollaboration: 'Teamzusammenarbeit',
      diversityInclusion: 'Vielfalt & Inklusion',
      professionalGrowth: 'Berufliche Entwicklung',
      workLifeBalance: 'Work-Life-Balance',
      learningCulture: 'Lernkultur',
      innovationCulture: 'Innovationskultur',
      cultureTags: 'Kultur-Tags',
      cultureInPractice: 'Unsere Kultur in der Praxis',
      totalEmployees: 'Gesamtzahl der Mitarbeitenden',
      departmentsList: 'Abteilungen',
      geographicalPresence: 'Geografische Präsenz',
      internationalTeams: 'Internationale Teams',
      orgStructure: 'Organisationsstruktur',
      workModel: 'Allgemeines Arbeitsmodell',
      benefitConditions: 'Bedingungen oder Einschränkungen'
    },
    benefitCategories: {
      financial: 'Finanziell',
      health: 'Gesundheit',
      growth: 'Weiterbildung',
      flexibility: 'Flexibilität',
      career: 'Karriere',
      additional: 'Zusätzlich'
    },
    benefitItems: {
      'Performance Bonus': 'Leistungsbonus',
      'Equity / Stock Options': 'Unternehmensanteile / Optionen',
      'Transport Allowance': 'Fahrtkostenzuschuss',
      'Meal Allowance': 'Essenszuschuss',
      'Private Health Insurance': 'Private Krankenversicherung',
      'Dental & Vision Care': 'Zahn- & Sehvorsorge',
      'Mental Health Support': 'Mentale Gesundheitsunterstützung',
      'Wellness Stipend': 'Wellness-Budget',
      'Training Budget': 'Weiterbildungsbudget',
      'Conference Sponsorship': 'Konferenzförderung',
      'Certification Support': 'Zertifizierungsförderung',
      'Language Courses': 'Sprachkurse',
      'Flexible Hours': 'Flexible Arbeitszeiten',
      'Remote Work Days': 'Remote-Arbeitstage',
      'Compressed Workweek': 'Komprimierte Arbeitswoche',
      'Paid Sabbatical': 'Bezahltes Sabbatical',
      'Mentorship Programme': 'Mentoring-Programm',
      'Internal Mobility': 'Interne Mobilität',
      'Leadership Track': 'Führungslaufbahn',
      'Clear Career Ladder': 'Klare Karriereleiter',
      'Relocation Support': 'Umzugsunterstützung',
      'Parental Leave': 'Elternzeit',
      'Laptop & Home Office Kit': 'Laptop & Home-Office-Ausstattung',
      'Team Retreats': 'Team-Events'
    },
    cultureTags: {
      Innovation: 'Innovation',
      Collaboration: 'Zusammenarbeit',
      Flexibility: 'Flexibilität',
      'Professional Growth': 'Berufliche Entwicklung',
      Diversity: 'Diversité',
      'Remote Friendly': 'Remote-freundlich',
      'Continuous Learning': 'Kontinuierliches Lernen',
      Teamwork: 'Teamarbeit',
      Accountability: 'Verantwortung',
      Creativity: 'Kreativität'
    },
    hints: {
      identity: 'Offiziellen Namen, Branche und Land ergänzen.',
      about: 'Überblick, Mission und Vision ausfüllen.',
      culture: 'Arbeitsumfeld beschreiben oder Kultur-Tags wählen.',
      leadership: 'Mitarbeitendenzahl oder Führungskraft angeben.',
      products: 'Mindestens ein Produkt oder eine Leistung hinzufügen.',
      environment: 'Arbeitsmodell bestätigen und Logo oder Galerie hochladen.',
      benefits: 'Mindestens einen Benefit auswählen.',
      achievements: 'Zertifikate, Auszeichnungen oder Meilensteine hinzufügen.',
      social: 'Gemeinschafts- oder Nachhaltigkeitsinitiative hinzufügen.'
    }
  },
  ar: {
    title: 'ملف الشركة',
    subtitle: 'أنشئ عرضاً مؤسسياً متكاملاً وموثوقاً للمرشحين قبل التقديم على الوظائف.',
    saveDraft: 'حفظ كمسودة',
    saving: 'جاري الحفظ...',
    publish: 'نشر الملف',
    unpublish: 'إلغاء النشر',
    previewTab: 'المعاينة العامة',
    editTab: 'تعديل الملف',
    aiTab: 'مساعد SkillGap AI',
    strengthTitle: 'قوة ملف الشركة',
    published: 'منشور',
    draft: 'مسودة',
    verificationStatus: 'حالة التحقق',
    completeSections: 'الأقسام المكتملة',
    incompleteSections: 'الأقسام غير المكتملة',
    recommendations: 'التوصيات',
    allSectionsComplete: 'الأقسام الأساسية للملف مكتملة.',
    uploadLogo: 'رفع الشعار',
    uploadCover: 'رفع صورة الغلاف',
    companyLogoLabel: 'شعار الشركة',
    coverImageLabel: 'صورة الغلاف',
    removeImage: 'إزالة الصورة',
    savedSuccess: 'تم حفظ ملف الشركة في Supabase.',
    publishedSuccess: 'أصبح ملف الشركة متاحاً للعامة.',
    unpublishedSuccess: 'تمت إعادة ملف الشركة إلى مسودة.',
    errorPrefix: 'خطأ: ',
    aiBuilderTitle: 'منشئ الملف بالذكاء الاصطناعي وتحليل الاكتمال',
    aiWriterTitle: 'مساعد الكتابة بالذكاء الاصطناعي (اقتراحات قابلة للتعديل)',
    aiTranslateTitle: 'الترجمة بالذكاء الاصطناعي (مراجعة واعتماد)',
    targetFieldLabel: 'الحقل المستهدف',
    polishBtn: 'تحسين وتنظيم النص',
    acceptSuggestion: 'قبول الاقتراح',
    rejectSuggestion: 'رفض',
    translateBtn: 'إنشاء الترجمة',
    approveTranslation: 'اعتماد وتطبيق',
    publicWarning: 'راجع الملخص العام. لا يتم عرض البيانات الخاصة للعامة أبداً.',
    addItem: 'إضافة',
    deleteItem: 'حذف',
    confirmDelete: 'تأكيد حذف هذا العنصر؟',
    publicBadge: 'عام',
    hiddenBadge: 'مخفي',
    sections: {
      identity: '4.1 هوية الشركة',
      about: '4.2 عن الشركة',
      culture: '4.3 ثقافة الشركة',
      leadership: '4.4 القيادة والفريق',
      products: '4.5 المنتجات والخدمات',
      environment: '4.6 بيئة العمل',
      benefits: '4.7 المزايا وتجربة الموظف',
      achievements: '4.8 الإنجازات والشهادات',
      social: '4.9 المسؤولية الاجتماعية والاستدامة'
    },
    fields: {
      officialName: 'الاسم الرسمي للشركة',
      commercialName: 'الاسم التجاري',
      tagline: 'الشعار اللفظي للشركة',
      industry: 'القطاع',
      companyType: 'نوع الشركة',
      yearFounded: 'سنة التأسيس',
      companySize: 'حجم الشركة',
      website: 'الموقع الإلكتروني',
      officialEmail: 'البريد الإلكتروني الرسمي',
      businessPhone: 'هاتف العمل',
      country: 'الدولة',
      provinceState: 'المنطقة / الولاية',
      city: 'المدينة',
      physicalAddress: 'العنوان الفعلي',
      overview: 'نظرة عامة على الشركة',
      ourStory: 'قصتنا',
      mission: 'الرسالة',
      vision: 'الرؤية',
      coreValues: 'القيم الجوهرية',
      whatWeDo: 'ماذا نقدم',
      ourImpact: 'أثرنا',
      workEnvironmentDesc: 'بيئة العمل',
      leadershipStyle: 'أسلوب القيادة',
      teamCollaboration: 'التعاون الجماعي',
      diversityInclusion: 'التنوع والشمول',
      professionalGrowth: 'النمو المهني',
      workLifeBalance: 'التوازن بين العمل والحياة',
      learningCulture: 'ثقافة التعلم',
      innovationCulture: 'ثقافة الابتكار',
      cultureTags: 'وسوم الثقافة',
      cultureInPractice: 'ثقافتنا في الممارسة',
      totalEmployees: 'إجمالي عدد الموظفين',
      departmentsList: 'الأقسام',
      geographicalPresence: 'الانتشار الجغرافي',
      internationalTeams: 'فرق دولية',
      orgStructure: 'الهيكل التنظيمي',
      workModel: 'نموذج العمل العام',
      benefitConditions: 'الشروط أو القيود حسب الدور'
    },
    benefitCategories: {
      financial: 'مالية',
      health: 'صحية',
      growth: 'تطوير',
      flexibility: 'مرونة',
      career: 'مسار مهني',
      additional: 'إضافية'
    },
    benefitItems: {
      'Performance Bonus': 'مكافأة أداء',
      'Equity / Stock Options': 'أسهم / خيارات ملكية',
      'Transport Allowance': 'بدل مواصلات',
      'Meal Allowance': 'بدل وجبات',
      'Private Health Insurance': 'تأمين صحي خاص',
      'Dental & Vision Care': 'رعاية الأسنان والنظر',
      'Mental Health Support': 'دعم الصحة النفسية',
      'Wellness Stipend': 'بدل عافية',
      'Training Budget': 'ميزانية تدريب',
      'Conference Sponsorship': 'رعاية المؤتمرات',
      'Certification Support': 'دعم الشهادات المهنية',
      'Language Courses': 'دورات لغات',
      'Flexible Hours': 'ساعات عمل مرنة',
      'Remote Work Days': 'أيام عمل عن بُعد',
      'Compressed Workweek': 'أسبوع عمل مضغوط',
      'Paid Sabbatical': 'إجازة تفرغ مدفوعة',
      'Mentorship Programme': 'برنامج إرشاد مهني',
      'Internal Mobility': 'تنقل داخلي',
      'Leadership Track': 'مسار قيادي',
      'Clear Career Ladder': 'سلم وظيفي واضح',
      'Relocation Support': 'دعم الانتقال',
      'Parental Leave': 'إجازة والدية',
      'Laptop & Home Office Kit': 'حاسوب وتجهيزات مكتب منزلي',
      'Team Retreats': 'لقاءات الفريق'
    },
    cultureTags: {
      Innovation: 'الابتكار',
      Collaboration: 'التعاون',
      Flexibility: 'المرونة',
      'Professional Growth': 'النمو المهني',
      Diversity: 'التنوع',
      'Remote Friendly': 'عمل عن بُعد',
      'Continuous Learning': 'التعلم المستمر',
      Teamwork: 'العمل الجماعي',
      Accountability: 'المساءلة',
      Creativity: 'الإبداع'
    },
    hints: {
      identity: 'أضف الاسم الرسمي والقطاع والدولة.',
      about: 'أكمل النظرة العامة والرسالة والرؤية.',
      culture: 'صف بيئة العمل أو اختر وسوم الثقافة.',
      leadership: 'أضف إجمالي الموظفين أو عضواً قيادياً.',
      products: 'أضف منتجاً أو خدمة واحدة على الأقل.',
      environment: 'أكد نموذج العمل وارفع الشعار أو معرض الصور.',
      benefits: 'اختر ميزة واحدة على الأقل.',
      achievements: 'أضف الشهادات أو الجوائز أو الإنجازات.',
      social: 'أضف مبادرة مجتمعية أو استدامة.'
    }
  }
};

function cleanTextForAi(raw: string): string {
  const collapsed = raw.replace(/\s+/g, ' ').trim();
  if (!collapsed) return '';
  return collapsed.charAt(0).toUpperCase() + collapsed.slice(1);
}

export default function BusinessCompanyProfilePage() {
  const { lang, refreshSubscription } = useBusinessDashboardLang();
  const tx = UI_COPY[lang] || UI_COPY.en;

  const [userId, setUserId] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [coverUrl, setCoverUrl] = useState<string>('');
  const [profile, setProfile] = useState<CompanyProfileData>(DEFAULT_PROFILE_DATA);
  const [visibility, setVisibility] = useState<Record<SectionKey, boolean>>(DEFAULT_VISIBILITY);
  const [isPublished, setIsPublished] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<string>('Not Submitted');
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'ai'>('edit');
  const [activeSection, setActiveSection] = useState<SectionKey>('identity');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingKind, setUploadingKind] = useState<'logo' | 'cover' | null>(null);
  const [feedback, setFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const [leaderDraft, setLeaderDraft] = useState({
    fullName: '',
    position: '',
    department: '',
    photoUrl: '',
    bio: '',
    linkedin: '',
    responsibilities: '',
    verified: false
  });
  const [productDraft, setProductDraft] = useState({
    name: '',
    category: '',
    description: '',
    imageUrl: '',
    website: '',
    features: ''
  });
  const [galleryDraft, setGalleryDraft] = useState<{
    category: GalleryMediaItem['category'];
    caption: string;
    imageUrl: string;
  }>({
    category: 'Office Spaces',
    caption: '',
    imageUrl: ''
  });
  const [achievementDraft, setAchievementDraft] = useState<{
    title: string;
    category: AchievementCertItem['category'];
    issuingOrg: string;
    issueDate: string;
    expiryDate: string;
    description: string;
    documentUrl: string;
    verificationUrl: string;
    status: AchievementCertItem['status'];
  }>({
    title: '',
    category: 'Certification',
    issuingOrg: '',
    issueDate: '',
    expiryDate: '',
    description: '',
    documentUrl: '',
    verificationUrl: '',
    status: 'Not Submitted'
  });
  const [socialDraft, setSocialDraft] = useState<{
    title: string;
    category: SocialInitiativeItem['category'];
    description: string;
    imageUrl: string;
    date: string;
    externalLink: string;
  }>({
    title: '',
    category: 'Community Projects',
    description: '',
    imageUrl: '',
    date: '',
    externalLink: ''
  });

  const [aiTargetField, setAiTargetField] = useState<keyof CompanyProfileData>('overview');
  const [editableAiSuggestion, setEditableAiSuggestion] = useState<string>('');
  const [translateLang, setTranslateLang] = useState<LangCode>('en');
  const [translatedDraft, setTranslatedDraft] = useState<string>('');

  const persistRow = useCallback(
    async (
      uid: string,
      nextProfile: CompanyProfileData,
      nextLogo: string,
      nextCover: string,
      nextVis: Record<SectionKey, boolean>,
      nextPublished: boolean
    ) => {
      if (!supabase) throw new Error('Supabase client unavailable');
      const { error } = await supabase.from('business_company_profiles').upsert(
        {
          user_id: uid,
          logo_url: nextLogo,
          cover_url: nextCover,
          profile_data: nextProfile,
          section_visibility: nextVis,
          is_published: nextPublished,
          updated_at: new Date().toISOString()
        },
        { onConflict: 'user_id' }
      );
      if (error) throw new Error(error.message);

      if (nextProfile.officialName.trim()) {
        await supabase
          .from('companies')
          .update({ name: nextProfile.officialName.trim() })
          .eq('owner_id', uid);
      }
      await refreshSubscription();
    },
    [refreshSubscription]
  );

  useEffect(() => {
    let active = true;
    async function init() {
      setLoading(true);
      try {
        if (!supabase) return;
        const {
          data: { user }
        } = await supabase.auth.getUser();
        if (!user || !active) return;
        setUserId(user.id);

        const { data: row } = await supabase
          .from('business_company_profiles')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle();

        if (row && active) {
          setLogoUrl(row.logo_url || '');
          setCoverUrl(row.cover_url || '');
          setIsPublished(Boolean(row.is_published));
          setVerificationStatus(row.verification_status || 'Not Submitted');
          setProfile({
            ...DEFAULT_PROFILE_DATA,
            ...(row.profile_data || {}),
            benefits: {
              ...DEFAULT_PROFILE_DATA.benefits,
              ...((row.profile_data && row.profile_data.benefits) || {})
            },
            teamPermissions: {
              ...DEFAULT_PROFILE_DATA.teamPermissions,
              ...((row.profile_data && row.profile_data.teamPermissions) || {})
            }
          });
          setVisibility({
            ...DEFAULT_VISIBILITY,
            ...(row.section_visibility || {})
          });
        } else if (active) {
          const { data: comp } = await supabase
            .from('companies')
            .select('name, industry')
            .eq('owner_id', user.id)
            .maybeSingle();
          if (comp) {
            setProfile((prev) => ({
              ...prev,
              officialName: comp.name || '',
              commercialName: comp.name || '',
              industry: comp.industry || ''
            }));
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    init();
    return () => {
      active = false;
    };
  }, []);

  const uploadMediaFile = async (
    file: File,
    folder: string,
    onDone: (url: string) => void,
    kind: 'logo' | 'cover' | null = null
  ) => {
    setFeedback(null);
    if (!file.type.startsWith('image/')) {
      setFeedback({ type: 'err', text: `${tx.errorPrefix}Only image files are allowed.` });
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setFeedback({ type: 'err', text: `${tx.errorPrefix}Image size must be 4MB or less.` });
      return;
    }
    if (!supabase || !userId) {
      setFeedback({ type: 'err', text: `${tx.errorPrefix}Authenticated user required.` });
      return;
    }
    setUploadingKind(kind);
    try {
      const ext = file.name.split('.').pop() || 'png';
      const path = `${userId}/${folder}/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('company-media').upload(path, file, {
        upsert: true
      });
      if (error) throw new Error(error.message);
      const {
        data: { publicUrl }
      } = supabase.storage.from('company-media').getPublicUrl(path);
      onDone(publicUrl);
    } catch (err: any) {
      setFeedback({ type: 'err', text: `${tx.errorPrefix}${err?.message || 'Upload failed'}` });
    } finally {
      setUploadingKind(null);
    }
  };

  const strength = useMemo(() => {
    const sectionChecks: { key: SectionKey; label: string; filled: boolean; hint: string }[] = [
      {
        key: 'identity',
        label: tx.sections.identity,
        filled: Boolean(profile.officialName.trim() && profile.industry.trim() && profile.country.trim()),
        hint: tx.hints.identity
      },
      {
        key: 'about',
        label: tx.sections.about,
        filled: Boolean(profile.overview.trim() && profile.mission.trim() && profile.vision.trim()),
        hint: tx.hints.about
      },
      {
        key: 'culture',
        label: tx.sections.culture,
        filled: Boolean(profile.workEnvironmentDesc.trim() || profile.cultureTags.length > 0),
        hint: tx.hints.culture
      },
      {
        key: 'leadership',
        label: tx.sections.leadership,
        filled: Boolean(profile.totalEmployees.trim() || profile.leadership.length > 0),
        hint: tx.hints.leadership
      },
      {
        key: 'products',
        label: tx.sections.products,
        filled: profile.productsServices.length > 0,
        hint: tx.hints.products
      },
      {
        key: 'environment',
        label: tx.sections.environment,
        filled: Boolean(profile.workModel && (profile.gallery.length > 0 || logoUrl)),
        hint: tx.hints.environment
      },
      {
        key: 'benefits',
        label: tx.sections.benefits,
        filled: Object.values(profile.benefits).some((arr) => arr.length > 0),
        hint: tx.hints.benefits
      },
      {
        key: 'achievements',
        label: tx.sections.achievements,
        filled: profile.achievements.length > 0,
        hint: tx.hints.achievements
      },
      {
        key: 'social',
        label: tx.sections.social,
        filled: profile.socialInitiatives.length > 0,
        hint: tx.hints.social
      }
    ];

    const completed = sectionChecks.filter((s) => s.filled);
    const incomplete = sectionChecks.filter((s) => !s.filled);
    const pct = Math.round((completed.length / sectionChecks.length) * 100);
    return { pct, completed, incomplete };
  }, [profile, logoUrl, tx]);

  const handleSave = async (publishState = isPublished) => {
    setFeedback(null);
    if (!supabase || !userId) {
      setFeedback({ type: 'err', text: `${tx.errorPrefix}Sign in required.` });
      return;
    }
    setSaving(true);
    try {
      await persistRow(userId, profile, logoUrl, coverUrl, visibility, publishState);
      setIsPublished(publishState);
      setFeedback({
        type: 'ok',
        text: publishState ? tx.publishedSuccess : tx.savedSuccess
      });
    } catch (err: any) {
      setFeedback({ type: 'err', text: `${tx.errorPrefix}${err?.message || 'Save failed'}` });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = async () => {
    const nextState = !isPublished;
    await handleSave(nextState);
    if (!nextState) {
      setFeedback({ type: 'ok', text: tx.unpublishedSuccess });
    }
  };

  const toggleBenefit = (cat: BenefitCategoryKey, label: string) => {
    setProfile((prev) => {
      const current = prev.benefits[cat] || [];
      const exists = current.includes(label);
      return {
        ...prev,
        benefits: {
          ...prev.benefits,
          [cat]: exists ? current.filter((x) => x !== label) : [...current, label]
        }
      };
    });
  };

  const toggleCultureTag = (tag: string) => {
    setProfile((prev) => {
      const exists = prev.cultureTags.includes(tag);
      return {
        ...prev,
        cultureTags: exists ? prev.cultureTags.filter((t) => t !== tag) : [...prev.cultureTags, tag]
      };
    });
  };

  const generateEditableAiProposal = () => {
    const rawVal = String(profile[aiTargetField] || '');
    setEditableAiSuggestion(cleanTextForAi(rawVal));
  };

  const applyAcceptedAiSuggestion = () => {
    if (!editableAiSuggestion.trim()) return;
    setProfile((prev) => ({
      ...prev,
      [aiTargetField]: editableAiSuggestion
    }));
    setEditableAiSuggestion('');
  };

  const generateTranslationDraft = () => {
    const sourceText = String(profile[aiTargetField] || '').trim();
    if (!sourceText) {
      setTranslatedDraft('');
      return;
    }
    setTranslatedDraft(`[${translateLang.toUpperCase()}] ${sourceText}`);
  };

  const approveTranslatedDraft = () => {
    if (!translatedDraft.trim()) return;
    const cleaned = translatedDraft.replace(/^\[[A-Z]{2}\]\s*/i, '');
    setProfile((prev) => ({
      ...prev,
      [aiTargetField]: cleaned
    }));
    setTranslatedDraft('');
  };

  const sectionsMeta: { key: SectionKey; label: string; icon: React.ElementType }[] = [
    { key: 'identity', label: tx.sections.identity, icon: Building2 },
    { key: 'about', label: tx.sections.about, icon: Sparkles },
    { key: 'culture', label: tx.sections.culture, icon: Users },
    { key: 'leadership', label: tx.sections.leadership, icon: Briefcase },
    { key: 'products', label: tx.sections.products, icon: Layers },
    { key: 'environment', label: tx.sections.environment, icon: Building2 },
    { key: 'benefits', label: tx.sections.benefits, icon: Award },
    { key: 'achievements', label: tx.sections.achievements, icon: ShieldCheck },
    { key: 'social', label: tx.sections.social, icon: HeartHandshake }
  ];

  if (loading) {
    return <div className="py-10 text-xs text-gray-400">...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl bg-[#0c0716] border border-purple-500/25 p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-extrabold text-white">{tx.title}</h1>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                isPublished
                  ? 'bg-emerald-950/60 border-emerald-500/35 text-emerald-300'
                  : 'bg-purple-950/60 border-purple-500/35 text-purple-300'
              }`}
            >
              {isPublished ? tx.published : tx.draft}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#150b29] border border-indigo-500/30 text-indigo-200">
              {tx.verificationStatus}: {verificationStatus}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">{tx.subtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-[#6d28d9] border-purple-400 text-white'
                : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
            }`}
          >
            {tx.editTab}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === 'ai'
                ? 'bg-[#6d28d9] border-purple-400 text-white'
                : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{tx.aiTab}</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer inline-flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? 'bg-[#6d28d9] border-purple-400 text-white'
                : 'bg-white/5 border-white/10 text-gray-300 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{tx.previewTab}</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave(isPublished)}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-purple-500/30 text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? tx.saving : tx.saveDraft}</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleTogglePublish}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-xs font-bold text-white cursor-pointer disabled:opacity-50"
          >
            {isPublished ? tx.unpublish : tx.publish}
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-3.5 rounded-xl border text-xs font-medium flex items-center gap-2 ${
            feedback.type === 'ok'
              ? 'bg-emerald-950/40 border-emerald-500/35 text-emerald-300'
              : 'bg-red-950/40 border-red-500/35 text-red-300'
          }`}
        >
          {feedback.type === 'ok' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="rounded-2xl bg-[#0c0716] border border-purple-500/25 p-5 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-sm font-bold text-white">{tx.strengthTitle}</h2>
          <span className="text-sm font-extrabold text-purple-300">{strength.pct}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-600 to-indigo-500 transition-all duration-300"
            style={{ width: `${strength.pct}%` }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-xs">
          <div className="p-3 rounded-xl bg-[#080410] border border-white/[0.06]">
            <p className="font-semibold text-emerald-300 mb-1">
              {tx.completeSections} ({strength.completed.length})
            </p>
            <p className="text-gray-400">
              {strength.completed.map((c) => c.label).join(', ') || '—'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#080410] border border-white/[0.06]">
            <p className="font-semibold text-amber-300 mb-1">
              {tx.incompleteSections} ({strength.incomplete.length})
            </p>
            <p className="text-gray-400">
              {strength.incomplete.map((c) => c.label).join(', ') || '—'}
            </p>
          </div>
          <div className="p-3 rounded-xl bg-[#080410] border border-white/[0.06]">
            <p className="font-semibold text-purple-300 mb-1">{tx.recommendations}</p>
            <p className="text-gray-400">
              {strength.incomplete[0]?.hint || tx.allSectionsComplete}
            </p>
          </div>
        </div>
      </div>

      {activeTab === 'edit' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-3 space-y-1.5">
            {sectionsMeta.map(({ key, label, icon: Icon }) => {
              const active = activeSection === key;
              return (
                <div
                  key={key}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border text-xs transition ${
                    active
                      ? 'bg-[#6d28d9]/25 border-purple-500 text-white font-semibold'
                      : 'bg-[#0c0716] border-white/[0.06] text-gray-300 hover:border-purple-500/30'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveSection(key)}
                    className="flex items-center gap-2 text-left flex-1 min-w-0 cursor-pointer"
                  >
                    <Icon className="w-3.5 h-3.5 text-purple-300 shrink-0" />
                    <span className="truncate">{label}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setVisibility((prev) => ({ ...prev, [key]: !prev[key] }))}
                    className={`px-1.5 py-0.5 rounded text-[10px] cursor-pointer ${
                      visibility[key]
                        ? 'bg-emerald-950/70 text-emerald-300'
                        : 'bg-white/10 text-gray-400'
                    }`}
                  >
                    {visibility[key] ? tx.publicBadge : tx.hiddenBadge}
                  </button>
                </div>
              );
            })}
          </div>

          <div className="lg:col-span-9 rounded-2xl bg-[#0c0716] border border-purple-500/25 p-6 space-y-5 text-xs">
            {activeSection === 'identity' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">{tx.sections.identity}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-[#080410] border border-purple-500/25 space-y-2.5">
                    <p className="font-semibold text-white">{tx.companyLogoLabel}</p>
                    {logoUrl && (
                      <img
                        src={logoUrl}
                        alt={tx.companyLogoLabel}
                        className="w-16 h-16 rounded-xl object-contain bg-white/5 border border-purple-500/30 p-1"
                      />
                    )}
                    <div className="flex flex-wrap gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/45 border border-purple-400/40 text-white font-semibold cursor-pointer inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingKind === 'logo' ? tx.saving : tx.uploadLogo}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              uploadMediaFile(
                                f,
                                'logos',
                                (url) => {
                                  setLogoUrl(url);
                                  if (userId) {
                                    persistRow(
                                      userId,
                                      profile,
                                      url,
                                      coverUrl,
                                      visibility,
                                      isPublished
                                    ).catch(() => {});
                                  }
                                },
                                'logo'
                              );
                            }
                          }}
                        />
                      </label>
                      {logoUrl && (
                        <button
                          type="button"
                          onClick={() => setLogoUrl('')}
                          className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 cursor-pointer inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{tx.removeImage}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-[#080410] border border-purple-500/25 space-y-2.5">
                    <p className="font-semibold text-white">{tx.coverImageLabel}</p>
                    {coverUrl && (
                      <img
                        src={coverUrl}
                        alt={tx.coverImageLabel}
                        className="w-full h-16 rounded-xl object-cover border border-purple-500/30"
                      />
                    )}
                    <div className="flex flex-wrap gap-2">
                      <label className="px-3 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/45 border border-purple-400/40 text-white font-semibold cursor-pointer inline-flex items-center gap-1.5">
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploadingKind === 'cover' ? tx.saving : tx.uploadCover}</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) {
                              uploadMediaFile(
                                f,
                                'covers',
                                (url) => setCoverUrl(url),
                                'cover'
                              );
                            }
                          }}
                        />
                      </label>
                      {coverUrl && (
                        <button
                          type="button"
                          onClick={() => setCoverUrl('')}
                          className="px-3 py-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-300 cursor-pointer inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>{tx.removeImage}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'officialName',
                    'commercialName',
                    'tagline',
                    'industry',
                    'companyType',
                    'yearFounded',
                    'companySize',
                    'website',
                    'officialEmail',
                    'businessPhone',
                    'country',
                    'provinceState',
                    'city',
                    'physicalAddress'
                  ].map((fieldKey) => (
                    <div key={fieldKey}>
                      <label className="block text-gray-400 mb-1">
                        {tx.fields[fieldKey] || fieldKey}
                      </label>
                      <input
                        type="text"
                        value={String(profile[fieldKey as keyof CompanyProfileData] || '')}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            [fieldKey]: e.target.value
                          }))
                        }
                        className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'about' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">{tx.sections.about}</h3>
                {['overview', 'ourStory', 'mission', 'vision', 'coreValues', 'whatWeDo', 'ourImpact'].map(
                  (fieldKey) => (
                    <div key={fieldKey}>
                      <label className="block text-gray-400 mb-1">
                        {tx.fields[fieldKey] || fieldKey}
                      </label>
                      <textarea
                        rows={3}
                        value={String(profile[fieldKey as keyof CompanyProfileData] || '')}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            [fieldKey]: e.target.value
                          }))
                        }
                        className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  )
                )}
              </div>
            )}

            {activeSection === 'culture' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">{tx.sections.culture}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'workEnvironmentDesc',
                    'leadershipStyle',
                    'teamCollaboration',
                    'diversityInclusion',
                    'professionalGrowth',
                    'workLifeBalance',
                    'learningCulture',
                    'innovationCulture'
                  ].map((fieldKey) => (
                    <div key={fieldKey}>
                      <label className="block text-gray-400 mb-1">
                        {tx.fields[fieldKey] || fieldKey}
                      </label>
                      <textarea
                        rows={2}
                        value={String(profile[fieldKey as keyof CompanyProfileData] || '')}
                        onChange={(e) =>
                          setProfile((prev) => ({
                            ...prev,
                            [fieldKey]: e.target.value
                          }))
                        }
                        className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                      />
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-gray-400 mb-2">{tx.fields.cultureTags}</label>
                  <div className="flex flex-wrap gap-2">
                    {CULTURE_TAG_KEYS.map((tagKey) => {
                      const active = profile.cultureTags.includes(tagKey);
                      return (
                        <button
                          key={tagKey}
                          type="button"
                          onClick={() => toggleCultureTag(tagKey)}
                          className={`px-3 py-1 rounded-full border text-xs cursor-pointer ${
                            active
                              ? 'bg-purple-600/35 border-purple-400 text-white font-semibold'
                              : 'bg-white/5 border-white/10 text-gray-300'
                          }`}
                        >
                          {tx.cultureTags[tagKey] || tagKey}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-400 mb-1">{tx.fields.cultureInPractice}</label>
                  <textarea
                    rows={3}
                    value={profile.cultureInPractice}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, cultureInPractice: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            )}

            {activeSection === 'leadership' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">{tx.sections.leadership}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    'totalEmployees',
                    'departmentsList',
                    'geographicalPresence',
                    'internationalTeams',
                    'orgStructure'
                  ].map((k) => (
                    <div key={k}>
                      <label className="block text-gray-400 mb-1">{tx.fields[k] || k}</label>
                      <input
                        type="text"
                        value={String(profile[k as keyof CompanyProfileData] || '')}
                        onChange={(e) =>
                          setProfile((prev) => ({ ...prev, [k]: e.target.value }))
                        }
                        className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2 text-white"
                      />
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-[#080410] border border-purple-500/20 space-y-3">
                  <p className="font-semibold text-white">{tx.addItem}</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={leaderDraft.fullName}
                      onChange={(e) => setLeaderDraft({ ...leaderDraft, fullName: e.target.value })}
                      className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                    />
                    <input
                      type="text"
                      value={leaderDraft.position}
                      onChange={(e) => setLeaderDraft({ ...leaderDraft, position: e.target.value })}
                      className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                    />
                    <input
                      type="text"
                      value={leaderDraft.department}
                      onChange={(e) => setLeaderDraft({ ...leaderDraft, department: e.target.value })}
                      className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                    />
                    <input
                      type="text"
                      value={leaderDraft.linkedin}
                      onChange={(e) => setLeaderDraft({ ...leaderDraft, linkedin: e.target.value })}
                      className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                    />
                    <input
                      type="text"
                      value={leaderDraft.responsibilities}
                      onChange={(e) =>
                        setLeaderDraft({ ...leaderDraft, responsibilities: e.target.value })
                      }
                      className="md:col-span-2 bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                    />
                    <textarea
                      rows={2}
                      value={leaderDraft.bio}
                      onChange={(e) => setLeaderDraft({ ...leaderDraft, bio: e.target.value })}
                      className="md:col-span-2 bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!leaderDraft.fullName.trim() || !leaderDraft.position.trim()) return;
                      setProfile((prev) => ({
                        ...prev,
                        leadership: [
                          ...prev.leadership,
                          { ...leaderDraft, id: crypto.randomUUID() }
                        ]
                      }));
                      setLeaderDraft({
                        fullName: '',
                        position: '',
                        department: '',
                        photoUrl: '',
                        bio: '',
                        linkedin: '',
                        responsibilities: '',
                        verified: false
                      });
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{tx.addItem}</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {profile.leadership.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-[#080410] border border-white/[0.06] flex items-center justify-between gap-3"
                    >
                      <div>
                        <p className="font-bold text-white">
                          {m.fullName} — {m.position}
                        </p>
                        <p className="text-gray-400">{m.department}</p>
                      </div>
                      <button
                        type="button"
                        aria-label={tx.deleteItem}
                        onClick={() => {
                          if (!window.confirm(tx.confirmDelete)) return;
                          setProfile((prev) => ({
                            ...prev,
                            leadership: prev.leadership.filter((x) => x.id !== m.id)
                          }));
                        }}
                        className="p-2 rounded-lg bg-red-950/40 text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'products' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">{tx.sections.products}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={productDraft.name}
                    onChange={(e) => setProductDraft({ ...productDraft, name: e.target.value })}
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    value={productDraft.category}
                    onChange={(e) => setProductDraft({ ...productDraft, category: e.target.value })}
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    value={productDraft.website}
                    onChange={(e) => setProductDraft({ ...productDraft, website: e.target.value })}
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    value={productDraft.features}
                    onChange={(e) => setProductDraft({ ...productDraft, features: e.target.value })}
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <textarea
                    rows={2}
                    value={productDraft.description}
                    onChange={(e) =>
                      setProductDraft({ ...productDraft, description: e.target.value })
                    }
                    className="md:col-span-2 bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!productDraft.name.trim()) return;
                    setProfile((prev) => ({
                      ...prev,
                      productsServices: [
                        ...prev.productsServices,
                        { ...productDraft, id: crypto.randomUUID() }
                      ]
                    }));
                    setProductDraft({
                      name: '',
                      category: '',
                      description: '',
                      imageUrl: '',
                      website: '',
                      features: ''
                    });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{tx.addItem}</span>
                </button>
                <div className="space-y-2">
                  {profile.productsServices.map((p) => (
                    <div
                      key={p.id}
                      className="p-3 rounded-xl bg-[#080410] border border-white/[0.06] flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-white">
                          {p.name} ({p.category})
                        </p>
                        <p className="text-gray-400">{p.description}</p>
                      </div>
                      <button
                        type="button"
                        aria-label={tx.deleteItem}
                        onClick={() => {
                          if (!window.confirm(tx.confirmDelete)) return;
                          setProfile((prev) => ({
                            ...prev,
                            productsServices: prev.productsServices.filter((x) => x.id !== p.id)
                          }));
                        }}
                        className="p-2 rounded-lg bg-red-950/40 text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'environment' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">{tx.sections.environment}</h3>
                <div>
                  <label className="block text-gray-400 mb-1">{tx.fields.workModel}</label>
                  <select
                    value={profile.workModel}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        workModel: e.target.value as CompanyProfileData['workModel']
                      }))
                    }
                    className="bg-[#080410] border border-purple-500/30 rounded-xl px-3.5 py-2 text-white"
                  >
                    <option value="On-site">On-site</option>
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Flexible Working">Flexible Working</option>
                  </select>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select
                    value={galleryDraft.category}
                    onChange={(e) =>
                      setGalleryDraft({
                        ...galleryDraft,
                        category: e.target.value as GalleryMediaItem['category']
                      })
                    }
                    className="bg-[#080410] border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  >
                    {[
                      'Office Spaces',
                      'Workstations',
                      'Meeting Rooms',
                      'Company Events',
                      'Team Activities',
                      'Facilities'
                    ].map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={galleryDraft.caption}
                    onChange={(e) =>
                      setGalleryDraft({ ...galleryDraft, caption: e.target.value })
                    }
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <label className="px-3 py-2 rounded-xl bg-purple-600/30 border border-purple-400/40 text-white font-semibold cursor-pointer inline-flex items-center justify-center gap-1.5">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{tx.uploadCover}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          uploadMediaFile(f, 'gallery', (url) => {
                            setProfile((prev) => ({
                              ...prev,
                              gallery: [
                                ...prev.gallery,
                                {
                                  id: crypto.randomUUID(),
                                  category: galleryDraft.category,
                                  caption: galleryDraft.caption || galleryDraft.category,
                                  imageUrl: url
                                }
                              ]
                            }));
                            setGalleryDraft({ ...galleryDraft, caption: '', imageUrl: '' });
                          });
                        }
                      }}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {profile.gallery.map((g) => (
                    <div
                      key={g.id}
                      className="rounded-xl bg-[#080410] border border-white/[0.06] p-2.5 space-y-2"
                    >
                      <img
                        src={g.imageUrl}
                        alt={g.caption}
                        className="w-full h-24 object-cover rounded-lg"
                      />
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-gray-300 truncate">
                          {g.category}: {g.caption}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setProfile((prev) => ({
                              ...prev,
                              gallery: prev.gallery.filter((x) => x.id !== g.id)
                            }))
                          }
                          className="text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'benefits' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">{tx.sections.benefits}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(Object.keys(BENEFIT_KEYS) as BenefitCategoryKey[]).map((catKey) => (
                    <div
                      key={catKey}
                      className="p-3.5 rounded-xl bg-[#080410] border border-white/[0.06] space-y-2"
                    >
                      <p className="font-bold text-purple-200">
                        {tx.benefitCategories[catKey] || catKey}
                      </p>
                      {BENEFIT_KEYS[catKey].map((optKey) => {
                        const checked = (profile.benefits[catKey] || []).includes(optKey);
                        return (
                          <label
                            key={optKey}
                            className="flex items-center gap-2 text-gray-300 cursor-pointer"
                          >
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleBenefit(catKey, optKey)}
                            />
                            <span>{tx.benefitItems[optKey] || optKey}</span>
                          </label>
                        );
                      })}
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-gray-400 mb-1">{tx.fields.benefitConditions}</label>
                  <textarea
                    rows={2}
                    value={profile.benefitConditions}
                    onChange={(e) =>
                      setProfile((prev) => ({ ...prev, benefitConditions: e.target.value }))
                    }
                    className="w-full bg-white/5 border border-purple-500/20 rounded-xl px-3.5 py-2 text-white"
                  />
                </div>
              </div>
            )}

            {activeSection === 'achievements' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">{tx.sections.achievements}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={achievementDraft.title}
                    onChange={(e) =>
                      setAchievementDraft({ ...achievementDraft, title: e.target.value })
                    }
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    value={achievementDraft.issuingOrg}
                    onChange={(e) =>
                      setAchievementDraft({ ...achievementDraft, issuingOrg: e.target.value })
                    }
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    value={achievementDraft.issueDate}
                    onChange={(e) =>
                      setAchievementDraft({ ...achievementDraft, issueDate: e.target.value })
                    }
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    value={achievementDraft.expiryDate}
                    onChange={(e) =>
                      setAchievementDraft({ ...achievementDraft, expiryDate: e.target.value })
                    }
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    value={achievementDraft.verificationUrl}
                    onChange={(e) =>
                      setAchievementDraft({
                        ...achievementDraft,
                        verificationUrl: e.target.value
                      })
                    }
                    className="md:col-span-2 bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!achievementDraft.title.trim()) return;
                    setProfile((prev) => ({
                      ...prev,
                      achievements: [
                        ...prev.achievements,
                        {
                          ...achievementDraft,
                          id: crypto.randomUUID(),
                          status: 'Verification Pending'
                        }
                      ]
                    }));
                    setAchievementDraft({
                      title: '',
                      category: 'Certification',
                      issuingOrg: '',
                      issueDate: '',
                      expiryDate: '',
                      description: '',
                      documentUrl: '',
                      verificationUrl: '',
                      status: 'Not Submitted'
                    });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{tx.addItem}</span>
                </button>
                <div className="space-y-2">
                  {profile.achievements.map((a) => (
                    <div
                      key={a.id}
                      className="p-3 rounded-xl bg-[#080410] border border-white/[0.06] flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-white">
                          {a.title} — {a.status}
                        </p>
                        <p className="text-gray-400">
                          {a.issuingOrg} • {a.issueDate}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProfile((prev) => ({
                            ...prev,
                            achievements: prev.achievements.filter((x) => x.id !== a.id)
                          }))
                        }
                        className="p-2 rounded-lg bg-red-950/40 text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'social' && (
              <div className="space-y-4">
                <h3 className="text-base font-bold text-white">{tx.sections.social}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={socialDraft.title}
                    onChange={(e) => setSocialDraft({ ...socialDraft, title: e.target.value })}
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    value={socialDraft.date}
                    onChange={(e) => setSocialDraft({ ...socialDraft, date: e.target.value })}
                    className="bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <input
                    type="text"
                    value={socialDraft.externalLink}
                    onChange={(e) =>
                      setSocialDraft({ ...socialDraft, externalLink: e.target.value })
                    }
                    className="md:col-span-2 bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                  <textarea
                    rows={2}
                    value={socialDraft.description}
                    onChange={(e) =>
                      setSocialDraft({ ...socialDraft, description: e.target.value })
                    }
                    className="md:col-span-2 bg-white/5 border border-purple-500/20 rounded-xl px-3 py-2 text-white"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!socialDraft.title.trim()) return;
                    setProfile((prev) => ({
                      ...prev,
                      socialInitiatives: [
                        ...prev.socialInitiatives,
                        { ...socialDraft, id: crypto.randomUUID() }
                      ]
                    }));
                    setSocialDraft({
                      title: '',
                      category: 'Community Projects',
                      description: '',
                      imageUrl: '',
                      date: '',
                      externalLink: ''
                    });
                  }}
                  className="px-3.5 py-2 rounded-xl bg-purple-600 text-white font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{tx.addItem}</span>
                </button>
                <div className="space-y-2">
                  {profile.socialInitiatives.map((s) => (
                    <div
                      key={s.id}
                      className="p-3 rounded-xl bg-[#080410] border border-white/[0.06] flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-white">{s.title}</p>
                        <p className="text-gray-400">{s.description}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setProfile((prev) => ({
                            ...prev,
                            socialInitiatives: prev.socialInitiatives.filter((x) => x.id !== s.id)
                          }))
                        }
                        className="p-2 rounded-lg bg-red-950/40 text-red-300 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ai' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 text-xs">
          <div className="rounded-2xl bg-[#0c0716] border border-purple-500/25 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">{tx.aiWriterTitle}</h3>
            <div>
              <label className="block text-gray-400 mb-1">{tx.targetFieldLabel}</label>
              <select
                value={aiTargetField}
                onChange={(e) =>
                  setAiTargetField(e.target.value as keyof CompanyProfileData)
                }
                className="w-full bg-[#080410] border border-purple-500/30 rounded-xl px-3 py-2 text-white"
              >
                {[
                  'overview',
                  'ourStory',
                  'mission',
                  'vision',
                  'coreValues',
                  'whatWeDo',
                  'ourImpact',
                  'cultureInPractice'
                ].map((k) => (
                  <option key={k} value={k}>
                    {tx.fields[k] || k}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={generateEditableAiProposal}
              className="px-4 py-2 rounded-xl bg-purple-600 text-white font-semibold cursor-pointer"
            >
              {tx.polishBtn}
            </button>

            {editableAiSuggestion !== '' && (
              <div className="p-3.5 rounded-xl bg-[#080410] border border-purple-500/30 space-y-2.5">
                <textarea
                  rows={4}
                  value={editableAiSuggestion}
                  onChange={(e) => setEditableAiSuggestion(e.target.value)}
                  className="w-full bg-white/5 border border-purple-500/20 rounded-xl p-2.5 text-white"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={applyAcceptedAiSuggestion}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{tx.acceptSuggestion}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditableAiSuggestion('')}
                    className="px-3 py-1.5 rounded-lg bg-white/10 text-gray-300 inline-flex items-center gap-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{tx.rejectSuggestion}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-2xl bg-[#0c0716] border border-purple-500/25 p-6 space-y-4">
            <h3 className="text-base font-bold text-white">{tx.aiTranslateTitle}</h3>
            <div className="flex items-center gap-2">
              <LanguagesIcon className="w-4 h-4 text-purple-400" />
              <select
                value={translateLang}
                onChange={(e) => setTranslateLang(e.target.value as LangCode)}
                className="bg-[#080410] border border-purple-500/30 rounded-xl px-3 py-2 text-white"
              >
                <option value="en">EN</option>
                <option value="pt">PT</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="de">DE</option>
                <option value="ar">AR</option>
              </select>
              <button
                type="button"
                onClick={generateTranslationDraft}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-semibold cursor-pointer"
              >
                {tx.translateBtn}
              </button>
            </div>
            {translatedDraft && (
              <div className="p-3.5 rounded-xl bg-[#080410] border border-indigo-500/30 space-y-2.5">
                <textarea
                  rows={4}
                  value={translatedDraft}
                  onChange={(e) => setTranslatedDraft(e.target.value)}
                  className="w-full bg-white/5 border border-purple-500/20 rounded-xl p-2.5 text-white"
                />
                <button
                  type="button"
                  onClick={approveTranslatedDraft}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold cursor-pointer"
                >
                  {tx.approveTranslation}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'preview' && (
        <div className="rounded-2xl bg-[#0c0716] border border-purple-500/25 overflow-hidden text-xs">
          <div className="px-6 py-3 bg-purple-950/40 border-b border-purple-500/20 text-purple-200">
            {tx.publicWarning}
          </div>
          {coverUrl && (
            <img src={coverUrl} alt={tx.coverImageLabel} className="w-full h-44 object-cover" />
          )}
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              {logoUrl && (
                <img
                  src={logoUrl}
                  alt={tx.companyLogoLabel}
                  className="w-16 h-16 rounded-2xl object-contain bg-white/5 border border-purple-500/30 p-1.5"
                />
              )}
              <div>
                <h3 className="text-xl font-extrabold text-white">
                  {profile.commercialName || profile.officialName || tx.title}
                </h3>
                <p className="text-purple-300">
                  {profile.industry} • {[profile.city, profile.country].filter(Boolean).join(', ')}
                </p>
              </div>
            </div>

            {visibility.about && profile.overview && (
              <div>
                <h4 className="font-bold text-white mb-1">{tx.fields.overview}</h4>
                <p className="text-gray-300 leading-relaxed">{profile.overview}</p>
              </div>
            )}

            {visibility.about && (profile.mission || profile.vision) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.mission && (
                  <div className="p-4 rounded-xl bg-[#080410] border border-white/[0.06]">
                    <h4 className="font-bold text-white mb-1">{tx.fields.mission}</h4>
                    <p className="text-gray-300">{profile.mission}</p>
                  </div>
                )}
                {profile.vision && (
                  <div className="p-4 rounded-xl bg-[#080410] border border-white/[0.06]">
                    <h4 className="font-bold text-white mb-1">{tx.fields.vision}</h4>
                    <p className="text-gray-300">{profile.vision}</p>
                  </div>
                )}
              </div>
            )}

            {visibility.culture && profile.cultureTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {profile.cultureTags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-purple-200"
                  >
                    {tx.cultureTags[tag] || tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}