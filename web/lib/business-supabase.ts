'use client';

import { createClient } from '@supabase/supabase-js';

export type LangCode = 'en' | 'pt' | 'es' | 'fr' | 'de' | 'ar';
export type CurrencyCode = 'EUR' | 'USD';
export type ActiveJobsLimit = number | 'unlimited';

export interface B2BPlanConfig {
  id: 'starter' | 'growth' | 'volume' | 'business' | 'enterprise' | 'enterprise-plus';
  name: string;
  price: number; // Mesmo preço independentemente da moeda (sem câmbio)
  companySize: string;
  recruitersLimit: number;
  activeJobsLimit: ActiveJobsLimit;
  candidatesPerJob: number;
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
  ssoPermissions: boolean;
  dedicatedAccountManager: string;
  support: string;
  sla: string;
  recommended?: boolean;
}

export const B2B_PLANS: B2BPlanConfig[] = [
  {
    id: 'starter',
    name: 'STARTER',
    price: 299,
    companySize: '1-10',
    recruitersLimit: 2,
    activeJobsLimit: 'unlimited',
    candidatesPerJob: 5,
    aiMatching: 'Básico',
    aiRanking: 'Básico',
    skillsAssessment: 'Básico',
    skillGapAnalysis: 'Básico',
    candidateEvaluation: 'Básica',
    analyticsReporting: 'Básico',
    recruitmentAutomation: 'Básica',
    departmentManagement: '—',
    talentPoolManagement: '—',
    integrations: '-',
    ssoPermissions: false,
    dedicatedAccountManager: '—',
    support: 'Email',
    sla: '—'
  },
  {
    id: 'growth',
    name: 'GROWTH',
    price: 799,
    companySize: '11-50',
    recruitersLimit: 5,
    activeJobsLimit: 'unlimited',
    candidatesPerJob: 10,
    aiMatching: 'Avançado',
    aiRanking: 'Avançado',
    skillsAssessment: 'Avançado',
    skillGapAnalysis: 'Avançado',
    candidateEvaluation: 'Avançada',
    analyticsReporting: 'Avançado',
    recruitmentAutomation: 'Básica',
    departmentManagement: '—',
    talentPoolManagement: '—',
    integrations: '—',
    ssoPermissions: false,
    dedicatedAccountManager: '—',
    support: 'Prioritário',
    sla: '—'
  },
  {
    id: 'volume',
    name: 'VOLUME',
    price: 1999,
    companySize: '51-200',
    recruitersLimit: 15,
    activeJobsLimit: 'unlimited',
    candidatesPerJob: 15,
    aiMatching: 'Avançado',
    aiRanking: 'Avançado',
    skillsAssessment: 'Aprofundado',
    skillGapAnalysis: 'Avançado',
    candidateEvaluation: 'Aprofundada',
    analyticsReporting: 'Avançado',
    recruitmentAutomation: 'Avançada',
    departmentManagement: 'Múltiplos',
    talentPoolManagement: 'Incluído',
    integrations: 'Básicas',
    ssoPermissions: false,
    dedicatedAccountManager: '—',
    support: 'Prioritário',
    sla: '—'
  },
  {
    id: 'business',
    name: 'BUSINESS',
    price: 3999,
    recommended: true,
    companySize: '201-500',
    recruitersLimit: 30,
    activeJobsLimit: 'unlimited',
    candidatesPerJob: 20,
    aiMatching: 'Avançado',
    aiRanking: 'Avançado',
    skillsAssessment: 'Aprofundado',
    skillGapAnalysis: 'Avançado',
    candidateEvaluation: 'Aprofundada',
    analyticsReporting: 'Avançado',
    recruitmentAutomation: 'Avançada',
    departmentManagement: 'Avançada',
    talentPoolManagement: 'Avançado',
    integrations: 'Avançadas',
    ssoPermissions: false,
    dedicatedAccountManager: 'Incluído',
    support: 'Dedicado',
    sla: '—'
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE',
    price: 6999,
    companySize: '501-1.000',
    recruitersLimit: 60,
    activeJobsLimit: 'unlimited',
    candidatesPerJob: 25,
    aiMatching: 'Personalizado',
    aiRanking: 'Enterprise',
    skillsAssessment: 'Avançado',
    skillGapAnalysis: 'Preditivo',
    candidateEvaluation: 'Enterprise',
    analyticsReporting: 'Executivo',
    recruitmentAutomation: 'Avançada',
    departmentManagement: 'Avançada',
    talentPoolManagement: 'Global',
    integrations: 'API',
    ssoPermissions: true,
    dedicatedAccountManager: 'Dedicado',
    support: 'Enterprise',
    sla: '99,9%'
  },
  {
    id: 'enterprise-plus',
    name: 'ENTERPRISE PLUS',
    price: 9999,
    companySize: '1.001-5.000',
    recruitersLimit: 100,
    activeJobsLimit: 'unlimited',
    candidatesPerJob: 30,
    aiMatching: 'Personalizado',
    aiRanking: 'Strategic',
    skillsAssessment: 'Personalizado',
    skillGapAnalysis: 'Estratégico',
    candidateEvaluation: 'Personalizada',
    analyticsReporting: 'Personalizado',
    recruitmentAutomation: 'Personalizada',
    departmentManagement: 'Multinacional',
    talentPoolManagement: 'Global avançado',
    integrations: 'API personalizada',
    ssoPermissions: true,
    dedicatedAccountManager: 'Estratégico',
    support: '24/7',
    sla: 'Personalizado'
  }
];

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export function getPlanById(planId?: string | null): B2BPlanConfig {
  return B2B_PLANS.find((p) => p.id === planId) || B2B_PLANS[0];
}

export function formatPlanPrice(price: number, currency: CurrencyCode): string {
  const symbol = currency === 'USD' ? '$' : '€';
  return `${symbol}${price.toLocaleString('en-US')}`;
}

export async function fetchActiveCompanySubscription(companyId?: string): Promise<{
  plan: B2BPlanConfig;
  currency: CurrencyCode;
  status: string;
}> {
  if (!supabase) {
    return { plan: B2B_PLANS[0], currency: 'EUR', status: 'active' };
  }

  const query = supabase
    .from('company_subscriptions')
    .select('plan_id, currency, status')
    .order('updated_at', { ascending: false })
    .limit(1);

  const { data } = companyId ? await query.eq('company_id', companyId) : await query;
  const row = data?.[0];

  return {
    plan: getPlanById(row?.plan_id),
    currency: row?.currency === 'USD' ? 'USD' : 'EUR',
    status: row?.status || 'active'
  };
}