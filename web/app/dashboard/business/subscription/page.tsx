'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Check,
  Sparkles,
  Users,
  Briefcase,
  UserCheck,
  ShieldCheck,
  Layers,
  CreditCard,
  Landmark,
  Smartphone,
  Wallet,
  X
} from 'lucide-react';
import {
  B2B_PLANS,
  supabase,
  fetchActiveCompanySubscription,
  formatPlanPrice,
  type B2BPlanConfig,
  type CurrencyCode,
  type LangCode
} from '@/lib/business-supabase';
import { useBusinessDashboardLang } from '../layout';

type PaymentMethodId = 'card' | 'bank_transfer' | 'apple_pay' | 'google_pay';

const LEVEL_TRANSLATIONS: Record<string, Record<LangCode, string>> = {
  '—': { en: '—', pt: '—', es: '—', fr: '—', de: '—', ar: '—' },
  '-': { en: '-', pt: '-', es: '-', fr: '-', de: '-', ar: '-' },
  Unlimited: {
    en: 'Unlimited',
    pt: 'Ilimitado',
    es: 'Ilimitado',
    fr: 'Illimité',
    de: 'Unbegrenzt',
    ar: 'غير محدود'
  },
  Ilimitado: {
    en: 'Unlimited',
    pt: 'Ilimitado',
    es: 'Ilimitado',
    fr: 'Illimité',
    de: 'Unbegrenzt',
    ar: 'غير محدود'
  },
  Básico: { en: 'Basic', pt: 'Básico', es: 'Básico', fr: 'Basique', de: 'Basis', ar: 'أساسي' },
  Básica: { en: 'Basic', pt: 'Básica', es: 'Básica', fr: 'Basique', de: 'Basis', ar: 'أساسي' },
  Básicas: { en: 'Basic', pt: 'Básicas', es: 'Básicas', fr: 'Basiques', de: 'Basis', ar: 'أساسية' },
  Avançado: { en: 'Advanced', pt: 'Avançado', es: 'Avanzado', fr: 'Avancé', de: 'Erweitert', ar: 'متقدم' },
  Avançada: { en: 'Advanced', pt: 'Avançada', es: 'Avanzada', fr: 'Avancée', de: 'Erweitert', ar: 'متقدمة' },
  Avançadas: { en: 'Advanced', pt: 'Avançadas', es: 'Avanzadas', fr: 'Avancées', de: 'Erweitert', ar: 'متقدمة' },
  Aprofundado: { en: 'In-depth', pt: 'Aprofundado', es: 'Profundo', fr: 'Approfondi', de: 'Vertieft', ar: 'معمق' },
  Aprofundada: { en: 'In-depth', pt: 'Aprofundada', es: 'Profundizada', fr: 'Approfondie', de: 'Vertieft', ar: 'معمقة' },
  Personalizado: { en: 'Custom', pt: 'Personalizado', es: 'Personalizado', fr: 'Personnalisé', de: 'Individuell', ar: 'مخصص' },
  Personalizada: { en: 'Custom', pt: 'Personalizada', es: 'Personalizada', fr: 'Personnalisée', de: 'Individuell', ar: 'مخصصة' },
  Enterprise: { en: 'Enterprise', pt: 'Enterprise', es: 'Enterprise', fr: 'Enterprise', de: 'Enterprise', ar: 'مؤسسي' },
  Preditivo: { en: 'Predictive', pt: 'Preditivo', es: 'Predictivo', fr: 'Prédictif', de: 'Prädiktiv', ar: 'تنبؤي' },
  Estratégico: { en: 'Strategic', pt: 'Estratégico', es: 'Estratégico', fr: 'Stratégique', de: 'Strategisch', ar: 'استراتيجي' },
  Strategic: { en: 'Strategic', pt: 'Estratégico', es: 'Estratégico', fr: 'Stratégique', de: 'Strategisch', ar: 'استراتيجي' },
  Executivo: { en: 'Executive', pt: 'Executivo', es: 'Ejecutivo', fr: 'Exécutif', de: 'Executive', ar: 'تنفيذي' },
  Múltiplos: { en: 'Multiple', pt: 'Múltiplos', es: 'Múltiples', fr: 'Multiples', de: 'Mehrere', ar: 'متعددة' },
  Multinacional: { en: 'Multinational', pt: 'Multinacional', es: 'Multinacional', fr: 'Multinationale', de: 'Multinational', ar: 'متعدد الجنسيات' },
  Incluído: { en: 'Included', pt: 'Incluído', es: 'Incluido', fr: 'Inclus', de: 'Enthalten', ar: 'مشمول' },
  Global: { en: 'Global', pt: 'Global', es: 'Global', fr: 'Global', de: 'Global', ar: 'عالمي' },
  'Global avançado': {
    en: 'Advanced Global',
    pt: 'Global avançado',
    es: 'Global avanzado',
    fr: 'Global avancé',
    de: 'Erweitert Global',
    ar: 'عالمي متقدم'
  },
  API: { en: 'API', pt: 'API', es: 'API', fr: 'API', de: 'API', ar: 'API' },
  'API personalizada': {
    en: 'Custom API',
    pt: 'API personalizada',
    es: 'API personalizada',
    fr: 'API personnalisée',
    de: 'Individuelle API',
    ar: 'واجهة API مخصصة'
  },
  Email: { en: 'Email', pt: 'Email', es: 'Email', fr: 'Email', de: 'E-Mail', ar: 'البريد الإلكتروني' },
  Prioritário: { en: 'Priority', pt: 'Prioritário', es: 'Prioritario', fr: 'Prioritaire', de: 'Priorisiert', ar: 'أولوية' },
  Dedicado: { en: 'Dedicated', pt: 'Dedicado', es: 'Dedicado', fr: 'Dédié', de: 'Dediziert', ar: 'مخصص' },
  '24/7': { en: '24/7', pt: '24/7', es: '24/7', fr: '24/7', de: '24/7', ar: '24/7' },
  '99,9%': { en: '99.9%', pt: '99,9%', es: '99,9%', fr: '99,9%', de: '99,9%', ar: '99.9%' }
};

const SUBSCRIPTION_UI: Record<
  LangCode,
  {
    pill: string;
    title: string;
    subtitle: string;
    perMonth: string;
    currentPlanBadge: string;
    recommendedBadge: string;
    selectPlan: string;
    currentPlanBtn: string;
    employeesLabel: string;
    recruitersLabel: string;
    candidatesPerJobLabel: string;
    activeJobsLabel: string;
    unlimitedLabel: string;
    comparisonTitle: string;
    comparisonSubtitle: string;
    featureCol: string;
    included: string;
    notIncluded: string;
    principlesTitle: string;
    principle1Title: string;
    principle1Desc: string;
    principle2Title: string;
    principle2Desc: string;
    principle3Title: string;
    principle3Desc: string;
    principle4Title: string;
    principle4Desc: string;
    commercialNote: string;
    modalTitle: string;
    modalSubtitle: string;
    confirmBtn: string;
    cancelBtn: string;
    paymentMethods: Record<PaymentMethodId, { label: string; steps: string[] }>;
    rows: {
      recruiters: string;
      activeJobs: string;
      candidatesPerJob: string;
      aiMatching: string;
      aiRanking: string;
      skillsAssessment: string;
      skillGapAnalysis: string;
      candidateEvaluation: string;
      analyticsReporting: string;
      recruitmentAutomation: string;
      departmentManagement: string;
      talentPoolManagement: string;
      integrations: string;
      ssoPermissions: string;
      dedicatedAccountManager: string;
      support: string;
      sla: string;
    };
  }
> = {
  en: {
    pill: 'SKILLGAP B2B PLANS',
    title: 'Company Subscription Plans',
    subtitle: 'Monthly plans powered by AI to identify, evaluate, and recommend high-fit candidates for every job position.',
    perMonth: '/month',
    currentPlanBadge: 'Active Plan',
    recommendedBadge: 'Most Popular',
    selectPlan: 'Subscribe Plan',
    currentPlanBtn: 'Current Plan',
    employeesLabel: 'employees',
    recruitersLabel: 'recruiters',
    candidatesPerJobLabel: 'candidates per job',
    activeJobsLabel: 'active jobs',
    unlimitedLabel: 'Unlimited',
    comparisonTitle: 'Plan Comparison',
    comparisonSubtitle: 'Detailed breakdown of limits, AI depth, integrations, and support.',
    featureCol: 'Features',
    included: 'Included',
    notIncluded: '—',
    principlesTitle: 'Product Principles',
    principle1Title: 'Quality Over Quantity',
    principle1Desc: 'Each plan limits candidates presented per job in increments of 5: Starter 5, Growth 10, Volume 15, Business 20, Enterprise 25, and Enterprise Plus 30.',
    principle2Title: 'Analysis Beyond Shortlist',
    principle2Desc: 'AI can analyze a broader talent pool; the limit applies only to candidates presented to the company.',
    principle3Title: 'Consistent Quality',
    principle3Desc: 'All plans target high-fit candidates. Higher tiers expand capacity, depth, customization, and scale.',
    principle4Title: 'Human Decision',
    principle4Desc: 'Recommendations are explainable and evidence-based. Final hiring decisions remain with the company.',
    commercialNote: 'Note: Active job positions are unlimited across all plans. Recruiter limits, AI capabilities, assessments, integrations, support, and SLA are commercial proposals and should be technically validated before production announcement.',
    modalTitle: 'Complete Subscription',
    modalSubtitle: 'Choose a payment method and follow the steps below:',
    confirmBtn: 'Confirm Subscription',
    cancelBtn: 'Cancel',
    paymentMethods: {
      card: {
        label: 'Credit / Debit Card',
        steps: [
          '1. Enter the card number, expiration date (MM/YY), and CVV security code.',
          '2. Confirm the cardholder name and company billing details.',
          '3. Approve the bank prompt (3D Secure if required) and click Confirm Subscription.'
        ]
      },
      bank_transfer: {
        label: 'Bank Transfers',
        steps: [
          '1. Transfer the exact plan amount to the provided company IBAN/account details.',
          '2. Include your company name and plan name in the transfer reference.',
          '3. Click Confirm Subscription to record the order and complete bank verification.'
        ]
      },
      apple_pay: {
        label: 'Apple Pay',
        steps: [
          '1. Click Confirm Subscription to open the Apple Pay payment sheet.',
          '2. Select the company card stored in your Apple Wallet.',
          '3. Authenticate with Face ID, Touch ID, or device passcode to finish.'
        ]
      },
      google_pay: {
        label: 'Google Pay',
        steps: [
          '1. Click Confirm Subscription to launch Google Pay.',
          '2. Choose the saved card in your Google Account.',
          '3. Confirm authentication on your device to activate the plan.'
        ]
      }
    },
    rows: {
      recruiters: 'Recruiters',
      activeJobs: 'Active Job Positions',
      candidatesPerJob: 'Candidates Presented per Job',
      aiMatching: 'AI Candidate Matching',
      aiRanking: 'AI Candidate Ranking',
      skillsAssessment: 'Skills Assessment',
      skillGapAnalysis: 'SkillGap Analysis',
      candidateEvaluation: 'Candidate Evaluation',
      analyticsReporting: 'Analytics & Reporting',
      recruitmentAutomation: 'Recruitment Automation',
      departmentManagement: 'Department Management',
      talentPoolManagement: 'Talent Pool Management',
      integrations: 'Integrations',
      ssoPermissions: 'SSO & Advanced Permissions',
      dedicatedAccountManager: 'Dedicated Account Manager',
      support: 'Support',
      sla: 'SLA'
    }
  },
  pt: {
    pill: 'PLANOS B2B SKILLGAP',
    title: 'Subscrições para Empresas',
    subtitle: 'Planos mensais com IA para identificar, avaliar e recomendar candidatos com elevada compatibilidade em cada vaga.',
    perMonth: '/mês',
    currentPlanBadge: 'Plano Ativo',
    recommendedBadge: 'Mais Escolhido',
    selectPlan: 'Subscrever Plano',
    currentPlanBtn: 'Plano Atual',
    employeesLabel: 'funcionários',
    recruitersLabel: 'recrutadores',
    candidatesPerJobLabel: 'candidatos por vaga',
    activeJobsLabel: 'vagas ativas',
    unlimitedLabel: 'Ilimitado',
    comparisonTitle: 'Comparação dos Planos',
    comparisonSubtitle: 'Detalhe de limites, profundidade de IA, integrações e suporte.',
    featureCol: 'Funcionalidades',
    included: 'Incluído',
    notIncluded: '—',
    principlesTitle: 'Princípios do Produto',
    principle1Title: 'Quality Over Quantity',
    principle1Desc: 'Cada plano limita o número de candidatos apresentados por vaga, em incrementos de 5: Starter 5, Growth 10, Volume 15, Business 20, Enterprise 25 e Enterprise Plus 30.',
    principle2Title: 'Análise Não Limitada à Shortlist',
    principle2Desc: 'A IA pode analisar um conjunto amplo de candidatos; o limite aplica-se apenas aos candidatos apresentados à empresa.',
    principle3Title: 'Qualidade Consistente',
    principle3Desc: 'Todos os planos procuram os candidatos mais compatíveis. Os planos superiores aumentam capacidade, profundidade, personalização e escala.',
    principle4Title: 'Decisão Humana',
    principle4Desc: 'As recomendações são explicáveis e baseadas em evidências relevantes. A decisão final de contratação permanece com a empresa.',
    commercialNote: 'Nota: As vagas ativas são ilimitadas em todos os planos. Os limites de recrutadores, capacidades de IA, avaliações, integrações, suporte e SLA são propostas comerciais e devem ser validados tecnicamente antes de serem anunciados.',
    modalTitle: 'Finalizar Subscrição',
    modalSubtitle: 'Seleciona o método de pagamento e segue os passos indicados:',
    confirmBtn: 'Confirmar Subscrição',
    cancelBtn: 'Cancelar',
    paymentMethods: {
      card: {
        label: 'Cartão de Crédito / Débito',
        steps: [
          '1. Introduz o número do cartão, validade (MM/AA) e código CVV.',
          '2. Confirma o nome do titular e os dados de faturação da empresa.',
          '3. Autoriza a operação no teu banco (3D Secure, se solicitado) e clica em Confirmar Subscrição.'
        ]
      },
      bank_transfer: {
        label: 'Transferências Bancárias',
        steps: [
          '1. Efetua a transferência para o IBAN/NIB indicado na fatura proforma com o valor exato do plano.',
          '2. Coloca o nome da empresa e o código do plano na referência/descrição da transferência.',
          '3. Clica em Confirmar Subscrição para registar o pedido e aguardar a validação bancária.'
        ]
      },
      apple_pay: {
        label: 'Apple Pay',
        steps: [
          '1. Clica em Confirmar Subscrição para abrir a folha de pagamento do Apple Pay.',
          '2. Seleciona o cartão empresarial associado à tua carteira Apple.',
          '3. Autentica com Face ID, Touch ID ou código do dispositivo para concluir.'
        ]
      },
      google_pay: {
        label: 'Google Pay',
        steps: [
          '1. Clica em Confirmar Subscrição para iniciar o pagamento com Google Pay.',
          '2. Escolhe o método de pagamento guardado na tua conta Google.',
          '3. Confirma a autenticação no dispositivo para ativar o plano.'
        ]
      }
    },
    rows: {
      recruiters: 'Recrutadores',
      activeJobs: 'Vagas ativas',
      candidatesPerJob: 'Candidatos apresentados por vaga',
      aiMatching: 'AI Candidate Matching',
      aiRanking: 'AI Candidate Ranking',
      skillsAssessment: 'Skills Assessment',
      skillGapAnalysis: 'SkillGap Analysis',
      candidateEvaluation: 'Candidate Evaluation',
      analyticsReporting: 'Analytics & Reporting',
      recruitmentAutomation: 'Automação de recrutamento',
      departmentManagement: 'Gestão de departamentos',
      talentPoolManagement: 'Talent Pool Management',
      integrations: 'Integrações',
      ssoPermissions: 'SSO & permissões avançadas',
      dedicatedAccountManager: 'Gestor de conta dedicado',
      support: 'Suporte',
      sla: 'SLA'
    }
  },
  es: {
    pill: 'PLANES B2B SKILLGAP',
    title: 'Suscripciones para Empresas',
    subtitle: 'Planes mensuales con IA para identificar, evaluar y recomendar candidatos con alta compatibilidad para cada puesto.',
    perMonth: '/mes',
    currentPlanBadge: 'Plan Activo',
    recommendedBadge: 'Más Popular',
    selectPlan: 'Suscribir Plan',
    currentPlanBtn: 'Plan Actual',
    employeesLabel: 'empleados',
    recruitersLabel: 'reclutadores',
    candidatesPerJobLabel: 'candidatos por puesto',
    activeJobsLabel: 'puestos activos',
    unlimitedLabel: 'Ilimitado',
    comparisonTitle: 'Comparación de Planes',
    comparisonSubtitle: 'Detalle de límites, profundidad de IA, integraciones y soporte.',
    featureCol: 'Funcionalidades',
    included: 'Incluido',
    notIncluded: '—',
    principlesTitle: 'Principios del Producto',
    principle1Title: 'Quality Over Quantity',
    principle1Desc: 'Cada plan limita los candidatos presentados por puesto en incrementos de 5: Starter 5, Growth 10, Volume 15, Business 20, Enterprise 25 y Enterprise Plus 30.',
    principle2Title: 'Análisis Más Allá del Shortlist',
    principle2Desc: 'La IA puede analizar un conjunto amplio de candidatos; el límite aplica solo a los candidatos presentados a la empresa.',
    principle3Title: 'Calidad Consistente',
    principle3Desc: 'Todos los planes buscan los candidatos más compatibles. Los planes superiores amplían capacidad, profundidad, personalización y escala.',
    principle4Title: 'Decisión Humana',
    principle4Desc: 'Las recomendaciones son explicables y basadas en evidencias. La decisión final de contratación corresponde a la empresa.',
    commercialNote: 'Nota: Los puestos activos son ilimitados en todos los planes. Los límites de reclutadores, capacidades de IA, evaluaciones, integraciones, soporte y SLA son propuestas comerciales y deben validarse técnicamente.',
    modalTitle: 'Completar Suscripción',
    modalSubtitle: 'Selecciona el método de pago y sigue los pasos:',
    confirmBtn: 'Confirmar Suscripción',
    cancelBtn: 'Cancelar',
    paymentMethods: {
      card: {
        label: 'Tarjeta de Crédito / Débito',
        steps: [
          '1. Introduce el número de tarjeta, fecha de caducidad (MM/AA) y código CVV.',
          '2. Confirma el nombre del titular y los datos de facturación de la empresa.',
          '3. Autoriza la operación en tu banco (3D Secure si aplica) y pulsa Confirmar Suscripción.'
        ]
      },
      bank_transfer: {
        label: 'Transferencias Bancarias',
        steps: [
          '1. Realiza la transferencia por el importe exacto del plan a la cuenta indicada.',
          '2. Indica el nombre de la empresa y el plan en el concepto de la transferencia.',
          '3. Pulsa Confirmar Suscripción para registrar la solicitud y validar el pago.'
        ]
      },
      apple_pay: {
        label: 'Apple Pay',
        steps: [
          '1. Pulsa Confirmar Suscripción para abrir la ventana de Apple Pay.',
          '2. Selecciona la tarjeta de empresa en tu Apple Wallet.',
          '3. Confirma con Face ID, Touch ID o código del dispositivo.'
        ]
      },
      google_pay: {
        label: 'Google Pay',
        steps: [
          '1. Pulsa Confirmar Suscripción para iniciar Google Pay.',
          '2. Selecciona el método de pago guardado en tu cuenta de Google.',
          '3. Verifica en tu dispositivo para activar el plan.'
        ]
      }
    },
    rows: {
      recruiters: 'Reclutadores',
      activeJobs: 'Puestos activos',
      candidatesPerJob: 'Candidatos presentados por puesto',
      aiMatching: 'AI Candidate Matching',
      aiRanking: 'AI Candidate Ranking',
      skillsAssessment: 'Skills Assessment',
      skillGapAnalysis: 'SkillGap Analysis',
      candidateEvaluation: 'Candidate Evaluation',
      analyticsReporting: 'Analytics & Reporting',
      recruitmentAutomation: 'Automatización de reclutamiento',
      departmentManagement: 'Gestión de departamentos',
      talentPoolManagement: 'Talent Pool Management',
      integrations: 'Integraciones',
      ssoPermissions: 'SSO y permisos avanzados',
      dedicatedAccountManager: 'Gestor de cuenta dedicado',
      support: 'Soporte',
      sla: 'SLA'
    }
  },
  fr: {
    pill: 'OFFRES B2B SKILLGAP',
    title: 'Abonnements Entreprises',
    subtitle: 'Forfaits mensuels propulsés par l’IA pour identifier, évaluer et recommander les candidats les plus adaptés à chaque poste.',
    perMonth: '/mois',
    currentPlanBadge: 'Offre Active',
    recommendedBadge: 'Le Plus Populaire',
    selectPlan: 'Souscrire à l’Offre',
    currentPlanBtn: 'Offre Actuelle',
    employeesLabel: 'employés',
    recruitersLabel: 'recruteurs',
    candidatesPerJobLabel: 'candidats par poste',
    activeJobsLabel: 'postes actifs',
    unlimitedLabel: 'Illimité',
    comparisonTitle: 'Comparaison des Offres',
    comparisonSubtitle: 'Détail des limites, de la profondeur IA, des intégrations et du support.',
    featureCol: 'Fonctionnalités',
    included: 'Inclus',
    notIncluded: '—',
    principlesTitle: 'Principes Produit',
    principle1Title: 'Quality Over Quantity',
    principle1Desc: 'Chaque offre limite les candidats présentés par poste par paliers de 5 : Starter 5, Growth 10, Volume 15, Business 20, Enterprise 25 et Enterprise Plus 30.',
    principle2Title: 'Analyse Au-Delà de la Shortlist',
    principle2Desc: 'L’IA peut analyser un vivier élargi ; la limite s’applique uniquement aux candidats présentés à l’entreprise.',
    principle3Title: 'Qualité Constante',
    principle3Desc: 'Toutes les offres ciblent les meilleurs profils. Les offres supérieures augmentent la capacité, la profondeur et l’échelle.',
    principle4Title: 'Décision Humaine',
    principle4Desc: 'Les recommandations sont explicables et fondées sur des preuves. La décision finale de recrutement revient à l’entreprise.',
    commercialNote: 'Note : Les postes actifs sont illimités dans toutes les offres. Les limites de recruteurs, capacités IA, évaluations, intégrations, support et SLA sont des propositions commerciales à valider techniquement.',
    modalTitle: 'Finaliser l’Abonnement',
    modalSubtitle: 'Choisissez un mode de paiement et suivez les étapes :',
    confirmBtn: 'Confirmer l’Abonnement',
    cancelBtn: 'Annuler',
    paymentMethods: {
      card: {
        label: 'Carte de Crédit / Débit',
        steps: [
          '1. Saisissez le numéro de carte, la date d’expiration (MM/AA) et le cryptogramme CVV.',
          '2. Confirmez le titulaire et les informations de facturation de l’entreprise.',
          '3. Validez auprès de votre banque (3D Secure si requis) puis cliquez sur Confirmer l’Abonnement.'
        ]
      },
      bank_transfer: {
        label: 'Virements Bancaires',
        steps: [
          '1. Effectuez le virement du montant exact vers les coordonnées bancaires indiquées.',
          '2. Indiquez le nom de l’entreprise et l’offre choisie dans le libellé du virement.',
          '3. Cliquez sur Confirmer l’Abonnement pour enregistrer la demande.'
        ]
      },
      apple_pay: {
        label: 'Apple Pay',
        steps: [
          '1. Cliquez sur Confirmer l’Abonnement pour ouvrir Apple Pay.',
          '2. Sélectionnez la carte entreprise enregistrée dans Apple Wallet.',
          '3. Authentifiez-vous avec Face ID, Touch ID ou votre code.'
        ]
      },
      google_pay: {
        label: 'Google Pay',
        steps: [
          '1. Cliquez sur Confirmer l’Abonnement pour lancer Google Pay.',
          '2. Choisissez le moyen de paiement associé à votre compte Google.',
          '3. Confirmez sur votre appareil pour activer l’offre.'
        ]
      }
    },
    rows: {
      recruiters: 'Recruteurs',
      activeJobs: 'Postes actifs',
      candidatesPerJob: 'Candidats présentés par poste',
      aiMatching: 'AI Candidate Matching',
      aiRanking: 'AI Candidate Ranking',
      skillsAssessment: 'Skills Assessment',
      skillGapAnalysis: 'SkillGap Analysis',
      candidateEvaluation: 'Candidate Evaluation',
      analyticsReporting: 'Analytics & Reporting',
      recruitmentAutomation: 'Automatisation du recrutement',
      departmentManagement: 'Gestion des départements',
      talentPoolManagement: 'Talent Pool Management',
      integrations: 'Intégrations',
      ssoPermissions: 'SSO et permissions avancées',
      dedicatedAccountManager: 'Account manager dédié',
      support: 'Support',
      sla: 'SLA'
    }
  },
  de: {
    pill: 'SKILLGAP B2B-TARIFE',
    title: 'Unternehmensabonnements',
    subtitle: 'Monatliche KI-Tarife zur Identifikation, Bewertung und Empfehlung passender Kandidaten für jede Stellenposition.',
    perMonth: '/Monat',
    currentPlanBadge: 'Aktiver Tarif',
    recommendedBadge: 'Beliebteste Wahl',
    selectPlan: 'Tarif Abonnieren',
    currentPlanBtn: 'Aktueller Tarif',
    employeesLabel: 'Mitarbeitende',
    recruitersLabel: 'Recruiter',
    candidatesPerJobLabel: 'Kandidaten pro Stelle',
    activeJobsLabel: 'aktive Stellen',
    unlimitedLabel: 'Unbegrenzt',
    comparisonTitle: 'Tarifvergleich',
    comparisonSubtitle: 'Übersicht über Limits, KI-Tiefe, Integrationen und Support.',
    featureCol: 'Funktionen',
    included: 'Enthalten',
    notIncluded: '—',
    principlesTitle: 'Produktprinzipien',
    principle1Title: 'Quality Over Quantity',
    principle1Desc: 'Jeder Tarif begrenzt die pro Stelle präsentierten Kandidaten in 5er-Schritten: Starter 5, Growth 10, Volume 15, Business 20, Enterprise 25 und Enterprise Plus 30.',
    principle2Title: 'Analyse Über die Shortlist Hinaus',
    principle2Desc: 'Die KI kann einen größeren Kandidatenpool analysieren; das Limit gilt nur für präsentierte Kandidaten.',
    principle3Title: 'Konstante Qualität',
    principle3Desc: 'Alle Tarife suchen nach passenden Kandidaten. Höhere Tarife erweitern Kapazität, Tiefe, Anpassung und Skalierung.',
    principle4Title: 'Menschliche Entscheidung',
    principle4Desc: 'Empfehlungen sind nachvollziehbar und evidenzbasiert. Die finale Einstellungsentscheidung bleibt beim Unternehmen.',
    commercialNote: 'Hinweis: Aktive Stellen sind in allen Tarifen unbegrenzt. Limits für Recruiter, KI-Funktionen, Assessments, Integrationen, Support und SLA sind kommerzielle Vorschläge und technisch zu validieren.',
    modalTitle: 'Abonnement Abschließen',
    modalSubtitle: 'Wählen Sie eine Zahlungsmethode und folgen Sie den Schritten:',
    confirmBtn: 'Abonnement Bestätigen',
    cancelBtn: 'Abbrechen',
    paymentMethods: {
      card: {
        label: 'Kredit- / Debitkarte',
        steps: [
          '1. Geben Sie Kartennummer, Ablaufdatum (MM/JJ) und CVV-Sicherheitscode ein.',
          '2. Bestätigen Sie Karteninhaber und Rechnungsdaten des Unternehmens.',
          '3. Bestätigen Sie die Bankfreigabe (falls erforderlich) und klicken Sie auf Abonnement Bestätigen.'
        ]
      },
      bank_transfer: {
        label: 'Banküberweisungen',
        steps: [
          '1. Überweisen Sie den genauen Tarifbetrag an die angegebene Firmenbankverbindung.',
          '2. Geben Sie Firmennamen und Tarif im Verwendungszweck an.',
          '3. Klicken Sie auf Abonnement Bestätigen, um den Auftrag zu erfassen.'
        ]
      },
      apple_pay: {
        label: 'Apple Pay',
        steps: [
          '1. Klicken Sie auf Abonnement Bestätigen, um Apple Pay zu öffnen.',
          '2. Wählen Sie die Firmenkarte aus Ihrem Apple Wallet.',
          '3. Bestätigen Sie mit Face ID, Touch ID oder Gerätecode.'
        ]
      },
      google_pay: {
        label: 'Google Pay',
        steps: [
          '1. Klicken Sie auf Abonnement Bestätigen, um Google Pay zu starten.',
          '2. Wählen Sie die in Ihrem Google-Konto hinterlegte Zahlungsmethode.',
          '3. Bestätigen Sie auf Ihrem Gerät zur Aktivierung.'
        ]
      }
    },
    rows: {
      recruiters: 'Recruiter',
      activeJobs: 'Aktive Stellenpositionen',
      candidatesPerJob: 'Präsentierte Kandidaten pro Stelle',
      aiMatching: 'AI Candidate Matching',
      aiRanking: 'AI Candidate Ranking',
      skillsAssessment: 'Skills Assessment',
      skillGapAnalysis: 'SkillGap Analysis',
      candidateEvaluation: 'Candidate Evaluation',
      analyticsReporting: 'Analytics & Reporting',
      recruitmentAutomation: 'Recruiting-Automatisierung',
      departmentManagement: 'Abteilungsverwaltung',
      talentPoolManagement: 'Talent Pool Management',
      integrations: 'Integrationen',
      ssoPermissions: 'SSO & erweiterte Berechtigungen',
      dedicatedAccountManager: 'Persönlicher Account Manager',
      support: 'Support',
      sla: 'SLA'
    }
  },
  ar: {
    pill: 'باقات SKILLGAP للأعمال (B2B)',
    title: 'اشتراكات الشركات',
    subtitle: 'خطط شهرية مدعومة بالذكاء الاصطناعي لتحديد وتقييم وترشيح المرشحين الأكثر ملاءمة لكل وظيفة.',
    perMonth: '/شهر',
    currentPlanBadge: 'الباقة النشطة',
    recommendedBadge: 'الأكثر اختياراً',
    selectPlan: 'اشتراك في الباقة',
    currentPlanBtn: 'الباقة الحالية',
    employeesLabel: 'موظف',
    recruitersLabel: 'مسؤولي توظيف',
    candidatesPerJobLabel: 'مرشح لكل وظيفة',
    activeJobsLabel: 'وظيفة نشطة',
    unlimitedLabel: 'غير محدود',
    comparisonTitle: 'مقارنة الباقات',
    comparisonSubtitle: 'تفاصيل الحدود، عمق الذكاء الاصطناعي، التكاملات والدعم.',
    featureCol: 'المزايا',
    included: 'مشمول',
    notIncluded: '—',
    principlesTitle: 'مبادئ المنتج',
    principle1Title: 'الجودة أهم من الكمية',
    principle1Desc: 'تحد كل باقة عدد المرشحين المعروضين لكل وظيفة بمضاعفات 5: Starter 5، Growth 10، Volume 15، Business 20، Enterprise 25، وEnterprise Plus 30.',
    principle2Title: 'تحليل أوسع من القائمة المختصرة',
    principle2Desc: 'يمكن للذكاء الاصطناعي تحليل مجموعة أوسع من المرشحين؛ وينطبق الحد فقط على المرشحين المعروضين للشركة.',
    principle3Title: 'جودة متسقة',
    principle3Desc: 'تبحث جميع الباقات عن المرشحين الأكثر توافقاً، بينما تزيد الباقات الأعلى من السعة والعمق والتخصيص والنطاق.',
    principle4Title: 'القرار البشري',
    principle4Desc: 'التوصيات قابلة للتفسير وتستند إلى أدلة واضحة، ويبقى قرار التوظيف النهائي بيد الشركة.',
    commercialNote: 'ملاحظة: الوظائف النشطة غير محدودة في جميع الباقات. حدود مسؤولي التوظيف، وقدرات الذكاء الاصطناعي، والتقييمات، والتكاملات، والدعم، واتفاقية مستوى الخدمة (SLA) هي مقترحات تجارية ويجب التحقق منها تقنياً.',
    modalTitle: 'إتمام الاشتراك',
    modalSubtitle: 'اختر طريقة الدفع واتبع الخطوات التالية:',
    confirmBtn: 'تأكيد الاشتراك',
    cancelBtn: 'إلغاء',
    paymentMethods: {
      card: {
        label: 'بطاقة ائتمان / خصم',
        steps: [
          '1. أدخل رقم البطاقة وتاريخ الانتهاء (شهر/سنة) ورمز الأمان CVV.',
          '2. أكد اسم حامل البطاقة وبيانات الفوترة الخاصة بالشركة.',
          '3. أكّد العملية لدى البنك (3D Secure إن طُلب) ثم اضغط على تأكيد الاشتراك.'
        ]
      },
      bank_transfer: {
        label: 'التحويلات البنكية',
        steps: [
          '1. حوّل المبلغ المحدد للباقة إلى الحساب البنكي الموضح في الفاتورة.',
          '2. اكتب اسم الشركة واسم الباقة في خانة مرجع/وصف التحويل.',
          '3. اضغط على تأكيد الاشتراك لتسجيل الطلب واستكمال التحقق البنكي.'
        ]
      },
      apple_pay: {
        label: 'Apple Pay',
        steps: [
          '1. اضغط على تأكيد الاشتراك لفتح نافذة Apple Pay.',
          '2. اختر بطاقة الشركة المحفوظة في محفظة Apple.',
          '3. أكّد الهوية عبر Face ID أو Touch ID أو رمز الجهاز لإتمام الدفع.'
        ]
      },
      google_pay: {
        label: 'Google Pay',
        steps: [
          '1. اضغط على تأكيد الاشتراك لبدء الدفع عبر Google Pay.',
          '2. اختر وسيلة الدفع المحفوظة في حساب Google الخاص بك.',
          '3. أكّد العملية على جهازك لتفعيل الباقة.'
        ]
      }
    },
    rows: {
      recruiters: 'مسؤولو التوظيف',
      activeJobs: 'الوظائف النشطة',
      candidatesPerJob: 'المرشحون المعروضون لكل وظيفة',
      aiMatching: 'مطابقة المرشحين بالذكاء الاصطناعي',
      aiRanking: 'ترتيب المرشحين بالذكاء الاصطناعي',
      skillsAssessment: 'تقييم المهارات',
      skillGapAnalysis: 'تحليل فجوة المهارات (SkillGap Analysis)',
      candidateEvaluation: 'تقييم المرشح',
      analyticsReporting: 'التحليلات والتقارير',
      recruitmentAutomation: 'أتمتة التوظيف',
      departmentManagement: 'إدارة الأقسام',
      talentPoolManagement: 'إدارة قاعدة المواهب',
      integrations: 'التكاملات',
      ssoPermissions: 'تسجيل الدخول الموحد (SSO) والصلاحيات المتقدمة',
      dedicatedAccountManager: 'مدير حساب مخصص',
      support: 'الدعم',
      sla: 'اتفاقية مستوى الخدمة (SLA)'
    }
  }
};

function translateLevel(value: string, lang: LangCode): string {
  const map = LEVEL_TRANSLATIONS[value];
  return map ? map[lang] || value : value;
}

export default function BusinessSubscriptionPage() {
  const { lang, refreshSubscription } = useBusinessDashboardLang();
  const [currency, setCurrency] = useState<CurrencyCode>('EUR');
  const [activePlanId, setActivePlanId] = useState<string>('starter');
  const [pendingPlan, setPendingPlan] = useState<B2BPlanConfig | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('card');
  const [saving, setSaving] = useState(false);

  const ui = SUBSCRIPTION_UI[lang] || SUBSCRIPTION_UI.en;
  const isRtl = lang === 'ar';

  useEffect(() => {
    fetchActiveCompanySubscription().then((sub) => {
      setActivePlanId(sub.plan.id);
      setCurrency(sub.currency);
    });
  }, []);

  const handleConfirmSubscription = async () => {
    if (!pendingPlan) return;
    setSaving(true);
    try {
      if (supabase) {
        await supabase.from('company_subscriptions').upsert({
          plan_id: pendingPlan.id,
          currency,
          payment_method: paymentMethod,
          status: 'active',
          updated_at: new Date().toISOString()
        });
      }
      setActivePlanId(pendingPlan.id);
      await refreshSubscription();
      setPendingPlan(null);
    } finally {
      setSaving(false);
    }
  };

  const comparisonRows = useMemo(
    () => [
      { label: ui.rows.recruiters, values: B2B_PLANS.map((p) => `${p.recruitersLimit} ${ui.recruitersLabel}`) },
      { label: ui.rows.activeJobs, values: B2B_PLANS.map(() => ui.unlimitedLabel) },
      {
        label: ui.rows.candidatesPerJob,
        values: B2B_PLANS.map((p) => `${p.candidatesPerJob} ${ui.candidatesPerJobLabel}`)
      },
      { label: ui.rows.aiMatching, values: B2B_PLANS.map((p) => translateLevel(p.aiMatching, lang)) },
      { label: ui.rows.aiRanking, values: B2B_PLANS.map((p) => translateLevel(p.aiRanking, lang)) },
      { label: ui.rows.skillsAssessment, values: B2B_PLANS.map((p) => translateLevel(p.skillsAssessment, lang)) },
      { label: ui.rows.skillGapAnalysis, values: B2B_PLANS.map((p) => translateLevel(p.skillGapAnalysis, lang)) },
      { label: ui.rows.candidateEvaluation, values: B2B_PLANS.map((p) => translateLevel(p.candidateEvaluation, lang)) },
      { label: ui.rows.analyticsReporting, values: B2B_PLANS.map((p) => translateLevel(p.analyticsReporting, lang)) },
      {
        label: ui.rows.recruitmentAutomation,
        values: B2B_PLANS.map((p) => translateLevel(p.recruitmentAutomation, lang))
      },
      {
        label: ui.rows.departmentManagement,
        values: B2B_PLANS.map((p) => translateLevel(p.departmentManagement, lang))
      },
      {
        label: ui.rows.talentPoolManagement,
        values: B2B_PLANS.map((p) => translateLevel(p.talentPoolManagement, lang))
      },
      { label: ui.rows.integrations, values: B2B_PLANS.map((p) => translateLevel(p.integrations, lang)) },
      { label: ui.rows.ssoPermissions, values: B2B_PLANS.map((p) => (p.ssoPermissions ? ui.included : ui.notIncluded)) },
      {
        label: ui.rows.dedicatedAccountManager,
        values: B2B_PLANS.map((p) => translateLevel(p.dedicatedAccountManager, lang))
      },
      { label: ui.rows.support, values: B2B_PLANS.map((p) => translateLevel(p.support, lang)) },
      { label: ui.rows.sla, values: B2B_PLANS.map((p) => translateLevel(p.sla, lang)) }
    ],
    [ui, lang]
  );

  const methodIcons: Record<PaymentMethodId, React.ComponentType<{ className?: string }>> = {
    card: CreditCard,
    bank_transfer: Landmark,
    apple_pay: Smartphone,
    google_pay: Wallet
  };

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1a0d33] border border-purple-500/35 text-[10px] font-semibold tracking-widest text-purple-300 uppercase mb-3">
            <Sparkles className="w-3 h-3 text-purple-400" />
            <span>{ui.pill}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white">{ui.title}</h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mt-2 leading-relaxed">{ui.subtitle}</p>
        </div>

        <div className="inline-flex items-center rounded-xl bg-[#0c0618] border border-purple-500/30 p-1 shrink-0">
          {(['EUR', 'USD'] as CurrencyCode[]).map((curr) => {
            const active = currency === curr;
            return (
              <button
                key={curr}
                type="button"
                onClick={() => setCurrency(curr)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  active ? 'bg-[#6d28d9] text-white shadow-sm' : 'text-gray-400 hover:text-white'
                }`}
              >
                {curr}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {B2B_PLANS.map((plan) => {
          const isCurrent = activePlanId === plan.id;

          return (
            <div
              key={plan.id}
              className={`rounded-2xl p-6 flex flex-col justify-between transition border ${
                isCurrent
                  ? 'bg-[#120924] border-purple-400 shadow-[0_0_40px_-12px_rgba(147,83,255,0.45)]'
                  : plan.recommended
                  ? 'bg-[#0e071c] border-purple-500/45 hover:border-purple-400/70'
                  : 'bg-[#0a0514] border-white/[0.08] hover:border-purple-500/35'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-xs font-extrabold tracking-widest text-purple-300 uppercase">
                    {plan.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {plan.recommended && (
                      <span className="px-2.5 py-0.5 rounded-full bg-purple-950/80 border border-purple-500/35 text-[10px] font-semibold text-purple-200">
                        {ui.recommendedBadge}
                      </span>
                    )}
                    {isCurrent && (
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/35 text-[10px] font-semibold text-emerald-300">
                        {ui.currentPlanBadge}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5 mb-5">
                  <span className="text-3xl font-extrabold text-white">
                    {formatPlanPrice(plan.price, currency)}
                  </span>
                  <span className="text-xs text-gray-400">{ui.perMonth}</span>
                </div>

                <div className="space-y-2.5 text-xs text-gray-300 border-t border-white/[0.06] pt-4">
                  <div className="flex items-center gap-2.5">
                    <Users className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>
                      <strong className="text-white">{plan.companySize}</strong> {ui.employeesLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>
                      <strong className="text-white">{plan.recruitersLimit}</strong> {ui.recruitersLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Briefcase className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>
                      <strong className="text-white">{plan.candidatesPerJob}</strong> {ui.candidatesPerJobLabel}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Layers className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>
                      <strong className="text-white">{ui.unlimitedLabel}</strong> {ui.activeJobsLabel}
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                disabled={isCurrent}
                onClick={() => setPendingPlan(plan)}
                className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition ${
                  isCurrent
                    ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 cursor-default'
                    : 'bg-[#6d28d9] hover:bg-[#7c3aed] text-white cursor-pointer'
                }`}
              >
                {isCurrent ? ui.currentPlanBtn : ui.selectPlan}
              </button>
            </div>
          );
        })}
      </div>

      <div className="rounded-2xl bg-[#080410] border border-white/[0.08] overflow-hidden">
        <div className="p-6 border-b border-white/[0.06]">
          <h2 className="text-lg font-bold text-white">{ui.comparisonTitle}</h2>
          <p className="text-xs text-gray-400 mt-1">{ui.comparisonSubtitle}</p>
        </div>

        <div className="overflow-x-auto">
          <table className={`w-full ${isRtl ? 'text-right' : 'text-left'} border-collapse text-xs`}>
            <thead>
              <tr className="bg-[#0d0718] border-b border-white/[0.06] text-gray-300">
                <th
                  className={`py-3.5 px-4 font-semibold sticky ${
                    isRtl ? 'right-0' : 'left-0'
                  } bg-[#0d0718] z-10 min-w-[210px]`}
                >
                  {ui.featureCol}
                </th>
                {B2B_PLANS.map((plan) => (
                  <th key={plan.id} className="py-3.5 px-4 font-bold text-white min-w-[140px]">
                    <div className="text-xs font-extrabold text-purple-300">{plan.name}</div>
                    <div className="text-[11px] font-medium text-gray-400 mt-0.5">
                      {formatPlanPrice(plan.price, currency)}
                      {ui.perMonth}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {comparisonRows.map((row) => (
                <tr key={row.label} className="hover:bg-white/[0.02]">
                  <td
                    className={`py-3 px-4 font-medium text-gray-200 sticky ${
                      isRtl ? 'right-0' : 'left-0'
                    } bg-[#080410] z-10`}
                  >
                    {row.label}
                  </td>
                  {row.values.map((val, idx) => (
                    <td key={`${row.label}-${B2B_PLANS[idx].id}`} className="py-3 px-4 text-gray-300">
                      {val}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="rounded-2xl bg-[#080410] border border-white/[0.08] p-6 space-y-5">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-purple-400" />
          <h2 className="text-base font-bold text-white">{ui.principlesTitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl bg-[#0c0618] border border-white/[0.06] p-4 space-y-1">
            <p className="font-bold text-white">{ui.principle1Title}</p>
            <p className="text-gray-400 leading-relaxed">{ui.principle1Desc}</p>
          </div>
          <div className="rounded-xl bg-[#0c0618] border border-white/[0.06] p-4 space-y-1">
            <p className="font-bold text-white">{ui.principle2Title}</p>
            <p className="text-gray-400 leading-relaxed">{ui.principle2Desc}</p>
          </div>
          <div className="rounded-xl bg-[#0c0618] border border-white/[0.06] p-4 space-y-1">
            <p className="font-bold text-white">{ui.principle3Title}</p>
            <p className="text-gray-400 leading-relaxed">{ui.principle3Desc}</p>
          </div>
          <div className="rounded-xl bg-[#0c0618] border border-white/[0.06] p-4 space-y-1">
            <p className="font-bold text-white">{ui.principle4Title}</p>
            <p className="text-gray-400 leading-relaxed">{ui.principle4Desc}</p>
          </div>
        </div>

        <p className="text-[11px] text-gray-500 border-t border-white/[0.06] pt-4 leading-relaxed">
          {ui.commercialNote}
        </p>
      </div>

      {pendingPlan && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-2xl bg-[#0c0716] border border-purple-500/35 p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">{ui.modalTitle}</h3>
                <p className="text-xs text-gray-400 mt-1">
                  <strong className="text-purple-300">{pendingPlan.name}</strong> —{' '}
                  <strong className="text-white">{formatPlanPrice(pendingPlan.price, currency)}</strong>
                  {ui.perMonth}
                </p>
                <p className="text-xs text-gray-400 mt-2">{ui.modalSubtitle}</p>
              </div>
              <button
                type="button"
                onClick={() => setPendingPlan(null)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(Object.keys(ui.paymentMethods) as PaymentMethodId[]).map((mKey) => {
                const Icon = methodIcons[mKey];
                const selected = paymentMethod === mKey;
                return (
                  <button
                    key={mKey}
                    type="button"
                    onClick={() => setPaymentMethod(mKey)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      selected
                        ? 'bg-[#1a0d33] border-purple-400 text-white'
                        : 'bg-[#080410] border-white/[0.08] text-gray-300 hover:border-purple-500/40'
                    }`}
                  >
                    <Icon className="w-4 h-4 text-purple-400 shrink-0" />
                    <span className="truncate">{ui.paymentMethods[mKey].label}</span>
                  </button>
                );
              })}
            </div>

            <div className="rounded-xl bg-[#080410] border border-purple-500/25 p-4 space-y-2 text-xs text-gray-200">
              <p className="font-bold text-purple-300">{ui.paymentMethods[paymentMethod].label}</p>
              <ul className="space-y-1.5 text-gray-300 leading-relaxed">
                {ui.paymentMethods[paymentMethod].steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setPendingPlan(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 cursor-pointer"
              >
                {ui.cancelBtn}
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={handleConfirmSubscription}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6d28d9] hover:bg-[#7c3aed] disabled:opacity-50 text-xs font-bold text-white cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>{ui.confirmBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}